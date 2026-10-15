// content/reference/python/stdlib/statistics/harmonic_mean.js — statistics.harmonic_mean

export const meta = {
  slug:        'harmonic_mean',
  name:        'statistics.harmonic_mean',
  signature:   'statistics.harmonic_mean(data, weights=None)',
  blurb:       'The reciprocal of the mean of reciprocals — the correct average for rates such as speeds, prices per unit and P/E ratios. Optional weights (3.10+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+ (weights 3.10+)',
  searchTerms: 'statistics.harmonic_mean harmonic mean average speed average rate python harmonic mean does not support negative values Weighted sum must be positive Number of weights does not match data size reciprocal mean',
};

export const method = {
  slug:      'harmonic_mean',
  name:      'statistics.harmonic_mean',
  signature: 'statistics.harmonic_mean(data, weights=None)',
  returns:   { type: 'float | int | Fraction | Decimal', desc: 'sum(weights) / sum(w / x); 0 if a value is zero; a single unweighted value is returned unchanged.' },

  category:    'statistics function',
  version:     'Python 3.6+ (weights 3.10+)',
  hasLiveDemo: true,

  subtitle: 'For three values a, b, c it is 3 / (1/a + 1/b + 1/c). The quotients w / x are added exactly (as fractions) and the final division is rounded once.',

  covers: ['harmonic_mean'],

  cheat: {
    commonCall: 'statistics.harmonic_mean([40, 60])',
    returns:    '48.0 — the average speed over two equal distances',
    replaces:   'len(data) / sum(1 / x for x in data)',
    watchOut:   'A zero returns 0 at once — later values are not even checked',
  },

  parameters: [
    { name: 'data',    type: 'sequence of numbers', required: true,  default: null,   desc: 'Non-negative values, at least one.' },
    { name: 'weights', type: 'sequence of numbers', required: false, default: 'None', desc: 'Non-negative weights, same length as data (3.10+) — e.g. the distance covered at each speed.' },
  ],

  modes: [
    {
      id: 'hmean',
      label: 'harmonic mean',
      blurb: 'Comma-separated non-negative numbers.',
      params: [{ name: 'data', type: 'list', hint: 'rates, e.g. speeds', input: 'csv-num' }],
      template: 'import statistics\nstatistics.harmonic_mean({$data})',
      cases: [
        { id: 'speeds', label: '40, 60',       values: { data: '40, 60' } },
        { id: 'three',  label: '2.5, 3, 10',   values: { data: '2.5, 3, 10' } },
        { id: 'zero',   label: '1, 0, -1',     values: { data: '1, 0, -1' } },
        { id: 'neg',    label: '1, -1, 0',     values: { data: '1, -1, 0' } },
        { id: 'one',    label: '7',            values: { data: '7' } },
        { id: 'empty',  label: 'empty',        values: { data: '' } },
      ],
    },
    {
      id: 'weights',
      label: 'weighted',
      blurb: 'Speeds and the distance driven at each.',
      params: [
        { name: 'data',    type: 'list', hint: 'speeds',    input: 'csv-num' },
        { name: 'weights', type: 'list', hint: 'distances', input: 'csv-num' },
      ],
      template: 'import statistics\nstatistics.harmonic_mean({$data}, weights={$weights})',
      cases: [
        { id: 'trip',  label: '40 km/h for 5 km, 60 km/h for 30 km', values: { data: '40, 60', weights: '5, 30' } },
        { id: 'len',   label: 'mismatch',      values: { data: '1, 2, 3', weights: '1, 2' } },
        { id: 'zeros', label: 'zero weights',  values: { data: '1, 2', weights: '0, 0' } },
      ],
    },
  ],
  demoExplainer: 'Driving equal distances at 40 and 60 km/h averages 48.0 km/h, not 50: more time is spent at the lower speed. A zero in the data returns the int 0 immediately, so in "1, 0, -1" the -1 is never checked, while "1, -1, 0" reaches the negative value first and raises StatisticsError. A single value is returned as it is (7, an int). With weights 5 and 30 km the average speed is 56.0.',

  patterns: [
    {
      name: 'Average speed over legs of a trip',
      desc: 'Weight each speed by the distance covered at it.',
      code: 'import statistics\navg_speed = statistics.harmonic_mean(speeds, weights=distances)',
    },
    {
      name: 'Average price per unit with equal spend',
      desc: 'Spending the same amount at each price: the harmonic mean is the effective price.',
      code: 'import statistics\neffective_price = statistics.harmonic_mean(prices)',
    },
  ],

  examples: [
    { title: 'Mean of reciprocals, inverted', code: 'import statistics\nstatistics.harmonic_mean([1, 2, 4])',    returns: '1.7142857142857142' },
    { title: 'Smaller than the mean',     code: 'import statistics\n(statistics.harmonic_mean([40, 60]), statistics.mean([40, 60]))', returns: '(48.0, 50)' },
    { title: 'Fractions stay exact',      code: 'import statistics\nfrom fractions import Fraction\nstatistics.harmonic_mean([Fraction(1, 2), Fraction(1, 3)])', returns: 'Fraction(2, 5)' },
    { title: 'Weights positionally',      code: 'import statistics\nstatistics.harmonic_mean([3, 6], [2, 1])', returns: '3.6' },
    { title: 'A zero short-circuits',     code: 'import statistics\nstatistics.harmonic_mean([60, 40, 0])', returns: '0' },
    { title: 'Negative weights',          code: 'import statistics\nstatistics.harmonic_mean([2, 3], weights=[1, -1])', returns: 'statistics.StatisticsError: harmonic mean does not support negative values' },
    { title: 'Not a number',              code: 'import statistics\nstatistics.harmonic_mean(["a"])',       returns: 'TypeError: unsupported type' },
  ],

  pitfalls: [
    {
      name: 'Averaging speeds with mean()',
      desc: 'Equal distances at different speeds take different times; the arithmetic mean overstates the average speed.',
      wrong: { label: 'mean', code: 'import statistics\nstatistics.mean([40, 60])', output: '50' },
      fix:   { label: 'harmonic_mean', code: 'import statistics\nstatistics.harmonic_mean([40, 60])', output: '48.0' },
    },
    {
      name: 'Weights of the wrong length',
      desc: 'One weight per value — the error is a StatisticsError.',
      wrong: { label: '2 weights', code: 'import statistics\nstatistics.harmonic_mean([1, 2, 3], weights=[1, 2])', output: 'statistics.StatisticsError: Number of weights does not match data size' },
      fix:   { label: '3 weights', code: 'import statistics\nstatistics.harmonic_mean([1, 2, 3], weights=[1, 1, 1])', output: '1.6363636363636365' },
    },
  ],

  when: {
    use: ['Averaging rates over equal amounts of the denominator (km, units, money)', 'Weighted rates (3.10+)'],
    avoid: ['Data that can be negative', 'Growth factors → geometric_mean()', 'Plain values → mean()'],
  },

  notes: {
    cpython:    'Lib/statistics.py: computes w / x for every pair (ints divide to floats), sums those exactly with _sum(), and returns sum(weights) / total converted to the common type; a ZeroDivisionError on the way returns 0',
    'Order of checks': 'Values are validated one at a time while summing, so a zero ends the computation before later negative values are seen (documented behaviour)',
    'Versions': 'Added in 3.6; weights added in 3.10',
  },

  related: [
    { name: 'mean', slug: 'mean', when: 'Arithmetic mean' },
    { name: 'geometric_mean', slug: 'geometric_mean', when: 'Growth factors' },
    { name: 'fmean', slug: 'fmean', when: 'Weighted arithmetic mean' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Negative or empty data' },
  ],

  faq: [
    {
      q: 'When should I use the harmonic mean?',
      a: 'When averaging rates over equal amounts of the denominator: speeds over equal distances, prices per item with equal spending, P/E ratios. Use weights when the amounts differ.',
    },
    {
      q: 'Why does harmonic_mean return 0?',
      a: 'If any value is zero the harmonic mean is zero (its reciprocal is infinite). The function returns 0 as soon as it meets the zero, without checking the remaining values.',
    },
    {
      q: 'Why is the harmonic mean smaller than the mean?',
      a: 'For positive values it is always less than or equal to the geometric mean, which is less than or equal to the arithmetic mean; they are equal only when all values are equal.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.harmonic_mean',
    meta:  'statistics.harmonic_mean',
  },
};
