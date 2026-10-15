// content/reference/python/stdlib/decimal/exp-ln-log10-sqrt.js

export const meta = {
  slug:        'exp-ln-log10-sqrt',
  name:        'Decimal.sqrt',
  signature:   'Decimal.sqrt(context=None)  ·  Decimal.exp(context=None)  ·  Decimal.ln(context=None)  ·  Decimal.log10(context=None)',
  blurb:       'Square root, e**x, natural and base-10 logarithm of a Decimal, computed to the context precision and correctly rounded (half even).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal sqrt square root exp exponential ln natural logarithm log10 logarithm Decimal.sqrt Decimal.exp Decimal.ln Decimal.log10 Context.sqrt Context.exp Context.ln Context.log10 high precision square root decimal math functions',
};

export const method = {
  slug:      'exp-ln-log10-sqrt',
  name:      'Decimal.sqrt',
  signature: 'Decimal.sqrt(context=None)  ·  Decimal.exp(context=None)  ·  Decimal.ln(context=None)  ·  Decimal.log10(context=None)',
  returns:   { type: 'Decimal', desc: 'prec significant digits, correctly rounded with ROUND_HALF_EVEN; exact results (a perfect square root, log10 of a power of ten) come back exact.' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'The four transcendental operations decimal provides. They work at any precision — sqrt(2) to 50 digits is one call — but always round half even, whatever the context rounding says. For anything else (sin, cos, other bases) decimal has no built-in method.',

  covers: ['Decimal.sqrt', 'Decimal.exp', 'Decimal.ln', 'Decimal.log10', 'Context.sqrt', 'Context.exp', 'Context.ln', 'Context.log10'],

  cheat: {
    commonCall: 'Decimal(2).sqrt()',
    returns:    "Decimal('1.414213562373095048801688724')",
    replaces:   'math.sqrt / math.exp / math.log, which return 17-digit floats',
    watchOut:   'negative input → InvalidOperation, not ValueError',
  },

  parameters: [
    { name: 'context', type: 'Context', required: false, default: 'None', desc: 'Precision and exponent limits for the result (its rounding is ignored — these always round half even). None means the current context. Context.sqrt(x) etc. take the operand instead.' },
  ],

  modes: [
    {
      id: 'all',
      label: 'all four',
      blurb: 'sqrt, exp, ln and log10 of one number at the precision you choose.',
      params: [
        { name: 'x',    type: 'str', hint: 'a number',           input: 'text' },
        { name: 'prec', type: 'int', hint: 'significant digits', input: 'number' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}):\n    x = Decimal({$x})\n    result = (x.sqrt(), x.exp(), x.ln(), x.log10())\nresult',
      cases: [
        { id: 'two',   label: '2, prec 28',   values: { x: '2', prec: '28' } },
        { id: 'ten',   label: '10, prec 10',  values: { x: '10', prec: '10' } },
        { id: 'half',  label: '0.5, prec 12', values: { x: '0.5', prec: '12' } },
        { id: 'pow10', label: '1000, prec 5', values: { x: '1000', prec: '5' } },
        { id: 'zero',  label: '0',            values: { x: '0', prec: '9' } },
        { id: 'neg',   label: '-1',           values: { x: '-1', prec: '9' } },
      ],
    },
    {
      id: 'rounding',
      label: 'rounding is fixed',
      blurb: "sqrt() ignores the context rounding (always half even); ** with exponent 0.5 respects it.",
      params: [
        { name: 'x',        type: 'str', hint: 'a number',       input: 'text' },
        { name: 'prec',     type: 'int', hint: 'precision',      input: 'number' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name', input: 'text' },
      ],
      template: "from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}, rounding={$rounding}):\n    x = Decimal({$x})\n    result = (x.sqrt(), x ** Decimal('0.5'))\nresult",
      cases: [
        { id: 'up',    label: '2, prec 3, UP',      values: { x: '2', prec: '3', rounding: 'ROUND_UP' } },
        { id: 'down',  label: '3, prec 3, DOWN',    values: { x: '3', prec: '3', rounding: 'ROUND_DOWN' } },
        { id: 'even',  label: '2, prec 3, HALF_EVEN', values: { x: '2', prec: '3', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'exact', label: '1.44, UP',           values: { x: '1.44', prec: '3', rounding: 'ROUND_UP' } },
      ],
    },
  ],
  demoExplainer: 'Every result has the precision you asked for, except exact ones: log10(1000) is exactly 3 and the square root of 1.44 is exactly 1.2. ln(0) and log10(0) are -Infinity, exp(0) is 1 and sqrt(0) is 0 — no signal. For -1 the first call, sqrt, raises InvalidOperation (ln and log10 would too). In the second tab sqrt(2) at 3 digits is 1.41 even under ROUND_UP, while 2 ** 0.5 follows the context and gives 1.42 — ** is computed separately and rounded with the context rounding.',

  patterns: [
    {
      name: 'Square root to many digits',
      desc: 'A context method computes under that precision without touching the current context.',
      code: 'from decimal import Context\nroot = Context(prec=100).sqrt(2)',
    },
    {
      name: 'Logarithm to any base',
      desc: 'Divide natural logarithms (or base-10 ones).',
      code: 'from decimal import Decimal\ndef log(x, base):\n    return Decimal(x).ln() / Decimal(base).ln()',
    },
    {
      name: 'Compound interest with exp and ln',
      desc: 'Continuous compounding: amount * e**(rate * years).',
      code: "from decimal import Decimal\namount = Decimal('1000') * (Decimal('0.05') * 10).exp()",
    },
  ],

  examples: [
    { title: 'sqrt(2) to 28 digits',      code: 'from decimal import Decimal\nDecimal(2).sqrt()', returns: "Decimal('1.414213562373095048801688724')" },
    { title: 'e',                         code: 'from decimal import Decimal\nDecimal(1).exp()', returns: "Decimal('2.718281828459045235360287471')" },
    { title: 'ln(10)',                    code: 'from decimal import Decimal\nDecimal(10).ln()', returns: "Decimal('2.302585092994045684017991455')" },
    { title: 'Exact results stay exact',  code: "from decimal import Decimal\n(Decimal(1000).log10(), Decimal('0.01').log10(), Decimal('1.44').sqrt())", returns: "(Decimal('3'), Decimal('-2'), Decimal('1.2'))" },
    { title: '50 digits via a Context',   code: 'from decimal import Context\nContext(prec=50).sqrt(2)', returns: "Decimal('1.4142135623730950488016887242096980785696718753769')" },
    { title: 'Big exponents',             code: 'from decimal import Decimal\nDecimal(1000).exp()', returns: "Decimal('1.970071114017046993888879352E+434')" },
    { title: 'ln(0) is -Infinity',        code: 'from decimal import Decimal\nDecimal(0).ln()', returns: "Decimal('-Infinity')" },
    { title: 'No square root of a negative', code: 'from decimal import Decimal\nDecimal(-4).sqrt()', returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
  ],

  pitfalls: [
    {
      name: 'Using math functions on Decimals',
      desc: 'math converts the Decimal to a float and returns a float — 17 significant digits at best.',
      wrong: { label: 'math.sqrt', code: 'import math\nfrom decimal import Decimal\nmath.sqrt(Decimal(2))', output: '1.4142135623730951' },
      fix:   { label: 'Decimal.sqrt', code: 'from decimal import Decimal\nDecimal(2).sqrt()', output: "Decimal('1.414213562373095048801688724')" },
    },
    {
      name: 'Expecting the context rounding mode',
      desc: 'These four always round half even. Compute with a few extra digits, then quantize with the mode you need.',
      wrong: { label: 'ROUND_UP context', code: 'from decimal import Decimal, localcontext, ROUND_UP\nwith localcontext(prec=3, rounding=ROUND_UP):\n    r = Decimal(2).sqrt()\nr', output: "Decimal('1.41')" },
      fix:   { label: 'quantize afterwards', code: "from decimal import Decimal, localcontext, ROUND_UP\nwith localcontext(prec=10):\n    r = Decimal(2).sqrt()\nr.quantize(Decimal('0.01'), rounding=ROUND_UP)", output: "Decimal('1.42')" },
    },
    {
      name: 'Catching ValueError for a bad argument',
      desc: 'math.log(-1) raises ValueError, but Decimal(-1).ln() signals InvalidOperation.',
      wrong: { label: 'except ValueError', code: "from decimal import Decimal\ntry:\n    Decimal(-1).ln()\nexcept ValueError:\n    r = 'caught'\nr", output: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
      fix:   { label: 'except InvalidOperation', code: "from decimal import Decimal, InvalidOperation\ntry:\n    Decimal(-1).ln()\nexcept InvalidOperation:\n    r = 'caught'\nr", output: "'caught'" },
    },
  ],

  when: {
    use: [
      'Square roots, exponentials and logarithms beyond float precision',
      'Financial formulas that must stay in Decimal (continuous compounding, growth rates)',
      'Reproducible results: correctly rounded, so every platform gives the same digits',
    ],
    avoid: [
      'Trigonometry and other functions → not in decimal; use math (floats) or a library such as mpmath',
      'Speed-critical numeric code → float and math',
      'Integer square roots → math.isqrt',
    ],
  },

  notes: {
    cpython:      "libmpdec's mpd_qsqrt, mpd_qexp, mpd_qln and mpd_qlog10; the docs state that exp, ln and log10 are correctly rounded using ROUND_HALF_EVEN, and sqrt ignores the context rounding too: Context(prec=3, rounding=ROUND_UP).sqrt(2) is Decimal('1.41')",
    'Special values': 'sqrt(-0) is -0, sqrt(Infinity) and exp(Infinity) are Infinity, exp(-Infinity) is 0, ln(0) and log10(0) are -Infinity. For sqrt, ln and log10 any negative non-zero argument, -Infinity included, is InvalidOperation; exp accepts every number',
    'Results':    'Inexact and Rounded are signaled for every rounded result; overflow (exp of a large number) and underflow follow the context Emax/Emin',
  },

  related: [
    { name: 'Arithmetic and **', slug: 'arithmetic', when: 'Powers with any exponent' },
    { name: 'localcontext()', slug: 'localcontext', when: 'More digits for a block' },
    { name: 'math.sqrt / isqrt / cbrt', slug: 'sqrt-isqrt-cbrt', when: 'Float and integer square roots', category: 'stdlib/math' },
    { name: 'math.log', slug: 'log', when: 'Float logarithms', category: 'stdlib/math' },
    { name: 'math.exp', slug: 'exp-exp2-expm1', when: 'Float exponentials', category: 'stdlib/math' },
  ],

  faq: [
    {
      q: 'How do I calculate a square root with high precision in Python?',
      a: 'Use Decimal: Decimal(2).sqrt() gives 28 digits; with localcontext(prec=100): Decimal(2).sqrt(), or Context(prec=100).sqrt(2), gives 100. The result is correctly rounded.',
    },
    {
      q: 'Does decimal have sin, cos or pi?',
      a: 'No. decimal provides sqrt, exp, ln, log10 and power. The decimal documentation has recipes for pi, exp, cos and sin written in Python; for serious work use a library such as mpmath.',
    },
    {
      q: 'How do I take a logarithm with another base?',
      a: 'Divide natural logarithms: x.ln() / base.ln(). For base 10 use log10(), which is exact for powers of ten.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.sqrt',
    meta:  'decimal.Decimal.sqrt / exp / ln / log10',
  },
};
