// content/reference/python/stdlib/math/fsum.js — math.fsum

export const meta = {
  slug:        'fsum',
  name:        'math.fsum',
  signature:   'math.fsum(iterable)',
  blurb:       'The correctly rounded sum of floats — as if every addition were exact. Compared with a += loop and with built-in sum().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'math.fsum fsum accurate sum floats python sum 0.1 floating point sum error 0.1 + 0.2 + 0.3 0.6000000000000001 sum vs fsum kahan neumaier compensated summation shewchuk intermediate overflow in fsum',
};

export const method = {
  slug:      'fsum',
  name:      'math.fsum',
  signature: 'math.fsum(seq, /)',
  returns:   { type: 'float', desc: 'The exact sum of all values, rounded once to the nearest float.' },

  category:    'math function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'A plain loop rounds after every +=; sum() has compensated for that since 3.12; fsum tracks the exact sum and rounds once. For most data sum() now agrees with fsum — the differences show up with wildly different magnitudes.',

  covers: ['fsum'],

  cheat: {
    commonCall: 'math.fsum(values)',
    returns:    'float — fsum([0.1, 0.2, 0.3]) is 0.6',
    replaces:   'for-loop totals and sum() where every bit matters',
    watchOut:   'Always returns a float (ints are converted); an inf and a -inf raise ValueError',
  },

  parameters: [
    { name: 'seq', type: 'iterable of numbers', required: true, default: null, desc: 'Any iterable of ints and floats (ints must fit in a float).' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'loop vs sum vs fsum',
      blurb: 'Comma-separated numbers, totalled three ways.',
      params: [{ name: 'xs', type: 'str', hint: 'comma-separated numbers', input: 'text' }],
      template: "import math\nxs = [float(x) for x in {$xs}.split(',')]\ntotal = 0.0\nfor x in xs:\n    total += x\n(total, sum(xs), math.fsum(xs))",
      cases: [
        { id: 'tenths', label: '0.1, 0.2, 0.3',      values: { xs: '0.1, 0.2, 0.3' } },
        { id: 'mag',    label: '1e16, 1, 1e-16',     values: { xs: '1e16, 1, 1e-16' } },
        { id: 'cancel', label: '1e100, 1, -1e100',   values: { xs: '1e100, 1, -1e100' } },
        { id: 'over',   label: '1e308, 1e308, -1e308', values: { xs: '1e308, 1e308, -1e308' } },
      ],
    },
    {
      id: 'repeat',
      label: 'repeated value',
      blurb: 'n copies of x: sum, fsum, and plain multiplication.',
      params: [
        { name: 'x', type: 'float', hint: 'value',  input: 'float' },
        { name: 'n', type: 'int',   hint: 'copies', input: 'number' },
      ],
      template: 'import math\nxs = [{$x}] * {$n}\n(sum(xs), math.fsum(xs), {$x} * {$n})',
      cases: [
        { id: 'ten',   label: '0.1 × 10', values: { x: '0.1', n: '10' } },
        { id: 'three', label: '0.1 × 3',  values: { x: '0.1', n: '3' } },
        { id: 'empty', label: '0.1 × 0',  values: { x: '0.1', n: '0' } },
      ],
    },
  ],
  demoExplainer: 'With 0.1, 0.2, 0.3 the loop gives 0.6000000000000001 while sum() and fsum() give 0.6. With 1e16, 1 and 1e-16 only fsum returns 1.0000000000000002e+16: the exact total is just above the halfway point between two floats, and only exact tracking sees the 1e-16. 1e100, 1, -1e100 loses the 1 in the loop (0.0). fsum raises OverflowError: intermediate overflow in fsum when a partial sum overflows, even if later terms would bring it back.',

  patterns: [
    {
      name: 'Accurate mean',
      desc: 'fsum for the total, then one division.',
      code: 'import math\nmean = math.fsum(values) / len(values)',
    },
    {
      name: 'Totals of money in floats',
      desc: 'Better: store cents as ints, or use Decimal.',
      code: 'total_cents = sum(cents)',
    },
  ],

  examples: [
    { title: 'Exactly rounded',         code: 'import math\nmath.fsum([0.1, 0.2, 0.3])', returns: '0.6' },
    { title: 'Left-to-right addition',  code: '0.1 + 0.2 + 0.3',                         returns: '0.6000000000000001' },
    { title: 'sum() compensates (3.12+)', code: 'sum([0.1] * 10)',                        returns: '1.0' },
    { title: 'Where sum() and fsum differ', code: 'import math\n(sum([1e16, 1.0, 1e-16]), math.fsum([1e16, 1.0, 1e-16]))', returns: '(1e+16, 1.0000000000000002e+16)' },
    { title: 'Always a float',          code: 'import math\nmath.fsum([1, 2, 3])',       returns: '6.0' },
    { title: 'inf + -inf',              code: 'import math\nmath.fsum([math.inf, -math.inf])', returns: 'ValueError: -inf + inf in fsum' },
    { title: 'Intermediate overflow',   code: 'import math\nmath.fsum([1e308, 1e308, -1e308])', returns: 'OverflowError: intermediate overflow in fsum' },
  ],

  pitfalls: [
    {
      name: 'Totalling with a += loop',
      desc: 'Each += rounds; small terms vanish next to big ones.',
      wrong: { label: 'loop', code: 'total = 0.0\nfor x in [1e100, 1.0, -1e100]:\n    total += x\ntotal', output: '0.0' },
      fix:   { label: 'fsum', code: 'import math\nmath.fsum([1e100, 1.0, -1e100])', output: '1.0' },
    },
    {
      name: 'Expecting fsum to fix decimal representation',
      desc: 'fsum rounds the exact sum of the binary values. 1.1 is already not 1.1, so three of them are not 3.3.',
      wrong: { label: 'fsum == 3.3', code: 'import math\nmath.fsum([1.1, 1.1, 1.1]) == 3.3', output: 'False' },
      fix:   { label: 'Decimal', code: "from decimal import Decimal\nsum([Decimal('1.1')] * 3)", output: "Decimal('3.3')" },
    },
  ],

  when: {
    use: ['Totals that must be exactly reproducible regardless of order', 'Data with mixed magnitudes and cancellation'],
    avoid: ['Ints → sum() (exact, stays int)', 'Decimal money → sum() of Decimal values'],
  },

  notes: {
    cpython:    'math_fsum keeps a list of non-overlapping partial sums (Shewchuk’s algorithm, as in Raymond Hettinger’s msum recipe) and adds them exactly at the end with half-even rounding',
    'sum()':    'Since 3.12 the built-in sum() uses Neumaier’s compensated summation for floats; it is very close to fsum but not exact in every case',
    'Platform': 'Pure IEEE 754 additions: identical everywhere',
  },

  related: [
    { name: 'sum()', slug: 'sum', when: 'Built-in sum, compensated for floats since 3.12', category: 'functions' },
    { name: 'sumprod', slug: 'sumprod', when: 'Accurate sum of products' },
    { name: 'prod', slug: 'prod', when: 'Product of an iterable' },
    { name: 'isclose', slug: 'isclose', when: 'Compare totals' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does sum() of floats give a different result than expected?',
      a: 'Floats are binary approximations; every addition rounds. Since Python 3.12 sum() compensates for most of that (sum([0.1] * 10) is 1.0), and math.fsum returns the correctly rounded exact total. Neither changes the fact that 0.1 is not exactly 1/10.',
    },
    {
      q: 'What is the difference between sum() and math.fsum()?',
      a: 'sum() keeps ints as ints and, for floats, uses compensated summation (3.12+); it can still differ from the exact result in the last digit. fsum always returns a float that is the exact sum rounded once.',
    },
    {
      q: 'Is math.fsum slower than sum()?',
      a: 'Yes, it does more work per item, but it is implemented in C and still fast. Use it where reproducible, exact totals matter.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.fsum',
    meta:  'math.fsum',
  },
};
