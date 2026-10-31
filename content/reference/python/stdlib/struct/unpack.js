// content/reference/python/stdlib/struct/unpack.js

export const meta = {
  slug:        'unpack',
  name:        'struct.unpack',
  signature:   'struct.unpack(format, buffer)',
  blurb:       'Read binary data back into Python values: a tuple of ints, floats, bools and bytes, one per format code. The buffer must be exactly calcsize(format) bytes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'struct unpack python struct.unpack bytes to int bytes to float parse binary data unpack requires a buffer of bytes tuple little endian big endian read binary file',
};

export const method = {
  slug:      'unpack',
  name:      'struct.unpack',
  signature: 'struct.unpack(format, buffer)',
  returns:   { type: 'tuple', desc: 'One item per format item, even when there is only one.' },

  category:    'struct function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'The inverse of pack: the format says how to cut the bytes and how to read each piece. The length must match exactly — no more, no less — and the answer is always a tuple.',

  covers: ['unpack'],

  cheat: {
    commonCall: "x, y = struct.unpack('<hh', data)",
    returns:    'a tuple — (1, 2), or (1,) for one field',
    replaces:   'int.from_bytes on hand-made slices',
    watchOut:   'Exact size only: longer buffers are an error too',
  },

  parameters: [
    { name: 'format', type: 'str | bytes', required: true, default: null, desc: "Byte-order character plus format codes, as for pack. 's' fields come back as bytes, '?' as bool, 'e', 'f', 'd' as float, everything else as int." },
    { name: 'buffer', type: 'bytes-like', required: true, default: null, desc: 'bytes, bytearray, memoryview or any other object with the buffer protocol. Its length must equal struct.calcsize(format).' },
  ],

  modes: [
    {
      id: 'unpack',
      label: 'unpack',
      blurb: "A format and the bytes as hex digits (spaces between bytes allowed). Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt', type: 'str', hint: "e.g. '<hHi'", input: 'text' },
        { name: 'hex', type: 'str', hint: 'hex bytes', input: 'text' },
      ],
      template: 'import struct\nstruct.unpack({$fmt}, bytes.fromhex({$hex}))',
      cases: [
        { id: 'ints',  label: 'signed vs unsigned', values: { fmt: '<hHi',  hex: 'feff ffff 07000000' } },
        { id: 'ip',    label: '4B vs >I',           values: { fmt: '<4B',   hex: 'c0a80101' } },
        { id: 'pad',   label: '4s x H',             values: { fmt: '<4sxH', hex: '41424344 00 3930' } },
        { id: 'float', label: 'float 0.1',          values: { fmt: '<f',    hex: 'cdcccc3d' } },
        { id: 'bool',  label: '? of ff',            values: { fmt: '<?',    hex: 'ff' } },
        { id: 'short', label: 'too few bytes',      values: { fmt: '<I',    hex: '010203' } },
      ],
    },
    {
      id: 'named',
      label: 'named fields',
      blurb: "Wrap the tuple in a namedtuple to read the fields by name. The format must produce exactly two items here. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt', type: 'str', hint: 'two fields', input: 'text' },
        { name: 'hex', type: 'str', hint: 'hex bytes', input: 'text' },
      ],
      template: "import struct\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y')\nPoint._make(struct.unpack({$fmt}, bytes.fromhex({$hex})))",
      cases: [
        { id: 'little', label: '<hh',          values: { fmt: '<hh', hex: '0100 0200' } },
        { id: 'big',    label: '>hh',          values: { fmt: '>hh', hex: 'fffe 0003' } },
        { id: 'floats', label: '<ff',          values: { fmt: '<ff', hex: '0000803f 00000040' } },
        { id: 'three',  label: 'three fields', values: { fmt: '<hhh', hex: '0100 0200 0300' } },
      ],
    },
  ],
  demoExplainer: "The same bytes give different numbers under different codes: ff ff is -1 as 'h' and 65535 as 'H'. The 'x' code skips one byte without producing an item. The float 0.1 stored as 4 bytes comes back as 0.10000000149011612 — the nearest single-precision value, printed as a double. And '?' turns any non-zero byte into True.",

  patterns: [
    {
      name: 'Unpack one value',
      desc: 'A trailing comma unpacks the one-item tuple.',
      code: "import struct\n(length,) = struct.unpack('>I', data[:4])",
    },
    {
      name: 'Read a header from a file',
      desc: 'Read exactly calcsize() bytes, then unpack.',
      code: "import struct\nfmt = '<4sII'\nwith open('file.bin', 'rb') as f:\n    magic, width, height = struct.unpack(fmt, f.read(struct.calcsize(fmt)))",
    },
    {
      name: 'Unpack from the middle of a buffer',
      desc: 'Slicing copies; unpack_from reads at an offset without a slice.',
      code: "import struct\nvalue, = struct.unpack_from('<H', data, offset)",
    },
  ],

  examples: [
    { title: 'A 4-byte little-endian int', code: "import struct\nstruct.unpack('<I', b'\\xe8\\x03\\x00\\x00')",       returns: '(1000,)' },
    { title: 'Signed vs unsigned',         code: "import struct\n(struct.unpack('>i', b'\\xff\\xff\\xff\\xfe'), struct.unpack('>I', b'\\xff\\xff\\xff\\xfe'))", returns: '((-2,), (4294967294,))' },
    { title: 'Repeat counts',              code: "import struct\nstruct.unpack('<2h', b'\\x01\\x00\\x02\\x00')",     returns: '(1, 2)' },
    { title: "'3s' is one item, '3c' three", code: "import struct\n(struct.unpack('<3s', b'abc'), struct.unpack('<3c', b'abc'))", returns: "((b'abc',), (b'a', b'b', b'c'))" },
    { title: 'Any bytes-like buffer',      code: "import struct\nstruct.unpack('<I', bytearray(b'\\x01\\x00\\x00\\x00'))", returns: '(1,)' },
    { title: 'Unpack straight into names', code: "import struct\nx, y = struct.unpack('<hh', b'\\x05\\x00\\xfb\\xff')\nx + y", returns: '0' },
    { title: 'Wrong length',               code: "import struct\nstruct.unpack('<I', b'\\x01\\x00\\x00\\x00\\x00')", returns: 'struct.error: unpack requires a buffer of 4 bytes' },
  ],

  pitfalls: [
    {
      name: 'Passing more bytes than the format describes',
      desc: 'unpack wants the exact size. To read a prefix of a longer buffer, slice it to calcsize() or use unpack_from.',
      wrong: { label: 'whole buffer',  code: "import struct\ndata = b'\\x01\\x00\\x02\\x00\\xff'\nstruct.unpack('<hh', data)",       output: 'struct.error: unpack requires a buffer of 4 bytes' },
      fix:   { label: 'unpack_from',   code: "import struct\ndata = b'\\x01\\x00\\x02\\x00\\xff'\nstruct.unpack_from('<hh', data)", output: '(1, 2)' },
    },
    {
      name: 'Reading a str instead of bytes',
      desc: 'Text is not a buffer. Data from a file must be read in binary mode (rb); hex text must be decoded with bytes.fromhex.',
      wrong: { label: "'0100'",               code: "import struct\nstruct.unpack('<H', '0100')",               output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "bytes.fromhex('0100')", code: "import struct\nstruct.unpack('<H', bytes.fromhex('0100'))", output: '(1,)' },
    },
    {
      name: 'Guessing the byte order',
      desc: 'The same four bytes are a different number in each order. The file format or protocol decides — most file formats are little-endian, network protocols big-endian.',
      wrong: { label: "'<I' on network data", code: "import struct\nstruct.unpack('<I', b'\\x00\\x00\\x01\\x00')", output: '(65536,)' },
      fix:   { label: "'!I'",                 code: "import struct\nstruct.unpack('!I', b'\\x00\\x00\\x01\\x00')", output: '(256,)' },
    },
  ],

  when: {
    use: [
      'Decoding fixed-layout binary data: file headers, packets, sensor records',
      'Reading values written by struct.pack or by C code',
    ],
    avoid: [
      'A buffer longer than one record → unpack_from (offset) or iter_unpack (many records)',
      'The same format in a loop → struct.Struct(format).unpack',
      'One int of any length → int.from_bytes',
    ],
  },

  notes: {
    cpython:     "Modules/_struct.c: the buffer length is compared with calcsize(format) before anything is read (unpack requires a buffer of N bytes), then each code reads its field at its offset",
    'Results':   "Integers come back as int, 'e'/'f'/'d' as float, '?' as bool (any non-zero byte is True), 'c' as a 1-byte bytes, 's' as bytes of exactly the given length (NUL padding included), 'p' as bytes of the stored length",
    'Buffers':   'bytes, bytearray, memoryview, array.array, mmap — any object supporting the buffer protocol',
  },

  related: [
    { name: 'struct.pack',        slug: 'pack',        when: 'The reverse direction' },
    { name: 'struct.unpack_from', slug: 'unpack_from', when: 'Unpack at an offset of a longer buffer' },
    { name: 'struct.iter_unpack', slug: 'iter_unpack', when: 'Many records in a row' },
    { name: 'int.from_bytes()',   slug: 'int-from_bytes', when: 'One int, no format string', category: 'functions' },
    { name: 'bytes.fromhex()',    slug: 'bytes-fromhex',  when: 'Hex text to bytes', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does struct.unpack return a tuple for a single value?',
      a: 'The result always has one item per format item, so the type does not change with the format. Take the value with a trailing comma — value, = struct.unpack(...) — or with [0].',
    },
    {
      q: 'How do I fix "struct.error: unpack requires a buffer of 4 bytes"?',
      a: 'The buffer length differs from calcsize(format) — longer or shorter. Slice it (data[:4]), use struct.unpack_from(format, data, offset) to read part of a longer buffer, or check that the format matches the data.',
    },
    {
      q: 'How do I unpack a C string field without the trailing NUL bytes?',
      a: "'10s' always returns 10 bytes, padding included. Strip it yourself: name.rstrip(b'\\x00'), or name.split(b'\\x00', 1)[0] for a C-style terminated string, then decode.",
    },
    {
      q: 'How do I read a binary file with struct?',
      a: "Open it with open(path, 'rb'), read calcsize(format) bytes per record and unpack them — or read the whole file and use iter_unpack for a run of equal records.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.unpack',
    meta:  'struct.unpack',
  },

};
