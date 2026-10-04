// content/reference/python/stdlib/math/isfinite-isinf-isnan.js — math.isfinite / isinf / isnan

export const meta = {
  slug:        'isfinite-isinf-isnan',
  name:        'math.isfinite / isinf / isnan',
  signature:   'math.isfinite(x) · math.isinf(x) · math.isnan(x)',
  blurb:       'Classify a float: a normal finite number, positive or negative infinity, or nan (not a number).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'isinf, isnan: all Python 3 versions · isfinite: 3.2+',
  searchTerms: 'math.isfinite math.isinf math.isnan isfinite isinf isnan check for nan python check infinity is number finite nan != nan float nan detection',
};

export const method = {
  slug:      'isfinite-isinf-isnan',
  name:      'math.isfinite / isinf / isnan',
  signature: 'math.isfinite(x, /) · math.isinf(x, /) · math.isnan(x, /)',
  returns:   { type: 'bool', desc: 'Exactly one of isfinite / isinf / isnan is True for any float.' },

  category:    'math function',
  version:     'isinf, isnan: all Python 3 versions · isfinite: 3.2+',
  hasLiveDemo: true,

  subtitle: 'The only reliable way to find nan: it is not equal to anything, itself included. isfinite is the one-call check that a value is a usable number.',

  covers: ['isfinite', 'isinf', 'isnan'],

  cheat: {
    commonCall: 'math.isnan(x)',
    returns:    'bool',
    replaces:   'x == float("nan") (always False) and x != x tricks',
    watchOut:   'Strings and None raise TypeError: must be real number',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'The value to classify. ints are always finite.' },
  ],

  modes: [
    {
      id: 'classify',
      label: 'classify',
      blurb: 'Parse a float and classify it.',
      params: [{ name: 's', type: 'str', hint: "text for float(): '1.5', 'inf', 'nan'", input: 'text' }],
      template: 'import math\nx = float({$s})\n(math.isfinite(x), math.isinf(x), math.isnan(x))',
      cases: [
        { id: 'num',  label: "'1.5'",   values: { s: '1.5' } },
        { id: 'inf',  label: "'inf'",   values: { s: 'inf' } },
        { id: 'ninf', label: "'-inf'",  values: { s: '-inf' } },
        { id: 'nan',  label: "'nan'",   values: { s: 'nan' } },
        { id: 'big',  label: "'1e309'", values: { s: '1e309' } },
        { id: 'bad',  label: "'abc'",   values: { s: 'abc' } },
      ],
    },
    {
      id: 'nan',
      label: 'nan != nan',
      blurb: 'Equality against itself, the old trick, and isnan.',
      params: [{ name: 's', type: 'str', hint: 'text for float()', input: 'text' }],
      template: 'import math\nx = float({$s})\n(x == x, x != x, math.isnan(x))',
      cases: [
        { id: 'nan', label: "'nan'", values: { s: 'nan' } },
        { id: 'num', label: "'2'",   values: { s: '2' } },
      ],
    },
  ],
  demoExplainer: "'1e309' is beyond the float range, so float() returns inf (no error). 'abc' is not a number at all: float() raises ValueError: could not convert string to float: 'abc'. nan is the only float for which x == x is False.",

  patterns: [
    {
      name: 'Drop nan values',
      desc: 'Keep only real numbers.',
      code: 'import math\nclean = [x for x in values if not math.isnan(x)]',
    },
    {
      name: 'Validate a parsed number',
      desc: 'Reject inf and nan from user input.',
      code: 'import math\nx = float(text)\nif not math.isfinite(x):\n    raise ValueError(f"{text!r} is not a finite number")',
    },
  ],

  examples: [
    { title: 'A normal float',        code: 'import math\n(math.isfinite(1.5), math.isinf(1.5), math.isnan(1.5))', returns: '(True, False, False)' },
    { title: 'Infinity',              code: "import math\nmath.isinf(float('-inf'))", returns: 'True' },
    { title: 'nan',                   code: "import math\nmath.isnan(float('nan'))", returns: 'True' },
    { title: 'inf - inf is nan',      code: 'import math\nmath.isnan(math.inf - math.inf)', returns: 'True' },
    { title: 'ints are finite',       code: 'import math\nmath.isfinite(10 ** 300)', returns: 'True' },
    { title: 'Too big for a float',   code: 'import math\nmath.isfinite(10 ** 400)', returns: 'OverflowError: int too large to convert to float' },
    { title: 'Not a number type',     code: 'import math\nmath.isnan(None)', returns: 'TypeError: must be real number, not NoneType' },
  ],

  pitfalls: [
    {
      name: 'Comparing with nan',
      desc: 'Every comparison with nan is False.',
      wrong: { label: "== float('nan')", code: "x = float('nan')\nx == float('nan')", output: 'False' },
      fix:   { label: 'isnan', code: "import math\nx = float('nan')\nmath.isnan(x)", output: 'True' },
    },
    {
      name: 'Checking only for nan',
      desc: 'inf passes a nan check but breaks averages and plots. isfinite rules out both.',
      wrong: { label: 'not isnan', code: "import math\nx = float('inf')\nnot math.isnan(x)", output: 'True' },
      fix:   { label: 'isfinite', code: "import math\nx = float('inf')\nmath.isfinite(x)", output: 'False' },
    },
  ],

  when: {
    use: ['Validating floats from input, files and computations', 'Filtering missing values encoded as nan'],
    avoid: ['Decimal values → Decimal.is_nan() / is_infinite()'],
  },

  notes: {
    cpython:    'Py_IS_FINITE / Py_IS_INFINITY / Py_IS_NAN on the argument converted to a C double',
    'Platform': 'Identical everywhere',
    'Version':  'isfinite added in 3.2 (docs.python.org)',
  },

  related: [
    { name: 'constants', slug: 'constants', when: 'math.inf and math.nan' },
    { name: 'isclose', slug: 'isclose', when: 'Comparing finite floats' },
    { name: 'float()', slug: 'float', when: "Parsing 'inf' and 'nan'", category: 'functions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check for nan in Python?',
      a: "math.isnan(x). Never x == float('nan'), which is always False. For numbers that might also be infinite, math.isfinite(x) checks both at once.",
    },
    {
      q: 'How do I check if a number is infinite?',
      a: "math.isinf(x) is True for both inf and -inf. x == math.inf only matches positive infinity.",
    },
    {
      q: 'Why does math.isnan raise TypeError for None?',
      a: 'The argument is converted to a float first, and None cannot be. Check for None separately (x is None) before testing for nan.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.isnan',
    meta:  'math.isfinite, math.isinf, math.isnan',
  },
};
