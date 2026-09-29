// content/reference/python/keywords/type.js

export const meta = {
  slug:        'type',
  name:        'type',
  signature:   'type Name = expression',
  blurb:       'The 3.12 type statement: declare a type alias whose value is evaluated lazily, optionally generic with [T].',
  category:    'definitions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3.12+',
  searchTerms: 'type statement type alias soft keyword typealiastype generic alias type parameter __value__ lazy evaluation forward reference typealias pep 695 typing',
};

export const method = {
  slug:      'type',
  name:      'type',
  signature: 'type Name = expression',

  category:    'Definitions',
  version:     'Python 3.12+',
  hasLiveDemo: true,

  subtitle: 'type Name = value creates a TypeAliasType. The value is not evaluated until you ask for __value__, so an alias can refer to names defined later — even itself.',

  covers: ['type'],

  syntax: [
    { label: 'alias', code: 'type Vector = list[float]' },
    { label: 'generic alias', code: 'type Pair[T] = tuple[T, T]' },
    { label: 'bound / constraints', code: 'type Nums[T: (int, float)] = list[T]' },
    { label: 'recursive', code: 'type Tree = list[Tree | int]' },
  ],

  cheat: {
    useFor:    'naming a complex type hint: type JSON = dict[str, JSON] | list[JSON] | ...',
    result:    'binds Name to a typing.TypeAliasType object',
    pairsWith: 'type hints, typing, generics (class C[T], def f[T])',
    watchOut:  'an alias is not a class — you cannot call it or use it with isinstance()',
  },

  parameters: [
    { name: 'Name',        type: 'identifier', required: true,  default: null, desc: 'The alias name. Bound like an assignment in the current scope.' },
    { name: '[T, ...]',    type: 'type params', required: false, default: null, desc: 'Type parameters, making the alias generic: T, T: bound, T: (A, B), *Ts, **P. Since 3.13 a default: T = int.' },
    { name: 'expression',  type: 'expression', required: true,  default: null, desc: 'The aliased type. Evaluated lazily, on first access of Name.__value__, then cached.' },
  ],

  modes: [
    {
      id: 'lazy',
      label: 'lazy value',
      blurb: 'make() logs when it runs. Nothing is logged when the alias is created; the first __value__ access evaluates it, later ones reuse the result.',
      params: [{ name: 'value', type: 'any', hint: 'number or text', input: 'auto' }],
      template: "log = []\n\ndef make(value):\n    log.append('evaluated')\n    return value\n\ntype Alias = make({$value})\nbefore = list(log)\nAlias.__value__\nAlias.__value__\n(before, log, Alias.__value__)",
      cases: [
        { id: 'num',  label: 'a number', values: { value: '42' } },
        { id: 'text', label: 'text',     values: { value: 'Node' } },
        { id: 'huge', label: '1e400',    values: { value: '1e400' } },
      ],
    },
    {
      id: 'generic',
      label: 'generic alias',
      blurb: 'Subscripting a generic alias records the argument; the alias does not check it. (Normally you pass a type, e.g. Pair[int].)',
      params: [{ name: 'arg', type: 'any', hint: 'number or text', input: 'auto' }],
      template: 'type Pair[T] = tuple[T, T]\nalias = Pair[{$arg}]\n(alias, alias.__args__, Pair.__type_params__)',
      cases: [
        { id: 'text',  label: 'text',  values: { arg: 'str' } },
        { id: 'num',   label: 'a number', values: { arg: '5' } },
        { id: 'float', label: 'a float',  values: { arg: '2.5' } },
      ],
    },
  ],
  demoExplainer: 'In the lazy tab, before is empty: creating the alias ran nothing. Three __value__ reads produce a single log entry, because the value is computed once and cached. With 1e400 the code shows inf, which is not a Python name — and the NameError appears only at the first __value__ access, not on the type line. In the generic tab, Pair[...] builds a parameterised alias holding whatever you passed; nothing validates it against T at runtime — that is the type checker’s job.',

  patterns: [
    {
      name: 'Recursive JSON type',
      desc: 'Lazy evaluation lets the alias mention itself.',
      code: 'type JSON = dict[str, JSON] | list[JSON] | str | int | float | bool | None',
    },
    {
      name: 'Generic alias with a bound',
      desc: 'T must be a subtype of the bound for type checkers.',
      code: 'from collections.abc import Hashable\n\ntype Index[K: Hashable] = dict[K, list[int]]',
    },
    {
      name: 'Aliases in annotations',
      desc: 'Use the alias exactly like the type it names.',
      code: 'type UserId = int\n\ndef load(uid: UserId) -> dict[str, str]:\n    ...',
    },
    {
      name: 'Pre-3.12 equivalent',
      desc: 'typing.TypeAlias (3.10+, deprecated since 3.12) marks an ordinary, eager assignment as an alias.',
      code: 'from typing import TypeAlias\n\nVector: TypeAlias = list[float]',
    },
  ],

  examples: [
    { title: 'A simple alias',                code: 'type Vector = list[float]\n(Vector, Vector.__value__)',                                 returns: '(Vector, list[float])' },
    { title: 'It is a TypeAliasType object',  code: 'type UserId = int\ntype(UserId)',                                                    returns: "<class 'typing.TypeAliasType'>" },
    { title: 'Forward references just work',  code: 'type Tree = list[Tree | int]\nTree.__value__',                                        returns: 'list[Tree | int]' },
    { title: 'Generic alias',                 code: 'type Pair[T] = tuple[T, T]\n(Pair.__type_params__, Pair[int])',                     returns: '((T,), Pair[int])' },
    { title: 'Type parameter default (3.13)', code: 'type Opt[T = int] = T | None\nOpt.__type_params__[0].__default__',                   returns: "<class 'int'>" },
    { title: 'type is still the builtin',     code: "(type(3), type('abc').__name__)",                                                returns: "(<class 'int'>, 'str')" },
    { title: 'Soft keyword: still a valid name', code: 'type = 5\ntype',                                                                returns: '5' },
  ],

  pitfalls: [
    {
      name: 'Treating the alias as a class',
      desc: 'A type alias is a TypeAliasType, not the type it names. You cannot call it or pass it to isinstance(). Use __value__ (or the real type) at runtime.',
      wrong: { label: 'isinstance with the alias', code: 'type Vector = list[float]\nisinstance([1.0], Vector)', output: 'TypeError: isinstance() arg 2 must be a type, a tuple of types, or a union' },
      fix:   { label: 'check the runtime type',    code: 'type Vector = list[float]\nisinstance([1.0], list)',   output: 'True' },
    },
    {
      name: 'Expecting TypeAlias to be lazy',
      desc: 'X: TypeAlias = ... is an ordinary assignment, evaluated immediately, so a forward reference to a class defined later fails. The type statement defers evaluation.',
      wrong: { label: 'eager TypeAlias', code: 'from typing import TypeAlias\nTree: TypeAlias = list[Node]\nclass Node: pass', output: "NameError: name 'Node' is not defined. Did you mean: 'None'?" },
      fix:   { label: 'type statement',  code: 'type Tree = list[Node]\nclass Node: pass\nTree.__value__',                               output: 'list[__main__.Node]' },
    },
    {
      name: 'Comparing the alias with the aliased type',
      desc: 'The alias object is not equal to its value. Compare __value__ if you need that at runtime.',
      wrong: { label: 'alias == type',  code: 'type Vector = list[float]\nVector == list[float]',           output: 'False' },
      fix:   { label: 'compare __value__', code: 'type Vector = list[float]\nVector.__value__ == list[float]', output: 'True' },
    },
  ],

  when: {
    use: [
      'Naming a long or repeated type hint (unions, nested generics, callables)',
      'Recursive types and forward references — no quotes needed',
      'Generic aliases: type Result[T] = T | Error',
    ],
    avoid: [
      'Code that must run on Python 3.11 or older → Name: TypeAlias = ... (typing)',
      'A distinct type for type checkers (UserId must not accept any int) → typing.NewType',
      'Anything you need to instantiate or check with isinstance() → use the class itself',
    ],
  },

  notes: {
    cpython:        'The value is compiled into an annotation scope (like a tiny function); TypeAliasType calls it on the first __value__ access',
    'Soft keyword': 'type acts as a keyword only where a statement starts with type Name ... = ; everywhere else it is the ordinary builtin name, so type(x) and variables named type keep working',
    'Scope':        'Class-body names are visible to the alias value (annotation scopes can see the enclosing class namespace), unlike in methods',
  },

  related: [
    { name: 'type()',  slug: 'type',  when: 'The builtin: get an object’s type, or create a class dynamically', category: 'functions' },
    { name: 'class',   slug: 'class', when: 'Generic classes use the same [T] syntax: class Box[T]' },
    { name: 'def',     slug: 'def',   when: 'Generic functions: def first[T](xs: list[T]) -> T' },
    { name: 'isinstance()', slug: 'isinstance', when: 'Needs a real class, not an alias', category: 'functions' },
    { name: 'NameError', slug: 'nameerror', when: 'What an undefined name in the alias raises — lazily', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between type X = ... and X: TypeAlias = ...?',
      a: 'The type statement (3.12+) creates a TypeAliasType whose value is evaluated lazily, supports type parameters directly and allows forward and recursive references without quotes. X: TypeAlias = ... (3.10+) is a normal assignment with a marker annotation: evaluated at once, so forward references must be strings. typing.TypeAlias is deprecated since 3.12 in favour of the type statement.',
    },
    {
      q: 'Does the type statement break code that uses type() or a variable named type?',
      a: 'No. type is a soft keyword: it is only treated as a keyword in the exact form type Name = ... . type(obj), isinstance(x, type) and type = 5 all still work.',
    },
    {
      q: 'Why can’t I use a type alias with isinstance()?',
      a: 'The alias is a TypeAliasType object, not a class, and isinstance() refuses it. Aliases are for type checkers; at runtime check against the real class, or use Alias.__value__ when it is a plain class.',
    },
    {
      q: 'When is the value of a type alias evaluated?',
      a: 'On the first access of Alias.__value__, not when the type line runs. The result is cached, so later accesses do not re-evaluate it. A NameError in the value therefore shows up at that first access.',
    },
  ],

  history: [
    { version: '3.12', note: 'The type statement was added (PEP 695), together with type parameter lists for classes and functions.' },
    { version: '3.13', note: 'Type parameters can have default values (PEP 696).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-type-statement',
    meta:  'The type statement',
  },
};
