# CIS046-3 Software For Enterprise — Technical Artifact Report
**Project Title:** Banana Quest: A Distributed Real-Time Arcade Gaming System  
**Unit Code:** CIS046-3 (Software For Enterprise)  
**Deliverable Type:** Code Implementation Documentation & Video Presentation Accompanying Report  
**API Integration:** Marc Conrad Banana API (`https://marcconrad.com/uob/banana/api.php`)  

---

## 1. Executive Summary & Architecture Overview

Banana Quest is an enterprise distributed gaming application engineered using the MERN stack (MongoDB, Express, React, Node.js) supplemented by real-time WebSockets (Socket.IO) and external REST API consumption. The application provides an engaging mathematical puzzle game based on the Marc Conrad Banana API, designed to illustrate four core software engineering themes:

1. **Version Control**: Git branching models, traceability, atomic commits, and team collaboration workflows.
2. **Software Interoperability**: Loose coupling, heterogeneous REST communications, JSON schema contracts, and graceful fault-tolerant degradation.
3. **Event-Driven Programming**: Asynchronous non-blocking I/O, WebSocket duplex channels, client/server event emitters, GUI user actions, and Web Audio API synthesis.
4. **Virtual Identity**: Secure authentication, JWT tokens in HTTP-only cookies, multi-provider identity federation, custom avatar representation, and persistent career state.

### Distributed System Architecture Diagram

```
+--------------------------------------------------------------------------+
|                        Client Tier (React 19 SPA)                        |
|   - Virtual Identity Persona Customizer (Banana Avatars & Badges)        |
|   - Real-time Game Arena (0-9 Keypad, Keyboard Hotkeys, Timer Ring)      |
|   - Interactive Mascot & Floating Particle Canvas                        |
|   - Web Audio API Sound Synthesizer (Zero-latency 8-bit sound effects)   |
+---------------------+-------------------------------+--------------------+
                      |                               ^
        REST (JSON)   |                 WebSockets    | Duplex Events
        HTTP-Only     v                 (Socket.IO)   | (Live Ranks, Cheers)
+---------------------+-------------------------------+--------------------+
|                   Server Tier (Node.js & Express 5)                      |
|   - Authentication Engine (JWT, Cookie Management, Bcrypt)               |
|   - Game Controller & Scoring Engine (Time-decay & Combo Streaks)        |
|   - WebSocket Gateway (`gameSocket.js` - Room Subscriptions & Broadcasts)|
|   - Resilient Banana API Integration Service (`bananaApiService.js`)     |
+---------------------+-------------------------------+--------------------+
                      |                               |
        Mongoose /    |                               | Outbound REST
        BSON Driver   v                               v (JSON / AbortTimeout)
+---------------------+-------+     +-----------------+--------------------+
| Database Tier               |     | External Third-Party Tier            |
| (MongoDB Document Store)    |     | Marc Conrad's Banana API Service     |
| Collections:                |     | (marcconrad.com/uob/banana/api.php)  |
| - Users & AuthLogs          |     | Dynamic image math puzzles &         |
| - Games, Questions, Answers |     | single-digit solutions (0-9)         |
+-----------------------------+     +--------------------------------------+
```

---

## 2. In-Depth Reflection on the Four Core Themes

### Theme 1: Version Control in Enterprise Development

Version control systems (VCS), predominantly Git, are essential to collective software engineering, providing:
- **Traceability & Auditability**: Every commit represents an atomic unit of work with a cryptographic SHA-1 hash, establishing who changed what, when, and why.
- **Branching Workflows (Git Flow & Trunk-Based Development)**: In this project, code was developed using modular branches:
  - `main`: Production-ready, verified code.
  - `feature/banana-api-interop`: Integrating the Marc Conrad Banana API service with fallback caching.
  - `feature/socket-events`: Implementing real-time Socket.IO room subscriptions and live score broadcasting.
  - `feature/gaming-ui-overhaul`: Developing the cyber-jungle arcade aesthetic, mascot animations, and sound synthesizer.
- **Rollback & Conflict Resolution**: Semantic versioning and continuous commit history allow targeted rollbacks without corrupting unrelated subsystems.

---

### Theme 2: Software Interoperability

Interoperability is the capacity of software components to exchange and interpret data across disparate platforms, programming languages, and operating environments.

