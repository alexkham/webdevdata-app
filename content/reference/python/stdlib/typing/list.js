// content/reference/python/stdlib/typing/list.js — deprecated aliases of concrete classes

export const meta = {
  slug:        'list',
  name:        'typing.List / Dict / Tuple …',
  signature:   'List[T] · Dict[K, V] · Set[T] · FrozenSet[T] · Tuple[T, ...] · Type[C] · Deque[T] · DefaultDict[K, V] · OrderedDict[K, V] · Counter[T] · ChainMap[K, V] · Pattern[AnyStr] · Match[AnyStr] · Text',
  blurb:       'Deprecated since Python 3.9: the typing copies of list, dict, set, frozenset, tuple, type, the collections classes and re.Pattern / re.Match. Subscript the real classes instead: list[int], dict[str, int].',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5+ (deprecated since 3.9)',
  searchTerms: 'typing.List List typing.Dict Dict Set FrozenSet Tuple Type Deque DefaultDict OrderedDict Counter ChainMap Match Pattern Text typing list vs list deprecated alias pep 585 builtin generics list[int] dict[str, int] tuple[int, ...] cannot be instantiated',
};

export const method = {
  slug:      'list',
  name:      'typing.List / Dict / Tuple …',
  signature: 'List[T] · Dict[K, V] · Set[T] · FrozenSet[T] · Tuple[T, ...] · Type[C] · Deque[T] · DefaultDict[K, V] · OrderedDict[K, V] · Counter[T] · ChainMap[K, V] · Pattern[AnyStr] · Match[AnyStr] · Text',
  returns:   { type: 'typing._GenericAlias', desc: 'Subscripting gives an alias object that remembers its origin class and its arguments; it checks nothing at runtime.' },

  category:    'typing deprecated aliases',
  version:     'Python 3.5+ (deprecated since 3.9)',
  hasLiveDemo: true,

  subtitle: 'Before Python 3.9 you could not write list[int], so typing shipped capitalised stand-ins. Since 3.9 (PEP 585) the real classes take subscripts and these aliases are deprecated — kept working, without warnings, for old code.',

  covers: ['List', 'Dict', 'Set', 'FrozenSet', 'Tuple', 'Type', 'Deque', 'DefaultDict', 'OrderedDict', 'Counter', 'ChainMap', 'Match', 'Pattern', 'Text'],

  cheat: {
    commonCall: 'list[int], dict[str, int], tuple[int, ...]',
    returns:    'typing.List[int] → a typing._GenericAlias; list[int] → a types.GenericAlias',
    replaces:   'List → list, Dict → dict, Set → set, FrozenSet → frozenset, Tuple → tuple, Type → type, Deque/DefaultDict/OrderedDict/Counter/ChainMap → collections.*, Pattern/Match → re.*, Text → str',
    watchOut:   'List[int] == list[int] is False — same meaning, different objects',
  },

  parameters: [
    { name: 'T',    type: 'type', required: true, default: null, desc: 'The item type: List[int], Set[str], Deque[bytes], Counter[str].' },
    { name: 'K',    type: 'type', required: true, default: null, desc: 'The key type of Dict, DefaultDict, OrderedDict and ChainMap.' },
    { name: 'V',    type: 'type', required: true, default: null, desc: 'The value type of the mapping aliases.' },
    { name: 'C',    type: 'class', required: true, default: null, desc: 'Type[C]: the class object itself, not an instance — Type[int] is the type of int.' },
    { name: 'AnyStr', type: 'str | bytes', required: true, default: null, desc: 'Pattern[str] / Match[bytes]: the kind of string the regular expression works on.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'evaluate',
      blurb: 'Type a hint using either spelling. The typing aliases check how many arguments they get; the builtin classes do not.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'old',   label: 'List[int]',       values: { hint: 'List[int]' } },
        { id: 'new',   label: 'list[int]',       values: { hint: 'list[int]' } },
        { id: 'many',  label: 'List[int, str]',  values: { hint: 'List[int, str]' } },
        { id: 'many2', label: 'list[int, str]',  values: { hint: 'list[int, str]' } },
        { id: 'tuple', label: 'Tuple[int, ...]', values: { hint: 'Tuple[int, ...]' } },
        { id: 'text',  label: 'Text',            values: { hint: 'Text' } },
      ],
    },
    {
      id: 'compare',
      label: 'compare',
      blurb: 'Are two hints equal objects? Old and new spellings mean the same to a type checker, but they are not == at runtime.',
      params: [
        { name: 'a', type: 'str', hint: 'first hint', input: 'text' },
        { name: 'b', type: 'str', hint: 'second hint', input: 'text' },
      ],
      template: "from typing import *\ndef f(a: {$a}, b: {$b}): pass\nhints = get_type_hints(f)\nhints['a'] == hints['b']",
      cases: [
        { id: 'mixed', label: 'List vs list',  values: { a: 'List[int]', b: 'list[int]' } },
        { id: 'same',  label: 'Dict vs Dict',  values: { a: 'Dict[str, int]', b: 'Dict[str, int]' } },
        { id: 'text',  label: 'Text vs str',   values: { a: 'Text', b: 'str' } },
      ],
    },
    {
      id: 'originArgs',
      label: 'origin & args',
      blurb: 'get_origin() and get_args() take a hint apart. Both spellings have the same origin and arguments.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nhint = get_type_hints(f)['x']\n(get_origin(hint), get_args(hint))",
      cases: [
        { id: 'list',    label: 'List[int]',          values: { hint: 'List[int]' } },
        { id: 'deque',   label: 'Deque[str]',         values: { hint: 'Deque[str]' } },
        { id: 'default', label: 'DefaultDict[str, list[int]]', values: { hint: 'DefaultDict[str, list[int]]' } },
        { id: 'pattern', label: 'Pattern[bytes]',     values: { hint: 'Pattern[bytes]' } },
      ],
    },
  ],
  demoExplainer: 'List[int, str] is rejected with "Too many arguments for typing.List; actual 2, expected 1", but list[int, str] is accepted: the builtin classes do not count arguments at runtime, so only a type checker reports that mistake. Text is not a generic at all — it is the str class itself. In compare, List[int] == list[int] is False although get_origin and get_args give the same answers for both.',

  patterns: [
    {
      name: 'Modern replacements',
      desc: 'The same hints with the builtin and collections classes (Python 3.9+).',
      code: 'from collections import Counter, defaultdict, deque\nimport re\n\ndef index(words: list[str]) -> dict[str, int]: ...\ndef group(rows: tuple[str, ...]) -> defaultdict[str, list[str]]: ...\ndef recent(n: int) -> deque[str]: ...\ndef tally(text: str) -> Counter[str]: ...\ndef compile_all(p: list[str]) -> list[re.Pattern[str]]: ...',
    },
    {
      name: 'Code that must still run on 3.8',
      desc: 'Keep the typing aliases, or quote the hints with from __future__ import annotations so list[int] is never evaluated.',
      code: 'from __future__ import annotations\n\ndef index(words: list[str]) -> dict[str, int]:\n    ...',
    },
    {
      name: 'A class object as a parameter',
      desc: 'type[C] (was Type[C]): pass the class, not an instance.',
      code: 'def make(cls: type[Exception], msg: str) -> Exception:\n    return cls(msg)',
    },
  ],

  examples: [
    { title: 'Same origin and arguments', code: 'from typing import List, get_args, get_origin\n(get_origin(List[int]), get_args(List[int]) == get_args(list[int]))', returns: "(<class 'list'>, True)" },
    { title: 'But not equal objects', code: 'from typing import List\nList[int] == list[int]', returns: 'False' },
    { title: 'Text is simply str', code: 'from typing import Text\nText is str', returns: 'True' },
    { title: 'Collection aliases can build instances', code: "from typing import Counter\nCounter[str]('hello')", returns: "Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})" },
    { title: 'Builtin aliases cannot', code: 'from typing import List\nList[int]()', returns: 'TypeError: Type List cannot be instantiated; use list() instead' },
    { title: 'The bare alias works with isinstance', code: 'from typing import List\nisinstance([1, 2], List)', returns: 'True' },
    { title: 'A subscripted one does not', code: 'from typing import List\nisinstance([1, 2], List[int])', returns: 'TypeError: Subscripted generics cannot be used with class and instance checks' },
    { title: 'Subscripts are cached', code: 'from typing import List\n(List[int] is List[int], list[int] is list[int])', returns: '(True, False)' },
  ],

  pitfalls: [
    {
      name: 'Instantiating the typing alias',
      desc: 'typing.List, Dict, Set, FrozenSet, Tuple and Type refuse to build objects. Annotate the variable and use the real class.',
      wrong: { label: 'List[int]()', code: 'from typing import List\nitems = List[int]()', output: 'TypeError: Type List cannot be instantiated; use list() instead' },
      fix:   { label: 'list[int] hint, [] value', code: 'items: list[int] = []\nitems.append(1)\nitems', output: '[1]' },
    },
    {
      name: 'Comparing hints across spellings',
      desc: 'Code that inspects hints (serializers, CLI builders) must not compare hint objects with ==. Compare origin and arguments instead.',
      wrong: { label: '==', code: 'from typing import List\nhint = List[int]\nhint == list[int]', output: 'False' },
      fix:   { label: 'get_origin / get_args', code: 'from typing import List, get_args, get_origin\nhint = List[int]\nget_origin(hint) is list and get_args(hint) == (int,)', output: 'True' },
    },
    {
      name: 'tuple[int] means exactly one int',
      desc: 'Tuple hints list every position. For "any number of ints" add ... — visible in get_args.',
      wrong: { label: 'tuple[int]', code: 'from typing import get_args\nget_args(tuple[int])', output: "(<class 'int'>,)" },
      fix:   { label: 'tuple[int, ...]', code: 'from typing import get_args\nget_args(tuple[int, ...])', output: "(<class 'int'>, Ellipsis)" },
    },
  ],

  when: {
    use: [
      'Maintaining code that must run on Python 3.8 or older',
      'Reading older code bases — the meaning is the same as the builtin spelling',
    ],
    avoid: [
      'New code on 3.9+ → list[int], dict[str, int], set[str], tuple[int, ...], type[C]',
      'collections.deque / defaultdict / OrderedDict / Counter / ChainMap → subscript them directly',
      'typing.Text → str',
    ],
  },

  notes: {
    cpython:       'Lib/typing.py: the bare aliases are typing._SpecialGenericAlias objects (Tuple is a _TupleType); subscripting them returns a cached typing._GenericAlias, so List[int] is List[int]. list[int] is a fresh types.GenericAlias each time',
    'Deprecation': 'Deprecated since 3.9 (PEP 585) but no DeprecationWarning is issued; the docs guarantee them until at least 3.14 and promise two releases of warnings before any removal. Text is deprecated since 3.11',
    'Arity':       'The typing aliases check the number of arguments (List takes 1, Dict takes 2); the builtin classes accept any number at runtime',
  },

  related: [
    { name: 'Iterable / Sequence / Mapping …', slug: 'iterable', when: 'The abstract collection aliases — prefer them for parameters' },
    { name: 'get_type_hints / get_origin / get_args', slug: 'get_type_hints', when: 'Take hints apart at runtime' },
    { name: 'list', slug: 'list', when: 'The class that replaced typing.List', category: 'functions' },
    { name: 'dict', slug: 'dict', when: 'The class that replaced typing.Dict', category: 'functions' },
    { name: 'collections module', slug: 'collections', when: 'deque, defaultdict, Counter … subscriptable since 3.9', category: 'stdlib' },
    { name: 'typing module', slug: 'typing', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is typing.List deprecated?',
      a: 'Yes, since Python 3.9, together with Dict, Set, FrozenSet, Tuple, Type, the collections aliases and Pattern/Match. The interpreter issues no warning, and the docs promise they stay without warnings until at least Python 3.14. Use list[int] and friends in new code.',
    },
    {
      q: 'What is the difference between List and list in type hints?',
      a: 'To a type checker, nothing: List[int] and list[int] mean the same. At runtime they are different objects (a typing._GenericAlias and a types.GenericAlias), they are not ==, and only typing.List checks the number of arguments.',
    },
    {
      q: 'Why does List[int]() raise "Type List cannot be instantiated"?',
      a: 'The aliases of builtin classes refuse to create instances and tell you to call list() instead. The aliases of collections classes (Deque, DefaultDict, OrderedDict, Counter, ChainMap) do create instances of the real class.',
    },
    {
      q: 'How do I annotate a tuple of any length?',
      a: 'tuple[int, ...] — the ellipsis means "any number of int". tuple[int] means a tuple of exactly one int, and tuple[int, str] exactly an int then a str.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#deprecated-aliases',
    meta:  'typing — Deprecated aliases',
  },

};
