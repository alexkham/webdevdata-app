// content/reference/python/operators/is-not.js
//
// Doc-only page, like `is`.

export const meta = {
  slug:        'is-not',
  name:        'is not',
  signature:   'a is not b',
  blurb:       'Negated identity — different objects.',
  category:    'identity',
  type:        'operator',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'is not identity different object none check operator',
};

export const method = {
  slug:      'is-not',
  name:      'is not',
  signature: 'a is not b',
  returns:   { type: 'bool', desc: 'True when a and b are DIFFERENT objects. One operator token — not `is` followed by `not`.' },

  category:    'Identity operator',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Different objects — and the standard "has a value" check: `if x is not None:`.',

  cheat: {
    commonCall: 'if x is not None:',
    returns:    'bool',
    replaces:   'preferred over `not (x is None)` and `x != None`',
    watchOut:   'same caching caveats as is — never for numbers/strings',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'Any', required: true, default: null, desc: 'Right operand.' },
  ],

  patterns: [
    {
      name: 'The presence check',
      desc: 'The counterpart of the None guard.',
      code: 'if result is not None:\n    use(result)',
    },
    {
      name: 'Preserving falsy-but-valid values',
      desc: 'Where `or` would clobber 0 / "" / [], identity keeps them.',
      code: 'port = cfg_port if cfg_port is not None else 8080',
    },
  ],

  examples: [
    { title: 'Has a value',    code: 'x = 0\nx is not None',            returns: 'True' },
    { title: 'Different objects', code: '[1, 2] is not [1, 2]',         returns: 'True' },
  ],

  pitfalls: [
    {
      name: '`a is (not b)` is a different expression',
      desc: 'Parenthesizing wrongly turns identity into a bool comparison.',
      wrong: { label: 'Wrong parse', code: 'x is (not None)   # x is True?!', output: 'compares x with the bool True' },
      fix:   { label: 'One token', code: 'x is not None', output: 'negated identity' },
    },
  ],

  when: {
    use: [
      '"Has a real value" guards',
      'Distinguishing None from falsy-but-valid data',
    ],
    avoid: [
      'Value inequality → !=',
      'Numbers/strings → never identity',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'bool',
    cpython:    'IS_OP with invert flag — one opcode',
    memory:     'No allocation',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'is', slug: 'is', when: 'The positive form' },
    { name: '!=', slug: 'ne', when: 'Value inequality' },
    { name: 'or', slug: 'or', when: 'What it protects you from misusing' },
  ],

  faq: [
    {
      q: 'Why prefer `x is not None` over `x != None`?',
      a: 'Identity cannot be overridden; __ne__ can. And the idiom signals intent: you are testing for the singleton, not comparing values.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#is-not',
    meta:  'identity comparisons',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore structures' },
  ],
};
