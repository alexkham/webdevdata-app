// content/reference/python/stdlib/math/sin-cos-tan.js — trigonometric functions

export const meta = {
  slug:        'sin-cos-tan',
  name:        'math.sin / cos / tan / asin / acos / atan / atan2',
  signature:   'math.sin(x) · math.cos(x) · math.tan(x) · math.asin(x) · math.acos(x) · math.atan(x) · math.atan2(y, x)',
  blurb:       'Sine, cosine, tangent and their inverses, in radians — plus atan2(y, x), the angle of a point in the right quadrant.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math.sin math.cos math.tan math.asin math.acos math.atan math.atan2 sin cos tan asin acos atan atan2 trigonometry python radians degrees arcsin arccos arctan angle of a vector sin(pi) not zero 1.2246467991473532e-16 math domain error asin',
};

export const method = {
  slug:      'sin-cos-tan',
  name:      'math.sin / cos / tan / asin / acos / atan / atan2',
  signature: 'math.sin(x, /) · math.cos(x, /) · math.tan(x, /) · math.asin(x, /) · math.acos(x, /) · math.atan(x, /) · math.atan2(y, x, /)',
  returns:   { type: 'float', desc: 'sin/cos/tan of an angle in radians; asin/acos/atan/atan2 return an angle in radians.' },

  category:    'math function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'Angles are in radians: convert degrees with math.radians first. sin(math.pi) is 1.2246467991473532e-16, not 0 — math.pi itself is rounded. asin and acos need -1 ≤ x ≤ 1.',

  covers: ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2'],

  cheat: {
    commonCall: 'math.sin(math.radians(30))',
    returns:    'float — 0.49999999999999994',
    replaces:   'atan(y / x) with manual quadrant fixes → atan2(y, x)',
    watchOut:   'Radians, not degrees; asin(2) raises ValueError',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'sin/cos/tan: angle in radians. asin/acos: value in [-1, 1]. atan: any value. atan2: the x coordinate.' },
    { name: 'y', type: 'int | float', required: true, default: null, desc: 'atan2 only: the y coordinate (first argument).' },
  ],

  modes: [
    {
      id: 'degrees',
      label: 'from degrees',
      blurb: 'Convert degrees to radians, then take sin, cos and tan.',
      params: [{ name: 'deg', type: 'float', hint: 'angle in degrees', input: 'float' }],
      template: 'import math\nr = math.radians({$deg})\n(math.sin(r), math.cos(r), math.tan(r))',
      cases: [
        { id: 'd30',  label: '30°',  values: { deg: '30' } },
        { id: 'd90',  label: '90°',  values: { deg: '90' } },
        { id: 'd180', label: '180°', values: { deg: '180' } },
        { id: 'd0',   label: '0°',   values: { deg: '0' } },
      ],
    },
    {
      id: 'inverse',
      label: 'inverse',
      blurb: 'asin, acos and atan of a ratio, shown in degrees.',
      params: [{ name: 'x', type: 'float', hint: 'a ratio', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.degrees(math.asin(x)), math.degrees(math.acos(x)), math.degrees(math.atan(x)))',
      cases: [
        { id: 'one',  label: '1.0', values: { x: '1' } },
        { id: 'half', label: '0.5', values: { x: '0.5' } },
        { id: 'two',  label: '2.0', values: { x: '2' } },
      ],
    },
    {
      id: 'atan2',
      label: 'atan2',
      blurb: 'The angle of the point (x, y) — note the order: y first.',
      params: [
        { name: 'y', type: 'float', hint: 'y coordinate', input: 'float' },
        { name: 'x', type: 'float', hint: 'x coordinate', input: 'float' },
      ],
      template: 'import math\nmath.degrees(math.atan2({$y}, {$x}))',
      cases: [
        { id: 'q1', label: '(1, 1)',   values: { y: '1',  x: '1' } },
        { id: 'q2', label: '(-1, 1)',  values: { y: '1',  x: '-1' } },
        { id: 'q3', label: '(-1, -1)', values: { y: '-1', x: '-1' } },
        { id: 'w',  label: '(-1, 0)',  values: { y: '0',  x: '-1' } },
      ],
    },
  ],
  demoExplainer: 'sin(30°) comes out as 0.49999999999999994 and cos(90°) as 6.123233995736766e-17: radians(30) and radians(90) are rounded, so the functions answer for an angle a hair away from the exact one. tan(90°) is 1.633123935319537e+16 rather than an error for the same reason. asin(2.0) raises ValueError: math domain error. atan2 gets the quadrant right: (1, -1) — y first — is 135.0 degrees, (-1, -1) is -135.0.',

  patterns: [
    {
      name: 'Degrees in, degrees out',
      desc: 'Wrap the conversions once.',
      code: 'import math\ndef sin_deg(d):\n    return math.sin(math.radians(d))',
    },
    {
      name: 'Heading of a vector',
      desc: 'atan2 handles x == 0 and every quadrant.',
      code: 'import math\nheading = math.degrees(math.atan2(dy, dx)) % 360',
    },
    {
      name: 'Point on a circle',
      desc: 'Polar to Cartesian.',
      code: 'import math\nx, y = r * math.cos(theta), r * math.sin(theta)',
    },
  ],

  examples: [
    { title: 'sin of 30 degrees',      code: 'import math\nmath.sin(math.radians(30))', returns: '0.49999999999999994' },
    { title: 'sin(pi) is not exactly 0', code: 'import math\nmath.sin(math.pi)',        returns: '1.2246467991473532e-16' },
    { title: 'cos(pi)',                code: 'import math\nmath.cos(math.pi)',          returns: '-1.0' },
    { title: 'pi from atan',           code: 'import math\n4 * math.atan(1)',           returns: '3.141592653589793' },
    { title: 'atan2 knows the quadrant', code: 'import math\nmath.degrees(math.atan2(-1, -1))', returns: '-135.0' },
    { title: 'Out of domain',          code: 'import math\nmath.asin(2)',               returns: 'ValueError: math domain error' },
  ],

  pitfalls: [
    {
      name: 'Passing degrees',
      desc: 'The functions take radians; 30 radians is a different angle.',
      wrong: { label: 'sin(30)', code: 'import math\nmath.sin(30)', output: '-0.9880316240928618' },
      fix:   { label: 'radians first', code: 'import math\nmath.sin(math.radians(30))', output: '0.49999999999999994' },
    },
    {
      name: 'atan(y / x) loses the quadrant',
      desc: 'y / x is the same for (1, 1) and (-1, -1), and fails for x == 0.',
      wrong: { label: 'atan(y / x)', code: 'import math\nmath.degrees(math.atan(-1 / -1))', output: '45.0' },
      fix:   { label: 'atan2(y, x)', code: 'import math\nmath.degrees(math.atan2(-1, -1))', output: '-135.0' },
    },
    {
      name: 'Expecting exact zeros',
      desc: 'Round for display, or compare with a tolerance.',
      wrong: { label: '== 0', code: 'import math\nmath.cos(math.pi / 2) == 0', output: 'False' },
      fix:   { label: 'isclose', code: 'import math\nmath.isclose(math.cos(math.pi / 2), 0, abs_tol=1e-12)', output: 'True' },
    },
  ],

  when: {
    use: ['Geometry, rotations, waves, polar coordinates', 'atan2 for the direction of any 2-D vector'],
    avoid: ['Complex arguments → cmath', 'Whole arrays → numpy.sin and friends'],
  },

  notes: {
    cpython:    'Thin wrappers over the C library; atan2’s special cases (inf, nan, signed zeros) are handled in mathmodule.c before calling C atan2',
    'Platform': 'The last digit can differ between C libraries for some arguments — math.sin(math.radians(45)) is 0.7071067811865476 on Windows but 0.7071067811865475 on Linux. The values on this page agree on both',
    'Ranges':   'asin, atan: [-π/2, π/2] · acos: [0, π] · atan2: [-π, π]',
  },

  related: [
    { name: 'degrees / radians', slug: 'degrees-radians', when: 'Convert angles' },
    { name: 'sinh / cosh / tanh', slug: 'sinh-cosh-tanh', when: 'Hyperbolic versions' },
    { name: 'dist / hypot', slug: 'dist-hypot', when: 'Length of a vector' },
    { name: 'constants', slug: 'constants', when: 'math.pi and math.tau' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does math.sin use degrees or radians?',
      a: 'Radians. Convert with math.radians(deg) first, and convert results of asin/acos/atan back with math.degrees().',
    },
    {
      q: 'Why is math.sin(math.pi) not 0?',
      a: 'math.pi is the float closest to π, about 1.2e-16 away from it, and the sine near π has slope -1, so the result is that distance: 1.2246467991473532e-16. Round it or compare with math.isclose(..., abs_tol=...).',
    },
    {
      q: 'What is the difference between atan and atan2?',
      a: 'atan(t) only sees the ratio and returns an angle between -90° and 90°. atan2(y, x) sees both signs and returns the full -180°..180° angle of the point (x, y); it also works when x is 0.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#trigonometric-functions',
    meta:  'Trigonometric functions',
  },
};
