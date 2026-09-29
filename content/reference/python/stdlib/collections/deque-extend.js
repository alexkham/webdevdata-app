// content/reference/python/stdlib/collections/deque-extend.js

export const meta = {
  slug:        'deque-extend',
  name:        'deque extend / extendleft',
  signature:   'deque.extend(iterable)  ·  deque.extendleft(iterable)',
  blurb:       'Add every item of an iterable to the right end (extend) or the left end (extendleft) — where extendleft reverses the order.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'deque extend extendleft deque.extend deque.extendleft add many items prepend reversed order python collections',
};

export const method = {
  slug:      'deque-extend',
  name:      'deque extend / extendleft',
  signature: 'deque.extend(iterable)',
  returns:   { type: 'None', desc: 'The deque is changed in place.' },

  category:    'deque methods',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'extend is a loop of append; extendleft is a loop of appendleft — so the items land on the left in REVERSE order. With maxlen, items pushed out along the way are gone.',

  covers: ['deque.extend', 'deque.extendleft'],

  cheat: {
    commonCall: "d.extend([4, 5]) · d.extendleft('ab')",
    returns:    'None',
    replaces:   'for x in items: d.append(x)',
    watchOut:   "extendleft('ab') puts b before a",
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Items to add, consumed left to right. A str adds one item per character.' },
  ],

  modes: [
    {
      id: 'extend',
      label: 'extend',
      blurb: 'Items are appended in order on the right.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'starting items', input: 'csv' },
        { name: 'more',  type: 'list[str]', hint: 'items to add',   input: 'csv' },
      ],
      template: 'from collections import deque\nd = deque({$items})\nd.extend({$more})\nd',
      cases: [
        { id: 'basic', label: 'basic', values: { items: 'a, b', more: 'c, d' } },
        { id: 'none',  label: 'nothing to add', values: { items: 'a', more: '' } },
      ],
    },
    {
      id: 'extendleft',
      label: 'extendleft',
      blurb: 'Each item is put on the left in turn, so the added run appears reversed.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'starting items', input: 'csv' },
        { name: 'more',  type: 'list[str]', hint: 'items to add',   input: 'csv' },
      ],
      template: 'from collections import deque\nd = deque({$items})\nd.extendleft({$more})\nd',
      cases: [
        { id: 'rev',  label: 'reversed', values: { items: 'x, y', more: '1, 2, 3' } },
        { id: 'one',  label: 'one item', values: { items: 'x', more: 'w' } },
      ],
    },
    {
      id: 'bounded',
      label: 'with maxlen',
      blurb: 'extend on a bounded deque keeps only the newest maxlen items.',
      params: [
        { name: 'items',  type: 'list[str]', hint: 'starting items', input: 'csv' },
        { name: 'maxlen', type: 'int',       hint: 'maxlen',         input: 'number' },
        { name: 'more',   type: 'list[str]', hint: 'items to add',   input: 'csv' },
      ],
      template: 'from collections import deque\nd = deque({$items}, maxlen={$maxlen})\nd.extend({$more})\nd',
      cases: [
        { id: 'over', label: 'overflow', values: { items: 'a, b', maxlen: '3', more: 'c, d, e' } },
        { id: 'fits', label: 'fits',     values: { items: 'a', maxlen: '5', more: 'b, c' } },
      ],
    },
  ],
  demoExplainer: 'extendleft(["1", "2", "3"]) on x, y gives 3, 2, 1, x, y: "1" goes to the front first, then "2" in front of it, then "3". In the maxlen tab only the last three of a, b, c, d, e remain.',

  patterns: [
    {
      name: 'Prepend a run in its original order',
      desc: 'Reverse it first, because extendleft reverses again.',
      code: 'from collections import deque\nd.extendleft(reversed(prefix))',
    },
    {
      name: 'Keep the last N of a stream',
      desc: 'One call does the whole job.',
      code: 'from collections import deque\nlast = deque(maxlen=5)\nlast.extend(stream)',
    },
    {
      name: 'Consume an iterator for its side effects',
      desc: 'The itertools docs recipe: a zero-length deque stores nothing.',
      code: 'from collections import deque\ndeque(iterator, maxlen=0)',
    },
  ],

  examples: [
    { title: 'extend adds on the right',       code: 'from collections import deque\nd = deque([1, 2])\nd.extend([3, 4])\nd', returns: 'deque([1, 2, 3, 4])' },
    { title: 'extendleft reverses',             code: 'from collections import deque\nd = deque([3])\nd.extendleft([2, 1, 0])\nd', returns: 'deque([0, 1, 2, 3])' },
    { title: 'A string adds characters',        code: "from collections import deque\nd = deque()\nd.extend('hi')\nd", returns: "deque(['h', 'i'])" },
    { title: 'Prepend in original order',       code: "from collections import deque\nd = deque(['c'])\nd.extendleft(reversed(['a', 'b']))\nd", returns: "deque(['a', 'b', 'c'])" },
    { title: 'Bounded extend keeps the newest', code: 'from collections import deque\nd = deque(maxlen=2)\nd.extend(range(5))\nd', returns: 'deque([3, 4], maxlen=2)' },
    { title: 'Extending with itself works',     code: 'from collections import deque\nd = deque([1, 2])\nd.extend(d)\nd', returns: 'deque([1, 2, 1, 2])' },
  ],

  pitfalls: [
    {
      name: 'Expecting extendleft to keep order',
      desc: 'It appends to the left one item at a time.',
      wrong: { label: "extendleft('ab')",           code: "from collections import deque\nd = deque('c')\nd.extendleft('ab')\n''.join(d)", output: "'bac'" },
      fix:   { label: "extendleft(reversed('ab'))", code: "from collections import deque\nd = deque('c')\nd.extendleft(reversed('ab'))\n''.join(d)", output: "'abc'" },
    },
    {
      name: 'append when you meant extend',
      desc: 'append adds the whole list as ONE item.',
      wrong: { label: 'append([...])', code: 'from collections import deque\nd = deque([1])\nd.append([2, 3])\nd', output: 'deque([1, [2, 3]])' },
      fix:   { label: 'extend([...])', code: 'from collections import deque\nd = deque([1])\nd.extend([2, 3])\nd', output: 'deque([1, 2, 3])' },
    },
  ],

  when: {
    use: [
      'Adding a batch of items to either end',
      'Filling a bounded deque from a stream',
    ],
    avoid: [
      'A new combined deque, leaving the original alone → d1 + d2 (supported since 3.5)',
    ],
  },

  notes: {
    cpython:   'deque_extend / deque_extendleft in Modules/_collectionsmodule.c; extending a deque with itself iterates over a copy',
    'Order':   'extendleft(iterable) leaves the items in reverse order on the left',
  },

  related: [
    { name: 'deque append / pop', slug: 'deque-append', when: 'One item at a time' },
    { name: 'deque.maxlen',       slug: 'deque-maxlen', when: 'Bounded deques' },
    { name: 'list.extend',        slug: 'list-extend',  when: 'The list equivalent', category: 'functions' },
    { name: 'reversed()',         slug: 'reversed',     when: 'Undo extendleft reversal', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does deque.extendleft reverse the order?',
      a: 'It is defined as repeated appendleft: the first item goes to the front, then the second goes in front of it, and so on. Pass reversed(items) to keep the original order.',
    },
    {
      q: 'What is the difference between deque.append and deque.extend?',
      a: 'append(x) adds x as a single item; extend(iterable) adds each item of the iterable. d.append([1, 2]) adds one list, d.extend([1, 2]) adds two ints.',
    },
    {
      q: 'Can I concatenate two deques?',
      a: 'Yes: d1 + d2 returns a new deque (since Python 3.5), and d1.extend(d2) or d1 += d2 extends d1 in place.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.deque.extend',
    meta:  'deque.extend',
  },
};
