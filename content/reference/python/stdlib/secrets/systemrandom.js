// content/reference/python/stdlib/secrets/systemrandom.js

export const meta = {
  slug:        'systemrandom',
  name:        'secrets.SystemRandom',
  signature:   'secrets.SystemRandom(x=None)',
  blurb:       'The full random.Random API — randint, sample, shuffle, uniform, choices — driven by os.urandom instead of the Mersenne Twister. secrets re-exports random.SystemRandom for secure picks the plain helpers do not cover.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.SystemRandom SystemRandom python secure shuffle secure random sample pick random winners lottery draw cryptographically secure random float randint secure secrets SystemRandom seed ignored System entropy source does not have state',
};

export const method = {
  slug:      'systemrandom',
  name:      'secrets.SystemRandom',
  signature: 'secrets.SystemRandom(x=None)',
  returns:   { type: 'random.SystemRandom', desc: 'A generator object; secrets.SystemRandom is random.SystemRandom, and the argument is ignored.' },

  category:    'secrets class',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'token_*, choice, randbelow and randbits cover tokens and single picks. For everything else — several distinct winners, a shuffled deck, a random float, weighted picks — create a SystemRandom and use the methods you know from random. It cannot be seeded: seed() does nothing and getstate() / setstate() raise NotImplementedError.',

  covers: ['SystemRandom'],

  cheat: {
    commonCall: 'rng = secrets.SystemRandom(); rng.sample(entrants, 3)',
    returns:    'a random.SystemRandom instance with every random.Random method',
    replaces:   'random.sample / shuffle / randint / uniform when the outcome must be unpredictable',
    watchOut:   'A seed is accepted and ignored: results never repeat',
  },

  parameters: [
    { name: 'x', type: 'object', required: false, default: 'None', desc: 'Accepted for compatibility with random.Random(x) and passed to seed(), which ignores it.' },
  ],

  attributes: [
    { name: 'randint(a, b) / randrange(…)', type: 'method', meaning: 'Inherited from random.Random: integers in a range, both ends included for randint.' },
    { name: 'sample(population, k)',        type: 'method', meaning: 'k distinct elements: winners, reviewers, audit samples.' },
    { name: 'shuffle(x)',                   type: 'method', meaning: 'Shuffles a list in place and returns None.' },
    { name: 'choices(population, weights=None, k=1)', type: 'method', meaning: 'k picks with replacement, optionally weighted.' },
    { name: 'random() / uniform(a, b)',     type: 'method', meaning: 'Floats; random() is 53 random bits from os.urandom(7).' },
    { name: 'seed() / getstate() / setstate()', type: 'method', meaning: 'seed() is a stub returning None; the state methods raise NotImplementedError.' },
  ],

  modes: [
    {
      id: 'winners',
      label: 'draw winners',
      blurb: 'k distinct winners out of n entrants, numbered 0 to n - 1. Who wins changes every run; that they are k different, valid entrants does not.',
      params: [
        { name: 'n', type: 'int', hint: 'entrants', input: 'number' },
        { name: 'k', type: 'int', hint: 'winners',  input: 'number' },
      ],
      template: 'import secrets\nrng = secrets.SystemRandom()\nwinners = rng.sample(range({$n}), {$k})\n(len(winners), len(set(winners)), all(0 <= w < {$n} for w in winners))',
      cases: [
        { id: 'three', label: '3 of 100',   values: { n: '100', k: '3' } },
        { id: 'all',   label: '5 of 5',     values: { n: '5', k: '5' } },
        { id: 'big',   label: '10 of 10**9', values: { n: '1000000000', k: '10' } },
        { id: 'zero',  label: '0 of 5',     values: { n: '5', k: '0' } },
        { id: 'many',  label: '6 of 5',     values: { n: '5', k: '6' } },
      ],
    },
    {
      id: 'shuffle',
      label: 'shuffle a deck',
      blurb: 'shuffle reorders the list in place: the order is new every run, the cards are the same.',
      params: [{ name: 'cards', type: 'int', hint: 'cards in the deck', input: 'number' }],
      template: 'import secrets\ndeck = list(range({$cards}))\nsecrets.SystemRandom().shuffle(deck)\n(len(deck), sorted(deck) == list(range({$cards})))',
      cases: [
        { id: 'deck',  label: '52 cards', values: { cards: '52' } },
        { id: 'one',   label: '1 card',   values: { cards: '1' } },
        { id: 'empty', label: '0 cards',  values: { cards: '0' } },
      ],
    },
    {
      id: 'seed',
      label: 'seed is ignored',
      blurb: 'Two SystemRandom objects "seeded" alike, next to two random.Random objects with the same seed: does each pair produce the same 64 bits?',
      params: [{ name: 'seed', type: 'int', hint: 'any seed', input: 'number' }],
      template: 'import random, secrets\na, b = secrets.SystemRandom({$seed}), secrets.SystemRandom({$seed})\nr1, r2 = random.Random({$seed}), random.Random({$seed})\n(a.getrandbits(64) == b.getrandbits(64), r1.getrandbits(64) == r2.getrandbits(64))',
      cases: [
        { id: 's42', label: '42', values: { seed: '42' } },
        { id: 's0',  label: '0',  values: { seed: '0' } },
      ],
    },
  ],
  demoExplainer: 'sample never returns the same entrant twice, so 3 winners are 3 different numbers, and 10 winners out of a billion entrants work without building a list. Asking for more winners than entrants raises ValueError: Sample larger than population or is negative. shuffle keeps every card. The seed tab shows the point of the class: the two SystemRandom(42) objects give different bits, the two random.Random(42) objects identical ones.',

  patterns: [
    {
      name: 'Lottery or giveaway draw',
      desc: 'Sort the entrants first so the input order does not matter, then sample.',
      code: 'import secrets\nrng = secrets.SystemRandom()\nwinners = rng.sample(sorted(entrants), k=3)',
    },
    {
      name: 'Secure shuffle',
      desc: 'Cards, question order, assignment of reviewers.',
      code: 'import secrets\nsecrets.SystemRandom().shuffle(deck)',
    },
    {
      name: 'Weighted secure picks',
      desc: 'choices with weights, drawing from the OS source.',
      code: "import secrets\nrng = secrets.SystemRandom()\nprizes = rng.choices(['gold', 'silver', 'bronze'], weights=[1, 3, 10], k=5)",
    },
    {
      name: 'Pass it where a Random is expected',
      desc: 'Code written against random.Random accepts a SystemRandom unchanged.',
      code: 'import secrets\ndef deal(rng, deck):\n    rng.shuffle(deck)\n    return deck[:5]\nhand = deal(secrets.SystemRandom(), list(range(52)))',
    },
  ],

  examples: [
    { title: 'The same class as random.SystemRandom', code: 'import random, secrets\nsecrets.SystemRandom is random.SystemRandom', returns: 'True' },
    { title: 'A random.Random subclass',   code: 'import random, secrets\nissubclass(secrets.SystemRandom, random.Random)', returns: 'True' },
    { title: 'randint includes both ends', code: 'import secrets\nrng = secrets.SystemRandom()\nsorted({rng.randint(1, 3) for _ in range(500)})', returns: '[1, 2, 3]' },
    { title: 'sample: distinct picks',     code: 'import secrets\nlen(set(secrets.SystemRandom().sample(range(1000), 50)))', returns: '50' },
    { title: 'random() is in [0, 1)',      code: 'import secrets\n0.0 <= secrets.SystemRandom().random() < 1.0', returns: 'True' },
    { title: 'seed() does nothing',        code: 'import secrets\nsecrets.SystemRandom().seed(42) is None', returns: 'True' },
    { title: 'No state to save',           code: 'import secrets\nsecrets.SystemRandom().getstate()', returns: 'NotImplementedError: System entropy source does not have state.' },
  ],

  pitfalls: [
    {
      name: 'Re-seeding to replay a draw',
      desc: 'seed() is a stub, so a SystemRandom draw can never be repeated — by you or by an attacker. If you need a reproducible draw (say, a publicly verifiable one), use random.Random with a published seed instead.',
      wrong: { label: 'SystemRandom + seed', code: 'import secrets\nrng = secrets.SystemRandom(2024)\nfirst = rng.sample(range(10**6), 5)\nrng.seed(2024)\nfirst == rng.sample(range(10**6), 5)', output: 'False' },
      fix:   { label: 'random.Random(seed)',  code: 'import random\nrng = random.Random(2024)\nfirst = rng.sample(range(10**6), 5)\nrng.seed(2024)\nfirst == rng.sample(range(10**6), 5)', output: 'True' },
    },
    {
      name: 'Drawing winners with the random module',
      desc: 'random.sample uses the Mersenne Twister: anyone who knows the seed, or has seen enough of its output, can predict the draw.',
      wrong: { label: 'random.Random(7).sample', code: 'import random\nrandom.Random(7).sample(range(10**6), 3) == random.Random(7).sample(range(10**6), 3)', output: 'True' },
      fix:   { label: 'SystemRandom().sample',   code: 'import secrets\nrng = secrets.SystemRandom()\nrng.sample(range(10**6), 3) == rng.sample(range(10**6), 3)', output: 'False' },
    },
  ],

  when: {
    use: [
      'Several distinct secure picks: rng.sample',
      'Secure shuffles: card games, raffles, assignment',
      'Secure floats and ranges with the familiar random API',
    ],
    avoid: [
      'Tokens and keys → token_urlsafe / token_hex / token_bytes',
      'One element or one number → choice / randbelow',
      'Simulations and tests that must repeat → random.Random(seed)',
    ],
  },

  notes: {
    cpython:      'secrets.py: from random import SystemRandom; secrets.choice and secrets.randbits are bound methods of one module-level instance (_sysrand)',
    'Overrides':  'random(), getrandbits() and randbytes() read os.urandom; seed() is a stub; getstate() / setstate() raise NotImplementedError. Every other method is random.Random\'s own code running on those',
    'Cost':       'Every draw is a system call, so it is slower than random for bulk numbers — rarely relevant for security picks',
  },

  related: [
    { name: 'random.SystemRandom',  slug: 'systemrandom', when: 'The overridden methods in detail',       category: 'stdlib/random' },
    { name: 'random.sample',        slug: 'sample',       when: 'How sample picks distinct elements',     category: 'stdlib/random' },
    { name: 'random.shuffle',       slug: 'shuffle',      when: 'In-place shuffling',                     category: 'stdlib/random' },
    { name: 'secrets.choice',       slug: 'choice',       when: 'A single secure pick' },
    { name: 'secrets.randbelow',    slug: 'randbelow',    when: 'A single secure number' },
    { name: 'NotImplementedError',  slug: 'notimplementederror', when: 'What getstate() / setstate() raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is secrets.SystemRandom?',
      a: 'The class random.SystemRandom, re-exported by secrets: a random.Random subclass whose randomness comes from os.urandom. All Random methods work on it; seeding and saving state do not.',
    },
    {
      q: 'How do I shuffle a list securely in Python?',
      a: 'secrets.SystemRandom().shuffle(the_list). It shuffles in place with the same Fisher-Yates algorithm as random.shuffle, but every swap position comes from the operating system.',
    },
    {
      q: 'How do I pick several unique random items securely?',
      a: 'rng = secrets.SystemRandom(); rng.sample(population, k). For a single item, secrets.choice(population) is enough.',
    },
    {
      q: 'Can I seed secrets.SystemRandom for testing?',
      a: 'No — seed() is ignored and getstate() raises NotImplementedError: System entropy source does not have state. Write the code against a Random instance and pass random.Random(seed) in tests and SystemRandom() in production.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.SystemRandom',
    meta:  'secrets.SystemRandom',
  },

};
