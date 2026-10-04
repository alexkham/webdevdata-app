// content/reference/python/stdlib/heapq/index.js — the heapq module hub

export const meta = {
  slug:        'index',
  name:        'heapq',
  signature:   'import heapq',
  blurb:       'Priority queues on a plain list: heappush, heappop and heapify keep the smallest item at index 0; nlargest, nsmallest and merge are built on top.',
  category:    'functional',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'heapq module python heap priority queue min heap max heap binary heap heappush heappop heapify heapreplace heappushpop merge nlargest nsmallest top k smallest largest scheduler dijkstra',
};

export const method = {
  slug: 'index',
  name: 'heapq',

  category:    'Iterators & containers',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'There is no heap class: a heap is an ordinary list that the heapq functions keep in heap order, so heap[0] is always the smallest item. The rest of the list is NOT sorted — only partially ordered.',

  imports: ['import heapq', 'from heapq import heappush, heappop, heapify'],
  facts: [
    { label: 'Public API', value: 'heappush, heappop, heapify, heapreplace, heappushpop, merge, nlargest, nsmallest' },
    { label: 'Invariant',  value: 'heap[k] <= heap[2*k+1] and heap[k] <= heap[2*k+2] for every k — a binary tree stored level by level' },
    { label: 'Cost',       value: 'push and pop O(log n), heapify O(n), heap[0] O(1)' },
    { label: 'Min-heap',   value: 'Smallest first. Python 3.14 adds heapify_max, heappush_max, heappop_max, heappushpop_max and heapreplace_max; before that, push negated numbers' },
    { label: 'Speed',      value: 'The core functions are C (Modules/_heapqmodule.c); merge, nlargest and nsmallest are Python (Lib/heapq.py)' },
  ],

  modes: [
    {
      id: 'heapsort',
      label: 'push, then pop',
      blurb: 'Push every number onto an empty heap, look at the list as it is stored, then pop everything. The stored list is only heap-ordered; the pops come out sorted.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import heapq\nheap = []\nfor x in {$nums}:\n    heapq.heappush(heap, x)\nas_stored = heap.copy()\npopped = [heapq.heappop(heap) for _ in range(len(heap))]\n(as_stored, popped)',
      cases: [
        { id: 'basic',  label: 'six numbers', values: { nums: '5, 1, 8, 3, 2, 9' } },
        { id: 'dupes',  label: 'duplicates',  values: { nums: '4, 4, 1, 4, 1' } },
        { id: 'floats', label: 'int + float', values: { nums: '2, 1.5, 3, 0.5' } },
        { id: 'empty',  label: 'empty',       values: { nums: '' } },
      ],
    },
    {
      id: 'topk',
      label: 'n smallest / largest',
      blurb: 'nsmallest and nlargest return the n extreme values, sorted — without sorting the whole input.',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'n',    type: 'int',               hint: 'how many',               input: 'number' },
      ],
      template: 'import heapq\n(heapq.nsmallest({$n}, {$nums}), heapq.nlargest({$n}, {$nums}))',
      cases: [
        { id: 'three', label: 'n = 3',         values: { nums: '7, 2, 9, 4, 1, 8', n: '3' } },
        { id: 'big',   label: 'n > len',       values: { nums: '3, 1, 2', n: '10' } },
        { id: 'zero',  label: 'n = 0',         values: { nums: '3, 1, 2', n: '0' } },
      ],
    },
  ],
  demoExplainer: 'Pushing 5, 1, 8, 3, 2, 9 one at a time stores [1, 2, 8, 5, 3, 9]: 1 is at index 0, and every parent is no larger than its two children (index k has children 2k+1 and 2k+2), but 8 sits before 5 and 3. Heapifying the same list in one go gives a different, equally valid order — [1, 2, 8, 3, 5, 9] — so never rely on the exact layout, only on heap[0]. n larger than the input simply returns everything; n = 0 returns two empty lists.',

  patterns: [
    {
      name: 'Priority queue with a tie-breaker',
      desc: 'A counter between the priority and the payload keeps equal priorities in insertion order and never compares payloads.',
      code: 'import heapq, itertools\ncounter = itertools.count()\nqueue = []\nheapq.heappush(queue, (priority, next(counter), task))\npriority, _, task = heapq.heappop(queue)',
    },
    {
      name: 'Max-heap by negation',
      desc: 'heapq is a min-heap; push -x and negate on the way out (numbers only).',
      code: 'import heapq\nheap = []\nheapq.heappush(heap, -score)\nbest = -heapq.heappop(heap)',
    },
    {
      name: 'Top k of a huge stream',
      desc: 'Keep a k-item min-heap; heap[0] is the smallest of the k largest seen so far.',
      code: 'import heapq\ntop = []\nfor x in stream:\n    if len(top) < k:\n        heapq.heappush(top, x)\n    elif x > top[0]:\n        heapq.heapreplace(top, x)',
    },
    {
      name: 'Dijkstra shortest paths',
      desc: 'The classic heap user: always expand the closest unvisited node.',
      code: 'import heapq\ndist = {start: 0}\nqueue = [(0, start)]\nwhile queue:\n    d, node = heapq.heappop(queue)\n    if d > dist.get(node, float("inf")):\n        continue\n    for nxt, w in graph[node]:\n        if d + w < dist.get(nxt, float("inf")):\n            dist[nxt] = d + w\n            heapq.heappush(queue, (d + w, nxt))',
    },
  ],

  examples: [
    { title: 'Smallest item is always heap[0]', code: 'import heapq\nheap = []\nfor x in [5, 1, 8, 3]:\n    heapq.heappush(heap, x)\nheap[0]', returns: '1' },
    { title: 'The list is not sorted',          code: 'import heapq\nheap = []\nfor x in [5, 1, 8, 3, 2, 9]:\n    heapq.heappush(heap, x)\nheap', returns: '[1, 2, 8, 5, 3, 9]' },
    { title: 'Pop in priority order',           code: "import heapq\njobs = [(3, 'deploy'), (1, 'fix bug'), (2, 'review')]\nheapq.heapify(jobs)\n[heapq.heappop(jobs)[1] for _ in range(len(jobs))]", returns: "['fix bug', 'review', 'deploy']" },
    { title: 'Top 3',                           code: 'import heapq\nheapq.nlargest(3, [7, 2, 9, 4, 1, 8])', returns: '[9, 8, 7]' },
    { title: 'Merge sorted inputs lazily',      code: 'import heapq\nlist(heapq.merge([1, 4, 7], [2, 5, 8], [3, 6]))', returns: '[1, 2, 3, 4, 5, 6, 7, 8]' },
    { title: 'Max-heap by negation',            code: 'import heapq\nheap = []\nfor x in [5, 1, 8]:\n    heapq.heappush(heap, -x)\n-heap[0]', returns: '8' },
    { title: 'Popping an empty heap',           code: 'import heapq\nheapq.heappop([])', returns: 'IndexError: index out of range' },
  ],

  pitfalls: [
    {
      name: 'Equal priorities compare the payload',
      desc: 'Tuples compare item by item. When two priorities are equal Python compares the next element — and dicts (or most objects) cannot be ordered.',
      wrong: { label: '(priority, payload)', code: "import heapq\nheap = []\nheapq.heappush(heap, (1, {'job': 'a'}))\nheapq.heappush(heap, (1, {'job': 'b'}))", output: "TypeError: '<' not supported between instances of 'dict' and 'dict'" },
      fix:   { label: '(priority, count, payload)', code: "import heapq, itertools\ncount = itertools.count()\nheap = []\nheapq.heappush(heap, (1, next(count), {'job': 'a'}))\nheapq.heappush(heap, (1, next(count), {'job': 'b'}))\nheapq.heappop(heap)", output: "(1, 0, {'job': 'a'})" },
    },
    {
      name: 'Popping from a list that was never heapified',
      desc: 'heappop trusts that the list already is a heap. On an arbitrary list it just takes index 0.',
      wrong: { label: 'plain list', code: 'import heapq\nheap = [3, 1, 2]\nheapq.heappop(heap)', output: '3' },
      fix:   { label: 'heapify first', code: 'import heapq\nheap = [3, 1, 2]\nheapq.heapify(heap)\nheapq.heappop(heap)', output: '1' },
    },
  ],

  when: {
    use: [
      'Priority queues, schedulers, event simulations',
      'The k smallest or largest items of a big or streaming input',
      'Merging already-sorted files or iterators without loading them',
      'Graph algorithms: Dijkstra, A*, Prim',
    ],
    avoid: [
      'You need everything sorted → sorted() or list.sort()',
      'Only the single min or max → min() / max()',
      'A thread-safe queue between threads → queue.PriorityQueue',
      'Fast membership tests or removing arbitrary items → a dict or set alongside, or a sorted container',
    ],
  },

  notes: {
    cpython:      'Modules/_heapqmodule.c for heappush, heappop, heapify, heapreplace, heappushpop; Lib/heapq.py for merge, nlargest, nsmallest',
    'Comparisons': 'Only < is used — any items that support < work, including tuples and dataclasses with order=True',
    'Stability':  'Heaps are not stable: equal items can come out in any order unless you add a counter',
    'Max-heaps':  'Python 3.14 added public *_max functions; on 3.13 and earlier negate numbers or wrap items in a class with a reversed __lt__',
  },

  related: [
    { name: 'sorted()',      slug: 'sorted', when: 'Sort everything at once', category: 'functions' },
    { name: 'min()',         slug: 'min',    when: 'Only the single smallest item', category: 'functions' },
    { name: 'bisect module', slug: 'bisect', when: 'Keep a list fully sorted instead', category: 'stdlib' },
    { name: 'collections.deque', slug: 'deque', when: 'FIFO/LIFO queues without priorities', category: 'stdlib/collections' },
    { name: 'itertools.count', slug: 'count-cycle-repeat', when: 'Tie-breaker counter for priority tuples', category: 'stdlib/itertools' },
  ],

  faq: [
    {
      q: 'How do I make a max-heap in Python?',
      a: 'On Python 3.14+ use heapq.heapify_max, heappush_max and heappop_max. On older versions push negated numbers (heappush(h, -x), then -heappop(h)), or wrap items in a class whose __lt__ is reversed.',
    },
    {
      q: 'Why is my heap list not sorted?',
      a: 'A heap only guarantees that every parent is no larger than its children, so heap[0] is the minimum. The rest is partially ordered. Pop repeatedly (or call sorted(heap)) to get sorted output.',
    },
    {
      q: 'How do I peek at the smallest item without removing it?',
      a: 'Read heap[0]. It raises IndexError on an empty list, so check "if heap:" first.',
    },
    {
      q: 'heapq or queue.PriorityQueue?',
      a: 'queue.PriorityQueue wraps heapq with locks for passing work between threads. In single-threaded code use heapq directly — it is simpler and faster.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html',
    meta:  'heapq — Heap queue algorithm',
  },
};
