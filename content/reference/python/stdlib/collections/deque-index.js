// content/reference/python/stdlib/collections/deque-index.js

export const meta = {
  slug:        'deque-index',
  name:        'deque index / count / insert / remove',
  signature:   'deque.index(x[, start[, stop]])  ·  deque.count(x)  ·  deque.insert(i, x)  ·  deque.remove(value)',
  blurb:       'The list-style methods of deque: find a position, count matches, insert at a position, remove the first match — all O(n).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.5+ (count/remove earlier)',
  searchTerms: 'deque index count insert remove deque.index deque.count deque.insert deque.remove find position is not in deque already at its maximum size python collections',
};

export const method = {
  slug:      'deque-index',
  name:      'deque index / count / insert / remove',
  signature: 'deque.index(x[, start[, stop]])',
  returns:   { type: 'int | None', desc: 'index → position, count → number of matches; insert and remove return None.' },

  category:    'deque methods',
  version:     'Python 3.5+ (count/remove earlier)',
  hasLiveDemo: true,

  subtitle: 'They behave like their list namesakes, with deque-specific errors: "x is not in deque" from index and remove, and insert refuses to grow a full bounded deque.',

  covers: ['deque.index', 'deque.count', 'deque.insert', 'deque.remove'],

  cheat: {
    commonCall: "d.index('b') · d.count('b') · d.insert(1, 'x') · d.remove('b')",
    returns:    'int · int · None · None',
    replaces:   'converting to a list for one lookup',
    watchOut:   'insert on a full bounded deque raises IndexError',
  },

  parameters: [
    { name: 'x',     type: 'object', required: true,  default: null,  desc: 'The value to find, count or insert (compared with ==).' },
    { name: 'start', type: 'int',    required: false, default: '0',   desc: 'index only: first position to search; negative counts from the end.' },
    { name: 'stop',  type: 'int',    required: false, default: 'len(d)', desc: 'index only: search stops before this position.' },
    { name: 'i',     type: 'int',    required: true,  default: null,  desc: 'insert only: position; out-of-range values clamp to the ends like list.insert.' },
  ],

  modes: [
    {
      id: 'find',
      label: 'count & index',
      blurb: 'count never fails; index raises ValueError when the value is absent.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'items',          input: 'csv' },
        { name: 'x',     type: 'str',       hint: 'value to find',  input: 'text' },
      ],
      template: 'from collections import deque\nd = deque({$items})\n(d.count({$x}), d.index({$x}))',
      cases: [
        { id: 'twice',  label: 'found twice', values: { items: 'a, b, c, b', x: 'b' } },
        { id: 'absent', label: 'absent',      values: { items: 'a, b', x: 'z' } },
      ],
    },
    {
      id: 'insert',
      label: 'insert',
      blurb: 'Insert at a position. Leave maxlen empty for an unbounded deque.',
      params: [
        { name: 'items',  type: 'list[str]',  hint: 'items',              input: 'csv' },
        { name: 'maxlen', type: 'int | None', hint: 'empty = unbounded',  input: 'number-or-none' },
        { name: 'i',      type: 'int',        hint: 'position',           input: 'number' },
        { name: 'x',      type: 'str',        hint: 'value',              input: 'text' },
      ],
      template: 'from collections import deque\nd = deque({$items}, maxlen={$maxlen})\nd.insert({$i}, {$x})\nd',
      cases: [
        { id: 'mid',  label: 'middle',      values: { items: 'a, b, c', maxlen: '', i: '1', x: 'X' } },
        { id: 'far',  label: 'i past end',  values: { items: 'a, b', maxlen: '', i: '99', x: 'X' } },
        { id: 'full', label: 'full maxlen', values: { items: 'a, b', maxlen: '2', i: '0', x: 'X' } },
      ],
    },
    {
      id: 'remove',
      label: 'remove',
      blurb: 'Remove the first matching item.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'items',           input: 'csv' },
        { name: 'x',     type: 'str',       hint: 'value to remove', input: 'text' },
      ],
      template: 'from collections import deque\nd = deque({$items})\nd.remove({$x})\nd',
      cases: [
        { id: 'first',  label: 'first match', values: { items: 'a, b, a', x: 'a' } },
        { id: 'absent', label: 'absent',      values: { items: 'a, b', x: 'z' } },
      ],
    },
  ],
  demoExplainer: 'In "absent" count() returns 0 first, then index() raises ValueError: \'z\' is not in deque — remove() raises the same message. Inserting at position 99 simply appends, but inserting into a deque that already holds maxlen items is an IndexError.',

  patterns: [
    {
      name: 'Find with a default',
      desc: 'Test membership first to avoid the ValueError.',
      code: 'pos = d.index(x) if x in d else -1',
    },
    {
      name: 'Remove if present',
      desc: 'remove raises when the value is missing.',
      code: 'if x in d:\n    d.remove(x)',
    },
    {
      name: 'Search a range',
      desc: 'start/stop limit the scan, like list.index.',
      code: 'second = d.index(x, d.index(x) + 1)',
    },
  ],

  examples: [
    { title: 'index finds the first match',  code: "from collections import deque\ndeque('abcb').index('b')", returns: '1' },
    { title: 'index with a start',           code: "from collections import deque\ndeque('abcb').index('b', 2)", returns: '3' },
    { title: 'count',                        code: "from collections import deque\ndeque('banana').count('a')", returns: '3' },
    { title: 'insert in the middle',         code: "from collections import deque\nd = deque('ac')\nd.insert(1, 'b')\nd", returns: "deque(['a', 'b', 'c'])" },
    { title: 'remove the first match',       code: "from collections import deque\nd = deque('abab')\nd.remove('b')\nd", returns: "deque(['a', 'a', 'b'])" },
    { title: 'Missing value',                code: "from collections import deque\ndeque('ab').index('z')", returns: "ValueError: 'z' is not in deque" },
    { title: 'insert into a full bounded deque', code: "from collections import deque\ndeque('ab', maxlen=2).insert(1, 'x')", returns: 'IndexError: deque already at its maximum size' },
  ],

  pitfalls: [
    {
      name: 'remove() of a missing value',
      desc: 'Like list.remove, it raises ValueError. Check membership first.',
      wrong: { label: 'remove blindly', code: "from collections import deque\nd = deque(['a'])\nd.remove('b')", output: "ValueError: 'b' is not in deque" },
      fix:   { label: 'check with in',  code: "from collections import deque\nd = deque(['a'])\nif 'b' in d:\n    d.remove('b')\nd", output: "deque(['a'])" },
    },
    {
      name: 'Heavy middle access on a deque',
      desc: 'index, insert and remove walk the deque. For many position-based edits a list is the better structure; convert once.',
      wrong: { label: 'many d[i] reads',  code: 'from collections import deque\nd = deque(range(5))\n[d[i] for i in range(0, 5, 2)]', output: '[0, 2, 4]' },
      fix:   { label: 'slice a list',     code: 'from collections import deque\nd = deque(range(5))\nlist(d)[::2]', output: '[0, 2, 4]' },
    },
  ],

  when: {
    use: [
      'Occasional lookups or edits inside a queue',
    ],
    avoid: [
      'Frequent index-based work → list',
      'Frequent membership tests → a set alongside the deque',
    ],
  },

  notes: {
    cpython:    'deque_index, deque_count, deque_insert, deque_remove in Modules/_collectionsmodule.c; each is O(n)',
    'Versions': 'remove since 2.5, count 3.2, index and insert 3.5 (docs.python.org)',
    'Errors':   "index/remove: ValueError(\"<repr> is not in deque\"); insert on a full bounded deque: IndexError('deque already at its maximum size')",
  },

  related: [
    { name: 'deque',           slug: 'deque',        when: 'Indexing with d[i]' },
    { name: 'deque.maxlen',    slug: 'deque-maxlen', when: 'Why insert can fail' },
    { name: 'list.index',      slug: 'list-index',   when: 'The list equivalent', category: 'functions' },
    { name: 'list.insert',     slug: 'list-insert',  when: 'The list equivalent', category: 'functions' },
    { name: 'list.remove',     slug: 'list-remove',  when: 'The list equivalent', category: 'functions' },
    { name: 'ValueError',      slug: 'valueerror',   when: 'Value not in deque', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Does deque have an index method?',
      a: 'Yes, since Python 3.5: d.index(x[, start[, stop]]) returns the first position of x and raises ValueError when it is absent.',
    },
    {
      q: 'Why does deque.insert raise "deque already at its maximum size"?',
      a: 'The deque is bounded and full. append/appendleft would silently drop an item from the other end, but insert has no natural end to drop from, so it raises IndexError instead.',
    },
    {
      q: 'How do I remove an item from the middle of a deque?',
      a: 'd.remove(value) removes the first match; del d[i] removes by position. Both are O(n).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.deque.index',
    meta:  'deque.index',
  },
};
