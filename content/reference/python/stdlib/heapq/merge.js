// content/reference/python/stdlib/heapq/merge.js

export const meta = {
  slug:        'merge',
  name:        'heapq.merge',
  signature:   'heapq.merge(*iterables, key=None, reverse=False)',
  blurb:       'Lazily merge several already-sorted iterables into one sorted stream — without loading them all into memory.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'heapq merge sorted iterables merge sorted lists k way merge lazy generator combine sorted files python heapq.merge key reverse',
};

export const method = {
  slug:      'merge',
  name:      'heapq.merge',
  signature: 'heapq.merge(*iterables, key=None, reverse=False)',
  returns:   { type: 'generator', desc: 'Yields the items of all inputs in sorted order, one at a time.' },

  category:    'heapq function',
  version:     'Python 2.6+ (key, reverse 3.5+)',
  hasLiveDemo: true,

  subtitle: 'A k-way merge: a small heap holds the current front item of every input, and the smallest is yielded next. The inputs must each be sorted already — merge never checks.',

  covers: ['merge'],

  cheat: {
    commonCall: 'list(heapq.merge(a, b, c))',
    returns:    'a generator — wrap it in list() to see the items',
    replaces:   'sorted(a + b + c) for inputs that are already sorted',
    watchOut:   'Unsorted inputs give unsorted output, silently',
  },

  parameters: [
    { name: '*iterables', type: 'iterables', required: true, default: null, desc: 'Any number of iterables, each sorted in the same direction. They are read lazily, one item at a time.' },
    { name: 'key',     type: 'callable', required: false, default: 'None',  desc: 'Keyword-only (3.5+). One-argument function giving the sort key of each item; the inputs must be sorted by it.' },
    { name: 'reverse', type: 'bool',     required: false, default: 'False', desc: 'Keyword-only (3.5+). True for inputs sorted largest-first; output is largest-first too.' },
  ],

  modes: [
    {
      id: 'merge',
      label: 'merge',
      blurb: 'Two sorted lists in, one sorted list out. Equal items keep input order: the first iterable wins ties.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'sorted numbers', input: 'csv-num' },
      ],
      template: 'import heapq\nlist(heapq.merge({$a}, {$b}))',
      cases: [
        { id: 'basic',    label: 'interleaved',      values: { a: '1, 4, 7', b: '2, 5, 8' } },
        { id: 'floats',   label: 'ints and floats',  values: { a: '0.5, 2, 3.5', b: '1, 2.5' } },
        { id: 'unsorted', label: 'unsorted input',   values: { a: '3, 1', b: '2' } },
        { id: 'empty',    label: 'one empty',        values: { a: '', b: '3, 4' } },
      ],
    },
    {
      id: 'reverse',
      label: 'reverse=True',
      blurb: 'For inputs sorted from largest to smallest.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'numbers, descending', input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'numbers, descending', input: 'csv-num' },
      ],
      template: 'import heapq\nlist(heapq.merge({$a}, {$b}, reverse=True))',
      cases: [
        { id: 'desc',  label: 'descending inputs', values: { a: '5, 3, 1', b: '6, 2' } },
        { id: 'asc',   label: 'ascending (wrong)', values: { a: '1, 3', b: '2, 4' } },
      ],
    },
    {
      id: 'key',
      label: 'key=abs',
      blurb: 'Inputs sorted by absolute value merge by absolute value.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'sorted by abs()', input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'sorted by abs()', input: 'csv-num' },
      ],
      template: 'import heapq\nlist(heapq.merge({$a}, {$b}, key=abs))',
      cases: [
        { id: 'abs', label: 'by abs()', values: { a: '-1, 2, -3', b: '1, -2, 4' } },
      ],
    },
  ],
  demoExplainer: 'merge compares only the current front items, so the unsorted input 3, 1 merged with 2 gives [2, 3, 1] — no error, just wrong order. An empty input simply drops out of the merge. reverse=True on ascending inputs gives [2, 4, 1, 3]: the flag does not sort anything, it only flips the comparison.',

  patterns: [
    {
      name: 'Merge sorted log files',
      desc: 'Each file is read line by line; memory stays flat however big the files are.',
      code: 'import heapq\nfiles = [open(p, encoding="utf-8") for p in paths]\nfor line in heapq.merge(*files, key=lambda s: s[:19]):  # ISO timestamp prefix\n    out.write(line)',
    },
    {
      name: 'Merge with a key',
      desc: 'Records sorted by a field merge by that field.',
      code: 'import heapq\nfrom operator import itemgetter\nmerged = heapq.merge(orders_a, orders_b, key=itemgetter("created"))',
    },
    {
      name: 'First n of a huge merge',
      desc: 'merge is lazy, so islice stops reading early.',
      code: 'import heapq\nfrom itertools import islice\nfirst10 = list(islice(heapq.merge(*sources), 10))',
    },
  ],

  examples: [
    { title: 'Three sorted lists',      code: 'import heapq\nlist(heapq.merge([1, 5, 9], [2, 6], [3, 4, 10]))', returns: '[1, 2, 3, 4, 5, 6, 9, 10]' },
    { title: 'It is a generator',       code: 'import heapq\ntype(heapq.merge([1], [2])).__name__', returns: "'generator'" },
    { title: 'Merge by length',         code: "import heapq\nlist(heapq.merge(['dog', 'horse'], ['cat', 'fish', 'kangaroo'], key=len))", returns: "['dog', 'cat', 'fish', 'horse', 'kangaroo']" },
    { title: 'Ties: earlier iterable first', code: 'import heapq\nlist(heapq.merge([1.0, 3], [1, 2]))', returns: '[1.0, 1, 2, 3]' },
    { title: 'Descending inputs',      code: 'import heapq\nlist(heapq.merge([5, 3, 1], [6, 2], reverse=True))', returns: '[6, 5, 3, 2, 1]' },
    { title: 'Works on any iterables',  code: "import heapq\nlist(heapq.merge('acz', 'bd'))", returns: "['a', 'b', 'c', 'd', 'z']" },
    { title: 'key is keyword-only',     code: 'import heapq\nlist(heapq.merge([1], [2], abs))', returns: "TypeError: 'builtin_function_or_method' object is not iterable" },
  ],

  pitfalls: [
    {
      name: 'Merging unsorted inputs',
      desc: 'merge assumes each input is sorted. It never checks, and the output is simply out of order.',
      wrong: { label: 'unsorted', code: 'import heapq\nlist(heapq.merge([3, 1], [2, 0]))', output: '[2, 0, 3, 1]' },
      fix:   { label: 'sort inputs first', code: 'import heapq\nlist(heapq.merge(sorted([3, 1]), sorted([2, 0])))', output: '[0, 1, 2, 3]' },
    },
    {
      name: 'Printing the generator',
      desc: 'merge returns a lazy generator; nothing is merged until you iterate it.',
      wrong: { label: 'bare call', code: 'import heapq\nm = heapq.merge([1, 3], [2])\ntype(m).__name__', output: "'generator'" },
      fix:   { label: 'list()', code: 'import heapq\nlist(heapq.merge([1, 3], [2]))', output: '[1, 2, 3]' },
    },
  ],

  when: {
    use: [
      'Combining sorted files, query results or streams',
      'External sorting: merge sorted chunks that do not fit in memory',
      'Inputs that are long or infinite',
    ],
    avoid: [
      'Inputs that are not sorted → sorted(itertools.chain(...))',
      'Small lists already in memory → sorted(a + b) is simpler',
    ],
  },

  notes: {
    cpython:   'Lib/heapq.py (pure Python): heap entries are [value, order, next]; order breaks ties so the first iterable wins, and reverse=True switches to the private max-heap helpers',
    'Laziness': 'Each input is read one item ahead; when only one input is left, the rest of it is yielded directly',
    'Versions': 'Added in 2.6; key and reverse in 3.5',
  },

  related: [
    { name: 'sorted()',          slug: 'sorted', when: 'Merge-and-sort small inputs', category: 'functions' },
    { name: 'itertools.chain',   slug: 'chain',  when: 'Concatenate without sorting', category: 'stdlib/itertools' },
    { name: 'heapq.nsmallest',   slug: 'nlargest-nsmallest', when: 'Only the first few items' },
    { name: 'heapq module',      slug: 'heapq',  when: 'Overview and priority queues', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I merge two sorted lists in Python?',
      a: 'list(heapq.merge(a, b)) — linear time, and lazy if you iterate instead of calling list(). For small lists sorted(a + b) is also fine.',
    },
    {
      q: 'Why is the output of heapq.merge not sorted?',
      a: 'At least one input was not sorted in the direction merge expects (ascending, or descending with reverse=True), or not sorted by the same key. merge only compares the current front items.',
    },
    {
      q: 'Is heapq.merge stable?',
      a: 'Yes: equal items come out in the order of the iterables they came from, and within one iterable in their original order.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/heapq.html#heapq.merge',
    meta:  'heapq.merge',
  },
};
