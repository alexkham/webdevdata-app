// content/reference/python/stdlib/decimal/inexact-rounded.js — Inexact and Rounded

export const meta = {
  slug:        'inexact-rounded',
  name:        'decimal.Inexact',
  signature:   'decimal.Inexact · decimal.Rounded',
  blurb:       'The two rounding signals: Rounded whenever digits were discarded, Inexact when any discarded digit was not zero. Neither is trapped by default — trap Inexact to make silent rounding an error.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: "decimal Inexact Rounded decimal.Inexact decimal.Rounded detect rounding decimal exact result check decimal lost precision trap Inexact flags[Inexact] decimal.Inexact: [<class 'decimal.Inexact'>] exact money calculation",
};

export const method = {
  slug:      'inexact-rounded',
  name:      'decimal.Inexact',
  signature: 'decimal.Inexact · decimal.Rounded',

  category:    'decimal exception',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: "Every operation that has to round its result sets the Rounded flag; if a non-zero digit was lost, it also sets Inexact. Both only set flags by default, so Decimal(1) / 3 quietly gives 28 digits. Trap Inexact inside a localcontext() and any calculation that cannot be done exactly raises decimal.Inexact instead.",

  covers: ['Inexact', 'Rounded'],

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Inexact'],

  cheat: {
    raisedBy: 'Only when trapped: any operation or conversion whose result was rounded (Rounded) and lost a non-zero digit (Inexact)',
    message:  "[<class 'decimal.Inexact'>]",
    quickFix: 'with localcontext() as ctx: ctx.traps[Inexact] = True — then compute',
    watchOut: 'Trap Inexact, not Rounded: Rounded also fires when only zeros are dropped',
  },

  modes: [
    {
      id: 'flags',
      label: 'flags',
      blurb: 'Divide in a private context of the given precision and read the two flags.',
      params: [
        { name: 'a',    type: 'str', hint: 'dividend',           input: 'text' },
        { name: 'b',    type: 'str', hint: 'divisor',            input: 'text' },
        { name: 'prec', type: 'int', hint: 'significant digits', input: 'number' },
      ],
      template: 'from decimal import Context, Decimal, Inexact, Rounded\nctx = Context(prec={$prec})\nr = ctx.divide(Decimal({$a}), Decimal({$b}))\n(r, ctx.flags[Inexact], ctx.flags[Rounded])',
      cases: [
        { id: 'exact',  label: '1 / 4, prec 5',        values: { a: '1', b: '4', prec: '5' } },
        { id: 'third',  label: '1 / 3, prec 5',        values: { a: '1', b: '3', prec: '5' } },
        { id: 'zeros',  label: '1.000000 / 1, prec 3', values: { a: '1.000000', b: '1', prec: '3' } },
        { id: 'big',    label: '123456 / 1, prec 3',   values: { a: '123456', b: '1', prec: '3' } },
      ],
    },
    {
      id: 'strict',
      label: 'strict cents',
      blurb: 'With Inexact trapped, quantize to cents succeeds only when no non-zero digit is lost.',
      params: [{ name: 'amount', type: 'str', hint: 'an amount', input: 'text' }],
      template: "from decimal import Decimal, Inexact, localcontext\nwith localcontext() as ctx:\n    ctx.traps[Inexact] = True\n    cents = Decimal({$amount}).quantize(Decimal('0.01'))\ncents",
      cases: [
        { id: 'ok',    label: '19.99',  values: { amount: '19.99' } },
        { id: 'zero',  label: '19.990', values: { amount: '19.990' } },
        { id: 'half',  label: '19.995', values: { amount: '19.995' } },
        { id: 'whole', label: '7',      values: { amount: '7' } },
        { id: 'tiny',  label: '0.001',  values: { amount: '0.001' } },
      ],
    },
  ],
  demoExplainer: "1/4 = 0.25 fits in 5 digits, so neither flag is set. 1/3 is cut to 0.33333 — non-zero digits are lost, so both are set. 1.000000 / 1 is exactly 1.000000, but 7 digits do not fit in prec 3: it becomes 1.00, which is Rounded without being Inexact. 123456 at prec 3 becomes 1.23E+5, both flags. In strict cents, 19.990 still works because only a zero is dropped, while 19.995 and 0.001 would lose a non-zero digit and raise decimal.Inexact; 7 just gains two zeros.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "([<class 'decimal.Inexact'>],) — or both classes when Inexact and Rounded are trapped together." },
  ],

  patterns: [
    {
      name: 'Refuse any rounding in a block',
      desc: 'Typical for money: additions and multiplications by integers stay exact; anything else raises.',
      code: 'from decimal import Inexact, localcontext\nwith localcontext() as ctx:\n    ctx.traps[Inexact] = True\n    total = sum(prices) * quantity',
    },
    {
      name: 'Was this result exact?',
      desc: 'Clear the flags, compute, read Inexact.',
      code: 'from decimal import Inexact, localcontext\nwith localcontext() as ctx:\n    ctx.clear_flags()\n    share = total / parts\n    exact = not ctx.flags[Inexact]',
    },
    {
      name: 'Exact square roots only',
      desc: 'A private context with Inexact trapped turns sqrt into an exact-root test.',
      code: "from decimal import Context, Decimal, Inexact\nstrict = Context(traps=[Inexact])\ntry:\n    root = Decimal(n).sqrt(context=strict)\nexcept Inexact:\n    root = None",
    },
  ],

  examples: [
    { title: 'Rounding a third sets both flags',  code: 'from decimal import Context, Decimal, Inexact, Rounded\nctx = Context(prec=5)\nr = ctx.divide(Decimal(1), Decimal(3))\n(r, ctx.flags[Inexact], ctx.flags[Rounded])', returns: "(Decimal('0.33333'), True, True)" },
    { title: 'Dropping zeros is only Rounded',    code: "from decimal import Context, Inexact, Rounded\nctx = Context(prec=2)\nr = ctx.create_decimal('1.00')\n(r, ctx.flags[Inexact], ctx.flags[Rounded])", returns: "(Decimal('1.0'), False, True)" },
    { title: 'Trap Inexact: rounding becomes an error', code: 'from decimal import Decimal, Inexact, localcontext\nwith localcontext() as ctx:\n    ctx.traps[Inexact] = True\n    r = Decimal(10) / 3\nr', returns: "decimal.Inexact: [<class 'decimal.Inexact'>]" },
    { title: 'Exact money math still works',      code: "from decimal import Decimal, Inexact, localcontext\nwith localcontext() as ctx:\n    ctx.traps[Inexact] = True\n    r = Decimal('19.99') * 3\nr", returns: "Decimal('59.97')" },
    { title: 'Both trapped: two conditions',      code: 'from decimal import Decimal, Inexact, Rounded, localcontext\nwith localcontext(traps=[Inexact, Rounded]):\n    r = Decimal(1) / 3\nr', returns: "decimal.Inexact: [<class 'decimal.Inexact'>, <class 'decimal.Rounded'>]" },
    { title: 'Overflow is caught as Inexact',     code: "from decimal import Decimal, Inexact\ntry:\n    Decimal('9E+999999') * 10\nexcept Inexact as e:\n    r = type(e).__name__\nr", returns: "'Overflow'" },
    { title: 'An exact-root test',                code: 'from decimal import Context, Decimal, Inexact\nDecimal(2).sqrt(context=Context(traps=[Inexact]))', returns: "decimal.Inexact: [<class 'decimal.Inexact'>]" },
    { title: 'to_integral_value never signals',   code: "from decimal import Context, Decimal, Inexact\nDecimal('1.5').to_integral_value(context=Context(traps=[Inexact]))", returns: "Decimal('2')" },
  ],

  pitfalls: [
    {
      name: 'Trapping Rounded to detect lost digits',
      desc: 'Rounded fires whenever digits are dropped, even zeros — here nothing of value is lost. Inexact is the signal for real loss.',
      wrong: { label: 'traps[Rounded]', code: "from decimal import Decimal, Rounded, localcontext\nwith localcontext(prec=2) as ctx:\n    ctx.traps[Rounded] = True\n    r = +Decimal('1.00')\nr", output: "decimal.Rounded: [<class 'decimal.Rounded'>]" },
      fix:   { label: 'traps[Inexact]', code: "from decimal import Decimal, Inexact, localcontext\nwith localcontext(prec=2) as ctx:\n    ctx.traps[Inexact] = True\n    r = +Decimal('1.00')\nr", output: "Decimal('1.0')" },
    },
    {
      name: 'Assuming Decimal never rounds',
      desc: 'Decimal + - * are exact as long as the result fits in prec digits, but division and roots round to prec digits silently. Trap Inexact where that must not happen.',
      wrong: { label: 'silent',   code: 'from decimal import Decimal\nDecimal(10) / 3', output: "Decimal('3.333333333333333333333333333')" },
      fix:   { label: 'trapped',  code: 'from decimal import Decimal, Inexact, localcontext\nwith localcontext() as ctx:\n    ctx.traps[Inexact] = True\n    r = Decimal(10) / 3\nr', output: "decimal.Inexact: [<class 'decimal.Inexact'>]" },
    },
  ],

  when: {
    use: [
      'Trapping Inexact for ledgers and invoices where every step must be exact',
      'Reading ctx.flags[Inexact] after a calculation to report whether it was rounded',
      'Context(traps=[Inexact]) as a strict context for one method call (sqrt, divide)',
    ],
    avoid: [
      'Trapping Rounded — it also fires for harmless trailing-zero removal',
      'Trapping Inexact around code that must divide (shares, averages): round deliberately with quantize instead',
    ],
  },

  notes: {
    cpython:      'Inexact(DecimalException) and Rounded(DecimalException). Overflow has the bases (Inexact, Rounded) and Underflow (Inexact, Rounded, Subnormal), so except Inexact also catches them',
    'Rounded vs Inexact': 'Rounded: digits were discarded (possibly only zeros). Inexact: a discarded digit was non-zero. Inexact always comes with Rounded',
    'Default':    'Neither is trapped in DefaultContext, BasicContext or ExtendedContext',
    'Rounding methods': 'quantize, to_integral_exact and round(x, n) signal Inexact and Rounded when they drop non-zero digits; to_integral_value and format() round without setting either flag',
  },

  related: [
    { name: 'DecimalException',   slug: 'decimalexception', when: 'Signals, flags and traps' },
    { name: 'localcontext()',     slug: 'localcontext',     when: 'Trap for one block' },
    { name: 'quantize()',         slug: 'quantize',         when: 'Round deliberately to cents' },
    { name: 'to_integral_exact()', slug: 'to_integral',     when: 'The rounding that does signal' },
    { name: 'Overflow and Underflow', slug: 'overflow-underflow', when: 'Subclasses of Inexact and Rounded' },
    { name: 'Context',            slug: 'context',          when: 'prec and the flags' },
  ],

  faq: [
    {
      q: 'How do I know if a Decimal calculation was exact?',
      a: 'Clear the flags, compute, then check ctx.flags[Inexact] — True means a non-zero digit was rounded away. Or trap Inexact so that an inexact result raises decimal.Inexact.',
    },
    {
      q: 'What is the difference between Inexact and Rounded in decimal?',
      a: "Rounded means the result had more digits than the precision and some were dropped; Inexact means at least one dropped digit was not zero. Making 1.00 fit in 2 digits (1.0) is Rounded only; 1/3 at 5 digits (0.33333) is both.",
    },
    {
      q: 'Why does Decimal(1) / 3 not raise an error?',
      a: 'Inexact is not trapped by default — the result is rounded to the context precision (28 digits) and only the flag is set. Trap it with ctx.traps[Inexact] = True inside localcontext() if you want an exception.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Inexact',
    meta:  'decimal.Inexact and decimal.Rounded',
  },
};
