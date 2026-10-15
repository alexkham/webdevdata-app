// content/reference/python/stdlib/statistics/linear_regression.js — statistics.linear_regression

export const meta = {
  slug:        'linear_regression',
  name:        'statistics.linear_regression',
  signature:   'statistics.linear_regression(x, y, /, *, proportional=False)',
  blurb:       'Ordinary least-squares line y = slope * x + intercept for one independent variable, returned as a LinearRegression named tuple; proportional=True forces the line through the origin (3.11+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.10+ (proportional 3.11+)',
  searchTerms: 'statistics.linear_regression linear regression least squares slope intercept line of best fit python trend line LinearRegression namedtuple proportional regression through origin x is constant linear regression requires at least two data points',
};

export const method = {
  slug:      'linear_regression',
  name:      'statistics.linear_regression',
  signature: 'statistics.linear_regression(x, y, /, *, proportional=False)',
  returns:   { type: 'LinearRegression(slope, intercept)', desc: 'A named tuple of two floats; intercept is 0.0 when proportional=True.' },

  category:    'statistics function',
  version:     'Python 3.10+ (proportional 3.11+)',
  hasLiveDemo: true,

  subtitle: 'slope = covariance(x, y) / variance(x), intercept = mean(y) - slope * mean(x), computed with fsum and sumprod. The result unpacks like a tuple and has .slope and .intercept attributes.',

  covers: ['linear_regression'],

  cheat: {
    commonCall: 'slope, intercept = statistics.linear_regression(x, y)',
    returns:    'LinearRegression(slope=0.6, intercept=2.2)',
    replaces:   'numpy.polyfit(x, y, 1) for a single straight line',
    watchOut:   'x must not be constant; proportional is keyword-only',
  },

  parameters: [
    { name: 'x', type: 'sequence of numbers', required: true, default: null, desc: 'Independent variable (at least two values, not all equal). Positional-only.' },
    { name: 'y', type: 'sequence of numbers', required: true, default: null, desc: 'Dependent variable, same length. Positional-only.' },
    { name: 'proportional', type: 'bool', required: false, default: 'False', desc: 'Fit y = slope * x through the origin (3.11+). Keyword-only.' },
  ],

  modes: [
    {
      id: 'fit',
      label: 'fit a line',
      blurb: 'Two lists of the same length.',
      params: [
        { name: 'x', type: 'list', hint: 'independent values', input: 'csv-num' },
        { name: 'y', type: 'list', hint: 'dependent values',   input: 'csv-num' },
      ],
      template: 'import statistics\nstatistics.linear_regression({$x}, {$y})',
      cases: [
        { id: 'noisy', label: '5 noisy points',  values: { x: '1, 2, 3, 4, 5', y: '2, 4, 5, 4, 5' } },
        { id: 'exact', label: 'y = 2x + 1',      values: { x: '1, 2, 3', y: '3, 5, 7' } },
        { id: 'films', label: 'Monty Python films', values: { x: '1971, 1975, 1979, 1982, 1983', y: '1, 2, 3, 4, 5' } },
        { id: 'const', label: 'constant x',      values: { x: '1, 1', y: '1, 2' } },
      ],
    },
    {
      id: 'origin',
      label: 'through the origin',
      blurb: 'proportional=True: the best line of the form y = slope * x.',
      params: [
        { name: 'x', type: 'list', hint: 'independent values', input: 'csv-num' },
        { name: 'y', type: 'list', hint: 'dependent values',   input: 'csv-num' },
      ],
      template: 'import statistics\nstatistics.linear_regression({$x}, {$y}, proportional=True)',
      cases: [
        { id: 'offset', label: 'y = 2x + 1 data', values: { x: '1, 2, 3', y: '3, 5, 7' } },
        { id: 'exact',  label: 'y = 2x',          values: { x: '1, 2, 3', y: '2, 4, 6' } },
        { id: 'zeros',  label: 'x all zero',      values: { x: '0, 0', y: '1, 2' } },
      ],
    },
    {
      id: 'predict',
      label: 'predict',
      blurb: 'Fit, then evaluate the line at a new x.',
      params: [
        { name: 'x',  type: 'list',  hint: 'independent values', input: 'csv-num' },
        { name: 'y',  type: 'list',  hint: 'dependent values',   input: 'csv-num' },
        { name: 'at', type: 'float', hint: 'new x',              input: 'float' },
      ],
      template: 'import statistics\nslope, intercept = statistics.linear_regression({$x}, {$y})\nslope * {$at} + intercept',
      cases: [
        { id: 'films', label: 'films by 2019', values: { x: '1971, 1975, 1979, 1982, 1983', y: '1, 2, 3, 4, 5', at: '2019' } },
        { id: 'line',  label: 'y = 2x + 1 at 10', values: { x: '1, 2, 3', y: '3, 5, 7', at: '10' } },
      ],
    },
  ],
  demoExplainer: 'For 2, 4, 5, 4, 5 the line is y = 0.6 x + 2.2. Exact data reproduce their line: slope 2.0, intercept 1.0. Forcing the same data through the origin gives the slope 2.4285714285714284 (= 34 / 14) instead. A constant x has no slope and raises StatisticsError("x is constant"). The docs example extrapolates the five Monty Python films (slope 0.31 films per year) to 15.710000000000036 by 2019.',

  patterns: [
    {
      name: 'Fit and predict',
      desc: 'Unpack the named tuple.',
      code: 'import statistics\nslope, intercept = statistics.linear_regression(x, y)\npredicted = [slope * xi + intercept for xi in new_x]',
    },
    {
      name: 'Residuals',
      desc: 'What the line does not explain.',
      code: 'import statistics\nfit = statistics.linear_regression(x, y)\nresiduals = [yi - (fit.slope * xi + fit.intercept) for xi, yi in zip(x, y)]',
    },
    {
      name: 'Power law via logs',
      desc: 'Fit log(y) = k * log(x) + c for y = C * x**k.',
      code: 'import math\nimport statistics\nk, c = statistics.linear_regression([math.log(v) for v in x], [math.log(v) for v in y])',
    },
  ],

  examples: [
    { title: 'Attributes and unpacking',  code: 'import statistics\nfit = statistics.linear_regression([1, 2, 3], [3, 5, 7])\n(fit.slope, fit.intercept)', returns: '(2.0, 1.0)' },
    { title: 'It is a tuple',             code: 'import statistics\ntuple(statistics.linear_regression([1, 2], [3, 4]))', returns: '(1.0, 2.0)' },
    { title: 'Float noise in the result', code: 'import statistics\nstatistics.linear_regression([1, 2, 3], [2, 4, 7])',  returns: 'LinearRegression(slope=2.5, intercept=-0.666666666666667)' },
    { title: 'Proportional fit',          code: 'import statistics\nstatistics.linear_regression([0, 1, 2], [1, 3, 5], proportional=True)', returns: 'LinearRegression(slope=2.6, intercept=0.0)' },
    { title: 'Lengths must match',        code: 'import statistics\nstatistics.linear_regression([1, 2, 3], [1, 2])', returns: 'statistics.StatisticsError: linear regression requires that both inputs have same number of data points' },
    { title: 'Two points minimum',        code: 'import statistics\nstatistics.linear_regression([1], [1])',  returns: 'statistics.StatisticsError: linear regression requires at least two data points' },
  ],

  pitfalls: [
    {
      name: 'Passing proportional positionally',
      desc: 'proportional is keyword-only; a third positional argument is a TypeError.',
      wrong: { label: 'third argument', code: 'import statistics\nstatistics.linear_regression([1, 2, 3], [2, 4, 6], True)', output: 'TypeError: linear_regression() takes 2 positional arguments but 3 were given' },
      fix:   { label: 'proportional=True', code: 'import statistics\nstatistics.linear_regression([1, 2, 3], [2, 4, 6], proportional=True)', output: 'LinearRegression(slope=2.0, intercept=0.0)' },
    },
    {
      name: 'Forcing the origin on data with an offset',
      desc: 'proportional=True is only right when y must be 0 at x = 0. Otherwise the slope absorbs the missing intercept.',
      wrong: { label: 'proportional', code: 'import statistics\nstatistics.linear_regression([1, 2, 3], [3, 5, 7], proportional=True)', output: 'LinearRegression(slope=2.4285714285714284, intercept=0.0)' },
      fix:   { label: 'ordinary fit', code: 'import statistics\nstatistics.linear_regression([1, 2, 3], [3, 5, 7])', output: 'LinearRegression(slope=2.0, intercept=1.0)' },
    },
  ],

  when: {
    use: ['A trend line through (x, y) points', 'Quick extrapolation and calibration curves'],
    avoid: ['Several independent variables, R², p-values → statsmodels / scikit-learn', 'Curves → transform (log) first or use numpy.polyfit'],
  },

  notes: {
    cpython:    'Lib/statistics.py: xbar, ybar via fsum; x and y are centred; slope = sumprod(x, y) / sumprod(x, x); intercept = ybar - slope * xbar. With proportional=True the raw values are used and the intercept is 0.0',
    'Result':   'LinearRegression is a collections.namedtuple("LinearRegression", ("slope", "intercept"))',
    'Versions': 'Added in 3.10; proportional added in 3.11',
  },

  related: [
    { name: 'correlation', slug: 'correlation', when: 'How good a straight line the data make' },
    { name: 'covariance', slug: 'covariance', when: 'The slope numerator' },
    { name: 'variance', slug: 'variance-pvariance', when: 'The slope denominator' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Constant x, too few points' },
  ],

  faq: [
    {
      q: 'How do I do a linear regression in Python without NumPy?',
      a: 'slope, intercept = statistics.linear_regression(x, y) (Python 3.10+). Predictions are slope * new_x + intercept.',
    },
    {
      q: 'How do I force the regression line through zero?',
      a: 'Pass proportional=True (Python 3.11+). The model becomes y = slope * x and the intercept is reported as 0.0.',
    },
    {
      q: 'Why does linear_regression raise "x is constant"?',
      a: 'With all x values equal the line would be vertical: the slope divides by the variance of x, which is zero.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.linear_regression',
    meta:  'statistics.linear_regression',
  },
};
