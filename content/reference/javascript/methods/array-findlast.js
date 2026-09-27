// content/reference/javascript/methods/array-findlast.js
//
// Combined entry for findLast and findLastIndex. They arrived together in
// ES2023, share one set of rules, and differ only in what they return —
// two near-identical pages would compete rather than help. The demo
// dispatches by method name so both are individually runnable.

export const meta = {
  slug:        'array-findlast',
  name:        'Array.prototype.findLast',
  signature:   'array.findLast(callback) | array.findLastIndex(callback)',
  blurb:       'find and findIndex, searching from the END instead of the start.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2023',
  searchTerms: 'array findLast findLastIndex last match from end reverse search predicate es2023 javascript',
};

export const method = {
  slug:      'array-findlast',
  name:      'Array.prototype.findLast',
  signature: 'array.findLast(callback) | array.findLastIndex(callback)',
  returns:   { type: 'any | number', desc: 'findLast returns the last matching ELEMENT, or undefined. findLastIndex returns its POSITION, or -1. Everything else about them is identical.' },

  category:    'Array methods',
  version:     'ES2023',
  hasLiveDemo: true,

  subtitle: 'The backwards halves of find and findIndex. Before ES2023 the idiom was to reverse a copy and correct the index by hand, which is exactly the arithmetic these remove.',

  cheat: {
    commonCall: 'items.findLast(x => x.ok)',
    returns:    'the element (findLast) or its index (findLastIndex)',
    replaces:   '[...items].reverse().find(...) plus index arithmetic',
    watchOut:   'the index is still counted from the LEFT',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array), starting at the last element and working backwards. Iteration stops at the first truthy result.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items',     type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'threshold', type: 'number',   hint: 'find the last below this', input: 'number' },
    { name: 'method',    type: 'string',   hint: 'findLast or findLastIndex', input: 'text' },
  ],
  demoTemplate: '{items}[{method}](x => x < {threshold})',
  cases: [
    { id: 'element', label: 'findLast → element', values: { items: '1,2,3,4', threshold: 3, method: 'findLast' } },
    { id: 'index',   label: 'findLastIndex → index', values: { items: '1,2,3,4', threshold: 3, method: 'findLastIndex' } },
    { id: 'none-el', label: 'no match → undefined', values: { items: '1,2,3', threshold: 0, method: 'findLast' } },
    { id: 'none-ix', label: 'no match → -1',        values: { items: '1,2,3', threshold: 0, method: 'findLastIndex' } },
    { id: 'empty',   label: 'empty array',          values: { items: '',      threshold: 9, method: 'findLast' } },
  ],
  demoExplainer: 'Both walk the array from the END towards the start and stop at the first element that passes. In [1, 2, 3, 4] the last element below 3 is the 2 at index 1 — so findLast gives 2 and findLastIndex gives 1. Note that the index is still measured from the left; only the scan direction reversed. The two no-match cases show the different failure values: undefined for the element form, -1 for the index form.',

  patterns: [
    {
      name: 'Most recent matching entry',
      desc: 'In an append-ordered log, the last match is the newest.',
      code: 'const latest = events.findLast(e => e.type === "error");',
    },
    {
      name: 'Trim from the end',
      desc: 'The index of the last real element bounds a slice.',
      code: 'const end = items.findLastIndex(x => x != null);\nconst trimmed = items.slice(0, end + 1);',
    },
    {
      name: 'The pre-2023 idiom',
      desc: 'What these replaced — note the index arithmetic.',
      code: 'const i = items.length - 1 - [...items].reverse().findIndex(pred);',
    },
  ],

  examples: [
    { title: 'Last matching element', code: '[1, 2, 3, 4].findLast(x => x < 3)',      returns: '2' },
    { title: 'Its index',             code: '[1, 2, 3, 4].findLastIndex(x => x < 3)', returns: '1' },
    { title: 'find goes forwards',    code: '[1, 2, 3, 4].find(x => x < 3)',          returns: '1' },
    { title: 'No match, element',     code: '[1, 2, 3].findLast(x => x > 99)',        returns: 'undefined' },
    { title: 'No match, index',       code: '[1, 2, 3].findLastIndex(x => x > 99)',   returns: '-1' },
    { title: 'Empty array',           code: '[].findLast(x => true)',                 returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'The index still counts from the left',
      desc: 'Only the scan direction reversed. findLastIndex does not return a distance from the end, so the result slots straight into normal indexing — which is right, but not what "last" suggests to everyone.',
      wrong: { label: 'Not from the end', code: '[1, 2, 3, 4].findLastIndex(x => x < 3)', output: '1  // not 2' },
      fix:   { label: 'Convert if needed', code: 'items.length - 1 - items.findLastIndex(pred)', output: 'distance from the end' },
    },
    {
      name: 'findLast cannot distinguish a falsy match',
      desc: 'Exactly the same trap as find. A matched 0 and a failed search both look falsy, so truthiness testing the result is unsafe whenever the array can hold falsy values.',
      wrong: { label: 'Zero looks missing', code: 'const n = [0, 1].findLast(x => x === 0);\nif (!n) { /* "not found" */ }', output: 'wrongly takes the not-found branch' },
      fix:   { label: 'Use findLastIndex',  code: 'if (items.findLastIndex(pred) !== -1) { ... }', output: 'unambiguous' },
    },
    {
      name: 'ES2023 and newer only',
      desc: 'These are recent. Older runtimes need the reverse-a-copy idiom, and reversing in place would mutate the source — the copy is not optional.',
      wrong: { label: 'Missing method', code: 'items.findLast(pred)', output: 'TypeError: items.findLast is not a function' },
      fix:   { label: 'Old idiom',      code: '[...items].reverse().find(pred)', output: 'the element' },
    },
  ],

  when: {
    use: [
      'The most recent entry in an append-ordered array',
      'Trimming or bounding from the end',
      'Any search where the last match matters rather than the first',
    ],
    avoid: [
      'You want the FIRST match → find or findIndex',
      'You are matching a plain value → lastIndexOf',
      'Runtimes older than ES2023 → reverse a copy',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; stops at the first match from the end',
    return:     'The element or undefined (findLast); the index or -1 (findLastIndex)',
    cpython:    'V8: Builtins-array-findlast.tq',
    memory:     'No allocation — unlike the reverse-a-copy idiom they replaced',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour',
  },

  related: [
    { name: 'Array.prototype.find',        slug: 'array-find',        when: 'Search forwards for the element' },
    { name: 'Array.prototype.findIndex',   slug: 'array-findindex',   when: 'Search forwards for the position' },
    { name: 'Array.prototype.lastIndexOf', slug: 'array-lastindexof', when: 'Matching a value rather than a predicate' },
    { name: 'Array.prototype.reverse',     slug: 'array-reverse',     when: 'What the old idiom needed, and why a copy mattered' },
  ],

  faq: [
    {
      q: 'Why does findLastIndex not count from the end?',
      a: 'Because it returns a position, and positions in JavaScript arrays are always left-counted — that is what makes the result usable directly with bracket notation or slice. Only the search order is reversed.',
      code: 'const i = items.findLastIndex(pred);\nitems[i];   // works directly',
    },
    {
      q: 'What did people do before ES2023?',
      a: 'Reversed a COPY and searched forwards, then corrected the index with length - 1 - i. The copy was essential, since reverse mutates — which is exactly the kind of error these methods remove.',
      code: '[...items].reverse().find(pred)',
    },
    {
      q: 'findLast or lastIndexOf?',
      a: 'findLast takes a predicate, so it handles objects, ranges and NaN. lastIndexOf compares a value with strict equality and is the simpler choice when that is all you need.',
    },
  ],

  history: [
    { version: 'ES2023', note: 'findLast and findLastIndex added, completing the find family in both directions.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast',
    meta:  'Array.prototype.findLast',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the records you are searching' },
  ],
};
