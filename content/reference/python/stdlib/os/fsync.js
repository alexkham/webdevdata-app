// content/reference/python/stdlib/os/fsync.js

export const meta = {
  slug:        'fsync',
  name:        'os.fsync',
  signature:   'os.fsync(fd)',
  blurb:       'Force a file’s written data out of the OS cache onto the disk. Plus the other descriptor-level file controls: fdatasync, sync, ftruncate / truncate, posix_fallocate, posix_fadvise and lockf.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (sync, truncate, posix_fallocate, posix_fadvise, lockf 3.3+; ftruncate / truncate on Windows 3.5+)',
  searchTerms: 'os.fsync fsync flush to disk durable write os.fdatasync fdatasync os.sync sync os.ftruncate ftruncate os.truncate truncate shrink file resize file os.posix_fallocate posix_fallocate preallocate os.posix_fadvise posix_fadvise POSIX_FADV_NORMAL POSIX_FADV_SEQUENTIAL POSIX_FADV_RANDOM POSIX_FADV_NOREUSE POSIX_FADV_WILLNEED POSIX_FADV_DONTNEED os.lockf lockf F_LOCK F_TLOCK F_ULOCK F_TEST file lock python',
};

export const method = {
  slug:      'fsync',
  name:      'os.fsync',
  signature: 'os.fsync(fd)',
  returns:   { type: 'None', desc: 'Returns once the OS reports the data is on the storage device.' },

  category:    'os function',
  version:     'Python 3.0+ (sync, truncate, posix_fallocate, posix_fadvise, lockf 3.3+; ftruncate / truncate on Windows 3.5+)',
  hasLiveDemo: false,

  subtitle: 'fsync makes a write survive a crash or power loss — but only what the OS already has: flush the Python buffer first. fsync, ftruncate and truncate work on Unix and Windows; fdatasync, posix_fallocate and posix_fadvise are Unix-only (not macOS); sync, lockf and the F_* / POSIX_FADV_* constants are Unix-only.',

  covers: ['fsync', 'fdatasync', 'sync', 'ftruncate', 'truncate', 'posix_fallocate', 'posix_fadvise', 'lockf', 'POSIX_FADV_DONTNEED', 'POSIX_FADV_NOREUSE', 'POSIX_FADV_NORMAL', 'POSIX_FADV_RANDOM', 'POSIX_FADV_SEQUENTIAL', 'POSIX_FADV_WILLNEED', 'F_LOCK', 'F_TEST', 'F_TLOCK', 'F_ULOCK'],

  cheat: {
    commonCall: 'f.flush(); os.fsync(f.fileno())',
    returns:    'None',
    replaces:   'hoping the OS writes the cache out before a crash',
    watchOut:   'fsync does not flush the Python buffer — call f.flush() first',
  },

  parameters: [
    { name: 'fd',            type: 'int',  required: true,  default: null, desc: 'An open file descriptor (f.fileno()). os.fsync also accepts any object with a fileno() method.' },
    { name: 'length',        type: 'int',  required: true,  default: null, desc: 'ftruncate(fd, length) / truncate(path, length): the new size. Shorter cuts the file, longer pads it with zero bytes.' },
    { name: 'path',          type: 'str | bytes | PathLike | int', required: true, default: null, desc: 'truncate only: the file to resize (or an open fd).' },
    { name: 'offset, len',   type: 'int',  required: true,  default: null, desc: 'posix_fallocate / posix_fadvise: the byte range the call applies to.' },
    { name: 'advice',        type: 'int',  required: true,  default: null, desc: 'posix_fadvise: one of the POSIX_FADV_* constants.' },
    { name: 'cmd',           type: 'int',  required: true,  default: null, desc: 'lockf: F_LOCK (wait for the lock), F_TLOCK (fail at once if locked), F_ULOCK (unlock) or F_TEST (check).' },
  ],

  patterns: [
    {
      name: 'Durable, atomic file replace',
      desc: 'Write a temp file, flush, fsync, then os.replace it over the target: readers see the old or the new file, never half of one.',
      code: "import os\ndef save(path, data: bytes):\n    tmp = path + '.tmp'\n    with open(tmp, 'wb') as f:\n        f.write(data)\n        f.flush()\n        os.fsync(f.fileno())\n    os.replace(tmp, path)",
    },
    {
      name: 'Exclusive lock on a file (Unix)',
      desc: 'F_TLOCK fails immediately when another process holds the lock; F_LOCK would wait.',
      code: "import os\nfd = os.open('app.lock', os.O_RDWR | os.O_CREAT)\ntry:\n    os.lockf(fd, os.F_TLOCK, 0)\nexcept OSError:\n    print('another instance is running')",
    },
    {
      name: 'Reserve disk space up front (Linux)',
      desc: 'posix_fallocate makes sure the disk blocks for the whole range are allocated before you start writing.',
      code: "import os\nfd = os.open('big.dat', os.O_RDWR | os.O_CREAT)\ntry:\n    os.posix_fallocate(fd, 0, 1024 ** 3)\nfinally:\n    os.close(fd)",
    },
    {
      name: 'Tell the kernel you will read once, front to back (Linux)',
      desc: 'Sequential read-ahead while streaming, then drop the pages from the cache.',
      code: "import os\nfd = os.open('huge.log', os.O_RDONLY)\ntry:\n    os.posix_fadvise(fd, 0, 0, os.POSIX_FADV_SEQUENTIAL)\n    while os.read(fd, 1 << 20):\n        pass\n    os.posix_fadvise(fd, 0, 0, os.POSIX_FADV_DONTNEED)\nfinally:\n    os.close(fd)",
    },
  ],

  examples: [
    {
      title: 'flush, then fsync',
      code: "import os\nwith open('data.txt', 'w') as f:\n    f.write('data')\n    f.flush()\n    os.fsync(f.fileno())\n    size = os.path.getsize('data.txt')\nsize",
      returns: '4',
    },
    {
      title: 'truncate shrinks a file',
      code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'hello world')\nos.truncate('f.bin', 5)\nPath('f.bin').read_bytes()",
      returns: "b'hello'",
    },
    {
      title: '…and pads with zero bytes when growing',
      code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'abc')\nos.truncate('f.bin', 6)\nPath('f.bin').read_bytes()",
      returns: "b'abc\\x00\\x00\\x00'",
    },
    {
      title: 'ftruncate on an open descriptor',
      code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'hello world')\nfd = os.open('f.bin', os.O_RDWR)\ntry:\n    os.ftruncate(fd, 4)\n    size = os.fstat(fd).st_size\nfinally:\n    os.close(fd)\nsize",
      returns: '4',
    },
    {
      title: 'truncate also takes an fd',
      code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'abcdef')\nfd = os.open('f.bin', os.O_RDWR)\ntry:\n    os.truncate(fd, 0)\nfinally:\n    os.close(fd)\n(os.truncate in os.supports_fd, os.path.getsize('f.bin'))",
      returns: '(True, 0)',
    },
    {
      title: 'Missing file',
      code: "import os\ntry:\n    os.truncate('ghost.txt', 0)\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      returns: "'FileNotFoundError'",
    },
  ],

  pitfalls: [
    {
      name: 'fsync without flush',
      desc: 'Text written to a Python file object sits in its buffer. fsync only pushes what the OS already has, so nothing reaches the file. Flush first.',
      wrong: { label: 'fsync only', code: "import os\nwith open('a.txt', 'w') as f:\n    f.write('data')\n    os.fsync(f.fileno())\n    size = os.path.getsize('a.txt')\nsize", output: '0' },
      fix:   { label: 'flush + fsync', code: "import os\nwith open('a.txt', 'w') as f:\n    f.write('data')\n    f.flush()\n    os.fsync(f.fileno())\n    size = os.path.getsize('a.txt')\nsize", output: '4' },
    },
    {
      name: 'ftruncate does not move the file position',
      desc: 'After cutting a file to 0 bytes the fd still points at the old offset, so the next write leaves a gap of zero bytes. Seek back to 0.',
      wrong: { label: 'truncate, write', code: "import os\nfrom pathlib import Path\nfd = os.open('f.bin', os.O_RDWR | os.O_CREAT | getattr(os, 'O_BINARY', 0))\ntry:\n    os.write(fd, b'hello')\n    os.ftruncate(fd, 0)\n    os.write(fd, b'hi')\nfinally:\n    os.close(fd)\nPath('f.bin').read_bytes()", output: "b'\\x00\\x00\\x00\\x00\\x00hi'" },
      fix:   { label: 'truncate, lseek, write', code: "import os\nfrom pathlib import Path\nfd = os.open('f.bin', os.O_RDWR | os.O_CREAT | getattr(os, 'O_BINARY', 0))\ntry:\n    os.write(fd, b'hello')\n    os.ftruncate(fd, 0)\n    os.lseek(fd, 0, os.SEEK_SET)\n    os.write(fd, b'hi')\nfinally:\n    os.close(fd)\nPath('f.bin').read_bytes()", output: "b'hi'" },
    },
    {
      name: 'Using truncate to "cut to at most n bytes"',
      desc: 'truncate sets the size exactly: a file shorter than n grows, padded with zeros. Take the smaller of the two sizes if you only want to shrink.',
      wrong: { label: 'truncate(path, 8)', code: "import os\nfrom pathlib import Path\nPath('s.txt').write_bytes(b'abc')\nos.truncate('s.txt', 8)\nos.path.getsize('s.txt')", output: '8' },
      fix:   { label: 'min(size, 8)', code: "import os\nfrom pathlib import Path\nPath('s.txt').write_bytes(b'abc')\nos.truncate('s.txt', min(os.path.getsize('s.txt'), 8))\nos.path.getsize('s.txt')", output: '3' },
    },
  ],

  when: {
    use: [
      'Data that must survive a crash: databases, journals, config files you replace',
      'Resizing a file in place (ftruncate / truncate)',
      'Large sequential reads or writes where kernel hints (posix_fadvise, posix_fallocate) help',
      'Simple advisory locks between cooperating processes on Unix (lockf)',
    ],
    avoid: [
      'Every small write → fsync is slow; batch writes and sync once',
      'Resizing through a file object → f.truncate(size)',
      'Cross-platform locking → a lock-file library or msvcrt.locking on Windows',
    ],
  },

  notes: {
    cpython:          "Unix: fsync(2), fdatasync(2), sync(2), ftruncate(2), posix_fallocate(3), posix_fadvise(2), lockf(3). Windows: fsync calls the MS C runtime _commit() (docs.python.org)",
    'Availability':   'fsync, ftruncate, truncate: Unix and Windows (ftruncate and truncate on Windows since 3.5). fdatasync, posix_fallocate, posix_fadvise: Unix, not macOS, not iOS. sync, lockf, F_LOCK / F_TLOCK / F_ULOCK / F_TEST, POSIX_FADV_*: Unix only',
    'fdatasync':      'Like fsync but, per docs.python.org, does not force the update of metadata (such as timestamps)',
    'Constants on Linux': 'F_ULOCK 0, F_LOCK 1, F_TLOCK 2, F_TEST 3; POSIX_FADV_NORMAL 0, RANDOM 1, SEQUENTIAL 2, WILLNEED 3, DONTNEED 4, NOREUSE 5 (values from Linux CPython 3.12 — use the names)',
    'lockf':          'Advisory locks: a process that ignores lockf can still write to the file; only lockf callers are stopped. The fd must be open for writing (O_RDONLY gives OSError EBADF on Linux). The lock covers len bytes from the current position',
  },

  related: [
    { name: 'os.open / write', slug: 'open', when: 'Get an fd to fsync' },
    { name: 'O_SYNC / O_DSYNC', slug: 'o_rdonly', when: 'Make every write synchronous instead' },
    { name: 'os.pwrite / pwritev', slug: 'pread', when: 'RWF_SYNC / RWF_DSYNC per write (Linux)' },
    { name: 'open()', slug: 'open', when: 'File objects: flush() before fsync', category: 'functions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does os.fsync work on Windows?',
      a: 'Yes — os.fsync, os.ftruncate and os.truncate work on Unix and Windows (fsync calls _commit() there). fdatasync, posix_fallocate and posix_fadvise are Unix-only and not on macOS; sync and lockf are Unix-only. This page has no live demo; its examples only call the functions that work everywhere.',
    },
    {
      q: 'What is the difference between flush() and os.fsync() in Python?',
      a: 'f.flush() moves data from the Python file object buffer to the operating system. os.fsync(fd) moves it from the OS cache to the disk. For a write that survives power loss you need both, in that order: f.flush(); os.fsync(f.fileno()). A with-block close flushes, but does not fsync.',
    },
    {
      q: 'How do I truncate a file in Python?',
      a: "os.truncate(path, size), os.ftruncate(fd, size), or f.truncate(size) on an open file object. A size larger than the file extends it with zero bytes. To empty a file, os.truncate(path, 0) or open(path, 'w').close().",
    },
    {
      q: 'How do I lock a file in Python on Linux?',
      a: 'os.lockf(fd, os.F_LOCK, 0) waits for an exclusive lock, os.F_TLOCK fails at once with BlockingIOError (an OSError) if another process holds it, os.F_ULOCK releases it. The fd must be open for writing. fcntl.flock is the BSD-style alternative; both are advisory and Unix-only.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.fsync',
    meta:  'os.fsync / fdatasync / truncate / lockf',
  },
};
