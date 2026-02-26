import fetch from "node-fetch";
import Problem from "../models/Problem.js";
import UserProgress from "../models/Progress.js";

const getModel = () =>
  process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct";

// ===============================
// 1️⃣ Admin - Add Problem
// ===============================
export async function addProblem(req, res) {
  try {
    const { title, topic, difficulty, link, order } = req.body;

    // Basic validation
    if (!title || !topic || !difficulty || !link) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payload = {
      title,
      topic,
      difficulty,
      link,
    };

    if (typeof order === "number") {
      payload.order = order;
    }

    const problem = await Problem.create(payload);

    res.status(201).json(problem);
  } catch (error) {
    console.error("Add Problem Error:", error);
    res.status(500).json({ message: "Error adding problem" });
  }
}

// ===============================
// 2️⃣ Get Problems by Topic
// ===============================
export async function getProblemsByTopic(req, res) {
  try {
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const problems = await Problem.find({ topic }).sort({ order: 1 });

    res.json(problems);
  } catch (error) {
    console.error("Fetch Problems Error:", error);
    res.status(500).json({ message: "Error fetching problems" });
  }
}

// ===============================
// 3️⃣ Update User Progress
// ===============================
export async function updateUserProgress(req, res) {
  try {
    const { problemId, status } = req.body;

    const allowedStatus = ["NotStarted", "Attempted", "Solved"];

    if (!problemId || !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, problemId }, // 🔥 FIXED (_id instead of id)
      { status },
      { upsert: true, new: true },
    );

    res.json(progress);
  } catch (error) {
    console.error("Update Progress Error:", error);
    res.status(500).json({ message: "Error updating progress" });
  }
}

// ===============================
// 4️⃣ Get Topic-wise Progress Summary
// ===============================
export async function getProgressSummary(req, res) {
  try {
    const userId = req.user._id; // 🔥 FIXED (_id)

    const problems = await Problem.find();
    const progress = await UserProgress.find({ userId });

    const summary = {};

    // Create problem lookup map (optimized)
    const problemMap = {};
    problems.forEach((p) => {
      problemMap[p._id.toString()] = p;
    });

    // Count total problems per topic
    problems.forEach((problem) => {
      if (!summary[problem.topic]) {
        summary[problem.topic] = {
          total: 0,
          solved: 0,
        };
      }
      summary[problem.topic].total++;
    });

    // Count solved problems
    progress.forEach((p) => {
      if (p.status === "Solved") {
        const problem = problemMap[p.problemId.toString()];
        if (problem) {
          summary[problem.topic].solved++;
        }
      }
    });

    // Calculate percentage
    Object.keys(summary).forEach((topic) => {
      const { total, solved } = summary[topic];
      summary[topic].percentage =
        total === 0 ? 0 : Math.round((solved / total) * 100);
    });

    res.json(summary);
  } catch (error) {
    console.error("Progress Summary Error:", error);
    res.status(500).json({ message: "Error fetching summary" });
  }
}

// ===============================
// 5️⃣ AI - Generate Coding Problem
// ===============================
export async function generateAICodingProblem(req, res) {
  try {
    const { topic, difficulty, language } = req.body;

    if (!topic || !difficulty) {
      return res
        .status(400)
        .json({ message: "Topic and difficulty are required" });
    }

    const prompt = `You are a senior Data Structures and Algorithms interviewer.

Your job is to generate ONE high-quality coding problem.

Rules:
- The problem must be original and not copied verbatim from any website.
- It must be clear, interview-ready, and solvable.
- The difficulty must strictly match the requested difficulty.
- The topic must strictly match the requested topic.
- Provide structured JSON output only.
- Do NOT include explanations outside JSON.
- Do NOT include markdown formatting.

Requested topic: ${topic}
Requested difficulty: ${difficulty}
Candidate language for implementation: ${language || "cpp"}

Return JSON with exactly this structure:
{
  "title": "short problem title",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "language": "${language || "cpp"}",
  "description": "full problem statement in plain text",
  "constraints": ["constraint 1", "constraint 2"],
  "examples": [
    { "input": "...", "output": "...", "explanation": "..." }
  ],
  "function_signature": "language-agnostic function description (e.g., input and output)",
  "boilerplate_code": "starter code for the function implementation in the chosen language, without extra comments"
}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "ai-interview-platform",
        },
        body: JSON.stringify({
          model: getModel(),
          messages: [
            {
              role: "system",
              content:
                "You generate original DSA coding problems and respond with strict JSON only.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("AI problem JSON parse error:", err);
      parsed = { raw: content };
    }

    res.json(parsed);
  } catch (error) {
    console.error("AI Generate Problem Error:", error);
    res
      .status(500)
      .json({ message: "Failed to generate AI problem", error: error.message });
  }
}

// ===============================
// 6️⃣ AI - Evaluate Coding Solution
// ===============================
export async function evaluateAICodingSolution(req, res) {
  try {
    const { topic, difficulty, problem, language, code } = req.body;

    if (!problem || !code) {
      return res
        .status(400)
        .json({ message: "Problem description and code are required" });
    }

    const prompt = `You are a senior DSA interviewer.

You are given a coding problem and a candidate's solution.

Problem (JSON):
${JSON.stringify(problem, null, 2)}

Candidate's solution:
Language: ${language || "not specified"}
Code:
"""
${code}
"""

Your tasks:
1. Judge whether the solution is correct and handles edge cases.
2. Analyze the time complexity and space complexity in Big-O notation.
3. Point out any bugs, inefficiencies, or missing edge cases.
4. Suggest a better or more optimized approach if possible.
5. Provide a sample implementation of the optimal function in the candidate's language if possible.

Return STRICT JSON only, with this shape:
{
  "verdict": "Accepted" | "Partially Correct" | "Incorrect",
  "score": 0-10,
  "time_complexity": "O(...)",
  "space_complexity": "O(...)",
  "explanation": "short paragraph explaining your judgement",
  "issues": ["issue 1", "issue 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "better_approach": "text description of a cleaner or more optimal solution",
  "reference_implementation": "code block of the recommended function implementation in the chosen language"
}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "ai-interview-platform",
        },
        body: JSON.stringify({
          model: getModel(),
          messages: [
            {
              role: "system",
              content:
                "You evaluate DSA coding solutions and respond with strict JSON only.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("AI evaluation JSON parse error:", err);
      parsed = { raw: content };
    }

    res.json(parsed);
  } catch (error) {
    console.error("AI Evaluate Solution Error:", error);
    res.status(500).json({
      message: "Failed to evaluate solution",
      error: error.message,
    });
  }
}
