// content/reference/python/functions/int-to_bytes.js
//
// Slug is type-prefixed: `to_bytes` is an int method.

export const meta = {
  slug:        'int-to_bytes',
  name:        'int.to_bytes',
  signature:   'int.to_bytes(length, byteorder, *, signed=False)',
  blurb:       'Pack an integer into a fixed number of bytes, big- or little-endian.',
  category:    'integer',
  type:        'int',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'to bytes pack serialize endian big little binary struct int convert network order bool bool.to_bytes',
};

export const method = {
  slug:      'int-to_bytes',
  name:      'int.to_bytes',
  signature: 'int.to_bytes(length, byteorder, *, signed=False)',
  returns:   { type: 'bytes', desc: 'A bytes object of exactly `length` bytes. Raises OverflowError if the value does not fit.' },

  category:    'Int method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'The serialization half of the pair with from_bytes. You choose the width and the byte order; Python refuses rather than truncate if the value will not fit.',

  cheat: {
    commonCall: "n.to_bytes(4, 'big')",
    returns:    'bytes of exactly that length, zero-padded on the high side',
    replaces:   'struct.pack for simple fixed-width integers',
    watchOut:   'a value too large raises OverflowError — it never silently truncates',
  },

  parameters: [
    { name: 'length',    type: 'int',  required: false, default: '1',       desc: 'How many bytes to produce. Since 3.11 it defaults to 1. Too small for the value raises OverflowError.' },
    { name: 'byteorder', type: 'str',  required: false, default: "'big'",   desc: "'big' puts the most significant byte first; 'little' puts it last. Since 3.11 it defaults to 'big'. Anything else raises ValueError." },
    { name: 'signed',    type: 'bool', required: false, default: 'False',   desc: 'Keyword-only. False rejects negative values; True encodes them in two-complement form.' },
  ],

  demoParams: [
    { name: 'n',         type: 'int', hint: 'integer to pack',       input: 'number' },
    { name: 'length',    type: 'int', hint: 'how many bytes',        input: 'number' },
    { name: 'byteorder', type: 'str', hint: "'big' or 'little'",     input: 'text' },
  ],
  demoTemplate: '({n}).to_bytes({length}, {byteorder})',
  cases: [
    { id: 'big',       label: 'big-endian',      values: { n: 255,   length: 2, byteorder: 'big' } },
    { id: 'little',    label: 'little-endian',   values: { n: 255,   length: 2, byteorder: 'little' } },
    { id: 'padded',    label: 'zero-padded',     values: { n: 1,     length: 4, byteorder: 'big' } },
    { id: 'zero',      label: 'zero',            values: { n: 0,     length: 1, byteorder: 'big' } },
    { id: 'full',      label: 'fills the width', values: { n: 65535, length: 2, byteorder: 'big' } },
    { id: 'too-big',   label: 'too big to fit',  values: { n: 256,   length: 1, byteorder: 'big' } },
    { id: 'negative',  label: 'negative unsigned', values: { n: -1,  length: 2, byteorder: 'big' } },
  ],
  demoExplainer: 'to_bytes writes the value into exactly `length` bytes, padding the high side with zeros. Byte order decides which end the most significant byte goes: 255 in two bytes is b"\\x00\\xff" big-endian and b"\\xff\\x00" little-endian. Two things raise instead of guessing — a value wider than the requested length (OverflowError: int too big to convert) and a negative value without signed=True (OverflowError: can\'t convert negative int to unsigned).',

  patterns: [
    {
      name: 'Network byte order',
      desc: 'Big-endian is network order — the default choice for wire protocols.',
      code: "header = length.to_bytes(4, 'big')",
    },
    {
      name: 'Size the width from the value',
      desc: 'bit_length tells you the minimum width; floor at one byte for zero.',
      code: "width = max(1, n.bit_length() + 7 >> 3)\nblob = n.to_bytes(width, 'big')",
    },
    {
      name: 'Signed values',
      desc: 'Negative numbers need signed=True, and one bit of the width goes to the sign.',
      code: "(-1).to_bytes(2, 'big', signed=True)   # b'\\xff\\xff'",
    },
  ],

  examples: [
    { title: 'Big-endian',        code: "(255).to_bytes(2, 'big')",    returns: "b'\\x00\\xff'" },
    { title: 'Little-endian',     code: "(255).to_bytes(2, 'little')", returns: "b'\\xff\\x00'" },
    { title: 'Zero-padded',       code: "(1).to_bytes(4, 'big')",      returns: "b'\\x00\\x00\\x00\\x01'" },
    { title: 'Exactly fills',     code: "(65535).to_bytes(2, 'big')",  returns: "b'\\xff\\xff'" },
    { title: 'Too big raises',    code: "(256).to_bytes(1, 'big')",    returns: 'OverflowError: int too big to convert' },
    { title: 'Signed negative',   code: "(-1).to_bytes(2, 'big', signed=True)", returns: "b'\\xff\\xff'" },
  ],

  pitfalls: [
    {
      name: 'Negative without signed=True raises',
      desc: 'The default is unsigned, so any negative value is rejected outright. The error mentions "unsigned", which is the hint that signed=True is what you wanted.',
      wrong: { label: 'Rejected',       code: "(-1).to_bytes(2, 'big')", output: "OverflowError: can't convert negative int to unsigned" },
      fix:   { label: 'Opt into signed', code: "(-1).to_bytes(2, 'big', signed=True)", output: "b'\\xff\\xff'" },
    },
    {
      name: 'It raises rather than truncating',
      desc: 'Unlike C casts and many struct helpers, an oversized value is an error, not a wrap-around. This is a feature — silent truncation is how corrupt protocol frames happen — but it means you must size the width correctly.',
      wrong: { label: 'Will not fit',  code: "(256).to_bytes(1, 'big')", output: 'OverflowError: int too big to convert' },
      fix:   { label: 'Size it first', code: "n.to_bytes(max(1, (n.bit_length() + 7) // 8), 'big')", output: 'always wide enough' },
    },
    {
      name: 'signed=True costs you a bit of range',
      desc: 'In two-complement the top bit is the sign, so a signed byte holds -128..127 rather than 0..255. A value that fit unsigned may overflow once you turn signed on.',
      wrong: { label: 'Fit, then did not', code: "(200).to_bytes(1, 'big', signed=True)", output: 'OverflowError: int too big to convert' },
      fix:   { label: 'Widen or go unsigned', code: "(200).to_bytes(1, 'big')", output: "b'\\xc8'" },
    },
    {
      name: 'The defaults only exist on 3.11+',
      desc: 'Since 3.11 length defaults to 1 and byteorder to "big". On 3.10 and earlier both are required positionally, so n.to_bytes() is a TypeError there.',
      wrong: { label: 'TypeError pre-3.11', code: '(255).to_bytes()', output: 'TypeError: to_bytes() missing required argument' },
      fix:   { label: 'Always be explicit',  code: "(255).to_bytes(1, 'big')", output: "b'\\xff'  # works everywhere" },
    },
  ],

  when: {
    use: [
      'Writing fixed-width integers into a binary protocol or file format',
      'Producing network byte order without pulling in struct',
      'Hashing or checksumming an integer as raw bytes',
      'Round-tripping with int.from_bytes',
    ],
    avoid: [
      'Packing several fields at once → struct.pack is clearer',
      'Text output → format, hex or bin',
      'Arbitrary objects → pickle or a real serializer',
    ],
  },

  notes: {
    complexity: 'O(length) — one pass writing the bytes',
    return:     'A new immutable bytes object of exactly `length` bytes',
    cpython:    'Objects/longobject.c :: int_to_bytes_impl',
    memory:     'Allocates exactly `length` bytes',
    threadSafe: 'Yes — ints and bytes are immutable',
  },

  related: [
    { name: 'int.from_bytes',  slug: 'int-from_bytes',  when: 'The inverse — read an int back out of bytes' },
    { name: 'int.bit_length',  slug: 'int-bit_length',  when: 'Work out the width you need before packing' },
    { name: 'bytes',           slug: 'bytes',           when: 'Build a bytes object from other sources' },
    { name: 'hex',             slug: 'hex',             when: 'Text view of the same value instead of bytes' },
  ],

  faq: [
    {
      q: "Which byteorder should I use?",
      a: "Big-endian for anything crossing a wire or a file format, because it is network byte order and most specifications assume it. Little-endian when matching x86 memory layout or a format that specifies it. If you control both ends, pick one and write it down.",
      code: "n.to_bytes(4, 'big')     # network order",
    },
    {
      q: 'How do I avoid OverflowError?',
      a: 'Derive the width from the value instead of hard-coding it: max(1, (n.bit_length() + 7) // 8) is the smallest width that always fits. Add one bit of headroom if you are also passing signed=True.',
      code: "width = max(1, (n.bit_length() + 7) // 8)\nn.to_bytes(width, 'big')",
    },
    {
      q: 'Is this the same as struct.pack?',
      a: 'For one integer, effectively yes, and to_bytes is clearer because the width is a number rather than a format character. struct wins when you are packing several fields together or need alignment and padding rules.',
    },
  ],

  history: [
    { version: '3.2',  note: 'int.to_bytes added alongside int.from_bytes.' },
    { version: '3.11', note: 'length defaults to 1 and byteorder defaults to "big".' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#int.to_bytes',
    meta:  'int.to_bytes',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Encode the resulting bytes for transport' },
  ],
};
