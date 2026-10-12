import test from "node:test";
import assert from "node:assert/strict";
import { walletBalance, formatSol } from "./balance.js";
const address = "11111111111111111111111111111111";
test("balances retain all nine decimal places", () => {
  assert.equal(formatSol(1), "0.000000001");
  assert.equal(formatSol(1000000001), "1.000000001");
  assert.throws(() => formatSol(Number.MAX_SAFE_INTEGER + 1));
});
test("RPC errors are reported instead of showing a zero balance", async () => {
  await assert.rejects(() => walletBalance(address, async () => ({ ok: true, json: async () => ({ error: { message: "rate limited" } }) })), /rate limited/);
  const result = await walletBalance(address, async (_url, options) => {
    assert.equal(JSON.parse(options.body).method, "getBalance");
    return { ok: true, json: async () => ({ result: { value: 1234567890 } }) };
  });
  assert.equal(result.sol, "1.234567890");
});
