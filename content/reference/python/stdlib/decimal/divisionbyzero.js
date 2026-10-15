// content/reference/python/stdlib/decimal/divisionbyzero.js — DivisionByZero

export const meta = {
  slug:        'divisionbyzero',
  name:        'decimal.DivisionByZero',
  signature:   'decimal.DivisionByZero',
  blurb:       'Raised when a non-zero Decimal is divided by zero (/ and //) and by logb(0). A ZeroDivisionError subclass; untrapped, the result is a signed Infinity.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: "decimal DivisionByZero decimal division by zero decimal.DivisionByZero: [<class 'decimal.DivisionByZero'>] ZeroDivisionError decimal divide by zero Infinity -Infinity signed zero logb 0/0 decimal",
};

export const method = {
  slug:      'divisionbyzero',
  name:      'decimal.DivisionByZero',
  signature: 'decimal.DivisionByZero',

  category:    'decimal exception',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: "Decimal(1) / 0 raises decimal.DivisionByZero — trapped by default. It inherits from ZeroDivisionError, so existing except ZeroDivisionError handlers catch it. Not every zero divisor ends here: 0 / 0 and x % 0 have no sensible value and raise InvalidOperation instead.",

  covers: ['DivisionByZero'],

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'ZeroDivisionError', 'DecimalException', 'DivisionByZero'],

  cheat: {
    raisedBy: 'x / 0 and x // 0 for a finite non-zero x, Decimal(0).logb()',
    message:  "[<class 'decimal.DivisionByZero'>]",
    quickFix: 'Test the divisor first, or except ZeroDivisionError (DivisionByZero is a subclass)',
    watchOut: '0 / 0 and x % 0 raise InvalidOperation, which except ZeroDivisionError does not catch',
  },

  modes: [
    {
      id: 'trigger',
      label: 'divide',
      blurb: 'Divide with the default context: what each zero divisor raises.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal\nDecimal({$a}) / Decimal({$b})',
      cases: [
        { id: 'one',   label: '1 / 0',          values: { a: '1', b: '0' } },
        { id: 'neg',   label: '-2.5 / 0.000',   values: { a: '-2.5', b: '0.000' } },
        { id: 'undef', label: '0 / 0',          values: { a: '0', b: '0' } },
        { id: 'inf',   label: 'Infinity / 0',   values: { a: 'Infinity', b: '0' } },
        { id: 'ok',    label: '3 / 4',          values: { a: '3', b: '4' } },
      ],
    },
    {
      id: 'untrapped',
      label: 'trap off',
      blurb: 'Switch the trap off for one block: the division returns an infinity whose sign comes from both operands, and the flag is set.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal, DivisionByZero, localcontext\nwith localcontext() as ctx:\n    ctx.traps[DivisionByZero] = False\n    ctx.clear_flags()\n    r = Decimal({$a}) / Decimal({$b})\n(r, ctx.flags[DivisionByZero])',
      cases: [
        { id: 'pos',  label: '1 / 0',    values: { a: '1', b: '0' } },
        { id: 'neg',  label: '-1 / 0',   values: { a: '-1', b: '0' } },
        { id: 'negz', label: '1 / -0',   values: { a: '1', b: '-0' } },
        { id: 'both', label: '-1 / -0',  values: { a: '-1', b: '-0' } },
        { id: 'ok',   label: '6 / 3',    values: { a: '6', b: '3' } },
      ],
    },
    {
      id: 'except',
      label: 'except ZeroDivisionError',
      blurb: 'A handler for the built-in ZeroDivisionError catches DivisionByZero — but not 0 / 0.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'from decimal import Decimal\ntry:\n    r = Decimal({$a}) / Decimal({$b})\nexcept ZeroDivisionError as e:\n    r = type(e).__name__\nr',
      cases: [
        { id: 'zero',  label: '1 / 0', values: { a: '1', b: '0' } },
        { id: 'undef', label: '0 / 0', values: { a: '0', b: '0' } },
        { id: 'ok',    label: '7 / 2', values: { a: '7', b: '2' } },
      ],
    },
  ],
  demoExplainer: "Any finite non-zero number divided by zero raises DivisionByZero — 0.000 is a zero like any other. 0 / 0 raises InvalidOperation (condition DivisionUndefined) instead, and Infinity / 0 is simply Infinity with no signal at all. With the trap off, the result is Infinity or -Infinity: the sign is the exclusive or of the operand signs, so 1 / -0 is -Infinity and -1 / -0 is Infinity. The handler for ZeroDivisionError reports the class name DivisionByZero, while 0 / 0 escapes it because the C module raises InvalidOperation.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "([<class 'decimal.DivisionByZero'>],) — the list of trapped conditions." },
  ],

  patterns: [
    {
      name: 'Guard the divisor',
      desc: 'The clearest fix: decide what a zero divisor means before dividing.',
      code: "from decimal import Decimal\nrate = total / count if count else Decimal('0')",
    },
    {
      name: 'One handler for every zero divisor',
      desc: 'ArithmeticError covers DivisionByZero and the InvalidOperation of 0 / 0 (and x % 0).',
      code: 'try:\n    share = amount / parts\nexcept ArithmeticError:\n    share = None',
    },
    {
      name: 'Infinity instead of an exception',
      desc: 'Untrap the signal for one block and test the flag afterwards.',
      code: 'from decimal import DivisionByZero, localcontext\nwith localcontext() as ctx:\n    ctx.traps[DivisionByZero] = False\n    ratios = [a / b for a, b in pairs]',
    },
  ],

  examples: [
    { title: 'Dividing by zero',                 code: 'from decimal import Decimal\nDecimal(1) / 0', returns: "decimal.DivisionByZero: [<class 'decimal.DivisionByZero'>]" },
    { title: 'Integer division too',             code: 'from decimal import Decimal\nDecimal(7) // 0', returns: "decimal.DivisionByZero: [<class 'decimal.DivisionByZero'>]" },
    { title: 'It is a ZeroDivisionError',        code: 'from decimal import DivisionByZero\nissubclass(DivisionByZero, ZeroDivisionError)', returns: 'True' },
    { title: 'Untrapped: a signed infinity',     code: 'from decimal import Context, Decimal\nContext(traps=[]).divide(Decimal(-1), 0)', returns: "Decimal('-Infinity')" },
    { title: 'logb(0) divides by zero',          code: 'from decimal import Decimal\nDecimal(0).logb()', returns: "decimal.DivisionByZero: [<class 'decimal.DivisionByZero'>]" },
    { title: 'Remainder by zero is InvalidOperation', code: 'from decimal import Decimal\nDecimal(5) % 0', returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
    { title: 'divmod reports both',              code: 'from decimal import Decimal\ndivmod(Decimal(5), 0)', returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>, <class 'decimal.DivisionByZero'>]" },
    { title: 'Zero to a negative power is Infinity', code: 'from decimal import Decimal\nDecimal(0) ** -1', returns: "Decimal('Infinity')" },
  ],

  pitfalls: [
    {
      name: 'Expecting except ZeroDivisionError to cover 0 / 0',
      desc: '0 / 0 is an invalid operation, not a division by zero, and the class raised is InvalidOperation.',
      wrong: { label: 'except ZeroDivisionError', code: "from decimal import Decimal\ntry:\n    Decimal(0) / Decimal(0)\nexcept ZeroDivisionError:\n    r = 'no rate'\nr", output: "decimal.InvalidOperation: [<class 'decimal.DivisionUndefined'>]" },
      fix:   { label: 'add InvalidOperation',     code: "from decimal import Decimal, InvalidOperation\ntry:\n    Decimal(0) / Decimal(0)\nexcept (ZeroDivisionError, InvalidOperation):\n    r = 'no rate'\nr", output: "'no rate'" },
    },
    {
      name: 'Assuming % 0 is DivisionByZero',
      desc: 'With ints, 5 % 0 is a ZeroDivisionError. With Decimals it is InvalidOperation.',
      wrong: { label: 'except DivisionByZero', code: "from decimal import Decimal, DivisionByZero\ntry:\n    Decimal(5) % 0\nexcept DivisionByZero:\n    r = 'no remainder'\nr", output: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
      fix:   { label: 'catch both',            code: "from decimal import Decimal, DivisionByZero, InvalidOperation\ntry:\n    Decimal(5) % 0\nexcept (DivisionByZero, InvalidOperation):\n    r = 'no remainder'\nr", output: "'no remainder'" },
    },
  ],

  when: {
    use: [
      'except ZeroDivisionError (or DivisionByZero) around divisions whose divisor may be zero',
      'Untrapping it when Infinity is a meaningful answer, e.g. a ratio with an empty denominator',
    ],
    avoid: [
      'Relying on it for 0 / 0 or x % 0 — those are InvalidOperation',
      'Untrapping it globally with getcontext() — use localcontext() for the block that needs it',
    ],
  },

  notes: {
    cpython:      'DivisionByZero(DecimalException, ZeroDivisionError). The C module raises it with the list of trapped conditions; Lib/_pydecimal.py raises it with a short text such as x / 0',
    'Untrapped result': 'Infinity with the sign of the exclusive or of the operand signs (divide, divide_int); -Infinity for logb(0)',
    'No signal':  "Infinity / 0 is Infinity; Decimal(0) ** -1 is Infinity and Decimal('-0') ** -1 is -Infinity, without setting the flag; Decimal(0).ln() and log10() are -Infinity",
    'Not this signal': '0 / 0, 0 // 0, 0 % 0 → InvalidOperation (DivisionUndefined); x % 0 and remainder_near(0) → InvalidOperation; divmod(x, 0) → both InvalidOperation and DivisionByZero',
  },

  related: [
    { name: 'DecimalException',  slug: 'decimalexception', when: 'Signals, flags and traps' },
    { name: 'InvalidOperation',  slug: 'invalidoperation', when: 'What 0 / 0 and x % 0 raise' },
    { name: 'Arithmetic',        slug: 'arithmetic',       when: 'divide, divide_int, remainder' },
    { name: 'localcontext()',    slug: 'localcontext',     when: 'Untrap it for one block' },
    { name: 'ZeroDivisionError', slug: 'zerodivisionerror', when: 'The built-in parent class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I handle division by zero with Decimal in Python?',
      a: 'Either test the divisor before dividing, or catch the exception: decimal.DivisionByZero is a subclass of ZeroDivisionError. Remember that 0 / 0 raises decimal.InvalidOperation — catch ArithmeticError (or both classes) to cover it too.',
    },
    {
      q: 'Can a Decimal division by zero return Infinity instead of raising?',
      a: "Yes: turn the trap off for that calculation — with localcontext() as ctx: ctx.traps[DivisionByZero] = False — or use Context(traps=[]).divide(a, b). The result is Infinity or -Infinity and ctx.flags[DivisionByZero] becomes True.",
    },
    {
      q: 'Is decimal.DivisionByZero a ZeroDivisionError?',
      a: 'Yes. Its bases are DecimalException and ZeroDivisionError, so except ZeroDivisionError catches Decimal(1) / 0 — but not Decimal(0) / 0, which raises InvalidOperation.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.DivisionByZero',
    meta:  'decimal.DivisionByZero',
  },
};
