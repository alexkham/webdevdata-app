// content/reference/python/stdlib/dataclasses/field-object.js — dataclasses.Field and its attributes

export const meta = {
  slug:        'field-object',
  name:        'dataclasses.Field',
  signature:   'class dataclasses.Field',
  blurb:       'The object describing one field: name, type and every field() option — what fields() returns. Attributes: name, type, default, default_factory, init, repr, hash, compare, metadata, kw_only.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.7+ (kw_only 3.10)',
  searchTerms: 'dataclasses.Field Field object Field.name Field.type Field.default Field.default_factory Field.init Field.repr Field.hash Field.compare Field.metadata Field.kw_only field attributes introspection fields() mappingproxy metadata read-only',
};

export const method = {
  slug:      'field-object',
  name:      'dataclasses.Field',
  signature: 'class dataclasses.Field',
  returns:   { type: 'Field', desc: 'Created by field() (or implicitly for a plain annotation); you get them from fields(cls).' },

  category:    'dataclasses class',
  version:     'Python 3.7+ (kw_only 3.10)',
  hasLiveDemo: true,

  subtitle: 'Every field of a dataclass is described by a Field object. You never build one yourself — field() creates it, @dataclass fills in name and type — but reading them is how generic code learns what a dataclass looks like.',

  covers: ['Field', 'Field.name', 'Field.type', 'Field.default', 'Field.default_factory', 'Field.init', 'Field.repr', 'Field.hash', 'Field.compare', 'Field.metadata', 'Field.kw_only'],

  cheat: {
    commonCall: "{f.name: f.type for f in fields(cls)}",
    returns:    "{'x': <class 'int'>, ...}",
    replaces:   'parsing __annotations__ and class attributes yourself',
    watchOut:   'read-only in practice: changing a Field after decoration changes nothing',
  },

  attributes: [
    { name: 'name',            type: 'str',                 meaning: 'The field name; None on a field() result that no class has used yet' },
    { name: 'type',            type: 'object',              meaning: 'The annotation exactly as written: a class, a generic alias such as list[str], or a string' },
    { name: 'default',         type: 'object | MISSING',    meaning: 'The default value, or MISSING' },
    { name: 'default_factory', type: 'callable | MISSING',  meaning: 'The zero-argument factory, or MISSING' },
    { name: 'init',            type: 'bool',                meaning: 'Is it an __init__ parameter' },
    { name: 'repr',            type: 'bool',                meaning: 'Is it shown by the generated __repr__' },
    { name: 'hash',            type: 'bool | None',         meaning: 'Explicit hash= setting; None means "follow compare"' },
    { name: 'compare',         type: 'bool',                meaning: 'Is it used by __eq__ and the order methods' },
    { name: 'metadata',        type: 'mappingproxy',        meaning: 'Read-only view of the metadata mapping (empty if none was given)' },
    { name: 'kw_only',         type: 'bool | MISSING',      meaning: 'True / False after decoration; MISSING on a bare field() that did not set it (3.10+)' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'read a Field',
      blurb: 'Pick a field by name and read its attributes. A name that is not a field is a KeyError from the dict built here.',
      params: [{ name: 'name', type: 'str', hint: 'name, price, tags or sku', input: 'text' }],
      template: "from dataclasses import dataclass, field, fields, MISSING\n\n@dataclass\nclass Item:\n    name: str\n    price: float = field(default=0.0, metadata={'unit': 'EUR'})\n    tags: list[str] = field(default_factory=list, repr=False, compare=False)\n    sku: str = field(default='', kw_only=True)\n\nby_name = {f.name: f for f in fields(Item)}\nf = by_name[{$name}]\n(f.type, f.default is MISSING, f.default_factory is MISSING, f.repr, f.compare, f.kw_only, dict(f.metadata))",
      cases: [
        { id: 'price', label: 'price', values: { name: 'price' } },
        { id: 'tags',  label: 'tags',  values: { name: 'tags' } },
        { id: 'sku',   label: 'sku',   values: { name: 'sku' } },
        { id: 'typo',  label: 'Price', values: { name: 'Price' } },
      ],
    },
  ],
  demoExplainer: 'price has a default (default is not MISSING) and metadata; tags has a factory instead, and repr=False / compare=False show up as False; sku is the only kw_only field. Field names are case-sensitive, so "Price" is a KeyError.',

  patterns: [
    {
      name: 'Name → type map',
      desc: 'Annotations of every field, including inherited ones.',
      code: 'from dataclasses import fields\ntypes = {f.name: f.type for f in fields(cls)}',
    },
    {
      name: 'Columns for a table',
      desc: 'Respect repr=False and a label in metadata.',
      code: "from dataclasses import fields\ncolumns = [(f.name, f.metadata.get('label', f.name)) for f in fields(cls) if f.repr]",
    },
    {
      name: 'Fields that go into the hash',
      desc: 'hash=None means the field follows compare.',
      code: 'from dataclasses import fields\nhashed = [f.name for f in fields(cls) if (f.compare if f.hash is None else f.hash)]',
    },
  ],

  examples: [
    { title: 'All attributes of one field', code: 'from dataclasses import dataclass, field, fields\n\n@dataclass\nclass C:\n    x: int\n    y: int = field(default=0, repr=False)\n\nf = fields(C)[1]\n(f.name, f.type, f.default, f.repr, f.hash, f.compare, f.init, f.kw_only)', returns: "('y', <class 'int'>, 0, False, None, True, True, False)" },
    { title: 'fields() returns Field objects', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass C:\n    x: int\n\ntype(fields(C)[0])', returns: "<class 'dataclasses.Field'>" },
    { title: 'name and type are filled in by @dataclass', code: 'from dataclasses import field\nf = field(default=1)\nf.name, f.type', returns: '(None, None)' },
    { title: 'metadata is a mappingproxy', code: "from dataclasses import dataclass, field, fields\n\n@dataclass\nclass C:\n    x: int\n    y: int = field(default=0, metadata={'help': 'the y'})\n\nfields(C)[0].metadata, fields(C)[1].metadata", returns: "(mappingproxy({}), mappingproxy({'help': 'the y'}))" },
    { title: 'hash= is stored as given', code: 'from dataclasses import dataclass, field, fields\n\n@dataclass(frozen=True)\nclass C:\n    x: int = field(hash=False)\n    y: int = 0\n\n[(f.name, f.hash, f.compare) for f in fields(C)]', returns: "[('x', False, True), ('y', None, True)]" },
    { title: 'A factory field has no default', code: 'from dataclasses import dataclass, field, fields, MISSING\n\n@dataclass\nclass C:\n    tags: list = field(default_factory=list)\n\nf = fields(C)[0]\nf.default is MISSING, f.default_factory()', returns: '(True, [])' },
    { title: 'Not meant to be built by hand', code: 'from dataclasses import Field\nField()', returns: "TypeError: Field.__init__() missing 8 required positional arguments: 'default', 'default_factory', 'init', 'repr', 'hash', 'compare', 'metadata', and 'kw_only'" },
  ],

  pitfalls: [
    {
      name: 'Changing a Field after decoration',
      desc: 'The generated methods were written when the decorator ran. Setting repr=False on the Field afterwards changes the Field and nothing else.',
      wrong: { label: 'f.repr = False', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass C:\n    x: int\n\nfields(C)[0].repr = False\nC(1)', output: 'C(x=1)' },
      fix:   { label: 'field(repr=False)', code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass C:\n    x: int = field(repr=False)\n\nC(1)', output: 'C()' },
    },
    {
      name: 'Writing to metadata',
      desc: 'metadata is wrapped in a read-only mappingproxy. Put everything into the mapping you pass to field(metadata=...).',
      wrong: { label: 'metadata[...] =', code: "from dataclasses import dataclass, fields\n\n@dataclass\nclass C:\n    x: int\n\nfields(C)[0].metadata['x'] = 1", output: "TypeError: 'mappingproxy' object does not support item assignment" },
      fix:   { label: 'field(metadata=)', code: "from dataclasses import dataclass, field, fields\n\n@dataclass\nclass C:\n    x: int = field(metadata={'x': 1})\n\nfields(C)[0].metadata['x']", output: '1' },
    },
    {
      name: 'Expecting the default of a factory field',
      desc: 'default and default_factory are separate attributes; a factory field\'s default is MISSING. Call the factory to see the value an instance would get.',
      wrong: { label: 'f.default', code: 'from dataclasses import dataclass, field, fields\n\n@dataclass\nclass C:\n    tags: list = field(default_factory=list)\n\nfields(C)[0].default == []', output: 'False' },
      fix:   { label: 'f.default_factory()', code: 'from dataclasses import dataclass, field, fields\n\n@dataclass\nclass C:\n    tags: list = field(default_factory=list)\n\nfields(C)[0].default_factory()', output: '[]' },
    },
  ],

  when: {
    use: [
      'Generic code driven by field definitions: serializers, form and table builders, validators',
      'Reading your own metadata',
    ],
    avoid: [
      'Creating Field objects directly — call field()',
      'The repr of a Field in output: it contains memory addresses (the MISSING sentinel)',
    ],
  },

  notes: {
    cpython:      'Lib/dataclasses.py — class Field with __slots__ (name, type, default, default_factory, repr, hash, init, compare, metadata, kw_only, _field_type): no other attributes can be added',
    'Private':    '_field_type (field, ClassVar or InitVar) is private; fields() already filters on it',
    'Where':      'All Field objects, pseudo-fields included, live in the class attribute __dataclass_fields__; fields() returns the real ones',
  },

  related: [
    { name: 'fields()', slug: 'fields', when: 'Where Field objects come from' },
    { name: 'field()', slug: 'field', when: 'What creates them' },
    { name: 'MISSING', slug: 'missing', when: 'The value of default / default_factory when absent' },
    { name: 'InitVar', slug: 'initvar', when: 'Pseudo-fields fields() leaves out' },
  ],

  faq: [
    {
      q: 'How do I get the type of a dataclass field?',
      a: 'fields(cls) gives Field objects; f.type is the annotation as written — a class such as int, a generic alias such as list[str], or a string when the module uses from __future__ import annotations.',
    },
    {
      q: 'What is in Field.metadata?',
      a: 'Exactly the mapping passed as field(metadata=...), wrapped in a read-only mappingproxy (an empty one when none was given). dataclasses never reads it; it is there for your own code and libraries.',
    },
    {
      q: 'Can I modify a Field to change how a dataclass behaves?',
      a: 'No. The decorator generates __init__, __repr__, __eq__ and the rest once, from the Field values at decoration time. Change the field() call in the class body instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.Field',
    meta:  'dataclasses.Field',
  },

};
