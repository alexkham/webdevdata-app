// content/reference/python/stdlib/heapq/nlargest-nsmallest.js

export const meta = {
  slug:        'nlargest-nsmallest',
  name:        'heapq.nlargest / nsmallest',
  signature:   'heapq.nlargest(n, iterable, key=None)',
  blurb:       'The n largest or n smallest items of any iterable, sorted — top-k without sorting everything.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'heapq nlargest nsmallest top k largest smallest n biggest values top 10 python heapq.nlargest heapq.nsmallest key top n items',
};

export const method = {
  slug:      'nlargest-nsmallest',
  name:      'heapq.nlargest / nsmallest',
  signature: 'heapq.nlargest(n, iterable, key=None)',
  returns:   { type: 'list', desc: 'Up to n items: largest first for nlargest, smallest first for nsmallest.' },

  category:    'heapq function',
  version:     'Python 2.4+ (key 2.5+)',
  hasLiveDemo: true,

  subtitle: 'nlargest(n, data) equals sorted(data, reverse=True)[:n] and nsmallest(n, data) equals sorted(data)[:n] — including which of several equal items you get — but for a small n they only keep n items in memory.',

  covers: ['nlargest', 'nsmallest'],

  cheat: {
    commonCall: "heapq.nlargest(3, rows, key=lambda r: r['score'])",
    returns:    'a sorted list of at most n items',
    replaces:   'sorted(data, reverse=True)[:n]',
    watchOut:   'n = 1 → use max() / min(); n near len(data) → use sorted()',
  },

  parameters: [
    { name: 'n',        type: 'int',      required: true,  default: null,   desc: 'How many items. 0 or negative gives []; n >= len(data) returns everything, sorted.' },
    { name: 'iterable', type: 'iterable', required: true,  default: null,   desc: 'Any iterable: list, generator, dict (iterates the keys), file …' },
    { name: 'key',      type: 'callable', required: false, default: 'None', desc: 'One-argument function giving the comparison key, as in sorted(). The items themselves are returned, not the keys.' },
  ],

  modes: [
    {
      id: 'both',
      label: 'smallest + largest',
      blurb: 'Both functions on the same numbers. Each result is sorted: smallest-first and largest-first.',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'n',    type: 'int',               hint: 'how many',               input: 'number' },
      ],
      template: 'import heapq\n(heapq.nsmallest({$n}, {$nums}), heapq.nlargest({$n}, {$nums}))',
      cases: [
        { id: 'three', label: 'n = 3',        values: { nums: '7, 2, 9, 4, 1, 8', n: '3' } },
        { id: 'ties',  label: 'ties',         values: { nums: '5, 1, 5, 1, 3', n: '2' } },
        { id: 'big',   label: 'n > len',      values: { nums: '3, 1, 2', n: '5' } },
        { id: 'neg',   label: 'n negative',   values: { nums: '3, 1, 2', n: '-1' } },
      ],
    },
    {
      id: 'key',
      label: 'key=abs',
      blurb: 'With a key, items are ranked by key(item) but returned unchanged.',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'n',    type: 'int',               hint: 'how many',               input: 'number' },
      ],
      template: 'import heapq\nheapq.nlargest({$n}, {$nums}, key=abs)',
      cases: [
        { id: 'abs',  label: 'largest magnitude', values: { nums: '1, -5, 3, -2, 4', n: '2' } },
        { id: 'tie',  label: '-3 vs 3',           values: { nums: '-3, 1, 3, 2', n: '1' } },
      ],
    },
  ],
  demoExplainer: 'With key=abs, -5 counts as 5, so nlargest(2, [1, -5, 3, -2, 4], key=abs) is [-5, 4] — the original items, ranked by magnitude. On a tie the item seen first wins: -3 and 3 have the same key, and nlargest(1, …) returns -3. A negative n behaves like 0 and returns an empty list.',

  patterns: [
    {
      name: 'Top n records by a field',
      desc: 'key works exactly like in sorted().',
      code: "import heapq\ntop = heapq.nlargest(10, products, key=lambda p: p['sales'])",
    },
    {
      name: 'Most common words without Counter',
      desc: 'Rank dict keys by their values.',
      code: 'import heapq\ncommon = heapq.nlargest(5, counts, key=counts.get)',
    },
    {
      name: 'Smallest n of a huge file',
      desc: 'Only n lines are kept in memory at any time.',
      code: 'import heapq\nwith open("numbers.txt") as f:\n    lowest = heapq.nsmallest(100, map(float, f))',
    },
  ],

  examples: [
    { title: 'Top three',                code: 'import heapq\nheapq.nlargest(3, [7, 2, 9, 4, 1, 8])',  returns: '[9, 8, 7]' },
    { title: 'Bottom three',             code: 'import heapq\nheapq.nsmallest(3, [7, 2, 9, 4, 1, 8])', returns: '[1, 2, 4]' },
    { title: 'Records by a key',         code: "import heapq\nrows = [{'n': 'a', 'p': 3}, {'n': 'b', 'p': 9}, {'n': 'c', 'p': 5}]\n[r['n'] for r in heapq.nlargest(2, rows, key=lambda r: r['p'])]", returns: "['b', 'c']" },
    { title: 'Case-insensitive',         code: "import heapq\nheapq.nlargest(2, ['a', 'B', 'c'], key=str.lower)", returns: "['c', 'B']" },
    { title: 'First of equal items wins', code: 'import heapq\nheapq.nlargest(2, [3, 3.0, 1])',      returns: '[3, 3.0]' },
    { title: 'A dict gives its keys',    code: "import heapq\nheapq.nsmallest(2, {'b': 2, 'a': 1, 'c': 3})", returns: "['a', 'b']" },
    { title: 'n = 0',                    code: 'import heapq\nheapq.nsmallest(0, [3, 1, 2])',         returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'Passing the arguments in the wrong order',
      desc: 'n comes first, the data second — the reverse of what many people expect.',
      wrong: { label: 'data first', code: 'import heapq\nheapq.nlargest([7, 2, 9], 2)', output: "TypeError: 'int' object is not iterable" },
      fix:   { label: 'n first', code: 'import heapq\nheapq.nlargest(2, [7, 2, 9])', output: '[9, 7]' },
    },
    {
      name: 'Expecting the keys back',
      desc: 'With key=, the original items are returned, not key(item). Apply the key yourself if you want the values.',
      wrong: { label: 'items', code: 'import heapq\nheapq.nlargest(2, [-7, 3, 5], key=abs)', output: '[-7, 5]' },
      fix:   { label: 'map first', code: 'import heapq\nheapq.nlargest(2, map(abs, [-7, 3, 5]))', output: '[7, 5]' },
    },
  ],

  when: {
    use: [
      'Top-k / bottom-k with k much smaller than the data',
      'Iterables too big to sort in memory (generators, files)',
    ],
    avoid: [
      'k = 1 → max() / min()',
      'k close to len(data), or you need everything sorted → sorted()',
      'Repeated queries on changing data → keep a real heap with heappush/heappop',
    ],
  },

  notes: {
    cpython:   'Lib/heapq.py: n == 1 calls min()/max(); a sized input with n >= len() calls sorted(); otherwise a heap of n (item, order) or (key, order, item) tuples, where order keeps the result identical to sorted()',
    'Cost':    'About O(len(data) · log n) comparisons and O(n) memory',
    'Versions': 'Added in 2.4; key argument in 2.5',
  },

  related: [
    { name: 'sorted()',      slug: 'sorted', when: 'Everything sorted, or n close to len', category: 'functions' },
    { name: 'max()',         slug: 'max',    when: 'Just the largest one', category: 'functions' },
    { name: 'min()',         slug: 'min',    when: 'Just the smallest one', category: 'functions' },
    { name: 'Counter.most_common', slug: 'counter-most_common', when: 'Top n by count', category: 'stdlib/collections' },
    { name: 'heapq module',  slug: 'heapq',  when: 'Overview and priority queues', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the top 10 values of a list in Python?',
      a: 'heapq.nlargest(10, values) — or sorted(values, reverse=True)[:10], which gives the same list. nlargest is faster when the list is large and n is small.',
    },
    {
      q: 'Is heapq.nlargest faster than sorted?',
      a: 'For small n on large inputs, yes: it keeps only n items in a heap. When n is close to the input size, CPython itself switches to sorted() (for inputs with a length), and for n == 1 it calls max().',
    },
    {
      q: 'Which item is returned when values are equal?',
      a: 'The same one sorted() would return: the item that appears first in the input comes first among equals, for both nlargest and nsmallest.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html#heapq.nlargest',
    meta:  'heapq.nlargest, heapq.nsmallest',
  },
};
