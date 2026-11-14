import React from "react";

/**
 * Modern, High-Quality Expressive Monkey Illustrations for Level Progression
 * - Easy: Young Junior Explorer Monkey (Emerald Theme, Sprout Badge, Thumbs Up)
 * - Medium: Pro Adventurer Monkey (Sapphire Theme, Aviator Goggles, Adventurer Jacket)
 * - Hard: Master Jungle King Monkey (Ruby/Gold Theme, Royal Jeweled Crown, Flame Aura)
 * - Locked: Mystery Vault Badge with Golden Padlock & Chains
 * - Banner: Hero Monkey Mascot holding a golden banana
 */

export function MonkeyBannerIllustration({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      <defs>
        <radialGradient id="bannerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="70%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </radialGradient>
        <filter id="bannerShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#78350F" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Background Badge with Glow */}
      <circle cx="80" cy="80" r="74" fill="url(#bannerGlow)" stroke="#F59E0B" strokeWidth="3" filter="url(#bannerShadow)" />

      {/* Decorative Golden Stars */}
      <polygon points="26,42 29,34 37,37 31,43 33,51 26,46 19,51 21,43 15,37 23,34" fill="#F59E0B" opacity="0.8" />
      <polygon points="134,42 137,34 145,37 139,43 141,51 134,46 127,51 129,43 123,37 131,34" fill="#F59E0B" opacity="0.8" />

      {/* Monkey Ears */}
      <circle cx="38" cy="74" r="18" fill="#78350F" />
      <circle cx="38" cy="74" r="11" fill="#FDE68A" />
      <circle cx="122" cy="74" r="18" fill="#78350F" />
      <circle cx="122" cy="74" r="11" fill="#FDE68A" />

      {/* Head */}
      <circle cx="80" cy="78" r="38" fill="#78350F" />

      {/* Golden Crown on Head */}
      <path d="M62 48 L68 32 L80 42 L92 32 L98 48 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="68" cy="32" r="2.5" fill="#EF4444" />
      <circle cx="80" cy="42" r="2.5" fill="#3B82F6" />
      <circle cx="92" cy="32" r="2.5" fill="#10B981" />
      <rect x="62" y="47" width="36" height="4" rx="2" fill="#D97706" />

      {/* Face Mask */}
      <ellipse cx="69" cy="74" rx="16" ry="17" fill="#FEF3C7" />
      <ellipse cx="91" cy="74" rx="16" ry="17" fill="#FEF3C7" />
      <ellipse cx="80" cy="86" rx="22" ry="17" fill="#FEF3C7" />

      {/* Big Friendly Eyes */}
      <ellipse cx="70" cy="73" rx="5.5" ry="6.5" fill="#1C1917" />
      <circle cx="72" cy="70" r="2" fill="#FFFFFF" />
      <ellipse cx="90" cy="73" rx="5.5" ry="6.5" fill="#1C1917" />
      <circle cx="92" cy="70" r="2" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <circle cx="58" cy="83" r="4.5" fill="#FCA5A5" opacity="0.7" />
      <circle cx="102" cy="83" r="4.5" fill="#FCA5A5" opacity="0.7" />

      {/* Cute Nose */}
      <ellipse cx="80" cy="81" rx="4" ry="2.8" fill="#78350F" />

      {/* Happy Open Smile */}
      <path d="M71 88 Q80 99 89 88" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="#EF4444" />

      {/* Glossy Golden Banana held */}
      <g transform="translate(14, 12)">
        <path
          d="M86 98 C94 82 110 70 126 74 C130 80 122 96 110 106 C100 114 90 108 86 98 Z"
          fill="#FACC15"
          stroke="#B45309"
          strokeWidth="2.5"
        />
        <circle cx="126" cy="74" r="3" fill="#65A30D" />
        <path d="M86 98 C83 102 79 104 76 105" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * EASY LEVEL - Junior Explorer Monkey
 * Green Theme • Scout Sprout Bandana • Cheerful Thumbs Up • Leaf Badge
 */
export function EasyMonkeyIllustration({ size = 95 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <defs>
        <radialGradient id="easyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0FDF4" />
          <stop offset="70%" stopColor="#DCFCE7" />
          <stop offset="100%" stopColor="#BBF7D0" />
        </radialGradient>
      </defs>

      {/* Emerald Badge Ring */}
      <circle cx="70" cy="70" r="64" fill="url(#easyGlow)" stroke="#10B981" strokeWidth="3" />
      <circle cx="70" cy="70" r="58" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Decorative Sprouts in Background */}
      <path d="M26 36 C22 28 32 24 36 30 C34 36 28 38 26 36 Z" fill="#10B981" opacity="0.8" />
      <path d="M114 36 C118 28 108 24 104 30 C106 36 112 38 114 36 Z" fill="#10B981" opacity="0.8" />

      {/* Ears */}
      <circle cx="34" cy="66" r="16" fill="#854D0E" />
      <circle cx="34" cy="66" r="10" fill="#FEF08A" />
      <circle cx="106" cy="66" r="16" fill="#854D0E" />
      <circle cx="106" cy="66" r="10" fill="#FEF08A" />

      {/* Head */}
      <circle cx="70" cy="68" r="35" fill="#854D0E" />

      {/* Green Explorer Headband with Golden Leaf Badge */}
      <path d="M38 52 Q70 42 102 52 L103 60 Q70 50 37 60 Z" fill="#10B981" />
      <circle cx="70" cy="51" r="5" fill="#FACC15" stroke="#047857" strokeWidth="1.5" />
      <path d="M68 47 Q70 43 72 47" stroke="#047857" strokeWidth="1.5" fill="none" />

      {/* Face Mask */}
      <ellipse cx="61" cy="66" rx="14" ry="15" fill="#FEF9C3" />
      <ellipse cx="79" cy="66" rx="14" ry="15" fill="#FEF9C3" />
      <ellipse cx="70" cy="76" rx="19" ry="15" fill="#FEF9C3" />

      {/* Sparkly Big Curious Eyes */}
      <ellipse cx="62" cy="65" rx="5" ry="6" fill="#064E3B" />
      <circle cx="64" cy="63" r="2" fill="#FFFFFF" />
      <ellipse cx="78" cy="65" rx="5" ry="6" fill="#064E3B" />
      <circle cx="80" cy="63" r="2" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <ellipse cx="51" cy="75" rx="5" ry="3" fill="#FCA5A5" opacity="0.8" />
      <ellipse cx="89" cy="75" rx="5" ry="3" fill="#FCA5A5" opacity="0.8" />

      {/* Nose */}
      <ellipse cx="70" cy="73" rx="3.5" ry="2.5" fill="#854D0E" />

      {/* Happy Big Open Smile */}
      <path d="M62 79 Q70 90 78 79" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" fill="#EF4444" />

      {/* Body */}
      <ellipse cx="70" cy="116" rx="24" ry="20" fill="#854D0E" />
      <ellipse cx="70" cy="118" rx="15" ry="14" fill="#FEF08A" />

      {/* Thumbs Up Hand on Right */}
      <g transform="translate(94, 82)">
        <path d="M8 22 C14 18 18 10 18 2 C18 -2 14 -2 12 2 L8 12" stroke="#854D0E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="12" cy="2" r="4" fill="#FEF08A" stroke="#854D0E" strokeWidth="1.5" />
        <path d="M8 8 L14 8" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Level Tier Ribbon */}
      <rect x="42" y="122" width="56" height="15" rx="7.5" fill="#10B981" />
      <text x="70" y="133" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">LEVEL 1</text>
    </svg>
  );
}

