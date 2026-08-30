// content/reference/python/functions/int-bit_count.js
//
// Slug is type-prefixed: `bit_count` is an int method.

export const meta = {
  slug:        'int-bit_count',
  name:        'int.bit_count',
  signature:   'int.bit_count()',
  blurb:       'How many bits are set to 1 in the number, ignoring the sign.',
  category:    'integer',
  type:        'int',
  hasLiveDemo: true,
  version:     'Python 3.10+',
  searchTerms: 'bit count popcount population count ones set bits hamming weight int',
};

export const method = {
  slug:      'int-bit_count',
  name:      'int.bit_count',
  signature: 'int.bit_count()',
  returns:   { type: 'int', desc: 'Number of 1 bits in the absolute value. Also called the population count or Hamming weight.' },

  category:    'Int method',
  version:     'Python 3.10+',
  hasLiveDemo: true,

  subtitle: 'Population count: how many bits are ON. Like bit_length, it works on the magnitude, so n and -n give the same answer.',

  cheat: {
    commonCall: 'n.bit_count()',
    returns:    'int — the number of 1 bits',
    replaces:   'bin(n).count("1")',
    watchOut:   'Python 3.10+ only — there is no builtin equivalent before that',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'int', hint: 'integer to count bits in', input: 'number' },
  ],
  demoTemplate: '({n}).bit_count()',
  cases: [
    { id: 'zero',      label: 'zero',              values: { n: 0 } },
    { id: 'three-set', label: 'three bits (7)',    values: { n: 7 } },
    { id: 'full-byte', label: 'full byte (255)',   values: { n: 255 } },
    { id: 'power',     label: 'power of two (64)', values: { n: 64 } },
    { id: 'negative',  label: 'negative (-7)',     values: { n: -7 } },
    { id: 'mixed',     label: 'mixed (1000)',      values: { n: 1000 } },
  ],
  demoExplainer: 'bit_count counts the 1s in the binary form. 7 is 111, so three. 255 is 11111111, so eight. Any power of two has exactly one bit set. The sign is dropped before counting, which is why -7 also gives three — this counts the magnitude, not a two-complement representation.',

  patterns: [
    {
      name: 'Hamming distance between two ints',
      desc: 'XOR marks the differing bits; bit_count tallies them.',
      code: 'distance = (a ^ b).bit_count()',
    },
    {
      name: 'Test for a power of two',
      desc: 'Exactly one bit set means a power of two.',
      code: 'is_power_of_two = n > 0 and n.bit_count() == 1',
    },
    {
      name: 'Count members of a bitmask set',
      desc: 'When flags are packed into an int, the set size is the popcount.',
      code: 'enabled_flags = mask.bit_count()',
    },
  ],

  examples: [
    { title: 'Zero has none',    code: '(0).bit_count()',   returns: '0' },
    { title: 'Three set bits',   code: '(7).bit_count()',   returns: '3' },
    { title: 'Full byte',        code: '(255).bit_count()', returns: '8' },
    { title: 'Power of two',     code: '(64).bit_count()',  returns: '1' },
    { title: 'Sign is ignored',  code: '(-7).bit_count()',  returns: '3' },
    { title: 'Hamming distance', code: '(0b1011 ^ 0b1101).bit_count()', returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Python 3.10 or newer only',
      desc: 'Calling it on an older interpreter raises AttributeError. If you support older versions you need a fallback.',
      wrong: { label: 'Breaks on 3.9', code: '(7).bit_count()', output: "AttributeError: 'int' object has no attribute 'bit_count'" },
      fix:   { label: 'Portable fallback', code: 'try:\n    count = n.bit_count()\nexcept AttributeError:\n    count = bin(abs(n)).count("1")', output: 'works everywhere' },
    },
    {
      name: 'Negatives count the magnitude, not two-complement',
      desc: 'A real two-complement -7 in 8 bits is 11111001, which has six set bits. Python counts abs(-7) = 7 instead, giving three. Mask first if you want machine semantics.',
      wrong: { label: 'Not machine bits', code: '(-7).bit_count()', output: '3' },
      fix:   { label: 'Mask to a width',  code: '(-7 & 0xFF).bit_count()', output: '6  # 11111001' },
    },
    {
      name: 'Confused with bit_length',
      desc: 'bit_length is how WIDE the number is; bit_count is how many bits are ON. They agree only when every bit up to the top is set, like 1, 3, 7, 15.',
      wrong: { label: 'Different questions', code: '(8).bit_length(), (8).bit_count()', output: '(4, 1)' },
      fix:   { label: 'Pick deliberately',   code: 'width = n.bit_length()\nones  = n.bit_count()', output: 'two distinct facts' },
    },
  ],

  when: {
    use: [
      'Hamming distance and similarity over bit vectors',
      'Counting set flags in a packed bitmask',
      'Power-of-two checks that read clearly',
      'Any hot loop where bin(n).count("1") was the old workaround',
    ],
    avoid: [
      'Codebases that must run on Python 3.9 or older',
      'Wanting the bit WIDTH → bit_length',
      'Two-complement bit counting → mask to a fixed width first',
    ],
  },

  notes: {
    complexity: 'O(number of digits) — a per-digit popcount, no Python-level loop',
    return:     'A non-negative int; 0 only for the input 0',
    cpython:    'Objects/longobject.c :: long_bit_count',
    memory:     'No allocation — unlike the bin(n).count("1") workaround, which builds a string',
    threadSafe: 'Yes — ints are immutable',
  },

  related: [
    { name: 'int.bit_length', slug: 'int-bit_length', when: 'How wide the number is, rather than how many bits are on' },
    { name: 'bin',            slug: 'bin',            when: 'See the binary digits being counted' },
    { name: 'x ^ y',          slug: 'bitwise-xor',    when: 'Mark differing bits before counting them', category: 'operators' },
    { name: 'x & y',          slug: 'bitwise-and',    when: 'Mask to a fixed width before counting', category: 'operators' },
  ],

  faq: [
    {
      q: 'What is a popcount?',
      a: 'Population count — the number of 1 bits in a value. It is a single CPU instruction on modern hardware, and bit_count is Python exposing that idea. In information theory the same quantity applied to a XOR is the Hamming weight.',
      code: '(0b1011).bit_count()\n# 3',
    },
    {
      q: 'How do I do this before Python 3.10?',
      a: 'bin(abs(n)).count("1") gives the identical answer on every version. It is slower because it builds a string first, but it is correct and readable.',
      code: 'bin(abs(n)).count("1")',
    },
    {
      q: 'Why does -7 give 3 and not 6?',
      a: 'Python ints are arbitrary precision, so there is no fixed width and no two-complement form to count. bit_count therefore counts the magnitude. Mask with & 0xFF (or any width) if you want machine-style bits.',
      code: '(-7).bit_count()      # 3\n(-7 & 0xFF).bit_count()  # 6',
    },
  ],

  history: [
    { version: '3.10', note: 'int.bit_count added, exposing a popcount without the bin(...).count("1") workaround.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#int.bit_count',
    meta:  'int.bit_count',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect the bytes behind a value' },
  ],
};
