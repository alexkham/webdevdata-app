// content/reference/python/operators/ne.js

export const meta = {
  slug:        'ne',
  name:        '!=',
  signature:   'a != b',
  blurb:       'Inequality by value — the negation of ==.',
  category:    'comparison',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'not equal inequality bang equals compare operator',
};

export const method = {
  slug:      'ne',
  name:      '!=',
  signature: 'a != b',
  returns:   { type: 'bool', desc: 'True when the operands are NOT equal by value. Unrelated types are unequal, so this is True for them.' },

  category:    'Comparison operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Not equal by value — everything == is, inverted.',

  cheat: {
    commonCall: 'status != "done"',
    returns:    'bool',
    replaces:   'mixed unrelated types → True (they are unequal)',
    watchOut:   'None checks: prefer `is not None` over != None',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'Any', required: true, default: null, desc: 'Right operand.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right', input: 'float' },
  ],
  demoTemplate: '{a} != {b}',
  cases: [
    { id: 'default', label: 'different', values: { a: 5, b: 6 } },
    { id: 'same',    label: 'equal',     values: { a: 5, b: 5 } },
    { id: 'floatint', label: 'int vs float', values: { a: 1, b: 1.0 } },
  ],
  demoExplainer: 'The exact inverse of ==, including the cross-type numeric rules: 1 != 1.0 is False because they compare equal.',

  patterns: [
    {
      name: 'Guard clauses',
      desc: 'Early exits on unexpected values.',
      code: 'if response.status != 200:\n    raise ApiError(response)',
    },
    {
      name: 'Change detection',
      desc: 'Compare before/after snapshots.',
      code: 'if new_config != old_config:\n    reload()',
    },
  ],

  examples: [
    { title: 'Different values',    code: '5 != 6',     returns: 'True' },
    { title: 'Equal values',        code: '5 != 5',     returns: 'False' },
    { title: 'Unrelated types',     code: '1 != "1"',   returns: 'True' },
  ],

  pitfalls: [
    {
      name: '!= None instead of is not None',
      desc: 'Works usually — but a class can override __ne__ and lie.',
      wrong: { label: 'Fragile idiom', code: 'if x != None:', output: 'depends on __ne__' },
      fix:   { label: 'Fix', code: 'if x is not None:', output: 'identity — cannot be overridden' },
    },
    {
      name: 'Float inequality inherits the float trap',
      desc: 'Computed floats are almost always "not equal".',
      wrong: { label: 'True, surprisingly', code: '0.1 + 0.2 != 0.3', output: 'True' },
      fix:   { label: 'Fix', code: 'not math.isclose(0.1 + 0.2, 0.3)', output: 'False' },
    },
  ],

  when: {
    use: [
      'Guard clauses and validation',
      'Change detection between values',
    ],
    avoid: [
      'None checks → is not None',
      'Computed floats → math.isclose',
    ],
  },

  notes: {
    complexity: 'O(1) scalars; O(n) containers',
    return:     'bool',
    cpython:    'Objects/object.c :: PyObject_RichCompare (Py_NE)',
    memory:     'No allocation',
    threadSafe: 'Yes for immutable operands',
  },

  related: [
    { name: '==',     slug: 'eq',     when: 'The positive form' },
    { name: 'is-not', slug: 'is-not', when: 'Different objects, not different values' },
    { name: 'not',    slug: 'not',    when: 'Negate any condition' },
  ],

  faq: [
    {
      q: 'Do I need to implement __ne__ if I wrote __eq__?',
      a: 'No — Python 3 derives != from __eq__ automatically. Only override __ne__ for exotic semantics.',
    },
    {
      q: 'Is there a <> operator?',
      a: 'It existed in Python 2 as an alias of != and was removed in Python 3.',
    },
  ],

  history: [
    { version: '3.0', note: 'The legacy <> spelling removed; __ne__ auto-derived from __eq__.' },
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
