// content/reference/python/stdlib/typing/typeguard.js — TypeGuard and TypeIs

export const meta = {
  slug:        'typeguard',
  name:        'typing.TypeGuard / TypeIs',
  signature:   'def is_x(val: A) -> TypeGuard[B]: ... · def is_x(val: A) -> TypeIs[B]: ...',
  blurb:       'Return types for your own type-checking functions: if is_str_list(x) returns True, the type checker treats x as list[str] afterwards. At runtime they are ordinary functions returning whatever they return.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.10+ (TypeIs 3.13+)',
  searchTerms: 'typing.TypeGuard TypeGuard TypeIs type narrowing user defined type guard type predicate function isinstance helper narrow list[object] to list[str] pep 647 pep 742',
};

export const method = {
  slug:      'typeguard',
  name:      'typing.TypeGuard / TypeIs',
  signature: 'def is_x(val: A) -> TypeGuard[B]: ... · def is_x(val: A) -> TypeIs[B]: ...',
  returns:   { type: 'typing._GenericAlias', desc: 'typing.TypeGuard[B] / typing.TypeIs[B]; the annotated function itself is an ordinary function.' },

  category:    'typing special form',
  version:     'Python 3.10+ (TypeIs 3.13+)',
  hasLiveDemo: true,

  subtitle: 'They let a boolean helper narrow types the way isinstance() does. TypeIs[B] (3.13) narrows in both branches and needs B to fit the argument type; TypeGuard[B] narrows only when True but allows unrelated types such as list[object] → list[str]. Neither is checked at runtime: a wrong guard silently lies to the type checker.',

  covers: ['TypeGuard', 'TypeIs'],

  cheat: {
    commonCall: 'def is_str(v: object) -> TypeIs[str]:\n    return isinstance(v, str)',
    returns:    'the function returns its bool; the checker narrows the argument',
    replaces:   'cast() after a hand-written check',
    watchOut:   'Must return a real bool and be correct — nothing verifies the claim',
  },

  parameters: [
    { name: 'B', type: 'type', required: true, default: null, desc: 'The narrowed type when the function returns True. Exactly one type.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'return hint',
      blurb: 'The text is the return annotation of check(x: object). Type a TypeGuard / TypeIs hint and see how get_type_hints() reads it.',
      params: [{ name: 'hint', type: 'str', hint: 'a return type hint', input: 'text' }],
      template: "from typing import *\ndef check(x: object) -> {$hint}: ...\nget_type_hints(check)['return']",
      cases: [
        { id: 'guard', label: 'TypeGuard[list[str]]', values: { hint: 'TypeGuard[list[str]]' } },
        { id: 'is',    label: 'TypeIs[int]',          values: { hint: 'TypeIs[int]' } },
        { id: 'two',   label: 'TypeIs[int, str]',     values: { hint: 'TypeIs[int, str]' } },
        { id: 'bare',  label: 'bare TypeGuard',       values: { hint: 'TypeGuard' } },
        { id: 'union', label: 'TypeIs[int | str]',    values: { hint: 'TypeIs[int | str]' } },
      ],
    },
  ],
  demoExplainer: 'Both forms take exactly one type — TypeIs[int, str] raises "typing.TypeIs accepts only single type." — and a bare TypeGuard is rejected with "Plain typing.TypeGuard is not valid as type argument". A union inside is fine: TypeIs[int | str] narrows to either. What the function actually returns is never compared with the hint.',

  patterns: [
    {
      name: 'Narrow the contents of a list',
      desc: 'TypeGuard, because list[str] is not a subtype of list[object].',
      code: 'from typing import TypeGuard\n\ndef is_str_list(val: list[object]) -> TypeGuard[list[str]]:\n    return all(isinstance(x, str) for x in val)\n\ndef shout(items: list[object]) -> str:\n    if is_str_list(items):\n        return " ".join(items).upper()\n    return ""',
    },
    {
      name: 'An isinstance-like helper (3.13)',
      desc: 'TypeIs narrows both branches, like isinstance.',
      code: 'from typing import TypeIs\n\ndef is_number(v: object) -> TypeIs[int | float]:\n    return isinstance(v, (int, float)) and not isinstance(v, bool)',
    },
    {
      name: 'Guard for a TypedDict shape',
      desc: 'Check keys once, then use the data as the TypedDict.',
      code: 'from typing import TypedDict, TypeGuard\n\nclass User(TypedDict):\n    id: int\n    name: str\n\ndef is_user(d: dict[str, object]) -> TypeGuard[User]:\n    return isinstance(d.get("id"), int) and isinstance(d.get("name"), str)',
    },
  ],

  examples: [
    { title: 'At runtime: an ordinary bool function', code: "from typing import TypeGuard\ndef is_str_list(val: list[object]) -> TypeGuard[list[str]]:\n    return all(isinstance(x, str) for x in val)\n(is_str_list(['a', 'b']), is_str_list(['a', 1]))", returns: '(True, False)' },
    { title: 'The hint is recorded', code: "from typing import TypeGuard, get_type_hints\ndef is_str_list(val: list[object]) -> TypeGuard[list[str]]:\n    return all(isinstance(x, str) for x in val)\nget_type_hints(is_str_list)", returns: "{'val': list[object], 'return': typing.TypeGuard[list[str]]}" },
    { title: 'The return value is not checked', code: "from typing import TypeIs\ndef is_int(v: object) -> TypeIs[int]:\n    return 'yes'\nis_int(3.5)", returns: "'yes'" },
    { title: 'Origin and argument', code: 'from typing import TypeIs, get_args, get_origin\n(get_origin(TypeIs[str]), get_args(TypeIs[str]))', returns: "(typing.TypeIs, (<class 'str'>,))" },
    { title: 'TypeIs and TypeGuard are different forms', code: 'from typing import TypeGuard, TypeIs\nTypeIs[int] == TypeGuard[int]', returns: 'False' },
    { title: 'One type only', code: 'from typing import TypeGuard\nTypeGuard[int, str]', returns: "TypeError: typing.TypeGuard accepts only single type. Got (<class 'int'>, <class 'str'>)." },
  ],

  pitfalls: [
    {
      name: 'A guard that is wrong',
      desc: 'The type checker believes the guard. If it returns True for data that does not match, the error appears later, at runtime.',
      wrong: { label: 'too lenient', code: "from typing import TypeGuard\ndef is_str_list(val: list[object]) -> TypeGuard[list[str]]:\n    return len(val) > 0\nitems = ['a', 1]\n' '.join(items) if is_str_list(items) else 'not strings'", output: 'TypeError: sequence item 1: expected str instance, int found' },
      fix:   { label: 'check every item', code: "from typing import TypeGuard\ndef is_str_list(val: list[object]) -> TypeGuard[list[str]]:\n    return all(isinstance(x, str) for x in val)\nitems = ['a', 1]\n' '.join(items) if is_str_list(items) else 'not strings'", output: "'not strings'" },
    },
    {
      name: 'Returning a truthy value instead of a bool',
      desc: 'v and isinstance(v, str) returns v itself when v is falsy. Return an actual bool.',
      wrong: { label: 'and-chain', code: "from typing import TypeIs\ndef is_nonempty_str(v: object) -> TypeIs[str]:\n    return v and isinstance(v, str)\n[is_nonempty_str(''), is_nonempty_str(0)]", output: "['', 0]" },
      fix:   { label: 'bool result', code: "from typing import TypeIs\ndef is_nonempty_str(v: object) -> TypeIs[str]:\n    return isinstance(v, str) and v != ''\n[is_nonempty_str(''), is_nonempty_str(0)]", output: '[False, False]' },
    },
  ],

  when: {
    use: [
      'Reusable validation helpers whose result should narrow types (is_str_list, is_user)',
      'TypeIs (3.13+) for isinstance-like predicates; TypeGuard when the narrowed type is not a subtype of the input',
    ],
    avoid: [
      'Simple class checks → isinstance() narrows by itself',
      'Unchecked assumptions → a guard is only as good as its body',
      'Python 3.9 and older → typing_extensions provides both',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: TypeGuard and TypeIs are special forms accepting one type; nothing at runtime inspects functions annotated with them',
    'Difference': 'When True: TypeGuard narrows to exactly B, TypeIs to the intersection of the argument type and B. When False: TypeGuard does not narrow, TypeIs excludes B',
    'Methods':    'In a method, the narrowed argument is the first one after self / cls',
  },

  related: [
    { name: 'cast / assert_type', slug: 'cast', when: 'Unchecked narrowing without a function' },
    { name: 'Optional / Union', slug: 'optional', when: 'The unions that guards narrow' },
    { name: 'TypedDict', slug: 'typeddict', when: 'Guarding dict shapes' },
    { name: 'isinstance()', slug: 'isinstance', when: 'The built-in narrowing check', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between TypeGuard and TypeIs?',
      a: 'TypeIs (3.13) behaves like isinstance: when True the argument is narrowed to the intersection with the type, when False that type is excluded; the type must be consistent with the argument type. TypeGuard (3.10) narrows only on True, to exactly the given type, and allows narrowing to non-subtypes like list[object] → list[str].',
    },
    {
      q: 'Does TypeGuard check anything at runtime?',
      a: 'No. The function runs as written and returns whatever it returns. The annotation only tells the type checker how to narrow after the call.',
    },
    {
      q: 'When should I write a TypeGuard instead of using isinstance?',
      a: 'When the check is more than one isinstance call — list contents, dict keys, protocol-like structure — and you want to reuse it while keeping the narrowing.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.TypeGuard',
    meta:  'typing.TypeGuard',
  },

};
