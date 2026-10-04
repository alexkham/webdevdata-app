// content/reference/python/stdlib/base64/b64encode.js

export const meta = {
  slug:        'b64encode',
  name:        'base64.b64encode',
  signature:   'base64.b64encode(s, altchars=None)',
  blurb:       'Encode bytes as Base64 and return the result as ASCII bytes (no newlines, = padding included).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'b64encode base64.b64encode base64 encode string python base64 encode bytes str to base64 altchars padding a bytes-like object is required not str encode image base64',
};

export const method = {
  slug:      'b64encode',
  name:      'base64.b64encode',
  signature: 'base64.b64encode(s, altchars=None)',
  returns:   { type: 'bytes', desc: 'The Base64 text as ASCII bytes, padded with = to a multiple of 4 characters, without a trailing newline.' },

  category:    'base64 function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'The workhorse encoder. It takes bytes, not str, and gives back bytes, not str — so "Base64-encode a string" is always encode() → b64encode() → decode().',

  covers: ['b64encode'],

  cheat: {
    commonCall: "base64.b64encode(text.encode()).decode('ascii')",
    returns:    "bytes such as b'aGk=' — decode('ascii') for a str",
    replaces:   'Hand-written bit shifting; codecs.encode(data, "base64") (which adds newlines)',
    watchOut:   'Passing a str raises TypeError; the result is bytes',
  },

  parameters: [
    { name: 's',        type: 'bytes-like', required: true,  default: null,   desc: 'The data to encode: bytes, bytearray or memoryview. A str raises TypeError — encode it first.' },
    { name: 'altchars', type: 'bytes',      required: false, default: 'None', desc: "Exactly 2 bytes that replace + and / in the output, e.g. b'-_'. Any other length fails an assert (AssertionError)." },
  ],

  modes: [
    {
      id: 'string',
      label: 'string → Base64',
      blurb: 'The full recipe for text: UTF-8 bytes in, ASCII str out.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "import base64\nbase64.b64encode({$text}.encode()).decode('ascii')",
      cases: [
        { id: 'hello', label: 'hello world', values: { text: 'hello world' } },
        { id: 'utf8',  label: 'non-ASCII',   values: { text: 'Zoë 🙂' } },
        { id: 'json',  label: 'JSON',        values: { text: '{"user": "ada", "admin": true}' } },
        { id: 'empty', label: 'empty',       values: { text: '' } },
      ],
    },
    {
      id: 'padding',
      label: 'padding',
      blurb: 'Every 3 bytes become 4 characters; a final group of 1 or 2 bytes is padded with = signs.',
      params: [{ name: 'text', type: 'str', hint: 'short text', input: 'text' }],
      template: "import base64\ndata = {$text}.encode()\n(len(data), base64.b64encode(data))",
      cases: [
        { id: 'one',   label: '1 byte',  values: { text: 'a' } },
        { id: 'two',   label: '2 bytes', values: { text: 'ab' } },
        { id: 'three', label: '3 bytes', values: { text: 'abc' } },
        { id: 'four',  label: '4 bytes', values: { text: 'abcd' } },
      ],
    },
    {
      id: 'altchars',
      label: 'altchars',
      blurb: 'Swap + and / for two other characters. The bytes here encode to "+/+/" in the standard alphabet.',
      params: [{ name: 'alt', type: 'str', hint: 'two characters', input: 'text' }],
      template: "import base64\nbase64.b64encode(b'\\xfb\\xff\\xbf', altchars={$alt}.encode())",
      cases: [
        { id: 'url',  label: "'-_'",      values: { alt: '-_' } },
        { id: 'dot',  label: "'.*'",      values: { alt: '.*' } },
        { id: 'one',  label: 'one char',  values: { alt: '-' } },
      ],
    },
  ],
  demoExplainer: 'The output length is always 4 × ceil(n / 3): "a" becomes YQ== and "abc" becomes YWJj with no padding at all. Non-ASCII text is encoded as UTF-8 first, so "Zoë 🙂" (5 characters) is 9 bytes and 12 Base64 characters. altchars must be exactly 2 bytes — a single character fails an assert, so the error line is just AssertionError: b\'-\'.',

  patterns: [
    {
      name: 'Text to Base64 text',
      desc: 'The one-liner most code needs.',
      code: "import base64\nencoded = base64.b64encode(text.encode('utf-8')).decode('ascii')",
    },
    {
      name: 'A file to Base64',
      desc: "Open in binary mode ('rb') — the bytes go straight in.",
      code: "import base64\nwith open('photo.jpg', 'rb') as f:\n    encoded = base64.b64encode(f.read()).decode('ascii')",
    },
    {
      name: 'Base64 inside JSON',
      desc: 'json cannot hold bytes; the decoded Base64 str can.',
      code: "import base64, json\npayload = json.dumps({'file': base64.b64encode(data).decode('ascii')})",
    },
  ],

  examples: [
    { title: 'Bytes in, bytes out',          code: "import base64\nbase64.b64encode(b'hello')",                         returns: "b'aGVsbG8='" },
    { title: 'Get a str',                    code: "import base64\nbase64.b64encode(b'hello').decode('ascii')",          returns: "'aGVsbG8='" },
    { title: 'UTF-8 text',                   code: "import base64\nbase64.b64encode('Zoë'.encode('utf-8'))",              returns: "b'Wm/Dqw=='" },
    { title: 'Padding by length',            code: "import base64\n[base64.b64encode(b'a'), base64.b64encode(b'ab'), base64.b64encode(b'abc')]", returns: "[b'YQ==', b'YWI=', b'YWJj']" },
    { title: 'No line breaks, ever',         code: "import base64\nb'\\n' in base64.b64encode(bytes(1000))",            returns: 'False' },
    { title: 'Size grows by a third',        code: "import base64\nlen(base64.b64encode(bytes(300)))",                   returns: '400' },
    { title: 'altchars',                     code: "import base64\nbase64.b64encode(b'\\xfb\\xff', altchars=b'-_')",      returns: "b'-_8='" },
    { title: 'str is rejected',              code: "import base64\nbase64.b64encode('hello')",                           returns: "TypeError: a bytes-like object is required, not 'str'" },
  ],

  pitfalls: [
    {
      name: 'Passing a str',
      desc: 'Base64 encodes bytes. Choose the text encoding yourself (almost always UTF-8) with .encode().',
      wrong: { label: 'b64encode(str)',        code: "import base64\nbase64.b64encode('héllo')",              output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'b64encode(str.encode())', code: "import base64\nbase64.b64encode('héllo'.encode())",   output: "b'aMOpbGxv'" },
    },
    {
      name: 'Using str() on the result',
      desc: "str(b'...') is the repr with the b prefix and quotes. Decode the ASCII bytes instead.",
      wrong: { label: 'str()',          code: "import base64\nstr(base64.b64encode(b'hi'))",            output: "\"b'aGk='\"" },
      fix:   { label: ".decode('ascii')", code: "import base64\nbase64.b64encode(b'hi').decode('ascii')", output: "'aGk='" },
    },
    {
      name: 'Encoding twice',
      desc: 'Calling b64encode on something that is already Base64 encodes the Base64 text again — the result decodes to Base64, not to your data.',
      wrong: { label: 'double encode', code: "import base64\nbase64.b64encode(base64.b64encode(b'hi'))", output: "b'YUdrPQ=='" },
      fix:   { label: 'encode once',   code: "import base64\nbase64.b64encode(b'hi')",                  output: "b'aGk='" },
    },
  ],

  when: {
    use: [
      'Sending binary data through JSON, XML, HTTP headers, data: URIs or email bodies',
      'Any API that asks for "Base64" with + and /',
    ],
    avoid: [
      'URLs, file names, JWTs → urlsafe_b64encode',
      'MIME / PEM with 76-character lines → encodebytes',
      'Hiding secrets — Base64 is not encryption',
    ],
  },

  notes: {
    cpython:    'binascii.b2a_base64(s, newline=False) in C, then bytes.translate() when altchars is given',
    'Length':   'Output is 4 × ceil(len(s) / 3) bytes',
    'Exceptions': 'TypeError for str or other non-bytes input; AssertionError when altchars is not 2 bytes long (and the check disappears under python -O)',
  },

  related: [
    { name: 'base64.b64decode',      slug: 'b64decode',   when: 'The reverse direction' },
    { name: 'urlsafe_b64encode',     slug: 'urlsafe-b64', when: 'The - and _ alphabet for URLs and JWTs' },
    { name: 'encodebytes',           slug: 'encodebytes-decodebytes', when: 'Same alphabet, 76-character MIME lines' },
    { name: 'str.encode()',          slug: 'str-encode',  when: 'Turn text into bytes first', category: 'functions' },
    { name: 'base64 module',         slug: 'base64',      when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert a string to Base64 in Python?',
      a: "base64.b64encode(s.encode('utf-8')).decode('ascii'). The encode step picks the byte representation of the text; the decode step turns the ASCII result into a str.",
    },
    {
      q: "Why do I get TypeError: a bytes-like object is required, not 'str'?",
      a: 'b64encode only accepts bytes-like objects. Call .encode() on the string first (UTF-8 by default).',
    },
    {
      q: 'How do I remove the b\'\' from the Base64 output?',
      a: "The b'...' is how Python displays bytes, not part of the data. Call .decode('ascii') on the result to get a plain str.",
    },
    {
      q: 'Can I Base64-encode without the = padding?',
      a: "Not with an argument — strip it: base64.b64encode(data).rstrip(b'='). Remember to add it back before decoding (s + '=' * (-len(s) % 4)), because b64decode requires it.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.b64encode',
    meta:  'base64.b64encode',
  },

};
