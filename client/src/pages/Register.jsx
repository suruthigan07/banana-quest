import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import BananaBackground from "../components/BananaBackground";
import { MonkeyBannerIllustration } from "../components/LevelIllustrations";
import { AVATAR_OPTIONS } from "../components/AvatarSelector";
import { playClickSound, playStreakSound } from "../utils/audio";

export default function Register({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "banana-warrior"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const selectAvatar = (id) => {
    playClickSound();
    setForm((prev) => ({ ...prev, avatar: id }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    playClickSound();
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
        password: form.password,
        avatar: form.avatar
      });
      playStreakSound(3);
      onLogin(result.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bq-auth-page">
      <BananaBackground />

      <div className="bq-auth-window bq-auth-window--wide">
        {/* Left panel — branding */}
        <div className="bq-auth-left">
          <div className="bq-auth-monkey">
            <MonkeyBannerIllustration size={120} />
          </div>
          <h2 className="bq-auth-brand">BANANA QUEST</h2>
          <p className="bq-auth-tagline">Join thousands of players solving banana math puzzles!</p>
          <div className="bq-auth-features">
            <div className="bq-auth-feat">🍌 Banana Math Puzzles</div>
            <div className="bq-auth-feat">🏆 Global Leaderboard</div>
            <div className="bq-auth-feat">⭐ Achievements & Rewards</div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="bq-auth-right">
          <div className="bq-auth-form-header">
            <span className="bq-auth-eyebrow">NEW PLAYER</span>
            <h1 className="bq-auth-title">Create Account</h1>
            <p className="bq-auth-sub">Set up your player profile to start earning bananas.</p>
          </div>

          {error && <div className="bq-auth-alert">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="bq-auth-form">
            <div className="bq-field">
              <label className="bq-label">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={update}
                placeholder="e.g. BananaSlayer"
                className="bq-input"
                minLength={3}
                maxLength={24}
                required
              />
            </div>

            <div className="bq-field">
              <label className="bq-label">Email Address</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update}
                placeholder="e.g. hero@banana.quest"
                className="bq-input"
                required
              />
            </div>

            <div className="bq-field-row">
              <div className="bq-field">
                <label className="bq-label">Password (min 8 chars)</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update}
                  className="bq-input"
                  minLength={8}
                  required
                />
              </div>
              <div className="bq-field">
                <label className="bq-label">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={update}
                  className="bq-input"
                  minLength={8}
                  required
                />
              </div>
            </div>

            {/* Avatar Picker */}
            <div className="bq-avatar-pick">
              <label className="bq-label">Choose your avatar</label>
              <div className="bq-avatar-grid">
                {AVATAR_OPTIONS.slice(0, 4).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`bq-avatar-btn ${form.avatar === item.id ? "bq-avatar-selected" : ""}`}
                    onClick={() => selectAvatar(item.id)}
                  >
                    <span className="bq-avatar-emoji">{item.emoji}</span>
                    <span className="bq-avatar-name">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="bq-submit-btn" disabled={loading}>
              {loading ? "Creating account..." : "🚀 Create Account"}
            </button>
          </form>

          <p className="bq-auth-footer-text">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
