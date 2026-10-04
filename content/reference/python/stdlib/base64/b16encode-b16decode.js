// content/reference/python/stdlib/base64/b16encode-b16decode.js
// b16encode / b16decode

export const meta = {
  slug:        'b16encode-b16decode',
  name:        'base64.b16encode / b16decode',
  signature:   'base64.b16decode(s, casefold=False)',
  blurb:       'Base16 — uppercase hexadecimal: two characters per byte, strict about case and stray characters.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'b16encode b16decode base64.b16encode base64.b16decode base16 hex encode decode python bytes to hex uppercase casefold non-base16 digit found odd-length string hexlify fromhex',
};

export const method = {
  slug:      'b16encode-b16decode',
  name:      'base64.b16encode / b16decode',
  signature: 'base64.b16decode(s, casefold=False)',
  returns:   { type: 'bytes', desc: 'Encode: uppercase hex digits as ASCII bytes. Decode: the original bytes.' },

  category:    'base64 function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'RFC 4648 Base16 is hex in uppercase. The decoder rejects lowercase (unless casefold=True), spaces and an odd number of digits — bytes.fromhex is the forgiving alternative.',

  covers: ['b16encode', 'b16decode'],

  cheat: {
    commonCall: "base64.b16encode(data)  ·  base64.b16decode(text, casefold=True)",
    returns:    "bytes — b'6869' / b'hi'",
    replaces:   'binascii.hexlify(data).upper()',
    watchOut:   "Lowercase hex fails without casefold=True — and bytes.hex() produces lowercase",
  },

  parameters: [
    { name: 's',        type: 'bytes-like (encode) · bytes-like | ASCII str (decode)', required: true, default: null, desc: 'Data to encode, or hex text to decode (only 0–9 A–F, even length).' },
    { name: 'casefold', type: 'bool', required: false, default: 'False', desc: 'Decode only: accept lowercase a–f.' },
  ],

  modes: [
    {
      id: 'encode',
      label: 'encode',
      blurb: 'b16encode next to bytes.hex(): same digits, different case and type.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import base64\ndata = {$text}.encode()\n(base64.b16encode(data), data.hex())',
      cases: [
        { id: 'hello', label: 'Hello',     values: { text: 'Hello' } },
        { id: 'utf8',  label: 'non-ASCII', values: { text: 'é€' } },
      ],
    },
    {
      id: 'decode',
      label: 'decode',
      blurb: 'Decode with the defaults, then with casefold=True.',
      params: [{ name: 'data', type: 'str', hint: 'hex digits', input: 'text' }],
      template: "import base64, binascii\ndef attempt(casefold):\n    try:\n        return base64.b16decode({$data}, casefold=casefold)\n    except binascii.Error as e:\n        return f'binascii.Error: {e}'\n(attempt(False), attempt(True))",
      cases: [
        { id: 'upper', label: 'uppercase', values: { data: '48656C6C6F' } },
        { id: 'lower', label: 'lowercase', values: { data: '48656c6c6f' } },
        { id: 'odd',   label: 'odd length', values: { data: '486' } },
        { id: 'space', label: 'spaces',    values: { data: '48 65' } },
      ],
    },
  ],
  demoExplainer: 'b16decode checks the characters first and the length second: lowercase and spaces give "Non-base16 digit found", while "486" passes the character check and then fails in binascii with "Odd-length string". casefold=True uppercases the input before checking, so it fixes lowercase but not spaces.',

  patterns: [
    {
      name: 'Hex of a hash, uppercase',
      desc: 'hexdigest() is lowercase; b16encode gives the uppercase form some APIs want.',
      code: "import base64, hashlib\nbase64.b16encode(hashlib.sha256(data).digest()).decode('ascii')",
    },
    {
      name: 'Lenient hex parsing',
      desc: 'bytes.fromhex accepts either case and whitespace between bytes.',
      code: "raw = bytes.fromhex('48 65 6c 6c 6f')",
    },
  ],

  examples: [
    { title: 'Encode',               code: "import base64\nbase64.b16encode(b'\\x00\\xffhi')",           returns: "b'00FF6869'" },
    { title: 'bytes.hex is lowercase', code: "b'\\x00\\xffhi'.hex()",                                  returns: "'00ff6869'" },
    { title: 'Decode',               code: "import base64\nbase64.b16decode('48656C6C6F')",               returns: "b'Hello'" },
    { title: 'Lowercase rejected',   code: "import base64\nbase64.b16decode('48656c6c6f')",               returns: 'binascii.Error: Non-base16 digit found' },
    { title: 'casefold=True',        code: "import base64\nbase64.b16decode('48656c6c6f', casefold=True)", returns: "b'Hello'" },
    { title: 'Odd length',           code: "import base64\nbase64.b16decode('486')",                      returns: 'binascii.Error: Odd-length string' },
  ],

  pitfalls: [
    {
      name: 'Decoding the output of bytes.hex()',
      desc: 'hex() and hexdigest() are lowercase; b16decode wants uppercase by default.',
      wrong: { label: 'b16decode(hex())', code: "import base64\nbase64.b16decode(b'\\xca\\xfe'.hex())",                output: 'binascii.Error: Non-base16 digit found' },
      fix:   { label: 'casefold=True',    code: "import base64\nbase64.b16decode(b'\\xca\\xfe'.hex(), casefold=True)", output: "b'\\xca\\xfe'" },
    },
    {
      name: 'Spaced hex dumps',
      desc: 'Spaces are not Base16 digits. bytes.fromhex skips whitespace between byte pairs.',
      wrong: { label: 'b16decode',     code: "import base64\nbase64.b16decode('DE AD BE EF')", output: 'binascii.Error: Non-base16 digit found' },
      fix:   { label: 'bytes.fromhex', code: "bytes.fromhex('DE AD BE EF')",                   output: "b'\\xde\\xad\\xbe\\xef'" },
    },
  ],

  when: {
    use: [
      'Protocols that specify RFC 4648 Base16 (uppercase)',
      'Strict validation of hex input',
    ],
    avoid: [
      'Everyday hex → bytes.hex() and bytes.fromhex() need no import',
      'Compact output → Base64 adds a third to the size, hex doubles it',
    ],
  },

  notes: {
    cpython:     'b16encode = binascii.hexlify(s).upper(); b16decode checks re.search(b"[^0-9A-F]") and then calls binascii.unhexlify',
    'Exceptions': 'binascii.Error: "Non-base16 digit found" (character check) or "Odd-length string" (from unhexlify)',
  },

  related: [
    { name: 'bytes.hex()',     slug: 'bytes-hex',     when: 'Lowercase hex, optional separator', category: 'functions' },
    { name: 'bytes.fromhex()', slug: 'bytes-fromhex', when: 'Parse hex in either case, with spaces', category: 'functions' },
    { name: 'b32encode / b32decode', slug: 'b32encode-b32decode', when: 'Case-insensitive and more compact' },
    { name: 'base64 module',   slug: 'base64',        when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between b16encode and bytes.hex()?',
      a: 'The case and the type: b16encode returns uppercase bytes (b"6869"), bytes.hex() returns a lowercase str ("6869"). The digits are the same.',
    },
    {
      q: 'Why does b16decode say Non-base16 digit found?',
      a: 'The input has lowercase letters, spaces, a 0x prefix or other characters outside 0–9 A–F. Pass casefold=True for lowercase, or use bytes.fromhex, which also allows whitespace.',
    },
    {
      q: 'Is Base16 the same as hex?',
      a: 'Yes — RFC 4648 Base16 is hexadecimal with the uppercase alphabet 0123456789ABCDEF and no separators.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.b16encode',
    meta:  'base64.b16encode',
  },

};
