// content/reference/python/stdlib/collections/deque.js

export const meta = {
  slug:        'deque',
  name:        'collections.deque',
  signature:   'collections.deque(iterable=(), maxlen=None)',
  blurb:       'A double-ended queue: O(1) appends and pops at both ends, optional maxlen for a fixed-size buffer.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'deque python collections.deque double ended queue fifo lifo stack queue popleft appendleft ring buffer circular buffer deque.clear deque.copy thread safe',
};

export const method = {
  slug:      'deque',
  name:      'collections.deque',
  signature: 'collections.deque(iterable=(), maxlen=None)',
  returns:   { type: 'deque', desc: 'A new deque holding the items of iterable (the last maxlen of them when bounded).' },

  category:    'collections class',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'The right container for queues: adding and removing at either end is O(1), where list.pop(0) and list.insert(0, x) move every element. Indexing is O(1) at the ends but O(n) in the middle, and there is no slicing.',

  covers: ['deque', 'deque.clear', 'deque.copy'],

  cheat: {
    commonCall: 'deque([1, 2, 3], maxlen=5)',
    returns:    'deque([1, 2, 3], maxlen=5)',
    replaces:   'list used as a queue (pop(0), insert(0, x))',
    watchOut:   'no slicing — d[1:3] is a TypeError',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: false, default: '()',   desc: 'Initial items, added left to right with append().' },
    { name: 'maxlen',   type: 'int | None', required: false, default: 'None', desc: 'Maximum length. When full, adding at one end discards from the other. Read-only afterwards.' },
  ],

  modes: [
    {
      id: 'build',
      label: 'create',
      blurb: 'Build a deque. With maxlen, only the LAST maxlen items survive. Leave maxlen empty for None.',
      params: [
        { name: 'items',  type: 'list[str]',  hint: 'comma-separated items', input: 'csv' },
        { name: 'maxlen', type: 'int | None', hint: 'empty = unbounded',     input: 'number-or-none' },
      ],
      template: 'from collections import deque\ndeque({$items}, maxlen={$maxlen})',
      cases: [
        { id: 'free',  label: 'unbounded', values: { items: 'a, b, c, d', maxlen: '' } },
        { id: 'last2', label: 'maxlen=2',  values: { items: 'a, b, c, d', maxlen: '2' } },
        { id: 'zero',  label: 'maxlen=0',  values: { items: 'a, b', maxlen: '0' } },
        { id: 'neg',   label: 'negative',  values: { items: 'a', maxlen: '-3' } },
      ],
    },
    {
      id: 'queue',
      label: 'FIFO queue',
      blurb: 'Append at the right, take from the left: first in, first out.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'queued items', input: 'csv' },
        { name: 'item',  type: 'str',       hint: 'new arrival',  input: 'text' },
      ],
      template: 'from collections import deque\nq = deque({$items})\nq.append({$item})\n(q.popleft(), q)',
      cases: [
        { id: 'jobs',  label: 'jobs',  values: { items: 'job1, job2', item: 'job3' } },
        { id: 'empty', label: 'empty', values: { items: '', item: 'only' } },
      ],
    },
    {
      id: 'index',
      label: 'indexing',
      blurb: 'd[0] and d[-1] are the two ends; any index works, but out of range raises IndexError.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'items',   input: 'csv' },
        { name: 'i',     type: 'int',       hint: 'an index', input: 'number' },
      ],
      template: 'from collections import deque\nd = deque({$items})\n(d[0], d[-1], d[{$i}])',
      cases: [
        { id: 'mid',  label: 'd[1]',  values: { items: 'a, b, c', i: '1' } },
        { id: 'out',  label: 'd[5]',  values: { items: 'a, b, c', i: '5' } },
        { id: 'none', label: 'empty', values: { items: '', i: '0' } },
      ],
    },
  ],
  demoExplainer: 'maxlen=2 keeps c and d: items are appended one by one and each append past the limit pushes one out on the left. maxlen=0 accepts nothing at all, and a negative maxlen is a ValueError. Indexing an empty deque fails at d[0] with "deque index out of range".',

  patterns: [
    {
      name: 'Breadth-first search',
      desc: 'The canonical deque use: a FIFO frontier.',
      code: 'from collections import deque\nqueue = deque([start])\nseen = {start}\nwhile queue:\n    node = queue.popleft()\n    for nxt in graph[node]:\n        if nxt not in seen:\n            seen.add(nxt)\n            queue.append(nxt)',
    },
    {
      name: 'Tail of a file',
      desc: 'A bounded deque keeps the last n lines (the docs recipe).',
      code: "from collections import deque\nwith open('app.log') as f:\n    last_lines = deque(f, maxlen=10)",
    },
    {
      name: 'Stack',
      desc: 'append + pop on the same end is LIFO.',
      code: 'from collections import deque\nstack = deque()\nstack.append(1)\nstack.pop()',
    },
    {
      name: 'Slicing workaround',
      desc: 'itertools.islice iterates without copying the whole deque.',
      code: 'from collections import deque\nfrom itertools import islice\nfirst_three = list(islice(d, 3))',
    },
  ],

  examples: [
    { title: 'From any iterable',        code: "from collections import deque\ndeque('abc')", returns: "deque(['a', 'b', 'c'])" },
    { title: 'Bounded: keeps the last n', code: 'from collections import deque\ndeque(range(10), maxlen=3)', returns: 'deque([7, 8, 9], maxlen=3)' },
    { title: 'Ends are d[0] and d[-1]',  code: "from collections import deque\nd = deque('xyz')\n(d[0], d[-1])", returns: "('x', 'z')" },
    { title: 'copy keeps maxlen',        code: 'from collections import deque\ndeque([1, 2, 3], maxlen=5).copy()', returns: 'deque([1, 2, 3], maxlen=5)' },
    { title: 'clear empties in place',   code: 'from collections import deque\nd = deque([1, 2])\nd.clear()\nd', returns: 'deque([])' },
    { title: 'Membership and len work',  code: "from collections import deque\nd = deque('abc')\n('b' in d, len(d))", returns: '(True, 3)' },
    { title: 'No slicing',               code: 'from collections import deque\ndeque([1, 2, 3])[0:2]', returns: "TypeError: sequence index must be integer, not 'slice'" },
  ],

  pitfalls: [
    {
      name: 'Slicing a deque',
      desc: 'deque supports indexing but not slices. Use itertools.islice or convert to a list.',
      wrong: { label: 'd[:2]',             code: "from collections import deque\ndeque('abc')[:2]", output: "TypeError: sequence index must be integer, not 'slice'" },
      fix:   { label: 'islice(d, 2)',      code: "from collections import deque\nfrom itertools import islice\nlist(islice(deque('abc'), 2))", output: "['a', 'b']" },
    },
    {
      name: 'Changing maxlen after creation',
      desc: 'maxlen is read-only. Build a new deque with the new limit.',
      wrong: { label: 'd.maxlen = 5',    code: 'from collections import deque\nd = deque(maxlen=3)\nd.maxlen = 5', output: "AttributeError: attribute 'maxlen' of 'collections.deque' objects is not writable" },
      fix:   { label: 'deque(d, maxlen=5)', code: 'from collections import deque\nd = deque([1, 2], maxlen=3)\nd = deque(d, maxlen=5)\nd', output: 'deque([1, 2], maxlen=5)' },
    },
    {
      name: 'Mutating while iterating',
      desc: 'Unlike a list, a deque detects the size change and raises.',
      wrong: { label: 'append in loop',  code: 'from collections import deque\nd = deque([1, 2])\nfor x in d:\n    d.append(x)', output: 'RuntimeError: deque mutated during iteration' },
      fix:   { label: 'iterate a copy',  code: 'from collections import deque\nd = deque([1, 2])\nfor x in list(d):\n    d.append(x)\nd', output: 'deque([1, 2, 1, 2])' },
    },
  ],

  when: {
    use: [
      'FIFO queues and BFS frontiers',
      'Stacks where you also need the other end',
      'Fixed-size history / sliding windows (maxlen)',
    ],
    avoid: [
      'Random access or slicing into the middle → list',
      'Producer/consumer between threads with blocking → queue.Queue',
      'Priority ordering → heapq',
    ],
  },

  notes: {
    cpython:        'Modules/_collectionsmodule.c — a doubly linked list of fixed-size blocks, which is why the ends are O(1) and the middle is O(n)',
    'Thread safety': 'append, appendleft, pop and popleft are documented as thread-safe',
    'Versions':     'deque since 2.4; maxlen argument 2.6; copy(), index() and insert() added in 3.5',
  },

  related: [
    { name: 'deque append / pop', slug: 'deque-append', when: 'Work with both ends' },
    { name: 'deque.maxlen',       slug: 'deque-maxlen', when: 'Sliding windows' },
    { name: 'deque.rotate',       slug: 'deque-rotate', when: 'Rotate or reverse in place' },
    { name: 'deque index / insert / remove', slug: 'deque-index', when: 'List-like methods' },
    { name: 'list',               slug: 'list',         when: 'Random access and slicing', category: 'functions' },
    { name: 'IndexError',         slug: 'indexerror',   when: 'Popping or indexing an empty deque', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is a deque in Python?',
      a: 'collections.deque is a double-ended queue: a sequence with O(1) append and pop at both the left and right ends. It is the standard way to build queues, stacks and fixed-size buffers.',
    },
    {
      q: 'Is deque faster than list?',
      a: 'At the left end, yes: popleft() and appendleft() are O(1), while list.pop(0) and list.insert(0, x) move every element. At the right end both are fast. For indexing in the middle a list is faster (deque is O(n) there).',
    },
    {
      q: 'Can I slice a deque?',
      a: 'No — d[1:3] raises TypeError. Use list(itertools.islice(d, 1, 3)), or convert with list(d) first.',
    },
    {
      q: 'Is deque thread-safe?',
      a: 'The docs describe appends and pops from either side as thread-safe. For blocking producer/consumer queues with timeouts, use queue.Queue.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.deque',
    meta:  'collections.deque',
  },
};
