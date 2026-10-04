// content/reference/python/stdlib/functools/lru_cache.js

export const meta = {
  slug:        'lru_cache',
  name:        'functools.lru_cache / cache',
  signature:   '@functools.lru_cache(maxsize=128, typed=False)  ·  @functools.cache',
  blurb:       'Memoize a function: repeated calls with the same arguments return the stored result. cache_info() reports hits and misses.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'functools lru_cache cache memoize memoization decorator cache_info cache_clear cache_parameters typed maxsize least recently used fibonacci python cache function results CacheInfo hits misses currsize unhashable type',
};

export const method = {
  slug:      'lru_cache',
  name:      'functools.lru_cache / cache',
  signature: '@functools.lru_cache(maxsize=128, typed=False)',
  returns:   { type: 'decorator', desc: 'A wrapper with the same call signature plus cache_info(), cache_clear() and cache_parameters().' },

  category:    'functools decorator',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'lru_cache keeps the maxsize most recently used results and evicts the oldest; @cache (3.9+) is lru_cache(maxsize=None) — unbounded, and smaller and faster than a size-limited lru_cache. Arguments must be hashable.',

  covers: ['lru_cache', 'cache'],

  cheat: {
    commonCall: '@lru_cache(maxsize=256)',
    returns:    'a memoizing wrapper; f.cache_info() → CacheInfo(hits=…, misses=…, maxsize=…, currsize=…)',
    replaces:   'a hand-written dict of results',
    watchOut:   'list/dict arguments → TypeError: unhashable type',
  },

  parameters: [
    { name: 'maxsize', type: 'int | None', required: false, default: '128',   desc: 'How many results to keep. None = unbounded (no eviction). 0 = no caching. Negative counts as 0.' },
    { name: 'typed',   type: 'bool',       required: false, default: 'False', desc: 'True caches arguments of different types separately (f(3) and f(3.0)).' },
    { name: 'user_function', type: 'callable', required: false, default: null, desc: '3.8+: @lru_cache without parentheses decorates directly with maxsize=128.' },
  ],

  modes: [
    {
      id: 'lru',
      label: 'hits, misses, eviction',
      blurb: 'Call square() with a sequence of arguments and read cache_info(). Leave maxsize empty for None.',
      params: [
        { name: 'size',  type: 'int | None', hint: 'maxsize (empty = None)', input: 'number-or-none' },
        { name: 'calls', type: 'list[int]',  hint: 'arguments, in order',    input: 'csv-num' },
      ],
      template: 'from functools import lru_cache\n@lru_cache(maxsize={$size})\ndef square(x):\n    return x * x\nfor x in {$calls}:\n    square(x)\nsquare.cache_info()',
      cases: [
        { id: 'repeat', label: 'repeats',          values: { size: '128', calls: '1, 2, 1, 1, 3, 2' } },
        { id: 'evict',  label: 'maxsize=2 evicts', values: { size: '2', calls: '1, 2, 3, 1' } },
        { id: 'lru',    label: 'recent use counts', values: { size: '2', calls: '1, 2, 1, 3, 1' } },
        { id: 'zero',   label: 'maxsize=0',        values: { size: '0', calls: '5, 5, 5' } },
        { id: 'float',  label: '2 vs 2.0',         values: { size: '', calls: '2, 2.0, 2.5, 2.5' } },
      ],
    },
    {
      id: 'fib',
      label: 'fibonacci',
      blurb: 'The textbook use: recursive Fibonacci becomes linear because every fib(k) is computed once.',
      params: [{ name: 'n', type: 'int', hint: 'n', input: 'number' }],
      template: 'from functools import cache\n@cache\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\nfib({$n}), fib.cache_info()',
      cases: [
        { id: 'ten',   label: 'fib(10)',  values: { n: '10' } },
        { id: 'hund',  label: 'fib(100)', values: { n: '100' } },
        { id: 'one',   label: 'fib(1)',   values: { n: '1' } },
      ],
    },
  ],
  demoExplainer: 'With maxsize=2, calling 1, 2, 3 evicts 1 (the least recently used), so the final call to 1 is a miss again. In "recent use counts" the second call to 1 refreshes it, so 2 is evicted instead and the last 1 is a hit. maxsize=0 caches nothing. The "2 vs 2.0" case shows a CPython detail: an int or str argument is used as the key directly, any other type inside an argument tuple — so 2 and 2.0 do not share an entry even though 2 == 2.0. For fib(n) with n >= 2 there are n + 1 misses (fib(0) … fib(n), each computed once) and n - 2 hits. Above roughly n = 1000 the recursion itself hits Python\'s default recursion limit, cache or not.',

  patterns: [
    {
      name: 'Cache an expensive pure function',
      desc: 'Same arguments → same result, no side effects: the safe case for caching.',
      code: 'from functools import lru_cache\n@lru_cache(maxsize=1024)\ndef parse_rules(path):\n    with open(path, encoding="utf-8") as f:\n        return compile_rules(f.read())',
    },
    {
      name: 'Unbounded memo for recursion',
      desc: '@cache for dynamic programming over a bounded input space.',
      code: 'from functools import cache\n@cache\ndef ways(n):\n    return 1 if n <= 1 else ways(n - 1) + ways(n - 2)',
    },
    {
      name: 'Inspect and reset',
      desc: 'cache_info() for tuning, cache_clear() after the underlying data changes.',
      code: 'print(parse_rules.cache_info())\nparse_rules.cache_clear()',
    },
  ],

  examples: [
    { title: 'fib(30) hits and misses',  code: 'from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\nfib(30), fib.cache_info()', returns: '(832040, CacheInfo(hits=28, misses=31, maxsize=None, currsize=31))' },
    { title: 'Bare @lru_cache (3.8+)',   code: 'from functools import lru_cache\n@lru_cache\ndef double(x):\n    return 2 * x\ndouble(4), double(4), double.cache_info()', returns: '(8, 8, CacheInfo(hits=1, misses=1, maxsize=128, currsize=1))' },
    { title: 'cache_parameters()',       code: 'from functools import lru_cache\n@lru_cache(maxsize=32, typed=True)\ndef f(x):\n    return x\nf.cache_parameters()', returns: "{'maxsize': 32, 'typed': True}" },
    { title: '@cache is maxsize=None',   code: 'from functools import cache\n@cache\ndef f(x):\n    return x\nf(1)\nf.cache_info()', returns: 'CacheInfo(hits=0, misses=1, maxsize=None, currsize=1)' },
    { title: 'cache_clear() resets everything', code: 'from functools import cache\n@cache\ndef f(x):\n    return x\nf(1); f(1)\nf.cache_clear()\nf.cache_info()', returns: 'CacheInfo(hits=0, misses=0, maxsize=None, currsize=0)' },
    { title: 'typed=True separates 3 and 3.0', code: 'from functools import lru_cache\n@lru_cache(typed=True)\ndef f(x):\n    return x\nf(3), f(3.0), f.cache_info().currsize', returns: '(3, 3.0, 2)' },
    { title: 'Arguments must be hashable', code: 'from functools import cache\n@cache\ndef total(xs):\n    return sum(xs)\ntotal([1, 2])', returns: "TypeError: unhashable type: 'list'" },
  ],

  pitfalls: [
    {
      name: 'Caching with list arguments',
      desc: 'The arguments become a dict key, so they must be hashable. Pass a tuple.',
      wrong: { label: 'list',  code: 'from functools import cache\n@cache\ndef total(xs):\n    return sum(xs)\ntotal([1, 2, 3])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'tuple', code: 'from functools import cache\n@cache\ndef total(xs):\n    return sum(xs)\ntotal((1, 2, 3))', output: '6' },
    },
    {
      name: 'Returning a mutable object from the cache',
      desc: 'Every caller gets the SAME object. Mutating it changes what later calls return.',
      wrong: { label: 'mutate result', code: 'from functools import cache\n@cache\ndef defaults():\n    return {"theme": "light"}\ndefaults()["theme"] = "dark"\ndefaults()', output: "{'theme': 'dark'}" },
      fix:   { label: 'copy it',       code: 'from functools import cache\n@cache\ndef defaults():\n    return {"theme": "light"}\nsettings = dict(defaults())\nsettings["theme"] = "dark"\ndefaults()', output: "{'theme': 'light'}" },
    },
    {
      name: 'Keyword order makes a different key',
      desc: 'f(a=1, b=2) and f(b=2, a=1) are cached separately, and so are f(1) and f(x=1).',
      wrong: { label: 'two entries', code: 'from functools import cache\n@cache\ndef f(a, b):\n    return a + b\nf(a=1, b=2); f(b=2, a=1)\nf.cache_info().misses', output: '2' },
      fix:   { label: 'one call style', code: 'from functools import cache\n@cache\ndef f(a, b):\n    return a + b\nf(1, 2); f(1, 2)\nf.cache_info().misses', output: '1' },
    },
  ],

  when: {
    use: [
      'Pure functions called repeatedly with the same arguments',
      'Recursive algorithms with overlapping subproblems',
      'Expensive lookups or parses whose inputs rarely change',
    ],
    avoid: [
      'Functions with side effects or time-dependent results',
      'Methods: the cache keeps self alive — prefer cached_property, or a cache keyed on stable data',
      'Unhashable or huge, ever-new arguments (the cache only grows, or never hits)',
    ],
  },

  notes: {
    cpython:      'The wrappers are C (lru_cache_wrapper in Modules/_functoolsmodule.c): maxsize=None uses a plain dict, a bounded size a dict plus a linked list in recency order',
    'Keys':       'lru_cache_make_key: a single int or str argument (typed=False) is its own key; otherwise the args tuple plus keyword items',
    'Threads':    'The cache stays consistent across threads, but the function may run more than once if two threads miss at the same time',
    'Versions':   'lru_cache 3.2; typed 3.3; bare @lru_cache 3.8; cache_parameters() and @cache 3.9',
  },

  related: [
    { name: 'functools.cached_property', slug: 'cached_property', when: 'Cache one computed attribute per instance' },
    { name: 'functools.wraps',           slug: 'wraps',           when: 'How the wrapper keeps the function name' },
    { name: 'hash()',                    slug: 'hash',            when: 'Why arguments must be hashable', category: 'functions' },
    { name: 'RecursionError',            slug: 'recursionerror',  when: 'Deep recursion fails even with a cache', category: 'exceptions' },
    { name: 'functools module',          slug: 'functools',       when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between functools.cache and lru_cache?',
      a: '@cache (Python 3.9+) is lru_cache(maxsize=None): unbounded and never evicts, which the docs describe as smaller and faster than lru_cache with a size limit. lru_cache(maxsize=n) keeps memory bounded by evicting the least recently used result.',
    },
    {
      q: 'How do I see whether my lru_cache is working?',
      a: 'Call f.cache_info(). It returns CacheInfo(hits=…, misses=…, maxsize=…, currsize=…): hits are calls answered from the cache, misses are calls that ran the function.',
    },
    {
      q: 'How do I clear an lru_cache?',
      a: 'f.cache_clear() empties the cache and resets the hit and miss counters to 0.',
    },
    {
      q: 'Why do I get TypeError: unhashable type with lru_cache?',
      a: 'Every argument becomes part of a dict key, so lists, dicts and sets cannot be passed. Convert them to tuples or frozensets first.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.lru_cache',
    meta:  'functools.lru_cache',
  },
};
