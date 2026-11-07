import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { joinGame } from "../services/gameService";
import BananaMascot from "../components/BananaMascot";
import BananaBackground from "../components/BananaBackground";
import { playClickSound, playStreakSound } from "../utils/audio";

export default function JoinGame() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleJoin(event) {
    event.preventDefault();
    playClickSound();
    setBusy(true);
    setError("");
    try {
      const cleanCode = roomCode.trim().toUpperCase();
      const result = await joinGame(cleanCode);
      playStreakSound(2);
      navigate(`/game/${result.game.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not find or join this room.");
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
        <span className="arcade-tag">JOIN ARENA LOBBY</span>
      </div>

      <section className="arcade-card form-card narrow-card">
        <div className="join-hero">
          <BananaMascot state="idle" size={90} />
          <p className="eyebrow">MULTIPLAYER MATCHMAKING</p>
          <h1>Enter Room Code</h1>
          <p className="muted">
            Ask the room host for their 6-character hex code to enter the live arena.
          </p>
        </div>

        {error && <div className="game-alert-banner">⚠️ {error}</div>}

        <form onSubmit={handleJoin} className="join-form">
          <div className="room-input-container">
            <input
              value={roomCode}
              onChange={(e) =>
                setRoomCode(
                  e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
                )
              }
              placeholder="e.g. A3F82C"
              minLength={6}
              maxLength={6}
              required
              className="big-arcade-input"
              autoFocus
            />
          </div>

          <button
            className="primary-button pulse-glow"
            disabled={busy || roomCode.length !== 6}
          >
            {busy ? "Connecting..." : "🚀 ENTER ARENA ROOM"}
          </button>
        </form>
      </section>
    </main>
  );
}
