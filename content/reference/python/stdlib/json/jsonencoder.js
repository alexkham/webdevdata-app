// content/reference/python/stdlib/json/jsonencoder.js

export const meta = {
  slug:        'jsonencoder',
  name:        'json.JSONEncoder',
  signature:   'json.JSONEncoder(*, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, sort_keys=False, indent=None, separators=None, default=None)',
  blurb:       'The class behind json.dumps and json.dump. Subclass it and override default() to serialize types json does not know, such as sets and dates.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'jsonencoder json encoder python custom json encoder subclass default method cls argument serialize set datetime not json serializable encode iterencode super().default item_separator key_separator',
};

export const method = {
  slug:      'jsonencoder',
  name:      'json.JSONEncoder',
  signature: 'json.JSONEncoder(*, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, sort_keys=False, indent=None, separators=None, default=None)',
  returns:   { type: 'JSONEncoder', desc: 'An encoder; call .encode(obj) for a str or .iterencode(obj) for the pieces.' },

  category:    'json class',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Override one method, default(o), and every json.dumps(..., cls=YourEncoder) call knows your types. Return something serializable, or call super().default(o) to get the standard TypeError.',

  covers: ['JSONEncoder'],

  cheat: {
    commonCall: 'json.dumps(data, cls=MyEncoder)',
    returns:    'encode() → str; iterencode() → iterator of str chunks',
    replaces:   'a default= function passed to every dumps call',
    watchOut:   'default() is only called for types json cannot already encode',
  },

  parameters: [
    { name: 'default',        type: 'callable', required: false, default: 'None',  desc: 'If given, replaces the default() method on this instance.' },
    { name: 'indent',         type: 'int | str | None', required: false, default: 'None', desc: 'Pretty-print with this indent per level. Also switches the default item separator from ", " to ",".' },
    { name: 'separators',     type: 'tuple[str, str]', required: false, default: 'None', desc: 'Sets item_separator and key_separator.' },
    { name: 'sort_keys',      type: 'bool',     required: false, default: 'False', desc: 'Emit dict keys in sorted order.' },
    { name: 'ensure_ascii',   type: 'bool',     required: false, default: 'True',  desc: 'Escape non-ASCII characters as \\uXXXX.' },
    { name: 'allow_nan',      type: 'bool',     required: false, default: 'True',  desc: 'Emit NaN / Infinity; False raises ValueError.' },
    { name: 'skipkeys',       type: 'bool',     required: false, default: 'False', desc: 'Skip dict keys that are not str, int, float, bool or None.' },
    { name: 'check_circular', type: 'bool',     required: false, default: 'True',  desc: 'Detect self-referencing containers (ValueError).' },
  ],

  modes: [
    {
      id: 'subclass',
      label: 'subclass default()',
      blurb: 'The standard recipe: handle your types in default(), hand everything else to super().default(o).',
      params: [{ name: 'tags', type: 'list[str]', hint: 'comma-separated → a set', input: 'csv' }],
      template: "import json\nfrom datetime import date\nclass Encoder(json.JSONEncoder):\n    def default(self, o):\n        if isinstance(o, set):\n            return sorted(o)\n        if isinstance(o, date):\n            return o.isoformat()\n        return super().default(o)\njson.dumps({'tags': set({$tags}), 'day': date(2026, 9, 29)}, cls=Encoder)",
      cases: [
        { id: 'dupes', label: 'duplicates', values: { tags: 'dev, admin, dev' } },
        { id: 'empty', label: 'empty set',  values: { tags: '' } },
      ],
    },
    {
      id: 'iterencode',
      label: 'iterencode()',
      blurb: 'iterencode yields the JSON in pieces — the same pieces json.dump writes to a file one by one.',
      params: [
        { name: 'name',   type: 'str',        hint: 'any text',             input: 'text' },
        { name: 'tags',   type: 'list[str]',  hint: 'comma-separated',      input: 'csv' },
        { name: 'indent', type: 'int | None', hint: 'spaces, empty = None', input: 'number-or-none' },
      ],
      template: "import json\nenc = json.JSONEncoder(indent={$indent})\nlist(enc.iterencode({'name': {$name}, 'tags': {$tags}}))",
      cases: [
        { id: 'flat',   label: 'one line', values: { name: 'Ada', tags: 'admin, dev', indent: '' } },
        { id: 'pretty', label: 'indent=2', values: { name: 'Ada', tags: 'admin, dev', indent: '2' } },
        { id: 'empty',  label: 'no tags',  values: { name: 'Ada', tags: '', indent: '' } },
      ],
    },
    {
      id: 'settings',
      label: 'separators',
      blurb: 'The separators an encoder ends up with depend on indent — and so does encode().',
      params: [{ name: 'indent', type: 'int | None', hint: 'spaces, empty = None', input: 'number-or-none' }],
      template: 'import json\nenc = json.JSONEncoder(indent={$indent})\n(enc.item_separator, enc.key_separator, enc.encode([1, 2]))',
      cases: [
        { id: 'none', label: 'indent=None', values: { indent: '' } },
        { id: 'two',  label: 'indent=2',    values: { indent: '2' } },
        { id: 'zero', label: 'indent=0',    values: { indent: '0' } },
      ],
    },
  ],
  demoExplainer: 'In the subclass tab json calls default() twice — once for the set, once for the date — and encodes whatever comes back; the set becomes a sorted list, so duplicates are gone and the order is stable. In iterencode(), keys, ": " and ", " between dict items are separate pieces, while list items carry the "[" or ", " in front of them. With any indent other than None, item_separator is "," — the line break and indentation take the place of the space.',

  patterns: [
    {
      name: 'One encoder for the whole project',
      desc: 'Collect every custom type in one default(); pass cls= wherever you serialize.',
      code: "import json\nfrom datetime import date, datetime\nfrom decimal import Decimal\nfrom enum import Enum\nfrom uuid import UUID\n\nclass AppEncoder(json.JSONEncoder):\n    def default(self, o):\n        if isinstance(o, (date, datetime)):\n            return o.isoformat()\n        if isinstance(o, (Decimal, UUID)):\n            return str(o)\n        if isinstance(o, (set, frozenset)):\n            return sorted(o)\n        if isinstance(o, Enum):\n            return o.value\n        return super().default(o)\n\njson.dumps(payload, cls=AppEncoder)",
    },
    {
      name: 'Dataclasses',
      desc: 'dataclasses.asdict turns a dataclass (recursively) into a dict json understands.',
      code: "import dataclasses, json\n\nclass DataclassEncoder(json.JSONEncoder):\n    def default(self, o):\n        if dataclasses.is_dataclass(o) and not isinstance(o, type):\n            return dataclasses.asdict(o)\n        return super().default(o)",
    },
    {
      name: 'Stream a large document',
      desc: 'Write the chunks as they come instead of building one huge string.',
      code: "import json\nfor chunk in json.JSONEncoder().iterencode(big_data):\n    sock.sendall(chunk.encode('utf-8'))",
    },
  ],

  examples: [
    { title: 'encode() returns the str',     code: "import json\njson.JSONEncoder(sort_keys=True).encode({'b': 1, 'a': 2})", returns: `'{"a": 2, "b": 1}'` },
    { title: 'iterencode() yields pieces',   code: "import json\nlist(json.JSONEncoder().iterencode({'a': [1, 2]}))", returns: `['{', '"a"', ': ', '[1', ', 2', ']', '}']` },
    { title: 'A subclass via cls=',          code: "import json\nclass Encoder(json.JSONEncoder):\n    def default(self, o):\n        if isinstance(o, set):\n            return sorted(o)\n        return super().default(o)\njson.dumps({'tags': {'b', 'a'}}, cls=Encoder)", returns: `'{"tags": ["a", "b"]}'` },
    { title: 'Unhandled types still raise',  code: "import json\nclass Encoder(json.JSONEncoder):\n    def default(self, o):\n        if isinstance(o, set):\n            return sorted(o)\n        return super().default(o)\njson.dumps({'tags': frozenset({'a'})}, cls=Encoder)", returns: 'TypeError: Object of type frozenset is not JSON serializable' },
    { title: 'The base default() always raises', code: 'import json\njson.JSONEncoder().default(1)', returns: 'TypeError: Object of type int is not JSON serializable' },
    { title: 'default= replaces the method', code: 'import json\njson.JSONEncoder(default=str).default', returns: "<class 'str'>" },
    { title: 'Separators follow indent',     code: 'import json\nenc = json.JSONEncoder(indent=2)\n(enc.item_separator, enc.key_separator)', returns: "(',', ': ')" },
    { title: 'Streaming into a file object', code: "import io, json\nout = io.StringIO()\nfor chunk in json.JSONEncoder().iterencode(list(range(5))):\n    out.write(chunk)\nout.getvalue()", returns: "'[0, 1, 2, 3, 4]'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting to return from default()',
      desc: 'A default() that falls off the end returns None — and None is perfectly serializable, so the value silently becomes null.',
      wrong: { label: 'no return',     code: "import json\nclass Encoder(json.JSONEncoder):\n    def default(self, o):\n        if isinstance(o, set):\n            sorted(o)\njson.dumps({'tags': {'a'}}, cls=Encoder)", output: `'{"tags": null}'` },
      fix:   { label: 'return + super', code: "import json\nclass Encoder(json.JSONEncoder):\n    def default(self, o):\n        if isinstance(o, set):\n            return sorted(o)\n        return super().default(o)\njson.dumps({'tags': {'a'}}, cls=Encoder)", output: `'{"tags": ["a"]}'` },
    },
    {
      name: 'Trying to change how floats (or str, int, list…) are written',
      desc: 'default() is only consulted for objects json cannot encode on its own. A float never reaches it, so rounding there does nothing — transform the data before dumping.',
      wrong: { label: 'default() for float', code: "import json\nclass Rounder(json.JSONEncoder):\n    def default(self, o):\n        if isinstance(o, float):\n            return round(o, 2)\n        return super().default(o)\njson.dumps({'pi': 3.14159}, cls=Rounder)", output: `'{"pi": 3.14159}'` },
      fix:   { label: 'round first',        code: "import json\ndata = {'pi': 3.14159}\njson.dumps({k: round(v, 2) for k, v in data.items()})", output: `'{"pi": 3.14}'` },
    },
    {
      name: 'Overriding encode() — json.dump never calls it',
      desc: 'dumps goes through encode(), but dump goes straight to iterencode(). Customize default() (or the data), not encode().',
      wrong: { label: 'encode() override', code: "import io, json\nclass Upper(json.JSONEncoder):\n    def encode(self, o):\n        return super().encode(o).upper()\nbuf = io.StringIO()\njson.dump({'a': 'x'}, buf, cls=Upper)\n(json.dumps({'a': 'x'}, cls=Upper), buf.getvalue())", output: `('{"A": "X"}', '{"a": "x"}')` },
      fix:   { label: 'dumps, then write', code: "import io, json\nclass Upper(json.JSONEncoder):\n    def encode(self, o):\n        return super().encode(o).upper()\nbuf = io.StringIO()\nbuf.write(json.dumps({'a': 'x'}, cls=Upper))\nbuf.getvalue()", output: `'{"A": "X"}'` },
    },
  ],

  when: {
    use: [
      'The same custom types (dates, Decimal, UUID, dataclasses) are serialized in many places',
      'Streaming output chunk by chunk with iterencode()',
      'Frameworks that accept an encoder class (cls=, json_encoder=)',
    ],
    avoid: [
      'A one-off conversion → json.dumps(data, default=func)',
      'Changing how floats, strings or lists are written → transform the data first',
      'Parsing → JSONDecoder / json.loads',
    ],
  },

  notes: {
    cpython:        'Lib/json/encoder.py; encode() uses the C encoder from Modules/_json.c in one shot, iterencode() yields from the pure-Python _make_iterencode',
    'Hook order':   'default(o) is tried only after str, int, float, bool, None, list, tuple and dict; its return value is encoded again (and may itself go through default)',
    'Circular':     'check_circular also covers default(): returning the object itself raises ValueError: Circular reference detected',
    'Attributes':   "skipkeys, ensure_ascii, check_circular, allow_nan, sort_keys and indent are set on every instance; item_separator (', ') and key_separator (': ') are class attributes, overridden on the instance by separators= — or item_separator alone by indent=",
  },

  related: [
    { name: 'json.dumps',  slug: 'dumps',       when: 'cls= and default= arguments' },
    { name: 'json.dump',   slug: 'dump',        when: 'Writes iterencode() chunks to a file' },
    { name: 'JSONDecoder', slug: 'jsondecoder', when: 'The parsing counterpart' },
    { name: 'json module', slug: 'json',        when: 'Overview', category: 'stdlib' },
    { name: 'super()',     slug: 'super',       when: 'super().default(o) raises the standard TypeError', category: 'functions' },
    { name: 'class',       slug: 'class',       when: 'Defining the subclass', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I make a custom JSON encoder in Python?',
      a: 'Subclass json.JSONEncoder, override default(self, o) to return a serializable value for your types, end it with return super().default(o), and pass the class as json.dumps(data, cls=YourEncoder).',
    },
    {
      q: 'Why call super().default(o) at the end of default()?',
      a: 'The base implementation raises TypeError: Object of type X is not JSON serializable. Without it, unknown objects fall through, default() returns None, and they are silently written as null.',
    },
    {
      q: 'What is the difference between encode() and iterencode()?',
      a: 'encode() returns the whole JSON str; iterencode() yields it in small pieces. json.dumps uses encode(), json.dump uses iterencode() and writes each piece to the file.',
    },
    {
      q: 'Should I use cls= or default=?',
      a: 'default= is a function for one call; cls= is a reusable class, which also lets you set options like indent or sort_keys in __init__. For a single dumps call, default= is simpler.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html#json.JSONEncoder',
    meta:  'json.JSONEncoder',
  },
};
