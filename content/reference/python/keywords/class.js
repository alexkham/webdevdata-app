// content/reference/python/keywords/class.js

export const meta = {
  slug:        'class',
  name:        'class',
  signature:   'class Name(Base):',
  blurb:       'Define your own type: a namespace of attributes and methods that you call to create instances.',
  category:    'definitions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'class keyword define class object oop __init__ self constructor instance attribute class attribute inheritance subclass super method dataclass mro',
};

export const method = {
  slug:      'class',
  name:      'class',
  signature: 'class Name(Base):',

  category:    'Definitions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'class builds a new type. Attributes set on self belong to one instance; attributes written in the class body are shared by all of them.',

  covers: ['class'],

  syntax: [
    { label: 'class', code: 'class Name:\n    attr = value\n    def method(self):\n        ...' },
    { label: 'with __init__', code: 'class Name:\n    def __init__(self, x):\n        self.x = x' },
    { label: 'inheritance', code: 'class Child(Parent):\n    def __init__(self, x):\n        super().__init__(x)' },
    { label: 'dataclass', code: '@dataclass\nclass Point:\n    x: int\n    y: int = 0' },
  ],

  cheat: {
    useFor:    'bundling data with the functions that work on it; your own types',
    result:    'binds Name to a new class object; calling Name(...) makes instances',
    pairsWith: '__init__, self, super(), @dataclass, @property, isinstance()',
    watchOut:  'a mutable class attribute (items = []) is shared by every instance',
  },

  parameters: [
    { name: 'Name',   type: 'name',            required: true,  default: null, desc: 'The name the new class is bound to. By convention CapWords.' },
    { name: 'Base',   type: 'expression list', required: false, default: null, desc: 'Classes to inherit from, comma-separated. Omitted means object. Keyword arguments such as metaclass=... also go here.' },
    { name: 'body',   type: 'block',           required: true,  default: null, desc: 'Runs once, when the class statement executes. Names it assigns (attributes, def methods) become the class namespace.' },
    { name: 'self',   type: 'parameter',       required: true,  default: null, desc: 'First parameter of every normal method: the instance the method was called on. The name self is a convention, not a keyword.' },
  ],

  modes: [
    {
      id: 'class',
      label: 'class vs instance',
      blurb: 'Add items to cart a only. The list created in __init__ belongs to a; the list in the class body is shared with b.',
      params: [{ name: 'items', type: 'list', hint: 'comma-separated', input: 'csv' }],
      template: 'class Cart:\n    shared = []\n\n    def __init__(self):\n        self.own = []\n\n    def add(self, item):\n        self.shared.append(item)\n        self.own.append(item)\n\na, b = Cart(), Cart()\nfor item in {$items}:\n    a.add(item)\n(a.own, b.own, b.shared)',
      cases: [
        { id: 'two',   label: 'two items', values: { items: 'apple, pear' } },
        { id: 'one',   label: 'one item',  values: { items: 'milk' } },
        { id: 'empty', label: 'nothing',   values: { items: '' } },
      ],
    },
    {
      id: 'lookup',
      label: 'attribute lookup',
      blurb: 'Type an attribute name. The search goes instance, class, base class, object — the first namespace that has it wins.',
      params: [{ name: 'attr', type: 'str', hint: 'attribute name', input: 'text' }],
      template: "class Animal:\n    legs = 4\n    sound = '...'\n\nclass Dog(Animal):\n    sound = 'woof'\n\nrex = Dog()\nrex.name = 'Rex'\n\nattr = {$attr}\ntrace = []\nfor label, ns in [('rex', vars(rex)), ('Dog', vars(Dog)),\n                  ('Animal', vars(Animal)), ('object', vars(object))]:\n    if attr in ns:\n        trace.append(f'{label}: found')\n        break\n    trace.append(f'{label}: no')\nelse:\n    trace.append('AttributeError')\ntrace",
      cases: [
        { id: 'name',    label: 'name',     values: { attr: 'name' } },
        { id: 'sound',   label: 'sound',    values: { attr: 'sound' } },
        { id: 'legs',    label: 'legs',     values: { attr: 'legs' } },
        { id: 'init',    label: '__init__', values: { attr: '__init__' } },
        { id: 'missing', label: 'tail',     values: { attr: 'tail' } },
      ],
    },
    {
      id: 'super',
      label: 'super()',
      blurb: 'Dog.__init__ hands name to Animal.__init__ through super(), then adds its own attribute.',
      params: [{ name: 'name', type: 'str', hint: 'any text', input: 'text' }],
      template: "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, trick):\n        super().__init__(name)\n        self.trick = trick\n\nvars(Dog({$name}, 'sit'))",
      cases: [
        { id: 'rex',   label: 'Rex',          values: { name: 'Rex' } },
        { id: 'empty', label: 'empty string', values: { name: '' } },
      ],
    },
  ],
  demoExplainer: 'In the class vs instance tab, b never called add(), yet b.shared holds every item: shared lives on the class, so a.shared and b.shared are the same list. In the attribute lookup tab, sound is found on Dog before Animal is even checked (overriding), legs falls through to Animal, and __init__ comes all the way from object. The trace is a simplified model of what rex.attr does: real lookup also gives data descriptors such as properties on the class priority over the instance dict.',

  patterns: [
    {
      name: 'Alternative constructor',
      desc: 'A classmethod receives the class, so subclasses get instances of themselves.',
      code: "class Temp:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @classmethod\n    def from_fahrenheit(cls, f):\n        return cls((f - 32) * 5 / 9)",
    },
    {
      name: 'Computed attribute',
      desc: '@property makes a method read like an attribute.',
      code: 'class Rect:\n    def __init__(self, w, h):\n        self.w, self.h = w, h\n\n    @property\n    def area(self):\n        return self.w * self.h',
    },
    {
      name: 'Dataclass with a mutable default',
      desc: 'field(default_factory=list) gives each instance its own list.',
      code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Order:\n    id: int\n    items: list = field(default_factory=list)',
    },
    {
      name: 'Readable repr',
      desc: 'Define __repr__ so instances print as something useful instead of <... object at 0x...>.',
      code: "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n\n    def __repr__(self):\n        return f'Money({self.cents!r})'",
    },
  ],

  examples: [
    { title: '__init__ and a method',        code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f'{self.name} says woof'\n\nDog('Rex').speak()", returns: "'Rex says woof'" },
    { title: 'A class attribute is shared',  code: 'class Counter:\n    created = 0\n\n    def __init__(self):\n        Counter.created += 1\n\nCounter()\nCounter()\nCounter.created', returns: '2' },
    { title: 'Inheritance with super()',     code: "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Cat(Animal):\n    def __init__(self, name, indoor):\n        super().__init__(name)\n        self.indoor = indoor\n\nvars(Cat('Tom', True))", returns: "{'name': 'Tom', 'indoor': True}" },
    { title: 'Method resolution order',      code: 'class A: pass\nclass B(A): pass\nclass C(B): pass\n[k.__name__ for k in C.__mro__]', returns: "['C', 'B', 'A', 'object']" },
    { title: 'A custom __repr__',            code: "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n\n    def __repr__(self):\n        return f'Money({self.cents})'\n\n[Money(5), Money(250)]", returns: '[Money(5), Money(250)]' },
    { title: 'dataclass writes __init__, __repr__, __eq__', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int = 0\n\n(Point(3), Point(1, 2) == Point(1, 2))', returns: '(Point(x=3, y=0), True)' },
    { title: 'A class is an object too',     code: 'class Empty:\n    pass\n\n(type(Empty), Empty.__name__, isinstance(Empty(), Empty))', returns: "(<class 'type'>, 'Empty', True)" },
  ],

  pitfalls: [
    {
      name: 'A mutable class attribute shared by every instance',
      desc: 'members = [] in the class body creates ONE list stored on the class. Every instance that appends to self.members appends to that same list.',
      wrong: { label: 'list in the class body', code: "class Team:\n    members = []\n\n    def join(self, name):\n        self.members.append(name)\n\na, b = Team(), Team()\na.join('Ann')\nb.members", output: "['Ann']" },
      fix:   { label: 'create it in __init__',  code: "class Team:\n    def __init__(self):\n        self.members = []\n\n    def join(self, name):\n        self.members.append(name)\n\na, b = Team(), Team()\na.join('Ann')\nb.members", output: '[]' },
    },
    {
      name: 'Forgetting self',
      desc: 'The instance is passed as the first argument automatically. A method defined without a parameter for it fails when called on an instance.',
      wrong: { label: 'no self parameter', code: "class Greeter:\n    def hello():\n        return 'hi'\n\nGreeter().hello()", output: 'TypeError: Greeter.hello() takes 0 positional arguments but 1 was given' },
      fix:   { label: 'take self',         code: "class Greeter:\n    def hello(self):\n        return 'hi'\n\nGreeter().hello()", output: "'hi'" },
    },
    {
      name: 'self.count += 1 does not update the class attribute',
      desc: 'Reading self.count finds the class value, but assigning to self.count creates an instance attribute that shadows it. The class attribute never changes.',
      wrong: { label: 'augmented assign on self', code: 'class Counter:\n    count = 0\n\n    def __init__(self):\n        self.count += 1\n\nCounter()\nCounter()\nCounter.count', output: '0' },
      fix:   { label: 'assign on the class',      code: 'class Counter:\n    count = 0\n\n    def __init__(self):\n        type(self).count += 1\n\nCounter()\nCounter()\nCounter.count', output: '2' },
    },
    {
      name: 'Overriding __init__ without calling super().__init__()',
      desc: 'A subclass __init__ replaces the parent one completely, so the parent never sets its attributes.',
      wrong: { label: 'parent init skipped', code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name):\n        self.tricks = []\n\nDog(\'Rex\').name', output: "AttributeError: 'Dog' object has no attribute 'name'" },
      fix:   { label: 'call super().__init__', code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name):\n        super().__init__(name)\n        self.tricks = []\n\nDog(\'Rex\').name', output: "'Rex'" },
    },
  ],

  when: {
    use: [
      'Data and the operations on it belong together (a Cart with add() and total())',
      'You need several objects with the same shape and behaviour',
      'You want your own type to work with len(), ==, for, with and friends (dunder methods)',
    ],
    avoid: [
      'Just a record of fields → @dataclass (still a class, far less code) or a NamedTuple',
      'A class with one method and __init__ → usually a plain function',
      'A bag of constants or stateless helpers → a module',
    ],
  },

  notes: {
    cpython:      'The body runs like a function body; its local namespace becomes the class __dict__, with __module__ and __doc__ added (and, since 3.13, __firstlineno__ and __static_attributes__)',
    'Scope':      'Names defined in the class body are NOT visible inside methods as bare names — use self.name or ClassName.name',
    'self':       'self is only a convention; Python passes the instance as the first positional argument whatever it is called',
    'Generics':   'Since 3.12 a class can declare type parameters directly: class Box[T]: ...',
  },

  related: [
    { name: 'def',          slug: 'def',          when: 'Methods are functions defined in the class body' },
    { name: 'super()',      slug: 'super',        when: 'Call the parent class implementation', category: 'functions' },
    { name: 'isinstance()', slug: 'isinstance',   when: 'Check an object against a class and its subclasses', category: 'functions' },
    { name: 'property()',   slug: 'property',     when: 'Computed or validated attributes', category: 'functions' },
    { name: 'classmethod()', slug: 'classmethod', when: 'Methods that receive the class, not the instance', category: 'functions' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What a failed attribute lookup raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is self in a Python class?',
      a: 'The instance the method was called on. obj.method(1) is effectively Class.method(obj, 1), so the first parameter receives obj. It is named self by convention only — any name works, but every normal method needs that first parameter.',
    },
    {
      q: 'What is the difference between a class attribute and an instance attribute?',
      a: 'A class attribute is assigned in the class body and stored once, on the class; every instance sees it. An instance attribute is assigned on self (usually in __init__) and stored per object. Reading self.x checks the instance first, then the class. For mutable values like lists this matters: a list in the class body is shared by all instances.',
    },
    {
      q: 'Is __init__ a constructor?',
      a: '__init__ initialises an object that already exists; __new__ is what creates it. In everyday code __init__ is where you set up attributes, and you rarely need __new__ (mainly when subclassing immutable types like int or str).',
    },
    {
      q: 'When should I use a dataclass instead of a normal class?',
      a: 'When the class is mainly a container of fields. @dataclass generates __init__, __repr__ and __eq__ from the annotated fields. You can still add methods; use field(default_factory=list) for mutable defaults.',
    },
  ],

  history: [
    { version: '3.9',  note: 'Classes may be decorated with any valid assignment_expression (PEP 614).' },
    { version: '3.12', note: 'Type parameter lists (class Box[T]: ...) are new.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#class-definitions',
    meta:  'Class definitions',
  },
};
