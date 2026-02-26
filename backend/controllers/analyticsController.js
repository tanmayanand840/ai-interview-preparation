import Attempt from "../models/Attempt.js";
import InterviewSession from "../models/InterviewSession.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    /* ===============================
       1️⃣ Practice Mode Analytics
    =============================== */

    const practiceAttempts = await Attempt.find({ userId });

    const totalPractice = practiceAttempts.length;

    const practiceAverage =
      totalPractice > 0
        ? (
            practiceAttempts.reduce((sum, a) => sum + a.score, 0) /
            totalPractice
          ).toFixed(2)
        : 0;

    /* ===============================
       2️⃣ Adaptive Mode Analytics
    =============================== */

    const adaptiveSessions = await InterviewSession.find({
      userId,
      isCompleted: true
    });

    const totalAdaptive = adaptiveSessions.length;

    const adaptiveAverage =
      totalAdaptive > 0
        ? (
            adaptiveSessions.reduce(
              (sum, s) => sum + s.totalScore / s.questionCount,
              0
            ) / totalAdaptive
          ).toFixed(2)
        : 0;

    /* ===============================
       3️⃣ Overall Average
    =============================== */

    const overallScores = [];

    practiceAttempts.forEach((a) => overallScores.push(a.score));

    adaptiveSessions.forEach((s) => {
      overallScores.push(s.totalScore / s.questionCount);
    });

    const overallAverage =
      overallScores.length > 0
        ? (
            overallScores.reduce((sum, val) => sum + val, 0) /
            overallScores.length
          ).toFixed(2)
        : 0;

    /* ===============================
       4️⃣ Topic-wise Adaptive Performance
    =============================== */

    const topicStats = {};

    adaptiveSessions.forEach((session) => {
      const topic = session.topic;
      const avg = session.totalScore / session.questionCount;

      if (!topicStats[topic]) {
        topicStats[topic] = {
          total: 0,
          count: 0
        };
      }

      topicStats[topic].total += avg;
      topicStats[topic].count += 1;
    });

    const topicPerformance = Object.keys(topicStats).map((topic) => ({
      topic,
      average: (
        topicStats[topic].total / topicStats[topic].count
      ).toFixed(2)
    }));

    /* ===============================
       Final Response
    =============================== */

    return res.json({
      practice: {
        totalAttempts: totalPractice,
        averageScore: practiceAverage
      },
      adaptive: {
        totalSessions: totalAdaptive,
        averageScore: adaptiveAverage
      },
      overall: {
        averageScore: overallAverage
      },
      topicPerformance
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch analytics" });
  }
};