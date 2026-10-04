// content/reference/python/stdlib/random/random-class.js

export const meta = {
  slug:        'random-class',
  name:        'random.Random',
  signature:   'random.Random(x=None)',
  blurb:       'The generator class behind the module functions: create your own instance for an independent, separately seeded stream of random numbers.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions (seed types restricted since 3.11)',
  searchTerms: 'random.Random Random class python random instance independent random generator rng = random.Random(seed) separate random streams subclass Random VERSION Random.VERSION thread local random',
};

export const method = {
  slug:      'random-class',
  name:      'random.Random',
  signature: 'random.Random(x=None)',
  returns:   { type: 'Random', desc: 'A new generator seeded with x (os.urandom() when x is None).' },

  category:    'random class',
  version:     'All Python 3 versions (seed types restricted since 3.11)',
  hasLiveDemo: true,

  subtitle: 'random.randint() and friends are bound methods of one hidden Random() shared by every module in your program. An instance of your own has its own state: seeding it, or other code drawing from the global one, cannot disturb each other.',

  covers: ['Random', 'Random.VERSION'],

  cheat: {
    commonCall: 'rng = random.Random(42)',
    returns:    'a generator with all the module functions as methods',
    replaces:   'Seeding the shared global generator',
    watchOut:   'Create it once; a new Random(42) per call repeats the first value',
  },

  parameters: [
    { name: 'x', type: 'None | int | float | str | bytes | bytearray', required: false, default: 'None', desc: 'The seed, passed to self.seed(x). Other types raise TypeError since 3.11.' },
  ],

  attributes: [
    { name: 'VERSION', type: 'int', meaning: 'Class attribute 3: the first item of getstate(), checked by setstate().' },
    { name: 'gauss_next', type: 'float | None', meaning: 'Instance attribute: the second value cached by gauss().' },
  ],

  modes: [
    {
      id: 'two',
      label: 'two generators',
      blurb: 'Two instances, two seeds, two independent sequences. Give them the same seed and the sequences match.',
      params: [
        { name: 'seed_a', type: 'int | str', hint: 'seed of a', input: 'auto' },
        { name: 'seed_b', type: 'int | str', hint: 'seed of b', input: 'auto' },
      ],
      template: 'import random\na = random.Random({$seed_a})\nb = random.Random({$seed_b})\n([a.randint(1, 6) for _ in range(5)], [b.randint(1, 6) for _ in range(5)])',
      cases: [
        { id: 'diff', label: 'seeds 1 and 2',  values: { seed_a: '1', seed_b: '2' } },
        { id: 'same', label: 'both 42',        values: { seed_a: '42', seed_b: '42' } },
        { id: 'text', label: "'red' / 'blue'", values: { seed_a: 'red', seed_b: 'blue' } },
      ],
    },
    {
      id: 'isolated',
      label: 'isolated',
      blurb: 'Other code reseeds and uses the global generator in between; your instance does not notice.',
      params: [{ name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' }],
      template: 'import random\nrng = random.Random({$seed})\nrandom.seed(0)\nrandom.random()\n[rng.randint(1, 6) for _ in range(5)]',
      cases: [
        { id: 'fortytwo', label: 'seed 42', values: { seed: '42' } },
        { id: 'seven',    label: 'seed 7',  values: { seed: '7' } },
      ],
    },
  ],
  demoExplainer: 'Random(42) gives 6, 1, 1, 6, 3 whether or not the global generator was reseeded in between, and it is the same sequence random.seed(42) would give the module functions: they are the same class. Two instances with the same seed produce identical sequences; different seeds give unrelated ones.',

  patterns: [
    {
      name: 'Reproducible component',
      desc: 'Accept a seed, keep the generator on the object.',
      code: 'import random\nclass Dealer:\n    def __init__(self, seed=None):\n        self.rng = random.Random(seed)\n    def deal(self, deck, n):\n        return self.rng.sample(deck, n)',
    },
    {
      name: 'One generator per thread',
      desc: 'Avoid contention and interleaving on the global generator.',
      code: 'import random\nimport threading\nlocal = threading.local()\ndef rng():\n    if not hasattr(local, "rng"):\n        local.rng = random.Random()\n    return local.rng',
    },
    {
      name: 'A custom core generator',
      desc: 'Override random() (and ideally getrandbits()); every other method then uses it.',
      code: 'import random\nclass MyRandom(random.Random):\n    def random(self):\n        return my_source() / 2 ** 53\n    def getrandbits(self, k):\n        return my_bits(k)',
    },
  ],

  examples: [
    { title: 'An independent generator',     code: 'import random\nrng = random.Random(42)\n[rng.randint(1, 6) for _ in range(5)]', returns: '[6, 1, 1, 6, 3]' },
    { title: 'Two streams side by side',      code: 'import random\na = random.Random(1)\nb = random.Random(2)\n([a.randint(1, 6) for _ in range(5)], [b.randint(1, 6) for _ in range(5)])', returns: '([2, 5, 1, 3, 1], [1, 1, 1, 3, 2])' },
    { title: 'Same algorithm as the module',  code: 'import random\nrng = random.Random(42)\nrandom.seed(42)\nrng.random() == random.random()', returns: 'True' },
    { title: 'Seed later with .seed()',       code: 'import random\nr = random.Random()\nr.seed(42)\nr.random()', returns: '0.6394267984578837' },
    { title: 'Subclass and add methods',      code: 'import random\nclass Dice(random.Random):\n    def roll(self):\n        return self.randint(1, 6)\nd = Dice(42)\n[d.roll() for _ in range(5)]', returns: '[6, 1, 1, 6, 3]' },
    { title: 'Pickle keeps the position',     code: 'import random\nimport pickle\nrng = random.Random(42)\nrng.random()\nclone = pickle.loads(pickle.dumps(rng))\nrng.random() == clone.random()', returns: 'True' },
    { title: 'Random.VERSION',                code: 'import random\nrandom.Random.VERSION', returns: '3' },
  ],

  pitfalls: [
    {
      name: 'A new seeded generator on every call',
      desc: 'Each Random(42) starts the same sequence again, so a function that builds one per call returns the same "random" value forever. Create it once and reuse it.',
      wrong: { label: 'Random(42) per call', code: 'import random\ndef roll():\n    return random.Random(42).randint(1, 6)\n[roll() for _ in range(5)]', output: '[6, 6, 6, 6, 6]' },
      fix:   { label: 'one instance',        code: 'import random\nrng = random.Random(42)\ndef roll():\n    return rng.randint(1, 6)\n[roll() for _ in range(5)]',  output: '[6, 1, 1, 6, 3]' },
    },
    {
      name: 'Seeding the module and expecting an instance to follow',
      desc: 'random.seed() only reseeds the hidden global instance. Your own Random keeps its state until you call its own seed().',
      wrong: { label: 'random.seed(42)', code: 'import random\nrng = random.Random(1)\nrandom.seed(42)\nrng.random() == 0.6394267984578837', output: 'False' },
      fix:   { label: 'rng.seed(42)',    code: 'import random\nrng = random.Random(1)\nrng.seed(42)\nrng.random() == 0.6394267984578837',    output: 'True' },
    },
  ],

  when: {
    use: [
      'Library and test code that needs reproducible randomness without touching the global generator',
      'Several independent streams (per player, per thread, per simulation run)',
      'Subclassing to plug in another core generator',
    ],
    avoid: [
      'Security → secrets, or SystemRandom',
      'Quick scripts where the module functions are enough',
    ],
  },

  notes: {
    cpython: 'random.Random (Lib/random.py) subclasses _random.Random (Modules/_randommodule.c, the Mersenne Twister). random() and getrandbits() are inherited from the C base, which is why vars(random.Random) does not list them; seed, getstate, setstate and every distribution are defined in Python',
    'Subclassing': '__init_subclass__ picks the integer method: a subclass that defines getrandbits() keeps exact _randbelow; one that only defines random() falls back to a float-based _randbelow',
    'Module functions': 'random.random, random.seed, random.randint … are bound methods of the instance random._inst created at import',
  },

  related: [
    { name: 'SystemRandom',        slug: 'systemrandom',      when: 'The OS-entropy subclass' },
    { name: 'random.seed',         slug: 'seed',              when: 'How the seed argument is used' },
    { name: 'getstate / setstate', slug: 'getstate-setstate', when: 'Save and restore an instance' },
    { name: 'random.random',       slug: 'random',            when: 'The core method every other method uses' },
    { name: 'random module',       slug: 'random',            when: 'All methods, also as module functions', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is random.Random in Python?',
      a: 'The class that implements the Mersenne Twister generator. The module-level functions are methods of one hidden instance; random.Random(seed) creates another, independent one with the same methods (randint, choice, shuffle, gauss, …).',
    },
    {
      q: 'Should I use random.seed() or random.Random(seed)?',
      a: 'In scripts either works. In libraries, tests and anything multi-threaded prefer an instance: random.seed() changes the generator that every other module also uses.',
    },
    {
      q: 'Is random.Random thread-safe?',
      a: 'Each call is thread-safe, but threads sharing one instance interleave their draws, so results are not reproducible, and gauss() can hand the same cached value to two threads. Use one instance per thread.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.Random',
    meta:  'random.Random',
  },
};
