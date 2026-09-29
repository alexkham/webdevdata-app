// content/reference/python/exceptions/overflowerror.js

export const meta = {
  slug:        'overflowerror',
  name:        'OverflowError',
  signature:   'OverflowError(*args)',
  blurb:       'Raised when a float result is too large to represent, or an int is outside a range some C-level API requires.',
  category:    'arithmetic',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'overflowerror overflow error math range error int too large to convert to float result too large cannot convert float infinity to integer integer division result too large exp pow',
};

export const method = {
  slug:      'overflowerror',
  name:      'OverflowError',
  signature: 'OverflowError(*args)',

  category:    'Arithmetic exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Python ints never overflow — floats do. You get OverflowError when a float result passes about 1.8e308, when a huge int is converted to float, or when an int does not fit a C-sized slot.',

  chain: ['BaseException', 'Exception', 'ArithmeticError', 'OverflowError'],

  cheat: {
    raisedBy: 'math.exp(1000), float(10**400), 10**400 / 3, int(inf)',
    message:  'math range error · int too large to convert to float',
    quickFix: 'stay in int (//), use Decimal, or work in log space',
    watchOut: '1e308 * 10 gives inf silently — only some ops check',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string; float ** can produce a two-item (errno, text) args tuple.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'math.pow(2, n) converts to float. The largest float is just under 2 ** 1024.',
      params: [{ name: 'n', type: 'int', hint: 'exponent', input: 'number' }],
      template: "import math\nmath.pow(2, {$n})",
      cases: [
        { id: 'small', label: 'n = 10',    values: { n: '10' } },
        { id: 'max',   label: 'n = 1023',  values: { n: '1023' } },
        { id: 'over',  label: 'n = 1024',  values: { n: '1024' } },
        { id: 'under', label: 'n = -1075', values: { n: '-1075' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Raise it yourself when a value will not fit a fixed-size target — the same convention CPython uses for C-sized arguments.',
      params: [{ name: 'n', type: 'int', hint: 'value to store', input: 'number' }],
      template: "def to_int32(n):\n    if not -2**31 <= n < 2**31:\n        raise OverflowError(f'{n} does not fit in int32')\n    return n\n\nto_int32({$n})",
      cases: [
        { id: 'fits', label: 'fits',         values: { n: '2147483647' } },
        { id: 'over', label: '2**31',        values: { n: '2147483648' } },
        { id: 'neg',  label: 'min int32',    values: { n: '-2147483648' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, 1023 gives 8.98846567431158e+307 and 1024 overflows with math range error. Going the other way, -1075 does not raise at all — it quietly underflows to 0.0. That asymmetry is the rule: overflow is checked, underflow is not. The int 2 ** 1024 itself is fine; only the conversion to float fails.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: "Usually (message,). For float ** overflow CPython stores (errno, strerror), e.g. (34, 'Result too large') on Windows — the text is platform-dependent." },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised (implicit chaining).' },
  ],

  patterns: [
    {
      name: 'Keep big numbers as ints',
      desc: 'Int arithmetic is exact and unbounded; use // instead of / when the answer is an integer.',
      code: "blocks = total_bytes // block_size",
    },
    {
      name: 'Log space for huge products',
      desc: 'Add logarithms instead of multiplying big floats — standard for probabilities and likelihoods.',
      code: "import math\nlog_p = sum(math.log(p) for p in probs)",
    },
    {
      name: 'Saturate instead of crashing',
      desc: 'When infinity is an acceptable answer, catch the overflow and say so explicitly.',
      code: "import math\ntry:\n    growth = math.exp(rate * t)\nexcept OverflowError:\n    growth = math.inf",
    },
    {
      name: 'Decimal for big non-integers',
      desc: 'Decimal has a far larger exponent range than float.',
      code: "from decimal import Decimal\nDecimal(10) ** 400",
    },
  ],

  examples: [
    { title: 'math.exp past the limit',         code: "import math\nmath.exp(1000)",   returns: 'OverflowError: math range error' },
    { title: 'Huge int to float',               code: "float(10 ** 400)",               returns: 'OverflowError: int too large to convert to float' },
    { title: 'True division of huge ints',      code: "10 ** 400 / 3",                  returns: 'OverflowError: integer division result too large for a float' },
    { title: 'Floor division stays exact',      code: "10 ** 400 // 7 % 10",            returns: '8' },
    { title: 'Infinity to int',                 code: "int(float('inf'))",              returns: 'OverflowError: cannot convert float infinity to integer' },
    { title: 'Plain multiply does not check',   code: "1e308 * 10",                     returns: 'inf' },
    { title: 'Int outside a C-sized range',     code: "len(range(2 ** 64))",            returns: 'OverflowError: Python int too large to convert to C ssize_t' },
    { title: 'int.to_bytes too small',          code: "(256).to_bytes(1, 'big')",       returns: 'OverflowError: int too big to convert' },
  ],

  pitfalls: [
    {
      name: '/ on big ints converts to float',
      desc: 'True division always produces a float, so it fails whenever the quotient is beyond float range — even though both operands are exact ints. Use // (and %) to stay exact.',
      wrong: { label: '/',  code: "total = 10 ** 400\nhalf = total / 2\nhalf", output: 'OverflowError: integer division result too large for a float' },
      fix:   { label: '//', code: "total = 10 ** 400\nhalf = total // 2\nhalf == 5 * 10 ** 399", output: 'True' },
    },
    {
      name: 'Rounding an infinite float',
      desc: 'An unchecked overflow (1e300 * 1e10) produces inf, and the error only shows up later when you convert it to int.',
      wrong: { label: 'round(inf)', code: "round(1e300 * 1e10)", output: 'OverflowError: cannot convert float infinity to integer' },
      fix:   { label: 'Check first', code: "import math\nx = 1e300 * 1e10\nr = round(x) if math.isfinite(x) else None\nr is None", output: 'True' },
    },
    {
      name: 'math.sqrt of a huge int',
      desc: 'math functions convert their argument to float first. math.isqrt works on ints of any size.',
      wrong: { label: 'math.sqrt', code: "import math\nmath.sqrt(10 ** 400)",  output: 'OverflowError: int too large to convert to float' },
      fix:   { label: 'math.isqrt', code: "import math\nmath.isqrt(10 ** 400) == 10 ** 200", output: 'True' },
    },
  ],

  when: {
    use: [
      'Raising it when a value does not fit a fixed-size field (int32, a byte)',
      'Catching it around math.exp / math.pow on unbounded input',
      'Mapping overflow to math.inf when saturation is the right answer',
    ],
    avoid: [
      'Integer math → ints never overflow; use // and keep them ints',
      'Huge products of floats → log space',
      'Big non-integer values → decimal.Decimal',
    ],
  },

  notes: {
    'Ints are unbounded': 'The docs: overflow cannot occur for integers (they raise MemoryError instead); OverflowError on ints means a value is outside a range some API requires',
    'Not checked': 'Float +, -, * and float() of a string return inf silently (1e308 * 10, float("1e999")); math functions and ** check',
    'float ** text': "2.0 ** 10000 raises OverflowError with args (errno, strerror) from the C library, so its message differs by platform — Windows shows (34, 'Result too large')",
    'Catch via': 'except ArithmeticError also catches ZeroDivisionError',
  },

  related: [
    { name: 'ArithmeticError',   slug: 'arithmeticerror',   when: 'Base class for arithmetic failures' },
    { name: 'ZeroDivisionError', slug: 'zerodivisionerror', when: 'The other common arithmetic error' },
    { name: 'FloatingPointError', slug: 'floatingpointerror', when: 'Sibling reserved for FP traps' },
    { name: 'MemoryError',       slug: 'memoryerror',       when: 'What huge int arithmetic raises instead' },
    { name: 'pow',               slug: 'pow',               when: 'Exact int powers, or float with overflow check', category: 'functions' },
    { name: 'float',             slug: 'float',             when: 'Int → float conversion can overflow', category: 'functions' },
    { name: '//',                slug: 'floordiv',          when: 'Exact integer division', category: 'operators' },
  ],

  faq: [
    {
      q: 'What does OverflowError: math range error mean?',
      a: 'A math module function (exp, pow, ldexp, cosh …) produced a result larger than the largest float, about 1.8e308. math.exp overflows just above 709.78. Reduce the input, work with logarithms, catch it and use math.inf, or use decimal.Decimal for a larger range.',
    },
    {
      q: 'How do I fix "int too large to convert to float"?',
      a: 'Something converted a huge int to float: float(n), math.sqrt(n), or n * 1.0. Keep the calculation in ints (//, math.isqrt, integer comparisons), or use Decimal / Fraction if you need non-integer results.',
    },
    {
      q: 'Can Python integers overflow?',
      a: 'No. Python ints grow as needed until memory runs out (which is a MemoryError). OverflowError involving ints means an int had to fit something fixed-size: a float, a C ssize_t (len, indexes, repetition counts), a byte string of given length, or a C struct field.',
    },
    {
      q: 'Why does 1e308 * 10 return inf instead of raising?',
      a: 'The docs note that most floating-point operations are not checked, because C has no standard way to detect them. Plain +, - and * follow IEEE 754 and quietly return inf; math functions, ** and int/float conversions check and raise. Use math.isfinite() when an inf would be a bug.',
    },
    {
      q: 'Why is the message for 2.0 ** 10000 different on Linux and Windows?',
      a: 'Float power overflow stores (errno, strerror) as the exception args, and strerror is the C library text for ERANGE. Windows prints (34, \'Result too large\'); other platforms use their own wording. math.pow(2.0, 10000) always says math range error.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#OverflowError',
    meta:  'Built-in exceptions',
  },
};
