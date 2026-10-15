// content/reference/python/stdlib/decimal/to_integral.js — to_integral_value, to_integral_exact, to_integral

export const meta = {
  slug:        'to_integral',
  name:        'Decimal.to_integral_value',
  signature:   'Decimal.to_integral_value(rounding=None, context=None)  ·  Decimal.to_integral_exact(rounding=None, context=None)  ·  Decimal.to_integral(rounding=None, context=None)',
  blurb:       'Round a Decimal to a whole number but keep it a Decimal. to_integral_exact also signals Inexact / Rounded; to_integral is an old alias of to_integral_value.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal round to integer to_integral_value to_integral_exact to_integral Decimal.to_integral_value Decimal.to_integral_exact Decimal.to_integral Context.to_integral_value Context.to_integral_exact Context.to_integral decimal round whole number floor ceil int trunc decimal to int',
};

export const method = {
  slug:      'to_integral',
  name:      'Decimal.to_integral_value',
  signature: 'Decimal.to_integral_value(rounding=None, context=None)  ·  Decimal.to_integral_exact(rounding=None, context=None)  ·  Decimal.to_integral(rounding=None, context=None)',
  returns:   { type: 'Decimal', desc: 'The nearest whole number (by the rounding mode) as a Decimal; values with exponent >= 0, infinities and quiet NaNs come back unchanged.' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'The Decimal-to-Decimal way to drop the fraction, with any rounding mode. For an int, use round(x) (half even), int(x) (toward zero), math.floor or math.ceil — they raise for NaN and infinity, where to_integral_value just passes them through.',

  covers: ['Decimal.to_integral_value', 'Decimal.to_integral_exact', 'Decimal.to_integral', 'Context.to_integral_value', 'Context.to_integral_exact', 'Context.to_integral'],

  cheat: {
    commonCall: 'x.to_integral_value(rounding=ROUND_HALF_UP)',
    returns:    "Decimal('3') for Decimal('2.5')",
    replaces:   'quantize(Decimal(1)) when the exponent should not change for big values',
    watchOut:   "Decimal('1E+3').to_integral_value() stays Decimal('1E+3') — it is already integral",
  },

  parameters: [
    { name: 'rounding', type: 'str',     required: false, default: 'None', desc: "A ROUND_* constant; None uses the context's rounding (ROUND_HALF_EVEN by default)." },
    { name: 'context',  type: 'Context', required: false, default: 'None', desc: 'Supplies the rounding (when rounding is None) and, for to_integral_exact, receives the Inexact / Rounded flags.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'vs round / int / floor / ceil',
      blurb: 'to_integral_value with your rounding mode next to the built-in ways of getting an int.',
      params: [
        { name: 'x',        type: 'str', hint: 'a number',       input: 'text' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name', input: 'text' },
      ],
      template: 'import math\nfrom decimal import Decimal\nx = Decimal({$x})\n(x.to_integral_value(rounding={$rounding}), round(x), int(x), math.floor(x), math.ceil(x))',
      cases: [
        { id: 'tie',  label: '2.5, HALF_UP',  values: { x: '2.5', rounding: 'ROUND_HALF_UP' } },
        { id: 'neg',  label: '-2.5, HALF_UP', values: { x: '-2.5', rounding: 'ROUND_HALF_UP' } },
        { id: 'down', label: '3.7, DOWN',     values: { x: '3.7', rounding: 'ROUND_DOWN' } },
        { id: 'big',  label: '1E+3',          values: { x: '1E+3', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'nan',  label: 'NaN',           values: { x: 'NaN', rounding: 'ROUND_HALF_EVEN' } },
      ],
    },
    {
      id: 'exact',
      label: 'value vs exact',
      blurb: 'Same result, different signals: to_integral_exact records Inexact and Rounded in its context.',
      params: [{ name: 'x', type: 'str', hint: 'a number', input: 'text' }],
      template: 'from decimal import Decimal, Context\nx = Decimal({$x})\nc1, c2 = Context(), Context()\n(c1.to_integral_value(x), c2.to_integral_exact(x), [s.__name__ for s, on in c2.flags.items() if on])',
      cases: [
        { id: 'half',  label: '2.5',  values: { x: '2.5' } },
        { id: 'zero',  label: '2.0',  values: { x: '2.0' } },
        { id: 'int',   label: '7',    values: { x: '7' } },
        { id: 'snan',  label: 'sNaN', values: { x: 'sNaN' } },
      ],
    },
  ],
  demoExplainer: 'For 2.5 and -2.5, ROUND_HALF_UP goes away from zero (3, -3) while round() rounds half to even (2, -2) and returns an int; int() truncates toward zero; floor and ceil go down and up. 1E+3 is already a whole number, so to_integral_value returns it unchanged — exponent and all. NaN passes through to_integral_value, but round(NaN) raises ValueError: cannot convert NaN to integer. In the second tab 2.5 sets Inexact and Rounded, 2.0 only Rounded (a zero was dropped), 7 nothing; a signaling NaN raises InvalidOperation in both methods.',

  patterns: [
    {
      name: 'Round half up to a whole number',
      desc: 'Keep it a Decimal for further arithmetic.',
      code: 'from decimal import ROUND_HALF_UP\nunits = quantity.to_integral_value(rounding=ROUND_HALF_UP)',
    },
    {
      name: 'Floor and ceiling as Decimals',
      desc: 'Pick the direction with the rounding mode.',
      code: 'from decimal import ROUND_FLOOR, ROUND_CEILING\nlow = x.to_integral_value(rounding=ROUND_FLOOR)\nhigh = x.to_integral_value(rounding=ROUND_CEILING)',
    },
    {
      name: 'Insist on an exact integer',
      desc: 'Trap Inexact and let to_integral_exact raise when a fraction would be lost.',
      code: 'from decimal import Context, Inexact\nstrict = Context(traps=[Inexact])\nn = strict.to_integral_exact(x)',
    },
  ],

  examples: [
    { title: 'Half even by default',     code: "from decimal import Decimal\n(Decimal('2.5').to_integral_value(), Decimal('3.5').to_integral_value())", returns: "(Decimal('2'), Decimal('4'))" },
    { title: 'Any rounding mode',        code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal('2.5').to_integral_value(rounding=ROUND_HALF_UP)", returns: "Decimal('3')" },
    { title: 'Negative zero',            code: "from decimal import Decimal\nDecimal('-0.4').to_integral_value()", returns: "Decimal('-0')" },
    { title: 'Already integral: unchanged', code: "from decimal import Decimal\nDecimal('1E+3').to_integral_value()", returns: "Decimal('1E+3')" },
    { title: 'The int-returning built-ins', code: "import math\nfrom decimal import Decimal\nx = Decimal('-2.5')\n(round(x), int(x), math.floor(x), math.ceil(x), math.trunc(x))", returns: '(-2, -2, -3, -2, -2)' },
    { title: 'to_integral_exact can raise', code: "from decimal import Decimal, Context, Inexact\nctx = Context(traps=[Inexact])\nctx.to_integral_exact(Decimal('2.5'))", returns: "decimal.Inexact: [<class 'decimal.Inexact'>]" },
    { title: 'Decimal in, Decimal out',  code: "from decimal import Decimal\ntype(round(Decimal('2.5'))).__name__, type(Decimal('2.5').to_integral_value()).__name__", returns: "('int', 'Decimal')" },
  ],

  pitfalls: [
    {
      name: 'round() on NaN or infinity',
      desc: 'round(), int(), math.floor() and math.ceil() must produce an int, so they raise. to_integral_value returns the special value as is.',
      wrong: { label: 'round(NaN)', code: "from decimal import Decimal\nround(Decimal('NaN'))", output: 'ValueError: cannot convert NaN to integer' },
      fix:   { label: 'to_integral_value', code: "from decimal import Decimal\nDecimal('NaN').to_integral_value()", output: "Decimal('NaN')" },
    },
    {
      name: 'Using int() as floor',
      desc: 'int() truncates toward zero, which is not the floor for negative numbers.',
      wrong: { label: 'int(x)', code: "from decimal import Decimal\nint(Decimal('-7.9'))", output: '-7' },
      fix:   { label: 'math.floor(x)', code: "import math\nfrom decimal import Decimal\nmath.floor(Decimal('-7.9'))", output: '-8' },
    },
    {
      name: 'Expecting plain digits for big values',
      desc: 'to_integral_value leaves a positive exponent alone. quantize(Decimal(1)) sets the exponent to 0 and writes all digits.',
      wrong: { label: 'to_integral_value', code: "from decimal import Decimal\nDecimal('1E+3').to_integral_value()", output: "Decimal('1E+3')" },
      fix:   { label: 'quantize(Decimal(1))', code: "from decimal import Decimal\nDecimal('1E+3').quantize(Decimal(1))", output: "Decimal('1000')" },
    },
  ],

  when: {
    use: [
      'Rounding to a whole number while staying in Decimal arithmetic',
      'Integer rounding with a specific mode (ROUND_HALF_UP, ROUND_FLOOR, …)',
      'to_integral_exact when you need to know (or forbid) that a fraction was dropped',
    ],
    avoid: [
      'Getting a Python int → round(x), int(x), math.floor(x), math.ceil(x)',
      'Rounding to decimal places → quantize()',
      'to_integral in new code → it is the old name of to_integral_value',
    ],
  },

  notes: {
    cpython:      "libmpdec's mpd_qround_to_int (to_integral_value: no Inexact/Rounded signals) and mpd_qround_to_intx (to_integral_exact: signals them); only a signaling NaN raises InvalidOperation",
    'Built-ins':  "round(x) rounds half to even and ignores the context rounding; int(x) and math.trunc(x) truncate; math.floor / math.ceil round toward -∞ / +∞ — all return int and raise ValueError for NaN, OverflowError for infinity",
    'Context methods': 'ctx.to_integral_value(x), ctx.to_integral_exact(x) and ctx.to_integral(x) take no rounding argument; they use ctx.rounding',
  },

  related: [
    { name: 'quantize()', slug: 'quantize', when: 'Round to decimal places' },
    { name: 'Rounding modes', slug: 'rounding', when: 'Values for rounding=' },
    { name: 'Inexact and Rounded', slug: 'inexact-rounded', when: 'The signals to_integral_exact raises' },
    { name: 'round()', slug: 'round', when: 'round(Decimal) → int', category: 'functions' },
    { name: 'int()', slug: 'int', when: 'Truncates a Decimal', category: 'functions' },
    { name: 'math.floor / ceil / trunc', slug: 'floor-ceil-trunc', when: 'Floor and ceiling as int', category: 'stdlib/math' },
  ],

  faq: [
    {
      q: 'How do I round a Decimal to the nearest integer?',
      a: "round(x) gives an int, rounding ties to even. x.to_integral_value(rounding=ROUND_HALF_UP) gives a Decimal with the rounding mode you choose. int(x) truncates toward zero.",
    },
    {
      q: 'What is the difference between to_integral_value and to_integral_exact?',
      a: 'They return the same number. to_integral_exact additionally signals Inexact (a non-zero fraction was dropped) and Rounded (any digits were dropped) through the context, so a trap can turn them into exceptions.',
    },
    {
      q: 'How do I convert a Decimal to an int?',
      a: "int(x) truncates toward zero (int(Decimal('-7.9')) is -7); round(x) rounds half to even; math.floor / math.ceil round down / up. All raise for NaN and infinity.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.to_integral_value',
    meta:  'decimal.Decimal.to_integral_value',
  },
};
