// content/reference/python/stdlib/functools/index.js — the functools module hub

export const meta = {
  slug:        'index',
  name:        'functools',
  signature:   'import functools',
  blurb:       'Tools for functions that act on or return other functions: caching (lru_cache, cache, cached_property), partial application, reduce, wraps, total_ordering, singledispatch.',
  category:    'functional',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'functools module python higher order functions lru_cache cache cached_property partial partialmethod reduce wraps update_wrapper total_ordering singledispatch singledispatchmethod cmp_to_key memoize decorator',
};

export const method = {
  slug: 'index',
  name: 'functools',

  category:    'Functional programming',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Three jobs: remember results (lru_cache, cache, cached_property), prepare functions (partial, partialmethod, wraps), and derive behaviour (total_ordering, singledispatch, cmp_to_key, reduce).',

  // every public name these classes define themselves must have a member page
  coverClasses: ['partial', 'singledispatchmethod'],

  imports: ['from functools import lru_cache, partial, reduce, wraps', 'import functools'],
  facts: [
    { label: 'Public API', value: 'cache, cached_property, cmp_to_key, lru_cache, partial, partialmethod, reduce, singledispatch, singledispatchmethod, total_ordering, update_wrapper, wraps, WRAPPER_ASSIGNMENTS, WRAPPER_UPDATES' },
    { label: 'Decorators', value: 'lru_cache, cache, cached_property, wraps, total_ordering, singledispatch, singledispatchmethod' },
    { label: 'Speed',      value: 'partial, reduce, cmp_to_key and the lru_cache wrapper are C (Modules/_functoolsmodule.c); the rest is Lib/functools.py' },
    { label: 'Since',      value: 'Python 2.5; reduce moved here from the built-ins in Python 3' },
  ],

  modes: [
    {
      id: 'cache',
      label: 'lru_cache',
      blurb: 'Call a cached function with a sequence of arguments and read the hit/miss counters.',
      params: [
        { name: 'size',  type: 'int | None', hint: 'maxsize (empty = None)', input: 'number-or-none' },
        { name: 'calls', type: 'list[int]',  hint: 'arguments, in order',    input: 'csv-num' },
      ],
      template: 'from functools import lru_cache\n@lru_cache(maxsize={$size})\ndef square(x):\n    return x * x\nfor x in {$calls}:\n    square(x)\nsquare.cache_info()',
      cases: [
        { id: 'hits',  label: 'repeats',  values: { size: '128', calls: '3, 3, 4, 3' } },
        { id: 'evict', label: 'maxsize=1', values: { size: '1', calls: '3, 4, 3' } },
      ],
    },
    {
      id: 'partial',
      label: 'partial',
      blurb: 'Freeze base= of int() to get a parser for one number base.',
      params: [
        { name: 'base', type: 'int', hint: 'base',           input: 'number' },
        { name: 'text', type: 'str', hint: 'digits to parse', input: 'text' },
      ],
      template: 'from functools import partial\nparse = partial(int, base={$base})\nparse({$text})',
      cases: [
        { id: 'bin', label: 'binary', values: { base: '2', text: '101010' } },
        { id: 'hex', label: 'hex',    values: { base: '16', text: 'FF' } },
        { id: 'bad', label: 'invalid', values: { base: '8', text: '9' } },
      ],
    },
    {
      id: 'reduce',
      label: 'reduce',
      blurb: 'Fold a list with multiplication; 1 is the starting value.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'from functools import reduce\nimport operator\nreduce(operator.mul, {$nums}, 1)',
      cases: [
        { id: 'fact',  label: '5!',    values: { nums: '1, 2, 3, 4, 5' } },
        { id: 'empty', label: 'empty', values: { nums: '' } },
        { id: 'float', label: 'with a float', values: { nums: '2, 0.5, 3' } },
      ],
    },
  ],
  demoExplainer: 'With maxsize=1 the cache holds only the latest result, so 3, 4, 3 is three misses. The parser tab shows that partial does no checking of its own — the error comes from int() when the partial is called. reduce with an initial value of 1 returns 1 for an empty list instead of raising, and one float in the list makes the product a float.',

  patterns: [
    {
      name: 'Memoize a pure function',
      desc: 'One decorator line.',
      code: 'from functools import cache\n@cache\ndef count_paths(n):\n    return 1 if n < 2 else count_paths(n - 1) + count_paths(n - 2)',
    },
    {
      name: 'A well-behaved decorator',
      desc: 'wraps keeps the decorated function\'s name and docstring.',
      code: 'import functools\ndef logged(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        print("calling", func.__name__)\n        return func(*args, **kwargs)\n    return wrapper',
    },
    {
      name: 'Callback with preset arguments',
      desc: 'partial instead of a lambda.',
      code: 'from functools import partial\nbutton.on_click(partial(save, document, overwrite=True))',
    },
  ],

  examples: [
    { title: 'lru_cache counts hits',      code: 'from functools import lru_cache\n@lru_cache\ndef sq(x):\n    return x * x\nsq(3); sq(3); sq(4)\nsq.cache_info()', returns: 'CacheInfo(hits=1, misses=2, maxsize=128, currsize=2)' },
    { title: 'partial with base=2',        code: "from functools import partial\npartial(int, base=2)('1010')",                      returns: '10' },
    { title: 'reduce folds left',          code: "from functools import reduce\nreduce(lambda a, b: f'({a}{b})', 'abc')",            returns: "'((ab)c)'" },
    { title: 'cmp_to_key for sorted()',    code: 'from functools import cmp_to_key\nsorted([5, 2, 9], key=cmp_to_key(lambda a, b: b - a))', returns: '[9, 5, 2]' },
    { title: 'total_ordering fills in >=', code: 'from functools import total_ordering\n@total_ordering\nclass V:\n    def __init__(self, n):\n        self.n = n\n    def __eq__(self, o):\n        return self.n == o.n\n    def __lt__(self, o):\n        return self.n < o.n\nV(2) >= V(1)', returns: 'True' },
    { title: 'wraps keeps the name',       code: 'import functools\ndef deco(f):\n    @functools.wraps(f)\n    def wrapper():\n        return f()\n    return wrapper\n@deco\ndef ping():\n    return "pong"\nping.__name__', returns: "'ping'" },
  ],

  pitfalls: [
    {
      name: 'Looking for reduce in the built-ins',
      desc: 'Python 3 moved reduce to functools.',
      wrong: { label: 'built-in', code: 'reduce(lambda a, b: a * b, [1, 2, 3])', output: "NameError: name 'reduce' is not defined" },
      fix:   { label: 'import it', code: 'from functools import reduce\nreduce(lambda a, b: a * b, [1, 2, 3])', output: '6' },
    },
    {
      name: 'Caching a function that takes a list',
      desc: 'lru_cache keys on the arguments, so they must be hashable.',
      wrong: { label: 'list argument',  code: 'from functools import cache\n@cache\ndef total(xs):\n    return sum(xs)\ntotal([1, 2])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'tuple argument', code: 'from functools import cache\n@cache\ndef total(xs):\n    return sum(xs)\ntotal((1, 2))', output: '3' },
    },
  ],

  when: {
    use: [
      'Caching results of pure functions',
      'Writing decorators (wraps) and configurable callbacks (partial)',
      'Giving classes full comparison support from one method (total_ordering)',
    ],
    avoid: [
      'Iterator building blocks → itertools',
      'Simple folds → sum(), max(), math.prod() instead of reduce',
    ],
  },

  notes: {
    cpython:       'Lib/functools.py, with partial, reduce, cmp_to_key and the lru_cache wrapper replaced by their C versions from Modules/_functoolsmodule.c when available',
    '3.13':        'No new public names in 3.13 — __all__ is the same 14 names as in 3.12',
    'Placeholder': 'functools.Placeholder (positional placeholders for partial) arrives in Python 3.14',
  },

  related: [
    { name: 'itertools',   slug: 'itertools',   when: 'Lazy iterator building blocks', category: 'stdlib' },
    { name: 'collections', slug: 'collections', when: 'Containers: Counter, deque, defaultdict', category: 'stdlib' },
    { name: 'lambda',      slug: 'lambda',      when: 'Inline functions to pass around', category: 'keywords' },
    { name: 'map()',       slug: 'map',         when: 'Apply a function to every item', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is functools used for in Python?',
      a: 'Higher-order helpers: lru_cache/cache/cached_property for memoization, partial for presetting arguments, wraps for writing decorators, total_ordering and cmp_to_key for comparisons, singledispatch for per-type functions, and reduce for folds.',
    },
    {
      q: 'What is the difference between functools and itertools?',
      a: 'itertools builds and combines iterators (chain, islice, groupby …). functools works on functions themselves: wrapping, caching, partially applying and combining them.',
    },
    {
      q: 'Which functools decorator should I use for caching?',
      a: '@cache for an unbounded memo of a plain function, @lru_cache(maxsize=n) to bound memory, and @cached_property for a value computed once per instance.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html',
    meta:  'functools — Higher-order functions and operations on callable objects',
  },
};
