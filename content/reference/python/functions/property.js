// content/reference/python/functions/property.js

export const meta = {
  slug:        'property',
  name:        'property',
  signature:   'property(fget=None, fset=None, fdel=None, doc=None)',
  blurb:       'Turn a method into a computed attribute — with optional setter and deleter.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 2.2+',
  searchTerms: 'property decorator getter setter deleter computed attribute descriptor read-only encapsulation',
};

export const method = {
  slug:      'property',
  name:      'property',
  signature: 'property(fget=None, fset=None, fdel=None, doc=None)',
  returns:   { type: 'property', desc: 'A descriptor that, when accessed on an instance, calls the getter function. When assigned to, calls the setter. When deleted, calls the deleter. Attribute-style access on the outside; method logic on the inside.' },

  category:    'Built-in function / decorator',
  version:     'Python 2.2+',
  hasLiveDemo: false,

  subtitle: 'The controlled-attribute pattern — expose a method as if it were a plain attribute.',

  cheat: {
    commonCall: '@property\ndef name(self): return self._name',
    returns:    'a descriptor — accessed like an attribute, backed by a method',
    replaces:   'plain public attributes when you need validation, laziness, or a computed value',
    watchOut:   'setter and deleter use @name.setter / @name.deleter, NOT @property',
  },

  parameters: [
    { name: 'fget', type: 'callable', required: false, default: 'None', desc: 'The getter function. Called when the attribute is READ. Takes self, returns the value.' },
    { name: 'fset', type: 'callable', required: false, default: 'None', desc: 'The setter function. Called when the attribute is ASSIGNED. Takes self and value. Without one, the property is read-only.' },
    { name: 'fdel', type: 'callable', required: false, default: 'None', desc: 'The deleter function. Called when the attribute is DELETED. Takes self.' },
    { name: 'doc',  type: 'str',      required: false, default: 'None', desc: 'Docstring. If omitted, uses fget&apos;s docstring.' },
  ],

  demoParams: [
    { name: 'pattern', type: 'str', hint: 'pattern: read-only / computed / validated / full', input: 'text' },
  ],
  cases: [
    { id: 'read-only',  label: 'read-only',       values: { pattern: 'read-only' } },
    { id: 'computed',   label: 'computed value',   values: { pattern: 'computed' } },
    { id: 'validated',  label: 'validated setter', values: { pattern: 'validated' } },
    { id: 'full',       label: 'getter/setter/del', values: { pattern: 'full' } },
  ],
  demoExplainer: 'The demo shows common property patterns. READ-ONLY: @property alone — attribute access works, assignment raises AttributeError. COMPUTED: derived from other attributes on the fly. VALIDATED: setter enforces invariants. FULL: getter + setter + deleter for controlled read/write/delete lifecycle. The decorator syntax `@name.setter` and `@name.deleter` attach the extra functions to the same descriptor.',

  patterns: [
    {
      name: 'Read-only property',
      desc: 'Just @property — no setter means assignment raises.',
      code: 'class Circle:\n    def __init__(self, r):\n        self._r = r\n\n    @property\n    def area(self):\n        return 3.14159 * self._r ** 2',
    },
    {
      name: 'Validated setter',
      desc: 'Guard invariants at the attribute boundary.',
      code: 'class Age:\n    @property\n    def value(self):\n        return self._value\n\n    @value.setter\n    def value(self, v):\n        if v < 0:\n            raise ValueError("age must be non-negative")\n        self._value = v',
    },
    {
      name: 'Computed / lazy property',
      desc: 'Value derived from other attributes; often cached with functools.cached_property.',
      code: 'class Rect:\n    @property\n    def area(self):\n        return self.width * self.height',
    },
    {
      name: 'Full getter / setter / deleter',
      desc: 'All three phases of the attribute lifecycle.',
      code: 'class Temperature:\n    @property\n    def celsius(self):\n        return self._c\n    @celsius.setter\n    def celsius(self, v): self._c = v\n    @celsius.deleter\n    def celsius(self): del self._c',
    },
  ],

  examples: [
    { title: 'Read-only access', code: 'c = Circle(3)\nc.area',            returns: '28.274...' },
    { title: 'Read-only rejects assign', code: 'c.area = 42',                       returns: "AttributeError: can't set attribute" },
    { title: 'Validated setter',        code: 'a.value = -1',                        returns: 'ValueError: age must be non-negative' },
    { title: 'Delete via property',      code: 'del t.celsius',                       returns: 'runs deleter' },
    { title: 'Docstring from getter',    code: 'help(Circle.area)',                    returns: 'shows getter docstring' },
  ],

  pitfalls: [
    {
      name: 'Read-only by default — no setter means assignment fails',
      desc: 'A common gotcha for users adding @property to a plain attribute. Without an explicit setter, the attribute becomes read-only and assignment raises AttributeError.',
      wrong: { label: 'Assignment blocked', code: '@property\ndef x(self): return self._x\n# obj.x = 1', output: "AttributeError: can't set attribute" },
      fix:   { label: 'Add a setter',        code: '@x.setter\ndef x(self, v): self._x = v', output: 'assignment works' },
    },
    {
      name: 'Setter uses @name.setter, NOT @property',
      desc: 'A common typo. The setter must be decorated with @name.setter (where name is the property name), not @property.',
      wrong: { label: 'Second @property', code: '@property\ndef x(self, v): ...', output: 'confusing — replaces the getter' },
      fix:   { label: 'Use .setter',         code: '@x.setter\ndef x(self, v): ...', output: 'attaches the setter' },
    },
    {
      name: 'Property lives on the CLASS, not the instance',
      desc: 'Assigning `instance.__dict__["x"]` would shadow the property. Descriptors work at the class level; instance-dict tricks defeat them.',
      wrong: { label: 'Instance shadow',    code: 'obj.__dict__["x"] = 1\nobj.x', output: '1  # shadows the property' },
      fix:   { label: 'Do not touch __dict__',code: 'obj.x = 1   # goes through the setter', output: 'controlled' },
    },
    {
      name: 'Attribute lookups become method calls — cost is not zero',
      desc: 'Every read/write goes through Python. For hot loops, either cache the value (functools.cached_property) or expose the plain attribute.',
      wrong: { label: 'Expensive in loop', code: 'for _ in range(10**6):\n    x = obj.area   # runs the getter each time', output: 'slow' },
      fix:   { label: 'Cache',              code: 'from functools import cached_property\n@cached_property\ndef area(self): ...', output: 'computed once per instance' },
    },
  ],

  when: {
    use: [
      'Attribute access that needs validation on write',
      'Computed / derived values presented as attributes',
      'Read-only exposure of internal state',
      'Migrating a plain attribute to controlled access without breaking callers',
    ],
    avoid: [
      'Plain attributes → do not wrap for the sake of wrapping',
      'Very hot code paths → consider cached_property or a plain attribute',
      'Setters that do a lot of work → users expect assignment to be cheap',
      'When you need cls or no self → classmethod / staticmethod',
    ],
  },

  notes: {
    complexity: 'O(1) descriptor invocation plus the getter/setter body',
    return:     'A property descriptor attached to the class',
    cpython:    'Objects/descrobject.c :: property_descr_get/set/delete',
    memory:     'Small descriptor per property, per class',
    threadSafe: 'Depends on the getter/setter bodies',
  },

  related: [
    { name: 'classmethod',  slug: 'classmethod',  when: 'cls-first method decorator' },
    { name: 'staticmethod', slug: 'staticmethod', when: 'No cls, no self — function in a class' },
    { name: 'hasattr',      slug: 'hasattr',      when: 'Check whether a property is present' },
    { name: 'getattr',      slug: 'getattr',      when: 'Read the property by name' },
  ],

  faq: [
    {
      q: 'How do I make a property read-only?',
      a: 'Do not define a setter. Just @property with the getter — assignment will raise AttributeError.',
    },
    {
      q: 'What is functools.cached_property?',
      a: 'A property variant that computes the value ONCE per instance and stores it on the instance. Later reads skip the getter. Use when the value is expensive and immutable for the lifetime of the instance.',
    },
    {
      q: 'Can I inherit and override a property?',
      a: 'Yes — the subclass can redefine the property. To extend rather than replace, access the parent&apos;s property via super() or the descriptor protocol, though the latter can get intricate.',
    },
  ],

  history: [
    { version: '2.2', note: 'property introduced with new-style classes.' },
    { version: '2.6', note: 'setter, getter, deleter decorator forms added.' },
    { version: '3.8', note: 'functools.cached_property added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#property',
    meta:  'property',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect property output' },
  ],
};