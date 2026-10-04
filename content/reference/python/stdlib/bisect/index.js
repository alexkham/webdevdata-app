// content/reference/python/stdlib/bisect/index.js — the bisect module hub

export const meta = {
  slug:        'index',
  name:        'bisect',
  signature:   'import bisect',
  blurb:       'Binary search on sorted lists: find the insertion point for a value in O(log n), or insert it while keeping the list sorted.',
  category:    'functional',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'bisect module python binary search sorted list insertion point bisect_left bisect_right insort insort_left insort_right keep list sorted grade lookup ranges buckets lower bound upper bound',
};

export const method = {
  slug: 'index',
  name: 'bisect',

  category:    'Iterators & containers',
  version:     'Python 2.1+',
  hasLiveDemo: true,

  subtitle: 'Six functions, three ideas: bisect_left and bisect_right find where a value would go in a sorted list, insort_left and insort_right put it there, and bisect / insort are aliases of the _right versions. The list must already be sorted — nothing checks.',

  imports: ['import bisect', 'from bisect import bisect_left, insort'],
  facts: [
    { label: 'Public API', value: 'bisect_left, bisect_right (alias bisect), insort_left, insort_right (alias insort)' },
    { label: 'Cost',       value: 'Search O(log n) comparisons; insort is O(n) because list.insert shifts items' },
    { label: 'key=',       value: 'Python 3.10+. Applied to list items — and, for insort only, to the inserted item' },
    { label: 'Speed',      value: 'C module _bisect (Modules/_bisectmodule.c); Lib/bisect.py is the pure-Python fallback' },
  ],

  modes: [
    {
      id: 'grade',
      label: 'grade lookup',
      blurb: 'The classic table lookup from the docs: breakpoints 60, 70, 80, 90 split scores into F, D, C, B, A. bisect() counts how many breakpoints a score has reached.',
      params: [{ name: 'scores', type: 'list[int | float]', hint: 'comma-separated scores', input: 'csv-num' }],
      template: "from bisect import bisect\ndef grade(score, breakpoints=[60, 70, 80, 90], grades='FDCBA'):\n    i = bisect(breakpoints, score)\n    return grades[i]\n[grade(score) for score in {$scores}]",
      cases: [
        { id: 'docs',  label: 'docs example', values: { scores: '33, 99, 77, 70, 89, 90, 100' } },
        { id: 'edges', label: 'edges',        values: { scores: '59, 59.5, 60, 60.5' } },
      ],
    },
    {
      id: 'leftright',
      label: 'left vs right',
      blurb: 'Where x would be inserted: before the existing equal items (left) or after them (right).',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value',          input: 'number' },
      ],
      template: 'import bisect\na = {$a}\nx = {$x}\n(bisect.bisect_left(a, x), bisect.bisect_right(a, x))',
      cases: [
        { id: 'dupes',   label: 'x present 3 times', values: { a: '1, 2, 2, 2, 3', x: '2' } },
        { id: 'missing', label: 'x missing',          values: { a: '10, 20, 30', x: '25' } },
        { id: 'small',   label: 'below all',          values: { a: '10, 20, 30', x: '5' } },
      ],
    },
  ],
  demoExplainer: 'A score equal to a breakpoint counts as reaching it — 70 is a C and 90 an A — because bisect() is bisect_right: it places a value AFTER equal items. With 1, 2, 2, 2, 3 and x = 2 the two functions return 1 and 4: the run of 2s occupies indexes 1 to 3, and right minus left is 3, the number of 2s. When x is missing, both return the same index.',

  patterns: [
    {
      name: 'Binary search for an exact value',
      desc: 'bisect_left gives the first position that could hold x; check it.',
      code: 'from bisect import bisect_left\ni = bisect_left(a, x)\nfound = i < len(a) and a[i] == x',
    },
    {
      name: 'Keep a list sorted as you add',
      desc: 'insort inserts in place at the right position.',
      code: 'from bisect import insort\ninsort(scores, new_score)',
    },
    {
      name: 'Count values in a range',
      desc: 'Number of items with lo <= item <= hi.',
      code: 'from bisect import bisect_left, bisect_right\ncount = bisect_right(a, hi) - bisect_left(a, lo)',
    },
    {
      name: 'Records by a field (3.10+)',
      desc: 'key= searches a list of records sorted by that field.',
      code: 'from bisect import bisect_left\nfrom operator import attrgetter\ni = bisect_left(movies, 1960, key=attrgetter("released"))',
    },
  ],

  examples: [
    { title: 'Insertion point',          code: 'import bisect\nbisect.bisect_left([10, 20, 30], 25)',          returns: '2' },
    { title: 'Left vs right on duplicates', code: 'import bisect\na = [1, 2, 2, 2, 3]\n(bisect.bisect_left(a, 2), bisect.bisect_right(a, 2))', returns: '(1, 4)' },
    { title: 'bisect is bisect_right',   code: 'import bisect\nbisect.bisect is bisect.bisect_right',          returns: 'True' },
    { title: 'Insert keeping order',     code: 'import bisect\na = [1, 3, 5]\nbisect.insort(a, 4)\na',          returns: '[1, 3, 4, 5]' },
    { title: 'Grade lookup',             code: "from bisect import bisect\n'FDCBA'[bisect([60, 70, 80, 90], 85)]", returns: "'B'" },
    { title: 'Works on any sequence',    code: 'import bisect\nbisect.bisect_left(range(0, 100, 5), 42)',     returns: '9' },
    { title: 'lo must be non-negative',  code: 'import bisect\nbisect.bisect_left([1, 2], 1, lo=-1)',          returns: 'ValueError: lo must be non-negative' },
  ],

  pitfalls: [
    {
      name: 'Searching an unsorted list',
      desc: 'Binary search assumes sorted input and never checks. On an unsorted list it returns a plausible-looking but wrong position.',
      wrong: { label: 'unsorted', code: 'import bisect\na = [30, 10, 20]\ni = bisect.bisect_left(a, 10)\ni < len(a) and a[i] == 10', output: 'False' },
      fix:   { label: 'sort first', code: 'import bisect\na = sorted([30, 10, 20])\ni = bisect.bisect_left(a, 10)\ni < len(a) and a[i] == 10', output: 'True' },
    },
    {
      name: 'Treating the result as "found"',
      desc: 'bisect functions return an insertion point, never "not found". Check the item at that index.',
      wrong: { label: 'index only', code: 'import bisect\nbisect.bisect_left([10, 20, 30], 25)', output: '2' },
      fix:   { label: 'check it', code: 'import bisect\na = [10, 20, 30]\ni = bisect.bisect_left(a, 25)\ni if i < len(a) and a[i] == 25 else -1', output: '-1' },
    },
  ],

  when: {
    use: [
      'Searching large sorted lists',
      'Mapping numbers to ranges or buckets (grades, tax bands, histograms)',
      'Keeping a small-to-medium list sorted while adding items',
    ],
    avoid: [
      'Exact membership tests → a set or dict (O(1))',
      'Many inserts into a huge list → a heap (heapq) or a sorted container library',
      'Only the smallest item needed → heapq',
    ],
  },

  notes: {
    cpython:      'Modules/_bisectmodule.c; only the < operator is used, never ==',
    'Aliases':    'bisect = bisect_right and insort = insort_right (the same function objects)',
    'Versions':   'Module from Python 2.1; key= added in 3.10',
    'Threads':    'The docs warn the functions are not thread-safe on a list another thread is changing',
  },

  related: [
    { name: 'sorted()',     slug: 'sorted',     when: 'Sort the list first', category: 'functions' },
    { name: 'list.insert()', slug: 'list-insert', when: 'What insort calls internally', category: 'functions' },
    { name: 'heapq module', slug: 'heapq',      when: 'Only need the smallest item, fast inserts', category: 'stdlib' },
    { name: 'itertools.accumulate', slug: 'accumulate', when: 'Cumulative weights to bisect into', category: 'stdlib/itertools' },
  ],

  faq: [
    {
      q: 'How do I do a binary search in Python?',
      a: 'Use bisect.bisect_left(a, x) on a sorted list, then check "i < len(a) and a[i] == x" to see whether x is present. The function returns the position where x is or would be inserted.',
    },
    {
      q: 'What is the difference between bisect_left and bisect_right?',
      a: 'They differ only when x is already in the list: bisect_left returns the position before the existing equal items, bisect_right (and bisect) the position after them.',
    },
    {
      q: 'Does bisect work on a list sorted in descending order?',
      a: 'Not directly. Use key=lambda v: -v (3.10+) and search for -x, because the key is not applied to x by the bisect functions. Or keep a negated copy of the list.',
    },
    {
      q: 'Is insort fast?',
      a: 'The search is O(log n), but inserting into a Python list shifts every later item, so insort is O(n) overall. For many inserts into a big collection, consider a heap or a sorted container.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/bisect.html',
    meta:  'bisect — Array bisection algorithm',
  },
};
