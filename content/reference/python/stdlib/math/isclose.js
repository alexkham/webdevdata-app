// content/reference/python/stdlib/math/isclose.js — math.isclose

export const meta = {
  slug:        'isclose',
  name:        'math.isclose',
  signature:   'math.isclose(a, b, *, rel_tol=1e-09, abs_tol=0.0)',
  blurb:       'Compare two floats with a tolerance instead of ==: relative to their size, absolute, or both.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'math.isclose isclose compare floats python float equality 0.1 + 0.2 == 0.3 tolerance rel_tol abs_tol approximately equal close to zero epsilon comparison',
};

export const method = {
  slug:      'isclose',
  name:      'math.isclose',
  signature: 'math.isclose(a, b, *, rel_tol=1e-09, abs_tol=0.0)',
  returns:   { type: 'bool', desc: 'True if |a - b| ≤ max(rel_tol · max(|a|, |b|), abs_tol).' },

  category:    'math function',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'The default is purely relative (about 9 matching digits), which means nothing is ever close to 0.0 unless you also pass abs_tol. inf is close only to itself; nan to nothing.',

  covers: ['isclose'],

  cheat: {
    commonCall: 'math.isclose(a, b)',
    returns:    'bool — isclose(0.1 + 0.2, 0.3) is True',
    replaces:   'abs(a - b) < 1e-9',
    watchOut:   'Comparing with 0.0 needs abs_tol',
  },

  parameters: [
    { name: 'a, b',    type: 'int | float', required: true,  default: null,    desc: 'The two values.' },
    { name: 'rel_tol', type: 'float',       required: false, default: '1e-09', desc: 'Keyword-only. Allowed difference relative to the larger magnitude.' },
    { name: 'abs_tol', type: 'float',       required: false, default: '0.0',   desc: 'Keyword-only. Allowed absolute difference — needed near zero.' },
  ],

  modes: [
    {
      id: 'sum',
      label: '== vs isclose',
      blurb: 'Add two floats and compare the sum with a third.',
      params: [
        { name: 'a', type: 'float', hint: 'first term',  input: 'float' },
        { name: 'b', type: 'float', hint: 'second term', input: 'float' },
        { name: 'c', type: 'float', hint: 'expected',    input: 'float' },
      ],
      template: 'import math\nx = {$a} + {$b}\n(x, x == {$c}, math.isclose(x, {$c}))',
      cases: [
        { id: 'classic', label: '0.1 + 0.2 vs 0.3', values: { a: '0.1', b: '0.2', c: '0.3' } },
        { id: 'tenths',  label: '0.1 + 0.7 vs 0.8', values: { a: '0.1', b: '0.7', c: '0.8' } },
        { id: 'exact',   label: '0.5 + 0.25',       values: { a: '0.5', b: '0.25', c: '0.75' } },
      ],
    },
    {
      id: 'tol',
      label: 'tolerances',
      blurb: 'Set both tolerances yourself.',
      params: [
        { name: 'a',   type: 'float', hint: 'a',       input: 'float' },
        { name: 'b',   type: 'float', hint: 'b',       input: 'float' },
        { name: 'rel', type: 'float', hint: 'rel_tol', input: 'float' },
        { name: 'abs', type: 'float', hint: 'abs_tol', input: 'float' },
      ],
      template: 'import math\nmath.isclose({$a}, {$b}, rel_tol={$rel}, abs_tol={$abs})',
      cases: [
        { id: 'def',    label: '1 vs 1.0000000001', values: { a: '1', b: '1.0000000001', rel: '1e-9', abs: '0' } },
        { id: 'pct',    label: '100 vs 101, 1%',    values: { a: '100', b: '101', rel: '0.01', abs: '0' } },
        { id: 'zero',   label: '1e-12 vs 0',        values: { a: '1e-12', b: '0', rel: '1e-9', abs: '0' } },
        { id: 'zeroab', label: '1e-12 vs 0, abs',   values: { a: '1e-12', b: '0', rel: '1e-9', abs: '1e-9' } },
        { id: 'neg',    label: 'negative tol',      values: { a: '1', b: '1', rel: '-1', abs: '0' } },
      ],
    },
  ],
  demoExplainer: '0.1 + 0.2 is 0.30000000000000004, so == says False and isclose says True. 0.5 + 0.25 is exact in binary, so both agree. 1e-12 is not close to 0.0 with any relative tolerance — the allowed difference is a fraction of 0 or of 1e-12 — until abs_tol=1e-9 is given. Negative tolerances raise ValueError: tolerances must be non-negative.',

  patterns: [
    {
      name: 'Test assertions for floats',
      desc: 'Pick tolerances that match the precision of the computation.',
      code: 'import math\nassert math.isclose(result, expected, rel_tol=1e-12)',
    },
    {
      name: 'Values that may be near zero',
      desc: 'Combine both tolerances.',
      code: 'import math\nmath.isclose(a, b, rel_tol=1e-9, abs_tol=1e-12)',
    },
    {
      name: 'Percentage tolerance',
      desc: 'Within 1% of each other.',
      code: 'import math\nmath.isclose(measured, target, rel_tol=0.01)',
    },
  ],

  examples: [
    { title: 'The classic',           code: 'import math\nmath.isclose(0.1 + 0.2, 0.3)', returns: 'True' },
    { title: '10 digits apart',       code: 'import math\nmath.isclose(1.0, 1.0000000001)', returns: 'True' },
    { title: '9 digits apart',        code: 'import math\nmath.isclose(1.0, 1.000000001)', returns: 'False' },
    { title: 'Nothing is close to zero by default', code: 'import math\nmath.isclose(1e-12, 0.0)', returns: 'False' },
    { title: '…unless abs_tol is set', code: 'import math\nmath.isclose(1e-12, 0.0, abs_tol=1e-9)', returns: 'True' },
    { title: 'Symmetric',             code: 'import math\n(math.isclose(1.0, 1.1, rel_tol=0.1), math.isclose(1.1, 1.0, rel_tol=0.1))', returns: '(True, True)' },
    { title: 'nan is never close',    code: 'import math\nmath.isclose(math.nan, math.nan)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Comparing a result with 0.0',
      desc: 'A relative tolerance of a zero value is zero.',
      wrong: { label: 'default', code: 'import math\nmath.isclose(math.sin(math.pi), 0.0)', output: 'False' },
      fix:   { label: 'abs_tol', code: 'import math\nmath.isclose(math.sin(math.pi), 0.0, abs_tol=1e-12)', output: 'True' },
    },
    {
      name: 'Passing the tolerance positionally',
      desc: 'rel_tol and abs_tol are keyword-only.',
      wrong: { label: 'positional', code: 'import math\nmath.isclose(1.0, 1.01, 0.1)', output: 'TypeError: isclose() takes exactly 2 positional arguments (3 given)' },
      fix:   { label: 'keyword', code: 'import math\nmath.isclose(1.0, 1.01, rel_tol=0.1)', output: 'True' },
    },
  ],

  when: {
    use: ['Any equality test on computed floats', 'Tests, convergence checks, de-duplication of measurements'],
    avoid: ['Exact money values → decimal.Decimal and ==', 'Whole arrays → numpy.isclose'],
  },

  notes: {
    cpython:    'math_isclose_impl: equal values (including two infinities of the same sign) → True; any other infinity → False; otherwise diff <= rel_tol*|b| or diff <= rel_tol*|a| or diff <= abs_tol',
    'Platform': 'Pure float comparisons: identical everywhere',
    'Version':  'Added in 3.5 (docs.python.org)',
  },

  related: [
    { name: 'isfinite / isinf / isnan', slug: 'isfinite-isinf-isnan', when: 'Classify special values first' },
    { name: 'nextafter / ulp', slug: 'nextafter-ulp', when: 'Tolerances measured in ulps' },
    { name: 'fsum', slug: 'fsum', when: 'Reduce the error before comparing' },
    { name: '== operator', slug: 'eq', when: 'Exact equality', category: 'operators' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is 0.1 + 0.2 == 0.3 False in Python?',
      a: 'None of the three decimals is exactly representable in binary. 0.1 + 0.2 rounds to 0.30000000000000004, a different float from 0.3. Compare with math.isclose, or use decimal for exact decimal arithmetic.',
    },
    {
      q: 'What are good values for rel_tol and abs_tol?',
      a: 'rel_tol around 1e-9 (the default) suits most double-precision results; loosen it for values that went through many operations. Set abs_tol to the smallest difference that matters for your data whenever values can be near zero.',
    },
    {
      q: 'Is math.isclose symmetric?',
      a: 'Yes. The relative tolerance is applied to the larger of |a| and |b|, so isclose(a, b) and isclose(b, a) always give the same answer.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.isclose',
    meta:  'math.isclose',
  },
};
