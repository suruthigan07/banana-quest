import "dotenv/config";
import mongoose from "mongoose";
import Question from "../models/Question.js";

const questions = [
  { question: "Which language is primarily used to build interactive web pages?", options: ["C", "JavaScript", "SQL", "Bash"], correctAnswerIndex: 1, explanation: "JavaScript adds behaviour and interactivity to web pages.", category: "Programming", difficulty: "Easy" },
  { question: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language", "Home Tool Markup Language"], correctAnswerIndex: 0, explanation: "HTML means HyperText Markup Language.", category: "Programming", difficulty: "Easy" },
  { question: "Which data structure follows FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswerIndex: 1, explanation: "A queue follows First In, First Out.", category: "Computer Science", difficulty: "Easy" },
  { question: "Which HTTP method is commonly used to create a resource?", options: ["GET", "POST", "DELETE", "HEAD"], correctAnswerIndex: 1, explanation: "POST is commonly used to submit data and create a resource.", category: "Web Development", difficulty: "Easy" },
  { question: "Which database is document-oriented?", options: ["MongoDB", "MySQL", "SQLite", "PostgreSQL"], correctAnswerIndex: 0, explanation: "MongoDB stores data as BSON documents.", category: "Databases", difficulty: "Easy" },
  { question: "What does CSS control?", options: ["Database queries", "Page presentation", "Server routing", "Network addressing"], correctAnswerIndex: 1, explanation: "CSS controls the visual presentation of web documents.", category: "Web Development", difficulty: "Easy" },
  { question: "Which Git command creates a new branch?", options: ["git push", "git branch", "git clone", "git status"], correctAnswerIndex: 1, explanation: "git branch can create and list branches.", category: "Software Engineering", difficulty: "Easy" },
  { question: "What is the main purpose of an API?", options: ["Compress images", "Enable software communication", "Format a hard drive", "Compile CSS"], correctAnswerIndex: 1, explanation: "An API defines how software components communicate.", category: "Software Engineering", difficulty: "Easy" },
  { question: "Which protocol secures HTTP communication?", options: ["FTP", "SMTP", "TLS", "ARP"], correctAnswerIndex: 2, explanation: "HTTPS uses TLS to protect HTTP communication.", category: "Networking", difficulty: "Medium" },
  { question: "Which SQL clause filters rows?", options: ["ORDER BY", "WHERE", "GROUP BY", "JOIN"], correctAnswerIndex: 1, explanation: "WHERE filters rows based on a condition.", category: "Databases", difficulty: "Easy" },
  { question: "In React, what is a component?", options: ["A reusable UI building block", "A database table", "A network protocol", "A browser extension"], correctAnswerIndex: 0, explanation: "React components are reusable pieces of user interface.", category: "Web Development", difficulty: "Medium" },
  { question: "What does JSON stand for?", options: ["Java Source Object Network", "JavaScript Object Notation", "Joined System Output Name", "Java Standard Open Notation"], correctAnswerIndex: 1, explanation: "JSON is a lightweight data-interchange format.", category: "Web Development", difficulty: "Easy" },
  { question: "Which algorithmic complexity is associated with binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswerIndex: 1, explanation: "Binary search halves the search interval each step.", category: "Computer Science", difficulty: "Medium" },
  { question: "Which device forwards packets between different networks?", options: ["Switch", "Router", "Repeater", "Hub"], correctAnswerIndex: 1, explanation: "Routers forward packets between networks.", category: "Networking", difficulty: "Easy" },
  { question: "What does CRUD represent?", options: ["Create, Read, Update, Delete", "Copy, Run, Undo, Deploy", "Connect, Route, Use, Debug", "Create, Remove, Upload, Download"], correctAnswerIndex: 0, explanation: "CRUD describes the four basic data operations.", category: "Databases", difficulty: "Easy" },
  { question: "Which status code means a successful HTTP request?", options: ["301", "404", "200", "500"], correctAnswerIndex: 2, explanation: "HTTP 200 indicates success.", category: "Web Development", difficulty: "Easy" },
  { question: "Which principle hides internal implementation details?", options: ["Encapsulation", "Iteration", "Compilation", "Replication"], correctAnswerIndex: 0, explanation: "Encapsulation bundles data and methods while controlling access.", category: "Computer Science", difficulty: "Medium" },
  { question: "What is the purpose of a primary key?", options: ["Style a table", "Uniquely identify a row", "Encrypt a database", "Sort every column"], correctAnswerIndex: 1, explanation: "A primary key uniquely identifies each record in a table.", category: "Databases", difficulty: "Easy" },
  { question: "Which tool is commonly used for JavaScript package management?", options: ["npm", "Photoshop", "Wireshark", "Figma"], correctAnswerIndex: 0, explanation: "npm manages JavaScript packages and project dependencies.", category: "Software Engineering", difficulty: "Easy" },
  { question: "What does event-driven programming respond to?", options: ["Only database backups", "Events and user/system actions", "Only scheduled compiles", "Only file extensions"], correctAnswerIndex: 1, explanation: "Event-driven programs execute handlers when events occur.", category: "Software Engineering", difficulty: "Medium" }
];

try {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing.");
  await mongoose.connect(process.env.MONGO_URI);
  const existingCount = await Question.countDocuments();
  if (existingCount > 0) {
    console.log(`Questions collection already contains ${existingCount} records. No seed data inserted.`);
  } else {
    await Question.insertMany(questions);
    console.log(`Inserted ${questions.length} sample questions.`);
  }
} catch (error) {
  console.error("Question seeding failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
