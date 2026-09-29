// content/reference/python/stdlib/collections/namedtuple.js

export const meta = {
  slug:        'namedtuple',
  name:        'collections.namedtuple',
  signature:   'collections.namedtuple(typename, field_names, *, rename=False, defaults=None, module=None)',
  blurb:       'Build a tuple subclass with named fields: readable repr, attribute access, and helpers _make, _asdict, _replace and _fields.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'namedtuple python collections.namedtuple named tuple record struct _make _asdict _replace _fields _field_defaults defaults rename field names valid identifiers typing.NamedTuple vs dataclass',
};

export const method = {
  slug:      'namedtuple',
  name:      'collections.namedtuple',
  signature: 'collections.namedtuple(typename, field_names, *, rename=False, defaults=None, module=None)',
  returns:   { type: 'type', desc: 'A new tuple subclass named typename.' },

  category:    'collections function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'A factory, not a class: namedtuple() returns a new class whose instances are ordinary immutable tuples with names attached. Field names must be valid, non-keyword identifiers that do not start with an underscore.',

  covers: ['namedtuple'],

  cheat: {
    commonCall: "Point = namedtuple('Point', 'x y')",
    returns:    "a class — Point(1, 2) → Point(x=1, y=2)",
    replaces:   'plain tuples indexed by position, small throwaway classes',
    watchOut:   'immutable: use p._replace(x=5), not p.x = 5',
  },

  parameters: [
    { name: 'typename',    type: 'str',              required: true,  default: null,    desc: 'Name of the new class (shown in its repr).' },
    { name: 'field_names', type: 'str | iterable[str]', required: true, default: null,  desc: "Field names as a list, or one string separated by spaces and/or commas: 'x y' or 'x, y'." },
    { name: 'rename',      type: 'bool',             required: false, default: 'False', desc: 'Replace invalid names with positional names _0, _1 … instead of raising ValueError.' },
    { name: 'defaults',    type: 'iterable | None',  required: false, default: 'None',  desc: 'Default values for the RIGHTMOST fields.' },
    { name: 'module',      type: 'str | None',       required: false, default: 'None',  desc: 'Sets __module__ of the new class (helps pickling).' },
  ],

  attributes: [
    { name: '_fields',         type: 'tuple[str, ...]', meaning: 'Field names, in order.' },
    { name: '_field_defaults', type: 'dict',            meaning: 'Field name → default value (3.7+).' },
    { name: '_make(iterable)', type: 'classmethod',     meaning: 'Build an instance from any iterable of exactly len(_fields) items.' },
    { name: '_asdict()',       type: 'method',          meaning: 'A new dict mapping field names to values (a plain dict since 3.8).' },
    { name: '_replace(**kw)',  type: 'method',          meaning: 'A new instance with some fields replaced; unknown names raise TypeError (3.13; ValueError before).' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'field names',
      blurb: 'Type the field names as one string. Invalid names raise ValueError with the reason.',
      params: [{ name: 'fields', type: 'str', hint: "e.g. 'x y' or 'x, y'", input: 'text' }],
      template: "from collections import namedtuple\nPoint = namedtuple('Point', {$fields})\nPoint._fields",
      cases: [
        { id: 'ok',      label: 'x y z',      values: { fields: 'x, y z' } },
        { id: 'kw',      label: 'keyword',    values: { fields: 'x class' } },
        { id: 'under',   label: 'underscore', values: { fields: 'x _y' } },
        { id: 'dup',     label: 'duplicate',  values: { fields: 'x y x' } },
        { id: 'digit',   label: 'digit',      values: { fields: '1st 2nd' } },
      ],
    },
    {
      id: 'rename',
      label: 'rename=True',
      blurb: 'With rename=True invalid names become _0, _1 … (by position) instead of errors.',
      params: [{ name: 'fields', type: 'str', hint: 'field names', input: 'text' }],
      template: "from collections import namedtuple\nnamedtuple('Row', {$fields}, rename=True)._fields",
      cases: [
        { id: 'messy', label: 'messy header', values: { fields: 'id class _hidden id 2x' } },
        { id: 'clean', label: 'all valid',    values: { fields: 'id name' } },
      ],
    },
    {
      id: 'make',
      label: '_make & _asdict',
      blurb: 'Build an instance from a list, then convert it to a dict.',
      params: [
        { name: 'fields', type: 'str',       hint: 'field names',        input: 'text' },
        { name: 'values', type: 'list[str]', hint: 'comma-separated values', input: 'csv' },
      ],
      template: "from collections import namedtuple\nPoint = namedtuple('Point', {$fields})\np = Point._make({$values})\n(p, p._asdict())",
      cases: [
        { id: 'ok',   label: 'matching',   values: { fields: 'x y', values: '3, 4' } },
        { id: 'more', label: 'too many',   values: { fields: 'x y', values: '1, 2, 3' } },
      ],
    },
  ],
  demoExplainer: 'Soft keywords such as match, case and type are allowed as field names; only hard keywords like class are rejected. rename=True replaces each bad name by an underscore plus its position, so the second "id" becomes _3 because it is the fourth field. _make needs exactly as many values as there are fields: TypeError: Expected 2 arguments, got 3.',

  patterns: [
    {
      name: 'Readable function results',
      desc: 'Return a namedtuple instead of a bare tuple; callers can still unpack it.',
      code: "from collections import namedtuple\nStats = namedtuple('Stats', 'mean median')\ndef stats(xs):\n    return Stats(sum(xs) / len(xs), sorted(xs)[len(xs) // 2])",
    },
    {
      name: 'Rows from CSV',
      desc: '_make turns each row list into a record; rename=True tolerates odd headers.',
      code: "import csv\nfrom collections import namedtuple\nwith open('data.csv', newline='') as f:\n    reader = csv.reader(f)\n    Row = namedtuple('Row', next(reader), rename=True)\n    rows = [Row._make(r) for r in reader]",
    },
    {
      name: 'Defaults for trailing fields',
      desc: 'defaults apply to the rightmost fields.',
      code: "from collections import namedtuple\nAccount = namedtuple('Account', 'owner balance', defaults=[0])",
    },
    {
      name: 'Typed alternative',
      desc: 'typing.NamedTuple builds the same kind of class with annotations.',
      code: 'from typing import NamedTuple\nclass Point(NamedTuple):\n    x: float\n    y: float = 0.0',
    },
  ],

  examples: [
    { title: 'Define and create',            code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\nPoint(3, y=4)", returns: 'Point(x=3, y=4)' },
    { title: 'Still a tuple',                code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\np = Point(3, 4)\n(p.x, p[1], tuple(p), isinstance(p, tuple))", returns: '(3, 4, (3, 4), True)' },
    { title: '_asdict',                      code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\nPoint(3, 4)._asdict()", returns: "{'x': 3, 'y': 4}" },
    { title: '_replace returns a new instance', code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\nPoint(3, 4)._replace(x=10)", returns: 'Point(x=10, y=4)' },
    { title: 'Defaults fill from the right', code: "from collections import namedtuple\nAccount = namedtuple('Account', 'owner balance', defaults=[0])\n(Account('ada'), Account._field_defaults)", returns: "(Account(owner='ada', balance=0), {'balance': 0})" },
    { title: 'Missing argument',             code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\nPoint(1)", returns: "TypeError: Point.__new__() missing 1 required positional argument: 'y'" },
    { title: 'Keyword field name',           code: "from collections import namedtuple\nnamedtuple('Row', 'id class')", returns: "ValueError: Type names and field names cannot be a keyword: 'class'" },
  ],

  pitfalls: [
    {
      name: 'Assigning to a field',
      desc: 'Instances are immutable tuples. _replace builds a modified copy.',
      wrong: { label: 'p.x = 5',        code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\np = Point(1, 2)\np.x = 5", output: "AttributeError: can't set attribute" },
      fix:   { label: 'p._replace(x=5)', code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\np = Point(1, 2)\np._replace(x=5)", output: 'Point(x=5, y=2)' },
    },
    {
      name: 'Mutable default values are shared',
      desc: 'A default list is one object used by every instance.',
      wrong: { label: 'defaults=[[]]',   code: "from collections import namedtuple\nBag = namedtuple('Bag', 'items', defaults=[[]])\na, b = Bag(), Bag()\na.items.append(1)\nb.items", output: '[1]' },
      fix:   { label: 'pass a fresh list', code: "from collections import namedtuple\nBag = namedtuple('Bag', 'items')\na, b = Bag([]), Bag([])\na.items.append(1)\nb.items", output: '[]' },
    },
    {
      name: 'Unknown field in _replace',
      desc: 'Python 3.13 raises TypeError here (earlier versions raised ValueError).',
      wrong: { label: '_replace(z=...)', code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\nPoint(1, 2)._replace(z=3)", output: "TypeError: Got unexpected field names: ['z']" },
      fix:   { label: 'check _fields',   code: "from collections import namedtuple\nPoint = namedtuple('Point', 'x y')\n'z' in Point._fields", output: 'False' },
    },
  ],

  when: {
    use: [
      'Small immutable records and function return values',
      'Tuples that are already passed around, made self-documenting',
      'Rows from CSV or database cursors',
    ],
    avoid: [
      'Mutable records, validation, methods → dataclasses',
      'Type annotations on the fields → typing.NamedTuple',
      'A mutable attribute bag → types.SimpleNamespace',
    ],
  },

  notes: {
    cpython:    'Lib/collections/__init__.py — namedtuple builds the class at run time (its __new__ is created with eval of a generated lambda) and adds a property per field',
    'Versions': 'rename 3.1; module 3.6; defaults and _field_defaults 3.7; _asdict returns a plain dict since 3.8; _replace raises TypeError for bad names since 3.13 (docs.python.org)',
    'Field names': 'Must be identifiers, not keywords, and not start with an underscore; soft keywords such as match, case and type are allowed',
  },

  related: [
    { name: 'tuple',       slug: 'tuple',      when: 'The base class', category: 'functions' },
    { name: 'class',       slug: 'class',      when: 'Write a full class instead', category: 'keywords' },
    { name: 'dict',        slug: 'dict',       when: 'What _asdict returns', category: 'functions' },
    { name: 'ValueError',  slug: 'valueerror', when: 'Invalid field names', category: 'exceptions' },
    { name: 'TypeError',   slug: 'typeerror',  when: 'Wrong number of values', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is a namedtuple in Python?',
      a: "A tuple subclass created by collections.namedtuple('Name', 'field1 field2'). Instances behave like normal tuples (indexing, unpacking, immutability) but also have named attributes and a readable repr such as Name(field1=1, field2=2).",
    },
    {
      q: 'namedtuple vs dataclass — which should I use?',
      a: 'namedtuple for small immutable records that should also act as tuples (unpacking, indexing, hashing). dataclass for mutable objects, default factories, validation and methods; frozen=True gives immutability without being a tuple.',
    },
    {
      q: 'How do I change a value in a namedtuple?',
      a: 'You cannot change it in place. p._replace(field=new_value) returns a new instance with that field replaced.',
    },
    {
      q: 'Why does namedtuple reject my field name?',
      a: "Field names must be valid identifiers, must not be Python keywords (class, def, …) and must not start with an underscore. Pass rename=True to replace invalid names with _0, _1 … automatically.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.namedtuple',
    meta:  'collections.namedtuple',
  },
};
