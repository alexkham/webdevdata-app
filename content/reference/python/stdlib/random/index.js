// content/reference/python/stdlib/random/index.js — the random module hub

export const meta = {
  slug:        'index',
  name:        'random',
  signature:   'import random',
  blurb:       'Pseudo-random numbers for simulations, games and sampling: random floats and ints, picks from a sequence, shuffles and statistical distributions — reproducible with a seed, and NOT for security.',
  category:    'numbers',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'random module python random number generator rng mersenne twister seed randint choice shuffle sample choices uniform gauss random float random integer pseudo random reproducible secrets security',
};

export const method = {
  slug: 'index',
  name: 'random',

  category:    'Numbers',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'One hidden Mersenne Twister generator behind a set of module functions: random() for floats, randint() for ints, choice/sample/shuffle for sequences. Seed it and every run repeats exactly. Never use it for passwords or tokens: that is what the secrets module is for.',

  coverClasses: ['Random', 'SystemRandom'],

  imports: ['import random', 'from random import randint, choice, shuffle'],
  facts: [
    { label: 'Generator',  value: 'Mersenne Twister (MT19937): 53-bit floats, period 2**19937-1' },
    { label: 'Security',   value: 'Not cryptographically secure: use secrets (token_hex, token_urlsafe, choice) for passwords, tokens and keys' },
    { label: 'Seeding',    value: 'From os.urandom() at import; random.seed(x) makes the sequence repeatable' },
    { label: 'Module functions', value: 'Bound methods of one hidden random.Random instance; create your own Random() for an independent stream' },
    { label: 'CLI',        value: 'python -m random 6 (3.13+): an int from 1 to 6, a float, or a choice' },
  ],

  modes: [
    {
      id: 'dice',
      label: 'seeded dice',
      blurb: 'Seed the generator and roll ten dice. The same seed always gives the same rolls; a different seed (an int or a string) gives a different sequence.',
      params: [{ name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' }],
      template: 'import random\nrandom.seed({$seed})\n[random.randint(1, 6) for _ in range(10)]',
      cases: [
        { id: 'fortytwo', label: 'seed 42',      values: { seed: '42' } },
        { id: 'negative', label: 'seed -42',     values: { seed: '-42' } },
        { id: 'seven',    label: 'seed 7',       values: { seed: '7' } },
        { id: 'text',     label: "seed 'hello'", values: { seed: 'hello' } },
      ],
    },
    {
      id: 'pick',
      label: 'pick from a list',
      blurb: 'One item, two distinct items, and three items with repeats allowed, from the same seeded generator.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
      ],
      template: 'import random\nrandom.seed({$seed})\nitems = {$items}\n(random.choice(items), random.sample(items, 2), random.choices(items, k=3))',
      cases: [
        { id: 'colors',  label: 'four colors',  values: { seed: '42', items: 'red, green, blue, gold' } },
        { id: 'letters', label: 'five letters', values: { seed: '1', items: 'a, b, c, d, e' } },
        { id: 'one',     label: 'one item',     values: { seed: '42', items: 'solo' } },
        { id: 'empty',   label: 'empty list',   values: { seed: '42', items: '' } },
      ],
    },
  ],
  demoExplainer: 'seed(42) and seed(-42) give identical rolls: an int seed is used by its absolute value. A string seed is hashed with SHA-512 into a large int, so "hello" starts a completely different sequence. In the pick tab, sample() refuses to draw 2 distinct items from a 1-item list (ValueError), while choices() happily repeats; an empty list fails already at choice() with IndexError.',

  patterns: [
    {
      name: 'Reproducible runs',
      desc: 'Seed once at program start (or per test) so a bug or an experiment can be replayed exactly.',
      code: 'import random\nrandom.seed(2026)\nsample = random.sample(population, 100)',
    },
    {
      name: 'An independent generator',
      desc: 'A Random instance has its own state: library code calling random.random() cannot disturb it.',
      code: 'import random\nrng = random.Random(42)\nroll = rng.randint(1, 6)',
    },
    {
      name: 'Secure tokens: secrets, not random',
      desc: 'Passwords, reset links, API keys and session ids need an unpredictable source.',
      code: "import secrets\ntoken = secrets.token_urlsafe(32)\npin = ''.join(secrets.choice('0123456789') for _ in range(6))",
    },
    {
      name: 'Weighted pick',
      desc: 'choices() takes relative weights; k is the number of picks (with replacement).',
      code: "import random\nloot = random.choices(['common', 'rare', 'epic'], weights=[80, 15, 5], k=10)",
    },
  ],

  examples: [
    { title: 'A float in [0.0, 1.0)',        code: 'import random\nrandom.seed(42)\nrandom.random()',                                   returns: '0.6394267984578837' },
    { title: 'Dice: both ends included',      code: 'import random\nrandom.seed(42)\n[random.randint(1, 6) for _ in range(10)]',        returns: '[6, 1, 1, 6, 3, 2, 2, 2, 6, 1]' },
    { title: 'Pick one item',                 code: "import random\nrandom.seed(42)\nrandom.choice(['rock', 'paper', 'scissors'])",    returns: "'scissors'" },
    { title: 'Lottery: six distinct numbers', code: 'import random\nrandom.seed(42)\nrandom.sample(range(1, 50), 6)',                   returns: '[41, 8, 2, 18, 16, 15]' },
    { title: 'Shuffle a list in place',       code: "import random\nrandom.seed(42)\ncards = ['A', 'K', 'Q', 'J']\nrandom.shuffle(cards)\ncards", returns: "['Q', 'K', 'J', 'A']" },
    { title: 'Same seed, same numbers',       code: 'import random\nrandom.seed(42)\na = random.random()\nrandom.seed(42)\nb = random.random()\na == b', returns: 'True' },
    { title: 'Secure tokens come from secrets', code: 'import secrets\nlen(secrets.token_hex(16))',                                       returns: '32' },
  ],

  pitfalls: [
    {
      name: 'Assigning the result of shuffle()',
      desc: 'shuffle() reorders the list in place and returns None, so x = random.shuffle(x) throws the list away.',
      wrong: { label: 'x = shuffle(x)', code: "import random\nrandom.seed(42)\ncards = ['A', 'K', 'Q', 'J']\ncards = random.shuffle(cards)\nprint(cards)", output: 'None' },
      fix:   { label: 'shuffle, then use x', code: "import random\nrandom.seed(42)\ncards = ['A', 'K', 'Q', 'J']\nrandom.shuffle(cards)\ncards", output: "['Q', 'K', 'J', 'A']" },
    },
    {
      name: 'Generating passwords or tokens with random',
      desc: 'Mersenne Twister output is predictable: the same seed reproduces the "secret", and 624 consecutive 32-bit outputs are enough to reconstruct the whole state. Use secrets, which draws from the operating system.',
      wrong: { label: 'random token', code: "import random\nrandom.seed(2026)\n''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=12))", output: "'ess4divu2t01'" },
      fix:   { label: 'secrets token', code: 'import secrets\ntoken = secrets.token_urlsafe(16)\nlen(token)', output: '22' },
    },
  ],

  when: {
    use: [
      'Simulations, games, randomized tests and sampling data',
      'Reproducible experiments: seed() or Random(seed) replays the exact sequence',
      'Shuffling, picking winners, weighted random choices',
    ],
    avoid: [
      'Passwords, tokens, keys, salts, anything an attacker must not guess → secrets',
      'Large numeric arrays of random numbers → numpy.random (vectorized)',
      'Sharing one sequence between threads that must be reproducible → one Random instance per thread',
    ],
  },

  notes: {
    cpython: 'Modules/_randommodule.c implements the Mersenne Twister core (seed, random, getrandbits, getstate, setstate); everything else (randint, choice, shuffle, sample, choices and the distributions) is pure Python in Lib/random.py, built on random(), getrandbits() and _randbelow()',
    'Reproducibility': 'The docs guarantee only that random() keeps producing the same sequence for the same seed; the other algorithms may change between versions (sample() with counts= already differs between 3.12 and 3.13 for zero counts)',
    'Floating point': 'gauss, normalvariate, lognormvariate, expovariate, vonmisesvariate, gammavariate, betavariate, paretovariate, weibullvariate and binomialvariate call math.log/exp/cos/sin/acos/log2 or float **, i.e. the platform C library, so a value can differ in its last digit between Windows, Linux and macOS. random, uniform, triangular, randint, randrange, choice, choices, sample, shuffle and getrandbits are exact on every platform. The demos compute correctly rounded library results; in a fuzz of 2,400 seeded calls per distribution they matched Linux CPython in at least 99.6 percent and Windows CPython in at least 97.8 percent of the draws (gauss differs most on Windows), so the demos round those values',
    'Threads': 'The global functions and Random instances are thread-safe, but threads interleave draws, so seeded results are only reproducible single-threaded',
  },

  related: [
    { name: 'round()',   slug: 'round',  when: 'Display random floats with fewer digits', category: 'functions' },
    { name: 'range',     slug: 'range',  when: 'The population for sample() and choice() over ints', category: 'functions' },
    { name: 'sorted()',  slug: 'sorted', when: 'Turn a set into a sequence before sampling it', category: 'functions' },
    { name: 'collections module', slug: 'collections', when: 'Counter tallies the results of a simulation', category: 'stdlib' },
    { name: 'IndexError', slug: 'indexerror', when: 'What choice() raises on an empty sequence', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Is Python random truly random?',
      a: 'No. It is a pseudo-random generator (Mersenne Twister): every output follows deterministically from its internal state of 624 32-bit words. At import the state is seeded from os.urandom(), so unseeded runs differ, but the numbers are statistically random, not unpredictable.',
    },
    {
      q: 'How do I get the same random numbers every time?',
      a: 'Call random.seed(value) before drawing, or use rng = random.Random(value) and draw from rng. The same seed gives the same sequence on every platform; only the libm-based distributions (gauss and friends) can differ in the last digit.',
    },
    {
      q: 'Can I use random to generate passwords or tokens?',
      a: 'No. The docs say the module "should not be used for security purposes". Use secrets.token_hex(), secrets.token_urlsafe() or secrets.choice(); they read from the operating system\'s cryptographic source (os.urandom).',
    },
    {
      q: 'What is the difference between randint and randrange?',
      a: 'randint(a, b) includes both ends: randint(1, 6) can return 6. randrange(start, stop, step) works like range(): stop is excluded and you can pass a step, e.g. randrange(0, 101, 2) for an even number from 0 to 100.',
    },
    {
      q: 'How do I pick random items without repeats?',
      a: 'random.sample(population, k) returns k distinct positions of the population (no position is picked twice). random.choices(population, k=k) picks with replacement, so items can repeat.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html',
    meta:  'random — Generate pseudo-random numbers',
  },
};
