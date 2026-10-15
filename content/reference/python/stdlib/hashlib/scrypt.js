// content/reference/python/stdlib/hashlib/scrypt.js

export const meta = {
  slug:        'scrypt',
  name:        'hashlib.scrypt',
  signature:   'hashlib.scrypt(password, *, salt, n, r, p, maxmem=0, dklen=64)',
  blurb:       'scrypt (RFC 7914): a memory-hard password key-derivation function — expensive in RAM as well as CPU, which makes GPU and ASIC cracking costly.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'hashlib.scrypt scrypt python scrypt password hashing memory hard kdf rfc 7914 n r p maxmem memory limit exceeded digital envelope routines n must be a power of 2 salt is required scrypt parameters 16384 8 1',
};

export const method = {
  slug:      'scrypt',
  name:      'hashlib.scrypt',
  signature: 'hashlib.scrypt(password, *, salt, n, r, p, maxmem=0, dklen=64)',
  returns:   { type: 'bytes', desc: 'The derived key, dklen bytes (64 by default).' },

  category:    'hashlib function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'n is the CPU/memory cost (a power of 2), r the block size, p the parallelism; memory use is about 128 × r × n bytes. Everything after the password is keyword-only, salt is required, and OpenSSL refuses to use more than 32 MiB unless you raise maxmem.',

  // scrypt is public (documented, hasattr(hashlib, 'scrypt')) but not in
  // hashlib.__all__, so this page claims no __all__ name
  covers: [],

  cheat: {
    commonCall: "hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)",
    returns:    'bytes, 64 by default (dklen=)',
    replaces:   'Fast hashes or low-iteration PBKDF2 for password storage',
    watchOut:   'n=2**15 with r=8 already exceeds the default 32 MiB limit: pass maxmem',
  },

  parameters: [
    { name: 'password', type: 'bytes-like', required: true,  default: null,   desc: 'The password as bytes. The only positional argument.' },
    { name: 'salt',     type: 'bytes-like', required: true,  default: null,   desc: 'Random per-password bytes, 16 or more. Keyword-only and required: omitting it raises TypeError: salt is required.' },
    { name: 'n',        type: 'int',        required: true,  default: null,   desc: 'CPU/memory cost: a power of 2 greater than 1 (16384 = 2**14 is the classic interactive setting).' },
    { name: 'r',        type: 'int',        required: true,  default: null,   desc: 'Block size factor; 8 is standard. Memory grows linearly with r.' },
    { name: 'p',        type: 'int',        required: true,  default: null,   desc: 'Parallelization factor; 1 is standard. Work grows linearly with p.' },
    { name: 'maxmem',   type: 'int',        required: false, default: '0',    desc: 'Memory limit in bytes (0 means OpenSSL\'s default of 32 MiB). At most 2**31 - 1; negative values raise ValueError.' },
    { name: 'dklen',    type: 'int',        required: false, default: '64',   desc: 'Length of the derived key in bytes, from 1 to 2**31 - 1.' },
  ],

  modes: [
    {
      id: 'derive',
      label: 'derive a key',
      blurb: 'Derive a key with your own cost parameters. The browser demo allows n × r × p up to 2**17; Python has no such cap.',
      params: [
        { name: 'password', type: 'str', hint: 'password',     input: 'text' },
        { name: 'salt',     type: 'str', hint: 'salt',         input: 'text' },
        { name: 'n',        type: 'int', hint: 'power of 2',   input: 'number' },
        { name: 'r',        type: 'int', hint: 'block size',   input: 'number' },
        { name: 'p',        type: 'int', hint: 'parallelism',  input: 'number' },
        { name: 'dklen',    type: 'int', hint: 'key bytes',    input: 'number' },
      ],
      template: 'import hashlib\nhashlib.scrypt({$password}.encode(), salt={$salt}.encode(), n={$n}, r={$r}, p={$p}, dklen={$dklen}).hex()',
      cases: [
        { id: 'interactive', label: 'n=2**14, r=8',     values: { password: 'hunter2', salt: '0123456789abcdef', n: '16384', r: '8', p: '1', dklen: '32' } },
        { id: 'rfc1',        label: 'RFC 7914 vector 1', values: { password: '', salt: '', n: '16', r: '1', p: '1', dklen: '64' } },
        { id: 'rfc2',        label: 'RFC 7914 vector 2', values: { password: 'password', salt: 'NaCl', n: '1024', r: '8', p: '16', dklen: '64' } },
        { id: 'notpow',      label: 'n=1000',            values: { password: 'hunter2', salt: 'salt', n: '1000', r: '8', p: '1', dklen: '32' } },
        { id: 'memory',      label: 'n=2**15, r=8',      values: { password: 'hunter2', salt: 'salt', n: '32768', r: '8', p: '1', dklen: '32' } },
      ],
    },
  ],
  demoExplainer: 'The two RFC 7914 cases reproduce the published test vectors (the first starts 77d65762…). n must be a power of 2, so 1000 is refused. n=2**15 with r=8 needs just over 32 MiB — 128 × 8 × (32768 + 2) bytes plus a small buffer — and OpenSSL\'s default limit rejects it with "memory limit exceeded"; in Python you would pass maxmem=64 * 1024 * 1024.',

  patterns: [
    {
      name: 'Hash a new password',
      desc: 'Store n, r, p, the salt and the key together.',
      code: "import hashlib, os\nsalt = os.urandom(16)\nkey = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32)",
    },
    {
      name: 'Higher cost with an explicit memory limit',
      desc: 'n=2**17, r=8 needs about 128 MiB.',
      code: "import hashlib\nkey = hashlib.scrypt(pw, salt=salt, n=2**17, r=8, p=1, maxmem=256 * 1024 * 1024, dklen=32)",
    },
    {
      name: 'Verify',
      desc: 'Recompute with the stored parameters and compare in constant time.',
      code: "import hashlib, hmac\nok = hmac.compare_digest(hashlib.scrypt(attempt.encode(), salt=salt, n=n, r=r, p=p, dklen=len(key)), key)",
    },
  ],

  examples: [
    { title: 'RFC 7914 test vector 1',   code: "import hashlib\nhashlib.scrypt(b'', salt=b'', n=16, r=1, p=1, dklen=64).hex()", returns: "'77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906'" },
    { title: 'RFC 7914 test vector 2 (start)', code: "import hashlib\nhashlib.scrypt(b'password', salt=b'NaCl', n=1024, r=8, p=16, dklen=64).hex()[:32]", returns: "'fdbabe1c9d3472007856e7190d01e9fe'" },
    { title: 'Default dklen is 64',      code: "import hashlib\nlen(hashlib.scrypt(b'hunter2', salt=b'0123456789abcdef', n=2**14, r=8, p=1))", returns: '64' },
    { title: 'n must be a power of 2',   code: "import hashlib\nhashlib.scrypt(b'pw', salt=b'salt', n=1000, r=8, p=1)", returns: 'ValueError: n must be a power of 2.' },
    { title: 'salt is required',         code: "import hashlib\nhashlib.scrypt(b'pw', n=16384, r=8, p=1)", returns: 'TypeError: salt is required' },
    { title: 'Public, but not in __all__', code: "import hashlib\n('scrypt' in hashlib.__all__, hasattr(hashlib, 'scrypt'))", returns: '(False, True)' },
  ],

  pitfalls: [
    {
      name: 'Hitting the 32 MiB default limit',
      desc: 'Memory is about 128 × r × (n + 2) bytes. With r=8, n=2**15 just crosses 32 MiB and OpenSSL refuses; raise maxmem.',
      wrong: { label: 'n=2**15, r=8',          code: "import hashlib\nhashlib.scrypt(b'hunter2', salt=b'0123456789abcdef', n=2**15, r=8, p=1)", output: 'ValueError: [digital envelope routines] memory limit exceeded' },
      fix:   { label: 'maxmem=64 MiB',          code: "import hashlib\nlen(hashlib.scrypt(b'hunter2', salt=b'0123456789abcdef', n=2**15, r=8, p=1, maxmem=64 * 1024 * 1024))", output: '64' },
    },
    {
      name: 'Passing the parameters positionally',
      desc: 'Only the password is positional; salt, n, r and p must be named.',
      wrong: { label: 'scrypt(pw, salt, n, r, p)', code: "import hashlib\nhashlib.scrypt(b'hunter2', b'salt', 16384, 8, 1)", output: 'TypeError: scrypt() takes exactly 1 positional argument (5 given)' },
      fix:   { label: 'keywords',                  code: "import hashlib\nlen(hashlib.scrypt(b'hunter2', salt=b'salt', n=16384, r=8, p=1, dklen=32))", output: '32' },
    },
  ],

  when: {
    use: [
      'Password storage when you want memory-hardness without third-party packages',
      'Deriving encryption keys from passphrases',
    ],
    avoid: [
      'Python builds without OpenSSL (scrypt is only defined when OpenSSL provides it)',
      'Very constrained servers: each hash needs the full n × r × 128 bytes of RAM',
      'Interop with systems that store PBKDF2 hashes → pbkdf2_hmac',
    ],
  },

  notes: {
    cpython:      "_hashlib.scrypt → OpenSSL's EVP_PBE_scrypt. Lib/hashlib.py imports it in a try block and does not add it to __all__",
    'Errors':     'ValueError: n must be a power of 2. / Invalid parameter combination for n, r, p, maxmem. (r or p of 0) / [digital envelope routines] memory limit exceeded — the last text comes from OpenSSL and may differ between OpenSSL versions',
    'Memory':     'Roughly 128 × r × (n + 2) + 128 × r × p bytes; the default cap is 32 MiB (the docs: "OpenSSL 1.1.0 defaults to 32 MiB")',
  },

  related: [
    { name: 'hashlib.pbkdf2_hmac',    slug: 'pbkdf2_hmac',    when: 'The CPU-only, widely compatible KDF' },
    { name: 'secrets.token_bytes',    slug: 'token_bytes',    when: 'Generate the salt', category: 'stdlib/secrets' },
    { name: 'secrets.compare_digest', slug: 'compare_digest', when: 'Compare keys at login', category: 'stdlib/secrets' },
    { name: 'MemoryError',            slug: 'memoryerror',    when: 'Not what a too-high n raises: it is a ValueError', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What scrypt parameters should I use in Python?',
      a: 'A common baseline is n=2**14, r=8, p=1 (about 16 MiB). Higher n is stronger but slower and needs more memory; above n=2**14 with r=8 you must also raise maxmem.',
    },
    {
      q: 'What does "ValueError: [digital envelope routines] memory limit exceeded" mean?',
      a: 'The parameters need more memory than maxmem allows (32 MiB by default) — or n is too large for r (with r=1, n must stay below 2**16). Pass a larger maxmem, e.g. maxmem=128 * 1024 * 1024, or lower n.',
    },
    {
      q: 'scrypt or pbkdf2_hmac?',
      a: 'scrypt resists GPU cracking better because it also costs memory. PBKDF2 is more widely supported and FIPS-approved. Both beat a plain hash by far; argon2 (PyPI) is the modern recommendation.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.scrypt',
    meta:  'hashlib.scrypt',
  },

};
