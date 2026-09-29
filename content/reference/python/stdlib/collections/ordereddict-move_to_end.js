// content/reference/python/stdlib/collections/ordereddict-move_to_end.js

export const meta = {
  slug:        'ordereddict-move_to_end',
  name:        'OrderedDict.move_to_end',
  signature:   'OrderedDict.move_to_end(key, last=True)',
  blurb:       'Move an existing key to the end (last=True) or to the front (last=False) of an OrderedDict, keeping its value.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'ordereddict move_to_end move key to end move key to front reorder dict lru OrderedDict.move_to_end python collections',
};

export const method = {
  slug:      'ordereddict-move_to_end',
  name:      'OrderedDict.move_to_end',
  signature: 'OrderedDict.move_to_end(key, last=True)',
  returns:   { type: 'None', desc: 'The OrderedDict is reordered in place.' },

  category:    'OrderedDict method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'The operation that makes OrderedDict worth using: O(1) reordering of one key to either end. The key must exist — there is no "insert at the front".',

  covers: ['OrderedDict.move_to_end'],

  cheat: {
    commonCall: "od.move_to_end('a') · od.move_to_end('a', last=False)",
    returns:    'None',
    replaces:   'd[k] = d.pop(k) on a plain dict (end only)',
    watchOut:   'KeyError when the key is missing',
  },

  parameters: [
    { name: 'key',  type: 'hashable', required: true,  default: null,   desc: 'An existing key.' },
    { name: 'last', type: 'bool',     required: false, default: 'True', desc: 'True: move to the end. False: move to the front.' },
  ],

  modes: [
    {
      id: 'end',
      label: 'to the end',
      blurb: 'move_to_end(key) — the key becomes the last one.',
      params: [
        { name: 'keys', type: 'list[str]', hint: 'keys in order', input: 'csv' },
        { name: 'key',  type: 'str',       hint: 'key to move',   input: 'text' },
      ],
      template: 'from collections import OrderedDict\nod = OrderedDict.fromkeys({$keys})\nod.move_to_end({$key})\nlist(od)',
      cases: [
        { id: 'first',   label: 'move first', values: { keys: 'a, b, c', key: 'a' } },
        { id: 'already', label: 'already last', values: { keys: 'a, b, c', key: 'c' } },
        { id: 'missing', label: 'missing',    values: { keys: 'a, b', key: 'z' } },
      ],
    },
    {
      id: 'front',
      label: 'to the front',
      blurb: 'move_to_end(key, last=False) — the key becomes the first one.',
      params: [
        { name: 'keys', type: 'list[str]', hint: 'keys in order', input: 'csv' },
        { name: 'key',  type: 'str',       hint: 'key to move',   input: 'text' },
      ],
      template: 'from collections import OrderedDict\nod = OrderedDict.fromkeys({$keys})\nod.move_to_end({$key}, last=False)\nlist(od)',
      cases: [
        { id: 'last', label: 'move last', values: { keys: 'a, b, c', key: 'c' } },
        { id: 'mid',  label: 'move middle', values: { keys: 'a, b, c', key: 'b' } },
      ],
    },
  ],
  demoExplainer: 'Moving a key that is already at the requested end changes nothing. A key that does not exist raises KeyError with the key as the message — move_to_end never inserts.',

  patterns: [
    {
      name: 'Mark as recently used',
      desc: 'LRU caches move a key to the end on every hit.',
      code: 'def lookup(cache, key):\n    if key in cache:\n        cache.move_to_end(key)\n        return cache[key]',
    },
    {
      name: 'Pin a key to the top',
      desc: 'Insert, then move it to the front.',
      code: "od['header'] = value\nod.move_to_end('header', last=False)",
    },
  ],

  examples: [
    { title: 'Move to the end',     code: "from collections import OrderedDict\nod = OrderedDict.fromkeys('abcde')\nod.move_to_end('b')\n''.join(od)", returns: "'acdeb'" },
    { title: 'Move to the front',   code: "from collections import OrderedDict\nod = OrderedDict.fromkeys('abcde')\nod.move_to_end('b', last=False)\n''.join(od)", returns: "'bacde'" },
    { title: 'The value comes along', code: "from collections import OrderedDict\nod = OrderedDict(a=1, b=2)\nod.move_to_end('a')\nod", returns: "OrderedDict({'b': 2, 'a': 1})" },
    { title: 'Missing key',         code: "from collections import OrderedDict\nOrderedDict(a=1).move_to_end('x')", returns: "KeyError: 'x'" },
    { title: 'Returns None',        code: "from collections import OrderedDict\nprint(OrderedDict(a=1).move_to_end('a'))", returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Using it to insert',
      desc: 'The key must already exist. Assign first, then move.',
      wrong: { label: 'move a new key', code: "from collections import OrderedDict\nod = OrderedDict(b=2)\nod.move_to_end('a', last=False)", output: "KeyError: 'a'" },
      fix:   { label: 'assign, then move', code: "from collections import OrderedDict\nod = OrderedDict(b=2)\nod['a'] = 1\nod.move_to_end('a', last=False)\nod", output: "OrderedDict({'a': 1, 'b': 2})" },
    },
    {
      name: 'Expecting assignment to reorder',
      desc: 'Updating the value of an existing key keeps its position, in dicts and OrderedDicts alike.',
      wrong: { label: 'od[k] = v',      code: "from collections import OrderedDict\nod = OrderedDict(a=1, b=2)\nod['a'] = 9\nlist(od)", output: "['a', 'b']" },
      fix:   { label: 'then move_to_end', code: "from collections import OrderedDict\nod = OrderedDict(a=1, b=2)\nod['a'] = 9\nod.move_to_end('a')\nlist(od)", output: "['b', 'a']" },
    },
  ],

  when: {
    use: [
      'Recency ordering (LRU, MRU lists)',
      'Pinning or sinking one entry',
    ],
    avoid: [
      'Sorting everything → build a new dict from sorted(d.items())',
    ],
  },

  notes: {
    cpython:    'OrderedDict_move_to_end_impl in Objects/odictobject.c — relinks one node of the internal linked list',
    'Versions': 'Added in 3.2 (docs.python.org)',
  },

  related: [
    { name: 'OrderedDict',          slug: 'ordereddict',          when: 'The class and an LRU demo' },
    { name: 'OrderedDict.popitem',  slug: 'ordereddict-popitem',  when: 'Remove from either end' },
    { name: 'dict.pop',             slug: 'dict-pop',             when: 'd[k] = d.pop(k) moves to the end in a dict', category: 'functions' },
    { name: 'KeyError',             slug: 'keyerror',             when: 'Moving a missing key', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I move a key to the end of a dict?',
      a: 'With an OrderedDict: od.move_to_end(key). With a plain dict: d[key] = d.pop(key) re-inserts it at the end.',
    },
    {
      q: 'How do I move a key to the front of a dict?',
      a: 'OrderedDict.move_to_end(key, last=False). A plain dict has no efficient way; you would rebuild it: {key: d[key], **{k: v for k, v in d.items() if k != key}}.',
    },
    {
      q: 'Why does move_to_end raise KeyError?',
      a: 'The key is not in the OrderedDict. move_to_end only reorders existing keys; assign the key first if you want to add it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.OrderedDict.move_to_end',
    meta:  'OrderedDict.move_to_end',
  },
};
