// content/reference/javascript/methods/array-at.js

export const meta = {
  slug:        'array-at',
  name:        'Array.prototype.at',
  signature:   'array.at(index)',
  blurb:       'Read by index, including NEGATIVE ones — arr[-1] does not work, arr.at(-1) does.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2022',
  searchTerms: 'array at negative index last element bracket notation es2022 javascript',
};

export const method = {
  slug:      'array-at',
  name:      'Array.prototype.at',
  signature: 'array.at(index)',
  returns:   { type: 'any', desc: 'The element at the index, counting from the end when the index is negative. undefined when the index is out of range.' },

  category:    'Array method',
  version:     'ES2022',
  hasLiveDemo: true,

  subtitle: 'Exists for one reason: bracket notation cannot do negative indices. arr[-1] looks up a PROPERTY named "-1" and quietly gives undefined.',

  cheat: {
    commonCall: 'items.at(-1)',
    returns:    'the element, or undefined when out of range',
    replaces:   'items[items.length - 1]',
    watchOut:   'out of range gives undefined, not an error',
  },

  parameters: [
    { name: 'index', type: 'number', required: true, default: null, desc: 'Position to read. Negative counts from the end, so -1 is the last element. A fractional index is truncated toward zero.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'index', type: 'number',   hint: 'index (try -1)',           input: 'number' },
  ],
  demoTemplate: '{items}.at({index})',
  cases: [
    { id: 'last',    label: 'last element (-1)', values: { items: '1,2,3,4', index: -1 } },
    { id: 'first',   label: 'first element (0)', values: { items: '1,2,3,4', index: 0 } },
    { id: 'second',  label: 'second from end',   values: { items: '1,2,3,4', index: -2 } },
    { id: 'outside', label: 'out of range',      values: { items: '1,2,3',   index: 99 } },
    { id: 'empty',   label: 'empty array',       values: { items: '',        index: 0 } },
  ],
  demoExplainer: 'Positive indices behave exactly like bracket notation. Negative indices are the point: -1 is the last element, -2 the one before it, and so on. An index outside the array in either direction gives undefined rather than throwing, which is the same behaviour bracket notation has — so at() changes what you can express, not how failure is reported.',

  patterns: [
    {
      name: 'Take the last element',
      desc: 'The reason the method was added.',
      code: 'const last = items.at(-1);',
    },
    {
      name: 'Read from the end without arithmetic',
      desc: 'Replaces the length-minus-n idiom.',
      code: 'const secondLast = items.at(-2);',
    },
    {
      name: 'Works on strings too',
      desc: 'String.prototype.at has the same signature.',
      code: "const lastChar = 'hello'.at(-1);",
    },
  ],

  examples: [
    { title: 'Last element',   code: '[1, 2, 3].at(-1)',        returns: '3' },
    { title: 'First element',  code: '[1, 2, 3].at(0)',         returns: '1' },
    { title: 'Bracket fails',  code: '[1, 2, 3][-1]',           returns: 'undefined' },
    { title: 'Out of range',   code: '[1, 2, 3].at(99)',        returns: 'undefined' },
    { title: 'The old idiom',  code: 'const a = [1, 2, 3];\na[a.length - 1]', returns: '3' },
    { title: 'Strings too',    code: "'hello'.at(-1)",          returns: "'o'" },
  ],

  pitfalls: [
    {
      name: 'arr[-1] is not an error, it is undefined',
      desc: 'Bracket notation treats -1 as a property NAME, not an index — and the property does not exist, so you get undefined. Nothing throws, so the bug reaches production as a missing value rather than a crash.',
      wrong: { label: 'Silently undefined', code: '[1, 2, 3][-1]', output: 'undefined' },
      fix:   { label: 'Use at()',           code: '[1, 2, 3].at(-1)', output: '3' },
    },
    {
      name: 'Out of range gives undefined, not an error',
      desc: 'Like bracket notation, at() never throws for a bad index. Chaining a property access straight onto the result is what actually fails, one line later.',
      wrong: { label: 'Fails downstream', code: 'items.at(99).name', output: "TypeError: Cannot read properties of undefined" },
      fix:   { label: 'Optional chaining', code: 'items.at(99)?.name', output: 'undefined' },
    },
    {
      name: 'ES2022 and newer only',
      desc: 'Not available in older runtimes. The portable equivalent is the length-minus-n idiom, which is why so much existing code still uses it.',
      wrong: { label: 'Missing method', code: 'items.at(-1)', output: 'TypeError: items.at is not a function' },
      fix:   { label: 'Old idiom',      code: 'items[items.length - 1]', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Reading the last or second-to-last element',
      'Any index computed relative to the end',
      'Replacing the arr[arr.length - 1] idiom for readability',
    ],
    avoid: [
      'Plain forward indexing → bracket notation is shorter',
      'Runtimes older than ES2022 → arr[arr.length - 1]',
      'You want to WRITE to the position → at() is read-only',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'The element or undefined; the array is never modified',
    cpython:    'V8: Builtins-array-at.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.slice',   slug: 'array-slice',   when: 'A negative RANGE rather than a single index' },
    { name: 'Array.prototype.indexOf', slug: 'array-indexof', when: 'Find a position rather than read one' },
    { name: 'Array.prototype.find',    slug: 'array-find',    when: 'Locate by a predicate' },
    { name: 'Array.prototype.reverse', slug: 'array-reverse', when: 'Reading from the end without reversing the data' },
  ],

  faq: [
    {
      q: 'Why does arr[-1] not work?',
      a: 'Because arrays are objects and bracket notation with -1 looks up a property literally named "-1". No such property exists, so you get undefined rather than the last element. at() interprets the number as an index and counts from the end.',
      code: '[1, 2, 3][-1]     // undefined\n[1, 2, 3].at(-1)  // 3',
    },
    {
      q: 'Can I assign with at()?',
      a: 'No — it is read-only. To write to a position relative to the end you still need the arithmetic form, or splice.',
      code: 'items[items.length - 1] = value;',
    },
    {
      q: 'Does at() work on strings?',
      a: 'Yes. String.prototype.at was added at the same time with the same semantics, so "hello".at(-1) gives the last character. Typed arrays have it too.',
      code: "'hello'.at(-1)   // 'o'",
    },
  ],

  history: [
    { version: 'ES2022', note: 'at() added to Array, String and the typed arrays, specifically to support negative indexing.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at',
    meta:  'Array.prototype.at',
  },

};
