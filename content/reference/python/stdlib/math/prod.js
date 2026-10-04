// content/reference/python/stdlib/math/prod.js — math.prod

export const meta = {
  slug:        'prod',
  name:        'math.prod',
  signature:   'math.prod(iterable, *, start=1)',
  blurb:       'Multiply all items of an iterable together — the product counterpart of sum().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'math.prod prod product of list python multiply all elements reduce operator.mul product of a list start parameter empty product 1',
};

export const method = {
  slug:      'prod',
  name:      'math.prod',
  signature: 'math.prod(iterable, /, *, start=1)',
  returns:   { type: 'int | float | …', desc: 'start * item1 * item2 * … — exact for ints, float arithmetic for floats.' },

  category:    'math function',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'Plain left-to-right multiplication, starting from start=1: ints stay exact, floats round at every step, and an empty iterable returns start.',

  covers: ['prod'],

  cheat: {
    commonCall: 'math.prod([2, 3, 4])',
    returns:    '24',
    replaces:   'functools.reduce(operator.mul, items, 1)',
    watchOut:   'start is keyword-only; float products can overflow to inf without an error',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null, desc: 'The factors.' },
    { name: 'start',    type: 'number',   required: false, default: '1',  desc: 'Keyword-only. The initial value, returned for an empty iterable.' },
  ],

  modes: [
    {
      id: 'values',
      label: 'product',
      blurb: 'Comma-separated numbers become a list literal.',
      params: [{ name: 'xs', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'import math\nmath.prod({$xs})',
      cases: [
        { id: 'ints',   label: '1, 2, 3, 4', values: { xs: '1, 2, 3, 4' } },
        { id: 'floats', label: '0.1, 0.2',   values: { xs: '0.1, 0.2' } },
        { id: 'empty',  label: 'empty',      values: { xs: '' } },
        { id: 'big',    label: '1e200, 1e200', values: { xs: '1e200, 1e200' } },
      ],
    },
    {
      id: 'start',
      label: 'start=',
      blurb: 'The product is multiplied into start.',
      params: [
        { name: 'xs',    type: 'list',   hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'start', type: 'number', hint: 'start value',             input: 'auto' },
      ],
      template: 'import math\nmath.prod({$xs}, start={$start})',
      cases: [
        { id: 'ten',   label: '[2, 3], start=10', values: { xs: '2, 3', start: '10' } },
        { id: 'empty', label: '[], start=10',     values: { xs: '',     start: '10' } },
        { id: 'flt',   label: '[2, 3], start=0.5', values: { xs: '2, 3', start: '0.5' } },
      ],
    },
    {
      id: 'factorial',
      label: 'vs factorial',
      blurb: 'The product of 1..n is n!.',
      params: [{ name: 'n', type: 'int', hint: 'n', input: 'number' }],
      template: 'import math\nn = {$n}\nmath.prod(range(1, n + 1)) == math.factorial(n)',
      cases: [
        { id: 'ten', label: '10', values: { n: '10' } },
        { id: 'zero', label: '0', values: { n: '0' } },
      ],
    },
  ],
  demoExplainer: '0.1 * 0.2 is 0.020000000000000004 in floating point. An empty list gives start (1, or 10 when start=10). 1e200 * 1e200 overflows to inf silently — prod does float multiplication, not math.pow, so there is no OverflowError.',

  patterns: [
    {
      name: 'Product of a list',
      desc: 'Python 3.8+.',
      code: 'import math\ntotal = math.prod(factors)',
    },
    {
      name: 'Combined probability of independent events',
      desc: 'Multiply the probabilities.',
      code: 'import math\np_all = math.prod(probabilities)',
    },
    {
      name: 'Number of cells in an n-dimensional grid',
      desc: 'Product of the dimensions.',
      code: 'import math\ncells = math.prod(shape)',
    },
  ],

  examples: [
    { title: 'Product of ints',        code: 'import math\nmath.prod([1, 2, 3, 4])',   returns: '24' },
    { title: 'Empty product is 1',     code: 'import math\nmath.prod([])',             returns: '1' },
    { title: 'With start',             code: 'import math\nmath.prod([2, 3], start=10)', returns: '60' },
    { title: 'A range',                code: 'import math\nmath.prod(range(1, 6))',     returns: '120' },
    { title: 'Floats round',           code: 'import math\nmath.prod([0.1] * 3)',       returns: '0.0010000000000000002' },
    { title: 'Silent float overflow',  code: 'import math\nmath.prod([1e200, 1e200])', returns: 'inf' },
  ],

  pitfalls: [
    {
      name: 'Passing start positionally',
      desc: 'start is keyword-only.',
      wrong: { label: 'positional', code: 'import math\nmath.prod([2, 3], 10)', output: 'TypeError: prod() takes exactly 1 positional argument (2 given)' },
      fix:   { label: 'start=', code: 'import math\nmath.prod([2, 3], start=10)', output: '60' },
    },
    {
      name: 'inf times zero',
      desc: 'An overflowed float product times 0 is nan, not 0.',
      wrong: { label: 'float overflow', code: 'import math\nmath.prod([1e200, 1e200, 0])', output: 'nan' },
      fix:   { label: 'sum of logs', code: 'import math\nmath.fsum(math.log(x) for x in [1e200, 1e200])', output: '921.0340371976183' },
    },
  ],

  when: {
    use: ['Products of ints (exact) and of a few floats', 'Sizes, counts and probabilities'],
    avoid: ['Many small or large floats → add logarithms instead', 'Factorials → math.factorial (much faster)'],
  },

  notes: {
    cpython:    'math_prod_impl keeps a C long while ints fit and a C double for floats, falling back to Python objects (exact ints, or any type with __mul__) otherwise',
    'Types':    'Not only numbers: math.prod([3, "ab"]) is "ababab" — but the docs say it is intended for numeric values',
    'Version':  'Added in 3.8 (docs.python.org)',
  },

  related: [
    { name: 'sum()', slug: 'sum', when: 'The additive counterpart', category: 'functions' },
    { name: 'fsum', slug: 'fsum', when: 'Accurate sums' },
    { name: 'sumprod', slug: 'sumprod', when: 'Sum of pairwise products' },
    { name: 'factorial', slug: 'factorial', when: 'Product of 1..n' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I multiply all elements of a list in Python?',
      a: 'math.prod(my_list) on Python 3.8+. On older versions, functools.reduce(operator.mul, my_list, 1).',
    },
    {
      q: 'What does math.prod return for an empty list?',
      a: 'The start value, 1 by default — the empty product, just as sum([]) is 0.',
    },
    {
      q: 'Why is start keyword-only?',
      a: 'The signature is prod(iterable, /, *, start=1): the iterable must be positional and start must be named, so math.prod(xs, 10) is a TypeError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.prod',
    meta:  'math.prod',
  },
};
