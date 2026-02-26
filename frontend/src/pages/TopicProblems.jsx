import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProblemsByTopic,
  updateProgress,
} from "../services/practiceService";

const TopicProblems = () => {
  const { topic } = useParams();
  const [problems, setProblems] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProblems = async () => {
    try {
      const { data } = await getProblemsByTopic(topic);
      setProblems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [topic]);

  const handleStatusChange = async (problemId, status) => {
    try {
      setStatusMap((prev) => ({ ...prev, [problemId]: status }));
      setUpdatingId(problemId);
      await updateProgress({ problemId, status });
      fetchProblems();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Solved") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/40";
    }
    if (status === "Attempted") {
      return "bg-amber-500/10 text-amber-400 border-amber-500/40";
    }
    return "bg-rose-500/10 text-rose-400 border-rose-500/40"; // NotStarted
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
        {topic} Problems
      </h1>

      <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Difficulty</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id} className="border-b">
                <td className="py-3">
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:underline"
                  >
                    {problem.title}
                  </a>
                </td>

                <td>{problem.difficulty}</td>

                <td>
                  {(() => {
                    const status = statusMap[problem._id] || "NotStarted";
                    return (
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getStatusClass(
                            status,
                          )}`}
                        >
                          {status === "NotStarted" ? "Not solved" : status}
                        </span>
                        <select
                          className="border border-gray-700 bg-background px-2 py-1 rounded-lg text-xs focus:ring-2 focus:ring-indigo transition"
                          value={status}
                          disabled={updatingId === problem._id}
                          onChange={(e) =>
                            handleStatusChange(problem._id, e.target.value)
                          }
                        >
                          <option value="NotStarted">Not solved</option>
                          <option value="Attempted">Attempted</option>
                          <option value="Solved">Solved</option>
                        </select>
                      </div>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicProblems;
