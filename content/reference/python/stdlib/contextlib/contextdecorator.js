// content/reference/python/stdlib/contextlib/contextdecorator.js — ContextDecorator (and AsyncContextDecorator)

export const meta = {
  slug:        'contextdecorator',
  name:        'contextlib.ContextDecorator',
  signature:   'class contextlib.ContextDecorator',
  blurb:       'Base class (or mixin) that lets a class-based context manager also be used as a function decorator: @cm() wraps every call of the function in "with cm:". AsyncContextDecorator does the same for async with.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+ (AsyncContextDecorator 3.10+)',
  searchTerms: 'contextlib ContextDecorator AsyncContextDecorator python context manager as decorator decorate function with context manager mixin _recreate_cm wrap every call',
};

export const method = {
  slug:      'contextdecorator',
  name:      'contextlib.ContextDecorator',
  signature: 'class contextlib.ContextDecorator',
  returns:   { type: 'class', desc: 'Inherit from it; instances gain __call__(func), which returns a wrapper running func inside "with self._recreate_cm():".' },

  category:    'contextlib class',
  version:     'Python 3.2+ (AsyncContextDecorator 3.10+)',
  hasLiveDemo: true,

  subtitle: 'Write __enter__ and __exit__ as usual, inherit from ContextDecorator, and the same object works both as "with traced():" and as "@traced()". Note that the decorator reuses the one instance for every call — @contextmanager objects are the exception, they recreate themselves.',

  covers: ['ContextDecorator'],

  cheat: {
    commonCall: "class traced(ContextDecorator):\n    def __enter__(self): ...\n    def __exit__(self, *exc): ...\n\n@traced()\ndef work(): ...",
    returns:    'work() runs inside with traced():',
    replaces:   'a with block wrapped around the whole function body',
    watchOut:   'one instance is shared by all calls; __exit__ can still suppress',
  },

  parameters: [],

  attributes: [
    { name: '__call__(func)',  type: 'method', meaning: 'Returns a functools.wraps wrapper: inner(*args, **kwds) runs "with self._recreate_cm(): return func(*args, **kwds)".' },
    { name: '_recreate_cm()',  type: 'method', meaning: 'Returns self in ContextDecorator; _GeneratorContextManager overrides it to build a fresh one-shot instance per call.' },
    { name: 'AsyncContextDecorator', type: 'class (3.10+)', meaning: 'The async version: decorates coroutine functions and enters with "async with". Public, but not listed in contextlib.__all__.' },
  ],

  modes: [
    {
      id: 'decorate',
      label: 'as a decorator',
      blurb: 'traced(label) logs start and end around every call of divide. Try n = 0: the exit still runs.',
      params: [
        { name: 'label', type: 'str', hint: 'label to log', input: 'text' },
        { name: 'n',     type: 'int', hint: 'divisor', input: 'number' },
      ],
      template: "from contextlib import ContextDecorator\nlog = []\nclass traced(ContextDecorator):\n    def __init__(self, label):\n        self.label = label\n    def __enter__(self):\n        log.append('start ' + self.label)\n        return self\n    def __exit__(self, *exc):\n        log.append('end ' + self.label)\n        return False\n@traced({$label})\ndef divide(a, b):\n    return a // b\ntry:\n    log.append(divide(100, {$n}))\nexcept ZeroDivisionError:\n    log.append('error')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 8', values: { label: 'divide', n: '8' } },
        { id: 'zero', label: 'n = 0', values: { label: 'divide', n: '0' } },
      ],
    },
  ],
  demoExplainer: "The log shows start and end around the call, then the result 12 for n = 8. With n = 0 the ZeroDivisionError passes through __exit__ (which logs end and returns False) before the caller's except clause logs error — exactly what an explicit with block inside divide would do.",

  patterns: [
    {
      name: 'One helper, two uses',
      desc: 'The same class works around a block or around a whole function.',
      code: "from contextlib import ContextDecorator\nimport time\n\nclass timed(ContextDecorator):\n    def __init__(self, label):\n        self.label = label\n    def __enter__(self):\n        self.start = time.perf_counter()\n        return self\n    def __exit__(self, *exc):\n        print(self.label, time.perf_counter() - self.start)\n        return False\n\nwith timed('block'):\n    work()\n\n@timed('function')\ndef job():\n    work()",
    },
    {
      name: 'Mixin for an existing base class',
      desc: 'Add ContextDecorator next to your own base.',
      code: 'from contextlib import ContextDecorator\n\nclass transaction(BaseTransaction, ContextDecorator):\n    def __enter__(self):\n        self.begin()\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        self.commit() if exc_type is None else self.rollback()\n        return False',
    },
    {
      name: 'Async version (3.10+)',
      desc: 'AsyncContextDecorator for coroutine functions.',
      code: "from contextlib import AsyncContextDecorator\n\nclass logged(AsyncContextDecorator):\n    async def __aenter__(self):\n        print('start')\n        return self\n    async def __aexit__(self, *exc):\n        print('end')\n        return False\n\n@logged()\nasync def handler():\n    ...",
    },
  ],

  examples: [
    { title: 'The docs example',              code: "from contextlib import ContextDecorator\nclass mycontext(ContextDecorator):\n    def __enter__(self):\n        print('Starting')\n        return self\n    def __exit__(self, *exc):\n        print('Finishing')\n        return False\n@mycontext()\ndef function():\n    print('The bit in the middle')\nfunction()", returns: 'Starting\nThe bit in the middle\nFinishing' },
    { title: '__exit__ can still suppress',   code: "from contextlib import ContextDecorator\nclass quiet(ContextDecorator):\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        return exc_type is ValueError\n@quiet()\ndef parse(text):\n    return int(text)\nparse('12'), parse('twelve')", returns: '(12, None)' },
    { title: 'Name and docstring are kept',  code: "from contextlib import ContextDecorator\nclass tagged(ContextDecorator):\n    def __enter__(self):\n        return self\n    def __exit__(self, *exc):\n        return False\n@tagged()\ndef f():\n    '''Docstring kept.'''\nf.__name__, f.__doc__, f.__wrapped__.__name__", returns: "('f', 'Docstring kept.', 'f')" },
    { title: 'One instance for every call',   code: 'from contextlib import ContextDecorator\nclass counter(ContextDecorator):\n    calls = 0\n    def __enter__(self):\n        counter.calls += 1\n        return self\n    def __exit__(self, *exc):\n        return False\n@counter()\ndef f():\n    pass\nf(); f(); f()\ncounter.calls', returns: '3' },
    { title: '@contextmanager objects are ContextDecorators', code: "from contextlib import contextmanager\n@contextmanager\ndef tag(name):\n    print(f'<{name}>')\n    yield\n    print(f'</{name}>')\n@tag('h1')\ndef title():\n    print('Hello')\ntitle()", returns: '<h1>\nHello\n</h1>' },
    { title: 'AsyncContextDecorator',         code: "import asyncio\nfrom contextlib import AsyncContextDecorator\nclass mycontext(AsyncContextDecorator):\n    async def __aenter__(self):\n        print('Starting')\n        return self\n    async def __aexit__(self, *exc):\n        print('Finishing')\n        return False\n@mycontext()\nasync def function():\n    print('The bit in the middle')\nasyncio.run(function())", returns: 'Starting\nThe bit in the middle\nFinishing' },
    { title: 'AsyncContextDecorator is outside __all__', code: "import contextlib\n'AsyncContextDecorator' in contextlib.__all__, hasattr(contextlib, 'AsyncContextDecorator')", returns: '(False, True)' },
  ],

  pitfalls: [
    {
      name: 'Decorating a generator function (before Python 3.15)',
      desc: 'Up to Python 3.14 the wrapper only covers the call that creates the generator — the context is entered and exited before the first item is produced (output below from 3.13). Python 3.15 keeps the context open across the iteration; for code that must also run on older versions, put the with inside the generator.',
      wrong: { label: '@tracked() on a generator', code: "from contextlib import ContextDecorator\nclass tracked(ContextDecorator):\n    def __enter__(self):\n        print('enter')\n        return self\n    def __exit__(self, *exc):\n        print('exit')\n@tracked()\ndef numbers():\n    yield 1\n    yield 2\ngen = numbers()\nprint('created')\nlist(gen)", output: "enter\nexit\ncreated\n[1, 2]" },
      fix:   { label: 'with inside', code: "from contextlib import ContextDecorator\nclass tracked(ContextDecorator):\n    def __enter__(self):\n        print('enter')\n        return self\n    def __exit__(self, *exc):\n        print('exit')\ndef numbers():\n    with tracked():\n        yield 1\n        yield 2\ngen = numbers()\nprint('created')\nlist(gen)", output: "created\nenter\nexit\n[1, 2]" },
    },
    {
      name: 'State that assumes a fresh object per call',
      desc: 'ContextDecorator reuses the instance you created in the decorator line. A context manager that can only be entered once breaks on the second call.',
      wrong: { label: 'single-use', code: "from contextlib import ContextDecorator\nclass once(ContextDecorator):\n    def __init__(self):\n        self.used = False\n    def __enter__(self):\n        if self.used:\n            raise RuntimeError('already used')\n        self.used = True\n        return self\n    def __exit__(self, *exc):\n        return False\n@once()\ndef f():\n    return 'ran'\nf(), f()", output: 'RuntimeError: already used' },
      fix:   { label: '@contextmanager', code: "from contextlib import contextmanager\n@contextmanager\ndef once():\n    yield\n@once()\ndef f():\n    return 'ran'\nf(), f()", output: "('ran', 'ran')" },
    },
  ],

  when: {
    use: [
      'A class-based context manager that should also wrap whole functions',
      'Timing, logging, transactions or locks applied to every call of a function',
    ],
    avoid: [
      'Generator, coroutine or async generator functions before Python 3.15 → put the with inside them',
      'Context managers that must be fresh for every use → @contextmanager (it recreates itself)',
      'When the function needs the "as" value → a decorator cannot pass it in; use an explicit with',
    ],
  },

  notes: {
    cpython:     'Lib/contextlib.py: __call__ returns a functools.wraps(func) wrapper "def inner(*args, **kwds): with self._recreate_cm(): return func(*args, **kwds)"',
    'Python 3.15': 'Changed in 3.15 (docs): decorating a generator, coroutine or async generator function keeps the context open across the iteration or await; up to 3.14 the context exits as soon as the generator or coroutine object is created. AsyncContextDecorator also accepts synchronous functions since 3.15, returning an async wrapper',
    'Async':     'AsyncContextDecorator (3.10) is exported by contextlib but not listed in __all__, so "from contextlib import *" does not import it',
  },

  related: [
    { name: 'contextlib.contextmanager', slug: 'contextmanager', when: 'Generator-based CMs, decorators that recreate themselves' },
    { name: 'contextlib.asynccontextmanager', slug: 'asynccontextmanager', when: 'Async decorators from a generator (3.10+)' },
    { name: 'AbstractContextManager', slug: 'abstractcontextmanager', when: 'The other base class for class-based CMs' },
    { name: 'functools.wraps', slug: 'wraps', when: 'How the wrapper keeps the name and docstring', category: 'stdlib/functools' },
    { name: 'def', slug: 'def', when: 'Decorators in general', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I use a context manager as a decorator?',
      a: 'Inherit from contextlib.ContextDecorator (alongside your __enter__ and __exit__), then write @my_cm() above a function. Every call runs inside "with my_cm():". Context managers made with @contextmanager support this out of the box.',
    },
    {
      q: 'Is a new context manager created for each call of the decorated function?',
      a: 'Not for ContextDecorator subclasses: _recreate_cm() returns the same instance every time. @contextmanager objects override _recreate_cm() and build a new generator per call, because they are single-use.',
    },
    {
      q: 'Can the decorated function get the value __enter__ returns?',
      a: 'No — the decorator discards it. If the function needs the "as" value, use an explicit with statement inside the function.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.ContextDecorator',
    meta:  'contextlib.ContextDecorator',
  },
};
