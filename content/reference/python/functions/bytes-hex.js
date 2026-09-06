// content/reference/python/functions/bytes-hex.js
//
// Slug is type-prefixed: `hex` is the built-in, and float/memoryview have
// their own hex methods.

export const meta = {
  slug:        'bytes-hex',
  name:        'bytes.hex',
  signature:   'bytes.hex([sep[, bytes_per_sep]])',
  blurb:       'Bytes as a plain hex string — the readable form of binary data.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'bytes hex hexadecimal dump digest checksum string separator binary readable bytearray bytearray.hex',
};

export const method = {
  slug:      'bytes-hex',
  name:      'bytes.hex',
  signature: 'bytes.hex([sep[, bytes_per_sep]])',
  returns:   { type: 'str', desc: 'Two lowercase hex digits per byte, with no 0x prefix and no separator unless one is requested.' },

  category:    'Bytes method',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'How binary data gets into logs, tests and config files. Pairs exactly with bytes.fromhex, so the round trip is lossless.',

  cheat: {
    commonCall: 'data.hex()',
    returns:    "str like '616263' — lowercase, unseparated, twice the byte count",
    replaces:   "binascii.hexlify(data).decode()",
    watchOut:   'no 0x prefix, so int() needs an explicit base of 16',
  },

  parameters: [
    { name: 'sep',           type: 'str', required: false, default: 'None', desc: "Single-character separator between groups, e.g. ' ' or ':'." },
    { name: 'bytes_per_sep', type: 'int', required: false, default: '1',    desc: 'Bytes per group. Positive groups from the right; negative groups from the left.' },
  ],

  demoParams: [
    { name: 's', type: 'str', hint: 'text (encoded as utf-8 first)', input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').hex()",
  cases: [
    { id: 'ascii',    label: 'plain ascii', values: { s: 'abc' } },
    { id: 'word',     label: 'a word',      values: { s: 'hello' } },
    { id: 'non-ascii',label: 'non-ascii',   values: { s: 'héllo' } },
    { id: 'empty',    label: 'empty',       values: { s: '' } },
    { id: 'digits',   label: 'digits',      values: { s: '123' } },
  ],
  demoExplainer: 'Every byte becomes exactly two lowercase hex digits with nothing between them, so the string is always twice as long as the data. "abc" gives 616263 because a is 0x61. The non-ascii case shows the encoding underneath: one accented character was encoded as two UTF-8 bytes, so it contributes four hex digits rather than two.',

  patterns: [
    {
      name: 'Show a digest',
      desc: 'The standard way to print a hash, though hashlib offers hexdigest directly.',
      code: 'import hashlib\nhashlib.sha256(data).digest().hex()',
    },
    {
      name: 'Readable dumps with separators',
      desc: 'Grouping makes a long dump scannable.',
      code: "data.hex(' ')      # '61 62 63'\ndata.hex(':', 2)   # pairs of bytes",
    },
    {
      name: 'Store binary in a text format',
      desc: 'Hex survives JSON, YAML and env vars where raw bytes would not.',
      code: 'config["key"] = secret.hex()',
    },
  ],

  examples: [
    { title: 'ASCII',        code: "b'abc'.hex()",        returns: "'616263'" },
    { title: 'With spaces',  code: "b'abc'.hex(' ')",     returns: "'61 62 63'" },
    { title: 'Grouped',      code: "b'abcd'.hex('_', 2)", returns: "'6162_6364'" },
    { title: 'Empty',        code: "b''.hex()",           returns: "''" },
    { title: 'Round trip',   code: "bytes.fromhex(b'abc'.hex())", returns: "b'abc'" },
    { title: 'Non-ascii',    code: "'é'.encode().hex()",  returns: "'c3a9'" },
  ],

  pitfalls: [
    {
      name: 'No 0x prefix',
      desc: 'Unlike the built-in hex(), the output is bare digits. Passing it to int() without a base makes Python read it as decimal — which either raises or silently returns a completely wrong number.',
      wrong: { label: 'Read as decimal', code: "int(b'\\x10'.hex())", output: '10  # should be 16' },
      fix:   { label: 'State the base',  code: "int(b'\\x10'.hex(), 16)", output: '16' },
    },
    {
      name: 'Always lowercase',
      desc: 'There is no uppercase option. Comparing against an uppercase fixture or a checksum copied from elsewhere fails on case alone.',
      wrong: { label: 'Case mismatch', code: "b'\\xab'.hex() == 'AB'", output: 'False' },
      fix:   { label: 'Normalise',     code: "b'\\xab'.hex().upper() == 'AB'", output: 'True' },
    },
    {
      name: 'It doubles the size',
      desc: 'Every byte becomes two characters, so hex is a 100% overhead encoding. For anything large, base64 costs only about 33% more than the raw bytes.',
      wrong: { label: 'Twice as big', code: 'len(data.hex()) == 2 * len(data)', output: 'True' },
      fix:   { label: 'Base64 is denser', code: 'import base64\nbase64.b64encode(data)', output: 'about 1.33x' },
    },
    {
      name: 'It is not the built-in hex()',
      desc: 'hex() takes a single integer and returns 0x-prefixed text; this method takes a whole buffer and emits two digits per byte. Same name, unrelated outputs.',
      wrong: { label: 'Different results', code: "hex(255), b'\\xff'.hex()", output: "('0xff', 'ff')" },
      fix:   { label: 'Pick deliberately', code: 'hex(n) for ints, data.hex() for bytes', output: 'clear intent' },
    },
  ],

  when: {
    use: [
      'Logging or displaying binary data readably',
      'Digests, checksums and keys in text form',
      'Test fixtures where a bytes literal would be unreadable',
      'Carrying binary through a text-only channel',
    ],
    avoid: [
      'Large payloads → base64 is far more compact',
      'You need a Python int literal → the built-in hex()',
      'The data is text → decode it instead',
    ],
  },

  notes: {
    complexity: 'O(n) — two characters emitted per byte',
    return:     'A new str, exactly twice the byte length when no separator is used',
    cpython:    'Objects/bytesobject.c :: bytes_hex',
    memory:     'Allocates a string twice the size of the input',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.fromhex',  slug: 'bytes-fromhex',  when: 'Read the bytes back from this string' },
    { name: 'bytes.decode',   slug: 'bytes-decode',   when: 'The data is text rather than binary' },
    { name: 'hex',            slug: 'hex',            when: 'Hexadecimal for a single integer' },
    { name: 'memoryview.hex', slug: 'memoryview-hex', when: 'The same method on a buffer view' },
  ],

  faq: [
    {
      q: 'How do I get the bytes back?',
      a: 'bytes.fromhex reverses it exactly, and it tolerates spaces, so output produced with a separator still parses. The round trip is lossless in both directions.',
      code: "bytes.fromhex(data.hex()) == data\n# True",
    },
    {
      q: 'Should I use hex or base64?',
      a: 'Hex when a human will read it — digests, short keys, protocol dumps — because each byte is visibly two digits. Base64 when size matters, since it adds about a third rather than doubling.',
    },
    {
      q: 'What does the second argument do?',
      a: 'bytes_per_sep sets the group size. Positive groups from the right, which suits numbers; negative groups from the left, which suits byte streams read front to back.',
      code: "b'abcd'.hex('_', 2)\n# '6162_6364'",
    },
  ],

  history: [
    { version: '3.5', note: 'hex() added to bytes, bytearray and memoryview.' },
    { version: '3.8', note: 'The sep and bytes_per_sep arguments added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.hex',
    meta:  'bytes.hex',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Compare hex and base64 encodings' },
  ],
};
