// content/reference/javascript/methods/promise-race.js
//
// Doc-only — see the FAQ. Examples run and awaited in a real runtime.

export const meta = {
  slug:        'promise-race',
  name:        'Promise.race',
  signature:   'Promise.race(iterable)',
  blurb:       'First to SETTLE wins — including first to fail, which is why it works for timeouts.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: false,
  version:     'ES2015',
  searchTerms: 'Promise.race timeout first settle reject any difference empty array hangs abort es2015 javascript',
};

export const method = {
  slug:      'promise-race',
  name:      'Promise.race',
  signature: 'Promise.race(iterable)',
  returns:   { type: 'Promise', desc: 'A Promise that settles exactly as the first input to settle does — fulfilled if that one fulfilled, rejected if it rejected.' },

  category:    'Promise static method',
  version:     'ES2015',
  hasLiveDemo: false,

  subtitle: 'Settled, not succeeded. A fast rejection beats a slow success, which makes race the natural way to impose a timeout and the wrong way to ask for the first working result.',

  cheat: {
    commonCall: 'await Promise.race([work, timeout(5000)])',
    returns:    'the first settlement, win or lose',
    replaces:   'manual timer plus flag bookkeeping',
    watchOut:   'an EMPTY array never settles — it hangs forever',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable. A non-promise value counts as already settled, so including one makes race resolve immediately with it.' },
  ],

  patterns: [
    {
      name: 'Impose a timeout',
      desc: 'The canonical use.',
      code: 'const timeout = ms => new Promise((_, rej) =>\n  setTimeout(() => rej(new Error("timeout")), ms));\nawait Promise.race([fetchData(), timeout(5000)]);',
    },
    {
      name: 'First SUCCESS instead',
      desc: 'any ignores rejections; race does not.',
      code: 'await Promise.any([mirrorA(), mirrorB()]);',
    },
    {
      name: 'Cancel the loser too',
      desc: 'race does not stop anything by itself.',
      code: 'const c = new AbortController();\ntry { await Promise.race([fetch(u, {signal: c.signal}), timeout(5000)]); }\nfinally { c.abort(); }',
    },
  ],

  examples: [
    { title: 'First to settle',     code: 'await Promise.race([delay(50, "slow"), Promise.resolve("fast")])', returns: "'fast'" },
    { title: 'A fast rejection wins',code: 'await Promise.race([failAfter(1, new Error("early")), delay(50, "ok")])', returns: 'throws Error: early' },
    { title: 'Empty array hangs',   code: 'await Promise.race([])', returns: 'never settles' },
    { title: 'A plain value wins instantly', code: 'await Promise.race([delay(50, "slow"), 42])', returns: '42' },
    { title: 'any ignores the rejection', code: 'await Promise.any([Promise.reject(new Error("a")), delay(5, "ok")])', returns: "'ok'" },
    { title: 'The loser keeps running', code: 'the slow fetch still completes, its result discarded', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'An empty iterable never settles',
      desc: 'Promise.race([]) returns a promise that stays pending forever, so an await on it hangs the function silently — no error, no timeout, no log. Promise.any([]) rejects immediately instead, which is at least visible.',
      wrong: { label: 'Hangs', code: 'await Promise.race([])', output: 'the function never continues' },
      fix:   { label: 'Guard the empty case', code: 'if (!tasks.length) return [];\nawait Promise.race(tasks);', output: 'returns' },
    },
    {
      name: 'A fast failure beats a slow success',
      desc: 'This is the definition, not a bug — but it means race is wrong for "try several mirrors and take whichever works". One mirror failing quickly rejects the whole race while a working mirror is still in flight. Promise.any is the method for that.',
      wrong: { label: 'Fast failure wins', code: 'await Promise.race([failsFast, succeedsSlowly])', output: 'throws' },
      fix:   { label: 'First success',     code: 'await Promise.any([failsFast, succeedsSlowly])', output: 'the slow result' },
    },
    {
      name: 'It does not cancel the losers',
      desc: 'The timed-out request carries on to completion, still holding its connection and still able to produce an unhandled rejection later. A timeout without an AbortController limits how long you WAIT, not how long the work runs.',
      wrong: { label: 'Still in flight', code: 'await Promise.race([fetch(url), timeout(1000)])', output: 'the fetch continues' },
      fix:   { label: 'Abort it',        code: 'const c = new AbortController();\ntry { await Promise.race([fetch(url, {signal: c.signal}), timeout(1000)]); }\nfinally { c.abort(); }', output: 'cancelled' },
    },
    {
      name: 'A non-promise in the array wins immediately',
      desc: 'Plain values count as already settled, so one stray non-promise makes the race pointless — it resolves on the first microtask with that value. Easy to do by forgetting to call a function that returns a promise.',
      wrong: { label: 'Resolves at once', code: 'await Promise.race([fetchData, timeout(5000)])', output: 'the fetchData FUNCTION, unresolved' },
      fix:   { label: 'Call it',          code: 'await Promise.race([fetchData(), timeout(5000)])', output: 'a real race' },
    },
  ],

  when: {
    use: [
      'Timeouts, paired with an AbortController',
      'Taking the first response from several equivalent sources, when a failure should also abort',
      'Waiting for whichever of two events happens first',
    ],
    avoid: [
      'You want the first SUCCESS → Promise.any',
      'You want every result → Promise.all or allSettled',
      'The iterable may be empty → guard it, or it hangs',
      'You need the losing work to stop → AbortController',
    ],
  },

  notes: {
    complexity: 'O(n) to attach handlers; wall-clock time is the FASTEST input',
    return:     'A new Promise mirroring the first settlement',
    cpython:    'V8: Builtins-promise-race',
    memory:     'Holds handlers on every input until one settles',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Promise.any',        slug: 'promise-any',        when: 'First success, ignoring rejections' },
    { name: 'Promise.all',        slug: 'promise-all',        when: 'Every result, failing fast' },
    { name: 'Promise.allSettled', slug: 'promise-allsettled', when: 'Every outcome, never rejecting' },
    { name: 'Promise.reject',     slug: 'promise-reject',     when: 'Building the timeout side of the race' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because settlement happens asynchronously and this site demo harness renders the emulator return value synchronously — for a Promise that is an empty object. Showing a fixed winner would misrepresent the timing that race is entirely about. The examples above were run and awaited in a real runtime.',
    },
    {
      q: 'race or any?',
      a: 'race settles on the first to FINISH either way; any resolves on the first to SUCCEED and only rejects if all of them fail. Use race for timeouts, any for redundancy.',
      code: 'Promise.race([work, timeout]);      // whichever first\nPromise.any([mirrorA, mirrorB]);    // whichever works',
    },
    {
      q: 'Does a timeout actually cancel the request?',
      a: 'No. It stops you waiting; the request continues. Pair it with an AbortController and abort in a finally block if you want the work to stop and the connection released.',
    },
    {
      q: 'Why does an empty array hang?',
      a: 'Because there is no input that could ever settle, and the specification does not special-case it. The promise stays pending forever. Promise.any([]) rejects with an AggregateError instead, which is the more defensible choice.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise.race added with Promise.all.' },
    { version: 'ES2020', note: 'Promise.any added, giving first-success semantics race could not express.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race',
    meta:  'Promise.race',
  },

  tryInTool: [],
};
