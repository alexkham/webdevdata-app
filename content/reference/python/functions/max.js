// content/reference/python/functions/max.js

export const meta = {
  slug:        'max',
  name:        'max',
  signature:   'max(iterable, *, key=None, default=...)',
  blurb:       'Return the largest item of an iterable or of two or more arguments.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'max maximum largest biggest highest greatest',
};

export const method = {
  slug:      'max',
  name:      'max',
  signature: 'max(iterable, *, key=None, default=...)',
  returns:   { type: 'Any', desc: 'The largest item. Empty iterable raises ValueError unless default is given. Also callable as max(a, b, ...).' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The largest item of an iterable — or of several arguments — with an optional key function.',

  cheat: {
    commonCall: 'max(scores)',
    returns:    'the item itself, not its index',
    replaces:   'strings compare lexicographically: max([\'10\', \'9\']) is \'9\'',
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
    { id: 'single',  label: 'one item',      values: { items: 'solo' } },
    { id: 'empty',   label: 'empty',         values: { items: '' } },
  ],
  demoExplainer: 'The demo’s comma-separated items are strings, so comparison is lexicographic — that is why ’9’ beats ’10’. Pass key=int in real code for numeric strings. An empty iterable raises exactly Python’s error.',

  patterns: [
    {
      name: 'Largest by a computed key',
      desc: 'key gives you argmax behavior — the ITEM with the biggest key.',
      code: 'longest = max(words, key=len)\noldest  = max(users, key=lambda u: u.age)',
    },
    {
      name: 'Safe max of possibly-empty data',
      desc: 'default turns the empty-sequence error into a value.',
      code: 'best = max(scores, default=0)',
    },
    {
      name: 'Clamping a value',
      desc: 'The two-argument form pairs with min for range clamps.',
      code: 'clamped = max(lo, min(x, hi))',
    },
  ],

  examples: [
    { title: 'Max of an iterable',       code: 'max([3, 1, 4, 1, 5])',   returns: '5' },
    { title: 'Strings — lexicographic',  code: 'max(["10", "9", "2"])',  returns: "'9'" },
    { title: 'Two-argument form',        code: 'max(3, 7)',              returns: '7' },
    { title: 'Empty with default',       code: 'max([], default=0)',     returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Empty iterable raises',
      desc: 'Aggregating possibly-empty data needs the default keyword.',
      wrong: { label: 'Raises', code: 'max([])', output: 'ValueError: max() arg is an empty sequence' },
      fix:   { label: 'Fix', code: 'max([], default=0)', output: '0' },
    },
    {
      name: 'Digit strings compare as text',
      desc: 'Same trap as sorted — character order, not numeric order.',
      wrong: { label: 'Surprising', code: 'max(["10", "9"])', output: "'9'" },
      fix:   { label: 'Fix', code: 'max(["10", "9"], key=int)', output: "'10'" },
    },
    {
      name: 'max of a dict gives the largest KEY',
      desc: 'Iterating a dict yields keys — use key= or .items() for value-based max.',
      wrong: { label: 'Keys compared', code: 'max({"a": 3, "b": 1})', output: "'b'" },
      fix:   { label: 'Largest by value', code: 'max(d, key=d.get)', output: "'a'" },
    },
  ],

  when: {
    use: [
      'Largest item, or item with the largest key (argmax)',
      'Pairwise comparisons via the multi-argument form',
      'Clamping combined with min',
    ],
    avoid: [
      'Top-k items → heapq.nlargest',
      'Max under a condition → max(filter(...), default=...)',
      'Running maximum in a loop → track it yourself (one pass)',
    ],
  },

  notes: {
    complexity: 'O(n) — single pass',
    return:     'an item from the input (not a copy)',
    cpython:    'Python/bltinmodule.c :: builtin_max',
    memory:     'No allocation',
    threadSafe: 'Yes for the scan; the source should not mutate concurrently',
  },

  related: [
    { name: 'sorted',     slug: 'sorted',     when: 'Full ordering, not just the top' },
    { name: 'len',        slug: 'len',        when: 'Count instead of compare' },
    { name: 'list.index', slug: 'list-index', when: 'Where the max lives: lst.index(max(lst))' },
  ],

  faq: [
    {
      q: 'How do I get the index of the maximum?',
      a: 'Combine with index, or take the argmax over enumerate.',
      code: 'i = lst.index(max(lst))\n# or, one pass:\ni = max(range(len(lst)), key=lst.__getitem__)',
    },
    {
      q: 'What happens on ties?',
      a: 'The FIRST maximal item wins — max is stable in that sense.',
    },
    {
      q: 'Can I use max on mixed types?',
      a: 'Only if every pair is comparable. int vs str raises TypeError in Python 3.',
    },
  ],

  history: [
    { version: '3.4', note: 'The default keyword argument added.' },
    { version: '2.5', note: 'The key keyword argument added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#max',
    meta:  'max',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
