// content/reference/python/stdlib/dataclasses/fields.js

export const meta = {
  slug:        'fields',
  name:        'dataclasses.fields',
  signature:   'dataclasses.fields(class_or_instance)',
  blurb:       'The Field objects of a dataclass — or of an instance — as a tuple, in field order, inherited fields first. ClassVar and InitVar pseudo-fields are left out.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'dataclass fields python dataclasses.fields list field names get fields of dataclass iterate over dataclass fields field types f.name f.type introspection must be called with a dataclass type or instance ClassVar InitVar __dataclass_fields__ __annotations__',
};

export const method = {
  slug:      'fields',
  name:      'dataclasses.fields',
  signature: 'dataclasses.fields(class_or_instance)',
  returns:   { type: 'tuple[Field, ...]', desc: 'One Field per real field, in __init__ / repr order.' },

  category:    'dataclasses function',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'The supported way to ask a dataclass what its fields are. Each Field carries the name, the annotation and every field() option, so generic code — serializers, form builders, CSV writers — can walk any dataclass without knowing it in advance.',

  covers: ['fields'],

  cheat: {
    commonCall: '[f.name for f in fields(obj)]',
    returns:    "('name', 'price', ...) as Field objects in a tuple",
    replaces:   'reading __annotations__ or __dataclass_fields__ by hand',
    watchOut:   'TypeError for anything that is not a dataclass or an instance of one',
  },

  parameters: [
    { name: 'class_or_instance', type: 'dataclass | instance', required: true, default: null, desc: 'A dataclass, an instance of one, or a subclass of one. Anything else raises TypeError.' },
  ],

  modes: [
    {
      id: 'inspect',
      label: 'name, type, value',
      blurb: 'Walk the fields of an instance: the annotation comes from the class, the value from the object.',
      params: [
        { name: 'name',  type: 'str',   hint: 'product name', input: 'text' },
        { name: 'price', type: 'float', hint: 'price',        input: 'float' },
      ],
      template: "from dataclasses import dataclass, field, fields\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    tags: list[str] = field(default_factory=list)\n    sku: str = field(default='', repr=False)\n\np = Product({$name}, {$price})\n[(f.name, f.type, getattr(p, f.name)) for f in fields(p)]",
      cases: [
        { id: 'pen',   label: 'pen',     values: { name: 'pen', price: '1.5' } },
        { id: 'big',   label: '1e16',    values: { name: 'yacht', price: '1e16' } },
      ],
    },
    {
      id: 'pseudo',
      label: 'ClassVar & InitVar',
      blurb: 'instances is a ClassVar and start an InitVar: both are annotated, neither is a field.',
      params: [
        { name: 'name',  type: 'str', hint: 'counter name', input: 'text' },
        { name: 'start', type: 'int', hint: 'InitVar start', input: 'number' },
      ],
      template: 'from dataclasses import dataclass, fields, InitVar\nfrom typing import ClassVar\n\n@dataclass\nclass Counter:\n    name: str\n    count: int = 0\n    instances: ClassVar[int] = 0\n    start: InitVar[int] = 0\n\n    def __post_init__(self, start):\n        self.count = start\n\nc = Counter({$name}, start={$start})\n(c, [f.name for f in fields(c)])',
      cases: [
        { id: 'clicks', label: 'start=5', values: { name: 'clicks', start: '5' } },
        { id: 'zero',   label: 'start=0', values: { name: 'views', start: '0' } },
      ],
    },
  ],
  demoExplainer: 'In name, type, value, sku is listed although repr=False hides it from the repr — fields() returns every field. The type is the annotation object itself: the class str, or the generic alias list[str]. In ClassVar & InitVar, start only reaches __post_init__, which copies it into count; fields() lists name and count and nothing else.',

  patterns: [
    {
      name: 'Field names',
      desc: 'Works on the class or on an instance.',
      code: 'from dataclasses import fields\nnames = [f.name for f in fields(Product)]',
    },
    {
      name: 'Shallow dict',
      desc: 'asdict deep-copies; this keeps the original objects.',
      code: 'from dataclasses import fields\nrow = {f.name: getattr(obj, f.name) for f in fields(obj)}',
    },
    {
      name: 'Write any dataclass as a CSV row',
      desc: 'Header from the names, row from the values.',
      code: 'import csv\nfrom dataclasses import fields, astuple\n\nwriter = csv.writer(out)\nwriter.writerow([f.name for f in fields(items[0])])\nwriter.writerows(astuple(item) for item in items)',
    },
    {
      name: 'Required fields',
      desc: 'Fields with neither a default nor a factory.',
      code: 'from dataclasses import fields, MISSING\nrequired = [f.name for f in fields(cls) if f.default is MISSING and f.default_factory is MISSING]',
    },
  ],

  examples: [
    { title: 'A tuple of Field objects', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass C:\n    x: int\n\ntype(fields(C)), type(fields(C)[0])', returns: "(<class 'tuple'>, <class 'dataclasses.Field'>)" },
    { title: 'Name and type of a field', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nfields(Point)[0].name, fields(Point)[0].type', returns: "('x', <class 'int'>)" },
    { title: 'Class or instance: same fields', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nfields(Point) == fields(Point(1, 2)), len(fields(Point))', returns: '(True, 2)' },
    { title: 'Inherited fields come first', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Base:\n    x: int = 0\n    y: int = 0\n\n@dataclass\nclass Child(Base):\n    z: int = 0\n    x: int = 5\n\n[f.name for f in fields(Child)], Child()', returns: '([\'x\', \'y\', \'z\'], Child(x=5, y=0, z=0))' },
    { title: 'String annotations stay strings', code: 'from __future__ import annotations\nfrom dataclasses import dataclass, fields\n\n@dataclass\nclass C:\n    x: int\n    y: list[int]\n\n[f.type for f in fields(C)]', returns: "['int', 'list[int]']" },
    { title: 'metadata per field', code: "from dataclasses import dataclass, field, fields\n\n@dataclass\nclass Form:\n    email: str = field(metadata={'label': 'E-mail address'})\n    age: int = field(default=0, metadata={'label': 'Age'})\n\n{f.name: f.metadata['label'] for f in fields(Form)}", returns: "{'email': 'E-mail address', 'age': 'Age'}" },
    { title: 'Not a dataclass', code: 'from dataclasses import fields\n\nclass Plain:\n    x: int = 0\n\nfields(Plain)', returns: 'TypeError: must be called with a dataclass type or instance' },
  ],

  pitfalls: [
    {
      name: 'Listing fields from __annotations__',
      desc: '__annotations__ holds only the names written in that class body — inherited fields are missing, and ClassVar / InitVar names would be included.',
      wrong: { label: '__annotations__', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Base:\n    x: int\n\n@dataclass\nclass Child(Base):\n    y: int\n\nlist(Child.__annotations__)', output: "['y']" },
      fix:   { label: 'fields()', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Base:\n    x: int\n\n@dataclass\nclass Child(Base):\n    y: int\n\n[f.name for f in fields(Child)]', output: "['x', 'y']" },
    },
    {
      name: 'Listing fields from __slots__',
      desc: 'With slots=True, a subclass only adds slots for its own new fields (3.11+), so __slots__ is not the field list.',
      wrong: { label: '__slots__', code: 'from dataclasses import dataclass\n\n@dataclass(slots=True)\nclass Base:\n    x: int\n\n@dataclass(slots=True)\nclass Child(Base):\n    y: int\n\nChild.__slots__', output: "('y',)" },
      fix:   { label: 'fields()', code: 'from dataclasses import dataclass, fields\n\n@dataclass(slots=True)\nclass Base:\n    x: int\n\n@dataclass(slots=True)\nclass Child(Base):\n    y: int\n\n[f.name for f in fields(Child)]', output: "['x', 'y']" },
    },
    {
      name: 'Calling fields() on arbitrary objects',
      desc: 'Generic code that receives dicts or plain objects too must check first.',
      wrong: { label: 'fields(dict)', code: "from dataclasses import fields\nfields({'a': 1})", output: 'TypeError: must be called with a dataclass type or instance' },
      fix:   { label: 'is_dataclass first', code: "from dataclasses import fields, is_dataclass\n\ndef field_names(obj):\n    if not is_dataclass(obj):\n        return []\n    return [f.name for f in fields(obj)]\n\nfield_names({'a': 1})", output: '[]' },
    },
  ],

  when: {
    use: [
      'Generic code over any dataclass: serializers, table and CSV writers, form builders',
      'Reading field() options or metadata back',
      'A shallow name → value dict (asdict copies deeply)',
    ],
    avoid: [
      'Converting to dict or tuple → asdict / astuple do it in one call',
      'Pseudo-fields (ClassVar, InitVar) — they are not returned',
    ],
  },

  notes: {
    cpython:      'Lib/dataclasses.py — fields() reads the __dataclass_fields__ dict and keeps the entries whose kind is _FIELD',
    'Order':      'Base-class fields first (from the far end of the MRO), then the class own fields; a redefined field keeps its original position',
    'Field.type': 'The annotation object as written: a class, a generic alias, or a str under from __future__ import annotations — never resolved',
  },

  related: [
    { name: 'Field objects', slug: 'field-object', when: 'What each item of the tuple holds' },
    { name: 'asdict()', slug: 'asdict', when: 'Fields → dict, recursively' },
    { name: 'astuple()', slug: 'astuple', when: 'Fields → tuple, recursively' },
    { name: 'is_dataclass()', slug: 'is_dataclass', when: 'Check before calling fields()' },
    { name: 'InitVar', slug: 'initvar', when: 'Annotated, but not a field' },
    { name: 'getattr()', slug: 'getattr', when: 'Value of a field by name', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the field names of a dataclass?',
      a: '[f.name for f in dataclasses.fields(obj)] — obj can be the class or an instance. The names come in __init__ order, with inherited fields first.',
    },
    {
      q: 'How do I iterate over the values of a dataclass instance?',
      a: 'Combine fields() with getattr: for f in fields(obj): value = getattr(obj, f.name). Instances are not iterable themselves; astuple(obj) gives the values in one tuple, but deep-copied.',
    },
    {
      q: 'Why does fields() not show my ClassVar or InitVar attributes?',
      a: 'They are pseudo-fields. A ClassVar is a class attribute and is ignored by every generated method; an InitVar is only an __init__ parameter handed to __post_init__. fields() returns real fields only.',
    },
    {
      q: 'What does "TypeError: must be called with a dataclass type or instance" mean?',
      a: 'fields() was given something without dataclass fields: a plain class, a dict, None, or a generic alias such as Box[int]. Check with is_dataclass() first when the input can be anything.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.fields',
    meta:  'dataclasses.fields',
  },

};
