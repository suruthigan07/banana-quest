import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import BananaBackground from "../components/BananaBackground";
import { AVATAR_OPTIONS } from "../components/AvatarSelector";
import BungyBananaLogo from "../components/BungyBananaLogo";
import {
  MonkeyBannerIllustration,
  EasyMonkeyIllustration,
  MediumMonkeyIllustration,
  HardMonkeyIllustration,
  LockedLevelIllustration
} from "../components/LevelIllustrations";
import { getRandomPuzzle } from "../services/gameService";
import { recordGameScore } from "../services/authService";
import {
  isSoundEnabled,
  toggleSound,
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playStreakSound
} from "../utils/audio";

const LEVEL_CONFIGS = {
  easy: {
    key: "easy",
    title: "Easy",
    minLevelRequired: 1,
    puzzlesCount: 1,
    rewardPoints: 30,
    timeLimit: 60,
    bulletPoints: [
      "Great for beginners",
      "Addition & Subtraction basics (+, −)",
      "1 Banana API equation",
      "Earn +30 points per level",
      "Unlocks Medium at Level 5"
    ],
    btnClass: "btn-easy",
    pillClass: "pill-easy",
    cardClass: "card-easy"
  },
  medium: {
    key: "medium",
    title: "Medium",
    minLevelRequired: 5,
    puzzlesCount: 2,
    rewardPoints: 60,
    timeLimit: 88,
    bulletPoints: [
      "Multiplication (×) & Division (÷)",
      "BODMAS order of operations",
      "2 Banana API equations",
      "Earn +60 points per level",
      "Unlocks Hard at Level 10"
    ],
    btnClass: "btn-medium",
    pillClass: "pill-medium",
    cardClass: "card-medium"
  },
  hard: {
    key: "hard",
    title: "Hard",
    minLevelRequired: 10,
    puzzlesCount: 3,
    rewardPoints: 100,
    timeLimit: 120,
    bulletPoints: [
      "Advanced Multi-Operator (×, ÷, +, −)",
      "Speed BODMAS calculations",
      "3 Banana API equations",
      "Earn +100 points per level",
      "🏆 Jungle Champion Trophy"
    ],
    btnClass: "btn-hard",
    pillClass: "pill-hard",
    cardClass: "card-hard"
  }
};

