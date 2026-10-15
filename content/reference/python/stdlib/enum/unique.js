// content/reference/python/stdlib/enum/unique.js

export const meta = {
  slug:        'unique',
  name:        'enum.unique',
  signature:   '@enum.unique',
  blurb:       'A class decorator that forbids aliases: if two members share a value, it raises ValueError naming each alias and the member it points to.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'unique enum.unique python enum unique values decorator duplicate values found in enum alias prevent duplicate enum values @unique ValueError',
};

export const method = {
  slug:      'unique',
  name:      'enum.unique',
  signature: '@enum.unique',
  returns:   { type: 'EnumType', desc: 'The same class, unchanged, when it has no aliases.' },

  category:    'enum decorator',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'By default a repeated value silently turns the second name into an alias of the first. Put @unique on the class when a repeated value can only be a typo — the class then fails to build, and the message lists every alias.',

  covers: ['unique'],

  cheat: {
    commonCall: '@unique\nclass Color(Enum):\n    RED = 1\n    GREEN = 2',
    returns:    'the class itself',
    replaces:   'checking len(Color) == len(Color.__members__) by hand',
    watchOut:   'equal values count: 1, 1.0 and True are all the same value',
  },

  parameters: [
    { name: 'enumeration', type: 'EnumType', required: true, default: null, desc: 'The enum class to check (the decorated class).' },
  ],

  modes: [
    {
      id: 'values',
      label: 'Enum',
      blurb: 'Type three values. Any repeat makes the decorator fail.',
      params: [
        { name: 'red',   type: 'int | str', hint: 'RED',   input: 'auto' },
        { name: 'green', type: 'int | str', hint: 'GREEN', input: 'auto' },
        { name: 'blue',  type: 'int | str', hint: 'BLUE',  input: 'auto' },
      ],
      template: 'from enum import Enum, unique\n@unique\nclass Color(Enum):\n    RED = {$red}\n    GREEN = {$green}\n    BLUE = {$blue}\nlist(Color)',
      cases: [
        { id: 'ok',    label: '1 2 3', values: { red: '1', green: '2', blue: '3' } },
        { id: 'one',   label: '1 2 1', values: { red: '1', green: '2', blue: '1' } },
        { id: 'all',   label: '1 1 1', values: { red: '1', green: '1', blue: '1' } },
        { id: 'text',  label: 'r g r', values: { red: 'r', green: 'g', blue: 'r' } },
      ],
    },
    {
      id: 'flag',
      label: 'Flag',
      blurb: 'A multi-bit Flag value is a named combination, not a duplicate — unless it equals a single member.',
      params: [{ name: 'value', type: 'int', hint: 'RW', input: 'number' }],
      template: 'from enum import Flag, unique\n@unique\nclass Perm(Flag):\n    R = 4\n    W = 2\n    RW = {$value}\nlist(Perm.__members__)',
      cases: [
        { id: 'six',  label: '6', values: { value: '6' } },
        { id: 'four', label: '4', values: { value: '4' } },
        { id: 'zero', label: '0', values: { value: '0' } },
      ],
    },
  ],
  demoExplainer: 'The message has one "alias -> original" pair per repeated name, in definition order. In the Flag tab RW = 6 is a member of its own (its name is RW), so unique accepts it even though iteration skips multi-bit values; RW = 4 has the same value as R and is reported as RW -> R.',

  patterns: [
    {
      name: 'Guard a table of codes',
      desc: 'Codes typed by hand are where duplicates sneak in.',
      code: 'from enum import IntEnum, unique\n@unique\nclass ErrorCode(IntEnum):\n    NOT_FOUND = 404\n    GONE = 410\n    TEAPOT = 418',
    },
    {
      name: 'The verify() spelling',
      desc: 'verify(UNIQUE) does the same check and can be combined with others.',
      code: 'from enum import Enum, verify, UNIQUE, CONTINUOUS\n@verify(UNIQUE, CONTINUOUS)\nclass Level(Enum):\n    LOW = 1\n    MID = 2\n    HIGH = 3',
    },
  ],

  examples: [
    { title: 'No aliases: the class is returned', code: 'from enum import Enum, unique\n@unique\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\nlist(Color)', returns: '[<Color.RED: 1>, <Color.GREEN: 2>]' },
    { title: 'A repeated value',            code: 'from enum import Enum, unique\n@unique\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    CRIMSON = 1', returns: "ValueError: duplicate values found in <enum 'Color'>: CRIMSON -> RED" },
    { title: 'Every alias is listed',       code: 'from enum import Enum, unique\n@unique\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\n    SCARLET = 1', returns: "ValueError: duplicate values found in <enum 'Color'>: CRIMSON -> RED, SCARLET -> RED" },
    { title: 'Equal values are duplicates', code: 'from enum import Enum, unique\n@unique\nclass Answer(Enum):\n    YES = 1\n    TRUE = True', returns: "ValueError: duplicate values found in <enum 'Answer'>: TRUE -> YES" },
    { title: 'Without @unique it is an alias', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\nColor.CRIMSON is Color.RED', returns: 'True' },
    { title: 'Only enum classes',           code: 'from enum import unique\nunique(int)', returns: "AttributeError: type object 'int' has no attribute '__members__'" },
  ],

  pitfalls: [
    {
      name: 'Relying on two members with the same value',
      desc: 'Without @unique the second name quietly becomes the first member — lookups, iteration and .name all lose it. @unique makes the mistake loud.',
      wrong: { label: 'no decorator', code: "from enum import Enum\nclass Status(Enum):\n    ACTIVE = 'a'\n    ARCHIVED = 'a'\nStatus.ARCHIVED.name", output: "'ACTIVE'" },
      fix:   { label: '@unique',      code: "from enum import Enum, unique\n@unique\nclass Status(Enum):\n    ACTIVE = 'a'\n    ARCHIVED = 'a'", output: "ValueError: duplicate values found in <enum 'Status'>: ARCHIVED -> ACTIVE" },
    },
    {
      name: 'Values that are equal but look different',
      desc: 'Python considers 1 == 1.0 == True, so they are the same enum value. Use distinct values (or strs) if they must stay separate.',
      wrong: { label: '1 and 1.0', code: 'from enum import Enum, unique\n@unique\nclass Size(Enum):\n    SMALL = 1\n    SMALL_F = 1.0', output: "ValueError: duplicate values found in <enum 'Size'>: SMALL_F -> SMALL" },
      fix:   { label: 'distinct',  code: "from enum import Enum, unique\n@unique\nclass Size(Enum):\n    SMALL = 1\n    SMALL_F = '1.0'\nlist(Size)", output: "[<Size.SMALL: 1>, <Size.SMALL_F: '1.0'>]" },
    },
  ],

  when: {
    use: [
      'Enums whose values are written by hand: error codes, protocol numbers, database ids',
      'Any enum where an alias would be a bug rather than a feature',
    ],
    avoid: [
      'Enums that use aliases on purpose (old names kept for compatibility) — leave @unique off',
      'Several checks at once → @verify(UNIQUE, ...)',
    ],
  },

  notes: {
    cpython:   'Lib/enum.py: unique() walks __members__ and collects every name whose member has a different .name; the class is returned unchanged when there are none',
    'Flag':    'A multi-bit Flag value has its own name, so unique() does not treat it as an alias — only a name whose value equals an existing member is reported',
  },

  related: [
    { name: 'verify',   slug: 'verify',   when: 'UNIQUE, CONTINUOUS and NAMED_FLAGS checks' },
    { name: 'Enum',     slug: 'enum',     when: 'How aliases work' },
    { name: 'EnumType', slug: 'enumtype', when: '__members__ lists aliases' },
    { name: 'ValueError', slug: 'valueerror', when: 'What a duplicate raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I prevent duplicate values in a Python enum?',
      a: 'Decorate the class with @enum.unique (or @enum.verify(enum.UNIQUE)). Defining the class then raises ValueError if any two names share a value.',
    },
    {
      q: 'What does "duplicate values found in <enum ...>: B -> A" mean?',
      a: 'Member B has the same value as A, so B was made an alias of A, and @unique rejects aliases. Change one of the values, or remove @unique if the alias is intended.',
    },
    {
      q: 'What is the difference between @unique and @verify(UNIQUE)?',
      a: 'They check the same thing; only the message wording differs ("duplicate values found in" vs "aliases found in"). verify() can also run CONTINUOUS and NAMED_FLAGS in the same decorator.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.unique',
    meta:  'enum.unique',
  },

};
