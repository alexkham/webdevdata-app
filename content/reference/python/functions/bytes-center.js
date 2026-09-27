// content/reference/python/functions/bytes-center.js

export const meta = {
  slug:        'bytes-center',
  name:        'bytes.center',
  signature:   'bytes.center(width[, fillbyte])',
  blurb:       'Pad both sides to a width — with a parity rule for where the odd byte goes.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes center centre pad align width fill both sides parity odd binary bytearray bytearray.center',
};

export const method = {
  slug:      'bytes-center',
  name:      'bytes.center',
  signature: 'bytes.center(width[, fillbyte])',
  returns:   { type: 'bytes', desc: 'A new bytes object padded on both sides to at least width. Never truncates. When the padding cannot be split evenly, which side gets the extra byte depends on a parity rule.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Centring with an odd byte to spare is where the surprise lives: sometimes the extra goes left, sometimes right, and the rule is not "always left".',

  cheat: {
    commonCall: "data.center(20, b'-')",
    returns:    'a new bytes object at least width long',
    replaces:   'computing left and right padding by hand',
    watchOut:   'the fill must be exactly ONE byte; the odd-padding side is not intuitive',
  },

  parameters: [
    { name: 'width',    type: 'int',   required: true,  default: null,  desc: 'Minimum total length. Shorter widths return the data unchanged.' },
    { name: 'fillbyte', type: 'bytes', required: false, default: "b' '", desc: 'A bytes object of length exactly 1. Longer or shorter raises TypeError.' },
  ],

  demoParams: [
    { name: 's',     type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'width', type: 'int', hint: 'total width',             input: 'number' },
    { name: 'fill',  type: 'str', hint: 'fill byte (one char)',    input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').center({width}, bytes({fill}, 'utf-8'))",
  cases: [
    { id: 'even',    label: 'even padding',      values: { s: 'ab',     width: 6, fill: '*' } },
    { id: 'odd-left',label: 'odd — extra LEFT',  values: { s: 'ab',     width: 7, fill: '*' } },
    { id: 'odd-right',label: 'odd — extra RIGHT',values: { s: 'abc',    width: 6, fill: '*' } },
    { id: 'wide',    label: 'already wide',      values: { s: 'abcdef', width: 3, fill: '*' } },
    { id: 'badfill', label: 'two-byte fill (!)', values: { s: 'ab',     width: 6, fill: '**' } },
  ],
  demoExplainer: 'When the padding splits evenly the result is symmetric. Compare the two odd cases carefully: ab centred to 7 gets the extra star on the LEFT, but abc centred to 6 gets it on the RIGHT. CPython puts the extra byte on the left only when the data length and the width have different parity — it is not a fixed side. Data already at or beyond the width comes back unchanged, and a fill that is not exactly one byte raises TypeError.',

  patterns: [
    {
      name: 'Centre a heading in a fixed-width report',
      desc: 'Legacy line-printer style output.',
      code: "line = title.center(80, b'=')",
    },
    {
      name: 'Build a banner',
      desc: 'A fill byte other than space makes a visual rule.',
      code: "banner = b' ' + label + b' '\nbanner = banner.center(40, b'-')",
    },
    {
      name: 'Centre real text',
      desc: 'Decode first so width is counted in characters, not bytes.',
      code: "text.decode('utf-8').center(20).encode('utf-8')",
    },
  ],

  examples: [
    { title: 'Even padding',   code: "b'ab'.center(6, b'*')",     returns: "b'**ab**'" },
    { title: 'Odd, extra left',code: "b'ab'.center(7, b'*')",     returns: "b'***ab**'" },
    { title: 'Odd, extra right',code: "b'abc'.center(6, b'*')",   returns: "b'*abc**'" },
    { title: 'Default space',  code: "b'ab'.center(4)",           returns: "b' ab '" },
    { title: 'Already wide',   code: "b'abcdef'.center(3)",       returns: "b'abcdef'" },
    { title: 'Bad fill',       code: "b'ab'.center(6, b'**')",    returns: 'TypeError: center() argument 2 must be a byte string of length 1, not bytes' },
  ],

  pitfalls: [
    {
      name: 'The odd byte does not always go to the same side',
      desc: 'CPython\'s rule is that the extra padding goes left when len and width differ in parity, right when they match. Code that assumes "always left" or "always right" produces off-by-one alignment on half its inputs.',
      wrong: { label: 'Inconsistent', code: "b'ab'.center(7, b'*'), b'abc'.center(6, b'*')", output: "(b'***ab**', b'*abc**')" },
      fix:   { label: 'Pad explicitly', code: "pad = width - len(d)\nb'*' * (pad // 2) + d + b'*' * (pad - pad // 2)", output: 'your rule, stated' },
    },
    {
      name: 'The fill must be exactly one byte',
      desc: 'A multi-byte fill is a TypeError, which means a non-ASCII fill character encoded as UTF-8 is rejected — it is two or more bytes.',
      wrong: { label: 'Two bytes', code: "b'ab'.center(6, '·'.encode())", output: 'TypeError: center() argument 2 must be a byte string of length 1' },
      fix:   { label: 'ASCII fill', code: "b'ab'.center(6, b'.')", output: "b'..ab..'" },
    },
    {
      name: 'Width counts bytes, not characters',
      desc: 'Centring encoded text to a character width goes wrong as soon as a multi-byte character appears, because the buffer is longer than the text looks.',
      wrong: { label: 'Off by bytes', code: "'é'.encode().center(5, b'*')", output: "b'**\\xc3\\xa9*'  # 2 bytes, not 1 char" },
      fix:   { label: 'Centre text',  code: "'é'.center(5, '*').encode()", output: 'centred by character' },
    },
  ],

  when: {
    use: [
      'Fixed-width ASCII report and banner output',
      'Aligning a label inside a byte-based line',
    ],
    avoid: [
      'Text with non-ASCII characters → decode, centre, encode',
      'You need a predictable odd-padding side → pad manually',
      'A non-ASCII fill character — it must be one byte',
    ],
  },

  notes: {
    complexity: 'O(width) — one allocation and fill',
    return:     'A new bytes object; the original when already wide enough',
    cpython:    'Objects/bytesobject.c :: stringlib_center',
    memory:     'Allocates a buffer of max(len, width)',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.ljust', slug: 'bytes-ljust', when: 'Pad on the right only' },
    { name: 'bytes.rjust', slug: 'bytes-rjust', when: 'Pad on the left only' },
    { name: 'str.center',  slug: 'str-center',  when: 'The str version, counting characters' },
    { name: 'bytes.zfill', slug: 'bytes-zfill', when: 'Sign-aware zero padding' },
  ],

  faq: [
    {
      q: 'Why did the extra padding byte go left in one case and right in another?',
      a: 'CPython computes the left padding as half the total plus an adjustment based on the parity of both the width and the data length. When the two parities differ, the extra byte goes left; when they match, it goes right. It is deliberate but not obvious, and str.center follows the same rule.',
      code: "b'ab'.center(7, b'*')   # b'***ab**'\nb'abc'.center(6, b'*')  # b'*abc**'",
    },
    {
      q: 'Why is a non-ASCII fill rejected?',
      a: 'Because the fill must be exactly one byte, and any character above ASCII encodes to two or more bytes in UTF-8. Use an ASCII fill, or centre the decoded string instead.',
    },
    {
      q: 'Does bytearray have center?',
      a: 'Yes, with identical behaviour including the parity rule, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.center arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.center',
    meta:  'bytes.center',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
