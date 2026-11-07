import React, { useEffect, useState } from "react";
import { getGameSocket } from "../services/socketService";
import { playClickSound } from "../utils/audio";

const REACTIONS = ["🍌", "🔥", "👑", "🚀", "😱", "🎉"];

export default function ReactionOverlay({ roomCode }) {
  const [floatingReactions, setFloatingReactions] = useState([]);

  useEffect(() => {
    if (!roomCode) return;
    const socket = getGameSocket();

    const handleReaction = (payload) => {
      const newReaction = {
        id: payload.id || `${Date.now()}-${Math.random()}`,
        emoji: payload.emoji,
        username: payload.username,
        x: 15 + Math.random() * 70 // percentage across screen
      };

      setFloatingReactions((prev) => [...prev.slice(-12), newReaction]);

      // Remove after 2.8s
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 2800);
    };

    socket.on("reaction:received", handleReaction);

    return () => {
      socket.off("reaction:received", handleReaction);
    };
  }, [roomCode]);

  const sendReaction = (emoji) => {
    playClickSound();
    const socket = getGameSocket();
    if (socket && socket.connected) {
      socket.emit("reaction:send", { roomCode, emoji });
    }
  };

  return (
    <div className="reaction-system-container">
      {/* Floating Reaction Bubbles */}
      <div className="floating-reactions-stage">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="floating-reaction-item"
            style={{ left: `${r.x}%` }}
          >
            <span className="reaction-emoji">{r.emoji}</span>
            <span className="reaction-user">{r.username}</span>
          </div>
        ))}
      </div>

      {/* Interactive Quick Reaction Bar */}
      <div className="reaction-bar">
        <span className="reaction-label">Quick Cheer:</span>
        <div className="reaction-buttons">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              className="reaction-btn"
              onClick={() => sendReaction(emoji)}
              title={`Send ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
