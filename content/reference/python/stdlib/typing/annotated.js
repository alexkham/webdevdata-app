// content/reference/python/stdlib/typing/annotated.js

export const meta = {
  slug:        'annotated',
  name:        'typing.Annotated',
  signature:   'Annotated[T, metadata1, metadata2, ...]',
  blurb:       'Attach extra information to a type: Annotated[int, Range(0, 150)] is still int to the type checker, while libraries (validators, serializers, CLI and web frameworks) read the metadata at runtime.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'typing.Annotated Annotated metadata type hint __metadata__ include_extras get_type_hints validation constraints units pydantic fastapi field info pep 593 extra information',
};

export const method = {
  slug:      'annotated',
  name:      'typing.Annotated',
  signature: 'Annotated[T, metadata1, metadata2, ...]',
  returns:   { type: 'typing._AnnotatedAlias', desc: '__origin__ is T, __metadata__ the tuple of metadata; get_args() gives (T, *metadata).' },

  category:    'typing special form',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'The first argument is the type; everything after it is arbitrary Python objects that Python stores and never interprets. get_type_hints() strips the metadata unless you pass include_extras=True — the most common reason metadata "disappears".',

  covers: ['Annotated'],

  cheat: {
    commonCall: 'Age = Annotated[int, Range(0, 150)]',
    returns:    "Annotated[int, 'cm'] → typing.Annotated[int, 'cm']; .__metadata__ → ('cm',)",
    replaces:   'Custom markers in docstrings or parallel dicts of constraints',
    watchOut:   'get_type_hints(f) drops metadata — use include_extras=True',
  },

  parameters: [
    { name: 'T',         type: 'type',   required: true, default: null, desc: 'The actual type. Type checkers see only this.' },
    { name: 'metadata1', type: 'object', required: true, default: null, desc: 'Any objects: strings, numbers, instances of your own marker classes. Kept in order; duplicates are kept.' },
  ],

  modes: [
    {
      id: 'stripped',
      label: 'get_type_hints(f)',
      blurb: 'The default view: metadata removed, even when the Annotated is nested inside another hint.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'basic',  label: "Annotated[int, 'cm']",     values: { hint: "Annotated[int, 'cm']" } },
        { id: 'inner',  label: 'inside Optional',          values: { hint: "Optional[Annotated[int, 'cm']]" } },
        { id: 'list',   label: 'list[Annotated[...]]',     values: { hint: "list[Annotated[str, 'name', 50]]" } },
        { id: 'short',  label: 'Annotated[int]',           values: { hint: 'Annotated[int]' } },
      ],
    },
    {
      id: 'extras',
      label: 'include_extras=True',
      blurb: 'The same hint with include_extras=True: the metadata survives. Nested Annotated is flattened.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f, include_extras=True)['x']",
      cases: [
        { id: 'basic',  label: "Annotated[int, 'cm']",     values: { hint: "Annotated[int, 'cm']" } },
        { id: 'nested', label: 'nested',                   values: { hint: "Annotated[Annotated[int, 'a'], 'b']" } },
        { id: 'dups',   label: 'duplicates',               values: { hint: "Annotated[int, 'a', 'a']" } },
      ],
    },
    {
      id: 'originArgs',
      label: 'origin & args',
      blurb: 'get_origin() is Annotated itself; get_args() is the type followed by the metadata.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nhint = get_type_hints(f, include_extras=True)['x']\n(get_origin(hint), get_args(hint))",
      cases: [
        { id: 'basic', label: "Annotated[float, 'kg', 0]", values: { hint: "Annotated[float, 'kg', 0]" } },
        { id: 'plain', label: 'not annotated',            values: { hint: 'float' } },
      ],
    },
  ],
  demoExplainer: 'Without include_extras, get_type_hints() returns the bare type — and strips Annotated wherever it sits, so Optional[Annotated[int, \'cm\']] comes back as typing.Optional[int]. With include_extras=True the metadata stays; nested Annotated merge into one, innermost metadata first, and duplicates are kept. Annotated needs a type plus at least one annotation, otherwise: "Annotated[...] should be used with at least two arguments (a type and an annotation)."',

  patterns: [
    {
      name: 'Marker classes for your own metadata',
      desc: 'Frozen dataclasses make readable, comparable markers.',
      code: 'from dataclasses import dataclass\nfrom typing import Annotated\n\n@dataclass(frozen=True)\nclass Range:\n    lo: int\n    hi: int\n\nAge = Annotated[int, Range(0, 150)]\nPercent = Annotated[float, Range(0, 100)]',
    },
    {
      name: 'Read the metadata at runtime',
      desc: 'include_extras=True, then pick the markers you understand with isinstance.',
      code: 'from typing import get_type_hints\n\ndef constraints(func, name):\n    hint = get_type_hints(func, include_extras=True)[name]\n    return [m for m in getattr(hint, "__metadata__", ()) if isinstance(m, Range)]',
    },
    {
      name: 'Alias with a type parameter (3.12+)',
      desc: 'A reusable annotated shape.',
      code: 'from typing import Annotated\n\ntype Bounded[T] = Annotated[T, "bounded"]\n\ndef clamp(x: Bounded[int]) -> Bounded[int]:\n    return x',
    },
  ],

  examples: [
    { title: 'The metadata tuple', code: "from typing import Annotated\nAnnotated[int, 'cm', 'positive'].__metadata__", returns: "('cm', 'positive')" },
    { title: 'Stripped by default, kept on request', code: "from typing import Annotated, get_type_hints\ndef f(x: Annotated[int, 'm']): pass\n(get_type_hints(f)['x'], get_type_hints(f, include_extras=True)['x'])", returns: "(<class 'int'>, typing.Annotated[int, 'm'])" },
    { title: 'Nested Annotated flattens', code: "from typing import Annotated\nAnnotated[Annotated[int, 'a'], 'b']", returns: "typing.Annotated[int, 'a', 'b']" },
    { title: 'Metadata order matters for ==', code: "from typing import Annotated\nAnnotated[int, 'a', 'b'] == Annotated[int, 'b', 'a']", returns: 'False' },
    { title: 'Calling it builds the underlying type', code: "from typing import Annotated\nAnnotated[int, 'x']()", returns: '0' },
    { title: 'Find your own markers', code: "from dataclasses import dataclass\nfrom typing import Annotated, get_args\n@dataclass(frozen=True)\nclass Range:\n    lo: int\n    hi: int\nAge = Annotated[int, Range(0, 150), 'years']\n[m for m in get_args(Age)[1:] if isinstance(m, Range)]", returns: '[Range(lo=0, hi=150)]' },
    { title: 'A type and at least one annotation', code: 'from typing import Annotated\nAnnotated[int]', returns: 'TypeError: Annotated[...] should be used with at least two arguments (a type and an annotation).' },
  ],

  pitfalls: [
    {
      name: 'Reading hints without include_extras',
      desc: 'A tool that looks for its metadata finds nothing, because get_type_hints() stripped it.',
      wrong: { label: 'get_type_hints(f)', code: "from typing import Annotated, get_type_hints\ndef f(x: Annotated[int, 'cm']): pass\ngetattr(get_type_hints(f)['x'], '__metadata__', ())", output: '()' },
      fix:   { label: 'include_extras=True', code: "from typing import Annotated, get_type_hints\ndef f(x: Annotated[int, 'cm']): pass\ngetattr(get_type_hints(f, include_extras=True)['x'], '__metadata__', ())", output: "('cm',)" },
    },
    {
      name: 'Expecting the metadata to validate',
      desc: 'Annotated[int, Range(0, 150)] constrains nothing by itself — something has to read the Range and act on it.',
      wrong: { label: 'metadata only', code: 'from dataclasses import dataclass\nfrom typing import Annotated\n@dataclass(frozen=True)\nclass Range:\n    lo: int\n    hi: int\ndef set_age(age: Annotated[int, Range(0, 150)]) -> int:\n    return age\nset_age(-5)', output: '-5' },
      fix:   { label: 'read and check', code: "from dataclasses import dataclass\nfrom typing import Annotated, get_type_hints\n@dataclass(frozen=True)\nclass Range:\n    lo: int\n    hi: int\ndef set_age(age: Annotated[int, Range(0, 150)]) -> int:\n    return age\ndef call_checked(func, **kwargs):\n    hints = get_type_hints(func, include_extras=True)\n    for name, value in kwargs.items():\n        for m in getattr(hints[name], '__metadata__', ()):\n            if isinstance(m, Range) and not m.lo <= value <= m.hi:\n                raise ValueError(f'{name}={value} is outside {m.lo}..{m.hi}')\n    return func(**kwargs)\ncall_checked(set_age, age=-5)", output: 'ValueError: age=-5 is outside 0..150' },
    },
  ],

  when: {
    use: [
      'Libraries that derive behaviour from hints: validation, serialization, CLI arguments, dependency injection',
      'Units, ranges, formats and documentation that should travel with the type',
    ],
    avoid: [
      'Expecting Python or the type checker to enforce the metadata → nothing reads it unless a library does',
      'Metadata that changes the type itself → use a different type (NewType, a class)',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: Annotated is a _TypedCacheSpecialForm producing _AnnotatedAlias; _strip_annotations() in get_type_hints() removes it recursively unless include_extras=True',
    'Equality':   'Equal when origin and the metadata tuple are equal — order and duplicates count',
    'Runtime':    'Calling the alias calls the origin: Annotated[int, x]() is int()',
  },

  related: [
    { name: 'get_type_hints / get_origin / get_args', slug: 'get_type_hints', when: 'include_extras and taking hints apart' },
    { name: 'NewType', slug: 'newtype', when: 'A distinct type instead of a decorated one' },
    { name: 'TypedDict', slug: 'typeddict', when: 'Annotated keys with Required / ReadOnly' },
    { name: 'dataclasses module', slug: 'dataclasses', when: 'Frozen dataclasses as metadata markers', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is typing.Annotated used for?',
      a: 'To attach metadata to a type hint without changing the type: Annotated[int, Range(0, 150)] is an int for type checkers, while frameworks read Range at runtime to validate, document or convert values.',
    },
    {
      q: 'Why does get_type_hints() not show my Annotated metadata?',
      a: 'It strips Annotated by default. Call get_type_hints(obj, include_extras=True). The raw __annotations__ dict also keeps it.',
    },
    {
      q: 'How do I read the metadata of an Annotated type?',
      a: 'hint.__metadata__ gives the tuple of metadata, hint.__origin__ the underlying type; get_args(hint) returns both together as (type, *metadata).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.Annotated',
    meta:  'typing.Annotated',
  },

};
