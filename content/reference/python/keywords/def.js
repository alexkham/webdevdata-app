// content/reference/python/keywords/def.js

export const meta = {
  slug:        'def',
  name:        'def',
  signature:   'def name(parameters):',
  blurb:       'Define a function: parameters with defaults, *args and **kwargs, positional-only / and keyword-only * markers.',
  category:    'functions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'def define function parameters arguments default arguments args kwargs *args **kwargs positional-only keyword-only mutable default decorator keyword',
};

export const method = {
  slug:      'def',
  name:      'def',
  signature: 'def name(parameters):',

  category:    'Functions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'def builds a function object and binds it to a name. Defaults are evaluated once, at definition time — the source of Python’s most famous trap.',

  covers: ['def'],

  syntax: [
    { label: 'def', code: 'def name(a, b):\n    body\n    return value' },
    { label: 'defaults', code: 'def name(a, b=10):\n    ...' },
    { label: '*args / **kwargs', code: 'def name(*args, **kwargs):\n    ...' },
    { label: '/ and * markers', code: 'def name(a, /, b, *, c):\n    ...' },
  ],

  cheat: {
    useFor:    'Any reusable piece of logic that takes inputs and returns a result',
    result:    'a statement — binds a function object to the name',
    pairsWith: 'return, lambda, yield, @decorators, *args, **kwargs',
    watchOut:  'default values are created once, not per call — never use [] or {} as a default',
  },

  parameters: [
    { name: 'name',       type: 'name',       required: true,  default: null, desc: 'The variable the new function object is bound to. Rebinding it later replaces the function.' },
    { name: 'parameters', type: 'parameter list', required: false, default: null, desc: 'Plain names, name=default, *args (extra positionals as a tuple), **kwargs (extra keywords as a dict). / ends positional-only, a bare * starts keyword-only.' },
    { name: 'default',    type: 'expression', required: false, default: null, desc: 'Evaluated ONCE when def runs, and the same object is reused by every call that omits the argument.' },
    { name: 'body',       type: 'block',      required: true,  default: null, desc: 'Runs on each call. Ends at return (or falls off the end, which returns None).' },
  ],

  modes: [
    {
      id: 'defaults',
      label: 'defaults',
      blurb: 'low and high have defaults. Pass high by keyword and leave low alone.',
      params: [
        { name: 'x',    type: 'int', hint: 'value to clamp', input: 'number' },
        { name: 'high', type: 'int', hint: 'upper bound',    input: 'number' },
      ],
      template: 'def clamp(x, low=0, high=10):\n    return max(low, min(x, high))\n(clamp({$x}), clamp({$x}, high={$high}))',
      cases: [
        { id: 'inside', label: 'inside range', values: { x: '7', high: '5' } },
        { id: 'neg',    label: 'negative',     values: { x: '-3', high: '5' } },
        { id: 'big',    label: 'big x',        values: { x: '42', high: '100' } },
      ],
    },
    {
      id: 'mutable',
      label: 'mutable default',
      blurb: 'Two separate calls, one shared list: the default [] was created once, when def ran.',
      params: [
        { name: 'first',  type: 'int', hint: 'first item',  input: 'number' },
        { name: 'second', type: 'int', hint: 'second item', input: 'number' },
      ],
      template: 'def add(item, bucket=[]):\n    bucket.append(item)\n    return bucket\na = add({$first})\nb = add({$second})\n(a, b, a is b)',
      cases: [
        { id: 'two',  label: 'two calls',   values: { first: '1', second: '2' } },
        { id: 'same', label: 'same values', values: { first: '5', second: '5' } },
      ],
    },
    {
      id: 'args',
      label: '*args / **kwargs',
      blurb: 'The list is unpacked into positional arguments: the first fills first, the rest land in a tuple; the keyword lands in a dict.',
      params: [
        { name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' },
        { name: 'end',     type: 'int',  hint: 'keyword arg',     input: 'number' },
      ],
      template: 'def f(first, *rest, **opts):\n    return first, rest, opts\nf(*{$numbers}, end={$end})',
      cases: [
        { id: 'three', label: 'three items', values: { numbers: '1, 2, 3', end: '0' } },
        { id: 'one',   label: 'one item',    values: { numbers: '9.5', end: '1' } },
        { id: 'empty', label: 'empty list',  values: { numbers: '', end: '0' } },
      ],
    },
  ],
  demoExplainer: 'In the mutable default tab, a and b are the same list object (a is b is True) — the second call appended to the list the first call returned. In the *args tab, an empty list leaves nothing for the required first parameter, so the call fails before the body runs.',

  patterns: [
    {
      name: 'None as the "no value" default',
      desc: 'The safe replacement for a mutable default.',
      code: 'def add(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket',
    },
    {
      name: 'Keyword-only options',
      desc: 'Everything after * must be passed by name, so call sites stay readable.',
      code: 'def connect(host, port, *, timeout=5, retries=3):\n    ...',
    },
    {
      name: 'Forwarding arguments',
      desc: 'A wrapper that passes everything through unchanged.',
      code: 'def logged(func):\n    def wrapper(*args, **kwargs):\n        print("calling", func.__name__)\n        return func(*args, **kwargs)\n    return wrapper',
    },
    {
      name: 'Docstring first',
      desc: 'A string literal as the first statement becomes func.__doc__ (shown by help()).',
      code: 'def area(w, h):\n    """Return the area of a w x h rectangle."""\n    return w * h',
    },
  ],

  examples: [
    { title: 'Define and call',               code: "def greet(name):\n    return f'Hello, {name}!'\ngreet('Ann')", returns: "'Hello, Ann!'" },
    { title: 'Default and keyword arguments',  code: 'def power(base, exp=2):\n    return base ** exp\n(power(3), power(2, exp=10))', returns: '(9, 1024)' },
    { title: '*args and **kwargs',             code: 'def f(*args, **kwargs):\n    return args, kwargs\nf(1, 2, x=3)', returns: "((1, 2), {'x': 3})" },
    { title: 'Positional-only and keyword-only', code: 'def f(a, /, b, *, c):\n    return a, b, c\nf(1, b=2, c=3)', returns: '(1, 2, 3)' },
    { title: 'Breaking the markers',           code: 'def f(a, /, b, *, c):\n    return a, b, c\nf(1, 2, 3)', returns: 'TypeError: f() takes 2 positional arguments but 3 were given' },
    { title: 'Functions are objects',          code: "def square(x):\n    return x * x\nops = {'sq': square}\n(ops['sq'](4), square.__name__)", returns: "(16, 'square')" },
    { title: 'A decorator with @',             code: "def shout(func):\n    def wrapper(*args):\n        return func(*args).upper()\n    return wrapper\n\n@shout\ndef greet(name):\n    return f'hi {name}'\ngreet('bo')", returns: "'HI BO'" },
  ],

  pitfalls: [
    {
      name: 'A mutable default argument',
      desc: 'The default list is created once when def runs and shared by every call that omits the argument.',
      wrong: { label: 'bucket=[]',   code: 'def add(item, bucket=[]):\n    bucket.append(item)\n    return bucket\nadd(1)\nadd(2)', output: '[1, 2]' },
      fix:   { label: 'bucket=None', code: 'def add(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket\nadd(1)\nadd(2)', output: '[2]' },
    },
    {
      name: 'Forgetting return',
      desc: 'A function that computes a value but never returns it gives back None.',
      wrong: { label: 'no return', code: 'def double(x):\n    x * 2\nprint(double(4))', output: 'None' },
      fix:   { label: 'return it', code: 'def double(x):\n    return x * 2\nprint(double(4))', output: '8' },
    },
    {
      name: 'Referencing the function instead of calling it',
      desc: 'Without parentheses you get the function object, which is never equal to its result.',
      wrong: { label: 'no ()',   code: 'def get():\n    return 42\nresult = get\nresult == 42', output: 'False' },
      fix:   { label: 'call it', code: 'def get():\n    return 42\nresult = get()\nresult == 42', output: 'True' },
    },
    {
      name: 'A required parameter after a default',
      desc: 'Once a parameter has a default, every positional parameter after it needs one too.',
      wrong: { label: 'b after a=1', code: "compile('def f(a=1, b): pass', '<demo>', 'exec')", output: 'SyntaxError: parameter without a default follows parameter with a default' },
      fix:   { label: 'required first', code: 'def f(b, a=1):\n    return a, b\nf(2)', output: '(1, 2)' },
    },
  ],

  when: {
    use: [
      'Logic you call from more than one place',
      'Anything longer than one expression, or that needs statements, a docstring or a name in tracebacks',
      'Giving a meaningful name to a step of a larger computation',
    ],
    avoid: [
      'A tiny one-off key= or callback expression → lambda',
      'A function that produces a series of values → still def, but with yield (a generator)',
      'Several functions sharing state → a class may read better than closures',
    ],
  },

  notes: {
    cpython:    'def is executed at runtime: it evaluates the defaults, builds a function object from pre-compiled code and binds it to the name',
    'Defaults': 'Stored in func.__defaults__ (and __kwdefaults__ for keyword-only) — a mutated default is visible there',
    'Scope':    'Names assigned inside the body are local unless declared global or nonlocal',
  },

  related: [
    { name: 'return',   slug: 'return',   when: 'Send a value back from the function' },
    { name: 'lambda',   slug: 'lambda',   when: 'A nameless one-expression function' },
    { name: 'yield',    slug: 'yield',    when: 'Turn the function into a generator' },
    { name: 'async / await', slug: 'async-await', when: 'async def defines a coroutine function' },
    { name: 'nonlocal', slug: 'nonlocal', when: 'Rebind a variable of the enclosing function' },
    { name: 'callable()', slug: 'callable', when: 'Is this object a function (or callable)?', category: 'functions' },
    { name: 'TypeError', slug: 'typeerror', when: 'Wrong number or kind of arguments', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What do *args and **kwargs mean in Python?',
      a: '*args collects any extra positional arguments into a tuple, **kwargs collects any extra keyword arguments into a dict. The names are convention; the * and ** are what matter. At a call site, * and ** do the reverse: f(*items, **options) unpacks them into arguments.',
    },
    {
      q: 'Why does my default list keep old values between calls?',
      a: 'Default values are evaluated once, when the def statement runs, and the same object is reused. Appending to a default list changes that one shared list. Use None as the default and create the list inside the function.',
    },
    {
      q: 'What do / and * mean in a function signature?',
      a: 'Parameters before / are positional-only (cannot be passed by name). Parameters after * (or after *args) are keyword-only (must be passed by name). The / marker was added in Python 3.8.',
    },
    {
      q: 'What does a function return if it has no return statement?',
      a: 'None. Falling off the end of the body, a bare return, and return None all give the caller None.',
    },
    {
      q: 'What does @ above a def do?',
      a: 'It is a decorator: @deco followed by def f is the same as defining f and then running f = deco(f). The decorator receives the function object and returns what the name will be bound to — usually a wrapper function.',
    },
  ],

  history: [
    { version: '3.8', note: 'The / function parameter syntax may be used to indicate positional-only parameters (PEP 570).' },
    { version: '3.9', note: 'Functions may be decorated with any valid assignment expression.' },
    { version: '3.12', note: 'Type parameter lists (def f[T](x: T)) are new.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#function-definitions',
    meta:  'Function definitions',
  },
};
