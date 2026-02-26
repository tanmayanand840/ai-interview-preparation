import fetch from "node-fetch";
import Attempt from "../models/Attempt.js";

// 🔹 Generate Question (Short + Clean)
export const generateQuestion = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ message: "Topic is required" });
    }

    const prompt = `
You are a professional technical interviewer.

Generate ONE ${difficulty || "medium"} level interview question about "${topic}".

Rules:
- Maximum 25 words
- Single sentence only
- No formatting
- No bold or markdown
- No explanation
- Return only the question text
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "ai-interview-platform"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You generate short, clear technical interview questions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 60
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    let question = data.choices?.[0]?.message?.content?.trim() || "";

    // Clean formatting
    question = question
      .replace(/\*\*/g, "")
      .replace(/[`#]/g, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    res.json({ question });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate question", error: error.message });
  }
};


// 🔹 Evaluate Answer (Readable ~50 Words)
export const evaluateAnswer = async (req, res) => {
  try {
    const { topic, question, answer } = req.body;

    if (!topic || !question || !answer) {
      return res.status(400).json({ message: "Topic, question, and answer are required" });
    }

    const prompt = `
You are a technical interviewer.

Topic: ${topic}
Question: ${question}
Candidate Answer: ${answer}

Provide a clear evaluation in about 50 words.

Format exactly like this:

Score: X/10

Strengths:
- short point
- short point

Weaknesses:
- short point
- short point

Improvement:
- one short suggestion

Rules:
- Around 50 words total
- Keep it simple and readable
- Avoid long explanations
- No extra commentary
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "ai-interview-platform"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You give concise, readable interview feedback." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 120
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    let evaluation = data.choices?.[0]?.message?.content?.trim() || "";

    // Clean formatting
    evaluation = evaluation
      .replace(/\*\*/g, "")
      .replace(/```/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Extract numeric score
    const scoreMatch = evaluation.match(/(\d+)\s*\/\s*10/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Save attempt
    await Attempt.create({
      userId: req.user._id,
      topic: topic.trim(),
      question,
      answer,
      score,
      feedback: evaluation
    });

    res.json({ evaluation, score });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to evaluate answer", error: error.message });
  }
};
// 🔹 Get Interview History
export const getHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("topic question score createdAt");

    res.json(attempts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

