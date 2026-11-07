import React from "react";

/**
 * High-quality, friendly cartoon monkey SVG illustrations
 * specifically matching the Choose Level Form UI specification:
 * 1. Header Monkey holding a banana
 * 2. Easy Monkey: Happy monkey waving
 * 3. Medium Monkey: Monkey wearing a blue backpack, ready for adventure
 * 4. Hard Monkey: Monkey wearing a red bandana, holding a red flag on a rock
 */

export function MonkeyBannerIllustration({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="80" r="74" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="3" />
      {/* Ears */}
      <circle cx="42" cy="72" r="18" fill="#8D5B4C" />
      <circle cx="42" cy="72" r="11" fill="#FBBF24" opacity="0.6" />
      <circle cx="118" cy="72" r="18" fill="#8D5B4C" />
      <circle cx="118" cy="72" r="11" fill="#FBBF24" opacity="0.6" />
      {/* Head */}
      <circle cx="80" cy="76" r="38" fill="#8D5B4C" />
      {/* Face heart/mask */}
      <ellipse cx="70" cy="72" rx="15" ry="17" fill="#FDE68A" />
      <ellipse cx="90" cy="72" rx="15" ry="17" fill="#FDE68A" />
      <ellipse cx="80" cy="84" rx="20" ry="16" fill="#FDE68A" />
      {/* Eyes */}
      <circle cx="71" cy="72" r="4.5" fill="#1E293B" />
      <circle cx="73" cy="70" r="1.5" fill="#FFF" />
      <circle cx="89" cy="72" r="4.5" fill="#1E293B" />
      <circle cx="91" cy="70" r="1.5" fill="#FFF" />
      {/* Nose */}
      <ellipse cx="80" cy="80" rx="3.5" ry="2.5" fill="#8D5B4C" />
      {/* Smile */}
      <path d="M72 87 Q80 96 88 87" stroke="#8D5B4C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Banana held by monkey */}
      <path
        d="M92 110 C98 96 112 85 128 88 C132 94 125 108 114 116 C105 122 96 118 92 110 Z"
        fill="#FACC15"
        stroke="#CA8A04"
        strokeWidth="2"
      />
      <circle cx="128" cy="88" r="2.5" fill="#65A30D" />
      {/* Banana tip */}
      <path d="M92 110 C90 113 88 115 85 116" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function EasyMonkeyIllustration({ size = 95 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      {/* Soft circular background badge */}
      <circle cx="70" cy="70" r="62" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2" />
      {/* Left Ear */}
      <circle cx="36" cy="65" r="15" fill="#8D5B4C" />
      <circle cx="36" cy="65" r="9" fill="#FDE68A" opacity="0.6" />
      {/* Right Ear */}
      <circle cx="104" cy="65" r="15" fill="#8D5B4C" />
      <circle cx="104" cy="65" r="9" fill="#FDE68A" opacity="0.6" />
      {/* Head */}
      <circle cx="70" cy="68" r="34" fill="#8D5B4C" />
      {/* Face Mask */}
      <ellipse cx="61" cy="64" rx="14" ry="15" fill="#FDE68A" />
      <ellipse cx="79" cy="64" rx="14" ry="15" fill="#FDE68A" />
      <ellipse cx="70" cy="75" rx="18" ry="14" fill="#FDE68A" />
      {/* Cheerful Eyes */}
      <circle cx="62" cy="64" r="4" fill="#065F46" />
      <circle cx="64" cy="62" r="1.5" fill="#FFF" />
      <circle cx="78" cy="64" r="4" fill="#065F46" />
      <circle cx="80" cy="62" r="1.5" fill="#FFF" />
      {/* Cheeks */}
      <ellipse cx="53" cy="74" rx="5" ry="3" fill="#FCA5A5" opacity="0.6" />
      <ellipse cx="87" cy="74" rx="5" ry="3" fill="#FCA5A5" opacity="0.6" />
      {/* Nose */}
      <ellipse cx="70" cy="72" rx="3" ry="2" fill="#8D5B4C" />
      {/* Big happy smile */}
      <path d="M63 78 Q70 88 77 78" stroke="#8D5B4C" strokeWidth="2.5" strokeLinecap="round" fill="#EF4444" />
      {/* Body */}
      <ellipse cx="70" cy="112" rx="22" ry="20" fill="#8D5B4C" />
      <ellipse cx="70" cy="114" rx="14" ry="13" fill="#FDE68A" />
      {/* Waving Arm (Right side arm raised up with open friendly hand) */}
      <path d="M88 105 C98 98 108 85 110 68" stroke="#8D5B4C" strokeWidth="8" strokeLinecap="round" />
      <circle cx="111" cy="65" r="7" fill="#8D5B4C" />
      <circle cx="113" cy="60" r="3" fill="#FDE68A" />
      <circle cx="117" cy="64" r="3" fill="#FDE68A" />
      {/* Left arm resting */}
      <path d="M52 105 C46 112 40 120 42 126" stroke="#8D5B4C" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function MediumMonkeyIllustration({ size = 95 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      {/* Soft circular background badge */}
      <circle cx="70" cy="70" r="62" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
      {/* Blue Backpack visible behind body and on shoulders */}
      <rect x="36" y="86" width="18" height="28" rx="8" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
      <rect x="86" y="86" width="18" height="28" rx="8" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
      {/* Left Ear */}
      <circle cx="36" cy="65" r="15" fill="#8D5B4C" />
      <circle cx="36" cy="65" r="9" fill="#FDE68A" opacity="0.6" />
      {/* Right Ear */}
      <circle cx="104" cy="65" r="15" fill="#8D5B4C" />
      <circle cx="104" cy="65" r="9" fill="#FDE68A" opacity="0.6" />
      {/* Head */}
      <circle cx="70" cy="68" r="34" fill="#8D5B4C" />
      {/* Face Mask */}
      <ellipse cx="61" cy="64" rx="14" ry="15" fill="#FDE68A" />
      <ellipse cx="79" cy="64" rx="14" ry="15" fill="#FDE68A" />
      <ellipse cx="70" cy="75" rx="18" ry="14" fill="#FDE68A" />
      {/* Explorer adventure cap */}
      <path d="M48 50 C52 36 88 36 92 50 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
      <ellipse cx="70" cy="50" rx="26" ry="6" fill="#1D4ED8" />
      {/* Curious, adventurous eyes */}
      <circle cx="62" cy="65" r="4" fill="#1E3A8A" />
      <circle cx="64" cy="63" r="1.5" fill="#FFF" />
      <circle cx="78" cy="65" r="4" fill="#1E3A8A" />
      <circle cx="80" cy="63" r="1.5" fill="#FFF" />
      {/* Nose */}
      <ellipse cx="70" cy="73" rx="3" ry="2" fill="#8D5B4C" />
      {/* Confident smile */}
      <path d="M64 79 Q70 85 76 79" stroke="#8D5B4C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Body */}
      <ellipse cx="70" cy="112" rx="22" ry="20" fill="#8D5B4C" />
      <ellipse cx="70" cy="114" rx="13" ry="13" fill="#FDE68A" />
      {/* Blue Backpack Straps over chest */}
      <path d="M54 94 L56 124" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
      <path d="M86 94 L84 124" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function HardMonkeyIllustration({ size = 95 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      {/* Soft circular background badge */}
      <circle cx="70" cy="70" r="62" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2" />
      {/* Rock at base */}
      <path d="M30 135 Q70 118 110 135 Z" fill="#64748B" stroke="#475569" strokeWidth="2" />
      {/* Red Flag Pole */}
      <line x1="96" y1="28" x2="96" y2="128" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      {/* Red Triangular Flag */}
      <path d="M96 30 L126 44 L96 58 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      {/* Left Ear */}
      <circle cx="36" cy="65" r="14" fill="#8D5B4C" />
      <circle cx="36" cy="65" r="8" fill="#FDE68A" opacity="0.6" />
      {/* Right Ear */}
      <circle cx="94" cy="65" r="14" fill="#8D5B4C" />
      <circle cx="94" cy="65" r="8" fill="#FDE68A" opacity="0.6" />
      {/* Head */}
      <circle cx="65" cy="68" r="32" fill="#8D5B4C" />
      {/* Red Bandana on Forehead */}
      <path d="M40 54 Q65 46 90 54 L91 63 Q65 55 39 63 Z" fill="#DC2626" />
      <circle cx="38" cy="60" r="3" fill="#DC2626" />
      {/* Bandana tie knot and tails */}
      <path d="M38 60 L28 66 M38 60 L30 72" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      {/* Face Mask */}
      <ellipse cx="57" cy="67" rx="12" ry="14" fill="#FDE68A" />
      <ellipse cx="73" cy="67" rx="12" ry="14" fill="#FDE68A" />
      <ellipse cx="65" cy="77" rx="16" ry="13" fill="#FDE68A" />
      {/* Determined Heroic Eyes */}
      <circle cx="58" cy="67" r="3.5" fill="#7F1D1D" />
      <circle cx="60" cy="65" r="1.2" fill="#FFF" />
      <circle cx="72" cy="67" r="3.5" fill="#7F1D1D" />
      <circle cx="74" cy="65" r="1.2" fill="#FFF" />
      {/* Nose */}
      <ellipse cx="65" cy="74" rx="2.8" ry="1.8" fill="#8D5B4C" />
      {/* Confident hero smirk */}
      <path d="M60 80 Q66 84 72 79" stroke="#8D5B4C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Body on Rock */}
      <ellipse cx="65" cy="112" rx="20" ry="18" fill="#8D5B4C" />
      <ellipse cx="65" cy="114" rx="12" ry="12" fill="#FDE68A" />
      {/* Hand holding the flag pole */}
      <ellipse cx="94" cy="92" rx="5" ry="4" fill="#FDE68A" stroke="#8D5B4C" strokeWidth="1.5" />
    </svg>
  );
}

