// content/reference/python/functions/classmethod.js

export const meta = {
  slug:        'classmethod',
  name:        'classmethod',
  signature:   'classmethod(function)',
  blurb:       'Transform a method so its first argument is the CLASS (`cls`), not the instance.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 2.2+',
  searchTerms: 'classmethod decorator cls class method alternative constructor factory from_string bound',
};

export const method = {
  slug:      'classmethod',
  name:      'classmethod',
  signature: 'classmethod(function)',
  returns:   { type: 'classmethod', desc: 'A descriptor that, when accessed on the class or an instance, produces a bound method whose FIRST argument is the class (conventionally `cls`) rather than the instance. Used almost exclusively via the @classmethod decorator syntax.' },

  category:    'Built-in function / decorator',
  version:     'Python 2.2+',
  hasLiveDemo: false,

  subtitle: 'The \"alternative constructor\" decorator — bound to the CLASS, so subclasses get their own type when they call it.',

  cheat: {
    commonCall: '@classmethod\ndef from_str(cls, s): ...',
    returns:    'a bound method — first arg is cls, not self',
    replaces:   'a plain function that takes the class as an explicit argument',
    watchOut:   'subclasses inherit the classmethod — cls refers to the CALLING class, not the defining class',
  },

  parameters: [
    { name: 'function', type: 'callable', required: true, default: null, desc: 'The function to wrap. Its first parameter will receive the class when called. Used as @classmethod decorator syntax rather than a direct call.' },
  ],

  demoParams: [
    { name: 'pattern', type: 'str', hint: 'pattern: alt-constructor / subclass-aware / registry', input: 'text' },
  ],
  cases: [
    { id: 'alt-ctor',   label: 'alternative ctor',   values: { pattern: 'alt-constructor' } },
    { id: 'subclass',   label: 'subclass-aware',     values: { pattern: 'subclass-aware' } },
    { id: 'registry',   label: 'class-level registry',values: { pattern: 'registry' } },
    { id: 'vs-static',  label: 'vs. staticmethod',    values: { pattern: 'vs-static' } },
  ],
  demoExplainer: 'The demo shows common classmethod patterns. ALT-CONSTRUCTOR: from_string / from_dict factory methods that call cls(...) to build an instance. SUBCLASS-AWARE: because cls is the calling class, a subclass calling the inherited classmethod gets an instance of THE SUBCLASS. REGISTRY: class-level state accessed and modified via cls. VS-STATIC: shows the semantic difference — classmethod knows its class, staticmethod does not.',

  patterns: [
    {
      name: 'Alternative constructor',
      desc: 'The most common use — parse from a specific input format.',
      code: 'class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    @classmethod\n    def from_string(cls, s):\n        x, y = map(int, s.split(","))\n        return cls(x, y)',
    },
    {
      name: 'Subclass-aware factory',
      desc: 'cls is the CALLING class — subclasses get the right type.',
      code: 'class Base:\n    @classmethod\n    def make(cls):\n        return cls()\n\nclass Sub(Base): pass\n\ntype(Sub.make()) is Sub   # True',
    },
    {
      name: 'Access class-level state',
      desc: 'Read or modify class attributes without an instance.',
      code: 'class Counter:\n    total = 0\n    @classmethod\n    def bump(cls):\n        cls.total += 1',
    },
    {
      name: 'Prefer over static + explicit class name',
      desc: 'classmethod scales with subclassing; hard-coded class names do not.',
      code: '# WORSE: return SomeClass(...)\n# BETTER: return cls(...)',
    },
  ],

  examples: [
    { title: 'Basic factory',      code: 'Point.from_string("1,2")',                       returns: 'Point(1, 2)' },
    { title: 'Subclass gets subclass', code: 'class SubPoint(Point): pass\nSubPoint.from_string("3,4")', returns: 'SubPoint(3, 4)' },
    { title: 'Called via instance', code: 'p = Point(0, 0)\np.from_string("5,6")',          returns: 'Point(5, 6)  # cls still Point' },
    { title: 'Class-level counter', code: 'Counter.bump(); Counter.total',                   returns: '1' },
    { title: 'Access as bound method', code: 'type(Point.from_string)',                       returns: "<class 'method'>" },
  ],

  pitfalls: [
    {
      name: 'cls refers to the CALLING class, not the defining class',
      desc: 'A subclass inheriting a classmethod calls it with the SUBCLASS as cls. This is usually what you want (subclasses get the right type back), but it can surprise if you assumed cls was fixed.',
      wrong: { label: 'Assumed defining class', code: 'class SubPoint(Point): pass\nSubPoint.from_string("1,2")', output: 'SubPoint(1, 2)  # cls is SubPoint, not Point' },
      fix:   { label: 'By design — factories', code: 'return cls(x, y)   # honors the calling subclass', output: 'correct type per subclass' },
    },
    {
      name: 'Do NOT hard-code the class name inside a classmethod',
      desc: 'Writing the defining class name defeats the purpose. `Point(x, y)` inside `from_string` would ALWAYS return Point, breaking subclasses. Use `cls(x, y)`.',
      wrong: { label: 'Ignores subclass', code: 'return Point(x, y)   # inside classmethod', output: 'always Point, even for subclasses' },
      fix:   { label: 'Use cls',           code: 'return cls(x, y)', output: 'right class per subclass' },
    },
    {
      name: 'classmethod is a DESCRIPTOR — not usable outside a class',
      desc: 'A raw @classmethod-decorated function has to be attached to a class to work as intended. Standalone use gives you a classmethod object with limited API.',
      wrong: { label: 'Standalone useless', code: '@classmethod\ndef f(cls): ...\nf(SomeClass)', output: 'TypeError — not directly callable' },
      fix:   { label: 'Attach to a class',   code: 'class C:\n    @classmethod\n    def f(cls): ...\n\nC.f()', output: 'works' },
    },
    {
      name: 'Not the same as a class-level function',
      desc: '`def f(cls):` inside a class is just a regular method with a confusingly-named first arg — Python passes the INSTANCE, not the class. Without @classmethod, the decorator sugar is missing.',
      wrong: { label: 'Confusing name', code: 'class C:\n    def cls_method(cls): pass\nC().cls_method()', output: 'cls is the instance, not the class' },
      fix:   { label: 'Decorate it',    code: '    @classmethod\n    def cls_method(cls): ...', output: 'cls is C' },
    },
  ],

  when: {
    use: [
      'Alternative constructors — from_string, from_dict, from_json',
      'Factory methods that should honor subclassing',
      'Reading or modifying class-level state',
      'Registries and counters attached to a class',
    ],
    avoid: [
      'Instance methods → plain method with self',
      'Utility functions with no cls or class relevance → staticmethod (or module-level function)',
      'Getters / setters that transform an attribute → property',
      'Hard-coded class name inside — defeats the pattern',
    ],
  },

  notes: {
    complexity: 'O(1) descriptor invocation',
    return:     'A bound method whose first arg is the class',
    cpython:    'Objects/funcobject.c :: classmethod_descr_get',
    memory:     'Small descriptor object per class',
    threadSafe: 'Yes for the method itself; depends on what it does with cls',
  },

  related: [
    { name: 'staticmethod', slug: 'staticmethod', when: 'No cls, no self — just a function in a class' },
    { name: 'type',         slug: 'type',         when: 'Get the class of an instance' },
    { name: 'super',        slug: 'super',        when: 'Cooperative parent-method access' },
    { name: 'isinstance',   slug: 'isinstance',   when: 'Type-based branching' },
  ],

  faq: [
    {
      q: 'What is the difference between classmethod and staticmethod?',
      a: 'classmethod receives the calling class as its first argument (`cls`). staticmethod receives NOTHING implicit — it is just a regular function attached to a class. Use classmethod when you need the class (for alternative constructors, subclass-aware factories, class-level state). Use staticmethod for pure utility functions.',
    },
    {
      q: 'Should from_string be a classmethod or a staticmethod?',
      a: 'classmethod, almost always. If you want subclasses of Point to build SubPoint instances via `SubPoint.from_string(...)`, you need cls. A staticmethod hard-codes the class and cannot honor subclasses.',
    },
    {
      q: 'Can I call a classmethod on an instance?',
      a: 'Yes — `point.from_string(...)` works, but cls is still the CLASS of that instance, not the instance itself. Calling on the class (`Point.from_string(...)`) is more idiomatic.',
    },
  ],

  history: [
    { version: '2.2', note: 'classmethod introduced with new-style classes.' },
    { version: '3.9', note: 'classmethod wrapping other descriptors (like property) supported, then reverted in 3.11 due to bugs.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#classmethod',
    meta:  'classmethod',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect factory output' },
  ],
};