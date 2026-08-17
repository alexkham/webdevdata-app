// content/reference/python/operators/eq.js

export const meta = {
  slug:        'eq',
  name:        '==',
  signature:   'a == b',
  blurb:       'Equality by value — not identity.',
  category:    'comparison',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'equals equality double equals compare operator',
};

export const method = {
  slug:      'eq',
  name:      '==',
  signature: 'a == b',
  returns:   { type: 'bool', desc: 'True when the operands compare equal by VALUE. Mixed unrelated types are simply unequal — no exception.' },

  category:    'Comparison operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Value equality: do these hold the same data? (Identity — same object — is the separate `is`.)',

  cheat: {
    commonCall: 'a == b',
    returns:    'bool; unrelated types → False, never an error',
    replaces:   '1 == 1.0 == True — numeric types cross-compare',
    watchOut:   '= assigns, == compares — inside if, = is a SyntaxError',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'Any', required: true, default: null, desc: 'Right operand.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right', input: 'float' },
  ],
  demoTemplate: '{a} == {b}',
  cases: [
    { id: 'default', label: 'equal',     values: { a: 5, b: 5 } },
    { id: 'diff',    label: 'not equal', values: { a: 5, b: 6 } },
    { id: 'floatint', label: 'int vs float', values: { a: 1, b: 1.0 } },
    { id: 'drift',   label: 'float trap', values: { a: 0.30000000000000004, b: 0.3 } },
  ],
  demoExplainer: 'Numbers compare by value across int/float. The float-trap case shows why computed floats should not be ==-compared: 0.1 + 0.2 does not equal 0.3.',

  patterns: [
    {
      name: 'Container equality is element-wise',
      desc: 'Lists, dicts and sets compare their contents.',
      code: '[1, 2] == [1, 2]        # True — different objects, equal values',
    },
    {
      name: 'Float comparison with tolerance',
      desc: 'Never == computed floats.',
      code: 'import math\nmath.isclose(0.1 + 0.2, 0.3)   # True',
    },
  ],

  examples: [
    { title: 'Value equality',            code: '[1, 2] == [1, 2]', returns: 'True' },
    { title: 'Cross-type numerics',       code: '1 == 1.0',         returns: 'True' },
    { title: 'Unrelated types',           code: '1 == "1"',         returns: 'False' },
    { title: 'The float trap',            code: '0.1 + 0.2 == 0.3', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Computed floats rarely compare equal',
      desc: 'Representation error accumulates.',
      wrong: { label: 'False', code: '0.1 + 0.2 == 0.3', output: 'False' },
      fix:   { label: 'Fix', code: 'math.isclose(0.1 + 0.2, 0.3)', output: 'True' },
    },
    {
      name: '== vs is',
      desc: 'Equal values need not be the same object — and vice-versa matters for None.',
      wrong: { label: 'Style error', code: 'if x == None:', output: 'works but wrong idiom (and __eq__ can lie)' },
      fix:   { label: 'Fix', code: 'if x is None:', output: 'identity check — the convention' },
    },
    {
      name: 'bool is an int',
      desc: 'True == 1 and False == 0 — visible in counting and dict keys.',
      wrong: { label: 'Surprising', code: '{True: "a", 1: "b"}', output: "{True: 'b'} — same key!" },
      fix:   { label: 'Be aware', code: 'type-check when bools and ints mix', output: 'explicit handling' },
    },
  ],

  when: {
    use: [
      'Any value comparison',
      'Container content comparison',
    ],
    avoid: [
      'None checks → is None',
      'Computed floats → math.isclose',
      'Same-object checks → is',
    ],
  },

  notes: {
    complexity: 'O(1) scalars; O(n) containers',
    return:     'bool (custom __eq__ may return anything)',
    cpython:    'Objects/object.c :: PyObject_RichCompare (Py_EQ)',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable operands',
  },

  related: [
    { name: '!=', slug: 'ne',  when: 'The negation' },
    { name: 'is', slug: 'is',  when: 'Identity, not value' },
    { name: '<',  slug: 'lt',  when: 'Ordering' },
  ],

  faq: [
    {
      q: 'How do I customize == for my class?',
      a: 'Implement __eq__ (and keep __hash__ consistent if instances go into sets/dicts).',
      code: 'def __eq__(self, other):\n    return isinstance(other, Point) and self.xy == other.xy',
    },
    {
      q: 'Why does 1 == "1" return False instead of raising?',
      a: 'Equality is defined across all types — unrelated types are just unequal. Only ORDERING comparisons (<, >) raise on mixed types.',
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
