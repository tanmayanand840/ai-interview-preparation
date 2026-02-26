import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProgressSummary } from "../services/practiceService";

const PracticeOverview = () => {
  const [summary, setSummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProgressSummary();
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
        DSA Practice Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(summary).map((topic) => (
          <div
            key={topic}
            onClick={() => navigate(`/practice/${topic}`)}
            className="bg-card rounded-2xl shadow-lg border border-white/5 p-5 cursor-pointer hover:border-cyan hover:shadow-glow transition"
          >
            <h2 className="text-xl font-semibold mb-3">{topic}</h2>

            <div className="w-full bg-background h-2 rounded-full mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo to-cyan h-2 rounded-full"
                style={{ width: `${summary[topic].percentage}%` }}
              />
            </div>

            <p className="text-sm text-textMuted">
              {summary[topic].solved} / {summary[topic].total} solved
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeOverview;
