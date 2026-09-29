// content/reference/python/stdlib/pathlib/read_text.js

export const meta = {
  slug:        'read_text',
  name:        'Path.read_text',
  signature:   "Path.read_text(encoding=None, errors=None, newline=None) / .write_text(data, …) / .read_bytes() / .write_bytes(data)",
  blurb:       'Read or write a whole file in one call — as text (read_text / write_text) or raw bytes (read_bytes / write_bytes). No open() or with block needed.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'Path.read_text read_text write_text read_bytes write_bytes Path.write_text Path.read_bytes Path.write_bytes read file python pathlib write file one line encoding utf-8 overwrite file append newline',
};

export const method = {
  slug:      'read_text',
  name:      'Path.read_text',
  signature: "Path.read_text(encoding=None, errors=None, newline=None) / .write_text(data, encoding=None, errors=None, newline=None) / .read_bytes() / .write_bytes(data)",
  returns:   { type: 'str | bytes | int', desc: 'read_* return the content; write_* return the number of characters / bytes written.' },

  category:    'pathlib method',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'read_text() opens, reads everything, and closes; write_text() creates or OVERWRITES the file. Always pass encoding="utf-8" — the default is the locale encoding, which differs between machines.',

  covers: ['Path.read_text', 'Path.write_text'],

  cheat: {
    commonCall: "p.read_text(encoding='utf-8')",
    returns:    'the whole file as str',
    replaces:   "with open(p, encoding='utf-8') as f: f.read()",
    watchOut:   'write_text overwrites; there is no append mode',
  },

  parameters: [
    { name: 'data',     type: 'str | bytes', required: true,  default: null,   desc: 'write_text: a str; write_bytes: bytes-like. Anything else is a TypeError.' },
    { name: 'encoding', type: 'str | None',  required: false, default: 'None', desc: "Text methods only. None means the locale encoding (locale.getencoding()); pass 'utf-8' explicitly." },
    { name: 'errors',   type: 'str | None',  required: false, default: 'None', desc: "Text methods only: 'strict' (default), 'replace', 'ignore', 'surrogateescape' …" },
    { name: 'newline',  type: 'str | None',  required: false, default: 'None', desc: "Text methods only (write 3.10+, read 3.13+): as in open(). None translates line endings; '' leaves them alone." },
  ],

  modes: [
    {
      id: 'roundtrip',
      label: 'write & read',
      blurb: 'write_text returns the number of characters written, not bytes.',
      params: [{ name: 'text', type: 'str', hint: 'text to write', input: 'text' }],
      template: "from pathlib import Path\np = Path('notes.txt')\nn = p.write_text({$text}, encoding='utf-8')\n(n, p.read_text(encoding='utf-8'))",
      cases: [
        { id: 'ascii', label: 'ASCII',     values: { text: 'hello' } },
        { id: 'utf',   label: 'non-ASCII', values: { text: 'crème brûlée' } },
        { id: 'empty', label: 'empty',     values: { text: '' } },
      ],
    },
    {
      id: 'missing',
      label: 'missing file',
      blurb: 'The demo starts in an empty folder, so any name is missing.',
      params: [{ name: 'name', type: 'str', hint: 'a file name', input: 'text' }],
      template: "from pathlib import Path\nPath({$name}).read_text(encoding='utf-8')",
      cases: [
        { id: 'cfg', label: 'config.toml', values: { name: 'config.toml' } },
      ],
    },
  ],
  demoExplainer: "The count is in characters: 'crème brûlée' is 12 characters even though its UTF-8 encoding is 15 bytes. Reading a file that does not exist raises FileNotFoundError with errno 2 and the file name.",

  patterns: [
    {
      name: 'Read lines without the newline characters',
      desc: 'splitlines() handles \\n, \\r\\n and a missing final newline.',
      code: "from pathlib import Path\nlines = Path('names.txt').read_text(encoding='utf-8').splitlines()",
    },
    {
      name: 'Append instead of overwrite',
      desc: "write_text has no append mode; use open('a').",
      code: "from pathlib import Path\nwith Path('app.log').open('a', encoding='utf-8') as f:\n    f.write('started\\n')",
    },
    {
      name: 'Write atomically',
      desc: 'Write to a temporary sibling, then replace() — readers never see half a file.',
      code: "from pathlib import Path\ntarget = Path('config.json')\ntmp = target.with_suffix('.tmp')\ntmp.write_text(text, encoding='utf-8')\ntmp.replace(target)",
    },
    {
      name: 'Copy a file',
      desc: 'Small files: bytes in, bytes out (shutil.copy for large ones or to keep metadata).',
      code: "from pathlib import Path\nPath('copy.png').write_bytes(Path('logo.png').read_bytes())",
    },
  ],

  examples: [
    { title: 'Write then read',               code: "from pathlib import Path\np = Path('greeting.txt')\np.write_text('Hello, world', encoding='utf-8')\np.read_text(encoding='utf-8')", returns: "'Hello, world'" },
    { title: 'write_text counts characters',  code: "from pathlib import Path\nPath('menu.txt').write_text('crème', encoding='utf-8')", returns: '5' },
    { title: 'write_bytes counts bytes',      code: "from pathlib import Path\nPath('menu.bin').write_bytes('crème'.encode('utf-8'))", returns: '6' },
    { title: 'read_bytes gives raw bytes',    code: "from pathlib import Path\np = Path('menu.txt')\np.write_text('crème', encoding='utf-8')\np.read_bytes()", returns: "b'cr\\xc3\\xa8me'" },
    { title: 'write_text overwrites',         code: "from pathlib import Path\np = Path('log.txt')\np.write_text('first', encoding='utf-8')\np.write_text('second', encoding='utf-8')\np.read_text(encoding='utf-8')", returns: "'second'" },
    { title: 'Line endings come back as \\n', code: "from pathlib import Path\np = Path('crlf.txt')\np.write_bytes(b'a\\r\\nb\\r\\n')\np.read_text(encoding='utf-8')", returns: "'a\\nb\\n'" },
    { title: 'Missing file',                  code: "from pathlib import Path\nPath('nope.txt').read_text(encoding='utf-8')", returns: "FileNotFoundError: [Errno 2] No such file or directory: 'nope.txt'" },
    { title: 'write_text wants str',          code: "from pathlib import Path\nPath('n.txt').write_text(42)", returns: 'TypeError: data must be str, not int' },
  ],

  pitfalls: [
    {
      name: 'Relying on the default encoding',
      desc: 'Without encoding=, Python uses the locale encoding, so the same file can read differently on another machine. Decoding bytes that are not valid in the chosen encoding raises UnicodeDecodeError.',
      wrong: { label: 'wrong codec', code: "from pathlib import Path\np = Path('menu.txt')\np.write_text('crème', encoding='utf-8')\np.read_text(encoding='ascii')", output: "UnicodeDecodeError: 'ascii' codec can't decode byte 0xc3 in position 2: ordinal not in range(128)" },
      fix:   { label: "encoding='utf-8'", code: "from pathlib import Path\np = Path('menu.txt')\np.write_text('crème', encoding='utf-8')\np.read_text(encoding='utf-8')", output: "'crème'" },
    },
    {
      name: 'Writing into a folder that does not exist',
      desc: 'write_text does not create parent folders. mkdir(parents=True, exist_ok=True) the parent first.',
      wrong: { label: 'no parent', code: "from pathlib import Path\ntry:\n    Path('out/report.txt').write_text('ok', encoding='utf-8')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'create parents', code: "from pathlib import Path\np = Path('out/report.txt')\np.parent.mkdir(parents=True, exist_ok=True)\np.write_text('ok', encoding='utf-8')\np.read_text(encoding='utf-8')", output: "'ok'" },
    },
    {
      name: 'Reading huge files at once',
      desc: 'read_text loads the whole file into memory. Iterate over an open file for large logs.',
      wrong: { label: 'all at once', code: "from pathlib import Path\np = Path('big.log')\np.write_text('x\\n' * 3, encoding='utf-8')\nlen(p.read_text(encoding='utf-8').splitlines())", output: '3' },
      fix:   { label: 'line by line', code: "from pathlib import Path\np = Path('big.log')\np.write_text('x\\n' * 3, encoding='utf-8')\nwith p.open(encoding='utf-8') as f:\n    count = sum(1 for _ in f)\ncount", output: '3' },
    },
  ],

  when: {
    use: [
      'Small and medium files you need in full (configs, templates, JSON, CSV under a few MB)',
      'Quick scripts and tests',
    ],
    avoid: [
      'Appending → p.open("a")',
      'Very large files or streams → iterate over p.open()',
      'Binary formats with structure → read_bytes plus a parser, or the format library',
    ],
  },

  notes: {
    cpython:         'Path.read_text / write_text (Lib/pathlib/_local.py) call io.text_encoding(encoding) then PathBase.read_text / write_text, which use self.open(); read_bytes / write_bytes are inherited from PathBase in _abc.py',
    'Line endings':  "Text mode with newline=None: '\\r\\n' and '\\r' read back as '\\n'; on write, '\\n' becomes os.linesep — so a file written with write_text('a\\n') is 3 bytes on Windows and 2 on Linux",
    'Return value':  'write_text: characters written; write_bytes: bytes written',
    'EncodingWarning': 'With python -X warn_default_encoding, calls without encoding= emit EncodingWarning',
  },

  related: [
    { name: 'open()',   slug: 'open', when: 'Streaming, appending, other modes', category: 'functions' },
    { name: 'Path.open', slug: 'open', when: 'The same as open(path, …)' },
    { name: 'mkdir',    slug: 'mkdir', when: 'Create the parent folder first' },
    { name: 'json module', slug: 'json', when: 'json.loads(p.read_text(…))', category: 'stdlib' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'Reading a missing file', category: 'exceptions' },
    { name: 'UnicodeDecodeError', slug: 'unicodedecodeerror', when: 'Wrong encoding', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I read a whole file into a string with pathlib?',
      a: "Path('file.txt').read_text(encoding='utf-8'). It opens, reads and closes the file for you.",
    },
    {
      q: 'Does write_text append or overwrite?',
      a: "It overwrites: the file is opened in 'w' mode and truncated. To append, use with p.open('a', encoding='utf-8') as f: f.write(text).",
    },
    {
      q: 'Why does write_text return a number?',
      a: 'It returns what file.write() returns: the number of characters written (write_bytes returns the number of bytes).',
    },
    {
      q: 'What encoding does read_text use by default?',
      a: "The locale encoding (locale.getencoding()) unless UTF-8 mode is on — often UTF-8 on Linux and macOS but a legacy code page such as cp1252 on Windows. Pass encoding='utf-8' to be explicit.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.read_text',
    meta:  'Path.read_text / write_text / read_bytes / write_bytes',
  },
};
