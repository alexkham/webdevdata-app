// content/reference/python/functions/bytes-ljust.js

export const meta = {
  slug:        'bytes-ljust',
  name:        'bytes.ljust',
  signature:   'bytes.ljust(width[, fillbyte])',
  blurb:       'Left-justify — pad on the RIGHT to a width. Never truncates.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes ljust left justify pad right align width fill column fixed binary bytearray bytearray.ljust',
};

export const method = {
  slug:      'bytes-ljust',
  name:      'bytes.ljust',
  signature: 'bytes.ljust(width[, fillbyte])',
  returns:   { type: 'bytes', desc: 'A new bytes object padded on the right with fillbyte to at least width. Data already that long is returned unchanged.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The name describes where the DATA sits, not where the padding goes. Left-justified data means the padding is on the right — a lifelong source of confusion.',

  cheat: {
    commonCall: 'field.ljust(10)',
    returns:    'a new bytes object at least width long',
    replaces:   "data + fill * (width - len(data)), which goes negative on wide data",
    watchOut:   'it pads on the RIGHT; the fill must be exactly one byte',
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
  demoTemplate: "bytes({s}, 'utf-8').ljust({width}, bytes({fill}, 'utf-8'))",
  cases: [
    { id: 'basic',  label: 'pad to 5',       values: { s: 'ab',     width: 5, fill: '-' } },
    { id: 'dot',    label: 'dot leader',     values: { s: 'name',   width: 10, fill: '.' } },
    { id: 'exact',  label: 'exact width',    values: { s: 'abc',    width: 3, fill: '-' } },
    { id: 'wide',   label: 'already wide',   values: { s: 'abcdef', width: 3, fill: '-' } },
    { id: 'empty',  label: 'empty data',     values: { s: '',       width: 3, fill: '-' } },
  ],
  demoExplainer: 'The data stays at the left edge and fill bytes are added on the right until the width is reached. Data that already meets or exceeds the width comes back unchanged — ljust never cuts anything off. Empty data becomes pure fill. The fill must be a single byte, exactly as with center and rjust.',

  patterns: [
    {
      name: 'Fixed-width columns',
      desc: 'Left-aligned text columns in a byte-based report.',
      code: "row = name.ljust(20) + amount.rjust(10)",
    },
    {
      name: 'Pad a record to a fixed size',
      desc: 'Legacy formats often require exact field lengths.',
      code: "field = value.ljust(FIELD_LEN, b'\\x00')",
    },
    {
      name: 'Dot leaders',
      desc: 'Table-of-contents style alignment.',
      code: "line = title.ljust(60, b'.') + page",
    },
  ],

  examples: [
    { title: 'Pad right',     code: "b'ab'.ljust(5, b'-')",    returns: "b'ab---'" },
    { title: 'Default space', code: "b'ab'.ljust(4)",          returns: "b'ab  '" },
    { title: 'Exact width',   code: "b'abc'.ljust(3, b'-')",   returns: "b'abc'" },
    { title: 'Already wide',  code: "b'abcdef'.ljust(3)",      returns: "b'abcdef'" },
    { title: 'Empty',         code: "b''.ljust(3, b'-')",      returns: "b'---'" },
    { title: 'Bad fill',      code: "b'ab'.ljust(5, b'--')",   returns: 'TypeError: ljust() argument 2 must be a byte string of length 1, not bytes' },
  ],

  pitfalls: [
    {
      name: 'ljust pads on the RIGHT',
      desc: 'The name refers to where the data is justified, not where the fill goes. Left-justified means left-aligned, so the space is on the right. People reach for ljust wanting left padding and get the opposite.',
      wrong: { label: 'Wrong side', code: "b'42'.ljust(5, b'0')", output: "b'42000'" },
      fix:   { label: 'rjust pads left', code: "b'42'.rjust(5, b'0')", output: "b'00042'" },
    },
    {
      name: 'It never truncates',
      desc: 'Data longer than the width is returned as-is, so a fixed-width field can silently overflow. Slice first if the width is a hard limit.',
      wrong: { label: 'Overflows', code: "b'toolong'.ljust(4)", output: "b'toolong'" },
      fix:   { label: 'Slice then pad', code: "b'toolong'[:4].ljust(4)", output: "b'tool'" },
    },
    {
      name: 'Width counts bytes, not characters',
      desc: 'A multi-byte character occupies more of the width than it appears to, so encoded text misaligns.',
      wrong: { label: 'Off by bytes', code: "'é'.encode().ljust(3, b'-')", output: "b'\\xc3\\xa9-'  # one char, but 2 bytes" },
      fix:   { label: 'Pad text',     code: "'é'.ljust(3, '-').encode()", output: 'padded by character' },
    },
  ],

  when: {
    use: [
      'Left-aligned columns in fixed-width byte output',
      'Padding a field to a required length',
      'Dot leaders and similar alignment',
    ],
    avoid: [
      'Padding on the LEFT → rjust',
      'Text with non-ASCII characters → decode, pad, encode',
      'A hard width limit → slice first, since ljust never truncates',
    ],
  },

  notes: {
    complexity: 'O(width) — one allocation and fill',
    return:     'A new bytes object; the original when already wide enough',
    cpython:    'Objects/bytesobject.c :: stringlib_ljust',
    memory:     'Allocates a buffer of max(len, width)',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.rjust',  slug: 'bytes-rjust',  when: 'Pad on the left instead' },
    { name: 'bytes.center', slug: 'bytes-center', when: 'Pad both sides' },
    { name: 'str.ljust',    slug: 'str-ljust',    when: 'The str version, counting characters' },
    { name: 'bytes.zfill',  slug: 'bytes-zfill',  when: 'Sign-aware zero padding on the left' },
  ],

  faq: [
    {
      q: 'Why does ljust add padding on the right?',
      a: 'Because it LEFT-justifies the data — pushes it to the left edge — and whatever space remains is on the right. Think of it as text alignment in a word processor: left-aligned text has ragged space on the right.',
      code: "b'ab'.ljust(5, b'-')\n# b'ab---'",
    },
    {
      q: 'What if the data is longer than the width?',
      a: 'It is returned unchanged. ljust only ever adds; it never removes. Slice to the width first if overflow is not acceptable.',
    },
    {
      q: 'Does bytearray have ljust?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.ljust arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.ljust',
    meta:  'bytes.ljust',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
