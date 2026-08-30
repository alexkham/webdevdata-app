// content/reference/python/functions/dict-fromkeys.js
//
// Slug is type-prefixed: `fromkeys` is a dict class method.

export const meta = {
  slug:        'dict-fromkeys',
  name:        'dict.fromkeys',
  signature:   'dict.fromkeys(iterable, value=None)',
  blurb:       'Build a new dict with every key mapped to the same value.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'fromkeys build create dict from keys initialize default value shared mutable',
};

export const method = {
  slug:      'dict-fromkeys',
  name:      'dict.fromkeys',
  signature: 'dict.fromkeys(iterable, value=None)',
  returns:   { type: 'dict', desc: 'A NEW dict with keys from the iterable, all mapped to the SAME value. The value is not copied — every key shares the exact same object reference.' },

  category:    'Dict method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Class method — build a fresh dict from a set of keys, with every key pointing at the same default value.',

  cheat: {
    commonCall: 'dict.fromkeys(keys, 0)',
    returns:    'a new dict — all values are the SAME object',
    replaces:   '`{k: default for k in keys}` when the default is immutable',
    watchOut:   'default is SHARED — dict.fromkeys(keys, []) gives every key the SAME list',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null,    desc: 'Any iterable of hashable keys. Duplicates collapse (last one wins, but they all get the same value).' },
    { name: 'value',    type: 'Any',      required: false, default: 'None',  desc: 'The default value for every key. Not copied — every key points at the exact same object.' },
  ],

  demoParams: [
    { name: 'keys',  type: 'list', hint: 'comma-separated keys', input: 'csv' },
    { name: 'value', type: 'Any',  hint: 'default value',        input: 'text-or-none' },
  ],
  demoTemplate: 'dict.fromkeys({keys}, {value})',
  cases: [
    { id: 'basic',    label: 'basic',       values: { keys: 'a,b,c',     value: '0' } },
    { id: 'none',     label: 'None default',values: { keys: 'x,y,z',     value: '' } },
    { id: 'text',     label: 'string value',values: { keys: 'red,green,blue', value: 'unset' } },
    { id: 'one',      label: 'single key',  values: { keys: 'only',      value: '42' } },
    { id: 'dupes',    label: 'duplicate keys', values: { keys: 'a,b,a,c', value: '1' } },
    { id: 'empty',    label: 'empty keys',  values: { keys: '',          value: '0' } },
  ],
  demoExplainer: 'The demo shows the resulting dict. Duplicate keys in the input collapse (only one entry per key). The critical thing NOT visible in this demo — because we pass strings — is the shared-reference behavior: if you passed a mutable default like [] or {}, every key would point at THE SAME list or dict. See pitfalls.',

  patterns: [
    {
      name: 'Initialize counters at zero',
      desc: 'Immutable defaults like 0, "", and None are safe to share.',
      code: 'counts = dict.fromkeys(categories, 0)',
    },
    {
      name: 'Deduplicate while preserving order',
      desc: 'Only the keys matter — the value is throwaway. Since 3.7 the key order is preserved.',
      code: 'unique = list(dict.fromkeys(items))   # order-preserving dedup',
    },
    {
      name: 'Set of allowed keys with None values',
      desc: 'A skeleton dict that the caller will populate.',
      code: 'template = dict.fromkeys(fields)   # every field mapped to None',
    },
  ],

  examples: [
    { title: 'Basic',                code: 'dict.fromkeys(["a", "b", "c"], 0)',   returns: '{"a": 0, "b": 0, "c": 0}' },
    { title: 'Default value is None', code: 'dict.fromkeys(["x", "y"])',           returns: '{"x": None, "y": None}' },
    { title: 'Order-preserving dedup', code: 'list(dict.fromkeys([3, 1, 2, 1]))',   returns: '[3, 1, 2]' },
    { title: 'Duplicates collapse',   code: 'dict.fromkeys("aabbcc")',              returns: '{"a": None, "b": None, "c": None}' },
    { title: 'From a range',          code: 'dict.fromkeys(range(3), "unset")',    returns: '{0: "unset", 1: "unset", 2: "unset"}' },
  ],

  pitfalls: [
    {
      name: 'Mutable default is SHARED across all keys',
      desc: 'The single most-copied footgun with fromkeys. The value is not copied — every key points at the SAME object. Appending to one key\'s list appears at every key.',
      wrong: { label: 'Same list everywhere', code: 'd = dict.fromkeys(["a", "b"], [])\nd["a"].append(1)\nd', output: '{"a": [1], "b": [1]}  # both keys see the append' },
      fix:   { label: 'Comprehension makes copies', code: 'd = {k: [] for k in ["a", "b"]}\nd["a"].append(1)\nd', output: '{"a": [1], "b": []}' },
    },
    {
      name: 'It is a CLASS method, not an instance method',
      desc: 'Called on the dict class, not on a dict instance. Calling on an instance works but reads awkwardly.',
      wrong: { label: 'Confusing style', code: '{"a": 1}.fromkeys(["x", "y"])   # ignores the receiver!', output: '{"x": None, "y": None}  # values NOT copied from the receiver' },
      fix:   { label: 'Class form',      code: 'dict.fromkeys(["x", "y"])', output: '{"x": None, "y": None}' },
    },
    {
      name: 'Unhashable keys raise TypeError',
      desc: 'Every key must be hashable. A list or dict in the iterable trips.',
      wrong: { label: 'Unhashable', code: 'dict.fromkeys([[1, 2], [3, 4]])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Tuple keys', code: 'dict.fromkeys([(1, 2), (3, 4)])', output: '{(1, 2): None, (3, 4): None}' },
    },
    {
      name: 'The value is NOT type-checked against the keys',
      desc: 'Any value type works — including a value that would be misleading given the domain. A common mistake is passing a callable, expecting each key to invoke it.',
      wrong: { label: 'Same reference', code: 'd = dict.fromkeys(["a", "b"], list)', output: '{"a": <class list>, "b": <class list>}' },
      fix:   { label: 'Comprehension calls it', code: 'd = {k: list() for k in ["a", "b"]}', output: '{"a": [], "b": []}  # separate lists' },
    },
  ],

  when: {
    use: [
      'Initializing counters or flags with an immutable default (0, None, "")',
      'Order-preserving deduplication of a list',
      'Building a skeleton dict where the caller will populate values',
      'Creating a \"set with values\" where every entry has the same tag',
    ],
    avoid: [
      'Mutable default value → use a dict comprehension instead',
      'Per-key computed defaults → dict comprehension or setdefault',
      'Deep-copy semantics needed → comprehension with copy() or deepcopy()',
      'Very large key iterables where a comprehension is more readable',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the iterable',
    return:     'A new dict; when called on a subclass, returns an instance of that subclass',
    cpython:    'Objects/dictobject.c :: dict_fromkeys_impl',
    memory:     'One dict allocated; the value is stored by reference, not copied',
    threadSafe: 'Yes — creation is a pure operation',
  },

  related: [
    { name: 'dict.copy',       slug: 'dict-copy',   when: 'Duplicate an existing dict rather than build from keys' },
    { name: 'dict.update',     slug: 'dict-update', when: 'Populate values after fromkeys' },
    { name: 'setdefault',      slug: 'setdefault',  when: 'Per-key default when values differ' },
    { name: 'dict.items',      slug: 'dict-items',  when: 'Iterate the result' },
  ],

  faq: [
    {
      q: 'Why is fromkeys a classmethod?',
      a: 'It builds a new dict from scratch — it does not need an existing dict to work with. Making it a classmethod keeps the API consistent: `dict.fromkeys(...)` reads like a factory call.',
    },
    {
      q: 'Why is mutable default a footgun?',
      a: 'The value is stored by reference, not copied. Every key ends up pointing at THE SAME object. Modifying it via one key modifies it for all — very rarely what you want. Reach for a dict comprehension instead.',
    },
    {
      q: 'Can I use fromkeys to deduplicate a list?',
      a: 'Yes — a common Python idiom. Since 3.7 dicts preserve insertion order, so dict.fromkeys is an order-preserving dedup.',
      code: 'list(dict.fromkeys([3, 1, 2, 1]))\n# [3, 1, 2]',
    },
    {
      q: 'What is the difference between fromkeys and a comprehension?',
      a: 'fromkeys is one call, shares the value across all keys. `{k: expr for k in keys}` evaluates expr per key — separate objects for mutable values, and you can compute per-key defaults.',
    },
  ],

  history: [
    { version: '2.3', note: 'fromkeys() introduced as a class method on dict.' },
    { version: '3.7', note: 'Insertion order preserved — enables the popular order-preserving dedup idiom.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.fromkeys',
    meta:  'dict.fromkeys',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
  ],
};