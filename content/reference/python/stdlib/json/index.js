// content/reference/python/stdlib/json/index.js — the json module hub

export const meta = {
  slug:        'index',
  name:        'json',
  signature:   'import json',
  blurb:       'Encode Python objects as JSON text and decode JSON back into dicts and lists — dumps, loads, dump, load.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'json module python json parse serialize deserialize dumps loads dump load encode decode javascript object notation pretty print',
};

export const method = {
  slug: 'index',
  name: 'json',

  category:    'Data formats',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Four functions do almost all the work: loads/dumps for strings, load/dump for files. The traps are in the type mapping — tuples come back as lists, keys come back as strings.',

  imports: ['import json', 'from json import dumps, loads'],
  facts: [
    { label: 'Public API', value: 'dump, dumps, load, loads, JSONEncoder, JSONDecoder, JSONDecodeError' },
    { label: 'Spec',       value: 'RFC 8259 / ECMA-404 — plus NaN and Infinity, which Python accepts by default' },
    { label: 'Speed',      value: 'C accelerator _json used automatically (Modules/_json.c)' },
    { label: 'CLI',        value: 'python -m json.tool data.json' },
  ],

  modes: [
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'Parse JSON text into Python, then serialize it back. Compare what comes out with what went in.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON document', input: 'text' }],
      template: 'import json\ndata = json.loads({$text})\njson.dumps(data, sort_keys=True)',
      cases: [
        { id: 'object',  label: 'object',            values: { text: '{"name": "Zoë", "id": 7}' } },
        { id: 'numbers', label: 'ints vs floats',     values: { text: '[1, 1.0, 1e2, -0]' } },
        { id: 'dupes',   label: 'duplicate keys',    values: { text: '{"a": 1, "a": 2}' } },
        { id: 'bad',     label: 'single quotes',     values: { text: "{'name': 'Zoë'}" } },
      ],
    },
    {
      id: 'pretty',
      label: 'pretty print',
      blurb: 'indent= turns compact JSON into readable lines (shown here one list item per line).',
      params: [
        { name: 'text',   type: 'str', hint: 'a JSON document', input: 'text' },
        { name: 'indent', type: 'int', hint: 'spaces per level', input: 'number' },
      ],
      template: 'import json\njson.dumps(json.loads({$text}), indent={$indent}).splitlines()',
      cases: [
        { id: 'nested', label: 'nested',   values: { text: '{"user": {"name": "Ada", "tags": ["admin", "dev"]}}', indent: '2' } },
        { id: 'zero',   label: 'indent=0', values: { text: '[1, [2, 3]]', indent: '0' } },
      ],
    },
  ],
  demoExplainer: 'Three things the round trip exposes: non-ASCII text is escaped by default ("Zo\\u00eb" — pass ensure_ascii=False to keep it), 1.0 stays a float while 1 stays an int, and a duplicate key silently keeps the last value. Python-style single quotes are not JSON at all.',

  patterns: [
    {
      name: 'Read a JSON file',
      desc: 'json.load takes an open file; say the encoding explicitly.',
      code: "import json\nwith open('config.json', encoding='utf-8') as f:\n    config = json.load(f)",
    },
    {
      name: 'Write a JSON file',
      desc: 'indent for humans, ensure_ascii=False to keep non-ASCII text readable.',
      code: "import json\nwith open('out.json', 'w', encoding='utf-8') as f:\n    json.dump(data, f, indent=2, ensure_ascii=False)",
    },
    {
      name: 'Serialize types json does not know',
      desc: 'default= is called for every unsupported object; return something serializable.',
      code: 'import json\njson.dumps(record, default=str)  # datetime, Decimal, UUID → their str()',
    },
    {
      name: 'Validate on the command line',
      desc: 'json.tool pretty-prints a file and exits non-zero on invalid JSON.',
      code: '# shell:\n# python -m json.tool data.json',
    },
  ],

  examples: [
    { title: 'JSON object → dict',       code: "import json\njson.loads('{\"a\": 1, \"b\": [true, null]}')", returns: "{'a': 1, 'b': [True, None]}" },
    { title: 'dict → JSON text',         code: "import json\njson.dumps({'a': 1, 'b': [True, None]})",     returns: "'{\"a\": 1, \"b\": [true, null]}'" },
    { title: 'Tuples come back as lists', code: 'import json\njson.loads(json.dumps((1, 2)))',              returns: '[1, 2]' },
    { title: 'Keys come back as strings', code: "import json\njson.loads(json.dumps({1: 'a'}))",          returns: "{'1': 'a'}" },
    { title: 'Compact output',           code: "import json\njson.dumps({'a': [1, 2]}, separators=(',', ':'))", returns: '\'{"a":[1,2]}\'' },
    { title: 'Sets are not serializable', code: 'import json\njson.dumps({1, 2})',                          returns: 'TypeError: Object of type set is not JSON serializable' },
  ],

  pitfalls: [
    {
      name: 'Using str() or repr() to produce JSON',
      desc: 'A Python dict repr uses single quotes, True and None — it is not JSON, and loads rejects it.',
      wrong: { label: 'str(dict)',  code: "import json\njson.loads(str({'ok': True}))", output: 'json.decoder.JSONDecodeError: Expecting property name enclosed in double quotes: line 1 column 2 (char 1)' },
      fix:   { label: 'json.dumps', code: "import json\njson.loads(json.dumps({'ok': True}))", output: "{'ok': True}" },
    },
    {
      name: 'datetime is not JSON serializable',
      desc: 'dumps only knows dict, list, tuple, str, int, float, bool and None. Everything else needs default= (or a custom JSONEncoder).',
      wrong: { label: 'plain dumps', code: 'import json\nfrom datetime import date\njson.dumps({"day": date(2026, 9, 29)})', output: 'TypeError: Object of type date is not JSON serializable' },
      fix:   { label: 'default=str', code: 'import json\nfrom datetime import date\njson.dumps({"day": date(2026, 9, 29)}, default=str)', output: '\'{"day": "2026-09-29"}\'' },
    },
  ],

  when: {
    use: [
      'Exchanging data with web APIs, JavaScript and other languages',
      'Human-readable config and data files',
      'Parsing untrusted input — json never executes code',
    ],
    avoid: [
      'Round-tripping arbitrary Python objects (tuples, sets, dates) → pickle, or a schema library',
      'Tabular data → csv',
      'Config with comments → tomllib (reading TOML, 3.11+)',
    ],
  },

  notes: {
    cpython:      'Lib/json/ in pure Python, with Modules/_json.c used automatically for scanning and encoding — its error messages are what you see',
    'Encoding':   'dumps escapes non-ASCII as \\uXXXX unless ensure_ascii=False',
    'Floats':     'Written with repr(), so they round-trip exactly; NaN and Infinity are emitted unless allow_nan=False',
  },

  related: [
    { name: 'open()',  slug: 'open',  when: 'Get a file object for load/dump', category: 'functions' },
    { name: 'dict',    slug: 'dict',  when: 'What JSON objects become',        category: 'functions' },
    { name: 'ValueError', slug: 'valueerror', when: 'Base class of JSONDecodeError', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between json.loads and json.load?',
      a: 'loads parses a str (or bytes) you already have; load reads from a file object and parses its content. Likewise dumps returns a str and dump writes to a file. The trailing s stands for "string".',
    },
    {
      q: 'How do I pretty-print JSON in Python?',
      a: 'json.dumps(data, indent=2) — add sort_keys=True for stable key order and ensure_ascii=False to keep non-ASCII text as-is. From a shell: python -m json.tool file.json.',
    },
    {
      q: 'Why do my tuple and int keys change after a round trip?',
      a: 'JSON has only arrays and string-keyed objects. dumps writes tuples as arrays and converts int, float, bool and None keys to strings; loads cannot know they were anything else.',
    },
    {
      q: 'Is json.loads safe on untrusted input?',
      a: 'Yes — it only builds dicts, lists, strings, numbers, booleans and None; it never runs code (unlike eval or pickle). Very large or deeply nested documents can still cost memory or raise RecursionError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html',
    meta:  'json — JSON encoder and decoder',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Validate and pretty-print JSON' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore nested structure' },
    { name: 'YAML ⇄ JSON',    href: '/tools/yaml-json',      meta: 'Convert config formats' },
  ],
};
