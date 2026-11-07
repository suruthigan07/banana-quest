import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import BananaMascot from "../components/BananaMascot";
import BananaBackground from "../components/BananaBackground";
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
    <main className="auth-layout">
      <BananaBackground />

      <section className="arcade-card auth-card wide-auth">
        <div className="auth-mascot-row">
          <BananaMascot state="idle" size={75} />
          <div className="brand-header">
            <span className="brand-title">BANANA QUEST</span>
            <span className="arcade-tag">VIRTUAL IDENTITY</span>
          </div>
        </div>

        <p className="eyebrow">NEW PLAYER ENROLLMENT</p>
        <h1>Create Your Player Persona</h1>
        <p className="muted">
          Your virtual identity tracks high scores, unlocked badges, and multiplayer presence.
        </p>

        {error && <div className="game-alert-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Player Username</label>
            <input
              name="username"
              value={form.username}
              onChange={update}
              placeholder="e.g. BananaSlayer"
              minLength={3}
              maxLength={24}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update}
              placeholder="e.g. hero@banana.quest"
              required
            />
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label>Password (min 8 chars)</label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={update}
                minLength={8}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={update}
                minLength={8}
                required
              />
            </div>
          </div>

          {/* Quick Avatar Selector */}
          <div className="avatar-pick-section">
            <label>Choose Starting Banana Persona</label>
            <div className="mini-avatar-grid">
              {AVATAR_OPTIONS.slice(0, 4).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`mini-avatar-btn ${form.avatar === item.id ? "mini-selected" : ""}`}
                  onClick={() => selectAvatar(item.id)}
                >
                  <span className="mini-emoji">{item.emoji}</span>
                  <span className="mini-name">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="primary-button pulse-glow" disabled={loading}>
            {loading ? "Forging Banana Identity..." : "🚀 FORGE PLAYER IDENTITY"}
          </button>
        </form>

        <p className="bottom-text">
          Already have a persona? <Link to="/login">Sign in here</Link>
        </p>
      </section>
    </main>
  );
}
