// content/reference/python/stdlib/dataclasses/kw_only.js

export const meta = {
  slug:        'kw_only',
  name:        'dataclasses.KW_ONLY',
  signature:   '_: KW_ONLY',
  blurb:       'A marker annotation: every field after it is keyword-only in the generated __init__. The marker itself is not a field.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.10+',
  searchTerms: 'KW_ONLY dataclass keyword only fields python dataclasses.KW_ONLY _: KW_ONLY sentinel keyword-only arguments __init__ positional arguments takes 2 positional arguments but 3 were given is KW_ONLY but KW_ONLY has already been specified required field after default inheritance',
};

export const method = {
  slug:      'kw_only',
  name:      'dataclasses.KW_ONLY',
  signature: '_: KW_ONLY',
  returns:   { type: '_KW_ONLY_TYPE', desc: 'A sentinel object, only meaningful as the annotation of a dummy name in a dataclass body.' },

  category:    'dataclasses constant',
  version:     'Python 3.10+',
  hasLiveDemo: true,

  subtitle: 'Fields before the marker stay positional; fields after it must be passed by keyword and are left out of __match_args__. The usual name is _, which the decorator ignores entirely — no field, no attribute.',

  covers: ['KW_ONLY'],

  cheat: {
    commonCall: '_: KW_ONLY',
    returns:    'fields below it → keyword-only __init__ parameters',
    replaces:   'field(kw_only=True) on every following field',
    watchOut:   'only one marker per class; positional calls past it raise TypeError',
  },

  parameters: [],

  modes: [
    {
      id: 'positional',
      label: 'positional arguments',
      blurb: 'Only url is positional. Pass one, two or zero arguments positionally and see what the generated __init__ says.',
      params: [{ name: 'args', type: 'list[str]', hint: 'comma-separated positional args', input: 'csv' }],
      template: "from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Request:\n    url: str\n    _: KW_ONLY\n    timeout: float = 10.0\n    retries: int = 3\n\nRequest(*{$args})",
      cases: [
        { id: 'one',  label: 'url only',   values: { args: 'https://example.com' } },
        { id: 'two',  label: 'url, 5',     values: { args: 'https://example.com, 5' } },
        { id: 'none', label: 'nothing',    values: { args: '' } },
      ],
    },
    {
      id: 'keywords',
      label: 'by keyword',
      blurb: 'Keyword-only fields can come in any order and be skipped when they have defaults.',
      params: [
        { name: 'url',     type: 'str', hint: 'positional', input: 'text' },
        { name: 'retries', type: 'int', hint: 'keyword',    input: 'number' },
      ],
      template: "from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Request:\n    url: str\n    _: KW_ONLY\n    timeout: float = 10.0\n    retries: int = 3\n\nr = Request({$url}, retries={$retries})\n(r, Request.__match_args__)",
      cases: [
        { id: 'five', label: 'retries=5', values: { url: 'https://example.com', retries: '5' } },
        { id: 'zero', label: 'retries=0', values: { url: '/health', retries: '0' } },
      ],
    },
  ],
  demoExplainer: 'With two positional arguments the call fails with "takes 2 positional arguments but 3 were given" — self counts as one. With none, url is reported missing. In by keyword, __match_args__ is just (\'url\',): keyword-only fields cannot be matched by position.',

  patterns: [
    {
      name: 'Positional identity, keyword options',
      desc: 'The common shape for options objects.',
      code: 'from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Query:\n    sql: str\n    _: KW_ONLY\n    timeout: float = 30.0\n    params: tuple = ()',
    },
    {
      name: 'Required fields after defaults',
      desc: 'Keyword-only fields escape the "non-default argument follows default argument" rule.',
      code: 'from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Upload:\n    path: str\n    overwrite: bool = False\n    _: KW_ONLY\n    bucket: str',
    },
  ],

  examples: [
    { title: 'The example from the docs', code: 'from dataclasses import dataclass, KW_ONLY, fields\n\n@dataclass\nclass Point:\n    x: float\n    _: KW_ONLY\n    y: float\n    z: float\n\np = Point(0, y=1.5, z=2.0)\np, [f.name for f in fields(p)], Point.__match_args__', returns: "(Point(x=0, y=1.5, z=2.0), ['x', 'y', 'z'], ('x',))" },
    { title: 'Positional calls stop at the marker', code: 'from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Point:\n    x: float\n    _: KW_ONLY\n    y: float\n    z: float\n\nPoint(0, 1.5, 2.0)', returns: 'TypeError: Point.__init__() takes 2 positional arguments but 4 were given' },
    { title: 'A required field after a default', code: 'from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Point:\n    x: float = 0.0\n    _: KW_ONLY\n    y: float\n\nPoint(y=1.0)', returns: 'Point(x=0.0, y=1.0)' },
    { title: 'The marker leaves no trace', code: "from dataclasses import dataclass, KW_ONLY, fields\n\n@dataclass\nclass Point:\n    x: float\n    _: KW_ONLY\n    y: float\n\nhasattr(Point, '_'), [f.name for f in fields(Point)], '_' in Point.__dataclass_fields__", returns: "(False, ['x', 'y'], False)" },
    { title: 'Keyword-only parameters move to the end', code: 'from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Base:\n    x: int\n    _: KW_ONLY\n    y: int = 0\n\n@dataclass\nclass Child(Base):\n    z: int\n\nChild.__doc__, Child(1, 2, y=3)', returns: "('Child(x: int, z: int, *, y: int = 0)', Child(x=1, y=3, z=2))" },
    { title: 'field(kw_only=False) overrides the marker', code: 'from dataclasses import dataclass, KW_ONLY, field\n\n@dataclass\nclass P:\n    a: int\n    _: KW_ONLY\n    b: int = 0\n    c: int = field(kw_only=False, default=1)\n\nP.__doc__', returns: "'P(a: int, c: int = 1, *, b: int = 0)'" },
    { title: 'Two markers with different names', code: 'from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass C:\n    x: int\n    _: KW_ONLY\n    y: int\n    __: KW_ONLY\n    z: int', returns: "TypeError: '__' is KW_ONLY, but KW_ONLY has already been specified" },
  ],

  pitfalls: [
    {
      name: 'Passing keyword-only fields by position',
      desc: 'The error counts self, so "takes 2 positional arguments" means one real one.',
      wrong: { label: 'positional', code: "from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Request:\n    url: str\n    _: KW_ONLY\n    timeout: float = 10.0\n\nRequest('https://example.com', 5.0)", output: 'TypeError: Request.__init__() takes 2 positional arguments but 3 were given' },
      fix:   { label: 'keyword', code: "from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass Request:\n    url: str\n    _: KW_ONLY\n    timeout: float = 10.0\n\nRequest('https://example.com', timeout=5.0)", output: "Request(url='https://example.com', timeout=5.0)" },
    },
    {
      name: 'Expecting a ClassVar[KW_ONLY] to work',
      desc: 'The decorator looks for the exact annotation KW_ONLY. Wrapped in anything else it is just another annotation — here a ClassVar, which is ignored, so nothing becomes keyword-only.',
      wrong: { label: 'ClassVar[KW_ONLY]', code: 'from dataclasses import dataclass, KW_ONLY\nfrom typing import ClassVar\n\n@dataclass\nclass P:\n    a: int\n    _: ClassVar[KW_ONLY]\n    b: int\n\nP.__doc__', output: "'P(a: int, b: int)'" },
      fix:   { label: '_: KW_ONLY', code: 'from dataclasses import dataclass, KW_ONLY\n\n@dataclass\nclass P:\n    a: int\n    _: KW_ONLY\n    b: int\n\nP.__doc__', output: "'P(a: int, *, b: int)'" },
    },
  ],

  when: {
    use: [
      'A few positional fields followed by options',
      'Required fields that have to come after fields with defaults',
      'Subclasses that add required fields to a base class whose fields have defaults',
    ],
    avoid: [
      'All fields keyword-only → @dataclass(kw_only=True)',
      'A single keyword-only field → field(kw_only=True)',
    ],
  },

  notes: {
    cpython:       'Lib/dataclasses.py — KW_ONLY = _KW_ONLY_TYPE(); _process_class switches kw_only on for the rest of the class body when an annotation is KW_ONLY itself — or, with string annotations, a string such as "KW_ONLY" or "dataclasses.KW_ONLY" that names it in the class\'s module',
    'One marker':  'A second marker with a DIFFERENT name raises TypeError. Writing _: KW_ONLY twice does not: both annotations go to the same key of __annotations__, so there is only one',
    'Not a field': 'The marker name never becomes a field, an attribute or an __init__ parameter',
  },

  related: [
    { name: '@dataclass(kw_only=True)', slug: 'dataclass', when: 'Every field keyword-only' },
    { name: 'field(kw_only=...)', slug: 'field', when: 'One field at a time' },
    { name: 'MISSING', slug: 'missing', when: 'The other dataclasses sentinel' },
    { name: 'def', slug: 'def', when: 'Keyword-only parameters after *', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does _: KW_ONLY mean in a dataclass?',
      a: 'It is a marker (Python 3.10+): every field declared after it becomes a keyword-only parameter of the generated __init__. The name _ is a convention; the decorator ignores the marker completely, so it is not a field or an attribute.',
    },
    {
      q: 'How do I make dataclass fields keyword-only?',
      a: 'Three ways: @dataclass(kw_only=True) for all fields, _: KW_ONLY before the fields that should be keyword-only, or field(kw_only=True) for a single field. field(kw_only=False) exempts one field from the other two.',
    },
    {
      q: 'Can a required field follow a field with a default if it is keyword-only?',
      a: 'Yes. The "non-default argument follows default argument" check only looks at positional parameters, and keyword-only parameters are moved after all positional ones in __init__.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.KW_ONLY',
    meta:  'dataclasses.KW_ONLY',
  },

};
