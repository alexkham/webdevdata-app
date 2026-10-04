// content/reference/python/stdlib/random/seed.js

export const meta = {
  slug:        'seed',
  name:        'random.seed',
  signature:   'random.seed(a=None, version=2)',
  blurb:       'Initialize the generator so the same seed replays the same sequence of random numbers: ints by absolute value, str/bytes via SHA-512, None from the operating system.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (str seeding version 2 since 3.2, type check since 3.11)',
  searchTerms: 'random.seed seed python reproducible random numbers same random numbers every time set seed random state Random.seed seed 42 seed string seed none deterministic',
};

export const method = {
  slug:      'seed',
  name:      'random.seed',
  signature: 'random.seed(a=None, version=2)',
  returns:   { type: 'None', desc: 'Nothing; the generator state is replaced and the cached gauss() value is cleared.' },

  category:    'random function',
  version:     'All Python 3 versions (str seeding version 2 since 3.2, type check since 3.11)',
  hasLiveDemo: true,

  subtitle: 'Same seed in, same numbers out, on every platform. An int seed is used by its absolute value, a str or bytes seed is hashed with SHA-512 into an int, and no seed at all means fresh entropy from the operating system.',

  covers: ['seed', 'Random.seed'],

  cheat: {
    commonCall: 'random.seed(42)',
    returns:    'None (it changes the generator state)',
    replaces:   'Saving the numbers you drew to replay a run',
    watchOut:   "seed('42') and seed(42) give different sequences",
  },

  parameters: [
    { name: 'a',       type: 'None | int | float | str | bytes | bytearray', required: false, default: 'None', desc: 'None: seed from os.urandom() (or the time if unavailable). int: its absolute value, all bits used. str/bytes/bytearray: the bytes plus their SHA-512 digest, read as one int. float: its hash(). Anything else raises TypeError (3.11+).' },
    { name: 'version', type: 'int', required: false, default: '2', desc: 'Only affects str and bytes seeds: 1 reproduces the narrower seeding of Python 2 / before 3.2.' },
  ],

  modes: [
    {
      id: 'repeat',
      label: 'replay',
      blurb: 'Seed, draw three numbers, seed again with the same value, draw again: the lists are identical.',
      params: [{ name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' }],
      template: 'import random\nrandom.seed({$seed})\na = [random.randint(1, 100) for _ in range(3)]\nrandom.seed({$seed})\nb = [random.randint(1, 100) for _ in range(3)]\n(a, b, a == b)',
      cases: [
        { id: 'fortytwo', label: 'seed 42',      values: { seed: '42' } },
        { id: 'zero',     label: 'seed 0',       values: { seed: '0' } },
        { id: 'text',     label: "seed 'hello'", values: { seed: 'hello' } },
      ],
    },
    {
      id: 'kinds',
      label: 'seed types',
      blurb: 'The first random() after seeding with different kinds of value. Try a negative int, a float and two strings that differ only in case.',
      params: [{ name: 'seed', type: 'int | float | str', hint: 'an int, a float or a string', input: 'auto' }],
      template: 'import random\nrandom.seed({$seed})\nrandom.random()',
      cases: [
        { id: 'pos',   label: '42',      values: { seed: '42' } },
        { id: 'neg',   label: '-42',     values: { seed: '-42' } },
        { id: 'float', label: '1.5',     values: { seed: '1.5' } },
        { id: 'lower', label: "'hello'", values: { seed: 'hello' } },
        { id: 'upper', label: "'Hello'", values: { seed: 'Hello' } },
      ],
    },
  ],
  demoExplainer: 'seed(42) and seed(-42) produce the same 0.6394267984578837: the C code takes abs() of an int before splitting it into 32-bit words for the Mersenne Twister. A string goes through SHA-512 first, so "hello" and "Hello" land on unrelated states. A float is seeded by its hash(): 1.5 is not 1 or 2, but seed(42.0) equals seed(42) because hash(42.0) == 42.',

  patterns: [
    {
      name: 'Seed from the command line or config',
      desc: 'Values arrive as text: convert to int, or the str seed gives a different sequence.',
      code: 'import random\nimport sys\nrandom.seed(int(sys.argv[1]) if len(sys.argv) > 1 else None)',
    },
    {
      name: 'Seeded test fixture',
      desc: 'A dedicated Random keeps the test reproducible without touching the global generator.',
      code: 'import random\ndef make_users(n, seed=0):\n    rng = random.Random(seed)\n    return [rng.randint(18, 90) for _ in range(n)]',
    },
    {
      name: 'Log the seed you used',
      desc: 'Draw a seed, print it, then seed with it: any surprising run can be replayed later.',
      code: "import random\nimport secrets\nrun_seed = secrets.randbits(32)\nprint(f'seed = {run_seed}')\nrandom.seed(run_seed)",
    },
  ],

  examples: [
    { title: 'Seed, then draw',                    code: 'import random\nrandom.seed(42)\n[random.random() for _ in range(3)]',             returns: '[0.6394267984578837, 0.025010755222666936, 0.27502931836911926]' },
    { title: 'A negative int seeds like its abs()', code: 'import random\nrandom.seed(-42)\n[random.randint(1, 100) for _ in range(3)]',     returns: '[82, 15, 4]' },
    { title: "The str '42' is a different seed",    code: "import random\nrandom.seed('42')\n[random.randint(1, 100) for _ in range(3)]",    returns: '[61, 59, 82]' },
    { title: 'bytes seed like the same str',        code: "import random\nrandom.seed(b'42')\n[random.randint(1, 100) for _ in range(3)]",   returns: '[61, 59, 82]' },
    { title: 'A float seed uses hash()',            code: 'import random\nrandom.seed(42.0)\n[random.randint(1, 100) for _ in range(3)]',     returns: '[82, 15, 4]' },
    { title: 'seed() returns None',                 code: 'import random\nprint(random.seed(42))',                                            returns: 'None' },
    { title: 'Only a few types are accepted',       code: 'import random\nrandom.seed([1, 2, 3])',                                            returns: 'TypeError: The only supported seed types are:\nNone, int, float, str, bytes, and bytearray.' },
  ],

  pitfalls: [
    {
      name: 'Seeding inside the loop',
      desc: 'Every seed() restarts the sequence, so re-seeding before each draw returns the same "random" value again and again. Seed once, before the loop.',
      wrong: { label: 'seed per draw', code: 'import random\nrolls = []\nfor _ in range(3):\n    random.seed(42)\n    rolls.append(random.randint(1, 6))\nrolls', output: '[6, 6, 6]' },
      fix:   { label: 'seed once',     code: 'import random\nrandom.seed(42)\nrolls = []\nfor _ in range(3):\n    rolls.append(random.randint(1, 6))\nrolls', output: '[6, 1, 1]' },
    },
    {
      name: 'A seed read as text',
      desc: "Seeds from sys.argv, environment variables or JSON strings are str. seed('42') hashes the text, so it does not reproduce a run that used seed(42).",
      wrong: { label: 'str seed', code: "import random\nseed_text = '42'\nrandom.seed(seed_text)\n[random.randint(1, 100) for _ in range(3)]", output: '[61, 59, 82]' },
      fix:   { label: 'int(seed)', code: "import random\nseed_text = '42'\nrandom.seed(int(seed_text))\n[random.randint(1, 100) for _ in range(3)]", output: '[82, 15, 4]' },
    },
  ],

  when: {
    use: [
      'Reproducible simulations, tests and bug reports',
      'Demos and tutorials whose output must match the text',
      'Re-randomizing from the OS: random.seed() with no argument',
    ],
    avoid: [
      'Making anything secret: a known seed means known output → secrets',
      'Library code: seeding the shared global generator changes it for every other module → use random.Random(seed)',
      'Reproducing NumPy results: numpy.random has its own, separate generators',
    ],
  },

  notes: {
    cpython: 'random.py converts str/bytes (version 2: int.from_bytes(a + sha512(a).digest())) and checks the type; _random.Random.seed in Modules/_randommodule.c takes abs() of an int, hash() of anything else, splits it into 32-bit words and runs the Mersenne Twister init_by_array()',
    'Errors':       'TypeError for other types since 3.11; the message wording changed in 3.13 (3.12 starts "The only supported seed types are: None,")',
    'gauss() cache': 'seed() also clears the second value gauss() keeps for its next call, so seeding fully resets gauss() too',
    'Random.seed':  'The module function is the bound method of a hidden Random instance; rng.seed(x) does the same for your own instance',
  },

  related: [
    { name: 'getstate / setstate', slug: 'getstate-setstate', when: 'Save and restore the exact state mid-sequence' },
    { name: 'random.Random',        slug: 'random-class',      when: 'A separately seeded generator' },
    { name: 'random.random',        slug: 'random',            when: 'The first number after seeding' },
    { name: 'hash()',               slug: 'hash',              when: 'How float seeds are turned into ints', category: 'functions' },
    { name: 'random module',        slug: 'random',            when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does random.seed() do in Python?',
      a: 'It resets the generator\'s internal state from the value you give. After random.seed(42) the sequence of random(), randint(), choice() and so on is always the same, so a run can be reproduced exactly.',
    },
    {
      q: 'Does random.seed(42) give the same numbers on every computer?',
      a: 'Yes for random(), randint(), randrange(), choice(), choices(), sample(), shuffle() and getrandbits(): they are integer and IEEE arithmetic only. gauss() and the other distributions call the C math library, which can differ in the last digit between platforms. Across Python versions only random() is guaranteed to stay the same.',
    },
    {
      q: 'What does random.seed() with no argument do?',
      a: 'It reseeds from os.urandom() (or, if that is unavailable, from the current time and process id). That is also what happens automatically when the module is imported.',
    },
    {
      q: 'Why does random.seed("42") give different numbers than random.seed(42)?',
      a: 'A str seed is encoded to UTF-8 bytes, the SHA-512 digest is appended, and that whole byte string is read as one big int. The int 42 is used directly, so the two seeds start from unrelated states.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.seed',
    meta:  'random.seed',
  },
};
