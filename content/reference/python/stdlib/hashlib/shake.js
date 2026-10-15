// content/reference/python/stdlib/hashlib/shake.js — shake_128 / shake_256

export const meta = {
  slug:        'shake',
  name:        'hashlib.shake_128 / shake_256',
  signature:   'hashlib.shake_128([data, ]*, usedforsecurity=True) · hashlib.shake_256(…)',
  blurb:       'SHA-3 extendable-output functions: you choose the digest length when you read it — digest(length) and hexdigest(length) require it.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'hashlib.shake_128 hashlib.shake_256 shake_128 shake_256 shake python xof extendable output function variable length hash hexdigest(length) digest(length) hexdigest missing required argument length',
};

export const method = {
  slug:      'shake',
  name:      'hashlib.shake_128 / shake_256',
  signature: 'hashlib.shake_128([data, ]*, usedforsecurity=True) · hashlib.shake_256(…)',
  returns:   { type: 'hash object', desc: 'A SHAKE object: update() and copy() as usual, but digest(length) / hexdigest(length) take the output length in bytes; digest_size is 0.' },

  category:    'hashlib function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'An XOF — extendable-output function: one input, as many output bytes as you ask for. A longer output starts with the shorter one, so the length is part of the call, not of the algorithm. The 128 and 256 are security levels, not output sizes.',

  covers: ['shake_128', 'shake_256'],

  cheat: {
    commonCall: 'hashlib.shake_256(data).hexdigest(32)',
    returns:    'hexdigest(n) → 2n hex characters; digest(n) → n bytes',
    replaces:   'Truncating or concatenating fixed-size digests to get a custom length',
    watchOut:   'digest() / hexdigest() without a length raise TypeError',
  },

  parameters: [
    { name: 'data',            type: 'bytes-like', required: false, default: "b''", desc: 'Initial data, same as an immediate update(data). A str raises TypeError.' },
    { name: 'usedforsecurity', type: 'bool',       required: false, default: 'True', desc: 'Keyword-only (3.9+); no effect on the output.' },
    { name: 'length',          type: 'int',        required: true,  default: null,   desc: 'Argument of digest(length) / hexdigest(length): the number of output bytes. 0 gives an empty result. A negative length is not range-checked in CPython 3.13: digest(-1) raises SystemError and hexdigest(-1) MemoryError.' },
  ],

  modes: [
    {
      id: 'length',
      label: 'choose the length',
      blurb: 'The same input read at different lengths: each longer output begins with the shorter one.',
      params: [
        { name: 'text',   type: 'str', hint: 'any text',     input: 'text' },
        { name: 'length', type: 'int', hint: 'output bytes', input: 'number' },
      ],
      template: 'import hashlib\nhashlib.shake_128({$text}.encode()).hexdigest({$length})',
      cases: [
        { id: 'eight',   label: '8 bytes',     values: { text: 'abc', length: '8' } },
        { id: 'sixteen', label: '16 bytes',    values: { text: 'abc', length: '16' } },
        { id: 'empty',   label: 'empty input', values: { text: '', length: '16' } },
        { id: 'zero',    label: 'length 0',    values: { text: 'abc', length: '0' } },
      ],
    },
    {
      id: 'both',
      label: '128 vs 256',
      blurb: 'shake_128 and shake_256 at the same output length: unrelated values.',
      params: [
        { name: 'text',   type: 'str', hint: 'any text',     input: 'text' },
        { name: 'length', type: 'int', hint: 'output bytes', input: 'number' },
      ],
      template: 'import hashlib\ndata = {$text}.encode()\n(hashlib.shake_128(data).hexdigest({$length}), hashlib.shake_256(data).hexdigest({$length}))',
      cases: [
        { id: 'abc8',  label: 'abc, 8',  values: { text: 'abc', length: '8' } },
        { id: 'abc16', label: 'abc, 16', values: { text: 'abc', length: '16' } },
      ],
    },
  ],
  demoExplainer: 'shake_128("abc") at 8 bytes is 5881092dd818bf5c, and at 16 bytes the output starts with exactly those 16 hex digits — the sponge just keeps squeezing. Length 0 gives an empty string. shake_256 at the same length shares nothing with shake_128.',

  patterns: [
    {
      name: 'A short, fixed-length ID from data',
      desc: 'Ask for exactly the bytes you need instead of cutting a longer digest.',
      code: "import hashlib\nshort_id = hashlib.shake_256(url.encode()).hexdigest(8)  # 16 hex characters",
    },
    {
      name: 'Derive several values from one input',
      desc: 'Read one long output and slice it.',
      code: "import hashlib\nstream = hashlib.shake_256(master_key + b'context').digest(64)\nkey_a, key_b = stream[:32], stream[32:]",
    },
  ],

  examples: [
    { title: 'The docs example',       code: "import hashlib\nhashlib.shake_256(b'Nobody inspects the spammish repetition').hexdigest(20)", returns: "'44709d6fcb83d92a76dcb0b668c98e1b1d3dafe7'" },
    { title: 'Shorter output is a prefix', code: "import hashlib\nh = hashlib.shake_128(b'abc')\nh.hexdigest(8).startswith(h.hexdigest(4))", returns: 'True' },
    { title: 'Raw bytes',              code: "import hashlib\nhashlib.shake_128(b'abc').digest(5)", returns: "b'X\\x81\\t-\\xd8'" },
    { title: 'Any length',             code: "import hashlib\nlen(hashlib.shake_128(b'seed').digest(1000))", returns: '1000' },
    { title: 'digest_size is 0',       code: 'import hashlib\n[(h.name, h.digest_size, h.block_size) for h in (hashlib.shake_128(), hashlib.shake_256())]', returns: "[('shake_128', 0, 168), ('shake_256', 0, 136)]" },
    { title: 'Length is required',     code: "import hashlib\nhashlib.shake_128(b'abc').hexdigest()", returns: "TypeError: hexdigest() missing required argument 'length' (pos 1)" },
  ],

  pitfalls: [
    {
      name: 'Calling hexdigest() without a length',
      desc: 'Code written for sha256 breaks when the algorithm name becomes shake_*: the output length must be passed.',
      wrong: { label: 'hexdigest()',   code: "import hashlib\nhashlib.new('shake_256', b'abc').hexdigest()", output: "TypeError: hexdigest() missing required argument 'length' (pos 1)" },
      fix:   { label: 'hexdigest(32)', code: "import hashlib\nhashlib.new('shake_256', b'abc').hexdigest(32)[:16]", output: "'483366601360a877'" },
    },
    {
      name: 'Expecting shake_256(x).hexdigest(32) to equal sha3_256(x)',
      desc: 'Both are Keccak sponges, but SHAKE uses a different domain-separation suffix, so outputs never match.',
      wrong: { label: 'assume equal', code: "import hashlib\nhashlib.shake_256(b'abc').hexdigest(32) == hashlib.sha3_256(b'abc').hexdigest()", output: 'False' },
      fix:   { label: 'use the named algorithm', code: "import hashlib\nhashlib.sha3_256(b'abc').hexdigest()[:16]", output: "'3a985da74fe225b2'" },
    },
  ],

  when: {
    use: [
      'Outputs of a non-standard length (short IDs, key material of a given size)',
      'Protocols that specify SHAKE128 / SHAKE256 (e.g. Ed448, some post-quantum schemes)',
    ],
    avoid: [
      'Code that calls hexdigest() generically → a fixed-size algorithm',
      'Passwords → pbkdf2_hmac or scrypt (pbkdf2_hmac rejects SHAKE)',
    ],
  },

  notes: {
    cpython:      'OpenSSL\'s SHAKE when available, else _sha3; the object type is _hashlib.HASHXOF (OpenSSL) or _sha3.shake_128',
    'Security':   'shake_128 offers up to 128 bits of security and shake_256 up to 256, whatever length you read',
    'Sizes':      'digest_size 0 (no fixed size); block_size is the rate: 168 for shake_128, 136 for shake_256',
  },

  related: [
    { name: 'sha3_*',                 slug: 'sha3',         when: 'Fixed-size SHA-3' },
    { name: 'update / digest / hexdigest', slug: 'hash-methods', when: 'The shared hash object API' },
    { name: 'hashlib.blake2b',        slug: 'blake2b-blake2s', when: 'Fixed but configurable digest_size' },
    { name: 'MemoryError',            slug: 'memoryerror',  when: 'What hexdigest(-1) raises in 3.13', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does shake_128().hexdigest() need an argument?',
      a: 'SHAKE has no natural output size; you choose it. hexdigest(16) returns 16 bytes as 32 hex characters.',
    },
    {
      q: 'What is the difference between shake_128 and shake_256?',
      a: 'The internal capacity and therefore the security level (128 vs 256 bits). Both can produce any output length, and their outputs are unrelated.',
    },
    {
      q: 'Is a longer SHAKE output more secure?',
      a: 'Only up to the function\'s security level: shake_128 read at 64 bytes is still a 128-bit-secure function. Use shake_256 for higher security.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#shake-variable-length-digests',
    meta:  'SHAKE variable length digests',
  },

};
