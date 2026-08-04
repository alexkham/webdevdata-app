// content/reference/python/functions/id.js

export const meta = {
  slug:        'id',
  name:        'id',
  signature:   'id(object)',
  blurb:       'Return a unique-per-lifetime integer identifier for the object.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'id identity memory address unique object is operator interned pointer',
};

export const method = {
  slug:      'id',
  name:      'id',
  signature: 'id(object)',
  returns:   { type: 'int', desc: 'An integer guaranteed to be unique and constant for the object during its lifetime. In CPython this is the memory address; other implementations may use different schemes. Two non-overlapping objects can share an id if the first was garbage-collected before the second was created.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The identity of an object as an integer. `x is y` is faster and safer than `id(x) == id(y)`.',

  cheat: {
    commonCall: 'id(x)',
    returns:    'an int — implementation-specific (memory address in CPython)',
    replaces:   'the `is` operator when you need an integer form of the identity',
    watchOut:   'small ints and interned strings share ids; ids are RECYCLED after garbage collection',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'Any object. id() returns an integer identifier that stays constant for the object&apos;s lifetime.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'any value', input: 'text' },
  ],
  cases: [
    { id: 'int',     label: 'integer',      values: { x: '42' } },
    { id: 'float',   label: 'float',        values: { x: '3.14' } },
    { id: 'string',  label: 'string',       values: { x: 'hello' } },
    { id: 'bool',    label: 'True',         values: { x: 'True' } },
    { id: 'none',    label: 'None',         values: { x: 'None' } },
    { id: 'empty',   label: 'empty',        values: { x: '' } },
  ],
  demoExplainer: 'The demo shows a stable illustrative id for each input. In REAL Python, id() returns the memory address in CPython — a large integer that varies per run and per process. The property that MATTERS: `id(x) == id(y)` if and only if `x is y`. That is what makes id useful. In practice you almost always use `is` directly instead of comparing ids.',

  patterns: [
    {
      name: 'Check for object identity',
      desc: 'Prefer `is` over id() comparisons — same meaning, cleaner code.',
      code: 'if x is y:\n    ...\n# NOT: if id(x) == id(y): ...',
    },
    {
      name: 'Detect aliasing during debugging',
      desc: 'When two names point to the same object, id() confirms it.',
      code: 'a = [1, 2]\nb = a\nprint(id(a), id(b))   # same',
    },
    {
      name: 'Sentinel object pattern',
      desc: 'A unique `object()` gives you a sentinel whose id is unique.',
      code: '_MISSING = object()\nif d.get(key, _MISSING) is _MISSING:\n    ...',
    },
  ],

  examples: [
    { title: 'Same object same id',   code: 'x = [1]\ny = x\nid(x) == id(y)',      returns: 'True' },
    { title: 'Different objects',     code: 'id([1]) == id([1])',                    returns: 'False  # two lists' },
    { title: 'Small int caching',     code: 'a = 5\nb = 5\nid(a) == id(b)',          returns: 'True   # CPython caches small ints' },
    { title: 'Large int not cached',  code: 'a = 10**10\nb = 10**10\nid(a) == id(b)', returns: 'False (or True depending on interpreter)' },
    { title: 'None is a singleton',    code: 'id(None) == id(None)',                  returns: 'True' },
    { title: 'Prefer `is`',           code: 'x is None   # canonical', returns: 'idiomatic' },
  ],

  pitfalls: [
    {
      name: 'IDs are RECYCLED after garbage collection',
      desc: 'When an object is destroyed, its id may be reused by a new object. `id(x) == id(y)` is unreliable across the lifetimes of the objects — only within.',
      wrong: { label: 'Recycled', code: 'a = "temp"\nold_id = id(a)\ndel a\nb = create_new()\nid(b) == old_id', output: 'may accidentally be True' },
      fix:   { label: 'Compare live', code: 'if a is b:   # only meaningful when both exist', output: 'safe' },
    },
    {
      name: 'Small ints and interned strings share ids',
      desc: 'CPython caches small integers (-5 to 256) and common strings. `id(a) == id(b)` for two small ints of the same value returns True — an optimization detail, not something to rely on.',
      wrong: { label: 'Implementation detail', code: 'a, b = 5, 5\nid(a) == id(b)', output: 'True  # CPython small-int cache' },
      fix:   { label: 'Use == for value equality', code: 'a == b', output: 'True — always for equal values' },
    },
    {
      name: 'Prefer `is` over id() comparisons',
      desc: 'Every use of `id(x) == id(y)` should be `x is y`. Same result, cleaner code, harder to accidentally compare with something that has a matching id-like integer.',
      wrong: { label: 'Verbose', code: 'if id(x) == id(y):', output: 'unclear intent' },
      fix:   { label: 'Idiomatic', code: 'if x is y:', output: 'clean' },
    },
    {
      name: 'The int returned is IMPLEMENTATION-SPECIFIC',
      desc: 'CPython returns the memory address. PyPy uses a different scheme. Do NOT persist ids across runs — they mean nothing outside the current process.',
      wrong: { label: 'Persisted', code: 'save_to_disk(id(x))', output: 'meaningless later' },
      fix:   { label: 'Use a real key',    code: 'save_to_disk(x.uuid or x.id)', output: 'stable across runs' },
    },
  ],

  when: {
    use: [
      'Sentinel object() pattern for &quot;distinct from all values&quot;',
      'Debugging aliasing (rare, but useful when it happens)',
      'Weak-reference bookkeeping in advanced code',
      'Rarely: as a hashable identity when the object cannot define __hash__',
    ],
    avoid: [
      'Identity check → `is` is cleaner',
      'Persisting an identifier → use a UUID or database ID',
      'Cross-process communication → id is meaningless outside the process',
      'Anything security-related — never rely on id for uniqueness against an attacker',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'An integer — the memory address in CPython',
    cpython:    'Python/bltinmodule.c :: builtin_id — returns PyLong_FromVoidPtr(obj)',
    memory:     'No allocation beyond the returned int',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'hash',      slug: 'hash',      when: 'Value-based hash, not identity' },
    { name: 'isinstance',slug: 'isinstance',when: 'Type check' },
    { name: 'type',      slug: 'type',      when: 'Class of the object' },
  ],

  faq: [
    {
      q: 'What is the difference between id() and hash()?',
      a: 'id gives object IDENTITY — two lists with the same elements have DIFFERENT ids. hash gives value HASH — two lists with the same elements would give the same hash if lists were hashable. Different questions, different answers.',
    },
    {
      q: 'Why does id(5) == id(5) sometimes give True?',
      a: 'Because CPython caches small integers (-5 to 256) — every `5` in your code refers to the same cached int object. This is an implementation detail. For value equality, use `==`.',
    },
    {
      q: 'Can I compare ids across processes or runs?',
      a: 'No. ids are process-specific and vary per run. Any persistence should use a real identifier (UUID, database primary key, hash of the value).',
    },
  ],

  history: [
    { version: '1.0', note: 'id() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Return type is int (was a long in Python 2 on 64-bit systems).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#id',
    meta:  'id',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect data' },
  ],
};