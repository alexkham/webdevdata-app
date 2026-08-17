// content/reference/python/operators/mul.js

export const meta = {
  slug:        'mul',
  name:        '*',
  signature:   'a * b',
  blurb:       'Multiplication — and sequence repetition.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'times multiply multiplication repeat operator star',
};

export const method = {
  slug:      'mul',
  name:      '*',
  signature: 'a * b',
  returns:   { type: 'number | sequence', desc: 'The product of two numbers — or a sequence repeated int times.' },

  category:    'Arithmetic operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Multiplication for numbers, repetition for sequences — "ab" * 3 is \'ababab\'.',

  cheat: {
    commonCall: '6 * 7',
    returns:    'product, or repeated sequence',
    replaces:   '[0] * 5 builds a 5-zero list',
    watchOut:   '[[0]] * 3 repeats the SAME inner list — aliasing trap',
  },

  parameters: [
    { name: 'a', type: 'number | sequence', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'number | int',      required: true, default: null, desc: 'Right operand — the repeat count when a is a sequence.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left operand',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right operand', input: 'float' },
  ],
  demoTemplate: '{a} * {b}',
  cases: [
    { id: 'default', label: 'default', values: { a: 6, b: 7 } },
    { id: 'floats',  label: 'floats',  values: { a: 0.1, b: 3 } },
    { id: 'zero',    label: 'by zero', values: { a: 5, b: 0 } },
  ],
  demoExplainer: 'Numeric multiplication here; in real Python the same symbol repeats sequences ("ab" * 3, [0] * 5) when one operand is an int.',

  patterns: [
    {
      name: 'Initialize a flat list',
      desc: 'Safe for immutable fillers like numbers or None.',
      code: 'zeros = [0] * width',
    },
    {
      name: 'Separator lines',
      desc: 'String repetition for quick formatting.',
      code: 'print("-" * 40)',
    },
    {
      name: '2-D grids — the safe way',
      desc: 'A comprehension makes each row distinct; * would alias them.',
      code: 'grid = [[0] * w for _ in range(h)]',
    },
  ],

  examples: [
    { title: 'Numbers',            code: '6 * 7',       returns: '42' },
    { title: 'String repetition',  code: '"ab" * 3',    returns: "'ababab'" },
    { title: 'List repetition',    code: '[0] * 4',     returns: '[0, 0, 0, 0]' },
    { title: 'Zero repeats',       code: '"x" * 0',     returns: "''" },
  ],

  pitfalls: [
    {
      name: 'Nested list repetition aliases',
      desc: '* copies REFERENCES — all three inner lists are one object.',
      wrong: { label: 'Aliased rows', code: 'g = [[0]] * 3\ng[0].append(1)\ng', output: '[[0, 1], [0, 1], [0, 1]]' },
      fix:   { label: 'Fix', code: 'g = [[0] for _ in range(3)]\ng[0].append(1)\ng', output: '[[0, 1], [0], [0]]' },
    },
    {
      name: 'Float repeat counts raise',
      desc: 'Sequence repetition needs an int.',
      wrong: { label: 'Raises', code: '"ab" * 2.0', output: "TypeError: can't multiply sequence by non-int of type 'float'" },
      fix:   { label: 'Fix', code: '"ab" * int(2.0)', output: "'abab'" },
    },
  ],

  when: {
    use: [
      'Numeric products',
      'Repeating strings for formatting',
      'Flat lists of an immutable filler',
    ],
    avoid: [
      'Nested/mutable fillers → list comprehension',
      'Products of an iterable → math.prod',
      'Matrix multiplication → the @ operator (numpy)',
    ],
  },

  notes: {
    complexity: 'O(1) numbers; O(len·count) sequences',
    return:     'new value; operands untouched',
    cpython:    'Objects/abstract.c :: PyNumber_Multiply → __mul__ / __rmul__',
    memory:     'Repetition allocates the full result',
    threadSafe: 'Yes — operands are not mutated',
  },

  related: [
    { name: '+',  slug: 'add',  when: 'Concatenate once instead of repeating' },
    { name: '**', slug: 'pow',  when: 'Exponentiation, not repeated *' },
    { name: 'sum', slug: 'sum', when: 'Repeated + over an iterable', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does [[0]] * 3 share the inner list?',
      a: 'Repetition copies references, not objects. Three slots point at one list. Use a comprehension to build distinct inner lists.',
    },
    {
      q: 'What is the @ operator?',
      a: 'Matrix multiplication (PEP 465), delegating to __matmul__. No built-in type implements it — numpy arrays do.',
    },
  ],

  history: [
    { version: '3.5', note: 'Related: @ (matrix multiplication) added as a separate operator.' },
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
