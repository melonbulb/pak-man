// @ts-check
const API_BASE_URL = "http://localhost:5249/api";

/**
 *
 * @returns {Promise<{
 *   map: {
 *     columns: number;
 *     rows: number;
 *     foodCount: number;
 *     powerUpCount: number;
 *     mapArray: number[][];
 *   };
 *   player: {
 *     spawnPosition: { x: number; y: number };
 *   };
 *   enemies: {
 *     name: string;
 *     spawnPosition: { x: number; y: number };
 *   }[];
 *   graph: Record<string, string[]>;
 * }>}
 */
async function fetchGameState() {
  const response = await fetch(`${API_BASE_URL}/gamestate`, { method: "GET" });
  return response.json();
}

async function fetchLeaderboard() {
  const response = await fetch(`${API_BASE_URL}/score`, {
    method: "GET",
  });
  return response.json();
}

/**
 *
 * @param {string} playerName
 * @param {number} score
 * @returns
 */
async function submitScore(playerName, score) {
  const response = await fetch(`${API_BASE_URL}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerName, value: score }),
  });
  if (response.ok) {
    return true;
  }
  return false;
}

export { fetchGameState, fetchLeaderboard, submitScore };
