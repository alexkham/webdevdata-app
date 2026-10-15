// content/reference/python/stdlib/statistics/stdev-pstdev.js — statistics.stdev / statistics.pstdev

export const meta = {
  slug:        'stdev-pstdev',
  name:        'statistics.stdev / statistics.pstdev',
  signature:   'statistics.stdev(data, xbar=None)  /  statistics.pstdev(data, mu=None)',
  blurb:       'Sample and population standard deviation: the square roots of variance and pvariance, correctly rounded from the exact variance.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'statistics.stdev statistics.pstdev stdev pstdev standard deviation sample standard deviation population standard deviation python standard deviation of list stdev requires at least two data points sqrt of variance n-1',
};

export const method = {
  slug:      'stdev-pstdev',
  name:      'statistics.stdev / statistics.pstdev',
  signature: 'statistics.stdev(data, xbar=None)  /  statistics.pstdev(data, mu=None)',
  returns:   { type: 'float | Decimal', desc: 'sqrt(variance) / sqrt(pvariance) — a float (a Decimal for Decimal data), correctly rounded.' },

  category:    'statistics functions',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'In current CPython (3.12 and 3.13 verified) the square root is taken of the exact fraction, not of a rounded float, so the result is the correctly rounded standard deviation — and it works even when the variance itself is too large for a float.',

  covers: ['stdev', 'pstdev'],

  cheat: {
    commonCall: 'statistics.stdev(data)',
    returns:    'float — stdev([1.5, 2.5, 2.5, 2.75, 3.25, 4.75]) is 1.0810874155219827',
    replaces:   'math.sqrt(statistics.variance(data))',
    watchOut:   'stdev needs at least two values; pstdev of one value is 0.0',
  },

  parameters: [
    { name: 'data', type: 'iterable of numbers', required: true, default: null, desc: 'Two or more values for stdev, one or more for pstdev.' },
    { name: 'xbar / mu', type: 'number', required: false, default: 'None', desc: 'A precomputed mean, used as given (see variance / pvariance).' },
  ],

  modes: [
    {
      id: 'both',
      label: 'sample vs population',
      blurb: 'Comma-separated numbers.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(statistics.stdev(data), statistics.pstdev(data))',
      cases: [
        { id: 'docs',  label: 'docs sample',            values: { data: '1.5, 2.5, 2.5, 2.75, 3.25, 4.75' } },
        { id: 'ints',  label: '2, 4, 4, 4, 5, 5, 7, 9', values: { data: '2, 4, 4, 4, 5, 5, 7, 9' } },
        { id: 'same',  label: '10, 10, 10',             values: { data: '10, 10, 10' } },
        { id: 'one',   label: 'one value',              values: { data: '5' } },
      ],
    },
    {
      id: 'naive',
      label: 'vs the textbook formula',
      blurb: 'stdev() next to a float implementation of the same formula.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import math\nimport statistics\ndata = {$data}\nm = sum(data) / len(data)\n(statistics.stdev(data), math.sqrt(sum((x - m) * (x - m) for x in data) / (len(data) - 1)))',
      cases: [
        { id: 'offset', label: 'large offset', values: { data: '1000000000.1, 1000000000.2, 1000000000.3' } },
        { id: 'ints',   label: 'small ints',   values: { data: '2, 4, 4, 4, 5, 5, 7, 9' } },
        { id: 'tenths', label: '0.1, 0.2, 0.3', values: { data: '0.1, 0.2, 0.3' } },
      ],
    },
  ],
  demoExplainer: 'stdev is always a float here, even for ints with a whole answer: pstdev of 2, 4, 4, 4, 5, 5, 7, 9 is 2.0 (pvariance gives the int 4). A single value has no sample standard deviation. For the values near 1e9 the float formula differs from the 13th significant digit on (0.09999996423726643 against 0.09999996423721906); for well-scaled data such as small ints the two agree.',

  patterns: [
    {
      name: 'Mean and standard deviation together',
      desc: 'NormalDist.from_samples computes both in one pass.',
      code: 'import statistics\nnd = statistics.NormalDist.from_samples(data)\nmean, sd = nd.mean, nd.stdev',
    },
    {
      name: 'Coefficient of variation',
      desc: 'Relative spread, unit-free.',
      code: 'import statistics\ncv = statistics.stdev(data) / statistics.fmean(data)',
    },
    {
      name: 'z-scores of a sample',
      desc: 'Standardise each value.',
      code: 'import statistics\nm, s = statistics.fmean(data), statistics.stdev(data)\nz = [(x - m) / s for x in data]',
    },
  ],

  examples: [
    { title: 'Docs: population',          code: 'import statistics\nstatistics.pstdev([1.5, 2.5, 2.5, 2.75, 3.25, 4.75])', returns: '0.986893273527251' },
    { title: 'Fractions give a float',    code: 'import statistics\nfrom fractions import Fraction as F\nstatistics.stdev([F(1, 6), F(1, 2), F(5, 3)])', returns: '0.787635937708768' },
    { title: 'Decimals give a Decimal',   code: 'import statistics\nfrom decimal import Decimal as D\nstatistics.stdev([D("27.5"), D("30.25"), D("30.25"), D("34.5"), D("41.75")])', returns: "Decimal('5.569447908006681410548166973')" },
    { title: 'One value: pstdev is 0.0',  code: 'import statistics\nstatistics.pstdev([2])',             returns: '0.0' },
    { title: 'Beyond the float range',    code: 'import statistics\nstatistics.stdev([1e308, -1e308])',  returns: '1.4142135623730951e+308' },
    { title: 'Infinity is not handled',   code: "import statistics\nstatistics.stdev([1, float('inf')])", returns: "AttributeError: 'float' object has no attribute 'numerator'" },
  ],

  pitfalls: [
    {
      name: 'Sample vs population',
      desc: 'stdev (n - 1) is for samples, pstdev (n) for complete populations. For small n the difference is large.',
      wrong: { label: 'stdev of all 4 items', code: 'import statistics\nstatistics.stdev([1, 2, 3, 4])', output: '1.2909944487358056' },
      fix:   { label: 'pstdev', code: 'import statistics\nstatistics.pstdev([1, 2, 3, 4])', output: '1.118033988749895' },
    },
    {
      name: 'math.sqrt(variance) rounds twice',
      desc: 'variance() is rounded to a float, then sqrt rounds again — and overflows where stdev() does not.',
      wrong: { label: 'sqrt(pvariance)', code: 'import math\nimport statistics\nmath.sqrt(statistics.pvariance([1e308, -1e308]))', output: 'OverflowError: integer division result too large for a float' },
      fix:   { label: 'pstdev', code: 'import statistics\nstatistics.pstdev([1e308, -1e308])', output: '1e+308' },
    },
  ],

  when: {
    use: ['Spread in the units of the data', 'Error bars, z-scores, control limits'],
    avoid: ['Skewed data with outliers → quantiles / IQR', 'Huge arrays → numpy.std'],
  },

  notes: {
    cpython:    'Lib/statistics.py: the same _ss() as variance; the exact mean square is passed to _float_sqrt_of_frac(), which uses math.isqrt with round-to-odd to get a correctly rounded float (a Decimal path uses Decimal.sqrt with a correction step)',
    'Versions': 'Both 3.12 and 3.13 use _float_sqrt_of_frac() for the correctly rounded result; check older releases before relying on the last digit',
    'NaN / inf': 'An infinity or NaN in the data ends in AttributeError, since the float result has no numerator',
  },

  related: [
    { name: 'variance / pvariance', slug: 'variance-pvariance', when: 'The squares of these' },
    { name: 'NormalDist.from_samples', slug: 'normaldist-from_samples', when: 'Mean and stdev in one object' },
    { name: 'math.sqrt', slug: 'sqrt-isqrt-cbrt', when: 'Square roots in general', category: 'stdlib/math' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Too few data points' },
  ],

  faq: [
    {
      q: 'How do I calculate the standard deviation in Python?',
      a: 'statistics.stdev(data) for a sample, statistics.pstdev(data) for a whole population. Both return a float (a Decimal for Decimal input).',
    },
    {
      q: 'Why does stdev need at least two data points?',
      a: 'The sample standard deviation divides by n - 1; with one point there is no spread to estimate. pstdev([x]) is defined and returns 0.0.',
    },
    {
      q: 'Is stdev the same as numpy.std?',
      a: 'numpy.std defaults to ddof=0, i.e. the population formula — it matches statistics.pstdev. statistics.stdev matches numpy.std(data, ddof=1).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.stdev',
    meta:  'statistics.stdev',
  },
};
