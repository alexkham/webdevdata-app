// content/reference/python/stdlib/operator/comparisons.js — lt, le, eq, ne, ge, gt

export const meta = {
  slug:        'comparisons',
  name:        'operator.lt / le / eq / ne / ge / gt',
  signature:   'operator.lt(a, b) · le · eq · ne · ge · gt',
  blurb:       'The six rich comparisons < <= == != >= > as functions — for filters, dispatch tables and functools.partial.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'operator.lt operator.le operator.eq operator.ne operator.ge operator.gt lt le eq ne ge gt python comparison functions less than greater than equal function partial operator.lt filter not supported between instances of compare strings lexicographic compare lists',
};

export const method = {
  slug:      'comparisons',
  name:      'operator.lt / le / eq / ne / ge / gt',
  signature: 'operator.lt(a, b, /) · le(a, b, /) · eq(a, b, /) · ne(a, b, /) · ge(a, b, /) · gt(a, b, /)',
  returns:   { type: 'bool (usually)', desc: 'The result of a < b, a <= b, …: True or False for built-in types; a rich comparison may return any object.' },

  category:    'operator function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'lt(a, b) is a < b — same dispatch, same results, same TypeError for values that cannot be ordered. The argument order is the whole trick: partial(operator.lt, 5) is "5 < x", not "x < 5".',

  covers: ['lt', 'le', 'eq', 'ne', 'ge', 'gt'],

  cheat: {
    commonCall: "OPS = {'<': operator.lt, '>=': operator.ge}",
    returns:    'True / False',
    replaces:   'lambda a, b: a < b',
    watchOut:   'partial(operator.lt, 5)(x) means 5 < x',
  },

  parameters: [
    { name: 'a', type: 'any', required: true, default: null, desc: 'Left side of the comparison. Positional only.' },
    { name: 'b', type: 'any', required: true, default: null, desc: 'Right side of the comparison. Positional only.' },
  ],

  modes: [
    {
      id: 'six',
      label: 'all six',
      blurb: 'The six functions on one pair. 7 and 2.5 become numbers; anything else is a str.',
      params: [
        { name: 'a', type: 'int | float | str', hint: 'left',  input: 'auto' },
        { name: 'b', type: 'int | float | str', hint: 'right', input: 'auto' },
      ],
      template: 'import operator\na, b = {$a}, {$b}\n[f(a, b) for f in (operator.lt, operator.le, operator.eq, operator.ne, operator.ge, operator.gt)]',
      cases: [
        { id: 'ints',  label: '2, 3',              values: { a: '2', b: '3' } },
        { id: 'mixed', label: '3, 3.0',            values: { a: '3', b: '3.0' } },
        { id: 'case',  label: "'apple', 'Apple'",  values: { a: 'apple', b: 'Apple' } },
        { id: 'type',  label: "1, 'a'",            values: { a: '1', b: 'a' } },
      ],
    },
    {
      id: 'lists',
      label: 'lists',
      blurb: 'Lists compare item by item; the first difference decides, and a shorter prefix is smaller.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'comma-separated', input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'comma-separated', input: 'csv-num' },
      ],
      template: 'import operator\na, b = {$a}, {$b}\n(operator.lt(a, b), operator.eq(a, b))',
      cases: [
        { id: 'first',  label: '[1, 2, 3] vs [1, 3]', values: { a: '1, 2, 3', b: '1, 3' } },
        { id: 'prefix', label: '[1, 2] vs [1, 2, 0]', values: { a: '1, 2', b: '1, 2, 0' } },
        { id: 'equal',  label: '[2] vs [2.0]',        values: { a: '2', b: '2.0' } },
      ],
    },
    {
      id: 'partial',
      label: 'partial',
      blurb: 'filter with partial(operator.lt, limit) keeps the numbers x for which limit < x.',
      params: [
        { name: 'limit', type: 'int | float',       hint: 'fixed first argument', input: 'auto' },
        { name: 'nums',  type: 'list[int | float]', hint: 'comma-separated',      input: 'csv-num' },
      ],
      template: 'import operator\nfrom functools import partial\nlist(filter(partial(operator.lt, {$limit}), {$nums}))',
      cases: [
        { id: 'five',  label: 'limit 5',   values: { limit: '5', nums: '3, 5, 7, 9' } },
        { id: 'float', label: 'limit 2.5', values: { limit: '2.5', nums: '1, 2, 3, 4' } },
        { id: 'str',   label: "limit 'a'", values: { limit: 'a', nums: '1, 2' } },
      ],
    },
  ],
  demoExplainer: "Numbers compare by value across types — 3 == 3.0 — and Python compares an int with a float exactly, never by rounding the int. Strings compare by Unicode code point, so 'apple' > 'Apple' (a is 97, A is 65). Ordering an int against a str raises TypeError, while == and != just answer False and True. Lists find the first unequal pair and compare that; when one list is a prefix of the other, the shorter one is smaller. In the partial tab the fixed limit is the FIRST argument: partial(operator.lt, 5) asks 5 < x, i.e. keeps numbers greater than 5.",

  patterns: [
    {
      name: 'Comparison dispatch table',
      desc: 'Turn a user-chosen operator symbol into a function.',
      code: "import operator\nOPS = {'<': operator.lt, '<=': operator.le, '==': operator.eq, '!=': operator.ne, '>=': operator.ge, '>': operator.gt}\nhits = [r for r in rows if OPS[op](r[field], value)]",
    },
    {
      name: 'A predicate with a fixed bound',
      desc: 'partial fixes the FIRST argument — read it as "bound OP x".',
      code: 'import operator\nfrom functools import partial\nabove_10 = partial(operator.lt, 10)   # 10 < x\nbig = list(filter(above_10, values))',
    },
    {
      name: 'Element-wise comparison of two lists',
      desc: 'map with two iterables compares position by position.',
      code: 'import operator\nincreased = list(map(operator.gt, new_prices, old_prices))',
    },
  ],

  examples: [
    { title: 'The basics',                 code: "import operator\noperator.lt(2, 3), operator.le(3, 3), operator.eq(1, 1.0), operator.ne('a', 'A')", returns: '(True, True, True, True)' },
    { title: 'Strings compare by character', code: "import operator\noperator.lt('10', '9'), operator.lt(10, 9)", returns: '(True, False)' },
    { title: 'Lists and tuples: first difference', code: 'import operator\noperator.lt([1, 2, 3], [1, 3]), operator.lt((1, 2), (1, 2, 0))', returns: '(True, True)' },
    { title: 'Equality never raises',      code: "import operator\noperator.eq(1, '1'), operator.ne([1], (1,))", returns: '(False, True)' },
    { title: 'NaN is unordered',           code: "import operator\noperator.lt(float('nan'), 1), operator.ge(float('nan'), 1)", returns: '(False, False)' },
    { title: 'partial fixes the left side', code: 'from functools import partial\nimport operator\nlist(filter(partial(operator.lt, 5), [3, 5, 7, 9]))', returns: '[7, 9]' },
    { title: 'Floats are not exact',       code: 'import operator\noperator.eq(0.1 + 0.2, 0.3)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Reading partial(operator.lt, n) as "less than n"',
      desc: 'partial fills arguments from the left, so the bound value becomes a in a < b. To keep numbers below 5, fix the bound as the right side: partial(operator.gt, 5) means 5 > x.',
      wrong: { label: 'partial(lt, 5)', code: 'from functools import partial\nimport operator\nlist(filter(partial(operator.lt, 5), [3, 5, 7]))', output: '[7]' },
      fix:   { label: 'partial(gt, 5)', code: 'from functools import partial\nimport operator\nlist(filter(partial(operator.gt, 5), [3, 5, 7]))', output: '[3]' },
    },
    {
      name: 'Ordering values of different types',
      desc: 'Python 3 has no cross-type ordering: comparing None, numbers and strings with < raises. Filter or convert first.',
      wrong: { label: 'lt(None, 1)', code: 'import operator\noperator.lt(None, 1)', output: "TypeError: '<' not supported between instances of 'NoneType' and 'int'" },
      fix:   { label: 'handle None', code: 'import operator\nvalues = [3, None, 1]\nsorted(v for v in values if operator.is_not(v, None))', output: '[1, 3]' },
    },
    {
      name: 'Comparing floats with eq',
      desc: 'eq is ==, and 0.1 + 0.2 is not exactly 0.3. Compare floats with a tolerance.',
      wrong: { label: 'eq(0.1 + 0.2, 0.3)', code: 'import operator\noperator.eq(0.1 + 0.2, 0.3)', output: 'False' },
      fix:   { label: 'math.isclose', code: 'import math\nmath.isclose(0.1 + 0.2, 0.3)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Dispatch tables that map comparison symbols to functions',
      'map over two sequences, or a predicate built with functools.partial',
    ],
    avoid: [
      'Sort keys — key= takes one argument; use itemgetter / attrgetter, or functools.cmp_to_key for a two-argument comparison',
      'Readable conditions — write a < b in ordinary code',
    ],
  },

  notes: {
    cpython:      'Modules/_operator.c → PyObject_RichCompare(a, b, Py_LT …): the reflected method (__gt__ for __lt__) is tried when the first returns NotImplemented',
    'Return value': 'Built-in types return True or False; a class may return anything from __lt__ (NumPy returns arrays), and these functions pass it through',
    'Equality':   '== and != fall back to identity and never raise for unrelated types; the four ordering functions raise TypeError instead',
  },

  related: [
    { name: '< operator',  slug: 'lt', when: 'The operator in depth', category: 'operators' },
    { name: '== operator', slug: 'eq', when: 'Equality vs identity', category: 'operators' },
    { name: '!= operator', slug: 'ne', when: 'Not equal',            category: 'operators' },
    { name: 'functools.cmp_to_key', slug: 'cmp_to_key', when: 'Sort with a two-argument comparison', category: 'stdlib/functools' },
    { name: 'functools.partial', slug: 'partial', when: 'Fix one side of a comparison', category: 'stdlib/functools' },
    { name: 'sorted()',    slug: 'sorted', when: 'Sort by keys instead', category: 'functions' },
    { name: 'truth and identity', slug: 'truth-identity', when: 'is_ / is_not compare identity, not value' },
  ],

  faq: [
    {
      q: 'What does operator.lt do in Python?',
      a: 'operator.lt(a, b) returns a < b. le, eq, ne, ge and gt are <=, ==, !=, >= and >. They are useful where a function is needed: a dict of comparison operators, map over two lists, or partial to build a one-argument predicate.',
    },
    {
      q: "What does \"'<' not supported between instances of 'int' and 'str'\" mean?",
      a: 'Python 3 cannot order values of unrelated types. Comparing an int with a str — directly, through operator.lt, or inside sorted() — raises this TypeError. Convert the values to one type first, or sort with a key that does.',
    },
    {
      q: 'Can I use operator.lt as a sort key?',
      a: 'No: key= calls its function with one argument and lt needs two. For a two-argument comparison function use functools.cmp_to_key; usually itemgetter or attrgetter is the better key.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.lt',
    meta:  'operator — rich comparisons',
  },
};
