# Banana Quest — 10-Minute Video Presentation Script & Recording Guide
**Unit:** CIS046-3 Software For Enterprise (Assignment 1)  
**Weighting:** 60%  
**Assessment Target:** 10-Minute Authentic Video Presentation  

---

## 🎯 Presentation Overview & Marking Rubric Alignment

To achieve a top grade (70%+ / 1st Class), your video must:
1. Start with a **clear, authentic demonstration** of the working system.
2. Provide **substantive, critical discussion of the four core themes**:
   - **Version Control**
   - **Software Interoperability**
   - **Event-Driven Programming**
   - **Virtual Identity**
3. Use professional computer science and software enterprise terminology.
4. Feature your own voice speaking clearly over your screen recording.

---

## ⏱️ Minute-by-Minute Video Timeline (Total: 10:00)

| Timestamp | Section | Key Visual on Screen | Core Concepts & Terminology Covered |
| :--- | :--- | :--- | :--- |
| **0:00 – 2:00** | **Live Working Demo** | Browser running Banana Quest: Login, Solo Speedrun, 0-9 Keypad, Combo, Victory Podium | Real-time response, Banana API equation display, Web Audio SFX, animations |
| **2:00 – 4:00** | **Theme 1: Version Control** | Terminal running `git log`, VS Code Git graph | Git branching workflow, atomic commits, merge conflict handling, traceability |
| **4:00 – 6:00** | **Theme 2: Interoperability** | `bananaApiService.js`, `gameController.js`, Banana API docs | Heterogeneous REST services, JSON serialization, graceful fallback, loose coupling |
| **6:00 – 8:00** | **Theme 3: Event-Driven Architecture** | `gameSocket.js`, `GameRoom.jsx`, Network tab WS frames | WebSockets, Socket.IO duplex event channels, Observer pattern, asynchronous GUI events |
| **8:00 – 9:20** | **Theme 4: Virtual Identity** | `authController.js`, `User.js`, HTTP-only cookies in DevTools | Virtual personas, JWT authentication, XSS defense via HTTP-only cookies, state persistence |
| **9:20 – 10:00** | **Conclusion & Critical Appraisal** | Global Leaderboard & Final Architecture Diagram | Distributed enterprise architecture, reflection on scalability, wrap-up |

---

## 🎙️ Word-for-Word Speaking Script

### Part 1: Introduction & Live Demonstration (0:00 – 2:00)

