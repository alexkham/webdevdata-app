// content/reference/python/stdlib/decimal/index.js — the decimal module hub

export const meta = {
  slug:        'index',
  name:        'decimal',
  signature:   'from decimal import Decimal',
  blurb:       "Exact decimal arithmetic: Decimal('0.1') + Decimal('0.2') is exactly Decimal('0.3'), rounded the way you choose, to the precision you choose. The standard tool for money.",
  category:    'numbers',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'decimal module python decimal Decimal exact decimal arithmetic money currency 0.1 + 0.2 floating point error precision rounding quantize ROUND_HALF_UP localcontext getcontext context prec significant digits banker rounding InvalidOperation float to decimal',
};

export const method = {
  slug: 'index',
  name: 'decimal',

  category:    'Numbers & math',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'A Decimal is stored as decimal digits and an exponent, so 0.1 is exactly one tenth and 1.30 keeps its trailing zero. Precision and rounding come from a context — 28 significant digits and round-half-even unless you change it — and every problem (inexact result, overflow, division by zero) is a signal you can make fatal or silent.',

  imports: ['from decimal import Decimal', 'from decimal import Decimal, localcontext, ROUND_HALF_UP', 'import decimal'],
  facts: [
    { label: 'Main classes', value: 'Decimal (the numbers) and Context (precision, rounding, exponent limits, flags and traps)' },
    { label: 'Default context', value: 'prec=28, rounding=ROUND_HALF_EVEN, traps on InvalidOperation, DivisionByZero and Overflow' },
    { label: 'Exactness', value: 'Decimal(str) and Decimal(int) are exact; arithmetic rounds to the context precision' },
    { label: 'Implementation', value: 'The C module _decimal (libmpdec); Lib/_pydecimal.py is the pure-Python fallback' },
  ],

  coverClasses: ['Decimal', 'Context'],

  modes: [
    {
      id: 'sum',
      label: 'float vs Decimal',
      blurb: 'The same two numbers added as floats, and as Decimals made from their text.',
      params: [
        { name: 'x', type: 'float', hint: 'e.g. 0.1', input: 'float' },
        { name: 'y', type: 'float', hint: 'e.g. 0.2', input: 'float' },
      ],
      template: 'from decimal import Decimal\nx, y = {$x}, {$y}\n(x + y, Decimal(str(x)) + Decimal(str(y)))',
      cases: [
        { id: 'tenths', label: '0.1 + 0.2', values: { x: '0.1', y: '0.2' } },
        { id: 'money',  label: '1.1 + 2.2', values: { x: '1.1', y: '2.2' } },
        { id: 'half',   label: '0.5 + 0.25', values: { x: '0.5', y: '0.25' } },
        { id: 'big',    label: '1e16 + 1', values: { x: '1e16', y: '1' } },
      ],
    },
    {
      id: 'float',
      label: 'Decimal(float)',
      blurb: 'A float handed to Decimal is converted exactly — every binary digit of its value. Going through str() gives the short decimal you typed.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'from decimal import Decimal\n(Decimal({$x}), Decimal(str({$x})))',
      cases: [
        { id: 'tenth', label: '0.1',   values: { x: '0.1' } },
        { id: 'half',  label: '0.5',   values: { x: '0.5' } },
        { id: 'price', label: '2.675', values: { x: '2.675' } },
        { id: 'tiny',  label: '1e-07', values: { x: '1e-7' } },
      ],
    },
    {
      id: 'context',
      label: 'precision & rounding',
      blurb: 'Divide under a temporary context. prec counts significant digits; rounding is one of the ROUND_* names (in CPython the constants are just these strings).',
      params: [
        { name: 'a',        type: 'str', hint: 'dividend',          input: 'text' },
        { name: 'b',        type: 'str', hint: 'divisor',           input: 'text' },
        { name: 'prec',     type: 'int', hint: 'significant digits', input: 'number' },
        { name: 'rounding', type: 'str', hint: 'a ROUND_* name',     input: 'text' },
      ],
      template: 'from decimal import Decimal, localcontext\nwith localcontext(prec={$prec}, rounding={$rounding}):\n    result = Decimal({$a}) / Decimal({$b})\nresult',
      cases: [
        { id: 'third', label: '1/3, prec 5',        values: { a: '1', b: '3', prec: '5', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'down',  label: '2/3, ROUND_DOWN',    values: { a: '2', b: '3', prec: '5', rounding: 'ROUND_DOWN' } },
        { id: 'long',  label: '1/7, prec 40',       values: { a: '1', b: '7', prec: '40', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'zero',  label: '1/0',                values: { a: '1', b: '0', prec: '28', rounding: 'ROUND_HALF_EVEN' } },
        { id: 'bad',   label: "rounding='HALF_UP'", values: { a: '1', b: '3', prec: '5', rounding: 'HALF_UP' } },
      ],
    },
  ],
  demoExplainer: 'Binary floats cannot hold 0.1, 0.2 or 1.1 exactly, so their sums pick up a tiny error; the Decimals built from str() are exact, and 0.5 + 0.25 agrees in both because halves and quarters are exact in binary. 1e16 + 1.0 shows the other float limit — 53 bits of precision — the float sum stays 1e+16 while the Decimal sum keeps the 1. Decimal(0.1) shows what the float really stores: 0.1000000000000000055511151231257827021181583404541015625. In the division tab prec counts significant digits, not decimal places: 1/3 at prec 5 is 0.33333, 2/3 rounded down is 0.66666, and 1/0 raises decimal.DivisionByZero because that signal is trapped by default. A rounding name the module does not know is a TypeError that lists the valid ones.',

  patterns: [
    {
      name: 'Round money to cents',
      desc: 'quantize() fixes the number of decimal places; pass the rounding rule explicitly.',
      code: "from decimal import Decimal, ROUND_HALF_UP\ntotal = Decimal('19.99') * 3\ncents = total.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)",
    },
    {
      name: 'Build Decimals from text, never from floats',
      desc: 'Strings (and ints) convert exactly; a float brings its binary error with it.',
      code: "from decimal import Decimal\nprices = [Decimal(s) for s in ['9.99', '0.10', '120.00']]",
    },
    {
      name: 'Temporary precision for one calculation',
      desc: 'localcontext() changes the current context only inside the with block.',
      code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=50):\n    root2 = Decimal(2).sqrt()',
    },
    {
      name: 'Decimals in and out of JSON',
      desc: 'Parse JSON numbers as Decimal, and write Decimals back as strings.',
      code: "import json\nfrom decimal import Decimal\ndata = json.loads(text, parse_float=Decimal)\nout = json.dumps(data, default=str)",
    },
  ],

  examples: [
    { title: 'Exact where floats are not',  code: "from decimal import Decimal\nDecimal('0.1') + Decimal('0.2')", returns: "Decimal('0.3')" },
    { title: 'Trailing zeros are kept',     code: "from decimal import Decimal\nDecimal('1.30') + Decimal('1.20')", returns: "Decimal('2.50')" },
    { title: '28 significant digits by default', code: 'from decimal import Decimal\nDecimal(1) / Decimal(7)', returns: "Decimal('0.1428571428571428571428571429')" },
    { title: 'Round to cents, half up',     code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal('2.675').quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)", returns: "Decimal('2.68')" },
    { title: 'Summing money',               code: "from decimal import Decimal\nsum([Decimal('0.10')] * 3)", returns: "Decimal('0.30')" },
    { title: 'More digits for a while',     code: 'from decimal import Decimal, localcontext\nwith localcontext(prec=50):\n    root2 = Decimal(2).sqrt()\nroot2', returns: "Decimal('1.4142135623730950488016887242096980785696718753769')" },
    { title: 'Division by zero is an error', code: "from decimal import Decimal\nDecimal('1') / 0", returns: "decimal.DivisionByZero: [<class 'decimal.DivisionByZero'>]" },
  ],

  pitfalls: [
    {
      name: 'Making a Decimal from a float',
      desc: 'The float 2.675 is really 2.67499999…, and Decimal(float) keeps every one of those digits — so rounding half up still goes down.',
      wrong: { label: 'Decimal(2.675)', code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal(2.675).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)", output: "Decimal('2.67')" },
      fix:   { label: "Decimal('2.675')", code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal('2.675').quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)", output: "Decimal('2.68')" },
    },
    {
      name: 'Mixing Decimal and float in arithmetic',
      desc: 'Decimal refuses to add a float rather than guess. Convert the float explicitly (through str() if you want its short form).',
      wrong: { label: '+ 1.5', code: "from decimal import Decimal\nDecimal('1.5') + 1.5", output: "TypeError: unsupported operand type(s) for +: 'decimal.Decimal' and 'float'" },
      fix:   { label: '+ Decimal(str(1.5))', code: "from decimal import Decimal\nDecimal('1.5') + Decimal(str(1.5))", output: "Decimal('3.0')" },
    },
    {
      name: 'Reading prec as decimal places',
      desc: 'prec is the number of significant digits of every result. To fix the places after the point, use quantize().',
      wrong: { label: 'prec=2', code: "from decimal import Decimal, localcontext\nwith localcontext(prec=2):\n    r = Decimal('123.456') + 0\nr", output: "Decimal('1.2E+2')" },
      fix:   { label: 'quantize', code: "from decimal import Decimal\nDecimal('123.456').quantize(Decimal('0.01'))", output: "Decimal('123.46')" },
    },
  ],

  when: {
    use: [
      'Money and anything else that must add up exactly in base 10 (prices, tax, invoices, ledgers)',
      'Results that must match a written rule: "round half up to 2 places"',
      'More (or fewer) significant digits than a float gives — prec can be set per calculation',
    ],
    avoid: [
      'Scientific and numeric work where speed matters → float (and math, statistics)',
      'Exact ratios such as 1/3 → fractions.Fraction',
      'Whole numbers → int is already exact and unlimited',
    ],
  },

  notes: {
    cpython:      'decimal.py imports everything from the C module _decimal, built on libmpdec; if that is missing it falls back to the pure-Python Lib/_pydecimal.py. Results agree; error messages differ (the C module raises with a list of conditions)',
    'Context':    'Every thread has its own current context; getcontext() returns it, localcontext() swaps in a temporary copy. It is kept in a context variable, so setcontext() or localcontext() inside an asyncio task does not leak out — but a task shares the Context object it inherited, so getcontext().prec = … inside a task changes it for the caller too',
    'Spec':       'Implements the General Decimal Arithmetic Specification: signed zeros, infinities, quiet and signaling NaNs, subnormals, eight rounding modes',
  },

  related: [
    { name: 'fractions module', slug: 'fractions', when: 'Exact rationals like 1/3', category: 'stdlib' },
    { name: 'round()',          slug: 'round',     when: 'Rounds a Decimal half to even', category: 'functions' },
    { name: 'float()',          slug: 'float',     when: 'Binary floats — and float(Decimal)', category: 'functions' },
    { name: 'math module',      slug: 'math',      when: 'Float functions; floor/ceil work on Decimals', category: 'stdlib' },
    { name: 'json module',      slug: 'json',      when: 'parse_float=Decimal keeps JSON numbers exact', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is 0.1 + 0.2 not 0.3 in Python, and how does decimal fix it?',
      a: "Floats are binary fractions, and 0.1, 0.2 and 0.3 have no exact binary form, so 0.1 + 0.2 gives 0.30000000000000004. Decimal stores decimal digits: Decimal('0.1') + Decimal('0.2') is exactly Decimal('0.3'). Create the Decimals from strings, not from floats.",
    },
    {
      q: 'How do I round a Decimal to 2 decimal places?',
      a: "Use quantize: value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP). Without rounding= it uses the context's rounding, which is ROUND_HALF_EVEN (banker's rounding) by default. round(value, 2) also works but always uses the context rounding.",
    },
    {
      q: 'How do I set the precision of Decimal in Python?',
      a: 'For one calculation, use with localcontext(prec=50): … — the change ends with the block. getcontext().prec = 50 changes the current context for the rest of the thread. Precision counts significant digits; it does not limit the number of decimal places.',
    },
    {
      q: 'Is Decimal slower than float?',
      a: 'Yes. Floats use the hardware; Decimal is implemented in software (the C library libmpdec). It is fast enough for money and business logic, but use float for heavy numeric work.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html',
    meta:  'decimal — Decimal fixed-point and floating-point arithmetic',
  },

};
