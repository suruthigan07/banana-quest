import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrentUser, logoutUser } from "./services/authService";
import "./styles.css";

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }

  if (loading) return <div className="page-center">Loading Quiz Battle...</div>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={setUser} />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register onLogin={setUser} />} />
      <Route element={<ProtectedRoute user={user} loading={loading} />}>
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
