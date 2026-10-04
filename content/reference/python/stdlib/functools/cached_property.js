// content/reference/python/stdlib/functools/cached_property.js

export const meta = {
  slug:        'cached_property',
  name:        'functools.cached_property',
  signature:   '@functools.cached_property',
  blurb:       'A property computed on first access and then stored on the instance — later reads are plain attribute lookups. Delete the attribute to recompute.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'functools cached_property lazy property cache attribute compute once per instance property vs cached_property invalidate cache del attribute __slots__ no __dict__ attribute python',
};

export const method = {
  slug:      'cached_property',
  name:      'functools.cached_property',
  signature: '@functools.cached_property',
  returns:   { type: 'cached_property', desc: 'A descriptor: the first instance.attr calls the method and writes the result into instance.__dict__ under the same name.' },

  category:    'functools class',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'Unlike @property, the method runs only once per instance. Unlike lru_cache on a method, the value lives in the instance itself and disappears with it.',

  covers: ['cached_property'],

  cheat: {
    commonCall: '@cached_property\ndef stats(self): ...',
    returns:    'the computed value, stored as self.stats',
    replaces:   'if self._stats is None: self._stats = … boilerplate',
    watchOut:   'needs an instance __dict__ — fails with __slots__',
  },

  parameters: [
    { name: 'func', type: 'callable', required: true, default: null, desc: 'A method taking only self; its return value is cached under the method\'s name.' },
  ],

  modes: [
    {
      id: 'once',
      label: 'computed once',
      blurb: 'Read r.total twice and count how often the method actually ran.',
      params: [{ name: 'n', type: 'int', hint: 'sum 0..n', input: 'number' }],
      template: 'from functools import cached_property\nclass Report:\n    def __init__(self, n):\n        self.n = n\n        self.calls = 0\n    @cached_property\n    def total(self):\n        self.calls += 1\n        return sum(range(self.n + 1))\nr = Report({$n})\nr.total, r.total, r.calls',
      cases: [
        { id: 'ten',  label: 'n = 10',  values: { n: '10' } },
        { id: 'zero', label: 'n = 0',   values: { n: '0' } },
      ],
    },
    {
      id: 'reset',
      label: 'stale value, then del',
      blurb: 'Change the input: the cached value does not notice. del clears it and the next read recomputes.',
      params: [
        { name: 'n', type: 'int', hint: 'first n',  input: 'number' },
        { name: 'm', type: 'int', hint: 'second n', input: 'number' },
      ],
      template: 'from functools import cached_property\nclass Report:\n    def __init__(self, n):\n        self.n = n\n        self.calls = 0\n    @cached_property\n    def total(self):\n        self.calls += 1\n        return sum(range(self.n + 1))\nr = Report({$n})\nfirst = r.total\nr.n = {$m}\nstale = r.total\ndel r.total\nfirst, stale, r.total, r.calls',
      cases: [
        { id: 'grow', label: '10 → 100', values: { n: '10', m: '100' } },
        { id: 'same', label: '5 → 5',    values: { n: '5', m: '5' } },
      ],
    },
  ],
  demoExplainer: 'The first read runs the method and stores the result in r.__dict__["total"]; the second read finds that instance attribute and never reaches the descriptor, so calls stays 1. Changing r.n afterwards leaves the old total in place until del r.total removes the stored value — then the method runs again with the new n.',

  patterns: [
    {
      name: 'Expensive derived data',
      desc: 'Compute on first use; immutable inputs make the cache safe.',
      code: 'from functools import cached_property\nimport statistics\nclass DataSet:\n    def __init__(self, numbers):\n        self._data = tuple(numbers)\n    @cached_property\n    def stdev(self):\n        return statistics.stdev(self._data)',
    },
    {
      name: 'Invalidate after a change',
      desc: 'pop() from __dict__ does not fail when the value was never computed.',
      code: 'def set_data(self, numbers):\n    self._data = tuple(numbers)\n    self.__dict__.pop("stdev", None)',
    },
  ],

  examples: [
    { title: 'Runs only once',            code: "from functools import cached_property\nclass C:\n    calls = 0\n    @cached_property\n    def value(self):\n        C.calls += 1\n        return 42\nc = C()\nc.value, c.value, C.calls", returns: '(42, 42, 1)' },
    { title: 'Stored in the instance __dict__', code: "from functools import cached_property\nclass C:\n    @cached_property\n    def value(self):\n        return 42\nc = C()\nbefore = dict(vars(c))\nc.value\nbefore, vars(c)", returns: "({}, {'value': 42})" },
    { title: 'Writable, unlike property', code: "from functools import cached_property\nclass C:\n    @cached_property\n    def value(self):\n        return 42\nc = C()\nc.value = 7\nc.value", returns: '7' },
    { title: 'del recomputes',            code: "from functools import cached_property\nclass C:\n    def __init__(self):\n        self.n = 1\n    @cached_property\n    def double(self):\n        return self.n * 2\nc = C()\nc.double\nc.n = 5\ndel c.double\nc.double", returns: '10' },
    { title: 'Per instance, not per class', code: "from functools import cached_property\nclass C:\n    def __init__(self, n):\n        self.n = n\n    @cached_property\n    def square(self):\n        return self.n ** 2\nC(3).square, C(4).square", returns: '(9, 16)' },
  ],

  pitfalls: [
    {
      name: 'Classes with __slots__',
      desc: 'No instance __dict__ means nowhere to store the value.',
      wrong: { label: '__slots__', code: "from functools import cached_property\nclass P:\n    __slots__ = ('x',)\n    def __init__(self, x):\n        self.x = x\n    @cached_property\n    def double(self):\n        return self.x * 2\nP(2).double", output: "TypeError: No '__dict__' attribute on 'P' instance to cache 'double' property." },
      fix:   { label: "slot for '__dict__'", code: "from functools import cached_property\nclass P:\n    __slots__ = ('x', '__dict__')\n    def __init__(self, x):\n        self.x = x\n    @cached_property\n    def double(self):\n        return self.x * 2\nP(2).double", output: '4' },
    },
    {
      name: 'Deleting before the first read',
      desc: 'Until the value is computed there is nothing in the instance dict to delete.',
      wrong: { label: 'del too early', code: "from functools import cached_property\nclass C:\n    @cached_property\n    def value(self):\n        return 42\nc = C()\ndel c.value", output: "AttributeError: 'C' object has no attribute 'value'" },
      fix:   { label: '__dict__.pop', code: "from functools import cached_property\nclass C:\n    @cached_property\n    def value(self):\n        return 42\nc = C()\nc.__dict__.pop('value', None)\nc.value", output: '42' },
    },
  ],

  when: {
    use: [
      'Expensive attributes of effectively immutable objects',
      'Lazy loading: compute only if someone asks',
    ],
    avoid: [
      'Values that must track changing inputs → @property (or invalidate by hand)',
      'Classes with __slots__ and no __dict__ slot',
      'Strict once-only guarantees across threads — since 3.12 there is no lock',
    ],
  },

  notes: {
    cpython:     'Pure Python in Lib/functools.py: a non-data descriptor (only __get__), so the instance attribute it writes takes precedence on later lookups',
    'Threads':   'Before 3.12 a per-property lock ensured one computation; 3.12 removed it, so two threads may both compute the value',
    'Sharing':   'The docs note it interferes with PEP 412 key-sharing dictionaries, so instance dicts can take more space',
  },

  related: [
    { name: 'property',            slug: 'property',  when: 'Recomputed on every access, read-only by default', category: 'functions' },
    { name: 'functools.lru_cache', slug: 'lru_cache', when: 'Cache by arguments rather than per instance' },
    { name: 'vars()',              slug: 'vars',      when: 'See the cached value in the instance __dict__', category: 'functions' },
    { name: 'functools module',    slug: 'functools', when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between property and cached_property?',
      a: 'property calls its getter on every access and blocks assignment unless a setter is defined. cached_property calls the method once, stores the result as an ordinary instance attribute, and allows assignment and deletion.',
    },
    {
      q: 'How do I clear a cached_property?',
      a: 'del obj.name removes the stored value; the next access recomputes it. If it may not have been computed yet, use obj.__dict__.pop("name", None), which never raises.',
    },
    {
      q: 'Why does cached_property fail with __slots__?',
      a: "It stores the value in the instance __dict__. A class whose __slots__ does not include '__dict__' has none, so the first access raises TypeError.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.cached_property',
    meta:  'functools.cached_property',
  },
};
