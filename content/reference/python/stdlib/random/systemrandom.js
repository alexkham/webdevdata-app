// content/reference/python/stdlib/random/systemrandom.js

export const meta = {
  slug:        'systemrandom',
  name:        'random.SystemRandom',
  signature:   'random.SystemRandom(x=None)',
  blurb:       'A Random subclass that draws from os.urandom(), the operating system\'s cryptographic source: same methods, unpredictable, not reproducible — seed() is ignored and getstate()/setstate() raise.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'All Python 3 versions',
  searchTerms: 'random.SystemRandom SystemRandom python secure random os.urandom cryptographically secure random number secrets SystemRandom.random SystemRandom.getrandbits SystemRandom.randbytes SystemRandom.seed SystemRandom.getstate SystemRandom.setstate System entropy source does not have state',
};

export const method = {
  slug:      'systemrandom',
  name:      'random.SystemRandom',
  signature: 'random.SystemRandom(x=None)',
  returns:   { type: 'SystemRandom', desc: 'A generator backed by os.urandom(); the argument is accepted and ignored.' },

  category:    'random class',
  version:     'All Python 3 versions',
  hasLiveDemo: false,

  subtitle: 'Every method of Random (randint, choice, sample, shuffle, gauss …) but fed by the operating system instead of the Mersenne Twister. Its output cannot be predicted or replayed, so this page has no live demo. secrets.SystemRandom is the same class.',

  covers: ['SystemRandom', 'SystemRandom.random', 'SystemRandom.getrandbits', 'SystemRandom.randbytes', 'SystemRandom.seed', 'SystemRandom.getstate', 'SystemRandom.setstate'],

  cheat: {
    commonCall: 'rng = random.SystemRandom(); rng.randint(1, 6)',
    returns:    'the usual Random methods, unpredictable values',
    replaces:   'random.* when values must not be guessable',
    watchOut:   'seed() does nothing; getstate()/setstate() raise NotImplementedError',
  },

  parameters: [
    { name: 'x', type: 'object', required: false, default: 'None', desc: 'Passed to seed(), which ignores it.' },
  ],

  attributes: [
    { name: 'random()',       type: 'method', meaning: 'Overridden: 56 bits from os.urandom(7), shifted to 53 bits, times 2**-53.' },
    { name: 'getrandbits(k)', type: 'method', meaning: 'Overridden: (k + 7) // 8 bytes from os.urandom, extra bits shifted off. ValueError for k < 0.' },
    { name: 'randbytes(n)',   type: 'method', meaning: 'Overridden: os.urandom(n) directly.' },
    { name: 'seed(*args, **kwds)', type: 'method', meaning: 'Stub: does nothing and returns None.' },
    { name: 'getstate() / setstate(state)', type: 'method', meaning: 'Raise NotImplementedError: System entropy source does not have state.' },
  ],

  patterns: [
    {
      name: 'Secure picks with the familiar API',
      desc: 'sample, shuffle and choices with an unpredictable source.',
      code: 'import random\nsecure = random.SystemRandom()\nwinners = secure.sample(entrants, 3)\nsecure.shuffle(deck)',
    },
    {
      name: 'Prefer secrets for tokens',
      desc: 'The secrets module wraps the same source with purpose-built helpers.',
      code: "import secrets\ntoken = secrets.token_urlsafe(32)\ncode = secrets.randbelow(1_000_000)\npick = secrets.choice(['a', 'b', 'c'])",
    },
    {
      name: 'Random password',
      desc: 'Uniform characters from the OS source.',
      code: "import secrets\nimport string\nalphabet = string.ascii_letters + string.digits\npassword = ''.join(secrets.choice(alphabet) for _ in range(20))",
    },
  ],

  examples: [
    { title: 'It is a Random subclass',          code: 'import random\nisinstance(random.SystemRandom(), random.Random)',          returns: 'True' },
    { title: 'random() stays in [0, 1)',          code: 'import random\n0 <= random.SystemRandom().random() < 1',                  returns: 'True' },
    { title: 'All Random methods work',           code: 'import random\nrandom.SystemRandom().randint(1, 6) in range(1, 7)',       returns: 'True' },
    { title: 'randbytes is os.urandom',           code: 'import random\nlen(random.SystemRandom().randbytes(16))',                 returns: '16' },
    { title: 'seed() is ignored',                 code: 'import random\nprint(random.SystemRandom().seed(42))',                    returns: 'None' },
    { title: 'No state to save',                  code: 'import random\nrandom.SystemRandom().getstate()',                         returns: 'NotImplementedError: System entropy source does not have state.' },
    { title: 'secrets.SystemRandom is this class', code: "import random\nimport secrets\nsecrets.SystemRandom is random.SystemRandom", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Seeding it for reproducible tests',
      desc: 'seed() is a stub on SystemRandom, so two "identically seeded" instances still disagree. Use random.Random(seed) when you need repeatability.',
      wrong: { label: 'SystemRandom(42)', code: 'import random\na = random.SystemRandom(42)\nb = random.SystemRandom(42)\na.getrandbits(128) == b.getrandbits(128)', output: 'False' },
      fix:   { label: 'Random(42)',       code: 'import random\na = random.Random(42)\nb = random.Random(42)\na.getrandbits(128) == b.getrandbits(128)',             output: 'True' },
    },
    {
      name: 'Calling setstate() on it',
      desc: 'There is no software state to restore; both state methods raise.',
      wrong: { label: 'setstate', code: 'import random\nrandom.SystemRandom().setstate(None)', output: 'NotImplementedError: System entropy source does not have state.' },
      fix:   { label: 'Random instance', code: 'import random\nr = random.Random(5)\nr.setstate(random.Random(5).getstate())\nr.random() == random.Random(5).random()', output: 'True' },
    },
  ],

  when: {
    use: [
      'Security-relevant picks with the Random API: sample, shuffle, choices, uniform',
      'Code that already takes a Random instance and must become unpredictable',
    ],
    avoid: [
      'Tokens, passwords, keys → secrets (clearer intent, same source)',
      'Reproducible runs, tests, simulations → random.Random(seed)',
      'Generating huge amounts of data quickly: every call is a system call',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: SystemRandom overrides random(), getrandbits(), randbytes(), seed() (stub) and getstate/setstate (raise NotImplementedError); every other method is inherited from Random and therefore uses these. os.urandom reads getrandom() / /dev/urandom on Linux and BCryptGenRandom on Windows',
    'Availability': 'The docs say "Not available on all systems" (wherever os.urandom is unavailable)',
    'Why no demo': 'Values come from the OS and are different on every call; the examples check only properties that always hold',
  },

  related: [
    { name: 'random.Random', slug: 'random-class', when: 'The reproducible base class' },
    { name: 'getstate / setstate', slug: 'getstate-setstate', when: 'What SystemRandom does not support' },
    { name: 'getrandbits / randbytes', slug: 'getrandbits-randbytes', when: 'The predictable versions' },
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'Raised by getstate/setstate', category: 'exceptions' },
    { name: 'random module', slug: 'random', when: 'Security note and overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is random.SystemRandom cryptographically secure?',
      a: 'It draws from os.urandom(), the operating system source recommended for cryptographic use, and it is what the secrets module uses internally. For tokens and passwords call the secrets functions, which make the intent explicit.',
    },
    {
      q: 'What is the difference between random.SystemRandom and secrets?',
      a: 'secrets.SystemRandom is the same class. secrets adds helpers on top of it: token_bytes, token_hex, token_urlsafe, randbelow, randbits, choice.',
    },
    {
      q: 'Why can I not seed SystemRandom?',
      a: 'It has no internal state: every value is read fresh from the operating system. seed() is accepted for compatibility and does nothing; getstate() and setstate() raise NotImplementedError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.SystemRandom',
    meta:  'random.SystemRandom',
  },
};
