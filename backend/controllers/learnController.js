import fetch from "node-fetch";

// Use fetch for OpenRouter API

export const teachTopic = async (req, res) => {
  try {
    const { topic, level } = req.body;
    if (!topic || !level) {
      return res.status(400).json({ message: "Topic and level required" });
    }

    const prompt = `You are a university professor.\n\nTeach ${topic} at ${level} level.\n\nStructure:\n1. Introduction\n2. Core Concept\n3. Example\n4. ASCII Diagram\n5. Common Mistakes\n6. 3 Practice Questions`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5000", // Optional: set your domain
        "X-Title": "ai-interview-platform" // Optional: set your app name
      },
      body: JSON.stringify({
        // Use a serverless model available on OpenRouter
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful university professor." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter error: ${errorText}`);
    }

    const data = await response.json();
    let lesson = "No response from AI model.";
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      lesson = data.choices[0].message.content;
    } else if (data.error && data.error.message) {
      lesson = `OpenRouter error: ${data.error.message}`;
    }
    // Clean up markdown for better readability
    lesson = lesson
      .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
      .replace(/[#*_`~\-]{2,}/g, '') // Remove repeated markdown symbols
      .replace(/^#+\s?/gm, '') // Remove markdown headings
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
      .replace(/(\d+\. )/g, '\n$1') // Add line break before numbered sections
      .replace(/(- )/g, '\n$1') // Add line break before bullet points
      .replace(/\n\s*-/g, '\n-') // Clean up bullet spacing
      .replace(/:\s*/g, ':\n') // Add line break after colons
      .replace(/\n{2,}/g, '\n\n') // Ensure double line breaks between sections
      .replace(/\s+$/gm, '') // Remove trailing whitespace
      .trim();
    res.json({ lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OpenRouter AI failed", error: error.message });
  }
};