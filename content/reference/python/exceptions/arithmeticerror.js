// content/reference/python/exceptions/arithmeticerror.js

export const meta = {
  slug:        'arithmeticerror',
  name:        'ArithmeticError',
  signature:   'ArithmeticError(*args)',
  blurb:       'Base class of ZeroDivisionError, OverflowError and FloatingPointError — catch it to handle any numeric failure at once.',
  category:    'base',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'arithmeticerror arithmetic error math error numeric division by zero overflow floating point base class catch zerodivisionerror overflowerror floatingpointerror decimal',
};

export const method = {
  slug:      'arithmeticerror',
  name:      'ArithmeticError',
  signature: 'ArithmeticError(*args)',

  category:    'Base class',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'You never see it raised directly — it is the one except clause that covers division by zero and numeric overflow together.',

  chain: ['BaseException', 'Exception', 'ArithmeticError'],

  cheat: {
    raisedBy: 'never directly — via ZeroDivisionError, OverflowError, FloatingPointError',
    message:  "the subclass's: 'division by zero', 'int too large to convert to float'",
    quickFix: 'except ArithmeticError: to cover both zero and overflow',
    watchOut: "math.sqrt(-1) is ValueError ('math domain error'), not ArithmeticError",
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Normally one message string, stored in e.args. Raise a subclass instead of ArithmeticError itself.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Integer divmod: floor quotient and remainder. A zero divisor raises ZeroDivisionError — an ArithmeticError.',
      params: [
        { name: 'a', type: 'str', hint: 'dividend', input: 'text' },
        { name: 'b', type: 'str', hint: 'divisor',  input: 'text' },
      ],
      template: 'divmod(int({$a}), int({$b}))',
      cases: [
        { id: 'ok',   label: '17, 5',  values: { a: '17', b: '5' } },
        { id: 'neg',  label: '-7, 2',  values: { a: '-7', b: '2' } },
        { id: 'zero', label: 'b = 0',  values: { a: '17', b: '0' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'One except ArithmeticError covers two different failures: a zero divisor and an int too big for a float.',
      params: [
        { name: 'a', type: 'str', hint: 'numerator (any length)', input: 'text' },
        { name: 'b', type: 'str', hint: 'denominator', input: 'text' },
      ],
      template: "def ratio(a, b):\n    try:\n        return float(a) / b\n    except ArithmeticError as e:\n        return f'{type(e).__name__}: {e}'\nratio(int({$a}), int({$b}))",
      cases: [
        { id: 'ok',   label: '22 / 7',     values: { a: '22', b: '7' } },
        { id: 'zero', label: 'divide by 0', values: { a: '22', b: '0' } },
        { id: 'big',  label: '400 digits', values: { a: '1' + '0'.repeat(400), b: '3' } },
      ],
    },
  ],
  demoExplainer: "The same handler returns ZeroDivisionError for a zero denominator and OverflowError for a 400-digit numerator — float() cannot hold a number that large. Python ints themselves never overflow: divmod in Trigger works on any length. Type a letter to see that int()'s ValueError is not an ArithmeticError and escapes.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: "The subclass's message, e.g. ('division by zero',)." },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised.' },
    { name: '__cause__',   type: 'BaseException | None', meaning: 'Set by raise ... from ...' },
  ],

  patterns: [
    {
      name: 'Guard a whole calculation',
      desc: 'Report any numeric failure in a formula without listing every subclass.',
      code: "try:\n    growth = (new - old) / old * 100\nexcept ArithmeticError:\n    growth = None",
    },
    {
      name: 'Numeric and domain errors together',
      desc: "The math module uses ValueError for out-of-domain input, so a robust numeric guard catches both.",
      code: "try:\n    y = math.log(x) / math.sqrt(z)\nexcept (ArithmeticError, ValueError) as e:\n    y = float('nan')",
    },
  ],

  examples: [
    { title: 'The three subclasses', code: "[issubclass(c, ArithmeticError) for c in (ZeroDivisionError, OverflowError, FloatingPointError)]", returns: '[True, True, True]' },
    { title: 'Catch a division by zero', code: "try:\n    1 / 0\nexcept ArithmeticError as e:\n    r = f'{type(e).__name__}: {e}'\nr", returns: "'ZeroDivisionError: division by zero'" },
    { title: 'Int too large for a float', code: 'float(10 ** 400)', returns: 'OverflowError: int too large to convert to float' },
    { title: 'math functions overflow too', code: 'import math\nmath.exp(1000)', returns: 'OverflowError: math range error' },
    { title: 'Ints never overflow', code: 'len(str(2 ** 10000))', returns: '3011' },
    { title: 'Float arithmetic overflows to inf silently', code: '1e308 * 10', returns: 'inf' },
    { title: 'decimal errors are ArithmeticErrors', code: 'import decimal\nissubclass(decimal.DivisionByZero, ArithmeticError)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Catching only ZeroDivisionError',
      desc: 'A ratio can also fail with OverflowError when the int is too big for a float. The base class covers both.',
      wrong: { label: 'except ZeroDivisionError', code: "try:\n    r = float(10 ** 400) / 3\nexcept ZeroDivisionError:\n    r = None\nr", output: 'OverflowError: int too large to convert to float' },
      fix:   { label: 'except ArithmeticError', code: "try:\n    r = float(10 ** 400) / 3\nexcept ArithmeticError:\n    r = 'not computable'\nr", output: "'not computable'" },
    },
    {
      name: 'math domain errors are ValueError',
      desc: 'Square root or log of a negative number raises ValueError, which ArithmeticError does not catch.',
      wrong: { label: 'except ArithmeticError', code: "import math\ntry:\n    r = math.sqrt(-1)\nexcept ArithmeticError:\n    r = 'bad input'\nr", output: 'ValueError: math domain error' },
      fix:   { label: 'catch both', code: "import math\ntry:\n    r = math.sqrt(-1)\nexcept (ArithmeticError, ValueError):\n    r = 'bad input'\nr", output: "'bad input'" },
    },
    {
      name: 'Waiting for OverflowError from float math',
      desc: 'Plain float operators do not raise on overflow — they return inf. Check the result instead.',
      wrong: { label: 'except OverflowError', code: "try:\n    x = 1e308 * 10\nexcept OverflowError:\n    x = 'overflow'\nx", output: 'inf' },
      fix:   { label: 'math.isfinite', code: "import math\nx = 1e308 * 10\nr = x if math.isfinite(x) else 'overflow'\nr", output: "'overflow'" },
    },
  ],

  when: {
    use: [
      'One handler for any numeric failure in a formula',
      'Base class for your own numeric errors (subclass ArithmeticError or ValueError)',
      'Catching decimal-module signals like DivisionByZero together with built-in errors',
    ],
    avoid: [
      'You only expect a zero divisor → except ZeroDivisionError says so',
      'Invalid math input like sqrt(-1) → that is ValueError',
      'Detecting float overflow from * or ** of floats → check math.isfinite(result)',
    ],
  },

  notes: {
    cpython:      'Objects/exceptions.c — ArithmeticError is a plain subclass of Exception with no extra behaviour',
    'Subclasses': 'ZeroDivisionError, OverflowError, FloatingPointError (not raised by CPython in practice)',
    decimal:      'decimal.DivisionByZero also subclasses ZeroDivisionError; the other decimal signals subclass ArithmeticError via DecimalException',
  },

  related: [
    { name: 'ZeroDivisionError',  slug: 'zerodivisionerror',  when: 'Division or modulo by zero' },
    { name: 'OverflowError',      slug: 'overflowerror',      when: 'Result too large for a float' },
    { name: 'FloatingPointError', slug: 'floatingpointerror', when: 'Exists but CPython does not raise it' },
    { name: 'ValueError',         slug: 'valueerror',         when: 'math domain errors: sqrt(-1), log(0)' },
    { name: 'divmod',             slug: 'divmod',             when: 'Floor quotient and remainder in one call', category: 'functions' },
    { name: '/',                  slug: 'truediv',            when: 'True division — raises ZeroDivisionError', category: 'operators' },
  ],

  faq: [
    {
      q: 'What is ArithmeticError in Python?',
      a: 'The base class for arithmetic failures: ZeroDivisionError, OverflowError and FloatingPointError. Python never raises plain ArithmeticError itself; you use it in except clauses to catch any of its subclasses with one handler.',
    },
    {
      q: 'What is the difference between ArithmeticError and ZeroDivisionError?',
      a: 'ZeroDivisionError is one specific ArithmeticError: dividing or taking a modulo by zero. except ArithmeticError also catches OverflowError, e.g. float(10 ** 400) or math.exp(1000).',
    },
    {
      q: 'Is ValueError an ArithmeticError?',
      a: "No. They are siblings under Exception. math.sqrt(-1) and math.log(0) raise ValueError: math domain error, so a numeric guard that should cover bad input needs except (ArithmeticError, ValueError).",
    },
    {
      q: 'Why does 1e308 * 10 not raise OverflowError?',
      a: 'Float operators follow IEEE 754 and return inf on overflow. OverflowError comes from conversions and functions that check their result: float() of a huge int, math.exp(), and ** on floats when the result is out of range.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ArithmeticError',
    meta:  'Built-in exceptions',
  },
};
