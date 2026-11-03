import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password
      });
      onLogin(result.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <div className="brand-mark">QB</div>
        <p className="eyebrow">CREATE YOUR PLAYER ID</p>
        <h1>Join Quiz Battle</h1>
        <p className="muted">Create an account to start playing.</p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input name="username" value={form.username} onChange={update}
            placeholder="Choose a username" minLength="3" maxLength="24" required />
          <label>Email address</label>
          <input name="email" type="email" autoComplete="email" value={form.email}
            onChange={update} placeholder="you@example.com" required />
          <label>Password</label>
          <input name="password" type="password" autoComplete="new-password"
            value={form.password} onChange={update} minLength="8" required />
          <label>Confirm password</label>
          <input name="confirmPassword" type="password" autoComplete="new-password"
            value={form.confirmPassword} onChange={update} minLength="8" required />
          <button className="primary-button" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="bottom-text">Already registered? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
}
