import { describe, it } from "node:test";
import { fetchUser } from "../app.js";

describe("Users", () => {
  it("should fetch user", async t => {
    const data = await fetchUser(1);
    delete data.created_at;
    delete data.updated_at;
    delete data.age;

    t.assert.snapshot(data);
  });
});
