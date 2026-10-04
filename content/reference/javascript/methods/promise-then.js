// content/reference/javascript/methods/promise-then.js
//
// Live async demo (demoAsync): the page shows `await <expr>` and renders
// the settled value. Every case is checked by audit-emulators-js.mjs.

export const meta = {
  slug:        'promise-then',
  name:        'Promise.prototype.then',
  signature:   'promise.then(onFulfilled[, onRejected])',
  blurb:       'Returns a NEW promise — and its second argument cannot catch its first.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Promise then onFulfilled onRejected chain flatten new promise await catch second argument javascript',
};

export const method = {
  slug:      'promise-then',
  name:      'Promise.prototype.then',
  signature: 'promise.then(onFulfilled[, onRejected])',
  returns:   { type: 'Promise', desc: 'A NEW Promise resolving to whatever the callback returned. If the callback returns a promise, it is flattened rather than nested.' },

  category:    'Promise method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The primitive everything else is built on, including await. Two facts carry most of its behaviour: it always returns a new promise, and returning a promise from the callback flattens instead of nesting.',

  cheat: {
    commonCall: 'p.then(v => transform(v))',
    returns:    'a NEW promise — chainable',
    replaces:   'callback-style continuation',
    watchOut:   'the second argument does NOT catch errors from the first',
  },

  parameters: [
    { name: 'onFulfilled', type: 'Function', required: false, default: 'identity', desc: 'Called with the resolved value. Its return value resolves the new promise; a promise returned here is flattened. Omitted, the value passes through.' },
    { name: 'onRejected',  type: 'Function', required: false, default: 'rethrow',  desc: 'Called if the ORIGINAL promise rejected. It does NOT see errors thrown by onFulfilled — that is the difference from a following catch.' },
  ],

  demoAsync: true,
  demoParams: [
    { name: 'n', type: 'number', hint: 'a number (negative throws)', input: 'number' },
  ],
  demoTemplate: "Promise.resolve({n}).then(v => { if (v < 0) throw new Error('negative'); return v * 2; })",
  cases: [
    { id: 'double', label: 'the callback transforms', values: { n: 5 } },
    { id: 'zero',   label: 'zero',                    values: { n: 0 } },
    { id: 'throw',  label: 'a throw REJECTS (!)',     values: { n: -1 } },
  ],
  demoExplainer: "then returns a new promise resolved with whatever the callback returns, so 5 becomes 10. The third case is the part people underestimate: a throw inside the callback does not escape as an exception — it becomes a rejection of the promise then returned, which only a catch AFTER this then will see. A second argument to the same then would not.",

  patterns: [
    {
      name: 'Prefer await',
      desc: 'Same semantics, far easier to read.',
      code: 'const v = await p;\nconst t = transform(v);',
    },
    {
      name: 'Chain transformations',
      desc: 'Each then produces a new promise.',
      code: 'fetch(u).then(r => r.json()).then(d => d.items);',
    },
    {
      name: 'Catch after, not beside',
      desc: 'A following catch sees errors from the callback too.',
      code: 'p.then(transform).catch(handle);',
    },
  ],

  examples: [
    { title: 'It returns a new promise', code: 'const p = Promise.resolve(1);\np.then(() => {}) === p', returns: 'false' },
    { title: 'Returned promises flatten',code: 'await Promise.resolve(1).then(() => Promise.resolve(2))', returns: '2' },
    { title: 'A following catch catches', code: 'await Promise.resolve(1).then(() => { throw new Error("in then"); }).catch(e => e.message)', returns: "'in then'" },
    { title: 'The second argument does NOT', code: 'Promise.resolve(1).then(() => { throw new Error("in then"); }, () => "never")', returns: 'the returned promise REJECTS' },
    { title: 'onRejected sees the original', code: 'await Promise.reject(new Error("x")).then(() => "a", e => "handled: " + e.message)', returns: "'handled: x'" },
    { title: 'Omitting onFulfilled passes through', code: 'await Promise.resolve(1).then()', returns: '1' },
  ],

  pitfalls: [
    {
      name: 'The second argument cannot catch the first',
      desc: 'onRejected only fires for a rejection of the ORIGINAL promise. An error thrown inside onFulfilled bypasses it entirely and rejects the returned promise, so then(fn, handler) is not equivalent to then(fn).catch(handler) — the second form is almost always what you want.',
      wrong: { label: 'Not caught', code: 'p.then(() => { throw new Error("x"); }, e => "handled")', output: 'the result promise rejects' },
      fix:   { label: 'catch after', code: 'p.then(() => { throw new Error("x"); }).catch(e => "handled")', output: "'handled'" },
    },
    {
      name: 'Forgetting to return from the callback',
      desc: 'A braced callback with no return resolves the new promise with undefined, so the next link in the chain receives nothing. Arrow functions with a body make this easy to do while looking correct.',
      wrong: { label: 'Resolves undefined', code: 'p.then(v => { transform(v); }).then(t => t)', output: 'undefined' },
      fix:   { label: 'Return it',          code: 'p.then(v => { return transform(v); }).then(t => t)', output: 'the transformed value' },
    },
    {
      name: 'Not returning the inner promise breaks the chain',
      desc: 'Starting async work inside a then without returning its promise detaches it — the chain continues immediately and the work becomes a floating promise whose rejection is unhandled. The same mistake as forgetting await.',
      wrong: { label: 'Detached', code: 'p.then(() => { save(); }).then(() => "done")', output: '"done" before save finishes' },
      fix:   { label: 'Return it', code: 'p.then(() => save()).then(() => "done")', output: 'after save finishes' },
    },
    {
      name: 'Callbacks never run synchronously',
      desc: 'Even on an already-resolved promise, the callback is queued as a microtask. Code written to read a variable immediately after attaching a then sees the value before the callback ran.',
      wrong: { label: 'Reads too early', code: 'let x;\nPromise.resolve(1).then(v => { x = v; });\nx', output: 'undefined' },
      fix:   { label: 'Await it',        code: 'const x = await Promise.resolve(1);\nx', output: '1' },
    },
  ],

  when: {
    use: [
      'Interoperating with promise-returning APIs in non-async code',
      'Attaching a handler without making the surrounding function async',
      'Short transformation chains where await would need an extra function',
    ],
    avoid: [
      'Ordinary sequential async logic → await, which reads far better',
      'Error handling → catch after, not the second argument',
      'You need every result of several promises → Promise.all',
      'The callback starts async work → return its promise',
    ],
  },

  notes: {
    complexity: 'O(1) to attach; the callback runs as a microtask',
    return:     'A new Promise; the original is unchanged and can be thened again',
    cpython:    'V8: Builtins-promise-then',
    memory:     'Allocates a new promise per call — long chains allocate per link',
    threadSafe: 'Single-threaded; callbacks run on the microtask queue',
  },

  related: [
    { name: 'Promise.prototype.catch',   slug: 'promise-catch',   when: 'Error handling that also covers the callback' },
    { name: 'Promise.prototype.finally', slug: 'promise-finally', when: 'Cleanup regardless of outcome' },
    { name: 'Promise.resolve',           slug: 'promise-resolve', when: 'Making a value thenable' },
    { name: 'Promise.all',               slug: 'promise-all',     when: 'Waiting on several at once' },
  ],

  faq: [
    {
      q: 'then(fn, handler) or then(fn).catch(handler)?',
      a: 'Almost always the second. The two-argument form only handles rejections from the ORIGINAL promise, so an error in fn escapes it. A following catch covers both, which is what people expect from the name.',
      code: 'p.then(fn).catch(handler);   // covers errors in fn too',
    },
    {
      q: 'then or await?',
      a: 'await for sequential logic — it reads like ordinary code and keeps stack traces intact. then when you cannot make the function async, or when a single transformation reads fine inline.',
    },
    {
      q: 'Does a returned promise get nested?',
      a: 'No — it is flattened. Returning a promise from a then callback makes the outer promise wait for it and adopt its result, which is what makes chains work at all. There is no Promise<Promise<T>>.',
      code: 'await Promise.resolve(1).then(() => Promise.resolve(2));   // 2, not a promise',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise with then, catch and the thenable protocol standardised from the Promises/A+ specification.' },
    { version: 'ES2017', note: 'async/await added as syntax over the same machinery.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then',
    meta:  'Promise.prototype.then',
  },

};
