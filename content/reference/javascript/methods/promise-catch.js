// content/reference/javascript/methods/promise-catch.js
//
// Live async demo (demoAsync): the page shows `await <expr>` and renders
// the settled value. Every case is checked by audit-emulators-js.mjs.

export const meta = {
  slug:        'promise-catch',
  name:        'Promise.prototype.catch',
  signature:   'promise.catch(onRejected)',
  blurb:       'Handling a rejection RESOLVES the chain — recovery, not just reporting.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Promise catch onRejected error handling rethrow recover unhandled rejection then second argument javascript',
};

export const method = {
  slug:      'promise-catch',
  name:      'Promise.prototype.catch',
  signature: 'promise.catch(onRejected)',
  returns:   { type: 'Promise', desc: 'A new Promise. If the handler returns normally the new promise is FULFILLED with that value — the chain recovers. Rethrow to keep it rejected.' },

  category:    'Promise method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Exactly then(undefined, onRejected), with one consequence people miss: a handler that merely logs turns a failure into a success, and the rest of the chain carries on with undefined.',

  cheat: {
    commonCall: 'p.catch(e => { log(e); throw e; })',
    returns:    'a new promise — FULFILLED if the handler returns',
    replaces:   'the second argument to then',
    watchOut:   'returning from the handler swallows the error',
  },

  parameters: [
    { name: 'onRejected', type: 'Function', required: true, default: null, desc: 'Called with the rejection reason. Returning a value fulfils the chain; throwing, or returning a rejected promise, keeps it rejected.' },
  ],

  demoAsync: true,
  demoParams: [
    { name: 'msg',     type: 'string', hint: 'error message',               input: 'text' },
    { name: 'rethrow', type: 'number', hint: '0 = return, 1 = rethrow',       input: 'number' },
  ],
  demoTemplate: "Promise.reject(new Error({msg})).catch(e => { if ({rethrow}) throw e; return 'recovered: ' + e.message; })",
  cases: [
    { id: 'recover', label: 'handler returns → RECOVERS (!)', values: { msg: 'boom', rethrow: 0 } },
    { id: 'rethrow', label: 'handler rethrows → still rejected', values: { msg: 'boom', rethrow: 1 } },
  ],
  demoExplainer: "The first case is the behaviour behind most swallowed errors: because the handler returns, the chain is FULFILLED with that value, and everything downstream carries on as though nothing failed. A handler that only logs does exactly the same, returning undefined. The second case rethrows, so the promise stays rejected and the error keeps propagating — which is what a logging handler almost always should do.",

  patterns: [
    {
      name: 'Log and rethrow',
      desc: 'Report without swallowing.',
      code: 'p.catch(e => { report(e); throw e; });',
    },
    {
      name: 'Recover with a fallback',
      desc: 'Deliberate recovery — returning IS the point here.',
      code: 'const data = await fetchFresh().catch(() => cached);',
    },
    {
      name: 'Catch at the end of the chain',
      desc: 'One handler covers every preceding link.',
      code: 'fetch(u).then(r => r.json()).then(use).catch(handle);',
    },
  ],

  examples: [
    { title: 'Handling resolves the chain', code: 'await Promise.reject(new Error("x")).catch(() => "recovered")', returns: "'recovered'" },
    { title: 'Rethrowing keeps it rejected',code: 'Promise.reject(new Error("x")).catch(e => { throw e; })', returns: 'still rejected' },
    { title: 'It catches earlier then errors', code: 'await Promise.resolve(1).then(() => { throw new Error("in then"); }).catch(e => e.message)', returns: "'in then'" },
    { title: 'A bare log returns undefined', code: 'await Promise.reject(new Error("x")).catch(e => { console.log(e); })', returns: 'undefined — and FULFILLED' },
    { title: 'It is then with one argument', code: 'Promise.prototype.catch.length', returns: '1' },
    { title: 'Nothing to catch is a no-op', code: 'await Promise.resolve(1).catch(() => "never")', returns: '1' },
  ],

  pitfalls: [
    {
      name: 'A logging handler swallows the error',
      desc: 'The single most common promise mistake. catch(e => console.error(e)) returns undefined, which FULFILS the chain — so downstream code runs as though everything worked and receives undefined. The failure is reported and then ignored.',
      wrong: { label: 'Chain recovers', code: 'await p.catch(e => console.error(e))', output: 'undefined, and fulfilled' },
      fix:   { label: 'Rethrow',        code: 'await p.catch(e => { console.error(e); throw e; })', output: 'still rejects' },
    },
    {
      name: 'Position in the chain decides what it covers',
      desc: 'A catch only sees rejections from links BEFORE it. Placing it in the middle lets later errors escape entirely, which is how an unhandled rejection appears in code that visibly contains a catch.',
      wrong: { label: 'Later errors escape', code: 'p.catch(handle).then(() => { throw new Error("late"); })', output: 'unhandled rejection' },
      fix:   { label: 'Catch last',          code: 'p.then(() => { throw new Error("late"); }).catch(handle)', output: 'handled' },
    },
    {
      name: 'It catches everything, including programming errors',
      desc: 'A TypeError from a typo inside a then callback arrives here exactly like a network failure. A broad handler that reports "request failed" mislabels genuine bugs and makes them much harder to find. Narrow the handling by inspecting the error.',
      wrong: { label: 'Mislabels bugs', code: 'p.catch(() => show("Network error"))', output: 'shown for a TypeError too' },
      fix:   { label: 'Discriminate',   code: 'p.catch(e => {\n  if (e instanceof TypeError) throw e;\n  show("Network error");\n})', output: 'bugs still surface' },
    },
    {
      name: 'It does not help an unawaited promise',
      desc: 'Attaching a catch prevents the unhandled-rejection warning, but if nothing awaits the chain the surrounding function returns before any of it runs. The error is handled and the caller has already moved on.',
      wrong: { label: 'Not awaited', code: 'function save() { doSave().catch(log); }', output: 'returns before saving' },
      fix:   { label: 'Return or await', code: 'async function save() { await doSave().catch(log); }', output: 'the caller can wait' },
    },
  ],

  when: {
    use: [
      'Recovering with a fallback value, deliberately',
      'Logging and rethrowing at a boundary',
      'A final handler at the end of a chain',
      'Converting a rejection into a result your caller expects',
    ],
    avoid: [
      'try/catch reads better in async functions → use that',
      'You only want cleanup → finally',
      'The handler only logs → rethrow, or you have silently recovered',
      'Mid-chain placement → later links escape it',
    ],
  },

  notes: {
    complexity: 'O(1) to attach; the handler runs as a microtask',
    return:     'A new Promise, fulfilled if the handler returns normally',
    cpython:    'V8: Builtins-promise-catch',
    memory:     'Allocates a new promise',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Promise.prototype.then',    slug: 'promise-then',    when: 'catch is then with only a rejection handler' },
    { name: 'Promise.prototype.finally', slug: 'promise-finally', when: 'Cleanup that does not change the outcome' },
    { name: 'Promise.reject',            slug: 'promise-reject',  when: 'Producing the rejection being caught' },
    { name: 'Promise.allSettled',        slug: 'promise-allsettled', when: 'Handling many rejections as data instead' },
  ],

  faq: [
    {
      q: 'Why did my code continue after an error?',
      a: 'Because the catch handler returned. Returning from a rejection handler is how you RECOVER — it fulfils the chain with that return value. A handler that only logs returns undefined, so the chain succeeds with undefined. Rethrow if you meant to propagate.',
      code: 'p.catch(e => { log(e); throw e; });',
    },
    {
      q: 'catch or try/catch?',
      a: 'Inside an async function, try/catch — it reads like synchronous code and scopes clearly. The method form is for chains, and for attaching a handler where you cannot use await.',
    },
    {
      q: 'Is catch the same as then with two arguments?',
      a: 'catch(fn) is exactly then(undefined, fn). The practical difference is placement: a separate catch after a then also handles errors thrown by that then callback, which the two-argument form cannot.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'catch added with the Promise constructor as sugar over then.' },
    { version: 'ES2017', note: 'async/await made try/catch the idiomatic form for most error handling.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch',
    meta:  'Promise.prototype.catch',
  },

  tryInTool: [],
};
