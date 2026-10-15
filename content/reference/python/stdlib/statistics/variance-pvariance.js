// content/reference/python/stdlib/statistics/variance-pvariance.js — statistics.variance / statistics.pvariance

export const meta = {
  slug:        'variance-pvariance',
  name:        'statistics.variance / statistics.pvariance',
  signature:   'statistics.variance(data, xbar=None)  /  statistics.pvariance(data, mu=None)',
  blurb:       'Sample variance (divides by n - 1) and population variance (divides by n), computed exactly and returned in the type of the data.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'statistics.variance statistics.pvariance variance pvariance sample variance population variance n-1 bessel correction python variance of list variance requires at least two data points pvariance requires at least one data point xbar mu second moment',
};

export const method = {
  slug:      'variance-pvariance',
  name:      'statistics.variance / statistics.pvariance',
  signature: 'statistics.variance(data, xbar=None)  /  statistics.pvariance(data, mu=None)',
  returns:   { type: 'int | float | Fraction | Decimal', desc: 'The sum of squared deviations divided by n - 1 (variance) or n (pvariance), converted to the data type.' },

  category:    'statistics functions',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'The squared deviations are summed exactly with fractions, so there is no catastrophic cancellation even for values like 1000000000.1. Like mean(), the result keeps the type: int data with a whole result give an int.',

  covers: ['variance', 'pvariance'],

  cheat: {
    commonCall: 'statistics.variance(data)',
    returns:    '1.3720238095238095 for the docs’ sample',
    replaces:   'sum((x - m) ** 2 for x in data) / (len(data) - 1)',
    watchOut:   'variance needs 2+ points; a wrong xbar / mu is not checked',
  },

  parameters: [
    { name: 'data', type: 'iterable of numbers', required: true,  default: null,   desc: 'int, float, Fraction or Decimal values: at least two for variance, at least one for pvariance.' },
    { name: 'xbar / mu', type: 'number', required: false, default: 'None', desc: 'The mean, if you already have it (xbar for variance, mu for pvariance). It is used as given — a wrong value gives a wrong result. Note that it also changes how the deviations are computed: in plain Python arithmetic.' },
  ],

  modes: [
    {
      id: 'both',
      label: 'sample vs population',
      blurb: 'Comma-separated numbers.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(statistics.variance(data), statistics.pvariance(data))',
      cases: [
        { id: 'docs',   label: 'docs sample',   values: { data: '2.75, 1.75, 1.25, 0.25, 0.5, 1.25, 3.5' } },
        { id: 'ints',   label: '2, 4, 4, 4, 5, 5, 7, 9', values: { data: '2, 4, 4, 4, 5, 5, 7, 9' } },
        { id: 'big',    label: 'large offset',  values: { data: '1000000000.1, 1000000000.2, 1000000000.3' } },
        { id: 'same',   label: '10, 10, 10',    values: { data: '10, 10, 10' } },
        { id: 'one',    label: 'one value',     values: { data: '5' } },
      ],
    },
    {
      id: 'xbar',
      label: 'given mean',
      blurb: 'variance(data, xbar) trusts the mean you pass.',
      params: [
        { name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'xbar', type: 'int | float', hint: 'the mean', input: 'auto' },
      ],
      template: 'import statistics\nstatistics.variance({$data}, {$xbar})',
      cases: [
        { id: 'right', label: 'right mean (2)',   values: { data: '1, 2, 3', xbar: '2' } },
        { id: 'off',   label: 'off by 0.5',       values: { data: '1, 2, 3', xbar: '2.5' } },
        { id: 'wrong', label: 'wrong mean (0)',   values: { data: '1, 2, 3', xbar: '0' } },
      ],
    },
  ],
  demoExplainer: 'For 2, 4, 4, 4, 5, 5, 7, 9 the population variance is the int 4, while variance divides the same squared deviations (32) by 7. For the values near 1e9 the result, 0.00999999284744509, is the exact sample variance of the three stored binary values (none of which is exactly 1000000000.1, .2 or .3), rounded once. A constant list has variance 0 (an int). With xbar given, the right int mean 2 keeps the result an int (1); 2.5 gives 1.375 and the wrong mean 0 gives 7 — neither is rejected.',

  patterns: [
    {
      name: 'Reuse a mean you already computed',
      desc: 'Saves one pass over the data — only if the mean is exact.',
      code: 'import statistics\nm = statistics.mean(data)\nv = statistics.variance(data, m)',
    },
    {
      name: 'Variance around a target value',
      desc: 'pvariance with mu set to a reference value gives the mean squared error.',
      code: 'import statistics\nmse = statistics.pvariance(measurements, mu=target)',
    },
  ],

  examples: [
    { title: 'Fractions stay exact',    code: 'import statistics\nfrom fractions import Fraction as F\nstatistics.variance([F(1, 6), F(1, 2), F(5, 3)])', returns: 'Fraction(67, 108)' },
    { title: 'Decimals stay Decimal',   code: 'import statistics\nfrom decimal import Decimal as D\nstatistics.pvariance([D("27.5"), D("30.25"), D("30.25"), D("34.5"), D("41.75")])', returns: "Decimal('24.815')" },
    { title: 'Any iterable',            code: 'import statistics\nstatistics.variance(range(1, 7))',   returns: '3.5' },
    { title: 'One point is enough for pvariance', code: 'import statistics\nstatistics.pvariance([2])', returns: '0' },
    { title: 'Ints with a fractional result', code: 'import statistics\n(statistics.pvariance([1, 3]), statistics.pvariance([1, 2]))', returns: '(1, 0.25)' },
    { title: 'Too large to return as a float', code: 'import statistics\nstatistics.pvariance([1e308, -1e308])', returns: 'OverflowError: integer division result too large for a float' },
    { title: 'Strings',                 code: 'import statistics\nstatistics.variance(["a", "b"])',    returns: "TypeError: can't convert type 'str' to numerator/denominator" },
  ],

  pitfalls: [
    {
      name: 'variance of a single value',
      desc: 'Sample variance divides by n - 1, which is zero for one value. Use pvariance if the data is the whole population.',
      wrong: { label: 'variance', code: 'import statistics\nstatistics.variance([5])', output: 'statistics.StatisticsError: variance requires at least two data points' },
      fix:   { label: 'pvariance', code: 'import statistics\nstatistics.pvariance([5])', output: '0' },
    },
    {
      name: 'Passing a rounded mean as xbar',
      desc: 'xbar is used as given. A rounded mean adds its own error to every deviation.',
      wrong: { label: 'round(mean)', code: 'import statistics\ndata = [1, 2, 3, 4]\nstatistics.variance(data, round(statistics.mean(data)))', output: '2' },
      fix:   { label: 'exact mean', code: 'import statistics\ndata = [1, 2, 3, 4]\nstatistics.variance(data, statistics.mean(data))', output: '1.6666666666666667' },
    },
  ],

  when: {
    use: ['Spread of a sample (variance) or of a whole population (pvariance)', 'Exact variance of Fraction / Decimal data'],
    avoid: ['Same units as the data → stdev / pstdev', 'Very large float arrays → NumPy (much faster)'],
  },

  notes: {
    cpython:    'Lib/statistics.py: _ss() sums the exact ratios and squared ratios by denominator and computes (n * Σx² − (Σx)²) / n as a Fraction — exact, so the textbook one-pass formula is safe here; the result is divided by n - 1 or n and converted with _convert()',
    'With xbar / mu': '_ss() then computes (x - c) * (x - c) for each value in ordinary Python arithmetic (floats round) and sums those exactly',
    'Types':    'Same rules as mean(): int → int if whole else float; Decimal → Decimal; Fraction → Fraction; Decimal mixed with float raises TypeError',
  },

  related: [
    { name: 'stdev / pstdev', slug: 'stdev-pstdev', when: 'Square roots of these' },
    { name: 'mean', slug: 'mean', when: 'The xbar / mu argument' },
    { name: 'covariance', slug: 'covariance', when: 'Joint variability of two inputs' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Too few data points' },
  ],

  faq: [
    {
      q: 'What is the difference between variance and pvariance?',
      a: 'variance is the sample variance s² (sum of squared deviations / (n - 1), Bessel’s correction); pvariance is the population variance σ² (divided by n). Use variance when the data is a sample from a larger population.',
    },
    {
      q: 'Why does statistics.variance return an int?',
      a: 'Results are converted back to the type of the data: for ints, a whole result stays an int (pvariance([1, 3]) is 1) and a fractional one becomes a float (pvariance([1, 2]) is 0.25).',
    },
    {
      q: 'Is statistics.variance accurate for large values?',
      a: 'Yes. The sums of the values and of their squares are kept as exact fractions, so a large common offset causes no cancellation error; only the final result is rounded. (The inputs themselves are still the floats you passed in.)',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.variance',
    meta:  'statistics.variance',
  },
};
