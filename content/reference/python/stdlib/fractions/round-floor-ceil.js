// content/reference/python/stdlib/fractions/round-floor-ceil.js — round(), math.floor/ceil/trunc and int() on a Fraction

export const meta = {
  slug:        'round-floor-ceil',
  name:        'Fraction.__round__ / __floor__ / __ceil__',
  signature:   'round(f)  /  round(f, ndigits)  /  math.floor(f)  /  math.ceil(f)  /  math.trunc(f)  /  int(f)',
  blurb:       'Rounding a Fraction exactly: round() to the nearest int or to ndigits decimal places (half to even), floor and ceil toward minus and plus infinity, trunc and int toward zero.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'Fraction.__round__ Fraction.__floor__ Fraction.__ceil__ round fraction python math.floor fraction math.ceil fraction int fraction truncate half to even bankers rounding round to decimal places fraction',
};

export const method = {
  slug:      'round-floor-ceil',
  name:      'Fraction.__round__ / __floor__ / __ceil__',
  signature: 'round(f)  /  round(f, ndigits)  /  math.floor(f)  /  math.ceil(f)  /  math.trunc(f)  /  int(f)',
  returns:   { type: 'int | Fraction', desc: 'An int, except round(f, ndigits), which returns a Fraction.' },

  category:    'Fraction rounding',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'All of them work on the exact value, so ties are real ties: round(Fraction(5, 2)) is 2 and round(Fraction(7, 2)) is 4 (half to even). round with ndigits keeps the result exact — a Fraction, not a float.',

  covers: [],

  cheat: {
    commonCall: 'round(f, 2)',
    returns:    "Fraction(67, 25) for Fraction('2.675')",
    replaces:   'round(float(f), 2), which rounds the binary value',
    watchOut:   'round(f, n) returns a Fraction; round(f) returns an int',
  },

  parameters: [
    { name: 'ndigits', type: 'int', required: false, default: 'None', desc: 'round() only. None → nearest int. n > 0 → nearest multiple of 1/10**n; n <= 0 → nearest multiple of 10**-n (as a Fraction).' },
  ],

  modes: [
    {
      id: 'round',
      label: 'round',
      blurb: 'round(f) and round(f, ndigits) of a fraction typed as text.',
      params: [
        { name: 'text',    type: 'str', hint: "e.g. '2.675'", input: 'text' },
        { name: 'ndigits', type: 'int', hint: 'decimal places', input: 'number' },
      ],
      template: 'from fractions import Fraction\nf = Fraction({$text})\n(round(f), round(f, {$ndigits}))',
      cases: [
        { id: 'tie',   label: '5/2, 1',        values: { text: '5/2', ndigits: '1' } },
        { id: 'tie2',  label: '7/2, 0',        values: { text: '7/2', ndigits: '0' } },
        { id: 'money', label: '2.675, 2',      values: { text: '2.675', ndigits: '2' } },
        { id: 'neg',   label: '1234.5678, -2', values: { text: '1234.5678', ndigits: '-2' } },
        { id: 'third', label: '1/3, 3',        values: { text: '1/3', ndigits: '3' } },
      ],
    },
    {
      id: 'toint',
      label: 'floor / ceil / trunc',
      blurb: 'Five ways to an int. They only disagree on negatives and on halves.',
      params: [{ name: 'text', type: 'str', hint: "e.g. '-7/2'", input: 'text' }],
      template: 'import math\nfrom fractions import Fraction\nf = Fraction({$text})\n(math.floor(f), math.ceil(f), math.trunc(f), int(f), round(f))',
      cases: [
        { id: 'neg',   label: '-7/2', values: { text: '-7/2' } },
        { id: 'pos',   label: '7/2',  values: { text: '7/2' } },
        { id: 'third', label: '-1/3', values: { text: '-1/3' } },
        { id: 'whole', label: '5',    values: { text: '5' } },
      ],
    },
  ],
  demoExplainer: '5/2 and 7/2 are exact halves, so round() goes to the even neighbour: 2 and 4. With ndigits=0 the result is still a Fraction, Fraction(4, 1). 2.675 is exactly halfway between 2.67 and 2.68 and rounds to the even 2.68 = Fraction(67, 25), whereas round(2.675, 2) on the float gives 2.67. ndigits=-2 rounds to hundreds. For -7/2, floor goes down to -4, ceil up to -3, trunc and int toward zero (-3), and round to the even -4.',

  patterns: [
    {
      name: 'Round for display, keep exact for storage',
      desc: 'round(f, 2) is still exact; convert only when printing.',
      code: "from fractions import Fraction\nprice = round(Fraction('19.995'), 2)\nprint(float(price))",
    },
    {
      name: 'Integer part and fractional part',
      desc: 'math.floor plus the remainder, both exact.',
      code: 'import math\nfrom fractions import Fraction\nwhole = math.floor(f)\nfrac_part = f - whole',
    },
  ],

  examples: [
    { title: 'round() → int',                 code: 'from fractions import Fraction\nround(Fraction(7, 3))',             returns: '2' },
    { title: 'round(f, n) → Fraction',        code: 'from fractions import Fraction\nround(Fraction(1, 3), 2)',          returns: 'Fraction(33, 100)' },
    { title: 'Half to even, both directions', code: 'from fractions import Fraction\n(round(Fraction(1, 2)), round(Fraction(3, 2)), round(Fraction(-5, 2)))', returns: '(0, 2, -2)' },
    { title: 'Tens',                          code: 'from fractions import Fraction\n(round(Fraction(25), -1), round(Fraction(35), -1))', returns: '(Fraction(20, 1), Fraction(40, 1))' },
    { title: 'floor via math',                code: 'import math\nfrom fractions import Fraction\nmath.floor(Fraction(355, 113))', returns: '3' },
    { title: 'int() truncates toward zero',   code: 'import math\nfrom fractions import Fraction\n(int(Fraction(-7, 2)), math.floor(Fraction(-7, 2)))', returns: '(-3, -4)' },
    { title: 'ndigits must be an int',        code: 'from fractions import Fraction\nround(Fraction(1, 3), 1.5)',       returns: 'TypeError: both arguments should be Rational instances' },
  ],

  pitfalls: [
    {
      name: 'Rounding through float',
      desc: 'The float 2.675 is slightly below 2.675, so float rounding goes down. The exact Fraction is a true tie and goes to the even digit.',
      wrong: { label: 'round(float, 2)', code: "from fractions import Fraction\nround(float(Fraction('2.675')), 2)", output: '2.67' },
      fix:   { label: 'round(Fraction, 2)', code: "from fractions import Fraction\nround(Fraction('2.675'), 2)", output: 'Fraction(67, 25)' },
    },
    {
      name: 'Using int() as floor',
      desc: 'int() drops the fraction toward zero; for negative values that is up, not down.',
      wrong: { label: 'int(f)', code: 'from fractions import Fraction\nint(Fraction(-1, 3))', output: '0' },
      fix:   { label: 'math.floor(f)', code: 'import math\nfrom fractions import Fraction\nmath.floor(Fraction(-1, 3))', output: '-1' },
    },
  ],

  when: {
    use: ['Exact rounding of rational results (prices, percentages)', 'Integer parts of exact values'],
    avoid: ['Rounding half up → build it yourself: math.floor(f + Fraction(1, 2))', 'Text output with decimals → format(f, ".2f")'],
  },

  notes: {
    cpython:    'Lib/fractions.py: __floor__ is numerator // denominator, __ceil__ negates twice, __trunc__ / __int__ pick by sign, __round__ compares twice the remainder with the denominator and breaks ties to even; with ndigits it rounds self * 10**n (or self / 10**-n) and rebuilds a Fraction',
    'Tie rule': 'Half to even, like round() on floats and the ROUND_HALF_EVEN default of decimal — but applied to the exact value, so 2.675 really is a tie',
  },

  related: [
    { name: 'round()', slug: 'round', when: 'The built-in that calls __round__', category: 'functions' },
    { name: 'math.floor / ceil / trunc', slug: 'floor-ceil-trunc', when: 'The same functions for floats', category: 'stdlib/math' },
    { name: 'Fraction formatting', slug: 'format', when: 'Round straight to text' },
    { name: 'Fraction arithmetic', slug: 'arithmetic', when: '// and divmod' },
    { name: 'fractions module', slug: 'fractions', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I round a Fraction to 2 decimal places?',
      a: "round(f, 2) returns a Fraction exactly at two decimals (Fraction('2.675') becomes Fraction(67, 25), i.e. 2.68). For text use format(f, '.2f').",
    },
    {
      q: "Does round() on a Fraction use banker's rounding?",
      a: 'Yes — ties go to the even neighbour: round(Fraction(5, 2)) is 2 and round(Fraction(7, 2)) is 4. Unlike floats, decimal ties such as 2.675 are exact ties for a Fraction.',
    },
    {
      q: 'What is the difference between int(f) and math.floor(f)?',
      a: 'int() truncates toward zero, math.floor() rounds toward minus infinity. They agree for positive values and differ for negative non-integers: int(Fraction(-7, 2)) is -3, math.floor(Fraction(-7, 2)) is -4.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction.__round__',
    meta:  'Fraction.__round__',
  },
};
