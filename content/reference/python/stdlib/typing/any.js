// content/reference/python/stdlib/typing/any.js — Any, Never, NoReturn, Self, LiteralString

export const meta = {
  slug:        'any',
  name:        'typing.Any / Never / NoReturn / Self / LiteralString',
  signature:   'Any · Never · NoReturn · Self · LiteralString',
  blurb:       'The special types that take no brackets: Any switches type checking off, Never/NoReturn is the type with no values (functions that never return), Self is "the class of self", LiteralString is a str written literally in the source.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.5+ (Never, Self, LiteralString 3.11+)',
  searchTerms: 'typing.Any Any Never NoReturn Self LiteralString any type vs object bottom type function never returns raises sys.exit return self fluent interface classmethod constructor sql injection literal string pep 673 pep 675 escape hatch dynamic typing',
};

export const method = {
  slug:      'any',
  name:      'typing.Any / Never / NoReturn / Self / LiteralString',
  signature: 'Any · Never · NoReturn · Self · LiteralString',
  returns:   { type: 'typing._SpecialForm (Any: a class)', desc: 'Never, NoReturn, Self and LiteralString are _SpecialForm objects; Any is a class (metaclass _AnyMeta) since 3.11.' },

  category:    'typing special types',
  version:     'Python 3.5+ (Never, Self, LiteralString 3.11+)',
  hasLiveDemo: true,

  subtitle: 'They are used bare — Any[int] or Self[int] is an error — and at runtime they are inert markers: isinstance() refuses them and nothing is checked. What they mean is entirely up to the type checker.',

  covers: ['Any', 'Never', 'NoReturn', 'Self', 'LiteralString'],

  cheat: {
    commonCall: 'def load(raw: str) -> Any: ... · def fail(msg: str) -> Never: ... · def copy(self) -> Self: ...',
    returns:    'typing.Any, typing.Never, typing.NoReturn, typing.Self, typing.LiteralString',
    replaces:   'TypeVar("T", bound="Base") on self (→ Self); NoReturn (→ Never, same meaning)',
    watchOut:   'Any disables checking; object is the type-safe "anything"',
  },

  parameters: [],

  modes: [
    {
      id: 'evaluate',
      label: 'evaluate',
      blurb: 'Type a hint using the special types. They combine with other hints but take no arguments themselves.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'any',    label: 'list[Any]',      values: { hint: 'list[Any]' } },
        { id: 'anyor',  label: 'Any | None',     values: { hint: 'Any | None' } },
        { id: 'never',  label: 'Never | None',   values: { hint: 'Never | None' } },
        { id: 'self',   label: 'Optional[Self]', values: { hint: 'Optional[Self]' } },
        { id: 'anysub', label: 'Any[int]',       values: { hint: 'Any[int]' } },
        { id: 'selfsub', label: 'Self[int]',     values: { hint: 'Self[int]' } },
      ],
    },
  ],
  demoExplainer: 'Any is a class, so Any | None is built by type.__or__ and prints as the types.UnionType "typing.Any | None"; Never is a special form, so Never | None goes through typing.Union and prints as typing.Optional[typing.Never]. Neither accepts brackets — Any[int] raises "type \'Any\' is not subscriptable", Self[int] raises "typing.Self is not subscriptable".',

  patterns: [
    {
      name: 'Self for fluent methods and alternative constructors',
      desc: 'Subclasses get their own type back, without a TypeVar.',
      code: 'from typing import Self\n\nclass Query:\n    def where(self, cond: str) -> Self:\n        self.conds.append(cond)\n        return self\n\n    @classmethod\n    def empty(cls) -> Self:\n        return cls()',
    },
    {
      name: 'A function that never returns',
      desc: 'Never (or NoReturn) tells the checker code after the call is unreachable.',
      code: 'import sys\nfrom typing import Never\n\ndef die(msg: str) -> Never:\n    print(msg, file=sys.stderr)\n    raise SystemExit(1)',
    },
    {
      name: 'Untyped boundary: Any',
      desc: 'JSON and other dynamic data: Any lets you use the value freely — so validate it.',
      code: 'import json\nfrom typing import Any\n\ndef load(text: str) -> Any:\n    return json.loads(text)',
    },
    {
      name: 'Only literal SQL',
      desc: 'LiteralString rejects (in the checker) strings built from user input.',
      code: 'from typing import LiteralString\n\ndef run_query(sql: LiteralString, *params: object) -> None:\n    ...',
    },
  ],

  examples: [
    { title: 'isinstance refuses Any', code: 'from typing import Any\nisinstance(3, Any)', returns: 'TypeError: typing.Any cannot be used with isinstance()' },
    { title: 'Any cannot be instantiated', code: 'from typing import Any\nAny()', returns: 'TypeError: Any cannot be instantiated' },
    { title: 'Any as a base class (3.11+)', code: 'from typing import Any\nclass Mock(Any):\n    pass\nMock.__mro__', returns: "(<class '__main__.Mock'>, typing.Any, <class 'object'>)" },
    { title: 'Never and NoReturn: same meaning, different objects', code: 'from typing import Never, NoReturn\n(Never is NoReturn, Never == NoReturn)', returns: '(False, False)' },
    { title: 'A Never function simply raises', code: "from typing import Never\ndef stop() -> Never:\n    raise RuntimeError('no way')\nstop()", returns: 'RuntimeError: no way' },
    { title: 'Self in the hints of a method', code: 'from typing import Self, get_type_hints\nclass Node:\n    def copy(self) -> Self:\n        return self\nget_type_hints(Node.copy)', returns: "{'return': typing.Self}" },
    { title: 'LiteralString is not checkable', code: "from typing import LiteralString\nisinstance('SELECT 1', LiteralString)", returns: 'TypeError: typing.LiteralString cannot be used with isinstance()' },
  ],

  pitfalls: [
    {
      name: 'Testing "is it anything" with Any',
      desc: 'Any is for type checkers only. At runtime every value is an object.',
      wrong: { label: 'isinstance(x, Any)', code: 'from typing import Any\nisinstance(None, Any)', output: 'TypeError: typing.Any cannot be used with isinstance()' },
      fix:   { label: 'isinstance(x, object)', code: 'isinstance(None, object)', output: 'True' },
    },
    {
      name: 'Recognising "never returns" by comparing with one name',
      desc: 'Code that inspects return hints must accept both spellings: Never and NoReturn are separate objects.',
      wrong: { label: '== NoReturn', code: 'from typing import Never, NoReturn, get_type_hints\ndef stop() -> Never:\n    raise SystemExit\nget_type_hints(stop)["return"] == NoReturn', output: 'False' },
      fix:   { label: 'in (Never, NoReturn)', code: 'from typing import Never, NoReturn, get_type_hints\ndef stop() -> Never:\n    raise SystemExit\nget_type_hints(stop)["return"] in (Never, NoReturn)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Any: values that are genuinely dynamic (parsed JSON, plugin hooks) and gradual typing of old code',
      'Never/NoReturn: functions that always raise or exit, and parameters that must never receive a value',
      'Self: methods returning self, classmethod constructors, __enter__',
      'LiteralString: APIs that must only receive strings written in the source (SQL, shell commands)',
    ],
    avoid: [
      'Any for "accepts anything" → object, which keeps type checking on',
      'Self on a method that returns a new instance of the base class only → the class name',
      'Any, Never, Self, LiteralString with isinstance() → TypeError',
    ],
  },

  notes: {
    cpython:     'Lib/typing.py: Any is class Any(metaclass=_AnyMeta) — subclassable since 3.11; Never, NoReturn, Self and LiteralString are _SpecialForm objects whose __getitem__ raises "is not subscriptable"',
    'Versions':  'NoReturn 3.6.2; Never, Self and LiteralString 3.11. For older versions the typing_extensions package provides them',
    'Never vs NoReturn': 'Type checkers treat them identically; Never reads better for parameters and return types alike',
  },

  related: [
    { name: 'assert_never / cast / reveal_type', slug: 'cast', when: 'assert_never takes a Never argument' },
    { name: 'Optional / Union', slug: 'optional', when: 'Combine these types with others' },
    { name: 'TypeVar / Generic', slug: 'typevar', when: 'What Self replaces' },
    { name: 'object', slug: 'object', when: 'The type-safe "any value"', category: 'functions' },
    { name: 'raise', slug: 'raise', when: 'How a Never function ends', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What is the difference between Any and object in Python type hints?',
      a: 'Both accept every value, but the type checker treats them oppositely afterwards. With object it allows only what every object supports, so you must narrow (isinstance) before using the value. With Any it allows everything and checks nothing — Any is assignable to every type and every type to Any.',
    },
    {
      q: 'Never or NoReturn?',
      a: 'They mean the same thing to type checkers — the type with no values. NoReturn exists since 3.6.2, Never since 3.11; Never is the more general name because it also fits parameters (def never_call_me(arg: Never)).',
    },
    {
      q: 'When should I use typing.Self?',
      a: 'When a method returns self (or cls() in a classmethod), so that subclasses get their own type back. It is shorter than a TypeVar bound to the class. Self needs Python 3.11+ (typing_extensions for older versions).',
    },
    {
      q: 'What is LiteralString for?',
      a: 'Security-sensitive APIs such as SQL execution: a LiteralString parameter accepts string literals and strings composed only of literals, and the type checker reports f-strings or concatenations containing arbitrary str values — the typical SQL-injection mistakes. At runtime it is an ordinary str.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#special-types',
    meta:  'typing — Special types',
  },

};
