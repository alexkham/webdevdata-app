// content/reference/python/stdlib/statistics/normaldist-samples.js — NormalDist.samples

export const meta = {
  slug:        'normaldist-samples',
  name:        'NormalDist.samples',
  signature:   'nd.samples(n, *, seed=None)',
  blurb:       'A list of n random values from the normal distribution; pass seed for a reproducible list. The algorithm changed in 3.13.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.8+ (new algorithm in 3.13)',
  searchTerms: 'NormalDist.samples samples random normal values gaussian random numbers seed reproducible monte carlo simulation python normal random sample list',
};

export const method = {
  slug:      'normaldist-samples',
  name:      'NormalDist.samples',
  signature: 'nd.samples(n, *, seed=None)',
  returns:   { type: 'list[float]', desc: 'n floats drawn from NormalDist(mu, sigma).' },

  category:    'NormalDist method',
  version:     'Python 3.8+ (new algorithm in 3.13)',
  hasLiveDemo: true,

  subtitle: 'With a seed it creates its own random.Random(seed), so the list is reproducible and independent of the global random state. Since 3.13 each value is inv_cdf(random()), which is faster than gauss() — and gives different numbers than 3.12 for the same seed.',

  covers: ['NormalDist.samples'],

  cheat: {
    commonCall: 'statistics.NormalDist(100, 15).samples(5, seed=42)',
    returns:    'a list of 5 floats',
    replaces:   '[random.gauss(mu, sigma) for _ in range(n)]',
    watchOut:   'Seeded lists differ between Python 3.12 and 3.13',
  },

  parameters: [
    { name: 'n',    type: 'int', required: true, default: null, desc: 'How many values (0 or negative → an empty list).' },
    { name: 'seed', type: 'int | float | str | bytes | None', required: false, default: 'None', desc: 'Keyword-only. None draws from the module-level random generator.' },
  ],

  modes: [
    {
      id: 'draws',
      label: 'draws',
      blurb: 'Seeded values, rounded to 4 places (the tails use log from the C math library).',
      params: [
        { name: 'mu',    type: 'float',     hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float',     hint: 'standard deviation', input: 'float' },
        { name: 'n',     type: 'int',       hint: 'how many',           input: 'number' },
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
      ],
      template: 'import statistics\n[round(x, 4) for x in statistics.NormalDist({$mu}, {$sigma}).samples({$n}, seed={$seed})]',
      cases: [
        { id: 'iq',   label: 'IQ, seed 42',   values: { mu: '100', sigma: '15', n: '5', seed: '42' } },
        { id: 'std',  label: 'standard',      values: { mu: '0', sigma: '1', n: '3', seed: '1' } },
        { id: 'str',  label: "seed 'abc'",    values: { mu: '0', sigma: '1', n: '4', seed: 'abc' } },
        { id: 'flat', label: 'sigma 0',       values: { mu: '50', sigma: '0', n: '3', seed: '1' } },
      ],
    },
    {
      id: 'check',
      label: '1000 draws',
      blurb: 'The sample mean and standard deviation of 1000 draws, rounded to one decimal.',
      params: [
        { name: 'mu',    type: 'float',     hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float',     hint: 'standard deviation', input: 'float' },
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
      ],
      template: 'import statistics\nxs = statistics.NormalDist({$mu}, {$sigma}).samples(1000, seed={$seed})\n(round(statistics.fmean(xs), 1), round(statistics.stdev(xs), 1))',
      cases: [
        { id: 'iq',  label: 'IQ, seed 42', values: { mu: '100', sigma: '15', seed: '42' } },
        { id: 'std', label: 'standard',    values: { mu: '0', sigma: '1', seed: '7' } },
      ],
    },
  ],
  demoExplainer: 'The same seed always gives the same list (in 3.13): NormalDist(100, 15) with seed 42 starts 105.3539, 70.6033, 91.0349. String seeds work like random.seed. sigma 0 returns mu every time. 1000 draws come close to the parameters but not exactly: for seed 42 their mean is 100.8 and their standard deviation 15.2.',

  patterns: [
    {
      name: 'Monte Carlo inputs',
      desc: 'Docs recipe: independent inputs with their own seeds.',
      code: 'import statistics\nX = statistics.NormalDist(10, 2.5).samples(100_000, seed=3652260728)\nY = statistics.NormalDist(15, 1.75).samples(100_000, seed=4582495471)\nresults = [x * y for x, y in zip(X, Y)]',
    },
    {
      name: 'Reproduce 3.12 values',
      desc: 'The docs: use random.seed() and random.gauss().',
      code: 'import random\nrandom.seed(1)\nold_style = [random.gauss(0.0, 1.0) for _ in range(3)]',
    },
  ],

  examples: [
    { title: 'Standard normal, seed 1 (3.13)', code: 'import statistics\nstatistics.NormalDist().samples(3, seed=1)', returns: '[-1.1059954512309809, 1.0254889723405536, 0.7184972189414314]' },
    { title: 'Same seed, same list',        code: 'import statistics\nnd = statistics.NormalDist()\nnd.samples(2, seed=1) == nd.samples(2, seed=1)', returns: 'True' },
    { title: 'n = 0',                       code: 'import statistics\nstatistics.NormalDist().samples(0, seed=1)', returns: '[]' },
    { title: 'n must be an int',            code: 'import statistics\nstatistics.NormalDist().samples(2.0, seed=1)', returns: "TypeError: 'float' object cannot be interpreted as an integer" },
    { title: 'How many',                    code: 'import statistics\nlen(statistics.NormalDist().samples(1000, seed=7))', returns: '1000' },
  ],

  pitfalls: [
    {
      name: 'Expecting the 3.12 numbers',
      desc: 'In 3.12, samples() called random.gauss(); 3.13 uses inv_cdf(random()). The same seed now gives a different list (3.12 started 1.2881847531554629 for seed 1). For the old values, use random.gauss directly.',
      wrong: { label: 'samples (3.13)', code: 'import statistics\n[round(x, 4) for x in statistics.NormalDist().samples(2, seed=1)]', output: '[-1.106, 1.0255]' },
      fix:   { label: 'random.gauss', code: 'import random\nrng = random.Random(1)\n[round(rng.gauss(0.0, 1.0), 4) for _ in range(2)]', output: '[1.2882, 1.4494]' },
    },
    {
      name: 'Passing seed positionally',
      desc: 'seed is keyword-only.',
      wrong: { label: 'samples(3, 42)', code: 'import statistics\nstatistics.NormalDist().samples(3, 42)', output: 'TypeError: NormalDist.samples() takes 2 positional arguments but 3 were given' },
      fix:   { label: 'seed=42', code: 'import statistics\nlen(statistics.NormalDist().samples(3, seed=42))', output: '3' },
    },
  ],

  when: {
    use: ['Simulation inputs with a known mean and spread', 'Reproducible synthetic data (seeded)'],
    avoid: ['Values that must match older Python versions → random.gauss with the same seed', 'Security-sensitive randomness → secrets'],
  },

  notes: {
    cpython:    'Lib/statistics.py (3.13): rnd = random.random if seed is None else random.Random(seed).random; return [_normal_dist_inv_cdf(rnd(), mu, sigma) for _ in repeat(None, n)]',
    'Versions': 'Added in 3.8; the inverse-CDF algorithm replaced random.gauss in 3.13 (documented as "Switched to a faster algorithm")',
    'Platform': 'Draws in the tails (p < 0.075 or p > 0.925) go through math.log of the C library, so a value can differ in its last digit between platforms; the central draws are pure arithmetic',
  },

  related: [
    { name: 'NormalDist', slug: 'normaldist', when: 'The class' },
    { name: 'inv_cdf', slug: 'normaldist-inv_cdf-quantiles', when: 'What each draw goes through' },
    { name: 'kde_random', slug: 'kde_random', when: 'Draws from an estimated distribution' },
    { name: 'random.gauss', slug: 'gauss-normalvariate', when: 'The 3.12 algorithm', category: 'stdlib/random' },
    { name: 'random.seed', slug: 'seed', when: 'How seeds work', category: 'stdlib/random' },
  ],

  faq: [
    {
      q: 'How do I generate normally distributed random numbers in Python?',
      a: 'statistics.NormalDist(mu, sigma).samples(n, seed=...) returns a list; random.gauss(mu, sigma) returns one value at a time from the global generator.',
    },
    {
      q: 'Why do my seeded NormalDist samples differ after upgrading to Python 3.13?',
      a: 'The algorithm changed from random.gauss() to inv_cdf(random()), so the same seed produces different numbers. The distribution is the same; only the values differ.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist.samples',
    meta:  'NormalDist.samples',
  },
};
