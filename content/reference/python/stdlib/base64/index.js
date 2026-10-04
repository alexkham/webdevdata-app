// content/reference/python/stdlib/base64/index.js — the base64 module hub

export const meta = {
  slug:        'index',
  name:        'base64',
  signature:   'import base64',
  blurb:       'Turn bytes into ASCII text and back: Base64 (standard and URL-safe), Base32, Base16, Ascii85, Base85 and Z85.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'base64 module python base64 encode decode string b64encode b64decode urlsafe base32 base16 hex ascii85 base85 z85 binascii.Error incorrect padding bytes to text jwt data uri',
};

export const method = {
  slug: 'index',
  name: 'base64',

  category:    'Data formats',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Bytes in, ASCII bytes out — and back. Every encoder takes bytes and returns bytes, so text needs .encode() before and .decode() after. Bad input raises binascii.Error, a ValueError subclass.',

  imports: ['import base64', 'from base64 import b64encode, b64decode'],
  facts: [
    { label: 'Public API', value: 'b64encode/b64decode, standard_ and urlsafe_ variants, b32*, b32hex*, b16*, a85*, b85*, z85*, encodebytes/decodebytes, encode/decode' },
    { label: 'Specs',      value: 'RFC 4648 (Base64, Base32, Base16), RFC 2045 (MIME lines), Ascii85, Git-style Base85, ZeroMQ Z85' },
    { label: 'Errors',     value: 'binascii.Error (a ValueError) for bad Base64/32/16; plain ValueError for the 85 family' },
    { label: 'Speed',      value: 'Base64 and Base16 run in C (binascii); Base32 and the 85 codecs are pure Python' },
    { label: 'CLI',        value: 'python -m base64 file (encode) · python -m base64 -d file (decode)' },
  ],

  modes: [
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'The everyday recipe: str → bytes (encode) → Base64 bytes → and back to the original str.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "import base64\nencoded = base64.b64encode({$text}.encode())\n(encoded, base64.b64decode(encoded).decode())",
      cases: [
        { id: 'hello', label: 'hello world', values: { text: 'hello world' } },
        { id: 'utf8',  label: 'non-ASCII',   values: { text: 'Zoë 🙂' } },
        { id: 'one',   label: 'one char',    values: { text: 'a' } },
        { id: 'empty', label: 'empty',       values: { text: '' } },
      ],
    },
    {
      id: 'compare',
      label: 'all encodings',
      blurb: 'The same bytes in every alphabet the module offers: hex, Base32, Base64, URL-safe Base64, Base85, Ascii85.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "import base64\ndata = {$text}.encode()\n[base64.b16encode(data), base64.b32encode(data), base64.b64encode(data),\n base64.urlsafe_b64encode(data), base64.b85encode(data), base64.a85encode(data)]",
      cases: [
        { id: 'hi',    label: 'hi',          values: { text: 'hi' } },
        { id: 'url',   label: '+ and /',     values: { text: '???>>>' } },
        { id: 'words', label: 'hello world', values: { text: 'hello world' } },
      ],
    },
  ],
  demoExplainer: 'Base64 writes every 3 input bytes as 4 characters and pads the last group with = — so "a" (1 byte) becomes YQ== and the output is always a multiple of 4 long. Base32 uses 8 characters per 5 bytes, hex 2 per byte, the 85 codecs 5 per 4 bytes (the most compact). "???>>>" shows the only difference between standard and URL-safe Base64: + and / become - and _.',

  patterns: [
    {
      name: 'Encode a string to Base64 text',
      desc: 'Encode the text to bytes, Base64 it, decode the ASCII result back to str.',
      code: "import base64\ntoken = base64.b64encode(text.encode('utf-8')).decode('ascii')",
    },
    {
      name: 'Decode Base64 text back to a string',
      desc: 'b64decode accepts str; the result is bytes — decode with the charset the sender used.',
      code: "import base64\ntext = base64.b64decode(token).decode('utf-8')",
    },
    {
      name: 'Embed a file as a data: URI',
      desc: 'Read the file in binary mode; the Base64 text goes after the comma.',
      code: "import base64\nwith open('logo.png', 'rb') as f:\n    uri = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('ascii')",
    },
    {
      name: 'Basic auth header',
      desc: 'HTTP Basic credentials are Base64 of "user:password" — encoding, not encryption.',
      code: "import base64\ncreds = base64.b64encode(f'{user}:{password}'.encode()).decode()\nheaders = {'Authorization': f'Basic {creds}'}",
    },
    {
      name: 'Encode or decode from the shell',
      desc: 'The module runs as a script; output uses 76-character MIME lines.',
      code: '# shell:\n# python -m base64 photo.jpg > photo.b64\n# python -m base64 -d photo.b64 > photo.jpg',
    },
  ],

  examples: [
    { title: 'str → Base64 str',        code: "import base64\nbase64.b64encode('hello world'.encode()).decode('ascii')", returns: "'aGVsbG8gd29ybGQ='" },
    { title: 'Base64 str → str',        code: "import base64\nbase64.b64decode('aGVsbG8gd29ybGQ=').decode()",            returns: "'hello world'" },
    { title: 'Output is bytes',         code: "import base64\nbase64.b64encode(b'hi')",                                  returns: "b'aGk='" },
    { title: 'Encoders refuse str',     code: "import base64\nbase64.b64encode('hi')",                                   returns: "TypeError: a bytes-like object is required, not 'str'" },
    { title: 'Missing padding',         code: "import base64\nbase64.b64decode('aGVsbG8')",                              returns: 'binascii.Error: Incorrect padding' },
    { title: 'URL-safe alphabet',       code: "import base64\nbase64.urlsafe_b64encode(b'\\xfb\\xff\\xbf')",              returns: "b'-_-_'" },
    { title: 'Same bytes, other bases', code: "import base64\n[base64.b16encode(b'hi'), base64.b32encode(b'hi'), base64.b85encode(b'hi')]", returns: "[b'6869', b'NBUQ====', b'XlV']" },
  ],

  pitfalls: [
    {
      name: 'Showing the bytes repr instead of the text',
      desc: 'str() of bytes gives the repr, b\'...\' included — which ends up in JSON, headers and HTML. Decode the ASCII bytes instead.',
      wrong: { label: 'str(bytes)',      code: "import base64\nf'token={base64.b64encode(b\"hi\")}'",          output: "\"token=b'aGk='\"" },
      fix:   { label: ".decode('ascii')", code: "import base64\nf'token={base64.b64encode(b\"hi\").decode(\"ascii\")}'", output: "'token=aGk='" },
    },
    {
      name: 'Thinking Base64 is encryption',
      desc: 'Anyone can decode it — there is no key. Use it to carry bytes through text channels, never to hide secrets.',
      wrong: { label: '"hidden" password', code: "import base64\nbase64.b64decode('c2VjcmV0')",  output: "b'secret'" },
      fix:   { label: 'hash passwords instead', code: "import hashlib\nhashlib.sha256(b'secret').hexdigest()[:16]", output: "'2bb80d537b1da3e3'" },
    },
  ],

  when: {
    use: [
      'Putting binary data (images, keys, hashes) into JSON, XML, URLs, email or HTTP headers',
      'data: URIs, HTTP Basic auth, JWT segments (URL-safe, unpadded)',
      'Case-insensitive or human-typed codes → Base32',
    ],
    avoid: [
      'Hiding or protecting data — Base64 is reversible by anyone → hashlib / secrets / a crypto library',
      'Hex dumps of bytes → bytes.hex() and bytes.fromhex() are simpler',
      'Storing binary data where bytes are allowed — Base64 adds a third to the size',
    ],
  },

  notes: {
    cpython:   'Lib/base64.py — Base64 and Base16 are thin wrappers over the C functions binascii.b2a_base64 / a2b_base64 / hexlify; Base32 and Base85 are implemented in Python',
    'Size':    'Base64 output is 4 × ceil(n / 3) characters: one third bigger than the input, plus padding',
    'Errors':  'binascii.Error subclasses ValueError, so except ValueError catches every decoding failure in the module',
  },

  related: [
    { name: 'str.encode()',       slug: 'str-encode',         when: 'Text → bytes before encoding',                  category: 'functions' },
    { name: 'bytes.decode()',     slug: 'bytes-decode',       when: 'Bytes → text after decoding',                    category: 'functions' },
    { name: 'bytes.hex()',        slug: 'bytes-hex',          when: 'Lowercase hex without importing base64',         category: 'functions' },
    { name: 'json module',        slug: 'json',               when: 'Base64 is how bytes travel inside JSON',          category: 'stdlib' },
    { name: 'ValueError',         slug: 'valueerror',         when: 'Base class of binascii.Error',                    category: 'exceptions' },
    { name: 'UnicodeDecodeError', slug: 'unicodedecodeerror', when: 'Decoded bytes that are not UTF-8 text',           category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I Base64-encode a string in Python?',
      a: "base64.b64encode(text.encode('utf-8')).decode('ascii'). b64encode only accepts bytes, so the string is encoded first; it returns bytes, so the result is decoded to get a str.",
    },
    {
      q: 'Why does b64encode return bytes and not a string?',
      a: 'The module works on binary data end to end: its output is meant to be written to files, sockets and byte buffers. The output is pure ASCII, so .decode("ascii") always succeeds when you need a str.',
    },
    {
      q: 'What does "binascii.Error: Incorrect padding" mean?',
      a: 'The Base64 data is not a whole number of 4-character groups — usually because the trailing = signs were stripped (JWTs and many URLs do this) or the string was cut off. Add them back with s + "=" * (-len(s) % 4).',
    },
    {
      q: 'What is the difference between b64encode and urlsafe_b64encode?',
      a: 'Only two characters: URL-safe Base64 uses - and _ where standard Base64 uses + and /, so the result can go into URLs and file names without escaping. Both keep the = padding.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html',
    meta:  'base64 — Base16, Base32, Base64, Base85 Data Encodings',
  },

};
