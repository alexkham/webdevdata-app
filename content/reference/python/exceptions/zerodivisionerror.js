// content/reference/python/exceptions/zerodivisionerror.js

export const meta = {
  slug:        'zerodivisionerror',
  name:        'ZeroDivisionError',
  signature:   'ZeroDivisionError(*args)',
  blurb:       'Raised when the right operand of /, //, % or divmod() is zero.',
  category:    'arithmetic',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'zerodivisionerror zero division error division by zero float division by zero integer division or modulo by zero integer modulo by zero divide by zero average empty list',
};

export const method = {
  slug:      'zerodivisionerror',
  name:      'ZeroDivisionError',
  signature: 'ZeroDivisionError(*args)',

  category:    'Arithmetic exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Dividing by zero raises instead of returning inf or NaN — for floats too. The message tells you which operator and which operand types were involved.',

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'ZeroDivisionError'],

  cheat: {
    raisedBy: 'x / 0, x // 0, x % 0, divmod(x, 0), 0 ** -1',
    message:  "division by zero · float division by zero · integer modulo by zero …",
    quickFix: 'check the divisor: a / b if b else 0.0',
    watchOut: 'float 0.0 raises too — no inf like JavaScript or NumPy',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. str(e) is that message.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Pick an operator: /, // or %. With b = 0 each one has its own message.',
      params: [
        { name: 'op', type: 'str', hint: '/  //  %', input: 'text' },
        { name: 'a',  type: 'int', hint: 'dividend', input: 'number' },
        { name: 'b',  type: 'int', hint: 'divisor',  input: 'number' },
      ],
      template: "import operator\nops = {'/': operator.truediv, '//': operator.floordiv, '%': operator.mod}\nops[{$op}]({$a}, {$b})",
      cases: [
        { id: 'div',   label: '7 / 0',    values: { op: '/',  a: '7', b: '0' } },
        { id: 'floor', label: '7 // 0',   values: { op: '//', a: '7', b: '0' } },
        { id: 'mod',   label: '7 % 0',    values: { op: '%',  a: '7', b: '0' } },
        { id: 'ok',    label: '-7 // 2',  values: { op: '//', a: '-7', b: '2' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'An average over zero items. total is a float, so any message would say float division — but here it is caught and replaced with 0.0.',
      params: [
        { name: 'total', type: 'float', hint: 'sum of values', input: 'float' },
        { name: 'count', type: 'int',   hint: 'number of values', input: 'number' },
      ],
      template: "total, count = {$total}, {$count}\ntry:\n    avg = total / count\nexcept ZeroDivisionError:\n    avg = 0.0\navg",
      cases: [
        { id: 'some', label: 'count 4', values: { total: '10', count: '4' } },
        { id: 'none', label: 'count 0', values: { total: '0', count: '0' } },
      ],
    },
  ],
  demoExplainer: "With ints, / says division by zero, // says integer division or modulo by zero and % says integer modulo by zero — three messages for one mistake. With a float operand they become float division by zero, float floor division by zero and float modulo by zero. The -7 // 2 case is a reminder that // floors toward negative infinity: -4, not -3.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: 'args[0] is the message string. There is no attribute holding the operands.' },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised (implicit chaining).' },
  ],

  patterns: [
    {
      name: 'Guard the divisor',
      desc: 'When zero is an expected input (empty list, no visits), decide the answer explicitly.',
      code: "rate = hits / total if total else 0.0",
    },
    {
      name: 'Average of a possibly empty list',
      desc: 'len(xs) is 0 for an empty list; return a sentinel or raise a clearer error.',
      code: "def mean(xs):\n    if not xs:\n        raise ValueError('mean of empty list')\n    return sum(xs) / len(xs)",
    },
    {
      name: 'Percent change',
      desc: 'A zero baseline has no meaningful percentage; None is more honest than 0.',
      code: "def pct_change(old, new):\n    return None if old == 0 else (new - old) / old * 100",
    },
  ],

  examples: [
    { title: 'Int true division',          code: "1 / 0",           returns: 'ZeroDivisionError: division by zero' },
    { title: 'Float operand',              code: "1.0 / 0",         returns: 'ZeroDivisionError: float division by zero' },
    { title: 'Floor division',             code: "1 // 0",          returns: 'ZeroDivisionError: integer division or modulo by zero' },
    { title: 'Modulo',                     code: "1 % 0",           returns: 'ZeroDivisionError: integer modulo by zero' },
    { title: 'divmod() on floats',         code: "divmod(1.0, 0)",  returns: 'ZeroDivisionError: float divmod()' },
    { title: 'Zero to a negative power',   code: "0 ** -1",         returns: 'ZeroDivisionError: 0.0 cannot be raised to a negative power' },
    { title: 'Mean of an empty list',      code: "def mean(xs):\n    return sum(xs) / len(xs)\nmean([])", returns: 'ZeroDivisionError: division by zero' },
    { title: 'Decimal raises a subclass',  code: "from decimal import Decimal\ntry:\n    Decimal(1) / 0\nexcept ZeroDivisionError as e:\n    r = type(e).__name__\nr", returns: "'DivisionByZero'" },
  ],

  pitfalls: [
    {
      name: 'Expecting inf like JavaScript or NumPy',
      desc: 'Plain Python floats raise on division by zero, even 1 / 0.0 and 1 / -0.0. Use math.inf explicitly if that is the answer you want.',
      wrong: { label: '1 / 0.0',        code: "1 / 0.0", output: 'ZeroDivisionError: float division by zero' },
      fix:   { label: 'Decide the result', code: "import math\nd = 0.0\nr = 1 / d if d else math.inf\nr", output: 'inf' },
    },
    {
      name: 'A wide try hides which division failed',
      desc: 'Catching ZeroDivisionError around a whole computation replaces every failure with the fallback — including bugs. Test the specific divisor.',
      wrong: { label: 'Blanket fallback', code: "def ratio(a, b, c):\n    try:\n        return a / b + b / c\n    except ZeroDivisionError:\n        return 0.0\nratio(1, 2, 0)", output: '0.0' },
      fix:   { label: 'Guard the divisor', code: "def ratio(a, b, c):\n    return a / b + (b / c if c else 0.0)\nratio(1, 2, 0)", output: '0.5' },
    },
    {
      name: 'Rounding error is not zero',
      desc: 'A float that should be 0 often is not, so the division succeeds with a huge result. Compare with a tolerance before dividing.',
      wrong: { label: 'Tiny but non-zero', code: "d = 0.1 + 0.2 - 0.3\n1 / d", output: '1.8014398509481984e+16' },
      fix:   { label: 'math.isclose', code: "import math\nd = 0.1 + 0.2 - 0.3\nr = None if math.isclose(d, 0, abs_tol=1e-9) else 1 / d\nr is None", output: 'True' },
    },
  ],

  when: {
    use: [
      'EAFP arithmetic where a zero divisor is truly exceptional',
      "Raising it from a custom numeric type's __truediv__ / __mod__",
      'Catching it at a boundary to report bad input',
    ],
    avoid: [
      'Zero is a normal input (empty list, no traffic) → guard with if',
      'You want inf/nan semantics → use math.inf explicitly or NumPy',
      'Decimal code → configure the context traps instead of catching',
    ],
  },

  notes: {
    'Messages': "int: division by zero (/), integer division or modulo by zero (//, divmod), integer modulo by zero (%). float: float division by zero, float floor division by zero, float modulo by zero, float divmod()",
    'Catch via': 'except ArithmeticError also catches OverflowError and FloatingPointError',
    'Decimal':   'decimal.DivisionByZero subclasses both decimal.DecimalException and ZeroDivisionError',
    'Not raised': 'math.fmod(x, 0) and math.log(0) raise ValueError: math domain error instead',
  },

  related: [
    { name: 'ArithmeticError', slug: 'arithmeticerror', when: 'Base class for arithmetic failures' },
    { name: 'OverflowError',   slug: 'overflowerror',   when: 'The result is too large for a float' },
    { name: 'FloatingPointError', slug: 'floatingpointerror', when: 'Reserved; NumPy raises it with seterr' },
    { name: '/',               slug: 'truediv',         when: 'True division', category: 'operators' },
    { name: '//',              slug: 'floordiv',        when: 'Floor division', category: 'operators' },
    { name: '%',               slug: 'mod',             when: 'Modulo', category: 'operators' },
    { name: 'divmod',          slug: 'divmod',          when: 'Quotient and remainder together', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I fix ZeroDivisionError: division by zero?',
      a: 'Find where the divisor became 0 — usually len() of an empty list, a counter that never incremented, or a value parsed from empty input. Then decide what the answer should be in that case: a guard like a / b if b else 0.0, returning None, or raising a clearer ValueError.',
    },
    {
      q: 'Why does 1 / 0.0 raise instead of returning inf?',
      a: 'Python chose to treat float division by zero as an error, unlike IEEE 754 defaults used by JavaScript, C and NumPy. Operations that overflow (1e308 * 10) still return inf silently. If you want inf, write the check and use math.inf.',
    },
    {
      q: 'What is the difference between the messages?',
      a: 'They name the operation and the operand kind: division by zero (int /), integer division or modulo by zero (int // and divmod), integer modulo by zero (int %), and float division by zero, float floor division by zero, float modulo by zero or float divmod() when a float is involved. 0 ** -1 has its own: 0.0 cannot be raised to a negative power.',
    },
    {
      q: 'How do I catch division by zero in Decimal or Fraction?',
      a: 'Both raise ZeroDivisionError subclasses or ZeroDivisionError itself: Decimal(1) / 0 raises decimal.DivisionByZero (a ZeroDivisionError subclass, when the context traps it, which is the default) and Fraction(1, 0) raises ZeroDivisionError: Fraction(1, 0). except ZeroDivisionError covers them all.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ZeroDivisionError',
    meta:  'Built-in exceptions',
  },
};
