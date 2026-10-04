// content/reference/python/stdlib/math/degrees-radians.js — math.degrees / radians

export const meta = {
  slug:        'degrees-radians',
  name:        'math.degrees / radians',
  signature:   'math.degrees(x) · math.radians(x)',
  blurb:       'Convert an angle from radians to degrees and back. The trigonometric functions all work in radians.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math.degrees math.radians degrees radians convert degrees to radians python radians to degrees angle conversion 180 / pi pi / 180',
};

export const method = {
  slug:      'degrees-radians',
  name:      'math.degrees / radians',
  signature: 'math.degrees(x, /) · math.radians(x, /)',
  returns:   { type: 'float', desc: 'x * 180/π (degrees) or x * π/180 (radians).' },

  category:    'math function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'One multiplication each, by the rounded constant 180/π or π/180 — so a round trip is not always exact: degrees(radians(30.0)) is not 30.0.',

  covers: ['degrees', 'radians'],

  cheat: {
    commonCall: 'math.radians(deg)',
    returns:    'float — radians(180) is 3.141592653589793',
    replaces:   'deg * math.pi / 180 written by hand',
    watchOut:   'Round trips can be off in the last digit',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'The angle to convert.' },
  ],

  modes: [
    {
      id: 'toRad',
      label: 'degrees → radians',
      blurb: 'math.radians(deg).',
      params: [{ name: 'deg', type: 'float', hint: 'degrees', input: 'float' }],
      template: 'import math\nmath.radians({$deg})',
      cases: [
        { id: 'd180', label: '180°', values: { deg: '180' } },
        { id: 'd90',  label: '90°',  values: { deg: '90' } },
        { id: 'd360', label: '360°', values: { deg: '360' } },
        { id: 'd1',   label: '1°',   values: { deg: '1' } },
      ],
    },
    {
      id: 'toDeg',
      label: 'radians → degrees',
      blurb: 'math.degrees(rad).',
      params: [{ name: 'rad', type: 'float', hint: 'radians', input: 'float' }],
      template: 'import math\nmath.degrees({$rad})',
      cases: [
        { id: 'one', label: '1.0',            values: { rad: '1' } },
        { id: 'pi',  label: 'pi',             values: { rad: '3.141592653589793' } },
        { id: 'tau', label: 'tau',            values: { rad: '6.283185307179586' } },
      ],
    },
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'Does degrees(radians(d)) give d back?',
      params: [{ name: 'deg', type: 'float', hint: 'degrees', input: 'float' }],
      template: 'import math\nd = {$deg}\nmath.degrees(math.radians(d)) == d',
      cases: [
        { id: 'd45', label: '45.0', values: { deg: '45' } },
        { id: 'd30', label: '30.0', values: { deg: '30' } },
        { id: 'd01', label: '0.1',  values: { deg: '0.1' } },
      ],
    },
  ],
  demoExplainer: 'math.degrees(math.pi) is exactly 180.0 and radians(180.0) is exactly math.pi. Other values pass through two roundings: 45.0 survives the round trip, 30.0 does not. Of the whole degrees 0 to 360, 38 come back changed.',

  patterns: [
    {
      name: 'Normalize an angle',
      desc: 'Into [0, 360).',
      code: 'angle = angle % 360',
    },
    {
      name: 'Compass bearing from a vector',
      desc: 'atan2 gives radians in (-π, π].',
      code: 'import math\nbearing = math.degrees(math.atan2(dx, dy)) % 360',
    },
  ],

  examples: [
    { title: '180 degrees is pi',   code: 'import math\nmath.radians(180)',   returns: '3.141592653589793' },
    { title: 'One radian',          code: 'import math\nmath.degrees(1)',     returns: '57.29577951308232' },
    { title: 'pi radians',          code: 'import math\nmath.degrees(math.pi)', returns: '180.0' },
    { title: 'Right angle',         code: 'import math\nmath.radians(90)',    returns: '1.5707963267948966' },
    { title: 'Not always a perfect round trip', code: 'import math\nmath.degrees(math.radians(30))', returns: '29.999999999999996' },
  ],

  pitfalls: [
    {
      name: 'Comparing converted angles with ==',
      desc: 'Two roundings can move the last digit; compare with a tolerance.',
      wrong: { label: '==', code: 'import math\nmath.degrees(math.radians(30)) == 30', output: 'False' },
      fix:   { label: 'isclose', code: 'import math\nmath.isclose(math.degrees(math.radians(30)), 30)', output: 'True' },
    },
    {
      name: 'Forgetting to convert',
      desc: 'Trig functions read the number as radians.',
      wrong: { label: 'cos(60)', code: 'import math\nmath.cos(60)', output: '-0.9524129804151563' },
      fix:   { label: 'cos(radians(60))', code: 'import math\nmath.cos(math.radians(60))', output: '0.5000000000000001' },
    },
  ],

  when: {
    use: ['Any time angles come from or go to people (degrees) and math functions (radians)'],
    avoid: ['Exact angle arithmetic → keep angles as fractions of a turn and convert once'],
  },

  notes: {
    cpython:    'math_degrees_impl returns x * (180.0 / Py_MATH_PI); math_radians_impl returns x * (Py_MATH_PI / 180.0) — one multiplication by a rounded constant',
    'Platform': 'Pure multiplication: identical results on every platform',
  },

  related: [
    { name: 'sin / cos / tan', slug: 'sin-cos-tan', when: 'Functions that take radians' },
    { name: 'constants', slug: 'constants', when: 'math.pi and math.tau' },
    { name: 'isclose', slug: 'isclose', when: 'Compare converted angles' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert degrees to radians in Python?',
      a: 'math.radians(deg), which multiplies by π/180. The reverse is math.degrees(rad).',
    },
    {
      q: 'Why does math.degrees(math.radians(30)) not return 30?',
      a: 'Both conversions multiply by a rounded constant and round the product. For 30 the two errors do not cancel and the result is 29.999999999999996. Round for display or compare with math.isclose.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#angular-conversion',
    meta:  'Angular conversion',
  },
};
