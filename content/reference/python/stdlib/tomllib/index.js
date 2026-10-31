// content/reference/python/stdlib/tomllib/index.js — the tomllib module hub

export const meta = {
  slug:        'index',
  name:        'tomllib',
  signature:   'import tomllib',
  blurb:       'Parse TOML (pyproject.toml, app config files) into a dict of real ints, floats, booleans, lists and datetime objects. Read-only: load, loads and TOMLDecodeError.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'tomllib module python toml parser read toml file pyproject.toml parse config toml to dict load loads tomldecodeerror tomli tomli-w write toml dump toml python 3.11 rb binary mode toml datetime array of tables',
};

export const method = {
  slug: 'index',
  name: 'tomllib',

  category:    'Data formats',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'Two functions and one exception: loads parses a str, load parses a file opened in binary mode, and anything that is not valid TOML raises TOMLDecodeError with the line and column. Values arrive typed — 8080 is an int, true is a bool, a timestamp is a datetime — and there is deliberately no dump.',

  imports: ['import tomllib', 'from tomllib import load, loads, TOMLDecodeError'],
  facts: [
    { label: 'Public API', value: 'load, loads, TOMLDecodeError' },
    { label: 'Spec',       value: 'TOML 1.0.0 in Python 3.11 to 3.14; Python 3.15 adds TOML 1.1.0 (optional seconds, \\xHH and \\e escapes, multi-line inline tables)' },
    { label: 'Writing',    value: 'Not supported. The docs point to the third-party Tomli-W package for writing and TOML Kit for style-preserving edits' },
    { label: 'Source',     value: 'Lib/tomllib/ in pure Python, based on the third-party tomli parser (PEP 680)' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'TOML → dict',
      blurb: 'Type a small TOML document, one line per box (empty boxes are blank lines). The result is the dict tomllib.loads returns.',
      params: [
        { name: 'line1', type: 'str', hint: 'TOML line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'TOML line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'TOML line 3', input: 'text' },
        { name: 'line4', type: 'str', hint: 'TOML line 4', input: 'text' },
      ],
      template: "import tomllib\ndoc = '\\n'.join([\n    {$line1},\n    {$line2},\n    {$line3},\n    {$line4},\n])\ntomllib.loads(doc)",
      cases: [
        { id: 'server', label: 'a table',          values: { line1: '[server]', line2: 'host = "localhost"', line3: 'port = 8080', line4: 'debug = true' } },
        { id: 'aot',    label: 'array of tables',  values: { line1: '[[user]]', line2: 'name = "Ada"', line3: '[[user]]', line4: 'name = "Grace"' } },
        { id: 'dotted', label: 'dotted keys',      values: { line1: 'site.name = "Docs"', line2: 'site.owner.email = "ada@example.com"', line3: 'site.tags = ["python", "toml"]', line4: '' } },
        { id: 'dup',    label: 'duplicate key',    values: { line1: '[server]', line2: 'port = 8080', line3: 'port = 9090', line4: '' } },
        { id: 'ini',    label: 'unquoted string',  values: { line1: '[server]', line2: 'host = localhost', line3: '', line4: '' } },
      ],
    },
    {
      id: 'types',
      label: 'type mapping',
      blurb: 'Which Python type each top-level value becomes.',
      params: [
        { name: 'line1', type: 'str', hint: 'key = value', input: 'text' },
        { name: 'line2', type: 'str', hint: 'key = value', input: 'text' },
        { name: 'line3', type: 'str', hint: 'key = value', input: 'text' },
        { name: 'line4', type: 'str', hint: 'key = value', input: 'text' },
      ],
      template: "import tomllib\ndoc = '\\n'.join([\n    {$line1},\n    {$line2},\n    {$line3},\n    {$line4},\n])\n{key: type(value).__name__ for key, value in tomllib.loads(doc).items()}",
      cases: [
        { id: 'scalars', label: 'scalars',         values: { line1: 'count = 3', line2: 'ratio = 0.5', line3: 'on = true', line4: 'name = "x"' } },
        { id: 'dates',   label: 'dates and times', values: { line1: 'stamp = 2026-10-31T09:30:00Z', line2: 'local = 2026-10-31T09:30:00', line3: 'day = 2026-10-31', line4: 'alarm = 07:15:00' } },
        { id: 'nested',  label: 'containers',      values: { line1: 'ports = [80, 443]', line2: 'point = {x = 1, y = 2}', line3: 'big = 0xFF', line4: 'limit = inf' } },
      ],
    },
    {
      id: 'error',
      label: 'find the error',
      blurb: 'Catch TOMLDecodeError: its message ends with the position where parsing stopped.',
      params: [
        { name: 'line1', type: 'str', hint: 'TOML line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'TOML line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'TOML line 3', input: 'text' },
      ],
      template: "import tomllib\ndoc = '\\n'.join([{$line1}, {$line2}, {$line3}])\ntry:\n    result = tomllib.loads(doc)\nexcept tomllib.TOMLDecodeError as e:\n    result = str(e)\nresult",
      cases: [
        { id: 'comma',  label: 'missing comma',   values: { line1: '[deps]', line2: 'names = ["a" "b"]', line3: '' } },
        { id: 'quote',  label: 'unclosed string', values: { line1: 'title = "Report', line2: 'year = 2026', line3: '' } },
        { id: 'twice',  label: 'table twice',     values: { line1: '[db]', line2: 'user = "app"', line3: '[db]' } },
        { id: 'ok',     label: 'valid',           values: { line1: 'a = 1', line2: 'b = [1, 2]', line3: '' } },
      ],
    },
  ],
  demoExplainer: 'port = 8080 comes back as the int 8080 and true as True: TOML values carry their type, which is the main difference from INI files and configparser, where every value is a str. [[user]] twice builds a list of two dicts, and dotted keys create nested dicts. Setting port twice raises "Cannot overwrite a value (at line 3, column 12)": the reported position is just after the second value, where the parser checked the key. An unquoted string such as localhost is not a TOML value at all, so the error points at its first letter (line 2, column 8).',

  patterns: [
    {
      name: 'Read pyproject.toml',
      desc: 'load needs a binary file: open with "rb", no encoding argument (TOML is always UTF-8).',
      code: "import tomllib\nwith open('pyproject.toml', 'rb') as f:\n    project = tomllib.load(f)['project']\nproject['name'], project.get('dependencies', [])",
    },
    {
      name: 'Defaults plus a config file',
      desc: 'Merge the parsed table over your defaults; keys missing from the file keep their default.',
      code: "import tomllib\nDEFAULTS = {'host': '127.0.0.1', 'port': 8000, 'debug': False}\nwith open('app.toml', 'rb') as f:\n    settings = DEFAULTS | tomllib.load(f).get('server', {})",
    },
    {
      name: 'Exact decimals',
      desc: 'parse_float receives the float text; Decimal keeps every digit.',
      code: "import tomllib\nfrom decimal import Decimal\nprices = tomllib.loads(text, parse_float=Decimal)",
    },
    {
      name: 'Report a broken config',
      desc: 'TOMLDecodeError is a ValueError whose message ends with "(at line L, column C)".',
      code: "import sys, tomllib\ntry:\n    with open('app.toml', 'rb') as f:\n        config = tomllib.load(f)\nexcept tomllib.TOMLDecodeError as e:\n    sys.exit(f'app.toml is not valid TOML: {e}')",
    },
  ],

  examples: [
    { title: 'A table becomes a nested dict', code: "import tomllib\ntomllib.loads('[server]\\nhost = \"localhost\"\\nport = 8080')", returns: "{'server': {'host': 'localhost', 'port': 8080}}" },
    { title: 'Values keep their types',       code: "import tomllib\ndata = tomllib.loads('n = 3\\nx = 2.5\\nok = false\\ntags = [\"a\", \"b\"]')\n[type(v).__name__ for v in data.values()]", returns: "['int', 'float', 'bool', 'list']" },
    { title: 'Array of tables → list of dicts', code: "import tomllib\ntomllib.loads('[[user]]\\nname = \"Ada\"\\n[[user]]\\nname = \"Grace\"')", returns: "{'user': [{'name': 'Ada'}, {'name': 'Grace'}]}" },
    { title: 'Offset date-time → aware datetime', code: "import tomllib\ntomllib.loads('at = 2026-10-31T09:30:00+02:00')['at']", returns: 'datetime.datetime(2026, 10, 31, 9, 30, tzinfo=datetime.timezone(datetime.timedelta(seconds=7200)))' },
    { title: 'Local date → date',             code: "import tomllib\ntomllib.loads('day = 2026-10-31')['day']", returns: 'datetime.date(2026, 10, 31)' },
    { title: 'Read a file in binary mode',    code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'[db]\\nuser = \"app\"\\npool = 5\\n')\nwith open('app.toml', 'rb') as f:\n    config = tomllib.load(f)\nconfig", returns: "{'db': {'user': 'app', 'pool': 5}}" },
    { title: 'Invalid TOML says where',       code: "import tomllib\ntomllib.loads('name = Ada')", returns: 'tomllib.TOMLDecodeError: Invalid value (at line 1, column 8)' },
    { title: 'There is no dump',              code: "import tomllib\nhasattr(tomllib, 'dump'), hasattr(tomllib, 'dumps')", returns: '(False, False)' },
  ],

  pitfalls: [
    {
      name: 'Opening the file in text mode',
      desc: 'load reads bytes and decodes them itself. A text-mode file returns str from read(), and load refuses it.',
      wrong: { label: "open(path)", code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'debug = true\\n')\nwith open('app.toml', encoding='utf-8') as f:\n    tomllib.load(f)", output: "TypeError: File must be opened in binary mode, e.g. use `open('foo.toml', 'rb')`" },
      fix:   { label: "open(path, 'rb')", code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'debug = true\\n')\nwith open('app.toml', 'rb') as f:\n    config = tomllib.load(f)\nconfig", output: "{'debug': True}" },
    },
    {
      name: 'Looking for tomllib.dump',
      desc: 'tomllib only reads. To write TOML, install a writer such as Tomli-W (the package the docs suggest) — or keep the config in a format the standard library writes, like JSON.',
      wrong: { label: 'tomllib.dumps', code: "import tomllib\ntomllib.dumps({'debug': True})", output: "AttributeError: module 'tomllib' has no attribute 'dumps'" },
      fix:   { label: 'json.dumps',    code: "import json\njson.dumps({'debug': True})", output: '\'{"debug": true}\'' },
    },
    {
      name: 'INI habits: unquoted strings',
      desc: 'In INI files everything after = is text. In TOML a string needs quotes; a bare word is an invalid value.',
      wrong: { label: 'host = localhost',   code: "import tomllib\ntomllib.loads('host = localhost')", output: 'tomllib.TOMLDecodeError: Invalid value (at line 1, column 8)' },
      fix:   { label: 'host = "localhost"', code: "import tomllib\ntomllib.loads('host = \"localhost\"')", output: "{'host': 'localhost'}" },
    },
  ],

  when: {
    use: [
      'Reading pyproject.toml and other tool configuration',
      'Application config that needs comments, typed values and nesting',
      'Config files edited by hand — TOML has dates, arrays and tables built in',
    ],
    avoid: [
      'Writing or round-tripping config → a third-party writer (Tomli-W) or TOML Kit to keep comments',
      'Data exchange with web APIs → json',
      'Existing INI files with [sections] and key = value text → configparser',
    ],
  },

  notes: {
    cpython:      'Lib/tomllib/_parser.py and _re.py, pure Python (no C accelerator); the error messages and positions on these pages are its suffixed_err() texts',
    'Spec':       'TOML 1.0.0 through Python 3.14 (shown here: 3.13); Python 3.15 implements TOML 1.1.0, so a few documents rejected here parse there',
    'Return type': 'Always a dict with str keys. Tables and inline tables → dict, arrays → list, and parse_float decides what floats become',
    'Untrusted input': 'The docs advise limiting the size of untrusted TOML: a malicious document can make the parser use a lot of CPU and memory',
  },

  related: [
    { name: 'tomllib.loads',    slug: 'loads',           when: 'Parse a TOML string' },
    { name: 'tomllib.load',     slug: 'load',            when: 'Parse a file opened with "rb"' },
    { name: 'TOMLDecodeError',  slug: 'tomldecodeerror', when: 'What invalid TOML raises' },
    { name: 'configparser',     slug: 'configparser',    when: 'INI files: sections of untyped key = value text', category: 'stdlib' },
    { name: 'json',             slug: 'json',            when: 'Read and write JSON', category: 'stdlib' },
    { name: 'datetime',         slug: 'datetime',        when: 'What TOML dates and times become', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I write a TOML file in Python?',
      a: 'Not with the standard library: tomllib only parses. The tomllib docs point to the third-party Tomli-W package (tomli_w.dumps / tomli_w.dump mirror json) and to TOML Kit when you need to edit a file and keep its comments and layout.',
    },
    {
      q: 'Why does tomllib.load need a file opened with "rb"?',
      a: 'TOML files are always UTF-8. Reading bytes lets tomllib decode UTF-8 itself, whatever the platform default encoding is, and stops text mode from turning a stray carriage return into a newline (PEP 680 gives both reasons). A text-mode file raises TypeError: File must be opened in binary mode.',
    },
    {
      q: 'Which Python version has tomllib?',
      a: 'Python 3.11 and later. tomllib is the third-party tomli parser moved into the standard library (PEP 680); on older Pythons, install tomli, which has the same load / loads / TOMLDecodeError API.',
    },
    {
      q: 'What Python types does tomllib return?',
      a: 'A dict for the document, tables and inline tables; list for arrays (an array of tables is a list of dicts); str, int, float and bool; datetime.datetime for date-times (with a timezone when the TOML has an offset or Z), datetime.date for dates and datetime.time for times.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tomllib.html',
    meta:  'tomllib — Parse TOML files',
  },

};