/**
 * MEDIUM LEVEL - Pro Adventurer Monkey
 * Sapphire Blue Theme • Aviator Goggles • Cool Confident Smirk • Compass Star
 */
export function MediumMonkeyIllustration({ size = 95 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <defs>
        <radialGradient id="medGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="70%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </radialGradient>
      </defs>

      {/* Sapphire Badge Ring */}
      <circle cx="70" cy="70" r="64" fill="url(#medGlow)" stroke="#3B82F6" strokeWidth="3" />
      <circle cx="70" cy="70" r="58" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Adventure Stars */}
      <polygon points="26,38 29,32 35,34 30,39 32,45 26,41 20,45 22,39 17,34 23,32" fill="#3B82F6" opacity="0.8" />
      <polygon points="114,38 117,32 123,34 118,39 120,45 114,41 108,45 110,39 105,34 111,32" fill="#3B82F6" opacity="0.8" />

      {/* Ears */}
      <circle cx="34" cy="66" r="16" fill="#713F12" />
      <circle cx="34" cy="66" r="10" fill="#FEF08A" />
      <circle cx="106" cy="66" r="16" fill="#713F12" />
      <circle cx="106" cy="66" r="10" fill="#FEF08A" />

      {/* Head */}
      <circle cx="70" cy="68" r="35" fill="#713F12" />

      {/* Cool Aviator Goggles on Forehead */}
      <rect x="42" y="44" width="56" height="10" rx="4" fill="#1E3A8A" />
      {/* Left Lens */}
      <circle cx="56" cy="48" r="9" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2.5" />
      <path d="M52 44 L60 52" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
      {/* Right Lens */}
      <circle cx="84" cy="48" r="9" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2.5" />
      <path d="M80 44 L88 52" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
      {/* Goggle Bridge */}
      <rect x="65" y="46" width="10" height="4" rx="2" fill="#1D4ED8" />

      {/* Face Mask */}
      <ellipse cx="61" cy="67" rx="14" ry="15" fill="#FEF9C3" />
      <ellipse cx="79" cy="67" rx="14" ry="15" fill="#FEF9C3" />
      <ellipse cx="70" cy="77" rx="19" ry="15" fill="#FEF9C3" />

      {/* Confident, Cool Winking Eyes */}
      {/* Left Eye: Focused wink */}
      <path d="M56 66 Q62 61 68 66" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Right Eye: Open bright blue sparkle */}
      <ellipse cx="79" cy="66" rx="5" ry="6" fill="#1E3A8A" />
      <circle cx="81" cy="64" r="2" fill="#FFFFFF" />

      {/* Nose */}
      <ellipse cx="70" cy="74" rx="3.5" ry="2.5" fill="#713F12" />

      {/* Confident Hero Smirk */}
      <path d="M63 81 Q70 86 78 80" stroke="#713F12" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Body with Adventurer Blue Vest */}
      <ellipse cx="70" cy="116" rx="24" ry="20" fill="#713F12" />
      <path d="M52 104 L60 134 M88 104 L80 134" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="70" cy="118" rx="11" ry="13" fill="#FEF08A" />

      {/* Level Tier Ribbon */}
      <rect x="42" y="122" width="56" height="15" rx="7.5" fill="#3B82F6" />
      <text x="70" y="133" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">LEVEL 2</text>
    </svg>
  );
}

