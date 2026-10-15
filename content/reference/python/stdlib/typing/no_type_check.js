// content/reference/python/stdlib/typing/no_type_check.js — no_type_check and no_type_check_decorator

export const meta = {
  slug:        'no_type_check',
  name:        'typing.no_type_check / no_type_check_decorator',
  signature:   '@no_type_check · @no_type_check_decorator',
  blurb:       'Declare that a function\'s or class\'s annotations are not type hints: type checkers skip them and get_type_hints() returns {}. no_type_check_decorator is deprecated since 3.13 and goes away in 3.15.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.5+ (no_type_check_decorator deprecated 3.13)',
  searchTerms: 'typing.no_type_check no_type_check no_type_check_decorator disable type checking annotations are not type hints __no_type_check__ get_type_hints empty dict deprecated 3.15',
};

export const method = {
  slug:      'no_type_check',
  name:      'typing.no_type_check / no_type_check_decorator',
  signature: '@no_type_check · @no_type_check_decorator',
  returns:   { type: 'the decorated object', desc: 'no_type_check marks the object in place (__no_type_check__ = True) and returns it; no_type_check_decorator returns a decorator that does so for every function it decorates.' },

  category:    'typing decorator',
  version:     'Python 3.5+ (no_type_check_decorator deprecated 3.13)',
  hasLiveDemo: false,

  subtitle: 'For code that uses annotations for something other than types (routing tables, units, documentation strings), @no_type_check stops type checkers from complaining and makes get_type_hints() return an empty dict instead of failing. The modern alternative is Annotated, which keeps a real type next to the metadata.',

  covers: ['no_type_check', 'no_type_check_decorator'],

  cheat: {
    commonCall: "@no_type_check\ndef route(path: '/users', method: 'GET'): ...",
    returns:    'the same function; get_type_hints(route) → {}',
    replaces:   '# type: ignore on every line of a function',
    watchOut:   'It disables checking of the whole function or class',
  },

  parameters: [],

  patterns: [
    {
      name: 'Annotations as metadata',
      desc: 'Legacy APIs that store non-type objects in annotations.',
      code: 'from typing import no_type_check\n\n@no_type_check\ndef handler(path: "/users/{id}", method: "GET") -> "json":\n    ...',
    },
    {
      name: 'Prefer Annotated in new code',
      desc: 'The type stays checkable and the metadata is still available at runtime.',
      code: 'from typing import Annotated\n\ndef handler(user_id: Annotated[int, "path"], verbose: Annotated[bool, "query"] = False) -> dict:\n    ...',
    },
    {
      name: 'A decorator that applies it (instead of no_type_check_decorator)',
      desc: 'Call no_type_check on the function inside your own decorator.',
      code: 'from typing import no_type_check\n\ndef route(func):\n    return no_type_check(func)',
    },
  ],

  examples: [
    { title: 'get_type_hints returns {}', code: "from typing import get_type_hints, no_type_check\n@no_type_check\ndef f(x: 'not a type!') -> 'whatever':\n    return x\n(get_type_hints(f), f.__no_type_check__)", returns: '({}, True)' },
    { title: 'The raw annotations are kept', code: "from typing import no_type_check\n@no_type_check\ndef f(x: 'not a type!'):\n    return x\nf.__annotations__", returns: "{'x': 'not a type!'}" },
    { title: 'Without it, get_type_hints fails', code: "from typing import get_type_hints\ndef f(x: 'not a type!'):\n    return x\nget_type_hints(f)", returns: "SyntaxError: Forward reference must be an expression -- got 'not a type!'" },
    { title: 'On a class it covers the methods', code: "from typing import get_type_hints, no_type_check\n@no_type_check\nclass C:\n    x: 'nonsense'\n    def m(self, y: 'more nonsense'):\n        pass\n(get_type_hints(C), C.m.__no_type_check__)", returns: '({}, True)' },
    { title: 'The function itself is unchanged', code: "from typing import no_type_check\n@no_type_check\ndef add(a: 'left', b: 'right'):\n    return a + b\nadd(2, 3)", returns: '5' },
    { title: 'no_type_check_decorator warns (3.13)', code: "import warnings\nfrom typing import no_type_check_decorator\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    @no_type_check_decorator\n    def deco(func):\n        return func\nstr(caught[0].message)", returns: "\"'typing.no_type_check_decorator' is deprecated and slated for removal in Python 3.15\"" },
  ],

  pitfalls: [
    {
      name: 'Non-type annotations without @no_type_check',
      desc: 'Any tool that calls get_type_hints() on the function crashes on annotations that are not valid types.',
      wrong: { label: 'plain function', code: "from typing import get_type_hints\ndef handler(path: '/users', method: 'GET'):\n    pass\nget_type_hints(handler)", output: "SyntaxError: Forward reference must be an expression -- got '/users'" },
      fix:   { label: '@no_type_check', code: "from typing import get_type_hints, no_type_check\n@no_type_check\ndef handler(path: '/users', method: 'GET'):\n    pass\nget_type_hints(handler)", output: '{}' },
    },
    {
      name: 'Relying on no_type_check_decorator',
      desc: 'No type checker ever supported it; it is deprecated in 3.13 and removed in 3.15. Apply no_type_check inside your decorator instead.',
      wrong: { label: 'deprecated helper', code: "import warnings, typing\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    @typing.no_type_check_decorator\n    def route(func):\n        return func\nlen(caught)", output: '1' },
      fix:   { label: 'no_type_check inside', code: "import warnings\nfrom typing import get_type_hints, no_type_check\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    def route(func):\n        return no_type_check(func)\n    @route\n    def handler(path: '/users'):\n        pass\n(len(caught), get_type_hints(handler))", output: '(0, {})' },
    },
  ],

  when: {
    use: [
      'Legacy code that stores non-type objects in annotations',
      'Generated or dynamic code a type checker cannot follow',
    ],
    avoid: [
      'New code → Annotated[T, metadata] keeps the type checkable',
      'Silencing one false positive → # type: ignore on that line',
      'no_type_check_decorator → deprecated (3.13), removed in 3.15',
    ],
  },

  notes: {
    cpython:       'Lib/typing.py: no_type_check sets __no_type_check__ = True on the function (and, for a class, on the functions and nested classes defined in it); get_type_hints returns {} for such objects',
    'In place':    'The decorated object is mutated and returned — no wrapper is created',
    'Deprecation': 'no_type_check_decorator: deprecated in 3.13, to be removed in 3.15 (gh-106309)',
  },

  related: [
    { name: 'Annotated', slug: 'annotated', when: 'The modern way to attach metadata' },
    { name: 'get_type_hints', slug: 'get_type_hints', when: 'Returns {} for no_type_check objects' },
    { name: 'TYPE_CHECKING', slug: 'type_checking', when: 'Code only the checker sees' },
    { name: 'typing module', slug: 'typing', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'The decorator is applied to a function or class you write, and its effect is on type checkers and on get_type_hints() for that object. A demo box can only send text and numbers, not definitions, so the examples below define the decorated code and show the verified results.',
    },
    {
      q: 'How do I disable type checking for one function in Python?',
      a: 'Decorate it with @typing.no_type_check: type checkers then ignore its annotations, and get_type_hints() returns {} for it. For a single line, a # type: ignore comment is more targeted.',
    },
    {
      q: 'Is no_type_check_decorator deprecated?',
      a: 'Yes. No type checker ever implemented it, so it is deprecated since Python 3.13 (with a DeprecationWarning) and scheduled for removal in 3.15. Call no_type_check(func) inside your own decorator instead.',
    },
    {
      q: 'Does @no_type_check change how the function runs?',
      a: 'No. It sets __no_type_check__ = True on the function and returns the same object; calls behave exactly as before.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.no_type_check',
    meta:  'typing.no_type_check',
  },

};
