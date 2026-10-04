// content/reference/python/stdlib/bisect/insort_left.js

export const meta = {
  slug:        'insort_left',
  name:        'bisect.insort_left',
  signature:   'bisect.insort_left(a, x, lo=0, hi=len(a), *, key=None)',
  blurb:       'Insert x into a sorted list, keeping it sorted — before any items equal to x.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'bisect insort_left insert into sorted list keep list sorted insert before equal python bisect.insort_left sorted insert',
};

export const method = {
  slug:      'insort_left',
  name:      'bisect.insort_left',
  signature: 'bisect.insort_left(a, x, lo=0, hi=len(a), *, key=None)',
  returns:   { type: 'None', desc: 'The list is changed in place.' },

  category:    'bisect function',
  version:     'Python 2.1+ (key 3.10+)',
  hasLiveDemo: true,

  subtitle: 'bisect_left to find the spot, then a.insert(i, x). The search is O(log n), the insert O(n) — fine for lists of thousands, slow for millions of inserts.',

  covers: ['insort_left'],

  cheat: {
    commonCall: 'bisect.insort_left(a, x)',
    returns:    'None — a is modified in place',
    replaces:   'a.append(x); a.sort()',
    watchOut:   'Only differs from insort when x equals existing items',
  },

  parameters: [
    { name: 'a',   type: 'list',     required: true,  default: null,     desc: 'A sorted mutable sequence with an insert() method (normally a list).' },
    { name: 'x',   type: 'object',   required: true,  default: null,     desc: 'The item to insert. With key=, key(x) is used for the search and x itself is inserted.' },
    { name: 'lo',  type: 'int',      required: false, default: '0',      desc: 'Start of the slice to search; must be >= 0.' },
    { name: 'hi',  type: 'int',      required: false, default: 'len(a)', desc: 'End of the slice to search.' },
    { name: 'key', type: 'callable', required: false, default: 'None',   desc: 'Keyword-only (3.10+). Applied to the list items AND to x (unlike bisect_left).' },
  ],

  modes: [
    {
      id: 'trace',
      label: 'insert one by one',
      blurb: 'Insert each value into the starting list and record the list after every insert.',
      params: [
        { name: 'a',      type: 'list[int | float]', hint: 'sorted starting list', input: 'csv-num' },
        { name: 'values', type: 'list[int | float]', hint: 'values to insert',     input: 'csv-num' },
      ],
      template: 'import bisect\na = {$a}\ntrace = []\nfor x in {$values}:\n    bisect.insort_left(a, x)\n    trace.append(a.copy())\ntrace',
      cases: [
        { id: 'basic',    label: 'four inserts',   values: { a: '1, 3, 5', values: '4, 1, 6, 0' } },
        { id: 'empty',    label: 'from empty',     values: { a: '', values: '3, 1, 2' } },
        { id: 'unsorted', label: 'unsorted start', values: { a: '5, 1, 3', values: '2' } },
      ],
    },
    {
      id: 'ties',
      label: 'left vs right',
      blurb: 'Insert float(x) — equal to the int x, but visibly different — with insort_left and with insort_right.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value',          input: 'number' },
      ],
      template: 'import bisect\na = {$a}\nx = float({$x})\nleft = a.copy()\nbisect.insort_left(left, x)\nright = a.copy()\nbisect.insort_right(right, x)\n(left, right)',
      cases: [
        { id: 'dupes', label: 'among equal items', values: { a: '1, 2, 2, 3', x: '2' } },
        { id: 'none',  label: 'no equal items',    values: { a: '1, 3', x: '2' } },
      ],
    },
  ],
  demoExplainer: 'Inserting 2.0 into 1, 2, 2, 3 gives [1, 2.0, 2, 2, 3] with insort_left and [1, 2, 2, 2.0, 3] with insort_right: 2.0 == 2, so the only difference is which side of the existing 2s it lands on. With no equal items both give the same list. On the unsorted start 5, 1, 3 inserting 2 gives [5, 1, 2, 3] — no error, and the list is still unsorted.',

  patterns: [
    {
      name: 'Sorted list as you go',
      desc: 'Each new item lands in order; the list is always ready for bisect searches.',
      code: 'import bisect\nfor reading in stream:\n    bisect.insort_left(readings, reading)',
    },
    {
      name: 'Insert records by a field (3.10+)',
      desc: 'key= is applied to x as well, so pass the whole record.',
      code: 'import bisect\nbisect.insort_left(events, new_event, key=lambda e: e.time)',
    },
  ],

  examples: [
    { title: 'Insert in order',            code: 'import bisect\na = [1, 3, 5]\nbisect.insort_left(a, 4)\na', returns: '[1, 3, 4, 5]' },
    { title: 'Returns None',               code: 'import bisect\nprint(bisect.insort_left([1, 2], 3))',   returns: 'None' },
    { title: 'Before equal items',         code: 'import bisect\na = [1, 2]\nbisect.insort_left(a, 1.0)\na', returns: '[1.0, 1, 2]' },
    { title: 'Tuples sort by first item',  code: "import bisect\na = [(1, 'a'), (3, 'c')]\nbisect.insort_left(a, (2, 'b'))\na", returns: "[(1, 'a'), (2, 'b'), (3, 'c')]" },
    { title: 'Not on tuples',              code: 'import bisect\nbisect.insort_left((1, 2), 1)', returns: "AttributeError: 'tuple' object has no attribute 'insert'" },
  ],

  pitfalls: [
    {
      name: 'Inserting into an unsorted list',
      desc: 'insort does not sort; it only keeps an already sorted list sorted.',
      wrong: { label: 'unsorted', code: 'import bisect\na = [5, 1, 3]\nbisect.insort_left(a, 2)\na', output: '[5, 1, 2, 3]' },
      fix:   { label: 'sort once first', code: 'import bisect\na = sorted([5, 1, 3])\nbisect.insort_left(a, 2)\na', output: '[1, 2, 3, 5]' },
    },
    {
      name: 'Assigning the result',
      desc: 'Like list.insert, insort_left changes the list and returns None.',
      wrong: { label: 'a = insort_left(...)', code: 'import bisect\na = bisect.insort_left([1, 3], 2)\na is None', output: 'True' },
      fix:   { label: 'in place', code: 'import bisect\na = [1, 3]\nbisect.insort_left(a, 2)\na', output: '[1, 2, 3]' },
    },
  ],

  when: {
    use: [
      'Keeping a modest list sorted while items arrive',
      'Equal items must go before existing ones',
    ],
    avoid: [
      'Order among equal items does not matter → insort (same cost)',
      'Many inserts into a huge list → heapq, or sort once at the end',
    ],
  },

  notes: {
    cpython:   '_bisect_insort_left_impl: key(x) if key is given, internal_bisect_left, then PyList_Insert (or a.insert() for non-lists)',
    'Cost':    'O(log n) comparisons + O(n) element moves',
    'Versions': 'key= added in 3.10',
  },

  related: [
    { name: 'bisect.insort_right', slug: 'insort_right', when: 'Insert after equal items' },
    { name: 'bisect.bisect_left',  slug: 'bisect_left',  when: 'Find the position only' },
    { name: 'list.insert()',       slug: 'list-insert',  when: 'What does the actual insert', category: 'functions' },
    { name: 'bisect module',       slug: 'bisect',       when: 'Overview and grade lookup', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I insert into a sorted list in Python?',
      a: 'bisect.insort(a, x) (or insort_left to go before equal items). It finds the position with binary search and calls a.insert().',
    },
    {
      q: 'When does insort_left differ from insort_right?',
      a: 'Only when x compares equal to items already in the list: insort_left puts it before them, insort_right after. For numbers this is visible only if they differ in type or identity, like 2 and 2.0.',
    },
    {
      q: 'Is bisect.insort faster than append and sort?',
      a: 'For one insert into a sorted list, yes — O(n) instead of O(n log n). For many items added at once, extend then sort once instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/bisect.html#bisect.insort_left',
    meta:  'bisect.insort_left',
  },
};
