// content/reference/python/stdlib/decimal/quantize.js — quantize and same_quantum

export const meta = {
  slug:        'quantize',
  name:        'Decimal.quantize',
  signature:   'Decimal.quantize(exp, rounding=None, context=None)  ·  Decimal.same_quantum(other, context=None)',
  blurb:       "Round a Decimal to the exponent of another — Decimal('0.01') means two decimal places. The tool for rounding money to cents with an explicit rule.",
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal quantize round to 2 decimal places round money to cents quantize rounding ROUND_HALF_UP Decimal.quantize Context.quantize same_quantum Decimal.same_quantum Context.same_quantum decimal places exponent fixed point InvalidOperation quantize result has too many digits',
};

export const method = {
  slug:      'quantize',
  name:      'Decimal.quantize',
  signature: 'Decimal.quantize(exp, rounding=None, context=None)  ·  Decimal.same_quantum(other, context=None)',
  returns:   { type: 'Decimal | bool', desc: 'quantize: the value rounded (or zero-padded) to exactly the exponent of exp. same_quantum: True if both exponents are equal (or both are NaN, or both infinite).' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "x.quantize(Decimal('0.01')) gives x with exactly two places — rounded if it had more, padded with zeros if it had fewer. Only the exponent of the argument matters (0.01, 1.00 and 5.55 all mean two places). Without rounding= it uses the context's rounding.",

  covers: ['Decimal.quantize', 'Context.quantize', 'Decimal.same_quantum', 'Context.same_quantum'],

  cheat: {
    commonCall: "x.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)",
    returns:    "Decimal('2.68') for Decimal('2.675')",
    replaces:   "round(float, 2) and string formatting tricks for money",
    watchOut:   'a result with more than prec digits raises InvalidOperation instead of rounding further',
  },

  parameters: [
    { name: 'exp',      type: 'Decimal | int', required: true,  default: null,   desc: "Only its exponent is used: Decimal('0.01') → 2 places, Decimal('1') → whole number, Decimal('1E+3') → thousands. A float is a TypeError." },
    { name: 'rounding', type: 'str',           required: false, default: 'None', desc: 'A ROUND_* constant; None uses the rounding of context (or of the current context).' },
    { name: 'context',  type: 'Context',       required: false, default: 'None', desc: 'Supplies the precision limit, the exponent range and the flags/traps; None means the current context.' },
  ],

  modes: [
    {
      id: 'money',
      label: 'round to a step',
      blurb: 'Your amount, step and rounding mode. (In CPython the ROUND_* constants are the strings of their names.)',
      params: [
        { name: 'amount',   type: 'str', hint: 'a number',         input: 'text' },
        { name: 'step',     type: 'str', hint: "e.g. '0.01'",       input: 'text' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name',    input: 'text' },
      ],
      template: 'from decimal import Decimal\nDecimal({$amount}).quantize(Decimal({$step}), rounding={$rounding})',
      cases: [
        { id: 'up',    label: '2.675, HALF_UP',    values: { amount: '2.675', step: '0.01', rounding: 'ROUND_HALF_UP' } },
        { id: 'even',  label: '2.665, HALF_EVEN',  values: { amount: '2.665', step: '0.01', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'down',  label: '19.999, DOWN',      values: { amount: '19.999', step: '0.01', rounding: 'ROUND_DOWN' } },
        { id: 'pad',   label: '7 → 0.01',          values: { amount: '7', step: '0.01', rounding: 'ROUND_HALF_UP' } },
        { id: 'tens',  label: '123.456 → 1E+1',    values: { amount: '123.456', step: '1E+1', rounding: 'ROUND_HALF_UP' } },
        { id: 'long',  label: '29 digits → 0.01',  values: { amount: '12345678901234567890123456789', step: '0.01', rounding: 'ROUND_HALF_UP' } },
      ],
    },
    {
      id: 'every',
      label: 'every rounding mode',
      blurb: 'One price rounded to cents with each of the eight modes.',
      params: [{ name: 'price', type: 'str', hint: 'an amount', input: 'text' }],
      template: "import decimal\nfrom decimal import Decimal\nprice = Decimal({$price})\n{m: str(price.quantize(Decimal('0.01'), rounding=getattr(decimal, m))) for m in dir(decimal) if m.startswith('ROUND_')}",
      cases: [
        { id: 'tie',   label: '2.675',  values: { price: '2.675' } },
        { id: 'neg',   label: '-2.675', values: { price: '-2.675' } },
        { id: 'even',  label: '0.125',  values: { price: '0.125' } },
        { id: 'below', label: '7.0049', values: { price: '7.0049' } },
        { id: 'exact', label: '4.20',   values: { price: '4.20' } },
      ],
    },
    {
      id: 'same',
      label: 'same_quantum',
      blurb: 'Do two Decimals have the same exponent? The second and third items show the exponents.',
      params: [
        { name: 'a', type: 'str', hint: 'a number', input: 'text' },
        { name: 'b', type: 'str', hint: 'a number', input: 'text' },
      ],
      template: 'from decimal import Decimal\na, b = Decimal({$a}), Decimal({$b})\n(a.same_quantum(b), a.as_tuple().exponent, b.as_tuple().exponent)',
      cases: [
        { id: 'cents', label: '1.50 and 2.00', values: { a: '1.50', b: '2.00' } },
        { id: 'diff',  label: '1.5 and 1.50',  values: { a: '1.5', b: '1.50' } },
        { id: 'nan',   label: 'NaN and sNaN',  values: { a: 'NaN', b: 'sNaN' } },
        { id: 'inf',   label: '±Infinity',     values: { a: 'Infinity', b: '-Infinity' } },
      ],
    },
  ],
  demoExplainer: '2.675 is a tie at two places: HALF_UP gives 2.68, while 2.665 with HALF_EVEN gives 2.66 (6 is even). ROUND_DOWN simply cuts 19.999 to 19.99, and 7 is padded to 7.00. A step of 1E+1 rounds to tens, so 123.456 becomes 1.2E+2. A 29-digit amount at two places would need 31 digits, more than the 28 of the default context, so quantize raises InvalidOperation instead of rounding further. In the every-mode tab 0.125 shows HALF_EVEN going to 0.12, and an exact 4.20 is the same in every mode. same_quantum compares exponents only: 1.5 and 1.50 are equal numbers with different exponents, and any two NaNs (or two infinities) count as the same quantum.',

  patterns: [
    {
      name: 'Round money to cents',
      desc: 'Define the step and the rule once.',
      code: "from decimal import Decimal, ROUND_HALF_UP\nCENT = Decimal('0.01')\ndef to_cents(x):\n    return x.quantize(CENT, rounding=ROUND_HALF_UP)",
    },
    {
      name: 'Display with thousands separators',
      desc: 'quantize for the value, format() for the presentation.',
      code: "from decimal import Decimal\nf\"{amount.quantize(Decimal('0.01')):,}\"   # '1,234,567.89'",
    },
    {
      name: 'Check that an input already has at most two places',
      desc: 'If quantizing changes the value, the input had more precision.',
      code: "from decimal import Decimal, ROUND_DOWN\ndef has_two_places(x):\n    return x == x.quantize(Decimal('0.01'), rounding=ROUND_DOWN)",
    },
  ],

  examples: [
    { title: 'Two decimal places',          code: "from decimal import Decimal\nDecimal('3.14159').quantize(Decimal('0.01'))", returns: "Decimal('3.14')" },
    { title: 'Padding with zeros',          code: "from decimal import Decimal\nDecimal('7').quantize(Decimal('0.01'))", returns: "Decimal('7.00')" },
    { title: 'Half up for money',           code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal('2.675').quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)", returns: "Decimal('2.68')" },
    { title: 'Whole number, half even',     code: "from decimal import Decimal\nDecimal('2.5').quantize(Decimal('1'))", returns: "Decimal('2')" },
    { title: 'Through a Context',           code: "from decimal import Decimal, Context, ROUND_DOWN\nContext(prec=5, rounding=ROUND_DOWN).quantize(Decimal('3.14159'), Decimal('0.001'))", returns: "Decimal('3.141')" },
    { title: 'Negative zero keeps its sign', code: "from decimal import Decimal\nDecimal('-0.001').quantize(Decimal('0.01'))", returns: "Decimal('-0.00')" },
    { title: 'same_quantum',                code: "from decimal import Decimal\nDecimal('1.50').same_quantum(Decimal('2.00'))", returns: 'True' },
    { title: 'Too many digits for the context', code: "from decimal import Context, Decimal\nContext(prec=3).quantize(Decimal('123.456'), Decimal('0.1'))", returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
  ],

  pitfalls: [
    {
      name: 'Passing a float as the step',
      desc: 'The exponent argument must be a Decimal (or int). A float is refused rather than converted.',
      wrong: { label: 'quantize(0.01)', code: "from decimal import Decimal\nDecimal('1.5').quantize(0.01)", output: 'TypeError: conversion from float to Decimal is not supported' },
      fix:   { label: "quantize(Decimal('0.01'))", code: "from decimal import Decimal\nDecimal('1.5').quantize(Decimal('0.01'))", output: "Decimal('1.50')" },
    },
    {
      name: 'Using round() when the rule is half up',
      desc: "round(x, 2) uses the context rounding — ROUND_HALF_EVEN by default — so 0.125 goes down to 0.12.",
      wrong: { label: 'round(x, 2)', code: "from decimal import Decimal\nround(Decimal('0.125'), 2)", output: "Decimal('0.12')" },
      fix:   { label: 'ROUND_HALF_UP', code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal('0.125').quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)", output: "Decimal('0.13')" },
    },
    {
      name: 'Quantizing a Decimal made from a float',
      desc: 'Decimal(1.005) is 1.00499999999999989…, so even half-up rounding goes down.',
      wrong: { label: 'Decimal(1.005)', code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal(1.005).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)", output: "Decimal('1.00')" },
      fix:   { label: "Decimal('1.005')", code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal('1.005').quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)", output: "Decimal('1.01')" },
    },
  ],

  when: {
    use: [
      'Rounding to a fixed number of decimal places (money, measurements, reports)',
      'Normalizing amounts to the same exponent before storing or comparing representations',
      'same_quantum() to check that two values carry the same number of places',
    ],
    avoid: [
      'Rounding to significant digits → set the context prec, or use +x under localcontext(prec=…)',
      'Rounding to an integer you want as int → round(x) or int(x.to_integral_value())',
      'Formatting only (no stored value) → format(x, ".2f")',
    ],
  },

  notes: {
    cpython:      "libmpdec's mpd_qquantize: the result has exactly exp's exponent or the operation fails with InvalidOperation (more than prec digits, exponent outside Etiny..Emax, one operand infinite)",
    'Signals':    'Inexact and Rounded when digits were dropped; never Underflow, even for subnormal results (documented behaviour)',
    'Equivalents': "round(x, n) is x.quantize(Decimal('1E-n')) under the current context; Context.quantize(a, b) is a.quantize(b, context=ctx)",
  },

  related: [
    { name: 'Rounding modes', slug: 'rounding', when: 'Values for rounding=' },
    { name: 'to_integral_value()', slug: 'to_integral', when: 'Round to a whole number' },
    { name: 'format()', slug: 'format', when: 'Print with places and separators' },
    { name: 'as_tuple()', slug: 'as_tuple-as_integer_ratio', when: 'Read the exponent' },
    { name: 'round()', slug: 'round', when: 'round(Decimal, n)', category: 'functions' },
    { name: 'InvalidOperation', slug: 'invalidoperation', when: 'When quantize cannot fit the result' },
  ],

  faq: [
    {
      q: 'How do I round a Decimal to 2 decimal places?',
      a: "x.quantize(Decimal('0.01')) — with rounding=ROUND_HALF_UP for the usual commercial rule (the default is ROUND_HALF_EVEN). The result has exactly two places, e.g. Decimal('7').quantize(Decimal('0.01')) is Decimal('7.00').",
    },
    {
      q: 'Why does quantize raise InvalidOperation?',
      a: "The result would need more digits than the context precision (a 29-digit amount at two places under the default 28 digits), the target exponent is outside the context's range, or exactly one of the operands is infinite. Raise the precision with localcontext(prec=…) for very large amounts.",
    },
    {
      q: 'What is the difference between quantize() and round(x, 2)?',
      a: "For finite values round(x, 2) is x.quantize(Decimal('0.01')) using the current context's rounding. quantize lets you pass the rounding mode and a context explicitly.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.quantize',
    meta:  'decimal.Decimal.quantize',
  },
};
