# 🍌 Banana Quest — Arcade Equation Arena
> **CIS046-3 Software For Enterprise (Assignment 1)**  
> A distributed, real-time arcade puzzle game integrating the **Marc Conrad Banana API** (`https://marcconrad.com/uob/banana/doc.php`).

---

## 🌟 Key Features

- **Marc Conrad Banana API Integration**: Live interoperability fetching visual math equation puzzles dynamically from `marcconrad.com`.
- **Fault-Tolerant Fallback**: Curated offline puzzle library ensuring 100% uptime even if external university servers experience lag.
- **Real-Time Multiplayer Duels**: WebSocket rooms powered by Socket.IO with live leaderboard sync, sound effects, and floating social cheers.
- **Solo Banana Rush**: Instant 1-player speedrun mode against the clock.
- **Arcade Numpad & Keyboard Hotkeys**: Interactive glowing 0-9 keypad plus physical keyboard hotkeys for lightning-fast input.
- **Synthesized 8-Bit Web Audio Engine**: Zero-latency sound effects for clicks, ticks, streaks, error buzzers, and victory fanfares.
- **Virtual Identity System**: Customizable Banana Avatars, unlocked achievements, Banana Coins, and career statistics secured with HTTP-only JWT cookies.
- **Victory Podium & Confetti**: Top 3 celebration podium with animated dancing banana mascot and particle showers.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
```bash
cd server
npm install
node scripts/seedQuestions.js  # Seeds Banana API questions and pre-configured test users
npm run dev                    # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev                    # Starts Vite dev server on http://localhost:5173
```

---

## 🎮 Pre-Configured Test Accounts

| Account Role | Email Address | Password | Character Title |
| :--- | :--- | :--- | :--- |
| **Demo Player** | `player@banana.quest` | `password123` | Grand Banana King 👑 |
| **Tutor / Evaluator** | `tutor@banana.quest` | `password123` | Inspector Peel 🕵️ |
| **Competitor** | `cyber@banana.quest` | `password123` | Cyber Ape Overlord 🚀 |

*(You can also use the 1-click **"Fill Demo Player"** / **"Fill Tutor ID"** buttons on the Login page!)*

---

## 📁 Repository Structure

```
banana-quest/
├── AssignmentBreif.md                        # Original University Assignment Specification
├── PRESENTATION_GUIDE.md                    # 10-Minute Video Recording Script & Timeline
├── CIS046-3_SOFTWARE_FOR_ENTERPRISE_REPORT.md# Academic Report covering the 4 Core Themes
├── README.md                                # Project Documentation (This File)
├── client/                                  # React 19 Frontend (Vite, CSS Modules)
│   ├── public/
│   │   └── dancing-banana.gif               # Animated Banana Mascot GIF
│   ├── src/
│   │   ├── components/
│   │   │   ├── AvatarSelector.jsx           # Virtual Identity Avatar Picker
│   │   │   ├── BananaBackground.jsx         # Floating Particle Canvas
│   │   │   ├── BananaMascot.jsx             # Multi-State Animated Mascot
│   │   │   └── ReactionOverlay.jsx          # Live Floating Emoji Cheers
│   │   ├── pages/
│   │   │   ├── CreateGame.jsx               # Custom Room & Rules Creator
│   │   │   ├── Dashboard.jsx                # Arcade Hub & Career Stats
│   │   │   ├── GameRoom.jsx                 # Live Arena: Puzzle, 0-9 Keypad, Podium
│   │   │   ├── JoinGame.jsx                 # Room Code Matchmaking
│   │   │   ├── Leaderboard.jsx              # Global Hall of Fame Standings
│   │   │   ├── Login.jsx                    # Persona Authentication
│   │   │   └── Register.jsx                 # New Identity Enrollment
│   │   ├── services/                        # REST & Socket Client Services
│   │   └── utils/
│   │       └── audio.js                     # 8-bit Web Audio Synthesizer Engine
└── server/                                  # Node.js & Express 5 Backend
    ├── config/                              # Passport & OAuth configuration
    ├── controllers/                         # Game & Auth HTTP Controllers
    ├── middleware/                          # JWT & Rate-limiting Middleware
    ├── models/                              # Mongoose Schemas (User, Game, Question, Answer)
    ├── routes/                              # REST API Route Declarations
    ├── scripts/                             # Database Seed Scripts
    ├── services/
    │   ├── bananaApiService.js              # Marc Conrad API Consumer & Fallback Cache
    │   ├── gameService.js                   # Scoring, Streaks & Stat Updates
    │   └── socketService.js                 # Socket.IO Event Dispatcher
    └── sockets/
        └── gameSocket.js                    # Real-time WebSocket Gateway
```

---

## 📚 Academic Theme Alignment

- **Theme 1: Version Control** — Atomic commits, Git feature-branching workflow, and conflict management.
- **Theme 2: Software Interoperability** — Integration of the Marc Conrad Banana API (`marcconrad.com/uob/banana/api.php?out=json`) with fault-tolerant caching and loose coupling.
- **Theme 3: Event-Driven Programming** — Bidirectional WebSockets (Socket.IO), custom room events, and GUI user input handlers.
- **Theme 4: Virtual Identity** — Bcrypt password hashing, JWT session management via HTTP-only cookies, customizable personas, and game achievements.
