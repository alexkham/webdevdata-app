// content/reference/python/stdlib/enum/flagboundary.js

export const meta = {
  slug:        'flagboundary',
  name:        'enum.FlagBoundary',
  signature:   'class Name(Flag, boundary=STRICT | CONFORM | EJECT | KEEP)',
  blurb:       'What Flag(value) does with bits no member owns: STRICT raises ValueError, CONFORM drops them, EJECT returns a plain int, KEEP keeps them in the flag.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'FlagBoundary enum.FlagBoundary STRICT CONFORM EJECT KEEP enum.STRICT enum.CONFORM enum.EJECT enum.KEEP flag boundary unknown bits invalid value given allowed out of range flag value IntFlag default KEEP Flag default STRICT',
};

export const method = {
  slug:      'flagboundary',
  name:      'enum.FlagBoundary',
  signature: 'class Name(Flag, boundary=STRICT | CONFORM | EJECT | KEEP)',
  returns:   { type: 'FlagBoundary', desc: 'A StrEnum of four members, also exported as enum.STRICT, enum.CONFORM, enum.EJECT and enum.KEEP.' },

  category:    'enum constant',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'Pass the boundary as a class keyword. It only matters when a value has a bit outside the members (or is out of range): Flag defaults to STRICT, IntFlag to KEEP. Negative values within range are counted from the top of the defined bits under every boundary.',

  covers: ['FlagBoundary', 'STRICT', 'CONFORM', 'EJECT', 'KEEP'],

  cheat: {
    commonCall: 'class Perm(Flag, boundary=CONFORM):',
    returns:    'Perm(13) → <Perm.R|X: 5> (bit 8 dropped)',
    replaces:   'masking input by hand before Perm(value & 7)',
    watchOut:   "pass the member (CONFORM), not the string 'conform'",
  },

  parameters: [
    { name: 'STRICT',  type: 'FlagBoundary', required: false, default: null, desc: "Out-of-range values raise ValueError showing the given and allowed bits. Default for Flag." },
    { name: 'CONFORM', type: 'FlagBoundary', required: false, default: null, desc: 'Unknown bits are removed: the value is ANDed with the defined bits.' },
    { name: 'EJECT',   type: 'FlagBoundary', required: false, default: null, desc: 'The flag gives up: Name(value) returns the plain int.' },
    { name: 'KEEP',    type: 'FlagBoundary', required: false, default: null, desc: 'Unknown bits stay, and show as a number in the name (R|8). Default for IntFlag.' },
  ],

  modes: [
    {
      id: 'strict',
      label: 'STRICT',
      blurb: 'Type an integer. R, W, X own the bits 4, 2, 1.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag, STRICT\nclass Perm(Flag, boundary=STRICT):\n    R = 4\n    W = 2\n    X = 1\nPerm({$value})',
      cases: [
        { id: 'ok',  label: '7',  values: { value: '7' } },
        { id: 'bad', label: '13', values: { value: '13' } },
        { id: 'neg', label: '-1', values: { value: '-1' } },
        { id: 'far', label: '-9', values: { value: '-9' } },
      ],
    },
    {
      id: 'conform',
      label: 'CONFORM',
      blurb: 'Unknown bits are dropped.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag, CONFORM\nclass Perm(Flag, boundary=CONFORM):\n    R = 4\n    W = 2\n    X = 1\nPerm({$value})',
      cases: [
        { id: 'ok',  label: '7',  values: { value: '7' } },
        { id: 'bad', label: '13', values: { value: '13' } },
        { id: 'only', label: '8', values: { value: '8' } },
        { id: 'far', label: '-9', values: { value: '-9' } },
      ],
    },
    {
      id: 'eject',
      label: 'EJECT',
      blurb: 'Out-of-range values come back as plain ints.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag, EJECT\nclass Perm(Flag, boundary=EJECT):\n    R = 4\n    W = 2\n    X = 1\nPerm({$value})',
      cases: [
        { id: 'ok',  label: '7',  values: { value: '7' } },
        { id: 'bad', label: '13', values: { value: '13' } },
        { id: 'far', label: '-9', values: { value: '-9' } },
      ],
    },
    {
      id: 'keep',
      label: 'KEEP',
      blurb: 'Unknown bits are kept and named by their number.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag, KEEP\nclass Perm(Flag, boundary=KEEP):\n    R = 4\n    W = 2\n    X = 1\nPerm({$value})',
      cases: [
        { id: 'ok',   label: '7',  values: { value: '7' } },
        { id: 'bad',  label: '13', values: { value: '13' } },
        { id: 'only', label: '8',  values: { value: '8' } },
        { id: 'far',  label: '-9', values: { value: '-9' } },
      ],
    },
  ],
  demoExplainer: '13 is 8 + 4 + 1: STRICT rejects the 8 (the error lines up the given and allowed bits), CONFORM keeps R|X, EJECT returns 13 as an int and KEEP names it R|X|8. -1 is in range everywhere and means all defined bits. -9 is out of range: STRICT raises, CONFORM masks it down to R|W|X, EJECT returns -9, and KEEP adds 16 (the smallest power of two above 9), giving 7 = R|W|X.',

  patterns: [
    {
      name: 'Accept noisy input, keep known bits',
      desc: 'CONFORM is a built-in mask for flags read from files or the network.',
      code: 'from enum import Flag, CONFORM, auto\nclass Feature(Flag, boundary=CONFORM):\n    DARK_MODE = auto()\n    BETA = auto()\n\nfeatures = Feature(raw_bits)',
    },
    {
      name: 'Strict IntFlag',
      desc: 'IntFlag keeps unknown bits by default; switch to STRICT for validated input.',
      code: 'from enum import IntFlag, STRICT\nclass Mode(IntFlag, boundary=STRICT):\n    READ = 4\n    WRITE = 2',
    },
    {
      name: 'Check what you got back from EJECT',
      desc: 'With EJECT the result may be a plain int.',
      code: 'value = Perm(raw)\nif not isinstance(value, Perm):\n    log.warning("unknown permission bits %d", value)',
    },
  ],

  examples: [
    { title: 'Four members, also module constants', code: "from enum import FlagBoundary, STRICT, KEEP\n(list(FlagBoundary), STRICT is FlagBoundary.STRICT, str(KEEP))", returns: "([<FlagBoundary.STRICT: 'strict'>, <FlagBoundary.CONFORM: 'conform'>, <FlagBoundary.EJECT: 'eject'>, <FlagBoundary.KEEP: 'keep'>], True, 'keep')" },
    { title: 'CONFORM drops unknown bits',  code: 'from enum import Flag, CONFORM\nclass Perm(Flag, boundary=CONFORM):\n    R = 4\n    W = 2\n    X = 1\nPerm(13)', returns: '<Perm.R|X: 5>' },
    { title: 'EJECT returns an int',        code: 'from enum import Flag, EJECT\nclass Perm(Flag, boundary=EJECT):\n    R = 4\n    W = 2\n    X = 1\n(Perm(13), type(Perm(13)))', returns: "(13, <class 'int'>)" },
    { title: 'KEEP keeps them',             code: 'from enum import Flag, KEEP\nclass Perm(Flag, boundary=KEEP):\n    R = 4\n    W = 2\n    X = 1\n(Perm(13), Perm(13).name)', returns: "(<Perm.R|X|8: 13>, 'R|X|8')" },
    { title: 'STRICT shows given vs allowed bits', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\nPerm(13)', returns: "ValueError: <flag 'Perm'> invalid value 13\n    given 0b0 1101\n  allowed 0b0 0111" },
    { title: 'Values that only use defined bits never trigger it', code: 'from enum import Flag, EJECT\nclass Perm(Flag, boundary=EJECT):\n    R = 4\n    W = 2\n    X = 1\nPerm(6)', returns: '<Perm.R|W: 6>' },
  ],

  pitfalls: [
    {
      name: 'The boundary as a string',
      desc: "The boundary is compared by identity with the FlagBoundary members. A plain string is accepted when the class is created and fails only when an unknown bit shows up.",
      wrong: { label: "boundary='strict'", code: "from enum import Flag\nclass Perm(Flag, boundary='strict'):\n    R = 4\n    W = 2\nPerm(8)", output: "ValueError: <flag 'Perm'> unknown flag boundary 'strict'" },
      fix:   { label: 'boundary=STRICT',   code: 'from enum import Flag, STRICT\nclass Perm(Flag, boundary=STRICT):\n    R = 4\n    W = 2\nPerm(8)', output: "ValueError: <flag 'Perm'> invalid value 8\n    given 0b0 1000\n  allowed 0b0 0110" },
    },
    {
      name: 'Treating an EJECT result as a flag',
      desc: 'EJECT returns a plain int for out-of-range values, and ints have no .name. Use KEEP if you always want a flag back.',
      wrong: { label: 'EJECT', code: 'from enum import Flag, EJECT\nclass Perm(Flag, boundary=EJECT):\n    R = 4\n    X = 1\nPerm(9).name', output: "AttributeError: 'int' object has no attribute 'name'" },
      fix:   { label: 'KEEP',  code: 'from enum import Flag, KEEP\nclass Perm(Flag, boundary=KEEP):\n    R = 4\n    X = 1\nPerm(9).name', output: "'X|8'" },
    },
  ],

  when: {
    use: [
      'STRICT: values that must be valid (configuration you control)',
      'CONFORM: input that may carry bits you do not care about',
      'KEEP: wrapping OS or protocol masks that must round-trip unchanged',
      'EJECT: when unknown values should stop being flags at all',
    ],
    avoid: [
      'Plain Enum classes — the keyword is accepted but has no effect there',
    ],
  },

  notes: {
    cpython:    'Lib/enum.py: class FlagBoundary(StrEnum) with STRICT, CONFORM, EJECT, KEEP = auto(); Flag._missing_ applies the boundary when a value is outside ~all_bits..all_bits or uses an undefined bit inside that range',
    'Defaults': 'Flag is defined with boundary=STRICT, IntFlag with boundary=KEEP; a subclass inherits its base boundary unless it passes its own',
    'Negatives': 'A negative value within range is converted to all_bits + 1 + value under every boundary; KEEP extends the range for larger negatives',
  },

  related: [
    { name: 'Flag',    slug: 'flag',    when: 'Default boundary STRICT' },
    { name: 'IntFlag', slug: 'intflag', when: 'Default boundary KEEP' },
    { name: 'StrEnum', slug: 'strenum', when: 'What FlagBoundary is' },
    { name: 'ValueError', slug: 'valueerror', when: 'What STRICT raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "invalid value ... given ... allowed" mean for a Flag?',
      a: 'The Flag uses the STRICT boundary and the value has bits no member defines. The two binary lines show the bits you gave and the bits that exist. Fix the value, or create the class with boundary=CONFORM (drop them) or KEEP (keep them).',
    },
    {
      q: 'What is the default boundary of Flag and IntFlag?',
      a: 'Flag uses STRICT; IntFlag uses KEEP, so IntFlag accepts any integer.',
    },
    {
      q: 'Which boundary should I use for data from outside the program?',
      a: 'CONFORM if unknown bits can be ignored, KEEP if they must be preserved (for example to write the value back), STRICT if they indicate an error.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.FlagBoundary',
    meta:  'enum.FlagBoundary',
  },

};
