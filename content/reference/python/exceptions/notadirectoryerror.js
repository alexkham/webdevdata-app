// content/reference/python/exceptions/notadirectoryerror.js

export const meta = {
  slug:        'notadirectoryerror',
  name:        'NotADirectoryError',
  signature:   'NotADirectoryError(errno, strerror[, filename])',
  blurb:       'Raised when a directory operation is used on something that is not a directory (errno ENOTDIR).',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'notadirectoryerror not a directory error errno 20 enotdir listdir file scandir iterdir rmdir winerror 267 directory name is invalid path through a file',
};

export const method = {
  slug:      'notadirectoryerror',
  name:      'NotADirectoryError',
  signature: 'NotADirectoryError(errno, strerror[, filename])',

  category:    'OS exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: '[Errno 20] Not a directory — a file sits where a folder was expected: you listed it, removed it with rmdir, or used it as a path component.',

  chain: ['BaseException', 'Exception', 'OSError', 'NotADirectoryError'],

  cheat: {
    raisedBy: 'os.listdir(file), os.scandir(file), os.rmdir(file), Path.iterdir()',
    message:  "[Errno 20] Not a directory: 'path'",
    quickFix: 'check Path.is_dir(); look for a stray file with the folder name',
    watchOut: "open('file.txt/x'): Linux/macOS ENOTDIR, Windows FileNotFoundError",
  },

  parameters: [
    { name: 'errno',    type: 'int', required: false, default: null, desc: 'errno.ENOTDIR (20 on Linux, macOS and Windows).' },
    { name: 'strerror', type: 'str', required: false, default: null, desc: "'Not a directory' on POSIX; Windows os.* calls say 'The directory name is invalid'." },
    { name: 'filename', type: 'str | bytes | None', required: false, default: null, desc: 'The path that was treated as a folder.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'What POSIX systems raise for os.listdir() on a file: OSError with errno ENOTDIR, turned into NotADirectoryError by the constructor.',
      params: [{ name: 'path', type: 'str | None', hint: 'empty → None', input: 'text-or-none' }],
      template: "import errno\nraise OSError(errno.ENOTDIR, 'Not a directory', {$path})",
      cases: [
        { id: 'file',   label: 'a file',        values: { path: 'notes.txt' } },
        { id: 'inside', label: 'path through a file', values: { path: 'notes.txt/draft' } },
        { id: 'nopath', label: 'no path',       values: { path: '' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'The one-argument form for your own code: just a message, errno stays None.',
      params: [{ name: 'message', type: 'str', hint: 'message', input: 'text' }],
      template: 'e = NotADirectoryError({$message})\n(e.errno, e.strerror, str(e))',
      cases: [
        { id: 'msg',   label: 'message',       values: { message: 'output path points at a file' } },
        { id: 'empty', label: 'empty message', values: { message: '' } },
      ],
    },
  ],
  demoExplainer: "OSError(errno.ENOTDIR, …) comes back as NotADirectoryError — look at the class name in the result, not the one in the code. The demo builds it explicitly because the real message differs by OS: Linux says [Errno 20] Not a directory, Windows says [WinError 267] The directory name is invalid. The class is the same on both.",

  attributes: [
    { name: 'errno',    type: 'int | None', meaning: 'errno.ENOTDIR when raised by the OS (also on Windows, translated from WinError 267).' },
    { name: 'strerror', type: 'str | None', meaning: "'Not a directory', or the Windows text 'The directory name is invalid'." },
    { name: 'filename', type: 'str | bytes | None', meaning: 'The path that is not a folder.' },
    { name: 'winerror', type: 'int', meaning: 'Windows only: 267 (ERROR_DIRECTORY).' },
  ],

  patterns: [
    {
      name: 'Check before listing',
      desc: 'When a path may be a file or a folder, branch on is_dir().',
      code: "from pathlib import Path\np = Path(target)\nfiles = list(p.iterdir()) if p.is_dir() else [p]",
    },
    {
      name: 'Walk instead of recursing by hand',
      desc: 'os.walk separates folders from files, so you never call listdir on a file.',
      code: "import os\nfor root, dirs, files in os.walk('project'):\n    for name in files:\n        handle(os.path.join(root, name))",
    },
    {
      name: 'Fail early with a clear message',
      desc: 'Validate a configured output folder once at start-up.',
      code: "from pathlib import Path\nout = Path(config['output_dir'])\nif out.exists() and not out.is_dir():\n    raise SystemExit(f'{out} is a file, expected a folder')",
    },
  ],

  examples: [
    { title: 'errno ENOTDIR maps to it',       code: "import errno\nOSError(errno.ENOTDIR, 'Not a directory', 'notes.txt')", returns: "NotADirectoryError(20, 'Not a directory')" },
    { title: 'os.listdir() on a file',         code: "import os\nfrom pathlib import Path\nPath('notes.txt').write_text('hi')\ntry:\n    os.listdir('notes.txt')\nexcept OSError as e:\n    r = (type(e).__name__, e.filename)\nr", returns: "('NotADirectoryError', 'notes.txt')" },
    { title: 'os.rmdir() on a file',           code: "import os\nfrom pathlib import Path\nPath('notes.txt').write_text('hi')\ntry:\n    os.rmdir('notes.txt')\nexcept NotADirectoryError as e:\n    r = e.filename\nr", returns: "'notes.txt'" },
    { title: 'Path.iterdir() on a file',       code: "from pathlib import Path\nPath('notes.txt').write_text('hi')\ntry:\n    list(Path('notes.txt').iterdir())\nexcept NotADirectoryError:\n    r = 'not a folder'\nr", returns: "'not a folder'" },
    { title: 'is_dir() avoids it',             code: "from pathlib import Path\nPath('notes.txt').write_text('hi')\np = Path('notes.txt')\nlist(p.iterdir()) if p.is_dir() else [p.name]", returns: "['notes.txt']" },
    { title: 'Path through a file, portably',  code: "from pathlib import Path\nPath('notes.txt').write_text('hi')\ntry:\n    open('notes.txt/draft')\nexcept (NotADirectoryError, FileNotFoundError) as e:\n    r = e.filename\nr", returns: "'notes.txt/draft'" },
  ],

  pitfalls: [
    {
      name: 'A stray file with the folder name',
      desc: "open('backup', 'w') by mistake (missing file name) leaves a FILE called backup. Later code that expects the folder fails. Validate the type, not just existence.",
      wrong: { label: 'exists() check', code: "import os\nfrom pathlib import Path\nPath('backup').write_text('')\nif os.path.exists('backup'):\n    try:\n        r = os.listdir('backup')\n    except NotADirectoryError:\n        r = 'crashed: backup is a file'\nr", output: "'crashed: backup is a file'" },
      fix:   { label: 'is_dir() check', code: "import os\nfrom pathlib import Path\nPath('backup').write_text('')\nr = os.listdir('backup') if os.path.isdir('backup') else 'backup is a file — rename it'\nr", output: "'backup is a file — rename it'" },
    },
    {
      name: 'Hand-rolled recursion calls listdir on files',
      desc: 'A recursive walk that lists every entry it finds will eventually list a file. os.walk() separates folders from files for you.',
      wrong: { label: 'Recursive listdir', code: "import os\nfrom pathlib import Path\nos.makedirs('proj/src')\nPath('proj/readme.md').write_text('# proj')\ndef count_dirs(folder):\n    return 1 + sum(count_dirs(f'{folder}/{n}') for n in os.listdir(folder))\ntry:\n    r = count_dirs('proj')\nexcept NotADirectoryError as e:\n    r = f'listdir on a file: {e.filename}'\nr", output: "'listdir on a file: proj/readme.md'" },
      fix:   { label: 'os.walk', code: "import os\nfrom pathlib import Path\nos.makedirs('proj/src')\nPath('proj/readme.md').write_text('# proj')\nsum(1 for _ in os.walk('proj'))", output: '2' },
    },
  ],

  when: {
    use: [
      'Catching a file passed where a folder was expected',
      'Raising it from your own API that requires a directory',
    ],
    avoid: [
      'Unknown path type → branch on Path.is_dir() first',
      'Tree traversal → os.walk() or Path.rglob() instead of hand-rolled listdir recursion',
    ],
  },

  notes: {
    cpython:     'Objects/exceptions.c — OSError(ENOTDIR, …) returns NotADirectoryError; Windows ERROR_DIRECTORY (267) is translated to ENOTDIR',
    'Catch via': 'except OSError',
    'Platforms': 'os.listdir / os.rmdir / os.scandir on a file raise it everywhere; the message is [Errno 20] Not a directory on POSIX and [WinError 267] The directory name is invalid on Windows',
  },

  related: [
    { name: 'IsADirectoryError', slug: 'isadirectoryerror', when: 'The reverse: a folder used as a file' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'What Windows raises for a path through a file' },
    { name: 'OSError',           slug: 'oserror',           when: 'Base class' },
    { name: 'FileExistsError',   slug: 'fileexistserror',   when: 'mkdir where a file of that name already exists' },
  ],

  faq: [
    {
      q: 'What causes NotADirectoryError: [Errno 20] Not a directory?',
      a: 'A path that must be a folder is a regular file. Typical cases: os.listdir()/os.scandir()/Path.iterdir() on a file, os.rmdir() on a file, or a path that goes through a file like "config.json/key". A frequent root cause is a file accidentally created with the folder name.',
    },
    {
      q: 'What is [WinError 267] The directory name is invalid?',
      a: 'The Windows form of NotADirectoryError. os.listdir(), os.scandir() and os.rmdir() on a file report native error 267, which Python maps to errno ENOTDIR and the NotADirectoryError class — except NotADirectoryError works on every platform.',
    },
    {
      q: 'Why does opening "file.txt/x" give a different error on Windows?',
      a: 'Linux and macOS notice that file.txt is not a directory and return ENOTDIR (NotADirectoryError). Windows just reports that the path does not exist (FileNotFoundError). Catch both, or check Path(path).parent.is_dir() first.',
    },
    {
      q: 'What is the difference between NotADirectoryError and IsADirectoryError?',
      a: 'They are mirror images. NotADirectoryError: a folder operation got a file. IsADirectoryError: a file operation got a folder. Both are OSError subclasses added in Python 3.3.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added, together with the other OSError subclasses (PEP 3151).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#NotADirectoryError',
    meta:  'Built-in exceptions',
  },
};
