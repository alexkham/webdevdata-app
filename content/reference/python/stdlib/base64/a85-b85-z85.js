// content/reference/python/stdlib/base64/a85-b85-z85.js
// a85encode / a85decode / b85encode / b85decode / z85encode / z85decode

export const meta = {
  slug:        'a85-b85-z85',
  name:        'base64.a85encode / b85encode / z85encode',
  signature:   'base64.a85encode(b, *, foldspaces=False, wrapcol=0, pad=False, adobe=False)',
  blurb:       'The Base85 family — Ascii85 (PDF, PostScript), Base85 (Git binary patches) and Z85 (ZeroMQ): 5 characters per 4 bytes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+ (z85: 3.13+)',
  searchTerms: 'a85encode a85decode b85encode b85decode z85encode z85decode base64.a85encode base64.a85decode base64.b85encode base64.b85decode base64.z85encode base64.z85decode ascii85 base85 z85 zeromq adobe pdf postscript btoa git foldspaces wrapcol pad non-ascii85 digit found bad base85 character',
};

export const method = {
  slug:      'a85-b85-z85',
  name:      'base64.a85encode / b85encode / z85encode',
  signature: 'base64.a85encode(b, *, foldspaces=False, wrapcol=0, pad=False, adobe=False)',
  returns:   { type: 'bytes', desc: 'Encode: ASCII bytes, 5 characters per 4 input bytes (fewer for a short last group unless pad=True). Decode: the original bytes.' },

  category:    'base64 function',
  version:     'Python 3.4+ (z85: 3.13+)',
  hasLiveDemo: true,

  subtitle: 'Three 85-character alphabets for the same idea: a 32-bit word becomes 5 base-85 digits, so the output is only 25% larger than the input. They are not interchangeable — decode with the function that encoded.',

  covers: ['a85encode', 'a85decode', 'b85encode', 'b85decode', 'z85encode', 'z85decode'],

  cheat: {
    commonCall: 'base64.b85encode(data)  ·  base64.a85decode(text, adobe=True)',
    returns:    "bytes — b'Xk~0{Zy<MXa%^M' for b'hello world'",
    replaces:   'Base64 when every byte of overhead counts',
    watchOut:   'Errors are plain ValueError here, not binascii.Error',
  },

  parameters: [
    { name: 'b',          type: 'bytes-like (encode) · bytes-like | ASCII str (decode)', required: true, default: null, desc: 'Data to encode, or text to decode.' },
    { name: 'foldspaces', type: 'bool', required: false, default: 'False', desc: 'Ascii85 only: write 4 spaces as "y" (a btoa extension, not Adobe).' },
    { name: 'wrapcol',    type: 'int',  required: false, default: '0',     desc: 'a85encode only: insert a newline every wrapcol characters; 0 means one line.' },
    { name: 'pad',        type: 'bool', required: false, default: 'False', desc: 'a85encode / b85encode: pad the input with zero bytes to a multiple of 4 first (so the decoded result keeps the zeros).' },
    { name: 'adobe',      type: 'bool', required: false, default: 'False', desc: 'Ascii85 only: frame the output with <~ and ~> (encode) or expect that framing (decode).' },
    { name: 'ignorechars', type: 'bytes', required: false, default: "b' \\t\\n\\r\\x0b'", desc: 'a85decode only: characters to skip — ASCII whitespace by default.' },
  ],

  modes: [
    {
      id: 'encode',
      label: 'encode',
      blurb: 'The same bytes in Ascii85, Base85 and Z85.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import base64\ndata = {$text}.encode()\n[base64.a85encode(data), base64.b85encode(data), base64.z85encode(data)]',
      cases: [
        { id: 'hello', label: 'hello world', values: { text: 'hello world' } },
        { id: 'four',  label: '4 bytes',     values: { text: 'abcd' } },
        { id: 'utf8',  label: 'non-ASCII',   values: { text: 'Zoë 🙂' } },
      ],
    },
    {
      id: 'ascii85',
      label: 'Ascii85 options',
      blurb: 'a85encode with Adobe framing and line wrapping, and the z / y shortcuts for zeros and spaces.',
      params: [
        { name: 'text',    type: 'str', hint: 'any text', input: 'text' },
        { name: 'wrapcol', type: 'int', hint: 'line width, 0 = none', input: 'number' },
      ],
      template: 'import base64\ndata = {$text}.encode()\n[base64.a85encode(data, adobe=True, wrapcol={$wrapcol}), base64.a85encode(bytes(4) + b"    " + data, foldspaces=True)]',
      cases: [
        { id: 'plain', label: 'one line',  values: { text: 'hello world', wrapcol: '0' } },
        { id: 'wrap',  label: 'wrapped',   values: { text: 'hello world', wrapcol: '8' } },
      ],
    },
    {
      id: 'decode',
      label: 'decode',
      blurb: 'Feed one string to all three decoders. Each alphabet accepts different characters.',
      params: [{ name: 'data', type: 'str', hint: 'encoded text', input: 'text' }],
      template: "import base64\ndef attempt(decode):\n    try:\n        return decode({$data})\n    except ValueError as e:\n        return f'ValueError: {e}'\n[attempt(base64.a85decode), attempt(base64.b85decode), attempt(base64.z85decode)]",
      cases: [
        { id: 'a85',  label: 'Ascii85 text', values: { data: 'BOu!rD]j7BEbo7' } },
        { id: 'b85',  label: 'Base85 text',  values: { data: 'Xk~0{Zy<MXa%^M' } },
        { id: 'z85',  label: 'Z85 text',     values: { data: 'xK#0@zY<mxA+]m' } },
        { id: 'zmq',  label: 'HelloWorld',   values: { data: 'HelloWorld' } },
      ],
    },
  ],
  demoExplainer: 'All three use 5 characters per 4 bytes; a short last group is written with fewer characters (2 bytes → 3), so "hello world" (11 bytes) becomes 14 characters. Ascii85 shortens an all-zero group to z (and four spaces to y with foldspaces=True). The alphabets overlap, so the wrong decoder may succeed with garbage instead of failing — "HelloWorld" is the Z85 spec test vector, but all three accept it.',

  patterns: [
    {
      name: 'Git-style binary patch data',
      desc: 'b85encode uses the alphabet of git binary diffs and Mercurial.',
      code: 'import base64\nencoded = base64.b85encode(blob)',
    },
    {
      name: 'Adobe Ascii85 (PDF / PostScript streams)',
      desc: 'adobe=True adds and expects the <~ ~> markers.',
      code: 'import base64\nstream = base64.a85encode(data, adobe=True, wrapcol=75)\noriginal = base64.a85decode(stream, adobe=True)',
    },
    {
      name: 'ZeroMQ CURVE keys (Python 3.13+)',
      desc: 'Z85 is the text form of 32-byte ZeroMQ keys (40 characters).',
      code: 'import base64\nkey_text = base64.z85encode(public_key)  # 32 bytes → 40 characters',
    },
  ],

  examples: [
    { title: 'Ascii85',                  code: "import base64\nbase64.a85encode(b'hello world')",                returns: "b'BOu!rD]j7BEbo7'" },
    { title: 'Adobe framing',            code: "import base64\nbase64.a85encode(b'hello world', adobe=True)",     returns: "b'<~BOu!rD]j7BEbo7~>'" },
    { title: 'Zeros fold to z',          code: "import base64\nbase64.a85encode(bytes(8))",                       returns: "b'zz'" },
    { title: 'Base85',                   code: "import base64\nbase64.b85encode(b'hello world')",                returns: "b'Xk~0{Zy<MXa%^M'" },
    { title: 'Z85 spec test vector',     code: "import base64\nbase64.z85encode(bytes([0x86, 0x4F, 0xD2, 0x6F, 0xB5, 0x59, 0xF7, 0x5B]))", returns: "b'HelloWorld'" },
    { title: 'Round trip',               code: "import base64\nbase64.z85decode(base64.z85encode(b'hello world'))", returns: "b'hello world'" },
    { title: 'pad=True keeps the zeros', code: "import base64\nbase64.b85decode(base64.b85encode(b'hi', pad=True))", returns: "b'hi\\x00\\x00'" },
    { title: 'Bad character',            code: "import base64\nbase64.b85decode('Xk~0{Zy<MXa%^\"')",             returns: 'ValueError: bad base85 character at position 13' },
  ],

  pitfalls: [
    {
      name: 'Adobe framing without adobe=True',
      desc: 'The <~ and ~> markers are not Ascii85 digits; the default decoder chokes on them.',
      wrong: { label: 'default',    code: "import base64\nbase64.a85decode('<~BOu!rD]j7BEbo7~>')",             output: 'ValueError: Non-Ascii85 digit found: ~' },
      fix:   { label: 'adobe=True', code: "import base64\nbase64.a85decode('<~BOu!rD]j7BEbo7~>', adobe=True)", output: "b'hello world'" },
    },
    {
      name: 'Catching binascii.Error',
      desc: 'Unlike the Base64/32/16 decoders, the 85 family raises plain ValueError — catch ValueError to cover both.',
      wrong: { label: 'except binascii.Error', code: "import base64, binascii\ntry:\n    base64.b85decode('ab,c')\nexcept binascii.Error:\n    print('bad input')", output: 'ValueError: bad base85 character at position 2' },
      fix:   { label: 'except ValueError',     code: "import base64\ntry:\n    base64.b85decode('ab,c')\nexcept ValueError:\n    print('bad input')", output: 'bad input' },
    },
    {
      name: 'Decoding with the wrong alphabet',
      desc: 'Base85 and Z85 text often decode without error in the other decoder — to different bytes.',
      wrong: { label: 'b85decode(z85 text)', code: "import base64\nbase64.b85decode(base64.z85encode(b'hi'))", output: "b'\\xb8]'" },
      fix:   { label: 'z85decode',           code: "import base64\nbase64.z85decode(base64.z85encode(b'hi'))", output: "b'hi'" },
    },
  ],

  when: {
    use: [
      'PDF / PostScript streams (Ascii85, adobe=True)',
      'Git binary patches, Mercurial (Base85)',
      'ZeroMQ keys and messages (Z85, Python 3.13+)',
    ],
    avoid: [
      'JSON, URLs, HTML or shell strings — all three alphabets contain < > &, and Ascii85 also quotes and backslash → Base64',
      'Interoperating with anything that just says "Base64" → b64encode',
    ],
  },

  notes: {
    cpython:      'Pure Python in Lib/base64.py: one shared _85encode helper with a different alphabet per codec; z85 translates to and from the base85 alphabet',
    'Versions':   'a85* and b85* since Python 3.4; z85encode / z85decode since 3.13',
    'Exceptions': 'ValueError: "Non-Ascii85 digit found: …", "Ascii85 overflow", "z inside Ascii85 5-tuple", "bad base85 character at position N", "base85 overflow in hunk starting at byte N" (z85 instead of base85 for Z85)',
  },

  related: [
    { name: 'base64.b64encode', slug: 'b64encode', when: 'The universally understood choice' },
    { name: 'base64.b64decode', slug: 'b64decode', when: 'Its decoder raises binascii.Error instead' },
    { name: 'ValueError',       slug: 'valueerror', when: 'What every 85-family decoder raises', category: 'exceptions' },
    { name: 'base64 module',    slug: 'base64',    when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between Ascii85, Base85 and Z85?',
      a: 'Same arithmetic, different 85-character alphabets. Ascii85 uses ! to u (and z/y shortcuts); Base85 is the Git/Mercurial alphabet; Z85 is ZeroMQ\'s, chosen to be safe in source code strings. Their output is not interchangeable.',
    },
    {
      q: 'Why is Base85 smaller than Base64?',
      a: '85 symbols carry more information per character: 4 bytes fit in 5 characters (25% overhead) versus 3 bytes in 4 for Base64 (about 33%).',
    },
    {
      q: 'Does base64.z85encode follow the Z85 spec length rule?',
      a: 'The spec requires a multiple of 4 bytes. Python does not enforce it: shorter final groups are encoded with fewer characters, like b85encode. Pad the data yourself if the other side follows the spec strictly.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.a85encode',
    meta:  'base64.a85encode',
  },

};
