// content/reference/python/stdlib/base64/standard-b64.js
// standard_b64encode / standard_b64decode

export const meta = {
  slug:        'standard-b64',
  name:        'base64.standard_b64encode / standard_b64decode',
  signature:   'base64.standard_b64encode(s)',
  blurb:       'Base64 with the standard RFC 4648 alphabet (+ and /) — b64encode and b64decode without the optional arguments.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'standard_b64encode standard_b64decode base64.standard_b64encode base64.standard_b64decode standard base64 alphabet rfc 4648 plus slash',
};

export const method = {
  slug:      'standard-b64',
  name:      'base64.standard_b64encode / standard_b64decode',
  signature: 'base64.standard_b64encode(s)',
  returns:   { type: 'bytes', desc: 'Encode: the Base64 text as ASCII bytes. Decode: the original bytes.' },

  category:    'base64 function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Exact aliases with a self-documenting name: standard_b64encode(s) is b64encode(s), standard_b64decode(s) is b64decode(s). No altchars, no validate.',

  covers: ['standard_b64encode', 'standard_b64decode'],

  cheat: {
    commonCall: 'base64.standard_b64encode(data)  ·  base64.standard_b64decode(text)',
    returns:    "bytes — b'aGk=' / b'hi'",
    replaces:   'b64encode / b64decode when you want "standard alphabet" spelled out in the code',
    watchOut:   'Decoding is lenient: - and _ are silently dropped, not converted',
  },

  parameters: [
    { name: 's', type: 'bytes-like (encode) · bytes-like | ASCII str (decode)', required: true, default: null, desc: 'The data to encode, or the Base64 text to decode.' },
  ],

  modes: [
    {
      id: 'encode',
      label: 'standard_b64encode',
      blurb: 'Text → UTF-8 bytes → standard Base64 (+ and / in the alphabet).',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import base64\nbase64.standard_b64encode({$text}.encode())',
      cases: [
        { id: 'hello', label: 'hello',     values: { text: 'hello' } },
        { id: 'plus',  label: 'gives + /', values: { text: '???>>>' } },
        { id: 'utf8',  label: 'non-ASCII', values: { text: 'Zoë' } },
      ],
    },
    {
      id: 'decode',
      label: 'standard_b64decode',
      blurb: 'Base64 text → bytes. Characters outside the standard alphabet are discarded before the padding check.',
      params: [{ name: 'data', type: 'str', hint: 'Base64 text', input: 'text' }],
      template: 'import base64\nbase64.standard_b64decode({$data})',
      cases: [
        { id: 'std',   label: 'standard',     values: { data: 'Pz8/Pj4+' } },
        { id: 'url',   label: 'URL-safe',     values: { data: 'Pz8_Pj4-' } },
        { id: 'nopad', label: 'no padding',   values: { data: 'aGVsbG8' } },
      ],
    },
  ],
  demoExplainer: '"???>>>" is chosen because its bytes land on the last two alphabet positions: standard Base64 writes Pz8/Pj4+. Feed the URL-safe spelling Pz8_Pj4- to standard_b64decode and _ and - are simply dropped, leaving 6 data characters — one group short — so it raises Incorrect padding instead of decoding.',

  patterns: [
    {
      name: 'Name the alphabet explicitly',
      desc: 'Same result as b64encode — the name tells readers which alphabet the other side expects.',
      code: "import base64\nheader = base64.standard_b64encode(raw).decode('ascii')",
    },
    {
      name: 'Accept either alphabet',
      desc: 'Translate - and _ to + and / first; then any RFC 4648 Base64 decodes.',
      code: "import base64\ndef decode_any(s):\n    return base64.standard_b64decode(s.replace('-', '+').replace('_', '/'))",
    },
  ],

  examples: [
    { title: 'Same as b64encode',    code: "import base64\nbase64.standard_b64encode(b'hello') == base64.b64encode(b'hello')", returns: 'True' },
    { title: 'Encode',               code: "import base64\nbase64.standard_b64encode(b'\\xfb\\xff')",                       returns: "b'+/8='" },
    { title: 'Decode',               code: "import base64\nbase64.standard_b64decode('+/8=')",                               returns: "b'\\xfb\\xff'" },
    { title: 'URL-safe input fails', code: "import base64\nbase64.standard_b64decode('-_8=')",                               returns: 'binascii.Error: Invalid base64-encoded string: number of data characters (1) cannot be 1 more than a multiple of 4' },
    { title: 'No validate argument', code: "import base64\nbase64.standard_b64decode('aGk=', validate=True)",                returns: "TypeError: standard_b64decode() got an unexpected keyword argument 'validate'" },
  ],

  pitfalls: [
    {
      name: 'Expecting it to convert URL-safe characters',
      desc: 'The standard decoder treats - and _ as junk and drops them. Use urlsafe_b64decode for that alphabet.',
      wrong: { label: 'standard_b64decode', code: "import base64\nbase64.standard_b64decode('Pz8_Pj4-')", output: 'binascii.Error: Incorrect padding' },
      fix:   { label: 'urlsafe_b64decode',  code: "import base64\nbase64.urlsafe_b64decode('Pz8_Pj4-')",  output: "b'???>>>'" },
    },
    {
      name: 'Needing strict checking',
      desc: 'standard_b64decode has no validate parameter; call b64decode directly for strict mode.',
      wrong: { label: 'lenient',  code: "import base64\nbase64.standard_b64decode('aG k=')",          output: "b'hi'" },
      fix:   { label: 'b64decode(validate=True)', code: "import base64\nbase64.b64decode('aG k=', validate=True)", output: 'binascii.Error: Only base64 data is allowed' },
    },
  ],

  when: {
    use: [
      'Code that should say "standard alphabet" out loud, next to urlsafe_ calls',
    ],
    avoid: [
      'Custom alphabets or strict validation → b64encode(altchars=) / b64decode(validate=True)',
      'URLs and JWTs → urlsafe_b64encode / urlsafe_b64decode',
    ],
  },

  notes: {
    cpython:     'One-line wrappers in Lib/base64.py: return b64encode(s) / return b64decode(s)',
    'Alphabet':  'A–Z a–z 0–9 + / with = padding (RFC 4648 section 4)',
  },

  related: [
    { name: 'base64.b64encode', slug: 'b64encode',   when: 'The function underneath, with altchars' },
    { name: 'base64.b64decode', slug: 'b64decode',   when: 'The function underneath, with validate' },
    { name: 'urlsafe_b64encode / decode', slug: 'urlsafe-b64', when: 'The - and _ alphabet' },
    { name: 'base64 module',    slug: 'base64',      when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between b64encode and standard_b64encode?',
      a: 'None in the result — standard_b64encode(s) simply returns b64encode(s). It only lacks the altchars argument, and standard_b64decode lacks altchars and validate.',
    },
    {
      q: 'Which characters does standard Base64 use?',
      a: 'A–Z, a–z, 0–9, + and /, with = as padding. The URL-safe variant replaces + with - and / with _.',
    },
    {
      q: 'Does standard_b64decode reject invalid characters?',
      a: 'No. Like b64decode with its defaults it discards characters outside the alphabet before checking the padding. Use b64decode(s, validate=True) to reject them.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.standard_b64encode',
    meta:  'base64.standard_b64encode',
  },

};
