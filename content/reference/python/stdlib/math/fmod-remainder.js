// content/reference/python/stdlib/math/fmod-remainder.js — math.fmod / remainder

export const meta = {
  slug:        'fmod-remainder',
  name:        'math.fmod / remainder',
  signature:   'math.fmod(x, y) · math.remainder(x, y)',
  blurb:       'Two float remainders that differ from %: fmod keeps the sign of x, remainder (3.7+) picks the nearest multiple of y.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'fmod: all versions · remainder: 3.7+',
  searchTerms: 'math.fmod math.remainder fmod remainder modulo python % vs fmod negative modulo ieee remainder sign of remainder float modulo by zero',
};

export const method = {
  slug:      'fmod-remainder',
  name:      'math.fmod / remainder',
  signature: 'math.fmod(x, y, /) · math.remainder(x, y, /)',
  returns:   { type: 'float', desc: 'x - n*y for an integer n chosen by the rule of each function; always exact.' },

  category:    'math function',
  version:     'fmod: all versions · remainder: 3.7+',
  hasLiveDemo: true,

  subtitle: 'Three rules for n in x - n*y: % floors (result has the sign of y), fmod truncates (sign of x), remainder rounds to the nearest, ties to even (result between -|y|/2 and |y|/2). All three results are exact.',

  covers: ['fmod', 'remainder'],

  cheat: {
    commonCall: 'math.fmod(x, y)',
    returns:    'float — fmod(-7, 3) is -1.0 where -7 % 3 is 2',
    replaces:   'Sign juggling after %',
    watchOut:   'y == 0 raises ValueError (math domain error), not ZeroDivisionError',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'Dividend.' },
    { name: 'y', type: 'int | float', required: true, default: null, desc: 'Divisor, non-zero.' },
  ],

  modes: [
    {
      id: 'compare',
      label: '% vs fmod vs remainder',
      blurb: 'Same x and y through all three.',
      params: [
        { name: 'x', type: 'float', hint: 'dividend', input: 'float' },
        { name: 'y', type: 'float', hint: 'divisor',  input: 'float' },
      ],
      template: 'import math\nx, y = {$x}, {$y}\n(x % y, math.fmod(x, y), math.remainder(x, y))',
      cases: [
        { id: 'pp',   label: '7, 3',    values: { x: '7',   y: '3' } },
        { id: 'np',   label: '-7, 3',   values: { x: '-7',  y: '3' } },
        { id: 'pn',   label: '7, -3',   values: { x: '7',   y: '-3' } },
        { id: 'half', label: '5.5, 2',  values: { x: '5.5', y: '2' } },
        { id: 'tie',  label: '5, 2',    values: { x: '5',   y: '2' } },
      ],
    },
  ],
  demoExplainer: 'For -7 and 3: % floors -7/3 to -3 and gives 2.0, fmod truncates to -2 and gives -1.0, remainder rounds to -2 and also gives -1.0. For 5.5 and 2, remainder takes n = 3 and returns -0.5. On an exact tie (5 and 2: 2.5 is halfway) remainder picks the even n = 2, giving 1.0; for 7 and 2 it would pick n = 4 and give -1.0.',

  patterns: [
    {
      name: 'Wrap an angle into [-180, 180]',
      desc: 'remainder centres the result on zero.',
      code: 'import math\nwrapped = math.remainder(angle, 360.0)',
    },
    {
      name: 'C-style remainder',
      desc: 'Same sign as the dividend, like % in C, Java and JavaScript.',
      code: 'import math\nr = math.fmod(x, y)',
    },
  ],

  examples: [
    { title: '% follows the divisor',      code: '-7 % 3',                         returns: '2' },
    { title: 'fmod follows the dividend',  code: 'import math\nmath.fmod(-7, 3)',   returns: '-1.0' },
    { title: 'remainder: nearest multiple', code: 'import math\nmath.remainder(5.5, 2)', returns: '-0.5' },
    { title: 'Ties go to the even multiple', code: 'import math\n(math.remainder(5, 2), math.remainder(7, 2))', returns: '(1.0, -1.0)' },
    { title: 'Exact for floats',           code: 'import math\nmath.fmod(10, 0.1)', returns: '0.09999999999999945' },
    { title: 'Zero divisor',               code: 'import math\nmath.fmod(1, 0)',    returns: 'ValueError: math domain error' },
  ],

  pitfalls: [
    {
      name: 'Tiny negative numbers with %',
      desc: 'x % y for a tiny negative x is y minus a tiny amount — it can round to y itself.',
      wrong: { label: '%', code: '-1e-100 % 1e100', output: '1e+100' },
      fix:   { label: 'fmod', code: 'import math\nmath.fmod(-1e-100, 1e100)', output: '-1e-100' },
    },
    {
      name: 'Expecting 10 % 0.1 to be 0',
      desc: '0.1 is slightly above 1/10, so 10 is not an exact multiple of it.',
      wrong: { label: '10 % 0.1', code: '10 % 0.1', output: '0.09999999999999945' },
      fix:   { label: 'remainder', code: 'import math\nmath.remainder(10, 0.1)', output: '-5.551115123125783e-16' },
    },
  ],

  when: {
    use: ['fmod: C-compatible remainders, keeping the sign of the dividend', 'remainder: centring values around zero (angles, phases)'],
    avoid: ['Integer arithmetic → % and divmod (exact ints)', 'Python-style floor modulo → %'],
  },

  notes: {
    cpython:    'math_fmod_impl calls the C fmod (with a fix for signed zeros on Windows); m_remainder is CPython’s own exact implementation of the IEEE 754 remainder operation',
    'Platform': 'Both results are exact, so identical everywhere',
    'Version':  'remainder added in 3.7 (docs.python.org)',
  },

  related: [
    { name: '% operator', slug: 'mod', when: 'Floor modulo', category: 'operators' },
    { name: 'divmod()', slug: 'divmod', when: 'Quotient and remainder together', category: 'functions' },
    { name: 'modf / frexp / ldexp', slug: 'modf-frexp-ldexp', when: 'Fractional part of one float' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between % and math.fmod in Python?',
      a: '% gives a result with the sign of the divisor (Python floors the quotient), fmod one with the sign of the dividend (C truncates). -7 % 3 is 2, math.fmod(-7, 3) is -1.0. The docs recommend fmod for floats and % for ints.',
    },
    {
      q: 'What does math.remainder do?',
      a: 'It returns x - n*y where n is the integer nearest to x/y (ties to even), as defined by IEEE 754. The result lies between -|y|/2 and |y|/2: math.remainder(5.5, 2) is -0.5.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.fmod',
    meta:  'math.fmod, math.remainder',
  },
};
