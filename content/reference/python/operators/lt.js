// content/reference/python/operators/lt.js

export const meta = {
  slug:        'lt',
  name:        '<',
  signature:   'a < b',
  blurb:       'Less than — strict ordering, raises on unrelated types.',
  category:    'comparison',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'less than smaller ordering compare chain operator',
};

export const method = {
  slug:      'lt',
  name:      '<',
  signature: 'a < b',
  returns:   { type: 'bool', desc: 'True when a orders strictly before b. Unrelated types raise TypeError in Python 3.' },

  category:    'Comparison operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Strict ordering — with chaining: lo < x < hi reads exactly as written.',

  cheat: {
    commonCall: 'if age < 18:',
    returns:    'bool',
    replaces:   'chains: 0 < x < 10 means 0 < x and x < 10',
    watchOut:   'int < str raises TypeError (Python 3 change)',
  },

  parameters: [
    { name: 'a', type: 'comparable', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'comparable', required: true, default: null, desc: 'Right operand — must be orderable against a.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right', input: 'float' },
  ],
  demoTemplate: '{a} < {b}',
  cases: [
    { id: 'default', label: 'less',    values: { a: 3, b: 5 } },
    { id: 'no',      label: 'greater', values: { a: 5, b: 3 } },
    { id: 'equal',   label: 'equal',   values: { a: 5, b: 5 } },
  ],
  demoExplainer: 'Strictly less — equal operands give False. Strings order lexicographically and sequences element-by-element in real Python; numbers here.',

  patterns: [
    {
      name: 'Chained range checks',
      desc: 'Python evaluates chains as AND of adjacent pairs.',
      code: 'if 0 <= index < len(items):\n    return items[index]',
    },
    {
      name: 'Lexicographic sequence comparison',
      desc: 'Tuples/lists compare element-by-element, first difference wins.',
      code: '(1, "b") < (1, "c")   # True\n[1, 2] < [1, 2, 0]     # True — shorter is less',
    },
  ],

  examples: [
    { title: 'Numbers',            code: '3 < 5',           returns: 'True' },
    { title: 'Chained',            code: '0 < 5 < 10',      returns: 'True' },
    { title: 'Strings — lexicographic', code: '"apple" < "banana"', returns: 'True' },
    { title: 'Mixed types raise',  code: '1 < "2"',         returns: "TypeError: '<' not supported between instances of 'int' and 'str'" },
  ],

  pitfalls: [
    {
      name: 'Mixed types raise in Python 3',
      desc: 'Python 2 silently ordered by type name — Python 3 refuses.',
      wrong: { label: 'Raises', code: '1 < "2"', output: "TypeError: '<' not supported between instances of 'int' and 'str'" },
      fix:   { label: 'Convert first', code: '1 < int("2")', output: 'True' },
    },
    {
      name: 'Uppercase orders before lowercase',
      desc: 'String ordering is by code point — "Z" < "a".',
      wrong: { label: 'Surprising', code: '"Zebra" < "apple"', output: 'True' },
      fix:   { label: 'Case-insensitive', code: '"Zebra".lower() < "apple".lower()', output: 'False' },
    },
    {
      name: 'Chaining evaluates each operand once — but reads as pairs',
      desc: 'a < b < c is NOT (a < b) < c.',
      wrong: { label: 'C-style reading', code: '(0 < 5) < 3   # True < 3 → 1 < 3', output: 'True — nonsense comparison' },
      fix:   { label: 'Python chains', code: '0 < 5 < 3', output: 'False — as intended' },
    },
  ],

  when: {
    use: [
      'Ordering checks; chained ranges (lo <= x < hi)',
      'Sorting-related predicates',
    ],
    avoid: [
      'Mixed types → normalize first',
      'Case-insensitive string order → compare .lower()/casefold()',
    ],
  },

  notes: {
    complexity: 'O(1) numbers; O(n) sequences',
    return:     'bool',
    cpython:    'Objects/object.c :: PyObject_RichCompare (Py_LT) → __lt__',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable operands',
  },

  related: [
    { name: '<=',     slug: 'le',     when: 'Inclusive bound' },
    { name: '>',      slug: 'gt',     when: 'The other direction' },
    { name: 'sorted', slug: 'sorted', when: 'Ordering entire iterables', category: 'functions' },
  ],

  faq: [
    {
      q: 'How does sorting relate to < ?',
      a: 'sorted() and list.sort() use __lt__ exclusively — implement it (plus functools.total_ordering for the rest) to make a class sortable.',
    },
    {
      q: 'How are lists compared?',
      a: 'Element by element; the first unequal pair decides. If one is a prefix of the other, the shorter is less.',
    },
  ],

  history: [
    { version: '3.0', note: 'Cross-type ordering (1 < "2") now raises instead of ordering by type name.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#comparisons',
    meta:  'comparisons',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Compare data structures' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
