// content/reference/python/stdlib/struct/unpack_from.js

export const meta = {
  slug:        'unpack_from',
  name:        'struct.unpack_from',
  signature:   'struct.unpack_from(format, /, buffer, offset=0)',
  blurb:       'Unpack a record from inside a larger buffer, starting at a byte offset. Extra bytes after the record are fine — unlike unpack.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'struct unpack_from python struct.unpack_from offset read from buffer middle of bytes parse binary file header length prefix unpack_from requires a buffer of at least bytes not enough data to unpack offset out of range',
};

export const method = {
  slug:      'unpack_from',
  name:      'struct.unpack_from',
  signature: 'struct.unpack_from(format, /, buffer, offset=0)',
  returns:   { type: 'tuple', desc: 'One item per format item, read from buffer[offset:offset + calcsize(format)].' },

  category:    'struct function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Reads calcsize(format) bytes starting at offset and ignores the rest of the buffer. No slice is made, so it is the cheap way to walk through a binary blob field by field.',

  covers: ['unpack_from'],

  cheat: {
    commonCall: "struct.unpack_from('<H', data, 4)",
    returns:    '(12345,) — always a tuple',
    replaces:   "struct.unpack('<H', data[4:6])",
    watchOut:   'Negative offsets count from the end',
  },

  parameters: [
    { name: 'format', type: 'str | bytes', required: true,  default: null, desc: 'A struct format string. Positional-only.' },
    { name: 'buffer', type: 'bytes-like',  required: true,  default: null, desc: 'bytes, bytearray, memoryview … at least offset + calcsize(format) bytes long.' },
    { name: 'offset', type: 'int',         required: false, default: '0',  desc: 'Byte position to start at. Negative values count from the end of the buffer.' },
  ],

  modes: [
    {
      id: 'from',
      label: 'unpack_from',
      blurb: "A format, the buffer as hex digits, and the offset to read at. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt',    type: 'str', hint: "e.g. '<H'", input: 'text' },
        { name: 'hex',    type: 'str', hint: 'hex bytes', input: 'text' },
        { name: 'offset', type: 'int', hint: 'start byte', input: 'number' },
      ],
      template: 'import struct\nstruct.unpack_from({$fmt}, bytes.fromhex({$hex}), offset={$offset})',
      cases: [
        { id: 'middle', label: 'offset 2',        values: { fmt: '<H', hex: '0000 3930 ff', offset: '2' } },
        { id: 'neg',    label: 'offset -3',       values: { fmt: '<H', hex: '0000 3930 ff', offset: '-3' } },
        { id: 'last',   label: 'last byte',       values: { fmt: '<B', hex: '0a0b0c', offset: '-1' } },
        { id: 'past',   label: 'past the end',    values: { fmt: '<I', hex: '01020304', offset: '1' } },
        { id: 'short',  label: 'not enough data', values: { fmt: '<I', hex: '010203', offset: '-2' } },
        { id: 'range',  label: 'offset too low',  values: { fmt: '<I', hex: '0102', offset: '-6' } },
      ],
    },
    {
      id: 'walk',
      label: 'length prefix',
      blurb: 'A Pascal-style record: one length byte, then that many bytes of text. The first unpack_from reads the length, the second uses it in the format.',
      params: [{ name: 'hex', type: 'str', hint: 'length byte + data', input: 'text' }],
      template: "import struct\ndata = bytes.fromhex({$hex})\n(n,) = struct.unpack_from('<B', data, 0)\nstruct.unpack_from(f'<{n}s', data, 1)",
      cases: [
        { id: 'hello', label: 'hello + extra', values: { hex: '05 68656c6c6f 21' } },
        { id: 'abc',   label: 'abc',           values: { hex: '03 616263' } },
        { id: 'empty', label: 'length 0',      values: { hex: '00' } },
        { id: 'trunc', label: 'truncated',     values: { hex: '09 6162' } },
      ],
    },
  ],
  demoExplainer: "unpack_from only needs the record to fit: with 5 bytes, '<H' at offset 2 reads bytes 2 and 3 and ignores the trailing ff. Offset -3 is the same position counted from the end. In the length-prefix tab the trailing 21 ('!') after hello is simply never read; a length byte of 9 with only two bytes behind it fails with the exact sizes in the message.",

  patterns: [
    {
      name: 'Walk a buffer field by field',
      desc: 'Advance the offset by each record size.',
      code: "import struct\noffset = 0\nmagic, count = struct.unpack_from('<4sI', data, offset)\noffset += struct.calcsize('<4sI')\nitems = [struct.unpack_from('<hh', data, offset + 4 * i) for i in range(count)]",
    },
    {
      name: 'Read a trailer at the end',
      desc: 'A negative offset reads from the end without computing len(data).',
      code: "import struct\n(checksum,) = struct.unpack_from('<I', data, -4)",
    },
    {
      name: 'With a compiled Struct',
      desc: 'Struct.unpack_from takes the buffer and offset, nothing else.',
      code: "import struct\nENTRY = struct.Struct('<IHH')\nentry = ENTRY.unpack_from(data, 16)",
    },
  ],

  examples: [
    { title: 'Ignore trailing bytes',      code: "import struct\nstruct.unpack_from('<H', b'\\x01\\x00\\xff\\xff')",            returns: '(1,)' },
    { title: 'Start at an offset',         code: "import struct\nstruct.unpack_from('<H', b'\\x00\\x00\\x39\\x30', 2)",          returns: '(12345,)' },
    { title: 'offset as a keyword',        code: "import struct\nstruct.unpack_from('<H', b'\\x00\\x00\\x39\\x30', offset=2)",   returns: '(12345,)' },
    { title: 'Count from the end',         code: "import struct\nstruct.unpack_from('<B', b'\\x0a\\x0b\\x0c', -1)",              returns: '(12,)' },
    { title: 'Same as unpack of a slice',  code: "import struct\ndata = b'abcdefgh'\nstruct.unpack_from('<I', data, 2) == struct.unpack('<I', data[2:6])", returns: 'True' },
    { title: 'Not enough bytes',           code: "import struct\nstruct.unpack_from('<I', b'\\x01\\x02\\x03\\x04', 1)",         returns: 'struct.error: unpack_from requires a buffer of at least 5 bytes for unpacking 4 bytes at offset 1 (actual buffer size is 4)' },
  ],

  pitfalls: [
    {
      name: 'Using unpack on a buffer with more data',
      desc: 'unpack insists on the exact length; unpack_from reads a prefix (or any window) of a longer buffer.',
      wrong: { label: 'unpack',      code: "import struct\nstruct.unpack('<H', b'\\x01\\x00\\x02\\x00')",      output: 'struct.error: unpack requires a buffer of 2 bytes' },
      fix:   { label: 'unpack_from', code: "import struct\nstruct.unpack_from('<H', b'\\x01\\x00\\x02\\x00')", output: '(1,)' },
    },
    {
      name: 'A negative offset too close to the end',
      desc: 'From the end, the whole record must still fit: 4 bytes cannot start 2 bytes before the end.',
      wrong: { label: 'offset -2', code: "import struct\nstruct.unpack_from('<I', b'\\x00\\x01\\x02\\x03\\x04\\x05', -2)", output: 'struct.error: not enough data to unpack 4 bytes at offset -2' },
      fix:   { label: 'offset -4', code: "import struct\nstruct.unpack_from('<I', b'\\x00\\x01\\x02\\x03\\x04\\x05', -4)", output: '(84148994,)' },
    },
  ],

  when: {
    use: [
      'Reading records at known positions of a file read into memory',
      'Parsing headers that are followed by a payload',
      'Length-prefixed fields: read the length, then the data',
    ],
    avoid: [
      'The buffer is exactly one record → struct.unpack',
      'The whole buffer is a run of equal records → struct.iter_unpack',
    ],
  },

  notes: {
    cpython:    "Modules/_struct.c: with a negative offset, 'not enough data to unpack N bytes at offset -K' is checked before 'offset -K out of range for N-byte buffer'; then the buffer must hold offset + size bytes",
    'Signature': 'format is positional-only; buffer and offset can be passed by keyword (offset=2)',
    'Errors':   'A float offset is a TypeError; an offset beyond the C ssize_t range is an OverflowError',
  },

  related: [
    { name: 'struct.unpack',      slug: 'unpack',      when: 'Exactly one record' },
    { name: 'struct.iter_unpack', slug: 'iter_unpack', when: 'Every record of a buffer' },
    { name: 'struct.pack_into',   slug: 'pack_into',   when: 'Writing at an offset' },
    { name: 'Struct.unpack_from', slug: 'struct',      when: 'Same on a compiled format' },
    { name: 'memoryview',         slug: 'memoryview',  when: 'Zero-copy slices of big buffers', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between struct.unpack and struct.unpack_from?',
      a: 'unpack needs a buffer of exactly calcsize(format) bytes. unpack_from takes a buffer of any length and an offset, and reads just the record that starts there.',
    },
    {
      q: 'How do I read a value at a byte offset in Python?',
      a: "struct.unpack_from(fmt, data, offset) — e.g. struct.unpack_from('<I', data, 8)[0] for a 4-byte little-endian unsigned int at byte 8. It avoids building the slice data[8:12].",
    },
    {
      q: 'What does "unpack_from requires a buffer of at least N bytes" mean?',
      a: 'offset + calcsize(format) is larger than the buffer: the record would run past the end. The message gives the bytes needed, the record size, the offset and the actual buffer length.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.unpack_from',
    meta:  'struct.unpack_from',
  },

};
