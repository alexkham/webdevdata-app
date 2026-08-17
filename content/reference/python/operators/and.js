// content/reference/python/operators/and.js

export const meta = {
  slug:        'and',
  name:        'and',
  signature:   'a and b',
  blurb:       'Logical AND — short-circuits and returns an operand, not a bool.',
  category:    'logical',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'and logical boolean short circuit conjunction operator',
};

export const method = {
  slug:      'and',
  name:      'and',
  signature: 'a and b',
  returns:   { type: 'Any', desc: 'a when a is falsy, otherwise b — an OPERAND, not necessarily a bool. b is never evaluated when a is falsy (short-circuit).' },

  category:    'Logical operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Both must hold — but the result is an operand, and the right side may never run.',

  cheat: {
    commonCall: 'if user and user.active:',
    returns:    'first falsy operand, else the last operand',
    replaces:   '"" and "x" is \'\' — not False',
    watchOut:   'short-circuit: b is skipped entirely when a is falsy',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'Left operand — its truthiness decides whether b runs at all.' },
    { name: 'b', type: 'Any', required: true, default: null, desc: 'Right operand — evaluated (and returned) only when a is truthy.' },
  ],

  demoParams: [
    { name: 'a', type: 'Any', hint: 'empty = falsy', input: 'text' },
    { name: 'b', type: 'Any', hint: 'right operand', input: 'text' },
  ],
  demoTemplate: '{a} and {b}',
  cases: [
    { id: 'default', label: 'both truthy', values: { a: 'x', b: 'y' } },
    { id: 'falsy',   label: 'a falsy',     values: { a: '', b: 'y' } },
    { id: 'bfalsy',  label: 'b falsy',     values: { a: 'x', b: '' } },
  ],
  demoExplainer: 'Watch the outputs: they are OPERANDS, not True/False. Truthy a → you get b; falsy a (the empty string here) → you get a back. Inside an if this behaves like boolean AND, because the result is then truth-tested.',

  patterns: [
    {
      name: 'Guarded attribute access',
      desc: 'The left side protects the right from raising.',
      code: 'if user and user.is_admin:\n    ...',
    },
    {
      name: 'Guarded computation',
      desc: 'Short-circuit as control flow.',
      code: 'total and total_errors / total   # 0 when total is 0',
    },
  ],

  examples: [
    { title: 'Both truthy → last operand', code: '"x" and "y"',   returns: "'y'" },
    { title: 'Falsy left → left returned', code: '"" and "y"',    returns: "''" },
    { title: 'In a condition',             code: 'bool(1 and 0)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'The result is not a bool',
      desc: 'Code storing `a and b` gets an operand — fine for truth tests, surprising elsewhere.',
      wrong: { label: 'Operand leaks', code: 'flag = name and True\nprint(flag)', output: "'' when name is empty — not False" },
      fix:   { label: 'Force bool', code: 'flag = bool(name)', output: 'True/False' },
    },
    {
      name: 'Side effects on the right may never run',
      desc: 'Short-circuiting skips b entirely.',
      wrong: { label: 'Skipped call', code: 'ok and log_attempt()', output: 'log_attempt never called when ok is falsy' },
      fix:   { label: 'Explicit', code: 'if ok:\n    log_attempt()', output: 'intent visible' },
    },
    {
      name: 'and is not &',
      desc: '& is bitwise (and non-short-circuiting) — different operator entirely.',
      wrong: { label: 'Wrong tool', code: 'a() & b()   # both always run', output: 'no short-circuit, bitwise semantics' },
      fix:   { label: 'Fix', code: 'a() and b()', output: 'short-circuits' },
    },
  ],

  when: {
    use: [
      'Combined conditions in if/while',
      'Guard-then-use chains (null-safe access)',
    ],
    avoid: [
      'Element-wise boolean ops on arrays → & (numpy/pandas)',
      'Storing a guaranteed bool → wrap in bool()',
      'Default-if-falsy values → that is or’s job',
    ],
  },

  notes: {
    complexity: 'O(1) plus operand evaluation',
    return:     'an operand — a if falsy, else b',
    cpython:    'Compiled to JUMP_IF_FALSE_OR_POP — not a dunder method',
    memory:     'No allocation',
    threadSafe: 'Depends only on the operand expressions',
  },

  related: [
    { name: 'or',  slug: 'or',  when: 'Either side suffices' },
    { name: 'not', slug: 'not', when: 'Negation' },
    { name: '&',   slug: 'bitwise-and', when: 'Bitwise AND — the other ampersand' },
  ],

  faq: [
    {
      q: 'Why does and return an operand instead of a bool?',
      a: 'It enables guard idioms: `user and user.name` gives you the name or the falsy user directly. Truth-testing contexts coerce it anyway, so nothing is lost.',
    },
    {
      q: 'Can I overload and for my class?',
      a: 'No — short-circuiting makes it a control-flow construct, not a method call. You can only influence it via __bool__.',
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
