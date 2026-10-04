// content/reference/python/stdlib/os/index.js — the os module hub

export const meta = {
  slug:        'index',
  name:        'os',
  signature:   'import os',
  blurb:       'The operating-system interface: environment variables, files and folders (listdir, walk, makedirs, remove, stat), processes, file descriptors — plus os.path for path strings.',
  category:    'system',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os module python operating system interface environment variables os.environ getenv listdir walk makedirs mkdir remove rename stat getcwd chdir os.path process pid fork exec file descriptor platform',
};

export const method = {
  slug: 'index',
  name: 'os',

  category:    'System',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'One module, three jobs: talk to the environment (os.environ, getenv), manage files and folders (listdir, scandir, walk, makedirs, remove, replace, stat), and drive processes and file descriptors. Most of it is portable; a large part is Unix only, and every page here says which.',

  // public names that exist on Linux but not on Windows (the audit computes
  // os.__all__ on Windows): Linux CPython 3.12 os.__all__ minus the Windows
  // 3.13 list, plus the Linux names added in 3.13 (timerfd_*, TFD_*,
  // posix_openpt, grantpt, unlockpt, ptsname, POSIX_SPAWN_CLOSEFROM)
  platformNames: [
    'CLD_CONTINUED', 'CLD_DUMPED', 'CLD_EXITED', 'CLD_KILLED', 'CLD_STOPPED', 'CLD_TRAPPED',
    'CLONE_FILES', 'CLONE_FS', 'CLONE_NEWCGROUP', 'CLONE_NEWIPC', 'CLONE_NEWNET', 'CLONE_NEWNS',
    'CLONE_NEWPID', 'CLONE_NEWTIME', 'CLONE_NEWUSER', 'CLONE_NEWUTS', 'CLONE_SIGHAND', 'CLONE_SYSVSEM',
    'CLONE_THREAD', 'CLONE_VM', 'EFD_CLOEXEC', 'EFD_NONBLOCK', 'EFD_SEMAPHORE', 'EX_CANTCREAT',
    'EX_CONFIG', 'EX_DATAERR', 'EX_IOERR', 'EX_NOHOST', 'EX_NOINPUT', 'EX_NOPERM', 'EX_NOUSER',
    'EX_OSERR', 'EX_OSFILE', 'EX_PROTOCOL', 'EX_SOFTWARE', 'EX_TEMPFAIL', 'EX_UNAVAILABLE', 'EX_USAGE',
    'F_LOCK', 'F_TEST', 'F_TLOCK', 'F_ULOCK', 'GRND_NONBLOCK', 'GRND_RANDOM', 'MFD_ALLOW_SEALING',
    'MFD_CLOEXEC', 'MFD_HUGETLB', 'MFD_HUGE_16GB', 'MFD_HUGE_16MB', 'MFD_HUGE_1GB', 'MFD_HUGE_1MB',
    'MFD_HUGE_256MB', 'MFD_HUGE_2GB', 'MFD_HUGE_2MB', 'MFD_HUGE_32MB', 'MFD_HUGE_512KB',
    'MFD_HUGE_512MB', 'MFD_HUGE_64KB', 'MFD_HUGE_8MB', 'MFD_HUGE_MASK', 'MFD_HUGE_SHIFT', 'NGROUPS_MAX',
    'O_ACCMODE', 'O_ASYNC', 'O_CLOEXEC', 'O_DIRECT', 'O_DIRECTORY', 'O_DSYNC', 'O_FSYNC', 'O_LARGEFILE',
    'O_NDELAY', 'O_NOATIME', 'O_NOCTTY', 'O_NOFOLLOW', 'O_NONBLOCK', 'O_PATH', 'O_RSYNC', 'O_SYNC',
    'O_TMPFILE', 'POSIX_FADV_DONTNEED', 'POSIX_FADV_NOREUSE', 'POSIX_FADV_NORMAL', 'POSIX_FADV_RANDOM',
    'POSIX_FADV_SEQUENTIAL', 'POSIX_FADV_WILLNEED', 'POSIX_SPAWN_CLOSE', 'POSIX_SPAWN_CLOSEFROM',
    'POSIX_SPAWN_DUP2', 'POSIX_SPAWN_OPEN', 'PRIO_PGRP', 'PRIO_PROCESS', 'PRIO_USER', 'P_ALL', 'P_PGID',
    'P_PID', 'P_PIDFD', 'RTLD_DEEPBIND', 'RTLD_GLOBAL', 'RTLD_LAZY', 'RTLD_LOCAL', 'RTLD_NODELETE',
    'RTLD_NOLOAD', 'RTLD_NOW', 'RWF_APPEND', 'RWF_DSYNC', 'RWF_HIPRI', 'RWF_NOWAIT', 'RWF_SYNC',
    'SCHED_BATCH', 'SCHED_FIFO', 'SCHED_IDLE', 'SCHED_OTHER', 'SCHED_RESET_ON_FORK', 'SCHED_RR',
    'SEEK_DATA', 'SEEK_HOLE', 'SPLICE_F_MORE', 'SPLICE_F_MOVE', 'SPLICE_F_NONBLOCK', 'ST_APPEND',
    'ST_MANDLOCK', 'ST_NOATIME', 'ST_NODEV', 'ST_NODIRATIME', 'ST_NOEXEC', 'ST_NOSUID', 'ST_RDONLY',
    'ST_RELATIME', 'ST_SYNCHRONOUS', 'ST_WRITE', 'TFD_CLOEXEC', 'TFD_NONBLOCK', 'TFD_TIMER_ABSTIME',
    'TFD_TIMER_CANCEL_ON_SET', 'WCONTINUED', 'WCOREDUMP', 'WEXITED', 'WEXITSTATUS', 'WIFCONTINUED',
    'WIFEXITED', 'WIFSIGNALED', 'WIFSTOPPED', 'WNOHANG', 'WNOWAIT', 'WSTOPPED', 'WSTOPSIG', 'WTERMSIG',
    'WUNTRACED', 'XATTR_CREATE', 'XATTR_REPLACE', 'XATTR_SIZE_MAX', 'chown', 'chroot', 'confstr',
    'confstr_names', 'copy_file_range', 'ctermid', 'environb', 'eventfd', 'eventfd_read',
    'eventfd_write', 'fchdir', 'fchown', 'fdatasync', 'fork', 'forkpty', 'fpathconf', 'fstatvfs',
    'fwalk', 'getegid', 'getenvb', 'geteuid', 'getgid', 'getgrouplist', 'getgroups', 'getloadavg',
    'getpgid', 'getpgrp', 'getpriority', 'getrandom', 'getresgid', 'getresuid', 'getsid', 'getuid',
    'getxattr', 'grantpt', 'initgroups', 'killpg', 'lchown', 'listxattr', 'lockf', 'login_tty', 'major',
    'makedev', 'memfd_create', 'minor', 'mkfifo', 'mknod', 'nice', 'openpty', 'pathconf',
    'pathconf_names', 'pidfd_open', 'pipe2', 'posix_fadvise', 'posix_fallocate', 'posix_openpt',
    'posix_spawn', 'posix_spawnp', 'pread', 'preadv', 'ptsname', 'pwrite', 'pwritev', 'readv',
    'register_at_fork', 'removexattr', 'sched_get_priority_max', 'sched_get_priority_min',
    'sched_getaffinity', 'sched_getparam', 'sched_getscheduler', 'sched_param', 'sched_rr_get_interval',
    'sched_setaffinity', 'sched_setparam', 'sched_setscheduler', 'sched_yield', 'sendfile', 'setegid',
    'seteuid', 'setgid', 'setgroups', 'setns', 'setpgid', 'setpgrp', 'setpriority', 'setregid',
    'setresgid', 'setresuid', 'setreuid', 'setsid', 'setuid', 'setxattr', 'spawnlp', 'spawnlpe',
    'spawnvp', 'spawnvpe', 'splice', 'statvfs', 'sync', 'sysconf', 'sysconf_names', 'tcgetpgrp',
    'tcsetpgrp', 'timerfd_create', 'timerfd_gettime', 'timerfd_gettime_ns', 'timerfd_settime',
    'timerfd_settime_ns', 'ttyname', 'uname', 'unlockpt', 'unshare', 'wait', 'wait3', 'wait4', 'waitid',
    'waitid_result', 'writev',
  ],

  imports: ['import os', 'from os import path, environ', 'import os.path'],
  facts: [
    { label: 'Size',        value: 'os.__all__ has 134 names on Windows (CPython 3.13) and around 390 on Linux — most of the difference is Unix process, scheduling and flag constants' },
    { label: 'os.path',     value: 'posixpath on Linux and macOS, ntpath on Windows — see the os.path module' },
    { label: 'Errors',      value: 'Everything raises OSError subclasses: FileNotFoundError, FileExistsError, PermissionError, NotADirectoryError, IsADirectoryError …' },
    { label: 'Paths',       value: 'Every path argument accepts str, bytes or an os.PathLike such as pathlib.Path' },
  ],

  modes: [
    {
      id: 'listdir',
      label: 'list a folder',
      blurb: 'Create a few empty files (folders are made on the way), then list one folder. listdir order is arbitrary, so the result is sorted.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'folder', type: 'str',       hint: 'folder to list',                   input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    result = sorted(os.listdir({$folder}))\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'top',  label: 'current folder', values: { files: 'README.md, src/app.py, src/util.py', folder: '.' } },
        { id: 'sub',  label: 'a sub-folder',   values: { files: 'README.md, src/app.py, src/util.py', folder: 'src' } },
        { id: 'miss', label: 'missing folder', values: { files: 'README.md', folder: 'docs' } },
        { id: 'file', label: 'a file',         values: { files: 'README.md', folder: 'README.md' } },
      ],
    },
    {
      id: 'environ',
      label: 'environment',
      blurb: 'Set a variable inside a cleared, temporary environment and read it back three ways.',
      params: [{ name: 'value', type: 'str', hint: "APP_MODE's value (digits become an int)", input: 'auto' }],
      template: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True):\n    os.environ['APP_MODE'] = {$value}\n    result = (os.environ['APP_MODE'], os.getenv('DEBUG'), os.getenv('DEBUG', 'off'))\nresult",
      cases: [
        { id: 'str', label: 'a string',  values: { value: 'production' } },
        { id: 'int', label: 'a number',  values: { value: '8080' } },
      ],
    },
  ],
  demoExplainer: "listdir returns bare names — files and folders mixed, in no promised order — and raises FileNotFoundError for a missing folder and NotADirectoryError for a file (the message text differs between Linux and Windows; the class does not). In the environment tab, environment values must be str: os.environ['APP_MODE'] = 8080 raises TypeError: str expected, not int. getenv returns None, or your default, for a variable that is not set.",

  patterns: [
    {
      name: 'Configuration from the environment',
      desc: 'Read once at startup, convert explicitly, give a default.',
      code: "import os\nPORT = int(os.environ.get('PORT', '8000'))\nDEBUG = os.getenv('DEBUG', '0') == '1'",
    },
    {
      name: 'Create an output folder safely',
      desc: 'No check-then-create race, no error when it already exists.',
      code: "import os\nos.makedirs('build/reports', exist_ok=True)",
    },
    {
      name: 'Every file under a folder',
      desc: 'os.walk yields one (folder, sub-folders, files) triple per directory.',
      code: "import os\nfor root, dirs, files in os.walk('src'):\n    for name in files:\n        print(os.path.join(root, name))",
    },
    {
      name: 'Atomic save',
      desc: 'Write a temp file, then os.replace it over the target — readers never see half a file.',
      code: "import os\nwith open('state.json.tmp', 'w', encoding='utf-8') as f:\n    f.write(data)\nos.replace('state.json.tmp', 'state.json')",
    },
  ],

  examples: [
    { title: 'List a folder you just made', code: "import os\nos.makedirs('data/raw', exist_ok=True)\nopen('data/raw/a.csv', 'w').close()\nsorted(os.listdir('data/raw'))", returns: "['a.csv']" },
    { title: 'Walk a tree', code: "import os\nos.makedirs('a/b/c')\n[(root.replace(os.sep, '/'), dirs, files) for root, dirs, files in os.walk('a')]", returns: "[('a', ['b'], []), ('a/b', ['c'], []), ('a/b/c', [], [])]" },
    { title: 'A default for a missing variable', code: "import os\nos.getenv('SURELY_NOT_SET_12345', 'fallback')", returns: "'fallback'" },
    { title: 'os.path is posixpath or ntpath', code: 'import os, posixpath, ntpath\nos.path in (posixpath, ntpath)', returns: 'True' },
    { title: 'mkdir makes one level, makedirs all', code: "import os\ntry:\n    os.mkdir('x/y/z')\nexcept OSError as e:\n    first = type(e).__name__\nos.makedirs('x/y/z')\n(first, os.path.isdir('x/y/z'))", returns: "('FileNotFoundError', True)" },
    { title: 'Random bytes from the OS', code: 'import os\nlen(os.urandom(16))', returns: '16' },
  ],

  pitfalls: [
    {
      name: 'Putting a non-string into os.environ',
      desc: 'The environment holds strings only. Convert numbers and booleans yourself (and back again when you read them).',
      wrong: { label: 'an int', code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ):\n    os.environ['PORT'] = 8080", output: 'TypeError: str expected, not int' },
      fix:   { label: 'str(...)', code: "import os\nfrom unittest import mock\nwith mock.patch.dict(os.environ):\n    os.environ['PORT'] = str(8080)\n    port = int(os.environ['PORT'])\nport", output: '8080' },
    },
    {
      name: 'Checking os.path.exists() before mkdir',
      desc: 'Between the check and the mkdir another process can create the folder. exist_ok=True does both in one call.',
      wrong: { label: 'check, then mkdir', code: "import os\nif not os.path.exists('out'):\n    os.mkdir('out')\nos.path.isdir('out')", output: 'True' },
      fix:   { label: 'makedirs(exist_ok=True)', code: "import os\nos.makedirs('out', exist_ok=True)\nos.makedirs('out', exist_ok=True)\nos.path.isdir('out')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Environment variables, the current process, low-level OS calls',
      'Folder operations when you already work with str paths (listdir, walk, makedirs, remove, replace)',
    ],
    avoid: [
      'Path arithmetic and reading/writing whole files → pathlib',
      'Copying, moving trees, deleting non-empty folders → shutil (copy2, copytree, move, rmtree)',
      'Running programs → subprocess instead of os.system / os.popen / spawn*',
      'Temporary files and folders → tempfile',
    ],
  },

  notes: {
    cpython:      'Lib/os.py — a thin layer over the posix (Unix) or nt (Windows) C module (Modules/posixmodule.c, one file for both), plus pure-Python makedirs, removedirs, renames, walk, fwalk, environ and the exec*/spawn* helpers',
    'Availability': 'The docs mark each function: "Unix", "Linux", "Windows", "not WASI" … Calling a missing one is an AttributeError, so test with hasattr(os, name) when you must support several platforms',
    'Encoding':   'str paths are encoded with the file system encoding (UTF-8 on Windows and in practice on Linux/macOS); bytes paths are passed through untouched',
  },

  related: [
    { name: 'os.path',  slug: 'os-path',  when: 'Path strings: join, split, exists', category: 'stdlib' },
    { name: 'pathlib',  slug: 'pathlib',  when: 'The object-oriented alternative for paths and files', category: 'stdlib' },
    { name: 'os.environ', slug: 'environ', when: 'Environment variables' },
    { name: 'os.walk',  slug: 'walk',     when: 'Every folder in a tree' },
    { name: 'OSError',  slug: 'oserror',  when: 'What every os function raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between os and os.path?',
      a: 'os is the operating-system interface (environment, processes, creating and deleting files and folders). os.path is a separate module of path-string helpers — join, split, splitext, exists — imported automatically as an attribute of os. It is posixpath on Linux and macOS and ntpath on Windows.',
    },
    {
      q: 'Should I use os or pathlib?',
      a: 'For path manipulation and simple file I/O, pathlib reads better. os is still the place for environment variables, processes, file descriptors, os.walk and the low-level calls pathlib is built on — and both accept each other: every os function takes a Path.',
    },
    {
      q: 'Why does my os function not exist on Windows?',
      a: "A large part of os is Unix only — fork, getuid, chown, the wait*/sched* families and many constants. The docs list the availability of each one; accessing a missing name raises AttributeError (for example, AttributeError: module 'os' has no attribute 'fork' on Windows).",
    },
    {
      q: 'How do I delete a folder that is not empty?',
      a: 'os.rmdir and os.removedirs only remove empty folders. shutil.rmtree(path) deletes a whole tree.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html',
    meta:  'os — Miscellaneous operating system interfaces',
  },
};
