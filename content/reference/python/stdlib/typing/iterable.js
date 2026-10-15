// content/reference/python/stdlib/typing/iterable.js — deprecated aliases of the collections.abc ABCs

export const meta = {
  slug:        'iterable',
  name:        'typing.Iterable / Sequence / Mapping …',
  signature:   'Iterable[T] · Iterator[T] · Collection[T] · Container[T] · Reversible[T] · Sequence[T] · MutableSequence[T] · AbstractSet[T] · MutableSet[T] · Mapping[K, V] · MutableMapping[K, V] · MappingView[T] · KeysView[K] · ItemsView[K, V] · ValuesView[V] · Hashable · Sized · ByteString',
  blurb:       'Deprecated aliases of the abstract base classes in collections.abc — Iterable, Sequence, Mapping and the rest. The abstract types are the right hints for parameters; import them from collections.abc instead.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5+ (deprecated since 3.9)',
  searchTerms: 'typing.Iterable Iterable Iterator Collection Container Reversible Sequence MutableSequence AbstractSet MutableSet Mapping MutableMapping MappingView KeysView ItemsView ValuesView Hashable Sized ByteString collections.abc abstract base class abc type hint parameter accept any iterable duck typing buffer',
};

export const method = {
  slug:      'iterable',
  name:      'typing.Iterable / Sequence / Mapping …',
  signature: 'Iterable[T] · Iterator[T] · Collection[T] · Container[T] · Reversible[T] · Sequence[T] · MutableSequence[T] · AbstractSet[T] · MutableSet[T] · Mapping[K, V] · MutableMapping[K, V] · MappingView[T] · KeysView[K] · ItemsView[K, V] · ValuesView[V] · Hashable · Sized · ByteString',
  returns:   { type: 'typing._GenericAlias', desc: 'Subscripting gives an alias whose origin is the collections.abc class.' },

  category:    'typing deprecated aliases',
  version:     'Python 3.5+ (deprecated since 3.9)',
  hasLiveDemo: true,

  subtitle: 'For a parameter, ask for what you use: Iterable if you only loop, Sequence if you index, Mapping if you look up keys. These typing names are deprecated aliases of the same classes in collections.abc — use those (collections.abc.Iterable[int]) since Python 3.9.',

  covers: ['Iterable', 'Iterator', 'Collection', 'Container', 'Reversible', 'Sequence', 'MutableSequence', 'AbstractSet', 'MutableSet', 'Mapping', 'MutableMapping', 'MappingView', 'KeysView', 'ItemsView', 'ValuesView', 'Hashable', 'Sized', 'ByteString'],

  cheat: {
    commonCall: 'from collections.abc import Iterable, Mapping, Sequence',
    returns:    'Sequence[int] → typing.Sequence[int] (origin collections.abc.Sequence)',
    replaces:   'typing.Iterable → collections.abc.Iterable, typing.AbstractSet → collections.abc.Set, typing.ByteString → collections.abc.Buffer or bytes | bytearray | memoryview',
    watchOut:   'str is a Sequence of str — a Sequence[str] parameter also accepts "abc"',
  },

  parameters: [
    { name: 'T', type: 'type', required: true, default: null, desc: 'The item type: Iterable[int], Sequence[str], AbstractSet[bytes].' },
    { name: 'K', type: 'type', required: true, default: null, desc: 'Key type of Mapping, MutableMapping, KeysView and ItemsView.' },
    { name: 'V', type: 'type', required: true, default: null, desc: 'Value type of Mapping, MutableMapping, ItemsView and ValuesView.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'evaluate',
      blurb: 'Type a hint built from the abstract aliases. Hashable, Sized and ByteString take no arguments; Mapping needs two.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'iter',  label: 'Iterable[int]',      values: { hint: 'Iterable[int]' } },
        { id: 'map',   label: 'Mapping[str, int]',  values: { hint: 'Mapping[str, int]' } },
        { id: 'few',   label: 'Mapping[str]',       values: { hint: 'Mapping[str]' } },
        { id: 'hash',  label: 'Hashable[int]',      values: { hint: 'Hashable[int]' } },
        { id: 'items', label: 'ItemsView[str, int]', values: { hint: 'ItemsView[str, int]' } },
      ],
    },
    {
      id: 'originArgs',
      label: 'origin & args',
      blurb: 'get_origin() shows that every alias stands for a class in collections.abc.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nhint = get_type_hints(f)['x']\n(get_origin(hint), get_args(hint))",
      cases: [
        { id: 'seq',  label: 'Sequence[int]',          values: { hint: 'Sequence[int]' } },
        { id: 'set',  label: 'AbstractSet[str]',       values: { hint: 'AbstractSet[str]' } },
        { id: 'mut',  label: 'MutableMapping[str, int]', values: { hint: 'MutableMapping[str, int]' } },
        { id: 'bare', label: 'Iterable (bare)',        values: { hint: 'Iterable' } },
      ],
    },
  ],
  demoExplainer: 'Mapping[str] fails with "Too few arguments for typing.Mapping; actual 1, expected 2", and Hashable[int] with "typing.Hashable is not a generic class": the aliases know how many type arguments their class takes. AbstractSet is typing\'s name for collections.abc.Set, because typing.Set is already taken by the alias of the builtin set. A bare alias such as Iterable still evaluates fine — its get_origin() is the ABC and get_args() is empty.',

  patterns: [
    {
      name: 'Accept any iterable',
      desc: 'Callers may pass a list, tuple, set, generator or dict keys.',
      code: 'from collections.abc import Iterable\n\ndef total(prices: Iterable[float]) -> float:\n    return sum(prices)',
    },
    {
      name: 'Read-only mapping parameter',
      desc: 'Mapping promises the function will not mutate it; dict, OrderedDict and MappingProxyType all qualify.',
      code: 'from collections.abc import Mapping\n\ndef render(template: str, values: Mapping[str, str]) -> str:\n    return template.format_map(values)',
    },
    {
      name: 'Return the concrete type, accept the abstract one',
      desc: 'Be liberal in parameters, precise in return values.',
      code: 'from collections.abc import Sequence\n\ndef top3(scores: Sequence[int]) -> list[int]:\n    return sorted(scores, reverse=True)[:3]',
    },
    {
      name: 'Bytes-like input (3.12+)',
      desc: 'collections.abc.Buffer replaces ByteString: anything that supports the buffer protocol.',
      code: 'from collections.abc import Buffer\n\ndef checksum(data: Buffer) -> int:\n    return sum(memoryview(data).cast("B"))',
    },
  ],

  examples: [
    { title: 'The bare alias does an ABC check', code: "from typing import Sequence\nisinstance('abc', Sequence)", returns: 'True' },
    { title: 'dict is a Mapping, not a Sequence', code: 'from typing import Mapping, Sequence\n(isinstance({}, Mapping), isinstance({}, Sequence))', returns: '(True, False)' },
    { title: 'range is a Sequence but not mutable', code: 'from typing import MutableSequence, Sequence\n(isinstance(range(3), Sequence), isinstance(range(3), MutableSequence))', returns: '(True, False)' },
    { title: 'dict.keys() is a set', code: 'from typing import AbstractSet\nisinstance({}.keys(), AbstractSet)', returns: 'True' },
    { title: 'Hashable and Sized take no arguments', code: 'from typing import Hashable\nHashable[int]', returns: 'TypeError: typing.Hashable is not a generic class' },
    { title: 'An abstract class cannot be instantiated', code: 'from typing import Sequence\nSequence[int]()', returns: "TypeError: Can't instantiate abstract class Sequence without an implementation for abstract methods '__getitem__', '__len__'" },
    { title: 'Not equal to the collections.abc spelling', code: 'import collections.abc\nfrom typing import Iterable\nIterable[int] == collections.abc.Iterable[int]', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'A str is a Sequence of str',
      desc: 'A function that wants several strings and is typed Sequence[str] still accepts one string — and iterates its characters. Neither Python nor the type checker objects. Reject str explicitly if it matters.',
      wrong: { label: 'Sequence[str]', code: 'from collections.abc import Sequence\ndef shout(words: Sequence[str]) -> list[str]:\n    return [w.upper() for w in words]\nshout("hi")', output: "['H', 'I']" },
      fix:   { label: 'reject str', code: 'from collections.abc import Sequence\ndef shout(words: Sequence[str]) -> list[str]:\n    if isinstance(words, str):\n        raise TypeError("expected a sequence of str, not a str")\n    return [w.upper() for w in words]\nshout("hi")', output: 'TypeError: expected a sequence of str, not a str' },
    },
    {
      name: 'isinstance with a parameterized ABC',
      desc: 'Only the bare class can be used in isinstance(); the item type is not checkable.',
      wrong: { label: 'Iterable[int]', code: 'from collections.abc import Iterable\nisinstance([1, 2], Iterable[int])', output: 'TypeError: isinstance() argument 2 cannot be a parameterized generic' },
      fix:   { label: 'Iterable', code: 'from collections.abc import Iterable\nisinstance([1, 2], Iterable)', output: 'True' },
    },
    {
      name: 'ByteString does not cover memoryview',
      desc: 'ByteString never matched memoryview and is deprecated. collections.abc.Buffer (3.12+) matches every bytes-like object.',
      wrong: { label: 'ByteString', code: 'from typing import ByteString\nisinstance(memoryview(b"ab"), ByteString)', output: 'False' },
      fix:   { label: 'Buffer', code: 'from collections.abc import Buffer\nisinstance(memoryview(b"ab"), Buffer)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Parameter hints: ask for the abstract capability (Iterable, Sequence, Mapping) instead of list or dict',
      'Runtime capability checks with the bare class: isinstance(x, Mapping)',
    ],
    avoid: [
      'Importing them from typing in 3.9+ code → from collections.abc import Iterable, Sequence, Mapping …',
      'ByteString → collections.abc.Buffer (3.12+) or bytes | bytearray | memoryview',
      'Return hints → return the concrete type (list[int], dict[str, int]) so callers get its methods',
    ],
  },

  notes: {
    cpython:        'Lib/typing.py: _SpecialGenericAlias objects wrapping the classes of Lib/_collections_abc.py; the number in each alias (Mapping 2, Sequence 1, Hashable 0) is what "Too few arguments" counts',
    'Deprecation':  'Deprecated since 3.9 like the other PEP 585 aliases (Hashable and Sized since 3.12). ByteString is deprecated since 3.9 and the docs list its removal for 3.17; CPython 3.13 warns on isinstance() checks against typing.ByteString',
    'AbstractSet':  'typing.AbstractSet is collections.abc.Set; typing.Set is the builtin set',
  },

  related: [
    { name: 'List / Dict / Tuple …', slug: 'list', when: 'The concrete-class aliases' },
    { name: 'Generator / Coroutine / AsyncIterator …', slug: 'generator', when: 'Generator, async and context-manager aliases' },
    { name: 'Protocol', slug: 'protocol', when: 'Define your own structural interface' },
    { name: 'isinstance()', slug: 'isinstance', when: 'Works with the bare ABCs', category: 'functions' },
    { name: 'collections module', slug: 'collections', when: 'The concrete containers', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Should I use typing.Iterable or collections.abc.Iterable?',
      a: 'collections.abc.Iterable. Since Python 3.9 the ABCs accept subscripts (Iterable[int]) and the typing versions are deprecated aliases of them.',
    },
    {
      q: 'When should a parameter be Sequence instead of list?',
      a: 'When the function only reads it by index and length. Sequence accepts lists, tuples, ranges and strings, and tells the caller (and the type checker) that the function will not append or modify it.',
    },
    {
      q: 'What is the difference between Iterable and Iterator?',
      a: 'An Iterable can be looped over (it has __iter__) — possibly many times, like a list. An Iterator is the one-pass object iter() returns: it has __next__ and is exhausted after one loop. Generators are Iterators.',
    },
    {
      q: 'What replaces typing.ByteString?',
      a: 'collections.abc.Buffer (Python 3.12+) for "anything bytes-like", or an explicit union such as bytes | bytearray | memoryview. ByteString is deprecated and never matched memoryview.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#aliases-to-container-abcs-in-collections-abc',
    meta:  'typing — Aliases to container ABCs in collections.abc',
  },

};
