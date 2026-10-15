// content/reference/python/stdlib/statistics/statisticserror.js — statistics.StatisticsError

export const meta = {
  slug:        'statisticserror',
  name:        'statistics.StatisticsError',
  signature:   'statistics.StatisticsError(*args)',
  blurb:       "The statistics module's exception for impossible requests: no data, too few points, constant inputs, a negative sigma. A subclass of ValueError.",
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'statistics.StatisticsError StatisticsError mean requires at least one data point stdev requires at least two data points variance requires at least two data points no median for empty data no mode for empty data at least one of the inputs is constant x is constant sigma must be non-negative ValueError',
};

export const method = {
  slug:      'statisticserror',
  name:      'statistics.StatisticsError',
  signature: 'statistics.StatisticsError(*args)',

  category:    'statistics exception',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Raised when the data cannot answer the question — most often an empty list or a single value passed to stdev / variance. Wrong types raise TypeError instead, and unknown method names ValueError.',

  covers: ['StatisticsError'],

  chain: ['BaseException', 'Exception', 'ValueError', 'StatisticsError'],

  cheat: {
    raisedBy: 'mean([]), median([]), mode([]), stdev([x]), variance([x]), correlation with a constant input, NormalDist(sigma=-1)…',
    message:  'mean requires at least one data point',
    quickFix: 'Check len(data) first, or except statistics.StatisticsError',
    watchOut: 'except ValueError catches it too — and also unrelated ValueErrors',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Like any exception: str(e) is the single argument, or the repr of the tuple when there are several (geometric_mean passes the message and the offending value).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Call a one-argument statistics function by name on your data.',
      params: [
        { name: 'fn',   type: 'str',  hint: 'mean, stdev, median…', input: 'text' },
        { name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
      ],
      template: 'import statistics\nf = getattr(statistics, {$fn})\nf({$data})',
      cases: [
        { id: 'mean',  label: 'mean of []',     values: { fn: 'mean', data: '' } },
        { id: 'stdev', label: 'stdev of one',   values: { fn: 'stdev', data: '5' } },
        { id: 'mode',  label: 'mode of []',     values: { fn: 'mode', data: '' } },
        { id: 'geo',   label: 'geometric_mean', values: { fn: 'geometric_mean', data: '4, -1' } },
        { id: 'ok',    label: 'median of data', values: { fn: 'median', data: '3, 1, 2' } },
        { id: 'typo',  label: "'meen'",         values: { fn: 'meen', data: '1, 2' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catch it and use a fallback.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: "import statistics\ntry:\n    result = statistics.stdev({$data})\nexcept statistics.StatisticsError as e:\n    result = f'no stdev: {e}'\nresult",
      cases: [
        { id: 'one',  label: 'one value',  values: { data: '7' } },
        { id: 'many', label: 'four values', values: { data: '2, 4, 4, 6' } },
      ],
    },
    {
      id: 'valueerror',
      label: 'As ValueError',
      blurb: 'except ValueError catches it — it is a subclass.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: "import statistics\ntry:\n    statistics.variance({$data})\nexcept ValueError as e:\n    caught = (type(e).__name__, isinstance(e, statistics.StatisticsError))\nelse:\n    caught = 'no error'\ncaught",
      cases: [
        { id: 'empty', label: 'empty', values: { data: '' } },
        { id: 'fine',  label: 'valid', values: { data: '1, 2, 3' } },
      ],
    },
  ],
  demoExplainer: "Each function words its message itself: \"mean requires at least one data point\", \"stdev requires at least two data points\", \"no mode for empty data\". geometric_mean passes two arguments, so the message is the tuple ('No negative inputs allowed', -1). A misspelled name fails earlier with AttributeError and a suggestion (Did you mean: 'mean'?). The traceback calls the class statistics.StatisticsError; its MRO is StatisticsError → ValueError → Exception → BaseException.",

  patterns: [
    {
      name: 'Fallback for small samples',
      desc: 'stdev needs two points; decide what one point means for you.',
      code: 'import statistics\ntry:\n    spread = statistics.stdev(values)\nexcept statistics.StatisticsError:\n    spread = 0.0',
    },
    {
      name: 'Check before computing',
      desc: 'Cheaper and clearer when empty input is normal.',
      code: 'import statistics\naverage = statistics.fmean(values) if values else None',
    },
  ],

  examples: [
    { title: 'Empty median',             code: 'import statistics\nstatistics.median([])',          returns: 'statistics.StatisticsError: no median for empty data' },
    { title: 'Constant input',           code: 'import statistics\nstatistics.correlation([1, 2, 3], [5, 5, 5])', returns: 'statistics.StatisticsError: at least one of the inputs is constant' },
    { title: 'Vertical line',            code: 'import statistics\nstatistics.linear_regression([1, 1], [1, 2])', returns: 'statistics.StatisticsError: x is constant' },
    { title: 'Negative sigma',           code: 'import statistics\nstatistics.NormalDist(0, -1)',  returns: 'statistics.StatisticsError: sigma must be non-negative' },
    { title: 'Two arguments',            code: 'import statistics\ntry:\n    statistics.geometric_mean([4, -1])\nexcept statistics.StatisticsError as e:\n    print(e.args)', returns: "('No negative inputs allowed', -1)" },
    { title: 'A subclass of ValueError', code: 'import statistics\nissubclass(statistics.StatisticsError, ValueError)', returns: 'True' },
    { title: 'Wrong types are TypeError', code: "import statistics\nstatistics.mean(['a'])",       returns: "TypeError: can't convert type 'str' to numerator/denominator" },
  ],

  pitfalls: [
    {
      name: 'Catching ValueError too broadly',
      desc: 'ValueError also covers bad method names and other bugs. Catch the specific StatisticsError when you only mean "not enough data".',
      wrong: { label: 'except ValueError', code: "import statistics\ntry:\n    statistics.quantiles([1, 2, 3], method='Exclusive')\nexcept ValueError:\n    result = 'not enough data?'\nresult", output: "'not enough data?'" },
      fix:   { label: 'except StatisticsError', code: "import statistics\ntry:\n    statistics.quantiles([1, 2, 3], method='Exclusive')\nexcept statistics.StatisticsError:\n    result = 'not enough data'", output: "ValueError: Unknown method: 'Exclusive'" },
    },
    {
      name: 'stdev of a single measurement',
      desc: 'The sample standard deviation needs n - 1 > 0. pstdev treats the data as the whole population and returns 0.0.',
      wrong: { label: 'stdev', code: 'import statistics\nstatistics.stdev([5])', output: 'statistics.StatisticsError: stdev requires at least two data points' },
      fix:   { label: 'pstdev', code: 'import statistics\nstatistics.pstdev([5])', output: '0.0' },
    },
  ],

  when: {
    use: ['Catch it around statistics calls on data that may be empty or tiny'],
    avoid: ['Validating types — the module raises TypeError for non-numbers', 'Raising it from your own code — a plain ValueError is clearer'],
  },

  notes: {
    cpython:   'class StatisticsError(ValueError): pass — defined in Lib/statistics.py; every check raises it with a message string',
    'Module':  'The class lives in statistics, so tracebacks print statistics.StatisticsError',
  },

  related: [
    { name: 'ValueError', slug: 'valueerror', when: 'The base class', category: 'exceptions' },
    { name: 'mean', slug: 'mean', when: 'The most common source' },
    { name: 'stdev / pstdev', slug: 'stdev-pstdev', when: 'Two data points needed' },
    { name: 'statistics module', slug: 'statistics', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does "StatisticsError: mean requires at least one data point" mean?',
      a: 'statistics.mean was given an empty sequence (or an iterator that was already used up). Check that the data actually contains values before averaging.',
    },
    {
      q: 'Why does stdev say it requires at least two data points?',
      a: 'The sample standard deviation divides by n - 1, which is 0 for one value. Use pstdev for the population standard deviation (0.0 for one value), or collect more data.',
    },
    {
      q: 'Is StatisticsError a ValueError?',
      a: 'Yes, it subclasses ValueError directly, so except ValueError catches it. Catch statistics.StatisticsError to handle only the statistics module’s cases.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.StatisticsError',
    meta:  'statistics.StatisticsError',
  },
};
