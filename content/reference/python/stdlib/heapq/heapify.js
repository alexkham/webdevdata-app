// content/reference/python/stdlib/heapq/heapify.js

export const meta = {
  slug:        'heapify',
  name:        'heapq.heapify',
  signature:   'heapq.heapify(x)',
  blurb:       'Rearrange a list into heap order in place, in linear time — the fast way to turn existing data into a priority queue.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'heapq heapify make heap from list build heap in place linear time python heapq.heapify min heap order returns none',
};

export const method = {
  slug:      'heapify',
  name:      'heapq.heapify',
  signature: 'heapq.heapify(x)',
  returns:   { type: 'None', desc: 'The list is rearranged in place.' },

  category:    'heapq function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Sifts every parent node down, from the last parent back to the root. The result is a valid heap — smallest at index 0 — but generally a different layout from pushing the same items one by one.',

  covers: ['heapify'],

  cheat: {
    commonCall: 'heapq.heapify(items)',
    returns:    'None — items itself becomes the heap',
    replaces:   'n separate heappush calls (O(n log n))',
    watchOut:   'Returns None: heap = heapify(items) loses the list',
  },

  parameters: [
    { name: 'x', type: 'list', required: true, default: null, desc: 'The list to rearrange. Must be a real list (or subclass); positional only.' },
  ],

  modes: [
    {
      id: 'heapify',
      label: 'heapify',
      blurb: 'Type any list. After heapify the smallest number is first; the rest is only partially ordered.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import heapq\ndata = {$nums}\nheapq.heapify(data)\ndata',
      cases: [
        { id: 'six',     label: 'six numbers', values: { nums: '5, 1, 8, 3, 2, 9' } },
        { id: 'reverse', label: 'descending',  values: { nums: '9, 8, 7, 6, 5, 4, 3, 2, 1' } },
        { id: 'sorted',  label: 'already sorted', values: { nums: '1, 2, 3, 4, 5' } },
      ],
    },
    {
      id: 'levels',
      label: 'tree levels',
      blurb: 'The same heap cut into tree levels: index 0, then 1-2, then 3-6, and so on. Every item is no larger than the two below it.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import heapq\ndata = {$nums}\nheapq.heapify(data)\n[data[2**k - 1:2**(k + 1) - 1] for k in range(len(data).bit_length())]',
      cases: [
        { id: 'nine',  label: 'nine numbers', values: { nums: '9, 8, 7, 6, 5, 4, 3, 2, 1' } },
        { id: 'six',   label: 'six numbers',  values: { nums: '5, 1, 8, 3, 2, 9' } },
        { id: 'empty', label: 'empty',        values: { nums: '' } },
      ],
    },
  ],
  demoExplainer: 'Heapifying 9, 8, 7, 6, 5, 4, 3, 2, 1 gives [1, 2, 3, 6, 5, 4, 7, 8, 9] — levels [1], [2, 3], [6, 5, 4, 7], [8, 9]. Within a level nothing is sorted (6 comes before 5 and 4); only each parent-to-child step goes upwards. A list that is already sorted is already a heap and is left unchanged.',

  patterns: [
    {
      name: 'Priority queue from existing data',
      desc: 'Build the tuples first, heapify once.',
      code: 'import heapq\nqueue = [(task.priority, i, task) for i, task in enumerate(tasks)]\nheapq.heapify(queue)',
    },
    {
      name: 'Keep the original list',
      desc: 'heapify works in place — copy first if you still need the original order.',
      code: 'import heapq\nheap = list(items)\nheapq.heapify(heap)',
    },
    {
      name: 'Repair after manual edits',
      desc: 'After removing or changing items directly, re-heapify (O(n)).',
      code: 'import heapq\nheap.remove(item)\nheapq.heapify(heap)',
    },
  ],

  examples: [
    { title: 'Smallest moves to the front', code: 'import heapq\ndata = [5, 1, 8, 3, 2, 9]\nheapq.heapify(data)\ndata', returns: '[1, 2, 8, 3, 5, 9]' },
    { title: 'Returns None',                code: 'import heapq\nprint(heapq.heapify([3, 1, 2]))', returns: 'None' },
    { title: 'A sorted list is already a heap', code: 'import heapq\ndata = [1, 2, 3, 4]\nheapq.heapify(data)\ndata', returns: '[1, 2, 3, 4]' },
    { title: 'Strings compare by code point', code: "import heapq\nwords = ['pear', 'Apple', 'fig']\nheapq.heapify(words)\nwords[0]", returns: "'Apple'" },
    { title: 'Not a list',                  code: "import heapq\nheapq.heapify('hello')", returns: 'TypeError: heapify() argument must be list, not str' },
    { title: 'Then pop in order',           code: 'import heapq\ndata = [4, 1, 3]\nheapq.heapify(data)\n[heapq.heappop(data) for _ in range(3)]', returns: '[1, 3, 4]' },
  ],

  pitfalls: [
    {
      name: 'Assigning the result',
      desc: 'heapify changes the list in place and returns None, like list.sort().',
      wrong: { label: 'heap = heapify(...)', code: 'import heapq\nheap = heapq.heapify([3, 1, 2])\nheap is None', output: 'True' },
      fix:   { label: 'in place', code: 'import heapq\nheap = [3, 1, 2]\nheapq.heapify(heap)\nheap', output: '[1, 3, 2]' },
    },
    {
      name: 'Heapifying a tuple or other iterable',
      desc: 'Only lists can be heapified; convert first.',
      wrong: { label: 'tuple', code: 'import heapq\nheapq.heapify((3, 1, 2))', output: 'TypeError: heapify() argument must be list, not tuple' },
      fix:   { label: 'list(...)', code: 'import heapq\nheap = list((3, 1, 2))\nheapq.heapify(heap)\nheap[0]', output: '1' },
    },
  ],

  when: {
    use: [
      'Turning a full list into a heap before popping',
      'Restoring the invariant after editing the list directly',
    ],
    avoid: [
      'Fully sorted output needed now → sorted() (also O(n log n), and simpler)',
      'Just the k smallest → heapq.nsmallest',
    ],
  },

  notes: {
    cpython:      'heapify_internal: siftup() on indexes n//2 - 1 down to 0; lists longer than 2500 use cache_friendly_heapify, which visits the same subtrees in a cache-friendlier order and produces the same heap',
    'Cost':       'O(n) — linear in the length of the list',
    'In place':   'No new list is created; the function returns None',
  },

  related: [
    { name: 'heapq.heappush', slug: 'heappush', when: 'Add items one at a time instead' },
    { name: 'heapq.heappop',  slug: 'heappop',  when: 'Take items out in order' },
    { name: 'list.sort()',    slug: 'list-sort', when: 'Full sort, also in place', category: 'functions' },
    { name: 'heapq module',   slug: 'heapq',    when: 'Overview and priority queues', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is heapify faster than pushing items one at a time?',
      a: 'Yes. heapify is O(n); n heappush calls are O(n log n). The two can also produce different (equally valid) list layouts.',
    },
    {
      q: 'Why does heapq.heapify return None?',
      a: 'It rearranges the list you pass in place, like list.sort(). Keep using the same variable: heapify(data), then heappop(data).',
    },
    {
      q: 'Does heapify sort the list?',
      a: 'No — it only guarantees heap order: data[0] is the smallest and every parent is no larger than its children. A sorted list is a valid heap, but a heap is usually not sorted.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html#heapq.heapify',
    meta:  'heapq.heapify',
  },
};
