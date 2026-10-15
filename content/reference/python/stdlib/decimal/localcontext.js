// content/reference/python/stdlib/decimal/localcontext.js

export const meta = {
  slug:        'localcontext',
  name:        'decimal.localcontext',
  signature:   'decimal.localcontext(ctx=None, **kwargs)',
  blurb:       'A with-statement that runs a block under a temporary copy of the context — set prec, rounding or traps for just those lines, restored automatically.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+ (keyword arguments: 3.11+)',
  searchTerms: 'decimal localcontext with localcontext temporary precision rounding decimal context manager localcontext(prec=) set precision for a block restore context traps flags python decimal with statement',
};

export const method = {
  slug:      'localcontext',
  name:      'decimal.localcontext',
  signature: 'decimal.localcontext(ctx=None, **kwargs)',
  returns:   { type: 'context manager', desc: 'Entering it installs a copy of ctx (default: the current context) with kwargs applied, and binds that copy to the as-target; leaving restores the previous context.' },

  category:    'decimal function',
  version:     'Python 2.5+ (keyword arguments: 3.11+)',
  hasLiveDemo: true,

  subtitle: 'The safe way to change precision or rounding: everything inside the with block uses the new settings, everything after it the old ones — even if the block raises. Values computed inside keep their digits after the block; only new operations use the restored context.',

  covers: ['localcontext'],

  cheat: {
    commonCall: 'with localcontext(prec=50):',
    returns:    'the copied Context (with ... as ctx)',
    replaces:   'getcontext().prec = … followed by a manual reset',
    watchOut:   'the copy includes the current flags — clear them before checking',
  },

  parameters: [
    { name: 'ctx',      type: 'Context', required: false, default: 'None', desc: 'The context to copy. None means the current context.' },
    { name: '**kwargs', type: 'context attributes', required: false, default: null, desc: 'prec, rounding, Emin, Emax, capitals, clamp, flags, traps — applied to the copy (3.11+). Anything else is a TypeError; bad values raise ValueError or TypeError.' },
  ],

  modes: [
    {
      id: 'block',
      label: 'inside vs outside',
      blurb: 'The same division inside the block (your precision and rounding) and after it (the restored context).',
      params: [
        { name: 'a',        type: 'str', hint: 'dividend',           input: 'text' },
        { name: 'b',        type: 'str', hint: 'divisor',            input: 'text' },
        { name: 'prec',     type: 'int', hint: 'significant digits', input: 'number' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name',     input: 'text' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}, rounding={$rounding}):\n    inside = Decimal({$a}) / Decimal({$b})\noutside = Decimal({$a}) / Decimal({$b})\n(inside, outside)',
      cases: [
        { id: 'third', label: '1/3, prec 5',              values: { a: '1', b: '3', prec: '5', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'down',  label: '2/3, prec 3, DOWN',        values: { a: '2', b: '3', prec: '3', rounding: 'ROUND_DOWN' } },
        { id: 'tie',   label: '10/4, prec 1, HALF_UP',    values: { a: '10', b: '4', prec: '1', rounding: 'ROUND_HALF_UP' } },
        { id: 'even',  label: '10/4, prec 1, HALF_EVEN',  values: { a: '10', b: '4', prec: '1', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'long',  label: '1/7, prec 40',             values: { a: '1', b: '7', prec: '40', rounding: 'ROUND_HALF_EVEN' } },
      ],
    },
    {
      id: 'traps',
      label: 'trap Inexact',
      blurb: 'Turn on a trap for the block only: any division that has to round now raises.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal, localcontext, Inexact\nwith localcontext() as ctx:\n    ctx.traps[Inexact] = True\n    result = Decimal({$a}) / Decimal({$b})\nresult',
      cases: [
        { id: 'quarter', label: '1/4',  values: { a: '1', b: '4' } },
        { id: 'eighth',  label: '10/8', values: { a: '10', b: '8' } },
        { id: 'third',   label: '1/3',  values: { a: '1', b: '3' } },
      ],
    },
    {
      id: 'base',
      label: 'copy another context',
      blurb: 'Pass a context to copy — here ExtendedContext, which traps nothing — and adjust it with keywords.',
      params: [
        { name: 'a',    type: 'str', hint: 'dividend',  input: 'text' },
        { name: 'b',    type: 'str', hint: 'divisor',   input: 'text' },
        { name: 'prec', type: 'int', hint: 'precision', input: 'number' },
      ],
      template: 'from decimal import Decimal, localcontext, ExtendedContext\nwith localcontext(ExtendedContext, prec={$prec}):\n    result = Decimal({$a}) / Decimal({$b})\nresult',
      cases: [
        { id: 'third', label: '1/3, prec 4', values: { a: '1', b: '3', prec: '4' } },
        { id: 'zero',  label: '1/0',         values: { a: '1', b: '0', prec: '9' } },
        { id: 'nan',   label: '0/0',         values: { a: '0', b: '0', prec: '9' } },
      ],
    },
  ],
  demoExplainer: 'Inside the block the result has prec significant digits rounded your way; after the block the same division runs under the restored context (28 digits, half-even). A tie shows the rounding modes apart: 10/4 is exactly 2.5, which ROUND_HALF_UP makes 3 and ROUND_HALF_EVEN makes 2. With the Inexact trap on, 1/4 and 10/8 are exact and pass, while 1/3 raises decimal.Inexact. Copying ExtendedContext brings its empty trap set along, so 1/0 is Infinity and 0/0 is NaN inside that block.',

  patterns: [
    {
      name: 'Extra precision for an intermediate result',
      desc: 'Compute with more digits, then round back with unary plus outside the block.',
      code: 'from decimal import localcontext\nwith localcontext(prec=60):\n    s = expensive_series()\ns = +s   # rounded to the outer precision',
    },
    {
      name: 'Money rounding for a block',
      desc: 'Every operation in the block rounds half up.',
      code: 'from decimal import localcontext, ROUND_HALF_UP\nwith localcontext(rounding=ROUND_HALF_UP):\n    total = subtotal * rate',
    },
    {
      name: 'Pre-3.11 form',
      desc: 'Before keyword arguments, set the attributes on the copy.',
      code: 'from decimal import localcontext\nwith localcontext() as ctx:\n    ctx.prec = 42\n    s = calculate_something()',
    },
  ],

  examples: [
    { title: 'Attribute form', code: 'from decimal import Decimal, localcontext\nwith localcontext() as ctx:\n    ctx.prec = 42\n    s = Decimal(1) / 7\ns', returns: "Decimal('0.142857142857142857142857142857142857142857')" },
    { title: 'Round back with unary plus', code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=42):\n    s = Decimal(1) / 7\n+s', returns: "Decimal('0.1428571428571428571428571429')" },
    { title: 'It works on a copy', code: 'from decimal import Decimal, Context, localcontext\nmoney = Context(prec=4)\nwith localcontext(money) as ctx:\n    r = (Decimal(1) / 3, ctx is money)\nr', returns: "(Decimal('0.3333'), False)" },
    { title: 'Keywords override the copied context', code: 'from decimal import Decimal, Context, localcontext\nwith localcontext(Context(prec=3), prec=9):\n    r = Decimal(1) / 3\nr', returns: "Decimal('0.333333333')" },
    { title: 'No traps for a block', code: 'from decimal import Decimal, localcontext\nwith localcontext(traps=[]):\n    r = Decimal(1) / 0\nr', returns: "Decimal('Infinity')" },
    { title: 'A tiny Emax', code: 'from decimal import Decimal, localcontext\nwith localcontext(Emax=2):\n    r = Decimal(500) * 2\nr', returns: "decimal.Overflow: [<class 'decimal.Overflow'>]" },
  ],

  pitfalls: [
    {
      name: 'Carrying extra digits out of the block',
      desc: 'A Decimal keeps the digits it was computed with. Leaving the block does not round it — the next operation does, or unary plus.',
      wrong: { label: 'used as is', code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=42):\n    s = Decimal(1) / 7\ns', output: "Decimal('0.142857142857142857142857142857142857142857')" },
      fix:   { label: '+s', code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=42):\n    s = Decimal(1) / 7\n+s', output: "Decimal('0.1428571428571428571428571429')" },
    },
    {
      name: 'Misspelling a keyword',
      desc: "Only the Context attribute names are accepted. (The message shown is Python 3.13's; 3.12 words it as 'precision' is an invalid keyword argument for this function.)",
      wrong: { label: 'precision=5', code: 'from decimal import localcontext\nwith localcontext(precision=5):\n    pass', output: "TypeError: this function got an unexpected keyword argument 'precision'" },
      fix:   { label: 'prec=5', code: 'from decimal import localcontext\nwith localcontext(prec=5) as ctx:\n    p = ctx.prec\np', output: '5' },
    },
    {
      name: 'Trusting copied flags',
      desc: 'The copy starts with the flags the current context already had, so a flag can be set before your block does anything.',
      wrong: { label: 'flags copied', code: 'from decimal import Decimal, localcontext, Inexact\nwith localcontext() as outer:\n    outer.clear_flags()\n    Decimal(1) / 3\n    with localcontext() as ctx:\n        seen = ctx.flags[Inexact]\nseen', output: 'True' },
      fix:   { label: 'clear_flags() first', code: 'from decimal import Decimal, localcontext, Inexact\nwith localcontext() as outer:\n    outer.clear_flags()\n    Decimal(1) / 3\n    with localcontext() as ctx:\n        ctx.clear_flags()\n        seen = ctx.flags[Inexact]\nseen', output: 'False' },
    },
  ],

  when: {
    use: [
      'Any temporary change of precision, rounding, exponent limits or traps',
      'Library code that needs its own settings without touching the caller\'s',
      'Running a block under a prepared Context (localcontext(my_ctx))',
    ],
    avoid: [
      'One single operation → call the Context method directly: ctx.divide(a, b)',
      'Settings for a whole thread → setcontext() once',
      'Expecting the result to be rounded when the block ends → apply +x or quantize()',
    ],
  },

  notes: {
    cpython:      'Modules/_decimal/_decimal.c: localcontext() returns a ContextManager that copies the context (flags included) on creation, installs the copy with setcontext() in __enter__ and reinstalls the saved context in __exit__',
    'Keywords':   'prec, rounding, Emin, Emax, capitals, clamp, flags and traps, since Python 3.11; they are validated like Context attributes',
    'Exceptions': 'The previous context is restored even when the block raises',
  },

  related: [
    { name: 'getcontext / setcontext', slug: 'getcontext-setcontext', when: 'What localcontext swaps' },
    { name: 'Context',  slug: 'context',  when: 'The attributes you can set' },
    { name: 'Rounding modes', slug: 'rounding', when: 'Values for rounding=' },
    { name: 'Inexact and Rounded', slug: 'inexact-rounded', when: 'Trapping inexact results' },
    { name: 'with',     slug: 'with',     when: 'How context managers work', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I temporarily change the decimal precision?',
      a: 'with localcontext(prec=50): … (Python 3.11+), or with localcontext() as ctx: ctx.prec = 50 on older versions. The previous context is back after the block.',
    },
    {
      q: 'Is the result rounded when the with block ends?',
      a: 'No. Values keep the digits they were computed with; leaving the block only changes the context for future operations. Apply unary plus (+x) or quantize() to round them under the outer context.',
    },
    {
      q: 'Does localcontext copy the flags?',
      a: 'Yes, the copy has the same flags as the context it copies. Call ctx.clear_flags() at the start of the block if you want to know what the block itself signaled.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.localcontext',
    meta:  'decimal.localcontext',
  },
};
