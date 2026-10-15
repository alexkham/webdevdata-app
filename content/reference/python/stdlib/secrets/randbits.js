// content/reference/python/stdlib/secrets/randbits.js

export const meta = {
  slug:        'randbits',
  name:        'secrets.randbits',
  signature:   'secrets.randbits(k)',
  blurb:       'A secure random int made of k random bits: 0 <= result < 2**k. For large random numbers, nonces and IDs kept as integers.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.randbits randbits python random 128 bit number secure random integer k bits getrandbits SystemRandom.getrandbits random large integer number of bits must be non-negative',
};

export const method = {
  slug:      'randbits',
  name:      'secrets.randbits',
  signature: 'secrets.randbits(k)',
  returns:   { type: 'int', desc: 'A non-negative int below 2**k; each of its k bits is random.' },

  category:    'secrets function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'secrets.randbits is SystemRandom.getrandbits: it reads (k + 7) // 8 bytes from os.urandom and shifts off the extra bits. The result is a plain int, so leading zero bits do not show — format it with a fixed width when you need fixed-length text.',

  covers: ['randbits'],

  cheat: {
    commonCall: 'secrets.randbits(128)',
    returns:    'int in range(2**k)',
    replaces:   "int.from_bytes(os.urandom(n)) and random.getrandbits(k) for secrets",
    watchOut:   'bit_length() can be smaller than k: the top bits may be 0',
  },

  parameters: [
    { name: 'k', type: 'int', required: true, default: null, desc: 'Number of random bits, 0 or more. 0 always returns 0; a negative k raises ValueError.' },
  ],

  modes: [
    {
      id: 'hex',
      label: 'fixed-width hex',
      blurb: 'Draw k bits and format them as hex with (k + 3) // 4 digits, so the text length never depends on the value.',
      params: [{ name: 'k', type: 'int', hint: 'bits', input: 'number' }],
      template: "import secrets\nk = {$k}\nx = secrets.randbits(k)\ntext = f'{x:0{(k + 3) // 4}x}'\n(len(text), x < 2 ** k)",
      cases: [
        { id: 'b64',  label: '64 bits',  values: { k: '64' } },
        { id: 'b128', label: '128 bits', values: { k: '128' } },
        { id: 'b10',  label: '10 bits',  values: { k: '10' } },
        { id: 'b0',   label: '0 bits',   values: { k: '0' } },
        { id: 'neg',  label: '-1',       values: { k: '-1' } },
      ],
    },
    {
      id: 'range',
      label: 'smallest and largest',
      blurb: '1000 draws of a few bits: the smallest and largest value seen, next to the largest possible one, 2**k - 1. The browser demo stops above 5 bits, where the first two values would change from run to run.',
      params: [{ name: 'k', type: 'int', hint: 'bits (small)', input: 'number' }],
      template: 'import secrets\ndraws = [secrets.randbits({$k}) for _ in range(1000)]\n(min(draws), max(draws), 2 ** {$k} - 1)',
      cases: [
        { id: 'one',   label: '1 bit',  values: { k: '1' } },
        { id: 'three', label: '3 bits', values: { k: '3' } },
        { id: 'four',  label: '4 bits', values: { k: '4' } },
        { id: 'zero',  label: '0 bits', values: { k: '0' } },
      ],
    },
  ],
  demoExplainer: 'randbits(64) is always below 2**64, and with 16 hex digits of zero padding its text is always 16 characters — without the padding it would be shorter whenever the top bits happen to be 0. randbits(0) is 0 (formatted as the single digit 0), and a negative k raises ValueError: number of bits must be non-negative. With 1, 3 or 4 bits, 1000 draws reach both ends, 0 and 2**k - 1, in practice every time (with more bits that stops being true).',

  patterns: [
    {
      name: '128-bit random number as fixed-width hex',
      desc: '32 hex digits, leading zeros kept.',
      code: "import secrets\nnonce = f'{secrets.randbits(128):032x}'",
    },
    {
      name: 'Random 64-bit ID for a database column',
      desc: 'Fits a signed BIGINT when you keep it to 63 bits.',
      code: 'import secrets\nrow_id = secrets.randbits(63)',
    },
    {
      name: 'Random bytes from bits',
      desc: 'Equivalent amount of randomness as token_bytes(16), as an int first.',
      code: "import secrets\nraw = secrets.randbits(128).to_bytes(16, 'big')",
    },
  ],

  examples: [
    { title: 'Always below 2**k',          code: 'import secrets\nsecrets.randbits(16) < 2**16', returns: 'True' },
    { title: 'k = 0 gives 0',              code: 'import secrets\nsecrets.randbits(0)', returns: '0' },
    { title: 'Never more than k bits',     code: 'import secrets\nsecrets.randbits(128).bit_length() <= 128', returns: 'True' },
    { title: 'Fixed-width hex text',       code: "import secrets\nlen(f'{secrets.randbits(64):016x}')", returns: '16' },
    { title: 'One bit: 0 or 1',            code: 'import secrets\n{secrets.randbits(1) for _ in range(1000)}', returns: '{0, 1}' },
    { title: 'Negative k',                 code: 'import secrets\nsecrets.randbits(-1)', returns: 'ValueError: number of bits must be non-negative' },
    { title: 'It is SystemRandom.getrandbits', code: 'import secrets\nsecrets.randbits.__name__', returns: "'getrandbits'" },
  ],

  pitfalls: [
    {
      name: 'Expecting a fixed number of digits',
      desc: 'A random int can start with zero bits, and hex() / str() drop them. Take 0x00ff as a possible randbits(16) result: pad it with a format width.',
      wrong: { label: 'hex(x)',      code: 'x = 0x00ff  # one possible randbits(16) result\nhex(x)', output: "'0xff'" },
      fix:   { label: "f'{x:04x}'", code: "x = 0x00ff  # one possible randbits(16) result\nf'{x:04x}'", output: "'00ff'" },
    },
    {
      name: 'Using random.getrandbits for nonces or keys',
      desc: 'The Mersenne Twister repeats its output for the same seed, and enough outputs reveal its state. secrets.randbits has no seed.',
      wrong: { label: 'random.getrandbits', code: 'import random\nrandom.Random(1).getrandbits(64) == random.Random(1).getrandbits(64)', output: 'True' },
      fix:   { label: 'secrets.randbits',   code: 'import secrets\nsecrets.randbits(64) == secrets.randbits(64)', output: 'False' },
    },
  ],

  when: {
    use: [
      'Large random integers: nonces, salts or IDs stored as numbers',
      'k-bit values for protocols that specify a bit length',
    ],
    avoid: [
      'A number below an arbitrary bound → randbelow(n) (randbits % n would be biased)',
      'Text tokens → token_hex / token_urlsafe',
      'Raw bytes → token_bytes',
    ],
  },

  notes: {
    cpython:   'randbits = _sysrand.getrandbits — SystemRandom.getrandbits: if k < 0: raise ValueError; numbytes = (k + 7) // 8; x = int.from_bytes(_urandom(numbytes)); return x >> (numbytes * 8 - k)',
    'Width':   'The value has at most k bits; its bit_length() is smaller whenever the top bits are 0 (half of all draws for the topmost bit)',
  },

  related: [
    { name: 'secrets.randbelow',    slug: 'randbelow',    when: 'A random int below any bound' },
    { name: 'secrets.token_bytes',  slug: 'token_bytes',  when: 'Randomness as bytes' },
    { name: 'secrets.SystemRandom', slug: 'systemrandom', when: 'The class that provides getrandbits' },
    { name: 'random.getrandbits / randbytes', slug: 'getrandbits-randbytes', when: 'The seeded, predictable version', category: 'stdlib/random' },
  ],

  faq: [
    {
      q: 'How do I generate a random 128-bit number in Python?',
      a: "secrets.randbits(128) — an int from 0 to 2**128 - 1. For fixed-length hex text use f'{secrets.randbits(128):032x}', or simply secrets.token_hex(16).",
    },
    {
      q: 'What is the difference between secrets.randbits and random.getrandbits?',
      a: 'Same signature and range. random.getrandbits comes from the seedable Mersenne Twister and is predictable; secrets.randbits is SystemRandom.getrandbits, which reads os.urandom.',
    },
    {
      q: 'Why is the bit_length() of randbits(k) sometimes less than k?',
      a: 'The top bit is 0 in half of all draws, the top two bits in a quarter, and so on; int drops leading zeros. All k bits are still random — pad when you format the value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.randbits',
    meta:  'secrets.randbits',
  },

};
