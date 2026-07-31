// content/reference/python/functions/round.js

export const meta = {
  slug:        'round',
  name:        'round',
  signature:   'round(number, ndigits=None)',
  blurb:       'Round a number to a given precision — halves go to the even neighbor.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'round rounding decimal precision banker half even',
};

export const method = {
  slug:      'round',
  name:      'round',
  signature: 'round(number, ndigits=None)',
  returns:   { type: 'int | float', desc: 'ndigits omitted or None → int. ndigits given (even 0) → same type as the input number.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Round to a precision — with banker’s rounding: exact halves go to the EVEN neighbor.',

  cheat: {
    commonCall: 'round(2.675, 2)',
    returns:    'int without ndigits, float with',
    replaces:   'round(2.5) is 2 and round(3.5) is 4 — half to even',
    watchOut:   'float representation: round(2.675, 2) gives 2.67, not 2.68',
  },

  parameters: [
    { name: 'number',  type: 'int | float', required: true,  default: null,   desc: 'The number to round.' },
    { name: 'ndigits', type: 'int | None',  required: false, default: 'None', desc: 'Decimal places. Negative rounds left of the point: round(1234, -2) → 1200. None returns an int.' },
  ],

  demoParams: [
    { name: 'number',  type: 'float', hint: 'the number',        input: 'float' },
    { name: 'ndigits', type: 'int',   hint: 'empty = None (int)', input: 'number-or-none' },
  ],
  cases: [
    { id: 'default', label: 'default',      values: { number: 3.7,    ndigits: '' } },
    { id: 'half2',   label: 'round(2.5)',   values: { number: 2.5,    ndigits: '' } },
    { id: 'half3',   label: 'round(3.5)',   values: { number: 3.5,    ndigits: '' } },
    { id: 'digits',  label: 'ndigits=2',    values: { number: 3.14159, ndigits: 2 } },
    { id: 'float',   label: 'float trap',   values: { number: 2.675,  ndigits: 2 } },
    { id: 'negative', label: 'ndigits=-2',  values: { number: 1234,   ndigits: -2 } },
  ],
  demoExplainer: 'Compare the 2.5 and 3.5 cases: both are exact halves, and both go to the EVEN neighbor — that is banker’s rounding, not the schoolbook rule. The 2.675 case shows the float-representation trap: the stored value is slightly below 2.675, so it rounds down.',

  patterns: [
    {
      name: 'Display formatting — prefer f-strings',
      desc: 'For output, format instead of round: no type change, no surprises.',
      code: 'f"{price:.2f}"   # \'2.68\' — formats, value unchanged',
    },
    {
      name: 'Money — use Decimal',
      desc: 'Binary floats cannot represent most cents exactly; Decimal can.',
      code: 'from decimal import Decimal, ROUND_HALF_UP\nDecimal("2.675").quantize(Decimal("0.01"), ROUND_HALF_UP)',
    },
    {
      name: 'Round to tens / hundreds',
      desc: 'Negative ndigits rounds left of the decimal point.',
      code: 'round(1867, -2)  # 1900',
    },
  ],

  examples: [
    { title: 'Round to int',            code: 'round(3.7)',       returns: '4' },
    { title: 'Half goes to even (down)', code: 'round(2.5)',      returns: '2' },
    { title: 'Half goes to even (up)',   code: 'round(3.5)',      returns: '4' },
    { title: 'Two decimal places',       code: 'round(3.14159, 2)', returns: '3.14' },
    { title: 'Negative ndigits',         code: 'round(1234, -2)', returns: '1200' },
  ],

  pitfalls: [
    {
      name: 'Banker’s rounding surprises schoolbook expectations',
      desc: 'Exact halves round to the even neighbor to avoid statistical bias.',
      wrong: { label: 'Expected 3?', code: 'round(2.5)', output: '2' },
      fix:   { label: 'Half-up when required', code: 'import math\nmath.floor(2.5 + 0.5)', output: '3' },
    },
    {
      name: 'Float representation shifts results',
      desc: '2.675 is stored as 2.67499999… — the rounding is correct for the stored value.',
      wrong: { label: 'Expected 2.68?', code: 'round(2.675, 2)', output: '2.67' },
      fix:   { label: 'Exact decimals', code: 'from decimal import Decimal\nDecimal("2.675").quantize(Decimal("0.01"))', output: "Decimal('2.68')" },
    },
    {
      name: 'Return type depends on ndigits',
      desc: 'round(x) is an int; round(x, 0) is a float. Type-sensitive code must care.',
      wrong: { label: 'Different types', code: 'type(round(2.5)), type(round(2.5, 0))', output: "(<class 'int'>, <class 'float'>)" },
      fix:   { label: 'Pick explicitly', code: 'int(round(x, 0))  # when you need an int', output: 'int either way' },
    },
  ],

  when: {
    use: [
      'Numeric rounding where half-to-even is fine (it usually is)',
      'Snapping to tens/hundreds with negative ndigits',
    ],
    avoid: [
      'Display only → f-string formatting (:.2f)',
      'Money / exact decimals → decimal.Decimal',
      'Always-up / always-down → math.ceil / math.floor',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'int (no ndigits) or the input type (with ndigits)',
    cpython:    'Python/bltinmodule.c → float.__round__ (correctly-rounded double)',
    memory:     'No allocation beyond the result',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: 'abs',    slug: 'abs',    when: 'Magnitude before rounding' },
    { name: 'max',    slug: 'max',    when: 'Compare rounded results' },
    { name: 'sorted', slug: 'sorted', when: 'Order numeric data' },
  ],

  faq: [
    {
      q: 'Why does Python round 2.5 down?',
      a: 'Round-half-to-even (banker’s rounding) removes the upward bias of always rounding halves up — summed over many roundings the error cancels. It is the IEEE 754 default.',
    },
    {
      q: 'How do I get classic round-half-up?',
      a: 'Use Decimal with ROUND_HALF_UP, or floor(x + 0.5) for positive numbers.',
      code: 'from decimal import Decimal, ROUND_HALF_UP\nDecimal(str(x)).quantize(Decimal("1"), ROUND_HALF_UP)',
    },
    {
      q: 'Why does round(2.675, 2) return 2.67?',
      a: 'The literal 2.675 cannot be stored exactly in binary — the nearest double is 2.67499999…, and rounding THAT to two places is 2.67. Use Decimal("2.675") to keep the exact value.',
    },
  ],

  history: [
    { version: '3.0', note: 'Switched to round-half-to-even and returns int when ndigits is omitted (Python 2 rounded halves away from zero and returned float).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#round',
    meta:  'round',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
