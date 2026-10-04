// content/reference/python/stdlib/itertools/permutations.js

export const meta = {
  slug:        'permutations',
  name:        'itertools.permutations',
  signature:   'itertools.permutations(iterable, r=None)',
  blurb:       'Every ordering of r items chosen from the input — all arrangements, where (a, b) and (b, a) both count.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'itertools permutations all orderings arrangements anagrams n factorial ordered selections python permutations of a string list r must be non-negative',
};

export const method = {
  slug:      'permutations',
  name:      'itertools.permutations',
  signature: 'itertools.permutations(iterable, r=None)',
  returns:   { type: 'iterator of tuple', desc: 'Tuples of length r (default: the whole input), in lexicographic order of the input positions.' },

  category:    'itertools function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'n items have n! orderings — 10 items already give 3,628,800 tuples. permutations works on positions, so repeated letters give repeated results.',

  covers: ['permutations'],

  cheat: {
    commonCall: "permutations('abc')",
    returns:    "('a','b','c'), ('a','c','b'), … — 6 tuples",
    replaces:   'recursive "swap and recurse" code',
    watchOut:   'grows as n! — check math.perm(n, r) first',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null,   desc: 'The pool; read completely into a tuple when the iterator is created.' },
    { name: 'r',        type: 'int | None', required: false, default: 'None', desc: 'Length of each tuple. None means all items (full-length permutations). r larger than the input gives no results.' },
  ],

  modes: [
    {
      id: 'perm',
      label: 'permutations',
      blurb: 'Orderings of r items. Leave r empty for None (all items).',
      params: [
        { name: 'items', type: 'list[str]',  hint: 'comma-separated items',  input: 'csv' },
        { name: 'r',     type: 'int | None', hint: 'tuple length, or empty', input: 'number-or-none' },
      ],
      template: 'from itertools import permutations\nlist(permutations({$items}, {$r}))',
      cases: [
        { id: 'two',  label: 'r = 2',    values: { items: 'a, b, c', r: '2' } },
        { id: 'all',  label: 'r = None', values: { items: 'a, b, c', r: '' } },
        { id: 'big',  label: 'r > n',    values: { items: 'a, b', r: '3' } },
        { id: 'neg',  label: 'r = -1',   values: { items: 'a, b', r: '-1' } },
      ],
    },
    {
      id: 'anagrams',
      label: 'anagrams',
      blurb: 'Every rearrangement of a word. Repeated letters produce repeated words.',
      params: [{ name: 'word', type: 'str', hint: 'a short word', input: 'text' }],
      template: "from itertools import permutations\n[''.join(p) for p in permutations({$word})]",
      cases: [
        { id: 'cat', label: 'cat', values: { word: 'cat' } },
        { id: 'too', label: 'too (repeated o)', values: { word: 'too' } },
        { id: 'empty', label: 'empty word', values: { word: '' } },
      ],
    },
    {
      id: 'unique',
      label: 'unique anagrams',
      blurb: 'A set removes the duplicates; sorted() makes the output order stable.',
      params: [{ name: 'word', type: 'str', hint: 'a short word', input: 'text' }],
      template: "from itertools import permutations\nsorted({''.join(p) for p in permutations({$word})})",
      cases: [
        { id: 'too',  label: 'too',  values: { word: 'too' } },
        { id: 'noon', label: 'noon', values: { word: 'noon' } },
      ],
    },
  ],
  demoExplainer: 'The order is lexicographic by POSITION: everything starting with the first item comes first. "too" gives 6 words but only 3 distinct ones, because the two o\'s are different positions with equal values. The permutations of an empty word is a single empty tuple — one way to arrange nothing — so the result is [\'\'].',

  patterns: [
    {
      name: 'Brute-force the best order',
      desc: 'Fine for small n (8! = 40320).',
      code: 'from itertools import permutations\nbest = min(permutations(stops), key=route_length)',
    },
    {
      name: 'Ordered pairs without self-pairs',
      desc: 'permutations(xs, 2) = every (a, b) with a and b at different positions.',
      code: 'from itertools import permutations\nfor sender, receiver in permutations(nodes, 2):\n    send(sender, receiver)',
    },
    {
      name: 'Count before generating',
      desc: 'math.perm(n, r) is n! / (n-r)!.',
      code: 'import math\nif math.perm(len(items), r) > 1_000_000:\n    raise ValueError("too many orderings")',
    },
  ],

  examples: [
    { title: 'All orderings of 3 items', code: "from itertools import permutations\n[''.join(p) for p in permutations('abc')]",   returns: "['abc', 'acb', 'bac', 'bca', 'cab', 'cba']" },
    { title: 'Ordered pairs',            code: "from itertools import permutations\n[''.join(p) for p in permutations('abc', 2)]", returns: "['ab', 'ac', 'ba', 'bc', 'ca', 'cb']" },
    { title: 'Positions, not values',    code: "from itertools import permutations\nlist(permutations('aa'))",                    returns: "[('a', 'a'), ('a', 'a')]" },
    { title: 'n! grows fast',            code: 'from itertools import permutations\nsum(1 for _ in permutations(range(8)))',     returns: '40320' },
    { title: 'Count with math.perm',     code: 'import math\nmath.perm(10)',                                                     returns: '3628800' },
    { title: 'A float r is rejected',    code: "from itertools import permutations\npermutations('abc', 1.5)",                  returns: 'TypeError: Expected int as r' },
  ],

  pitfalls: [
    {
      name: 'Permuting the digits of a number',
      desc: 'An int is not iterable. Convert it to a string to permute its digits, then back to int.',
      wrong: { label: 'int',      code: 'from itertools import permutations\nlist(permutations(123))', output: "TypeError: 'int' object is not iterable" },
      fix:   { label: 'str(int)', code: "from itertools import permutations\n[int(''.join(p)) for p in permutations(str(123))]", output: '[123, 132, 213, 231, 312, 321]' },
    },
    {
      name: 'Duplicate results from repeated items',
      desc: 'Equal values at different positions are permuted separately.',
      wrong: { label: 'raw',  code: "from itertools import permutations\nlen(list(permutations('aab')))", output: '6' },
      fix:   { label: 'set()', code: "from itertools import permutations\nlen(set(permutations('aab')))", output: '3' },
    },
  ],

  when: {
    use: [
      'Every ordering of a small collection (scheduling, routing, puzzles)',
      'Ordered pairs of distinct items',
    ],
    avoid: [
      'Order does not matter → combinations',
      'Items may repeat → product(items, repeat=r)',
      'More than about 10 items → a smarter algorithm; n! explodes',
    ],
  },

  notes: {
    cpython:    'permutations_next in Modules/itertoolsmodule.c — the indices/cycles algorithm shown in the docs',
    'Count':    'n! / (n-r)! when 0 <= r <= n, otherwise 0 — math.perm(n, r)',
    'Errors':   'r < 0 → ValueError: r must be non-negative; a non-int r → TypeError: Expected int as r',
  },

  related: [
    { name: 'itertools.combinations', slug: 'combinations', when: 'Order does not matter' },
    { name: 'itertools.product',      slug: 'product',      when: 'Repetition allowed' },
    { name: 'sorted()',               slug: 'sorted',       when: 'Give a set of results a stable order', category: 'functions' },
    { name: 'itertools module',       slug: 'itertools',    when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get all permutations of a string in Python?',
      a: "[''.join(p) for p in itertools.permutations(s)]. Wrap it in set() if the string has repeated letters and you want each arrangement once.",
    },
    {
      q: 'What is the difference between permutations and combinations?',
      a: 'permutations counts (a, b) and (b, a) separately; combinations keeps only the one in input order. For 3 items taken 2 at a time: 6 permutations, 3 combinations.',
    },
    {
      q: 'Why does permutations return duplicates?',
      a: 'It arranges positions, not distinct values. "aab" has two a\'s at different positions, so each arrangement appears twice. Use set() to deduplicate.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.permutations',
    meta:  'itertools.permutations',
  },
};
