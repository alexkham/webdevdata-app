// content/reference/python/stdlib/collections/deque-maxlen.js

export const meta = {
  slug:        'deque-maxlen',
  name:        'deque.maxlen',
  signature:   'deque.maxlen',
  blurb:       'The size limit of a bounded deque (None when unbounded). A full bounded deque drops items from the far end — a ready-made sliding window.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'deque maxlen deque.maxlen bounded deque sliding window ring buffer circular buffer last n items fixed size queue tail python collections',
};

export const method = {
  slug:      'deque-maxlen',
  name:      'deque.maxlen',
  signature: 'deque.maxlen',
  returns:   { type: 'int | None', desc: 'The maxlen given to the constructor, or None.' },

  category:    'deque attribute',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'Set it once in deque(iterable, maxlen) and the deque never grows past it: every append beyond the limit discards the oldest item on the other side. The attribute itself is read-only.',

  covers: ['deque.maxlen'],

  cheat: {
    commonCall: 'window = deque(maxlen=3)',
    returns:    'window.maxlen → 3',
    replaces:   'list + manual "if len(buf) > n: buf.pop(0)"',
    watchOut:   'overflow is silent — nothing raises',
  },

  parameters: [],

  modes: [
    {
      id: 'window',
      label: 'sliding window',
      blurb: 'Push items one at a time and record what the window holds after each step.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'a stream of items', input: 'csv' },
        { name: 'size',  type: 'int',       hint: 'window size',       input: 'number' },
      ],
      template: "from collections import deque\nwindow = deque(maxlen={$size})\nseen = []\nfor x in {$items}:\n    window.append(x)\n    seen.append(''.join(window))\nseen",
      cases: [
        { id: 'three', label: 'size 3', values: { items: 'a, b, c, d, e', size: '3' } },
        { id: 'one',   label: 'size 1', values: { items: 'a, b, c', size: '1' } },
        { id: 'zero',  label: 'size 0', values: { items: 'a, b', size: '0' } },
      ],
    },
    {
      id: 'tail',
      label: 'last n',
      blurb: 'Keep the last n words of a text, like the Unix tail command.',
      params: [
        { name: 'text', type: 'str', hint: 'some words', input: 'text' },
        { name: 'n',    type: 'int', hint: 'how many',   input: 'number' },
      ],
      template: 'from collections import deque\nlast = deque({$text}.split(), maxlen={$n})\n(last, last.maxlen)',
      cases: [
        { id: 'last2', label: 'last 2', values: { text: 'one two three four', n: '2' } },
        { id: 'more',  label: 'n > words', values: { text: 'one two', n: '5' } },
      ],
    },
  ],
  demoExplainer: 'With size 3 the window fills up (a, ab, abc) and then slides: abc → bcd → cde. With size 0 the deque never holds anything, so every snapshot is an empty string.',

  patterns: [
    {
      name: 'Moving average',
      desc: 'sum over a bounded window after each new value.',
      code: 'from collections import deque\nwindow = deque(maxlen=5)\nfor value in readings:\n    window.append(value)\n    average = sum(window) / len(window)',
    },
    {
      name: 'Last n lines of a file',
      desc: 'The docs recipe — a file object is an iterable of lines.',
      code: "from collections import deque\nwith open('app.log') as f:\n    tail = deque(f, maxlen=20)",
    },
    {
      name: 'Is the window full yet?',
      desc: 'Compare the length with maxlen.',
      code: 'if len(window) == window.maxlen:\n    process(window)',
    },
  ],

  examples: [
    { title: 'Read the limit',            code: 'from collections import deque\ndeque(maxlen=3).maxlen', returns: '3' },
    { title: 'Unbounded deques say None', code: 'from collections import deque\nprint(deque([1, 2]).maxlen)', returns: 'None' },
    { title: 'Items beyond the limit are dropped', code: "from collections import deque\nd = deque(maxlen=2)\nfor ch in 'abcd':\n    d.append(ch)\nd", returns: "deque(['c', 'd'], maxlen=2)" },
    { title: 'Positional maxlen',          code: "from collections import deque\ndeque('abcde', 2)", returns: "deque(['d', 'e'], maxlen=2)" },
    { title: 'Negative maxlen',            code: 'from collections import deque\ndeque(maxlen=-1)', returns: 'ValueError: maxlen must be non-negative' },
    { title: 'Read-only',                  code: 'from collections import deque\ndeque(maxlen=2).maxlen = 3', returns: "AttributeError: attribute 'maxlen' of 'collections.deque' objects is not writable" },
  ],

  pitfalls: [
    {
      name: 'insert() on a full bounded deque',
      desc: 'append and extend discard silently, but insert raises instead of choosing an item to drop.',
      wrong: { label: 'insert when full', code: "from collections import deque\nd = deque('ab', maxlen=2)\nd.insert(0, 'z')", output: 'IndexError: deque already at its maximum size' },
      fix:   { label: 'appendleft',       code: "from collections import deque\nd = deque('ab', maxlen=2)\nd.appendleft('z')\nd", output: "deque(['z', 'a'], maxlen=2)" },
    },
    {
      name: 'Averaging before the window is full',
      desc: 'Early windows are shorter than maxlen. Divide by len(window), not by maxlen.',
      wrong: { label: '/ maxlen',      code: 'from collections import deque\nw = deque([10], maxlen=4)\nsum(w) / w.maxlen', output: '2.5' },
      fix:   { label: '/ len(window)', code: 'from collections import deque\nw = deque([10], maxlen=4)\nsum(w) / len(w)', output: '10.0' },
    },
  ],

  when: {
    use: [
      'Sliding windows and moving statistics',
      'Recent-history buffers (logs, undo, last N events)',
    ],
    avoid: [
      'Data you must not lose when full → check len(d) == d.maxlen first, or use queue.Queue(maxsize=n), which blocks',
    ],
  },

  notes: {
    cpython:    'Set in deque_init; exposed as a read-only member in Modules/_collectionsmodule.c',
    'Versions': 'The maxlen argument exists since 2.6; the maxlen attribute was added in 3.1 (docs.python.org)',
    'maxlen=0': 'Allowed: the deque stays empty forever — used to consume iterators',
  },

  related: [
    { name: 'deque',              slug: 'deque',        when: 'The constructor' },
    { name: 'deque append / pop', slug: 'deque-append', when: 'What happens at the ends when full' },
    { name: 'deque extend',       slug: 'deque-extend', when: 'Fill a window in one call' },
    { name: 'ValueError',         slug: 'valueerror',   when: 'Negative maxlen', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I make a fixed-size queue in Python?',
      a: 'collections.deque(maxlen=n). Once it holds n items, each append drops the oldest item from the other end. queue.Queue(maxsize=n) is the alternative that blocks instead of dropping.',
    },
    {
      q: 'Can I change a deque maxlen later?',
      a: 'No, maxlen is read-only. Create a new deque: d = deque(d, maxlen=new_size) — when shrinking, only the rightmost new_size items are kept.',
    },
    {
      q: 'How do I implement a sliding window in Python?',
      a: 'Append each new item to deque(maxlen=k); the deque always holds the last k items. For a window over an iterable, the itertools docs sliding_window recipe does the same with a deque.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.deque.maxlen',
    meta:  'deque.maxlen',
  },
};
