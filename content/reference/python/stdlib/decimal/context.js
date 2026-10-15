// content/reference/python/stdlib/decimal/context.js — the Context class and its attributes

export const meta = {
  slug:        'context',
  name:        'decimal.Context',
  signature:   'decimal.Context(prec=None, rounding=None, Emin=None, Emax=None, capitals=None, clamp=None, flags=None, traps=None)',
  blurb:       'The settings every Decimal operation runs under: precision, rounding mode, exponent limits, and which signals are recorded (flags) or raised (traps).',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'decimal Context class context precision prec rounding Emin Emax capitals clamp flags traps Context.prec Context.rounding Context.Emin Context.Emax Context.capitals Context.clamp Context.Etiny Context.Etop Etiny Etop Context.copy copy Context.clear_flags clear_flags Context.clear_traps clear_traps decimal settings exponent limits',
};

export const method = {
  slug:      'context',
  name:      'decimal.Context',
  signature: 'decimal.Context(prec=None, rounding=None, Emin=None, Emax=None, capitals=None, clamp=None, flags=None, traps=None)',
  returns:   { type: 'Context', desc: 'A new, independent context. Unset fields are copied from DefaultContext; flags start cleared.' },

  category:    'decimal class',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'A Context is a bundle of rules. Use it as the current context (localcontext, setcontext) or call its methods directly — ctx.divide(a, b) computes under ctx without touching the current context. Its flags record what happened; its traps decide what raises.',

  covers: [
    'Context', 'Context.prec', 'Context.rounding', 'Context.Emin', 'Context.Emax', 'Context.capitals', 'Context.clamp',
    'Context.Etiny', 'Context.Etop', 'Context.copy', 'Context.clear_flags', 'Context.clear_traps',
  ],

  cheat: {
    commonCall: 'ctx = Context(prec=10, rounding=ROUND_HALF_UP)',
    returns:    'a context; ctx.divide(1, 3) → Decimal(\'0.3333333333\')',
    replaces:   'changing the global getcontext() for one calculation',
    watchOut:   'flags are sticky — call ctx.clear_flags() before checking them',
  },

  parameters: [
    { name: 'prec',     type: 'int',  required: false, default: 'None', desc: 'Significant digits of every result, 1 to MAX_PREC. DefaultContext has 28.' },
    { name: 'rounding', type: 'str',  required: false, default: 'None', desc: 'One of the eight ROUND_* constants. DefaultContext uses ROUND_HALF_EVEN.' },
    { name: 'Emin',     type: 'int',  required: false, default: 'None', desc: 'Smallest adjusted exponent of a normal number, MIN_EMIN to 0 (default -999999). Smaller results become subnormal.' },
    { name: 'Emax',     type: 'int',  required: false, default: 'None', desc: 'Largest adjusted exponent, 0 to MAX_EMAX (default 999999). Larger results overflow.' },
    { name: 'capitals', type: 'int',  required: false, default: 'None', desc: '1 prints exponents with E (the default), 0 with e.' },
    { name: 'clamp',    type: 'int',  required: false, default: 'None', desc: '1 limits exponents to at most Etop() (the IEEE 754 interchange-format rule), padding coefficients with zeros; 0 (default) does not.' },
    { name: 'flags',    type: 'list of signals', required: false, default: 'None', desc: 'Signals whose flags start set. Normally left empty.' },
    { name: 'traps',    type: 'list of signals', required: false, default: 'None', desc: 'Signals that raise. Default: InvalidOperation, DivisionByZero, Overflow. traps=[] makes everything silent.' },
  ],

  modes: [
    {
      id: 'build',
      label: 'build one',
      blurb: 'Create a context and look at its repr. Bad values fail when the context is created.',
      params: [
        { name: 'prec',     type: 'int', hint: '1 to MAX_PREC', input: 'number' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name', input: 'text' },
        { name: 'Emax',     type: 'int', hint: '0 to MAX_EMAX',  input: 'number' },
      ],
      template: 'from decimal import Context\nContext(prec={$prec}, rounding={$rounding}, Emax={$Emax})',
      cases: [
        { id: 'ok',    label: 'prec 5, HALF_UP', values: { prec: '5', rounding: 'ROUND_HALF_UP', Emax: '999999' } },
        { id: 'prec0', label: 'prec 0',          values: { prec: '0', rounding: 'ROUND_HALF_UP', Emax: '999999' } },
        { id: 'name',  label: "'HALF_UP'",       values: { prec: '9', rounding: 'HALF_UP', Emax: '999999' } },
        { id: 'emax',  label: 'Emax -1',         values: { prec: '9', rounding: 'ROUND_DOWN', Emax: '-1' } },
      ],
    },
    {
      id: 'flags',
      label: 'flags',
      blurb: 'Divide with a context\'s own method and list the flags the division set.',
      params: [
        { name: 'a',    type: 'str', hint: 'dividend',  input: 'text' },
        { name: 'b',    type: 'str', hint: 'divisor',   input: 'text' },
        { name: 'prec', type: 'int', hint: 'precision', input: 'number' },
      ],
      template: 'from decimal import Context, Decimal\nctx = Context(prec={$prec})\nresult = ctx.divide(Decimal({$a}), Decimal({$b}))\n(result, [s.__name__ for s, on in ctx.flags.items() if on])',
      cases: [
        { id: 'exact', label: '1/4',          values: { a: '1', b: '4', prec: '28' } },
        { id: 'third', label: '1/3, prec 5',  values: { a: '1', b: '3', prec: '5' } },
        { id: 'round', label: '100/4, prec 1', values: { a: '100', b: '4', prec: '1' } },
        { id: 'zero',  label: '1/0',          values: { a: '1', b: '0', prec: '28' } },
      ],
    },
    {
      id: 'limits',
      label: 'Emin / Emax',
      blurb: 'A tiny exponent range: see Etiny() and Etop(), and what create_decimal() does with numbers that do not fit.',
      params: [
        { name: 'x',    type: 'str', hint: 'a number',   input: 'text' },
        { name: 'prec', type: 'int', hint: 'precision',  input: 'number' },
        { name: 'Emin', type: 'int', hint: '<= 0',       input: 'number' },
        { name: 'Emax', type: 'int', hint: '>= 0',       input: 'number' },
      ],
      template: 'from decimal import Context\nctx = Context(prec={$prec}, Emin={$Emin}, Emax={$Emax})\n(ctx.Etiny(), ctx.Etop(), ctx.create_decimal({$x}))',
      cases: [
        { id: 'fits',  label: '123456',  values: { x: '123456', prec: '3', Emin: '-5', Emax: '5' } },
        { id: 'big',   label: '1e6',     values: { x: '1e6', prec: '3', Emin: '-5', Emax: '5' } },
        { id: 'sub',   label: '1e-7',    values: { x: '1e-7', prec: '3', Emin: '-5', Emax: '5' } },
        { id: 'under', label: '1.5e-8',  values: { x: '1.5e-8', prec: '3', Emin: '-5', Emax: '5' } },
      ],
    },
  ],
  demoExplainer: 'Validation happens at construction: prec 0 is a ValueError ("valid range for prec is [1, MAX_PREC]"), a rounding name the module does not know is a TypeError listing the eight valid ones, and Emax must be at least 0. In the flags tab 1/4 is exact and sets nothing, 1/3 sets Inexact and Rounded, 100/4 at one digit becomes 2E+1, and 1/0 raises DivisionByZero because a new Context traps it (like DefaultContext). With prec 3, Emin -5 and Emax 5, Etiny() is -7 and Etop() is 3: 123456 rounds to 1.23E+5, 1e6 overflows (trapped, so it raises), 1e-7 is a subnormal that still fits, and 1.5e-8 is below Etiny and rounds to 0E-7.',

  patterns: [
    {
      name: 'One context for one job',
      desc: 'Context methods compute under that context only — no global state is touched.',
      code: "from decimal import Context, Decimal, ROUND_HALF_UP\nmoney = Context(prec=12, rounding=ROUND_HALF_UP)\nvat = money.multiply(net, Decimal('0.19'))",
    },
    {
      name: 'Check whether a calculation was exact',
      desc: 'Clear the flags, compute, then look at Inexact.',
      code: "from decimal import Context, Inexact\nctx = Context(prec=20)\nctx.clear_flags()\nresult = ctx.divide(a, b)\nif ctx.flags[Inexact]:\n    print('result was rounded')",
    },
    {
      name: 'Make every signal silent',
      desc: 'With no traps, problems produce Infinity or NaN and set flags instead of raising.',
      code: 'from decimal import Context\nctx = Context(traps=[])\nctx.divide(1, 0)   # Decimal(\'Infinity\')',
    },
  ],

  examples: [
    { title: 'A context and its repr', code: 'from decimal import Context, ROUND_DOWN\nContext(prec=5, rounding=ROUND_DOWN)', returns: 'Context(prec=5, rounding=ROUND_DOWN, Emin=-999999, Emax=999999, capitals=1, clamp=0, flags=[], traps=[InvalidOperation, DivisionByZero, Overflow])' },
    { title: 'Context methods accept ints', code: 'from decimal import Context\nContext(prec=5).divide(1, 7)', returns: "Decimal('0.14286')" },
    { title: 'copy() is independent',  code: 'from decimal import Context\na = Context(prec=5)\nb = a.copy()\nb.prec = 10\n(a.prec, b.prec)', returns: '(5, 10)' },
    { title: 'Etiny and Etop',         code: 'from decimal import Context\nctx = Context(prec=3, Emin=-5, Emax=5)\n(ctx.Etiny(), ctx.Etop())', returns: '(-7, 3)' },
    { title: 'clamp=1 pads the coefficient', code: "from decimal import Context\nContext(prec=6, Emax=999, clamp=1).create_decimal('1.23e999')", returns: "Decimal('1.23000E+999')" },
    { title: 'capitals=0: lowercase e', code: "from decimal import Context, Decimal\nContext(capitals=0).to_sci_string(Decimal('6.02E+23'))", returns: "'6.02e+23'" },
    { title: 'No traps: Infinity instead of an error', code: 'from decimal import Context\nctx = Context()\nctx.clear_traps()\nctx.divide(1, 0)', returns: "Decimal('Infinity')" },
    { title: 'Attributes are validated', code: "from decimal import Context\nctx = Context()\nctx.rounding = 'up'", returns: 'TypeError: valid values for rounding are:\n  [ROUND_CEILING, ROUND_FLOOR, ROUND_UP, ROUND_DOWN,\n   ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN,\n   ROUND_05UP]' },
  ],

  pitfalls: [
    {
      name: 'Misspelling an attribute',
      desc: 'Context has a fixed set of attributes; a typo is an AttributeError, not a silently ignored setting.',
      wrong: { label: 'ctx.precision', code: 'from decimal import Context\nctx = Context()\nctx.precision = 50', output: "AttributeError: 'decimal.Context' object has no attribute 'precision'" },
      fix:   { label: 'ctx.prec', code: 'from decimal import Context\nctx = Context()\nctx.prec = 50\nctx.prec', output: '50' },
    },
    {
      name: 'Reading flags without clearing them',
      desc: 'A flag stays set until you clear it, so it reports anything that happened since — not just the last operation.',
      wrong: { label: 'stale flag', code: 'from decimal import Context, Inexact\nctx = Context(prec=3)\nctx.divide(1, 3)\nctx.add(1, 1)\nctx.flags[Inexact]', output: 'True' },
      fix:   { label: 'clear_flags() first', code: 'from decimal import Context, Inexact\nctx = Context(prec=3)\nctx.divide(1, 3)\nctx.clear_flags()\nctx.add(1, 1)\nctx.flags[Inexact]', output: 'False' },
    },
    {
      name: 'Expecting Context() to copy the current context',
      desc: 'A new Context starts from DefaultContext, whatever the current context is. Copy the current one explicitly.',
      wrong: { label: 'Context()', code: 'from decimal import Context, localcontext\nwith localcontext(prec=5):\n    p = Context().prec\np', output: '28' },
      fix:   { label: 'getcontext().copy()', code: 'from decimal import getcontext, localcontext\nwith localcontext(prec=5):\n    p = getcontext().copy().prec\np', output: '5' },
    },
  ],

  when: {
    use: [
      'Several calculations that need different precision or rounding in the same program',
      'Library code that must not change the caller\'s current context',
      'Detecting inexact results, overflow or underflow through flags',
    ],
    avoid: [
      'One temporary change around a block of code → localcontext()',
      'Changing DefaultContext to configure your program → set up a context explicitly',
      'Calling methods on BasicContext / ExtendedContext themselves → their flags are shared; copy them first',
    ],
  },

  notes: {
    cpython:      'Modules/_decimal/_decimal.c wraps libmpdec\'s mpd_context_t; every attribute assignment is validated (ValueError or TypeError) and there are no other attributes',
    'Attributes': 'prec, rounding, Emin, Emax, capitals, clamp — plus flags and traps, dict-like objects keyed by the signal classes',
    'Etiny / Etop': 'Etiny() = Emin - prec + 1, the smallest exponent of a subnormal; Etop() = Emax - prec + 1, the largest exponent when clamp is 1',
    'Versions':   'clear_traps() was added in 3.3; keyword arguments to localcontext() in 3.11',
  },

  related: [
    { name: 'localcontext()', slug: 'localcontext', when: 'Use a context for one block' },
    { name: 'getcontext / setcontext', slug: 'getcontext-setcontext', when: 'The current context' },
    { name: 'DefaultContext and friends', slug: 'defaultcontext-basiccontext-extendedcontext', when: 'The templates' },
    { name: 'Rounding modes', slug: 'rounding', when: 'Values for rounding=' },
    { name: 'Signals', slug: 'decimalexception', when: 'What flags and traps refer to' },
    { name: 'Limits', slug: 'limits', when: 'MAX_PREC, MAX_EMAX, MIN_EMIN' },
  ],

  faq: [
    {
      q: 'What is a context in the Python decimal module?',
      a: 'An object holding the rules for arithmetic: precision (prec), rounding mode, exponent limits (Emin, Emax), how exponents print (capitals), clamp, and for each signal a flag (did it happen?) and a trap (does it raise?). Every operation uses the current context unless you call a Context method or pass context=.',
    },
    {
      q: 'What are flags and traps?',
      a: 'Both are dict-like objects keyed by the signal classes. When a condition such as Inexact happens, its flag is set to True; if its trap is also True, the matching exception is raised. Flags stay set until clear_flags().',
    },
    {
      q: 'What do Emin and Emax mean?',
      a: 'They bound the adjusted exponent (the position of the first digit). A result above Emax overflows; one below Emin is subnormal and can lose digits down to Etiny() = Emin - prec + 1, where it underflows to zero.',
    },
    {
      q: 'What does clamp do?',
      a: "With clamp=1 no exponent may exceed Etop() = Emax - prec + 1; large numbers get zeros added to the coefficient instead, as in IEEE 754 interchange formats: Context(prec=6, Emax=999, clamp=1).create_decimal('1.23e999') is Decimal('1.23000E+999').",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Context',
    meta:  'decimal.Context',
  },
};
