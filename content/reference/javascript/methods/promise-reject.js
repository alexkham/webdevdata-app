// content/reference/javascript/methods/promise-reject.js
//
// Doc-only: awaiting Promise.reject(x) always throws x, so a demo would just
// echo its input back as an error. The interesting behaviour — no
// unwrapping, unhandled-rejection timing — is shown in the examples.

export const meta = {
  slug:        'promise-reject',
  name:        'Promise.reject',
  signature:   'Promise.reject(reason)',
  blurb:       'A pre-rejected promise — and unlike resolve, it never unwraps what you give it.',
  category:    'promise',
  type:        'promise',
  hasLiveDemo: false,
  version:     'ES2015',
  searchTerms: 'Promise.reject reason error unhandled rejection no unwrap throw async function difference es2015 javascript',
};

export const method = {
  slug:      'promise-reject',
  name:      'Promise.reject',
  signature: 'Promise.reject(reason)',
  returns:   { type: 'Promise', desc: 'A Promise rejected with exactly the reason given. No unwrapping and no adoption — passing a promise makes the REASON a promise.' },

  category:    'Promise static method',
  version:     'ES2015',
  hasLiveDemo: false,

  subtitle: 'The asymmetric twin of Promise.resolve. resolve inspects its argument and may pass it through; reject takes the argument literally, whatever it is.',

  cheat: {
    commonCall: 'Promise.reject(new Error("nope"))',
    returns:    'an already-rejected promise',
    replaces:   'new Promise((_, rej) => rej(e))',
    watchOut:   'unhandled unless something catches it THIS tick',
  },

  parameters: [
    { name: 'reason', type: 'any', required: false, default: 'undefined', desc: 'Anything, though it should be an Error. Unlike resolve, a promise or thenable here is NOT adopted — it becomes the rejection reason itself.' },
  ],

  patterns: [
    {
      name: 'Reject with an Error',
      desc: 'Always an Error, for the stack trace.',
      code: 'return Promise.reject(new Error("not found"));',
    },
    {
      name: 'Build a timeout',
      desc: 'The rejecting half of a race.',
      code: 'const timeout = ms => new Promise((_, rej) =>\n  setTimeout(() => rej(new Error("timeout")), ms));',
    },
    {
      name: 'Throwing is usually clearer',
      desc: 'Inside async, a throw produces the same thing.',
      code: 'async function f() { throw new Error("nope"); }',
    },
  ],

  examples: [
    { title: 'A rejected promise',      code: 'await Promise.reject(new Error("x")).catch(e => e.message)', returns: "'x'" },
    { title: 'It does NOT unwrap',      code: 'Promise.reject(Promise.resolve(1)).catch(v => v instanceof Promise)', returns: 'true' },
    { title: 'resolve DOES pass through',code: 'const p = Promise.resolve(1);\nPromise.resolve(p) === p', returns: 'true' },
    { title: 'Any value works',         code: 'await Promise.reject("just a string").catch(v => typeof v)', returns: "'string'" },
    { title: 'Unhandled if nothing catches', code: 'Promise.reject(new Error("x"))', returns: 'UnhandledPromiseRejection' },
    { title: 'An async throw is equivalent', code: 'async function f() { throw new Error("x"); }', returns: 'a rejected promise' },
  ],

  pitfalls: [
    {
      name: 'It does not unwrap a promise',
      desc: 'The asymmetry with resolve. Promise.reject(somePromise) produces a rejection whose REASON is that promise, so a catch handler receives a Promise object rather than an error — and awaiting it inside the handler is the only way to see what went wrong.',
      wrong: { label: 'Reason is a promise', code: 'Promise.reject(fetchData()).catch(v => v instanceof Promise)', output: 'true' },
      fix:   { label: 'Await, then rethrow', code: 'try { await fetchData(); } catch (e) { throw e; }', output: 'a real error' },
    },
    {
      name: 'Rejecting with a non-Error loses the stack',
      desc: 'Rejecting with a string or an object works and gives you no stack trace, no name and nothing for a logger to format. It is the promise equivalent of throwing a string, and just as unhelpful at three in the morning.',
      wrong: { label: 'No stack', code: 'Promise.reject("failed")', output: "reason is the string 'failed'" },
      fix:   { label: 'An Error',  code: 'Promise.reject(new Error("failed"))', output: 'name, message and stack' },
    },
    {
      name: 'Creating one eagerly can go unhandled',
      desc: 'A rejected promise stored in a variable and caught later may already have triggered an unhandled-rejection warning, because the check happens when the microtask queue drains. Create the rejection at the point where it will be handled.',
      wrong: { label: 'Warns first', code: 'const p = Promise.reject(new Error("x"));\nawait later();\np.catch(handle);', output: 'unhandled rejection reported' },
      fix:   { label: 'Attach immediately', code: 'const p = Promise.reject(new Error("x")).catch(handle);', output: 'handled' },
    },
    {
      name: 'In an async function, throw instead',
      desc: 'Returning Promise.reject from an async function works but reads oddly and skips the stack capture a throw gives you at the right line. throw is the idiomatic form, and try/catch can see it.',
      wrong: { label: 'Roundabout', code: 'async function f() { return Promise.reject(new Error("x")); }', output: 'rejects' },
      fix:   { label: 'Idiomatic',  code: 'async function f() { throw new Error("x"); }', output: 'rejects, with a better trace' },
    },
  ],

  when: {
    use: [
      'Returning an early failure from a non-async function',
      'The rejecting side of a timeout',
      'Test doubles for a failing dependency',
      'Converting a validation failure into a rejected promise at an API boundary',
    ],
    avoid: [
      'Inside an async function → throw',
      'You need external control → Promise.withResolvers',
      'Rejecting with a promise → await it and rethrow the real error',
      'Rejecting with a non-Error → you lose the stack',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new rejected Promise',
    cpython:    'V8: Builtins-promise-reject',
    memory:     'Allocates one promise',
    threadSafe: 'Single-threaded; the unhandled-rejection check runs when the microtask queue drains',
  },

  related: [
    { name: 'Promise.resolve',           slug: 'promise-resolve',       when: 'The fulfilling counterpart, which DOES unwrap' },
    { name: 'Promise.prototype.catch',   slug: 'promise-catch',         when: 'Handling what this produces' },
    { name: 'Promise.withResolvers',     slug: 'promise-withresolvers', when: 'Rejecting from outside the promise' },
    { name: 'Promise.any',               slug: 'promise-any',           when: 'Tolerating rejections until all fail' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because awaiting Promise.reject(x) always throws x — a demo would simply echo whatever you typed back as an error, which demonstrates nothing. The behaviour worth knowing is that it does NOT unwrap a promise passed to it, and that an unhandled rejection is reported when the microtask queue drains; both are shown in the examples above, run in a real runtime.',
    },
    {
      q: 'Why does reject not unwrap a promise when resolve does?',
      a: 'Because resolve is specified to ADOPT a thenable — that is how interoperation works. reject has no such step: the reason is stored verbatim. The asymmetry is deliberate, and it means Promise.reject(p) gives you a rejection whose reason is a promise.',
      code: 'Promise.reject(Promise.resolve(1)).catch(v => v instanceof Promise);   // true',
    },
    {
      q: 'reject or throw?',
      a: 'Inside an async function, throw — it captures the stack at the failure point and try/catch can see it. Promise.reject is for non-async functions that must return a promise, and for building rejecting promises in tests.',
    },
    {
      q: 'Why do I get an unhandled rejection warning even though I have a catch?',
      a: 'Usually because the catch was attached in a later tick. The runtime checks for handlers when the microtask queue drains, so a rejection created now and handled after an await has already been reported. Attach the handler in the same expression.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promise.reject added with the constructor, deliberately without thenable adoption.' },
    { version: 'ES2017', note: 'async/await made throw the usual way to produce a rejection.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject',
    meta:  'Promise.reject',
  },

  tryInTool: [],
};
