// content/reference/python/stdlib/itertools/chain.js

export const meta = {
  slug:        'chain',
  name:        'itertools.chain',
  signature:   'itertools.chain(*iterables)  ·  chain.from_iterable(iterable)',
  blurb:       'Treat several iterables as one long sequence — or flatten a list of lists one level with chain.from_iterable.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'itertools chain chain.from_iterable from_iterable flatten list of lists concatenate iterables join lists lazily python merge sequences one level',
};

export const method = {
  slug:      'chain',
  name:      'itertools.chain',
  signature: 'itertools.chain(*iterables)',
  returns:   { type: 'iterator', desc: 'Every item of the first iterable, then every item of the second, and so on.' },

  category:    'itertools function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'a + b + c without building the combined list. chain takes the iterables as separate arguments; chain.from_iterable takes ONE iterable of iterables — the shape you have when flattening.',

  covers: ['chain', 'chain.from_iterable'],

  cheat: {
    commonCall: 'chain(list_a, list_b) · chain.from_iterable(rows)',
    returns:    'a lazy iterator over all items in order',
    replaces:   'a + b (copies) and nested for-loops that yield',
    watchOut:   'a string is an iterable of characters',
  },

  parameters: [
    { name: '*iterables', type: 'iterable', required: false, default: null, desc: 'chain: any number of iterables, each passed as its own argument. Each one is iterated only when the previous is exhausted.' },
    { name: 'iterable',   type: 'iterable of iterables', required: true, default: null, desc: 'chain.from_iterable: a single (possibly lazy or infinite) iterable whose items are themselves iterables.' },
  ],

  modes: [
    {
      id: 'join',
      label: 'chain',
      blurb: 'Two lists read as one.',
      params: [
        { name: 'a', type: 'list[str]', hint: 'first list',  input: 'csv' },
        { name: 'b', type: 'list[str]', hint: 'second list', input: 'csv' },
      ],
      template: 'from itertools import chain\nlist(chain({$a}, {$b}))',
      cases: [
        { id: 'two',   label: 'two lists',  values: { a: 'a, b', b: 'c, d, e' } },
        { id: 'empty', label: 'one empty',  values: { a: '', b: 'x' } },
      ],
    },
    {
      id: 'flatten',
      label: 'from_iterable',
      blurb: 'Flatten one level. The words are strings, so they flatten into characters.',
      params: [{ name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' }],
      template: 'from itertools import chain\nlist(chain.from_iterable({$words}))',
      cases: [
        { id: 'words', label: 'words → letters', values: { words: 'hi, there' } },
        { id: 'blank', label: 'empty word',      values: { words: 'a, , b' } },
      ],
    },
    {
      id: 'strings',
      label: 'strings',
      blurb: 'chain over two strings — each string contributes its characters.',
      params: [
        { name: 'a', type: 'str', hint: 'first string',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second string', input: 'text' },
      ],
      template: "from itertools import chain\n''.join(chain({$a}, {$b}))",
      cases: [
        { id: 'hello', label: 'join', values: { a: 'foo', b: 'bar' } },
      ],
    },
  ],
  demoExplainer: 'chain never copies anything: it asks the first iterable for items until it runs out, then moves to the next. An empty iterable just contributes nothing. In the from_iterable tab every word is itself an iterable of characters, which is exactly why flattening a list of strings gives letters, and an empty word disappears.',

  patterns: [
    {
      name: 'Flatten a list of lists',
      desc: 'One level only; deeper nesting needs recursion.',
      code: 'from itertools import chain\nflat = list(chain.from_iterable(matrix))',
    },
    {
      name: 'Loop over several collections at once',
      desc: 'No temporary combined list.',
      code: 'from itertools import chain\nfor user in chain(admins, editors, viewers):\n    notify(user)',
    },
    {
      name: 'Flatten a lazy stream of batches',
      desc: 'from_iterable reads the outer iterable lazily too, so it works on a generator of pages.',
      code: 'from itertools import chain\nall_items = chain.from_iterable(fetch_page(n) for n in range(pages))',
    },
  ],

  examples: [
    { title: 'Concatenate lazily',        code: 'from itertools import chain\nlist(chain([1, 2], (3, 4), range(5, 7)))', returns: '[1, 2, 3, 4, 5, 6]' },
    { title: 'Flatten one level',         code: 'from itertools import chain\nlist(chain.from_iterable([[1, 2], [3], []]))', returns: '[1, 2, 3]' },
    { title: 'Only ONE level',            code: 'from itertools import chain\nlist(chain.from_iterable([[1, [2, 3]], [4]]))', returns: '[1, [2, 3], 4]' },
    { title: 'Strings split into chars',  code: "from itertools import chain\nlist(chain('ab', 'c'))",            returns: "['a', 'b', 'c']" },
    { title: 'Dicts contribute keys',     code: "from itertools import chain\nlist(chain({'a': 1}, {'b': 2}))",   returns: "['a', 'b']" },
    { title: 'Errors surface when reached', code: 'from itertools import chain\nlist(chain([1], 2))',              returns: "TypeError: 'int' object is not iterable" },
  ],

  pitfalls: [
    {
      name: 'Calling chain(list_of_lists)',
      desc: 'chain with one argument iterates that one list — the sublists come out unchanged. Unpack it, or use from_iterable.',
      wrong: { label: 'chain(rows)',               code: 'from itertools import chain\nrows = [[1, 2], [3, 4]]\nlist(chain(rows))',               output: '[[1, 2], [3, 4]]' },
      fix:   { label: 'chain.from_iterable(rows)', code: 'from itertools import chain\nrows = [[1, 2], [3, 4]]\nlist(chain.from_iterable(rows))', output: '[1, 2, 3, 4]' },
    },
    {
      name: 'A bare string where a list was meant',
      desc: 'A string is iterable, so chain happily splits it into characters.',
      wrong: { label: "'beta'",   code: "from itertools import chain\nlist(chain(['alpha'], 'beta'))",   output: "['alpha', 'b', 'e', 't', 'a']" },
      fix:   { label: "['beta']", code: "from itertools import chain\nlist(chain(['alpha'], ['beta']))", output: "['alpha', 'beta']" },
    },
  ],

  when: {
    use: [
      'Iterating several collections in one loop',
      'Flattening exactly one level of nesting',
      'Concatenating large or lazy sources without copying',
    ],
    avoid: [
      'You need a real list anyway and inputs are small → a + b or [*a, *b]',
      'Arbitrarily deep nesting → a recursive generator',
    ],
  },

  notes: {
    cpython:      'chain is a C type; from_iterable is a classmethod that builds the same object from one iterable',
    'Laziness':   'chain(*gen) would exhaust gen to unpack it; chain.from_iterable(gen) does not',
    'Versions':   'chain since 2.3; chain.from_iterable since 2.6',
  },

  related: [
    { name: 'itertools.zip_longest', slug: 'zip_longest', when: 'Side by side instead of one after another' },
    { name: 'itertools.batched',     slug: 'batched',     when: 'The opposite: split one stream into chunks' },
    { name: 'list.extend',           slug: 'list-extend', when: 'Concatenate into an existing list', category: 'functions' },
    { name: 'iter()',                slug: 'iter',        when: 'Called on each argument in turn', category: 'functions' },
    { name: 'itertools module',      slug: 'itertools',   when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I flatten a list of lists in Python?',
      a: 'list(itertools.chain.from_iterable(list_of_lists)), or the comprehension [x for sub in list_of_lists for x in sub]. Both flatten exactly one level.',
    },
    {
      q: 'What is the difference between chain(*lists) and chain.from_iterable(lists)?',
      a: 'They give the same items. chain(*lists) unpacks the outer iterable into arguments first, so it must be finite and is fully read up front; from_iterable reads the outer iterable lazily, one sub-iterable at a time.',
    },
    {
      q: 'Is itertools.chain faster than list concatenation?',
      a: 'It avoids allocating the combined list, which matters for large inputs or when you stop early. If you need the full list anyway, a + b or [*a, *b] is just as good.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.chain',
    meta:  'itertools.chain',
  },
};
