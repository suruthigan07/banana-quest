import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BananaBackground from "../components/BananaBackground";
import AvatarSelector, { AVATAR_OPTIONS } from "../components/AvatarSelector";
import {
  MonkeyBannerIllustration,
  EasyMonkeyIllustration,
  MediumMonkeyIllustration,
  HardMonkeyIllustration
} from "../components/LevelIllustrations";
import { createGame } from "../services/gameService";
import { isSoundEnabled, toggleSound, playClickSound, playStreakSound } from "../utils/audio";

export default function Dashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [startingLevel, setStartingLevel] = useState(null);
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogout() {
    playClickSound();
    await onLogout();
    navigate("/login");
  }

  function handleSoundToggle() {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  }

  async function handleStartLevel(level) {
    playClickSound();
    setStartingLevel(level);
    setError("");

    const config = {
      easy: { count: 1, time: 15 },
      medium: { count: 2, time: 15 },
      hard: { count: 3, time: 15 }
    };

    const selected = config[level] || config.easy;

    try {
      const result = await createGame({
        category: "Banana API",
        mode: "banana",
        questionCount: selected.count,
        maxPlayers: 1,
        timeLimitSeconds: selected.time,
        isSolo: true
      });
      playStreakSound(2);
      navigate(`/game/${result.game.roomCode}`);
    } catch (err) {
      console.error("Failed to start level:", err);
      setError(err.response?.data?.message || "Could not launch level. Please try again.");
    } finally {
      setStartingLevel(null);
    }
  }

  const currentAvatarInfo =
    AVATAR_OPTIONS.find((a) => a.id === user?.avatar) || AVATAR_OPTIONS[0];

  const pointsCount = user?.bananaCoins ?? user?.totalPoints ?? 120;
  const streakDays = `${user?.highestStreak || 3} days`;

  return (
    <main className="dashboard-page level-ui-dashboard">
      <BananaBackground />

      {/* Main Window Container with macOS-style UI */}
      <div className="choose-level-window">
        {/* 1. Top Navigation Bar */}
        <header className="window-topbar">
          <div className="window-controls">
            <span className="mac-dot dot-red" title="Close" />
            <span className="mac-dot dot-yellow" title="Minimize" />
            <span className="mac-dot dot-green" title="Expand" />
          </div>

          <div className="topbar-right-group">
            <div className="game-title-header">
              <span className="title-banana-emoji">🍌</span>
              <strong>BANANA QUEST</strong>
            </div>

            <div className="user-profile-badge">
              <span className="avatar-chip-emoji">{currentAvatarInfo.emoji}</span>
              <span className="profile-username">{user?.username || "Alex"}</span>
            </div>

            <div className="currency-indicator">
              <span className="coin-icon">🪙</span>
              <strong className="coin-amount">{pointsCount}</strong>
            </div>

            <div className="utility-buttons">
              <button
                className="sound-toggle-btn small"
                onClick={handleSoundToggle}
                title="Toggle Sound"
              >
                {soundOn ? "🔊" : "🔇"}
              </button>
              <button
                className="outline-button small-btn logout-btn"
                onClick={handleLogout}
                title="Log out"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        {error && <div className="game-alert-banner window-alert">⚠️ {error}</div>}

        {/* 2 & 3. Split Layout: Left Sidebar + Main Content Area */}
        <div className="window-body-grid">
          {/* Left Sidebar (User Profile & Stats) */}
          <aside className="window-sidebar">
            <div className="sidebar-header-card">
              <div className="monkey-illustration-wrap">
                <MonkeyBannerIllustration size={105} />
              </div>
              <h3 className="sidebar-brand-text">BANANA QUEST</h3>
            </div>

            <div className="welcome-message-box">
              <p>
                Hello, <strong>{user?.username || "Alex"}</strong>! Choose a level to start playing and earn points!
              </p>
            </div>

            <div className="statistics-panel">
              <h4 className="stats-panel-title">Player Stats</h4>

              <div className="stat-item-row">
                <div className="stat-icon-wrap coin-stat-wrap">
                  <span className="stat-emoji">🪙</span>
                </div>
                <div className="stat-text-col">
                  <span className="stat-label">Your Points</span>
                  <strong className="stat-val">{pointsCount}</strong>
                </div>
              </div>

              <div className="stat-item-row">
                <div className="stat-icon-wrap trophy-stat-wrap">
                  <span className="stat-emoji">🏆</span>
                </div>
                <div className="stat-text-col">
                  <span className="stat-label">Current Streak</span>
                  <strong className="stat-val">{streakDays}</strong>
                </div>
              </div>
            </div>

            {/* Quick Actions in Sidebar */}
            <div className="sidebar-extra-actions">
              <Link to="/games/create" className="sidebar-action-btn" onClick={playClickSound}>
                <span>🎮</span> Host Custom Room
              </Link>
              <Link to="/games/join" className="sidebar-action-btn" onClick={playClickSound}>
                <span>🚀</span> Join Room Code
              </Link>
              <Link to="/leaderboard" className="sidebar-action-btn" onClick={playClickSound}>
                <span>🏆</span> Hall of Fame
              </Link>
              <button
                className="sidebar-action-btn"
                onClick={() => {
                  playClickSound();
                  setShowPersonaPicker(!showPersonaPicker);
                }}
              >
                <span>🎭</span> {showPersonaPicker ? "Hide Personas" : "Change Avatar"}
              </button>
            </div>
          </aside>

          {/* Main Content Area (Level Selection) */}
          <section className="window-main-content">
            <div className="level-selection-header">
              <h1>Choose a level</h1>
              <p className="level-selection-sub">
                Each level has a different number of puzzles and rewards. You can choose any level to start!
              </p>
            </div>

            {/* Three Level Cards (Easy, Medium, Hard) */}
            <div className="level-cards-grid">
              {/* Card 1: Easy */}
              <div className="level-card card-easy">
                <div className="level-illustration-container">
                  <EasyMonkeyIllustration size={92} />
                </div>
                <h2 className="level-card-title title-easy">Easy</h2>
                <div className="level-reward-pill pill-easy">
                  1 puzzle • 10 points
                </div>
                <ul className="level-bullet-points">
                  <li>Great for beginners</li>
                  <li>1 fun puzzle</li>
                  <li>Earn 10 points</li>
                </ul>
                <button
                  className="level-action-btn btn-easy"
                  disabled={Boolean(startingLevel)}
                  onClick={() => handleStartLevel("easy")}
                >
                  {startingLevel === "easy" ? "Starting..." : "Start Easy"}
                </button>
              </div>

              {/* Card 2: Medium */}
              <div className="level-card card-medium">
                <div className="level-illustration-container">
                  <MediumMonkeyIllustration size={92} />
                </div>
                <h2 className="level-card-title title-medium">Medium</h2>
                <div className="level-reward-pill pill-medium">
                  2 puzzles • 25 points
                </div>
                <ul className="level-bullet-points">
                  <li>A bit more challenging</li>
                  <li>2 puzzles</li>
                  <li>Earn 25 points</li>
                </ul>
                <button
                  className="level-action-btn btn-medium"
                  disabled={Boolean(startingLevel)}
                  onClick={() => handleStartLevel("medium")}
                >
                  {startingLevel === "medium" ? "Starting..." : "Start Medium"}
                </button>
              </div>

              {/* Card 3: Hard */}
              <div className="level-card card-hard">
                <div className="level-illustration-container">
                  <HardMonkeyIllustration size={92} />
                </div>
                <h2 className="level-card-title title-hard">Hard</h2>
                <div className="level-reward-pill pill-hard">
                  3 puzzles • 45 points
                </div>
                <ul className="level-bullet-points">
                  <li>For experienced players</li>
                  <li>3 puzzles</li>
                  <li>Earn 45 points</li>
                </ul>
                <button
                  className="level-action-btn btn-hard"
                  disabled={Boolean(startingLevel)}
                  onClick={() => handleStartLevel("hard")}
                >
                  {startingLevel === "hard" ? "Starting..." : "Start Hard"}
                </button>
              </div>
            </div>

            {/* Optional Avatar Customizer Area (Collapsible) */}
            {showPersonaPicker && (
              <div className="inline-persona-section">
                <AvatarSelector user={user} onUpdate={(updated) => setUser(updated)} />
              </div>
            )}
          </section>
        </div>

        {/* 4. Footer Banner */}
        <footer className="choose-level-footer">
          3. Choose Level Form UI
        </footer>
      </div>
    </main>
  );
}
