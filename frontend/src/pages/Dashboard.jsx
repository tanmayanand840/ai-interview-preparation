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
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Activity, BrainCircuit, Trophy } from "lucide-react";

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
    <div className="space-y-8 lg:space-y-10">
      <section className="rounded-2xl border border-white/10 bg-card/45 backdrop-blur-xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(2,6,23,0.35)]">
        <p className="text-xs uppercase tracking-[0.14em] text-cyan/90 mb-2">
          Analytics
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-sm text-textMuted mt-2 max-w-2xl">
          Track your interview preparation with real-time attempts, adaptive
          sessions, and topic-level performance trends.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
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
              icon={Activity}
            />

            <StatCard
              title="Adaptive Sessions"
              value={data.adaptive.totalSessions}
              subtitle={`Avg Score: ${data.adaptive.averageScore}`}
              percentage={data.adaptive.averageScore * 10}
              icon={BrainCircuit}
            />

            <StatCard
              title="Overall Score"
              value={data.overall.averageScore}
              percentage={data.overall.averageScore * 10}
              icon={Trophy}
            />
          </>
        )}
      </section>

      {/* Topic Performance Chart */}
      <section className="rounded-2xl p-6 sm:p-7 border border-white/10 bg-gradient-to-br from-card/90 via-card/70 to-surface/75 shadow-[0_14px_32px_rgba(2,6,23,0.38)]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              Topic Performance
            </h2>
            <p className="text-xs sm:text-sm text-textMuted mt-1">
              Compare your average scores across DSA topics.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-textMuted">
            <span className="h-2 w-2 rounded-full bg-cyan" />
            Average Score
          </div>
        </div>

        {loading ? (
          <div className="h-[220px] sm:h-[250px] rounded-xl border border-white/10 bg-surface/70 animate-pulse" />
        ) : (
          <div className="h-[220px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.topicPerformance}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="topic"
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "rgba(99,102,241,0.08)" }}
                  contentStyle={{
                    background: "#0F172A",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: "12px",
                    color: "#E2E8F0",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }} />
                <Bar
                  name="Average Score"
                  dataKey="average"
                  fill="url(#scoreGradient)"
                  radius={[8, 8, 0, 0]}
                />

                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
