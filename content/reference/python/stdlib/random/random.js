// content/reference/python/stdlib/random/random.js

export const meta = {
  slug:        'random',
  name:        'random.random',
  signature:   'random.random()',
  blurb:       'The next random float in the half-open range 0.0 <= x < 1.0: a multiple of 2**-53, built from two 32-bit Mersenne Twister outputs.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'random.random random float python random number between 0 and 1 random decimal probability random() float 0 1 uniform 53 bits',
};

export const method = {
  slug:      'random',
  name:      'random.random',
  signature: 'random.random()',
  returns:   { type: 'float', desc: 'A float x with 0.0 <= x < 1.0; 1.0 itself is never returned.' },

  category:    'random function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'The building block of the module: uniform, triangular, choices and every distribution start from random(). It can return 0.0 but never 1.0, and every result is an exact multiple of 2**-53.',

  covers: ['random'],

  cheat: {
    commonCall: 'random.random()',
    returns:    'float in [0.0, 1.0)',
    replaces:   'Math.random() in JavaScript, rand() / RAND_MAX in C',
    watchOut:   'Not for security; for ints use randint, not int(random() * n)',
  },

  parameters: [],

  modes: [
    {
      id: 'floats',
      label: 'three floats',
      blurb: 'Seed the generator and draw three floats. Every one is at least 0.0 and below 1.0.',
      params: [{ name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' }],
      template: 'import random\nrandom.seed({$seed})\n[random.random() for _ in range(3)]',
      cases: [
        { id: 'fortytwo', label: 'seed 42',      values: { seed: '42' } },
        { id: 'seven',    label: 'seed 7',       values: { seed: '7' } },
        { id: 'text',     label: "seed 'hello'", values: { seed: 'hello' } },
      ],
    },
    {
      id: 'scale',
      label: 'scale it',
      blurb: 'Multiply by n to stretch [0, 1) to [0, n); int() then truncates toward zero.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'n',    type: 'int',       hint: 'the multiplier',     input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nx = random.random()\n(x, x * {$n}, int(x * {$n}))',
      cases: [
        { id: 'ten',     label: 'x 10',  values: { seed: '42', n: '10' } },
        { id: 'hundred', label: 'x 100', values: { seed: '7', n: '100' } },
        { id: 'neg',     label: 'x -10', values: { seed: '42', n: '-10' } },
      ],
    },
    {
      id: 'chance',
      label: 'probability',
      blurb: 'random() < p is True with probability p: a coin that lands heads p of the time.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string',   input: 'auto' },
        { name: 'p',    type: 'float',     hint: 'probability 0 to 1', input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[random.random() < {$p} for _ in range(6)]',
      cases: [
        { id: 'half', label: 'p = 0.5', values: { seed: '42', p: '0.5' } },
        { id: 'high', label: 'p = 0.9', values: { seed: '42', p: '0.9' } },
      ],
    },
  ],
  demoExplainer: 'With seed 42 the first float is 0.6394267984578837: times 10 that is 6.394267984578837 and int() keeps 6. Times -10, int() truncates -6.394267984578837 toward zero, giving -6, not -7. The probability tab compares the same six floats with p, so raising p can only turn False into True.',

  patterns: [
    {
      name: 'Do something with probability p',
      desc: 'True about p of the time.',
      code: 'import random\nif random.random() < 0.05:\n    log_debug_sample(request)',
    },
    {
      name: 'A float in [a, b)',
      desc: 'What uniform(a, b) computes.',
      code: 'import random\nx = a + (b - a) * random.random()',
    },
    {
      name: 'Jitter for retries',
      desc: 'Randomize back-off delays so clients do not retry in lockstep.',
      code: 'import random\nimport time\ntime.sleep(base_delay * (1 + random.random()))',
    },
  ],

  examples: [
    { title: 'Three floats after seeding',   code: 'import random\nrandom.seed(42)\n[random.random() for _ in range(3)]',          returns: '[0.6394267984578837, 0.025010755222666936, 0.27502931836911926]' },
    { title: 'Always below 1.0',              code: 'import random\nrandom.random() < 1.0',                                          returns: 'True' },
    { title: 'Scale to [5, 10)',              code: 'import random\nrandom.seed(42)\nlo, hi = 5.0, 10.0\nlo + (hi - lo) * random.random()', returns: '8.19713399228942' },
    { title: 'Events with probability 0.5',   code: 'import random\nrandom.seed(42)\n[random.random() < 0.5 for _ in range(6)]',      returns: '[False, True, True, True, False, False]' },
    { title: 'An exact multiple of 2**-53',   code: 'import random\nrandom.seed(42)\nx = random.random()\nx * 2 ** 53 == int(x * 2 ** 53)', returns: 'True' },
    { title: 'Round for display',             code: 'import random\nrandom.seed(42)\nround(random.random() * 100, 2)',                returns: '63.94' },
    { title: 'It takes no arguments',         code: 'import random\nrandom.random(5)',                                               returns: 'TypeError: Random.random() takes no arguments (1 given)' },
  ],

  pitfalls: [
    {
      name: 'Calling the module',
      desc: 'After import random, the name random is the module; the function is random.random. (from random import random binds the function instead.)',
      wrong: { label: 'random()',        code: 'import random\nrandom()',                          output: "TypeError: 'module' object is not callable. Did you mean: 'random.random(...)'?" },
      fix:   { label: 'random.random()', code: 'import random\nrandom.seed(42)\nrandom.random()', output: '0.6394267984578837' },
    },
    {
      name: 'int(random() * n) for dice',
      desc: 'Scaling gives 0 to n-1, never n, so a "die" built this way shows 0 and never 6. randint(1, 6) includes both ends and draws from getrandbits, so the sequence is also different.',
      wrong: { label: 'int(random() * 6)', code: 'import random\nrandom.seed(42)\n[int(random.random() * 6) for _ in range(10)]', output: '[3, 0, 1, 1, 4, 4, 5, 0, 2, 0]' },
      fix:   { label: 'randint(1, 6)',     code: 'import random\nrandom.seed(42)\n[random.randint(1, 6) for _ in range(10)]',     output: '[6, 1, 1, 6, 3, 2, 2, 2, 6, 1]' },
    },
  ],

  when: {
    use: [
      'Probabilities: random() < p',
      'A raw uniform float to transform yourself',
      'Jitter, sampling rates, randomized thresholds',
    ],
    avoid: [
      'Integers → randint / randrange (exactly uniform, no float rounding)',
      'A float in another range → uniform(a, b)',
      'Anything secret → secrets',
    ],
  },

  notes: {
    cpython: 'Modules/_randommodule.c random_random: a = genrand_uint32() >> 5 (27 bits), b = genrand_uint32() >> 6 (26 bits), result (a * 67108864.0 + b) * (1.0 / 9007199254740992.0), i.e. (a * 2**26 + b) / 2**53',
    'Resolution': 'Only the 2**53 evenly spaced multiples of 2**-53 can occur; many other floats in [0, 1), such as most values below 2**-53, are never produced',
    'Stability': 'The docs guarantee random() keeps producing the same sequence for the same seed in future versions',
  },

  related: [
    { name: 'random.uniform', slug: 'uniform',           when: 'A float between a and b' },
    { name: 'randint / randrange', slug: 'randint-randrange', when: 'Integers, both ends included (randint)' },
    { name: 'random.seed',    slug: 'seed',              when: 'Make the floats repeatable' },
    { name: 'round()',        slug: 'round',             when: 'Show fewer digits', category: 'functions' },
    { name: 'random module',  slug: 'random',            when: 'Overview and security note', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Can random.random() return 1.0?',
      a: 'No. The result is (a * 2**26 + b) / 2**53 with a below 2**27 and b below 2**26, so the largest possible value is 1 - 2**-53 = 0.9999999999999999. 0.0 is possible (about one chance in 2**53).',
    },
    {
      q: 'How do I get a random float between two numbers?',
      a: 'random.uniform(a, b), which computes a + (b - a) * random.random(). For an int between two numbers use random.randint(a, b).',
    },
    {
      q: 'How do I get a random number between 0 and 1 in Python?',
      a: 'import random, then random.random(). Call random.seed(n) first if you need the same numbers on every run.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.random',
    meta:  'random.random',
  },
};
