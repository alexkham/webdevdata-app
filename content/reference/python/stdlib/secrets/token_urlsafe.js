// content/reference/python/stdlib/secrets/token_urlsafe.js

export const meta = {
  slug:        'token_urlsafe',
  name:        'secrets.token_urlsafe',
  signature:   'secrets.token_urlsafe(nbytes=None)',
  blurb:       'A random URL-safe text token: nbytes random bytes as Base64url (A-Z, a-z, 0-9, - and _) with the padding stripped — about 1.33 characters per byte. The standard choice for reset links, session IDs and invitation codes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.token_urlsafe token_urlsafe python generate password reset token url safe token session token csrf token invitation code base64url random string python secure random string url token_urlsafe length 43 characters 22 characters incorrect padding',
};

export const method = {
  slug:      'token_urlsafe',
  name:      'secrets.token_urlsafe',
  signature: 'secrets.token_urlsafe(nbytes=None)',
  returns:   { type: 'str', desc: 'ceil(4 × nbytes / 3) characters of unpadded Base64url (43 for the default), different on every call.' },

  category:    'secrets function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'The token is base64.urlsafe_b64encode of the random bytes with the trailing = removed, so it can go straight into a URL, a cookie or a header. Its length is ceil(4 × nbytes / 3): 22 characters for 16 bytes, 43 for the default 32.',

  covers: ['token_urlsafe'],

  cheat: {
    commonCall: 'secrets.token_urlsafe(32)',
    returns:    "str of 43 characters; token_urlsafe(16) looks like 'Drmhze6EPcv0fN_81Bj-nA' (the docs' example)",
    replaces:   "base64.urlsafe_b64encode(os.urandom(n)).rstrip(b'=').decode()",
    watchOut:   'nbytes is randomness, not length; decoding needs the = padding back',
  },

  parameters: [
    { name: 'nbytes', type: 'int | None', required: false, default: 'None', desc: 'Bytes of randomness, not characters. None (or no argument) uses secrets.DEFAULT_ENTROPY, 32 in CPython 3.13. Negative raises ValueError; a float raises TypeError.' },
  ],

  modes: [
    {
      id: 'length',
      label: 'length and alphabet',
      blurb: 'The token changes on every run; its length and its alphabet do not. Leave nbytes empty for None.',
      params: [{ name: 'nbytes', type: 'int | None', hint: 'bytes of randomness', input: 'number-or-none' }],
      template: "import secrets, string\nt = secrets.token_urlsafe({$nbytes})\n(len(t), set(t) <= set(string.ascii_letters + string.digits + '-_'))",
      cases: [
        { id: 'sixteen', label: '16',   values: { nbytes: '16' } },
        { id: 'default', label: 'None', values: { nbytes: '' } },
        { id: 'nine',    label: '9',    values: { nbytes: '9' } },
        { id: 'one',     label: '1',    values: { nbytes: '1' } },
        { id: 'zero',    label: '0',    values: { nbytes: '0' } },
        { id: 'neg',     label: '-1',   values: { nbytes: '-1' } },
      ],
    },
    {
      id: 'decode',
      label: 'decode it again',
      blurb: 'Base64url text back to the random bytes: first restore the stripped = padding, (-len(t) % 4) characters of it.',
      params: [{ name: 'nbytes', type: 'int', hint: 'bytes of randomness', input: 'number' }],
      template: "import base64, secrets\nt = secrets.token_urlsafe({$nbytes})\npadded = t + '=' * (-len(t) % 4)\n(len(t), len(padded), len(base64.urlsafe_b64decode(padded)))",
      cases: [
        { id: 'sixteen', label: '16', values: { nbytes: '16' } },
        { id: 'default', label: '32', values: { nbytes: '32' } },
        { id: 'even',    label: '24', values: { nbytes: '24' } },
      ],
    },
  ],
  demoExplainer: 'Every 3 random bytes become 4 characters, and a partial group at the end gives 2 or 3 characters instead of a padded 4: 16 bytes → 22 characters, 32 → 43, while 9 and 24 (multiples of 3) give exactly 12 and 32. Only letters, digits, - and _ appear. A negative count raises ValueError: negative argument not allowed. Decoding needs the padding back — 2 equals signs for a 22-character token — and then returns exactly nbytes bytes.',

  patterns: [
    {
      name: 'Password-reset link',
      desc: 'Send the token, store only its hash and an expiry time.',
      code: "import hashlib, secrets\ntoken = secrets.token_urlsafe(32)\nreset_url = f'https://example.com/reset?token={token}'\nstored_hash = hashlib.sha256(token.encode()).hexdigest()",
    },
    {
      name: 'Check the token when it comes back',
      desc: 'Hash what arrived and compare in constant time.',
      code: "import hashlib, secrets\nok = secrets.compare_digest(hashlib.sha256(received.encode()).hexdigest(), stored_hash)",
    },
    {
      name: 'Short invitation code',
      desc: '9 bytes → exactly 12 characters, 72 bits of randomness.',
      code: 'import secrets\ninvite_code = secrets.token_urlsafe(9)',
    },
    {
      name: 'Decode a token to its bytes',
      desc: 'Restore the padding first.',
      code: "import base64\nraw = base64.urlsafe_b64decode(token + '=' * (-len(token) % 4))",
    },
  ],

  examples: [
    { title: '16 bytes → 22 characters',       code: 'import secrets\nlen(secrets.token_urlsafe(16))', returns: '22' },
    { title: 'Default: 32 bytes → 43',         code: 'import secrets\nlen(secrets.token_urlsafe())', returns: '43' },
    { title: 'URL-safe alphabet only',         code: "import secrets, string\nset(secrets.token_urlsafe(64)) <= set(string.ascii_letters + string.digits + '-_')", returns: 'True' },
    { title: 'No padding',                     code: "import secrets\n'=' in secrets.token_urlsafe(16)", returns: 'False' },
    { title: 'Multiples of 3 bytes come out even', code: 'import secrets\n[len(secrets.token_urlsafe(n)) for n in (3, 9, 24)]', returns: '[4, 12, 32]' },
    { title: 'Decode with the padding restored', code: "import base64, secrets\nt = secrets.token_urlsafe(16)\nlen(base64.urlsafe_b64decode(t + '=' * (-len(t) % 4)))", returns: '16' },
    { title: 'A float is not a count',         code: 'import secrets\nsecrets.token_urlsafe(1.5)', returns: "TypeError: 'float' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'Decoding a token without its padding',
      desc: 'token_urlsafe strips the = signs, and base64 refuses input whose length is not a multiple of 4.',
      wrong: { label: 'decode as is',      code: 'import base64, secrets\nbase64.urlsafe_b64decode(secrets.token_urlsafe(16))', output: 'binascii.Error: Incorrect padding' },
      fix:   { label: 'pad to a multiple of 4', code: "import base64, secrets\nt = secrets.token_urlsafe(16)\nlen(base64.urlsafe_b64decode(t + '=' * (-len(t) % 4)))", output: '16' },
    },
    {
      name: 'Passing the length you want',
      desc: 'The argument is bytes of randomness; the text is about a third longer. For a 32-character token ask for 24 bytes.',
      wrong: { label: 'token_urlsafe(32) for 32 chars', code: 'import secrets\nlen(secrets.token_urlsafe(32))', output: '43' },
      fix:   { label: 'token_urlsafe(24)',              code: 'import secrets\nlen(secrets.token_urlsafe(24))', output: '32' },
    },
    {
      name: 'Hand-rolling tokens with random.choices',
      desc: 'random is seeded and predictable: the same seed gives the same "random" token. token_urlsafe cannot be seeded or replayed.',
      wrong: { label: 'random.choices', code: "import random, string\nalphabet = string.ascii_letters + string.digits\nrandom.Random(1).choices(alphabet, k=12) == random.Random(1).choices(alphabet, k=12)", output: 'True' },
      fix:   { label: 'token_urlsafe',  code: 'import secrets\nsecrets.token_urlsafe(9) == secrets.token_urlsafe(9)', output: 'False' },
    },
  ],

  when: {
    use: [
      'Password-reset and e-mail verification links',
      'Session IDs, CSRF tokens, invitation and share codes',
      'Any secret that travels in a URL, a cookie or an HTTP header',
    ],
    avoid: [
      'Case-insensitive places (some file systems, codes read aloud) → token_hex',
      'Raw key material → token_bytes',
      'Codes people type on a keypad → randbelow for digits',
    ],
  },

  notes: {
    cpython:    "tok = token_bytes(nbytes); return base64.urlsafe_b64encode(tok).rstrip(b'=').decode('ascii') — Lib/secrets.py",
    'Length':   'ceil(4 × nbytes / 3) characters; each character carries 6 bits',
    'Alphabet': 'RFC 4648 base64url: the + and / of standard Base64 replaced by - and _. A token can start with - , which matters on command lines',
  },

  related: [
    { name: 'secrets.token_hex',      slug: 'token_hex',      when: 'Same randomness, hex digits only' },
    { name: 'secrets.token_bytes',    slug: 'token_bytes',    when: 'Same randomness as raw bytes' },
    { name: 'secrets.compare_digest', slug: 'compare_digest', when: 'Check a returned token' },
    { name: 'URL-safe Base64',        slug: 'urlsafe-b64',    when: 'The encoding behind the token', category: 'stdlib/base64' },
    { name: 'hashlib.sha256',         slug: 'sha256',         when: 'Store a hash of the token, not the token', category: 'stdlib/hashlib' },
  ],

  faq: [
    {
      q: 'How long is secrets.token_urlsafe(32)?',
      a: '43 characters. The length is ceil(4 × nbytes / 3) because Base64 turns every 3 bytes into 4 characters and the = padding is stripped: 16 bytes give 22 characters, 24 give 32, 32 give 43.',
    },
    {
      q: 'How do I generate a password reset token in Python?',
      a: 'token = secrets.token_urlsafe() and put it in the link. On the server store a hash of it (hashlib.sha256) with an expiry time, and when the link is used hash the received token and compare with secrets.compare_digest.',
    },
    {
      q: 'Why does decoding my token fail with "binascii.Error: Incorrect padding"?',
      a: "token_urlsafe removes the trailing = signs. Add them back before decoding: base64.urlsafe_b64decode(t + '=' * (-len(t) % 4)).",
    },
    {
      q: 'Which characters can appear in token_urlsafe?',
      a: 'A-Z, a-z, 0-9, - and _ — the 64 characters of Base64url. None of them needs escaping in a URL path, a query string or a cookie value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.token_urlsafe',
    meta:  'secrets.token_urlsafe',
  },

};
