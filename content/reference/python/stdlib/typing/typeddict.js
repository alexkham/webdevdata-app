// content/reference/python/stdlib/typing/typeddict.js — TypedDict, Required, NotRequired, ReadOnly

export const meta = {
  slug:        'typeddict',
  name:        'typing.TypedDict / Required / NotRequired / ReadOnly',
  signature:   'class Name(TypedDict, total=True): key: T · Required[T] · NotRequired[T] · ReadOnly[T]',
  blurb:       'Describe the keys and value types of a dict — typically JSON data. At runtime a TypedDict class just builds ordinary dicts; Required, NotRequired and ReadOnly (3.13) mark individual keys.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.8+ (Required/NotRequired 3.11, ReadOnly 3.13)',
  searchTerms: 'typing.TypedDict TypedDict Required NotRequired ReadOnly typed dictionary json schema dict keys type hint total=False optional keys __required_keys__ __optional_keys__ __readonly_keys__ Unpack kwargs pep 589 pep 655 pep 705 TypedDict does not support instance and class checks',
};

export const method = {
  slug:      'typeddict',
  name:      'typing.TypedDict / Required / NotRequired / ReadOnly',
  signature: 'class Name(TypedDict, total=True): key: T · Required[T] · NotRequired[T] · ReadOnly[T]',
  returns:   { type: 'type (instances are dict)', desc: 'A class whose call returns a plain dict. __required_keys__, __optional_keys__, __readonly_keys__ and __mutable_keys__ describe the keys.' },

  category:    'typing data shapes',
  version:     'Python 3.8+ (Required/NotRequired 3.11, ReadOnly 3.13)',
  hasLiveDemo: true,

  subtitle: 'Movie(title="Alien", year=1979) returns {"title": "Alien", "year": 1979} — a dict, not a Movie. Wrong value types and missing keys are not detected at runtime; the type checker reports them. TypedDict is the type of dict-shaped data, not a container class.',

  covers: ['TypedDict', 'Required', 'NotRequired', 'ReadOnly'],

  cheat: {
    commonCall: 'class Movie(TypedDict):\n    title: str\n    year: NotRequired[int]',
    returns:    "Movie(title='Alien') → {'title': 'Alien'} (a dict)",
    replaces:   'dict[str, Any] for JSON objects with a known shape',
    watchOut:   'isinstance(x, Movie) raises TypeError',
  },

  parameters: [
    { name: 'total',      type: 'bool', required: false, default: 'True', desc: 'False makes every key of this class optional unless marked Required.' },
    { name: 'Required',   type: 'special form', required: false, default: null, desc: 'Required[T]: this key must be present, even in a total=False TypedDict (3.11+).' },
    { name: 'NotRequired', type: 'special form', required: false, default: null, desc: 'NotRequired[T]: this key may be missing (3.11+).' },
    { name: 'ReadOnly',   type: 'special form', required: false, default: null, desc: 'ReadOnly[T]: type checkers reject assignments to this key (3.13+).' },
  ],

  modes: [
    {
      id: 'create',
      label: 'build a Movie',
      blurb: 'Pass any values — numbers or text. The result is an ordinary dict, whatever the annotations say.',
      params: [
        { name: 'title', type: 'any', hint: 'hint: str', input: 'auto' },
        { name: 'year',  type: 'any', hint: 'hint: int', input: 'auto' },
      ],
      template: 'from typing import TypedDict\nclass Movie(TypedDict):\n    title: str\n    year: int\nMovie(title={$title}, year={$year})',
      cases: [
        { id: 'ok',      label: 'matching types', values: { title: 'Alien', year: '1979' } },
        { id: 'swapped', label: 'wrong types',    values: { title: '1979', year: 'Alien' } },
        { id: 'float',   label: 'a float year',   values: { title: 'Heat', year: '1995.5' } },
      ],
    },
  ],
  demoExplainer: 'Every case returns a dict with the two keys in the order given. The "wrong types" case swaps an int into title and a str into year, and Python builds the dict anyway: TypedDict annotations are read by type checkers, never by the class call.',

  patterns: [
    {
      name: 'Type a JSON payload',
      desc: 'json.loads returns Any; annotate the variable with the TypedDict.',
      code: 'import json\nfrom typing import NotRequired, TypedDict\n\nclass User(TypedDict):\n    id: int\n    name: str\n    email: NotRequired[str]\n\nuser: User = json.loads(\'{"id": 1, "name": "Ada"}\')',
    },
    {
      name: 'Keys that are not identifiers',
      desc: 'The functional syntax accepts any string keys.',
      code: 'from typing import TypedDict\n\nHeaders = TypedDict("Headers", {"content-type": str, "x-request-id": str})',
    },
    {
      name: 'Typed **kwargs',
      desc: 'Unpack[TD] lists the allowed keyword arguments.',
      code: 'from typing import TypedDict, Unpack\n\nclass Options(TypedDict, total=False):\n    timeout: float\n    retries: int\n\ndef fetch(url: str, **opts: Unpack[Options]) -> bytes:\n    ...',
    },
    {
      name: 'Read-only keys (3.13)',
      desc: 'The checker rejects assignments to id.',
      code: 'from typing import ReadOnly, TypedDict\n\nclass Record(TypedDict):\n    id: ReadOnly[int]\n    note: str',
    },
  ],

  examples: [
    { title: 'Instances are plain dicts', code: "from typing import TypedDict\nclass Movie(TypedDict):\n    title: str\n    year: int\nm = Movie(title='Blade Runner', year=1982)\n(m, type(m))", returns: "({'title': 'Blade Runner', 'year': 1982}, <class 'dict'>)" },
    { title: 'Missing keys are not detected', code: "from typing import TypedDict\nclass Movie(TypedDict):\n    title: str\n    year: int\nMovie(title='Alien')", returns: "{'title': 'Alien'}" },
    { title: 'NotRequired and ReadOnly in the key sets', code: 'from typing import NotRequired, ReadOnly, TypedDict\nclass Movie(TypedDict):\n    title: str\n    year: NotRequired[int]\n    id: ReadOnly[int]\n(sorted(Movie.__required_keys__), sorted(Movie.__optional_keys__), sorted(Movie.__readonly_keys__))', returns: "(['id', 'title'], ['year'], ['id'])" },
    { title: 'total=False with a Required key', code: 'from typing import Required, TypedDict\nclass Movie(TypedDict, total=False):\n    title: Required[str]\n    year: int\n(sorted(Movie.__required_keys__), sorted(Movie.__optional_keys__))', returns: "(['title'], ['year'])" },
    { title: 'get_type_hints strips the qualifiers', code: 'from typing import NotRequired, TypedDict, get_type_hints\nclass Movie(TypedDict):\n    title: str\n    year: NotRequired[int]\n(get_type_hints(Movie), get_type_hints(Movie, include_extras=True)["year"])', returns: "({'title': <class 'str'>, 'year': <class 'int'>}, typing.NotRequired[int])" },
    { title: 'Functional syntax for any key', code: "from typing import TypedDict\nPoint = TypedDict('Point', {'in': int, 'x-y': int})\nPoint(**{'in': 1, 'x-y': 2})", returns: "{'in': 1, 'x-y': 2}" },
    { title: 'isinstance is not supported', code: 'from typing import TypedDict\nclass Movie(TypedDict):\n    title: str\nisinstance({}, Movie)', returns: 'TypeError: TypedDict does not support instance and class checks' },
  ],

  pitfalls: [
    {
      name: 'Checking a dict with isinstance',
      desc: 'A TypedDict is not a runtime class of its values. Compare the keys instead (and check value types if needed).',
      wrong: { label: 'isinstance', code: "from typing import TypedDict\nclass Movie(TypedDict):\n    title: str\n    year: int\nisinstance({'title': 'Alien', 'year': 1979}, Movie)", output: 'TypeError: TypedDict does not support instance and class checks' },
      fix:   { label: 'compare keys', code: "from typing import TypedDict\nclass Movie(TypedDict):\n    title: str\n    year: int\ndata = {'title': 'Alien'}\nmissing = Movie.__required_keys__ - data.keys()\nsorted(missing)", output: "['year']" },
    },
    {
      name: 'The keyword-argument syntax (removed in 3.13)',
      desc: 'Support for TypedDict("Movie", title=str) was removed in 3.13. Pass a dict of fields.',
      wrong: { label: 'keywords', code: "from typing import TypedDict\nMovie = TypedDict('Movie', title=str, year=int)", output: "TypeError: TypedDict() got an unexpected keyword argument 'title'" },
      fix:   { label: 'a dict', code: "from typing import TypedDict\nMovie = TypedDict('Movie', {'title': str, 'year': int})\nMovie(title='Alien', year=1979)", output: "{'title': 'Alien', 'year': 1979}" },
    },
    {
      name: 'Inheriting from a regular class',
      desc: 'A TypedDict may only inherit from other TypedDicts (and Generic). Mixins with methods are rejected.',
      wrong: { label: 'mixin base', code: 'from typing import TypedDict\nclass Base:\n    pass\nclass Movie(TypedDict, Base):\n    title: str', output: 'TypeError: cannot inherit from both a TypedDict type and a non-TypedDict base class' },
      fix:   { label: 'TypedDict bases only', code: 'from typing import TypedDict\nclass Base(TypedDict):\n    id: int\nclass Movie(Base):\n    title: str\nsorted(Movie.__required_keys__)', output: "['id', 'title']" },
    },
  ],

  when: {
    use: [
      'JSON objects and other dict data from APIs, configs and databases',
      'Typed **kwargs with Unpack[...]',
      'Gradually typing code that passes dicts around',
    ],
    avoid: [
      'Objects with behaviour or attribute access → a dataclass or NamedTuple',
      'Runtime validation → check keys and values yourself or use a validation library',
      'Arbitrary keys of one type → dict[str, T]',
    ],
  },

  notes: {
    cpython:       'Lib/typing.py: TypedDict is a function since 3.9 (usable as a base class through __mro_entries__); classes are built by _TypedDictMeta, and instances are exactly dict',
    'Key sets':    '__required_keys__, __optional_keys__ (3.9), __readonly_keys__ and __mutable_keys__ (3.13) are frozensets — sort them before printing',
    'String annotations': 'Under from __future__ import annotations the key sets may be wrong, because Required/NotRequired are not evaluated when the class is created (the docs warn about this)',
  },

  related: [
    { name: 'NamedTuple', slug: 'namedtuple', when: 'Typed records with attribute access' },
    { name: 'TypeVar / Unpack', slug: 'typevar', when: 'Unpack[TD] for **kwargs' },
    { name: 'get_type_hints / is_typeddict', slug: 'get_type_hints', when: 'Introspect TypedDicts' },
    { name: 'json module', slug: 'json', when: 'Where dict-shaped data comes from', category: 'stdlib' },
    { name: 'dict', slug: 'dict', when: 'What a TypedDict instance really is', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between TypedDict and dataclass?',
      a: 'A TypedDict only describes dicts: the values stay plain dict objects, accessed with d["key"], ideal for JSON. A dataclass is a real class: instances have attributes, methods and their own type, and need converting to and from dicts.',
    },
    {
      q: 'Does TypedDict validate the data?',
      a: 'No. Movie(title=3) returns {"title": 3} and missing keys go unnoticed. Type checkers verify code that builds or reads the dicts; data arriving at runtime needs its own checks.',
    },
    {
      q: 'How do I make a TypedDict key optional?',
      a: 'Mark it NotRequired[T] (3.11+), or declare the class with total=False and mark the mandatory keys Required[T]. An optional key may be missing; to allow None as a value, use T | None instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.TypedDict',
    meta:  'typing.TypedDict',
  },

};
