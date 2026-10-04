// content/reference/javascript/methods/array-find.js

export const meta = {
  slug:        'array-find',
  name:        'Array.prototype.find',
  signature:   'array.find(callback[, thisArg])',
  blurb:       'The first element that passes a test, or undefined — not an array.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'array find first match search predicate undefined findIndex es2015 javascript',
};

export const method = {
  slug:      'array-find',
  name:      'Array.prototype.find',
  signature: 'array.find(callback[, thisArg])',
  returns:   { type: 'any', desc: 'The first element for which the callback returned truthy, or undefined when none did. Never an array.' },

  category:    'Array method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'filter for exactly one result. It stops at the first match, and hands back the element itself rather than a one-element array.',

  cheat: {
    commonCall: 'items.find(x => x.id === id)',
    returns:    'the element, or undefined',
    replaces:   'filter(...)[0], which scans the whole array',
    watchOut:   'a falsy element is indistinguishable from "not found"',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array). The first element for which it returns truthy is returned.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items',     type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'threshold', type: 'number',   hint: 'find the first above this', input: 'number' },
  ],
  demoTemplate: '{items}.find(x => x > {threshold})',
  cases: [
    { id: 'found',   label: 'first match',   values: { items: '1,2,3,4', threshold: 2 } },
    { id: 'firstel', label: 'matches at 0',  values: { items: '5,1,2',   threshold: 0 } },
    { id: 'missing', label: 'no match',      values: { items: '1,2,3',   threshold: 99 } },
    { id: 'empty',   label: 'empty array',   values: { items: '',        threshold: 1 } },
  ],
  demoExplainer: 'The ELEMENT comes back, not an array and not an index — that is the difference from filter and findIndex. Iteration stops at the first match, so later matches are never even tested. When nothing matches you get undefined, which is the value to check for; note the demo shows it plainly rather than as an empty array.',

  patterns: [
    {
      name: 'Look up by id',
      desc: 'The single most common use.',
      code: 'const user = users.find(u => u.id === targetId);',
    },
    {
      name: 'Guard the result',
      desc: 'undefined is the "not found" signal.',
      code: 'const match = items.find(pred);\nif (!match) throw new Error("not found");',
    },
    {
      name: 'Default with nullish coalescing',
      desc: 'Falls back only on undefined, not on a falsy match.',
      code: 'const found = items.find(pred) ?? fallback;',
    },
  ],

  examples: [
    { title: 'First match',     code: '[1, 2, 3, 4].find(x => x > 2)',  returns: '3' },
    { title: 'No match',        code: '[1, 2, 3].find(x => x > 99)',    returns: 'undefined' },
    { title: 'Empty array',     code: '[].find(x => true)',             returns: 'undefined' },
    { title: 'Element, not array',code: '[1, 2, 3].find(x => x === 2)', returns: '2  // not [2]' },
    { title: 'Falsy match',     code: '[0, 1].find(x => x === 0)',      returns: '0' },
    { title: 'Index instead',   code: '[1, 2, 3].findIndex(x => x > 99)', returns: '-1' },
  ],

  pitfalls: [
    {
      name: 'A falsy match looks like no match',
      desc: 'find returns 0, empty string or false exactly as it returns undefined for failure — so a truthiness test cannot tell them apart. This bites whenever the array holds numbers that can be zero.',
      wrong: { label: 'Zero treated as missing', code: 'const n = [0, 1].find(x => x === 0);\nif (!n) { /* "not found" */ }', output: 'wrongly takes the not-found branch' },
      fix:   { label: 'Compare to undefined',    code: 'if (n === undefined) { ... }', output: 'correct' },
    },
    {
      name: 'It returns the element, not an array',
      desc: 'Coming from filter, it is easy to index the result. Doing so on an object gives undefined, and on a number throws nothing but produces nonsense.',
      wrong: { label: 'Indexing the element', code: 'users.find(u => u.id === 1)[0]', output: 'undefined' },
      fix:   { label: 'Use it directly',      code: 'users.find(u => u.id === 1)', output: 'the user object' },
    },
    {
      name: 'filter(...)[0] does more work',
      desc: 'filter scans the whole array and allocates a result array, then you throw all but one element away. find stops at the first hit and allocates nothing.',
      wrong: { label: 'Scans everything', code: 'items.filter(pred)[0]', output: 'O(n) always, plus an array' },
      fix:   { label: 'Stops early',      code: 'items.find(pred)', output: 'stops at the first match' },
    },
    {
      name: 'Using || for a default swallows falsy matches',
      desc: 'A found value of 0 or empty string is falsy, so || replaces a legitimate result with the fallback. ?? only triggers on null and undefined.',
      wrong: { label: 'Falsy replaced', code: '[0, 1].find(x => x === 0) || 99', output: '99' },
      fix:   { label: 'Nullish coalescing', code: '[0, 1].find(x => x === 0) ?? 99', output: '0' },
    },
  ],

  when: {
    use: [
      'Looking up a single record by id or key',
      'Any search where you expect at most one result',
      'Short-circuiting on the first match in a large array',
    ],
    avoid: [
      'You want every match → filter',
      'You want the position → findIndex',
      'You only need a yes/no answer → some',
      'Matching a plain value rather than a predicate → includes',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; stops at the first match',
    return:     'The element or undefined; the array is never modified',
    cpython:    'V8: Builtins-array-find.tq',
    memory:     'No allocation — unlike filter, which builds an array',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.filter',   slug: 'array-filter',   when: 'You want every match, as an array' },
    { name: 'Array.prototype.some',     slug: 'array-some',     when: 'You only need to know whether one exists' },
    { name: 'Array.prototype.includes', slug: 'array-includes', when: 'Matching a value rather than a predicate' },
    { name: 'Array.prototype.indexOf',  slug: 'array-indexof',  when: 'You want a position and a value match' },
  ],

  faq: [
    {
      q: 'How do I tell "found a falsy value" from "found nothing"?',
      a: 'Compare against undefined explicitly, or use findIndex and check for -1. A plain truthiness test cannot distinguish them, because find returns the element as-is — including 0 and empty string.',
      code: 'const i = items.findIndex(pred);\nif (i !== -1) { const match = items[i]; }',
    },
    {
      q: 'find or filter(...)[0]?',
      a: 'find, always. filter scans the entire array and allocates a result you then discard all but one element of. find stops at the first match and allocates nothing.',
    },
    {
      q: 'Why did || give me the wrong default?',
      a: 'Because || falls back on any falsy value, and 0, empty string and false are all legitimate results. Use ?? instead, which only falls back on null and undefined.',
      code: 'items.find(pred) ?? fallback',
    },
  ],

  history: [
    { version: 'ES2015', note: 'find and findIndex added, alongside the rest of the iteration helpers.' },
    { version: 'ES2023', note: 'findLast and findLastIndex added for searching from the end.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find',
    meta:  'Array.prototype.find',
  },

};
