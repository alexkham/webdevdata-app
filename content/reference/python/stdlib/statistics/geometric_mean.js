// content/reference/python/stdlib/statistics/geometric_mean.js — statistics.geometric_mean

export const meta = {
  slug:        'geometric_mean',
  name:        'statistics.geometric_mean',
  signature:   'statistics.geometric_mean(data)',
  blurb:       'The n-th root of the product of n values — the right average for growth factors and ratios. Computed in floats via logarithms.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+ (zero handling changed in 3.13)',
  searchTerms: 'statistics.geometric_mean geometric mean python average growth rate compound annual growth CAGR nth root of product log exp No negative inputs allowed Must have a non-empty dataset geometric mean requires a non-empty dataset containing positive numbers',
};

export const method = {
  slug:      'geometric_mean',
  name:      'statistics.geometric_mean',
  signature: 'statistics.geometric_mean(data)',
  returns:   { type: 'float', desc: 'exp(mean of the logs); 0.0 if any value is zero (3.13+).' },

  category:    'statistics function',
  version:     'Python 3.8+ (zero handling changed in 3.13)',
  hasLiveDemo: true,

  subtitle: 'Converts to floats, sums the logarithms with math.fsum and exponentiates the mean log. Fast and accurate, but not exact: geometric_mean([54, 24, 36]) is 36.000000000000014, not 36.',

  covers: ['geometric_mean'],

  cheat: {
    commonCall: 'statistics.geometric_mean([1.10, 1.20, 0.90])',
    returns:    '1.059104500597819 — the average growth factor',
    replaces:   'math.prod(data) ** (1 / len(data)), which can overflow',
    watchOut:   'Negative values raise StatisticsError; a zero gives 0.0 on 3.13+ but raises on 3.12 and older',
  },

  parameters: [
    { name: 'data', type: 'iterable of numbers', required: true, default: null, desc: 'Non-negative values, at least one. Converted to float through math.log.' },
  ],

  modes: [
    {
      id: 'gmean',
      label: 'geometric mean',
      blurb: 'Comma-separated non-negative numbers. Rounded to 10 places — the last digits come from the C math library and can vary by platform.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\nround(statistics.geometric_mean({$data}), 10)',
      cases: [
        { id: 'docs',   label: '54, 24, 36',      values: { data: '54, 24, 36' } },
        { id: 'growth', label: '1.1, 1.2, 0.9',   values: { data: '1.1, 1.2, 0.9' } },
        { id: 'pair',   label: '2, 8',            values: { data: '2, 8' } },
        { id: 'zero',   label: '0, 4',            values: { data: '0, 4' } },
        { id: 'neg',    label: '1, -2',           values: { data: '1, -2' } },
        { id: 'empty',  label: 'empty',           values: { data: '' } },
      ],
    },
    {
      id: 'compare',
      label: 'vs arithmetic mean',
      blurb: 'For growth factors the geometric mean is the one that compounds back to the total.',
      params: [{ name: 'data', type: 'list', hint: 'growth factors', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(round(statistics.geometric_mean(data), 10), statistics.mean(data))',
      cases: [
        { id: 'swing',  label: '1.5, 0.5',             values: { data: '1.5, 0.5' } },
        { id: 'years',  label: '1.08, 1.12, 0.97, 1.05', values: { data: '1.08, 1.12, 0.97, 1.05' } },
        { id: 'decade', label: '1, 10, 100',           values: { data: '1, 10, 100' } },
      ],
    },
  ],
  demoExplainer: "The rounded result hides the float noise: geometric_mean([54, 24, 36]) is 36.000000000000014 before rounding. A zero makes the result 0.0 (the product is zero); a negative value raises StatisticsError whose message is the tuple ('No negative inputs allowed', -2). Gaining 50% and then losing 50% averages to a factor of 1.0 arithmetically, but the geometric mean 0.8660254038 shows the real loss: two periods at that factor give 1.5 * 0.5 = 0.75. For 1, 10, 100 the arithmetic mean is the int 37 while the geometric mean is 10.0.",

  patterns: [
    {
      name: 'Average annual growth',
      desc: 'Growth factors in, average factor out; subtract 1 for a rate.',
      code: 'import statistics\nrate = statistics.geometric_mean([1.08, 1.12, 0.97, 1.05]) - 1',
    },
    {
      name: 'Average of ratios',
      desc: 'Speed-ups, price relatives, normalised benchmark scores.',
      code: 'import statistics\nscore = statistics.geometric_mean(new / old for new, old in zip(new_times, old_times))',
    },
  ],

  examples: [
    { title: 'Not exact',               code: 'import statistics\nstatistics.geometric_mean([54, 24, 36])', returns: '36.000000000000014' },
    { title: 'Even one value',          code: 'import statistics\nstatistics.geometric_mean([3])',          returns: '3.0000000000000004' },
    { title: 'Always a float',          code: 'import statistics\nstatistics.geometric_mean([4, 9])',       returns: '6.0' },
    { title: 'A zero gives 0.0 (3.13)', code: 'import statistics\nstatistics.geometric_mean([0, 4])',       returns: '0.0' },
    { title: 'Negative values',         code: 'import statistics\nstatistics.geometric_mean([1, -2])',      returns: "statistics.StatisticsError: ('No negative inputs allowed', -2)" },
    { title: 'No overflow for huge values', code: 'import statistics\nstatistics.geometric_mean([1e300, 1e300])', returns: '9.999999999999763e+299' },
    { title: 'Empty',                   code: 'import statistics\nstatistics.geometric_mean([])',           returns: 'statistics.StatisticsError: Must have a non-empty dataset' },
  ],

  pitfalls: [
    {
      name: 'Averaging growth rates with mean()',
      desc: '+50% then -50% is not break-even: the arithmetic mean of the factors says 1.0, the geometric mean shows the loss.',
      wrong: { label: 'mean', code: 'import statistics\nstatistics.mean([1.5, 0.5])', output: '1.0' },
      fix:   { label: 'geometric_mean', code: 'import statistics\nround(statistics.geometric_mean([1.5, 0.5]), 4)', output: '0.866' },
    },
    {
      name: 'Comparing results with ==',
      desc: 'log and exp round, so a "nice" geometric mean is rarely exact. Compare with a tolerance.',
      wrong: { label: '== 36', code: 'import statistics\nstatistics.geometric_mean([54, 24, 36]) == 36', output: 'False' },
      fix:   { label: 'math.isclose', code: 'import math\nimport statistics\nmath.isclose(statistics.geometric_mean([54, 24, 36]), 36)', output: 'True' },
    },
  ],

  when: {
    use: ['Average growth or return factors', 'Averaging ratios and normalised scores', 'Data spanning orders of magnitude'],
    avoid: ['Data with negative values', 'Exact results → compute from the product with fractions yourself'],
  },

  notes: {
    cpython:      'Lib/statistics.py (3.13): checks each value, sums math.log of the positive ones with math.fsum, then returns math.exp(total / n); zeros set a flag and make the result 0.0',
    'Versions':   'Added in 3.8. Up to 3.12 a zero or negative value (and empty data) raised StatisticsError("geometric mean requires a non-empty dataset containing positive numbers"); 3.13 returns 0.0 for zeros and uses separate messages',
    'Platform':   'math.log and math.exp come from the C library, so the last digit can differ between Linux, Windows and macOS for some inputs',
  },

  related: [
    { name: 'mean', slug: 'mean', when: 'Arithmetic mean' },
    { name: 'harmonic_mean', slug: 'harmonic_mean', when: 'Average of rates' },
    { name: 'math.log', slug: 'log', when: 'What the logs are taken with', category: 'stdlib/math' },
    { name: 'math.prod', slug: 'prod', when: 'The product itself', category: 'stdlib/math' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Empty or negative data' },
  ],

  faq: [
    {
      q: 'How do I calculate the geometric mean in Python?',
      a: 'statistics.geometric_mean(data) (Python 3.8+). It equals the n-th root of the product of the values, computed as exp of the mean logarithm so large products do not overflow.',
    },
    {
      q: 'Why is geometric_mean([54, 24, 36]) not exactly 36?',
      a: 'It works with floating-point logarithms; log and exp each round, and the tiny error shows up as 36.000000000000014. Round the result or compare with math.isclose.',
    },
    {
      q: 'What happens with a zero in the data?',
      a: 'On Python 3.13 the result is 0.0, since the product is zero. On 3.12 and earlier, geometric_mean raised StatisticsError for any zero or negative value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.geometric_mean',
    meta:  'statistics.geometric_mean',
  },
};
