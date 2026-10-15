// content/reference/python/stdlib/operator/arithmetic.js — add, sub, mul, truediv, floordiv, mod, pow, matmul, neg, pos, abs, index

export const meta = {
  slug:        'arithmetic',
  name:        'operator.add / sub / mul / truediv / floordiv / mod / pow …',
  signature:   'operator.add(a, b) · sub · mul · truediv · floordiv · mod · pow · matmul · neg(a) · pos · abs · index',
  blurb:       'The arithmetic operators as functions: add, sub, mul, truediv, floordiv, mod, pow and matmul for two operands, neg, pos, abs and index for one.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (matmul: 3.5+)',
  searchTerms: 'operator.add operator.sub operator.mul operator.truediv operator.floordiv operator.mod operator.pow operator.matmul operator.neg operator.pos operator.abs operator.index add sub mul truediv floordiv mod pow matmul neg pos abs index python add function multiply function floor division modulo negative numbers power function string formatting operator',
};

export const method = {
  slug:      'arithmetic',
  name:      'operator.add / sub / mul / truediv / floordiv / mod / pow …',
  signature: 'operator.add(a, b, /) · sub(a, b, /) · mul(a, b, /) · truediv(a, b, /) · floordiv(a, b, /) · mod(a, b, /) · pow(a, b, /) · matmul(a, b, /) · neg(a, /) · pos(a, /) · abs(a, /) · index(a, /)',
  returns:   { type: 'any', desc: 'Exactly what the operator returns: a + b, a / b, -a, a.__index__() …' },

  category:    'operator function',
  version:     'All Python 3 versions (matmul: 3.5+)',
  hasLiveDemo: true,

  subtitle: 'Each function is its operator, nothing more: operator.add(a, b) is a + b with the same type rules and the same errors. They exist so you can pass arithmetic to map, reduce, accumulate or a dispatch table.',

  covers: ['add', 'sub', 'mul', 'truediv', 'floordiv', 'mod', 'pow', 'matmul', 'neg', 'pos', 'abs', 'index'],

  cheat: {
    commonCall: 'reduce(operator.mul, nums, 1)',
    returns:    'Whatever the operator gives: int, float, str, list …',
    replaces:   'lambda a, b: a + b and friends',
    watchOut:   'floordiv and mod round toward minus infinity: -7 // 2 is -4',
  },

  parameters: [
    { name: 'a', type: 'any', required: true, default: null, desc: 'Left operand — or the only one for neg, pos, abs and index. Positional only.' },
    { name: 'b', type: 'any', required: true, default: null, desc: 'Right operand of the two-argument functions. Positional only.' },
  ],

  modes: [
    {
      id: 'byname',
      label: 'two operands',
      blurb: 'Look a function up by name and call it. 7 and 2.5 become int and float; anything else is a str.',
      params: [
        { name: 'name', type: 'str',               hint: 'add, truediv, mod …', input: 'text' },
        { name: 'a',    type: 'int | float | str', hint: 'left operand',        input: 'auto' },
        { name: 'b',    type: 'int | float | str', hint: 'right operand',       input: 'auto' },
      ],
      template: 'import operator\nf = getattr(operator, {$name})\nf({$a}, {$b})',
      cases: [
        { id: 'add',    label: 'add',          values: { name: 'add', a: '7', b: '2' } },
        { id: 'tdiv',   label: 'truediv',      values: { name: 'truediv', a: '7', b: '2' } },
        { id: 'pow',    label: 'pow 2, -1',    values: { name: 'pow', a: '2', b: '-1' } },
        { id: 'repeat', label: "mul 'ab', 3",  values: { name: 'mul', a: 'ab', b: '3' } },
        { id: 'fmt',    label: "mod '%d%%'",   values: { name: 'mod', a: '%d%%', b: '50' } },
        { id: 'mixed',  label: "add 'a', 1",   values: { name: 'add', a: 'a', b: '1' } },
        { id: 'matmul', label: 'matmul',       values: { name: 'matmul', a: '2', b: '3' } },
      ],
    },
    {
      id: 'unary',
      label: 'one operand',
      blurb: 'neg, pos, abs and index take one argument.',
      params: [
        { name: 'name', type: 'str',               hint: 'neg, pos, abs, index', input: 'text' },
        { name: 'x',    type: 'int | float | str', hint: 'operand',              input: 'auto' },
      ],
      template: 'import operator\nf = getattr(operator, {$name})\nf({$x})',
      cases: [
        { id: 'neg',   label: 'neg 5',      values: { name: 'neg', x: '5' } },
        { id: 'abs',   label: 'abs -2.5',   values: { name: 'abs', x: '-2.5' } },
        { id: 'index', label: 'index 7',    values: { name: 'index', x: '7' } },
        { id: 'float', label: 'index 2.5',  values: { name: 'index', x: '2.5' } },
        { id: 'str',   label: "neg 'a'",    values: { name: 'neg', x: 'a' } },
      ],
    },
    {
      id: 'division',
      label: '/ // %',
      blurb: 'True division, floor division and modulo of the same two numbers.',
      params: [
        { name: 'a', type: 'int | float', hint: 'dividend', input: 'auto' },
        { name: 'b', type: 'int | float', hint: 'divisor',  input: 'auto' },
      ],
      template: 'import operator\na, b = {$a}, {$b}\n(operator.truediv(a, b), operator.floordiv(a, b), operator.mod(a, b))',
      cases: [
        { id: 'pos',   label: '7, 2',    values: { a: '7', b: '2' } },
        { id: 'neg',   label: '-7, 2',   values: { a: '-7', b: '2' } },
        { id: 'negb',  label: '7, -2',   values: { a: '7', b: '-2' } },
        { id: 'float', label: '7.5, 2',  values: { a: '7.5', b: '2' } },
        { id: 'zero',  label: '1, 0',    values: { a: '1', b: '0' } },
      ],
    },
  ],
  demoExplainer: "floordiv and mod round toward minus infinity, so -7 // 2 is -4 and -7 % 2 is 1: the remainder takes the sign of the divisor, and a == (a // b) * b + a % b always holds. truediv of two ints always returns a float (7 / 2 is 3.5), and pow with a negative int exponent does too (2 ** -1 is 0.5). With a str on the left, mul repeats it and mod is printf-style formatting ('%d%%' % 50 is '50%'). A str and an int do not add: the TypeError comes from str's concatenation, which names both types. matmul (@) exists for libraries such as NumPy — no built-in type implements it. The browser reproduces CPython's results exactly, including correctly rounded int / int division; float ** float goes through the C library's pow(), and the rare result whose last digit differs between platforms is not shown.",

  patterns: [
    {
      name: 'Product or sum of a list',
      desc: 'sum() exists for addition; reduce with operator.mul covers products (math.prod does too, 3.8+).',
      code: 'from functools import reduce\nimport operator\nproduct = reduce(operator.mul, factors, 1)',
    },
    {
      name: 'Running totals',
      desc: 'accumulate takes any two-argument function.',
      code: 'from itertools import accumulate\nimport operator\nbalances = list(accumulate(deltas, operator.add))\nfactorials = list(accumulate(range(1, 8), operator.mul))',
    },
    {
      name: 'Element-wise arithmetic on two lists',
      desc: 'map with two iterables calls the function with one item from each.',
      code: 'import operator\ntotals = list(map(operator.add, prices, taxes))\nscaled = list(map(operator.mul, values, weights))',
    },
    {
      name: 'Calculator dispatch table',
      desc: 'Symbols to functions — no if/elif chain, and adding an operator is one line.',
      code: "import operator\nOPS = {'+': operator.add, '-': operator.sub, '*': operator.mul, '/': operator.truediv}\nresult = OPS[symbol](left, right)",
    },
  ],

  examples: [
    { title: 'The three divisions',           code: 'import operator\noperator.truediv(7, 2), operator.floordiv(7, 2), operator.mod(7, 2)', returns: '(3.5, 3, 1)' },
    { title: 'Floor rounds toward -infinity', code: 'import operator\noperator.floordiv(-7, 2), operator.mod(-7, 2)', returns: '(-4, 1)' },
    { title: 'pow: int, float, root',         code: 'import operator\noperator.pow(2, 10), operator.pow(2, -1), operator.pow(2.0, 0.5)', returns: '(1024, 0.5, 1.4142135623730951)' },
    { title: 'The unary three',               code: 'import operator\noperator.neg(5), operator.pos(-0.0), operator.abs(-2.5)', returns: '(-5, -0.0, 2.5)' },
    { title: 'index accepts ints and bools',  code: 'import operator\noperator.index(7), operator.index(True)', returns: '(7, 1)' },
    { title: 'Sequences add and repeat',      code: 'import operator\noperator.add([1, 2], [3]), operator.mul([0], 3)', returns: '([1, 2, 3], [0, 0, 0])' },
    { title: 'mod on a str is formatting',    code: "import operator\noperator.mod('%05.1f%%', 42.25)", returns: "'042.2%'" },
    { title: 'Flatten with reduce',           code: 'from functools import reduce\nimport operator\nreduce(operator.add, [[1], [2, 3], [4]], [])', returns: '[1, 2, 3, 4]' },
  ],

  pitfalls: [
    {
      name: 'Using index() to convert a float',
      desc: 'index accepts only true integers (int, bool, or objects with __index__) — it never truncates. Use int() or math.floor for floats.',
      wrong: { label: 'index(2.5)', code: 'import operator\noperator.index(2.5)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'int(2.5)',   code: 'int(2.5)', output: '2' },
    },
    {
      name: 'Expecting matmul to multiply plain numbers',
      desc: 'operator.matmul is the @ operator, which no built-in type implements. Plain numbers use mul.',
      wrong: { label: 'matmul(2, 3)', code: 'import operator\noperator.matmul(2, 3)', output: "TypeError: unsupported operand type(s) for @: 'int' and 'int'" },
      fix:   { label: 'mul(2, 3)',    code: 'import operator\noperator.mul(2, 3)', output: '6' },
    },
    {
      name: 'A negative base and a fractional power',
      desc: 'pow follows **: a negative float base with a non-integer exponent gives a complex number, not an error or a real root.',
      wrong: { label: 'pow(-8, 1/3)', code: 'import operator\noperator.pow(-8, 1/3)', output: '(1.0000000000000002+1.7320508075688772j)' },
      fix:   { label: 'real cube root', code: 'import math\n-math.cbrt(8)', output: '-2.0' },
    },
  ],

  when: {
    use: [
      'A function argument that is just arithmetic: reduce, accumulate, map, starmap',
      'Dispatch tables and expression evaluators that pick the operation at run time',
    ],
    avoid: [
      'Writing ordinary arithmetic — a + b reads better than operator.add(a, b)',
      'Products of a list → math.prod (3.8+) is clearer than reduce(operator.mul, …)',
    ],
  },

  notes: {
    cpython:    'Modules/_operator.c: each function calls the abstract API — PyNumber_Add, PyNumber_TrueDivide, PyNumber_Power … — the same code the + - * / ** operators run',
    'Dispatch': 'add(a, b) tries a.__add__(b), then b.__radd__(a), then sequence concatenation of a — so the error message comes from whichever step failed last',
    'Errors':   "ZeroDivisionError messages differ by type: 'division by zero' (int /), 'integer division or modulo by zero' (int //), 'integer modulo by zero' (int %), 'float division by zero' (float /)",
    'Floats':   'int / int is correctly rounded; float ** float calls the C library pow(), whose last digit can differ between platforms in rare cases',
  },

  related: [
    { name: '+ operator',   slug: 'add',      when: 'The operator itself',               category: 'operators' },
    { name: '// operator',  slug: 'floordiv', when: 'Floor division in depth',           category: 'operators' },
    { name: '% operator',   slug: 'mod',      when: 'Modulo and %-formatting',           category: 'operators' },
    { name: '** operator',  slug: 'pow',      when: 'Powers in depth',                   category: 'operators' },
    { name: 'pow()',        slug: 'pow',      when: 'Three-argument modular pow',        category: 'functions' },
    { name: 'functools.reduce', slug: 'reduce', when: 'Fold a list with operator.mul',   category: 'stdlib/functools' },
    { name: 'bitwise functions', slug: 'bitwise', when: 'and_, or_, xor, invert, shifts' },
    { name: 'in-place functions', slug: 'in-place', when: 'iadd, imul … for a += b' },
  ],

  faq: [
    {
      q: 'What is the difference between operator.truediv and operator.floordiv?',
      a: 'truediv is / and always returns a float for ints (7 / 2 is 3.5). floordiv is // and rounds down toward minus infinity (7 // 2 is 3, -7 // 2 is -4); for two ints it returns an int, with a float involved a float.',
    },
    {
      q: 'Why does operator.mod(-7, 2) return 1?',
      a: 'Python defines % so that a == (a // b) * b + a % b with // rounding toward minus infinity. -7 // 2 is -4, so the remainder is -7 - (-8) = 1: the result has the sign of the divisor. math.fmod(-7, 2) gives -1.0 (the C convention).',
    },
    {
      q: 'Is there operator.div in Python 3?',
      a: 'No. Python 3 has truediv (/) and floordiv (//); the old div, which depended on the operand types, was removed with classic division.',
    },
    {
      q: 'What does operator.index do?',
      a: 'It returns a converted to an int via __index__ — the protocol that slicing, bin() and hex() use. Since Python 3.10 the result is always an exact int (index(True) is 1). Floats are rejected rather than truncated.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.add',
    meta:  'operator — mathematical and bitwise operations',
  },
};
