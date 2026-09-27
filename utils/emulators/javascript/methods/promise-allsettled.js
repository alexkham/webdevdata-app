// Emulator for the static Promise.allSettled (async demo — demoAsync: true).
//
// Each spec entry is [outcome, value, delayMs]: 'ok' fulfils with value,
// anything else rejects with new Error(value), after delayMs. The page shows
// the same construction inline, so the displayed expression is what runs.
const settleAfter = ([k, v, ms]) =>
  new Promise((res, rej) => setTimeout(() => (k === 'ok' ? res(v) : rej(new Error(v))), ms));

// async, so a bad JSON input becomes a rejection rather than a sync throw.
export default async function promiseAllSettled(json) {
  return Promise.allSettled(JSON.parse(json).map(settleAfter));
}
