// content/reference/python/stdlib/hashlib/sha1.js

export const meta = {
  slug:        'sha1',
  name:        'hashlib.sha1',
  signature:   'hashlib.sha1([data, ]*, usedforsecurity=True)',
  blurb:       'A SHA-1 hash object: 20 bytes (40 hex digits). Broken for collision resistance, but still the hash behind Git object IDs, uuid5 and many legacy protocols.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hashlib.sha1 sha1 python sha1 hash string python sha1 hexdigest git hash-object blob sha1 git object id sha-1 160 bit shattered collision is sha1 secure',
};

export const method = {
  slug:      'sha1',
  name:      'hashlib.sha1',
  signature: 'hashlib.sha1([data, ]*, usedforsecurity=True)',
  returns:   { type: 'hash object', desc: 'An object with update(), digest() (20 bytes), hexdigest() (40 characters) and copy(); name is \'sha1\'.' },

  category:    'hashlib function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The 160-bit FIPS hash that Git, uuid5 and older TLS were built on. A public collision was demonstrated in 2017, so use it where a format requires it — and SHA-256 everywhere else.',

  covers: ['sha1'],

  cheat: {
    commonCall: "hashlib.sha1(data).hexdigest()",
    returns:    'a hash object; hexdigest() → 40 lowercase hex characters',
    replaces:   'The old sha module (Python 2)',
    watchOut:   'Collision attacks exist: not for new signatures',
  },

  parameters: [
    { name: 'data',            type: 'bytes-like', required: false, default: "b''", desc: 'Initial data, same as an immediate update(data). A str raises TypeError.' },
    { name: 'usedforsecurity', type: 'bool',       required: false, default: 'True', desc: 'Keyword-only (3.9+). False marks a non-security use for restricted builds; the digest is the same.' },
  ],

  modes: [
    {
      id: 'hex',
      label: 'hexdigest',
      blurb: 'SHA-1 of the UTF-8 bytes of your text: always 40 hex characters.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import hashlib\nhashlib.sha1({$text}.encode()).hexdigest()',
      cases: [
        { id: 'abc',   label: 'abc',       values: { text: 'abc' } },
        { id: 'hello', label: 'hello',     values: { text: 'hello' } },
        { id: 'empty', label: 'empty',     values: { text: '' } },
        { id: 'utf8',  label: 'non-ASCII', values: { text: 'Zoë' } },
      ],
    },
    {
      id: 'git',
      label: 'Git blob ID',
      blurb: 'Git names a file\'s content by SHA-1 of a header ("blob", the byte length, a NUL byte) followed by the content. This is what git hash-object prints.',
      params: [{ name: 'text', type: 'str', hint: 'file content', input: 'text' }],
      template: "import hashlib\ncontent = {$text}.encode()\nhashlib.sha1(b'blob %d\\0' % len(content) + content).hexdigest()",
      cases: [
        { id: 'hello', label: 'hello',      values: { text: 'hello' } },
        { id: 'empty', label: 'empty file', values: { text: '' } },
        { id: 'utf8',  label: 'non-ASCII',  values: { text: 'Zoë' } },
      ],
    },
  ],
  demoExplainer: 'SHA-1 of "abc" is the FIPS test vector a9993e36…d89d. In the Git tab, "hello" (no trailing newline) gives b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0, exactly what printf hello | git hash-object --stdin prints, and the empty file gives e69de29b…5391, the ID Git uses for every empty file. The length in the header counts bytes, so "Zoë" is blob 4.',

  patterns: [
    {
      name: 'Git blob ID of a file',
      desc: 'Same result as git hash-object path (no filters applied).',
      code: "import hashlib\ndata = open('README.md', 'rb').read()\noid = hashlib.sha1(b'blob %d\\0' % len(data) + data).hexdigest()",
    },
    {
      name: 'Short IDs',
      desc: 'Git abbreviates object IDs to their first 7+ hex digits.',
      code: "import hashlib\nshort = hashlib.sha1(data).hexdigest()[:7]",
    },
    {
      name: 'Legacy HMAC-SHA1 (TOTP, OAuth 1.0)',
      desc: 'HMAC-SHA1 is not affected by SHA-1 collisions and is still what these protocols specify.',
      code: "import hashlib, hmac\nmac = hmac.new(secret, counter_bytes, hashlib.sha1).digest()",
    },
  ],

  examples: [
    { title: 'Empty input',           code: "import hashlib\nhashlib.sha1(b'').hexdigest()",    returns: "'da39a3ee5e6b4b0d3255bfef95601890afd80709'" },
    { title: 'The FIPS test vector',  code: "import hashlib\nhashlib.sha1(b'abc').hexdigest()", returns: "'a9993e364706816aba3e25717850c26c9cd0d89d'" },
    { title: 'Name and sizes',        code: 'import hashlib\nh = hashlib.sha1()\n(h.name, h.digest_size, h.block_size, len(h.hexdigest()))', returns: "('sha1', 20, 64, 40)" },
    { title: 'Git blob of "hello\\n"', code: "import hashlib\ncontent = b'hello\\n'\nhashlib.sha1(b'blob %d\\0' % len(content) + content).hexdigest()", returns: "'ce013625030ba8dba906f756967f9e9ca394464a'" },
    { title: 'The empty-blob ID',     code: "import hashlib\nhashlib.sha1(b'blob 0\\0').hexdigest()", returns: "'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391'" },
    { title: 'uuid5 is SHA-1 inside', code: "import hashlib, uuid\nuuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/').hex[:12] == hashlib.sha1(uuid.NAMESPACE_URL.bytes + b'https://example.com/').hexdigest()[:12]", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Hashing only the content to match Git',
      desc: 'Git IDs hash a "blob <size>\\0" header plus the content, so plain SHA-1 of the file never matches git hash-object.',
      wrong: { label: 'sha1(content)',        code: "import hashlib\nhashlib.sha1(b'hello\\n').hexdigest()", output: "'f572d396fae9206628714fb2ce00f72e94f2258f'" },
      fix:   { label: 'sha1(header + content)', code: "import hashlib\nhashlib.sha1(b'blob 6\\0hello\\n').hexdigest()", output: "'ce013625030ba8dba906f756967f9e9ca394464a'" },
    },
    {
      name: 'Using SHA-1 for new integrity guarantees',
      desc: 'Chosen-prefix collisions are practical, so an attacker can make two different files with one SHA-1. New formats should use SHA-256 (64 hex digits instead of 40).',
      wrong: { label: 'sha1',   code: "import hashlib\nlen(hashlib.sha1(b'release').hexdigest())",   output: '40' },
      fix:   { label: 'sha256', code: "import hashlib\nlen(hashlib.sha256(b'release').hexdigest())", output: '64' },
    },
  ],

  when: {
    use: [
      'Formats that are defined with SHA-1: Git object IDs, uuid5, HMAC-SHA1 in TOTP / OAuth 1.0',
      'Non-adversarial fingerprints when 40 hex digits are expected',
    ],
    avoid: [
      'New signatures, certificates or integrity checks → sha256 or blake2b',
      'Passwords → pbkdf2_hmac or scrypt',
    ],
  },

  notes: {
    cpython:    'OpenSSL\'s SHA-1 via _hashlib, falling back to _sha1 (HACL*)',
    'Sizes':    'digest_size 20, block_size 64',
    'Security': 'The first public collision (SHAttered) was announced in 2017; HMAC-SHA1 remains unbroken because HMAC does not rely on collision resistance',
  },

  related: [
    { name: 'hashlib.md5',    slug: 'md5',    when: 'The older, weaker legacy hash' },
    { name: 'hashlib.sha256', slug: 'sha256', when: 'What to use for new work' },
    { name: 'update / digest / hexdigest', slug: 'hash-methods', when: 'The hash object API' },
    { name: 'uuid.uuid3 / uuid5', slug: 'uuid3-uuid5', when: 'uuid5 is SHA-1 of namespace + name', category: 'stdlib/uuid' },
  ],

  faq: [
    {
      q: 'How do I compute a SHA-1 hash in Python?',
      a: "hashlib.sha1(data).hexdigest() with data as bytes — for text, hashlib.sha1(s.encode('utf-8')).hexdigest().",
    },
    {
      q: 'Why does my SHA-1 not match git hash-object?',
      a: 'Git hashes b"blob <length>\\0" followed by the content, not the content alone. Also check line endings: Git may normalise CRLF depending on your settings.',
    },
    {
      q: 'Is SHA-1 still secure?',
      a: 'Not against collisions: two different inputs with the same SHA-1 have been produced publicly. HMAC-SHA1 and uses that only need one-wayness are still fine, but new designs should choose SHA-256.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.sha1',
    meta:  'hashlib.sha1',
  },

};
