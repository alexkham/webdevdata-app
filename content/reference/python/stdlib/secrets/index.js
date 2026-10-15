// content/reference/python/stdlib/secrets/index.js — the secrets module hub

export const meta = {
  slug:        'index',
  name:        'secrets',
  signature:   'import secrets',
  blurb:       'Cryptographically strong randomness for passwords, tokens and keys: token_hex, token_urlsafe, token_bytes, choice, randbelow, randbits — plus compare_digest.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets module python generate secure random token password reset token api key generator secrets vs random cryptographically secure random token_hex token_urlsafe token_bytes compare_digest randbelow choice os.urandom csprng',
};

export const method = {
  slug: 'index',
  name: 'secrets',

  category:    'Data formats',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'The random module is built for simulations: seedable, reproducible and therefore predictable. secrets draws from the operating system\'s secure source (os.urandom) and cannot be seeded — use it, not random, for passwords, tokens, salts and anything else an attacker must not guess.',

  imports: ['import secrets', 'from secrets import token_urlsafe, compare_digest'],
  facts: [
    { label: 'Public API', value: 'token_bytes, token_hex, token_urlsafe, choice, randbelow, randbits, SystemRandom, compare_digest (plus DEFAULT_ENTROPY)' },
    { label: 'Source',     value: 'os.urandom via random.SystemRandom: getrandom() / /dev/urandom on Linux, BCryptGenRandom on Windows' },
    { label: 'Defaults',   value: 'DEFAULT_ENTROPY = 32 bytes for token_* called without an argument (CPython 3.13)' },
    { label: 'Origin',     value: 'PEP 506, added in Python 3.6' },
  ],

  modes: [
    {
      id: 'tokens',
      label: 'token lengths',
      blurb: 'The values are new on every run, but their lengths are fixed by n: n bytes, 2n hex digits, about 1.33n URL-safe characters. Leave n empty for None.',
      params: [{ name: 'n', type: 'int | None', hint: 'bytes of randomness', input: 'number-or-none' }],
      template: 'import secrets\nn = {$n}\n[len(secrets.token_bytes(n)), len(secrets.token_hex(n)), len(secrets.token_urlsafe(n))]',
      cases: [
        { id: 'sixteen', label: '16',   values: { n: '16' } },
        { id: 'default', label: 'None', values: { n: '' } },
        { id: 'five',    label: '5',    values: { n: '5' } },
        { id: 'zero',    label: '0',    values: { n: '0' } },
        { id: 'neg',     label: '-1',   values: { n: '-1' } },
      ],
    },
    {
      id: 'predictable',
      label: 'why not random',
      blurb: 'random with a known seed: these "random" six-digit codes are the same on every machine, every time. An attacker who learns the seed or enough outputs can predict the rest. secrets has no seed.',
      params: [{ name: 'seed', type: 'int', hint: 'any seed', input: 'number' }],
      template: 'import random\nrng = random.Random({$seed})\n[rng.randint(0, 999_999) for _ in range(3)]',
      cases: [
        { id: 's42',  label: '42',   values: { seed: '42' } },
        { id: 's2024', label: '2024', values: { seed: '2024' } },
        { id: 's0',   label: '0',    values: { seed: '0' } },
      ],
    },
    {
      id: 'compare',
      label: 'compare_digest',
      blurb: 'Constant-time equality for tokens and signatures: str (ASCII only) or bytes on both sides.',
      params: [
        { name: 'a', type: 'str', hint: 'expected', input: 'text' },
        { name: 'b', type: 'str', hint: 'received', input: 'text' },
      ],
      template: 'import secrets\nsecrets.compare_digest({$a}, {$b})',
      cases: [
        { id: 'same',  label: 'equal',     values: { a: 'f9bf78b9a18ce6d4', b: 'f9bf78b9a18ce6d4' } },
        { id: 'diff',  label: 'different', values: { a: 'f9bf78b9a18ce6d4', b: 'f9bf78b9a18ce6d5' } },
        { id: 'short', label: 'shorter',   values: { a: 'f9bf78b9a18ce6d4', b: 'f9bf' } },
        { id: 'utf8',  label: 'non-ASCII', values: { a: 'café', b: 'café' } },
      ],
    },
  ],
  demoExplainer: 'With n = 16 you get 16 bytes, 32 hex digits and 22 URL-safe characters; None means DEFAULT_ENTROPY, 32 bytes → [32, 64, 43]. A negative n raises ValueError: negative argument not allowed. Seed 42 always yields [670487, 116739, 26225] from random — fine for a simulation, fatal for a password reset code. compare_digest refuses non-ASCII str; encode both sides to bytes for that.',

  patterns: [
    {
      name: 'Password-reset or session token',
      desc: 'URL-safe, 32 bytes of randomness by default.',
      code: "import secrets\ntoken = secrets.token_urlsafe()\nreset_url = f'https://example.com/reset?token={token}'",
    },
    {
      name: 'API key with a prefix',
      desc: 'A recognisable prefix plus hex randomness.',
      code: "import secrets\napi_key = 'sk_live_' + secrets.token_hex(24)",
    },
    {
      name: 'Random password',
      desc: 'Pick each character with secrets.choice (from the docs\' recipes).',
      code: "import secrets, string\nalphabet = string.ascii_letters + string.digits\npassword = ''.join(secrets.choice(alphabet) for _ in range(16))",
    },
    {
      name: 'Six-digit one-time code',
      desc: 'randbelow gives a uniform int; zero-pad it.',
      code: "import secrets\ncode = f'{secrets.randbelow(10**6):06d}'",
    },
    {
      name: 'Check a submitted token',
      desc: 'Constant-time comparison.',
      code: "import secrets\nif not secrets.compare_digest(submitted, stored_token):\n    raise PermissionError('invalid token')",
    },
  ],

  examples: [
    { title: 'Token lengths for 16 bytes',  code: 'import secrets\n[len(secrets.token_bytes(16)), len(secrets.token_hex(16)), len(secrets.token_urlsafe(16))]', returns: '[16, 32, 22]' },
    { title: 'The default: 32 bytes',       code: 'import secrets\n(secrets.DEFAULT_ENTROPY, len(secrets.token_bytes()), len(secrets.token_hex()), len(secrets.token_urlsafe()))', returns: '(32, 32, 64, 43)' },
    { title: 'Never the same twice',        code: 'import secrets\nsecrets.token_hex(16) == secrets.token_hex(16)', returns: 'False' },
    { title: 'randbelow stays in range',    code: 'import secrets\nall(0 <= secrets.randbelow(6) < 6 for _ in range(1000))', returns: 'True' },
    { title: 'A random password',           code: "import secrets, string\npw = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))\n(len(pw), pw.isalnum())", returns: '(12, True)' },
    { title: 'Constant-time comparison',    code: "import secrets\nsecrets.compare_digest('abc123', 'abc123')", returns: 'True' },
    { title: 'SystemRandom is random\'s',   code: 'import random, secrets\nsecrets.SystemRandom is random.SystemRandom', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Using random for tokens',
      desc: 'random is a Mersenne Twister: seed it the same way and you get the same "secrets". secrets cannot be seeded, so its tokens are unpredictable.',
      wrong: { label: 'random.Random(42)', code: 'import random\nrng = random.Random(42)\n[rng.randint(0, 999_999) for _ in range(3)]', output: '[670487, 116739, 26225]' },
      fix:   { label: 'secrets.randbelow', code: 'import secrets\nall(0 <= secrets.randbelow(10**6) < 10**6 for _ in range(3))', output: 'True' },
    },
    {
      name: 'Comparing tokens with ==',
      desc: '== can return as soon as one character differs, so response times leak how much of a guess was right. compare_digest takes the same time either way.',
      wrong: { label: '==',             code: "import secrets\nexpected = 'f9bf78b9a18ce6d4'\nexpected == 'f9bf78b9a18ce6d4'", output: 'True' },
      fix:   { label: 'compare_digest', code: "import secrets\nexpected = 'f9bf78b9a18ce6d4'\nsecrets.compare_digest(expected, 'f9bf78b9a18ce6d4')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Password-reset links, session IDs, API keys, CSRF tokens, invitation codes',
      'Salts and keys for hashlib, hmac and encryption libraries',
      'Random passwords, PINs and one-time codes',
    ],
    avoid: [
      'Simulations, games, sampling and tests that must be reproducible → random with a seed',
      'Unique IDs that need no secrecy → uuid.uuid4()',
      'Encryption itself → a crypto library (secrets only makes the random keys)',
    ],
  },

  notes: {
    cpython:       'Lib/secrets.py is tiny: SystemRandom from random, compare_digest from hmac, choice / randbits bound to one SystemRandom instance, randbelow on its _randbelow, and three token helpers on SystemRandom.randbytes (os.urandom)',
    'Entropy':     'The docs: 32 bytes (256 bits) was believed sufficient as of 2015; DEFAULT_ENTROPY may change in any release, so pass n explicitly if a length must not change',
    'Not in __all__': 'DEFAULT_ENTROPY is public and documented but not listed in secrets.__all__',
  },

  related: [
    { name: 'secrets.token_urlsafe',  slug: 'token_urlsafe',  when: 'Tokens for URLs and cookies' },
    { name: 'secrets.compare_digest', slug: 'compare_digest', when: 'Check tokens and signatures' },
    { name: 'random module',          slug: 'random',         when: 'Reproducible randomness for simulations', category: 'stdlib' },
    { name: 'hashlib module',         slug: 'hashlib',        when: 'Hash and derive keys from what secrets generates', category: 'stdlib' },
    { name: 'os.urandom',             slug: 'urandom',        when: 'The byte source underneath', category: 'stdlib/os' },
    { name: 'uuid.uuid4',             slug: 'uuid4',          when: 'Random IDs (122 random bits)', category: 'stdlib/uuid' },
  ],

  faq: [
    {
      q: 'What is the difference between secrets and random in Python?',
      a: 'random uses a seedable Mersenne Twister: fast and reproducible, but predictable from its outputs. secrets uses the operating system\'s cryptographic generator via os.urandom and has no seed. Use secrets for anything security-related.',
    },
    {
      q: 'How do I generate a secure random token in Python?',
      a: 'secrets.token_urlsafe() for URLs and cookies, secrets.token_hex() for hex strings, secrets.token_bytes() for raw bytes. Without an argument each uses 32 random bytes.',
    },
    {
      q: 'How many bytes should a token have?',
      a: 'The docs say 32 bytes (256 bits) was considered sufficient as of 2015 for typical uses; that is the default. 16 bytes (128 bits) is still far beyond brute force for short-lived tokens.',
    },
    {
      q: 'Is secrets available in Python 2 or before 3.6?',
      a: 'No, it was added in 3.6 (PEP 506). On older versions use os.urandom with binascii.hexlify or base64.urlsafe_b64encode, or random.SystemRandom().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html',
    meta:  'secrets — Generate secure random numbers for managing secrets',
  },

};
