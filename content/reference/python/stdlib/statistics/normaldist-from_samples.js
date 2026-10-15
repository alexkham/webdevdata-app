// content/reference/python/stdlib/statistics/normaldist-from_samples.js — NormalDist.from_samples

export const meta = {
  slug:        'normaldist-from_samples',
  name:        'NormalDist.from_samples',
  signature:   'statistics.NormalDist.from_samples(data)',
  blurb:       'Fit a normal distribution to a sample: mu is the sample mean, sigma the sample standard deviation (n - 1).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'NormalDist.from_samples from_samples fit normal distribution to data estimate mean and standard deviation classmethod python stdev requires at least two data points',
};

export const method = {
  slug:      'normaldist-from_samples',
  name:      'NormalDist.from_samples',
  signature: 'statistics.NormalDist.from_samples(data)',
  returns:   { type: 'NormalDist', desc: 'NormalDist(mean(data), stdev(data)) — both as floats, computed in one pass.' },

  category:    'NormalDist classmethod',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'One pass over the data with the same exact sums as stdev(): mu is the exact mean rounded to a float and sigma the correctly rounded sample standard deviation.',

  covers: ['NormalDist.from_samples'],

  cheat: {
    commonCall: 'statistics.NormalDist.from_samples(weights)',
    returns:    'NormalDist(mu=..., sigma=...)',
    replaces:   'NormalDist(statistics.mean(data), statistics.stdev(data))',
    watchOut:   'Needs at least two values (StatisticsError otherwise)',
  },

  parameters: [
    { name: 'data', type: 'iterable of numbers', required: true, default: null, desc: 'At least two values convertible to float (int, float, Fraction, Decimal…). Any iterable.' },
  ],

  modes: [
    {
      id: 'fit',
      label: 'fit',
      blurb: 'Comma-separated sample values.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\nstatistics.NormalDist.from_samples({$data})',
      cases: [
        { id: 'births', label: 'birth weights', values: { data: '2.5, 3.1, 2.1, 2.4, 2.7, 3.5' } },
        { id: 'ints',   label: '1, 2, 3, 4',    values: { data: '1, 2, 3, 4' } },
        { id: 'same',   label: '5, 5, 5',       values: { data: '5, 5, 5' } },
        { id: 'one',    label: 'one value',     values: { data: '1' } },
      ],
    },
    {
      id: 'compare',
      label: 'vs mean / fmean / stdev',
      blurb: 'Which helpers give exactly the same mu and sigma?',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\nnd = statistics.NormalDist.from_samples(data)\n(nd.mean == statistics.mean(data), nd.mean == statistics.fmean(data), nd.stdev == statistics.stdev(data))',
      cases: [
        { id: 'tenths', label: '0.1, 0.2, 0.3', values: { data: '0.1, 0.2, 0.3' } },
        { id: 'births', label: 'birth weights', values: { data: '2.5, 3.1, 2.1, 2.4, 2.7, 3.5' } },
      ],
    },
  ],
  demoExplainer: 'The birth-weight sample from the docs gives NormalDist(mu=2.716666666666667, sigma=0.5076087732365021). A constant sample gives sigma 0.0, and a single value raises StatisticsError ("stdev requires at least two data points"). The docs describe the estimates as fmean() and stdev(), but the mean is the exact one: for 0.1, 0.2, 0.3 nd.mean equals mean(data) (0.2) and not fmean(data) (0.19999999999999998).',

  patterns: [
    {
      name: 'Fit, then ask questions',
      desc: 'Probability of a value above a threshold under the fitted model.',
      code: 'import statistics\nmodel = statistics.NormalDist.from_samples(times)\np_slow = 1 - model.cdf(2.0)',
    },
    {
      name: 'Combine a fitted and a known distribution',
      desc: 'Docs example: birth weights plus a drug effect.',
      code: 'import statistics\nbirth = statistics.NormalDist.from_samples([2.5, 3.1, 2.1, 2.4, 2.7, 3.5])\ncombined = birth + statistics.NormalDist(0.4, 0.15)',
    },
  ],

  examples: [
    { title: 'Docs: combined distribution', code: 'import statistics\nbirth = statistics.NormalDist.from_samples([2.5, 3.1, 2.1, 2.4, 2.7, 3.5])\ncombined = birth + statistics.NormalDist(0.4, 0.15)\n(round(combined.mean, 1), round(combined.stdev, 1))', returns: '(3.1, 0.5)' },
    { title: 'Any iterable',             code: 'import statistics\nstatistics.NormalDist.from_samples(range(10))', returns: 'NormalDist(mu=4.5, sigma=3.0276503540974917)' },
    { title: 'Generators work too',      code: 'import statistics\nstatistics.NormalDist.from_samples(x for x in [1, 2, 3])', returns: 'NormalDist(mu=2.0, sigma=1.0)' },
    { title: 'Too few values',           code: 'import statistics\nstatistics.NormalDist.from_samples([1])', returns: 'statistics.StatisticsError: stdev requires at least two data points' },
    { title: 'Mean too large for a float', code: 'import statistics\nstatistics.NormalDist.from_samples([1, 2 ** 1100])', returns: 'OverflowError: integer division result too large for a float' },
  ],

  pitfalls: [
    {
      name: 'Fitting a normal curve to skewed data',
      desc: 'from_samples always succeeds, even when a normal model is a poor fit. The fitted curve here puts a sizeable probability on negative waiting times, which cannot happen.',
      wrong: { label: 'normal fit', code: 'import statistics\nnd = statistics.NormalDist.from_samples([1, 1, 2, 2, 3, 15])\nround(nd.cdf(0), 3)', output: '0.231' },
      fix:   { label: 'look at the data first', code: 'import statistics\ndata = [1, 1, 2, 2, 3, 15]\n(statistics.median(data), statistics.fmean(data))', output: '(2.0, 4.0)' },
    },
    {
      name: 'Strings from a file',
      desc: 'Convert before fitting.',
      wrong: { label: 'strings', code: "import statistics\nstatistics.NormalDist.from_samples(['1.5', '2.5'])", output: "TypeError: can't convert type 'str' to numerator/denominator" },
      fix:   { label: 'map(float, ...)', code: "import statistics\nstatistics.NormalDist.from_samples(map(float, ['1.5', '2.5']))", output: 'NormalDist(mu=2.0, sigma=0.7071067811865476)' },
    },
  ],

  when: {
    use: ['Modelling roughly symmetric measurement data', 'Quick probability estimates from a sample'],
    avoid: ['Skewed data (times, incomes) → kde() or a transformation', 'Tiny samples — sigma is very uncertain'],
  },

  notes: {
    cpython:    'Lib/statistics.py: return cls(*_mean_stdev(data)); _mean_stdev runs _ss() once and returns float(mean) and _float_sqrt_of_frac(ss / (n - 1))',
    'Exactness': 'Both parameters come from exact fraction arithmetic: mu equals statistics.mean(data) converted to float, sigma equals statistics.stdev(data)',
  },

  related: [
    { name: 'NormalDist', slug: 'normaldist', when: 'The class itself' },
    { name: 'stdev', slug: 'stdev-pstdev', when: 'The sigma estimate' },
    { name: 'mean', slug: 'mean', when: 'The mu estimate' },
    { name: 'kde', slug: 'kde', when: 'A non-parametric alternative' },
  ],

  faq: [
    {
      q: 'How do I fit a normal distribution to data in Python?',
      a: 'statistics.NormalDist.from_samples(data) returns a NormalDist with the sample mean and sample standard deviation. Then use its cdf, inv_cdf, quantiles or samples.',
    },
    {
      q: 'Does from_samples use the sample or population standard deviation?',
      a: 'The sample standard deviation (divides by n - 1), the same value as statistics.stdev(data).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist.from_samples',
    meta:  'NormalDist.from_samples',
  },
};
