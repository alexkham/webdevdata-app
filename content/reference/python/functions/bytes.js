// content/reference/python/functions/bytes.js

export const meta = {
  slug:        'bytes',
  name:        'bytes',
  signature:   'bytes(source=..., encoding=..., errors=...)',
  blurb:       'Construct an immutable bytes object — three call shapes: size, iterable, or string.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes bytearray immutable binary byte object encode utf-8 iterable size constructor',
};

export const method = {
  slug:      'bytes',
  name:      'bytes',
  signature: 'bytes(source=..., encoding=..., errors=...)',
  returns:   { type: 'bytes', desc: 'An immutable sequence of bytes (integers 0..255). Three call shapes: `bytes(int)` → n zero bytes; `bytes(iterable_of_ints)` → those bytes; `bytes(str, encoding)` → same as str.encode(encoding).' },

  category:    'Built-in function / type',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The immutable byte-sequence type — the type on the other side of str.encode.',

  cheat: {
    commonCall: 'bytes(text, "utf-8")',
    returns:    'a bytes object — immutable',
    replaces:   'raw byte-array construction; bytearray is the mutable sibling',
    watchOut:   'bytes(5) does NOT mean \"the digit 5\" — it is FIVE zero bytes',
  },

  parameters: [
    { name: 'source',   type: 'int | iterable | str', required: false, default: '""', desc: 'The initial data. int: number of zero bytes. Iterable of ints: those bytes. String: requires encoding.' },
    { name: 'encoding', type: 'str', required: false, default: null, desc: 'When source is a string, the encoding to use. Same values as str.encode: "utf-8" (recommended), "ascii", "latin-1", ...' },
    { name: 'errors',   type: 'str', required: false, default: '"strict"', desc: 'Error handler when encoding a string. Same values as str.encode.' },
  ],

  demoParams: [
    { name: 'source',   type: 'str', hint: 'text or comma-separated ints', input: 'text' },
    { name: 'encoding', type: 'str', hint: 'utf-8 / ascii / latin-1 (for str)', input: 'text-or-none' },
  ],
  cases: [
    { id: 'string',    label: 'from string',        values: { source: 'hello',         encoding: 'utf-8' } },
    { id: 'accent',    label: 'accented string',    values: { source: 'café',          encoding: 'utf-8' } },
    { id: 'ascii',     label: 'string ascii',       values: { source: 'hello',         encoding: 'ascii' } },
    { id: 'empty',     label: 'empty',              values: { source: '',              encoding: '' } },
  ],
  demoExplainer: 'bytes() has THREE call shapes. Passing a STRING plus an encoding calls str.encode — the most common use. Passing an INT gives that many zero bytes: `bytes(5)` = five zero bytes (NOT the digit 5). Passing a comma-separated LIST of ints creates bytes from those values (each 0..255). The demo displays results in Python\'s b\'...\' literal form.',

  patterns: [
    {
      name: 'Encode a string',
      desc: 'The most common use — same as str.encode.',
      code: 'data = bytes(text, "utf-8")\n# equivalent to: text.encode("utf-8")',
    },
    {
      name: 'Pre-allocate a buffer',
      desc: 'Passing an int gives that many zero bytes.',
      code: 'buffer = bytes(1024)   # 1024 zero bytes',
    },
    {
      name: 'From explicit byte values',
      desc: 'Build a bytes object from a list of ints (0..255).',
      code: 'magic = bytes([0x89, 0x50, 0x4e, 0x47])   # PNG header',
    },
    {
      name: 'From a bytes literal',
      desc: 'Direct literal — no constructor needed for small constants.',
      code: 'header = b"HTTP/1.1 200 OK\\r\\n"',
    },
  ],

  examples: [
    { title: 'From string, utf-8',   code: 'bytes("hello", "utf-8")',           returns: "b'hello'" },
    { title: 'From string, accents', code: 'bytes("café", "utf-8")',            returns: "b'caf\\xc3\\xa9'" },
    { title: 'From list of ints',    code: 'bytes([65, 66, 67])',                returns: "b'ABC'" },
    { title: 'Int gives zero bytes', code: 'bytes(5)',                            returns: "b'\\x00\\x00\\x00\\x00\\x00'" },
    { title: 'Zero-size',            code: 'bytes(0)',                            returns: "b''" },
    { title: 'From bytes',           code: 'bytes(b"hi")',                        returns: "b'hi'  # copy" },
    { title: 'Range of ints',        code: 'bytes(range(3))',                     returns: "b'\\x00\\x01\\x02'" },
  ],

  pitfalls: [
    {
      name: 'bytes(5) is NOT b"5" — it is FIVE zero bytes',
      desc: 'The single most common bytes() surprise. Passing an int means \"that many zero bytes\", not \"the digit as a byte\". If you want to write \"5\" as a byte, wrap it in a list or use a bytes literal.',
      wrong: { label: 'Assumed digit', code: 'bytes(5)', output: "b'\\x00\\x00\\x00\\x00\\x00'" },
      fix:   { label: 'For the digit', code: 'bytes([5])   # b\'\\x05\'\nb"5"           # b\'5\'', output: 'literal vs digit vs char' },
    },
    {
      name: 'String without encoding raises TypeError',
      desc: 'Unlike str(x), which coerces anything to a string, bytes(str) requires an encoding. This is deliberate — no default encoding assumption.',
      wrong: { label: 'Missing encoding', code: 'bytes("hello")', output: "TypeError: string argument without an encoding" },
      fix:   { label: 'Add encoding',      code: 'bytes("hello", "utf-8")', output: "b'hello'" },
    },
    {
      name: 'Iterable elements must be 0..255',
      desc: 'Every value in the iterable must fit in a byte. Larger or negative ints raise ValueError.',
      wrong: { label: 'Out of range', code: 'bytes([256, 0])', output: 'ValueError: bytes must be in range(0, 256)' },
      fix:   { label: 'Mask to byte',  code: 'bytes([x & 0xff for x in values])', output: 'clamped' },
    },
    {
      name: 'bytes is IMMUTABLE — bytearray is the mutable sibling',
      desc: 'bytes is a sequence of bytes; you can index and slice but not modify. For an in-place mutable buffer, use bytearray.',
      wrong: { label: 'Cannot assign', code: 'b = bytes([1, 2, 3])\nb[0] = 9', output: "TypeError: 'bytes' object does not support item assignment" },
      fix:   { label: 'Use bytearray', code: 'b = bytearray([1, 2, 3])\nb[0] = 9', output: 'bytearray(b\'\\t\\x02\\x03\')' },
    },
  ],

  when: {
    use: [
      'Preparing text for byte-oriented output (network, binary file)',
      'Constructing binary payloads from a list of byte values',
      'Pre-allocating a fixed-size zero buffer',
      'Explicit conversion when the encoding matters',
    ],
    avoid: [
      'Direct constant literal → use b"..." literal instead of calling bytes()',
      'You need to mutate — use bytearray',
      'You have a str you want to inspect — work with str, only convert at the boundary',
      'You want a specific integer as a byte — use bytes([n]), not bytes(n)',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the source',
    return:     'A new bytes object — immutable',
    cpython:    'Objects/bytesobject.c :: bytes_new',
    memory:     'Allocates one bytes object; the internal buffer is compact',
    threadSafe: 'Yes — bytes objects are immutable',
  },

  related: [
    { name: 'str.encode',    slug: 'str-encode',    when: 'The equivalent method for a str you already have' },
    { name: 'chr',           slug: 'chr',           when: 'Get a str from a codepoint (not a byte)' },
    { name: 'ord',           slug: 'ord',           when: 'Get an int from a single char' },
    { name: 'hex',           slug: 'hex',           when: 'Convert an int to its hex string form' },
  ],

  faq: [
    {
      q: 'What is the difference between bytes and str?',
      a: 'bytes is a sequence of bytes (integers 0..255). str is a sequence of Unicode codepoints. bytes is for binary data — files, network, protocols. str is for text. Convert between them with str.encode / bytes.decode, always with an explicit encoding.',
    },
    {
      q: 'What is the difference between bytes and bytearray?',
      a: 'bytes is IMMUTABLE — you cannot change its contents after creation. bytearray is MUTABLE — you can assign to indices, extend, and pop. Both share the same reading operations; bytearray adds mutation methods.',
    },
    {
      q: 'When would I use bytes(5) instead of bytes([5])?',
      a: 'Almost never — they mean different things. bytes(5) creates FIVE zero bytes for use as a buffer. bytes([5]) creates ONE byte with value 5. If you want the digit character \"5\", use b\"5\" or bytes([ord(\"5\")]).',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes became a distinct type separate from str (Python 2 str was byte-like).' },
    { version: '3.5', note: 'bytes literal % formatting added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes',
    meta:  'bytes',
  },

  tryInTool: [
    { name: 'Base64 Encoder',  href: '/tools/base64',         meta: 'Encode/decode base64' },
    { name: 'JSON Formatter',  href: '/tools/json-formatter', meta: 'Inspect binary data' },
  ],
};