// content/reference/python/stdlib/collections/deque-append.js

export const meta = {
  slug:        'deque-append',
  name:        'deque append / appendleft / pop / popleft',
  signature:   'deque.append(x)  ·  deque.appendleft(x)  ·  deque.pop()  ·  deque.popleft()',
  blurb:       'Add or remove one item at either end of a deque in O(1): append/pop on the right, appendleft/popleft on the left.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'deque append appendleft pop popleft deque.append deque.appendleft deque.pop deque.popleft add to front remove from front queue stack pop from an empty deque python collections',
};

export const method = {
  slug:      'deque-append',
  name:      'deque append / appendleft / pop / popleft',
  signature: 'deque.append(x)',
  returns:   { type: 'None | item', desc: 'append and appendleft return None; pop and popleft return the removed item.' },

  category:    'deque methods',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Four methods, two ends. Pick a pair: append + popleft is a FIFO queue, append + pop is a LIFO stack. On a bounded deque, adding at one end silently drops an item from the other.',

  covers: ['deque.append', 'deque.appendleft', 'deque.pop', 'deque.popleft'],

  cheat: {
    commonCall: 'q.append(job) · q.popleft()',
    returns:    'None · the leftmost item',
    replaces:   'list.insert(0, x) and list.pop(0), which are O(n)',
    watchOut:   "pop on an empty deque: IndexError: pop from an empty deque",
  },

  parameters: [
    { name: 'x', type: 'object', required: true, default: null, desc: 'The item to add (append, appendleft). pop and popleft take no arguments — there is no pop(i).' },
  ],

  modes: [
    {
      id: 'ends',
      label: 'append both ends',
      blurb: 'append goes on the right, appendleft on the left.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'starting items', input: 'csv' },
        { name: 'right', type: 'str',       hint: 'append',         input: 'text' },
        { name: 'left',  type: 'str',       hint: 'appendleft',     input: 'text' },
      ],
      template: 'from collections import deque\nd = deque({$items})\nd.append({$right})\nd.appendleft({$left})\nd',
      cases: [
        { id: 'abc',   label: 'a, b, c', values: { items: 'a, b, c', right: 'z', left: 'y' } },
        { id: 'empty', label: 'empty',   values: { items: '', right: 'r', left: 'l' } },
      ],
    },
    {
      id: 'pop',
      label: 'pop both ends',
      blurb: 'pop() takes from the right, popleft() from the left — evaluated left to right.',
      params: [{ name: 'items', type: 'list[str]', hint: 'items', input: 'csv' }],
      template: 'from collections import deque\nd = deque({$items})\n(d.pop(), d.popleft(), d)',
      cases: [
        { id: 'four', label: '4 items', values: { items: 'a, b, c, d' } },
        { id: 'one',  label: '1 item',  values: { items: 'only' } },
        { id: 'none', label: 'empty',   values: { items: '' } },
      ],
    },
    {
      id: 'bounded',
      label: 'with maxlen',
      blurb: 'On a full bounded deque, append pushes out the leftmost item and appendleft the rightmost.',
      params: [
        { name: 'items',  type: 'list[str]', hint: 'starting items', input: 'csv' },
        { name: 'maxlen', type: 'int',       hint: 'maxlen',         input: 'number' },
        { name: 'right',  type: 'str',       hint: 'append',         input: 'text' },
        { name: 'left',   type: 'str',       hint: 'appendleft',     input: 'text' },
      ],
      template: 'from collections import deque\nd = deque({$items}, maxlen={$maxlen})\nd.append({$right})\nd.appendleft({$left})\nd',
      cases: [
        { id: 'full', label: 'full', values: { items: 'a, b, c', maxlen: '3', right: 'z', left: 'y' } },
        { id: 'room', label: 'room', values: { items: 'a', maxlen: '4', right: 'z', left: 'y' } },
      ],
    },
  ],
  demoExplainer: 'With one item, pop() takes it and popleft() then finds the deque empty: IndexError: pop from an empty deque — the same message for both ends. In the maxlen tab, append("z") on the full a, b, c drops "a", then appendleft("y") drops the "z" that was just added.',

  patterns: [
    {
      name: 'FIFO queue',
      desc: 'append to enqueue, popleft to dequeue.',
      code: 'from collections import deque\nqueue = deque()\nqueue.append(task)\nwhile queue:\n    handle(queue.popleft())',
    },
    {
      name: 'Undo stack with a limit',
      desc: 'append + pop on a bounded deque forgets the oldest step.',
      code: 'from collections import deque\nundo = deque(maxlen=50)\nundo.append(state)\nprevious = undo.pop()',
    },
    {
      name: 'Pop only when non-empty',
      desc: 'An empty deque is falsy.',
      code: 'item = d.popleft() if d else None',
    },
  ],

  examples: [
    { title: 'append and appendleft',     code: "from collections import deque\nd = deque(['b'])\nd.append('c')\nd.appendleft('a')\nd", returns: "deque(['a', 'b', 'c'])" },
    { title: 'pop takes from the right',  code: 'from collections import deque\ndeque([1, 2, 3]).pop()', returns: '3' },
    { title: 'popleft takes from the left', code: 'from collections import deque\ndeque([1, 2, 3]).popleft()', returns: '1' },
    { title: 'FIFO order',                code: "from collections import deque\nq = deque()\nfor job in ['a', 'b', 'c']:\n    q.append(job)\n[q.popleft() for _ in range(3)]", returns: "['a', 'b', 'c']" },
    { title: 'Full bounded deque drops the other end', code: 'from collections import deque\nd = deque([1, 2, 3], maxlen=3)\nd.appendleft(0)\nd', returns: 'deque([0, 1, 2], maxlen=3)' },
    { title: 'Empty deque',               code: 'from collections import deque\ndeque().popleft()', returns: 'IndexError: pop from an empty deque' },
  ],

  pitfalls: [
    {
      name: 'pop(0) like a list',
      desc: 'deque.pop takes no index. Use popleft() for the left end.',
      wrong: { label: 'd.pop(0)',     code: 'from collections import deque\ndeque([1, 2]).pop(0)', output: 'TypeError: deque.pop() takes no arguments (1 given)' },
      fix:   { label: 'd.popleft()',  code: 'from collections import deque\ndeque([1, 2]).popleft()', output: '1' },
    },
    {
      name: 'Popping without checking',
      desc: 'Both pops raise IndexError on an empty deque. Test the deque (it is falsy when empty) or catch the error.',
      wrong: { label: 'pop blindly',   code: 'from collections import deque\nd = deque()\nd.pop()', output: 'IndexError: pop from an empty deque' },
      fix:   { label: 'check first',   code: "from collections import deque\nd = deque()\nd.pop() if d else 'empty'", output: "'empty'" },
    },
    {
      name: 'Losing data silently at maxlen',
      desc: 'A full bounded deque never raises on append — it discards. Check len(d) == d.maxlen if that matters.',
      wrong: { label: 'append to full', code: "from collections import deque\nd = deque(['keep'], maxlen=1)\nd.append('new')\nd", output: "deque(['new'], maxlen=1)" },
      fix:   { label: 'check capacity', code: "from collections import deque\nd = deque(['keep'], maxlen=1)\nlen(d) == d.maxlen", output: 'True' },
    },
  ],

  when: {
    use: [
      'Queues (append + popleft) and stacks (append + pop)',
      'Adding at the front without O(n) shifting',
    ],
    avoid: [
      'Removing by index from the middle → del d[i] works, but a list may suit better',
      'Blocking hand-off between threads → queue.Queue',
    ],
  },

  notes: {
    cpython:      'Modules/_collectionsmodule.c — deque_append, deque_appendleft, deque_pop, deque_popleft; all O(1)',
    'Empty':      'pop and popleft raise IndexError("pop from an empty deque")',
    'maxlen':     'When full, append discards from the left and appendleft from the right; with maxlen=0 nothing is ever stored',
  },

  related: [
    { name: 'deque',              slug: 'deque',        when: 'Create one, clear, copy' },
    { name: 'deque extend / extendleft', slug: 'deque-extend', when: 'Add many at once' },
    { name: 'deque.maxlen',       slug: 'deque-maxlen', when: 'Bounded deques' },
    { name: 'list.append',        slug: 'append',       when: 'The list equivalent', category: 'functions' },
    { name: 'list.pop',           slug: 'list-pop',     when: 'pop(i) by index', category: 'functions' },
    { name: 'IndexError',         slug: 'indexerror',   when: 'Popping an empty deque', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I add an item to the front of a deque?',
      a: 'd.appendleft(x). It is O(1), unlike list.insert(0, x), which shifts every element.',
    },
    {
      q: 'What does "IndexError: pop from an empty deque" mean?',
      a: 'pop() or popleft() was called on a deque with no items. Check "if d:" before popping, or catch IndexError.',
    },
    {
      q: 'Can deque.pop take an index?',
      a: 'No. pop() always removes the rightmost item and popleft() the leftmost. To remove at a position use del d[i]; to remove by value use d.remove(x).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.deque.append',
    meta:  'deque.append',
  },
};
