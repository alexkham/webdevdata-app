// content/reference/python/functions/dir.js

export const meta = {
  slug:        'dir',
  name:        'dir',
  signature:   'dir([object])',
  blurb:       'List names in the local scope or on an object — introspection with sorted output.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'dir list attributes methods introspection scope names discover explore instance class',
};

export const method = {
  slug:      'dir',
  name:      'dir',
  signature: 'dir([object])',
  returns:   { type: 'list[str]', desc: 'A sorted list of names. Without argument: names in the current local scope. With object: names accessible on the object (attributes and methods, including inherited). Includes dunder names like __init__.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'The introspection escape hatch — \"what can I do with this thing?\"',

  cheat: {
    commonCall: 'dir(obj)',
    returns:    'a sorted list of names',
    replaces:   'staring at the docs when you just want to see what is available',
    watchOut:   'includes dunder names — filter with a comprehension if you want the \"public\" surface',
  },

  parameters: [
    { name: 'object', type: 'Any', required: false, default: null, desc: 'Any object. Without an argument, returns names in the current local scope. With an argument, returns names accessible on the object — instance attributes, class attributes, methods, inherited attributes.' },
  ],

  demoParams: [
    { name: 'type', type: 'str', hint: 'type: str / list / dict / int / set / tuple', input: 'text' },
  ],
  cases: [
    { id: 'str',    label: 'str',    values: { type: 'str' } },
    { id: 'list',   label: 'list',   values: { type: 'list' } },
    { id: 'dict',   label: 'dict',   values: { type: 'dict' } },
    { id: 'set',    label: 'set',    values: { type: 'set' } },
    { id: 'int',    label: 'int',    values: { type: 'int' } },
    { id: 'tuple',  label: 'tuple',  values: { type: 'tuple' } },
    { id: 'bytes',  label: 'bytes',  values: { type: 'bytes' } },
  ],
  demoExplainer: 'The demo shows the PUBLIC attribute names on each built-in type (dunder names hidden for readability). In real code dir(x) returns EVERY name — dunder and public — sorted alphabetically. dir() with no argument returns names in the CURRENT scope, useful in the REPL. For a rich view of an object (including type, docstring, and members), use help() instead.',

  patterns: [
    {
      name: 'Filter out dunders',
      desc: 'The public interface — everything that does not start with __.',
      code: 'public = [n for n in dir(obj) if not n.startswith("_")]',
    },
    {
      name: 'Find methods only',
      desc: 'Skip attributes, keep callables.',
      code: 'methods = [n for n in dir(obj) if callable(getattr(obj, n))]',
    },
    {
      name: 'Discover interactively in the REPL',
      desc: 'The canonical \"what is this?\" workflow.',
      code: '>>> dir(some_object)\n[\'__class__\', \'__init__\', ...]',
    },
    {
      name: 'For rich info, use help() instead',
      desc: 'dir gives names; help gives docstrings and signatures.',
      code: 'help(obj)   # prints the type, docstring, and methods',
    },
  ],

  examples: [
    { title: 'str attributes',      code: 'dir(str)[:5]',              returns: "['__add__', '__class__', ...]" },
    { title: 'Filter dunders',      code: '[n for n in dir(list) if not n.startswith("_")]', returns: "['append', 'clear', 'copy', ...]" },
    { title: 'Current scope',       code: 'dir()',                     returns: '["__builtins__", "__name__", ...]' },
    { title: 'Module',              code: 'import math\ndir(math)',    returns: "['acos', 'asin', 'atan', ..., 'pi']" },
    { title: 'Instance vs class',   code: '"hi".upper\ndir("hi")[:3]', returns: 'shows both instance and class attrs' },
  ],

  pitfalls: [
    {
      name: 'Result includes ALL attributes — dunders too',
      desc: 'The output can be overwhelming. Every dunder method (__init__, __repr__, __eq__, ...) appears. Filter with a comprehension when you want just the \"public\" API.',
      wrong: { label: 'Overwhelming list', code: 'dir(obj)', output: 'includes ~30 dunders per object' },
      fix:   { label: 'Filter dunders',    code: '[n for n in dir(obj) if not n.startswith("_")]', output: 'public surface only' },
    },
    {
      name: 'Sorted output — NOT source order',
      desc: 'The result is alphabetically sorted, not in definition order. If you need declaration order, use vars() or __dict__.',
      wrong: { label: 'Assumed source order', code: 'dir(MyClass)', output: 'alphabetical, not the class body order' },
      fix:   { label: 'Use vars()',            code: 'list(vars(MyClass))', output: 'declaration order (Python 3.7+)' },
    },
    {
      name: 'Custom __dir__ can lie',
      desc: 'A class can override __dir__ to return a curated list. This is useful for public API design but means dir() may not show every real attribute.',
      wrong: { label: 'Missing real attr',    code: '# obj hides "secret" from dir()\n"secret" in dir(obj)', output: 'False, but hasattr(obj, "secret") is True' },
      fix:   { label: 'Check with hasattr',   code: 'hasattr(obj, name)', output: 'authoritative' },
    },
    {
      name: 'dir() with no argument uses the CURRENT scope',
      desc: 'Not the caller\'s scope, not the module scope — the current local scope. Inside a function, that means local variables only.',
      wrong: { label: 'Assumed globals', code: 'def f():\n    x = 1\n    return dir()', output: "['x']  # only local x" },
      fix:   { label: 'Use globals()',    code: 'def f():\n    return list(globals())', output: 'module-level names' },
    },
  ],

  when: {
    use: [
      'REPL exploration — \"what methods does this have?\"',
      'Programmatic introspection with filtering',
      'Building documentation or discovering public API',
      'Debugging \"why does this attribute not exist?\"',
    ],
    avoid: [
      'You need docstrings → help()',
      'You need declaration order → vars() or __dict__',
      'You need type-checked signatures → inspect.signature',
      'You have a specific attribute in mind → hasattr / getattr is more direct',
    ],
  },

  notes: {
    complexity: 'O(n log n) — walks the MRO and sorts',
    return:     'A sorted list of strings',
    cpython:    'Python/bltinmodule.c :: builtin_dir — calls __dir__',
    memory:     'Allocates one list',
    threadSafe: 'Yes for immutable class hierarchies',
  },

  related: [
    { name: 'hasattr',   slug: 'hasattr',   when: 'Check existence of a specific attribute' },
    { name: 'getattr',   slug: 'getattr',   when: 'Retrieve a specific attribute' },
    { name: 'type',      slug: 'type',      when: 'Get the class of an object' },
    { name: 'isinstance',slug: 'isinstance',when: 'Type-based check rather than name-based discovery' },
  ],

  faq: [
    {
      q: 'Why does dir() include so many dunder methods?',
      a: 'Because every object inherits from object, which defines many dunders (__init__, __repr__, __eq__, ...). dir shows them all. Filter with a comprehension `[n for n in dir(x) if not n.startswith("_")]` to see just the public surface.',
    },
    {
      q: 'What is the difference between dir() and vars()?',
      a: 'dir(x) returns a sorted list of ALL names accessible on x (including inherited). vars(x) returns the __dict__ of x — only instance-specific attributes, in declaration order. Very different scopes.',
    },
    {
      q: 'How do I get the docstring of a method?',
      a: 'Use help(obj) or access __doc__: `str.upper.__doc__`. dir only gives names; docstrings come from help or __doc__.',
    },
  ],

  history: [
    { version: '1.0', note: 'dir() has been a builtin since Python 1.0.' },
    { version: '2.6', note: '__dir__ hook added — classes can customize what dir() reports.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#dir',
    meta:  'dir',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
  ],
};