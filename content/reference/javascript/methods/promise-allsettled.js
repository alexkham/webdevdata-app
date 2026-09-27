// content/reference/javascript/methods/promise-allsettled.js
//
// Live async demo (demoAsync): the page shows `await <expr>` and renders
// the settled value. Every case is checked by audit-emulators-js.mjs.

export const meta = {
  slug:        'promise-allsettled',
  name:        'Promise.allSettled',
  signature:   'Promise.allSettled(iterable)',
  blurb:       'Every outcome, never a rejection — you get status objects instead of values.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: true,
  version:     'ES2020',
  searchTerms: 'Promise.allSettled status fulfilled rejected reason value partial success never rejects es2020 javascript',
};

export const method = {
  slug:      'promise-allsettled',
  name:      'Promise.allSettled',
  signature: 'Promise.allSettled(iterable)',
  returns:   { type: 'Promise<Array>', desc: 'A Promise for an array of objects — {status: "fulfilled", value} or {status: "rejected", reason} — in input order. It never rejects.' },

  category:    'Promise static method',
  version:     'ES2020',
  hasLiveDemo: true,

  subtitle: 'The method for when partial success is a real outcome. Because it never rejects, the try/catch around it is dead code — the failures arrive as data instead.',

  cheat: {
    commonCall: 'const rs = await Promise.allSettled(tasks)',
    returns:    'status objects, one per input',
    replaces:   'Promise.all wrapped in per-task catch handlers',
    watchOut:   'values are nested under .value — not the value itself',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable of promises or plain values. Non-promises are reported as fulfilled.' },
  ],

  demoAsync: true,
  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON list of [outcome, value, ms]', input: 'text' },
  ],
  demoTemplate: "Promise.allSettled(JSON.parse({json}).map(([k, v, ms]) => new Promise((res, rej) => setTimeout(() => k === 'ok' ? res(v) : rej(new Error(v)), ms))))",
  cases: [
    { id: 'mixed',  label: 'mixed outcomes',          values: { json: '[["ok",1,10],["err","boom",20]]' } },
    { id: 'allbad', label: 'all fail — still RESOLVES', values: { json: '[["err","a",10],["err","b",20]]' } },
    { id: 'empty',  label: 'empty list',              values: { json: '[]' } },
  ],
  demoExplainer: "Each input is [outcome, value, delay in ms]: 'ok' fulfils with the value, anything else rejects with an Error carrying it. Every input produces a status object, in input order, and the combined promise never rejects — even the second case, where everything failed, resolves normally with two 'rejected' entries. That is why a try/catch around allSettled is dead code: failures arrive as data. Note the values are nested under value and reason, not returned bare as Promise.all would.",

  patterns: [
    {
      name: 'Keep what succeeded',
      desc: 'Filter on status, then unwrap.',
      code: 'const rs = await Promise.allSettled(tasks);\nconst ok = rs.filter(r => r.status === "fulfilled").map(r => r.value);',
    },
    {
      name: 'Report what failed',
      desc: 'The reasons are all available at once.',
      code: 'const errors = rs.filter(r => r.status === "rejected").map(r => r.reason);',
    },
    {
      name: 'Fail fast instead',
      desc: 'Promise.all when any failure should abort.',
      code: 'const all = await Promise.all(tasks);',
    },
  ],

  examples: [
    { title: 'Mixed outcomes',    code: 'await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("boom"))])', returns: '[{status: "fulfilled", value: 1}, {status: "rejected", reason: Error}]' },
    { title: 'It never rejects',  code: 'await Promise.allSettled([Promise.reject(1)]).then(() => "resolved")', returns: "'resolved'" },
    { title: 'Empty array',       code: 'await Promise.allSettled([])', returns: '[]' },
    { title: 'Order is input order', code: 'await Promise.allSettled([slow, fast])', returns: 'slow first, regardless of timing' },
    { title: 'Unwrapping',        code: 'rs.filter(r => r.status === "fulfilled").map(r => r.value)', returns: 'the successful values' },
    { title: 'Promise.all differs',code: 'await Promise.all([Promise.reject(new Error("boom"))])', returns: 'throws Error: boom' },
  ],

  pitfalls: [
    {
      name: 'The values are wrapped',
      desc: 'Every entry is a status object, so the array you get back is not the array of results you would get from Promise.all. Code migrated from all without unwrapping ends up treating {status, value} objects as if they were the data.',
      wrong: { label: 'Status objects', code: 'const [a] = await Promise.allSettled([Promise.resolve(1)]);\na', output: '{status: "fulfilled", value: 1}' },
      fix:   { label: 'Unwrap',         code: 'const [a] = await Promise.allSettled([Promise.resolve(1)]);\na.value', output: '1' },
    },
    {
      name: 'try/catch around it is dead code',
      desc: 'It never rejects, so the catch block can never run. That is easy to miss when converting from Promise.all — the error handling looks intact and silently stops working, and failures pass through as data nobody inspects.',
      wrong: { label: 'Never runs', code: 'try { await Promise.allSettled(t); } catch { /* unreachable */ }', output: 'failures ignored' },
      fix:   { label: 'Check the statuses', code: 'const bad = rs.filter(r => r.status === "rejected");\nif (bad.length) report(bad);', output: 'failures handled' },
    },
    {
      name: 'It still does not cancel anything',
      desc: 'Like Promise.all, it waits for every input to settle — so the slowest failure sets the total time. If one task can hang, allSettled hangs with it; add a timeout per task or race each against one.',
      wrong: { label: 'Waits for the hang', code: 'await Promise.allSettled([hangsForever, quick])', output: 'never settles' },
      fix:   { label: 'Time each one out',  code: 'tasks.map(t => Promise.race([t, timeout(5000)]))', output: 'bounded' },
    },
    {
      name: 'ES2020 — check your runtime',
      desc: 'Node 12.9+ and 2019-era browsers. The pre-2020 equivalent is mapping each promise to one that cannot reject, which is worth recognising in older code.',
      wrong: { label: 'Missing', code: 'Promise.allSettled(tasks)', output: 'TypeError: Promise.allSettled is not a function' },
      fix:   { label: 'Polyfill shape', code: 'Promise.all(tasks.map(p =>\n  p.then(value => ({status: "fulfilled", value}),\n         reason => ({status: "rejected", reason}))))', output: 'equivalent' },
    },
  ],

  when: {
    use: [
      'Several independent tasks where partial success is useful',
      'Dashboards and batch jobs — report what failed, render what worked',
      'Cleanup and teardown, where every step should be attempted',
      'Collecting all validation errors rather than the first',
    ],
    avoid: [
      'Any failure should abort → Promise.all',
      'You want the first success → Promise.any',
      'You want the first result at all → Promise.race',
      'A task may hang → bound each one with a timeout',
    ],
  },

  notes: {
    complexity: 'O(n); wall-clock time is the SLOWEST input, success or failure',
    return:     'A new Promise that always fulfils',
    cpython:    'V8: Builtins-promise-allsettled',
    memory:     'Holds a status object per input until all settle',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Promise.all',   slug: 'promise-all',   when: 'Fail fast, and get bare values' },
    { name: 'Promise.any',   slug: 'promise-any',   when: 'Only the first success matters' },
    { name: 'Promise.race',  slug: 'promise-race',  when: 'Timeouts, and first-to-settle' },
    { name: 'Promise.prototype.catch', slug: 'promise-catch', when: 'Handling rejections individually instead' },
  ],

  faq: [
    {
      q: 'allSettled or all?',
      a: 'all when every task must succeed for the outcome to mean anything — a transaction, a multi-step save. allSettled when the tasks are independent and knowing which ones failed is more useful than aborting.',
    },
    {
      q: 'How do I get just the successful values?',
      a: 'Filter on status and map to value. It is verbose enough that wrapping it in a small helper is usually worth it.',
      code: 'const ok = rs.flatMap(r => r.status === "fulfilled" ? [r.value] : []);',
    },
    {
      q: 'Does it tell me WHICH input failed?',
      a: 'By position — the array is in input order, so index n corresponds to input n. There is no key or label, so if you need names, zip the results against your input list afterwards.',
      code: 'tasks.map((t, i) => ({name: names[i], ...rs[i]}));',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise.all and race shipped; partial success had no built-in expression.' },
    { version: 'ES2020', note: 'allSettled added alongside Promise.any.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled',
    meta:  'Promise.allSettled',
  },

  tryInTool: [],
};
