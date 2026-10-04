// content/reference/javascript/methods/promise-resolve.js
//
// Doc-only. Every synchronously-observable fact about Promise.resolve is a
// CONSTANT — Promise.resolve(p) === p is always true, instanceof is always
// true — so a "live demo" would be a fixed value dressed as a computation.

export const meta = {
  slug:        'promise-resolve',
  name:        'Promise.resolve',
  signature:   'Promise.resolve(value)',
  blurb:       'Wraps a value — but hands an existing promise straight back, unchanged.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: false,
  version:     'ES2015',
  searchTerms: 'Promise.resolve wrap value thenable pass through identity already a promise async return es2015 javascript',
};

export const method = {
  slug:      'promise-resolve',
  name:      'Promise.resolve',
  signature: 'Promise.resolve(value)',
  returns:   { type: 'Promise', desc: 'A Promise fulfilled with the value. If the value is ALREADY a promise, that same promise is returned — not a wrapper around it.' },

  category:    'Promise static method',
  version:     'ES2015',
  hasLiveDemo: false,

  subtitle: 'The bridge from a plain value into promise-land. Its pass-through behaviour makes it safe to call on something that may or may not be a promise, which is exactly why it exists.',

  cheat: {
    commonCall: 'Promise.resolve(maybePromise)',
    returns:    'a promise — the SAME one if it already was',
    replaces:   'new Promise(r => r(value))',
    watchOut:   'a thenable is adopted, so a stray then property matters',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: 'undefined', desc: 'Any value. A promise is returned as-is. A thenable — any object with a then method — is ADOPTED, so its then is called to determine the outcome.' },
  ],

  patterns: [
    {
      name: 'Normalise a maybe-promise',
      desc: 'Safe whether or not the value is already one.',
      code: 'const p = Promise.resolve(maybeAsync());',
    },
    {
      name: 'Start a chain from a value',
      desc: 'Gives you somewhere to hang then handlers.',
      code: 'Promise.resolve(seed).then(step1).then(step2);',
    },
    {
      name: 'An async function does it implicitly',
      desc: 'Returning a value from async wraps it.',
      code: 'async function f() { return 1; }   // Promise<1>',
    },
  ],

  examples: [
    { title: 'A promise passes through', code: 'const p = Promise.resolve(1);\nPromise.resolve(p) === p', returns: 'true' },
    { title: 'A value is wrapped',       code: 'Promise.resolve(1) instanceof Promise', returns: 'true' },
    { title: 'Each call is a new promise', code: 'Promise.resolve(1) === Promise.resolve(1)', returns: 'false' },
    { title: 'A thenable is adopted',    code: 'await Promise.resolve({then: r => r("from thenable")})', returns: "'from thenable'" },
    { title: 'A non-callable then is not',code: 'await Promise.resolve({then: 1, data: "x"})', returns: '{then: 1, data: "x"}' },
    { title: 'Undefined is fine',        code: 'await Promise.resolve()', returns: 'undefined' },
    { title: 'Still asynchronous',       code: 'let x;\nPromise.resolve(1).then(v => { x = v; });\nx', returns: 'undefined at this point' },
  ],

  pitfalls: [
    {
      name: 'It is still asynchronous',
      desc: 'An already-resolved promise does not run its callbacks synchronously — they are queued as microtasks. Code that resolves a value and reads the result on the next line gets undefined, which makes the promise look broken.',
      wrong: { label: 'Too early', code: 'let x;\nPromise.resolve(1).then(v => { x = v; });\nreturn x;', output: 'undefined' },
      fix:   { label: 'Await it',  code: 'const x = await Promise.resolve(1);\nreturn x;', output: '1' },
    },
    {
      name: 'An object with a CALLABLE then is adopted',
      desc: 'Thenable adoption is how promises from different libraries interoperate — and it means any object carrying a then METHOD is treated as a promise rather than as data. A non-callable then property is harmless, so parsed JSON with a numeric "then" field comes back untouched; the hazard is a data object that happens to have a then function on it.',
      wrong: { label: 'Adopted, not returned', code: 'await Promise.resolve({then: r => r("adopted"), id: 1})', output: "'adopted' — the object is gone" },
      fix:   { label: 'Wrap it to keep it',    code: 'await Promise.resolve({value: {then: r => r("x"), id: 1}})', output: 'the wrapper, object intact' },
    },
    {
      name: 'It does not deep-resolve the contents',
      desc: 'Resolving an array of promises gives you a promise for an array OF PROMISES. Only Promise.all waits for the elements. This trips people converting from libraries that auto-resolve nested structures.',
      wrong: { label: 'Promises inside', code: 'await Promise.resolve([Promise.resolve(1)])', output: '[Promise]' },
      fix:   { label: 'Use all',         code: 'await Promise.all([Promise.resolve(1)])', output: '[1]' },
    },
    {
      name: 'new Promise(r => r(v)) is the long way round',
      desc: 'The constructor is for wrapping callback-based APIs. Using it to produce an already-resolved promise is noise, and the executor form invites the classic mistake of resolving inside a then instead of returning.',
      wrong: { label: 'Verbose', code: 'new Promise(r => r(1))', output: 'works' },
      fix:   { label: 'Direct',  code: 'Promise.resolve(1)', output: 'same thing' },
    },
  ],

  when: {
    use: [
      'Normalising a value that may or may not be a promise',
      'Starting a chain from a plain value',
      'Returning an already-known result from a promise-returning function',
      'Writing a test double for an async dependency',
    ],
    avoid: [
      'Wrapping a callback API → the Promise constructor',
      'You need external resolve and reject → Promise.withResolvers',
      'The value contains promises you want resolved → Promise.all',
      'Inside an async function → just return the value',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A Promise — the same object when the input already was one',
    cpython:    'V8: Builtins-promise-resolve',
    memory:     'No allocation when the input is already a native promise',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Promise.reject',            slug: 'promise-reject',        when: 'The rejecting counterpart' },
    { name: 'Promise.withResolvers',     slug: 'promise-withresolvers', when: 'You need to settle it from outside' },
    { name: 'Promise.prototype.then',    slug: 'promise-then',          when: 'Attaching handlers to the result' },
    { name: 'Promise.all',               slug: 'promise-all',           when: 'Resolving promises nested in a structure' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because everything about Promise.resolve that can be observed WITHOUT waiting is a constant — instanceof is always true, and the pass-through identity is always true. A demo would be a fixed answer pretending to be a computation. The examples above were run in a real runtime, including the ones that need awaiting.',
    },
    {
      q: 'What happens if I pass a promise?',
      a: 'You get the very same promise back — not a wrapper. That is what makes it safe to call on a value of unknown type, and it means Promise.resolve is effectively free in that case.',
      code: 'const p = fetchData();\nPromise.resolve(p) === p;   // true',
    },
    {
      q: 'Promise.resolve or the constructor?',
      a: 'Promise.resolve for a value you already have. The constructor only when you need to bridge a callback-based API, where you call resolve from inside the callback.',
      code: 'new Promise((res, rej) => fs.readFile(p, (e, d) => e ? rej(e) : res(d)));',
    },
    {
      q: 'What is a thenable?',
      a: 'Any object with a callable then property. The promise machinery treats one as a promise and calls its then to find out the result — which is how promises from different libraries interoperate, and why a data object with a then field causes trouble.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise.resolve added with the constructor; thenable adoption inherited from Promises/A+.' },
    { version: 'ES2017', note: 'async functions made implicit wrapping the common case.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve',
    meta:  'Promise.resolve',
  },

};
