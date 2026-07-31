// content/reference/python/functions/sorted.js

export const meta = {
  slug:        'sorted',
  name:        'sorted',
  signature:   'sorted(iterable, key=None, reverse=False)',
  blurb:       'Return a new sorted list from any iterable.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'sorted sort order ascending descending key reverse',
};

export const method = {
  slug:      'sorted',
  name:      'sorted',
  signature: 'sorted(iterable, key=None, reverse=False)',
  returns:   { type: 'list', desc: 'A NEW sorted list. The input iterable is never modified — unlike list.sort().' },

  category:    'Built-in function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Return a new sorted list from any iterable — the input stays untouched.',

  cheat: {
    commonCall: 'sorted(names)',
    returns:    'always a NEW list, whatever iterable went in',
    replaces:   'list.sort() sorts in place and returns None; sorted never mutates',
    watchOut:   'mixed incomparable types (int vs str) raise TypeError',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null,    desc: 'Anything iterable: list, tuple, string, dict (its keys), generator.' },
    { name: 'key',      type: 'callable', required: false, default: 'None',  desc: 'One-argument function computing the sort key per item, e.g. key=len or key=str.lower.' },
    { name: 'reverse',  type: 'bool',     required: false, default: 'False', desc: 'True sorts descending.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'default', label: 'default',      values: { items: 'banana,apple,cherry' } },
    { id: 'strings', label: 'digit strings', values: { items: '10,2,1' } },
    { id: 'mixedcase', label: 'mixed case', values: { items: 'b,A,c,B' } },
    { id: 'empty',   label: 'empty',        values: { items: '' } },
  ],
  demoExplainer: 'The demo’s comma-separated items are strings, so they sort lexicographically — exactly why ’10’ comes before ’2’, and uppercase before lowercase (code-point order). Convert to numbers, or pass key=int / key=str.lower, when that is not what you want.',

  patterns: [
    {
      name: 'Sort by a computed key',
      desc: 'The key function runs once per item.',
      code: 'sorted(words, key=len)\nsorted(users, key=lambda u: u.age)',
    },
    {
      name: 'Case-insensitive sort',
      desc: 'Lowercase as the key, original strings in the result.',
      code: 'sorted(names, key=str.lower)',
    },
    {
      name: 'Sort a dict by value',
      desc: 'Sort the items, then rebuild.',
      code: 'dict(sorted(d.items(), key=lambda kv: kv[1], reverse=True))',
    },
    {
      name: 'Numeric sort of digit strings',
      desc: 'key=int fixes the classic ’10 before 2” problem.',
      code: 'sorted(["10", "2", "1"], key=int)\n# [\'1\', \'2\', \'10\']',
    },
  ],

  examples: [
    { title: 'Sort strings',                    code: 'sorted(["b", "a", "c"])',      returns: "['a', 'b', 'c']" },
    { title: 'Digit strings sort as text',      code: 'sorted(["10", "2", "1"])',     returns: "['1', '10', '2']" },
    { title: 'Descending',                      code: 'sorted([3, 1, 2], reverse=True)', returns: '[3, 2, 1]' },
    { title: 'Any iterable in, list out',       code: 'sorted("cab")',                returns: "['a', 'b', 'c']" },
  ],

  pitfalls: [
    {
      name: 'Digit strings sort lexicographically',
      desc: 'Strings compare character by character — "10" < "2" because "1" < "2".',
      wrong: { label: 'Surprising', code: 'sorted(["10", "2", "1"])', output: "['1', '10', '2']" },
      fix:   { label: 'Fix', code: 'sorted(["10", "2", "1"], key=int)', output: "['1', '2', '10']" },
    },
    {
      name: 'sorted vs list.sort confusion',
      desc: 'list.sort() returns None — assigning it loses the list.',
      wrong: { label: 'Wrong', code: 'lst = lst.sort()', output: 'lst is None' },
      fix:   { label: 'Fix', code: 'lst = sorted(lst)  # or: lst.sort()', output: 'sorted list' },
    },
    {
      name: 'Uppercase sorts before lowercase',
      desc: 'Default order is by Unicode code point: all A–Z precede a–z.',
      wrong: { label: 'Surprising', code: 'sorted(["b", "A"])', output: "['A', 'b']" },
      fix:   { label: 'Fix', code: 'sorted(["b", "A"], key=str.lower)', output: "['A', 'b'] — case-insensitive" },
    },
    {
      name: 'Mixed types raise',
      desc: 'Python 3 refuses to compare unrelated types.',
      wrong: { label: 'Raises', code: 'sorted([3, "1", 2])', output: "TypeError: '<' not supported between instances of 'str' and 'int'" },
      fix:   { label: 'Normalize first', code: 'sorted([3, "1", 2], key=int)', output: "['1', 2, 3]" },
    },
  ],

  when: {
    use: [
      'You need the original order preserved elsewhere',
      'Sorting non-list iterables (tuples, generators, dict items)',
      'Chaining: sorted(...) feeds the next expression directly',
    ],
    avoid: [
      'Huge list, original order not needed → list.sort() (saves a copy)',
      'Only the top-k items → heapq.nlargest / nsmallest',
      'Repeatedly inserting into sorted order → bisect.insort',
    ],
  },

  notes: {
    complexity: 'O(n log n) — Timsort; O(n) on already-sorted runs',
    return:     'always a new list; stable sort (equal items keep order)',
    cpython:    'Python/bltinmodule.c :: builtin_sorted',
    memory:     'O(n) for the new list',
    threadSafe: 'Yes for the copy; the source should not mutate concurrently',
  },

  related: [
    { name: 'list.pop',   slug: 'list-pop',   when: 'Consume items after ordering' },
    { name: 'list.count', slug: 'list-count', when: 'Frequencies instead of order' },
    { name: 'len',        slug: 'len',        when: 'Size before sorting' },
  ],

  faq: [
    {
      q: 'What is the difference between sorted() and list.sort()?',
      a: 'sorted works on any iterable and returns a new list; list.sort exists only on lists, sorts in place, and returns None. Same algorithm, same key/reverse options.',
    },
    {
      q: 'Is Python’s sort stable?',
      a: 'Yes — items that compare equal keep their original relative order. That makes multi-pass sorting by several keys work.',
    },
    {
      q: 'How do I sort by two criteria?',
      a: 'Return a tuple from the key function; tuples compare field by field.',
      code: 'sorted(files, key=lambda f: (f.ext, f.name))',
    },
    {
      q: 'How do I sort descending by one key and ascending by another?',
      a: 'Sort twice, most-significant key last — stability preserves the first pass. Or negate numeric keys.',
    },
  ],

  history: [
    { version: '3.0', note: 'The cmp parameter removed — key functions only.' },
    { version: '2.4', note: 'sorted() introduced.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#sorted',
    meta:  'sorted',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Sort keys in JSON output' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
