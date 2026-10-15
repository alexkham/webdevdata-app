// content/reference/python/stdlib/hashlib/md5.js

export const meta = {
  slug:        'md5',
  name:        'hashlib.md5',
  signature:   'hashlib.md5([data, ]*, usedforsecurity=True)',
  blurb:       'An MD5 hash object: a fast 16-byte (32 hex digit) checksum that is broken for security but still common for cache keys, ETags and legacy checksums.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hashlib.md5 md5 python md5 hash string python md5 hexdigest md5 checksum file md5 usedforsecurity fips md5 is md5 secure content-md5 etag md5 collision 128 bit',
};

export const method = {
  slug:      'md5',
  name:      'hashlib.md5',
  signature: 'hashlib.md5([data, ]*, usedforsecurity=True)',
  returns:   { type: 'hash object', desc: 'An object with update(), digest() (16 bytes), hexdigest() (32 characters) and copy(); name is \'md5\'.' },

  category:    'hashlib function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'RFC 1321, from 1992. Collisions can be produced on a laptop, so MD5 must not protect anything an attacker controls — but as a quick fingerprint for caches, de-duplication and APIs that require it, it is everywhere.',

  covers: ['md5'],

  cheat: {
    commonCall: "hashlib.md5(data).hexdigest()",
    returns:    'a hash object; hexdigest() → 32 lowercase hex characters',
    replaces:   'The old md5 module (Python 2)',
    watchOut:   'Broken for security: never for passwords or signatures',
  },

  parameters: [
    { name: 'data',            type: 'bytes-like', required: false, default: "b''", desc: 'Initial data, same as an immediate update(data). A str raises TypeError.' },
    { name: 'usedforsecurity', type: 'bool',       required: false, default: 'True', desc: 'Keyword-only (3.9+). Pass False for non-security uses (cache keys, checksums) so FIPS-restricted builds allow MD5. The digest does not change.' },
  ],

  modes: [
    {
      id: 'hex',
      label: 'hexdigest',
      blurb: 'MD5 of the UTF-8 bytes of your text: always 32 hex characters.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import hashlib\nhashlib.md5({$text}.encode()).hexdigest()',
      cases: [
        { id: 'hello', label: 'hello',     values: { text: 'hello' } },
        { id: 'upper', label: 'Hello',     values: { text: 'Hello' } },
        { id: 'empty', label: 'empty',     values: { text: '' } },
        { id: 'utf8',  label: 'non-ASCII', values: { text: 'Zoë 🙂' } },
      ],
    },
    {
      id: 'contentmd5',
      label: 'Content-MD5 header',
      blurb: 'HTTP Content-MD5 and S3 upload checks want Base64 of the 16 raw bytes, not the hex string.',
      params: [{ name: 'body', type: 'str', hint: 'request body', input: 'text' }],
      template: 'import base64, hashlib\nbase64.b64encode(hashlib.md5({$body}.encode(), usedforsecurity=False).digest()).decode()',
      cases: [
        { id: 'hello', label: 'hello',     values: { body: 'hello' } },
        { id: 'json',  label: 'JSON body', values: { body: '{"id": 1}' } },
        { id: 'empty', label: 'empty',     values: { body: '' } },
      ],
    },
  ],
  demoExplainer: 'The empty string has the famous digest d41d8cd98f00b204e9800998ecf8427e. "hello" and "Hello" share nothing visible. In the second tab the 16-byte digest becomes 24 Base64 characters ending in ==, the form HTTP headers use; usedforsecurity=False states that this is a checksum, not a security measure.',

  patterns: [
    {
      name: 'Cache key from request data',
      desc: 'Not security-relevant, so say so: restricted builds then allow it.',
      code: "import hashlib, json\nkey = hashlib.md5(json.dumps(params, sort_keys=True).encode(), usedforsecurity=False).hexdigest()",
    },
    {
      name: 'Check a legacy .md5 checksum file',
      desc: 'The file holds "<hex>  <name>"; compare the first field.',
      code: "import hashlib\nexpected = open('data.iso.md5').read().split()[0]\nwith open('data.iso', 'rb') as f:\n    ok = hashlib.file_digest(f, 'md5').hexdigest() == expected.lower()",
    },
    {
      name: 'Content-MD5 for an upload',
      desc: 'Base64 of the raw digest.',
      code: "import base64, hashlib\nheaders = {'Content-MD5': base64.b64encode(hashlib.md5(body).digest()).decode()}",
    },
  ],

  examples: [
    { title: 'Empty input',            code: "import hashlib\nhashlib.md5(b'').hexdigest()", returns: "'d41d8cd98f00b204e9800998ecf8427e'" },
    { title: 'The classic test string', code: "import hashlib\nhashlib.md5(b'The quick brown fox jumps over the lazy dog').hexdigest()", returns: "'9e107d9d372bb6826bd81d3542a419d6'" },
    { title: 'Name and sizes',         code: 'import hashlib\nh = hashlib.md5()\n(h.name, h.digest_size, h.block_size)', returns: "('md5', 16, 64)" },
    { title: 'Not for security',       code: "import hashlib\nhashlib.md5(b'cache-key', usedforsecurity=False).hexdigest()", returns: "'2536a13781f33e55574faff9acb9f995'" },
    { title: 'An ETag value',          code: "import hashlib\nf'\"{hashlib.md5(b\"<h1>Hello</h1>\").hexdigest()}\"'", returns: "'\"4b214a5d71afee6f818a599f43db3e56\"'" },
    { title: 'uuid3 is MD5 inside',    code: "import hashlib, uuid\nuuid.uuid3(uuid.NAMESPACE_DNS, 'python.org').hex[:12], hashlib.md5(uuid.NAMESPACE_DNS.bytes + b'python.org').hexdigest()[:12]", returns: "('6fa459eaee8a', '6fa459eaee8a')" },
    { title: 'str is rejected',        code: "import hashlib\nhashlib.md5('hello')", returns: 'TypeError: Strings must be encoded before hashing' },
  ],

  pitfalls: [
    {
      name: 'Hashing passwords with MD5',
      desc: 'Unsalted MD5 of a common password is a lookup away: this digest appears in every leaked-password list. Use a salted, slow KDF.',
      wrong: { label: 'md5(password)', code: "import hashlib\nhashlib.md5(b'password').hexdigest()", output: "'5f4dcc3b5aa765d61d8327deb882cf99'" },
      fix:   { label: 'pbkdf2_hmac',   code: "import hashlib\nlen(hashlib.pbkdf2_hmac('sha256', b'password', b'16-byte-salt-abc', 600_000))", output: '32' },
    },
    {
      name: 'Sending the hex digest where Base64 is expected',
      desc: 'Content-MD5 and many storage APIs want Base64 of digest(), not hexdigest(). The hex form is 32 characters, the Base64 form 24.',
      wrong: { label: 'hexdigest()', code: "import hashlib\nhashlib.md5(b'hello').hexdigest()", output: "'5d41402abc4b2a76b9719d911017c592'" },
      fix:   { label: 'Base64 of digest()', code: "import base64, hashlib\nbase64.b64encode(hashlib.md5(b'hello').digest()).decode()", output: "'XUFAKrxLKna5cZ2REBfFkg=='" },
    },
  ],

  when: {
    use: [
      'Cache keys, de-duplication and change detection where nobody is attacking you',
      'Interoperating with systems that require MD5 (Content-MD5, legacy checksum files, uuid3)',
    ],
    avoid: [
      'Passwords → pbkdf2_hmac or scrypt',
      'Signatures, certificates, anything an attacker can influence → sha256 or blake2b',
      'New file formats and protocols → sha256',
    ],
  },

  notes: {
    cpython:     'OpenSSL\'s MD5 via _hashlib, falling back to _md5 (HACL*) when OpenSSL does not provide it',
    'FIPS':      'On FIPS-restricted builds md5() may be blocked unless usedforsecurity=False is passed',
    'Security':  'Collisions (two inputs with the same digest) are practical; second preimages are not, but MD5 is still considered broken',
  },

  related: [
    { name: 'hashlib.sha1',   slug: 'sha1',   when: 'The next-oldest legacy hash' },
    { name: 'hashlib.sha256', slug: 'sha256', when: 'The modern default' },
    { name: 'update / digest / hexdigest', slug: 'hash-methods', when: 'The hash object API' },
    { name: 'uuid.uuid3 / uuid5', slug: 'uuid3-uuid5', when: 'Name-based UUIDs built on MD5 and SHA-1', category: 'stdlib/uuid' },
    { name: 'base64 module',  slug: 'base64', when: 'Base64 of a digest', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the MD5 hash of a string in Python?',
      a: "hashlib.md5(s.encode('utf-8')).hexdigest() — 32 hex characters. Encode first: md5() accepts only bytes.",
    },
    {
      q: 'Is MD5 still safe to use?',
      a: 'Not for security: collisions can be generated quickly, so it cannot protect signatures, certificates or passwords. For accidental-corruption checks and cache keys it still works.',
    },
    {
      q: 'Why does md5() fail on some servers?',
      a: 'The docs warn that MD5 may be missing or blocked on rare "FIPS compliant" Python builds. Pass usedforsecurity=False if you use it only as a checksum, or switch to sha256.',
    },
    {
      q: 'How do I get the MD5 of a file?',
      a: "with open(path, 'rb') as f: hashlib.file_digest(f, 'md5').hexdigest() on Python 3.11+, or update() in a loop over f.read(65536) on older versions.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.md5',
    meta:  'hashlib.md5',
  },

};
