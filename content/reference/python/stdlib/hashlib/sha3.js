// content/reference/python/stdlib/hashlib/sha3.js — sha3_224 / sha3_256 / sha3_384 / sha3_512

export const meta = {
  slug:        'sha3',
  name:        'hashlib.sha3_224 / sha3_256 / sha3_384 / sha3_512',
  signature:   'hashlib.sha3_256([data, ]*, usedforsecurity=True) · sha3_224 · sha3_384 · sha3_512',
  blurb:       'The SHA-3 family (FIPS 202, Keccak): the same digest sizes as SHA-2 from a completely different design — immune to length-extension attacks.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'hashlib.sha3_224 hashlib.sha3_256 hashlib.sha3_384 hashlib.sha3_512 sha3_224 sha3_256 sha3_384 sha3_512 sha3 python sha-3 keccak fips 202 sha3 vs sha256 keccak256 ethereum',
};

export const method = {
  slug:      'sha3',
  name:      'hashlib.sha3_224 / sha3_256 / sha3_384 / sha3_512',
  signature: 'hashlib.sha3_256([data, ]*, usedforsecurity=True) · sha3_224 · sha3_384 · sha3_512',
  returns:   { type: 'hash object', desc: 'The standard hash object; digest_size 28 / 32 / 48 / 64 bytes, block_size (the sponge rate) 144 / 136 / 104 / 72.' },

  category:    'hashlib function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'A sponge construction instead of SHA-2\'s Merkle–Damgård chain, so prefix-MAC tricks that break sha256(key + msg) do not apply. Same sizes, same API — different, unrelated digests. Note the underscore: the constructors are sha3_256, not sha3-256.',

  covers: ['sha3_224', 'sha3_256', 'sha3_384', 'sha3_512'],

  cheat: {
    commonCall: 'hashlib.sha3_256(data).hexdigest()',
    returns:    'a hash object; hexdigest() → 56 / 64 / 96 / 128 hex characters',
    replaces:   'SHA-2 where a standard asks for SHA-3',
    watchOut:   'Not the same as Ethereum\'s Keccak-256 (different padding)',
  },

  parameters: [
    { name: 'data',            type: 'bytes-like', required: false, default: "b''", desc: 'Initial data, same as an immediate update(data). A str raises TypeError.' },
    { name: 'usedforsecurity', type: 'bool',       required: false, default: 'True', desc: 'Keyword-only (3.9+); the digest is the same either way.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'four sizes',
      blurb: 'The first 16 hex digits of each SHA-3 digest of your text.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "import hashlib\ndata = {$text}.encode()\n{name: hashlib.new(name, data).hexdigest()[:16] for name in ['sha3_224', 'sha3_256', 'sha3_384', 'sha3_512']}",
      cases: [
        { id: 'abc',   label: 'abc',   values: { text: 'abc' } },
        { id: 'empty', label: 'empty', values: { text: '' } },
        { id: 'hello', label: 'hello', values: { text: 'hello' } },
      ],
    },
    {
      id: 'vs',
      label: 'SHA-3 vs SHA-2',
      blurb: 'sha3_256 and sha256 both give 32 bytes — and completely different values.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import hashlib\ndata = {$text}.encode()\n(hashlib.sha256(data).hexdigest()[:16], hashlib.sha3_256(data).hexdigest()[:16])',
      cases: [
        { id: 'abc',   label: 'abc',   values: { text: 'abc' } },
        { id: 'hello', label: 'hello', values: { text: 'hello' } },
      ],
    },
  ],
  demoExplainer: 'SHA3-256 of "abc" begins 3a985da7 while SHA-256 of "abc" begins ba7816bf: equal sizes, unrelated algorithms. The empty string has its own well-known SHA3-256, a7ffc6f8…434a — not c5d24601…a470, which is Ethereum\'s Keccak-256 of the empty string (the pre-standard padding).',

  patterns: [
    {
      name: 'SHA3-256 checksum',
      desc: 'Drop-in where a spec names SHA3-256.',
      code: "import hashlib\nwith open('artifact.bin', 'rb') as f:\n    digest = hashlib.file_digest(f, 'sha3_256').hexdigest()",
    },
    {
      name: 'HMAC with SHA-3',
      desc: 'hmac accepts any hashlib constructor.',
      code: "import hashlib, hmac\nmac = hmac.new(key, message, hashlib.sha3_256).digest()",
    },
    {
      name: 'Pick by name',
      desc: 'Python names use underscores; OpenSSL spellings such as sha3-256 also work in new().',
      code: "import hashlib\nh = hashlib.new('sha3_512', data)",
    },
  ],

  examples: [
    { title: 'SHA3-256 of "abc"',  code: "import hashlib\nhashlib.sha3_256(b'abc').hexdigest()", returns: "'3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532'" },
    { title: 'SHA3-256 of nothing', code: "import hashlib\nhashlib.sha3_256(b'').hexdigest()", returns: "'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a'" },
    { title: 'Names and sizes',     code: 'import hashlib\n[(h.name, h.digest_size, h.block_size) for h in (hashlib.sha3_224(), hashlib.sha3_256(), hashlib.sha3_384(), hashlib.sha3_512())]', returns: "[('sha3_224', 28, 144), ('sha3_256', 32, 136), ('sha3_384', 48, 104), ('sha3_512', 64, 72)]" },
    { title: 'block_size = 200 - 2 × digest_size', code: "import hashlib\n[200 - 2 * hashlib.new(n).digest_size == hashlib.new(n).block_size for n in ('sha3_224', 'sha3_256', 'sha3_384', 'sha3_512')]", returns: '[True, True, True, True]' },
    { title: 'Not equal to SHA-256', code: "import hashlib\nhashlib.sha3_256(b'abc').hexdigest() == hashlib.sha256(b'abc').hexdigest()", returns: 'False' },
    { title: 'OpenSSL spelling works in new()', code: "import hashlib\nhashlib.new('sha3-256', b'abc').name", returns: "'sha3_256'" },
  ],

  pitfalls: [
    {
      name: 'Upper-case Python name',
      desc: 'Only the exact Python names (sha3_256) and OpenSSL spellings (sha3-256, SHA3-256) are recognised. SHA3_256 is neither.',
      wrong: { label: "new('SHA3_256')", code: "import hashlib\nhashlib.new('SHA3_256')", output: 'ValueError: unsupported hash type SHA3_256' },
      fix:   { label: "new('sha3_256')", code: "import hashlib\nhashlib.new('sha3_256').name", output: "'sha3_256'" },
    },
    {
      name: 'Using sha3_256 where Keccak-256 is required',
      desc: 'Ethereum addresses and Solidity\'s keccak256 use the original Keccak padding, which hashlib does not offer. For the empty input Keccak-256 is c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470; sha3_256 gives something else.',
      wrong: { label: 'sha3_256', code: "import hashlib\nhashlib.sha3_256(b'').hexdigest()[:8]", output: "'a7ffc6f8'" },
      fix:   { label: 'compare before trusting', code: "import hashlib\nhashlib.sha3_256(b'').hexdigest() == 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'", output: 'False' },
    },
  ],

  when: {
    use: [
      'Standards and protocols that name SHA-3',
      'A hedge against a future weakness in SHA-2 (completely different internals)',
      'Simple keyed hashes: sha3(key + msg) is not open to length extension (HMAC is still the conventional choice)',
    ],
    avoid: [
      'Ethereum / Solidity keccak256 → a Keccak library such as pycryptodome',
      'Variable-length output → shake_128 / shake_256',
      'Passwords → pbkdf2_hmac or scrypt',
    ],
  },

  notes: {
    cpython:       'OpenSSL\'s SHA-3 when available (3.9+), otherwise _sha3 — the HACL* implementation since 3.12',
    'Block size':  'For SHA-3 block_size is the sponge rate: 200 bytes of state minus twice the digest size',
    'Version':     'sha3_* and shake_* were added in Python 3.6',
  },

  related: [
    { name: 'hashlib.shake_128 / shake_256', slug: 'shake',  when: 'SHA-3 with any output length' },
    { name: 'hashlib.sha256',                slug: 'sha256', when: 'The SHA-2 equivalent' },
    { name: 'hashlib.blake2b / blake2s',     slug: 'blake2b-blake2s', when: 'Another modern hash, with keys built in' },
    { name: 'hashlib.new',                   slug: 'new',    when: 'Which names are accepted' },
  ],

  faq: [
    {
      q: 'How do I compute SHA-3 in Python?',
      a: "hashlib.sha3_256(data).hexdigest() (or sha3_224 / sha3_384 / sha3_512). Available since Python 3.6 on every platform.",
    },
    {
      q: 'Is hashlib.sha3_256 the same as Keccak-256?',
      a: 'No. SHA-3 was standardised with a different padding than the Keccak submission that Ethereum adopted, so digests differ for every input. hashlib has no Keccak-256; use a crypto library for that.',
    },
    {
      q: 'Should I use SHA-3 instead of SHA-256?',
      a: 'Only if something requires it. SHA-256 is unbroken and far more widely supported; SHA-3 is the standard alternative with a different design.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.sha3_256',
    meta:  'hashlib.sha3_224, sha3_256, sha3_384, sha3_512',
  },

};
