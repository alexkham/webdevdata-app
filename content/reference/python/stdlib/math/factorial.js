// content/reference/python/stdlib/math/factorial.js — math.factorial

export const meta = {
  slug:        'factorial',
  name:        'math.factorial',
  signature:   'math.factorial(n)',
  blurb:       'n! = 1 · 2 · … · n as an exact int, for any non-negative int n.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (floats rejected since 3.10)',
  searchTerms: 'math.factorial factorial python n factorial factorial of a number factorial() not defined for negative values float object cannot be interpreted as an integer exceeds the limit 4300 digits integer string conversion',
};

export const method = {
  slug:      'factorial',
  name:      'math.factorial',
  signature: 'math.factorial(n, /)',
  returns:   { type: 'int', desc: 'n! exactly.' },

  category:    'math function',
  version:     'All Python 3 versions (floats rejected since 3.10)',
  hasLiveDemo: true,

  subtitle: 'Exact at any size — 1000! has 2568 digits. The traps are the argument (ints only since 3.10, never negative) and printing: Python refuses to turn an int of more than 4300 digits into text.',

  covers: ['factorial'],

  cheat: {
    commonCall: 'math.factorial(n)',
    returns:    'int — factorial(5) is 120',
    replaces:   'Hand-written loops and recursion',
    watchOut:   'factorial(5.0) raises TypeError; str() of a result above 4300 digits raises ValueError',
  },

  parameters: [
    { name: 'n', type: 'int', required: true, default: null, desc: 'A non-negative int. bool works (True is 1); floats raise TypeError since 3.10.' },
  ],

  modes: [
    {
      id: 'value',
      label: 'n!',
      blurb: 'The exact value.',
      params: [{ name: 'n', type: 'int', hint: 'non-negative int', input: 'number' }],
      template: 'import math\nmath.factorial({$n})',
      cases: [
        { id: 'five',  label: '5',  values: { n: '5' } },
        { id: 'tw',    label: '20', values: { n: '20' } },
        { id: 'zero',  label: '0',  values: { n: '0' } },
        { id: 'neg',   label: '-1', values: { n: '-1' } },
      ],
    },
    {
      id: 'digits',
      label: 'digits',
      blurb: 'How many digits n! has — and where str() gives up.',
      params: [{ name: 'n', type: 'int', hint: 'non-negative int', input: 'number' }],
      template: 'import math\nlen(str(math.factorial({$n})))',
      cases: [
        { id: 'h',     label: '100',  values: { n: '100' } },
        { id: 'k',     label: '1000', values: { n: '1000' } },
        { id: 'limit', label: '1700', values: { n: '1700' } },
      ],
    },
    {
      id: 'gamma',
      label: 'vs gamma',
      blurb: 'gamma(n + 1) is the float approximation of n!.',
      params: [{ name: 'n', type: 'int', hint: 'non-negative int', input: 'number' }],
      template: 'import math\nn = {$n}\n(math.factorial(n), math.gamma(n + 1))',
      cases: [
        { id: 'five', label: '5',  values: { n: '5' } },
        { id: 'tw',   label: '20', values: { n: '20' } },
        { id: 'tf',   label: '25', values: { n: '25' } },
      ],
    },
  ],
  demoExplainer: '0! is 1 by definition, and a negative n raises ValueError: factorial() not defined for negative values. 1000! has 2568 digits; 1700! has more than 4300, so str() raises ValueError (Exceeds the limit (4300 digits) for integer string conversion) — the number itself is fine, only the conversion to text is limited. gamma(26.0) agrees with 25! only to about 16 significant digits.',

  patterns: [
    {
      name: 'Count digits of a huge factorial',
      desc: 'Lift the str() limit just for this conversion, or count with logs.',
      code: 'import math, sys\nsys.set_int_max_str_digits(0)  # 0 = no limit\nprint(len(str(math.factorial(5000))))',
    },
    {
      name: 'Approximate log of n!',
      desc: 'lgamma(n + 1) without building the int.',
      code: 'import math\nlog_fact = math.lgamma(n + 1)',
    },
  ],

  examples: [
    { title: '5!',                     code: 'import math\nmath.factorial(5)',  returns: '120' },
    { title: '0! is 1',                code: 'import math\nmath.factorial(0)',  returns: '1' },
    { title: 'Bigger than 64 bits',    code: 'import math\nmath.factorial(25)', returns: '15511210043330985984000000' },
    { title: 'Digits of 100!',         code: 'import math\nlen(str(math.factorial(100)))', returns: '158' },
    { title: 'Negative',               code: 'import math\nmath.factorial(-1)', returns: 'ValueError: factorial() not defined for negative values' },
    { title: 'Floats are rejected',    code: 'import math\nmath.factorial(5.0)', returns: "TypeError: 'float' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'Passing a whole-number float',
      desc: 'Accepted until 3.9, an error since 3.10. Convert explicitly.',
      wrong: { label: 'factorial(n / 2)', code: 'import math\nn = 10\nmath.factorial(n / 2)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'factorial(n // 2)', code: 'import math\nn = 10\nmath.factorial(n // 2)', output: '120' },
    },
    {
      name: 'Printing a very large factorial',
      desc: 'Since the integer-string conversion limit (documented as added in 3.11), str() of an int with more than 4300 digits raises.',
      wrong: { label: 'str()', code: 'import math\nlen(str(math.factorial(2000)))', output: 'ValueError: Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit' },
      fix:   { label: 'bit_length / log', code: 'import math\nmath.factorial(2000).bit_length()', output: '19053' },
    },
  ],

  when: {
    use: ['Exact combinatorics, series coefficients, test values'],
    avoid: ['Counting subsets → math.comb (faster, no huge intermediates)', 'Float approximations of huge n! → math.lgamma'],
  },

  notes: {
    cpython:    'Divide-and-conquer product of the odd part (factorial_odd_part) shifted left by the power of two n - popcount(n); a lookup table for small n',
    'Limits':   'Arguments above the C long range raise OverflowError — the limit in the message is 9223372036854775807 on Linux and 2147483647 on Windows',
    'Versions': 'Floats with integral values (like 5.0) are no longer accepted since 3.10 (docs.python.org)',
  },

  related: [
    { name: 'comb / perm', slug: 'comb-perm', when: 'Binomial coefficients without the factorials' },
    { name: 'prod', slug: 'prod', when: 'Product of any iterable' },
    { name: 'erf / gamma / lgamma', slug: 'erf-gamma', when: 'Continuous factorial' },
    { name: 'int.bit_length()', slug: 'int-bit_length', when: 'Size of a huge int without str()', category: 'functions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I calculate a factorial in Python?',
      a: 'math.factorial(n). It returns an exact int for any non-negative int n and is much faster than a Python loop or recursion.',
    },
    {
      q: 'Why does math.factorial(5.0) raise TypeError?',
      a: 'Since Python 3.10 factorial only accepts ints. Values computed with / are floats even when whole; use // or int().',
    },
    {
      q: 'What does "Exceeds the limit (4300 digits) for integer string conversion" mean?',
      a: 'Converting an int with more than 4300 decimal digits to str (or printing it) is refused by default to prevent denial-of-service attacks. Call sys.set_int_max_str_digits(0) to lift the limit if you really need the digits.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.factorial',
    meta:  'math.factorial',
  },
};
