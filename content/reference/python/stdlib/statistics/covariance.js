// content/reference/python/stdlib/statistics/covariance.js — statistics.covariance

export const meta = {
  slug:        'covariance',
  name:        'statistics.covariance',
  signature:   'statistics.covariance(x, y, /)',
  blurb:       'Sample covariance of two equally long inputs: positive when they rise together, negative when one falls as the other rises.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.10+',
  searchTerms: 'statistics.covariance covariance sample covariance python covariance of two lists joint variability covariance requires that both inputs have same number of data points covariance requires at least two data points',
};

export const method = {
  slug:      'covariance',
  name:      'statistics.covariance',
  signature: 'statistics.covariance(x, y, /)',
  returns:   { type: 'float', desc: 'Σ (xi − x̄)(yi − ȳ) / (n − 1).' },

  category:    'statistics function',
  version:     'Python 3.10+',
  hasLiveDemo: true,

  subtitle: 'Works in floats: the means come from math.fsum and the sum of products from math.sumprod (extended precision), divided by n - 1. Its size depends on the units of x and y — use correlation() for a unit-free measure.',

  covers: ['covariance'],

  cheat: {
    commonCall: 'statistics.covariance(x, y)',
    returns:    'float — 0.75 for the docs example',
    replaces:   'sum((a - mx) * (b - my) for a, b in zip(x, y)) / (n - 1)',
    watchOut:   'Positional-only; both inputs need the same length, at least 2',
  },

  parameters: [
    { name: 'x', type: 'sequence of numbers', required: true, default: null, desc: 'First variable (needs len()). Positional-only.' },
    { name: 'y', type: 'sequence of numbers', required: true, default: null, desc: 'Second variable, same length as x.' },
  ],

  modes: [
    {
      id: 'cov',
      label: 'covariance',
      blurb: 'Two comma-separated lists of the same length.',
      params: [
        { name: 'x', type: 'list', hint: 'first variable',  input: 'csv-num' },
        { name: 'y', type: 'list', hint: 'second variable', input: 'csv-num' },
      ],
      template: 'import statistics\nstatistics.covariance({$x}, {$y})',
      cases: [
        { id: 'docs',  label: 'docs example', values: { x: '1, 2, 3, 4, 5, 6, 7, 8, 9', y: '1, 2, 3, 1, 2, 3, 1, 2, 3' } },
        { id: 'neg',   label: 'opposite',     values: { x: '1, 2, 3, 4, 5, 6, 7, 8, 9', y: '9, 8, 7, 6, 5, 4, 3, 2, 1' } },
        { id: 'const', label: 'constant y',   values: { x: '1, 2, 3', y: '5, 5, 5' } },
        { id: 'len',   label: 'lengths differ', values: { x: '1, 2, 3', y: '1, 2' } },
      ],
    },
    {
      id: 'units',
      label: 'units matter',
      blurb: 'Scale x by 100 (metres → centimetres): covariance scales too, correlation does not.',
      params: [
        { name: 'x', type: 'list', hint: 'first variable',  input: 'csv-num' },
        { name: 'y', type: 'list', hint: 'second variable', input: 'csv-num' },
      ],
      template: 'import statistics\nx = {$x}\ny = {$y}\n(statistics.covariance(x, y), statistics.covariance([v * 100 for v in x], y), statistics.correlation(x, y))',
      cases: [
        { id: 'five', label: '5 points', values: { x: '1, 2, 3, 4, 5', y: '2, 4, 5, 4, 5' } },
        { id: 'down', label: 'falling',  values: { x: '1, 2, 3', y: '3, 2, 1' } },
      ],
    },
  ],
  demoExplainer: 'In the docs example x rises steadily while y cycles 1, 2, 3, giving a small positive covariance of 0.75; reversing y gives -7.5. A constant input has covariance 0.0 (correlation would raise instead). Multiplying x by 100 multiplies the covariance by 100 (1.5 becomes 150.0), while the correlation stays 0.7745966692414834.',

  patterns: [
    {
      name: 'Covariance matrix of a few columns',
      desc: 'Pairwise covariances, diagonal = variances.',
      code: 'import statistics\ncols = [heights, weights, ages]\nmatrix = [[statistics.covariance(a, b) for b in cols] for a in cols]',
    },
    {
      name: 'Slope from covariance',
      desc: 'The least-squares slope is cov(x, y) / var(x) — linear_regression does this for you.',
      code: 'import statistics\nslope = statistics.covariance(x, y) / statistics.variance(x)',
    },
  ],

  examples: [
    { title: 'Order of arguments does not matter', code: 'import statistics\nx = [1, 2, 3, 4, 5, 6, 7, 8, 9]\nz = [9, 8, 7, 6, 5, 4, 3, 2, 1]\n(statistics.covariance(x, z), statistics.covariance(z, x))', returns: '(-7.5, -7.5)' },
    { title: 'Covariance with itself is the variance', code: 'import statistics\nx = [1, 2, 3, 4]\n(statistics.covariance(x, x), statistics.variance(x))', returns: '(1.6666666666666667, 1.6666666666666667)' },
    { title: 'Always a float',           code: 'import statistics\nstatistics.covariance([1, 2, 3], [2, 4, 6])',  returns: '2.0' },
    { title: 'Float data',               code: 'import statistics\nstatistics.covariance([0.1, 0.2, 0.3], [1, 2, 3])', returns: '0.09999999999999999' },
    { title: 'Needs two points',         code: 'import statistics\nstatistics.covariance([1], [1])',              returns: 'statistics.StatisticsError: covariance requires at least two data points' },
    { title: 'Positional only',          code: 'import statistics\nstatistics.covariance(x=[1, 2], y=[3, 4])',    returns: "TypeError: covariance() got some positional-only arguments passed as keyword arguments: 'x, y'" },
  ],

  pitfalls: [
    {
      name: 'Reading covariance as strength',
      desc: 'Covariance grows with the scale of the data. Compare relationships with correlation(), which is always between -1 and 1.',
      wrong: { label: 'covariance in cm', code: 'import statistics\nstatistics.covariance([100, 200, 300, 400, 500], [2, 4, 5, 4, 5])', output: '150.0' },
      fix:   { label: 'correlation', code: 'import statistics\nstatistics.correlation([100, 200, 300, 400, 500], [2, 4, 5, 4, 5])', output: '0.7745966692414834' },
    },
    {
      name: 'Inputs of different lengths',
      desc: 'Pairs are matched by position, so a missing value is an error rather than being skipped.',
      wrong: { label: 'zip-like', code: 'import statistics\nstatistics.covariance([1, 2, 3], [1, 2])', output: 'statistics.StatisticsError: covariance requires that both inputs have same number of data points' },
      fix:   { label: 'pairs only', code: 'import statistics\nx, y = [1, 2, 3], [1, 2]\nn = min(len(x), len(y))\nstatistics.covariance(x[:n], y[:n])', output: '0.5' },
    },
  ],

  when: {
    use: ['Whether two variables move together, in their own units', 'Building blocks for regression and portfolio maths'],
    avoid: ['Comparing strength across datasets → correlation()', 'Population covariance → multiply by (n - 1) / n'],
  },

  notes: {
    cpython:    'Lib/statistics.py: xbar = fsum(x) / n, ybar = fsum(y) / n, then sumprod((xi - xbar for xi in x), (yi - ybar for yi in y)) / (n - 1)',
    'Inputs':   'x and y need len(); generators are not accepted. Values are combined in float arithmetic (ints are converted)',
  },

  related: [
    { name: 'correlation', slug: 'correlation', when: 'Unit-free strength of the relationship' },
    { name: 'linear_regression', slug: 'linear_regression', when: 'Slope and intercept' },
    { name: 'variance', slug: 'variance-pvariance', when: 'covariance(x, x)' },
    { name: 'math.sumprod', slug: 'sumprod', when: 'The extended-precision sum of products', category: 'stdlib/math' },
  ],

  faq: [
    {
      q: 'How do I calculate covariance in Python?',
      a: 'statistics.covariance(x, y) (Python 3.10+) returns the sample covariance. Both sequences must have the same length and at least two values.',
    },
    {
      q: 'Is statistics.covariance the sample or the population covariance?',
      a: 'The sample covariance: it divides by n - 1. Multiply by (n - 1) / n for the population version.',
    },
    {
      q: 'What does a covariance of 0 mean?',
      a: 'No linear relationship between the inputs (or one of them is constant). It does not rule out a non-linear relationship.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.covariance',
    meta:  'statistics.covariance',
  },
};
