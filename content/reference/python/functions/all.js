// content/reference/python/functions/all.js

export const meta = {
  slug:        'all',
  name:        'all',
  signature:   'all(iterable)',
  blurb:       'True if every item is truthy — stops at the first falsy.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'all every truthy boolean iterable short-circuit and universal check',
};

export const method = {
  slug:      'all',
  name:      'all',
  signature: 'all(iterable)',
  returns:   { type: 'bool', desc: 'True if every item is truthy OR the iterable is empty. False as soon as one falsy item is seen.' },

  category:    'Built-in function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Short-circuit \"is every item truthy?\" over any iterable. Empty is True by convention.',

  cheat: {
    commonCall: 'if all(x.is_valid for x in rows):',
    returns:    'True or False',
    replaces:   'the multi-line for-loop-with-flag pattern',
    watchOut:   'empty iterable → True (vacuously)',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable — list, tuple, generator, set, dict (keys), file lines. Items are evaluated for truthiness the same way `if item:` does.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'all-true',  label: 'all truthy',   values: { items: '1,2,3' } },
    { id: 'one-falsy', label: 'one falsy',    values: { items: '1,0,3' } },
    { id: 'all-falsy', label: 'all falsy',    values: { items: '0,,0' } },
    { id: 'empty',     label: 'empty',        values: { items: '' } },
    { id: 'strings',   label: 'mixed strings',values: { items: 'hello,,world' } },
  ],
  demoExplainer: 'all walks the iterable and stops the moment it sees a falsy item — a generator input would not be consumed past that point. Empty iterables return True by convention: there is no falsy item, so \"are all truthy?\" is vacuously true. Falsy values in Python: 0, 0.0, "", [], {}, None, False.',

  patterns: [
    {
      name: 'Validate every row',
      desc: 'Generator expression + all — reads like the English question.',
      code: 'if all(row.is_valid for row in rows):\n    commit()',
    },
    {
      name: 'All match a predicate',
      desc: 'One all call replaces a for-loop with a flag.',
      code: 'is_sorted = all(a <= b for a, b in zip(xs, xs[1:]))',
    },
    {
      name: 'Guard: all keys present',
      desc: 'Confirm a dict has every required key before proceeding.',
      code: 'if all(k in data for k in required):\n    process(data)',
    },
  ],

  examples: [
    { title: 'All truthy',                code: 'all([1, 2, 3])',                 returns: 'True' },
    { title: 'One falsy loses',           code: 'all([1, 0, 3])',                 returns: 'False' },
    { title: 'Empty is True',             code: 'all([])',                        returns: 'True' },
    { title: 'Generator + short-circuit', code: 'all(x > 0 for x in nums)',     returns: 'True or False; stops at first non-positive' },
  ],

  pitfalls: [
    {
      name: 'all([]) is True, not False',
      desc: 'The empty case flips the intuitive answer. Python follows math: \"every element of the empty set satisfies X\" is vacuously true. Mirrors any([]) which is False for the same reason.',
      wrong: { label: 'Wrong expectation', code: 'if all([]):\n    print("truthy")\nelse:\n    print("falsy")', output: 'truthy' },
      fix:   { label: 'Guard for empty',   code: 'if items and all(items):\n    ...', output: 'explicit intent' },
    },
    {
      name: 'Falsy is not the same as False',
      desc: 'all treats 0, "", None and [] as falsy — not just literal False. Silent failures if you meant \"all values are True\" strictly.',
      wrong: { label: 'Surprising False', code: 'all([True, 1, ""])', output: 'False  # empty string is falsy' },
      fix:   { label: 'Explicit equality', code: 'all(x is True for x in items)', output: 'only literal True passes' },
    },
    {
      name: 'all on a generator consumes it',
      desc: 'After a falsy hit, the generator is partially consumed — subsequent iteration skips what was already checked.',
      wrong: { label: 'Half-consumed', code: 'g = (x for x in [1, 0, 5])\nall(g)     # False (stops at 0)\nlist(g)    # [5] — 1 and 0 are gone', output: '[5]' },
      fix:   { label: 'Materialize first', code: 'items = [x for x in source]\nall(items)\nlist(items)', output: 'full list preserved' },
    },
  ],

  when: {
    use: [
      '\"Do all items satisfy X?\"',
      'Validation over rows, records, batch items',
      'Short-circuit checks on large or generated iterables',
    ],
    avoid: [
      '\"Does at least one satisfy X?\" → any',
      'Counting matches → sum(cond for x in xs)',
      'Strict \"every value equals True\" → `all(x is True for x in xs)`',
    ],
  },

  notes: {
    complexity: 'O(k) where k is the position of the first falsy item; O(n) worst case',
    return:     'bool — always True or False, never the item itself',
    cpython:    'Python/bltinmodule.c :: builtin_all — thin loop over the iterator with early exit',
    memory:     'O(1) — no buffering',
    threadSafe: 'The scan is safe; the source should not mutate concurrently',
  },

  related: [
    { name: 'any',       slug: 'any',       when: '\"Does at least one item satisfy X?\"' },
    { name: 'sum',       slug: 'sum',       when: 'Count matches instead of a yes/no' },
    { name: 'enumerate', slug: 'enumerate', when: 'You also want the index of the first failure' },
  ],

  faq: [
    {
      q: 'Why does all([]) return True?',
      a: 'It matches the universal quantifier: \"for every x in [], x is truthy\" — trivially true, because there is no x that could disprove it. any([]) is False by the mirror convention.',
    },
    {
      q: 'How do I find WHICH item failed?',
      a: 'next() with a generator gives you the first falsy item, or a default when everything passes.',
      code: 'first_bad = next((x for x in items if not x), None)',
    },
    {
      q: 'Is all faster than a loop with a flag?',
      a: 'About the same. The win is readability and the built-in short-circuit — no manual break needed.',
    },
  ],

  history: [
    { version: '2.5', note: 'any() and all() introduced together.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#all',
    meta:  'all',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the data you are validating' },
  ],
};
