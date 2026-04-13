import { PDFParse } from "pdf-parse";
import Attempt from "../models/Attempt.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";

const getModel = () =>
  process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct";

const extractPdfTextFromBuffer = async (buffer) => {
  const parser = new PDFParse({ data: buffer });

  try {
    const parsed = await parser.getText();
    return parsed.text || "";
  } finally {
    if (typeof parser.destroy === "function") {
      await parser.destroy();
    }
  }
};

const uploadPdfDocument = async (file, documentType) => {
  const baseName = file.originalname
    ? file.originalname.replace(/\.[^/.]+$/, "")
    : documentType;
  const publicId = `${documentType}-${Date.now()}-${baseName.replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  )}`;

  return uploadBufferToCloudinary(file.buffer, {
    folder: `ai-interview-platform/${documentType}`,
    publicId,
  });
};

const parseAndUploadPdf = async (file, documentType) => {
  const parsedText = await extractPdfTextFromBuffer(file.buffer);
  const uploadedDocument = await uploadPdfDocument(file, documentType);

  return {
    text: parsedText,
    uploadedDocument,
  };
};

async function analyzeResumeAndJD(resumeText, jobDescription) {
  const prompt = `You are a senior technical interviewer and career coach.

Candidate resume:
"""
${resumeText}
"""

Target job description:
"""
${jobDescription}
"""

1. Briefly summarize the candidate's current profile in 2-3 short sentences.
2. Compare the resume against the job description and identify the main skill gaps.
3. Recommend 5-10 concrete technical topics or problem areas (especially DSA / system design / core CS) the candidate should practice next.
4. Estimate an ATS-style compatibility score between 0 and 100, where 0 means very poor match and 100 means an almost perfect match.

Return a JSON object with this exact structure (no extra text, no markdown):
{
  "summary": "short overview",
  "skill_gaps": ["gap 1", "gap 2", "gap 3"],
  "recommended_topics": ["topic 1", "topic 2", "topic 3"],
  "suggestions": ["short tip 1", "short tip 2", "short tip 3"],
  "ats_score": 0
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
              "You analyze resumes vs job descriptions and output clean JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 350,
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
    console.error("Resume analysis JSON parse error:", err);
    parsed = { raw: content };
  }

  return parsed;
}

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
                "You generate short, clear technical interview questions.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 60,
        }),
      },
    );

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
    res
      .status(500)
      .json({ message: "Failed to generate question", error: error.message });
  }
};

// 🔹 Evaluate Answer (Readable ~50 Words)
export const evaluateAnswer = async (req, res) => {
  try {
    const { topic, question, answer } = req.body;

    if (!topic || !question || !answer) {
      return res
        .status(400)
        .json({ message: "Topic, question, and answer are required" });
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
              content: "You give concise, readable interview feedback.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 120,
        }),
      },
    );

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
      feedback: evaluation,
    });

    res.json({ evaluation, score });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to evaluate answer", error: error.message });
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
// 🔹 Analyze Resume + Job Description (text body)
export const analyzeResumeJD = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res
        .status(400)
        .json({ message: "Resume and job description are required" });
    }

    const parsed = await analyzeResumeAndJD(resumeText, jobDescription);
    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to analyze resume and job description",
      error: error.message,
    });
  }
};

// 🔹 Analyze Resume + Job Description (PDF upload)
export const analyzeResumeJDFromUpload = async (req, res) => {
  try {
    const resumeFile = req.files?.resumePdf?.[0];
    const jdFile = req.files?.jdPdf?.[0];

    if (!resumeFile && !jdFile) {
      return res
        .status(400)
        .json({ message: "Please upload at least one PDF file" });
    }

    let resumeText = req.body.resumeText || "";
    let jobDescription = req.body.jobDescription || "";
    const uploadedDocuments = [];

    if (resumeFile) {
      const { text: parsedText, uploadedDocument } = await parseAndUploadPdf(
        resumeFile,
        "resume",
      );

      uploadedDocuments.push({
        type: "resume",
        url: uploadedDocument.secure_url,
        publicId: uploadedDocument.public_id,
      });

      resumeText = `${resumeText}\n\n${parsedText}`.trim();
    }

    if (jdFile) {
      const { text: parsedText, uploadedDocument } = await parseAndUploadPdf(
        jdFile,
        "job-description",
      );

      uploadedDocuments.push({
        type: "job-description",
        url: uploadedDocument.secure_url,
        publicId: uploadedDocument.public_id,
      });

      jobDescription = `${jobDescription}\n\n${parsedText}`.trim();
    }

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message:
          "Could not extract enough text from the uploaded files. Please check the PDFs or add some text.",
      });
    }

    const parsedResult = await analyzeResumeAndJD(resumeText, jobDescription);
    res.json({ ...parsedResult, uploadedDocuments });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to analyze uploaded resume and job description",
      error: error.message,
    });
  }
};
