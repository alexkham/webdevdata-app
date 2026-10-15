// content/reference/python/stdlib/decimal/copy_abs-copy_negate-copy_sign.js

export const meta = {
  slug:        'copy_abs-copy_negate-copy_sign',
  name:        'Decimal.copy_sign',
  signature:   'Decimal.copy_abs()  ·  Decimal.copy_negate()  ·  Decimal.copy_sign(other, context=None)  ·  Context.copy_decimal(num)',
  blurb:       'Change only the sign of a Decimal — exactly, quietly, without rounding to the context: the "copy" versions of abs(), unary minus and math.copysign.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal copy_abs copy_negate copy_sign copy_decimal Decimal.copy_abs Decimal.copy_negate Decimal.copy_sign Context.copy_abs Context.copy_negate Context.copy_sign Context.copy_decimal change sign without rounding negate decimal absolute value negative zero copysign',
};

export const method = {
  slug:      'copy_abs-copy_negate-copy_sign',
  name:      'Decimal.copy_sign',
  signature: 'Decimal.copy_abs()  ·  Decimal.copy_negate()  ·  Decimal.copy_sign(other, context=None)  ·  Context.copy_decimal(num)',
  returns:   { type: 'Decimal', desc: 'The same coefficient and exponent with a new sign (copy_decimal: the same value). Never rounded, never signals.' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'abs(x) and -x are arithmetic: they round to the context precision, turn -0 into 0 and signal on a signaling NaN. copy_abs(), copy_negate() and copy_sign() just flip or copy the sign bit — every digit stays, no flag is set, even NaNs keep their payload.',

  covers: ['Decimal.copy_abs', 'Decimal.copy_negate', 'Decimal.copy_sign', 'Context.copy_abs', 'Context.copy_negate', 'Context.copy_sign', 'Context.copy_decimal'],

  cheat: {
    commonCall: "Decimal('2.3').copy_sign(Decimal('-1.5'))",
    returns:    "Decimal('-2.3')",
    replaces:   'math.copysign (which works on floats)',
    watchOut:   "Decimal('0').copy_negate() is Decimal('-0'), while -Decimal('0') is Decimal('0')",
  },

  parameters: [
    { name: 'other', type: 'Decimal | int', required: true,  default: null, desc: 'copy_sign: the operand whose sign is copied (its value does not matter; -0 counts as negative).' },
    { name: 'num',   type: 'Decimal | int', required: true,  default: null, desc: 'Context.copy_decimal: the value to copy. Context.copy_abs / copy_negate / copy_sign take the operands the same way.' },
  ],

  modes: [
    {
      id: 'versus',
      label: 'copy vs arithmetic',
      blurb: 'copy_negate / copy_abs next to unary minus and abs() under a small precision.',
      params: [
        { name: 'x',    type: 'str', hint: 'a number',  input: 'text' },
        { name: 'prec', type: 'int', hint: 'precision', input: 'number' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}):\n    x = Decimal({$x})\n    result = (x.copy_negate(), -x, x.copy_abs(), abs(x))\nresult',
      cases: [
        { id: 'round', label: '-1.23456, prec 3', values: { x: '-1.23456', prec: '3' } },
        { id: 'zero',  label: '0',                values: { x: '0', prec: '28' } },
        { id: 'nzero', label: '-0',               values: { x: '-0', prec: '28' } },
        { id: 'nan',   label: '-NaN7',            values: { x: '-NaN7', prec: '28' } },
        { id: 'snan',  label: 'sNaN',             values: { x: 'sNaN', prec: '28' } },
      ],
    },
    {
      id: 'sign',
      label: 'copy_sign',
      blurb: 'Give x the sign of y.',
      params: [
        { name: 'x', type: 'str', hint: 'value', input: 'text' },
        { name: 'y', type: 'str', hint: 'sign source', input: 'text' },
      ],
      template: 'from decimal import Decimal\nDecimal({$x}).copy_sign(Decimal({$y}))',
      cases: [
        { id: 'neg',  label: '2.3, -1.5', values: { x: '2.3', y: '-1.5' } },
        { id: 'pos',  label: '-2.3, 7',   values: { x: '-2.3', y: '7' } },
        { id: 'nz',   label: '5, -0',     values: { x: '5', y: '-0' } },
        { id: 'nan',  label: 'NaN, -1',   values: { x: 'NaN', y: '-1' } },
      ],
    },
  ],
  demoExplainer: 'Under prec 3, -x and abs(x) round -1.23456 to three digits while the copies keep all six. Arithmetic negation of 0 is +0 (and of -0 too), but copy_negate really flips the sign, giving -0 for 0. For the quiet NaN with payload 7, -x and abs(x) return it unchanged (still -NaN7) while the copies do change its sign; a signaling NaN is fine for the copies, but -x signals InvalidOperation, which is trapped. copy_sign only looks at the sign of its argument, so -0 makes 5 negative and a NaN can be given a sign too.',

  patterns: [
    {
      name: 'Force a non-negative value without rounding',
      desc: 'copy_abs keeps every digit regardless of the context.',
      code: 'magnitude = amount.copy_abs()',
    },
    {
      name: 'Apply the sign of one value to another',
      desc: 'Typical for refunds and reversals: same amount, sign taken from the transaction type.',
      code: 'signed = amount.copy_sign(direction)',
    },
  ],

  examples: [
    { title: 'copy_sign',                 code: "from decimal import Decimal\nDecimal('2.3').copy_sign(Decimal('-1.5'))", returns: "Decimal('-2.3')" },
    { title: 'A real sign flip of zero',  code: "from decimal import Decimal\nDecimal('0').copy_negate(), -Decimal('0')", returns: "(Decimal('-0'), Decimal('0'))" },
    { title: 'Quiet even for sNaN',       code: "from decimal import Decimal\nDecimal('sNaN').copy_abs()", returns: "Decimal('sNaN')" },
    { title: 'No rounding to the context', code: "from decimal import Context, Decimal\nContext(prec=2).copy_abs(Decimal('-1.234'))", returns: "Decimal('1.234')" },
    { title: 'Context versions',          code: "from decimal import Context, Decimal\nctx = Context()\n(ctx.copy_negate(Decimal('-0')), ctx.copy_sign(Decimal('NaN'), -1), ctx.copy_abs(-7))", returns: "(Decimal('0'), Decimal('-NaN'), Decimal('7'))" },
    { title: 'copy_decimal',              code: 'from decimal import Context\nContext().copy_decimal(5)', returns: "Decimal('5')" },
  ],

  pitfalls: [
    {
      name: 'Negating with unary minus when digits matter',
      desc: '-x is an arithmetic operation and rounds to the current precision.',
      wrong: { label: '-x', code: "from decimal import Decimal, localcontext\nwith localcontext(prec=3):\n    r = -Decimal('1.23456')\nr", output: "Decimal('-1.23')" },
      fix:   { label: 'copy_negate()', code: "from decimal import Decimal, localcontext\nwith localcontext(prec=3):\n    r = Decimal('1.23456').copy_negate()\nr", output: "Decimal('-1.23456')" },
    },
    {
      name: 'abs() on a signaling NaN',
      desc: 'Arithmetic on sNaN signals InvalidOperation; the copy functions do not look at the value.',
      wrong: { label: 'abs(x)', code: "from decimal import Decimal\nabs(Decimal('sNaN'))", output: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
      fix:   { label: 'copy_abs()', code: "from decimal import Decimal\nDecimal('sNaN').copy_abs()", output: "Decimal('sNaN')" },
    },
  ],

  when: {
    use: [
      'Changing the sign of a value that must keep all its digits',
      'Handling NaN payloads and signed zeros exactly',
      'copy_sign to transfer a sign between values',
    ],
    avoid: [
      'Ordinary arithmetic where context rounding is wanted → -x, abs(x), +x',
      'copy_decimal() just to duplicate a Decimal — they are immutable, Decimal(x) returns x itself',
    ],
  },

  notes: {
    cpython:      "libmpdec's mpd_qcopy_abs, mpd_qcopy_negate, mpd_qcopy_sign: quiet operations — no context rounding, no flags (the docs note that the C version can still raise InvalidOperation if the second operand cannot be converted exactly)",
    'Arithmetic counterparts': 'abs(x) and -x (Context.abs, Context.minus) round to the context, give +0 for a zero result except under ROUND_FLOOR, and signal on sNaN',
  },

  related: [
    { name: 'Arithmetic: -x, abs(x)', slug: 'arithmetic', when: 'The rounding versions' },
    { name: 'Predicates', slug: 'predicates', when: 'is_signed() reads the sign' },
    { name: 'abs()', slug: 'abs', when: 'The built-in', category: 'functions' },
    { name: 'math.copysign', slug: 'copysign-fabs', when: 'The float version', category: 'stdlib/math' },
  ],

  faq: [
    {
      q: 'What is the difference between copy_negate() and -x for a Decimal?',
      a: "-x is arithmetic: it rounds to the context precision, never produces -0 from 0, and signals for sNaN. copy_negate() only flips the sign: Decimal('0').copy_negate() is Decimal('-0') and every digit is kept.",
    },
    {
      q: 'How do I copy the sign of one Decimal to another?',
      a: "x.copy_sign(y) returns x with y's sign: Decimal('2.3').copy_sign(Decimal('-1.5')) is Decimal('-2.3').",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.copy_sign',
    meta:  'decimal.Decimal.copy_abs / copy_negate / copy_sign',
  },
};
