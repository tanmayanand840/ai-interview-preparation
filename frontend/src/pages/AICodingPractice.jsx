import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import PageShell from "../components/PageShell";

const AICodingPractice = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [language, setLanguage] = useState("cpp");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [generationLoading, setGenerationLoading] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      setGenerationLoading(true);
      setEvaluation(null);
      setProblem(null);

      const res = await api.post("/practice/ai/generate-coding", {
        topic,
        difficulty,
        language,
      });

      setProblem(res.data);
      setCode(res.data.boilerplate_code || "");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to generate coding problem";
      toast.error(message);
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!problem) {
      toast.error("Generate a problem first");
      return;
    }
    if (!code.trim()) {
      toast.error("Write your solution code before submitting");
      return;
    }

    try {
      setEvaluationLoading(true);
      setEvaluation(null);

      const res = await api.post("/practice/ai/evaluate-coding", {
        topic,
        difficulty,
        problem,
        language,
        code,
      });

      setEvaluation(res.data);
      toast.success("Solution evaluated");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to evaluate solution";
      toast.error(message);
    } finally {
      setEvaluationLoading(false);
    }
  };

  return (
    <PageShell
      title="AI Coding Practice"
      subtitle="Generate coding tasks, solve in your language of choice, and receive optimization feedback."
      tag="Coding"
    >
      {/* Controls */}
      <div className="saas-card p-6 sm:p-7 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="DSA topic (e.g., Arrays, DP, Graphs)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="col-span-2 saas-input"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="saas-select"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-textMuted">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="saas-select py-2 text-sm"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generationLoading}
            className="saas-btn-primary disabled:opacity-70"
          >
            {generationLoading ? "Generating..." : "Generate Coding Problem"}
          </button>
        </div>
      </div>

      {/* Problem Section */}
      {problem && (
        <div className="saas-card p-6 sm:p-7 space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">{problem.title}</h2>
              <p className="text-xs text-textMuted">
                Topic: {problem.topic} • Difficulty: {problem.difficulty}
              </p>
            </div>
          </div>

          {problem.description && (
            <p className="text-sm leading-relaxed text-textMuted whitespace-pre-line">
              {problem.description}
            </p>
          )}

          {Array.isArray(problem.constraints) &&
            problem.constraints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Constraints:</h3>
                <ul className="list-disc list-inside text-sm text-textMuted space-y-0.5">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

          {Array.isArray(problem.examples) && problem.examples.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold mb-1">Examples:</h3>
              {problem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-background/80 border border-white/10 rounded-lg p-3 space-y-1"
                >
                  {ex.input && (
                    <p>
                      <span className="font-semibold">Input:</span> {ex.input}
                    </p>
                  )}
                  {ex.output && (
                    <p>
                      <span className="font-semibold">Output:</span> {ex.output}
                    </p>
                  )}
                  {ex.explanation && (
                    <p className="text-textMuted">
                      <span className="font-semibold">Explanation:</span>{" "}
                      {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem.function_signature && (
            <p className="text-xs text-textMuted">
              <span className="font-semibold">Function Signature:</span>{" "}
              {problem.function_signature}
            </p>
          )}
        </div>
      )}

      {/* Code Editor */}
      {problem && (
        <div className="saas-card p-6 sm:p-7">
          <h2 className="text-xl font-semibold mb-3">Your Solution</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="saas-textarea min-h-[14rem] font-mono text-sm resize-y"
            placeholder={`Write your ${language.toUpperCase()} solution here...`}
          />

          <button
            onClick={handleEvaluate}
            disabled={evaluationLoading}
            className="mt-4 saas-btn-primary disabled:opacity-70"
          >
            {evaluationLoading ? "Evaluating..." : "Submit & Get Feedback"}
          </button>
        </div>
      )}

      {/* Evaluation */}
      {evaluation && (
        <div className="saas-card p-6 sm:p-7 space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Evaluation</h2>
              {evaluation.verdict && (
                <p className="text-sm text-textMuted">
                  Verdict: {evaluation.verdict}
                </p>
              )}
            </div>
            {typeof evaluation.score === "number" && (
              <p className="text-2xl font-bold text-cyan-400">
                {evaluation.score}/10
              </p>
            )}
          </div>

          {(evaluation.time_complexity || evaluation.space_complexity) && (
            <div className="flex flex-wrap gap-6 text-sm">
              {evaluation.time_complexity && (
                <p>
                  <span className="font-semibold">Time:</span>{" "}
                  {evaluation.time_complexity}
                </p>
              )}
              {evaluation.space_complexity && (
                <p>
                  <span className="font-semibold">Space:</span>{" "}
                  {evaluation.space_complexity}
                </p>
              )}
            </div>
          )}

          {evaluation.explanation && (
            <p className="text-sm leading-relaxed text-textMuted whitespace-pre-line">
              {evaluation.explanation}
            </p>
          )}

          {Array.isArray(evaluation.issues) && evaluation.issues.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Issues:</h3>
              <ul className="list-disc list-inside text-sm text-textMuted space-y-0.5">
                {evaluation.issues.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(evaluation.improvements) &&
            evaluation.improvements.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Improvements:</h3>
                <ul className="list-disc list-inside text-sm text-textMuted space-y-0.5">
                  {evaluation.improvements.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            )}

          {evaluation.better_approach && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Better Approach:</h3>
              <p className="text-sm text-textMuted whitespace-pre-line">
                {evaluation.better_approach}
              </p>
            </div>
          )}

          {evaluation.reference_implementation && (
            <div>
              <h3 className="text-sm font-semibold mb-1">
                Reference Implementation ({language.toUpperCase()}):
              </h3>
              <pre className="whitespace-pre-wrap text-xs text-textMuted bg-background border border-gray-800 rounded-lg p-3 overflow-x-auto">
                {evaluation.reference_implementation}
              </pre>
            </div>
          )}

          {evaluation.raw && !evaluation.verdict && (
            <pre className="whitespace-pre-wrap text-xs text-textMuted">
              {evaluation.raw}
            </pre>
          )}
        </div>
      )}
    </PageShell>
  );
};

export default AICodingPractice;
