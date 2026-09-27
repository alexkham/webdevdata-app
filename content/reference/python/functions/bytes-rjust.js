// content/reference/python/functions/bytes-rjust.js

export const meta = {
  slug:        'bytes-rjust',
  name:        'bytes.rjust',
  signature:   'bytes.rjust(width[, fillbyte])',
  blurb:       'Right-justify — pad on the LEFT to a width. Never truncates.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes rjust right justify pad left align width fill column numbers binary bytearray bytearray.rjust',
};

export const method = {
  slug:      'bytes-rjust',
  name:      'bytes.rjust',
  signature: 'bytes.rjust(width[, fillbyte])',
  returns:   { type: 'bytes', desc: 'A new bytes object padded on the left with fillbyte to at least width. Data already that long is returned unchanged.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The usual choice for numeric columns. Unlike zfill it knows nothing about signs, so a zero fill on a negative number buries the minus.',

  cheat: {
    commonCall: 'amount.rjust(10)',
    returns:    'a new bytes object at least width long',
    replaces:   "fill * (width - len(data)) + data, which goes negative on wide data",
    watchOut:   "rjust(5, b'0') on b'-42' gives b'00-42'; use zfill for numbers",
  },

  parameters: [
    { name: 'width',    type: 'int',   required: true,  default: null,  desc: 'Minimum total length. Shorter widths return the data unchanged.' },
    { name: 'fillbyte', type: 'bytes', required: false, default: "b' '", desc: 'A bytes object of length exactly 1. Anything else raises TypeError.' },
  ],

  demoParams: [
    { name: 's',     type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'width', type: 'int', hint: 'total width',             input: 'number' },
    { name: 'fill',  type: 'str', hint: 'fill byte (one char)',    input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').rjust({width}, bytes({fill}, 'utf-8'))",
  cases: [
    { id: 'basic',  label: 'pad to 5',        values: { s: 'ab',     width: 5, fill: '-' } },
    { id: 'zero',   label: 'zero fill',       values: { s: '42',     width: 5, fill: '0' } },
    { id: 'neg',    label: 'negative (!)',    values: { s: '-42',    width: 5, fill: '0' } },
    { id: 'wide',   label: 'already wide',    values: { s: 'abcdef', width: 3, fill: '-' } },
    { id: 'empty',  label: 'empty data',      values: { s: '',       width: 3, fill: '-' } },
  ],
  demoExplainer: 'Fill bytes are added on the left until the width is reached, pushing the data to the right edge. The negative case is the one to notice: rjust has no idea that -42 is a number, so the zeros go in front of the minus sign and you get 00-42. That is exactly the case zfill exists for. Data already at or beyond the width comes back unchanged.',

  patterns: [
    {
      name: 'Right-aligned numeric column',
      desc: 'Numbers line up on their last digit.',
      code: "row = name.ljust(20) + amount.rjust(10)",
    },
    {
      name: 'Fixed-width field with a custom fill',
      desc: 'Legacy formats sometimes want a specific pad byte.',
      code: "field = value.rjust(8, b'\\x00')",
    },
    {
      name: 'Zero-pad a number correctly',
      desc: 'zfill keeps the sign in front; rjust does not.',
      code: "num.zfill(8)   # not num.rjust(8, b'0')",
    },
  ],

  examples: [
    { title: 'Pad left',      code: "b'ab'.rjust(5, b'-')",   returns: "b'---ab'" },
    { title: 'Default space', code: "b'ab'.rjust(4)",         returns: "b'  ab'" },
    { title: 'Zero fill',     code: "b'42'.rjust(5, b'0')",   returns: "b'00042'" },
    { title: 'Sign buried',   code: "b'-42'.rjust(5, b'0')",  returns: "b'00-42'" },
    { title: 'zfill instead', code: "b'-42'.zfill(5)",        returns: "b'-0042'" },
    { title: 'Already wide',  code: "b'abcdef'.rjust(3)",     returns: "b'abcdef'" },
  ],

  pitfalls: [
    {
      name: 'A zero fill buries the sign',
      desc: 'rjust is not numeric-aware. Padding a negative number with zeros puts them before the minus, producing something that is not a valid number at all.',
      wrong: { label: 'Not a number', code: "b'-42'.rjust(5, b'0')", output: "b'00-42'" },
      fix:   { label: 'Use zfill',    code: "b'-42'.zfill(5)", output: "b'-0042'" },
    },
    {
      name: 'It never truncates',
      desc: 'Data longer than the width is returned as-is. A column can silently overflow its allotted space.',
      wrong: { label: 'Overflows', code: "b'toolong'.rjust(4)", output: "b'toolong'" },
      fix:   { label: 'Slice then pad', code: "b'toolong'[-4:].rjust(4)", output: "b'long'" },
    },
    {
      name: 'Width counts bytes, not characters',
      desc: 'Encoded text with multi-byte characters is wider than it looks, so columns drift.',
      wrong: { label: 'Off by bytes', code: "'é'.encode().rjust(3, b'-')", output: "b'-\\xc3\\xa9'" },
      fix:   { label: 'Pad text',     code: "'é'.rjust(3, '-').encode()", output: 'padded by character' },
    },
  ],

  when: {
    use: [
      'Right-aligned columns in fixed-width byte output',
      'Padding a field on the left with a non-zero byte',
    ],
    avoid: [
      'Zero-padding numbers → zfill, which respects the sign',
      'Padding on the RIGHT → ljust',
      'Text with non-ASCII characters → decode, pad, encode',
    ],
  },

  notes: {
    complexity: 'O(width) — one allocation and fill',
    return:     'A new bytes object; the original when already wide enough',
    cpython:    'Objects/bytesobject.c :: stringlib_rjust',
    memory:     'Allocates a buffer of max(len, width)',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.zfill',  slug: 'bytes-zfill',  when: 'Zero padding that keeps the sign in front' },
    { name: 'bytes.ljust',  slug: 'bytes-ljust',  when: 'Pad on the right instead' },
    { name: 'bytes.center', slug: 'bytes-center', when: 'Pad both sides' },
    { name: 'str.rjust',    slug: 'str-rjust',    when: 'The str version, counting characters' },
  ],

  faq: [
    {
      q: 'rjust with zeros or zfill?',
      a: 'zfill, for anything numeric — it moves the zeros after a leading sign. rjust treats the sign as just another byte and pads in front of it.',
      code: "b'-42'.rjust(5, b'0')   # b'00-42'\nb'-42'.zfill(5)         # b'-0042'",
    },
    {
      q: 'Why is my column misaligned?',
      a: 'Almost always because the width is in bytes and the data contains multi-byte characters, or because an over-long value overflowed since rjust never truncates.',
    },
    {
      q: 'Does bytearray have rjust?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.rjust arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.rjust',
    meta:  'bytes.rjust',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
