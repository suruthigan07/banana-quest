import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { joinGame } from "../services/gameService";

export default function JoinGame() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleJoin(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await joinGame(roomCode.trim().toUpperCase());
      navigate(`/game/${result.game.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not join this room.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="game-page">
      <Link to="/dashboard" className="back-link">← Dashboard</Link>
      <section className="game-panel narrow">
        <p className="eyebrow">JOIN YOUR FRIENDS</p>
        <h1>Enter room code</h1>
        <p className="muted">Ask the host for the six-character room code.</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleJoin}>
          <label>Room code</label>
          <input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
            placeholder="ABC123" minLength="6" maxLength="6" required />
          <button className="primary-button" disabled={busy || roomCode.length !== 6}>
            {busy ? "Joining..." : "Join room"}
          </button>
        </form>
      </section>
    </main>
  );
}
