// content/reference/python/stdlib/enum/reprenum.js

export const meta = {
  slug:        'reprenum',
  name:        'enum.ReprEnum',
  signature:   'class Name(data_type, enum.ReprEnum)',
  blurb:       'The base of IntEnum, StrEnum and IntFlag: an Enum that takes only repr() from Enum and leaves str() and format() to the mixed-in data type.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'reprenum python enum.ReprEnum enum str format of mixin data type float enum int enum custom IntEnum base repr only enum __str__ __format__ mixed-in type',
};

export const method = {
  slug:      'reprenum',
  name:      'enum.ReprEnum',
  signature: 'class Name(data_type, enum.ReprEnum)',
  returns:   { type: 'EnumType', desc: 'An enum class whose members are data_type instances that print and format like that type.' },

  category:    'enum class',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: "Mixing a type into Enum (class Level(int, Enum)) makes members ints, but str(), format() and f-strings still say 'Level.HIGH'. Mixing it into ReprEnum keeps the type's own str() and format(); only repr() shows <Level.HIGH: 10>. That is exactly how IntEnum and StrEnum are built.",

  covers: ['ReprEnum'],

  cheat: {
    commonCall: 'class Ratio(float, ReprEnum):\n    HALF = 0.5',
    returns:    "str(Ratio.HALF) → '0.5', repr → <Ratio.HALF: 0.5>",
    replaces:   '(float, Enum) plus hand-written __str__ / __format__',
    watchOut:   'ReprEnum without a data type is a TypeError',
  },

  parameters: [
    { name: 'data_type', type: 'type',       required: true, default: null, desc: 'The type every member is an instance of — int, str, float, or your own class. Its __str__ and __format__ are kept.' },
    { name: 'Name',      type: 'identifier', required: true, default: null, desc: 'Your enum class; values are passed to data_type(...).' },
  ],

  modes: [
    {
      id: 'reprenum',
      label: '(int, ReprEnum)',
      blurb: 'Type a format spec. str() and format() are those of int.',
      params: [{ name: 'spec', type: 'str', hint: 'a format spec', input: 'text' }],
      template: 'from enum import ReprEnum\nclass Level(int, ReprEnum):\n    LOW = 1\n    HIGH = 10\nm = Level.HIGH\n(repr(m), str(m), format(m, {$spec}))',
      cases: [
        { id: 'empty', label: "''",  values: { spec: '' } },
        { id: 'pad',   label: '03d', values: { spec: '03d' } },
        { id: 'hex',   label: '#x',  values: { spec: '#x' } },
        { id: 'right', label: '>6',  values: { spec: '>6' } },
      ],
    },
    {
      id: 'mixin',
      label: '(int, Enum)',
      blurb: 'The same class on plain Enum: str() and format() use the name.',
      params: [{ name: 'spec', type: 'str', hint: 'a format spec', input: 'text' }],
      template: 'from enum import Enum\nclass Level(int, Enum):\n    LOW = 1\n    HIGH = 10\nm = Level.HIGH\n(repr(m), str(m), format(m, {$spec}))',
      cases: [
        { id: 'empty', label: "''",  values: { spec: '' } },
        { id: 'pad',   label: '03d', values: { spec: '03d' } },
        { id: 'hex',   label: '#x',  values: { spec: '#x' } },
        { id: 'right', label: '>12', values: { spec: '>12' } },
      ],
    },
  ],
  demoExplainer: "The repr is the same in both tabs. With ReprEnum, str() is '10' and format() is int.__format__, so 03d and #x work. With a plain Enum mixin, str() is 'Level.HIGH' and format() formats that text: width and alignment work, number codes such as d and x fail with the str error message.",

  patterns: [
    {
      name: 'An enum of floats that prints as floats',
      desc: 'The same recipe IntEnum and StrEnum use, for another type.',
      code: 'from enum import ReprEnum\nclass Ratio(float, ReprEnum):\n    HALF = 0.5\n    THIRD = 1 / 3',
    },
    {
      name: 'A shared base for several int enums',
      desc: 'Put methods on a member-less base; subclasses add the members.',
      code: 'from enum import ReprEnum\nclass Code(int, ReprEnum):\n    def describe(self):\n        return f"{self.name} ({self})"\n\nclass HttpCode(Code):\n    OK = 200\n    NOT_FOUND = 404',
    },
  ],

  examples: [
    { title: 'Only the repr comes from Enum',  code: "from enum import ReprEnum\nclass Level(int, ReprEnum):\n    LOW = 1\n    HIGH = 10\n(repr(Level.HIGH), str(Level.HIGH), f'{Level.HIGH:>4}')", returns: "('<Level.HIGH: 10>', '10', '  10')" },
    { title: 'The plain Enum mixin for comparison', code: "from enum import Enum\nclass Level(int, Enum):\n    HIGH = 10\n(str(Level.HIGH), f'{Level.HIGH}')", returns: "('Level.HIGH', 'Level.HIGH')" },
    { title: 'Any data type: float',            code: "from enum import ReprEnum\nclass Ratio(float, ReprEnum):\n    HALF = 0.5\n(repr(Ratio.HALF), str(Ratio.HALF), format(Ratio.HALF, '.0%'))", returns: "('<Ratio.HALF: 0.5>', '0.5', '50%')" },
    { title: 'Members are still the data type', code: 'from enum import ReprEnum\nclass Level(int, ReprEnum):\n    HIGH = 10\n(isinstance(Level.HIGH, int), Level.HIGH * 2)', returns: '(True, 20)' },
    { title: 'IntEnum, StrEnum and IntFlag are ReprEnums', code: 'from enum import ReprEnum, IntEnum, StrEnum, IntFlag, Flag\n[issubclass(c, ReprEnum) for c in (IntEnum, StrEnum, IntFlag, Flag)]', returns: '[True, True, True, False]' },
    { title: 'A data type is required',         code: 'from enum import ReprEnum\nclass Level(ReprEnum):\n    LOW = 1', returns: 'TypeError: ReprEnum subclasses must be mixed with a data type (i.e. int, str, float, etc.)' },
  ],

  pitfalls: [
    {
      name: 'Number formats on an (int, Enum) mixin',
      desc: 'Enum.__format__ formats str(member), the text "Level.HIGH", so integer format codes fail. ReprEnum keeps int.__format__.',
      wrong: { label: '(int, Enum)',     code: "from enum import Enum\nclass Level(int, Enum):\n    HIGH = 10\nf'{Level.HIGH:03d}'", output: "ValueError: Unknown format code 'd' for object of type 'str'" },
      fix:   { label: '(int, ReprEnum)', code: "from enum import ReprEnum\nclass Level(int, ReprEnum):\n    HIGH = 10\nf'{Level.HIGH:03d}'", output: "'010'" },
    },
    {
      name: 'ReprEnum on its own',
      desc: 'ReprEnum only makes sense with a data type to take str() and format() from.',
      wrong: { label: 'ReprEnum',        code: 'from enum import ReprEnum\nclass Level(ReprEnum):\n    HIGH = 10', output: 'TypeError: ReprEnum subclasses must be mixed with a data type (i.e. int, str, float, etc.)' },
      fix:   { label: '(int, ReprEnum)', code: 'from enum import ReprEnum\nclass Level(int, ReprEnum):\n    HIGH = 10\nstr(Level.HIGH)', output: "'10'" },
    },
  ],

  when: {
    use: [
      'Your own IntEnum-like class for another data type (float, Decimal, a custom class)',
      'A base class for several enums that must print as their values',
    ],
    avoid: [
      'int or str values → IntEnum / StrEnum already are this',
      'Enums whose str() should show the member name → Enum',
    ],
  },

  notes: {
    cpython:    "Lib/enum.py: class ReprEnum(Enum) has only a docstring. EnumType.__new__ checks for ReprEnum directly in the bases and copies the data type's __format__ and __str__ onto the class (int defines no __str__, so int.__repr__ is used)",
    'repr()':   "Still Enum.__repr__: <Name.MEMBER: value>, with the value shown by the data type's repr",
  },

  related: [
    { name: 'IntEnum', slug: 'intenum', when: 'ReprEnum + int' },
    { name: 'StrEnum', slug: 'strenum', when: 'ReprEnum + str' },
    { name: 'IntFlag', slug: 'intflag', when: 'ReprEnum + int + Flag' },
    { name: 'Enum',    slug: 'enum',    when: 'str() and format() of the member name' },
    { name: 'format()', slug: 'format', when: 'What __format__ is for', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is ReprEnum used for?',
      a: 'It is the base class of IntEnum, StrEnum and IntFlag. Use it directly to build the same thing for another data type: class Ratio(float, ReprEnum) gives members that are floats, print as floats, and only show the enum name in repr().',
    },
    {
      q: 'Why does f-string formatting of my (int, Enum) member print the name?',
      a: "Enum.__format__ formats str(member), which is 'Name.MEMBER'. Inherit from IntEnum (or (int, ReprEnum)) to format the number instead.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.ReprEnum',
    meta:  'enum.ReprEnum',
  },

};
