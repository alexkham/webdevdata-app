// content/reference/python/stdlib/base64/encodebytes-decodebytes.js
// encodebytes / decodebytes

export const meta = {
  slug:        'encodebytes-decodebytes',
  name:        'base64.encodebytes / decodebytes',
  signature:   'base64.encodebytes(s)',
  blurb:       'MIME-style Base64: lines of at most 76 characters, each ending in a newline — and the matching decoder.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'encodebytes decodebytes base64.encodebytes base64.decodebytes base64 newline every 76 characters mime rfc 2045 pem email line length encodestring decodestring expected bytes-like object not str',
};

export const method = {
  slug:      'encodebytes-decodebytes',
  name:      'base64.encodebytes / decodebytes',
  signature: 'base64.encodebytes(s)',
  returns:   { type: 'bytes', desc: 'Encode: Base64 in lines of 76 characters plus b"\\n", with a trailing newline. Decode: the original bytes.' },

  category:    'base64 function',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'The "legacy interface" for email and PEM-style data: encodebytes breaks the output every 57 input bytes (76 characters) and ends with a newline. Both functions accept only bytes — not str.',

  covers: ['encodebytes', 'decodebytes'],

  cheat: {
    commonCall: 'base64.encodebytes(data)',
    returns:    "bytes such as b'aGk=\\n'",
    replaces:   'encodestring / decodestring (removed in Python 3.9)',
    watchOut:   'Adds a trailing newline even for short input; rejects str',
  },

  parameters: [
    { name: 's', type: 'bytes-like', required: true, default: null, desc: 'Data to encode, or Base64 bytes to decode. A str raises TypeError in both directions.' },
  ],

  modes: [
    {
      id: 'lines',
      label: 'line wrapping',
      blurb: 'Encode text repeated n times and look at the lines encodebytes produces.',
      params: [
        { name: 'text', type: 'str', hint: 'any text', input: 'text' },
        { name: 'n',    type: 'int', hint: 'repeat count', input: 'number' },
      ],
      template: 'import base64\nbase64.encodebytes({$text}.encode() * {$n}).splitlines()',
      cases: [
        { id: 'short', label: 'short',       values: { text: 'hi', n: '1' } },
        { id: 'line',  label: '57 bytes',    values: { text: 'x', n: '57' } },
        { id: 'two',   label: '60 bytes',    values: { text: 'x', n: '60' } },
        { id: 'empty', label: 'empty',       values: { text: 'hi', n: '0' } },
      ],
    },
    {
      id: 'decode',
      label: 'decodebytes',
      blurb: 'decodebytes takes bytes (encoded here from your text) and skips newlines like b64decode does.',
      params: [{ name: 'data', type: 'str', hint: 'Base64 text', input: 'text' }],
      template: 'import base64\nbase64.decodebytes({$data}.encode())',
      cases: [
        { id: 'ok',    label: 'valid',           values: { data: 'aGVsbG8=' } },
        { id: 'nopad', label: 'missing padding', values: { data: 'aGVsbG8' } },
        { id: 'junk',  label: 'with junk',       values: { data: 'aGVs*bG8=' } },
      ],
    },
  ],
  demoExplainer: '57 input bytes are exactly one 76-character line; at 60 bytes a second, short line starts. The output always ends with a newline, which is why even "hi" gives one line, while empty input gives no line at all. decodebytes is the lenient decoder: like b64decode without validate, it drops characters such as * but still requires padding.',

  patterns: [
    {
      name: 'PEM block from DER bytes',
      desc: 'PEM uses 64-character lines, so build it with textwrap rather than encodebytes (76).',
      code: "import base64, textwrap\nbody = '\\n'.join(textwrap.wrap(base64.b64encode(der).decode('ascii'), 64))\npem = f'-----BEGIN CERTIFICATE-----\\n{body}\\n-----END CERTIFICATE-----\\n'",
    },
    {
      name: 'MIME attachment body',
      desc: 'encodebytes gives RFC 2045 line lengths.',
      code: "import base64\nwith open('report.pdf', 'rb') as f:\n    body = base64.encodebytes(f.read()).decode('ascii')",
    },
  ],

  examples: [
    { title: 'Trailing newline',        code: "import base64\nbase64.encodebytes(b'hi')",                         returns: "b'aGk=\\n'" },
    { title: '76 characters per line',  code: "import base64\n[len(line) for line in base64.encodebytes(bytes(120)).splitlines()]", returns: '[76, 76, 8]' },
    { title: 'Decode multi-line input', code: "import base64\nbase64.decodebytes(b'eHh4\\neHh4\\n')",              returns: "b'xxxxxx'" },
    { title: 'str is rejected',         code: "import base64\nbase64.decodebytes('aGk=')",                        returns: 'TypeError: expected bytes-like object, not str' },
    { title: 'Same bytes as b64decode', code: "import base64\nbase64.decodebytes(b'aGVsbG8=') == base64.b64decode('aGVsbG8=')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Newlines in a token',
      desc: 'encodebytes is for line-oriented formats. In headers, JSON or URLs, the newlines break things — use b64encode.',
      wrong: { label: 'encodebytes', code: "import base64\nbase64.encodebytes(b'user:pass').decode()", output: "'dXNlcjpwYXNz\\n'" },
      fix:   { label: 'b64encode',   code: "import base64\nbase64.b64encode(b'user:pass').decode()",   output: "'dXNlcjpwYXNz'" },
    },
    {
      name: 'Passing a str to decodebytes',
      desc: 'Unlike b64decode, decodebytes does not accept ASCII str.',
      wrong: { label: 'str',   code: "import base64\nbase64.decodebytes('aGk=')",          output: 'TypeError: expected bytes-like object, not str' },
      fix:   { label: 'bytes', code: "import base64\nbase64.decodebytes('aGk='.encode())", output: "b'hi'" },
    },
  ],

  when: {
    use: [
      'Email (MIME) bodies and other formats limited to 76-character lines',
      'Decoding line-wrapped Base64 you already have as bytes',
    ],
    avoid: [
      'Tokens, headers, JSON, URLs → b64encode (no newlines)',
      'PEM (64-character lines) → b64encode plus textwrap',
      'Strict validation → b64decode(s, validate=True)',
    ],
  },

  notes: {
    cpython:    'MAXBINSIZE = 57 bytes per line; each chunk goes through binascii.b2a_base64, which appends b"\\n". decodebytes is binascii.a2b_base64(s) after a bytes-like type check',
    'History':  'encodestring / decodestring were the old names; deprecated since 3.1 and removed in 3.9',
  },

  related: [
    { name: 'base64.b64encode', slug: 'b64encode',    when: 'One line, no newline' },
    { name: 'base64.b64decode', slug: 'b64decode',    when: 'Also accepts str; validate=True' },
    { name: 'encode / decode',  slug: 'encode-decode', when: 'Same format, streamed between file objects' },
    { name: 'base64 module',    slug: 'base64',       when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does my Base64 output have \\n in it?',
      a: 'You used encodebytes (or encode), which produces MIME lines of 76 characters with a newline after each — including the last. Use b64encode for a single line without newlines.',
    },
    {
      q: 'What replaced base64.encodestring?',
      a: 'encodebytes and decodebytes. The old names were deprecated in Python 3.1 and removed in 3.9.',
    },
    {
      q: 'What is the difference between decodebytes and b64decode?',
      a: 'They decode the same way (lenient, newlines skipped). decodebytes accepts only bytes-like input; b64decode also accepts ASCII str and offers altchars and validate.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.encodebytes',
    meta:  'base64.encodebytes',
  },

};
