// Emulator for the static Promise.race (async demo — demoAsync: true).
//
// Each spec entry is [outcome, value, delayMs]: 'ok' fulfils with value,
// anything else rejects with new Error(value), after delayMs. The page shows
// the same construction inline, so the displayed expression is what runs.
const settleAfter = ([k, v, ms]) =>
  new Promise((res, rej) => setTimeout(() => (k === 'ok' ? res(v) : rej(new Error(v))), ms));

// async, so a bad JSON input becomes a rejection rather than a sync throw.
export default async function promiseRace(json) {
  return Promise.race(JSON.parse(json).map(settleAfter));
}
