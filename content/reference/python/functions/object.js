// content/reference/python/functions/object.js

export const meta = {
  slug:        'object',
  name:        'object',
  signature:   'object()',
  blurb:       'The base class of every Python class — and a common sentinel value when called directly.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 2.2+',
  searchTerms: 'object base class root sentinel unique instance mro type hierarchy inheritance',
};

export const method = {
  slug:      'object',
  name:      'object',
  signature: 'object()',
  returns:   { type: 'object', desc: 'A featureless instance of the base class. Every class in Python 3 inherits from object (directly or indirectly). Calling object() is rare but useful as a UNIQUE sentinel — every instance is distinct.' },

  category:    'Built-in function / type',
  version:     'Python 2.2+',
  hasLiveDemo: false,

  subtitle: 'The root of the type hierarchy. Everything inherits from it; calling it gives a unique sentinel.',

  cheat: {
    commonCall: 'MISSING = object()',
    returns:    'a fresh, unique instance',
    replaces:   'None or a magic string as a sentinel',
    watchOut:   'object instances have almost no attributes; you cannot set attributes on them (no __dict__)',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'pattern', type: 'str', hint: 'pattern: sentinel / base / no-attrs', input: 'text' },
  ],
  cases: [
    { id: 'sentinel', label: 'sentinel value',    values: { pattern: 'sentinel' } },
    { id: 'base',     label: 'base class',        values: { pattern: 'base' } },
    { id: 'no-attrs', label: 'no attribute setting',values: { pattern: 'no-attrs' } },
    { id: 'identity', label: 'unique per call',     values: { pattern: 'identity' } },
  ],
  demoExplainer: 'object is the root of the class hierarchy — every Python 3 class inherits from it directly or via its bases. Instances of object() itself are RARE in real code — the common use is as a SENTINEL: a unique value that cannot collide with any other value (unlike None, which callers might pass explicitly). object instances have no writable __dict__ — you cannot attach attributes.',

  patterns: [
    {
      name: 'Sentinel to distinguish \"not provided\" from None',
      desc: 'When None is a valid argument value, you need a different sentinel to detect \"caller did not pass anything\".',
      code: '_MISSING = object()\n\ndef fetch(key, default=_MISSING):\n    if key in cache:\n        return cache[key]\n    if default is _MISSING:\n        raise KeyError(key)\n    return default',
    },
    {
      name: 'Base for a hierarchy — usually implicit',
      desc: 'In Python 3, `class C:` implicitly means `class C(object):`. Explicit inheritance is rare but harmless.',
      code: 'class Base(object):   # same as class Base:\n    ...',
    },
    {
      name: 'Distinguish objects by identity, not equality',
      desc: 'Every object() is unique — `is` never lies.',
      code: 'a = object()\nb = object()\na is b   # False',
    },
  ],

  examples: [
    { title: 'Fresh instance',      code: 'object()',                         returns: '<object object at 0x...>' },
    { title: 'Unique each time',    code: 'object() is object()',              returns: 'False' },
    { title: 'Every class inherits', code: 'issubclass(str, object)',           returns: 'True' },
    { title: 'MRO ends at object',   code: 'int.__mro__',                       returns: '(int, object)' },
    { title: 'No writable dict',      code: 'x = object()\nx.foo = 1',           returns: "AttributeError: 'object' object has no attribute 'foo'" },
    { title: 'Sentinel pattern',     code: '_M = object()\ndef f(x=_M): ...',    returns: '_M can never be confused with a caller value' },
  ],

  pitfalls: [
    {
      name: 'You cannot set attributes on an object() instance',
      desc: 'object instances have no __dict__. Attempting to attach an attribute raises AttributeError. For a lightweight class with attributes, use `class C: pass` (a bare user class DOES have __dict__).',
      wrong: { label: 'No __dict__', code: 'x = object()\nx.attr = 1', output: "AttributeError: 'object' object has no attribute 'attr'" },
      fix:   { label: 'Bare class',   code: 'class Bag: pass\nx = Bag()\nx.attr = 1', output: '1' },
    },
    {
      name: 'None as a sentinel is often ambiguous',
      desc: 'If your API accepts None as a real value (e.g. \"set to None to clear\"), you cannot use None to mean \"caller did not pass anything\". A unique object() gives you an unambiguous sentinel.',
      wrong: { label: 'Ambiguous None', code: 'def f(x=None):\n    if x is None: ...   # caller passed None or nothing?', output: 'ambiguous' },
      fix:   { label: 'Sentinel',        code: '_MISSING = object()\ndef f(x=_MISSING):\n    if x is _MISSING: ...', output: 'clear' },
    },
    {
      name: 'Explicit inheritance from object is redundant in Python 3',
      desc: '`class C(object):` and `class C:` are IDENTICAL in Python 3. The explicit form is a Python 2 vestige (where it distinguished new-style from old-style classes). Keep or drop it consistently; do not mix.',
      wrong: { label: 'Legacy noise', code: 'class MyClass(object):\n    ...   # Python 2 style', output: 'works, but noisy' },
      fix:   { label: 'Modern style', code: 'class MyClass:\n    ...', output: 'same, cleaner' },
    },
    {
      name: 'Not all Python objects are instances of object at the CLASS level',
      desc: 'This is a subtle detail: object is a class, but classes themselves are instances of type, and type is an instance of type. The class-vs-instance hierarchy loops in a way that is easy to get wrong. For everyday code, remember: `isinstance(anything, object)` is True.',
      wrong: { label: 'Overreach', code: 'isinstance(type, object)', output: 'True — but type IS object, not just an instance' },
      fix:   { label: 'Everyday truth', code: 'isinstance(x, object)   # True for anything', output: 'always True' },
    },
  ],

  when: {
    use: [
      'Sentinel values that must never collide (default marker in a function signature)',
      'Rare cases where you want a hashable, unique, comparable-by-identity value',
      'As the (usually implicit) base class of your own classes',
    ],
    avoid: [
      'You need attributes → use a bare `class C: pass` instead',
      'You need equality by value → use a dataclass or explicit class',
      'You want to see if it\'s an object → isinstance(x, object) is always True',
      'Explicit inheritance from object in Python 3 code — clean it up',
    ],
  },

  notes: {
    complexity: 'O(1) construction',
    return:     'A new object() instance — unique per call',
    cpython:    'Objects/object.c :: object_new',
    memory:     'Minimal — just the header',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'type',       slug: 'type',       when: 'Get the type of an object' },
    { name: 'isinstance', slug: 'isinstance', when: 'Type check' },
    { name: 'issubclass', slug: 'issubclass', when: 'Class hierarchy check' },
    { name: 'id',         slug: 'id',         when: 'Identity — every object() is unique' },
  ],

  faq: [
    {
      q: 'When would I actually call object() directly?',
      a: 'Almost exclusively for sentinel values — `_MISSING = object()` gives you a value guaranteed to be distinct from anything a caller could pass. Otherwise, object is used implicitly as the base of every class.',
    },
    {
      q: 'Why do I sometimes see `class C(object):`?',
      a: 'Python 2 vestige. In Python 2, `class C:` and `class C(object):` were DIFFERENT (old-style vs new-style). Python 3 unified them — the parentheses are optional now.',
    },
    {
      q: 'Can I subclass object?',
      a: 'Every class already does. You subclass object by writing `class C:`. Direct explicit subclassing (`class C(object):`) is legal but redundant.',
    },
  ],

  history: [
    { version: '2.2', note: 'object introduced as the root of the \"new-style\" class hierarchy.' },
    { version: '3.0', note: 'All classes implicitly inherit from object; the old-style class system was removed.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#object',
    meta:  'object',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
  ],
};