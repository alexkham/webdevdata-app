// content/reference/python/stdlib/json/dump.js

export const meta = {
  slug:        'dump',
  name:        'json.dump',
  signature:   'json.dump(obj, fp, *, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, default=None, sort_keys=False, **kw)',
  blurb:       'Serialize a Python object as JSON and write it to a file object — the file-writing twin of json.dumps.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'json dump python json.dump write json to file save dict as json file object indent encoding utf-8 a bytes-like object is required not str returns none json lines',
};

export const method = {
  slug:      'dump',
  name:      'json.dump',
  signature: 'json.dump(obj, fp, *, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, default=None, sort_keys=False, **kw)',
  returns:   { type: 'None', desc: 'Nothing — the JSON goes into fp. Use json.dumps when you want the text.' },

  category:    'json function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Writes JSON into anything with a write() method, piece by piece as it is produced — which is why an error half-way leaves half a file behind.',

  covers: ['dump'],

  cheat: {
    commonCall: "json.dump(data, f, indent=2, ensure_ascii=False)",
    returns:    'None — the JSON is in the file',
    replaces:   'f.write(json.dumps(data))',
    watchOut:   "open the file in text mode ('w', encoding='utf-8'), not 'wb'",
  },

  parameters: [
    { name: 'obj',          type: 'any',        required: true,  default: null,    desc: 'The data: dict, list, tuple, str, int, float, bool, None — anything else goes through default.' },
    { name: 'fp',           type: 'text file',  required: true,  default: null,    desc: "Any object with a write(str) method: a file opened with 'w' or 'a', io.StringIO, sys.stdout. A binary file ('wb') raises TypeError on the first write." },
    { name: 'indent',       type: 'int | str | None', required: false, default: 'None', desc: 'Pretty-print with this many spaces (or this string) per level; None writes one line.' },
    { name: 'ensure_ascii', type: 'bool',       required: false, default: 'True',  desc: 'Escape non-ASCII as \\uXXXX. With False the file contains the characters themselves — open it with encoding=\'utf-8\'.' },
    { name: 'sort_keys',    type: 'bool',       required: false, default: 'False', desc: 'Write dict keys in sorted order.' },
    { name: 'separators',   type: 'tuple[str, str]', required: false, default: 'None', desc: "(item_separator, key_separator) — (',', ':') for the most compact file." },
    { name: 'default',      type: 'callable',   required: false, default: 'None',  desc: 'Converts objects json does not know (dates, sets, Decimal) into ones it does.' },
    { name: 'allow_nan',    type: 'bool',       required: false, default: 'True',  desc: 'False raises ValueError for NaN and Infinity instead of writing them.' },
    { name: 'skipkeys',     type: 'bool',       required: false, default: 'False', desc: 'Drop dict keys of unsupported types instead of raising TypeError.' },
    { name: 'check_circular', type: 'bool',     required: false, default: 'True',  desc: 'Detect self-containing lists and dicts (ValueError).' },
    { name: 'cls',          type: 'JSONEncoder subclass', required: false, default: 'None', desc: 'Encoder class to use.' },
  ],

  modes: [
    {
      id: 'buffer',
      label: 'write to StringIO',
      blurb: 'io.StringIO is an in-memory text file — getvalue() shows exactly what a real file would contain.',
      params: [
        { name: 'name',   type: 'str',        hint: 'any text',             input: 'text' },
        { name: 'tags',   type: 'list[str]',  hint: 'comma-separated',      input: 'csv' },
        { name: 'indent', type: 'int | None', hint: 'spaces, empty = None', input: 'number-or-none' },
      ],
      template: "import io, json\nbuf = io.StringIO()\njson.dump({'name': {$name}, 'tags': {$tags}}, buf, indent={$indent})\nbuf.getvalue()",
      cases: [
        { id: 'one',    label: 'one line',  values: { name: 'Ada', tags: 'admin, dev', indent: '' } },
        { id: 'pretty', label: 'indent=2',  values: { name: 'Ada', tags: 'admin, dev', indent: '2' } },
        { id: 'accent', label: 'non-ASCII', values: { name: 'Zoë', tags: 'café', indent: '' } },
      ],
    },
    {
      id: 'chunks',
      label: 'write() calls',
      blurb: 'dump only needs an object with write(). This one records every call — dump writes the JSON in many small pieces, not in one go.',
      params: [
        { name: 'name', type: 'str',       hint: 'any text',        input: 'text' },
        { name: 'tags', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
      ],
      template: "import json\nclass Recorder:\n    def __init__(self):\n        self.calls = []\n    def write(self, s):\n        self.calls.append(s)\nrec = Recorder()\njson.dump({'name': {$name}, 'tags': {$tags}}, rec)\nrec.calls",
      cases: [
        { id: 'two',   label: 'two tags',   values: { name: 'Ada', tags: 'admin, dev' } },
        { id: 'empty', label: 'no tags',    values: { name: 'Ada', tags: '' } },
      ],
    },
    {
      id: 'partial',
      label: 'error half-way',
      blurb: "The 'seen' value is a set, which json cannot write. Everything before it is already in the file when the TypeError is raised.",
      params: [
        { name: 'name', type: 'str',       hint: 'any text',        input: 'text' },
        { name: 'tags', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
      ],
      template: "import io, json\nbuf = io.StringIO()\ntry:\n    json.dump({'name': {$name}, 'tags': {$tags}, 'seen': set({$tags})}, buf)\nexcept TypeError:\n    pass\nbuf.getvalue()",
      cases: [
        { id: 'two',   label: 'two tags', values: { name: 'Ada', tags: 'admin, dev' } },
        { id: 'empty', label: 'no tags',  values: { name: 'Ada', tags: '' } },
      ],
    },
  ],
  demoExplainer: 'With indent=2 the file gets one item per line and no newline at the very end — dump never adds one. In "write() calls", a dict is written key, ": ", value and ", " as separate pieces, while each list item travels together with the [ or ", " in front of it — ["admin" is one write, , "dev" the next. In "error half-way", the file ends right after "seen": — the key was written before json found out it could not write the value.',

  patterns: [
    {
      name: 'Write a JSON file',
      desc: 'Text mode with an explicit encoding, so non-ASCII output is portable.',
      code: "import json\nwith open('data.json', 'w', encoding='utf-8') as f:\n    json.dump(data, f, indent=2, ensure_ascii=False)",
    },
    {
      name: 'Never leave a broken file behind',
      desc: 'Serialize first, then write to a temporary file and swap it in — the old file survives any error.',
      code: "import json, os\ntext = json.dumps(data, indent=2)\nwith open('data.json.tmp', 'w', encoding='utf-8') as f:\n    f.write(text)\nos.replace('data.json.tmp', 'data.json')",
    },
    {
      name: 'Append records as JSON Lines',
      desc: 'One JSON document per line — appendable, streamable, and every line parses on its own.',
      code: "import json\nwith open('events.jsonl', 'a', encoding='utf-8') as f:\n    json.dump(event, f)\n    f.write('\\n')",
    },
  ],

  examples: [
    { title: 'Write, then read the file',  code: "import json\nwith open('out.json', 'w', encoding='utf-8') as f:\n    json.dump({'a': [1, 2]}, f)\nwith open('out.json', encoding='utf-8') as f:\n    text = f.read()\ntext", returns: `'{"a": [1, 2]}'` },
    { title: 'dump returns None',          code: "import io, json\nresult = json.dump({'a': 1}, io.StringIO())\nresult is None", returns: 'True' },
    { title: 'Pretty and non-ASCII',       code: "import json\nwith open('city.json', 'w', encoding='utf-8') as f:\n    json.dump({'city': 'Zürich', 'zip': ['8001']}, f, indent=2, ensure_ascii=False)\nwith open('city.json', encoding='utf-8') as f:\n    lines = f.read().splitlines()\nlines", returns: `['{', '  "city": "Zürich",', '  "zip": [', '    "8001"', '  ]', '}']` },
    { title: 'No trailing newline',        code: "import io, json\nbuf = io.StringIO()\njson.dump([1], buf)\nbuf.getvalue()", returns: "'[1]'" },
    { title: 'JSON Lines: one per line',   code: "import json\nwith open('log.jsonl', 'a', encoding='utf-8') as f:\n    for event in [{'id': 1}, {'id': 2}]:\n        json.dump(event, f)\n        f.write('\\n')\nwith open('log.jsonl', encoding='utf-8') as f:\n    lines = f.read().splitlines()\nlines", returns: `['{"id": 1}', '{"id": 2}']` },
    { title: 'Straight to stdout',         code: "import json, sys\njson.dump({'ok': True}, sys.stdout)", returns: '{"ok": true}' },
    { title: 'A file name is not a file',  code: "import json\njson.dump({'a': 1}, 'out.json')", returns: "AttributeError: 'str' object has no attribute 'write'" },
  ],

  pitfalls: [
    {
      name: 'Opening the file in binary mode',
      desc: "dump writes str, so the file must be opened in text mode. 'wb' fails on the first write.",
      wrong: { label: "'wb'", code: "import json\nwith open('out.json', 'wb') as f:\n    json.dump({'a': 1}, f)", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "'w', encoding='utf-8'", code: "import json\nwith open('out.json', 'w', encoding='utf-8') as f:\n    json.dump({'a': 1}, f)\nwith open('out.json', encoding='utf-8') as f:\n    text = f.read()\ntext", output: `'{"a": 1}'` },
    },
    {
      name: 'A half-written file after an error',
      desc: 'dump writes as it encodes. When it meets something it cannot serialize, the part before is already in the file — and the old content is gone, because opening with \'w\' emptied it.',
      wrong: { label: 'dump into the file', code: "import json\ntry:\n    with open('out.json', 'w', encoding='utf-8') as f:\n        json.dump({'id': 7, 'tags': {'a'}}, f)\nexcept TypeError:\n    pass\nwith open('out.json', encoding='utf-8') as f:\n    text = f.read()\ntext", output: `'{"id": 7, "tags": '` },
      fix:   { label: 'dumps first, then write', code: "import json, os\ntry:\n    text = json.dumps({'id': 7, 'tags': {'a'}})\n    with open('out.json', 'w', encoding='utf-8') as f:\n        f.write(text)\nexcept TypeError:\n    pass\nos.path.exists('out.json')", output: 'False' },
    },
    {
      name: 'Expecting a string back',
      desc: 'dump needs a file and returns None. For the JSON text, use dumps.',
      wrong: { label: 'json.dump(x)',  code: "import json\ntext = json.dump({'a': 1})", output: "TypeError: dump() missing 1 required positional argument: 'fp'" },
      fix:   { label: 'json.dumps(x)', code: "import json\ntext = json.dumps({'a': 1})\ntext", output: `'{"a": 1}'` },
    },
  ],

  when: {
    use: [
      'Saving data, config or results to a .json file',
      'Writing to any text stream — sys.stdout, a socket wrapper, io.StringIO',
      'Appending JSON Lines records, one dump plus a newline each',
    ],
    avoid: [
      'You need the text itself → json.dumps',
      'The data might not serialize and a broken file would hurt → json.dumps first, then write',
      'Binary streams → write json.dumps(data).encode() instead',
    ],
  },

  notes: {
    cpython:        'Lib/json/__init__.py: dump iterates JSONEncoder(...).iterencode(obj) and calls fp.write(chunk) for every chunk — the pure-Python encoder, never the one-shot C path dumps uses',
    'Output':       'Exactly what dumps would return for the same arguments; no trailing newline',
    'Encoding':     "With ensure_ascii=True (the default) the output is pure ASCII; with False, the file's encoding matters — pass encoding='utf-8' to open()",
  },

  related: [
    { name: 'json.dumps',  slug: 'dumps',       when: 'Same options, returns a str' },
    { name: 'json.load',   slug: 'load',        when: 'Read the file back' },
    { name: 'JSONEncoder', slug: 'jsonencoder', when: 'iterencode — the chunks dump writes' },
    { name: 'json module', slug: 'json',        when: 'Overview', category: 'stdlib' },
    { name: 'open()',      slug: 'open',        when: "Get the file: 'w', encoding='utf-8'", category: 'functions' },
    { name: 'with',        slug: 'with',        when: 'Close (and flush) the file reliably', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I write JSON to a file in Python?',
      a: "Open the file in text mode and pass it to dump: with open('data.json', 'w', encoding='utf-8') as f: json.dump(data, f, indent=2). Use ensure_ascii=False if you want non-ASCII characters written as they are.",
    },
    {
      q: "Why does json.dump raise \"a bytes-like object is required, not 'str'\"?",
      a: "The file was opened in binary mode ('wb'). json.dump writes str chunks, so open it with 'w' (and encoding='utf-8'), or write json.dumps(data).encode('utf-8') to the binary file yourself.",
    },
    {
      q: 'How do I append to a JSON file?',
      a: 'A JSON file holds one document, so appending a second one makes it invalid. Either load it, change the data and dump it again, or switch to JSON Lines: open with \'a\' and write one json.dump(record, f) plus a newline per record.',
    },
    {
      q: 'Why is my JSON file empty or cut off?',
      a: "Either an exception interrupted dump (the part written before the error stays, and 'w' already erased the old content), or the file was never closed so the buffer was not flushed. Use a with block, and serialize with dumps first if the data might fail.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/json.html#json.dump',
    meta:  'json.dump',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Check the file you wrote' },
  ],
};
