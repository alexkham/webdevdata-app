// content/reference/javascript/methods/global-settimeout.js
//
// Live async demo (demoAsync): two timers race and the settled log is
// shown. setInterval, clearTimeout and clearInterval are consolidated
// here — one family, one set of traps.

export const meta = {
  slug:        'global-settimeout',
  name:        'setTimeout, setInterval and their clear functions',
  signature:   'setTimeout(callback, delay, ...args)',
  blurb:       'A MINIMUM delay, not a guarantee — and setInterval drifts where a chained timeout does not.',
  category:    'global',
  type:        'global',
  hasLiveDemo: true,
  version:     'HTML standard',
  searchTerms: 'setTimeout setInterval clearTimeout clearInterval delay event loop drift throttling 4ms nested this javascript',
};

export const method = {
  slug:      'global-settimeout',
  name:      'setTimeout, setInterval and their clear functions',
  signature: 'setTimeout(callback, delay, ...args)',
  returns:   { type: 'number | object', desc: 'A timer id — a number in browsers, a Timeout object in Node. Pass it to clearTimeout or clearInterval to cancel.' },

  category:    'Global functions',
  version:     'HTML standard',
  hasLiveDemo: true,

  subtitle: 'The delay is the earliest the callback may run, never the exact moment. Everything awkward about these functions follows from that, plus the fact that setInterval does not wait for your work to finish.',

  cheat: {
    commonCall: 'const id = setTimeout(fn, 1000)',
    returns:    'a timer id for cancelling',
    replaces:   'nothing; it is the primitive',
    watchOut:   'the delay is a MINIMUM, and setInterval accumulates drift',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Run after the delay. A STRING is accepted and evaluated, which is an eval in disguise and should never be used.' },
    { name: 'delay',    type: 'number',   required: false, default: '0',  desc: 'Milliseconds to wait at minimum. 0 means "as soon as the current task finishes", not immediately. Nested timeouts are clamped to 4ms after five levels.' },
    { name: '...args',  type: 'any',      required: false, default: 'none', desc: 'Extra arguments passed to the callback — cleaner than wrapping it in another closure.' },
  ],

  demoAsync: true,
  demoParams: [
    { name: 'a', type: 'number', hint: 'delay for A (ms)', input: 'number' },
    { name: 'b', type: 'number', hint: 'delay for B (ms)', input: 'number' },
  ],
  demoTemplate: "new Promise(done => { const log = []; setTimeout(() => log.push('A'), {a}); setTimeout(() => log.push('B'), {b}); setTimeout(() => done(log), Math.max({a}, {b}) + 5); })",
  cases: [
    { id: 'afirst', label: 'A is shorter',                values: { a: 10, b: 30 } },
    { id: 'bfirst', label: 'B is shorter',                values: { a: 30, b: 10 } },
    { id: 'tie',    label: 'equal → registration order', values: { a: 20, b: 20 } },
    { id: 'zero',   label: 'both zero',                   values: { a: 0, b: 0 } },
  ],
  demoExplainer: "Timers fire in order of their delay, and when two delays are equal they fire in the order they were registered — so the tie and the zero case both give A first. Now try delays only one millisecond apart, such as 5 and 4: run it a few times and the order can flip. That is the page's central point made visible — the delay is a minimum, not a schedule, and timers that close together are not reliably ordered.",

  patterns: [
    {
      name: 'Cancel on cleanup',
      desc: 'Always keep the id.',
      code: 'const id = setTimeout(fn, 1000);\nreturn () => clearTimeout(id);',
    },
    {
      name: 'A promise-based sleep',
      desc: 'The idiomatic wrapper.',
      code: 'const sleep = ms => new Promise(r => setTimeout(r, ms));\nawait sleep(500);',
    },
    {
      name: 'Repeat without drift',
      desc: 'Chain timeouts instead of using setInterval.',
      code: 'async function loop() {\n  await work();\n  setTimeout(loop, 1000);\n}',
    },
  ],

  examples: [
    { title: 'Returns an id',      code: 'typeof setTimeout(() => {}, 0)', returns: "'object' in Node, 'number' in browsers" },
    { title: 'Zero is not immediate', code: 'setTimeout(() => console.log("b"), 0);\nconsole.log("a");', returns: "'a' then 'b'" },
    { title: 'Microtasks run first',code: 'setTimeout(() => console.log("t"), 0);\nPromise.resolve().then(() => console.log("m"));', returns: "'m' then 't'" },
    { title: 'Extra arguments',    code: 'setTimeout((a, b) => a + b, 0, 1, 2)', returns: 'the callback receives 1 and 2' },
    { title: 'Cancelling',         code: 'const id = setTimeout(fn, 1000);\nclearTimeout(id);', returns: 'fn never runs' },
    { title: 'A string is evaluated', code: 'setTimeout("alert(1)", 0)', returns: 'works — and is an eval' },
  ],

  pitfalls: [
    {
      name: 'setInterval does not wait for your callback',
      desc: 'It fires every n milliseconds regardless of whether the previous run finished, so slow async work overlaps and requests pile up. A chained setTimeout waits for the work, which is almost always what you meant by "every second".',
      wrong: { label: 'Overlaps', code: 'setInterval(async () => { await slowFetch(); }, 1000)', output: 'concurrent fetches stack up' },
      fix:   { label: 'Chain it', code: 'async function loop() {\n  await slowFetch();\n  setTimeout(loop, 1000);\n}\nloop();', output: 'one at a time' },
    },
    {
      name: 'The delay is a minimum',
      desc: 'A blocked main thread, a background tab, or a busy event loop all push the callback later — browsers throttle timers in hidden tabs to once a minute. Never use a timer to measure elapsed time or to schedule anything that must be punctual.',
      wrong: { label: 'Assumes accuracy', code: 'setTimeout(() => count++, 1000)', output: 'drifts, and stalls in a background tab' },
      fix:   { label: 'Read the clock',   code: 'const started = Date.now();\nsetTimeout(() => { const real = Date.now() - started; }, 1000);', output: 'the actual elapsed time' },
    },
    {
      name: 'Losing `this` in a method callback',
      desc: 'Passing a bound method unbound means this is undefined in strict mode when the timer fires. An arrow function captures the surrounding this and avoids the problem entirely.',
      wrong: { label: 'this is lost', code: 'setTimeout(this.tick, 100)', output: 'TypeError inside tick' },
      fix:   { label: 'Arrow it',     code: 'setTimeout(() => this.tick(), 100)', output: 'works' },
    },
    {
      name: 'Forgetting to clear it',
      desc: 'A timer holds its callback, and the callback holds everything it closes over. An interval started in a component that unmounts keeps running forever, keeping that whole scope alive — a leak and a stream of updates to something that no longer exists.',
      wrong: { label: 'Runs forever', code: 'useEffect(() => { setInterval(poll, 1000); }, [])', output: 'never stops' },
      fix:   { label: 'Return a cleanup', code: 'useEffect(() => {\n  const id = setInterval(poll, 1000);\n  return () => clearInterval(id);\n}, [])', output: 'stops on unmount' },
    },
  ],

  when: {
    use: [
      'Deferring work until after the current task',
      'Debouncing and throttling',
      'Timeouts, paired with Promise.race',
      'Polling, via a chained setTimeout rather than setInterval',
    ],
    avoid: [
      'Animation → requestAnimationFrame',
      'Running right after the current task → queueMicrotask',
      'Measuring time → performance.now()',
      'Regular async polling → chain timeouts, not setInterval',
    ],
  },

  notes: {
    complexity: 'O(1) to schedule',
    return:     'A timer id; the callback runs as a macrotask, after all pending microtasks',
    cpython:    'Not V8 — timers are defined by the HTML standard and by Node, not ECMAScript',
    memory:     'The timer retains the callback and its whole closure until it fires or is cleared',
    threadSafe: 'Single-threaded; a blocked thread delays every timer',
  },

  related: [
    { name: 'queueMicrotask',       slug: 'global-queuemicrotask', when: 'Running before the next timer, not after' },
    { name: 'Promise.race',         slug: 'promise-race',          when: 'Building a timeout around real work' },
    { name: 'Promise.withResolvers',slug: 'promise-withresolvers', when: 'Turning a timer into a promise' },
    { name: 'Date.now',             slug: 'date-now',              when: 'Measuring what actually elapsed' },
  ],

  faq: [
    {
      q: 'Why does setTimeout(fn, 0) not run immediately?',
      a: 'Because it queues a task for after the current one completes, and all pending microtasks run before any task. So a promise callback queued later still runs first. Zero means "soon", not "now".',
      code: "setTimeout(() => console.log('t'), 0);\nPromise.resolve().then(() => console.log('m'));\n// m, then t",
    },
    {
      q: 'setInterval or a chained setTimeout?',
      a: 'Chained timeouts, whenever the work is async or of variable duration — they wait for each run to finish, so nothing overlaps and the interval is measured between completions. setInterval is only safe for trivial synchronous callbacks.',
    },
    {
      q: 'Why did my timer take much longer than the delay?',
      a: 'Either the main thread was busy, or the tab was in the background — browsers throttle hidden tabs hard, often to one timer per minute. Deeply nested timeouts are also clamped to a 4ms minimum after five levels.',
    },
  ],

  history: [
    { version: 'Netscape', note: 'setTimeout and setInterval shipped as browser APIs, never part of ECMAScript.' },
    { version: 'HTML5',    note: 'Standardised, including the 4ms nesting clamp and background-tab throttling.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout',
    meta:  'setTimeout',
  },

  tryInTool: [],
};
