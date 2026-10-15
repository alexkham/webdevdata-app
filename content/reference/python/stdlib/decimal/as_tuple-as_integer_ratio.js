// content/reference/python/stdlib/decimal/as_tuple-as_integer_ratio.js

export const meta = {
  slug:        'as_tuple-as_integer_ratio',
  name:        'Decimal.as_tuple',
  signature:   'Decimal.as_tuple()  ·  Decimal.as_integer_ratio()  ·  decimal.DecimalTuple(sign, digits, exponent)  ·  Decimal.real / .imag / .conjugate()',
  blurb:       'Take a Decimal apart: its sign, coefficient digits and exponent as a DecimalTuple, or its exact value as a fraction n/d. Plus the real/imag/conjugate trio that makes Decimal a number like the others.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions (as_integer_ratio: 3.6+)',
  searchTerms: 'decimal as_tuple as_integer_ratio DecimalTuple Decimal.as_tuple Decimal.as_integer_ratio Decimal.real Decimal.imag Decimal.conjugate real imag conjugate sign digits exponent number of decimal places decimal to fraction numerator denominator',
};

export const method = {
  slug:      'as_tuple-as_integer_ratio',
  name:      'Decimal.as_tuple',
  signature: 'Decimal.as_tuple()  ·  Decimal.as_integer_ratio()  ·  decimal.DecimalTuple(sign, digits, exponent)  ·  Decimal.real / .imag / .conjugate()',
  returns:   { type: 'DecimalTuple | tuple[int, int] | Decimal', desc: "as_tuple: DecimalTuple(sign, digits, exponent); as_integer_ratio: (numerator, denominator) in lowest terms; real and conjugate(): the Decimal itself; imag: Decimal('0')." },

  category:    'Decimal method',
  version:     'All Python 3 versions (as_integer_ratio: 3.6+)',
  hasLiveDemo: true,

  subtitle: "as_tuple() shows exactly what is stored — Decimal('-12.50') is sign 1, digits (1, 2, 5, 0), exponent -2 — and Decimal(t) rebuilds it. The exponent is 'n', 'N' or 'F' for NaN, sNaN and Infinity. as_integer_ratio() gives the exact value as integers, ready for fractions.Fraction.",

  covers: ['Decimal.as_tuple', 'Decimal.as_integer_ratio', 'DecimalTuple', 'Decimal.real', 'Decimal.imag', 'Decimal.conjugate'],

  cheat: {
    commonCall: "Decimal('3.14').as_tuple()",
    returns:    'DecimalTuple(sign=0, digits=(3, 1, 4), exponent=-2)',
    replaces:   'parsing str(x) to find digits or decimal places',
    watchOut:   "as_integer_ratio() raises for NaN (ValueError) and Infinity (OverflowError)",
  },

  parameters: [
    { name: 'sign',     type: 'int',            required: true, default: null, desc: 'DecimalTuple field: 0 for positive, 1 for negative.' },
    { name: 'digits',   type: 'tuple[int, ...]', required: true, default: null, desc: 'DecimalTuple field: the coefficient digits, most significant first (empty for a NaN without payload).' },
    { name: 'exponent', type: "int | 'n' | 'N' | 'F'", required: true, default: null, desc: "DecimalTuple field: the power of ten, or 'n' (NaN), 'N' (sNaN), 'F' (Infinity)." },
  ],

  modes: [
    {
      id: 'parts',
      label: 'as_tuple & ratio',
      blurb: 'The stored representation and the exact fraction of a number.',
      params: [{ name: 'x', type: 'str', hint: 'a number', input: 'text' }],
      template: 'from decimal import Decimal\nx = Decimal({$x})\n(x.as_tuple(), x.as_integer_ratio())',
      cases: [
        { id: 'pi',   label: '3.14',      values: { x: '3.14' } },
        { id: 'neg0', label: '-0.0',      values: { x: '-0.0' } },
        { id: 'exp',  label: '1E+3',      values: { x: '1E+3' } },
        { id: 'frac', label: '0.125',     values: { x: '0.125' } },
        { id: 'inf',  label: '-Infinity', values: { x: '-Infinity' } },
      ],
    },
    {
      id: 'fields',
      label: 'fields & round trip',
      blurb: 'Read the named fields, then rebuild the Decimal from the tuple.',
      params: [{ name: 'x', type: 'str', hint: 'a number', input: 'text' }],
      template: 'from decimal import Decimal\nt = Decimal({$x}).as_tuple()\n(t.sign, t.digits, t.exponent, Decimal(t))',
      cases: [
        { id: 'money', label: '-12.50',  values: { x: '-12.50' } },
        { id: 'snan',  label: 'sNaN7',   values: { x: 'sNaN7' } },
        { id: 'big',   label: '1.5E+5',  values: { x: '1.5E+5' } },
      ],
    },
    {
      id: 'places',
      label: 'decimal places',
      blurb: 'The number of decimal places is minus the exponent.',
      params: [{ name: 'x', type: 'str', hint: 'a number', input: 'text' }],
      template: 'from decimal import Decimal\n-Decimal({$x}).as_tuple().exponent',
      cases: [
        { id: 'cents', label: '19.99', values: { x: '19.99' } },
        { id: 'int',   label: '7',     values: { x: '7' } },
        { id: 'tiny',  label: '1E-7',  values: { x: '1E-7' } },
        { id: 'hund',  label: '1E+2',  values: { x: '1E+2' } },
        { id: 'nan',   label: 'NaN',   values: { x: 'NaN' } },
      ],
    },
  ],
  demoExplainer: "3.14 is digits (3, 1, 4) with exponent -2, i.e. 314 × 10**-2, and its ratio is 157/50 in lowest terms. -0.0 keeps sign 1 and exponent -1 (its ratio is (0, 1)). 1E+3 is the single digit 1 with exponent 3; 0.125 is exactly 1/8. Infinity has no ratio: OverflowError: cannot convert Infinity to integer ratio. The tuple rebuilds the same Decimal, payload and all (sNaN7). Minus the exponent counts decimal places: 2 for 19.99, 7 for 1E-7, and -2 for 1E+2 (no places, two implied zeros); for NaN the exponent is the string 'n' and unary minus is a TypeError.",

  patterns: [
    {
      name: 'Count decimal places',
      desc: 'Works for every finite Decimal, including exponent forms.',
      code: 'def places(x):\n    return max(0, -x.as_tuple().exponent)',
    },
    {
      name: 'Exact conversion to Fraction',
      desc: 'Fraction(Decimal) works too; the ratio is useful for any rational type.',
      code: 'from fractions import Fraction\nexact = Fraction(*amount.as_integer_ratio())',
    },
    {
      name: 'Validate a maximum number of places',
      desc: 'Reject input with more than 2 decimal places.',
      code: "if -amount.as_tuple().exponent > 2:\n    raise ValueError('at most two decimal places')",
    },
  ],

  examples: [
    { title: 'as_tuple()',                code: "from decimal import Decimal\nDecimal('3.14').as_tuple()", returns: 'DecimalTuple(sign=0, digits=(3, 1, 4), exponent=-2)' },
    { title: 'Specials have a letter exponent', code: "from decimal import Decimal\nDecimal('NaN').as_tuple()", returns: "DecimalTuple(sign=0, digits=(), exponent='n')" },
    { title: 'Building from a tuple',      code: 'from decimal import Decimal\nDecimal((0, (1, 4, 1, 4), -3))', returns: "Decimal('1.414')" },
    { title: 'DecimalTuple by hand',       code: 'from decimal import DecimalTuple, Decimal\nt = DecimalTuple(1, (2, 5), -1)\n(t, Decimal(t))', returns: "(DecimalTuple(sign=1, digits=(2, 5), exponent=-1), Decimal('-2.5'))" },
    { title: 'Exact ratio in lowest terms', code: "from decimal import Decimal\nDecimal('-3.14').as_integer_ratio()", returns: '(-157, 50)' },
    { title: 'Into a Fraction',            code: "from decimal import Decimal\nfrom fractions import Fraction\nFraction(*Decimal('2.5').as_integer_ratio())", returns: 'Fraction(5, 2)' },
    { title: 'real, imag, conjugate',      code: "from decimal import Decimal\n(Decimal('1.5').real, Decimal('1.5').imag, Decimal('1.5').conjugate())", returns: "(Decimal('1.5'), Decimal('0'), Decimal('1.5'))" },
    { title: 'No ratio for infinity',      code: "from decimal import Decimal\nDecimal('Infinity').as_integer_ratio()", returns: 'OverflowError: cannot convert Infinity to integer ratio' },
  ],

  pitfalls: [
    {
      name: 'Counting places from the string',
      desc: 'str() switches to exponent notation for small and large numbers, so there may be no point at all.',
      wrong: { label: "str(x).split('.')", code: "from decimal import Decimal\nlen(str(Decimal('1E-7')).split('.')[1])", output: 'IndexError: list index out of range' },
      fix:   { label: '-exponent', code: "from decimal import Decimal\n-Decimal('1E-7').as_tuple().exponent", output: '7' },
    },
    {
      name: 'Joining the digits directly',
      desc: 'digits is a tuple of ints, not of characters.',
      wrong: { label: "''.join(digits)", code: "from decimal import Decimal\n''.join(Decimal('3.14').as_tuple().digits)", output: 'TypeError: sequence item 0: expected str instance, int found' },
      fix:   { label: 'map(str, …)', code: "from decimal import Decimal\n''.join(map(str, Decimal('3.14').as_tuple().digits))", output: "'314'" },
    },
  ],

  when: {
    use: [
      'Inspecting sign, digits and exponent without string parsing',
      'Counting or validating decimal places',
      'Exact conversion to other rational types with as_integer_ratio()',
    ],
    avoid: [
      'as_integer_ratio() on values that may be NaN or infinite → check is_finite() first',
      'Using the exponent of a NaN or Infinity as a number → it is a str',
      'real / imag / conjugate in Decimal-only code — they exist for the numbers.Number protocol',
    ],
  },

  notes: {
    cpython:      'DecimalTuple is a namedtuple class (fields sign, digits, exponent; a tuple subclass) made by the C module; as_integer_ratio returns the fraction in lowest terms with a positive denominator',
    'Versions':   'as_tuple() returns a DecimalTuple in every Python 3 version; as_integer_ratio() was added in 3.6',
    'Numbers protocol': 'real returns the Decimal itself, imag returns Decimal(0), conjugate() returns self — so Decimals work where complex-like numbers are expected; complex(Decimal(\'1.5\')) is (1.5+0j)',
  },

  related: [
    { name: 'Decimal()', slug: 'decimal', when: 'Build a Decimal from a tuple' },
    { name: 'normalize / adjusted', slug: 'normalize-adjusted', when: 'Exponent operations' },
    { name: 'Fraction.from_decimal', slug: 'from_float-from_decimal', when: 'Exact Decimal → Fraction', category: 'stdlib/fractions' },
    { name: 'float.as_integer_ratio()', slug: 'float-as_integer_ratio', when: 'The float version', category: 'functions' },
    { name: 'namedtuple', slug: 'namedtuple', when: 'What DecimalTuple is', category: 'stdlib/collections' },
  ],

  faq: [
    {
      q: 'How do I get the number of decimal places of a Decimal?',
      a: "-x.as_tuple().exponent for a finite x: 2 for Decimal('19.99'), 0 for Decimal('7'), negative for numbers stored with a positive exponent such as Decimal('1E+2'). Use max(0, …) if you want 0 there.",
    },
    {
      q: 'How do I convert a Decimal to a fraction?',
      a: "x.as_integer_ratio() returns (numerator, denominator) in lowest terms, e.g. (-157, 50) for Decimal('-3.14'); fractions.Fraction(x) gives a Fraction directly. Both are exact.",
    },
    {
      q: 'What is DecimalTuple?',
      a: "The named tuple type returned by as_tuple(), with fields sign, digits and exponent. You can create one yourself and pass it (or any 3-tuple) to Decimal().",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.as_tuple',
    meta:  'decimal.Decimal.as_tuple / as_integer_ratio',
  },
};
