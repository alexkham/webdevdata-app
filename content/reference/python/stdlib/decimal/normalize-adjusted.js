// content/reference/python/stdlib/decimal/normalize-adjusted.js — normalize, adjusted, logb, scaleb

export const meta = {
  slug:        'normalize-adjusted',
  name:        'Decimal.normalize',
  signature:   'Decimal.normalize(context=None)  ·  Decimal.adjusted()  ·  Decimal.logb(context=None)  ·  Decimal.scaleb(other, context=None)',
  blurb:       'Work with the exponent: strip trailing zeros (normalize), read the position of the first digit (adjusted, logb), or multiply by a power of ten exactly (scaleb).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal normalize remove trailing zeros adjusted logb scaleb Decimal.normalize Decimal.adjusted Decimal.logb Decimal.scaleb Context.normalize Context.logb Context.scaleb strip zeros exponent order of magnitude multiply by power of ten reduce',
};

export const method = {
  slug:      'normalize-adjusted',
  name:      'Decimal.normalize',
  signature: 'Decimal.normalize(context=None)  ·  Decimal.adjusted()  ·  Decimal.logb(context=None)  ·  Decimal.scaleb(other, context=None)',
  returns:   { type: 'Decimal | int', desc: 'normalize: the value with trailing zeros removed; adjusted: an int; logb: the same number as a Decimal; scaleb: the value times 10**other.' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "A Decimal is coefficient × 10**exponent, and many representations share one value: 1.200, 1.20 and 1.2. normalize() picks the shortest one; adjusted() tells you where the first digit sits (0 for 1.2, 2 for 120, -2 for 0.05); scaleb(n) moves the decimal point n places without any rounding of the digits.",

  covers: ['Decimal.normalize', 'Decimal.adjusted', 'Decimal.logb', 'Decimal.scaleb', 'Context.normalize', 'Context.logb', 'Context.scaleb'],

  cheat: {
    commonCall: "Decimal('1.200').normalize()",
    returns:    "Decimal('1.2')",
    replaces:   "string tricks like str(x).rstrip('0')",
    watchOut:   "Decimal('100').normalize() is Decimal('1E+2') — format it with 'f' for display",
  },

  parameters: [
    { name: 'other',   type: 'Decimal | int', required: true,  default: null,   desc: 'scaleb: the power of ten, an integer (a non-integral Decimal is InvalidOperation).' },
    { name: 'context', type: 'Context',       required: false, default: 'None', desc: 'normalize, logb, scaleb round to it and signal through it. adjusted() needs no context.' },
  ],

  modes: [
    {
      id: 'parts',
      label: 'all four',
      blurb: 'normalize, adjusted, logb and scaleb(n) of one number.',
      params: [
        { name: 'x', type: 'str', hint: 'a number',      input: 'text' },
        { name: 'n', type: 'int', hint: 'scaleb power',  input: 'number' },
      ],
      template: 'from decimal import Decimal\nx = Decimal({$x})\n(x.normalize(), x.adjusted(), x.logb(), x.scaleb({$n}))',
      cases: [
        { id: 'zeros', label: '1.200, 2',   values: { x: '1.200', n: '2' } },
        { id: 'hund',  label: '120, -1',    values: { x: '120', n: '-1' } },
        { id: 'small', label: '0.0500, 3',  values: { x: '0.0500', n: '3' } },
        { id: 'big',   label: '123.456, 5', values: { x: '123.456', n: '5' } },
        { id: 'zero',  label: '0.00',       values: { x: '0.00', n: '1' } },
      ],
    },
    {
      id: 'dedupe',
      label: 'dedupe',
      blurb: 'A set keeps one of each value but whichever representation came first; normalizing first makes them identical.',
      params: [{ name: 'csv', type: 'str', hint: 'comma-separated numbers', input: 'text' }],
      template: "from decimal import Decimal\nvalues = [Decimal(s) for s in {$csv}.split(',')]\n(sorted(set(values)), sorted({v.normalize() for v in values}))",
      cases: [
        { id: 'ones',  label: '1.0,1.00,1,2.50,2.5', values: { csv: '1.0,1.00,1,2.50,2.5' } },
        { id: 'tens',  label: '10,1E+1,10.0',        values: { csv: '10,1E+1,10.0' } },
        { id: 'zeros', label: '0,-0,0.000',          values: { csv: '0,-0,0.000' } },
      ],
    },
  ],
  demoExplainer: "1.200 normalizes to 1.2 and 120 to 1.2E+2 (the zero is absorbed into the exponent). adjusted() is the exponent of the first significant digit — 0 for 1.200, 2 for 120, -2 for 0.0500 — and logb() is the same number as a Decimal, except that logb(0) signals DivisionByZero (here it raises), while adjusted() of a zero just reports its exponent. scaleb only changes the exponent: 123.456 scaled by 5 keeps its six digits and prints as 1.23456E+7. In the dedupe tab the set keeps the first spelling it met (1.0, 2.50) and normalize() turns every spelling into the shortest one; 10, 1E+1 and 10.0 all normalize to 1E+1.",

  patterns: [
    {
      name: 'Strip trailing zeros for display',
      desc: "normalize, then format with 'f' so no exponent appears.",
      code: "def clean(x):\n    return format(x.normalize(), 'f')   # Decimal('100.00') -> '100'",
    },
    {
      name: 'Number of digits before the point',
      desc: 'adjusted() + 1 for numbers >= 1.',
      code: 'int_digits = max(x.adjusted() + 1, 1)',
    },
    {
      name: 'Convert between units of ten',
      desc: 'scaleb keeps all digits: cents to euros, millimetres to metres.',
      code: "from decimal import Decimal\neuros = Decimal(cents).scaleb(-2)",
    },
  ],

  examples: [
    { title: 'Trailing zeros removed',  code: "from decimal import Decimal\nDecimal('32.100').normalize()", returns: "Decimal('32.1')" },
    { title: '…even before the point',  code: "from decimal import Decimal\nDecimal('120').normalize()", returns: "Decimal('1.2E+2')" },
    { title: 'adjusted()',              code: "from decimal import Decimal\nDecimal('321e+5').adjusted()", returns: '7' },
    { title: 'adjusted() of small numbers and zeros', code: "from decimal import Decimal\nDecimal('0.05').adjusted(), Decimal(0).adjusted(), Decimal('0.00').adjusted()", returns: '(-2, 0, -2)' },
    { title: 'logb() as a Decimal',     code: "from decimal import Decimal\nDecimal('123.456').logb()", returns: "Decimal('2')" },
    { title: 'scaleb() moves the point', code: "from decimal import Decimal\nDecimal('1.5').scaleb(3)", returns: "Decimal('1.5E+3')" },
    { title: 'Context versions round',  code: "from decimal import Context, Decimal\nctx = Context(prec=3)\n(ctx.logb(Decimal('0.0123')), ctx.scaleb(Decimal('1.2345'), 2), ctx.normalize(Decimal('-0.0')))", returns: "(Decimal('-2'), Decimal('123'), Decimal('-0'))" },
    { title: 'logb(0) is a division by zero', code: 'from decimal import Decimal\nDecimal(0).logb()', returns: "decimal.DivisionByZero: [<class 'decimal.DivisionByZero'>]" },
  ],

  pitfalls: [
    {
      name: 'Printing a normalized number',
      desc: 'Removing the zeros of 100.00 leaves coefficient 1 with exponent 2, and str() shows that as 1E+2.',
      wrong: { label: 'str(x.normalize())', code: "from decimal import Decimal\nstr(Decimal('100.00').normalize())", output: "'1E+2'" },
      fix:   { label: "format(…, 'f')", code: "from decimal import Decimal\nformat(Decimal('100.00').normalize(), 'f')", output: "'100'" },
    },
    {
      name: 'Forgetting that normalize() rounds',
      desc: 'normalize applies the context first, like unary plus. A 31-digit value loses digits under the default 28.',
      wrong: { label: 'normalize()', code: "from decimal import Decimal\nx = Decimal('1234567890123456789012345678900.00')\nx.normalize()", output: "Decimal('1.234567890123456789012345679E+30')" },
      fix:   { label: 'enough precision', code: "from decimal import Context, Decimal\nx = Decimal('1234567890123456789012345678900.00')\nContext(prec=40).normalize(x)", output: "Decimal('1.2345678901234567890123456789E+30')" },
    },
  ],

  when: {
    use: [
      'normalize() before storing or comparing representations (cache keys, deduplication)',
      'adjusted() to find the order of magnitude without logarithms',
      'scaleb() for exact power-of-ten conversions',
    ],
    avoid: [
      'normalize() for a fixed number of places → quantize()',
      'normalize() on numbers longer than the precision → use a context with enough digits',
      'logb() on values that may be zero → adjusted(), or check is_zero() first',
    ],
  },

  notes: {
    cpython:      "libmpdec's mpd_qreduce (normalize), mpd_adjexp (adjusted), mpd_qlogb, mpd_qscaleb",
    'normalize':  'Same as unary plus followed by stripping trailing zeros (with clamp=1 the exponent cannot exceed Etop()); a zero becomes 0 with exponent 0 and keeps its sign. The specification also calls it reduce',
    'adjusted':   'exponent + number of digits - 1; for Infinity and NaN it returns 0',
    'scaleb':     'other must be an integer between -2·(Emax + prec) and 2·(Emax + prec); the result is rounded and range-checked like any result',
  },

  related: [
    { name: 'quantize()', slug: 'quantize', when: 'A fixed exponent instead of the shortest' },
    { name: 'as_tuple()', slug: 'as_tuple-as_integer_ratio', when: 'Read coefficient digits and exponent' },
    { name: 'format()', slug: 'format', when: 'Display without exponent notation' },
    { name: 'DivisionByZero', slug: 'divisionbyzero', when: 'What logb(0) signals' },
  ],

  faq: [
    {
      q: 'How do I remove trailing zeros from a Decimal?',
      a: "x.normalize(): Decimal('1.200').normalize() is Decimal('1.2'). Whole numbers with zeros turn into exponent form (Decimal('100').normalize() is Decimal('1E+2')), so print them with format(x, 'f').",
    },
    {
      q: 'What does Decimal.adjusted() return?',
      a: "The exponent of the most significant digit, as an int: 2 for 123.45, -2 for 0.05. It is what the context's Emin and Emax are compared with.",
    },
    {
      q: 'What is the difference between scaleb() and multiplying by 10**n?',
      a: 'The value is the same, but scaleb only changes the exponent, so the coefficient keeps its digits (Decimal(\'1.5\').scaleb(3) is 1.5E+3); multiplying by Decimal(1000) gives 1500.0. Both round to the context if needed.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.normalize',
    meta:  'decimal.Decimal.normalize',
  },
};
