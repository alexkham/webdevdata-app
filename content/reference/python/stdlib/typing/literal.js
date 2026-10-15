// content/reference/python/stdlib/typing/literal.js

export const meta = {
  slug:        'literal',
  name:        'typing.Literal',
  signature:   'Literal[value1, value2, ...]',
  blurb:       'A type whose only members are the listed values: Literal["r", "w"] accepts exactly the strings "r" and "w". Values can be str, bytes, int, bool, None and enum members.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'typing.Literal Literal literal type allowed values enum of strings mode r w string constants type hint get_args literal values validate choices pep 586',
};

export const method = {
  slug:      'literal',
  name:      'typing.Literal',
  signature: 'Literal[value1, value2, ...]',
  returns:   { type: 'typing._LiteralGenericAlias', desc: 'Remembers the values (get_args); flattened, de-duplicated, compared without regard to order.' },

  category:    'typing special form',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'A type checker rejects open_file("x") when the parameter is Literal["r", "w"]. Python itself does not: at runtime Literal only stores the values, which you can read back with get_args() to validate input yourself.',

  covers: ['Literal'],

  cheat: {
    commonCall: 'def open_file(mode: Literal["r", "w"]) -> None: ...',
    returns:    "typing.Literal['r', 'w'] — get_args() gives ('r', 'w')",
    replaces:   'str parameters with "one of these values" in the docstring',
    watchOut:   'Literal[1] and Literal[True] are different; type aliases hide the values from get_args',
  },

  parameters: [
    { name: 'value1', type: 'str | bytes | int | bool | Enum | None', required: true, default: null, desc: 'A literal value. Type checkers accept only these kinds and only written-out values; the runtime accepts anything.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'evaluate',
      blurb: 'Type a Literal hint. Watch duplicates disappear and nested Literals flatten.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'modes',  label: "Literal['r', 'w']",  values: { hint: "Literal['r', 'w']" } },
        { id: 'dups',   label: 'duplicates',         values: { hint: 'Literal[1, 2, 1]' } },
        { id: 'bool',   label: '1 and True',         values: { hint: 'Literal[1, True]' } },
        { id: 'nested', label: 'nested',             values: { hint: 'Literal[Literal[1, 2], 3]' } },
        { id: 'opt',    label: '| None',             values: { hint: "Literal['a'] | None" } },
        { id: 'type',   label: 'Literal[int]',       values: { hint: 'Literal[int]' } },
      ],
    },
    {
      id: 'compare',
      label: 'compare',
      blurb: 'Literal equality ignores order but not the type of each value.',
      params: [
        { name: 'a', type: 'str', hint: 'first hint', input: 'text' },
        { name: 'b', type: 'str', hint: 'second hint', input: 'text' },
      ],
      template: "from typing import *\ndef f(a: {$a}, b: {$b}): pass\nhints = get_type_hints(f)\nhints['a'] == hints['b']",
      cases: [
        { id: 'order', label: 'order',       values: { a: 'Literal[1, 2]', b: 'Literal[2, 1]' } },
        { id: 'bool',  label: '1 vs True',   values: { a: 'Literal[1]', b: 'Literal[True]' } },
        { id: 'union', label: 'vs a union',  values: { a: "Literal['a', 'b']", b: "Literal['a'] | Literal['b']" } },
      ],
    },
  ],
  demoExplainer: "Literal[1, 2, 1] keeps one 1, but Literal[1, True] keeps both: duplicates are detected by value AND type, because 1 == True in Python yet they are different literals. Literal[int] is accepted at runtime even though a class is not a literal value — the type checker reports it. In compare, Literal['a', 'b'] is not == to Literal['a'] | Literal['b'], although type checkers treat them as the same type.",

  patterns: [
    {
      name: 'A parameter with fixed choices',
      desc: 'Name the Literal once and reuse it.',
      code: 'from typing import Literal\n\nMode = Literal["r", "w", "a"]\n\ndef open_log(path: str, mode: Mode = "a") -> None:\n    ...',
    },
    {
      name: 'Validate at runtime with get_args',
      desc: 'The same tuple drives the check and the error message.',
      code: 'from typing import Literal, get_args\n\nLevel = Literal["debug", "info", "error"]\n\ndef parse_level(text: str) -> Level:\n    if text not in get_args(Level):\n        raise ValueError(f"level must be one of {get_args(Level)}")\n    return text',
    },
    {
      name: 'Return type depends on a flag',
      desc: 'With @overload, Literal[True] / Literal[False] select the return type.',
      code: 'from typing import Literal, overload\n\n@overload\ndef fetch(raw: Literal[True]) -> bytes: ...\n@overload\ndef fetch(raw: Literal[False] = ...) -> str: ...\ndef fetch(raw: bool = False) -> str | bytes:\n    return b"data" if raw else "data"',
    },
  ],

  examples: [
    { title: 'The values are kept', code: "from typing import Literal, get_args\nget_args(Literal['r', 'w'])", returns: "('r', 'w')" },
    { title: 'Duplicates removed, order ignored', code: 'from typing import Literal\n(Literal[1, 2, 1], Literal[1, 2] == Literal[2, 1])', returns: '(typing.Literal[1, 2], True)' },
    { title: '1 and True are different literals', code: 'from typing import Literal\nLiteral[1] == Literal[True]', returns: 'False' },
    { title: 'Nested Literals flatten', code: 'from typing import Literal\nLiteral[Literal[1, 2], 3] == Literal[1, 2, 3]', returns: 'True' },
    { title: 'Membership test at runtime', code: "from typing import Literal, get_args\nMode = Literal['r', 'w']\n('r' in get_args(Mode), 'x' in get_args(Mode))", returns: '(True, False)' },
    { title: 'Enum members are valid literals', code: 'import enum\nfrom typing import Literal\nclass Color(enum.Enum):\n    RED = 1\nLiteral[Color.RED]', returns: 'typing.Literal[<Color.RED: 1>]' },
    { title: 'isinstance does not work', code: "from typing import Literal\nisinstance('r', Literal['r'])", returns: 'TypeError: Subscripted generics cannot be used with class and instance checks' },
  ],

  pitfalls: [
    {
      name: 'Expecting Literal to reject bad values',
      desc: 'Only the type checker sees the hint. Values from users, files or the network need a runtime check.',
      wrong: { label: 'hint only', code: "from typing import Literal\ndef open_file(mode: Literal['r', 'w']) -> str:\n    return mode\nopen_file('x')", output: "'x'" },
      fix:   { label: 'check get_args', code: "from typing import Literal, get_args\nMode = Literal['r', 'w']\ndef open_file(mode: Mode) -> str:\n    if mode not in get_args(Mode):\n        raise ValueError(f'mode must be one of {get_args(Mode)}, not {mode!r}')\n    return mode\nopen_file('x')", output: "ValueError: mode must be one of ('r', 'w'), not 'x'" },
    },
    {
      name: 'get_args on a type statement alias',
      desc: 'type Mode = Literal[...] (3.12+) creates a TypeAliasType, which has no arguments of its own. Read its __value__.',
      wrong: { label: 'get_args(Mode)', code: "from typing import Literal, get_args\ntype Mode = Literal['r', 'w']\nget_args(Mode)", output: '()' },
      fix:   { label: 'get_args(Mode.__value__)', code: "from typing import Literal, get_args\ntype Mode = Literal['r', 'w']\nget_args(Mode.__value__)", output: "('r', 'w')" },
    },
  ],

  when: {
    use: [
      'Parameters that accept a small fixed set of strings or numbers (modes, levels, directions)',
      'Overloads whose return type depends on a flag value',
      'Tagged unions: a kind: Literal["circle"] field in each TypedDict of a union',
    ],
    avoid: [
      'Large or growing sets of values → an Enum',
      'Values computed at runtime → type checkers accept only written-out literals',
      'Input validation on its own → add a get_args() check',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: Literal is a _TypedCacheSpecialForm (its cache is typed, so Literal[1] and Literal[True] are cached separately) producing _LiteralGenericAlias',
    'Equality':   'Compares the set of (value, type(value)) pairs — order-insensitive since 3.9.1, and 1 is not True',
    'Runtime':    'Any value is accepted inside the brackets; restrictions to literals are enforced only by type checkers',
  },

  related: [
    { name: 'Optional / Union', slug: 'optional', when: 'Unions of other types' },
    { name: 'TypedDict', slug: 'typeddict', when: 'Tagged unions with a Literal kind field' },
    { name: 'overload', slug: 'overload', when: 'Different return types per literal argument' },
    { name: 'enum module', slug: 'enum', when: 'When the set of values deserves names', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does typing.Literal validate values at runtime?',
      a: 'No. Literal["r", "w"] only informs type checkers. At runtime any value passes; to validate, test value in get_args(YourLiteral) and raise.',
    },
    {
      q: 'Literal or Enum?',
      a: 'Literal for a handful of plain values that callers pass as strings or numbers (mode="r"). Enum when the values deserve names, methods or iteration, or when the set grows.',
    },
    {
      q: 'How do I get the allowed values out of a Literal?',
      a: "typing.get_args(Mode) returns them as a tuple, e.g. ('r', 'w'). For an alias made with the type statement, use get_args(Mode.__value__).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.Literal',
    meta:  'typing.Literal',
  },

};
