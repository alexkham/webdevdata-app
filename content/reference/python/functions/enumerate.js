// content/reference/python/functions/enumerate.js

export const meta = {
  slug:        'enumerate',
  name:        'enumerate',
  signature:   'enumerate(iterable, start=0)',
  blurb:       'Pair every item with a running index.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'enumerate index counter pair position numbered loop iteration for',
};

export const method = {
  slug:      'enumerate',
  name:      'enumerate',
  signature: 'enumerate(iterable, start=0)',
  returns:   { type: 'enumerate', desc: 'An iterator of (index, item) tuples. Lazy — nothing is computed until you iterate.' },

  category:    'Built-in function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Turn a plain iterable into an indexed one — without hand-managing a counter.',

  cheat: {
    commonCall: 'for i, x in enumerate(items):',
    returns:    'iterator of (index, item) — not a list',
    replaces:   'the manual `i = 0; ... i += 1` counter pattern',
    watchOut:   'lazy — wrap in list() to materialize',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null, desc: 'Any iterable — list, tuple, generator, string, dict (keys), file.' },
    { name: 'start',    type: 'int',      required: false, default: '0',  desc: 'First index value. Only affects the counter; the items are unchanged.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items',    input: 'csv' },
    { name: 'start', type: 'int',  hint: 'first index (empty = 0)',  input: 'number-or-none' },
  ],
  cases: [
    { id: 'basic',     label: 'basic',      values: { items: 'apple,pear,plum', start: '' } },
    { id: 'start-1',   label: 'start=1',    values: { items: 'apple,pear,plum', start: 1 } },
    { id: 'start-100', label: 'start=100',  values: { items: 'red,green,blue',  start: 100 } },
    { id: 'over-str',  label: 'over str',   values: { items: 'a,b,c,d,e',       start: '' } },
    { id: 'empty',     label: 'empty',      values: { items: '',                start: '' } },
  ],
  demoExplainer: 'enumerate returns an iterator — the demo materializes it as a list of (index, item) pairs so you can see the whole result. In real code you would iterate directly: `for i, x in enumerate(items):`. The start parameter only changes the counter; the items themselves are never modified.',

  patterns: [
    {
      name: 'Indexed loop with unpacking',
      desc: 'The idiomatic replacement for manual counters.',
      code: 'for i, item in enumerate(items):\n    print(i, item)',
    },
    {
      name: 'One-based numbering',
      desc: 'Human-readable lists start at 1, not 0.',
      code: 'for i, line in enumerate(lines, start=1):\n    print(f"{i}. {line}")',
    },
    {
      name: 'Item → position map',
      desc: 'Comprehension over enumerate builds a lookup table in one pass.',
      code: 'positions = {item: i for i, item in enumerate(items)}',
    },
  ],

  examples: [
    { title: 'Basic indexing',    code: 'list(enumerate(["a", "b", "c"]))',       returns: '[(0, "a"), (1, "b"), (2, "c")]' },
    { title: 'Custom start',      code: 'list(enumerate(["a", "b"], start=10))',  returns: '[(10, "a"), (11, "b")]' },
    { title: 'Over a string',     code: 'list(enumerate("abc"))',                 returns: '[(0, "a"), (1, "b"), (2, "c")]' },
    { title: 'Empty is empty',    code: 'list(enumerate([]))',                    returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'Iterator exhausts after one pass',
      desc: 'enumerate returns an iterator, not a list. Loop through it twice and the second loop sees nothing.',
      wrong: { label: 'Empty on reuse', code: 'e = enumerate(items)\nlist(e)  # [(0, "a"), (1, "b")]\nlist(e)  # []', output: 'second list() is empty' },
      fix:   { label: 'Materialize once', code: 'pairs = list(enumerate(items))\n# reuse pairs freely', output: 'reusable list' },
    },
    {
      name: 'start does not skip items',
      desc: 'start changes the counter, not the input. All items still appear.',
      wrong: { label: 'Misuse',       code: 'list(enumerate(["a","b","c"], start=2))', output: '[(2, "a"), (3, "b"), (4, "c")]' },
      fix:   { label: 'Actually skip', code: 'list(enumerate(["a","b","c"][2:]))',      output: '[(0, "c")]' },
    },
    {
      name: 'Forgetting to unpack the pair',
      desc: 'Without unpacking, the loop variable is the whole tuple.',
      wrong: { label: 'Tuple leak', code: 'for x in enumerate(items):\n    print(x)',       output: '(0, "a"), (1, "b"), ...' },
      fix:   { label: 'Unpack',     code: 'for i, x in enumerate(items):\n    print(i, x)', output: '0 a, 1 b, ...' },
    },
  ],

  when: {
    use: [
      'Anywhere you need both the item and its index',
      'One-based numbering for humans (start=1)',
      'Building position lookup tables',
      'Iterables without len() — generators, files',
    ],
    avoid: [
      'Just the items → iterate directly',
      'Just indices → range(len(items))',
      'Parallel iteration over multiple iterables → zip',
    ],
  },

  notes: {
    complexity: 'O(1) per step',
    return:     'enumerate object (iterator), not list',
    cpython:    'Python/bltinmodule.c :: enum_next — a tiny generator over the source iterator',
    memory:     'O(1) — one running counter, no buffering',
    threadSafe: 'The counter is safe; the source iterator is only as safe as its type',
  },

  related: [
    { name: 'zip',    slug: 'zip',    when: 'Pair items from two or more iterables' },
    { name: 'sorted', slug: 'sorted', when: 'Order first, then enumerate' },
    { name: 'len',    slug: 'len',    when: 'When you truly only need the count' },
  ],

  faq: [
    {
      q: 'Why not just use range(len(items))?',
      a: 'It works, but you then have to index items[i] every step. enumerate gives you both at once, and works on any iterable — including ones without a len (generators, files, network streams).',
    },
    {
      q: 'Can start be negative?',
      a: 'Yes. start accepts any integer, including negatives.',
      code: 'list(enumerate(["a","b"], start=-1))\n# [(-1, "a"), (0, "b")]',
    },
    {
      q: 'Does enumerate consume the source?',
      a: 'It consumes as you iterate. If the source is itself an iterator (like a generator), enumerate pulls from it and you cannot rewind.',
    },
  ],

  history: [
    { version: '2.3', note: 'enumerate() introduced.' },
    { version: '2.6', note: 'start keyword argument added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#enumerate',
    meta:  'enumerate',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the resulting pairs' },
  ],
};