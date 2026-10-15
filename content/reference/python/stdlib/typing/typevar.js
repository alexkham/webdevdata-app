// content/reference/python/stdlib/typing/typevar.js — type parameters and generics

export const meta = {
  slug:        'typevar',
  name:        'typing.TypeVar / ParamSpec / TypeVarTuple / Generic',
  signature:   "TypeVar(name, *constraints, bound=None, covariant=False, contravariant=False, infer_variance=False, default=NoDefault) · ParamSpec(name, ...) · TypeVarTuple(name, *, default=NoDefault) · class C(Generic[T])",
  blurb:       'Type parameters for generic functions and classes: TypeVar stands for one type, ParamSpec for a parameter list, TypeVarTuple for any number of types. Since Python 3.12, def f[T](...) and class C[T] create them for you.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5+ (ParamSpec 3.10, TypeVarTuple 3.11, [T] syntax 3.12, defaults 3.13)',
  searchTerms: 'typing.TypeVar TypeVar ParamSpec ParamSpecArgs ParamSpecKwargs TypeVarTuple Unpack Generic AnyStr NoDefault generic function generic class type parameter bound constraints covariant contravariant variance P.args P.kwargs variadic generics def f[T] class C[T] pep 695 pep 612 pep 646 type parameter defaults pep 696',
};

