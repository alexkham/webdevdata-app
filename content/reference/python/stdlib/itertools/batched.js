// content/reference/python/stdlib/itertools/batched.js

export const meta = {
  slug:        'batched',
  name:        'itertools.batched',
  signature:   'itertools.batched(iterable, n, *, strict=False)',
  blurb:       'Split any iterable into tuples of n items — the last batch may be shorter (or an error, with strict=True). New in Python 3.12.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.12+',
  searchTerms: 'itertools batched chunk list into chunks split list into groups of n batches python 3.12 strict incomplete batch chunked grouper n must be at least one',
};

export const method = {
  slug:      'batched',
  name:      'itertools.batched',
  signature: 'itertools.batched(iterable, n, *, strict=False)',
  returns:   { type: 'iterator of tuple', desc: 'Tuples of n consecutive items; the final tuple holds whatever is left (1 to n items).' },

  category:    'itertools function',
  version:     'Python 3.12+',
  hasLiveDemo: true,

  subtitle: 'The long-requested "chunk a list" function. It works on any iterable, including generators and files, and never builds more than one batch at a time.',

  covers: ['batched'],

  cheat: {
    commonCall: 'for chunk in batched(rows, 100): ...',
    returns:    'tuples of up to n items',
    replaces:   'zip(*[iter(xs)] * n) and range(0, len(xs), n) slicing',
    watchOut:   'n < 1 → ValueError: n must be at least one',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null,    desc: 'Any iterable; consumed lazily, one batch at a time.' },
    { name: 'n',        type: 'int',      required: true,  default: null,    desc: 'Batch size, at least 1.' },
    { name: 'strict',   type: 'bool',     required: false, default: 'False', desc: 'Keyword-only, 3.13+. When True, a short final batch raises ValueError instead of being yielded.' },
  ],

  modes: [
    {
      id: 'chunks',
      label: 'chunks',
      blurb: 'Batches of n items, as tuples. Watch the last one.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'batch size',            input: 'number' },
      ],
      template: 'from itertools import batched\nlist(batched({$items}, {$n}))',
      cases: [
        { id: 'five',  label: '5 items by 2', values: { items: 'a, b, c, d, e', n: '2' } },
        { id: 'exact', label: 'exact fit',    values: { items: 'a, b, c, d', n: '2' } },
        { id: 'big',   label: 'n > len',      values: { items: 'a, b', n: '10' } },
        { id: 'zero',  label: 'n = 0',        values: { items: 'a, b', n: '0' } },
      ],
    },
    {
      id: 'strict',
      label: 'strict=True',
      blurb: 'Python 3.13+: an incomplete last batch becomes an error instead of a short tuple.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'batch size',            input: 'number' },
      ],
      template: 'from itertools import batched\nlist(batched({$items}, {$n}, strict=True))',
      cases: [
        { id: 'ok',    label: 'exact fit',  values: { items: 'x1, y1, x2, y2', n: '2' } },
        { id: 'short', label: 'left over',  values: { items: 'x1, y1, x2', n: '2' } },
      ],
    },
    {
      id: 'text',
      label: 'chunk a string',
      blurb: 'A string is an iterable of characters: join each batch back into a string.',
      params: [
        { name: 'text', type: 'str', hint: 'some text', input: 'text' },
        { name: 'n',    type: 'int', hint: 'chunk size', input: 'number' },
      ],
      template: "from itertools import batched\n[''.join(chunk) for chunk in batched({$text}, {$n})]",
      cases: [
        { id: 'hex',  label: 'hex bytes', values: { text: 'deadbeef', n: '2' } },
        { id: 'odd',  label: 'odd length', values: { text: 'abcdefg', n: '3' } },
      ],
    },
  ],
  demoExplainer: 'Each batch is a tuple, even a batch of one — so the five-item case ends with (\'e\',). The check on n happens when batched() is called, before anything is read, with the message "n must be at least one". strict=True raises "batched(): incomplete batch" when the last batch is short; because the demo wraps the call in list(), the complete batches before it are lost with the exception.',

  patterns: [
    {
      name: 'Bulk insert in chunks',
      desc: 'Keep each database round trip to a bounded size.',
      code: 'from itertools import batched\nfor chunk in batched(rows, 1000):\n    cursor.executemany(sql, chunk)',
    },
    {
      name: 'Pairs from a flat list',
      desc: 'strict=True guarantees every tuple is complete — a malformed input raises instead of yielding a half pair.',
      code: 'from itertools import batched\npoints = dict(batched(flat_key_values, 2, strict=True))',
    },
    {
      name: 'Before Python 3.12',
      desc: 'The islice recipe does the same on older versions.',
      code: 'from itertools import islice\ndef batched(iterable, n):\n    it = iter(iterable)\n    while batch := tuple(islice(it, n)):\n        yield batch',
    },
  ],

  examples: [
    { title: 'Groups of 3',              code: 'from itertools import batched\nlist(batched(range(8), 3))',            returns: '[(0, 1, 2), (3, 4, 5), (6, 7)]' },
    { title: 'Batches are tuples',       code: "from itertools import batched\nlist(batched('abc', 1))",               returns: "[('a',), ('b',), ('c',)]" },
    { title: 'Empty input → no batches', code: 'from itertools import batched\nlist(batched([], 4))',                   returns: '[]' },
    { title: 'n must be positive',       code: 'from itertools import batched\nbatched([1, 2], 0)',                      returns: 'ValueError: n must be at least one' },
    { title: 'strict=True (3.13+)',      code: 'from itertools import batched\nlist(batched([1, 2, 3], 2, strict=True))', returns: 'ValueError: batched(): incomplete batch' },
    { title: 'Works on generators',      code: 'from itertools import batched\nsquares = (x * x for x in range(5))\nlist(batched(squares, 2))', returns: '[(0, 1), (4, 9), (16,)]' },
  ],

  pitfalls: [
    {
      name: 'The zip() chunking trick drops leftovers',
      desc: 'zip(*[iter(xs)] * n) stops at the shortest — an incomplete final chunk disappears without a trace.',
      wrong: { label: 'zip trick', code: 'items = [1, 2, 3, 4, 5]\nit = iter(items)\nlist(zip(it, it))', output: '[(1, 2), (3, 4)]' },
      fix:   { label: 'batched',   code: 'from itertools import batched\nlist(batched([1, 2, 3, 4, 5], 2))', output: '[(1, 2), (3, 4), (5,)]' },
    },
    {
      name: 'Expecting lists',
      desc: 'Batches are tuples. Code that appends to a batch fails.',
      wrong: { label: 'append', code: 'from itertools import batched\nfirst = next(batched([1, 2, 3], 2))\nfirst.append(9)', output: "AttributeError: 'tuple' object has no attribute 'append'" },
      fix:   { label: 'list()', code: 'from itertools import batched\nfirst = list(next(batched([1, 2, 3], 2)))\nfirst.append(9)\nfirst', output: '[1, 2, 9]' },
    },
  ],

  when: {
    use: [
      'Splitting work into fixed-size chunks (API pages, bulk inserts, worker jobs)',
      'Chunking streams or generators where slicing is impossible',
    ],
    avoid: [
      'Python 3.11 and older → the islice recipe',
      'Overlapping windows → pairwise, or a collections.deque(maxlen=n)',
    ],
  },

  notes: {
    cpython:     'batched_next in Modules/itertoolsmodule.c builds each tuple with at most n items',
    'Versions':  'Added in 3.12; strict= added in 3.13',
    'Memory':    'Only one batch is held at a time, so a huge or infinite input is fine',
  },

  related: [
    { name: 'itertools.islice',   slug: 'islice',   when: 'Take one chunk of any size' },
    { name: 'itertools.pairwise', slug: 'pairwise', when: 'Overlapping pairs instead of chunks' },
    { name: 'zip()',              slug: 'zip',      when: 'The pre-3.12 chunking trick and its leftover problem', category: 'functions' },
    { name: 'itertools module',   slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I split a list into chunks of size n in Python?',
      a: 'From Python 3.12: list(itertools.batched(items, n)). It yields tuples; the last one holds the remainder. On older versions use [items[i:i + n] for i in range(0, len(items), n)] for lists, or the islice recipe for any iterable.',
    },
    {
      q: "Why do I get ImportError: cannot import name 'batched' from 'itertools'?",
      a: 'batched was added in Python 3.12. On earlier versions the name does not exist in itertools — use the islice recipe or more_itertools.chunked.',
    },
    {
      q: 'How do I make batched fail on an incomplete last chunk?',
      a: 'Pass strict=True (Python 3.13+). A short final batch then raises ValueError: batched(): incomplete batch.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.batched',
    meta:  'itertools.batched',
  },
};
