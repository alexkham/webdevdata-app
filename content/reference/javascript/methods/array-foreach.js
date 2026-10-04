// content/reference/javascript/methods/array-foreach.js
//
// Slug is lowercased (`array-foreach`) so URLs stay case-insensitive and
// match the rest of the slugs.

export const meta = {
  slug:        'array-foreach',
  name:        'Array.prototype.forEach',
  signature:   'array.forEach(callback[, thisArg])',
  blurb:       'Run a function for each element — returns undefined, and you cannot break out.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array forEach loop iterate side effect undefined break continue for of javascript',
};

export const method = {
  slug:      'array-foreach',
  name:      'Array.prototype.forEach',
  signature: 'array.forEach(callback[, thisArg])',
  returns:   { type: 'undefined', desc: 'Always undefined — whatever the callback returns is discarded. Nothing can be chained onto it.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The one iteration method that produces nothing. Its two real limitations — no return value and no way to break — are exactly why for...of often reads better.',

  cheat: {
    commonCall: 'items.forEach(x => console.log(x))',
    returns:    'undefined — always',
    replaces:   'a plain for loop when you only want side effects',
    watchOut:   'you cannot break; return only skips the current element',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array). Its return value is ignored entirely.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.forEach(x => x)',
  cases: [
    { id: 'three', label: 'three elements', values: { items: '1,2,3' } },
    { id: 'one',   label: 'one element',    values: { items: '7' } },
    { id: 'empty', label: 'empty array',    values: { items: '' } },
  ],
  demoExplainer: 'Every case returns undefined, and that is the whole lesson — no matter what the callback does or what it returns, forEach produces nothing. The work happens entirely through side effects. This is why `const result = items.forEach(...)` is always a bug, and why you cannot chain .filter() or .join() onto the end of a forEach.',

  patterns: [
    {
      name: 'Pure side effects',
      desc: 'Logging, sending, writing — where no value comes back.',
      code: 'items.forEach(x => console.log(x));',
    },
    {
      name: 'Prefer for...of when you might break',
      desc: 'forEach cannot stop early; a real loop can.',
      code: 'for (const x of items) {\n  if (found(x)) break;\n}',
    },
    {
      name: 'Use map when you want a result',
      desc: 'If a value comes out, forEach is the wrong method.',
      code: 'const doubled = items.map(x => x * 2);',
    },
  ],

  examples: [
    { title: 'Returns undefined',  code: '[1, 2, 3].forEach(x => x * 2)',  returns: 'undefined' },
    { title: 'Side effect works',  code: 'const out = [];\n[1, 2].forEach(x => out.push(x));\nout', returns: '[1, 2]' },
    { title: 'return is continue', code: 'const out = [];\n[1, 2, 3].forEach(x => { if (x === 2) return; out.push(x); });\nout', returns: '[1, 3]' },
    { title: 'Cannot chain',       code: '[1, 2].forEach(x => x).length',  returns: "TypeError: Cannot read properties of undefined" },
    { title: 'Skips holes',        code: 'let n = 0;\n[1, , 3].forEach(() => n++);\nn', returns: '2  // the hole is skipped' },
    { title: 'Empty array',        code: '[].forEach(x => x)',             returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'You cannot break out of it',
      desc: 'There is no early exit. return inside the callback behaves like continue — it ends that one call, not the loop. Iteration always runs to the end, however much work is left.',
      wrong: { label: 'return is continue', code: 'items.forEach(x => { if (found) return; check(x); });', output: 'keeps iterating to the end' },
      fix:   { label: 'Use for...of',       code: 'for (const x of items) { if (found) break; check(x); }', output: 'stops immediately' },
    },
    {
      name: 'It returns undefined, so nothing chains',
      desc: 'Assigning the result or chaining another method onto it fails. Coming from map, the mistake is easy — the two have identical signatures and completely different outputs.',
      wrong: { label: 'Nothing comes back', code: 'const doubled = items.forEach(x => x * 2);', output: 'undefined' },
      fix:   { label: 'Use map',            code: 'const doubled = items.map(x => x * 2);', output: '[2, 4, 6]' },
    },
    {
      name: 'It does not await async callbacks',
      desc: 'An async callback returns a promise that forEach discards, so the loop finishes long before the work does. The surrounding function carries on with nothing done yet.',
      wrong: { label: 'Fires and forgets', code: 'items.forEach(async x => { await save(x); });\ndone();', output: 'done() runs before any save finishes' },
      fix:   { label: 'Use for...of',      code: 'for (const x of items) { await save(x); }\ndone();', output: 'awaits each one' },
    },
    {
      name: 'It skips holes in sparse arrays',
      desc: 'Empty slots are not visited at all, so the callback runs fewer times than the length suggests. new Array(3).forEach(...) never calls the callback once.',
      wrong: { label: 'Never runs', code: 'let n = 0;\nnew Array(3).forEach(() => n++);\nn', output: '0' },
      fix:   { label: 'Fill first', code: 'new Array(3).fill(0).forEach(() => n++);', output: '3' },
    },
  ],

  when: {
    use: [
      'Side effects only — logging, sending, mutating something external',
      'When the array is small and you will never need to stop early',
    ],
    avoid: [
      'You want a value back → map, filter or reduce',
      'You might need to stop early → for...of with break',
      'The callback is async → for...of with await',
      'The array is sparse → fill it first, or use a for loop',
    ],
  },

  notes: {
    complexity: 'O(n) — always runs to the end; there is no short circuit',
    return:     'Always undefined; the array is not modified by forEach itself',
    cpython:    'V8: Builtins-array-foreach.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'You want the transformed values back' },
    { name: 'Array.prototype.some',   slug: 'array-some',   when: 'You need to stop at the first match' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'You want a subset rather than side effects' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'You are accumulating into one value' },
  ],

  faq: [
    {
      q: 'How do I break out of forEach?',
      a: 'You cannot. return acts as continue, and there is no break. If you need early exit, use for...of with break — or some/every, which short-circuit by design, though they read as questions rather than loops.',
      code: 'for (const x of items) {\n  if (done) break;\n}',
    },
    {
      q: 'Why does my async forEach finish too early?',
      a: 'Because forEach ignores the promise each async callback returns. All the callbacks start, forEach returns immediately, and the awaits resolve later. Use a for...of loop with await, or Promise.all with map if the work can run in parallel.',
      code: 'await Promise.all(items.map(x => save(x)));',
    },
    {
      q: 'forEach or for...of?',
      a: 'for...of for anything non-trivial: it supports break, continue, await and return from the enclosing function, and it does not skip holes. forEach is fine for a short side-effect-only pass where none of that matters.',
    },
  ],

  history: [
    { version: 'ES5', note: 'forEach standardised in 2009 with the other iteration methods.' },
    { version: 'ES2015', note: 'for...of arrived and covers most of what forEach was used for, with fewer limitations.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach',
    meta:  'Array.prototype.forEach',
  },

};
