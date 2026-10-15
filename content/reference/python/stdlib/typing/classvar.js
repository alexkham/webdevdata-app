// content/reference/python/stdlib/typing/classvar.js

export const meta = {
  slug:        'classvar',
  name:        'typing.ClassVar',
  signature:   'ClassVar[T]',
  blurb:       'Marks a class-body annotation as a class variable — shared by all instances, not a per-instance attribute. dataclasses honour it at runtime; everything else is up to the type checker.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.5.3+',
  searchTerms: 'typing.ClassVar ClassVar class variable vs instance variable class attribute annotation dataclass field excluded shared counter registry pep 526 static attribute type hint',
};

export const method = {
  slug:      'classvar',
  name:      'typing.ClassVar',
  signature: 'ClassVar[T]',
  returns:   { type: 'typing._GenericAlias', desc: 'typing.ClassVar[T]; get_origin() gives typing.ClassVar.' },

  category:    'typing special form',
  version:     'Python 3.5.3+',
  hasLiveDemo: true,

  subtitle: 'In a class body, x: int declares an instance attribute and x: ClassVar[int] a class attribute. Python itself treats both the same. Where it does matter at runtime is dataclasses: ClassVar annotations are left out of the generated fields.',

  covers: ['ClassVar'],

  cheat: {
    commonCall: 'class Starship:\n    stats: ClassVar[dict[str, int]] = {}',
    returns:    'typing.ClassVar[dict[str, int]] in get_type_hints(Starship)',
    replaces:   'Comments such as "# shared by all instances"',
    watchOut:   'Only valid at class level; instance assignment is still possible at runtime',
  },

  parameters: [
    { name: 'T', type: 'type', required: false, default: null, desc: 'The type of the class attribute. Bare ClassVar (no brackets) leaves the type to inference.' },
  ],

  modes: [
    {
      id: 'inClass',
      label: 'in a class',
      blurb: 'The hint annotates x in a class body. get_type_hints() accepts ClassVar here — but not wrapped inside another type.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\nclass Config:\n    x: {$hint}\nget_type_hints(Config, globals())['x']",
      cases: [
        { id: 'basic', label: 'ClassVar[int]',        values: { hint: 'ClassVar[int]' } },
        { id: 'bare',  label: 'ClassVar',             values: { hint: 'ClassVar' } },
        { id: 'two',   label: 'ClassVar[int, str]',   values: { hint: 'ClassVar[int, str]' } },
        { id: 'final', label: 'ClassVar[Final[int]]', values: { hint: 'ClassVar[Final[int]]' } },
        { id: 'inner', label: 'Optional[ClassVar[int]]', values: { hint: 'Optional[ClassVar[int]]' } },
      ],
    },
    {
      id: 'parameter',
      label: 'as a parameter',
      blurb: 'The same hint on a function parameter. As a string annotation, it is rejected when evaluated.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'cv',  label: 'ClassVar[int]', values: { hint: 'ClassVar[int]' } },
        { id: 'int', label: 'int',           values: { hint: 'int' } },
      ],
    },
  ],
  demoExplainer: 'Because the demo writes the hint as a string, get_type_hints() validates it while evaluating: a class-body annotation may be ClassVar (bare or with one type; nesting with Final is allowed since 3.13), but ClassVar inside Optional[...] or on a function parameter raises "typing.ClassVar[int] is not valid as type argument". An unquoted ClassVar[int] on a parameter is not validated at all — get_type_hints() returns it unchanged — so this check only happens for string annotations (and under from __future__ import annotations).',

  patterns: [
    {
      name: 'A counter shared by all instances',
      desc: 'Update it through the class, never through self.',
      code: 'from typing import ClassVar\n\nclass Session:\n    opened: ClassVar[int] = 0\n\n    def __init__(self) -> None:\n        Session.opened += 1',
    },
    {
      name: 'Class-level constants in a dataclass',
      desc: 'ClassVar keeps them out of __init__, __repr__ and __eq__.',
      code: 'from dataclasses import dataclass\nfrom typing import ClassVar\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n    DIMENSIONS: ClassVar[int] = 2',
    },
    {
      name: 'A registry filled by subclasses',
      desc: 'A mutable class attribute on purpose — marked as such.',
      code: 'from typing import ClassVar\n\nclass Plugin:\n    registry: ClassVar[dict[str, type["Plugin"]]] = {}\n\n    def __init_subclass__(cls) -> None:\n        Plugin.registry[cls.__name__] = cls',
    },
  ],

  examples: [
    { title: 'get_type_hints sees the marker', code: 'from typing import ClassVar, get_type_hints\nclass Starship:\n    stats: ClassVar[dict[str, int]] = {}\n    damage: int = 10\nget_type_hints(Starship)', returns: "{'stats': typing.ClassVar[dict[str, int]], 'damage': <class 'int'>}" },
    { title: 'dataclasses leave ClassVar out', code: 'from dataclasses import dataclass, fields\nfrom typing import ClassVar\n@dataclass\nclass P:\n    x: int\n    total: ClassVar[int] = 0\n[f.name for f in fields(P)]', returns: "['x']" },
    { title: 'Without ClassVar it becomes a field', code: 'from dataclasses import dataclass, fields\n@dataclass\nclass P:\n    x: int\n    total: int = 0\n[f.name for f in fields(P)]', returns: "['x', 'total']" },
    { title: 'Instances can still shadow it', code: "from typing import ClassVar\nclass Starship:\n    stats: ClassVar[dict[str, int]] = {}\ns = Starship()\ns.stats = {'hp': 1}\n(Starship.stats, s.stats)", returns: "({}, {'hp': 1})" },
    { title: 'Origin and argument', code: 'from typing import ClassVar, get_args, get_origin\n(get_origin(ClassVar[int]), get_args(ClassVar[int]))', returns: "(typing.ClassVar, (<class 'int'>,))" },
    { title: 'Exactly one type', code: 'from typing import ClassVar\nClassVar[int, str]', returns: "TypeError: typing.ClassVar accepts only single type. Got (<class 'int'>, <class 'str'>)." },
    { title: 'Not usable with isinstance', code: 'from typing import ClassVar\nisinstance(1, ClassVar)', returns: 'TypeError: typing.ClassVar cannot be used with isinstance()' },
  ],

  pitfalls: [
    {
      name: 'A mutable default in a dataclass',
      desc: 'A list default would be shared by all instances, so dataclasses refuse it. If sharing is what you want, say so with ClassVar.',
      wrong: { label: 'registry: list = []', code: 'from dataclasses import dataclass\n@dataclass\nclass Plugin:\n    name: str\n    registry: list = []', output: "ValueError: mutable default <class 'list'> for field registry is not allowed: use default_factory" },
      fix:   { label: 'ClassVar[list]', code: 'from dataclasses import dataclass\nfrom typing import ClassVar\n@dataclass\nclass Plugin:\n    name: str\n    registry: ClassVar[list] = []\nPlugin("a")', output: "Plugin(name='a')" },
    },
    {
      name: 'Assigning a class variable through self',
      desc: 'self.count = ... creates an instance attribute and leaves the class value alone — ClassVar does not prevent it at runtime (a type checker reports it).',
      wrong: { label: 'self.count += 1', code: 'from typing import ClassVar\nclass Counter:\n    count: ClassVar[int] = 0\n    def hit(self):\n        self.count += 1\nc = Counter()\nc.hit()\n(Counter.count, c.count)', output: '(0, 1)' },
      fix:   { label: 'Counter.count += 1', code: 'from typing import ClassVar\nclass Counter:\n    count: ClassVar[int] = 0\n    def hit(self):\n        Counter.count += 1\nc = Counter()\nc.hit()\n(Counter.count, c.count)', output: '(1, 1)' },
    },
  ],

  when: {
    use: [
      'Class-level constants and counters in classes whose other annotations are instance attributes',
      'Dataclasses: attributes that must not become fields',
    ],
    avoid: [
      'Function parameters, return types, module variables → ClassVar is only meaningful in a class body',
      'Constants that must never change → Final (or both: ClassVar[Final[int]], 3.13+)',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py (ClassVar special form); Lib/dataclasses.py recognises typing.ClassVar annotations, including string annotations that start with ClassVar',
    'Runtime':    'No effect on attribute access or assignment; only stored in __annotations__',
    '3.13':       'ClassVar and Final can be nested in each other',
  },

  related: [
    { name: 'Final / @final', slug: 'final', when: 'Names that must not be reassigned' },
    { name: 'get_type_hints', slug: 'get_type_hints', when: 'Reading class annotations' },
    { name: 'dataclasses module', slug: 'dataclasses', when: 'The runtime consumer of ClassVar', category: 'stdlib' },
    { name: 'class', slug: 'class', when: 'Class bodies and attributes', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does ClassVar do in Python?',
      a: 'It tells type checkers (and dataclasses) that an annotated name in a class body is a class variable shared by all instances, not an instance attribute. The interpreter does not enforce anything.',
    },
    {
      q: 'Why is my dataclass field missing?',
      a: 'Annotations wrapped in ClassVar are not fields: they get no __init__ parameter and do not appear in repr or comparisons. Remove ClassVar if the value should be per instance.',
    },
    {
      q: 'Can I use ClassVar outside a class?',
      a: 'No. It is only valid for class-body annotations. When get_type_hints() evaluates a string annotation using ClassVar on a function parameter, it raises "typing.ClassVar[...] is not valid as type argument".',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.ClassVar',
    meta:  'typing.ClassVar',
  },

};
