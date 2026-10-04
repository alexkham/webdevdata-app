// content/reference/python/stdlib/math/constants.js — math.pi, e, tau, inf, nan

export const meta = {
  slug:        'constants',
  name:        'math.pi / e / tau / inf / nan',
  signature:   'math.pi · math.e · math.tau · math.inf · math.nan',
  blurb:       'The five float constants of the math module: π, Euler’s number, τ = 2π, positive infinity and not-a-number.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'pi and e: all versions · inf, nan: 3.5+ · tau: 3.6+',
  searchTerms: 'math.pi math.e math.tau math.inf math.nan pi e tau inf nan python pi constant infinity not a number float inf float nan euler number 3.14159',
};

export const method = {
  slug:      'constants',
  name:      'math.pi / e / tau / inf / nan',
  signature: 'math.pi · math.e · math.tau · math.inf · math.nan',
  returns:   { type: 'float', desc: 'Each constant is a plain float.' },

  category:    'math constant',
  version:     'pi and e: all versions · inf, nan: 3.5+ · tau: 3.6+',
  hasLiveDemo: true,

  subtitle: 'π and e to the 17 significant digits a float can hold, plus the two special floats: inf compares larger than every number, and nan is not equal to anything — not even itself.',

  covers: ['pi', 'e', 'tau', 'inf', 'nan'],

  cheat: {
    commonCall: 'math.pi * r ** 2',
    returns:    'float — pi is 3.141592653589793',
    replaces:   "float('inf'), float('nan') and hand-typed 3.14159",
    watchOut:   'nan == nan is False: test with math.isnan()',
  },

  parameters: [],

  modes: [
    {
      id: 'value',
      label: 'values',
      blurb: 'Look up a constant by name: pi, e, tau, inf or nan.',
      params: [{ name: 'name', type: 'str', hint: 'pi, e, tau, inf, nan', input: 'text' }],
      template: 'import math\ngetattr(math, {$name})',
      cases: [
        { id: 'pi',  label: 'pi',  values: { name: 'pi' } },
        { id: 'e',   label: 'e',   values: { name: 'e' } },
        { id: 'tau', label: 'tau', values: { name: 'tau' } },
        { id: 'inf', label: 'inf', values: { name: 'inf' } },
        { id: 'nan', label: 'nan', values: { name: 'nan' } },
      ],
    },
    {
      id: 'special',
      label: 'inf and nan',
      blurb: 'Parse a float and compare it with math.inf and with itself.',
      params: [{ name: 's', type: 'str', hint: "text for float(): 'inf', 'nan', '1e309'", input: 'text' }],
      template: 'import math\nx = float({$s})\n(x == math.inf, math.isinf(x), x == x, math.isnan(x))',
      cases: [
        { id: 'inf',  label: "'inf'",   values: { s: 'inf' } },
        { id: 'ninf', label: "'-inf'",  values: { s: '-inf' } },
        { id: 'nan',  label: "'nan'",   values: { s: 'nan' } },
        { id: 'big',  label: "'1e309'", values: { s: '1e309' } },
        { id: 'num',  label: "'2.5'",   values: { s: '2.5' } },
      ],
    },
    {
      id: 'circle',
      label: 'circle',
      blurb: 'Area with pi, circumference with tau.',
      params: [{ name: 'r', type: 'float', hint: 'radius', input: 'float' }],
      template: 'import math\nr = {$r}\n(math.pi * r ** 2, math.tau * r)',
      cases: [
        { id: 'one',  label: 'r = 1', values: { r: '1' } },
        { id: 'two',  label: 'r = 2', values: { r: '2' } },
        { id: 'half', label: 'r = 0.5', values: { r: '0.5' } },
      ],
    },
  ],
  demoExplainer: "float('1e309') is too large for a float, so it becomes inf without an error. nan is the only value for which x == x is False, which is why math.isnan exists. With r = 2 the area and the circumference are both 12.566370614359172.",

  patterns: [
    {
      name: 'Start a running minimum',
      desc: 'Every number compares less than inf.',
      code: 'import math\nbest = math.inf\nfor cost in costs:\n    best = min(best, cost)',
    },
    {
      name: 'Mark missing data',
      desc: 'nan propagates through arithmetic; filter it out with isnan.',
      code: 'import math\nvalid = [x for x in readings if not math.isnan(x)]',
    },
    {
      name: 'Full turn in radians',
      desc: 'tau is one full circle.',
      code: 'import math\nangle = math.tau * fraction_of_turn',
    },
  ],

  examples: [
    { title: 'pi',                       code: 'import math\nmath.pi',            returns: '3.141592653589793' },
    { title: 'e',                        code: 'import math\nmath.e',             returns: '2.718281828459045' },
    { title: 'tau is 2 * pi',            code: 'import math\nmath.tau == 2 * math.pi', returns: 'True' },
    { title: "inf is float('inf')",      code: "import math\nmath.inf == float('inf')", returns: 'True' },
    { title: 'Every number is below inf', code: 'import math\n10 ** 400 < math.inf', returns: 'True' },
    { title: 'nan is not equal to itself', code: 'import math\nmath.nan == math.nan', returns: 'False' },
    { title: 'inf - inf is nan',         code: 'import math\nmath.inf - math.inf', returns: 'nan' },
  ],

  pitfalls: [
    {
      name: 'Testing for nan with ==',
      desc: 'Comparisons with nan are always False, so == never finds it.',
      wrong: { label: '== nan',  code: 'import math\nx = float("nan")\nx == math.nan', output: 'False' },
      fix:   { label: 'isnan',   code: 'import math\nx = float("nan")\nmath.isnan(x)', output: 'True' },
    },
    {
      name: 'nan in a list breaks max and sorting',
      desc: 'Every comparison with nan is False, so the result depends on where nan sits.',
      wrong: { label: 'max with nan first', code: 'import math\nmax([math.nan, 1.0, 2.0])', output: 'nan' },
      fix:   { label: 'filter first', code: 'import math\nmax(x for x in [math.nan, 1.0, 2.0] if not math.isnan(x))', output: '2.0' },
    },
  ],

  when: {
    use: ['Formulas with π, e or a full turn', 'Sentinels: inf as an initial minimum or an unbounded limit', 'nan for missing numeric data'],
    avoid: ['More digits of π → decimal or a library such as mpmath', 'None-vs-number checks → use None, not nan, for "no value" in non-numeric code'],
  },

  notes: {
    cpython:   'Module-level floats set in Modules/mathmodule.c: pi, e and tau from Py_MATH_PI, Py_MATH_E and Py_MATH_TAU, inf and nan from Py_INFINITY and Py_NAN',
    'Digits':  'repr shows the shortest string that round-trips: 3.141592653589793 is the double closest to π, not π itself',
    'Versions': 'inf and nan were added in 3.5, tau in 3.6 (docs.python.org)',
  },

  related: [
    { name: 'isfinite / isinf / isnan', slug: 'isfinite-isinf-isnan', when: 'Test for inf and nan' },
    { name: 'degrees / radians', slug: 'degrees-radians', when: 'Convert with pi / 180' },
    { name: 'float()', slug: 'float', when: "float('inf') and float('nan') do the same", category: 'functions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get pi in Python?',
      a: 'import math and use math.pi (3.141592653589793). numpy.pi is the same value. For more digits than a float holds use decimal or mpmath.',
    },
    {
      q: 'How do I represent infinity in Python?',
      a: "math.inf or float('inf'); negative infinity is -math.inf. It compares greater than every int and float, and math.isinf() tests for it.",
    },
    {
      q: 'Why is math.nan == math.nan False?',
      a: 'IEEE 754 defines nan as unordered: every comparison involving nan is False, including with itself. Use math.isnan(x) — or x != x — to detect it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.pi',
    meta:  'math.pi, math.e, math.tau, math.inf, math.nan',
  },
};
