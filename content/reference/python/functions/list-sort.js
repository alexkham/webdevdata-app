// content/reference/python/functions/list-sort.js
//
// Slug is type-prefixed: `sort` is a list method (contrast the sorted builtin).

export const meta = {
  slug:        'list-sort',
  name:        'list.sort',
  signature:   'list.sort(*, key=None, reverse=False)',
  blurb:       'Sort the list IN PLACE — returns None, not the list.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'sort in-place mutate order list timsort stable ascending descending reverse',
};

export const method = {
  slug:      'list-sort',
  name:      'list.sort',
  signature: 'list.sort(*, key=None, reverse=False)',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the list state after sorting.' },

  category:    'List method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Reorder the list in place using Python\'s stable Timsort. Returns None on purpose — the API pushes you toward `sorted()` when you want a new list.',

  cheat: {
    commonCall: 'items.sort()',
    returns:    'None — the list itself is reordered',
    replaces:   'building a sorted copy when the original is disposable',
    watchOut:   'the classic bug: `xs = xs.sort()` sets xs to None',
  },

  parameters: [
    { name: 'key',     type: 'callable', required: false, default: 'None',  desc: 'Function of one argument used to extract a comparison key from each item. Keyword-only.' },
    { name: 'reverse', type: 'bool', required: false, default: 'False', desc: 'Keyword-only: True sorts descending.' },
  ],

  demoParams: [
    { name: 'items',   type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'asc',       label: 'ascending',    values: { items: 'banana,apple,cherry', reverse: '' } },
    { id: 'numbers',   label: 'numbers',      values: { items: '3,1,4,1,5,9,2,6',     reverse: '' } },
    { id: 'mixed-case',label: 'case matters', values: { items: 'apple,Banana,cherry', reverse: '' } },
    { id: 'already',   label: 'already sorted', values: { items: '1,2,3,4,5',         reverse: '' } },
    { id: 'empty',     label: 'empty',        values: { items: '',                    reverse: '' } },
  ],
  demoExplainer: 'The demo shows the LIST STATE after sorting. Python actually returns None; the meaningful effect is mutation. Sort is stable — equal items keep their original relative order. The demo input arrives as strings, so numeric cases sort lexicographically ("10" < "2") unless you convert first — a classic footgun documented in the pitfalls.',

  patterns: [
    {
      name: 'Sort by an attribute',
      desc: 'The key= parameter lets you sort by any extraction — attribute, index, method result.',
      code: 'people.sort(key=lambda p: p.age)',
    },
    {
      name: 'Multi-key sort',
      desc: 'Tuples compare lexicographically — first key wins, ties broken by the next.',
      code: 'rows.sort(key=lambda r: (r.dept, -r.salary))',
    },
    {
      name: 'Case-insensitive sort',
      desc: 'str.lower as the key ignores case without mutating the strings themselves.',
      code: 'names.sort(key=str.lower)',
    },
  ],

  examples: [
    { title: 'Basic',                code: 'xs = [3, 1, 2]\nxs.sort()\nxs',                      returns: '[1, 2, 3]' },
    { title: 'Reverse',              code: 'xs = [3, 1, 2]\nxs.sort(reverse=True)\nxs',          returns: '[3, 2, 1]' },
    { title: 'With key',             code: 'xs = ["banana", "kiwi"]\nxs.sort(key=len)\nxs',      returns: '["kiwi", "banana"]' },
    { title: 'Returns None (surprise)',code: '["c","a","b"].sort()',                               returns: 'None' },
    { title: 'Stable — ties keep order', code: 'xs = [("a", 2), ("b", 1), ("a", 1)]\nxs.sort(key=lambda t: t[0])\nxs', returns: '[("a", 2), ("a", 1), ("b", 1)]' },
  ],

  pitfalls: [
    {
      name: 'The `xs = xs.sort()` bug',
      desc: 'sort() returns None. Assigning its result back sets your variable to None — and the original list is now unreachable through xs. Probably Python\'s most-copied Stack Overflow mistake.',
      wrong: { label: 'Now xs is None', code: 'xs = [3, 1, 2]\nxs = xs.sort()\nprint(xs)', output: 'None' },
      fix:   { label: 'Two options',    code: 'xs.sort()          # mutate, keep name\n# or\nxs = sorted(xs)     # new list, replace name', output: '[1, 2, 3]' },
    },
    {
      name: 'Can only sort a list — not iterables in general',
      desc: 'sort is a list METHOD. Tuples, sets, dicts, generators, ranges do not have it. Reach for sorted() when you need to order any iterable.',
      wrong: { label: 'AttributeError', code: '(3, 1, 2).sort()', output: "AttributeError: 'tuple' object has no attribute 'sort'" },
      fix:   { label: 'sorted() works', code: 'sorted((3, 1, 2))', output: '[1, 2, 3]' },
    },
    {
      name: 'Strings sort lexicographically',
      desc: 'Sorting numeric strings gives lexical order — "10" comes before "2". Convert to int first if you meant numeric.',
      wrong: { label: 'Lexical order', code: 'xs = ["10", "2", "1"]\nxs.sort()\nxs', output: '["1", "10", "2"]' },
      fix:   { label: 'Numeric key',   code: 'xs = ["10", "2", "1"]\nxs.sort(key=int)\nxs', output: '["1", "2", "10"]' },
    },
    {
      name: 'Mixed types raise TypeError (Python 3)',
      desc: 'Comparing incompatible types is disallowed in Python 3 — sorting a list of mixed types blows up mid-scan.',
      wrong: { label: 'Runtime error', code: 'xs = [1, "a", 2]\nxs.sort()', output: "TypeError: '<' not supported between instances of 'str' and 'int'" },
      fix:   { label: 'Use a key',     code: 'xs.sort(key=str)  # coerce for comparison', output: 'compares as strings' },
    },
  ],

  when: {
    use: [
      'The original list order is not needed — save the allocation',
      'Sorting is followed by more mutations on the same list',
      'Very large lists where duplicating memory would hurt',
    ],
    avoid: [
      'You need to keep the original order → sorted() copy',
      'Sorting an iterable that is not a list → sorted()',
      'One-liner in a chain (sort returns None, breaks the chain)',
      'Concurrent reads of the list while sorting',
    ],
  },

  notes: {
    complexity: 'O(n log n) average and worst-case; O(n) for already-sorted or reverse-sorted input',
    return:     'None; the list is mutated in place',
    cpython:    'Objects/listobject.c :: listsort_impl — Timsort algorithm',
    memory:     'O(n) auxiliary space for the merge (Timsort), but no new list object',
    threadSafe: 'Not safe under concurrent mutation of the same list',
  },

  related: [
    { name: 'sorted',      slug: 'sorted',      when: 'Return a new sorted list, leave the original alone' },
    { name: 'list.reverse',slug: 'list-reverse',when: 'Flip order without comparing — O(n)' },
    { name: 'min',         slug: 'min',         when: 'Only the smallest is needed' },
    { name: 'max',         slug: 'max',         when: 'Only the largest is needed' },
  ],

  faq: [
    {
      q: 'Why does sort() return None instead of the sorted list?',
      a: 'It is a design signal — Python returns None from mutating methods to discourage the misleading `xs = xs.sort()` pattern and to remind callers that a copy would need `sorted()`.',
    },
    {
      q: 'Is sort stable?',
      a: 'Yes. Equal items (by comparison key) keep their original relative order. This lets you sort by multiple criteria in reverse-priority order — sort by tiebreaker first, then by primary key.',
    },
    {
      q: 'What is Timsort?',
      a: 'Python\'s hybrid sort — merges runs of already-ordered data, then merges those runs. Great on real-world \"mostly ordered\" input. Invented for Python; later adopted by Java, Android, and V8.',
    },
    {
      q: 'How do I sort in descending order by a key?',
      a: 'Pass both — key= for the extraction, reverse=True to flip.',
      code: 'people.sort(key=lambda p: p.age, reverse=True)',
    },
  ],

  history: [
    { version: '1.0', note: 'list.sort has been part of the list type since Python 1.0.' },
    { version: '2.4', note: 'Timsort adopted; key= parameter added; sort became stable.' },
    { version: '3.0', note: 'cmp= parameter removed; key= is now the only way to customize comparison.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#list.sort',
    meta:  'list.sort',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the list before and after' },
  ],
};