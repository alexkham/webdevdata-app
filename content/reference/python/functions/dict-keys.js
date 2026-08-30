// content/reference/python/functions/dict-keys.js
//
// Slug is type-prefixed: `keys` is a dict method (also a view type).

export const meta = {
  slug:        'dict-keys',
  name:        'dict.keys',
  signature:   'dict.keys()',
  blurb:       'A live view of the dict\'s keys.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'keys view dict names iterate for loop names set operations',
};

export const method = {
  slug:      'dict-keys',
  name:      'dict.keys',
  signature: 'dict.keys()',
  returns:   { type: 'dict_keys', desc: 'A view object over the dict\'s keys. Live — reflects changes to the underlying dict. Iterable, sized, and set-like (supports union/intersection/difference).' },

  category:    'Dict method',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'Iterate the dict\'s keys as a live view — not a copy. Insertion order preserved (3.7+).',

  cheat: {
    commonCall: 'for k in d.keys():',
    returns:    'a dict_keys view — live, not a list',
    replaces:   'the manual key list; iterating d directly does the same',
    watchOut:   'mutating d during iteration raises RuntimeError',
  },

  parameters: [
    // keys() takes no arguments — parameters array intentionally empty
  ],

  demoParams: [
    { name: 'dict', type: 'dict', hint: 'key: value pairs', input: 'kv' },
  ],
  cases: [
    { id: 'basic',      label: 'basic',           values: { dict: 'a: 1, b: 2, c: 3' } },
    { id: 'strings',    label: 'string values',   values: { dict: 'name: alice, role: admin' } },
    { id: 'one',        label: 'single pair',     values: { dict: 'only: 42' } },
    { id: 'empty',      label: 'empty dict',      values: { dict: '' } },
    { id: 'ordered',    label: 'insertion order', values: { dict: 'z: 1, a: 2, m: 3' } },
  ],
  demoExplainer: 'The demo materializes the view as a list so you can see the keys at once. In real code you iterate directly: `for k in d.keys():` — or, equivalently, `for k in d:`. Since Python 3.7 the order matches insertion order; earlier versions gave no guarantee.',

  patterns: [
    {
      name: 'Iterate keys explicitly',
      desc: 'When the code needs to say \"keys\" out loud for readability, use .keys(). `for k in d:` does the same thing.',
      code: 'for k in d.keys():\n    process(k)',
    },
    {
      name: 'Compare two dicts\' keys',
      desc: 'keys() views are set-like — union, intersection, and difference all work.',
      code: 'shared    = d1.keys() & d2.keys()\nonly_in_1 = d1.keys() - d2.keys()',
    },
    {
      name: 'Snapshot for concurrent mutation',
      desc: 'Wrap in list() when you need to modify the dict during iteration.',
      code: 'for k in list(d.keys()):\n    if predicate(k):\n        del d[k]',
    },
  ],

  examples: [
    { title: 'Iterate keys',        code: 'list({"a": 1, "b": 2}.keys())',           returns: '["a", "b"]' },
    { title: 'Empty dict',          code: 'list({}.keys())',                          returns: '[]' },
    { title: 'Insertion order',     code: 'list({"z": 1, "a": 2}.keys())',           returns: '["z", "a"]' },
    { title: 'Set-like intersection', code: '{"a": 1, "b": 2}.keys() & {"b", "c"}', returns: '{"b"}' },
    { title: 'View reflects updates', code: 'd = {"a": 1}\nk = d.keys()\nd["b"] = 2\nlist(k)', returns: '["a", "b"]' },
  ],

  pitfalls: [
    {
      name: 'It is a VIEW, not a list',
      desc: 'keys() returns a live view. Type checks that expect list, or indexing, both fail. Wrap in list() when you need a snapshot or index access.',
      wrong: { label: 'Not indexable', code: 'd = {"a": 1, "b": 2}\nd.keys()[0]', output: "TypeError: 'dict_keys' object is not subscriptable" },
      fix:   { label: 'Materialize',   code: 'list(d.keys())[0]', output: '"a"' },
    },
    {
      name: 'Modifying the dict during iteration raises',
      desc: 'Changing the dict\'s size while iterating over its keys view is a RuntimeError. Read-only iteration is safe; add/remove keys — take a snapshot first.',
      wrong: { label: 'Runtime error', code: 'for k in d.keys():\n    if d[k] is None:\n        del d[k]', output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'Snapshot first',code: 'for k in list(d.keys()):\n    if d[k] is None:\n        del d[k]', output: 'safe' },
    },
    {
      name: '`for k in d.keys()` is the same as `for k in d`',
      desc: 'Iterating a dict yields its keys — .keys() is redundant here. Use whichever reads more clearly for the caller; there is no performance difference.',
      wrong: { label: 'Verbose', code: 'for k in d.keys():\n    print(k)', output: 'same as below' },
      fix:   { label: 'Idiomatic', code: 'for k in d:\n    print(k)', output: 'same behavior' },
    },
    {
      name: 'Keys view lives with the dict',
      desc: 'Keeping a reference to keys() does not freeze the dict. Later mutations show up when you iterate the same view again — surprising if you thought you had a snapshot.',
      wrong: { label: 'Not a snapshot', code: 'k = d.keys()\nd["new"] = 99\nlist(k)  # includes "new"', output: 'view sees the added key' },
      fix:   { label: 'Snapshot with list', code: 'snap = list(d.keys())\nd["new"] = 99\nsnap  # unchanged', output: 'independent copy' },
    },
  ],

  when: {
    use: [
      'Explicitly reading \"keys\" for code clarity',
      'Set-like operations across two dicts (keys views are set-like)',
      'Feeding sorted / filter / any / all with just the keys',
      'Membership tests: `k in d.keys()` is equivalent to `k in d`',
    ],
    avoid: [
      'Simple iteration → for k in d (no need to call .keys())',
      'Index access → list(d.keys())',
      'Freezing a snapshot for concurrent mutation → list(d.keys())',
      'You need values too → d.values() or d.items()',
    ],
  },

  notes: {
    complexity: 'O(1) to create the view; O(n) to iterate',
    return:     'dict_keys view — live, sized, iterable, set-like',
    cpython:    'Objects/dictobject.c :: dictkeys_new — no data copied',
    memory:     'O(1) — the view is a small wrapper over the dict',
    threadSafe: 'Iteration is not safe under concurrent mutation of the source dict',
  },

  related: [
    { name: 'dict.items',      slug: 'dict-items', when: 'Both key and value at once' },
    { name: 'dict.pop',        slug: 'dict-pop',   when: 'Remove while retrieving' },
    { name: 'dict.get',        slug: 'get',        when: 'Read a single value safely' },
    { name: 'dict.setdefault', slug: 'setdefault', when: 'Read-or-store in one call' },
  ],

  faq: [
    {
      q: 'What is the difference between `for k in d.keys()` and `for k in d`?',
      a: 'Nothing — iterating a dict yields its keys by default. `d.keys()` is only needed when you want set-like operations (`&`, `|`, `-`) between two dicts\' key sets, or when the extra noun helps readability.',
    },
    {
      q: 'Can I compare keys() from two dicts?',
      a: 'Yes — keys views are set-like. Union, intersection, and difference all work.',
      code: 'common = d1.keys() & d2.keys()\nonly1  = d1.keys() - d2.keys()',
    },
    {
      q: 'Is the order guaranteed?',
      a: 'Since Python 3.7 dicts preserve insertion order, and keys() iterates in that order. Before 3.7 the order was implementation-defined.',
    },
  ],

  history: [
    { version: '2.2', note: 'keys() introduced (originally as a list-building method).' },
    { version: '3.0', note: 'keys() became a view instead of a list; iterkeys() was removed.' },
    { version: '3.7', note: 'Insertion order preserved by dict — keys() iterates in that order.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.keys',
    meta:  'dict.keys',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
  ],
};