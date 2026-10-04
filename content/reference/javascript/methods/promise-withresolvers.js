// content/reference/javascript/methods/promise-withresolvers.js
//
// Doc-only. The only synchronously-observable fact — that it returns an
// object with three fixed keys — is a constant, so a demo would be a fixed
// answer pretending to be a computation.

export const meta = {
  slug:        'promise-withresolvers',
  name:        'Promise.withResolvers',
  signature:   'Promise.withResolvers()',
  blurb:       'A promise plus its resolve and reject, without the deferred-pattern boilerplate.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: false,
  version:     'ES2024',
  searchTerms: 'Promise.withResolvers deferred pattern resolve reject outside escape constructor event emitter es2024 javascript',
};

export const method = {
  slug:      'promise-withresolvers',
  name:      'Promise.withResolvers',
  signature: 'Promise.withResolvers()',
  returns:   { type: 'object', desc: 'An object with exactly three properties — promise, resolve and reject — letting you settle the promise from outside the code that created it.' },

  category:    'Promise static method',
  version:     'ES2024',
  hasLiveDemo: false,

  subtitle: 'The deferred pattern, standardised. Every codebase had a hand-rolled version of this; ES2024 finally shipped it.',

  cheat: {
    commonCall: 'const {promise, resolve, reject} = Promise.withResolvers()',
    returns:    'an object with three properties',
    replaces:   'let res; const p = new Promise(r => { res = r; });',
    watchOut:   'nothing settles it for you — a forgotten call hangs forever',
  },

  parameters: [],

  patterns: [
    {
      name: 'Bridge an event to a promise',
      desc: 'The canonical use.',
      code: 'const {promise, resolve} = Promise.withResolvers();\nsocket.once("open", resolve);\nawait promise;',
    },
    {
      name: 'A queue of waiters',
      desc: 'Hand out promises, settle them later.',
      code: 'const waiters = [];\nfunction wait() {\n  const d = Promise.withResolvers();\n  waiters.push(d);\n  return d.promise;\n}',
    },
    {
      name: 'Prefer the constructor where it fits',
      desc: 'If resolution happens inside, no escape is needed.',
      code: 'new Promise((res, rej) => fs.readFile(p, (e, d) => e ? rej(e) : res(d)));',
    },
  ],

  examples: [
    { title: 'Exactly three keys',   code: 'Object.keys(Promise.withResolvers())', returns: "['promise', 'resolve', 'reject']" },
    { title: 'resolve is a function',code: 'typeof Promise.withResolvers().resolve', returns: "'function'" },
    { title: 'It works',             code: 'const {promise, resolve} = Promise.withResolvers();\nresolve("done");\nawait promise', returns: "'done'" },
    { title: 'The promise is a real one', code: 'Promise.withResolvers().promise instanceof Promise', returns: 'true' },
    { title: 'Unsettled stays pending', code: 'await Promise.withResolvers().promise', returns: 'never settles' },
    { title: 'The old idiom',        code: 'let res;\nconst p = new Promise(r => { res = r; });', returns: 'the same thing, by hand' },
  ],

  pitfalls: [
    {
      name: 'Nothing settles it for you',
      desc: 'The promise stays pending until you call resolve or reject. A code path that returns early without settling leaves every awaiter hanging silently — no error, no timeout. This is the cost of escaping the constructor.',
      wrong: { label: 'Hangs', code: 'const {promise} = Promise.withResolvers();\nawait promise;', output: 'never continues' },
      fix:   { label: 'Always settle', code: 'try { doWork(resolve); } catch (e) { reject(e); }', output: 'settles either way' },
    },
    {
      name: 'It loses the constructor safety net',
      desc: 'An exception thrown inside the Promise constructor executor automatically rejects the promise. There is no executor here, so a throw in your surrounding code leaves the promise pending forever unless you reject it yourself.',
      wrong: { label: 'Pending forever', code: 'const {promise, resolve} = Promise.withResolvers();\nrisky();   // throws\nresolve(1);', output: 'promise never settles' },
      fix:   { label: 'Reject on throw', code: 'try { risky(); resolve(1); } catch (e) { reject(e); }', output: 'rejected' },
    },
    {
      name: 'Settling twice is silently ignored',
      desc: 'The first call wins and later ones do nothing — no error, no warning. That makes double-resolution bugs invisible: a race between two code paths produces whichever result arrived first, with no indication that the other happened.',
      wrong: { label: 'Second ignored', code: 'resolve("a");\nresolve("b");\nawait promise', output: "'a'" },
      fix:   { label: 'Guard if it matters', code: 'let settled = false;\nconst once = v => { if (!settled) { settled = true; resolve(v); } };', output: 'explicit' },
    },
    {
      name: 'ES2024 — check your runtime',
      desc: 'Node 22+ and 2024-era browsers. The hand-rolled version is three lines and works everywhere, which is exactly why this took so long to standardise.',
      wrong: { label: 'Missing', code: 'Promise.withResolvers()', output: 'TypeError: Promise.withResolvers is not a function' },
      fix:   { label: 'Roll it yourself', code: 'function withResolvers() {\n  let resolve, reject;\n  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });\n  return {promise, resolve, reject};\n}', output: 'equivalent' },
    },
  ],

  when: {
    use: [
      'Bridging an event, callback or message into a promise',
      'Handing a promise to a caller and settling it from elsewhere',
      'A queue of waiters settled by a later signal',
      'Replacing a hand-rolled deferred helper',
    ],
    avoid: [
      'Resolution happens inside one function → the Promise constructor',
      'You already have the value → Promise.resolve',
      'You can await the source directly → do that',
      'Targeting runtimes older than 2024 → the three-line equivalent',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A plain object with three own properties; the promise is a normal Promise',
    cpython:    'V8: Builtins-promise-withresolvers',
    memory:     'Allocates the promise and the wrapper object',
    threadSafe: 'Single-threaded; resolve and reject may be called from any later tick',
  },

  related: [
    { name: 'Promise.resolve',           slug: 'promise-resolve', when: 'You already have the value' },
    { name: 'Promise.reject',            slug: 'promise-reject',  when: 'You already know it failed' },
    { name: 'Promise.prototype.then',    slug: 'promise-then',    when: 'Consuming the promise you handed out' },
    { name: 'Promise.race',             slug: 'promise-race',     when: 'Bounding a promise that may never settle' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because the only thing observable without waiting is that the returned object has three fixed keys — a constant, not a computation. Anything more requires the promise to settle, which happens asynchronously. The examples above were run in a real runtime.',
    },
    {
      q: 'What was the deferred pattern?',
      a: 'Declaring variables outside a Promise constructor and capturing resolve and reject into them, so they could be called from elsewhere. Nearly every promise library shipped a helper for it, and this method is that helper standardised.',
      code: 'let resolve, reject;\nconst promise = new Promise((res, rej) => { resolve = res; reject = rej; });',
    },
    {
      q: 'When should I prefer the constructor?',
      a: 'Whenever the thing that settles the promise is inside the same function — wrapping a callback API, for example. The constructor also rejects automatically if its executor throws, which withResolvers cannot do for you.',
    },
    {
      q: 'What if I never call resolve?',
      a: 'The promise stays pending forever and every awaiter hangs, with no error. Guard the paths that might skip settling, and consider racing against a timeout if the signal comes from outside your control.',
      code: 'await Promise.race([promise, timeout(5000)]);',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise shipped with only the constructor; the deferred pattern was written by hand everywhere.' },
    { version: 'ES2024', note: 'Promise.withResolvers added, standardising it.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers',
    meta:  'Promise.withResolvers',
  },

};
