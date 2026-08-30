// content/reference/python/functions/frozenset.js

export const meta = {
  slug:        'frozenset',
  name:        'frozenset',
  signature:   'frozenset([iterable])',
  blurb:       'The immutable, hashable set — usable as a dict key or as an element of another set.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'frozenset immutable hashable set constant readonly dict key element unique',
};

export const method = {
  slug:      'frozenset',
  name:      'frozenset',
  signature: 'frozenset([iterable])',
  returns:   { type: 'frozenset', desc: 'An immutable set containing the unique elements of iterable. Supports all read operations of set (union, intersection, contains, len, iteration) but none of the mutations (add, discard, clear, update). Hashable, so it can be a dict key or a member of another set.' },

  category:    'Built-in function / type',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'The immutable sibling of set — same operations minus mutation, plus hashability.',

  cheat: {
    commonCall: 'CONSTANTS = frozenset({"a", "b", "c"})',
    returns:    'a frozenset object — read-only, hashable',
    replaces:   'a regular set when you need to use the set as a dict key, cache key, or set element',
    watchOut:   'no add/discard/clear — attempts raise AttributeError; frozenset.copy() may return self',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: false, default: '()', desc: 'Any iterable — the frozenset takes the unique elements. Empty or omitted → an empty frozenset.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items', input: 'csv-set' },
  ],
  cases: [
    { id: 'basic',   label: 'basic',           values: { items: 'a,b,c' } },
    { id: 'dupes',   label: 'duplicates',      values: { items: 'a,a,b,b,c' } },
    { id: 'numbers', label: 'numbers',         values: { items: '1,2,3,4' } },
    { id: 'single',  label: 'single',          values: { items: 'only' } },
    { id: 'empty',   label: 'empty',           values: { items: '' } },
    { id: 'mixed',   label: 'mixed order',     values: { items: 'z,a,m,z,a' } },
  ],
  demoExplainer: 'frozenset takes an iterable and stores its UNIQUE elements — duplicates collapse, exactly like set. The result is IMMUTABLE: no add, no discard, no clear. Because it is immutable, it is hashable — you can use a frozenset as a dict key or put it inside another set. That is the primary reason to prefer it over set. The display order is not meaningful (set element order is arbitrary).',

  patterns: [
    {
      name: 'Constants that should not change',
      desc: 'Module-level or class-level immutable configuration.',
      code: 'ALLOWED_METHODS = frozenset({"GET", "POST", "PUT"})',
    },
    {
      name: 'Dict key that is a set',
      desc: 'Regular sets are not hashable — frozenset is the fix.',
      code: 'cache = {}\ncache[frozenset({"user", "admin"})] = compute(...)',
    },
    {
      name: 'Set of sets',
      desc: 'You cannot put a set inside a set — use frozenset for the inner sets.',
      code: 'clusters = {frozenset({"a", "b"}), frozenset({"c", "d"})}',
    },
    {
      name: 'Set operations return a set of the SAME type',
      desc: 'Union / intersection of frozensets is a frozenset.',
      code: 'frozenset({1,2}) | frozenset({2,3})   # frozenset({1,2,3})',
    },
  ],

  examples: [
    { title: 'Basic',              code: 'frozenset([1, 2, 3])',                    returns: 'frozenset({1, 2, 3})' },
    { title: 'Duplicates collapse',code: 'frozenset("mississippi")',                 returns: 'frozenset({"m", "i", "s", "p"})' },
    { title: 'Empty',              code: 'frozenset()',                              returns: 'frozenset()' },
    { title: 'From dict keys',      code: 'frozenset({"a": 1, "b": 2})',              returns: 'frozenset({"a", "b"})' },
    { title: 'Cannot add',         code: 'frozenset([1]).add(2)',                    returns: "AttributeError: 'frozenset' object has no attribute 'add'" },
    { title: 'Hashable',           code: 'hash(frozenset([1, 2, 3]))',               returns: 'some integer  # works, unlike set' },
    { title: 'Set operations',     code: 'frozenset({1,2}) | frozenset({2,3})',      returns: 'frozenset({1, 2, 3})' },
  ],

  pitfalls: [
    {
      name: 'No mutation methods',
      desc: 'frozenset intentionally lacks add, discard, remove, pop, clear, update, and all the *_update variants. Any attempt raises AttributeError. If you need to add or remove, build a NEW frozenset with set operations.',
      wrong: { label: 'AttributeError', code: 'fs = frozenset([1, 2])\nfs.add(3)', output: "AttributeError: 'frozenset' object has no attribute 'add'" },
      fix:   { label: 'Build a new one',code: 'fs2 = fs | {3}', output: 'frozenset({1, 2, 3})' },
    },
    {
      name: 'frozenset.copy() may return SELF',
      desc: 'CPython optimizes: since frozensets are immutable, a copy is indistinguishable from the original for correctness. `fs.copy() is fs` is True. Behavior of the value is identical either way.',
      wrong: { label: 'Same object', code: 'fs = frozenset({1, 2})\nfs.copy() is fs', output: 'True  # optimization' },
      fix:   { label: 'Test equality', code: 'fs.copy() == fs', output: 'True' },
    },
    {
      name: 'Elements must still be hashable',
      desc: 'A frozenset itself is hashable — but the ELEMENTS still must be hashable (same rule as set). You cannot put a list or a dict inside a frozenset.',
      wrong: { label: 'List inside', code: 'frozenset([[1, 2], [3, 4]])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Tuple inside', code: 'frozenset([(1, 2), (3, 4)])', output: 'frozenset({(1, 2), (3, 4)})' },
    },
    {
      name: 'Empty frozenset displays as `frozenset()`, not `frozenset({})`',
      desc: '{} is a dict literal, not an empty set. Python knows this and shows an empty frozenset as `frozenset()`. Beginners sometimes expect the {} form.',
      wrong: { label: 'Expected {}',    code: 'frozenset()   # display', output: 'frozenset()  # not frozenset({})' },
      fix:   { label: 'That is normal', code: '# same reason set() displays as set(), not {}', output: '' },
    },
  ],

  when: {
    use: [
      'A set that must be a dict key or an element of another set',
      'Module-level constants that should not accidentally mutate',
      'Cache keys that involve set membership',
      'Data-model IDs that need value semantics but include an unordered subset',
    ],
    avoid: [
      'You will add or remove elements → use set',
      'Element order matters → sets (frozen or not) do not guarantee order',
      'Only reading, single-use → set is fine',
      'Small fixed-membership check → a tuple can be faster for small sizes',
    ],
  },

  notes: {
    complexity: 'O(n) to construct; same as set for lookup and set operations',
    return:     'A frozenset object — immutable',
    cpython:    'Objects/setobject.c :: frozenset_new — shares implementation with set',
    memory:     'Similar to set — a hash table with load factor',
    threadSafe: 'Yes — frozensets are immutable',
  },

  related: [
    { name: 'set',              slug: 'set-add',            when: 'Mutable version of the same abstraction (add page)' },
    { name: 'set.union',        slug: 'set-union',          when: 'Set operations that return a new set/frozenset' },
    { name: 'set.intersection', slug: 'set-intersection',   when: 'Element-wise overlap' },
    { name: 'set.copy',         slug: 'set-copy',           when: 'Shallow copy — for mutable sets' },
  ],

  faq: [
    {
      q: 'What is the difference between set and frozenset?',
      a: 'set is mutable — supports add, discard, clear, update. frozenset is immutable — no mutation methods. frozenset is hashable (usable as dict key or set element); set is not. Both share all read operations and set-algebra methods.',
    },
    {
      q: 'Why cannot I use a set as a dict key?',
      a: 'Because set is mutable. Python requires dict keys to be hashable — meaning their hash cannot change over their lifetime. A mutable object could change and break the dict\'s invariants. frozenset is the immutable, hashable alternative.',
    },
    {
      q: 'Do set operations on frozensets work?',
      a: 'Yes. union, intersection, difference, symmetric_difference all work — returning a frozenset. The comparison methods (issubset, issuperset, isdisjoint) also work. Only mutation methods are absent.',
    },
  ],

  history: [
    { version: '2.4', note: 'frozenset added along with set as a built-in type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset',
    meta:  'frozenset',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set data' },
  ],
};