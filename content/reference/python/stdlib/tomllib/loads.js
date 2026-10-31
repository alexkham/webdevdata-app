// content/reference/python/stdlib/tomllib/loads.js

export const meta = {
  slug:        'loads',
  name:        'tomllib.loads',
  signature:   'tomllib.loads(s, /, *, parse_float=float)',
  blurb:       'Parse a TOML document held in a str into a dict: tables → dict, arrays → list, typed numbers, booleans and datetime objects.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'tomllib loads parse toml string python tomllib.loads toml to dict parse_float decimal toml string escapes literal string multi-line string inline table toml integer hex underscore inf nan',
};

export const method = {
  slug:      'loads',
  name:      'tomllib.loads',
  signature: 'tomllib.loads(s, /, *, parse_float=float)',
  returns:   { type: 'dict', desc: 'The document as a dict with str keys; nested tables are nested dicts.' },

  category:    'tomllib function',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'TOML text in, a dict out. Every value is converted by the TOML rules: quoted strings with escapes, ints in decimal, hex, octal or binary, floats (or whatever parse_float returns), booleans, arrays, inline tables and four kinds of date and time.',

  covers: ['loads'],

  cheat: {
    commonCall: "tomllib.loads('port = 8080')",
    returns:    "{'port': 8080} — always a dict",
    replaces:   'hand-written config parsing; toml.loads from the old third-party toml package',
    watchOut:   's must be str — bytes raise TypeError',
  },

  parameters: [
    { name: 's',           type: 'str',      required: true,  default: null,    desc: 'The TOML document. Positional-only. "\\r\\n" line endings are turned into "\\n" first, even inside strings.' },
    { name: 'parse_float', type: 'callable', required: false, default: 'float', desc: 'Called with the text of every TOML float (including inf and nan). Must not return a dict or a list — that raises ValueError.' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'parse',
      blurb: 'One TOML line per box (empty boxes are blank lines). The result is the dict loads returns.',
      params: [
        { name: 'line1', type: 'str', hint: 'TOML line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'TOML line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'TOML line 3', input: 'text' },
        { name: 'line4', type: 'str', hint: 'TOML line 4', input: 'text' },
      ],
      template: "import tomllib\ndoc = '\\n'.join([\n    {$line1},\n    {$line2},\n    {$line3},\n    {$line4},\n])\ntomllib.loads(doc)",
      cases: [
        { id: 'strings', label: 'string kinds', values: { line1: "path = 'C:\\Users\\ada'", line2: 'tab = "a\\tb"', line3: 'quote = "say \\"hi\\""', line4: 'accent = "caf\\u00e9"' } },
        { id: 'numbers', label: 'numbers',      values: { line1: 'hex = 0xFF', line2: 'big = 1_000_000', line3: 'sci = 6.02e23', line4: 'neg_inf = -inf' } },
        { id: 'ml',      label: 'multi-line',   values: { line1: 'text = """', line2: 'first line', line3: 'second line"""', line4: '' } },
        { id: 'inline',  label: 'inline table', values: { line1: 'point = {x = 1, y = 2}', line2: 'ports = [', line3: '  80, 443,', line4: ']' } },
        { id: 'comma',   label: 'trailing comma in {}', values: { line1: 'point = {x = 1, y = 2,}', line2: '', line3: '', line4: '' } },
        { id: 'hhmm',    label: 'time without seconds', values: { line1: 'alarm = 07:15', line2: '', line3: '', line4: '' } },
      ],
    },
    {
      id: 'floats',
      label: 'parse_float',
      blurb: 'Choose what TOML floats become: float (the default), Decimal, or the raw text with str.',
      params: [
        { name: 'text', type: 'str', hint: 'one TOML line', input: 'text' },
        { name: 'kind', type: 'str', hint: "'float', 'Decimal' or 'str'", input: 'text' },
      ],
      template: "import tomllib\nfrom decimal import Decimal\nparsers = {'float': float, 'Decimal': Decimal, 'str': str}\ntomllib.loads({$text}, parse_float=parsers[{$kind}])",
      cases: [
        { id: 'float',   label: 'float',          values: { text: 'pi = 3.14159265358979323846', kind: 'float' } },
        { id: 'decimal', label: 'Decimal',        values: { text: 'pi = 3.14159265358979323846', kind: 'Decimal' } },
        { id: 'money',   label: 'money as text',  values: { text: 'prices = [19.99, 0.10, 1e3]', kind: 'str' } },
        { id: 'inf',     label: 'inf → Decimal',  values: { text: 'limit = inf', kind: 'Decimal' } },
        { id: 'int',     label: 'ints untouched', values: { text: 'n = 10', kind: 'Decimal' } },
      ],
    },
  ],
  demoExplainer: "A literal string ('...') keeps backslashes as typed, a basic string (\"...\") turns \\t into a tab and \\u00e9 into é. A multi-line string drops the newline right after the opening quotes. The last two cases are valid TOML 1.1 but not TOML 1.0, which is what tomllib implements up to Python 3.14: Python 3.13 reports \"Invalid initial character for a key part (at line 1, column 23)\" for the trailing comma and \"Expected newline or end of document after a statement (at line 1, column 10)\" for 07:15 — Python 3.15 (TOML 1.1.0) parses both. In parse_float, Decimal keeps all 21 digits that float rounds away, str hands you the exact text (0.10 stays '0.10'), and integers never reach parse_float.",

  patterns: [
    {
      name: 'TOML embedded in code',
      desc: 'textwrap.dedent removes the indentation a triple-quoted string picks up inside a function.',
      code: "import textwrap, tomllib\nDEFAULTS = tomllib.loads(textwrap.dedent('''\n    [server]\n    host = \"127.0.0.1\"\n    port = 8000\n'''))",
    },
    {
      name: 'Parse a file you already read as text',
      desc: 'If you have the content as str (from read_text, an HTTP body, a database column), use loads.',
      code: "import tomllib\nfrom pathlib import Path\nconfig = tomllib.loads(Path('app.toml').read_text(encoding='utf-8'))",
    },
    {
      name: 'Money and other exact decimals',
      desc: 'parse_float=Decimal gets every float as an exact Decimal; ints are unaffected.',
      code: "import tomllib\nfrom decimal import Decimal\nprices = tomllib.loads(text, parse_float=Decimal)['prices']",
    },
    {
      name: 'Required keys',
      desc: 'loads checks syntax, not your schema. Look the keys up and fail with a clear message.',
      code: "import tomllib\nconfig = tomllib.loads(text)\nmissing = {'name', 'version'} - config.get('project', {}).keys()\nif missing:\n    raise ValueError(f'[project] is missing {sorted(missing)}')",
    },
  ],

  examples: [
    { title: 'Basic string escapes',          code: "import tomllib\ntomllib.loads('s = \"tab\\\\there\\\\nnew line\"')", returns: "{'s': 'tab\\there\\nnew line'}" },
    { title: 'Literal strings keep backslashes', code: "import tomllib\ntomllib.loads(\"path = 'C:\\\\new\\\\data'\")['path']", returns: "'C:\\\\new\\\\data'" },
    { title: 'Line-ending backslash in \"\"\"',  code: "import tomllib\ntomllib.loads('s = \"\"\"one \\\\\\n    two\"\"\"')", returns: "{'s': 'one two'}" },
    { title: 'Integer forms',                 code: "import tomllib\ntomllib.loads('a = 0xFF\\nb = 0o755\\nc = 0b1010\\nd = 1_000')", returns: "{'a': 255, 'b': 493, 'c': 10, 'd': 1000}" },
    { title: 'inf and nan are floats',        code: "import tomllib\ntomllib.loads('x = inf\\ny = -inf\\nz = nan')", returns: "{'x': inf, 'y': -inf, 'z': nan}" },
    { title: 'Local time → time',             code: "import tomllib\ntomllib.loads('alarm = 07:15:30.5')['alarm']", returns: 'datetime.time(7, 15, 30, 500000)' },
    { title: 'parse_float=Decimal',           code: "import tomllib\nfrom decimal import Decimal\ntomllib.loads('price = 19.99', parse_float=Decimal)", returns: "{'price': Decimal('19.99')}" },
    { title: 'parse_float must not return a list', code: "import tomllib\ntomllib.loads('x = 1.5', parse_float=lambda s: [s])", returns: 'ValueError: parse_float must not return dicts or lists' },
  ],

  pitfalls: [
    {
      name: 'Passing bytes',
      desc: 'loads takes str only. In Python 3.13 the error comes from str.replace and is confusing; Python 3.14 says "Expected str object, not \'bytes\'". Decode first, or use load with a binary file.',
      wrong: { label: 'loads(bytes)',  code: "import tomllib\ntomllib.loads(b'debug = true')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'decode first',  code: "import tomllib\ntomllib.loads(b'debug = true'.decode('utf-8'))", output: "{'debug': True}" },
    },
    {
      name: 'Windows paths in basic strings',
      desc: 'Inside "..." a backslash starts an escape, and \\U needs eight hex digits. Use a literal string (\'...\') for paths and regular expressions.',
      wrong: { label: '"C:\\Users"', code: "import tomllib\ntomllib.loads('home = \"C:\\\\Users\\\\ada\"')", output: 'tomllib.TOMLDecodeError: Invalid hex value (at line 1, column 13)' },
      fix:   { label: "'C:\\Users'", code: "import tomllib\ntomllib.loads(\"home = 'C:\\\\Users\\\\ada'\")", output: "{'home': 'C:\\\\Users\\\\ada'}" },
    },
    {
      name: 'Floats that should be exact',
      desc: 'By default every TOML float is a binary float, so long decimals are rounded. parse_float=Decimal keeps the digits.',
      wrong: { label: 'float', code: "import tomllib\ntomllib.loads('rate = 0.1234567890123456789')", output: "{'rate': 0.12345678901234568}" },
      fix:   { label: 'Decimal', code: "import tomllib\nfrom decimal import Decimal\ntomllib.loads('rate = 0.1234567890123456789', parse_float=Decimal)", output: "{'rate': Decimal('0.1234567890123456789')}" },
    },
  ],

  when: {
    use: [
      'You have TOML text as a str: embedded defaults, read_text(), an HTTP body',
      'Tests that build small TOML documents inline',
    ],
    avoid: [
      'Reading a file → tomllib.load(f) with open(path, "rb")',
      'Producing TOML → a third-party writer such as Tomli-W',
      'Python literals or JSON → ast.literal_eval or json.loads',
    ],
  },

  notes: {
    cpython:      'Lib/tomllib/_parser.py — loads() replaces "\\r\\n" with "\\n", then parses one statement per line with hand-written rules and the regular expressions in _re.py',
    'Floats':     'Matched by a regular expression, then passed as text to parse_float (float by default); inf, +inf, -inf, nan, +nan and -nan go through parse_float too',
    'Integers':   'int(text, 0), so decimal ints are subject to the 4300-digit int string limit; hex, octal and binary are not',
    'Exceptions': 'TOMLDecodeError (a ValueError) for invalid TOML; ValueError if parse_float returns a dict or list; TypeError for a non-str argument',
  },

  related: [
    { name: 'tomllib.load',    slug: 'load',            when: 'Parse a binary file object' },
    { name: 'TOMLDecodeError', slug: 'tomldecodeerror', when: 'What invalid TOML raises' },
    { name: 'tomllib module',  slug: 'tomllib',         when: 'Overview and type table', category: 'stdlib' },
    { name: 'json.loads',      slug: 'loads',           when: 'The JSON equivalent (with parse_float too)', category: 'stdlib/json' },
    { name: 'decimal',         slug: 'decimal',         when: 'Exact decimals via parse_float', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between tomllib.load and tomllib.loads?',
      a: 'loads parses a str you already have; load reads a file object opened in binary mode ("rb") and decodes it as UTF-8 before parsing. Both return a dict and take the same parse_float argument.',
    },
    {
      q: 'How do I keep TOML floats exact?',
      a: 'Pass parse_float=decimal.Decimal: tomllib calls it with the float text, so "19.99" becomes Decimal(\'19.99\'). Integers are never passed to parse_float.',
    },
    {
      q: 'Why does a backslash in my Windows path break the TOML?',
      a: 'In a basic string ("...") a backslash starts an escape such as \\n or \\u00e9, and \\U must be followed by eight hex digits. Use a literal string with single quotes, where backslashes are plain characters, or double each backslash.',
    },
    {
      q: 'Does tomllib.loads keep the order of keys?',
      a: 'Yes. The docs note it as a CPython implementation detail: entries are loaded in the order they appear in the source.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tomllib.html#tomllib.loads',
    meta:  'tomllib.loads',
  },

};
