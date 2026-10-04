// content/reference/python/stdlib/math/sinh-cosh-tanh.js — hyperbolic functions

export const meta = {
  slug:        'sinh-cosh-tanh',
  name:        'math.sinh / cosh / tanh / asinh / acosh / atanh',
  signature:   'math.sinh(x) · math.cosh(x) · math.tanh(x) · math.asinh(x) · math.acosh(x) · math.atanh(x)',
  blurb:       'Hyperbolic sine, cosine and tangent and their inverses — catenaries, relativity, activation functions.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math.sinh math.cosh math.tanh math.asinh math.acosh math.atanh sinh cosh tanh asinh acosh atanh hyperbolic functions python inverse hyperbolic tanh activation catenary math domain error acosh atanh',
};

export const method = {
  slug:      'sinh-cosh-tanh',
  name:      'math.sinh / cosh / tanh / asinh / acosh / atanh',
  signature: 'math.sinh(x, /) · math.cosh(x, /) · math.tanh(x, /) · math.asinh(x, /) · math.acosh(x, /) · math.atanh(x, /)',
  returns:   { type: 'float', desc: 'The hyperbolic function or its inverse.' },

  category:    'math function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'sinh and cosh grow like e**|x|/2 and overflow just past x = 710; tanh saturates to exactly 1.0. The inverses have domains: acosh needs x ≥ 1, atanh needs -1 < x < 1.',

  covers: ['sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh'],

  cheat: {
    commonCall: 'math.tanh(x)',
    returns:    'float in (-1, 1) — tanh(1.0) is 0.7615941559557649',
    replaces:   '(exp(x) - exp(-x)) / 2 and friends, which overflow and cancel',
    watchOut:   'acosh(0.5) and atanh(1) raise ValueError: math domain error',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'Any real for sinh, cosh, tanh, asinh; x ≥ 1 for acosh; -1 < x < 1 for atanh.' },
  ],

  modes: [
    {
      id: 'forward',
      label: 'sinh / cosh / tanh',
      blurb: 'The three forward functions for one x.',
      params: [{ name: 'x', type: 'float', hint: 'any number', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.sinh(x), math.cosh(x), math.tanh(x))',
      cases: [
        { id: 'one',  label: '1.0',    values: { x: '1' } },
        { id: 'zero', label: '0.0',    values: { x: '0' } },
        { id: 'big',  label: '20.0',   values: { x: '20' } },
        { id: 'over', label: '1000.0', values: { x: '1000' } },
      ],
    },
    {
      id: 'inverse',
      label: 'asinh / acosh',
      blurb: 'acosh is only defined from 1 upward.',
      params: [{ name: 'x', type: 'float', hint: 'x ≥ 1 for acosh', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.asinh(x), math.acosh(x))',
      cases: [
        { id: 'one', label: '1.0',  values: { x: '1' } },
        { id: 'two', label: '2.0',  values: { x: '2' } },
        { id: 'ten', label: '10.0', values: { x: '10' } },
        { id: 'low', label: '0.5',  values: { x: '0.5' } },
      ],
    },
    {
      id: 'atanh',
      label: 'atanh',
      blurb: 'Only for -1 < x < 1; the ends are infinite.',
      params: [{ name: 'x', type: 'float', hint: 'between -1 and 1', input: 'float' }],
      template: 'import math\nmath.atanh({$x})',
      cases: [
        { id: 'nine', label: '0.9',  values: { x: '0.9' } },
        { id: 'zero', label: '0.0',  values: { x: '0' } },
        { id: 'one',  label: '1.0',  values: { x: '1' } },
      ],
    },
  ],
  demoExplainer: 'At x = 20, sinh and cosh are both 242582597.70489514 — e**-20 is too small to change the sum — and tanh is exactly 1.0. sinh(1000.0) raises OverflowError: math range error. acosh(0.5) and atanh(1.0) are outside the domain and raise ValueError: math domain error.',

  patterns: [
    {
      name: 'tanh as a smooth clamp',
      desc: 'Squash any value into (-1, 1).',
      code: 'import math\nsquashed = math.tanh(x / scale)',
    },
    {
      name: 'Catenary (hanging chain)',
      desc: 'y = a·cosh(x / a).',
      code: 'import math\ny = a * math.cosh(x / a)',
    },
    {
      name: 'Fisher z-transform',
      desc: 'atanh of a correlation coefficient.',
      code: 'import math\nz = math.atanh(r)',
    },
  ],

  examples: [
    { title: 'sinh(1)',              code: 'import math\nmath.sinh(1.0)', returns: '1.1752011936438014' },
    { title: 'cosh(0) is 1',         code: 'import math\nmath.cosh(0.0)', returns: '1.0' },
    { title: 'tanh saturates',       code: 'import math\nmath.tanh(20.0)', returns: '1.0' },
    { title: 'acosh(1) is 0',        code: 'import math\nmath.acosh(1.0)', returns: '0.0' },
    { title: 'Round trip',           code: 'import math\nmath.tanh(math.atanh(0.9))', returns: '0.9' },
    { title: 'Overflow',             code: 'import math\nmath.cosh(1000)', returns: 'OverflowError: math range error' },
    { title: 'Domain',               code: 'import math\nmath.atanh(1.0)', returns: 'ValueError: math domain error' },
  ],

  pitfalls: [
    {
      name: 'Writing sinh with exp',
      desc: 'exp overflows first, even though the result would fit.',
      wrong: { label: 'exp formula', code: 'import math\nx = 710.0\n(math.exp(x) - math.exp(-x)) / 2', output: 'OverflowError: math range error' },
      fix:   { label: 'math.sinh', code: 'import math\nmath.sinh(710.0) > 1e308', output: 'True' },
    },
    {
      name: 'Feeding a correlation of exactly 1 to atanh',
      desc: 'atanh(±1) is infinite; clip first.',
      wrong: { label: 'atanh(1.0)', code: 'import math\nmath.atanh(1.0)', output: 'ValueError: math domain error' },
      fix:   { label: 'clip', code: 'import math\nr = min(1.0, 0.999999)\nmath.atanh(r) > 7', output: 'True' },
    },
  ],

  when: {
    use: ['Physics and engineering formulas with hyperbolic functions', 'tanh as a smooth saturating function'],
    avoid: ['Complex arguments → cmath', 'Arrays → numpy'],
  },

  notes: {
    cpython:    'Wrappers over the C library; sinh, cosh and expm1-based tanh. An infinite result from a finite x raises OverflowError (sinh, cosh) or ValueError (atanh at ±1)',
    'Platform': 'The last digit depends on the C library: math.atanh(0.5) is 0.5493061443340549 on Windows but 0.5493061443340548 on Linux. The values shown here agree on both',
    'Overflow': 'sinh and cosh overflow just above |x| = 710.47; sinh(710.0) still fits',
  },

  related: [
    { name: 'sin / cos / tan', slug: 'sin-cos-tan', when: 'Circular functions' },
    { name: 'exp / exp2 / expm1', slug: 'exp-exp2-expm1', when: 'What they are built from' },
    { name: 'log / log1p', slug: 'log', when: 'Inverse hyperbolics are logarithms' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does math.acosh raise "math domain error"?',
      a: 'cosh is never below 1, so acosh(x) is only defined for x ≥ 1. Values just below 1 often come from rounding — clamp with max(x, 1.0) if that is the case.',
    },
    {
      q: 'Is math.tanh exactly 1.0 for large inputs?',
      a: 'Yes. A little above x = 19 the true value is closer to 1.0 than to the next float below it: math.tanh(19.0) is still 0.9999999999999999, math.tanh(20.0) is 1.0 (and -1.0 for large negative x).',
    },
    {
      q: 'How do I compute the inverse hyperbolic functions in Python?',
      a: 'math.asinh, math.acosh and math.atanh. They handle large and small arguments better than log formulas written by hand: asinh(x) = log(x + sqrt(x*x + 1)) overflows in x*x long before asinh does.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#hyperbolic-functions',
    meta:  'Hyperbolic functions',
  },
};
