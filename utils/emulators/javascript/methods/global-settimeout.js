// Emulator for setTimeout (async demo — demoAsync: true).
//
// Two timers push A and B after delays a and b; a third resolves with the
// log once both have fired. Timers fire in order of delay, and equal delays
// fire in registration order. Delays only ~1ms apart are NOT reliably
// ordered, so the audited cases use clear gaps.
export default async function globalSetTimeout(a, b) {
  return new Promise((done) => {
    const log = [];
    setTimeout(() => log.push('A'), a);
    setTimeout(() => log.push('B'), b);
    setTimeout(() => done(log), Math.max(a, b) + 5);
  });
}
