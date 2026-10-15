// content/reference/python/stdlib/typing/index.js — the typing module hub

export const meta = {
  slug:        'index',
  name:        'typing',
  signature:   'import typing',
  blurb:       'The vocabulary of Python type hints — Optional, Union, Literal, TypeVar, Protocol, TypedDict and more. Python stores hints but never checks them; type checkers such as mypy and pyright do.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'typing module python type hints type annotations static typing mypy pyright type checker optional union list dict generic typevar protocol typeddict get_type_hints annotations not enforced at runtime',
};

export const method = {
  slug: 'index',
  name: 'typing',

  category:    'Data types',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'Type hints are not enforced at runtime. Python evaluates an annotation, stores it in __annotations__ and moves on — passing a str where the hint says int is not an error. The checking is done before the program runs, by a separate type checker that reads these hints.',

  imports: ['from typing import Optional, Literal, TypeVar', 'import typing'],
  facts: [
    { label: 'Public API',  value: '104 names in typing.__all__ (CPython 3.13) — special forms, generic aliases, protocols, helper functions and decorators' },
    { label: 'At runtime',  value: 'Hints are stored, never checked. get_type_hints() reads them; isinstance() raises TypeError for parameterized hints such as list[int] or Literal[1]' },
    { label: 'Modern spelling', value: 'list[int] instead of List[int] (3.9), X | None instead of Optional[X] (3.10), type statement and def f[T] (3.12)' },
    { label: 'Checkers',    value: 'mypy, pyright, pyre and IDEs read the hints; the interpreter does not' },
  ],

  modes: [
    {
      id: 'ignored',
      label: 'not enforced',
      blurb: 'The hint says int. Pass anything — Python runs the function anyway, because annotations are never checked when a function is called.',
      params: [{ name: 'x', type: 'any', hint: 'a number or text', input: 'auto' }],
      template: 'def double(x: int) -> int:\n    return x * 2\ndouble({$x})',
      cases: [
        { id: 'int',   label: 'an int',  values: { x: '21' } },
        { id: 'text',  label: 'a str',   values: { x: 'ab' } },
        { id: 'float', label: 'a float', values: { x: '1.25' } },
      ],
    },
    {
      id: 'evaluate',
      label: 'what a hint is',
      blurb: 'Type any hint. It is passed as a string (a forward reference), and get_type_hints() evaluates it the way documentation tools and runtime libraries see it.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'optional', label: 'Optional[int]',  values: { hint: 'Optional[int]' } },
        { id: 'pipe',     label: 'int | None',     values: { hint: 'int | None' } },
        { id: 'oldlist',  label: 'List[int]',      values: { hint: 'List[int]' } },
        { id: 'newlist',  label: 'list[int]',      values: { hint: 'list[int]' } },
        { id: 'few',      label: 'Dict[str]',      values: { hint: 'Dict[str]' } },
        { id: 'typo',     label: 'typo',           values: { hint: 'Lst[int]' } },
      ],
    },
  ],
  demoExplainer: 'The first tab is the lesson of the whole module: double("ab") returns "abab" although the hint says int, because nothing checks it. The second tab shows what a hint is at runtime: an ordinary object. Optional[int] and int | None are different objects with different reprs, List[int] prints as typing.List[int] while list[int] is a types.GenericAlias, and mistakes such as a missing type argument or a misspelled name are only caught when someone evaluates the hint — as get_type_hints() does here.',

  patterns: [
    {
      name: 'Annotate a function',
      desc: 'Parameters, defaults and the return type. Use the builtin types directly.',
      code: 'def greet(name: str, times: int = 1) -> str:\n    return ", ".join([f"Hello {name}"] * times)',
    },
    {
      name: 'A value that may be missing',
      desc: 'Write X | None (3.10+). Optional[X] means the same thing.',
      code: 'def find_user(user_id: int) -> dict[str, str] | None:\n    ...',
    },
    {
      name: 'Generic function (3.12+ syntax)',
      desc: 'Type parameters in brackets — no TypeVar boilerplate.',
      code: 'def first[T](items: list[T]) -> T:\n    return items[0]',
    },
    {
      name: 'Imports needed only by the type checker',
      desc: 'TYPE_CHECKING is False at runtime, so the import never runs — no circular import, no import cost.',
      code: 'from typing import TYPE_CHECKING\nif TYPE_CHECKING:\n    from .models import User\n\ndef save(user: "User") -> None:\n    ...',
    },
    {
      name: 'Check the hints',
      desc: 'Python itself never does; run a type checker.',
      code: '# shell:\n# pip install mypy\n# mypy app.py',
    },
  ],

  examples: [
    { title: 'Hints are not checked',          code: 'def double(x: int) -> int:\n    return x * 2\ndouble("ab")', returns: "'abab'" },
    { title: 'They are stored in __annotations__', code: 'def double(x: int) -> int:\n    return x * 2\ndouble.__annotations__', returns: "{'x': <class 'int'>, 'return': <class 'int'>}" },
    { title: 'get_type_hints evaluates string hints', code: "from typing import get_type_hints\ndef f(x: 'list[int]'): pass\n(f.__annotations__, get_type_hints(f))", returns: "({'x': 'list[int]'}, {'x': list[int]})" },
    { title: 'X | None equals Optional[X]',    code: 'from typing import Optional\n(int | None) == Optional[int]', returns: 'True' },
    { title: 'typing.List[int] is not list[int]', code: 'from typing import List\nList[int] == list[int]', returns: 'False' },
    { title: 'isinstance refuses parameterized generics', code: 'isinstance([1, 2], list[int])', returns: 'TypeError: isinstance() argument 2 cannot be a parameterized generic' },
    { title: 'TYPE_CHECKING is False when the program runs', code: 'import typing\ntyping.TYPE_CHECKING', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Expecting a hint to validate input',
      desc: 'An annotation documents intent; it does not convert or reject anything. Validate at the boundary yourself (or with a validation library).',
      wrong: { label: 'trust the hint', code: 'def set_age(age: int) -> int:\n    return age\nset_age("42")', output: "'42'" },
      fix:   { label: 'check explicitly', code: 'def set_age(age: int) -> int:\n    if not isinstance(age, int):\n        raise TypeError(f"age must be int, not {type(age).__name__}")\n    return age\nset_age("42")', output: 'TypeError: age must be int, not str' },
    },
    {
      name: 'A None default does not make the hint Optional',
      desc: 'Since Python 3.11, get_type_hints() no longer turns x: int = None into Optional[int]. Write int | None so the hint says what the function accepts.',
      wrong: { label: 'x: int = None', code: 'from typing import get_type_hints\ndef f(x: int = None): pass\nget_type_hints(f)', output: "{'x': <class 'int'>}" },
      fix:   { label: 'x: int | None = None', code: 'from typing import get_type_hints\ndef f(x: int | None = None): pass\nget_type_hints(f)', output: "{'x': int | None}" },
    },
    {
      name: 'Checking a container type with isinstance',
      desc: 'isinstance() checks the class only. Check the items yourself.',
      wrong: { label: 'list[int]', code: 'data = [1, 2, "3"]\nisinstance(data, list[int])', output: 'TypeError: isinstance() argument 2 cannot be a parameterized generic' },
      fix:   { label: 'class + items', code: 'data = [1, 2, "3"]\nisinstance(data, list) and all(isinstance(x, int) for x in data)', output: 'False' },
    },
  ],

  when: {
    use: [
      'Documenting what a function accepts and returns, checked by mypy or pyright',
      'Better editor completion and refactoring in larger code bases',
      'Describing data shapes: TypedDict for JSON-like dicts, Protocol for duck typing',
    ],
    avoid: [
      'Runtime validation of untrusted input → explicit checks, or a validation library',
      'typing.List, typing.Dict … in new code → list[...], dict[...] (3.9+)',
      'Optional[X] / Union[X, Y] in 3.10+ code → X | None, X | Y',
    ],
  },

  notes: {
    cpython:          'Lib/typing.py, with TypeVar, ParamSpec, TypeVarTuple, Generic, TypeAliasType and NoDefault implemented in C (the _typing module, Objects/typevarobject.c); list[int] is types.GenericAlias and int | str is types.UnionType',
    'Not enforced':   'The interpreter evaluates annotations and stores them in __annotations__; it never compares them with the values passed',
    'Evaluation':     'A string annotation (or every annotation under from __future__ import annotations) stays a string until get_type_hints() evaluates it',
  },

  related: [
    { name: 'type statement', slug: 'type', when: 'Type aliases and generics, 3.12+ syntax', category: 'keywords' },
    { name: 'def',            slug: 'def',  when: 'Where parameter and return annotations go', category: 'keywords' },
    { name: 'isinstance()',   slug: 'isinstance', when: 'The runtime check hints do not do', category: 'functions' },
    { name: 'dataclasses module', slug: 'dataclasses', when: 'Classes built from annotations', category: 'stdlib' },
    { name: 'collections module', slug: 'collections', when: 'deque, Counter … — subscript them directly', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does Python enforce type hints at runtime?',
      a: 'No. The interpreter evaluates an annotation and stores it (function.__annotations__), but never checks values against it — def f(x: int) happily accepts a str. Checking happens before the program runs, in a type checker such as mypy or pyright, or at runtime only if your own code or a library does it.',
    },
    {
      q: 'Should I use typing.List or list?',
      a: 'list. Since Python 3.9 the builtin collections accept subscripts (list[int], dict[str, int]), and typing.List, typing.Dict and friends are deprecated aliases kept for old code.',
    },
    {
      q: 'What is the difference between Optional[int] and int | None?',
      a: 'Only the spelling. int | None (Python 3.10+) and Optional[int] compare equal and mean "int or None". Optional does not mean "optional argument" — a parameter is optional because it has a default, not because of its hint.',
    },
    {
      q: 'Why do I get NameError from get_type_hints?',
      a: 'String annotations (and all annotations under from __future__ import annotations) are only evaluated when get_type_hints() is called, in the module globals. A name imported only under if TYPE_CHECKING: does not exist at that point.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html',
    meta:  'typing — Support for type hints',
  },

};
