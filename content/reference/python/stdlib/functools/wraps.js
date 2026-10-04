// content/reference/python/stdlib/functools/wraps.js

export const meta = {
  slug:        'wraps',
  name:        'functools.wraps / update_wrapper',
  signature:   '@functools.wraps(wrapped, assigned=WRAPPER_ASSIGNMENTS, updated=WRAPPER_UPDATES)  ·  functools.update_wrapper(wrapper, wrapped, …)',
  blurb:       'Make a decorator\'s wrapper look like the function it wraps: copies __name__, __doc__, __qualname__ … and sets __wrapped__.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'functools wraps update_wrapper WRAPPER_ASSIGNMENTS WRAPPER_UPDATES decorator preserve function name docstring __name__ __doc__ __wrapped__ __qualname__ __module__ __annotations__ __type_params__ __dict__ python decorator loses name',
};

export const method = {
  slug:      'wraps',
  name:      'functools.wraps / update_wrapper',
  signature: '@functools.wraps(wrapped, assigned=WRAPPER_ASSIGNMENTS, updated=WRAPPER_UPDATES)',
  returns:   { type: 'decorator', desc: 'wraps returns a decorator that calls update_wrapper(wrapper, wrapped, …) and returns the wrapper.' },

  category:    'functools decorator',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Without @wraps every decorated function is called "wrapper" and has no docstring — help(), logs, tracebacks and test reports all show the wrong name. One line inside your decorator fixes it.',

  covers: ['wraps', 'update_wrapper', 'WRAPPER_ASSIGNMENTS', 'WRAPPER_UPDATES'],

  cheat: {
    commonCall: '@functools.wraps(func)\ndef wrapper(*args, **kwargs): ...',
    returns:    'wrapper with func\'s __name__, __doc__, … and __wrapped__ = func',
    replaces:   'copying wrapper.__name__ = func.__name__ by hand',
    watchOut:   'forgetting it: every decorated function is named "wrapper"',
  },

  parameters: [
    { name: 'wrapped',  type: 'callable', required: true,  default: null, desc: 'The original function whose metadata is copied.' },
    { name: 'assigned', type: 'tuple[str, ...]', required: false, default: 'WRAPPER_ASSIGNMENTS', desc: "Attributes copied over: ('__module__', '__name__', '__qualname__', '__doc__', '__annotations__', '__type_params__') in 3.13. Missing ones are skipped." },
    { name: 'updated',  type: 'tuple[str, ...]', required: false, default: 'WRAPPER_UPDATES',     desc: "Attributes merged with dict.update: ('__dict__',) — custom function attributes are carried over." },
  ],

  modes: [
    {
      id: 'with',
      label: 'with @wraps',
      blurb: 'Type a docstring for greet(). The decorated function keeps its own name and docstring.',
      params: [{ name: 'doc', type: 'str', hint: 'docstring of greet', input: 'text' }],
      template: "import functools\ndef logged(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n@logged\ndef greet(name):\n    {$doc}\n    return f'Hello, {name}'\ngreet.__name__, greet.__doc__",
      cases: [
        { id: 'doc',    label: 'a docstring',     values: { doc: 'Say hello to someone.' } },
        { id: 'indent', label: 'leading spaces',  values: { doc: '   Indented first line.' } },
      ],
    },
    {
      id: 'without',
      label: 'without @wraps',
      blurb: 'The same decorator without @wraps: the function now reports the wrapper\'s name and docstring.',
      params: [{ name: 'doc', type: 'str', hint: 'docstring of greet', input: 'text' }],
      template: "def logged(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n@logged\ndef greet(name):\n    {$doc}\n    return f'Hello, {name}'\ngreet.__name__, greet.__doc__, greet.__qualname__",
      cases: [
        { id: 'doc', label: 'a docstring', values: { doc: 'Say hello to someone.' } },
      ],
    },
  ],
  demoExplainer: 'Without @wraps, greet is literally the inner function: its name is "wrapper", its qualified name "logged.<locals>.wrapper", and the docstring you typed is unreachable. Python 3.13 also cleans docstrings at compile time — leading spaces on the first line are removed and tabs expanded — which is why the indented case comes back without its spaces.',

  patterns: [
    {
      name: 'The standard decorator template',
      desc: 'wraps + *args/**kwargs pass everything through unchanged.',
      code: 'import functools\ndef timed(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        try:\n            return func(*args, **kwargs)\n        finally:\n            print(func.__name__, time.perf_counter() - start)\n    return wrapper',
    },
    {
      name: 'Decorator with arguments',
      desc: 'One more level of nesting; wraps still goes on the innermost function.',
      code: 'import functools\ndef retry(times):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for _ in range(times - 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception:\n                    pass\n            return func(*args, **kwargs)\n        return wrapper\n    return decorator',
    },
    {
      name: 'update_wrapper on a non-function wrapper',
      desc: 'Give a partial (or a callable object) the wrapped function\'s metadata.',
      code: 'import functools\nparse_hex = functools.update_wrapper(functools.partial(int, base=16), int)',
    },
  ],

  examples: [
    { title: 'Name and docstring kept',  code: "import functools\ndef deco(f):\n    @functools.wraps(f)\n    def wrapper(*a, **k):\n        return f(*a, **k)\n    return wrapper\n@deco\ndef add(x, y):\n    'Add two numbers.'\n    return x + y\nadd.__name__, add.__doc__", returns: "('add', 'Add two numbers.')" },
    { title: 'Lost without wraps',       code: "def deco(f):\n    def wrapper(*a, **k):\n        return f(*a, **k)\n    return wrapper\n@deco\ndef add(x, y):\n    'Add two numbers.'\n    return x + y\nadd.__name__, add.__doc__", returns: "('wrapper', None)" },
    { title: '__wrapped__ reaches the original', code: "import functools\ndef deco(f):\n    @functools.wraps(f)\n    def wrapper(*a, **k):\n        return f(*a, **k) * 10\n    return wrapper\n@deco\ndef one():\n    return 1\none(), one.__wrapped__()", returns: '(10, 1)' },
    { title: 'WRAPPER_ASSIGNMENTS',      code: 'import functools\nfunctools.WRAPPER_ASSIGNMENTS', returns: "('__module__', '__name__', '__qualname__', '__doc__', '__annotations__', '__type_params__')" },
    { title: 'WRAPPER_UPDATES',          code: 'import functools\nfunctools.WRAPPER_UPDATES',     returns: "('__dict__',)" },
    { title: 'Function attributes are merged', code: "import functools\ndef f():\n    pass\nf.owner = 'ana'\ndef wrapper():\n    pass\nfunctools.update_wrapper(wrapper, f)\nwrapper.owner", returns: "'ana'" },
    { title: 'update_wrapper on a partial', code: "import functools\np = functools.update_wrapper(functools.partial(int, base=2), int)\np.__name__, p('101')", returns: "('int', 5)" },
  ],

  pitfalls: [
    {
      name: 'Decorators that hide the function name',
      desc: 'Logging, help() and test runners read __name__. Without @wraps they all see "wrapper".',
      wrong: { label: 'no wraps', code: "def log(f):\n    def wrapper(*a, **k):\n        return f(*a, **k)\n    return wrapper\n@log\ndef save():\n    pass\n@log\ndef load():\n    pass\nsave.__name__, load.__name__", output: "('wrapper', 'wrapper')" },
      fix:   { label: '@wraps',   code: "import functools\ndef log(f):\n    @functools.wraps(f)\n    def wrapper(*a, **k):\n        return f(*a, **k)\n    return wrapper\n@log\ndef save():\n    pass\n@log\ndef load():\n    pass\nsave.__name__, load.__name__", output: "('save', 'load')" },
    },
    {
      name: 'Calling wraps without the function',
      desc: 'wraps is a decorator FACTORY: it needs the wrapped function as its argument.',
      wrong: { label: '@functools.wraps', code: "import functools\ndef deco(f):\n    @functools.wraps\n    def wrapper(*a, **k):\n        return f(*a, **k)\n    return wrapper\n@deco\ndef hi():\n    return 'hi'\nhi()", output: "TypeError: update_wrapper() missing 1 required positional argument: 'wrapper'" },
      fix:   { label: '@functools.wraps(f)', code: "import functools\ndef deco(f):\n    @functools.wraps(f)\n    def wrapper(*a, **k):\n        return f(*a, **k)\n    return wrapper\n@deco\ndef hi():\n    return 'hi'\nhi()", output: "'hi'" },
    },
  ],

  when: {
    use: [
      'Every decorator that returns a new function',
      'Giving partial objects or callable instances a proper name (update_wrapper)',
    ],
    avoid: [
      'Decorators that return the original function unchanged (registration decorators) — nothing to copy',
    ],
  },

  notes: {
    cpython:       'Pure Python in Lib/functools.py: wraps(wrapped) is partial(update_wrapper, wrapped=wrapped, assigned=…, updated=…)',
    '__wrapped__': 'Added automatically since 3.2; since 3.4 it always points to the wrapped function, even if that function has its own __wrapped__',
    'Versions':    '__type_params__ was added to WRAPPER_ASSIGNMENTS in 3.12',
    'Signature':   'inspect.signature() follows __wrapped__, so help() shows the original parameters',
  },

  related: [
    { name: 'functools.lru_cache', slug: 'lru_cache', when: 'A decorator that keeps the name for you' },
    { name: 'functools.partial',   slug: 'partial',   when: 'Has no __name__ until update_wrapper gives it one' },
    { name: 'def',                 slug: 'def',       when: 'Functions and their __name__/__doc__', category: 'keywords' },
    { name: 'functools module',    slug: 'functools', when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does my decorated function have the name "wrapper"?',
      a: 'The decorator returned its inner function, which is named wrapper. Put @functools.wraps(func) on that inner function to copy the original __name__, __doc__, __qualname__ and the rest.',
    },
    {
      q: 'What does functools.wraps copy?',
      a: "WRAPPER_ASSIGNMENTS — __module__, __name__, __qualname__, __doc__, __annotations__ and __type_params__ (3.12+) — and it updates __dict__ (WRAPPER_UPDATES). It also sets __wrapped__ to the original function.",
    },
    {
      q: 'How do I get the original function from a decorated one?',
      a: 'If the decorator used functools.wraps, the original is f.__wrapped__. inspect.unwrap(f) follows the whole chain of __wrapped__ attributes.',
    },
    {
      q: 'What is the difference between wraps and update_wrapper?',
      a: 'update_wrapper(wrapper, wrapped) does the copying and returns wrapper. wraps(wrapped) is the decorator form of the same thing, convenient on a def inside a decorator.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.wraps',
    meta:  'functools.wraps',
  },
};
