// content/reference/python/stdlib/statistics/correlation.js — statistics.correlation

export const meta = {
  slug:        'correlation',
  name:        'statistics.correlation',
  signature:   "statistics.correlation(x, y, /, *, method='linear')",
  blurb:       "Pearson's correlation coefficient r between -1 and +1, or Spearman's rank correlation with method='ranked' (3.12+).",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.10+ (ranked 3.12+)',
  searchTerms: "statistics.correlation correlation pearson correlation coefficient spearman rank correlation python correlation of two lists r value at least one of the inputs is constant correlation requires that both inputs have same number of data points method ranked",
};

export const method = {
  slug:      'correlation',
  name:      'statistics.correlation',
  signature: "statistics.correlation(x, y, /, *, method='linear')",
  returns:   { type: 'float', desc: 'r in [-1, 1]: Σ dx·dy / sqrt(Σ dx² · Σ dy²) of the deviations (linear) or of centred ranks (ranked).' },

  category:    'statistics function',
  version:     'Python 3.10+ (ranked 3.12+)',
  hasLiveDemo: true,

  subtitle: "Pearson's r measures how close the points are to a straight line; Spearman's ranked version measures whether the relationship is monotonic at all, and shrugs off outliers. Ties are given their average rank.",

  covers: ['correlation'],

  cheat: {
    commonCall: "statistics.correlation(x, y, method='ranked')",
    returns:    'float between -1.0 and 1.0',
    replaces:   'scipy.stats.pearsonr / spearmanr (coefficient only)',
    watchOut:   'A constant input raises StatisticsError instead of returning nan',
  },

  parameters: [
    { name: 'x, y',   type: 'sequences of numbers', required: true,  default: null,       desc: 'Same length, at least two values each, neither constant. Positional-only.' },
    { name: 'method', type: 'str',                  required: false, default: "'linear'", desc: "'linear' for Pearson, 'ranked' for Spearman (3.12+). Keyword-only." },
  ],

  modes: [
    {
      id: 'both',
      label: 'Pearson vs Spearman',
      blurb: 'Two lists of the same length.',
      params: [
        { name: 'x', type: 'list', hint: 'first variable',  input: 'csv-num' },
        { name: 'y', type: 'list', hint: 'second variable', input: 'csv-num' },
      ],
      template: "import statistics\nx = {$x}\ny = {$y}\n(statistics.correlation(x, y), statistics.correlation(x, y, method='ranked'))",
      cases: [
        { id: 'line',    label: 'straight line', values: { x: '1, 2, 3, 4, 5', y: '3, 5, 7, 9, 11' } },
        { id: 'square',  label: 'y = x²',        values: { x: '1, 2, 3', y: '1, 4, 9' } },
        { id: 'outlier', label: 'one outlier',   values: { x: '1, 2, 3, 4, 5', y: '1, 2, 3, 4, 100' } },
        { id: 'noisy',   label: 'noisy',         values: { x: '1, 2, 3, 4, 5', y: '2, 4, 5, 4, 5' } },
        { id: 'const',   label: 'constant y',    values: { x: '1, 2, 3', y: '5, 5, 5' } },
      ],
    },
    {
      id: 'method',
      label: 'method',
      blurb: "Any method name — only 'linear' and 'ranked' exist.",
      params: [
        { name: 'x',      type: 'list', hint: 'first variable',  input: 'csv-num' },
        { name: 'y',      type: 'list', hint: 'second variable', input: 'csv-num' },
        { name: 'method', type: 'str',  hint: 'linear or ranked', input: 'text' },
      ],
      template: 'import statistics\nstatistics.correlation({$x}, {$y}, method={$method})',
      cases: [
        { id: 'ranked',   label: 'ranked, with ties', values: { x: '1, 1, 2, 3', y: '4, 5, 5, 6', method: 'ranked' } },
        { id: 'linear',   label: 'linear',            values: { x: '1, 1, 2, 3', y: '4, 5, 5, 6', method: 'linear' } },
        { id: 'spearman', label: 'spearman',          values: { x: '1, 2, 3', y: '1, 4, 9', method: 'spearman' } },
      ],
    },
  ],
  demoExplainer: "Points on a straight line give 1.0 with both methods. For y = x² Pearson gives 0.989743318610787 — close to, but not exactly, a line — while Spearman gives 1.0 because y always increases with x. A single outlier drags Pearson down to 0.7249994335944137 but leaves Spearman at 1.0. A constant input has no correlation and raises StatisticsError; an unknown method name raises ValueError.",

  patterns: [
    {
      name: 'Monotonic but not linear',
      desc: 'Use ranked when you only care whether y goes up with x.',
      code: "import statistics\nrho = statistics.correlation(hours_studied, exam_rank, method='ranked')",
    },
    {
      name: 'Correlation matrix',
      desc: 'All pairs of a few variables.',
      code: 'import statistics\nnames = list(columns)\nmatrix = {(a, b): statistics.correlation(columns[a], columns[b]) for a in names for b in names}',
    },
  ],

  examples: [
    { title: 'Perfect positive and negative', code: 'import statistics\nx = [1, 2, 3, 4, 5, 6, 7, 8, 9]\n(statistics.correlation(x, x), statistics.correlation(x, x[::-1]))', returns: '(1.0, -1.0)' },
    { title: 'Docs: weak relationship',  code: 'import statistics\nstatistics.correlation([1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 1, 2, 3, 1, 2, 3])', returns: '0.31622776601683794' },
    { title: "Kepler: monotonic, not linear", code: "import statistics\nperiod = [88, 225, 365, 687, 4331, 10_756, 30_687, 60_190]\ndist = [58, 108, 150, 228, 778, 1_400, 2_900, 4_500]\n(statistics.correlation(period, dist, method='ranked'), round(statistics.correlation(period, dist), 4))", returns: '(1.0, 0.9882)' },
    { title: 'Units do not matter',      code: 'import statistics\n(statistics.correlation([1, 2, 3, 4, 5], [2, 4, 5, 4, 5]), statistics.correlation([100, 200, 300, 400, 500], [2, 4, 5, 4, 5]))', returns: '(0.7745966692414834, 0.7745966692414834)' },
    { title: 'Needs two points',         code: 'import statistics\nstatistics.correlation([1], [1])', returns: 'statistics.StatisticsError: correlation requires at least two data points' },
    { title: 'Unknown method',           code: "import statistics\nstatistics.correlation([1, 2, 3], [1, 4, 9], method='spearman')", returns: "ValueError: Unknown method: 'spearman'" },
  ],

  pitfalls: [
    {
      name: 'Correlating with a constant series',
      desc: 'If one input never changes, r is undefined (0 / 0). statistics raises StatisticsError where NumPy would return nan — check for constant data first.',
      wrong: { label: 'constant y', code: 'import statistics\nstatistics.correlation([1, 2, 3], [5, 5, 5])', output: 'statistics.StatisticsError: at least one of the inputs is constant' },
      fix:   { label: 'guard', code: "import statistics\nx, y = [1, 2, 3], [5, 5, 5]\nstatistics.correlation(x, y) if len(set(y)) > 1 and len(set(x)) > 1 else 'undefined'", output: "'undefined'" },
    },
    {
      name: 'Pearson with an outlier',
      desc: 'One extreme value can hide a perfectly monotonic relationship. Spearman ranks first, so the outlier is just "the largest".',
      wrong: { label: 'linear', code: 'import statistics\nstatistics.correlation([1, 2, 3, 4, 5], [1, 2, 3, 4, 100])', output: '0.7249994335944137' },
      fix:   { label: 'ranked', code: "import statistics\nstatistics.correlation([1, 2, 3, 4, 5], [1, 2, 3, 4, 100], method='ranked')", output: '1.0' },
    },
  ],

  when: {
    use: ['How strongly two variables move together, unit-free', 'Ordinal data or outliers → ranked'],
    avoid: ['p-values and confidence intervals → scipy.stats', 'Non-monotonic relationships (U shapes) — both coefficients can be near 0'],
  },

  notes: {
    cpython:    'Lib/statistics.py: linear centres x and y on their fsum means; ranked replaces both by ranks centred on zero (ties averaged); then sxy / _sqrtprod(sxx, syy) with all sums from math.sumprod',
    'Versions': "Added in 3.10; method='ranked' in 3.12. 3.13 computes the denominator with _sqrtprod (a square root with a correction term) instead of sqrt(sxx * syy), so the last digit can differ from 3.12: for x = [-39, -11, 37, -10, -11, -28], y = [-40, 30, -31, 42, 38, -11] 3.12 gives -0.03325570620824126 and 3.13 -0.033255706208241254",
    'Platform': 'Only exact arithmetic, sumprod and sqrt are used, so a given version gives the same result on every platform',
  },

  related: [
    { name: 'covariance', slug: 'covariance', when: 'The unnormalised numerator' },
    { name: 'linear_regression', slug: 'linear_regression', when: 'The best-fitting line' },
    { name: 'stdev', slug: 'stdev-pstdev', when: 'The spreads in the denominator' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Constant or too-short inputs' },
  ],

  faq: [
    {
      q: 'How do I calculate the correlation coefficient in Python?',
      a: "statistics.correlation(x, y) returns Pearson's r (Python 3.10+). Add method='ranked' for Spearman's rank correlation (3.12+).",
    },
    {
      q: 'What is the difference between Pearson and Spearman correlation?',
      a: 'Pearson measures linear association of the values; Spearman applies Pearson to the ranks, so it measures any monotonic association and is robust to outliers. For y = x² on 1, 2, 3 Pearson is about 0.99 and Spearman exactly 1.0.',
    },
    {
      q: 'Why does correlation raise "at least one of the inputs is constant"?',
      a: 'The formula divides by the spread of each input; a constant input has zero spread, so r is undefined. statistics raises StatisticsError instead of returning nan.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.correlation',
    meta:  'statistics.correlation',
  },
};
