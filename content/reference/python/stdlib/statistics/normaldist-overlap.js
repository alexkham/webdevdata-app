// content/reference/python/stdlib/statistics/normaldist-overlap.js — NormalDist.overlap

export const meta = {
  slug:        'normaldist-overlap',
  name:        'NormalDist.overlap',
  signature:   'nd.overlap(other)',
  blurb:       'The overlapping coefficient (OVL) of two normal distributions: the shared area under both density curves, from 0.0 (disjoint) to 1.0 (identical).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'NormalDist.overlap overlap overlapping coefficient OVL area shared by two normal distributions similarity of distributions effect size python Expected another NormalDist instance overlap() not defined when sigma is zero',
};

export const method = {
  slug:      'normaldist-overlap',
  name:      'NormalDist.overlap',
  signature: 'nd.overlap(other)',
  returns:   { type: 'float', desc: 'Area of the region under both pdfs, between 0.0 and 1.0; symmetric in its two arguments.' },

  category:    'NormalDist method',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'Computed in closed form (Inman and Bradley): find where the two densities cross, then add up the cdf differences. Equal sigmas cross once, different sigmas twice.',

  covers: ['NormalDist.overlap'],

  cheat: {
    commonCall: 'statistics.NormalDist(2.4, 1.6).overlap(statistics.NormalDist(3.2, 2.0))',
    returns:    '0.8035050657330205',
    replaces:   'Numerically integrating min(pdf1, pdf2)',
    watchOut:   'other must be a NormalDist; sigma 0 raises StatisticsError',
  },

  parameters: [
    { name: 'other', type: 'NormalDist', required: true, default: null, desc: 'The distribution to compare with (TypeError for anything else).' },
  ],

  modes: [
    {
      id: 'ovl',
      label: 'overlap',
      blurb: 'Two distributions; the shared area rounded to 6 places (log, erf and sqrt from the C math library).',
      params: [
        { name: 'mu1', type: 'float', hint: 'first mean',   input: 'float' },
        { name: 's1',  type: 'float', hint: 'first sigma',  input: 'float' },
        { name: 'mu2', type: 'float', hint: 'second mean',  input: 'float' },
        { name: 's2',  type: 'float', hint: 'second sigma', input: 'float' },
      ],
      template: 'import statistics\na = statistics.NormalDist({$mu1}, {$s1})\nb = statistics.NormalDist({$mu2}, {$s2})\nround(a.overlap(b), 6)',
      cases: [
        { id: 'docs',  label: 'docs example',  values: { mu1: '2.4', s1: '1.6', mu2: '3.2', s2: '2.0' } },
        { id: 'same',  label: 'identical',     values: { mu1: '0', s1: '1', mu2: '0', s2: '1' } },
        { id: 'shift', label: 'shifted by 1',  values: { mu1: '0', s1: '1', mu2: '1', s2: '1' } },
        { id: 'wider', label: 'twice as wide', values: { mu1: '0', s1: '1', mu2: '0', s2: '2' } },
        { id: 'far',   label: 'far apart',     values: { mu1: '0', s1: '1', mu2: '10', s2: '1' } },
        { id: 'zero',  label: 'sigma 0',       values: { mu1: '0', s1: '0', mu2: '0', s2: '1' } },
      ],
    },
  ],
  demoExplainer: 'The docs example shares 80.35% of its area. Identical distributions overlap completely (1.0). Shifting a standard normal by one sigma leaves 0.617075 in common; doubling the spread at the same mean leaves 0.677325. Ten sigmas apart the overlap is about 5.7e-07, which rounds to 1e-06. A zero sigma raises StatisticsError.',

  patterns: [
    {
      name: 'How distinguishable are two groups?',
      desc: 'Fit both, then compare.',
      code: 'import statistics\ng1 = statistics.NormalDist.from_samples(control)\ng2 = statistics.NormalDist.from_samples(treated)\nsimilarity = g1.overlap(g2)',
    },
  ],

  examples: [
    { title: 'Docs example',             code: 'import statistics\nstatistics.NormalDist(2.4, 1.6).overlap(statistics.NormalDist(3.2, 2.0))', returns: '0.8035050657330205' },
    { title: 'Symmetric',                code: 'import statistics\na = statistics.NormalDist(2.4, 1.6)\nb = statistics.NormalDist(3.2, 2.0)\na.overlap(b) == b.overlap(a)', returns: 'True' },
    { title: 'Heights of two groups',    code: 'import statistics\nround(statistics.NormalDist(178, 7.5).overlap(statistics.NormalDist(165, 7)), 4)', returns: '0.3696' },
    { title: 'Same shape, shifted',      code: 'import statistics\nround(statistics.NormalDist(100, 15).overlap(statistics.NormalDist(110, 15)), 6)', returns: '0.738883' },
    { title: 'Not a NormalDist',         code: 'import statistics\nstatistics.NormalDist().overlap(1)', returns: 'TypeError: Expected another NormalDist instance' },
  ],

  pitfalls: [
    {
      name: 'Equal means do not mean full overlap',
      desc: 'Distributions with the same mean but different spreads overlap only partly.',
      wrong: { label: 'expect 1.0', code: 'import statistics\na = statistics.NormalDist(0, 1)\nb = statistics.NormalDist(0, 2)\na.mean == b.mean', output: 'True' },
      fix:   { label: 'measure it', code: 'import statistics\nround(statistics.NormalDist(0, 1).overlap(statistics.NormalDist(0, 2)), 4)', output: '0.6773' },
    },
    {
      name: 'A degenerate distribution',
      desc: 'With sigma 0 there is no density to integrate.',
      wrong: { label: 'sigma 0', code: 'import statistics\nstatistics.NormalDist(0, 0).overlap(statistics.NormalDist(0, 1))', output: 'statistics.StatisticsError: overlap() not defined when sigma is zero' },
      fix:   { label: 'use cdf for a point', code: 'import statistics\nstatistics.NormalDist(0, 1).cdf(0)', output: '0.5' },
    },
  ],

  when: {
    use: ['A 0-to-1 similarity score for two normal models', 'Effect-size style comparisons'],
    avoid: ['Non-normal data → compare kde() estimates or quantiles'],
  },

  notes: {
    cpython:    'Lib/statistics.py: orders the pair by (sigma, mu) for commutativity; equal variances use 1 - erf(|mu2 - mu1| / (2 sigma sqrt 2)); otherwise the two crossing points come from a quadratic and OVL = 1 - (|cdf2(x1) - cdf1(x1)| + |cdf2(x2) - cdf1(x2)|)',
    'Platform': 'Uses math.erf, math.log and math.sqrt; the last digit can differ between platforms (NormalDist(0, 1).overlap(NormalDist(1, 1)) ends …739 on Windows, …738 on Linux), so the demo rounds',
  },

  related: [
    { name: 'pdf / cdf', slug: 'normaldist-pdf-cdf', when: 'The curves being compared' },
    { name: 'NormalDist', slug: 'normaldist', when: 'The class' },
    { name: 'from_samples', slug: 'normaldist-from_samples', when: 'Fit the two groups first' },
  ],

  faq: [
    {
      q: 'What is the overlapping coefficient of two normal distributions?',
      a: 'The area under both probability density curves at once — the integral of min(pdf1, pdf2). It is 1.0 for identical distributions and approaches 0.0 as they move apart.',
    },
    {
      q: 'Is overlap symmetric?',
      a: 'Yes. The method orders the two distributions internally, so a.overlap(b) == b.overlap(a).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.NormalDist.overlap',
    meta:  'NormalDist.overlap',
  },
};
