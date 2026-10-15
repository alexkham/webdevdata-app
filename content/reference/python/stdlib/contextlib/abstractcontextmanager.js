// content/reference/python/stdlib/contextlib/abstractcontextmanager.js — AbstractContextManager / AbstractAsyncContextManager

export const meta = {
  slug:        'abstractcontextmanager',
  name:        'contextlib.AbstractContextManager / AbstractAsyncContextManager',
  signature:   'class contextlib.AbstractContextManager · class contextlib.AbstractAsyncContextManager',
  blurb:       'Abstract base classes for context managers: subclass to get a default __enter__ (or __aenter__) that returns self, and use them with isinstance to test whether an object supports with / async with.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.6+ (AbstractAsyncContextManager 3.7+)',
  searchTerms: 'contextlib AbstractContextManager AbstractAsyncContextManager python abc context manager isinstance check context manager protocol __enter__ __exit__ __aenter__ __aexit__ typing ContextManager subclasshook',
};

export const method = {
  slug:      'abstractcontextmanager',
  name:      'contextlib.AbstractContextManager / AbstractAsyncContextManager',
  signature: 'class contextlib.AbstractContextManager · class contextlib.AbstractAsyncContextManager',
  returns:   { type: 'abc.ABC subclass', desc: 'Base classes; __exit__ / __aexit__ is abstract, __enter__ / __aenter__ returns self.' },

  category:    'contextlib ABC',
  version:     'Python 3.6+ (AbstractAsyncContextManager 3.7+)',
  hasLiveDemo: true,

  subtitle: 'Two jobs. As a base class it saves writing "def __enter__(self): return self" and refuses to instantiate a class without __exit__. As an ABC it answers isinstance(obj, AbstractContextManager) for any class that has __enter__ and __exit__ — no registration needed.',

  covers: ['AbstractContextManager', 'AbstractAsyncContextManager'],

  cheat: {
    commonCall: 'class Timer(AbstractContextManager):\n    def __exit__(self, exc_type, exc, tb):\n        ...',
    returns:    'with Timer() as t:  # t is the Timer',
    replaces:   'writing a trivial __enter__ that returns self',
    watchOut:   'isinstance checks only that the methods exist, not what they do',
  },

  parameters: [],

  attributes: [
    { name: 'AbstractContextManager.__enter__',       type: 'method',          meaning: 'Default implementation: returns self.' },
    { name: 'AbstractContextManager.__exit__',        type: 'abstract method', meaning: 'Must be overridden; the default body returns None.' },
    { name: 'AbstractAsyncContextManager.__aenter__', type: 'coroutine',       meaning: 'Default implementation: returns self.' },
    { name: 'AbstractAsyncContextManager.__aexit__',  type: 'abstract coroutine', meaning: 'Must be overridden; the default body returns None.' },
    { name: '__subclasshook__',                       type: 'classmethod',     meaning: 'Makes isinstance / issubclass true for any class whose MRO defines both methods (a method set to None counts as missing).' },
  ],

  modes: [
    {
      id: 'hook',
      label: 'isinstance check',
      blurb: 'Duck inherits from nothing. List the methods it defines and see what the two ABCs say.',
      params: [{ name: 'methods', type: 'list[str]', hint: 'e.g. __enter__, __exit__', input: 'csv' }],
      template: "from contextlib import AbstractContextManager, AbstractAsyncContextManager\nmethods = {$methods}\nclass Duck:\n    if '__enter__' in methods:\n        def __enter__(self):\n            return self\n    if '__exit__' in methods:\n        def __exit__(self, *exc):\n            return None\n    if '__aenter__' in methods:\n        async def __aenter__(self):\n            return self\n    if '__aexit__' in methods:\n        async def __aexit__(self, *exc):\n            return None\nisinstance(Duck(), AbstractContextManager), isinstance(Duck(), AbstractAsyncContextManager)",
      cases: [
        { id: 'sync',  label: 'sync pair',     values: { methods: '__enter__, __exit__' } },
        { id: 'async', label: 'async pair',    values: { methods: '__aenter__, __aexit__' } },
        { id: 'half',  label: 'only __enter__', values: { methods: '__enter__' } },
      ],
    },
    {
      id: 'base',
      label: 'as a base class',
      blurb: 'Res inherits from AbstractContextManager and defines the listed methods; its own __enter__ would return a string.',
      params: [{ name: 'methods', type: 'list[str]', hint: '__enter__ and/or __exit__', input: 'csv' }],
      template: "from contextlib import AbstractContextManager\nmethods = {$methods}\nclass Res(AbstractContextManager):\n    if '__enter__' in methods:\n        def __enter__(self):\n            return 'something else'\n    if '__exit__' in methods:\n        def __exit__(self, *exc):\n            return None\nres = Res()\nwith res as r:\n    pass\nr is res",
      cases: [
        { id: 'exit', label: '__exit__ only', values: { methods: '__exit__' } },
        { id: 'both', label: 'both',          values: { methods: '__enter__, __exit__' } },
        { id: 'none', label: 'no __exit__',   values: { methods: '__enter__' } },
      ],
    },
  ],
  demoExplainer: "isinstance answers True as soon as the class defines both methods of a pair, although Duck never inherits from the ABC: the subclass hook only looks for the names. Half a pair is not enough. As a base class, AbstractContextManager supplies an __enter__ that returns self, so r is res is True until Res defines its own __enter__; without __exit__ the class cannot even be instantiated.",

  examples: [
    { title: 'Only __exit__ to write',          code: "from contextlib import AbstractContextManager\nclass Timer(AbstractContextManager):\n    def __exit__(self, exc_type, exc, tb):\n        print('exit')\nwith Timer() as t:\n    print(type(t).__name__)", returns: 'Timer\nexit' },
    { title: 'A missing __exit__ is caught early', code: 'from contextlib import AbstractContextManager\nclass Incomplete(AbstractContextManager):\n    pass\nIncomplete()', returns: "TypeError: Can't instantiate abstract class Incomplete without an implementation for abstract method '__exit__'" },
    { title: 'Duck typing passes isinstance',   code: 'from contextlib import AbstractContextManager\nclass Duck:\n    def __enter__(self):\n        return self\n    def __exit__(self, *exc):\n        return None\nisinstance(Duck(), AbstractContextManager), issubclass(Duck, AbstractContextManager)', returns: '(True, True)' },
    { title: 'Both methods are required',       code: 'from contextlib import AbstractContextManager\nclass OnlyEnter:\n    def __enter__(self):\n        return self\nisinstance(OnlyEnter(), AbstractContextManager)', returns: 'False' },
    { title: 'Built-in context managers',       code: "import threading\nfrom contextlib import AbstractContextManager\nwith open('f.txt', 'w') as f:\n    pass\nisinstance(f, AbstractContextManager), isinstance(threading.Lock(), AbstractContextManager), isinstance(42, AbstractContextManager)", returns: '(True, True, False)' },
    { title: 'The async ABC',                   code: "from contextlib import AbstractAsyncContextManager\nclass Conn(AbstractAsyncContextManager):\n    async def __aexit__(self, *exc):\n        return None\nimport asyncio\nasync def main():\n    async with Conn() as c:\n        return type(c).__name__\nasyncio.run(main())", returns: "'Conn'" },
    { title: 'Which contextlib objects are async', code: 'from contextlib import AbstractAsyncContextManager, nullcontext, suppress\nisinstance(nullcontext(), AbstractAsyncContextManager), isinstance(suppress(), AbstractAsyncContextManager)', returns: '(True, False)' },
    { title: 'Subscriptable in type hints (PEP 585)', code: 'from contextlib import AbstractContextManager\nAbstractContextManager[int]', returns: 'contextlib.AbstractContextManager[int]' },
  ],

  pitfalls: [
    {
      name: 'Setting __exit__ = None to opt out',
      desc: 'The subclass hook treats a None attribute as "not implemented", so such a class fails the isinstance test even though it has the name.',
      wrong: { label: '__exit__ = None', code: 'from contextlib import AbstractContextManager\nclass Opt:\n    def __enter__(self):\n        return self\n    __exit__ = None\nisinstance(Opt(), AbstractContextManager)', output: 'False' },
      fix:   { label: 'a real __exit__', code: 'from contextlib import AbstractContextManager\nclass Opt:\n    def __enter__(self):\n        return self\n    def __exit__(self, *exc):\n        return None\nisinstance(Opt(), AbstractContextManager)', output: 'True' },
    },
    {
      name: 'Inheriting but forgetting __exit__',
      desc: '__exit__ is abstract, so the class cannot even be instantiated — which is the point: the mistake shows up at once, not at the end of a with block.',
      wrong: { label: 'no __exit__', code: 'from contextlib import AbstractContextManager\nclass Incomplete(AbstractContextManager):\n    def __enter__(self):\n        return self\nIncomplete()', output: "TypeError: Can't instantiate abstract class Incomplete without an implementation for abstract method '__exit__'" },
      fix:   { label: 'add __exit__', code: 'from contextlib import AbstractContextManager\nclass Complete(AbstractContextManager):\n    def __exit__(self, *exc):\n        return None\ntype(Complete()).__name__', output: "'Complete'" },
    },
  ],

  when: {
    use: [
      'Class-based context managers whose __enter__ just returns self',
      'Checking at run time whether an argument can be used in with / async with',
    ],
    avoid: [
      'Type annotations only → typing.ContextManager / typing.AsyncContextManager or these classes subscripted, e.g. AbstractContextManager[Connection]',
      'Generator-based context managers → @contextmanager needs no class at all',
    ],
  },

  notes: {
    cpython:       'Lib/contextlib.py: abc.ABC subclasses with __slots__ = (); __subclasshook__ uses _collections_abc._check_methods(C, "__enter__", "__exit__") (or "__aenter__", "__aexit__")',
    'In contextlib': 'Most contextlib classes (suppress, closing, nullcontext, chdir, ExitStack, redirect_stdout …) derive from AbstractContextManager; aclosing and AsyncExitStack derive from AbstractAsyncContextManager instead, and nullcontext derives from both',
  },

  related: [
    { name: 'contextlib.contextmanager', slug: 'contextmanager', when: 'Context managers without a class' },
    { name: 'ContextDecorator', slug: 'contextdecorator', when: 'Another base class: use the CM as a decorator' },
    { name: 'isinstance()', slug: 'isinstance', when: 'The check the ABC answers', category: 'functions' },
    { name: 'with', slug: 'with', when: 'What calls __enter__ and __exit__', category: 'keywords' },
    { name: 'typing module', slug: 'typing', when: 'ContextManager in annotations', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I write a class-based context manager in Python?',
      a: 'Define __enter__(self), whose return value is bound by "as", and __exit__(self, exc_type, exc, tb), which runs when the block ends; returning True from __exit__ swallows an exception from the block. Inheriting from AbstractContextManager supplies an __enter__ that returns self, so often only __exit__ is left to write.',
    },
    {
      q: 'How do I check if an object is a context manager in Python?',
      a: 'isinstance(obj, contextlib.AbstractContextManager) is True when the object\'s class defines __enter__ and __exit__ (inherited or not, and not set to None). For async with, test contextlib.AbstractAsyncContextManager, which looks for __aenter__ and __aexit__.',
    },
    {
      q: 'Do I have to inherit from AbstractContextManager?',
      a: 'No. Any class with __enter__ and __exit__ works in with statements and passes the isinstance check. Inheriting only saves the boilerplate __enter__ and makes a missing __exit__ an error at instantiation.',
    },
    {
      q: 'What is the difference between AbstractContextManager and typing.ContextManager?',
      a: 'typing.ContextManager is a deprecated alias whose __origin__ is contextlib.AbstractContextManager, kept for older code; isinstance gives the same answer with either. Since 3.9 (PEP 585) the contextlib class itself can be subscripted in annotations.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.AbstractContextManager',
    meta:  'contextlib.AbstractContextManager',
  },
};
