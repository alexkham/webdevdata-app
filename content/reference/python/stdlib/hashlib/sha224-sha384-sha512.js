// content/reference/python/stdlib/hashlib/sha224-sha384-sha512.js — the other SHA-2 sizes

export const meta = {
  slug:        'sha224-sha384-sha512',
  name:        'hashlib.sha224 / sha384 / sha512',
  signature:   'hashlib.sha224([data, ]*, usedforsecurity=True) · hashlib.sha384(…) · hashlib.sha512(…)',
  blurb:       'The other SHA-2 sizes: 28-, 48- and 64-byte digests. sha512 and sha384 work on 64-bit words and are often faster than sha256 on 64-bit CPUs.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hashlib.sha224 hashlib.sha384 hashlib.sha512 sha224 sha384 sha512 python sha512 hash string sha512 hexdigest sha-2 family sha384 vs sha512 truncated sha512 128 hex characters',
};

export const method = {
  slug:      'sha224-sha384-sha512',
  name:      'hashlib.sha224 / sha384 / sha512',
  signature: 'hashlib.sha224([data, ]*, usedforsecurity=True) · hashlib.sha384(…) · hashlib.sha512(…)',
  returns:   { type: 'hash object', desc: 'Same API as sha256(); digest_size 28 / 48 / 64 bytes, hexdigest() 56 / 96 / 128 characters.' },

  category:    'hashlib function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Same family, same API as sha256, different sizes. The short versions are not truncations of the long ones: SHA-224 and SHA-384 start from their own initial values, so their digests share nothing with SHA-256 and SHA-512.',

  covers: ['sha224', 'sha384', 'sha512'],

  cheat: {
    commonCall: 'hashlib.sha512(data).hexdigest()',
    returns:    'a hash object; hexdigest() → 56 / 96 / 128 hex characters',
    replaces:   'Cutting a longer digest to size (which gives a different value)',
    watchOut:   'sha384(x) != sha512(x)[:48] — the family members are unrelated values',
  },

  parameters: [
    { name: 'data',            type: 'bytes-like', required: false, default: "b''", desc: 'Initial data, same as an immediate update(data). A str raises TypeError.' },
    { name: 'usedforsecurity', type: 'bool',       required: false, default: 'True', desc: 'Keyword-only (3.9+). False marks a non-security use for restricted builds; the digest is the same.' },
  ],

  attributes: [
    { name: 'sha224', type: '28 / 64',  meaning: 'digest_size / block_size in bytes. 32-bit words, like sha256.' },
    { name: 'sha384', type: '48 / 128', meaning: '64-bit words, like sha512; not vulnerable to length extension because the output is truncated.' },
    { name: 'sha512', type: '64 / 128', meaning: 'The largest SHA-2 digest: 128 hex characters.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'all four sizes',
      blurb: 'The first 16 hex digits of each SHA-2 digest of your text. None is a prefix of another.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "import hashlib\ndata = {$text}.encode()\n{name: hashlib.new(name, data).hexdigest()[:16] for name in ['sha224', 'sha256', 'sha384', 'sha512']}",
      cases: [
        { id: 'abc',   label: 'abc',   values: { text: 'abc' } },
        { id: 'empty', label: 'empty', values: { text: '' } },
        { id: 'hello', label: 'hello', values: { text: 'hello' } },
      ],
    },
    {
      id: 'full',
      label: 'full digest',
      blurb: 'One algorithm, the whole hex digest and its length.',
      params: [
        { name: 'name', type: 'str', hint: 'sha224, sha384 or sha512', input: 'text' },
        { name: 'text', type: 'str', hint: 'any text', input: 'text' },
      ],
      template: 'import hashlib\nh = hashlib.new({$name}, {$text}.encode())\n(len(h.hexdigest()), h.hexdigest())',
      cases: [
        { id: '512', label: 'sha512 abc', values: { name: 'sha512', text: 'abc' } },
        { id: '384', label: 'sha384 abc', values: { name: 'sha384', text: 'abc' } },
        { id: '224', label: 'sha224 empty', values: { name: 'sha224', text: '' } },
      ],
    },
  ],
  demoExplainer: 'For "abc" SHA-384 starts cb00753f and SHA-512 starts ddaf35a1: SHA-384 runs the SHA-512 computation from different initial values and keeps 48 bytes, so it is not the first 96 hex digits of SHA-512. The same holds for SHA-224 and SHA-256. Hex lengths are twice the digest sizes: 56, 64, 96 and 128.',

  patterns: [
    {
      name: 'SHA-512 checksum of a file',
      desc: 'Many Linux distributions publish SHA512SUMS files.',
      code: "import hashlib\nwith open('image.iso', 'rb') as f:\n    digest = hashlib.file_digest(f, 'sha512').hexdigest()",
    },
    {
      name: 'Pick the size from configuration',
      desc: 'new() takes the algorithm name as a string.',
      code: "import hashlib\nh = hashlib.new(settings.HASH_ALGORITHM)  # 'sha384', 'sha512', …\nh.update(payload)",
    },
    {
      name: 'HMAC-SHA512',
      desc: 'Same hmac call, larger digest.',
      code: "import hashlib, hmac\nmac = hmac.new(key, message, hashlib.sha512).hexdigest()",
    },
  ],

  examples: [
    { title: 'SHA-512 of "abc" (first 32 hex)', code: "import hashlib\nhashlib.sha512(b'abc').hexdigest()[:32]", returns: "'ddaf35a193617abacc417349ae204131'" },
    { title: 'SHA-384 of "abc"',  code: "import hashlib\nhashlib.sha384(b'abc').hexdigest()", returns: "'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7'" },
    { title: 'SHA-224 of nothing', code: "import hashlib\nhashlib.sha224(b'').hexdigest()", returns: "'d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f'" },
    { title: 'Names and sizes',   code: 'import hashlib\n[(h.name, h.digest_size, h.block_size) for h in (hashlib.sha224(), hashlib.sha384(), hashlib.sha512())]', returns: "[('sha224', 28, 64), ('sha384', 48, 128), ('sha512', 64, 128)]" },
    { title: 'Hex lengths',       code: "import hashlib\n{name: len(hashlib.new(name, b'x').hexdigest()) for name in ['sha224', 'sha256', 'sha384', 'sha512']}", returns: "{'sha224': 56, 'sha256': 64, 'sha384': 96, 'sha512': 128}" },
    { title: 'SHA-384 is not a cut SHA-512', code: "import hashlib\nhashlib.sha512(b'abc').hexdigest()[:96] == hashlib.sha384(b'abc').hexdigest()", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Truncating SHA-512 and calling it SHA-384',
      desc: 'A verifier that computes real SHA-384 will reject a cut SHA-512 value. Use the algorithm the other side specifies.',
      wrong: { label: 'sha512()[:96]', code: "import hashlib\nhashlib.sha512(b'abc').hexdigest()[:96][:16]", output: "'ddaf35a193617aba'" },
      fix:   { label: 'sha384()',       code: "import hashlib\nhashlib.sha384(b'abc').hexdigest()[:16]", output: "'cb00753f45a35e8b'" },
    },
    {
      name: 'Expecting SHA-224 to be the start of SHA-256',
      desc: 'Same story in the 32-bit half of the family.',
      wrong: { label: 'sha256()[:56]', code: "import hashlib\nhashlib.sha256(b'abc').hexdigest()[:56] == hashlib.sha224(b'abc').hexdigest()", output: 'False' },
      fix:   { label: 'sha224()',      code: "import hashlib\nlen(hashlib.sha224(b'abc').hexdigest())", output: '56' },
    },
  ],

  when: {
    use: [
      'Formats and protocols that specify them (SHA512SUMS, HMAC-SHA384 in TLS, JWT HS384/HS512)',
      'sha512 on 64-bit machines when you want a longer digest at similar speed',
    ],
    avoid: [
      'Defaults where SHA-256 is expected — interoperability beats size',
      'Passwords → pbkdf2_hmac(\'sha512\', …) or scrypt, never a single hash',
    ],
  },

  notes: {
    cpython:       'OpenSSL\'s SHA-2 via _hashlib, falling back to _sha2 (HACL*), which provides all four sizes',
    'Word size':   'sha224/sha256 use 32-bit words and 64-byte blocks; sha384/sha512 use 64-bit words and 128-byte blocks',
    'Not listed':  'SHA-512/224 and SHA-512/256 exist in OpenSSL and may work via hashlib.new(\'sha512_256\'), but they are not in algorithms_guaranteed',
  },

  related: [
    { name: 'hashlib.sha256', slug: 'sha256', when: 'The most common SHA-2 size' },
    { name: 'sha3_*',         slug: 'sha3',   when: 'The SHA-3 family with the same sizes' },
    { name: 'hashlib.new',    slug: 'new',    when: 'Choose the size by name' },
    { name: 'name / digest_size / block_size', slug: 'hash-attributes', when: 'Inspect a hash object' },
  ],

  faq: [
    {
      q: 'How do I compute SHA-512 in Python?',
      a: "hashlib.sha512(data).hexdigest() gives 128 hex characters; for text use hashlib.sha512(s.encode('utf-8')).hexdigest().",
    },
    {
      q: 'Is SHA-384 just SHA-512 cut short?',
      a: 'It uses the same compression function but different initial values, so its 48 bytes differ from the first 48 bytes of SHA-512. The truncation is what protects SHA-384 from length-extension attacks.',
    },
    {
      q: 'Is SHA-512 more secure than SHA-256?',
      a: 'It has a longer output, but SHA-256 is already far beyond brute force. Pick by what your protocol requires; on 64-bit CPUs SHA-512 can even be faster per byte.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.sha512',
    meta:  'hashlib.sha224, sha384, sha512',
  },

};
