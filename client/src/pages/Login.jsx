import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, socialLoginUrl } from "../services/authService";
import BananaBackground from "../components/BananaBackground";
import { MonkeyBannerIllustration } from "../components/LevelIllustrations";
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
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (!err.response) {
        setError("Cannot connect to the server. Please check if the backend is running.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  const oauthMessages = {
    account_exists: "An account with this email already exists. Sign in using its original login method.",
    provider_email_missing: "The provider did not share an email address.",
    email_not_verified: "Your Google email could not be verified.",
    google_failed: "Google sign-in failed. Please try again.",
    social_login_failed: "Social sign-in failed. Please try again."
  };

  return (
    <main className="bq-auth-page">
      <BananaBackground />

      <div className="bq-auth-window">
        {/* Left panel — branding */}
        <div className="bq-auth-left">
          <div className="bq-auth-monkey">
            <MonkeyBannerIllustration size={120} />
          </div>
          <h2 className="bq-auth-brand">BANANA QUEST</h2>
          <p className="bq-auth-tagline">Solve puzzles. Earn bananas. Climb the leaderboard.</p>
          <div className="bq-auth-features">
            <div className="bq-auth-feat">🍌 Banana Math Puzzles</div>
            <div className="bq-auth-feat">🏆 Global Leaderboard</div>
            <div className="bq-auth-feat">⭐ Achievements & Rewards</div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="bq-auth-right">
          <div className="bq-auth-form-header">
            <span className="bq-auth-eyebrow">WELCOME BACK</span>
            <h1 className="bq-auth-title">Sign In</h1>
            <p className="bq-auth-sub">Enter your credentials to continue your quest.</p>
          </div>

          {oauthError && (
            <div className="bq-auth-alert">⚠️ {oauthMessages[oauthError] || "Authentication failed."}</div>
          )}
          {error && <div className="bq-auth-alert">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="bq-auth-form">
            <div className="bq-field">
              <label className="bq-label">Email or Username</label>
              <input
                name="email"
                type="text"
                autoComplete="username"
                value={form.email}
                onChange={update}
                placeholder="e.g. alex@banana.quest"
                className="bq-input"
                required
              />
            </div>

            <div className="bq-field">
              <label className="bq-label">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={update}
                placeholder="••••••••"
                className="bq-input"
                required
              />
            </div>

            <button className="bq-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "🍌 Sign In"}
            </button>
          </form>

          {/* Google login */}
          <div className="bq-auth-divider"><span>or continue with</span></div>
          <a className="bq-google-btn" href={socialLoginUrl("google")}>
            <span className="bq-google-icon">G</span>
            Sign in with Google
          </a>

          <p className="bq-auth-footer-text">
            New to Banana Quest? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
