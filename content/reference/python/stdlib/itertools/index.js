// content/reference/python/stdlib/itertools/index.js — the itertools module hub

export const meta = {
  slug:        'index',
  name:        'itertools',
  signature:   'import itertools',
  blurb:       'Lazy building blocks for loops: chain, islice, groupby, product, combinations, permutations, accumulate, batched, pairwise and more.',
  category:    'functional',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'itertools module python iterator tools lazy iteration chain islice groupby product combinations permutations accumulate batched pairwise zip_longest count cycle repeat tee starmap compress takewhile dropwhile filterfalse cartesian product flatten chunk sliding window',
};

export const method = {
  slug: 'index',
  name: 'itertools',

  category:    'Iterators & containers',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Twenty iterator builders written in C. Each one returns a lazy iterator, not a list — wrap it in list() to see the items, and remember that an iterator can be consumed only once.',

  coverClasses: ['chain'],

  imports: ['from itertools import chain, islice, groupby', 'import itertools'],
  facts: [
    { label: 'Public API', value: 'accumulate, batched, chain, combinations, combinations_with_replacement, compress, count, cycle, dropwhile, filterfalse, groupby, islice, pairwise, permutations, product, repeat, starmap, takewhile, tee, zip_longest' },
    { label: 'Infinite',   value: 'count, cycle, repeat (without times) never stop — bound them with islice, zip or takewhile' },
    { label: 'Combinatoric', value: 'product, permutations, combinations, combinations_with_replacement — results in lexicographic order of the input POSITIONS' },
    { label: 'Speed',      value: 'All implemented in C (Modules/itertoolsmodule.c); the docs show a roughly equivalent pure-Python version of each' },
  ],

  modes: [
    {
      id: 'rle',
      label: 'groupby',
      blurb: 'Run-length encoding: groupby collects runs of equal neighbours, so each run becomes (character, length).',
      params: [{ name: 'text', type: 'str', hint: 'some text', input: 'text' }],
      template: 'from itertools import groupby\n[(ch, len(list(run))) for ch, run in groupby({$text})]',
      cases: [
        { id: 'aaa',    label: 'runs',         values: { text: 'aaabccdddd' } },
        { id: 'mixed',  label: 'not sorted',   values: { text: 'abab' } },
        { id: 'empty',  label: 'empty string', values: { text: '' } },
      ],
    },
    {
      id: 'combos',
      label: 'combinations',
      blurb: 'Every way to choose r items, ignoring order. The count grows fast: n choose r.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'r',     type: 'int',       hint: 'how many to choose',     input: 'number' },
      ],
      template: 'from itertools import combinations\nlist(combinations({$items}, {$r}))',
      cases: [
        { id: 'pairs', label: 'pairs of 4', values: { items: 'a, b, c, d', r: '2' } },
        { id: 'zero',  label: 'r = 0',      values: { items: 'a, b, c', r: '0' } },
        { id: 'big',   label: 'r too big',  values: { items: 'a, b', r: '3' } },
        { id: 'neg',   label: 'r = -1',     values: { items: 'a, b', r: '-1' } },
      ],
    },
    {
      id: 'cycle',
      label: 'cycle + islice',
      blurb: 'cycle repeats forever; islice takes the first n items, which is what makes an infinite iterator usable.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'how many to take',      input: 'number' },
      ],
      template: 'from itertools import cycle, islice\nlist(islice(cycle({$items}), {$n}))',
      cases: [
        { id: 'rr',    label: 'round robin', values: { items: 'red, green, blue', n: '7' } },
        { id: 'empty', label: 'empty input', values: { items: '', n: '5' } },
        { id: 'neg',   label: 'n = -1',      values: { items: 'x', n: '-1' } },
      ],
    },
  ],
  demoExplainer: 'groupby only merges NEIGHBOURS: "abab" gives four runs of length 1, not two groups of two — sort first when you want one group per key. combinations returns nothing at all when r is larger than the input, and a negative r is a ValueError. cycle over an empty input stops immediately instead of looping forever, and islice rejects a negative stop with "Stop argument for islice() must be None or an integer: 0 <= x <= sys.maxsize."',

  patterns: [
    {
      name: 'Flatten one level',
      desc: 'chain.from_iterable joins a list of lists without building intermediate lists.',
      code: 'from itertools import chain\nflat = list(chain.from_iterable(rows))',
    },
    {
      name: 'Chunk a long iterable',
      desc: 'batched (3.12+) yields tuples of n items; the last one may be shorter.',
      code: 'from itertools import batched\nfor chunk in batched(records, 500):\n    db.insert_many(chunk)',
    },
    {
      name: 'Group sorted records',
      desc: 'Sort by the same key you group by — groupby only merges consecutive items.',
      code: 'from itertools import groupby\nfrom operator import itemgetter\nrows.sort(key=itemgetter("city"))\nfor city, group in groupby(rows, key=itemgetter("city")):\n    print(city, len(list(group)))',
    },
    {
      name: 'Nested loops as one loop',
      desc: 'product replaces nested for statements over independent ranges.',
      code: 'from itertools import product\nfor x, y in product(range(width), range(height)):\n    grid[x][y] = 0',
    },
  ],

  examples: [
    { title: 'Iterators are lazy',          code: "from itertools import chain\nchain('ab', 'cd').__class__.__name__", returns: "'chain'" },
    { title: 'Materialise with list()',     code: "from itertools import chain\nlist(chain('ab', 'cd'))", returns: "['a', 'b', 'c', 'd']" },
    { title: 'Running totals',              code: 'from itertools import accumulate\nlist(accumulate([3, 1, 4, 1, 5]))', returns: '[3, 4, 8, 9, 14]' },
    { title: 'Cartesian product',           code: "from itertools import product\nlist(product('ab', [0, 1]))", returns: "[('a', 0), ('a', 1), ('b', 0), ('b', 1)]" },
    { title: 'Consecutive pairs',           code: 'from itertools import pairwise\nlist(pairwise([1, 4, 9, 16]))', returns: '[(1, 4), (4, 9), (9, 16)]' },
    { title: 'First n of an infinite count', code: 'from itertools import count, islice\nlist(islice(count(10, 5), 4))', returns: '[10, 15, 20, 25]' },
    { title: 'Chunks of 3',                 code: 'from itertools import batched\nlist(batched(range(7), 3))', returns: '[(0, 1, 2), (3, 4, 5), (6,)]' },
  ],

  pitfalls: [
    {
      name: 'Reading an iterator twice',
      desc: 'Every itertools result is a one-shot iterator. The second pass finds it already exhausted and silently yields nothing.',
      wrong: { label: 'two passes', code: "from itertools import chain\nletters = chain('ab', 'cd')\nfirst = list(letters)\nsecond = list(letters)\nsecond", output: '[]' },
      fix:   { label: 'store a list', code: "from itertools import chain\nletters = list(chain('ab', 'cd'))\nfirst = list(letters)\nsecond = list(letters)\nsecond", output: "['a', 'b', 'c', 'd']" },
    },
    {
      name: 'groupby on unsorted data',
      desc: 'groupby starts a new group every time the key changes, so equal keys that are not adjacent end up in separate groups.',
      wrong: { label: 'unsorted', code: "from itertools import groupby\nwords = ['apple', 'bean', 'avocado']\n[(k, list(g)) for k, g in groupby(words, key=lambda w: w[0])]", output: "[('a', ['apple']), ('b', ['bean']), ('a', ['avocado'])]" },
      fix:   { label: 'sorted first', code: "from itertools import groupby\nwords = ['apple', 'bean', 'avocado']\n[(k, list(g)) for k, g in groupby(sorted(words), key=lambda w: w[0])]", output: "[('a', ['apple', 'avocado']), ('b', ['bean'])]" },
    },
  ],

  when: {
    use: [
      'Streaming over large or infinite data without building lists',
      'Replacing nested loops and index arithmetic (product, pairwise, islice)',
      'Combinatorics: every pair, ordering or selection of a small input',
    ],
    avoid: [
      'Random access or len() — iterators have neither; use a list',
      'Counting combinations without listing them → math.comb / math.perm',
      'Grouping unsorted data into a dict → collections.defaultdict(list)',
    ],
  },

  notes: {
    cpython:       'Modules/itertoolsmodule.c — every tool is a C type; the docs give a "roughly equivalent" Python version of each',
    'Laziness':    'Nothing is computed until you iterate; arguments are checked when the iterator is created',
    'Recipes':     'The docs end with a recipes section (sliding_window, roundrobin, partition, unique_everseen …); the more-itertools package on PyPI ships them ready-made',
  },

  related: [
    { name: 'collections', slug: 'collections', when: 'Containers that pair well: deque, Counter, defaultdict', category: 'stdlib' },
    { name: 'functools',   slug: 'functools',   when: 'reduce, partial and caching for functional code', category: 'stdlib' },
    { name: 'zip()',       slug: 'zip',         when: 'Stops at the shortest input — zip_longest pads instead', category: 'functions' },
    { name: 'enumerate()', slug: 'enumerate',   when: 'count() paired with items, built in', category: 'functions' },
    { name: 'iter()',      slug: 'iter',        when: 'What every itertools function calls on its input', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does printing an itertools result show <itertools.chain object at 0x...>?',
      a: 'The functions return lazy iterators, not lists. Wrap the result in list() (or loop over it) to see the items. Infinite ones such as count() or cycle() must be cut with islice() first.',
    },
    {
      q: 'Why is my itertools iterator empty the second time?',
      a: 'Iterators are consumed as you read them. After one full pass there is nothing left. Store list(...) if you need the items more than once, or use tee() for parallel passes.',
    },
    {
      q: 'What is the difference between product, permutations and combinations?',
      a: 'product is every tuple taking one item from each input (with repeats allowed); permutations is every ordering of r distinct positions; combinations is every selection of r positions ignoring order. For 3 items and r = 2 that is 9, 6 and 3 results.',
    },
    {
      q: 'How do I split a list into chunks in Python?',
      a: 'On Python 3.12+ use itertools.batched(items, n), which yields tuples of n items with a shorter last one. Before 3.12, the classic recipe is zip(*[iter(items)] * n), which drops an incomplete last chunk.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html',
    meta:  'itertools — Functions creating iterators for efficient looping',
  },
};
