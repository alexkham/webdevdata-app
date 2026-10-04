// content/reference/python/stdlib/math/nextafter-ulp.js — math.nextafter / ulp

export const meta = {
  slug:        'nextafter-ulp',
  name:        'math.nextafter / ulp',
  signature:   'math.nextafter(x, y, *, steps=None) · math.ulp(x)',
  blurb:       'The neighbouring floats of x, and the gap between them: the unit in the last place.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.9+ (steps 3.12+)',
  searchTerms: 'math.nextafter math.ulp nextafter ulp unit in the last place next float machine epsilon float precision 1e16 + 1 sys.float_info.epsilon float spacing',
};

export const method = {
  slug:      'nextafter-ulp',
  name:      'math.nextafter / ulp',
  signature: 'math.nextafter(x, y, /, *, steps=None) · math.ulp(x, /)',
  returns:   { type: 'float', desc: 'nextafter: the float steps away from x toward y · ulp: the gap above |x|.' },

  category:    'math function',
  version:     'Python 3.9+ (steps 3.12+)',
  hasLiveDemo: true,

  subtitle: 'Floats are spaced evenly within each power of two and the spacing doubles from one power to the next: ulp(1.0) is 2.220446049250313e-16, ulp(1e16) is 2.0 — which is why 1e16 + 1 == 1e16.',

  covers: ['nextafter', 'ulp'],

  cheat: {
    commonCall: 'math.ulp(x), math.nextafter(x, math.inf)',
    returns:    'float — ulp(1.0) is 2.220446049250313e-16',
    replaces:   'sys.float_info.epsilon scaled by hand',
    watchOut:   'steps is keyword-only and must be a non-negative int',
  },

  parameters: [
    { name: 'x',     type: 'int | float', required: true,  default: null,   desc: 'Starting float.' },
    { name: 'y',     type: 'int | float', required: true,  default: null,   desc: 'nextafter: direction (math.inf for up, -math.inf for down).' },
    { name: 'steps', type: 'int',         required: false, default: 'None', desc: 'nextafter, keyword-only (3.12+): how many floats to move; None means 1.' },
  ],

  modes: [
    {
      id: 'neighbours',
      label: 'neighbours',
      blurb: 'The float below, x, the float above, and the gap.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.nextafter(x, -math.inf), x, math.nextafter(x, math.inf), math.ulp(x))',
      cases: [
        { id: 'one',   label: '1.0',   values: { x: '1' } },
        { id: 'e16',   label: '1e16',  values: { x: '1e16' } },
        { id: 'tenth', label: '0.1',   values: { x: '0.1' } },
        { id: 'zero',  label: '0.0',   values: { x: '0' } },
      ],
    },
    {
      id: 'steps',
      label: 'steps',
      blurb: 'Move several floats at once (3.12+).',
      params: [
        { name: 'x', type: 'float', hint: 'start',     input: 'float' },
        { name: 'y', type: 'float', hint: 'direction', input: 'float' },
        { name: 'n', type: 'int',   hint: 'steps',     input: 'number' },
      ],
      template: 'import math\nmath.nextafter({$x}, {$y}, steps={$n})',
      cases: [
        { id: 'two',  label: '1.0 → 2.0, 2', values: { x: '1', y: '2', n: '2' } },
        { id: 'sub',  label: '0.0 → 1.0, 3', values: { x: '0', y: '1', n: '3' } },
        { id: 'none', label: 'steps=0',      values: { x: '1', y: '0', n: '0' } },
        { id: 'neg',  label: 'steps=-1',     values: { x: '1', y: '2', n: '-1' } },
      ],
    },
  ],
  demoExplainer: 'Around 1e16 the floats are 2.0 apart, so 1e16 + 1 rounds back to 1e16. Below 1.0 the spacing is half of what it is above (0.9999999999999999 is the neighbour below). From 0.0 the neighbours are the smallest subnormals, ±5e-324; three steps up is 1.5e-323. A negative steps value raises ValueError: steps must be a non-negative integer.',

  patterns: [
    {
      name: 'Tolerance measured in ulps',
      desc: 'Allow a difference of a few units in the last place.',
      code: 'import math\nok = abs(a - b) <= 4 * math.ulp(max(abs(a), abs(b)))',
    },
    {
      name: 'Strict upper bound',
      desc: 'The largest float below a limit.',
      code: 'import math\nhi = math.nextafter(limit, -math.inf)',
    },
  ],

  examples: [
    { title: 'Next float after 1.0',  code: 'import math\nmath.nextafter(1.0, 2.0)', returns: '1.0000000000000002' },
    { title: 'ulp(1.0) is epsilon',   code: 'import math, sys\nmath.ulp(1.0) == sys.float_info.epsilon', returns: 'True' },
    { title: 'Gap of 2 at 1e16',      code: 'import math\nmath.ulp(1e16)',  returns: '2.0' },
    { title: 'So adding 1 does nothing', code: '1e16 + 1 == 1e16',       returns: 'True' },
    { title: 'Smallest positive float', code: 'import math\nmath.nextafter(0.0, 1.0)', returns: '5e-324' },
    { title: 'Largest finite float',  code: 'import math\nmath.nextafter(math.inf, 0.0)', returns: '1.7976931348623157e+308' },
    { title: 'Several steps (3.12+)', code: 'import math\nmath.nextafter(1.0, math.inf, steps=2)', returns: '1.0000000000000004' },
  ],

  pitfalls: [
    {
      name: 'Counting with large floats',
      desc: 'Above 2**53 not every integer is a float.',
      wrong: { label: 'float counter', code: 'x = 2.0 ** 53\nx + 1 == x', output: 'True' },
      fix:   { label: 'int counter', code: 'x = 2 ** 53\nx + 1 == x', output: 'False' },
    },
    {
      name: 'Passing steps positionally',
      desc: 'steps is keyword-only.',
      wrong: { label: 'positional', code: 'import math\nmath.nextafter(1.0, 2.0, 2)', output: 'TypeError: nextafter() takes exactly 2 positional arguments (3 given)' },
      fix:   { label: 'steps=', code: 'import math\nmath.nextafter(1.0, 2.0, steps=2)', output: '1.0000000000000004' },
    },
  ],

  when: {
    use: ['Reasoning about float precision, tolerances in ulps', 'Open intervals and strict bounds'],
    avoid: ['Ordinary comparisons → math.isclose'],
  },

  notes: {
    cpython:    'nextafter without steps calls the C nextafter; with steps it adds to the 64-bit pattern of the float directly; ulp is nextafter(|x|, inf) - |x| (or the gap below for the largest float)',
    'Platform': 'Exact bit operations: identical everywhere',
    'Versions': 'Both added in 3.9; steps added in 3.12 (docs.python.org)',
  },

  related: [
    { name: 'isclose', slug: 'isclose', when: 'Tolerant comparison' },
    { name: 'modf / frexp / ldexp', slug: 'modf-frexp-ldexp', when: 'Mantissa and exponent' },
    { name: 'fma', slug: 'fma', when: 'One rounding instead of two' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is an ulp?',
      a: '"Unit in the last place": the distance from a float to the next larger one in magnitude. math.ulp(1.0) is 2**-52 = 2.220446049250313e-16, the same as sys.float_info.epsilon.',
    },
    {
      q: 'Why is 1e16 + 1 == 1e16 True?',
      a: 'Between 2**53 and 2**54 floats are 2.0 apart (math.ulp(1e16) is 2.0). 1e16 + 1 lies exactly halfway between 1e16 and the next float and rounds to the even one, 1e16.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.nextafter',
    meta:  'math.nextafter, math.ulp',
  },
};
