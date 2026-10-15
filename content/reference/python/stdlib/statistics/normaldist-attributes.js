// content/reference/python/stdlib/statistics/normaldist-attributes.js — NormalDist.mean / median / mode / stdev / variance

export const meta = {
  slug:        'normaldist-attributes',
  name:        'NormalDist.mean / median / mode / stdev / variance',
  signature:   'nd.mean  /  nd.median  /  nd.mode  /  nd.stdev  /  nd.variance',
  blurb:       'Read-only properties of a NormalDist: mean, median and mode are all mu; stdev is sigma; variance is sigma squared.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'NormalDist.mean NormalDist.median NormalDist.mode NormalDist.stdev NormalDist.variance normaldist mean median mode stdev variance properties read-only mu sigma property has no setter',
};

export const method = {
  slug:      'normaldist-attributes',
  name:      'NormalDist.mean / median / mode / stdev / variance',
  signature: 'nd.mean  /  nd.median  /  nd.mode  /  nd.stdev  /  nd.variance',
  returns:   { type: 'float', desc: 'mu (mean, median, mode), sigma (stdev) or sigma * sigma (variance).' },

  category:    'NormalDist attributes',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'For a normal distribution the three averages coincide, so three of the five properties return the same float. They are properties, not methods — no parentheses — and cannot be assigned.',

  covers: ['NormalDist.mean', 'NormalDist.median', 'NormalDist.mode', 'NormalDist.stdev', 'NormalDist.variance'],

  cheat: {
    commonCall: 'nd.mean, nd.stdev',
    returns:    '(100.0, 15.0) for NormalDist(100, 15)',
    replaces:   'Keeping mu and sigma in separate variables',
    watchOut:   'nd.mean() is an error — they are properties',
  },

  parameters: [],

  attributes: [
    { name: 'mean',     type: 'float', meaning: 'The arithmetic mean, mu.' },
    { name: 'median',   type: 'float', meaning: 'The median — equal to mu for a normal distribution.' },
    { name: 'mode',     type: 'float', meaning: 'The value where pdf() peaks — also mu.' },
    { name: 'stdev',    type: 'float', meaning: 'The standard deviation, sigma.' },
    { name: 'variance', type: 'float', meaning: 'sigma * sigma, computed in floating point.' },
  ],

  modes: [
    {
      id: 'props',
      label: 'all five',
      blurb: 'mu and sigma in, the five properties out.',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
      ],
      template: 'import statistics\nnd = statistics.NormalDist({$mu}, {$sigma})\n(nd.mean, nd.median, nd.mode, nd.stdev, nd.variance)',
      cases: [
        { id: 'iq',   label: '(100, 15)', values: { mu: '100', sigma: '15' } },
        { id: 'std',  label: '(0, 1)',    values: { mu: '0', sigma: '1' } },
        { id: 'tiny', label: '(5, 0.1)',  values: { mu: '5', sigma: '0.1' } },
      ],
    },
    {
      id: 'fitted',
      label: 'of a fitted distribution',
      blurb: 'from_samples, then read mean and stdev back.',
      params: [{ name: 'data', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import statistics\nnd = statistics.NormalDist.from_samples({$data})\n(nd.mean, nd.stdev, nd.variance)',
      cases: [
        { id: 'ints',   label: '1, 2, 3, 4',    values: { data: '1, 2, 3, 4' } },
        { id: 'births', label: 'birth weights', values: { data: '2.5, 3.1, 2.1, 2.4, 2.7, 3.5' } },
      ],
    },
  ],
  demoExplainer: 'mean, median and mode are the same float mu. variance is computed as sigma * sigma in floating point, so sigma = 0.1 gives 0.010000000000000002 rather than 0.01. For a fitted distribution the variance is the square of the rounded stdev — 1.2909944487358056 squared is 1.6666666666666665, one unit in the last place below statistics.variance([1, 2, 3, 4]).',

  patterns: [
    {
      name: 'Unpack for formulas',
      desc: 'Properties read like attributes.',
      code: 'import statistics\nnd = statistics.NormalDist.from_samples(data)\nmu, sigma = nd.mean, nd.stdev',
    },
  ],

  examples: [
    { title: 'All averages are mu',      code: 'import statistics\nnd = statistics.NormalDist(5, 2)\n(nd.mean, nd.median, nd.mode)', returns: '(5.0, 5.0, 5.0)' },
    { title: 'Variance is sigma squared', code: 'import statistics\nstatistics.NormalDist(5, 2).variance', returns: '4.0' },
    { title: 'Floats, even from ints',   code: 'import statistics\ntype(statistics.NormalDist(5, 2).mean).__name__', returns: "'float'" },
    { title: 'Not callable',             code: 'import statistics\nstatistics.NormalDist(5, 2).mean()', returns: "TypeError: 'float' object is not callable" },
    { title: 'Read-only',                code: 'import statistics\nnd = statistics.NormalDist(5, 2)\nnd.mean = 6', returns: "AttributeError: property 'mean' of 'NormalDist' object has no setter" },
  ],

  pitfalls: [
    {
      name: 'Changing mu in place',
      desc: 'Build a new NormalDist instead, or shift the old one with + (which returns a new object).',
      wrong: { label: 'nd.mean = 6', code: 'import statistics\nnd = statistics.NormalDist(5, 2)\nnd.mean = 6', output: "AttributeError: property 'mean' of 'NormalDist' object has no setter" },
      fix:   { label: 'nd + 1', code: 'import statistics\nnd = statistics.NormalDist(5, 2)\nnd + 1', output: 'NormalDist(mu=6.0, sigma=2.0)' },
    },
    {
      name: 'Comparing variance with an exact square',
      desc: 'variance is computed in floats; compare with a tolerance.',
      wrong: { label: '== 0.01', code: 'import statistics\nstatistics.NormalDist(5, 0.1).variance == 0.01', output: 'False' },
      fix:   { label: 'math.isclose', code: 'import math\nimport statistics\nmath.isclose(statistics.NormalDist(5, 0.1).variance, 0.01)', output: 'True' },
    },
  ],

  when: {
    use: ['Reading the parameters back from a NormalDist (fitted or computed)'],
    avoid: ['Statistics of data → statistics.mean / median / mode / stdev / variance'],
  },

  notes: {
    cpython:   'Lib/statistics.py: @property methods returning self._mu (mean, median, mode), self._sigma (stdev) and self._sigma * self._sigma (variance)',
  },

  related: [
    { name: 'NormalDist', slug: 'normaldist', when: 'The class' },
    { name: 'from_samples', slug: 'normaldist-from_samples', when: 'Parameters from data' },
    { name: 'statistics.mean', slug: 'mean', when: 'The mean of data' },
    { name: 'statistics.stdev', slug: 'stdev-pstdev', when: 'The standard deviation of data' },
  ],

  faq: [
    {
      q: 'How do I get mu and sigma from a NormalDist?',
      a: 'nd.mean (or nd.median, nd.mode) gives mu and nd.stdev gives sigma; nd.variance is sigma squared.',
    },
    {
      q: 'Why are mean, median and mode the same?',
      a: 'A normal distribution is symmetric with a single peak at its mean, so all three measures of centre equal mu.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist.mean',
    meta:  'NormalDist.mean',
  },
};
