import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Learn = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;

    try {
      setLoading(true);
      setLesson("");

      const res = await api.post("/learn/topic", {
        topic,
        level,
      });

      setLesson(res.data.lesson);
      toast.success("Lesson generated");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to generate lesson";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderLesson = () => {
    const lines = lesson
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const blocks = [];
    let current = { title: "", items: [], text: [] };

    const pushCurrent = () => {
      if (
        !current.title &&
        current.text.length === 0 &&
        current.items.length === 0
      )
        return;
      blocks.push(current);
      current = { title: "", items: [], text: [] };
    };

    lines.forEach((line) => {
      const headingMatch = line.match(/^(\d+)\.\s*(.+)/);
      const bulletMatch = line.match(/^[-•]\s*(.+)/);

      if (headingMatch) {
        pushCurrent();
        current.title = headingMatch[2];
      } else if (bulletMatch) {
        current.items.push(bulletMatch[1]);
      } else {
        current.text.push(line);
      }
    });
    pushCurrent();

    return (
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {blocks.map((block, idx) => (
          <section key={idx}>
            {block.title && (
              <h2 className="text-lg font-semibold text-textPrimary mb-1">
                {block.title}
              </h2>
            )}
            {block.text.length > 0 && (
              <p className="text-sm text-textPrimary/90 leading-relaxed whitespace-pre-line">
                {block.text.join("\n")}
              </p>
            )}
            {block.items.length > 0 && (
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-textPrimary/90">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
        Learn Mode
      </h1>

      {/* Input Section */}
      <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Enter topic (e.g., TCP, DSA, OS)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="col-span-2 p-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="p-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition"
        >
          {loading ? "Generating Lesson..." : "Generate Lesson"}
        </button>
      </div>

      {/* Lesson Output */}
      {loading && (
        <div className="bg-card p-6 rounded-2xl animate-pulse border border-white/5">
          <div className="h-4 bg-surface rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-surface rounded w-full mb-2"></div>
          <div className="h-4 bg-surface rounded w-5/6"></div>
        </div>
      )}

      {lesson && (
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5 leading-relaxed">
          {renderLesson()}
        </div>
      )}
    </div>
  );
};

export default Learn;
