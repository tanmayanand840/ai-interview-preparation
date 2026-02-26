import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import SkeletonCard from "../components/SkeletonCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
        Dashboard Overview
      </h1>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Practice Attempts"
              value={data.practice.totalAttempts}
              subtitle={`Avg Score: ${data.practice.averageScore}`}
              percentage={data.practice.averageScore * 10}
            />

            <StatCard
              title="Adaptive Sessions"
              value={data.adaptive.totalSessions}
              subtitle={`Avg Score: ${data.adaptive.averageScore}`}
              percentage={data.adaptive.averageScore * 10}
            />

            <StatCard
              title="Overall Score"
              value={data.overall.averageScore}
              percentage={data.overall.averageScore * 10}
            />
          </>
        )}
      </div>

      {/* Topic Performance Chart */}
      {!loading && (
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-white/5">
          <h2 className="text-xl font-semibold mb-6">
            Topic Performance
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topicPerformance}>
              <XAxis dataKey="topic" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="average" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Dashboard;