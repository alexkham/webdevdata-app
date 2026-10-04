// content/reference/python/stdlib/random/gammavariate-betavariate.js
// random.gammavariate and random.betavariate

export const meta = {
  slug:        'gammavariate-betavariate',
  name:        'random.gammavariate / betavariate',
  signature:   'random.gammavariate(alpha, beta) / random.betavariate(alpha, beta)',
  blurb:       'Gamma-distributed positive floats (shape alpha, scale beta) and beta-distributed floats between 0 and 1 — the second is built from two gamma draws.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'random.gammavariate random.betavariate gammavariate betavariate gamma distribution beta distribution python shape scale alpha beta proportion probability bayesian prior Random.gammavariate Random.betavariate alpha and beta must be > 0.0',
};

export const method = {
  slug:      'gammavariate-betavariate',
  name:      'random.gammavariate / betavariate',
  signature: 'random.gammavariate(alpha, beta) / random.betavariate(alpha, beta)',
  returns:   { type: 'float', desc: 'gammavariate: x > 0 with mean alpha * beta. betavariate: 0 <= x <= 1 with mean alpha / (alpha + beta).' },

  category:    'random function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'gammavariate is the gamma DISTRIBUTION, not math.gamma. Its beta is a scale (mean = alpha * beta); some textbooks use a rate instead. betavariate(alpha, beta) draws two gammas and returns y / (y + z).',

  covers: ['gammavariate', 'betavariate', 'Random.gammavariate', 'Random.betavariate'],

  cheat: {
    commonCall: 'random.betavariate(2, 5)',
    returns:    'float (gamma: > 0, beta: in [0, 1])',
    replaces:   'scipy.stats / numpy for single draws',
    watchOut:   'gamma beta is a scale: rate r means beta = 1 / r',
  },

  parameters: [
    { name: 'alpha', type: 'float', required: true, default: null, desc: 'Shape, > 0. For betavariate: the "successes" side.' },
    { name: 'beta',  type: 'float', required: true, default: null, desc: 'gammavariate: scale (> 0, mean = alpha * beta). betavariate: second shape (> 0).' },
  ],

  modes: [
    {
      id: 'gamma',
      label: 'gammavariate',
      blurb: 'Five gamma draws, rounded. alpha = 1 is the exponential distribution with mean beta.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'alpha', type: 'float',     hint: 'shape',              input: 'float' },
        { name: 'beta',  type: 'float',     hint: 'scale',              input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.gammavariate({$alpha}, {$beta}), 4) for _ in range(5)]',
      cases: [
        { id: 'two',  label: 'alpha 2, beta 1',   values: { seed: '42', alpha: '2', beta: '1' } },
        { id: 'half', label: 'alpha 0.5, beta 2', values: { seed: '42', alpha: '0.5', beta: '2' } },
        { id: 'one',  label: 'alpha 1, beta 3',   values: { seed: '42', alpha: '1', beta: '3' } },
        { id: 'bad',  label: 'beta 0',            values: { seed: '42', alpha: '2', beta: '0' } },
      ],
    },
    {
      id: 'beta',
      label: 'betavariate',
      blurb: 'Five beta draws between 0 and 1. alpha = beta = 0.5 piles up near 0 and 1.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'alpha', type: 'float',     hint: 'alpha',              input: 'float' },
        { name: 'beta',  type: 'float',     hint: 'beta',               input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.betavariate({$alpha}, {$beta}), 4) for _ in range(5)]',
      cases: [
        { id: 'skew', label: 'alpha 2, beta 5',     values: { seed: '42', alpha: '2', beta: '5' } },
        { id: 'u',    label: 'alpha 0.5, beta 0.5', values: { seed: '42', alpha: '0.5', beta: '0.5' } },
      ],
    },
  ],
  demoExplainer: 'gammavariate switches algorithm on alpha: above 1 it uses Cheng\'s rejection method, exactly 1 is -log(1 - random()) * beta (so alpha 1, beta 3 gives three times the expovariate(1.0) values), below 1 it uses algorithm GS with x ** (1 / alpha). betavariate(2, 5) has mean 2 / 7, so most draws are small. The values are rounded because log, exp and ** come from the platform C library.',

  patterns: [
    {
      name: 'Bayesian estimate of a rate',
      desc: 'Thompson sampling: draw a plausible conversion rate per variant, pick the best.',
      code: 'import random\nsamples = {v: random.betavariate(wins[v] + 1, losses[v] + 1) for v in variants}\nchoice = max(samples, key=samples.get)',
    },
    {
      name: 'Gamma with a rate parameter',
      desc: 'Convert rate to scale.',
      code: 'import random\nx = random.gammavariate(shape, 1 / rate)',
    },
    {
      name: 'Random proportions that sum to 1',
      desc: 'Normalize independent gamma draws (a Dirichlet sample).',
      code: 'import random\ng = [random.gammavariate(a, 1.0) for a in (2.0, 3.0, 5.0)]\nshares = [x / sum(g) for x in g]',
    },
  ],

  examples: [
    { title: 'gammavariate(2.0, 1.0)',             code: 'import random\nrandom.seed(42)\nrandom.gammavariate(2.0, 1.0)', returns: '1.1428765860350905' },
    { title: 'alpha < 1 uses another algorithm',   code: 'import random\nrandom.seed(42)\nrandom.gammavariate(0.5, 1.0)', returns: '0.573113778473856' },
    { title: 'alpha == 1: exponential with mean beta', code: 'import random\nrandom.seed(42)\nrandom.gammavariate(1.0, 2.0)', returns: '2.040120574549602' },
    { title: 'Mean is alpha * beta',               code: 'import random\nrandom.seed(42)\nround(sum(random.gammavariate(2.0, 3.0) for _ in range(10000)) / 10000, 1)', returns: '5.9' },
    { title: 'betavariate(2, 5)',                  code: 'import random\nrandom.seed(42)\nrandom.betavariate(2, 5)', returns: '0.13961892090489622' },
    { title: 'Beta draws stay inside (0, 1)',      code: 'import random\nrandom.seed(42)\nx = [random.betavariate(2, 5) for _ in range(1000)]\n(min(x) > 0, max(x) < 1)', returns: '(True, True)' },
    { title: 'Parameters must be positive',        code: 'import random\nrandom.gammavariate(0, 1)', returns: 'ValueError: gammavariate: alpha and beta must be > 0.0' },
  ],

  pitfalls: [
    {
      name: 'Rate instead of scale',
      desc: 'Python\'s beta is the scale (mean alpha * beta). If your formula has a rate of 3, pass 1 / 3: passing 3 makes the mean nine times larger.',
      wrong: { label: 'beta = rate',      code: 'import random\nrandom.seed(42)\nround(sum(random.gammavariate(2.0, 3.0) for _ in range(10000)) / 10000, 2)',   output: '5.94' },
      fix:   { label: 'beta = 1 / rate',  code: 'import random\nrandom.seed(42)\nround(sum(random.gammavariate(2.0, 1 / 3) for _ in range(10000)) / 10000, 2)', output: '0.66' },
    },
    {
      name: 'An error message that names the wrong function',
      desc: 'betavariate calls gammavariate internally, so invalid beta parameters report "gammavariate".',
      wrong: { label: 'betavariate(0, 1)', code: 'import random\nrandom.seed(42)\nrandom.betavariate(0, 1)', output: 'ValueError: gammavariate: alpha and beta must be > 0.0' },
      fix:   { label: 'positive shapes',   code: 'import random\nrandom.seed(42)\nrandom.betavariate(2, 5) < 1', output: 'True' },
    },
  ],

  when: {
    use: [
      'Waiting time until the alpha-th event, positive skewed quantities: gammavariate',
      'Random probabilities and proportions, Bayesian priors: betavariate',
    ],
    avoid: [
      'The gamma FUNCTION → math.gamma / math.lgamma',
      'Exponential waiting times → expovariate',
      'Many draws for statistics work → numpy.random.Generator.gamma / beta',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: alpha > 1 uses R.C.H. Cheng (1977) with log and exp; alpha == 1 is -log(1.0 - random()) * beta; 0 < alpha < 1 uses algorithm GS (Kennedy and Gentle) with ** and exp. betavariate: y = gammavariate(alpha, 1.0); returns y / (y + gammavariate(beta, 1.0)), or 0.0 when y is 0',
    'Platforms': 'log, exp and ** come from the C library, so the last digit can differ between Windows, Linux and macOS for a small fraction of draws; the full-precision examples here were verified on Windows and Linux CPython',
    'Check': 'Only gammavariate validates: alpha <= 0.0 or beta <= 0.0 raises ValueError',
  },

  related: [
    { name: 'Other distributions', slug: 'distributions', when: 'expovariate, lognormvariate, weibullvariate, …' },
    { name: 'gauss / normalvariate', slug: 'gauss-normalvariate', when: 'The normal distribution' },
    { name: 'binomialvariate', slug: 'binomialvariate', when: 'Counts of successes (beta is its conjugate prior)' },
    { name: 'ValueError', slug: 'valueerror', when: 'Raised for non-positive parameters', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Is random.gammavariate the gamma function?',
      a: 'No. It draws a random number from the gamma distribution. The gamma function itself is math.gamma(x) (and math.lgamma for its logarithm).',
    },
    {
      q: 'What do alpha and beta mean in random.gammavariate?',
      a: 'alpha is the shape and beta the scale: the mean is alpha * beta and the variance alpha * beta ** 2. If your source uses a rate parameter, pass beta = 1 / rate.',
    },
    {
      q: 'How do I generate a random probability between 0 and 1 with a given mean?',
      a: 'random.betavariate(alpha, beta) has mean alpha / (alpha + beta); larger alpha + beta concentrates the values around the mean. For a flat distribution use random.random().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.gammavariate',
    meta:  'random.gammavariate and random.betavariate',
  },
};
