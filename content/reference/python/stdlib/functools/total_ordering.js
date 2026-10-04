// content/reference/python/stdlib/functools/total_ordering.js

export const meta = {
  slug:        'total_ordering',
  name:        'functools.total_ordering',
  signature:   '@functools.total_ordering',
  blurb:       'Class decorator: define __eq__ and ONE of __lt__, __le__, __gt__, __ge__, and it fills in the other three comparisons.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'functools total_ordering rich comparison methods __lt__ __eq__ __le__ __gt__ __ge__ sortable class compare objects python comparison decorator must define at least one ordering operation',
};

export const method = {
  slug:      'total_ordering',
  name:      'functools.total_ordering',
  signature: '@functools.total_ordering',
  returns:   { type: 'type', desc: 'The same class, with the missing ordering methods added.' },

  category:    'functools decorator',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Writing all six comparison methods is tedious and easy to get inconsistent. Write __eq__ and __lt__, decorate the class, and <=, > and >= are derived from them.',

  covers: ['total_ordering'],

  cheat: {
    commonCall: '@total_ordering\nclass Version: __eq__ + __lt__',
    returns:    'the class with __le__, __gt__, __ge__ added',
    replaces:   'hand-writing four more comparison methods',
    watchOut:   'derived methods are slower — two calls instead of one',
  },

  parameters: [
    { name: 'cls', type: 'type', required: true, default: null, desc: 'A class defining at least one of __lt__, __le__, __gt__, __ge__ (and normally __eq__).' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'compare two versions',
      blurb: 'Version defines only __eq__ and __lt__; the other three operators come from total_ordering.',
      params: [
        { name: 'a', type: 'str', hint: 'version a, e.g. 1.2.10', input: 'text' },
        { name: 'b', type: 'str', hint: 'version b',              input: 'text' },
      ],
      template: "from functools import total_ordering\n@total_ordering\nclass Version:\n    def __init__(self, text):\n        self.text = text\n        self.parts = tuple(int(p) for p in text.split('.'))\n    def __eq__(self, other):\n        return self.parts == other.parts\n    def __lt__(self, other):\n        return self.parts < other.parts\na, b = Version({$a}), Version({$b})\na < b, a <= b, a > b, a >= b, a == b",
      cases: [
        { id: 'ten',   label: '1.2.10 vs 1.2.9', values: { a: '1.2.10', b: '1.2.9' } },
        { id: 'equal', label: 'equal parts',     values: { a: '1.02', b: '1.2' } },
        { id: 'short', label: 'prefix',          values: { a: '1.2', b: '1.2.0' } },
        { id: 'bad',   label: 'not a number',    values: { a: '1.x', b: '1.0' } },
      ],
    },
    {
      id: 'max',
      label: 'max() of versions',
      blurb: 'max() compares with >, which total_ordering derived from __lt__ and __eq__.',
      params: [{ name: 'versions', type: 'list[str]', hint: 'comma-separated versions', input: 'csv' }],
      template: "from functools import total_ordering\n@total_ordering\nclass Version:\n    def __init__(self, text):\n        self.text = text\n        self.parts = tuple(int(p) for p in text.split('.'))\n    def __eq__(self, other):\n        return self.parts == other.parts\n    def __lt__(self, other):\n        return self.parts < other.parts\nmax(Version(v) for v in {$versions}).text",
      cases: [
        { id: 'semver', label: 'releases',   values: { versions: '1.9, 1.10, 1.2.3' } },
        { id: 'tie',    label: 'equal ones', values: { versions: '2.0, 2.00, 1.5' } },
        { id: 'empty',  label: 'empty',      values: { versions: '' } },
      ],
    },
  ],
  demoExplainer: 'Comparing tuples of ints gives the order people expect from version numbers: 1.2.10 > 1.2.9, while the strings would sort the other way. "1.02" and "1.2" have equal parts, so == is True. A prefix is smaller: (1, 2) < (1, 2, 0). For equal maxima, max() keeps the first one it saw ("2.0"). A part that is not an integer fails in int(): "invalid literal for int() with base 10: \'x\'".',

  patterns: [
    {
      name: 'Sortable value class',
      desc: 'Compare on a tuple of fields; return NotImplemented for foreign types.',
      code: 'from functools import total_ordering\n@total_ordering\nclass Card:\n    def __init__(self, rank, suit):\n        self.rank, self.suit = rank, suit\n    def __eq__(self, other):\n        if not isinstance(other, Card):\n            return NotImplemented\n        return (self.rank, self.suit) == (other.rank, other.suit)\n    def __lt__(self, other):\n        if not isinstance(other, Card):\n            return NotImplemented\n        return (self.rank, self.suit) < (other.rank, other.suit)',
    },
    {
      name: 'Dataclass alternative',
      desc: 'order=True generates all four methods from the fields, in field order.',
      code: 'from dataclasses import dataclass\n@dataclass(order=True)\nclass Version:\n    major: int\n    minor: int\n    patch: int = 0',
    },
  ],

  examples: [
    { title: 'Derived <= and >',            code: "from functools import total_ordering\n@total_ordering\nclass N:\n    def __init__(self, v):\n        self.v = v\n    def __eq__(self, o):\n        return self.v == o.v\n    def __lt__(self, o):\n        return self.v < o.v\nN(1) <= N(2), N(1) > N(2), N(2) >= N(2)", returns: '(True, False, True)' },
    { title: 'Which methods were added',    code: "from functools import total_ordering\n@total_ordering\nclass N:\n    def __eq__(self, o):\n        return True\n    def __lt__(self, o):\n        return False\nsorted(k for k in vars(N) if k in ('__lt__', '__le__', '__gt__', '__ge__'))", returns: "['__ge__', '__gt__', '__le__', '__lt__']" },
    { title: 'sorted() needs only __lt__',  code: "class N:\n    def __init__(self, v):\n        self.v = v\n    def __lt__(self, o):\n        return self.v < o.v\n[n.v for n in sorted([N(3), N(1), N(2)])]", returns: '[1, 2, 3]' },
    { title: 'Without the decorator, <= is missing', code: "class N:\n    def __init__(self, v):\n        self.v = v\n    def __lt__(self, o):\n        return self.v < o.v\nN(1) <= N(2)", returns: "TypeError: '<=' not supported between instances of 'N' and 'N'" },
    { title: 'At least one ordering method needed', code: "from functools import total_ordering\n@total_ordering\nclass N:\n    def __eq__(self, o):\n        return True", returns: 'ValueError: must define at least one ordering operation: < > <= >=' },
  ],

  pitfalls: [
    {
      name: 'Forgetting __eq__',
      desc: 'Without __eq__, == falls back to identity, so <= and >= derived from < and == disagree with your ordering for equal values.',
      wrong: { label: 'no __eq__', code: "from functools import total_ordering\n@total_ordering\nclass N:\n    def __init__(self, v):\n        self.v = v\n    def __lt__(self, o):\n        return self.v < o.v\nN(2) <= N(2)", output: 'False' },
      fix:   { label: 'with __eq__', code: "from functools import total_ordering\n@total_ordering\nclass N:\n    def __init__(self, v):\n        self.v = v\n    def __eq__(self, o):\n        return self.v == o.v\n    def __lt__(self, o):\n        return self.v < o.v\nN(2) <= N(2)", output: 'True' },
    },
    {
      name: 'Comparing with other types',
      desc: 'Return NotImplemented for foreign types; then Python tries the reflected operation and finally raises a clear TypeError instead of an AttributeError from inside your method.',
      wrong: { label: 'assumes .v', code: "from functools import total_ordering\n@total_ordering\nclass N:\n    def __init__(self, v):\n        self.v = v\n    def __eq__(self, o):\n        return self.v == o.v\n    def __lt__(self, o):\n        return self.v < o.v\nN(1) < 5", output: "AttributeError: 'int' object has no attribute 'v'" },
      fix:   { label: 'NotImplemented', code: "from functools import total_ordering\n@total_ordering\nclass N:\n    def __init__(self, v):\n        self.v = v\n    def __eq__(self, o):\n        return self.v == o.v if isinstance(o, N) else NotImplemented\n    def __lt__(self, o):\n        return self.v < o.v if isinstance(o, N) else NotImplemented\nN(1) < 5", output: "TypeError: '<' not supported between instances of 'N' and 'int'" },
    },
  ],

  when: {
    use: [
      'Small value classes that must be sortable and comparable',
      'Classes where one comparison is natural and the rest follow',
    ],
    avoid: [
      'Plain data records → @dataclass(order=True)',
      'Hot paths: the derived methods cost an extra call — define all four yourself',
    ],
  },

  notes: {
    cpython:      'Pure Python in Lib/functools.py: a table maps each root method (__lt__, __le__, __gt__, __ge__) to the three derived ones',
    'Root choice': 'Every ordering method not inherited from object counts as user-defined and is kept; the root for the missing ones is the first of __lt__, __le__, __gt__, __ge__ that exists',
    'NotImplemented': 'Since 3.4 a NotImplemented from the root method is passed through by the derived ones',
  },

  related: [
    { name: 'functools.cmp_to_key', slug: 'cmp_to_key', when: 'Sort by a comparator without changing the class' },
    { name: 'sorted()',             slug: 'sorted',     when: 'Uses only <', category: 'functions' },
    { name: '< (less than)',        slug: 'lt',         when: 'The operator behind __lt__', category: 'operators' },
    { name: 'NotImplementedError',  slug: 'notimplementederror', when: 'Not to be confused with the NotImplemented constant', category: 'exceptions' },
    { name: 'functools module',     slug: 'functools',  when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Which methods do I need to define for functools.total_ordering?',
      a: 'At least one of __lt__, __le__, __gt__ or __ge__, and you should also define __eq__. The decorator supplies the remaining ordering methods.',
    },
    {
      q: 'What does "must define at least one ordering operation: < > <= >=" mean?',
      a: 'The decorated class has none of __lt__, __le__, __gt__, __ge__ other than the ones inherited from object. Define one of them.',
    },
    {
      q: 'Is total_ordering slower than writing all comparison methods?',
      a: 'Yes, the derived methods call your root method (and sometimes __eq__) instead of comparing directly. It rarely matters; when it does, write the four methods yourself.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.total_ordering',
    meta:  'functools.total_ordering',
  },
};
