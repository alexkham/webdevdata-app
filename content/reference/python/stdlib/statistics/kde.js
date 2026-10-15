// content/reference/python/stdlib/statistics/kde.js — statistics.kde

export const meta = {
  slug:        'kde',
  name:        'statistics.kde',
  signature:   "statistics.kde(data, h, kernel='normal', *, cumulative=False)",
  blurb:       'Kernel density estimation: turn a sample into a smooth estimated probability density function — or, with cumulative=True, a CDF — that you can call at any x.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.13+',
  searchTerms: 'statistics.kde kde kernel density estimation estimated pdf cdf from sample bandwidth h kernel normal gauss logistic sigmoid rectangular uniform triangular parabolic epanechnikov quartic biweight triweight cosine smoothing histogram python 3.13 Unknown kernel name Bandwidth h must be positive Empty data sequence',
};

export const method = {
  slug:      'kde',
  name:      'statistics.kde',
  signature: "statistics.kde(data, h, kernel='normal', *, cumulative=False)",
  returns:   { type: 'function', desc: 'f(x) → float: the estimated density at x (or P(X <= x) with cumulative=True).' },

  category:    'statistics function',
  version:     'Python 3.13+',
  hasLiveDemo: true,

  subtitle: 'Each data point contributes a small bump of width h (the bandwidth) and the bumps are averaged. The bandwidth matters far more than the kernel shape: small h follows every wiggle, large h smooths everything out.',

  covers: ['kde'],

  cheat: {
    commonCall: 'f_hat = statistics.kde(sample, h=1.5)',
    returns:    'a function: f_hat(0) is the estimated density at 0',
    replaces:   'scipy.stats.gaussian_kde for simple 1-D cases',
    watchOut:   'Python 3.13+ only; h must be positive; data needs len() and indexing',
  },

  parameters: [
    { name: 'data',   type: 'sequence of int/float', required: true, default: null, desc: 'The sample (a list or tuple; at least one value; the first value must be an int or float).' },
    { name: 'h',      type: 'float', required: true, default: null, desc: 'Bandwidth, > 0: the width of each kernel.' },
    { name: 'kernel', type: 'str', required: false, default: "'normal'", desc: "normal (gauss), logistic, sigmoid — weight every point; rectangular (uniform), triangular, parabolic (epanechnikov), quartic (biweight), triweight, cosine — only points within h of x." },
    { name: 'cumulative', type: 'bool', required: false, default: 'False', desc: 'Keyword-only. True returns the estimated CDF instead of the PDF.' },
  ],

  modes: [
    {
      id: 'pdf',
      label: 'density',
      blurb: 'A sample, a bandwidth and a kernel; the estimated density at a few points, rounded to 6 places (the exp/erf/cos values come from the C library).',
      params: [
        { name: 'data',   type: 'list',  hint: 'the sample',      input: 'csv-num' },
        { name: 'h',      type: 'float', hint: 'bandwidth',       input: 'float' },
        { name: 'kernel', type: 'str',   hint: 'normal, triangular…', input: 'text' },
        { name: 'xs',     type: 'list',  hint: 'where to evaluate', input: 'csv-num' },
      ],
      template: 'import statistics\nf = statistics.kde({$data}, h={$h}, kernel={$kernel})\n[round(f(x), 6) for x in {$xs}]',
      cases: [
        { id: 'docs',   label: 'docs sample',  values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '1.5', kernel: 'normal', xs: '-2, 0, 2, 5' } },
        { id: 'tri',    label: 'triangular',   values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '1.5', kernel: 'triangular', xs: '-2, 0, 2, 5' } },
        { id: 'narrow', label: 'h = 0.3',      values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '0.3', kernel: 'normal', xs: '-2, 0, 2, 5' } },
        { id: 'box',    label: "kernel 'box'", values: { data: '1, 2, 3', h: '1', kernel: 'box', xs: '2' } },
        { id: 'h0',     label: 'h = 0',        values: { data: '1, 2, 3', h: '0', kernel: 'normal', xs: '2' } },
      ],
    },
    {
      id: 'cdf',
      label: 'probability',
      blurb: 'cumulative=True gives P(X <= x); a difference of two values is the estimated probability of an interval.',
      params: [
        { name: 'data', type: 'list',  hint: 'the sample', input: 'csv-num' },
        { name: 'h',    type: 'float', hint: 'bandwidth',  input: 'float' },
        { name: 'a',    type: 'float', hint: 'from',       input: 'float' },
        { name: 'b',    type: 'float', hint: 'to',         input: 'float' },
      ],
      template: 'import statistics\nF = statistics.kde({$data}, h={$h}, cumulative=True)\nround(F({$b}) - F({$a}), 4)',
      cases: [
        { id: 'docs', label: 'P(4.5 < X <= 7.5)', values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '1.5', a: '4.5', b: '7.5' } },
        { id: 'neg',  label: 'P(X <= 0)',         values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '1.5', a: '-1000', b: '0' } },
      ],
    },
  ],
  demoExplainer: 'With the docs sample and h = 1.5 the normal-kernel density is 0.110588 at -2 and 0.06767 at 2, between the two clusters. The triangular kernel only counts points within 1.5 of x, so its values differ (0.162963 at -2). A small bandwidth (0.3) makes the estimate spiky. Unknown kernel names and a non-positive h raise StatisticsError. In the second tab the estimated probability of a value between 4.5 and 7.5 is 0.2202, matching the 0.22 in the kde() docstring (help(statistics.kde)).',

  patterns: [
    {
      name: 'Plot an estimated density',
      desc: 'Evaluate on a grid; feed xs, ys to any plotting library.',
      code: 'import statistics\nf_hat = statistics.kde(sample, h=1.5)\nxs = [i / 100 for i in range(-750, 1100)]\nys = [f_hat(x) for x in xs]',
    },
    {
      name: 'Probability of a range',
      desc: 'Difference of the cumulative estimate.',
      code: 'import statistics\nF = statistics.kde(sample, h=1.5, cumulative=True)\np = F(7.5) - F(4.5)',
    },
    {
      name: 'Draw new values from the estimate',
      desc: 'kde_random samples from the same smoothed distribution.',
      code: 'import statistics\nrand = statistics.kde_random(sample, h=1.5, seed=8675309)\nnew = [rand() for _ in range(10)]',
    },
  ],

  examples: [
    { title: 'Area under the curve is 1', code: 'import statistics\nf_hat = statistics.kde([-2.1, -1.3, -0.4, 1.9, 5.1, 6.2], h=1.5)\nround(sum(f_hat(x) for x in range(-20, 20)), 4)', returns: '1.0' },
    { title: 'Triangular kernel (pure arithmetic)', code: "import statistics\nstatistics.kde([-2.1, -1.3, -0.4, 1.9, 5.1, 6.2], h=1.5, kernel='triangular')(0)", returns: '0.0962962962962963' },
    { title: 'Rectangular: points within h', code: "import statistics\nf = statistics.kde([1, 2, 3], h=1, kernel='rectangular')\n(f(2), f(10))", returns: '(0.5, 0.0)' },
    { title: 'The returned function documents itself', code: 'import statistics\nstatistics.kde([1, 2, 3], h=1.5, cumulative=True).__doc__', returns: "\"CDF estimate with h=1.5 and kernel='normal'\"" },
    { title: 'Empty data',               code: 'import statistics\nstatistics.kde([], h=1)',   returns: 'statistics.StatisticsError: Empty data sequence' },
    { title: 'Only ints and floats',     code: "import statistics\nstatistics.kde(['a'], h=1)", returns: 'TypeError: Data sequence must contain ints or floats' },
    { title: 'A generator has no len()', code: 'import statistics\nstatistics.kde((x for x in [1, 2]), h=1)', returns: "TypeError: object of type 'generator' has no len()" },
  ],

  pitfalls: [
    {
      name: 'Choosing the bandwidth by accident',
      desc: 'There is no default h — and it controls the result. At x = 0.5, between data points, a narrow bandwidth claims the density is almost zero. Compare a few values; too small shows noise, too large hides real structure.',
      wrong: { label: 'h = 0.3', code: 'import statistics\nf = statistics.kde([-2.1, -1.3, -0.4, 1.9, 5.1, 6.2], h=0.3)\nround(f(0.5), 6)', output: '0.002466' },
      fix:   { label: 'h = 1.5', code: 'import statistics\nf = statistics.kde([-2.1, -1.3, -0.4, 1.9, 5.1, 6.2], h=1.5)\nround(f(0.5), 6)', output: '0.09758' },
    },
    {
      name: 'Passing an iterator',
      desc: 'kde needs len() and indexing (it checks data[0] and keeps a reference to the list). Pass a list.',
      wrong: { label: 'map object', code: "import statistics\nstatistics.kde(map(float, ['1', '2']), h=1)", output: "TypeError: object of type 'map' has no len()" },
      fix:   { label: 'list(...)', code: "import statistics\nf = statistics.kde(list(map(float, ['1', '2'])), h=1)\nround(f(1.5), 6)", output: '0.352065' },
    },
  ],

  when: {
    use: ['A smooth picture of a 1-D distribution from a sample', 'Estimating probabilities of ranges without assuming normality'],
    avoid: ['Multivariate data or automatic bandwidth selection → scipy.stats.gaussian_kde', 'Python 3.12 and older (not available)'],
  },

  notes: {
    cpython:    'Lib/statistics.py: the kernel functions K (density) and W (its integral) are chosen by name; unbounded kernels sum over all data, bounded ones sort the data once and use bisect to sum only the points within h of x; the sum uses built-in sum() (Neumaier-compensated for floats)',
    'Live data': 'The returned function keeps a reference to data; for bounded kernels it re-sorts when len(data) changes, so appending samples updates the estimate',
    'Platform': 'normal, logistic, sigmoid and cosine kernels call exp, erf, cosh, atan, cos or sin from the C library (and parabolic, quartic, triweight use float **, i.e. the C pow(), in the CDF — quartic and triweight in the density too), so the last digit can differ between platforms; rectangular and triangular are pure arithmetic',
  },

  related: [
    { name: 'kde_random', slug: 'kde_random', when: 'Random draws from the estimate' },
    { name: 'NormalDist', slug: 'normaldist', when: 'Parametric alternative: fit a normal curve' },
    { name: 'quantiles', slug: 'quantiles', when: 'Distribution summary without smoothing' },
    { name: 'StatisticsError', slug: 'statisticserror', when: 'Empty data, bad h or kernel' },
  ],

  faq: [
    {
      q: 'What does kernel density estimation do?',
      a: 'It estimates the probability density behind a sample by placing a kernel (a small symmetric bump) of width h on each data point and averaging them. The result is a smooth curve instead of a histogram.',
    },
    {
      q: 'Which kernel should I use?',
      a: 'The normal kernel is the default and a good choice; the docs note that the kernel shape matters much less than the bandwidth h. Bounded kernels (triangular, epanechnikov…) are cheaper and give exactly zero far from the data.',
    },
    {
      q: 'Is statistics.kde available in Python 3.12?',
      a: 'No. kde and kde_random were added in Python 3.13.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.kde',
    meta:  'statistics.kde',
  },
};
