// content/reference/python/stdlib/statistics/kde_random.js — statistics.kde_random

export const meta = {
  slug:        'kde_random',
  name:        'statistics.kde_random',
  signature:   "statistics.kde_random(data, h, kernel='normal', *, seed=None)",
  blurb:       'A random generator for the distribution estimated by kde(data, h, kernel): each call picks a data point and adds kernel noise of width h. Reproducible with a seed.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.13+',
  searchTerms: 'statistics.kde_random kde_random random samples from kernel density estimate smoothed bootstrap synthetic data seed reproducible python 3.13 Unknown kernel name Empty data sequence',
};

export const method = {
  slug:      'kde_random',
  name:      'statistics.kde_random',
  signature: "statistics.kde_random(data, h, kernel='normal', *, seed=None)",
  returns:   { type: 'function', desc: 'rand() → float: one random selection from the estimated distribution.' },

  category:    'statistics function',
  version:     'Python 3.13+',
  hasLiveDemo: true,

  subtitle: 'A smoothed bootstrap: rand() is choice(data) + h * (a random value from the kernel), using its own random.Random(seed). The same seed gives the same sequence — in one Python version; the docs warn the values may change as the kernel inverse CDFs get more accurate.',

  covers: ['kde_random'],

  cheat: {
    commonCall: 'rand = statistics.kde_random(sample, h=1.5, seed=8675309)',
    returns:    'a function: [rand() for _ in range(10)]',
    replaces:   'random.choice(data) + random.gauss(0, h)',
    watchOut:   'Python 3.13+ only; without a seed the draws differ every run',
  },

  parameters: [
    { name: 'data',   type: 'sequence of int/float', required: true, default: null, desc: 'The sample (at least one value; needs len() and indexing).' },
    { name: 'h',      type: 'float', required: true, default: null, desc: 'Bandwidth, > 0.' },
    { name: 'kernel', type: 'str', required: false, default: "'normal'", desc: 'Same names as kde(): normal/gauss, logistic, sigmoid, rectangular/uniform, triangular, parabolic/epanechnikov, quartic/biweight, triweight, cosine.' },
    { name: 'seed',   type: 'int | float | str | bytes | None', required: false, default: 'None', desc: 'Keyword-only. Seeds a private random.Random; None uses an unpredictable seed.' },
  ],

  modes: [
    {
      id: 'draws',
      label: 'five draws',
      blurb: 'Seeded draws, rounded to 2 places (the kernel inverse CDFs call the C math library).',
      params: [
        { name: 'data',   type: 'list',      hint: 'the sample',     input: 'csv-num' },
        { name: 'h',      type: 'float',     hint: 'bandwidth',      input: 'float' },
        { name: 'kernel', type: 'str',       hint: 'normal, triangular…', input: 'text' },
        { name: 'seed',   type: 'int | str', hint: 'an int or a string', input: 'auto' },
      ],
      template: 'import statistics\nrand = statistics.kde_random({$data}, h={$h}, kernel={$kernel}, seed={$seed})\n[round(rand(), 2) for _ in range(5)]',
      cases: [
        { id: 'docs',  label: 'docs seed',   values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '1.5', kernel: 'normal', seed: '8675309' } },
        { id: 'str',   label: "seed 'abc'",  values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '1.5', kernel: 'normal', seed: 'abc' } },
        { id: 'tri',   label: 'triangular',  values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', h: '1.5', kernel: 'triangular', seed: '42' } },
        { id: 'box',   label: "kernel 'box'", values: { data: '1, 2, 3', h: '1', kernel: 'box', seed: '1' } },
        { id: 'empty', label: 'empty data',  values: { data: '', h: '1', kernel: 'normal', seed: '1' } },
      ],
    },
    {
      id: 'same',
      label: 'same seed, same values',
      blurb: 'Two generators with one seed.',
      params: [
        { name: 'data', type: 'list',      hint: 'the sample',         input: 'csv-num' },
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
      ],
      template: 'import statistics\nr1 = statistics.kde_random({$data}, h=1.5, seed={$seed})\nr2 = statistics.kde_random({$data}, h=1.5, seed={$seed})\n([round(r1(), 3) for _ in range(3)], [round(r2(), 3) for _ in range(3)])',
      cases: [
        { id: 'int', label: 'seed 1',     values: { data: '-2.1, -1.3, -0.4, 1.9, 5.1, 6.2', seed: '1' } },
        { id: 'str', label: "seed 'xyz'", values: { data: '10, 20, 30', seed: 'xyz' } },
      ],
    },
  ],
  demoExplainer: 'With the docs data and seed 8675309 the first five draws round to 0.71, 6.22, 1.23, 6.89, 7.04 — the docs show the same values to one decimal. Every draw is a data point plus kernel noise, so with the triangular kernel and h = 1.5 no draw can be more than 1.5 from some data point. An unknown kernel or empty data raises StatisticsError when kde_random is called, before any draw. Seeds can be ints or strings (a str seed is turned into an int together with its SHA-512 digest, as in random.seed).',

  patterns: [
    {
      name: 'Synthetic data that looks like the sample',
      desc: 'More draws than data points, smoothly spread.',
      code: 'import statistics\nrand = statistics.kde_random(observed, h=0.5, seed=2024)\nsynthetic = [rand() for _ in range(1000)]',
    },
    {
      name: 'Smoothed bootstrap of a statistic',
      desc: 'Resample with noise, recompute, look at the spread.',
      code: "import statistics\nrand = statistics.kde_random(sample, h=1.0, seed=7)\nmedians = [statistics.median(rand() for _ in range(len(sample))) for _ in range(500)]",
    },
  ],

  examples: [
    { title: 'Docs: ten selections',     code: 'import statistics\ndata = [-2.1, -1.3, -0.4, 1.9, 5.1, 6.2]\nrand = statistics.kde_random(data, h=1.5, seed=8675309)\n[round(rand(), 1) for _ in range(10)]', returns: '[0.7, 6.2, 1.2, 6.9, 7.0, 1.8, 2.5, -0.5, -1.8, 5.6]' },
    { title: 'Rectangular kernel',       code: "import statistics\nrand = statistics.kde_random([-2.1, -1.3, -0.4, 1.9, 5.1, 6.2], h=1.5, kernel='rectangular', seed=42)\n[round(rand(), 2) for _ in range(5)]", returns: '[5.03, 5.53, -2.38, -1.57, 3.86]' },
    { title: 'The function documents itself', code: 'import statistics\nstatistics.kde_random([1, 2], h=1.5, seed=1).__doc__', returns: "\"Random KDE selection with h=1.5 and kernel='normal'\"" },
    { title: 'Bandwidth must be positive', code: 'import statistics\nstatistics.kde_random([1], h=-1)', returns: 'statistics.StatisticsError: Bandwidth h must be positive, not h=-1' },
    { title: 'Unknown kernel',           code: "import statistics\nstatistics.kde_random([1, 2], h=1, kernel='box')", returns: "statistics.StatisticsError: Unknown kernel name: 'box'" },
  ],

  pitfalls: [
    {
      name: 'Expecting draws to stay near the data',
      desc: 'The normal kernel has unbounded tails: with data 10, 20, 30 and h = 5, some of 1000 draws fall more than one bandwidth below 10. Bounded kernels (triangular, epanechnikov…) never leave the interval of width h around a data point.',
      wrong: { label: 'normal kernel', code: 'import statistics\nr = statistics.kde_random([10, 20, 30], h=5, seed=3)\nmin(r() for _ in range(1000)) >= 5', output: 'False' },
      fix:   { label: 'triangular', code: "import statistics\nr = statistics.kde_random([10, 20, 30], h=5, kernel='triangular', seed=3)\nmin(r() for _ in range(1000)) >= 5", output: 'True' },
    },
    {
      name: 'Passing seed positionally',
      desc: 'The third positional parameter is kernel, and seed is keyword-only.',
      wrong: { label: 'third argument', code: 'import statistics\nstatistics.kde_random([1, 2, 3], 1, 42)', output: 'statistics.StatisticsError: Unknown kernel name: 42' },
      fix:   { label: 'seed=42', code: 'import statistics\nrand = statistics.kde_random([1, 2, 3], 1, seed=42)\ntype(rand()).__name__', output: "'float'" },
    },
  ],

  when: {
    use: ['Simulation inputs that follow an observed sample', 'Smoothed bootstrap resampling'],
    avoid: ['Parametric models → NormalDist(...).samples()', 'Python 3.12 and older (not available)'],
  },

  notes: {
    cpython:    'Lib/statistics.py: prng = random.Random(seed); each call is prng.choice(data) + h * invcdf(prng.random()), with closed-form inverse CDFs for most kernels, NormalDist().inv_cdf for normal, and Newton-Raphson for quartic and triweight',
    'Reproducibility': 'The same seed gives the same sequence on a given version; the docs say values may change slightly in future versions as the inverse CDF estimates improve',
    'Platform': 'The inverse CDFs call log, tan, cos, acos, sin, asin, sqrt or float ** from the C library, so a draw can differ in the last digit between platforms; the demos round',
  },

  related: [
    { name: 'kde', slug: 'kde', when: 'The density these draws come from' },
    { name: 'NormalDist.samples', slug: 'normaldist-samples', when: 'Draws from a normal distribution' },
    { name: 'random.seed', slug: 'seed', when: 'How int and str seeds work', category: 'stdlib/random' },
    { name: 'random.choice', slug: 'choice', when: 'The data point each draw starts from', category: 'stdlib/random' },
  ],

  faq: [
    {
      q: 'How do I generate random samples from a kernel density estimate in Python?',
      a: 'On 3.13+: rand = statistics.kde_random(data, h, seed=...), then call rand() as often as you need. Each value is a random data point plus noise drawn from the kernel scaled by h.',
    },
    {
      q: 'Are kde_random results reproducible?',
      a: 'With a seed, yes within a Python version: it uses a private random.Random(seed), unaffected by other random calls. The documentation warns the exact values may change in later versions.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/statistics.html#statistics.kde_random',
    meta:  'statistics.kde_random',
  },
};
