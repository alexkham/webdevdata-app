// content/reference/python/stdlib/hashlib/index.js — the hashlib module hub

export const meta = {
  slug:        'index',
  name:        'hashlib',
  signature:   'import hashlib',
  blurb:       'Secure hashes and message digests: MD5, SHA-1, SHA-2, SHA-3, SHAKE and BLAKE2 behind one update() / digest() interface, plus pbkdf2_hmac and scrypt for passwords.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hashlib module python hash string sha256 md5 sha1 sha512 sha3 blake2 hexdigest digest checksum file hash python hash password pbkdf2 scrypt hashlib new algorithms_guaranteed strings must be encoded before hashing',
};

export const method = {
  slug: 'index',
  name: 'hashlib',

  category:    'Data formats',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Every algorithm has the same shape: make a hash object (sha256(), md5(), new(name)), feed it bytes with update(), read digest() or hexdigest(). Hashes take bytes, not str — and a plain hash is not password storage: that is what pbkdf2_hmac and scrypt are for.',

  imports: ['import hashlib', 'from hashlib import sha256'],
  // hash objects of these two classes define update/digest/hexdigest/copy,
  // name/digest_size/block_size and the BLAKE2 size constants themselves
  coverClasses: ['blake2b', 'blake2s'],
  facts: [
    { label: 'Public API',  value: 'md5, sha1, sha224/256/384/512, sha3_*, shake_128/256, blake2b/blake2s, new, file_digest, pbkdf2_hmac, scrypt, algorithms_guaranteed, algorithms_available' },
    { label: 'Hash object', value: 'update(data) · digest() · hexdigest() · copy() · name · digest_size · block_size' },
    { label: 'Backends',    value: 'OpenSSL when available; HACL* fallbacks for MD5, SHA-1, SHA-2 and SHA-3 since 3.12; BLAKE2 built in' },
    { label: 'Specs',       value: 'FIPS 180-4 (SHA-1, SHA-2), FIPS 202 (SHA-3, SHAKE), RFC 1321 (MD5), RFC 7693 (BLAKE2), RFC 8018 (PBKDF2), RFC 7914 (scrypt)' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'three digests',
      blurb: 'The same text through MD5, SHA-1 and SHA-256. Each produces a fixed-length fingerprint, whatever the input length.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "import hashlib\ndata = {$text}.encode()\n{name: hashlib.new(name, data).hexdigest() for name in ['md5', 'sha1', 'sha256']}",
      cases: [
        { id: 'hello', label: 'hello',     values: { text: 'hello' } },
        { id: 'empty', label: 'empty',     values: { text: '' } },
        { id: 'utf8',  label: 'non-ASCII', values: { text: 'Zoë' } },
        { id: 'fox',   label: 'long text', values: { text: 'The quick brown fox jumps over the lazy dog' } },
      ],
    },
    {
      id: 'avalanche',
      label: 'one character apart',
      blurb: 'Change one character and almost every hex digit of the SHA-256 digest changes. The third value counts the positions (out of 64) that differ.',
      params: [
        { name: 'a', type: 'str', hint: 'first text',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second text', input: 'text' },
      ],
      template: 'import hashlib\na = hashlib.sha256({$a}.encode()).hexdigest()\nb = hashlib.sha256({$b}.encode()).hexdigest()\n(a[:16], b[:16], sum(x != y for x, y in zip(a, b)))',
      cases: [
        { id: 'letter', label: 'hello / hellp', values: { a: 'hello', b: 'hellp' } },
        { id: 'case',   label: 'hello / Hello', values: { a: 'hello', b: 'Hello' } },
        { id: 'same',   label: 'identical',     values: { a: 'same', b: 'same' } },
      ],
    },
    {
      id: 'sizes',
      label: 'sizes',
      blurb: 'Any algorithm by name: its canonical name, digest size and internal block size in bytes.',
      params: [{ name: 'name', type: 'str', hint: 'an algorithm name', input: 'text' }],
      template: 'import hashlib\nh = hashlib.new({$name})\n(h.name, h.digest_size, h.block_size)',
      cases: [
        { id: 'sha256', label: 'sha256',    values: { name: 'sha256' } },
        { id: 'alias',  label: "'SHA-512'", values: { name: 'SHA-512' } },
        { id: 'sha3',   label: 'sha3_256',  values: { name: 'sha3_256' } },
        { id: 'blake',  label: 'blake2b',   values: { name: 'blake2b' } },
        { id: 'shake',  label: 'shake_128', values: { name: 'shake_128' } },
        { id: 'bad',    label: 'sha257',    values: { name: 'sha257' } },
      ],
    },
  ],
  demoExplainer: 'Hex digests have a fixed length per algorithm — 32 characters for MD5, 40 for SHA-1, 64 for SHA-256 — even for the empty string, whose digests are well-known constants (SHA-256 of nothing starts e3b0c442). "hello" and "hellp" differ in one letter, yet 63 of the 64 hex digits of their SHA-256 digests differ. new() accepts OpenSSL spellings such as SHA-512 but reports the canonical name; SHAKE has digest_size 0 because you choose the output length.',

  patterns: [
    {
      name: 'Hash a string',
      desc: 'Encode the text first; hexdigest() gives the familiar hex string.',
      code: "import hashlib\ndigest = hashlib.sha256(text.encode('utf-8')).hexdigest()",
    },
    {
      name: 'Hash a file without reading it into memory',
      desc: 'file_digest (3.11+) reads the open binary file in chunks.',
      code: "import hashlib\nwith open('backup.tar.gz', 'rb') as f:\n    checksum = hashlib.file_digest(f, 'sha256').hexdigest()",
    },
    {
      name: 'Verify a download checksum',
      desc: 'Compare with the published hex digest, normalising its case.',
      code: "import hashlib\nwith open('python.tar.xz', 'rb') as f:\n    ok = hashlib.file_digest(f, 'sha256').hexdigest() == published.strip().lower()",
    },
    {
      name: 'Store a password',
      desc: 'A random salt per user and many iterations; keep salt and iteration count next to the key.',
      code: "import hashlib, os\nsalt = os.urandom(16)\nkey = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 600_000)",
    },
    {
      name: 'Sign data with a secret key',
      desc: 'HMAC (hmac module) or a keyed BLAKE2 — never sha256(secret + data).',
      code: "import hashlib, hmac\nsig = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()",
    },
  ],

  examples: [
    { title: 'SHA-256 of bytes',                code: "import hashlib\nhashlib.sha256(b'hello').hexdigest()", returns: "'2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'" },
    { title: 'Text must be encoded first',      code: "import hashlib\nhashlib.md5('Zoë'.encode('utf-8')).hexdigest()", returns: "'fb44af73417cf03c023d098e7f07c114'" },
    { title: 'update() in pieces = all at once', code: "import hashlib\nh = hashlib.sha256()\nh.update(b'hello ')\nh.update(b'world')\nh.hexdigest() == hashlib.sha256(b'hello world').hexdigest()", returns: 'True' },
    { title: 'Algorithms every Python has',     code: 'import hashlib\nsorted(hashlib.algorithms_guaranteed)', returns: "['blake2b', 'blake2s', 'md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha3_224', 'sha3_256', 'sha3_384', 'sha3_512', 'sha512', 'shake_128', 'shake_256']" },
    { title: 'Digest sizes in bytes',           code: "import hashlib\n[len(hashlib.new(name).digest()) for name in ('md5', 'sha1', 'sha256', 'sha512')]", returns: '[16, 20, 32, 64]' },
    { title: 'Any algorithm by name',           code: "import hashlib\nhashlib.new('sha3_256', b'abc').hexdigest()[:16]", returns: "'3a985da74fe225b2'" },
    { title: 'str is rejected',                 code: "import hashlib\nhashlib.sha256('hello')", returns: 'TypeError: Strings must be encoded before hashing' },
  ],

  pitfalls: [
    {
      name: 'Storing passwords as a plain hash',
      desc: 'The same password always gives the same SHA-256, so equal passwords are visible at a glance and precomputed tables crack them fast. A salted, slow key-derivation function gives different keys for equal passwords.',
      wrong: { label: 'sha256(password)', code: "import hashlib\nhashlib.sha256(b'hunter2').hexdigest() == hashlib.sha256(b'hunter2').hexdigest()", output: 'True' },
      fix:   { label: 'pbkdf2_hmac + salt', code: "import hashlib\na = hashlib.pbkdf2_hmac('sha256', b'hunter2', b'salt-for-alice', 100_000)\nb = hashlib.pbkdf2_hmac('sha256', b'hunter2', b'salt-for-bob', 100_000)\na == b", output: 'False' },
    },
    {
      name: 'Comparing against an uppercase checksum',
      desc: 'hexdigest() is always lowercase; many sites publish checksums in uppercase.',
      wrong: { label: '== as published', code: "import hashlib\nhashlib.sha256(b'data').hexdigest() == '3A6EB0790F39AC87C94F3856B2DD2C5D110E6811602261A9A923D3BB23ADC8B7'", output: 'False' },
      fix:   { label: '.lower() first',  code: "import hashlib\nhashlib.sha256(b'data').hexdigest() == '3A6EB0790F39AC87C94F3856B2DD2C5D110E6811602261A9A923D3BB23ADC8B7'.lower()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Checksums and integrity checks for files and downloads',
      'Content addressing and cache keys: the same bytes always give the same digest',
      'Building blocks for HMAC signatures and password key derivation',
    ],
    avoid: [
      'Storing passwords with a plain or salted fast hash → pbkdf2_hmac or scrypt (or argon2/bcrypt from PyPI)',
      'Random tokens and IDs → secrets.token_hex / token_urlsafe',
      'Fast non-cryptographic checksums → zlib.crc32 / zlib.adler32',
      'Encryption — a hash cannot be reversed; use a crypto library',
    ],
  },

  notes: {
    cpython:       'Lib/hashlib.py picks a constructor per name: OpenSSL (_hashlib) first, then the built-in modules (_md5, _sha1, _sha2, _sha3, _blake2). blake2b / blake2s always use the built-in implementation (hashlib.py never asks OpenSSL for those names), so key, salt and person work',
    'Bytes only':  'Every constructor and update() needs a bytes-like object; str raises TypeError: Strings must be encoded before hashing',
    'Security':    'MD5 and SHA-1 have practical collision attacks: fine for checksums against accidents, not for signatures or anything an attacker controls',
    'Threads':     'The GIL is released while hashing more than 2047 bytes at once, so large hashes can run in parallel threads',
  },

  related: [
    { name: 'hashlib.sha256',      slug: 'sha256',      when: 'The default choice for checksums' },
    { name: 'hashlib.pbkdf2_hmac', slug: 'pbkdf2_hmac', when: 'Password hashing' },
    { name: 'secrets module',      slug: 'secrets',     when: 'Random tokens, salts and constant-time comparison', category: 'stdlib' },
    { name: 'base64 module',       slug: 'base64',      when: 'Digests as Base64 text instead of hex',             category: 'stdlib' },
    { name: 'str.encode()',        slug: 'str-encode',  when: 'Turn text into bytes before hashing',               category: 'functions' },
    { name: 'bytes.hex()',         slug: 'bytes-hex',   when: 'What hexdigest() does to digest()',                 category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the SHA-256 hash of a string in Python?',
      a: "hashlib.sha256(text.encode('utf-8')).hexdigest(). The encode step is required: hash functions work on bytes, and the same text gives different digests under different encodings.",
    },
    {
      q: 'What does "TypeError: Strings must be encoded before hashing" mean?',
      a: 'A str was passed to a hash constructor or update(). Call .encode() on it first (UTF-8 is the usual choice), or pass bytes literals such as b"data".',
    },
    {
      q: 'What is the difference between digest() and hexdigest()?',
      a: 'digest() returns the raw bytes (32 for SHA-256); hexdigest() returns the same bytes as a lowercase hex string twice as long (64 characters). Use hexdigest() for text formats and display, digest() for binary storage or Base64.',
    },
    {
      q: 'Which hash algorithm should I use?',
      a: 'SHA-256 for general integrity checks and signatures (via HMAC), BLAKE2b when speed matters, SHA-3 when a standard requires it. Avoid MD5 and SHA-1 for anything security-related. For passwords use pbkdf2_hmac or scrypt, not any of these directly.',
    },
    {
      q: 'Can a hash be reversed?',
      a: 'No — a digest keeps no information you could decode. Short or common inputs can still be guessed by hashing candidates until one matches, which is why passwords need a salted, deliberately slow function.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html',
    meta:  'hashlib — Secure hashes and message digests',
  },

};
