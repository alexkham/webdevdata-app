// content/reference/python/stdlib/enum/enumtype.js

export const meta = {
  slug:        'enumtype',
  name:        'enum.EnumType',
  signature:   "enum.EnumType · Enum('Name', names, *, module=None, qualname=None, type=None, start=1, boundary=None)",
  blurb:       'The metaclass of every enum: it turns the class body into members and gives the class len(), iteration, in, [], () and the functional API. EnumMeta is its old name.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+ (named EnumType since 3.11; EnumMeta is an alias)',
  searchTerms: 'EnumType EnumMeta enum metaclass python functional api Enum("Color", "RED GREEN") create enum dynamically from list names start len enum iterate enum reversed __members__ aliases enum class methods subclass EnumType',
};

export const method = {
  slug:      'enumtype',
  name:      'enum.EnumType',
  signature: "enum.EnumType · Enum('Name', names, *, module=None, qualname=None, type=None, start=1, boundary=None)",
  returns:   { type: 'EnumType', desc: 'type(Color) for every enum class; calling Enum with a name and names builds a new enum class.' },

  category:    'enum metaclass',
  version:     'Python 3.4+ (named EnumType since 3.11; EnumMeta is an alias)',
  hasLiveDemo: true,

  subtitle: 'Everything you do to an enum CLASS goes through EnumType: Color(1), Color["RED"], 1 in Color, len(Color), list(Color), reversed(Color), Color.__members__ — and Enum("Color", "RED GREEN") builds a class at run time. You rarely name it, except to subclass it.',

  covers: ['EnumType', 'EnumMeta'],

  cheat: {
    commonCall: "Color = Enum('Color', 'RED GREEN BLUE')",
    returns:    "<enum 'Color'> with RED = 1, GREEN = 2, BLUE = 3",
    replaces:   'writing a class body for names known only at run time',
    watchOut:   'len() and iteration skip aliases; __members__ includes them',
  },

  parameters: [
    { name: 'Name',     type: 'str', required: true,  default: null,   desc: 'Name of the new class (the functional API).' },
    { name: 'names',    type: 'str | iterable | mapping', required: true, default: null, desc: "'RED GREEN' or 'RED, GREEN', a list of names, a list of (name, value) pairs, or a {name: value} dict." },
    { name: 'module',   type: 'str', required: false, default: 'None', desc: 'Module the class claims to live in; taken from the caller when not given. Pickle needs it.' },
    { name: 'qualname', type: 'str', required: false, default: 'None', desc: 'Where pickle can find the class inside that module.' },
    { name: 'type',     type: 'type', required: false, default: 'None', desc: 'Data type to mix in, e.g. int.' },
    { name: 'start',    type: 'int', required: false, default: '1',    desc: 'First value when only names are given.' },
    { name: 'boundary', type: 'FlagBoundary', required: false, default: 'None', desc: 'For Flag classes: how unknown bits are handled.' },
  ],

  modes: [
    {
      id: 'functional',
      label: 'functional API',
      blurb: 'Type member names separated by spaces or commas.',
      params: [{ name: 'names', type: 'str', hint: 'member names', input: 'text' }],
      template: "from enum import Enum\nColor = Enum('Color', {$names})\nlist(Color)",
      cases: [
        { id: 'three', label: 'RED GREEN BLUE', values: { names: 'RED GREEN BLUE' } },
        { id: 'comma', label: 'RED, GREEN',     values: { names: 'RED, GREEN' } },
        { id: 'dupe',  label: 'RED RED',        values: { names: 'RED RED' } },
        { id: 'mro',   label: 'mro',            values: { names: 'mro' } },
        { id: 'empty', label: 'empty',          values: { names: '' } },
      ],
    },
    {
      id: 'start',
      label: 'start=',
      blurb: 'Type the first value; the next names count up from it.',
      params: [{ name: 'start', type: 'int', hint: 'an integer', input: 'number' }],
      template: "from enum import Enum\nColor = Enum('Color', 'RED GREEN BLUE', start={$start})\nlist(Color)",
      cases: [
        { id: 'one',  label: '1',  values: { start: '1' } },
        { id: 'zero', label: '0',  values: { start: '0' } },
        { id: 'ten',  label: '10', values: { start: '10' } },
      ],
    },
    {
      id: 'aliases',
      label: 'len · iter · __members__',
      blurb: 'Give CRIMSON a value. If another member already has it, CRIMSON is an alias.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = {$value}\n    GREEN = 2\n(len(Color), list(Color), list(Color.__members__))',
      cases: [
        { id: 'alias', label: '1', values: { value: '1' } },
        { id: 'new',   label: '3', values: { value: '3' } },
        { id: 'two',   label: '2', values: { value: '2' } },
      ],
    },
  ],
  demoExplainer: "The names string is split on commas and whitespace; every name must be unique, 'mro' and '' are rejected, and _sunder_ names are reserved. An empty string gives an enum with no members. In the last tab, CRIMSON = 1 makes CRIMSON an alias of RED: len() and iteration count 2 members while __members__ lists 3 names. With 2, CRIMSON is defined first, so GREEN becomes the alias.",

  patterns: [
    {
      name: 'Build an enum from data',
      desc: 'Pairs keep their values; plain names are numbered from start.',
      code: "from enum import Enum\nStatus = Enum('Status', [(row['code'], row['id']) for row in rows])",
    },
    {
      name: 'Keep it picklable',
      desc: 'Pass module= (and qualname= for nested classes) when the caller is not the defining module.',
      code: "from enum import Enum\nColor = Enum('Color', 'RED GREEN', module=__name__)",
    },
    {
      name: 'Customise class-level behaviour',
      desc: 'Subclass EnumType and use it as the metaclass; here Color() with no argument returns the first member.',
      code: 'from enum import Enum, EnumType\nclass DefaultEnumType(EnumType):\n    def __call__(cls, value=None, *args, **kwargs):\n        if value is None:\n            return next(iter(cls))\n        return super().__call__(value, *args, **kwargs)\n\nclass Color(Enum, metaclass=DefaultEnumType):\n    RED = 1\n    GREEN = 2',
    },
  ],

  examples: [
    { title: 'Every enum class is an EnumType', code: 'from enum import Enum, EnumType, EnumMeta\nclass Color(Enum):\n    RED = 1\n(type(Color), isinstance(Color, EnumType), EnumMeta is EnumType)', returns: "(<class 'enum.EnumType'>, True, True)" },
    { title: 'len() and reversed()',            code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n(len(Color), list(reversed(Color)))', returns: '(2, [<Color.GREEN: 2>, <Color.RED: 1>])' },
    { title: '__members__ includes aliases',    code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\nColor.__members__', returns: "mappingproxy({'RED': <Color.RED: 1>, 'CRIMSON': <Color.RED: 1>})" },
    { title: 'Functional API with pairs',       code: "from enum import Enum\nlist(Enum('Color', [('RED', 'r'), ('GREEN', 'g')]))", returns: "[<Color.RED: 'r'>, <Color.GREEN: 'g'>]" },
    { title: 'Functional API with a dict',      code: "from enum import Enum\nlist(Enum('Color', {'RED': 1, 'GREEN': 2}))", returns: '[<Color.RED: 1>, <Color.GREEN: 2>]' },
    { title: 'An enum class is always true',    code: 'from enum import Enum\nclass Empty(Enum):\n    pass\n(bool(Empty), len(Empty))', returns: '(True, 0)' },
    { title: 'Members cannot be deleted',       code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\ndel Color.RED', returns: "AttributeError: 'Color' cannot delete member 'RED'." },
    { title: 'A member-less enum needs names',  code: "from enum import Enum\nEnum('Color')", returns: "TypeError: <enum 'Enum'> has no members; specify `names=()` if you meant to create a new, empty, enum" },
  ],

  pitfalls: [
    {
      name: 'Expecting iteration to show aliases',
      desc: 'Iteration, len() and reversed() go over canonical members only. __members__ maps every name, aliases included.',
      wrong: { label: 'list(Color)',             code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\n    GREEN = 2\n[m.name for m in Color]', output: "['RED', 'GREEN']" },
      fix:   { label: 'list(Color.__members__)', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\n    GREEN = 2\nlist(Color.__members__)', output: "['RED', 'CRIMSON', 'GREEN']" },
    },
    {
      name: 'Separators other than spaces and commas',
      desc: 'The names string is only split on commas and whitespace. Anything else stays inside one (odd) member name.',
      wrong: { label: "'RED-GREEN'", code: "from enum import Enum\nlist(Enum('Color', 'RED-GREEN'))", output: '[<Color.RED-GREEN: 1>]' },
      fix:   { label: "'RED GREEN'", code: "from enum import Enum\nlist(Enum('Color', 'RED GREEN'))", output: '[<Color.RED: 1>, <Color.GREEN: 2>]' },
    },
    {
      name: 'Passing several values to the class',
      desc: 'Color(1, 2) is not two lookups: the arguments are packed into the tuple (1, 2) and looked up as one value.',
      wrong: { label: 'Color(1, 2)', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\nColor(1, 2)', output: 'ValueError: (1, 2) is not a valid Color' },
      fix:   { label: 'one lookup each', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n[Color(v) for v in (1, 2)]', output: '[<Color.RED: 1>, <Color.GREEN: 2>]' },
    },
  ],

  when: {
    use: [
      'Enums whose names come from data or configuration (functional API)',
      'Introspection: len(), iteration, __members__, isinstance(cls, EnumType)',
      'Changing class-level behaviour for a family of enums (subclass EnumType)',
    ],
    avoid: [
      'Members known when you write the code → a normal class body',
      'Changing how members are created → __new__ / _missing_ / _generate_next_value_ on the enum, not the metaclass',
    ],
  },

  notes: {
    cpython:     'Lib/enum.py: class EnumType(type). __prepare__ returns an EnumDict, __new__ turns its member names into members, __call__ is both Color(value) and the functional API; EnumMeta = EnumType',
    'Renamed':   'EnumMeta was renamed EnumType in 3.11; EnumMeta remains as an alias of the same object',
    '__contains__': 'Since 3.12 `x in Color` accepts any value instead of raising TypeError. What counts as "in" changed between patch releases: 3.12.0–3.12.9 and 3.13.0–3.13.2 check member values only; 3.12.10+ and 3.13.3 return True for anything Color(x) accepts, _missing_ included; 3.13.4+ check member values plus, for Flag classes, any valid combination',
    'Class attributes': 'Assigning to a member name raises AttributeError("cannot reassign member ..."); other class attributes can still be set',
  },

  related: [
    { name: 'Enum',     slug: 'enum',     when: 'Value and name lookups on members' },
    { name: 'EnumDict', slug: 'enumdict', when: 'The namespace __prepare__ returns' },
    { name: 'auto',     slug: 'auto',     when: 'How names-only values are numbered' },
    { name: 'type',     slug: 'type',     when: 'What a metaclass is', category: 'functions' },
    { name: 'len()',    slug: 'len',      when: 'Counts members, not aliases', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between EnumType and EnumMeta?',
      a: 'None — they are the same class. It was called EnumMeta until Python 3.11, which renamed it EnumType and kept EnumMeta as an alias.',
    },
    {
      q: 'How do I create an enum dynamically from a list of names?',
      a: "Use the functional API: Enum('Color', ['RED', 'GREEN']) or Enum('Color', 'RED GREEN') numbers them from 1; pass a list of (name, value) pairs or a dict to choose the values.",
    },
    {
      q: 'How do I get the number of members in an enum?',
      a: 'len(Color). It counts canonical members only; len(Color.__members__) counts every name including aliases.',
    },
    {
      q: 'Can I subclass EnumType?',
      a: 'Yes: define class MyEnumType(EnumType) and create enums with class Color(Enum, metaclass=MyEnumType). Override __call__, __contains__ and friends for class-level behaviour.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.EnumType',
    meta:  'enum.EnumType',
  },

};
