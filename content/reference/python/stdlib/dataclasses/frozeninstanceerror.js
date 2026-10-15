// content/reference/python/stdlib/dataclasses/frozeninstanceerror.js

export const meta = {
  slug:        'frozeninstanceerror',
  name:        'dataclasses.FrozenInstanceError',
  signature:   'dataclasses.FrozenInstanceError',
  blurb:       'Raised when code assigns to or deletes an attribute of a frozen=True dataclass instance. A subclass of AttributeError.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'FrozenInstanceError dataclasses.FrozenInstanceError cannot assign to field cannot delete field frozen dataclass frozen=True immutable dataclass modify attribute __post_init__ object.__setattr__ attributeerror replace',
};

export const method = {
  slug:      'frozeninstanceerror',
  name:      'dataclasses.FrozenInstanceError',
  signature: 'dataclasses.FrozenInstanceError',

  category:    'dataclasses exception',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'frozen=True gives the class a __setattr__ and a __delattr__ that raise it. On the frozen class itself every name is blocked — fields and new attributes alike; the message always says "field". Build a changed copy with replace() instead.',

  covers: ['FrozenInstanceError'],

  chain: ['BaseException', 'Exception', 'AttributeError', 'FrozenInstanceError'],

  cheat: {
    raisedBy: 'obj.attr = value, del obj.attr, setattr / delattr on a frozen dataclass instance',
    message:  "cannot assign to field 'x'  /  cannot delete field 'x'",
    quickFix: 'obj = dataclasses.replace(obj, x=new_value)',
    watchOut: 'in __post_init__ of a frozen class use object.__setattr__(self, name, value)',
  },

  parameters: [],

  modes: [
    {
      id: 'assign',
      label: 'Trigger',
      blurb: 'Assign any attribute name on a frozen instance.',
      params: [
        { name: 'name',  type: 'str', hint: 'attribute name', input: 'text' },
        { name: 'value', type: 'any', hint: 'value',          input: 'auto' },
      ],
      template: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nsetattr(p, {$name}, {$value})',
      cases: [
        { id: 'field', label: 'a field',  values: { name: 'x', value: '10' } },
        { id: 'new',   label: 'new name', values: { name: 'label', value: 'home' } },
      ],
    },
    {
      id: 'delete',
      label: 'delete',
      blurb: '__delattr__ is generated too.',
      params: [{ name: 'name', type: 'str', hint: 'attribute name', input: 'text' }],
      template: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\ndelattr(p, {$name})',
      cases: [
        { id: 'y',    label: 'y',       values: { name: 'y' } },
        { id: 'none', label: 'missing', values: { name: 'nothing' } },
      ],
    },
    {
      id: 'subclass',
      label: 'plain subclass',
      blurb: 'Tagged is an ordinary subclass. Its instances still protect the fields, but other names go through to object.__setattr__.',
      params: [{ name: 'name', type: 'str', hint: 'attribute name', input: 'text' }],
      template: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n\nclass Tagged(Point):\n    pass\n\nt = Tagged(1)\nsetattr(t, {$name}, 'v')\nt.__dict__",
      cases: [
        { id: 'tag',   label: 'tag',  values: { name: 'tag' } },
        { id: 'field', label: 'x',    values: { name: 'x' } },
      ],
    },
  ],
  demoExplainer: 'On Point itself the check is "type(self) is cls or name in the field names", so a brand-new name such as label is refused as well — with the same "cannot assign to field" wording. For Tagged instances only the field name x is still protected; tag lands in the instance __dict__ next to x.',

  attributes: [
    { name: 'args', type: 'tuple', meaning: "One item: the message, e.g. (\"cannot assign to field 'x'\",)" },
    { name: 'name', type: 'None', meaning: 'Inherited from AttributeError but not set here (None) — so no "Did you mean" suggestion either' },
    { name: 'obj',  type: 'None', meaning: 'Inherited from AttributeError; not set (None)' },
  ],

  patterns: [
    {
      name: 'Change by copying',
      desc: 'The intended way to "modify" a frozen instance.',
      code: 'from dataclasses import replace\npoint = replace(point, x=10)',
    },
    {
      name: 'Derived fields in a frozen class',
      desc: 'Bypass the generated __setattr__ inside __post_init__ only.',
      code: "from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Name:\n    first: str\n    last: str\n    full: str = field(init=False)\n\n    def __post_init__(self):\n        object.__setattr__(self, 'full', f'{self.first} {self.last}')",
    },
    {
      name: 'Catch it as AttributeError',
      desc: 'Code that already handles read-only attributes handles frozen dataclasses too.',
      code: 'try:\n    obj.value = 1\nexcept AttributeError as e:\n    log.warning("read-only: %s", e)',
    },
  ],

  examples: [
    { title: 'Assigning a field', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\np.x = 5', returns: "dataclasses.FrozenInstanceError: cannot assign to field 'x'" },
    { title: 'A new attribute is refused too', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\np.z = 3', returns: "dataclasses.FrozenInstanceError: cannot assign to field 'z'" },
    { title: 'Deleting', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\ndel p.x', returns: "dataclasses.FrozenInstanceError: cannot delete field 'x'" },
    { title: 'An AttributeError subclass', code: "from dataclasses import dataclass, FrozenInstanceError\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n\ntry:\n    Point(1).x = 2\nexcept FrozenInstanceError as e:\n    info = (type(e).__name__, str(e), e.args, isinstance(e, AttributeError))\ninfo", returns: "('FrozenInstanceError', \"cannot assign to field 'x'\", (\"cannot assign to field 'x'\",), True)" },
    { title: 'name and obj stay None', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n\ntry:\n    Point(1).x = 2\nexcept AttributeError as e:\n    info = (e.name, e.obj)\ninfo', returns: '(None, None)' },
    { title: 'object.__setattr__ bypasses it', code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n\np = Point(1)\nobject.__setattr__(p, 'x', 5)\np", returns: 'Point(x=5)' },
    { title: 'slots=True too', code: 'from dataclasses import dataclass\n\n@dataclass(slots=True, frozen=True)\nclass P:\n    x: int\n\np = P(1)\np.x = 2', returns: "dataclasses.FrozenInstanceError: cannot assign to field 'x'" },
    { title: 'Raise it yourself', code: "from dataclasses import FrozenInstanceError\nraise FrozenInstanceError(\"cannot assign to field 'x'\")", returns: "dataclasses.FrozenInstanceError: cannot assign to field 'x'" },
  ],

  pitfalls: [
    {
      name: 'Normalising a field in __post_init__ of a frozen class',
      desc: 'The generated __init__ sets fields with object.__setattr__, but your __post_init__ goes through the frozen __setattr__.',
      wrong: { label: 'self.x = ...', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n\n    def __post_init__(self):\n        self.x = abs(self.x)\n\nPoint(-1)', output: "dataclasses.FrozenInstanceError: cannot assign to field 'x'" },
      fix:   { label: 'object.__setattr__', code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n\n    def __post_init__(self):\n        object.__setattr__(self, 'x', abs(self.x))\n\nPoint(-1)", output: 'Point(x=1)' },
    },
    {
      name: 'Updating in place',
      desc: 'A frozen instance cannot change; make a new one and rebind the name. The original stays valid wherever else it is referenced.',
      wrong: { label: 'p.x = 10', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\np.x = 10', output: "dataclasses.FrozenInstanceError: cannot assign to field 'x'" },
      fix:   { label: 'replace()', code: 'from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\np = replace(p, x=10)\np', output: 'Point(x=10, y=2)' },
    },
    {
      name: 'Mixing frozen and non-frozen dataclasses in one hierarchy',
      desc: 'A dataclass subclass must match its dataclass bases: all frozen or none. The error comes at class creation.',
      wrong: { label: 'frozen base, mutable child', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Base:\n    x: int\n\n@dataclass\nclass Child(Base):\n    y: int', output: 'TypeError: cannot inherit non-frozen dataclass from a frozen one' },
      fix:   { label: 'frozen=True on both', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Base:\n    x: int\n\n@dataclass(frozen=True)\nclass Child(Base):\n    y: int\n\nChild(1, 2)', output: 'Child(x=1, y=2)' },
    },
  ],

  when: {
    use: [
      'Catch it (or AttributeError) where code may try to modify shared, immutable configuration',
      'Expect it in tests that check a value object really is immutable',
    ],
    avoid: [
      'Catching it to "allow" the change — use replace() for a modified copy',
      'object.__setattr__ outside __post_init__ — it silently breaks the immutability (and the hash) others rely on',
    ],
  },

  notes: {
    cpython:        'Lib/dataclasses.py — class FrozenInstanceError(AttributeError): pass. The generated __setattr__ raises it when type(self) is cls or name is a field name, and otherwise calls super(cls, self).__setattr__',
    'Traceback':    'Shown as dataclasses.FrozenInstanceError — the class lives in the dataclasses module',
    'Inheritance':  'cannot inherit non-frozen dataclass from a frozen one / cannot inherit frozen dataclass from a non-frozen one — both TypeError at class creation',
  },

  related: [
    { name: '@dataclass(frozen=True)', slug: 'dataclass', when: 'What installs the raising __setattr__' },
    { name: 'replace()', slug: 'replace', when: 'The way to get a changed copy' },
    { name: '__post_init__', slug: 'post_init', when: 'Where object.__setattr__ is legitimate' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'Its parent class', category: 'exceptions' },
    { name: 'setattr()', slug: 'setattr', when: 'Goes through the same __setattr__', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does "dataclasses.FrozenInstanceError: cannot assign to field" mean?',
      a: 'The class was declared with @dataclass(frozen=True), so assignment to its instances is blocked. Create a modified copy with dataclasses.replace(obj, field=value), or drop frozen=True if the object really has to change.',
    },
    {
      q: 'How do I set a field in __post_init__ of a frozen dataclass?',
      a: "object.__setattr__(self, 'name', value). The generated __init__ does the same internally; self.name = value goes through the frozen __setattr__ and raises.",
    },
    {
      q: 'Is FrozenInstanceError an AttributeError?',
      a: 'Yes, it subclasses AttributeError (its MRO is FrozenInstanceError → AttributeError → Exception → BaseException), so except AttributeError catches it.',
    },
    {
      q: 'Why does assigning a new attribute (not a field) also raise FrozenInstanceError?',
      a: 'The generated __setattr__ refuses every name when the object is an instance of the frozen class itself; the message says "field" even for names that are not fields. Only instances of non-dataclass subclasses may set extra attributes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.FrozenInstanceError',
    meta:  'dataclasses.FrozenInstanceError',
  },

};
