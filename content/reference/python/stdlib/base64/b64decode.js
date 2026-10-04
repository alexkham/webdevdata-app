// content/reference/python/stdlib/base64/b64decode.js

export const meta = {
  slug:        'b64decode',
  name:        'base64.b64decode',
  signature:   'base64.b64decode(s, altchars=None, validate=False)',
  blurb:       'Decode Base64 text (str or bytes) back into the original bytes; raises binascii.Error on bad padding.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'b64decode base64.b64decode base64 decode string python decode base64 to string binascii.error incorrect padding invalid base64-encoded string number of data characters validate only base64 data is allowed excess data after padding add missing padding',
};

export const method = {
  slug:      'b64decode',
  name:      'base64.b64decode',
  signature: 'base64.b64decode(s, altchars=None, validate=False)',
  returns:   { type: 'bytes', desc: 'The decoded data. Call .decode() on it when the original was text.' },

  category:    'base64 function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Accepts str or bytes, returns bytes. By default it quietly skips characters that are not Base64 — but it never forgives missing = padding.',

  covers: ['b64decode'],

  cheat: {
    commonCall: "base64.b64decode(token).decode('utf-8')",
    returns:    "bytes such as b'hello'",
    replaces:   'Hand-written Base64 parsing; codecs.decode(data, "base64")',
    watchOut:   'Stripped = padding raises binascii.Error: Incorrect padding',
  },

  parameters: [
    { name: 's',        type: 'bytes-like | str', required: true,  default: null,    desc: 'The Base64 data. A str must be pure ASCII, otherwise ValueError.' },
    { name: 'altchars', type: 'bytes | str',      required: false, default: 'None',  desc: 'The 2 characters used instead of + and /, e.g. "-_". They are translated back to + and / before decoding.' },
    { name: 'validate', type: 'bool',             required: false, default: 'False', desc: 'False: characters outside the alphabet (spaces, newlines, junk) are discarded. True: any of them — and misplaced padding — raises binascii.Error.' },
  ],

  modes: [
    {
      id: 'tostring',
      label: 'Base64 → string',
      blurb: 'Decode Base64 text and turn the bytes back into a str with UTF-8.',
      params: [{ name: 'data', type: 'str', hint: 'Base64 text', input: 'text' }],
      template: 'import base64\nbase64.b64decode({$data}).decode()',
      cases: [
        { id: 'hello',  label: 'hello world',     values: { data: 'aGVsbG8gd29ybGQ=' } },
        { id: 'utf8',   label: 'non-ASCII',       values: { data: 'Wm/DqyDwn5mC' } },
        { id: 'nopad',  label: 'missing padding', values: { data: 'aGVsbG8gd29ybGQ' } },
        { id: 'one',    label: 'one extra char',  values: { data: 'aGVsbG8gd' } },
        { id: 'binary', label: 'not text',        values: { data: '/w==' } },
      ],
    },
    {
      id: 'validate',
      label: 'validate=',
      blurb: 'The same input decoded leniently (default) and strictly (validate=True).',
      params: [{ name: 'data', type: 'str', hint: 'Base64 text', input: 'text' }],
      template: "import base64, binascii\ndef attempt(validate):\n    try:\n        return base64.b64decode({$data}, validate=validate)\n    except binascii.Error as e:\n        return f'binascii.Error: {e}'\n(attempt(False), attempt(True))",
      cases: [
        { id: 'clean',  label: 'clean',          values: { data: 'aGVsbG8=' } },
        { id: 'space',  label: 'spaces',         values: { data: 'aGVs bG8=' } },
        { id: 'junk',   label: 'junk chars',     values: { data: 'aGVs!bG8=' } },
        { id: 'after',  label: 'data after =',   values: { data: 'aGk=aGk=' } },
        { id: 'excess', label: 'extra =',        values: { data: 'aGk===' } },
        { id: 'url',    label: 'URL-safe input', values: { data: '-_-_' } },
      ],
    },
    {
      id: 'fixpad',
      label: 'fix padding',
      blurb: 'Restore stripped = signs before decoding: pad the length up to a multiple of 4.',
      params: [{ name: 'data', type: 'str', hint: 'Base64 text without =', input: 'text' }],
      template: "import base64\ns = {$data}\nbase64.b64decode(s + '=' * (-len(s) % 4))",
      cases: [
        { id: 'one',   label: '1 missing',  values: { data: 'aGVsbG8' } },
        { id: 'two',   label: '2 missing',  values: { data: 'aGk' } },
        { id: 'none',  label: 'none',       values: { data: 'YWJj' } },
        { id: 'bad',   label: 'impossible', values: { data: 'YWJjZ' } },
      ],
    },
  ],
  demoExplainer: 'Lenient mode drops every character outside A–Z a–z 0–9 + / before looking at the padding, so spaces and "!" vanish — and so do - and _, which is why URL-safe text decodes to b\'\' here. It also stops at the first complete padding, ignoring "aGk=" after it. validate=True turns each of those into an error. A length of 4k + 1 data characters can never be valid, so no amount of padding fixes "YWJjZ".',

  patterns: [
    {
      name: 'Decode Base64 to a string',
      desc: 'Decode the Base64, then decode the bytes with the text encoding the sender used.',
      code: "import base64\ntext = base64.b64decode(encoded).decode('utf-8')",
    },
    {
      name: 'Tolerate missing padding',
      desc: '-len(s) % 4 is exactly the number of = signs that were stripped.',
      code: "import base64\ndef b64decode_nopad(s):\n    return base64.b64decode(s + '=' * (-len(s) % 4))",
    },
    {
      name: 'Reject anything that is not clean Base64',
      desc: 'validate=True plus except ValueError (binascii.Error is a subclass) covers every bad input.',
      code: "import base64\ntry:\n    data = base64.b64decode(user_input, validate=True)\nexcept ValueError:\n    data = None",
    },
    {
      name: 'Save decoded data to a file',
      desc: 'Write the bytes in binary mode.',
      code: "import base64\nwith open('photo.jpg', 'wb') as f:\n    f.write(base64.b64decode(encoded))",
    },
  ],

  examples: [
    { title: 'str in, bytes out',           code: "import base64\nbase64.b64decode('aGVsbG8=')",                 returns: "b'hello'" },
    { title: 'Back to text',                code: "import base64\nbase64.b64decode('aGVsbG8=').decode()",         returns: "'hello'" },
    { title: 'Newlines are skipped',        code: "import base64\nbase64.b64decode('aGVs\\nbG8=')",              returns: "b'hello'" },
    { title: 'Missing padding',             code: "import base64\nbase64.b64decode('aGVsbG8')",                   returns: 'binascii.Error: Incorrect padding' },
    { title: 'Impossible length',           code: "import base64\nbase64.b64decode('a')",                         returns: 'binascii.Error: Invalid base64-encoded string: number of data characters (1) cannot be 1 more than a multiple of 4' },
    { title: 'Strict mode',                 code: "import base64\nbase64.b64decode('aGk=\\n', validate=True)",     returns: 'binascii.Error: Excess data after padding' },
    { title: 'URL-safe input via altchars', code: "import base64\nbase64.b64decode('-_8=', altchars='-_')",       returns: "b'\\xfb\\xff'" },
    { title: 'Non-ASCII str',               code: "import base64\nbase64.b64decode('aGVsbG8=é')",                 returns: 'ValueError: string argument should contain only ASCII characters' },
  ],

  pitfalls: [
    {
      name: 'Stripped padding (JWTs, URLs, copied tokens)',
      desc: 'Many producers drop the trailing = signs. b64decode requires them — add them back.',
      wrong: { label: 'as received',   code: "import base64\nbase64.b64decode('eyJzdWIiOiIxMjMifQ')", output: 'binascii.Error: Incorrect padding' },
      fix:   { label: 'pad it',        code: "import base64\ns = 'eyJzdWIiOiIxMjMifQ'\nbase64.b64decode(s + '=' * (-len(s) % 4))", output: "b'{\"sub\":\"123\"}'" },
    },
    {
      name: 'Silently dropping characters',
      desc: 'The default mode discards anything outside the alphabet, so URL-safe or corrupted input "succeeds" with the wrong bytes. validate=True makes it fail loudly.',
      wrong: { label: 'default',       code: "import base64\nbase64.b64decode('-_-_')",                output: "b''" },
      fix:   { label: 'validate=True', code: "import base64\nbase64.b64decode('-_-_', validate=True)", output: 'binascii.Error: Only base64 data is allowed' },
    },
    {
      name: 'Decoding binary data as text',
      desc: 'b64decode returns whatever bytes were encoded. If they are an image or a key, .decode() fails — keep them as bytes.',
      wrong: { label: '.decode()',     code: "import base64\nbase64.b64decode('iVBORw0KGgo=').decode()", output: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0x89 in position 0: invalid start byte" },
      fix:   { label: 'keep bytes',    code: "import base64\nbase64.b64decode('iVBORw0KGgo=')[1:4]",      output: "b'PNG'" },
    },
  ],

  when: {
    use: [
      'Base64 from JSON, HTTP headers, data: URIs, config files, email',
      'Standard alphabet (+ and /) input; altchars= for others',
    ],
    avoid: [
      'URL-safe input (- and _) → urlsafe_b64decode, or validate=True to catch it',
      'Untrusted input you must reject when malformed → pass validate=True',
      'Multi-line MIME bodies → decodebytes works too; b64decode already skips the newlines',
    ],
  },

  notes: {
    cpython:      'binascii.a2b_base64(s, strict_mode=validate) in C (the strict_mode parameter exists since Python 3.11)',
    'Padding':    'Decoding stops at the first complete padding, so anything after "==" is ignored in lenient mode',
    'Exceptions': 'binascii.Error (a ValueError) for bad data; ValueError for non-ASCII str; TypeError for other types',
  },

  related: [
    { name: 'base64.b64encode',   slug: 'b64encode',          when: 'The reverse direction' },
    { name: 'urlsafe_b64decode',  slug: 'urlsafe-b64',        when: 'Decode - and _ (JWTs, URLs)' },
    { name: 'decodebytes',        slug: 'encodebytes-decodebytes', when: 'Decode MIME line-wrapped Base64' },
    { name: 'bytes.decode()',     slug: 'bytes-decode',       when: 'Turn the result into text', category: 'functions' },
    { name: 'UnicodeDecodeError', slug: 'unicodedecodeerror', when: 'When the decoded bytes are not UTF-8', category: 'exceptions' },
    { name: 'ValueError',         slug: 'valueerror',         when: 'Catch it to catch binascii.Error too', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I decode a Base64 string to text in Python?',
      a: "base64.b64decode(s).decode('utf-8'). b64decode accepts the str directly and returns bytes; .decode turns the bytes into text.",
    },
    {
      q: 'How do I fix "binascii.Error: Incorrect padding"?',
      a: "The input lost its trailing = signs or was truncated. If it is only the padding, decode s + '=' * (-len(s) % 4). If the length is 1 more than a multiple of 4 you get the \"number of data characters\" error instead — then the data itself is incomplete.",
    },
    {
      q: 'What does validate=True do?',
      a: 'It rejects input that the default mode would silently clean up: characters outside the alphabet ("Only base64 data is allowed"), leading or extra padding, and data after the padding. Missing padding is an error in both modes.',
    },
    {
      q: 'Why does b64decode return bytes?',
      a: 'Base64 can carry any binary data — images, keys, compressed files — not only text. Only you know whether the bytes are text and which encoding they use, so decoding them is a separate step.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/base64.html#base64.b64decode',
    meta:  'base64.b64decode',
  },

};
