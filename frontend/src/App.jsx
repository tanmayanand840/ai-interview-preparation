import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Adaptive from "./pages/Adaptive";
import PracticeOverview from "./pages/PracticeOverview";
import TopicProblems from "./pages/TopicProblems";
import AdminPractice from "./pages/AdminPractice";
import ResumeMatch from "./pages/ResumeMatch";
import AICodingPractice from "./pages/AICodingPractice";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <Layout>
              <Learn />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <Layout>
              <Practice />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice-overview"
        element={
          <ProtectedRoute>
            <Layout>
              <PracticeOverview />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice/:topic"
        element={
          <ProtectedRoute>
            <Layout>
              <TopicProblems />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-practice"
        element={
          <ProtectedRoute requireAdmin>
            <Layout>
              <AdminPractice />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adaptive"
        element={
          <ProtectedRoute>
            <Layout>
              <Adaptive />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-match"
        element={
          <ProtectedRoute>
            <Layout>
              <ResumeMatch />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-coding"
        element={
          <ProtectedRoute>
            <Layout>
              <AICodingPractice />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
