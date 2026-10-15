// content/reference/python/stdlib/typing/typealias.js — TypeAlias and TypeAliasType

export const meta = {
  slug:        'typealias',
  name:        'typing.TypeAlias / TypeAliasType',
  signature:   'Name: TypeAlias = value · TypeAliasType(name, value, *, type_params=()) · type Name = value',
  blurb:       'Give a complex type a name. Since Python 3.12 the type statement creates a TypeAliasType whose value is evaluated lazily; the older Name: TypeAlias = value annotation (3.10) is deprecated in its favour.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.10+ (TypeAlias), 3.12+ (TypeAliasType, type statement)',
  searchTerms: 'typing.TypeAlias TypeAlias TypeAliasType type alias type statement __value__ __type_params__ generic type alias recursive type alias lazy evaluation pep 613 pep 695 explicit type alias Only generic type aliases are subscriptable',
};

export const method = {
  slug:      'typealias',
  name:      'typing.TypeAlias / TypeAliasType',
  signature: 'Name: TypeAlias = value · TypeAliasType(name, value, *, type_params=()) · type Name = value',
  returns:   { type: 'TypeAliasType', desc: 'type Name = value binds a typing.TypeAliasType; Name: TypeAlias = value binds the value itself (TypeAlias is only an annotation).' },

  category:    'typing aliases',
  version:     'Python 3.10+ (TypeAlias), 3.12+ (TypeAliasType, type statement)',
  hasLiveDemo: false,

  subtitle: 'Three spellings, two runtime results. Vector = list[float] and Vector: TypeAlias = list[float] both bind the list[float] object itself. type Vector = list[float] binds a TypeAliasType named Vector: its value is computed on first access to __value__, so it may refer to names defined later — including itself.',

  covers: ['TypeAlias', 'TypeAliasType'],

  cheat: {
    commonCall: 'type Vector = list[float]\ntype Pair[T] = tuple[T, T]',
    returns:    'Vector → a TypeAliasType; Vector.__value__ → list[float]',
    replaces:   'Vector: TypeAlias = list[float] (deprecated since 3.12)',
    watchOut:   'A TypeAliasType is not a class: no isinstance(), no calling',
  },

  parameters: [
    { name: 'name',        type: 'str',   required: true,  default: null, desc: 'TypeAliasType: the alias name (what its repr shows).' },
    { name: 'value',       type: 'hint',  required: true,  default: null, desc: 'The aliased type. With the type statement it is evaluated lazily.' },
    { name: 'type_params', type: 'tuple', required: false, default: '()', desc: 'TypeAliasType: the TypeVars, ParamSpecs and TypeVarTuples that make the alias generic.' },
  ],

  patterns: [
    {
      name: 'Name a long hint (3.12+)',
      desc: 'Type checkers treat the alias and its value as the same type.',
      code: 'type Address = tuple[str, int]\ntype Options = dict[str, str]\n\ndef connect(addr: Address, opts: Options) -> None:\n    ...',
    },
    {
      name: 'Generic alias',
      desc: 'Type parameters in brackets after the name.',
      code: 'type Pair[T] = tuple[T, T]\ntype Matrix[T] = list[list[T]]\n\ndef diagonal(m: Matrix[float]) -> list[float]:\n    return [m[i][i] for i in range(len(m))]',
    },
    {
      name: 'Recursive alias',
      desc: 'Lazy evaluation lets the alias refer to itself.',
      code: 'type JSON = dict[str, JSON] | list[JSON] | str | int | float | bool | None',
    },
    {
      name: 'Before 3.12',
      desc: 'TypeAlias makes the intent explicit (and allows a string forward reference).',
      code: 'from typing import TypeAlias\n\nVector: TypeAlias = "list[float]"',
    },
  ],

  examples: [
    { title: 'The type statement creates a TypeAliasType', code: 'type Vector = list[float]\n(Vector, type(Vector), Vector.__value__)', returns: "(Vector, <class 'typing.TypeAliasType'>, list[float])" },
    { title: 'TypeAlias binds the value itself', code: 'from typing import TypeAlias\nVector: TypeAlias = list[float]\nVector', returns: 'list[float]' },
    { title: 'Generic alias', code: 'type Pair[T] = tuple[T, T]\n(Pair[int], Pair.__type_params__)', returns: '(Pair[int], (T,))' },
    { title: 'Lazy: errors appear on first use', code: 'type Broken = Undefined\nBroken.__value__', returns: "NameError: name 'Undefined' is not defined" },
    { title: 'Recursive aliases work', code: 'type Tree = list[Tree | int]\nTree.__value__', returns: 'list[Tree | int]' },
    { title: 'Created without the statement', code: "from typing import TypeAliasType\nVector = TypeAliasType('Vector', list[float])\n(Vector, Vector.__value__)", returns: '(Vector, list[float])' },
    { title: 'Only generic aliases take arguments', code: 'type Vector = list[float]\nVector[int]', returns: 'TypeError: Only generic type aliases are subscriptable' },
  ],

  pitfalls: [
    {
      name: 'Using a type alias as a class',
      desc: 'A TypeAliasType is a name for a hint. For runtime work, use its __value__ (or the real class).',
      wrong: { label: 'isinstance(x, Alias)', code: 'type Vector = list[float]\nisinstance([1.0], Vector)', output: 'TypeError: isinstance() arg 2 must be a type, a tuple of types, or a union' },
      fix:   { label: 'the class itself', code: 'type Vector = list[float]\nisinstance([1.0], list)', output: 'True' },
    },
    {
      name: 'Comparing an alias with its value',
      desc: 'The alias is a distinct object, so == is False even though type checkers treat both as the same type.',
      wrong: { label: 'Alias == value', code: 'type Vector = list[float]\nVector == list[float]', output: 'False' },
      fix:   { label: 'Alias.__value__ == value', code: 'type Vector = list[float]\nVector.__value__ == list[float]', output: 'True' },
    },
  ],

  when: {
    use: [
      'type Name = ... (3.12+) for long, repeated or recursive hints',
      'Generic aliases: type Pair[T] = tuple[T, T]',
      'Name: TypeAlias = ... only for code that must run on 3.10 / 3.11',
    ],
    avoid: [
      'A distinct type that must not mix with the original → NewType',
      'Runtime checks against the alias → isinstance on the real classes',
    ],
  },

  notes: {
    cpython:      'TypeAliasType is implemented in C (Objects/typevarobject.c); TypeAlias is a plain special form in Lib/typing.py — it only marks the annotation',
    'Lazy':       '__value__ is computed on first access and cached; a NameError in the value surfaces then, not at definition time',
    'Deprecation': 'TypeAlias is deprecated since 3.12 in favour of the type statement; removal is not planned',
  },

  related: [
    { name: 'type statement', slug: 'type', when: 'The 3.12 syntax that creates TypeAliasType', category: 'keywords' },
    { name: 'NewType', slug: 'newtype', when: 'A distinct type instead of a synonym' },
    { name: 'TypeVar / Generic', slug: 'typevar', when: 'Type parameters of generic aliases' },
    { name: 'Literal', slug: 'literal', when: 'get_args() needs Alias.__value__ for type statement aliases' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Aliases are created by statements — type Name = value, Name: TypeAlias = value — and what they mean is decided by the type checker. A demo box can only send text and numbers, not statements, so the examples below show each spelling and its runtime object with fixed, verified output.',
    },
    {
      q: 'How do I create a type alias in Python?',
      a: 'On 3.12+: type Vector = list[float]. On older versions: Vector = list[float], optionally annotated as Vector: TypeAlias = list[float] (3.10+) to make the intent explicit to type checkers.',
    },
    {
      q: 'What is the difference between TypeAlias and TypeAliasType?',
      a: 'TypeAlias is an annotation: the variable still holds the value itself. TypeAliasType is the runtime type of aliases made with the type statement: a named, lazily evaluated wrapper with __value__ and __type_params__. The docs point out that TypeAliasType is not the type of TypeAlias.',
    },
    {
      q: 'Why does get_args() return () for my alias?',
      a: 'Because a type-statement alias is a TypeAliasType, not the aliased hint. Use get_args(Alias.__value__); for a subscripted generic alias, get_args(Pair[int]) gives (int,).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.TypeAliasType',
    meta:  'typing.TypeAliasType',
  },

};
