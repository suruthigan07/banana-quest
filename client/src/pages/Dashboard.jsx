import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BananaBackground from "../components/BananaBackground";
import AvatarSelector, { AVATAR_OPTIONS } from "../components/AvatarSelector";
import {
  MonkeyBannerIllustration,
  EasyMonkeyIllustration,
  MediumMonkeyIllustration,
  HardMonkeyIllustration
} from "../components/LevelIllustrations";
import { getRandomPuzzle } from "../services/gameService";
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
    puzzlesCount: 1,
    rewardPoints: 10,
    timeLimit: 60,
    bulletPoints: ["Great for beginners", "1 Banana API puzzle", "Earn 10 points"],
    btnClass: "btn-easy",
    pillClass: "pill-easy",
    cardClass: "card-easy"
  },
  medium: {
    key: "medium",
    title: "Medium",
    puzzlesCount: 2,
    rewardPoints: 25,
    timeLimit: 88,
    bulletPoints: ["A bit more challenging", "2 Banana API puzzles", "Earn 25 points"],
    btnClass: "btn-medium",
    pillClass: "pill-medium",
    cardClass: "card-medium"
  },
  hard: {
    key: "hard",
    title: "Hard",
    puzzlesCount: 3,
    rewardPoints: 45,
    timeLimit: 120,
    bulletPoints: ["For experienced players", "3 Banana API puzzles", "Earn 45 points"],
    btnClass: "btn-hard",
    pillClass: "pill-hard",
    cardClass: "card-hard"
  }
};

