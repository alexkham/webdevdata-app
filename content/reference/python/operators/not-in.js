// content/reference/python/operators/not-in.js

export const meta = {
  slug:        'not-in',
  name:        'not in',
  signature:   'item not in container',
  blurb:       'Negated membership — one operator, not two.',
  category:    'membership',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'not in membership absent missing exclude operator',
};

export const method = {
  slug:      'not-in',
  name:      'not in',
  signature: 'item not in container',
  returns:   { type: 'bool', desc: 'True when item is NOT a member of container. Exactly `not (item in container)`, as one readable operator.' },

  category:    'Membership operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Absence, spelled the way you say it: `if key not in cache:`.',

  cheat: {
    commonCall: 'if key not in cache:',
    returns:    'bool',
    replaces:   'preferred over `not key in cache` — same result, better reading',
    watchOut:   'same dict-keys and O(n)-list rules as in',
  },

  parameters: [
    { name: 'item',      type: 'Any',      required: true, default: null, desc: 'The candidate.' },
    { name: 'container', type: 'iterable', required: true, default: null, desc: 'Where to look.' },
  ],

  demoParams: [
    { name: 'item',      type: 'Any',  hint: 'to find',               input: 'text' },
    { name: 'container', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  demoTemplate: '{item} not in {container}',
  cases: [
    { id: 'default', label: 'absent',  values: { item: 'z', container: 'a,b,c' } },
    { id: 'present', label: 'present', values: { item: 'b', container: 'a,b,c' } },
  ],
  demoExplainer: 'The exact inverse of in — True for absence. Python treats "not in" as a single operator token, which is why it reads so naturally.',

  patterns: [
    {
      name: 'Initialize-if-missing',
      desc: 'The check-then-create dict pattern.',
      code: 'if key not in groups:\n    groups[key] = []\ngroups[key].append(item)',
    },
    {
      name: 'Filtering out exclusions',
      desc: 'Comprehension with a blocklist.',
      code: 'kept = [x for x in items if x not in BANNED]',
    },
  ],

  examples: [
    { title: 'Absent element', code: '"z" not in ["a", "b"]', returns: 'True' },
    { title: 'Missing key',    code: '"k" not in {}',          returns: 'True' },
    { title: 'Substring form', code: '"xyz" not in "hello"',   returns: 'True' },
  ],

  pitfalls: [
    {
      name: '`not x in y` reads wrong',
      desc: 'Identical semantics, but the split spelling invites misreading — and linters flag it.',
      wrong: { label: 'Awkward', code: 'if not key in d:', output: 'works; flagged by style checkers' },
      fix:   { label: 'Fix', code: 'if key not in d:', output: 'idiomatic' },
    },
  ],

  when: {
    use: [
      'Absence checks and guards',
      'Exclusion filters',
    ],
    avoid: [
      'Absence-then-store on dicts → dict.setdefault covers both steps',
      'Big-list exclusion sets → convert to set first',
    ],
  },

  notes: {
    complexity: 'same as in: O(1) sets/dicts, O(n) lists',
    return:     'bool',
    cpython:    'CONTAINS_OP with invert flag — one opcode',
    memory:     'No allocation',
    threadSafe: 'Yes for stable containers',
  },

  related: [
    { name: 'in',         slug: 'in',         when: 'The positive form' },
    { name: 'not',        slug: 'not',        when: 'General negation' },
    { name: 'setdefault', slug: 'setdefault', when: 'Check-and-create in one call', category: 'functions' },
  ],

  faq: [
    {
      q: 'Is `not in` really one operator?',
      a: 'Yes — grammatically a single comparison operator, compiled to one opcode. It is not `not` applied afterwards, though the result is identical.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#membership-test-operations',
    meta:  'membership tests',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect container data' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore nested keys' },
  ],
};
