// content/reference/python/functions/list.js

export const meta = {
  slug:        'list',
  name:        'list',
  signature:   'list([iterable])',
  blurb:       'Build a mutable sequence from any iterable — or an empty one from nothing.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'list constructor convert iterable to list array sequence mutable copy materialize',
};

export const method = {
  slug:      'list',
  name:      'list',
  signature: 'list([iterable])',
  returns:   { type: 'list', desc: 'A new list holding the items of iterable in order. With no argument, a new empty list.' },

  category:    'Built-in function / type',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The workhorse conversion. Its other job is forcing a lazy iterator to produce everything now, which is where the surprises live.',

  cheat: {
    commonCall: 'list(iterable)',
    returns:    'a new list — always a fresh object, never the input',
    replaces:   '[x for x in iterable] when no transformation is needed',
    watchOut:   'consumes generators; a second call gives an empty list',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: false, default: '()', desc: 'Any iterable — string, tuple, set, dict, generator, file. Omitted gives an empty list.' },
  ],

  demoParams: [
    { name: 'iterable', type: 'str', hint: 'a string to split into characters', input: 'text' },
  ],
  cases: [
    { id: 'word',   label: 'a word',        values: { iterable: 'abc' } },
    { id: 'longer', label: 'longer string', values: { iterable: 'hello' } },
    { id: 'dupes',  label: 'repeats kept',  values: { iterable: 'aab' } },
    { id: 'empty',  label: 'empty string',  values: { iterable: '' } },
  ],
  demoExplainer: 'The demo feeds a string, because a string is the iterable whose expansion surprises people most: list("abc") gives ["a", "b", "c"], one element per character, not ["abc"]. Order is preserved and duplicates are kept — unlike set, list throws nothing away. An empty iterable gives an empty list rather than an error.',

  patterns: [
    {
      name: 'Materialise a lazy iterator',
      desc: 'map, filter, zip and generators produce nothing until consumed; list forces them.',
      code: 'results = list(map(str.upper, names))',
    },
    {
      name: 'Shallow-copy a list',
      desc: 'A new outer list, but the same inner objects — the usual copy caveat applies.',
      code: 'backup = list(original)',
    },
    {
      name: 'Snapshot before mutating',
      desc: 'Iterating a copy lets you safely modify the original inside the loop.',
      code: 'for item in list(items):\n    if drop(item):\n        items.remove(item)',
    },
  ],

  examples: [
    { title: 'From a string',   code: "list('abc')",              returns: "['a', 'b', 'c']" },
    { title: 'From a tuple',    code: "list(('a', 'b'))",         returns: "['a', 'b']" },
    { title: 'From a range',    code: 'list(range(3))',           returns: '[0, 1, 2]' },
    { title: 'From a dict',     code: "list({'a': 1, 'b': 2})",   returns: "['a', 'b']  # keys only" },
    { title: 'Empty',           code: 'list()',                   returns: '[]' },
    { title: 'Nested stays one level', code: "list([[1, 2], [3]])", returns: '[[1, 2], [3]]' },
  ],

  pitfalls: [
    {
      name: 'A string explodes into characters',
      desc: 'The single most common surprise. Wrapping a string in list to "make it a list of one" gives one element per character instead.',
      wrong: { label: 'Per character', code: "list('abc')", output: "['a', 'b', 'c']" },
      fix:   { label: 'Wrap in brackets', code: "['abc']", output: "['abc']" },
    },
    {
      name: 'A generator is consumed',
      desc: 'list drains the iterator. Calling it twice on the same generator gives the items and then nothing, with no error to signal what happened.',
      wrong: { label: 'Second call empty', code: 'g = (x for x in range(3))\nlist(g), list(g)', output: '([0, 1, 2], [])' },
      fix:   { label: 'Keep the list',     code: 'items = list(g)\nitems, items', output: 'reusable' },
    },
    {
      name: 'A dict gives keys, not pairs',
      desc: 'Iterating a dict yields keys, so list(d) drops the values entirely. Reach for items() when you wanted both.',
      wrong: { label: 'Values lost', code: "list({'a': 1, 'b': 2})", output: "['a', 'b']" },
      fix:   { label: 'Ask for pairs', code: "list({'a': 1, 'b': 2}.items())", output: "[('a', 1), ('b', 2)]" },
    },
    {
      name: 'The copy is shallow',
      desc: 'list(original) makes a new outer list whose elements are the SAME objects. Mutating a nested list shows through in both.',
      wrong: { label: 'Shared inner', code: 'a = [[1], [2]]\nb = list(a)\nb[0].append(99)\na', output: '[[1, 99], [2]]' },
      fix:   { label: 'Deep copy',    code: 'import copy\nb = copy.deepcopy(a)', output: 'fully independent' },
    },
  ],

  when: {
    use: [
      'Forcing a generator, map, filter or zip to produce its items',
      'Converting a tuple, set or dict view into something mutable',
      'Taking a snapshot before mutating a sequence you are iterating',
      'Making a shallow copy of a flat list',
    ],
    avoid: [
      'Transforming while converting → a list comprehension says more',
      'You only iterate once → skip it and iterate the iterable directly',
      'Nested data you will mutate → copy.deepcopy',
    ],
  },

  notes: {
    complexity: 'O(n) — every item is copied into the new list',
    return:     'Always a new list; list(x) is never x, even when x is a list',
    cpython:    'Objects/listobject.c :: list___init___impl',
    memory:     'Allocates an array sized for the input, with room to grow',
    threadSafe: 'The construction is safe; the resulting list is not under concurrent mutation',
  },

  related: [
    { name: 'tuple',      slug: 'tuple',      when: 'You want the immutable version' },
    { name: 'set',        slug: 'set',        when: 'You want uniqueness instead of order' },
    { name: 'dict',       slug: 'dict',       when: 'Building a mapping rather than a sequence' },
    { name: 'sorted',     slug: 'sorted',     when: 'Convert to a list AND order it in one call' },
  ],

  faq: [
    {
      q: 'Why does list("abc") give three items?',
      a: 'Because a string is an iterable of its characters, and list copies whatever the iterable yields. There is no special case for strings. If you want a single-element list, write ["abc"] instead.',
      code: "list('abc')   # ['a', 'b', 'c']\n['abc']       # ['abc']",
    },
    {
      q: 'Is list(x) the same as x[:]?',
      a: 'For a list, yes — both make a shallow copy. list(x) also works on anything iterable, while slicing only works on sequences, so list is the more general tool.',
      code: 'list(t)   # works on sets, dicts, generators\nt[:]      # sequences only',
    },
    {
      q: 'Should I use list() or []?',
      a: '[] for an empty literal — it is faster and reads better, because it needs no name lookup or call. Use list() when you are converting something, which is the job the constructor exists for.',
      code: 'empty = []            # preferred\nitems = list(source)  # conversion',
    },
  ],

  history: [
    { version: '1.0', note: 'list has been a core built-in type since the earliest Python.' },
    { version: '2.2', note: 'list became a true type usable as a base class, rather than a factory function.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#list',
    meta:  'list',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data structures' },
  ],
};
