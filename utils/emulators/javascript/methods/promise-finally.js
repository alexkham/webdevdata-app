// Emulator for Promise.prototype.finally (async demo — demoAsync: true).
//
// The callback's return value (999) is ignored; only a throw replaces the
// outcome. boom = 1 takes the throwing branch.
export default async function promiseFinally(n, boom) {
  return Promise.resolve(n).finally(() => { if (boom) throw new Error('from finally'); return 999; });
}
