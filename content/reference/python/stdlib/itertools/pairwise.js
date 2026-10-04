// content/reference/python/stdlib/itertools/pairwise.js

export const meta = {
  slug:        'pairwise',
  name:        'itertools.pairwise',
  signature:   'itertools.pairwise(iterable)',
  blurb:       'Overlapping pairs of neighbours: (a, b), (b, c), (c, d) … — for differences, transitions and window-of-two checks. Python 3.10+.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.10+',
  searchTerms: 'itertools pairwise consecutive pairs adjacent elements neighbours sliding window of 2 differences between consecutive items zip(xs, xs[1:]) python 3.10',
};

export const method = {
  slug:      'pairwise',
  name:      'itertools.pairwise',
  signature: 'itertools.pairwise(iterable)',
  returns:   { type: 'iterator of tuple', desc: 'n - 1 overlapping pairs for an input of n items; nothing for fewer than 2.' },

  category:    'itertools function',
  version:     'Python 3.10+',
  hasLiveDemo: true,

  subtitle: 'The lazy, any-iterable version of zip(xs, xs[1:]). Every item except the first and last appears in two pairs.',

  covers: ['pairwise'],

  cheat: {
    commonCall: 'for prev, cur in pairwise(points): ...',
    returns:    '(x0, x1), (x1, x2), …',
    replaces:   'zip(xs, xs[1:]) and index loops with xs[i], xs[i + 1]',
    watchOut:   'fewer than 2 items → no pairs at all',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable; only one item is held between pairs.' },
  ],

  modes: [
    {
      id: 'pairs',
      label: 'pairs',
      blurb: 'Overlapping neighbours.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' }],
      template: 'from itertools import pairwise\nlist(pairwise({$items}))',
      cases: [
        { id: 'four', label: 'four items', values: { items: 'a, b, c, d' } },
        { id: 'one',  label: 'one item',   values: { items: 'a' } },
      ],
    },
    {
      id: 'diffs',
      label: 'differences',
      blurb: 'Change from each value to the next.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'from itertools import pairwise\n[b - a for a, b in pairwise({$nums})]',
      cases: [
        { id: 'temps',  label: 'temperatures', values: { nums: '12, 15, 14, 18, 18' } },
        { id: 'floats', label: 'floats',       values: { nums: '0.1, 0.3, 0.6' } },
      ],
    },
    {
      id: 'sorted',
      label: 'is sorted?',
      blurb: 'all() over every neighbouring pair — stops at the first pair out of order.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'from itertools import pairwise\nall(a <= b for a, b in pairwise({$nums}))',
      cases: [
        { id: 'yes',   label: 'sorted',     values: { nums: '1, 2, 2, 5' } },
        { id: 'no',    label: 'not sorted', values: { nums: '1, 3, 2' } },
        { id: 'empty', label: 'empty',      values: { nums: '' } },
      ],
    },
  ],
  demoExplainer: 'Four items give three pairs; one item gives none, and so does an empty list — which is why all(...) over an empty input is True: there is no pair out of order. The float differences show ordinary binary rounding: 0.3 - 0.1 is 0.19999999999999998.',

  patterns: [
    {
      name: 'Detect changes in a stream',
      desc: 'Compare each reading with the previous one.',
      code: 'from itertools import pairwise\nfor before, after in pairwise(readings):\n    if after - before > threshold:\n        alert(before, after)',
    },
    {
      name: 'Segments of a path',
      desc: 'Each pair of consecutive points is a segment.',
      code: 'from itertools import pairwise\nimport math\nlength = sum(math.dist(p, q) for p, q in pairwise(points))',
    },
    {
      name: 'Before Python 3.10',
      desc: 'The tee recipe from the old docs.',
      code: 'from itertools import tee\ndef pairwise(iterable):\n    a, b = tee(iterable)\n    next(b, None)\n    return zip(a, b)',
    },
  ],

  examples: [
    { title: 'Consecutive pairs',      code: "from itertools import pairwise\nlist(pairwise('abcd'))",                  returns: "[('a', 'b'), ('b', 'c'), ('c', 'd')]" },
    { title: 'Differences',            code: 'from itertools import pairwise\n[b - a for a, b in pairwise([1, 4, 9, 16])]', returns: '[3, 5, 7]' },
    { title: 'Fewer than two items',   code: 'from itertools import pairwise\nlist(pairwise([42]))',                    returns: '[]' },
    { title: 'Same as zip(xs, xs[1:])', code: 'from itertools import pairwise\nxs = [3, 1, 4, 1]\nlist(pairwise(xs)) == list(zip(xs, xs[1:]))', returns: 'True' },
    { title: 'Works on a generator',   code: 'from itertools import pairwise\nlist(pairwise(x * x for x in range(4)))',  returns: '[(0, 1), (1, 4), (4, 9)]' },
  ],

  pitfalls: [
    {
      name: 'Slicing a generator for neighbours',
      desc: 'zip(xs, xs[1:]) needs a sequence. pairwise works on any iterable.',
      wrong: { label: 'xs[1:]',   code: 'gen = (x for x in range(4))\nlist(zip(gen, gen[1:]))', output: "TypeError: 'generator' object is not subscriptable" },
      fix:   { label: 'pairwise', code: 'from itertools import pairwise\ngen = (x for x in range(4))\nlist(pairwise(gen))', output: '[(0, 1), (1, 2), (2, 3)]' },
    },
    {
      name: 'Zipping an iterator with itself',
      desc: 'zip(it, it) takes items two at a time — non-overlapping chunks, not neighbours.',
      wrong: { label: 'zip(it, it)', code: 'it = iter([1, 2, 3, 4])\nlist(zip(it, it))', output: '[(1, 2), (3, 4)]' },
      fix:   { label: 'pairwise',    code: 'from itertools import pairwise\nlist(pairwise([1, 2, 3, 4]))', output: '[(1, 2), (2, 3), (3, 4)]' },
    },
  ],

  when: {
    use: [
      'Differences, ratios or transitions between consecutive values',
      'Checking an ordering condition on neighbours',
      'Consecutive segments of a path or timeline',
    ],
    avoid: [
      'Non-overlapping pairs → batched(xs, 2)',
      'Windows wider than 2 → the sliding_window recipe (collections.deque(maxlen=n))',
    ],
  },

  notes: {
    cpython:    'pairwise_next in Modules/itertoolsmodule.c keeps the previous item and reuses the result tuple when possible',
    'Versions': 'Added in 3.10',
    'Count':    'n items → max(n - 1, 0) pairs',
  },

  related: [
    { name: 'zip()',             slug: 'zip',       when: 'zip(xs, xs[1:]) for sequences', category: 'functions' },
    { name: 'itertools.batched', slug: 'batched',   when: 'Non-overlapping groups' },
    { name: 'itertools.tee',     slug: 'tee',       when: 'How pairwise was written before 3.10' },
    { name: 'all()',             slug: 'all',       when: 'Check a condition on every pair', category: 'functions' },
    { name: 'itertools module',  slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I iterate over consecutive pairs of a list in Python?',
      a: 'for a, b in itertools.pairwise(items): … (Python 3.10+). On older versions use zip(items, items[1:]) for lists.',
    },
    {
      q: 'How do I compute differences between consecutive elements?',
      a: '[b - a for a, b in itertools.pairwise(values)] — the result is one item shorter than the input.',
    },
    {
      q: 'How do I get a sliding window of size n?',
      a: 'pairwise is the size-2 case. For larger windows the itertools docs give a sliding_window recipe built on collections.deque(maxlen=n); more_itertools.windowed is a ready-made version.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.pairwise',
    meta:  'itertools.pairwise',
  },
};
