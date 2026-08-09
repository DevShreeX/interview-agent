import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../src/server.js";

// We want to set up an environment that causes errors to test the 500 error blocks
test("Memory Controller - Search without query should return 400", async () => {
  const res = await request(app).post("/api/memory/search").send({});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, "query is required");
});

test("Memory Controller - Search with query should return 200", async () => {
  const res = await request(app).post("/api/memory/search").send({ query: "test" });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.query, "test");
});
