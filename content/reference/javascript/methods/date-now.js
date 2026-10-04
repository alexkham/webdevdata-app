// content/reference/javascript/methods/date-now.js
//
// Doc-only page: the result changes on every call, so a live demo could only
// show a number that is already stale and that differs from whatever the
// differential audit recorded. Same rule as any non-deterministic value.

export const meta = {
  slug:        'date-now',
  name:        'Date.now',
  signature:   'Date.now()',
  blurb:       'The current timestamp without allocating a Date — and the wrong clock for measuring.',
  category:    'date',
  type:        'date',
  hasLiveDemo: false,
  version:     'ES5 (2009)',
  searchTerms: 'Date.now timestamp epoch milliseconds current time performance.now monotonic clock benchmark javascript',
};

export const method = {
  slug:      'date-now',
  name:      'Date.now',
  signature: 'Date.now()',
  returns:   { type: 'number', desc: 'Milliseconds since 1 January 1970 UTC, as an integer. No Date object is created.' },

  category:    'Date static method',
  version:     'ES5 (2009)',
  hasLiveDemo: false,

  subtitle: 'The cheapest way to ask what time it is. It is also a wall clock, which means it can jump backwards — so it is the wrong tool for measuring how long something took.',

  cheat: {
    commonCall: 'Date.now()',
    returns:    'milliseconds since the epoch',
    replaces:   'new Date().getTime()',
    watchOut:   'not monotonic — use performance.now() for durations',
  },

  parameters: [],

  examples: [
    { title: 'A timestamp',        code: 'typeof Date.now()',                    returns: "'number'" },
    { title: 'No object allocated',code: 'Date.now()',                           returns: '1773576000000, for example' },
    { title: 'The older idiom',    code: 'new Date().getTime()',                 returns: 'the same value, plus a Date' },
    { title: 'Build a Date from it',code: 'new Date(Date.now())',                returns: 'equivalent to new Date()' },
    { title: 'Elapsed, roughly',   code: 'const t = Date.now();\nwork();\nDate.now() - t', returns: 'milliseconds, subject to clock changes' },
    { title: 'Elapsed, properly',  code: 'const t = performance.now();\nwork();\nperformance.now() - t', returns: 'monotonic, sub-millisecond' },
  ],

  pitfalls: [
    {
      name: 'It is not monotonic',
      desc: 'It reads the system wall clock, which NTP adjusts, users change, and daylight saving shifts. A duration measured by subtracting two readings can come out negative, or absurdly large, for reasons that have nothing to do with your code.',
      wrong: { label: 'Can go backwards', code: 'const t = Date.now();\nawait slow();\nDate.now() - t', output: 'occasionally negative' },
      fix:   { label: 'Monotonic clock',  code: 'const t = performance.now();\nawait slow();\nperformance.now() - t', output: 'always increasing' },
    },
    {
      name: 'Millisecond resolution, and often less',
      desc: 'The value is an integer number of milliseconds, so anything faster than that measures as zero. Browsers also deliberately coarsen the clock to mitigate timing attacks, so consecutive calls can return the same number.',
      wrong: { label: 'Too coarse', code: 'const t = Date.now();\nfastThing();\nDate.now() - t', output: '0' },
      fix:   { label: 'Finer clock', code: 'const t = performance.now();\nfastThing();\nperformance.now() - t', output: '0.043' },
    },
    {
      name: 'Using it as a unique id',
      desc: 'Two calls in the same millisecond return the same number, and on a fast machine that happens constantly. A timestamp is not an identifier — crypto.randomUUID is, and it is built in.',
      wrong: { label: 'Collides', code: 'const id = Date.now();', output: 'duplicates within a millisecond' },
      fix:   { label: 'A real id', code: 'const id = crypto.randomUUID();', output: 'unique' },
    },
    {
      name: 'It cannot be stubbed by assignment in strict code',
      desc: 'Tests that need a fixed clock often reassign Date.now. It works, but it leaks between tests if not restored, and it does not affect new Date(). Fake-timer helpers replace both together, which is what you actually want.',
      wrong: { label: 'Only half stubbed', code: 'Date.now = () => 0;\nnew Date().getTime()', output: 'still the real time' },
      fix:   { label: 'Fake timers',       code: 'vi.useFakeTimers();\nvi.setSystemTime(0);', output: 'both stubbed' },
    },
  ],

  when: {
    use: [
      'Recording when something happened',
      'Cache timestamps and expiry checks',
      'Cheap age comparisons, where a second either way does not matter',
      'Avoiding a Date allocation in a hot path',
    ],
    avoid: [
      'Measuring elapsed time → performance.now()',
      'Generating ids → crypto.randomUUID()',
      'Sub-millisecond timing → performance.now()',
      'Anything that must survive a clock change → a monotonic source',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A number; no object is allocated',
    cpython:    'V8: Builtins-date-now',
    memory:     'No allocation — the reason to prefer it over new Date().getTime()',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date.prototype.getTime',     slug: 'date-gettime',      when: 'The same number from an existing Date' },
    { name: 'Date.UTC',                   slug: 'date-utc',          when: 'A timestamp for a specific moment instead of now' },
    { name: 'Date.parse',                 slug: 'date-parse',        when: 'A timestamp from a string' },
    { name: 'Date.prototype.toISOString', slug: 'date-toisostring',  when: 'Turning the moment into storable text' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because the value is different every time it is called. A demo would show a number that was already stale by the time you read it, and the differential audit that checks every other demo on this site could never reproduce it. The examples above describe the shape rather than pretending to a fixed answer.',
    },
    {
      q: 'Date.now() or new Date().getTime()?',
      a: 'Date.now(), when you only want the number — it skips constructing a Date object you immediately discard. They return the same value.',
      code: 'Date.now();\nnew Date().getTime();   // identical value, one allocation',
    },
    {
      q: 'Why should I not use it for timing?',
      a: 'Because it follows the system clock, which can be adjusted forwards or backwards while your code runs. performance.now() is monotonic — it only ever increases — and has sub-millisecond resolution. Use Date.now for WHEN, performance.now for HOW LONG.',
      code: 'const start = performance.now();\nawait work();\nconst ms = performance.now() - start;',
    },
    {
      q: 'What is the epoch?',
      a: 'Midnight UTC on 1 January 1970, the reference point Unix chose and JavaScript inherited. Every Date is internally just an offset in milliseconds from that instant, which is why a Date carries no timezone of its own.',
    },
  ],

  history: [
    { version: 'ES1', note: 'new Date().getTime() was the only way to read the current time.' },
    { version: 'ES5', note: 'Date.now added, avoiding the throwaway allocation.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now',
    meta:  'Date.now',
  },

};
