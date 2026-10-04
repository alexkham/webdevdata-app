// content/reference/python/stdlib/bisect/bisect_left.js

export const meta = {
  slug:        'bisect_left',
  name:        'bisect.bisect_left',
  signature:   'bisect.bisect_left(a, x, lo=0, hi=len(a), *, key=None)',
  blurb:       'Binary search: the leftmost position where x could be inserted into the sorted sequence a — the index of the first item >= x.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'bisect bisect_left binary search lower bound first index greater or equal sorted list find position python bisect.bisect_left lo hi key lo must be non-negative',
};

export const method = {
  slug:      'bisect_left',
  name:      'bisect.bisect_left',
  signature: 'bisect.bisect_left(a, x, lo=0, hi=len(a), *, key=None)',
  returns:   { type: 'int', desc: 'An index i in [lo, hi]: everything in a[lo:i] is < x, everything in a[i:hi] is >= x.' },

  category:    'bisect function',
  version:     'Python 2.1+ (key 3.10+)',
  hasLiveDemo: true,

  subtitle: 'The "lower bound" of binary search. If x is in the list, the result is the index of its FIRST occurrence — which makes bisect_left the right function for "is x in this sorted list, and where?".',

  covers: ['bisect_left'],

  cheat: {
    commonCall: 'i = bisect.bisect_left(a, x)',
    returns:    'index of the first item >= x (len(a) if none)',
    replaces:   'a linear scan or a.index(x) on sorted data',
    watchOut:   'Returns a position even when x is not there',
  },

  parameters: [
    { name: 'a',   type: 'sequence', required: true,  default: null,     desc: 'Sorted ascending (by key, if given). Any sequence with indexing and len(): list, tuple, range, str …' },
    { name: 'x',   type: 'object',   required: true,  default: null,     desc: 'The value to locate. With key=, x must already be a KEY — key is not applied to it.' },
    { name: 'lo',  type: 'int',      required: false, default: '0',      desc: 'Start of the slice to search. Negative raises ValueError: lo must be non-negative.' },
    { name: 'hi',  type: 'int',      required: false, default: 'len(a)', desc: 'End of the slice. Not checked against len(a): a larger hi can raise IndexError. hi=-1 means len(a), like the default.' },
    { name: 'key', type: 'callable', required: false, default: 'None',   desc: 'Keyword-only (3.10+). Applied to each item of a that is compared, not to x.' },
  ],

  modes: [
    {
      id: 'position',
      label: 'position',
      blurb: 'The insertion point for x in a sorted list.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value',          input: 'number' },
      ],
      template: 'import bisect\nbisect.bisect_left({$a}, {$x})',
      cases: [
        { id: 'present', label: 'x present',  values: { a: '10, 20, 20, 30', x: '20' } },
        { id: 'between', label: 'x missing',  values: { a: '10, 20, 30', x: '25' } },
        { id: 'end',     label: 'x too big',  values: { a: '10, 20, 30', x: '99' } },
        { id: 'empty',   label: 'empty list', values: { a: '', x: '5' } },
      ],
    },
    {
      id: 'lohi',
      label: 'lo / hi',
      blurb: 'Search only a[lo:hi]. Try a negative lo, or a hi beyond the end of the list.',
      params: [
        { name: 'a',  type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
        { name: 'x',  type: 'int',               hint: 'value',          input: 'number' },
        { name: 'lo', type: 'int',               hint: 'lo',             input: 'number' },
        { name: 'hi', type: 'int',               hint: 'hi',             input: 'number' },
      ],
      template: 'import bisect\nbisect.bisect_left({$a}, {$x}, {$lo}, {$hi})',
      cases: [
        { id: 'slice',  label: 'inside a slice', values: { a: '1, 3, 5, 7, 9', x: '6', lo: '1', hi: '4' } },
        { id: 'neglo',  label: 'lo = -1',        values: { a: '1, 3, 5', x: '3', lo: '-1', hi: '3' } },
        { id: 'bighi',  label: 'hi too big',     values: { a: '1, 3, 5', x: '9', lo: '0', hi: '10' } },
        { id: 'empty',  label: 'lo >= hi',       values: { a: '1, 3, 5', x: '0', lo: '2', hi: '2' } },
      ],
    },
    {
      id: 'descending',
      label: 'descending list',
      blurb: 'A list sorted high to low, searched with key=lambda v: -v. The key is not applied to x, so x is negated by hand.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'numbers, high to low', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value',                input: 'number' },
      ],
      template: 'import bisect\nscores = {$a}\nx = {$x}\nbisect.bisect_left(scores, -x, key=lambda v: -v)',
      cases: [
        { id: 'mid',  label: 'x = 75',  values: { a: '90, 80, 70, 60', x: '75' } },
        { id: 'tie',  label: 'x = 80',  values: { a: '90, 80, 70, 60', x: '80' } },
      ],
    },
  ],
  demoExplainer: 'In 10, 20, 20, 30 the result for 20 is 1 — the first 20. With lo = 1 and hi = 4 only 3, 5, 7 are searched and 6 lands at index 3. lo = -1 raises ValueError: lo must be non-negative, but hi is never checked: hi = 10 on a three-item list makes the search read a[5] and fail with IndexError: list index out of range. In the descending list, searching -75 among the keys -90, -80, -70, -60 gives 2: 75 belongs between 80 and 70.',

  patterns: [
    {
      name: 'index() for sorted lists',
      desc: 'The docs recipe: O(log n) instead of list.index().',
      code: 'from bisect import bisect_left\ndef index(a, x):\n    i = bisect_left(a, x)\n    if i != len(a) and a[i] == x:\n        return i\n    raise ValueError',
    },
    {
      name: 'First item >= x',
      desc: 'find_ge from the docs: the smallest item not less than x.',
      code: 'from bisect import bisect_left\ni = bisect_left(a, x)\nfirst_ge = a[i] if i != len(a) else None',
    },
    {
      name: 'Records by key (3.10+)',
      desc: 'Search by a field, passing the key value as x.',
      code: 'from bisect import bisect_left\ni = bisect_left(events, cutoff_time, key=lambda e: e.time)',
    },
  ],

  examples: [
    { title: 'First of several equal items', code: 'import bisect\nbisect.bisect_left([10, 20, 20, 30], 20)', returns: '1' },
    { title: 'Missing value',                code: 'import bisect\nbisect.bisect_left([10, 20, 30], 25)',     returns: '2' },
    { title: 'Is x present?',                code: 'import bisect\na = [2, 4, 6, 8]\ni = bisect.bisect_left(a, 6)\ni < len(a) and a[i] == 6', returns: 'True' },
    { title: 'Search a slice',               code: 'import bisect\nbisect.bisect_left([1, 3, 5, 7, 9], 6, 1, 4)', returns: '3' },
    { title: 'key applies to items, not x',  code: "import bisect\nwords = ['fig', 'kiwi', 'banana']\nbisect.bisect_left(words, 5, key=len)", returns: '2' },
    { title: 'hi past the end',              code: 'import bisect\nbisect.bisect_left([1, 3, 5], 9, 0, 10)', returns: 'IndexError: list index out of range' },
    { title: 'Mixed types',                  code: "import bisect\nbisect.bisect_left([1, 2, 3], 'a')",       returns: "TypeError: '<' not supported between instances of 'int' and 'str'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting that key is not applied to x',
      desc: 'bisect_left applies key to the list items only. Pass the key of x, not x itself.',
      wrong: { label: 'x as is', code: "import bisect\nwords = ['fig', 'kiwi', 'banana']\nbisect.bisect_left(words, 'pear', key=len)", output: "TypeError: '<' not supported between instances of 'int' and 'str'" },
      fix:   { label: 'key(x)', code: "import bisect\nwords = ['fig', 'kiwi', 'banana']\nbisect.bisect_left(words, len('pear'), key=len)", output: '1' },
    },
    {
      name: 'Searching a descending list',
      desc: 'bisect assumes ascending order. A descending list needs a key that reverses the order — and x must be transformed the same way.',
      wrong: { label: 'key only', code: 'import bisect\nbisect.bisect_left([90, 80, 70, 60], 75, key=lambda v: -v)', output: '4' },
      fix:   { label: 'key and -x', code: 'import bisect\nbisect.bisect_left([90, 80, 70, 60], -75, key=lambda v: -v)', output: '2' },
    },
  ],

  when: {
    use: [
      'Binary search for a value in a sorted list',
      'Lower bound: first item >= x',
      'Counting items < x (the result itself)',
    ],
    avoid: [
      'Insert right away → insort_left',
      'Upper bound / first item > x → bisect_right',
      'Unsorted data → sort it, or use a set for membership',
    ],
  },

  notes: {
    cpython:   'internal_bisect_left in Modules/_bisectmodule.c: while lo < hi: mid = (lo + hi) // 2; if a[mid] < x: lo = mid + 1 else hi = mid',
    'Errors':  'ValueError("lo must be non-negative"); IndexError when hi > len(a) and a midpoint falls past the end; TypeError from <',
    'Versions': 'key= added in 3.10',
  },

  related: [
    { name: 'bisect.bisect_right', slug: 'bisect_right', when: 'Position after equal items' },
    { name: 'bisect.insort_left',  slug: 'insort_left',  when: 'Search and insert' },
    { name: 'list.index()',        slug: 'list-index',   when: 'Linear search on unsorted lists', category: 'functions' },
    { name: 'bisect module',       slug: 'bisect',       when: 'Overview and grade lookup', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if a value is in a sorted list with bisect?',
      a: 'i = bisect_left(a, x); found = i < len(a) and a[i] == x. The index check avoids an IndexError when x is larger than every item.',
    },
    {
      q: 'Why does bisect_left with key= raise TypeError?',
      a: 'key is applied to the list items but not to x, so x must already be a key value. Pass key(x) — e.g. len(word) when key=len.',
    },
    {
      q: 'What does "lo must be non-negative" mean?',
      a: 'lo was negative. Unlike slicing, bisect does not count negative indexes from the end; pass a real start index (0 or more).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/bisect.html#bisect.bisect_left',
    meta:  'bisect.bisect_left',
  },
};
