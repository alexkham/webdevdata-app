// content/reference/javascript/methods/array-slice.js

export const meta = {
  slug:        'array-slice',
  name:        'Array.prototype.slice',
  signature:   'array.slice([start[, end]])',
  blurb:       'Copy a range into a NEW array — end is exclusive, negatives count from the back.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'array slice copy range subarray portion negative index shallow copy non-mutating javascript',
};

export const method = {
  slug:      'array-slice',
  name:      'Array.prototype.slice',
  signature: 'array.slice([start[, end]])',
  returns:   { type: 'Array', desc: 'A NEW array holding elements from start up to but NOT including end. The original is never modified.' },

  category:    'Array method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The non-mutating twin of splice, and one letter away from it. slice COPIES a range out; splice CUTS one out. Confusing them is the single most common Array mistake after sort.',

  cheat: {
    commonCall: 'items.slice(0, 3)',
    returns:    'a new array; the original is untouched',
    replaces:   '[...items] for a shallow copy — slice() with no args does it',
    watchOut:   'end is EXCLUSIVE, and the copy is SHALLOW',
  },

  parameters: [
    { name: 'start', type: 'number', required: false, default: '0', desc: 'Index to start at. Negative counts from the end, so -2 means "two from the back". Beyond the length gives an empty array.' },
    { name: 'end',   type: 'number', required: false, default: 'length', desc: 'Index to stop BEFORE — the element at this index is not included. Negative counts from the end.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'start', type: 'number',   hint: 'start index',              input: 'number' },
    { name: 'end',   type: 'number',   hint: 'end index (exclusive)',    input: 'number' },
  ],
  demoTemplate: '{items}.slice({start}, {end})',
  cases: [
    { id: 'middle',   label: 'middle range',    values: { items: '1,2,3,4,5', start: 1, end: 3 } },
    { id: 'negative', label: 'negative start',  values: { items: '1,2,3,4,5', start: -2, end: 5 } },
    { id: 'empty',    label: 'start === end',   values: { items: '1,2,3,4,5', start: 0, end: 0 } },
    { id: 'backwards',label: 'end before start',values: { items: '1,2,3,4,5', start: 3, end: 1 } },
    { id: 'past',     label: 'end past the end',values: { items: '1,2,3',     start: 0, end: 99 } },
  ],
  demoExplainer: 'slice(1, 3) gives you elements 1 and 2 — the element at index 3 is excluded, which is why the result has exactly end minus start elements. A negative start counts from the back, so -2 takes the last two. The two degenerate cases return empty rather than erroring: start equal to end selects nothing, and an end BEFORE the start also gives an empty array instead of reversing. An end past the array simply stops at the end.',

  patterns: [
    {
      name: 'Shallow-copy an array',
      desc: 'The classic idiom, now usually written as a spread.',
      code: 'const copy = items.slice();\nconst copy2 = [...items];',
    },
    {
      name: 'Copy before a mutating method',
      desc: 'Protects the original from sort, reverse or splice.',
      code: 'const sorted = items.slice().sort((a, b) => a - b);',
    },
    {
      name: 'Take the last N elements',
      desc: 'A negative start is the tidy way.',
      code: 'const lastThree = items.slice(-3);',
    },
  ],

  examples: [
    { title: 'Middle range',     code: '[1, 2, 3, 4, 5].slice(1, 3)',  returns: '[2, 3]' },
    { title: 'Last two',         code: '[1, 2, 3, 4, 5].slice(-2)',    returns: '[4, 5]' },
    { title: 'Backwards is empty',code: '[1, 2, 3, 4, 5].slice(3, 1)', returns: '[]' },
    { title: 'Past the end',     code: '[1, 2, 3].slice(0, 99)',       returns: '[1, 2, 3]' },
    { title: 'Full copy',        code: '[1, 2, 3].slice()',            returns: '[1, 2, 3]' },
    { title: 'Original untouched',code: 'const a = [1, 2, 3];\na.slice(0, 1);\na', returns: '[1, 2, 3]' },
  ],

  pitfalls: [
    {
      name: 'slice and splice are one letter apart and opposite',
      desc: 'slice returns a copy and leaves the original alone; splice mutates the original and returns what it REMOVED. A typo between them compiles fine and corrupts your data quietly.',
      wrong: { label: 'splice mutates', code: 'const a = [1, 2, 3];\nconst b = a.splice(0, 2);\na', output: '[3]  // a was gutted' },
      fix:   { label: 'slice copies',   code: 'const a = [1, 2, 3];\nconst b = a.slice(0, 2);\na', output: '[1, 2, 3]' },
    },
    {
      name: 'end is exclusive',
      desc: 'slice(0, 3) gives three elements, indices 0 through 2. Expecting the element at end to be included is an off-by-one that shows up as a missing last item.',
      wrong: { label: 'Missing the last', code: '[1, 2, 3, 4].slice(0, 2)', output: '[1, 2]  // not [1, 2, 3]' },
      fix:   { label: 'Go one further',   code: '[1, 2, 3, 4].slice(0, 3)', output: '[1, 2, 3]' },
    },
    {
      name: 'The copy is shallow',
      desc: 'A new outer array, but the SAME inner objects. Mutating a nested object through the copy changes it in the original too — a frequent surprise when "I copied it first".',
      wrong: { label: 'Shared objects', code: 'const a = [{n: 1}];\nconst b = a.slice();\nb[0].n = 99;\na[0].n', output: '99' },
      fix:   { label: 'Deep copy',      code: 'const b = structuredClone(a);', output: 'fully independent' },
    },
    {
      name: 'A backwards range gives empty, not reversed',
      desc: 'slice(3, 1) does not reverse anything — it returns an empty array. Computing indices that can cross over therefore fails silently rather than loudly.',
      wrong: { label: 'Silently empty', code: '[1, 2, 3, 4].slice(3, 1)', output: '[]' },
      fix:   { label: 'Order them',     code: '[1, 2, 3, 4].slice(Math.min(a, b), Math.max(a, b))', output: 'the intended range' },
    },
  ],

  when: {
    use: [
      'Copying part of an array without touching the original',
      'Shallow-copying a whole array',
      'Taking the first or last N elements',
      'Guarding an array before a mutating method like sort',
    ],
    avoid: [
      'You want to REMOVE elements → splice, or filter for a copy',
      'You need independent nested objects → structuredClone',
      'Selecting by a test rather than by position → filter',
    ],
  },

  notes: {
    complexity: 'O(n) in the size of the slice',
    return:     'A new array; the original is never modified',
    cpython:    'V8: Builtins-array-slice.tq — fast path for packed arrays',
    memory:     'Allocates a new array holding references to the same elements',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.splice', slug: 'array-splice', when: 'Remove or insert IN PLACE instead of copying' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Select by a test rather than by position' },
    { name: 'Array.prototype.sort',   slug: 'array-sort',   when: 'slice() first to avoid sorting in place' },
    { name: 'Array.prototype.flat',   slug: 'array-flat',   when: 'Flatten nested arrays rather than range-copy' },
  ],

  faq: [
    {
      q: 'What is the difference between slice and splice?',
      a: 'slice copies a range into a new array and leaves the original alone. splice removes (and optionally inserts) elements IN the original, and returns the removed ones. One letter, opposite effects on your data.',
      code: 'const a = [1, 2, 3];\na.slice(0, 2);   // [1, 2], a unchanged\na.splice(0, 2);  // [1, 2], a is now [3]',
    },
    {
      q: 'Is slice() still the way to copy an array?',
      a: 'It works and is fast, but [...items] reads better in modern code and does the same shallow copy. Both share nested objects with the original — reach for structuredClone if you need real independence.',
      code: 'const copy = [...items];',
    },
    {
      q: 'How do I take the last N elements?',
      a: 'A negative start counts from the end, so slice(-3) gives the last three. It is safe on short arrays too: slice(-10) on a three-element array just returns all three.',
      code: 'items.slice(-3)',
    },
  ],

  history: [
    { version: 'ES3', note: 'slice standardised in 1999, mirroring String.prototype.slice.' },
    { version: 'ES2015', note: 'Spread syntax gave [...items] as a more readable shallow copy.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice',
    meta:  'Array.prototype.slice',
  },

};
