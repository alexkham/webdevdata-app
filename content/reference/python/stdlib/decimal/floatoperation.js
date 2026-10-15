// content/reference/python/stdlib/decimal/floatoperation.js — FloatOperation

export const meta = {
  slug:        'floatoperation',
  name:        'decimal.FloatOperation',
  signature:   'decimal.FloatOperation',
  blurb:       'The signal for mixing floats and Decimals. Off by default (Decimal(0.1) just sets a flag); trap it and Decimal(float) and <, > comparisons with floats raise, while from_float() and == stay allowed.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: "decimal FloatOperation decimal.FloatOperation mixing float and Decimal Decimal(float) error strict float decimal comparison decimal.FloatOperation: [<class 'decimal.FloatOperation'>] prevent float in Decimal from_float create_decimal_from_float TypeError",
};

export const method = {
  slug:      'floatoperation',
  name:      'decimal.FloatOperation',
  signature: 'decimal.FloatOperation',

  category:    'decimal exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: "Decimal(0.1) is allowed and exact — it keeps every binary digit of the float — but it is usually a mistake. FloatOperation records it: by default only the flag is set; with the trap on, implicit float use raises decimal.FloatOperation. Explicit conversions (Decimal.from_float, create_decimal_from_float) and equality tests never raise.",

  covers: ['FloatOperation'],

  chain: ['BaseException', 'Exception', 'TypeError', 'ArithmeticError', 'DecimalException', 'FloatOperation'],

  cheat: {
    raisedBy: 'Only when trapped: Decimal(float), Context.create_decimal(float), and <, <=, >, >= (so also sorted, max, min) between a Decimal and a float',
    message:  "[<class 'decimal.FloatOperation'>]",
    quickFix: 'Convert explicitly: Decimal(str(x)) for the short form, Decimal.from_float(x) for the exact value',
    watchOut: '== and != never raise, they only set the flag; Decimal + float is a plain TypeError either way',
  },

  modes: [
    {
      id: 'flag',
      label: 'flag only',
      blurb: 'Default behaviour: Decimal() of a float works, but sets the FloatOperation flag. Type an int, a float or text.',
      params: [{ name: 'x', type: 'int | float | str', hint: '0.1, 7 or NaN', input: 'auto' }],
      template: 'from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.clear_flags()\n    d = Decimal({$x})\n(d, ctx.flags[FloatOperation])',
      cases: [
        { id: 'tenth', label: '0.1 (float)', values: { x: '0.1' } },
        { id: 'half',  label: '2.5 (float)', values: { x: '2.5' } },
        { id: 'int',   label: '7 (int)',     values: { x: '7' } },
        { id: 'str',   label: "'NaN' (str)", values: { x: 'NaN' } },
      ],
    },
    {
      id: 'strict',
      label: 'trapped',
      blurb: 'With the trap on, a float passed to Decimal() raises; ints and strings are still fine.',
      params: [{ name: 'x', type: 'int | float | str', hint: '0.1, 7 or Infinity', input: 'auto' }],
      template: 'from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    d = Decimal({$x})\nd',
      cases: [
        { id: 'float', label: '0.1 (float)',      values: { x: '0.1' } },
        { id: 'int',   label: '7 (int)',          values: { x: '7' } },
        { id: 'str',   label: "'Infinity' (str)", values: { x: 'Infinity' } },
        { id: 'big',   label: '1e+21 (float)',    values: { x: '1e21' } },
      ],
    },
    {
      id: 'compare',
      label: 'comparisons',
      blurb: 'With the trap on, == against a float is still answered; < raises FloatOperation (caught here). Against an int both work.',
      params: [
        { name: 'a', type: 'str',         hint: 'a Decimal string', input: 'text' },
        { name: 'f', type: 'float | int', hint: '0.5 or 1',         input: 'auto' },
      ],
      template: 'from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    same = Decimal({$a}) == {$f}\n    try:\n        smaller = Decimal({$a}) < {$f}\n    except FloatOperation as e:\n        smaller = type(e).__name__\n(same, smaller)',
      cases: [
        { id: 'half',  label: "'0.5' vs 0.5", values: { a: '0.5', f: '0.5' } },
        { id: 'tenth', label: "'0.1' vs 0.1", values: { a: '0.1', f: '0.1' } },
        { id: 'int',   label: "'0.5' vs 1",   values: { a: '0.5', f: '1' } },
        { id: 'same',  label: "'3.0' vs 3",   values: { a: '3.0', f: '3' } },
      ],
    },
  ],
  demoExplainer: "Decimal(0.1) shows the exact value of the binary float, 0.1000000000000000055511151231257827021181583404541015625, and sets the flag; 2.5 is exact in binary but still a float, so it sets the flag too. An int or a string never does. Trapped, every float raises — 1e21 included, because the code reads 1e+21, a float literal. In comparisons, == is allowed under the trap: Decimal('0.5') == 0.5 is True, Decimal('0.1') == 0.1 is False because the float is not exactly one tenth. < with a float raises FloatOperation; with the int 1 or 3 there is nothing to flag.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "([<class 'decimal.FloatOperation'>],) — the list of trapped conditions." },
  ],

  patterns: [
    {
      name: 'Forbid floats in a block of money code',
      desc: 'Any accidental Decimal(price_float) or price < 0.5 now fails loudly.',
      code: 'from decimal import FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    invoice = build_invoice(lines)',
    },
    {
      name: 'Convert a float deliberately',
      desc: 'Short decimal form through str(), or the exact binary value with from_float().',
      code: 'from decimal import Decimal\nshort = Decimal(str(x))       # 0.1 -> Decimal(\'0.1\')\nexact = Decimal.from_float(x)  # every binary digit',
    },
    {
      name: 'Find out whether floats slipped in',
      desc: 'Leave the trap off, clear the flag, run, then check it.',
      code: 'from decimal import FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.clear_flags()\n    total = compute()\n    mixed = ctx.flags[FloatOperation]',
    },
  ],

  examples: [
    { title: 'Allowed by default, but flagged', code: 'from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.clear_flags()\n    d = Decimal(1.5)\n(d, ctx.flags[FloatOperation])', returns: "(Decimal('1.5'), True)" },
    { title: 'Trapped: Decimal(float) raises',  code: 'from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    d = Decimal(0.1)\nd', returns: "decimal.FloatOperation: [<class 'decimal.FloatOperation'>]" },
    { title: 'from_float() is always allowed',  code: 'from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    d = Decimal.from_float(0.1)\nd', returns: "Decimal('0.1000000000000000055511151231257827021181583404541015625')" },
    { title: 'Equality never raises',           code: "from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    r = Decimal('0.5') == 0.5\nr", returns: 'True' },
    { title: 'Ordering raises',                 code: "from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    r = Decimal('0.5') < 0.75\nr", returns: "decimal.FloatOperation: [<class 'decimal.FloatOperation'>]" },
    { title: 'So does max() with a float',      code: "from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    r = max(Decimal('0.3'), 0.1)\nr", returns: "decimal.FloatOperation: [<class 'decimal.FloatOperation'>]" },
    { title: 'create_decimal vs create_decimal_from_float', code: "from decimal import Context, FloatOperation\nctx = Context(traps=[FloatOperation])\nctx.create_decimal_from_float(0.25)", returns: "Decimal('0.25')" },
    { title: 'A TypeError and an ArithmeticError', code: 'from decimal import FloatOperation\n(issubclass(FloatOperation, TypeError), issubclass(FloatOperation, ArithmeticError))', returns: '(True, True)' },
  ],

  pitfalls: [
    {
      name: 'Catching FloatOperation for float arithmetic',
      desc: 'Decimal + float is not a FloatOperation: it is always a plain TypeError, trap or no trap. Convert the float first.',
      wrong: { label: 'except FloatOperation', code: "from decimal import Decimal, FloatOperation\ntry:\n    r = Decimal('1.5') + 1.5\nexcept FloatOperation:\n    r = 'mixed'\nr", output: "TypeError: unsupported operand type(s) for +: 'decimal.Decimal' and 'float'" },
      fix:   { label: 'Decimal(str(x))',       code: "from decimal import Decimal\nDecimal('1.5') + Decimal(str(1.5))", output: "Decimal('3.0')" },
    },
    {
      name: 'Expecting the trap to guard ==',
      desc: 'Equality with a float stays silent under the trap — and is exact, so it is False for 0.1. Compare Decimals with Decimals.',
      wrong: { label: '== 0.1',              code: "from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    r = Decimal('0.1') == 0.1\nr", output: 'False' },
      fix:   { label: '== Decimal(str(0.1))', code: "from decimal import Decimal, FloatOperation, localcontext\nwith localcontext() as ctx:\n    ctx.traps[FloatOperation] = True\n    r = Decimal('0.1') == Decimal(str(0.1))\nr", output: 'True' },
    },
  ],

  when: {
    use: [
      'Trapping it (inside localcontext) in money code, so a float that sneaks in fails at once',
      'Clearing and reading the flag to audit whether a calculation ever mixed in floats',
    ],
    avoid: [
      'Relying on it for arithmetic — Decimal + float already raises TypeError',
      'Expecting it to catch == comparisons — they are always allowed',
      'Trapping it on getcontext() for the whole program unless every library you call is float-free',
    ],
  },

  notes: {
    cpython:      'FloatOperation(DecimalException, TypeError), added in Python 3.3. Not trapped in DefaultContext, BasicContext or ExtendedContext',
    'Flag only':  'Untrapped, Decimal(float), create_decimal(float) and every comparison with a float — == and != included — set the flag; from_float() and create_decimal_from_float() do not',
    'Trapped':    'Decimal(float), create_decimal(float) and <, <=, >, >= raise; == and !=, from_float() and create_decimal_from_float() still work',
    'Hashing':    "Equal Decimals and floats hash alike, so {Decimal('0.5'): 'x'}.get(0.5) finds the entry — even with the trap on",
  },

  related: [
    { name: 'Decimal()',         slug: 'decimal',          when: 'Decimal(float) is exact' },
    { name: 'compare()',         slug: 'compare-max-min',  when: 'Exact comparisons with floats' },
    { name: 'DecimalException',  slug: 'decimalexception', when: 'Signals, flags and traps' },
    { name: 'localcontext()',    slug: 'localcontext',     when: 'Trap it for one block' },
    { name: 'float()',           slug: 'float',            when: 'Binary floats', category: 'functions' },
    { name: 'TypeError',         slug: 'typeerror',        when: 'Its other parent class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I stop floats from being mixed with Decimals in Python?',
      a: 'Trap FloatOperation: with localcontext() as ctx: ctx.traps[FloatOperation] = True. Inside, Decimal(0.1) and Decimal < float raise decimal.FloatOperation. Arithmetic like Decimal + float is a TypeError anyway.',
    },
    {
      q: 'Why does Decimal(0.1) not raise an error?',
      a: "Converting a float is allowed by default and exact: you get the float's real value, 0.1000000000000000055511151231257827021181583404541015625. Only the FloatOperation flag is set. Use Decimal('0.1') to get one tenth.",
    },
    {
      q: 'Can I compare a Decimal with a float?',
      a: 'Yes, and the comparison is exact. With FloatOperation trapped, == and != still work but <, <=, > and >= raise — and so do sorted(), max() and min() on mixed lists.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.FloatOperation',
    meta:  'decimal.FloatOperation',
  },
};
