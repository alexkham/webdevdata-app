// content/reference/python/stdlib/heapq/heapreplace.js

export const meta = {
  slug:        'heapreplace',
  name:        'heapq.heapreplace',
  signature:   'heapq.heapreplace(heap, item)',
  blurb:       'Pop the smallest item and push a new one in a single sift — the heap size stays the same. IndexError on an empty heap.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'heapq heapreplace pop then push replace smallest fixed size heap top k largest python heapq.heapreplace indexerror',
};

export const method = {
  slug:      'heapreplace',
  name:      'heapq.heapreplace',
  signature: 'heapq.heapreplace(heap, item)',
  returns:   { type: 'object', desc: 'The item that was the smallest BEFORE item was added — it can be larger than item.' },

  category:    'heapq function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Pop first, push second: the old minimum always leaves, even when the new item is smaller. That is what makes it the right tool for a fixed-size "k largest so far" heap.',

  covers: ['heapreplace'],

  cheat: {
    commonCall: 'if x > top[0]: heapq.heapreplace(top, x)',
    returns:    'the old heap[0]',
    replaces:   'heappop(heap) followed by heappush(heap, item)',
    watchOut:   'Returns the old minimum even if item is smaller',
  },

  parameters: [
    { name: 'heap', type: 'list',   required: true, default: null, desc: 'A non-empty list in heap order. Positional only.' },
    { name: 'item', type: 'object', required: true, default: null, desc: 'The new item; it takes the place of heap[0] and is sifted down. Positional only.' },
  ],

  modes: [
    {
      id: 'replace',
      label: 'replace',
      blurb: 'heapify the numbers, then replace the minimum with item. The tuple shows (returned value, heap afterwards).',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'item', type: 'int',               hint: 'new item',               input: 'number' },
      ],
      template: 'import heapq\nheap = {$nums}\nheapq.heapify(heap)\n(heapq.heapreplace(heap, {$item}), heap)',
      cases: [
        { id: 'middle', label: 'item in the middle', values: { nums: '2, 4, 6, 8', item: '5' } },
        { id: 'small',  label: 'item smaller',       values: { nums: '2, 4, 6, 8', item: '1' } },
        { id: 'empty',  label: 'empty heap',         values: { nums: '', item: '3' } },
      ],
    },
    {
      id: 'topk',
      label: 'k largest',
      blurb: 'Stream the numbers through a k-item min-heap. heap[0] is the smallest of the k largest so far; a bigger number replaces it.',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'k',    type: 'int',               hint: 'how many to keep',       input: 'number' },
      ],
      template: 'import heapq\nstream = {$nums}\nk = {$k}\ntop = stream[:k]\nheapq.heapify(top)\nfor x in stream[k:]:\n    if x > top[0]:\n        heapq.heapreplace(top, x)\nsorted(top, reverse=True)',
      cases: [
        { id: 'three', label: 'k = 3',  values: { nums: '5, 1, 9, 3, 7, 2, 8', k: '3' } },
        { id: 'one',   label: 'k = 1',  values: { nums: '4, 6, 2', k: '1' } },
        { id: 'zero',  label: 'k = 0',  values: { nums: '4, 6, 2', k: '0' } },
      ],
    },
  ],
  demoExplainer: 'Replacing in 2, 4, 6, 8 with 1 returns 2 and leaves [1, 4, 6, 8]: the new item is smaller than what came out — heappushpop would have returned 1 and left the heap unchanged. In the k-largest loop that cannot happen, because heapreplace is only called when x > top[0]. With k = 0 the heap is empty, so top[0] raises IndexError: list index out of range (a plain list index, not heapq).',

  patterns: [
    {
      name: 'Fixed-size top k',
      desc: 'Guard with a comparison so the item leaving is always the smaller one.',
      code: 'import heapq\ntop = data[:k]\nheapq.heapify(top)\nfor x in data[k:]:\n    if x > top[0]:\n        heapq.heapreplace(top, x)',
    },
    {
      name: 'Take one, put one back',
      desc: 'Scheduling: run the next job and requeue it with a later time.',
      code: 'import heapq\nwhen, job = queue[0]\nrun(job)\nheapq.heapreplace(queue, (when + job.interval, job))',
    },
  ],

  examples: [
    { title: 'Old minimum comes out',     code: 'import heapq\nheap = [2, 4, 6, 8]\nheapq.heapreplace(heap, 5)', returns: '2' },
    { title: 'Heap afterwards',           code: 'import heapq\nheap = [2, 4, 6, 8]\nheapq.heapreplace(heap, 5)\nheap', returns: '[4, 5, 6, 8]' },
    { title: 'Returned value can be larger than item', code: 'import heapq\nheap = [2, 4, 6, 8]\n(heapq.heapreplace(heap, 1), heap)', returns: '(2, [1, 4, 6, 8])' },
    { title: 'Size never changes',        code: 'import heapq\nheap = [3, 5, 7]\nfor x in [9, 1, 4]:\n    heapq.heapreplace(heap, x)\nlen(heap)', returns: '3' },
    { title: 'Empty heap',                code: 'import heapq\nheapq.heapreplace([], 1)', returns: 'IndexError: index out of range' },
  ],

  pitfalls: [
    {
      name: 'Expecting the smaller of the two',
      desc: 'heapreplace pops BEFORE pushing, so a smaller new item stays in the heap. If you want the smaller of the two returned, use heappushpop.',
      wrong: { label: 'heapreplace', code: 'import heapq\nheap = [2, 4, 6]\nheapq.heapreplace(heap, 1)', output: '2' },
      fix:   { label: 'heappushpop', code: 'import heapq\nheap = [2, 4, 6]\nheapq.heappushpop(heap, 1)', output: '1' },
    },
    {
      name: 'Calling it on an empty heap',
      desc: 'There is nothing to pop, so it raises — unlike heappushpop, which just returns the item.',
      wrong: { label: 'heapreplace', code: 'import heapq\nheapq.heapreplace([], 7)', output: 'IndexError: index out of range' },
      fix:   { label: 'heappushpop', code: 'import heapq\nheapq.heappushpop([], 7)', output: '7' },
    },
  ],

  when: {
    use: [
      'Fixed-size heaps: k largest, sliding best-of lists',
      'Pop-then-requeue loops in schedulers',
    ],
    avoid: [
      'You want min(item, heap[0]) returned → heappushpop',
      'The heap may be empty → check first, or use heappushpop',
    ],
  },

  notes: {
    cpython:   'heapreplace_internal: heap[0] = item, then one siftup() — cheaper than heappop() + heappush(), which sift twice',
    'Errors':  'IndexError("index out of range") on an empty list',
  },

  related: [
    { name: 'heapq.heappushpop', slug: 'heappushpop', when: 'Push first, then pop' },
    { name: 'heapq.heappop',     slug: 'heappop',     when: 'Pop without pushing' },
    { name: 'heapq.nlargest',    slug: 'nlargest-nsmallest', when: 'k largest of a finite list in one call' },
    { name: 'heapq module',      slug: 'heapq',       when: 'Overview and priority queues', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between heapreplace and heappushpop?',
      a: 'heapreplace pops the smallest and then pushes the new item, so it always returns the old heap[0]. heappushpop pushes first, so it returns the smaller of the new item and heap[0] — and returns the item untouched when it is smaller.',
    },
    {
      q: 'Why use heapreplace instead of heappop plus heappush?',
      a: 'It does one sift instead of two and never changes the list length, so it is faster — ideal for heaps with a fixed size.',
    },
    {
      q: 'Does heapreplace work on an empty heap?',
      a: 'No. It raises IndexError: index out of range, because there is no smallest item to return.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html#heapq.heapreplace',
    meta:  'heapq.heapreplace',
  },
};
