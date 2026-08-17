// content/reference/python/functions/isinstance.js

export const meta = {
  slug:        'isinstance',
  name:        'isinstance',
  signature:   'isinstance(object, classinfo)',
  blurb:       'Check whether an object is an instance of a class — subclasses count.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.5+',
  searchTerms: 'isinstance instance type check class subclass duck typing typecheck reflection',
};

export const method = {
  slug:      'isinstance',
  name:      'isinstance',
  signature: 'isinstance(object, classinfo)',
  returns:   { type: 'bool', desc: 'True if object is an instance of classinfo — or of ANY subclass of classinfo. classinfo can be a single class or a tuple of classes; True if any match. Never raises for a normal class; raises TypeError if classinfo is not a class or tuple of classes.' },

  category:    'Built-in function',
  version:     'Python 1.5+',
  hasLiveDemo: false,

  subtitle: 'The subclass-aware type check — the tool you almost always want instead of `type(x) is C`.',

  cheat: {
    commonCall: 'isinstance(x, int)',
    returns:    'True or False',
    replaces:   '`type(x) is C` when subclasses should count',
    watchOut:   'bool is a subclass of int — isinstance(True, int) is True',
  },

  parameters: [
    { name: 'object',    type: 'Any',            required: true, default: null, desc: 'Any value. isinstance walks its type&apos;s MRO (method resolution order) looking for a match with classinfo.' },
    { name: 'classinfo', type: 'type | tuple[type]', required: true, default: null, desc: 'A class, or a tuple of classes. Tuple form is True if any element matches — equivalent to `isinstance(x, A) or isinstance(x, B)` but faster and cleaner.' },
  ],

  demoParams: [
    { name: 'x',   type: 'Any', hint: 'any value',         input: 'text' },
    { name: 'cls', type: 'str', hint: 'class: int/str/float/bool/list', input: 'text' },
  ],
  cases: [
    { id: 'str',        label: 'text as str',      values: { x: 'hello', cls: 'str' } },
    { id: 'int',        label: 'digits as int',    values: { x: '42',    cls: 'int' } },
    { id: 'mismatch',   label: 'wrong class',      values: { x: 'hello', cls: 'int' } },
    { id: 'float',      label: 'decimal as float', values: { x: '3.14',  cls: 'float' } },
    { id: 'bool',       label: 'boolean',          values: { x: 'True',  cls: 'bool' } },
    { id: 'bool-as-int',label: 'bool as int',      values: { x: 'True',  cls: 'int' } },
    { id: 'int-not-bool', label: 'int as bool',    values: { x: '42',    cls: 'bool' } },
  ],
  demoExplainer: 'The demo infers the type of the input from its text form (like eval would), then asks whether that type is an instance of the target class. The most instructive case: `isinstance(True, int)` returns True because bool is a subclass of int. `isinstance(42, bool)` returns False because int is NOT a subclass of bool — the relationship only goes one way.',

  patterns: [
    {
      name: 'Runtime type check',
      desc: 'Guard against wrong types with a friendly message.',
      code: 'if not isinstance(config, dict):\n    raise TypeError("config must be a dict")',
    },
    {
      name: 'Multi-type check with a tuple',
      desc: 'Accept several types in one call — cleaner than chained `or`.',
      code: 'if isinstance(x, (int, float)):\n    ...   # any numeric',
    },
    {
      name: 'Duck typing hint — prefer behavior over class',
      desc: 'Sometimes the right check is &quot;does it have this method?&quot;, not &quot;is it this class?&quot;.',
      code: 'if hasattr(x, "__iter__"):\n    for item in x:\n        ...',
    },
    {
      name: 'Structural check with ABC',
      desc: 'abc classes like Iterable, Mapping, Sequence work with isinstance.',
      code: 'from collections.abc import Mapping\nif isinstance(x, Mapping):\n    for k, v in x.items():\n        ...',
    },
  ],

  examples: [
    { title: 'Basic string',       code: 'isinstance("hi", str)',           returns: 'True' },
    { title: 'Basic int',          code: 'isinstance(42, int)',              returns: 'True' },
    { title: 'Wrong class',        code: 'isinstance("hi", int)',            returns: 'False' },
    { title: 'Tuple of classes',   code: 'isinstance(3.14, (int, float))',   returns: 'True' },
    { title: 'Bool is int',        code: 'isinstance(True, int)',            returns: 'True  # bool subclasses int' },
    { title: 'Int is NOT bool',    code: 'isinstance(42, bool)',             returns: 'False  # not the other way' },
    { title: 'None is NoneType',   code: 'isinstance(None, type(None))',     returns: 'True' },
    { title: 'Non-class raises',   code: 'isinstance(x, "int")',             returns: 'TypeError: isinstance() arg 2 must be a type' },
  ],

  pitfalls: [
    {
      name: 'bool is a subclass of int',
      desc: 'The single most surprising isinstance result. Historically booleans came from integers, so True and False satisfy isinstance(x, int). If you specifically want &quot;an int but not a bool&quot;, filter out bools explicitly.',
      wrong: { label: 'Accepts True',   code: 'isinstance(True, int)', output: 'True' },
      fix:   { label: 'Filter bool out', code: 'isinstance(x, int) and not isinstance(x, bool)', output: 'True only for real int' },
    },
    {
      name: 'The classinfo must be a type, not a name',
      desc: 'A common typo — passing the CLASS NAME as a string instead of the class itself.',
      wrong: { label: 'String argument', code: 'isinstance(x, "int")', output: 'TypeError: isinstance() arg 2 must be a type, a tuple of types, or a union' },
      fix:   { label: 'Class object',    code: 'isinstance(x, int)', output: 'True or False' },
    },
    {
      name: 'isinstance vs type() — different semantics',
      desc: 'type() is exact; isinstance() is subclass-aware. Use type() only when subclasses should NOT count — dispatch tables keyed by exact class are the rare valid use.',
      wrong: { label: 'Exact miss', code: 'class MyDict(dict): pass\nx = MyDict()\ntype(x) is dict', output: 'False  # exact class only' },
      fix:   { label: 'Subclass ok', code: 'isinstance(x, dict)', output: 'True' },
    },
    {
      name: 'Tuple form: parentheses matter',
      desc: 'For a multi-type check, wrap the classes in a tuple. Without the tuple, Python sees only the first argument.',
      wrong: { label: 'Missing tuple', code: 'isinstance(x, int, float)', output: 'TypeError: isinstance expected 2 arguments, got 3' },
      fix:   { label: 'Tuple wrap',    code: 'isinstance(x, (int, float))', output: 'True or False' },
    },
  ],

  when: {
    use: [
      'Runtime type validation with helpful error messages',
      'Multi-type acceptance via a tuple (numeric = int OR float)',
      'Duck-typing structural checks against collections.abc classes',
      'When subclass instances should count as the base class',
    ],
    avoid: [
      'Exact-class dispatch tables → type() is correct',
      'Detecting None → `x is None` (fastest and clearest)',
      'Deep behavior checks → hasattr / try-except may be more idiomatic',
      'Type checking beyond runtime → static type checkers with type hints',
    ],
  },

  notes: {
    complexity: 'O(mro depth) — walks the class hierarchy once',
    return:     'bool — True or False',
    cpython:    'Python/bltinmodule.c :: builtin_isinstance — calls PyObject_IsInstance',
    memory:     'No allocation',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'type',        slug: 'type',        when: 'Exact-class check — no subclasses' },
    { name: 'bool',        slug: 'bool',        when: 'Truthiness rather than class check' },
    { name: 'str',         slug: 'str',         when: 'Convert to text after checking type' },
  ],

  faq: [
    {
      q: 'What is the difference between isinstance() and type()?',
      a: 'isinstance is subclass-aware — True if the object is an instance of the class OR any subclass. type() checks EXACT class. Use isinstance for most runtime checks; use type() only for exact-class dispatch.',
    },
    {
      q: 'How do I check for &quot;int but not bool&quot;?',
      a: 'Chain isinstance with a not-bool check: `isinstance(x, int) and not isinstance(x, bool)`. Verbose but the standard idiom.',
    },
    {
      q: 'Can I use isinstance with collections.abc?',
      a: 'Yes — that is one of the best uses. `isinstance(x, Iterable)`, `isinstance(x, Mapping)`, `isinstance(x, Sequence)` all work and give you duck-typed checks against structural protocols.',
    },
    {
      q: 'What about type hints and mypy?',
      a: 'isinstance is runtime. Type hints (`x: int`) are checked by mypy or similar tools at build time. Different purposes — hints for review, isinstance for enforcement at runtime boundaries.',
    },
  ],

  history: [
    { version: '1.5', note: 'isinstance() introduced along with the type hierarchy overhaul.' },
    { version: '2.2', note: 'Support for tuple of classes as classinfo.' },
    { version: '3.10', note: '`isinstance(x, int | str)` supported via PEP 604 union type expressions.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#isinstance',
    meta:  'isinstance',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect data of unknown type' },
  ],
};