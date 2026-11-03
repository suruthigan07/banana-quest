import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ user, loading }) {
  if (loading) return <div className="page-center">Checking your session...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
