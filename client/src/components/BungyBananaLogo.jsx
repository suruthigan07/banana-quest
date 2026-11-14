import React from "react";

/**
 * Modern, Short & Brandable Bungy Banana Logo
 * - Iconic Geometric Monogram: Curved energetic neon banana morphing into an elastic bungee loop ("B" silhouette)
 * - Ultra-clean cyber-arcade squircle badge with electric yellow & neon cyan palette
 * - Minimal, memorable, and highly brandable across small icons, headers, and app stores
 */
export default function BungyBananaLogo({
  size = 42,
  showText = true,
  shortText = false,
  className = "",
  orientation = "horizontal"
}) {
  return (
    <div
      className={`bungy-banana-logo ${orientation === "vertical" ? "logo-vertical" : "logo-horizontal"} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size > 40 ? "10px" : "8px",
        textDecoration: "none",
        userSelect: "none"
      }}
    >
      {/* Modern Vector Icon Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          filter: "drop-shadow(0 4px 12px rgba(234, 179, 8, 0.35))",
          transition: "transform 0.2s ease"
        }}
      >
        <defs>
          {/* Badge Background Gradient */}
          <linearGradient id="bbBadgeGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#090D16" />
          </linearGradient>

          {/* Electric Ripe Banana Gradient */}
          <linearGradient id="bbBananaGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A3E635" />   {/* Fresh zest green */}
            <stop offset="25%" stopColor="#FACC15" />  {/* Bright electric yellow */}
            <stop offset="70%" stopColor="#EAB308" />  {/* Golden ripe */}
            <stop offset="100%" stopColor="#CA8A04" /> {/* Warm arcade gold */}
          </linearGradient>

          {/* High-Tension Bungee Neon Glow */}
          <linearGradient id="bbBungeeGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* Shine Overlay */}
          <linearGradient id="bbShine" x1="25" y1="20" x2="65" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <filter id="bbGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle Brand Badge Frame */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="url(#bbBadgeGrad)"
          stroke="url(#bbBungeeGrad)"
          strokeWidth="2.5"
        />

        {/* Inner subtle glow ring */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="21"
          fill="none"
          stroke="#FACC15"
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />

        {/* Dynamic Bungee Spring Loop (forming stylized 'B' back-spine) */}
        <path
          d="M32 24 C32 20, 44 20, 48 24 L56 32 C66 42, 60 56, 46 54 C64 54, 70 70, 56 80 L44 82 C34 83, 30 76, 30 70"
          stroke="url(#bbBungeeGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Main Sculpted Modern Banana Curve (intertwined) */}
        <path
          d="M26 30 C30 18, 54 22, 68 36 C78 46, 78 62, 68 72 C56 84, 38 82, 28 68 C38 72, 54 68, 58 56 C62 44, 50 32, 26 30 Z"
          fill="url(#bbBananaGrad)"
          filter="url(#bbGlow)"
        />

        {/* Banana Stem (Zesty Green) */}
        <path
          d="M26 30 C23 27, 21 23, 20 18 C23 18, 27 21, 28 25 Z"
          fill="#84CC16"
        />

        {/* Modern Specular Highlight Ridge */}
        <path
          d="M36 29 C48 28, 62 38, 68 48 C64 42, 54 34, 40 32 Z"
          fill="url(#bbShine)"
        />

        {/* Elastic Bungee Bands Wrap (Modern minimalist neon stripes) */}
        <path
          d="M42 38 Q48 43 54 39"
          stroke="#06B6D4"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M43 38 Q48 43 53 39"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <path
          d="M48 54 Q56 59 62 53"
          stroke="#06B6D4"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M49 54 Q56 59 61 53"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Modern Spark Accent */}
        <circle cx="75" cy="27" r="3" fill="#FDE047" />
        <circle cx="28" cy="78" r="2" fill="#22D3EE" />
      </svg>

      {/* Short & Clean Brand Typography */}
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-arcade, 'Chakra Petch', 'Plus Jakarta Sans', sans-serif)",
                fontSize: size > 40 ? "20px" : "16px",
                fontWeight: "900",
                letterSpacing: "0.8px",
                background: "linear-gradient(180deg, #FFFFFF 20%, #FDE047 70%, #EAB308 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textTransform: "uppercase"
              }}
            >
              {shortText ? "BB" : "BUNGY BANANA"}
            </span>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 5px",
                borderRadius: "4px",
                background: "rgba(6, 182, 212, 0.15)",
                color: "#22D3EE",
                border: "1px solid rgba(6, 182, 212, 0.4)",
                fontWeight: "800",
                letterSpacing: "0.5px"
              }}
            >
              GAME
            </span>
          </div>
          {!shortText && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#94A3B8",
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                marginTop: "2px"
              }}
            >
              MATH ARCADE
            </span>
          )}
        </div>
      )}
    </div>
  );
}
