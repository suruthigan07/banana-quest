import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getGame, startGame, submitAnswer, nextQuestion, getGameAnswers
} from "../services/gameService";
import { getGameSocket } from "../services/socketService";

export default function GameRoom({ user }) {
  const { roomCode } = useParams();
  const [game, setGame] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const result = await getGame(roomCode);
      setGame(result.game);
      setRemaining(result.game.remainingMs || 0);
      if (result.game.status === "completed") {
        const history = await getGameAnswers(roomCode);
        setAnswers(history.answers);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this game.");
    }
  }, [roomCode]);

  useEffect(() => {
    const socket = getGameSocket();
    let active = true;

    const joinRoom = () => {
      socket.emit("room:join", roomCode, (response) => {
        if (!active) return;
        if (!response?.ok) setError(response?.message || "Could not join live updates.");
        else refresh();
      });
    };
    const handleUpdate = (payload) => {
      if (payload?.roomCode === roomCode.toUpperCase()) refresh();
    };
    const handleConnectError = (err) => {
      if (active) setError(err.message || "Live connection failed. Check your login.");
    };

    socket.on("connect", joinRoom);
    socket.on("game:updated", handleUpdate);
    socket.on("leaderboard:updated", handleUpdate);
    socket.on("connect_error", handleConnectError);
    refresh();
    if (!socket.connected) socket.connect();
    else joinRoom();

    return () => {
      active = false;
      socket.off("connect", joinRoom);
      socket.off("game:updated", handleUpdate);
      socket.off("leaderboard:updated", handleUpdate);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [roomCode, refresh]);

  useEffect(() => {
    if (!game?.currentQuestion || game.hasAnswered) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 250));
    }, 250);
    return () => window.clearInterval(timer);
  }, [game?.currentQuestion?.id, game?.hasAnswered]);

  async function handleStart() {
    setBusy(true); setError("");
    try { const result = await startGame(roomCode); setGame(result.game); setRemaining(result.game.remainingMs); }
    catch (err) { setError(err.response?.data?.message || "Could not start game."); }
    finally { setBusy(false); }
  }

  async function handleAnswer(index) {
    if (busy || game?.hasAnswered || remaining <= 0) return;
    setSelected(index); setBusy(true); setError("");
    try {
      const result = await submitAnswer(roomCode, index);
      setAnswerResult(result.result);
      setGame(result.game);
      setRemaining(result.game.remainingMs || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit answer.");
      await refresh();
    } finally { setBusy(false); }
  }

  async function handleNext() {
    setBusy(true); setError("");
    try {
      const result = await nextQuestion(roomCode);
      setGame(result.game);
      setSelected(null);
      setAnswerResult(null);
      setRemaining(result.game.remainingMs || 0);
    } catch (err) {
      setError(err.response?.data?.message || "The next question is not ready yet.");
      await refresh();
    } finally { setBusy(false); }
  }

  if (!game) {
    return <main className="game-page"><div className="game-panel">{error || "Loading room..."}</div></main>;
  }

  const myPlayer = game.players.find((player) => player.userId === user.id);
  const isHost = game.isHost;
  const timeExpired = remaining <= 0;
  const canMoveNext = isHost && game.status === "active" &&
    (timeExpired || game.answeredCount >= game.playerCount);

  return (
    <main className="game-page">
      <div className="game-topline">
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
        <div className="room-code">ROOM <strong>{game.roomCode}</strong></div>
      </div>

      {error && <div className="alert">{error}</div>}

      {game.status === "waiting" && (
        <section className="game-panel">
          <p className="eyebrow">WAITING ROOM</p>
          <h1>Invite your players</h1>
          <div className="share-code">{game.roomCode}</div>
          <p className="muted">Share this code with friends so they can join your quiz.</p>
          <h2>Players ({game.playerCount}/{game.maxPlayers})</h2>
          <div className="player-list">
            {game.players.map((player) => <div className="player-row" key={player.userId}>
              <span>{player.username}</span>{player.isHost && <span className="identity-tag">Host</span>}
            </div>)}
          </div>
          {isHost
            ? <button className="primary-button" disabled={busy || game.playerCount < 2} onClick={handleStart}>
                {game.playerCount < 2 ? "Waiting for another player" : busy ? "Starting..." : "Start game"}
              </button>
            : <p className="muted">The host will start the game when everyone is ready.</p>}
        </section>
      )}

      {game.status === "active" && game.currentQuestion && (
        <section className="game-panel">
          <div className="game-heading">
            <div><p className="eyebrow">{game.currentQuestion.category} · {game.currentQuestion.difficulty}</p>
              <h1>Question {game.currentQuestion.questionNumber} of {game.currentQuestion.totalQuestions}</h1></div>
            <div className={`timer ${timeExpired ? "timer-ended" : ""}`}>{Math.ceil(remaining / 1000)}s</div>
          </div>
          <div className="timer-track"><div style={{ width: `${Math.max(0, Math.min(100, remaining / (game.questionTimeLimitSeconds * 1000) * 100))}%` }} /></div>
          <h2 className="question-text">{game.currentQuestion.question}</h2>
          <div className="answer-options">
            {game.currentQuestion.options.map((option, index) => (
              <button key={index}
                className={`answer-option ${selected === index ? "answer-selected" : ""}`}
                disabled={game.hasAnswered || timeExpired || busy}
                onClick={() => handleAnswer(index)}>
                <span>{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
          </div>

          {game.hasAnswered && answerResult && (
            <div className={`result-strip ${answerResult.isCorrect ? "correct" : "incorrect"}`}>
              {answerResult.isCorrect ? "Correct answer!" : "Answer submitted."}
              <strong> +{answerResult.totalPoints} points</strong>
              <p>Base: {answerResult.basePoints} · Streak bonus: {answerResult.bonusPoints}</p>
            </div>
          )}
          {game.hasAnswered && !answerResult && <p className="muted">Your answer is saved. Waiting for other players or the timer.</p>}
          {timeExpired && !game.hasAnswered && <p className="muted">Time is up. You did not submit an answer.</p>}

          <div className="game-actions">
            <span className="muted">Answered: {game.answeredCount}/{game.playerCount}</span>
            {isHost && <button className="primary-button" disabled={!canMoveNext || busy} onClick={handleNext}>
              {busy ? "Please wait..." : game.currentQuestion.questionNumber === game.currentQuestion.totalQuestions ? "Finish game" : "Next question"}
            </button>}
          </div>
        </section>
      )}

      {game.status === "active" && (
        <section className="game-panel leaderboard-panel">
          <h2>Live scores</h2>
          {game.players.map((player, index) => <div className="player-row" key={player.userId}>
            <span>#{index + 1} {player.username}{player.userId === user.id ? " (You)" : ""}</span>
            <strong>{player.score} pts</strong>
          </div>)}
        </section>
      )}

      {game.status === "completed" && (
        <section className="game-panel">
          <p className="eyebrow">QUIZ COMPLETED</p>
          <h1>Final leaderboard</h1>
          {game.players.map((player, index) => <div className="player-row final-row" key={player.userId}>
            <span>#{index + 1} {player.username}</span><strong>{player.score} pts</strong>
          </div>)}
          <h2>Your answer summary</h2>
          {answers.map((answer, index) => <div className="answer-history" key={index}>
            <strong>{index + 1}. {answer.question}</strong>
            <span>{answer.isCorrect ? "Correct" : "Incorrect"} · {answer.totalPoints} points · {(answer.responseTimeMs / 1000).toFixed(2)} sec</span>
          </div>)}
          <Link className="primary-link" to="/dashboard">Return to dashboard</Link>
        </section>
      )}
    </main>
  );
}
