// content/reference/python/stdlib/json/load.js

export const meta = {
  slug:        'load',
  name:        'json.load',
  signature:   'json.load(fp, *, cls=None, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, object_pairs_hook=None, **kw)',
  blurb:       'Read a JSON document from a file object and parse it into Python objects — json.loads(fp.read()) in one call.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'json load python json.load read json file parse file object open utf-8-sig unexpected utf-8 bom str object has no attribute read extra data json lines',
};

export const method = {
  slug:      'load',
  name:      'json.load',
  signature: 'json.load(fp, *, cls=None, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, object_pairs_hook=None, **kw)',
  returns:   { type: 'dict | list | str | int | float | bool | None', desc: 'The Python value of the JSON document in the file.' },

  category:    'json function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Hand it an open file, get back dicts and lists. It reads the whole file as ONE document — a second document, an empty file or a byte-order mark decoded as plain UTF-8 text all end in JSONDecodeError.',

  covers: ['load'],

  cheat: {
    commonCall: "with open(path, encoding='utf-8') as f: data = json.load(f)",
    returns:    'dict, list, str, int, float, bool or None',
    replaces:   'json.loads(f.read())',
    watchOut:   'it takes a file object, not a file name',
  },

  parameters: [
    { name: 'fp',                type: 'file object', required: true,  default: null,   desc: 'Anything with a read() method returning the whole document: a file opened in text mode, a binary file (UTF-8/16/32 detected, BOM accepted), io.StringIO, io.BytesIO.' },
    { name: 'object_hook',       type: 'callable',    required: false, default: 'None', desc: 'Called with every decoded dict; its return value replaces the dict.' },
    { name: 'object_pairs_hook', type: 'callable',    required: false, default: 'None', desc: 'Called with the list of (key, value) pairs of every object, duplicates included.' },
    { name: 'parse_float',       type: 'callable',    required: false, default: 'None', desc: 'Called with the text of every JSON float — decimal.Decimal for exact values.' },
    { name: 'parse_int',         type: 'callable',    required: false, default: 'None', desc: 'Called with the text of every JSON int.' },
    { name: 'parse_constant',    type: 'callable',    required: false, default: 'None', desc: "Called with '-Infinity', 'Infinity' or 'NaN'." },
    { name: 'cls',               type: 'JSONDecoder subclass', required: false, default: 'None', desc: 'Custom decoder class; the other keyword arguments are passed to it.' },
  ],

  modes: [
    {
      id: 'stringio',
      label: 'file-like object',
      blurb: 'io.StringIO turns a str into an in-memory file — json.load reads it exactly like a file on disk.',
      params: [{ name: 'text', type: 'str', hint: 'the file content', input: 'text' }],
      template: 'import io, json\njson.load(io.StringIO({$text}))',
      cases: [
        { id: 'object', label: 'object',        values: { text: '{"debug": true, "port": 8080}' } },
        { id: 'quotes', label: 'single quotes', values: { text: "{'debug': True}" } },
        { id: 'empty',  label: 'empty file',    values: { text: '' } },
      ],
    },
    {
      id: 'bom',
      label: 'BOM',
      blurb: "The text is saved with encoding='utf-8-sig' (a byte-order mark first, as some Windows editors do), then read back with 'utf-8' and with 'utf-8-sig'. On a JSONDecodeError the function returns its msg.",
      params: [{ name: 'text', type: 'str', hint: 'the file content', input: 'text' }],
      template: "import json\nfrom pathlib import Path\nPath('data.json').write_text({$text}, encoding='utf-8-sig')\ndef read(encoding):\n    with open('data.json', encoding=encoding) as f:\n        try:\n            return json.load(f)\n        except json.JSONDecodeError as e:\n            return e.msg\n(read('utf-8'), read('utf-8-sig'))",
      cases: [
        { id: 'object', label: 'object',       values: { text: '{"name": "Zoë"}' } },
        { id: 'array',  label: 'array',        values: { text: '[1, 2, 3]' } },
        { id: 'bad',    label: 'invalid JSON', values: { text: '[1, 2,]' } },
      ],
    },
    {
      id: 'ndjson',
      label: 'JSON Lines',
      blurb: 'Two documents, one per line. json.load sees one text with extra data; reading line by line parses each.',
      params: [
        { name: 'first',  type: 'str', hint: 'line 1', input: 'text' },
        { name: 'second', type: 'str', hint: 'line 2', input: 'text' },
      ],
      template: "import io, json\ntext = {$first} + '\\n' + {$second} + '\\n'\ntry:\n    whole = json.load(io.StringIO(text))\nexcept json.JSONDecodeError as e:\n    whole = str(e)\n(whole, [json.loads(line) for line in io.StringIO(text)])",
      cases: [
        { id: 'two',     label: 'two objects',  values: { first: '{"id": 1}', second: '{"id": 2}' } },
        { id: 'numbers', label: 'two numbers',  values: { first: '1', second: '2' } },
        { id: 'badline', label: 'a bad line',   values: { first: '{"id": 1}', second: '{"id": 2,}' } },
      ],
    },
  ],
  demoExplainer: "json.load checks for the BOM itself: reading the utf-8-sig file with plain 'utf-8' leaves U+FEFF at the start of the text, and load refuses it with 'Unexpected UTF-8 BOM (decode using utf-8-sig)'. 'utf-8-sig' strips it. In JSON Lines, load parses the first line, then finds more text: 'Extra data' at line 2, column 1. A bad line is not caught by the try, so its error surfaces from the list comprehension.",

  patterns: [
    {
      name: 'Read a JSON file',
      desc: 'Always name the encoding — the default depends on the platform.',
      code: "import json\nwith open('config.json', encoding='utf-8') as f:\n    config = json.load(f)",
    },
    {
      name: 'Accept files with or without a BOM',
      desc: "'utf-8-sig' reads plain UTF-8 too, and drops a leading byte-order mark if there is one.",
      code: "import json\nwith open(path, encoding='utf-8-sig') as f:\n    data = json.load(f)",
    },
    {
      name: 'Read JSON Lines',
      desc: 'One document per line: parse the lines, skip blank ones.',
      code: "import json\nwith open('events.jsonl', encoding='utf-8') as f:\n    events = [json.loads(line) for line in f if line.strip()]",
    },
    {
      name: 'Report where the file is broken',
      desc: 'JSONDecodeError carries line and column.',
      code: "import json\ntry:\n    with open(path, encoding='utf-8') as f:\n        data = json.load(f)\nexcept json.JSONDecodeError as e:\n    raise SystemExit(f'{path}:{e.lineno}:{e.colno}: {e.msg}')",
    },
  ],

  examples: [
    { title: 'Read a file',               code: "import json\nwith open('config.json', 'w', encoding='utf-8') as f:\n    f.write('{\"debug\": true, \"port\": 8080}')\nwith open('config.json', encoding='utf-8') as f:\n    config = json.load(f)\nconfig", returns: "{'debug': True, 'port': 8080}" },
    { title: 'Any object with read()',     code: "import io, json\njson.load(io.StringIO('[1, 2]'))", returns: '[1, 2]' },
    { title: 'Binary mode handles the BOM', code: "import json\nwith open('bom.json', 'wb') as f:\n    f.write(b'\\xef\\xbb\\xbf{\"a\": 1}')\nwith open('bom.json', 'rb') as f:\n    data = json.load(f)\ndata", returns: "{'a': 1}" },
    { title: 'Binary mode detects UTF-16', code: "import json\nwith open('u16.json', 'w', encoding='utf-16') as f:\n    f.write('{\"name\": \"Zoë\"}')\nwith open('u16.json', 'rb') as f:\n    data = json.load(f)\ndata", returns: "{'name': 'Zoë'}" },
    { title: 'It reads to the end',       code: "import io, json\nf = io.StringIO('[1] ')\n(json.load(f), f.read())", returns: "([1], '')" },
    { title: 'Exact decimals',            code: "import io, json\nfrom decimal import Decimal\njson.load(io.StringIO('{\"price\": 19.99}'), parse_float=Decimal)", returns: "{'price': Decimal('19.99')}" },
    { title: 'An empty file',             code: "import json\nopen('empty.json', 'w').close()\nwith open('empty.json', encoding='utf-8') as f:\n    data = json.load(f)", returns: 'json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)' },
  ],

  pitfalls: [
    {
      name: 'Passing the file name',
      desc: 'load calls .read() on its argument, and a str has no read(). Open the file first (json.loads would try to parse the name itself).',
      wrong: { label: 'load(path)', code: "import json\njson.load('config.json')", output: "AttributeError: 'str' object has no attribute 'read'" },
      fix:   { label: 'load(open file)', code: "import json\nfrom pathlib import Path\nPath('config.json').write_text('{\"ok\": true}', encoding='utf-8')\nwith open('config.json', encoding='utf-8') as f:\n    data = json.load(f)\ndata", output: "{'ok': True}" },
    },
    {
      name: 'A byte-order mark at the start',
      desc: "Files saved as \"UTF-8 with BOM\" start with U+FEFF. Read as 'utf-8', the mark is part of the text and load rejects it; 'utf-8-sig' removes it.",
      wrong: { label: "encoding='utf-8'",     code: "import json\nfrom pathlib import Path\nPath('data.json').write_text('{\"a\": 1}', encoding='utf-8-sig')\nwith open('data.json', encoding='utf-8') as f:\n    data = json.load(f)", output: 'json.decoder.JSONDecodeError: Unexpected UTF-8 BOM (decode using utf-8-sig): line 1 column 1 (char 0)' },
      fix:   { label: "encoding='utf-8-sig'", code: "import json\nfrom pathlib import Path\nPath('data.json').write_text('{\"a\": 1}', encoding='utf-8-sig')\nwith open('data.json', encoding='utf-8-sig') as f:\n    data = json.load(f)\ndata", output: "{'a': 1}" },
    },
    {
      name: 'JSON Lines is not one JSON document',
      desc: 'A .jsonl / NDJSON file has one document per line. load parses the first and fails on the rest.',
      wrong: { label: 'json.load(f)', code: "import json\nfrom pathlib import Path\nPath('log.jsonl').write_text('{\"id\": 1}\\n{\"id\": 2}\\n', encoding='utf-8')\nwith open('log.jsonl', encoding='utf-8') as f:\n    data = json.load(f)", output: 'json.decoder.JSONDecodeError: Extra data: line 2 column 1 (char 10)' },
      fix:   { label: 'line by line', code: "import json\nfrom pathlib import Path\nPath('log.jsonl').write_text('{\"id\": 1}\\n{\"id\": 2}\\n', encoding='utf-8')\nwith open('log.jsonl', encoding='utf-8') as f:\n    data = [json.loads(line) for line in f]\ndata", output: "[{'id': 1}, {'id': 2}]" },
    },
    {
      name: 'Loading the same file object twice',
      desc: 'The first load read to the end; the second gets an empty string. Rewind with seek(0), or keep the result.',
      wrong: { label: 'load, load', code: "import io, json\nf = io.StringIO('{\"a\": 1}')\ndata = json.load(f)\nagain = json.load(f)", output: 'json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)' },
      fix:   { label: 'seek(0)',    code: "import io, json\nf = io.StringIO('{\"a\": 1}')\ndata = json.load(f)\nf.seek(0)\nagain = json.load(f)\nagain", output: "{'a': 1}" },
    },
  ],

  when: {
    use: [
      'Reading a .json file (config, fixtures, exported data)',
      'Parsing a response or stream object that has read()',
    ],
    avoid: [
      'You already have the text → json.loads',
      'JSON Lines / NDJSON files → json.loads per line',
      'Huge files you want to stream → a streaming parser (load always reads everything into memory)',
    ],
  },

  notes: {
    cpython:      'Lib/json/__init__.py: load(fp, **kw) is loads(fp.read(), **kw) — every error and option is the same as json.loads',
    'Binary files': 'fp.read() returning bytes is fine: loads detects UTF-8, UTF-16 or UTF-32 from the first bytes and accepts a UTF-8 BOM',
    'Text files':   "In text mode the file's encoding decodes the bytes before json sees them — a UTF-8 BOM survives 'utf-8' decoding and is rejected",
  },

  related: [
    { name: 'json.loads',      slug: 'loads',           when: 'Parse a str you already have' },
    { name: 'json.dump',       slug: 'dump',            when: 'Write the file' },
    { name: 'JSONDecodeError', slug: 'jsondecodeerror', when: 'What a broken file raises' },
    { name: 'json module',     slug: 'json',            when: 'Overview', category: 'stdlib' },
    { name: 'open()',          slug: 'open',            when: 'Get the file object', category: 'functions' },
    { name: 'AttributeError',  slug: 'attributeerror',  when: "'str' object has no attribute 'read'", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between json.load and json.loads?',
      a: 'load takes a file object and reads it; loads takes the JSON text itself (str or bytes). json.load(f) is exactly json.loads(f.read()).',
    },
    {
      q: "How do I fix \"Unexpected UTF-8 BOM (decode using utf-8-sig)\"?",
      a: "The file starts with a UTF-8 byte-order mark (editors write one when you save as \"UTF-8 with BOM\"). Open it with encoding='utf-8-sig', which also reads files without a BOM, or open it in binary mode ('rb') — json accepts the BOM in bytes.",
    },
    {
      q: "Why do I get \"'str' object has no attribute 'read'\" from json.load?",
      a: 'You passed a file name or the JSON text. json.load needs an open file: with open(path, encoding=\'utf-8\') as f: data = json.load(f). If you have the text, use json.loads.',
    },
    {
      q: 'Why does json.load say "Extra data"?',
      a: 'The file holds more than one JSON document — typically JSON Lines (one object per line) or two documents written one after another. Parse it line by line with json.loads, or use JSONDecoder.raw_decode to walk through concatenated documents.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html#json.load',
    meta:  'json.load',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Find the error in a file' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Browse what you loaded' },
  ],
};
