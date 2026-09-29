// content/reference/python/stdlib/collections/ordereddict.js

export const meta = {
  slug:        'ordereddict',
  name:        'collections.OrderedDict',
  signature:   'collections.OrderedDict([items])',
  blurb:       'A dict subclass with order-aware extras: move_to_end(), popitem(last=False) and equality that compares order. Since 3.7 plain dicts keep order too.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'ordereddict python collections.OrderedDict ordered dict vs dict insertion order lru cache order sensitive equality do i still need ordereddict',
};

export const method = {
  slug:      'ordereddict',
  name:      'collections.OrderedDict',
  signature: 'collections.OrderedDict([items])',
  returns:   { type: 'OrderedDict', desc: 'A new ordered dictionary; arguments are the same as for dict().' },

  category:    'collections class',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'Both dict and OrderedDict remember insertion order today. What OrderedDict still adds: reordering (move_to_end), removing from the FRONT (popitem(last=False)), and == that fails when the order differs.',

  covers: ['OrderedDict'],

  cheat: {
    commonCall: "OrderedDict(a=1, b=2)",
    returns:    "OrderedDict({'a': 1, 'b': 2})",
    replaces:   'dict when you need to reorder or evict the oldest key',
    watchOut:   'OrderedDict == dict ignores order; OrderedDict == OrderedDict does not',
  },

  parameters: [
    { name: 'items', type: 'mapping | iterable of pairs', required: false, default: null, desc: 'Initial content, like dict(): a mapping, (key, value) pairs or keyword arguments — kept in the order given.' },
  ],

  modes: [
    {
      id: 'eq',
      label: 'equality',
      blurb: 'Same keys, different order: which comparisons notice?',
      params: [
        { name: 'x', type: 'list[str]', hint: 'keys of a', input: 'csv' },
        { name: 'y', type: 'list[str]', hint: 'keys of b', input: 'csv' },
      ],
      template: 'from collections import OrderedDict\na = OrderedDict.fromkeys({$x})\nb = OrderedDict.fromkeys({$y})\n(a == b, dict(a) == dict(b), a == dict(b))',
      cases: [
        { id: 'swap', label: 'swapped',  values: { x: 'a, b', y: 'b, a' } },
        { id: 'same', label: 'same',     values: { x: 'a, b', y: 'a, b' } },
        { id: 'diff', label: 'other keys', values: { x: 'a', y: 'b' } },
      ],
    },
    {
      id: 'lru',
      label: 'LRU cache',
      blurb: 'Touch keys in order; the least recently used key is evicted once size is exceeded.',
      params: [
        { name: 'keys', type: 'list[str]', hint: 'accessed keys', input: 'csv' },
        { name: 'size', type: 'int',       hint: 'capacity',      input: 'number' },
      ],
      template: 'from collections import OrderedDict\ncache = OrderedDict()\nfor key in {$keys}:\n    cache[key] = True\n    cache.move_to_end(key)\n    if len(cache) > {$size}:\n        cache.popitem(last=False)\nlist(cache)',
      cases: [
        { id: 'evict', label: 'evict',  values: { keys: 'a, b, c, a, d', size: '3' } },
        { id: 'fits',  label: 'fits',   values: { keys: 'a, b, a', size: '3' } },
      ],
    },
  ],
  demoExplainer: 'For swapped keys, two OrderedDicts compare unequal, while the same data as plain dicts — or an OrderedDict against a dict — compares equal. In the LRU tab, re-reading "a" moves it to the end, so when "d" arrives the oldest entry is "b", and "b" is evicted.',

  patterns: [
    {
      name: 'LRU cache',
      desc: 'move_to_end on every access, popitem(last=False) to evict.',
      code: 'from collections import OrderedDict\ncache = OrderedDict()\ndef get(key):\n    cache.move_to_end(key)\n    return cache[key]',
    },
    {
      name: 'Order-sensitive comparison with plain dicts',
      desc: 'The docs recipe: compare items and order.',
      code: 'same = p == q and all(k1 == k2 for k1, k2 in zip(p, q))',
    },
    {
      name: 'Pop the oldest key from a plain dict',
      desc: 'dict.popitem() always takes the newest; this takes the oldest.',
      code: 'k = next(iter(d))\nv = d.pop(k)',
    },
  ],

  examples: [
    { title: 'Order-sensitive equality',       code: 'from collections import OrderedDict\nOrderedDict(a=1, b=2) == OrderedDict(b=2, a=1)', returns: 'False' },
    { title: 'Plain dicts ignore order',       code: "{'a': 1, 'b': 2} == {'b': 2, 'a': 1}", returns: 'True' },
    { title: 'Against a dict, order is ignored', code: "from collections import OrderedDict\nOrderedDict(a=1, b=2) == {'b': 2, 'a': 1}", returns: 'True' },
    { title: 'repr',                           code: "from collections import OrderedDict\nOrderedDict([('x', 1), ('y', 2)])", returns: "OrderedDict({'x': 1, 'y': 2})" },
    { title: 'Empty repr',                     code: 'from collections import OrderedDict\nOrderedDict()', returns: 'OrderedDict()' },
    { title: 'It is a dict',                   code: 'from collections import OrderedDict\nisinstance(OrderedDict(), dict)', returns: 'True' },
    { title: 'Reorder a key',                  code: "from collections import OrderedDict\nod = OrderedDict.fromkeys('abc')\nod.move_to_end('a')\n''.join(od)", returns: "'bca'" },
  ],

  pitfalls: [
    {
      name: 'Using OrderedDict just to keep order',
      desc: 'Since Python 3.7 a plain dict keeps insertion order. Reach for OrderedDict only for its extra methods or order-sensitive equality.',
      wrong: { label: 'OrderedDict for order', code: "from collections import OrderedDict\nlist(OrderedDict([('b', 1), ('a', 2)]))", output: "['b', 'a']" },
      fix:   { label: 'a dict does it',        code: "list({'b': 1, 'a': 2})", output: "['b', 'a']" },
    },
    {
      name: 'Calling move_to_end on a plain dict',
      desc: 'Only OrderedDict has it. With a dict, pop and re-insert.',
      wrong: { label: 'dict.move_to_end', code: "d = {'a': 1, 'b': 2}\nd.move_to_end('a')", output: "AttributeError: 'dict' object has no attribute 'move_to_end'" },
      fix:   { label: 'd[k] = d.pop(k)',  code: "d = {'a': 1, 'b': 2}\nd['a'] = d.pop('a')\nlist(d)", output: "['b', 'a']" },
    },
  ],

  when: {
    use: [
      'LRU caches and other "recently used" ordering',
      'Queues keyed by name where you pop the oldest entry',
      'Comparisons where order is part of the value',
    ],
    avoid: [
      'Only needing insertion order → dict (smaller and faster)',
      'A ready-made LRU cache for a function → functools.lru_cache',
    ],
  },

  notes: {
    cpython:    'Lib/collections/__init__.py has a pure-Python version, but the C implementation in Objects/odictobject.c is used',
    'vs dict':  'dict keeps insertion order since 3.7; OrderedDict adds move_to_end, popitem(last=), reversible views since 3.5, and order-sensitive == between OrderedDicts',
    'Versions': 'Added in 3.1; move_to_end in 3.2 (docs.python.org)',
  },

  related: [
    { name: 'OrderedDict.move_to_end', slug: 'ordereddict-move_to_end', when: 'Reorder one key' },
    { name: 'OrderedDict.popitem',     slug: 'ordereddict-popitem',     when: 'Pop from either end' },
    { name: 'OrderedDict dict methods', slug: 'ordereddict-methods',    when: 'keys, update, pop …' },
    { name: 'dict',                    slug: 'dict',                    when: 'Ordered too, since 3.7', category: 'functions' },
    { name: 'dict.popitem',            slug: 'dict-popitem',            when: 'Always the last item', category: 'functions' },
  ],

  faq: [
    {
      q: 'Is OrderedDict still needed in Python 3.7+?',
      a: 'Not for keeping order — dict does that. It is still useful for move_to_end(), popitem(last=False), and equality that takes order into account, for example in LRU caches.',
    },
    {
      q: 'What is the difference between OrderedDict and dict?',
      a: 'Both preserve insertion order. OrderedDict can move a key to either end, pop from the front, and two OrderedDicts are equal only if their order matches. A dict uses less memory and compares without regard to order.',
    },
    {
      q: 'Why do two OrderedDicts with the same items compare unequal?',
      a: 'OrderedDict == OrderedDict also compares the order of keys. Compare dict(a) == dict(b) to ignore order.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.OrderedDict',
    meta:  'collections.OrderedDict',
  },
};
