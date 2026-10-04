// content/reference/python/stdlib/os/o_rdonly.js

export const meta = {
  slug:        'o_rdonly',
  name:        'os.O_RDONLY',
  signature:   'os.O_RDONLY | os.O_WRONLY | os.O_RDWR  (+ O_CREAT, O_TRUNC, O_APPEND, O_EXCL, …)',
  blurb:       'The flag constants for os.open: one access mode (O_RDONLY, O_WRONLY, O_RDWR) OR-ed with creation and behaviour flags. Several flags exist only on Unix or only on Windows, and most numeric values differ between platforms.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.0+ (O_CLOEXEC 3.3+, O_PATH and O_TMPFILE 3.4+)',
  searchTerms: 'os.O_RDONLY O_RDONLY O_WRONLY O_RDWR O_ACCMODE O_APPEND O_ASYNC O_BINARY O_CLOEXEC O_CREAT O_DIRECT O_DIRECTORY O_DSYNC O_EXCL O_FSYNC O_LARGEFILE O_NDELAY O_NOATIME O_NOCTTY O_NOFOLLOW O_NOINHERIT O_NONBLOCK O_PATH O_RANDOM O_RSYNC O_SEQUENTIAL O_SHORT_LIVED O_SYNC O_TEMPORARY O_TEXT O_TMPFILE O_TRUNC os.O_CREAT os.O_BINARY open flags python os.open flags bitwise or',
};

