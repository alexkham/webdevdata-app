// content/reference/python/stdlib/dataclasses/field.js

export const meta = {
  slug:        'field',
  name:        'dataclasses.field',
  signature:   'dataclasses.field(*, default=MISSING, default_factory=MISSING, init=True, repr=True, hash=None, compare=True, metadata=None, kw_only=MISSING)',
  blurb:       'Per-field options for a dataclass: a default or a default factory, and whether the field appears in __init__, the repr, comparisons and the hash.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+ (kw_only 3.10)',
  searchTerms: 'dataclass field default_factory python dataclasses.field default factory list dict mutable default repr=False compare=False init=False hash kw_only metadata exclude field from repr exclude from comparison mutable default list for field is not allowed use default_factory cannot specify both default and default_factory',
};

export const method = {
  slug:      'field',
  name:      'dataclasses.field',
  signature: 'dataclasses.field(*, default=MISSING, default_factory=MISSING, init=True, repr=True, hash=None, compare=True, metadata=None, kw_only=MISSING)',
  returns:   { type: 'Field', desc: 'A Field object; the decorator fills in its name and type and replaces the class attribute with the default (or deletes it).' },

  category:    'dataclasses function',
  version:     'Python 3.7+ (kw_only 3.10)',
  hasLiveDemo: true,

  subtitle: 'Write name: type = field(...) where a plain default would go. The everyday use is default_factory=list for a fresh list per instance; the other options take a field out of __init__, the repr, == and ordering, or the hash.',

  covers: ['field'],

  cheat: {
    commonCall: 'items: list[str] = field(default_factory=list)',
    returns:    'a Field, turned into a normal class default by @dataclass',
    replaces:   'items: list = [] — which dataclasses reject',
    watchOut:   'default_factory takes the callable: list, not list()',
  },

  parameters: [
    { name: 'default',         type: 'object',   required: false, default: 'MISSING', desc: 'The default value. Unhashable values (list, dict, set …) raise ValueError — use default_factory for those.' },
    { name: 'default_factory', type: 'callable', required: false, default: 'MISSING', desc: 'Called with no arguments every time a default is needed, so each instance gets a new object. Not allowed together with default.' },
    { name: 'init',            type: 'bool',     required: false, default: 'True',    desc: 'False: not a parameter of __init__. The field is then set from default / default_factory, or not at all — typically in __post_init__.' },
    { name: 'repr',            type: 'bool',     required: false, default: 'True',    desc: 'False: left out of the generated __repr__ (passwords, large data, back-references).' },
    { name: 'hash',            type: 'bool | None', required: false, default: 'None', desc: 'Include in the generated __hash__. None means "same as compare" — the setting you almost always want.' },
    { name: 'compare',         type: 'bool',     required: false, default: 'True',    desc: 'False: ignored by __eq__ and by the order=True methods (caches, counters, timestamps).' },
    { name: 'metadata',        type: 'mapping | None', required: false, default: 'None', desc: 'Your own data about the field, stored read-only on Field.metadata. dataclasses never looks at it.' },
    { name: 'kw_only',         type: 'bool',     required: false, default: 'MISSING', desc: 'True: a keyword-only __init__ parameter, left out of __match_args__. MISSING follows the decorator (kw_only= or a KW_ONLY marker). (3.10+)' },
  ],

  modes: [
    {
      id: 'factory',
      label: 'default_factory',
      blurb: 'Each Cart gets its own new list. Append to one and look at both.',
      params: [
        { name: 'owner', type: 'str', hint: 'cart a: owner',  input: 'text' },
        { name: 'item',  type: 'str', hint: 'append to cart a', input: 'text' },
      ],
      template: "from dataclasses import dataclass, field\n\n@dataclass\nclass Cart:\n    owner: str\n    items: list[str] = field(default_factory=list)\n\na = Cart({$owner})\nb = Cart('bob')\na.items.append({$item})\n(a, b, a.items is b.items)",
      cases: [
        { id: 'pen',   label: 'pen',   values: { owner: 'ann', item: 'pen' } },
        { id: 'empty', label: 'empty string', values: { owner: 'zoë', item: '' } },
      ],
    },
    {
      id: 'options',
      label: 'repr / compare',
      blurb: 'password is hidden from the repr; logins is ignored by ==. Compare with a user built without a login count.',
      params: [
        { name: 'name',     type: 'str', hint: 'user name', input: 'text' },
        { name: 'password', type: 'str', hint: 'password',  input: 'text' },
        { name: 'logins',   type: 'int', hint: 'login count', input: 'number' },
      ],
      template: "from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    password: str = field(repr=False)\n    logins: int = field(default=0, compare=False)\n\nu = User({$name}, {$password}, {$logins})\n(u, u == User({$name}, {$password}))",
      cases: [
        { id: 'ann',  label: 'ann',          values: { name: 'ann', password: 's3cret', logins: '5' } },
        { id: 'zero', label: 'zero logins',  values: { name: 'bob', password: 'hunter2', logins: '0' } },
      ],
    },
    {
      id: 'metadata',
      label: 'metadata',
      blurb: 'metadata travels with the field definition, not the instance. Read it back next to each value.',
      params: [
        { name: 'value', type: 'float', hint: 'weight',    input: 'float' },
        { name: 'note',  type: 'str',   hint: 'free text', input: 'text' },
      ],
      template: "from dataclasses import dataclass, field, fields\n\n@dataclass\nclass Reading:\n    value: float = field(metadata={'unit': 'kg'})\n    note: str = field(default='', metadata={'unit': None})\n\nr = Reading({$value}, {$note})\n[(f.name, getattr(r, f.name), f.metadata['unit']) for f in fields(r)]",
      cases: [
        { id: 'scale', label: '2.5 kg',  values: { value: '2.5', note: 'scale A' } },
        { id: 'tiny',  label: '1e-07',   values: { value: '0.0000001', note: '' } },
      ],
    },
  ],
  demoExplainer: 'In default_factory, a.items is b.items is False: list() ran once per instance, so the append only shows up in cart a. In repr / compare the repr has no password at all, and the two users are equal although only one of them has a login count — compare=False takes logins out of ==. In metadata the unit comes from the field definition; Reading never stores it on the instance.',

  patterns: [
    {
      name: 'Mutable defaults',
      desc: 'One new object per instance; any zero-argument callable works.',
      code: "from dataclasses import dataclass, field\n\n@dataclass\nclass Settings:\n    tags: list[str] = field(default_factory=list)\n    options: dict = field(default_factory=lambda: {'debug': False})",
    },
    {
      name: 'Derived field outside __init__',
      desc: 'init=False plus __post_init__ computes a value from the other fields.',
      code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Rect:\n    w: float\n    h: float\n    area: float = field(init=False)\n\n    def __post_init__(self):\n        self.area = self.w * self.h',
    },
    {
      name: 'Secrets out of the repr and the comparison',
      desc: 'Keep logs clean and equality meaningful.',
      code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Account:\n    user: str\n    token: str = field(repr=False, compare=False)',
    },
    {
      name: 'Read your own metadata',
      desc: 'Attach labels, units or validation hints and read them through fields().',
      code: "from dataclasses import fields\nlabels = {f.name: f.metadata.get('label', f.name) for f in fields(form)}",
    },
  ],

  examples: [
    { title: 'A new list for every instance', code: "from dataclasses import dataclass, field\n\n@dataclass\nclass Settings:\n    options: dict = field(default_factory=dict)\n\na = Settings()\na.options['debug'] = True\na, Settings()", returns: "(Settings(options={'debug': True}), Settings(options={}))" },
    { title: 'repr=False', code: "from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    password: str = field(repr=False)\n\nUser('ann', 'secret')", returns: "User(name='ann')" },
    { title: 'compare=False', code: "from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    visits: int = field(default=0, compare=False)\n\nUser('ann', 1) == User('ann', 99)", returns: 'True' },
    { title: 'kw_only on one field', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Point:\n    x: int\n    y: int = field(kw_only=True)\n    z: int = 0\n\nPoint(1, 2, y=3), Point.__doc__', returns: "(Point(x=1, y=3, z=2), 'Point(x: int, z: int = 0, *, y: int)')" },
    { title: 'init=False with a factory', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    log: list = field(default_factory=list, init=False)\n\nC(), C().log is C().log', returns: '(C(log=[]), False)' },
    { title: 'What the class attribute becomes', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    x: int\n    y: int = field(repr=False)\n    z: int = field(repr=False, default=10)\n    t: int = 20\n\nC.z, C.t, hasattr(C, \'x\'), hasattr(C, \'y\')', returns: '(10, 20, False, False)' },
    { title: 'metadata is read-only', code: "from dataclasses import dataclass, field\n\n@dataclass\nclass Reading:\n    value: float = field(metadata={'unit': 'kg'})\n\nReading.__dataclass_fields__['value'].metadata['unit'] = 'g'", returns: "TypeError: 'mappingproxy' object does not support item assignment" },
    { title: 'A factory shows as <factory>', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    x: int = field(default_factory=lambda: 7)\n\nC(), C.__doc__', returns: "(C(x=7), 'C(x: int = <factory>)')" },
  ],

  pitfalls: [
    {
      name: 'A dict, list or set as a plain default',
      desc: 'The decorator rejects any default whose type is unhashable, because one default object would be shared by every instance. The message names the type and the field.',
      wrong: { label: 'options: dict = {}', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Settings:\n    options: dict = {}', output: "ValueError: mutable default <class 'dict'> for field options is not allowed: use default_factory" },
      fix:   { label: 'default_factory=dict', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Settings:\n    options: dict = field(default_factory=dict)\n\nSettings()', output: 'Settings(options={})' },
    },
    {
      name: 'Calling the factory: default_factory=list()',
      desc: 'list() is an empty list, not a callable. The class is created without complaint; the error comes from the first instance that needs the default.',
      wrong: { label: 'list()', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Cart:\n    items: list = field(default_factory=list())\n\nCart()', output: "TypeError: 'list' object is not callable" },
      fix:   { label: 'list', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Cart:\n    items: list = field(default_factory=list)\n\nCart(), Cart([1, 2])', output: '(Cart(items=[]), Cart(items=[1, 2]))' },
    },
    {
      name: 'init=False and nothing sets the field',
      desc: 'Without a default, a default_factory or an assignment in __post_init__, the attribute simply does not exist — and the generated repr is the first thing to fail.',
      wrong: { label: 'no value', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    x: int = field(init=False)\n\nrepr(C())', output: "AttributeError: 'C' object has no attribute 'x'" },
      fix:   { label: 'default=', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    x: int = field(init=False, default=5)\n\nC()', output: 'C(x=5)' },
    },
    {
      name: 'Both default and default_factory',
      desc: 'Pick one: a value, or a callable that makes the value.',
      wrong: { label: 'both', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    x: int = field(default=1, default_factory=int)', output: 'ValueError: cannot specify both default and default_factory' },
      fix:   { label: 'default only', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    x: int = field(default=1)\n\nC()', output: 'C(x=1)' },
    },
  ],

  when: {
    use: [
      'Any default that is a list, dict, set or other mutable object → default_factory',
      'Fields that must not appear in the repr or count for equality',
      'Computed fields set in __post_init__ → init=False',
      'Attaching your own per-field information (labels, units) → metadata',
    ],
    avoid: [
      'Plain immutable defaults — x: int = 0 is clearer than field(default=0)',
      'hash= — leave it at None so the hash follows compare',
      'Every field keyword-only → @dataclass(kw_only=True) or a KW_ONLY marker',
    ],
  },

  notes: {
    cpython:         'field() checks only that default and default_factory are not both given (ValueError), then stores its arguments in a Field object; @dataclass reads it later, in _get_field, where the mutable-default check (type(default).__hash__ is None) happens',
    'Mutable check': 'Since Python 3.11 any unhashable default is refused; 3.7–3.10 only checked for list, dict and set',
    'Class attribute': 'After decoration the class attribute is the default value, or deleted when there is no default — default_factory fields have none',
  },

  related: [
    { name: '@dataclass', slug: 'dataclass', when: 'The decorator that reads these options' },
    { name: 'Field objects', slug: 'field-object', when: 'Read the options back: fields(cls)[i].repr …' },
    { name: 'fields()', slug: 'fields', when: 'All Field objects of a class' },
    { name: '__post_init__', slug: 'post_init', when: 'Fill init=False fields' },
    { name: 'MISSING', slug: 'missing', when: 'The "no default" sentinel' },
    { name: 'ValueError', slug: 'valueerror', when: 'What a mutable default raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why do I get "ValueError: mutable default <class \'list\'> for field ... is not allowed: use default_factory"?',
      a: 'A plain default is stored once on the class and would be shared by every instance, so @dataclass refuses defaults whose type is unhashable (list, dict, set, ...). Write items: list = field(default_factory=list): the factory is called for each new instance.',
    },
    {
      q: 'What is default_factory in a dataclass?',
      a: 'A zero-argument callable that field() calls whenever an instance needs the default — list, dict, set, a class, or a lambda such as lambda: {"debug": False}. Pass the callable itself, not the result of calling it.',
    },
    {
      q: 'How do I exclude a field from the repr or from comparison?',
      a: 'field(repr=False) removes it from the generated __repr__; field(compare=False) removes it from __eq__ and from the order=True methods, and therefore from the generated hash too.',
    },
    {
      q: 'How do I add a field that is not an __init__ parameter?',
      a: 'Declare it with field(init=False) and give it a value with default=, default_factory=, or by assigning it in __post_init__. In a frozen class, assign it with object.__setattr__(self, name, value).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.field',
    meta:  'dataclasses.field',
  },

};
