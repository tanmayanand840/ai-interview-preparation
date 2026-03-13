import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import PageShell from "../components/PageShell";

const getScoreColor = (score) => {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
};

const Adaptive = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    if (!topic) return;

    try {
      setLoading(true);
      const res = await api.post("/adaptive/start", {
        topic,
        difficulty,
      });

      setSessionId(res.data.sessionId);
      setQuestion(res.data.question);
      toast.success("Adaptive interview started");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to start session";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    try {
      setLoading(true);

      const res = await api.post("/adaptive/answer", {
        sessionId,
        answer,
      });

      if (!res.data.completed) {
        setEvaluation({
          score: res.data.score,
          feedback: res.data.evaluation,
        });

        setQuestion(res.data.nextQuestion);
        setAnswer("");
        toast.success("Answer submitted");
      } else {
        setFinalReport(res.data);
        toast.success("Adaptive interview completed");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to submit answer";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Adaptive Interview Mode"
      subtitle="Run dynamic interview sessions where each next question adapts to your performance."
      tag="Adaptive Session"
    >
      {!sessionId && (
        <div className="saas-card p-6 sm:p-7">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Enter topic"
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

          <button onClick={startSession} className="mt-6 saas-btn-primary">
            Start Interview
          </button>
        </div>
      )}

      {question && !finalReport && (
        <div className="saas-card p-6 sm:p-7">
          <h2 className="saas-section-title">Question</h2>
          <p className="mb-6">{question}</p>

          <textarea
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="saas-textarea"
            placeholder="Type your answer..."
          />

          <button onClick={submitAnswer} className="mt-6 saas-btn-primary">
            Submit Answer
          </button>

          {evaluation && (
            <div className="mt-6 p-4 bg-surface/80 rounded-xl border border-white/10">
              <p
                className={`text-lg font-bold ${getScoreColor(evaluation.score)}`}
              >
                Score: {evaluation.score}/10
              </p>
              <p className="mt-2">{evaluation.feedback}</p>
            </div>
          )}
        </div>
      )}

      {finalReport && (
        <div className="saas-card p-6 sm:p-7">
          <h2 className="text-2xl font-bold mb-4 text-green-400">
            Final Score: {finalReport.finalScore}
          </h2>

          <p className="mb-6">{finalReport.summary}</p>

          <h3 className="text-lg font-semibold mb-4">Breakdown</h3>

          <div className="space-y-4">
            {finalReport.breakdown.map((item, index) => (
              <div
                key={index}
                className="bg-surface/80 border border-white/10 p-4 rounded-xl"
              >
                <p className="font-semibold">{item.question}</p>
                <p className="text-sm mt-2 text-textMuted">
                  Your Answer: {item.answer}
                </p>
                <p className={`mt-2 font-bold ${getScoreColor(item.score)}`}>
                  Score: {item.score}
                </p>
                <p className="text-sm mt-1">{item.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Adaptive;
