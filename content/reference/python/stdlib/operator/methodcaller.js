// content/reference/python/stdlib/operator/methodcaller.js

export const meta = {
  slug:        'methodcaller',
  name:        'operator.methodcaller',
  signature:   'operator.methodcaller(name, /, *args, **kwargs)',
  blurb:       'A callable that calls a method by name on whatever it receives: methodcaller("strip")(s) is s.strip(). Arguments are fixed when the caller is created.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'operator.methodcaller methodcaller python call method by name map str method sort key case insensitive sort methodcaller lower methodcaller with arguments method name must be a string getattr call method dynamically',
};

export const method = {
  slug:      'methodcaller',
  name:      'operator.methodcaller',
  signature: 'operator.methodcaller(name, /, *args, **kwargs)',
  returns:   { type: 'operator.methodcaller', desc: 'A callable c where c(obj) is getattr(obj, name)(*args, **kwargs).' },

  category:    'operator class',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "methodcaller('split', ',') is lambda s: s.split(','): the method is looked up on each object at call time, so one caller works for every type that has a method of that name.",

  covers: ['methodcaller'],

  cheat: {
    commonCall: "sorted(words, key=methodcaller('lower'))",
    returns:    'Whatever the method returns',
    replaces:   "lambda s: s.lower(), lambda s: s.split(',')",
    watchOut:   'The name must be a str — methodcaller(str.lower) is a TypeError',
  },

  parameters: [
    { name: 'name',     type: 'str', required: true,  default: null, desc: 'The method name, looked up with getattr on each object.' },
    { name: '*args',    type: 'any', required: false, default: null, desc: 'Positional arguments passed on every call.' },
    { name: '**kwargs', type: 'any', required: false, default: null, desc: 'Keyword arguments passed on every call.' },
  ],

  modes: [
    {
      id: 'call',
      label: 'map a method',
      blurb: 'Call a str method with one argument on every word. Numbers typed as 6 or 2.5 become int or float.',
      params: [
        { name: 'name',  type: 'str',               hint: 'count, split, zfill …', input: 'text' },
        { name: 'arg',   type: 'str | int | float', hint: 'its argument',          input: 'auto' },
        { name: 'words', type: 'list[str]',         hint: 'comma-separated',       input: 'csv' },
      ],
      template: 'from operator import methodcaller\nf = methodcaller({$name}, {$arg})\n[f(w) for w in {$words}]',
      cases: [
        { id: 'count', label: "count 'a'",      values: { name: 'count', arg: 'a', words: 'banana, apple, kiwi' } },
        { id: 'start', label: "startswith 'a'", values: { name: 'startswith', arg: 'a', words: 'banana, apple, kiwi' } },
        { id: 'zfill', label: 'zfill 4',        values: { name: 'zfill', arg: '4', words: '7, 42, 123' } },
        { id: 'split', label: "split '-'",      values: { name: 'split', arg: '-', words: '2026-10-13, a-b' } },
        { id: 'extra', label: "upper 'x'",      values: { name: 'upper', arg: 'x', words: 'ab' } },
        { id: 'typo',  label: 'typo cuont',     values: { name: 'cuont', arg: 'a', words: 'banana' } },
      ],
    },
    {
      id: 'sort',
      label: 'sort key',
      blurb: 'A method without arguments as the sort key. Case methods are reproduced for ASCII text.',
      params: [
        { name: 'words', type: 'list[str]', hint: 'comma-separated',   input: 'csv' },
        { name: 'name',  type: 'str',       hint: 'lower, upper, strip …', input: 'text' },
      ],
      template: 'from operator import methodcaller\nsorted({$words}, key=methodcaller({$name}))',
      cases: [
        { id: 'lower', label: 'lower',   values: { words: 'banana, Cherry, apple', name: 'lower' } },
        { id: 'plain', label: 'isupper', values: { words: 'b, A, c, D', name: 'isupper' } },
        { id: 'split', label: 'split',   values: { words: 'b a, a c, a b', name: 'split' } },
      ],
    },
  ],
  demoExplainer: "The method is looked up on each word only when the caller runs, so a misspelt name fails at the first call — with \"Did you mean: 'count'?\" added by the 3.13 traceback — and a method that takes no arguments complains about the one you fixed: str.upper() takes no arguments (1 given). As a sort key, methodcaller('lower') gives a case-insensitive order (uppercase letters sort before all lowercase ones otherwise), and boolean keys put False before True. (Methods whose result depends on Unicode case tables are shown for ASCII text only; other text says so instead of guessing.)",

  patterns: [
    {
      name: 'Case-insensitive sort',
      desc: "methodcaller('casefold') is the most thorough; str.lower works too as a key since every item is a str.",
      code: "from operator import methodcaller\nnames.sort(key=methodcaller('casefold'))",
    },
    {
      name: 'Same method, fixed arguments, many objects',
      desc: 'Arguments are bound once — e.g. split every line on a separator.',
      code: "from operator import methodcaller\nsplit_csv = methodcaller('split', ',')\nrows = list(map(split_csv, lines))",
    },
    {
      name: 'Call a method chosen at run time',
      desc: 'A name from config or a command, applied to every object.',
      code: "from operator import methodcaller\naction = methodcaller(command_name, *command_args)\nresults = [action(obj) for obj in targets]",
    },
  ],

  examples: [
    { title: 'Count in every word',       code: "from operator import methodcaller\nf = methodcaller('count', 'a')\n[f(w) for w in ['banana', 'apple', 'kiwi']]", returns: '[3, 1, 0]' },
    { title: 'Keyword arguments too',     code: "from operator import methodcaller\nmethodcaller('split', ',', maxsplit=1)('a,b,c')", returns: "['a', 'b,c']" },
    { title: 'Case-insensitive sort',     code: "from operator import methodcaller\nsorted(['banana', 'Apple', 'cherry'], key=methodcaller('lower'))", returns: "['Apple', 'banana', 'cherry']" },
    { title: 'Pad numbers with zeros',    code: "from operator import methodcaller\nlist(map(methodcaller('zfill', 4), ['7', '42', '123']))", returns: "['0007', '0042', '0123']" },
    { title: 'Any type with the method',  code: "from operator import methodcaller\nd = {'a': 1}\nmethodcaller('get', 'b', 0)(d), methodcaller('get', 'a')(d)", returns: '(0, 1)' },
    { title: 'Tuple argument',            code: "from operator import methodcaller\nmethodcaller('startswith', ('http://', 'https://'))('https://x.org')", returns: 'True' },
    { title: 'The repr shows the call',   code: "from operator import methodcaller\nmethodcaller('upper'), methodcaller('split', ',', maxsplit=1)", returns: "(operator.methodcaller('upper'), operator.methodcaller('split', ',', maxsplit=1))" },
  ],

  pitfalls: [
    {
      name: 'Passing the method instead of its name',
      desc: 'methodcaller wants the NAME. If you already have the function (str.lower), pass it directly as the key.',
      wrong: { label: 'methodcaller(str.upper)', code: 'from operator import methodcaller\nmethodcaller(str.upper)', output: 'TypeError: method name must be a string' },
      fix:   { label: 'key=str.lower',           code: "sorted(['b', 'A', 'c'], key=str.lower)", output: "['A', 'b', 'c']" },
    },
    {
      name: 'Methods that mutate return None',
      desc: 'methodcaller returns what the method returns — for append, sort and the like that is None, and the change happens to the object.',
      wrong: { label: "methodcaller('append', 1)", code: "from operator import methodcaller\nf = methodcaller('append', 1)\nxs = []\nf(xs), xs", output: '(None, [1])' },
      fix:   { label: 'use the object',            code: 'xs = []\nxs.append(1)\nxs', output: '[1]' },
    },
    {
      name: 'A misspelt method name',
      desc: 'Nothing is checked until the first call; then getattr fails with AttributeError (plus a 3.13 hint when a close name exists).',
      wrong: { label: "methodcaller('uper')", code: "from operator import methodcaller\nmethodcaller('uper')('abc')", output: "AttributeError: 'str' object has no attribute 'uper'. Did you mean: 'upper'?" },
      fix:   { label: "methodcaller('upper')", code: "from operator import methodcaller\nmethodcaller('upper')('abc')", output: "'ABC'" },
    },
  ],

  when: {
    use: [
      'Sort keys and map functions that call one method, possibly with fixed arguments',
      'Calling a method chosen by name on objects of different types (duck typing)',
    ],
    avoid: [
      'One known type → the unbound method (str.lower) is simpler',
      'Chains like s.strip().lower() → a lambda or a named function',
    ],
  },

  notes: {
    cpython:   'Modules/_operator.c: the C type operator.methodcaller stores the name, args and kwargs and calls getattr(obj, name)(*args, **kwargs)',
    'Binding': 'The arguments are evaluated once, when the caller is created; mutable arguments are shared by every call',
    'Name':    'Only the name must be a str (checked at creation); whether the method exists is checked per object',
  },

  related: [
    { name: 'attrgetter',  slug: 'attrgetter', when: 'Read an attribute instead of calling it' },
    { name: 'itemgetter',  slug: 'itemgetter', when: 'Look up a key or index' },
    { name: 'operator.call', slug: 'call',     when: 'Call a function object instead of a method name' },
    { name: 'getattr()',   slug: 'getattr',    when: 'What methodcaller does first',     category: 'functions' },
    { name: 'sorted()',    slug: 'sorted',     when: 'Where the key goes',               category: 'functions' },
    { name: 'map()',       slug: 'map',        when: 'Apply the caller to every item',   category: 'functions' },
    { name: 'functools.partial', slug: 'partial', when: 'Fix arguments of a function instead', category: 'stdlib/functools' },
  ],

  faq: [
    {
      q: 'How do I call a method by its name in Python?',
      a: "getattr(obj, 'name')(args) for one object; methodcaller('name', args) when you need a reusable callable — for example to pass as a key= or to map().",
    },
    {
      q: 'What is the difference between methodcaller and partial?',
      a: "partial fixes arguments of one specific function object. methodcaller fixes a method NAME and its arguments; the method is looked up on each object it is called with, so it works across types: methodcaller('get', 'k', 0) works on any mapping with a get method.",
    },
    {
      q: "Why use methodcaller('lower') instead of str.lower?",
      a: "For a list of str there is no difference in the result. methodcaller('lower') also works for other types with a lower method (e.g. bytes), and it can carry arguments; str.lower is shorter when every item is a str.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.methodcaller',
    meta:  'operator.methodcaller',
  },
};
