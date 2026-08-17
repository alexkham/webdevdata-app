// content/reference/python/operators/bitwise-xor.js

export const meta = {
  slug:        'bitwise-xor',
  name:        '^',
  signature:   'a ^ b',
  blurb:       'Bitwise XOR — the caret is NOT exponentiation.',
  category:    'bitwise',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'caret xor exclusive or toggle bits symmetric difference operator',
};

export const method = {
  slug:      'bitwise-xor',
  name:      '^',
  signature: 'a ^ b',
  returns:   { type: 'int | set', desc: 'Ints: a bit is set where the operands DIFFER. Sets: the symmetric difference.' },

  category:    'Bitwise operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Exclusive OR: bits that differ. And the #1 caret fact: 2 ^ 10 is 8, not 1024.',

  cheat: {
    commonCall: 'toggled = flags ^ MASK',
    returns:    'int with only the differing bits; set symmetric difference',
    replaces:   'x ^ x == 0 and x ^ 0 == x — the self-canceling property',
    watchOut:   'exponentiation is ** — the caret is a false friend',
  },

  parameters: [
    { name: 'a', type: 'int | set', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'int | set', required: true, default: null, desc: 'Right operand.' },
  ],

  demoParams: [
    { name: 'a', type: 'int', hint: 'left operand',  input: 'number' },
    { name: 'b', type: 'int', hint: 'right operand', input: 'number' },
  ],
  demoTemplate: '{a} ^ {b}',
  cases: [
    { id: 'notpow',  label: '2 ^ 10',    values: { a: 2, b: 10 } },
    { id: 'toggle',  label: 'toggle',    values: { a: 12, b: 10 } },
    { id: 'self',    label: 'x ^ x',     values: { a: 7, b: 7 } },
  ],
  demoExplainer: 'The first case is the trap: 2 ^ 10 is 8 (0b0010 XOR 0b1010 = 0b1000) — anyone expecting 1024 wants 2 ** 10. XOR of a value with itself is always 0.',

  patterns: [
    {
      name: 'Toggling flags',
      desc: 'XOR with a mask flips exactly those bits.',
      code: 'state ^= BLINK_BIT   # on↔off each call',
    },
    {
      name: 'Symmetric set difference',
      desc: 'Elements in exactly one of the two sets.',
      code: 'changed = before ^ after',
    },
  ],

  examples: [
    { title: 'NOT exponentiation', code: '2 ^ 10',          returns: '8' },
    { title: 'Differing bits',     code: '12 ^ 10',         returns: '6' },
    { title: 'Self-cancel',        code: '7 ^ 7',           returns: '0' },
    { title: 'Symmetric difference', code: '{1, 2} ^ {2, 3}', returns: '{1, 3}' },
  ],

  pitfalls: [
    {
      name: 'The exponentiation false friend',
      desc: 'Coming from math notation or Excel, ^ silently computes the wrong thing.',
      wrong: { label: 'Silent wrong answer', code: '10 ^ 2   # "ten squared"?', output: '8' },
      fix:   { label: 'Fix', code: '10 ** 2', output: '100' },
    },
    {
      name: 'XOR swap is a party trick, not a practice',
      desc: 'Python has tuple assignment — use it.',
      wrong: { label: 'Obscure', code: 'a ^= b; b ^= a; a ^= b', output: 'works for ints only, unreadable' },
      fix:   { label: 'Pythonic', code: 'a, b = b, a', output: 'any types, clear' },
    },
  ],

  when: {
    use: [
      'Toggling bits with a mask',
      'Parity / checksum arithmetic',
      'Symmetric difference of sets',
    ],
    avoid: [
      'Powers → **',
      'Simple boolean != of two bools → != reads clearer',
    ],
  },

  notes: {
    complexity: 'O(bits)',
    return:     'new value; operands untouched',
    cpython:    'Objects/longobject.c :: long_xor → __xor__',
    memory:     'No allocation for small ints',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '**', slug: 'pow',         when: 'What you may have meant' },
    { name: '&',  slug: 'bitwise-and', when: 'Mask bits' },
    { name: '|',  slug: 'bitwise-or',  when: 'Combine bits' },
  ],

  faq: [
    {
      q: 'Why is XOR useful for checksums?',
      a: 'It is associative, commutative, and self-inverse (x ^ x = 0), so XOR-ing a stream detects any single-bit flip and can reconstruct one missing value — the basis of RAID parity.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#binary-bitwise-operations',
    meta:  'binary bitwise operations',
  },

  tryInTool: [
    { name: 'Base64',         href: '/tools/base64',         meta: 'Byte-level encoding' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};
