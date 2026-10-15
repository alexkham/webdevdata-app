// content/reference/python/stdlib/decimal/limits.js — MAX_PREC, MAX_EMAX, MIN_EMIN, MIN_ETINY, HAVE_THREADS, HAVE_CONTEXTVAR

export const meta = {
  slug:        'limits',
  name:        'decimal.MAX_PREC',
  signature:   'decimal.MAX_PREC, MAX_EMAX, MIN_EMIN, MIN_ETINY, HAVE_THREADS, HAVE_CONTEXTVAR',
  blurb:       "The C module's hard limits for precision and exponents, and two build flags: whether threads and context variables are supported.",
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.3+ (HAVE_CONTEXTVAR: 3.8.3+)',
  searchTerms: 'decimal MAX_PREC MAX_EMAX MIN_EMIN MIN_ETINY HAVE_THREADS HAVE_CONTEXTVAR maximum precision decimal limits exponent range 999999999999999999 arbitrary precision bignum decimal contextvar thread local',
};

export const method = {
  slug:      'limits',
  name:      'decimal.MAX_PREC',
  signature: 'decimal.MAX_PREC, MAX_EMAX, MIN_EMIN, MIN_ETINY, HAVE_THREADS, HAVE_CONTEXTVAR',
  returns:   { type: 'int | bool', desc: 'Four ints bounding Context.prec, Context.Emax, Context.Emin and Etiny(); two bools describing the build.' },

  category:    'decimal constants',
  version:     'Python 3.3+ (HAVE_CONTEXTVAR: 3.8.3+)',
  hasLiveDemo: true,

  subtitle: 'On 64-bit builds precision and exponents can go up to 999999999999999999 — far beyond what memory allows for inexact results, but useful for exact big-number arithmetic. The values are smaller on 32-bit builds.',

  covers: ['MAX_PREC', 'MAX_EMAX', 'MIN_EMIN', 'MIN_ETINY', 'HAVE_THREADS', 'HAVE_CONTEXTVAR'],

  cheat: {
    commonCall: 'Context(prec=MAX_PREC, Emax=MAX_EMAX, Emin=MIN_EMIN)',
    returns:    'a context for exact arithmetic on huge numbers',
    replaces:   'guessing the valid range for prec, Emin and Emax',
    watchOut:   'an inexact result (1/3) under MAX_PREC needs more memory than exists — MemoryError',
  },

  parameters: [],

  modes: [
    {
      id: 'range',
      label: 'valid ranges',
      blurb: 'prec must be in [1, MAX_PREC], Emin in [MIN_EMIN, 0], Emax in [0, MAX_EMAX]. Try values outside.',
      params: [
        { name: 'prec', type: 'int', hint: '1 to MAX_PREC',   input: 'number' },
        { name: 'Emin', type: 'int', hint: 'MIN_EMIN to 0',   input: 'number' },
        { name: 'Emax', type: 'int', hint: '0 to MAX_EMAX',   input: 'number' },
      ],
      template: 'from decimal import Context\nctx = Context(prec={$prec}, Emin={$Emin}, Emax={$Emax})\n(ctx.Etiny(), ctx.Etop())',
      cases: [
        { id: 'default', label: 'defaults',          values: { prec: '28', Emin: '-999999', Emax: '999999' } },
        { id: 'small',   label: 'prec 3, ±99',       values: { prec: '3', Emin: '-99', Emax: '99' } },
        { id: 'prec',    label: 'prec 10**18',       values: { prec: '1000000000000000000', Emin: '-999999', Emax: '999999' } },
        { id: 'emin',    label: 'Emin 1',            values: { prec: '28', Emin: '1', Emax: '999999' } },
        { id: 'emax',    label: 'Emax 10**18',       values: { prec: '28', Emin: '-999999', Emax: '1000000000000000000' } },
      ],
    },
  ],
  demoExplainer: 'Etiny() is Emin - prec + 1 and Etop() is Emax - prec + 1, so the defaults give (-1000026, 999972). One more than MAX_PREC (999999999999999999) is rejected with "valid range for prec is [1, MAX_PREC]"; Emin must not be positive and Emax must not exceed MAX_EMAX, each with its own ValueError message.',

  patterns: [
    {
      name: 'Exact big-number arithmetic',
      desc: 'With maximal limits, exact results are computed at full length (since 3.9 this works for all exact results except non-integer powers).',
      code: 'from decimal import Decimal, localcontext, MAX_PREC, MAX_EMAX, MIN_EMIN\nwith localcontext(prec=MAX_PREC, Emax=MAX_EMAX, Emin=MIN_EMIN):\n    x = Decimal(2) ** 256 / 128',
    },
    {
      name: 'Large but safe precision',
      desc: 'Pick a precision your memory can hold and trap Inexact so nothing silently rounds or explodes.',
      code: 'from decimal import Context, Inexact, MAX_EMAX, MIN_EMIN\nctx = Context(prec=10**6, Emax=MAX_EMAX, Emin=MIN_EMIN, traps=[Inexact])',
    },
  ],

  examples: [
    { title: 'The 64-bit values', code: 'from decimal import MAX_PREC, MAX_EMAX, MIN_EMIN, MIN_ETINY\n(MAX_PREC, MAX_EMAX, MIN_EMIN, MIN_ETINY)', returns: '(999999999999999999, 999999999999999999, -999999999999999999, -1999999999999999997)' },
    { title: 'How MIN_ETINY is derived', code: 'from decimal import MAX_PREC, MIN_EMIN, MIN_ETINY\nMIN_ETINY == MIN_EMIN - (MAX_PREC - 1)', returns: 'True' },
    { title: 'The build flags', code: 'import decimal\n(decimal.HAVE_THREADS, decimal.HAVE_CONTEXTVAR)', returns: '(True, True)' },
    { title: 'MAX_PREC itself is allowed', code: 'from decimal import Context, MAX_PREC\nContext(prec=MAX_PREC).prec == MAX_PREC', returns: 'True' },
    { title: 'One more is not', code: 'from decimal import Context, MAX_PREC\nContext(prec=MAX_PREC + 1)', returns: 'ValueError: valid range for prec is [1, MAX_PREC]' },
    { title: 'Exact 2**256 / 128 at full precision', code: 'from decimal import Decimal, localcontext, MAX_PREC, MAX_EMAX, MIN_EMIN\nwith localcontext(prec=MAX_PREC, Emax=MAX_EMAX, Emin=MIN_EMIN):\n    x = Decimal(2) ** 256\n    r = x / 128\nr', returns: "Decimal('904625697166532776746648320380374280103671755200316906558262375061821325312')" },
    { title: 'Exponents beyond the limits', code: "from decimal import Decimal\nDecimal('1e9999999999999999999')", returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
  ],

  pitfalls: [
    {
      name: 'Hard-coding a precision limit',
      desc: 'The maximum depends on the build (it is 425000000 on 32-bit). Compare against the constant.',
      wrong: { label: 'a literal', code: 'from decimal import Context\nContext(prec=10**18)', output: 'ValueError: valid range for prec is [1, MAX_PREC]' },
      fix:   { label: 'MAX_PREC', code: 'from decimal import Context, MAX_PREC\nContext(prec=min(10**18, MAX_PREC)).prec', output: '999999999999999999' },
    },
  ],

  when: {
    use: [
      'Exact arithmetic on very large numbers: prec=MAX_PREC with Emax=MAX_EMAX and Emin=MIN_EMIN',
      'Validating user-supplied precision or exponent limits before building a Context',
      'HAVE_CONTEXTVAR to know whether asyncio tasks get separate contexts',
    ],
    avoid: [
      'MAX_PREC for anything inexact (1/3, sqrt(2)) — the result would need ~10**18 digits; the docs show MemoryError',
      'HAVE_THREADS checks in new code — it is always True and deprecated since 3.9',
      'Relying on the 64-bit values in code that may run on 32-bit builds',
    ],
  },

  notes: {
    cpython:     'Defined by the C module from libmpdec\'s MPD_MAX_PREC, MPD_MAX_EMAX, MPD_MIN_EMIN, MPD_MIN_ETINY; _pydecimal defines the same values (choosing the 32-bit ones when sys.maxsize is smaller)',
    '32-bit':    'MAX_PREC = MAX_EMAX = 425000000, MIN_EMIN = -425000000, MIN_ETINY = -849999999',
    HAVE_THREADS: 'Always True; deprecated since 3.9 because Python always has threads',
    HAVE_CONTEXTVAR: 'True by default: the current context is coroutine-local (a contextvars.ContextVar). Built with --without-decimal-contextvar it is False and the context is only thread-local. Added in 3.8.3',
  },

  related: [
    { name: 'Context', slug: 'context', when: 'prec, Emin, Emax' },
    { name: 'Overflow and Underflow', slug: 'overflow-underflow', when: 'What happens at Emax and Etiny' },
    { name: 'getcontext / setcontext', slug: 'getcontext-setcontext', when: 'Thread and task contexts' },
    { name: 'MemoryError', slug: 'memoryerror', when: 'Inexact results at MAX_PREC', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the maximum precision of Python decimal?',
      a: 'MAX_PREC: 999999999999999999 digits on 64-bit builds (425000000 on 32-bit). In practice memory is the limit — an inexact result at that precision cannot be stored, so use it only when every result is exact.',
    },
    {
      q: 'Can decimal do arbitrary-precision integer arithmetic?',
      a: 'Yes: with prec=MAX_PREC, Emax=MAX_EMAX and Emin=MIN_EMIN exact results are kept in full, and libmpdec uses fast multiplication for big operands. For plain integers, int is simpler.',
    },
    {
      q: 'What does HAVE_CONTEXTVAR mean?',
      a: 'When True (the default), the current decimal context is stored in a context variable, so setcontext() or localcontext() inside an asyncio task only affects that task. When False (a build configured with --without-decimal-contextvar), it is per thread only.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#constants',
    meta:  'decimal — Constants',
  },
};
