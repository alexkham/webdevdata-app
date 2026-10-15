// content/reference/python/stdlib/operator/call.js

export const meta = {
  slug:        'call',
  name:        'operator.call',
  signature:   'operator.call(obj, /, *args, **kwargs)',
  blurb:       'Call obj with the remaining arguments: operator.call(f, x, key=y) is f(x, key=y). The act of calling, as a function you can pass to map() or keep in a table (Python 3.11+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'operator.call call operator.__call__ python call a function with arguments apply function python 3 apply map list of functions call each function in a list dispatch table of functions callable obj(*args, **kwargs) python 3.11 object is not callable',
};

export const method = {
  slug:      'call',
  name:      'operator.call',
  signature: 'operator.call(obj, /, *args, **kwargs)',
  returns:   { type: 'any', desc: 'Whatever obj(*args, **kwargs) returns.' },

  category:    'operator function',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'call(f, x, y, key=z) is f(x, y, key=z) — nothing more. It exists so that calling can itself be handed to map() or stored in a table, the same way operator.add stands for +.',

  covers: ['call'],

  cheat: {
    commonCall: 'list(map(operator.call, funcs, args))',
    returns:    'obj(*args, **kwargs)',
    replaces:   'lambda f, *a, **k: f(*a, **k)',
    watchOut:   'Pass the function itself, not its result; 3.11+ only',
  },

  parameters: [
    { name: 'obj',      type: 'callable', required: true,  default: null, desc: 'The function, class or other callable to call. Positional only.' },
    { name: '*args',    type: 'any',      required: false, default: null, desc: 'Positional arguments passed to obj unchanged.' },
    { name: '**kwargs', type: 'any',      required: false, default: null, desc: 'Keyword arguments passed to obj unchanged — including one named obj.' },
  ],

  modes: [
    {
      id: 'int',
      label: 'call(int, …)',
      blurb: 'Positional and keyword arguments go straight through: this is int(text, base=base).',
      params: [
        { name: 'text', type: 'str', hint: 'digits to parse', input: 'text' },
        { name: 'base', type: 'int', hint: '0 or 2 … 36',     input: 'number' },
      ],
      template: 'import operator\noperator.call(int, {$text}, base={$base})',
      cases: [
        { id: 'hex',    label: "'ff', 16",    values: { text: 'ff', base: '16' } },
        { id: 'prefix', label: "'0b101', 0",  values: { text: '0b101', base: '0' } },
        { id: 'under',  label: "'1_000', 10", values: { text: '1_000', base: '10' } },
        { id: 'b36',    label: "'z', 36",     values: { text: 'z', base: '36' } },
        { id: 'digit',  label: "'12', 2",     values: { text: '12', base: '2' } },
        { id: 'base',   label: "'7', 1",      values: { text: '7', base: '1' } },
      ],
    },
    {
      id: 'dispatch',
      label: 'dispatch table',
      blurb: 'A dict maps names to functions; call runs the one the name picks. Try len, upper, split or sorted.',
      params: [
        { name: 'name', type: 'str', hint: 'len, upper, split, sorted', input: 'text' },
        { name: 'text', type: 'str', hint: 'the argument',              input: 'text' },
      ],
      template: "import operator\nhandlers = {'len': len, 'upper': str.upper, 'split': str.split, 'sorted': sorted}\noperator.call(handlers[{$name}], {$text})",
      cases: [
        { id: 'len',     label: 'len',     values: { name: 'len', text: 'hello world' } },
        { id: 'upper',   label: 'upper',   values: { name: 'upper', text: 'hello world' } },
        { id: 'split',   label: 'split',   values: { name: 'split', text: 'hello world' } },
        { id: 'sorted',  label: 'sorted',  values: { name: 'sorted', text: 'cab' } },
        { id: 'unknown', label: 'reverse', values: { name: 'reverse', text: 'hello world' } },
      ],
    },
  ],
  demoExplainer: "operator.call(int, text, base=16) runs int(text, base=16): every argument after the callable, positional or keyword, is passed through unchanged, and the errors are int()'s own — a digit that is not valid in the base names the base, and base 1 is rejected outright. int() accepts surrounding whitespace, underscores between digits and, with base=0, a 0x / 0o / 0b prefix. In the dispatch tab the function is chosen by data: a name that is not in the dict is a KeyError before anything is called. (upper is reproduced for ASCII text only.)",

  patterns: [
    {
      name: 'Run a list of callbacks',
      desc: 'map with one iterable calls each function with no arguments.',
      code: 'import operator\nresults = list(map(operator.call, callbacks))',
    },
    {
      name: 'One value through many functions',
      desc: 'repeat(value) gives every function the same argument.',
      code: 'import operator\nfrom itertools import repeat\nchecks = list(map(operator.call, validators, repeat(value)))',
    },
    {
      name: 'Convert each column with its own function',
      desc: 'Two iterables: the i-th converter gets the i-th field.',
      code: 'import operator\nconverters = (int, str.strip, float)\nrow = list(map(operator.call, converters, fields))',
    },
    {
      name: 'The same on Python 3.10 and older',
      desc: 'operator.call does not exist before 3.11; this lambda behaves the same.',
      code: 'call = lambda obj, /, *args, **kwargs: obj(*args, **kwargs)',
    },
  ],

  examples: [
    { title: 'Positional arguments',          code: 'import operator\noperator.call(max, 3, 9, 4)', returns: '9' },
    { title: 'Keyword arguments pass through', code: "import operator\noperator.call(sorted, ['b', 'A', 'c'], key=str.lower)", returns: "['A', 'b', 'c']" },
    { title: 'One value, many functions',     code: "import operator\nfuncs = [str.upper, str.title, len]\n[operator.call(f, 'hello world') for f in funcs]", returns: "['HELLO WORLD', 'Hello World', 11]" },
    { title: 'map pairs functions and arguments', code: "import operator\nlist(map(operator.call, [abs, round, str], [-2, 2.567, 7]))", returns: "[2, 3, '7']" },
    { title: 'starmap with argument tuples',  code: 'import operator\nfrom itertools import starmap\nlist(starmap(operator.call, [(abs, -3), (max, 1, 5), (pow, 2, 10)]))', returns: '[3, 5, 1024]' },
    { title: 'obj is positional-only',        code: 'import operator\ndef show(**kwargs):\n    return kwargs\noperator.call(show, obj=1, x=2)', returns: "{'obj': 1, 'x': 2}" },
    { title: 'The dunder alias',              code: 'import operator\noperator.__call__ is operator.call, operator.call', returns: '(True, <built-in function call>)' },
    { title: 'Something to call is required', code: 'import operator\noperator.call()', returns: 'TypeError: call expected at least 1 argument, got 0' },
  ],

  pitfalls: [
    {
      name: 'Calling the function before passing it',
      desc: 'call needs the function object. len(\'abc\') has already run and produced 3, and an int cannot be called.',
      wrong: { label: "call(len('abc'))", code: "import operator\noperator.call(len('abc'))", output: "TypeError: 'int' object is not callable" },
      fix:   { label: "call(len, 'abc')", code: "import operator\noperator.call(len, 'abc')", output: '3' },
    },
    {
      name: 'One shared argument given to map as a string',
      desc: "map pairs the functions with the ITEMS of the second iterable — the characters of a str. To give every function the whole value, wrap it in itertools.repeat.",
      wrong: { label: "map(call, funcs, 'ab')",         code: "import operator\nlist(map(operator.call, [str.upper, len], 'ab'))", output: "['A', 1]" },
      fix:   { label: "map(call, funcs, repeat('ab'))", code: "import operator\nfrom itertools import repeat\nlist(map(operator.call, [str.upper, len], repeat('ab')))", output: "['AB', 2]" },
    },
    {
      name: 'Passing a method name instead of a callable',
      desc: 'call calls an object; it does not look names up. To call a method by name on each object, use methodcaller.',
      wrong: { label: "call('upper', 'abc')",       code: "import operator\noperator.call('upper', 'abc')", output: "TypeError: 'str' object is not callable" },
      fix:   { label: "methodcaller('upper')", code: "import operator\noperator.methodcaller('upper')('abc')", output: "'ABC'" },
    },
  ],

  when: {
    use: [
      'Handing "call this" to map, starmap or another function that expects a callable',
      'Loops over a dict or list of functions (dispatch tables, callbacks, converters)',
    ],
    avoid: [
      'Ordinary calls — f(x) is clearer than operator.call(f, x)',
      'Code that must run on Python 3.10 or older → the lambda in the patterns above',
      'Calling a method by its name → methodcaller',
    ],
  },

  notes: {
    cpython:          'The C function _operator.call (operator.call.__module__ is \'_operator\'); Lib/operator.py holds the pure-Python equivalent: def call(obj, /, *args, **kwargs): return obj(*args, **kwargs)',
    'Positional-only': 'obj is positional-only, so a keyword argument named obj is passed on to the called function instead of clashing',
    'Dunder':         'operator.__call__ is the same function, documented next to call',
    'Since':          'Added in Python 3.11',
  },

  related: [
    { name: 'methodcaller',       slug: 'methodcaller', when: 'Call a method by NAME on each object' },
    { name: 'functools.partial',  slug: 'partial',      when: 'Fix some arguments now, call later', category: 'stdlib/functools' },
    { name: 'map()',              slug: 'map',          when: 'Pairs functions with arguments',     category: 'functions' },
    { name: 'itertools.starmap',  slug: 'starmap',      when: 'Argument tuples of any length',      category: 'stdlib/itertools' },
    { name: 'callable()',         slug: 'callable',     when: 'Check before calling',               category: 'functions' },
    { name: 'TypeError',          slug: 'typeerror',    when: "What 'object is not callable' raises", category: 'exceptions' },
    { name: 'operator module',    slug: 'operator',     when: 'The other operators as functions',   category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does operator.call do in Python?',
      a: 'operator.call(obj, *args, **kwargs) returns obj(*args, **kwargs): it calls its first argument with all the others. It was added in Python 3.11 so that the call itself can be passed around as a function — to map(), to starmap() or through a table of handlers.',
    },
    {
      q: 'Is there an apply() function in Python 3?',
      a: 'There is no built-in apply in Python 3 — write f(*args, **kwargs). When the call must itself be a function object, as in map(operator.call, funcs, args), use operator.call on 3.11+ or the equivalent lambda on older versions.',
    },
    {
      q: 'What is the difference between operator.call and methodcaller?',
      a: "call takes the callable itself and calls it immediately: operator.call(str.upper, 'abc'). methodcaller takes a method NAME and returns a new callable that looks the method up on whatever object it receives later: methodcaller('upper')('abc'). Both give 'ABC' here.",
    },
    {
      q: 'How do I call several functions with the same argument?',
      a: "[f(x) for f in funcs] is the plainest way. With operator.call, use list(map(operator.call, funcs, repeat(x))) — not map(operator.call, funcs, x), which pairs each function with one item of x.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.call',
    meta:  'operator.call',
  },
};
