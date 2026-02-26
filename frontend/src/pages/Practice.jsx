import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const getScoreColor = (score) => {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
};

const Practice = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuestion = async () => {
    if (!topic) return;

    try {
      setLoading(true);
      setQuestion("");
      setEvaluation(null);

      const res = await api.post("/interview/generate", {
        topic,
        difficulty,
      });

      setQuestion(res.data.question);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to generate question";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer) return;

    try {
      setLoading(true);

      const res = await api.post("/interview/evaluate", {
        topic,
        question,
        answer,
      });

      setEvaluation(res.data);
      toast.success("Answer evaluated");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to evaluate answer";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
        Practice Mode
      </h1>

      {/* Input Section */}
      <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Enter topic (e.g., TCP, DSA)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="col-span-2 p-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-3 rounded-xl bg-background border border-gray-700"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={generateQuestion}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition"
        >
          {loading ? "Generating..." : "Generate Question"}
        </button>
      </div>

      {/* Question Section */}
      {question && (
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5 mb-8">
          <h2 className="text-xl font-semibold mb-4">Question</h2>
          <p className="mb-6">{question}</p>

          <textarea
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo min-h-[12rem] resize-y"
          />

          <button
            onClick={submitAnswer}
            disabled={loading}
            className="mt-6 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-purple shadow-glow hover:opacity-90 transition"
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        </div>
      )}

      {/* Evaluation Section */}
      {evaluation && (
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5">
          <h2 className="text-xl font-semibold mb-4">Evaluation</h2>

          <p
            className={`text-2xl font-bold mb-4 ${getScoreColor(evaluation.score)}`}
          >
            Score: {evaluation.score}/10
          </p>

          <div className="whitespace-pre-line leading-relaxed">
            {evaluation.evaluation}
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
