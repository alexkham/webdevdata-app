// content/reference/python/stdlib/statistics/quantiles.js — statistics.quantiles

export const meta = {
  slug:        'quantiles',
  name:        'statistics.quantiles',
  signature:   "statistics.quantiles(data, *, n=4, method='exclusive')",
  blurb:       'Cut points that divide data into n groups of equal probability: quartiles (n=4), deciles (n=10), percentiles (n=100). Two interpolation methods.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+ (one data point allowed since 3.13)',
  searchTerms: 'statistics.quantiles quantiles quartiles deciles percentiles percentile python 25th 75th percentile interquartile range IQR exclusive inclusive R6 R7 PERCENTILE.EXC PERCENTILE.INC Unknown method n must be at least 1 must have at least one data point',
};

export const method = {
  slug:      'quantiles',
  name:      'statistics.quantiles',
  signature: "statistics.quantiles(data, *, n=4, method='exclusive')",
  returns:   { type: 'list', desc: 'n - 1 cut points, linearly interpolated between data points.' },

  category:    'statistics function',
  version:     'Python 3.8+ (one data point allowed since 3.13)',
  hasLiveDemo: true,

  subtitle: "The default \"exclusive\" method treats the data as a sample of a wider population (like Excel PERCENTILE.EXC) and can return cut points outside the data range; \"inclusive\" treats the minimum and maximum as the 0th and 100th percentiles (PERCENTILE.INC, the same numbers as NumPy's default).",

  covers: ['quantiles'],

  cheat: {
    commonCall: 'statistics.quantiles(data, n=4)',
    returns:    '[Q1, median, Q3]',
    replaces:   'numpy.percentile / numpy.quantile for simple cases',
    watchOut:   'n and method are keyword-only; exclusive can extrapolate past min/max',
  },

  parameters: [
    { name: 'data',   type: 'iterable of numbers', required: true,  default: null,          desc: 'At least one value (two before 3.13). Sorted internally.' },
    { name: 'n',      type: 'int',  required: false, default: '4',           desc: 'Number of groups; returns n - 1 cut points. Keyword-only, at least 1.' },
    { name: 'method', type: 'str',  required: false, default: "'exclusive'", desc: "'exclusive' (position i/(m+1), R6) or 'inclusive' (position (i-1)/(m-1), R7). Keyword-only." },
  ],

  modes: [
    {
      id: 'quantiles',
      label: 'quantiles',
      blurb: 'Data, number of groups and method.',
      params: [
        { name: 'data',   type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'n',      type: 'int',  hint: 'groups',                   input: 'number' },
        { name: 'method', type: 'str',  hint: 'exclusive or inclusive',   input: 'text' },
      ],
      template: 'import statistics\nstatistics.quantiles({$data}, n={$n}, method={$method})',
      cases: [
        { id: 'excl',  label: 'quartiles, exclusive', values: { data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', n: '4', method: 'exclusive' } },
        { id: 'incl',  label: 'quartiles, inclusive', values: { data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', n: '4', method: 'inclusive' } },
        { id: 'dec',   label: 'deciles',              values: { data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', n: '10', method: 'exclusive' } },
        { id: 'wide',  label: 'two points',           values: { data: '1, 10', n: '4', method: 'exclusive' } },
        { id: 'one',   label: 'one point',            values: { data: '7', n: '4', method: 'exclusive' } },
        { id: 'bad',   label: 'unknown method',       values: { data: '1, 2, 3', n: '4', method: 'median' } },
      ],
    },
    {
      id: 'percentile',
      label: 'p-th percentile',
      blurb: 'The 99 percentile cut points with the inclusive method; pick the p-th.',
      params: [
        { name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'p',    type: 'int',  hint: '1 to 99',                 input: 'number' },
      ],
      template: "import statistics\nq = statistics.quantiles({$data}, n=100, method='inclusive')\nq[{$p} - 1]",
      cases: [
        { id: 'p50', label: '50th', values: { data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', p: '50' } },
        { id: 'p90', label: '90th', values: { data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', p: '90' } },
        { id: 'p99', label: '99th', values: { data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', p: '99' } },
      ],
    },
  ],
  demoExplainer: 'For 1 to 10 the exclusive quartiles are [2.75, 5.5, 8.25] and the inclusive ones [3.25, 5.5, 7.75]; both put the median at 5.5. Exclusive cut points can leave the data range: for 1 and 10 they are [-1.25, 5.5, 12.25]. A single data point is repeated n - 1 times (3.13+). The method name is checked only after the data, and an unknown one raises ValueError rather than StatisticsError.',

  patterns: [
    {
      name: 'Interquartile range',
      desc: 'Q3 - Q1, a robust measure of spread.',
      code: 'import statistics\nq1, _, q3 = statistics.quantiles(data, n=4)\niqr = q3 - q1',
    },
    {
      name: 'Outlier fences',
      desc: 'Tukey’s rule: more than 1.5 IQR outside the quartiles.',
      code: "import statistics\nq1, _, q3 = statistics.quantiles(data, n=4, method='inclusive')\nlow, high = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)\noutliers = [x for x in data if x < low or x > high]",
    },
    {
      name: '95th percentile latency',
      desc: 'Index 94 of the 99 percentile cut points.',
      code: "import statistics\np95 = statistics.quantiles(latencies, n=100, method='inclusive')[94]",
    },
  ],

  examples: [
    { title: 'Docs: decile cut points',   code: 'import statistics\ndata = [105, 129, 87, 86, 111, 111, 89, 81, 108, 92, 110, 100, 75, 105, 103, 109, 76, 119, 99, 91, 103, 129, 106, 101, 84, 111, 74, 87, 86, 103, 103, 106, 86, 111, 75, 87, 102, 121, 111, 88, 89, 101, 106, 95, 103, 107, 101, 81, 109, 104]\n[round(q, 1) for q in statistics.quantiles(data, n=10)]', returns: '[81.0, 86.2, 89.0, 99.4, 102.5, 103.6, 106.0, 109.8, 111.0]' },
    { title: 'Five values, both methods', code: "import statistics\n(statistics.quantiles([1, 2, 3, 4, 5]), statistics.quantiles([1, 2, 3, 4, 5], method='inclusive'))", returns: '([1.5, 3.0, 4.5], [2.0, 3.0, 4.0])' },
    { title: 'n=2 is the median',         code: 'import statistics\nstatistics.quantiles([1, 2, 3, 4], n=2)', returns: '[2.5]' },
    { title: 'n=1: no cut points',        code: 'import statistics\nstatistics.quantiles([1, 2], n=1)',      returns: '[]' },
    { title: 'Unsorted input is fine',    code: 'import statistics\nstatistics.quantiles([3, 1, 2])',        returns: '[1.0, 2.0, 3.0]' },
    { title: 'n must be at least 1',      code: 'import statistics\nstatistics.quantiles([1, 2, 3], n=0)',   returns: 'statistics.StatisticsError: n must be at least 1' },
    { title: 'Empty data',                code: 'import statistics\nstatistics.quantiles([])',              returns: 'statistics.StatisticsError: must have at least one data point' },
  ],

  pitfalls: [
    {
      name: 'Passing n positionally',
      desc: 'n and method are keyword-only parameters.',
      wrong: { label: 'quantiles(data, 4)', code: 'import statistics\nstatistics.quantiles([1, 2, 3, 4], 4)', output: 'TypeError: quantiles() takes 1 positional argument but 2 were given' },
      fix:   { label: 'n=4', code: 'import statistics\nstatistics.quantiles([1, 2, 3, 4], n=4)', output: '[1.25, 2.5, 3.75]' },
    },
    {
      name: 'Percentiles beyond the maximum',
      desc: 'The exclusive method extrapolates at the extremes; for summary statistics of the data you have, inclusive stays within min and max.',
      wrong: { label: 'exclusive 99th', code: 'import statistics\nstatistics.quantiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n=100)[98]', output: '10.89' },
      fix:   { label: 'inclusive 99th', code: "import statistics\nstatistics.quantiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n=100, method='inclusive')[98]", output: '9.91' },
    },
  ],

  when: {
    use: ['Quartiles, deciles and percentiles of a list', 'Box-plot statistics and outlier fences'],
    avoid: ['A single median → median()', 'Huge arrays → numpy.quantile'],
  },

  notes: {
    cpython:    'Lib/statistics.py: sorts the data; exclusive uses m = len + 1 and clamps the index to 1..len-1, inclusive uses m = len - 1; each cut point is (data[j] * (n - delta) + data[j + 1] * delta) / n with exact integer positions',
    'Types':    'With int data the interpolation divides by n, so results are floats; Fractions give Fractions',
    'Versions': 'Added in 3.8. Since 3.13 a single data point returns [x] * (n - 1); before, fewer than two points raised StatisticsError',
  },

  related: [
    { name: 'median', slug: 'median-median_low-median_high', when: 'The 50th percentile alone' },
    { name: 'NormalDist.quantiles', slug: 'normaldist-inv_cdf-quantiles', when: 'Quantiles of a normal distribution' },
    { name: 'median_grouped', slug: 'median_grouped', when: 'Median of binned data' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Bad n or empty data' },
  ],

  faq: [
    {
      q: 'How do I calculate percentiles in Python without NumPy?',
      a: "statistics.quantiles(data, n=100, method='inclusive') returns the 99 percentile cut points; the p-th percentile is element p - 1. The inclusive method matches NumPy's default linear interpolation.",
    },
    {
      q: 'What is the difference between exclusive and inclusive?',
      a: 'Exclusive (the default, R6) assumes the population extends beyond the sample and places the i-th of m sorted points at i/(m+1); inclusive (R7) places the minimum at 0% and the maximum at 100%. Inclusive results always stay inside the data range.',
    },
    {
      q: 'How do I get the quartiles?',
      a: 'q1, q2, q3 = statistics.quantiles(data, n=4). q2 is the median.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.quantiles',
    meta:  'statistics.quantiles',
  },
};
