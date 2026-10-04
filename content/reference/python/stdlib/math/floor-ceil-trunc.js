// content/reference/python/stdlib/math/floor-ceil-trunc.js — math.floor / ceil / trunc

export const meta = {
  slug:        'floor-ceil-trunc',
  name:        'math.floor / ceil / trunc',
  signature:   'math.floor(x) · math.ceil(x) · math.trunc(x)',
  blurb:       'Round a number down, up, or toward zero — and get an int back. Contrast with the built-in round(), which rounds half to even.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'math.floor math.ceil math.trunc floor ceil trunc round down round up python round toward zero floor vs round int() truncate ceiling division floor division negative numbers cannot convert float infinity to integer',
};

export const method = {
  slug:      'floor-ceil-trunc',
  name:      'math.floor / ceil / trunc',
  signature: 'math.floor(x, /) · math.ceil(x, /) · math.trunc(x, /)',
  returns:   { type: 'int', desc: 'An int (for floats, the exact integer value — no matter how large).' },

  category:    'math function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'floor goes down, ceil goes up, trunc goes toward zero — they only differ for negative numbers and fractions. All three return int; round() is the one that looks at the nearest integer.',

  covers: ['floor', 'ceil', 'trunc'],

  cheat: {
    commonCall: 'math.floor(x), math.ceil(x)',
    returns:    'int — floor(-2.5) is -3, ceil(-2.5) is -2, trunc(-2.5) is -2',
    replaces:   'int(x) when you need a defined direction for negatives',
    watchOut:   'inf raises OverflowError, nan raises ValueError',
  },

  parameters: [
    { name: 'x', type: 'int | float', required: true, default: null, desc: 'The number. Any object with __floor__ / __ceil__ / __trunc__ (Fraction, Decimal) uses its own method.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'compare',
      blurb: 'Five float-to-int conversions side by side: floor, ceil, trunc, int() and round().',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'import math\nx = {$x}\n(math.floor(x), math.ceil(x), math.trunc(x), int(x), round(x))',
      cases: [
        { id: 'half',  label: '2.5',  values: { x: '2.5' } },
        { id: 'nhalf', label: '-2.5', values: { x: '-2.5' } },
        { id: 'up',    label: '3.7',  values: { x: '3.7' } },
        { id: 'nup',   label: '-3.7', values: { x: '-3.7' } },
        { id: 'ohalf', label: '0.5',  values: { x: '0.5' } },
      ],
    },
    {
      id: 'division',
      label: 'division',
      blurb: 'Integer division: // floors, ceil(a / b) rounds the quotient up.',
      params: [
        { name: 'a', type: 'int', hint: 'dividend', input: 'number' },
        { name: 'b', type: 'int', hint: 'divisor',  input: 'number' },
      ],
      template: 'import math\na, b = {$a}, {$b}\n(a // b, math.floor(a / b), math.ceil(a / b))',
      cases: [
        { id: 'pos',  label: '7, 2',  values: { a: '7',  b: '2' } },
        { id: 'neg',  label: '-7, 2', values: { a: '-7', b: '2' } },
        { id: 'even', label: '12, 4', values: { a: '12', b: '4' } },
        { id: 'zero', label: '7, 0',  values: { a: '7',  b: '0' } },
      ],
    },
    {
      id: 'special',
      label: 'inf, nan, big',
      blurb: 'Parse a float and floor it. Infinity and nan have no integer value.',
      params: [{ name: 's', type: 'str', hint: "text for float(): '1e20', 'inf', 'nan'", input: 'text' }],
      template: 'import math\nmath.floor(float({$s}))',
      cases: [
        { id: 'big', label: "'1e20'", values: { s: '1e20' } },
        { id: 'inf', label: "'inf'",  values: { s: 'inf' } },
        { id: 'nan', label: "'nan'",  values: { s: 'nan' } },
      ],
    },
  ],
  demoExplainer: 'For 2.5 the results are (2, 3, 2, 2, 2): round() picks the even neighbour on a tie, so round(0.5) is 0 as well. For -2.5 they are (-3, -2, -2, -2, -2) — floor goes to the more negative number, trunc and int() toward zero. -7 // 2 is -4 because // floors; dividing by zero raises ZeroDivisionError from the // already. floor(inf) raises OverflowError: cannot convert float infinity to integer.',

  patterns: [
    {
      name: 'Ceiling division without floats',
      desc: 'Negate twice: exact for ints of any size.',
      code: 'pages = -(-items // per_page)',
    },
    {
      name: 'Number of pages',
      desc: 'ceil of a true division — fine while the numbers stay below 2**53.',
      code: 'import math\npages = math.ceil(total / per_page)',
    },
    {
      name: 'Snap down to a grid',
      desc: 'floor of x / step, times step.',
      code: 'import math\nsnapped = math.floor(x / step) * step',
    },
  ],

  examples: [
    { title: 'floor rounds down',        code: 'import math\nmath.floor(3.7)',  returns: '3' },
    { title: 'ceil rounds up',           code: 'import math\nmath.ceil(3.2)',   returns: '4' },
    { title: 'Negatives: floor goes away from zero', code: 'import math\n(math.floor(-3.7), math.trunc(-3.7))', returns: '(-4, -3)' },
    { title: 'The result is an int',     code: 'import math\ntype(math.floor(2.5))', returns: "<class 'int'>" },
    { title: 'Exact for huge floats',    code: 'import math\nmath.floor(1e20)', returns: '100000000000000000000' },
    { title: 'ints pass through',        code: 'import math\nmath.ceil(10 ** 30)', returns: '1000000000000000000000000000000' },
    { title: 'Infinity has no integer',  code: "import math\nmath.floor(float('inf'))", returns: 'OverflowError: cannot convert float infinity to integer' },
  ],

  pitfalls: [
    {
      name: 'Expecting round() to round half up',
      desc: 'round() uses round-half-to-even ("banker\'s rounding"). For "half up" on positive numbers use floor(x + 0.5), or decimal for exact control.',
      wrong: { label: 'round', code: '(round(0.5), round(1.5), round(2.5))', output: '(0, 2, 2)' },
      fix:   { label: 'floor(x + 0.5)', code: 'import math\n(math.floor(0.5 + 0.5), math.floor(1.5 + 0.5), math.floor(2.5 + 0.5))', output: '(1, 2, 3)' },
    },
    {
      name: 'int() for floor on negative numbers',
      desc: 'int() truncates toward zero, so it rounds negatives up.',
      wrong: { label: 'int', code: 'int(-3.7)', output: '-3' },
      fix:   { label: 'math.floor', code: 'import math\nmath.floor(-3.7)', output: '-4' },
    },
  ],

  when: {
    use: ['Converting a float to an int in a defined direction', 'Bucketing, paging and grid snapping'],
    avoid: ['Rounding to n decimal places → round(x, n) or decimal', 'Integer-only ceiling division → -(-a // b)'],
  },

  notes: {
    cpython:   'math_floor / math_ceil call C floor() / ceil() and convert with PyLong_FromDouble, which is exact; other types dispatch to __floor__ / __ceil__, trunc to __trunc__',
    'Errors':  'OverflowError: cannot convert float infinity to integer · ValueError: cannot convert float NaN to integer',
    'Platform': 'Exact on every platform — no libm rounding involved',
  },

  related: [
    { name: 'round()', slug: 'round', when: 'Nearest integer, ties to even', category: 'functions' },
    { name: 'int()', slug: 'int', when: 'Truncates toward zero', category: 'functions' },
    { name: '// operator', slug: 'floordiv', when: 'Floor division of ints and floats', category: 'operators' },
    { name: 'modf / frexp / ldexp', slug: 'modf-frexp-ldexp', when: 'Split a float into parts' },
    { name: 'math module', slug: 'math', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between math.floor and round in Python?',
      a: 'floor always goes down (floor(2.7) is 2); round goes to the nearest integer and breaks ties to the even one (round(2.5) is 2, round(3.5) is 4). Both return int when called with one argument.',
    },
    {
      q: 'What is the difference between math.trunc and int()?',
      a: 'For floats they give the same result: both cut toward zero. trunc also works on any object that defines __trunc__ and states the intent clearly.',
    },
    {
      q: 'How do I round up in Python?',
      a: 'math.ceil(x). For integers, -(-a // b) is ceiling division without converting to float.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/math.html#math.floor',
    meta:  'math.floor, math.ceil, math.trunc',
  },
};
