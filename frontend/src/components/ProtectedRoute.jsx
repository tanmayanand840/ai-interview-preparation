import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext.jsx";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, user, loadingUser } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (loadingUser) {
    return null;
  }

  if (requireAdmin && (!user || user.role !== "admin")) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
