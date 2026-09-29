// content/reference/python/stdlib/json/jsondecoder.js

export const meta = {
  slug:        'jsondecoder',
  name:        'json.JSONDecoder',
  signature:   'json.JSONDecoder(*, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, strict=True, object_pairs_hook=None)',
  blurb:       'The parser behind json.loads. Its raw_decode() reads one JSON value from the start of a string and tells you where it ended — the tool for concatenated JSON and JSON embedded in text.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'jsondecoder json decoder python raw_decode decode parse multiple json objects concatenated json extra data strict false invalid control character object_hook object_pairs_hook stream ndjson',
};

export const method = {
  slug:      'jsondecoder',
  name:      'json.JSONDecoder',
  signature: 'json.JSONDecoder(*, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, strict=True, object_pairs_hook=None)',
  returns:   { type: 'JSONDecoder', desc: 'A reusable decoder; call .decode(s) or .raw_decode(s, idx=0).' },

  category:    'json class',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'decode(s) is json.loads for str; raw_decode(s, idx) parses one value starting exactly at idx and returns (value, end) — no complaint about what follows, and no skipping of whitespace in front.',

  covers: ['JSONDecoder'],

  cheat: {
    commonCall: 'obj, end = json.JSONDecoder().raw_decode(text, pos)',
    returns:    'decode → the value; raw_decode → (value, index after it)',
    replaces:   'splitting concatenated JSON by hand',
    watchOut:   'raw_decode fails on leading whitespace; both methods need str, not bytes',
  },

  parameters: [
    { name: 'strict',            type: 'bool',     required: false, default: 'True', desc: 'False allows raw control characters (tab, newline, U+0000–U+001F) inside strings. Nothing else becomes lenient.' },
    { name: 'object_hook',       type: 'callable', required: false, default: 'None', desc: 'Called with every decoded dict, innermost first; its return value replaces the dict.' },
    { name: 'object_pairs_hook', type: 'callable', required: false, default: 'None', desc: 'Called with the list of (key, value) pairs of every object, duplicates included. Wins over object_hook.' },
    { name: 'parse_float',       type: 'callable', required: false, default: 'None', desc: 'Called with the text of every JSON float (float by default).' },
    { name: 'parse_int',         type: 'callable', required: false, default: 'None', desc: 'Called with the text of every JSON int (int by default).' },
    { name: 'parse_constant',    type: 'callable', required: false, default: 'None', desc: "Called with '-Infinity', 'Infinity' or 'NaN'." },
  ],

  modes: [
    {
      id: 'raw',
      label: 'raw_decode()',
      blurb: 'Parse one value from the start of the text. The second item is the index just after it — whatever follows is ignored.',
      params: [{ name: 'text', type: 'str', hint: 'JSON, then anything', input: 'text' }],
      template: 'import json\njson.JSONDecoder().raw_decode({$text})',
      cases: [
        { id: 'trailing', label: 'trailing text',    values: { text: '{"a": 1} and more' } },
        { id: 'number',   label: 'number then text', values: { text: '12abc' } },
        { id: 'two',      label: 'two arrays',       values: { text: '[1][2]' } },
        { id: 'space',    label: 'leading space',    values: { text: ' [1]' } },
      ],
    },
    {
      id: 'stream',
      label: 'concatenated JSON',
      blurb: 'Walk through several JSON values in one string: skip whitespace, raw_decode, continue at the returned index.',
      params: [{ name: 'text', type: 'str', hint: 'several JSON values', input: 'text' }],
      template: "import json\ntext = {$text}\ndec = json.JSONDecoder()\nitems, pos = [], 0\nwhile True:\n    while pos < len(text) and text[pos] in ' \\t\\n\\r':\n        pos += 1\n    if pos == len(text):\n        break\n    obj, pos = dec.raw_decode(text, pos)\n    items.append(obj)\nitems",
      cases: [
        { id: 'mixed',   label: 'mixed values',   values: { text: '{"a": 1} {"b": 2} [3]' } },
        { id: 'glued',   label: 'no separator',   values: { text: '{"a": 1}{"b": 2}' } },
        { id: 'words',   label: 'true false null', values: { text: 'true false null' } },
        { id: 'bad',     label: 'bad value',      values: { text: '1 2 x' } },
      ],
    },
    {
      id: 'strict',
      label: 'strict=False',
      blurb: 'A document with a raw line break inside a string (as produced by gluing text into JSON by hand), parsed with the default strict=True and with strict=False.',
      params: [
        { name: 'first',  type: 'str', hint: 'text before the line break', input: 'text' },
        { name: 'second', type: 'str', hint: 'text after it',              input: 'text' },
      ],
      template: "import json\ndoc = '{\"note\": \"' + {$first} + '\\n' + {$second} + '\"}'\ntry:\n    strict = json.loads(doc)\nexcept json.JSONDecodeError as e:\n    strict = str(e)\n(strict, json.JSONDecoder(strict=False).decode(doc))",
      cases: [
        { id: 'lines', label: 'two lines',      values: { first: 'line one', second: 'line two' } },
        { id: 'empty', label: 'empty first',    values: { first: '', second: 'x' } },
        { id: 'quote', label: 'unescaped quote', values: { first: 'say "hi', second: 'there' } },
      ],
    },
    {
      id: 'hook',
      label: 'object_hook',
      blurb: 'Every JSON object becomes a SimpleNamespace, so fields read as attributes (data.team.lead). Nested objects are converted first.',
      params: [{ name: 'text', type: 'str', hint: 'a JSON document', input: 'text' }],
      template: 'import json\nfrom types import SimpleNamespace\ndec = json.JSONDecoder(object_hook=lambda d: SimpleNamespace(**d))\ndec.decode({$text})',
      cases: [
        { id: 'nested', label: 'nested',       values: { text: '{"name": "Ada", "team": {"lead": true}}' } },
        { id: 'list',   label: 'list of objects', values: { text: '[{"id": 1}, {"id": 2}]' } },
        { id: 'dupes',  label: 'duplicate key', values: { text: '{"a": {"x": 1}, "a": 2}' } },
        { id: 'scalar', label: 'no objects',   values: { text: '[1, "two"]' } },
      ],
    },
  ],
  demoExplainer: 'raw_decode stops right after the value: "12abc" gives (12, 2), and a leading space is an error at char 0 because nothing is skipped. That is why the loop skips whitespace itself before every call. With strict=True the raw line break is an "Invalid control character"; strict=False keeps it in the string as \\n. An unescaped quote ends the JSON string early, so neither mode can parse that document. In object_hook, keys are shown as name=value, and objects that only exist briefly (the first "a" value) are converted too before the later key replaces them.',

  patterns: [
    {
      name: 'Parse concatenated JSON',
      desc: 'Streams and logs sometimes glue documents together; raw_decode walks through them.',
      code: "import json\n\ndef iter_json(text):\n    dec = json.JSONDecoder()\n    pos = 0\n    while True:\n        while pos < len(text) and text[pos] in ' \\t\\n\\r':\n            pos += 1\n        if pos == len(text):\n            return\n        obj, pos = dec.raw_decode(text, pos)\n        yield obj",
    },
    {
      name: 'Pull JSON out of surrounding text',
      desc: 'Start at the first brace and ignore whatever comes after the object.',
      code: "import json\nstart = text.index('{')\ndata, end = json.JSONDecoder().raw_decode(text, start)",
    },
    {
      name: 'Tolerate raw control characters',
      desc: 'For producers that write tabs or newlines unescaped inside strings.',
      code: 'import json\ndata = json.loads(text, strict=False)  # same as JSONDecoder(strict=False).decode(text)',
    },
  ],

  examples: [
    { title: 'raw_decode: value and end index', code: "import json\njson.JSONDecoder().raw_decode('{\"a\": 1} trailing text')", returns: "({'a': 1}, 8)" },
    { title: 'Start at an offset',              code: "import json\ntext = 'log: {\"level\": \"warn\"} end'\njson.JSONDecoder().raw_decode(text, text.index('{'))", returns: "({'level': 'warn'}, 22)" },
    { title: 'decode() rejects trailing data',  code: "import json\njson.JSONDecoder().decode('{\"a\": 1} x')", returns: 'json.decoder.JSONDecodeError: Extra data: line 1 column 10 (char 9)' },
    { title: 'strict=False: raw tab in a string', code: "import json\njson.JSONDecoder(strict=False).decode('[\"a\\tb\"]')", returns: "['a\\tb']" },
    { title: 'strict=True (the default) refuses it', code: "import json\njson.JSONDecoder().decode('[\"a\\tb\"]')", returns: 'json.decoder.JSONDecodeError: Invalid control character at: line 1 column 4 (char 3)' },
    { title: 'object_pairs_hook sees every pair', code: "import json\njson.JSONDecoder(object_pairs_hook=list).decode('{\"a\": 1, \"a\": 2}')", returns: "[('a', 1), ('a', 2)]" },
    { title: 'Keep floats as text',            code: "import json\njson.JSONDecoder(parse_float=str).decode('[1.10, 2]')", returns: "['1.10', 2]" },
    { title: 'bytes work in loads, not here',  code: "import json\njson.JSONDecoder().decode(b'[1]')", returns: 'TypeError: cannot use a string pattern on a bytes-like object' },
  ],

  pitfalls: [
    {
      name: 'Leading whitespace in raw_decode',
      desc: 'raw_decode starts parsing exactly at idx. Skip the whitespace yourself (decode and loads do it for you).',
      wrong: { label: 'raw_decode(text)', code: "import json\ntext = '  {\"a\": 1}'\njson.JSONDecoder().raw_decode(text)", output: 'json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)' },
      fix:   { label: 'skip it first',    code: "import json\ntext = '  {\"a\": 1}'\nidx = len(text) - len(text.lstrip(' \\t\\n\\r'))\njson.JSONDecoder().raw_decode(text, idx)", output: "({'a': 1}, 10)" },
    },
    {
      name: 'json.loads on concatenated documents',
      desc: 'loads (and decode) require exactly one value. Several values in a row are "Extra data" — walk them with raw_decode.',
      wrong: { label: 'json.loads', code: "import json\njson.loads('{\"a\": 1}{\"b\": 2}')", output: 'json.decoder.JSONDecodeError: Extra data: line 1 column 9 (char 8)' },
      fix:   { label: 'raw_decode loop', code: "import json\ntext = '{\"a\": 1}{\"b\": 2}'\ndec = json.JSONDecoder()\nitems, pos = [], 0\nwhile pos < len(text):\n    obj, pos = dec.raw_decode(text, pos)\n    items.append(obj)\nitems", output: "[{'a': 1}, {'b': 2}]" },
    },
    {
      name: 'Expecting strict=False to accept sloppy JSON',
      desc: 'strict only concerns control characters inside strings. Single quotes, trailing commas and comments are still errors; a Python literal needs ast.literal_eval.',
      wrong: { label: 'strict=False', code: "import json\njson.JSONDecoder(strict=False).decode(\"{'a': 1}\")", output: 'json.decoder.JSONDecodeError: Expecting property name enclosed in double quotes: line 1 column 2 (char 1)' },
      fix:   { label: 'ast.literal_eval', code: "import ast\nast.literal_eval(\"{'a': 1}\")", output: "{'a': 1}" },
    },
  ],

  when: {
    use: [
      'Several JSON values in one string (concatenated output, a log line with JSON in it)',
      'Knowing where a JSON value ends inside larger text',
      'A decoder with fixed hooks you reuse many times',
    ],
    avoid: [
      'Plain parsing → json.loads (also accepts bytes, and checks for a BOM)',
      'One document per line → json.loads on each line',
      'Lenient JSON (comments, trailing commas) → a JSON5 / HJSON library',
    ],
  },

  notes: {
    cpython:          'Lib/json/decoder.py with the C scanner from Modules/_json.c; decode(s) skips whitespace, calls raw_decode, then raises Extra data if anything but whitespace is left',
    'Whitespace':     'Only space, tab, \\n and \\r count as JSON whitespace — decode skips those, raw_decode skips nothing',
    'vs json.loads':  'loads also accepts bytes (detecting UTF-8/16/32) and rejects a leading BOM with its own message; decode() needs str and reports a BOM as "Expecting value"',
    'Hooks':          'object_pairs_hook takes priority over object_hook when both are given',
  },

  related: [
    { name: 'json.loads',      slug: 'loads',           when: 'The one-call way to decode' },
    { name: 'JSONDecodeError', slug: 'jsondecodeerror', when: 'What decode and raw_decode raise' },
    { name: 'JSONEncoder',     slug: 'jsonencoder',     when: 'The encoding counterpart' },
    { name: 'json.load',       slug: 'load',            when: 'Decode a file' },
    { name: 'json module',     slug: 'json',            when: 'Overview', category: 'stdlib' },
    { name: 'while',           slug: 'while',           when: 'The raw_decode loop', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I parse multiple JSON objects from one string?',
      a: 'If they are one per line, call json.loads on each line. If they are glued together or separated by arbitrary whitespace, loop with JSONDecoder().raw_decode(text, pos): it returns the value and the index where it ended, which is where the next one starts (skip whitespace first).',
    },
    {
      q: 'What does strict=False do in json?',
      a: 'It lets strings contain raw control characters — tabs, newlines and the rest of U+0000 to U+001F — which standard JSON requires to be escaped. It does not allow single quotes, trailing commas or comments.',
    },
    {
      q: 'What is the difference between decode() and raw_decode()?',
      a: 'decode(s) skips surrounding whitespace and requires the whole string to be exactly one JSON value (otherwise "Extra data"). raw_decode(s, idx) parses one value starting exactly at idx and returns (value, end), ignoring anything after it.',
    },
    {
      q: 'When would I create a JSONDecoder instead of calling json.loads?',
      a: 'For raw_decode, or to build a decoder once with fixed hooks and reuse it. json.loads(s, **kw) itself creates a JSONDecoder(**kw) when you pass options (or reuses a shared default one when you do not) and calls its decode().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html#json.JSONDecoder',
    meta:  'json.JSONDecoder',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Validate a single document' },
  ],
};
