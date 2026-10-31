// content/reference/python/stdlib/struct/index.js — the struct module hub

export const meta = {
  slug:        'index',
  name:        'struct',
  signature:   'import struct',
  blurb:       'Convert between Python numbers and packed binary data — file headers, network packets, C structs — with format strings such as "<HHI".',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'struct module python struct pack unpack calcsize binary data bytes to int int to bytes little endian big endian network byte order format string c struct binary file header parse binary pack_into unpack_from iter_unpack Struct struct.error',
};

export const method = {
  slug: 'index',
  name: 'struct',

  category:    'Data formats',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'pack turns values into bytes, unpack turns bytes back into a tuple, and a short format string says how: byte order first ("<" little-endian, ">" big-endian), then one character per field — "H" is a 2-byte unsigned int, "f" a 4-byte float, "10s" ten raw bytes.',

  // every public name Struct defines itself must have a member page
  coverClasses: ['Struct'],

  imports: ['import struct', 'from struct import pack, unpack, calcsize, Struct'],
  facts: [
    { label: 'Public API', value: 'pack, unpack, calcsize, pack_into, unpack_from, iter_unpack, Struct, error' },
    { label: 'Byte order', value: "First character of the format: '<' little-endian, '>' or '!' big-endian (network order), '=' native order with standard sizes, '@' or nothing at all: native order, size and alignment" },
    { label: 'Native mode', value: "Sizes and padding come from the C compiler: calcsize('@bi') is 8 (3 pad bytes before the int) while calcsize('<bi') is 5. 'l' is 8 bytes natively on Linux x86-64 and 4 on 64-bit Windows" },
    { label: 'Source',     value: 'The C extension _struct (Modules/_struct.c); Lib/struct.py only re-exports it' },
  ],

  modes: [
    {
      id: 'pack',
      label: 'pack',
      blurb: "Type a format and the values as Python literals, separated by commas. The result is the bytes a C program or a file format would see. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt',    type: 'str', hint: "e.g. '<HHI'", input: 'text' },
        { name: 'values', type: 'str', hint: "e.g. 1, 2.5, b'ab'", input: 'text' },
      ],
      template: 'import ast, struct\nvalues = ast.literal_eval({$values})\nstruct.pack({$fmt}, *values)',
      cases: [
        { id: 'header',  label: 'little-endian header', values: { fmt: '<HHI', values: '1, 2, 1000' } },
        { id: 'network', label: 'network order',        values: { fmt: '>I', values: '3232235777,' } },
        { id: 'mixed',   label: 'bytes + float',        values: { fmt: '<4sf', values: "b'abc', 1.5" } },
        { id: 'range',   label: 'out of range',         values: { fmt: '<h', values: '40000,' } },
        { id: 'count',   label: 'too few values',       values: { fmt: '<hh', values: '1,' } },
      ],
    },
    {
      id: 'unpack',
      label: 'unpack',
      blurb: "Type the bytes as hex digits (spaces between bytes are fine). unpack always returns a tuple. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt', type: 'str', hint: "e.g. '<HHI'", input: 'text' },
        { name: 'hex', type: 'str', hint: 'hex bytes', input: 'text' },
      ],
      template: 'import struct\nstruct.unpack({$fmt}, bytes.fromhex({$hex}))',
      cases: [
        { id: 'header',  label: 'header',          values: { fmt: '<HHI', hex: '0100 0200 e8030000' } },
        { id: 'ip',      label: 'IPv4 address',    values: { fmt: '>I',   hex: 'c0a80101' } },
        { id: 'float',   label: 'float',           values: { fmt: '<f',   hex: '0000c03f' } },
        { id: 'short',   label: 'too few bytes',   values: { fmt: '<I',   hex: '0102' } },
      ],
    },
    {
      id: 'calcsize',
      label: 'calcsize',
      blurb: "How many bytes a format describes. Native mode ('@' or no prefix) adds padding; the native sizes shown are Linux x86-64's, which 64-bit Windows shares for every code except 'l' and 'L'.",
      params: [{ name: 'fmt', type: 'str', hint: "e.g. '@bi'", input: 'text' }],
      template: 'import struct\nstruct.calcsize({$fmt})',
      cases: [
        { id: 'std',     label: '<bi',       values: { fmt: '<bi' } },
        { id: 'native',  label: '@bi',       values: { fmt: '@bi' } },
        { id: 'order',   label: '@ib',       values: { fmt: '@ib' } },
        { id: 'record',  label: '<10sHHb',   values: { fmt: '<10sHHb' } },
        { id: 'bad',     label: 'bad char',  values: { fmt: '<y' } },
      ],
    },
  ],
  demoExplainer: "Little-endian puts the low byte first: 1000 is 0x03e8, so '<I' writes e8 03 00 00. 3232235777 is the IPv4 address 192.168.1.1 as one number, and '>I' (network order) gives its four bytes in reading order. In native mode the int in '@bi' starts at offset 4, so three pad bytes follow the 1-byte b; '@ib' needs no padding because nothing comes after the 1-byte field — the end of a struct is never padded.",

  patterns: [
    {
      name: 'Parse a fixed binary header',
      desc: 'One format per record layout; unpack the first calcsize() bytes.',
      code: "import struct\nHEADER = struct.Struct('<4sHHI')  # magic, version, flags, length\nwith open('data.bin', 'rb') as f:\n    magic, version, flags, length = HEADER.unpack(f.read(HEADER.size))",
    },
    {
      name: 'Network byte order',
      desc: "Protocols are big-endian: use '!' (or '>') on both sides.",
      code: "import struct\nmessage = struct.pack('!HI', msg_type, len(body)) + body",
    },
    {
      name: 'Name the fields',
      desc: 'Wrap the tuple in a namedtuple to read fields by name.',
      code: "import struct\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y z')\np = Point._make(struct.unpack('<3f', data))",
    },
    {
      name: 'Many records in one buffer',
      desc: 'iter_unpack walks a buffer made of identical records.',
      code: "import struct\nfor x, y in struct.iter_unpack('<hh', samples):\n    print(x, y)",
    },
  ],

  examples: [
    { title: 'Pack three integers, big-endian', code: "import struct\nstruct.pack('>bhl', 1, 2, 3)",                                  returns: "b'\\x01\\x00\\x02\\x00\\x00\\x00\\x03'" },
    { title: 'Unpack them again',               code: "import struct\nstruct.unpack('>bhl', b'\\x01\\x00\\x02\\x00\\x00\\x00\\x03')", returns: '(1, 2, 3)' },
    { title: 'Size of a format',                code: "import struct\nstruct.calcsize('>bhl')",                                     returns: '7' },
    { title: 'Same number, both byte orders',   code: "import struct\n(struct.pack('<h', 1023), struct.pack('>h', 1023))",          returns: "(b'\\xff\\x03', b'\\x03\\xff')" },
    { title: 'A fixed-width text field',        code: "import struct\nstruct.unpack('<10sHHb', b'raymond   \\x32\\x12\\x08\\x01\\x08')", returns: "(b'raymond   ', 4658, 264, 8)" },
    { title: 'A 4-byte float loses precision',  code: "import struct\nstruct.unpack('<f', struct.pack('<f', 0.1))",                returns: '(0.10000000149011612,)' },
    { title: 'Out of range is an error',        code: "import struct\nstruct.pack('>h', 99999)",                                    returns: "struct.error: 'h' format requires -32768 <= number <= 32767" },
  ],

  pitfalls: [
    {
      name: 'Forgetting the byte-order character',
      desc: 'Without a prefix the format is native: native byte order plus C alignment padding. A file or network format almost always wants "<" or ">" — which also means no padding.',
      wrong: { label: "'bi' (native)", code: "import struct\nstruct.calcsize('bi')",  output: '8' },
      fix:   { label: "'<bi'",         code: "import struct\nstruct.calcsize('<bi')", output: '5' },
    },
    {
      name: 'Treating the result of unpack as a number',
      desc: 'unpack always returns a tuple, even for a single field. Unpack it with a trailing comma (or index [0]).',
      wrong: { label: 'n = unpack(...)',  code: "import struct\nn = struct.unpack('<I', b'\\x01\\x00\\x00\\x00')\nn + 1",  output: 'TypeError: can only concatenate tuple (not "int") to tuple' },
      fix:   { label: 'n, = unpack(...)', code: "import struct\nn, = struct.unpack('<I', b'\\x01\\x00\\x00\\x00')\nn + 1", output: '2' },
    },
    {
      name: 'Passing str where bytes are needed',
      desc: "'s', 'p' and 'c' take bytes. Encode text first — and pick the encoding yourself.",
      wrong: { label: "'hello'",          code: "import struct\nstruct.pack('<5s', 'hello')",          output: "struct.error: argument for 's' must be a bytes object" },
      fix:   { label: "'hello'.encode()", code: "import struct\nstruct.pack('<5s', 'hello'.encode())", output: "b'hello'" },
    },
  ],

  when: {
    use: [
      'Reading and writing binary file formats (headers of images, audio, archives)',
      'Network protocols with fixed-size fields in network byte order',
      'Exchanging data with C code or hardware that expects an exact memory layout',
    ],
    avoid: [
      'One integer to or from bytes → int.to_bytes / int.from_bytes',
      'Large arrays of one numeric type → array module or NumPy',
      'Saving Python objects for Python → pickle; for other languages → json',
    ],
  },

  notes: {
    cpython:       'Modules/_struct.c, a C extension; struct.Struct.__module__ is "_struct". The module-level functions cache compiled formats, so repeating a format string is cheap',
    'Standard sizes': 'b/B/c/?/x 1 byte, h/H/e 2, i/I/l/L/f 4, q/Q/d 8 — with "<", ">", "!" or "="',
    'Native only': "n, N (ssize_t, size_t) and P (void pointer) exist only in native mode; '<P' is a struct.error",
    'Versions':    "'n' and 'N' 3.3, 'e' (half float) 3.6, iter_unpack 3.4, Struct.format is a str since 3.7, Struct('i') repr since 3.13",
  },

  related: [
    { name: 'int.to_bytes()',   slug: 'int-to_bytes',   when: 'One int to bytes, any length and byte order', category: 'functions' },
    { name: 'int.from_bytes()', slug: 'int-from_bytes', when: 'Bytes to one int without a format string',     category: 'functions' },
    { name: 'bytes.fromhex()',  slug: 'bytes-fromhex',  when: 'Build test bytes from hex digits',             category: 'functions' },
    { name: 'memoryview',       slug: 'memoryview',     when: 'Slice large buffers without copying',          category: 'functions' },
    { name: 'pickle module',    slug: 'pickle',         when: 'Serialize whole Python objects instead',       category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert bytes to an int in Python?',
      a: "struct.unpack('<I', data)[0] for a 4-byte unsigned little-endian value (the format fixes the size), or int.from_bytes(data, 'little') for any length. Use '>' or 'big' for big-endian data, and a lowercase code (i, h, q) or signed=True for signed values.",
    },
    {
      q: "What do '<', '>', '!' and '@' mean in a struct format?",
      a: "They set byte order, size and alignment. '<' is little-endian and '>' big-endian, both with standard sizes and no padding; '!' is the same as '>' (network order); '=' is native byte order with standard sizes; '@' — also the default when there is no prefix — is the native order, sizes and alignment of the C compiler.",
    },
    {
      q: 'Why is struct.calcsize bigger than the sum of my fields?',
      a: "In native mode each field is aligned like in a C struct, so pad bytes are inserted: calcsize('@bi') is 8, not 5. Start the format with '<', '>', '!' or '=' to get standard sizes without padding.",
    },
    {
      q: 'What is the difference between struct.pack and int.to_bytes?',
      a: 'int.to_bytes converts one integer, of any length you ask for. struct.pack converts several values of mixed types (ints, floats, bytes, bools) in one call, with fixed C sizes, and checks every value against its range.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html',
    meta:  'struct — Interpret bytes as packed binary data',
  },

};
