// content/reference/python/stdlib/statistics/normaldist.js — statistics.NormalDist

export const meta = {
  slug:        'normaldist',
  name:        'statistics.NormalDist',
  signature:   'statistics.NormalDist(mu=0.0, sigma=1.0)',
  blurb:       'A normal (Gaussian) distribution as an object: mean and standard deviation together, with pdf, cdf, inv_cdf, quantiles, samples, overlap, zscore — and arithmetic for shifting, scaling and combining distributions.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'statistics.NormalDist NormalDist normal distribution gaussian bell curve python mean standard deviation sigma must be non-negative add normal distributions scale convert units celsius fahrenheit sum of independent normal variables',
};

export const method = {
  slug:      'normaldist',
  name:      'statistics.NormalDist',
  signature: 'statistics.NormalDist(mu=0.0, sigma=1.0)',
  returns:   { type: 'NormalDist', desc: 'An immutable-style object storing mu and sigma as floats.' },

  category:    'statistics class',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'Treats a measurement and its uncertainty as one value. Adding or multiplying by a constant shifts and scales it; adding two independent NormalDists adds the means and the variances (so the sigmas combine like a hypotenuse).',

  covers: ['NormalDist'],

  cheat: {
    commonCall: 'nd = statistics.NormalDist(100, 15)',
    returns:    'NormalDist(mu=100.0, sigma=15.0)',
    replaces:   'Passing (mean, stdev) pairs around and scipy.stats.norm for simple jobs',
    watchOut:   'sigma=0 is allowed but pdf/cdf/zscore then raise StatisticsError',
  },

  parameters: [
    { name: 'mu',    type: 'float', required: false, default: '0.0', desc: 'The mean, converted with float().' },
    { name: 'sigma', type: 'float', required: false, default: '1.0', desc: 'The standard deviation, >= 0 (StatisticsError if negative), converted with float().' },
  ],

  modes: [
    {
      id: 'make',
      label: 'create',
      blurb: 'The object and its read-only properties.',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
      ],
      template: 'import statistics\nnd = statistics.NormalDist({$mu}, {$sigma})\n(nd, nd.mean, nd.stdev, nd.variance)',
      cases: [
        { id: 'iq',   label: 'IQ (100, 15)',   values: { mu: '100', sigma: '15' } },
        { id: 'std',  label: 'standard',       values: { mu: '0', sigma: '1' } },
        { id: 'tiny', label: 'sigma 0.1',      values: { mu: '5', sigma: '0.1' } },
        { id: 'neg',  label: 'negative sigma', values: { mu: '5', sigma: '-1' } },
      ],
    },
    {
      id: 'scale',
      label: 'change units',
      blurb: 'February temperatures in Celsius → Fahrenheit: multiply by 9/5 and add 32.',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean (°C)',  input: 'float' },
        { name: 'sigma', type: 'float', hint: 'stdev (°C)', input: 'float' },
      ],
      template: 'import statistics\ncelsius = statistics.NormalDist({$mu}, {$sigma})\ncelsius * (9/5) + 32',
      cases: [
        { id: 'feb',  label: 'docs: 5 °C ± 2.5', values: { mu: '5', sigma: '2.5' } },
        { id: 'body', label: '37 °C ± 0.4',      values: { mu: '37', sigma: '0.4' } },
      ],
    },
    {
      id: 'combine',
      label: 'combine',
      blurb: 'Two independent quantities: sum and difference.',
      params: [
        { name: 'mu1', type: 'float', hint: 'first mean',   input: 'float' },
        { name: 's1',  type: 'float', hint: 'first sigma',  input: 'float' },
        { name: 'mu2', type: 'float', hint: 'second mean',  input: 'float' },
        { name: 's2',  type: 'float', hint: 'second sigma', input: 'float' },
      ],
      template: 'import statistics\na = statistics.NormalDist({$mu1}, {$s1})\nb = statistics.NormalDist({$mu2}, {$s2})\n(a + b, a - b)',
      cases: [
        { id: 'pair',  label: '(1, 2) and (3, 4)',     values: { mu1: '1', s1: '2', mu2: '3', s2: '4' } },
        { id: 'parts', label: 'two parts in series',   values: { mu1: '50', s1: '0.3', mu2: '30', s2: '0.4' } },
      ],
    },
  ],
  demoExplainer: 'mu and sigma are stored as floats, and variance is sigma squared — so NormalDist(5, 0.1).variance is 0.010000000000000002, not 0.01. A negative sigma raises StatisticsError. Scaling multiplies both mu and sigma (sigma by the absolute value): 5 ± 2.5 °C becomes NormalDist(mu=41.0, sigma=4.5) in °F. Sums and differences of independent distributions add the variances: sigmas 2 and 4 combine to 4.47213595499958, whether you add or subtract.',

  patterns: [
    {
      name: 'Probability of a range',
      desc: 'Difference of two cdf values.',
      code: 'import statistics\nsat = statistics.NormalDist(1060, 195)\np = sat.cdf(1200.5) - sat.cdf(1099.5)',
    },
    {
      name: 'Tolerance stack-up',
      desc: 'Total length of independent parts in series.',
      code: 'import statistics\ntotal = sum((statistics.NormalDist(m, s) for m, s in parts), start=statistics.NormalDist(0, 0))',
    },
    {
      name: 'Fit to data',
      desc: 'Estimate mu and sigma from a sample.',
      code: 'import statistics\nnd = statistics.NormalDist.from_samples(measurements)',
    },
  ],

  examples: [
    { title: 'Defaults: standard normal', code: 'import statistics\nstatistics.NormalDist()',                       returns: 'NormalDist(mu=0.0, sigma=1.0)' },
    { title: 'Keyword arguments',         code: 'import statistics\nstatistics.NormalDist(sigma=2)',                returns: 'NormalDist(mu=0.0, sigma=2.0)' },
    { title: 'Constant minus a distribution', code: 'import statistics\n10 - statistics.NormalDist(3, 1)',          returns: 'NormalDist(mu=7.0, sigma=1.0)' },
    { title: 'Negative scale factor',     code: 'import statistics\nstatistics.NormalDist(10, 2) * -3',              returns: 'NormalDist(mu=-30.0, sigma=6.0)' },
    { title: 'Equality compares mu and sigma', code: 'import statistics\nstatistics.NormalDist(3, 1) == statistics.NormalDist(3.0, 1.0)', returns: 'True' },
    { title: 'A constant divided by a distribution', code: 'import statistics\n1 / statistics.NormalDist(1, 1)',      returns: "TypeError: unsupported operand type(s) for /: 'int' and 'NormalDist'" },
    { title: 'Product of two distributions', code: 'import statistics\nstatistics.NormalDist(1, 1) * statistics.NormalDist(1, 1)', returns: 'TypeError: must be real number, not NormalDist' },
  ],

  pitfalls: [
    {
      name: 'Adding sigmas directly',
      desc: 'Independent uncertainties add in quadrature, not linearly. Let NormalDist do it.',
      wrong: { label: 'sigma1 + sigma2', code: 'import statistics\nstatistics.NormalDist(1 + 3, 2 + 4)', output: 'NormalDist(mu=4.0, sigma=6.0)' },
      fix:   { label: 'a + b', code: 'import statistics\nstatistics.NormalDist(1, 2) + statistics.NormalDist(3, 4)', output: 'NormalDist(mu=4.0, sigma=4.47213595499958)' },
    },
    {
      name: 'Subtracting distributions to "cancel" noise',
      desc: 'a - b subtracts the means but still adds the variances; uncertainty never cancels for independent variables.',
      wrong: { label: 'expect sigma 0', code: 'import statistics\na = statistics.NormalDist(10, 1)\n(a - a).stdev', output: '1.4142135623730951' },
      fix:   { label: 'a constant shift', code: 'import statistics\na = statistics.NormalDist(10, 1)\n(a - 10).stdev', output: '1.0' },
    },
  ],

  when: {
    use: ['Measurement ± uncertainty arithmetic', 'Normal probabilities, percentiles and z-scores', 'Monte Carlo inputs (samples)'],
    avoid: ['Skewed or heavy-tailed data → kde(), or scipy.stats', 'Correlated variables — the + and - rules assume independence'],
  },

  notes: {
    cpython:   'Lib/statistics.py: a class with __slots__ _mu and _sigma; arithmetic returns new NormalDist objects (sigma of a sum or difference via math.hypot); __eq__ compares mu and sigma, __hash__ hashes the pair',
    'Operators': 'nd + c, nd - c, c + nd, c - nd, nd * c, c * nd, nd / c, -nd, +nd, nd ± nd; c / nd and nd * nd are not supported',
    'Versions': 'Added in 3.8 (zscore in 3.9; samples() algorithm changed in 3.13)',
  },

  related: [
    { name: 'pdf / cdf', slug: 'normaldist-pdf-cdf', when: 'Densities and probabilities' },
    { name: 'inv_cdf / quantiles', slug: 'normaldist-inv_cdf-quantiles', when: 'Percentiles' },
    { name: 'from_samples', slug: 'normaldist-from_samples', when: 'Fit mu and sigma to data' },
    { name: 'samples', slug: 'normaldist-samples', when: 'Random draws' },
    { name: 'attributes', slug: 'normaldist-attributes', when: 'mean, median, mode, stdev, variance' },
    { name: 'random.gauss', slug: 'gauss-normalvariate', when: 'One-off normal random numbers', category: 'stdlib/random' },
  ],

  faq: [
    {
      q: 'How do I work with a normal distribution in Python without SciPy?',
      a: 'statistics.NormalDist(mu, sigma) gives pdf(), cdf(), inv_cdf(), quantiles(), samples(), overlap() and zscore() — enough for most textbook problems.',
    },
    {
      q: 'What happens when you add two NormalDist objects?',
      a: 'You get the distribution of the sum of two independent normal variables: the means add and the variances add, so sigma = hypot(sigma1, sigma2). NormalDist(1, 2) + NormalDist(3, 4) is NormalDist(mu=4.0, sigma=4.47213595499958).',
    },
    {
      q: 'Can sigma be zero?',
      a: 'NormalDist(mu, 0) can be created (a point mass), but pdf(), cdf(), zscore() and overlap() raise StatisticsError for it. A negative sigma is rejected immediately.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist',
    meta:  'statistics.NormalDist',
  },
};
