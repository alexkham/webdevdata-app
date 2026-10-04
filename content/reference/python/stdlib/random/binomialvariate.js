// content/reference/python/stdlib/random/binomialvariate.js

export const meta = {
  slug:        'binomialvariate',
  name:        'random.binomialvariate',
  signature:   'random.binomialvariate(n=1, p=0.5)',
  blurb:       'The number of successes in n independent trials with success probability p — an int from 0 to n. New in Python 3.12.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.12+',
  searchTerms: 'random.binomialvariate binomialvariate binomial distribution python number of successes coin flips n trials probability p discrete distribution Random.binomialvariate p must be in the range',
};

export const method = {
  slug:      'binomialvariate',
  name:      'random.binomialvariate',
  signature: 'random.binomialvariate(n=1, p=0.5)',
  returns:   { type: 'int', desc: 'Number of successes, 0 <= X <= n; mean n * p.' },

  category:    'random function',
  version:     'Python 3.12+',
  hasLiveDemo: true,

  subtitle: 'Mathematically sum(random() < p for i in range(n)), but fast for any n: it needs about n * p draws for small n * p and a constant number (BTRS rejection) for large ones. So it does NOT give the same numbers as the sum() loop.',

  covers: ['binomialvariate', 'Random.binomialvariate'],

  cheat: {
    commonCall: 'random.binomialvariate(10, 0.5)',
    returns:    'int from 0 to n',
    replaces:   'sum(random.random() < p for _ in range(n))',
    watchOut:   'Python 3.12+ only; p outside [0, 1] raises ValueError',
  },

  parameters: [
    { name: 'n', type: 'int',   required: false, default: '1',   desc: 'Number of trials, >= 0.' },
    { name: 'p', type: 'float', required: false, default: '0.5', desc: 'Success probability per trial, 0.0 <= p <= 1.0. p = 0 and p = 1 return 0 and n without drawing.' },
  ],

  modes: [
    {
      id: 'draws',
      label: 'draws',
      blurb: 'Eight binomial counts. Small n * p uses the geometric method, large n * p the BTRS method.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'n',    type: 'int',       hint: 'trials',             input: 'number' },
        { name: 'p',    type: 'float',     hint: 'success probability', input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[random.binomialvariate({$n}, {$p}) for _ in range(8)]',
      cases: [
        { id: 'coins',   label: '10 coins',          values: { seed: '42', n: '10', p: '0.5' } },
        { id: 'rare',    label: 'n 100, p 0.03',     values: { seed: '42', n: '100', p: '0.03' } },
        { id: 'likely',  label: 'n 20, p 0.9',       values: { seed: '42', n: '20', p: '0.9' } },
        { id: 'million', label: 'a million trials',  values: { seed: '42', n: '1000000', p: '0.5' } },
        { id: 'bad',     label: 'p 1.5',             values: { seed: '42', n: '10', p: '1.5' } },
      ],
    },
    {
      id: 'estimate',
      label: 'estimate',
      blurb: 'Monte Carlo: how often do 7 trials give 5 or more successes? (The docs example uses p = 0.6.)',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string',  input: 'auto' },
        { name: 'p',    type: 'float',     hint: 'success probability', input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\nsum(random.binomialvariate(7, {$p}) >= 5 for _ in range(10000)) / 10000',
      cases: [
        { id: 'docs', label: 'p 0.6', values: { seed: '42', p: '0.6' } },
        { id: 'fair', label: 'p 0.5', values: { seed: '42', p: '0.5' } },
        { id: 'high', label: 'p 0.9', values: { seed: '42', p: '0.9' } },
      ],
    },
  ],
  demoExplainer: 'For p > 0.5 it counts failures instead (n - binomialvariate(n, 1 - p)). With n * p < 10 it jumps from success to success with geometric gaps computed by log2; otherwise it uses Hörmann\'s BTRS rejection method with lgamma, so even a million trials cost only a few draws. The estimate tab approaches the exact probability of 5+ successes, about 0.42 for p = 0.6.',

  patterns: [
    {
      name: 'Defective items in a batch',
      desc: 'How many of 500 parts fail if each fails with probability 2%?',
      code: 'import random\nfailures = random.binomialvariate(500, 0.02)',
    },
    {
      name: 'Simulated A/B conversions',
      desc: 'Conversions for each variant over a day of traffic.',
      code: 'import random\nconv_a = random.binomialvariate(visitors, 0.031)\nconv_b = random.binomialvariate(visitors, 0.034)',
    },
    {
      name: 'Fallback before 3.12',
      desc: 'Same distribution (different numbers), O(n) time.',
      code: 'import random\nsuccesses = sum(random.random() < p for _ in range(n))',
    },
  ],

  examples: [
    { title: '10 coin flips, 8 times',            code: 'import random\nrandom.seed(42)\n[random.binomialvariate(10, 0.5) for _ in range(8)]',        returns: '[3, 5, 3, 5, 6, 7, 6, 3]' },
    { title: 'Rare events',                       code: 'import random\nrandom.seed(42)\n[random.binomialvariate(100, 0.03) for _ in range(8)]',      returns: '[1, 2, 3, 0, 2, 3, 2, 3]' },
    { title: 'A million trials, instantly',       code: 'import random\nrandom.seed(42)\n[random.binomialvariate(1000000, 0.5) for _ in range(3)]',   returns: '[500201, 499664, 500356]' },
    { title: 'Defaults n=1, p=0.5: a coin',       code: 'import random\nrandom.seed(42)\n[random.binomialvariate() for _ in range(10)]',               returns: '[0, 1, 1, 1, 0, 0, 0, 1, 1, 1]' },
    { title: 'Mean is n * p',                     code: 'import random\nrandom.seed(42)\nround(sum(random.binomialvariate(20, 0.25) for _ in range(10000)) / 10000, 1)', returns: '5.0' },
    { title: 'p = 0 and p = 1 are allowed',       code: 'import random\nrandom.seed(42)\n[random.binomialvariate(5, 0.0), random.binomialvariate(5, 1.0)]', returns: '[0, 5]' },
    { title: 'p outside [0, 1]',                  code: 'import random\nrandom.binomialvariate(10, 1.5)',                                         returns: 'ValueError: p must be in the range 0.0 <= p <= 1.0' },
  ],

  pitfalls: [
    {
      name: 'Expecting the same numbers as the sum() loop',
      desc: 'The docs call it "mathematically equivalent" to sum(random() < p for i in range(n)): same distribution, different algorithm, different draws.',
      wrong: { label: 'compare with sum()', code: 'import random\nrandom.seed(42)\nrandom.binomialvariate(10, 0.5) == sum(random.random() < 0.5 for _ in range(10))', output: 'False' },
      fix:   { label: 'compare distributions', code: 'import random\nrandom.seed(42)\nround(sum(random.binomialvariate(20, 0.25) for _ in range(10000)) / 10000, 1) == 20 * 0.25', output: 'True' },
    },
    {
      name: 'Negative n',
      desc: 'n is a count of trials; negative values are rejected rather than treated as 0.',
      wrong: { label: 'n = -1', code: 'import random\nrandom.seed(42)\nrandom.binomialvariate(-1)', output: 'ValueError: n must be non-negative' },
      fix:   { label: 'n = 0',  code: 'import random\nrandom.seed(42)\nrandom.binomialvariate(0)',  output: '0' },
    },
  ],

  when: {
    use: [
      'Counting successes: defects, conversions, heads, hits',
      'Large n where summing random() < p would be slow',
    ],
    avoid: [
      'Python 3.11 and older → sum(random.random() < p for _ in range(n))',
      'Which trials succeeded (not just how many) → [random.random() < p for _ in range(n)]',
      'Weighted categories → choices()',
    ],
  },

  notes: {
    cpython: 'Lib/random.py (3.12+): edge cases p == 0 / p == 1 return 0 / n; n == 1 returns int(random() < p); p > 0.5 uses symmetry; n * p < 10 uses Devroye\'s geometric method with math.log2; otherwise Hörmann\'s BTRS transformed rejection with math.lgamma',
    'Platforms': 'The result is an int, but the algorithm compares floats computed with log2, log and lgamma (C library). A last-digit difference between platforms only matters if it flips a comparison, which is very rare',
    'Errors': 'ValueError: n must be non-negative / p must be in the range 0.0 <= p <= 1.0',
  },

  related: [
    { name: 'random.choices', slug: 'choices', when: 'Weighted picks of categories' },
    { name: 'random.random',  slug: 'random',  when: 'random() < p: a single trial' },
    { name: 'gammavariate / betavariate', slug: 'gammavariate-betavariate', when: 'Beta: a random p for Bayesian simulation' },
    { name: 'sum()',          slug: 'sum',     when: 'The slow equivalent', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I generate binomial random numbers in Python?',
      a: 'In Python 3.12+ use random.binomialvariate(n, p). In older versions sum(random.random() < p for _ in range(n)) gives the same distribution, or use numpy.random.Generator.binomial.',
    },
    {
      q: 'Why does random.binomialvariate not exist?',
      a: 'It was added in Python 3.12. On 3.11 and older you get AttributeError: module \'random\' has no attribute \'binomialvariate\'.',
    },
    {
      q: 'Is binomialvariate the same as summing random() < p?',
      a: 'Same distribution, but a different, much faster algorithm, so for the same seed it returns different numbers.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.binomialvariate',
    meta:  'random.binomialvariate',
  },
};
