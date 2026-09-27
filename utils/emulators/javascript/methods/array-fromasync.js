// Emulator for the static Array.fromAsync (async demo — demoAsync: true).
//
// Each spec entry is [outcome, value, delayMs]: 'ok' fulfils with value,
// anything else rejects with new Error(value), after delayMs. The page shows
// the same construction inline, so the displayed expression is what runs.
const settleAfter = ([k, v, ms]) =>
  new Promise((res, rej) => setTimeout(() => (k === 'ok' ? res(v) : rej(new Error(v))), ms));

export default async function arrayFromAsync(json) {
  return Array.fromAsync(JSON.parse(json).map(settleAfter));
}
