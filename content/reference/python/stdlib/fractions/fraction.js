// content/reference/python/stdlib/fractions/fraction.js — fractions.Fraction (the constructor)

export const meta = {
  slug:        'fraction',
  name:        'fractions.Fraction',
  signature:   'fractions.Fraction(numerator=0, denominator=None)',
  blurb:       'Create an exact rational number from two ints, another Rational, a float, a Decimal or a string such as "3/4", "-.125" or "7e-6".',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.6+ (float and Decimal 3.2+, underscores 3.11+, spaces around / 3.12+)',
  searchTerms: 'fractions.Fraction Fraction constructor python fraction from string fraction from float fraction from decimal Invalid literal for Fraction both arguments should be Rational instances argument should be a string or a Rational instance ZeroDivisionError Fraction(1, 0) numbers.Rational',
};

export const method = {
  slug:      'fraction',
  name:      'fractions.Fraction',
  signature: 'fractions.Fraction(numerator=0, denominator=None)',
  returns:   { type: 'Fraction', desc: 'A new Fraction in lowest terms with a positive denominator.' },

  category:    'fractions class',
  version:     'Python 2.6+ (float and Decimal 3.2+, underscores 3.11+, spaces around / 3.12+)',
  hasLiveDemo: true,

  subtitle: 'Five ways in: a numerator/denominator pair of Rationals, one Rational, a float, a Decimal, or a string. Floats and Decimals are converted exactly; strings are parsed exactly — so "0.1" and 0.1 give different fractions.',

  covers: ['Fraction'],

  cheat: {
    commonCall: "Fraction(3, 4)  /  Fraction('0.75')",
    returns:    'Fraction(3, 4) — reduced, denominator positive',
    replaces:   'Hand-rolled (numerator, denominator) tuples and gcd calls',
    watchOut:   'Fraction(0.1) is the exact binary value, not 1/10',
  },

  parameters: [
    { name: 'numerator',   type: 'int | Fraction | float | Decimal | str', required: false, default: '0', desc: 'Alone: any of the five accepted kinds. With a denominator: must be a Rational (int, bool or Fraction).' },
    { name: 'denominator', type: 'int | Fraction', required: false, default: 'None', desc: 'A Rational, not zero. A float or a string here raises TypeError.' },
  ],

  modes: [
    {
      id: 'string',
      label: 'string',
      blurb: 'The string grammar: [sign] numerator [/ denominator], or [sign] a decimal with an optional exponent. Underscores between digits and surrounding whitespace are allowed; inf and nan are not.',
      params: [{ name: 'text', type: 'str', hint: "'-.125', '2 / 3', '7e-6'", input: 'text' }],
      template: 'from fractions import Fraction\nFraction({$text})',
      cases: [
        { id: 'neg',    label: '-.125',    values: { text: '-.125' } },
        { id: 'exp',    label: '7e-6',     values: { text: '7e-6' } },
        { id: 'spaced', label: '2 / 3',    values: { text: '2 / 3' } },
        { id: 'under',  label: '1_000/3',  values: { text: '1_000/3' } },
        { id: 'double', label: '1/2/3',    values: { text: '1/2/3' } },
        { id: 'inf',    label: 'inf',      values: { text: 'inf' } },
      ],
    },
    {
      id: 'pair',
      label: 'numerator, denominator',
      blurb: 'Two ints. The result is divided by their gcd and the sign moves to the numerator.',
      params: [
        { name: 'numerator',   type: 'int', hint: 'top',    input: 'number' },
        { name: 'denominator', type: 'int', hint: 'bottom', input: 'number' },
      ],
      template: 'from fractions import Fraction\nFraction({$numerator}, {$denominator})',
      cases: [
        { id: 'reduce', label: '16, -10', values: { numerator: '16', denominator: '-10' } },
        { id: 'negneg', label: '-4, -6',  values: { numerator: '-4', denominator: '-6' } },
        { id: 'zero',   label: '0, 5',    values: { numerator: '0', denominator: '5' } },
        { id: 'divz',   label: '3, 0',    values: { numerator: '3', denominator: '0' } },
      ],
    },
    {
      id: 'value',
      label: 'int / float / str',
      blurb: 'One value. Whole numbers become ints in the code, numbers with a point or exponent floats, anything else a string.',
      params: [{ name: 'x', type: 'int | float | str', hint: '7, 2.25, 1.1 or 3/8', input: 'auto' }],
      template: 'from fractions import Fraction\nFraction({$x})',
      cases: [
        { id: 'int',   label: '7',    values: { x: '7' } },
        { id: 'quart', label: '2.25', values: { x: '2.25' } },
        { id: 'tenth', label: '1.1',  values: { x: '1.1' } },
        { id: 'str',   label: '3/8',  values: { x: '3/8' } },
      ],
    },
  ],
  demoExplainer: 'Strings are parsed digit by digit, so "-.125" is exactly Fraction(-1, 8) and "7e-6" is Fraction(7, 1000000). The pattern accepts one slash only, and no exponent together with a slash; "inf" and "nan" are rejected because a Fraction must be finite. A zero denominator raises ZeroDivisionError whose message shows the numerator: Fraction(3, 0). The float 2.25 is exactly representable in binary and gives Fraction(9, 4); 1.1 is not, and gives Fraction(2476979795053773, 2251799813685248).',

  patterns: [
    {
      name: 'Parse user input exactly',
      desc: 'Strings like "3/4" or "0.75" both work; catch ValueError for anything else.',
      code: "from fractions import Fraction\ntry:\n    value = Fraction(text)\nexcept (ValueError, ZeroDivisionError) as e:\n    print(f'not a number: {e}')",
    },
    {
      name: 'Convert a float the way it was written',
      desc: 'Going through str() keeps the decimal digits you see instead of the binary value.',
      code: 'from fractions import Fraction\nexact = Fraction(str(measurement))',
    },
    {
      name: 'Accept any number type',
      desc: 'Fraction() takes int, float, Decimal, Fraction and str alike.',
      code: 'from decimal import Decimal\nfrom fractions import Fraction\nvalues = [Fraction(v) for v in (1, 0.5, "1/3", Decimal("0.2"))]',
    },
  ],

  examples: [
    { title: 'No arguments: zero',          code: 'from fractions import Fraction\nFraction()',                                   returns: 'Fraction(0, 1)' },
    { title: 'Fraction of Fractions',       code: 'from fractions import Fraction\nFraction(Fraction(1, 7), Fraction(2, 3))',     returns: 'Fraction(3, 14)' },
    { title: 'From a Decimal: exact digits', code: 'from fractions import Fraction\nfrom decimal import Decimal\nFraction(Decimal("1.47"))', returns: 'Fraction(147, 100)' },
    { title: 'Unicode digits are digits',   code: "from fractions import Fraction\nFraction('\uff11\uff12/\uff13')",          returns: 'Fraction(4, 1)' },
    { title: 'bool is a Rational',          code: 'from fractions import Fraction\nFraction(True, 2)',                            returns: 'Fraction(1, 2)' },
    { title: 'Infinity has no ratio',       code: "from fractions import Fraction\nFraction(float('inf'))",                      returns: 'OverflowError: cannot convert Infinity to integer ratio' },
    { title: 'NaN has no ratio either',     code: "from fractions import Fraction\nFraction(float('nan'))",                      returns: 'ValueError: cannot convert NaN to integer ratio' },
    { title: 'Lists are not numbers',       code: 'from fractions import Fraction\nFraction([1, 2])',                             returns: 'TypeError: argument should be a string or a Rational instance' },
  ],

  pitfalls: [
    {
      name: 'A decimal point inside a fraction string',
      desc: 'The string form is either a fraction of two whole numbers or a decimal — not both. Parse the decimal, then divide.',
      wrong: { label: "Fraction('1.5/2')", code: "from fractions import Fraction\nFraction('1.5/2')", output: "ValueError: Invalid literal for Fraction: '1.5/2'" },
      fix:   { label: "Fraction('1.5') / 2", code: "from fractions import Fraction\nFraction('1.5') / 2", output: 'Fraction(3, 4)' },
    },
    {
      name: 'A float as the denominator',
      desc: 'With two arguments both must be Rationals (int, bool or Fraction). Convert the float first, or divide.',
      wrong: { label: 'Fraction(1, 0.5)', code: 'from fractions import Fraction\nFraction(1, 0.5)', output: 'TypeError: both arguments should be Rational instances' },
      fix:   { label: 'divide Fractions', code: 'from fractions import Fraction\nFraction(1) / Fraction(0.5)', output: 'Fraction(2, 1)' },
    },
    {
      name: 'Expecting Fraction(1.1) to be 11/10',
      desc: 'The float literal 1.1 is the nearest binary double; Fraction keeps every bit of it.',
      wrong: { label: 'from the float', code: 'from fractions import Fraction\nFraction(1.1)', output: 'Fraction(2476979795053773, 2251799813685248)' },
      fix:   { label: 'from the text', code: "from fractions import Fraction\nFraction('1.1')", output: 'Fraction(11, 10)' },
    },
  ],

  when: {
    use: [
      'Exact values typed as text: "3/4", "0.375", "1e-3"',
      'Exact ratios of ints — Fraction(numerator, denominator) reduces for you',
      'Seeing exactly which value a float holds',
    ],
    avoid: [
      'Turning a float into "the fraction it looks like" → limit_denominator() or Fraction(str(x))',
      'Fixed-point money amounts → decimal.Decimal',
    ],
  },

  notes: {
    cpython:      'Fraction.__new__ in Lib/fractions.py: a single int or other Rational is taken over as it is, a float or Decimal through as_integer_ratio() (already in lowest terms); a string goes through the _RATIONAL_FORMAT regular expression and a pair of Rationals is cross-multiplied — those two are then divided by math.gcd, with the sign moved to the numerator',
    'Strings':    'Leading/trailing whitespace and whitespace around "/" (3.12+) are allowed; digits may be any Unicode decimal digits; underscores only between digits (3.11+); the exponent letter is e or E',
    'Errors':     'ValueError for a malformed string or a NaN, OverflowError for an infinity, ZeroDivisionError for a zero denominator, TypeError for other types or a non-Rational second argument',
  },

  related: [
    { name: 'limit_denominator', slug: 'limit_denominator', when: 'The simple fraction closest to a float' },
    { name: 'from_float / from_decimal', slug: 'from_float-from_decimal', when: 'Strict alternative constructors' },
    { name: 'numerator / denominator', slug: 'numerator-denominator', when: 'Read the parts back' },
    { name: 'Fraction arithmetic', slug: 'arithmetic', when: 'What + - * / do with ints and floats' },
    { name: 'fractions module', slug: 'fractions', when: 'Overview', category: 'stdlib' },
    { name: 'float.as_integer_ratio()', slug: 'float-as_integer_ratio', when: 'How floats are converted', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does "Invalid literal for Fraction" mean?',
      a: 'The string does not match the accepted grammar: an optional sign, then either whole numbers around one slash ("3/4") or a finite decimal with an optional exponent ("-1.5e3"). Common causes are a decimal point inside a fraction ("1.5/2"), two slashes, "inf"/"nan", or stray characters such as a currency sign.',
    },
    {
      q: 'Why is Fraction(0.1) not Fraction(1, 10)?',
      a: '0.1 cannot be stored exactly as a binary float; the literal becomes 3602879701896397 / 2**55. Fraction converts floats exactly, so you see that value. Use Fraction("0.1") or Fraction(0.1).limit_denominator() to get one tenth.',
    },
    {
      q: 'Can the denominator be negative?',
      a: 'You can pass a negative denominator, but the stored fraction always has a positive one: Fraction(16, -10) is Fraction(-8, 5), and Fraction(-4, -6) is Fraction(2, 3).',
    },
    {
      q: 'Is a Fraction an instance of numbers.Rational?',
      a: 'Yes — Fraction is a concrete subclass of numbers.Rational, alongside int (and bool). That is also why Fraction(True, 2) works.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction',
    meta:  'fractions.Fraction',
  },
};
