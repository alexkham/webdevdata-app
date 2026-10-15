// content/reference/python/stdlib/statistics/normaldist-zscore.js — NormalDist.zscore

export const meta = {
  slug:        'normaldist-zscore',
  name:        'NormalDist.zscore',
  signature:   'nd.zscore(x)',
  blurb:       'The standard score of x: how many standard deviations it lies above (positive) or below (negative) the mean — (x - mu) / sigma.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'NormalDist.zscore zscore z-score standard score standardize standardise number of standard deviations from the mean python z score zscore() not defined when sigma is zero',
};

export const method = {
  slug:      'normaldist-zscore',
  name:      'NormalDist.zscore',
  signature: 'nd.zscore(x)',
  returns:   { type: 'float', desc: '(x - mu) / sigma.' },

  category:    'NormalDist method',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'Pure arithmetic — no C math library involved — so the result is identical on every platform. A z-score turns values on different scales into comparable numbers.',

  covers: ['NormalDist.zscore'],

  cheat: {
    commonCall: 'statistics.NormalDist(100, 15).zscore(130)',
    returns:    '2.0',
    replaces:   '(x - mean) / stdev written by hand',
    watchOut:   'sigma 0 raises StatisticsError',
  },

  parameters: [
    { name: 'x', type: 'float', required: true, default: null, desc: 'The value to standardise (int and Fraction work too).' },
  ],

  modes: [
    {
      id: 'z',
      label: 'z-score',
      blurb: 'A distribution and a value.',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
        { name: 'x',     type: 'float', hint: 'value',              input: 'float' },
      ],
      template: 'import statistics\nstatistics.NormalDist({$mu}, {$sigma}).zscore({$x})',
      cases: [
        { id: 'iq130', label: 'IQ 130',    values: { mu: '100', sigma: '15', x: '130' } },
        { id: 'iq85',  label: 'IQ 85',     values: { mu: '100', sigma: '15', x: '85' } },
        { id: 'sat',   label: 'SAT 1200',  values: { mu: '1060', sigma: '195', x: '1200' } },
        { id: 'zero',  label: 'sigma 0',   values: { mu: '5', sigma: '0', x: '5' } },
      ],
    },
    {
      id: 'sample',
      label: 'standardise a sample',
      blurb: 'Fit the data, then z-score every value (rounded to 3 places).',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\nnd = statistics.NormalDist.from_samples(data)\n[round(nd.zscore(x), 3) for x in data]',
      cases: [
        { id: 'scores', label: '2, 4, 4, 4, 5, 5, 7, 9', values: { data: '2, 4, 4, 4, 5, 5, 7, 9' } },
        { id: 'three',  label: '55, 70, 92',             values: { data: '55, 70, 92' } },
      ],
    },
  ],
  demoExplainer: 'An IQ of 130 is exactly two standard deviations above the mean of 100 (zscore 2.0); 85 is one below (-1.0). An SAT score of 1200 is 0.717948717948718 standard deviations above 1060. Standardising a sample uses its own mean and sample standard deviation, so the z-scores of the sample average 0 (up to rounding).',

  patterns: [
    {
      name: 'Flag outliers',
      desc: 'Values more than 3 standard deviations from the mean.',
      code: 'import statistics\nnd = statistics.NormalDist.from_samples(data)\noutliers = [x for x in data if abs(nd.zscore(x)) > 3]',
    },
    {
      name: 'Compare scores on different scales',
      desc: 'Which result is more exceptional?',
      code: 'import statistics\nmath_z = statistics.NormalDist(70, 10).zscore(85)\nverbal_z = statistics.NormalDist(500, 100).zscore(640)',
    },
  ],

  examples: [
    { title: 'Below the mean',           code: 'import statistics\nstatistics.NormalDist(100, 15).zscore(85)', returns: '-1.0' },
    { title: 'Several values',           code: 'import statistics\nnd = statistics.NormalDist(70, 10)\n[nd.zscore(x) for x in [55, 70, 92]]', returns: '[-1.5, 0.0, 2.2]' },
    { title: 'Same as the standard normal cdf', code: 'import statistics\nnd = statistics.NormalDist(100, 15)\nround(nd.cdf(130), 4) == round(statistics.NormalDist().cdf(nd.zscore(130)), 4)', returns: 'True' },
    { title: 'A Fraction as x',          code: 'import statistics\nfrom fractions import Fraction\nstatistics.NormalDist(0, 3).zscore(Fraction(1, 1))', returns: '0.3333333333333333' },
    { title: 'sigma 0',                  code: 'import statistics\nstatistics.NormalDist(5, 0).zscore(5)', returns: 'statistics.StatisticsError: zscore() not defined when sigma is zero' },
  ],

  pitfalls: [
    {
      name: 'Standardising with the population formula by accident',
      desc: 'from_samples uses the sample standard deviation (n - 1). If your data is the whole population, build the NormalDist from pstdev instead — the z-scores are smaller.',
      wrong: { label: 'sample sigma', code: 'import statistics\ndata = [2, 4, 4, 4, 5, 5, 7, 9]\nround(statistics.NormalDist.from_samples(data).zscore(9), 3)', output: '1.871' },
      fix:   { label: 'population sigma', code: 'import statistics\ndata = [2, 4, 4, 4, 5, 5, 7, 9]\nstatistics.NormalDist(statistics.mean(data), statistics.pstdev(data)).zscore(9)', output: '2.0' },
    },
  ],

  when: {
    use: ['Standardising values for comparison', 'Outlier rules (|z| > 3)'],
    avoid: ['Probabilities → cdf() (or cdf of the z-score on the standard normal)'],
  },

  notes: {
    cpython:    'Lib/statistics.py: if not sigma: raise StatisticsError; return (x - mu) / sigma',
    'Versions': 'Added in 3.9',
  },

  related: [
    { name: 'pdf / cdf', slug: 'normaldist-pdf-cdf', when: 'Probability from a z-score' },
    { name: 'from_samples', slug: 'normaldist-from_samples', when: 'mu and sigma from data' },
    { name: 'NormalDist', slug: 'normaldist', when: 'The class' },
  ],

  faq: [
    {
      q: 'How do I calculate a z-score in Python?',
      a: 'statistics.NormalDist(mu, sigma).zscore(x) on Python 3.9+, or NormalDist.from_samples(data).zscore(x) to use the mean and standard deviation of a sample.',
    },
    {
      q: 'What does a negative z-score mean?',
      a: 'The value is below the mean; -1.5 means one and a half standard deviations below it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist.zscore',
    meta:  'NormalDist.zscore',
  },
};
