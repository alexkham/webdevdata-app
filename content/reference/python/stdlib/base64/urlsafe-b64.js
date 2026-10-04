// content/reference/python/stdlib/base64/urlsafe-b64.js
// urlsafe_b64encode / urlsafe_b64decode

export const meta = {
  slug:        'urlsafe-b64',
  name:        'base64.urlsafe_b64encode / urlsafe_b64decode',
  signature:   'base64.urlsafe_b64encode(s)',
  blurb:       'Base64 with - and _ instead of + and /, safe in URLs, file names and JWTs.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'urlsafe_b64encode urlsafe_b64decode base64.urlsafe_b64encode base64.urlsafe_b64decode url safe base64 python base64url jwt decode payload without padding filename safe minus underscore rfc 4648 section 5',
};

export const method = {
  slug:      'urlsafe-b64',
  name:      'base64.urlsafe_b64encode / urlsafe_b64decode',
  signature: 'base64.urlsafe_b64encode(s)',
  returns:   { type: 'bytes', desc: 'Encode: URL-safe Base64 as ASCII bytes, = padding kept. Decode: the original bytes.' },

  category:    'base64 function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'The base64url alphabet of RFC 4648: - replaces + and _ replaces /. Python keeps the = padding on encode and requires it on decode — JWTs and most URL tokens strip it.',

  covers: ['urlsafe_b64encode', 'urlsafe_b64decode'],

  cheat: {
    commonCall: "base64.urlsafe_b64encode(data).rstrip(b'=')",
    returns:    "bytes such as b'-_-_'",
    replaces:   'b64encode followed by urllib.parse.quote, or manual replace("+", "-")',
    watchOut:   'Padding stays on encode and is required on decode',
  },

  parameters: [
    { name: 's', type: 'bytes-like (encode) · bytes-like | ASCII str (decode)', required: true, default: null, desc: 'The data to encode, or the URL-safe Base64 text to decode. The decoder also accepts + and /.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'standard vs URL-safe',
      blurb: 'The same bytes in both alphabets. They differ only where the standard output has + or /.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import base64\ndata = {$text}.encode()\n(base64.b64encode(data), base64.urlsafe_b64encode(data))',
      cases: [
        { id: 'chars', label: '+ and /',     values: { text: '???>>>' } },
        { id: 'utf8',  label: 'non-ASCII',   values: { text: 'ÿÿ~~' } },
        { id: 'same',  label: 'no difference', values: { text: 'hello' } },
      ],
    },
    {
      id: 'jwt',
      label: 'JWT segment',
      blurb: 'Decode one dot-separated part of a JWT: pad it back to a multiple of 4, then decode the JSON text.',
      params: [{ name: 'segment', type: 'str', hint: 'a JWT header or payload', input: 'text' }],
      template: "import base64\nsegment = {$segment}\nbase64.urlsafe_b64decode(segment + '=' * (-len(segment) % 4)).decode()",
      cases: [
        { id: 'header',  label: 'header',  values: { segment: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' } },
        { id: 'payload', label: 'payload', values: { segment: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' } },
        { id: 'utf8',    label: 'non-ASCII', values: { segment: 'eyJuYW1lIjoiWm_DqyJ9' } },
      ],
    },
    {
      id: 'raw',
      label: 'without padding fix',
      blurb: 'What urlsafe_b64decode does with the segment exactly as it appears in the token.',
      params: [{ name: 'segment', type: 'str', hint: 'URL-safe Base64', input: 'text' }],
      template: 'import base64\nbase64.urlsafe_b64decode({$segment})',
      cases: [
        { id: 'payload', label: 'unpadded payload', values: { segment: 'eyJzdWIiOiIxMjMifQ' } },
        { id: 'padded',  label: 'padded',           values: { segment: 'eyJzdWIiOiIxMjMifQ==' } },
        { id: 'std',     label: 'standard chars',   values: { segment: '+/+/' } },
      ],
    },
  ],
  demoExplainer: 'JWTs use base64url with the padding removed, so a payload whose length is not a multiple of 4 raises Incorrect padding until you add -len(s) % 4 = signs back. The decoder translates - and _ to + and / and then runs the normal lenient decoder, which is why standard input such as "+/+/" decodes too. In the non-ASCII payload, "Wm_D" is where the URL-safe _ stands in for the / of standard Base64.',

  patterns: [
    {
      name: 'URL token without padding',
      desc: 'The common base64url form: URL-safe alphabet, no trailing =.',
      code: "import base64, secrets\ntoken = base64.urlsafe_b64encode(secrets.token_bytes(16)).rstrip(b'=').decode('ascii')",
    },
    {
      name: 'Decode a JWT payload (no signature check)',
      desc: 'Split on dots, pad the middle part, decode, parse the JSON. This does NOT verify the token — use a JWT library for that.',
      code: "import base64, json\npayload = token.split('.')[1]\nclaims = json.loads(base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4)))",
    },
    {
      name: 'Base64url helpers',
      desc: 'Encode without padding, decode with it restored.',
      code: "import base64\ndef b64url_encode(b):\n    return base64.urlsafe_b64encode(b).rstrip(b'=').decode('ascii')\n\ndef b64url_decode(s):\n    return base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))",
    },
  ],

  examples: [
    { title: '- and _ instead of + and /', code: "import base64\nbase64.urlsafe_b64encode(b'\\xfb\\xff\\xbf')",          returns: "b'-_-_'" },
    { title: 'Standard alphabet, same bytes', code: "import base64\nbase64.b64encode(b'\\xfb\\xff\\xbf')",                returns: "b'+/+/'" },
    { title: 'Padding is kept',            code: "import base64\nbase64.urlsafe_b64encode(b'\\xff\\xff')",              returns: "b'__8='" },
    { title: 'Strip it yourself',          code: "import base64\nbase64.urlsafe_b64encode(b'\\xff\\xff').rstrip(b'=')", returns: "b'__8'" },
    { title: 'Decode',                     code: "import base64\nbase64.urlsafe_b64decode('-_-_')",                    returns: "b'\\xfb\\xff\\xbf'" },
    { title: 'Standard input works too',   code: "import base64\nbase64.urlsafe_b64decode('+/+/')",                    returns: "b'\\xfb\\xff\\xbf'" },
    { title: 'JWT header',                 code: "import base64\nbase64.urlsafe_b64decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')", returns: "b'{\"alg\":\"HS256\",\"typ\":\"JWT\"}'" },
  ],

  pitfalls: [
    {
      name: 'Decoding a JWT part as-is',
      desc: 'JWT segments have their = padding removed. Add it back before decoding.',
      wrong: { label: 'as-is',  code: "import base64\nbase64.urlsafe_b64decode('eyJzdWIiOiIxMjMifQ')", output: 'binascii.Error: Incorrect padding' },
      fix:   { label: 'padded', code: "import base64\ns = 'eyJzdWIiOiIxMjMifQ'\nbase64.urlsafe_b64decode(s + '=' * (-len(s) % 4))", output: "b'{\"sub\":\"123\"}'" },
    },
    {
      name: 'Decoding URL-safe text with b64decode',
      desc: 'b64decode drops - and _ as junk, so the bytes come out wrong — or empty — without any error.',
      wrong: { label: 'b64decode',         code: "import base64\nbase64.b64decode('-_-_')",         output: "b''" },
      fix:   { label: 'urlsafe_b64decode', code: "import base64\nbase64.urlsafe_b64decode('-_-_')", output: "b'\\xfb\\xff\\xbf'" },
    },
    {
      name: 'Expecting a str from the encoder',
      desc: 'Like every encoder in the module it returns bytes; putting it in an f-string shows b\'...\'.',
      wrong: { label: 'f-string of bytes', code: "import base64\nf\"/files/{base64.urlsafe_b64encode(b'id-7')}\"", output: "\"/files/b'aWQtNw=='\"" },
      fix:   { label: '.decode()',         code: "import base64\nf\"/files/{base64.urlsafe_b64encode(b'id-7').decode()}\"", output: "'/files/aWQtNw=='" },
    },
  ],

  when: {
    use: [
      'Tokens in URLs and query strings, file names, cookie values',
      'JWT / JOSE (base64url, padding stripped)',
    ],
    avoid: [
      'APIs that specify plain Base64 → b64encode',
      'Verifying JWTs — decoding is not validating; use a JWT library',
    ],
  },

  notes: {
    cpython:    'b64encode(s).translate(+/ → -_) to encode; translate(-_ → +/) then b64decode(s) to decode — so decoding is lenient and has no validate option',
    'Padding':  '= is not part of the URL-safe alphabet and already means key=value in query strings, which is why base64url usually strips it',
    'Spec':     'RFC 4648 section 5, "Base 64 Encoding with URL and Filename Safe Alphabet"',
  },

  related: [
    { name: 'base64.b64encode', slug: 'b64encode', when: 'Standard alphabet, altchars for custom ones' },
    { name: 'base64.b64decode', slug: 'b64decode', when: 'validate=True and altchars="-_" for strict URL-safe decoding' },
    { name: 'json module',      slug: 'json',      when: 'Parse a decoded JWT payload', category: 'stdlib' },
    { name: 'base64 module',    slug: 'base64',    when: 'All encodings at a glance', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I decode a JWT payload in Python without a library?',
      a: "Take the middle part (token.split('.')[1]), add '=' * (-len(part) % 4), call base64.urlsafe_b64decode and json.loads the result. That only reads the claims — it does not check the signature.",
    },
    {
      q: 'How do I make Base64 URL-safe in Python?',
      a: "Use base64.urlsafe_b64encode(data). It swaps + for - and / for _. Add .rstrip(b'=') if the receiver expects unpadded base64url.",
    },
    {
      q: 'Why does urlsafe_b64decode raise Incorrect padding?',
      a: 'The input had its = padding stripped, which base64url producers usually do. Python requires the length to be a multiple of 4; append "=" * (-len(s) % 4) before decoding.',
    },
    {
      q: 'Does urlsafe_b64decode support validate=True?',
      a: "No — it takes only the data. For strict checking call base64.b64decode(s, altchars='-_', validate=True).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.urlsafe_b64encode',
    meta:  'base64.urlsafe_b64encode',
  },

};
