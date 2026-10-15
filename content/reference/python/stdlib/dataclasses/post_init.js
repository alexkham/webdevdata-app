// content/reference/python/stdlib/dataclasses/post_init.js — the __post_init__ hook

export const meta = {
  slug:        'post_init',
  name:        '__post_init__',
  signature:   'def __post_init__(self, *initvars)',
  blurb:       'A method you define on a dataclass; the generated __init__ calls it last — the place for validation, conversions and computed fields.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'dataclass __post_init__ python post init validation dataclass validate fields computed field derived field init=False frozen object.__setattr__ InitVar super().__post_init__ inheritance call base __init__ convert types',
};

export const method = {
  slug:      'post_init',
  name:      '__post_init__',
  signature: 'def __post_init__(self, *initvars)',
  returns:   { type: 'None', desc: 'Its return value is ignored.' },

  category:    'dataclasses hook',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'After the generated __init__ has set every field, it calls self.__post_init__(), passing the InitVar values in definition order. No __init__ generated (init=False or your own __init__) means no call.',

  // __post_init__ is a hook you write, not a public name of the module
  covers: [],

  cheat: {
    commonCall: 'def __post_init__(self):\n    if self.stop < self.start: raise ValueError(...)',
    returns:    'None — raise to reject the arguments',
    replaces:   'writing __init__ by hand just to add a check',
    watchOut:   'frozen classes: assign with object.__setattr__(self, name, value)',
  },

  parameters: [
    { name: 'self',       type: 'instance', required: true,  default: null, desc: 'The new object. Every __init__ parameter field is already set, init=False fields with a default_factory too; an init=False field with a plain default is read from the class attribute (with slots=True, __init__ sets it).' },
    { name: '*initvars',  type: 'any',      required: false, default: null, desc: 'One positional argument per InitVar pseudo-field, in definition order — base class InitVars first.' },
  ],

  modes: [
    {
      id: 'validate',
      label: 'validate',
      blurb: 'Reject impossible values right where the object is created.',
      params: [
        { name: 'start', type: 'int', hint: 'start', input: 'number' },
        { name: 'stop',  type: 'int', hint: 'stop',  input: 'number' },
      ],
      template: "from dataclasses import dataclass\n\n@dataclass\nclass Range:\n    start: int\n    stop: int\n\n    def __post_init__(self):\n        if self.stop < self.start:\n            raise ValueError(f'stop {self.stop} < start {self.start}')\n\nr = Range({$start}, {$stop})\n(r, r.stop - r.start)",
      cases: [
        { id: 'ok',    label: '3 → 7',  values: { start: '3', stop: '7' } },
        { id: 'empty', label: '5 → 5',  values: { start: '5', stop: '5' } },
        { id: 'bad',   label: '5 → 1',  values: { start: '5', stop: '1' } },
      ],
    },
    {
      id: 'derived',
      label: 'computed field',
      blurb: 'area is not an __init__ parameter (init=False); __post_init__ computes it from w and h.',
      params: [
        { name: 'w', type: 'float', hint: 'width',  input: 'float' },
        { name: 'h', type: 'float', hint: 'height', input: 'float' },
      ],
      template: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Rect:\n    w: float\n    h: float\n    area: float = field(init=False)\n\n    def __post_init__(self):\n        self.area = self.w * self.h\n\nRect({$w}, {$h})',
      cases: [
        { id: 'simple', label: '2 × 3.5',   values: { w: '2', h: '3.5' } },
        { id: 'tenths', label: '0.1 × 0.2', values: { w: '0.1', h: '0.2' } },
      ],
    },
    {
      id: 'frozen',
      label: 'frozen class',
      blurb: 'In a frozen class, __post_init__ sets the computed field through object.__setattr__.',
      params: [
        { name: 'first', type: 'str', hint: 'first name', input: 'text' },
        { name: 'last',  type: 'str', hint: 'last name',  input: 'text' },
      ],
      template: "from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Name:\n    first: str\n    last: str\n    full: str = field(init=False, repr=False)\n\n    def __post_init__(self):\n        object.__setattr__(self, 'full', f'{self.first} {self.last}')\n\nn = Name({$first}, {$last})\n(n, n.full)",
      cases: [
        { id: 'ada',   label: 'Ada Lovelace', values: { first: 'Ada', last: 'Lovelace' } },
        { id: 'empty', label: 'no last name', values: { first: 'Cher', last: '' } },
      ],
    },
  ],
  demoExplainer: 'In validate, 5 → 1 never produces an object: the ValueError from __post_init__ propagates out of Range(5, 1). In computed field, 0.1 × 0.2 shows binary floating point at work (0.020000000000000004). In frozen class, full is filled in although assignment is blocked for everyone else, and repr=False keeps it out of the repr.',

  patterns: [
    {
      name: 'Validation',
      desc: 'Raise ValueError (or TypeError) with a precise message.',
      code: "from dataclasses import dataclass\n\n@dataclass\nclass Port:\n    number: int\n\n    def __post_init__(self):\n        if not 0 < self.number < 65536:\n            raise ValueError(f'port out of range: {self.number}')",
    },
    {
      name: 'Normalise input',
      desc: 'Accept loose input, store a clean value.',
      code: 'from dataclasses import dataclass\n\n@dataclass\nclass Email:\n    address: str\n\n    def __post_init__(self):\n        self.address = self.address.strip().lower()',
    },
    {
      name: 'Keep the base class hook',
      desc: 'A subclass __post_init__ replaces the inherited one.',
      code: 'def __post_init__(self):\n    super().__post_init__()\n    ...  # subclass checks',
    },
    {
      name: 'Initialise a non-dataclass base',
      desc: 'The generated __init__ never calls a base __init__.',
      code: 'from dataclasses import dataclass\n\n@dataclass\nclass Square(Rectangle):\n    side: float\n\n    def __post_init__(self):\n        super().__init__(self.side, self.side)',
    },
  ],

  examples: [
    { title: 'A computed field', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Rect:\n    w: float\n    h: float\n    area: float = field(init=False)\n\n    def __post_init__(self):\n        self.area = self.w * self.h\n\nRect(2.0, 3.5)', returns: 'Rect(w=2.0, h=3.5, area=7.0)' },
    { title: 'Converting a field', code: "from dataclasses import dataclass\n\n@dataclass\nclass P:\n    x: int\n\n    def __post_init__(self):\n        self.x = int(self.x)\n\nP('42'), P(3.9)", returns: '(P(x=42), P(x=3))' },
    { title: 'Inherited if not overridden', code: "from dataclasses import dataclass\n\n@dataclass\nclass Base:\n    x: int\n\n    def __post_init__(self):\n        print('Base post_init')\n\n@dataclass\nclass Child(Base):\n    y: int = 0\n\nChild(1)", returns: 'Base post_init\nChild(x=1, y=0)' },
    { title: 'Chain to the base hook', code: "from dataclasses import dataclass\n\n@dataclass\nclass Base:\n    x: int\n\n    def __post_init__(self):\n        print('Base post_init')\n\n@dataclass\nclass Child(Base):\n    y: int = 0\n\n    def __post_init__(self):\n        super().__post_init__()\n        print('Child post_init')\n\nChild(1)", returns: 'Base post_init\nChild post_init\nChild(x=1, y=0)' },
    { title: 'Calling a non-dataclass base __init__', code: 'from dataclasses import dataclass\n\nclass Rectangle:\n    def __init__(self, height, width):\n        self.height = height\n        self.width = width\n\n@dataclass\nclass Square(Rectangle):\n    side: float\n\n    def __post_init__(self):\n        super().__init__(self.side, self.side)\n\ns = Square(2.0)\ns, s.height, s.width', returns: '(Square(side=2.0), 2.0, 2.0)' },
    { title: 'init=False: not called', code: "from dataclasses import dataclass\n\n@dataclass(init=False)\nclass P:\n    x: int = 0\n\n    def __post_init__(self):\n        print('called')\n\nP()", returns: 'P(x=0)' },
    { title: 'Your own __init__: not called either', code: "from dataclasses import dataclass\n\n@dataclass\nclass P:\n    x: int\n\n    def __init__(self, x):\n        self.x = x * 2\n\n    def __post_init__(self):\n        print('called')\n\nP(1)", returns: 'P(x=2)' },
  ],

  pitfalls: [
    {
      name: 'Plain assignment in a frozen class',
      desc: 'self.full = ... goes through the frozen __setattr__, even inside __post_init__.',
      wrong: { label: 'self.full = ...', code: "from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Name:\n    first: str\n    last: str\n    full: str = field(init=False, repr=False)\n\n    def __post_init__(self):\n        self.full = f'{self.first} {self.last}'\n\nName('Ada', 'Lovelace')", output: "dataclasses.FrozenInstanceError: cannot assign to field 'full'" },
      fix:   { label: 'object.__setattr__', code: "from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Name:\n    first: str\n    last: str\n    full: str = field(init=False, repr=False)\n\n    def __post_init__(self):\n        object.__setattr__(self, 'full', f'{self.first} {self.last}')\n\nn = Name('Ada', 'Lovelace')\nn, n.full", output: "(Name(first='Ada', last='Lovelace'), 'Ada Lovelace')" },
    },
    {
      name: 'A computed field goes stale',
      desc: '__post_init__ runs once. If the inputs can change later, compute the value on access with a property instead.',
      wrong: { label: 'field(init=False)', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Rect:\n    w: float\n    h: float\n    area: float = field(init=False)\n\n    def __post_init__(self):\n        self.area = self.w * self.h\n\nr = Rect(2.0, 3.0)\nr.w = 10.0\nr', output: 'Rect(w=10.0, h=3.0, area=6.0)' },
      fix:   { label: '@property', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Rect:\n    w: float\n    h: float\n\n    @property\n    def area(self):\n        return self.w * self.h\n\nr = Rect(2.0, 3.0)\nr.w = 10.0\nr.area', output: '30.0' },
    },
    {
      name: 'Extra parameters without InitVar',
      desc: '__post_init__ only receives the InitVar values. Any other parameter is reported missing when the object is created.',
      wrong: { label: '(self, extra)', code: 'from dataclasses import dataclass\n\n@dataclass\nclass P:\n    x: int\n\n    def __post_init__(self, extra):\n        pass\n\nP(1)', output: "TypeError: P.__post_init__() missing 1 required positional argument: 'extra'" },
      fix:   { label: 'extra: InitVar', code: 'from dataclasses import dataclass, InitVar\n\n@dataclass\nclass P:\n    x: int\n    extra: InitVar[int] = 0\n\n    def __post_init__(self, extra):\n        self.x += extra\n\nP(1, 5)', output: 'P(x=6)' },
    },
  ],

  when: {
    use: [
      'Validating field values at construction time',
      'Normalising or converting input (strip, lower, int(...))',
      'Computing init=False fields, possibly from InitVars',
    ],
    avoid: [
      'Values that must follow later changes → a @property',
      'Heavy parsing of external data → a separate classmethod constructor (from_dict, from_row) keeps __init__ simple',
    ],
  },

  notes: {
    cpython:      'Lib/dataclasses.py _init_fn — when hasattr(cls, "__post_init__") at decoration time, the generated __init__ ends with self.__post_init__(<InitVar names>)',
    'replace()':  'replace() builds the copy through __init__, so __post_init__ runs for copies as well',
    'Return value': 'Ignored — returning something from __post_init__ has no effect',
  },

  related: [
    { name: 'InitVar', slug: 'initvar', when: 'Extra arguments for __post_init__' },
    { name: 'field(init=False)', slug: 'field', when: 'Fields that __post_init__ fills' },
    { name: 'FrozenInstanceError', slug: 'frozeninstanceerror', when: 'What self.x = ... raises in a frozen class' },
    { name: 'replace()', slug: 'replace', when: 'Runs __post_init__ again' },
    { name: 'property', slug: 'property', when: 'Values computed on every access', category: 'functions' },
    { name: 'super()', slug: 'super', when: 'Chain to the base class hook', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I validate fields in a Python dataclass?',
      a: 'Define __post_init__(self) and raise ValueError (or TypeError) when a field is invalid. The generated __init__ calls it after setting all fields, so every call of the class — including the one dataclasses.replace() makes — is checked. copy.copy() and pickle do not call __init__, so they skip it.',
    },
    {
      q: 'Is __post_init__ called for subclasses?',
      a: 'The generated __init__ calls self.__post_init__(), so a subclass uses its own version or inherits the base one. When a subclass defines its own, it must call super().__post_init__() for the base checks to run.',
    },
    {
      q: 'Why is my __post_init__ not called?',
      a: 'Either the class defines its own __init__ (the decorator then does not generate one), or it uses @dataclass(init=False). Only the generated __init__ calls __post_init__.',
    },
    {
      q: 'How do I set a field in __post_init__ of a frozen dataclass?',
      a: "Use object.__setattr__(self, 'name', value); normal assignment raises FrozenInstanceError.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.__post_init__',
    meta:  'dataclasses.__post_init__',
  },

};
