// content/reference/python/stdlib/math/exp-exp2-expm1.js — math.exp / exp2 / expm1

export const meta = {
  slug:        'exp-exp2-expm1',
  name:        'math.exp / exp2 / expm1',
  signature:   'math.exp(x) · math.exp2(x) · math.expm1(x)',
  blurb:       'e to the power x, 2 to the power x (3.11+), and e**x - 1 computed accurately for tiny x.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'exp: all versions · expm1: 3.2+ · exp2: 3.11+',
  searchTerms: 'math.exp math.exp2 math.expm1 exp exp2 expm1 exponential python e to the power x 2 to the power x exponential growth math range error overflow exp(710) compound interest',
};

export const method = {
  slug:      'exp-exp2-expm1',
  name:      'math.exp / exp2 / expm1',
  signature: 'math.exp(x, /) · math.exp2(x, /) · math.expm1(x, /)',
  returns:   { type: 'float', desc: 'e**x, 2**x, or e**x - 1.' },

  category:    'math function',
  version:     'exp: all versions · expm1: 3.2+ · exp2: 3.11+',
  hasLiveDemo: true,

  subtitle: 'exp overflows just above x = 709.78 (OverflowError: math range error) and quietly becomes 0.0 far below zero. expm1 keeps the digits that exp(x) - 1 throws away when x is tiny.',

  covers: ['exp', 'exp2', 'expm1'],

  cheat: {
    commonCall: 'math.exp(x)',
    returns:    'float — exp(1) is 2.718281828459045',
    replaces:   'math.e ** x (less accurate) and exp(x) - 1 for small x',
    watchOut:   'exp(710) raises OverflowError: math range error',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'The exponent.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'exp vs exp2',
      blurb: 'e**x and 2**x for the same x.',
      params: [{ name: 'x', type: 'float', hint: 'exponent', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.exp(x), math.exp2(x))',
      cases: [
        { id: 'one',   label: '1.0',     values: { x: '1' } },
        { id: 'ten',   label: '10.0',    values: { x: '10' } },
        { id: 'half',  label: '0.5',     values: { x: '0.5' } },
        { id: 'under', label: '-1000.0', values: { x: '-1000' } },
        { id: 'over',  label: '710.0',   values: { x: '710' } },
      ],
    },
    {
      id: 'small',
      label: 'exp(x) - 1 vs expm1',
      blurb: 'For tiny x the subtraction cancels almost every digit.',
      params: [{ name: 'x', type: 'float', hint: 'a small number', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.exp(x) - 1, math.expm1(x))',
      cases: [
        { id: 'e10', label: '1e-10', values: { x: '1e-10' } },
        { id: 'e5',  label: '1e-05', values: { x: '1e-5' } },
        { id: 'e20', label: '1e-20', values: { x: '1e-20' } },
      ],
    },
  ],
  demoExplainer: 'exp(-1000.0) underflows to 0.0 without an error, but exp2(-1000.0) is still a normal-sized float (9.332636185032189e-302) because 2**-1000 is far larger than e**-1000. At 710.0 exp raises OverflowError. In the second tab exp(1e-20) rounds to exactly 1.0, so exp(x) - 1 is 0.0, while expm1 returns 1e-20.',

  patterns: [
    {
      name: 'Continuous compounding',
      desc: 'A = P·e^(rt).',
      code: 'import math\namount = principal * math.exp(rate * years)',
    },
    {
      name: 'Logistic (sigmoid) function',
      desc: 'Split by sign so exp never overflows.',
      code: 'import math\ndef sigmoid(x):\n    if x >= 0:\n        return 1 / (1 + math.exp(-x))\n    z = math.exp(x)\n    return z / (1 + z)',
    },
    {
      name: 'Relative change from a log-difference',
      desc: 'expm1 keeps precision for small changes.',
      code: 'import math\npct = math.expm1(log_b - log_a) * 100',
    },
  ],

  examples: [
    { title: 'e to the power 1',     code: 'import math\nmath.exp(1)',       returns: '2.718281828459045' },
    { title: '2 to the power 10',    code: 'import math\nmath.exp2(10)',     returns: '1024.0' },
    { title: 'exp is more accurate than e **', code: 'import math\n(math.exp(2), math.e ** 2)', returns: '(7.38905609893065, 7.3890560989306495)' },
    { title: 'Underflow is silent',  code: 'import math\nmath.exp(-1000)',   returns: '0.0' },
    { title: 'Overflow raises',      code: 'import math\nmath.exp(710)',     returns: 'OverflowError: math range error' },
    { title: 'expm1 for tiny x',     code: 'import math\nmath.expm1(1e-10)', returns: '1.00000000005e-10' },
  ],

  pitfalls: [
    {
      name: 'exp(x) - 1 for small x',
      desc: 'exp(x) is so close to 1 that subtracting 1 leaves mostly rounding noise.',
      wrong: { label: 'exp(x) - 1', code: 'import math\nmath.exp(1e-10) - 1', output: '1.000000082740371e-10' },
      fix:   { label: 'expm1', code: 'import math\nmath.expm1(1e-10)', output: '1.00000000005e-10' },
    },
    {
      name: 'Overflow in softmax-style code',
      desc: 'Subtract the maximum before exponentiating; the ratios are unchanged.',
      wrong: { label: 'raw exp', code: 'import math\nscores = [1000.0, 1001.0]\n[math.exp(s) for s in scores]', output: 'OverflowError: math range error' },
      fix:   { label: 'shift by max', code: 'import math\nscores = [1000.0, 1001.0]\nm = max(scores)\n[math.exp(s - m) for s in scores]', output: '[0.36787944117144233, 1.0]' },
    },
  ],

  when: {
    use: ['Exponential growth and decay, probability densities', 'expm1 whenever x can be close to 0', 'exp2 for powers of two with float exponents'],
    avoid: ['Integer powers of two → 2 ** n (exact int) or 1 << n', 'Very large exponents → work in log space'],
  },

  notes: {
    cpython:    'Thin wrappers over the C library exp, exp2 and expm1 (math_1 with overflow checking: an infinite result from a finite x raises OverflowError)',
    'Platform': 'Results come from the C library; Linux (glibc), Windows and macOS can differ in the last digit for some x. The values on this page agree on Windows and Linux',
    'Versions': 'expm1 added in 3.2, exp2 in 3.11 (docs.python.org)',
  },

  related: [
    { name: 'log / log2 / log10 / log1p', slug: 'log', when: 'The inverses' },
    { name: 'pow', slug: 'pow', when: 'Arbitrary bases' },
    { name: 'sinh / cosh / tanh', slug: 'sinh-cosh-tanh', when: 'Built from exp' },
    { name: 'constants', slug: 'constants', when: 'math.e' },
    { name: 'OverflowError', slug: 'overflowerror', when: 'What exp(710) raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does math.exp(1000) raise OverflowError?',
      a: 'e**1000 is about 2e434, far above the largest float (about 1.8e308). exp overflows for x above about 709.78. Work with logarithms, or use decimal for huge magnitudes.',
    },
    {
      q: 'Should I use math.exp(x) or math.e ** x?',
      a: 'math.exp(x). math.e is already rounded, and raising the rounded value to a power adds error: exp(2) is 7.38905609893065 while math.e ** 2 is 7.3890560989306495.',
    },
    {
      q: 'When should I use expm1?',
      a: 'Whenever you compute exp(x) - 1 and x may be small (|x| well below 1): interest rates, small growth factors, numerical derivatives.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.exp',
    meta:  'math.exp, math.exp2, math.expm1',
  },
};
