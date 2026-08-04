// content/reference/python/functions/dict-items.js
//
// Slug is type-prefixed: `items` is a dict method (also a view type).

export const meta = {
  slug:        'dict-items',
  name:        'dict.items',
  signature:   'dict.items()',
  blurb:       'A live view of the dict as (key, value) pairs.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'items pairs view dict key value iterate for loop unpack',
};

export const method = {
  slug:      'dict-items',
  name:      'dict.items',
  signature: 'dict.items()',
  returns:   { type: 'dict_items', desc: 'A view object over (key, value) tuples. Live — reflects changes to the underlying dict. Iterable, sized, and set-like (supports union/intersection).' },

  category:    'Dict method',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'Iterate a dict as (key, value) pairs — a view, not a copy. Insertion order is preserved (3.7+).',

  cheat: {
    commonCall: 'for k, v in d.items():',
    returns:    'a dict_items view — live, not a list',
    replaces:   'the manual `for k in d: v = d[k]` pattern',
    watchOut:   'mutating d during iteration raises RuntimeError',
  },

  parameters: [
    // items() takes no arguments — parameters array intentionally empty
  ],

  demoParams: [
    { name: 'dict', type: 'dict', hint: 'key: value pairs', input: 'kv' },
  ],
  cases: [
    { id: 'basic',      label: 'basic',        values: { dict: 'a: 1, b: 2, c: 3' } },
    { id: 'strings',    label: 'string values',values: { dict: 'name: alice, role: admin' } },
    { id: 'one',        label: 'single pair',  values: { dict: 'only: 42' } },
    { id: 'empty',      label: 'empty dict',   values: { dict: '' } },
    { id: 'ordered',    label: 'insertion order', values: { dict: 'z: 1, a: 2, m: 3' } },
  ],
  demoExplainer: 'The demo materializes the view as a list of pairs so you can see them all at once. In real code you iterate directly: `for k, v in d.items():`. Since Python 3.7 the pair order matches insertion order — earlier versions gave no order guarantee.',

  patterns: [
    {
      name: 'Iterate with unpacking',
      desc: 'The canonical way to walk a dict when you need both key and value.',
      code: 'for key, value in config.items():\n    print(f"{key}={value}")',
    },
    {
      name: 'Invert a dict',
      desc: 'One comprehension swaps keys and values — assuming values are hashable and unique.',
      code: 'inverse = {v: k for k, v in original.items()}',
    },
    {
      name: 'Filter to a new dict',
      desc: 'Keep only pairs matching a predicate — no manual loop.',
      code: 'kept = {k: v for k, v in d.items() if v is not None}',
    },
    {
      name: 'Sort a dict by value',
      desc: 'items() feeds sorted, which returns a list of pairs — rebuild a dict from that.',
      code: 'ordered = dict(sorted(d.items(), key=lambda kv: kv[1]))',
    },
  ],

  examples: [
    { title: 'Iterate pairs',       code: 'list({"a": 1, "b": 2}.items())',              returns: '[("a", 1), ("b", 2)]' },
    { title: 'Empty is empty',      code: 'list({}.items())',                             returns: '[]' },
    { title: 'Insertion order',     code: 'list({"z": 1, "a": 2}.items())',              returns: '[("z", 1), ("a", 2)]' },
    { title: 'View reflects updates', code: 'd = {"a": 1}\nv = d.items()\nd["b"] = 2\nlist(v)', returns: '[("a", 1), ("b", 2)]' },
  ],

  pitfalls: [
    {
      name: 'It is a VIEW, not a list',
      desc: 'items() returns a live view. Type checks that expect list, or indexing, both fail. Wrap in list() when you need a snapshot or index access.',
      wrong: { label: 'Not indexable', code: 'd = {"a": 1, "b": 2}\nd.items()[0]', output: "TypeError: 'dict_items' object is not subscriptable" },
      fix:   { label: 'Materialize',   code: 'list(d.items())[0]', output: "('a', 1)" },
    },
    {
      name: 'Modifying the dict during iteration raises',
      desc: 'Changing the dict\'s size while iterating over its items view is a RuntimeError. Read-only iteration is safe; add/remove keys — take a snapshot first.',
      wrong: { label: 'Runtime error', code: 'for k, v in d.items():\n    if v is None:\n        del d[k]', output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'Snapshot first',code: 'for k, v in list(d.items()):\n    if v is None:\n        del d[k]', output: 'safe' },
    },
    {
      name: 'The view lives with the dict',
      desc: 'Keeping a reference to items() does not freeze the dict. Later mutations show up when you iterate the same view again — surprising if you thought you had a snapshot.',
      wrong: { label: 'Not a snapshot', code: 'v = d.items()\nd["new"] = 99\nlist(v)  # includes ("new", 99)', output: 'view sees the added pair' },
      fix:   { label: 'Snapshot with list', code: 'snap = list(d.items())\nd["new"] = 99\nsnap  # unchanged', output: 'independent copy' },
    },
  ],

  when: {
    use: [
      'Iterating with both key and value',
      'Comprehensions over dict entries',
      'Set-like operations across two dicts (items views are set-like)',
      'Feeding sorted / filter / map over pairs',
    ],
    avoid: [
      'Just the keys → for k in d or d.keys()',
      'Just the values → d.values()',
      'Index access → list(d.items())',
      'Freezing a snapshot for concurrent mutation → list(d.items())',
    ],
  },

  notes: {
    complexity: 'O(1) to create the view; O(n) to iterate',
    return:     'dict_items view — live, sized, iterable, set-like',
    cpython:    'Objects/dictobject.c :: dictitems_new — no data copied',
    memory:     'O(1) — the view is a small wrapper over the dict',
    threadSafe: 'Iteration is not safe under concurrent mutation of the source dict',
  },

  related: [
    { name: 'dict.get',        slug: 'get',        when: 'Read a single value safely' },
    { name: 'dict.pop',        slug: 'dict-pop',   when: 'Remove while retrieving' },
    { name: 'dict.setdefault', slug: 'setdefault', when: 'Read-or-store in one call' },
    { name: 'enumerate',       slug: 'enumerate',  when: 'Index-and-value from an iterable' },
    { name: 'zip',             slug: 'zip',        when: 'Pair items across two iterables' },
  ],

  faq: [
    {
      q: 'What is the difference between items(), keys() and values()?',
      a: 'All three return live views over the same dict. items() gives (key, value) tuples, keys() gives just keys, values() gives just values. Iterating a dict directly (`for k in d`) is equivalent to iterating its keys().',
    },
    {
      q: 'Is the order guaranteed?',
      a: 'Since Python 3.7 dicts preserve insertion order, and items() iterates in that order. Before 3.7 the order was implementation-defined.',
    },
    {
      q: 'Can I compare items() from two dicts?',
      a: 'Yes — items views are set-like (their entries must be hashable). Intersection, union, difference all work like sets.',
      code: 'common = d1.items() &amp; d2.items()',
    },
  ],

  history: [
    { version: '2.2', note: 'items() introduced (originally as a list-building method).' },
    { version: '3.0', note: 'items() became a view instead of a list; iteritems() was removed.' },
    { version: '3.7', note: 'Insertion order preserved by dict — items() iterates in that order.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.items',
    meta:  'dict.items',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
  ],
};