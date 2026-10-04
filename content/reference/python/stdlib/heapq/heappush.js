// content/reference/python/stdlib/heapq/heappush.js

export const meta = {
  slug:        'heappush',
  name:        'heapq.heappush',
  signature:   'heapq.heappush(heap, item)',
  blurb:       'Add an item to a heap (a list) in O(log n), keeping the smallest item at heap[0].',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'heapq heappush push heap add to priority queue insert min heap python heapq.heappush sift down tuple priority not supported between instances',
};

export const method = {
  slug:      'heappush',
  name:      'heapq.heappush',
  signature: 'heapq.heappush(heap, item)',
  returns:   { type: 'None', desc: 'The list is changed in place.' },

  category:    'heapq function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Appends the item, then swaps it upwards past every parent that is larger — at most log2(n) swaps. The rest of the list is left alone, which is why a heap is not a sorted list.',

  covers: ['heappush'],

  cheat: {
    commonCall: 'heapq.heappush(heap, (priority, task))',
    returns:    'None — heap is modified in place',
    replaces:   'list.append() followed by list.sort()',
    watchOut:   'Equal priorities compare the next tuple item',
  },

  parameters: [
    { name: 'heap', type: 'list',   required: true, default: null, desc: 'A list that already satisfies the heap invariant — [] or the result of heapify(). Positional only; must be a real list.' },
    { name: 'item', type: 'object', required: true, default: null, desc: 'Anything that can be compared with < against the items already in the heap. Positional only.' },
  ],

  modes: [
    {
      id: 'trace',
      label: 'push one by one',
      blurb: 'Push each number onto an empty heap and record the list after every push. Watch the new item move towards the front.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import heapq\nheap = []\ntrace = []\nfor x in {$nums}:\n    heapq.heappush(heap, x)\n    trace.append(heap.copy())\ntrace',
      cases: [
        { id: 'mixed',   label: 'mixed',      values: { nums: '5, 3, 8, 1, 4' } },
        { id: 'falling', label: 'descending', values: { nums: '9, 7, 5, 3, 1' } },
        { id: 'rising',  label: 'ascending',  values: { nums: '1, 2, 3, 4' } },
      ],
    },
    {
      id: 'onto',
      label: 'push onto a heap',
      blurb: 'heapify a list, then push one more item. Only the path from the new last slot up to the root changes.',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'item', type: 'int',               hint: 'item to push',           input: 'number' },
      ],
      template: 'import heapq\nheap = {$nums}\nheapq.heapify(heap)\nbefore = heap.copy()\nheapq.heappush(heap, {$item})\n(before, heap)',
      cases: [
        { id: 'newmin', label: 'new minimum', values: { nums: '2, 4, 6, 8, 10, 12', item: '1' } },
        { id: 'large',  label: 'large item',  values: { nums: '2, 4, 6, 8, 10, 12', item: '20' } },
        { id: 'empty',  label: 'empty heap',  values: { nums: '', item: '7' } },
      ],
    },
  ],
  demoExplainer: 'For 5, 3, 8, 1, 4 the trace ends at [1, 3, 8, 5, 4]: the heap was [3, 5, 8], so 1 was appended at index 3, swapped with its parent 5 (index 1) and then with 3 (index 0). A descending input makes every push travel to the root; an ascending input never moves anything, so the heap stays in sorted order. Pushing 1 onto the heapified 2, 4, 6, 8, 10, 12 moves it from index 6 to index 2 and then to index 0.',

  patterns: [
    {
      name: 'Priority queue entry',
      desc: 'Priority first, a unique counter second, the payload last.',
      code: 'import heapq, itertools\ncounter = itertools.count()\nheapq.heappush(queue, (priority, next(counter), task))',
    },
    {
      name: 'Bounded heap',
      desc: 'Push, then drop the smallest when the heap grows past k — the k largest remain.',
      code: 'import heapq\nheapq.heappush(top, x)\nif len(top) > k:\n    heapq.heappop(top)',
    },
    {
      name: 'Max-heap entry',
      desc: 'Negate the key; the item with the largest score comes out first.',
      code: 'import heapq\nheapq.heappush(heap, (-score, name))',
    },
  ],

  examples: [
    { title: 'Push onto an empty list',    code: 'import heapq\nheap = []\nheapq.heappush(heap, 4)\nheapq.heappush(heap, 1)\nheapq.heappush(heap, 7)\nheap', returns: '[1, 4, 7]' },
    { title: 'Returns None',               code: 'import heapq\nheap = [1, 5]\nprint(heapq.heappush(heap, 3))\nheap', returns: 'None\n[1, 5, 3]' },
    { title: 'New minimum moves to index 0', code: 'import heapq\nheap = [2, 4, 6, 8]\nheapq.heappush(heap, 1)\nheap', returns: '[1, 2, 6, 8, 4]' },
    { title: 'Tuples: priority first',     code: "import heapq\nheap = []\nheapq.heappush(heap, (2, 'write'))\nheapq.heappush(heap, (1, 'plan'))\nheap[0]", returns: "(1, 'plan')" },
    { title: 'Equal priorities compare the next item', code: "import heapq\nheap = []\nheapq.heappush(heap, (1, 'b'))\nheapq.heappush(heap, (1, 'a'))\nheap[0]", returns: "(1, 'a')" },
    { title: 'Only real lists',            code: 'import heapq\nheapq.heappush((1, 2), 3)', returns: 'TypeError: heappush() argument 1 must be list, not tuple' },
    { title: 'Items must be comparable',   code: "import heapq\nheap = [1]\nheapq.heappush(heap, 'a')", returns: "TypeError: '<' not supported between instances of 'str' and 'int'" },
  ],

  pitfalls: [
    {
      name: 'Uncomparable payloads on equal priorities',
      desc: 'With (priority, payload) tuples, a tie makes Python compare the payloads. None and str cannot be ordered — add a counter between them.',
      wrong: { label: '(priority, payload)', code: "import heapq\nheap = []\nheapq.heappush(heap, (1, 'email'))\nheapq.heappush(heap, (1, None))", output: "TypeError: '<' not supported between instances of 'NoneType' and 'str'" },
      fix:   { label: 'add a counter', code: "import heapq, itertools\ncount = itertools.count()\nheap = []\nheapq.heappush(heap, (1, next(count), 'email'))\nheapq.heappush(heap, (1, next(count), None))\nheap", output: "[(1, 0, 'email'), (1, 1, None)]" },
    },
    {
      name: 'append() instead of heappush()',
      desc: 'Appending skips the sift-up, so the invariant breaks and heap[0] is no longer the minimum.',
      wrong: { label: 'append', code: 'import heapq\nheap = [2, 4, 6]\nheap.append(1)\nheap[0]', output: '2' },
      fix:   { label: 'heappush', code: 'import heapq\nheap = [2, 4, 6]\nheapq.heappush(heap, 1)\nheap[0]', output: '1' },
    },
  ],

  when: {
    use: [
      'Adding one item at a time to a priority queue',
      'Building a heap incrementally while items arrive',
    ],
    avoid: [
      'You already have all the items → heapify(list) is O(n) instead of O(n log n)',
      'Push followed immediately by pop → heappushpop',
    ],
  },

  notes: {
    cpython:      '_heapq_heappush_impl → PyList_Append, then siftdown() from the last index towards index 0',
    'Comparisons': 'Only newitem < parent; stops at the first parent that is not larger',
    'Arguments':  'Both positional-only; the heap must be a list or a list subclass',
  },

  related: [
    { name: 'heapq.heappop',     slug: 'heappop',     when: 'Take the smallest back out' },
    { name: 'heapq.heapify',     slug: 'heapify',     when: 'Build a heap from a full list at once' },
    { name: 'heapq.heappushpop', slug: 'heappushpop', when: 'Push and pop in one step' },
    { name: 'heapq module',      slug: 'heapq',       when: 'Overview and priority queues', category: 'stdlib' },
    { name: 'bisect.insort',     slug: 'insort_right', when: 'Keep a list fully sorted instead', category: 'stdlib/bisect' },
  ],

  faq: [
    {
      q: 'Why does heappush raise "< not supported between instances"?',
      a: 'Two items with equal priority made Python compare the next element of the tuples, and those payloads cannot be ordered (dicts, None, custom objects). Insert a unique counter: (priority, next(counter), payload).',
    },
    {
      q: 'What is the time complexity of heappush?',
      a: 'O(log n): the item starts at the end and swaps with its parent at most once per tree level.',
    },
    {
      q: 'Can I push onto any list?',
      a: 'The list must already be a heap — [] or a list passed through heapify(). Pushing onto an arbitrary list gives no error, but heap[0] is then not guaranteed to be the minimum.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html#heapq.heappush',
    meta:  'heapq.heappush',
  },
};
