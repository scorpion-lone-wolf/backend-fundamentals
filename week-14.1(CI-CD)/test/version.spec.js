import { describe, expect, it } from "@jest/globals";
import { getVersion } from "../utils";
describe("Version", () => {
  it("Should return correct version", () => {
    expect(getVersion()).toBe("v2");
  });
});
