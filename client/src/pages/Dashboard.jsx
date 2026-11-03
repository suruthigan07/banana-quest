import { useNavigate } from "react-router-dom";

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
        <p className="muted">Your player identity is connected and your session is active.</p>
      </section>

      <section className="profile-card">
        {user.avatar
          ? <img className="avatar" src={user.avatar} alt="Player avatar" referrerPolicy="no-referrer" />
          : <div className="avatar avatar-placeholder">{user.username?.[0]?.toUpperCase()}</div>}
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <span className="status-pill">Authenticated player</span>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card"><span>Total points</span><strong>{user.totalPoints ?? 0}</strong></article>
        <article className="stat-card"><span>Games played</span><strong>{user.gamesPlayed ?? 0}</strong></article>
        <article className="stat-card"><span>Login methods</span><strong>{user.identities?.join(", ") || "local"}</strong></article>
      </section>

      <section className="identity-card">
        <h2>Virtual identity</h2>
        <p className="muted">These are the sign-in identities connected to your Quiz Battle account.</p>
        <div className="identity-list">
          {(user.identities || []).map((provider) => (
            <span className="identity-tag" key={provider}>{provider}</span>
          ))}
        </div>
        <p className="small-note">Your account ID: {user.id}</p>
      </section>
    </main>
  );
}
