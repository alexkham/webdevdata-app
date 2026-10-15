// content/reference/python/stdlib/typing/overload.js — overload, get_overloads, clear_overloads

export const meta = {
  slug:        'overload',
  name:        'typing.overload / get_overloads / clear_overloads',
  signature:   '@overload · get_overloads(func) · clear_overloads()',
  blurb:       'Describe a function with several signatures — int in, int out; str in, str out — for the type checker. The @overload stubs are never called; one undecorated implementation does the work. get_overloads() (3.11+) lists the stubs at runtime.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.5+ (get_overloads, clear_overloads 3.11+)',
  searchTerms: 'typing.overload overload get_overloads clear_overloads function overloading multiple signatures return type depends on argument type You should not call an overloaded function NotImplementedError singledispatch',
};

export const method = {
  slug:      'overload',
  name:      'typing.overload / get_overloads / clear_overloads',
  signature: '@overload · get_overloads(func) · clear_overloads()',
  returns:   { type: 'function | list[function] | None', desc: '@overload returns a stub that raises NotImplementedError when called; get_overloads returns the registered stubs (possibly []); clear_overloads returns None.' },

  category:    'typing functions',
  version:     'Python 3.5+ (get_overloads, clear_overloads 3.11+)',
  hasLiveDemo: false,

  subtitle: 'Python has no overloading at runtime: each def replaces the previous one, so only the final, undecorated implementation exists under the name. The @overload signatures are for the type checker, which uses them to pick a precise return type for each call. Real runtime dispatch on type is functools.singledispatch.',

  covers: ['overload', 'get_overloads', 'clear_overloads'],

  cheat: {
    commonCall: '@overload\ndef parse(x: str) -> int: ...\n@overload\ndef parse(x: bytes) -> int: ...\ndef parse(x): ...',
    returns:    'the implementation runs; the stubs only inform the checker',
    replaces:   'A single signature with a union return type that callers must narrow',
    watchOut:   'Without a final undecorated implementation, every call raises NotImplementedError',
  },

  parameters: [
    { name: 'func', type: 'function', required: true, default: null, desc: 'get_overloads: the implementation function; returns its @overload stubs (looked up by module and qualified name).' },
  ],

  patterns: [
    {
      name: 'Return type follows the argument type',
      desc: 'Callers get int for int and str for str — not int | str.',
      code: 'from typing import overload\n\n@overload\ndef double(x: int) -> int: ...\n@overload\ndef double(x: str) -> str: ...\ndef double(x: int | str) -> int | str:\n    return x * 2',
    },
    {
      name: 'Return type follows a flag',
      desc: 'Literal[True] / Literal[False] select the overload.',
      code: 'from typing import Literal, overload\n\n@overload\ndef read(path: str, binary: Literal[True]) -> bytes: ...\n@overload\ndef read(path: str, binary: Literal[False] = ...) -> str: ...\ndef read(path: str, binary: bool = False) -> str | bytes:\n    mode = "rb" if binary else "r"\n    with open(path, mode) as f:\n        return f.read()',
    },
    {
      name: 'Overloaded method',
      desc: 'Works the same inside a class.',
      code: 'from typing import overload\n\nclass Grid:\n    @overload\n    def __getitem__(self, key: int) -> list[int]: ...\n    @overload\n    def __getitem__(self, key: tuple[int, int]) -> int: ...\n    def __getitem__(self, key):\n        ...',
    },
  ],

  examples: [
    { title: 'Only the implementation runs', code: "from typing import overload\n@overload\ndef double(x: int) -> int: ...\n@overload\ndef double(x: str) -> str: ...\ndef double(x):\n    return x * 2\n(double(2), double('ab'))", returns: "(4, 'abab')" },
    { title: 'get_overloads lists the stubs (3.11+)', code: 'from typing import get_overloads, get_type_hints, overload\n@overload\ndef parse_port(x: int) -> int: ...\n@overload\ndef parse_port(x: str) -> int: ...\ndef parse_port(x):\n    return int(x)\n[get_type_hints(f) for f in get_overloads(parse_port)]', returns: "[{'x': <class 'int'>, 'return': <class 'int'>}, {'x': <class 'str'>, 'return': <class 'int'>}]" },
    { title: 'A function without overloads', code: 'from typing import get_overloads\nget_overloads(len)', returns: '[]' },
    { title: 'Methods are registered too', code: 'from typing import get_overloads, overload\nclass Grid:\n    @overload\n    def cell(self, key: int) -> list[int]: ...\n    @overload\n    def cell(self, key: tuple[int, int]) -> int: ...\n    def cell(self, key):\n        return key\nlen(get_overloads(Grid.cell))', returns: '2' },
    { title: 'Calling a stub raises', code: 'from typing import overload\n@overload\ndef half(x: int) -> int: ...\nhalf(4)', returns: 'NotImplementedError: You should not call an overloaded function. A series of @overload-decorated functions outside a stub module should always be followed by an implementation that is not @overload-ed.' },
    { title: 'clear_overloads empties the registry', code: "import subprocess, sys\ncode = '''from typing import clear_overloads, get_overloads, overload\n@overload\ndef area(x: int) -> int: ...\n@overload\ndef area(x: float) -> float: ...\ndef area(x):\n    return x * x\nbefore = len(get_overloads(area))\nclear_overloads()\nprint(before, len(get_overloads(area)))\n'''\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout", returns: "'2 0\\n'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting the implementation',
      desc: 'Outside .pyi stub files, the series of @overload stubs must be followed by one undecorated definition. Otherwise the name is bound to the last stub.',
      wrong: { label: 'stubs only', code: 'from typing import overload\n@overload\ndef triple(x: int) -> int: ...\n@overload\ndef triple(x: str) -> str: ...\ntriple(2)', output: 'NotImplementedError: You should not call an overloaded function. A series of @overload-decorated functions outside a stub module should always be followed by an implementation that is not @overload-ed.' },
      fix:   { label: 'add the implementation', code: 'from typing import overload\n@overload\ndef triple(x: int) -> int: ...\n@overload\ndef triple(x: str) -> str: ...\ndef triple(x):\n    return x * 3\ntriple(2)', output: '6' },
    },
    {
      name: 'Expecting overloads to dispatch or validate',
      desc: 'The stubs are not consulted at runtime: arguments matching no overload still reach the implementation. For behaviour that depends on the argument type at runtime, use functools.singledispatch.',
      wrong: { label: '@overload', code: 'from typing import overload\n@overload\ndef double(x: int) -> int: ...\n@overload\ndef double(x: str) -> str: ...\ndef double(x):\n    return x * 2\ndouble([1])', output: '[1, 1]' },
      fix:   { label: 'singledispatch', code: "from functools import singledispatch\n@singledispatch\ndef double(x):\n    raise TypeError(f'unsupported type: {type(x).__name__}')\n@double.register\ndef _(x: int) -> int:\n    return x * 2\n@double.register\ndef _(x: str) -> str:\n    return x * 2\ndouble([1])", output: 'TypeError: unsupported type: list' },
    },
  ],

  when: {
    use: [
      'The return type depends on the argument types or on a literal flag',
      'Functions accepting several unrelated argument combinations',
      'Typing existing APIs (stub files) precisely',
    ],
    avoid: [
      'Runtime behaviour per type → functools.singledispatch / singledispatchmethod',
      'When a TypeVar expresses it: def first[T](xs: list[T]) -> T',
      'A plain union return when callers handle both anyway',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: overload() registers each stub in a module-level registry keyed by module, qualified name and first line number, and returns a stub that raises NotImplementedError',
    'Registry':   'get_overloads(func) returns every stub registered under func\'s module and qualified name; clear_overloads() empties the whole registry (to reclaim memory)',
    'Stub files': 'In .pyi files @overload definitions need no implementation',
  },

  related: [
    { name: 'Literal', slug: 'literal', when: 'Overloads keyed on flag values' },
    { name: 'TypeVar / Generic', slug: 'typevar', when: 'When one generic signature suffices' },
    { name: 'Callable / Concatenate', slug: 'callable', when: 'Overloaded callables need a Protocol' },
    { name: 'functools module', slug: 'functools', when: 'singledispatch: real runtime dispatch', category: 'stdlib' },
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'What a called stub raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'An overload is a series of def statements followed by an implementation, and what the stubs change is the return type a type checker infers. A demo box can only send text and numbers, not function definitions. The examples below show the runtime side — only the implementation runs, get_overloads() lists the stubs — with fixed, verified output.',
    },
    {
      q: 'Does Python support function overloading?',
      a: 'Not at runtime — a later def replaces the earlier one. typing.overload only describes several signatures for type checkers; one implementation handles all calls. functools.singledispatch provides runtime dispatch on the type of the first argument.',
    },
    {
      q: 'Why do I get "You should not call an overloaded function"?',
      a: 'The name is bound to an @overload stub because the undecorated implementation is missing (or comes before the stubs). Add a final definition without @overload.',
    },
    {
      q: 'How do I inspect the overloads of a function at runtime?',
      a: 'typing.get_overloads(func) (Python 3.11+) returns the @overload stubs for the implementation func; combine it with get_type_hints() or inspect.signature() on each stub.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.overload',
    meta:  'typing.overload',
  },

};
