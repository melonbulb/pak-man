import { getRandomDirection } from "../../../utils/movement";

describe("movement utils", () => {
  describe("getRandomDirection", () => {
    test("returns a direction from possible directions", () => {
      const possibleDirections = ["up", "down", "left", "right"];
      const direction = getRandomDirection(possibleDirections);
      expect(possibleDirections).toContain(direction);
    });
    test("returns 'none' if no possible directions", () => {
      const possibleDirections = [];
      const direction = getRandomDirection(possibleDirections);
      expect(direction).toBe("none");
    });
  });
});
