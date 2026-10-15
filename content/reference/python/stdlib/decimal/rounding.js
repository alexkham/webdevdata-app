// content/reference/python/stdlib/decimal/rounding.js — the eight ROUND_* constants

export const meta = {
  slug:        'rounding',
  name:        'decimal.ROUND_HALF_EVEN',
  signature:   'decimal.ROUND_UP, ROUND_DOWN, ROUND_CEILING, ROUND_FLOOR, ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN, ROUND_05UP',
  blurb:       'The eight rounding modes for Context.rounding and quantize(): toward or away from zero, toward ±infinity, three ways to break ties, and ROUND_05UP.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal rounding modes ROUND_UP ROUND_DOWN ROUND_CEILING ROUND_FLOOR ROUND_HALF_UP ROUND_HALF_DOWN ROUND_HALF_EVEN ROUND_05UP banker rounding round half up round half to even round away from zero truncate decimal python rounding constant',
};

export const method = {
  slug:      'rounding',
  name:      'decimal.ROUND_HALF_EVEN',
  signature: 'decimal.ROUND_UP, ROUND_DOWN, ROUND_CEILING, ROUND_FLOOR, ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN, ROUND_05UP',
  returns:   { type: 'str', desc: "In CPython each constant is the string of its own name, e.g. ROUND_HALF_UP == 'ROUND_HALF_UP'." },

  category:    'decimal constants',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Every rounding in decimal — arithmetic results, quantize(), round(x, n), to_integral — follows one of these modes. The default is ROUND_HALF_EVEN (banker\'s rounding); money rules usually want ROUND_HALF_UP.',

  covers: ['ROUND_UP', 'ROUND_DOWN', 'ROUND_CEILING', 'ROUND_FLOOR', 'ROUND_HALF_UP', 'ROUND_HALF_DOWN', 'ROUND_HALF_EVEN', 'ROUND_05UP'],

  cheat: {
    commonCall: "x.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)",
    returns:    "Decimal('2.68') for x = Decimal('2.675')",
    replaces:   'hand-written "add 0.5 and truncate" tricks',
    watchOut:   'ROUND_DOWN truncates toward zero: -2.5 → -2, not -3',
  },

  parameters: [],

  modes: [
    {
      id: 'quantize',
      label: 'every mode',
      blurb: 'One value rounded to the step with each of the eight modes (listed in dir() order).',
      params: [
        { name: 'value', type: 'str', hint: 'a number',          input: 'text' },
        { name: 'step',  type: 'str', hint: "e.g. '0.01' or '1'", input: 'text' },
      ],
      template: "import decimal\nfrom decimal import Decimal\nx = Decimal({$value})\nmodes = [m for m in dir(decimal) if m.startswith('ROUND_')]\n{m: str(x.quantize(Decimal({$step}), rounding=getattr(decimal, m))) for m in modes}",
      cases: [
        { id: 'tie',  label: '2.5 → 1',      values: { value: '2.5', step: '1' } },
        { id: 'neg',  label: '-2.5 → 1',     values: { value: '-2.5', step: '1' } },
        { id: 'more', label: '-2.51 → 1',    values: { value: '-2.51', step: '1' } },
        { id: 'o5',   label: '1.051 → 0.01', values: { value: '1.051', step: '0.01' } },
        { id: 'zero', label: '1.001 → 0.01', values: { value: '1.001', step: '0.01' } },
      ],
    },
    {
      id: 'divide',
      label: 'in arithmetic',
      blurb: 'The context rounding also decides every arithmetic result: the same division under each mode.',
      params: [
        { name: 'a',    type: 'str', hint: 'dividend',           input: 'text' },
        { name: 'b',    type: 'str', hint: 'divisor',            input: 'text' },
        { name: 'prec', type: 'int', hint: 'significant digits', input: 'number' },
      ],
      template: "import decimal\nfrom decimal import Decimal, localcontext\nresults = {}\nfor m in [m for m in dir(decimal) if m.startswith('ROUND_')]:\n    with localcontext(prec={$prec}, rounding=getattr(decimal, m)):\n        results[m] = str(Decimal({$a}) / Decimal({$b}))\nresults",
      cases: [
        { id: 'two',   label: '2/3, prec 3',  values: { a: '2', b: '3', prec: '3' } },
        { id: 'neg',   label: '-2/3, prec 3', values: { a: '-2', b: '3', prec: '3' } },
        { id: 'tie',   label: '1/8, prec 2',  values: { a: '1', b: '8', prec: '2' } },
        { id: 'exact', label: '1/4, prec 2',  values: { a: '1', b: '4', prec: '2' } },
      ],
    },
  ],
  demoExplainer: 'Ties separate the HALF modes: 2.5 becomes 3 with HALF_UP, 2 with HALF_DOWN and HALF_EVEN (2 is even). For -2.5 the "up/down" modes are about distance from zero (UP gives -3, DOWN gives -2) while CEILING and FLOOR go toward +∞ and -∞ (-2 and -3). Once the discarded part is more than half (-2.51), all three HALF modes agree. ROUND_05UP rounds toward zero unless that would leave a last digit of 0 or 5: 1.051 → 1.06 and 1.001 → 1.01. In the division tab 1/8 = 0.125 is a tie at 2 digits, and 1/4 is exact, so every mode gives 0.25.',

  patterns: [
    {
      name: 'Money: half up to cents',
      desc: 'The rule most invoices and tax tables mean by "round".',
      code: "from decimal import Decimal, ROUND_HALF_UP\ncents = amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)",
    },
    {
      name: 'Truncate to whole units',
      desc: 'ROUND_DOWN drops the fraction toward zero; ROUND_FLOOR goes toward -∞.',
      code: "from decimal import Decimal, ROUND_DOWN\nwhole = value.quantize(Decimal('1'), rounding=ROUND_DOWN)",
    },
    {
      name: 'One rounding rule for a whole block',
      desc: 'Set the context rounding instead of passing rounding= everywhere.',
      code: 'from decimal import localcontext, ROUND_HALF_UP\nwith localcontext(rounding=ROUND_HALF_UP):\n    total = price * quantity * rate',
    },
  ],

  examples: [
    { title: "ROUND_HALF_EVEN: banker's rounding", code: "from decimal import Decimal, ROUND_HALF_EVEN\n[Decimal(x).quantize(Decimal('1'), rounding=ROUND_HALF_EVEN) for x in ('0.5', '1.5', '2.5')]", returns: "[Decimal('0'), Decimal('2'), Decimal('2')]" },
    { title: 'ROUND_HALF_UP: ties away from zero', code: "from decimal import Decimal, ROUND_HALF_UP\n[Decimal(x).quantize(Decimal('1'), rounding=ROUND_HALF_UP) for x in ('0.5', '1.5', '2.5')]", returns: "[Decimal('1'), Decimal('2'), Decimal('3')]" },
    { title: 'ROUND_HALF_DOWN: ties toward zero', code: "from decimal import Decimal, ROUND_HALF_DOWN\n[Decimal(x).quantize(Decimal('1'), rounding=ROUND_HALF_DOWN) for x in ('0.5', '1.5', '2.51')]", returns: "[Decimal('0'), Decimal('1'), Decimal('3')]" },
    { title: 'CEILING vs UP for a negative number', code: "from decimal import Decimal, ROUND_CEILING, ROUND_UP\nx = Decimal('-1.1')\n(x.quantize(Decimal('1'), rounding=ROUND_CEILING), x.quantize(Decimal('1'), rounding=ROUND_UP))", returns: "(Decimal('-1'), Decimal('-2'))" },
    { title: 'FLOOR vs DOWN for a negative number', code: "from decimal import Decimal, ROUND_FLOOR, ROUND_DOWN\nx = Decimal('-1.9')\n(x.quantize(Decimal('1'), rounding=ROUND_FLOOR), x.quantize(Decimal('1'), rounding=ROUND_DOWN))", returns: "(Decimal('-2'), Decimal('-1'))" },
    { title: 'ROUND_05UP',                 code: "from decimal import Decimal, ROUND_05UP\n[Decimal(x).quantize(Decimal('0.01'), rounding=ROUND_05UP) for x in ('1.051', '1.041', '1.001')]", returns: "[Decimal('1.06'), Decimal('1.04'), Decimal('1.01')]" },
    { title: 'The constants are strings', code: 'from decimal import ROUND_HALF_UP\nROUND_HALF_UP', returns: "'ROUND_HALF_UP'" },
  ],

  pitfalls: [
    {
      name: 'Expecting round() to follow the context rounding',
      desc: 'round(x) with no digits always rounds half to even and returns an int. round(x, n) — like quantize — uses the context rounding.',
      wrong: { label: 'round(x)', code: "from decimal import Decimal, localcontext, ROUND_HALF_UP\nwith localcontext(rounding=ROUND_HALF_UP):\n    r = round(Decimal('2.5'))\nr", output: '2' },
      fix:   { label: 'round(x, 0)', code: "from decimal import Decimal, localcontext, ROUND_HALF_UP\nwith localcontext(rounding=ROUND_HALF_UP):\n    r = round(Decimal('2.5'), 0)\nr", output: "Decimal('3')" },
    },
    {
      name: 'Using ROUND_DOWN as floor',
      desc: 'ROUND_DOWN means toward zero. For negative numbers the floor is ROUND_FLOOR.',
      wrong: { label: 'ROUND_DOWN', code: "from decimal import Decimal, ROUND_DOWN\nDecimal('-2.5').quantize(Decimal('1'), rounding=ROUND_DOWN)", output: "Decimal('-2')" },
      fix:   { label: 'ROUND_FLOOR', code: "from decimal import Decimal, ROUND_FLOOR\nDecimal('-2.5').quantize(Decimal('1'), rounding=ROUND_FLOOR)", output: "Decimal('-3')" },
    },
    {
      name: 'Typing the mode as a string',
      desc: 'A misspelled name is only caught at run time. Import the constant and a typo becomes an ImportError you see immediately.',
      wrong: { label: "'ROUND_HALFUP'", code: "from decimal import Decimal\nDecimal('2.5').quantize(Decimal('1'), rounding='ROUND_HALFUP')", output: 'TypeError: valid values for rounding are:\n  [ROUND_CEILING, ROUND_FLOOR, ROUND_UP, ROUND_DOWN,\n   ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN,\n   ROUND_05UP]' },
      fix:   { label: 'ROUND_HALF_UP', code: "from decimal import Decimal, ROUND_HALF_UP\nDecimal('2.5').quantize(Decimal('1'), rounding=ROUND_HALF_UP)", output: "Decimal('3')" },
    },
  ],

  when: {
    use: [
      'ROUND_HALF_UP for money and "school" rounding',
      'ROUND_HALF_EVEN (default) to avoid a systematic upward bias when summing many rounded values',
      'ROUND_DOWN / ROUND_FLOOR / ROUND_CEILING for truncation, floors and ceilings at any decimal place',
    ],
    avoid: [
      'ROUND_05UP unless a specification asks for it — it is meant for intermediate results that are rounded again later',
      'Rounding floats with these modes — convert to Decimal from text first',
      'Assuming round(x) honours the context — it does not',
    ],
  },

  notes: {
    cpython:      'The constants are module-level str objects; Context.rounding and the rounding= arguments accept exactly these eight values (any equal string works in CPython) and raise TypeError otherwise',
    'Definitions': 'UP: away from zero · DOWN: toward zero · CEILING: toward +∞ · FLOOR: toward -∞ · HALF_UP / HALF_DOWN / HALF_EVEN: to nearest, ties away from zero / toward zero / to the even digit · 05UP: toward zero, unless the last digit would be 0 or 5',
    'Not affected': 'exp(), ln(), log10() and sqrt() always round half even, whatever the context rounding',
  },

  related: [
    { name: 'quantize()',    slug: 'quantize',     when: 'Round to a number of places' },
    { name: 'to_integral_value()', slug: 'to_integral', when: 'Round to an integer' },
    { name: 'localcontext()', slug: 'localcontext', when: 'Set the rounding for a block' },
    { name: 'Context',       slug: 'context',      when: 'Context.rounding' },
    { name: 'round()',       slug: 'round',        when: 'How round() treats Decimals', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the default rounding mode of Python decimal?',
      a: "ROUND_HALF_EVEN, also called banker's rounding: ties go to the even digit, so 0.125 rounded to two places is 0.12 and 0.135 is 0.14. Set rounding=ROUND_HALF_UP in quantize() or the context for the usual commercial rule.",
    },
    {
      q: 'How do I round half up with decimal?',
      a: "value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP) for two places, or Decimal('1') for whole numbers. Build value from a string — a float such as 2.675 is already slightly below the tie.",
    },
    {
      q: 'What is the difference between ROUND_DOWN and ROUND_FLOOR?',
      a: 'They differ only for negative numbers: ROUND_DOWN goes toward zero (-1.9 → -1), ROUND_FLOOR toward minus infinity (-1.9 → -2). The same holds for ROUND_UP (away from zero) and ROUND_CEILING (toward plus infinity).',
    },
    {
      q: 'What is ROUND_05UP for?',
      a: 'It rounds toward zero unless the last kept digit would be 0 or 5, in which case it rounds away from zero: 1.051 → 1.06, 1.041 → 1.04. It is meant for intermediate results that will be rounded again; for presenting numbers it is rarely what you want.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#rounding-modes',
    meta:  'decimal — Rounding modes',
  },
};
