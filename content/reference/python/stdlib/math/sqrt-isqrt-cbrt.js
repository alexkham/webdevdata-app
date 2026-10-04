// content/reference/python/stdlib/math/sqrt-isqrt-cbrt.js — math.sqrt / isqrt / cbrt

export const meta = {
  slug:        'sqrt-isqrt-cbrt',
  name:        'math.sqrt / isqrt / cbrt',
  signature:   'math.sqrt(x) · math.isqrt(n) · math.cbrt(x)',
  blurb:       'Square root as a float, exact integer square root, and cube root (3.11+). How they differ from x ** 0.5.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'sqrt: all versions · isqrt: 3.8+ · cbrt: 3.11+',
  searchTerms: 'math.sqrt math.isqrt math.cbrt sqrt isqrt cbrt square root python cube root integer square root x ** 0.5 perfect square check negative square root math domain error isqrt argument must be nonnegative',
};

export const method = {
  slug:      'sqrt-isqrt-cbrt',
  name:      'math.sqrt / isqrt / cbrt',
  signature: 'math.sqrt(x, /) · math.isqrt(n, /) · math.cbrt(x, /)',
  returns:   { type: 'float | int', desc: 'sqrt and cbrt return float; isqrt returns the int floor of the exact square root.' },

  category:    'math function',
  version:     'sqrt: all versions · isqrt: 3.8+ · cbrt: 3.11+',
  hasLiveDemo: true,

  subtitle: 'sqrt converts to float first, so above 2**53 it answers for a nearby number. isqrt works on the int itself and is exact at any size. cbrt (3.11+) also takes negative numbers.',

  covers: ['sqrt', 'isqrt', 'cbrt'],

  cheat: {
    commonCall: 'math.sqrt(x), math.isqrt(n)',
    returns:    'sqrt(16) → 4.0 · isqrt(17) → 4 · cbrt(-8.0) → -2.0',
    replaces:   'x ** 0.5 and int(math.sqrt(n))',
    watchOut:   'sqrt(-1) raises ValueError; int(math.sqrt(n)) is wrong for big n',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'sqrt: must be ≥ 0 (or -0.0). cbrt: any real number.' },
    { name: 'n', type: 'int', required: true, default: null, desc: 'isqrt: a non-negative int (floats are rejected with TypeError).' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'sqrt vs isqrt vs ** 0.5',
      blurb: 'Type any integer, as many digits as you like.',
      params: [{ name: 'n', type: 'str', hint: 'an integer, e.g. 9999999999999999', input: 'text' }],
      template: 'import math\nn = int({$n})\n(math.sqrt(n), math.isqrt(n), n ** 0.5)',
      cases: [
        { id: 'sq',    label: '16',                values: { n: '16' } },
        { id: 'nonsq', label: '17',                values: { n: '17' } },
        { id: 'big',   label: '9999999999999999',  values: { n: '9999999999999999' } },
        { id: 'neg',   label: '-4',                values: { n: '-4' } },
      ],
    },
    {
      id: 'perfect',
      label: 'perfect square?',
      blurb: 'The exact test: isqrt(n) squared equals n.',
      params: [{ name: 'n', type: 'str', hint: 'an integer', input: 'text' }],
      template: 'import math\nn = int({$n})\nmath.isqrt(n) ** 2 == n',
      cases: [
        { id: 'yes',  label: '144', values: { n: '144' } },
        { id: 'no',   label: '145', values: { n: '145' } },
        { id: 'huge', label: '10**40 + 1', values: { n: '10000000000000000000000000000000000000001' } },
      ],
    },
    {
      id: 'cbrt',
      label: 'cube root',
      blurb: 'math.cbrt takes negative arguments; x ** (1/3) does not give a real root for them.',
      params: [{ name: 'x', type: 'float', hint: 'a number', input: 'float' }],
      template: 'import math\nmath.cbrt({$x})',
      cases: [
        { id: 'eight', label: '8.0',    values: { x: '8' } },
        { id: 'neg',   label: '-8.0',   values: { x: '-8' } },
        { id: 'k',     label: '1000.0', values: { x: '1000' } },
      ],
    },
  ],
  demoExplainer: 'For 9999999999999999 the float conversion rounds n up to 1e16, so sqrt and ** 0.5 both say 100000000.0 while isqrt gives the true floor, 99999999. For -4, math.sqrt raises "math domain error" before the other two run. The 41-digit number in the second tab is not a perfect square, and isqrt proves it without any rounding.',

  patterns: [
    {
      name: 'Exact perfect-square test',
      desc: 'Works for ints of any size.',
      code: 'import math\ndef is_square(n):\n    return n >= 0 and math.isqrt(n) ** 2 == n',
    },
    {
      name: 'Ceiling of a square root',
      desc: 'Smallest a with a * a >= n.',
      code: 'import math\na = 1 + math.isqrt(n - 1) if n > 0 else 0',
    },
    {
      name: 'Real cube root of any sign',
      desc: 'Python 3.11+.',
      code: 'import math\nside = math.cbrt(volume)',
    },
  ],

  examples: [
    { title: 'Square root',               code: 'import math\nmath.sqrt(16)',  returns: '4.0' },
    { title: 'Integer square root',       code: 'import math\nmath.isqrt(17)', returns: '4' },
    { title: 'isqrt is exact for big ints', code: 'import math\nmath.isqrt(10 ** 30 - 1)', returns: '999999999999999' },
    { title: 'int(sqrt()) is not',        code: 'import math\nint(math.sqrt(10 ** 30 - 1))', returns: '1000000000000000' },
    { title: 'Cube root of a negative',   code: 'import math\nmath.cbrt(-8.0)', returns: '-2.0' },
    { title: 'sqrt of a too-big int',     code: 'import math\nmath.sqrt(10 ** 400)', returns: 'OverflowError: int too large to convert to float' },
    { title: 'Negative input',            code: 'import math\nmath.isqrt(-1)', returns: 'ValueError: isqrt() argument must be nonnegative' },
  ],

  pitfalls: [
    {
      name: 'Square root of a negative number',
      desc: 'math is real-valued. Use cmath for a complex root, or check the sign first.',
      wrong: { label: 'math.sqrt', code: 'import math\nmath.sqrt(-9)', output: 'ValueError: math domain error' },
      fix:   { label: 'cmath.sqrt', code: 'import cmath\ncmath.sqrt(-9)', output: '3j' },
    },
    {
      name: 'Cube root with ** (1/3)',
      desc: 'A negative float to a fractional power is a complex number in Python 3.',
      wrong: { label: '** (1/3)', code: '(-8) ** (1/3)', output: '(1.0000000000000002+1.7320508075688772j)' },
      fix:   { label: 'math.cbrt', code: 'import math\nmath.cbrt(-8)', output: '-2.0' },
    },
    {
      name: 'Trusting a float square root to be exact',
      desc: 'sqrt(2) squared is not 2 — compare with isclose, or stay with ints.',
      wrong: { label: '== 2', code: 'import math\nmath.sqrt(2) ** 2 == 2', output: 'False' },
      fix:   { label: 'isclose', code: 'import math\nmath.isclose(math.sqrt(2) ** 2, 2)', output: 'True' },
    },
  ],

  when: {
    use: ['sqrt: geometry, statistics, anything float', 'isqrt: number theory, perfect squares, exact bounds on big ints', 'cbrt: real cube roots, including negative ones'],
    avoid: ['Complex roots → cmath.sqrt', 'Distances → math.hypot / math.dist (no overflow in the squares)'],
  },

  notes: {
    cpython:    'sqrt wraps the C sqrt (correctly rounded everywhere, IEEE 754); isqrt is CPython’s own Newton iteration on Python ints; cbrt wraps the C cbrt',
    'Platform': 'sqrt and isqrt give the same result on every system. cbrt depends on the C library: math.cbrt(27.0) is 3.0 on Windows but 3.0000000000000004 on Linux (glibc), so this page only shows cube roots that agree',
    'Versions': 'isqrt added in 3.8, cbrt in 3.11 (docs.python.org)',
  },

  related: [
    { name: 'pow', slug: 'pow', when: 'x ** 0.5 and math.pow' },
    { name: 'dist / hypot', slug: 'dist-hypot', when: 'Square root of a sum of squares, safely' },
    { name: 'exp / exp2 / expm1', slug: 'exp-exp2-expm1', when: 'Other powers' },
    { name: '** operator', slug: 'pow', when: 'Power operator', category: 'operators' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between math.sqrt and x ** 0.5?',
      a: 'For non-negative numbers they normally give the same float. The differences are in edge cases: math.sqrt raises ValueError for negative input while (-4) ** 0.5 returns a complex number, and math.sqrt(x) states the intent more clearly.',
    },
    {
      q: 'How do I get an integer square root in Python?',
      a: 'math.isqrt(n) (3.8+) returns the largest int whose square is ≤ n, exactly, for any size. int(math.sqrt(n)) can be off by one once n is beyond about 2**52.',
    },
    {
      q: 'How do I calculate a cube root in Python?',
      a: 'math.cbrt(x) on Python 3.11+, which also handles negative numbers. On older versions use x ** (1/3) for x ≥ 0 and -((-x) ** (1/3)) for x < 0.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.sqrt',
    meta:  'math.sqrt, math.isqrt, math.cbrt',
  },
};
