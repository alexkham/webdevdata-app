// content/reference/python/stdlib/sys/intern.js

export const meta = {
  slug:        'intern',
  name:        'sys.intern / getunicodeinternedsize',
  signature:   'sys.intern(string) · sys.getunicodeinternedsize()',
  blurb:       'Store one shared copy of a string: intern() returns the canonical object for its value, so equal interned strings are the same object. getunicodeinternedsize() (3.12+) counts the interned strings.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'intern 3.0+ (builtin intern() in Python 2) · getunicodeinternedsize 3.12+',
  searchTerms: 'sys.intern intern sys.getunicodeinternedsize getunicodeinternedsize string interning python is vs == strings identity same object memory dictionary keys pointer compare',
};

export const method = {
  slug:      'intern',
  name:      'sys.intern / getunicodeinternedsize',
  signature: 'sys.intern(string) · sys.getunicodeinternedsize()',
  returns:   { type: 'str · int', desc: 'intern: the interned string (the argument itself or an equal string already interned). getunicodeinternedsize: how many strings are interned.' },

  category:    'sys function',
  version:     'intern 3.0+ (builtin intern() in Python 2) · getunicodeinternedsize 3.12+',
  hasLiveDemo: false,

  subtitle: 'Python already interns the names used in programs and the keys of module, class and instance attribute dicts. intern() lets you do the same for strings built at run time — saving memory when the same value repeats many times and making dict lookups compare pointers first.',

  covers: ['intern', 'getunicodeinternedsize'],

  cheat: {
    commonCall: 'key = sys.intern(field_name)',
    returns:    'str — the canonical copy',
    replaces:   'A hand-made {s: s} cache of strings',
    watchOut:   'Interning never makes "is" a correct way to compare strings',
  },

  parameters: [
    { name: 'string', type: 'str', required: true, default: null, desc: 'An exact str (subclasses and bytes are rejected).' },
  ],

  patterns: [
    {
      name: 'Deduplicate repeated field values while parsing',
      desc: 'Millions of rows with the same few category strings share one object each.',
      code: "import csv, sys\nrows = [\n    {sys.intern(k): sys.intern(v) for k, v in row.items()}\n    for row in csv.DictReader(f)\n]",
    },
    {
      name: 'Keep the reference',
      desc: 'An interned string is freed when nothing refers to it any more; intern once and keep the result.',
      code: "import sys\nSTATUS_OK = sys.intern('ok')",
    },
  ],

  examples: [
    { title: 'Equal interned strings are one object', code: "import sys\na = sys.intern(''.join(['py', 'thon']))\nb = sys.intern('python')\na is b", returns: 'True' },
    { title: 'Without intern: equal, not identical', code: "s1 = 'python'\ns2 = ''.join(['py', 'thon'])\n(s1 == s2, s1 is s2)", returns: '(True, False)' },
    { title: 'Only exact str',     code: "import sys\nsys.intern(b'bytes')", returns: 'TypeError: intern() argument must be str, not bytes' },
    { title: 'No str subclasses',  code: "import sys\nclass Name(str):\n    pass\nsys.intern(Name('x'))", returns: "TypeError: can't intern Name" },
    { title: 'The table grows',    code: "import sys\nbefore = sys.getunicodeinternedsize()\nkept = sys.intern('interned-demo-' + str(id(object())))\nsys.getunicodeinternedsize() > before", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Comparing strings with is',
      desc: 'Whether two equal strings are the same object is an implementation detail. Always compare values with ==.',
      wrong: { label: 'is', code: "a = 'hello world!'\nb = ''.join(['hello ', 'world!'])\na is b", output: 'False' },
      fix:   { label: '==', code: "a = 'hello world!'\nb = ''.join(['hello ', 'world!'])\na == b", output: 'True' },
    },
    {
      name: 'Interning bytes',
      desc: 'Only str can be interned. Decode first, or keep your own dict cache for bytes.',
      wrong: { label: 'bytes', code: "import sys\nsys.intern(b'key')", output: 'TypeError: intern() argument must be str, not bytes' },
      fix:   { label: 'str', code: "import sys\nsys.intern(b'key'.decode()) is sys.intern('key')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Large data sets with many repeated string values (parsed CSV/JSON fields, tokens, tags)',
      'Strings used as dict keys in hot lookups',
    ],
    avoid: [
      'Comparing strings → == (interned or not)',
      'Few or unique strings → no benefit, just a table lookup',
    ],
  },

  notes: {
    cpython:          'Objects/unicodeobject.c (PyUnicode_InternInPlace); names used in programs are interned automatically, and module, class and instance attribute dicts have interned keys',
    'Lifetime':       'Interned strings are not immortal (docs, 3.13): an interned string is freed when its last reference goes away',
    'getunicodeinternedsize': 'Added in 3.12 for debugging; the count includes the many strings the interpreter interns itself',
    'Private helper': 'sys._is_interned(s) (3.13, CPython detail) tells whether a string is interned',
  },

  related: [
    { name: 'sys.getsizeof', slug: 'getsizeof', when: 'Measure the memory a string takes' },
    { name: 'str',           slug: 'str',       when: 'The type intern works on', category: 'functions' },
    { name: 'id()',          slug: 'id',        when: 'See object identity', category: 'functions' },
    { name: 'sys module',    slug: 'sys',       when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does sys.intern do in Python?',
      a: 'It returns a canonical copy of the string from an interpreter-wide table, adding it if needed. Interning equal strings yields the same object, which saves memory for repeated values and speeds up dict key comparison.',
    },
    {
      q: 'Why is "a is b" sometimes True for equal strings?',
      a: 'CPython interns identifier-like literals and some other strings automatically, so they may be shared. It is not guaranteed — strings built at run time are usually separate objects. Use == to compare values.',
    },
    {
      q: 'Does sys.intern save memory?',
      a: 'Yes when the same value occurs many times: all occurrences share one object instead of each holding its own copy. For unique strings it saves nothing.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.intern',
    meta:  'sys.intern',
  },
};
