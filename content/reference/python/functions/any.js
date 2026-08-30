// content/reference/python/functions/any.js

export const meta = {
  slug:        'any',
  name:        'any',
  signature:   'any(iterable)',
  blurb:       'True if any item is truthy — stops at the first hit.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'any true truthy exists short-circuit or boolean iterable check',
};

export const method = {
  slug:      'any',
  name:      'any',
  signature: 'any(iterable)',
  returns:   { type: 'bool', desc: 'True as soon as one item is truthy. False if every item is falsy or the iterable is empty.' },

  category:    'Built-in function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Short-circuit \"is anything truthy?\" over any iterable.',

  cheat: {
    commonCall: 'if any(x.is_ready for x in jobs):',
    returns:    'True or False',
    replaces:   'the multi-line for-loop-with-flag pattern',
    watchOut:   'empty iterable → False (not True, not error)',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable — list, tuple, generator, set, dict (keys), file lines. Items are evaluated for truthiness the same way `if item:` does.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'one-true',   label: 'one truthy',   values: { items: '0,0,3,0' } },
    { id: 'all-falsy',  label: 'all falsy',    values: { items: '0,,0' } },
    { id: 'all-true',   label: 'all truthy',   values: { items: '1,2,3' } },
    { id: 'empty',      label: 'empty',        values: { items: '' } },
    { id: 'mixed',      label: 'strings',      values: { items: ',hello,' } },
  ],
  demoExplainer: 'any walks the iterable and stops the moment it sees a truthy item — a generator input would not be consumed past that point. Empty iterables return False by convention: there is no truthy item, so \"does any exist?\" is False. Falsy values in Python: 0, 0.0, "", [], {}, None, False.',

  patterns: [
    {
      name: 'Check a condition across items',
      desc: 'Generator expression + any — reads like the English question.',
      code: 'has_admin = any(u.role == "admin" for u in users)',
    },
    {
      name: 'Substring in any string',
      desc: 'One any call replaces a for-loop with a flag.',
      code: 'contains_error = any("error" in line for line in log)',
    },
    {
      name: 'Guard against an empty result',
      desc: 'any is False on an empty iterable — often the correct default.',
      code: 'if not any(results):\n    print("nothing found")',
    },
  ],

  examples: [
    { title: 'One truthy wins',     code: 'any([0, 0, 3, 0])',              returns: 'True' },
    { title: 'All falsy',           code: 'any([0, "", None, False])',      returns: 'False' },
    { title: 'Empty is False',      code: 'any([])',                        returns: 'False' },
    { title: 'Generator + short-circuit', code: 'any(x > 100 for x in nums)', returns: 'True or False; stops at first hit' },
  ],

  pitfalls: [
    {
      name: 'any([]) is False, not True',
      desc: 'A common surprise — \"nothing is anything\" sounds like it could be True, but Python defines the empty case as False. Mirrors mathematical convention (existential over empty set).',
      wrong: { label: 'Wrong expectation', code: 'if any([]):\n    print("truthy")\nelse:\n    print("falsy")', output: 'falsy' },
      fix:   { label: 'Read the contract', code: 'any([])   # False\nall([])   # True', output: 'documented behaviour' },
    },
    {
      name: 'Passing a value, not an iterable',
      desc: 'any takes exactly one iterable — not several arguments.',
      wrong: { label: 'Wrong shape', code: 'any(a, b, c)', output: 'TypeError: any() takes exactly one argument (3 given)' },
      fix:   { label: 'Wrap it',     code: 'any([a, b, c])', output: 'True or False' },
    },
    {
      name: 'any on a generator consumes it',
      desc: 'After a truthy hit, the generator is partially consumed — subsequent iteration skips what was already checked.',
      wrong: { label: 'Half-consumed', code: 'g = (x for x in [0, 3, 5])\nany(g)     # True (stops at 3)\nlist(g)    # [5] — 0 and 3 are gone', output: '[5]' },
      fix:   { label: 'Materialize first', code: 'items = [x for x in source]\nany(items)\nlist(items)', output: 'full list preserved' },
    },
  ],

  when: {
    use: [
      '\"Does at least one item satisfy X?\"',
      'Short-circuit checks over large iterables',
      'Generator expressions where you do not want to build a list',
    ],
    avoid: [
      '\"Do all items satisfy X?\" → all',
      'Counting matches → sum(cond for x in xs)',
      'Finding the item itself → next() with a generator',
    ],
  },

  notes: {
    complexity: 'O(k) where k is the position of the first truthy item; O(n) worst case',
    return:     'bool — always True or False, never the item itself',
    cpython:    'Python/bltinmodule.c :: builtin_any — thin loop over the iterator with early exit',
    memory:     'O(1) — no buffering',
    threadSafe: 'The scan is safe; the source should not mutate concurrently',
  },

  related: [
    { name: 'all',       slug: 'all',       when: '\"Do ALL items satisfy X?\"' },
    { name: 'sum',       slug: 'sum',       when: 'Count matches instead of a yes/no' },
    { name: 'enumerate', slug: 'enumerate', when: 'You also want the index of the first hit' },
  ],

  faq: [
    {
      q: 'Why does any([]) return False?',
      a: 'It matches the existential quantifier: \"does there exist an x in [] such that x is truthy?\" — no, because there is no x at all. all([]) is True by the mirror convention.',
    },
    {
      q: 'How do I get the first truthy item, not just True/False?',
      a: 'next() with a generator — falls through to a default if none matches.',
      code: 'first = next((x for x in items if x), None)',
    },
    {
      q: 'Is any faster than a for-loop?',
      a: 'About the same in pure Python. The win is in readability and the short-circuit — you write intent, not mechanics.',
    },
  ],

  history: [
    { version: '2.5', note: 'any() and all() introduced together.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#any',
    meta:  'any',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the data you are scanning' },
  ],
};