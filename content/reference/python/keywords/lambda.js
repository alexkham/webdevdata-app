// content/reference/python/keywords/lambda.js

export const meta = {
  slug:        'lambda',
  name:        'lambda',
  signature:   'lambda params: expression',
  blurb:       'An anonymous one-expression function — the natural fit for key= arguments and small callbacks.',
  category:    'functions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'lambda anonymous function inline function key function sorted key lambda sort by late binding closure loop keyword',
};

export const method = {
  slug:      'lambda',
  name:      'lambda',
  signature: 'lambda params: expression',

  category:    'Functions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'lambda builds a function from a single expression, whose value is returned. No statements, no name, no annotations — and the same late-binding rules as any closure.',

  covers: ['lambda'],

  syntax: [
    { label: 'lambda', code: 'lambda params: expression' },
    { label: 'as a key function', code: 'sorted(items, key=lambda x: x[1])' },
    { label: 'with defaults', code: 'lambda a, b=2, *args: a + b' },
  ],

  cheat: {
    useFor:    'key= for sorted / min / max, small callbacks, one-line map/filter functions',
    result:    'a function object (its __name__ is "<lambda>")',
    pairsWith: 'sorted(), min(), max(), map(), filter(), conditional expressions',
    watchOut:  'names in the body are looked up when it is CALLED — loop variables are not captured by value',
  },

  parameters: [
    { name: 'params',     type: 'parameter list', required: false, default: null, desc: 'Same rules as def: defaults, *args, **kwargs, / and * markers. Can be empty: lambda: 0.' },
    { name: 'expression', type: 'expression',     required: true,  default: null, desc: 'Evaluated on every call; its value is returned. Only an expression — no return, assignment statements, loops or try.' },
  ],

  modes: [
    {
      id: 'key',
      label: 'key=',
      blurb: 'Sort by absolute value. The lambda computes the sort key; the original numbers are what come back, and ties keep their order.',
      params: [{ name: 'nums', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'sorted({$nums}, key=lambda n: abs(n))',
      cases: [
        { id: 'mixed', label: 'mixed signs', values: { nums: '3, -1, -5, 2' } },
        { id: 'ties',  label: 'ties',        values: { nums: '-2, 2, 1.5, -1.5' } },
        { id: 'empty', label: 'empty list',  values: { nums: '' } },
      ],
    },
    {
      id: 'late',
      label: 'late binding',
      blurb: 'late looks x up when called; early froze the value in a default argument when the lambda was created.',
      params: [
        { name: 'first',  type: 'int', hint: 'x before', input: 'number' },
        { name: 'second', type: 'int', hint: 'x after',  input: 'number' },
      ],
      template: 'x = {$first}\nlate = lambda: x\nearly = lambda x=x: x\nx = {$second}\n(late(), early())',
      cases: [
        { id: 'change', label: 'x changes', values: { first: '1', second: '2' } },
        { id: 'same',   label: 'x same',    values: { first: '7', second: '7' } },
      ],
    },
    {
      id: 'ternary',
      label: 'with if / else',
      blurb: 'No if statement inside a lambda — but a conditional expression is fine.',
      params: [{ name: 'scores', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: "grade = lambda n: 'pass' if n >= 50 else 'fail'\n[grade(n) for n in {$scores}]",
      cases: [
        { id: 'mixed', label: 'mixed',      values: { scores: '72, 49.5, 50, 12' } },
        { id: 'empty', label: 'empty list', values: { scores: '' } },
      ],
    },
  ],
  demoExplainer: 'The key= tab never changes the numbers — abs() only decides the order, and sorted() is stable, so -2 stays ahead of 2. The late binding tab is the whole story of lambdas in loops: the body reads x at call time, unless you copy the value into a default argument.',

  patterns: [
    {
      name: 'Sort by a field',
      desc: 'The classic use: tell sorted what to compare.',
      code: 'people.sort(key=lambda p: (p.last, p.first))',
    },
    {
      name: 'Pick the best item',
      desc: 'max/min with key return the item, not the key.',
      code: 'best = max(scores.items(), key=lambda kv: kv[1])',
    },
    {
      name: 'Capture a loop value',
      desc: 'A default argument freezes the current value.',
      code: 'buttons = [make_button(text=t, on_click=lambda t=t: select(t))\n           for t in labels]',
    },
    {
      name: 'operator module instead',
      desc: 'itemgetter / attrgetter are faster and pickleable replacements for simple lambdas.',
      code: 'from operator import itemgetter\nrows.sort(key=itemgetter(1))',
    },
  ],

  examples: [
    { title: 'A lambda is a function',        code: 'square = lambda x: x * x\nsquare(5)', returns: '25' },
    { title: 'Sort strings by length',        code: "sorted(['pear', 'fig', 'apple'], key=lambda w: len(w))", returns: "['fig', 'pear', 'apple']" },
    { title: 'Sort pairs by the second item', code: "pairs = [('a', 3), ('b', 1)]\nsorted(pairs, key=lambda p: p[1])", returns: "[('b', 1), ('a', 3)]" },
    { title: 'Defaults work like in def',     code: '(lambda a, b=2: a + b)(3)', returns: '5' },
    { title: 'Conditional expression inside', code: "sign = lambda n: 'neg' if n < 0 else 'non-neg'\nsign(-4)", returns: "'neg'" },
    { title: 'max with a key',                code: "max({'a': 3, 'b': 7}.items(), key=lambda kv: kv[1])", returns: "('b', 7)" },
    { title: 'Its name is <lambda>',          code: 'f = lambda: 0\nf.__name__', returns: "'<lambda>'" },
    { title: 'No statements allowed',         code: "compile('f = lambda x: return x', '<demo>', 'exec')", returns: 'SyntaxError: invalid syntax' },
  ],

  pitfalls: [
    {
      name: 'Lambdas created in a loop all see the last value',
      desc: 'The body looks i up when called, after the loop has finished. Bind the current value with a default argument.',
      wrong: { label: 'late binding',     code: 'funcs = [lambda: i for i in range(3)]\n[f() for f in funcs]', output: '[2, 2, 2]' },
      fix:   { label: 'default argument', code: 'funcs = [lambda i=i: i for i in range(3)]\n[f() for f in funcs]', output: '[0, 1, 2]' },
    },
    {
      name: 'A comma after the body makes a tuple',
      desc: 'The comma is not part of the lambda body: f = lambda x: x, 2 is a tuple of (lambda, 2), not a lambda returning a tuple.',
      wrong: { label: 'bare comma',   code: 'f = lambda x: x, 2\nf(1)', output: "TypeError: 'tuple' object is not callable" },
      fix:   { label: 'parenthesise', code: 'f = lambda x: (x, 2)\nf(1)', output: '(1, 2)' },
    },
    {
      name: 'Naming a lambda instead of using def',
      desc: 'A lambda bound to a name gives worse tracebacks and repr — PEP 8 recommends def for anything you name.',
      wrong: { label: 'named lambda', code: 'double = lambda x: x * 2\ndouble.__name__', output: "'<lambda>'" },
      fix:   { label: 'def',          code: 'def double(x):\n    return x * 2\ndouble.__name__', output: "'double'" },
    },
  ],

  when: {
    use: [
      'key= arguments of sorted(), list.sort(), min(), max(), itertools.groupby()',
      'Short callbacks passed straight to another function',
      'Default factories such as defaultdict(lambda: [0, 0])',
    ],
    avoid: [
      'Anything you would assign to a name → def (a real name, a docstring)',
      'Logic that needs statements, several lines or error handling → def',
      'map(lambda x: x * 2, xs) → a comprehension [x * 2 for x in xs] usually reads better',
    ],
  },

  notes: {
    cpython:    'A lambda compiles to the same kind of code object as a def; only __name__ / __qualname__ ("<lambda>") differ',
    'Scope':    'The body is a new scope: free names are looked up when the lambda runs, exactly like a nested def',
    'Parsing':  "lambda binds more loosely than every operator except :=, so 'lambda: x = 1' parses as assigning to the lambda (SyntaxError: cannot assign to lambda)",
  },

  related: [
    { name: 'def',       slug: 'def',     when: 'A named function with statements' },
    { name: 'return',    slug: 'return',  when: 'What a lambda does implicitly' },
    { name: 'nonlocal',  slug: 'nonlocal', when: 'Closures and enclosing scopes' },
    { name: 'sorted()',  slug: 'sorted',  when: 'The main customer of key=', category: 'functions' },
    { name: 'map()',     slug: 'map',     when: 'Apply a function to every item', category: 'functions' },
    { name: 'filter()',  slug: 'filter',  when: 'Keep items where the function is true', category: 'functions' },
    { name: 'if / else expression', slug: 'ternary', when: 'Branching inside a lambda', category: 'operators' },
  ],

  faq: [
    {
      q: 'What is a lambda function in Python?',
      a: 'A small anonymous function written as an expression: lambda x: x * 2 is equivalent to a def that returns x * 2. It can take any parameters a def can, but its body is a single expression whose value is returned.',
    },
    {
      q: 'Can a lambda have multiple lines or statements?',
      a: 'No. The body must be one expression — no return, assignments, loops, try or with. A conditional expression (a if cond else b) and the walrus operator are allowed. If you need more, write a def.',
    },
    {
      q: 'Why do all my lambdas in a loop return the same value?',
      a: 'The body looks up the loop variable when the lambda is called, not when it is created, so every lambda sees its final value. Capture the current value with a default argument: lambda i=i: i.',
    },
    {
      q: 'Is lambda slower than def?',
      a: 'No. Both compile to the same kind of function object; calling one costs the same as calling the other.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#lambda',
    meta:  'Lambdas',
  },
};
