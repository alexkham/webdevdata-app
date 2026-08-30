// content/reference/python/functions/dict.js

export const meta = {
  slug:        'dict',
  name:        'dict',
  signature:   'dict(**kwargs) | dict(mapping) | dict(iterable)',
  blurb:       'Build a key-value mapping from a mapping, pairs, or keyword arguments.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'dict constructor mapping hash map key value convert pairs kwargs copy dictionary',
};

export const method = {
  slug:      'dict',
  name:      'dict',
  signature: 'dict(**kwargs) | dict(mapping) | dict(iterable)',
  returns:   { type: 'dict', desc: 'A new dict. Built from a mapping, an iterable of key-value pairs, keyword arguments, or empty when given nothing.' },

  category:    'Built-in function / type',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Three constructors wearing one name. Which form you use decides what your keys are allowed to be.',

  cheat: {
    commonCall: 'dict(mapping)',
    returns:    'a new dict — a shallow copy when the source is a mapping',
    replaces:   'a manual loop assigning d[k] = v',
    watchOut:   'the keyword form only accepts valid identifiers as keys',
  },

  parameters: [
    { name: 'mapping',  type: 'mapping',  required: false, default: null, desc: 'An existing mapping to copy. The copy is shallow — the values are the same objects.' },
    { name: 'iterable', type: 'iterable', required: false, default: null, desc: 'An iterable of (key, value) pairs. Later pairs overwrite earlier ones with the same key.' },
    { name: 'kwargs',   type: 'Any',      required: false, default: null, desc: 'Keyword arguments become string keys. Only valid Python identifiers are expressible this way.' },
  ],

  demoParams: [
    { name: 'mapping', type: 'mapping', hint: 'key:value pairs, comma separated', input: 'kv' },
  ],
  cases: [
    { id: 'two',    label: 'two pairs',    values: { mapping: 'a:1,b:2' } },
    { id: 'three',  label: 'three pairs',  values: { mapping: 'x:one,y:two,z:three' } },
    { id: 'single', label: 'single pair',  values: { mapping: 'only:1' } },
    { id: 'empty',  label: 'empty',        values: { mapping: '' } },
  ],
  demoExplainer: 'The demo shows the mapping form: dict(m) builds a new dict holding the same pairs. Insertion order is preserved — guaranteed since 3.7 — so the result reads back in the order the pairs went in. The copy is shallow, meaning the new dict is independent but the values inside it are the very same objects as before.',

  patterns: [
    {
      name: 'Shallow-copy a dict',
      desc: 'A new mapping you can mutate without touching the original.',
      code: 'config = dict(defaults)',
    },
    {
      name: 'Build from pairs',
      desc: 'Anything yielding two-item pairs works, which makes zip a natural partner.',
      code: 'lookup = dict(zip(keys, values))',
    },
    {
      name: 'Merge with overrides',
      desc: 'Later sources win. On 3.9+ the | operator says the same thing more briefly.',
      code: 'merged = dict(defaults, **overrides)\nmerged = defaults | overrides   # 3.9+',
    },
  ],

  examples: [
    { title: 'From a mapping',   code: "dict({'a': 1, 'b': 2})",           returns: "{'a': 1, 'b': 2}" },
    { title: 'From pairs',       code: "dict([('a', 1), ('b', 2)])",       returns: "{'a': 1, 'b': 2}" },
    { title: 'From keywords',    code: 'dict(a=1, b=2)',                   returns: "{'a': 1, 'b': 2}" },
    { title: 'From zip',         code: "dict(zip('ab', [1, 2]))",          returns: "{'a': 1, 'b': 2}" },
    { title: 'Empty',            code: 'dict()',                           returns: '{}' },
    { title: 'Later pair wins',  code: "dict([('a', 1), ('a', 2)])",       returns: "{'a': 2}" },
  ],

  pitfalls: [
    {
      name: 'The keyword form only takes identifiers',
      desc: 'dict(a=1) is convenient right up to the point a key contains a space, a dash, or starts with a digit — then it is a syntax error rather than a runtime one.',
      wrong: { label: 'Not valid syntax', code: 'dict(my-key=1)', output: 'SyntaxError: expression cannot contain assignment' },
      fix:   { label: 'Use a literal',    code: "{'my-key': 1}", output: "{'my-key': 1}" },
    },
    {
      name: 'The copy is shallow',
      desc: 'dict(d) makes a new outer mapping whose values are the SAME objects. Mutating a nested list or dict shows through in both.',
      wrong: { label: 'Shared inner', code: "a = {'k': [1]}\nb = dict(a)\nb['k'].append(2)\na", output: "{'k': [1, 2]}" },
      fix:   { label: 'Deep copy',    code: 'import copy\nb = copy.deepcopy(a)', output: 'fully independent' },
    },
    {
      name: 'Duplicate keys silently collapse',
      desc: 'Building from pairs, the last value for a key wins and the earlier ones vanish without warning. Easy to miss when the pairs come from data rather than a literal.',
      wrong: { label: 'First lost', code: "dict([('a', 1), ('a', 2)])", output: "{'a': 2}" },
      fix:   { label: 'Group instead', code: 'from collections import defaultdict\nd = defaultdict(list)\nfor k, v in pairs:\n    d[k].append(v)', output: 'every value kept' },
    },
    {
      name: 'Keys must be hashable',
      desc: 'A list cannot be a key. This surfaces when keying by a composite value — convert it to a tuple first.',
      wrong: { label: 'List key', code: 'dict([([1, 2], "v")])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Tuple key', code: 'dict([((1, 2), "v")])', output: "{(1, 2): 'v'}" },
    },
  ],

  when: {
    use: [
      'Shallow-copying an existing mapping',
      'Building a lookup from parallel sequences via zip',
      'Turning an iterable of pairs into a mapping',
      'Merging defaults with overrides',
    ],
    avoid: [
      'A fixed set of literal pairs → the {} literal is faster and clearer',
      'Missing keys should get a default → collections.defaultdict',
      'You need nested independence → copy.deepcopy',
    ],
  },

  notes: {
    complexity: 'O(n) — every pair is inserted into the new hash table',
    return:     'Always a new dict; dict(d) copies rather than returning d',
    cpython:    'Objects/dictobject.c :: dict_init',
    memory:     'A hash table sized for the input, with headroom to stay sparse',
    threadSafe: 'The construction is safe; the resulting dict is not under concurrent mutation',
  },

  related: [
    { name: 'dict.fromkeys', slug: 'dict-fromkeys', when: 'Same key set, one shared default value' },
    { name: 'dict.update',   slug: 'dict-update',   when: 'Merge into an existing dict instead of building one' },
    { name: 'zip',           slug: 'zip',           when: 'Pair up keys and values before constructing' },
    { name: 'list',          slug: 'list',          when: 'A sequence rather than a mapping' },
  ],

  faq: [
    {
      q: 'Should I write dict() or {}?',
      a: '{} for a literal — it is faster, because it needs no global lookup and no function call. dict() earns its place when you are converting something, merging with keywords, or building from pairs.',
      code: 'empty = {}                    # preferred\nlookup = dict(zip(ks, vs))    # conversion',
    },
    {
      q: 'Is insertion order guaranteed?',
      a: 'Yes, since Python 3.7 it is a language guarantee — 3.6 had it as an implementation detail of CPython. Iteration, keys(), values(), items() and popitem() all follow insertion order.',
      code: "list(dict([('b', 1), ('a', 2)]))\n# ['b', 'a']",
    },
    {
      q: 'How do I merge two dicts?',
      a: 'On 3.9+ use the | operator, which reads best. Before that, dict(a, **b) works when b has identifier keys, and {**a, **b} works for any keys. In every version the right-hand side wins on conflicts.',
      code: 'merged = a | b        # 3.9+\nmerged = {**a, **b}   # any version',
    },
  ],

  history: [
    { version: '1.0', note: 'dict has been a core built-in type since the earliest Python.' },
    { version: '2.2', note: 'dict became a true type usable as a base class, rather than a factory function.' },
    { version: '3.7', note: 'Insertion order became a language guarantee.' },
    { version: '3.9', note: 'The | and |= merge operators added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict',
    meta:  'dict',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect mapping data structures' },
  ],
};
