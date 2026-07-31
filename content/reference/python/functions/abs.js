// content/reference/python/functions/abs.js

export const meta = {
  slug:        'abs',
  name:        'abs',
  signature:   'abs(x)',
  blurb:       'Return the absolute value of a number.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'abs absolute value magnitude negative positive',
};

export const method = {
  slug:      'abs',
  name:      'abs',
  signature: 'abs(x)',
  returns:   { type: 'int | float', desc: 'The absolute value, same type as the input. For complex numbers, the magnitude (a float).' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Distance from zero: negatives flip positive, positives pass through.',

  cheat: {
    commonCall: 'abs(-5)',
    returns:    'same type as input (complex → float magnitude)',
    replaces:   'delegates to __abs__ — works on Decimal, Fraction, numpy too',
    watchOut:   'strings and lists have no abs — TypeError',
  },

  parameters: [
    { name: 'x', type: 'int | float | complex', required: true, default: null, desc: 'The number. Any type implementing __abs__ works.' },
  ],

  demoParams: [
    { name: 'x', type: 'float', hint: 'the number', input: 'float' },
  ],
  cases: [
    { id: 'default', label: 'negative', values: { x: -5 } },
    { id: 'pos',     label: 'positive', values: { x: 3.2 } },
    { id: 'zero',    label: 'zero',     values: { x: 0 } },
    { id: 'negfloat', label: 'float',   values: { x: -2.75 } },
  ],
  demoExplainer: 'Sign removed, value kept — ints stay int, floats stay float.',

  patterns: [
    {
      name: 'Distance between numbers',
      desc: 'Order-independent difference.',
      code: 'delta = abs(a - b)',
    },
    {
      name: 'Tolerance comparison',
      desc: 'The float-equality workaround — or use math.isclose.',
      code: 'if abs(x - y) < 1e-9:\n    treat_as_equal()',
    },
    {
      name: 'Magnitude sorting',
      desc: 'abs as a key function.',
      code: 'sorted(deltas, key=abs)',
    },
  ],

  examples: [
    { title: 'Negative int',    code: 'abs(-5)',    returns: '5' },
    { title: 'Positive float',  code: 'abs(3.2)',   returns: '3.2' },
    { title: 'Zero',            code: 'abs(0)',     returns: '0' },
    { title: 'Complex magnitude', code: 'abs(3 + 4j)', returns: '5.0' },
  ],

  pitfalls: [
    {
      name: 'Non-numbers raise',
      desc: 'abs is numeric only — convert strings first.',
      wrong: { label: 'Raises', code: 'abs("-5")', output: "TypeError: bad operand type for abs(): 'str'" },
      fix:   { label: 'Fix', code: 'abs(int("-5"))', output: '5' },
    },
    {
      name: 'The int minimum edge case exists elsewhere, not in Python',
      desc: 'Languages with fixed-width ints overflow on abs(INT_MIN); Python ints are arbitrary precision — abs never overflows.',
      wrong: { label: 'C/Java worry', code: 'abs(-2**63)', output: '9223372036854775808 — fine in Python' },
      fix:   { label: 'Nothing to fix', code: '# Python ints grow as needed', output: 'no overflow' },
    },
  ],

  when: {
    use: [
      'Distances and differences',
      'Tolerance checks (or math.isclose)',
      'Magnitude-based keys for sorted/max/min',
    ],
    avoid: [
      'Element-wise on arrays → numpy.abs',
      'Float equality directly → math.isclose',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'same type as input; complex → float',
    cpython:    'Python/bltinmodule.c → PyNumber_Absolute → __abs__ slot',
    memory:     'No allocation for small ints (cached)',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: 'round',  slug: 'round',  when: 'Precision after magnitude' },
    { name: 'max',    slug: 'max',    when: 'Compare magnitudes: max(a, b, key=abs)' },
    { name: 'sorted', slug: 'sorted', when: 'Order by distance from zero' },
  ],

  faq: [
    {
      q: 'Does abs work on my own class?',
      a: 'Yes — implement __abs__ and abs() delegates to it.',
      code: 'class Vector:\n    def __abs__(self):\n        return math.hypot(self.x, self.y)',
    },
    {
      q: 'What does abs do with complex numbers?',
      a: 'Returns the magnitude — sqrt(real² + imag²) — as a float.',
    },
    {
      q: 'abs vs math.fabs?',
      a: 'math.fabs always returns a float and rejects complex; abs preserves int-ness and handles anything with __abs__. Prefer abs.',
    },
  ],

  history: [
    { version: '1.0', note: 'One of the original built-ins.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#abs',
    meta:  'abs',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
