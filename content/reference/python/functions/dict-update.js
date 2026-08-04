// content/reference/python/functions/dict-update.js
//
// Slug is type-prefixed: `update` is a dict method (also on set, differently).

export const meta = {
  slug:        'dict-update',
  name:        'dict.update',
  signature:   'dict.update([other])',
  blurb:       'Merge another dict in — silently overwriting existing keys.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 1.5+',
  searchTerms: 'update merge dict combine overwrite kwargs union add insert',
};

export const method = {
  slug:      'dict-update',
  name:      'dict.update',
  signature: 'dict.update([other])',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the dict state after updating.' },

  category:    'Dict method',
  version:     'Python 1.5+',
  hasLiveDemo: true,

  subtitle: 'Copy keys and values from another dict (or iterable of pairs, or kwargs) into this dict. Existing keys are silently overwritten.',

  cheat: {
    commonCall: 'config.update(overrides)',
    returns:    'None — the receiving dict grows / changes',
    replaces:   'a for-loop of individual assignments',
    watchOut:   'existing keys are OVERWRITTEN, not merged',
  },

  parameters: [
    { name: 'other', type: 'dict | iterable[pair] | **kwargs', required: false, default: 'None', desc: 'Source of new pairs. Accepts another dict, an iterable of (key, value) pairs, or keyword arguments. Later values win on collision.' },
  ],

  demoParams: [
    { name: 'dict',  type: 'dict', hint: 'starting dict',   input: 'kv' },
    { name: 'other', type: 'dict', hint: 'pairs to merge',  input: 'kv' },
  ],
  cases: [
    { id: 'add-new',   label: 'add new keys',      values: { dict: 'a: 1, b: 2', other: 'c: 3, d: 4' } },
    { id: 'overwrite', label: 'overwrite',         values: { dict: 'a: 1, b: 2', other: 'a: 99, b: 88' } },
    { id: 'mixed',     label: 'add + overwrite',   values: { dict: 'a: 1, b: 2', other: 'b: 99, c: 3' } },
    { id: 'empty-src', label: 'from empty',        values: { dict: '',           other: 'a: 1, b: 2' } },
    { id: 'empty-oth', label: 'with empty',        values: { dict: 'a: 1, b: 2', other: '' } },
  ],
  demoExplainer: 'The demo shows the DICT STATE after updating. Python actually returns None; the meaningful effect is mutation. When a key exists in both, the value from `other` wins — silently. There is no built-in &quot;fail on collision&quot; mode.',

  patterns: [
    {
      name: 'Apply user overrides',
      desc: 'Start with defaults, layer overrides on top — later wins.',
      code: 'settings = defaults.copy()\nsettings.update(user_overrides)',
    },
    {
      name: 'Merge from an iterable of pairs',
      desc: 'update accepts any iterable of 2-tuples, not just dicts.',
      code: 'd.update([("a", 1), ("b", 2)])',
    },
    {
      name: 'Add via keyword arguments',
      desc: 'Nice for small, static additions.',
      code: 'd.update(debug=True, retries=3)',
    },
    {
      name: 'Sum counts across dicts',
      desc: 'update overwrites — for actual summing, iterate.',
      code: 'for k, v in extra.items():\n    totals[k] = totals.get(k, 0) + v',
    },
  ],

  examples: [
    { title: 'Add new pairs',        code: 'd = {"a": 1}\nd.update({"b": 2})\nd',            returns: '{"a": 1, "b": 2}' },
    { title: 'Overwrite existing',   code: 'd = {"a": 1}\nd.update({"a": 99})\nd',           returns: '{"a": 99}' },
    { title: 'From pairs',           code: 'd = {}\nd.update([("a", 1), ("b", 2)])\nd',      returns: '{"a": 1, "b": 2}' },
    { title: 'From kwargs',          code: 'd = {}\nd.update(x=10, y=20)\nd',                 returns: '{"x": 10, "y": 20}' },
    { title: 'Returns None',         code: '{"a": 1}.update({"b": 2})',                       returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Silent overwrite of existing keys',
      desc: 'No warning, no error — the second value simply replaces the first. Fine when overrides are intended; a bug when you meant to merge or protect existing values.',
      wrong: { label: 'Data lost', code: 'settings = {"port": 8000, "host": "prod.io"}\nsettings.update({"port": 3000, "host": "dev.io"})\nsettings', output: '{"port": 3000, "host": "dev.io"}' },
      fix:   { label: 'Protect keys', code: 'for k, v in overrides.items():\n    settings.setdefault(k, v)  # only adds if absent', output: 'existing values preserved' },
    },
    {
      name: 'Shallow merge — nested dicts get replaced',
      desc: 'update copies top-level values as they are. A nested dict is replaced wholesale, not deep-merged. Common footgun in config layering.',
      wrong: { label: 'Nested wiped', code: 'cfg = {"db": {"host": "a", "port": 1}}\ncfg.update({"db": {"host": "b"}})\ncfg', output: '{"db": {"host": "b"}}  # port is gone' },
      fix:   { label: 'Deep-merge by hand', code: 'cfg["db"].update({"host": "b"})\n# or use a recursive merge helper', output: '{"db": {"host": "b", "port": 1}}' },
    },
    {
      name: 'The `d = d.update(...)` bug',
      desc: 'update returns None. Assigning its result back sets your variable to None — the same class of bug as sort and extend.',
      wrong: { label: 'Now d is None', code: 'd = {"a": 1}\nd = d.update({"b": 2})\nprint(d)', output: 'None' },
      fix:   { label: 'Two options', code: 'd.update({"b": 2})     # mutate, keep name\n# or\nd = d | {"b": 2}       # new dict, replace name (3.9+)', output: '{"a": 1, "b": 2}' },
    },
    {
      name: 'Iterable of pairs must be 2-length',
      desc: 'Passing an iterable whose items are not exactly 2-element (key, value) pairs raises a specific ValueError.',
      wrong: { label: 'Wrong shape',  code: 'd.update([("a", 1, 2)])', output: 'ValueError: dictionary update sequence element #0 has length 3; 2 is required' },
      fix:   { label: 'Fix the shape', code: 'd.update([("a", 1)])', output: '{"a": 1}' },
    },
  ],

  when: {
    use: [
      'Applying overrides or defaults',
      'Merging config layers where later wins',
      'Populating a dict from an iterable of pairs',
      'Small hardcoded additions via kwargs',
    ],
    avoid: [
      'You need to detect collisions → guard with sets first, or iterate manually',
      'You need a deep merge → recursive helper',
      'You want a NEW dict without mutating either → `{**a, **b}` or `a | b` (3.9+)',
      'Summing values across dicts → iterate with dict.get',
    ],
  },

  notes: {
    complexity: 'O(k) where k is the size of the source',
    return:     'None; the dict is mutated in place',
    cpython:    'Objects/dictobject.c :: dict_update_common',
    memory:     'May reallocate the underlying hash table when it grows past its load factor',
    threadSafe: 'Not safe under concurrent mutation of either dict',
  },

  related: [
    { name: 'dict.items',      slug: 'dict-items', when: 'Inspect what will be merged first' },
    { name: 'dict.setdefault', slug: 'setdefault', when: 'Only add when the key is absent' },
    { name: 'dict.pop',        slug: 'dict-pop',   when: 'Remove during merge' },
    { name: 'dict.get',        slug: 'get',        when: 'Read a value before overwriting' },
  ],

  faq: [
    {
      q: 'What is the difference between update and the `|` operator?',
      a: 'update mutates the left dict in place and returns None. The `|` operator (Python 3.9+) returns a NEW dict without touching either input. `|=` is the in-place variant, roughly equivalent to update.',
    },
    {
      q: 'Does update preserve insertion order?',
      a: 'Yes since Python 3.7. Existing keys keep their position; new keys are appended in the order they appear in the source.',
    },
    {
      q: 'How do I do a deep merge?',
      a: 'update is intentionally shallow. For nested structures, walk them yourself or reach for a library helper.',
      code: 'def deep_merge(a, b):\n    for k, v in b.items():\n        if isinstance(v, dict) and isinstance(a.get(k), dict):\n            deep_merge(a[k], v)\n        else:\n            a[k] = v',
    },
    {
      q: 'Can I chain updates?',
      a: 'Not directly — update returns None. But `d | e | f` chains cleanly since 3.9.',
    },
  ],

  history: [
    { version: '1.5', note: 'update() introduced.' },
    { version: '2.4', note: 'Accepts an iterable of pairs.' },
    { version: '3.9', note: '`|` and `|=` dict merge operators added — the non-mutating and mutating alternatives.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.update',
    meta:  'dict.update',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data before and after' },
  ],
};