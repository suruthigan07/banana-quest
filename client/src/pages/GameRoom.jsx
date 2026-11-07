import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  getGame,
  startGame,
  submitAnswer,
  nextQuestion,
  getGameAnswers
} from "../services/gameService";
import { getGameSocket } from "../services/socketService";
import BananaMascot from "../components/BananaMascot";
import BananaBackground from "../components/BananaBackground";
import ReactionOverlay from "../components/ReactionOverlay";
import { AVATAR_OPTIONS } from "../components/AvatarSelector";
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playTimerTick,
  playStreakSound,
  playVictoryFanfare,
  isSoundEnabled,
  toggleSound
} from "../utils/audio";

export default function GameRoom({ user }) {
  const { roomCode } = useParams();

  const [game, setGame] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [answersHistory, setAnswersHistory] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mascotState, setMascotState] = useState("idle");
  const [copied, setCopied] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const prevRemainingSecRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const result = await getGame(roomCode);
      setGame(result.game);
      setRemaining(result.game.remainingMs || 0);

      if (result.game.status === "completed") {
        const history = await getGameAnswers(roomCode);
        setAnswersHistory(history.answers || []);
        triggerVictoryConfetti();
        playVictoryFanfare();
        setMascotState("celebrating");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this game room.");
    }
  }, [roomCode]);

  // WebSocket lifecycle listener
  useEffect(() => {
    const socket = getGameSocket();
    let active = true;

    const joinRoom = () => {
      socket.emit("room:join", roomCode, (response) => {
        if (!active) return;
        if (!response?.ok) setError(response?.message || "Could not join live game updates.");
        else refresh();
      });
    };

    const handleUpdate = (payload) => {
      if (payload?.roomCode === roomCode.toUpperCase()) {
        refresh();
      }
    };

    socket.on("connect", joinRoom);
    socket.on("game:updated", handleUpdate);
    socket.on("leaderboard:updated", handleUpdate);
    socket.on("player:answered", () => {
      refresh();
    });

    refresh();
    if (!socket.connected) socket.connect();
    else joinRoom();

    return () => {
      active = false;
      socket.off("connect", joinRoom);
      socket.off("game:updated", handleUpdate);
      socket.off("leaderboard:updated", handleUpdate);
    };
  }, [roomCode, refresh]);

  // Round countdown timer
  useEffect(() => {
    if (!game?.currentQuestion || game.hasAnswered || game.status !== "active") return;

    const interval = 250;
    const timer = window.setInterval(() => {
      setRemaining((prev) => {
        const nextVal = Math.max(0, prev - interval);
        const currentSec = Math.ceil(nextVal / 1000);

        // Play tick sound during final 4 seconds
        if (currentSec <= 4 && currentSec > 0 && currentSec !== prevRemainingSecRef.current) {
          prevRemainingSecRef.current = currentSec;
          playTimerTick();
        }
        return nextVal;
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [game?.currentQuestion?.id, game?.hasAnswered, game?.status]);

  // Physical keyboard hotkeys (0 - 9)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (game?.status !== "active" || game?.hasAnswered || remaining <= 0 || busy) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 0 && num <= 9) {
        handleAnswerSubmit(num);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game?.status, game?.hasAnswered, remaining, busy]);

  function triggerVictoryConfetti() {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FFE033", "#FFC800", "#4CAF50", "#FF5722"]
      });
    } catch {}
  }

  function handleSoundToggle() {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  }

  function copyRoomCode() {
    playClickSound();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleStart() {
    playClickSound();
    setBusy(true);
    setError("");
    try {
      const result = await startGame(roomCode);
      setGame(result.game);
      setRemaining(result.game.remainingMs || 0);
      playStreakSound(2);
      setMascotState("thinking");
    } catch (err) {
      setError(err.response?.data?.message || "Could not start game.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAnswerSubmit(index) {
    if (busy || game?.hasAnswered || remaining <= 0) return;

    setSelected(index);
    setBusy(true);
    setError("");

    try {
      const result = await submitAnswer(roomCode, index);
      setAnswerResult(result.result);
      setGame(result.game);
      setRemaining(result.game.remainingMs || 0);

      // Notify other players via socket
      const socket = getGameSocket();
      if (socket && socket.connected) {
        socket.emit("answer:submitted", { roomCode });
      }

      if (result.result.isCorrect) {
        playCorrectSound();
        triggerVictoryConfetti();
        if (result.result.currentStreak >= 2) {
          playStreakSound(result.result.currentStreak);
          setMascotState("streak");
        } else {
          setMascotState("dancing");
        }
      } else {
        playWrongSound();
        setMascotState("crying");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit answer.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleNextQuestion() {
    playClickSound();
    setBusy(true);
    setError("");
    try {
      const result = await nextQuestion(roomCode);
      setGame(result.game);
      setSelected(null);
      setAnswerResult(null);
      setRemaining(result.game.remainingMs || 0);
      setMascotState("thinking");
    } catch (err) {
      setError(err.response?.data?.message || "Next question not ready yet.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const getPlayerAvatarEmoji = (avatarId) => {
    const match = AVATAR_OPTIONS.find((a) => a.id === avatarId);
    return match ? match.emoji : "🍌";
  };

  if (!game) {
    return (
      <main className="game-page">
        <BananaBackground />
        <div className="game-panel loading-panel">
          <BananaMascot state="thinking" size={90} />
          <h2>Connecting to Banana Arena...</h2>
          <p className="muted">{error || "Loading live room state..."}</p>
        </div>
      </main>
    );
  }

  const isHost = game.isHost;
  const timeExpired = remaining <= 0;
  const canMoveNext =
    isHost &&
    game.status === "active" &&
    (timeExpired || game.answeredCount >= game.playerCount);

  const totalTime = (game.questionTimeLimitSeconds || 15) * 1000;
  const timerPercentage = Math.max(0, Math.min(100, (remaining / totalTime) * 100));
  const isUrgent = remaining <= 4500 && remaining > 0;

  // Streak calculation for current user
  const myPlayer = game.players.find((p) => p.userId === user.id) || {};
  const currentStreak = myPlayer.currentStreak || 0;

  return (
    <main className="game-page">
      <BananaBackground />
      <ReactionOverlay roomCode={game.roomCode} />

      {/* Top Header Bar */}
      <div className="game-topline">
        <Link to="/dashboard" className="back-link" onClick={playClickSound}>
          ← Exit to Dashboard
        </Link>
        <div className="topline-controls">
          <button className="sound-toggle-btn small" onClick={handleSoundToggle}>
            {soundOn ? "🔊" : "🔇"}
          </button>
          <div className="room-code-tag">
            ROOM: <strong>{game.roomCode}</strong>
          </div>
        </div>
      </div>

      {error && <div className="game-alert-banner">⚠️ {error}</div>}

      {/* ================= PHASE 1: WAITING ROOM ================= */}
      {game.status === "waiting" && (
        <section className="arcade-card waiting-card">
          <div className="waiting-hero">
            <BananaMascot state="idle" size={110} />
            <div>
              <p className="eyebrow">
                {game.isSolo ? "SOLO SPEEDRUN READY" : "MULTIPLAYER ARENA LOBBY"}
              </p>
              <h1>{game.isSolo ? "Ready for Banana Rush?" : "Assemble Your Banana Squad"}</h1>
              <p className="muted">
                {game.isSolo
                  ? "Test your reflexes and math precision against the live Marc Conrad Banana API."
                  : "Share this code with your friends to duel in real-time!"}
              </p>
            </div>
          </div>

          <div className="room-code-display-box" onClick={copyRoomCode} title="Click to copy code">
            <span className="code-label">INVITE ROOM CODE</span>
            <div className="code-value">{game.roomCode}</div>
            <span className="copy-hint">{copied ? "✅ Copied to Clipboard!" : "📋 Click to Copy"}</span>
          </div>

          <div className="players-lobby-section">
            <div className="section-title-row">
              <h3>
                Lobby Players ({game.playerCount}/{game.maxPlayers})
              </h3>
              <span className="live-pulse-dot">🟢 Live Sync Active</span>
            </div>

            <div className="players-grid">
              {game.players.map((p) => (
                <div key={p.userId} className="lobby-player-chip">
                  <span className="chip-avatar">{getPlayerAvatarEmoji(p.avatar)}</span>
                  <div className="chip-info">
                    <strong>{p.username} {p.userId === user.id ? "(You)" : ""}</strong>
                    <span className="chip-title">{p.title || "Banana Novice"}</span>
                  </div>
                  {p.isHost && <span className="host-badge">👑 Host</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="lobby-actions">
            {isHost ? (
              <button
                className="primary-button pulse-glow"
                disabled={busy}
                onClick={handleStart}
              >
                {busy ? "Starting Quest..." : "⚔️ START BANANA QUEST"}
              </button>
            ) : (
              <div className="guest-waiting-msg">
                <span className="spinner-icon">⏳</span> Waiting for the room host to start the game...
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= PHASE 2: ACTIVE GAMEPLAY ================= */}
      {game.status === "active" && game.currentQuestion && (
        <section className="arcade-card game-battle-card">
          {/* Battle Header */}
          <div className="battle-header">
            <div className="battle-header-left">
              <BananaMascot state={mascotState} size={65} />
              <div className="question-tracker">
                <span className="arcade-tag">
                  ROUND {game.currentQuestion.questionNumber} / {game.currentQuestion.totalQuestions}
                </span>
                <h2>{game.currentQuestion.category || "Banana API Equation"}</h2>
              </div>
            </div>

            {/* Circular Arcade Timer */}
            <div className={`arcade-timer ${isUrgent ? "urgent-timer" : ""}`}>
              <div
                className="timer-ring-fill"
                style={{
                  background: `conic-gradient(${isUrgent ? "#FF1744" : "#FFC107"} ${
                    timerPercentage * 3.6
                  }deg, #2A364F 0deg)`
                }}
              />
              <div className="timer-inner">
                <span className="timer-number">{Math.ceil(remaining / 1000)}</span>
                <span className="timer-sec">SEC</span>
              </div>
            </div>
          </div>

          {/* Streak Flame Banner */}
          <div className={`streak-banner ${currentStreak >= 2 ? "streak-active" : ""}`}>
            <span className="streak-icon">
              {currentStreak >= 5 ? "🔥👑" : currentStreak >= 3 ? "⚡" : "🍌"}
            </span>
            <span className="streak-text">
              {currentStreak >= 5
                ? `ULTRA BANANA FRENZY! ${currentStreak}x STREAK (+150 PTS BONUS)`
                : currentStreak >= 3
                ? `SUPER COMBO! ${currentStreak}x STREAK (+60 PTS BONUS)`
                : currentStreak === 2
                ? `2x COMBO STARTED (+30 PTS BONUS)`
                : `Answer quickly for maximum speed points!`}
            </span>
          </div>

          {/* Banana Equation Puzzle Card */}
          <div className="equation-stage">
            {game.currentQuestion.imageUrl ? (
              <div className="banana-image-frame">
                <img
                  src={game.currentQuestion.imageUrl}
                  alt="Marc Conrad Banana Equation Puzzle"
                  className="equation-image"
                />
                <span className="interop-tag">⚡ Live Interoperability: Marc Conrad Banana API</span>
              </div>
            ) : (
              <div className="text-question-box">
                <p>{game.currentQuestion.question}</p>
              </div>
            )}
            <p className="equation-prompt">
              🎯 Find the missing single digit solution (<strong>0 - 9</strong>):
            </p>
          </div>

          {/* Interactive Arcade Keypad (0 - 9) */}
          <div className="arcade-keypad">
            {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => {
              const num = parseInt(digit, 10);
              const isSelected = selected === num;
              return (
                <button
                  key={digit}
                  className={`keypad-btn ${isSelected ? "keypad-selected" : ""}`}
                  disabled={game.hasAnswered || timeExpired || busy}
                  onClick={() => handleAnswerSubmit(num)}
                  title={`Press ${digit} on keyboard`}
                >
                  <span className="keypad-digit">{digit}</span>
                  <span className="keypad-sub">KEY {digit}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Status & Points Feedback */}
          {game.hasAnswered && answerResult && (
            <div
              className={`answer-result-banner ${
                answerResult.isCorrect ? "result-correct" : "result-incorrect"
              }`}
            >
              <BananaMascot
                state={answerResult.isCorrect ? "dancing" : "crying"}
                size={65}
              />
              <div className="result-text-col">
                <strong>
                  {answerResult.isCorrect
                    ? `🎉 Correct! Solution is ${answerResult.correctAnswerIndex}`
                    : `❌ Solution was ${answerResult.correctAnswerIndex}`}
                </strong>
                <p>
                  Base: +{answerResult.basePoints} pts · Speed:{" "}
                  {(answerResult.responseTimeMs / 1000).toFixed(2)}s · Streak Bonus: +
                  {answerResult.bonusPoints} pts ={" "}
                  <strong>+{answerResult.totalPoints} TOTAL</strong>
                </p>
              </div>
            </div>
          )}

          {timeExpired && !game.hasAnswered && (
            <div className="answer-result-banner result-incorrect">
              <BananaMascot state="crying" size={60} />
              <div className="result-text-col">
                <strong>⏰ Time Expired!</strong>
                <p>No answer registered. Your combo streak has reset.</p>
              </div>
            </div>
          )}

          {/* Host Next Round Controls */}
          <div className="battle-footer">
            <span className="answered-status">
              Players submitted: <strong>{game.answeredCount} / {game.playerCount}</strong>
            </span>
            {isHost && (
              <button
                className="primary-button pulse-glow"
                disabled={!canMoveNext || busy}
                onClick={handleNextQuestion}
              >
                {busy
                  ? "Loading Next..."
                  : game.currentQuestion.questionNumber === game.currentQuestion.totalQuestions
                  ? "🏆 View Final Podium"
                  : "Next Banana Equation →"}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Live In-Game Leaderboard Strip */}
      {game.status === "active" && (
        <section className="arcade-card live-scores-card">
          <div className="scores-header">
            <h3>⚔️ Live Arena Standings</h3>
            <span className="realtime-badge">⚡ Real-time Socket.io</span>
          </div>
          <div className="scores-list">
            {game.players.map((p, index) => (
              <div
                key={p.userId}
                className={`score-row ${p.userId === user.id ? "current-player-row" : ""}`}
              >
                <span className="score-rank">#{index + 1}</span>
                <span className="score-avatar">{getPlayerAvatarEmoji(p.avatar)}</span>
                <div className="score-meta">
                  <strong>{p.username} {p.userId === user.id ? "(You)" : ""}</strong>
                  <span className="score-streak">
                    {p.currentStreak >= 2 ? `🔥 ${p.currentStreak}x Streak` : ""}
                  </span>
                </div>
                <strong className="score-points">{p.score} pts</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= PHASE 3: FINAL VICTORY PODIUM ================= */}
      {game.status === "completed" && (
        <section className="arcade-card victory-card">
          <div className="victory-hero">
            <BananaMascot state="celebrating" size={130} />
            <h1>QUEST COMPLETED!</h1>
            <p className="muted">
              Spectacular match! Here is how the Banana Masters ranked:
            </p>
          </div>

          {/* Animated Podium for Top 3 */}
          <div className="podium-stage">
            {game.players[1] && (
              <div className="podium-spot podium-second">
                <span className="podium-medal">🥈</span>
                <span className="podium-avatar">
                  {getPlayerAvatarEmoji(game.players[1].avatar)}
                </span>
                <strong>{game.players[1].username}</strong>
                <span className="podium-pts">{game.players[1].score} pts</span>
                <div className="podium-block block-2">2nd</div>
              </div>
            )}

            {game.players[0] && (
              <div className="podium-spot podium-first">
                <div className="podium-crown">👑</div>
                <span className="podium-medal">🥇</span>
                <span className="podium-avatar">
                  {getPlayerAvatarEmoji(game.players[0].avatar)}
                </span>
                <strong>{game.players[0].username}</strong>
                <span className="podium-pts">{game.players[0].score} pts</span>
                <div className="podium-block block-1">1st CHAMPION</div>
              </div>
            )}

            {game.players[2] && (
              <div className="podium-spot podium-third">
                <span className="podium-medal">🥉</span>
                <span className="podium-avatar">
                  {getPlayerAvatarEmoji(game.players[2].avatar)}
                </span>
                <strong>{game.players[2].username}</strong>
                <span className="podium-pts">{game.players[2].score} pts</span>
                <div className="podium-block block-3">3rd</div>
              </div>
            )}
          </div>

          {/* Match Answers Review */}
          <div className="answers-review-section">
            <h3>📝 Question-by-Question Breakdown</h3>
            <div className="history-list">
              {answersHistory.map((ans, idx) => (
                <div
                  key={idx}
                  className={`history-item ${ans.isCorrect ? "hist-correct" : "hist-wrong"}`}
                >
                  <div className="hist-meta">
                    <strong>
                      Round {idx + 1}: {ans.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                    </strong>
                    <span>
                      Your Answer: <strong>{ans.selectedAnswerIndex >= 0 ? ans.selectedAnswerIndex : "None"}</strong> · Solution: <strong>{ans.correctAnswerIndex}</strong>
                    </span>
                  </div>
                  <div className="hist-points">
                    <span>+ {ans.totalPoints} pts</span>
                    <small>{(ans.responseTimeMs / 1000).toFixed(2)}s</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="victory-cta-buttons">
            <Link to="/games/create" className="primary-button" onClick={playClickSound}>
              ⚔️ Play Another Quest
            </Link>
            <Link to="/dashboard" className="outline-button" onClick={playClickSound}>
              ← Return to Dashboard
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
