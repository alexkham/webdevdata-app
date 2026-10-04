// content/reference/python/stdlib/math/comb-perm.js — math.comb / perm

export const meta = {
  slug:        'comb-perm',
  name:        'math.comb / perm',
  signature:   'math.comb(n, k) · math.perm(n, k=None)',
  blurb:       'Number of ways to choose k of n items: without order (combinations, n choose k) and with order (permutations). Exact ints of any size.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'math.comb math.perm comb perm combinations permutations n choose k binomial coefficient python nCr nPr lottery odds number of ways k must be a non-negative integer',
};

export const method = {
  slug:      'comb-perm',
  name:      'math.comb / perm',
  signature: 'math.comb(n, k, /) · math.perm(n, k=None, /)',
  returns:   { type: 'int', desc: 'The exact count; 0 when k > n.' },

  category:    'math function',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'comb(n, k) = n! / (k! (n-k)!) counts subsets, perm(n, k) = n! / (n-k)! counts ordered arrangements. Both are exact, return 0 when k > n, and want real ints.',

  covers: ['comb', 'perm'],

  cheat: {
    commonCall: 'math.comb(52, 5)',
    returns:    'int — 2598960',
    replaces:   'factorial(n) // (factorial(k) * factorial(n - k)) and itertools counting',
    watchOut:   'Floats such as 5.0 raise TypeError; negatives raise ValueError',
  },

  parameters: [
    { name: 'n', type: 'int', required: true,  default: null,   desc: 'Number of items, ≥ 0.' },
    { name: 'k', type: 'int', required: true,  default: null,   desc: 'How many to pick, ≥ 0. perm: omit (or None) for all n — that is n!.' },
  ],

  modes: [
    {
      id: 'count',
      label: 'comb vs perm',
      blurb: 'Subsets vs ordered arrangements of k items out of n.',
      params: [
        { name: 'n', type: 'int', hint: 'items',        input: 'number' },
        { name: 'k', type: 'int', hint: 'picked',       input: 'number' },
      ],
      template: 'import math\nn, k = {$n}, {$k}\n(math.comb(n, k), math.perm(n, k))',
      cases: [
        { id: 'small', label: '5, 2',  values: { n: '5',  k: '2' } },
        { id: 'poker', label: '52, 5', values: { n: '52', k: '5' } },
        { id: 'more',  label: '3, 5',  values: { n: '3',  k: '5' } },
        { id: 'negk',  label: '5, -1', values: { n: '5',  k: '-1' } },
      ],
    },
    {
      id: 'odds',
      label: 'lottery odds',
      blurb: 'One ticket among all possible draws, with thousands separators.',
      params: [
        { name: 'n', type: 'int', hint: 'numbers in the pool', input: 'number' },
        { name: 'k', type: 'int', hint: 'numbers drawn',       input: 'number' },
      ],
      template: 'import math\nf"1 in {math.comb({$n}, {$k}):,}"',
      cases: [
        { id: 'l649', label: '6 of 49', values: { n: '49', k: '6' } },
        { id: 'l570', label: '5 of 70', values: { n: '70', k: '5' } },
      ],
    },
    {
      id: 'all',
      label: 'perm(n)',
      blurb: 'Without k, perm counts all orderings: n!.',
      params: [{ name: 'n', type: 'int', hint: 'items', input: 'number' }],
      template: 'import math\nmath.perm({$n})',
      cases: [
        { id: 'five', label: '5',  values: { n: '5' } },
        { id: 'ten',  label: '10', values: { n: '10' } },
      ],
    },
  ],
  demoExplainer: 'A poker hand is one of comb(52, 5) = 2598960 subsets; dealt in order there are perm(52, 5) = 311875200 sequences — 5! = 120 times as many. Choosing more items than exist is not an error: comb(3, 5) is 0. A negative k raises ValueError: k must be a non-negative integer.',

  patterns: [
    {
      name: 'Probability of an exact draw',
      desc: 'Favourable outcomes over all outcomes, as an exact Fraction.',
      code: 'import math\nfrom fractions import Fraction\np = Fraction(1, math.comb(49, 6))',
    },
    {
      name: 'Binomial probability',
      desc: 'k successes in n trials with probability p.',
      code: 'import math\nprob = math.comb(n, k) * p ** k * (1 - p) ** (n - k)',
    },
    {
      name: 'Row of Pascal’s triangle',
      desc: 'All coefficients of (a + b)**n.',
      code: 'import math\nrow = [math.comb(n, k) for k in range(n + 1)]',
    },
  ],

  examples: [
    { title: '5 choose 2',               code: 'import math\nmath.comb(5, 2)',  returns: '10' },
    { title: 'Ordered: 5 pick 2',        code: 'import math\nmath.perm(5, 2)',  returns: '20' },
    { title: 'perm(n) is n!',            code: 'import math\nmath.perm(5)',     returns: '120' },
    { title: 'k > n gives 0',            code: 'import math\nmath.comb(3, 5)',  returns: '0' },
    { title: 'Exact for big n',          code: 'import math\nmath.comb(100, 50)', returns: '100891344545564193334812497256' },
    { title: 'Floats are rejected',      code: 'import math\nmath.comb(5, 2.0)', returns: "TypeError: 'float' object cannot be interpreted as an integer" },
    { title: 'Negative n',               code: 'import math\nmath.comb(-5, 2)', returns: 'ValueError: n must be a non-negative integer' },
  ],

  pitfalls: [
    {
      name: 'Computing nCr with floats',
      desc: 'Float division of factorials loses digits once the numbers pass 2**53.',
      wrong: { label: 'factorial ratio as float', code: 'import math\nint(math.factorial(100) / (math.factorial(50) * math.factorial(50)))', output: '100891344545564202071714955264' },
      fix:   { label: 'math.comb', code: 'import math\nmath.comb(100, 50)', output: '100891344545564193334812497256' },
    },
    {
      name: 'Passing a float count',
      desc: 'Results of / are floats even when whole; convert with int() or use //.',
      wrong: { label: 'n / 2', code: 'import math\nn = 10\nmath.comb(n, n / 2)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'n // 2', code: 'import math\nn = 10\nmath.comb(n, n // 2)', output: '252' },
    },
  ],

  when: {
    use: ['Counting subsets and arrangements', 'Exact probabilities and binomial coefficients'],
    avoid: ['Listing the actual combinations → itertools.combinations / permutations', 'Approximate huge values → math.lgamma'],
  },

  notes: {
    cpython:    'perm_comb_small() in Modules/mathmodule.c uses 64-bit arithmetic and tables of odd parts of factorials for small n; larger arguments use a divide-and-conquer product. The result is always exact',
    'Errors':   'TypeError for non-ints (5.0 included); ValueError "n must be a non-negative integer" / "k must be a non-negative integer"',
    'Version':  'Added in 3.8 (docs.python.org)',
  },

  related: [
    { name: 'factorial', slug: 'factorial', when: 'n!' },
    { name: 'prod', slug: 'prod', when: 'Product of a range' },
    { name: 'erf / gamma / lgamma', slug: 'erf-gamma', when: 'lgamma for logs of huge counts' },
    { name: 'TypeError', slug: 'typeerror', when: 'What a float k raises', category: 'exceptions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I calculate n choose k in Python?',
      a: 'math.comb(n, k) on Python 3.8+. It returns an exact int: math.comb(52, 5) is 2598960. On older versions, factorial(n) // (factorial(k) * factorial(n - k)) with integer division.',
    },
    {
      q: 'What is the difference between math.comb and math.perm?',
      a: 'comb ignores order (which items), perm counts order (which items in which sequence). perm(n, k) == comb(n, k) * factorial(k).',
    },
    {
      q: 'Why does math.comb raise TypeError for 5.0?',
      a: 'comb and perm require ints and do not accept floats even when they are whole numbers. Convert with int(), or use // instead of / when computing the arguments.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.comb',
    meta:  'math.comb, math.perm',
  },
};
