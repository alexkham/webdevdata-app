// content/reference/python/stdlib/dataclasses/make_dataclass.js

export const meta = {
  slug:        'make_dataclass',
  name:        'dataclasses.make_dataclass',
  signature:   'dataclasses.make_dataclass(cls_name, fields, *, bases=(), namespace=None, init=True, repr=True, eq=True, order=False, unsafe_hash=False, frozen=False, match_args=True, kw_only=False, slots=False, weakref_slot=False, module=None)',
  blurb:       'Create a dataclass at runtime from a name and a list of fields — the functional form of a class statement with @dataclass.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+ (module 3.12)',
  searchTerms: 'make_dataclass python dataclasses.make_dataclass dynamic dataclass create dataclass at runtime from list of field names namespace bases typing.Any Field names must be valid identifiers must not be keywords Field name duplicated Invalid field columns rows',
};

export const method = {
  slug:      'make_dataclass',
  name:      'dataclasses.make_dataclass',
  signature: 'dataclasses.make_dataclass(cls_name, fields, *, bases=(), namespace=None, init=True, repr=True, eq=True, order=False, unsafe_hash=False, frozen=False, match_args=True, kw_only=False, slots=False, weakref_slot=False, module=None)',
  returns:   { type: 'type', desc: 'A new dataclass, exactly as if the class statement had been written by hand and decorated.' },

  category:    'dataclasses function',
  version:     'Python 3.7+ (module 3.12)',
  hasLiveDemo: true,

  subtitle: 'Useful when the field names are data: CSV headers, database columns, configuration. Each item of fields is a name, a (name, type) pair or a (name, type, default) triple; names are checked before the class is built.',

  covers: ['make_dataclass'],

  cheat: {
    commonCall: "Row = make_dataclass('Row', ['id', 'name'])",
    returns:    "a class — Row(1, 'ann') → Row(id=1, name='ann')",
    replaces:   'type() plus __annotations__ plus @dataclass by hand',
    watchOut:   "a plain string is iterated character by character — pass a list",
  },

  parameters: [
    { name: 'cls_name',  type: 'str',      required: true,  default: null,   desc: 'The class name, used in the repr. Not checked: any string works.' },
    { name: 'fields',    type: 'iterable', required: true,  default: null,   desc: "Items 'name' (type typing.Any), ('name', type), or ('name', type, default_or_Field). Names must be identifiers, not keywords, not repeated." },
    { name: 'bases',     type: 'tuple',    required: false, default: '()',   desc: 'Base classes; fields of dataclass bases come first, as with inheritance.' },
    { name: 'namespace', type: 'dict | None', required: false, default: 'None', desc: 'Extra class attributes — methods, class variables.' },
    { name: 'init … weakref_slot', type: 'bool', required: false, default: 'as @dataclass', desc: 'Passed straight to @dataclass: init, repr, eq, order, unsafe_hash, frozen, match_args, kw_only, slots, weakref_slot.' },
    { name: 'module',    type: 'str | None', required: false, default: 'None', desc: "Value for __module__; by default the caller's module, so pickling works. (3.12+)" },
  ],

  modes: [
    {
      id: 'names',
      label: 'from names',
      blurb: 'Field names as data. Each instance gets 0, 1, 2 … as values; invalid, keyword or repeated names fail before the class exists.',
      params: [{ name: 'names', type: 'list[str]', hint: 'comma-separated field names', input: 'csv' }],
      template: "from dataclasses import make_dataclass, fields\n\nRow = make_dataclass('Row', {$names})\nRow(*range(len(fields(Row))))",
      cases: [
        { id: 'cols',  label: 'id, name, email', values: { names: 'id, name, email' } },
        { id: 'digit', label: '1st',             values: { names: 'id, 1st' } },
        { id: 'kw',    label: 'class',           values: { names: 'name, class' } },
        { id: 'dup',   label: 'duplicate',       values: { names: 'x, y, x' } },
        { id: 'soft',  label: 'match, _',        values: { names: 'match, _' } },
      ],
    },
    {
      id: 'options',
      label: 'types & defaults',
      blurb: 'Triples carry a default; decorator options are keyword arguments. __doc__ shows the generated signature.',
      params: [
        { name: 'x',         type: 'float', hint: 'x value',     input: 'float' },
        { name: 'y_default', type: 'float', hint: 'default of y', input: 'float' },
      ],
      template: "from dataclasses import make_dataclass\n\nPoint = make_dataclass('Point', [('x', float), ('y', float, {$y_default})], frozen=True)\n(Point({$x}), Point.__doc__)",
      cases: [
        { id: 'zero', label: 'y = 0.0',  values: { x: '1.5', y_default: '0' } },
        { id: 'neg',  label: 'y = -2.5', values: { x: '3', y_default: '-2.5' } },
      ],
    },
  ],
  demoExplainer: 'In from names, "1st" fails with "Field names must be valid identifiers: \'1st\'" and "class" with "Field names must not be keywords: \'class\'"; soft keywords such as match and _ are accepted because they are not in keyword.kwlist. A repeated name raises "Field name duplicated". In types & defaults, the float default appears in the signature that __doc__ shows.',

  patterns: [
    {
      name: 'Records from CSV headers',
      desc: 'One class per file, built from its first row.',
      code: "import csv\nfrom dataclasses import make_dataclass\n\nwith open('data.csv', newline='') as f:\n    reader = csv.reader(f)\n    Row = make_dataclass('Row', next(reader))\n    rows = [Row(*values) for values in reader]",
    },
    {
      name: 'Types, defaults and Field options',
      desc: 'The third item can be a plain default or a field(...) call.',
      code: "from dataclasses import make_dataclass, field\n\nUser = make_dataclass('User', [('name', str), ('tags', list, field(default_factory=list))], kw_only=True)",
    },
    {
      name: 'Methods through namespace',
      desc: 'namespace becomes the class body.',
      code: "from dataclasses import make_dataclass\n\nPoint = make_dataclass('Point', [('x', int), ('y', int)], namespace={'norm1': lambda self: abs(self.x) + abs(self.y)})",
    },
  ],

  examples: [
    { title: 'Name, pair and triple', code: "from dataclasses import make_dataclass, field\n\nC = make_dataclass('C', [('x', int), 'y', ('z', int, field(default=5))], namespace={'add_one': lambda self: self.x + 1})\nC(1, 2), C(1, 2).add_one(), C.__doc__", returns: "(C(x=1, y=2, z=5), 2, \"C(x: int, y: 'typing.Any', z: int = 5)\")" },
    { title: 'Options as keywords', code: "from dataclasses import make_dataclass\n\nRow = make_dataclass('Row', ['a', 'b'], frozen=True, order=True)\nsorted([Row(2, 1), Row(1, 9)])", returns: '[Row(a=1, b=9), Row(a=2, b=1)]' },
    { title: 'Bare names are typing.Any', code: "from dataclasses import make_dataclass\n\nRow = make_dataclass('Row', ['a', 'b'])\nRow(1, 2), Row.__module__, Row.__annotations__", returns: "(Row(a=1, b=2), '__main__', {'a': 'typing.Any', 'b': 'typing.Any'})" },
    { title: 'Inherit from a dataclass', code: "from dataclasses import make_dataclass, dataclass\n\n@dataclass\nclass Base:\n    id: int\n\nRow = make_dataclass('Row', [('name', str)], bases=(Base,))\nRow(1, 'ann')", returns: "Row(id=1, name='ann')" },
    { title: 'module= sets __module__', code: "from dataclasses import make_dataclass\n\nRow = make_dataclass('Row', [('a', int)], module='mymodule')\nRow.__module__, Row", returns: "('mymodule', <class 'mymodule.Row'>)" },
    { title: 'Keywords are refused', code: "from dataclasses import make_dataclass\nmake_dataclass('Row', ['a', 'class'])", returns: "TypeError: Field names must not be keywords: 'class'" },
    { title: 'Soft keywords are fine', code: "from dataclasses import make_dataclass\nmake_dataclass('Row', ['a', 'match', '_'])(1, 2, 3)", returns: 'Row(a=1, match=2, _=3)' },
  ],

  pitfalls: [
    {
      name: 'A space-separated string, namedtuple style',
      desc: "namedtuple accepts 'a b'; make_dataclass iterates whatever it gets, so a string becomes one field per character — and the space is not an identifier.",
      wrong: { label: "'a b'", code: "from dataclasses import make_dataclass\nmake_dataclass('Row', 'a b')", output: "TypeError: Field names must be valid identifiers: ' '" },
      fix:   { label: "'a b'.split()", code: "from dataclasses import make_dataclass\n\nRow = make_dataclass('Row', 'a b'.split())\nRow(1, 2)", output: 'Row(a=1, b=2)' },
    },
    {
      name: 'A required field after one with a default',
      desc: 'The same rule as in a class statement: a default may only be followed by more defaults — unless the fields are keyword-only.',
      wrong: { label: 'default first', code: "from dataclasses import make_dataclass\nmake_dataclass('Row', [('a', int, 0), 'b'])", output: "TypeError: non-default argument 'b' follows default argument 'a'" },
      fix:   { label: 'kw_only=True', code: "from dataclasses import make_dataclass\n\nRow = make_dataclass('Row', [('a', int, 0), 'b'], kw_only=True)\nRow(b=2)", output: 'Row(a=0, b=2)' },
    },
    {
      name: 'Four items in a field tuple',
      desc: 'Field options go into a field() call as the third item, not as extra tuple items.',
      wrong: { label: "('a', int, 1, 2)", code: "from dataclasses import make_dataclass\nmake_dataclass('Row', [('a', int, 1, 2)])", output: "TypeError: Invalid field: ('a', <class 'int'>, 1, 2)" },
      fix:   { label: "('a', int, 1)", code: "from dataclasses import make_dataclass\n\nRow = make_dataclass('Row', [('a', int, 1)])\nRow()", output: 'Row(a=1)' },
    },
  ],

  when: {
    use: [
      'Field names known only at runtime: CSV headers, query columns, schemas',
      'Generating many similar record classes in a loop',
    ],
    avoid: [
      'Fixed, known fields → a normal class statement is easier to read and to type-check',
      'Static type checkers — they cannot see the fields of a class built at runtime',
    ],
  },

  notes: {
    cpython:       'Lib/dataclasses.py — checks each name with str.isidentifier() and keyword.iskeyword(), builds the class with types.new_class (namespace + defaults + __annotations__), sets __module__, then applies dataclass() with the options',
    'Name checks': 'Order of checks per item: shape (a str, or a sequence of 2 or 3 items), identifier, keyword, duplicate. The class name itself is not checked',
    'module':      'The module= parameter is new in 3.12 (the 3.11 signature ends at weakref_slot); default: the module name of the caller',
  },

  related: [
    { name: '@dataclass', slug: 'dataclass', when: 'The options make_dataclass passes on' },
    { name: 'field()', slug: 'field', when: 'Third item of a field tuple' },
    { name: 'fields()', slug: 'fields', when: 'Read the generated fields back' },
    { name: 'collections.namedtuple', slug: 'namedtuple', when: 'The tuple-based equivalent', category: 'stdlib/collections' },
    { name: 'type()', slug: 'type', when: 'Building plain classes at runtime', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I create a dataclass dynamically?',
      a: "dataclasses.make_dataclass('Name', fields) with fields as a list of names, (name, type) pairs or (name, type, default) triples. Decorator options (frozen=True, order=True, ...) are keyword arguments, and namespace= adds methods.",
    },
    {
      q: 'Why does make_dataclass say "Field names must be valid identifiers"?',
      a: 'One of the names is not a Python identifier — it starts with a digit, contains a space or a hyphen, or is empty. A string passed instead of a list is iterated character by character, which often produces the name " ". Clean the names (for example replace "-" with "_") before building the class.',
    },
    {
      q: 'What type do fields without a type get?',
      a: "The string 'typing.Any' is stored as the annotation. Nothing checks it at runtime, so any value is accepted.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.make_dataclass',
    meta:  'dataclasses.make_dataclass',
  },

};