export default function Dashboard({ user: initialUser, onLogout }) {
  const user = initialUser;
  const userId = initialUser?.id || initialUser?._id || "guest";

  // 2-page flow: "levels" (Page 1: Choose Level Form UI) -> "game" (Page 2: Game Dashboard UI)
  const [currentPage, setCurrentPage] = useState("levels");
  const [selectedLevelKey, setSelectedLevelKey] = useState("easy");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Persistent Player Score & Progression
  const [score, setScore] = useState(() => {
    try {
      if (!localStorage.getItem("bq_v2_level_lock_reset")) {
        return 0;
      }
      const saved = localStorage.getItem(`bq_score_${userId}`);
      if (saved !== null && !isNaN(Number(saved))) {
        return Number(saved);
      }
    } catch (e) {}
    return 0;
  });

  // Current streak: starts with 0, checks and updates on answer/timeout
  const [streak, setStreak] = useState(0);

  // Lives: starts with 3 full hearts (3 lives)
  const [lives, setLives] = useState(3);

  // Heart Break Animation States: when a life is lost, show heart breaking first, then empty heart
  const [breakingHeartIndex, setBreakingHeartIndex] = useState(null);
  const [showHeartBreakAlert, setShowHeartBreakAlert] = useState(false);

  // Persistent Player Progression Level (Starts at 1: Level 1 = Easy, Level 5 = Medium Unlocked, Level 10 = Hard Unlocked)
  const [playerLevel, setPlayerLevel] = useState(() => {
    try {
      // Automatic fresh start reset so Medium & Hard lock again following leaderboard restart
      if (!localStorage.getItem("bq_v2_level_lock_reset")) {
        localStorage.setItem("bq_v2_level_lock_reset", "true");
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith("bq_level_")) localStorage.setItem(k, "1");
          if (k.startsWith("bq_score_")) localStorage.setItem(k, "0");
        });
        localStorage.setItem(`bq_level_${userId}`, "1");
        localStorage.setItem(`bq_score_${userId}`, "0");
        return 1;
      }
      const saved = localStorage.getItem(`bq_level_${userId}`);
      if (saved !== null && !isNaN(Number(saved))) {
        return Number(saved);
      }
    } catch (e) {}
    return 1;
  });

  // Day Streak: calendar-based login streak (distinct from answer combo streak)
  const [dayStreak, setDayStreak] = useState(() => {
    try {
      const uid = initialUser?.id || initialUser?._id || "guest";
      const savedStreak = localStorage.getItem(`bq_day_streak_${uid}`);
      const savedDate = localStorage.getItem(`bq_last_active_date_${uid}`);
      const today = new Date().toISOString().slice(0, 10);

      if (savedDate && savedStreak) {
        const lastDate = new Date(savedDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          return Number(savedStreak) || 1;
        } else if (diffDays === 1) {
          const newStreak = (Number(savedStreak) || 0) + 1;
          localStorage.setItem(`bq_day_streak_${uid}`, String(newStreak));
          localStorage.setItem(`bq_last_active_date_${uid}`, today);
          return newStreak;
        } else {
          // Streak broken - reset to 1
          localStorage.setItem(`bq_day_streak_${uid}`, "1");
          localStorage.setItem(`bq_last_active_date_${uid}`, today);
          return 1;
        }
      }

      // First visit
      localStorage.setItem(`bq_day_streak_${uid}`, "1");
      localStorage.setItem(`bq_last_active_date_${uid}`, today);
      return initialUser?.dayStreak || 1;
    } catch (e) {}
    return initialUser?.dayStreak || 1;
  });

  // Synchronize with backend user data on mount/update only if no local values exist
  useEffect(() => {
    if (initialUser) {
      const uid = initialUser.id || initialUser._id || "guest";
      const savedLevel = localStorage.getItem(`bq_level_${uid}`);
      const savedScore = localStorage.getItem(`bq_score_${uid}`);

      if (savedLevel === null && typeof initialUser.playerLevel === "number") {
        setPlayerLevel(initialUser.playerLevel);
      }
      if (savedScore === null && typeof initialUser.totalPoints === "number") {
        setScore(initialUser.totalPoints);
      }
    }
  }, [initialUser]);

  // Timer: counts down, strictly reduces ONLY 1 life on time out
  const [timerSeconds, setTimerSeconds] = useState(60);

  // Banana Game Puzzle state (ONLY Banana API equation, no cartoon puzzle)
  const [puzzleIndexInLevel, setPuzzleIndexInLevel] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [livePuzzle, setLivePuzzle] = useState(null);
  const [loadingPuzzle, setLoadingPuzzle] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [levelCompletedMessage, setLevelCompletedMessage] = useState(null);
  const [achievementCategory, setAchievementCategory] = useState("all");

  // Guard ref to guarantee strictly ONLY 1 life deduction per time out
  const timeoutHandledRef = useRef(false);

  // Recent Activity Feed matching the UI specification
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, text: "Correct answer!", time: "1 min ago", type: "success" },
    { id: 2, text: "Level 1 started", time: "2 min ago", type: "success" },
    { id: 3, text: "Loaded new puzzle from Banana API", time: "2 min ago", type: "info" },
    { id: 4, text: "Incorrect answer", time: "4 min ago", type: "error" },
    { id: 5, text: "Level 1 completed", time: "5 min ago", type: "success" }
  ]);

  const navigate = useNavigate();

  // Load a fresh Marc Conrad Banana API puzzle
  async function loadBananaPuzzle() {
    setLoadingPuzzle(true);
    try {
      const res = await getRandomPuzzle();
      if (res?.puzzle) {
        setLivePuzzle(res.puzzle);
        setRecentActivity((prev) => [
          {
            id: Date.now(),
            text: "Loaded new puzzle from Banana API",
            time: "Just now",
            type: "info"
          },
          ...prev.slice(0, 5)
        ]);
      }
    } catch (err) {
      console.warn("Banana API fallback notice:", err.message);
      // Fallback puzzle in case offline
      setLivePuzzle({
        imageUrl: "https://www.sanfoh.com/uob/banana/data/t2d6b18466c43301e0f9943042en95.png",
        solution: 5,
        source: "cached_fallback"
      });
    } finally {
      setLoadingPuzzle(false);
    }
  }

  // Pre-load on mount
  useEffect(() => {
    loadBananaPuzzle();
  }, []);

  const isGameOver = lives <= 0;

  // 5. Timer Countdown
  useEffect(() => {
    if (currentPage !== "game" || isGameOver) return;

    timeoutHandledRef.current = false;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPage, isGameOver]);

  // Deduct 1 life with visual heart-break animation sequence
  function deductLifeWithHeartBreak(reasonText, onDone) {
    if (lives <= 0) return;
    const targetHeartIdx = Math.max(0, lives - 1); // 2, 1, or 0
    setBreakingHeartIndex(targetHeartIdx);
    setShowHeartBreakAlert(true);
    playWrongSound();

    setTimeout(() => {
      setLives((prevLives) => {
        const nextLives = Math.max(0, prevLives - 1);
        setBreakingHeartIndex(null);
        setShowHeartBreakAlert(false);
        setFeedback({
          type: "error",
          text: `${reasonText} (${nextLives} ${nextLives === 1 ? "life" : "lives"} remaining)`
        });
        if (onDone) onDone(nextLives);
        return nextLives;
      });
    }, 850);
  }

  // Strict Single-Life Timeout Handler: triggers strictly ONLY 1 life decrease when timer reaches 0
  useEffect(() => {
    if (currentPage === "game" && timerSeconds === 0 && lives > 0 && !timeoutHandledRef.current) {
      timeoutHandledRef.current = true;
      setStreak(0); // Reset streak

      deductLifeWithHeartBreak("⏰ Time Out! You lost 1 life.", () => {
        setRecentActivity((act) => [
          {
            id: Date.now(),
            text: "Time Out! (-1 life 💔)",
            time: "Just now",
            type: "error"
          },
          ...act.slice(0, 5)
        ]);

        const limit = LEVEL_CONFIGS[selectedLevelKey]?.timeLimit || 60;
        setTimeout(() => {
          setTimerSeconds(limit);
          timeoutHandledRef.current = false;
        }, 50);
      });
    }
  }, [timerSeconds, currentPage, selectedLevelKey, lives]);

  async function handleLogout() {
    playClickSound();
    await onLogout();
    navigate("/login");
  }

  function handleSoundToggle() {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  }

  // Format timer seconds into mm:ss
  function formatTime(totalSec) {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Page 1 -> Page 2: Select Level and launch Banana Game
  function handleStartLevel(levelKey) {
    const config = LEVEL_CONFIGS[levelKey];
    if (playerLevel < config.minLevelRequired) {
      playWrongSound();
      setFeedback({
        type: "error",
        text: `🔒 ${config.title} is locked! Reach Level ${config.minLevelRequired} to unlock.`
      });
      return;
    }

    playClickSound();
    setSelectedLevelKey(levelKey);
    setPuzzleIndexInLevel(0);
    setLevelCompletedMessage(null);
    setFeedback(null);
    setUserAnswer("");

    setTimerSeconds(config.timeLimit);
    timeoutHandledRef.current = false;

    // Load fresh Banana API puzzle
    loadBananaPuzzle();

    // Transition to Page 2: Game Dashboard
    setCurrentPage("game");

    setRecentActivity((prev) => [
      {
        id: Date.now(),
        text: `Level ${config.title} started (${config.puzzlesCount} ${config.puzzlesCount === 1 ? "puzzle" : "puzzles"})`,
        time: "Just now",
        type: "success"
      },
      ...prev.slice(0, 5)
    ]);
  }

  // Submit Answer in Banana Game (supports direct digit click or form submit)
  function handleAnswerSubmit(digitValue) {
    if (submitting || lives <= 0 || !livePuzzle) return;

    const answerToCheck = digitValue !== undefined ? digitValue : userAnswer;
    const parsedAns = parseInt(answerToCheck, 10);
    if (isNaN(parsedAns)) return;

    setSubmitting(true);
    const expected = livePuzzle.solution;
    const currentConfig = LEVEL_CONFIGS[selectedLevelKey];

    if (parsedAns === expected) {
      // Correct!
      playCorrectSound();
      const isFinalPuzzle = puzzleIndexInLevel + 1 >= currentConfig.puzzlesCount;

      if (isFinalPuzzle) {
        // Entire Level Completed!
        playStreakSound(3);
        const earnedPoints = currentConfig.rewardPoints;
        const newScore = score + earnedPoints;
        const newStreak = streak + 1;

        // Level unlocking progression:
        // Each level clear advances playerLevel by 1
        // Level 5 unlocks Medium, Level 10 unlocks Hard
        let nextLevel = playerLevel + 1;

        setScore(newScore);
        setStreak(newStreak);
        setPlayerLevel(nextLevel);

        // Persistent save to browser local storage
        try {
          const uid = user?.id || user?._id || "guest";
          localStorage.setItem(`bq_score_${uid}`, String(newScore));
          localStorage.setItem(`bq_level_${uid}`, String(nextLevel));
        } catch (e) {}

        // Persistent sync to MongoDB server
        recordGameScore({
          pointsEarned: earnedPoints,
          playerLevel: nextLevel,
          streak: newStreak,
          dayStreak: dayStreak,
          won: true
        }).catch((err) => console.warn("Score sync notice:", err.message));

        let unlockMsg = "";
        if (playerLevel < 5 && nextLevel >= 5) {
          unlockMsg = " 🔓 MEDIUM DIFFICULTY UNLOCKED (Level 5 reached)!";
        } else if (playerLevel < 10 && nextLevel >= 10) {
          unlockMsg = " 👑 HARD DIFFICULTY UNLOCKED (Level 10 reached)!";
        }

        setLevelCompletedMessage(
          `🎉 Level Completed! You mastered ${currentConfig.title} and earned +${earnedPoints} Points!${unlockMsg}`
        );
        setFeedback({
          type: "success",
          text: `🎉 Correct answer (${expected})! ${currentConfig.title} level cleared! +${earnedPoints} Points`
        });

        setRecentActivity((prev) => [
          {
            id: Date.now(),
            text: `${currentConfig.title} level completed (+${earnedPoints} pts)`,
            time: "Just now",
            type: "success"
          },
          ...prev.slice(0, 5)
        ]);
      } else {
        // Solved one puzzle in multi-puzzle level
        const newScore = score + 10;
        const newStreak = streak + 1;
        setScore(newScore);
        setStreak(newStreak);

        try {
          const uid = user?.id || user?._id || "guest";
          localStorage.setItem(`bq_score_${uid}`, String(newScore));
        } catch (e) {}

        recordGameScore({
          pointsEarned: 10,
          streak: newStreak,
          won: false
        }).catch((err) => console.warn("Partial score sync notice:", err.message));

        setFeedback({
          type: "success",
          text: `🎉 Correct! Solved puzzle ${puzzleIndexInLevel + 1} of ${currentConfig.puzzlesCount}!`
        });
        setRecentActivity((prev) => [
          {
            id: Date.now(),
            text: `Solved puzzle ${puzzleIndexInLevel + 1}/${currentConfig.puzzlesCount}`,
            time: "Just now",
            type: "success"
          },
          ...prev.slice(0, 5)
        ]);
      }

      // Transition to next Banana API puzzle
      setTimeout(() => {
        setUserAnswer("");
        setFeedback(null);
        setSubmitting(false);

        if (isFinalPuzzle) {
          setPuzzleIndexInLevel(0);
        } else {
          setPuzzleIndexInLevel((p) => p + 1);
        }

        // Reset timer for next puzzle
        setTimerSeconds(currentConfig.timeLimit);
        timeoutHandledRef.current = false;
        loadBananaPuzzle();
      }, 1200);

    } else {
      // 3. Incorrect answer: Show heart break animation, then deduct 1 life
      setStreak(0); // Streak check: reset streak on wrong answer

      deductLifeWithHeartBreak(`❌ Incorrect answer (${parsedAns}).`, () => {
        setRecentActivity((prev) => [
          {
            id: Date.now(),
            text: "Incorrect answer (-1 life 💔)",
            time: "Just now",
            type: "error"
          },
          ...prev.slice(0, 5)
        ]);

        setTimeout(() => {
          setSubmitting(false);
        }, 300);
      });
    }
  }

  // Restart Challenge when lives reach 0 (or when user clicks Try Again / New Game)
  function handleRestartChallenge() {
    playClickSound();
    setLives(3);
    setBreakingHeartIndex(null);
    setShowHeartBreakAlert(false);
    setStreak(0);
    setUserAnswer("");
    setFeedback(null);
    setLevelCompletedMessage(null);
    setTimerSeconds(LEVEL_CONFIGS[selectedLevelKey]?.timeLimit || 60);
    timeoutHandledRef.current = false;
    setSubmitting(false);
    loadBananaPuzzle();

    setRecentActivity((prev) => [
      { id: Date.now(), text: "Challenge restarted (3 lives restored)", time: "Just now", type: "info" },
      ...prev.slice(0, 5)
    ]);
  }

  // Reset player progression back to Level 1 (locks Medium & Hard again)
  function handleResetProgression() {
    playClickSound();
    if (!window.confirm("Restart progress back to Level 1? Medium and Hard levels will be locked again.")) return;
    const uid = user?.id || user?._id || "guest";
    setPlayerLevel(1);
    setScore(0);
    setStreak(0);
    try {
      localStorage.setItem(`bq_level_${uid}`, "1");
      localStorage.setItem(`bq_score_${uid}`, "0");
      localStorage.setItem("bq_level_guest", "1");
      localStorage.setItem("bq_score_guest", "0");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("bq_level_")) localStorage.setItem(key, "1");
        if (key.startsWith("bq_score_")) localStorage.setItem(key, "0");
      });
    } catch (e) {}

    recordGameScore({
      pointsEarned: 0,
      playerLevel: 1,
      streak: 0,
      won: false
    }).catch(() => {});

    setFeedback({
      type: "info",
      text: "🔄 Progression reset to Level 1! Medium and Hard are now locked."
    });
    setRecentActivity((prev) => [
      { id: Date.now(), text: "Progression reset to Level 1 (Medium locked)", time: "Just now", type: "info" },
      ...prev.slice(0, 5)
    ]);
  }

  const currentAvatarInfo =
    AVATAR_OPTIONS.find((a) => a.id === user?.avatar) || AVATAR_OPTIONS[0];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Recently joined";
  const loginMethods = user?.identities?.length
    ? user.identities.map((identity) => identity[0].toUpperCase() + identity.slice(1)).join(", ")
    : "Not available";

  const currentConfig = LEVEL_CONFIGS[selectedLevelKey];

  const achievements = [
    {
      id: "first_peel",
      icon: "🍌",
      title: "First Peel",
      category: "beginner",
      description: "Solve your very first Banana API math equation.",
      requirement: 1,
      current: (score > 0 || streak > 0) ? 1 : 0,
      reward: 25,
      unlocked: (score > 0 || streak > 0)
    },
    {
      id: "banana_rookie",
      icon: "👶",
      title: "Banana Rookie",
      category: "beginner",
      description: "Play and complete an Easy Level challenge.",
      requirement: 1,
      current: playerLevel >= 5 ? 1 : 0,
      reward: 30,
      unlocked: playerLevel >= 5
    },
    {
      id: "puzzle_adventurer",
      icon: "🧭",
      title: "Puzzle Adventurer",
      category: "beginner",
      description: "Advance to Level 5 to unlock Medium difficulty.",
      requirement: 5,
      current: Math.min(5, playerLevel),
      reward: 50,
      unlocked: playerLevel >= 5
    },
    {
      id: "potassium_streak",
      icon: "🔥",
      title: "Potassium Streak",
      category: "streak",
      description: "Maintain a streak of 3 consecutive correct answers.",
      requirement: 3,
      current: Math.min(3, Math.max(streak, user?.highestStreak || 0)),
      reward: 60,
      unlocked: (streak >= 3 || (user?.highestStreak || 0) >= 3)
    },
    {
      id: "five_streak",
      icon: "⚡",
      title: "Unstoppable Combo",
      category: "streak",
      description: "Achieve a fiery 5-in-a-row correct puzzle streak.",
      requirement: 5,
      current: Math.min(5, Math.max(streak, user?.highestStreak || 0)),
      reward: 100,
      unlocked: (streak >= 5 || (user?.highestStreak || 0) >= 5)
    },
    {
      id: "backpack_explorer",
      icon: "🎒",
      title: "Backpack Explorer",
      category: "master",
      description: "Unlock and complete a Medium difficulty level (Level 5+).",
      requirement: 1,
      current: playerLevel >= 5 ? 1 : 0,
      reward: 80,
      unlocked: playerLevel >= 5
    },
    {
      id: "hardcore_climber",
      icon: "🧗",
      title: "Hardcore Climber",
      category: "master",
      description: "Conquer Hard difficulty (Level 10+, 3 puzzles • 100 pts).",
      requirement: 1,
      current: playerLevel >= 10 ? 1 : 0,
      reward: 150,
      unlocked: playerLevel >= 10
    },
    {
      id: "century_club",
      icon: "💯",
      title: "Century Club",
      category: "master",
      description: "Accumulate 100 or more Banana Points in total.",
      requirement: 100,
      current: Math.min(100, score),
      reward: 120,
      unlocked: score >= 100
    },
    {
      id: "math_mastermind",
      icon: "🧠",
      title: "Math Mastermind",
      category: "master",
      description: "Reach a grand total score of 250 Banana Points.",
      requirement: 250,
      current: Math.min(250, score),
      reward: 200,
      unlocked: score >= 250
    },
    {
      id: "clutch_survivor",
      icon: "🛡️",
      title: "Clutch Survivor",
      category: "streak",
      description: "Answer correctly when down to your final life ❤️.",
      requirement: 1,
      current: (lives === 1 && score > 0) ? 1 : 0,
      reward: 100,
      unlocked: (lives === 1 && score > 0)
    }
  ];

  return (
    <main className="dashboard-page banana-theme-page">
      <BananaBackground />

      <div className="banana-quest-window">
        {/* =========================================================================
            TOP NAVIGATION BAR (Title, Center Nav, Profile & Coins)
            ========================================================================= */}
        <header className="banana-topbar">
          <div className="banana-topbar-left">
            <div className="banana-window-title">
              <Link to="/" className="banana-brand-text" aria-label="Bungy Banana home">
                <BungyBananaLogo size={36} showText={true} />
              </Link>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="banana-nav-tabs">
            <button
              className={`banana-tab-btn ${currentPage === "levels" ? "tab-active" : ""}`}
              onClick={() => {
                playClickSound();
                setCurrentPage("levels");
              }}
            >
              <span className="nav-icon">🗺️</span> Choose Level
            </button>
            <button
              className={`banana-tab-btn ${currentPage === "game" ? "tab-active" : ""}`}
              onClick={() => {
                playClickSound();
                setCurrentPage("game");
              }}
            >
              <span className="nav-icon">🎮</span> Game
            </button>
            <button
              className="banana-tab-btn"
              onClick={() => {
                playClickSound();
                navigate("/leaderboard");
              }}
            >
              <span className="nav-icon">🏆</span> Leaderboard
            </button>
            <button
              className={`banana-tab-btn ${currentPage === "achievements" ? "tab-active" : ""}`}
              onClick={() => {
                playClickSound();
                setCurrentPage("achievements");
              }}
            >
              <span className="nav-icon">⭐</span> Achievements
            </button>
            <button
              className={`banana-tab-btn ${currentPage === "profile" ? "tab-active" : ""}`}
              onClick={() => {
                playClickSound();
                setCurrentPage("profile");
              }}
            >
              <span className="nav-icon">👤</span> Profile
            </button>
          </nav>

          {/* Right Side: Score Indicator (starts with 0) & User Dropdown */}
          <div className="banana-topbar-right">
            <div className="banana-score-pill" title="Your Banana Points">
              <span className="pill-coin">🪙</span>
              <strong className="pill-val">{score}</strong>
            </div>

            <span className="banana-mascot-fruit" title="Banana Power">🍌</span>

            <div className="banana-user-dropdown-container">
              <button
                className="banana-user-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <span className="banana-user-name">
                  {currentAvatarInfo?.emoji ? `${currentAvatarInfo.emoji} ` : ""}
                  {user?.username || "Alex"}
                </span>
                <span className="dropdown-caret">▼</span>
              </button>

              {showUserDropdown && (
                <div className="banana-dropdown-panel">
                  <div className="banana-dropdown-header">
                    <strong>{user?.username || "Alex"}</strong>
                    <small>{user?.email || "alex@banana.quest"}</small>
                  </div>
                  <button className="banana-dropdown-item" onClick={handleSoundToggle}>
                    {soundOn ? "🔊 Sound Effects: ON" : "🔇 Sound Effects: OFF"}
                  </button>
                  <button
                    className="banana-dropdown-item"
                    onClick={() => {
                      setCurrentPage("profile");
                      setShowUserDropdown(false);
                    }}
                  >
                    🎭 Switch Banana Avatar
                  </button>
                  <button className="banana-dropdown-item logout-item" onClick={handleLogout}>
                    🚪 Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =========================================================================
            PAGE 1: CHOOSE LEVEL FORM UI ("3. Choose Level Form UI")
            ========================================================================= */}
        {currentPage === "levels" && (
          <>
            <div className="banana-page1-body">
              {/* Left Sidebar: User Profile & Stats */}
              <aside className="banana-left-sidebar">
                <div className="sidebar-profile-card">
                  <div className="sidebar-monkey-wrap">
                    <BungyBananaLogo size={80} showText={false} />
                  </div>
                  <h3 className="sidebar-quest-title">BUNGY BANANA</h3>
                </div>

                <div className="banana-welcome-box">
                  <p>
                    Hello, <strong>{user?.username || "Alex"}</strong>! Choose a level to start playing and earn points!
                  </p>
                </div>

                <div className="banana-stats-box">
                  {/* Your Points: Starts at 0 */}
                  <div className="banana-stat-row">
                    <div className="banana-stat-icon-wrap coin-icon">🪙</div>
                    <div className="banana-stat-text">
                      <span className="stat-tiny-label">Your Points</span>
                      <strong className="stat-large-val">{score}</strong>
                    </div>
                  </div>

                  {/* Day Streak: Calendar-based login streak */}
                  <div className="banana-stat-row">
                    <div className="banana-stat-icon-wrap streak-icon">🔥</div>
                    <div className="banana-stat-text">
                      <span className="stat-tiny-label">Day Streak</span>
                      <strong className="stat-large-val">{dayStreak} {dayStreak === 1 ? "day" : "days"}</strong>
                    </div>
                  </div>

                  {/* Current Level Status */}
                  <div className="banana-stat-row">
                    <div className="banana-stat-icon-wrap" style={{ background: "rgba(250, 204, 21, 0.2)" }}>📊</div>
                    <div className="banana-stat-text">
                      <span className="stat-tiny-label">Player Level</span>
                      <strong className="stat-large-val">
                        Level {playerLevel}
                      </strong>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content Area: Level Selection */}
              <section className="banana-main-content">
                <div className="banana-level-heading-area">
                  <h1 className="banana-main-title">Choose a level</h1>
                  <p className="banana-main-subtitle">
                    Each level has a different number of puzzles and rewards. Reach Level 5 to unlock Medium!
                  </p>
                </div>

                {/* 3 Distinct Level Cards with Progression Locking */}
                <div className="banana-level-cards-grid">
                  {/* Card 1: Easy - Always Unlocked */}
                  <div className="banana-card-box card-easy">
                    <div className="level-art-wrap">
                      <EasyMonkeyIllustration size={90} />
                    </div>
                    <h2 className="level-card-name title-easy">Easy</h2>
                    <div className="level-pill-badge pill-easy">1 puzzle • 30 points</div>
                    <ul className="level-features-list">
                      <li>Junior Explorer tier</li>
                      <li>Addition & Subtraction basics (+, −)</li>
                      <li>1 Banana API equation</li>
                      <li>Earn +30 points per level</li>
                      <li>{playerLevel >= 5 ? "Medium Level Unlocked ✔" : "Unlocks Medium at Level 5"}</li>
                    </ul>
                    <button
                      type="button"
                      className="banana-card-btn btn-easy"
                      onClick={() => handleStartLevel("easy")}
                    >
                      Start Easy ▶
                    </button>
                  </div>

                  {/* Card 2: Medium - Unlocked at Level 5+ */}
                  <div className={`banana-card-box card-medium ${playerLevel < 5 ? "card-locked" : ""}`}>
                    <div className="level-art-wrap">
                      {playerLevel < 5 ? (
                        <LockedLevelIllustration size={90} unlockLevel={5} />
                      ) : (
                        <MediumMonkeyIllustration size={90} />
                      )}
                    </div>
                    <h2 className={`level-card-name ${playerLevel < 5 ? "title-locked" : "title-medium"}`}>
                      Medium {playerLevel < 5 && "🔒"}
                    </h2>
                    <div className={`level-pill-badge ${playerLevel < 5 ? "pill-locked" : "pill-medium"}`}>
                      {playerLevel < 5 ? "🔒 LOCKED • Reach Level 5" : "2 puzzles • 60 points"}
                    </div>
                    <ul className="level-features-list">
                      <li>{playerLevel < 5 ? "Reach Level 5 to unlock" : "Multiplication & Division tier"}</li>
                      <li>Includes Multiplication (×) & Division (÷)</li>
                      <li>2 Banana API puzzles</li>
                      <li>Earn +60 points per level</li>
                      <li>{playerLevel < 5 ? "Locked until Level 5" : "Unlocks Hard at Level 10"}</li>
                    </ul>
                    <button
                      type="button"
                      className={`banana-card-btn ${playerLevel < 5 ? "btn-locked" : "btn-medium"}`}
                      disabled={playerLevel < 5}
                      onClick={() => handleStartLevel("medium")}
                    >
                      {playerLevel < 5 ? "🔒 Locked (Reach Level 5)" : "Start Medium ▶"}
                    </button>
                  </div>

                  {/* Card 3: Hard - Unlocked at Level 10+ */}
                  <div className={`banana-card-box card-hard ${playerLevel < 10 ? "card-locked" : ""}`}>
                    <div className="level-art-wrap">
                      {playerLevel < 10 ? (
                        <LockedLevelIllustration size={90} unlockLevel={10} />
                      ) : (
                        <HardMonkeyIllustration size={90} />
                      )}
                    </div>
                    <h2 className={`level-card-name ${playerLevel < 10 ? "title-locked" : "title-hard"}`}>
                      Hard {playerLevel < 10 && "🔒"}
                    </h2>
                    <div className={`level-pill-badge ${playerLevel < 10 ? "pill-locked" : "pill-hard"}`}>
                      {playerLevel < 10 ? "🔒 LOCKED • Reach Level 10" : "3 puzzles • 100 points"}
                    </div>
                    <ul className="level-features-list">
                      <li>{playerLevel < 10 ? "Reach Level 10 to unlock" : "Master BODMAS Operator tier"}</li>
                      <li>Multi-Operator (×, ÷, +, −) equations</li>
                      <li>3 Banana API puzzles</li>
                      <li>Earn +100 points per level</li>
                      <li>{playerLevel < 10 ? "Locked until Level 10" : "🏆 Master Champion Trophy"}</li>
                    </ul>
                    <button
                      type="button"
                      className={`banana-card-btn ${playerLevel < 10 ? "btn-locked" : "btn-hard"}`}
                      disabled={playerLevel < 10}
                      onClick={() => handleStartLevel("hard")}
                    >
                      {playerLevel < 10 ? "🔒 Locked (Reach Level 10)" : "Start Hard ▶"}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {/* =========================================================================
            PAGE 2: GAME DASHBOARD ("4. Game Dashboard")
            ========================================================================= */}
        {currentPage === "game" && (
          <>
            <div className="banana-page2-body">
              {/* Left Sidebar: Player Statistics */}
              <aside className="banana-game-sidebar">
                {/* Score Card (Starts at 0) */}
                <div className="banana-widget-card score-widget">
                  <div className="widget-icon-wrap circle-score">
                    <span>🏆</span>
                  </div>
                  <div className="widget-text-col">
                    <span className="widget-label">Score</span>
                    <strong className="widget-value">{score}</strong>
                  </div>
                </div>

                {/* Lives Card (3 Hearts: ❤️❤️❤️, shows heart break 💔 animation then loss to 🤍) */}
                <div className="banana-widget-card lives-widget">
                  <div className="widget-icon-wrap circle-lives">
                    <span>{breakingHeartIndex !== null ? "💔" : "❤️"}</span>
                  </div>
                  <div className="widget-text-col">
                    <span className="widget-label">Lives ({lives}/3)</span>
                    <div className="banana-hearts-row">
                      {[1, 2, 3].map((heartNum, idx) => {
                        const isBreaking = breakingHeartIndex === idx;
                        const isFull = lives >= heartNum && !isBreaking;
                        return (
                          <span
                            key={heartNum}
                            className={`banana-heart ${isBreaking ? "heart-breaking" : isFull ? "full" : "empty"}`}
                            title={isBreaking ? "Heart breaking!" : isFull ? "Active life" : "Lost life"}
                          >
                            {isBreaking ? "💔" : isFull ? "❤️" : "🤍"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Level Card (Starts at Level 1) */}
                <div className="banana-widget-card level-widget">
                  <div className="widget-icon-wrap circle-level">
                    <span>📊</span>
                  </div>
                  <div className="widget-text-col">
                    <span className="widget-label">Level</span>
                    <strong className="widget-value">{playerLevel}</strong>
                    <span className="widget-subtitle">Puzzle Explorer</span>
                  </div>
                </div>

                {/* Timer Card (Decreases ONLY 1 life at 0 and announces Time Out) */}
                <div className="banana-widget-card timer-widget">
                  <div className="widget-icon-wrap circle-timer">
                    <span>⏱️</span>
                  </div>
                  <div className="widget-text-col">
                    <span className="widget-label">Timer</span>
                    <strong className="widget-value timer-digits">
                      {formatTime(timerSeconds)}
                    </strong>
                  </div>
                </div>
              </aside>

              {/* Main Content Area: Authentic Marc Conrad Banana Game Puzzle */}
              <section className="banana-challenge-area">
                {/* Back to Level Select Bar */}
                <div className="banana-nav-action-bar">
                  <button
                    type="button"
                    className="banana-back-btn"
                    onClick={() => {
                      playClickSound();
                      setCurrentPage("levels");
                    }}
                  >
                    ⬅ Choose Level
                  </button>

                  <div className="banana-level-pill-tag">
                    <span className="level-badge-chip">
                      LEVEL: {currentConfig.title.toUpperCase()}
                    </span>
                    <span className="level-progress-chip">
                      Puzzle {puzzleIndexInLevel + 1} of {currentConfig.puzzlesCount} • Reward: +{currentConfig.rewardPoints} Pts
                    </span>
                  </div>
                </div>

                {/* Level Cleared Message Banner */}
                {levelCompletedMessage && (
                  <div className="banana-celebration-banner">
                    <p>{levelCompletedMessage}</p>
                    <button
                      type="button"
                      className="banana-next-level-btn"
                      onClick={() => {
                        playClickSound();
                        setCurrentPage("levels");
                      }}
                    >
                      🗺️ Choose Next Level {playerLevel >= 10 ? "(Hard Unlocked! 👑)" : playerLevel >= 5 ? "(Medium Unlocked! 🔓)" : "▶"}
                    </button>
                  </div>
                )}

                {/* Banana Game Challenge Box */}
                <div className="banana-puzzle-card-neat">
                  <div className="banana-puzzle-header">
                    <h2>Banana Math Equation Challenge</h2>
                    <p>
                      Solve the equation using <strong>BODMAS</strong> rules (calculate Multiplication × & Division ÷ first) to find the missing single digit (0–9).
                    </p>
                  </div>

                  {/* Equation Visual Area (ONLY Banana Game Equation, NO cartoon puzzle) */}
                  <div className="banana-equation-stage">
                    {loadingPuzzle ? (
                      <div className="equation-loading-placeholder">
                        <span className="loading-banana-spinner">🍌</span>
                        <p>Fetching Banana API Equation...</p>
                      </div>
                    ) : livePuzzle?.imageUrl ? (
                      <div className="equation-image-card">
                        <div className="equation-badge-row">
                          <span className="equation-source-tag">⚡ Live Banana API Puzzle</span>
                          <span className="equation-hint-tag">📐 × & ÷ first (BODMAS)</span>
                          <span className="equation-hint-tag">Missing Digit: ? (0–9)</span>
                        </div>
                        <img
                          src={livePuzzle.imageUrl}
                          alt="Marc Conrad Banana Math Puzzle"
                          className="banana-equation-img"
                        />
                      </div>
                    ) : (
                      <div className="equation-loading-placeholder">
                        <p>Connecting to Banana API...</p>
                      </div>
                    )}
                  </div>

                  {/* Heart Break Visual Banner */}
                  {showHeartBreakAlert && (
                    <div className="heart-break-floating-alert">
                      <span className="heart-break-emoji-shake">💔</span>
                      <strong className="heart-break-text">HEART BROKEN! -1 LIFE</strong>
                    </div>
                  )}

                  {/* Feedback Banner (Correct, Wrong, or Time Out) */}
                  {feedback && (
                    <div className={`banana-feedback-box ${feedback.type}`}>
                      {feedback.text}
                    </div>
                  )}

                  {/* Quick Digit Selector Keypad (0 to 9) for Neat & Rapid Gameplay */}
                  <div className="banana-digit-keypad-panel">
                    <span className="keypad-title">Choose Solution (Digit 0–9):</span>
                    <div className="keypad-buttons-grid">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                        <button
                          key={digit}
                          type="button"
                          className={`digit-btn ${userAnswer === String(digit) ? "active-digit" : ""}`}
                          disabled={submitting || lives <= 0}
                          onClick={() => {
                            playClickSound();
                            setUserAnswer(String(digit));
                            handleAnswerSubmit(digit);
                          }}
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Numeric Input & Submit Button */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAnswerSubmit();
                    }}
                    className="banana-form-row"
                  >
                    <input
                      type="number"
                      min="0"
                      max="9"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter numeric answer (0-9)"
                      className="banana-input-field"
                      disabled={submitting || lives <= 0}
                    />

                    <button
                      type="submit"
                      className="banana-submit-action-btn"
                      disabled={submitting || !userAnswer.trim() || lives <= 0}
                    >
                      {submitting ? "Checking..." : "Submit Answer"}
                    </button>
                  </form>
                </div>
              </section>

              {/* Right Sidebar: System Info & Recent Activity Feed */}
              <aside className="banana-game-sidebar-right">
                {/* Banana API Connected Widget */}
                <div className="banana-sys-card">
                  <div className="banana-pill-status pill-green">
                    <span className="status-icon">🔗</span>
                    <span className="status-text">Banana API Connected</span>
                    <span className="status-check">✔</span>
                  </div>
                  <p className="sys-desc-text">Fetching puzzles from Banana API...</p>
                </div>

                {/* External API Widget */}
                <div className="banana-sys-card">
                  <div className="banana-pill-status pill-blue">
                    <span className="status-icon">⚙️</span>
                    <span className="status-text">Optional External API</span>
                    <span className="status-link">↗</span>
                  </div>
                  <p className="sys-desc-text">
                    This game can also use an external API for additional puzzles.
                  </p>
                </div>

                {/* Recent Activity Feed */}
                <div className="banana-sys-card activity-card">
                  <div className="activity-heading-row">
                    <span className="activity-clipboard">📋</span>
                    <h3>Recent Activity</h3>
                  </div>

                  <div className="activity-items-list">
                    {recentActivity.map((act) => (
                      <div key={act.id} className="activity-row">
                        <div className="activity-label-group">
                          <span className={`status-dot dot-${act.type}`} />
                          <span className="activity-text">{act.text}</span>
                        </div>
                        <span className="activity-time-tag">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* =========================================================================
            ACHIEVEMENTS TAB (Rich Interactive Achievements System)
            ========================================================================= */}
        {currentPage === "achievements" && (
          <>
            <div className="banana-achievements-container">
              {/* Header Hero */}
              <div className="achievements-hero-card">
                <div className="achievements-mascot-wrap">
                  <span className="achievements-mascot-emoji">🏅</span>
                </div>
                <div className="achievements-hero-info">
                  <span className="achievements-eyebrow">MILESTONES & REWARDS</span>
                  <h1>Jungle Achievements</h1>
                  <p>Unlock badges and earn Banana Coins by solving equations and mastering levels.</p>
                </div>
              </div>

              {/* Progress Summary Strip */}
              <div className="achievements-summary-strip">
                <div className="summary-stat-box">
                  <span className="summary-label">Unlocked</span>
                  <strong className="summary-value">
                    {achievements.filter((a) => a.unlocked).length} / {achievements.length}
                  </strong>
                </div>
                <div className="summary-stat-box">
                  <span className="summary-label">Coins Earned</span>
                  <strong className="summary-value coin-gold">
                    🪙 {achievements.filter((a) => a.unlocked).reduce((s, a) => s + a.reward, 0)}
                  </strong>
                </div>
                <div className="summary-progress-box">
                  <div className="progress-label-row">
                    <span>Overall Completion</span>
                    <strong>
                      {Math.round(
                        (achievements.filter((a) => a.unlocked).length / achievements.length) * 100
                      )}%
                    </strong>
                  </div>
                  <div className="overall-progress-bar">
                    <div
                      className="overall-progress-fill"
                      style={{
                        width: `${Math.round(
                          (achievements.filter((a) => a.unlocked).length / achievements.length) * 100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="achievements-filter-tabs">
                <button
                  type="button"
                  className={`achieve-filter-btn ${achievementCategory === "all" ? "filter-active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setAchievementCategory("all");
                  }}
                >
                  🌟 All ({achievements.length})
                </button>
                <button
                  type="button"
                  className={`achieve-filter-btn ${achievementCategory === "beginner" ? "filter-active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setAchievementCategory("beginner");
                  }}
                >
                  👶 Beginner ({achievements.filter((a) => a.category === "beginner").length})
                </button>
                <button
                  type="button"
                  className={`achieve-filter-btn ${achievementCategory === "streak" ? "filter-active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setAchievementCategory("streak");
                  }}
                >
                  🔥 Streaks ({achievements.filter((a) => a.category === "streak").length})
                </button>
                <button
                  type="button"
                  className={`achieve-filter-btn ${achievementCategory === "master" ? "filter-active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setAchievementCategory("master");
                  }}
                >
                  👑 Master ({achievements.filter((a) => a.category === "master").length})
                </button>
              </div>

              {/* Achievements Grid */}
              <div className="achievements-cards-grid">
                {achievements
                  .filter((a) => achievementCategory === "all" || a.category === achievementCategory)
                  .map((item) => {
                    const percent = Math.min(100, Math.round((item.current / item.requirement) * 100));

                    return (
                      <div
                        key={item.id}
                        className={`achievement-card-box ${item.unlocked ? "unlocked-card" : "locked-card"}`}
                      >
                        <div className="achievement-icon-wrapper">
                          <span className="achievement-badge-icon">{item.icon}</span>
                          {item.unlocked && <span className="achievement-check-badge">✔</span>}
                        </div>

                        <div className="achievement-content-col">
                          <div className="achievement-title-row">
                            <h3 className="achievement-card-title">{item.title}</h3>
                            <span className="achievement-reward-tag">+🪙 {item.reward}</span>
                          </div>

                          <p className="achievement-desc-text">{item.description}</p>

                          {/* Progress Meter */}
                          <div className="achievement-meter-container">
                            <div className="achievement-meter-bar">
                              <div
                                className={`achievement-meter-fill ${item.unlocked ? "fill-complete" : ""}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="achievement-meter-numbers">
                              {item.unlocked ? (
                                <strong className="unlocked-text">UNLOCKED</strong>
                              ) : (
                                `${item.current} / ${item.requirement}`
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        {/* =========================================================================
            PLAYER PROFILE TAB
            ========================================================================= */}
        {currentPage === "profile" && (
          <>
            <div className="banana-generic-container banana-profile-container">
              <section className="banana-profile-card">
                <div className="banana-profile-avatar" aria-hidden="true">
                  {currentAvatarInfo.emoji}
                </div>
                <p className="banana-profile-welcome">Welcome to Bungy Banana,</p>
                <h1 className="banana-profile-name">{user?.username || "Player"}!</h1>
                <p className="banana-profile-title">{user?.title || currentAvatarInfo.title}</p>

                <div className="banana-profile-stats">
                  <div className="banana-profile-stat">
                    <strong>{user?.totalPoints ?? 0}</strong>
                    <span>Total points</span>
                  </div>
                  <div className="banana-profile-stat">
                    <strong>{user?.bananaCoins ?? 0}</strong>
                    <span>Banana coins</span>
                  </div>
                  <div className="banana-profile-stat">
                    <strong>{user?.gamesPlayed ?? 0}</strong>
                    <span>Games played</span>
                  </div>
                  <div className="banana-profile-stat">
                    <strong>{user?.gamesWon ?? 0}</strong>
                    <span>Games won</span>
                  </div>
                  <div className="banana-profile-stat">
                    <strong>{user?.highestStreak ?? 0}</strong>
                    <span>Best streak</span>
                  </div>
                </div>

                <h2 className="banana-profile-section-title">Player details</h2>
                <div className="banana-profile-details">
                  <div className="banana-profile-detail">
                    <span>EMAIL</span>
                    <strong>{user?.email || "Not provided"}</strong>
                  </div>
                  <div className="banana-profile-detail">
                    <span>BANANA PERSONA</span>
                    <strong>{currentAvatarInfo.name}</strong>
                  </div>
                  <div className="banana-profile-detail">
                    <span>MEMBER SINCE</span>
                    <strong>{memberSince}</strong>
                  </div>
                  <div className="banana-profile-detail">
                    <span>SIGN-IN METHOD</span>
                    <strong>{loginMethods}</strong>
                  </div>
                </div>

                <div className="banana-profile-badges">
                  <h2 className="banana-profile-section-title">Badges earned</h2>
                  {user?.badges?.length ? (
                    <div className="banana-profile-badge-list">
                      {user.badges.map((badge) => (
                        <span className="banana-profile-badge" key={badge}>
                          🏅 {badge}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="banana-profile-empty">No badges earned yet. Play a game to get started!</p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}

        {/* =========================================================================
            OUT OF LIVES: POP-UP MODAL OVERLAY (Viewport Centered)
            ========================================================================= */}
        {lives <= 0 && (
          <div className="banana-gameover-overlay" role="dialog" aria-modal="true" aria-label="Game Over Dialog">
            <div className="banana-gameover-modal">
              <div className="go-skull-badge">
                <span className="go-skull-icon">💀</span>
                <span className="go-broken-heart">💔</span>
              </div>
              <h2 className="go-title">GAME OVER</h2>
              <p className="go-description">
                You lost all 3 lives! Don't worry — jungle champions dust off and try again!
              </p>

              <div className="go-summary-strip">
                <div className="go-stat-cell">
                  <span className="go-stat-label">TOTAL SCORE</span>
                  <strong className="go-stat-value">{score} pts</strong>
                </div>
                <div className="go-stat-cell">
                  <span className="go-stat-label">CURRENT LEVEL</span>
                  <strong className="go-stat-value">Level {playerLevel}</strong>
                </div>
                <div className="go-stat-cell">
                  <span className="go-stat-label">DIFFICULTY</span>
                  <strong className="go-stat-value">{currentConfig?.title || "Easy"}</strong>
                </div>
              </div>

              <div className="go-button-group">
                <button
                  type="button"
                  className="go-btn go-btn-retry"
                  onClick={handleRestartChallenge}
                >
                  🔄 Try Again (Restore 3 Lives)
                </button>
                <button
                  type="button"
                  className="go-btn go-btn-new-game"
                  onClick={() => {
                    handleRestartChallenge();
                    setCurrentPage("levels");
                  }}
                >
                  🗺️ Try New Game (Choose Level)
                </button>
                <button
                  type="button"
                  className="go-btn go-btn-leaderboard"
                  onClick={() => {
                    playClickSound();
                    navigate("/leaderboard");
                  }}
                >
                  🏆 View Leaderboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
