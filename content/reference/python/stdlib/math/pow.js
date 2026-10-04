// content/reference/python/stdlib/math/pow.js — math.pow

export const meta = {
  slug:        'pow',
  name:        'math.pow',
  signature:   'math.pow(x, y)',
  blurb:       'x raised to the power y, always as a float. How it differs from the ** operator and the built-in pow().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math.pow pow power exponent python math.pow vs ** vs pow() float power negative base fractional exponent complex math domain error math range error 2 ** 10',
};

export const method = {
  slug:      'pow',
  name:      'math.pow',
  signature: 'math.pow(x, y, /)',
  returns:   { type: 'float', desc: 'x ** y computed in floating point.' },

  category:    'math function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'math.pow converts both arguments to float and calls the C pow. ** keeps ints exact, returns complex for a negative base with a fractional exponent, and is what you want almost always.',

  covers: ['pow'],

  cheat: {
    commonCall: 'math.pow(x, y)',
    returns:    'float — math.pow(2, 10) is 1024.0',
    replaces:   'Nothing, usually: x ** y is the idiomatic form',
    watchOut:   'Large int results lose precision; pow(0, -1) and pow(-8, 1/3) raise ValueError',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'Base (converted to float).' },
    { name: 'y', type: 'int | float', required: true, default: null, desc: 'Exponent (converted to float).' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'math.pow vs **',
      blurb: 'Same base and exponent through both. ints stay ints with **.',
      params: [
        { name: 'x', type: 'int | float', hint: 'base',     input: 'auto' },
        { name: 'y', type: 'int | float', hint: 'exponent', input: 'auto' },
      ],
      template: 'import math\nx, y = {$x}, {$y}\n(math.pow(x, y), x ** y)',
      cases: [
        { id: 'int',  label: '2, 10',     values: { x: '2',   y: '10' } },
        { id: 'neg',  label: '2, -1',     values: { x: '2',   y: '-1' } },
        { id: 'half', label: '9, 0.5',    values: { x: '9',   y: '0.5' } },
        { id: 'big',  label: '3, 40',     values: { x: '3',   y: '40' } },
        { id: 'zero', label: '0, -1',     values: { x: '0',   y: '-1' } },
      ],
    },
    {
      id: 'big',
      label: 'range',
      blurb: 'The float result must fit: about 1.8e308 at most.',
      params: [
        { name: 'x', type: 'int | float', hint: 'base',     input: 'auto' },
        { name: 'y', type: 'int | float', hint: 'exponent', input: 'auto' },
      ],
      template: 'import math\nmath.pow({$x}, {$y})',
      cases: [
        { id: 'fits', label: '10, 308',  values: { x: '10', y: '308' } },
        { id: 'over', label: '10, 309',  values: { x: '10', y: '309' } },
        { id: 'p2',   label: '2, 1000',  values: { x: '2',  y: '1000' } },
      ],
    },
  ],
  demoExplainer: 'math.pow(3, 40) is 1.2157665459056929e+19, a float that cannot hold all 20 digits of 3 ** 40 = 12157665459056928801. math.pow(0, -1) raises ValueError: math domain error, where 0 ** -1 raises ZeroDivisionError. math.pow(10, 309) overflows (OverflowError: math range error).',

  patterns: [
    {
      name: 'Exact integer powers',
      desc: '** on ints is exact at any size.',
      code: 'big = 3 ** 1000',
    },
    {
      name: 'Modular power',
      desc: 'The built-in pow with three arguments never builds the huge number.',
      code: 'r = pow(base, exponent, modulus)',
    },
    {
      name: 'Roots',
      desc: 'n-th root of a non-negative number.',
      code: 'root = x ** (1 / n)',
    },
  ],

  examples: [
    { title: 'Always a float',          code: 'import math\nmath.pow(2, 10)',   returns: '1024.0' },
    { title: '** keeps ints',           code: '2 ** 10',                       returns: '1024' },
    { title: 'Precision lost for big ints', code: 'import math\nint(math.pow(3, 40))', returns: '12157665459056928768' },
    { title: '** is exact',             code: '3 ** 40',                       returns: '12157665459056928801' },
    { title: 'Negative base, fractional exponent', code: 'import math\nmath.pow(-8, 1/3)', returns: 'ValueError: math domain error' },
    { title: '** returns complex instead', code: '(-8) ** (1/3)',              returns: '(1.0000000000000002+1.7320508075688772j)' },
    { title: 'Too large',               code: 'import math\nmath.pow(10, 309)', returns: 'OverflowError: math range error' },
  ],

  pitfalls: [
    {
      name: 'math.pow for integer results',
      desc: 'The float result is rounded to 53 bits; ** on ints is exact.',
      wrong: { label: 'math.pow', code: 'import math\nint(math.pow(3, 40)) == 3 ** 40', output: 'False' },
      fix:   { label: '**', code: '3 ** 40', output: '12157665459056928801' },
    },
    {
      name: 'Zero to a negative power',
      desc: 'Both forms fail, with different exceptions — catch the right one.',
      wrong: { label: 'math.pow', code: 'import math\nmath.pow(0, -1)', output: 'ValueError: math domain error' },
      fix:   { label: '**', code: '0 ** -1', output: 'ZeroDivisionError: 0.0 cannot be raised to a negative power' },
    },
  ],

  when: {
    use: ['When you explicitly want float semantics and C99 special-value handling (pow(1, nan) is 1.0)'],
    avoid: ['Integer powers → ** (exact)', 'Modular exponentiation → pow(b, e, m)', 'Real cube roots → math.cbrt'],
  },

  notes: {
    cpython:    'math_pow_impl handles inf and nan arguments itself (C99 Annex F rules) and passes finite ones to the C pow; a NaN result → ValueError, an infinite result from finite input → OverflowError (or ValueError for 0 to a negative power)',
    'Platform': 'The C library pow decides the last digit; glibc and recent Windows runtimes agree on almost all inputs',
    'Special values': 'pow(x, 0.0) and pow(1.0, x) are 1.0 even for nan; pow(0.0, -inf) is inf since 3.11',
  },

  related: [
    { name: '** operator', slug: 'pow', when: 'The power operator', category: 'operators' },
    { name: 'pow()', slug: 'pow', when: 'Built-in, with modulus', category: 'functions' },
    { name: 'sqrt / isqrt / cbrt', slug: 'sqrt-isqrt-cbrt', when: 'Roots without fractional exponents' },
    { name: 'exp / exp2 / expm1', slug: 'exp-exp2-expm1', when: 'Powers of e and 2' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between math.pow(), pow() and **?',
      a: '** and the built-in pow(x, y) are the same operation: ints stay exact ints, negative bases with fractional exponents give complex numbers. pow(x, y, m) adds a modulus. math.pow always works in float and raises ValueError where ** would go complex.',
    },
    {
      q: 'Why does math.pow return a float?',
      a: 'It converts both arguments to float and calls the C library pow, which only works on doubles. Use ** for an int result.',
    },
    {
      q: 'Why does math.pow(-8, 1/3) raise "math domain error"?',
      a: '1/3 is not an integer, and a negative number to a non-integer power has no real value. Use math.cbrt(-8) for the real cube root, or ** for the complex principal value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.pow',
    meta:  'math.pow',
  },
};
