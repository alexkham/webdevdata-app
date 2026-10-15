// content/reference/python/stdlib/dataclasses/initvar.js

export const meta = {
  slug:        'initvar',
  name:        'dataclasses.InitVar',
  signature:   'dataclasses.InitVar[T]',
  blurb:       'An annotation for init-only pseudo-fields: an __init__ parameter that is passed to __post_init__ but never stored, shown or compared.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'InitVar dataclass init only field python dataclasses.InitVar InitVar.type __post_init__ parameter pseudo-field not stored not in fields password derived field init-only variable cannot have a default factory',
};

export const method = {
  slug:      'initvar',
  name:      'dataclasses.InitVar',
  signature: 'dataclasses.InitVar[T]',
  returns:   { type: 'InitVar', desc: 'InitVar[T] is an InitVar instance whose .type is T; used only as an annotation.' },

  category:    'dataclasses class',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'Annotate a name with InitVar[T] and it becomes a parameter of the generated __init__ that is handed to __post_init__, in definition order, and then forgotten: not an attribute, not in the repr, not in fields(), asdict() or ==.',

  covers: ['InitVar', 'InitVar.type'],

  cheat: {
    commonCall: 'password: InitVar[str]',
    returns:    '__post_init__(self, password) receives it',
    replaces:   'a custom __init__ that takes extra arguments',
    watchOut:   'with a default, obj.name reads the CLASS attribute, not what you passed',
  },

  attributes: [
    { name: 'type', type: 'object', meaning: 'The T of InitVar[T] — InitVar[int].type is int. Read it from Class.__dataclass_fields__[name].type, since fields() skips InitVars.' },
  ],

  modes: [
    {
      id: 'convert',
      label: 'convert on input',
      blurb: 'value and unit are InitVars. __post_init__ turns them into the one real field, celsius.',
      params: [
        { name: 'value', type: 'float', hint: 'temperature',    input: 'float' },
        { name: 'unit',  type: 'str',   hint: "'C' or 'F'",     input: 'text' },
      ],
      template: "from dataclasses import dataclass, field, fields, InitVar\n\n@dataclass\nclass Temperature:\n    celsius: float = field(init=False)\n    value: InitVar[float]\n    unit: InitVar[str] = 'C'\n\n    def __post_init__(self, value, unit):\n        if unit == 'C':\n            self.celsius = value\n        elif unit == 'F':\n            self.celsius = (value - 32) * 5 / 9\n        else:\n            raise ValueError(f'unknown unit {unit!r}')\n\nt = Temperature({$value}, {$unit})\n(t, [f.name for f in fields(t)])",
      cases: [
        { id: 'body',   label: '98.6 F', values: { value: '98.6', unit: 'F' } },
        { id: 'freeze', label: '0 C',    values: { value: '0', unit: 'C' } },
        { id: 'minus',  label: '-40 F',  values: { value: '-40', unit: 'F' } },
        { id: 'kelvin', label: 'K',      values: { value: '300', unit: 'K' } },
      ],
    },
    {
      id: 'secret',
      label: 'keep a secret out',
      blurb: 'The password is used once and dropped; only its length is kept.',
      params: [
        { name: 'name',     type: 'str', hint: 'user name', input: 'text' },
        { name: 'password', type: 'str', hint: 'password',  input: 'text' },
      ],
      template: "from dataclasses import dataclass, field, InitVar\n\n@dataclass\nclass User:\n    name: str\n    password: InitVar[str]\n    password_length: int = field(init=False)\n\n    def __post_init__(self, password):\n        self.password_length = len(password)\n\nu = User({$name}, {$password})\n(u, hasattr(u, 'password'))",
      cases: [
        { id: 'ann',   label: 'hunter2',  values: { name: 'ann', password: 'hunter2' } },
        { id: 'emoji', label: 'emoji',    values: { name: 'bob', password: 'pässwörd😀' } },
      ],
    },
  ],
  demoExplainer: 'In convert on input, 98.6 °F gives exactly 37.0 and -40 °F gives -40.0; "K" reaches the else branch and raises the ValueError from __post_init__. fields() lists only celsius. In keep a secret out, len() counts characters, so the emoji counts once; hasattr(u, "password") is False because the InitVar was never stored.',

  patterns: [
    {
      name: 'Derived field from an init-only value',
      desc: 'Pair InitVar with field(init=False).',
      code: 'from dataclasses import dataclass, field, InitVar\n\n@dataclass\nclass Account:\n    user: str\n    password: InitVar[str]\n    password_hash: str = field(init=False, repr=False)\n\n    def __post_init__(self, password):\n        self.password_hash = hash_password(password)',
    },
    {
      name: 'Optional context for initialisation',
      desc: 'Pass a helper object to __post_init__ without storing it.',
      code: 'from dataclasses import dataclass, InitVar\n\n@dataclass\nclass Order:\n    id: int\n    total: float | None = None\n    db: InitVar[object | None] = None\n\n    def __post_init__(self, db):\n        if self.total is None and db is not None:\n            self.total = db.lookup_total(self.id)',
    },
  ],

  examples: [
    { title: 'InitVar[T] and its .type', code: 'from dataclasses import InitVar\nInitVar[int], InitVar[int].type, InitVar(int)', returns: "(dataclasses.InitVar[int], <class 'int'>, dataclasses.InitVar[int])" },
    { title: 'Any type inside', code: 'from dataclasses import InitVar\nInitVar[list[int]], InitVar[int | None]', returns: '(dataclasses.InitVar[list[int]], dataclasses.InitVar[int | None])' },
    { title: 'Passed to __post_init__, not stored', code: "from dataclasses import dataclass, field, fields, InitVar\n\n@dataclass\nclass C:\n    i: int\n    j: int | None = None\n    database: InitVar[dict | None] = None\n\n    def __post_init__(self, database):\n        if self.j is None and database is not None:\n            self.j = database['j']\n\nC(10, database={'j': 3}), [f.name for f in fields(C)]", returns: "(C(i=10, j=3), ['i', 'j'])" },
    { title: 'Not an attribute afterwards', code: "from dataclasses import dataclass, InitVar\n\n@dataclass\nclass C:\n    x: int\n    secret: InitVar[str]\n\nc = C(1, 'pw')\nc.secret", returns: "AttributeError: 'C' object has no attribute 'secret'" },
    { title: 'But a parameter and a match arg', code: 'from dataclasses import dataclass, InitVar\n\n@dataclass\nclass C:\n    x: int\n    scale: InitVar[int]\n\nC.__match_args__, C.__doc__', returns: "(('x', 'scale'), 'C(x: int, scale: dataclasses.InitVar[int])')" },
    { title: '.type through __dataclass_fields__', code: 'from dataclasses import dataclass, InitVar\n\n@dataclass\nclass C:\n    x: int\n    scale: InitVar[int]\n\nC.__dataclass_fields__[\'scale\'].type, C.__dataclass_fields__[\'scale\'].type.type', returns: "(dataclasses.InitVar[int], <class 'int'>)" },
    { title: 'No default_factory', code: 'from dataclasses import dataclass, InitVar, field\n\n@dataclass\nclass C:\n    x: int\n    scale: InitVar[int] = field(default_factory=int)', returns: 'TypeError: field scale cannot have a default factory' },
    { title: 'Left out of asdict', code: 'from dataclasses import dataclass, InitVar, asdict\n\n@dataclass\nclass C:\n    x: int\n    scale: InitVar[int] = 1\n\nasdict(C(5, 3))', returns: "{'x': 5}" },
  ],

  pitfalls: [
    {
      name: 'Reading an InitVar that has a default',
      desc: 'The default stays behind as a class attribute, so obj.name quietly returns the DEFAULT — not the value passed to __init__. Store what you need in a real field.',
      wrong: { label: 'c.secret', code: "from dataclasses import dataclass, InitVar\n\n@dataclass\nclass C:\n    x: int\n    secret: InitVar[str] = 'default'\n\nC(1, 'pw').secret", output: "'default'" },
      fix:   { label: 'store it', code: "from dataclasses import dataclass, field, InitVar\n\n@dataclass\nclass C:\n    x: int\n    secret: InitVar[str] = 'default'\n    secret_length: int = field(init=False)\n\n    def __post_init__(self, secret):\n        self.secret_length = len(secret)\n\nC(1, 'pw').secret_length", output: '2' },
    },
    {
      name: '__post_init__ without the InitVar parameters',
      desc: 'Every InitVar is passed positionally, in definition order. A __post_init__(self) cannot take them.',
      wrong: { label: '(self)', code: 'from dataclasses import dataclass, InitVar\n\n@dataclass\nclass C:\n    x: int\n    scale: InitVar[int]\n\n    def __post_init__(self):\n        pass\n\nC(1, 2)', output: 'TypeError: C.__post_init__() takes 1 positional argument but 2 were given' },
      fix:   { label: '(self, scale)', code: 'from dataclasses import dataclass, InitVar\n\n@dataclass\nclass C:\n    x: int\n    scale: InitVar[int]\n\n    def __post_init__(self, scale):\n        self.x *= scale\n\nC(2, 10)', output: 'C(x=20)' },
    },
  ],

  when: {
    use: [
      'Inputs needed only to compute other fields: passwords, raw strings to parse, unit conversions',
      'Context objects (a database, a cache) that help initialisation but must not be stored',
    ],
    avoid: [
      'Values you need later — make them fields, with repr=False or compare=False if necessary',
      'Without __post_init__ — then nothing ever receives the value',
    ],
  },

  notes: {
    cpython:      'Lib/dataclasses.py — class InitVar with __slots__ = ("type",); __class_getitem__ returns InitVar(type). _process_class recognises the annotation with a_type is InitVar or type(a_type) is InitVar',
    'Bare InitVar': 'flag: InitVar without [T] also works: the field is still init-only',
    'Equality':   'InitVar defines no __eq__: InitVar[int] == InitVar[int] is False',
  },

  related: [
    { name: '__post_init__', slug: 'post_init', when: 'Where InitVars arrive' },
    { name: 'field(init=False)', slug: 'field', when: 'The stored field an InitVar usually feeds' },
    { name: 'replace()', slug: 'replace', when: 'InitVars without defaults must be passed again' },
    { name: 'fields()', slug: 'fields', when: 'Skips InitVars' },
  ],

  faq: [
    {
      q: 'What is InitVar in a Python dataclass?',
      a: 'An annotation that makes a name an __init__ parameter only. The generated __init__ accepts it and passes it to __post_init__; it is not set on the instance and does not appear in the repr, fields(), asdict() or comparisons.',
    },
    {
      q: 'Why can I read my InitVar after __init__ when it has a default?',
      a: 'Because the default is left on the class as a class attribute. obj.name finds that class attribute — always the default, never the value you passed. Without a default the same read raises AttributeError.',
    },
    {
      q: 'Can an InitVar have a default_factory?',
      a: 'No: "TypeError: field scale cannot have a default factory". A plain default (scale: InitVar[int] = 1) is allowed.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.InitVar',
    meta:  'dataclasses.InitVar',
  },

};