/**
 * HARD LEVEL - Master Jungle King Monkey
 * Crimson / Gold Theme • Royal Jeweled Crown • Fiery Aura • Champion Cape
 */
export function HardMonkeyIllustration({ size = 95 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <defs>
        <radialGradient id="hardGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="70%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </radialGradient>
      </defs>

      {/* Fiery Gold/Red Ring */}
      <circle cx="70" cy="70" r="64" fill="url(#hardGlow)" stroke="#F97316" strokeWidth="3" />
      <circle cx="70" cy="70" r="58" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Flame Particles */}
      <path d="M24 38 Q22 28 28 32 Q32 24 34 34 Z" fill="#EF4444" opacity="0.9" />
      <path d="M116 38 Q118 28 112 32 Q108 24 106 34 Z" fill="#EF4444" opacity="0.9" />

      {/* Ears */}
      <circle cx="34" cy="68" r="16" fill="#451A03" />
      <circle cx="34" cy="68" r="10" fill="#FDE047" />
      <circle cx="106" cy="68" r="16" fill="#451A03" />
      <circle cx="106" cy="68" r="10" fill="#FDE047" />

      {/* Head */}
      <circle cx="70" cy="70" r="35" fill="#451A03" />

      {/* Royal Jeweled Crown */}
      <path d="M48 44 L54 26 L64 36 L70 22 L76 36 L86 26 L92 44 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
      <rect x="48" y="42" width="44" height="6" rx="3" fill="#D97706" />
      {/* Crown Jewels */}
      <circle cx="70" cy="22" r="3" fill="#EF4444" />
      <circle cx="54" cy="26" r="2.5" fill="#3B82F6" />
      <circle cx="86" cy="26" r="2.5" fill="#10B981" />
      <circle cx="70" cy="45" r="2" fill="#EF4444" />

      {/* Face Mask */}
      <ellipse cx="61" cy="69" rx="14" ry="15" fill="#FEF08A" />
      <ellipse cx="79" cy="69" rx="14" ry="15" fill="#FEF08A" />
      <ellipse cx="70" cy="79" rx="19" ry="15" fill="#FEF08A" />

      {/* Intense Determined Master Eyes */}
      <ellipse cx="62" cy="68" rx="5" ry="6" fill="#7F1D1D" />
      <circle cx="64" cy="66" r="2" fill="#FFFFFF" />
      <ellipse cx="78" cy="68" rx="5" ry="6" fill="#7F1D1D" />
      <circle cx="80" cy="66" r="2" fill="#FFFFFF" />

      {/* Fierce Eyebrows */}
      <path d="M56 61 L67 65" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 61 L73 65" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="70" cy="76" rx="3.5" ry="2.5" fill="#451A03" />

      {/* Victorious Confident Grin */}
      <path d="M62 82 Q70 89 78 82" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="#DC2626" />

      {/* Body with Royal Crimson Cape & Gold Trim */}
      <ellipse cx="70" cy="116" rx="24" ry="20" fill="#451A03" />
      <path d="M48 106 L44 136 M92 106 L96 136" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="70" cy="118" rx="11" ry="13" fill="#FDE047" />

      {/* Level Tier Ribbon */}
      <rect x="42" y="122" width="56" height="15" rx="7.5" fill="#DC2626" />
      <text x="70" y="133" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">LEVEL 3</text>
    </svg>
  );
}

