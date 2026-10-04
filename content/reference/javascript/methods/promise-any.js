// content/reference/javascript/methods/promise-any.js
//
// Live async demo (demoAsync): the page shows `await <expr>` and renders
// the settled value. Every case is checked by audit-emulators-js.mjs.

export const meta = {
  slug:        'promise-any',
  name:        'Promise.any',
  signature:   'Promise.any(iterable)',
  blurb:       'First to SUCCEED — rejections are ignored until every one has failed.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: true,
  version:     'ES2020',
  searchTerms: 'Promise.any first success AggregateError errors redundancy mirrors fallback race difference es2020 javascript',
};

export const method = {
  slug:      'promise-any',
  name:      'Promise.any',
  signature: 'Promise.any(iterable)',
  returns:   { type: 'Promise', desc: 'A Promise for the first FULFILLED result. Rejects only if every input rejects, with an AggregateError whose errors property holds all the reasons.' },

  category:    'Promise static method',
  version:     'ES2020',
  hasLiveDemo: true,

  subtitle: 'The redundancy combinator. Where race settles on the first thing to finish, any waits for something to actually work — which is what you almost always mean when you have several equivalent sources.',

  cheat: {
    commonCall: 'await Promise.any(mirrors.map(fetch))',
    returns:    'the first successful result',
    replaces:   'a chain of catch-and-retry fallbacks',
    watchOut:   'all failing gives an AggregateError, not the last error',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable of promises. An empty iterable rejects immediately with an AggregateError — unlike race, which would hang.' },
  ],

  demoAsync: true,
  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON list of [outcome, value, ms]', input: 'text' },
  ],
  demoTemplate: "Promise.any(JSON.parse({json}).map(([k, v, ms]) => new Promise((res, rej) => setTimeout(() => k === 'ok' ? res(v) : rej(new Error(v)), ms))))",
  cases: [
    { id: 'skip',   label: 'early failure is ignored', values: { json: '[["err","a",10],["ok","ok",30]]' } },
    { id: 'allbad', label: 'all fail → AggregateError', values: { json: '[["err","a",10],["err","b",20]]' } },
    { id: 'empty',  label: 'empty → rejects at once',   values: { json: '[]' } },
  ],
  demoExplainer: "Each input is [outcome, value, delay in ms]: 'ok' fulfils with the value, anything else rejects with an Error carrying it. The first case is the contrast with race: the rejection at 10ms does not end the wait, and the success at 30ms wins. Only when EVERY input rejects does any reject, with an AggregateError whose own message is generic — the real reasons are in its errors array. An empty list rejects immediately, which is the sensible opposite of Promise.race([]), which hangs forever.",

  patterns: [
    {
      name: 'Try several mirrors',
      desc: 'The canonical use — first one that works.',
      code: 'const data = await Promise.any(mirrors.map(u => fetch(u)));',
    },
    {
      name: 'Read the collected errors',
      desc: 'AggregateError carries every reason.',
      code: 'try { await Promise.any(tasks); }\ncatch (e) { console.error(e.errors); }',
    },
    {
      name: 'Timeouts need race',
      desc: 'any would ignore the timeout rejection.',
      code: 'await Promise.race([work, timeout(5000)]);',
    },
  ],

  examples: [
    { title: 'First success wins',  code: 'await Promise.any([Promise.reject(new Error("a")), delay(5, "ok")])', returns: "'ok'" },
    { title: 'Rejections ignored',  code: 'await Promise.any([failsFast, succeedsSlowly])', returns: 'the slow result' },
    { title: 'All reject',          code: 'await Promise.any([Promise.reject(new Error("a")), Promise.reject(new Error("b"))])', returns: 'throws AggregateError: All promises were rejected' },
    { title: 'The reasons are kept',code: 'Promise.any([Promise.reject(new Error("a"))]).catch(e => e.errors.length)', returns: '1' },
    { title: 'Empty rejects at once',code: 'await Promise.any([])', returns: 'throws AggregateError' },
    { title: 'race would hang',     code: 'await Promise.race([])', returns: 'never settles' },
  ],

  pitfalls: [
    {
      name: 'The rejection is an AggregateError, not your error',
      desc: 'When everything fails you get a wrapper, and error-handling code that reads e.message finds the generic "All promises were rejected" rather than anything useful. The real reasons are in e.errors, an array in input order.',
      wrong: { label: 'Generic message', code: 'catch (e) { log(e.message); }', output: "'All promises were rejected'" },
      fix:   { label: 'Read .errors',    code: 'catch (e) { log(e.errors.map(x => x.message)); }', output: "['a', 'b']" },
    },
    {
      name: 'It hides failures you might want to know about',
      desc: 'If the first mirror is permanently broken and the second always works, any succeeds every time and nothing reports the broken one. Log e.errors, or inspect with allSettled, if partial failure is worth an alert.',
      wrong: { label: 'Silent', code: 'await Promise.any([brokenMirror, goodMirror])', output: 'succeeds, broken one unreported' },
      fix:   { label: 'See everything', code: 'const rs = await Promise.allSettled([brokenMirror, goodMirror]);', output: 'both outcomes visible' },
    },
    {
      name: 'It is not a timeout mechanism',
      desc: 'Because a rejection does not end the wait, racing work against a rejecting timer does nothing — any simply ignores the timeout and keeps waiting for the work. Timeouts need race.',
      wrong: { label: 'Timeout ignored', code: 'await Promise.any([slowWork, timeout(100)])', output: 'waits for slowWork' },
      fix:   { label: 'Use race',        code: 'await Promise.race([slowWork, timeout(100)])', output: 'rejects at 100ms' },
    },
    {
      name: 'ES2020 — check your runtime',
      desc: 'Node 15+ and 2020-era browsers, slightly later than allSettled. AggregateError arrived with it, so a polyfill needs both.',
      wrong: { label: 'Missing', code: 'Promise.any(tasks)', output: 'TypeError: Promise.any is not a function' },
      fix:   { label: 'Invert with all', code: 'Promise.all(tasks.map(p => p.then(v => Promise.reject(v), e => e)))\n  .then(errs => Promise.reject(errs), v => v)', output: 'the same semantics, inverted' },
    },
  ],

  when: {
    use: [
      'Several equivalent sources — mirrors, replicas, CDNs',
      'Fallback chains where any one success is enough',
      'Racing a cache against a network fetch',
    ],
    avoid: [
      'Timeouts → Promise.race, which respects rejections',
      'You need every result → Promise.all or allSettled',
      'You need to know about the failures that were tolerated → allSettled',
      'Targeting runtimes older than 2020 → the inverted-all idiom',
    ],
  },

  notes: {
    complexity: 'O(n); wall-clock time is the fastest SUCCESS, or the slowest input if all fail',
    return:     'A new Promise; rejects with an AggregateError only if every input rejects',
    cpython:    'V8: Builtins-promise-any',
    memory:     'Collects rejection reasons until a success arrives or all fail',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Promise.race',       slug: 'promise-race',       when: 'First to settle — the timeout tool' },
    { name: 'Promise.allSettled', slug: 'promise-allsettled', when: 'Every outcome, including tolerated failures' },
    { name: 'Promise.all',        slug: 'promise-all',        when: 'Every result, failing fast' },
    { name: 'Promise.prototype.catch', slug: 'promise-catch', when: 'Unwrapping the AggregateError' },
  ],

  faq: [
    {
      q: 'any or race?',
      a: 'any for redundancy — first thing that WORKS. race for timeouts — first thing that FINISHES. The distinction only shows up when something fails quickly, which is exactly the case you are guarding against.',
    },
    {
      q: 'How do I see why everything failed?',
      a: 'The AggregateError has an errors array holding every rejection reason in input order. Its own message is generic, so always log the array rather than the message.',
      code: 'catch (e) { console.error(e.errors); }',
    },
    {
      q: 'Why does an empty array reject rather than hang?',
      a: 'Because with no inputs there can be no success, so rejecting is the correct answer — and it was specified that way deliberately, in contrast to race, which was already shipped and hangs. It is the better of the two behaviours.',
    },
  ],

  history: [
    { version: 'ES2020', note: 'Promise.any added with AggregateError, alongside Promise.allSettled.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any',
    meta:  'Promise.any',
  },

};
