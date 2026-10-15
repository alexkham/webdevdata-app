// content/reference/python/stdlib/operator/attrgetter.js

export const meta = {
  slug:        'attrgetter',
  name:        'operator.attrgetter',
  signature:   'operator.attrgetter(attr, /, *attrs)',
  blurb:       'A callable that fetches obj.attr — dotted paths like "address.city" included — or a tuple of several attributes. The sort key for objects.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'operator.attrgetter attrgetter python sort list of objects by attribute sort by multiple attributes dataclass sort key nested attribute dotted name attrgetter vs lambda max by attribute attribute name must be a string has no attribute did you mean',
};

export const method = {
  slug:      'attrgetter',
  name:      'operator.attrgetter',
  signature: 'operator.attrgetter(attr, /, *attrs)',
  returns:   { type: 'operator.attrgetter', desc: 'A callable g where g(obj) is obj.attr — or a tuple of attributes when several were given. Dots in a name walk nested attributes.' },

  category:    'operator class',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "attrgetter('age') is lambda u: u.age written in C; attrgetter('age', 'name') returns a tuple; attrgetter('address.city') follows the dots. Names are checked to be strings when the getter is created, and looked up only when it is called.",

  covers: ['attrgetter'],

  cheat: {
    commonCall: "sorted(users, key=attrgetter('age', 'name'))",
    returns:    'obj.attr, or a tuple for several names',
    replaces:   'lambda u: u.age, lambda u: (u.age, u.name)',
    watchOut:   'No default for a missing attribute — it raises AttributeError',
  },

  parameters: [
    { name: 'attr',   type: 'str', required: true,  default: null, desc: "An attribute name; dots separate a path of nested attributes ('address.city')." },
    { name: '*attrs', type: 'str', required: false, default: null, desc: 'More names; with any of them the call returns a tuple of values in this order.' },
  ],

  modes: [
    {
      id: 'sort',
      label: 'sort objects',
      blurb: 'Dataclass records sorted by one or more attributes (comma-separated).',
      params: [
        { name: 'names', type: 'list[str]',         hint: 'comma-separated', input: 'csv' },
        { name: 'ages',  type: 'list[int | float]', hint: 'comma-separated', input: 'csv-num' },
        { name: 'attrs', type: 'list[str]',         hint: "'age', 'name'",   input: 'csv' },
      ],
      template: "from dataclasses import dataclass\nfrom operator import attrgetter\n@dataclass\nclass User:\n    name: str\n    age: int\nusers = [User(n, a) for n, a in zip({$names}, {$ages})]\nsorted(users, key=attrgetter(*{$attrs}))",
      cases: [
        { id: 'age',  label: 'age',        values: { names: 'Bob, Ann, Cy', ages: '25, 31, 19', attrs: 'age' } },
        { id: 'two',  label: 'age, name',  values: { names: 'Cy, Ann, Bob', ages: '25, 31, 25', attrs: 'age, name' } },
        { id: 'typo', label: 'typo nme',   values: { names: 'Bob, Ann', ages: '25, 31', attrs: 'nme' } },
        { id: 'dot',  label: 'age.real',   values: { names: 'Bob, Ann', ages: '25, 19.5', attrs: 'age.real' } },
      ],
    },
    {
      id: 'get',
      label: 'repr and result',
      blurb: 'The getter itself and what it returns for one record.',
      params: [
        { name: 'attrs', type: 'list[str]',         hint: 'comma-separated', input: 'csv' },
        { name: 'name',  type: 'str',               hint: 'User.name',       input: 'text' },
        { name: 'age',   type: 'int | float | str', hint: 'User.age',        input: 'auto' },
      ],
      template: "from dataclasses import dataclass\nfrom operator import attrgetter\n@dataclass\nclass User:\n    name: str\n    age: int\nf = attrgetter(*{$attrs})\n(f, f(User({$name}, {$age})))",
      cases: [
        { id: 'one',   label: 'one name',   values: { attrs: 'name', name: 'Ann', age: '31' } },
        { id: 'two',   label: 'two names',  values: { attrs: 'name, age', name: 'Ann', age: '31' } },
        { id: 'path',  label: 'dotted',     values: { attrs: 'age.denominator, age.real', name: 'Ann', age: '31' } },
        { id: 'empty', label: 'no names',   values: { attrs: '', name: 'Ann', age: '31' } },
      ],
    },
  ],
  demoExplainer: "A tuple key compares field by field, so with 'age, name' the two 25-year-olds come out in name order. A misspelt name fails only when the getter is called, with AttributeError — Python 3.13's traceback adds \"Did you mean: 'name'?\" when a close attribute exists. Dotted names walk into the value: 'age.real' reads the age's own .real attribute (an int's real part is the int itself). With no names at all, attrgetter() fails at creation. (The demo stops when a name resolves to a bound method such as 'name.upper': its repr contains a memory address.)",

  patterns: [
    {
      name: 'Sort objects by several attributes',
      desc: 'Tuple keys compare in order; reverse=True reverses the whole key.',
      code: "from operator import attrgetter\nemployees.sort(key=attrgetter('dept', 'salary'))",
    },
    {
      name: 'Sort by a nested attribute',
      desc: 'Dots walk the path at call time.',
      code: "from operator import attrgetter\nby_city = sorted(orders, key=attrgetter('customer.address.city'))",
    },
    {
      name: 'Newest / cheapest object',
      desc: 'max and min take the same key functions as sorted.',
      code: "from operator import attrgetter\nlatest = max(posts, key=attrgetter('published'))\ncheapest = min(offers, key=attrgetter('price'))",
    },
    {
      name: 'Extract a column of attributes',
      desc: 'map with a getter — or a comprehension.',
      code: "from operator import attrgetter\nemails = list(map(attrgetter('email'), users))",
    },
  ],

  examples: [
    { title: 'Sort objects by two attributes', code: "from operator import attrgetter\nfrom types import SimpleNamespace\nusers = [SimpleNamespace(name='Bob', age=25), SimpleNamespace(name='Ann', age=31), SimpleNamespace(name='Cy', age=25)]\n[u.name for u in sorted(users, key=attrgetter('age', 'name'))]", returns: "['Bob', 'Cy', 'Ann']" },
    { title: 'Dotted path',                    code: "from operator import attrgetter\nfrom types import SimpleNamespace\np = SimpleNamespace(address=SimpleNamespace(city='Oslo'))\nattrgetter('address.city')(p)", returns: "'Oslo'" },
    { title: 'Works on any object',            code: "from operator import attrgetter\nfrom datetime import date\nattrgetter('year', 'month')(date(2026, 10, 13))", returns: '(2026, 10)' },
    { title: 'Parts of a complex number',      code: "from operator import attrgetter\nattrgetter('real', 'imag')(3 + 4j)", returns: '(3.0, 4.0)' },
    { title: 'min by attribute',               code: "from operator import attrgetter\nfrom types import SimpleNamespace\nmin([SimpleNamespace(n='x', price=9.5), SimpleNamespace(n='y', price=3.0)], key=attrgetter('price')).n", returns: "'y'" },
    { title: 'The repr keeps the dots',        code: "from operator import attrgetter\nattrgetter('name'), attrgetter('a.b', 'c')", returns: "(operator.attrgetter('name'), operator.attrgetter('a.b', 'c'))" },
    { title: 'Typos get a hint (3.13 traceback)', code: "from dataclasses import dataclass\nfrom operator import attrgetter\n@dataclass\nclass User:\n    name: str\n    age: int\nattrgetter('nme')(User('Ann', 31))", returns: "AttributeError: 'User' object has no attribute 'nme'. Did you mean: 'name'?" },
  ],

  pitfalls: [
    {
      name: 'Expecting a default for a missing attribute',
      desc: 'attrgetter is getattr without the third argument. Use getattr(obj, name, default) in a lambda for optional attributes.',
      wrong: { label: "attrgetter('address.zip')", code: "from operator import attrgetter\nfrom types import SimpleNamespace\nattrgetter('address.zip')(SimpleNamespace(address=SimpleNamespace(city='Oslo')))", output: "AttributeError: 'types.SimpleNamespace' object has no attribute 'zip'" },
      fix:   { label: 'getattr(..., default)',     code: "from types import SimpleNamespace\np = SimpleNamespace(address=SimpleNamespace(city='Oslo'))\ngetattr(p.address, 'zip', 'no zip')", output: "'no zip'" },
    },
    {
      name: 'Passing something other than a name',
      desc: 'attrgetter takes attribute NAMES (strings). To call a function on each object, use the function itself as the key.',
      wrong: { label: 'attrgetter(len)', code: 'from operator import attrgetter\nattrgetter(len)', output: 'TypeError: attribute name must be a string' },
      fix:   { label: 'key=len',         code: "sorted(['ccc', 'a', 'bb'], key=len)", output: "['a', 'bb', 'ccc']" },
    },
  ],

  when: {
    use: [
      'Sort, min, max and groupby keys over objects: dataclasses, namedtuples, ORM rows, datetimes',
      'Nested attribute paths without a chain of lambdas',
    ],
    avoid: [
      'dicts → itemgetter (dict keys are not attributes)',
      'Optional attributes or computed keys → lambda with getattr(obj, name, default)',
    ],
  },

  notes: {
    cpython:   'Modules/_operator.c: the C type operator.attrgetter splits dotted names once, at creation, and calls PyObject_GetAttr for each part at call time',
    'Checks':  'Non-string names raise TypeError when the getter is created; missing attributes raise AttributeError when it is called',
    'Did you mean': "The hint is not part of the exception message (str(e) lacks it): the traceback display adds it, since 3.10. Python 3.13 finds close names that 3.12 does not suggest, so the same typo may show no hint on older versions",
  },

  related: [
    { name: 'itemgetter',   slug: 'itemgetter',   when: 'The same for keys and indexes' },
    { name: 'methodcaller', slug: 'methodcaller', when: 'Call a method instead of reading an attribute' },
    { name: 'getattr()',    slug: 'getattr',      when: 'One lookup, with an optional default', category: 'functions' },
    { name: 'sorted()',     slug: 'sorted',       when: 'Where the key goes',                   category: 'functions' },
    { name: 'max()',        slug: 'max',          when: 'Largest object by an attribute',       category: 'functions' },
    { name: 'min()',        slug: 'min',          when: 'Smallest object by an attribute',      category: 'functions' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What a missing attribute raises', category: 'exceptions' },
    { name: 'dataclasses',  slug: 'dataclasses',  when: 'Records the demo sorts',               category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I sort a list of objects by an attribute in Python?',
      a: "sorted(objects, key=attrgetter('age')) after from operator import attrgetter, or objects.sort(key=...) in place. attrgetter('age', 'name') sorts by age, then name; add reverse=True for descending order.",
    },
    {
      q: 'Can attrgetter access nested attributes?',
      a: "Yes: attrgetter('address.city')(obj) is obj.address.city. Each dotted name walks one attribute per part, and several dotted names give a tuple.",
    },
    {
      q: 'What is the difference between attrgetter and getattr?',
      a: 'getattr(obj, name[, default]) does one lookup now and can return a default. attrgetter(name) returns a reusable callable — no default, but dotted paths and several names — which is what key= arguments need.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.attrgetter',
    meta:  'operator.attrgetter',
  },
};
