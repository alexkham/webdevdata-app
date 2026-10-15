// content/reference/python/stdlib/operator/index.js — the operator module hub

export const meta = {
  slug:        'index',
  name:        'operator',
  signature:   'import operator',
  blurb:       'Every Python operator as a plain function — add, lt, getitem, not_ … — plus itemgetter, attrgetter and methodcaller for sort keys and field extraction.',
  category:    'functional',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python 3 versions (call: 3.11+)',
  searchTerms: 'operator module python operator functions itemgetter attrgetter methodcaller operator.add operator.mul operator.itemgetter sort list of dicts by key sort by attribute functions as arguments reduce operator.mul lambda alternative dispatch table',
};

export const method = {
  slug: 'index',
  name: 'operator',

  category:    'Functional programming',
  version:     'All Python 3 versions (call: 3.11+)',
  hasLiveDemo: true,

  subtitle: 'x + y is operator.add(x, y), x[k] is operator.getitem(x, k), not x is operator.not_(x). Useful wherever Python wants a function — sorted(key=…), map, reduce, dispatch tables — and the three getter classes are the fastest way to write sort keys.',

  imports: ['import operator', 'from operator import itemgetter, attrgetter, methodcaller'],
  facts: [
    { label: 'Public API', value: '55 names: comparisons (lt … gt), truth/identity (not_, truth, is_, is_not), arithmetic and bitwise (add … xor), sequences (concat, contains, getitem …), 14 in-place i* functions, itemgetter, attrgetter, methodcaller, call' },
    { label: 'Speed',      value: 'Implemented in C (the _operator module); Lib/operator.py is the pure-Python fallback that the C versions replace on import' },
    { label: 'Aliases',    value: 'Most functions also exist with double underscores (operator.__add__ is operator.add) — kept for backward compatibility, not listed in __all__' },
    { label: 'Since',      value: 'All Python 3 versions; matmul/imatmul 3.5, length_hint 3.4, call 3.11' },
  ],

  modes: [
    {
      id: 'itemgetter',
      label: 'sort dicts',
      blurb: 'Records as dicts, built from the two lists. Pick the key to sort by.',
      params: [
        { name: 'names', type: 'list[str]',         hint: 'comma-separated', input: 'csv' },
        { name: 'ages',  type: 'list[int | float]', hint: 'comma-separated', input: 'csv-num' },
        { name: 'key',   type: 'str',               hint: "'name' or 'age'", input: 'text' },
      ],
      template: "from operator import itemgetter\nrows = [{'name': n, 'age': a} for n, a in zip({$names}, {$ages})]\nsorted(rows, key=itemgetter({$key}))",
      cases: [
        { id: 'age',     label: 'by age',      values: { names: 'Ann, Bob, Cy, Dee', ages: '31, 25, 31, 19', key: 'age' } },
        { id: 'name',    label: 'by name',     values: { names: 'Ann, Bob, Cy, Dee', ages: '31, 25, 31, 19', key: 'name' } },
        { id: 'missing', label: 'missing key', values: { names: 'Ann, Bob, Cy, Dee', ages: '31, 25, 31, 19', key: 'email' } },
      ],
    },
    {
      id: 'attrgetter',
      label: 'sort objects',
      blurb: 'The same records as dataclass instances; attrgetter reads an attribute instead of a key.',
      params: [
        { name: 'names', type: 'list[str]',         hint: 'comma-separated', input: 'csv' },
        { name: 'ages',  type: 'list[int | float]', hint: 'comma-separated', input: 'csv-num' },
        { name: 'attr',  type: 'str',               hint: "'name' or 'age'", input: 'text' },
      ],
      template: "from dataclasses import dataclass\nfrom operator import attrgetter\n@dataclass\nclass User:\n    name: str\n    age: int\nusers = [User(n, a) for n, a in zip({$names}, {$ages})]\nsorted(users, key=attrgetter({$attr}))",
      cases: [
        { id: 'age',  label: 'by age',  values: { names: 'Ann, Bob, Cy', ages: '31, 25, 19', attr: 'age' } },
        { id: 'name', label: 'by name', values: { names: 'Cy, Ann, Bob', ages: '19, 31, 25', attr: 'name' } },
        { id: 'typo', label: 'typo',    values: { names: 'Ann, Bob, Cy', ages: '31, 25, 19', attr: 'agee' } },
      ],
    },
    {
      id: 'table',
      label: 'dispatch table',
      blurb: 'Operators as data: a dict maps each symbol to its function. Numbers typed as 7 or 2.5 become int or float; anything else is a str.',
      params: [
        { name: 'symbol', type: 'str',              hint: '+ - * / // % **', input: 'text' },
        { name: 'a',      type: 'int | float | str', hint: 'left operand',   input: 'auto' },
        { name: 'b',      type: 'int | float | str', hint: 'right operand',  input: 'auto' },
      ],
      template: "import operator\nops = {'+': operator.add, '-': operator.sub, '*': operator.mul, '/': operator.truediv,\n       '//': operator.floordiv, '%': operator.mod, '**': operator.pow}\nops[{$symbol}]({$a}, {$b})",
      cases: [
        { id: 'floor', label: '-7 // 2',   values: { symbol: '//', a: '-7', b: '2' } },
        { id: 'div',   label: '7 / 2',     values: { symbol: '/', a: '7', b: '2' } },
        { id: 'pow',   label: '2 ** -1',   values: { symbol: '**', a: '2', b: '-1' } },
        { id: 'str',   label: "'ab' * 3",  values: { symbol: '*', a: 'ab', b: '3' } },
        { id: 'xor',   label: 'unknown ^', values: { symbol: '^', a: '6', b: '3' } },
      ],
    },
  ],
  demoExplainer: "sorted() is stable, so records with equal keys keep their input order: Ann and Cy are both 31 and stay in that order. A key that some row lacks raises KeyError as soon as sorted() computes that row's key; a misspelt attribute raises AttributeError, and the Python 3.13 traceback adds the \"Did you mean: 'age'?\" hint when a close name exists. In the dispatch table the function is chosen by data instead of an if/elif chain: -7 // 2 is -4 (floor division rounds toward minus infinity), 2 ** -1 is 0.5 (a negative int exponent gives a float), and a symbol that is not in the table is a KeyError.",

  patterns: [
    {
      name: 'Sort a list of dicts by a key',
      desc: 'itemgetter builds the key function; several keys give a tuple key (sort by age, then name).',
      code: "from operator import itemgetter\nrows.sort(key=itemgetter('age', 'name'))",
    },
    {
      name: 'Sort objects by an attribute',
      desc: 'attrgetter reads attributes, dotted paths included.',
      code: "from operator import attrgetter\nusers.sort(key=attrgetter('last_name', 'first_name'))\nby_city = sorted(users, key=attrgetter('address.city'))",
    },
    {
      name: 'Fold a list with an operator',
      desc: 'reduce and accumulate take a two-argument function — operator.mul instead of lambda a, b: a * b.',
      code: 'from functools import reduce\nfrom itertools import accumulate\nimport operator\nproduct = reduce(operator.mul, numbers, 1)\nrunning = list(accumulate(numbers, operator.add))',
    },
    {
      name: 'Operator dispatch table',
      desc: 'A calculator, a rule engine or a query filter that maps symbols to functions.',
      code: "import operator\nOPS = {'<': operator.lt, '<=': operator.le, '==': operator.eq, '!=': operator.ne, '>=': operator.ge, '>': operator.gt}\nmatches = [row for row in rows if OPS[op](row[field], value)]",
    },
  ],

  examples: [
    { title: 'Operators as functions',        code: "import operator\noperator.add(2, 3), operator.mul('ab', 3)", returns: "(5, 'ababab')" },
    { title: 'reduce with operator.mul',     code: 'from functools import reduce\nimport operator\nreduce(operator.mul, [1, 2, 3, 4, 5])', returns: '120' },
    { title: 'map over two lists',           code: 'import operator\nlist(map(operator.add, [1, 2, 3], [10, 20, 30]))', returns: '[11, 22, 33]' },
    { title: 'Sort tuples by the 2nd field', code: "from operator import itemgetter\npairs = [('b', 2), ('a', 3), ('c', 1)]\nsorted(pairs, key=itemgetter(1))", returns: "[('c', 1), ('b', 2), ('a', 3)]" },
    { title: 'Nested attributes',            code: "from operator import attrgetter\nfrom types import SimpleNamespace\np = SimpleNamespace(name='Ada', city=SimpleNamespace(name='London'))\nattrgetter('name', 'city.name')(p)", returns: "('Ada', 'London')" },
    { title: 'Call a method by name',        code: "from operator import methodcaller\nlist(map(methodcaller('strip'), ['  a ', 'b  ']))", returns: "['a', 'b']" },
    { title: 'Group with itemgetter',        code: "from itertools import groupby\nfrom operator import itemgetter\nrows = [('fruit', 'apple'), ('fruit', 'pear'), ('veg', 'leek')]\n[(k, [name for _, name in g]) for k, g in groupby(rows, key=itemgetter(0))]", returns: "[('fruit', ['apple', 'pear']), ('veg', ['leek'])]" },
    { title: 'The dunder aliases',           code: 'import operator\noperator.__add__ is operator.add', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Passing a two-argument function as a sort key',
      desc: 'key= calls its function with ONE argument. operator.lt and friends need two — sort keys come from itemgetter, attrgetter or methodcaller.',
      wrong: { label: 'key=operator.lt', code: "import operator\nsorted(['b', 'A', 'c'], key=operator.lt)", output: 'TypeError: lt expected 2 arguments, got 1' },
      fix:   { label: 'key=methodcaller', code: "import operator\nsorted(['b', 'A', 'c'], key=operator.methodcaller('lower'))", output: "['A', 'b', 'c']" },
    },
    {
      name: 'Expecting a missing key to be skipped',
      desc: 'itemgetter is obj[key] — no default. Use a lambda with dict.get when some records lack the field.',
      wrong: { label: "itemgetter('age')", code: "from operator import itemgetter\nrows = [{'name': 'Ann', 'age': 31}, {'name': 'Bob'}]\nsorted(rows, key=itemgetter('age'))", output: "KeyError: 'age'" },
      fix:   { label: 'lambda + get', code: "rows = [{'name': 'Ann', 'age': 31}, {'name': 'Bob'}]\nsorted(rows, key=lambda r: r.get('age', 0))", output: "[{'name': 'Bob'}, {'name': 'Ann', 'age': 31}]" },
    },
  ],

  when: {
    use: [
      'A function argument that is just an operator: reduce, accumulate, map, starmap',
      'Sort, min, max and groupby keys that read fields — itemgetter, attrgetter, methodcaller',
      'Dispatch tables that map symbols or names to operations',
    ],
    avoid: [
      'Plain expressions — a + b is clearer than operator.add(a, b)',
      'Keys that need defaults or computation → a lambda or a named function',
      'Short-circuit logic: there is no operator function for and / or (both operands would be evaluated)',
    ],
  },

  notes: {
    cpython:      'Modules/_operator.c; Lib/operator.py holds pure-Python versions that the C module replaces at import',
    'Dunder names': 'operator.__add__, __getitem__, __not__ … are the same objects as add, getitem, not_ — kept for backward compatibility and absent from __all__. countOf, indexOf, truth, is_, is_not and length_hint have no dunder alias',
    'and / or':   'and_ and or_ are the bitwise & and |; the boolean keywords and / or short-circuit, which no function call can do',
    'Floats':     'Arithmetic is the operators themselves: float ** float calls the C library pow(), whose last digit can differ between platforms in rare cases',
  },

  related: [
    { name: 'functools.reduce', slug: 'reduce',  when: 'Fold a sequence with operator.add / mul', category: 'stdlib/functools' },
    { name: 'sorted()',         slug: 'sorted',  when: 'Where itemgetter keys go',                 category: 'functions' },
    { name: 'max()',            slug: 'max',     when: 'max(rows, key=itemgetter(…))',             category: 'functions' },
    { name: 'min()',            slug: 'min',     when: 'min(rows, key=attrgetter(…))',             category: 'functions' },
    { name: '+ operator',       slug: 'add',     when: 'What operator.add does',                   category: 'operators' },
    { name: 'functools module', slug: 'functools', when: 'partial, reduce and other function tools', category: 'stdlib' },
    { name: 'itertools module', slug: 'itertools', when: 'accumulate, starmap and groupby take operator functions', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I sort a list of dicts by a key in Python?',
      a: "sorted(rows, key=itemgetter('age')) after from operator import itemgetter — or rows.sort(...) to sort in place. itemgetter('age', 'name') sorts by age, then name. If some dicts may lack the key, use key=lambda r: r.get('age', 0) instead.",
    },
    {
      q: 'Is itemgetter faster than a lambda?',
      a: 'Usually somewhat: itemgetter, attrgetter and methodcaller are implemented in C, so the key call does not run a Python function frame. The difference matters for large sorts; for small ones pick whichever reads better.',
    },
    {
      q: 'What is the difference between operator.add and the + operator?',
      a: 'None in behaviour — operator.add(a, b) evaluates a + b, with the same dispatch to __add__ / __radd__ and the same errors. The point is that operator.add is a function object you can pass to map, reduce, sorted or store in a dict.',
    },
    {
      q: 'Why is there operator.and_ with an underscore?',
      a: 'and, or and not are keywords, so the functions are named and_, or_ and not_. and_ and or_ are the bitwise & and | (also set intersection and union); not_ is the boolean not. There is no function for the short-circuit and / or.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html',
    meta:  'operator — Standard operators as functions',
  },
};
