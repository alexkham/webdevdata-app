// content/reference/python/stdlib/json/dumps.js

export const meta = {
  slug:        'dumps',
  name:        'json.dumps',
  signature:   'json.dumps(obj, *, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, default=None, sort_keys=False, **kw)',
  blurb:       'Serialize a Python object to a JSON string: dicts → objects, lists and tuples → arrays, with options for indentation, key order and non-ASCII text.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'json dumps python json.dumps serialize dict to json string encode pretty print indent sort_keys ensure_ascii separators default not json serializable object of type set datetime keys must be str circular reference',
};

export const method = {
  slug:      'dumps',
  name:      'json.dumps',
  signature: 'json.dumps(obj, *, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, default=None, sort_keys=False, **kw)',
  returns:   { type: 'str', desc: 'The JSON text. Never bytes — call .encode() yourself if you need them.' },

  category:    'json function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Python objects in, JSON text out. Tuples turn into arrays, every key turns into a string, and anything json does not know — sets, dates, Decimals — needs default=.',

  covers: ['dumps'],

  cheat: {
    commonCall: "json.dumps(data, indent=2, ensure_ascii=False)",
    returns:    'str — the JSON document',
    replaces:   'str(dict) / repr(), which produce Python syntax, not JSON',
    watchOut:   'sets, dates and Decimal raise TypeError without default=',
  },

  parameters: [
    { name: 'obj',            type: 'any',       required: true,  default: null,    desc: 'dict, list, tuple, str, int, float, bool or None — nested freely. Anything else goes through default.' },
    { name: 'indent',         type: 'int | str | None', required: false, default: 'None', desc: 'None = one line. An int puts every item on its own line, indented by that many spaces per level (0 = new lines, no spaces); a str is used as the indent itself.' },
    { name: 'sort_keys',      type: 'bool',      required: false, default: 'False', desc: 'Write dict keys in sorted order instead of insertion order. Keys of mixed types (1 and "a") raise TypeError.' },
    { name: 'ensure_ascii',   type: 'bool',      required: false, default: 'True',  desc: 'Escape every non-ASCII character as \\uXXXX (a surrogate pair above U+FFFF). False writes the characters as they are.' },
    { name: 'separators',     type: 'tuple[str, str]', required: false, default: 'None', desc: "(item_separator, key_separator). Default (', ', ': '), or (',', ': ') when indent is set; (',', ':') gives the most compact output." },
    { name: 'default',        type: 'callable',  required: false, default: 'None',  desc: 'Called with every object json cannot serialize; must return something it can (or raise TypeError).' },
    { name: 'allow_nan',      type: 'bool',      required: false, default: 'True',  desc: 'Write NaN, Infinity and -Infinity (not valid JSON). False raises ValueError instead.' },
    { name: 'skipkeys',       type: 'bool',      required: false, default: 'False', desc: 'Silently drop dict keys that are not str, int, float, bool or None instead of raising TypeError.' },
    { name: 'check_circular', type: 'bool',      required: false, default: 'True',  desc: 'Detect a container that contains itself (ValueError). False skips the check — a cycle then ends in RecursionError.' },
    { name: 'cls',            type: 'JSONEncoder subclass', required: false, default: 'None', desc: 'Encoder class to use; the other keyword arguments are passed to it.' },
  ],

  modes: [
    {
      id: 'build',
      label: 'dict → JSON',
      blurb: 'A dict built from your inputs, serialized with the defaults. Watch the escapes for non-ASCII text and how floats are written.',
      params: [
        { name: 'name',  type: 'str',       hint: 'any text',            input: 'text' },
        { name: 'tags',  type: 'list[str]', hint: 'comma-separated',     input: 'csv' },
        { name: 'score', type: 'float',     hint: 'a number',            input: 'float' },
      ],
      template: "import json\nrecord = {'name': {$name}, 'tags': {$tags}, 'score': {$score}}\njson.dumps(record)",
      cases: [
        { id: 'basic', label: 'basic',          values: { name: 'Ada', tags: 'admin, dev', score: '9.5' } },
        { id: 'accent', label: 'accented',      values: { name: 'Zoë', tags: 'café', score: '10' } },
        { id: 'emoji', label: 'emoji',          values: { name: 'Sam 😀', tags: '', score: '0.1' } },
        { id: 'quote', label: 'quotes + 1e16',  values: { name: 'say "hi"', tags: 'a', score: '1e16' } },
      ],
    },
    {
      id: 'pretty',
      label: 'indent + sort_keys',
      blurb: 'indent= and sort_keys=True — the output split into lines so you can see the layout. Leave indent empty for None.',
      params: [
        { name: 'name',   type: 'str',        hint: 'any text',              input: 'text' },
        { name: 'tags',   type: 'list[str]',  hint: 'comma-separated',       input: 'csv' },
        { name: 'indent', type: 'int | None', hint: 'spaces, empty = None',  input: 'number-or-none' },
      ],
      template: "import json\nrecord = {'name': {$name}, 'tags': {$tags}, 'id': 7}\njson.dumps(record, indent={$indent}, sort_keys=True).splitlines()",
      cases: [
        { id: 'two',   label: 'indent=2',    values: { name: 'Ada', tags: 'admin, dev', indent: '2' } },
        { id: 'none',  label: 'indent=None', values: { name: 'Ada', tags: 'admin, dev', indent: '' } },
        { id: 'zero',  label: 'indent=0',    values: { name: 'Ada', tags: 'admin', indent: '0' } },
        { id: 'empty', label: 'empty list',  values: { name: 'Ada', tags: '', indent: '4' } },
      ],
    },
    {
      id: 'separators',
      label: 'separators',
      blurb: 'The two strings put between items and between a key and its value.',
      params: [
        { name: 'item', type: 'str', hint: 'between items',         input: 'text' },
        { name: 'key',  type: 'str', hint: 'between key and value', input: 'text' },
      ],
      template: "import json\njson.dumps({'id': 7, 'tags': ['a', 'b']}, separators=({$item}, {$key}))",
      cases: [
        { id: 'compact', label: 'compact',  values: { item: ',',  key: ':' } },
        { id: 'default', label: 'default',  values: { item: ', ', key: ': ' } },
        { id: 'odd',     label: 'anything', values: { item: ' | ', key: '=' } },
      ],
    },
    {
      id: 'ascii',
      label: 'ensure_ascii',
      blurb: 'The same text with ensure_ascii=True (the default) and False.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import json\n(json.dumps({$text}), json.dumps({$text}, ensure_ascii=False))',
      cases: [
        { id: 'accent', label: 'café',   values: { text: 'café' } },
        { id: 'cjk',    label: '日本語', values: { text: '日本語' } },
        { id: 'emoji',  label: 'emoji',  values: { text: 'hi 😀' } },
        { id: 'plain',  label: 'ASCII',  values: { text: 'plain' } },
      ],
    },
    {
      id: 'keys',
      label: 'non-str keys',
      blurb: 'A dict key of your type (a number stays a number), dumped and loaded back. JSON keys are always strings.',
      params: [{ name: 'key', type: 'int | float | str', hint: 'a number or text', input: 'auto' }],
      template: 'import json\ndata = {{$key}: \'x\'}\n(json.dumps(data), json.loads(json.dumps(data)))',
      cases: [
        { id: 'int',   label: 'int 1',     values: { key: '1' } },
        { id: 'float', label: 'float 2.5', values: { key: '2.5' } },
        { id: 'big',   label: '1e21',      values: { key: '1e21' } },
        { id: 'str',   label: 'text',      values: { key: 'id' } },
      ],
    },
    {
      id: 'default',
      label: 'default=',
      blurb: 'A set and a date: plain dumps refuses the first one it meets; a default= function converts both.',
      params: [{ name: 'tags', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: "import json\nfrom datetime import date\nrecord = {'tags': set({$tags}), 'day': date(2026, 9, 29)}\ntry:\n    plain = json.dumps(record)\nexcept TypeError as e:\n    plain = str(e)\ndef fallback(o):\n    return sorted(o) if isinstance(o, set) else str(o)\n(plain, json.dumps(record, default=fallback))",
      cases: [
        { id: 'dupes', label: 'duplicates', values: { tags: 'b, a, b' } },
        { id: 'empty', label: 'empty set',  values: { tags: '' } },
      ],
    },
  ],
  demoExplainer: 'In "accented", ë is written as \\u00eb; the emoji is above U+FFFF, so ensure_ascii writes it as a surrogate pair of two \\u escapes. Floats are written with repr(), so 10 typed as a float comes out as 10.0 and 1e16 as 1e+16. With indent set, the item separator drops its trailing space, and indent=0 still breaks lines. In non-str keys, the key comes back from loads as the string \'1\', not the int 1.',

  patterns: [
    {
      name: 'Pretty-print for humans',
      desc: 'Stable key order, readable non-ASCII text.',
      code: 'import json\nprint(json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False))',
    },
    {
      name: 'Compact for the wire',
      desc: 'No spaces after , and : — the smallest output.',
      code: "import json\nbody = json.dumps(payload, separators=(',', ':'))",
    },
    {
      name: 'Dates, Decimals and UUIDs',
      desc: 'default= is called only for objects json cannot handle; raise TypeError for the rest.',
      code: "import json\nfrom datetime import date, datetime\nfrom decimal import Decimal\nfrom uuid import UUID\n\ndef to_json(o):\n    if isinstance(o, (date, datetime)):\n        return o.isoformat()\n    if isinstance(o, (Decimal, UUID)):\n        return str(o)\n    raise TypeError(f'Object of type {type(o).__name__} is not JSON serializable')\n\njson.dumps(record, default=to_json)",
    },
    {
      name: 'Deterministic cache key',
      desc: 'Same data → same text → same hash, regardless of key insertion order.',
      code: "import hashlib, json\nkey = hashlib.sha256(json.dumps(params, sort_keys=True, separators=(',', ':')).encode()).hexdigest()",
    },
  ],

  examples: [
    { title: 'Tuples become arrays',           code: "import json\njson.dumps({'point': (1, 2)})",                                   returns: `'{"point": [1, 2]}'` },
    { title: 'Keys become strings',            code: "import json\njson.dumps({1: 'a', 2.5: 'b', False: 'c', None: 'd'})",        returns: `'{"1": "a", "2.5": "b", "false": "c", "null": "d"}'` },
    { title: 'Two keys, one JSON name',        code: "import json\njson.dumps({1: 'int', '1': 'str'})",                           returns: `'{"1": "int", "1": "str"}'` },
    { title: 'Tuple keys are rejected',        code: "import json\njson.dumps({(1, 2): 'x'})",                                    returns: 'TypeError: keys must be str, int, float, bool or None, not tuple' },
    { title: 'skipkeys drops them instead',    code: "import json\njson.dumps({(1, 2): 'x', 'a': 1}, skipkeys=True)",              returns: `'{"a": 1}'` },
    { title: 'NaN and Infinity by default',    code: "import json\njson.dumps([float('nan'), float('inf')])",                      returns: "'[NaN, Infinity]'" },
    { title: 'allow_nan=False refuses them',   code: "import json\njson.dumps([float('nan')], allow_nan=False)",                  returns: 'ValueError: Out of range float values are not JSON compliant: nan' },
    { title: 'A list that contains itself',    code: 'import json\ndata = []\ndata.append(data)\njson.dumps(data)',              returns: 'ValueError: Circular reference detected' },
  ],

  pitfalls: [
    {
      name: 'Object of type set is not JSON serializable',
      desc: 'JSON has no set. Convert it yourself — sorted() also makes the output order stable, which iterating a set does not.',
      wrong: { label: 'a set',        code: "import json\njson.dumps({'tags': {'admin'}})",          output: 'TypeError: Object of type set is not JSON serializable' },
      fix:   { label: 'sorted(set)',  code: "import json\njson.dumps({'tags': sorted({'dev', 'admin'})})", output: `'{"tags": ["admin", "dev"]}'` },
    },
    {
      name: 'Encoding twice',
      desc: 'Passing an already-encoded JSON string to dumps encodes it again — as one JSON string full of escaped quotes. Common when a helper already returned JSON text.',
      wrong: { label: 'dumps(dumps(x))', code: "import json\njson.dumps(json.dumps({'a': 1}))", output: `'"{\\\\"a\\\\": 1}"'` },
      fix:   { label: 'dumps(x)',        code: "import json\njson.dumps({'a': 1})",             output: `'{"a": 1}'` },
    },
    {
      name: 'sort_keys with mixed key types',
      desc: 'sort_keys sorts the original keys before converting them to strings, so int and str keys cannot be compared.',
      wrong: { label: 'sort_keys=True', code: "import json\njson.dumps({1: 'a', 'b': 2}, sort_keys=True)", output: "TypeError: '<' not supported between instances of 'str' and 'int'" },
      fix:   { label: 'str keys first', code: "import json\ndata = {1: 'a', 'b': 2}\njson.dumps({str(k): v for k, v in data.items()}, sort_keys=True)", output: `'{"1": "a", "b": 2}'` },
    },
    {
      name: 'Unreadable non-ASCII text',
      desc: 'ensure_ascii=True (the default) is valid JSON but escapes every accented letter. Turn it off for files people read; the output is then non-ASCII, so write it as UTF-8.',
      wrong: { label: 'default',            code: "import json\njson.dumps({'city': 'Zürich'})",                     output: `'{"city": "Z\\\\u00fcrich"}'` },
      fix:   { label: 'ensure_ascii=False', code: "import json\njson.dumps({'city': 'Zürich'}, ensure_ascii=False)", output: `'{"city": "Zürich"}'` },
    },
  ],

  when: {
    use: [
      'You need JSON as a str — HTTP bodies, message queues, database columns, logs',
      'Pretty-printing data for a person (indent=2)',
      'A deterministic text form of a dict (sort_keys=True) for hashing or diffing',
    ],
    avoid: [
      'Writing to a file → json.dump(data, f) streams into it',
      'Round-tripping Python types (tuples, sets, dates) exactly → pickle, or a schema library',
      'Serializing many custom classes → a JSONEncoder subclass keeps default() in one place',
    ],
  },

  notes: {
    cpython:          'Lib/json/encoder.py; dumps with every argument at its default reuses one module-level JSONEncoder, and encode() runs the C encoder from Modules/_json.c',
    'Floats':         'Written with float.__repr__, so they round-trip exactly: 0.1 → 0.1, 1e16 → 1e+16',
    'int and bool':   'True/False become true/false; ints are written with int.__repr__, so an int over 4300 digits raises ValueError (the int-to-str conversion limit)',
    'Dict order':     'Insertion order unless sort_keys=True',
  },

  related: [
    { name: 'json.dump',   slug: 'dump',        when: 'Write the JSON straight to a file' },
    { name: 'json.loads',  slug: 'loads',       when: 'The reverse: JSON text → Python' },
    { name: 'JSONEncoder', slug: 'jsonencoder', when: 'Subclass it to teach json new types' },
    { name: 'json module', slug: 'json',        when: 'Overview and type mapping', category: 'stdlib' },
    { name: 'TypeError',   slug: 'typeerror',   when: 'What unsupported objects and keys raise', category: 'exceptions' },
    { name: 'repr()',      slug: 'repr',        when: 'Python syntax, not JSON', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I pretty-print JSON in Python?',
      a: 'json.dumps(data, indent=2) puts every item on its own line with two spaces per level. Add sort_keys=True for a stable key order and ensure_ascii=False to keep non-ASCII text readable.',
    },
    {
      q: 'How do I fix "Object of type datetime is not JSON serializable"?',
      a: 'json only knows dict, list, tuple, str, int, float, bool and None. Pass default= a function that converts the rest — default=str is the quick fix, a function returning o.isoformat() for dates is the tidy one — or subclass JSONEncoder and override default().',
    },
    {
      q: 'Why does json.dumps turn é into \\u00e9?',
      a: 'ensure_ascii=True is the default, so every non-ASCII character is written as a \\u escape. It is still correct JSON and loads gives you é back. Pass ensure_ascii=False to write the characters themselves.',
    },
    {
      q: 'What is the difference between json.dumps and json.dump?',
      a: 'dumps returns the JSON as a str; dump writes it to a file object you pass in and returns None. They take the same options.',
    },
    {
      q: 'How do I get the most compact JSON?',
      a: "separators=(',', ':') removes the spaces after commas and colons; leave indent at None.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html#json.dumps',
    meta:  'json.dumps',
  },

};
