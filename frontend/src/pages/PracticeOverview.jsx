import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProgressSummary } from "../services/practiceService";
import PageShell from "../components/PageShell";

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
    <PageShell
      title="DSA Practice Overview"
      subtitle="Jump into any topic and track solved progress at a glance."
      tag="Progress"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
        {Object.keys(summary).map((topic) => (
          <div
            key={topic}
            onClick={() => navigate(`/practice/${topic}`)}
            className="saas-card p-6 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-3">{topic}</h2>

            <div className="w-full bg-background/90 h-2 rounded-full mb-2 overflow-hidden border border-white/10">
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
    </PageShell>
  );
};

export default PracticeOverview;
