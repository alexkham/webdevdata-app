// content/reference/python/stdlib/tomllib/load.js

export const meta = {
  slug:        'load',
  name:        'tomllib.load',
  signature:   'tomllib.load(fp, /, *, parse_float=float)',
  blurb:       'Read a TOML file opened in binary mode ("rb") and return its content as a dict. The bytes are decoded as UTF-8 by tomllib itself.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'tomllib load read toml file python open rb binary mode pyproject.toml file must be opened in binary mode typeerror unicodedecodeerror utf-8 bom toml file encoding tomllib.load',
};

export const method = {
  slug:      'load',
  name:      'tomllib.load',
  signature: 'tomllib.load(fp, /, *, parse_float=float)',
  returns:   { type: 'dict', desc: 'The parsed document, exactly as loads would return it for the decoded text.' },

  category:    'tomllib function',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'The whole function is three steps: fp.read() must return bytes, bytes.decode() turns them into text as UTF-8, and loads() parses the text. That is why the file has to be opened with "rb" — and why a file saved in another encoding fails before any TOML is parsed.',

  covers: ['load'],

  cheat: {
    commonCall: "with open('pyproject.toml', 'rb') as f:\n    data = tomllib.load(f)",
    returns:    'a dict, like loads',
    replaces:   'open(path).read() followed by a hand-written parser',
    watchOut:   "text mode raises TypeError — always 'rb'",
  },

  parameters: [
    { name: 'fp',          type: 'binary file object', required: true,  default: null,    desc: 'Anything whose read() returns bytes: open(path, "rb"), io.BytesIO, a binary stream. Positional-only.' },
    { name: 'parse_float', type: 'callable',           required: false, default: 'float', desc: 'Same as for loads: called with the text of every TOML float; must not return a dict or a list.' },
  ],

  modes: [
    {
      id: 'file',
      label: 'read a file',
      blurb: 'Write the lines to app.toml as UTF-8 bytes, then load it the documented way.',
      params: [
        { name: 'line1', type: 'str', hint: 'TOML line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'TOML line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'TOML line 3', input: 'text' },
      ],
      template: "import tomllib\nfrom pathlib import Path\ndoc = '\\n'.join([{$line1}, {$line2}, {$line3}])\nPath('app.toml').write_bytes(doc.encode('utf-8'))\nwith open('app.toml', 'rb') as f:\n    config = tomllib.load(f)\nconfig",
      cases: [
        { id: 'db',     label: 'a table',       values: { line1: '[database]', line2: 'url = "postgres://localhost/app"', line3: 'pool = 5' } },
        { id: 'utf8',   label: 'non-ASCII',     values: { line1: '[author]', line2: 'name = "Zoë Ångström"', line3: 'city = "Malmö"' } },
        { id: 'broken', label: 'invalid TOML',  values: { line1: '[database]', line2: 'pool = 5', line3: 'pool = 10' } },
      ],
    },
    {
      id: 'mode',
      label: 'open mode',
      blurb: "The same file opened in binary mode and in text mode. Only 'rb' works.",
      params: [{ name: 'mode', type: 'str', hint: "'rb' or 'r'", input: 'text' }],
      template: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'debug = true\\n')\nwith open('app.toml', {$mode}) as f:\n    result = tomllib.load(f)\nresult",
      cases: [
        { id: 'rb', label: "'rb'", values: { mode: 'rb' } },
        { id: 'r',  label: "'r'",  values: { mode: 'r' } },
        { id: 'rt', label: "'rt'", values: { mode: 'rt' } },
      ],
    },
    {
      id: 'encoding',
      label: 'file encoding',
      blurb: 'Save one TOML line in an encoding of your choice, then load it. tomllib always decodes UTF-8.',
      params: [
        { name: 'text',     type: 'str', hint: 'one TOML line', input: 'text' },
        { name: 'encoding', type: 'str', hint: 'utf-8, utf-8-sig, latin-1, utf-16, ascii', input: 'text' },
      ],
      template: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes({$text}.encode({$encoding}))\nwith open('app.toml', 'rb') as f:\n    result = tomllib.load(f)\nresult",
      cases: [
        { id: 'utf8',   label: 'utf-8',            values: { text: 'name = "Zoë"', encoding: 'utf-8' } },
        { id: 'bom',    label: 'utf-8 with BOM',   values: { text: 'name = "Zoë"', encoding: 'utf-8-sig' } },
        { id: 'latin1', label: 'latin-1',          values: { text: 'name = "Zoë"', encoding: 'latin-1' } },
        { id: 'utf16',  label: 'utf-16',           values: { text: 'name = "Zoë"', encoding: 'utf-16' } },
        { id: 'ascii',  label: 'ASCII only',       values: { text: 'name = "Zoe"', encoding: 'latin-1' } },
      ],
    },
  ],
  demoExplainer: "In read a file, non-ASCII text round-trips because load decodes UTF-8 itself — no encoding argument anywhere. A text-mode file (\"r\" or \"rt\") makes read() return str, and load raises TypeError: File must be opened in binary mode. In file encoding, a byte order mark is not skipped: it becomes the character U+FEFF and the TOML parser reports \"Invalid statement (at line 1, column 1)\". latin-1 writes ë as the single byte 0xeb, which is not valid UTF-8, so the UnicodeDecodeError names byte 0xeb in position 10; a UTF-16 file fails on its first byte. Pure ASCII is the same in latin-1 and UTF-8, so that file loads.",

  patterns: [
    {
      name: 'Read pyproject.toml',
      desc: 'The canonical call: binary mode, no encoding argument.',
      code: "import tomllib\nwith open('pyproject.toml', 'rb') as f:\n    pyproject = tomllib.load(f)\nversion = pyproject['project']['version']",
    },
    {
      name: 'With pathlib',
      desc: 'Path.open("rb") gives the binary file load wants; read_bytes().decode() plus loads is equivalent.',
      code: "import tomllib\nfrom pathlib import Path\nwith Path('config', 'app.toml').open('rb') as f:\n    config = tomllib.load(f)",
    },
    {
      name: 'Optional config file',
      desc: 'Fall back to defaults when the file does not exist; let invalid TOML fail loudly.',
      code: "import tomllib\ntry:\n    with open('app.toml', 'rb') as f:\n        user = tomllib.load(f)\nexcept FileNotFoundError:\n    user = {}\nsettings = {'debug': False, **user}",
    },
    {
      name: 'Accept a file saved with a BOM',
      desc: 'If a Windows editor added a byte order mark, decode with utf-8-sig yourself and use loads.',
      code: "import tomllib\nfrom pathlib import Path\nconfig = tomllib.loads(Path('app.toml').read_bytes().decode('utf-8-sig'))",
    },
  ],

  examples: [
    { title: 'Load a file in binary mode',  code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'[server]\\nport = 8080\\n')\nwith open('app.toml', 'rb') as f:\n    config = tomllib.load(f)\nconfig", returns: "{'server': {'port': 8080}}" },
    { title: 'Any binary stream works',     code: "import io, tomllib\ntomllib.load(io.BytesIO(b'name = \"app\"\\nversion = \"1.0\"'))", returns: "{'name': 'app', 'version': '1.0'}" },
    { title: 'UTF-8 is decoded for you',    code: "import io, tomllib\ntomllib.load(io.BytesIO('city = \"Malmö\"'.encode('utf-8')))", returns: "{'city': 'Malmö'}" },
    { title: 'parse_float works here too',  code: "import io, tomllib\nfrom decimal import Decimal\ntomllib.load(io.BytesIO(b'price = 9.95'), parse_float=Decimal)", returns: "{'price': Decimal('9.95')}" },
    { title: 'A text stream is refused',    code: "import io, tomllib\ntomllib.load(io.StringIO('debug = true'))", returns: "TypeError: File must be opened in binary mode, e.g. use `open('foo.toml', 'rb')`" },
    { title: 'A lone carriage return is not a newline', code: "import io, tomllib\ntomllib.load(io.BytesIO(b'a = 1\\rb = 2'))", returns: 'tomllib.TOMLDecodeError: Expected newline or end of document after a statement (at line 1, column 6)' },
    { title: 'CRLF line endings are fine',  code: "import io, tomllib\ntomllib.load(io.BytesIO(b'a = 1\\r\\nb = 2\\r\\n'))", returns: "{'a': 1, 'b': 2}" },
  ],

  pitfalls: [
    {
      name: 'Text mode',
      desc: 'open(path) and open(path, encoding="utf-8") give a text file whose read() returns str. load needs the bytes.',
      wrong: { label: "open(path, encoding='utf-8')", code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'debug = true\\n')\nwith open('app.toml', encoding='utf-8') as f:\n    config = tomllib.load(f)", output: "TypeError: File must be opened in binary mode, e.g. use `open('foo.toml', 'rb')`" },
      fix:   { label: "open(path, 'rb')",            code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'debug = true\\n')\nwith open('app.toml', 'rb') as f:\n    config = tomllib.load(f)\nconfig", output: "{'debug': True}" },
    },
    {
      name: 'Passing a path instead of a file',
      desc: 'Like json.load, tomllib.load takes an open file, not a file name. A str has no read() method.',
      wrong: { label: 'load(path)',       code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'debug = true\\n')\ntomllib.load('app.toml')", output: "AttributeError: 'str' object has no attribute 'read'" },
      fix:   { label: 'load(open(path))', code: "import tomllib\nfrom pathlib import Path\nPath('app.toml').write_bytes(b'debug = true\\n')\nwith open('app.toml', 'rb') as f:\n    config = tomllib.load(f)\nconfig", output: "{'debug': True}" },
    },
    {
      name: 'A file saved in a legacy encoding',
      desc: 'TOML must be UTF-8. A file written as latin-1 (or Windows-1252) fails while decoding, before parsing starts. Re-save it as UTF-8.',
      wrong: { label: 'latin-1 bytes', code: "import io, tomllib\ntomllib.load(io.BytesIO('name = \"Zoë\"'.encode('latin-1')))", output: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xeb in position 10: invalid continuation byte" },
      fix:   { label: 'UTF-8 bytes',   code: "import io, tomllib\ntomllib.load(io.BytesIO('name = \"Zoë\"'.encode('utf-8')))", output: "{'name': 'Zoë'}" },
    },
  ],

  when: {
    use: [
      'Reading a .toml file from disk — pyproject.toml, tool and app configuration',
      'Any binary stream: io.BytesIO, a zip member opened in binary mode, an HTTP response body',
    ],
    avoid: [
      'Text you already have as str → tomllib.loads',
      'Writing TOML → a third-party writer such as Tomli-W',
      'A file that must keep its comments when edited → TOML Kit',
    ],
  },

  notes: {
    cpython:      'Lib/tomllib/_parser.py — load() is b = fp.read(); s = b.decode(); return loads(s, parse_float=parse_float), with the AttributeError from str.decode turned into the TypeError',
    'Encoding':   'bytes.decode() with its default, UTF-8, strict. A UTF-8 byte order mark is kept as U+FEFF and rejected by the parser',
    'Newlines':   'Binary mode keeps \\r\\n, which loads turns into \\n; a lone \\r is an error, as the TOML spec requires (PEP 680 gives this as one reason for binary mode)',
    'Exceptions': 'TypeError for a text file, UnicodeDecodeError for non-UTF-8 bytes, TOMLDecodeError for invalid TOML',
  },

  related: [
    { name: 'tomllib.loads',   slug: 'loads',           when: 'Parse text you already have' },
    { name: 'TOMLDecodeError', slug: 'tomldecodeerror', when: 'What invalid TOML raises' },
    { name: 'tomllib module',  slug: 'tomllib',         when: 'Overview and type table', category: 'stdlib' },
    { name: 'open()',          slug: 'open',            when: "Open the file with 'rb'", category: 'functions' },
    { name: 'json.load',       slug: 'load',            when: 'The JSON equivalent (accepts text files)', category: 'stdlib/json' },
    { name: 'UnicodeDecodeError', slug: 'unicodedecodeerror', when: 'A file that is not UTF-8', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "TypeError: File must be opened in binary mode" mean?',
      a: "The file passed to tomllib.load was opened in text mode, so its read() returned str. Open it with open(path, 'rb') — without an encoding argument — and load decodes the UTF-8 bytes itself.",
    },
    {
      q: 'Why does tomllib.load use binary mode when json.load accepts text files?',
      a: 'PEP 680 explains it: reading bytes guarantees the file is decoded as UTF-8 (the only encoding TOML allows) whatever the platform default is, and it stops text mode from silently turning a lone carriage return into a newline.',
    },
    {
      q: 'Why do I get UnicodeDecodeError when loading a TOML file?',
      a: 'The file is not UTF-8 — usually it was saved as latin-1 / Windows-1252 by an older editor. The error names the first byte that is not valid UTF-8. Re-save the file as UTF-8 (without a BOM).',
    },
    {
      q: 'Can tomllib.load take a file path?',
      a: 'No, it takes a file object; a str path raises AttributeError (\'str\' object has no attribute \'read\'). Use with open(path, "rb") as f: tomllib.load(f), or tomllib.loads(Path(path).read_text(encoding="utf-8")).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tomllib.html#tomllib.load',
    meta:  'tomllib.load',
  },

};
