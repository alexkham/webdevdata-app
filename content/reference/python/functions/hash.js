// content/reference/python/functions/hash.js

export const meta = {
  slug:        'hash',
  name:        'hash',
  signature:   'hash(object)',
  blurb:       'Return the hash of a hashable value — the key mechanism behind dicts and sets.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'hash hashable dict set key hash randomization pythonhashseed unhashable typeerror int',
};

export const method = {
  slug:      'hash',
  name:      'hash',
  signature: 'hash(object)',
  returns:   { type: 'int', desc: 'An integer hash for the object. Equal objects must have equal hashes. Mutable containers (list, dict, set) are unhashable and raise TypeError. For strings and bytes, the value is randomized per Python process (PEP 456) — same value within one run, different across runs.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The engine of dict and set lookups. Equal values give equal hashes; unhashable types raise.',

  cheat: {
    commonCall: 'hash(x)',
    returns:    'an int — same for equal values within one process',
    replaces:   'the internal __hash__() call that dict / set make',
    watchOut:   'string hashes are RANDOMIZED per process; `hash(-1)` is special (returns -2, never -1)',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'A hashable value. Numbers, strings, tuples of hashables, frozensets — hashable. Lists, dicts, sets, and anything with mutable state — NOT hashable, raises TypeError.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'any value', input: 'text' },
  ],
  cases: [
    { id: 'small-int', label: 'small int',      values: { x: '5' } },
    { id: 'zero',      label: 'zero',           values: { x: '0' } },
    { id: 'neg-one',   label: 'the -1 case',    values: { x: '-1' } },
    { id: 'big-int',   label: 'big int',        values: { x: '123456789' } },
    { id: 'float',     label: 'float',          values: { x: '3.14' } },
    { id: 'string',    label: 'string',         values: { x: 'hello' } },
    { id: 'bool',      label: 'boolean',        values: { x: 'True' } },
    { id: 'none',      label: 'None',           values: { x: 'None' } },
  ],
  demoExplainer: 'hash() returns an integer hash. For SMALL INTEGERS, hash(n) == n — except hash(-1) which returns -2 (Python reserves -1 as an error sentinel internally). For floats, hash matches int for whole-number values. For BOOLEANS, hash(True) == 1 and hash(False) == 0. For STRINGS, Python randomizes the hash per process (PEP 456, hash randomization for security) — the values shown here are illustrative and will NOT match your Python REPL exactly. The property that MATTERS: equal values always hash equally within one process.',

  patterns: [
    {
      name: 'Use a value as a dict key',
      desc: 'You almost never call hash directly — you use hashable values as dict keys or set elements.',
      code: 'lookup = {(x, y): compute(x, y) for x, y in coords}',
    },
    {
      name: 'Test whether a value is hashable',
      desc: 'try/except is the idiomatic check.',
      code: 'def is_hashable(v):\n    try:\n        hash(v)\n        return True\n    except TypeError:\n        return False',
    },
    {
      name: 'Custom __hash__ on your class',
      desc: 'Objects are hashable if they define __hash__ and __eq__ consistently.',
      code: 'class Point:\n    def __hash__(self):\n        return hash((self.x, self.y))\n    def __eq__(self, other):\n        return (self.x, self.y) == (other.x, other.y)',
    },
  ],

  examples: [
    { title: 'Small int',         code: 'hash(5)',            returns: '5' },
    { title: 'Zero',              code: 'hash(0)',            returns: '0' },
    { title: 'The -1 special',    code: 'hash(-1)',           returns: '-2  # -1 is reserved as error sentinel' },
    { title: 'Float whole',       code: 'hash(3.0)',           returns: '3' },
    { title: 'Bool matches int',   code: 'hash(True), hash(False)', returns: '(1, 0)' },
    { title: 'Tuple of hashables', code: 'hash((1, 2, 3))',    returns: 'some int' },
    { title: 'String randomized',  code: 'hash("hello")',      returns: 'different per process' },
    { title: 'List raises',        code: 'hash([1, 2, 3])',    returns: "TypeError: unhashable type: 'list'" },
  ],

  pitfalls: [
    {
      name: 'Lists, dicts, and sets are UNHASHABLE',
      desc: 'Mutable containers cannot be dict keys or set elements. Their hash would change if you mutated them, breaking the container&apos;s invariants. Convert to tuple / frozenset / immutable form first.',
      wrong: { label: 'List rejected', code: 'hash([1, 2])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Convert to tuple', code: 'hash((1, 2))', output: 'valid hash' },
    },
    {
      name: 'String hashes are RANDOMIZED per process',
      desc: 'Since Python 3.3 (PEP 456), the hash of strings and bytes is randomized at interpreter startup to defend against algorithmic complexity attacks. Two runs of `hash("hello")` give DIFFERENT results. Do not rely on cross-process consistency; use hashlib for that.',
      wrong: { label: 'Assumed stable', code: 'hash("hello")   # cache to disk?', output: 'different each run' },
      fix:   { label: 'Use hashlib',    code: 'import hashlib\nhashlib.sha256(b"hello").hexdigest()', output: 'deterministic hex string' },
    },
    {
      name: 'hash(-1) returns -2',
      desc: 'CPython internally reserves -1 as an &quot;error&quot; sentinel for hash. If a value would naturally hash to -1, Python returns -2 instead. `hash(-1)` and `hash(-2)` both return -2.',
      wrong: { label: 'Assumed identity', code: 'hash(-1)', output: '-2' },
      fix:   { label: 'Read the docs — a small implementation detail', code: '', output: '' },
    },
    {
      name: 'Custom __hash__ must agree with __eq__',
      desc: 'The contract: if a == b, then hash(a) == hash(b). Defining __eq__ without __hash__ makes the class unhashable. Defining a __hash__ that violates the contract silently breaks dict / set correctness.',
      wrong: { label: 'Missing __hash__', code: 'class C:\n    def __eq__(self, o): return True\nhash(C())', output: "TypeError: unhashable type: 'C'" },
      fix:   { label: 'Define both',      code: 'class C:\n    def __eq__(self, o): return True\n    def __hash__(self): return 0', output: 'valid, though bad hash' },
    },
    {
      name: 'hash IS NOT a cryptographic hash',
      desc: 'hash() is designed for dict / set lookups — fast and evenly distributed, not collision-resistant. Do not use it for security purposes. Use hashlib (sha256, blake2, ...) for cryptographic needs.',
      wrong: { label: 'Weak for security',   code: 'password_hash = hash(password)', output: 'insecure' },
      fix:   { label: 'Use hashlib',           code: 'import hashlib\nhashlib.sha256(pw.encode()).hexdigest()', output: 'cryptographic hash' },
    },
  ],

  when: {
    use: [
      'Almost never directly — hashing happens implicitly in dict / set',
      'Custom __hash__ on your own classes',
      'Testing whether an unknown value is hashable (with try/except)',
      'Occasional cache keys where the input is guaranteed hashable',
    ],
    avoid: [
      'Cross-process consistency → hashlib is the right tool',
      'Security or password storage → hashlib.pbkdf2 / bcrypt / argon2',
      'Deterministic bucket assignment → hashlib with a fixed algorithm',
      'You want the raw value → id() gives object identity instead',
    ],
  },

  notes: {
    complexity: 'O(1) for numbers; O(n) for strings, tuples, frozensets — one linear scan',
    return:     'An integer — same for equal values within one process',
    cpython:    'Objects/object.c :: PyObject_Hash — calls tp_hash',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable inputs',
  },

  related: [
    { name: 'id',          slug: 'id',          when: 'Object identity, not value equality' },
    { name: 'isinstance',  slug: 'isinstance',  when: 'Type check rather than hash check' },
    { name: 'frozenset',   slug: 'frozenset',   when: 'Make a hashable set for use as a dict key' },
  ],

  faq: [
    {
      q: 'Why are lists not hashable?',
      a: 'Because lists are mutable. If a list were a dict key, mutating it would invalidate the dict&apos;s lookup structure. Immutable containers (tuple, frozenset) are hashable and can serve as keys.',
    },
    {
      q: 'Is hash() secure enough for passwords?',
      a: 'No. hash() is designed for fast dict / set operations — it is NOT collision-resistant against a determined attacker. Use hashlib (or better, a password-hashing library like bcrypt or argon2) for security.',
    },
    {
      q: 'Why does hash("hello") give different values each run?',
      a: 'Since Python 3.3, string hashes are randomized at startup to defend against algorithmic complexity attacks (an attacker could craft input that all hash to the same bucket, degrading dict lookups from O(1) to O(n)). Set the PYTHONHASHSEED env var to 0 to disable randomization if you need reproducibility.',
    },
  ],

  history: [
    { version: '1.0', note: 'hash() has been a builtin since Python 1.0.' },
    { version: '3.3', note: 'PEP 456 — hash randomization enabled by default for strings and bytes.' },
    { version: '3.4', note: 'PYTHONHASHSEED env var honored for reproducibility.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#hash',
    meta:  'hash',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect data' },
  ],
};