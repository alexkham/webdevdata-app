// content/reference/python/functions/bin.js

export const meta = {
  slug:        'bin',
  name:        'bin',
  signature:   'bin(x)',
  blurb:       'Integer to binary literal string, with the "0b" prefix.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'bin binary base 2 convert integer string representation prefix 0b bits',
};

export const method = {
  slug:      'bin',
  name:      'bin',
  signature: 'bin(x)',
  returns:   { type: 'str', desc: 'A string in Python integer literal form: "0b" prefix, digits 0 and 1. Negatives get a "-0b" prefix.' },

  category:    'Built-in function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Convert an integer to its binary literal form — a string, not a number.',

  cheat: {
    commonCall: 'bin(255)  # "0b11111111"',
    returns:    'a str with "0b" prefix',
    replaces:   'format(n, "b") when you also want the prefix',
    watchOut:   'floats are rejected — use int() first',
  },

  parameters: [
    { name: 'x', type: 'int', required: true, default: null, desc: 'Any integer (positive, negative, or zero). Objects with __index__ also accepted. Floats raise TypeError.' },
  ],

  demoParams: [
    { name: 'x', type: 'int', hint: 'the integer', input: 'number' },
  ],
  cases: [
    { id: 'small',    label: 'small',        values: { x: 10 } },
    { id: 'zero',     label: 'zero',         values: { x: 0 } },
    { id: 'one',      label: 'one',          values: { x: 1 } },
    { id: 'negative', label: 'negative',     values: { x: -10 } },
    { id: 'byte',     label: 'byte 255',     values: { x: 255 } },
    { id: 'power2',   label: 'power of 2',   values: { x: 1024 } },
    { id: 'mask',     label: 'bitmask',      values: { x: 42 } },
  ],
  demoExplainer: 'bin returns a STRING in the same form you would type a binary integer literal: "0b" prefix, digits 0 and 1. Negatives get a leading "-". This is a formatter, not a math operation — the value does not change, only its representation.',

  patterns: [
    {
      name: 'Count set bits',
      desc: 'Bit-count via string count works, though int.bit_count() is faster in 3.10+.',
      code: 'ones = bin(n).count("1")\n# or, 3.10+:\nones = n.bit_count()',
    },
    {
      name: 'Show a bit pattern',
      desc: 'Debug-friendly display of masks and flags.',
      code: 'print(f"flags = {bin(flags)}")',
    },
    {
      name: 'Round-trip via int',
      desc: 'bin → str, int with base=2 → back. The prefix is optional on parse.',
      code: 's = bin(10)         # "0b1010"\nn = int(s, 2)       # 10',
    },
  ],

  examples: [
    { title: 'Small integer',    code: 'bin(10)',       returns: '"0b1010"' },
    { title: 'Zero',             code: 'bin(0)',        returns: '"0b0"' },
    { title: 'One',              code: 'bin(1)',        returns: '"0b1"' },
    { title: 'Negative',         code: 'bin(-10)',      returns: '"-0b1010"' },
    { title: 'Byte max',         code: 'bin(255)',      returns: '"0b11111111"' },
    { title: 'Float raises',     code: 'bin(1.5)',      returns: 'TypeError: \'float\' object cannot be interpreted as an integer' },
  ],

  pitfalls: [
    {
      name: 'The "0b" prefix is included',
      desc: 'Great for humans reading Python literals; in the way when you want a fixed-width bit pattern.',
      wrong: { label: 'Prefix included', code: 'bin(5)', output: '"0b101"' },
      fix:   { label: 'Fixed-width without prefix', code: 'format(5, "08b")', output: '"00000101"' },
    },
    {
      name: 'Floats are rejected',
      desc: 'bin only accepts integers. Truncate or round first.',
      wrong: { label: 'Type error', code: 'bin(1.5)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'Truncate first', code: 'bin(int(1.5))', output: '"0b1"' },
    },
    {
      name: 'Negatives are sign-magnitude, not two\'s complement',
      desc: 'bin(-10) is "-0b1010", not a two\'s complement fixed-width form. Python integers are unbounded — there is no fixed width to complement against.',
      wrong: { label: 'Not two\'s comp', code: 'bin(-10)', output: '"-0b1010"' },
      fix:   { label: 'Mask to a width', code: 'format(-10 & 0xFF, "08b")', output: '"11110110"  # 8-bit two\'s complement' },
    },
    {
      name: 'Result is a str, not a number',
      desc: 'You cannot do arithmetic on the binary string. Parse it back if needed.',
      wrong: { label: 'Type error',  code: 'bin(3) + bin(5)', output: '"0b110b101"  # string concat, not add' },
      fix:   { label: 'Add first',   code: 'bin(3 + 5)', output: '"0b1000"' },
    },
  ],

  when: {
    use: [
      'Human-readable display of small integers as bit patterns',
      'Debugging masks, flags, and bitwise operations',
      'Round-trippable output that int(s, 2) can parse back',
    ],
    avoid: [
      'Fixed-width bit pattern → format(n, "0Nb")',
      'No prefix → format(n, "b")',
      'Two\'s complement view → mask first (n & 0xFF)',
      'Bit count → int.bit_count() (3.10+) is faster than counting the string',
    ],
  },

  notes: {
    complexity: 'O(log n) in the number of digits',
    return:     'str — always with "0b" (or "-0b") prefix',
    cpython:    'Python/bltinmodule.c :: builtin_bin — delegates to __index__ then formats',
    memory:     'Allocates one small string',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'hex',    slug: 'hex',    when: 'Base 16 instead of base 2' },
    { name: 'int',    slug: 'int',    when: 'Parse the string back to an integer (base=2)' },
  ],

  faq: [
    {
      q: 'How do I get binary WITHOUT the \"0b\" prefix?',
      a: 'Use format() or an f-string with the "b" spec — cleaner and lets you pad.',
      code: 'format(5, "b")       # "101"\nformat(5, "08b")     # "00000101"\nf"{5:08b}"           # "00000101"',
    },
    {
      q: 'What is the difference between bin() and hex()?',
      a: 'Same shape, different base — bin gives base 2 with "0b" prefix; hex gives base 16 with "0x" prefix. Both are formatters that return strings; neither changes the value.',
    },
    {
      q: 'Why does bin(-10) not use two\'s complement?',
      a: 'Python integers are arbitrary precision — there is no fixed width to complement against. bin uses a sign-magnitude form: "-0b1010". Mask first if you need a two\'s complement view: `format(-10 & 0xFF, "08b")`.',
    },
  ],

  history: [
    { version: '2.6', note: 'bin() introduced — same version as the "0b" literal syntax.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#bin',
    meta:  'bin',
  },

  tryInTool: [
    { name: 'Base64', href: '/tools/base64', meta: 'Adjacent byte-encoding work' },
  ],
};