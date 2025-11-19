import {
  getPosition,
  getGridPosition,
  isTileCenter,
  calculateDistance,
} from "../../../utils/coordinate";

describe("Coordinate Utilities", () => {
  describe("getPosition", () => {
    test("converts grid coordinates to center of grid pixel coordinates", () => {
      const gridPosition = { x: 2, y: 3 };
      const gridSize = 40;
      const pixelPosition = getPosition(gridPosition, gridSize);
      expect(pixelPosition).toEqual({ x: 100, y: 140 });
    });
  });

  describe("getGridPosition", () => {
    test("converts pixel coordinates to grid coordinates", () => {
      const pixelPosition = { x: 100, y: 140 };
      const gridSize = 40;
      const gridPosition = getGridPosition(pixelPosition, gridSize);
      expect(gridPosition).toEqual({ x: 2, y: 3 });
    });
  });

  describe("isTileCenter", () => {
    test("returns true if pixel coordinate is at the center of a tile", () => {
      const gridSize = 40;
      const centerPosition = { x: 100, y: 140 }; // Center of tile (2,3)
      expect(isTileCenter(centerPosition, gridSize)).toBe(true);
    });
    test("returns false if pixel coordinate is not at the center of a tile", () => {
      const gridSize = 40;
      const nonCenterPosition = { x: 110, y: 140 }; // Not center of tile (2,3)
      expect(isTileCenter(nonCenterPosition, gridSize)).toBe(false);
    });
  });
  describe("calculateDistance", () => {
    test("calculates distance from origin to start of grid position", () => {
      const gridPosition = 3;
      const gridSize = 40;
      const distance = calculateDistance(gridPosition, gridSize);
      expect(distance).toBe(120);
    });
  });
});