#### External API Integration
In `server/services/bananaApiService.js`, our Node.js microservice communicates directly with the Marc Conrad Banana API:
- **Endpoint**: `https://marcconrad.com/uob/banana/api.php?out=json`
- **Data Exchange Format**: Standardized JavaScript Object Notation (JSON)
- **Payload Contract**:
  ```json
  {
    "question": "https://www.sanfoh.com/uob/banana/data/t2d6b18466c43301e0f9943042en95.png",
    "solution": 5
  }
  ```

#### Enterprise Resilience & Graceful Degradation
External services can suffer outages, latency spikes, or network partitions. Banana Quest implements **Enterprise Fault Tolerance**:
1. **Timeout Control**: Uses `AbortController` to abort external network requests that exceed 4,000ms.
2. **Curated Fallback Cache**: In the event of an external network failure or HTTP status error, the service automatically serves a verified internal cache of Marc Conrad banana equation puzzles without interrupting gameplay or failing user requests.
3. **Internal Schema Standardization**: The raw API response is transformed into the standard internal `Question` schema with 10 options (`0` through `9`), ensuring loose coupling.

---

### Theme 3: Event-Driven Programming

Event-driven programming is an architectural paradigm where program flow is determined by events—user actions (mouse clicks, keystrokes), sensor outputs, or messages from other programs.

#### Asynchronous WebSockets via Socket.IO
Traditional client-server polling introduces high HTTP overhead and latency. Banana Quest uses bidirectional WebSocket connections:
- **`room:join`**: Subscribes a player's socket connection to a dedicated room channel (`game:${roomCode}`).
- **`game:updated`**: Broadcast to all players when game status changes (e.g. from waiting to active).
- **`leaderboard:updated`**: Emitted when any player submits an answer, triggering live score re-ranking on all client viewports.
- **`reaction:send` & `reaction:received`**: Real-time social cheers (🍌, 🔥, 👑, 🚀) floating across the screen.

#### Client GUI & Synthesizer Events
On the frontend:
- Keyboard event listeners (`keydown`) capture physical number keys `0` through `9` for instant answer submission.
- Real-time countdown timer triggers synthesized clock tick sounds during the final 4 seconds.
- Web Audio API synthesizers create immediate auditory feedback for correct answers, errors, combos, and victory.

---

### Theme 4: Virtual Identity & Security Architecture

Virtual Identity is the digital representation of an actor within an information system, encompassing authentication, authorization, personalization, and audit logging.

#### Security & Session Management
- **Password Security**: Passwords are never stored in plaintext; they are hashed using **Bcrypt** with 12 salt rounds (`authController.js`).
- **JWT (JSON Web Token)**: Encodes player claims (user ID, expiration) signed with HMAC-SHA256.
- **HTTP-Only Cookies**: The authentication token is sent to the client inside an `HttpOnly`, `SameSite: strict` cookie (`utils/generateToken.js`). This shields the token from client-side script inspection, effectively neutralizing Cross-Site Scripting (XSS) session theft.

#### Gamified Digital Personas
- **Custom Avatars**: Players choose from 8 distinct banana avatars (Banana Warrior, King Banana, Cyber Banana, etc.) which update their persistent profile in MongoDB.
- **Dynamic Achievements & Titles**: Cumulative stats (`totalPoints`, `gamesPlayed`, `gamesWon`, `highestStreak`) reward players with custom titles (e.g. "Grand Banana King 👑") and badges.

---

## 3. Academic Referencing & Source Code Attribution

In accordance with the Academic Integrity Policy of the University of Bedfordshire:

1. **Marc Conrad Banana API**:
   - Creator: Dr. Marc Conrad, University of Bedfordshire.
   - Resource: [https://marcconrad.com/uob/banana/doc.php](https://marcconrad.com/uob/banana/doc.php)
   - Usage: Consumed in `server/services/bananaApiService.js` for dynamic math puzzle image generation.

2. **Open Source Libraries**:
   - `express`: Robust Node.js web server framework.
   - `socket.io` & `socket.io-client`: Real-time WebSocket duplex communications.
   - `mongoose`: Elegant MongoDB object modeling for Node.js.
   - `bcryptjs`: Optimized password hashing.
   - `jsonwebtoken`: Secure identity token generation and verification.
   - `canvas-confetti`: Lightweight celebratory particle effects.
   - `lucide-react`: SVG interface icons.

3. **Generative AI Declaration**:
   - Generative AI (LLM assistance) was utilized during the development of this assignment for code structuring, CSS styling enhancement, and documentation drafting in compliance with unit guidelines.

