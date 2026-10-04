// content/reference/python/stdlib/functools/cmp_to_key.js

export const meta = {
  slug:        'cmp_to_key',
  name:        'functools.cmp_to_key',
  signature:   'functools.cmp_to_key(func)',
  blurb:       'Turn an old-style comparison function (negative / zero / positive) into a key= function for sorted(), min(), max() and friends.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'functools cmp_to_key comparison function sort with cmp python 3 sorted cmp argument custom sort order comparator KeyWrapper sort by two keys',
};

export const method = {
  slug:      'cmp_to_key',
  name:      'functools.cmp_to_key',
  signature: 'functools.cmp_to_key(func)',
  returns:   { type: 'callable', desc: 'A key function; each key it builds is a KeyWrapper object whose comparisons call func.' },

  category:    'functools function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Python 3 removed the cmp= argument of sort. When an ordering is easier to express as "compare a with b" than as a key, cmp_to_key bridges the gap.',

  covers: ['cmp_to_key'],

  cheat: {
    commonCall: 'sorted(items, key=cmp_to_key(compare))',
    returns:    'the items in the order compare defines',
    replaces:   "Python 2's sorted(items, cmp=compare)",
    watchOut:   'compare must return a number (< 0, 0, > 0), not a bool',
  },

  parameters: [
    { name: 'func', type: 'callable', required: true, default: null, desc: 'func(a, b) → negative if a sorts first, 0 if equal, positive if b sorts first.' },
  ],

  modes: [
    {
      id: 'sort',
      label: 'length, then A–Z',
      blurb: 'A comparator with a tie-break: shorter words first, equal lengths alphabetically.',
      params: [{ name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' }],
      template: 'from functools import cmp_to_key\ndef compare(a, b):\n    if len(a) != len(b):\n        return len(a) - len(b)\n    return (a > b) - (a < b)\nsorted({$words}, key=cmp_to_key(compare))',
      cases: [
        { id: 'fruit', label: 'fruit', values: { words: 'pear, fig, apple, kiwi, date' } },
        { id: 'case',  label: 'upper case first', values: { words: 'bob, Bob, al, Al' } },
      ],
    },
    {
      id: 'desc',
      label: 'descending numbers',
      blurb: 'b - a sorts from largest to smallest.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'from functools import cmp_to_key\nsorted({$nums}, key=cmp_to_key(lambda a, b: b - a))',
      cases: [
        { id: 'mixed', label: 'ints and floats', values: { nums: '3, 1.5, 10, -2, 3' } },
        { id: 'empty', label: 'empty', values: { nums: '' } },
      ],
    },
  ],
  demoExplainer: '(a > b) - (a < b) is the Python 3 spelling of the old cmp(a, b): True and False subtract as 1 and 0. Strings compare by code point, so upper-case letters sort before lower-case ones. sorted() only ever asks "is a less than b?", which KeyWrapper answers with compare(a, b) < 0 — and the sort is stable, so equal items keep their input order.',

  patterns: [
    {
      name: 'Largest number from digits',
      desc: 'An order that is hard to express as a key: compare concatenations.',
      code: 'from functools import cmp_to_key\ndef by_concat(a, b):\n    return (b + a > a + b) - (b + a < a + b)\nlargest = "".join(sorted(map(str, nums), key=cmp_to_key(by_concat)))',
    },
    {
      name: 'Locale-aware sorting',
      desc: 'The docs example: locale.strcoll is a comparison function.',
      code: 'import locale\nfrom functools import cmp_to_key\nnames.sort(key=cmp_to_key(locale.strcoll))',
    },
    {
      name: 'Prefer a tuple key when possible',
      desc: 'Most multi-criteria orders are simpler as a key.',
      code: 'words.sort(key=lambda w: (len(w), w))',
    },
  ],

  examples: [
    { title: 'Descending with a comparator', code: 'from functools import cmp_to_key\nsorted([3, 1, 2], key=cmp_to_key(lambda a, b: b - a))', returns: '[3, 2, 1]' },
    { title: 'Same as a tuple key',          code: "from functools import cmp_to_key\nwords = ['bb', 'a', 'ab', 'c']\ndef cmp(a, b):\n    return (len(a) - len(b)) or ((a > b) - (a < b))\nsorted(words, key=cmp_to_key(cmp)) == sorted(words, key=lambda w: (len(w), w))", returns: 'True' },
    { title: 'Works with max() and min()',   code: "from functools import cmp_to_key\nmax(['10', '9', '100'], key=cmp_to_key(lambda a, b: int(a) - int(b)))", returns: "'100'" },
    { title: 'Largest concatenation',        code: "from functools import cmp_to_key\ndef by_concat(a, b):\n    return (b + a > a + b) - (b + a < a + b)\n''.join(sorted(['3', '30', '34', '5', '9'], key=cmp_to_key(by_concat)))", returns: "'9534330'" },
    { title: 'The key is a KeyWrapper',      code: 'from functools import cmp_to_key\ntype(cmp_to_key(lambda a, b: 0)(1)).__name__', returns: "'KeyWrapper'" },
  ],

  pitfalls: [
    {
      name: 'Passing the comparator as key',
      desc: 'key= functions take ONE argument. A two-argument comparator fails on the first call.',
      wrong: { label: 'key=compare', code: 'def compare(a, b):\n    return a - b\nsorted([3, 1, 2], key=compare)', output: "TypeError: compare() missing 1 required positional argument: 'b'" },
      fix:   { label: 'cmp_to_key',  code: 'from functools import cmp_to_key\ndef compare(a, b):\n    return a - b\nsorted([3, 1, 2], key=cmp_to_key(compare))', output: '[1, 2, 3]' },
    },
    {
      name: 'Returning a bool',
      desc: 'a < b is True (1) or False (0) — never negative, so nothing ever sorts as "less" and the input order survives.',
      wrong: { label: 'return a < b', code: 'from functools import cmp_to_key\nsorted([3, 1, 2], key=cmp_to_key(lambda a, b: a < b))', output: '[3, 1, 2]' },
      fix:   { label: 'return -1/0/1', code: 'from functools import cmp_to_key\nsorted([3, 1, 2], key=cmp_to_key(lambda a, b: (a > b) - (a < b)))', output: '[1, 2, 3]' },
    },
  ],

  when: {
    use: [
      'Orders defined by comparing two items (concatenation order, partial rules, ports of C or Java comparators)',
      'Existing comparison functions such as locale.strcoll',
    ],
    avoid: [
      'Anything a key can express → key=lambda x: (…) is simpler and faster',
      'Inconsistent comparators — the result is then undefined',
    ],
  },

  notes: {
    cpython:     'C implementation in Modules/_functoolsmodule.c (functools.KeyWrapper); Lib/functools.py has the equivalent K class',
    'Calls':     'Each comparison during the sort calls func once — more Python calls than a key function, which is called once per item',
    'Versions':  'Added in 3.2 (and 2.7) to ease porting from cmp= sorting',
  },

  related: [
    { name: 'sorted()',                 slug: 'sorted',         when: 'Where the key is used', category: 'functions' },
    { name: 'list.sort()',              slug: 'list-sort',      when: 'In-place version', category: 'functions' },
    { name: 'functools.total_ordering', slug: 'total_ordering', when: 'Make your own class sortable instead' },
    { name: 'functools module',         slug: 'functools',      when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I sort with a custom comparison function in Python 3?',
      a: 'Wrap it: sorted(items, key=functools.cmp_to_key(compare)), where compare(a, b) returns a negative number, zero or a positive number.',
    },
    {
      q: 'Why was the cmp argument removed from sort?',
      a: 'A key function is called once per item while a comparator is called for every comparison, and keys cover almost every real use. cmp_to_key exists for the remaining cases.',
    },
    {
      q: 'How do I write cmp(a, b) in Python 3?',
      a: 'The built-in cmp() is gone. Use (a > b) - (a < b), which gives -1, 0 or 1.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.cmp_to_key',
    meta:  'functools.cmp_to_key',
  },
};
