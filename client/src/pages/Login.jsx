import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, socialLoginUrl } from "../services/authService";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const oauthError = params.get("error");

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(form);
      onLogin(result.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const oauthMessages = {
    account_exists: "An account with this email already exists. Sign in using its original login method.",
    provider_email_missing: "The provider did not share an email address.",
    email_not_verified: "Your Google email could not be verified.",
    google_failed: "Google sign-in failed. Please try again.",
    facebook_failed: "Facebook sign-in failed. Please try again.",
    social_login_failed: "Social sign-in failed. Please try again."
  };

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <div className="brand-mark">QB</div>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log in to Quiz Battle</h1>
        <p className="muted">Enter your account details to continue.</p>

        {oauthError && <div className="alert">{oauthMessages[oauthError] || "Authentication failed."}</div>}
        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input name="email" type="email" autoComplete="email" value={form.email}
            onChange={update} placeholder="you@example.com" required />
          <label>Password</label>
          <input name="password" type="password" autoComplete="current-password"
            value={form.password} onChange={update} placeholder="Your password" required />
          <button className="primary-button" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="separator"><span>or continue with</span></div>
        <div className="social-buttons">
          <a className="social-button" href={socialLoginUrl("google")}>G&nbsp; Google</a>
          <a className="social-button" href={socialLoginUrl("facebook")}>f&nbsp; Facebook</a>
        </div>
        <p className="bottom-text">New to Quiz Battle? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
