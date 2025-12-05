import { fetchLeaderboard } from "./libs/lib-apis.js";

async function updateLeaderboard() {
  const leaderboard = await fetchLeaderboard();
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";
  leaderboard
    .sort((a, b) => b.score - a.score)
    .forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.playerName}: ${entry.value}`;
      leaderboardList.appendChild(listItem);
    });
}

setInterval(updateLeaderboard, 5000);
updateLeaderboard();
