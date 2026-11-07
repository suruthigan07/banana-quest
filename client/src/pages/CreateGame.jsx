import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createGame } from "../services/gameService";
import BananaMascot from "../components/BananaMascot";
import BananaBackground from "../components/BananaBackground";
import { playClickSound, playStreakSound } from "../utils/audio";

export default function CreateGame() {
  const [settings, setSettings] = useState({
    category: "Banana API",
    mode: "banana",
    questionCount: 5,
    maxPlayers: 8,
    timeLimitSeconds: 15,
    isSolo: false
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function selectMode(modeKey, defaultCat, maxP, time) {
    playClickSound();
    setSettings((prev) => ({
      ...prev,
      mode: modeKey,
      category: defaultCat,
      maxPlayers: maxP,
      timeLimitSeconds: time,
      isSolo: maxP === 1
    }));
  }

  function update(event) {
    setSettings({ ...settings, [event.target.name]: event.target.value });
  }

  async function handleCreate(event) {
    event.preventDefault();
    playClickSound();
    setBusy(true);
    setError("");
    try {
      const result = await createGame({
        ...settings,
        questionCount: Number(settings.questionCount),
        maxPlayers: Number(settings.maxPlayers),
        timeLimitSeconds: Number(settings.timeLimitSeconds),
        isSolo: Number(settings.maxPlayers) === 1 || settings.isSolo
      });
      playStreakSound(2);
      navigate(`/game/${result.game.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the game room.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="game-page">
      <BananaBackground />
      <div className="game-topline">
        <Link to="/dashboard" className="back-link" onClick={playClickSound}>
          ← Back to Dashboard
        </Link>
        <span className="arcade-tag">HOST BANANA ARENA</span>
      </div>

      <section className="arcade-card form-card">
        <div className="create-header-row">
          <BananaMascot state="thinking" size={85} />
          <div>
            <p className="eyebrow">CUSTOM GAME CREATOR</p>
            <h1>Host a Quest Room</h1>
            <p className="muted">
              Select your game mode and rules. A 6-character room code will be generated for your lobby.
            </p>
          </div>
        </div>

        {error && <div className="game-alert-banner">⚠️ {error}</div>}

        {/* Mode Selector Cards */}
        <div className="mode-selection-grid">
          <div
            className={`mode-card ${settings.mode === "banana" ? "mode-selected" : ""}`}
            onClick={() => selectMode("banana", "Banana API", 8, 15)}
          >
            <span className="mode-emoji">🍌</span>
            <strong>Banana API Quest</strong>
            <span>Live Marc Conrad Banana visual equation puzzles.</span>
          </div>

          <div
            className={`mode-card ${settings.mode === "speedrun" ? "mode-selected" : ""}`}
            onClick={() => selectMode("speedrun", "Banana API", 1, 10)}
          >
            <span className="mode-emoji">⚡</span>
            <strong>Solo Speedrun</strong>
            <span>Fast-paced 10-second timer. Solo high-score climb!</span>
          </div>

          <div
            className={`mode-card ${settings.mode === "trivia" ? "mode-selected" : ""}`}
            onClick={() => selectMode("trivia", "Software Engineering", 8, 15)}
          >
            <span className="mode-emoji">💻</span>
            <strong>Enterprise CS Trivia</strong>
            <span>Version control, events, interoperability & identity.</span>
          </div>
        </div>

        <form onSubmit={handleCreate} className="game-settings-form">
          <div className="form-grid-2col">
            <div className="form-group">
              <label>Question Category</label>
              <select name="category" value={settings.category} onChange={update}>
                <option value="Banana API">🍌 Banana API Equations (Recommended)</option>
                <option value="Software Engineering">💻 Software Engineering & Enterprise</option>
                <option value="Computer Science">🧠 Computer Science Fundamentals</option>
                <option value="Web Development">🌐 Web & Distributed Systems</option>
                <option value="Mixed">🎲 Mixed Categories</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Questions</label>
              <select name="questionCount" value={settings.questionCount} onChange={update}>
                <option value="3">3 Quick Rounds</option>
                <option value="5">5 Standard Rounds</option>
                <option value="10">10 Full Battle Rounds</option>
                <option value="15">15 Endurance Marathon</option>
              </select>
            </div>

            <div className="form-group">
              <label>Player Capacity</label>
              <select name="maxPlayers" value={settings.maxPlayers} onChange={update}>
                <option value="1">1 Player (Solo Practice Rush)</option>
                <option value="2">2 Players (1v1 Duel)</option>
                <option value="4">4 Players (Squad Battle)</option>
                <option value="8">8 Players (Arena Match)</option>
                <option value="16">16 Players (Mega Tournament)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Timer Per Question</label>
              <select
                name="timeLimitSeconds"
                value={settings.timeLimitSeconds}
                onChange={update}
              >
                <option value="10">⚡ 10 Seconds (Speed Demon)</option>
                <option value="15">🎯 15 Seconds (Standard Balanced)</option>
                <option value="20">🧘 20 Seconds (Relaxed Math)</option>
                <option value="30">🐢 30 Seconds (Beginner Friendly)</option>
              </select>
            </div>
          </div>

          <button className="primary-button pulse-glow" disabled={busy}>
            {busy ? "Spawning Banana Arena..." : "🎮 CREATE ARENA ROOM"}
          </button>
        </form>
      </section>
    </main>
  );
}
