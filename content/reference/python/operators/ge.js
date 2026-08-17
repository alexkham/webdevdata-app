// content/reference/python/operators/ge.js

export const meta = {
  slug:        'ge',
  name:        '>=',
  signature:   'a >= b',
  blurb:       'Greater than or equal — the inclusive upper comparison.',
  category:    'comparison',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'greater equal at least inclusive ordering compare operator',
};

export const method = {
  slug:      'ge',
  name:      '>=',
  signature: 'a >= b',
  returns:   { type: 'bool', desc: 'True when a orders after b or equals it.' },

  category:    'Comparison operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: '"At least" — ordering with the boundary included. Superset testing for sets.',

  cheat: {
    commonCall: 'if age >= 18:',
    returns:    'bool',
    replaces:   'on sets, >= means "is superset of"',
    watchOut:   'the >= vs > choice IS the boundary decision — make it consciously',
  },

  parameters: [
    { name: 'a', type: 'comparable', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'comparable', required: true, default: null, desc: 'Right operand.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right', input: 'float' },
  ],
  demoTemplate: '{a} >= {b}',
  cases: [
    { id: 'default', label: 'greater', values: { a: 21, b: 18 } },
    { id: 'equal',   label: 'equal',   values: { a: 18, b: 18 } },
    { id: 'no',      label: 'less',    values: { a: 16, b: 18 } },
  ],
  demoExplainer: 'True at and above the boundary — the age-check shape. Equality passing is the entire difference from >.',

  patterns: [
    {
      name: 'Minimum requirements',
      desc: 'Versions, ages, quotas.',
      code: 'if python_version >= (3, 9):\n    use_removeprefix()',
    },
    {
      name: 'Superset testing',
      desc: 'On sets, >= is the superset relation.',
      code: 'provided >= required   # everything needed is there',
    },
  ],

  examples: [
    { title: 'Greater',         code: '21 >= 18',            returns: 'True' },
    { title: 'Boundary passes', code: '18 >= 18',            returns: 'True' },
    { title: 'Tuple versions',  code: '(3, 12) >= (3, 9)',   returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Version STRINGS compare wrong',
      desc: 'Lexicographic "3.10" is less than "3.9" — compare tuples instead.',
      wrong: { label: 'Wrong', code: '"3.10" >= "3.9"', output: 'False' },
      fix:   { label: 'Fix', code: '(3, 10) >= (3, 9)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Inclusive minimums ("at least")',
      'Version gates via tuples',
      'Superset tests on sets',
    ],
    avoid: [
      'Strict bound wanted → >',
      'Version strings → parse to tuples first',
    ],
  },

  notes: {
    complexity: 'O(1) numbers; O(n) sequences/sets',
    return:     'bool',
    cpython:    'Objects/object.c :: PyObject_RichCompare (Py_GE) → __ge__',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable operands',
  },

  related: [
    { name: '>',  slug: 'gt', when: 'Strict version' },
    { name: '<=', slug: 'le', when: 'The mirror' },
    { name: 'max', slug: 'max', when: 'Largest of many', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why compare version tuples instead of strings?',
      a: 'Tuples compare element-by-element numerically — (3, 10) > (3, 9). Strings compare character-by-character, so "3.10" < "3.9" because "1" < "9".',
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
