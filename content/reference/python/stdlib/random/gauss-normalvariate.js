// content/reference/python/stdlib/random/gauss-normalvariate.js
// random.gauss and random.normalvariate

export const meta = {
  slug:        'gauss-normalvariate',
  name:        'random.gauss / normalvariate',
  signature:   'random.gauss(mu=0.0, sigma=1.0) / random.normalvariate(mu=0.0, sigma=1.0)',
  blurb:       'Normally distributed floats (the bell curve) with mean mu and standard deviation sigma. gauss is a bit faster and caches a second value; normalvariate is the thread-safe one.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (default arguments since 3.11)',
  searchTerms: 'random.gauss random.normalvariate gauss normalvariate python normal distribution gaussian random bell curve mean standard deviation mu sigma box muller Random.gauss Random.normalvariate',
};

export const method = {
  slug:      'gauss-normalvariate',
  name:      'random.gauss / normalvariate',
  signature: 'random.gauss(mu=0.0, sigma=1.0) / random.normalvariate(mu=0.0, sigma=1.0)',
  returns:   { type: 'float', desc: 'mu + z * sigma for a standard normal z; any real value is possible.' },

  category:    'random function',
  version:     'All Python 3 versions (default arguments since 3.11)',
  hasLiveDemo: true,

  subtitle: 'Both give the same distribution with different algorithms, so the same seed gives different numbers. gauss() computes two values at a time and hands out the second on the next call; sigma is the standard deviation, not the variance.',

  covers: ['gauss', 'normalvariate', 'Random.gauss', 'Random.normalvariate'],

  cheat: {
    commonCall: 'random.gauss(170, 10)',
    returns:    'float around mu (68% within one sigma)',
    replaces:   'Hand-written Box-Muller code',
    watchOut:   'Can be negative or extreme; sigma is a standard deviation',
  },

  parameters: [
    { name: 'mu',    type: 'float', required: false, default: '0.0', desc: 'The mean (center of the bell curve). Default since 3.11.' },
    { name: 'sigma', type: 'float', required: false, default: '1.0', desc: 'The standard deviation (width). Default since 3.11. 0 returns mu every time.' },
  ],

  modes: [
    {
      id: 'gauss',
      label: 'gauss',
      blurb: 'Five draws, rounded to 4 decimals. Most land within one sigma of mu.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'mu',    type: 'float',     hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float',     hint: 'standard deviation', input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.gauss({$mu}, {$sigma}), 4) for _ in range(5)]',
      cases: [
        { id: 'std', label: 'mu 0, sigma 1',    values: { seed: '42', mu: '0', sigma: '1' } },
        { id: 'iq',  label: 'mu 100, sigma 15', values: { seed: '42', mu: '100', sigma: '15' } },
        { id: 'flat', label: 'sigma 0',         values: { seed: '42', mu: '5', sigma: '0' } },
      ],
    },
    {
      id: 'normal',
      label: 'normalvariate',
      blurb: 'Same distribution, different algorithm: with the same seed the numbers differ from gauss().',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'mu',    type: 'float',     hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float',     hint: 'standard deviation', input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.normalvariate({$mu}, {$sigma}), 4) for _ in range(5)]',
      cases: [
        { id: 'std',    label: 'mu 0, sigma 1',     values: { seed: '42', mu: '0', sigma: '1' } },
        { id: 'height', label: 'mu 170, sigma 10',  values: { seed: '7', mu: '170', sigma: '10' } },
      ],
    },
    {
      id: 'cache',
      label: "gauss's cache",
      blurb: 'After one gauss() call the generator state carries the next value already (getstate()[2]).',
      params: [{ name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' }],
      template: 'import random\nrandom.seed({$seed})\na = random.gauss()\nstate = random.getstate()\n(round(a, 6), round(state[2], 6))',
      cases: [
        { id: 'fortytwo', label: 'seed 42', values: { seed: '42' } },
        { id: 'one',      label: 'seed 1',  values: { seed: '1' } },
      ],
    },
  ],
  demoExplainer: 'gauss() uses Box-Muller: two uniform floats give two normal values, cos(...) * r is returned and sin(...) * r is stored for the next call. That is why getstate()[2] after one call with seed 42 holds -0.172904: the second value of the gauss tab (shown there as -0.1729). normalvariate() (Kinderman-Monahan) draws pairs of uniforms in a loop and keeps nothing. The values are rounded because they come from the C math library, which can differ in the last digit between platforms.',

  patterns: [
    {
      name: 'Simulated measurements',
      desc: 'True value plus normally distributed noise.',
      code: 'import random\nreadings = [true_value + random.gauss(0, 0.5) for _ in range(100)]',
    },
    {
      name: 'Never negative',
      desc: 'Clamp, or use lognormvariate for naturally positive quantities.',
      code: 'import random\nduration = max(0.0, random.gauss(15.0, 3.5))',
    },
    {
      name: 'One generator per thread',
      desc: 'Two threads sharing gauss() can receive the same cached value; separate Random instances avoid it.',
      code: 'import random\nimport threading\nlocal = threading.local()\ndef rng():\n    if not hasattr(local, "r"):\n        local.r = random.Random()\n    return local.r',
    },
  ],

  examples: [
    { title: 'Standard normal values',        code: 'import random\nrandom.seed(42)\n[random.gauss(0, 1) for _ in range(3)]',          returns: '[-0.14409032957792836, -0.1729036003315193, -0.11131586156766246]' },
    { title: 'normalvariate: same seed, other numbers', code: 'import random\nrandom.seed(42)\n[random.normalvariate(0, 1) for _ in range(3)]', returns: '[0.2453263417078634, -0.49684447341120286, 1.2547859310574627]' },
    { title: 'Heights in cm',                 code: 'import random\nrandom.seed(42)\n[round(random.gauss(170, 10), 1) for _ in range(5)]', returns: '[168.6, 168.3, 168.9, 177.0, 168.7]' },
    { title: 'Defaults mu=0.0, sigma=1.0 (3.11+)', code: 'import random\nrandom.seed(42)\nrandom.gauss()',                                 returns: '-0.14409032957792836' },
    { title: 'The mean converges to mu',      code: 'import random\nrandom.seed(42)\ndata = [random.gauss(100, 15) for _ in range(10000)]\nround(sum(data) / len(data))', returns: '100' },
    { title: 'gauss() caches its second value', code: 'import random\nrandom.seed(42)\nrandom.gauss()\nstate = random.getstate()\nstate[2] is not None', returns: 'True' },
    { title: 'seed() clears that cache',      code: 'import random\nrandom.seed(42)\nfirst = random.gauss()\nrandom.seed(42)\nagain = random.gauss()\nfirst == again', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Passing the variance as sigma',
      desc: 'sigma is the standard deviation. If you want variance 4, pass sigma=2; gauss(0, 4) has standard deviation 4 (variance 16).',
      wrong: { label: 'gauss(0, 4)', code: 'import random\nimport statistics\nrandom.seed(42)\ndata = [random.gauss(0, 4) for _ in range(10000)]\nround(statistics.stdev(data))', output: '4' },
      fix:   { label: 'gauss(0, 2)', code: 'import random\nimport statistics\nrandom.seed(42)\ndata = [random.gauss(0, 2) for _ in range(10000)]\nround(statistics.stdev(data))', output: '2' },
    },
    {
      name: 'Negative values for positive quantities',
      desc: 'A normal distribution has no lower bound: with mu=1 and sigma=2 about 31 percent of the draws are negative. Clamp or choose another distribution.',
      wrong: { label: 'raw gauss', code: 'import random\nrandom.seed(42)\nmin(random.gauss(1, 2) for _ in range(1000)) < 0', output: 'True' },
      fix:   { label: 'max(0.0, ...)', code: 'import random\nrandom.seed(42)\nmin(max(0.0, random.gauss(1, 2)) for _ in range(1000))', output: '0.0' },
    },
  ],

  when: {
    use: [
      'Noise, measurement error, natural variation around a mean',
      'Monte Carlo simulations needing normal inputs',
      'normalvariate when several threads share one generator',
    ],
    avoid: [
      'Bounded values → triangular, betavariate or clamping',
      'Positive skewed quantities (incomes, durations) → lognormvariate, gammavariate',
      'Arrays of millions of values → numpy.random.Generator.normal',
    ],
  },

  notes: {
    cpython: 'Lib/random.py. gauss: x2pi = random() * TWOPI; g2rad = sqrt(-2.0 * log(1.0 - random())); returns cos(x2pi) * g2rad and stores sin(x2pi) * g2rad in self.gauss_next. normalvariate: Kinderman-Monahan ratio of uniforms, z = NV_MAGICCONST * (u1 - 0.5) / u2, accepted when z * z / 4.0 <= -log(u2)',
    'Platforms': 'math.log, cos and sin come from the C library: in the reference fuzz (thousands of draws compared with Windows and Linux CPython) the last digit differs between platforms for a fraction of a percent of values. The demos therefore round to 4 or 6 decimals; the full-precision examples on this page were checked on both',
    'Threads': 'Two threads calling gauss() at the same moment can get the same cached value; the docs suggest separate instances, locks, or normalvariate()',
  },

  related: [
    { name: 'Other distributions', slug: 'distributions', when: 'lognormvariate, expovariate, triangular, …' },
    { name: 'gammavariate / betavariate', slug: 'gammavariate-betavariate', when: 'Skewed and bounded shapes' },
    { name: 'getstate / setstate', slug: 'getstate-setstate', when: 'The state includes gauss() cached value' },
    { name: 'random.seed', slug: 'seed', when: 'Reset the sequence and the cache' },
    { name: 'round()', slug: 'round', when: 'Show fewer digits', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between random.gauss and random.normalvariate?',
      a: 'Same normal distribution, different algorithms. gauss() (Box-Muller) produces two values per computation and caches one, so it is slightly faster but not safe for simultaneous calls from two threads; normalvariate() keeps no cache. For the same seed they return different numbers.',
    },
    {
      q: 'How do I generate normally distributed random numbers in Python?',
      a: 'random.gauss(mu, sigma) for single values (random.gauss() for the standard normal, 3.11+). Use statistics.NormalDist(mu, sigma).samples(n, seed=...) for a list, or NumPy for large arrays.',
    },
    {
      q: 'Are random.gauss results the same on every computer?',
      a: 'The uniform numbers underneath are, but gauss() passes them through log, cos and sin from the platform C library, so the last digit of a result can differ between Windows, Linux and macOS. Round, or compare with a tolerance, if results must match across machines.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.gauss',
    meta:  'random.gauss and random.normalvariate',
  },
};
