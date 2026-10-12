import path from "node:path";
import { fileURLToPath } from "node:url";
const RPC = "https://api.devnet.solana.com";
export function formatSol(lamports) {
  if (!Number.isSafeInteger(lamports) || lamports < 0) throw new Error("Invalid lamport balance");
  const digits = String(lamports).padStart(10, "0");
  return digits.slice(0, -9) + "." + digits.slice(-9);
}
export async function walletBalance(address, fetchFn = fetch) {
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address || "")) throw new Error("Provide a Solana public address");
  const response = await fetchFn(RPC, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [address, { commitment: "confirmed" }] }),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error("RPC HTTP " + response.status);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "RPC error");
  const lamports = payload.result?.value;
  return { network: "devnet", address, lamports, sol: formatSol(lamports) };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await walletBalance(process.argv[2]), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
