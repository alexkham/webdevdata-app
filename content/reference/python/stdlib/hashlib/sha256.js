// content/reference/python/stdlib/hashlib/sha256.js

export const meta = {
  slug:        'sha256',
  name:        'hashlib.sha256',
  signature:   'hashlib.sha256([data, ]*, usedforsecurity=True)',
  blurb:       'A SHA-256 hash object: the standard 32-byte (64 hex digit) fingerprint for checksums, signatures and content addressing.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hashlib.sha256 sha256 python sha256 hash string python sha256 hexdigest sha256 digest sha256 checksum python sha256 file sha-256 sha2 256 bit hash strings must be encoded before hashing subresource integrity',
};

export const method = {
  slug:      'sha256',
  name:      'hashlib.sha256',
  signature: 'hashlib.sha256([data, ]*, usedforsecurity=True)',
  returns:   { type: 'hash object', desc: 'An object with update(), digest() (32 bytes), hexdigest() (64 characters) and copy(); name is \'sha256\'.' },

  category:    'hashlib function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The default hash for almost everything that is not a password: file checksums, cache keys, HMAC signatures, Subresource Integrity. It returns a hash object — call hexdigest() for the 64-character string everyone compares.',

  covers: ['sha256'],

  cheat: {
    commonCall: "hashlib.sha256(text.encode()).hexdigest()",
    returns:    "a hash object; hexdigest() → 64 lowercase hex characters",
    replaces:   'md5 / sha1 for integrity checks',
    watchOut:   'Needs bytes: str raises TypeError, so encode first',
  },

  parameters: [
    { name: 'data',            type: 'bytes-like', required: false, default: "b''", desc: 'Initial data, same as calling update(data) right away. Pass it positionally: in CPython 3.13 the keyword that works is string= (data= raises TypeError). A str raises TypeError.' },
    { name: 'usedforsecurity', type: 'bool',       required: false, default: 'True', desc: 'Keyword-only (3.9+). False tells a restricted (FIPS) build that this is not a security use; the digest is the same.' },
  ],

  modes: [
    {
      id: 'hex',
      label: 'hexdigest',
      blurb: 'Type any text; it is UTF-8 encoded and hashed. The result is always 64 hex characters.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import hashlib\nhashlib.sha256({$text}.encode()).hexdigest()',
      cases: [
        { id: 'hello', label: 'hello',     values: { text: 'hello' } },
        { id: 'upper', label: 'Hello',     values: { text: 'Hello' } },
        { id: 'empty', label: 'empty',     values: { text: '' } },
        { id: 'utf8',  label: 'non-ASCII', values: { text: 'Zoë 🙂' } },
      ],
    },
    {
      id: 'bytes',
      label: 'digest vs hex',
      blurb: 'digest() is 32 raw bytes; hexdigest() is the same bytes written as hex — compare the first 8 bytes with the first 16 hex digits.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import hashlib\nd = hashlib.sha256({$text}.encode()).digest()\n(len(d), d[:8], d.hex()[:16])',
      cases: [
        { id: 'abc',   label: 'abc',   values: { text: 'abc' } },
        { id: 'empty', label: 'empty', values: { text: '' } },
      ],
    },
    {
      id: 'chunks',
      label: 'update in parts',
      blurb: 'Feed the parts one by one with update() and compare with hashing the joined text at once (parts are comma-separated).',
      params: [{ name: 'parts', type: 'list[str]', hint: 'comma-separated parts', input: 'csv' }],
      template: "import hashlib\nparts = {$parts}\nh = hashlib.sha256()\nfor part in parts:\n    h.update(part.encode())\n(h.hexdigest() == hashlib.sha256(''.join(parts).encode()).hexdigest(), h.hexdigest()[:16])",
      cases: [
        { id: 'abc',   label: 'a, b, c',     values: { parts: 'a,b,c' } },
        { id: 'words', label: 'two words',   values: { parts: 'hello, world' } },
        { id: 'none',  label: 'no parts',    values: { parts: '' } },
      ],
    },
  ],
  demoExplainer: 'One changed letter ("hello" vs "Hello") gives an unrelated digest. The empty string still hashes to a full 64-character value, e3b0c442…b855. In the second tab the first byte of SHA-256("abc") is 0xba and its hex starts "ba": hexdigest() is just digest().hex(). Updating with a, b and c gives exactly the digest of "abc" — update() concatenates.',

  patterns: [
    {
      name: 'Checksum of a file',
      desc: 'file_digest (3.11+) streams the file; on older versions loop over f.read(65536) and update().',
      code: "import hashlib\nwith open('release.zip', 'rb') as f:\n    checksum = hashlib.file_digest(f, 'sha256').hexdigest()",
    },
    {
      name: 'Subresource Integrity value',
      desc: 'The integrity attribute of <script> and <link> wants Base64 of the raw digest, not hex.',
      code: "import base64, hashlib\nsri = 'sha256-' + base64.b64encode(hashlib.sha256(js_bytes).digest()).decode()",
    },
    {
      name: 'Stable bucket for A/B tests',
      desc: 'Unlike hash(), SHA-256 is the same in every process and on every machine.',
      code: "import hashlib\nbucket = int.from_bytes(hashlib.sha256(user_id.encode()).digest()[:8], 'big') % 100",
    },
    {
      name: 'HMAC-SHA256 signature',
      desc: 'Signing needs a key: use the hmac module (this is what JWT HS256 does).',
      code: "import hashlib, hmac\nsignature = hmac.new(key, message, hashlib.sha256).hexdigest()",
    },
  ],

  examples: [
    { title: 'Empty input',                 code: "import hashlib\nhashlib.sha256(b'').hexdigest()",   returns: "'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'" },
    { title: 'The FIPS test vector "abc"',  code: "import hashlib\nhashlib.sha256(b'abc').hexdigest()", returns: "'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'" },
    { title: 'digest() is 32 raw bytes',    code: "import hashlib\nd = hashlib.sha256(b'abc').digest()\n(len(d), d[:4])", returns: "(32, b'\\xbax\\x16\\xbf')" },
    { title: 'Name and sizes',              code: 'import hashlib\nh = hashlib.sha256()\n(h.name, h.digest_size, h.block_size)', returns: "('sha256', 32, 64)" },
    { title: 'Subresource Integrity hash',  code: "import base64, hashlib\n'sha256-' + base64.b64encode(hashlib.sha256(b'alert(1)').digest()).decode()", returns: "'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='" },
    { title: 'A stable 0–99 bucket',        code: "import hashlib\nint.from_bytes(hashlib.sha256(b'user-42').digest()[:8], 'big') % 100", returns: '29' },
    { title: 'usedforsecurity=False: same digest', code: "import hashlib\nhashlib.sha256(b'abc', usedforsecurity=False).hexdigest()[:16]", returns: "'ba7816bf8f01cfea'" },
  ],

  pitfalls: [
    {
      name: 'Comparing digest() with a hex string',
      desc: 'digest() returns bytes; a published checksum is hex text. bytes never equal str, so the check silently fails.',
      wrong: { label: 'digest() == hex', code: "import hashlib\nhashlib.sha256(b'abc').digest() == 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'", output: 'False' },
      fix:   { label: 'hexdigest() == hex', code: "import hashlib\nhashlib.sha256(b'abc').hexdigest() == 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'", output: 'True' },
    },
    {
      name: 'Reusing one hash object for several messages',
      desc: 'update() appends: the second digest below is SHA-256 of b"catdog", not of b"dog". Create a new object per message (or copy() a shared prefix).',
      wrong: { label: 'one object', code: "import hashlib\nh = hashlib.sha256()\nresults = []\nfor word in [b'cat', b'dog']:\n    h.update(word)\n    results.append(h.hexdigest()[:12])\nresults", output: "['77af778b51ab', 'd8e161cf97a5']" },
      fix:   { label: 'one object per message', code: "import hashlib\n[hashlib.sha256(word).hexdigest()[:12] for word in [b'cat', b'dog']]", output: "['77af778b51ab', 'cd6357efdd96']" },
    },
    {
      name: 'A trailing newline changes everything',
      desc: 'Text read from a file or produced by echo usually ends with a newline, and that byte is hashed too. Strip it when the newline is not part of the value.',
      wrong: { label: "b'abc\\n'", code: "import hashlib\nhashlib.sha256(b'abc\\n').hexdigest()[:16]", output: "'edeaaff3f1774ad2'" },
      fix:   { label: '.strip() first', code: "import hashlib\nhashlib.sha256(b'abc\\n'.strip()).hexdigest()[:16]", output: "'ba7816bf8f01cfea'" },
    },
  ],

  when: {
    use: [
      'File and download checksums, deduplication, content-addressed storage',
      'HMAC signatures (hmac.new(key, msg, hashlib.sha256)) and JWT HS256',
      'Stable IDs and buckets derived from data',
    ],
    avoid: [
      'Passwords → pbkdf2_hmac or scrypt',
      'Keyed hashing without the hmac module: sha256(key + msg) allows length-extension attacks → hmac or blake2b(key=...)',
      'Very large volumes where speed matters more than ubiquity → blake2b',
    ],
  },

  notes: {
    cpython:     'hashlib.sha256 is _hashlib.openssl_sha256 when OpenSSL is available, otherwise _sha2.sha256 (HACL*); both give identical digests',
    'Sizes':     'digest_size 32, block_size 64; hexdigest() is 64 lowercase characters',
    'Exceptions': 'TypeError: Strings must be encoded before hashing for str; TypeError: object supporting the buffer API required for other non-bytes',
  },

  related: [
    { name: 'hashlib.sha224 / sha384 / sha512', slug: 'sha224-sha384-sha512', when: 'The other SHA-2 sizes' },
    { name: 'update / digest / hexdigest',      slug: 'hash-methods',        when: 'Everything a hash object can do' },
    { name: 'hashlib.file_digest',              slug: 'file_digest',         when: 'Hash a whole file' },
    { name: 'hashlib.sha3_256',                 slug: 'sha3',                when: 'The SHA-3 alternative of the same size' },
    { name: 'hash()',                           slug: 'hash',                when: 'The built-in hash — per process, not a checksum', category: 'functions' },
    { name: 'secrets.compare_digest',           slug: 'compare_digest',      when: 'Compare signatures in constant time', category: 'stdlib/secrets' },
  ],

  faq: [
    {
      q: 'How do I hash a string with SHA-256 in Python?',
      a: "hashlib.sha256(s.encode('utf-8')).hexdigest() returns the 64-character hex digest. Without .encode() you get TypeError: Strings must be encoded before hashing.",
    },
    {
      q: 'Why is my SHA-256 different from the one an online tool shows?',
      a: 'Almost always the input bytes differ: a trailing newline, Windows line endings, a different text encoding, or surrounding whitespace. Compare len(data) and data[-5:] on both sides.',
    },
    {
      q: 'Is SHA-256 secure enough for passwords?',
      a: 'No. It is designed to be fast, so attackers can test billions of guesses per second. Use hashlib.pbkdf2_hmac with many iterations or hashlib.scrypt, both with a random salt.',
    },
    {
      q: 'Why not use the built-in hash() instead?',
      a: 'hash() of a str is randomized per process (see PYTHONHASHSEED), fits in one machine-sized int, and is not designed to resist attacks. SHA-256 gives the same 256 bits in every process, on every machine.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.sha256',
    meta:  'hashlib.sha256',
  },

};
