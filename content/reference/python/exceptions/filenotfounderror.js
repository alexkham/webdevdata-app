// content/reference/python/exceptions/filenotfounderror.js

export const meta = {
  slug:        'filenotfounderror',
  name:        'FileNotFoundError',
  signature:   'FileNotFoundError(errno, strerror[, filename])',
  blurb:       'Raised when a file or directory you asked for does not exist (errno ENOENT).',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'filenotfounderror file not found error no such file or directory errno 2 enoent open missing file path cwd working directory relative path',
};

export const method = {
  slug:      'filenotfounderror',
  name:      'FileNotFoundError',
  signature: 'FileNotFoundError(errno, strerror[, filename])',

  category:    'OS exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: "[Errno 2] No such file or directory — the path, resolved against the current working directory, does not exist. Usually the file is there, but the cwd is not where you think.",

  chain: ['BaseException', 'Exception', 'OSError', 'FileNotFoundError'],

  cheat: {
    raisedBy: 'open(path), Path.read_text(), os.remove(), os.listdir()',
    message:  "[Errno 2] No such file or directory: 'path'",
    quickFix: 'build the path from Path(__file__).parent, not the cwd',
    watchOut: "open(p, 'w') also raises it when the folder is missing",
  },

  parameters: [
    { name: 'errno',    type: 'int', required: false, default: null, desc: 'errno.ENOENT when raised by the OS. With a single argument, errno stays None and the argument is the message.' },
    { name: 'strerror', type: 'str', required: false, default: null, desc: "The OS message — 'No such file or directory' from open()." },
    { name: 'filename', type: 'str | bytes | None', required: false, default: null, desc: 'The path exactly as you passed it — relative paths are not made absolute.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'report_1.txt to report_3.txt exist in the working directory. Open another one.',
      params: [{ name: 'n', type: 'int', hint: 'report number', input: 'number' }],
      template: "from pathlib import Path\nfor i in (1, 2, 3):\n    Path(f'report_{i}.txt').write_text(f'report {i}')\nn = {$n}\nopen(f'report_{n}.txt').read()",
      cases: [
        { id: 'exists',  label: 'existing file', values: { n: '2' } },
        { id: 'missing', label: 'missing file',  values: { n: '4' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Raise it the way the OS does: errno, message, path. Leave the path empty to pass None.',
      params: [{ name: 'path', type: 'str | None', hint: 'empty → None', input: 'text-or-none' }],
      template: "import errno\nraise FileNotFoundError(errno.ENOENT, 'No such file or directory', {$path})",
      cases: [
        { id: 'path',   label: 'with path', values: { path: 'config/settings.toml' } },
        { id: 'nopath', label: 'no path',   values: { path: '' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Only settings_1.json exists. A missing settings file falls back to defaults.',
      params: [{ name: 'n', type: 'int', hint: 'settings number', input: 'number' }],
      template: "from pathlib import Path\nPath('settings_1.json').write_text('{\"theme\": \"dark\"}')\nn = {$n}\ntry:\n    raw = Path(f'settings_{n}.json').read_text()\nexcept FileNotFoundError as e:\n    raw = f'using defaults, {e.filename} not found'\nraw",
      cases: [
        { id: 'exists',  label: 'file exists', values: { n: '1' } },
        { id: 'missing', label: 'missing file', values: { n: '7' } },
      ],
    },
  ],
  demoExplainer: "The message ends with repr() of the path you passed — relative, exactly as typed, not the absolute path Python looked at. That is why the error rarely tells you the real problem: the name is right, but it was resolved against a different working directory. e.filename gives the same path unquoted.",

  attributes: [
    { name: 'errno',    type: 'int | None', meaning: 'errno.ENOENT (2 on Linux, macOS and Windows) when raised by the OS.' },
    { name: 'strerror', type: 'str | None', meaning: "'No such file or directory' from open(); Windows os.* calls give 'The system cannot find the file specified'." },
    { name: 'filename', type: 'str | bytes | None', meaning: 'The path you passed, unchanged. Resolve it yourself with os.path.abspath(e.filename) to see where Python looked.' },
    { name: 'filename2', type: 'str | None', meaning: 'Second path for two-path calls like os.rename(src, dst).' },
  ],

  patterns: [
    {
      name: 'Paths relative to the script, not the cwd',
      desc: 'The cwd is wherever the program was started from. Anchor data files to the source file instead.',
      code: "from pathlib import Path\nHERE = Path(__file__).resolve().parent\nconfig = (HERE / 'config.ini').read_text()",
    },
    {
      name: 'Optional file with a fallback',
      desc: 'EAFP: try to read, fall back when it is absent. No race between an exists() check and the open().',
      code: "try:\n    with open('settings.json') as f:\n        settings = json.load(f)\nexcept FileNotFoundError:\n    settings = {}",
    },
    {
      name: 'Show where Python actually looked',
      desc: 'When debugging, print the absolute path and the cwd along with the error.',
      code: "import os\ntry:\n    f = open(path)\nexcept FileNotFoundError as e:\n    raise SystemExit(f'{os.path.abspath(e.filename)} not found (cwd: {os.getcwd()})')",
    },
    {
      name: 'Delete if present',
      desc: 'unlink(missing_ok=True) (3.8+) swallows only the not-found case.',
      code: "from pathlib import Path\nPath('cache.db').unlink(missing_ok=True)",
    },
  ],

  examples: [
    { title: 'Missing file',                code: "open('missing.txt')", returns: "FileNotFoundError: [Errno 2] No such file or directory: 'missing.txt'" },
    { title: 'Relative paths use the cwd',  code: "import os\nfrom pathlib import Path\nos.mkdir('data')\nPath('data/users.csv').write_text('id,name')\n(os.path.exists('users.csv'), os.path.exists('data/users.csv'))", returns: '(False, True)' },
    { title: 'Change the cwd and it works', code: "import os\nfrom pathlib import Path\nos.mkdir('data')\nPath('data/users.csv').write_text('id,name')\nos.chdir('data')\nopen('users.csv').read()", returns: "'id,name'" },
    { title: 'e.filename is the path as given', code: "try:\n    open('logs/today.log')\nexcept FileNotFoundError as e:\n    r = (e.filename, e.strerror)\nr", returns: "('logs/today.log', 'No such file or directory')" },
    { title: 'It is an OSError with errno ENOENT', code: "import errno\ntry:\n    open('missing.txt')\nexcept OSError as e:\n    r = (type(e).__name__, e.errno == errno.ENOENT)\nr", returns: "('FileNotFoundError', True)" },
    { title: 'unlink(missing_ok=True) never raises it', code: "from pathlib import Path\nPath('gone.txt').unlink(missing_ok=True)\nPath('gone.txt').exists()", returns: 'False' },
    { title: 'One-argument form: errno is None', code: "e = FileNotFoundError('config.toml')\n(e.errno, e.filename, str(e))", returns: "(None, None, 'config.toml')" },
  ],

  pitfalls: [
    {
      name: "open(p, 'w') does not create folders",
      desc: "Write mode creates the file but not its parent directory. A missing folder gives FileNotFoundError on the full path, which looks like the file is the problem.",
      wrong: { label: 'Folder missing', code: "open('logs/app.log', 'w')", output: "FileNotFoundError: [Errno 2] No such file or directory: 'logs/app.log'" },
      fix:   { label: 'mkdir first',    code: "from pathlib import Path\nPath('logs').mkdir(parents=True, exist_ok=True)\nopen('logs/app.log', 'w').write('started')", output: '7' },
    },
    {
      name: 'Relative to the cwd, not to the script',
      desc: "The file sits next to the code, but the program was started from the project root. The fix anchors the path to a known folder (in a real script: Path(__file__).parent).",
      wrong: { label: 'Bare name', code: "from pathlib import Path\nPath('app').mkdir()\nPath('app/config.ini').write_text('debug=1')\nopen('config.ini').read()", output: "FileNotFoundError: [Errno 2] No such file or directory: 'config.ini'" },
      fix:   { label: 'Anchored path', code: "from pathlib import Path\nPath('app').mkdir()\nPath('app/config.ini').write_text('debug=1')\nbase = Path('app')\n(base / 'config.ini').read_text()", output: "'debug=1'" },
    },
    {
      name: 'Backslashes in a normal string',
      desc: "In 'C:\\new\\table.csv' the \\n and \\t are escape sequences — the path contains a newline and a tab, so no such file exists. Use a raw string or forward slashes.",
      wrong: { label: 'Escapes', code: "path = 'C:\\new\\table.csv'\n('\\n' in path, '\\t' in path)", output: '(True, True)' },
      fix:   { label: 'Raw string', code: "path = r'C:\\new\\table.csv'\n('\\n' in path, '\\t' in path)", output: '(False, False)' },
    },
  ],

  when: {
    use: [
      'Optional files: catch it and fall back to defaults',
      'Raising it from your own loader when a required path is missing',
      'Distinguishing "not there" from "not allowed" (PermissionError)',
    ],
    avoid: [
      'Checking existence only → Path.exists() / os.path.exists()',
      'Deleting a maybe-missing file → Path.unlink(missing_ok=True)',
      'Creating folders → Path.mkdir(parents=True, exist_ok=True) before writing',
    ],
  },

  notes: {
    cpython:     'Objects/exceptions.c — OSError(ENOENT, …) returns FileNotFoundError via the errno map',
    'Catch via': 'except OSError catches it along with PermissionError, IsADirectoryError, …',
    'Platforms': "open() says [Errno 2] everywhere; os.stat/os.remove on Windows say [WinError 2] The system cannot find the file specified",
  },

  related: [
    { name: 'OSError',         slug: 'oserror',         when: 'Base class; errno/strerror/filename live there' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'The file exists but you may not open it' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: 'The opposite: creating something that is already there' },
    { name: 'NotADirectoryError', slug: 'notadirectoryerror', when: 'A path component is a file, not a folder' },
    { name: 'ModuleNotFoundError', slug: 'modulenotfounderror', when: 'Import of a missing module — not a file error' },
    { name: 'open()',          slug: 'open',            when: 'Where the error usually comes from', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why do I get FileNotFoundError when the file exists?',
      a: 'A relative path is resolved against the current working directory, which is where the program was started from — not the folder of the script. Running python src/app.py from the project root makes open("data.csv") look in the project root. Print os.getcwd() and os.path.abspath(path) to see where Python looked, and build paths from Path(__file__).parent.',
    },
    {
      q: 'What does [Errno 2] No such file or directory mean?',
      a: 'Errno 2 is ENOENT: some component of the path does not exist. It can be the file itself or any folder on the way to it — open("out/report.txt", "w") raises it when out/ is missing, even in write mode.',
    },
    {
      q: 'Should I check os.path.exists() before opening?',
      a: 'Usually no. Catching FileNotFoundError is shorter and has no race: the file could vanish between the check and the open. Use exists() when you only need the yes/no answer and will not open the file.',
    },
    {
      q: 'What is the difference between FileNotFoundError and IOError?',
      a: 'IOError is an old alias of OSError. FileNotFoundError is the OSError subclass for errno ENOENT, added in Python 3.3. except IOError still catches FileNotFoundError, but except FileNotFoundError is the precise, modern choice.',
    },
    {
      q: 'Why does the Windows message say "The system cannot find the file specified"?',
      a: 'os and pathlib calls such as os.stat() or os.remove() report the native Windows error ([WinError 2] or [WinError 3] for a missing folder). open() reports the C runtime errno ([Errno 2] No such file or directory). The class is FileNotFoundError either way.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added, together with the other OSError subclasses (PEP 3151).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#FileNotFoundError',
    meta:  'Built-in exceptions',
  },
};
