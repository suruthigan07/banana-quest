import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeaderboard } from "../services/authService";
import BananaMascot from "../components/BananaMascot";
import BananaBackground from "../components/BananaBackground";
import { AVATAR_OPTIONS } from "../components/AvatarSelector";
import { playClickSound } from "../utils/audio";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then((res) => setLeaders(res.leaderboard || []))
      .catch((err) => console.error("Could not load leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const getAvatarEmoji = (avatarId) => {
    const match = AVATAR_OPTIONS.find((a) => a.id === avatarId);
    return match ? match.emoji : "🍌";
  };

  return (
    <main className="game-page">
      <BananaBackground />
      <div className="game-topline">
        <Link to="/dashboard" className="back-link" onClick={playClickSound}>
          ← Back to Arcade Hub
        </Link>
        <span className="arcade-tag">GLOBAL BANANA HALL OF FAME</span>
      </div>

      <section className="leaderboard-container">
        <div className="leaderboard-hero">
          <BananaMascot state="idle" size={75} />
          <div>
            <p className="eyebrow">WORLD RANKINGS</p>
            <h1>Banana Quest Legends</h1>
            <p className="muted">The fastest equation solvers and combo champions in the jungle.</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading Hall of Fame...</div>
        ) : (
          <div className="leader-board-table">
            <div className="table-header-row">
              <span>Rank</span>
              <span>Player Persona</span>
              <span>Rank Title</span>
              <span>Score</span>
              <span>Wins</span>
              <span>Streak</span>
            </div>

            {leaders.map((p) => {
              const rankClass =
                p.rank === 1 ? "rank-gold" : p.rank === 2 ? "rank-silver" : p.rank === 3 ? "rank-bronze" : "";
              const rankIcon =
                p.rank === 1 ? "🥇 1st" : p.rank === 2 ? "🥈 2nd" : p.rank === 3 ? "🥉 3rd" : `#${p.rank}`;

              return (
                <div key={p.id} className={`leader-row ${rankClass}`}>
                  <span className="rank-badge">{rankIcon}</span>
                  <div className="player-col">
                    <span className="persona-emoji">{getAvatarEmoji(p.avatar)}</span>
                    <div>
                      <strong>{p.username}</strong>
                    </div>
                  </div>
                  <span className="title-col">{p.title || "Banana Novice"}</span>
                  <strong className="score-col">{p.totalPoints.toLocaleString()} pts</strong>
                  <span className="wins-col">🏆 {p.gamesWon}</span>
                  <span className="streak-col">🔥 {p.highestStreak}x</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="leaderboard-cta">
          <Link to="/games/create" className="primary-button" onClick={playClickSound}>
            ⚔️ Challenge the Leaderboard Now
          </Link>
        </div>
      </section>
    </main>
  );
}

