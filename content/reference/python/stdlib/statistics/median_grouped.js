// content/reference/python/stdlib/statistics/median_grouped.js — statistics.median_grouped

export const meta = {
  slug:        'median_grouped',
  name:        'statistics.median_grouped',
  signature:   'statistics.median_grouped(data, interval=1.0)',
  blurb:       'The median of binned data: each value is the midpoint of a bin of width interval, and the median is interpolated inside the middle bin.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'statistics.median_grouped median_grouped grouped median binned data class interval interpolated median frequency table age groups 50th percentile Value cannot be converted to a float',
};

export const method = {
  slug:      'median_grouped',
  name:      'statistics.median_grouped',
  signature: 'statistics.median_grouped(data, interval=1.0)',
  returns:   { type: 'float', desc: 'L + interval * (n / 2 - cf) / f for the bin that holds the middle value.' },

  category:    'statistics function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'If your data were rounded or grouped — ages in decades, scores rounded to whole numbers — the plain median snaps to a bin midpoint. median_grouped assumes the values are spread evenly across the middle bin and interpolates.',

  covers: ['median_grouped'],

  cheat: {
    commonCall: 'statistics.median_grouped(ages, interval=10)',
    returns:    'float — 37.510330578512395 for the docs’ age example',
    replaces:   'The textbook grouped-median formula by hand',
    watchOut:   'Values must be exact bin midpoints spaced by multiples of interval — this is not checked',
  },

  parameters: [
    { name: 'data',     type: 'iterable of numbers', required: true,  default: null,  desc: 'Bin midpoints, one entry per observation (repeat a value for each member of its bin).' },
    { name: 'interval', type: 'float', required: false, default: '1.0', desc: 'The width of every bin.' },
  ],

  modes: [
    {
      id: 'grouped',
      label: 'grouped median',
      blurb: 'Bin midpoints (repeated per observation) and the bin width.',
      params: [
        { name: 'data',     type: 'list',  hint: 'bin midpoints', input: 'csv-num' },
        { name: 'interval', type: 'float', hint: 'bin width',     input: 'float' },
      ],
      template: 'import statistics\nstatistics.median_grouped({$data}, interval={$interval})',
      cases: [
        { id: 'scores', label: 'scores 1-5',      values: { data: '1, 2, 2, 3, 4, 4, 4, 4, 4, 5', interval: '1' } },
        { id: 'small',  label: '52, 52, 53, 54',  values: { data: '52, 52, 53, 54', interval: '1' } },
        { id: 'decade', label: 'ages by decade',  values: { data: '25, 35, 35, 45', interval: '10' } },
        { id: 'empty',  label: 'empty',           values: { data: '', interval: '1' } },
      ],
    },
    {
      id: 'compare',
      label: 'vs median',
      blurb: 'The plain median against the interpolated one.',
      params: [
        { name: 'data',     type: 'list',  hint: 'bin midpoints', input: 'csv-num' },
        { name: 'interval', type: 'float', hint: 'bin width',     input: 'float' },
      ],
      template: 'import statistics\ndata = {$data}\n(statistics.median(data), statistics.median_grouped(data, interval={$interval}))',
      cases: [
        { id: 'scores', label: 'scores 1-5',  values: { data: '1, 2, 2, 3, 4, 4, 4, 4, 4, 5', interval: '1' } },
        { id: 'docs',   label: '2, 2, 3, 3, 3, 4', values: { data: '2, 2, 3, 3, 3, 4', interval: '1' } },
      ],
    },
  ],
  demoExplainer: 'For 1, 2, 2, 3, 4, 4, 4, 4, 4, 5 the plain median is 4.0, but the middle of the ten observations falls early in the bin of 4s (3.5 to 4.5), which holds five values, so the grouped median is 3.7. 2, 2, 3, 3, 3, 4 gives 2.8333333333333335: the median falls a third of the way into the bin of 3s. Empty data raises StatisticsError.',

  patterns: [
    {
      name: 'From a frequency table',
      desc: 'Expand the counts with Counter.elements().',
      code: 'import statistics\nfrom collections import Counter\nages = Counter({25: 172, 35: 484, 45: 387, 55: 22, 65: 6})\nstatistics.median_grouped(list(ages.elements()), interval=10)',
    },
  ],

  examples: [
    { title: 'Docs example: age groups', code: 'import statistics\nfrom collections import Counter\nages = Counter({25: 172, 35: 484, 45: 387, 55: 22, 65: 6})\ndata = list(ages.elements())\n(statistics.median(data), round(statistics.median_grouped(data, interval=10), 1))', returns: '(35, 37.5)' },
    { title: 'Exactly at the midpoint',  code: 'import statistics\nstatistics.median_grouped([52, 52, 53, 54])', returns: '52.5' },
    { title: 'One value: its midpoint',  code: 'import statistics\nstatistics.median_grouped([5])',            returns: '5.0' },
    { title: 'Always a float',           code: 'import statistics\nstatistics.median_grouped([25, 35, 35, 45], interval=10)', returns: '35.0' },
    { title: 'Not numbers',              code: "import statistics\nstatistics.median_grouped(['a'])",        returns: 'TypeError: Value cannot be converted to a float' },
  ],

  pitfalls: [
    {
      name: 'Forgetting the interval',
      desc: 'The default bin width is 1.0. For data grouped by tens the interpolation is ten times too small.',
      wrong: { label: 'default interval', code: 'import statistics\nstatistics.median_grouped([25, 35, 35, 45, 45])', output: '35.25' },
      fix:   { label: 'interval=10', code: 'import statistics\nstatistics.median_grouped([25, 35, 35, 45, 45], interval=10)', output: '37.5' },
    },
    {
      name: 'Using it on ungrouped data',
      desc: 'For raw measurements median() is the right function; median_grouped assumes every value is a bin midpoint.',
      wrong: { label: 'raw data', code: 'import statistics\nstatistics.median_grouped([1.5, 2.5, 2.5])', output: '2.25' },
      fix:   { label: 'median', code: 'import statistics\nstatistics.median([1.5, 2.5, 2.5])', output: '2.5' },
    },
  ],

  when: {
    use: ['Census-style data in classes (age bands, income brackets)', 'Values rounded to a fixed step'],
    avoid: ['Raw measurements → median()', 'Bins of unequal width — the formula assumes one interval'],
  },

  notes: {
    cpython:   'Lib/statistics.py: sorts the data, takes x = data[n // 2], finds its bin with bisect (cf values before it, f inside it), and returns (x - interval / 2) + interval * (n / 2 - cf) / f in floats',
    'Errors':  'StatisticsError for empty data; TypeError("Value cannot be converted to a float") when the middle value or interval is not convertible',
  },

  related: [
    { name: 'median', slug: 'median-median_low-median_high', when: 'Median of raw data' },
    { name: 'quantiles', slug: 'quantiles', when: 'Other cut points' },
    { name: 'collections module', slug: 'collections', when: 'Counter.elements() expands a frequency table', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is a grouped median?',
      a: 'The median estimated from data summarised into bins of equal width. Instead of returning the middle bin’s midpoint, it assumes the bin’s members are spread evenly over its width and interpolates where the middle observation falls.',
    },
    {
      q: 'Why does median_grouped differ from median?',
      a: 'median returns a data value (a bin midpoint) or the average of two; median_grouped interpolates inside the middle bin using how many observations lie before and inside it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.median_grouped',
    meta:  'statistics.median_grouped',
  },
};
