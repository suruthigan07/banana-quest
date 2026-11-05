import { Link, useNavigate } from "react-router-dom";

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await onLogout();
    navigate("/login");
  }

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <div className="brand"><span className="brand-mark small">QB</span> Quiz Battle</div>
        <button className="outline-button" onClick={handleLogout}>Log out</button>
      </header>

      <section className="welcome-panel">
        <p className="eyebrow">PLAYER DASHBOARD</p>
        <h1>Welcome, {user.username}!</h1>
        <p className="muted">Ready to challenge your friends?</p>
      </section>

      <section className="game-launch-grid">
        <Link to="/games/create" className="launch-card">
          <span className="launch-icon">＋</span>
          <strong>Create a game</strong>
          <span>Host a new quiz room and invite players.</span>
        </Link>
        <Link to="/games/join" className="launch-card">
          <span className="launch-icon">↗</span>
          <strong>Join a game</strong>
          <span>Enter a room code shared by your host.</span>
        </Link>
      </section>

      <section className="profile-card">
        {user.avatar
          ? <img className="avatar" src={user.avatar} alt="Player avatar" referrerPolicy="no-referrer" />
          : <div className="avatar avatar-placeholder">{user.username?.[0]?.toUpperCase()}</div>}
        <div className="profile-info">
          <h2>{user.username}</h2><p>{user.email}</p>
          <span className="status-pill">Authenticated player</span>
        </div>
      </section>
      <section className="stats-grid">
        <article className="stat-card"><span>Total points</span><strong>{user.totalPoints ?? 0}</strong></article>
        <article className="stat-card"><span>Games played</span><strong>{user.gamesPlayed ?? 0}</strong></article>
        <article className="stat-card"><span>Login methods</span><strong>{user.identities?.join(", ") || "local"}</strong></article>
      </section>
    </main>
  );
}
