// content/reference/python/stdlib/bisect/insort_right.js

export const meta = {
  slug:        'insort_right',
  name:        'bisect.insort_right / insort',
  signature:   'bisect.insort_right(a, x, lo=0, hi=len(a), *, key=None)',
  blurb:       'Insert x into a sorted list, keeping it sorted — after any items equal to x. bisect.insort is the same function.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.1+',
  searchTerms: 'bisect insort insort_right bisect.insort insert into sorted list keep sorted python sorted insert key descending list stable insert',
};

export const method = {
  slug:      'insort_right',
  name:      'bisect.insort_right / insort',
  signature: 'bisect.insort_right(a, x, lo=0, hi=len(a), *, key=None)',
  returns:   { type: 'None', desc: 'The list is changed in place.' },

  category:    'bisect function',
  version:     'Python 2.1+ (key 3.10+)',
  hasLiveDemo: true,

  subtitle: 'The everyday "insert into a sorted list". Equal items keep arrival order, because each newcomer goes after the ones already there. With key=, the key is applied to x too — unlike the bisect functions.',

  covers: ['insort_right', 'insort'],

  cheat: {
    commonCall: 'bisect.insort(a, x)',
    returns:    'None — a is modified in place',
    replaces:   'a.append(x); a.sort()',
    watchOut:   'The list must already be sorted (by key)',
  },

  parameters: [
    { name: 'a',   type: 'list',     required: true,  default: null,     desc: 'A sorted mutable sequence with an insert() method.' },
    { name: 'x',   type: 'object',   required: true,  default: null,     desc: 'The item to insert; with key=, key(x) is used for the search.' },
    { name: 'lo',  type: 'int',      required: false, default: '0',      desc: 'Start of the slice to search; must be >= 0.' },
    { name: 'hi',  type: 'int',      required: false, default: 'len(a)', desc: 'End of the slice to search.' },
    { name: 'key', type: 'callable', required: false, default: 'None',   desc: 'Keyword-only (3.10+). Applied to the list items and to x.' },
  ],

  modes: [
    {
      id: 'trace',
      label: 'insert one by one',
      blurb: 'insort each value into the starting list and record the list after every insert.',
      params: [
        { name: 'a',      type: 'list[int | float]', hint: 'sorted starting list', input: 'csv-num' },
        { name: 'values', type: 'list[int | float]', hint: 'values to insert',     input: 'csv-num' },
      ],
      template: 'import bisect\na = {$a}\ntrace = []\nfor x in {$values}:\n    bisect.insort(a, x)\n    trace.append(a.copy())\ntrace',
      cases: [
        { id: 'basic', label: 'four inserts', values: { a: '10, 20, 30', values: '25, 5, 20, 35' } },
        { id: 'empty', label: 'from empty',   values: { a: '', values: '2.5, 1, 2' } },
      ],
    },
    {
      id: 'descending',
      label: 'descending list',
      blurb: 'A list sorted high to low, kept that way with key=lambda v: -v. insort applies the key to x as well.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'numbers, high to low', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value to insert',      input: 'number' },
      ],
      template: 'import bisect\na = {$a}\nbisect.insort(a, {$x}, key=lambda v: -v)\na',
      cases: [
        { id: 'mid',  label: 'x = 5',  values: { a: '9, 7, 4', x: '5' } },
        { id: 'top',  label: 'x = 10', values: { a: '9, 7, 4', x: '10' } },
      ],
    },
  ],
  demoExplainer: 'Inserting 20 into 5, 10, 20, 25, 30 puts the new 20 after the existing one, at index 3. In the descending list, key=lambda v: -v turns 9, 7, 4 into the ascending keys -9, -7, -4, and x = 5 becomes -5, so it lands between 7 and 4: [9, 7, 5, 4]. Without the key it would go to the front.',

  patterns: [
    {
      name: 'Leaderboard',
      desc: 'Keep (score, name) pairs sorted on every insert.',
      code: 'import bisect\nbisect.insort(board, (score, name))\ntop3 = board[-3:][::-1]',
    },
    {
      name: 'Records by a field (3.10+)',
      desc: 'Pass the whole record; key extracts the sort field from it and from the list items.',
      code: 'import bisect\nbisect.insort(movies, new_movie, key=lambda m: m.released)',
    },
  ],

  examples: [
    { title: 'Insert in order',          code: 'import bisect\na = [10, 20, 30]\nbisect.insort(a, 25)\na', returns: '[10, 20, 25, 30]' },
    { title: 'insort is insort_right',   code: 'import bisect\nbisect.insort is bisect.insort_right', returns: 'True' },
    { title: 'After equal items',        code: 'import bisect\na = [1, 2]\nbisect.insort(a, 1.0)\na', returns: '[1, 1.0, 2]' },
    { title: 'Records with key=',        code: "import bisect\nrows = [('ann', 25), ('bob', 31)]\nbisect.insort(rows, ('cy', 28), key=lambda r: r[1])\nrows", returns: "[('ann', 25), ('cy', 28), ('bob', 31)]" },
    { title: 'Descending list via key',  code: 'import bisect\na = [9, 7, 4]\nbisect.insort(a, 5, key=lambda v: -v)\na', returns: '[9, 7, 5, 4]' },
  ],

  pitfalls: [
    {
      name: 'Passing the key value instead of the record',
      desc: 'insort applies key to x, and inserts x itself. Give it the whole record — a bare key value gets the key applied a second time.',
      wrong: { label: 'key value', code: "import bisect\nrows = [('ann', 25), ('bob', 31)]\nbisect.insort(rows, 28, key=lambda r: r[1])", output: "TypeError: 'int' object is not subscriptable" },
      fix:   { label: 'whole record', code: "import bisect\nrows = [('ann', 25), ('bob', 31)]\nbisect.insort(rows, ('cy', 28), key=lambda r: r[1])\nrows[1]", output: "('cy', 28)" },
    },
    {
      name: 'Descending list without a key',
      desc: 'insort assumes ascending order; on a descending list it inserts in the wrong place, silently.',
      wrong: { label: 'no key', code: 'import bisect\na = [9, 7, 4]\nbisect.insort(a, 5)\na', output: '[5, 9, 7, 4]' },
      fix:   { label: 'key=lambda v: -v', code: 'import bisect\na = [9, 7, 4]\nbisect.insort(a, 5, key=lambda v: -v)\na', output: '[9, 7, 5, 4]' },
    },
  ],

  when: {
    use: [
      'Keeping a list sorted as items arrive, with equal items in arrival order',
      'Small leaderboards, schedules, sorted logs',
    ],
    avoid: [
      'Equal items must go first → insort_left',
      'Only the minimum is ever needed → heapq (O(log n) insert)',
      'Bulk loading → extend, then sort once',
    ],
  },

  notes: {
    cpython:    '_bisect_insort_right_impl: key(x) if key is given, internal_bisect_right, then list.insert',
    'Alias':    'bisect.insort is bisect.insort_right (same object)',
    'Versions': 'key= added in 3.10',
  },

  related: [
    { name: 'bisect.insort_left',  slug: 'insort_left',  when: 'Insert before equal items' },
    { name: 'bisect.bisect_right', slug: 'bisect_right', when: 'Find the position only' },
    { name: 'heapq.heappush',      slug: 'heappush',     when: 'Cheaper inserts when only the minimum matters', category: 'stdlib/heapq' },
    { name: 'bisect module',       slug: 'bisect',       when: 'Overview and grade lookup', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is bisect.insort the same as insort_right?',
      a: 'Yes: bisect.insort is bisect.insort_right is True.',
    },
    {
      q: 'Why does insort with key= raise TypeError or "not subscriptable"?',
      a: 'insort calls key(x) on the item you insert, so x must be a full record of the same shape as the list items — not the key value. (The bisect functions are the opposite: they want the key value.)',
    },
    {
      q: 'How do I keep a list sorted in descending order?',
      a: 'bisect.insort(a, x, key=lambda v: -v) for numbers (3.10+), or store negated values, or insert into an ascending list and read it reversed.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/bisect.html#bisect.insort_right',
    meta:  'bisect.insort_right, bisect.insort',
  },
};
