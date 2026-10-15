// content/reference/python/stdlib/decimal/defaultcontext-basiccontext-extendedcontext.js

export const meta = {
  slug:        'defaultcontext-basiccontext-extendedcontext',
  name:        'decimal.DefaultContext',
  signature:   'decimal.DefaultContext, decimal.BasicContext, decimal.ExtendedContext',
  blurb:       'The three ready-made contexts: DefaultContext (the template for new contexts and threads), BasicContext (9 digits, strict traps) and ExtendedContext (9 digits, no traps).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal DefaultContext BasicContext ExtendedContext predefined contexts template context no traps NaN Infinity instead of exceptions debugging context General Decimal Arithmetic default context prototype',
};

export const method = {
  slug:      'defaultcontext-basiccontext-extendedcontext',
  name:      'decimal.DefaultContext',
  signature: 'decimal.DefaultContext, decimal.BasicContext, decimal.ExtendedContext',
  returns:   { type: 'Context', desc: 'Module-level Context objects. Use them through localcontext(...) or setcontext(...), which work on copies.' },

  category:    'decimal constants',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'DefaultContext is the prototype: Context() and every new thread copy it. BasicContext and ExtendedContext are the two standard contexts of the General Decimal Arithmetic Specification — the same 9-digit precision, opposite attitudes to errors.',

  covers: ['DefaultContext', 'BasicContext', 'ExtendedContext'],

  cheat: {
    commonCall: 'with localcontext(ExtendedContext):',
    returns:    'NaN / Infinity results instead of exceptions inside the block',
    replaces:   'building a no-traps context by hand',
    watchOut:   'these are shared objects — do not call their methods directly or change them while threads run',
  },

  parameters: [],

  modes: [
    {
      id: 'compare',
      label: 'all three',
      blurb: 'The same division under a copy of each template; exceptions are reported by class name.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal, localcontext, DefaultContext, BasicContext, ExtendedContext\nresults = []\nfor template in (DefaultContext, BasicContext, ExtendedContext):\n    with localcontext(template):\n        try:\n            results.append(Decimal({$a}) / Decimal({$b}))\n        except ArithmeticError as e:\n            results.append(type(e).__name__)\nresults',
      cases: [
        { id: 'third', label: '1/3',             values: { a: '1', b: '3' } },
        { id: 'tie',   label: '1.000000005 / 1', values: { a: '1.000000005', b: '1' } },
        { id: 'zero',  label: '1/0',             values: { a: '1', b: '0' } },
        { id: 'nan',   label: '0/0',             values: { a: '0', b: '0' } },
        { id: 'tiny',  label: 'subnormal',       values: { a: '1.23456789e-999999', b: '1000' } },
      ],
    },
  ],
  demoExplainer: 'DefaultContext keeps 28 digits; the other two keep 9. At the tie 1.000000005, BasicContext rounds half up to 1.00000001 and ExtendedContext half even to 1.00000000. 1/0 and 0/0 raise under DefaultContext and BasicContext (DivisionByZero, and InvalidOperation — the class the C module raises for 0/0) but give Infinity and NaN under ExtendedContext. A result below Emin: DefaultContext stores it exactly as a subnormal, BasicContext traps the Underflow, ExtendedContext rounds it to the digits that fit above Etiny.',

  patterns: [
    {
      name: 'Never raise, inspect flags instead',
      desc: 'A copy of ExtendedContext turns errors into NaN / Infinity plus flags.',
      code: "from decimal import ExtendedContext, Inexact\nctx = ExtendedContext.copy()\nresult = ctx.divide(a, b)\nproblems = [s.__name__ for s, on in ctx.flags.items() if on]",
    },
    {
      name: 'Strict checking while debugging',
      desc: 'BasicContext also traps Underflow and Clamped.',
      code: 'from decimal import localcontext, BasicContext\nwith localcontext(BasicContext):\n    run_calculation()',
    },
    {
      name: 'Defaults for all new threads',
      desc: 'Change DefaultContext before starting threads; each new thread copies it.',
      code: 'from decimal import DefaultContext, ROUND_HALF_UP\nDefaultContext.prec = 34\nDefaultContext.rounding = ROUND_HALF_UP\n# now start the worker threads',
    },
  ],

  examples: [
    { title: 'Precision of each',        code: 'from decimal import DefaultContext, BasicContext, ExtendedContext\n(DefaultContext.prec, BasicContext.prec, ExtendedContext.prec)', returns: '(28, 9, 9)' },
    { title: 'Rounding of the standard two', code: 'from decimal import BasicContext, ExtendedContext\n(BasicContext.rounding, ExtendedContext.rounding)', returns: "('ROUND_HALF_UP', 'ROUND_HALF_EVEN')" },
    { title: "BasicContext's traps",     code: 'from decimal import BasicContext\n[s.__name__ for s, on in BasicContext.traps.items() if on]', returns: "['InvalidOperation', 'DivisionByZero', 'Overflow', 'Underflow', 'Clamped']" },
    { title: 'ExtendedContext traps nothing', code: 'from decimal import ExtendedContext\n[s.__name__ for s, on in ExtendedContext.traps.items() if on]', returns: '[]' },
    { title: '0/0 is NaN under ExtendedContext', code: 'from decimal import Decimal, localcontext, ExtendedContext\nwith localcontext(ExtendedContext):\n    r = Decimal(0) / 0\nr', returns: "Decimal('NaN')" },
    { title: 'Work on a copy',           code: 'from decimal import ExtendedContext\nctx = ExtendedContext.copy()\nctx.divide(1, 0)', returns: "Decimal('Infinity')" },
  ],

  pitfalls: [
    {
      name: 'Changing DefaultContext to change the current context',
      desc: 'DefaultContext is only a template: the current context was copied from it already. Only contexts created afterwards see the change. (The snippets restore the old value in finally.)',
      wrong: { label: 'getcontext() after', code: 'from decimal import DefaultContext, getcontext\nold = DefaultContext.prec\ntry:\n    DefaultContext.prec = 50\n    current = getcontext().prec\nfinally:\n    DefaultContext.prec = old\ncurrent', output: '28' },
      fix:   { label: 'Context() after', code: 'from decimal import DefaultContext, Context\nold = DefaultContext.prec\ntry:\n    DefaultContext.prec = 50\n    fresh = Context().prec\nfinally:\n    DefaultContext.prec = old\nfresh', output: '50' },
    },
    {
      name: 'Doing money in BasicContext',
      desc: 'Nine significant digits is little for amounts in the millions: the product is rounded to cents here, and larger amounts lose more.',
      wrong: { label: 'BasicContext', code: "from decimal import Decimal, localcontext, BasicContext\nwith localcontext(BasicContext):\n    total = Decimal('1234567.89') * Decimal('1.19')\ntotal", output: "Decimal('1469135.79')" },
      fix:   { label: 'default 28 digits', code: "from decimal import Decimal\nDecimal('1234567.89') * Decimal('1.19')", output: "Decimal('1469135.7891')" },
    },
  ],

  when: {
    use: [
      'ExtendedContext (copied) when a calculation should never raise — check flags afterwards',
      'BasicContext while debugging: it traps more signals',
      'DefaultContext to set defaults for threads you are about to start',
    ],
    avoid: [
      'Calling methods on the templates directly → their flags are shared by everyone; use .copy()',
      'Changing DefaultContext after threads have started — the docs warn it needs synchronization',
      'The 9-digit standard contexts for money totals → use 28+ digits and quantize',
    ],
  },

  notes: {
    cpython:          'Defined in Modules/_decimal/_decimal.c; setcontext() and localcontext() always copy a template instead of installing the object itself',
    DefaultContext:   'prec=28, ROUND_HALF_EVEN, Emin=-999999, Emax=999999, capitals=1, clamp=0, traps InvalidOperation, DivisionByZero, Overflow',
    BasicContext:     'prec=9, ROUND_HALF_UP; traps everything except Inexact, Rounded and Subnormal (FloatOperation is not trapped either)',
    ExtendedContext:  'prec=9, ROUND_HALF_EVEN, no traps',
  },

  related: [
    { name: 'Context',        slug: 'context',      when: 'Build your own instead' },
    { name: 'localcontext()', slug: 'localcontext', when: 'Use a template for a block' },
    { name: 'getcontext / setcontext', slug: 'getcontext-setcontext', when: 'Install a template for a thread' },
    { name: 'Signals',        slug: 'decimalexception', when: 'What the traps refer to' },
  ],

  faq: [
    {
      q: 'What is the difference between BasicContext and ExtendedContext?',
      a: 'Both have 9 digits of precision. BasicContext rounds half up and traps InvalidOperation, DivisionByZero, Overflow, Underflow and Clamped, so problems raise. ExtendedContext rounds half even and traps nothing, so problems produce NaN or Infinity and only set flags.',
    },
    {
      q: 'Is DefaultContext the current context?',
      a: 'No. It is the template the first current context of each thread is copied from (and what Context() starts from). Use getcontext() to see the current context.',
    },
    {
      q: 'How do I make decimal return NaN instead of raising exceptions?',
      a: 'Run the code under a context without traps: with localcontext(ExtendedContext): …, or Context(traps=[]). Then check ctx.flags to see which conditions occurred.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.DefaultContext',
    meta:  'decimal.DefaultContext, BasicContext, ExtendedContext',
  },
};
