import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLeaderboard, getCurrentUser } from "../services/authService";
import BananaBackground from "../components/BananaBackground";
import { MonkeyBannerIllustration } from "../components/LevelIllustrations";
import { AVATAR_OPTIONS } from "../components/AvatarSelector";
import { playClickSound } from "../utils/audio";

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState("allTime"); // "daily" | "weekly" | "allTime"
  const [leaders, setLeaders] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Load current user and leaderboard for selected timeframe
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res?.user) setUser(res.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(timeframe)
      .then((res) => {
        setLeaders(res.leaderboard || []);
        if (res.myStats) {
          setMyStats(res.myStats);
        }
      })
      .catch((err) => {
        console.error("Could not load leaderboard:", err);
      })
      .finally(() => setLoading(false));
  }, [timeframe]);

  const getAvatarEmoji = (avatarId) => {
    const match = AVATAR_OPTIONS.find((a) => a.id === avatarId);
    return match ? match.emoji : "🍌";
  };

  const currentAvatarId = user?.avatar || myStats?.avatar || "banana-warrior";
  const currentAvatarEmoji = getAvatarEmoji(currentAvatarId);

  return (
    <main className="dashboard-page banana-theme-page">
      <BananaBackground />

      <div className="banana-quest-window">
        {/* =========================================================================
            TOP NAVIGATION BAR
            ========================================================================= */}
        <header className="banana-topbar">
          <div className="banana-topbar-left">
            <div className="banana-window-title">
              <Link to="/" className="banana-brand-text" aria-label="Banana Quest home">
                BANANA QUEST
              </Link>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="banana-nav-tabs">
            <button
              className="banana-tab-btn"
              onClick={() => {
                playClickSound();
                navigate("/dashboard");
              }}
            >
              <span className="nav-icon">🗺️</span> Choose Level
            </button>
            <button
              className="banana-tab-btn"
              onClick={() => {
                playClickSound();
                navigate("/dashboard");
              }}
            >
              <span className="nav-icon">🎮</span> Game
            </button>
            <button className="banana-tab-btn tab-active">
              <span className="nav-icon">🏆</span> Leaderboard
            </button>
          </nav>

          {/* Right Side: Back to Hub */}
          <div className="banana-topbar-right">
            <button
              className="banana-back-btn"
              onClick={() => {
                playClickSound();
                navigate("/dashboard");
              }}
            >
              ⬅ Back to Dashboard
            </button>
          </div>
        </header>

        {/* =========================================================================
            MAIN LEADERBOARD BODY (Light Yellow & Neat Theme)
            ========================================================================= */}
        <div className="leaderboard-neat-container">
          {/* Header Title */}
          <div className="leaderboard-header-section">
            <div className="leaderboard-hero-card">
              <div className="leaderboard-mascot-box">
                <MonkeyBannerIllustration size={85} />
              </div>
              <div className="leaderboard-hero-text">
                <span className="leaderboard-eyebrow">WORLD HALL OF FAME</span>
                <h1>Banana Quest Leaderboard</h1>
                <p>The top equation solvers and banana champions across the jungle.</p>
              </div>
            </div>

            {/* =========================================================================
                MY POSITION & BEST SCORE BANNER (Requested by user)
                ========================================================================= */}
            <div className="my-position-card">
              <div className="my-position-avatar-wrap">
                <span className="my-avatar-icon">{currentAvatarEmoji}</span>
                <div className="my-position-badge">
                  #{myStats?.rank || 1}
                </div>
              </div>

              <div className="my-position-info">
                <div className="my-name-row">
                  <strong className="my-player-name">{user?.username || myStats?.username || "Alex"}</strong>
                  <span className="my-title-pill">{user?.title || myStats?.title || "Puzzle Explorer"}</span>
                </div>
                <div className="my-rank-status-line">
                  Jungle Rank: <strong>#{myStats?.rank || 1}</strong> on the Leaderboard
                </div>
              </div>

              <div className="my-stats-strip">
                <div className="my-stat-box">
                  <span className="stat-label">Best Score</span>
                  <strong className="stat-score-val">{myStats?.totalPoints ?? user?.totalPoints ?? 0} pts</strong>
                </div>
                <div className="my-stat-box">
                  <span className="stat-label">Streak</span>
                  <strong className="stat-streak-val">🔥 {myStats?.highestStreak ?? user?.highestStreak ?? 0}x</strong>
                </div>
                <div className="my-stat-box">
                  <span className="stat-label">Wins</span>
                  <strong className="stat-wins-val">🏆 {myStats?.gamesWon ?? user?.gamesWon ?? 0}</strong>
                </div>
              </div>
            </div>

            {/* =========================================================================
                TIMEFRAME SELECTOR (Daily / Weekly / All-Time)
                ========================================================================= */}
            <div className="leaderboard-filters-bar">
              <div className="timeframe-buttons-group">
                <button
                  type="button"
                  className={`timeframe-btn ${timeframe === "daily" ? "active-timeframe" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setTimeframe("daily");
                  }}
                >
                  ☀️ Daily Rankings
                </button>
                <button
                  type="button"
                  className={`timeframe-btn ${timeframe === "weekly" ? "active-timeframe" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setTimeframe("weekly");
                  }}
                >
                  📅 Weekly Champions
                </button>
                <button
                  type="button"
                  className={`timeframe-btn ${timeframe === "allTime" ? "active-timeframe" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setTimeframe("allTime");
                  }}
                >
                  👑 All-Time Legends
                </button>
              </div>

              <div className="filter-summary-note">
                {timeframe === "daily" && "Showing today's top Banana API solvers"}
                {timeframe === "weekly" && "Showing this week's highest point earners"}
                {timeframe === "allTime" && "Showing all-time jungle legends & records"}
              </div>
            </div>
          </div>

          {/* =========================================================================
              LEADERBOARD RANKINGS TABLE
              ========================================================================= */}
          {loading ? (
            <div className="leaderboard-loading-box">
              <span className="loading-banana-spin">🍌</span>
              <p>Fetching {timeframe} rankings from Banana Quest server...</p>
            </div>
          ) : (
            <div className="leaderboard-table-neat">
              <div className="table-head">
                <span className="th-rank">Rank</span>
                <span className="th-player">Player Persona</span>
                <span className="th-title">Title</span>
                <span className="th-score">Score</span>
                <span className="th-streak">Streak</span>
                <span className="th-wins">Wins</span>
              </div>

              <div className="table-body">
                {leaders.length === 0 ? (
                  <div className="empty-leaderboard-row">No players registered yet. Be the first to solve!</div>
                ) : (
                  leaders.map((p) => {
                    const isMe =
                      (user?._id && String(p.id) === String(user._id)) ||
                      p.username === (user?.username || "Alex");

                    const rankStyle =
                      p.rank === 1
                        ? "rank-first"
                        : p.rank === 2
                        ? "rank-second"
                        : p.rank === 3
                        ? "rank-third"
                        : "";

                    const rankBadge =
                      p.rank === 1 ? "🥇 1st" : p.rank === 2 ? "🥈 2nd" : p.rank === 3 ? "🥉 3rd" : `#${p.rank}`;

                    return (
                      <div
                        key={p.id || p.rank}
                        className={`table-row ${rankStyle} ${isMe ? "row-highlight-me" : ""}`}
                      >
                        <span className="col-rank">
                          <span className="rank-pill">{rankBadge}</span>
                        </span>

                        <div className="col-player">
                          <span className="player-avatar-icon">{getAvatarEmoji(p.avatar)}</span>
                          <div className="player-details-col">
                            <strong className="player-name">
                              {p.username}
                              {isMe && <span className="you-tag">YOU</span>}
                            </strong>
                          </div>
                        </div>

                        <span className="col-title">{p.title || "Banana Novice"}</span>

                        <strong className="col-score">
                          {p.totalPoints.toLocaleString()} <small>pts</small>
                        </strong>

                        <span className="col-streak">
                          🔥 {p.highestStreak}x
                        </span>

                        <span className="col-wins">
                          🏆 {p.gamesWon}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            FOOTER BANNER
            ========================================================================= */}
        <footer className="choose-level-footer gd-footer-cyan">
          Banana Quest - Hall of Fame & Rankings
        </footer>
      </div>
    </main>
  );
}
