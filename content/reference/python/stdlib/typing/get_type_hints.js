// content/reference/python/stdlib/typing/get_type_hints.js — the introspection helpers

export const meta = {
  slug:        'get_type_hints',
  name:        'typing.get_type_hints / get_origin / get_args …',
  signature:   'get_type_hints(obj, globalns=None, localns=None, include_extras=False) · get_origin(tp) · get_args(tp) · get_protocol_members(tp) · is_protocol(tp) · is_typeddict(tp) · ForwardRef(arg)',
  blurb:       'Read type hints at runtime: get_type_hints() evaluates string annotations and merges class hierarchies, get_origin()/get_args() take a hint apart, and is_protocol / is_typeddict / get_protocol_members inspect classes. ForwardRef is how a string hint is represented.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.5+ (get_origin/get_args 3.8, is_typeddict 3.10, is_protocol/get_protocol_members 3.13)',
  searchTerms: 'typing.get_type_hints get_type_hints get_origin get_args get_protocol_members is_protocol is_typeddict ForwardRef __annotations__ runtime type hints introspection forward reference string annotation evaluate include_extras NameError Forward reference must be an expression inspect.get_annotations',
};

export const method = {
  slug:      'get_type_hints',
  name:      'typing.get_type_hints / get_origin / get_args …',
  signature: 'get_type_hints(obj, globalns=None, localns=None, include_extras=False) · get_origin(tp) · get_args(tp) · get_protocol_members(tp) · is_protocol(tp) · is_typeddict(tp) · ForwardRef(arg)',
  returns:   { type: 'dict | object | tuple | frozenset | bool', desc: 'get_type_hints → dict of name → evaluated hint; get_origin → the unsubscripted type or None; get_args → tuple (possibly empty); get_protocol_members → frozenset; is_* → bool.' },

  category:    'typing introspection',
  version:     'Python 3.5+ (get_origin/get_args 3.8, is_typeddict 3.10, is_protocol/get_protocol_members 3.13)',
  hasLiveDemo: true,

  subtitle: 'obj.__annotations__ gives you what was written — possibly strings. get_type_hints(obj) gives you the evaluated objects: string annotations are evaluated in the module namespace (so their names must exist at that moment), None becomes NoneType, and Annotated / Required / NotRequired / ReadOnly are stripped unless include_extras=True.',

  covers: ['get_type_hints', 'get_origin', 'get_args', 'get_protocol_members', 'is_protocol', 'is_typeddict', 'ForwardRef'],

  cheat: {
    commonCall: 'hints = get_type_hints(func)\nget_origin(hints["x"]), get_args(hints["x"])',
    returns:    "{'x': list[int]} · get_origin(list[int]) → list · get_args(list[int]) → (int,)",
    replaces:   'Reading __annotations__ and eval()-ing strings by hand',
    watchOut:   'Names imported under if TYPE_CHECKING: raise NameError here',
  },

  parameters: [
    { name: 'obj',            type: 'function | class | module', required: true,  default: null,    desc: 'Whose annotations to read. Classes include the annotations of their bases: the MRO is walked in reverse (object first), so a subclass entry for the same name wins.' },
    { name: 'globalns',       type: 'dict', required: false, default: 'None',  desc: 'Namespace for evaluating strings; defaults to the module of obj.' },
    { name: 'localns',        type: 'dict', required: false, default: 'None',  desc: 'Extra local namespace, e.g. names that are only imported under TYPE_CHECKING.' },
    { name: 'include_extras', type: 'bool', required: false, default: 'False', desc: 'Keep Annotated, Required, NotRequired and ReadOnly instead of stripping them.' },
    { name: 'tp',             type: 'hint', required: true,  default: null,    desc: 'get_origin / get_args / is_*: the hint or class to inspect.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'get_type_hints',
      blurb: 'The parameter is annotated with your text as a string. get_type_hints() evaluates it — including strings nested inside it.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'nested',  label: "list['int']",        values: { hint: "list['int']" } },
        { id: 'twice',   label: "'int' (quoted twice)", values: { hint: "'int'" } },
        { id: 'none',    label: 'None',               values: { hint: 'None' } },
        { id: 'strip',   label: 'Annotated (stripped)', values: { hint: "Annotated[int, 'm']" } },
        { id: 'missing', label: 'undefined name',     values: { hint: 'Missing' } },
        { id: 'syntax',  label: 'not an expression',  values: { hint: 'list[' } },
      ],
    },
    {
      id: 'extras',
      label: 'include_extras',
      blurb: 'With include_extras=True the qualifiers that get_type_hints() normally strips are kept.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f, include_extras=True)['x']",
      cases: [
        { id: 'ann', label: 'Annotated',     values: { hint: "Annotated[int, 'm']" } },
        { id: 'req', label: 'Required[int]', values: { hint: 'Required[int]' } },
      ],
    },
    {
      id: 'originArgs',
      label: 'get_origin / get_args',
      blurb: 'Take the evaluated hint apart. A plain class has no origin (None) and no arguments.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nhint = get_type_hints(f)['x']\n(get_origin(hint), get_args(hint))",
      cases: [
        { id: 'dict',     label: 'dict[str, int]',       values: { hint: 'dict[str, int]' } },
        { id: 'optional', label: 'Optional[int]',        values: { hint: 'Optional[int]' } },
        { id: 'callable', label: 'Callable[[int], str]', values: { hint: 'Callable[[int], str]' } },
        { id: 'plain',    label: 'int',                  values: { hint: 'int' } },
      ],
    },
  ],
  demoExplainer: "A string inside a hint is evaluated as well, so list['int'] comes back as list[int] and a hint quoted twice still ends up as int. None becomes NoneType. Errors surface only now: an unknown name raises NameError (with a \"Did you mean\" hint when a similar name exists), and text that is not a Python expression raises \"SyntaxError: Forward reference must be an expression -- got 'list['\". In the last tab, Optional[int] reports typing.Union as its origin and the members as its arguments.",

  patterns: [
    {
      name: 'Walk the parameters of a function',
      desc: 'Pair get_type_hints() with get_origin/get_args to drive conversions (CLI parsers, serializers).',
      code: 'from typing import get_args, get_origin, get_type_hints\n\ndef describe(func) -> dict[str, str]:\n    out = {}\n    for name, hint in get_type_hints(func).items():\n        origin = get_origin(hint) or hint\n        out[name] = f"{getattr(origin, \'__name__\', origin)} {get_args(hint)}"\n    return out',
    },
    {
      name: 'Resolve names imported only for type checking',
      desc: 'Supply them through localns.',
      code: 'from typing import TYPE_CHECKING, get_type_hints\n\nif TYPE_CHECKING:\n    from decimal import Decimal\n\ndef total(x: "Decimal") -> "Decimal": ...\n\nimport decimal\nhints = get_type_hints(total, localns={"Decimal": decimal.Decimal})',
    },
    {
      name: 'Dispatch on TypedDict and Protocol classes',
      desc: 'is_typeddict (3.10+) and is_protocol (3.13+) recognise the special class kinds.',
      code: 'from typing import is_protocol, is_typeddict\n\ndef kind(cls: type) -> str:\n    if is_typeddict(cls):\n        return "typed dict"\n    if is_protocol(cls):\n        return "protocol"\n    return "class"',
    },
  ],

  examples: [
    { title: 'Strings and None are resolved', code: "from typing import get_type_hints\ndef f(x: int, y: 'str' = 'a') -> None: pass\nget_type_hints(f)", returns: "{'x': <class 'int'>, 'y': <class 'str'>, 'return': <class 'NoneType'>}" },
    { title: 'Classes merge their bases', code: 'from typing import get_type_hints\nclass A:\n    x: int\nclass B(A):\n    y: str\nget_type_hints(B)', returns: "{'x': <class 'int'>, 'y': <class 'str'>}" },
    { title: 'get_origin', code: 'from typing import Dict, Union, get_origin\n(get_origin(str), get_origin(Dict[str, int]), get_origin(Union[int, str]), get_origin(list[int]))', returns: "(None, <class 'dict'>, typing.Union, <class 'list'>)" },
    { title: 'get_args', code: 'from typing import Callable, get_args\n(get_args(int), get_args(dict[int, str]), get_args(Callable[[int], str]))', returns: "((), (<class 'int'>, <class 'str'>), ([<class 'int'>], <class 'str'>))" },
    { title: 'ForwardRef inside typing aliases', code: "from typing import List\nList['Node']", returns: "typing.List[ForwardRef('Node')]" },
    { title: 'Protocol introspection (3.13)', code: 'from typing import Protocol, get_protocol_members, is_protocol\nclass P(Protocol):\n    def a(self) -> str: ...\n    b: int\n(sorted(get_protocol_members(P)), is_protocol(P), is_protocol(int))', returns: "(['a', 'b'], True, False)" },
    { title: 'is_typeddict', code: 'from typing import TypedDict, is_typeddict\nclass Film(TypedDict):\n    title: str\n(is_typeddict(Film), is_typeddict(dict), is_typeddict(TypedDict))', returns: '(True, False, False)' },
    { title: 'Not a function, class or module', code: 'from typing import get_type_hints\nget_type_hints(3)', returns: 'TypeError: 3 is not a module, class, method, or function.' },
  ],

  pitfalls: [
    {
      name: 'Names imported under TYPE_CHECKING',
      desc: 'At runtime the import never happened, so evaluating the string fails. Provide the name via localns (or import it for real).',
      wrong: { label: 'plain call', code: "from typing import TYPE_CHECKING, get_type_hints\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef total(x: 'Decimal') -> 'Decimal': ...\nget_type_hints(total)", output: "NameError: name 'Decimal' is not defined" },
      fix:   { label: 'localns=', code: "from typing import TYPE_CHECKING, get_type_hints\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef total(x: 'Decimal') -> 'Decimal': ...\nimport decimal\nget_type_hints(total, localns={'Decimal': decimal.Decimal})", output: "{'x': <class 'decimal.Decimal'>, 'return': <class 'decimal.Decimal'>}" },
    },
    {
      name: 'Reading __annotations__ directly',
      desc: 'With string annotations (or from __future__ import annotations) __annotations__ holds text, not types.',
      wrong: { label: '__annotations__', code: "def f(x: 'int', y: 'list[str]'): pass\nf.__annotations__", output: "{'x': 'int', 'y': 'list[str]'}" },
      fix:   { label: 'get_type_hints', code: "from typing import get_type_hints\ndef f(x: 'int', y: 'list[str]'): pass\nget_type_hints(f)", output: "{'x': <class 'int'>, 'y': list[str]}" },
    },
    {
      name: 'Comparing get_origin() with the typing alias',
      desc: 'get_origin normalises typing aliases to the real class: it returns dict, never typing.Dict.',
      wrong: { label: 'is Dict', code: 'from typing import Dict, get_origin\nget_origin(Dict[str, int]) is Dict', output: 'False' },
      fix:   { label: 'is dict', code: 'from typing import Dict, get_origin\nget_origin(Dict[str, int]) is dict', output: 'True' },
    },
  ],

  when: {
    use: [
      'Libraries that build behaviour from hints: serializers, validators, CLI and dependency-injection frameworks',
      'Tests asserting the annotations of an API',
    ],
    avoid: [
      'Hot paths → get_type_hints evaluates strings on every call; cache the result',
      'Code under TYPE_CHECKING-only imports without localns → NameError',
      'Just checking a value → isinstance with the plain class',
    ],
  },

  notes: {
    cpython:        'Lib/typing.py: get_type_hints evaluates strings through ForwardRef._evaluate (eval in the given namespaces) and _eval_type, then _strip_annotations; get_origin/get_args read __origin__/__args__ and normalise typing aliases',
    'ForwardRef':   'Holds the source text (__forward_arg__) and compiles it at creation — invalid text raises "SyntaxError: Forward reference must be an expression -- got ..."',
    'Nested strings': "Inside list[...] a string stays a plain str (no ForwardRef is created), yet get_type_hints() in 3.13 still evaluates it: list['int'] becomes list[int]",
    'Since 3.11':   'A None default no longer adds Optional to the hint',
  },

  related: [
    { name: 'Annotated', slug: 'annotated', when: 'include_extras keeps its metadata' },
    { name: 'TYPE_CHECKING', slug: 'type_checking', when: 'Why names may be missing at runtime' },
    { name: 'Protocol', slug: 'protocol', when: 'What is_protocol recognises' },
    { name: 'TypedDict', slug: 'typeddict', when: 'What is_typeddict recognises' },
    { name: 'NameError', slug: 'nameerror', when: 'Unresolvable string annotations', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between __annotations__ and get_type_hints()?',
      a: '__annotations__ is the raw dict of what was written: strings stay strings, None stays None and a class has only its own entries. get_type_hints() evaluates strings, replaces None with NoneType, merges base-class annotations and strips Annotated/Required/NotRequired/ReadOnly unless include_extras=True.',
    },
    {
      q: 'Why does get_type_hints raise NameError?',
      a: 'A string annotation names something that does not exist in the module namespace when you call it — typically a class imported only under if TYPE_CHECKING:, or one defined inside a function. Pass the missing names with localns= or globalns=.',
    },
    {
      q: 'How do I get the type inside list[int] or Optional[str]?',
      a: 'get_args(): get_args(list[int]) is (int,), get_args(Optional[str]) is (str, NoneType). get_origin() gives the outer part: list, or typing.Union for Optional.',
    },
    {
      q: 'What is typing.ForwardRef?',
      a: 'The object typing uses for a string annotation inside a typing construct: List["Node"] stores ForwardRef("Node") until get_type_hints() evaluates it. You rarely create one yourself.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.get_type_hints',
    meta:  'typing.get_type_hints',
  },

};
