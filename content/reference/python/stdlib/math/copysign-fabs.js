// content/reference/python/stdlib/math/copysign-fabs.js — math.copysign / fabs

export const meta = {
  slug:        'copysign-fabs',
  name:        'math.copysign / fabs',
  signature:   'math.copysign(x, y) · math.fabs(x)',
  blurb:       'Absolute value as a float, and the magnitude of x with the sign of y — the way to read the sign of -0.0 and nan.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math.copysign math.fabs copysign fabs absolute value float python abs vs fabs sign of a number negative zero -0.0 sign function',
};

export const method = {
  slug:      'copysign-fabs',
  name:      'math.copysign / fabs',
  signature: 'math.copysign(x, y, /) · math.fabs(x, /)',
  returns:   { type: 'float', desc: 'fabs: |x| as a float. copysign: |x| with the sign bit of y.' },

  category:    'math function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'fabs differs from abs() in one way: it always returns a float. copysign looks at the sign bit, so it can tell -0.0 from 0.0 — something == and < cannot.',

  covers: ['copysign', 'fabs'],

  cheat: {
    commonCall: 'math.copysign(1.0, x)',
    returns:    'float — 1.0 or -1.0, the sign of x (including -0.0)',
    replaces:   'x < 0 tests that miss -0.0',
    watchOut:   'fabs(-3) is 3.0, not 3',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'The magnitude (fabs: the value).' },
    { name: 'y', type: 'int | float', required: true, default: null, desc: 'copysign only: whose sign to use.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'abs vs fabs',
      blurb: 'abs keeps the type; fabs converts to float; copysign(1.0, x) is the sign.',
      params: [{ name: 'x', type: 'int | float', hint: 'a number', input: 'auto' }],
      template: 'import math\nx = {$x}\n(abs(x), math.fabs(x), math.copysign(1.0, x))',
      cases: [
        { id: 'int',  label: '-3',   values: { x: '-3' } },
        { id: 'flt',  label: '-2.5', values: { x: '-2.5' } },
        { id: 'pos',  label: '7',    values: { x: '7' } },
      ],
    },
    {
      id: 'sign',
      label: 'copysign',
      blurb: 'Magnitude from the first argument, sign from the second.',
      params: [
        { name: 'mag',  type: 'float', hint: 'magnitude',     input: 'float' },
        { name: 'sign', type: 'float', hint: 'sign source',   input: 'float' },
      ],
      template: 'import math\nmath.copysign({$mag}, {$sign})',
      cases: [
        { id: 'negz', label: '5.0, -0.0', values: { mag: '5', sign: '-0' } },
        { id: 'pos',  label: '-3.5, 2.0', values: { mag: '-3.5', sign: '2' } },
        { id: 'zero', label: '0.0, -1.0', values: { mag: '0', sign: '-1' } },
      ],
    },
  ],
  demoExplainer: 'abs(-3) stays the int 3; fabs(-3) is 3.0. copysign(5.0, -0.0) is -5.0: -0.0 compares equal to 0.0, but its sign bit is set, and copysign reads exactly that bit. copysign(0.0, -1.0) produces -0.0.',

  patterns: [
    {
      name: 'Sign function',
      desc: 'Python has no math.sign; this returns -1.0, 0.0 or 1.0 (and keeps -0.0).',
      code: 'import math\ndef sign(x):\n    return math.copysign(1.0, x) if x else x',
    },
    {
      name: 'Detect negative zero',
      desc: 'Only the sign bit differs.',
      code: 'import math\nis_neg_zero = x == 0 and math.copysign(1.0, x) < 0',
    },
  ],

  examples: [
    { title: 'fabs returns a float',   code: 'import math\nmath.fabs(-3)',   returns: '3.0' },
    { title: 'abs keeps the int',      code: 'abs(-3)',                     returns: '3' },
    { title: 'Sign of negative zero',  code: 'import math\nmath.copysign(1.0, -0.0)', returns: '-1.0' },
    { title: '-0.0 equals 0.0',        code: '-0.0 == 0.0',                  returns: 'True' },
    { title: 'Magnitude and sign',     code: 'import math\nmath.copysign(3, -1)', returns: '-3.0' },
    { title: 'fabs of a huge int',     code: 'import math\nmath.fabs(-10 ** 400)', returns: 'OverflowError: int too large to convert to float' },
  ],

  pitfalls: [
    {
      name: 'Testing the sign with < 0',
      desc: '-0.0 < 0 is False, so the sign of negative zero is lost.',
      wrong: { label: 'x < 0', code: 'x = -0.0\nx < 0', output: 'False' },
      fix:   { label: 'copysign', code: 'import math\nx = -0.0\nmath.copysign(1.0, x) < 0', output: 'True' },
    },
    {
      name: 'fabs on big ints',
      desc: 'fabs converts to float; abs works on ints of any size.',
      wrong: { label: 'fabs', code: 'import math\nmath.fabs(-10 ** 400)', output: 'OverflowError: int too large to convert to float' },
      fix:   { label: 'abs', code: 'abs(-10 ** 400) == 10 ** 400', output: 'True' },
    },
  ],

  when: {
    use: ['fabs when you want a float result', 'copysign for signs, especially of zeros and infinities'],
    avoid: ['Absolute value of ints, Fractions, Decimals → abs()', 'Complex magnitude → abs(z)'],
  },

  notes: {
    cpython:    'Wrappers over the C fabs and copysign; both convert their arguments to double first',
    'Platform': 'Bit operations: identical everywhere',
  },

  related: [
    { name: 'abs()', slug: 'abs', when: 'Built-in absolute value, keeps the type', category: 'functions' },
    { name: 'fmod / remainder', slug: 'fmod-remainder', when: 'Other float helpers' },
    { name: 'isfinite / isinf / isnan', slug: 'isfinite-isinf-isnan', when: 'Classify values' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between abs() and math.fabs()?',
      a: 'abs() returns the same type it gets (int, float, Fraction, Decimal; the magnitude for complex). math.fabs() always converts to float and returns a float, so it fails for ints beyond the float range.',
    },
    {
      q: 'Does Python have a sign function?',
      a: 'There is no math.sign. Use math.copysign(1.0, x) for ±1.0, or (x > 0) - (x < 0) for an int -1, 0 or 1.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.copysign',
    meta:  'math.copysign, math.fabs',
  },
};
