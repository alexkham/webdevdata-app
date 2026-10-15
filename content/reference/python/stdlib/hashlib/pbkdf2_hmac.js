// content/reference/python/stdlib/hashlib/pbkdf2_hmac.js

export const meta = {
  slug:        'pbkdf2_hmac',
  name:        'hashlib.pbkdf2_hmac',
  signature:   'hashlib.pbkdf2_hmac(hash_name, password, salt, iterations, dklen=None)',
  blurb:       'PBKDF2 (PKCS #5 v2): stretch a password into a key with a salt and many HMAC iterations — the standard-library way to store passwords.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'hashlib.pbkdf2_hmac pbkdf2_hmac pbkdf2 python password hashing python hash password salt iterations key derivation pkcs5 pbkdf2 sha256 600000 iterations verify password django pbkdf2_sha256 iteration value must be greater than 0',
};

export const method = {
  slug:      'pbkdf2_hmac',
  name:      'hashlib.pbkdf2_hmac',
  signature: 'hashlib.pbkdf2_hmac(hash_name, password, salt, iterations, dklen=None)',
  returns:   { type: 'bytes', desc: 'The derived key, dklen bytes long (default: the digest size of hash_name, e.g. 32 for sha256).' },

  category:    'hashlib function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Deliberately slow: every guess an attacker makes costs as many HMAC computations as you chose iterations. Store the salt, the iteration count and the key; to verify, run it again with the same salt and count and compare with hmac.compare_digest.',

  covers: ['pbkdf2_hmac'],

  cheat: {
    commonCall: "hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 600_000)",
    returns:    'bytes — 32 for sha256 unless dklen says otherwise',
    replaces:   'sha256(password) or sha256(salt + password) for password storage',
    watchOut:   'Password and salt must be bytes; iterations must be large',
  },

  parameters: [
    { name: 'hash_name',  type: 'str',        required: true,  default: null,   desc: "Digest for HMAC: 'sha256' (common), 'sha512', 'sha1' (legacy). Resolved by OpenSSL, like hashlib.new." },
    { name: 'password',   type: 'bytes-like', required: true,  default: null,   desc: 'The password as bytes — password.encode(). The docs suggest limiting it to a sensible length (e.g. 1024).' },
    { name: 'salt',       type: 'bytes-like', required: true,  default: null,   desc: 'Random per-user bytes, about 16 or more, e.g. os.urandom(16). Stored next to the key.' },
    { name: 'iterations', type: 'int',        required: true,  default: null,   desc: 'Number of HMAC rounds, at least 1. As of 2022 the docs suggest hundreds of thousands for SHA-256.' },
    { name: 'dklen',      type: 'int | None', required: false, default: 'None', desc: 'Length of the derived key in bytes; None means the digest size of hash_name.' },
  ],

  modes: [
    {
      id: 'derive',
      label: 'derive a key',
      blurb: 'The derived key in hex. Change one input — algorithm, password, salt or iteration count — and the key changes completely.',
      params: [
        { name: 'hash',       type: 'str', hint: 'sha256, sha512, sha1 …', input: 'text' },
        { name: 'password',   type: 'str', hint: 'password',               input: 'text' },
        { name: 'salt',       type: 'str', hint: 'salt',                   input: 'text' },
        { name: 'iterations', type: 'int', hint: 'rounds',                 input: 'number' },
      ],
      template: 'import hashlib\nhashlib.pbkdf2_hmac({$hash}, {$password}.encode(), {$salt}.encode(), {$iterations}).hex()',
      cases: [
        { id: 'sha256', label: 'sha256 × 1000',   values: { hash: 'sha256', password: 'hunter2', salt: 'salt', iterations: '1000' } },
        { id: 'rfc',    label: 'RFC 6070 vector', values: { hash: 'sha1', password: 'password', salt: 'salt', iterations: '1' } },
        { id: 'sha512', label: 'sha512',          values: { hash: 'sha512', password: 'hunter2', salt: 'salt', iterations: '1000' } },
        { id: 'zero',   label: '0 iterations',    values: { hash: 'sha256', password: 'hunter2', salt: 'salt', iterations: '0' } },
      ],
    },
    {
      id: 'verify',
      label: 'verify a login',
      blurb: 'The stored key was derived from "hunter2". Type a login attempt: it is derived with the same salt and count, then compared in constant time.',
      params: [{ name: 'attempt', type: 'str', hint: 'password typed at login', input: 'text' }],
      template: "import hashlib, hmac\nsalt = b'per-user-salt-16'\nstored = hashlib.pbkdf2_hmac('sha256', b'hunter2', salt, 10_000)\nattempt = hashlib.pbkdf2_hmac('sha256', {$attempt}.encode(), salt, 10_000)\nhmac.compare_digest(stored, attempt)",
      cases: [
        { id: 'right', label: 'hunter2',         values: { attempt: 'hunter2' } },
        { id: 'case',  label: 'Hunter2',         values: { attempt: 'Hunter2' } },
        { id: 'space', label: 'trailing space',  values: { attempt: 'hunter2 ' } },
      ],
    },
    {
      id: 'dklen',
      label: 'key length',
      blurb: 'dklen picks the output length. A longer key starts with the shorter one — PBKDF2 computes the key in digest-sized blocks.',
      params: [{ name: 'dklen', type: 'int', hint: 'bytes', input: 'number' }],
      template: "import hashlib\nhashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1000, dklen={$dklen}).hex()",
      cases: [
        { id: 'sixteen', label: '16', values: { dklen: '16' } },
        { id: 'default', label: '32', values: { dklen: '32' } },
        { id: 'two',     label: '64', values: { dklen: '64' } },
        { id: 'zero',    label: '0',  values: { dklen: '0' } },
      ],
    },
  ],
  demoExplainer: 'The RFC 6070 case reproduces the published test vector 0c60c80f961f0e71f3a9b524af6012062fe037a6 (SHA-1, one iteration). Zero iterations are rejected. In the login tab only the exact password matches; case and a trailing space count. dklen=64 with SHA-256 needs two blocks, and its first 32 bytes equal the default 32-byte key. The live demo stops at about 90,000 SHA-256 iterations; real systems use many more (the docs\' own example uses 500,000).',

  patterns: [
    {
      name: 'Hash a new password',
      desc: 'A random salt per password; store algorithm, iterations, salt and key together.',
      code: "import base64, hashlib, os\nITERATIONS = 600_000\nsalt = os.urandom(16)\nkey = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, ITERATIONS)\nstored = f\"pbkdf2_sha256${ITERATIONS}${base64.b64encode(salt).decode()}${base64.b64encode(key).decode()}\"",
    },
    {
      name: 'Verify a login',
      desc: 'Parse the stored record, recompute, compare in constant time.',
      code: "import base64, hashlib, hmac\nalgo, iters, salt_b64, key_b64 = stored.split('$')\nkey = hashlib.pbkdf2_hmac('sha256', attempt.encode(), base64.b64decode(salt_b64), int(iters))\nok = hmac.compare_digest(key, base64.b64decode(key_b64))",
    },
    {
      name: 'Derive an encryption key from a passphrase',
      desc: 'dklen sizes the key for the cipher (32 bytes for AES-256).',
      code: "import hashlib\naes_key = hashlib.pbkdf2_hmac('sha256', passphrase.encode(), salt, 600_000, dklen=32)",
    },
  ],

  examples: [
    { title: 'RFC 6070 test vector',         code: "import hashlib\nhashlib.pbkdf2_hmac('sha1', b'password', b'salt', 1).hex()", returns: "'0c60c80f961f0e71f3a9b524af6012062fe037a6'" },
    { title: 'The same with 4096 iterations', code: "import hashlib\nhashlib.pbkdf2_hmac('sha1', b'password', b'salt', 4096).hex()", returns: "'4b007901b765489abead49d926f721d065a429c1'" },
    { title: 'The docs example (500,000)',    code: "import hashlib\nhashlib.pbkdf2_hmac('sha256', b'password', b'bad salt' * 2, 500_000).hex()", returns: "'15530bba69924174860db778f2c6f8104d3aaf9d26241840c8c4a641c8d000a9'" },
    { title: 'Default length = digest size',  code: "import hashlib\n[len(hashlib.pbkdf2_hmac(name, b'pw', b'salt', 1)) for name in ('sha1', 'sha256', 'sha512')]", returns: '[20, 32, 64]' },
    { title: 'dklen',                         code: "import hashlib\nhashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1, dklen=16).hex()", returns: "'6f4ad8c78ec365c060e648eb694ee40d'" },
    { title: 'Every iteration counts',        code: "import hashlib\nhashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1000) == hashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1001)", returns: 'False' },
    { title: 'A storable record',             code: "import hashlib, base64\nsalt = b'0123456789abcdef'\nkey = hashlib.pbkdf2_hmac('sha256', b'hunter2', salt, 600_000)\nf\"pbkdf2_sha256$600000${base64.b64encode(salt).decode()}${base64.b64encode(key).decode()}\"", returns: "'pbkdf2_sha256$600000$MDEyMzQ1Njc4OWFiY2RlZg==$UuYdjzflKURYrCIlEmAIyh4yx4R7IoIh1XTcMF9A+M4='" },
    { title: 'Iterations must be positive',   code: "import hashlib\nhashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 0)", returns: 'ValueError: iteration value must be greater than 0.' },
  ],

  pitfalls: [
    {
      name: 'Passing str for the password',
      desc: 'Like every hashlib function it needs bytes. Encode with a fixed encoding (UTF-8) so the same password always gives the same key.',
      wrong: { label: "'pw'",          code: "import hashlib\nhashlib.pbkdf2_hmac('sha256', 'pw', b'salt', 1000)", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "'pw'.encode()", code: "import hashlib\nlen(hashlib.pbkdf2_hmac('sha256', 'pw'.encode(), b'salt', 1000))", output: '32' },
    },
    {
      name: 'One salt for everybody',
      desc: 'With a shared (or empty) salt, equal passwords give equal keys, and one precomputed table attacks all users. Generate a new random salt per password with os.urandom(16) or secrets.token_bytes(16).',
      wrong: { label: 'shared salt',     code: "import hashlib\nsalt = b'app-wide-salt'\nhashlib.pbkdf2_hmac('sha256', b'hunter2', salt, 1000) == hashlib.pbkdf2_hmac('sha256', b'hunter2', salt, 1000)", output: 'True' },
      fix:   { label: 'salt per user',   code: "import hashlib\nhashlib.pbkdf2_hmac('sha256', b'hunter2', b'salt-of-alice-01', 1000) == hashlib.pbkdf2_hmac('sha256', b'hunter2', b'salt-of-bob-0002', 1000)", output: 'False' },
    },
    {
      name: 'Comparing keys with ==',
      desc: '== on bytes may stop at the first differing byte, leaking timing information. hmac.compare_digest takes the same time wherever the difference is.',
      wrong: { label: '==',                   code: "import hashlib\nk = hashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1000)\nk == hashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1000)", output: 'True' },
      fix:   { label: 'hmac.compare_digest',  code: "import hashlib, hmac\nk = hashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1000)\nhmac.compare_digest(k, hashlib.pbkdf2_hmac('sha256', b'pw', b'salt', 1000))", output: 'True' },
    },
  ],

  when: {
    use: [
      'Storing user passwords with only the standard library',
      'Turning a passphrase into a fixed-size encryption key',
      'Compatibility with PBKDF2 hashes from Django, Werkzeug and many other systems',
    ],
    avoid: [
      'When memory-hard hashing is preferred → hashlib.scrypt, or argon2 from PyPI',
      'Random API keys / tokens (they are not human-chosen) → a single sha256 or HMAC is enough',
      'Low iteration counts — 1000 was common long ago and is far too low today',
    ],
  },

  notes: {
    cpython:      "_hashlib.pbkdf2_hmac → OpenSSL's PKCS5_PBKDF2_HMAC. Since 3.12 there is no pure-Python fallback: the function exists only when Python is built with OpenSSL",
    'Exceptions': "ValueError for iterations < 1 or dklen < 1; TypeError for str password/salt; an unknown hash_name raises _hashlib.UnsupportedDigestmodError (a ValueError subclass) with OpenSSL's message",
    'Version':    'Added in 3.4',
  },

  related: [
    { name: 'hashlib.scrypt',        slug: 'scrypt',        when: 'Memory-hard alternative' },
    { name: 'hashlib.sha256',        slug: 'sha256',        when: 'The default PRF hash' },
    { name: 'secrets.token_bytes',   slug: 'token_bytes',   when: 'Generate the salt', category: 'stdlib/secrets' },
    { name: 'secrets.compare_digest', slug: 'compare_digest', when: 'Compare derived keys', category: 'stdlib/secrets' },
    { name: 'os.urandom',            slug: 'urandom',       when: 'The salt source the docs suggest', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I hash a password in Python with only the standard library?',
      a: "salt = os.urandom(16); key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 600_000). Store the salt, the iteration count and the key; never the password.",
    },
    {
      q: 'How many iterations should I use for PBKDF2?',
      a: 'As many as your login latency allows. The Python docs say that as of 2022 hundreds of thousands of SHA-256 iterations are suggested (their example uses 500,000); raise the count over time and rehash on login.',
    },
    {
      q: 'Is the salt secret?',
      a: 'No. It only has to be unique and random per password so that equal passwords give different keys and precomputed tables are useless. Store it in plain text next to the key.',
    },
    {
      q: 'Why does pbkdf2_hmac give a different result than another library?',
      a: 'Check every input: the hash name, the exact password and salt bytes (encoding, Base64 vs raw), the iteration count and dklen. PBKDF2 itself is standardised, so the same inputs give the same key everywhere.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.pbkdf2_hmac',
    meta:  'hashlib.pbkdf2_hmac',
  },

};