> **[Visual: Browser open at http://localhost:5173/login]**  
> *"Hello, my name is [Your Name], and this is my presentation for CIS046-3 Software for Enterprise. Today I will be demonstrating Banana Quest, a distributed, real-time multiplayer arcade game that integrates Marc Conrad's external Banana API, and reflecting upon the four fundamental enterprise software themes: Version Control, Interoperability, Event-Driven Programming, and Virtual Identity.*
>
> *Let's begin with a live demonstration. I am logging in using our pre-seeded virtual identity profile. Upon entering the Dashboard, notice the cyber-jungle arcade aesthetic, our dynamic mascot with reactive animations, and player statistics.*
>
> *[Visual: Click 'Solo Banana Rush' button]*  
> *I'll launch an instant Solo Banana Rush session. Notice how the application instantly communicates with Marc Conrad's University Banana API to fetch live mathematical equation puzzles.*
>
> *[Visual: Demonstrate answering using 0-9 arcade buttons and keyboard]*  
> *Here, the puzzle image is dynamically loaded. I can enter my answer using either the interactive glowing keypad or physical keyboard hotkeys (0 through 9). When I submit, the system calculates my score using a time-decay algorithm plus combo streak multipliers. Notice the synthesized 8-bit audio feedback, confetti bursts, and streak flame animations.*
>
> *[Visual: Complete 3 rounds to reach the Victory Podium]*  
> *Upon completion of the quest, the system transitions to the Victory Podium, displaying ranks, earned Banana coins, and a question-by-question response breakdown."*

---

### Part 2: Theme 1 — Version Control (2:00 – 4:00)

> **[Visual: Switch to VS Code terminal, run `git status` and `git log --oneline -n 8`]*  
> *"Now let's examine our first theme: **Version Control**.*
>
> *In enterprise software engineering, version control is more than a backup mechanism; it is the cornerstone of collective software development, traceability, and continuous integration. For this project, I used Git with a feature-branching workflow following Semantic Versioning and Conventional Commits.*
>
> *By decoupling development into isolated branches—such as `feature/banana-api-interop` and `feature/socket-events`—we prevent regressions in the `main` production branch. Atomic commits ensure that every state change is reproducible, making debugging with `git bisect` feasible if defects arise.*
>
> *Furthermore, version control enables continuous rollback capabilities. For example, when refactoring our MongoDB schema to support both visual Banana questions and multiple-choice options, version tagging allowed us to maintain backwards compatibility without risking data loss."*

---

### Part 3: Theme 2 — Software Interoperability (4:00 – 6:00)

> **[Visual: Open `server/services/bananaApiService.js` in VS Code]*  
> *"Moving to our second theme: **Software Interoperability**.*
>
> *Interoperability is the ability of disparate, heterogeneous systems to exchange and mutually consume information without special configuration. In Banana Quest, our Node.js and Express backend acts as an intermediary interoperating with an external third-party service: Marc Conrad’s Banana API hosted at `marcconrad.com`.*
>
> *Looking at lines 35 to 65 of `bananaApiService.js`, we consume the Banana API REST endpoint using HTTP GET requests with `out=json`. The external API returns an unformatted JSON payload containing the puzzle image URI and the single-digit numerical solution.*
>
> *Critically, in enterprise distributed architectures, you cannot assume an external third-party API has 100% uptime. To satisfy enterprise resilience requirements, I engineered a graceful fallback mechanism. If the university server is slow, times out, or returns a 500 status, our system catches the error with an `AbortController` after 4000 milliseconds and seamlessly serves verified cached puzzles. This guarantees that client sessions never crash, exemplifying high availability and fault-tolerant interoperability."*

---

### Part 4: Theme 3 — Event-Driven Programming (6:00 – 8:00)

> **[Visual: Open `server/sockets/gameSocket.js` and Chrome DevTools Network Tab filtered by 'WS']*  
> *"Our third theme is **Event-Driven Programming**.*
>
> *Unlike traditional request-response polling which wastes network bandwidth, Banana Quest uses a bidirectional, asynchronous event-driven architecture powered by WebSockets via Socket.IO, implemented on top of the Node.js event loop.*
>
> *In `gameSocket.js`, we establish distinct event channels. When a user performs an action—such as submitting an answer or broadcasting an in-game reaction like a banana cheer—the client emits a named event over the WebSocket pipe.*
>
> *On the server, event listeners intercept the payload, validate the sender's identity, update the game room state in MongoDB, and selectively broadcast updates to the specific room room channel: `game:${roomCode}`.*
>
> *On the frontend, React components subscribe to these events using `useEffect` hooks. For instance, when `leaderboard:updated` is received, the client component re-renders the live score rankings in real time without refreshing the page. We also apply event-driven principles to the GUI through physical keyboard event listeners and Web Audio API synthesizer triggers."*

---

### Part 5: Theme 4 — Virtual Identity (8:00 – 9:20)

> **[Visual: Open `server/models/User.js` and Chrome DevTools Application > Cookies tab]*  
> *"Our fourth theme is **Virtual Identity and Authentication**.*
>
> *Virtual identity represents a user’s persistent digital persona, permissions, and session state within a software ecosystem. In Banana Quest, virtual identity is structured across three layers:*
>
> *First, **Authentication & Authorization**: We use JSON Web Tokens (JWT) signed with HMAC-SHA256. Crucially, the JWT is stored in an `HttpOnly`, `SameSite: strict` cookie rather than in browser `localStorage`. This is an enterprise security best practice that mitigates Cross-Site Scripting (XSS) attacks, as JavaScript cannot read `HttpOnly` cookies.*
>
> *Second, **Multi-Provider Identity Integration**: In `User.js`, our schema maintains an `identities` array, supporting local email credentials as well as OAuth 2.0 social login identity providers.*
>
> *Third, **Customizable Persona & Gamification**: Players can customize their persona through an avatar selector (such as Banana Warrior or Cyber Banana), earn dynamic achievement badges, accumulate Banana Coins, and build persistent career statistics recorded across games."*

---

### Part 6: Conclusion & Critical Reflection (9:20 – 10:00)

> **[Visual: Navigate to the Global Leaderboard page in browser]*  
> *"To conclude, Banana Quest demonstrates how enterprise software principles—structured version control, resilient interoperability with the Marc Conrad Banana API, real-time event-driven socket communication, and secure virtual identity—come together to deliver a polished, responsive gaming experience.*
>
> *Critically evaluating the system, future iterations could introduce Redis for in-memory game state caching to scale beyond thousands of concurrent rooms, and WebRTC for peer-to-peer voice chat.*
>
> *Thank you for watching, and I welcome any questions."*

---

## 🛠️ Pre-Recording Checklist

1. **MongoDB Running**: Ensure MongoDB is running on `127.0.0.1:27017`.
2. **Backend Started**: Run `cd server && node server.js`. Verify terminal says:
   `MongoDB connected. Backend and Socket.IO running on port 5000`.
3. **Frontend Started**: Run `cd client && npm run dev`. Open `http://localhost:5173`.
4. **Demo Account Ready**: Use `player@banana.quest` / `password123` (pre-seeded).
5. **Screen Recording Tool**: Use OBS Studio or Windows Game Bar (`Win + G`). Select 1080p 60fps and ensure your microphone is unmuted.

