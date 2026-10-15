// content/reference/python/stdlib/statistics/median-median_low-median_high.js — statistics.median / median_low / median_high

export const meta = {
  slug:        'median-median_low-median_high',
  name:        'statistics.median / median_low / median_high',
  signature:   'statistics.median(data)  /  statistics.median_low(data)  /  statistics.median_high(data)',
  blurb:       'The middle value of sorted data. With an even count, median averages the two middle values; median_low and median_high pick one of them instead.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'statistics.median statistics.median_low statistics.median_high median median_low median_high middle value python median of list even number of elements no median for empty data robust average outliers 50th percentile',
};

export const method = {
  slug:      'median-median_low-median_high',
  name:      'statistics.median / median_low / median_high',
  signature: 'statistics.median(data)  /  statistics.median_low(data)  /  statistics.median_high(data)',
  returns:   { type: 'number (or any orderable value for low/high)', desc: 'A data point for odd counts; for even counts median returns (a + b) / 2, median_low a and median_high b.' },

  category:    'statistics functions',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'All three sort a copy of the data first (O(n log n)). median may return a value that is not in the data; median_low and median_high always return an actual data point — so they also work for ordinal, non-numeric data.',

  covers: ['median', 'median_low', 'median_high'],

  cheat: {
    commonCall: 'statistics.median([1, 3, 5, 7])',
    returns:    '4.0 (median_low 3, median_high 5)',
    replaces:   'sorted(data)[len(data) // 2] and the even-count special case',
    watchOut:   'Even count of ints → a float: median([1, 3]) is 2.0',
  },

  parameters: [
    { name: 'data', type: 'iterable', required: true, default: null, desc: 'At least one value. Numbers for median(); anything orderable (numbers, strings, dates) for median_low / median_high.' },
  ],

  modes: [
    {
      id: 'median',
      label: 'all three',
      blurb: 'Comma-separated numbers, in any order.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\ndata = {$data}\n(statistics.median(data), statistics.median_low(data), statistics.median_high(data))',
      cases: [
        { id: 'odd',     label: '1, 3, 5',          values: { data: '1, 3, 5' } },
        { id: 'even',    label: '7, 1, 5, 3',       values: { data: '7, 1, 5, 3' } },
        { id: 'outlier', label: '1, 2, 2, 3, 100',  values: { data: '1, 2, 2, 3, 100' } },
        { id: 'floats',  label: '2.5, 1.5',         values: { data: '2.5, 1.5' } },
        { id: 'empty',   label: 'empty',            values: { data: '' } },
      ],
    },
    {
      id: 'words',
      label: 'ordinal data',
      blurb: 'Strings sort alphabetically; median_low and median_high pick a real word, median would try to average two.',
      params: [{ name: 'words', type: 'list', hint: 'comma-separated words', input: 'csv' }],
      template: 'import statistics\ndata = {$words}\n(statistics.median_low(data), statistics.median_high(data))',
      cases: [
        { id: 'fruit', label: 'pear, apple, fig, kiwi', values: { words: 'pear, apple, fig, kiwi' } },
        { id: 'sizes', label: 'S, M, L',                values: { words: 'S, M, L' } },
      ],
    },
  ],
  demoExplainer: 'The input order does not matter: 7, 1, 5, 3 is sorted to 1, 3, 5, 7, whose median is (3 + 5) / 2 = 4.0, a float even though the data are ints; median_low and median_high return 3 and 5. One outlier of 100 does not move the median of 1, 2, 2, 3, 100 (it is 2). The words are sorted by code point, so "S, M, L" sorts as L, M, S and both low and high medians are "M".',

  patterns: [
    {
      name: 'Robust centre of skewed data',
      desc: 'Salaries, house prices, response times: the median ignores a few huge values.',
      code: 'import statistics\ntypical = statistics.median(response_times)',
    },
    {
      name: 'A median that is an actual element',
      desc: 'For dates, versions or categories that cannot be averaged.',
      code: 'import statistics\nmiddle_day = statistics.median_low(dates)',
    },
  ],

  examples: [
    { title: 'Odd count: the middle value',  code: 'import statistics\nstatistics.median([1, 3, 5])',          returns: '3' },
    { title: 'Even count: the average',      code: 'import statistics\nstatistics.median([1, 2, 3, 4])',       returns: '2.5' },
    { title: 'Fractions stay exact',         code: 'import statistics\nfrom fractions import Fraction\nstatistics.median([Fraction(1, 3), Fraction(1, 2)])', returns: 'Fraction(5, 12)' },
    { title: 'Any iterable',                 code: 'import statistics\nstatistics.median(range(10))',          returns: '4.5' },
    { title: 'median_low on strings',        code: "import statistics\nstatistics.median_low(['a', 'b'])",       returns: "'a'" },
    { title: 'median cannot average strings', code: "import statistics\nstatistics.median(['a', 'b'])",          returns: "TypeError: unsupported operand type(s) for /: 'str' and 'int'" },
    { title: 'Ties keep input order',        code: 'import statistics\n(statistics.median_low([1, 1.0]), statistics.median_high([1, 1.0]))', returns: '(1, 1.0)' },
  ],

  pitfalls: [
    {
      name: 'NaN in the data',
      desc: 'NaN is not ordered, so sorting leaves the list in a meaningless order and the median is wrong. Remove NaNs first.',
      wrong: { label: 'with NaN', code: "import statistics\nstatistics.median([20.7, float('nan'), 19.2, 18.3, float('nan'), 14.4])", output: '17.55' },
      fix:   { label: 'NaN removed', code: "import math\nimport statistics\ndata = [20.7, float('nan'), 19.2, 18.3, float('nan'), 14.4]\nstatistics.median([x for x in data if not math.isnan(x)])", output: '18.75' },
    },
    {
      name: 'Median of nothing',
      desc: 'An empty dataset has no median; all three raise StatisticsError.',
      wrong: { label: 'empty', code: 'import statistics\nstatistics.median([])', output: 'statistics.StatisticsError: no median for empty data' },
      fix:   { label: 'guard', code: 'import statistics\ndata = []\nstatistics.median(data) if data else float("nan")', output: 'nan' },
    },
  ],

  when: {
    use: ['A central value that resists outliers', 'Ordinal data (low/high variants)'],
    avoid: ['Grouped / binned data → median_grouped()', 'Other percentiles → quantiles()'],
  },

  notes: {
    cpython:   'Lib/statistics.py: data = sorted(data), then index n // 2; median averages data[n//2 - 1] and data[n//2] with (a + b) / 2, so ints give a float and Fractions a Fraction',
    'Sorting': 'sorted() is stable and compares with <, so equal values of different types (1 and 1.0) keep their input order, and NaN makes the order undefined',
  },

  related: [
    { name: 'median_grouped', slug: 'median_grouped', when: 'Median of binned data' },
    { name: 'quantiles', slug: 'quantiles', when: 'Quartiles, deciles, percentiles' },
    { name: 'mean', slug: 'mean', when: 'The arithmetic average' },
    { name: 'mode / multimode', slug: 'mode-multimode', when: 'Most common value' },
    { name: 'sorted()', slug: 'sorted', when: 'What the functions do first', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I find the median of a list in Python?',
      a: 'statistics.median(data). It sorts a copy, returns the middle value for an odd count and the average of the two middle values for an even count.',
    },
    {
      q: 'What is the difference between median, median_low and median_high?',
      a: 'They only differ for an even number of values: median averages the two middle values, median_low returns the smaller and median_high the larger. The low/high variants always return a real data point.',
    },
    {
      q: 'Why does median return a float for ints?',
      a: 'With an even count it computes (a + b) / 2, and / on ints is true division. median([1, 3]) is 2.0. Use median_low or median_high to stay in ints.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.median',
    meta:  'statistics.median',
  },
};
