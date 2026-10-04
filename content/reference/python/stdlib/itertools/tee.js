// content/reference/python/stdlib/itertools/tee.js

export const meta = {
  slug:        'tee',
  name:        'itertools.tee',
  signature:   'itertools.tee(iterable, n=2)',
  blurb:       'Split one iterator into n independent iterators that each see every item — buffering whatever one has read and the others have not.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'itertools tee copy an iterator duplicate iterator iterate twice independent iterators split generator n must be >= 0 python tee memory',
};

export const method = {
  slug:      'tee',
  name:      'itertools.tee',
  signature: 'itertools.tee(iterable, n=2)',
  returns:   { type: 'tuple of iterators', desc: 'A tuple of n independent iterators over the same items.' },

  category:    'itertools function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'A generator can be read only once; tee lets several consumers read it. After calling tee, stop using the original iterator — the copies would miss whatever you take from it.',

  covers: ['tee'],

  cheat: {
    commonCall: 'a, b = tee(gen)',
    returns:    'two iterators over the same items',
    replaces:   'list(gen) when you only need a short look-ahead',
    watchOut:   'if one copy runs far ahead, tee stores everything in between',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null, desc: 'The source. Do not use it directly after tee().' },
    { name: 'n',        type: 'int',      required: false, default: '2',  desc: 'How many iterators to return; 0 gives an empty tuple, negative is a ValueError.' },
  ],

  modes: [
    {
      id: 'lookahead',
      label: 'independent copies',
      blurb: 'Advance one copy; the other still starts at the beginning.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' }],
      template: 'from itertools import tee\na, b = tee({$items})\nfirst = next(a, None)\nfirst, list(a), list(b)',
      cases: [
        { id: 'abc',   label: 'a, b, c', values: { items: 'a, b, c' } },
        { id: 'empty', label: 'empty',   values: { items: '' } },
      ],
    },
    {
      id: 'n',
      label: 'n copies',
      blurb: 'tee(iterable, n) returns a tuple of n iterators.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'how many copies',       input: 'number' },
      ],
      template: 'from itertools import tee\n[list(t) for t in tee({$items}, {$n})]',
      cases: [
        { id: 'three', label: 'n = 3',  values: { items: 'x, y', n: '3' } },
        { id: 'zero',  label: 'n = 0',  values: { items: 'x, y', n: '0' } },
        { id: 'neg',   label: 'n = -1', values: { items: 'x, y', n: '-1' } },
      ],
    },
  ],
  demoExplainer: 'The copies share one buffer: when a reads an item first, it is kept until b has read it too. next(a, None) returns None for an empty input instead of raising StopIteration. tee(items, 0) is an empty tuple, so the list comprehension is empty; n = -1 fails with "n must be >= 0".',

  patterns: [
    {
      name: 'Peek at the first item',
      desc: 'Look at one item without losing it for the main loop.',
      code: 'from itertools import tee\nrows, peek = tee(rows)\nfirst = next(peek, None)\nif first is not None:\n    process(rows)',
    },
    {
      name: 'Two passes over a generator, side by side',
      desc: 'Keep the copies close together to keep the buffer small.',
      code: 'from itertools import tee\nevens, odds = tee(numbers)\nevens = (x for x in evens if x % 2 == 0)\nodds = (x for x in odds if x % 2)',
    },
  ],

  examples: [
    { title: 'Two independent iterators', code: "from itertools import tee\na, b = tee('xyz')\nlist(a), list(b)",            returns: "(['x', 'y', 'z'], ['x', 'y', 'z'])" },
    { title: 'tee returns a tuple',       code: "from itertools import tee\nlen(tee('abc', 3))",                              returns: '3' },
    { title: 'n = 0',                     code: "from itertools import tee\ntee('abc', 0)",                                   returns: '()' },
    { title: 'Negative n',                code: "from itertools import tee\ntee('abc', -1)",                                  returns: 'ValueError: n must be >= 0' },
    { title: 'Neighbours with tee',       code: 'from itertools import tee\na, b = tee([1, 2, 3])\nnext(b)\nlist(zip(a, b))', returns: '[(1, 2), (2, 3)]' },
  ],

  pitfalls: [
    {
      name: 'Using the original iterator after tee',
      desc: 'Items taken from the source directly never reach the copies.',
      wrong: { label: 'read the source', code: 'from itertools import tee\nsource = iter([1, 2, 3])\na, b = tee(source)\nnext(source)\nlist(a)', output: '[2, 3]' },
      fix:   { label: 'read a copy',     code: 'from itertools import tee\nsource = iter([1, 2, 3])\na, b = tee(source)\nnext(b)\nlist(a)', output: '[1, 2, 3]' },
    },
    {
      name: 'Exhausting one copy before the other',
      desc: 'Then tee buffers EVERY item — list() would have been simpler and no worse.',
      wrong: { label: 'tee + full pass', code: 'from itertools import tee\na, b = tee(range(5))\ntotal = sum(a)\ncount = sum(1 for _ in b)\ntotal / count', output: '2.0' },
      fix:   { label: 'just a list',     code: 'values = list(range(5))\nsum(values) / len(values)', output: '2.0' },
    },
  ],

  when: {
    use: [
      'Several consumers reading one stream at roughly the same pace',
      'Look-ahead by a few items on a one-shot iterator',
    ],
    avoid: [
      'One consumer finishes before the next starts → list()',
      'Sequences (lists, tuples, strings) → just iterate them twice',
    ],
  },

  notes: {
    cpython:    'tee objects share a linked list of buffer blocks (teedataobject); items are freed once every copy has passed them',
    'Threads':  'the docs: tee iterators are not threadsafe — a RuntimeError may be raised when iterators from the same tee() call are used simultaneously',
    'Copies':   'tee() of a tee iterator is flattened: the new copies share the upstream buffer instead of adding another layer',
  },

  related: [
    { name: 'itertools.pairwise', slug: 'pairwise',  when: 'The neighbour pattern, built in (3.10+)' },
    { name: 'itertools.islice',   slug: 'islice',    when: 'Take a few items from one copy' },
    { name: 'next()',             slug: 'next',      when: 'Advance one copy by a single item', category: 'functions' },
    { name: 'list()',             slug: 'list',      when: 'The simpler choice when every item is needed twice', category: 'functions' },
    { name: 'itertools module',   slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I iterate over a generator twice in Python?',
      a: 'Either store it with list(gen) and iterate the list, or split it with a, b = itertools.tee(gen). tee only saves memory when the two copies are consumed side by side.',
    },
    {
      q: 'Can I keep using the original iterator after itertools.tee?',
      a: 'No. The tee iterators read from the original; anything you consume from it directly is skipped by all copies.',
    },
    {
      q: 'Is itertools.tee thread-safe?',
      a: 'The docs say tee iterators are not threadsafe. Protect them with a lock if several threads read them.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.tee',
    meta:  'itertools.tee',
  },
};
