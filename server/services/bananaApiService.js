/**
 * Banana API Integration Service
 * 
 * THEME: INTEROPERABILITY
 * Demonstrates distributed system interoperability by integrating external third-party
 * REST services (Marc Conrad's University of Bedfordshire Banana API) into our Node/Express
 * micro-architecture.
 * 
 * Source: https://marcconrad.com/uob/banana/doc.php
 * Format: JSON payload containing { question: "<image_url>", solution: <0-9> }
 */

const BANANA_API_URL = "https://marcconrad.com/uob/banana/api.php?out=json";

// Built-in verified offline/fallback puzzle cache for extreme network resilience & offline demos
const FALLBACK_BANANA_PUZZLES = [
  { question: "https://www.sanfoh.com/uob/banana/data/t2d6b18466c43301e0f9943042en95.png", solution: 5 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2e4ce2b69c56f551f8a0a07145n51.png", solution: 1 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2fcf13d2cfa31c578988691dc9n58.png", solution: 8 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2806fe068545e85c292150fe1fn15.png", solution: 3 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2a71d798ba4f5f58dfcb68c6e0n52.png", solution: 7 },
  { question: "https://www.sanfoh.com/uob/banana/data/t203fe926be57dfceb8a3e878ben24.png", solution: 4 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2307efcbfe1941d8e1c6e4e047n89.png", solution: 9 },
  { question: "https://www.sanfoh.com/uob/banana/data/t264ffed0eb4e41416e788ee54en37.png", solution: 2 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2df2c19e5c4a5f33dc8f22faefn99.png", solution: 6 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2f0b093375cb47be7371d3c01bn86.png", solution: 0 },
  { question: "https://www.sanfoh.com/uob/banana/data/t2a382e88a00dc7cba2a3a8385en22.png", solution: 5 },
  { question: "https://www.sanfoh.com/uob/banana/data/t261cf3e6396e838ffae2aa53bbn77.png", solution: 3 }
];

/**
 * Fetch a single puzzle from Marc Conrad's Banana API
 * Includes timeout and fallback resilience
 */
export async function fetchSingleBananaPuzzle(timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(BANANA_API_URL, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "BananaQuest-EnterpriseSoftware/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`Banana API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.question || typeof data.solution !== "number") {
      throw new Error("Invalid payload format received from Banana API");
    }

    return {
      question: data.question,
      solution: Number(data.solution),
      source: "live_api"
    };
  } catch (err) {
    console.warn(`[Interoperability] Live Banana API fetch failed (${err.message}). Using fallback cache.`);
    const randomIndex = Math.floor(Math.random() * FALLBACK_BANANA_PUZZLES.length);
    return {
      ...FALLBACK_BANANA_PUZZLES[randomIndex],
      source: "cached_fallback"
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch multiple Banana API puzzles concurrently
 * @param {number} count Number of puzzles needed (e.g. 5, 10, 15)
 */
export async function fetchBananaPuzzlesBatch(count = 5) {
  const requests = Array.from({ length: count }, () => fetchSingleBananaPuzzle());
  const results = await Promise.all(requests);
  return results;
}

/**
 * Format a Banana puzzle into our application's standard Question schema
 */
export function formatBananaAsQuestion(puzzle, index = 1) {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const sol = Math.max(0, Math.min(9, puzzle.solution));

  return {
    question: `Solve the Banana Math Equation! Find the missing single digit (0-9):`,
    options: digits,
    correctAnswerIndex: sol,
    explanation: `The correct banana equation value is ${sol}.`,
    category: "Banana API",
    difficulty: "Arcade",
    questionType: "banana",
    imageUrl: puzzle.question,
    isActive: true
  };
}

