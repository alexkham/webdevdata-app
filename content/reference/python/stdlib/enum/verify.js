// content/reference/python/stdlib/enum/verify.js

export const meta = {
  slug:        'verify',
  name:        'enum.verify',
  signature:   '@enum.verify(*checks)',
  blurb:       'A class decorator that checks an enum against EnumCheck constraints — UNIQUE (no aliases), CONTINUOUS (no missing values) and NAMED_FLAGS (flag aliases use only named bits) — and raises ValueError if one fails.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'verify enum.verify EnumCheck CONTINUOUS NAMED_FLAGS UNIQUE enum.CONTINUOUS enum.NAMED_FLAGS enum.UNIQUE python enum validation missing values invalid enum invalid Flag alias is missing value show_flag_values aliases found in decorator checks',
};

export const method = {
  slug:      'verify',
  name:      'enum.verify',
  signature: '@enum.verify(*checks)',
  returns:   { type: 'EnumType', desc: 'The decorated class, unchanged, when every check passes.' },

  category:    'enum decorator',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'Write the checks you want after the decorator: @verify(UNIQUE, CONTINUOUS). Each check is an EnumCheck member (also importable as UNIQUE, CONTINUOUS, NAMED_FLAGS), and a failing class never gets created — the ValueError says exactly which names or values are wrong.',

  covers: ['verify', 'EnumCheck', 'CONTINUOUS', 'NAMED_FLAGS', 'UNIQUE'],

  cheat: {
    commonCall: '@verify(UNIQUE, CONTINUOUS)\nclass Level(IntEnum): ...',
    returns:    'the class, or ValueError naming the problem',
    replaces:   'hand-written asserts after the class definition',
    watchOut:   "pass the EnumCheck members, not strings — @verify('UNIQUE') checks nothing",
  },

  parameters: [
    { name: 'UNIQUE',      type: 'EnumCheck', required: false, default: null, desc: "No aliases: like @unique, the message is 'aliases found in <enum ...>: B -> A'." },
    { name: 'CONTINUOUS',  type: 'EnumCheck', required: false, default: null, desc: 'Enum: every integer between the lowest and highest value is used. Flag: every power of two between the lowest and highest member is used.' },
    { name: 'NAMED_FLAGS', type: 'EnumCheck', required: false, default: null, desc: 'Flag: every bit of every multi-bit alias belongs to a named member.' },
  ],

  modes: [
    {
      id: 'continuous',
      label: 'CONTINUOUS',
      blurb: 'Type three integers. Any gap between the lowest and highest is reported.',
      params: [
        { name: 'a', type: 'int', hint: 'A', input: 'number' },
        { name: 'b', type: 'int', hint: 'B', input: 'number' },
        { name: 'c', type: 'int', hint: 'C', input: 'number' },
      ],
      template: 'from enum import Enum, verify, CONTINUOUS\n@verify(CONTINUOUS)\nclass Grade(Enum):\n    A = {$a}\n    B = {$b}\n    C = {$c}\nlist(Grade)',
      cases: [
        { id: 'ok',    label: '1 2 3',  values: { a: '1', b: '2', c: '3' } },
        { id: 'gap',   label: '1 2 5',  values: { a: '1', b: '2', c: '5' } },
        { id: 'order', label: '3 1 2',  values: { a: '3', b: '1', c: '2' } },
        { id: 'wide',  label: '1 10 4', values: { a: '1', b: '10', c: '4' } },
      ],
    },
    {
      id: 'named',
      label: 'NAMED_FLAGS',
      blurb: 'RED = 1 and GREEN = 2 are named. Type a value for WHITE: are all its bits named?',
      params: [{ name: 'value', type: 'int', hint: 'WHITE', input: 'number' }],
      template: 'from enum import Flag, verify, NAMED_FLAGS\n@verify(NAMED_FLAGS)\nclass Color(Flag):\n    RED = 1\n    GREEN = 2\n    WHITE = {$value}\nlist(Color.__members__)',
      cases: [
        { id: 'three',   label: '3',  values: { value: '3' } },
        { id: 'seven',   label: '7',  values: { value: '7' } },
        { id: 'fifteen', label: '15', values: { value: '15' } },
        { id: 'four',    label: '4',  values: { value: '4' } },
      ],
    },
    {
      id: 'unique',
      label: 'UNIQUE',
      blurb: 'Give BLUE a value; reusing 1 or 2 makes it an alias.',
      params: [{ name: 'value', type: 'int | str', hint: 'BLUE', input: 'auto' }],
      template: 'from enum import Enum, verify, UNIQUE\n@verify(UNIQUE)\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    BLUE = {$value}\nlist(Color)',
      cases: [
        { id: 'ok',    label: '3', values: { value: '3' } },
        { id: 'alias', label: '1', values: { value: '1' } },
      ],
    },
  ],
  demoExplainer: 'CONTINUOUS looks at the set of values, not their order: 3, 1, 2 passes and 1, 2, 5 is missing 3 and 4. In the NAMED_FLAGS tab 3 is RED|GREEN — fine — while 7 needs bit 4, which has no name; the message gives the missing bits in hex (0x4, or "combined values of 0xc" for 15). 4 is a single bit, so WHITE becomes a member of its own and there is no alias to check. UNIQUE is the @unique check with a different message.',

  patterns: [
    {
      name: 'Guard a numbered scale',
      desc: 'Levels must be unique and without gaps.',
      code: 'from enum import IntEnum, verify, UNIQUE, CONTINUOUS\n@verify(UNIQUE, CONTINUOUS)\nclass Level(IntEnum):\n    DEBUG = 1\n    INFO = 2\n    WARNING = 3\n    ERROR = 4',
    },
    {
      name: 'Flags with named combinations',
      desc: 'NAMED_FLAGS catches a combination that refers to a bit you forgot to define.',
      code: 'from enum import Flag, verify, NAMED_FLAGS\n@verify(NAMED_FLAGS)\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n    ALL = 7',
    },
    {
      name: 'See which bits a value has',
      desc: 'The NAMED_FLAGS message points to enum.show_flag_values.',
      code: 'import enum\nenum.show_flag_values(0xc)  # [4, 8]',
    },
  ],

  examples: [
    { title: 'CONTINUOUS: no gaps',             code: 'from enum import IntEnum, verify, CONTINUOUS\n@verify(CONTINUOUS)\nclass Grade(IntEnum):\n    A = 1\n    B = 2\n    D = 4', returns: "ValueError: invalid enum 'Grade': missing values 3" },
    { title: 'CONTINUOUS on a Flag: no missing bits', code: 'from enum import Flag, verify, CONTINUOUS\n@verify(CONTINUOUS)\nclass Perm(Flag):\n    R = 1\n    W = 2\n    X = 8', returns: "ValueError: invalid flag 'Perm': missing values 4" },
    { title: 'NAMED_FLAGS',                     code: 'from enum import Flag, verify, NAMED_FLAGS\n@verify(NAMED_FLAGS)\nclass Color(Flag):\n    RED = 1\n    GREEN = 2\n    WHITE = 7', returns: "ValueError: invalid Flag 'Color': alias WHITE is missing value 0x4 [use enum.show_flag_values(value) for details]" },
    { title: 'Several checks at once',          code: 'from enum import Enum, verify, UNIQUE, CONTINUOUS\n@verify(UNIQUE, CONTINUOUS)\nclass Level(Enum):\n    LOW = 1\n    MID = 2\n    HIGH = 3\nlist(Level)', returns: '[<Level.LOW: 1>, <Level.MID: 2>, <Level.HIGH: 3>]' },
    { title: 'The checks are EnumCheck members', code: 'from enum import EnumCheck, UNIQUE\n(UNIQUE is EnumCheck.UNIQUE, list(EnumCheck))', returns: "(True, [<EnumCheck.CONTINUOUS: 'no skipped integer values'>, <EnumCheck.NAMED_FLAGS: 'multi-flag aliases may not contain unnamed flags'>, <EnumCheck.UNIQUE: 'one name per value'>])" },
    { title: 'show_flag_values',                code: 'import enum\nenum.show_flag_values(12)', returns: '[4, 8]' },
    { title: 'Long messages stop at 256 characters', code: 'from enum import Enum, verify, CONTINUOUS\ntry:\n    @verify(CONTINUOUS)\n    class Big(Enum):\n        A = 1\n        B = 1000\nexcept ValueError as e:\n    message = str(e)\n(len(message), message[-10:])', returns: "(256, ' 57, 58, 5')" },
    { title: 'Only for enum classes',           code: 'from enum import verify, UNIQUE\nverify(UNIQUE)(int)', returns: "TypeError: the 'verify' decorator only works with Enum and Flag" },
  ],

  pitfalls: [
    {
      name: 'Check names as strings',
      desc: "verify compares each check by identity with the EnumCheck members, so the string 'UNIQUE' matches nothing and the class passes unchecked.",
      wrong: { label: "verify('UNIQUE')", code: "from enum import Enum, verify\n@verify('UNIQUE')\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\nlist(Color.__members__)", output: "['RED', 'CRIMSON']" },
      fix:   { label: 'verify(UNIQUE)',   code: 'from enum import Enum, verify, UNIQUE\n@verify(UNIQUE)\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1', output: "ValueError: aliases found in <enum 'Color'>: CRIMSON -> RED" },
    },
    {
      name: '@verify without arguments',
      desc: 'verify is called with the checks first. Bare @verify treats the class as a check and replaces the class name with a verify object.',
      wrong: { label: '@verify',        code: 'from enum import Enum, verify\n@verify\nclass Color(Enum):\n    RED = 1\nColor.RED', output: "AttributeError: 'verify' object has no attribute 'RED'" },
      fix:   { label: '@verify(UNIQUE)', code: 'from enum import Enum, verify, UNIQUE\n@verify(UNIQUE)\nclass Color(Enum):\n    RED = 1\nColor.RED', output: '<Color.RED: 1>' },
    },
  ],

  when: {
    use: [
      'Numbered scales that must have no gaps (levels, priorities, steps)',
      'Flags with named combinations that must only use defined bits',
      'Several constraints in one decorator',
    ],
    avoid: [
      'Only the alias check → @unique is shorter and works on every version',
      'Rules beyond these three → check in __init_subclass__ or after the class',
    ],
  },

  notes: {
    cpython:      'Lib/enum.py: verify is a class — verify(*checks) stores the checks and calling the instance with the enum runs them. EnumCheck is a StrEnum (built with _simple_enum); CONTINUOUS, NAMED_FLAGS and UNIQUE are its members, exported at module level',
    'CONTINUOUS': 'Uses set(member values); fewer than two distinct values always pass. For Flag the range runs over the powers of two between the lowest and highest member. The message is cut to 256 characters',
    'NAMED_FLAGS': 'Looks only at aliases (multi-bit values) and skips negative ones; the unnamed bits of all failing aliases are combined into one hex number',
  },

  related: [
    { name: 'unique',  slug: 'unique',  when: 'The UNIQUE check as its own decorator' },
    { name: 'Flag',    slug: 'flag',    when: 'Where NAMED_FLAGS applies' },
    { name: 'IntEnum', slug: 'intenum', when: 'Typical target for CONTINUOUS' },
    { name: 'StrEnum', slug: 'strenum', when: 'What EnumCheck is built on' },
    { name: 'ValueError', slug: 'valueerror', when: 'What a failed check raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I validate an enum in Python?',
      a: '@enum.verify(...) with the checks you need: UNIQUE (no aliases), CONTINUOUS (no missing integer values or flag bits) and NAMED_FLAGS (multi-bit flag aliases only use named bits). It raises ValueError at class creation.',
    },
    {
      q: 'What does "invalid Flag ...: alias X is missing value 0x4" mean?',
      a: 'The alias X has a bit (here 4) that no single-bit member defines. Add a member for that bit, or change the alias. enum.show_flag_values(value) lists the bits of a value.',
    },
    {
      q: 'Is enum.show_flag_values public?',
      a: 'It is documented (added in 3.11) but not in enum.__all__, so import it as enum.show_flag_values. It returns the powers of two in a non-negative int, lowest first.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.verify',
    meta:  'enum.verify',
  },

};
