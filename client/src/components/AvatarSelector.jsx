import React, { useState } from "react";
import { updateUserProfile } from "../services/authService";
import { playClickSound, playCorrectSound } from "../utils/audio";

export const AVATAR_OPTIONS = [
  { id: "banana-warrior", emoji: "⚔️🍌", name: "Banana Warrior", title: "Blade of Potassium" },
  { id: "king-banana", emoji: "👑🍌", name: "King Banana", title: "Royal High Peel" },
  { id: "cyber-banana", emoji: "🤖🍌", name: "Cyber Banana", title: "Neural Ape 3000" },
  { id: "ninja-banana", emoji: "🥷🍌", name: "Ninja Banana", title: "Shadow Slicer" },
  { id: "dj-banana", emoji: "🎧🍌", name: "DJ Peelz", title: "Beat Dropper" },
  { id: "space-banana", emoji: "🚀🍌", name: "Astro Banana", title: "Cosmic Explorer" },
  { id: "wizard-banana", emoji: "🧙‍♂️🍌", name: "Bananamancer", title: "Arcane Sage" },
  { id: "detective-banana", emoji: "🕵️🍌", name: "Inspector Peel", title: "Equation Sleuth" }
];

export default function AvatarSelector({ user, onUpdate }) {
  const [selected, setSelected] = useState(user.avatar || "banana-warrior");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSelect = async (avatarItem) => {
    playClickSound();
    setSelected(avatarItem.id);
    setSaving(true);
    setSuccess(false);

    try {
      const res = await updateUserProfile({
        avatar: avatarItem.id,
        title: avatarItem.title
      });
      playCorrectSound();
      setSuccess(true);
      if (onUpdate) onUpdate(res.user);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Avatar update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="avatar-selector-card">
      <div className="avatar-header">
        <div>
          <h3>Virtual Identity & Persona</h3>
          <p className="muted">Choose your banana avatar to represent you in multiplayer rooms and leaderboards.</p>
        </div>
        {success && <span className="save-success-badge">✨ Persona Saved!</span>}
      </div>

      <div className="avatar-grid">
        {AVATAR_OPTIONS.map((item) => {
          const isCurrent = selected === item.id;
          return (
            <button
              key={item.id}
              className={`avatar-option-btn ${isCurrent ? "active-avatar" : ""}`}
              onClick={() => handleSelect(item)}
              disabled={saving}
            >
              <span className="avatar-large-emoji">{item.emoji}</span>
              <span className="avatar-name">{item.name}</span>
              <span className="avatar-sub">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

