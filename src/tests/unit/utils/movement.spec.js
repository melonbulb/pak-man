import { getRandomDirection } from "../../utils/movement.js";

describe("movement utils", () => {
  describe("getRandomDirection", () => {
    test("returns a direction from possible directions", () => {
      const possibleDirections = ["up", "down", "left", "right"];
      const direction = getRandomDirection(possibleDirections);
      expect(possibleDirections).toContain(direction);
    });
  });
});
