// content/reference/python/stdlib/typing/optional.js — Optional and Union (and X | Y)

export const meta = {
  slug:        'optional',
  name:        'typing.Optional / Union',
  signature:   'Optional[X] · Union[X, Y, ...] · X | Y · X | None',
  blurb:       'Union[X, Y] means "either X or Y"; Optional[X] means "X or None". Since Python 3.10 write X | Y and X | None instead — the meaning is identical and the objects compare equal.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.5+ (X | Y since 3.10)',
  searchTerms: 'typing.Optional Optional typing.Union Union x | y x | none pipe union type types.UnionType nullable none type hint either or optional argument default none pep 604 union of types',
};

export const method = {
  slug:      'optional',
  name:      'typing.Optional / Union',
  signature: 'Optional[X] · Union[X, Y, ...] · X | Y · X | None',
  returns:   { type: 'typing._UnionGenericAlias | types.UnionType', desc: 'Union[...] and Optional[...] give a typing._UnionGenericAlias; X | Y gives a types.UnionType. A union of one type is that type itself.' },

  category:    'typing special form',
  version:     'Python 3.5+ (X | Y since 3.10)',
  hasLiveDemo: true,

  subtitle: 'At runtime a union only records its members: nested unions are flattened, duplicates dropped, order ignored by ==, and None becomes NoneType. Optional[X] is nothing more than Union[X, None] — it says "None is allowed", not "the argument may be omitted".',

  covers: ['Optional', 'Union'],

  cheat: {
    commonCall: 'def find(key: str) -> int | None: ...',
    returns:    'Optional[int] → typing.Optional[int]; int | None → int | None (equal objects)',
    replaces:   'Optional[X] → X | None, Union[X, Y] → X | Y (3.10+)',
    watchOut:   "'Node' | None fails at runtime — quote the whole hint: 'Node | None'",
  },

  parameters: [
    { name: 'X', type: 'type', required: true, default: null, desc: 'Optional: the one type besides None. Union: the first member.' },
    { name: 'Y', type: 'type', required: false, default: null, desc: 'Further union members. Unions inside are flattened, repeats dropped.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'evaluate',
      blurb: 'Type a union in either spelling and see what Python builds.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'opt',    label: 'Optional[int]',          values: { hint: 'Optional[int]' } },
        { id: 'pipe',   label: 'int | None',             values: { hint: 'int | None' } },
        { id: 'dups',   label: 'Union[int, str, int]',   values: { hint: 'Union[int, str, int]' } },
        { id: 'single', label: 'Union[int]',             values: { hint: 'Union[int]' } },
        { id: 'nested', label: 'Optional[Union[...]]',   values: { hint: 'Optional[Union[bytes, bytearray]]' } },
        { id: 'two',    label: 'Optional[int, str]',     values: { hint: 'Optional[int, str]' } },
        { id: 'quoted', label: "int | 'Node'",           values: { hint: "int | 'Node'" } },
      ],
    },
    {
      id: 'compare',
      label: 'compare',
      blurb: 'Two hints, one question: are they equal? Spelling and order do not matter for unions.',
      params: [
        { name: 'a', type: 'str', hint: 'first hint', input: 'text' },
        { name: 'b', type: 'str', hint: 'second hint', input: 'text' },
      ],
      template: "from typing import *\ndef f(a: {$a}, b: {$b}): pass\nhints = get_type_hints(f)\nhints['a'] == hints['b']",
      cases: [
        { id: 'spell', label: 'Optional vs | None', values: { a: 'Optional[int]', b: 'int | None' } },
        { id: 'order', label: 'order',              values: { a: 'Union[int, str]', b: 'str | int' } },
        { id: 'diff',  label: 'different members',  values: { a: 'int | None', b: 'int | str' } },
      ],
    },
  ],
  demoExplainer: 'Union[int, str, int] comes back as typing.Union[int, str] and Union[int] as plain int. Optional of a union adds NoneType to the flat member list. Optional takes exactly one type, hence "typing.Optional requires a single type. Got (<class \'int\'>, <class \'str\'>)." The last case shows the forward-reference trap: inside an expression, \'Node\' is just a str, and int | \'Node\' raises "unsupported operand type(s) for |: \'type\' and \'str\'".',

  patterns: [
    {
      name: 'A result that may be missing',
      desc: 'Return None for "not found" and say so in the hint.',
      code: 'def find_user(users: dict[int, str], user_id: int) -> str | None:\n    return users.get(user_id)',
    },
    {
      name: 'A parameter that defaults to None',
      desc: 'The default makes it omittable; | None allows None.',
      code: 'def connect(host: str, timeout: float | None = None) -> None:\n    ...',
    },
    {
      name: 'Accept several types',
      desc: 'Then narrow with isinstance — type checkers understand it.',
      code: 'def to_text(value: int | float | str) -> str:\n    if isinstance(value, str):\n        return value\n    return f"{value:g}"',
    },
    {
      name: 'Forward reference in a union',
      desc: 'Quote the whole union, not one member (or use from __future__ import annotations).',
      code: 'class Node:\n    next: "Node | None" = None',
    },
  ],

  examples: [
    { title: 'Optional[X] is Union[X, None] is X | None', code: 'from typing import Optional, Union\n(Optional[int] == Union[int, None], Optional[int] == (int | None))', returns: '(True, True)' },
    { title: 'Order is ignored by ==', code: 'from typing import Union\nUnion[int, str] == Union[str, int]', returns: 'True' },
    { title: 'Nested unions flatten, repeats vanish', code: 'from typing import Union\nUnion[int, Union[str, int]]', returns: 'typing.Union[int, str]' },
    { title: 'A union of one type is that type', code: 'from typing import Union\nUnion[int]', returns: "<class 'int'>" },
    { title: 'Unions work in isinstance', code: 'isinstance(3, int | str)', returns: 'True' },
    { title: 'Two runtime types, two origins', code: 'from typing import Union, get_origin\n(get_origin(int | str), get_origin(Union[int, str]))', returns: "(<class 'types.UnionType'>, typing.Union)" },
    { title: 'Optional takes exactly one type', code: 'from typing import Optional\nOptional[int, str]', returns: "TypeError: typing.Optional requires a single type. Got (<class 'int'>, <class 'str'>)." },
  ],

  pitfalls: [
    {
      name: 'Quoting one member of a | union',
      desc: "Inside an annotation expression 'Node' is just a str, so 'Node' | None is an ordinary | between a str and None — and fails when the class body runs. Quote the whole hint.",
      wrong: { label: "'Node' | None", code: "class Node:\n    next: 'Node' | None = None", output: "TypeError: unsupported operand type(s) for |: 'str' and 'NoneType'" },
      fix:   { label: "'Node | None'", code: "class Node:\n    next: 'Node | None' = None\nNode.__annotations__", output: "{'next': 'Node | None'}" },
    },
    {
      name: 'Optional does not make an argument optional',
      desc: 'Optional[str] only allows None as a value. The argument can be left out only if it has a default.',
      wrong: { label: 'no default', code: 'from typing import Optional\ndef greet(name: Optional[str]) -> str:\n    return f"Hello {name or \'you\'}"\ngreet()', output: "TypeError: greet() missing 1 required positional argument: 'name'" },
      fix:   { label: '= None', code: 'def greet(name: str | None = None) -> str:\n    return f"Hello {name or \'you\'}"\ngreet()', output: "'Hello you'" },
    },
    {
      name: 'Detecting unions by comparing with typing.Union',
      desc: 'Hint-inspecting code must handle both runtime kinds: get_origin() is typing.Union for Union[...] / Optional[...] but types.UnionType for X | Y (CPython 3.13).',
      wrong: { label: 'is Union', code: 'from typing import Union, get_origin\nget_origin(int | None) is Union', output: 'False' },
      fix:   { label: 'both kinds', code: 'import types\nfrom typing import Union, get_origin\nget_origin(int | None) in (Union, types.UnionType)', output: 'True' },
    },
  ],

  when: {
    use: [
      'X | None for values and results that may be None',
      'X | Y for parameters that accept a few unrelated types',
      'Union[...] / Optional[...] only in code that must run on 3.9 or older',
    ],
    avoid: [
      'Optional to mean "has a default" → give the parameter a default',
      'Long unions repeated everywhere → a type alias: type Number = int | float',
      'A union of related classes → a common base class or a Protocol',
    ],
  },

  notes: {
    cpython:        'Lib/typing.py (Union, Optional, _UnionGenericAlias) and Objects/unionobject.c (types.UnionType, the result of type.__or__)',
    'Normalisation': 'Members are flattened, de-duplicated and None becomes NoneType; == compares member sets, so order does not matter',
    'Repr':          'A two-member typing.Union containing None prints as typing.Optional[X]; the X | None spelling (types.UnionType) prints as int | None',
  },

  related: [
    { name: 'Literal', slug: 'literal', when: 'A union of exact values' },
    { name: 'Any / Never / Self …', slug: 'any', when: 'The other special types' },
    { name: 'get_type_hints / get_origin / get_args', slug: 'get_type_hints', when: 'Take unions apart at runtime' },
    { name: '| operator', slug: 'bitwise-or', when: 'The same operator on ints and sets', category: 'operators' },
    { name: 'None', slug: 'none', when: 'The value Optional allows', category: 'keywords' },
    { name: 'isinstance()', slug: 'isinstance', when: 'Accepts X | Y unions', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between Optional[int] and int | None?',
      a: 'None in meaning — both are "int or None", and they compare equal. int | None needs Python 3.10+ at runtime (or from __future__ import annotations); Optional works everywhere. At runtime they are different objects: typing._UnionGenericAlias and types.UnionType.',
    },
    {
      q: 'Does Optional mean the argument is optional?',
      a: 'No. Optional[X] only says None is an allowed value. Whether an argument can be omitted depends on its default: def f(x: int = 0) is omittable without Optional, def f(x: Optional[int]) is required.',
    },
    {
      q: 'Why does "unsupported operand type(s) for |: \'str\' and \'NoneType\'" appear?',
      a: "Because one member of a | union is a string forward reference, e.g. 'Node' | None. Strings do not support |. Quote the whole annotation ('Node | None'), use Optional['Node'], or add from __future__ import annotations.",
    },
    {
      q: 'Can I use isinstance with a Union?',
      a: 'Yes, when the members are plain classes: isinstance(3, int | str) and isinstance(3, Union[int, str]) both work. Members are tried in order, and reaching one such as list[int] or Literal[1] raises TypeError — isinstance("a", int | list[int]) raises, while isinstance(3, int | list[int]) returns True because int matched first.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.Union',
    meta:  'typing.Union',
  },

};
