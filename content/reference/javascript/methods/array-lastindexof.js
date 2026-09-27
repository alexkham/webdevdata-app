// content/reference/javascript/methods/array-lastindexof.js

export const meta = {
  slug:        'array-lastindexof',
  name:        'Array.prototype.lastIndexOf',
  signature:   'array.lastIndexOf(searchElement[, fromIndex])',
  blurb:       'indexOf from the right — the LAST match, or -1.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array lastIndexOf last occurrence search from right reverse minus one NaN javascript',
};

export const method = {
  slug:      'array-lastindexof',
  name:      'Array.prototype.lastIndexOf',
  signature: 'array.lastIndexOf(searchElement[, fromIndex])',
  returns:   { type: 'number', desc: 'Index of the LAST strictly-equal element, or -1. The index still counts from the left.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The mirror of indexOf, and it inherits every one of its quirks: strict equality, no coercion, -1 for absent, and NaN can never be found.',

  cheat: {
    commonCall: 'items.lastIndexOf(value)',
    returns:    'number — the last index, or -1',
    replaces:   'a reversed scan with manual index arithmetic',
    watchOut:   'the search runs backwards; the index does not',
  },

  parameters: [
    { name: 'searchElement', type: 'any',    required: true,  default: null, desc: 'Value to locate, compared with strict equality (===).' },
    { name: 'fromIndex',     type: 'number', required: false, default: 'length - 1', desc: 'Index to start searching BACKWARDS from. Negative counts from the end.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'value', type: 'number',   hint: 'value to locate',          input: 'number' },
  ],
  demoTemplate: '{items}.lastIndexOf({value})',
  cases: [
    { id: 'last',    label: 'last of two',    values: { items: '1,2,1',   value: 1 } },
    { id: 'single',  label: 'single match',   values: { items: '1,2,3',   value: 2 } },
    { id: 'missing', label: 'absent → -1',    values: { items: '1,2,3',   value: 99 } },
    { id: 'end',     label: 'at the end',     values: { items: '1,2,3',   value: 3 } },
    { id: 'empty',   label: 'empty array',    values: { items: '',        value: 1 } },
  ],
  demoExplainer: 'With duplicates you get the LAST one — in [1, 2, 1] searching for 1 gives index 2, where indexOf would give 0. Only the scan direction changes: the number returned is still an ordinary left-counted index you can use directly. Absent values give -1, exactly as with indexOf, and the same truthiness trap applies.',

  patterns: [
    {
      name: 'Find the most recent occurrence',
      desc: 'Where the array is append-ordered, the last match is the newest.',
      code: 'const i = events.lastIndexOf(marker);',
    },
    {
      name: 'Walk matches backwards',
      desc: 'fromIndex moves the search window left.',
      code: 'let i = items.lastIndexOf(v);\nwhile (i !== -1) {\n  found.push(i);\n  i = items.lastIndexOf(v, i - 1);\n}',
    },
    {
      name: 'Prefer findLastIndex for predicates',
      desc: 'lastIndexOf only compares values.',
      code: 'items.findLastIndex(x => x.ok);',
    },
  ],

  examples: [
    { title: 'Last of two',      code: '[1, 2, 1].lastIndexOf(1)',   returns: '2' },
    { title: 'indexOf differs',  code: '[1, 2, 1].indexOf(1)',       returns: '0' },
    { title: 'Absent',           code: '[1, 2, 3].lastIndexOf(99)',  returns: '-1' },
    { title: 'NaN never found',  code: '[NaN].lastIndexOf(NaN)',     returns: '-1' },
    { title: 'includes can',     code: '[NaN].includes(NaN)',        returns: 'true' },
    { title: 'Empty array',      code: '[].lastIndexOf(1)',          returns: '-1' },
  ],

  pitfalls: [
    {
      name: '-1 is truthy',
      desc: 'Identical to indexOf. Testing the result directly is inverted: absent gives -1 which passes an if, and a match at index 0 gives 0 which fails.',
      wrong: { label: 'Backwards', code: 'if (items.lastIndexOf(x)) { ... }', output: 'true when ABSENT' },
      fix:   { label: 'Compare explicitly', code: 'if (items.lastIndexOf(x) !== -1) { ... }', output: 'correct' },
    },
    {
      name: 'It can never find NaN',
      desc: 'Strict equality again — NaN is not equal to itself, so no value-based search can match it. There is no lastIncludes, so you need findLastIndex with Number.isNaN.',
      wrong: { label: 'Not found', code: '[NaN].lastIndexOf(NaN)', output: '-1' },
      fix:   { label: 'Use a predicate', code: '[NaN].findLastIndex(Number.isNaN)', output: '0' },
    },
    {
      name: 'fromIndex counts from the left',
      desc: 'Even though the scan runs right-to-left, fromIndex is an ordinary index — it is where the search STARTS, and everything to its right is ignored.',
      wrong: { label: 'Not a count', code: '[1, 2, 1].lastIndexOf(1, 1)', output: '0  // searched indices 0..1 only' },
      fix:   { label: 'Full search', code: '[1, 2, 1].lastIndexOf(1)', output: '2' },
    },
  ],

  when: {
    use: [
      'Finding the most recent occurrence in an append-ordered array',
      'Walking duplicate matches from the end backwards',
    ],
    avoid: [
      'You need a predicate → findLastIndex',
      'The value might be NaN → findLastIndex with Number.isNaN',
      'You want the FIRST match → indexOf',
      'You only need presence → includes',
    ],
  },

  notes: {
    complexity: 'O(n) — a linear scan from the right, stopping at the first match',
    return:     'A number; -1 means absent, and -1 is truthy',
    cpython:    'V8: Builtins-array-lastindexof.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.indexOf',  slug: 'array-indexof',  when: 'The FIRST match instead' },
    { name: 'Array.prototype.findLast', slug: 'array-findlast', when: 'Search from the end with a predicate' },
    { name: 'Array.prototype.includes', slug: 'array-includes', when: 'Presence only, and it handles NaN' },
    { name: 'Array.prototype.at',       slug: 'array-at',       when: 'Read from the end by position' },
  ],

  faq: [
    {
      q: 'Is there a lastIncludes?',
      a: 'No. includes has no reverse counterpart, because a membership test does not depend on direction. If you need NaN handling from the end, use findLastIndex with Number.isNaN.',
      code: 'items.findLastIndex(Number.isNaN)',
    },
    {
      q: 'Does fromIndex count backwards?',
      a: 'No — it is an ordinary left-counted index marking where the backwards scan begins. Everything to its right is excluded from the search.',
      code: '[1, 2, 1].lastIndexOf(1, 1)   // 0',
    },
    {
      q: 'lastIndexOf or findLastIndex?',
      a: 'lastIndexOf compares a VALUE with strict equality. findLastIndex runs a predicate, so it handles objects, ranges and NaN. For anything beyond a plain primitive, findLastIndex is the one that works.',
    },
  ],

  history: [
    { version: 'ES5', note: 'lastIndexOf standardised in 2009 alongside indexOf.' },
    { version: 'ES2023', note: 'findLast and findLastIndex added, covering predicate-based searching from the end.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf',
    meta:  'Array.prototype.lastIndexOf',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
