// content/reference/python/stdlib/statistics/fmean.js — statistics.fmean

export const meta = {
  slug:        'fmean',
  name:        'statistics.fmean',
  signature:   'statistics.fmean(data, weights=None)',
  blurb:       'Fast floating-point mean, with optional weights (3.11+). Always returns a float.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+ (weights 3.11+)',
  searchTerms: 'statistics.fmean fmean fast mean float mean weighted average weighted mean python weights data and weights must be the same length sum of weights must be non-zero fsum sumprod',
};

export const method = {
  slug:      'fmean',
  name:      'statistics.fmean',
  signature: 'statistics.fmean(data, weights=None)',
  returns:   { type: 'float', desc: 'math.fsum(data) / len(data), or sumprod(data, weights) / fsum(weights).' },

  category:    'statistics function',
  version:     'Python 3.8+ (weights 3.11+)',
  hasLiveDemo: true,

  subtitle: 'The float counterpart of mean(): an accurate float sum (math.fsum) divided by the count — many times faster on float data. With weights it is the weighted average sum(x * w) / sum(w).',

  covers: ['fmean'],

  cheat: {
    commonCall: 'statistics.fmean(grades, weights)',
    returns:    'float — fmean([85, 92, 83, 91], [0.2, 0.2, 0.3, 0.3]) is 87.6',
    replaces:   'sum(x * w for x, w in zip(data, weights)) / sum(weights)',
    watchOut:   'Weights must match the data length and must not sum to zero',
  },

  parameters: [
    { name: 'data',    type: 'iterable of numbers', required: true,  default: null,   desc: 'Values convertible to float (int, float, Fraction, Decimal…). At least one.' },
    { name: 'weights', type: 'iterable of numbers', required: false, default: 'None', desc: 'One weight per value (3.11+). Negative weights are allowed; their sum must not be zero.' },
  ],

  modes: [
    {
      id: 'fmean',
      label: 'fmean',
      blurb: 'Comma-separated numbers.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\nstatistics.fmean({$data})',
      cases: [
        { id: 'docs',  label: '3.5, 4, 5.25',  values: { data: '3.5, 4, 5.25' } },
        { id: 'ints',  label: '1, 2, 3',       values: { data: '1, 2, 3' } },
        { id: 'tenths', label: '0.1, 0.2, 0.3', values: { data: '0.1, 0.2, 0.3' } },
        { id: 'empty', label: 'empty',         values: { data: '' } },
      ],
    },
    {
      id: 'weights',
      label: 'weighted',
      blurb: 'One weight per value.',
      params: [
        { name: 'data',    type: 'list', hint: 'values',  input: 'csv-num' },
        { name: 'weights', type: 'list', hint: 'weights', input: 'csv-num' },
      ],
      template: 'import statistics\nstatistics.fmean({$data}, weights={$weights})',
      cases: [
        { id: 'grades', label: 'course grade', values: { data: '85, 92, 83, 91', weights: '0.2, 0.2, 0.3, 0.3' } },
        { id: 'counts', label: 'counts',       values: { data: '10, 20', weights: '3, 1' } },
        { id: 'len',    label: 'too few weights', values: { data: '1, 2, 3', weights: '1, 2' } },
        { id: 'zero',   label: 'weights sum to 0', values: { data: '1, 2', weights: '1, -1' } },
      ],
    },
  ],
  demoExplainer: 'fmean always returns a float: 1, 2, 3 gives 2.0 where mean() would give 2. Unlike mean(), it divides a float sum, so 0.1, 0.2, 0.3 gives 0.19999999999999998. The weighted course grade is 87.6, and weights 3 and 1 pull the mean of 10 and 20 to 12.5. A length mismatch or a zero total weight raises StatisticsError.',

  patterns: [
    {
      name: 'Weighted average',
      desc: 'Weights need not sum to 1 — they are normalised by their total.',
      code: 'import statistics\naverage_price = statistics.fmean(prices, weights=quantities)',
    },
    {
      name: 'Mean of a generator',
      desc: 'fmean accepts any iterable and counts the items itself.',
      code: 'import statistics\nstatistics.fmean(row.price for row in rows)',
    },
  ],

  examples: [
    { title: 'Always a float',          code: 'import statistics\nstatistics.fmean([1, 2, 3])',                       returns: '2.0' },
    { title: 'Accurate float sum',      code: 'import statistics\nstatistics.fmean([1e16, 1, -1e16])',                 returns: '0.3333333333333333' },
    { title: 'Fractions are converted', code: 'import statistics\nfrom fractions import Fraction\nstatistics.fmean([Fraction(1, 3), Fraction(2, 3)])', returns: '0.5' },
    { title: 'Weights as a tuple',      code: 'import statistics\nstatistics.fmean([2.5, 3.5], (1, 3))',              returns: '3.25' },
    { title: 'Boolean weights select',  code: 'import statistics\nstatistics.fmean([1, 2], weights=[True, False])',   returns: '1.0' },
    { title: 'Strings are rejected',    code: 'import statistics\nstatistics.fmean(["1"])',                           returns: 'TypeError: must be real number, not str' },
  ],

  pitfalls: [
    {
      name: 'Huge values overflow the float sum',
      desc: 'fmean adds in floats: two values near the float maximum overflow inside math.fsum. mean() works on exact fractions and does not.',
      wrong: { label: 'fmean', code: 'import statistics\nstatistics.fmean([1e308, 1e308])', output: 'OverflowError: intermediate overflow in fsum' },
      fix:   { label: 'mean', code: 'import statistics\nstatistics.mean([1e308, 1e308])', output: '1e+308' },
    },
    {
      name: 'Weights that do not line up',
      desc: 'Every value needs a weight. The error is a StatisticsError (a ValueError).',
      wrong: { label: '2 weights for 3 values', code: 'import statistics\nstatistics.fmean([1, 2, 3], weights=[1, 2])', output: 'statistics.StatisticsError: data and weights must be the same length' },
      fix:   { label: '3 weights', code: 'import statistics\nstatistics.fmean([1, 2, 3], weights=[1, 2, 1])', output: '2.0' },
    },
  ],

  when: {
    use: ['Float data, especially large lists', 'Weighted averages (3.11+)'],
    avoid: ['Exact results for ints, Fractions, Decimals → mean()', 'Values near the float limits → mean()'],
  },

  notes: {
    cpython:    'Lib/statistics.py: without weights, math.fsum(data) / n (n counted while iterating if data has no len); with weights, math.sumprod(data, weights) / math.fsum(weights)',
    'Accuracy': 'fsum rounds the exact sum once; sumprod accumulates float products in extended (triple-length) precision; then one division',
    'Versions': 'Added in 3.8; weights added in 3.11',
  },

  related: [
    { name: 'mean',  slug: 'mean',  when: 'Exact, type-preserving mean' },
    { name: 'math.fsum', slug: 'fsum', when: 'The accurate sum underneath', category: 'stdlib/math' },
    { name: 'math.sumprod', slug: 'sumprod', when: 'The weighted sum underneath', category: 'stdlib/math' },
    { name: 'harmonic_mean', slug: 'harmonic_mean', when: 'Weighted average of rates' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Empty data, bad weights' },
  ],

  faq: [
    {
      q: 'How do I compute a weighted average in Python?',
      a: 'statistics.fmean(values, weights=weights) on Python 3.11+. On older versions use sum(v * w for v, w in zip(values, weights)) / sum(weights).',
    },
    {
      q: 'What is the difference between mean and fmean?',
      a: 'fmean converts to float and uses math.fsum: fast, always a float. mean computes the exact mean with fractions and returns the data type (int, Fraction, Decimal); it is slower but exact.',
    },
    {
      q: 'Do the weights have to add up to 1?',
      a: 'No. fmean divides by the sum of the weights, so [3, 1] and [0.75, 0.25] give the same result. Only a total of zero is an error.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.fmean',
    meta:  'statistics.fmean',
  },
};
