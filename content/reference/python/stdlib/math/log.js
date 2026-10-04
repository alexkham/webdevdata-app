// content/reference/python/stdlib/math/log.js — math.log / log2 / log10 / log1p

export const meta = {
  slug:        'log',
  name:        'math.log / log2 / log10 / log1p',
  signature:   'math.log(x[, base]) · math.log2(x) · math.log10(x) · math.log1p(x)',
  blurb:       'Natural logarithm, logarithm to any base, the exact-for-powers log2 and log10, and log(1 + x) for tiny x.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'log, log10, log1p: all versions · log2: 3.3+',
  searchTerms: 'math.log math.log2 math.log10 math.log1p log log2 log10 log1p logarithm python log base 2 log base 10 natural log ln log with base log(1000, 10) 2.9999999999999996 math domain error log 0 number of digits',
};

export const method = {
  slug:      'log',
  name:      'math.log / log2 / log10 / log1p',
  signature: 'math.log(x[, base]) · math.log2(x, /) · math.log10(x, /) · math.log1p(x, /)',
  returns:   { type: 'float', desc: 'The logarithm.' },

  category:    'math function',
  version:     'log, log10, log1p: all versions · log2: 3.3+',
  hasLiveDemo: true,

  subtitle: 'math.log(x, base) is log(x) / log(base) — two rounded results divided — so log(1000, 10) gives 2.9999999999999996. log10 and log2 are computed directly and give 3.0. All of them accept ints of any size.',

  covers: ['log', 'log2', 'log10', 'log1p'],

  cheat: {
    commonCall: 'math.log(x), math.log10(x), math.log2(x)',
    returns:    'float — log10(1000) is 3.0',
    replaces:   'log(x) / log(10) and log(1 + x) for small x',
    watchOut:   'log(0) and log of a negative raise ValueError: math domain error',
  },

  parameters: [
    { name: 'x',    type: 'int | float', required: true,  default: null, desc: 'Must be > 0 (log1p: > -1). Ints larger than any float are handled exactly.' },
    { name: 'base', type: 'int | float', required: false, default: 'e',  desc: 'math.log only. Computed as log(x) / log(base); base 1 divides by zero.' },
  ],

  modes: [
    {
      id: 'base',
      label: 'log with a base',
      blurb: 'math.log(x, base). Try base 10 against the log10 tab.',
      params: [
        { name: 'x',    type: 'int | float', hint: 'number', input: 'auto' },
        { name: 'base', type: 'int | float', hint: 'base',   input: 'auto' },
      ],
      template: 'import math\nmath.log({$x}, {$base})',
      cases: [
        { id: 'two',   label: 'log(8, 2)',     values: { x: '8',    base: '2' } },
        { id: 'ten',   label: 'log(1000, 10)', values: { x: '1000', base: '10' } },
        { id: 'hund',  label: 'log(100, 10)',  values: { x: '100',  base: '10' } },
        { id: 'one',   label: 'base 1',        values: { x: '10',   base: '1' } },
        { id: 'zero',  label: 'log(0, 10)',    values: { x: '0',    base: '10' } },
      ],
    },
    {
      id: 'compare',
      label: 'log(x, 10) vs log10',
      blurb: 'The same quantity three ways.',
      params: [{ name: 'x', type: 'int | float', hint: 'positive number', input: 'auto' }],
      template: 'import math\nx = {$x}\n(math.log(x, 10), math.log10(x), math.log2(x))',
      cases: [
        { id: 'k',    label: '1000',  values: { x: '1000' } },
        { id: 'p2',   label: '1024',  values: { x: '1024' } },
        { id: 'frac', label: '0.001', values: { x: '0.001' } },
      ],
    },
    {
      id: 'bigint',
      label: 'huge ints',
      blurb: 'log10 of 10**n, for n far beyond the float range.',
      params: [{ name: 'n', type: 'int', hint: 'exponent', input: 'number' }],
      template: 'import math\nmath.log10(10 ** {$n})',
      cases: [
        { id: 'small', label: '10**22',  values: { n: '22' } },
        { id: 'huge',  label: '10**400', values: { n: '400' } },
      ],
    },
    {
      id: 'small',
      label: 'log(1 + x) vs log1p',
      blurb: 'For tiny x, 1 + x already loses most of x’s digits.',
      params: [{ name: 'x', type: 'float', hint: 'a small number', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.log(1 + x), math.log1p(x))',
      cases: [
        { id: 'e10', label: '1e-10', values: { x: '1e-10' } },
        { id: 'neg', label: '-0.5',  values: { x: '-0.5' } },
      ],
    },
  ],
  demoExplainer: 'log(1000, 10) divides log(1000) by log(10); both are rounded, and the quotient lands one step below 3. log10(1000) is 3.0 exactly, log2(1024) is 10.0. 10**400 cannot be converted to a float, yet log10 handles it: Python splits the int into mantissa and exponent first, giving 400.0. Base 1 is ZeroDivisionError (log(1) is 0.0), and log(0) is "math domain error".',

  patterns: [
    {
      name: 'Number of decimal digits',
      desc: 'Exact and simpler: len(str(n)) for ints; log10 for floats.',
      code: 'digits = len(str(abs(n)))',
    },
    {
      name: 'Bits needed',
      desc: 'Exact for ints: no floats involved.',
      code: 'bits = n.bit_length()',
    },
    {
      name: 'Log-sum for products of probabilities',
      desc: 'Add logs instead of multiplying tiny numbers.',
      code: 'import math\nlog_p = sum(math.log(p) for p in probabilities)',
    },
  ],

  examples: [
    { title: 'Natural log',           code: 'import math\nmath.log(math.e)',  returns: '1.0' },
    { title: 'Log base 2',            code: 'import math\nmath.log(8, 2)',    returns: '3.0' },
    { title: 'log10 is exact for powers of ten', code: 'import math\nmath.log10(1000)', returns: '3.0' },
    { title: 'log(x, 10) is not',     code: 'import math\nmath.log(1000, 10)', returns: '2.9999999999999996' },
    { title: 'Ints beyond float range', code: 'import math\nmath.log2(2 ** 2000)', returns: '2000.0' },
    { title: 'log(0)',                code: 'import math\nmath.log(0)',       returns: 'ValueError: math domain error' },
    { title: 'log1p near zero',       code: 'import math\nmath.log1p(1e-10)', returns: '9.999999999500001e-11' },
  ],

  pitfalls: [
    {
      name: 'Counting digits with log10 and int()',
      desc: 'Rounding from log(x, 10) breaks the boundary cases; len(str()) is exact for ints.',
      wrong: { label: 'log(n, 10)', code: 'import math\nint(math.log(1000, 10)) + 1', output: '3' },
      fix:   { label: 'len(str(n))', code: 'len(str(1000))', output: '4' },
    },
    {
      name: 'log(1 + x) for small x',
      desc: '1 + 1e-10 is already rounded, so the log of it is wrong from the 8th digit on.',
      wrong: { label: 'log(1 + x)', code: 'import math\nmath.log(1 + 1e-10)', output: '1.000000082690371e-10' },
      fix:   { label: 'log1p', code: 'import math\nmath.log1p(1e-10)', output: '9.999999999500001e-11' },
    },
  ],

  when: {
    use: ['log10 / log2 for decimal and binary magnitudes', 'log with a base for other bases', 'log1p when x can be near 0'],
    avoid: ['Digits or bits of an int → len(str(n)), n.bit_length()', 'Logs of negative or complex numbers → cmath.log'],
  },

  notes: {
    cpython:    'loghelper() in Modules/mathmodule.c: an int too large for a float is split as x * 2**e and log(x) + e * log(2) is returned; math.log(x, base) divides two such results',
    'Platform': 'log, log2, log10 and log1p come from the C library and can differ in the last digit between systems for some inputs; the values shown here agree on Windows and Linux',
    'Errors':   'x ≤ 0 → ValueError: math domain error; base 1 → ZeroDivisionError: float division by zero',
  },

  related: [
    { name: 'exp / exp2 / expm1', slug: 'exp-exp2-expm1', when: 'The inverses' },
    { name: 'pow', slug: 'pow', when: 'Powers with any base' },
    { name: 'int.bit_length()', slug: 'int-bit_length', when: 'Exact bit count of an int', category: 'functions' },
    { name: 'ValueError', slug: 'valueerror', when: 'What log(0) raises', category: 'exceptions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does math.log(1000, 10) return 2.9999999999999996?',
      a: 'With a base, math.log computes log(1000) / log(10). Both logarithms are rounded floats, and the quotient rounds to just below 3. math.log10(1000) is computed directly and returns 3.0.',
    },
    {
      q: 'How do I calculate log base 2 in Python?',
      a: 'math.log2(x). It is exact for powers of two (log2(1024) is 10.0). For an int, n.bit_length() - 1 gives the floor of log2 exactly.',
    },
    {
      q: 'What does "ValueError: math domain error" mean for log?',
      a: 'The argument is zero or negative (for log1p: ≤ -1). The logarithm of those is not a real number. Filter or clamp the input first, or use cmath.log for complex results.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.log',
    meta:  'math.log, math.log2, math.log10, math.log1p',
  },
};
