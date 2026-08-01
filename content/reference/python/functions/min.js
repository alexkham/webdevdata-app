// content/reference/python/functions/min.js

export const meta = {
  slug:        'min',
  name:        'min',
  signature:   'min(iterable, *, key=None, default=...)',
  blurb:       'Return the smallest item of an iterable or of two or more arguments.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'min minimum smallest lowest least',
};

export const method = {
  slug:      'min',
  name:      'min',
  signature: 'min(iterable, *, key=None, default=...)',
  returns:   { type: 'Any', desc: 'The smallest item. Empty iterable raises ValueError unless default is given. Also callable as min(a, b, ...).' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The smallest item of an iterable — max’s mirror, same options, same traps.',

  cheat: {
    commonCall: 'min(prices)',
    returns:    'the item itself, not its index',
    replaces:   'strings compare lexicographically: min([\'10\', \'2\']) is \'10\'',
    watchOut:   'empty iterable raises ValueError — pass default= to survive it',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null,     desc: 'The items to compare. Alternatively pass two or more positional arguments.' },
    { name: 'key',      type: 'callable', required: false, default: 'None',   desc: 'One-argument function computing the comparison key, e.g. key=len.' },
    { name: 'default',  type: 'Any',      required: false, default: '(none)', desc: 'Returned when the iterable is empty. Without it, empty raises ValueError.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'default', label: 'default',       values: { items: 'banana,apple,cherry' } },
    { id: 'digits',  label: 'digit strings', values: { items: '10,9,2' } },
    { id: 'empty',   label: 'empty',         values: { items: '' } },
  ],
  demoExplainer: 'Items are strings here, so comparison is lexicographic — ’10’ beats ’2’ because ’1’ < ’2’. Use key=int in real code for numeric strings. Empty input raises Python’s exact error.',

  patterns: [
    {
      name: 'Smallest by a computed key',
      desc: 'argmin behavior — the ITEM with the smallest key.',
      code: 'cheapest = min(products, key=lambda p: p.price)',
    },
    {
      name: 'Safe min of possibly-empty data',
      desc: 'default turns the empty-sequence error into a value.',
      code: 'lowest = min(scores, default=0)',
    },
    {
      name: 'Clamping a value',
      desc: 'min caps the top, max lifts the bottom.',
      code: 'clamped = max(lo, min(x, hi))',
    },
  ],

  examples: [
    { title: 'Min of an iterable',      code: 'min([3, 1, 4, 1, 5])',  returns: '1' },
    { title: 'Strings — lexicographic', code: 'min(["10", "9", "2"])', returns: "'10'" },
    { title: 'Two-argument form',       code: 'min(3, 7)',             returns: '3' },
    { title: 'Empty with default',      code: 'min([], default=0)',    returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Empty iterable raises',
      desc: 'Same trap as max — pass default when data can be empty.',
      wrong: { label: 'Raises', code: 'min([])', output: 'ValueError: min() arg is an empty sequence' },
      fix:   { label: 'Fix', code: 'min([], default=0)', output: '0' },
    },
    {
      name: 'Digit strings compare as text',
      desc: '"10" < "2" lexicographically.',
      wrong: { label: 'Surprising', code: 'min(["10", "9"])', output: "'10'" },
      fix:   { label: 'Numeric', code: 'min(["10", "9"], key=int)', output: "'9'" },
    },
  ],

  when: {
    use: [
      'Smallest item, or item with the smallest key (argmin)',
      'Pairwise comparisons via the multi-argument form',
      'Clamping combined with max',
    ],
    avoid: [
      'Bottom-k items → heapq.nsmallest',
      'Running minimum in a loop → track it yourself',
    ],
  },

  notes: {
    complexity: 'O(n) — single pass',
    return:     'an item from the input (not a copy)',
    cpython:    'Python/bltinmodule.c :: builtin_min',
    memory:     'No allocation',
    threadSafe: 'Yes for the scan; the source should not mutate concurrently',
  },

  related: [
    { name: 'max',    slug: 'max',    when: 'The other extreme' },
    { name: 'sorted', slug: 'sorted', when: 'Full ordering' },
    { name: 'sum',    slug: 'sum',    when: 'Aggregate instead of compare' },
  ],

  faq: [
    {
      q: 'How do I get both min and max in one pass?',
      a: 'There is no built-in; a manual loop or sorted()[0] / [-1] (two passes hidden in one sort) are the options. For big data, loop once.',
    },
    {
      q: 'What happens on ties?',
      a: 'The FIRST minimal item wins.',
    },
  ],

  history: [
    { version: '3.4', note: 'The default keyword argument added.' },
    { version: '2.5', note: 'The key keyword argument added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#min',
    meta:  'min',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
