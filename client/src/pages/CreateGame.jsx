import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createGame } from "../services/gameService";

export default function CreateGame() {
  const [settings, setSettings] = useState({
    category: "Mixed",
    questionCount: 5,
    maxPlayers: 8,
    timeLimitSeconds: 10
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function update(event) {
    setSettings({ ...settings, [event.target.name]: event.target.value });
  }

  async function handleCreate(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await createGame({
        ...settings,
        questionCount: Number(settings.questionCount),
        maxPlayers: Number(settings.maxPlayers),
        timeLimitSeconds: Number(settings.timeLimitSeconds)
      });
      navigate(`/game/${result.game.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create a game.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="game-page">
      <Link to="/dashboard" className="back-link">← Dashboard</Link>
      <section className="game-panel narrow">
        <p className="eyebrow">HOST A GAME</p>
        <h1>Create quiz room</h1>
        <p className="muted">Choose the game settings. You will receive a room code to share with friends.</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleCreate}>
          <label>Question category</label>
          <select name="category" value={settings.category} onChange={update}>
            <option>Mixed</option>
            <option>Programming</option>
            <option>Computer Science</option>
            <option>Web Development</option>
            <option>Databases</option>
            <option>Software Engineering</option>
            <option>Networking</option>
          </select>
          <label>Number of questions</label>
          <select name="questionCount" value={settings.questionCount} onChange={update}>
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="15">15 questions</option>
          </select>
          <label>Maximum players</label>
          <select name="maxPlayers" value={settings.maxPlayers} onChange={update}>
            <option value="2">2 players</option>
            <option value="4">4 players</option>
            <option value="8">8 players</option>
            <option value="12">12 players</option>
            <option value="20">20 players</option>
          </select>
          <label>Time per question</label>
          <select name="timeLimitSeconds" value={settings.timeLimitSeconds} onChange={update}>
            <option value="10">10 seconds</option>
            <option value="15">15 seconds</option>
            <option value="20">20 seconds</option>
            <option value="30">30 seconds</option>
          </select>
          <button className="primary-button" disabled={busy}>{busy ? "Creating..." : "Create room"}</button>
        </form>
      </section>
    </main>
  );
}
