// content/reference/python/functions/super.js

export const meta = {
  slug:        'super',
  name:        'super',
  signature:   'super() / super(type, obj_or_type)',
  blurb:       'Return a proxy that dispatches method calls to a parent class — the cooperative-inheritance escape hatch.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 2.2+',
  searchTerms: 'super parent class inheritance mro method delegate cooperative diamond super() init',
};

export const method = {
  slug:      'super',
  name:      'super',
  signature: 'super() / super(type, obj_or_type)',
  returns:   { type: 'super', desc: 'A proxy object. Calling methods on it dispatches to the parent (next-in-MRO) class, bound to the current instance or class. `super()` inside a method (Python 3.0+) is equivalent to `super(__class__, self)` — the compiler fills in the arguments.' },

  category:    'Built-in function / type',
  version:     'Python 2.2+',
  hasLiveDemo: false,

  subtitle: 'Cooperative multiple inheritance — call the parent\'s method without hard-coding the class name.',

  cheat: {
    commonCall: 'super().__init__(...)',
    returns:    'a proxy — calls dispatch to the next class in the MRO',
    replaces:   '`ParentClass.method(self, ...)` — but does not hard-code the parent name',
    watchOut:   'the zero-arg form only works INSIDE a method; outside you need the two-arg form',
  },

  parameters: [
    { name: 'type',        type: 'type', required: false, default: '__class__', desc: 'The starting class for MRO lookup. In the zero-arg form (Python 3.0+), the compiler fills this in as the class the method is defined in.' },
    { name: 'obj_or_type', type: 'Any',  required: false, default: 'self',       desc: 'The instance (or class) whose MRO to walk. The zero-arg form uses the first positional argument of the enclosing method.' },
  ],

  demoParams: [
    { name: 'scenario', type: 'str', hint: 'scenario: init / single / diamond', input: 'text' },
  ],
  cases: [
    { id: 'init',    label: '__init__ call',       values: { scenario: 'init' } },
    { id: 'single',  label: 'single inheritance',  values: { scenario: 'single' } },
    { id: 'diamond', label: 'diamond MRO',         values: { scenario: 'diamond' } },
    { id: 'method',  label: 'method override',     values: { scenario: 'method' } },
  ],
  demoExplainer: 'super() is a proxy for the NEXT class in the MRO (method resolution order). The demo shows three common scenarios. INIT: subclass __init__ calls super().__init__() to run parent initialization. SINGLE: an override calls super().method() to extend the parent\'s behavior. DIAMOND: with multiple inheritance, super() follows the linearized MRO — critical for cooperative multiple inheritance.',

  patterns: [
    {
      name: 'Extend __init__ in a subclass',
      desc: 'The most common super() use — run the parent\'s initializer.',
      code: 'class Employee(Person):\n    def __init__(self, name, salary):\n        super().__init__(name)\n        self.salary = salary',
    },
    {
      name: 'Extend a method',
      desc: 'Call the parent method, then add subclass behavior.',
      code: 'class Loud(Talker):\n    def speak(self):\n        text = super().speak()\n        return text.upper()',
    },
    {
      name: 'Cooperative multiple inheritance',
      desc: 'Every class in the hierarchy calls super() — the MRO walks through each once.',
      code: 'class A:\n    def do(self): print("A"); \nclass B(A):\n    def do(self): print("B"); super().do()\nclass C(A):\n    def do(self): print("C"); super().do()\nclass D(B, C):\n    def do(self): print("D"); super().do()',
    },
    {
      name: 'Two-arg form outside a method',
      desc: 'When you need super() at module level or in a static context.',
      code: 'super(Employee, e).__init__(name)',
    },
  ],

  examples: [
    { title: 'Init',              code: 'class Sub(Base):\n    def __init__(self, x):\n        super().__init__()\n        self.x = x', returns: 'runs Base.__init__' },
    { title: 'Method extension',   code: 'class Loud(Talker):\n    def speak(self):\n        return super().speak().upper()', returns: 'upcase result' },
    { title: 'MRO walk',          code: 'D.__mro__',                       returns: '(D, B, C, A, object)' },
    { title: 'Zero-arg inside method', code: 'super().method()',           returns: 'next in MRO' },
    { title: 'Two-arg outside method', code: 'super(D, d).method()',        returns: 'explicit start class' },
  ],

  pitfalls: [
    {
      name: 'Zero-arg super() only works INSIDE a method',
      desc: 'The zero-arg form is compiler magic — it reads __class__ from the enclosing method definition. At module level or in a static function, it raises RuntimeError.',
      wrong: { label: 'Outside method fails', code: '# at module level\nsuper()', output: 'RuntimeError: super(): no arguments' },
      fix:   { label: 'Two-arg form',           code: 'super(SomeClass, instance)', output: 'works anywhere' },
    },
    {
      name: 'super() does NOT mean \"parent class\" — it means \"next in MRO\"',
      desc: 'A single-inheritance mental model breaks with multiple inheritance. With diamond inheritance, super() may dispatch to a SIBLING class, not the \"parent\" you had in mind.',
      wrong: { label: 'Assumed parent', code: '# in D(B, C):\n# super() in B goes to A, right?', output: 'no — goes to C, then A' },
      fix:   { label: 'Read the MRO',    code: 'D.__mro__', output: '(D, B, C, A, object)' },
    },
    {
      name: 'Must be a cooperative hierarchy — every class calls super()',
      desc: 'If one class in the chain forgets to call super(), the MRO walk stops there. This is subtle in multi-inheritance code; the common convention is \"every class calls super() for methods it might share\".',
      wrong: { label: 'One class breaks chain', code: 'class B(A):\n    def do(self):\n        print("B")   # no super() — stops here', output: 'A.do never runs' },
      fix:   { label: 'Always call super()',    code: 'class B(A):\n    def do(self):\n        print("B")\n        super().do()', output: 'A.do runs after B' },
    },
    {
      name: 'super() vs Parent.method(self) — subtly different',
      desc: 'The hard-coded form works only for single inheritance. As soon as multiple inheritance appears, super() respects the MRO but the hard-coded form does not — leading to skipped classes or double-run methods.',
      wrong: { label: 'Hard-coded skips MRO', code: 'class D(B, C):\n    def do(self):\n        B.do(self)   # C.do never runs', output: 'diamond broken' },
      fix:   { label: 'super() follows MRO',    code: 'class D(B, C):\n    def do(self):\n        super().do()', output: 'B and C both invoked' },
    },
  ],

  when: {
    use: [
      'Every __init__ in a subclass — the standard convention',
      'Extending any inherited method rather than replacing it',
      'Cooperative multiple inheritance and mixins',
      'When a subclass wants to add behavior around a parent method',
    ],
    avoid: [
      'Complete replacement of a parent method — do not call super()',
      'Naming ambiguity — if the parent method is unclear, refactor',
      'Deep hierarchies — often a sign that composition would be clearer',
      'When you truly want a specific class\'s method regardless of MRO — use ParentClass.method(self)',
    ],
  },

  notes: {
    complexity: 'O(1) proxy creation; O(mro depth) attribute lookup',
    return:     'A super proxy — bound to the current instance',
    cpython:    'Objects/typeobject.c :: super_new',
    memory:     'Small proxy object',
    threadSafe: 'Yes for immutable class hierarchies',
  },

  related: [
    { name: 'type',       slug: 'type',       when: 'Get the class of the instance' },
    { name: 'isinstance', slug: 'isinstance', when: 'Type-based check' },
    { name: 'hasattr',    slug: 'hasattr',    when: 'Check whether the parent has the attribute first' },
  ],

  faq: [
    {
      q: 'Do I need to call super() in __init__?',
      a: 'If the parent has meaningful __init__ behavior, yes — otherwise inherited attributes will not initialize. The one exception: if you inherit directly from object and have no other cooperative parents, super().__init__() with no args is a no-op but still recommended for consistency.',
    },
    {
      q: 'What is the difference between super() and super(Class, self)?',
      a: 'Nothing — they are equivalent. The compiler fills in `__class__` and the first argument for the zero-arg form. The explicit form works outside methods; the zero-arg form is more common inside methods.',
    },
    {
      q: 'How do I know which method super() will call?',
      a: 'Read the MRO — `SomeClass.__mro__` returns the tuple. super() dispatches to the next class after the current one in that tuple.',
    },
  ],

  history: [
    { version: '2.2', note: 'super() introduced with new-style classes.' },
    { version: '3.0', note: 'Zero-arg super() enabled by the compiler filling in __class__ and self.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#super',
    meta:  'super',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect MRO output' },
  ],
};