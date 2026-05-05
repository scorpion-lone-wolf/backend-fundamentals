import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { processOrder } from "../app.js";

describe("Process Order", () => {
  it("should process order", async () => {
    // mock processPayment
    const mockedProcessPayment = mock.fn(async (card, amount) => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res({
            id: 432,
            card,
            amount,
          });
        }, 1000);
      });
    });

    const card = "4111111111111111";
    const amount = 39.99;
    const expected = { id: 432, card, amount };
    const actual = await processOrder(card, amount, mockedProcessPayment);
    assert.deepStrictEqual(actual, expected);
  });
});
