// content/reference/python/stdlib/heapq/heappushpop.js

export const meta = {
  slug:        'heappushpop',
  name:        'heapq.heappushpop',
  signature:   'heapq.heappushpop(heap, item)',
  blurb:       'Push an item, then pop the smallest — in one sift. If the item is not larger than heap[0], it comes straight back and the heap is untouched.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'heapq heappushpop push then pop smallest push pop combined python heapq.heappushpop bounded heap k largest',
};

export const method = {
  slug:      'heappushpop',
  name:      'heapq.heappushpop',
  signature: 'heapq.heappushpop(heap, item)',
  returns:   { type: 'object', desc: 'The smaller of item and the old heap[0] (item itself on a tie or an empty heap).' },

  category:    'heapq function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Push first, pop second — so the returned value is never larger than the item you pushed. Works on an empty heap, where it simply returns the item.',

  covers: ['heappushpop'],

  cheat: {
    commonCall: 'smallest = heapq.heappushpop(heap, x)',
    returns:    'min(x, heap[0]) — x on a tie',
    replaces:   'heappush(heap, x) followed by heappop(heap)',
    watchOut:   'Returns x unchanged when x <= heap[0]',
  },

  parameters: [
    { name: 'heap', type: 'list',   required: true, default: null, desc: 'A list in heap order; may be empty. Positional only.' },
    { name: 'item', type: 'object', required: true, default: null, desc: 'The item to push. Compared once with heap[0] (heap[0] < item). Positional only.' },
  ],

  modes: [
    {
      id: 'pushpop',
      label: 'push + pop',
      blurb: 'heapify, then heappushpop one item. The tuple shows (returned value, heap afterwards).',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'item', type: 'int',               hint: 'item to push',           input: 'number' },
      ],
      template: 'import heapq\nheap = {$nums}\nheapq.heapify(heap)\n(heapq.heappushpop(heap, {$item}), heap)',
      cases: [
        { id: 'larger',  label: 'item larger',  values: { nums: '2, 4, 6, 8', item: '5' } },
        { id: 'smaller', label: 'item smaller', values: { nums: '2, 4, 6, 8', item: '1' } },
        { id: 'tie',     label: 'tie',          values: { nums: '2, 4, 6, 8', item: '2' } },
        { id: 'empty',   label: 'empty heap',   values: { nums: '', item: '3' } },
      ],
    },
    {
      id: 'compare',
      label: 'vs heapreplace',
      blurb: 'The same item through heappushpop and heapreplace, on two copies of the same heap.',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'item', type: 'int',               hint: 'item',                   input: 'number' },
      ],
      template: "import heapq\na = {$nums}\nheapq.heapify(a)\nb = a.copy()\nx = {$item}\n[('heappushpop', heapq.heappushpop(a, x), a), ('heapreplace', heapq.heapreplace(b, x), b)]",
      cases: [
        { id: 'smaller', label: 'item smaller', values: { nums: '2, 4, 6, 8', item: '1' } },
        { id: 'larger',  label: 'item larger',  values: { nums: '2, 4, 6, 8', item: '10' } },
        { id: 'empty',   label: 'empty heap',   values: { nums: '', item: '3' } },
      ],
    },
  ],
  demoExplainer: 'With 2, 4, 6, 8 and item 1, heappushpop returns 1 and leaves the heap as it was, while heapreplace returns 2 and keeps the 1: [1, 4, 6, 8]. With item 10 both return 2 and both leave [4, 8, 6, 10]. On an empty heap heappushpop returns the item, but heapreplace raises IndexError: index out of range — so the whole comparison fails.',

  patterns: [
    {
      name: 'k largest with a bounded heap',
      desc: 'Fill to k, then push-pop: the smallest of k+1 items leaves each time.',
      code: 'import heapq\ntop = []\nfor x in stream:\n    if len(top) < k:\n        heapq.heappush(top, x)\n    else:\n        heapq.heappushpop(top, x)',
    },
    {
      name: 'Running median (two heaps)',
      desc: 'Push into one heap and move its extreme to the other in one call.',
      code: 'import heapq\nheapq.heappush(low, -heapq.heappushpop(high, x))',
    },
  ],

  examples: [
    { title: 'Item larger than the minimum', code: 'import heapq\nheap = [2, 4, 6, 8]\nheapq.heappushpop(heap, 5)', returns: '2' },
    { title: 'Item smaller: comes straight back', code: 'import heapq\nheap = [2, 4, 6, 8]\n(heapq.heappushpop(heap, 1), heap)', returns: '(1, [2, 4, 6, 8])' },
    { title: 'Tie: the item is returned',    code: 'import heapq\nheap = [2, 4]\nx = 2.0\nheapq.heappushpop(heap, x)', returns: '2.0' },
    { title: 'Empty heap is fine',           code: 'import heapq\nheapq.heappushpop([], 9)', returns: '9' },
    { title: 'Heap afterwards',              code: 'import heapq\nheap = [2, 4, 6, 8]\nheapq.heappushpop(heap, 10)\nheap', returns: '[4, 8, 6, 10]' },
  ],

  pitfalls: [
    {
      name: 'Using push + pop as two calls',
      desc: 'Same result, two sifts. The combined call also skips the work entirely when the item is not larger than heap[0].',
      wrong: { label: 'two calls', code: 'import heapq\nheap = [2, 4, 6]\nheapq.heappush(heap, 1)\nheapq.heappop(heap)', output: '1' },
      fix:   { label: 'heappushpop', code: 'import heapq\nheap = [2, 4, 6]\nheapq.heappushpop(heap, 1)', output: '1' },
    },
    {
      name: 'Confusing it with heapreplace',
      desc: 'heapreplace pops first and always returns the old minimum — even when the new item is smaller.',
      wrong: { label: 'heapreplace', code: 'import heapq\nheap = [5, 7]\nheapq.heapreplace(heap, 3)', output: '5' },
      fix:   { label: 'heappushpop', code: 'import heapq\nheap = [5, 7]\nheapq.heappushpop(heap, 3)', output: '3' },
    },
  ],

  when: {
    use: [
      'Bounded heaps that keep the k largest items',
      'Two-heap running medians',
      'Heaps that may be empty',
    ],
    avoid: [
      'The old minimum must always leave → heapreplace',
    ],
  },

  notes: {
    cpython:   '_heapq_heappushpop_impl: if the heap is empty or not heap[0] < item, return item; otherwise heap[0] = item and one siftup()',
    'Ties':    'Uses heap[0] < item, so an equal item is returned and the heap is not touched',
  },

  related: [
    { name: 'heapq.heapreplace', slug: 'heapreplace', when: 'Pop first, then push' },
    { name: 'heapq.heappush',    slug: 'heappush',    when: 'Push without popping' },
    { name: 'heapq.heappop',     slug: 'heappop',     when: 'Pop without pushing' },
    { name: 'heapq module',      slug: 'heapq',       when: 'Overview and priority queues', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is heappushpop the same as heappush followed by heappop?',
      a: 'Same result, but faster: it compares the item with heap[0] once and, if the item is larger, does a single sift. If it is not larger, the item is returned without touching the heap.',
    },
    {
      q: 'heappushpop or heapreplace for a top-k heap?',
      a: 'Both work. heappushpop needs no guard (a small item just bounces off). heapreplace needs "if x > top[0]" first, otherwise a small item would push out a larger one.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html#heapq.heappushpop',
    meta:  'heapq.heappushpop',
  },
};
