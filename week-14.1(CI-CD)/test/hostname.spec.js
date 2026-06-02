import { describe, expect, it } from "@jest/globals";
import { getHostName } from "../utils";
describe("HostName", () => {
  it("Should return hostname", () => {
    expect(getHostName()).toBe("unknown host");
  });
});
