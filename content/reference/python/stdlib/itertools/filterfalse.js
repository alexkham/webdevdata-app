// content/reference/python/stdlib/itertools/filterfalse.js

export const meta = {
  slug:        'filterfalse',
  name:        'itertools.filterfalse / compress',
  signature:   'itertools.filterfalse(predicate, iterable)  ·  itertools.compress(data, selectors)',
  blurb:       'Two filters: filterfalse keeps the items a test REJECTS; compress keeps the items whose matching selector is true.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'itertools filterfalse compress ifilterfalse inverse filter reject items boolean mask select by flags partition list python filter opposite',
};

export const method = {
  slug:      'filterfalse',
  name:      'itertools.filterfalse / compress',
  signature: 'itertools.filterfalse(predicate, iterable)',
  returns:   { type: 'iterator', desc: 'filterfalse: items where predicate(item) is false. compress: data items whose paired selector is true.' },

  category:    'itertools functions',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'filterfalse is filter() inverted — together they partition an iterable. compress filters by a separate list of flags, like a boolean mask in NumPy or pandas.',

  covers: ['filterfalse', 'compress'],

  cheat: {
    commonCall: 'filterfalse(str.isdigit, tokens) · compress(names, flags)',
    returns:    'the rejected items · the selected items',
    replaces:   '[x for x in xs if not f(x)] · [d for d, s in zip(data, sel) if s]',
    watchOut:   'compress stops at the shorter of data and selectors',
  },

  parameters: [
    { name: 'predicate', type: 'callable | None', required: true, default: null, desc: 'filterfalse: the test. None means "keep the falsy items".' },
    { name: 'iterable',  type: 'iterable',        required: true, default: null, desc: 'filterfalse: the items.' },
    { name: 'data',      type: 'iterable',        required: true, default: null, desc: 'compress: the items to select from.' },
    { name: 'selectors', type: 'iterable',        required: true, default: null, desc: 'compress: truth values paired with data by position.' },
  ],

  modes: [
    {
      id: 'partition',
      label: 'filter vs filterfalse',
      blurb: 'Split words by length: filter keeps the long ones, filterfalse the rest.',
      params: [
        { name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'longer than',           input: 'number' },
      ],
      template: 'from itertools import filterfalse\nis_long = lambda w: len(w) > {$n}\nlist(filter(is_long, {$words})), list(filterfalse(is_long, {$words}))',
      cases: [
        { id: 'words', label: 'words',  values: { words: 'a, tree, is, green, ok', n: '2' } },
        { id: 'none',  label: 'none long', values: { words: 'a, b', n: '5' } },
      ],
    },
    {
      id: 'falsy',
      label: 'predicate None',
      blurb: 'filterfalse(None, …) keeps only falsy items — here, the empty strings.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated items (leave some empty)', input: 'csv' }],
      template: 'from itertools import filterfalse\nlist(filterfalse(None, {$items}))',
      cases: [
        { id: 'gaps', label: 'with gaps', values: { items: 'a, , b, ' } },
        { id: 'full', label: 'no gaps',   values: { items: 'a, b' } },
      ],
    },
    {
      id: 'compress',
      label: 'compress',
      blurb: 'Keep the items whose selector is non-zero.',
      params: [
        { name: 'data',  type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'flags', type: 'list[int]', hint: 'comma-separated 0/1',   input: 'csv-num' },
      ],
      template: 'from itertools import compress\nlist(compress({$data}, {$flags}))',
      cases: [
        { id: 'mask',  label: 'mask',          values: { data: 'a, b, c, d', flags: '1, 0, 1, 0' } },
        { id: 'short', label: 'fewer flags',   values: { data: 'a, b, c, d', flags: '1, 1' } },
        { id: 'nums',  label: 'any number',    values: { data: 'a, b, c', flags: '2, 0, -1' } },
      ],
    },
  ],
  demoExplainer: 'filter and filterfalse with the same test never share an item and together contain every item. With predicate None, filterfalse keeps exactly the falsy values — an empty string, 0, None. compress pairs data and selectors by position and stops at the shorter one, so missing flags count as "drop"; any non-zero number is true.',

  patterns: [
    {
      name: 'Partition in two',
      desc: 'The docs recipe: tee the input, then filter and filterfalse with the same test.',
      code: 'from itertools import filterfalse, tee\ndef partition(pred, iterable):\n    t1, t2 = tee(iterable)\n    return filterfalse(pred, t1), filter(pred, t2)',
    },
    {
      name: 'Select columns by a header mask',
      desc: 'compute the mask once, apply it to every row.',
      code: 'from itertools import compress\nkeep = [name in wanted for name in header]\nrows = [list(compress(row, keep)) for row in rows]',
    },
  ],

  examples: [
    { title: 'Keep what the test rejects',   code: 'from itertools import filterfalse\nlist(filterfalse(lambda x: x % 2, range(8)))',   returns: '[0, 2, 4, 6]' },
    { title: 'None: keep falsy items',        code: "from itertools import filterfalse\nlist(filterfalse(None, [0, 1, '', 'a', None]))", returns: "[0, '', None]" },
    { title: 'compress with flags',           code: "from itertools import compress\nlist(compress('ABCDEF', [1, 0, 1, 0, 1, 1]))",    returns: "['A', 'C', 'E', 'F']" },
    { title: 'compress with booleans',        code: 'from itertools import compress\nnums = [3, 8, 1, 9]\nlist(compress(nums, [n > 2 for n in nums]))', returns: '[3, 8, 9]' },
    { title: 'compress stops at the shorter', code: "from itertools import compress\nlist(compress('abc', [True]))",                  returns: "['a']" },
  ],

  pitfalls: [
    {
      name: 'Inverting filter with a lambda',
      desc: 'filter(lambda x: not pred(x), xs) works, but filterfalse says it directly and accepts any predicate unchanged.',
      wrong: { label: 'not inside lambda', code: "list(filter(lambda s: not s.isdigit(), ['1', 'a', '2']))", output: "['a']" },
      fix:   { label: 'filterfalse',       code: "from itertools import filterfalse\nlist(filterfalse(str.isdigit, ['1', 'a', '2']))", output: "['a']" },
    },
    {
      name: 'Selectors as strings',
      desc: "Every non-empty string is true — '0' and 'False' included.",
      wrong: { label: "'0' flags", code: "from itertools import compress\nlist(compress('abc', ['1', '0', '1']))", output: "['a', 'b', 'c']" },
      fix:   { label: 'int flags', code: "from itertools import compress\nlist(compress('abc', [int(f) for f in ['1', '0', '1']]))", output: "['a', 'c']" },
    },
  ],

  when: {
    use: [
      'Splitting a stream into "passes" and "fails"',
      'Applying a precomputed boolean mask',
    ],
    avoid: [
      'A comprehension reads better for a one-off condition',
      'Large numeric arrays → NumPy boolean indexing',
    ],
  },

  notes: {
    cpython:    'filterfalse_next and compress_next in Modules/itertoolsmodule.c; truth values come from PyObject_IsTrue',
    'Versions': 'filterfalse was ifilterfalse in Python 2; compress was added in 3.1',
  },

  related: [
    { name: 'filter()',                  slug: 'filter',    when: 'Keep the items that pass', category: 'functions' },
    { name: 'itertools.takewhile / dropwhile', slug: 'takewhile', when: 'Stop at the first failure instead' },
    { name: 'itertools.tee',             slug: 'tee',       when: 'Partition one iterator into both halves' },
    { name: 'bool()',                    slug: 'bool',      when: 'What counts as true or false', category: 'functions' },
    { name: 'itertools module',          slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the opposite of filter() in Python?',
      a: 'itertools.filterfalse(predicate, iterable) — it keeps the items for which the predicate is false.',
    },
    {
      q: 'How do I filter a list with a list of booleans?',
      a: 'list(itertools.compress(data, flags)) keeps data[i] where flags[i] is true. It stops at the shorter of the two lists.',
    },
    {
      q: 'How do I split a list into two lists by a condition?',
      a: 'list(filter(pred, xs)) and list(itertools.filterfalse(pred, xs)) — or a single loop that appends to one of two lists, which calls pred only once per item.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.filterfalse',
    meta:  'itertools.filterfalse, compress',
  },
};
