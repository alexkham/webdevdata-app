// content/reference/python/stdlib/base64/b32encode-b32decode.js
// b32encode / b32decode / b32hexencode / b32hexdecode

export const meta = {
  slug:        'b32encode-b32decode',
  name:        'base64.b32encode / b32decode',
  signature:   'base64.b32decode(s, casefold=False, map01=None)',
  blurb:       'Base32 (A–Z and 2–7) and Base32hex (0–9 and A–V): 8 characters per 5 bytes, case-insensitive on request.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+ (b32hex: 3.10+)',
  searchTerms: 'b32encode b32decode b32hexencode b32hexdecode base64.b32encode base64.b32decode base64.b32hexencode base64.b32hexdecode base32 python base32hex totp secret google authenticator casefold map01 non-base32 digit found incorrect padding',
};

export const method = {
  slug:      'b32encode-b32decode',
  name:      'base64.b32encode / b32decode',
  signature: 'base64.b32decode(s, casefold=False, map01=None)',
  returns:   { type: 'bytes', desc: 'Encode: uppercase Base32 as ASCII bytes, padded with = to a multiple of 8. Decode: the original bytes.' },

  category:    'base64 function',
  version:     'Python 2.4+ (b32hex: 3.10+)',
  hasLiveDemo: true,

  subtitle: 'Base32 survives case changes and avoids look-alike characters, which is why TOTP secrets and other human-typed codes use it. Python is strict by default: lowercase and missing padding are errors until you opt in.',

  covers: ['b32encode', 'b32decode', 'b32hexencode', 'b32hexdecode'],

  cheat: {
    commonCall: "base64.b32decode(secret.upper() + '=' * (-len(secret) % 8))",
    returns:    "bytes — b'NBSWY3DP' / b'hello'",
    replaces:   'Hand-rolled 5-bit packing',
    watchOut:   'Lowercase input needs casefold=True; padding is required',
  },

  parameters: [
    { name: 's',        type: 'bytes-like (encode) · bytes-like | ASCII str (decode)', required: true, default: null, desc: 'Data to encode, or Base32 text to decode. The decoded length must be a multiple of 8, = included.' },
    { name: 'casefold', type: 'bool',  required: false, default: 'False', desc: 'Decode only: accept lowercase letters (the input is uppercased first).' },
    { name: 'map01',    type: 'bytes | str', required: false, default: 'None', desc: "b32decode only: allow the digits 0 and 1 by mapping 0 to O and 1 to this letter ('L' or 'I'). Must be exactly 1 character." },
  ],

  modes: [
    {
      id: 'encode',
      label: 'encode',
      blurb: 'The same bytes in Base32 and in Base32hex.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import base64\ndata = {$text}.encode()\n(base64.b32encode(data), base64.b32hexencode(data))',
      cases: [
        { id: 'hello', label: 'hello', values: { text: 'hello' } },
        { id: 'hi',    label: 'hi (padded)', values: { text: 'hi' } },
        { id: 'empty', label: 'empty', values: { text: '' } },
      ],
    },
    {
      id: 'decode',
      label: 'decode',
      blurb: 'Decode with the defaults, then with casefold=True.',
      params: [{ name: 'data', type: 'str', hint: 'Base32 text', input: 'text' }],
      template: "import base64, binascii\ndef attempt(casefold):\n    try:\n        return base64.b32decode({$data}, casefold=casefold)\n    except binascii.Error as e:\n        return f'binascii.Error: {e}'\n(attempt(False), attempt(True))",
      cases: [
        { id: 'upper', label: 'uppercase',       values: { data: 'NBSWY3DP' } },
        { id: 'lower', label: 'lowercase',       values: { data: 'nbswy3dp' } },
        { id: 'pad',   label: 'padded',          values: { data: 'NBUQ====' } },
        { id: 'nopad', label: 'missing padding', values: { data: 'NBUQ' } },
        { id: 'space', label: 'with spaces',     values: { data: 'NBSW Y3DP' } },
      ],
    },
    {
      id: 'secret',
      label: 'TOTP secret',
      blurb: 'Authenticator secrets are often shown lowercase, grouped and unpadded. Normalize, pad, decode.',
      params: [{ name: 'secret', type: 'str', hint: 'a Base32 secret', input: 'text' }],
      template: "import base64\ns = {$secret}.replace(' ', '').upper()\nbase64.b32decode(s + '=' * (-len(s) % 8))",
      cases: [
        { id: 'grouped', label: 'grouped', values: { secret: 'jbsw y3dp ehpk 3pxp' } },
        { id: 'short',   label: 'unpadded', values: { secret: 'mfrgg' } },
        { id: 'digit',   label: 'with a 1', values: { secret: 'mfrgg1' } },
      ],
    },
  ],
  demoExplainer: 'Base32 writes 5 bytes as 8 characters, so 2 bytes ("hi") need 4 characters plus 4 = signs. The decoder checks the length first: anything that is not a multiple of 8 — including unpadded input and input containing spaces — is "Incorrect padding" before a single character is looked at. Lowercase letters are "Non-base32 digit found" unless casefold=True, and so are 0, 1, 8 and 9, which the alphabet leaves out on purpose.',

  patterns: [
    {
      name: 'Decode a TOTP / 2FA secret',
      desc: 'Remove spaces, uppercase, restore padding.',
      code: "import base64\ndef totp_key(secret):\n    s = secret.replace(' ', '').upper()\n    return base64.b32decode(s + '=' * (-len(s) % 8))",
    },
    {
      name: 'Generate a Base32 secret',
      desc: '20 random bytes give 32 characters with no padding.',
      code: "import base64, secrets\nsecret = base64.b32encode(secrets.token_bytes(20)).decode('ascii')",
    },
    {
      name: 'Sortable IDs with Base32hex',
      desc: 'The hex alphabet keeps the sort order of the underlying bytes.',
      code: "import base64\nkey = base64.b32hexencode(raw_id).rstrip(b'=').decode('ascii')",
    },
  ],

  examples: [
    { title: 'Encode',                  code: "import base64\nbase64.b32encode(b'hello')",                       returns: "b'NBSWY3DP'" },
    { title: 'Padding to 8 characters', code: "import base64\nbase64.b32encode(b'hi')",                          returns: "b'NBUQ===='" },
    { title: 'Base32hex',               code: "import base64\nbase64.b32hexencode(b'hello')",                    returns: "b'D1IMOR3F'" },
    { title: 'Decode',                  code: "import base64\nbase64.b32decode('NBSWY3DP')",                     returns: "b'hello'" },
    { title: 'Lowercase is rejected',   code: "import base64\nbase64.b32decode('nbswy3dp')",                     returns: 'binascii.Error: Non-base32 digit found' },
    { title: 'casefold=True',           code: "import base64\nbase64.b32decode('nbswy3dp', casefold=True)",      returns: "b'hello'" },
    { title: 'Decode Base32hex',        code: "import base64\nbase64.b32hexdecode('D1IMOR3F')",                  returns: "b'hello'" },
    { title: 'map01 for typed codes',   code: "import base64\nbase64.b32decode('MFRGG1Q=', map01='L') == base64.b32decode('MFRGGLQ=')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Stripped padding',
      desc: 'The length must be a multiple of 8; add the = signs back (-len(s) % 8 of them).',
      wrong: { label: 'unpadded', code: "import base64\nbase64.b32decode('MFRGG')",               output: 'binascii.Error: Incorrect padding' },
      fix:   { label: 'padded',   code: "import base64\ns = 'MFRGG'\nbase64.b32decode(s + '=' * (-len(s) % 8))", output: "b'abc'" },
    },
    {
      name: 'Lowercase secrets',
      desc: 'Base32 is meant to be case-insensitive, but Python only accepts lowercase with casefold=True.',
      wrong: { label: 'default',       code: "import base64\nbase64.b32decode('mfrgg===')",                output: 'binascii.Error: Non-base32 digit found' },
      fix:   { label: 'casefold=True', code: "import base64\nbase64.b32decode('mfrgg===', casefold=True)", output: "b'abc'" },
    },
    {
      name: 'Mixing up Base32 and Base32hex',
      desc: 'Both alphabets have 32 characters but different values; the wrong decoder gives different bytes or an error.',
      wrong: { label: 'b32decode',    code: "import base64\nbase64.b32decode('D1IMOR3F')",    output: 'binascii.Error: Non-base32 digit found' },
      fix:   { label: 'b32hexdecode', code: "import base64\nbase64.b32hexdecode('D1IMOR3F')", output: "b'hello'" },
    },
  ],

  when: {
    use: [
      'Codes people read aloud or type: TOTP secrets, license keys, backup codes',
      'Case-insensitive file systems and DNS labels (Base32hex keeps sort order)',
    ],
    avoid: [
      'Compact machine-to-machine data → Base64 (Base32 output is 20% longer)',
      'Hex is wanted → b16encode or bytes.hex()',
    ],
  },

  notes: {
    cpython:      'Pure Python in Lib/base64.py (5-byte quanta via int.from_bytes); b32hexencode / b32hexdecode were added in 3.10',
    'Alphabets':  'Base32: A–Z 2–7. Base32hex: 0–9 A–V. Both pad with = to a multiple of 8 (RFC 4648 sections 6 and 7)',
    'Exceptions': 'binascii.Error: "Incorrect padding" for a bad length or padding count, "Non-base32 digit found" for any other character',
  },

  related: [
    { name: 'b16encode / b16decode', slug: 'b16encode-b16decode', when: 'Hex — the simplest text form' },
    { name: 'base64.b64encode',      slug: 'b64encode',           when: 'More compact, case-sensitive' },
    { name: 'str.upper()',           slug: 'upper',           when: 'Normalize case before decoding', category: 'functions' },
    { name: 'base64 module',         slug: 'base64',              when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I decode a lowercase Base32 string in Python?',
      a: 'Pass casefold=True: base64.b32decode(s, casefold=True). Without it, lowercase letters raise "Non-base32 digit found".',
    },
    {
      q: 'Why does b32decode say Incorrect padding?',
      a: "Base32 text must be a multiple of 8 characters including = padding. Authenticator apps and many APIs strip the padding (and add spaces); remove spaces and append '=' * (-len(s) % 8).",
    },
    {
      q: 'What is map01 for?',
      a: "RFC 4648 lets decoders read the digit 0 as the letter O and 1 as I or L, since Base32 has no 0 or 1. map01='L' (or 'I') enables that mapping; by default 0 and 1 are errors.",
    },
    {
      q: 'What is the difference between Base32 and Base32hex?',
      a: 'Only the alphabet: Base32hex uses 0–9 then A–V, so encoded strings sort in the same order as the bytes. Use the decoder that matches the encoder.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.b32encode',
    meta:  'base64.b32encode',
  },

};
