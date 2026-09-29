// content/reference/python/stdlib/json/loads.js

export const meta = {
  slug:        'loads',
  name:        'json.loads',
  signature:   'json.loads(s, *, cls=None, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, object_pairs_hook=None, **kw)',
  blurb:       'Parse a JSON string (or bytes) into Python objects: objects → dict, arrays → list, and so on.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'json loads parse json string python json.loads decode deserialize jsondecodeerror expecting value property name double quotes',
};

export const method = {
  slug:      'loads',
  name:      'json.loads',
  signature: 'json.loads(s, *, cls=None, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, object_pairs_hook=None, **kw)',
  returns:   { type: 'dict | list | str | int | float | bool | None', desc: 'The Python value of the JSON document.' },

  category:    'json function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'JSON text in, Python objects out — and a JSONDecodeError that tells you the exact line, column and character where the text stopped being JSON.',

  covers: ['loads'],

  cheat: {
    commonCall: "json.loads('{\"a\": 1}')",
    returns:    "{'a': 1} — dict, list, str, int, float, bool or None",
    replaces:   'eval() on data (unsafe) and hand-written parsing',
    watchOut:   'Python repr is not JSON: single quotes and True fail',
  },

  parameters: [
    { name: 's',                 type: 'str | bytes | bytearray', required: true,  default: null,   desc: 'The JSON document. bytes are decoded as UTF-8/16/32 (detected automatically).' },
    { name: 'object_hook',       type: 'callable', required: false, default: 'None', desc: 'Called with every decoded dict; its return value replaces the dict.' },
    { name: 'object_pairs_hook', type: 'callable', required: false, default: 'None', desc: 'Called with the (key, value) pairs of every object, in order — sees duplicate keys. Takes priority over object_hook.' },
    { name: 'parse_float',       type: 'callable', required: false, default: 'None', desc: 'Called with the text of every JSON float, e.g. decimal.Decimal for exact decimals.' },
    { name: 'parse_int',         type: 'callable', required: false, default: 'None', desc: 'Called with the text of every JSON int.' },
    { name: 'parse_constant',    type: 'callable', required: false, default: 'None', desc: "Called with '-Infinity', 'Infinity' or 'NaN' — raise here to reject them." },
    { name: 'cls',               type: 'JSONDecoder subclass', required: false, default: 'None', desc: 'Custom decoder class; the other keyword arguments are passed to it.' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'parse',
      blurb: 'Type any JSON document. The result is the Python value — note True, None and the Python quotes.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON document', input: 'text' }],
      template: 'import json\njson.loads({$text})',
      cases: [
        { id: 'object', label: 'object',          values: { text: '{"name": "Ada", "admin": true, "boss": null}' } },
        { id: 'nums',   label: 'numbers',         values: { text: '[7, 7.0, 1e3, 12345678901234567890]' } },
        { id: 'quotes', label: 'single quotes',   values: { text: "{'name': 'Ada'}" } },
        { id: 'comma',  label: 'trailing comma',  values: { text: '[1, 2, 3,]' } },
        { id: 'empty',  label: 'empty string',    values: { text: '' } },
      ],
    },
    {
      id: 'where',
      label: 'find the error',
      blurb: 'Catch JSONDecodeError and read where parsing stopped: message, line, column.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON document', input: 'text' }],
      template: "import json\ntry:\n    json.loads({$text})\nexcept json.JSONDecodeError as e:\n    result = (e.msg, e.lineno, e.colno)\nelse:\n    result = 'valid JSON'\nresult",
      cases: [
        { id: 'missing', label: 'missing comma', values: { text: '{"a": 1 "b": 2}' } },
        { id: 'extra',   label: 'two documents', values: { text: '{"a": 1} {"b": 2}' } },
        { id: 'ok',      label: 'valid',         values: { text: '{"a": [1, 2]}' } },
      ],
    },
    {
      id: 'types',
      label: 'type mapping',
      blurb: 'Which Python type each JSON value becomes.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON array', input: 'text' }],
      template: 'import json\n[type(v).__name__ for v in json.loads({$text})]',
      cases: [
        { id: 'all', label: 'every JSON type', values: { text: '[{}, [], "s", 1, 1.5, true, null]' } },
        { id: 'num', label: 'number forms',    values: { text: '[1, 1.0, 1e0, -0, NaN]' } },
      ],
    },
  ],
  demoExplainer: 'The error position counts from 1 for line and column and from 0 for char. For "missing comma" the parser reads the value 1, skips the whitespace after it, then expects , or } — so the error points at column 9, the opening quote of "b": the first character that could not continue the object.',

  patterns: [
    {
      name: 'Parse or report',
      desc: 'JSONDecodeError is a ValueError subclass with the location built in.',
      code: 'import json\ntry:\n    payload = json.loads(body)\nexcept json.JSONDecodeError as e:\n    print(f"bad JSON at line {e.lineno}, column {e.colno}: {e.msg}")',
    },
    {
      name: 'Exact decimals for money',
      desc: 'Parse floats as Decimal so 19.99 stays 19.99.',
      code: 'import json\nfrom decimal import Decimal\nprices = json.loads(text, parse_float=Decimal)',
    },
    {
      name: 'Objects straight into your own type',
      desc: 'object_hook builds something other than a dict for every JSON object.',
      code: 'import json\nfrom types import SimpleNamespace\nuser = json.loads(text, object_hook=lambda d: SimpleNamespace(**d))\nuser.name',
    },
  ],

  examples: [
    { title: 'Nested document',              code: "import json\njson.loads('{\"user\": {\"tags\": [\"a\", \"b\"]}}')['user']['tags']", returns: "['a', 'b']" },
    { title: 'bytes work too',               code: "import json\njson.loads(b'{\"ok\": true}')",                        returns: "{'ok': True}" },
    { title: 'Duplicate keys: last one wins', code: "import json\njson.loads('{\"a\": 1, \"a\": 2}')",                  returns: "{'a': 2}" },
    { title: 'object_pairs_hook sees all pairs', code: "import json\njson.loads('{\"a\": 1, \"a\": 2}', object_pairs_hook=list)", returns: "[('a', 1), ('a', 2)]" },
    { title: 'Decimal instead of float',     code: "import json\nfrom decimal import Decimal\njson.loads('{\"price\": 19.99}', parse_float=Decimal)", returns: "{'price': Decimal('19.99')}" },
    { title: 'NaN and Infinity are accepted', code: "import json\njson.loads('[NaN, -Infinity]')",                    returns: '[nan, -inf]' },
    { title: 'A BOM is rejected',            code: "import json\njson.loads('\\ufeff{}')",                            returns: 'json.decoder.JSONDecodeError: Unexpected UTF-8 BOM (decode using utf-8-sig): line 1 column 1 (char 0)' },
  ],

  pitfalls: [
    {
      name: 'Passing a file name instead of file content',
      desc: 'loads parses the string you give it. A path is just text, and "data.json" is not a JSON value.',
      wrong: { label: 'loads(path)', code: "import json\njson.loads('data.json')", output: 'json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)' },
      fix:   { label: 'load(open file)', code: "import json\nfrom pathlib import Path\nPath('data.json').write_text('{\"ok\": true}')\nwith open('data.json') as f:\n    data = json.load(f)\ndata", output: "{'ok': True}" },
    },
    {
      name: 'Rejecting NaN you did not expect',
      desc: 'Python accepts NaN/Infinity by default, though they are not standard JSON. parse_constant lets you refuse them.',
      wrong: { label: 'accepted silently', code: "import json\njson.loads('{\"score\": NaN}')", output: "{'score': nan}" },
      fix:   { label: 'parse_constant', code: "import json\ndef reject(name):\n    raise ValueError(f'{name} is not allowed')\njson.loads('{\"score\": NaN}', parse_constant=reject)", output: 'ValueError: NaN is not allowed' },
    },
    {
      name: 'Losing digits in long decimals',
      desc: 'JSON floats become Python floats (53-bit). Integers are exact, decimals are not.',
      wrong: { label: 'float', code: "import json\njson.loads('0.1234567890123456789')", output: '0.12345678901234568' },
      fix:   { label: 'parse_float=Decimal', code: "import json\nfrom decimal import Decimal\njson.loads('0.1234567890123456789', parse_float=Decimal)", output: "Decimal('0.1234567890123456789')" },
    },
  ],

  when: {
    use: [
      'You have JSON as a str or bytes (HTTP body, message, database column)',
      'Parsing untrusted data — loads never executes code',
    ],
    avoid: [
      'Reading from a file → json.load(f)',
      'Python literals (single quotes, True, None) → ast.literal_eval',
      'Text that has trailing data after the JSON → JSONDecoder().raw_decode',
    ],
  },

  notes: {
    cpython:    'JSONDecoder.decode via the C scanner in Modules/_json.c — its error texts and positions differ in places from the pure-Python fallback in decoder.py',
    'Positions': 'lineno and colno count from 1; pos counts code points from 0',
    'Exceptions': 'JSONDecodeError (a ValueError) for bad JSON; TypeError when s is not str/bytes/bytearray',
  },

  related: [
    { name: 'json.load',  slug: 'load',  when: 'Parse from a file object' },
    { name: 'json.dumps', slug: 'dumps', when: 'The reverse: Python → JSON text' },
    { name: 'JSONDecodeError', slug: 'jsondecodeerror', when: 'What bad JSON raises' },
    { name: 'JSONDecoder', slug: 'jsondecoder', when: 'raw_decode for trailing data' },
    { name: 'json module', slug: 'json', when: 'Overview and round trip', category: 'stdlib' },
    { name: 'ValueError',  slug: 'valueerror', when: 'Catch it to catch JSONDecodeError too', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "Expecting property name enclosed in double quotes" mean?',
      a: "JSON object keys must be in double quotes. The usual cause is Python-style text such as {'a': 1} (produced by str() of a dict) or a trailing comma before }. Produce JSON with json.dumps instead of str().",
    },
    {
      q: 'What does "Expecting value: line 1 column 1 (char 0)" mean?',
      a: 'The parser found no JSON value at the start — usually an empty string (an empty HTTP response body), HTML error page, or a file name passed to loads instead of the file content.',
    },
    {
      q: 'How do I parse JSON with single quotes?',
      a: 'It is not JSON, so json.loads rejects it. If it is really a Python literal, ast.literal_eval parses it safely; otherwise fix the producer.',
    },
    {
      q: 'Does json.loads keep the key order?',
      a: 'Yes. dicts keep insertion order, so keys come out in document order. Duplicate keys keep the first position but the last value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html#json.loads',
    meta:  'json.loads',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Find the error in a document' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Browse the parsed structure' },
  ],
};
