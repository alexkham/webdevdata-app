// content/reference/python/stdlib/statistics/index.js — the statistics module hub

export const meta = {
  slug:        'index',
  name:        'statistics',
  signature:   'import statistics',
  blurb:       'Averages, spread and relations for plain lists of numbers: mean, median, mode, stdev, variance, quantiles, correlation, linear_regression, NormalDist and kernel density estimates.',
  category:    'numbers',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'statistics module python mean median mode standard deviation stdev variance pstdev pvariance quantiles percentile quartile correlation covariance linear regression normal distribution NormalDist kde StatisticsError average without numpy',
};

export const method = {
  slug: 'index',
  name: 'statistics',

  category:    'Numbers & math',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Calculator-level statistics on lists of numbers, no NumPy needed. mean, variance and pvariance are computed exactly with fractions and converted once at the end, so they keep the type of your data: ints in, an int out when the answer is whole (stdev and pstdev always return a float).',

  imports: ['import statistics', 'from statistics import mean, median, stdev, NormalDist'],
  facts: [
    { label: 'Averages', value: 'mean, fmean, geometric_mean, harmonic_mean, median, median_low, median_high, median_grouped, mode, multimode, quantiles' },
    { label: 'Spread',   value: 'stdev, variance (sample) · pstdev, pvariance (population)' },
    { label: 'Two inputs', value: 'covariance, correlation (Pearson or Spearman ranked), linear_regression' },
    { label: 'Also',     value: 'NormalDist, kde and kde_random (3.13+), StatisticsError (a ValueError)' },
  ],

  coverClasses: ['NormalDist'],

  modes: [
    {
      id: 'summary',
      label: 'summary',
      blurb: 'Comma-separated numbers. Whole numbers are ints in the code, numbers with a point are floats.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(statistics.mean(data), statistics.median(data), statistics.mode(data), statistics.stdev(data))',
      cases: [
        { id: 'scores',  label: 'scores',       values: { data: '2, 4, 4, 4, 5, 5, 7, 9' } },
        { id: 'outlier', label: 'outlier',      values: { data: '1, 2, 2, 3, 100' } },
        { id: 'floats',  label: 'floats',       values: { data: '2.5, 3.25, 5.5, 11.25, 11.75' } },
        { id: 'one',     label: 'one value',    values: { data: '7' } },
        { id: 'empty',   label: 'empty',        values: { data: '' } },
      ],
    },
    {
      id: 'spread',
      label: 'sample vs population',
      blurb: 'variance/stdev divide by n - 1 (a sample); pvariance/pstdev divide by n (the whole population).',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(statistics.variance(data), statistics.pvariance(data), statistics.stdev(data), statistics.pstdev(data))',
      cases: [
        { id: 'scores',  label: 'scores',  values: { data: '2, 4, 4, 4, 5, 5, 7, 9' } },
        { id: 'outlier', label: 'outlier', values: { data: '1, 2, 2, 3, 100' } },
        { id: 'one',     label: 'one value', values: { data: '7' } },
      ],
    },
    {
      id: 'normal',
      label: 'NormalDist',
      blurb: 'A normal distribution: how many standard deviations x is from the mean, and the probability of a value at most x (rounded to 6 places).',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
        { name: 'x',     type: 'float', hint: 'a value',            input: 'float' },
      ],
      template: 'import statistics\nnd = statistics.NormalDist({$mu}, {$sigma})\n(nd.zscore({$x}), round(nd.cdf({$x}), 6))',
      cases: [
        { id: 'sat', label: 'SAT 1200',   values: { mu: '1060', sigma: '195', x: '1200' } },
        { id: 'iq',  label: 'IQ 130',     values: { mu: '100', sigma: '15', x: '130' } },
        { id: 'z',   label: 'z = 1.96',   values: { mu: '0', sigma: '1', x: '1.96' } },
        { id: 'zero', label: 'sigma 0',   values: { mu: '5', sigma: '0', x: '1' } },
      ],
    },
  ],
  demoExplainer: 'For 2, 4, 4, 4, 5, 5, 7, 9 the mean is the int 5 — the exact mean is whole and the data are ints — the median 4.5 averages the two middle values, and the mode is 4. One outlier moves the mean (21.6) but not the median (2). stdev needs two data points, so a single value raises StatisticsError. In the second tab pvariance of the scores is the int 4 while variance divides by 7 and gives 4.571428571428571. A zero sigma is allowed in NormalDist itself, but zscore() and cdf() then raise StatisticsError.',

  patterns: [
    {
      name: 'Describe a dataset',
      desc: 'The usual summary numbers in one go.',
      code: 'import statistics as st\nsummary = {\n    "mean": st.fmean(data),\n    "median": st.median(data),\n    "stdev": st.stdev(data),\n    "quartiles": st.quantiles(data, n=4),\n}',
    },
    {
      name: 'Handle empty input',
      desc: 'StatisticsError is a ValueError subclass.',
      code: 'import statistics\ntry:\n    avg = statistics.mean(values)\nexcept statistics.StatisticsError:\n    avg = None',
    },
    {
      name: 'Strip NaN before order statistics',
      desc: 'median, mode and quantiles sort or count; NaN breaks both.',
      code: 'import math\nimport statistics\nclean = [x for x in data if not math.isnan(x)]\nstatistics.median(clean)',
    },
  ],

  examples: [
    { title: 'mean keeps the data type',   code: 'import statistics\n(statistics.mean([1, 2, 3]), statistics.mean([1, 2, 3, 4]))', returns: '(2, 2.5)' },
    { title: 'Even count: median averages', code: 'import statistics\nstatistics.median([1, 3, 5, 7])',              returns: '4.0' },
    { title: 'Nominal data: mode',          code: 'import statistics\nstatistics.mode(["red", "blue", "blue", "red", "green", "red", "red"])', returns: "'red'" },
    { title: 'Quartiles',                   code: 'import statistics\nstatistics.quantiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])', returns: '[2.75, 5.5, 8.25]' },
    { title: 'Correlation and fit',         code: 'import statistics\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\n(statistics.correlation(x, y), statistics.linear_regression(x, y))', returns: '(0.7745966692414834, LinearRegression(slope=0.6, intercept=2.2))' },
    { title: 'Fractions stay exact',        code: 'import statistics\nfrom fractions import Fraction\nstatistics.mean([Fraction(1, 3), Fraction(1, 6)])', returns: 'Fraction(1, 4)' },
    { title: 'Empty data',                  code: 'import statistics\nstatistics.median([])',                          returns: 'statistics.StatisticsError: no median for empty data' },
  ],

  pitfalls: [
    {
      name: 'Sample vs population spread',
      desc: 'stdev() divides by n - 1 (data is a sample); pstdev() divides by n (data is everything). Pick the one that matches your data.',
      wrong: { label: 'stdev of a whole class', code: 'import statistics\nstatistics.stdev([2, 4, 4, 4, 5, 5, 7, 9])', output: '2.138089935299395' },
      fix:   { label: 'pstdev', code: 'import statistics\nstatistics.pstdev([2, 4, 4, 4, 5, 5, 7, 9])', output: '2.0' },
    },
    {
      name: 'Numbers stored as strings',
      desc: 'Data read from a file is text. Convert it first — the error message names the type.',
      wrong: { label: 'strings', code: "import statistics\nstatistics.mean(['1', '2', '3'])", output: "TypeError: can't convert type 'str' to numerator/denominator" },
      fix:   { label: 'map(float, ...)', code: "import statistics\nstatistics.mean(map(float, ['1', '2', '3']))", output: '2.0' },
    },
  ],

  when: {
    use: [
      'Summaries of small and medium datasets in plain Python',
      'Exact results for int, Fraction and Decimal data',
      'Teaching, scripts and services that should not depend on NumPy',
    ],
    avoid: [
      'Millions of values or arrays → NumPy / pandas (much faster)',
      'Hypothesis tests, regression with many variables → SciPy, statsmodels',
    ],
  },

  notes: {
    cpython:      'Lib/statistics.py, pure Python: _sum() and _ss() add the exact ratios of the data (as_integer_ratio) as Fractions, and the result is converted back to the input type once; NormalDist.inv_cdf uses a C helper from the built-in _statistics module',
    'Exactness':  'mean, variance, stdev and friends are correctly rounded results of exact arithmetic; fmean, geometric_mean, covariance, correlation and linear_regression work in floats (fsum / sumprod)',
    'Platform':   'Results that call the C math library — geometric_mean (log, exp), NormalDist.pdf / cdf / overlap, inv_cdf in the tails, samples, kde, kde_random — can differ in the last digit between Linux, Windows and macOS. fmean with weights and linear_regression(proportional=True), which pass the raw data to math.sumprod, can also differ on Windows when floats are mixed with ints beyond 32 bits, because sumprod accumulates ints in a C long, which is 32-bit there',
    'Versions':   'fmean, geometric_mean, multimode, quantiles, NormalDist 3.8; covariance, correlation, linear_regression 3.10; Spearman correlation 3.12; kde, kde_random 3.13',
  },

  related: [
    { name: 'math module',      slug: 'math',      when: 'fsum, sqrt and the libm functions used here', category: 'stdlib' },
    { name: 'fractions module', slug: 'fractions', when: 'The exact arithmetic underneath', category: 'stdlib' },
    { name: 'random module',    slug: 'random',    when: 'Seeded sampling; NormalDist.samples uses it', category: 'stdlib' },
    { name: 'collections module', slug: 'collections', when: 'Counter for frequency tables (mode uses it)', category: 'stdlib' },
    { name: 'sum()',            slug: 'sum',       when: 'A plain float total', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I calculate the mean, median and mode in Python without NumPy?',
      a: 'import statistics, then statistics.mean(data), statistics.median(data) and statistics.mode(data). For float data fmean() is faster than mean().',
    },
    {
      q: 'What is the difference between stdev and pstdev?',
      a: 'stdev is the sample standard deviation (divides the squared deviations by n - 1, Bessel’s correction); pstdev is the population standard deviation (divides by n). Use stdev when your data is a sample of a larger population.',
    },
    {
      q: 'Why does statistics.mean return an int?',
      a: 'The mean keeps the type of the data: for ints the exact mean is converted back to int when it is a whole number (mean([1, 2, 3]) is 2) and to float otherwise (mean([1, 2, 3, 4]) is 2.5). Use fmean() to always get a float.',
    },
    {
      q: 'What is StatisticsError?',
      a: 'The module’s exception for statistically impossible requests — no data, too few points, a constant input to correlation, a negative sigma. It subclasses ValueError, so except ValueError catches it too.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html',
    meta:  'statistics — Mathematical statistics functions',
  },

};
