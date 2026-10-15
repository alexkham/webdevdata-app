// content/reference/python/stdlib/decimal/next_plus-next_minus-next_toward.js

export const meta = {
  slug:        'next_plus-next_minus-next_toward',
  name:        'Decimal.next_plus',
  signature:   'Decimal.next_plus(context=None)  ·  Decimal.next_minus(context=None)  ·  Decimal.next_toward(other, context=None)',
  blurb:       'The neighbouring representable numbers: the smallest Decimal above, the largest below, or the next one in the direction of another value — at the precision and exponent range of a context.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal next_plus next_minus next_toward Decimal.next_plus Decimal.next_minus Decimal.next_toward Context.next_plus Context.next_minus Context.next_toward next representable number ulp nextafter decimal smallest increment',
};

export const method = {
  slug:      'next_plus-next_minus-next_toward',
  name:      'Decimal.next_plus',
  signature: 'Decimal.next_plus(context=None)  ·  Decimal.next_minus(context=None)  ·  Decimal.next_toward(other, context=None)',
  returns:   { type: 'Decimal', desc: 'The adjacent number in the context (prec digits, exponents down to Etiny); ±Infinity beyond the largest finite number.' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "What counts as 'next' depends on the context: with 28 digits the number after 1 is 1.000000000000000000000000001, with 3 digits it is 1.01. The decimal counterpart of math.nextafter. next_toward also signals Overflow or Underflow when it lands on an infinity or a subnormal; next_plus and next_minus never do.",

  covers: ['Decimal.next_plus', 'Decimal.next_minus', 'Decimal.next_toward', 'Context.next_plus', 'Context.next_minus', 'Context.next_toward'],

  cheat: {
    commonCall: 'Decimal(1).next_plus()',
    returns:    "Decimal('1.000000000000000000000000001')",
    replaces:   'adding a hand-computed smallest increment',
    watchOut:   'a value with more than prec digits is rounded first: at 3 digits 1.2345 → 1.24',
  },

  parameters: [
    { name: 'other',   type: 'Decimal | int', required: true,  default: null,   desc: 'next_toward: the direction. If it equals the operand, the operand comes back with the sign of other.' },
    { name: 'context', type: 'Context',       required: false, default: 'None', desc: 'Precision and exponent range that define the neighbours (None = current context).' },
  ],

  modes: [
    {
      id: 'next',
      label: 'neighbours',
      blurb: 'next_minus, next_plus and next_toward(y) at your precision.',
      params: [
        { name: 'x',    type: 'str', hint: 'a number',        input: 'text' },
        { name: 'y',    type: 'str', hint: 'direction for next_toward', input: 'text' },
        { name: 'prec', type: 'int', hint: 'precision',       input: 'number' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}):\n    x = Decimal({$x})\n    result = (x.next_minus(), x.next_plus(), x.next_toward(Decimal({$y})))\nresult',
      cases: [
        { id: 'one3',  label: '1, prec 3',      values: { x: '1', y: '0', prec: '3' } },
        { id: 'one28', label: '1, prec 28',     values: { x: '1', y: '2', prec: '28' } },
        { id: 'round', label: '1.2345, prec 3', values: { x: '1.2345', y: '2', prec: '3' } },
        { id: 'zero',  label: '0 toward -0',    values: { x: '0', y: '-0', prec: '28' } },
        { id: 'inf',   label: 'Infinity',       values: { x: 'Infinity', y: '0', prec: '5' } },
        { id: 'top',   label: 'largest, toward Infinity', values: { x: '9.99E+999999', y: 'Infinity', prec: '3' } },
      ],
    },
  ],
  demoExplainer: 'At 3 digits the neighbours of 1 are 0.999 and 1.01 — the spacing changes at a power of ten. 1.2345 has too many digits for prec 3, so next_plus first rounds it up (ceiling) to 1.24, and next_minus down to 1.23. For equal operands next_toward returns the first with the sign of the second, so 0 toward -0 is -0. Below Infinity is the largest finite number, 9.9999E+999999 at 5 digits. next_toward from the largest finite number toward Infinity reaches Infinity and signals Overflow, which is trapped — next_plus would have returned Infinity silently.',

  patterns: [
    {
      name: 'An open upper bound',
      desc: 'Turn "x or less" into "less than the next number".',
      code: 'upper = limit.next_plus()\nok = value < upper',
    },
    {
      name: 'Step through every representable value',
      desc: 'Only sensible with a small precision.',
      code: "from decimal import Context, Decimal\nctx = Context(prec=2)\nx = Decimal('9.8')\nfor _ in range(3):\n    x = ctx.next_plus(x)   # 9.9, 10, 11",
    },
  ],

  examples: [
    { title: 'After 1, at 28 digits',    code: 'from decimal import Decimal\nDecimal(1).next_plus()', returns: "Decimal('1.000000000000000000000000001')" },
    { title: 'At 3 digits',              code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=3):\n    r = (Decimal(1).next_minus(), Decimal(1).next_plus())\nr', returns: "(Decimal('0.999'), Decimal('1.01'))" },
    { title: 'The gaps differ around 1', code: 'from decimal import Decimal\n(Decimal(1) - Decimal(1).next_minus(), Decimal(1).next_plus() - 1)', returns: "(Decimal('1E-28'), Decimal('1E-27'))" },
    { title: 'Smallest positive number', code: 'from decimal import Decimal\nDecimal(0).next_plus()', returns: "Decimal('1E-1000026')" },
    { title: 'Largest finite number',    code: "from decimal import Decimal\nDecimal('Infinity').next_minus()", returns: "Decimal('9.999999999999999999999999999E+999999')" },
    { title: 'next_toward signals, next_plus does not', code: "from decimal import Context, Decimal\nctx = Context(traps=[])\nr = ctx.next_toward(Decimal(0), 1)\n(r, [s.__name__ for s, on in ctx.flags.items() if on])", returns: "(Decimal('1E-1000026'), ['Underflow', 'Subnormal', 'Inexact', 'Rounded'])" },
  ],

  pitfalls: [
    {
      name: 'Expecting next_plus to signal overflow',
      desc: 'next_plus of the largest finite number is Infinity with no flag at all. Use next_toward if you want Overflow reported.',
      wrong: { label: 'next_plus', code: "from decimal import Context, Decimal\nctx = Context(prec=3, traps=[])\nr = ctx.next_plus(Decimal('9.99E+999999'))\n(r, [s.__name__ for s, on in ctx.flags.items() if on])", output: "(Decimal('Infinity'), [])" },
      fix:   { label: 'next_toward', code: "from decimal import Context, Decimal\nctx = Context(prec=3, traps=[])\nr = ctx.next_toward(Decimal('9.99E+999999'), Decimal('Infinity'))\n(r, [s.__name__ for s, on in ctx.flags.items() if on])", output: "(Decimal('Infinity'), ['Overflow', 'Inexact', 'Rounded'])" },
    },
  ],

  when: {
    use: [
      'Exclusive bounds and tie-breaking at the resolution of a context',
      'Testing edge cases: the largest finite number, the smallest subnormal',
    ],
    avoid: [
      'Money steps of one cent → add Decimal(\'0.01\') explicitly',
      'Float neighbours → math.nextafter',
    ],
  },

  notes: {
    cpython:      "libmpdec's mpd_qnext_plus, mpd_qnext_minus and mpd_qnext_toward",
    'Rounding first': 'next_plus rounds the operand toward +∞ to the context first (next_minus toward -∞); if that changed it, the rounded value is the answer',
    'Signals':    'next_plus / next_minus are quiet (except sNaN); next_toward signals Overflow (Inexact, Rounded) when the result is infinite and Underflow (Subnormal, Inexact, Rounded) when it is subnormal',
  },

  related: [
    { name: 'Context', slug: 'context', when: 'prec, Emax, Etiny define the neighbours' },
    { name: 'Overflow and Underflow', slug: 'overflow-underflow', when: 'What next_toward can signal' },
    { name: 'math.nextafter / ulp', slug: 'nextafter-ulp', when: 'The float versions', category: 'stdlib/math' },
  ],

  faq: [
    {
      q: 'What is the decimal equivalent of math.nextafter?',
      a: 'x.next_toward(y), with x.next_plus() and x.next_minus() for the two directions. The step size depends on the context precision: 1E-27 above 1 with the default 28 digits.',
    },
    {
      q: 'What is the smallest positive Decimal?',
      a: "Decimal(0).next_plus() under the context, which is 1E-1000026 for the default context — 10 to the power Etiny() = Emin - prec + 1.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.next_plus',
    meta:  'decimal.Decimal.next_plus / next_minus / next_toward',
  },
};