export const method = {
  slug:      'typevar',
  name:      'typing.TypeVar / ParamSpec / TypeVarTuple / Generic',
  signature: "TypeVar(name, *constraints, bound=None, covariant=False, contravariant=False, infer_variance=False, default=NoDefault) · ParamSpec(name, ...) · TypeVarTuple(name, *, default=NoDefault) · class C(Generic[T])",
  returns:   { type: 'TypeVar | ParamSpec | TypeVarTuple', desc: 'A type-variable object; its repr is ~T (invariant), +T (covariant), -T (contravariant) or T (inferred variance, or a TypeVarTuple).' },

  category:    'typing generics',
  version:     'Python 3.5+ (ParamSpec 3.10, TypeVarTuple 3.11, [T] syntax 3.12, defaults 3.13)',
  hasLiveDemo: true,

  subtitle: 'A type variable links types together: def first[T](items: list[T]) -> T says the result has the item type, whatever it is. At runtime a TypeVar is just a named object — substituting list[T][int] works, isinstance(x, T) does not. Prefer the 3.12 syntax; the classes remain for older versions and for introspection.',

  covers: ['TypeVar', 'ParamSpec', 'ParamSpecArgs', 'ParamSpecKwargs', 'TypeVarTuple', 'Unpack', 'Generic', 'AnyStr', 'NoDefault'],

  cheat: {
    commonCall: 'def first[T](items: list[T]) -> T: ...  ·  T = TypeVar("T")',
    returns:    "TypeVar('T') → ~T; list[T][int] → list[int]",
    replaces:   'Any in "returns the same type it got" functions',
    watchOut:   'TypeVar("T", int) — one constraint is an error; you meant bound=int',
  },

  parameters: [
    { name: 'name',        type: 'str',  required: true,  default: null,        desc: 'Must match the variable it is assigned to: T = TypeVar("T").' },
    { name: 'constraints', type: 'type', required: false, default: null,        desc: 'Two or more allowed types: TypeVar("A", str, bytes) is exactly str or exactly bytes.' },
    { name: 'bound',       type: 'type', required: false, default: 'None',      desc: 'Upper bound: any subtype of it. Cannot be combined with constraints.' },
    { name: 'covariant',   type: 'bool', required: false, default: 'False',     desc: 'Mark the variable covariant (repr +T). For read-only containers.' },
    { name: 'contravariant', type: 'bool', required: false, default: 'False',   desc: 'Mark it contravariant (repr -T). For consumers such as callbacks.' },
    { name: 'infer_variance', type: 'bool', required: false, default: 'False',  desc: 'Let the type checker infer variance (3.12+); what the [T] syntax does.' },
    { name: 'default',     type: 'type', required: false, default: 'NoDefault', desc: 'Default type when the parameter is omitted (3.13+). typing.NoDefault means "no default".' },
  ],

  modes: [
    {
      id: 'substitute',
      label: 'substitute T',
      blurb: 'T = TypeVar("T") is defined. A hint containing T is generic; subscripting it replaces T. Type a hint with T in it.',
      params: [{ name: 'hint', type: 'str', hint: 'a hint using T', input: 'text' }],
      template: "from typing import *\nT = TypeVar('T')\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'generic', label: 'list[T]',               values: { hint: 'list[T]' } },
        { id: 'dict',    label: 'dict[str, T][int]',     values: { hint: 'dict[str, T][int]' } },
        { id: 'opt',     label: 'Optional[T][bytes]',    values: { hint: 'Optional[T][bytes]' } },
        { id: 'call',    label: 'Callable[[T], T][int]', values: { hint: 'Callable[[T], T][int]' } },
        { id: 'many',    label: 'too many',              values: { hint: 'List[T][int, str]' } },
        { id: 'generic2', label: 'Generic[T]',           values: { hint: 'Generic[T]' } },
      ],
    },
  ],
  demoExplainer: 'list[T] stays generic and prints ~T (the ~ marks an invariant TypeVar). Subscripting replaces every T at once, so Callable[[T], T][int] becomes typing.Callable[[int], int]; giving more types than there are variables raises "Too many arguments". Generic[T] is valid only as a base class, which is why it is rejected as a parameter hint with "typing.Generic[~T] is not valid as type argument".',

  patterns: [
    {
      name: 'Generic function (3.12+)',
      desc: 'Brackets after the name declare the type parameters.',
      code: 'def first[T](items: list[T]) -> T:\n    return items[0]\n\ndef longest[S: str](a: S, b: S) -> S:\n    return a if len(a) >= len(b) else b',
    },
    {
      name: 'Generic class (3.12+ and before)',
      desc: 'The same class in both syntaxes.',
      code: 'from typing import Generic, TypeVar\n\nclass Stack[T]:\n    def __init__(self) -> None:\n        self.items: list[T] = []\n\nT = TypeVar("T")\nclass OldStack(Generic[T]):\n    def __init__(self) -> None:\n        self.items: list[T] = []',
    },
    {
      name: 'Decorator that keeps the signature',
      desc: 'ParamSpec P + P.args / P.kwargs.',
      code: 'from collections.abc import Callable\n\ndef timed[**P, R](fn: Callable[P, R]) -> Callable[P, R]:\n    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:\n        return fn(*args, **kwargs)\n    return wrapper',
    },
    {
      name: 'Variadic generics',
      desc: 'TypeVarTuple: any number of types, always unpacked with *.',
      code: 'def swap_ends[T, *Ts](tup: tuple[T, *Ts]) -> tuple[*Ts, T]:\n    return (*tup[1:], tup[0])',
    },
    {
      name: 'Type parameter defaults (3.13+)',
      desc: 'Omitted arguments fall back to the default.',
      code: 'class Response[T = bytes]:\n    body: T',
    },
  ],

  examples: [
    { title: 'Bound and constraints', code: "from typing import AnyStr, TypeVar\nS = TypeVar('S', bound=str)\n(S, S.__bound__, AnyStr.__constraints__)", returns: "(~S, <class 'str'>, (<class 'bytes'>, <class 'str'>))" },
    { title: 'A Generic subclass is subscriptable', code: "from typing import Generic, TypeVar\nT = TypeVar('T')\nclass Box(Generic[T]):\n    def __init__(self, item: T):\n        self.item = item\n(Box.__parameters__, Box[int](5).item)", returns: '((~T,), 5)' },
    { title: 'The 3.12 syntax creates the TypeVar', code: 'class Box[T]:\n    pass\n(Box.__type_params__, Box.__mro__)', returns: "((T,), (<class '__main__.Box'>, <class 'typing.Generic'>, <class 'object'>))" },
    { title: 'Substitution', code: "from typing import TypeVar\nT = TypeVar('T')\ndict[str, T][int]", returns: 'dict[str, int]' },
    { title: 'Generic[...] wants type variables', code: 'from typing import Generic\nGeneric[int]', returns: 'TypeError: Parameters to Generic[...] must all be type variables or parameter specification variables.' },
    { title: 'P.args and P.kwargs', code: "from typing import ParamSpec, get_origin\nP = ParamSpec('P')\n(P.args, type(P.args).__name__, get_origin(P.kwargs) is P)", returns: "(P.args, 'ParamSpecArgs', True)" },
    { title: '*Ts is Unpack[Ts]', code: "from typing import TypeVarTuple\nTs = TypeVarTuple('Ts')\ntuple[*Ts]", returns: 'tuple[typing.Unpack[Ts]]' },
    { title: 'Defaults and NoDefault (3.13)', code: "from typing import TypeVar\nT = TypeVar('T')\nD = TypeVar('D', default=int)\n(T.__default__, D.__default__, T.has_default())", returns: "(typing.NoDefault, <class 'int'>, False)" },
  ],

  pitfalls: [
    {
      name: 'One constraint instead of a bound',
      desc: 'Positional arguments after the name are constraints, and there must be at least two. "Any subclass of int" is a bound.',
      wrong: { label: "TypeVar('N', int)", code: "from typing import TypeVar\nN = TypeVar('N', int)", output: 'TypeError: A single constraint is not allowed' },
      fix:   { label: 'bound=int', code: "from typing import TypeVar\nN = TypeVar('N', bound=int)\nN.__bound__", output: "<class 'int'>" },
    },
    {
      name: 'Mixing the [T] syntax with Generic',
      desc: 'class C[T] already makes C a Generic subclass. Inheriting Generic[...] again is an error.',
      wrong: { label: 'class Box[T](Generic[T])', code: 'from typing import Generic\nclass Box[T](Generic[T]):\n    pass', output: 'TypeError: Cannot inherit from Generic[...] multiple times.' },
      fix:   { label: 'class Box[T]', code: 'class Box[T]:\n    pass\nBox[int]', output: '__main__.Box[int]' },
    },
    {
      name: 'isinstance against a type variable',
      desc: 'A TypeVar is not a class. Check the bound or the concrete types instead.',
      wrong: { label: 'isinstance(x, T)', code: "from typing import TypeVar\nT = TypeVar('T', bound=str)\nisinstance('a', T)", output: 'TypeError: isinstance() arg 2 must be a type, a tuple of types, or a union' },
      fix:   { label: 'isinstance(x, T.__bound__)', code: "from typing import TypeVar\nT = TypeVar('T', bound=str)\nisinstance('a', T.__bound__)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Functions whose result type follows an argument type (first, max_by, identity, copy)',
      'Containers and wrappers parameterised by an item type',
      'Decorators that must keep the decorated signature (ParamSpec)',
      'Shapes with a variable number of types, e.g. array dimensions (TypeVarTuple)',
    ],
    avoid: [
      'A TypeVar used only once in a signature → it links nothing; use the plain type or object',
      'Module-level T = TypeVar("T") in 3.12+ code → def f[T] / class C[T]',
      'AnyStr in new code → deprecated since 3.13; write def f[S: (str, bytes)]',
    ],
  },

  notes: {
    cpython:        'TypeVar, ParamSpec, ParamSpecArgs, ParamSpecKwargs, TypeVarTuple, Generic and NoDefault are implemented in C (Objects/typevarobject.c, exposed via _typing); Unpack is a special form in Lib/typing.py',
    'Repr':         '~T invariant, +T covariant, -T contravariant, T for inferred variance (the [T] syntax) and for TypeVarTuple',
    'Lazy (3.12+)': 'Bounds, constraints and defaults written with the [T] syntax are evaluated only when the attribute is accessed',
    'Deprecation':  'AnyStr is deprecated since 3.13; the docs plan to drop it from __all__ in 3.16 and remove it in 3.18',
  },

  related: [
    { name: 'type statement', slug: 'type', when: 'Generic type aliases: type Pair[T] = tuple[T, T]', category: 'keywords' },
    { name: 'class', slug: 'class', when: 'class C[T] syntax', category: 'keywords' },
    { name: 'Callable / Concatenate', slug: 'callable', when: 'Where ParamSpec is used' },
    { name: 'Protocol', slug: 'protocol', when: 'Generic interfaces' },
    { name: 'TypeAlias / TypeAliasType', slug: 'typealias', when: 'Aliases with type parameters' },
    { name: 'Any / Never / Self …', slug: 'any', when: 'Self replaces the bound-TypeVar idiom for methods' },
  ],

  faq: [
    {
      q: 'What is a TypeVar in Python?',
      a: 'A placeholder type used in a signature to connect types: in def first(items: list[T]) -> T the result type is whatever the item type is. The type checker solves T per call; at runtime T is just a named object.',
    },
    {
      q: 'What is the difference between bound and constraints?',
      a: 'TypeVar("S", bound=str) accepts str and any subclass and keeps the precise type. TypeVar("A", str, bytes) accepts exactly one of the listed types (a subclass is treated as its listed base). At least two constraints are required, and they cannot be combined with bound.',
    },
    {
      q: 'Do I still need TypeVar in Python 3.12?',
      a: 'Rarely. def f[T](...), class C[T] and type Alias[T] = ... create type parameters scoped to that definition. The explicit classes are needed for code that must run on 3.11 or older.',
    },
    {
      q: 'What are ParamSpec and P.args for?',
      a: 'Decorators: Callable[P, R] captures the whole parameter list of the wrapped function, and annotating the wrapper as (*args: P.args, **kwargs: P.kwargs) tells the checker the wrapper accepts exactly the same arguments.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.TypeVar',
    meta:  'typing.TypeVar',
  },

};
