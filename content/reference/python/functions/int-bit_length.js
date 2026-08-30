// content/reference/python/functions/int-bit_length.js
//
// Slug is type-prefixed: `bit_length` is an int method.

export const meta = {
  slug:        'int-bit_length',
  name:        'int.bit_length',
  signature:   'int.bit_length()',
  blurb:       'How many bits it takes to write the number in binary, ignoring the sign.',
  category:    'integer',
  type:        'int',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'bit length binary bits width size int how many bits msb magnitude',
};

export const method = {
  slug:      'int-bit_length',
  name:      'int.bit_length',
  signature: 'int.bit_length()',
  returns:   { type: 'int', desc: 'Number of bits needed to represent the absolute value in binary, excluding sign and leading zeros. Zero returns 0.' },

  category:    'Int method',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'Bit width of the magnitude. The sign is ignored, so n and -n always give the same answer, and 0 gives 0 rather than 1.',

  cheat: {
    commonCall: 'n.bit_length()',
    returns:    'int — the position of the highest set bit, counting from 1',
    replaces:   'len(bin(abs(n))) - 2 and math.floor(math.log2(n)) + 1',
    watchOut:   '(0).bit_length() is 0, not 1 — there is no set bit to point at',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'int', hint: 'integer to measure', input: 'number' },
  ],
  demoTemplate: '({n}).bit_length()',
  cases: [
    { id: 'zero',      label: 'zero',            values: { n: 0 } },
    { id: 'one',       label: 'one',             values: { n: 1 } },
    { id: 'byte-max',  label: 'byte max (255)',  values: { n: 255 } },
    { id: 'byte-over', label: 'one more (256)',  values: { n: 256 } },
    { id: 'negative',  label: 'negative (-255)', values: { n: -255 } },
    { id: 'power',     label: 'power of two',    values: { n: 1024 } },
  ],
  demoExplainer: 'bit_length answers "how wide is this number in binary?". It counts from the highest set bit down to bit 0, so 255 (11111111) is 8 and 256 (100000000) is 9. The sign is discarded first, which is why -255 also gives 8. Zero is the special case: it has no set bit at all, so the answer is 0 rather than 1.',

  patterns: [
    {
      name: 'Bytes needed to store a value',
      desc: 'Round the bit width up to whole bytes — the usual companion to to_bytes.',
      code: 'n_bytes = (n.bit_length() + 7) // 8',
    },
    {
      name: 'Integer log2 without floats',
      desc: 'Exact for every int, unlike math.log2, which loses precision on very large values.',
      code: 'floor_log2 = n.bit_length() - 1   # for n > 0',
    },
    {
      name: 'Check if a value fits in a field',
      desc: 'Cheaper and clearer than comparing against 2 ** width.',
      code: 'if value.bit_length() <= 16:\n    pack_as_uint16(value)',
    },
  ],

  examples: [
    { title: 'Zero is 0',         code: '(0).bit_length()',    returns: '0' },
    { title: 'One bit',           code: '(1).bit_length()',    returns: '1' },
    { title: 'Full byte',         code: '(255).bit_length()',  returns: '8' },
    { title: 'Just over a byte',  code: '(256).bit_length()',  returns: '9' },
    { title: 'Sign is ignored',   code: '(-255).bit_length()', returns: '8' },
    { title: 'Huge ints are fine',code: '(2 ** 1000).bit_length()', returns: '1001' },
  ],

  pitfalls: [
    {
      name: '(0).bit_length() is 0, not 1',
      desc: 'It counts set bits positions, not printed characters. Zero has no set bit, so the width is 0. Code that divides by the result, or assumes at least one byte, breaks on zero.',
      wrong: { label: 'Zero bytes for zero', code: 'n = 0\nn_bytes = (n.bit_length() + 7) // 8\nn.to_bytes(n_bytes, "big")', output: "b''  # empty, probably not what you wanted" },
      fix:   { label: 'Floor at one byte',   code: 'n_bytes = max(1, (n.bit_length() + 7) // 8)', output: "b'\\x00'" },
    },
    {
      name: 'It measures the magnitude, not the two-complement width',
      desc: 'Negative numbers return the width of their absolute value. That is NOT the number of bits a signed representation needs — signed storage needs one more bit for the sign.',
      wrong: { label: 'Too narrow for signed', code: '(-128).bit_length()', output: '8  # but signed -128 needs 8, and -129 needs 9' },
      fix:   { label: 'Add the sign bit',      code: 'width = n.bit_length() + (1 if n < 0 else 0)', output: 'room for the sign' },
    },
    {
      name: 'Not the same as len(bin(n))',
      desc: 'bin() prefixes with "0b", and adds "-" for negatives, so the string length is 2 or 3 characters longer. Reaching for len(bin(n)) and forgetting to subtract is a classic off-by-two.',
      wrong: { label: 'Off by two', code: 'len(bin(255))', output: '10  # "0b11111111"' },
      fix:   { label: 'Use the method', code: '(255).bit_length()', output: '8' },
    },
  ],

  when: {
    use: [
      'Sizing a buffer before calling to_bytes',
      'Exact integer log2 on values too big for float precision',
      'Checking a value fits a fixed-width field',
      'Bit-twiddling where the position of the top set bit matters',
    ],
    avoid: [
      'Counting how many bits are SET → bit_count',
      'Wanting the two-complement width of a negative → add the sign bit yourself',
      'Formatting for display → bin, hex or format',
    ],
  },

  notes: {
    complexity: 'O(1) for machine-word ints; O(1) on the top digit for big ints',
    return:     'A non-negative int; 0 only for the input 0',
    cpython:    'Objects/longobject.c :: long_bit_length',
    memory:     'No allocation — reads the most significant digit',
    threadSafe: 'Yes — ints are immutable',
  },

  related: [
    { name: 'int.bit_count', slug: 'int-bit_count', when: 'Count how many bits are set, not how wide' },
    { name: 'int.to_bytes',  slug: 'int-to_bytes',  when: 'Turn the int into bytes once you know the width' },
    { name: 'bin',           slug: 'bin',           when: 'See the binary digits as a string' },
    { name: 'hex',           slug: 'hex',           when: 'Compact base-16 view of the same value' },
  ],

  faq: [
    {
      q: 'Why does (0).bit_length() return 0?',
      a: 'Because bit_length reports the position of the highest set bit, and zero has none. Every other value n satisfies 2 ** (n.bit_length() - 1) <= abs(n) < 2 ** n.bit_length(); zero cannot, so it is defined as 0.',
      code: '(0).bit_length()\n# 0',
    },
    {
      q: 'How do I get the number of bytes instead of bits?',
      a: 'Round up to whole bytes with (n.bit_length() + 7) // 8, and floor the result at 1 if you need zero to occupy a byte.',
      code: 'n_bytes = max(1, (n.bit_length() + 7) // 8)',
    },
    {
      q: 'Is this faster than math.log2?',
      a: 'It is both faster and exact. math.log2 converts to float first, so it loses precision above 2 ** 53 and can return a value that rounds the wrong way. bit_length reads the integer directly and is correct for any size.',
    },
  ],

  history: [
    { version: '3.1', note: 'int.bit_length added (also backported to Python 2.7).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#int.bit_length',
    meta:  'int.bit_length',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect the bytes behind a value' },
  ],
};
