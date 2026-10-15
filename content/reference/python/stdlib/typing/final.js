// content/reference/python/stdlib/typing/final.js — Final and @final

export const meta = {
  slug:        'final',
  name:        'typing.Final / @final',
  signature:   'NAME: Final[T] = value · @final',
  blurb:       'Final marks a name that must not be reassigned (a constant); the @final decorator marks a method that must not be overridden or a class that must not be subclassed. Type checkers enforce both — Python does not.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'typing.Final Final final typing.final decorator constant cannot reassign cannot override method cannot subclass sealed class __final__ pep 591 const python constants type hint',
};

export const method = {
  slug:      'final',
  name:      'typing.Final / @final',
  signature: 'NAME: Final[T] = value · @final',
  returns:   { type: 'typing._GenericAlias | the decorated object', desc: 'Final[T] is an alias object; @final returns the class or function unchanged, with __final__ = True set on it (3.11+).' },

  category:    'typing special form',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'MAX_SIZE: Final = 9000 followed by MAX_SIZE = 1 runs without complaint — "final" exists only for the type checker. At runtime @final merely sets __final__ = True on the decorated class or function, so tools can detect it.',

  covers: ['Final', 'final'],

  cheat: {
    commonCall: 'TIMEOUT: Final = 10 · @final class Leaf: ...',
    returns:    'Final[int] → typing.Final[int]; @final → the same object, __final__ set',
    replaces:   'ALL_CAPS naming as the only signal that something is constant',
    watchOut:   '__final__ is inherited: a subclass of a @final class reports True too',
  },

  parameters: [
    { name: 'T', type: 'type', required: false, default: null, desc: 'Final[T]: the type of the constant. Bare Final lets the checker infer the type from the assigned value.' },
  ],

  modes: [
    {
      id: 'inClass',
      label: 'in a class',
      blurb: 'The hint annotates x in a class body, where Final is allowed — bare, with one type, or (3.13+) nested with ClassVar.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\nclass Config:\n    x: {$hint}\nget_type_hints(Config, globals())['x']",
      cases: [
        { id: 'typed', label: 'Final[int]',            values: { hint: 'Final[int]' } },
        { id: 'bare',  label: 'Final',                 values: { hint: 'Final' } },
        { id: 'cv',    label: 'Final[ClassVar[str]]',  values: { hint: 'Final[ClassVar[str]]' } },
        { id: 'two',   label: 'Final[int, str]',       values: { hint: 'Final[int, str]' } },
        { id: 'inner', label: 'list[Final[int]]',      values: { hint: 'list[Final[int]]' } },
      ],
    },
    {
      id: 'parameter',
      label: 'as a parameter',
      blurb: 'Final on a function parameter is invalid; as a string annotation it is rejected when evaluated.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'final', label: 'Final[int]', values: { hint: 'Final[int]' } },
        { id: 'bare',  label: 'Final',      values: { hint: 'Final' } },
      ],
    },
  ],
  demoExplainer: 'In a class body Final, Final[int] and Final[ClassVar[str]] all evaluate; Final[int, str] fails with "typing.Final accepts only single type." On a parameter both forms fail: bare Final with "Plain typing.Final is not valid as type argument", Final[int] with "typing.Final[int] is not valid as type argument". list[Final[int]] slips through because builtin generics do not validate their arguments, although Final is only meaningful as the outermost form of an annotation.',

  patterns: [
    {
      name: 'Module constants',
      desc: 'The checker infers the type from the value and reports any reassignment.',
      code: 'from typing import Final\n\nMAX_RETRIES: Final = 3\nAPI_URL: Final[str] = "https://api.example.com"',
    },
    {
      name: 'A method subclasses must not override',
      desc: 'Template-method style: the algorithm is fixed, the steps are not.',
      code: 'from typing import final\n\nclass Exporter:\n    @final\n    def export(self) -> bytes:\n        return self.header() + self.body()\n\n    def header(self) -> bytes:\n        return b""\n\n    def body(self) -> bytes:\n        raise NotImplementedError',
    },
    {
      name: 'A class that must not be subclassed',
      desc: 'Lets the checker assume no subclass changes behaviour.',
      code: 'from typing import final\n\n@final\nclass UserId:\n    def __init__(self, value: int) -> None:\n        self.value = value',
    },
    {
      name: 'Detect @final at runtime (3.11+)',
      desc: 'Look in the object\'s own __dict__ so inheritance does not mislead you.',
      code: 'def is_marked_final(obj) -> bool:\n    return vars(obj).get("__final__", False) if hasattr(obj, "__dict__") else False',
    },
  ],

  examples: [
    { title: 'Reassigning a Final name works at runtime', code: 'from typing import Final\nMAX_SIZE: Final = 9000\nMAX_SIZE = 1\nMAX_SIZE', returns: '1' },
    { title: '@final sets __final__ (3.11+)', code: 'from typing import final\n@final\nclass Leaf:\n    pass\nLeaf.__final__', returns: 'True' },
    { title: 'On a method too', code: 'from typing import final\nclass Base:\n    @final\n    def done(self):\n        return 1\nBase.done.__final__', returns: 'True' },
    { title: 'Subclassing a @final class is not prevented', code: 'from typing import final\n@final\nclass Leaf:\n    pass\nclass Other(Leaf):\n    pass\nissubclass(Other, Leaf)', returns: 'True' },
    { title: 'Final in class annotations', code: 'from typing import Final, get_type_hints\nclass Connection:\n    TIMEOUT: Final[int] = 10\nget_type_hints(Connection)', returns: "{'TIMEOUT': typing.Final[int]}" },
    { title: 'Exactly one type', code: 'from typing import Final\nFinal[int, str]', returns: "TypeError: typing.Final accepts only single type. Got (<class 'int'>, <class 'str'>)." },
    { title: 'A Final dataclass field is still a field', code: 'from dataclasses import dataclass\nfrom typing import Final\n@dataclass\nclass C:\n    x: Final[int] = 3\n(C(), C(5))', returns: '(C(x=3), C(x=5))' },
  ],

  pitfalls: [
    {
      name: 'Testing __final__ with getattr on a subclass',
      desc: 'getattr() finds the attribute through inheritance, so every subclass of a @final class looks final too. Check the object\'s own namespace.',
      wrong: { label: 'getattr', code: "from typing import final\n@final\nclass Leaf:\n    pass\nclass Other(Leaf):\n    pass\ngetattr(Other, '__final__', False)", output: 'True' },
      fix:   { label: 'vars()', code: "from typing import final\n@final\nclass Leaf:\n    pass\nclass Other(Leaf):\n    pass\nvars(Other).get('__final__', False)", output: 'False' },
    },
    {
      name: 'Final on a function parameter',
      desc: 'Final is for variables and attributes. On a parameter it is invalid — and a string annotation fails as soon as get_type_hints() evaluates it.',
      wrong: { label: "x: 'Final[int]'", code: "from typing import Final, get_type_hints\ndef f(x: 'Final[int]'): pass\nget_type_hints(f)", output: 'TypeError: typing.Final[int] is not valid as type argument' },
      fix:   { label: 'x: int', code: 'from typing import get_type_hints\ndef f(x: int): pass\nget_type_hints(f)', output: "{'x': <class 'int'>}" },
    },
  ],

  when: {
    use: [
      'Module and class constants that must never be rebound',
      'Methods whose behaviour subclasses must not change, classes not designed for inheritance',
    ],
    avoid: [
      'Real runtime immutability → a frozen dataclass, a tuple, an Enum or a read-only property',
      'Function parameters and return types → Final is invalid there',
      'Expecting a mutable value to be frozen → Final stops rebinding the name, not list.append',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: Final is a special form; final() sets obj.__final__ = True (3.11+) and returns obj unchanged, silently skipping objects that refuse new attributes',
    'Runtime':    'Neither reassignment, overriding nor subclassing is prevented',
    '3.13':       'Final and ClassVar can be nested in each other (Final[ClassVar[int]], ClassVar[Final[int]])',
  },

  related: [
    { name: 'ClassVar', slug: 'classvar', when: 'Class attributes shared by instances' },
    { name: 'override', slug: 'override', when: 'The opposite marker: this method overrides' },
    { name: 'Literal', slug: 'literal', when: 'A fixed set of allowed values' },
    { name: 'enum module', slug: 'enum', when: 'Named constants that cannot be rebound', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I declare a constant in Python?',
      a: 'By convention with an ALL_CAPS name, and for type checkers with Final: MAX_SIZE: Final = 9000. Reassigning it is then reported by mypy or pyright — the interpreter itself still allows it.',
    },
    {
      q: 'Does @final prevent subclassing at runtime?',
      a: 'No. class Other(Leaf) works even when Leaf is decorated with @final. Since Python 3.11 the decorator sets Leaf.__final__ = True so tools can detect it; enforcing it is the type checker\'s job.',
    },
    {
      q: 'What is the difference between Final and @final?',
      a: 'Final (an annotation) is for names: variables and attributes that must not be reassigned. @final (a decorator) is for methods that must not be overridden and classes that must not be subclassed.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.Final',
    meta:  'typing.Final',
  },

};
