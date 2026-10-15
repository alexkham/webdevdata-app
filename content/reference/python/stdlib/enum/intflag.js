// content/reference/python/stdlib/enum/intflag.js

export const meta = {
  slug:        'intflag',
  name:        'enum.IntFlag',
  signature:   'class Name(enum.IntFlag, boundary=KEEP)',
  blurb:       'A Flag whose members are also ints: they combine with plain ints, keep bits no member owns, and str() / json give the number.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.6+ (str() is the number since 3.11)',
  searchTerms: 'intflag python enum.IntFlag integer flags bit mask int flag combine with int unknown bits KEEP os flags re.RegexFlag permissions bitwise or int str number 3.11',
};

export const method = {
  slug:      'intflag',
  name:      'enum.IntFlag',
  signature: 'class Name(enum.IntFlag, boundary=KEEP)',
  returns:   { type: 'EnumType', desc: 'A flag class whose members and combinations are int instances.' },

  category:    'enum class',
  version:     'Python 3.6+ (str() is the number since 3.11)',
  hasLiveDemo: true,

  subtitle: 'The drop-in replacement for int bit masks: Perm.R | 8 still works, every value is accepted (unknown bits are kept and shown as a number in the name), and str(), format() and json see a plain int. Only the repr reveals the names.',

  covers: ['IntFlag'],

  cheat: {
    commonCall: 'class Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1',
    returns:    'Perm.R | 8 → <Perm.R|8: 12>, str(Perm.R) → "4"',
    replaces:   'module-level int masks: READ = 4; mode | READ',
    watchOut:   'no validation — any int becomes a Perm, and unrelated IntFlags combine silently',
  },

  parameters: [
    { name: 'Name',     type: 'identifier',   required: true,  default: null,   desc: 'Your flag class; give members powers of two (or auto()).' },
    { name: 'boundary', type: 'FlagBoundary', required: false, default: 'KEEP', desc: 'KEEP keeps unknown bits; pass STRICT, CONFORM or EJECT for other behaviour.' },
  ],

  modes: [
    {
      id: 'value',
      label: 'any int',
      blurb: 'Type an integer. Bits outside R, W, X are kept and named by their number.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\np = Perm({$value})\n(p, str(p), list(p))',
      cases: [
        { id: 'rw',      label: '6',  values: { value: '6' } },
        { id: 'unknown', label: '12', values: { value: '12' } },
        { id: 'only',    label: '8',  values: { value: '8' } },
        { id: 'neg',     label: '-1', values: { value: '-1' } },
      ],
    },
    {
      id: 'ints',
      label: 'with ints',
      blurb: '| with a plain int gives a Perm; arithmetic gives a plain int.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\n(Perm.R | {$value}, Perm.R + {$value})',
      cases: [
        { id: 'one',   label: '1',  values: { value: '1' } },
        { id: 'eight', label: '8',  values: { value: '8' } },
        { id: 'zero',  label: '0',  values: { value: '0' } },
      ],
    },
    {
      id: 'invert',
      label: '~',
      blurb: 'Type an integer: IntFlag inverts every bit, unknown ones included.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\n~Perm({$value})',
      cases: [
        { id: 'r',     label: '4',  values: { value: '4' } },
        { id: 'eight', label: '8',  values: { value: '8' } },
        { id: 'zero',  label: '0',  values: { value: '0' } },
        { id: 'all',   label: '15', values: { value: '15' } },
      ],
    },
  ],
  demoExplainer: 'IntFlag uses the KEEP boundary: 12 is R plus the unknown bit 8, so its name is R|8, and 8 alone has no name at all — the repr is just <Perm: 8>. str() is the plain number. Perm.R | 1 is a Perm, but Perm.R + 1 is int arithmetic. ~ with KEEP inverts the value as a negative int and maps it back into the bits in use, so ~Perm(8) is R|W|X and ~Perm(15) is <Perm: 16>.',

  patterns: [
    {
      name: 'Replace int constants without breaking callers',
      desc: 'Existing code that does mode & 4 or passes ints keeps working.',
      code: 'from enum import IntFlag\nclass Mode(IntFlag):\n    READ = 4\n    WRITE = 2\n    EXEC = 1\nos_call(path, Mode.READ | Mode.WRITE)',
    },
    {
      name: 'Readable flags from an int you received',
      desc: 'Wrap the raw number to get names in logs; unknown bits stay visible.',
      code: 'log.debug("mode %r", Mode(raw_mode))',
    },
    {
      name: 'Validate input bits',
      desc: 'boundary=STRICT turns unknown bits into a ValueError.',
      code: 'from enum import IntFlag, STRICT\nclass Mode(IntFlag, boundary=STRICT):\n    READ = 4\n    WRITE = 2',
    },
  ],

  examples: [
    { title: 'Members are ints',               code: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\n(Perm.R == 4, Perm.R + 1, Perm.R | 1)', returns: '(True, 5, <Perm.R|X: 5>)' },
    { title: 'Unknown bits are kept',          code: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\n(Perm(12), Perm(8))', returns: '(<Perm.R|8: 12>, <Perm: 8>)' },
    { title: 'str() and format() see the int', code: "from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n(str(Perm.R | Perm.W), format(Perm.R, '#b'))", returns: "('6', '0b100')" },
    { title: 'json writes numbers',            code: 'import json\nfrom enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\njson.dumps([Perm.R, Perm.R | Perm.W])', returns: "'[4, 6]'" },
    { title: 'Arithmetic gives plain ints',    code: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n(Perm.R + Perm.W, type(Perm.R + Perm.W))', returns: "(6, <class 'int'>)" },
    { title: 'A plain int on the left works too', code: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\n8 | Perm.R', returns: '<Perm.R|8: 12>' },
    { title: 're flags are an IntFlag',        code: 'import re\n(isinstance(re.I, int), re.I | re.M)', returns: '(True, re.IGNORECASE|re.MULTILINE)' },
  ],

  pitfalls: [
    {
      name: 'Expecting invalid values to be rejected',
      desc: 'The default KEEP boundary accepts every int. Choose STRICT when the bits come from outside and must be valid.',
      wrong: { label: 'KEEP (default)', code: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\nPerm(1000)', output: '<Perm: 1000>' },
      fix:   { label: 'boundary=STRICT', code: 'from enum import IntFlag, STRICT\nclass Perm(IntFlag, boundary=STRICT):\n    R = 4\n    W = 2\n    X = 1\nPerm(1000)', output: "ValueError: <flag 'Perm'> invalid value 1000\n    given 0b0 1111101000\n  allowed 0b0 0000000111" },
    },
    {
      name: 'Mixing two unrelated IntFlags',
      desc: 'Members are ints, so a Color member is accepted wherever an int is: the result silently takes the left class. Plain Flag classes refuse to mix.',
      wrong: { label: 'IntFlag', code: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    X = 1\nclass Color(IntFlag):\n    RED = 1\nPerm.R | Color.RED', output: '<Perm.R|X: 5>' },
      fix:   { label: 'Flag',    code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    X = 1\nclass Color(Flag):\n    RED = 1\nPerm.R | Color.RED', output: "TypeError: unsupported operand type(s) for |: 'Perm' and 'Color'" },
    },
    {
      name: 'Expecting names from str()',
      desc: "Since 3.11 str() of an IntFlag is the number, like format() and f-strings. Use repr() or .name for the names.",
      wrong: { label: 'str(perm)',  code: "from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\nf'mode: {Perm.R | Perm.W}'", output: "'mode: 6'" },
      fix:   { label: 'perm.name', code: "from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\nf'mode: {(Perm.R | Perm.W).name}'", output: "'mode: R|W'" },
    },
  ],

  when: {
    use: [
      'Bit masks that other code reads as ints: OS flags, protocol fields, C extensions',
      'Wrapping ints you receive so logs and reprs show names',
    ],
    avoid: [
      'New option sets where nothing needs ints → Flag (stricter: no mixing, STRICT boundary)',
      'Single choices → IntEnum or Enum',
    ],
  },

  notes: {
    cpython:     'Lib/enum.py: class IntFlag(int, ReprEnum, Flag, boundary=KEEP) whose body is only a docstring — int data, Flag operators, ReprEnum keeps int.__str__ / int.__format__',
    'Unknown bits': 'With KEEP a value outside the members gets a name like R|8; the leftover part is written with _numeric_repr_ (repr, so decimal, by default — re.RegexFlag uses hex)',
    '3.11 change': 'str() became int.__str__() (Python 3.10 printed "Perm.R"); the zero value prints as <Perm: 0>',
  },

  related: [
    { name: 'Flag',         slug: 'flag',         when: 'Flags that are not ints' },
    { name: 'FlagBoundary', slug: 'flagboundary', when: 'KEEP, STRICT, CONFORM, EJECT' },
    { name: 'IntEnum',      slug: 'intenum',      when: 'Int members that do not combine' },
    { name: 'global_enum',  slug: 'global-enum',  when: 'How re prints re.IGNORECASE|re.MULTILINE' },
    { name: 're flags',     slug: 'flags',        when: 'The best-known IntFlag', category: 'stdlib/re' },
  ],

  faq: [
    {
      q: 'What is the difference between IntFlag and Flag?',
      a: 'IntFlag members are ints: they compare equal to numbers, combine with plain ints and keep unknown bits. Flag members are not ints, refuse to mix with ints or other flag classes, and reject unknown bits by default.',
    },
    {
      q: 'Why does my IntFlag repr show a number like R|8?',
      a: 'The value contains a bit (8) that no member defines. IntFlag keeps such bits (boundary KEEP) and appends them to the name as a number.',
    },
    {
      q: 'How do I convert an IntFlag to an int?',
      a: 'It already is one: Perm.R + 0, int(Perm.R) and json.dumps all see the number. .value gives the same int.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.IntFlag',
    meta:  'enum.IntFlag',
  },

};
