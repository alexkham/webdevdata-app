// Emulator for Promise.prototype.then (async demo — demoAsync: true).
//
// A throw inside the callback rejects the promise then returns — the
// behaviour the page is mostly about.
export default async function promiseThen(n) {
  return Promise.resolve(n).then((v) => { if (v < 0) throw new Error('negative'); return v * 2; });
}
