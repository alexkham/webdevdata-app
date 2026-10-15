// content/reference/python/stdlib/decimal/decimalexception.js — the base signal class, flags and traps

export const meta = {
  slug:        'decimalexception',
  name:        'decimal.DecimalException',
  signature:   'decimal.DecimalException',
  blurb:       'The base class of every decimal signal. Each signal has a flag (set when the condition happens) and a trap (raise when it happens) in the context — catch DecimalException to handle any of them.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'decimal DecimalException decimal signals flags traps trap enabler context.flags context.traps clear_flags sticky flags decimal exception list of conditions ArithmeticError catch all decimal errors decimal.DivisionByZero decimal.InvalidOperation Inexact Rounded Overflow',
};

export const method = {
  slug:      'decimalexception',
  name:      'decimal.DecimalException',
  signature: 'decimal.DecimalException',

  category:    'decimal exception',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'decimal reports nine conditions, called signals: InvalidOperation, FloatOperation, DivisionByZero, Overflow, Underflow, Subnormal, Inexact, Rounded and Clamped. For each one the context has a flag, set whenever the condition happens, and a trap: if the trap is on, the operation raises that signal class. All of them derive from DecimalException, which derives from ArithmeticError.',

  covers: ['DecimalException'],

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'DecimalException'],

  cheat: {
    raisedBy: 'Never directly — a trapped signal raises its own subclass (DivisionByZero, InvalidOperation, Overflow…)',
    message:  "[<class 'decimal.DivisionByZero'>] — the list of trapped conditions",
    quickFix: 'except decimal.DecimalException catches every decimal signal; read ctx.flags for the untrapped ones',
    watchOut: 'Flags are sticky: call ctx.clear_flags() before the operation you want to check',
  },

  modes: [
    {
      id: 'flags',
      label: 'flags',
      blurb: 'One multiplication in a private context with every trap off and exponents limited to ±99: the result and the signals it set.',
      params: [
        { name: 'a',    type: 'str', hint: 'a number',           input: 'text' },
        { name: 'b',    type: 'str', hint: 'a number',           input: 'text' },
        { name: 'prec', type: 'int', hint: 'significant digits', input: 'number' },
      ],
      template: 'from decimal import Context, Decimal\nctx = Context(prec={$prec}, Emin=-99, Emax=99, traps=[])\nr = ctx.multiply(Decimal({$a}), Decimal({$b}))\n(r, [s.__name__ for s, on in ctx.flags.items() if on])',
      cases: [
        { id: 'exact',     label: '1.5 × 4',          values: { a: '1.5', b: '4', prec: '9' } },
        { id: 'inexact',   label: '1.23456 × 2, prec 3', values: { a: '1.23456', b: '2', prec: '3' } },
        { id: 'rounded',   label: '1.20 × 10, prec 2', values: { a: '1.20', b: '10', prec: '2' } },
        { id: 'overflow',  label: '1E+60 × 1E+60',    values: { a: '1E+60', b: '1E+60', prec: '9' } },
        { id: 'subnormal', label: '1E-50 × 1E-50',    values: { a: '1E-50', b: '1E-50', prec: '9' } },
        { id: 'underflow', label: '1E-60 × 1E-60',    values: { a: '1E-60', b: '1E-60', prec: '9' } },
      ],
    },
    {
      id: 'trap',
      label: 'trap one signal',
      blurb: 'Inside localcontext(), turn on the trap of the named signal only (and off every other). That condition now raises; the others just set flags.',
      params: [
        { name: 'a',      type: 'str', hint: 'dividend',       input: 'text' },
        { name: 'b',      type: 'str', hint: 'divisor',        input: 'text' },
        { name: 'signal', type: 'str', hint: 'e.g. Inexact',   input: 'text' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext() as ctx:\n    for s in ctx.traps:\n        ctx.traps[s] = s.__name__ == {$signal}\n    r = Decimal({$a}) / Decimal({$b})\nr',
      cases: [
        { id: 'inexact',  label: '1/3, Inexact',          values: { a: '1', b: '3', signal: 'Inexact' } },
        { id: 'quiet',    label: '1/3, Overflow',         values: { a: '1', b: '3', signal: 'Overflow' } },
        { id: 'exact',    label: '1/8, Inexact',          values: { a: '1', b: '8', signal: 'Inexact' } },
        { id: 'inf',      label: '1/0, Inexact',          values: { a: '1', b: '0', signal: 'Inexact' } },
        { id: 'zero',     label: '1/0, DivisionByZero',   values: { a: '1', b: '0', signal: 'DivisionByZero' } },
        { id: 'undef',    label: '0/0, InvalidOperation', values: { a: '0', b: '0', signal: 'InvalidOperation' } },
      ],
    },
    {
      id: 'catch',
      label: 'catch them all',
      blurb: 'except decimal.DecimalException catches whichever signal a division raises with the default traps.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: "import decimal\nfrom decimal import Decimal\ntry:\n    r = Decimal({$a}) / Decimal({$b})\nexcept decimal.DecimalException as e:\n    r = (type(e).__name__, isinstance(e, ArithmeticError), str(e))\nr",
      cases: [
        { id: 'zero',  label: '1 / 0',         values: { a: '1', b: '0' } },
        { id: 'undef', label: '0 / 0',         values: { a: '0', b: '0' } },
        { id: 'text',  label: "'1,5' / 2",     values: { a: '1,5', b: '2' } },
        { id: 'inf',   label: 'inf / inf',     values: { a: 'Infinity', b: 'Infinity' } },
        { id: 'ok',    label: '1 / 8',         values: { a: '1', b: '8' } },
      ],
    },
  ],
  demoExplainer: "In flags, 1.5 × 4 is exact and sets nothing. 1.23456 × 2 = 2.46912 needs rounding to 3 digits, so Inexact and Rounded are set. 1.20 × 10 = 12.00 drops only zeros at prec 2: Rounded without Inexact. 1E+120 is beyond Emax=99, so the untrapped Overflow returns Infinity (with Inexact and Rounded). 1E-100 is below Emin=-99 but still representable: Subnormal alone. 1E-120 is below the smallest exponent the context can hold (Etiny = Emin - prec + 1 = -107), so it becomes 0E-107 with Underflow, Subnormal, Inexact, Rounded and Clamped. In trap, the loop leaves only the named trap on: 1/3 raises Inexact when that is trapped and is just rounded otherwise, and 1/0 returns Infinity unless DivisionByZero is the trapped one. In catch, every failure is caught by the base class: the type is the first trapped signal and str(e) lists the conditions — 0/0 is reported as InvalidOperation with the condition DivisionUndefined, '1,5' as ConversionSyntax.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "One item when the C module raises it: a list of the trapped condition classes, e.g. ([<class 'decimal.DivisionByZero'>],)." },
  ],

  patterns: [
    {
      name: 'Catch any decimal failure',
      desc: 'One except clause for bad input, division by zero, overflow…',
      code: "import decimal\nfrom decimal import Decimal\ntry:\n    rate = Decimal(text) / Decimal(days)\nexcept decimal.DecimalException as e:\n    print('cannot compute:', type(e).__name__)",
    },
    {
      name: 'Check whether a calculation was exact',
      desc: 'Clear the flags, compute, then read them.',
      code: 'from decimal import Inexact, localcontext\nwith localcontext() as ctx:\n    ctx.clear_flags()\n    result = a / b\n    exact = not ctx.flags[Inexact]',
    },
    {
      name: 'List the signals an operation raised',
      desc: 'flags is a mapping of signal class → bool.',
      code: 'raised = [s.__name__ for s, on in ctx.flags.items() if on]',
    },
  ],

  examples: [
    { title: 'Every signal is an ArithmeticError', code: 'import decimal\n(issubclass(decimal.Overflow, decimal.DecimalException), issubclass(decimal.DecimalException, ArithmeticError))', returns: '(True, True)' },
    { title: 'The nine signals of a context',      code: 'from decimal import Context\n[s.__name__ for s in Context().traps]', returns: "['InvalidOperation', 'FloatOperation', 'DivisionByZero', 'Overflow', 'Underflow', 'Subnormal', 'Inexact', 'Rounded', 'Clamped']" },
    { title: 'Trapped by default',                 code: 'from decimal import Context\n[s.__name__ for s, on in Context().traps.items() if on]', returns: "['InvalidOperation', 'DivisionByZero', 'Overflow']" },
    { title: 'Flags record what happened',         code: 'from decimal import Context, Decimal\nctx = Context(prec=5)\nctx.divide(Decimal(1), Decimal(3))\n[s.__name__ for s, on in ctx.flags.items() if on]', returns: "['Inexact', 'Rounded']" },
    { title: 'The exception carries a list',       code: 'import decimal\nfrom decimal import Decimal\ntry:\n    Decimal(1) / 0\nexcept decimal.DecimalException as e:\n    info = (type(e).__name__, e.args)\ninfo', returns: "('DivisionByZero', ([<class 'decimal.DivisionByZero'>],))" },
    { title: 'Two conditions in one error',        code: 'from decimal import Decimal\ndivmod(Decimal(5), 0)', returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>, <class 'decimal.DivisionByZero'>]" },
    { title: 'No traps: special values instead',   code: 'from decimal import Context, Decimal\nctx = Context(traps=[])\n(ctx.divide(Decimal(1), 0), ctx.divide(Decimal(0), 0))', returns: "(Decimal('Infinity'), Decimal('NaN'))" },
    { title: 'Only the nine signals are keys',     code: 'import decimal\ndecimal.Context().traps[decimal.DecimalException] = True', returns: "KeyError: 'valid values for signals are:\\n  [InvalidOperation, FloatOperation, DivisionByZero,\\n   Overflow, Underflow, Subnormal, Inexact, Rounded,\\n   Clamped]'" },
  ],

  pitfalls: [
    {
      name: 'Reading flags without clearing them',
      desc: 'Flags are sticky: once set they stay set until cleared, so an exact addition still shows Inexact from an earlier division.',
      wrong: { label: 'no clear_flags()', code: 'from decimal import Context, Decimal, Inexact\nctx = Context(prec=5)\nctx.divide(Decimal(1), Decimal(3))\nr = ctx.add(Decimal(1), Decimal(2))\nctx.flags[Inexact]', output: 'True' },
      fix:   { label: 'clear first',      code: 'from decimal import Context, Decimal, Inexact\nctx = Context(prec=5)\nctx.divide(Decimal(1), Decimal(3))\nctx.clear_flags()\nr = ctx.add(Decimal(1), Decimal(2))\nctx.flags[Inexact]', output: 'False' },
    },
    {
      name: 'Comparing the condition list with ==',
      desc: 'One operation can report several conditions at once — divmod by zero lists InvalidOperation and DivisionByZero. Test membership instead.',
      wrong: { label: '== [DivisionByZero]', code: 'from decimal import Decimal, DecimalException, DivisionByZero\ntry:\n    divmod(Decimal(5), 0)\nexcept DecimalException as e:\n    by_zero = e.args[0] == [DivisionByZero]\nby_zero', output: 'False' },
      fix:   { label: 'in e.args[0]',        code: 'from decimal import Decimal, DecimalException, DivisionByZero\ntry:\n    divmod(Decimal(5), 0)\nexcept DecimalException as e:\n    by_zero = DivisionByZero in e.args[0]\nby_zero', output: 'True' },
    },
  ],

  when: {
    use: [
      'except decimal.DecimalException around code that turns user input into Decimals and computes with them',
      'ctx.flags to learn after the fact whether a calculation rounded, overflowed or produced a NaN',
      'Trapping extra signals (Inexact, FloatOperation) inside localcontext() when they must never happen',
    ],
    avoid: [
      'Raising DecimalException yourself — raise a specific error of your own',
      'Parsing str(e) — test the type or membership in e.args[0]',
      'except ArithmeticError when you only mean decimal problems: it also catches int and float errors',
    ],
  },

  notes: {
    cpython:      "The C module (_decimal) collects the status of an operation, sets all its flags, and if any of them are trapped raises the first trapped signal class with a list of the trapped conditions as its argument; Lib/_pydecimal.py instead raises at the first trapped condition with a text message",
    'Signals':    'InvalidOperation, FloatOperation, DivisionByZero, Overflow, Underflow, Subnormal, Inexact, Rounded, Clamped — the keys of ctx.flags and ctx.traps, in that order',
    'Conditions': 'ConversionSyntax, DivisionImpossible, DivisionUndefined and InvalidContext are subclasses of InvalidOperation that only appear in the condition list; they are not keys of flags or traps',
    'Default traps': 'InvalidOperation, DivisionByZero and Overflow (DefaultContext); BasicContext also traps Underflow and Clamped; ExtendedContext traps nothing',
  },

  related: [
    { name: 'InvalidOperation', slug: 'invalidoperation',   when: 'Bad input, 0/0, NaN ordering' },
    { name: 'DivisionByZero',   slug: 'divisionbyzero',     when: 'x / 0' },
    { name: 'Inexact and Rounded', slug: 'inexact-rounded', when: 'Detect rounding' },
    { name: 'Overflow, Underflow, Subnormal, Clamped', slug: 'overflow-underflow', when: 'Exponent limits' },
    { name: 'FloatOperation',   slug: 'floatoperation',     when: 'Mixing floats and Decimals' },
    { name: 'Context',          slug: 'context',            when: 'Where flags and traps live' },
    { name: 'localcontext()',   slug: 'localcontext',       when: 'Change traps for one block' },
    { name: 'ArithmeticError',  slug: 'arithmeticerror',    when: 'The built-in parent class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I catch all decimal errors in Python?',
      a: 'except decimal.DecimalException: every signal class (InvalidOperation, DivisionByZero, Overflow, FloatOperation…) derives from it. It is itself an ArithmeticError, so except ArithmeticError also works but catches int and float errors too.',
    },
    {
      q: 'What is the difference between flags and traps in decimal?',
      a: 'Both are mappings with one entry per signal on the context. A flag is set to True when the condition happens and stays True until clear_flags(). A trap decides whether the condition raises: with the default context only InvalidOperation, DivisionByZero and Overflow are trapped; the rest only set flags.',
    },
    {
      q: "Why does the decimal error message look like [<class 'decimal.DivisionByZero'>]?",
      a: 'CPython uses the C implementation, which raises the first trapped signal and passes the list of all trapped conditions of that operation as the argument. Usually the list has one class; divmod(Decimal(5), 0) lists both InvalidOperation and DivisionByZero.',
    },
    {
      q: 'How do I make decimal raise an error when a result is rounded?',
      a: 'Trap Inexact for that calculation: with localcontext() as ctx: ctx.traps[Inexact] = True. Any result that loses non-zero digits then raises decimal.Inexact instead of being rounded silently.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.DecimalException',
    meta:  'decimal — Signals',
  },
};
