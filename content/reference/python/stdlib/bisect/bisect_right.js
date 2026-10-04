// content/reference/python/stdlib/bisect/bisect_right.js

export const meta = {
  slug:        'bisect_right',
  name:        'bisect.bisect_right / bisect',
  signature:   'bisect.bisect_right(a, x, lo=0, hi=len(a), *, key=None)',
  blurb:       'Binary search: the position AFTER any items equal to x in a sorted sequence — the index of the first item > x. bisect.bisect is the same function.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'bisect bisect_right bisect.bisect upper bound first index greater than sorted list binary search python count occurrences buckets ranges histogram grade lookup',
};

export const method = {
  slug:      'bisect_right',
  name:      'bisect.bisect_right / bisect',
  signature: 'bisect.bisect_right(a, x, lo=0, hi=len(a), *, key=None)',
  returns:   { type: 'int', desc: 'An index i in [lo, hi]: everything in a[lo:i] is <= x, everything in a[i:hi] is > x.' },

  category:    'bisect function',
  version:     'Python 2.1+ (key 3.10+)',
  hasLiveDemo: true,

  subtitle: 'The "upper bound" of binary search, and the function behind bisect.bisect. Its result is the number of items <= x, which is exactly what range and bucket lookups need.',

  covers: ['bisect_right', 'bisect'],

  cheat: {
    commonCall: 'i = bisect.bisect(breakpoints, value)',
    returns:    'index of the first item > x (len(a) if none)',
    replaces:   'a chain of if/elif range checks',
    watchOut:   'bisect.bisect(...) is right, not left',
  },

  parameters: [
    { name: 'a',   type: 'sequence', required: true,  default: null,     desc: 'Sorted ascending (by key, if given). Any indexable sequence.' },
    { name: 'x',   type: 'object',   required: true,  default: null,     desc: 'The value to locate. With key=, pass the key value — key is not applied to x.' },
    { name: 'lo',  type: 'int',      required: false, default: '0',      desc: 'Start of the slice to search; must be >= 0.' },
    { name: 'hi',  type: 'int',      required: false, default: 'len(a)', desc: 'End of the slice; not checked against len(a).' },
    { name: 'key', type: 'callable', required: false, default: 'None',   desc: 'Keyword-only (3.10+). Applied to each compared item of a.' },
  ],

  modes: [
    {
      id: 'position',
      label: 'position',
      blurb: 'The insertion point after any equal items.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value',          input: 'number' },
      ],
      template: 'import bisect\nbisect.bisect_right({$a}, {$x})',
      cases: [
        { id: 'present', label: 'x present', values: { a: '10, 20, 20, 30', x: '20' } },
        { id: 'missing', label: 'x missing', values: { a: '10, 20, 30', x: '25' } },
        { id: 'small',   label: 'x too small', values: { a: '10, 20, 30', x: '1' } },
      ],
    },
    {
      id: 'count',
      label: 'count x',
      blurb: 'right minus left = how many items equal x, in O(log n).',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value',          input: 'number' },
      ],
      template: 'import bisect\na = {$a}\nx = {$x}\nbisect.bisect_right(a, x) - bisect.bisect_left(a, x)',
      cases: [
        { id: 'three', label: 'three 2s', values: { a: '1, 2, 2, 2, 3', x: '2' } },
        { id: 'none',  label: 'absent',   values: { a: '1, 3, 5', x: '2' } },
      ],
    },
    {
      id: 'buckets',
      label: 'buckets',
      blurb: 'Which bucket each value falls into, given sorted breakpoints: bucket i holds values from breaks[i-1] up to (not including) breaks[i].',
      params: [
        { name: 'breaks', type: 'list[int | float]', hint: 'sorted breakpoints', input: 'csv-num' },
        { name: 'values', type: 'list[int | float]', hint: 'values to bucket',   input: 'csv-num' },
      ],
      template: 'import bisect\nbreaks = {$breaks}\n[bisect.bisect(breaks, x) for x in {$values}]',
      cases: [
        { id: 'basic', label: 'three breaks', values: { breaks: '0, 10, 20', values: '-5, 0, 5, 10, 25' } },
        { id: 'tax',   label: 'tax bands',    values: { breaks: '11000, 44725, 95375', values: '9000, 44725, 60000, 200000' } },
      ],
    },
  ],
  demoExplainer: 'For 10, 20, 20, 30 and x = 20 the result is 3 — after both 20s (bisect_left would say 1). In the bucket demo with breakpoints 0, 10, 20, the value 10 goes to bucket 2, not 1: a value equal to a breakpoint counts as having reached it. Values below the first breakpoint get bucket 0, values at or above the last get len(breaks).',

  patterns: [
    {
      name: 'Range lookup table',
      desc: 'Map a number to a label with one call instead of an if/elif ladder.',
      code: "from bisect import bisect\nlabel = ['cold', 'mild', 'warm', 'hot'][bisect([10, 20, 30], temperature)]",
    },
    {
      name: 'Last item <= x',
      desc: 'find_le from the docs.',
      code: 'from bisect import bisect_right\ni = bisect_right(a, x)\nlast_le = a[i - 1] if i else None',
    },
    {
      name: 'Weighted random choice',
      desc: 'Bisect a random number into cumulative weights (random.choices does this internally).',
      code: 'import random\nfrom bisect import bisect\nfrom itertools import accumulate\ncum = list(accumulate(weights))\nitem = items[bisect(cum, random.random() * cum[-1])]',
    },
  ],

  examples: [
    { title: 'After equal items',     code: 'import bisect\nbisect.bisect_right([10, 20, 20, 30], 20)',  returns: '3' },
    { title: 'bisect is the same function', code: 'import bisect\nbisect.bisect is bisect.bisect_right', returns: 'True' },
    { title: 'Grade lookup',          code: "from bisect import bisect\n[('FDCBA'[bisect([60, 70, 80, 90], s)]) for s in [59, 60, 95]]", returns: "['F', 'D', 'A']" },
    { title: 'Count occurrences',     code: 'import bisect\na = [1, 2, 2, 2, 3]\nbisect.bisect_right(a, 2) - bisect.bisect_left(a, 2)', returns: '3' },
    { title: '2.0 equals 2',          code: 'import bisect\nbisect.bisect_right([1, 2, 3], 2.0)', returns: '2' },
    { title: 'Bucket numbers',        code: 'import bisect\n[bisect.bisect([0, 10, 20], x) for x in [-5, 0, 5, 10, 25]]', returns: '[0, 1, 1, 2, 3]' },
  ],

  pitfalls: [
    {
      name: 'Using bisect() to find an existing item',
      desc: 'bisect() is bisect_right, so for a present x it points one PAST the last match.',
      wrong: { label: 'bisect', code: 'import bisect\na = [10, 20, 30]\na[bisect.bisect(a, 20)]', output: '30' },
      fix:   { label: 'bisect_left', code: 'import bisect\na = [10, 20, 30]\na[bisect.bisect_left(a, 20)]', output: '20' },
    },
    {
      name: 'Breakpoints out of order',
      desc: 'The breakpoint list must be sorted; otherwise values land in the wrong bucket without any error.',
      wrong: { label: 'unsorted', code: "from bisect import bisect\n'FDCBA'[bisect([90, 60, 80, 70], 85)]", output: "'A'" },
      fix:   { label: 'sorted', code: "from bisect import bisect\n'FDCBA'[bisect(sorted([90, 60, 80, 70]), 85)]", output: "'B'" },
    },
  ],

  when: {
    use: [
      'Bucketing numbers into ranges (grades, tax bands, histogram bins)',
      'Upper bound: first item > x, or "how many items <= x"',
      'Counting duplicates in a sorted list',
    ],
    avoid: [
      'Locating an existing item → bisect_left',
      'Search and insert in one step → insort_right / insort',
    ],
  },

  notes: {
    cpython:    'internal_bisect_right in Modules/_bisectmodule.c: if x < a[mid]: hi = mid else lo = mid + 1',
    'Alias':    'bisect.bisect is bisect.bisect_right (same object)',
    'Versions': 'key= added in 3.10',
  },

  related: [
    { name: 'bisect.bisect_left',  slug: 'bisect_left',  when: 'Position before equal items' },
    { name: 'bisect.insort_right', slug: 'insort_right', when: 'Search and insert' },
    { name: 'random.choices',      slug: 'choices',      when: 'Weighted choice built on bisect', category: 'stdlib/random' },
    { name: 'bisect module',       slug: 'bisect',       when: 'Overview and grade lookup', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is bisect.bisect the same as bisect_right?',
      a: 'Yes — bisect.bisect is bisect.bisect_right is True. Likewise bisect.insort is insort_right.',
    },
    {
      q: 'How do I count occurrences of a value in a sorted list quickly?',
      a: 'bisect_right(a, x) - bisect_left(a, x). Both are O(log n), so this beats a.count(x) on long lists.',
    },
    {
      q: 'How do I map scores to letter grades in Python?',
      a: "'FDCBA'[bisect([60, 70, 80, 90], score)] — bisect counts how many breakpoints the score has reached (a score equal to a breakpoint counts), and that count indexes the grade string.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/bisect.html#bisect.bisect_right',
    meta:  'bisect.bisect_right, bisect.bisect',
  },
};
