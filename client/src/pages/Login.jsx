import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, socialLoginUrl } from "../services/authService";
import BananaMascot from "../components/BananaMascot";
import BananaBackground from "../components/BananaBackground";
import { playClickSound, playStreakSound } from "../utils/audio";

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
    playClickSound();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(form);
      playStreakSound(2);
      onLogin(result.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  const fillQuickDemo = (role = "player") => {
    playClickSound();
    setForm({
      email: role === "player" ? "player@banana.quest" : "tutor@banana.quest",
      password: "password123"
    });
  };

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
      <BananaBackground />

      <section className="arcade-card auth-card">
        <div className="auth-mascot-row">
          <BananaMascot state="idle" size={75} />
          <div className="brand-header">
            <span className="brand-title">BANANA QUEST</span>
            <span className="arcade-tag">ARCADE AUTH</span>
          </div>
        </div>

        <p className="eyebrow">ENTER THE JUNGLE</p>
        <h1>Player Sign In</h1>
        <p className="muted">Log in with your Virtual Identity credentials.</p>

        {oauthError && (
          <div className="game-alert-banner">⚠️ {oauthMessages[oauthError] || "Authentication failed."}</div>
        )}
        {error && <div className="game-alert-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Player Email</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update}
              placeholder="e.g. gamer@banana.quest"
              required
            />
          </div>

          <div className="form-group">
            <label>Secret Password</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={update}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="primary-button pulse-glow" disabled={loading}>
            {loading ? "Authenticating Persona..." : "🍌 LAUNCH BANANA QUEST"}
          </button>
        </form>

        <div className="quick-demo-login-box">
          <span className="quick-demo-label">Testing or Grading? Quick Fill:</span>
          <div className="quick-demo-buttons">
            <button type="button" className="demo-chip-btn" onClick={() => fillQuickDemo("player")}>
              🎮 Fill Demo Player
            </button>
            <button type="button" className="demo-chip-btn" onClick={() => fillQuickDemo("tutor")}>
              👨‍🏫 Fill Tutor ID
            </button>
          </div>
        </div>

        <div className="separator"><span>OR SOCIAL IDENTITY</span></div>

        <div className="social-buttons">
          <a className="social-button" href={socialLoginUrl("google")}>
            <span className="social-logo">G</span> Google Login
          </a>
          <a className="social-button" href={socialLoginUrl("facebook")}>
            <span className="social-logo">f</span> Facebook
          </a>
        </div>

        <p className="bottom-text">
          New to the Quest? <Link to="/register">Create Your Player Persona</Link>
        </p>
      </section>
    </main>
  );
}
