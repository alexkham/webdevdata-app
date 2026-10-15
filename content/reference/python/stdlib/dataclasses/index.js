// content/reference/python/stdlib/dataclasses/index.js — the dataclasses module hub

export const meta = {
  slug:        'index',
  name:        'dataclasses',
  signature:   'import dataclasses',
  blurb:       'Write a class as a list of typed fields and get __init__, __repr__ and __eq__ generated for you — plus ordering, immutability, slots, asdict and replace on request.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'dataclasses module python dataclass decorator field fields asdict astuple replace make_dataclass is_dataclass InitVar KW_ONLY MISSING FrozenInstanceError Field data class record struct frozen immutable order slots post_init default_factory mutable default boilerplate __init__ __repr__ __eq__',
};

export const method = {
  slug: 'index',
  name: 'dataclasses',

  category:    'Data types',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'Annotate the fields, add @dataclass, and the class gets an __init__, a readable __repr__ and a field-by-field __eq__. Options switch on ordering, frozen (hashable) instances, keyword-only fields and __slots__; asdict, astuple and replace work with the result.',

  // every public name these classes define themselves must have a member page
  coverClasses: ['Field', 'InitVar'],

  imports: ['from dataclasses import dataclass, field', 'import dataclasses'],
  facts: [
    { label: 'Public API', value: 'dataclass, field, Field, fields, asdict, astuple, replace, make_dataclass, is_dataclass, InitVar, KW_ONLY, MISSING, FrozenInstanceError' },
    { label: 'What it reads', value: 'Class attributes with a type annotation are fields; ClassVar and InitVar annotations are pseudo-fields' },
    { label: 'Types', value: 'Annotations are never checked at runtime — Point("a", None) is accepted' },
    { label: 'Source', value: 'Pure Python: Lib/dataclasses.py builds the methods as source text and exec()s it once per class' },
  ],

  modes: [
    {
      id: 'record',
      label: 'generated methods',
      blurb: 'Three typed fields, one default, one ordinary method. __init__, __repr__ and __eq__ come from the decorator.',
      params: [
        { name: 'name',  type: 'str',   hint: 'item name',  input: 'text' },
        { name: 'price', type: 'float', hint: 'unit price', input: 'float' },
        { name: 'qty',   type: 'int',   hint: 'quantity',   input: 'number' },
      ],
      template: "from dataclasses import dataclass\n\n@dataclass\nclass Item:\n    name: str\n    price: float\n    qty: int = 1\n\n    def total(self):\n        return self.price * self.qty\n\nitem = Item({$name}, {$price}, {$qty})\n(item, item.total(), item == Item('pen', 1.5, 2))",
      cases: [
        { id: 'pen',  label: 'pen x2',  values: { name: 'pen', price: '1.5', qty: '2' } },
        { id: 'mug',  label: 'mug x4',  values: { name: 'mug', price: '7.25', qty: '4' } },
        { id: 'tenth', label: '0.1 x3', values: { name: 'clip', price: '0.1', qty: '3' } },
      ],
    },
    {
      id: 'order',
      label: 'order=True',
      blurb: 'order=True adds <, <=, >, >= that compare the fields left to right, exactly like tuples.',
      params: [
        { name: 'a_major', type: 'int', hint: 'a: major', input: 'number' },
        { name: 'a_minor', type: 'int', hint: 'a: minor', input: 'number' },
        { name: 'b_major', type: 'int', hint: 'b: major', input: 'number' },
        { name: 'b_minor', type: 'int', hint: 'b: minor', input: 'number' },
      ],
      template: 'from dataclasses import dataclass\n\n@dataclass(order=True)\nclass Version:\n    major: int\n    minor: int = 0\n\na = Version({$a_major}, {$a_minor})\nb = Version({$b_major}, {$b_minor})\n(a < b, a == b, max(a, b))',
      cases: [
        { id: 'minor', label: '1.9 vs 1.10', values: { a_major: '1', a_minor: '9', b_major: '1', b_minor: '10' } },
        { id: 'major', label: '2.0 vs 1.99', values: { a_major: '2', a_minor: '0', b_major: '1', b_minor: '99' } },
        { id: 'same',  label: 'equal',       values: { a_major: '3', a_minor: '1', b_major: '3', b_minor: '1' } },
      ],
    },
    {
      id: 'json',
      label: 'asdict → JSON',
      blurb: 'json cannot serialize a dataclass instance directly; asdict() turns it into plain dicts and lists first.',
      params: [
        { name: 'name', type: 'str',       hint: 'user name',            input: 'text' },
        { name: 'tags', type: 'list[str]', hint: 'comma-separated tags', input: 'csv' },
      ],
      template: 'import json\nfrom dataclasses import dataclass, asdict\n\n@dataclass\nclass User:\n    name: str\n    tags: list[str]\n\njson.dumps(asdict(User({$name}, {$tags})))',
      cases: [
        { id: 'ann',   label: 'two tags', values: { name: 'ann', tags: 'admin, dev' } },
        { id: 'zoe',   label: 'non-ASCII', values: { name: 'Zoë', tags: 'ops' } },
        { id: 'none',  label: 'no tags',  values: { name: 'bob', tags: '' } },
      ],
    },
  ],
  demoExplainer: 'The repr lists every field as name=value in definition order, and == compares those fields one by one — Item("pen", 1.5, 2) equals the reference item, any other value does not. With order=True, Version(1, 9) < Version(1, 10) is True because 9 < 10 is compared as a number, not as text. In the JSON tab asdict() produced {"name": ..., "tags": [...]}, which json.dumps can write; non-ASCII names come out escaped (Zo\\u00eb) as json always does by default.',

  patterns: [
    {
      name: 'Immutable value object',
      desc: 'frozen=True blocks assignment and makes instances hashable; slots=True drops the per-instance __dict__.',
      code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True, slots=True)\nclass Money:\n    amount: int\n    currency: str = "EUR"',
    },
    {
      name: 'List defaults with default_factory',
      desc: 'Every instance gets its own new list.',
      code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Order:\n    id: int\n    lines: list[str] = field(default_factory=list)',
    },
    {
      name: 'Validate in __post_init__',
      desc: 'The generated __init__ calls __post_init__ after setting the fields.',
      code: 'from dataclasses import dataclass\n\n@dataclass\nclass Range:\n    start: int\n    stop: int\n\n    def __post_init__(self):\n        if self.stop < self.start:\n            raise ValueError("stop must be >= start")',
    },
    {
      name: 'To JSON and back',
      desc: 'asdict for writing; unpack the dict into the class for reading.',
      code: 'import json\nfrom dataclasses import asdict\n\ntext = json.dumps(asdict(user))\nuser2 = User(**json.loads(text))',
    },
  ],

  examples: [
    { title: 'Generated __init__ and __repr__', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nPoint(1, 2)', returns: 'Point(x=1, y=2)' },
    { title: 'Equality compares the fields', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nPoint(1, 2) == Point(1, 2), Point(1, 2) == (1, 2)', returns: '(True, False)' },
    { title: 'Defaults and keywords', code: "from dataclasses import dataclass\n\n@dataclass\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n\nConfig(port=9000)", returns: "Config(host='localhost', port=9000)" },
    { title: 'Annotations are not checked', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nPoint("a", None)', returns: "Point(x='a', y=None)" },
    { title: 'asdict and astuple', code: 'from dataclasses import dataclass, asdict, astuple\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nasdict(Point(1, 2)), astuple(Point(1, 2))', returns: "({'x': 1, 'y': 2}, (1, 2))" },
    { title: 'Field names in order', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Point:\n    x: int\n    y: int = 0\n\n[f.name for f in fields(Point)]', returns: "['x', 'y']" },
    { title: 'Not hashable unless frozen', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nhash(Point(1, 2))', returns: "TypeError: unhashable type: 'Point'" },
  ],

  pitfalls: [
    {
      name: 'A list (or dict, set) as a default value',
      desc: 'A default is one object shared by every instance, so dataclass rejects unhashable defaults outright. Use default_factory to build a new one per instance.',
      wrong: { label: 'items: list = []', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Cart:\n    items: list = []', output: "ValueError: mutable default <class 'list'> for field items is not allowed: use default_factory" },
      fix:   { label: 'default_factory=list', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Cart:\n    items: list = field(default_factory=list)\n\na, b = Cart(), Cart()\na.items.append(1)\na, b', output: '(Cart(items=[1]), Cart(items=[]))' },
    },
    {
      name: 'Using instances as dict keys or set members',
      desc: 'With the default eq=True and frozen=False, __hash__ is set to None: equal objects could change after being hashed. frozen=True generates a __hash__ from the fields.',
      wrong: { label: 'plain @dataclass', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\n{Point(1, 2)}', output: "TypeError: unhashable type: 'Point'" },
      fix:   { label: 'frozen=True', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\n{Point(1, 2), Point(1, 2)}', output: '{Point(x=1, y=2)}' },
    },
    {
      name: 'A required field after a field with a default',
      desc: 'Fields become __init__ parameters in order, and Python does not allow a required parameter after an optional one. Reorder, or make the later fields keyword-only.',
      wrong: { label: 'default first', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Job:\n    retries: int = 3\n    name: str', output: "TypeError: non-default argument 'name' follows default argument 'retries'" },
      fix:   { label: 'kw_only=True', code: "from dataclasses import dataclass\n\n@dataclass(kw_only=True)\nclass Job:\n    retries: int = 3\n    name: str\n\nJob(name='backup')", output: "Job(retries=3, name='backup')" },
    },
  ],

  when: {
    use: [
      'Records and value objects: a handful of named fields with a readable repr and equality',
      'Configuration objects with defaults, validated in __post_init__',
      'Immutable keys for dicts and sets (frozen=True)',
    ],
    avoid: [
      'A fixed-size immutable record that should also behave like a tuple → collections.namedtuple or typing.NamedTuple',
      'Runtime type checking or parsing of untrusted input → a validation library; dataclasses never check annotations',
      'Plain key-value data that is never accessed as attributes → dict',
    ],
  },

  notes: {
    cpython:      'Lib/dataclasses.py — the decorator generates the source of __init__, __repr__, __eq__ and friends as text and exec()s it once per class (3.13); the results are ordinary functions, like hand-written methods. frozen=True adds a small cost: __init__ has to set the fields with object.__setattr__',
    'Fields':     'A field is a class attribute with a type annotation; order of fields = order of definition, base-class fields first',
    'Versions':   'dataclasses 3.7; match_args, kw_only, slots, KW_ONLY and field(kw_only=) 3.10; weakref_slot 3.11; copy.replace support 3.13; 3.13 also changed __eq__ to compare field by field',
  },

  related: [
    { name: 'collections.namedtuple', slug: 'namedtuple', when: 'Immutable tuple-based records', category: 'stdlib/collections' },
    { name: 'copy.replace', slug: 'replace', when: 'Generic replace(), works on dataclasses (3.13)', category: 'stdlib/copy' },
    { name: 'json module', slug: 'json', when: 'Serialize asdict() output', category: 'stdlib' },
    { name: 'functools.total_ordering', slug: 'total_ordering', when: 'Ordering for hand-written classes', category: 'stdlib/functools' },
    { name: 'class', slug: 'class', when: 'The statement a dataclass decorates', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does @dataclass do in Python?',
      a: 'It reads the annotated class attributes (the fields) and adds methods built from them: __init__ taking the fields as parameters, a __repr__ like Point(x=1, y=2), and an __eq__ comparing the fields. Options add ordering methods, a __hash__, frozen attributes, __slots__ and keyword-only parameters.',
    },
    {
      q: 'What is the difference between a dataclass and a namedtuple?',
      a: 'A namedtuple is a tuple: immutable, indexable, unpackable and equal to a plain tuple with the same values. A dataclass is a normal class: mutable unless frozen=True, not iterable, and only equal to instances of the same class. Dataclasses also support defaults computed per instance (default_factory), __post_init__ and keyword-only fields.',
    },
    {
      q: 'Does a dataclass check the field types?',
      a: 'No. Annotations only mark which attributes are fields (and spot ClassVar and InitVar); Point("a", None) is accepted for x: int, y: int. Check types yourself in __post_init__, or use a static type checker.',
    },
    {
      q: 'How do I make a dataclass immutable and hashable?',
      a: 'Use @dataclass(frozen=True). Assigning to a field then raises FrozenInstanceError, and because eq and frozen are both true the decorator generates a __hash__ from the fields, so instances work as dict keys and set members.',
    },
    {
      q: 'Why do I get "mutable default <class \'list\'> for field ... is not allowed"?',
      a: 'A default value is a single object stored on the class and shared by every instance, so dataclass refuses unhashable defaults such as lists, dicts and sets. Write field(default_factory=list) instead; the factory is called for every new instance.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html',
    meta:  'dataclasses — Data Classes',
  },

};
