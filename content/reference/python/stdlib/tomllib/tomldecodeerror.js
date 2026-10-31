// content/reference/python/stdlib/tomllib/tomldecodeerror.js

export const meta = {
  slug:        'tomldecodeerror',
  name:        'tomllib.TOMLDecodeError',
  signature:   'tomllib.TOMLDecodeError',
  blurb:       'Raised by tomllib.load and tomllib.loads for text that is not valid TOML. A ValueError subclass whose message ends with "(at line L, column C)" or "(at end of document)".',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.11+ (msg, doc, pos, lineno, colno attributes 3.14+)',
  searchTerms: 'tomldecodeerror tomllib.tomldecodeerror toml decode error invalid value at end of document cannot overwrite a value cannot declare twice unclosed array unclosed inline table expected newline or end of document after a statement invalid statement toml line column valueerror',
};

export const method = {
  slug:      'tomldecodeerror',
  name:      'tomllib.TOMLDecodeError',
  signature: 'tomllib.TOMLDecodeError',

  category:    'tomllib exception',
  version:     'Python 3.11+ (msg, doc, pos, lineno, colno attributes 3.14+)',
  hasLiveDemo: true,

  subtitle: 'Every syntax problem in a TOML document — a missing quote, a key defined twice, a table declared twice — is reported as this one exception. The message is a short phrase plus the position; in Python 3.11 to 3.13 that text is all you get, and Python 3.14 adds msg, doc, pos, lineno and colno attributes.',

  covers: ['TOMLDecodeError'],

  chain: ['BaseException', 'Exception', 'ValueError', 'TOMLDecodeError'],

  cheat: {
    raisedBy: 'tomllib.loads(s), tomllib.load(fp)',
    message:  'Invalid value (at line 1, column 8)',
    quickFix: 'except tomllib.TOMLDecodeError as e: report str(e)',
    watchOut: 'columns count characters, not bytes',
  },

  parameters: [],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Parse your lines without catching anything: the last line of the traceback is what you see.',
      params: [
        { name: 'line1', type: 'str', hint: 'TOML line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'TOML line 2', input: 'text' },
      ],
      template: "import tomllib\ntomllib.loads('\\n'.join([{$line1}, {$line2}]))",
      cases: [
        { id: 'array',  label: 'unclosed array',  values: { line1: 'ports = [80, 443', line2: '' } },
        { id: 'twice',  label: 'key twice',       values: { line1: 'name = "a"', line2: 'name = "b"' } },
        { id: 'table',  label: 'table twice',     values: { line1: '[[servers]]', line2: '[servers]' } },
        { id: 'noeq',   label: 'key without =',   values: { line1: '[app]', line2: 'debug' } },
        { id: 'two',    label: 'two on one line', values: { line1: 'a = 1 b = 2', line2: '' } },
        { id: 'valid',  label: 'valid',           values: { line1: '[app]', line2: 'debug = true' } },
      ],
    },
    {
      id: 'position',
      label: 'Position',
      blurb: 'Before Python 3.14 the position is only in the message. rpartition splits it off.',
      params: [
        { name: 'line1', type: 'str', hint: 'TOML line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'TOML line 2', input: 'text' },
      ],
      template: "import tomllib\ntry:\n    tomllib.loads('\\n'.join([{$line1}, {$line2}]))\nexcept tomllib.TOMLDecodeError as e:\n    message, _, where = str(e).rpartition(' (at ')\n    result = (message, where[:-1])\nelse:\n    result = 'valid TOML'\nresult",
      cases: [
        { id: 'line2',  label: 'error on line 2', values: { line1: 'title = "Report"', line2: 'year = twenty' } },
        { id: 'end',    label: 'at the end',      values: { line1: 'tags = ["a",', line2: '' } },
        { id: 'utf',    label: 'after non-ASCII', values: { line1: 'name = "Zoë" x', line2: '' } },
        { id: 'ok',     label: 'valid',           values: { line1: 'a = 1', line2: '' } },
      ],
    },
    {
      id: 'catch',
      label: 'Handle',
      blurb: 'except ValueError catches it too — TOMLDecodeError is a subclass.',
      params: [{ name: 'text', type: 'str', hint: 'one TOML line', input: 'text' }],
      template: "import tomllib\ntry:\n    tomllib.loads({$text})\nexcept ValueError as e:\n    caught = (type(e).__name__, isinstance(e, tomllib.TOMLDecodeError))\nelse:\n    caught = 'parsed fine'\ncaught",
      cases: [
        { id: 'bad',  label: 'not TOML', values: { text: 'debug = yes' } },
        { id: 'good', label: 'valid',    values: { text: 'debug = true' } },
      ],
    },
  ],
  demoExplainer: 'Columns count from 1 and point where the parser noticed the problem, which is often after the real mistake. A key set twice is reported just after the second value — here that is the end of the text, so the message says "end of document" — and [servers] after [[servers]] is reported at its closing bracket (line 2, column 9). In Position, tags = ["a", with nothing after it ends with "Invalid value (at end of document)": the parser was waiting for the next array item. After Zoë the column is 14, not 15 — positions count characters of the str, so a character that takes two bytes in UTF-8 still counts as one.',

  attributes: [
    { name: 'args',   type: 'tuple', meaning: 'One item: the full message with the position, the same as str(e).' },
    { name: 'msg',    type: 'str',   meaning: 'Python 3.14+: the message without the position, e.g. "Invalid value".' },
    { name: 'doc',    type: 'str',   meaning: 'Python 3.14+: the document being parsed.' },
    { name: 'pos',    type: 'int',   meaning: 'Python 3.14+: index into doc where parsing failed.' },
    { name: 'lineno', type: 'int',   meaning: 'Python 3.14+: the line of pos, counting from 1.' },
    { name: 'colno',  type: 'int',   meaning: 'Python 3.14+: the column of pos, counting from 1.' },
  ],

  patterns: [
    {
      name: 'Exit with a readable message',
      desc: 'str(e) already contains the position.',
      code: "import sys, tomllib\ntry:\n    with open('app.toml', 'rb') as f:\n        config = tomllib.load(f)\nexcept tomllib.TOMLDecodeError as e:\n    sys.exit(f'app.toml: {e}')",
    },
    {
      name: 'Line and column on any version',
      desc: 'Use the 3.14 attributes when they exist, else take the numbers from the message.',
      code: "import re, tomllib\n\ndef where(e: tomllib.TOMLDecodeError):\n    if hasattr(e, 'lineno'):\n        return e.lineno, e.colno\n    m = re.search(r'\\(at line (\\d+), column (\\d+)\\)$', str(e))\n    return (int(m[1]), int(m[2])) if m else None",
    },
    {
      name: 'Wrap it in your own error',
      desc: 'Keep the original as __cause__ with raise ... from.',
      code: "import tomllib\n\nclass ConfigError(Exception):\n    pass\n\ndef read_config(path):\n    try:\n        with open(path, 'rb') as f:\n            return tomllib.load(f)\n    except tomllib.TOMLDecodeError as e:\n        raise ConfigError(f'{path} is not valid TOML: {e}') from e",
    },
  ],

  examples: [
    { title: 'Traceback shows tomllib.TOMLDecodeError', code: "import tomllib\ntomllib.loads('a = ')", returns: 'tomllib.TOMLDecodeError: Invalid value (at end of document)' },
    { title: 'It is a ValueError',            code: 'import tomllib\nissubclass(tomllib.TOMLDecodeError, ValueError)', returns: 'True' },
    { title: 'The message is all there is (3.13)', code: "import tomllib\ntry:\n    tomllib.loads('x = [1, 2')\nexcept tomllib.TOMLDecodeError as e:\n    info = e.args\ninfo", returns: "('Unclosed array (at end of document)',)" },
    { title: 'Table declared twice',          code: "import tomllib\ntomllib.loads('[db]\\nuser = \"app\"\\n[db]')", returns: "tomllib.TOMLDecodeError: Cannot declare ('db',) twice (at line 3, column 4)" },
    { title: 'Dotted key over an existing value', code: "import tomllib\ntomllib.loads('site = \"x\"\\nsite.name = \"y\"\\nport = 1')", returns: 'tomllib.TOMLDecodeError: Cannot overwrite a value (at line 2, column 16)' },
    { title: 'A missing ] in a header',       code: "import tomllib\ntomllib.loads('[server\\nport = 1')", returns: "tomllib.TOMLDecodeError: Expected ']' at the end of a table declaration (at line 1, column 8)" },
    { title: 'Leading zeros are not allowed', code: "import tomllib\ntomllib.loads('n = 007')", returns: 'tomllib.TOMLDecodeError: Expected newline or end of document after a statement (at line 1, column 6)' },
  ],

  pitfalls: [
    {
      name: 'The bare name is not defined',
      desc: 'import tomllib does not put TOMLDecodeError in your namespace, and the except clause is only evaluated when an error happens.',
      wrong: { label: 'except TOMLDecodeError',         code: "import tomllib\ntry:\n    tomllib.loads('a = ')\nexcept TOMLDecodeError:\n    result = 'bad'", output: "NameError: name 'TOMLDecodeError' is not defined" },
      fix:   { label: 'except tomllib.TOMLDecodeError', code: "import tomllib\ntry:\n    tomllib.loads('a = ')\nexcept tomllib.TOMLDecodeError:\n    result = 'bad'\nresult", output: "'bad'" },
    },
    {
      name: 'except ValueError hides other bugs',
      desc: 'A ValueError raised by your parse_float callable is not a TOML syntax error, but except ValueError reports it as one.',
      wrong: { label: 'except ValueError', code: "import tomllib\ndef read(text):\n    try:\n        return tomllib.loads(text, parse_float=int)\n    except ValueError:\n        return 'invalid TOML'\nread('price = 9.5')", output: "'invalid TOML'" },
      fix:   { label: 'except tomllib.TOMLDecodeError', code: "import tomllib\ndef read(text):\n    try:\n        return tomllib.loads(text, parse_float=int)\n    except tomllib.TOMLDecodeError:\n        return 'invalid TOML'\nread('price = 9.5')", output: "ValueError: invalid literal for int() with base 10: '9.5'" },
    },
    {
      name: 'Reading e.lineno on Python 3.13',
      desc: 'The position attributes were added in Python 3.14. On 3.11 to 3.13 take the position from the message (or check hasattr first).',
      wrong: { label: 'e.lineno',  code: "import tomllib\ntry:\n    tomllib.loads('a = 1\\nb = ')\nexcept tomllib.TOMLDecodeError as e:\n    line = e.lineno", output: "AttributeError: 'TOMLDecodeError' object has no attribute 'lineno'" },
      fix:   { label: 'parse str(e)', code: "import re, tomllib\ntry:\n    tomllib.loads('a = 1\\nb = x')\nexcept tomllib.TOMLDecodeError as e:\n    line = int(re.search(r'line (\\d+)', str(e))[1])\nline", output: '2' },
    },
  ],

  when: {
    use: [
      'Around tomllib.load / loads when the file comes from users or other tools',
      'To turn a broken config into a clear message that names the file and position',
    ],
    avoid: [
      'Catching ValueError when you mean only invalid TOML — it also catches parse_float errors',
      'Relying on e.lineno / e.colno before Python 3.14',
      'Expecting it for a wrong argument type or encoding: TypeError and UnicodeDecodeError are separate',
    ],
  },

  notes: {
    cpython:      'Lib/tomllib/_parser.py — class TOMLDecodeError(ValueError); suffixed_err() builds every instance as TOMLDecodeError(f"{msg} (at {coord})")',
    'Module path': 'tomllib/__init__.py sets TOMLDecodeError.__module__ = "tomllib", so tracebacks show tomllib.TOMLDecodeError rather than tomllib._parser',
    'Python 3.14': 'Constructor becomes TOMLDecodeError(msg, doc, pos) with msg, doc, pos, lineno and colno attributes; passing other free-form arguments is deprecated',
    'Positions':  'line counts newlines before pos plus 1; the column is pos + 1 on line 1, else the distance from the last newline. pos at or past the end gives "end of document"',
  },

  related: [
    { name: 'tomllib.loads',  slug: 'loads',  when: 'Raises it for an invalid string' },
    { name: 'tomllib.load',   slug: 'load',   when: 'Raises it for an invalid file' },
    { name: 'tomllib module', slug: 'tomllib', when: 'Overview', category: 'stdlib' },
    { name: 'JSONDecodeError', slug: 'jsondecodeerror', when: 'The JSON counterpart, with lineno and colno', category: 'stdlib/json' },
    { name: 'ValueError',     slug: 'valueerror', when: 'Its parent class', category: 'exceptions' },
    { name: 'try',            slug: 'try',    when: 'try / except / else', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does "Invalid value (at line 1, column 8)" mean in tomllib?',
      a: 'At that position the parser expected a value (a quoted string, number, boolean, date, array or inline table) and found something else — most often an unquoted string such as host = localhost, or Python-style True instead of true.',
    },
    {
      q: 'What does "Cannot overwrite a value" mean?',
      a: 'The same key is assigned twice, or a dotted key or table tries to extend a key that already holds a plain value (site = "x" followed by site.name = "y"). TOML forbids redefining keys; remove or rename one of them.',
    },
    {
      q: 'How do I get the line number from TOMLDecodeError?',
      a: 'On Python 3.14 and later read e.lineno and e.colno (also e.msg, e.doc, e.pos). On 3.11 to 3.13 the numbers exist only in the message: str(e) ends with "(at line L, column C)" or "(at end of document)".',
    },
    {
      q: 'Is TOMLDecodeError a subclass of ValueError?',
      a: 'Yes, so except ValueError catches it. Prefer except tomllib.TOMLDecodeError, which does not also swallow unrelated ValueErrors, such as one raised by a parse_float callable.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tomllib.html#tomllib.TOMLDecodeError',
    meta:  'tomllib.TOMLDecodeError',
  },

};
