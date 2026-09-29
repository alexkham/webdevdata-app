// content/reference/python/stdlib/collections/ordereddict-popitem.js

export const meta = {
  slug:        'ordereddict-popitem',
  name:        'OrderedDict.popitem',
  signature:   'OrderedDict.popitem(last=True)',
  blurb:       'Remove and return a (key, value) pair from the end (last=True, LIFO) or from the front (last=False, FIFO).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'ordereddict popitem last false fifo lifo pop first item pop oldest key OrderedDict.popitem dictionary is empty python collections',
};

export const method = {
  slug:      'ordereddict-popitem',
  name:      'OrderedDict.popitem',
  signature: 'OrderedDict.popitem(last=True)',
  returns:   { type: 'tuple[key, value]', desc: 'The removed pair.' },

  category:    'OrderedDict method',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'dict.popitem() can only take the newest item. OrderedDict.popitem(last=False) takes the oldest, which turns an OrderedDict into a keyed FIFO queue.',

  covers: ['OrderedDict.popitem'],

  cheat: {
    commonCall: 'od.popitem(last=False)',
    returns:    "('a', 1) — the first pair",
    replaces:   'k = next(iter(d)); v = d.pop(k)',
    watchOut:   "empty: KeyError: 'dictionary is empty'",
  },

  parameters: [
    { name: 'last', type: 'bool', required: false, default: 'True', desc: 'True: remove the last pair (LIFO). False: remove the first pair (FIFO).' },
  ],

  modes: [
    {
      id: 'lifo',
      label: 'last=True',
      blurb: 'The default: pop the newest pair.',
      params: [{ name: 'keys', type: 'list[str]', hint: 'keys in order', input: 'csv' }],
      template: 'from collections import OrderedDict\nod = OrderedDict.fromkeys({$keys}, 0)\n(od.popitem(), list(od))',
      cases: [
        { id: 'abc',   label: 'a, b, c', values: { keys: 'a, b, c' } },
        { id: 'empty', label: 'empty',   values: { keys: '' } },
      ],
    },
    {
      id: 'fifo',
      label: 'last=False',
      blurb: 'Pop the oldest pair instead.',
      params: [{ name: 'keys', type: 'list[str]', hint: 'keys in order', input: 'csv' }],
      template: 'from collections import OrderedDict\nod = OrderedDict.fromkeys({$keys}, 0)\n(od.popitem(last=False), list(od))',
      cases: [
        { id: 'abc', label: 'a, b, c', values: { keys: 'a, b, c' } },
        { id: 'one', label: 'one key', values: { keys: 'solo' } },
      ],
    },
  ],
  demoExplainer: 'The tuple is evaluated left to right, so list(od) already shows the OrderedDict without the popped key. On an empty OrderedDict the message is \'dictionary is empty\' — a plain dict says \'popitem(): dictionary is empty\'.',

  patterns: [
    {
      name: 'Evict the oldest entry',
      desc: 'Bounded cache: drop from the front when over capacity.',
      code: 'if len(cache) > capacity:\n    cache.popitem(last=False)',
    },
    {
      name: 'Drain in insertion order',
      desc: 'A keyed FIFO queue.',
      code: 'while od:\n    key, value = od.popitem(last=False)\n    handle(key, value)',
    },
  ],

  examples: [
    { title: 'Pop the last pair',   code: 'from collections import OrderedDict\nOrderedDict(a=1, b=2).popitem()', returns: "('b', 2)" },
    { title: 'Pop the first pair',  code: 'from collections import OrderedDict\nOrderedDict(a=1, b=2).popitem(last=False)', returns: "('a', 1)" },
    { title: 'last is also positional', code: 'from collections import OrderedDict\nOrderedDict(a=1, b=2).popitem(False)', returns: "('a', 1)" },
    { title: 'Empty OrderedDict',   code: 'from collections import OrderedDict\nOrderedDict().popitem()', returns: "KeyError: 'dictionary is empty'" },
    { title: 'Plain dict: only the last', code: "{'a': 1, 'b': 2}.popitem()", returns: "('b', 2)" },
  ],

  pitfalls: [
    {
      name: 'Passing last=False to a plain dict',
      desc: 'dict.popitem takes no arguments.',
      wrong: { label: 'dict.popitem(last=False)', code: "{'a': 1}.popitem(last=False)", output: 'TypeError: dict.popitem() takes no keyword arguments' },
      fix:   { label: 'next(iter(d))',            code: "d = {'a': 1, 'b': 2}\nk = next(iter(d))\n(k, d.pop(k))", output: "('a', 1)" },
    },
    {
      name: 'Popping an empty OrderedDict in a loop',
      desc: 'Guard with the truthiness of the dict.',
      wrong: { label: 'no guard',  code: "from collections import OrderedDict\nod = OrderedDict(a=1)\nod.popitem()\nod.popitem()", output: "KeyError: 'dictionary is empty'" },
      fix:   { label: 'while od:', code: "from collections import OrderedDict\nod = OrderedDict(a=1)\nwhile od:\n    od.popitem()\nlen(od)", output: '0' },
    },
  ],

  when: {
    use: [
      'FIFO eviction in caches',
      'Processing keyed items in arrival order',
    ],
    avoid: [
      'Only ever popping the last item → dict.popitem()',
      'A plain FIFO of values → deque.popleft()',
    ],
  },

  notes: {
    cpython:    'OrderedDict_popitem_impl in Objects/odictobject.c',
    'Errors':   "KeyError('dictionary is empty') on an empty OrderedDict",
  },

  related: [
    { name: 'OrderedDict',             slug: 'ordereddict',             when: 'LRU demo' },
    { name: 'OrderedDict.move_to_end', slug: 'ordereddict-move_to_end', when: 'Reorder before popping' },
    { name: 'dict.popitem',            slug: 'dict-popitem',            when: 'Last item only', category: 'functions' },
    { name: 'deque append / pop',      slug: 'deque-append',            when: 'FIFO for plain values' },
    { name: 'KeyError',                slug: 'keyerror',                when: 'Empty OrderedDict', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I pop the first item of a dict?',
      a: 'With an OrderedDict: od.popitem(last=False). With a plain dict: k = next(iter(d)); v = d.pop(k) (raises StopIteration if d is empty).',
    },
    {
      q: 'What is the difference between OrderedDict.popitem and dict.popitem?',
      a: 'dict.popitem() takes no arguments and always removes the last-inserted pair. OrderedDict.popitem(last=False) can remove the first pair as well.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.OrderedDict.popitem',
    meta:  'OrderedDict.popitem',
  },
};
