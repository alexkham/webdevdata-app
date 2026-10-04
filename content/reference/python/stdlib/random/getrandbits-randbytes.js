// content/reference/python/stdlib/random/getrandbits-randbytes.js
// random.getrandbits and random.randbytes

export const meta = {
  slug:        'getrandbits-randbytes',
  name:        'random.getrandbits / randbytes',
  signature:   'random.getrandbits(k) / random.randbytes(n)',
  blurb:       'Raw randomness: getrandbits(k) returns a non-negative int with k random bits, randbytes(n) returns n random bytes (3.9+). Not for keys or tokens.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'getrandbits: all Python 3 versions (k=0 since 3.9); randbytes: Python 3.9+',
  searchTerms: 'random.getrandbits random.randbytes getrandbits randbytes python random bits random bytes random 64 bit integer random hex number of bits must be non-negative Random.randbytes token_bytes',
};

export const method = {
  slug:      'getrandbits-randbytes',
  name:      'random.getrandbits / randbytes',
  signature: 'random.getrandbits(k) / random.randbytes(n)',
  returns:   { type: 'int | bytes', desc: 'getrandbits: an int with 0 <= x < 2**k. randbytes: a bytes object of length n.' },

  category:    'random function',
  version:     'getrandbits: all Python 3 versions (k=0 since 3.9); randbytes: Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'getrandbits() is the integer source behind randrange, randint, choice, shuffle and sample. randbytes(n) is just getrandbits(n * 8) written out little-endian. Both are predictable: for secrets use secrets.token_bytes / randbits.',

  covers: ['getrandbits', 'randbytes', 'Random.randbytes'],

  cheat: {
    commonCall: 'random.getrandbits(64)',
    returns:    'int below 2**k / bytes of length n',
    replaces:   'Building ints from several random() calls',
    watchOut:   'Up to k bits: leading zero bits make bit_length() smaller',
  },

  parameters: [
    { name: 'k', type: 'int', required: true, default: null, desc: 'getrandbits: number of bits, >= 0 (0 allowed since 3.9 and returns 0).' },
    { name: 'n', type: 'int', required: true, default: null, desc: 'randbytes: number of bytes, >= 0.' },
  ],

  modes: [
    {
      id: 'bits',
      label: 'getrandbits',
      blurb: 'k random bits as an int, with its bit_length(): never more than k, sometimes less.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'k',    type: 'int',       hint: 'number of bits',     input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nx = random.getrandbits({$k})\n(x, x.bit_length())',
      cases: [
        { id: 'eight', label: 'k=8',  values: { seed: '42', k: '8' } },
        { id: 'sixteen', label: 'k=16', values: { seed: '42', k: '16' } },
        { id: 'sixtyfour', label: 'k=64', values: { seed: '42', k: '64' } },
        { id: 'zero',  label: 'k=0',  values: { seed: '42', k: '0' } },
        { id: 'neg',   label: 'k=-1', values: { seed: '42', k: '-1' } },
      ],
    },
    {
      id: 'bytes',
      label: 'randbytes',
      blurb: 'n random bytes. Printable bytes show as characters in the repr, the rest as \\x escapes.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'n',    type: 'int',       hint: 'number of bytes',    input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.randbytes({$n})',
      cases: [
        { id: 'eight', label: 'n=8', values: { seed: '42', n: '8' } },
        { id: 'six',   label: 'n=6', values: { seed: '1', n: '6' } },
        { id: 'zero',  label: 'n=0', values: { seed: '42', n: '0' } },
      ],
    },
    {
      id: 'hex',
      label: 'as hex',
      blurb: 'bytes.hex() turns the bytes into a hex string: two characters per byte.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'n',    type: 'int',       hint: 'number of bytes',    input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.randbytes({$n}).hex()',
      cases: [
        { id: 'four',    label: 'n=4',  values: { seed: '42', n: '4' } },
        { id: 'sixteen', label: 'n=16', values: { seed: '42', n: '16' } },
      ],
    },
  ],
  demoExplainer: 'For k <= 32 one 32-bit Mersenne Twister word is drawn and shifted right, so getrandbits(8) is the top 8 bits of the word. Larger k fills 32-bit words from the least significant end. randbytes(4) after seed 42 is 9d79b1a3, the same word as getrandbits(32) = 0xa3b1799d written little-endian.',

  patterns: [
    {
      name: 'A random 64-bit id (non-secret)',
      desc: 'Fast, uniform, reproducible with a seed.',
      code: "import random\nrow_id = random.getrandbits(64)\nlabel = f'{row_id:016x}'",
    },
    {
      name: 'Random test data',
      desc: 'Seeded bytes for fuzzing a parser.',
      code: 'import random\nrng = random.Random(1234)\npayload = rng.randbytes(1024)',
    },
    {
      name: 'Secure bytes and bits',
      desc: 'Same shape, unpredictable source.',
      code: 'import secrets\nkey = secrets.token_bytes(32)\nnonce = secrets.randbits(96)',
    },
  ],

  examples: [
    { title: '8 random bits',                   code: 'import random\nrandom.seed(42)\nrandom.getrandbits(8)',                              returns: '163' },
    { title: 'Coin flips as single bits',       code: 'import random\nrandom.seed(42)\n[random.getrandbits(1) for _ in range(10)]',       returns: '[1, 0, 0, 1, 0, 0, 0, 0, 1, 0]' },
    { title: 'A 64-bit value',                  code: 'import random\nrandom.seed(42)\nrandom.getrandbits(64)',                             returns: '2053695854357871005' },
    { title: 'k=0 returns 0 (3.9+)',            code: 'import random\nrandom.seed(42)\nrandom.getrandbits(0)',                              returns: '0' },
    { title: 'Eight random bytes',              code: 'import random\nrandom.seed(42)\nrandom.randbytes(8)',                                returns: "b'\\x9dy\\xb1\\xa3\\x7f1\\x80\\x1c'" },
    { title: 'randbytes = getrandbits, little-endian', code: "import random\nrandom.seed(42)\na = random.randbytes(4)\nrandom.seed(42)\nb = random.getrandbits(32).to_bytes(4, 'little')\na == b", returns: 'True' },
    { title: 'As a zero-padded hex string',     code: "import random\nrandom.seed(42)\nf'{random.getrandbits(32):08x}'",                  returns: "'a3b1799d'" },
    { title: 'Negative sizes',                  code: 'import random\nrandom.getrandbits(-1)',                                              returns: 'ValueError: number of bits must be non-negative' },
  ],

  pitfalls: [
    {
      name: 'Expecting exactly k bits',
      desc: 'getrandbits(k) is uniform below 2**k, so the top bits can be 0 and bit_length() is often smaller than k. Pad when you format it.',
      wrong: { label: 'bit_length()',  code: 'import random\nrandom.seed(42)\nrandom.getrandbits(256).bit_length()',            output: '254' },
      fix:   { label: 'zero-padded',   code: "import random\nrandom.seed(42)\nlen(f'{random.getrandbits(256):0256b}')",          output: '256' },
    },
    {
      name: 'Keys and tokens from randbytes',
      desc: 'The docs say randbytes "should not be used for generating security tokens": anyone who knows the seed, or enough outputs, can reproduce it. secrets.token_bytes reads os.urandom.',
      wrong: { label: 'random.randbytes', code: 'import random\nrandom.seed(42)\nrandom.randbytes(4).hex()', output: "'9d79b1a3'" },
      fix:   { label: 'secrets.token_bytes', code: 'import secrets\nlen(secrets.token_bytes(16))', output: '16' },
    },
  ],

  when: {
    use: [
      'Uniform integers of a given bit width: hashes for tests, ids, bit masks',
      'Reproducible random bytes for tests and fuzzing',
      'A custom Random subclass: supplying getrandbits enables arbitrarily large randrange',
    ],
    avoid: [
      'Keys, nonces, tokens, salts → secrets.token_bytes / secrets.randbits',
      'An int in a range that is not a power of two → randrange (it rejects out-of-range draws for you)',
    ],
  },

  notes: {
    cpython: 'getrandbits is C (Modules/_randommodule.c): k <= 32 returns genrand_uint32() >> (32 - k); larger k fills 32-bit words least significant first, trimming the last word. Random.randbytes in Lib/random.py is self.getrandbits(n * 8).to_bytes(n, "little")',
    'Errors': 'ValueError: number of bits must be non-negative for k < 0 (also randbytes(-1), via n * 8); TypeError for floats',
    'Platforms': 'Pure integer operations: identical results everywhere',
  },

  related: [
    { name: 'randint / randrange', slug: 'randint-randrange', when: 'Ints in any range, built on getrandbits' },
    { name: 'random.seed',     slug: 'seed',        when: 'Make the bits reproducible' },
    { name: 'int.bit_length()', slug: 'int-bit_length', when: 'How many bits the result really uses', category: 'functions' },
    { name: 'int.to_bytes()',  slug: 'int-to_bytes',   when: 'What randbytes does with the bits', category: 'functions' },
    { name: 'bytes.hex()',     slug: 'bytes-hex',      when: 'Show the bytes as hex', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I generate random bytes in Python?',
      a: 'random.randbytes(n) (3.9+) for reproducible, non-secret bytes; secrets.token_bytes(n) or os.urandom(n) for anything security related.',
    },
    {
      q: 'Is getrandbits(k) uniform?',
      a: 'Yes: every int from 0 to 2**k - 1 is equally likely. randrange builds on it by drawing bit_length(n) bits and retrying when the value is >= n.',
    },
    {
      q: 'Why is random.getrandbits(256).bit_length() less than 256?',
      a: 'The leading bits are random too; whenever the top bit is 0 the number is shorter. About half of all results have bit_length() < k.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.getrandbits',
    meta:  'random.getrandbits and random.randbytes',
  },
};
