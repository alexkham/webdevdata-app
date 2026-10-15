// content/reference/python/stdlib/enum/flag.js

export const meta = {
  slug:        'flag',
  name:        'enum.Flag',
  signature:   'class Name(enum.Flag, boundary=STRICT)',
  blurb:       'An Enum for bit flags: members combine with | & ^ ~, a combination is itself a value of the class, and in / iteration / len() look at the individual bits.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.6+ (iteration and len() since 3.11)',
  searchTerms: 'flag python enum.Flag bit flags bitmask combine flags | & ^ ~ invert permissions check flag set in flag iterate flags len flag empty flag zero auto powers of two pseudo member alias multi-bit',
};

export const method = {
  slug:      'flag',
  name:      'enum.Flag',
  signature: 'class Name(enum.Flag, boundary=STRICT)',
  returns:   { type: 'EnumType', desc: 'A flag class: single-bit members, plus a value of the class for every valid combination.' },

  category:    'enum class',
  version:     'Python 3.6+ (iteration and len() since 3.11)',
  hasLiveDemo: true,

  subtitle: 'Give each member its own bit (auto() does it), then build sets of options with |. Perm.R | Perm.W is a Perm, `Perm.W in perm` tests a bit, list(perm) gives the members it contains, and the empty flag Perm(0) is false.',

  covers: ['Flag'],

  cheat: {
    commonCall: 'perm = Perm.R | Perm.W',
    returns:    '<Perm.R|W: 6> — a Perm; Perm.W in perm → True',
    replaces:   'int bit masks like READ = 4; mode & READ',
    watchOut:   'a value that is not a power of two is an alias, not an iterated member',
  },

  parameters: [
    { name: 'Name',     type: 'identifier',   required: true,  default: null,     desc: 'Your flag class. Give members powers of two (1, 2, 4, …) or auto(); multi-bit values become named aliases for combinations.' },
    { name: 'boundary', type: 'FlagBoundary', required: false, default: 'STRICT', desc: 'What Name(value) does with bits no member owns: STRICT raises ValueError, CONFORM drops them, EJECT returns a plain int, KEEP keeps them.' },
  ],

  modes: [
    {
      id: 'members',
      label: 'value → members',
      blurb: 'Type an integer: which members does it contain? (RWX = 7 is an alias for all three bits.)',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n    RWX = 7\np = Perm({$value})\n(list(p), len(p), bool(p))',
      cases: [
        { id: 'rw',   label: '6', values: { value: '6' } },
        { id: 'all',  label: '7', values: { value: '7' } },
        { id: 'zero', label: '0', values: { value: '0' } },
        { id: 'bad',  label: '9', values: { value: '9' } },
      ],
    },
    {
      id: 'ops',
      label: '| & ^',
      blurb: 'Pick two members by name and combine them.',
      params: [
        { name: 'a', type: 'str', hint: 'a member name', input: 'text' },
        { name: 'b', type: 'str', hint: 'a member name', input: 'text' },
      ],
      template: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n    RWX = 7\na, b = Perm[{$a}], Perm[{$b}]\n(a | b, a & b, a ^ b)',
      cases: [
        { id: 'rw',  label: 'R, W',   values: { a: 'R', b: 'W' } },
        { id: 'all', label: 'RWX, W', values: { a: 'RWX', b: 'W' } },
        { id: 'same', label: 'X, X',  values: { a: 'X', b: 'X' } },
        { id: 'bad', label: 'R, Q',   values: { a: 'R', b: 'Q' } },
      ],
    },
    {
      id: 'invert',
      label: '~ and in',
      blurb: 'Type an integer: its complement within the defined bits, and whether W is set.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n    RWX = 7\np = Perm({$value})\n(~p, Perm.W in p)',
      cases: [
        { id: 'rw',   label: '6', values: { value: '6' } },
        { id: 'zero', label: '0', values: { value: '0' } },
        { id: 'w',    label: '2', values: { value: '2' } },
        { id: 'neg',  label: '-1', values: { value: '-1' } },
      ],
    },
  ],
  demoExplainer: 'Iteration and len() only count the single-bit members R, W and X: 7 contains all three even though its name is the alias RWX. 0 is the empty flag — no members, length 0, false. 9 has the bit 8 that no member owns, and the default STRICT boundary rejects it. ~ flips only the defined bits, so ~Perm(6) is X and ~Perm(0) is the alias RWX. -1 is accepted: negative values count from the top of the defined bits, and -1 means all of them.',

  patterns: [
    {
      name: 'Options as a flag',
      desc: 'auto() assigns 1, 2, 4, …; a "none" value is just Name(0).',
      code: 'from enum import Flag, auto\nclass Perm(Flag):\n    R = auto()\n    W = auto()\n    X = auto()\nNONE = Perm(0)',
    },
    {
      name: 'Add, remove, test',
      desc: 'Set with |=, clear with &= ~, test with in.',
      code: 'perm = Perm.R\nperm |= Perm.W\nperm &= ~Perm.R\nif Perm.W in perm:\n    allow_write()',
    },
    {
      name: 'Named combinations',
      desc: 'A multi-bit value inside the class is an alias that gives the combination a name.',
      code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n    RW = R | W\n    ALL = R | W | X',
    },
    {
      name: 'Store as an int, restore with the class',
      desc: '.value is the int; Perm(n) rebuilds the combination.',
      code: 'saved = perm.value\nperm = Perm(saved)',
    },
  ],

  examples: [
    { title: 'Combine with |, test with in',     code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\nperm = Perm.R | Perm.W\n(perm, Perm.W in perm, Perm.X in perm)', returns: '(<Perm.R|W: 6>, True, False)' },
    { title: 'Iterate the set bits',              code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\nlist(Perm.R | Perm.X)', returns: '[<Perm.R: 4>, <Perm.X: 1>]' },
    { title: 'Multi-bit aliases are not iterated', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n    RWX = 7\n(list(Perm), Perm.RWX, len(Perm.RWX))', returns: '([<Perm.R: 4>, <Perm.W: 2>, <Perm.X: 1>], <Perm.RWX: 7>, 3)' },
    { title: 'The empty flag',                    code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n(Perm(0), bool(Perm(0)), Perm(0).name, str(Perm(0)))', returns: "(<Perm: 0>, False, None, 'Perm(0)')" },
    { title: 'auto() gives powers of two',        code: 'from enum import Flag, auto\nclass Color(Flag):\n    RED = auto()\n    GREEN = auto()\n    BLUE = auto()\n[m.value for m in Color]', returns: '[1, 2, 4]' },
    { title: '~ stays within the defined bits',   code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n~Perm.R', returns: '<Perm.W|X: 3>' },
    { title: 'Any valid combination is in the class (3.12.10+, 3.13.3+)', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n(6 in Perm, 9 in Perm)', returns: '(True, False)' },
    { title: 'Flags do not mix with ints',        code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\nPerm.R | 1', returns: "TypeError: unsupported operand type(s) for |: 'Perm' and 'int'" },
  ],

  pitfalls: [
    {
      name: 'A value that is not a power of two',
      desc: 'X = 3 shares bits with R and W, so it becomes an alias for R|W: it is in __members__ but iteration and len() skip it.',
      wrong: { label: 'X = 3', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 1\n    W = 2\n    X = 3\nlist(Perm)', output: '[<Perm.R: 1>, <Perm.W: 2>]' },
      fix:   { label: 'X = 4', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 1\n    W = 2\n    X = 4\nlist(Perm)', output: '[<Perm.R: 1>, <Perm.W: 2>, <Perm.X: 4>]' },
    },
    {
      name: 'Testing a bit with ==',
      desc: 'A combination is a different value from each of its members. Use in (or &) to test one bit.',
      wrong: { label: 'perm == Perm.R', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\nperm = Perm.R | Perm.W\nperm == Perm.R', output: 'False' },
      fix:   { label: 'Perm.R in perm', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\nperm = Perm.R | Perm.W\nPerm.R in perm', output: 'True' },
    },
    {
      name: 'Bits no member owns',
      desc: 'With the default STRICT boundary, a stray bit (here 8) is a ValueError that lists the given and allowed bits. boundary=CONFORM drops unknown bits instead (or validate the input yourself).',
      wrong: { label: 'STRICT', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\nPerm(9)', output: "ValueError: <flag 'Perm'> invalid value 9\n    given 0b0 1001\n  allowed 0b0 0111" },
      fix:   { label: 'CONFORM', code: 'from enum import Flag, CONFORM\nclass Perm(Flag, boundary=CONFORM):\n    R = 4\n    W = 2\n    X = 1\nPerm(9)', output: '<Perm.X: 1>' },
    },
  ],

  when: {
    use: [
      'Sets of independent on/off options: permissions, styles, feature switches',
      'Replacing int bit masks with names that show up in reprs',
    ],
    avoid: [
      'Options that must stay plain ints for other code (os, sockets, C APIs) → IntFlag',
      'Mutually exclusive choices → Enum',
      'Large or open-ended sets of tags → a set of Enum members',
    ],
  },

  notes: {
    cpython:      'Lib/enum.py: Flag._missing_ creates a pseudo-member the first time a combination is asked for and caches it in _value2member_map_, so Perm(6) is Perm(6)',
    'Iteration':  'Iteration yields the canonical single-bit members in definition order; len() counts the set bits. Both were added in 3.11 — Python 3.10 raises TypeError for list(perm)',
    'Zero':       'The empty flag prints as <Perm: 0> since 3.11 (Python 3.10 showed <Perm.0: 0>)',
    'Membership': '`6 in Perm` is True for any valid combination from 3.12.10 and 3.13.3 on. Earlier 3.12 / 3.13 releases only checked values already created, so 6 in Perm was False until Perm(6) had been built once',
  },

  related: [
    { name: 'IntFlag',      slug: 'intflag',      when: 'Flags that are also ints' },
    { name: 'FlagBoundary', slug: 'flagboundary', when: 'What happens to unknown bits' },
    { name: 'auto',         slug: 'auto',         when: 'Powers of two without counting' },
    { name: 'verify',       slug: 'verify',       when: 'NAMED_FLAGS: aliases must use named bits' },
    { name: '| operator',   slug: 'bitwise-or',   when: 'How combining works on ints', category: 'operators' },
    { name: '~ operator',   slug: 'invert',       when: 'Bitwise not on ints', category: 'operators' },
  ],

  faq: [
    {
      q: 'How do I check whether a flag is set in Python?',
      a: 'Use in: Perm.W in perm. It is True when every bit of Perm.W is set in perm. (perm & Perm.W) is the same test written with &; it gives a Perm that is false when the bit is missing.',
    },
    {
      q: 'What is the difference between Flag and IntFlag?',
      a: 'IntFlag members are ints: they combine with plain ints, compare equal to numbers and keep unknown bits (boundary KEEP). Flag members are not ints, refuse | with an int, and reject unknown bits by default (STRICT).',
    },
    {
      q: 'How do I list the flags contained in a value?',
      a: 'Iterate it: list(perm) gives its single-bit members in definition order (3.11+). perm.name gives them joined with "|", e.g. "R|W".',
    },
    {
      q: 'How do I clear a flag?',
      a: 'perm &= ~Perm.W. ~ inverts within the bits the class defines, so the result is still a valid Perm.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.Flag',
    meta:  'enum.Flag',
  },

};
