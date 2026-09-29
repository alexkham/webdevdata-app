// content/reference/python/stdlib/collections/ordereddict-methods.js

export const meta = {
  slug:        'ordereddict-methods',
  name:        'OrderedDict dict methods',
  signature:   'od.keys() · od.values() · od.items() · od.update(...) · od.pop(key[, default]) · od.setdefault(key, default=None) · od.clear() · od.copy() · OrderedDict.fromkeys(iterable, value=None)',
  blurb:       'The dict methods OrderedDict re-implements to keep its order bookkeeping: keys, values, items, update, pop, setdefault, clear, copy and fromkeys.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'ordereddict keys values items update pop setdefault clear copy fromkeys OrderedDict.keys OrderedDict.values OrderedDict.items OrderedDict.update OrderedDict.pop OrderedDict.setdefault OrderedDict.clear OrderedDict.copy OrderedDict.fromkeys reversed views python collections',
};

export const method = {
  slug:      'ordereddict-methods',
  name:      'OrderedDict dict methods',
  signature: 'OrderedDict.update([other], **kwds)',
  returns:   { type: 'varies', desc: 'Same results as the dict methods of the same name; copy() and fromkeys() return an OrderedDict.' },

  category:    'OrderedDict methods',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'They behave exactly like their dict namesakes — new keys go to the end, existing keys keep their place — with two OrderedDict twists: copy() and fromkeys() return an OrderedDict, and the keys/values/items views support reversed().',

  covers: [
    'OrderedDict.keys', 'OrderedDict.values', 'OrderedDict.items', 'OrderedDict.update', 'OrderedDict.pop',
    'OrderedDict.setdefault', 'OrderedDict.clear', 'OrderedDict.copy', 'OrderedDict.fromkeys',
  ],

  cheat: {
    commonCall: "od.update(b=2) · od.pop('a') · list(reversed(od.items()))",
    returns:    'what dict returns',
    replaces:   'nothing new — they are the dict API',
    watchOut:   'update() does not move existing keys',
  },

  parameters: [
    { name: 'key',      type: 'hashable', required: true,  default: null,   desc: 'pop / setdefault: the key.' },
    { name: 'default',  type: 'object',   required: false, default: 'None', desc: 'pop: returned when key is missing (otherwise KeyError); setdefault: inserted at the END when key is missing.' },
    { name: 'other',    type: 'mapping | pairs', required: false, default: null, desc: 'update: new keys are appended in the order given; existing keys keep their position.' },
    { name: 'iterable', type: 'iterable', required: true,  default: null,   desc: 'fromkeys: the keys, in order.' },
  ],

  modes: [
    {
      id: 'update',
      label: 'update',
      blurb: 'Existing keys get new values in place; new keys go to the end.',
      params: [
        { name: 'keys', type: 'list[str]', hint: 'initial keys (value 0)',  input: 'csv' },
        { name: 'more', type: 'list[str]', hint: 'keys to update (value 1)', input: 'csv' },
      ],
      template: 'from collections import OrderedDict\nod = OrderedDict.fromkeys({$keys}, 0)\nod.update(dict.fromkeys({$more}, 1))\nod',
      cases: [
        { id: 'mix',  label: 'old + new', values: { keys: 'a, b, c', more: 'b, x' } },
        { id: 'none', label: 'nothing',   values: { keys: 'a', more: '' } },
      ],
    },
    {
      id: 'setdefault',
      label: 'setdefault',
      blurb: 'Returns the existing value, or inserts the default at the end.',
      params: [
        { name: 'keys', type: 'list[str]', hint: 'initial keys (value 0)', input: 'csv' },
        { name: 'key',  type: 'str',       hint: 'key',                    input: 'text' },
      ],
      template: 'from collections import OrderedDict\nod = OrderedDict.fromkeys({$keys}, 0)\n(od.setdefault({$key}, 1), od)',
      cases: [
        { id: 'exists', label: 'exists',  values: { keys: 'a, b', key: 'a' } },
        { id: 'new',    label: 'new key', values: { keys: 'a, b', key: 'z' } },
      ],
    },
    {
      id: 'reversed',
      label: 'pop + reversed',
      blurb: 'Remove a key, then walk the items view backwards.',
      params: [
        { name: 'keys', type: 'list[str]', hint: 'keys',       input: 'csv' },
        { name: 'key',  type: 'str',       hint: 'key to pop', input: 'text' },
      ],
      template: 'from collections import OrderedDict\nod = OrderedDict.fromkeys({$keys}, 0)\nod.pop({$key})\nlist(reversed(od.items()))',
      cases: [
        { id: 'mid',     label: 'pop middle', values: { keys: 'a, b, c', key: 'b' } },
        { id: 'missing', label: 'missing',    values: { keys: 'a, b', key: 'z' } },
      ],
    },
  ],
  demoExplainer: 'In the update tab b keeps its second place with its new value 1, and only the new key x is appended. pop of a missing key without a default is a KeyError, just like dict.pop.',

  patterns: [
    {
      name: 'Newest first',
      desc: 'Views are reversible (plain dict views are too).',
      code: 'for key, value in reversed(od.items()):\n    print(key, value)',
    },
    {
      name: 'Ordered set of keys',
      desc: 'fromkeys de-duplicates while keeping first-seen order.',
      code: 'from collections import OrderedDict\nunique = list(OrderedDict.fromkeys(items))',
    },
    {
      name: 'Pop with a fallback',
      desc: 'pop(key, default) never raises.',
      code: 'value = od.pop(key, None)',
    },
  ],

  examples: [
    { title: 'fromkeys returns an OrderedDict', code: "from collections import OrderedDict\nOrderedDict.fromkeys('ab', 0)", returns: "OrderedDict({'a': 0, 'b': 0})" },
    { title: 'copy keeps the type',             code: 'from collections import OrderedDict\ntype(OrderedDict(a=1).copy()).__name__', returns: "'OrderedDict'" },
    { title: 'Views in order',                  code: 'from collections import OrderedDict\nod = OrderedDict(b=1, a=2)\n(list(od.keys()), list(od.values()))', returns: "(['b', 'a'], [1, 2])" },
    { title: 'Reversed items',                  code: 'from collections import OrderedDict\nlist(reversed(OrderedDict(a=1, b=2).items()))', returns: "[('b', 2), ('a', 1)]" },
    { title: 'update keeps positions',          code: 'from collections import OrderedDict\nod = OrderedDict(a=1, b=2)\nod.update(a=10, c=3)\nod', returns: "OrderedDict({'a': 10, 'b': 2, 'c': 3})" },
    { title: 'pop with a default',              code: "from collections import OrderedDict\nOrderedDict(a=1).pop('x', 'none')", returns: "'none'" },
    { title: 'clear',                           code: 'from collections import OrderedDict\nod = OrderedDict(a=1)\nod.clear()\nod', returns: 'OrderedDict()' },
  ],

  pitfalls: [
    {
      name: 'Expecting update() to move keys to the end',
      desc: 'Existing keys keep their position. Use move_to_end afterwards if recency matters.',
      wrong: { label: 'update only',        code: 'from collections import OrderedDict\nod = OrderedDict(a=1, b=2)\nod.update(a=3)\nlist(od)', output: "['a', 'b']" },
      fix:   { label: 'update + move_to_end', code: "from collections import OrderedDict\nod = OrderedDict(a=1, b=2)\nod.update(a=3)\nod.move_to_end('a')\nlist(od)", output: "['b', 'a']" },
    },
    {
      name: 'pop without a default',
      desc: 'A missing key raises KeyError.',
      wrong: { label: "od.pop('x')",       code: "from collections import OrderedDict\nOrderedDict(a=1).pop('x')", output: "KeyError: 'x'" },
      fix:   { label: "od.pop('x', None)", code: "from collections import OrderedDict\nprint(OrderedDict(a=1).pop('x', None))", output: 'None' },
    },
  ],

  when: {
    use: [
      'Any normal dict work on an OrderedDict',
    ],
    avoid: [
      'Reordering → move_to_end; removing from the front → popitem(last=False)',
    ],
  },

  notes: {
    cpython:    'Objects/odictobject.c defines its own keys/values/items views and update/pop/setdefault/clear/copy/fromkeys so the linked list of keys stays in sync with the dict',
    'Versions': 'Reverse iteration of the keys/values/items views since 3.5 (docs.python.org)',
  },

  related: [
    { name: 'OrderedDict',       slug: 'ordereddict',       when: 'The class' },
    { name: 'dict.update',       slug: 'dict-update',       when: 'Same semantics', category: 'functions' },
    { name: 'dict.pop',          slug: 'dict-pop',          when: 'Same semantics', category: 'functions' },
    { name: 'dict.setdefault',   slug: 'setdefault',        when: 'Same semantics', category: 'functions' },
    { name: 'dict.fromkeys',     slug: 'dict-fromkeys',     when: 'Same semantics', category: 'functions' },
    { name: 'dict.items',        slug: 'dict-items',        when: 'Views', category: 'functions' },
    { name: 'dict.keys',         slug: 'dict-keys',         when: 'Views', category: 'functions' },
    { name: 'dict.values',       slug: 'dict-values',       when: 'Views', category: 'functions' },
    { name: 'dict.clear',        slug: 'dict-clear',        when: 'Same semantics', category: 'functions' },
    { name: 'dict.copy',         slug: 'dict-copy',         when: 'Same semantics', category: 'functions' },
  ],

  faq: [
    {
      q: 'Does OrderedDict.update move existing keys?',
      a: 'No. Like dict.update, it replaces the value of an existing key in place and appends only new keys, in the order they are given.',
    },
    {
      q: 'Can I iterate an OrderedDict in reverse?',
      a: 'Yes: reversed(od), reversed(od.keys()), reversed(od.values()) and reversed(od.items()) all work. Plain dicts and their views support reversed() as well.',
    },
    {
      q: 'What does OrderedDict.fromkeys return?',
      a: 'An OrderedDict whose keys come from the iterable, in order, all mapped to the same value (None by default). Duplicates keep their first position.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.OrderedDict',
    meta:  'OrderedDict objects',
  },
};
