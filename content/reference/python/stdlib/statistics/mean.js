// content/reference/python/stdlib/statistics/mean.js — statistics.mean

export const meta = {
  slug:        'mean',
  name:        'statistics.mean',
  signature:   'statistics.mean(data)',
  blurb:       'The arithmetic mean ("the average"), computed exactly and returned in the type of the data: int, float, Fraction or Decimal.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'statistics.mean mean average arithmetic mean python average of list mean of list without numpy mean requires at least one data point exact mean fraction decimal sum len',
};

export const method = {
  slug:      'mean',
  name:      'statistics.mean',
  signature: 'statistics.mean(data)',
  returns:   { type: 'int | float | Fraction | Decimal', desc: 'The exact mean converted to the data type — an int becomes a float only if the mean is not whole.' },

  category:    'statistics function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Not just sum(data) / len(data): mean() adds the exact values as fractions, divides once and rounds once. That makes it exact for ints and Fractions, correctly rounded for floats — and slower than fmean().',

  covers: ['mean'],

  cheat: {
    commonCall: 'statistics.mean([1, 2, 3, 4, 4])',
    returns:    '2.8',
    replaces:   'sum(data) / len(data)',
    watchOut:   'ints in, int out when the mean is whole: mean([1, 2, 3]) is 2',
  },

  parameters: [
    { name: 'data', type: 'iterable of numbers', required: true, default: null, desc: 'A sequence or iterator of int, float, Fraction or Decimal values (at least one). Mixing Decimal with float raises TypeError.' },
  ],

  modes: [
    {
      id: 'mean',
      label: 'mean',
      blurb: 'Comma-separated numbers. Whole numbers are ints in the code; 1e+21 and 0.5 are floats.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\nstatistics.mean({$data})',
      cases: [
        { id: 'docs',   label: '1, 2, 3, 4, 4', values: { data: '1, 2, 3, 4, 4' } },
        { id: 'whole',  label: '1, 2, 3',       values: { data: '1, 2, 3' } },
        { id: 'tenths', label: '0.1, 0.2, 0.3', values: { data: '0.1, 0.2, 0.3' } },
        { id: 'cancel', label: '1e21, 1, -1e21', values: { data: '1e21, 1, -1e21' } },
        { id: 'empty',  label: 'empty',         values: { data: '' } },
      ],
    },
    {
      id: 'compare',
      label: 'mean vs sum/len vs fmean',
      blurb: 'Three ways to average the same list.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(statistics.mean(data), sum(data) / len(data), statistics.fmean(data))',
      cases: [
        { id: 'tenths', label: '0.1, 0.2, 0.3',  values: { data: '0.1, 0.2, 0.3' } },
        { id: 'cancel', label: '1e21, 1, -1e21', values: { data: '1e21, 1, -1e21' } },
        { id: 'ints',   label: '1, 2, 3',        values: { data: '1, 2, 3' } },
      ],
    },
    {
      id: 'fractions',
      label: 'Fractions',
      blurb: 'Fraction data gives a Fraction mean — no rounding at all.',
      params: [{ name: 'text', type: 'str', hint: "e.g. '1/3, 1/6, 1/2'", input: 'text' }],
      template: "import statistics\nfrom fractions import Fraction\nstatistics.mean([Fraction(x) for x in {$text}.split(',')])",
      cases: [
        { id: 'three', label: '1/3, 1/6, 1/2', values: { text: '1/3, 1/6, 1/2' } },
        { id: 'two',   label: '1/3, 1/6',      values: { text: '1/3, 1/6' } },
        { id: 'dec',   label: '0.1, 0.2',      values: { text: '0.1, 0.2' } },
      ],
    },
  ],
  demoExplainer: 'The mean of 1, 2, 3 is the int 2 because the exact mean is whole; 1, 2, 3, 4, 4 gives 2.8. For 0.1, 0.2, 0.3 the exact mean of the three binary values rounds to 0.2, while sum/len and fmean() both give 0.19999999999999998. With 1e+21, 1 and -1e+21 the 1 survives only in mean() and fmean(): 0.3333333333333333, while sum/len returns 0.0.',

  patterns: [
    {
      name: 'Average with a default for empty input',
      desc: 'mean() raises StatisticsError on no data.',
      code: 'import statistics\naverage = statistics.mean(values) if values else 0',
    },
    {
      name: 'Exact average of prices',
      desc: 'Decimal in, Decimal out.',
      code: "import statistics\nfrom decimal import Decimal\nstatistics.mean([Decimal('19.99'), Decimal('5.01'), Decimal('3.50')])",
    },
    {
      name: 'Large float datasets',
      desc: 'fmean() is much faster and always returns a float.',
      code: 'import statistics\nstatistics.fmean(measurements)',
    },
  ],

  examples: [
    { title: 'Floats',                 code: 'import statistics\nstatistics.mean([-1.5, 2.5, 3.25, 5.75])', returns: '2.5' },
    { title: 'Fractions stay exact',   code: 'import statistics\nfrom fractions import Fraction\nstatistics.mean([Fraction(3, 7), Fraction(1, 21), Fraction(5, 3), Fraction(1, 3)])', returns: 'Fraction(13, 21)' },
    { title: 'Decimals stay Decimal',  code: 'import statistics\nfrom decimal import Decimal\nstatistics.mean([Decimal("0.5"), Decimal("0.75"), Decimal("0.625"), Decimal("0.375")])', returns: "Decimal('0.5625')" },
    { title: 'Any iterable',           code: 'import statistics\nstatistics.mean(range(1, 101))',          returns: '50.5' },
    { title: 'bools count as 0 and 1', code: 'import statistics\nstatistics.mean([True, False, True])',   returns: '0.6666666666666666' },
    { title: 'No overflow in between', code: 'import statistics\n(statistics.mean([1e308, 1e308]), sum([1e308, 1e308]) / 2)', returns: '(1e+308, inf)' },
    { title: 'Strings are not numbers', code: "import statistics\nstatistics.mean(['1', '2'])",            returns: "TypeError: can't convert type 'str' to numerator/denominator" },
  ],

  pitfalls: [
    {
      name: 'Expecting a float from int data',
      desc: 'mean() converts back to the input type: whole means of ints come back as int. Use fmean() if you always want a float.',
      wrong: { label: 'mean', code: 'import statistics\nstatistics.mean([1, 3])', output: '2' },
      fix:   { label: 'fmean', code: 'import statistics\nstatistics.fmean([1, 3])', output: '2.0' },
    },
    {
      name: 'Averaging an empty list',
      desc: 'There is no mean of nothing — mean() raises StatisticsError instead of returning 0 or nan.',
      wrong: { label: 'empty', code: 'import statistics\nstatistics.mean([])', output: 'statistics.StatisticsError: mean requires at least one data point' },
      fix:   { label: 'guard', code: 'import statistics\ndata = []\nstatistics.mean(data) if data else 0.0', output: '0.0' },
    },
  ],

  when: {
    use: [
      'Exact averages of ints, Fractions and Decimals',
      'Float data where the correctly rounded result matters',
    ],
    avoid: [
      'Big float datasets → fmean() (faster, float result)',
      'Data with outliers → median()',
      'Rates and ratios → harmonic_mean(); growth factors → geometric_mean()',
    ],
  },

  notes: {
    cpython:      'Lib/statistics.py: _sum() groups the exact as_integer_ratio() of every value by denominator, sums them as Fractions, divides by n and converts the result back with _convert()',
    'Types':      'int and bool data give int when the mean is whole, otherwise float; float with Fraction gives float; Decimal stays Decimal; Decimal mixed with float or Fraction raises TypeError',
    'NaN / inf':  'A NaN or infinity short-circuits the exact sum: the result is nan or ±inf',
  },

  related: [
    { name: 'fmean',    slug: 'fmean',    when: 'Faster float mean, optional weights' },
    { name: 'median',   slug: 'median-median_low-median_high', when: 'Robust to outliers' },
    { name: 'geometric_mean', slug: 'geometric_mean', when: 'Average growth rates' },
    { name: 'harmonic_mean',  slug: 'harmonic_mean',  when: 'Average rates and speeds' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Raised for empty data' },
    { name: 'sum()', slug: 'sum', when: 'Plain total', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I calculate the average of a list in Python?',
      a: 'statistics.mean(data) (exact, keeps the type) or statistics.fmean(data) (fast, always a float). sum(data) / len(data) also works for well-behaved float data.',
    },
    {
      q: 'Why is statistics.mean slow?',
      a: 'It converts every value to an exact fraction and adds those, which costs much more than float addition. For large float lists use statistics.fmean().',
    },
    {
      q: 'Why does mean([0.1, 0.2, 0.3]) give 0.2 but sum/len gives 0.19999999999999998?',
      a: 'mean() adds the exact binary values and rounds once at the end; the float sum rounds after each addition and the division rounds again.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.mean',
    meta:  'statistics.mean',
  },
};
