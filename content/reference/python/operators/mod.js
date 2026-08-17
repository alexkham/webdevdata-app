// content/reference/python/operators/mod.js

export const meta = {
  slug:        'mod',
  name:        '%',
  signature:   'a % b',
  blurb:       'Modulo — the remainder, with its sign following the divisor.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'modulo remainder percent mod operator wrap',
};

export const method = {
  slug:      'mod',
  name:      '%',
  signature: 'a % b',
  returns:   { type: 'number', desc: 'The remainder of a // b. Its sign follows the DIVISOR — the opposite of C and JavaScript.' },

  category:    'Arithmetic operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The remainder — and in Python, -7 % 3 is 2, not -1. That difference powers clean wrap-around math.',

  cheat: {
    commonCall: '7 % 3',
    returns:    'remainder, sign follows the divisor',
    replaces:   '-7 % 3 == 2 (JS/C give -1)',
    watchOut:   '% on a string is old-style formatting — different feature',
  },

  parameters: [
    { name: 'a', type: 'number', required: true, default: null, desc: 'Dividend.' },
    { name: 'b', type: 'number', required: true, default: null, desc: 'Divisor — zero raises. The result takes this sign.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'dividend', input: 'float' },
    { name: 'b', type: 'float', hint: 'divisor',  input: 'float' },
  ],
  demoTemplate: '{a} % {b}',
  cases: [
    { id: 'default',  label: 'default',      values: { a: 7, b: 3 } },
    { id: 'negdividend', label: '-7 % 3',    values: { a: -7, b: 3 } },
    { id: 'negdivisor',  label: '7 % -3',    values: { a: 7, b: -3 } },
    { id: 'even',     label: 'even check',   values: { a: 10, b: 2 } },
  ],
  demoExplainer: 'Try the negative cases — the result always carries the divisor’s sign: -7 % 3 is 2, and 7 % -3 is -2. C-family languages do the opposite, which is why ported wrap-around code breaks.',

  patterns: [
    {
      name: 'Even / odd and divisibility',
      desc: 'The classic use.',
      code: 'if n % 2 == 0:\n    even()',
    },
    {
      name: 'Wrap-around indexing',
      desc: 'Python’s divisor-signed % makes circular indexes just work — even negative ones.',
      code: 'next_player = (i + 1) % n_players\nprev_player = (i - 1) % n_players  # works at i == 0!',
    },
    {
      name: 'Cycling through buckets',
      desc: 'Every k-th item, clock arithmetic, striping.',
      code: 'bucket = hash(key) % n_buckets',
    },
  ],

  examples: [
    { title: 'Basic remainder',           code: '7 % 3',    returns: '1' },
    { title: 'Negative dividend',         code: '-7 % 3',   returns: '2' },
    { title: 'Negative divisor',          code: '7 % -3',   returns: '-2' },
    { title: 'Divisibility test',         code: '10 % 2',   returns: '0' },
  ],

  pitfalls: [
    {
      name: 'C/JS intuition breaks on negatives',
      desc: 'Same expression, different answer across languages.',
      wrong: { label: 'JS gives -1', code: '// JavaScript\n-7 % 3', output: '-1' },
      fix:   { label: 'Python', code: '# Python\n-7 % 3', output: '2 — sign follows the divisor' },
    },
    {
      name: 'Modulo by zero raises',
      desc: 'Same guard as division.',
      wrong: { label: 'Raises', code: '5 % 0', output: 'ZeroDivisionError: integer division or modulo by zero' },
      fix:   { label: 'Guard', code: 'r = a % b if b else 0', output: 'explicit choice' },
    },
    {
      name: '% on strings is formatting',
      desc: 'The old printf-style operator — unrelated to arithmetic.',
      wrong: { label: 'Different feature', code: '"%s scored %d" % ("Ann", 9)', output: "'Ann scored 9'" },
      fix:   { label: 'Modern form', code: 'f"{name} scored {score}"', output: 'f-strings supersede it' },
    },
  ],

  when: {
    use: [
      'Divisibility and parity checks',
      'Wrap-around / circular indexing (negatives included)',
      'Hashing into buckets, striping work',
    ],
    avoid: [
      'C-style remainder semantics → math.fmod',
      'Quotient too → divmod()',
      'String formatting → f-strings',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'int for int operands, float otherwise',
    cpython:    'Objects/abstract.c :: PyNumber_Remainder → __mod__',
    memory:     'No allocation beyond the result',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '//',  slug: 'floordiv', when: 'The matching quotient' },
    { name: '/',   slug: 'truediv',  when: 'Fractional division' },
    { name: 'abs', slug: 'abs',      when: 'Magnitude of remainders', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does Python make the sign follow the divisor?',
      a: 'It keeps a % n in the range [0, n) for positive n — so circular structures (clocks, rings, buffers) never see a negative index. The invariant a == b*(a//b) + (a%b) ties it to floor division.',
    },
    {
      q: 'How do I get the C-style remainder?',
      a: 'math.fmod follows the dividend’s sign like C.',
      code: 'import math\nmath.fmod(-7, 3)  # -1.0',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator; divisor-signed semantics from the start.' },
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
