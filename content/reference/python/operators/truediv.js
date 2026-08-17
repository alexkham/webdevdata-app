// content/reference/python/operators/truediv.js

export const meta = {
  slug:        'truediv',
  name:        '/',
  signature:   'a / b',
  blurb:       'True division — always returns a float, even for ints.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'divide division slash true division float operator',
};

export const method = {
  slug:      'truediv',
  name:      '/',
  signature: 'a / b',
  returns:   { type: 'float', desc: 'The quotient as a float — ALWAYS, even when both operands are ints and divide evenly.' },

  category:    'Arithmetic operator',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'True division: 7 / 2 is 3.5, and even 8 / 2 is 4.0 — floats, always.',

  cheat: {
    commonCall: '7 / 2',
    returns:    'float, even for evenly-dividing ints',
    replaces:   'integer division is // — a different operator',
    watchOut:   'division by zero raises ZeroDivisionError',
  },

  parameters: [
    { name: 'a', type: 'number', required: true, default: null, desc: 'Dividend.' },
    { name: 'b', type: 'number', required: true, default: null, desc: 'Divisor — zero raises.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'dividend', input: 'float' },
    { name: 'b', type: 'float', hint: 'divisor',  input: 'float' },
  ],
  demoTemplate: '{a} / {b}',
  cases: [
    { id: 'default', label: 'default',  values: { a: 7, b: 2 } },
    { id: 'even',    label: 'divides evenly', values: { a: 8, b: 2 } },
    { id: 'zero',    label: 'by zero',  values: { a: 1, b: 0 } },
  ],
  demoExplainer: 'The result is a true quotient — 7 / 2 gives 3.5, no truncation. (Python would print the evenly-divided case as 4.0 to mark it as a float; the demo shows the numeric value.) Dividing by zero raises Python’s exact error.',

  patterns: [
    {
      name: 'Averages',
      desc: 'The float result is what you want for means.',
      code: 'mean = sum(xs) / len(xs)',
    },
    {
      name: 'Guarded division',
      desc: 'Handle the zero case explicitly when the divisor is data.',
      code: 'rate = hits / total if total else 0.0',
    },
  ],

  examples: [
    { title: 'True quotient',       code: '7 / 2',   returns: '3.5' },
    { title: 'Even division is still float', code: '8 / 2', returns: '4.0' },
    { title: 'Ints promote',        code: '1 / 3',   returns: '0.3333333333333333' },
  ],

  pitfalls: [
    {
      name: 'Expecting an int result',
      desc: 'Python 3 / never truncates — that is //.',
      wrong: { label: 'Float where int expected', code: 'index = total / 2\nitems[index]', output: 'TypeError: list indices must be integers' },
      fix:   { label: 'Fix', code: 'index = total // 2', output: 'int index' },
    },
    {
      name: 'Division by zero raises',
      desc: 'Not infinity, not NaN — an exception.',
      wrong: { label: 'Raises', code: '1 / 0', output: 'ZeroDivisionError: division by zero' },
      fix:   { label: 'Guard', code: 'x / y if y else float("inf")', output: 'explicit choice' },
    },
  ],

  when: {
    use: [
      'Any division where the fractional part matters',
      'Averages, rates, ratios',
    ],
    avoid: [
      'Whole-number division → //',
      'Quotient AND remainder → divmod()',
      'Exact decimal division → decimal.Decimal',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'float (int/int included)',
    cpython:    'Objects/abstract.c :: PyNumber_TrueDivide → __truediv__',
    memory:     'No allocation beyond the result',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '//',    slug: 'floordiv', when: 'Integer division' },
    { name: '%',     slug: 'mod',      when: 'The remainder' },
    { name: 'round', slug: 'round',    when: 'Round the quotient', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does 8 / 2 return 4.0 and not 4?',
      a: 'Python 3 made / always produce a float so the result type never depends on the values. Truncating division is a separate operator, //.',
    },
    {
      q: 'How was this different in Python 2?',
      a: 'Python 2 int / int truncated (7/2 == 3). The change was the headline break of Python 3.0.',
    },
  ],

  history: [
    { version: '3.0', note: 'int / int now returns float — the true-division switch (PEP 238).' },
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
