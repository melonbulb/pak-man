// @ts-check
/**
 * @import Map from "./Map";
 */

class GameState {
  constructor() {
    this.isGameOver = false;
    this.isWin = false;
    this.isPaused = true;
  }

  canResume() {
    return !this.isGameOver && !this.isPaused && !this.isWin;
  }

  /**
   * Checks if the win condition is met
   * @param {Map} map
   */
  checkWinCondition(map) {
    if (map.numberOfFoodPallets === 0 && map.numberOfPowerUps === 0) {
      this.isWin = true;
      return true;
    }
    return false;
  }
}
export default GameState;
