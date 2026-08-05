// content/reference/python/functions/issubclass.js

export const meta = {
  slug:        'issubclass',
  name:        'issubclass',
  signature:   'issubclass(class, classinfo)',
  blurb:       'Check whether one class is a subclass of another (or a tuple of others).',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'issubclass subclass class inheritance check type isinstance mro derived hierarchy',
};

export const method = {
  slug:      'issubclass',
  name:      'issubclass',
  signature: 'issubclass(class, classinfo)',
  returns:   { type: 'bool', desc: 'True if `class` is a subclass (direct, indirect, or virtual) of `classinfo`. A class is considered a subclass of itself. If classinfo is a tuple of classes, returns True when class is a subclass of ANY of them.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Type-vs-type check. The class-level counterpart to isinstance (which is instance-vs-type).',

  cheat: {
    commonCall: 'issubclass(Sub, Base)',
    returns:    'True or False',
    replaces:   'walking .__mro__ or .__bases__ manually',
    watchOut:   'first argument MUST be a class — passing an instance raises TypeError',
  },

  parameters: [
    { name: 'class',     type: 'type',              required: true, default: null, desc: 'The class to check. Must be a class object — passing an instance raises TypeError.' },
    { name: 'classinfo', type: 'type | tuple[type]',required: true, default: null, desc: 'A class or tuple of classes. Returns True if `class` is a subclass of it (or any one in the tuple).' },
  ],

  demoParams: [
    { name: 'child',  type: 'str', hint: 'child class: bool / int / str / list / tuple',   input: 'text' },
    { name: 'parent', type: 'str', hint: 'parent class: int / object / str / list / tuple', input: 'text' },
  ],
  cases: [
    { id: 'bool-int',      label: 'bool ⊂ int',        values: { child: 'bool',  parent: 'int' } },
    { id: 'int-object',    label: 'int ⊂ object',       values: { child: 'int',   parent: 'object' } },
    { id: 'str-object',    label: 'str ⊂ object',       values: { child: 'str',   parent: 'object' } },
    { id: 'int-str',       label: 'int ⊂ str? NO',      values: { child: 'int',   parent: 'str' } },
    { id: 'list-tuple',    label: 'list ⊂ tuple? NO',   values: { child: 'list',  parent: 'tuple' } },
    { id: 'self',          label: 'int ⊂ int (self)',    values: { child: 'int',   parent: 'int' } },
    { id: 'bool-object',   label: 'bool ⊂ object',       values: { child: 'bool',  parent: 'object' } },
  ],
  demoExplainer: 'issubclass walks the __mro__ (method resolution order) of the first argument looking for the second. It is True when `class` is `classinfo`, a direct subclass, or an indirect subclass. Notable Python trivia: `bool` IS a subclass of `int` (`True == 1`, `False == 0` — a design decision that occasionally surprises). Every class is a subclass of `object` in Python 3.',

  patterns: [
    {
      name: 'Register handlers by base class',
      desc: 'Dispatch based on class relationships rather than exact type.',
      code: 'for base, handler in HANDLERS.items():\n    if issubclass(cls, base):\n        return handler',
    },
    {
      name: 'Sanity check in metaclass / decorator',
      desc: 'Ensure a decorated class satisfies a contract.',
      code: 'def register(cls):\n    if not issubclass(cls, Serializable):\n        raise TypeError("must inherit from Serializable")',
    },
    {
      name: 'Tuple form for &quot;any of&quot;',
      desc: 'Match against a set of allowed base classes in one call.',
      code: 'if issubclass(cls, (Exception, Warning)):\n    ...',
    },
  ],

  examples: [
    { title: 'bool ⊂ int',       code: 'issubclass(bool, int)',       returns: 'True  # Python trivia' },
    { title: 'int ⊂ object',     code: 'issubclass(int, object)',      returns: 'True' },
    { title: 'Self',             code: 'issubclass(int, int)',         returns: 'True' },
    { title: 'Unrelated',        code: 'issubclass(int, str)',         returns: 'False' },
    { title: 'Tuple of bases',    code: 'issubclass(bool, (str, int))', returns: 'True  # via int' },
    { title: 'Instance rejected',  code: 'issubclass(42, int)',          returns: "TypeError: issubclass() arg 1 must be a class" },
  ],

  pitfalls: [
    {
      name: 'First argument must be a CLASS — not an instance',
      desc: 'The most common mix-up. issubclass takes CLASSES; isinstance takes an INSTANCE and a class. Passing an instance to issubclass raises TypeError.',
      wrong: { label: 'Instance rejected', code: 'issubclass(42, int)', output: 'TypeError: issubclass() arg 1 must be a class' },
      fix:   { label: 'Use type or isinstance', code: 'isinstance(42, int)   # True', output: '' },
    },
    {
      name: 'A class IS considered a subclass of itself',
      desc: 'issubclass(C, C) is True. Reflexive by design. If you need &quot;strictly a subclass&quot;, check inequality separately.',
      wrong: { label: 'Strict expected', code: 'issubclass(int, int)', output: 'True  # strict? No' },
      fix:   { label: 'For strict',       code: 'cls is not Base and issubclass(cls, Base)', output: 'strict subclass' },
    },
    {
      name: 'bool IS a subclass of int',
      desc: 'A frequent surprise in type-narrowing code. If you branch on int vs bool separately, check bool first — issubclass(bool, int) is True.',
      wrong: { label: 'Assumed disjoint',  code: 'if issubclass(cls, int): ...   # bool falls here', output: 'True even for bool' },
      fix:   { label: 'Check bool first',   code: 'if issubclass(cls, bool): ...\nelif issubclass(cls, int): ...', output: 'ordered' },
    },
    {
      name: 'Virtual subclasses (ABCs) can register without inheritance',
      desc: 'abc.ABCMeta.register() lets a class be considered a subclass of an ABC without actually inheriting. issubclass returns True for virtual subclasses — sometimes surprising when reading class hierarchies.',
      wrong: { label: 'Assumed lineage', code: 'issubclass(cls, ABC)', output: 'True even for registered virtual subclasses' },
      fix:   { label: 'Look at __mro__',   code: 'ABC in cls.__mro__', output: 'False for virtual' },
    },
  ],

  when: {
    use: [
      'Dispatch tables keyed by class',
      'Sanity checks in decorators, metaclasses, or framework code',
      'Filtering a set of classes by base',
      'Any place `if type(x) is C` is too strict but `isinstance` is the wrong direction',
    ],
    avoid: [
      'You have an instance → isinstance',
      'You need exact type equality → `type(x) is C`',
      'You want to know why → inspect __mro__ / __bases__ directly',
    ],
  },

  notes: {
    complexity: 'O(depth of MRO) — walk the class hierarchy',
    return:     'bool',
    cpython:    'Python/bltinmodule.c :: builtin_issubclass',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable hierarchies',
  },

  related: [
    { name: 'isinstance', slug: 'isinstance', when: 'Instance-vs-type check (the more common builtin)' },
    { name: 'type',       slug: 'type',       when: 'Get the exact class of an instance' },
    { name: 'super',      slug: 'super',      when: 'Cooperative parent method access' },
  ],

  faq: [
    {
      q: 'What is the difference between issubclass and isinstance?',
      a: 'isinstance takes an INSTANCE and a class: `isinstance(42, int)` → True. issubclass takes two CLASSES: `issubclass(bool, int)` → True. isinstance is by far the more common of the two.',
    },
    {
      q: 'Why is bool a subclass of int?',
      a: 'Historical — Python added bool late (2.2) and reused int&apos;s implementation. True and False are the ints 1 and 0. This is why `True + 1 == 2` and why `issubclass(bool, int)` is True.',
    },
    {
      q: 'Is every class a subclass of object?',
      a: 'In Python 3, yes. Every class implicitly inherits from object. In Python 2 you had &quot;old-style&quot; classes that did not; Python 3 removed that distinction.',
    },
  ],

  history: [
    { version: '1.0', note: 'issubclass() has been a builtin since Python 1.0.' },
    { version: '2.2', note: 'Extended to accept a tuple of classes as classinfo.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#issubclass',
    meta:  'issubclass',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect class data' },
  ],
};