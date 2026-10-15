// content/reference/python/stdlib/statistics/normaldist-inv_cdf-quantiles.js — NormalDist.inv_cdf / NormalDist.quantiles

export const meta = {
  slug:        'normaldist-inv_cdf-quantiles',
  name:        'NormalDist.inv_cdf / NormalDist.quantiles',
  signature:   'nd.inv_cdf(p)  /  nd.quantiles(n=4)',
  blurb:       'The value with a given cumulative probability (percent-point / quantile function), and the n - 1 cut points that split the distribution into n equally likely parts.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'NormalDist.inv_cdf NormalDist.quantiles inv_cdf quantiles inverse cdf percent point function ppf quantile function critical value 1.96 z value for 95% confidence percentile of normal distribution p must be in the range 0.0 < p < 1.0',
};

export const method = {
  slug:      'normaldist-inv_cdf-quantiles',
  name:      'NormalDist.inv_cdf / NormalDist.quantiles',
  signature: 'nd.inv_cdf(p)  /  nd.quantiles(n=4)',
  returns:   { type: 'float / list[float]', desc: 'x with P(X <= x) = p; quantiles returns [inv_cdf(i / n) for i in 1..n-1].' },

  category:    'NormalDist methods',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'inv_cdf answers "which value has p of the distribution below it?" — the z = 1.96 behind 95% confidence intervals is NormalDist().inv_cdf(0.975). It uses Wichura’s AS241 rational approximation, implemented in C.',

  covers: ['NormalDist.inv_cdf', 'NormalDist.quantiles'],

  cheat: {
    commonCall: 'statistics.NormalDist().inv_cdf(0.975)',
    returns:    '1.9599639845400536',
    replaces:   'scipy.stats.norm.ppf and z-tables',
    watchOut:   'p must be strictly between 0 and 1',
  },

  parameters: [
    { name: 'p', type: 'float', required: true,  default: null, desc: 'inv_cdf: a probability with 0.0 < p < 1.0.' },
    { name: 'n', type: 'int',   required: false, default: '4',  desc: 'quantiles: number of equal-probability groups (4 = quartiles, 10 = deciles, 100 = percentiles); n <= 1 gives [].' },
  ],

  modes: [
    {
      id: 'inv',
      label: 'inv_cdf',
      blurb: 'The value below which a share p of the distribution lies (rounded to 6 places).',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
        { name: 'p',     type: 'float', hint: 'probability 0..1',   input: 'float' },
      ],
      template: 'import statistics\nnd = statistics.NormalDist({$mu}, {$sigma})\nround(nd.inv_cdf({$p}), 6)',
      cases: [
        { id: 'z975', label: 'z for 97.5%',    values: { mu: '0', sigma: '1', p: '0.975' } },
        { id: 'iq90', label: 'IQ 90th pct',    values: { mu: '100', sigma: '15', p: '0.9' } },
        { id: 'tail', label: 'p = 1e-10',      values: { mu: '0', sigma: '1', p: '1e-10' } },
        { id: 'zero', label: 'p = 0',          values: { mu: '0', sigma: '1', p: '0' } },
      ],
    },
    {
      id: 'quantiles',
      label: 'quantiles',
      blurb: 'Cut points into n equally likely groups, rounded to 2 places.',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
        { name: 'n',     type: 'int',   hint: 'groups',             input: 'number' },
      ],
      template: 'import statistics\n[round(q, 2) for q in statistics.NormalDist({$mu}, {$sigma}).quantiles({$n})]',
      cases: [
        { id: 'sat4',  label: 'SAT quartiles', values: { mu: '1060', sigma: '195', n: '4' } },
        { id: 'sat10', label: 'SAT deciles',   values: { mu: '1060', sigma: '195', n: '10' } },
        { id: 'one',   label: 'n = 1',         values: { mu: '0', sigma: '1', n: '1' } },
      ],
    },
  ],
  demoExplainer: '97.5% of the standard normal lies below 1.959964 — the familiar 1.96. The 90th percentile of IQ scores (100, 15) is 119.223273. Far in the tail, p = 1e-10 corresponds to -6.361341 standard deviations. p must be strictly between 0 and 1: p = 0 raises StatisticsError. The SAT quartiles are 928.47, 1060.0 and 1191.53; n = 1 has no cut points.',

  patterns: [
    {
      name: 'Two-sided critical value',
      desc: 'For a confidence level c, z = inv_cdf((1 + c) / 2).',
      code: 'import statistics\nz = statistics.NormalDist().inv_cdf((1 + 0.95) / 2)\nmargin = z * stdev / n ** 0.5',
    },
    {
      name: 'Score needed for the top 10%',
      desc: 'inv_cdf(0.9) of the score distribution.',
      code: 'import statistics\ncutoff = statistics.NormalDist(500, 100).inv_cdf(0.9)',
    },
  ],

  examples: [
    { title: 'Docs: SAT quartiles',      code: 'import statistics\nlist(map(round, statistics.NormalDist(1060, 195).quantiles()))', returns: '[928, 1060, 1192]' },
    { title: 'Docs: SAT deciles',        code: 'import statistics\nlist(map(round, statistics.NormalDist(1060, 195).quantiles(n=10)))', returns: '[810, 896, 958, 1011, 1060, 1109, 1162, 1224, 1310]' },
    { title: 'Median: exactly mu',       code: 'import statistics\nstatistics.NormalDist(100, 15).inv_cdf(0.5)', returns: '100.0' },
    { title: 'Symmetric',                code: 'import statistics\n[round(q, 4) for q in statistics.NormalDist().quantiles(4)]', returns: '[-0.6745, 0.0, 0.6745]' },
    { title: 'Round trip through cdf',   code: 'import statistics\nnd = statistics.NormalDist(100, 15)\nnd.cdf(nd.inv_cdf(0.9))', returns: '0.9' },
    { title: 'p = 1 is out of range',    code: 'import statistics\nstatistics.NormalDist().inv_cdf(1)', returns: 'statistics.StatisticsError: p must be in the range 0.0 < p < 1.0' },
  ],

  pitfalls: [
    {
      name: 'One-sided vs two-sided',
      desc: 'inv_cdf(0.95) is the one-sided 95% value. For a two-sided 95% interval you need 2.5% in each tail: inv_cdf(0.975).',
      wrong: { label: 'inv_cdf(0.95)', code: 'import statistics\nround(statistics.NormalDist().inv_cdf(0.95), 4)', output: '1.6449' },
      fix:   { label: 'inv_cdf(0.975)', code: 'import statistics\nround(statistics.NormalDist().inv_cdf(0.975), 4)', output: '1.96' },
    },
    {
      name: 'Percentages instead of probabilities',
      desc: 'p is a fraction between 0 and 1, not a percentage.',
      wrong: { label: 'inv_cdf(90)', code: 'import statistics\nstatistics.NormalDist(100, 15).inv_cdf(90)', output: 'statistics.StatisticsError: p must be in the range 0.0 < p < 1.0' },
      fix:   { label: 'inv_cdf(0.90)', code: 'import statistics\nround(statistics.NormalDist(100, 15).inv_cdf(0.90), 2)', output: '119.22' },
    },
  ],

  when: {
    use: ['Critical values and cutoffs', 'Percentiles of a normal model', 'Box-plot style summaries of a theoretical distribution'],
    avoid: ['Quantiles of data → statistics.quantiles(data)', 'Non-normal shapes → kde() / empirical quantiles'],
  },

  notes: {
    cpython:    'inv_cdf checks 0 < p < 1, then calls _normal_dist_inv_cdf from the built-in _statistics C module (a pure-Python copy exists in Lib/statistics.py): Wichura AS241 — a rational function for |p - 0.5| <= 0.425, otherwise r = sqrt(-log(min(p, 1 - p))) and one of two rational functions',
    'sigma = 0': 'Allowed here: NormalDist(mu, 0).inv_cdf(p) returns mu (pdf and cdf raise instead)',
    'Platform': 'The central range is pure arithmetic and identical everywhere; the tails call log from the C library, so a last-digit difference between platforms is possible there',
  },

  related: [
    { name: 'pdf / cdf', slug: 'normaldist-pdf-cdf', when: 'The forward direction' },
    { name: 'quantiles of data', slug: 'quantiles', when: 'Empirical cut points' },
    { name: 'samples', slug: 'normaldist-samples', when: 'inv_cdf of uniform random numbers' },
    { name: 'NormalDist', slug: 'normaldist', when: 'The class' },
  ],

  faq: [
    {
      q: 'How do I get the z-value for a 95% confidence interval in Python?',
      a: 'statistics.NormalDist().inv_cdf(0.975) returns 1.9599639845400536. The 0.975 leaves 2.5% in each tail.',
    },
    {
      q: 'What is the difference between inv_cdf and quantiles?',
      a: 'inv_cdf(p) gives one value for one probability; quantiles(n) gives the n - 1 values at probabilities 1/n, 2/n, …, (n-1)/n.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist.inv_cdf',
    meta:  'NormalDist.inv_cdf',
  },
};
