// content/reference/python/functions/bytes-zfill.js

export const meta = {
  slug:        'bytes-zfill',
  name:        'bytes.zfill',
  signature:   'bytes.zfill(width)',
  blurb:       'Left-pad with ASCII zeros to a width — keeping a leading sign in front.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes zfill zero fill pad leading zeros width sign numeric fixed width binary bytearray bytearray.zfill',
};

export const method = {
  slug:      'bytes-zfill',
  name:      'bytes.zfill',
  signature: 'bytes.zfill(width)',
  returns:   { type: 'bytes', desc: 'A new bytes object left-padded with 0x30 bytes to at least width. A leading + or - stays at the front, ahead of the zeros. Never truncates.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Zero-padding that knows about signs. The sign-aware rule is what separates it from rjust with a zero fill — and also what makes it do odd things to non-numeric data.',

  cheat: {
    commonCall: 'data.zfill(8)',
    returns:    'a new bytes object at least width long',
    replaces:   "data.rjust(width, b'0'), which would put zeros BEFORE a minus sign",
    watchOut:   'it pads any bytes, not just digits — b"ab".zfill(4) is b"00ab"',
  },

  parameters: [
    { name: 'width', type: 'int', required: true, default: null, desc: 'Minimum total length. If the data is already this long or longer it is returned unchanged.' },
  ],

  demoParams: [
    { name: 's',     type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'width', type: 'int', hint: 'minimum width',           input: 'number' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').zfill({width})",
  cases: [
    { id: 'plain',   label: 'digits',         values: { s: '42',  width: 5 } },
    { id: 'neg',     label: 'negative sign',  values: { s: '-42', width: 5 } },
    { id: 'plus',    label: 'plus sign',      values: { s: '+42', width: 5 } },
    { id: 'wide',    label: 'already wide',   values: { s: '123456', width: 3 } },
    { id: 'nonnum',  label: 'non-numeric (!)',values: { s: 'ab',  width: 4 } },
  ],
  demoExplainer: 'Zeros are inserted on the left until the buffer reaches the width. The sign cases show the rule that matters: a leading minus or plus stays in FRONT, with the zeros after it, so -42 becomes -0042 rather than 00-42. Data already at or beyond the width is returned untouched — it never truncates. And it pads anything at all, not just digits, which is how ab becomes 00ab.',

  patterns: [
    {
      name: 'Fixed-width numeric field',
      desc: 'Legacy formats often want zero-padded numbers as bytes.',
      code: "field = str(n).encode().zfill(8)",
    },
    {
      name: 'Prefer format for new code',
      desc: 'Formatting the int directly is clearer and handles the sign the same way.',
      code: "field = f'{n:08d}'.encode()",
    },
    {
      name: 'Pad a hex digest to a fixed width',
      desc: 'Leading zeros are significant in hex and easy to lose.',
      code: 'digest_hex = value.hex().encode().zfill(64)',
    },
  ],

  examples: [
    { title: 'Digits',        code: "b'42'.zfill(5)",     returns: "b'00042'" },
    { title: 'Negative',      code: "b'-42'.zfill(5)",    returns: "b'-0042'" },
    { title: 'Plus',          code: "b'+42'.zfill(5)",    returns: "b'+0042'" },
    { title: 'Already wide',  code: "b'123456'.zfill(3)", returns: "b'123456'" },
    { title: 'Non-numeric',   code: "b'ab'.zfill(4)",     returns: "b'00ab'" },
    { title: 'rjust differs', code: "b'-42'.rjust(5, b'0')", returns: "b'00-42'  # sign buried" },
  ],

  pitfalls: [
    {
      name: 'It pads non-numeric data too',
      desc: 'zfill does not check that the bytes are digits. Applied to arbitrary data it happily prepends zeros, producing nonsense that looks like a number.',
      wrong: { label: 'Looks numeric', code: "b'ab'.zfill(4)", output: "b'00ab'" },
      fix:   { label: 'Validate first', code: "if data.lstrip(b'+-').isdigit():\n    data = data.zfill(4)", output: 'only real numbers' },
    },
    {
      name: 'rjust with a zero fill is not the same',
      desc: 'rjust puts the fill before everything, including a sign. zfill keeps the sign in front. For negative numbers the two produce different results.',
      wrong: { label: 'Sign buried', code: "b'-42'.rjust(5, b'0')", output: "b'00-42'" },
      fix:   { label: 'zfill keeps it', code: "b'-42'.zfill(5)", output: "b'-0042'" },
    },
    {
      name: 'Only a single leading sign is recognised',
      desc: 'A sign anywhere but the very first byte is just another byte, and gets zeros in front of it like anything else.',
      wrong: { label: 'Not a sign', code: "b'4-2'.zfill(5)", output: "b'004-2'" },
      fix:   { label: 'Sign must lead', code: "b'-42'.zfill(5)", output: "b'-0042'" },
    },
  ],

  when: {
    use: [
      'Fixed-width numeric fields in legacy binary or text formats',
      'Zero-padding hex where leading zeros are significant',
      'Data that is already bytes and already numeric',
    ],
    avoid: [
      'Formatting a number you hold as an int → an f-string with :0Nd',
      'Arbitrary data — it will pad anything',
      'Padding with a byte other than zero → rjust',
    ],
  },

  notes: {
    complexity: 'O(width) — builds the padded result in one allocation',
    return:     'A new bytes object; the original is returned when already wide enough',
    cpython:    'Objects/bytesobject.c :: stringlib_zfill',
    memory:     'Allocates a buffer of max(len, width)',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.rjust', slug: 'bytes-rjust', when: 'Pad with any byte, sign-unaware' },
    { name: 'zfill',       slug: 'zfill',       when: 'The str version of this method' },
    { name: 'format',      slug: 'format',      when: 'Zero-pad a number you still hold as an int' },
    { name: 'bytes.ljust', slug: 'bytes-ljust', when: 'Pad on the right instead' },
  ],

  faq: [
    {
      q: 'Why does the sign stay at the front?',
      a: 'Because zfill is designed for numbers, and -0042 is a valid zero-padded number while 00-42 is not. It checks the first byte for + or - and inserts the zeros after it.',
      code: "b'-42'.zfill(5)\n# b'-0042'",
    },
    {
      q: 'Should I use zfill or an f-string?',
      a: 'If you still have the number as an int, format it directly — the :0Nd specifier handles the sign identically and reads better. zfill is for data that is already bytes.',
      code: "f'{-42:05d}'.encode()\n# b'-0042'",
    },
    {
      q: 'Does bytearray have zfill?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.zfill arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.zfill',
    meta:  'bytes.zfill',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
