import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import PageShell from "../components/PageShell";

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
    <PageShell
      title="Practice Mode"
      subtitle="Generate role-relevant questions, submit your solution, and get instant AI evaluation."
      tag="Interview Prep"
    >
      {/* Input Section */}
      <div className="saas-card p-6 sm:p-7">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Enter topic (e.g., TCP, DSA)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="col-span-2 saas-input"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="saas-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={generateQuestion}
          disabled={loading}
          className="mt-6 saas-btn-primary disabled:opacity-70"
        >
          {loading ? "Generating..." : "Generate Question"}
        </button>
      </div>

      {/* Question Section */}
      {question && (
        <div className="saas-card p-6 sm:p-7">
          <h2 className="saas-section-title">Question</h2>
          <p className="mb-6">{question}</p>

          <textarea
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={10}
            className="saas-textarea min-h-[12rem] resize-y"
          />

          <button
            onClick={submitAnswer}
            disabled={loading}
            className="mt-6 saas-btn-primary disabled:opacity-70"
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        </div>
      )}

      {/* Evaluation Section */}
      {evaluation && (
        <div className="saas-card p-6 sm:p-7">
          <h2 className="saas-section-title">Evaluation</h2>

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
    </PageShell>
  );
};

export default Practice;
