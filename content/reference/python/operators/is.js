// content/reference/python/operators/is.js
//
// Doc-only page: identity cannot be demonstrated honestly with re-parsed
// text inputs, so hasLiveDemo is false.

export const meta = {
  slug:        'is',
  name:        'is',
  signature:   'a is b',
  blurb:       'Identity test — same object, not same value.',
  category:    'identity',
  type:        'operator',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'is identity same object none check operator',
};

export const method = {
  slug:      'is',
  name:      'is',
  signature: 'a is b',
  returns:   { type: 'bool', desc: 'True when a and b are the SAME object in memory — id(a) == id(b). Never overridable.' },

  category:    'Identity operator',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Same object, not equal value — and the one right way to check for None.',

  cheat: {
    commonCall: 'if x is None:',
    returns:    'bool — identity, not equality',
    replaces:   'the None/True/False singleton checks',
    watchOut:   'never use is for numbers or strings — caching lies to you',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'Any', required: true, default: null, desc: 'Right operand.' },
  ],

  patterns: [
    {
      name: 'The None check',
      desc: 'None is a singleton — identity is the correct and conventional test.',
      code: 'if result is None:\n    handle_missing()',
    },
    {
      name: 'Sentinel objects',
      desc: 'A private object() lets you distinguish "not passed" from any real value.',
      code: '_MISSING = object()\ndef f(x=_MISSING):\n    if x is _MISSING:\n        ...',
    },
  ],

  examples: [
    { title: 'None check',            code: 'x = None\nx is None',            returns: 'True' },
    { title: 'Equal but not identical', code: 'a = [1, 2]\nb = [1, 2]\na is b', returns: 'False' },
    { title: 'Same object',           code: 'a = [1, 2]\nb = a\na is b',      returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'is on numbers works — until it does not',
      desc: 'CPython caches small ints (-5..256) and some strings, so is "accidentally" succeeds in tests and fails in production.',
      wrong: { label: 'Implementation detail', code: 'a = 256; b = 256; a is b   # True\na = 257; b = 257; a is b   # may be False!', output: 'SyntaxWarning in 3.8+ for literals' },
      fix:   { label: 'Fix', code: 'a == b', output: 'value comparison — always correct' },
    },
    {
      name: '== None instead of is None',
      desc: 'A class can override __eq__ to answer anything — identity cannot be faked.',
      wrong: { label: 'Overridable', code: 'if x == None:', output: 'depends on x.__eq__' },
      fix:   { label: 'Fix', code: 'if x is None:', output: 'always the singleton test' },
    },
  ],

  when: {
    use: [
      'None / True / False singleton checks',
      'Sentinel-object comparisons',
      'Genuine same-object questions (aliasing checks)',
    ],
    avoid: [
      'Value comparison of any kind → ==',
      'Numbers and strings → never is',
    ],
  },

  notes: {
    complexity: 'O(1) — a pointer comparison',
    return:     'bool',
    cpython:    'IS_OP opcode — compares object addresses, no dunder',
    memory:     'No allocation',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'is-not', slug: 'is-not', when: 'The negation' },
    { name: '==',     slug: 'eq',     when: 'Value equality' },
    { name: 'list.copy', slug: 'list-copy', when: 'Break identity on purpose', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does `a is b` sometimes return True for equal strings?',
      a: 'CPython interns some strings and small ints as an optimization, making separate literals share one object. It is an implementation detail — never rely on it.',
    },
    {
      q: 'Can I override is for my class?',
      a: 'No. It compares object identity directly and bypasses all dunder methods — which is exactly why it is trustworthy for None checks.',
    },
  ],

  history: [
    { version: '3.8', note: 'SyntaxWarning added for `is` with int/str literals.' },
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
