// content/reference/python/stdlib/decimal/arithmetic.js — Decimal operators and the Context arithmetic methods

export const meta = {
  slug:        'arithmetic',
  name:        'Decimal arithmetic',
  signature:   'a + b, a - b, a * b, a / b, a // b, a % b, divmod(a, b), a ** b, pow(a, b, m), -a, +a, abs(a) · ctx.add(a, b) … ctx.fma(a, b, c)',
  blurb:       'The arithmetic operators on Decimal and their Context-method twins (add, subtract, multiply, divide, divide_int, remainder, divmod, power, minus, plus, abs), plus fma and remainder_near.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal arithmetic add subtract multiply divide floor division modulo remainder divmod power pow fma fused multiply add remainder_near Decimal.fma Decimal.remainder_near Context.add Context.subtract Context.multiply Context.divide Context.divide_int Context.remainder Context.divmod Context.power Context.minus Context.plus Context.abs Context.fma Context.remainder_near decimal negative floor division truncates',
};

export const method = {
  slug:      'arithmetic',
  name:      'Decimal arithmetic',
  signature: 'a + b, a - b, a * b, a / b, a // b, a % b, divmod(a, b), a ** b, pow(a, b, m), -a, +a, abs(a) · ctx.add(a, b) … ctx.fma(a, b, c)',
  returns:   { type: 'Decimal', desc: 'Every result is rounded to the context precision with the context rounding; divmod returns a tuple of two Decimals.' },

  category:    'Decimal operators',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Operators use the current context; ctx.add(a, b) and friends use ctx. Ints mix in freely, floats do not. Two differences from int: // truncates toward zero and % takes the sign of the dividend — and every result is rounded to prec significant digits.',

  covers: [
    'Context.add', 'Context.subtract', 'Context.multiply', 'Context.divide', 'Context.divide_int', 'Context.remainder',
    'Context.divmod', 'Context.power', 'Context.minus', 'Context.plus', 'Context.abs', 'Context.fma', 'Context.remainder_near',
    'Decimal.fma', 'Decimal.remainder_near',
  ],

  cheat: {
    commonCall: "Decimal('19.99') * 3",
    returns:    "Decimal('59.97')",
    replaces:   'float arithmetic on money',
    watchOut:   'Decimal(-7) // 2 is -3 (int gives -4); Decimal + float is a TypeError',
  },

  parameters: [
    { name: 'a, b', type: 'Decimal | int', required: true, default: null, desc: 'At least one operand of an operator is a Decimal; the other may be an int (or bool). Context methods accept int or Decimal for every operand — not str, not float.' },
    { name: 'm',    type: 'Decimal | int', required: false, default: null, desc: 'pow(a, b, m) / ctx.power(a, b, m): modular exponentiation; all three must be integral, b >= 0, m != 0 with at most prec digits.' },
    { name: 'c',    type: 'Decimal | int', required: false, default: null, desc: 'fma(a, b, c): computes a*b + c with a single rounding at the end.' },
  ],

  modes: [
    {
      id: 'ops',
      label: '+ - * /',
      blurb: 'Two Decimals under the default context (28 digits, half even).',
      params: [
        { name: 'a', type: 'str', hint: "e.g. '1.10'",  input: 'text' },
        { name: 'b', type: 'str', hint: "e.g. '2.205'", input: 'text' },
      ],
      template: 'from decimal import Decimal\na, b = Decimal({$a}), Decimal({$b})\n(a + b, a - b, a * b, a / b)',
      cases: [
        { id: 'money', label: '1.10 and 2.205', values: { a: '1.10', b: '2.205' } },
        { id: 'third', label: '1 and 3',        values: { a: '1', b: '3' } },
        { id: 'neg',   label: '-7 and 2',       values: { a: '-7', b: '2' } },
        { id: 'zero',  label: '5 and 0',        values: { a: '5', b: '0' } },
      ],
    },
    {
      id: 'intdiv',
      label: '// %',
      blurb: '// truncates toward zero and % keeps the dividend\'s sign; remainder_near picks the remainder closest to zero.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal\na, b = Decimal({$a}), Decimal({$b})\n(a // b, a % b, a.remainder_near(b))',
      cases: [
        { id: 'neg',   label: '-7, 2',        values: { a: '-7', b: '2' } },
        { id: 'negb',  label: '7, -2',        values: { a: '7', b: '-2' } },
        { id: 'near',  label: '10, 6',        values: { a: '10', b: '6' } },
        { id: 'frac',  label: '10.5, 3',      values: { a: '10.5', b: '3' } },
        { id: 'huge',  label: '1E+100, 1E-100', values: { a: '1E+100', b: '1E-100' } },
      ],
    },
    {
      id: 'power',
      label: '**',
      blurb: 'Powers under a precision you choose. Integer exponents are computed by repeated multiplication, others as exp(y·ln(x)).',
      params: [
        { name: 'base', type: 'str', hint: 'x',         input: 'text' },
        { name: 'exp',  type: 'str', hint: 'y',         input: 'text' },
        { name: 'prec', type: 'int', hint: 'precision', input: 'number' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}):\n    result = Decimal({$base}) ** Decimal({$exp})\nresult',
      cases: [
        { id: 'sqrt2', label: '2 ** 0.5',      values: { base: '2', exp: '0.5', prec: '28' } },
        { id: 'int',   label: '1.1 ** 10',     values: { base: '1.1', exp: '10', prec: '28' } },
        { id: 'big',   label: '2 ** 100, prec 10', values: { base: '2', exp: '100', prec: '10' } },
        { id: 'neg',   label: '10 ** -3',      values: { base: '10', exp: '-3', prec: '28' } },
        { id: 'root',  label: '-8 ** 0.5',     values: { base: '-8', exp: '0.5', prec: '28' } },
      ],
    },
    {
      id: 'fma',
      label: 'fma',
      blurb: 'a*b + c with one rounding (fma) versus two (multiply, then add) — at 7 digits.',
      params: [
        { name: 'a', type: 'str', hint: "e.g. '1.000001'", input: 'text' },
        { name: 'b', type: 'str', hint: "e.g. '1.000001'", input: 'text' },
        { name: 'c', type: 'int', hint: 'an int',          input: 'number' },
      ],
      template: 'from decimal import Context, Decimal\nctx = Context(prec=7)\na, b = Decimal({$a}), Decimal({$b})\n(ctx.add(ctx.multiply(a, b), {$c}), ctx.fma(a, b, {$c}))',
      cases: [
        { id: 'cancel', label: '1.000001², -1', values: { a: '1.000001', b: '1.000001', c: '-1' } },
        { id: 'plain',  label: '2 * 3 + 4',     values: { a: '2', b: '3', c: '4' } },
        { id: 'big',    label: '1234.567 * 8.9', values: { a: '1234.567', b: '8.9', c: '0' } },
      ],
    },
  ],
  demoExplainer: '1.10 + 2.205 is 3.305 exactly — results keep as many decimal places as the operands need, up to 28 significant digits; 1/3 is rounded there and 5/0 raises DivisionByZero. Integer division truncates: -7 // 2 is -3 with remainder -1 (int gives -4 and 1), and the identity a == (a // b) * b + a % b holds. remainder_near(10, 6) is -2 because 10/6 is nearest to 2. 1E+100 // 1E-100 needs more than 28 digits and raises InvalidOperation (DivisionImpossible). Integer powers are exact when they fit (1.1 ** 10 has 11 digits) and rounded otherwise; -8 ** 0.5 is invalid. fma: (1.000001)² = 1.000002000001; rounding it to 7 digits first leaves 0.000002 after subtracting 1, while fma keeps 0.000002000001.',

  patterns: [
    {
      name: 'Line total with tax, rounded once',
      desc: 'Keep full precision through the calculation; quantize the final amount.',
      code: "from decimal import Decimal, ROUND_HALF_UP\nline = Decimal('19.99') * 3\ntotal = (line * Decimal('1.19')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)",
    },
    {
      name: 'Compute in a specific context without touching the current one',
      desc: 'Context methods take the operands and do everything under that context.',
      code: 'from decimal import Context\nctx = Context(prec=50)\nratio = ctx.divide(numerator, denominator)',
    },
    {
      name: 'Floor division like int',
      desc: 'Divide, then round toward -∞ explicitly.',
      code: 'from decimal import ROUND_FLOOR\nq = (a / b).to_integral_value(rounding=ROUND_FLOOR)',
    },
  ],

  examples: [
    { title: 'Exact decimal addition',      code: "from decimal import Decimal\nDecimal('1.1') + Decimal('2.2')", returns: "Decimal('3.3')" },
    { title: 'Ints mix in freely',          code: "from decimal import Decimal\nDecimal('0.5') * 4", returns: "Decimal('2.0')" },
    { title: 'Places add up in products',   code: "from decimal import Decimal\nDecimal('1.000') * Decimal('2.00')", returns: "Decimal('2.00000')" },
    { title: '// truncates, int floors',    code: 'from decimal import Decimal\n(Decimal(-7) // 2, -7 // 2)', returns: "(Decimal('-3'), -4)" },
    { title: '% takes the dividend\'s sign', code: 'from decimal import Decimal\n(Decimal(-7) % 2, -7 % 2)', returns: "(Decimal('-1'), 1)" },
    { title: 'remainder_near',              code: 'from decimal import Decimal\nDecimal(10).remainder_near(6)', returns: "Decimal('-2')" },
    { title: 'Context methods',             code: 'from decimal import Context\nctx = Context(prec=5)\n(ctx.divide_int(7, 2), ctx.remainder(7, 2), ctx.divmod(7, 2), ctx.power(2, 10), ctx.subtract(1, 3))', returns: "(Decimal('3'), Decimal('1'), (Decimal('3'), Decimal('1')), Decimal('1024'), Decimal('-2'))" },
    { title: 'Three-argument pow',          code: 'from decimal import Decimal\npow(Decimal(2), 10, 7)', returns: "Decimal('2')" },
  ],

  pitfalls: [
    {
      name: 'Assuming // floors like int',
      desc: 'For negative quotients Decimal // rounds toward zero. Round the true quotient yourself when you need the floor.',
      wrong: { label: '//', code: 'from decimal import Decimal\nDecimal(-7) // 2', output: "Decimal('-3')" },
      fix:   { label: 'ROUND_FLOOR', code: 'from decimal import Decimal, ROUND_FLOOR\n(Decimal(-7) / 2).to_integral_value(rounding=ROUND_FLOOR)', output: "Decimal('-4')" },
    },
    {
      name: 'Rounding in the middle of a formula',
      desc: '1/3 is rounded to 28 digits before the multiplication. Multiply first when the formula allows it.',
      wrong: { label: '1 / 3 * 3', code: 'from decimal import Decimal\nDecimal(1) / 3 * 3', output: "Decimal('0.9999999999999999999999999999')" },
      fix:   { label: '1 * 3 / 3', code: 'from decimal import Decimal\nDecimal(1) * 3 / 3', output: "Decimal('1')" },
    },
    {
      name: 'Passing strings to Context methods',
      desc: 'Context methods convert ints, but not strings (that would hide the rounding create_decimal does). Make the Decimals first.',
      wrong: { label: "ctx.add('1.5', ...)", code: "from decimal import Context\nContext().add('1.5', '2')", output: 'TypeError: conversion from str to Decimal is not supported' },
      fix:   { label: "Decimal('1.5')", code: "from decimal import Context, Decimal\nContext().add(Decimal('1.5'), 2)", output: "Decimal('3.5')" },
    },
  ],

  when: {
    use: [
      'Money and quantities that must not pick up binary rounding errors',
      'ctx.method(...) to compute under a specific context without changing the current one',
      'fma() when a*b + c must be rounded only once',
    ],
    avoid: [
      'Mixing in floats → convert them with Decimal(str(x)) first',
      'Relying on // and % having int semantics for negative numbers',
      'Fractional powers when you need guaranteed correct rounding of the last digit — the C module is "almost always correctly rounded" there',
    ],
  },

  notes: {
    cpython:      'Every operator is one libmpdec call (mpd_qadd, mpd_qdiv, mpd_qdivint, mpd_qrem, mpd_qpow, …) under the current context; ctx.add etc. are the same calls with ctx. Signals raised by the operation are checked once, at the end',
    'Ideal exponents': 'Exact results keep a natural number of places: a + b uses the smaller exponent, a * b the sum of the exponents, a / b the difference (trailing zeros are removed down to it)',
    'Power':      'The result is exact when the exponent is integral and the result fits in prec digits. Otherwise the C module computes it from the correctly rounded exp() and ln(); the docs call that result well-defined but only "almost always correctly rounded" (the pure-Python _pydecimal is always correctly rounded)',
    'Zero signs': '0 - 0 is +0 except when rounding is ROUND_FLOOR; -0 + -0 is -0',
  },

  related: [
    { name: 'quantize()', slug: 'quantize', when: 'Round the final result to cents' },
    { name: 'localcontext()', slug: 'localcontext', when: 'Precision and rounding for a block' },
    { name: 'exp / ln / log10 / sqrt', slug: 'exp-ln-log10-sqrt', when: 'The transcendental functions' },
    { name: 'DivisionByZero', slug: 'divisionbyzero', when: 'x / 0' },
    { name: 'divmod()', slug: 'divmod', when: 'divmod on ints and floats', category: 'functions' },
    { name: '// operator', slug: 'floordiv', when: 'Floor division in general', category: 'operators' },
    { name: '% operator', slug: 'mod', when: 'Modulo in general', category: 'operators' },
  ],

  faq: [
    {
      q: 'Why does Decimal(-7) // 2 give -3 when -7 // 2 is -4?',
      a: 'Decimal implements the General Decimal Arithmetic "divide-integer" and "remainder" operations, which truncate toward zero; int uses floor division. In both cases a == (a // b) * b + a % b holds — Decimal(-7) % 2 is Decimal(\'-1\').',
    },
    {
      q: 'Can I add an int or a float to a Decimal?',
      a: "An int, yes: Decimal('0.5') + 1 is Decimal('1.5'). A float, no: it raises TypeError, because the float's binary error would leak into the exact result. Convert with Decimal(str(x)).",
    },
    {
      q: 'What does fma() do?',
      a: 'Fused multiply-add: a.fma(b, c) is a*b + c with the product kept exact and only the final sum rounded. Decimal(2).fma(3, 4) is Decimal(\'10\').',
    },
    {
      q: 'What is remainder_near?',
      a: 'The remainder a - n*b where n is the integer nearest to a/b (ties to even), so it can be negative: Decimal(10).remainder_near(6) is -2 because 10/6 is nearest to 2.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Context.add',
    meta:  'decimal — Context arithmetic methods',
  },
};