export default function Dashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  // 2-page flow: "levels" (Page 1: Choose Level Form UI) -> "game" (Page 2: Game Dashboard UI)
  const [currentPage, setCurrentPage] = useState("levels");
  const [selectedLevelKey, setSelectedLevelKey] = useState("easy");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Requirements:
  // 1. Points start with 0
  const [score, setScore] = useState(0);

  // 2. Current streak: starts with 0, checks and updates on answer/timeout
  const [streak, setStreak] = useState(0);

  // 3. Lives: starts with 3 full hearts (3 lives)
  const [lives, setLives] = useState(3);

  // 4. Level starts with 1
  const [playerLevel, setPlayerLevel] = useState(1);

  // 5. Timer: counts down, strictly reduces ONLY 1 life on time out
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

  // Strict Single-Life Timeout Handler: triggers strictly ONLY 1 life decrease when timer reaches 0
  useEffect(() => {
    if (currentPage === "game" && timerSeconds === 0 && lives > 0 && !timeoutHandledRef.current) {
      timeoutHandledRef.current = true;
      playWrongSound();
      setStreak(0); // Reset streak

      // Strictly reduce ONLY 1 life
      setLives((prevLives) => {
        const nextLives = Math.max(0, prevLives - 1);
        setFeedback({
          type: "error",
          text: `⏰ Time Out! You lost 1 life. (${nextLives} ${nextLives === 1 ? "life" : "lives"} remaining)`
        });
        return nextLives;
      });

      setRecentActivity((act) => [
        {
          id: Date.now(),
          text: "Time Out! (-1 life)",
          time: "Just now",
          type: "error"
        },
        ...act.slice(0, 5)
      ]);

      // Reset timer for the next attempt so timerSeconds is immediately > 0
      const limit = LEVEL_CONFIGS[selectedLevelKey]?.timeLimit || 60;
      setTimeout(() => {
        setTimerSeconds(limit);
        timeoutHandledRef.current = false;
      }, 50);
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
    playClickSound();
    setSelectedLevelKey(levelKey);
    setPuzzleIndexInLevel(0);
    setLevelCompletedMessage(null);
    setFeedback(null);
    setUserAnswer("");

    const config = LEVEL_CONFIGS[levelKey];
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

        setScore((prev) => prev + earnedPoints);
        setStreak((prev) => prev + 1); // Streak check: increases on consecutive correct
        setPlayerLevel((lvl) => lvl + 1); // Level increases on clearing level

        setLevelCompletedMessage(
          `🎉 Level Completed! You mastered ${currentConfig.title} and earned +${earnedPoints} Points!`
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
        setScore((prev) => prev + 10);
        setStreak((prev) => prev + 1);

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
      // 3. Incorrect answer: Life decreases by strictly 1!
      playWrongSound();
      setStreak(0); // Streak check: reset streak on wrong answer

      setLives((prevLives) => {
        const nextLives = Math.max(0, prevLives - 1);
        setFeedback({
          type: "error",
          text: `❌ Incorrect answer (${parsedAns}). You have ${nextLives} ${nextLives === 1 ? "life" : "lives"} remaining.`
        });
        return nextLives;
      });

      setRecentActivity((prev) => [
        {
          id: Date.now(),
          text: "Incorrect answer (-1 life)",
          time: "Just now",
          type: "error"
        },
        ...prev.slice(0, 5)
      ]);

      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    }
  }

  // Restart Challenge when lives reach 0
  function handleRestartChallenge() {
    playClickSound();
    setLives(3);
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

  const currentAvatarInfo =
    AVATAR_OPTIONS.find((a) => a.id === user?.avatar) || AVATAR_OPTIONS[0];

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
      current: playerLevel >= 2 ? 1 : 0,
      reward: 30,
      unlocked: playerLevel >= 2
    },
    {
      id: "puzzle_adventurer",
      icon: "🧭",
      title: "Puzzle Adventurer",
      category: "beginner",
      description: "Advance to Level 2 or higher in the Banana Jungle.",
      requirement: 2,
      current: Math.min(2, playerLevel),
      reward: 50,
      unlocked: playerLevel >= 2
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
      description: "Complete a Medium difficulty level challenge.",
      requirement: 1,
      current: playerLevel >= 3 ? 1 : 0,
      reward: 80,
      unlocked: playerLevel >= 3
    },
    {
      id: "hardcore_climber",
      icon: "🧗",
      title: "Hardcore Climber",
      category: "master",
      description: "Conquer a Hard difficulty challenge (3 puzzles • 45 pts).",
      requirement: 1,
      current: playerLevel >= 4 ? 1 : 0,
      reward: 150,
      unlocked: playerLevel >= 4
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
            TOP NAVIGATION BAR (macOS Window Controls, Title, Center Nav, Profile & Coins)
            ========================================================================= */}
        <header className="banana-topbar">
          <div className="banana-topbar-left">
            <div className="mac-window-controls">
              <span className="mac-dot dot-red" title="Close" />
              <span className="mac-dot dot-yellow" title="Minimize" />
              <span className="mac-dot dot-green" title="Expand" />
            </div>
            <div className="banana-window-title">
              <span className="banana-brand-text">BANANA QUEST</span>
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
                    <MonkeyBannerIllustration size={92} />
                  </div>
                  <h3 className="sidebar-quest-title">BANANA QUEST</h3>
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

                  {/* Current Streak: Starts at 0, checks and increments */}
                  <div className="banana-stat-row">
                    <div className="banana-stat-icon-wrap streak-icon">🏆</div>
                    <div className="banana-stat-text">
                      <span className="stat-tiny-label">Current Streak</span>
                      <strong className="stat-large-val">{streak} days</strong>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content Area: Level Selection */}
              <section className="banana-main-content">
                <div className="banana-level-heading-area">
                  <h1 className="banana-main-title">Choose a level</h1>
                  <p className="banana-main-subtitle">
                    Each level has a different number of puzzles and rewards. You can choose any level to start!
                  </p>
                </div>

                {/* 3 Distinct Level Cards */}
                <div className="banana-level-cards-grid">
                  {/* Card 1: Easy */}
                  <div className="banana-card-box card-easy">
                    <div className="level-art-wrap">
                      <EasyMonkeyIllustration size={85} />
                    </div>
                    <h2 className="level-card-name title-easy">Easy</h2>
                    <div className="level-pill-badge pill-easy">1 puzzle • 10 points</div>
                    <ul className="level-features-list">
                      <li>Great for beginners</li>
                      <li>1 Banana API puzzle</li>
                      <li>Earn 10 points</li>
                    </ul>
                    <button
                      type="button"
                      className="banana-card-btn btn-easy"
                      onClick={() => handleStartLevel("easy")}
                    >
                      Start Easy
                    </button>
                  </div>

                  {/* Card 2: Medium */}
                  <div className="banana-card-box card-medium">
                    <div className="level-art-wrap">
                      <MediumMonkeyIllustration size={85} />
                    </div>
                    <h2 className="level-card-name title-medium">Medium</h2>
                    <div className="level-pill-badge pill-medium">2 puzzles • 25 points</div>
                    <ul className="level-features-list">
                      <li>A bit more challenging</li>
                      <li>2 Banana API puzzles</li>
                      <li>Earn 25 points</li>
                    </ul>
                    <button
                      type="button"
                      className="banana-card-btn btn-medium"
                      onClick={() => handleStartLevel("medium")}
                    >
                      Start Medium
                    </button>
                  </div>

                  {/* Card 3: Hard */}
                  <div className="banana-card-box card-hard">
                    <div className="level-art-wrap">
                      <HardMonkeyIllustration size={85} />
                    </div>
                    <h2 className="level-card-name title-hard">Hard</h2>
                    <div className="level-pill-badge pill-hard">3 puzzles • 45 points</div>
                    <ul className="level-features-list">
                      <li>For experienced players</li>
                      <li>3 Banana API puzzles</li>
                      <li>Earn 45 points</li>
                    </ul>
                    <button
                      type="button"
                      className="banana-card-btn btn-hard"
                      onClick={() => handleStartLevel("hard")}
                    >
                      Start Hard
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer for Page 1 */}
            <footer className="choose-level-footer gd-footer-cyan">
              Choose Level
            </footer>
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

                {/* Lives Card (3 Hearts: ❤️❤️❤️, decreases strictly 1 on wrong or timeout) */}
                <div className="banana-widget-card lives-widget">
                  <div className="widget-icon-wrap circle-lives">
                    <span>❤️</span>
                  </div>
                  <div className="widget-text-col">
                    <span className="widget-label">Lives ({lives}/3)</span>
                    <div className="banana-hearts-row">
                      <span className={`banana-heart ${lives >= 1 ? "full" : "empty"}`}>
                        {lives >= 1 ? "❤️" : "🤍"}
                      </span>
                      <span className={`banana-heart ${lives >= 2 ? "full" : "empty"}`}>
                        {lives >= 2 ? "❤️" : "🤍"}
                      </span>
                      <span className={`banana-heart ${lives >= 3 ? "full" : "empty"}`}>
                        {lives >= 3 ? "❤️" : "🤍"}
                      </span>
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
                  </div>
                )}

                {/* Banana Game Challenge Box */}
                <div className="banana-puzzle-card-neat">
                  <div className="banana-puzzle-header">
                    <h2>Banana Puzzle Challenge</h2>
                    <p>Solve the Banana Math Equation to find the missing single digit (0–9).</p>
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
                          <span className="equation-hint-tag">Find the missing digit value: ?</span>
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

                  {/* Out of Lives Game Over Card */}
                  {lives <= 0 && (
                    <div className="banana-gameover-card">
                      <p>💔 Out of lives! Click below to reset your challenge.</p>
                      <button
                        type="button"
                        className="banana-restart-btn"
                        onClick={handleRestartChallenge}
                      >
                        🔄 Restart Challenge (3 Lives Restored)
                      </button>
                    </div>
                  )}
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

            {/* Footer for Page 2 */}
            <footer className="choose-level-footer gd-footer-cyan">
              Game Dashboard
            </footer>
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

            <footer className="choose-level-footer gd-footer-cyan">
              Banana Quest - Achievements & Milestones
            </footer>
          </>
        )}

        {/* =========================================================================
            PROFILE & AVATAR CUSTOMIZER TAB
            ========================================================================= */}
        {currentPage === "profile" && (
          <>
            <div className="banana-generic-container">
              <AvatarSelector user={user} onUpdate={(updated) => setUser(updated)} />
            </div>
            <footer className="choose-level-footer gd-footer-cyan">
              Banana Quest
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