/**
 * LOCKED LEVEL ILLUSTRATION
 * Sleek mystery card badge with a golden metallic padlock and chains
 */
export function LockedLevelIllustration({ size = 95, unlockLevel = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <defs>
        <radialGradient id="lockGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="70%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>
      </defs>

      {/* Shield/Badge Base */}
      <circle cx="70" cy="70" r="64" fill="url(#lockGlow)" stroke="#94A3B8" strokeWidth="2.5" />
      <circle cx="70" cy="70" r="58" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Mystery Monkey Silhouette */}
      <circle cx="70" cy="60" r="24" fill="#94A3B8" opacity="0.25" />
      <circle cx="48" cy="58" r="10" fill="#94A3B8" opacity="0.25" />
      <circle cx="92" cy="58" r="10" fill="#94A3B8" opacity="0.25" />

      {/* Golden Metallic Padlock */}
      <g transform="translate(45, 42)">
        {/* Shackle */}
        <path
          d="M15 26 V16 C15 7.7 21.7 1 30 1 C38.3 1 45 7.7 45 16 V26"
          stroke="#F59E0B"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Padlock Body */}
        <rect x="6" y="24" width="48" height="38" rx="8" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
        <rect x="12" y="30" width="36" height="4" rx="2" fill="#FDE68A" />
        {/* Keyhole */}
        <circle cx="30" cy="40" r="4.5" fill="#78350F" />
        <path d="M28 42 L32 42 L33 51 L27 51 Z" fill="#78350F" />
      </g>

      {/* Unlock Requirement Tag */}
      <rect x="30" y="118" width="80" height="18" rx="9" fill="#475569" />
      <text x="70" y="131" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">
        UNLOCKS LVL {unlockLevel}
      </text>
    </svg>
  );
}
