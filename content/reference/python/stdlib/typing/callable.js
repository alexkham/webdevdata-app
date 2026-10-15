// content/reference/python/stdlib/typing/callable.js — Callable and Concatenate

export const meta = {
  slug:        'callable',
  name:        'typing.Callable / Concatenate',
  signature:   'Callable[[Arg1, Arg2], Ret] · Callable[..., Ret] · Callable[P, Ret] · Callable[Concatenate[Arg1, P], Ret]',
  blurb:       'Annotate functions and other callables: Callable[[int, str], bool] takes an int and a str and returns a bool. Concatenate (3.10+) describes decorators that add or remove leading parameters.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5+ (Concatenate 3.10+)',
  searchTerms: 'typing.Callable Callable Concatenate collections.abc.Callable type hint function parameter callback signature callable ellipsis any arguments paramspec decorator type hint higher order function pep 612',
};

export const method = {
  slug:      'callable',
  name:      'typing.Callable / Concatenate',
  signature: 'Callable[[Arg1, Arg2], Ret] · Callable[..., Ret] · Callable[P, Ret] · Callable[Concatenate[Arg1, P], Ret]',
  returns:   { type: 'typing._CallableGenericAlias', desc: 'An alias whose get_args() is ([Arg1, Arg2], Ret).' },

  category:    'typing callable types',
  version:     'Python 3.5+ (Concatenate 3.10+)',
  hasLiveDemo: true,

  subtitle: 'Exactly two things go in the brackets: the parameter list and the return type. The parameter list is a list of types, ... for "any arguments", a ParamSpec, or Concatenate[...]. typing.Callable is a deprecated alias — import Callable from collections.abc.',

  covers: ['Callable', 'Concatenate'],

  cheat: {
    commonCall: 'from collections.abc import Callable\non_done: Callable[[int], None]',
    returns:    'get_args(Callable[[int, str], bool]) → ([int, str], bool)',
    replaces:   'typing.Callable → collections.abc.Callable (3.9+)',
    watchOut:   'Keyword-only or *args signatures need a Protocol with __call__',
  },

  parameters: [
    { name: 'Arg1', type: 'type', required: false, default: null, desc: 'Positional parameter types, in a list: [int, str]. An empty list [] means no arguments.' },
    { name: 'Ret',  type: 'type', required: true,  default: null, desc: 'The return type. None for "returns nothing".' },
    { name: 'P',    type: 'ParamSpec', required: false, default: null, desc: 'Instead of the list: "the same parameters as some other callable" — used by decorators.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'evaluate',
      blurb: 'Type a Callable hint. Note which mistakes the runtime catches and which it lets through.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'basic',  label: 'Callable[[int], str]', values: { hint: 'Callable[[int], str]' } },
        { id: 'any',    label: 'Callable[..., str]',   values: { hint: 'Callable[..., str]' } },
        { id: 'noret',  label: 'no return type',       values: { hint: 'Callable[[int]]' } },
        { id: 'nolist', label: 'Callable[int, str]',   values: { hint: 'Callable[int, str]' } },
        { id: 'concat', label: 'Concatenate',          values: { hint: 'Callable[Concatenate[int, ...], str]' } },
        { id: 'badcat', label: 'bad Concatenate',      values: { hint: 'Callable[Concatenate[int, str], str]' } },
      ],
    },
    {
      id: 'originArgs',
      label: 'origin & args',
      blurb: 'get_args() gives the parameter list as a list, then the return type.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nhint = get_type_hints(f)['x']\n(get_origin(hint), get_args(hint))",
      cases: [
        { id: 'two',   label: 'two parameters', values: { hint: 'Callable[[int, str], bool]' } },
        { id: 'none',  label: 'no parameters',  values: { hint: 'Callable[[], None]' } },
        { id: 'dots',  label: '...',            values: { hint: 'Callable[..., None]' } },
      ],
    },
  ],
  demoExplainer: 'Callable[[int]] fails with "Callable must be used as Callable[[arg, ...], result]." — the return type is required. Callable[int, str], however, is quietly turned into Callable[[int], str] by typing.Callable at runtime, although type checkers reject it (collections.abc.Callable raises TypeError for it). Concatenate must end with a ParamSpec or ..., which is why Concatenate[int, str] raises. In get_args() the parameters come back as a list, the return type last; typing.Callable converts None to NoneType (collections.abc.Callable keeps None).',

  patterns: [
    {
      name: 'A callback parameter',
      desc: 'Callers can pass any function, lambda or object with a matching __call__.',
      code: 'from collections.abc import Callable\n\ndef retry(action: Callable[[], bool], times: int = 3) -> bool:\n    return any(action() for _ in range(times))',
    },
    {
      name: 'A decorator that keeps the signature (3.12 syntax)',
      desc: 'ParamSpec P carries the wrapped function\'s parameters to the wrapper.',
      code: 'from collections.abc import Callable\n\ndef logged[**P, R](fn: Callable[P, R]) -> Callable[P, R]:\n    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:\n        print("calling", fn.__name__)\n        return fn(*args, **kwargs)\n    return wrapper',
    },
    {
      name: 'A decorator that supplies the first argument',
      desc: 'Concatenate[Conn, P]: the wrapped function takes a Conn first; the result does not.',
      code: 'from collections.abc import Callable\nfrom typing import Concatenate\n\nclass Conn: ...\n\ndef with_conn[**P, R](fn: Callable[Concatenate[Conn, P], R]) -> Callable[P, R]:\n    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:\n        return fn(Conn(), *args, **kwargs)\n    return wrapper',
    },
    {
      name: 'Signatures Callable cannot express',
      desc: 'Keyword-only, optional or variadic parameters: a Protocol with __call__.',
      code: 'from typing import Protocol\n\nclass Formatter(Protocol):\n    def __call__(self, value: float, *, digits: int = 2) -> str: ...',
    },
  ],

  examples: [
    { title: 'Functions and classes are Callable', code: 'from collections.abc import Callable\n(isinstance(len, Callable), isinstance(str, Callable), isinstance(1, Callable))', returns: '(True, True, False)' },
    { title: 'get_args nests the parameter list', code: 'from collections.abc import Callable\nfrom typing import get_args\nget_args(Callable[[int, str], bool])', returns: "([<class 'int'>, <class 'str'>], <class 'bool'>)" },
    { title: 'Any arguments: ...', code: 'from collections.abc import Callable\nfrom typing import get_args\nget_args(Callable[..., str])', returns: "(Ellipsis, <class 'str'>)" },
    { title: 'The return type is required', code: 'from collections.abc import Callable\nCallable[[int]]', returns: 'TypeError: Callable must be used as Callable[[arg, ...], result].' },
    { title: 'Concatenate with a ParamSpec', code: "from collections.abc import Callable\nfrom typing import Concatenate, ParamSpec\nP = ParamSpec('P')\nCallable[Concatenate[int, P], int]", returns: 'collections.abc.Callable[typing.Concatenate[int, ~P], int]' },
    { title: 'Concatenate must end in a ParamSpec or ...', code: 'from typing import Concatenate\nConcatenate[int, str]', returns: 'TypeError: The last parameter to Concatenate should be a ParamSpec variable or ellipsis.' },
    { title: 'typing.Callable is not == the abc one', code: 'import collections.abc\nimport typing\ntyping.Callable[[int], str] == collections.abc.Callable[[int], str]', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Leaving out the brackets around the parameters',
      desc: 'Callable[int, str] is invalid for type checkers. typing.Callable silently rewrites it; collections.abc.Callable rejects it at once.',
      wrong: { label: 'Callable[int, str]', code: 'from collections.abc import Callable\nCallable[int, str]', output: "TypeError: Expected a list of types, an ellipsis, ParamSpec, or Concatenate. Got <class 'int'>" },
      fix:   { label: 'Callable[[int], str]', code: 'from collections.abc import Callable\nCallable[[int], str]', output: 'collections.abc.Callable[[int], str]' },
    },
    {
      name: 'Checking a signature with isinstance',
      desc: 'isinstance() can only ask "is it callable at all?" — the parameter and return types are not checkable at runtime.',
      wrong: { label: 'Callable[[int], int]', code: 'from collections.abc import Callable\nisinstance(abs, Callable[[int], int])', output: 'TypeError: isinstance() argument 2 cannot be a parameterized generic' },
      fix:   { label: 'callable()', code: 'callable(abs)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Callback, hook and strategy parameters',
      'Decorators — with ParamSpec (and Concatenate) so the wrapped signature survives',
      'Attributes holding functions: handler: Callable[[Request], Response]',
    ],
    avoid: [
      'typing.Callable in 3.9+ code → collections.abc.Callable',
      'Keyword arguments, defaults, *args → a Protocol with __call__',
      'Overloaded callables → a Protocol with @overload-ed __call__',
    ],
  },

  notes: {
    cpython:       'Lib/typing.py: typing.Callable is a _CallableType; subscripting gives a _CallableGenericAlias. collections.abc.Callable[...] is a _CallableGenericAlias from Lib/_collections_abc.py — stricter about the argument list',
    'Arguments':   'Internally the parameter list is flattened: __args__ of Callable[[int, str], bool] is (int, str, bool); get_args() restores the list',
    'Deprecation': 'typing.Callable is deprecated since 3.9 (PEP 585); Concatenate is not deprecated',
  },

  related: [
    { name: 'TypeVar / ParamSpec / Generic', slug: 'typevar', when: 'ParamSpec, P.args and P.kwargs' },
    { name: 'Protocol', slug: 'protocol', when: 'Callables with complex signatures' },
    { name: 'overload', slug: 'overload', when: 'Several signatures for one function' },
    { name: 'callable()', slug: 'callable', when: 'The runtime check', category: 'functions' },
    { name: 'functools module', slug: 'functools', when: 'wraps() for decorators', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I type hint a function parameter in Python?',
      a: 'With Callable from collections.abc: Callable[[int, str], bool] is a callable taking an int and a str and returning a bool. Callable[[], None] takes nothing, Callable[..., int] takes anything and returns an int.',
    },
    {
      q: 'Should I use typing.Callable or collections.abc.Callable?',
      a: 'collections.abc.Callable on Python 3.9+. typing.Callable is a deprecated alias that is also more lenient: it accepts Callable[int, str] at runtime, which is invalid.',
    },
    {
      q: 'What is Concatenate used for?',
      a: 'For decorators that add or remove leading parameters. Callable[Concatenate[Lock, P], R] is a callable taking a Lock followed by whatever parameters P stands for; the decorator can return Callable[P, R], with the Lock supplied by itself.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#annotating-callable-objects',
    meta:  'typing — Annotating callable objects',
  },

};
