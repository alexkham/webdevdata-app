// content/reference/python/operators/sub.js

export const meta = {
  slug:        'sub',
  name:        '-',
  signature:   'a - b',
  blurb:       'Subtraction — and set difference.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'minus subtract subtraction difference operator',
};

export const method = {
  slug:      'sub',
  name:      '-',
  signature: 'a - b',
  returns:   { type: 'number | set', desc: 'The difference of two numbers — or, for sets, the elements of a not in b.' },

  category:    'Arithmetic operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Subtraction for numbers, difference for sets. Also the unary negation prefix.',

  cheat: {
    commonCall: '7 - 2',
    returns:    'difference; int - int stays int',
    replaces:   '{1,2,3} - {2} is set difference',
    watchOut:   'strings do NOT support - — use replace to remove',
  },

  parameters: [
    { name: 'a', type: 'number | set', required: true, default: null, desc: 'Left operand (minuend).' },
    { name: 'b', type: 'number | set', required: true, default: null, desc: 'Right operand (subtrahend).' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left operand',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right operand', input: 'float' },
  ],
  demoTemplate: '{a} - {b}',
  cases: [
    { id: 'default',  label: 'default',   values: { a: 7, b: 2 } },
    { id: 'negative', label: 'negative',  values: { a: 2, b: 7 } },
    { id: 'floats',   label: 'floats',    values: { a: 0.3, b: 0.1 } },
  ],
  demoExplainer: 'Plain numeric subtraction — results can go negative, and floats show their stored binary values (0.3 - 0.1 is 0.19999999999999998).',

  patterns: [
    {
      name: 'Deltas and distances',
      desc: 'Wrap in abs() when direction does not matter.',
      code: 'delta = after - before\ndistance = abs(a - b)',
    },
    {
      name: 'Set difference',
      desc: 'What is in a but not in b.',
      code: 'missing = required - provided',
    },
  ],

  examples: [
    { title: 'Numbers',        code: '7 - 2',             returns: '5' },
    { title: 'Negative result', code: '2 - 7',            returns: '-5' },
    { title: 'Set difference', code: '{1, 2, 3} - {2}',   returns: '{1, 3}' },
    { title: 'Unary minus',    code: '-(3 + 4)',          returns: '-7' },
  ],

  pitfalls: [
    {
      name: 'No string subtraction',
      desc: 'Removing a substring is replace, not minus.',
      wrong: { label: 'Raises', code: '"hello.txt" - ".txt"', output: "TypeError: unsupported operand type(s) for -: 'str' and 'str'" },
      fix:   { label: 'Fix', code: '"hello.txt".removesuffix(".txt")', output: "'hello'" },
    },
    {
      name: 'Float drift',
      desc: 'Binary floats make simple-looking differences inexact.',
      wrong: { label: 'Surprising', code: '0.3 - 0.1', output: '0.19999999999999998' },
      fix:   { label: 'Exact decimals', code: 'from decimal import Decimal\nDecimal("0.3") - Decimal("0.1")', output: "Decimal('0.2')" },
    },
  ],

  when: {
    use: [
      'Numeric differences and deltas',
      'Set difference between collections of unique items',
    ],
    avoid: [
      'Removing substrings → str.replace / removesuffix',
      'Removing list items → list.remove or a comprehension',
      'Money math → decimal.Decimal',
    ],
  },

  notes: {
    complexity: 'O(1) numbers; O(len(a)) sets',
    return:     'new value; operands untouched',
    cpython:    'Objects/abstract.c :: PyNumber_Subtract → __sub__ / __rsub__',
    memory:     'Set difference allocates a new set',
    threadSafe: 'Yes — operands are not mutated',
  },

  related: [
    { name: '+',   slug: 'add', when: 'The inverse' },
    { name: 'abs', slug: 'abs', when: 'Direction-free difference', category: 'functions' },
    { name: '//',  slug: 'floordiv', when: 'Divide instead' },
  ],

  faq: [
    {
      q: 'Is there a set difference for lists?',
      a: 'Not with -; convert to sets (losing order/duplicates) or use a comprehension to keep order.',
      code: '[x for x in a if x not in set(b)]',
    },
    {
      q: 'What is the unary minus exactly?',
      a: 'A separate operator (__neg__) that negates a single operand: -x. Same symbol, different arity.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
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
