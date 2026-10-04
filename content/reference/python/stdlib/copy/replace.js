// content/reference/python/stdlib/copy/replace.js

export const meta = {
  slug:        'replace',
  name:        'copy.replace',
  signature:   'copy.replace(obj, /, **changes)',
  blurb:       'New in 3.13: a copy of an immutable record with some fields changed — named tuples, dataclasses, datetime objects and anything with __replace__.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.13+',
  searchTerms: 'copy.replace python 3.13 replace field namedtuple _replace dataclasses.replace frozen dataclass immutable update copy with changes __replace__ does not support',
};

export const method = {
  slug:      'replace',
  name:      'copy.replace',
  signature: 'copy.replace(obj, /, **changes)',
  returns:   { type: 'same type as obj', desc: 'A new object with the given fields replaced; obj is unchanged.' },

  category:    'copy function',
  version:     'Python 3.13+',
  hasLiveDemo: true,

  subtitle: 'One spelling for what used to be namedtuple._replace, dataclasses.replace and datetime.replace. It simply calls type(obj).__replace__(obj, **changes) — types without that method get a TypeError.',

  covers: ['replace'],

  cheat: {
    commonCall: 'moved = copy.replace(point, x=10)',
    returns:    'a new object of the same type',
    replaces:   'p._replace(...), dataclasses.replace(...), dt.replace(...)',
    watchOut:   'Not for list, dict, tuple: TypeError',
  },

  parameters: [
    { name: 'obj',       type: 'object', required: true,  default: null, desc: 'An instance whose class defines __replace__: a namedtuple, a dataclass, date/datetime/time, SimpleNamespace … Positional only.' },
    { name: '**changes', type: 'any',    required: false, default: null, desc: 'field=value pairs. Unknown names raise TypeError (the exact message comes from the type).' },
  ],

  modes: [
    {
      id: 'namedtuple',
      label: 'namedtuple',
      blurb: 'Point(x, y) with x replaced. The original is unchanged — named tuples are immutable.',
      params: [
        { name: 'x',  type: 'int', hint: 'x',     input: 'number' },
        { name: 'y',  type: 'int', hint: 'y',     input: 'number' },
        { name: 'nx', type: 'int', hint: 'new x', input: 'number' },
      ],
      template: "import copy\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y')\np = Point({$x}, {$y})\n(p, copy.replace(p, x={$nx}))",
      cases: [
        { id: 'basic', label: 'move x', values: { x: '1', y: '2', nx: '5' } },
      ],
    },
    {
      id: 'dataclass',
      label: 'frozen dataclass',
      blurb: 'A frozen dataclass cannot be assigned to — copy.replace builds a new instance through __init__.',
      params: [
        { name: 'name', type: 'str', hint: 'item name', input: 'text' },
        { name: 'qty',  type: 'int', hint: 'new qty',   input: 'number' },
      ],
      template: "import copy\nfrom dataclasses import dataclass\n@dataclass(frozen=True)\nclass Item:\n    name: str\n    qty: int = 1\nitem = Item({$name})\n(item, copy.replace(item, qty={$qty}))",
      cases: [
        { id: 'pen', label: 'pen', values: { name: 'pen', qty: '3' } },
      ],
    },
    {
      id: 'field',
      label: 'field name',
      blurb: 'Pass any field name: x and y work, anything else is rejected by the named tuple.',
      params: [{ name: 'field', type: 'str', hint: 'field name', input: 'text' }],
      template: "import copy\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y')\np = Point(1, 2)\ncopy.replace(p, **{ {$field}: 0 })",
      cases: [
        { id: 'y',  label: 'y',  values: { field: 'y' } },
        { id: 'z',  label: 'z',  values: { field: 'z' } },
      ],
    },
  ],
  demoExplainer: 'Each call returns a NEW object and leaves the original as it was: (Point(x=1, y=2), Point(x=5, y=2)). For the named tuple an unknown field gives TypeError: Got unexpected field names: [\'z\'] — the message comes from namedtuple._replace. A dataclass reports unknown names differently, as an unexpected keyword argument of __init__.',

  patterns: [
    {
      name: 'Update an immutable config',
      desc: 'Frozen dataclasses stay frozen; you derive new versions.',
      code: 'import copy\ntest_config = copy.replace(prod_config, debug=True, db_url="sqlite://")',
    },
    {
      name: 'Support copy.replace in your own class',
      desc: 'Define __replace__(self, /, **changes) and return a new instance.',
      code: 'class Money:\n    def __init__(self, amount, currency):\n        self.amount, self.currency = amount, currency\n    def __replace__(self, /, **changes):\n        return Money(changes.get("amount", self.amount), changes.get("currency", self.currency))',
    },
    {
      name: 'Code for 3.12 and earlier',
      desc: 'Fall back to the type-specific spellings.',
      code: 'import dataclasses\np2 = p._replace(x=5)                      # namedtuple\nitem2 = dataclasses.replace(item, qty=3)   # dataclass',
    },
  ],

  examples: [
    { title: 'Named tuple',                code: "import copy\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y')\ncopy.replace(Point(1, 2), y=9)", returns: 'Point(x=1, y=9)' },
    { title: 'Same as _replace',           code: "import copy\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y')\np = Point(1, 2)\ncopy.replace(p, x=3) == p._replace(x=3)", returns: 'True' },
    { title: 'datetime',                   code: 'import copy, datetime\ncopy.replace(datetime.date(2026, 10, 4), year=2027)', returns: 'datetime.date(2027, 10, 4)' },
    { title: 'SimpleNamespace',            code: 'import copy\nfrom types import SimpleNamespace\ncopy.replace(SimpleNamespace(a=1, b=2), a=5)', returns: 'namespace(a=5, b=2)' },
    { title: 'Unchanged fields are shared, not copied', code: 'import copy\nfrom dataclasses import dataclass, field\n@dataclass\nclass Cart:\n    owner: str\n    items: list = field(default_factory=list)\nc = Cart("ann")\nc2 = copy.replace(c, owner="bob")\nc2.items is c.items', returns: 'True' },
    { title: 'Lists are not supported',    code: 'import copy\ncopy.replace([1, 2])', returns: 'TypeError: replace() does not support list objects' },
    { title: 'Changes must be keywords',   code: "import copy\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y')\ncopy.replace(Point(1, 2), 5)", returns: 'TypeError: replace() takes 1 positional argument but 2 were given' },
  ],

  pitfalls: [
    {
      name: 'Assigning to a frozen dataclass',
      desc: 'Frozen instances refuse attribute assignment. Make a modified copy instead.',
      wrong: { label: 'item.qty = 3', code: 'from dataclasses import dataclass\n@dataclass(frozen=True)\nclass Item:\n    name: str\n    qty: int = 1\nitem = Item("pen")\nitem.qty = 3', output: "dataclasses.FrozenInstanceError: cannot assign to field 'qty'" },
      fix:   { label: 'copy.replace', code: 'import copy\nfrom dataclasses import dataclass\n@dataclass(frozen=True)\nclass Item:\n    name: str\n    qty: int = 1\nitem = Item("pen")\ncopy.replace(item, qty=3)', output: "Item(name='pen', qty=3)" },
    },
    {
      name: 'Using it on plain containers',
      desc: 'copy.replace only works on types with __replace__. Tuples, lists and dicts have none — build the new value directly.',
      wrong: { label: 'a dict', code: "import copy\ncopy.replace({'a': 1}, a=2)", output: 'TypeError: replace() does not support dict objects' },
      fix:   { label: 'dict merge', code: "{'a': 1} | {'a': 2}", output: "{'a': 2}" },
    },
  ],

  when: {
    use: [
      'Deriving modified versions of immutable records (namedtuple, frozen dataclass)',
      'Generic code that should work for any type with __replace__',
    ],
    avoid: [
      'Python 3.12 or older → _replace() / dataclasses.replace()',
      'Mutable objects you may change in place → just assign the attribute',
      'Plain dicts → {**d, "key": value} or d | {...}',
    ],
  },

  notes: {
    cpython:   'copy.replace in Lib/copy.py: looks up obj.__class__.__replace__ and calls it with **changes; TypeError "replace() does not support <type> objects" when it is missing',
    'Shallow': 'Unchanged fields are reused as they are — the new object shares them with the old one',
    'Versions': 'copy.replace and the __replace__ protocol are new in 3.13',
  },

  related: [
    { name: 'collections.namedtuple', slug: 'namedtuple', when: 'Has __replace__ (= _replace)', category: 'stdlib/collections' },
    { name: 'copy.copy',     slug: 'copy',     when: 'Copy without changes' },
    { name: 'datetime.replace', slug: 'replace', when: 'The datetime spelling', category: 'stdlib/datetime' },
    { name: 'copy module',   slug: 'copy',     when: 'Shallow vs deep overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does copy.replace do in Python 3.13?',
      a: 'It returns a new object of the same type with the given fields changed, by calling the type’s __replace__ method. Named tuples, dataclasses, date/datetime/time and SimpleNamespace support it out of the box.',
    },
    {
      q: 'How do I change a field of a frozen dataclass?',
      a: 'You cannot change it in place (FrozenInstanceError); create a new instance with copy.replace(obj, field=value) on 3.13+, or dataclasses.replace(obj, field=value) on older versions.',
    },
    {
      q: 'Is copy.replace a deep copy?',
      a: 'No. Fields you do not mention are carried over as the same objects, so a list in an unchanged field is shared between the old and new instance.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/copy.html#copy.replace',
    meta:  'copy.replace',
  },
};
