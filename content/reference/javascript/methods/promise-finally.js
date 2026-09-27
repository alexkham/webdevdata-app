// content/reference/javascript/methods/promise-finally.js
//
// Doc-only — see the FAQ. Examples run and awaited in a real runtime.

export const meta = {
  slug:        'promise-finally',
  name:        'Promise.prototype.finally',
  signature:   'promise.finally(onFinally)',
  blurb:       'Cleanup that passes the result STRAIGHT THROUGH — its return value is ignored.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: false,
  version:     'ES2018',
  searchTerms: 'Promise finally cleanup pass through ignored return value loading spinner throw replaces es2018 javascript',
};

export const method = {
  slug:      'promise-finally',
  name:      'Promise.prototype.finally',
  signature: 'promise.finally(onFinally)',
  returns:   { type: 'Promise', desc: 'A new Promise settling with the ORIGINAL outcome — value or rejection. What the callback returns is discarded; only a throw from it can change the result.' },

  category:    'Promise method',
  version:     'ES2018',
  hasLiveDemo: false,

  subtitle: 'For work that must happen either way and should not affect the answer. Its callback receives no arguments, precisely because it is not supposed to care whether things went well.',

  cheat: {
    commonCall: 'p.finally(() => setLoading(false))',
    returns:    'the original outcome, unchanged',
    replaces:   'duplicating cleanup in both then and catch',
    watchOut:   'it does NOT handle the rejection — only observes it',
  },

  parameters: [
    { name: 'onFinally', type: 'Function', required: true, default: null, desc: 'Called with NO arguments when the promise settles, either way. Its return value is ignored — unless it returns a promise, which is awaited before the chain continues.' },
  ],

  patterns: [
    {
      name: 'Turn off a loading flag',
      desc: 'The canonical use.',
      code: 'setLoading(true);\nfetchData().finally(() => setLoading(false));',
    },
    {
      name: 'Release a resource',
      desc: 'Runs on success and failure alike.',
      code: 'await useConnection().finally(() => conn.release());',
    },
    {
      name: 'Still handle the error',
      desc: 'finally does not catch.',
      code: 'p.finally(cleanup).catch(handle);',
    },
  ],

  examples: [
    { title: 'The value passes through',  code: 'await Promise.resolve(42).finally(() => "ignored")', returns: '42' },
    { title: 'Even an explicit return',   code: 'await Promise.resolve(42).finally(() => 99)', returns: '42' },
    { title: 'A throw DOES replace it',   code: 'await Promise.resolve(42).finally(() => { throw new Error("from finally"); }).catch(e => e.message)', returns: "'from finally'" },
    { title: 'Rejections pass through too',code: 'Promise.reject(new Error("x")).finally(() => {})', returns: 'still rejected with x' },
    { title: 'The callback gets no arguments', code: 'Promise.resolve(1).finally(v => v)', returns: 'v is undefined' },
    { title: 'It is not a handler',       code: 'Promise.reject(new Error("x")).finally(() => {})', returns: 'unhandled rejection unless caught' },
  ],

  pitfalls: [
    {
      name: 'It does not handle the rejection',
      desc: 'A finally on a rejecting promise still leaves that rejection unhandled — the cleanup runs and the error carries on. Code that ends a chain with finally and no catch produces an unhandled rejection while looking like it has error handling.',
      wrong: { label: 'Still unhandled', code: 'Promise.reject(new Error("x")).finally(cleanup)', output: 'unhandled rejection' },
      fix:   { label: 'Add a catch',     code: 'Promise.reject(new Error("x")).finally(cleanup).catch(handle)', output: 'handled' },
    },
    {
      name: 'Its return value is discarded',
      desc: 'Deliberate — cleanup should not alter the answer. But it means a finally that computes something useful has computed it for nothing, and a return that looks like it sets the result silently does not.',
      wrong: { label: 'Ignored', code: 'await Promise.resolve(1).finally(() => 99)', output: '1' },
      fix:   { label: 'Use then', code: 'await Promise.resolve(1).then(() => 99)', output: '99' },
    },
    {
      name: 'A throw inside it replaces the outcome',
      desc: 'The one way finally changes the result. Cleanup that can fail — releasing a connection that is already closed — will mask the original error with its own, losing the reason the operation failed in the first place.',
      wrong: { label: 'Masks the original', code: 'Promise.reject(new Error("real")).finally(() => { throw new Error("cleanup"); })', output: 'rejects with cleanup' },
      fix:   { label: 'Guard the cleanup',  code: 'p.finally(() => { try { release(); } catch {} })', output: 'original error preserved' },
    },
    {
      name: 'Returning a promise delays the chain',
      desc: 'A promise returned from the callback IS awaited, even though its value is ignored. Slow cleanup therefore delays the result, which is occasionally what you want and often an unexplained latency.',
      wrong: { label: 'Adds the delay', code: 'await p.finally(() => slowFlush())', output: 'waits for slowFlush' },
      fix:   { label: 'Fire and forget', code: 'await p.finally(() => { void slowFlush(); })', output: 'returns immediately' },
    },
  ],

  when: {
    use: [
      'Turning off a loading indicator',
      'Releasing connections, locks and file handles',
      'Logging that an operation completed, either way',
      'Anything currently duplicated in both then and catch',
    ],
    avoid: [
      'You need to change the result → then or catch',
      'You need to handle the error → catch, in addition',
      'The cleanup can itself fail → wrap it, or it masks the real error',
      'Inside an async function → a try/finally block reads better',
    ],
  },

  notes: {
    complexity: 'O(1) to attach; the callback runs as a microtask',
    return:     'A new Promise mirroring the original settlement',
    cpython:    'V8: Builtins-promise-finally',
    memory:     'Allocates a new promise',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Promise.prototype.catch', slug: 'promise-catch', when: 'Actually handling the rejection' },
    { name: 'Promise.prototype.then',  slug: 'promise-then',  when: 'Changing the value rather than passing it through' },
    { name: 'Promise.allSettled',      slug: 'promise-allsettled', when: 'Outcome-agnostic handling of many promises' },
    { name: 'Promise.race',            slug: 'promise-race',  when: 'Timeouts, whose cleanup belongs in a finally' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because the callback runs when the promise settles, on the microtask queue, and this site demo harness renders synchronously. The examples above were run and awaited in a real runtime.',
    },
    {
      q: 'Does finally catch the error?',
      a: 'No. It observes the settlement and passes it on unchanged, so a rejection remains a rejection. You still need a catch — finally is about cleanup, not handling.',
      code: 'p.finally(cleanup).catch(handle);',
    },
    {
      q: 'Why is my return value ignored?',
      a: 'By design — cleanup should not be able to alter the result, so the specification discards whatever the callback returns. If you want to change the value, use then; if you want to change a rejection, use catch.',
    },
    {
      q: 'finally or try/finally?',
      a: 'Inside an async function, the statement form — it reads clearly and scopes properly. The method form is for chains, and for attaching cleanup to a promise you are handing on to someone else.',
      code: 'try { return await work(); } finally { cleanup(); }',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise shipped without finally; cleanup meant duplicating it in then and catch.' },
    { version: 'ES2018', note: 'finally added, with pass-through semantics deliberately mirroring try/finally.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally',
    meta:  'Promise.prototype.finally',
  },

  tryInTool: [],
};
