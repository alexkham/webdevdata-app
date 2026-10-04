// content/reference/python/stdlib/math/index.js — the math module hub

export const meta = {
  slug:        'index',
  name:        'math',
  signature:   'import math',
  blurb:       'Floating-point and integer math: sqrt, log, exp, trigonometry, floor/ceil, exact integer functions (factorial, comb, gcd, isqrt) and accurate sums (fsum).',
  category:    'numbers',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math module python math sqrt log exp sin cos tan pi floor ceil factorial comb gcd isqrt fsum isclose inf nan math domain error math range error',
};

export const method = {
  slug: 'index',
  name: 'math',

  category:    'Numbers & math',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'Sixty-odd functions over float and int. Float functions return float and raise ValueError ("math domain error") or OverflowError ("math range error"); the integer functions are exact at any size.',

  imports: ['import math', 'from math import sqrt, pi, isclose'],
  facts: [
    { label: 'Public API', value: '58 functions and 5 constants (pi, e, tau, inf, nan) in Python 3.13' },
    { label: 'Errors',     value: 'ValueError: math domain error · OverflowError: math range error' },
    { label: 'Platform',   value: 'Transcendental functions call the C library: the last digit can differ between Linux, Windows and macOS' },
    { label: 'Complex',    value: 'Complex numbers are in cmath; math rejects them' },
  ],

  modes: [
    {
      id: 'call',
      label: 'call any function',
      blurb: 'Type a function name from math and a float argument. Functions that need two arguments or an int say so.',
      params: [
        { name: 'fn', type: 'str',   hint: 'sqrt, log, exp, sin, floor…', input: 'text' },
        { name: 'x',  type: 'float', hint: 'argument',                    input: 'float' },
      ],
      template: 'import math\nf = getattr(math, {$fn})\nf({$x})',
      cases: [
        { id: 'sqrt',   label: 'sqrt(2.0)',    values: { fn: 'sqrt',  x: '2' } },
        { id: 'log',    label: 'log(100.0)',   values: { fn: 'log',   x: '100' } },
        { id: 'floor',  label: 'floor(2.5)',   values: { fn: 'floor', x: '2.5' } },
        { id: 'domain', label: 'sqrt(-1.0)',   values: { fn: 'sqrt',  x: '-1' } },
        { id: 'range',  label: 'exp(1000.0)',  values: { fn: 'exp',   x: '1000' } },
      ],
    },
    {
      id: 'sums',
      label: 'sum vs fsum',
      blurb: 'Comma-separated floats. sum() compensates rounding errors (3.12+); math.fsum is exact.',
      params: [{ name: 'xs', type: 'str', hint: 'comma-separated numbers', input: 'text' }],
      template: "import math\nxs = [float(x) for x in {$xs}.split(',')]\n(sum(xs), math.fsum(xs))",
      cases: [
        { id: 'tenths', label: '0.1, 0.2, 0.3',  values: { xs: '0.1, 0.2, 0.3' } },
        { id: 'big',    label: '1e16, 1, 1e-16', values: { xs: '1e16, 1, 1e-16' } },
        { id: 'inf',    label: 'inf, -inf',      values: { xs: 'inf, -inf' } },
      ],
    },
    {
      id: 'round',
      label: 'floor / ceil / round',
      blurb: 'Four ways to turn a float into an int. They disagree on halves and on negatives.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.floor(x), math.ceil(x), math.trunc(x), round(x))',
      cases: [
        { id: 'half',  label: '2.5',  values: { x: '2.5' } },
        { id: 'neg',   label: '-2.5', values: { x: '-2.5' } },
        { id: 'plain', label: '3.7',  values: { x: '3.7' } },
      ],
    },
  ],
  demoExplainer: 'getattr(math, name) is the same object as math.name, so the first tab calls any function by name. sqrt(-1.0) is a "math domain error" (ValueError) and exp(1000.0) a "math range error" (OverflowError). In the second tab, 0.1 + 0.2 + 0.3 added one by one gives 0.6000000000000001, but sum() returns 0.6; with 1e16, 1 and 1e-16 only fsum keeps the 1. The third tab: floor rounds down, ceil up, trunc toward zero, and round() to the nearest even integer on a tie.',

  patterns: [
    {
      name: 'Compare floats',
      desc: 'Never use == on computed floats; give isclose a tolerance that fits your data.',
      code: 'import math\nif math.isclose(measured, expected, rel_tol=1e-6):\n    ...',
    },
    {
      name: 'Integer square root',
      desc: 'isqrt is exact for any int; int(math.sqrt(n)) goes wrong above 2**52.',
      code: 'import math\nroot = math.isqrt(n)\nis_square = root * root == n',
    },
    {
      name: 'Accurate total of many floats',
      desc: 'fsum returns the correctly rounded sum of all the values.',
      code: 'import math\ntotal = math.fsum(amounts)',
    },
    {
      name: 'Angles in degrees',
      desc: 'Trigonometric functions take radians.',
      code: 'import math\nheight = length * math.sin(math.radians(angle_deg))',
    },
  ],

  examples: [
    { title: 'Square root',                code: 'import math\nmath.sqrt(2)',             returns: '1.4142135623730951' },
    { title: 'Logarithm with a base',      code: 'import math\nmath.log(8, 2)',           returns: '3.0' },
    { title: 'floor and ceil return ints', code: 'import math\n(math.floor(-2.5), math.ceil(-2.5))', returns: '(-3, -2)' },
    { title: 'Exact big integers',         code: 'import math\nmath.factorial(25)',       returns: '15511210043330985984000000' },
    { title: 'Ways to choose 5 of 52',     code: 'import math\nmath.comb(52, 5)',         returns: '2598960' },
    { title: 'Domain error',               code: 'import math\nmath.log(0)',              returns: 'ValueError: math domain error' },
    { title: 'Range error',                code: 'import math\nmath.exp(710)',            returns: 'OverflowError: math range error' },
  ],

  pitfalls: [
    {
      name: 'Comparing floats with ==',
      desc: '0.1 + 0.2 is not exactly 0.3 in binary floating point.',
      wrong: { label: '==',      code: '0.1 + 0.2 == 0.3', output: 'False' },
      fix:   { label: 'isclose', code: 'import math\nmath.isclose(0.1 + 0.2, 0.3)', output: 'True' },
    },
    {
      name: 'Square root of a negative number',
      desc: 'math works on real numbers only. cmath returns the complex root.',
      wrong: { label: 'math.sqrt',  code: 'import math\nmath.sqrt(-4)', output: 'ValueError: math domain error' },
      fix:   { label: 'cmath.sqrt', code: 'import cmath\ncmath.sqrt(-4)', output: '2j' },
    },
  ],

  when: {
    use: [
      'Scalar float math: roots, logarithms, exponentials, trigonometry',
      'Exact integer math: factorial, comb, perm, gcd, lcm, isqrt',
      'Accurate summation (fsum) and tolerant comparison (isclose)',
    ],
    avoid: [
      'Complex numbers → cmath',
      'Exact decimal money arithmetic → decimal',
      'Whole arrays of numbers → NumPy (vectorized, same functions)',
    ],
  },

  notes: {
    cpython:    'Modules/mathmodule.c. Most float functions wrap the platform C library (libm) and map its errors to ValueError / OverflowError',
    'Platform': 'exp, log, sin, pow, erf, cbrt and the other libm functions can differ in the last digit between operating systems; floor, sqrt, fsum, hypot, isqrt and the integer functions are identical everywhere',
    'Arguments': 'Float functions accept int and float (and anything with __float__); integer functions need a real int: 5.0 raises TypeError',
  },

  related: [
    { name: 'round()',   slug: 'round',  when: 'Built-in rounding to n digits, ties to even', category: 'functions' },
    { name: 'pow()',     slug: 'pow',    when: 'Built-in pow, with the 3-argument modular form', category: 'functions' },
    { name: 'sum()',     slug: 'sum',    when: 'Built-in sum (compensated for floats since 3.12)', category: 'functions' },
    { name: 'ValueError', slug: 'valueerror', when: 'What "math domain error" is', category: 'exceptions' },
    { name: 'OverflowError', slug: 'overflowerror', when: 'What "math range error" is', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "ValueError: math domain error" mean?',
      a: 'The argument is outside the mathematical domain of the function: sqrt or log of a negative number, log(0), acos(2), and similar. Check the input, or use cmath if you want complex results.',
    },
    {
      q: 'What does "OverflowError: math range error" mean?',
      a: 'The true result is too large for a float (above about 1.8e308), for example math.exp(710) or math.pow(10, 400). Work with logarithms instead, or use int arithmetic, which has no upper limit.',
    },
    {
      q: 'What is the difference between math.pow and **?',
      a: 'math.pow always converts both arguments to float and returns a float; 2 ** 10 stays an int (1024). math.pow raises ValueError for a negative base with a fractional exponent, while ** returns a complex number.',
    },
    {
      q: 'Do I need to import math to use pi or sqrt?',
      a: 'Yes. They are not built-ins: import math and write math.pi and math.sqrt(x), or import the names with from math import pi, sqrt.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html',
    meta:  'math — Mathematical functions',
  },
};
