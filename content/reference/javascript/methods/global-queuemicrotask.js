// content/reference/javascript/methods/global-queuemicrotask.js
//
// Doc-only: the ordering this function exists to demonstrate — sync code,
// then microtasks, then timers — is fixed by the event loop, so a demo would
// print the same array for every input. The examples show that ordering.

export const meta = {
  slug:        'global-queuemicrotask',
  name:        'queueMicrotask',
  signature:   'queueMicrotask(callback)',
  blurb:       'Runs before the next timer and before rendering — the queue promises use.',
  category:    'global',
  type:        'global',
  hasLiveDemo: false,
  version:     'HTML standard',
  searchTerms: 'queueMicrotask microtask macrotask event loop setTimeout ordering starvation promise then rendering javascript',
};

export const method = {
  slug:      'global-queuemicrotask',
  name:      'queueMicrotask',
  signature: 'queueMicrotask(callback)',
  returns:   { type: 'undefined', desc: 'Nothing. The callback is queued on the microtask queue and runs once the current task finishes, before any timer and before the browser renders.' },

  category:    'Global function',
  version:     'HTML standard',
  hasLiveDemo: false,

  subtitle: 'Direct access to the queue that promise callbacks use. It exists so you can defer work without the allocation of a promise and without the task-level delay of a timeout.',

  cheat: {
    commonCall: 'queueMicrotask(() => flush())',
    returns:    'undefined',
    replaces:   'Promise.resolve().then(fn)',
    watchOut:   'an endless microtask chain STARVES the event loop',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true, default: null, desc: 'Run after the current task. An exception thrown inside it becomes an uncaught error — there is no way to catch it from the caller.' },
  ],

  patterns: [
    {
      name: 'Defer without a timer',
      desc: 'Runs sooner than setTimeout(fn, 0).',
      code: 'queueMicrotask(() => notifySubscribers());',
    },
    {
      name: 'Batch synchronous updates',
      desc: 'Collect now, flush once at the end of the task.',
      code: 'pending.push(change);\nif (!scheduled) {\n  scheduled = true;\n  queueMicrotask(flush);\n}',
    },
    {
      name: 'The promise equivalent',
      desc: 'Same queue, one extra allocation.',
      code: 'Promise.resolve().then(fn);',
    },
  ],

  examples: [
    { title: 'Runs after the current task', code: 'queueMicrotask(() => console.log("micro"));\nconsole.log("sync");', returns: "'sync' then 'micro'" },
    { title: 'Before a timer',              code: 'setTimeout(() => console.log("t"), 0);\nqueueMicrotask(() => console.log("m"));', returns: "'m' then 't'" },
    { title: 'Same queue as promises',      code: 'Promise.resolve().then(() => console.log("p"));\nqueueMicrotask(() => console.log("q"));', returns: "'p' then 'q' — FIFO" },
    { title: 'It returns nothing',          code: 'queueMicrotask(() => {})', returns: 'undefined' },
    { title: 'No id, no cancelling',        code: 'there is no clearMicrotask', returns: 'once queued, it runs' },
    { title: 'Errors are uncaught',         code: 'queueMicrotask(() => { throw new Error("x"); })', returns: 'an uncaught error event' },
  ],

  pitfalls: [
    {
      name: 'An endless chain starves everything',
      desc: 'The microtask queue is drained COMPLETELY before the next task, so a microtask that queues another microtask forever blocks timers, rendering and input handling with no way out. A setTimeout loop would yield between iterations; this does not.',
      wrong: { label: 'Freezes the page', code: 'function loop() { queueMicrotask(loop); }\nloop();', output: 'nothing else ever runs' },
      fix:   { label: 'Yield to tasks',   code: 'function loop() { setTimeout(loop, 0); }', output: 'the page stays responsive' },
    },
    {
      name: 'It cannot be cancelled',
      desc: 'There is no id and no clearMicrotask. Once queued the callback will run, so anything conditional has to be checked inside the callback rather than avoided by cancelling it.',
      wrong: { label: 'No way to stop it', code: 'queueMicrotask(update);   // component unmounts', output: 'update still runs' },
      fix:   { label: 'Check inside',      code: 'queueMicrotask(() => { if (!cancelled) update(); });', output: 'guarded' },
    },
    {
      name: 'Exceptions escape entirely',
      desc: 'A throw inside the callback becomes an uncaught error rather than something the caller can handle — there is no promise to reject. If the work can fail, wrap it in a try/catch inside the callback.',
      wrong: { label: 'Uncaught', code: 'try { queueMicrotask(() => { throw new Error("x"); }); } catch {}', output: 'the catch never runs' },
      fix:   { label: 'Catch inside', code: 'queueMicrotask(() => { try { risky(); } catch (e) { report(e); } });', output: 'handled' },
    },
    {
      name: 'Reaching for it when a timer is correct',
      desc: 'Because microtasks run before rendering, using one to yield so the browser can paint does not work — the paint still waits. If you want the UI to update first, you need a task, which means setTimeout or requestAnimationFrame.',
      wrong: { label: 'No paint', code: 'showSpinner();\nqueueMicrotask(heavyWork);', output: 'the spinner never appears' },
      fix:   { label: 'Yield properly', code: 'showSpinner();\nsetTimeout(heavyWork, 0);', output: 'the spinner renders first' },
    },
  ],

  when: {
    use: [
      'Deferring to the end of the current task, before any timer',
      'Batching several synchronous changes into one flush',
      'Library code that must act after the caller finishes but before anything else',
      'Avoiding a promise allocation in a hot path',
    ],
    avoid: [
      'You want the browser to render first → setTimeout or requestAnimationFrame',
      'You need to cancel → a timer, which has an id',
      'You need the result → a promise',
      'Recursive scheduling → it starves the event loop',
    ],
  },

  notes: {
    complexity: 'O(1) to queue',
    return:     'undefined; the callback runs on the microtask queue, FIFO with promise callbacks',
    cpython:    'Not V8 — defined by the HTML standard, with an equivalent in Node',
    memory:     'Retains the callback and its closure until it runs',
    threadSafe: 'Single-threaded; the queue is drained fully before the next task',
  },

  related: [
    { name: 'setTimeout',             slug: 'global-settimeout',  when: 'A task instead of a microtask — yields to rendering' },
    { name: 'Promise.resolve',        slug: 'promise-resolve',    when: 'The same queue, with a value attached' },
    { name: 'Promise.prototype.then', slug: 'promise-then',       when: 'Where most microtasks come from' },
    { name: 'structuredClone',        slug: 'global-structuredclone', when: 'Another global from the HTML standard' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because the thing worth demonstrating is an ORDERING, and that ordering is fixed by the event loop: synchronous code, then every queued microtask, then timers. A demo would print the same array whatever you typed, which is a constant pretending to be a computation. The examples above show the ordering directly.',
    },
    {
      q: 'queueMicrotask or Promise.resolve().then()?',
      a: 'They use the same queue and run in the same FIFO order. queueMicrotask states the intent and skips allocating a promise; the promise form is worth it only if you actually want a promise to chain onto.',
    },
    {
      q: 'What is the difference from setTimeout(fn, 0)?',
      a: 'A microtask runs at the end of the CURRENT task, before rendering and before any timer. setTimeout queues a new task, which runs after the microtask queue is empty and after the browser may have painted. Microtasks are sooner; tasks yield.',
      code: "setTimeout(() => console.log('task'), 0);\nqueueMicrotask(() => console.log('micro'));\n// micro, then task",
    },
    {
      q: 'Can I starve the event loop with it?',
      a: 'Yes, and easily — the queue is drained completely before anything else runs, so a self-requeueing microtask locks the page up with no recovery. That is the one genuine danger of this function.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Promises introduced the microtask queue to JavaScript, but without direct access.' },
    { version: '2018',   note: 'queueMicrotask added to the HTML standard, exposing the queue directly.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask',
    meta:  'queueMicrotask',
  },

};
