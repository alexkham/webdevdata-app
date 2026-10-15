// content/reference/python/stdlib/dataclasses/astuple.js

export const meta = {
  slug:        'astuple',
  name:        'dataclasses.astuple',
  signature:   'dataclasses.astuple(obj, *, tuple_factory=tuple)',
  blurb:       'Convert a dataclass instance to a tuple of its field values — recursively, with the same deep copy as asdict.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'dataclass astuple python dataclasses.astuple dataclass to tuple unpack dataclass iterate values tuple_factory csv row sort key cannot unpack non-iterable object astuple should be called on dataclass instances',
};

export const method = {
  slug:      'astuple',
  name:      'dataclasses.astuple',
  signature: 'dataclasses.astuple(obj, *, tuple_factory=tuple)',
  returns:   { type: 'tuple', desc: 'The field values in field order — or whatever tuple_factory builds from the list of values.' },

  category:    'dataclasses function',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'Dataclass instances are not tuples: they cannot be unpacked, indexed or compared with tuples. astuple gives you the values as a real tuple — nested dataclasses become nested tuples, and every value is copied, not shared.',

  covers: ['astuple'],

  cheat: {
    commonCall: 'x, y = astuple(point)',
    returns:    '(1, 2)',
    replaces:   'tuple(getattr(obj, f.name) for f in fields(obj)) — minus the deep copy',
    watchOut:   'deep-copies lists and other mutable values, like asdict',
  },

  parameters: [
    { name: 'obj',           type: 'dataclass instance', required: true,  default: null,    desc: 'The instance to convert. Anything that is not a dataclass instance raises TypeError.' },
    { name: 'tuple_factory', type: 'callable',           required: false, default: 'tuple', desc: 'Called with the list of converted values for every dataclass, at every level of nesting.' },
  ],

  modes: [
    {
      id: 'nested',
      label: 'nested',
      blurb: 'A Line of two Points becomes a tuple of two tuples and the label.',
      params: [
        { name: 'x1',    type: 'int', hint: 'start x', input: 'number' },
        { name: 'y1',    type: 'int', hint: 'start y', input: 'number' },
        { name: 'x2',    type: 'int', hint: 'end x',   input: 'number' },
        { name: 'y2',    type: 'int', hint: 'end y',   input: 'number' },
        { name: 'label', type: 'str', hint: 'label',   input: 'text' },
      ],
      template: "from dataclasses import dataclass, astuple\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\n@dataclass\nclass Line:\n    start: Point\n    end: Point\n    label: str = ''\n\nastuple(Line(Point({$x1}, {$y1}), Point({$x2}, {$y2}), {$label}))",
      cases: [
        { id: 'diag', label: 'diagonal', values: { x1: '0', y1: '0', x2: '3', y2: '4', label: 'diagonal' } },
        { id: 'neg',  label: 'negative', values: { x1: '-5', y1: '2', x2: '5', y2: '-2', label: '' } },
      ],
    },
    {
      id: 'row',
      label: 'CSV row',
      blurb: 'Field values in order, ready for a row of text.',
      params: [
        { name: 'name',  type: 'str',   hint: 'item',     input: 'text' },
        { name: 'price', type: 'float', hint: 'price',    input: 'float' },
        { name: 'qty',   type: 'int',   hint: 'quantity', input: 'number' },
      ],
      template: "from dataclasses import dataclass, astuple\n\n@dataclass\nclass Item:\n    name: str\n    price: float\n    qty: int = 1\n\n','.join(map(str, astuple(Item({$name}, {$price}, {$qty}))))",
      cases: [
        { id: 'pen',  label: 'pen',      values: { name: 'pen', price: '1.5', qty: '3' } },
        { id: 'tiny', label: '0.1 each', values: { name: 'clip', price: '0.1', qty: '100' } },
      ],
    },
  ],
  demoExplainer: 'In nested, each Point turned into an (x, y) tuple inside the outer tuple. In CSV row, str() of the float is its shortest repr, so 0.1 prints as 0.1; a comma inside the name would end up unquoted in the row — use the csv module for real files.',

  patterns: [
    {
      name: 'Unpack the fields',
      desc: 'Instances are not iterable; their tuple is.',
      code: 'from dataclasses import astuple\nx, y = astuple(point)',
    },
    {
      name: 'Sort by all fields',
      desc: 'A tuple key without order=True on the class.',
      code: 'from dataclasses import astuple\npeople.sort(key=astuple)',
    },
    {
      name: 'Rows for csv or a database',
      desc: 'executemany and csv.writer take tuples.',
      code: 'from dataclasses import astuple\ncursor.executemany("INSERT INTO items VALUES (?, ?, ?)", [astuple(i) for i in items])',
    },
  ],

  examples: [
    { title: 'Flat and nested', code: 'from dataclasses import dataclass, astuple\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\n@dataclass\nclass C:\n    mylist: list[Point]\n\nastuple(Point(10, 20)), astuple(C([Point(0, 0), Point(10, 4)]))', returns: '((10, 20), ([(0, 0), (10, 4)],))' },
    { title: 'Unpack', code: 'from dataclasses import dataclass, astuple\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nx, y = astuple(Point(3, 4))\nx * y', returns: '12' },
    { title: 'tuple_factory=list', code: 'from dataclasses import dataclass, astuple\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nastuple(Point(1, 2), tuple_factory=list)', returns: '[1, 2]' },
    { title: 'As a sort key', code: "from dataclasses import dataclass, astuple\n\n@dataclass\nclass Person:\n    last: str\n    first: str\n\npeople = [Person('Lovelace', 'Ada'), Person('Hopper', 'Grace'), Person('Lovelace', 'Byron')]\nsorted(people, key=astuple)", returns: "[Person(last='Hopper', first='Grace'), Person(last='Lovelace', first='Ada'), Person(last='Lovelace', first='Byron')]" },
    { title: 'Dicts inside are converted too', code: "from dataclasses import dataclass, astuple\n\n@dataclass\nclass P:\n    x: int\n    d: dict\n\nastuple(P(1, {'k': P(2, {})}))", returns: "(1, {'k': (2, {})})" },
    { title: 'Values are copies', code: 'from dataclasses import dataclass, astuple, fields\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(1, [2])\ntuple(getattr(p, f.name) for f in fields(p))[1] is p.y, astuple(p)[1] is p.y', returns: '(True, False)' },
    { title: 'Only instances', code: 'from dataclasses import astuple\nastuple(1)', returns: 'TypeError: astuple() should be called on dataclass instances' },
  ],

  pitfalls: [
    {
      name: 'Unpacking the instance itself',
      desc: 'A dataclass is not a tuple and defines no __iter__, so unpacking, len() and indexing all fail.',
      wrong: { label: 'x, y = p', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nx, y = Point(3, 4)', output: 'TypeError: cannot unpack non-iterable Point object' },
      fix:   { label: 'astuple(p)', code: 'from dataclasses import dataclass, astuple\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nx, y = astuple(Point(3, 4))\nx, y', output: '(3, 4)' },
    },
    {
      name: 'Comparing an instance with a tuple',
      desc: 'The generated __eq__ only compares with the same class; against a tuple it returns NotImplemented and == ends up False.',
      wrong: { label: 'p == (1, 2)', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nPoint(1, 2) == (1, 2)', output: 'False' },
      fix:   { label: 'astuple(p) == (1, 2)', code: 'from dataclasses import dataclass, astuple\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nastuple(Point(1, 2)) == (1, 2)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Unpacking, CSV rows, database parameters, sort keys',
      'A hashable snapshot of a dataclass whose fields are hashable',
    ],
    avoid: [
      'Records that should always behave like tuples → typing.NamedTuple instead of a dataclass',
      'Hot loops — the recursion and deep copy cost far more than a generator over fields()',
    ],
  },

  notes: {
    cpython:    'Lib/dataclasses.py _astuple_inner — the same recursion as asdict: dataclasses, lists, tuples (namedtuples keep their type) and dicts are rebuilt, atomic values returned as they are, everything else deep-copied',
    'Dicts':    'A dict field stays a dict; dataclasses inside it (keys or values) become tuples',
  },

  related: [
    { name: 'asdict()', slug: 'asdict', when: 'Same recursion, producing dicts' },
    { name: 'fields()', slug: 'fields', when: 'A shallow tuple of the values' },
    { name: 'collections.namedtuple', slug: 'namedtuple', when: 'A record that is a tuple', category: 'stdlib/collections' },
    { name: 'tuple', slug: 'tuple', when: 'What you get back', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I unpack a dataclass in Python?',
      a: 'x, y = dataclasses.astuple(point). Instances themselves are not iterable, so x, y = point raises "cannot unpack non-iterable Point object". If you unpack often, add def __iter__(self): return iter(astuple(self)) or use a NamedTuple.',
    },
    {
      q: 'What is the difference between astuple and asdict?',
      a: 'Same recursion and copying; asdict produces {name: value} dicts (and dict_factory gets (name, value) pairs), astuple produces tuples of values only (tuple_factory gets the list of values).',
    },
    {
      q: 'Is astuple a shallow or a deep copy?',
      a: 'Deep: lists, tuples, dicts and nested dataclasses are rebuilt, other values go through copy.deepcopy. tuple(getattr(obj, f.name) for f in fields(obj)) gives a shallow tuple that shares the objects.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.astuple',
    meta:  'dataclasses.astuple',
  },

};
