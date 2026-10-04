// content/reference/javascript/methods/array-findindex.js

export const meta = {
  slug:        'array-findindex',
  name:        'Array.prototype.findIndex',
  signature:   'array.findIndex(callback[, thisArg])',
  blurb:       'Position of the first element that passes a test, or -1.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'array findIndex position first match predicate minus one find indexOf es2015 javascript',
};

export const method = {
  slug:      'array-findindex',
  name:      'Array.prototype.findIndex',
  signature: 'array.findIndex(callback[, thisArg])',
  returns:   { type: 'number', desc: 'Index of the first element for which the callback returned truthy, or -1 when none did.' },

  category:    'Array method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'find, but it hands back the position instead of the element. That makes it the reliable way to distinguish "matched a falsy value" from "matched nothing".',

  cheat: {
    commonCall: 'items.findIndex(x => x.id === id)',
    returns:    'number — the index, or -1',
    replaces:   'indexOf when you need a predicate rather than a value',
    watchOut:   '-1 is truthy, so compare it explicitly',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array). Iteration stops at the first truthy result.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items',     type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'threshold', type: 'number',   hint: 'first index above this',   input: 'number' },
  ],
  demoTemplate: '{items}.findIndex(x => x > {threshold})',
  cases: [
    { id: 'middle',  label: 'match in the middle', values: { items: '1,2,3,4', threshold: 2 } },
    { id: 'first',   label: 'match at index 0',    values: { items: '5,1,2',   threshold: 0 } },
    { id: 'missing', label: 'no match → -1',       values: { items: '1,2,3',   threshold: 99 } },
    { id: 'empty',   label: 'empty array',         values: { items: '',        threshold: 0 } },
  ],
  demoExplainer: 'The index of the first passing element comes back, and iteration stops there. A missing match gives -1, and an empty array gives -1 too. The advantage over find is precision: a result of 0 means "matched at the start" and -1 means "no match", whereas find returns the element itself and cannot distinguish a matched 0 from a failed search.',

  patterns: [
    {
      name: 'Find then replace',
      desc: 'The index is what you need to write back.',
      code: 'const i = items.findIndex(x => x.id === id);\nif (i !== -1) items[i] = updated;',
    },
    {
      name: 'Find then remove',
      desc: 'Pairs with splice.',
      code: 'const i = items.findIndex(pred);\nif (i !== -1) items.splice(i, 1);',
    },
    {
      name: 'Distinguish falsy match from no match',
      desc: 'What find cannot do on its own.',
      code: 'const i = values.findIndex(v => v === 0);\nconst found = i !== -1;',
    },
  ],

  examples: [
    { title: 'Match in the middle', code: '[1, 2, 3, 4].findIndex(x => x > 2)', returns: '2' },
    { title: 'No match',            code: '[1, 2, 3].findIndex(x => x > 99)',   returns: '-1' },
    { title: 'Match at index 0',    code: '[0, 1].findIndex(x => x === 0)',     returns: '0' },
    { title: 'find is ambiguous',   code: '[0, 1].find(x => x === 0)',          returns: '0  // same as "not found"?' },
    { title: 'Empty array',         code: '[].findIndex(x => true)',            returns: '-1' },
    { title: 'Predicate, not value',code: '[{id: 1}].findIndex(o => o.id === 1)', returns: '0' },
  ],

  pitfalls: [
    {
      name: '-1 is truthy',
      desc: 'Same trap as indexOf. Testing the result directly is backwards: no match gives -1 which passes an if, and a match at index 0 gives 0 which fails one.',
      wrong: { label: 'Backwards', code: 'if (items.findIndex(pred)) { /* "found" */ }', output: 'true when ABSENT, false at index 0' },
      fix:   { label: 'Compare explicitly', code: 'if (items.findIndex(pred) !== -1) { ... }', output: 'correct' },
    },
    {
      name: 'It returns an index, not the element',
      desc: 'Coming from find, it is easy to use the result as the value. You get a number, so property access silently yields undefined rather than throwing.',
      wrong: { label: 'Index used as element', code: 'items.findIndex(pred).name', output: 'undefined' },
      fix:   { label: 'Index into the array',  code: 'items[items.findIndex(pred)].name', output: 'the value' },
    },
    {
      name: 'A braced callback with no return always gives -1',
      desc: 'Without an explicit return the callback yields undefined, which is falsy, so nothing ever matches and the answer is always -1.',
      wrong: { label: 'No return', code: '[1, 2, 3].findIndex(x => { x > 1 })', output: '-1' },
      fix:   { label: 'Return it', code: '[1, 2, 3].findIndex(x => x > 1)', output: '1' },
    },
  ],

  when: {
    use: [
      'You need the position in order to replace or remove',
      'Distinguishing a falsy match from no match at all',
      'Matching by a predicate rather than by value',
    ],
    avoid: [
      'You want the element → find',
      'You are matching a plain value → indexOf',
      'You only need a yes/no answer → some',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; stops at the first match',
    return:     'A number; -1 means absent, and -1 is truthy',
    cpython:    'V8: Builtins-array-findindex.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.find',    slug: 'array-find',    when: 'You want the element rather than its position' },
    { name: 'Array.prototype.indexOf', slug: 'array-indexof', when: 'Matching a value rather than a predicate' },
    { name: 'Array.prototype.splice',  slug: 'array-splice',  when: 'Remove once you have the index' },
    { name: 'Array.prototype.some',    slug: 'array-some',    when: 'You only need to know whether one exists' },
  ],

  faq: [
    {
      q: 'findIndex or find?',
      a: 'findIndex when you need the position — to replace, remove, or to tell a falsy match apart from no match. find when you just want the element and none of its possible values are falsy.',
    },
    {
      q: 'findIndex or indexOf?',
      a: 'indexOf compares a VALUE with strict equality; findIndex runs a predicate. For objects, ranges, or anything needing logic, findIndex is the only one that works.',
      code: 'items.findIndex(o => o.id === targetId)',
    },
    {
      q: 'How do I search from the end?',
      a: 'findLastIndex, added in ES2023, walks backwards and returns the last match. Before that the idiom was to reverse a copy and adjust the index, which is why the new method was welcome.',
      code: 'items.findLastIndex(pred)',
    },
  ],

  history: [
    { version: 'ES2015', note: 'find and findIndex added together.' },
    { version: 'ES2023', note: 'findLast and findLastIndex added for searching from the end.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex',
    meta:  'Array.prototype.findIndex',
  },

};
