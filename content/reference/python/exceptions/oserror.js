// content/reference/python/exceptions/oserror.js

export const meta = {
  slug:        'oserror',
  name:        'OSError',
  signature:   'OSError(errno, strerror[, filename[, winerror[, filename2]]])',
  blurb:       'Base class for errors reported by the operating system: files, directories, processes, sockets.',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'oserror os error ioerror environmenterror windowserror blockingioerror childprocesserror interruptederror processlookuperror errno strerror filename io error system error pep 3151 socket.error',
};

export const method = {
  slug:      'oserror',
  name:      'OSError',
  signature: 'OSError(errno, strerror[, filename[, winerror[, filename2]]])',

  category:    'OS exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Every failed system call ends up here. Since Python 3.3 the constructor looks at errno and hands you the matching subclass — FileNotFoundError, PermissionError and friends.',

  chain: ['BaseException', 'Exception', 'OSError'],

  cheat: {
    raisedBy: 'open(), os.*, shutil.*, pathlib, socket, subprocess',
    message:  "[Errno N] strerror: 'filename'",
    quickFix: 'catch the specific subclass; read e.errno / e.filename',
    watchOut: 'IOError, EnvironmentError, socket.error are all OSError',
  },

  parameters: [
    { name: 'errno',     type: 'int',         required: false, default: null, desc: 'Numeric error code (compare with errno.ENOENT etc.). Decides which subclass the constructor returns.' },
    { name: 'strerror',  type: 'str',         required: false, default: null, desc: 'Human-readable message, normally what the OS reports for that errno.' },
    { name: 'filename',  type: 'str | bytes | None', required: false, default: null, desc: 'The path involved. When given (and not None), args is cut down to (errno, strerror).' },
    { name: 'winerror',  type: 'int | None',  required: false, default: null, desc: 'Windows only: the native error code. On Windows it overrides errno; elsewhere it is ignored.' },
    { name: 'filename2', type: 'str | None',  required: false, default: null, desc: 'Second path for two-path operations such as os.rename(). Added in 3.4.' },
  ],

  modes: [
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Build an OSError from its parts. Watch how filename changes both str(e) and e.args.',
      params: [
        { name: 'errno',    type: 'int',        hint: 'error code',            input: 'number' },
        { name: 'strerror', type: 'str',        hint: 'message',               input: 'text' },
        { name: 'filename', type: 'str | None', hint: 'empty → None',          input: 'text-or-none' },
      ],
      template: 'e = OSError({$errno}, {$strerror}, {$filename})\n(e.args, str(e))',
      cases: [
        { id: 'file',    label: 'with filename', values: { errno: '2', strerror: 'No such file or directory', filename: 'data.csv' } },
        { id: 'nofile',  label: 'filename None', values: { errno: '28', strerror: 'No space left on device', filename: '' } },
        { id: 'empty',   label: 'empty strerror', values: { errno: '5', strerror: '', filename: 'disk.img' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'except OSError catches every subclass. Only report_1.txt exists; the attributes tell you what went wrong.',
      params: [{ name: 'n', type: 'int', hint: 'report number', input: 'number' }],
      template: "from pathlib import Path\nPath('report_1.txt').write_text('Q1 figures')\nn = {$n}\ntry:\n    result = open(f'report_{n}.txt').read()\nexcept OSError as e:\n    result = (type(e).__name__, e.errno, e.strerror, e.filename)\nresult",
      cases: [
        { id: 'exists',  label: 'existing file', values: { n: '1' } },
        { id: 'missing', label: 'missing file',  values: { n: '2' } },
      ],
    },
  ],
  demoExplainer: "In Raise, a filename makes args shrink to (errno, strerror) and adds : 'name' (repr, with quotes) to the message; with None it is left out and args keeps all three. In Handle, except OSError caught a FileNotFoundError — type(e).__name__ shows the real class the OS error was mapped to.",

  attributes: [
    { name: 'errno',     type: 'int | None', meaning: 'Numeric code. Compare with errno.ENOENT, errno.EACCES … rather than literal numbers — the values differ between Linux, macOS and Windows for many codes.' },
    { name: 'strerror',  type: 'str | None', meaning: 'The OS message for that errno (perror() text on POSIX, FormatMessage() on Windows).' },
    { name: 'filename',  type: 'str | bytes | None', meaning: 'The path passed to the failing call, exactly as you passed it.' },
    { name: 'filename2', type: 'str | None', meaning: 'Second path, for os.rename(), os.link() and similar.' },
    { name: 'winerror',  type: 'int',        meaning: 'Windows only — native error code (e.g. 183 for "already exists"). Absent on other platforms.' },
    { name: 'args',      type: 'tuple',      meaning: '(errno, strerror) when a filename was given; otherwise all constructor arguments.' },
  ],

  patterns: [
    {
      name: 'Specific first, OSError last',
      desc: 'Handle the cases you understand, then let the base class catch the rest with its details.',
      code: "try:\n    data = open(path).read()\nexcept FileNotFoundError:\n    data = ''\nexcept PermissionError:\n    raise SystemExit(f'no access to {path}')\nexcept OSError as e:\n    raise SystemExit(f'cannot read {path}: {e.strerror}')",
    },
    {
      name: 'Branch on errno with the errno module',
      desc: 'For codes without a dedicated subclass (ENOSPC, ENOTEMPTY, EROFS …) compare e.errno with the named constant.',
      code: "import errno\ntry:\n    os.rmdir(path)\nexcept OSError as e:\n    if e.errno != errno.ENOTEMPTY:\n        raise\n    shutil.rmtree(path)",
    },
    {
      name: 'Raise an OS-style error yourself',
      desc: 'Passing errno + strerror + filename gives the same message shape (and subclass) that real I/O errors have.',
      code: "import errno, os\nif not os.path.exists(path):\n    raise OSError(errno.ENOENT, 'No such file or directory', path)",
    },
  ],

  examples: [
    { title: 'The constructor returns a subclass', code: "import errno\nOSError(errno.ENOENT, 'No such file or directory', 'data.csv')", returns: "FileNotFoundError(2, 'No such file or directory')" },
    { title: 'One argument: errno stays None',   code: "e = OSError('disk full')\n(e.errno, e.strerror, str(e))", returns: "(None, None, 'disk full')" },
    { title: 'filename is not in args',           code: "e = OSError(2, 'No such file or directory', 'data.csv')\n(e.args, e.filename)", returns: "((2, 'No such file or directory'), 'data.csv')" },
    { title: 'IOError and EnvironmentError are aliases', code: 'IOError is OSError, EnvironmentError is OSError', returns: '(True, True)' },
    { title: 'A plain OSError: rmdir on a non-empty folder', code: "import errno, os\nos.mkdir('build')\nopen('build/app.o', 'w').close()\ntry:\n    os.rmdir('build')\nexcept OSError as e:\n    r = (type(e).__name__, e.errno == errno.ENOTEMPTY)\nr", returns: "('OSError', True)" },
    { title: 'The four minor subclasses',         code: "import errno\n[type(OSError(c, 'x')).__name__ for c in (errno.EAGAIN, errno.ECHILD, errno.EINTR, errno.ESRCH)]", returns: "['BlockingIOError', 'ChildProcessError', 'InterruptedError', 'ProcessLookupError']" },
    { title: 'BlockingIOError: third arg is characters_written', code: "import errno\ne = BlockingIOError(errno.EAGAIN, 'Resource temporarily unavailable', 7)\n(e.characters_written, e.filename)", returns: '(7, None)' },
    { title: 'Subclassing turns the mapping off', code: "import errno\nclass StorageError(OSError):\n    pass\ntype(StorageError(errno.ENOENT, 'gone')).__name__", returns: "'StorageError'" },
  ],

  pitfalls: [
    {
      name: 'except OSError before its subclasses',
      desc: 'The first matching clause wins. OSError matches every file error, so a subclass clause after it is dead code.',
      wrong: { label: 'Base class first', code: "try:\n    open('missing.txt')\nexcept OSError:\n    r = 'generic I/O error'\nexcept FileNotFoundError:\n    r = 'create it first'\nr", output: "'generic I/O error'" },
      fix:   { label: 'Subclass first',   code: "try:\n    open('missing.txt')\nexcept FileNotFoundError:\n    r = 'create it first'\nexcept OSError:\n    r = 'generic I/O error'\nr", output: "'create it first'" },
    },
    {
      name: 'Reading the filename from e.args',
      desc: 'With a filename, args holds only (errno, strerror) for backwards compatibility. Use the attribute.',
      wrong: { label: 'e.args[2]',  code: "try:\n    open('missing.txt')\nexcept OSError as e:\n    name = e.args[2]\nname", output: 'IndexError: tuple index out of range' },
      fix:   { label: 'e.filename', code: "try:\n    open('missing.txt')\nexcept OSError as e:\n    name = e.filename\nname", output: "'missing.txt'" },
    },
    {
      name: 'A custom OSError subclass is not remapped',
      desc: 'The errno → subclass magic only happens when you construct OSError itself (or an alias). Your subclass stays your subclass, so except FileNotFoundError does not see it.',
      wrong: { label: 'Subclass + errno', code: "import errno\nclass AppError(OSError):\n    pass\ntry:\n    raise AppError(errno.ENOENT, 'gone')\nexcept FileNotFoundError:\n    r = 'missing'\nr", output: 'AppError: [Errno 2] gone' },
      fix:   { label: 'Raise the real class', code: "import errno\ntry:\n    raise FileNotFoundError(errno.ENOENT, 'gone')\nexcept FileNotFoundError:\n    r = 'missing'\nr", output: "'missing'" },
    },
  ],

  when: {
    use: [
      'Catch-all for I/O and system-call failures after the specific subclasses',
      'Raising an error that mirrors a real OS failure (errno + strerror + filename)',
      'Codes with no subclass of their own: disk full (ENOSPC), directory not empty (ENOTEMPTY), read-only FS (EROFS)',
    ],
    avoid: [
      'Missing file → catch FileNotFoundError',
      'Access denied → PermissionError',
      'Bad argument values or types → ValueError / TypeError, not OSError',
    ],
  },

  notes: {
    cpython:        'Objects/exceptions.c — OSError_new maps errno to a subclass via a lookup table, only when type is OSError itself',
    'PEP 3151':     'Python 3.3 merged IOError, EnvironmentError, WindowsError, socket.error, select.error and mmap.error into OSError and added the errno subclasses',
    'Catch via':    'except OSError catches every subclass: FileNotFoundError, PermissionError, ConnectionError, TimeoutError …',
    'Windows':      'OS calls such as os.mkdir report [WinError N] and a Windows message; open() reports [Errno N] from the C runtime',
  },

  related: [
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'errno ENOENT — the most common OSError' },
    { name: 'PermissionError',   slug: 'permissionerror',   when: 'errno EACCES / EPERM' },
    { name: 'FileExistsError',   slug: 'fileexistserror',   when: 'errno EEXIST' },
    { name: 'ConnectionError',   slug: 'connectionerror',   when: 'Socket and pipe failures' },
    { name: 'TimeoutError',      slug: 'timeouterror',      when: 'errno ETIMEDOUT and the library timeouts' },
    { name: 'open()',            slug: 'open',              when: 'The usual source of OSError', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between OSError and IOError?',
      a: 'There is none in Python 3. Since 3.3 IOError, EnvironmentError and (on Windows) WindowsError are just other names for OSError: IOError is OSError is True. Old code catching IOError still works; new code should write OSError.',
    },
    {
      q: 'Why do I get FileNotFoundError when I raised OSError?',
      a: 'OSError(errno, strerror) looks at errno and returns the matching subclass: ENOENT gives FileNotFoundError, EACCES gives PermissionError, and so on. That is the PEP 3151 design — raising OSError(errno.ENOENT, ...) produces exactly what open() would. Subclasses you define yourself are not remapped.',
    },
    {
      q: 'What are BlockingIOError, ChildProcessError, InterruptedError and ProcessLookupError?',
      a: 'The less common OSError subclasses. BlockingIOError (EAGAIN, EWOULDBLOCK, EALREADY, EINPROGRESS) means a non-blocking socket or pipe has no data or buffer space right now; buffered io writers also set its characters_written attribute. ChildProcessError (ECHILD) comes from os.wait()/os.waitpid() when there is no such child. InterruptedError (EINTR) means a system call was interrupted by a signal — since Python 3.5 (PEP 475) the call is retried automatically, so you only see it if your signal handler raises. ProcessLookupError (ESRCH) comes from os.kill() and friends when the process id does not exist.',
    },
    {
      q: 'How do I check which OS error happened?',
      a: 'Prefer the subclass (except FileNotFoundError). For codes without one, compare e.errno with a constant from the errno module, e.g. e.errno == errno.ENOSPC. Do not hard-code numbers: ENOENT is 2 everywhere, but codes like ETIMEDOUT or EAGAIN have different values on Linux, macOS and Windows.',
    },
    {
      q: 'Why does the message say [WinError 183] on Windows?',
      a: 'Functions in the os module call the Windows API directly, and OSError then shows the native Windows code and message (e.winerror) instead of the POSIX one. The exception class is still mapped the same way, so except FileExistsError works on every platform even though the text differs.',
    },
  ],

  history: [
    { version: '3.3', note: 'EnvironmentError, IOError, WindowsError, socket.error, select.error and mmap.error merged into OSError; the constructor may return a subclass (PEP 3151).' },
    { version: '3.4', note: 'filename is the original name passed to the function; filename2 constructor argument and attribute added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#OSError',
    meta:  'Built-in exceptions',
  },
};
