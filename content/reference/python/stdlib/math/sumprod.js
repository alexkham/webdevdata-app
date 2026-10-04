// content/reference/python/stdlib/math/sumprod.js — math.sumprod

export const meta = {
  slug:        'sumprod',
  name:        'math.sumprod',
  signature:   'math.sumprod(p, q)',
  blurb:       'Sum of products of two equal-length iterables — a dot product — computed with extended precision for floats (3.12+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.12+',
  searchTerms: 'math.sumprod sumprod dot product python sum of products weighted sum price times quantity inputs are not the same length extended precision',
};

export const method = {
  slug:      'sumprod',
  name:      'math.sumprod',
  signature: 'math.sumprod(p, q, /)',
  returns:   { type: 'int | float', desc: 'p[0]*q[0] + p[1]*q[1] + … ; an exact int for ints, an accurately rounded float for floats.' },

  category:    'math function',
  version:     'Python 3.12+',
  hasLiveDemo: true,

  subtitle: 'The products and their running total are kept in triple-length precision, so the result is the exact dot product rounded once in ordinary cases — not what a sum of individually rounded products gives. Unequal lengths raise ValueError.',

  covers: ['sumprod'],

  cheat: {
    commonCall: 'math.sumprod(prices, quantities)',
    returns:    'int | float — sumprod([1, 2, 3], [4, 5, 6]) is 32',
    replaces:   'sum(a * b for a, b in zip(p, q))',
    watchOut:   'ValueError: Inputs are not the same length',
  },

  parameters: [
    { name: 'p', type: 'iterable of numbers', required: true, default: null, desc: 'First vector.' },
    { name: 'q', type: 'iterable of numbers', required: true, default: null, desc: 'Second vector, same length.' },
  ],

  modes: [
    {
      id: 'dot',
      label: 'dot product',
      blurb: 'Two comma-separated vectors.',
      params: [
        { name: 'p', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'q', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
      ],
      template: 'import math\nmath.sumprod({$p}, {$q})',
      cases: [
        { id: 'ints',   label: '[1,2,3]·[4,5,6]',  values: { p: '1, 2, 3', q: '4, 5, 6' } },
        { id: 'floats', label: '[0.1,0.2]·[10,10]', values: { p: '0.1, 0.2', q: '10, 10' } },
        { id: 'len',    label: 'unequal lengths',  values: { p: '1, 2', q: '3' } },
      ],
    },
    {
      id: 'compare',
      label: 'vs sum of products',
      blurb: 'Prices times quantities, two ways.',
      params: [
        { name: 'p', type: 'list', hint: 'prices',     input: 'csv-num' },
        { name: 'q', type: 'list', hint: 'quantities', input: 'csv-num' },
      ],
      template: 'import math\np, q = {$p}, {$q}\n(math.sumprod(p, q), sum(a * b for a, b in zip(p, q)))',
      cases: [
        { id: 'prices', label: 'prices × qty', values: { p: '19.99, 5.49, 3.5', q: '3, 2, 10' } },
        { id: 'tenths', label: 'tenths',       values: { p: '0.1, 0.2, 0.3', q: '1, 1, 1' } },
      ],
    },
  ],
  demoExplainer: 'For the prices, the generator expression rounds every product and every addition and happens to land on 105.95; sumprod rounds the exact total of the stored binary values once and gives 105.94999999999999 — the more accurate answer, because the exact total of the stored values (19.99 is stored as 19.98999999999999843…) is just under 105.95. Exact cents need ints or Decimal, not a better float sum.',

  patterns: [
    {
      name: 'Weighted average',
      desc: 'Weights times values over the total weight.',
      code: 'import math\navg = math.sumprod(weights, values) / math.fsum(weights)',
    },
    {
      name: 'Count matches with booleans',
      desc: 'bools count as 0 and 1.',
      code: 'import math\nscore = math.sumprod(flags, points)',
    },
  ],

  examples: [
    { title: 'Dot product of ints',   code: 'import math\nmath.sumprod([1, 2, 3], [4, 5, 6])', returns: '32' },
    { title: 'Floats',                code: 'import math\nmath.sumprod([1.5, 2.5], [2, 4])', returns: '13.0' },
    { title: 'Booleans as weights',   code: 'import math\nmath.sumprod([True, False, True], [10, 20, 30])', returns: '40' },
    { title: 'Empty inputs',          code: 'import math\nmath.sumprod([], [])', returns: '0' },
    { title: 'Lengths must match',    code: 'import math\nmath.sumprod([1, 2], [3])', returns: 'ValueError: Inputs are not the same length' },
  ],

  pitfalls: [
    {
      name: 'zip silently drops extra items',
      desc: 'A hand-written dot product ignores a length mismatch; sumprod reports it.',
      wrong: { label: 'zip', code: 'sum(a * b for a, b in zip([1, 2, 3], [4, 5]))', output: '14' },
      fix:   { label: 'sumprod', code: 'import math\nmath.sumprod([1, 2, 3], [4, 5])', output: 'ValueError: Inputs are not the same length' },
    },
    {
      name: 'Expecting decimal-exact money',
      desc: 'sumprod is accurate for the binary floats you pass — use cents as ints for exact totals.',
      wrong: { label: 'float prices', code: 'import math\nmath.sumprod([19.99, 5.49, 3.5], [3, 2, 10])', output: '105.94999999999999' },
      fix:   { label: 'int cents', code: 'import math\nmath.sumprod([1999, 549, 350], [3, 2, 10])', output: '10595' },
    },
  ],

  when: {
    use: ['Dot products, weighted sums, price × quantity totals', 'Accurate float results without numpy'],
    avoid: ['Large numeric vectors → numpy.dot', 'Python before 3.12 → sum(map(operator.mul, p, q))'],
  },

  notes: {
    cpython:    'math_sumprod_impl: an exact C-long path for ints, a triple-length float path (dl_mul with fma, then compensated sums) for float and float×int pairs, and generic Python arithmetic otherwise',
    'Platform': 'The extended-precision path is plain IEEE arithmetic plus fma: same results everywhere for float inputs. When huge ints are mixed with floats the C long size matters (64-bit on Linux and macOS, 32-bit on Windows), so such inputs can round differently',
    'Version':  'Added in 3.12 (docs.python.org)',
  },

  related: [
    { name: 'fsum', slug: 'fsum', when: 'Accurate sum of one iterable' },
    { name: 'prod', slug: 'prod', when: 'Product of one iterable' },
    { name: 'dist / hypot', slug: 'dist-hypot', when: 'Norms of vectors' },
    { name: 'sum()', slug: 'sum', when: 'Built-in sum', category: 'functions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I compute a dot product in Python without numpy?',
      a: 'math.sumprod(p, q) on Python 3.12+, which is also more accurate for floats. Before 3.12: sum(a * b for a, b in zip(p, q)).',
    },
    {
      q: 'Why does math.sumprod give a different result from sum() of products?',
      a: 'The generator version rounds each product before adding; sumprod keeps the products and the running total in extended precision and rounds once at the end. The two can differ in the last digit; sumprod is the more accurate one.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.sumprod',
    meta:  'math.sumprod',
  },
};
