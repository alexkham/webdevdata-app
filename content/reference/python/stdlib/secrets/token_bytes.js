// content/reference/python/stdlib/secrets/token_bytes.js

export const meta = {
  slug:        'token_bytes',
  name:        'secrets.token_bytes',
  signature:   'secrets.token_bytes(nbytes=None)',
  blurb:       'nbytes cryptographically secure random bytes — for salts, keys and nonces. None means DEFAULT_ENTROPY (32 bytes).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.token_bytes token_bytes python random bytes secure random bytes generate key generate salt nonce os.urandom DEFAULT_ENTROPY secrets.DEFAULT_ENTROPY 32 bytes negative argument not allowed',
};

export const method = {
  slug:      'token_bytes',
  name:      'secrets.token_bytes',
  signature: 'secrets.token_bytes(nbytes=None)',
  returns:   { type: 'bytes', desc: 'nbytes random bytes from the operating system (different on every call).' },

  category:    'secrets function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'The raw form of a secret: bytes, not text. Use it where bytes are wanted — a salt for pbkdf2_hmac, a key for hmac or blake2b, a nonce for a cipher — and token_hex / token_urlsafe when the secret has to travel as text.',

  covers: ['token_bytes'],

  cheat: {
    commonCall: 'secrets.token_bytes(16)',
    returns:    "bytes of length 16, e.g. b'\\xebr\\x17D…' (different every time)",
    replaces:   'os.urandom(n) — same source, clearer intent',
    watchOut:   'bytes, not str: hex() or Base64 them before putting them in JSON or URLs',
  },

  parameters: [
    { name: 'nbytes', type: 'int | None', required: false, default: 'None', desc: 'Number of random bytes. None (or no argument) uses secrets.DEFAULT_ENTROPY, which is 32 in CPython 3.13 and may change between releases. Negative raises ValueError; a float raises TypeError.' },
  ],

  modes: [
    {
      id: 'size',
      label: 'type and size',
      blurb: 'The bytes themselves change on every run; their type and count do not. Leave nbytes empty for None.',
      params: [{ name: 'nbytes', type: 'int | None', hint: 'bytes', input: 'number-or-none' }],
      template: 'import secrets\nt = secrets.token_bytes({$nbytes})\n(type(t).__name__, len(t))',
      cases: [
        { id: 'sixteen', label: '16',   values: { nbytes: '16' } },
        { id: 'default', label: 'None', values: { nbytes: '' } },
        { id: 'zero',    label: '0',    values: { nbytes: '0' } },
        { id: 'neg',     label: '-5',   values: { nbytes: '-5' } },
      ],
    },
    {
      id: 'salt',
      label: 'as a salt',
      blurb: 'A fresh random salt for password hashing: the derived key length does not depend on the salt length.',
      params: [{ name: 'nbytes', type: 'int', hint: 'salt bytes', input: 'number' }],
      template: "import hashlib, secrets\nsalt = secrets.token_bytes({$nbytes})\nkey = hashlib.pbkdf2_hmac('sha256', b'hunter2', salt, 1000)\n(len(salt), len(key))",
      cases: [
        { id: 'sixteen', label: '16 bytes', values: { nbytes: '16' } },
        { id: 'big',     label: '64 bytes', values: { nbytes: '64' } },
        { id: 'none',    label: 'no salt',  values: { nbytes: '0' } },
      ],
    },
  ],
  demoExplainer: 'token_bytes always returns bytes of exactly nbytes; None falls back to DEFAULT_ENTROPY, 32. Zero gives b\'\' and a negative count raises ValueError: negative argument not allowed (the message comes from os.urandom). In the salt tab the key stays 32 bytes (SHA-256) whatever the salt length — and a zero-length salt is allowed, though it defeats the purpose.',

  patterns: [
    {
      name: 'Salt for password hashing',
      desc: '16 random bytes per password, stored next to the hash.',
      code: "import hashlib, secrets\nsalt = secrets.token_bytes(16)\nkey = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 600_000)",
    },
    {
      name: 'HMAC or BLAKE2 key',
      desc: 'A 32-byte key, kept secret on the server.',
      code: "import secrets\nSIGNING_KEY = secrets.token_bytes(32)",
    },
    {
      name: 'Store bytes as text',
      desc: 'Hex or Base64 for config files and databases.',
      code: "import base64, secrets\nkey = secrets.token_bytes(32)\nkey_hex = key.hex()\nkey_b64 = base64.b64encode(key).decode()",
    },
  ],

  examples: [
    { title: 'bytes of the requested length', code: 'import secrets\nt = secrets.token_bytes(16)\n(type(t).__name__, len(t))', returns: "('bytes', 16)" },
    { title: 'DEFAULT_ENTROPY',               code: 'import secrets\nsecrets.DEFAULT_ENTROPY', returns: '32' },
    { title: 'No argument → 32 bytes',        code: 'import secrets\nlen(secrets.token_bytes())', returns: '32' },
    { title: 'Zero bytes',                    code: 'import secrets\nsecrets.token_bytes(0)', returns: "b''" },
    { title: 'Each item is a byte value',     code: 'import secrets\nsecrets.token_bytes(8)[0] in range(256)', returns: 'True' },
    { title: 'A salt for pbkdf2_hmac',        code: "import hashlib, secrets\nsalt = secrets.token_bytes(16)\nlen(hashlib.pbkdf2_hmac('sha256', b'hunter2', salt, 1000))", returns: '32' },
    { title: 'A float is not a count',        code: 'import secrets\nsecrets.token_bytes(16.0)', returns: "TypeError: 'float' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'Putting the bytes into text directly',
      desc: 'str() of bytes is the repr, b\'…\' and escapes included — not something you can store and read back reliably. Encode the bytes as hex (or use token_hex directly).',
      wrong: { label: 'str(bytes)', code: "import secrets\nt = secrets.token_bytes(4)\nstr(t)[:2] in (\"b'\", 'b\"')", output: 'True' },
      fix:   { label: '.hex()',     code: 'import secrets\nlen(secrets.token_bytes(4).hex())', output: '8' },
    },
    {
      name: 'Passing a length from user input unchecked',
      desc: 'A negative count fails, and a huge one allocates that many bytes. Validate the number first.',
      wrong: { label: 'token_bytes(-5)',  code: 'import secrets\nsecrets.token_bytes(-5)', output: 'ValueError: negative argument not allowed' },
      fix:   { label: 'clamp the length', code: 'import secrets\nn = max(16, min(-5, 64))\nlen(secrets.token_bytes(n))', output: '16' },
    },
  ],

  when: {
    use: [
      'Salts, keys, nonces and other secrets consumed as bytes',
      'Seeding your own derivations (HKDF, BLAKE2 person/key)',
    ],
    avoid: [
      'Secrets that travel as text → token_hex or token_urlsafe',
      'Reproducible test data → random.Random(seed).randbytes(n)',
    ],
  },

  notes: {
    cpython:      'nbytes = DEFAULT_ENTROPY if nbytes is None; return SystemRandom().randbytes(nbytes), which is os.urandom(nbytes)',
    'DEFAULT_ENTROPY': 'secrets.DEFAULT_ENTROPY is 32 in CPython 3.13; the docs say it may change at any time, including in maintenance releases. It is public but not in __all__',
    'Exceptions': 'ValueError: negative argument not allowed for negative counts; TypeError for non-integers',
  },

  related: [
    { name: 'secrets.token_hex',      slug: 'token_hex',      when: 'The same randomness as hex text' },
    { name: 'secrets.token_urlsafe',  slug: 'token_urlsafe',  when: 'The same randomness as URL-safe text' },
    { name: 'hashlib.pbkdf2_hmac',    slug: 'pbkdf2_hmac',    when: 'Where a random salt goes', category: 'stdlib/hashlib' },
    { name: 'os.urandom',             slug: 'urandom',        when: 'The function underneath', category: 'stdlib/os' },
    { name: 'random.getrandbits / randbytes', slug: 'getrandbits-randbytes', when: 'Seeded, reproducible bytes (not secret)', category: 'stdlib/random' },
  ],

  faq: [
    {
      q: 'What is the difference between secrets.token_bytes and os.urandom?',
      a: 'None in output: token_bytes(n) returns os.urandom(n) bytes. It adds a default length (DEFAULT_ENTROPY) and states the intent — this value is a secret.',
    },
    {
      q: 'How many bytes should a key or salt have?',
      a: '16 bytes is a common salt size (the hashlib docs suggest about 16 or more); 32 bytes for keys and long-lived tokens, which is also the DEFAULT_ENTROPY default.',
    },
    {
      q: 'What is secrets.DEFAULT_ENTROPY?',
      a: 'The number of random bytes token_bytes, token_hex and token_urlsafe use when called without an argument — 32 in current CPython. The docs say it may change at any time, even in a maintenance release.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.token_bytes',
    meta:  'secrets.token_bytes',
  },

};
