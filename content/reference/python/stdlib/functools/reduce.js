// content/reference/python/stdlib/functools/reduce.js

export const meta = {
  slug:        'reduce',
  name:        'functools.reduce',
  signature:   'functools.reduce(function, iterable[, initial], /)',
  blurb:       'Fold an iterable into one value by applying a two-argument function left to right: ((a + b) + c) + d.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'functools reduce fold left accumulate into one value product of list reduce of empty iterable with no initial value python reduce lambda initial value where is reduce python 3',
};

export const method = {
  slug:      'reduce',
  name:      'functools.reduce',
  signature: 'functools.reduce(function, iterable, initial, /)',
  returns:   { type: 'object', desc: 'The final accumulated value: function(…function(function(x0, x1), x2)…, xn).' },

  category:    'functools function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'reduce was a built-in in Python 2 and moved to functools in Python 3. For sums, products, max and joins there is usually a clearer built-in; reduce shines for custom folds.',

  covers: ['reduce'],

  cheat: {
    commonCall: 'reduce(operator.mul, nums, 1)',
    returns:    'one value — the product here',
    replaces:   'an accumulator variable updated in a for loop',
    watchOut:   'empty input without initial → TypeError',
  },

  parameters: [
    { name: 'function', type: 'callable', required: true,  default: null, desc: 'Called as function(accumulated, item) for each item.' },
    { name: 'iterable', type: 'iterable', required: true,  default: null, desc: 'The items to fold, left to right.' },
    { name: 'initial',  type: 'object',   required: false, default: null, desc: 'Positional only. Starting value placed before the first item — and the result for an empty iterable.' },
  ],

  modes: [
    {
      id: 'sum',
      label: 'fold with +',
      blurb: 'The classic example. With no initial, the first item starts the fold.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'from functools import reduce\nreduce(lambda total, x: total + x, {$nums})',
      cases: [
        { id: 'ints',  label: 'ints',  values: { nums: '1, 2, 3, 4, 5' } },
        { id: 'one',   label: 'one item', values: { nums: '42' } },
        { id: 'empty', label: 'empty', values: { nums: '' } },
      ],
    },
    {
      id: 'initial',
      label: 'initial',
      blurb: 'initial goes in front of the items — and is the answer for an empty input.',
      params: [
        { name: 'nums',  type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'start', type: 'int',               hint: 'initial value',           input: 'number' },
      ],
      template: 'from functools import reduce\nreduce(lambda total, x: total + x, {$nums}, {$start})',
      cases: [
        { id: 'hundred', label: 'start at 100', values: { nums: '1, 2, 3', start: '100' } },
        { id: 'empty',   label: 'empty input',  values: { nums: '', start: '0' } },
      ],
    },
    {
      id: 'trace',
      label: 'show the order',
      blurb: 'Build a string instead of a number to see how the calls nest.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' }],
      template: "from functools import reduce\nreduce(lambda acc, x: f'({acc} + {x})', {$items})",
      cases: [
        { id: 'abcd', label: 'a, b, c, d', values: { items: 'a, b, c, d' } },
        { id: 'two',  label: 'two items',  values: { items: 'a, b' } },
      ],
    },
  ],
  demoExplainer: 'The trace shows the left fold: (((a + b) + c) + d). The function is called once per item after the first, so a single item is returned as is, without calling the function at all. An empty input with no initial has nothing to return: "reduce() of empty iterable with no initial value".',

  patterns: [
    {
      name: 'Product of a list',
      desc: 'math.prod does this directly since 3.8; reduce works for any type that supports *.',
      code: 'from functools import reduce\nimport operator\ntotal = reduce(operator.mul, factors, 1)',
    },
    {
      name: 'Merge a list of dicts',
      desc: 'Later dicts win, like successive update() calls.',
      code: 'from functools import reduce\nimport operator\nmerged = reduce(operator.or_, configs, {})',
    },
    {
      name: 'Walk a nested structure',
      desc: 'Follow a key path into nested dicts.',
      code: 'from functools import reduce\nimport operator\nvalue = reduce(operator.getitem, ["user", "address", "city"], data)',
    },
  ],

  examples: [
    { title: 'Sum the hard way',          code: 'from functools import reduce\nreduce(lambda a, b: a + b, [1, 2, 3, 4])',              returns: '10' },
    { title: 'Product with operator.mul', code: 'from functools import reduce\nimport operator\nreduce(operator.mul, [1, 2, 3, 4, 5])', returns: '120' },
    { title: 'initial for empty input',   code: 'from functools import reduce\nimport operator\nreduce(operator.mul, [], 1)',           returns: '1' },
    { title: 'Nested dict lookup',        code: "from functools import reduce\nimport operator\ndata = {'a': {'b': {'c': 42}}}\nreduce(operator.getitem, ['a', 'b', 'c'], data)", returns: '42' },
    { title: 'Merge dicts',               code: "from functools import reduce\nimport operator\nreduce(operator.or_, [{'a': 1}, {'b': 2}, {'a': 3}], {})", returns: "{'a': 3, 'b': 2}" },
    { title: 'Empty without initial',     code: 'from functools import reduce\nreduce(lambda a, b: a + b, [])',                           returns: 'TypeError: reduce() of empty iterable with no initial value' },
    { title: 'Not a built-in in Python 3', code: 'reduce(lambda a, b: a + b, [1, 2])',                                                   returns: "NameError: name 'reduce' is not defined" },
  ],

  pitfalls: [
    {
      name: 'Forgetting initial for possibly-empty data',
      desc: 'A filter that matches nothing hands reduce an empty iterable.',
      wrong: { label: 'no initial',   code: 'from functools import reduce\nprices = [p for p in [5, 8] if p > 10]\nreduce(lambda a, b: a + b, prices)',    output: 'TypeError: reduce() of empty iterable with no initial value' },
      fix:   { label: 'initial=0',    code: 'from functools import reduce\nprices = [p for p in [5, 8] if p > 10]\nreduce(lambda a, b: a + b, prices, 0)', output: '0' },
    },
    {
      name: 'Swapping the lambda arguments',
      desc: 'The accumulated value comes FIRST, the next item second. For non-commutative operations the order matters.',
      wrong: { label: '(x, acc)', code: "from functools import reduce\nreduce(lambda x, acc: acc * 10 + x, [1, 2, 3])", output: '51' },
      fix:   { label: '(acc, x)', code: "from functools import reduce\nreduce(lambda acc, x: acc * 10 + x, [1, 2, 3])", output: '123' },
    },
    {
      name: 'Passing initial by keyword',
      desc: 'In Python 3.13 initial is positional-only.',
      wrong: { label: 'initial=0', code: 'from functools import reduce\nreduce(lambda a, b: a + b, [], initial=0)', output: 'TypeError: reduce() takes no keyword arguments' },
      fix:   { label: 'positional', code: 'from functools import reduce\nreduce(lambda a, b: a + b, [], 0)', output: '0' },
    },
  ],

  when: {
    use: [
      'Custom folds with no built-in equivalent (merging, composing functions, walking paths)',
      'Combining a list of sets, dicts or matrices with one operator',
    ],
    avoid: [
      'Sums → sum(); products → math.prod(); extremes → max()/min()',
      'Joining strings → str.join (reduce with + is quadratic)',
      'You need the intermediate values → itertools.accumulate',
    ],
  },

  notes: {
    cpython:      'functools_reduce in Modules/_functoolsmodule.c; the pure-Python fallback in Lib/functools.py does the same',
    'History':    'A built-in in Python 2; Python 3 moved it to functools (available there since 2.6)',
    'Signature':  'reduce(function, iterable[, initial], /) — all arguments positional-only',
  },

  related: [
    { name: 'itertools.accumulate', slug: 'accumulate', when: 'Every intermediate result, not just the last', category: 'stdlib/itertools' },
    { name: 'sum()',                slug: 'sum',        when: 'The common fold, built in', category: 'functions' },
    { name: 'max()',                slug: 'max',        when: 'Another built-in fold', category: 'functions' },
    { name: 'functools.partial',    slug: 'partial',    when: 'Prepare the function you fold with' },
    { name: 'functools module',     slug: 'functools',  when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Where is reduce in Python 3?',
      a: 'It moved to the functools module: from functools import reduce. Calling bare reduce() in Python 3 raises NameError: name \'reduce\' is not defined.',
    },
    {
      q: 'What does "reduce() of empty iterable with no initial value" mean?',
      a: 'The iterable was empty and you gave no initial value, so there is nothing to return. Pass a third argument — the identity of your operation (0 for +, 1 for *, an empty dict for merging).',
    },
    {
      q: 'In what order does reduce call the function?',
      a: 'Left to right, with the running result first: reduce(f, [a, b, c]) is f(f(a, b), c). With an initial value x it is f(f(f(x, a), b), c).',
    },
    {
      q: 'Is reduce slower than a for loop?',
      a: 'About the same — both call a Python function per item. Built-ins such as sum(), math.prod() and max() run in C and are faster when they fit.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.reduce',
    meta:  'functools.reduce',
  },
};
