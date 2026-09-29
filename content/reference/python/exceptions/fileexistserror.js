// content/reference/python/exceptions/fileexistserror.js

export const meta = {
  slug:        'fileexistserror',
  name:        'FileExistsError',
  signature:   'FileExistsError(errno, strerror[, filename])',
  blurb:       'Raised when creating a file or directory that already exists (errno EEXIST).',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'fileexistserror file exists error errno 17 eexist mkdir makedirs exist_ok already exists exclusive create open x mode winerror 183',
};

export const method = {
  slug:      'fileexistserror',
  name:      'FileExistsError',
  signature: 'FileExistsError(errno, strerror[, filename])',

  category:    'OS exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: "Something is already at that path. It is the error you want from open(p, 'x') and the one you usually silence with exist_ok=True on mkdir.",

  chain: ['BaseException', 'Exception', 'OSError', 'FileExistsError'],

  cheat: {
    raisedBy: "os.mkdir(), Path.mkdir(), open(p, 'x'), os.link(), Windows os.rename()",
    message:  "[Errno 17] File exists: 'path'",
    quickFix: 'os.makedirs(p, exist_ok=True)',
    watchOut: 'exist_ok does not help when a FILE has that name',
  },

  parameters: [
    { name: 'errno',    type: 'int', required: false, default: null, desc: 'errno.EEXIST when raised by the OS.' },
    { name: 'strerror', type: 'str', required: false, default: null, desc: "'File exists' from open(); Windows os.mkdir gives 'Cannot create a file when that file already exists'." },
    { name: 'filename', type: 'str | bytes | None', required: false, default: null, desc: 'The path that already exists (for os.rename, the source; the target is filename2).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: "Mode 'x' creates a file only if it does not exist yet. draft_1.txt is already there.",
      params: [{ name: 'n', type: 'int', hint: 'draft number', input: 'number' }],
      template: "from pathlib import Path\nPath('draft_1.txt').write_text('v1')\nn = {$n}\nopen(f'draft_{n}.txt', 'x').write('new draft')",
      cases: [
        { id: 'new',    label: 'new file',      values: { n: '2' } },
        { id: 'exists', label: 'existing file', values: { n: '1' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Raise it OS-style. Leave the path empty to pass None.',
      params: [{ name: 'path', type: 'str | None', hint: 'empty → None', input: 'text-or-none' }],
      template: "import errno\nraise FileExistsError(errno.EEXIST, 'File exists', {$path})",
      cases: [
        { id: 'path',   label: 'with path', values: { path: 'backups/2024-06-01' } },
        { id: 'nopath', label: 'no path',   values: { path: '' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'run_1 already exists. Creating it again is caught and reported via e.filename.',
      params: [{ name: 'n', type: 'int', hint: 'run number', input: 'number' }],
      template: "import os\nos.mkdir('run_1')\nn = {$n}\ntry:\n    os.mkdir(f'run_{n}')\n    status = 'created'\nexcept FileExistsError as e:\n    status = f'{e.filename} already exists'\nstatus",
      cases: [
        { id: 'new',    label: 'new folder',      values: { n: '2' } },
        { id: 'exists', label: 'existing folder', values: { n: '1' } },
      ],
    },
  ],
  demoExplainer: "A successful open(..., 'x').write() returns the number of characters written; on an existing name it refuses instead of truncating — that is the whole point of 'x'. The Handle demo reads e.filename rather than str(e): os.mkdir's message text differs on Windows ([WinError 183]), but the class and filename do not.",

  attributes: [
    { name: 'errno',    type: 'int | None', meaning: 'errno.EEXIST (17 on Linux, macOS and Windows).' },
    { name: 'strerror', type: 'str | None', meaning: "'File exists' on POSIX and from open(); the Windows API text for os.mkdir and os.rename." },
    { name: 'filename', type: 'str | bytes | None', meaning: 'The path that was in the way.' },
    { name: 'filename2', type: 'str | None', meaning: 'For os.rename / os.link: the destination path.' },
  ],

  patterns: [
    {
      name: 'Create a folder if needed',
      desc: 'exist_ok=True turns "already there" into success — no try/except, no race.',
      code: "import os\nos.makedirs('out/logs', exist_ok=True)",
    },
    {
      name: 'Never overwrite: exclusive create',
      desc: "Mode 'x' fails atomically if the file exists, so two processes cannot both think they created it.",
      code: "try:\n    with open('report.csv', 'x') as f:\n        f.write(data)\nexcept FileExistsError:\n    print('report.csv exists, not overwriting')",
    },
    {
      name: 'Lock file',
      desc: 'O_CREAT | O_EXCL is the classic cross-process lock: only one caller can create the file.',
      code: "import os\ntry:\n    fd = os.open('app.lock', os.O_CREAT | os.O_EXCL | os.O_WRONLY)\nexcept FileExistsError:\n    raise SystemExit('another instance is running')",
    },
    {
      name: 'Replace a file on every OS',
      desc: 'os.rename raises FileExistsError on Windows when the target exists; os.replace overwrites everywhere.',
      code: "import os\nos.replace('report.tmp', 'report.csv')",
    },
  ],

  examples: [
    { title: "open(..., 'x') on an existing file", code: "from pathlib import Path\nPath('report.txt').write_text('v1')\nopen('report.txt', 'x')", returns: "FileExistsError: [Errno 17] File exists: 'report.txt'" },
    { title: 'mkdir twice',                        code: "import os\nos.mkdir('out')\ntry:\n    os.mkdir('out')\nexcept FileExistsError as e:\n    r = e.filename\nr", returns: "'out'" },
    { title: 'makedirs with exist_ok=True',         code: "import os\nos.makedirs('out/logs', exist_ok=True)\nos.makedirs('out/logs', exist_ok=True)\nos.path.isdir('out/logs')", returns: 'True' },
    { title: 'Path.mkdir(parents=True, exist_ok=True)', code: "from pathlib import Path\nPath('a/b/c').mkdir(parents=True, exist_ok=True)\nPath('a/b/c').mkdir(parents=True, exist_ok=True)\nPath('a/b/c').is_dir()", returns: 'True' },
    { title: 'exist_ok does not cover a file',      code: "from pathlib import Path\nPath('out').write_text('oops')\ntry:\n    Path('out').mkdir(exist_ok=True)\nexcept OSError as e:\n    r = type(e).__name__\nr", returns: "'FileExistsError'" },
    { title: 'errno EEXIST maps to it',             code: "import errno\nOSError(errno.EEXIST, 'File exists', 'a.txt')", returns: "FileExistsError(17, 'File exists')" },
    { title: 'os.replace overwrites everywhere',    code: "import os\nfrom pathlib import Path\nPath('new.txt').write_text('v2')\nPath('old.txt').write_text('v1')\nos.replace('new.txt', 'old.txt')\n(Path('old.txt').read_text(), os.path.exists('new.txt'))", returns: "('v2', False)" },
  ],

  pitfalls: [
    {
      name: "'w' silently overwrites",
      desc: "open(p, 'w') truncates an existing file without a word. When losing the old content would be a bug, use 'x' and handle FileExistsError.",
      wrong: { label: "mode 'w'", code: "from pathlib import Path\nPath('notes.txt').write_text('important')\nopen('notes.txt', 'w').write('draft')\nPath('notes.txt').read_text()", output: "'draft'" },
      fix:   { label: "mode 'x'", code: "from pathlib import Path\nPath('notes.txt').write_text('important')\ntry:\n    open('notes.txt', 'x').write('draft')\nexcept FileExistsError:\n    pass\nPath('notes.txt').read_text()", output: "'important'" },
    },
    {
      name: 'Swallowing FileExistsError instead of exist_ok',
      desc: 'except FileExistsError: pass assumes "the folder is already there". But a FILE with that name raises the same error — the folder you rely on does not exist. exist_ok=True only forgives an existing directory, so the file case still surfaces.',
      wrong: { label: 'except: pass', code: "import os\nfrom pathlib import Path\nPath('out').write_text('stray file')\ntry:\n    os.makedirs('out')\nexcept FileExistsError:\n    pass  # 'already there, fine'\nos.path.isdir('out')", output: 'False' },
      fix:   { label: 'exist_ok=True', code: "import os\nfrom pathlib import Path\nPath('out').write_text('stray file')\ntry:\n    os.makedirs('out', exist_ok=True)\n    r = 'ready'\nexcept FileExistsError:\n    r = 'out is a file, not a folder'\nr", output: "'out is a file, not a folder'" },
    },
  ],

  when: {
    use: [
      "Refusing to overwrite: open(p, 'x') and catch FileExistsError",
      'Lock files and "first one wins" creation',
      'Raising it from your own create-only API',
    ],
    avoid: [
      'Folder may already exist → os.makedirs(p, exist_ok=True)',
      'Overwrite on purpose → os.replace(src, dst)',
      'Just checking → Path.exists()',
    ],
  },

  notes: {
    cpython:     'Objects/exceptions.c — OSError(EEXIST, …) returns FileExistsError via the errno map',
    'Catch via': 'except OSError',
    'Platforms': 'os.rename onto an existing file raises FileExistsError on Windows but replaces silently on Linux/macOS; os.replace behaves the same everywhere',
  },

  related: [
    { name: 'OSError',           slug: 'oserror',           when: 'Base class with errno / filename' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'The opposite case: the path is missing' },
    { name: 'IsADirectoryError', slug: 'isadirectoryerror', when: 'A folder is in the way of a file operation' },
    { name: 'open()',            slug: 'open',              when: "Mode 'x' for exclusive creation", category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I fix FileExistsError on os.mkdir?',
      a: 'Use os.makedirs(path, exist_ok=True) or Path(path).mkdir(parents=True, exist_ok=True). Both succeed when the directory is already there and still raise if something else is wrong.',
    },
    {
      q: 'Why do I still get FileExistsError with exist_ok=True?',
      a: 'exist_ok only forgives an existing directory. If a regular file has that name, the directory cannot be created and FileExistsError is raised anyway. Delete or rename the file, or pick another folder name.',
    },
    {
      q: 'What does [WinError 183] Cannot create a file when that file already exists mean?',
      a: 'It is FileExistsError on Windows. os.mkdir and os.rename report the native Windows code (183) instead of errno 17. The class is the same, so except FileExistsError works on every platform.',
    },
    {
      q: 'Why does os.rename raise FileExistsError on Windows but not on Linux?',
      a: 'On POSIX, rename() atomically replaces an existing target file. On Windows it refuses. Use os.replace(src, dst) when you want the replace behaviour on every OS.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added, together with the other OSError subclasses (PEP 3151).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#FileExistsError',
    meta:  'Built-in exceptions',
  },
};
