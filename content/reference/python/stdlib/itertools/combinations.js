// content/reference/python/stdlib/itertools/combinations.js

export const meta = {
  slug:        'combinations',
  name:        'itertools.combinations',
  signature:   'itertools.combinations(iterable, r)  ·  itertools.combinations_with_replacement(iterable, r)',
  blurb:       'Every way to choose r items where order does not matter — with or without picking the same item twice.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'itertools combinations combinations_with_replacement choose r items n choose k subsets pairs all pairs unordered selections python r must be non-negative multiset',
};

export const method = {
  slug:      'combinations',
  name:      'itertools.combinations',
  signature: 'itertools.combinations(iterable, r)',
  returns:   { type: 'iterator of tuple', desc: 'Tuples of length r, in lexicographic order of the input positions.' },

  category:    'itertools function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'combinations picks r different POSITIONS, keeping input order inside each tuple; combinations_with_replacement may pick the same position again. Neither looks at the values — duplicates in the input give duplicate tuples.',

  covers: ['combinations', 'combinations_with_replacement'],

  cheat: {
    commonCall: "combinations('ABCD', 2)",
    returns:    'AB AC AD BC BD CD (as tuples) — n! / (r! (n-r)!) of them',
    replaces:   'nested loops with j > i',
    watchOut:   'r > len(input) → nothing; r < 0 → ValueError',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'The pool. It is read completely into a tuple when the iterator is created.' },
    { name: 'r',        type: 'int',      required: true, default: null, desc: 'Length of each tuple. Required (unlike permutations). Must be >= 0.' },
  ],

  modes: [
    {
      id: 'comb',
      label: 'combinations',
      blurb: 'Choose r distinct positions; order inside each tuple follows the input.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'r',     type: 'int',       hint: 'tuple length',          input: 'number' },
      ],
      template: 'from itertools import combinations\nlist(combinations({$items}, {$r}))',
      cases: [
        { id: 'pairs', label: '4 choose 2', values: { items: 'A, B, C, D', r: '2' } },
        { id: 'three', label: '4 choose 3', values: { items: 'A, B, C, D', r: '3' } },
        { id: 'dupes', label: 'repeated values', values: { items: 'x, x, y', r: '2' } },
        { id: 'big',   label: 'r > n',      values: { items: 'A, B', r: '3' } },
      ],
    },
    {
      id: 'cwr',
      label: 'with replacement',
      blurb: 'The same position may be chosen again — like picking scoops of ice cream.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'r',     type: 'int',       hint: 'tuple length',          input: 'number' },
      ],
      template: 'from itertools import combinations_with_replacement\nlist(combinations_with_replacement({$items}, {$r}))',
      cases: [
        { id: 'scoops', label: '3 flavours, 2 scoops', values: { items: 'choc, mint, nut', r: '2' } },
        { id: 'big',    label: 'r > n',               values: { items: 'H, T', r: '3' } },
        { id: 'neg',    label: 'r = -1',              values: { items: 'H, T', r: '-1' } },
      ],
    },
    {
      id: 'sums',
      label: 'pairs that sum to',
      blurb: 'A classic use: find every pair of numbers with a given sum.',
      params: [
        { name: 'nums',   type: 'list[int]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'target', type: 'int',       hint: 'target sum',              input: 'number' },
      ],
      template: 'from itertools import combinations\n[pair for pair in combinations({$nums}, 2) if sum(pair) == {$target}]',
      cases: [
        { id: 'ten',  label: 'sum 10', values: { nums: '1, 9, 3, 7, 5, 5', target: '10' } },
        { id: 'none', label: 'no pair', values: { nums: '1, 2', target: '10' } },
      ],
    },
  ],
  demoExplainer: 'The tuples come out in lexicographic order of POSITIONS: first everything that starts with the first item, then the second, and so on. With repeated values ("x, x, y") the two x are different positions, so (\'x\', \'y\') appears twice. With replacement, r may exceed the number of items: two coins give four results for r = 3. A negative r is rejected with "r must be non-negative".',

  patterns: [
    {
      name: 'Every pair once',
      desc: 'Compare each item with each other item without the (b, a) duplicate and without (a, a).',
      code: 'from itertools import combinations\nfor a, b in combinations(players, 2):\n    play_match(a, b)',
    },
    {
      name: 'All subsets (power set)',
      desc: 'Chain combinations of every size, 0 to n.',
      code: 'from itertools import chain, combinations\ndef powerset(items):\n    s = list(items)\n    return chain.from_iterable(combinations(s, r) for r in range(len(s) + 1))',
    },
    {
      name: 'Unique combinations of repeated values',
      desc: 'Deduplicate with a set when the input has equal values.',
      code: 'from itertools import combinations\nunique = sorted(set(combinations(sorted(values), 3)))',
    },
  ],

  examples: [
    { title: '4 choose 2',                code: "from itertools import combinations\n[''.join(c) for c in combinations('ABCD', 2)]", returns: "['AB', 'AC', 'AD', 'BC', 'BD', 'CD']" },
    { title: 'With replacement',          code: "from itertools import combinations_with_replacement\n[''.join(c) for c in combinations_with_replacement('ABC', 2)]", returns: "['AA', 'AB', 'AC', 'BB', 'BC', 'CC']" },
    { title: 'Order follows the input, not the values', code: 'from itertools import combinations\nlist(combinations([3, 1, 2], 2))', returns: '[(3, 1), (3, 2), (1, 2)]' },
    { title: 'r = 0 gives one empty tuple', code: "from itertools import combinations\nlist(combinations('abc', 0))", returns: '[()]' },
    { title: 'r larger than the input',    code: "from itertools import combinations\nlist(combinations('ab', 3))",  returns: '[]' },
    { title: 'Count without listing',      code: 'import math\nmath.comb(52, 5)',                                     returns: '2598960' },
    { title: 'Negative r',                 code: "from itertools import combinations\ncombinations('abc', -1)",     returns: 'ValueError: r must be non-negative' },
  ],

  pitfalls: [
    {
      name: 'Forgetting r',
      desc: 'Unlike permutations, combinations has no default length.',
      wrong: { label: 'no r',  code: "from itertools import combinations\ncombinations('abc')",        output: "TypeError: combinations() missing required argument 'r' (pos 2)" },
      fix:   { label: 'pass r', code: "from itertools import combinations\nlist(combinations('abc', 2))", output: "[('a', 'b'), ('a', 'c'), ('b', 'c')]" },
    },
    {
      name: 'Expecting unique results from repeated values',
      desc: 'Positions are combined, not values: equal items produce equal tuples.',
      wrong: { label: 'duplicates', code: "from itertools import combinations\nlist(combinations('aab', 2))",           output: "[('a', 'a'), ('a', 'b'), ('a', 'b')]" },
      fix:   { label: 'dedupe',     code: "from itertools import combinations\nsorted(set(combinations('aab', 2)))", output: "[('a', 'a'), ('a', 'b')]" },
    },
  ],

  when: {
    use: [
      'Every unordered pair / triple of a small collection',
      'Brute-force search over subsets of a fixed size',
      'Multisets (dice totals, coin counts) with combinations_with_replacement',
    ],
    avoid: [
      'Order matters → permutations',
      'One item from EACH of several lists → product',
      'Only the count → math.comb(n, r)',
    ],
  },

  notes: {
    cpython:     'combinations_next and cwr_next in Modules/itertoolsmodule.c — index arrays, as in the docs\' equivalent code',
    'Counts':    'combinations: n! / (r! (n-r)!) when 0 <= r <= n, else 0. With replacement: (n+r-1)! / (r! (n-1)!) when n > 0',
    'Versions':  'combinations since 2.6; combinations_with_replacement since 3.1 (2.7 on the 2.x line)',
  },

  related: [
    { name: 'itertools.permutations', slug: 'permutations', when: 'Same, but order matters' },
    { name: 'itertools.product',      slug: 'product',      when: 'One from each input, or repeat=' },
    { name: 'set()',                  slug: 'set',          when: 'Deduplicate tuples from repeated values', category: 'functions' },
    { name: 'itertools module',       slug: 'itertools',    when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get all pairs from a list in Python?',
      a: 'list(itertools.combinations(items, 2)) gives each unordered pair once. Use permutations(items, 2) if (a, b) and (b, a) should both appear, or product(items, repeat=2) to include (a, a) as well.',
    },
    {
      q: 'What is the difference between combinations and combinations_with_replacement?',
      a: 'combinations never reuses a position: AB, AC, BC from ABC. combinations_with_replacement may reuse one: AA, AB, AC, BB, BC, CC.',
    },
    {
      q: 'Why does combinations return duplicate tuples?',
      a: 'It combines positions, not values, so repeated values in the input produce equal tuples. Wrap the result in set() — after sorting the input if you want each tuple in a canonical order.',
    },
    {
      q: 'How many combinations will there be?',
      a: 'math.comb(n, r) — for example math.comb(52, 5) is 2598960. Check it before listing: the count grows very fast.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.combinations',
    meta:  'itertools.combinations',
  },
};
