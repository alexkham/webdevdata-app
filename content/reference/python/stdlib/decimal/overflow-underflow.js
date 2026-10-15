// content/reference/python/stdlib/decimal/overflow-underflow.js — Overflow, Underflow, Subnormal, Clamped

export const meta = {
  slug:        'overflow-underflow',
  name:        'decimal.Overflow',
  signature:   'decimal.Overflow · decimal.Underflow · decimal.Subnormal · decimal.Clamped',
  blurb:       'The exponent-limit signals. Overflow: a result above Emax (trapped by default). Subnormal and Underflow: a result below Emin, losing digits or becoming 0. Clamped: an exponent changed to fit.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: "decimal Overflow Underflow Subnormal Clamped decimal.Overflow decimal.Underflow decimal.Subnormal decimal.Clamped decimal.Overflow: [<class 'decimal.Overflow'>] Emax Emin Etiny Etop clamp fold-down decimal too large decimal infinity overflow underflow to zero subnormal number",
};

export const method = {
  slug:      'overflow-underflow',
  name:      'decimal.Overflow',
  signature: 'decimal.Overflow · decimal.Underflow · decimal.Subnormal · decimal.Clamped',

  category:    'decimal exception',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: "A Decimal's exponent must stay within the context's Emin and Emax (±999999 by default). Going above raises decimal.Overflow; untrapped it becomes Infinity or the largest finite number, depending on the rounding mode. Going below is quieter: the result turns Subnormal (fewer digits), and if digits are lost it is an Underflow — possibly all the way to 0 — with only flags set unless you trap them.",

  covers: ['Overflow', 'Underflow', 'Subnormal', 'Clamped'],

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException', 'Rounded', 'Inexact', 'Overflow'],

  cheat: {
    raisedBy: 'Overflow: a result above Emax after rounding (trapped by default). Underflow, Subnormal, Clamped: only when trapped',
    message:  "[<class 'decimal.Overflow'>]",
    quickFix: 'except decimal.Overflow (not OverflowError), or raise Emax / untrap it inside localcontext()',
    watchOut: 'Underflow is silent by default: a too-small result quietly becomes 0',
  },

  modes: [
    {
      id: 'overflow',
      label: 'overflow',
      blurb: 'Multiply in a tiny context (prec 3, Emax 9, no traps): what overflow returns under each rounding mode.',
      params: [
        { name: 'a',        type: 'str', hint: 'a number',       input: 'text' },
        { name: 'b',        type: 'str', hint: 'a number',       input: 'text' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name', input: 'text' },
      ],
      template: 'from decimal import Context, Decimal\nctx = Context(prec=3, Emax=9, rounding={$rounding}, traps=[])\nr = ctx.multiply(Decimal({$a}), Decimal({$b}))\n(r, [s.__name__ for s, on in ctx.flags.items() if on])',
      cases: [
        { id: 'even',  label: 'half even',      values: { a: '5E+5', b: '5E+5', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'down',  label: 'ROUND_DOWN',     values: { a: '5E+5', b: '5E+5', rounding: 'ROUND_DOWN' } },
        { id: 'ceil',  label: 'negative, CEILING', values: { a: '-5E+5', b: '5E+5', rounding: 'ROUND_CEILING' } },
        { id: 'floor', label: 'negative, FLOOR',   values: { a: '-5E+5', b: '5E+5', rounding: 'ROUND_FLOOR' } },
        { id: 'fits',  label: '5E+4 × 2E+4',    values: { a: '5E+4', b: '2E+4', rounding: 'ROUND_HALF_EVEN' } },
      ],
    },
    {
      id: 'underflow',
      label: 'subnormal & underflow',
      blurb: 'Divide in a context with prec 3 and Emin -9 (so Etiny is -11): what happens below Emin.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Context, Decimal\nctx = Context(prec=3, Emin=-9, traps=[])\nr = ctx.divide(Decimal({$a}), Decimal({$b}))\n(r, ctx.is_subnormal(r), [s.__name__ for s, on in ctx.flags.items() if on])',
      cases: [
        { id: 'sub',    label: '1E-9 / 4',     values: { a: '1E-9', b: '4' } },
        { id: 'under',  label: '1E-9 / 3',     values: { a: '1E-9', b: '3' } },
        { id: 'zero',   label: '1E-9 / 1E+5',  values: { a: '1E-9', b: '1E+5' } },
        { id: 'normal', label: '1 / 4',        values: { a: '1', b: '4' } },
      ],
    },
    {
      id: 'clamp',
      label: 'clamp',
      blurb: 'create_decimal() in a context with prec 5 and Emax 9: clamp=1 limits the exponent to Etop (5) by appending zeros.',
      params: [
        { name: 'x',     type: 'str', hint: 'a number', input: 'text' },
        { name: 'clamp', type: 'int', hint: '0 or 1',   input: 'number' },
      ],
      template: 'from decimal import Clamped, Context\nctx = Context(prec=5, Emax=9, clamp={$clamp})\nr = ctx.create_decimal({$x})\n(r, ctx.flags[Clamped])',
      cases: [
        { id: 'fold',   label: '1E+9, clamp=1',   values: { x: '1E+9', clamp: '1' } },
        { id: 'nofold', label: '1E+9, clamp=0',   values: { x: '1E+9', clamp: '0' } },
        { id: 'fold3',  label: '123E+7, clamp=1', values: { x: '123E+7', clamp: '1' } },
        { id: 'zero',   label: '0E+20, clamp=0',  values: { x: '0E+20', clamp: '0' } },
        { id: 'over',   label: '1E+10, clamp=0',  values: { x: '1E+10', clamp: '0' } },
      ],
    },
  ],
  demoExplainer: "2.5E+11 does not fit under Emax=9. Untrapped, the half-even (and half-up, half-down, UP) result is Infinity; ROUND_DOWN gives the largest finite number 9.99E+9; for a negative result CEILING rounds toward zero (-9.99E+9) and FLOOR away from it (-Infinity). Overflow always comes with Inexact and Rounded. In the second tab 2.5E-10 is below Emin but exact — Subnormal only. 1E-9 / 3 = 3.33…E-10 can keep only the digits down to Etiny = -11, so it is rounded to 3.3E-10 and also flagged Underflow, Inexact and Rounded. 1E-14 is below Etiny itself: it underflows to 0E-11, and Clamped is set as well. In clamp, 1E+9 with clamp=1 becomes 1.0000E+9 (fold-down, Clamped); with clamp=0 it stays 1E+9. A zero's exponent is simply clamped to Emax (0E+9). 1E+10 is above Emax and Overflow is trapped in a new Context, so it raises.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "The list of trapped conditions, e.g. ([<class 'decimal.Overflow'>],)." },
  ],

  patterns: [
    {
      name: 'Catch an overflow',
      desc: 'decimal.Overflow is not the built-in OverflowError.',
      code: "import decimal\ntry:\n    result = base ** exponent\nexcept decimal.Overflow:\n    result = decimal.Decimal('Infinity')",
    },
    {
      name: 'Refuse results that lose digits near zero',
      desc: 'Trap Underflow (and Subnormal if even exact tiny results are unwanted).',
      code: 'from decimal import Underflow, localcontext\nwith localcontext() as ctx:\n    ctx.traps[Underflow] = True\n    result = a * b',
    },
    {
      name: 'IEEE 754 decimal64-style limits',
      desc: 'A context with the decimal64 precision and exponent range, clamp on.',
      code: 'from decimal import Context\nd64 = Context(prec=16, Emax=384, Emin=-383, clamp=1)',
    },
  ],

  examples: [
    { title: 'Overflow is trapped by default',  code: "from decimal import Decimal\nDecimal('1E+999999') * 10", returns: "decimal.Overflow: [<class 'decimal.Overflow'>]" },
    { title: 'A runaway power',                 code: 'from decimal import Decimal\nDecimal(10) ** 1000000', returns: "decimal.Overflow: [<class 'decimal.Overflow'>]" },
    { title: 'ROUND_DOWN stops at the largest finite number', code: "from decimal import ROUND_DOWN, Context, Decimal\nctx = Context(prec=3, Emax=9, rounding=ROUND_DOWN, traps=[])\nctx.multiply(Decimal('5E+5'), Decimal('5E+5'))", returns: "Decimal('9.99E+9')" },
    { title: 'Underflow quietly gives 0',       code: "from decimal import Context, Decimal\nContext(prec=3, Emin=-9).divide(Decimal('1E-9'), Decimal('1E+5'))", returns: "Decimal('0E-11')" },
    { title: 'Subnormal: fewer digits',         code: "from decimal import Context, Decimal\nContext(prec=5, Emin=-9).divide(Decimal(1), Decimal('3E+9'))", returns: "Decimal('3.333E-10')" },
    { title: 'Fold-down with clamp=1',          code: "from decimal import Context\nContext(prec=5, Emax=9, clamp=1).create_decimal('1E+9')", returns: "Decimal('1.0000E+9')" },
    { title: 'One over infinity',               code: "from decimal import Decimal\nDecimal(1) / Decimal('Infinity')", returns: "Decimal('0E-1000026')" },
    { title: 'Overflow is Inexact and Rounded', code: 'from decimal import Overflow, Underflow\n[c.__name__ for c in Overflow.__bases__], [c.__name__ for c in Underflow.__bases__]', returns: "(['Inexact', 'Rounded'], ['Inexact', 'Rounded', 'Subnormal'])" },
  ],

  pitfalls: [
    {
      name: 'Catching OverflowError',
      desc: 'Float and int conversions raise the built-in OverflowError, but Decimal arithmetic raises decimal.Overflow, which is not a subclass of it.',
      wrong: { label: 'except OverflowError',   code: "from decimal import Decimal\ntry:\n    Decimal(10) ** 1000000\nexcept OverflowError:\n    r = 'too big'\nr", output: "decimal.Overflow: [<class 'decimal.Overflow'>]" },
      fix:   { label: 'except decimal.Overflow', code: "import decimal\ntry:\n    decimal.Decimal(10) ** 1000000\nexcept decimal.Overflow:\n    r = 'too big'\nr", output: "'too big'" },
    },
    {
      name: 'Expecting a too-small result to raise',
      desc: 'Underflow is not trapped by default; the quotient below is rounded to zero without any error. Trap it where that matters.',
      wrong: { label: 'default traps',   code: "from decimal import Decimal\nDecimal('1E-999999') / Decimal('1E+30')", output: "Decimal('0E-1000026')" },
      fix:   { label: 'trap Underflow',  code: "from decimal import Decimal, Underflow, localcontext\nwith localcontext() as ctx:\n    ctx.traps[Underflow] = True\n    r = Decimal('1E-999999') / Decimal('1E+30')\nr", output: "decimal.Underflow: [<class 'decimal.Underflow'>]" },
    },
  ],

  when: {
    use: [
      'except decimal.Overflow around powers, exp() and multiplications of untrusted sizes',
      'Small Emin/Emax contexts to emulate fixed-width decimal formats (decimal32/64/128 with clamp=1)',
      'Trapping Underflow when a silent zero would corrupt a result',
    ],
    avoid: [
      'except OverflowError for Decimal arithmetic — it does not catch decimal.Overflow',
      'Trapping Clamped or Subnormal in everyday code — they describe representation details, not errors',
    ],
  },

  notes: {
    cpython:      'Overflow(Inexact, Rounded), Underflow(Inexact, Rounded, Subnormal), Subnormal(DecimalException), Clamped(DecimalException). DefaultContext traps Overflow only; BasicContext also traps Underflow and Clamped',
    'Overflow result': 'Untrapped: Infinity with the sign of the result for ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN and ROUND_UP; the largest finite number (all 9s) for ROUND_DOWN and ROUND_05UP; ROUND_CEILING gives +Infinity or the largest negative finite number, ROUND_FLOOR the mirror image',
    'Subnormal':  'A non-zero result whose adjusted exponent is below Emin. Its exponent cannot go below Etiny = Emin - prec + 1, so it keeps fewer significant digits',
    'Underflow':  'A subnormal result that also had to be rounded (Inexact). Rounded all the way it becomes 0 with exponent Etiny, and Clamped is set too',
    'Clamped':    'An exponent was changed to fit: a zero beyond the limits, a result below Etiny, or (with clamp=1) a large number folded down to exponent Etop = Emax - prec + 1 by appending zeros',
  },

  related: [
    { name: 'DecimalException',     slug: 'decimalexception', when: 'Signals, flags and traps' },
    { name: 'Inexact and Rounded',  slug: 'inexact-rounded',  when: 'The parents of Overflow and Underflow' },
    { name: 'Context',              slug: 'context',          when: 'Emin, Emax, Etiny, Etop, clamp' },
    { name: 'MAX_EMAX and MIN_EMIN', slug: 'limits',          when: 'The largest possible exponent range' },
    { name: 'is_subnormal()',       slug: 'predicates',       when: 'Test a value against Emin' },
    { name: 'OverflowError',        slug: 'overflowerror',    when: 'The unrelated built-in', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the largest number a Python Decimal can hold?',
      a: "It depends on the context: the adjusted exponent may not exceed Emax, 999999 by default, so with prec=28 the largest finite value is Decimal('9.999999999999999999999999999E+999999') — 28 nines. The exponent range can be widened up to MAX_EMAX; going beyond Emax raises decimal.Overflow.",
    },
    {
      q: 'Why did my tiny Decimal result become 0E-1000026?',
      a: 'The true result was smaller than the context can represent (below Etiny = Emin - prec + 1), so it underflowed to zero. Underflow is not trapped by default; trap it, or widen Emin with localcontext(Emin=...), if that matters.',
    },
    {
      q: 'What is a subnormal Decimal?',
      a: 'A non-zero number whose adjusted exponent is below Emin. It is still exact if no digits were lost, but it cannot have the full precision because the exponent may not go below Etiny. is_subnormal() tests for it and the Subnormal flag records it.',
    },
    {
      q: 'Is decimal.Overflow the same as OverflowError?',
      a: 'No. decimal.Overflow derives from DecimalException (via Inexact and Rounded) and ArithmeticError, not from OverflowError, so except OverflowError does not catch it. OverflowError is what int() raises for Decimal Infinity.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Overflow',
    meta:  'decimal.Overflow, Underflow, Subnormal, Clamped',
  },
};
