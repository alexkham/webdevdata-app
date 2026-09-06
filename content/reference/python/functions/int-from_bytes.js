// content/reference/python/functions/int-from_bytes.js
//
// Slug is type-prefixed: `from_bytes` is an int classmethod.

export const meta = {
  slug:        'int-from_bytes',
  name:        'int.from_bytes',
  signature:   'int.from_bytes(bytes, byteorder, *, signed=False)',
  blurb:       'Read an integer back out of a bytes object, big- or little-endian.',
  category:    'integer',
  type:        'int',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'from bytes unpack deserialize parse endian big little binary decode int bytes to int bool bool.from_bytes',
};

export const method = {
  slug:      'int-from_bytes',
  name:      'int.from_bytes',
  signature: 'int.from_bytes(bytes, byteorder, *, signed=False)',
  returns:   { type: 'int', desc: 'The integer the bytes represent. Empty bytes give 0. Never raises for width — any length is valid.' },

  category:    'Int classmethod',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'The inverse of to_bytes, and a classmethod — you call it on the int type, not on a value. Any length of input is accepted, including empty.',

  cheat: {
    commonCall: "int.from_bytes(blob, 'big')",
    returns:    'int — arbitrarily large if the input is long',
    replaces:   'struct.unpack for simple fixed-width integers',
    watchOut:   'called on the TYPE: int.from_bytes(...), not some_int.from_bytes(...)',
  },

  parameters: [
    { name: 'bytes',     type: 'bytes-like', required: true,  default: null,     desc: 'A bytes, bytearray, or any iterable of ints in range(256). Empty is allowed and yields 0.' },
    { name: 'byteorder', type: 'str',        required: false, default: "'big'",  desc: "'big' reads the most significant byte first; 'little' reads it last. Since 3.11 it defaults to 'big'." },
    { name: 'signed',    type: 'bool',       required: false, default: 'False',  desc: 'Keyword-only. True interprets the input as two-complement, so a high top bit means a negative result.' },
  ],

  demoParams: [
    { name: 'vals',      type: 'list', hint: 'byte values, 0-255, comma separated', input: 'csv-num' },
    { name: 'byteorder', type: 'str',  hint: "'big' or 'little'",                   input: 'text' },
  ],
  demoTemplate: 'int.from_bytes(bytes({vals}), {byteorder})',
  cases: [
    { id: 'big',      label: 'big-endian',      values: { vals: '0,255',   byteorder: 'big' } },
    { id: 'little',   label: 'little-endian',   values: { vals: '0,255',   byteorder: 'little' } },
    { id: 'max',      label: 'two full bytes',  values: { vals: '255,255', byteorder: 'big' } },
    { id: 'empty',    label: 'empty is zero',   values: { vals: '',        byteorder: 'big' } },
    { id: 'one-le',   label: 'one, little',     values: { vals: '1,0,0,0', byteorder: 'little' } },
    { id: 'leading',  label: 'leading zeros',   values: { vals: '0,0,1',   byteorder: 'big' } },
  ],
  demoExplainer: 'from_bytes reads the bytes as digits of a base-256 number. Byte order decides which end is most significant, which is why b"\\x00\\xff" is 255 big-endian but 65280 little-endian. Unlike to_bytes there is no width to overflow — any number of bytes is valid, and empty input is defined as 0. Leading zero bytes simply do not contribute.',

  patterns: [
    {
      name: 'Read a length prefix off a wire',
      desc: 'The mirror image of packing the header with to_bytes.',
      code: "length = int.from_bytes(header[:4], 'big')",
    },
    {
      name: 'Turn a hash digest into a number',
      desc: 'Any digest is just bytes; from_bytes gives you the integer behind it.',
      code: "value = int.from_bytes(hashlib.sha256(data).digest(), 'big')",
    },
    {
      name: 'Signed round trip',
      desc: 'Pass signed=True on both halves or the values will not match.',
      code: "raw = (-1).to_bytes(2, 'big', signed=True)\nint.from_bytes(raw, 'big', signed=True)   # -1",
    },
  ],

  examples: [
    { title: 'Big-endian',      code: "int.from_bytes(b'\\x00\\xff', 'big')",    returns: '255' },
    { title: 'Little-endian',   code: "int.from_bytes(b'\\x00\\xff', 'little')", returns: '65280' },
    { title: 'Two full bytes',  code: "int.from_bytes(b'\\xff\\xff', 'big')",    returns: '65535' },
    { title: 'Empty is zero',   code: "int.from_bytes(b'', 'big')",              returns: '0' },
    { title: 'Signed reads negative', code: "int.from_bytes(b'\\xff\\xff', 'big', signed=True)", returns: '-1' },
    { title: 'Any length works',code: "int.from_bytes(b'\\x01' * 32, 'big')",    returns: 'a very large int' },
  ],

  pitfalls: [
    {
      name: 'Mismatched byteorder silently gives a wrong number',
      desc: 'This is the big one. Packing big-endian and reading little-endian does not raise — it hands back a plausible but wrong value. 255 becomes 65280 and nothing complains.',
      wrong: { label: 'Silent corruption', code: "raw = (255).to_bytes(2, 'big')\nint.from_bytes(raw, 'little')", output: '65280' },
      fix:   { label: 'Same order both ways', code: "raw = (255).to_bytes(2, 'big')\nint.from_bytes(raw, 'big')", output: '255' },
    },
    {
      name: 'Forgetting signed=True on the way back',
      desc: 'Two-complement bytes read as unsigned produce a large positive number instead of the negative you stored. Like byteorder, the flag has to match on both sides.',
      wrong: { label: 'Lost the sign', code: "raw = (-1).to_bytes(2, 'big', signed=True)\nint.from_bytes(raw, 'big')", output: '65535' },
      fix:   { label: 'Signed both ways', code: "int.from_bytes(raw, 'big', signed=True)", output: '-1' },
    },
    {
      name: 'It is a classmethod',
      desc: 'It lives on the type. Calling it on an instance works, because the instance finds the same classmethod, but it reads as though the value matters when it does not.',
      wrong: { label: 'Misleading',  code: "(0).from_bytes(b'\\x01', 'big')", output: '1  # the 0 was ignored entirely' },
      fix:   { label: 'Call on the type', code: "int.from_bytes(b'\\x01', 'big')", output: '1' },
    },
  ],

  when: {
    use: [
      'Reading fixed-width integers out of a binary protocol or file',
      'Converting a digest or nonce into a number',
      'Round-tripping values written with to_bytes',
      'Decoding arbitrary-length big integers, which struct cannot do',
    ],
    avoid: [
      'Unpacking several fields at once → struct.unpack',
      'Parsing text digits → int(s) or int(s, base)',
      'Untrusted length prefixes → validate before allocating on the result',
    ],
  },

  notes: {
    complexity: 'O(len(bytes)) — one pass over the input',
    return:     'A new int, arbitrarily large for long inputs',
    cpython:    'Objects/longobject.c :: int_from_bytes_impl',
    memory:     'Allocates an int wide enough for the input',
    threadSafe: 'Yes — ints and bytes are immutable',
  },

  related: [
    { name: 'int.to_bytes',   slug: 'int-to_bytes',   when: 'The inverse — pack an int into bytes' },
    { name: 'bytes',          slug: 'bytes',          when: 'Build the bytes object you are about to decode' },
    { name: 'int',            slug: 'int',            when: 'Parse an integer from text rather than bytes' },
    { name: 'memoryview',     slug: 'memoryview',     when: 'Slice a large buffer without copying it first' },
  ],

  faq: [
    {
      q: 'Why is empty bytes 0 rather than an error?',
      a: 'It falls out of reading the input as a base-256 number: an empty sequence of digits sums to nothing, so the value is 0. It also makes from_bytes total — no length is invalid — which is why only to_bytes can raise OverflowError.',
      code: "int.from_bytes(b'', 'big')\n# 0",
    },
    {
      q: 'Does it accept a bytearray or a list?',
      a: 'Yes. Anything iterable yielding ints in range(256) works — bytes, bytearray, memoryview, or a plain list like [0, 255]. The bytes-like requirement is about the values, not the exact type.',
      code: "int.from_bytes([0, 255], 'big')\n# 255",
    },
    {
      q: 'How do I know which byteorder the data used?',
      a: 'You cannot tell from the bytes alone — that is why it is a required decision rather than something Python guesses. It has to come from the format specification, a magic number, or a byte-order mark agreed in advance.',
    },
  ],

  history: [
    { version: '3.2',  note: 'int.from_bytes added alongside int.to_bytes.' },
    { version: '3.11', note: 'byteorder defaults to "big".' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#int.from_bytes',
    meta:  'int.from_bytes',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Decode transported bytes before reading them' },
  ],
};
