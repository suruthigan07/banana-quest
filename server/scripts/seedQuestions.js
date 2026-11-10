import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Question from "../models/Question.js";
import User from "../models/User.js";

const bananaAndCsQuestions = [
  // Marc Conrad Banana API Puzzles
  {
    question: "Solve the Banana Math Equation! Find the missing single digit (0-9):",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    correctAnswerIndex: 5,
    explanation: "The solution to this Banana equation is 5.",
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: "https://www.sanfoh.com/uob/banana/data/t2d6b18466c43301e0f9943042en95.png",
    isActive: true
  },
  {
    question: "Solve the Banana Math Equation! Find the missing single digit (0-9):",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    correctAnswerIndex: 1,
    explanation: "The solution to this Banana equation is 1.",
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: "https://www.sanfoh.com/uob/banana/data/t2e4ce2b69c56f551f8a0a07145n51.png",
    isActive: true
  },
  {
    question: "Solve the Banana Math Equation! Find the missing single digit (0-9):",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    correctAnswerIndex: 8,
    explanation: "The solution to this Banana equation is 8.",
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: "https://www.sanfoh.com/uob/banana/data/t2fcf13d2cfa31c578988691dc9n58.png",
    isActive: true
  },
  {
    question: "Solve the Banana Math Equation! Find the missing single digit (0-9):",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    correctAnswerIndex: 3,
    explanation: "The solution to this Banana equation is 3.",
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: "https://www.sanfoh.com/uob/banana/data/t2806fe068545e85c292150fe1fn15.png",
    isActive: true
  },
  {
    question: "Solve the Banana Math Equation! Find the missing single digit (0-9):",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    correctAnswerIndex: 7,
    explanation: "The solution to this Banana equation is 7.",
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: "https://www.sanfoh.com/uob/banana/data/t2a71d798ba4f5f58dfcb68c6e0n52.png",
    isActive: true
  },
  {
    question: "Solve the Banana Math Equation! Find the missing single digit (0-9):",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    correctAnswerIndex: 4,
    explanation: "The solution to this Banana equation is 4.",
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: "https://www.sanfoh.com/uob/banana/data/t203fe926be57dfceb8a3e878ben24.png",
    isActive: true
  },
  {
    question: "Solve the Banana Math Equation! Find the missing single digit (0-9):",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    correctAnswerIndex: 9,
    explanation: "The solution to this Banana equation is 9.",
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: "https://www.sanfoh.com/uob/banana/data/t2307efcbfe1941d8e1c6e4e047n89.png",
    isActive: true
  },
  // Enterprise Software & CS Questions
  {
    question: "Which pattern best describes how WebSockets and GUI event listeners work in software?",
    options: ["Observer / Event-Driven Pattern", "Factory Method", "Singleton", "Interpreter"],
    correctAnswerIndex: 0,
    explanation: "The Observer and Event-Driven pattern allows decoupled subscribers to react to asynchronous emitted events.",
    category: "Software Engineering",
    difficulty: "Medium",
    questionType: "trivia",
    imageUrl: "",
    isActive: true
  },
  {
    question: "What is the primary benefit of Software Interoperability in enterprise architectures?",
    options: ["Compiling C++ to machine code", "Enabling heterogeneous systems and APIs to exchange and consume data seamlessly", "Encrypting database hard drives", "Compressing CSS bundle sizes"],
    correctAnswerIndex: 1,
    explanation: "Interoperability allows diverse systems (like our Node server calling Marc Conrad's REST API) to communicate via standardized contracts.",
    category: "Software Engineering",
    difficulty: "Medium",
    questionType: "trivia",
    imageUrl: "",
    isActive: true
  },
  {
    question: "In Virtual Identity architecture, why are HTTP-only JWT cookies safer than localStorage for storing sessions?",
    options: ["They load faster into GPU memory", "They prevent client-side JavaScript from reading the token, mitigating XSS attacks", "They encrypt the HTML stylesheet", "They bypass CORS policies completely"],
    correctAnswerIndex: 1,
    explanation: "HTTP-only cookies cannot be accessed via document.cookie by malicious XSS scripts, protecting player authentication.",
    category: "Cybersecurity",
    difficulty: "Medium",
    questionType: "trivia",
    imageUrl: "",
    isActive: true
  }
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing.");
    await mongoose.connect(process.env.MONGO_URI);
    
    // Seed Questions if needed
    const count = await Question.countDocuments();
    if (count === 0) {
      await Question.insertMany(bananaAndCsQuestions);
      console.log(`Seeded ${bananaAndCsQuestions.length} initial Banana Quest questions!`);
    } else {
      console.log(`Database contains ${count} questions.`);
    }

    // Seed Demo Users for easy testing/grading
    const demoPasswordHash = await bcrypt.hash("password123", 10);
    
    const demoUsers = [
      {
        username: "Alex",
        email: "alex@banana.quest",
        passwordHash: demoPasswordHash,
        avatar: "banana-warrior",
        title: "Puzzle Adventurer",
        bananaCoins: 120,
        highestStreak: 3,
        totalPoints: 120,
        gamesPlayed: 5,
        gamesWon: 3,
        badges: ["Banana Rookie", "First Steps", "Puzzle Adventurer"],
        identities: [{ provider: "local", providerId: "alex@banana.quest" }]
      },
      {
        username: "BananaChamp",
        email: "player@banana.quest",
        passwordHash: demoPasswordHash,
        avatar: "king-banana",
        title: "Grand Banana King 👑",
        bananaCoins: 850,
        highestStreak: 7,
        totalPoints: 3420,
        gamesPlayed: 14,
        gamesWon: 11,
        badges: ["Banana Rookie", "First Steps", "Banana Champion", "Streak God", "Jungle Master"],
        identities: [{ provider: "local", providerId: "player@banana.quest" }]
      },
      {
        username: "TutorReviewer",
        email: "tutor@banana.quest",
        passwordHash: demoPasswordHash,
        avatar: "detective-banana",
        title: "Inspector Peel 🕵️",
        bananaCoins: 500,
        highestStreak: 5,
        totalPoints: 1850,
        gamesPlayed: 8,
        gamesWon: 6,
        badges: ["Banana Rookie", "First Steps", "Banana Veteran"],
        identities: [{ provider: "local", providerId: "tutor@banana.quest" }]
      },
      {
        username: "CyberMonk",
        email: "cyber@banana.quest",
        passwordHash: demoPasswordHash,
        avatar: "cyber-banana",
        title: "Cyber Ape Overlord 🚀",
        bananaCoins: 420,
        highestStreak: 4,
        totalPoints: 1490,
        gamesPlayed: 7,
        gamesWon: 4,
        badges: ["Banana Rookie", "First Steps"],
        identities: [{ provider: "local", providerId: "cyber@banana.quest" }]
      }
    ];

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Created demo user: ${u.email} / password123`);
      }
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
