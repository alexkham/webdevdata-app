// content/reference/python/stdlib/math/dist-hypot.js — math.dist / hypot

export const meta = {
  slug:        'dist-hypot',
  name:        'math.dist / hypot',
  signature:   'math.dist(p, q) · math.hypot(*coordinates)',
  blurb:       'Euclidean distance between two points and length of a vector, in any number of dimensions — without overflow or underflow in the squares.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'hypot: all versions (n-D 3.8+) · dist: 3.8+',
  searchTerms: 'math.dist math.hypot dist hypot euclidean distance python distance between two points vector length norm pythagorean theorem hypotenuse 3 4 5 both points must have the same number of dimensions',
};

export const method = {
  slug:      'dist-hypot',
  name:      'math.dist / hypot',
  signature: 'math.dist(p, q, /) · math.hypot(*coordinates)',
  returns:   { type: 'float', desc: 'sqrt(sum of squares), almost always correctly rounded.' },

  category:    'math function',
  version:     'hypot: all versions (n-D 3.8+) · dist: 3.8+',
  hasLiveDemo: true,

  subtitle: 'hypot(x, y, …) is the length of a vector; dist(p, q) is hypot of the coordinate differences. Both scale the values first, so 1e200 and 1e-200 work where sqrt(x*x + y*y) overflows or underflows.',

  covers: ['dist', 'hypot'],

  cheat: {
    commonCall: 'math.dist((x1, y1), (x2, y2))',
    returns:    'float — dist((0, 0), (3, 4)) is 5.0',
    replaces:   'math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)',
    watchOut:   'dist needs two points of the same dimension',
  },

  parameters: [
    { name: 'p, q',         type: 'sequence of numbers', required: true,  default: null, desc: 'dist: the two points (any iterables of equal length).' },
    { name: '*coordinates', type: 'int | float',         required: false, default: null, desc: 'hypot: the vector components; hypot() is 0.0.' },
  ],

  modes: [
    {
      id: 'dist',
      label: 'dist',
      blurb: 'Two points as comma-separated coordinates.',
      params: [
        { name: 'p', type: 'list', hint: 'point p', input: 'csv-num' },
        { name: 'q', type: 'list', hint: 'point q', input: 'csv-num' },
      ],
      template: 'import math\nmath.dist({$p}, {$q})',
      cases: [
        { id: 'p345', label: '(0,0)–(3,4)',     values: { p: '0, 0', q: '3, 4' } },
        { id: 'd3',   label: '3-D',             values: { p: '1, 2, 3', q: '4, 6, 8' } },
        { id: 'bad',  label: '2-D vs 3-D',      values: { p: '1, 2', q: '1, 2, 3' } },
      ],
    },
    {
      id: 'hypot',
      label: 'hypot',
      blurb: 'Vector components, unpacked into hypot.',
      params: [{ name: 'xs', type: 'list', hint: 'components', input: 'csv-num' }],
      template: 'import math\nmath.hypot(*{$xs})',
      cases: [
        { id: 'p34',  label: '3, 4',         values: { xs: '3, 4' } },
        { id: 'p122', label: '1, 2, 2',      values: { xs: '1, 2, 2' } },
        { id: 'huge', label: '1e200, 1e200', values: { xs: '1e200, 1e200' } },
        { id: 'none', label: 'no args',      values: { xs: '' } },
      ],
    },
    {
      id: 'naive',
      label: 'vs the formula',
      blurb: 'sqrt(x*x + y*y) against hypot(x, y).',
      params: [
        { name: 'x', type: 'float', hint: 'x', input: 'float' },
        { name: 'y', type: 'float', hint: 'y', input: 'float' },
      ],
      template: 'import math\nx, y = {$x}, {$y}\n(math.sqrt(x * x + y * y), math.hypot(x, y))',
      cases: [
        { id: 'p34',  label: '3, 4',           values: { x: '3', y: '4' } },
        { id: 'big',  label: '1e200, 1e200',   values: { x: '1e200', y: '1e200' } },
        { id: 'tiny', label: '1e-200, 1e-200', values: { x: '1e-200', y: '1e-200' } },
      ],
    },
  ],
  demoExplainer: 'For 1e200 the squares overflow to inf, so the formula returns inf; for 1e-200 they underflow to 0.0 and the formula returns 0.0. hypot gives 1.414213562373095e+200 and 1.414213562373095e-200. dist of a 2-D and a 3-D point raises ValueError: both points must have the same number of dimensions.',

  patterns: [
    {
      name: 'Nearest point',
      desc: 'min with dist as the key.',
      code: 'import math\nnearest = min(points, key=lambda p: math.dist(p, target))',
    },
    {
      name: 'Length of a vector',
      desc: 'Unpack a sequence of components.',
      code: 'import math\nlength = math.hypot(*vector)',
    },
    {
      name: 'Normalize a vector',
      desc: 'Divide each component by the length.',
      code: 'import math\nn = math.hypot(*v)\nunit = [c / n for c in v]',
    },
  ],

  examples: [
    { title: '3-4-5 triangle',          code: 'import math\nmath.hypot(3, 4)',              returns: '5.0' },
    { title: 'Distance in 2-D',         code: 'import math\nmath.dist((0, 0), (3, 4))',     returns: '5.0' },
    { title: 'Distance in 3-D',         code: 'import math\nmath.dist([1, 2, 3], [4, 6, 8])', returns: '7.0710678118654755' },
    { title: 'Any number of components', code: 'import math\nmath.hypot(1, 2, 2)',          returns: '3.0' },
    { title: 'No overflow',             code: 'import math\nmath.hypot(1e200, 1e200)',      returns: '1.414213562373095e+200' },
    { title: 'Dimensions must match',   code: 'import math\nmath.dist((1, 2), (1, 2, 3))',  returns: 'ValueError: both points must have the same number of dimensions' },
  ],

  pitfalls: [
    {
      name: 'Squaring large or small coordinates yourself',
      desc: 'x * x overflows above about 1.3e154 and underflows below about 1e-162.',
      wrong: { label: 'sqrt of squares', code: 'import math\nmath.sqrt(1e200 * 1e200 + 1e200 * 1e200)', output: 'inf' },
      fix:   { label: 'hypot', code: 'import math\nmath.hypot(1e200, 1e200)', output: '1.414213562373095e+200' },
    },
    {
      name: 'Passing the points to hypot',
      desc: 'hypot takes components, dist takes points.',
      wrong: { label: 'hypot(p, q)', code: 'import math\nmath.hypot((0, 0), (3, 4))', output: 'TypeError: must be real number, not tuple' },
      fix:   { label: 'dist(p, q)', code: 'import math\nmath.dist((0, 0), (3, 4))', output: '5.0' },
    },
  ],

  when: {
    use: ['Distances and vector lengths in any dimension', 'Coordinates of extreme magnitude'],
    avoid: ['Many points at once → numpy / scipy.spatial', 'Distances on Earth → a great-circle (haversine) formula'],
  },

  notes: {
    cpython:    'vector_norm() in Modules/mathmodule.c: scales by a power of two, squares exactly (fma), sums with compensation and applies a correction step to the square root — accurate to within 1 ulp and nearly always correctly rounded',
    'Platform': 'IEEE arithmetic plus fma and sqrt: identical results everywhere',
    'Versions': 'hypot accepts any number of coordinates since 3.8; dist added in 3.8 (docs.python.org)',
  },

  related: [
    { name: 'sqrt / isqrt / cbrt', slug: 'sqrt-isqrt-cbrt', when: 'Square roots' },
    { name: 'sumprod', slug: 'sumprod', when: 'Dot products' },
    { name: 'sin / cos / tan', slug: 'sin-cos-tan', when: 'atan2 for the direction' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I calculate the distance between two points in Python?',
      a: 'math.dist(p, q) on Python 3.8+, for points of any dimension: math.dist((0, 0), (3, 4)) is 5.0. Before 3.8: math.hypot(x2 - x1, y2 - y1).',
    },
    {
      q: 'Why use math.hypot instead of sqrt(x**2 + y**2)?',
      a: 'hypot avoids overflow and underflow of the squares and is more accurate (almost always correctly rounded). The formula fails for coordinates above about 1e154.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.dist',
    meta:  'math.dist, math.hypot',
  },
};
