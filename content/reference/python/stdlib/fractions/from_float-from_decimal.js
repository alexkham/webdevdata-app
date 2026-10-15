// content/reference/python/stdlib/fractions/from_float-from_decimal.js — Fraction.from_float / Fraction.from_decimal

export const meta = {
  slug:        'from_float-from_decimal',
  name:        'Fraction.from_float / Fraction.from_decimal',
  signature:   'Fraction.from_float(f)  /  Fraction.from_decimal(dec)',
  blurb:       'Strict alternative constructors: from_float takes only a float (or int), from_decimal only a Decimal (or int), and both convert exactly.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'Fraction.from_float Fraction.from_decimal from_float from_decimal classmethod float to fraction decimal to fraction exact conversion only takes floats only takes Decimals python',
};

export const method = {
  slug:      'from_float-from_decimal',
  name:      'Fraction.from_float / Fraction.from_decimal',
  signature: 'Fraction.from_float(f)  /  Fraction.from_decimal(dec)',
  returns:   { type: 'Fraction', desc: 'The exact value of the float or Decimal as a Fraction.' },

  category:    'Fraction classmethods',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Since 3.2 plain Fraction(x) accepts floats and Decimals too, so these classmethods mainly add type checking: anything other than the one type (or an int) is a TypeError instead of being parsed.',

  covers: ['Fraction.from_float', 'Fraction.from_decimal'],

  cheat: {
    commonCall: "Fraction.from_decimal(Decimal('0.3'))",
    returns:    'Fraction(3, 10); from_float(0.3) gives the binary value instead',
    replaces:   'Fraction(x) when x must be exactly one type',
    watchOut:   'Strings are rejected — use Fraction(text) for those',
  },

  parameters: [
    { name: 'f',   type: 'float | int', required: true, default: null, desc: 'from_float: a finite float, or any int / bool (passed to Fraction()).' },
    { name: 'dec', type: 'Decimal | int', required: true, default: null, desc: 'from_decimal: a finite Decimal, or any int / bool.' },
  ],

  modes: [
    {
      id: 'from_float',
      label: 'from_float',
      blurb: 'Numbers are typed as int or float literals; anything else becomes a string, which from_float refuses.',
      params: [{ name: 'x', type: 'float | int | str', hint: '0.25, 0.3, 5 or text', input: 'auto' }],
      template: 'from fractions import Fraction\nFraction.from_float({$x})',
      cases: [
        { id: 'quarter', label: '0.25', values: { x: '0.25' } },
        { id: 'three',   label: '0.3',  values: { x: '0.3' } },
        { id: 'int',     label: '5',    values: { x: '5' } },
        { id: 'str',     label: 'abc',  values: { x: 'abc' } },
      ],
    },
    {
      id: 'from_decimal',
      label: 'from_decimal',
      blurb: 'The text goes through Decimal() first; its digits are kept exactly.',
      params: [{ name: 'text', type: 'str', hint: "'0.3', '-2.5E-3'", input: 'text' }],
      template: 'from decimal import Decimal\nfrom fractions import Fraction\nFraction.from_decimal(Decimal({$text}))',
      cases: [
        { id: 'three', label: '0.3',      values: { text: '0.3' } },
        { id: 'zeros', label: '1.50',     values: { text: '1.50' } },
        { id: 'exp',   label: '-2.5E-3',  values: { text: '-2.5E-3' } },
        { id: 'nan',   label: 'NaN',      values: { text: 'NaN' } },
        { id: 'inf',   label: 'Infinity', values: { text: 'Infinity' } },
        { id: 'bad',   label: 'abc',      values: { text: 'abc' } },
      ],
    },
  ],
  demoExplainer: 'from_float(0.3) is Fraction(5404319552844595, 18014398509481984) — the float 0.3 is a little below three tenths — while Decimal("0.3") holds the decimal digits and converts to Fraction(3, 10). Trailing zeros do not matter: Decimal("1.50") gives Fraction(3, 2). NaN raises ValueError and Infinity OverflowError, as for floats. Text that is not a number fails inside Decimal() with decimal.InvalidOperation, before from_decimal runs.',

  patterns: [
    {
      name: 'Validate the input type',
      desc: 'A TypeError for anything that is not a float is the point of from_float.',
      code: 'from fractions import Fraction\nf = Fraction.from_float(reading)  # TypeError if reading is not a float or int',
    },
    {
      name: 'Exact arithmetic on Decimal data',
      desc: 'Convert once, compute exactly, convert back at the end.',
      code: 'from decimal import Decimal\nfrom fractions import Fraction\nshare = Fraction.from_decimal(total) / 3\nresult = Decimal(share.numerator) / Decimal(share.denominator)',
    },
  ],

  examples: [
    { title: 'A float with an exact binary value', code: 'from fractions import Fraction\nFraction.from_float(0.25)', returns: 'Fraction(1, 4)' },
    { title: 'Same as Fraction(float)',   code: 'from fractions import Fraction\nFraction.from_float(0.3) == Fraction(0.3)', returns: 'True' },
    { title: 'ints are accepted',          code: 'from fractions import Fraction\n(Fraction.from_float(5), Fraction.from_decimal(7))', returns: '(Fraction(5, 1), Fraction(7, 1))' },
    { title: 'Strings are not',            code: "from fractions import Fraction\nFraction.from_float('0.3')", returns: "TypeError: Fraction.from_float() only takes floats, not '0.3' (str)" },
    { title: 'Nor are Fractions',          code: 'from fractions import Fraction\nFraction.from_float(Fraction(1, 3))', returns: 'TypeError: Fraction.from_float() only takes floats, not Fraction(1, 3) (Fraction)' },
    { title: 'from_decimal refuses floats', code: 'from fractions import Fraction\nFraction.from_decimal(0.3)', returns: 'TypeError: Fraction.from_decimal() only takes Decimals, not 0.3 (float)' },
    { title: 'Infinity',                   code: "from fractions import Fraction\nFraction.from_float(float('inf'))", returns: 'OverflowError: cannot convert Infinity to integer ratio' },
  ],

  pitfalls: [
    {
      name: 'Making the Decimal from a float',
      desc: 'Decimal(0.3) captures the float exactly — all 54 digits of it — so from_decimal gains nothing. Build the Decimal from text.',
      wrong: { label: 'Decimal(0.3)', code: 'from decimal import Decimal\nfrom fractions import Fraction\nFraction.from_decimal(Decimal(0.3))', output: 'Fraction(5404319552844595, 18014398509481984)' },
      fix:   { label: "Decimal('0.3')", code: "from decimal import Decimal\nfrom fractions import Fraction\nFraction.from_decimal(Decimal('0.3'))", output: 'Fraction(3, 10)' },
    },
    {
      name: 'Expecting from_float to round to the decimal you see',
      desc: 'It is exact, not "nice". Use limit_denominator() or Fraction(str(x)) for the short form.',
      wrong: { label: 'from_float(0.3)', code: 'from fractions import Fraction\nFraction.from_float(0.3) == Fraction(3, 10)', output: 'False' },
      fix:   { label: '.limit_denominator()', code: 'from fractions import Fraction\nFraction.from_float(0.3).limit_denominator()', output: 'Fraction(3, 10)' },
    },
  ],

  when: {
    use: [
      'APIs that must reject strings or other types up front',
      'Converting Decimal data into exact rational arithmetic',
    ],
    avoid: [
      'General conversion → Fraction(x) accepts every kind, including strings',
      'Getting a simple fraction from a float → limit_denominator()',
    ],
  },

  notes: {
    cpython:   "Both are classmethods in Lib/fractions.py: an int goes through cls(f) / Decimal(int(dec)); a float or Decimal is converted with its as_integer_ratio(); anything else raises TypeError with the value's repr and type name",
    'Since 3.2': 'Fraction(float) and Fraction(Decimal) do the same exact conversion, so new code usually calls Fraction() directly',
  },

  related: [
    { name: 'Fraction()', slug: 'fraction', when: 'Accepts floats, Decimals and strings' },
    { name: 'limit_denominator', slug: 'limit_denominator', when: 'Simplify after converting a float' },
    { name: 'float.as_integer_ratio()', slug: 'float-as_integer_ratio', when: 'What from_float uses', category: 'functions' },
    { name: 'TypeError', slug: 'typeerror', when: 'What a wrong type raises', category: 'exceptions' },
    { name: 'fractions module', slug: 'fractions', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between Fraction(x) and Fraction.from_float(x)?',
      a: 'For a float, none — both are exact. The difference is in what else they accept: Fraction() also takes strings, Decimals and Fractions, while from_float raises TypeError for anything that is not a float or an int.',
    },
    {
      q: 'How do I convert a Decimal to a Fraction?',
      a: 'Fraction(d) or Fraction.from_decimal(d). Both use d.as_integer_ratio(), so Decimal("1.50") becomes Fraction(3, 2). NaN raises ValueError and infinities raise OverflowError.',
    },
    {
      q: 'Why does Fraction.from_float(0.1) have such a large denominator?',
      a: 'Because 0.1 is stored as the binary fraction 3602879701896397 / 2**55. from_float reports that stored value exactly. Use .limit_denominator() to get 1/10.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction.from_float',
    meta:  'Fraction.from_float',
  },
};
