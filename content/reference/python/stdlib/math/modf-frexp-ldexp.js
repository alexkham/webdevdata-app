// content/reference/python/stdlib/math/modf-frexp-ldexp.js — math.modf / frexp / ldexp

export const meta = {
  slug:        'modf-frexp-ldexp',
  name:        'math.modf / frexp / ldexp',
  signature:   'math.modf(x) · math.frexp(x) · math.ldexp(x, i)',
  blurb:       'Take a float apart: fractional and integer parts (modf), mantissa and binary exponent (frexp), and put it back together (ldexp).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math.modf math.frexp math.ldexp modf frexp ldexp fractional part integer part mantissa exponent python split float x * 2 ** i binary exponent Expected an int as second argument to ldexp',
};

export const method = {
  slug:      'modf-frexp-ldexp',
  name:      'math.modf / frexp / ldexp',
  signature: 'math.modf(x, /) · math.frexp(x, /) · math.ldexp(x, i, /)',
  returns:   { type: 'tuple | float', desc: 'modf → (fractional, integer) floats · frexp → (mantissa, exponent) · ldexp → float.' },

  category:    'math function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'modf(x) returns two floats with the sign of x; frexp(x) returns (m, e) with 0.5 ≤ |m| < 1 and x == m * 2**e exactly; ldexp(m, e) multiplies by 2**e with no rounding until the result leaves the float range.',

  covers: ['modf', 'frexp', 'ldexp'],

  cheat: {
    commonCall: 'math.modf(3.75), math.frexp(8.0)',
    returns:    '(0.75, 3.0) and (0.5, 4)',
    replaces:   'x - int(x), log2 tricks and x * 2 ** e',
    watchOut:   'modf returns floats; ldexp needs an int exponent',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'The float to split (ldexp: the mantissa).' },
    { name: 'i', type: 'int',         required: true, default: null, desc: 'ldexp only: the power of two. Floats raise TypeError.' },
  ],

  modes: [
    {
      id: 'split',
      label: 'modf and frexp',
      blurb: 'Both decompositions of one float.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.modf(x), math.frexp(x))',
      cases: [
        { id: 'pos',   label: '3.75',  values: { x: '3.75' } },
        { id: 'neg',   label: '-3.75', values: { x: '-3.75' } },
        { id: 'tenth', label: '0.1',   values: { x: '0.1' } },
        { id: 'eight', label: '8.0',   values: { x: '8' } },
      ],
    },
    {
      id: 'ldexp',
      label: 'ldexp',
      blurb: 'm * 2**e, exactly.',
      params: [
        { name: 'm', type: 'float', hint: 'mantissa', input: 'float' },
        { name: 'e', type: 'int',   hint: 'exponent', input: 'number' },
      ],
      template: 'import math\nmath.ldexp({$m}, {$e})',
      cases: [
        { id: 'ten',   label: '0.625, 4',   values: { m: '0.625', e: '4' } },
        { id: 'max',   label: '1.0, 1023',  values: { m: '1', e: '1023' } },
        { id: 'over',  label: '1.0, 1024',  values: { m: '1', e: '1024' } },
        { id: 'under', label: '1.0, -1075', values: { m: '1', e: '-1075' } },
      ],
    },
  ],
  demoExplainer: 'modf(-3.75) is (-0.75, -3.0): both parts keep the sign. frexp(0.1) is (0.8, -3) — 0.8 is the rounded mantissa of 0.1 times 8. ldexp(1.0, 1024) is too large (OverflowError: math range error), while ldexp(1.0, -1075) is below half the smallest subnormal and rounds to 0.0 without an error.',

  patterns: [
    {
      name: 'Split hours into hours and minutes',
      desc: 'modf separates the fraction.',
      code: 'import math\nfrac, whole = math.modf(hours)\nh, m = int(whole), round(frac * 60)',
    },
    {
      name: 'Binary exponent of a float',
      desc: 'frexp gives it without logarithms.',
      code: 'import math\n_, e = math.frexp(x)  # 2**(e-1) <= abs(x) < 2**e',
    },
  ],

  examples: [
    { title: 'Fraction and whole part', code: 'import math\nmath.modf(3.75)',      returns: '(0.75, 3.0)' },
    { title: 'Signs are kept',          code: 'import math\nmath.modf(-3.75)',     returns: '(-0.75, -3.0)' },
    { title: 'Mantissa and exponent',   code: 'import math\nmath.frexp(10.0)',     returns: '(0.625, 4)' },
    { title: 'Inverse of frexp',        code: 'import math\nmath.ldexp(0.625, 4)', returns: '10.0' },
    { title: 'Round trip',              code: 'import math\nmath.ldexp(*math.frexp(0.1)) == 0.1', returns: 'True' },
    { title: 'Smallest subnormal',      code: 'import math\nmath.ldexp(1.0, -1074)', returns: '5e-324' },
    { title: 'Integer exponent only',   code: 'import math\nmath.ldexp(3.0, 2.0)',  returns: 'TypeError: Expected an int as second argument to ldexp.' },
  ],

  pitfalls: [
    {
      name: 'x - int(x) for the fractional part',
      desc: 'int() fails for inf and nan; modf handles them, keeps the sign, and returns both parts at once.',
      wrong: { label: 'x - int(x) for inf', code: "x = float('inf')\nx - int(x)", output: 'OverflowError: cannot convert float infinity to integer' },
      fix:   { label: 'modf', code: "import math\nmath.modf(float('inf'))", output: '(0.0, inf)' },
    },
    {
      name: 'x * 2 ** e with a float exponent',
      desc: 'ldexp insists on an int exponent; convert explicitly.',
      wrong: { label: 'float e', code: 'import math\nmath.ldexp(1.5, 3.0)', output: 'TypeError: Expected an int as second argument to ldexp.' },
      fix:   { label: 'int(e)', code: 'import math\nmath.ldexp(1.5, int(3.0))', output: '12.0' },
    },
  ],

  when: {
    use: ['Low-level float manipulation, custom number formats, scaling by powers of two'],
    avoid: ['Rounding → floor / ceil / round', 'Exact rational parts → float.as_integer_ratio()'],
  },

  notes: {
    cpython:    'modf and frexp handle inf and nan themselves and call the C modf / frexp otherwise; ldexp clamps huge exponents and raises OverflowError when the result overflows',
    'Platform': 'Exact operations: identical everywhere',
  },

  related: [
    { name: 'floor / ceil / trunc', slug: 'floor-ceil-trunc', when: 'Integer part as an int' },
    { name: 'nextafter / ulp', slug: 'nextafter-ulp', when: 'Neighbouring floats' },
    { name: 'float.as_integer_ratio()', slug: 'float-as_integer_ratio', when: 'Exact value as a fraction', category: 'functions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the fractional part of a float in Python?',
      a: 'math.modf(x)[0], or x % 1 for non-negative x. modf returns (fractional, integer), both floats with the sign of x.',
    },
    {
      q: 'What do frexp and ldexp do?',
      a: 'frexp(x) splits x into a mantissa m with 0.5 ≤ |m| < 1 and an int exponent e, so that x == m * 2**e exactly. ldexp(m, e) is the inverse.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.frexp',
    meta:  'math.modf, math.frexp, math.ldexp',
  },
};
