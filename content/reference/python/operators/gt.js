// content/reference/python/operators/gt.js

export const meta = {
  slug:        'gt',
  name:        '>',
  signature:   'a > b',
  blurb:       'Greater than — strict ordering.',
  category:    'comparison',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'greater than bigger larger ordering compare operator',
};

export const method = {
  slug:      'gt',
  name:      '>',
  signature: 'a > b',
  returns:   { type: 'bool', desc: 'True when a orders strictly after b. Unrelated types raise TypeError.' },

  category:    'Comparison operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Strictly greater — the mirror of <, with the same chaining and type rules.',

  cheat: {
    commonCall: 'if score > best:',
    returns:    'bool',
    replaces:   'a > b delegates to b.__lt__(a) when __gt__ is missing',
    watchOut:   'strict: equal values give False',
  },

  parameters: [
    { name: 'a', type: 'comparable', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'comparable', required: true, default: null, desc: 'Right operand.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right', input: 'float' },
  ],
  demoTemplate: '{a} > {b}',
  cases: [
    { id: 'default', label: 'greater', values: { a: 5, b: 3 } },
    { id: 'no',      label: 'less',    values: { a: 3, b: 5 } },
    { id: 'equal',   label: 'equal',   values: { a: 5, b: 5 } },
  ],
  demoExplainer: 'Strictly greater — equality gives False; use >= for inclusive checks.',

  patterns: [
    {
      name: 'Threshold checks',
      desc: 'The everyday comparison.',
      code: 'if len(queue) > MAX_PENDING:\n    reject()',
    },
    {
      name: 'Running maximum',
      desc: 'Track the best value seen.',
      code: 'if score > best:\n    best = score',
    },
  ],

  examples: [
    { title: 'Numbers',   code: '5 > 3',              returns: 'True' },
    { title: 'Equal is False', code: '5 > 5',         returns: 'False' },
    { title: 'Strings',   code: '"banana" > "apple"', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Strict vs inclusive off-by-one',
      desc: 'Boundary values silently fall through > when >= was meant.',
      wrong: { label: 'Boundary missed', code: 'if age > 18:  # 18-year-olds excluded', output: 'False at exactly 18' },
      fix:   { label: 'Fix', code: 'if age >= 18:', output: 'True at 18' },
    },
    {
      name: 'Mixed types raise',
      desc: 'Same Python 3 rule as <.',
      wrong: { label: 'Raises', code: '"10" > 5', output: "TypeError: '>' not supported between instances of 'str' and 'int'" },
      fix:   { label: 'Convert', code: 'int("10") > 5', output: 'True' },
    },
  ],

  when: {
    use: [
      'Threshold and boundary checks',
      'Running max/min tracking',
    ],
    avoid: [
      'Boundary inclusive → >=',
      'Largest of a collection → max()',
    ],
  },

  notes: {
    complexity: 'O(1) numbers; O(n) sequences',
    return:     'bool',
    cpython:    'Objects/object.c :: PyObject_RichCompare (Py_GT) → __gt__',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable operands',
  },

  related: [
    { name: '>=',  slug: 'ge',  when: 'Inclusive bound' },
    { name: '<',   slug: 'lt',  when: 'The other direction' },
    { name: 'max', slug: 'max', when: 'Greatest of many', category: 'functions' },
  ],

  faq: [
    {
      q: 'Does a > b use __gt__ or __lt__?',
      a: 'It tries a.__gt__(b) first, then falls back to the reflected b.__lt__(a) — which is why implementing just __lt__ (plus total_ordering) is usually enough.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#comparisons',
    meta:  'comparisons',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Compare data structures' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
