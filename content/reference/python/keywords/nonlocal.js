// content/reference/python/keywords/nonlocal.js

export const meta = {
  slug:        'nonlocal',
  name:        'nonlocal',
  signature:   'nonlocal name',
  blurb:       'Let a nested function rebind a variable of its enclosing function — the key to closures that keep state.',
  category:    'functions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'nonlocal closure nested function enclosing scope counter inner function outer variable no binding for nonlocal found unboundlocalerror keyword',
};

export const method = {
  slug:      'nonlocal',
  name:      'nonlocal',
  signature: 'nonlocal name',

  category:    'Functions',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'A nested function can read its outer function’s variables for free. To assign to one, declare it nonlocal — otherwise the assignment creates a new local.',

  covers: ['nonlocal'],

  syntax: [
    { label: 'nonlocal', code: 'def outer():\n    x = 0\n    def inner():\n        nonlocal x\n        x += 1' },
    { label: 'several names', code: 'nonlocal a, b' },
  ],

  cheat: {
    useFor:    'Counters, accumulators and flags kept in a closure',
    result:    'a declaration — no value; the name refers to the nearest enclosing function’s variable',
    pairsWith: 'def (nested), global, lambda, decorators',
    watchOut:  'the name must already be bound in an enclosing FUNCTION — module globals do not count',
  },

  parameters: [
    { name: 'name', type: 'name', required: true, default: null, desc: 'One or more identifiers bound in an enclosing function (not the module). Resolved at compile time.' },
  ],

  modes: [
    {
      id: 'counter',
      label: 'counter',
      blurb: 'Each call to c rebinds count in make_counter’s scope, which outlives the call that created it.',
      params: [{ name: 'start', type: 'int', hint: 'starting value', input: 'number' }],
      template: 'def make_counter(start):\n    count = start\n    def bump():\n        nonlocal count\n        count += 1\n        return count\n    return bump\nc = make_counter({$start})\n(c(), c(), c())',
      cases: [
        { id: 'zero', label: 'start at 0',  values: { start: '0' } },
        { id: 'neg',  label: 'start at -2', values: { start: '-2' } },
      ],
    },
    {
      id: 'acc',
      label: 'accumulator',
      blurb: 'A running total kept in the closure; every call returns the sum so far.',
      params: [{ name: 'nums', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'def make_acc():\n    total = 0\n    def add(n):\n        nonlocal total\n        total += n\n        return total\n    return add\nacc = make_acc()\n[acc(n) for n in {$nums}]',
      cases: [
        { id: 'ints',  label: 'ints',       values: { nums: '3, 4, 5' } },
        { id: 'float', label: 'with float', values: { nums: '1, 0.5, -2' } },
        { id: 'empty', label: 'empty list', values: { nums: '' } },
      ],
    },
  ],
  demoExplainer: 'make_counter has already returned when c() runs, yet count survives: the inner function holds a reference to the variable (a closure cell), and nonlocal lets it write to that cell instead of creating a fresh local.',

  patterns: [
    {
      name: 'Counter closure',
      desc: 'State without a class.',
      code: 'def make_counter():\n    count = 0\n    def bump():\n        nonlocal count\n        count += 1\n        return count\n    return bump',
    },
    {
      name: 'Decorator that counts calls',
      desc: 'The wrapper updates a variable of the decorator.',
      code: 'def counted(func):\n    calls = 0\n    def wrapper(*args, **kwargs):\n        nonlocal calls\n        calls += 1\n        return func(*args, **kwargs)\n    return wrapper',
    },
    {
      name: 'Flag set by a callback',
      desc: 'An inner helper reports back to its outer function.',
      code: 'def scan(items):\n    found = False\n    def check(x):\n        nonlocal found\n        if x < 0:\n            found = True\n    for x in items:\n        check(x)\n    return found',
    },
  ],

  examples: [
    { title: 'A counter closure',            code: 'def make_counter():\n    count = 0\n    def bump():\n        nonlocal count\n        count += 1\n        return count\n    return bump\nc = make_counter()\nc()\nc()', returns: '2' },
    { title: 'Reading needs no declaration', code: 'def outer():\n    x = 10\n    def inner():\n        return x + 1\n    return inner()\nouter()', returns: '11' },
    { title: 'Nearest enclosing function wins', code: "def a():\n    x = 'a'\n    def b():\n        x = 'b'\n        def c():\n            nonlocal x\n            x = 'c'\n        c()\n        return x\n    return b(), x\na()", returns: "('c', 'a')" },
    { title: 'Mutating needs no nonlocal',   code: 'def make():\n    seen = []\n    def add(v):\n        seen.append(v)\n        return seen\n    return add\nadd = make()\nadd(1)\nadd(2)', returns: '[1, 2]' },
    { title: 'The name must exist in an enclosing function', code: "compile('def f():\\n    nonlocal x', '<demo>', 'exec')", returns: "SyntaxError: no binding for nonlocal 'x' found" },
    { title: 'Not at module level',          code: "compile('nonlocal x', '<demo>', 'exec')", returns: 'SyntaxError: nonlocal declaration not allowed at module level' },
    { title: 'Closures are separate',        code: 'def make_counter():\n    count = 0\n    def bump():\n        nonlocal count\n        count += 1\n        return count\n    return bump\nc1, c2 = make_counter(), make_counter()\n(c1(), c1(), c2())', returns: '(1, 2, 1)' },
  ],

  pitfalls: [
    {
      name: 'Updating an outer variable with +=',
      desc: 'total += n assigns, so total becomes local to add — and is read before it has a value.',
      wrong: { label: 'no declaration', code: 'def make_acc():\n    total = 0\n    def add(n):\n        total += n\n        return total\n    return add\nmake_acc()(5)', output: "UnboundLocalError: cannot access local variable 'total' where it is not associated with a value" },
      fix:   { label: 'nonlocal total', code: 'def make_acc():\n    total = 0\n    def add(n):\n        nonlocal total\n        total += n\n        return total\n    return add\nmake_acc()(5)', output: '5' },
    },
    {
      name: 'A plain assignment silently creates a local',
      desc: 'No error at all — the inner function just sets its own variable, and the outer one never changes.',
      wrong: { label: 'assignment only', code: "def outer():\n    status = 'idle'\n    def start():\n        status = 'running'\n    start()\n    return status\nouter()", output: "'idle'" },
      fix:   { label: 'nonlocal status', code: "def outer():\n    status = 'idle'\n    def start():\n        nonlocal status\n        status = 'running'\n    start()\n    return status\nouter()", output: "'running'" },
    },
    {
      name: 'nonlocal for a module-level variable',
      desc: 'nonlocal only searches enclosing functions. A module variable needs global.',
      wrong: { label: 'nonlocal', code: "compile('x = 0\\ndef f():\\n    nonlocal x\\n    x = 1', '<demo>', 'exec')", output: "SyntaxError: no binding for nonlocal 'x' found" },
      fix:   { label: 'global',   code: 'x = 0\ndef f():\n    global x\n    x = 1\nf()\nx', output: '1' },
    },
  ],

  when: {
    use: [
      'Small stateful closures: counters, accumulators, memo flags',
      'Decorators that keep per-function state',
      'Helper functions nested inside a function that need to update its variables',
    ],
    avoid: [
      'State with several fields or methods → a class',
      'Module-level variables → global (or better, parameters and return values)',
      'Only mutating an outer list or dict → no declaration needed',
    ],
  },

  notes: {
    cpython:   'The shared variable lives in a cell object: the outer function uses MAKE_CELL / STORE_DEREF, the inner one LOAD_DEREF / STORE_DEREF',
    'Scope':   'nonlocal skips the local scope and searches enclosing function scopes from the nearest outward; class bodies and the module are never searched',
    'Python 2': 'Python 2 had no nonlocal — the usual workaround was a mutable container like count = [0]',
  },

  related: [
    { name: 'global', slug: 'global', when: 'Rebind a module-level variable instead' },
    { name: 'def',    slug: 'def',    when: 'Nested functions form the enclosing scopes' },
    { name: 'lambda', slug: 'lambda', when: 'Lambdas are closures too' },
    { name: 'UnboundLocalError', slug: 'unboundlocalerror', when: 'The error a missing nonlocal causes', category: 'exceptions' },
    { name: 'SyntaxError', slug: 'syntaxerror', when: "no binding for nonlocal 'x' found", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between global and nonlocal?',
      a: 'global name refers to the module-level variable. nonlocal name refers to the variable of the nearest enclosing function that binds it. Both let you assign to a name that would otherwise become local.',
    },
    {
      q: 'What does "no binding for nonlocal found" mean?',
      a: "SyntaxError: no binding for nonlocal 'x' found — none of the enclosing functions assigns x. nonlocal cannot create a variable and does not look at module globals; assign x in the outer function first, or use global for a module variable.",
    },
    {
      q: 'Why do I get UnboundLocalError in a nested function?',
      a: 'The inner function assigns to the name (x = …, x += …), which makes it local to the inner function, so reading it first fails. Declare nonlocal x to use the outer variable.',
    },
    {
      q: 'When was nonlocal added?',
      a: 'In Python 3.0 (PEP 3104). Python 2 code used a mutable container, such as a one-element list, to work around the missing keyword.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-nonlocal-statement',
    meta:  'The nonlocal statement',
  },
};
