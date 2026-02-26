import fetch from "node-fetch";
import InterviewSession from "../models/InterviewSession.js";

const MAX_QUESTIONS = 5;

/* =========================================
   🔹 Generate Question
========================================= */
const generateQuestion = async (topic, difficulty, context = "") => {
  const prompt = `
You are conducting an adaptive technical interview.

Topic: ${topic}
Difficulty: ${difficulty}

${context}

Generate ONE interview question.
- Maximum 25 words
- Single sentence only
- No formatting
- No explanation
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "You are a strict interviewer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 60
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
};

/* =========================================
   🔹 Evaluate Answer
========================================= */
const evaluateAnswer = async (topic, question, answer) => {
  const prompt = `
Evaluate this answer briefly (around 60 words).

Topic: ${topic}
Question: ${question}
Answer: ${answer}

Return format:

Score: X/10
Feedback: short paragraph
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "You evaluate interview answers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 200
    })
  });

  const data = await response.json();
  let evaluation = data.choices?.[0]?.message?.content?.trim() || "";

  // 🔥 Clean markdown
  evaluation = evaluation.replace(/\*\*/g, "").replace(/```/g, "").trim();

  const scoreMatch = evaluation.match(/(\d+)\s*\/\s*10/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

  return { score, evaluation };
};

/* =========================================
   🔹 Generate Final Summary
========================================= */
const generateFinalSummary = async (session) => {
  const qaText = session.questions.map((q, index) => {
    return `
Question ${index + 1}: ${q.question}
Score: ${q.score}/10
`;
  }).join("\n");

  const prompt = `
You are a senior technical interviewer.

Interview Topic: ${session.topic}

Candidate Performance:

${qaText}

Write a professional final evaluation (100-120 words).
Include:
- Strengths
- Weaknesses
- Technical depth
- Communication clarity
- Final recommendation
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "You generate professional interview summaries." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 300
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
};

/* =========================================
   🔹 Start Adaptive Interview
========================================= */
export const startAdaptiveInterview = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    const session = await InterviewSession.create({
      userId: req.user._id,
      topic,
      difficulty: difficulty || "medium"
    });

    const question = await generateQuestion(topic, session.difficulty);

    session.currentQuestion = question;
    await session.save();

    return res.json({
      sessionId: session._id,
      question
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to start interview" });
  }
};

/* =========================================
   🔹 Submit Adaptive Answer
========================================= */
export const submitAdaptiveAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session || session.isCompleted) {
      return res.status(400).json({ message: "Invalid or completed session" });
    }

    const question = session.currentQuestion;

    const { score, evaluation } = await evaluateAnswer(
      session.topic,
      question,
      answer
    );

    session.totalScore += score;
    session.questionCount += 1;

    // 🔥 Store full Q/A history
    session.questions.push({
      question,
      answer,
      score,
      feedback: evaluation
    });

    // 🔹 Adjust difficulty
    if (score >= 8) {
      if (session.difficulty === "easy") session.difficulty = "medium";
      else if (session.difficulty === "medium") session.difficulty = "hard";
    } else if (score <= 5) {
      if (session.difficulty === "hard") session.difficulty = "medium";
      else if (session.difficulty === "medium") session.difficulty = "easy";
    }

    // 🔥 If interview completed
    if (session.questionCount >= MAX_QUESTIONS) {
      session.isCompleted = true;
      await session.save();

      const finalScore = (session.totalScore / MAX_QUESTIONS).toFixed(2);

      const summary = await generateFinalSummary(session);

      return res.json({
        completed: true,
        finalScore,
        summary,
        breakdown: session.questions
      });
    }

    // 🔹 Generate next question
    const nextQuestion = await generateQuestion(
      session.topic,
      session.difficulty,
      `Previous score was ${score}/10.`
    );

    session.currentQuestion = nextQuestion;
    await session.save();

    return res.json({
      completed: false,
      score,
      evaluation,
      nextQuestion
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to process answer" });
  }
};