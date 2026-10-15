// content/reference/python/stdlib/typing/namedtuple.js

export const meta = {
  slug:        'namedtuple',
  name:        'typing.NamedTuple',
  signature:   'class Name(NamedTuple): field: T [= default] · NamedTuple(typename, [(name, type), ...])',
  blurb:       'The typed, class-syntax version of collections.namedtuple: fields with annotations and defaults, plus your own methods. Instances are real tuples — immutable, indexable, unpackable.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.6+ (class syntax; generic 3.11+)',
  searchTerms: 'typing.NamedTuple NamedTuple typed namedtuple class syntax immutable record tuple subclass _fields _field_defaults _replace _asdict default values namedtuple vs dataclass generic namedtuple',
};

export const method = {
  slug:      'namedtuple',
  name:      'typing.NamedTuple',
  signature: 'class Name(NamedTuple): field: T [= default] · NamedTuple(typename, [(name, type), ...])',
  returns:   { type: 'type', desc: 'A tuple subclass, the same kind of class collections.namedtuple() makes, with __annotations__ for the field types.' },

  category:    'typing data shapes',
  version:     'Python 3.6+ (class syntax; generic 3.11+)',
  hasLiveDemo: true,

  subtitle: 'Write fields as annotations, defaults as assignments, and add methods freely. The annotations are not checked: Point("a") is accepted. Since the result is a tuple, it is immutable and compares equal to any tuple — including a different NamedTuple — with the same items.',

  covers: ['NamedTuple'],

  cheat: {
    commonCall: 'class Point(NamedTuple):\n    x: int\n    y: int = 0',
    returns:    'Point(1) → Point(x=1, y=0), a tuple',
    replaces:   "collections.namedtuple('Point', 'x y') when you want types and methods",
    watchOut:   'Point(1, 2) == Size(1, 2) is True — tuples compare by items only',
  },

  parameters: [
    { name: 'typename', type: 'str', required: true, default: null, desc: 'Functional syntax: the class name.' },
    { name: 'fields',   type: 'list[tuple[str, type]]', required: true, default: null, desc: 'Functional syntax: (name, type) pairs. Omitting it is deprecated since 3.13; pass [] for no fields.' },
  ],

  modes: [
    {
      id: 'create',
      label: 'build a Point',
      blurb: 'x and y are annotated int; pass anything. The fields keep whatever they are given.',
      params: [
        { name: 'x', type: 'any', hint: 'hint: int', input: 'auto' },
        { name: 'y', type: 'any', hint: 'hint: int', input: 'auto' },
      ],
      template: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\n    y: int = 0\nPoint({$x}, {$y})',
      cases: [
        { id: 'ints',  label: 'two ints',  values: { x: '3', y: '4' } },
        { id: 'mixed', label: 'str and float', values: { x: 'left', y: '2.5' } },
      ],
    },
  ],
  demoExplainer: 'The class only arranges the values into named positions; it never compares them with the int annotations, so a str and a float are stored as given. The repr lists each field as name=repr(value).',

  patterns: [
    {
      name: 'A small immutable record with behaviour',
      desc: 'Methods and properties work as in any class.',
      code: 'from typing import NamedTuple\n\nclass Point(NamedTuple):\n    x: float\n    y: float = 0.0\n\n    def distance(self) -> float:\n        return (self.x ** 2 + self.y ** 2) ** 0.5',
    },
    {
      name: 'Return several named values',
      desc: 'Callers can unpack it like a tuple or use the names.',
      code: 'from typing import NamedTuple\n\nclass MinMax(NamedTuple):\n    low: int\n    high: int\n\ndef bounds(xs: list[int]) -> MinMax:\n    return MinMax(min(xs), max(xs))',
    },
    {
      name: 'Functional syntax',
      desc: 'For field names that are generated at runtime.',
      code: 'from typing import NamedTuple\n\nRow = NamedTuple("Row", [("id", int), ("name", str)])',
    },
  ],

  examples: [
    { title: 'Fields, defaults, repr', code: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\n    y: int = 0\n(Point(1, 2), Point(5))', returns: '(Point(x=1, y=2), Point(x=5, y=0))' },
    { title: 'Types are not checked', code: "from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\n    y: int = 0\nPoint('a')", returns: "Point(x='a', y=0)" },
    { title: 'It is a tuple', code: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\n    y: int = 0\np = Point(1, 2)\n(p == (1, 2), isinstance(p, tuple), p[0])', returns: '(True, True, 1)' },
    { title: 'The namedtuple helpers', code: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\n    y: int = 0\n(Point._fields, Point._field_defaults, Point(1)._replace(y=9))', returns: "(('x', 'y'), {'y': 0}, Point(x=1, y=9))" },
    { title: 'Immutable', code: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\np = Point(1)\np.x = 5', returns: "AttributeError: can't set attribute" },
    { title: 'Defaults must come last', code: 'from typing import NamedTuple\nclass P(NamedTuple):\n    x: int = 0\n    y: int', returns: 'TypeError: Non-default namedtuple field y cannot follow default field x' },
    { title: 'Generic NamedTuple (3.11+)', code: 'from typing import NamedTuple\nclass Pair[T](NamedTuple):\n    a: T\n    b: T\nPair[int](1, 2)', returns: 'Pair(a=1, b=2)' },
  ],

  pitfalls: [
    {
      name: 'Two NamedTuple types with equal items are equal',
      desc: 'Equality and hashing are inherited from tuple, so the class is ignored. A dataclass compares the class too.',
      wrong: { label: 'NamedTuple', code: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\n    y: int\nclass Size(NamedTuple):\n    w: int\n    h: int\nPoint(1, 2) == Size(1, 2)', output: 'True' },
      fix:   { label: 'dataclass', code: 'from dataclasses import dataclass\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n@dataclass(frozen=True)\nclass Size:\n    w: int\n    h: int\nPoint(1, 2) == Size(1, 2)', output: 'False' },
    },
    {
      name: 'Adding fields in a subclass',
      desc: 'Fields are fixed when the NamedTuple class is created. A subclass annotation is just an annotation — it adds no field.',
      wrong: { label: 'subclass', code: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: int\nclass Point3D(Point):\n    z: int\nPoint3D(1, 2)', output: 'TypeError: Point.__new__() takes 2 positional arguments but 3 were given' },
      fix:   { label: 'one class', code: 'from typing import NamedTuple\nclass Point3D(NamedTuple):\n    x: int\n    z: int\nPoint3D(1, 2)', output: 'Point3D(x=1, z=2)' },
    },
  ],

  when: {
    use: [
      'Small immutable records that callers may also unpack: x, y = point',
      'Replacing tuples returned from functions with named fields',
      'Hashable keys made of several values',
    ],
    avoid: [
      'Mutable state → a dataclass',
      'Inheritance with extra fields → a dataclass',
      'Values that must not equal plain tuples → a dataclass (frozen=True for immutability)',
    ],
  },

  notes: {
    cpython:       'Lib/typing.py: NamedTuple is a function since 3.9 (usable as a base via __mro_entries__); NamedTupleMeta builds the class with collections.namedtuple() and copies annotations, defaults and methods onto it',
    'Field names': 'Same rules as collections.namedtuple: valid identifiers, no keywords, no leading underscore',
    'Deprecation': 'NamedTuple("NT", x=int) (keyword fields) and NamedTuple("NT") without fields are deprecated since 3.13 and will be disallowed in 3.15',
  },

  related: [
    { name: 'collections.namedtuple', slug: 'namedtuple', when: 'The untyped factory underneath', category: 'stdlib/collections' },
    { name: 'TypedDict', slug: 'typeddict', when: 'Typed dict-shaped data' },
    { name: 'tuple', slug: 'tuple', when: 'What instances are', category: 'functions' },
    { name: 'dataclasses module', slug: 'dataclasses', when: 'Mutable records, inheritance, class-aware equality', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between typing.NamedTuple and collections.namedtuple?',
      a: 'They produce the same kind of class. typing.NamedTuple uses class syntax, so you can annotate field types, give defaults inline and add methods and docstrings; collections.namedtuple takes the field names as strings.',
    },
    {
      q: 'NamedTuple or dataclass?',
      a: 'NamedTuple when the record should behave like a tuple (immutable, unpackable, indexable, equal to tuples). A dataclass when you need mutability, inheritance with extra fields, or equality that respects the class.',
    },
    {
      q: 'Does NamedTuple check the field types?',
      a: 'No. Annotations are recorded in __annotations__ for type checkers; the constructor accepts any values.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.NamedTuple',
    meta:  'typing.NamedTuple',
  },

};
