// content/reference/python/functions/type.js

export const meta = {
  slug:        'type',
  name:        'type',
  signature:   'type(object) / type(name, bases, dict)',
  blurb:       'Get an object&apos;s type, or create a new class dynamically.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'type class introspection instance check reflection metaclass isinstance object',
};

export const method = {
  slug:      'type',
  name:      'type',
  signature: 'type(object) / type(name, bases, dict)',
  returns:   { type: 'type', desc: 'One-arg form: the object&apos;s type (its class). Three-arg form: a NEW class with the given name, bases, and attribute dict — this is the metaclass used to build classes.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Two very different jobs behind one name — reflection with one argument, class creation with three.',

  cheat: {
    commonCall: 'type(x) is int',
    returns:    'a type object (class)',
    replaces:   'the older x.__class__ attribute access — same result',
    watchOut:   '`type(x) == C` checks EXACT class; use isinstance() to include subclasses',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'Any value. type() returns its class — the same object as x.__class__. Never raises AttributeError; every value has a type.' },
    { name: 'name',   type: 'str', required: false, default: null, desc: '(3-arg form) The name of the new class as a string.' },
    { name: 'bases',  type: 'tuple[type]', required: false, default: null, desc: '(3-arg form) Tuple of base classes.' },
    { name: 'dict',   type: 'dict', required: false, default: null, desc: '(3-arg form) Attribute dict for the new class.' },
  ],

  demoParams: [
    { name: 'x', type: 'Any', hint: 'any value', input: 'text' },
  ],
  cases: [
    { id: 'text',      label: 'text',        values: { x: 'hello' } },
    { id: 'integer',   label: 'integer',     values: { x: '42' } },
    { id: 'float',     label: 'float',       values: { x: '3.14' } },
    { id: 'boolean',   label: 'boolean',     values: { x: 'True' } },
    { id: 'null',      label: 'None',        values: { x: 'None' } },
    { id: 'empty',     label: 'empty',       values: { x: '' } },
    { id: 'unicode',   label: 'unicode',     values: { x: 'café' } },
  ],
  demoExplainer: 'The demo passes text through and shows the type Python would infer if you fed the same input to eval() or a coerce step. The interesting builtin types you will see: str, int, float, bool, NoneType. type() itself is a class — its type is also &quot;type&quot; (it is its own metaclass, a small twist to Python&apos;s object model).',

  patterns: [
    {
      name: 'Debug: what type is this?',
      desc: 'A common diagnostic when something behaves unexpectedly.',
      code: 'print(f"got type={type(value).__name__}")',
    },
    {
      name: 'Exact class check',
      desc: 'Use `is` for identity — type() returns the class itself.',
      code: 'if type(item) is dict:\n    process_dict(item)',
    },
    {
      name: 'Prefer isinstance for subclass-aware checks',
      desc: 'type() is exact; isinstance() covers subclasses.',
      code: '# type(x) is int is False for a subclass of int\n# isinstance(x, int) is True for both',
    },
    {
      name: 'Dynamic class creation (advanced)',
      desc: 'The three-arg form builds a class at runtime.',
      code: 'Point = type("Point", (), {"x": 0, "y": 0})',
    },
  ],

  examples: [
    { title: 'Text',              code: 'type("hello")',       returns: '<class \'str\'>' },
    { title: 'Integer',           code: 'type(42)',            returns: '<class \'int\'>' },
    { title: 'Float',             code: 'type(3.14)',          returns: '<class \'float\'>' },
    { title: 'Boolean',           code: 'type(True)',          returns: '<class \'bool\'>' },
    { title: 'None',              code: 'type(None)',          returns: '<class \'NoneType\'>' },
    { title: 'List',              code: 'type([1, 2, 3])',     returns: '<class \'list\'>' },
    { title: 'Compare with is',   code: 'type(x) is str',      returns: 'True or False' },
    { title: 'Just the name',     code: 'type(x).__name__',    returns: '"str"  # a string' },
  ],

  pitfalls: [
    {
      name: 'type() checks EXACT class — misses subclasses',
      desc: 'The single most common type() mistake. `type(x) is int` is False for a bool (even though bool is a subclass of int). Use isinstance() when subclasses should count.',
      wrong: { label: 'Bool missed', code: 'type(True) is int', output: 'False  # bool is a subclass, not int itself' },
      fix:   { label: 'isinstance',  code: 'isinstance(True, int)', output: 'True' },
    },
    {
      name: 'Compare with `is`, not `==`',
      desc: 'For typechecks, `is` and `==` usually give the same result, but `is` is the correct comparison for singleton objects like class instances. Consistency wins here.',
      wrong: { label: 'Style noise', code: 'type(x) == int', output: 'works but non-idiomatic' },
      fix:   { label: 'Identity',    code: 'type(x) is int', output: 'idiomatic' },
    },
    {
      name: 'type(None) is NoneType, not None',
      desc: 'None is a value; NoneType is its class. If you want to detect None, use `x is None` — the fastest and most idiomatic check.',
      wrong: { label: 'Comparing to None', code: 'if type(x) is None:', output: 'always False — NoneType is a class' },
      fix:   { label: 'Direct check',       code: 'if x is None:', output: 'idiomatic' },
    },
    {
      name: 'The three-arg form is for advanced use only',
      desc: 'Dynamic class creation is powerful but rarely necessary. If you find yourself reaching for `type("MyClass", ...)`, first consider a plain `class MyClass:` block, a dataclass, or namedtuple.',
      wrong: { label: 'Over-engineered', code: 'Point = type("Point", (), {"x": 0, "y": 0})', output: 'works, but obscure' },
      fix:   { label: 'Plain class',      code: 'class Point:\n    x = 0\n    y = 0', output: 'clearer' },
    },
  ],

  when: {
    use: [
      'Debugging / diagnostic output — &quot;what type is this?&quot;',
      'Exact-class checks where subclasses should NOT count',
      'Reading `x.__class__` more idiomatically',
      'Dispatch tables keyed by exact class',
    ],
    avoid: [
      'Subclass-aware checks → isinstance is correct',
      'Detecting None → `x is None`',
      'Comparing with `==` — use `is` for identity',
      'Dynamic class creation without a strong reason — use a class block',
    ],
  },

  notes: {
    complexity: 'O(1) — direct attribute lookup on the object',
    return:     'A type object (class)',
    cpython:    'Objects/typeobject.c :: type_new (constructor) and PyObject_Type (single-arg)',
    memory:     'No allocation for single-arg; three-arg allocates a class',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'str',    slug: 'str',    when: 'Human-facing display via type name' },
    { name: 'repr',   slug: 'repr',   when: 'Debug-friendly representation of a value' },
    { name: 'len',    slug: 'len',    when: 'Size of the value once its type is known' },
    { name: 'bool',   slug: 'bool',   when: 'Truthiness check across types' },
  ],

  faq: [
    {
      q: 'What is the difference between type() and isinstance()?',
      a: 'type(x) is C is True only when x is an INSTANCE of C — not a subclass. isinstance(x, C) is True for both. Use isinstance when subclasses should count (usually); use type() for exact-class dispatch.',
    },
    {
      q: 'Why is bool a subclass of int?',
      a: 'Historical: booleans were added to Python late, and to avoid breaking arithmetic on `True + True == 2`, bool inherits from int. It is a quirk, but a stable one — treat True as 1 and False as 0 in numeric contexts.',
    },
    {
      q: 'What is type(type)?',
      a: '`type(type) is type` returns True. type is its own metaclass — the concept sits at the top of Python&apos;s class hierarchy. It is a deep detail that only metaclass authors need to think about.',
    },
  ],

  history: [
    { version: '1.0', note: 'type() has been a builtin since Python 1.0 — original name for the metaclass at the root.' },
    { version: '3.0', note: 'Classic classes removed; every class now derives from object with type as the metaclass.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#type',
    meta:  'type',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect data of unknown type' },
  ],
};