// content/reference/python/operators/not.js

export const meta = {
  slug:        'not',
  name:        'not',
  signature:   'not a',
  blurb:       'Logical negation — always returns a real bool.',
  category:    'logical',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'not negation invert boolean truthiness operator',
};

export const method = {
  slug:      'not',
  name:      'not',
  signature: 'not a',
  returns:   { type: 'bool', desc: 'True when a is falsy, False when truthy — unlike and/or, ALWAYS an actual bool.' },

  category:    'Logical operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Flip the truth — and the idiomatic emptiness check: `if not items:`.',

  cheat: {
    commonCall: 'if not items:',
    returns:    'always a real True/False',
    replaces:   'falsy: None, False, 0, "", [], {}, set()',
    watchOut:   '`not a == b` parses as `not (a == b)` — == binds tighter',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'The value to truth-test and negate.' },
  ],

  demoParams: [
    { name: 'a', type: 'Any', hint: 'empty = falsy', input: 'text' },
  ],
  demoTemplate: 'not {a}',
  cases: [
    { id: 'default', label: 'truthy', values: { a: 'x' } },
    { id: 'falsy',   label: 'falsy',  values: { a: '' } },
  ],
  demoExplainer: 'Any truthy value → False, any falsy value → True. This is also the one logical operator that guarantees a genuine bool result.',

  patterns: [
    {
      name: 'Emptiness checks',
      desc: 'The idiomatic way to test for empty containers.',
      code: 'if not items:\n    return',
    },
    {
      name: 'Boolean coercion',
      desc: 'Double negation is a terse bool() — bool() reads better.',
      code: 'has_data = bool(rows)   # clearer than: not not rows',
    },
  ],

  examples: [
    { title: 'Negate truthy',       code: 'not "x"',     returns: 'False' },
    { title: 'Negate falsy',        code: 'not ""',      returns: 'True' },
    { title: 'Empty list is falsy', code: 'not []',      returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Precedence with comparisons',
      desc: 'not binds LOOSER than ==, so `not a == b` is `not (a == b)`.',
      wrong: { label: 'Reads wrong', code: 'not x == 5   # looks like (not x) == 5', output: 'actually not (x == 5)' },
      fix:   { label: 'Say what you mean', code: 'x != 5', output: 'clearer spelling' },
    },
    {
      name: '`not x in y` vs `x not in y`',
      desc: 'They mean the same, but the dedicated operator reads better and is the convention.',
      wrong: { label: 'Awkward', code: 'if not key in d:', output: 'works, non-idiomatic' },
      fix:   { label: 'Fix', code: 'if key not in d:', output: 'idiomatic' },
    },
  ],

  when: {
    use: [
      'Emptiness / absence checks',
      'Flipping a condition for guard clauses',
    ],
    avoid: [
      'Double negation for coercion → bool()',
      '`not a == b` → a != b',
      '`not a is b` → a is not b',
    ],
  },

  notes: {
    complexity: 'O(1) plus the truth test (__bool__ or __len__)',
    return:     'bool — always',
    cpython:    'UNARY_NOT opcode → PyObject_IsTrue',
    memory:     'No allocation',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'and',    slug: 'and',    when: 'Conjunction' },
    { name: 'or',     slug: 'or',     when: 'Disjunction' },
    { name: 'not-in', slug: 'not-in', when: 'Negated membership, properly spelled' },
  ],

  faq: [
    {
      q: 'What exactly counts as falsy?',
      a: 'None, False, numeric zeros (0, 0.0, 0j), empty sequences and collections ("", [], (), {}, set(), range(0)), and any object whose __bool__ returns False or __len__ returns 0.',
    },
    {
      q: 'Why does not always return a bool when and/or do not?',
      a: 'and/or return operands to enable guard/default idioms. Negating a value has no such use — there is nothing useful about returning the original operand from a negation.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#boolean-operations',
    meta:  'boolean operations',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect condition data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
