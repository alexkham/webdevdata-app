// content/reference/python/stdlib/heapq/heappop.js

export const meta = {
  slug:        'heappop',
  name:        'heapq.heappop',
  signature:   'heapq.heappop(heap)',
  blurb:       'Remove and return the smallest item of a heap in O(log n). IndexError on an empty heap.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'heapq heappop pop smallest remove min priority queue python heapq.heappop indexerror index out of range empty heap sift up',
};

export const method = {
  slug:      'heappop',
  name:      'heapq.heappop',
  signature: 'heapq.heappop(heap)',
  returns:   { type: 'object', desc: 'The smallest item (the old heap[0]).' },

  category:    'heapq function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Takes heap[0], moves the last item into the hole, and sifts it back down. Popping until the list is empty yields the items in sorted order — that is heapsort.',

  covers: ['heappop'],

  cheat: {
    commonCall: 'priority, task = heapq.heappop(queue)',
    returns:    'the smallest item; the list shrinks by one',
    replaces:   'list.pop(list.index(min(list))) — O(n)',
    watchOut:   'IndexError: index out of range on an empty heap',
  },

  parameters: [
    { name: 'heap', type: 'list', required: true, default: null, desc: 'A list in heap order (built with heappush or heapify). Positional only.' },
  ],

  modes: [
    {
      id: 'drain',
      label: 'pop until empty',
      blurb: 'heapify the numbers, then pop again and again. Each step shows the popped item and the list left behind.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import heapq\nheap = {$nums}\nheapq.heapify(heap)\nsteps = []\nwhile heap:\n    smallest = heapq.heappop(heap)\n    steps.append((smallest, heap.copy()))\nsteps',
      cases: [
        { id: 'six',   label: 'six numbers', values: { nums: '5, 1, 8, 3, 2, 9' } },
        { id: 'dupes', label: 'duplicates',  values: { nums: '2, 1, 2, 1' } },
        { id: 'float', label: '1 vs 1.0',    values: { nums: '1.5, 1, 0.5' } },
      ],
    },
    {
      id: 'once',
      label: 'pop once',
      blurb: 'One pop. The result tuple is built left to right, so heap is shown after the pop.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import heapq\nheap = {$nums}\nheapq.heapify(heap)\n(heapq.heappop(heap), heap)',
      cases: [
        { id: 'five',  label: 'five numbers', values: { nums: '1, 3, 2, 7, 4' } },
        { id: 'one',   label: 'one item',     values: { nums: '42' } },
        { id: 'empty', label: 'empty heap',   values: { nums: '' } },
      ],
    },
  ],
  demoExplainer: 'The popped items always come out in ascending order, while the list left behind is only heap-ordered: popping 1 from the heapified 5, 1, 8, 3, 2, 9 leaves [2, 3, 8, 9, 5]. For "pop once" on 1, 3, 2, 7, 4 the last item 4 moves to the top, the smaller child 2 is promoted, and the result is (1, [2, 3, 4, 7]). An empty heap raises IndexError: index out of range — note the message does not say "list index".',

  patterns: [
    {
      name: 'Process a priority queue',
      desc: 'Loop while the heap is non-empty; never pop blindly.',
      code: 'import heapq\nwhile queue:\n    priority, _, task = heapq.heappop(queue)\n    run(task)',
    },
    {
      name: 'Heapsort',
      desc: 'heapify in O(n), then n pops in O(log n) each.',
      code: 'import heapq\nheapq.heapify(items)\nordered = [heapq.heappop(items) for _ in range(len(items))]',
    },
    {
      name: 'Peek instead of pop',
      desc: 'heap[0] reads the minimum without removing it.',
      code: 'import heapq\nif heap and heap[0] < limit:\n    item = heapq.heappop(heap)',
    },
  ],

  examples: [
    { title: 'Pop the smallest',           code: 'import heapq\nheap = [1, 3, 2]\nheapq.heappop(heap)', returns: '1' },
    { title: 'The list shrinks',           code: 'import heapq\nheap = [1, 3, 2, 7, 4]\nheapq.heappop(heap)\nheap', returns: '[2, 3, 4, 7]' },
    { title: 'Pops come out sorted',       code: 'import heapq\nheap = [7, 2, 9, 4]\nheapq.heapify(heap)\n[heapq.heappop(heap) for _ in range(len(heap))]', returns: '[2, 4, 7, 9]' },
    { title: 'Tuples: lowest priority first', code: "import heapq\nq = [(2, 'b'), (1, 'a')]\nheapq.heapify(q)\nheapq.heappop(q)", returns: "(1, 'a')" },
    { title: 'Empty heap',                 code: 'import heapq\nheapq.heappop([])', returns: 'IndexError: index out of range' },
    { title: 'Only real lists',            code: 'import heapq\nheapq.heappop((1, 2))', returns: 'TypeError: heappop() argument must be list, not tuple' },
  ],

  pitfalls: [
    {
      name: 'Popping a list that is not a heap',
      desc: 'heappop does not check the invariant. On an unheapified list it returns whatever is at index 0.',
      wrong: { label: 'raw list', code: 'import heapq\ndata = [5, 1, 3]\nheapq.heappop(data)', output: '5' },
      fix:   { label: 'heapify first', code: 'import heapq\ndata = [5, 1, 3]\nheapq.heapify(data)\nheapq.heappop(data)', output: '1' },
    },
    {
      name: 'Popping an empty heap',
      desc: 'heappop on [] raises IndexError. An empty list is falsy, so test it before popping.',
      wrong: { label: 'pop blindly', code: 'import heapq\nheap = []\nheapq.heappop(heap)', output: 'IndexError: index out of range' },
      fix:   { label: 'check first', code: "import heapq\nheap = []\nheapq.heappop(heap) if heap else 'queue is empty'", output: "'queue is empty'" },
    },
  ],

  when: {
    use: [
      'Taking the next job, event or node from a priority queue',
      'Getting items out in sorted order one at a time',
    ],
    avoid: [
      'Pop then push right away → heapreplace (one sift instead of two)',
      'Only reading the minimum → heap[0]',
      'Removing an arbitrary item → mark it deleted, or list.remove() + heapify()',
    ],
  },

  notes: {
    cpython:     'heappop_internal: remove the last item, put it at index 0, then siftup() — which bubbles the smaller child up to a leaf and sifts back',
    'Errors':    'IndexError("index out of range") for an empty list; TypeError for a non-list',
    'Cost':      'O(log n) comparisons',
  },

  related: [
    { name: 'heapq.heappush',    slug: 'heappush',    when: 'Put items in' },
    { name: 'heapq.heapreplace', slug: 'heapreplace', when: 'Pop and push in one step' },
    { name: 'heapq.nsmallest',   slug: 'nlargest-nsmallest', when: 'The k smallest without popping' },
    { name: 'heapq module',      slug: 'heapq',       when: 'Overview and priority queues', category: 'stdlib' },
    { name: 'IndexError',        slug: 'indexerror',  when: 'What an empty heap raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does heapq.heappop raise "IndexError: index out of range"?',
      a: 'The heap list is empty. Check "if heap:" before popping, or loop with "while heap:".',
    },
    {
      q: 'How do I get the smallest item without removing it?',
      a: 'heap[0]. heappop removes it; heap[0] only reads it.',
    },
    {
      q: 'Why does heappop not return the smallest value?',
      a: 'The list was never turned into a heap. Call heapq.heapify(list) once, and afterwards only change it with heappush/heappop/heapreplace — append, insert or item assignment break the invariant.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html#heapq.heappop',
    meta:  'heapq.heappop',
  },
};
