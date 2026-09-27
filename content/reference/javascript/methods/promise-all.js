// content/reference/javascript/methods/promise-all.js
//
// Doc-only, like every Promise page: the result only exists after the
// microtask queue drains, and the demo harness is synchronous. Every example
// below was run and awaited in a real runtime.

export const meta = {
  slug:        'promise-all',
  name:        'Promise.all',
  signature:   'Promise.all(iterable)',
  blurb:       'All of them, in order — and it rejects on the first failure without cancelling the rest.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: false,
  version:     'ES2015',
  searchTerms: 'Promise.all parallel concurrent await array order reject fail fast allSettled cancel es2015 javascript',
};

export const method = {
  slug:      'promise-all',
  name:      'Promise.all',
  signature: 'Promise.all(iterable)',
  returns:   { type: 'Promise<Array>', desc: 'A Promise for an array of results in the ORDER OF THE INPUT, not the order they finished. Rejects as soon as any input rejects, with that first reason.' },

  category:    'Promise static method',
  version:     'ES2015',
  hasLiveDemo: false,

  subtitle: 'The standard way to run several async operations at once. Its fail-fast behaviour is the right default and the source of its two traps: you lose the successful results, and the other operations keep running.',

  cheat: {
    commonCall: 'await Promise.all(urls.map(fetch))',
    returns:    'a Promise for an array, in input order',
    replaces:   'sequential awaits in a loop',
    watchOut:   'one rejection discards every other RESULT',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable, usually an array. Non-promise values are passed through as if already resolved, so a mixed array works.' },
  ],

  patterns: [
    {
      name: 'Run requests concurrently',
      desc: 'The canonical use — map to promises, then await once.',
      code: 'const [user, posts] = await Promise.all([\n  fetchUser(id),\n  fetchPosts(id),\n]);',
    },
    {
      name: 'Start before you await',
      desc: 'The promises must already be running.',
      code: 'const a = fetchA();\nconst b = fetchB();\nconst [ra, rb] = await Promise.all([a, b]);',
    },
    {
      name: 'Keep partial results',
      desc: 'allSettled when one failure should not lose the rest.',
      code: 'const results = await Promise.allSettled(tasks);',
    },
  ],

  examples: [
    { title: 'Results in input order', code: 'await Promise.all([delay(20, 1), Promise.resolve(2)])', returns: '[1, 2]' },
    { title: 'Non-promises pass through', code: 'await Promise.all([1, 2])', returns: '[1, 2]' },
    { title: 'Empty array resolves at once', code: 'await Promise.all([])', returns: '[]' },
    { title: 'First rejection wins',  code: 'await Promise.all([Promise.resolve(1), Promise.reject(new Error("boom"))])', returns: 'throws Error: boom' },
    { title: 'Successes are discarded', code: 'try { await Promise.all([Promise.resolve(1), Promise.reject(e)]); } catch { }', returns: 'the 1 is unreachable' },
    { title: 'The others keep running',code: 'the slow task still completes after the rejection', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'One rejection throws away every successful result',
      desc: 'The rejection reason is all you get — the results that DID arrive are unreachable. For a dashboard where three of four panels loaded, that is the wrong trade, and allSettled is the method you wanted.',
      wrong: { label: 'All or nothing', code: 'await Promise.all([ok1, ok2, failing])', output: 'throws; ok1 and ok2 are lost' },
      fix:   { label: 'Keep what worked', code: 'const rs = await Promise.allSettled([ok1, ok2, failing]);\nrs.filter(r => r.status === "fulfilled")', output: 'two results' },
    },
    {
      name: 'Rejecting does not cancel the other operations',
      desc: 'There is no cancellation in the Promise model. The remaining requests continue, their results are ignored, and any rejection among them may surface as an unhandled rejection. Use AbortController if you need the work to actually stop.',
      wrong: { label: 'Still running', code: 'await Promise.all([failing, slowFetch])', output: 'slowFetch completes regardless' },
      fix:   { label: 'Abort them',    code: 'const c = new AbortController();\n// pass c.signal to each fetch, then c.abort()', output: 'requests cancelled' },
    },
    {
      name: 'Awaiting inside a loop is not concurrent',
      desc: 'The commonest performance mistake in async JavaScript. A for loop with an await inside runs one request at a time; Promise.all over a mapped array runs them together. The difference is n × latency versus one latency.',
      wrong: { label: 'Sequential', code: 'for (const u of urls) results.push(await fetch(u));', output: 'sum of all latencies' },
      fix:   { label: 'Concurrent', code: 'const results = await Promise.all(urls.map(u => fetch(u)));', output: 'the slowest latency' },
    },
    {
      name: 'Creating the promises inside the array is what starts them',
      desc: 'Promise.all does not start anything — it only waits. Passing an array of FUNCTIONS waits for nothing useful, because a function is not a promise and is passed straight through as a value.',
      wrong: { label: 'Functions, not promises', code: 'await Promise.all([() => fetchA(), () => fetchB()])', output: 'an array of the two functions' },
      fix:   { label: 'Call them',               code: 'await Promise.all([fetchA(), fetchB()])', output: 'the two results' },
    },
  ],

  when: {
    use: [
      'Several independent async operations that must all succeed',
      'Fetching data for one view from multiple endpoints',
      'Anywhere a loop currently awaits one item at a time',
    ],
    avoid: [
      'Partial success is acceptable → allSettled',
      'You want the first result only → race, or any',
      'The operations depend on each other → sequential awaits are correct',
      'You need to cancel on failure → AbortController alongside',
    ],
  },

  notes: {
    complexity: 'O(n) to attach handlers; wall-clock time is the slowest input',
    return:     'A new Promise; the inputs are not modified',
    cpython:    'V8: Builtins-promise-all',
    memory:     'Holds every result until all settle',
    threadSafe: 'Single-threaded; concurrency here is I/O overlap, not parallelism',
  },

  related: [
    { name: 'Promise.allSettled', slug: 'promise-allsettled', when: 'You need every outcome, failures included' },
    { name: 'Promise.race',       slug: 'promise-race',       when: 'The first to settle, win or lose' },
    { name: 'Promise.any',        slug: 'promise-any',        when: 'The first to SUCCEED' },
    { name: 'Promise.prototype.catch', slug: 'promise-catch', when: 'Handling the rejection this produces' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because a Promise result only exists after the microtask queue drains, and this site demo harness is synchronous — it renders whatever the emulator returns immediately, which for a Promise is an empty object. Faking a resolved value would misrepresent the method. Every example above was run and awaited in a real runtime instead.',
    },
    {
      q: 'Does Promise.all run things in parallel?',
      a: 'It runs them CONCURRENTLY, which for I/O is what matters — the requests overlap. JavaScript is single-threaded, so nothing is parallel in the CPU sense. The promises must also already be in flight; Promise.all only waits.',
    },
    {
      q: 'How do I keep the results that succeeded?',
      a: 'Use allSettled, which resolves with a status for every input and never rejects. Filter for fulfilled entries afterwards.',
      code: 'const rs = await Promise.allSettled(tasks);\nconst ok = rs.filter(r => r.status === "fulfilled").map(r => r.value);',
    },
    {
      q: 'Are the results in completion order?',
      a: 'No — input order, always. That is what makes destructuring safe. If you want them as they arrive, handle each promise individually rather than collecting them.',
      code: 'const [a, b] = await Promise.all([slow, fast]);   // a is from slow',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise.all and Promise.race added with the Promise constructor.' },
    { version: 'ES2020', note: 'allSettled and any added, covering the cases all cannot express.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
    meta:  'Promise.all',
  },

  tryInTool: [],
};
