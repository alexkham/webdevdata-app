// content/reference/python/stdlib/struct/pack.js

export const meta = {
  slug:        'pack',
  name:        'struct.pack',
  signature:   'struct.pack(format, v1, v2, ...)',
  blurb:       'Pack values into a bytes object laid out by a format string: integers, floats, bools and fixed-length byte strings, in the byte order you choose.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'struct pack python struct.pack int to bytes float to bytes little endian big endian pack binary data format requires number argument out of range pack expected items for packing required argument is not an integer',
};

export const method = {
  slug:      'pack',
  name:      'struct.pack',
  signature: 'struct.pack(format, v1, v2, ...)',
  returns:   { type: 'bytes', desc: 'The packed bytes; len() equals struct.calcsize(format).' },

  category:    'struct function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'One value per format code, in order. Every integer is range-checked against its C size, floats are converted to IEEE 754 binary16/32/64, and the result is exactly calcsize(format) bytes long.',

  covers: ['pack'],

  cheat: {
    commonCall: "struct.pack('<HI', 1, 1000)",
    returns:    "b'\\x01\\x00\\xe8\\x03\\x00\\x00' — bytes, calcsize(format) long",
    replaces:   'Shifting and masking bytes by hand',
    watchOut:   'No prefix means native order AND padding',
  },

  parameters: [
    { name: 'format', type: 'str | bytes', required: true, default: null, desc: "Optional byte-order character ('<', '>', '!', '=', '@'), then format codes with optional repeat counts: '<2hI' is two shorts and an unsigned int." },
    { name: 'v1, v2, ...', type: 'int | float | bytes | bool', required: true, default: null, desc: "Exactly as many values as the format has items: ints for b B h H i I l L q Q n N P, floats (or ints) for e f d, bytes for s p and c (length 1), any object for ? (its truth value). 'x' pad bytes take no value; '10s' takes one value." },
  ],

  modes: [
    {
      id: 'pack',
      label: 'pack',
      blurb: "A format and the values as comma-separated Python literals. Change one value at a time to see which byte moves. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt',    type: 'str', hint: "e.g. '<hHi'", input: 'text' },
        { name: 'values', type: 'str', hint: "e.g. -2, 65535, 7", input: 'text' },
      ],
      template: 'import ast, struct\nvalues = ast.literal_eval({$values})\nstruct.pack({$fmt}, *values)',
      cases: [
        { id: 'ints',    label: 'signed vs unsigned', values: { fmt: '<hHi',  values: '-2, 65535, 7' } },
        { id: 'ip',      label: 'IPv4 as !I',         values: { fmt: '!I',    values: '3232235777,' } },
        { id: 'bytes',   label: '? c 3s',             values: { fmt: '<?c3s', values: "True, b'A', b'xyzzy'" } },
        { id: 'half',    label: 'half float',         values: { fmt: '<e',    values: '0.1,' } },
        { id: 'range',   label: '256 as B',           values: { fmt: '<B',    values: '256,' } },
        { id: 'float',   label: 'float for i',        values: { fmt: '<i',    values: '1.5,' } },
        { id: 'count',   label: 'too few',            values: { fmt: '<hh',   values: '1,' } },
      ],
    },
    {
      id: 'order',
      label: 'byte order',
      blurb: "One format code and one value, packed little-endian and big-endian, shown as hex bytes. The bytes are the same — only their order flips.",
      params: [
        { name: 'code',  type: 'str', hint: 'one format code', input: 'text' },
        { name: 'value', type: 'int | float', hint: 'e.g. 1023 or 1.5', input: 'auto' },
      ],
      template: "import struct\nlittle = struct.pack('<' + {$code}, {$value})\nbig = struct.pack('>' + {$code}, {$value})\n(little.hex(' '), big.hex(' '))",
      cases: [
        { id: 'uint',   label: 'I 1023',  values: { code: 'I', value: '1023' } },
        { id: 'short',  label: 'h -2',    values: { code: 'h', value: '-2' } },
        { id: 'double', label: 'd 1.5',   values: { code: 'd', value: '1.5' } },
        { id: 'float',  label: 'f 0.1',   values: { code: 'f', value: '0.1' } },
        { id: 'over',   label: 'H 70000', values: { code: 'H', value: '70000' } },
      ],
    },
  ],
  demoExplainer: "-2 as a signed short ('h') is fe ff, and 65535 as an unsigned short ('H') is ff ff: the same kind of bytes, read differently. '3s' truncates b'xyzzy' to b'xyz' without complaint, while every integer code checks its range — 256 does not fit in one unsigned byte. A float is never accepted for an integer code (not even 2.0); an int is accepted for e, f and d.",

  patterns: [
    {
      name: 'Build a record',
      desc: 'Fixed-width fields with an explicit byte order.',
      code: "import struct\nrecord = struct.pack('<10sHf', name.encode()[:10], age, score)",
    },
    {
      name: 'Length-prefixed message',
      desc: 'Network order length, then the payload.',
      code: "import struct\nframe = struct.pack('!I', len(payload)) + payload",
    },
    {
      name: 'Pack a list of numbers',
      desc: 'A repeat count built from the length, then * to spread the list.',
      code: "import struct\ndata = struct.pack(f'<{len(values)}d', *values)",
    },
  ],

  examples: [
    { title: 'Little-endian unsigned int',  code: "import struct\nstruct.pack('<I', 1000)",              returns: "b'\\xe8\\x03\\x00\\x00'" },
    { title: 'Big-endian (network) order',  code: "import struct\nstruct.pack('!I', 1000)",              returns: "b'\\x00\\x00\\x03\\xe8'" },
    { title: 'A repeat count',              code: "import struct\nstruct.pack('<3B', 1, 2, 255)",         returns: "b'\\x01\\x02\\xff'" },
    { title: 's pads short bytes with NULs', code: "import struct\nstruct.pack('<5s', b'hi')",           returns: "b'hi\\x00\\x00\\x00'" },
    { title: 'x inserts a zero byte',       code: "import struct\nstruct.pack('<BxB', 1, 2)",             returns: "b'\\x01\\x00\\x02'" },
    { title: 'Bools pack as 0 or 1',        code: "import struct\nstruct.pack('<??', 0, 'yes')",          returns: "b'\\x00\\x01'" },
    { title: 'Native mode pads',            code: "import struct\nstruct.pack('@bi', 1, 2)",              returns: "b'\\x01\\x00\\x00\\x00\\x02\\x00\\x00\\x00'" },
  ],

  pitfalls: [
    {
      name: 'Packing a float with an integer code',
      desc: 'Integer codes never round or truncate. Convert explicitly — round() or int() — and decide how.',
      wrong: { label: "'<i', 2.0",       code: "import struct\nstruct.pack('<i', 2.0)",       output: 'struct.error: required argument is not an integer' },
      fix:   { label: "'<i', round(2.0)", code: "import struct\nstruct.pack('<i', round(2.0))", output: "b'\\x02\\x00\\x00\\x00'" },
    },
    {
      name: 'Expecting a negative number to wrap around',
      desc: "Unsigned codes reject negatives instead of wrapping them; use the signed code ('b', 'h', 'i', 'q') when values can be negative.",
      wrong: { label: "'<H', -1", code: "import struct\nstruct.pack('<H', -1)", output: "struct.error: 'H' format requires 0 <= number <= 65535" },
      fix:   { label: "'<h', -1", code: "import struct\nstruct.pack('<h', -1)", output: "b'\\xff\\xff'" },
    },
    {
      name: 'Too large for a half or single float',
      desc: "'e' tops out at 65504 and 'f' near 3.4e38. Overflow raises OverflowError for a float argument — not struct.error — so an except struct.error clause does not catch it.",
      wrong: { label: "'<e', 70000.0", code: "import struct\nstruct.pack('<e', 70000.0)", output: 'OverflowError: float too large to pack with e format' },
      fix:   { label: "'<f', 70000.0", code: "import struct\nstruct.pack('<f', 70000.0)", output: "b'\\x00\\xb8\\x88G'" },
    },
  ],

  when: {
    use: [
      'Writing binary formats with fixed field sizes (headers, records, packets)',
      'Sending numbers to C code, hardware or another language in an agreed layout',
    ],
    avoid: [
      'The same format many times → struct.Struct(format).pack (compiled once)',
      'Writing into an existing buffer → struct.pack_into',
      'A single int of arbitrary size → int.to_bytes',
    ],
  },

  notes: {
    cpython:    'Modules/_struct.c: s_pack zeroes a buffer of calcsize(format) bytes, then each code writes its value in turn',
    'Integers': "Values outside the C range raise struct.error: 'X' format requires lo <= number <= hi. Objects with __index__ are accepted (3.2+)",
    'Floats':   "'f' and 'e' round to the nearest representable value: 65519.99 packs as 'e' 65504.0, 65520.0 raises OverflowError. Native-mode 'f' ('@f') is a plain C cast: 1e39 becomes inf instead of raising",
  },

  related: [
    { name: 'struct.unpack',    slug: 'unpack',    when: 'The reverse: bytes back into a tuple' },
    { name: 'struct.pack_into', slug: 'pack_into', when: 'Write into an existing bytearray' },
    { name: 'struct.calcsize',  slug: 'calcsize',  when: 'How many bytes a format produces' },
    { name: 'format characters', slug: 'format-characters', when: 'Every code, its size and range' },
    { name: 'int.to_bytes()',   slug: 'int-to_bytes', when: 'One int, any length', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I convert an int to bytes with struct?',
      a: "struct.pack('<I', n) gives 4 little-endian bytes for an unsigned int up to 4294967295; use 'h'/'H' for 2 bytes, 'q'/'Q' for 8, and '>' for big-endian. For other lengths use n.to_bytes(length, 'little').",
    },
    {
      q: "What does \"struct.error: 'h' format requires -32768 <= number <= 32767\" mean?",
      a: "The value does not fit in the C type of that code — here a 2-byte signed short. Pick a wider code ('i', 'q'), an unsigned one if the value is never negative ('H' goes up to 65535), or fix the value.",
    },
    {
      q: 'Why does struct.pack say "pack expected 2 items for packing (got 1)"?',
      a: "The format and the arguments disagree: every code except 'x' takes one value, a repeat count multiplies that ('3h' takes three), and '10s' or '10p' takes a single bytes value. Pass a list with *values.",
    },
    {
      q: 'Can struct.pack handle strings?',
      a: "Only bytes. Encode text first — struct.pack('<10s', name.encode('utf-8')) — and remember that 's' silently truncates or NUL-pads to the given length.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.pack',
    meta:  'struct.pack',
  },

};
