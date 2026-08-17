// content/reference/python/operators/le.js

export const meta = {
  slug:        'le',
  name:        '<=',
  signature:   'a <= b',
  blurb:       'Less than or equal — the inclusive lower comparison.',
  category:    'comparison',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'less equal at most inclusive ordering compare operator',
};

export const method = {
  slug:      'le',
  name:      '<=',
  signature: 'a <= b',
  returns:   { type: 'bool', desc: 'True when a orders before b or equals it.' },

  category:    'Comparison operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: '"At most" — ordering with the boundary included. Also subset testing for sets.',

  cheat: {
    commonCall: 'if x <= limit:',
    returns:    'bool',
    replaces:   'on sets, <= means "is subset of"',
    watchOut:   'range idiom: lo <= x < hi (inclusive lo, exclusive hi)',
  },

  parameters: [
    { name: 'a', type: 'comparable', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'comparable', required: true, default: null, desc: 'Right operand.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right', input: 'float' },
  ],
  demoTemplate: '{a} <= {b}',
  cases: [
    { id: 'default', label: 'less',   values: { a: 3, b: 5 } },
    { id: 'equal',   label: 'equal',  values: { a: 5, b: 5 } },
    { id: 'no',      label: 'greater', values: { a: 7, b: 5 } },
  ],
  demoExplainer: 'Like < but True on equality too — the half-open range idiom lo <= x < hi is built from exactly this pair.',

  patterns: [
    {
      name: 'The half-open range idiom',
      desc: 'Inclusive start, exclusive end — matches slicing and range().',
      code: 'if 0 <= i < len(items):\n    ...',
    },
    {
      name: 'Subset testing',
      desc: 'On sets, <= is the subset relation.',
      code: 'required <= provided   # all required items present?',
    },
  ],

  examples: [
    { title: 'Less',           code: '3 <= 5',          returns: 'True' },
    { title: 'Equal',          code: '5 <= 5',          returns: 'True' },
    { title: 'Subset (sets)',  code: '{1, 2} <= {1, 2, 3}', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Both-inclusive ranges drift from Python idiom',
      desc: 'lo <= x <= hi is valid but slicing/range are half-open — mixing conventions breeds off-by-ones.',
      wrong: { label: 'Convention clash', code: 'if 0 <= i <= len(items) - 1:', output: 'works, but noisy' },
      fix:   { label: 'Idiomatic', code: 'if 0 <= i < len(items):', output: 'matches range()/slices' },
    },
  ],

  when: {
    use: [
      'Inclusive bounds ("at most")',
      'Half-open range checks with <',
      'Subset tests on sets',
    ],
    avoid: [
      'Strict bound wanted → <',
      'Clamping → min()/max()',
    ],
  },

  notes: {
    complexity: 'O(1) numbers; O(n) sequences/sets',
    return:     'bool',
    cpython:    'Objects/object.c :: PyObject_RichCompare (Py_LE) → __le__',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable operands',
  },

  related: [
    { name: '<',  slug: 'lt', when: 'Strict version' },
    { name: '>=', slug: 'ge', when: 'The mirror' },
    { name: 'min', slug: 'min', when: 'Smallest of many', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does <= mean for sets exactly?',
      a: 'a <= b is "a is a subset of b" (allowing equality); a < b is a PROPER subset. Same symbols, set semantics.',
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
