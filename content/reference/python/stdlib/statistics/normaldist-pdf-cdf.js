// content/reference/python/stdlib/statistics/normaldist-pdf-cdf.js — NormalDist.pdf / NormalDist.cdf

export const meta = {
  slug:        'normaldist-pdf-cdf',
  name:        'NormalDist.pdf / NormalDist.cdf',
  signature:   'nd.pdf(x)  /  nd.cdf(x)',
  blurb:       'The probability density at x (the height of the bell curve) and the cumulative probability P(X <= x).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'NormalDist.pdf NormalDist.cdf pdf cdf probability density function cumulative distribution function normal probability P(X <= x) percentage of values below bell curve height python erf exp pdf() not defined when sigma is zero',
};

export const method = {
  slug:      'normaldist-pdf-cdf',
  name:      'NormalDist.pdf / NormalDist.cdf',
  signature: 'nd.pdf(x)  /  nd.cdf(x)',
  returns:   { type: 'float', desc: 'pdf: density (can exceed 1 for small sigma). cdf: probability between 0.0 and 1.0.' },

  category:    'NormalDist methods',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'pdf(x) = exp(-(x - mu)² / (2 sigma²)) / sqrt(2 pi sigma²); cdf(x) = (1 + erf((x - mu) / (sigma sqrt 2))) / 2. The difference of two cdf values is the probability of an interval.',

  covers: ['NormalDist.pdf', 'NormalDist.cdf'],

  cheat: {
    commonCall: 'statistics.NormalDist(100, 15).cdf(130)',
    returns:    'about 0.97725 — the share of values at or below 130',
    replaces:   'scipy.stats.norm.pdf / norm.cdf',
    watchOut:   'pdf is a density, not a probability; both raise for sigma = 0',
  },

  parameters: [
    { name: 'x', type: 'float', required: true, default: null, desc: 'The value to evaluate at (int and Fraction work too).' },
  ],

  modes: [
    {
      id: 'pdfcdf',
      label: 'pdf and cdf',
      blurb: 'Density and cumulative probability at x, rounded to 6 places (exp and erf come from the C math library).',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
        { name: 'x',     type: 'float', hint: 'value',              input: 'float' },
      ],
      template: 'import statistics\nnd = statistics.NormalDist({$mu}, {$sigma})\n(round(nd.pdf({$x}), 6), round(nd.cdf({$x}), 6))',
      cases: [
        { id: 'peak', label: 'standard, x = 0',   values: { mu: '0', sigma: '1', x: '0' } },
        { id: 'z196', label: 'x = 1.96',          values: { mu: '0', sigma: '1', x: '1.96' } },
        { id: 'iq',   label: 'IQ 130',            values: { mu: '100', sigma: '15', x: '130' } },
        { id: 'tall', label: 'sigma 0.1',         values: { mu: '0', sigma: '0.1', x: '0' } },
        { id: 'zero', label: 'sigma 0',           values: { mu: '5', sigma: '0', x: '5' } },
      ],
    },
    {
      id: 'between',
      label: 'P(a < X <= b)',
      blurb: 'The probability of a range: cdf(b) - cdf(a), rounded to 4 places.',
      params: [
        { name: 'mu',    type: 'float', hint: 'mean',               input: 'float' },
        { name: 'sigma', type: 'float', hint: 'standard deviation', input: 'float' },
        { name: 'a',     type: 'float', hint: 'lower bound',        input: 'float' },
        { name: 'b',     type: 'float', hint: 'upper bound',        input: 'float' },
      ],
      template: 'import statistics\nnd = statistics.NormalDist({$mu}, {$sigma})\nround(nd.cdf({$b}) - nd.cdf({$a}), 4)',
      cases: [
        { id: 'sat',  label: 'SAT 1100-1200',   values: { mu: '1060', sigma: '195', a: '1099.5', b: '1200.5' } },
        { id: 'one',  label: 'within 1 sigma',  values: { mu: '0', sigma: '1', a: '-1', b: '1' } },
        { id: 'two',  label: 'within 2 sigma',  values: { mu: '0', sigma: '1', a: '-2', b: '2' } },
      ],
    },
  ],
  demoExplainer: 'At the mean the standard normal density is 0.398942 and the cdf exactly 0.5. 1.96 standard deviations above the mean, 97.5% of the distribution lies below (0.975002). With sigma 0.1 the density at the peak is 3.989423 — a density can exceed 1. The SAT example from the docs: 18.41% of scores between 1100 and 1200 after continuity correction; about 68.27% of any normal distribution lies within one sigma of the mean.',

  patterns: [
    {
      name: 'Share above a threshold',
      desc: 'Upper tail = 1 - cdf.',
      code: 'import statistics\np_over = 1 - statistics.NormalDist(100, 15).cdf(130)',
    },
    {
      name: 'Binomial approximation',
      desc: 'Docs recipe: room capacity with a continuity correction.',
      code: 'import math\nimport statistics\nn, p = 750, 0.65\nprob = statistics.NormalDist(mu=n * p, sigma=math.sqrt(n * p * (1 - p))).cdf(500 + 0.5)',
    },
    {
      name: 'Likelihood of observations',
      desc: 'Product (or log-sum) of pdf values.',
      code: 'import math\nimport statistics\nnd = statistics.NormalDist(mu, sigma)\nlog_likelihood = sum(math.log(nd.pdf(x)) for x in data)',
    },
  ],

  examples: [
    { title: 'cdf at the mean',          code: 'import statistics\nstatistics.NormalDist(10, 3).cdf(10)', returns: '0.5' },
    { title: 'Peak of the standard normal', code: 'import statistics\nstatistics.NormalDist().pdf(0)', returns: '0.3989422804014327' },
    { title: 'Docs: binomial approximation', code: 'import math\nimport statistics\nn, p = 750, 0.65\nround(statistics.NormalDist(mu=n * p, sigma=math.sqrt(n * p * (1.0 - p))).cdf(500 + 0.5), 4)', returns: '0.8402' },
    { title: 'Ints work as x',          code: 'import statistics\nround(statistics.NormalDist(100, 15).pdf(100), 6)', returns: '0.026596' },
    { title: 'sigma = 0',               code: 'import statistics\nstatistics.NormalDist(5, 0).cdf(5)', returns: 'statistics.StatisticsError: cdf() not defined when sigma is zero' },
  ],

  pitfalls: [
    {
      name: 'Reading pdf() as a probability',
      desc: 'The density at a point is not the probability of that value (which is 0 for a continuous variable); for small sigma it exceeds 1. Use cdf differences for probabilities.',
      wrong: { label: 'pdf as probability', code: 'import statistics\nround(statistics.NormalDist(0, 0.1).pdf(0), 4)', output: '3.9894' },
      fix:   { label: 'P(-0.05 < X <= 0.05)', code: 'import statistics\nnd = statistics.NormalDist(0, 0.1)\nround(nd.cdf(0.05) - nd.cdf(-0.05), 4)', output: '0.3829' },
    },
    {
      name: 'Forgetting the continuity correction for counts',
      desc: 'When the normal curve approximates whole-number data, include half a unit on each side.',
      wrong: { label: 'cdf(1200) - cdf(1100)', code: 'import statistics\nsat = statistics.NormalDist(1060, 195)\nround(sat.cdf(1200) - sat.cdf(1100), 4)', output: '0.1823' },
      fix:   { label: 'with ± 0.5', code: 'import statistics\nsat = statistics.NormalDist(1060, 195)\nround(sat.cdf(1200.5) - sat.cdf(1099.5), 4)', output: '0.1841' },
    },
  ],

  when: {
    use: ['Probabilities and percentages under a normal model', 'Plotting the bell curve; likelihoods'],
    avoid: ['The value for a given probability → inv_cdf()', 'Non-normal data → kde()'],
  },

  notes: {
    cpython:    'Lib/statistics.py: pdf uses math.exp and math.sqrt; cdf uses math.erf; both raise StatisticsError when sigma is 0',
    'Platform': 'math.exp and math.erf come from the C library, so the last digit can differ between Linux, Windows and macOS (for example NormalDist(100, 15).cdf(130) ends …209 on Windows and …208 on Linux); the demos round',
  },

  related: [
    { name: 'inv_cdf / quantiles', slug: 'normaldist-inv_cdf-quantiles', when: 'The inverse of cdf' },
    { name: 'zscore', slug: 'normaldist-zscore', when: 'Standardise x first' },
    { name: 'NormalDist', slug: 'normaldist', when: 'The class' },
    { name: 'math.erf', slug: 'erf-gamma', when: 'The error function behind cdf', category: 'stdlib/math' },
    { name: 'kde', slug: 'kde', when: 'A density estimated from data' },
  ],

  faq: [
    {
      q: 'How do I calculate a normal distribution probability in Python?',
      a: 'statistics.NormalDist(mu, sigma).cdf(x) gives P(X <= x). For a range use cdf(b) - cdf(a); for the upper tail 1 - cdf(x).',
    },
    {
      q: 'Why is pdf() greater than 1?',
      a: 'pdf returns a density, not a probability. Densities integrate to 1, so a narrow distribution (small sigma) has a tall peak: NormalDist(0, 0.1).pdf(0) is about 3.99.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist.pdf',
    meta:  'NormalDist.pdf',
  },
};
