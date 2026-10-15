// content/reference/python/stdlib/enum/auto.js

export const meta = {
  slug:        'auto',
  name:        'enum.auto',
  signature:   'enum.auto(value=_auto_null)',
  blurb:       'A placeholder that the enum class body replaces with a generated value: the highest value + 1 for Enum, the next power of two for Flag, the lower-cased name for StrEnum.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'auto enum.auto python enum automatic values auto() increment enum values next value _generate_next_value_ flag auto powers of two strenum auto lowercase unable to sort non-numeric values unable to increment',
};

export const method = {
  slug:      'auto',
  name:      'enum.auto',
  signature: 'enum.auto(value=_auto_null)',
  returns:   { type: 'auto', desc: 'A marker object; inside an enum body it is replaced by the value _generate_next_value_ returns (or by value, when given).' },

  category:    'enum helper',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: "Write auto() when the value does not matter. The class body asks _generate_next_value_(name, start, count, last_values) for each one — and since 3.13 Enum's version returns the highest value so far plus one, so explicit values and auto() mix predictably.",

  covers: ['auto'],

  cheat: {
    commonCall: 'RED = auto()',
    returns:    '1, 2, 3 … in Enum; 1, 2, 4 … in Flag; the lower-cased name in StrEnum',
    replaces:   'numbering members by hand',
    watchOut:   'mixing auto() with str values in an Enum is a TypeError',
  },

  parameters: [
    { name: 'value', type: 'object', required: false, default: '_auto_null', desc: 'Use this exact value instead of generating one (it still counts as a "last value" for the next auto()).' },
  ],

  modes: [
    {
      id: 'enum',
      label: 'Enum',
      blurb: 'Type the first value; GREEN and BLUE use auto().',
      params: [{ name: 'first', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: 'from enum import Enum, auto\nclass Color(Enum):\n    RED = {$first}\n    GREEN = auto()\n    BLUE = auto()\nlist(Color)',
      cases: [
        { id: 'one',   label: '1',   values: { first: '1' } },
        { id: 'ten',   label: '10',  values: { first: '10' } },
        { id: 'half',  label: '2.5', values: { first: '2.5' } },
        { id: 'text',  label: 'red', values: { first: 'red' } },
      ],
    },
    {
      id: 'flag',
      label: 'Flag',
      blurb: 'Type R; W and X get the next powers of two above the highest value.',
      params: [{ name: 'first', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag, auto\nclass Perm(Flag):\n    R = {$first}\n    W = auto()\n    X = auto()\nlist(Perm)',
      cases: [
        { id: 'one',   label: '1', values: { first: '1' } },
        { id: 'four',  label: '4', values: { first: '4' } },
        { id: 'three', label: '3', values: { first: '3' } },
        { id: 'zero',  label: '0', values: { first: '0' } },
      ],
    },
    {
      id: 'explicit',
      label: 'auto(value)',
      blurb: 'auto(value) fixes GREEN; BLUE continues from the highest value.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: 'from enum import Enum, auto\nclass Color(Enum):\n    RED = auto()\n    GREEN = auto({$value})\n    BLUE = auto()\nlist(Color)',
      cases: [
        { id: 'ten',  label: '10', values: { value: '10' } },
        { id: 'zero', label: '0',  values: { value: '0' } },
        { id: 'text', label: 'g',  values: { value: 'g' } },
      ],
    },
  ],
  demoExplainer: "Enum adds 1 to the highest value so far, so 2.5 continues as 3.5, 4.5 — and a str cannot be incremented ('unable to increment'). Flag doubles the highest bit: with R = 3 the next values are 4 and 8, and R, which has two bits, becomes an alias that list() skips; with R = 0 the auto() values start at 1, and R = 0 is not listed either. In the last tab GREEN = auto(0) leaves 1 as the highest value, so BLUE is 2; with a str next to an int the values cannot even be sorted.",

  patterns: [
    {
      name: 'Values that do not matter',
      desc: 'The usual case: names are the API, numbers are an implementation detail.',
      code: 'from enum import Enum, auto\nclass State(Enum):\n    IDLE = auto()\n    RUNNING = auto()\n    DONE = auto()',
    },
    {
      name: 'Your own value scheme',
      desc: '_generate_next_value_ must be defined before the first member that uses auto().',
      code: 'from enum import Enum, auto\nclass Color(Enum):\n    @staticmethod\n    def _generate_next_value_(name, start, count, last_values):\n        return name.lower()\n    RED = auto()\n    GREEN = auto()',
    },
    {
      name: 'auto() inside a tuple value (3.11.1+)',
      desc: 'Only the auto() part is generated; the rest is kept.',
      code: "from enum import Enum, auto\nclass Planet(Enum):\n    EARTH = (auto(), 'blue')\n    MARS = (auto(), 'red')",
    },
  ],

  examples: [
    { title: 'Numbers from 1',                 code: 'from enum import Enum, auto\nclass Color(Enum):\n    RED = auto()\n    GREEN = auto()\n[m.value for m in Color]', returns: '[1, 2]' },
    { title: 'Highest value + 1 (3.13)',       code: 'from enum import Enum, auto\nclass Color(Enum):\n    RED = 5\n    GREEN = 1\n    BLUE = auto()\nColor.BLUE.value', returns: '6' },
    { title: 'Flag: the next power of two',    code: 'from enum import Flag, auto\nclass Perm(Flag):\n    R = auto()\n    W = auto()\n    X = auto()\n[m.value for m in Perm]', returns: '[1, 2, 4]' },
    { title: 'StrEnum: the lower-cased name',  code: 'from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\nMethod.GET.value', returns: "'get'" },
    { title: 'A custom _generate_next_value_', code: 'from enum import Enum, auto\nclass Color(Enum):\n    @staticmethod\n    def _generate_next_value_(name, start, count, last_values):\n        return name.title()\n    RED = auto()\n    DARK_BLUE = auto()\n[m.value for m in Color]', returns: "['Red', 'Dark_Blue']" },
    { title: 'auto() inside a tuple',          code: "from enum import Enum, auto\nclass Planet(Enum):\n    EARTH = (auto(), 'blue')\n    MARS = (auto(), 'red')\nlist(Planet)", returns: "[<Planet.EARTH: (1, 'blue')>, <Planet.MARS: (2, 'red')>]" },
    { title: 'Mixed with str values',          code: "from enum import Enum, auto\nclass Color(Enum):\n    RED = auto()\n    GREEN = 'g'\n    BLUE = auto()", returns: 'TypeError: unable to sort non-numeric values' },
  ],

  pitfalls: [
    {
      name: 'auto() in Enum when you wanted bits',
      desc: 'Enum counts 1, 2, 3. Only Flag (and IntFlag) generate powers of two.',
      wrong: { label: 'Enum', code: 'from enum import Enum, auto\nclass Perm(Enum):\n    R = auto()\n    W = auto()\n    X = auto()\n[m.value for m in Perm]', output: '[1, 2, 3]' },
      fix:   { label: 'Flag', code: 'from enum import Flag, auto\nclass Perm(Flag):\n    R = auto()\n    W = auto()\n    X = auto()\n[m.value for m in Perm]', output: '[1, 2, 4]' },
    },
    {
      name: '_generate_next_value_ after the members',
      desc: 'auto() is resolved the moment its line runs, so the generator has to be defined first.',
      wrong: { label: 'after', code: 'from enum import Enum, auto\nclass Color(Enum):\n    RED = auto()\n    @staticmethod\n    def _generate_next_value_(name, start, count, last_values):\n        return name', output: 'TypeError: _generate_next_value_ must be defined before members' },
      fix:   { label: 'before', code: 'from enum import Enum, auto\nclass Color(Enum):\n    @staticmethod\n    def _generate_next_value_(name, start, count, last_values):\n        return name\n    RED = auto()\nColor.RED.value', output: "'RED'" },
    },
    {
      name: 'auto() next to text values',
      desc: 'The default generator sorts the earlier values to find the highest; ints and strs cannot be compared. Use explicit values, StrEnum, or a custom generator.',
      wrong: { label: 'auto() + str', code: "from enum import Enum, auto\nclass Color(Enum):\n    RED = 'r'\n    GREEN = auto()", output: "TypeError: unable to increment 'r'" },
      fix:   { label: 'StrEnum',      code: "from enum import StrEnum, auto\nclass Color(StrEnum):\n    RED = 'r'\n    GREEN = auto()\nlist(Color)", output: "[<Color.RED: 'r'>, <Color.GREEN: 'green'>]" },
    },
  ],

  when: {
    use: [
      'Members whose values are never stored or sent anywhere',
      'Flags: auto() gets the powers of two right',
      'StrEnum members whose value is just the name',
    ],
    avoid: [
      'Values that are persisted (database, files, network): reordering or inserting members changes them → write them out',
    ],
  },

  notes: {
    cpython:      'Lib/enum.py: EnumDict.__setitem__ replaces auto() by calling _generate_next_value_(name, 1, len(member_names), last_values) as soon as the line runs',
    'Enum':       'Enum._generate_next_value_ returns start when there are no values yet, else max-by-sorting(last_values) + 1. The 3.13 docs say prior versions used the last value seen; 3.12 emits a DeprecationWarning when the last value is not the highest (3.12.3, tested, still returns highest + 1)',
    'Flag':       'Flag._generate_next_value_ returns 1 for the first member, then 2 ** max(last_values).bit_length() — the next power of two above the highest value',
    'repr':       'repr(auto()) is auto(_auto_null) until the class body fills it in',
  },

  related: [
    { name: 'Enum',    slug: 'enum',    when: 'Counting values' },
    { name: 'Flag',    slug: 'flag',    when: 'Powers of two' },
    { name: 'StrEnum', slug: 'strenum', when: 'Lower-cased names' },
    { name: 'EnumDict', slug: 'enumdict', when: 'Where auto() is resolved' },
    { name: 'unique',  slug: 'unique',  when: 'Catch a value you typed twice' },
  ],

  faq: [
    {
      q: 'What value does auto() give in Python?',
      a: 'In Enum and IntEnum: 1 for the first member, then the highest value so far plus 1. In Flag and IntFlag: the next power of two. In StrEnum: the member name in lower case.',
    },
    {
      q: 'How do I make auto() start at 0?',
      a: "Give the first member 0 explicitly (RED = 0, then auto() continues with 1, 2 …), or define _generate_next_value_ to return count. The functional API takes start=: Enum('Color', 'RED GREEN', start=0).",
    },
    {
      q: 'Why does auto() raise "unable to sort non-numeric values"?',
      a: 'An earlier member has a value that cannot be compared with the others (usually a str next to ints). The default generator sorts all values to find the highest one. Use explicit values or a custom _generate_next_value_.',
    },
    {
      q: 'Can I use auto() with my own values in the same enum?',
      a: 'Yes. Explicit values and auto(value) count as previous values, so auto() continues after the highest number used so far.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.auto',
    meta:  'enum.auto',
  },

};
