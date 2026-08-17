// content/reference/python/operators/floordiv.js

export const meta = {
  slug:        'floordiv',
  name:        '//',
  signature:   'a // b',
  blurb:       'Floor division — rounds toward negative infinity, not zero.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'floor division integer divide double slash quotient operator',
};

export const method = {
  slug:      'floordiv',
  name:      '//',
  signature: 'a // b',
  returns:   { type: 'int | float', desc: 'The floored quotient: int for int operands, float for float ones. Floors toward negative infinity.' },

  category:    'Arithmetic operator',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'Whole-number division — with a floor, not a truncation: -7 // 2 is -4.',

  cheat: {
    commonCall: '7 // 2',
    returns:    'floored quotient (int for ints)',
    replaces:   'floors toward -∞: -7 // 2 == -4, not -3',
    watchOut:   'pairs with %: a == b * (a // b) + (a % b) always holds',
  },

  parameters: [
    { name: 'a', type: 'number', required: true, default: null, desc: 'Dividend.' },
    { name: 'b', type: 'number', required: true, default: null, desc: 'Divisor — zero raises.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'dividend', input: 'float' },
    { name: 'b', type: 'float', hint: 'divisor',  input: 'float' },
  ],
  demoTemplate: '{a} // {b}',
  cases: [
    { id: 'default',  label: 'default',       values: { a: 7, b: 2 } },
    { id: 'negative', label: 'negative',      values: { a: -7, b: 2 } },
    { id: 'zero',     label: 'by zero',       values: { a: 1, b: 0 } },
  ],
  demoExplainer: 'Compare 7 // 2 with -7 // 2: the floor goes DOWN in both cases (3 and -4). C, JS and Java truncate toward zero instead (-3) — this difference is the whole reason the page exists.',

  patterns: [
    {
      name: 'Index arithmetic',
      desc: 'Midpoints and bucket indexes must be ints.',
      code: 'mid = (lo + hi) // 2',
    },
    {
      name: 'Units breakdown',
      desc: '// and % together convert totals into unit parts.',
      code: 'hours = seconds // 3600\nminutes = (seconds % 3600) // 60',
    },
    {
      name: 'Both at once',
      desc: 'divmod returns quotient and remainder in one call.',
      code: 'q, r = divmod(seconds, 60)',
    },
  ],

  examples: [
    { title: 'Positive operands',    code: '7 // 2',    returns: '3' },
    { title: 'Floors toward -∞',     code: '-7 // 2',   returns: '-4' },
    { title: 'Floats stay float',    code: '7.0 // 2',  returns: '3.0' },
  ],

  pitfalls: [
    {
      name: 'Negative results floor DOWN',
      desc: 'Coming from C/JS, -7 // 2 == -4 is the surprise — truncation would give -3.',
      wrong: { label: 'C intuition', code: '-7 // 2   # expecting -3?', output: '-4' },
      fix:   { label: 'Truncation when wanted', code: 'import math\nmath.trunc(-7 / 2)', output: '-3' },
    },
    {
      name: 'Float operands give float results',
      desc: '// does not force int — it floors within the operand type.',
      wrong: { label: 'Still a float', code: 'items[10.0 // 3]', output: 'TypeError: list indices must be integers' },
      fix:   { label: 'Fix', code: 'items[int(10.0 // 3)]', output: 'works' },
    },
  ],

  when: {
    use: [
      'Integer quotients: paging, bucketing, midpoints',
      'Unit conversions with % as the counterpart',
    ],
    avoid: [
      'Fractional results wanted → /',
      'Truncation toward zero → math.trunc(a / b)',
      'Quotient and remainder together → divmod()',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'int for int operands, float otherwise',
    cpython:    'Objects/abstract.c :: PyNumber_FloorDivide → __floordiv__',
    memory:     'No allocation beyond the result',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '/',  slug: 'truediv', when: 'The fractional quotient' },
    { name: '%',  slug: 'mod',     when: 'The matching remainder' },
    { name: 'int', slug: 'int',    when: 'Truncate a float instead', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why floor instead of truncate?',
      a: 'So the identity a == b * (a // b) + (a % b) holds with a remainder whose sign follows the divisor — which makes modular arithmetic (clock math, indexing) work cleanly for negatives.',
    },
    {
      q: 'How do I get C-style division?',
      a: 'math.trunc(a / b) truncates toward zero; math.fmod gives the matching C-style remainder.',
    },
  ],

  history: [
    { version: '2.2', note: '// introduced (PEP 238) alongside the true-division plan.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations',
    meta:  'binary arithmetic',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
