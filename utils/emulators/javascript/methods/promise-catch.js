// Emulator for Promise.prototype.catch (async demo — demoAsync: true).
//
// rethrow = 0 returns from the handler (the chain RECOVERS); rethrow = 1
// throws it again (the chain stays rejected). That contrast is the page.
export default async function promiseCatch(msg, rethrow) {
  return Promise.reject(new Error(msg)).catch((e) => { if (rethrow) throw e; return 'recovered: ' + e.message; });
}