export const method = {
  slug:      'o_rdonly',
  name:      'os.O_RDONLY',
  signature: 'os.O_RDONLY | os.O_WRONLY | os.O_RDWR  (+ O_CREAT, O_TRUNC, O_APPEND, O_EXCL, …)',
  returns:   { type: 'int', desc: 'Bit flags; combine them with | and pass the result as the flags argument of os.open.' },

  category:    'os constants',
  version:     'Python 3.0+ (O_CLOEXEC 3.3+, O_PATH and O_TMPFILE 3.4+)',
  hasLiveDemo: false,

  subtitle: 'Pick exactly one access mode — O_RDONLY, O_WRONLY or O_RDWR (0, 1 and 2) — and OR in the extras. O_RDONLY, O_WRONLY, O_RDWR, O_APPEND, O_CREAT, O_EXCL and O_TRUNC exist on Unix and Windows; the rest are Unix-only, Windows-only or Linux extensions. Always use the names: only the three access modes have the same value everywhere.',

  covers: ['O_ACCMODE', 'O_APPEND', 'O_ASYNC', 'O_BINARY', 'O_CLOEXEC', 'O_CREAT', 'O_DIRECT', 'O_DIRECTORY', 'O_DSYNC', 'O_EXCL', 'O_FSYNC', 'O_LARGEFILE', 'O_NDELAY', 'O_NOATIME', 'O_NOCTTY', 'O_NOFOLLOW', 'O_NOINHERIT', 'O_NONBLOCK', 'O_PATH', 'O_RANDOM', 'O_RDONLY', 'O_RDWR', 'O_RSYNC', 'O_SEQUENTIAL', 'O_SHORT_LIVED', 'O_SYNC', 'O_TEMPORARY', 'O_TEXT', 'O_TMPFILE', 'O_TRUNC', 'O_WRONLY'],

  cheat: {
    commonCall: 'os.O_WRONLY | os.O_CREAT | os.O_TRUNC',
    returns:    'int bit mask for os.open',
    replaces:   "the mode strings of open(): 'r', 'w', 'a', 'x', '+'",
    watchOut:   "Unix-only and Windows-only flags: guard with getattr(os, 'O_BINARY', 0)",
  },

  patterns: [
    {
      name: 'Portable binary flags',
      desc: 'O_BINARY exists only on Windows; getattr gives 0 elsewhere, so the same line works everywhere.',
      code: "import os\nBINARY = getattr(os, 'O_BINARY', 0)\nfd = os.open('blob.bin', os.O_RDWR | os.O_CREAT | BINARY)",
    },
    {
      name: "The open() modes as flags",
      desc: "What 'w', 'a', 'x' and 'r+' mean in os.open terms.",
      code: "import os\nW  = os.O_WRONLY | os.O_CREAT | os.O_TRUNC   # 'w'\nA  = os.O_WRONLY | os.O_CREAT | os.O_APPEND  # 'a'\nX  = os.O_WRONLY | os.O_CREAT | os.O_EXCL    # 'x'\nRP = os.O_RDWR                               # 'r+'",
    },
    {
      name: 'Refuse to follow a symlink (Unix)',
      desc: 'O_NOFOLLOW makes os.open fail if the last path component is a symbolic link.',
      code: "import os\nfd = os.open('config.ini', os.O_RDONLY | os.O_NOFOLLOW | os.O_CLOEXEC)",
    },
    {
      name: 'Anonymous temporary file (Linux 3.11+)',
      desc: 'O_TMPFILE creates an unnamed file in a directory: it never shows up in os.listdir.',
      code: "import os\nfd = os.open('/tmp', os.O_TMPFILE | os.O_RDWR, 0o600)\ntry:\n    os.write(fd, b'scratch')\nfinally:\n    os.close(fd)",
    },
  ],

  examples: [
    {
      title: 'The three access modes',
      code: 'import os\n(os.O_RDONLY, os.O_WRONLY, os.O_RDWR)',
      returns: '(0, 1, 2)',
    },
    {
      title: 'Combine with |, test with &',
      code: 'import os\nflags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC\n(bool(flags & os.O_CREAT), bool(flags & os.O_APPEND))',
      returns: '(True, False)',
    },
    {
      title: 'Extract the access mode',
      code: "import os\nACC = getattr(os, 'O_ACCMODE', 3)\nflags = os.O_RDWR | os.O_CREAT | os.O_APPEND\nflags & ACC == os.O_RDWR",
      returns: 'True',
    },
    {
      title: 'O_APPEND writes at the end, whatever the position',
      code: "import os\nfrom pathlib import Path\nPath('log.txt').write_bytes(b'abc')\nfd = os.open('log.txt', os.O_WRONLY | os.O_APPEND)\ntry:\n    os.lseek(fd, 0, os.SEEK_SET)\n    os.write(fd, b'Z')\nfinally:\n    os.close(fd)\nPath('log.txt').read_bytes()",
      returns: "b'abcZ'",
    },
    {
      title: 'O_BINARY keeps CR LF untouched (0 off Windows)',
      code: "import os\nfrom pathlib import Path\nPath('w.txt').write_bytes(b'a\\r\\nb')\nfd = os.open('w.txt', os.O_RDONLY | getattr(os, 'O_BINARY', 0))\ntry:\n    data = os.read(fd, 10)\nfinally:\n    os.close(fd)\ndata",
      returns: "b'a\\r\\nb'",
    },
    {
      title: 'O_CREAT | O_EXCL: EEXIST if the file is there',
      code: "import errno, os\nfrom pathlib import Path\nPath('taken').touch()\ntry:\n    os.open('taken', os.O_WRONLY | os.O_CREAT | os.O_EXCL)\nexcept OSError as e:\n    result = (type(e).__name__, e.errno == errno.EEXIST)\nresult",
      returns: "('FileExistsError', True)",
    },
    {
      title: 'Writing to an O_RDONLY descriptor',
      code: "import errno, os\nfrom pathlib import Path\nPath('r.txt').touch()\nfd = os.open('r.txt', os.O_RDONLY)\ntry:\n    os.write(fd, b'x')\nexcept OSError as e:\n    result = (type(e).__name__, e.errno == errno.EBADF)\nfinally:\n    os.close(fd)\nresult",
      returns: "('OSError', True)",
    },
  ],

  pitfalls: [
    {
      name: 'O_RDONLY | O_WRONLY is not read-write',
      desc: 'O_RDONLY is 0, so OR-ing it changes nothing: the result is plain O_WRONLY and reading fails. Use O_RDWR.',
      wrong: { label: 'O_RDONLY | O_WRONLY', code: "import os\nfrom pathlib import Path\nPath('f').write_bytes(b'data')\nfd = os.open('f', os.O_RDONLY | os.O_WRONLY)\ntry:\n    os.read(fd, 4)\nexcept OSError as e:\n    result = type(e).__name__\nfinally:\n    os.close(fd)\nresult", output: "'OSError'" },
      fix:   { label: 'O_RDWR', code: "import os\nfrom pathlib import Path\nPath('f').write_bytes(b'data')\nfd = os.open('f', os.O_RDWR | getattr(os, 'O_BINARY', 0))\ntry:\n    result = os.read(fd, 4)\nfinally:\n    os.close(fd)\nresult", output: "b'data'" },
    },
    {
      name: 'Testing O_RDONLY with &',
      desc: 'flags & os.O_RDONLY is always 0 because O_RDONLY is 0. Mask the access mode out and compare it with ==.',
      wrong: { label: 'flags & O_RDONLY', code: 'import os\nflags = os.O_RDONLY\nbool(flags & os.O_RDONLY)', output: 'False' },
      fix:   { label: 'compare the access mode', code: "import os\nflags = os.O_RDONLY\nflags & getattr(os, 'O_ACCMODE', 3) == os.O_RDONLY", output: 'True' },
    },
    {
      name: 'Using a flag your platform does not have',
      desc: 'Platform-specific flags are simply missing from os elsewhere, so the code fails with AttributeError. Guard them with getattr(os, name, 0).',
      wrong: { label: 'os.O_NOT_HERE', code: 'import os\nos.O_NOT_A_FLAG', output: "AttributeError: module 'os' has no attribute 'O_NOT_A_FLAG'" },
      fix:   { label: 'getattr(..., 0)', code: "import os\ngetattr(os, 'O_NOT_A_FLAG', 0)", output: '0' },
    },
  ],

  when: {
    use: [
      'Building the flags argument of os.open',
      'Behaviour open() cannot express: O_NOFOLLOW, O_DIRECTORY, O_NOATIME, O_SYNC, O_TMPFILE, O_TEMPORARY',
    ],
    avoid: [
      "Ordinary files → open() with 'r', 'w', 'a', 'x' modes",
      'Hard-coded numbers such as 64 or 256 → the value of O_CREAT differs by platform',
    ],
  },

  notes: {
    cpython:          'The constants come from the C headers at build time (Modules/posixmodule.c): a flag is defined only when the platform C library defines it',
    'Unix and Windows': 'O_RDONLY, O_WRONLY, O_RDWR, O_APPEND, O_CREAT, O_EXCL, O_TRUNC',
    'Unix only':      'O_DSYNC, O_RSYNC, O_SYNC, O_NDELAY, O_NONBLOCK, O_NOCTTY, O_CLOEXEC (3.3+). O_FSYNC is listed for macOS in the docs but Linux has it too (equal to O_SYNC there)',
    'Windows only':   'O_BINARY, O_NOINHERIT, O_SHORT_LIVED, O_TEMPORARY (the file is deleted when the fd is closed), O_RANDOM, O_SEQUENTIAL, O_TEXT',
    'C library extensions': 'O_ASYNC, O_DIRECT, O_DIRECTORY, O_NOFOLLOW, O_NOATIME, O_PATH (3.4+), O_TMPFILE (3.4+, Linux 3.11+) — present only where the C library defines them. O_ACCMODE (mask for the access mode, 3 on Linux) and O_LARGEFILE (0 on 64-bit Linux) are exported on Linux but not documented',
    'Values':         'Only O_RDONLY = 0, O_WRONLY = 1, O_RDWR = 2 agree across Linux and Windows; for example O_CREAT is 64 on Linux and 256 on Windows, O_APPEND 1024 vs 8',
    'Aliases on Linux': 'O_NDELAY == O_NONBLOCK, and O_SYNC == O_RSYNC == O_FSYNC',
  },

  related: [
    { name: 'os.open', slug: 'open', when: 'Where these flags go' },
    { name: 'os.pipe2', slug: 'pipe', when: 'O_NONBLOCK / O_CLOEXEC for pipes' },
    { name: 'os.fsync', slug: 'fsync', when: 'Flush on demand instead of O_SYNC' },
    { name: 'open()', slug: 'open', when: 'Mode strings instead of flags', category: 'functions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does os.O_BINARY not exist on Linux or macOS?',
      a: "O_BINARY, O_TEXT, O_NOINHERIT, O_TEMPORARY, O_SHORT_LIVED, O_RANDOM and O_SEQUENTIAL are Windows-only (docs.python.org lists them as such). Unix has no text mode, so there is nothing to switch off. Write getattr(os, 'O_BINARY', 0) and the same flags work on every system. This page has no live demo because the set of flags and their values depend on the platform; the examples only use names and values that agree on Linux and Windows.",
    },
    {
      q: 'What is the difference between O_RDONLY, O_WRONLY and O_RDWR?',
      a: 'They are the access mode: read only (0), write only (1), read and write (2). Use exactly one of them. Because O_RDONLY is 0, O_RDONLY | O_WRONLY is just O_WRONLY — it does not give read-write.',
    },
    {
      q: 'What does O_CREAT | O_EXCL do?',
      a: 'Create the file and fail with FileExistsError if it already exists, in one atomic step. It is the standard way to make lock files and to avoid overwriting a file another process just created. open(path, "x") gives the same behaviour at the high level.',
    },
    {
      q: 'Is O_CLOEXEC needed in Python?',
      a: 'Usually not. Since Python 3.4 every descriptor Python creates is non-inheritable, so it is closed in programs started with exec. Passing O_CLOEXEC explicitly does no harm on Unix and makes the intent visible.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.O_RDONLY',
    meta:  'os.O_* flag constants',
  },
};
