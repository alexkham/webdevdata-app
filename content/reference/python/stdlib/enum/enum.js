// content/reference/python/stdlib/enum/enum.js

export const meta = {
  slug:        'enum',
  name:        'enum.Enum',
  signature:   'enum.Enum(value, names, *, module=None, qualname=None, type=None, start=1, boundary=None)',
  blurb:       'The base class for enumerations: subclass it, list NAME = value pairs, and every pair becomes a unique member with a name, a value and its own repr.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'enum.Enum python enum class create enum enumeration member name value lookup Color(1) Color["RED"] alias _missing_ case insensitive lookup is not a valid functional api Enum("Color", "RED GREEN") enum methods properties compare members',
};

export const method = {
  slug:      'enum',
  name:      'enum.Enum',
  signature: 'enum.Enum(value, names, *, module=None, qualname=None, type=None, start=1, boundary=None)',
  returns:   { type: 'EnumType', desc: 'Called on Enum itself (the functional API): a new enum class. Called on an enum with members: the member whose value is `value`.' },

  category:    'enum class',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Members are created once, when the class body runs. After that the class is a fixed set: you look members up by value with Color(1) or by name with Color["RED"], you cannot add, reassign or delete them, and a plain Enum member is equal only to itself.',

  covers: ['Enum'],

  cheat: {
    commonCall: 'class Color(Enum):\n    RED = 1',
    returns:    'Color.RED → <Color.RED: 1>, Color(1) → the same object',
    replaces:   'module-level constants like RED = 1 and string flags',
    watchOut:   "Color('RED') is a VALUE lookup — use Color['RED'] for names",
  },

  parameters: [
    { name: 'value',    type: 'object | str', required: true,  default: null,   desc: 'On an enum with members: the value to look up. On Enum (or another member-less enum): the name of the new class.' },
    { name: 'names',    type: 'str | iterable | mapping', required: false, default: null, desc: "Functional API: 'RED GREEN' or 'RED, GREEN', a list of names, a list of (name, value) pairs, or a {name: value} mapping." },
    { name: 'module',   type: 'str',  required: false, default: 'None', desc: 'Module the new class says it lives in (pickling needs it to be right).' },
    { name: 'qualname', type: 'str',  required: false, default: 'None', desc: 'Where in that module pickle can find the class.' },
    { name: 'type',     type: 'type', required: false, default: 'None', desc: 'A data type to mix in, e.g. int or str.' },
    { name: 'start',    type: 'int',  required: false, default: '1',    desc: 'First value when only names are given; each next name gets the next value.' },
    { name: 'boundary', type: 'FlagBoundary', required: false, default: 'None', desc: 'Flag classes only: how out-of-range values are handled.' },
  ],

  modes: [
    {
      id: 'format',
      label: 'repr · str · format',
      blurb: 'Type a format spec. A plain Enum formats its str() — "Color.RED" — like any string.',
      params: [{ name: 'spec', type: 'str', hint: 'a format spec', input: 'text' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\nm = Color.RED\n(repr(m), str(m), format(m, {$spec}))',
      cases: [
        { id: 'empty',  label: "''",    values: { spec: '' } },
        { id: 'right',  label: '>12',   values: { spec: '>12' } },
        { id: 'center', label: '*^15',  values: { spec: '*^15' } },
        { id: 'cut',    label: '.5',    values: { spec: '.5' } },
        { id: 'int',    label: 'd',     values: { spec: 'd' } },
      ],
    },
    {
      id: 'contains',
      label: 'in',
      blurb: 'Since Python 3.12, `x in Color` accepts any value: members and the values of members are in, everything else is not.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n{$value} in Color',
      cases: [
        { id: 'one',  label: '1',     values: { value: '1' } },
        { id: 'name', label: "'RED'", values: { value: 'RED' } },
        { id: 'five', label: '5',     values: { value: '5' } },
      ],
    },
    {
      id: 'equal',
      label: 'equal values',
      blurb: 'A lookup by value uses == (and hash), so values that are equal in Python find the same member.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: "from enum import Enum\nclass Setting(Enum):\n    ON = True\n    OFF = False\n    AUTO = 'auto'\nSetting({$value})",
      cases: [
        { id: 'one',  label: '1',      values: { value: '1' } },
        { id: 'zero', label: '0',      values: { value: '0' } },
        { id: 'auto', label: "'auto'", values: { value: 'auto' } },
        { id: 'two',  label: '2',      values: { value: '2' } },
      ],
    },
  ],
  demoExplainer: "Enum.__format__ formats str(member), so width, fill, alignment and precision work as on 'Color.RED' — and a number code such as d fails with the str error message. In the second tab 'RED' is a name, not a value, so it is not in Color. In the third, 1 finds ON because 1 == True and hash(1) == hash(True) in Python; the member keeps the value it was defined with.",

  patterns: [
    {
      name: 'Members with behaviour',
      desc: 'Enums are classes: add methods and properties that use self.value.',
      code: 'from enum import Enum\nclass Weekday(Enum):\n    MONDAY = 1\n    SATURDAY = 6\n    SUNDAY = 7\n\n    @property\n    def is_weekend(self):\n        return self.value >= 6',
    },
    {
      name: 'Case-insensitive lookup by value',
      desc: '_missing_ runs when no member has the value; return a member or None.',
      code: 'from enum import Enum\nclass Build(Enum):\n    DEBUG = "debug"\n    RELEASE = "release"\n\n    @classmethod\n    def _missing_(cls, value):\n        if isinstance(value, str):\n            return cls.__members__.get(value.upper())\n        return None',
    },
    {
      name: 'Several values per member',
      desc: 'A tuple value is unpacked into __init__.',
      code: 'from enum import Enum\nclass Planet(Enum):\n    EARTH = (5.976e24, 6.37814e6)\n\n    def __init__(self, mass, radius):\n        self.mass = mass\n        self.radius = radius',
    },
    {
      name: 'Choices for argparse or a form',
      desc: 'Iterate the class for the allowed values.',
      code: 'choices = [m.value for m in Color]\nlabel = {m: m.name.title() for m in Color}',
    },
  ],

  examples: [
    { title: 'Aliases: same value, same member', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\n    GREEN = 2\n(Color.CRIMSON, list(Color))', returns: '(<Color.RED: 1>, [<Color.RED: 1>, <Color.GREEN: 2>])' },
    { title: '__members__ includes the aliases', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\nlist(Color.__members__)', returns: "['RED', 'CRIMSON']" },
    { title: 'Methods and properties',          code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    @property\n    def hex(self):\n        return {1: '#f00', 2: '#0f0'}[self.value]\nColor.GREEN.hex", returns: "'#0f0'" },
    { title: '_missing_ for forgiving lookups',  code: "from enum import Enum\nclass Build(Enum):\n    DEBUG = 'debug'\n    @classmethod\n    def _missing_(cls, value):\n        return cls.__members__.get(str(value).upper())\nBuild('Debug')", returns: "<Build.DEBUG: 'debug'>" },
    { title: 'Tuple values feed __init__',       code: 'from enum import Enum\nclass Planet(Enum):\n    EARTH = (5.976e+24, 6.37814e6)\n    def __init__(self, mass, radius):\n        self.mass = mass\n        self.radius = radius\n(Planet.EARTH.mass, Planet.EARTH.value)', returns: '(5.976e+24, (5.976e+24, 6378140.0))' },
    { title: 'Members do not order',             code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\nColor.RED < Color.GREEN', returns: "TypeError: '<' not supported between instances of 'Color' and 'Color'" },
    { title: 'Sort by value explicitly',         code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\nsorted(Color, key=lambda m: m.value, reverse=True)', returns: '[<Color.GREEN: 2>, <Color.RED: 1>]' },
    { title: 'Members cannot be reassigned',     code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor.RED = 5', returns: "AttributeError: cannot reassign member 'RED'" },
  ],

  pitfalls: [
    {
      name: 'Looking a name up with ()',
      desc: 'Calling the class matches VALUES. A name from user input needs the [] lookup.',
      wrong: { label: "Color('RED')", code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor('RED')", output: "ValueError: 'RED' is not a valid Color" },
      fix:   { label: "Color['RED']", code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor['RED']", output: '<Color.RED: 1>' },
    },
    {
      name: 'A trailing comma makes a tuple value',
      desc: 'RED = 1, assigns the tuple (1,), so the member is not found by 1.',
      wrong: { label: 'RED = 1,', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1,\n    GREEN = 2\nColor(1)', output: 'ValueError: 1 is not a valid Color' },
      fix:   { label: 'RED = 1',  code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\nColor(1)', output: '<Color.RED: 1>' },
    },
    {
      name: 'Changing a member value at run time',
      desc: 'name and value are read-only (the error names Enum, where the value property is defined). Keep changing data outside the enum.',
      wrong: { label: 'member.value = …', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor.RED.value = 2', output: "AttributeError: <enum 'Enum'> cannot set attribute 'value'" },
      fix:   { label: 'a dict keyed by member', code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nbrightness = {Color.RED: 1}\nbrightness[Color.RED] = 2\nbrightness", output: '{<Color.RED: 1>: 2}' },
    },
  ],

  when: {
    use: [
      'A closed set of named choices that the rest of the code passes around',
      'When mixing up two kinds of constants should fail loudly (a plain Enum is not equal to its value)',
      'Members that need behaviour — methods, properties, extra attributes from tuple values',
    ],
    avoid: [
      'Constants that must act as ints or strs everywhere → IntEnum / StrEnum',
      'Combinable options → Flag',
      'Sets of values that grow at run time → a dict or a database table',
    ],
  },

  notes: {
    cpython:        'Lib/enum.py: EnumType.__new__ turns each NAME = value of the body into a member; Enum.__new__ is only the lookup used by Color(value) and by pickle',
    'Lookup order': 'Color(x) returns x if it is already a Color member, then checks the value → member map (== and hash), then calls _missing_; a None result raises ValueError("x is not a valid Color")',
    'Hash':         'hash(member) is hash(member.name); members are usable as dict keys and set elements',
    'Bool':         'A plain Enum member is always true, even with the value 0 or None — define __bool__ to change it',
  },

  related: [
    { name: 'Enum.name / Enum.value', slug: 'name-value', when: 'The two attributes every member has' },
    { name: 'EnumType',  slug: 'enumtype',  when: 'len(), iteration, in, [] and the functional API' },
    { name: 'auto',      slug: 'auto',      when: 'Values you do not care about' },
    { name: 'unique',    slug: 'unique',    when: 'Forbid aliases' },
    { name: 'IntEnum',   slug: 'intenum',   when: 'Members that are ints' },
    { name: 'ValueError', slug: 'valueerror', when: 'What a failed value lookup raises', category: 'exceptions' },
    { name: 'KeyError',  slug: 'keyerror',  when: 'What a failed name lookup raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does Color(1) work but Color("RED") raise ValueError?',
      a: "Calling an enum class looks up a member by its value; 1 is a value, 'RED' is a name. Look names up with Color['RED'], or getattr(Color, 'RED').",
    },
    {
      q: 'How do I compare an enum member with a value?',
      a: 'Convert the value: Color(raw) is Color.RED. Comparing Color.RED == 1 is always False for a plain Enum. If your members must equal raw ints or strings, use IntEnum or StrEnum.',
    },
    {
      q: 'Can two enum members have the same value?',
      a: 'Yes — the second name becomes an alias: it returns the first member, is listed in __members__ but skipped by iteration and len(). Decorate the class with @unique (or @verify(UNIQUE)) to make aliases an error.',
    },
    {
      q: 'Can I add members to an enum after it is created?',
      a: 'No. Members are created with the class, assignment to an existing member raises AttributeError, and subclassing an enum that has members raises TypeError. Build a new enum (for example with the functional API) if the set has to grow.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.Enum',
    meta:  'enum.Enum',
  },

};
