// content/reference/python/exceptions/permissionerror.js

export const meta = {
  slug:        'permissionerror',
  name:        'PermissionError',
  signature:   'PermissionError(errno, strerror[, filename])',
  blurb:       'Raised when the OS refuses an operation for lack of access rights (errno EACCES or EPERM).',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'permissionerror permission error errno 13 permission denied eacces eperm operation not permitted access is denied winerror 5 read only chmod sudo file in use',
};

export const method = {
  slug:      'permissionerror',
  name:      'PermissionError',
  signature: 'PermissionError(errno, strerror[, filename])',

  category:    'OS exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: '[Errno 13] Permission denied — the path exists, but the OS will not let this process do that to it. One class for two errnos: EACCES and EPERM.',

  chain: ['BaseException', 'Exception', 'OSError', 'PermissionError'],

  cheat: {
    raisedBy: 'open(), os.remove(), os.mkdir(), shutil.*, os.kill()',
    message:  "[Errno 13] Permission denied: 'path'",
    quickFix: 'write somewhere you own (venv, home, temp dir)',
    watchOut: 'Windows: open() on a folder and files locked by other programs',
  },

  parameters: [
    { name: 'errno',    type: 'int', required: false, default: null, desc: 'errno.EACCES (permission bits, ACLs) or errno.EPERM (operation not allowed at all). Both map to this class.' },
    { name: 'strerror', type: 'str', required: false, default: null, desc: "'Permission denied' (EACCES), 'Operation not permitted' (EPERM), 'Access is denied' from Windows API calls." },
    { name: 'filename', type: 'str | bytes | None', required: false, default: null, desc: 'The path the OS refused.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'What the OS raises for a refused path: an OSError with errno EACCES, which the constructor turns into PermissionError.',
      params: [{ name: 'path', type: 'str | None', hint: 'empty → None', input: 'text-or-none' }],
      template: "import errno\nraise OSError(errno.EACCES, 'Permission denied', {$path})",
      cases: [
        { id: 'system', label: 'system file',  values: { path: '/etc/shadow' } },
        { id: 'site',   label: 'site-packages', values: { path: '/usr/lib/python3/dist-packages/x' } },
        { id: 'nopath', label: 'no path',      values: { path: '' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'The one-argument form you use in your own code: a message only, errno and strerror stay None.',
      params: [{ name: 'message', type: 'str', hint: 'message', input: 'text' }],
      template: 'e = PermissionError({$message})\n(e.errno, e.strerror, str(e))',
      cases: [
        { id: 'msg',   label: 'message',       values: { message: 'only admins can delete projects' } },
        { id: 'empty', label: 'empty message', values: { message: '' } },
      ],
    },
  ],
  demoExplainer: 'Trigger raises OSError, yet the traceback says PermissionError — the constructor picked the subclass from errno.EACCES. Errno 13 is the same number on Linux, macOS and Windows. In Raise, a single argument is just the message: errno and strerror stay None, so code that inspects e.errno must not assume it is set.',

  attributes: [
    { name: 'errno',    type: 'int | None', meaning: 'errno.EACCES or errno.EPERM when raised by the OS; None for the one-argument form.' },
    { name: 'strerror', type: 'str | None', meaning: 'The OS text — "Permission denied", "Operation not permitted", or Windows "Access is denied".' },
    { name: 'filename', type: 'str | bytes | None', meaning: 'The refused path.' },
    { name: 'winerror', type: 'int', meaning: 'Windows only: 5 (access denied), 32 (file in use by another process), …' },
  ],

  patterns: [
    {
      name: 'Fall back to a user-writable location',
      desc: 'Try the preferred path; on PermissionError use one under the home directory.',
      code: "from pathlib import Path\ntry:\n    log = open('/var/log/myapp.log', 'a')\nexcept PermissionError:\n    log = open(Path.home() / 'myapp.log', 'a')",
    },
    {
      name: 'Tell the user what to do',
      desc: 'Turn the low-level error into an actionable message.',
      code: "try:\n    shutil.copy(src, dst)\nexcept PermissionError as e:\n    raise SystemExit(f'cannot write {e.filename}: check ownership or pick another folder')",
    },
    {
      name: 'Portable "cannot open this path"',
      desc: 'open() on a folder is IsADirectoryError on Linux/macOS but PermissionError on Windows — catch both.',
      code: "try:\n    text = open(path).read()\nexcept (IsADirectoryError, PermissionError):\n    text = None",
    },
  ],

  examples: [
    { title: 'EACCES and EPERM both map to it', code: "import errno\n[type(OSError(c, 'x')).__name__ for c in (errno.EACCES, errno.EPERM)]", returns: "['PermissionError', 'PermissionError']" },
    { title: 'The OS-style message',            code: "import errno\nstr(PermissionError(errno.EACCES, 'Permission denied', '/etc/shadow'))", returns: "\"[Errno 13] Permission denied: '/etc/shadow'\"" },
    { title: 'Tell EPERM from EACCES by errno', code: "import errno\ne = OSError(errno.EPERM, 'Operation not permitted', 'app.pid')\n(type(e).__name__, e.errno == errno.EPERM)", returns: "('PermissionError', True)" },
    { title: 'Opening a folder, portably',      code: "import os\nos.mkdir('data')\ntry:\n    open('data')\nexcept (IsADirectoryError, PermissionError) as e:\n    r = f'{e.filename} is not a readable file'\nr", returns: "'data is not a readable file'" },
    { title: 'Caught by except OSError',        code: "import errno\ntry:\n    raise OSError(errno.EACCES, 'Permission denied', 'db.sqlite')\nexcept OSError as e:\n    r = (type(e).__name__, e.filename)\nr", returns: "('PermissionError', 'db.sqlite')" },
    { title: 'One-argument form',               code: "e = PermissionError('read-only mode')\n(e.args, e.errno)", returns: "(('read-only mode',), None)" },
  ],

  pitfalls: [
    {
      name: 'Checking only errno.EACCES',
      desc: 'Some refusals come back as EPERM ("Operation not permitted"). Testing one errno misses the other; the class covers both.',
      wrong: { label: 'e.errno == EACCES', code: "import errno\ntry:\n    raise OSError(errno.EPERM, 'Operation not permitted', 'app.pid')\nexcept OSError as e:\n    r = 'denied' if e.errno == errno.EACCES else 'other error'\nr", output: "'other error'" },
      fix:   { label: 'except PermissionError', code: "import errno\ntry:\n    raise OSError(errno.EPERM, 'Operation not permitted', 'app.pid')\nexcept PermissionError:\n    r = 'denied'\nr", output: "'denied'" },
    },
    {
      name: 'except OSError turns "denied" into "missing"',
      desc: 'A loader that treats every OSError as "no config file" silently ignores a config it is not allowed to read. Catch FileNotFoundError only and let PermissionError surface.',
      wrong: { label: 'except OSError', code: "import errno\ndef read_config(path):\n    # the file exists but is not readable\n    raise PermissionError(errno.EACCES, 'Permission denied', path)\ntry:\n    cfg = read_config('app.ini')\nexcept OSError:\n    cfg = {}\ncfg", output: '{}' },
      fix:   { label: 'except FileNotFoundError', code: "import errno\ndef read_config(path):\n    # the file exists but is not readable\n    raise PermissionError(errno.EACCES, 'Permission denied', path)\ntry:\n    cfg = read_config('app.ini')\nexcept FileNotFoundError:\n    cfg = {}\ncfg", output: "PermissionError: [Errno 13] Permission denied: 'app.ini'" },
    },
  ],

  when: {
    use: [
      'Falling back to a location the user owns',
      'Turning a refused path into a clear, actionable message',
      'Raising it from your own code for an access-control refusal',
    ],
    avoid: [
      'Fixing it with sudo — install into a virtualenv or use --user instead',
      'Checking os.access() first — the result can change before you open; just try',
      'Treating it as "file missing" — that is FileNotFoundError',
    ],
  },

  notes: {
    cpython:       'Objects/exceptions.c — EACCES, EPERM (and WASI ENOTCAPABLE) map to PermissionError',
    'Catch via':   'except OSError',
    'Windows':     'A file open in another program (Excel, an editor, antivirus) gives [WinError 32] … being used by another process; os.* calls say [WinError 5] Access is denied',
    'root':        'Running as root (Docker images often do) bypasses file permission bits, so code that raises PermissionError on a laptop may not raise it in a container',
  },

  related: [
    { name: 'OSError',           slug: 'oserror',           when: 'Base class; e.errno tells EACCES from EPERM' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'The path does not exist at all' },
    { name: 'IsADirectoryError', slug: 'isadirectoryerror', when: 'What Linux raises where Windows raises PermissionError' },
    { name: 'open()',            slug: 'open',              when: 'Most common source', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I fix PermissionError: [Errno 13] Permission denied?',
      a: 'Find out which path it is (e.filename) and why: the file belongs to another user or is read-only; you are writing into a system folder (/usr, C:\\Program Files); the path is actually a folder (Windows reports that as Permission denied); or, on Windows, another program has the file open. Fix the cause — write to a folder you own, close the other program, change ownership — rather than running Python as administrator.',
    },
    {
      q: 'Why does pip install fail with Permission denied?',
      a: 'It is trying to write into the system Python\'s site-packages, which belongs to root/Administrator. Use a virtual environment (python -m venv .venv) or pip install --user. sudo pip works but can break the system Python.',
    },
    {
      q: 'Why do I get PermissionError when opening a folder on Windows?',
      a: 'On Windows, open() on a directory fails with EACCES, so you get PermissionError: [Errno 13] Permission denied. Linux and macOS raise IsADirectoryError for the same call. Catch (IsADirectoryError, PermissionError) or check Path.is_file() first.',
    },
    {
      q: 'What is the difference between EACCES and EPERM?',
      a: 'EACCES (errno 13, "Permission denied") means the permission bits or ACLs forbid access. EPERM (errno 1, "Operation not permitted") means the operation is forbidden regardless of permissions — e.g. signalling another user\'s process or changing a file you do not own. Python maps both to PermissionError; read e.errno if you need to tell them apart.',
    },
  ],

  history: [
    { version: '3.3',    note: 'Added, together with the other OSError subclasses (PEP 3151).' },
    { version: '3.11.1', note: "WASI's ENOTCAPABLE is now mapped to PermissionError." },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#PermissionError',
    meta:  'Built-in exceptions',
  },
};
