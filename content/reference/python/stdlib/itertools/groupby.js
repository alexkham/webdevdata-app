// content/reference/python/stdlib/itertools/groupby.js

export const meta = {
  slug:        'groupby',
  name:        'itertools.groupby',
  signature:   'itertools.groupby(iterable, key=None)',
  blurb:       'Split an iterable into runs of consecutive items with the same key — sort first, or equal keys end up in separate groups.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'itertools groupby group by key consecutive runs sorted run length encoding group list of dicts python groupby not working unsorted duplicate groups _grouper',
};

export const method = {
  slug:      'groupby',
  name:      'itertools.groupby',
  signature: 'itertools.groupby(iterable, key=None)',
  returns:   { type: 'iterator of (key, group)', desc: 'Pairs of a key and a sub-iterator over the consecutive items that share it.' },

  category:    'itertools function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Not SQL GROUP BY: groupby starts a new group every time the key CHANGES. On sorted input that is one group per key; on unsorted input the same key can appear many times.',

  covers: ['groupby'],

  cheat: {
    commonCall: 'for k, g in groupby(sorted(xs, key=f), key=f): ...',
    returns:    '(key, group-iterator) pairs, one per run',
    replaces:   'loops that compare each item with the previous one',
    watchOut:   'each group is invalidated when you advance to the next one',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null,   desc: 'The items; usually sorted by the same key.' },
    { name: 'key',      type: 'callable', required: false, default: 'None', desc: 'Computes the grouping key for each item. None groups by the item itself.' },
  ],

  modes: [
    {
      id: 'runs',
      label: 'runs',
      blurb: 'Group by the characters themselves: each run of equal neighbours is one group.',
      params: [{ name: 'text', type: 'str', hint: 'some text', input: 'text' }],
      template: "from itertools import groupby\n[(k, ''.join(g)) for k, g in groupby({$text})]",
      cases: [
        { id: 'runs',  label: 'runs',      values: { text: 'aaabbbcca' } },
        { id: 'mixed', label: 'no repeats', values: { text: 'abc' } },
      ],
    },
    {
      id: 'bylen',
      label: 'unsorted vs sorted',
      blurb: 'Group words by length, first as given, then after sorting by the same key.',
      params: [{ name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' }],
      template: 'from itertools import groupby\nunsorted = [(k, list(g)) for k, g in groupby({$words}, key=len)]\nsorted_first = [(k, list(g)) for k, g in groupby(sorted({$words}, key=len), key=len)]\nunsorted, sorted_first',
      cases: [
        { id: 'words', label: 'words',      values: { words: 'cat, horse, dog, ox, zebra' } },
        { id: 'same',  label: 'all same length', values: { words: 'ant, bee, cow' } },
      ],
    },
    {
      id: 'dict',
      label: 'into a dict',
      blurb: 'Collecting groups into a dict on unsorted input: a later group REPLACES an earlier one with the same key.',
      params: [{ name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' }],
      template: 'from itertools import groupby\n{k: list(g) for k, g in groupby({$words}, key=lambda w: w[0])}',
      cases: [
        { id: 'lost',  label: 'unsorted',   values: { words: 'apple, avocado, banana, apricot' } },
        { id: 'ok',    label: 'sorted',     values: { words: 'apple, apricot, avocado, banana' } },
        { id: 'blank', label: 'empty word', values: { words: 'apple, , banana' } },
      ],
    },
  ],
  demoExplainer: 'In the dict tab, "apricot" starts a second "a" group after "banana", and the dict comprehension overwrites the first one — apple and avocado silently disappear. Sorting by the same key first fixes it. sorted() is stable, so words of equal length keep their original order inside a group. An empty word has no first letter: w[0] raises IndexError.',

  patterns: [
    {
      name: 'Group records by a field',
      desc: 'Sort and group with the SAME key function.',
      code: 'from itertools import groupby\nfrom operator import itemgetter\nby_city = itemgetter("city")\nfor city, people in groupby(sorted(rows, key=by_city), key=by_city):\n    print(city, [p["name"] for p in people])',
    },
    {
      name: 'Run-length encoding',
      desc: 'Unsorted input is exactly what you want here: runs of neighbours.',
      code: "from itertools import groupby\nencoded = ''.join(f'{len(list(g))}{ch}' for ch, g in groupby(text))",
    },
    {
      name: 'Unsorted input → defaultdict instead',
      desc: 'When sorting is not wanted, collect into a dict of lists in one pass.',
      code: 'from collections import defaultdict\ngroups = defaultdict(list)\nfor row in rows:\n    groups[row["city"]].append(row)',
    },
  ],

  examples: [
    { title: 'Runs of equal items',      code: "from itertools import groupby\n[(k, len(list(g))) for k, g in groupby('aaabcc')]", returns: "[('a', 3), ('b', 1), ('c', 2)]" },
    { title: 'Remove consecutive duplicates', code: 'from itertools import groupby\n[k for k, _ in groupby([1, 1, 2, 2, 2, 1])]',  returns: '[1, 2, 1]' },
    { title: 'With a key function',      code: 'from itertools import groupby\n[(k, list(g)) for k, g in groupby([1, 3, 2, 4, 5], key=lambda n: n % 2)]', returns: '[(1, [1, 3]), (0, [2, 4]), (1, [5])]' },
    { title: 'Sort first for one group per key', code: "from itertools import groupby\nwords = ['bob', 'al', 'cy', 'dan']\n[(k, list(g)) for k, g in groupby(sorted(words, key=len), key=len)]", returns: "[(2, ['al', 'cy']), (3, ['bob', 'dan'])]" },
    { title: 'Groups are one-shot sub-iterators', code: "from itertools import groupby\ngroups = [g for k, g in groupby('aabb')]\n[list(g) for g in groups]", returns: '[[], []]' },
    { title: 'Run-length encoding',      code: "from itertools import groupby\n''.join(f'{len(list(g))}{ch}' for ch, g in groupby('WWWBBW'))", returns: "'3W2B1W'" },
  ],

  pitfalls: [
    {
      name: 'Grouping unsorted data',
      desc: 'Equal keys that are not adjacent form separate groups.',
      wrong: { label: 'unsorted', code: 'from itertools import groupby\nnums = [1, 2, 1, 2]\n[(k, len(list(g))) for k, g in groupby(nums)]', output: '[(1, 1), (2, 1), (1, 1), (2, 1)]' },
      fix:   { label: 'sorted',   code: 'from itertools import groupby\nnums = [1, 2, 1, 2]\n[(k, len(list(g))) for k, g in groupby(sorted(nums))]', output: '[(1, 2), (2, 2)]' },
    },
    {
      name: 'Keeping the group iterators for later',
      desc: 'A group shares the underlying iterator with groupby. Advancing to the next key empties the previous group — store list(g) immediately.',
      wrong: { label: 'store g',       code: "from itertools import groupby\nd = {k: g for k, g in groupby('aab')}\n{k: list(g) for k, g in d.items()}", output: "{'a': [], 'b': []}" },
      fix:   { label: 'store list(g)', code: "from itertools import groupby\nd = {k: list(g) for k, g in groupby('aab')}\nd", output: "{'a': ['a', 'a'], 'b': ['b']}" },
    },
  ],

  when: {
    use: [
      'Data already sorted (or naturally ordered) by the key — logs by date, rows from ORDER BY',
      'Runs of consecutive equal items: run-length encoding, collapsing duplicates',
      'Streaming: one group in memory at a time',
    ],
    avoid: [
      'Unsorted data where you want every key once → collections.defaultdict(list)',
      'Just counting per key → collections.Counter',
    ],
  },

  notes: {
    cpython:    'groupby_next and _grouper_next in Modules/itertoolsmodule.c; a group yields only while groupby has not moved on (the "currgrouper" check)',
    'Key calls': 'key is called once per item, and keys are compared with == against the current group key',
    'Sorting':  'sort with the same key you group by; sorted() is stable, so ties keep their order',
  },

  related: [
    { name: 'sorted()',            slug: 'sorted',      when: 'Put equal keys next to each other first', category: 'functions' },
    { name: 'collections.defaultdict', slug: 'defaultdict', when: 'Group unsorted data in one pass', category: 'stdlib/collections' },
    { name: 'collections.Counter', slug: 'counter',     when: 'Only the size of each group', category: 'stdlib/collections' },
    { name: 'itertools.batched',   slug: 'batched',     when: 'Fixed-size groups instead of key-based ones' },
    { name: 'itertools module',    slug: 'itertools',   when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does itertools.groupby return the same key more than once?',
      a: 'It groups CONSECUTIVE items only. If equal keys are not adjacent, each run becomes its own group. Sort the data with the same key function first: groupby(sorted(data, key=f), key=f).',
    },
    {
      q: 'Why are my groupby groups empty?',
      a: 'Each group is a view on the shared underlying iterator. Once you advance to the next key (or call list() on the whole groupby), earlier groups are exhausted. Convert each group with list(g) inside the loop.',
    },
    {
      q: 'How do I group a list of dicts by a key in Python?',
      a: 'Either sort and groupby: groupby(sorted(rows, key=itemgetter("k")), key=itemgetter("k")), or collect into collections.defaultdict(list) without sorting — usually simpler when the data is unsorted.',
    },
    {
      q: 'What is the itertools._grouper object I see when printing?',
      a: 'That is the group sub-iterator. Print list(g) to see its items.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.groupby',
    meta:  'itertools.groupby',
  },
};
