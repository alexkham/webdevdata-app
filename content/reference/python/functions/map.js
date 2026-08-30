// content/reference/python/functions/map.js

export const meta = {
  slug:        'map',
  name:        'map',
  signature:   'map(func, *iterables)',
  blurb:       'Apply a function to every item — lazily, and across multiple iterables in parallel.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'map apply function transform each item lazy iterator functional list comprehension',
};

export const method = {
  slug:      'map',
  name:      'map',
  signature: 'map(func, *iterables)',
  returns:   { type: 'map', desc: 'A lazy iterator that yields func(item) for each item — or func(a, b, ...) when multiple iterables are given. Not a list — you must call list() or iterate to consume it.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Apply a function to every item — lazily. The functional cousin of a list comprehension.',

  cheat: {
    commonCall: 'list(map(int, tokens))',
    returns:    'a lazy map iterator — wrap in list() to materialize',
    replaces:   'a for-loop that appends a transformed value to a list',
    watchOut:   'iterator is consumed on first pass; multi-iterable form stops at the SHORTEST',
  },

  parameters: [
    { name: 'func',       type: 'callable', required: true, default: null, desc: 'A function that takes as many arguments as iterables were passed. Called once per set of items.' },
    { name: '*iterables', type: 'iterable', required: true, default: null, desc: 'One or more iterables. With one iterable, func is called with one arg. With multiple, called in parallel (like zip).' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { items: '1,2,3,4,5' } },
    { id: 'single',   label: 'single item',     values: { items: '7' } },
    { id: 'zero',     label: 'contains zero',   values: { items: '0,1,2,3' } },
    { id: 'negative', label: 'with negatives',  values: { items: '-2,-1,0,1,2' } },
    { id: 'empty',    label: 'empty',           values: { items: '' } },
    { id: 'decimals', label: 'decimals',        values: { items: '1.5,2.5,3.5' } },
  ],
  demoExplainer: 'The demo uses a fixed function — DOUBLING each item — because the demo cannot accept a callable through a text input. In real code you pass any callable: `map(int, strings)`, `map(str.upper, names)`, `map(lambda x: x**2, values)`. Result is a lazy iterator — wrap in list() to see values. With multiple iterables (e.g. `map(add, xs, ys)`), it walks them in parallel and stops at the SHORTEST.',

  patterns: [
    {
      name: 'Type conversion across an iterable',
      desc: 'The idiomatic use — convert a list of strings to ints.',
      code: 'values = list(map(int, input_strings))',
    },
    {
      name: 'Method call on every item',
      desc: 'Use the unbound method — same result as a comprehension.',
      code: 'uppers = list(map(str.upper, names))',
    },
    {
      name: 'Parallel walk of two iterables',
      desc: 'Map with two iterables applies func(a_i, b_i) for each pair.',
      code: 'sums = list(map(int.__add__, xs, ys))',
    },
    {
      name: 'When a comprehension reads better',
      desc: 'For non-trivial expressions, a comprehension is often clearer than map + lambda.',
      code: '# instead of: map(lambda x: x**2 + 1, xs)\nsquared = [x**2 + 1 for x in xs]',
    },
  ],

  examples: [
    { title: 'Double each',        code: 'list(map(lambda x: x*2, [1, 2, 3]))',      returns: '[2, 4, 6]' },
    { title: 'Convert to int',     code: 'list(map(int, ["1", "2", "3"]))',          returns: '[1, 2, 3]' },
    { title: 'Uppercase strings',  code: 'list(map(str.upper, ["a", "b", "c"]))',    returns: '["A", "B", "C"]' },
    { title: 'Two iterables',      code: 'list(map(lambda a,b: a+b, [1,2,3], [10,20,30]))', returns: '[11, 22, 33]' },
    { title: 'Empty gives empty',  code: 'list(map(str.upper, []))',                  returns: '[]' },
    { title: 'Stops at shortest',  code: 'list(map(min, [1, 2, 3], [4, 5]))',          returns: '[1, 2]  # third pair skipped' },
  ],

  pitfalls: [
    {
      name: 'map() returns an ITERATOR, not a list',
      desc: 'In Python 2 it returned a list; Python 3 made it lazy. Printing a map object shows `<map object at ...>` — call list() to materialize.',
      wrong: { label: 'Printed iterator', code: 'print(map(str.upper, ["a"]))', output: '<map object at 0x...>' },
      fix:   { label: 'Wrap in list',     code: 'print(list(map(str.upper, ["a"])))', output: "['A']" },
    },
    {
      name: 'Iterator is CONSUMED on first pass',
      desc: 'Once iterated, a map iterator is exhausted. Trying to reuse it gives an empty iterator.',
      wrong: { label: 'Empty on second pass', code: 'r = map(int, "12345")\nlist(r)   # [1,2,3,4,5]\nlist(r)   # []', output: 'exhausted' },
      fix:   { label: 'Materialize once',      code: 'r = list(map(int, "12345"))\nr; r', output: 'reusable' },
    },
    {
      name: 'Multi-iterable form stops at the SHORTEST',
      desc: 'Unlike zip_longest, map with multiple iterables gives up at the shortest input. Extra items in longer iterables are silently dropped.',
      wrong: { label: 'Silent drop', code: 'list(map(min, [1,2,3], [4,5]))', output: '[1, 2]  # third element dropped' },
      fix:   { label: 'itertools.zip_longest', code: 'from itertools import zip_longest\nlist(map(lambda p: min(*p), zip_longest([1,2,3], [4,5], fillvalue=999)))', output: '[1, 2, 3]' },
    },
    {
      name: 'A comprehension usually reads better than map+lambda',
      desc: 'map(lambda x: expr, xs) is functionally identical to [expr for x in xs] but the comprehension is more Pythonic. Reach for map when the callable is already named.',
      wrong: { label: 'map + lambda', code: 'list(map(lambda x: x**2, xs))', output: 'works, but stiff' },
      fix:   { label: 'Comprehension', code: '[x**2 for x in xs]', output: 'idiomatic' },
    },
  ],

  when: {
    use: [
      'Applying a NAMED function to an iterable — `map(int, ...)`, `map(str.upper, ...)`',
      'Walking two or more iterables in parallel with a binary function',
      'Lazy pipelines where you do not want to materialize intermediate lists',
      'Interop with functional-style libraries expecting iterators',
    ],
    avoid: [
      '`map(lambda ...` — use a comprehension instead',
      'Need to iterate multiple times → wrap in list()',
      'Need \"stop at longest\" semantics → itertools.zip_longest first',
      'Need to modify in place — use a for-loop',
    ],
  },

  notes: {
    complexity: 'O(1) to construct; O(n) to iterate; per-item cost is func()',
    return:     'A map iterator — lazy',
    cpython:    'Python/bltinmodule.c :: builtin_map',
    memory:     'O(1) — no intermediate list is built',
    threadSafe: 'Depends on func and the underlying iterables',
  },

  related: [
    { name: 'filter',    slug: 'filter',    when: 'Keep items by a predicate instead of transforming them' },
    { name: 'zip',       slug: 'zip',       when: 'Pair up multiple iterables without applying a function' },
    { name: 'enumerate', slug: 'enumerate', when: 'Get index and value pairs' },
  ],

  faq: [
    {
      q: 'What is the difference between map and a list comprehension?',
      a: 'Behaviorally almost identical, but map is LAZY (returns an iterator) while a list comprehension is EAGER (returns a list). For a named function, map is compact. For an expression, the comprehension reads better.',
    },
    {
      q: 'Why does map return an iterator instead of a list?',
      a: 'Python 3 changed this from Python 2 to allow lazy pipelines — you can chain map(), filter(), etc., without ever building an intermediate list. Wrap in list() when you need the values eagerly.',
    },
    {
      q: 'What happens with multiple iterables of different lengths?',
      a: 'map stops at the shortest. Use itertools.zip_longest first if you need the longest with a fill value.',
    },
  ],

  history: [
    { version: '1.0', note: 'map() has been a builtin since Python 1.0 — returned a list.' },
    { version: '3.0', note: 'Return type changed from list to lazy iterator.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#map',
    meta:  'map',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the mapped output' },
  ],
};