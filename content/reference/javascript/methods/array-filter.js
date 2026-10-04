// content/reference/javascript/methods/array-filter.js

export const meta = {
  slug:        'array-filter',
  name:        'Array.prototype.filter',
  signature:   'array.filter(callback[, thisArg])',
  blurb:       'Build a NEW array of the elements that pass a test — the length can shrink.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array filter select where predicate remove elements subset callback es5 javascript',
};

export const method = {
  slug:      'array-filter',
  name:      'Array.prototype.filter',
  signature: 'array.filter(callback[, thisArg])',
  returns:   { type: 'Array', desc: 'A NEW array holding only the elements for which the callback returned a truthy value. The original array is never modified.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The counterpart to map: map changes each element and keeps the length, filter keeps each element and changes the length. Reaching for the wrong one is the commonest Array mix-up.',

  cheat: {
    commonCall: 'items.filter(x => x > 0)',
    returns:    'a new array, same elements, possibly fewer',
    replaces:   'a for loop with an if and a push',
    watchOut:   'the callback is tested for TRUTHINESS, not for `=== true`',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array). The element is kept when the return value is truthy.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items',     type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'threshold', type: 'number',   hint: 'keep values above this',   input: 'number' },
  ],
  demoTemplate: '{items}.filter(x => x > {threshold})',
  cases: [
    { id: 'some',  label: 'some pass',  values: { items: '1,2,3,4', threshold: 2 } },
    { id: 'all',   label: 'all pass',   values: { items: '1,2,3',   threshold: 0 } },
    { id: 'none',  label: 'none pass',  values: { items: '1,2,3',   threshold: 99 } },
    { id: 'empty', label: 'empty array',values: { items: '',        threshold: 1 } },
  ],
  demoExplainer: 'Only the elements that satisfy the test survive, so the output is usually shorter than the input — that is the whole difference from map. When nothing passes you get an empty array rather than null or undefined, which means you can always safely chain another array method onto the result.',

  patterns: [
    {
      name: 'Drop empty or falsy values',
      desc: 'Boolean as the callback removes every falsy element in one go.',
      code: 'const clean = values.filter(Boolean);',
    },
    {
      name: 'Filter then transform',
      desc: 'Narrow first so map does less work.',
      code: 'const names = users.filter(u => u.active).map(u => u.name);',
    },
    {
      name: 'Remove one item by id',
      desc: 'The non-mutating alternative to splice.',
      code: 'const rest = items.filter(i => i.id !== targetId);',
    },
  ],

  examples: [
    { title: 'Keep the big ones',  code: '[1, 2, 3, 4].filter(x => x > 2)', returns: '[3, 4]' },
    { title: 'Nothing passes',     code: '[1, 2, 3].filter(x => x > 99)',   returns: '[]' },
    { title: 'Empty in, empty out',code: '[].filter(x => x > 1)',           returns: '[]' },
    { title: 'Drop falsy values',  code: "[0, 1, '', 'a'].filter(Boolean)", returns: "[1, 'a']" },
    { title: 'Missing return',     code: '[1, 2, 3].filter(x => { x > 1 })',returns: '[]' },
    { title: 'Original untouched', code: 'const a = [1, 2, 3];\na.filter(x => x > 2);\na', returns: '[1, 2, 3]' },
  ],

  pitfalls: [
    {
      name: 'A braced callback with no return drops everything',
      desc: 'Without an explicit return the callback yields undefined, which is falsy, so every element fails the test. You get an empty array rather than an error — and an empty array looks like a legitimate result.',
      wrong: { label: 'No return', code: '[1, 2, 3].filter(x => { x > 1 })', output: '[]' },
      fix:   { label: 'Return it', code: '[1, 2, 3].filter(x => x > 1)', output: '[2, 3]' },
    },
    {
      name: 'It tests truthiness, not equality with true',
      desc: 'Any truthy value keeps the element, so a callback returning a string or a number works — usually helpfully, occasionally not. Returning 0 or an empty string silently drops the element.',
      wrong: { label: 'Falsy but meaningful', code: '[{n: 0}, {n: 1}].filter(o => o.n)', output: '[{ n: 1 }]  // the zero is gone' },
      fix:   { label: 'Be explicit',          code: '[{n: 0}, {n: 1}].filter(o => o.n !== undefined)', output: 'both kept' },
    },
    {
      name: 'filter cannot transform',
      desc: 'The elements come through unchanged — only which ones survive can differ. Returning a modified value from the callback changes nothing except whether the ORIGINAL element is kept.',
      wrong: { label: 'Transform ignored', code: '[1, 2].filter(x => x * 10)', output: '[1, 2]  // not [10, 20]' },
      fix:   { label: 'Use map',           code: '[1, 2].map(x => x * 10)', output: '[10, 20]' },
    },
    {
      name: 'Filtering for one item still gives an array',
      desc: 'Even a unique match comes back wrapped. Using the result directly where an object is expected quietly passes an array instead.',
      wrong: { label: 'Array, not object', code: 'users.filter(u => u.id === 1)', output: '[{...}]' },
      fix:   { label: 'Use find',          code: 'users.find(u => u.id === 1)', output: '{...} or undefined' },
    },
  ],

  when: {
    use: [
      'Narrowing an array to the elements that matter',
      'Removing falsy values with filter(Boolean)',
      'Non-mutating removal, as an alternative to splice',
    ],
    avoid: [
      'You want to change each element → map',
      'You want exactly one match → find',
      'You only need to know whether any match → some',
      'You are reducing to a single value → reduce',
    ],
  },

  notes: {
    complexity: 'O(n) — the callback runs once per element',
    return:     'A new array; the original is never modified',
    cpython:    'V8: Builtins-array-filter.tq — fast path for packed arrays',
    memory:     'Allocates a new array sized to the number of matches',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'Transform every element instead of selecting some' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'Collapse the array to a single value' },
    { name: 'Array.prototype.slice',  slug: 'array-slice',  when: 'Select by POSITION rather than by test' },
    { name: 'Array.prototype.splice', slug: 'array-splice', when: 'Remove elements by mutating in place' },
  ],

  faq: [
    {
      q: 'Why did filter return an empty array?',
      a: 'Almost always because the callback returns nothing. An arrow function with braces needs an explicit return — without it every element yields undefined, which is falsy, so nothing survives.',
      code: '[1, 2, 3].filter(x => { x > 1 })   // []\n[1, 2, 3].filter(x => x > 1)       // [2, 3]',
    },
    {
      q: 'How do I remove all falsy values?',
      a: 'Pass the Boolean constructor as the callback. It converts each element to a boolean, so 0, empty string, null, undefined and NaN are all dropped in one pass.',
      code: "[0, 1, '', 'a', null].filter(Boolean)\n// [1, 'a']",
    },
    {
      q: 'filter or find?',
      a: 'filter always returns an array, even for a single match. find returns the element itself, or undefined when nothing matches. If you expect exactly one result, find saves you an index.',
    },
  ],

  history: [
    { version: 'ES5', note: 'Array.prototype.filter standardised in 2009, having shipped in JavaScript 1.6 (2005).' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter',
    meta:  'Array.prototype.filter',
  },

};
