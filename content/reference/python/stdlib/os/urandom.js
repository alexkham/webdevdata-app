// content/reference/python/stdlib/os/urandom.js

export const meta = {
  slug:        'urandom',
  name:        'os.urandom',
  signature:   'os.urandom(size, /)',
  blurb:       'Return size random bytes from the operating system, suitable for cryptographic use. os.getrandom() is the Linux-only syscall wrapper with GRND_NONBLOCK / GRND_RANDOM flags; the secrets module is the friendly front end.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (getrandom 3.6+)',
  searchTerms: 'os.urandom urandom random bytes cryptographically secure python secure random token os.getrandom getrandom GRND_NONBLOCK GRND_RANDOM os.GRND_NONBLOCK os.GRND_RANDOM /dev/urandom BCryptGenRandom secrets token_bytes token_hex token_urlsafe SystemRandom csprng salt key generation',
};

export const method = {
  slug:      'urandom',
  name:      'os.urandom',
  signature: 'os.urandom(size, /)',
  returns:   { type: 'bytes', desc: 'Exactly size bytes from the OS randomness source.' },

  category:    'os function',
  version:     'Python 3.0+ (getrandom 3.6+)',
  hasLiveDemo: false,

  subtitle: 'The OS cryptographic random source as bytes: /dev/urandom or the getrandom() syscall on Linux, BCryptGenRandom() on Windows. Available everywhere; os.getrandom() and its GRND_* flags are Linux only (Linux 3.17+). For tokens and passwords use the secrets module, which is built on the same source.',

  covers: ['urandom', 'getrandom', 'GRND_NONBLOCK', 'GRND_RANDOM'],

  cheat: {
    commonCall: 'os.urandom(16)',
    returns:    'bytes of length 16, different on every call',
    replaces:   'random.getrandbits / random.randbytes for anything secret',
    watchOut:   'It returns bytes, not text: use .hex() or secrets.token_hex()',
  },

  parameters: [
    { name: 'size',  type: 'int', required: true,  default: null, desc: 'Number of bytes. 0 gives b"", a negative size raises ValueError.' },
    { name: 'flags', type: 'int', required: false, default: '0',  desc: 'os.getrandom() only: GRND_NONBLOCK (raise BlockingIOError instead of blocking) and/or GRND_RANDOM (read from the /dev/random pool), OR-ed together.' },
  ],

  patterns: [
    {
      name: 'A random key or salt',
      desc: 'Bytes straight from the OS, the input that hashlib.pbkdf2_hmac and friends expect.',
      code: "import hashlib, os\nsalt = os.urandom(16)\nkey = hashlib.pbkdf2_hmac('sha256', b'password', salt, 600_000)",
    },
    {
      name: 'Text tokens with secrets',
      desc: 'secrets turns the same OS randomness into hex or URL-safe text.',
      code: 'import secrets\nreset_token = secrets.token_urlsafe(32)\napi_key = secrets.token_hex(20)',
    },
    {
      name: 'Non-blocking read on Linux',
      desc: 'GRND_NONBLOCK makes getrandom raise BlockingIOError instead of waiting for the entropy pool at early boot.',
      code: "import os\ntry:\n    seed = os.getrandom(32, os.GRND_NONBLOCK)\nexcept BlockingIOError:\n    seed = None  # pool not initialised yet",
    },
  ],

  examples: [
    { title: 'bytes of the requested length', code: 'import os\nb = os.urandom(16)\n(type(b).__name__, len(b))', returns: "('bytes', 16)" },
    { title: 'Zero bytes is allowed',          code: 'import os\nos.urandom(0)', returns: "b''" },
    { title: 'Two calls differ',               code: 'import os\nos.urandom(8) == os.urandom(8)', returns: 'False' },
    { title: 'As an unsigned integer',          code: "import os\nint.from_bytes(os.urandom(4), 'big') < 2**32", returns: 'True' },
    { title: 'secrets: 16 bytes as 32 hex characters', code: 'import secrets\nlen(secrets.token_hex(16))', returns: '32' },
    { title: 'secrets: URL-safe text token',     code: 'import secrets\nt = secrets.token_urlsafe(32)\n(type(t).__name__, len(t))', returns: "('str', 43)" },
    { title: 'Negative size',                    code: 'import os\nos.urandom(-1)', returns: 'ValueError: negative argument not allowed' },
  ],

  pitfalls: [
    {
      name: 'Using the random module for secrets',
      desc: 'random is a seeded Mersenne Twister: anyone who learns or guesses the seed reproduces every value. Tokens, salts and keys must come from os.urandom / secrets.',
      wrong: { label: 'random.Random', code: 'import random\nrandom.Random(1).randbytes(8) == random.Random(1).randbytes(8)', output: 'True' },
      fix:   { label: 'secrets / os.urandom', code: 'import secrets\nsecrets.token_bytes(8) == secrets.token_bytes(8)', output: 'False' },
    },
    {
      name: 'Turning the bytes into text with str()',
      desc: 'str() of bytes gives the repr with b and escapes, not a usable token. Encode with .hex() or base64, or use secrets.token_hex directly.',
      wrong: { label: 'str(bytes)', code: "str(b'\\x00\\xff')", output: "\"b'\\\\x00\\\\xff'\"" },
      fix:   { label: '.hex()', code: "b'\\x00\\xff'.hex()", output: "'00ff'" },
    },
    {
      name: 'Passing a float size',
      desc: 'size must be an int; compute it with // or int() first.',
      wrong: { label: 'bits / 8', code: 'import os\nos.urandom(20 / 8)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'bits // 8', code: 'import os\nlen(os.urandom(256 // 8))', output: '32' },
    },
  ],

  when: {
    use: [
      'Keys, salts, nonces and IVs for cryptographic code',
      'Seeding your own generator from a source nobody can predict',
    ],
    avoid: [
      'Text tokens, passwords, choices from an alphabet → secrets.token_urlsafe / token_hex / secrets.choice',
      'Reproducible simulations and tests → random.Random(seed)',
      'Random numbers in a range → secrets.randbelow or random.SystemRandom',
    ],
  },

  notes: {
    cpython:      'Linux: getrandom() syscall in blocking mode (waits only until the kernel entropy pool is initialised, PEP 524); other Unix: /dev/urandom (NotImplementedError if it is missing); Windows: BCryptGenRandom() since 3.11',
    'Availability': 'urandom: Unix, Windows. getrandom and GRND_NONBLOCK / GRND_RANDOM: Linux 3.17+ only, added in 3.6 (on Linux GRND_NONBLOCK == 1 and GRND_RANDOM == 2)',
    'getrandom':  'May return fewer bytes than requested; with GRND_NONBLOCK it raises BlockingIOError instead of blocking. Reading large amounts drains the pool other users share, so prefer urandom',
    'secrets':    'secrets.token_bytes / token_hex / token_urlsafe / randbelow / choice and random.SystemRandom all draw from os.urandom',
  },

  related: [
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
    { name: 'os.cpu_count', slug: 'cpu_count', when: 'Other system information' },
    { name: 'os.environ', slug: 'environ', when: 'Read secrets from the environment instead of generating them' },
    { name: 'ValueError', slug: 'valueerror', when: 'What a negative size raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Is os.urandom cryptographically secure?',
      a: 'Yes. It reads the operating system CSPRNG (getrandom()/dev/urandom on Linux, BCryptGenRandom on Windows), which is what the docs describe as suitable for cryptographic use. The examples on this page only check lengths and types because the bytes are different on every run.',
    },
    {
      q: 'What is the difference between os.urandom and the secrets module?',
      a: 'None in randomness: secrets uses os.urandom underneath. secrets adds convenient shapes: token_hex for hex text, token_urlsafe for URL-safe text, choice and randbelow for picking values.',
    },
    {
      q: 'Why is os.getrandom missing on my machine?',
      a: 'os.getrandom, GRND_NONBLOCK and GRND_RANDOM exist only on Linux 3.17+ (Python 3.6+). On Windows and macOS they are not defined; os.urandom works on every platform.',
    },
    {
      q: 'Can os.urandom block?',
      a: 'On Linux since Python 3.6 it can wait at early boot until the kernel entropy pool is initialised, then never again. Use os.getrandom(n, os.GRND_NONBLOCK) if you must not wait; it raises BlockingIOError instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.urandom',
    meta:  'os.urandom / getrandom',
  },
};
