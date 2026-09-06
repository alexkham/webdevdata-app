// content/reference/python/functions/memoryview-hex.js
//
// Slug is type-prefixed: `hex` is the built-in and also a float method.

export const meta = {
  slug:        'memoryview-hex',
  name:        'memoryview.hex',
  signature:   'memoryview.hex([sep[, bytes_per_sep]])',
  blurb:       'The buffer as a plain hex string — two lowercase digits per byte, no prefix.',
  category:    'memoryview',
  type:        'memoryview',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'memoryview hex hexadecimal dump string bytes separator debug binary inspect',
};

export const method = {
  slug:      'memoryview-hex',
  name:      'memoryview.hex',
  signature: 'memoryview.hex([sep[, bytes_per_sep]])',
  returns:   { type: 'str', desc: 'A string of two lowercase hex digits per byte, with no 0x prefix and no separator unless one is requested.' },

  category:    'Memoryview method',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'The readable form of a binary buffer. Same method as bytes.hex, and the natural partner to bytes.fromhex for round trips.',

  cheat: {
    commonCall: 'view.hex()',
    returns:    "str like '616263' — lowercase, unseparated",
    replaces:   "''.join(f'{b:02x}' for b in view)",
    watchOut:   'no 0x prefix, so it is not a Python integer literal',
  },

  parameters: [
    { name: 'sep',            type: 'str', required: false, default: 'None', desc: "Separator between bytes, e.g. ' ' or ':'. Must be a single character." },
    { name: 'bytes_per_sep',  type: 'int', required: false, default: '1',    desc: 'How many bytes go between separators. Negative counts from the left instead of the right.' },
  ],

  demoParams: [
    { name: 's', type: 'str', hint: 'text to view as bytes', input: 'text' },
  ],
  demoTemplate: "memoryview(bytes({s}, 'utf-8')).hex()",
  cases: [
    { id: 'ascii',    label: 'plain ascii',  values: { s: 'abc' } },
    { id: 'word',     label: 'a word',       values: { s: 'hello' } },
    { id: 'non-ascii',label: 'non-ascii',    values: { s: 'héllo' } },
    { id: 'empty',    label: 'empty',        values: { s: '' } },
    { id: 'digits',   label: 'digits',       values: { s: '123' } },
  ],
  demoExplainer: 'Each byte becomes exactly two lowercase hex digits, run together with nothing between them. "abc" gives 616263, because a is 0x61. The output has no 0x prefix and no separators, so its length is always exactly twice the number of bytes — which makes it easy to slice back apart. The non-ascii case again shows UTF-8 at work: one accented character contributes four hex digits, because it is two bytes.',

  patterns: [
    {
      name: 'Round-trip binary through text',
      desc: 'bytes.fromhex reverses it exactly, which makes hex a safe transport for binary.',
      code: 'text = view.hex()\nrestored = bytes.fromhex(text)',
    },
    {
      name: 'Readable separators for a dump',
      desc: 'A separator every byte or every four makes long dumps scannable.',
      code: "view.hex(' ')       # '61 62 63'\nview.hex('_', 4)   # groups of four bytes",
    },
    {
      name: 'Log a buffer prefix',
      desc: 'The first few bytes usually identify a format.',
      code: 'log.debug("magic=%s", view[:4].hex())',
    },
  ],

  examples: [
    { title: 'ASCII',          code: "memoryview(b'abc').hex()",     returns: "'616263'" },
    { title: 'With spaces',    code: "memoryview(b'abc').hex(' ')",  returns: "'61 62 63'" },
    { title: 'Empty',          code: "memoryview(b'').hex()",        returns: "''" },
    { title: 'Round trip',     code: "bytes.fromhex(memoryview(b'abc').hex())", returns: "b'abc'" },
    { title: 'Non-ascii',      code: "memoryview('é'.encode()).hex()", returns: "'c3a9'" },
    { title: 'Not an int literal', code: "int(memoryview(b'abc').hex(), 16)", returns: '6382179  # base must be given' },
  ],

  pitfalls: [
    {
      name: 'No 0x prefix',
      desc: 'Unlike the built-in hex(), the output is bare digits. Passing it to int() without a base makes Python read it as decimal, which either fails or silently gives a wrong number.',
      wrong: { label: 'Read as decimal', code: "int(memoryview(b'\\x10').hex())", output: '10  # should be 16' },
      fix:   { label: 'State the base',  code: "int(memoryview(b'\\x10').hex(), 16)", output: '16' },
    },
    {
      name: 'Always lowercase',
      desc: 'There is no option for uppercase. Comparing against an uppercase fixture fails on case alone, which is an easy hour to lose in a test.',
      wrong: { label: 'Case mismatch', code: "memoryview(b'\\xab').hex() == 'AB'", output: 'False' },
      fix:   { label: 'Normalise',     code: "memoryview(b'\\xab').hex().upper() == 'AB'", output: 'True' },
    },
    {
      name: 'It is not the built-in hex()',
      desc: 'hex() takes one integer and returns something like 0xff. This method takes a whole buffer and returns two digits per byte. The names match but the outputs are not comparable.',
      wrong: { label: 'Different things', code: "hex(255), memoryview(b'\\xff').hex()", output: "('0xff', 'ff')" },
      fix:   { label: 'Pick deliberately', code: 'hex(n) for ints, view.hex() for buffers', output: 'clear intent' },
    },
  ],

  when: {
    use: [
      'Logging or displaying a binary buffer readably',
      'Round-tripping binary data through a text channel',
      'Test fixtures where a bytes literal would be unreadable',
      'Checking magic numbers at the head of a file',
    ],
    avoid: [
      'You need a Python int literal → the built-in hex()',
      'The data is text → decode it instead',
      'Compact transport matters → base64 is a third shorter',
    ],
  },

  notes: {
    complexity: 'O(n) — two characters emitted per byte',
    return:     'A new str, exactly twice the byte length when no separator is used',
    cpython:    'Objects/memoryobject.c :: memory_hex',
    memory:     'Allocates a string twice the size of the buffer',
    threadSafe: 'A concurrently mutated source gives an inconsistent snapshot',
  },

  related: [
    { name: 'memoryview.tobytes', slug: 'memoryview-tobytes', when: 'The raw bytes rather than their hex text' },
    { name: 'memoryview.tolist',  slug: 'memoryview-tolist',  when: 'Byte values as decimal ints' },
    { name: 'hex',                slug: 'hex',                when: 'Hexadecimal for a single integer' },
    { name: 'float.hex',          slug: 'float-hex',          when: 'The exact hex form of a float' },
  ],

  faq: [
    {
      q: 'How do I get the bytes back?',
      a: 'bytes.fromhex reverses it exactly. The round trip is lossless, which is what makes hex a dependable way to carry binary through a text-only channel.',
      code: "bytes.fromhex(view.hex()) == view.tobytes()\n# True",
    },
    {
      q: 'Can I make the output uppercase?',
      a: 'Not from the method — it always emits lowercase. Call .upper() on the result if a format or fixture demands capitals.',
      code: "view.hex().upper()",
    },
    {
      q: 'What does the second argument do?',
      a: 'bytes_per_sep controls how often the separator appears. A positive value groups from the right, which suits numbers; a negative value groups from the left, which suits byte streams read front to back.',
      code: "memoryview(b'abcd').hex('_', 2)\n# '6162_6364'",
    },
  ],

  history: [
    { version: '3.5', note: 'hex() added to bytes, bytearray and memoryview.' },
    { version: '3.8', note: 'The sep and bytes_per_sep arguments added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#memoryview.hex',
    meta:  'memoryview.hex',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Compare hex and base64 encodings' },
  ],
};
