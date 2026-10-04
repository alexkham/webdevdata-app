// content/reference/python/stdlib/math/erf-gamma.js — math.erf / erfc / gamma / lgamma

export const meta = {
  slug:        'erf-gamma',
  name:        'math.erf / erfc / gamma / lgamma',
  signature:   'math.erf(x) · math.erfc(x) · math.gamma(x) · math.lgamma(x)',
  blurb:       'The error function and its complement (normal-distribution probabilities), and the gamma function and its logarithm (factorials of real numbers).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'math.erf math.erfc math.gamma math.lgamma erf erfc gamma lgamma error function normal distribution cdf python gamma function factorial of a float log gamma special functions',
};

export const method = {
  slug:      'erf-gamma',
  name:      'math.erf / erfc / gamma / lgamma',
  signature: 'math.erf(x, /) · math.erfc(x, /) · math.gamma(x, /) · math.lgamma(x, /)',
  returns:   { type: 'float', desc: 'erf / erfc in [-1, 2]; gamma(x) = (x-1)! for positive ints; lgamma = log(|gamma(x)|).' },

  category:    'math function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'erfc(x) = 1 - erf(x) without the cancellation: it stays accurate far into the tail. gamma(n) is (n-1)! and overflows above 171.6; lgamma keeps going. Poles (0, -1, -2, …) raise ValueError.',

  covers: ['erf', 'erfc', 'gamma', 'lgamma'],

  cheat: {
    commonCall: 'math.erf(x), math.gamma(x)',
    returns:    'float — gamma(5.0) is 24.0',
    replaces:   '1 - erf(x) in the tails, factorial for non-integers',
    watchOut:   'gamma(0) and gamma(-1) raise ValueError; gamma(172) overflows',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'Any real number (gamma, lgamma: not 0 or a negative integer).' },
  ],

  modes: [
    {
      id: 'gamma',
      label: 'gamma / lgamma',
      blurb: 'The gamma function and its logarithm.',
      params: [{ name: 'x', type: 'float', hint: 'a number', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.gamma(x), math.lgamma(x))',
      cases: [
        { id: 'five',  label: '5.0',   values: { x: '5' } },
        { id: 'half',  label: '0.5',   values: { x: '0.5' } },
        { id: 'big',   label: '171.0', values: { x: '171' } },
        { id: 'neg',   label: '-0.5',  values: { x: '-0.5' } },
        { id: 'pole',  label: '0.0',   values: { x: '0' } },
      ],
    },
    {
      id: 'erf',
      label: 'erf / erfc',
      blurb: 'erf and its complement.',
      params: [{ name: 'x', type: 'float', hint: 'a number', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.erf(x), math.erfc(x))',
      cases: [
        { id: 'zero', label: '0.0',  values: { x: '0' } },
        { id: 'two',  label: '2.0',  values: { x: '2' } },
        { id: 'ten',  label: '10.0', values: { x: '10' } },
      ],
    },
  ],
  demoExplainer: 'gamma(5.0) is 4! = 24.0 and gamma(0.5) is √π = 1.7724538509055159. gamma(171.0) is 170!, about 7.26e306, the largest that fits; lgamma(171.0) is its logarithm, 706.5730622457874. gamma(0.0) is a pole: ValueError: math domain error. At x = 10, erf is exactly 1.0 as a float, but erfc still carries the tail: 2.088487583762545e-45.',

  patterns: [
    {
      name: 'Normal distribution CDF',
      desc: 'Probability that a standard normal variable is below z.',
      code: 'import math\ndef normal_cdf(z):\n    return 0.5 * math.erfc(-z / math.sqrt(2))',
    },
    {
      name: 'Log of a huge binomial coefficient',
      desc: 'lgamma avoids building the enormous ints.',
      code: 'import math\nlog_c = math.lgamma(n + 1) - math.lgamma(k + 1) - math.lgamma(n - k + 1)',
    },
  ],

  examples: [
    { title: 'gamma(n) is (n-1)!',     code: 'import math\nmath.gamma(6)',       returns: '120.0' },
    { title: 'gamma(1/2) is √π',       code: 'import math\nmath.gamma(0.5)',     returns: '1.7724538509055159' },
    { title: 'lgamma goes further',    code: 'import math\nmath.lgamma(1000)',   returns: '5905.220423209181' },
    { title: 'gamma overflows',        code: 'import math\nmath.gamma(1000)',    returns: 'OverflowError: math range error' },
    { title: 'Poles',                  code: 'import math\nmath.gamma(-1.0)',    returns: 'ValueError: math domain error' },
    { title: 'erf(2)',                 code: 'import math\nmath.erf(2.0)',       returns: '0.9953222650189527' },
    { title: 'erfc keeps the tail',    code: 'import math\n(1 - math.erf(10.0), math.erfc(10.0))', returns: '(0.0, 2.088487583762545e-45)' },
  ],

  pitfalls: [
    {
      name: '1 - erf(x) in the tail',
      desc: 'erf(x) is so close to 1 that the subtraction loses everything.',
      wrong: { label: '1 - erf', code: 'import math\n1 - math.erf(10.0)', output: '0.0' },
      fix:   { label: 'erfc', code: 'import math\nmath.erfc(10.0)', output: '2.088487583762545e-45' },
    },
    {
      name: 'gamma for large arguments',
      desc: 'Work with lgamma and exponentiate at the end, if at all.',
      wrong: { label: 'gamma', code: 'import math\nmath.gamma(200) / math.gamma(198)', output: 'OverflowError: math range error' },
      fix:   { label: 'lgamma', code: 'import math\nround(math.exp(math.lgamma(200) - math.lgamma(198)))', output: '39402' },
    },
  ],

  when: {
    use: ['Statistics (normal CDF, p-values), physics and engineering formulas', 'Factorials of non-integers and logs of huge factorials'],
    avoid: ['Exact integer factorials → math.factorial', 'Full distributions → statistics.NormalDist (cdf, inv_cdf)'],
  },

  notes: {
    cpython:    'gamma and lgamma are CPython’s own Lanczos-approximation code (m_tgamma, m_lgamma) — within 10 ulps in CPython’s own random tests, according to its source comments; erf and erfc call the C library',
    'Platform': 'erf and erfc come from the C library and can differ in the last digit — math.erfc(1.0) is 0.1572992070502851 on Windows and 0.15729920705028513 on Linux. gamma and lgamma use C exp, pow, log and sin internally, so they can differ too. The values on this page agree on Windows and Linux',
    'Version':  'All four added in 3.2 (docs.python.org)',
  },

  related: [
    { name: 'factorial', slug: 'factorial', when: 'Exact n!' },
    { name: 'comb / perm', slug: 'comb-perm', when: 'Exact binomial coefficients' },
    { name: 'exp / exp2 / expm1', slug: 'exp-exp2-expm1', when: 'exp(lgamma(x))' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I compute the normal distribution CDF in Python?',
      a: '0.5 * math.erfc(-z / math.sqrt(2)) for a standard normal z — or statistics.NormalDist().cdf(z), which computes 0.5 * (1 + erf(z / sqrt(2))).',
    },
    {
      q: 'What is the gamma function?',
      a: 'It extends the factorial to real numbers: gamma(n) == factorial(n - 1) for positive ints, gamma(0.5) == sqrt(pi). It is undefined at 0 and the negative integers, where math.gamma raises ValueError.',
    },
    {
      q: 'When should I use lgamma instead of gamma?',
      a: 'Whenever gamma might overflow (arguments above about 171) or when you multiply and divide several gamma values: add and subtract lgamma values instead, then exponentiate the result.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.erf',
    meta:  'math.erf, math.erfc, math.gamma, math.lgamma',
  },
};
