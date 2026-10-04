// content/reference/python/stdlib/math/fma.js — math.fma

export const meta = {
  slug:        'fma',
  name:        'math.fma',
  signature:   'math.fma(x, y, z)',
  blurb:       'Fused multiply-add: x * y + z with a single rounding at the end (Python 3.13+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.13+',
  searchTerms: 'math.fma fma fused multiply add python x * y + z single rounding precision 3.13 invalid operation in fma overflow in fma',
};

export const method = {
  slug:      'fma',
  name:      'math.fma',
  signature: 'math.fma(x, y, z, /)',
  returns:   { type: 'float', desc: 'The exact value of x*y + z, rounded once.' },

  category:    'math function',
  version:     'Python 3.13+',
  hasLiveDemo: true,

  subtitle: 'x * y + z rounds twice — after the multiplication and after the addition. fma rounds once, so it recovers the rounding error of a product: fma(0.1, 10, -1) is 5.551115123125783e-17, where 0.1 * 10 - 1 is 0.0.',

  covers: ['fma'],

  cheat: {
    commonCall: 'math.fma(x, y, z)',
    returns:    'float',
    replaces:   'x * y + z when the last bits matter',
    watchOut:   'Python 3.13+ only; inf * 0 raises ValueError',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'First factor.' },
    { name: 'y', type: 'int | float', required: true, default: null, desc: 'Second factor.' },
    { name: 'z', type: 'int | float', required: true, default: null, desc: 'Addend.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'x*y + z vs fma',
      blurb: 'Two roundings against one.',
      params: [
        { name: 'x', type: 'float', hint: 'x', input: 'float' },
        { name: 'y', type: 'float', hint: 'y', input: 'float' },
        { name: 'z', type: 'float', hint: 'z', input: 'float' },
      ],
      template: 'import math\nx, y, z = {$x}, {$y}, {$z}\n(x * y + z, math.fma(x, y, z))',
      cases: [
        { id: 'tenth', label: '0.1, 10, -1',      values: { x: '0.1', y: '10', z: '-1' } },
        { id: 'sq',    label: '1.1, 1.1, -1.21',  values: { x: '1.1', y: '1.1', z: '-1.21' } },
        { id: 'exact', label: '2, 3, 4',          values: { x: '2', y: '3', z: '4' } },
        { id: 'over',  label: '1e308, 10, -1e308', values: { x: '1e308', y: '10', z: '-1e308' } },
      ],
    },
  ],
  demoExplainer: '0.1 * 10 rounds to exactly 1.0, so subtracting 1 leaves 0.0; fma sees the exact product of the stored 0.1 and 10, which is 1 + 5.551115123125783e-17. For 1e308 * 10 - 1e308 the separate product overflows to inf; fma computes the exact result 9e308, which still does not fit, and raises OverflowError: overflow in fma.',

  patterns: [
    {
      name: 'Error of a product',
      desc: 'p + err == x * y exactly (barring overflow).',
      code: 'import math\np = x * y\nerr = math.fma(x, y, -p)',
    },
    {
      name: 'Horner evaluation of a polynomial',
      desc: 'One rounding per coefficient.',
      code: 'import math\nacc = 0.0\nfor c in coefficients:\n    acc = math.fma(acc, x, c)',
    },
  ],

  examples: [
    { title: 'Exact inputs, same result', code: 'import math\nmath.fma(2, 3, 4)',       returns: '10.0' },
    { title: 'One rounding',             code: 'import math\nmath.fma(0.1, 10, -1)',   returns: '5.551115123125783e-17' },
    { title: 'Two roundings',            code: '0.1 * 10 - 1',                        returns: '0.0' },
    { title: 'Rounding error of 1.1 * 1.1', code: 'import math\nmath.fma(1.1, 1.1, -(1.1 * 1.1))', returns: '8.88178419700126e-18' },
    { title: 'inf * 0',                  code: 'import math\nmath.fma(math.inf, 0, 1)', returns: 'ValueError: invalid operation in fma' },
    { title: 'Overflow',                 code: 'import math\nmath.fma(1e308, 10, 0)',  returns: 'OverflowError: overflow in fma' },
  ],

  pitfalls: [
    {
      name: 'Assuming x * y + z is fused',
      desc: 'Python never fuses the expression; only math.fma rounds once.',
      wrong: { label: 'expression', code: '3.0 * 0.1 - 0.3', output: '5.551115123125783e-17' },
      fix:   { label: 'fma', code: 'import math\nmath.fma(3.0, 0.1, -0.3)', output: '2.7755575615628914e-17' },
    },
    {
      name: 'Silent inf from an overflowing product',
      desc: 'The expression returns inf; fma raises, so the problem is visible.',
      wrong: { label: 'expression', code: '1e308 * 10 - 1e308', output: 'inf' },
      fix:   { label: 'fma', code: 'import math\ntry:\n    math.fma(1e308, 10, -1e308)\nexcept OverflowError as e:\n    result = str(e)\nresult', output: "'overflow in fma'" },
    },
  ],

  when: {
    use: ['Error-free transformations, compensated algorithms, polynomial evaluation'],
    avoid: ['Ordinary arithmetic — the difference is in the last bit', 'Python 3.12 and older (not available)'],
  },

  notes: {
    cpython:    'math_fma_impl calls the C fma() and turns a NaN result from non-NaN inputs into ValueError and an infinite result from finite inputs into OverflowError',
    'Platform': 'fma is exactly specified by IEEE 754 (one rounding), so results are identical everywhere',
    'Version':  'Added in 3.13 (docs.python.org)',
  },

  related: [
    { name: 'sumprod', slug: 'sumprod', when: 'Uses fma internally for accurate dot products' },
    { name: 'fsum', slug: 'fsum', when: 'Accurate sums' },
    { name: 'nextafter / ulp', slug: 'nextafter-ulp', when: 'How big one rounding step is' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does math.fma do?',
      a: 'It computes x * y + z as if with infinite precision and rounds the result once. The ordinary expression rounds the product first, so the two can differ in the last bits.',
    },
    {
      q: 'Which Python version has math.fma?',
      a: 'Python 3.13 and later. On older versions, fractions.Fraction gives the exact value: float(Fraction(x) * Fraction(y) + Fraction(z)).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.fma',
    meta:  'math.fma',
  },
};
