import React from "react";

/**
 * BananaMascot Component
 * Clean, casual mascot with smooth, friendly animations.
 * 
 * States: "idle" | "dancing" | "celebrating" | "thinking" | "crying" | "streak"
 */
export default function BananaMascot({ state = "idle", size = 110, className = "" }) {
  if (state === "dancing" || state === "celebrating") {
    return (
      <div
        className={`banana-mascot mascot-dancing ${className}`}
        style={{ width: size, height: size, position: "relative", display: "inline-block" }}
      >
        <img
          src="/dancing-banana.gif"
          alt="Dancing Banana Mascot"
          className="mascot-gif"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))"
          }}
        />
        {state === "celebrating" && (
          <div className="mascot-crown-overlay">👑</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`banana-mascot mascot-${state} ${className}`}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        transition: "transform 0.25s ease"
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="mascot-svg"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}
      >
        <defs>
          <linearGradient id="bananaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="60%" stopColor="#FFC800" />
            <stop offset="100%" stopColor="#F5A623" />
          </linearGradient>
          <linearGradient id="peelTip" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8BC34A" />
            <stop offset="100%" stopColor="#689F38" />
          </linearGradient>
        </defs>

        {/* Banana Body */}
        <path
          d="M 50 155 C 30 110, 45 40, 110 30 C 145 25, 160 50, 150 75 C 135 115, 115 160, 50 155 Z"
          fill="url(#bananaGrad)"
          stroke="#D48800"
          strokeWidth="3"
          className="banana-body-path"
        />

        {/* Stem */}
        <path
          d="M 110 30 C 115 20, 125 15, 132 18 C 130 25, 125 30, 115 32 Z"
          fill="url(#peelTip)"
          stroke="#4A751F"
          strokeWidth="2"
        />

        {/* Tip Bottom */}
        <path
          d="M 50 155 C 44 162, 40 168, 36 172 C 34 165, 42 155, 50 155 Z"
          fill="#5D4037"
        />

        {/* Eyes based on state */}
        {state === "crying" ? (
          <g className="mascot-eyes-crying">
            <path d="M 85 75 Q 93 65 101 75" stroke="#263238" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 115 72 Q 123 62 131 72" stroke="#263238" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="88" cy="86" r="3.5" fill="#4FC3F7" />
            <circle cx="120" cy="83" r="3.5" fill="#4FC3F7" />
          </g>
        ) : state === "thinking" ? (
          <g className="mascot-eyes-thinking">
            <ellipse cx="93" cy="70" rx="5.5" ry="6.5" fill="#263238" />
            <circle cx="95" cy="67" r="2" fill="#FFF" />
            <ellipse cx="123" cy="67" rx="5.5" ry="4" fill="#263238" />
            <path d="M 85 58 Q 93 50 102 56" stroke="#263238" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 115 57 Q 123 57 131 59" stroke="#263238" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        ) : state === "streak" ? (
          <g className="mascot-eyes-streak">
            <ellipse cx="93" cy="70" rx="6" ry="7" fill="#E65100" />
            <circle cx="93" cy="70" r="3" fill="#FFEB3B" />
            <ellipse cx="123" cy="67" rx="6" ry="7" fill="#E65100" />
            <circle cx="123" cy="67" r="3" fill="#FFEB3B" />
          </g>
        ) : (
          <g className="mascot-eyes-normal">
            <ellipse cx="93" cy="70" rx="5.5" ry="6.5" fill="#263238" />
            <circle cx="95" cy="67" r="2.2" fill="#FFF" />
            <ellipse cx="123" cy="67" rx="5.5" ry="6.5" fill="#263238" />
            <circle cx="125" cy="64" r="2.2" fill="#FFF" />
          </g>
        )}

        {/* Mouth */}
        {state === "crying" ? (
          <path d="M 98 98 Q 108 88 118 98" stroke="#263238" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : state === "thinking" ? (
          <ellipse cx="108" cy="94" rx="4" ry="4" fill="#263238" />
        ) : (
          <g className="mascot-smile">
            <path d="M 95 90 Q 108 108 123 88" stroke="#263238" strokeWidth="3" fill="#E53935" strokeLinecap="round" />
            <path d="M 95 90 Q 108 97 123 88" fill="#FFF" />
          </g>
        )}

        {/* Soft Cheeks */}
        <ellipse cx="80" cy="82" rx="6" ry="3.5" fill="#FF8A80" opacity="0.55" />
        <ellipse cx="134" cy="78" rx="6" ry="3.5" fill="#FF8A80" opacity="0.55" />
      </svg>
    </div>
  );
}
