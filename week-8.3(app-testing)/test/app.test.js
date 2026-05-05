import assert from "node:assert";
import { describe, it } from "node:test";
import { greet, greetInSpanish } from "../app.js";

describe("Should greet users", () => {
  it("should return proper greeting", () => {
    const expected = "Hello rahul";
    const actual = greet("rahul");
    assert.strictEqual(actual, expected);
  });

  it("should return proper greeting in Spanish", () => {
    const expected = "Hola rahul";
    const actual = greetInSpanish("rahul");
    assert.strictEqual(actual, expected);
  });
});
