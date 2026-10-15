// content/reference/python/stdlib/operator/itemgetter.js

export const meta = {
  slug:        'itemgetter',
  name:        'operator.itemgetter',
  signature:   'operator.itemgetter(item, /, *items)',
  blurb:       'A callable that fetches obj[item] — or a tuple of several items. The standard sort key for lists of dicts and tuples.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'operator.itemgetter itemgetter python sort list of dicts by key sort list of tuples by second element sort by multiple keys itemgetter vs lambda max by key dict values sort dict by value key function itemgetter expected 1 argument',
};

export const method = {
  slug:      'itemgetter',
  name:      'operator.itemgetter',
  signature: 'operator.itemgetter(item, /, *items)',
  returns:   { type: 'operator.itemgetter', desc: 'A callable g where g(obj) is obj[item] — or the tuple (obj[i1], obj[i2], …) when several items were given.' },

  category:    'operator class',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "itemgetter('age') is a ready-made lambda r: r['age'], written in C. Give it several keys and every call returns a tuple — exactly what sorted() needs to sort by one field, then another.",

  covers: ['itemgetter'],

  cheat: {
    commonCall: "sorted(rows, key=itemgetter('age', 'name'))",
    returns:    'obj[item], or a tuple for several items',
    replaces:   "lambda r: r['age'], lambda r: (r['age'], r['name'])",
    watchOut:   'One item → a plain value, two or more → a tuple',
  },

  parameters: [
    { name: 'item',  type: 'any (hashable key, int index, slice)', required: true,  default: null, desc: 'What to look up with obj[item]: a dict key, a sequence index or a slice object.' },
    { name: '*items', type: 'any',                                required: false, default: null, desc: 'More items; with any of them the call returns a tuple of lookups in this order.' },
  ],

  modes: [
    {
      id: 'dicts',
      label: 'list of dicts',
      blurb: 'Sort dict rows by one key, or by several (comma-separated).',
      params: [
        { name: 'names', type: 'list[str]',         hint: 'comma-separated', input: 'csv' },
        { name: 'ages',  type: 'list[int | float]', hint: 'comma-separated', input: 'csv-num' },
        { name: 'keys',  type: 'list[str]',         hint: "'age', 'name'",   input: 'csv' },
      ],
      template: "from operator import itemgetter\nrows = [{'name': n, 'age': a} for n, a in zip({$names}, {$ages})]\nsorted(rows, key=itemgetter(*{$keys}))",
      cases: [
        { id: 'age',     label: 'age',        values: { names: 'Bob, Ann, Cy', ages: '25, 31, 25', keys: 'age' } },
        { id: 'two',     label: 'age, name',  values: { names: 'Cy, Ann, Bob', ages: '25, 31, 25', keys: 'age, name' } },
        { id: 'missing', label: 'no such key', values: { names: 'Bob, Ann', ages: '25, 31', keys: 'email' } },
        { id: 'none',    label: 'no keys',    values: { names: 'Bob, Ann', ages: '25, 31', keys: '' } },
      ],
    },
    {
      id: 'tuples',
      label: 'list of tuples',
      blurb: 'The same data as (name, age) tuples: the items are now positions.',
      params: [
        { name: 'names',   type: 'list[str]',         hint: 'comma-separated', input: 'csv' },
        { name: 'ages',    type: 'list[int | float]', hint: 'comma-separated', input: 'csv-num' },
        { name: 'indexes', type: 'list[int]',         hint: '1 or 1, 0',      input: 'csv-num' },
      ],
      template: 'from operator import itemgetter\nrows = list(zip({$names}, {$ages}))\nsorted(rows, key=itemgetter(*{$indexes}))',
      cases: [
        { id: 'second', label: 'by age',      values: { names: 'Bob, Ann, Cy', ages: '25, 31, 19', indexes: '1' } },
        { id: 'neg',    label: 'index -1',    values: { names: 'Bob, Ann, Cy', ages: '25, 31, 19', indexes: '-1' } },
        { id: 'out',    label: 'index 2',     values: { names: 'Bob, Ann', ages: '25, 31', indexes: '2' } },
        { id: 'float',  label: 'index 1.5',   values: { names: 'Bob, Ann', ages: '25, 31', indexes: '1.5' } },
      ],
    },
    {
      id: 'pick',
      label: 'repr and result',
      blurb: 'What the callable looks like, and what one call returns on a string.',
      params: [
        { name: 'indexes', type: 'list[int]', hint: 'comma-separated', input: 'csv-num' },
        { name: 'text',    type: 'str',       hint: 'the operand',     input: 'text' },
      ],
      template: 'from operator import itemgetter\nf = itemgetter(*{$indexes})\n(f, f({$text}))',
      cases: [
        { id: 'one',  label: 'one index',     values: { indexes: '1', text: 'ABCDEFG' } },
        { id: 'many', label: 'three indexes', values: { indexes: '1, 3, 5', text: 'ABCDEFG' } },
        { id: 'ends', label: 'first and last', values: { indexes: '0, -1', text: 'hello' } },
      ],
    },
  ],
  demoExplainer: "With one key the sort key is a plain value; with 'age, name' each key is a tuple, compared field by field, so Bob and Cy (both 25) are ordered by name. sorted() is stable: with a single key, equal ages keep their input order. A key that is missing raises KeyError, an index past the end of the tuple raises IndexError, and a float index is a TypeError — itemgetter only performs obj[item]. An empty key list fails when itemgetter() is created: it needs at least one item. The repr lists the items exactly as they were given.",

  patterns: [
    {
      name: 'Sort by several fields',
      desc: 'Tuple keys compare field by field. For mixed directions, sort twice (stable sort: secondary key first).',
      code: "from operator import itemgetter\nrows.sort(key=itemgetter('last', 'first'))\nrows.sort(key=itemgetter('name'))\nrows.sort(key=itemgetter('score'), reverse=True)   # score desc, then name asc",
    },
    {
      name: 'Sort a dict by value',
      desc: 'items() gives (key, value) pairs; itemgetter(1) is the value.',
      code: 'from operator import itemgetter\nranked = sorted(scores.items(), key=itemgetter(1), reverse=True)',
    },
    {
      name: 'Pick several fields at once',
      desc: 'A multi-item getter unpacks nicely.',
      code: "from operator import itemgetter\nget_addr = itemgetter('host', 'port')\nhost, port = get_addr(config)",
    },
    {
      name: 'Group rows by a field',
      desc: 'groupby needs the rows sorted by the same key.',
      code: "from itertools import groupby\nfrom operator import itemgetter\nkey = itemgetter('dept')\nfor dept, people in groupby(sorted(rows, key=key), key=key):\n    print(dept, len(list(people)))",
    },
  ],

  examples: [
    { title: 'Index, several indexes, slice', code: "from operator import itemgetter\nitemgetter(1)('ABCDEFG'), itemgetter(1, 3, 5)('ABCDEFG'), itemgetter(slice(2, None))('ABCDEFG')", returns: "('B', ('B', 'D', 'F'), 'CDEFG')" },
    { title: 'Sort dicts by two keys',        code: "from operator import itemgetter\nrows = [{'name': 'Bob', 'age': 25}, {'name': 'Ann', 'age': 31}, {'name': 'Cy', 'age': 25}]\nsorted(rows, key=itemgetter('age', 'name'))", returns: "[{'name': 'Bob', 'age': 25}, {'name': 'Cy', 'age': 25}, {'name': 'Ann', 'age': 31}]" },
    { title: 'map and max with one getter',   code: "from operator import itemgetter\ninventory = [('apple', 3), ('banana', 2), ('pear', 5), ('orange', 1)]\ngetcount = itemgetter(1)\nlist(map(getcount, inventory)), max(inventory, key=getcount)", returns: "([3, 2, 5, 1], ('pear', 5))" },
    { title: 'Sort a dict by value',          code: "from operator import itemgetter\ndata = {'b': 2, 'a': 3, 'c': 1}\nsorted(data.items(), key=itemgetter(1), reverse=True)", returns: "[('a', 3), ('b', 2), ('c', 1)]" },
    { title: 'Unpack two fields',             code: "from operator import itemgetter\nget = itemgetter('host', 'port')\nhost, port = get({'host': 'localhost', 'port': 8080, 'debug': True})\nhost, port", returns: "('localhost', 8080)" },
    { title: 'The repr shows the items',      code: "from operator import itemgetter\nitemgetter(1, 'a'), itemgetter(slice(1, 2))", returns: "(operator.itemgetter(1, 'a'), operator.itemgetter(slice(1, 2, None)))" },
    { title: 'Getters do not compare equal',  code: 'from operator import itemgetter\ntype(itemgetter(0)).__name__, itemgetter(0) == itemgetter(0)', returns: "('itemgetter', False)" },
  ],

  pitfalls: [
    {
      name: 'A dynamic list of one key gives a scalar, not a tuple',
      desc: 'itemgetter(*cols) changes shape with the number of columns: one column returns the value itself. Build the tuple yourself when the caller expects one.',
      wrong: { label: 'itemgetter(*cols)', code: "from operator import itemgetter\ncols = ['age']\nrow = {'name': 'Ann', 'age': 31}\nitemgetter(*cols)(row)", output: '31' },
      fix:   { label: 'tuple(...)',        code: "cols = ['age']\nrow = {'name': 'Ann', 'age': 31}\ntuple(row[c] for c in cols)", output: '(31,)' },
    },
    {
      name: 'An empty key list',
      desc: 'itemgetter needs at least one item, and the error comes at creation time.',
      wrong: { label: 'itemgetter(*[])', code: 'from operator import itemgetter\ncols = []\nitemgetter(*cols)', output: 'TypeError: itemgetter expected 1 argument, got 0' },
      fix:   { label: 'guard it',         code: "from operator import itemgetter\ncols = []\nkey = itemgetter(*cols) if cols else None\nsorted([3, 1, 2], key=key)", output: '[1, 2, 3]' },
    },
    {
      name: 'Records that lack the key',
      desc: 'itemgetter has no default — any row without the key raises KeyError. Use dict.get in a lambda.',
      wrong: { label: "itemgetter('age')", code: "from operator import itemgetter\nrows = [{'name': 'Ann', 'age': 31}, {'name': 'Bob'}]\nsorted(rows, key=itemgetter('age'))", output: "KeyError: 'age'" },
      fix:   { label: "r.get('age', 0)",   code: "rows = [{'name': 'Ann', 'age': 31}, {'name': 'Bob'}]\nsorted(rows, key=lambda r: r.get('age', 0))", output: "[{'name': 'Bob'}, {'name': 'Ann', 'age': 31}]" },
    },
  ],

  when: {
    use: [
      'Sort, min, max, groupby keys over dicts, tuples, lists or any subscriptable record',
      'Pulling the same fields out of many records (map, unpacking)',
    ],
    avoid: [
      'Objects with attributes → attrgetter',
      'Keys that need a default, a conversion or a computation → lambda',
    ],
  },

  notes: {
    cpython:   "Modules/_operator.c: the C type operator.itemgetter (Lib/operator.py has a pure-Python class used only without the C module)",
    'Shape':   'itemgetter(x)(obj) is obj[x]; itemgetter(x, y)(obj) is (obj[x], obj[y]) — a 1-tuple never comes back',
    'Equality': 'Getters have no __eq__: two itemgetter(0) objects are not equal, so compare them by repr if you must',
    'Pickling': 'itemgetter, attrgetter and methodcaller objects can be pickled (they define __reduce__), unlike lambdas',
  },

  related: [
    { name: 'attrgetter',    slug: 'attrgetter',   when: 'The same for attributes' },
    { name: 'methodcaller',  slug: 'methodcaller', when: 'Call a method as the key' },
    { name: 'getitem()',     slug: 'sequences',    when: 'operator.getitem — one lookup, two arguments' },
    { name: 'sorted()',      slug: 'sorted',       when: 'Where the key goes',              category: 'functions' },
    { name: 'max()',         slug: 'max',          when: 'Largest record by a field',       category: 'functions' },
    { name: 'min()',         slug: 'min',          when: 'Smallest record by a field',      category: 'functions' },
    { name: 'list.sort()',   slug: 'list-sort',    when: 'Sort in place with the same key', category: 'functions' },
    { name: 'itertools.groupby', slug: 'groupby',  when: 'Group rows by an itemgetter key', category: 'stdlib/itertools' },
  ],

  faq: [
    {
      q: 'How do I sort a list of tuples by the second element?',
      a: 'sorted(pairs, key=itemgetter(1)) after from operator import itemgetter. itemgetter(1, 0) sorts by the second element, then the first; add reverse=True for descending order.',
    },
    {
      q: 'What is the difference between itemgetter and lambda?',
      a: "itemgetter('age') does the same as lambda r: r['age'] but is implemented in C (usually a bit faster), has a readable repr, can be pickled and returns a tuple for several items. A lambda can do anything else: defaults, conversions, attribute access.",
    },
    {
      q: 'Can itemgetter sort in descending order for one key and ascending for another?',
      a: 'Not in one key. Sort twice, secondary key first, because sorted() is stable: rows.sort(key=itemgetter("name")); rows.sort(key=itemgetter("score"), reverse=True). For numbers you can also negate in a lambda.',
    },
    {
      q: 'Does itemgetter work with slices?',
      a: "Yes — the item can be anything obj[...] accepts, including slice objects: itemgetter(slice(2, None))('ABCDEFG') is 'CDEFG'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.itemgetter',
    meta:  'operator.itemgetter',
  },
};
