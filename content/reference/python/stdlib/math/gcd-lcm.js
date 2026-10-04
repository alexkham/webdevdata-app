// content/reference/python/stdlib/math/gcd-lcm.js — math.gcd / lcm

export const meta = {
  slug:        'gcd-lcm',
  name:        'math.gcd / lcm',
  signature:   'math.gcd(*integers) · math.lcm(*integers)',
  blurb:       'Greatest common divisor and least common multiple of any number of ints — exact, never negative.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'gcd: 3.5+ (any number of args 3.9+) · lcm: 3.9+',
  searchTerms: 'math.gcd math.lcm gcd lcm greatest common divisor least common multiple python highest common factor reduce fraction lowest terms gcd of list',
};

export const method = {
  slug:      'gcd-lcm',
  name:      'math.gcd / lcm',
  signature: 'math.gcd(*integers) · math.lcm(*integers)',
  returns:   { type: 'int', desc: 'Always ≥ 0. gcd() with no arguments is 0, lcm() is 1.' },

  category:    'math function',
  version:     'gcd: 3.5+ (any number of args 3.9+) · lcm: 3.9+',
  hasLiveDemo: true,

  subtitle: 'Both take any number of ints (3.9+) and ignore signs. Zero is special: gcd(0, n) is n, lcm(0, n) is 0. Floats are rejected even when whole.',

  covers: ['gcd', 'lcm'],

  cheat: {
    commonCall: 'math.gcd(a, b), math.lcm(a, b)',
    returns:    'int — gcd(12, 18) is 6, lcm(12, 18) is 36',
    replaces:   'Euclid’s algorithm written by hand',
    watchOut:   'gcd(2.5, 5) raises TypeError',
  },

  parameters: [
    { name: '*integers', type: 'int', required: false, default: null, desc: 'Zero or more ints (bool counts as int). Signs are ignored.' },
  ],

  modes: [
    {
      id: 'pair',
      label: 'two numbers',
      blurb: 'gcd and lcm of a pair.',
      params: [
        { name: 'a', type: 'int', hint: 'int', input: 'number' },
        { name: 'b', type: 'int', hint: 'int', input: 'number' },
      ],
      template: 'import math\na, b = {$a}, {$b}\n(math.gcd(a, b), math.lcm(a, b))',
      cases: [
        { id: 'basic', label: '12, 18', values: { a: '12', b: '18' } },
        { id: 'prime', label: '17, 5',  values: { a: '17', b: '5' } },
        { id: 'zero',  label: '0, 5',   values: { a: '0',  b: '5' } },
        { id: 'neg',   label: '-12, 18', values: { a: '-12', b: '18' } },
      ],
    },
    {
      id: 'many',
      label: 'a list',
      blurb: 'Comma-separated ints, unpacked into the call.',
      params: [{ name: 'nums', type: 'str', hint: 'comma-separated ints', input: 'text' }],
      template: "import math\nnums = [int(x) for x in {$nums}.split(',')]\n(math.gcd(*nums), math.lcm(*nums))",
      cases: [
        { id: 'three', label: '4, 6, 8',    values: { nums: '4, 6, 8' } },
        { id: 'ten',   label: '1 to 10',    values: { nums: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10' } },
        { id: 'big',   label: 'big ints',   values: { nums: '123456789012345678901234567890, 987654321098765432109876543210' } },
      ],
    },
    {
      id: 'fraction',
      label: 'reduce a fraction',
      blurb: 'Divide numerator and denominator by their gcd.',
      params: [
        { name: 'num', type: 'int', hint: 'numerator',   input: 'number' },
        { name: 'den', type: 'int', hint: 'denominator', input: 'number' },
      ],
      template: 'import math\nnum, den = {$num}, {$den}\ng = math.gcd(num, den)\n(num // g, den // g)',
      cases: [
        { id: 'a', label: '84 / 126', values: { num: '84', den: '126' } },
        { id: 'b', label: '10 / 4',   values: { num: '10', den: '4' } },
        { id: 'z', label: '0 / 0',    values: { num: '0',  den: '0' } },
      ],
    },
  ],
  demoExplainer: 'gcd and lcm never return a negative number: gcd(-12, 18) is 6. lcm of 1 through 10 is 2520, the smallest number all of them divide. Reducing 0/0 fails because gcd(0, 0) is 0 and 0 // 0 raises ZeroDivisionError.',

  patterns: [
    {
      name: 'gcd of a whole list',
      desc: 'Unpack it (3.9+).',
      code: 'import math\ng = math.gcd(*numbers)',
    },
    {
      name: 'Common period of repeating events',
      desc: 'Things that repeat every 4, 6 and 10 days coincide every lcm days.',
      code: 'import math\nperiod = math.lcm(4, 6, 10)',
    },
    {
      name: 'Exact fractions',
      desc: 'Fraction reduces with gcd for you.',
      code: 'from fractions import Fraction\nFraction(84, 126)',
    },
  ],

  examples: [
    { title: 'gcd of two numbers',   code: 'import math\nmath.gcd(12, 18)', returns: '6' },
    { title: 'lcm of two numbers',   code: 'import math\nmath.lcm(12, 18)', returns: '36' },
    { title: 'Any number of args',   code: 'import math\nmath.lcm(*range(1, 11))', returns: '2520' },
    { title: 'Signs are ignored',    code: 'import math\nmath.gcd(-12, 18)', returns: '6' },
    { title: 'Zero',                 code: 'import math\n(math.gcd(0, 5), math.lcm(0, 5))', returns: '(5, 0)' },
    { title: 'No arguments',         code: 'import math\n(math.gcd(), math.lcm())', returns: '(0, 1)' },
    { title: 'Floats are rejected',  code: 'import math\nmath.gcd(2.5, 5)', returns: "TypeError: 'float' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'lcm by the formula with /',
      desc: 'True division turns the result into a float — and loses digits for big numbers.',
      wrong: { label: 'a * b / gcd', code: 'import math\na, b = 12, 18\na * b / math.gcd(a, b)', output: '36.0' },
      fix:   { label: 'math.lcm', code: 'import math\nmath.lcm(12, 18)', output: '36' },
    },
    {
      name: 'Passing a list instead of unpacking it',
      desc: 'gcd takes ints, not one iterable.',
      wrong: { label: 'gcd(list)', code: 'import math\nmath.gcd([12, 18, 24])', output: "TypeError: 'list' object cannot be interpreted as an integer" },
      fix:   { label: 'gcd(*list)', code: 'import math\nmath.gcd(*[12, 18, 24])', output: '6' },
    },
  ],

  when: {
    use: ['Reducing ratios, common periods, number theory', 'Exact work on ints of any size'],
    avoid: ['Fraction arithmetic → fractions.Fraction does the reducing', 'Polynomials or floats → a CAS such as sympy'],
  },

  notes: {
    cpython:    'math_gcd uses _PyLong_GCD from Objects/longobject.c; lcm is abs(a // gcd(a, b) * b), folded over the arguments',
    'Versions': 'gcd added in 3.5, any number of arguments in 3.9; lcm added in 3.9 (docs.python.org)',
    'Platform': 'Exact integer arithmetic: identical everywhere',
  },

  related: [
    { name: 'factorial', slug: 'factorial', when: 'Other exact integer functions' },
    { name: 'prod', slug: 'prod', when: 'Product of many ints' },
    { name: '// operator', slug: 'floordiv', when: 'Integer division for the reduced terms', category: 'operators' },
    { name: 'TypeError', slug: 'typeerror', when: 'What a float argument raises', category: 'exceptions' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I find the gcd of a list in Python?',
      a: 'math.gcd(*numbers) on Python 3.9+. On older versions, functools.reduce(math.gcd, numbers).',
    },
    {
      q: 'How do I calculate the lcm in Python?',
      a: 'math.lcm(a, b, ...) on Python 3.9+. Before that: a * b // math.gcd(a, b) — with // so the result stays an exact int.',
    },
    {
      q: 'Why is math.gcd(0, 0) equal to 0?',
      a: 'Every int divides 0, so there is no largest common divisor; Python follows the usual convention gcd(0, 0) = 0. It means you cannot blindly divide by the gcd.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.gcd',
    meta:  'math.gcd, math.lcm',
  },
};
