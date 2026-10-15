// content/reference/python/stdlib/decimal/logical-shift-rotate.js — digit-wise operations

export const meta = {
  slug:        'logical-shift-rotate',
  name:        'Decimal.logical_and',
  signature:   'Decimal.logical_and(other) · logical_or(other) · logical_xor(other) · logical_invert() · shift(n) · rotate(n)',
  blurb:       'Operations on the coefficient digits: AND/OR/XOR/NOT on numbers written only with 0s and 1s, and shifting or rotating the digits within the precision.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal logical_and logical_or logical_xor logical_invert shift rotate Decimal.logical_and Decimal.logical_or Decimal.logical_xor Decimal.logical_invert Decimal.shift Decimal.rotate Context.logical_and Context.logical_or Context.logical_xor Context.logical_invert Context.shift Context.rotate logical operand digit wise bitwise decimal shift digits rotate digits',
};

export const method = {
  slug:      'logical-shift-rotate',
  name:      'Decimal.logical_and',
  signature: 'Decimal.logical_and(other) · logical_or(other) · logical_xor(other) · logical_invert() · shift(n) · rotate(n)',
  returns:   { type: 'Decimal', desc: 'logical_*: a logical operand (digits 0 and 1, exponent 0); shift/rotate: the same sign and exponent with moved coefficient digits.' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'These come from the General Decimal Arithmetic specification and act on digits, not values. The logical operations accept only "logical operands" — non-negative, exponent 0, every digit 0 or 1 — and work on prec digits, so logical_invert() of 101 is 28 digits long by default. shift and rotate move digits within a window of prec digits.',

  covers: [
    'Decimal.logical_and', 'Decimal.logical_or', 'Decimal.logical_xor', 'Decimal.logical_invert', 'Decimal.shift', 'Decimal.rotate',
    'Context.logical_and', 'Context.logical_or', 'Context.logical_xor', 'Context.logical_invert', 'Context.shift', 'Context.rotate',
  ],

  cheat: {
    commonCall: 'Decimal(1100).logical_and(Decimal(1010))',
    returns:    "Decimal('1000')",
    replaces:   'nothing common — for bit operations on numbers use int & | ^ ~ << >>',
    watchOut:   'Decimal(5).logical_and(3) raises InvalidOperation: 5 is not made of 0s and 1s',
  },

  parameters: [
    { name: 'other',   type: 'Decimal | int', required: true,  default: null,   desc: 'logical_and/or/xor: the second logical operand.' },
    { name: 'n',       type: 'Decimal | int', required: true,  default: null,   desc: 'shift/rotate: an integer from -prec to prec (exponent 0). Positive moves digits left, negative moves them right.' },
    { name: 'context', type: 'Context',       required: false, default: 'None', desc: 'Supplies prec (the digit window) and receives the InvalidOperation signal for bad operands.' },
  ],

  modes: [
    {
      id: 'logical',
      label: 'and / or / xor / invert',
      blurb: 'Two logical operands (digits 0 and 1 only) under your precision.',
      params: [
        { name: 'a',    type: 'str', hint: "e.g. '1100'", input: 'text' },
        { name: 'b',    type: 'str', hint: "e.g. '1010'", input: 'text' },
        { name: 'prec', type: 'int', hint: 'digit window', input: 'number' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}):\n    a, b = Decimal({$a}), Decimal({$b})\n    result = (a.logical_and(b), a.logical_or(b), a.logical_xor(b), a.logical_invert())\nresult',
      cases: [
        { id: 'basic', label: '1100, 1010', values: { a: '1100', b: '1010', prec: '9' } },
        { id: 'short', label: '101, 11, prec 4', values: { a: '101', b: '11', prec: '4' } },
        { id: 'bad',   label: '102, 1',     values: { a: '102', b: '1', prec: '9' } },
      ],
    },
    {
      id: 'shift',
      label: 'shift / rotate',
      blurb: 'Move the coefficient digits n places within a window of prec digits.',
      params: [
        { name: 'x',    type: 'str', hint: 'a number',     input: 'text' },
        { name: 'n',    type: 'int', hint: '-prec to prec', input: 'number' },
        { name: 'prec', type: 'int', hint: 'digit window', input: 'number' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}):\n    x = Decimal({$x})\n    result = (x.shift({$n}), x.rotate({$n}))\nresult',
      cases: [
        { id: 'left',   label: '12345, 2, prec 9', values: { x: '12345', n: '2', prec: '9' } },
        { id: 'full',   label: '12345, 2, prec 5', values: { x: '12345', n: '2', prec: '5' } },
        { id: 'right',  label: '12345, -2, prec 9', values: { x: '12345', n: '-2', prec: '9' } },
        { id: 'frac',   label: '1.2345, 1',        values: { x: '1.2345', n: '1', prec: '9' } },
        { id: 'toofar', label: '12345, 10, prec 9', values: { x: '12345', n: '10', prec: '9' } },
      ],
    },
  ],
  demoExplainer: '1100 AND 1010 is 1000, OR is 1110, XOR is 110 (leading zeros are dropped), and invert flips all prec digits: at prec 9, 1100 becomes 111110011. Any digit other than 0 or 1 makes the operand invalid. shift moves digits and fills with zeros; rotate moves the digits that fall off back in at the other end: with a 5-digit window 12345 shifted left by 2 is 34500 and rotated is 34512. Both keep the exponent, so 1.2345 shifted by 1 is 12.3450. n must lie between -prec and prec.',

  patterns: [
    {
      name: 'Binary strings as logical operands',
      desc: "bin() gives the digits; convert back with int(…, 2).",
      code: "from decimal import Decimal\na = Decimal(bin(12)[2:])          # Decimal('1100')\nb = Decimal(bin(10)[2:])          # Decimal('1010')\nint(str(a.logical_xor(b)), 2)     # 6",
    },
    {
      name: 'A mask of n ones',
      desc: 'Invert zero under a precision of n digits.',
      code: 'from decimal import Context, Decimal\nmask = Context(prec=8).logical_invert(Decimal(0))   # 11111111',
    },
  ],

  examples: [
    { title: 'Digit-wise AND',            code: 'from decimal import Decimal\nDecimal(1100).logical_and(Decimal(1010))', returns: "Decimal('1000')" },
    { title: 'Invert uses all prec digits', code: 'from decimal import Decimal\nDecimal(101).logical_invert()', returns: "Decimal('1111111111111111111111111010')" },
    { title: '…so set prec for a shorter result', code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=4):\n    r = Decimal(101).logical_invert()\nr', returns: "Decimal('1010')" },
    { title: 'Context methods take ints', code: 'from decimal import Context\nctx = Context(prec=9)\n(ctx.logical_and(110, 11), ctx.logical_or(110, 11), ctx.logical_xor(110, 11), ctx.logical_invert(110), ctx.shift(110, -1))', returns: "(Decimal('10'), Decimal('111'), Decimal('101'), Decimal('111111001'), Decimal('11'))" },
    { title: 'Shift keeps the exponent',  code: "from decimal import Decimal\nDecimal('1.2345').shift(1)", returns: "Decimal('12.3450')" },
    { title: 'Rotate within 5 digits',    code: 'from decimal import Context\nContext(prec=5).rotate(12345, 2)', returns: "Decimal('34512')" },
    { title: 'Rotate right, 28-digit window', code: 'from decimal import Decimal\nDecimal(12345).rotate(-2)', returns: "Decimal('4500000000000000000000000123')" },
    { title: 'Not a logical operand',     code: 'from decimal import Decimal\nDecimal(5).logical_and(Decimal(3))', returns: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
  ],

  pitfalls: [
    {
      name: 'Expecting bitwise operations on numbers',
      desc: 'logical_and works on decimal digits that are 0 or 1, not on the binary form of the value. For bit operations use int.',
      wrong: { label: 'Decimal(5).logical_and(3)', code: 'from decimal import Decimal\nDecimal(5).logical_and(Decimal(3))', output: "decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]" },
      fix:   { label: '5 & 3', code: '5 & 3', output: '1' },
    },
    {
      name: 'Using shift() to multiply by 10',
      desc: 'shift() moves digits inside a prec-digit window, so a leading digit can fall off. scaleb() changes the exponent and keeps the value exact.',
      wrong: { label: 'shift(1)', code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=3):\n    r = Decimal(123).shift(1)\nr', output: "Decimal('230')" },
      fix:   { label: 'scaleb(1)', code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=3):\n    r = Decimal(123).scaleb(1)\nr', output: "Decimal('1.23E+3')" },
    },
  ],

  when: {
    use: [
      'Implementing or testing code against the General Decimal Arithmetic specification',
      'Digit manipulation of coefficients (shift, rotate) in decimal-format tooling',
    ],
    avoid: [
      'Bit manipulation of integers → int with & | ^ ~ << >>',
      'Multiplying or dividing by powers of ten → scaleb() or arithmetic',
      'Negative numbers or numbers with a decimal point as logical operands → InvalidOperation',
    ],
  },

  notes: {
    cpython:      "libmpdec's mpd_qand, mpd_qor, mpd_qxor, mpd_qinvert, mpd_qshift and mpd_qrotate; the C module accepts ints for every operand",
    'Logical operand': 'Sign 0, exponent 0, and every coefficient digit 0 or 1; operands shorter than prec are padded with zeros on the left, longer ones lose their leading digits',
    'Shift / rotate': 'The coefficient is treated as exactly prec digits (padded on the left); n must be an integer between -prec and prec; Infinity is returned unchanged; NaNs propagate',
  },

  related: [
    { name: 'normalize / scaleb', slug: 'normalize-adjusted', when: 'Change the exponent instead' },
    { name: 'Context', slug: 'context', when: 'prec sets the digit window' },
    { name: 'InvalidOperation', slug: 'invalidoperation', when: 'Bad logical operands' },
    { name: '& operator', slug: 'bitwise-and', when: 'Real bitwise AND on ints', category: 'operators' },
    { name: '<< operator', slug: 'lshift', when: 'Bit shifts on ints', category: 'operators' },
  ],

  faq: [
    {
      q: 'What is a logical operand in Python decimal?',
      a: "A Decimal whose sign and exponent are 0 and whose digits are all 0 or 1, such as Decimal('1011'). logical_and, logical_or, logical_xor and logical_invert accept only these; anything else signals InvalidOperation.",
    },
    {
      q: 'Why is logical_invert() of a small number so long?',
      a: 'It inverts every one of the prec digits (28 by default), so leading zeros become ones. Use localcontext(prec=n) to work with n-digit operands.',
    },
    {
      q: 'What is the difference between shift() and rotate()?',
      a: 'shift fills the vacated places with zeros and drops digits pushed out of the prec-digit window; rotate puts the pushed-out digits back in at the other end. Neither changes the exponent or the sign.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#logical-operands',
    meta:  'decimal — Logical operands',
  },
};
