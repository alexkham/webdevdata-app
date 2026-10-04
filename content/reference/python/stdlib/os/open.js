// content/reference/python/stdlib/os/open.js

export const meta = {
  slug:        'open',
  name:        'os.open',
  signature:   'os.open(path, flags, mode=0o777, *, dir_fd=None)',
  blurb:       'Open a file at the OS level and get a raw integer file descriptor; read, write, lseek and close work on that number. fdopen wraps it in a normal file object.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (dir_fd 3.3+, non-inheritable fds 3.4+)',
  searchTerms: 'os.open os open file descriptor fd low level io os.close close os.closerange closerange os.read read os.write write os.lseek lseek seek os.fdopen fdopen SEEK_SET SEEK_CUR SEEK_END SEEK_DATA SEEK_HOLE os.SEEK_SET whence O_CREAT O_EXCL O_BINARY raw file descriptor python',
};

export const method = {
  slug:      'open',
  name:      'os.open',
  signature: 'os.open(path, flags, mode=0o777, *, dir_fd=None)',
  returns:   { type: 'int', desc: 'A new file descriptor (a small integer, non-inheritable). Close it with os.close().' },

  category:    'os function',
  version:     'Python 3.0+ (dir_fd 3.3+, non-inheritable fds 3.4+)',
  hasLiveDemo: false,

  subtitle: "The layer under the built-in open(): os.open returns a plain int, os.read/os.write move bytes, os.lseek moves the position, os.close frees it. Nothing is buffered and nothing is closed for you. On Windows add os.O_BINARY, or newlines are translated. Available on Unix and Windows; SEEK_DATA / SEEK_HOLE only on Linux 3.1+, macOS and other Unix.",

  covers: ['open', 'close', 'closerange', 'read', 'write', 'lseek', 'fdopen', 'SEEK_CUR', 'SEEK_DATA', 'SEEK_END', 'SEEK_HOLE', 'SEEK_SET'],

  cheat: {
    commonCall: "fd = os.open('f.bin', os.O_WRONLY | os.O_CREAT | os.O_TRUNC)",
    returns:    'int file descriptor — always os.close(fd) it',
    replaces:   'open() when you need exact OS flags such as O_EXCL',
    watchOut:   'Windows opens in text mode unless you add os.O_BINARY',
  },

  parameters: [
    { name: 'path',   type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'The file to open (path-like objects accepted since 3.6).' },
    { name: 'flags',  type: 'int',                    required: true,  default: null,    desc: 'Exactly one of O_RDONLY / O_WRONLY / O_RDWR, OR-ed with extras such as O_CREAT, O_TRUNC, O_APPEND, O_EXCL (and O_BINARY on Windows).' },
    { name: 'mode',   type: 'int',                    required: false, default: '0o777', desc: 'Permission bits for a newly created file; the umask is masked out first. Ignored when the file already exists.' },
    { name: 'dir_fd', type: 'int | None',             required: false, default: 'None',  desc: 'Open path relative to this directory descriptor (3.3+). Unix only: on Windows os.open is not in os.supports_dir_fd.' },
  ],

  patterns: [
    {
      name: 'Create a file only if it does not exist',
      desc: 'O_CREAT | O_EXCL is atomic: exactly one process wins, the others get FileExistsError.',
      code: "import os\nflags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, 'O_BINARY', 0)\ntry:\n    fd = os.open('app.lock', flags, 0o644)\nexcept FileExistsError:\n    print('already running')\nelse:\n    with os.fdopen(fd, 'w') as f:\n        f.write(str(os.getpid()))",
    },
    {
      name: 'Raw fd in, file object out',
      desc: 'Open with exact flags, then let os.fdopen handle buffering, encoding and closing.',
      code: "import os\nfd = os.open('secret.txt', os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)\nwith os.fdopen(fd, 'w', encoding='utf-8') as f:\n    f.write('token')",
    },
    {
      name: 'Read everything from a descriptor',
      desc: 'os.read returns at most n bytes; loop until it returns b"".',
      code: "import os\ndef read_all(fd, chunk=65536):\n    parts = []\n    while True:\n        data = os.read(fd, chunk)\n        if not data:\n            return b''.join(parts)\n        parts.append(data)",
    },
    {
      name: 'Find the data regions of a sparse file (Linux, macOS)',
      desc: 'SEEK_DATA jumps to the next byte that holds data, SEEK_HOLE to the next hole.',
      code: "import os\nfd = os.open('disk.img', os.O_RDONLY)\ntry:\n    start = os.lseek(fd, 0, os.SEEK_DATA)\n    end = os.lseek(fd, start, os.SEEK_HOLE)\nfinally:\n    os.close(fd)",
    },
  ],

  examples: [
    {
      title: 'Write bytes, then read them back',
      code: "import os\nB = getattr(os, 'O_BINARY', 0)\nfd = os.open('data.bin', os.O_WRONLY | os.O_CREAT | os.O_TRUNC | B)\ntry:\n    n = os.write(fd, b'hello')\nfinally:\n    os.close(fd)\nfd = os.open('data.bin', os.O_RDONLY | B)\ntry:\n    data = os.read(fd, 100)\nfinally:\n    os.close(fd)\n(n, data)",
      returns: "(5, b'hello')",
    },
    {
      title: 'os.read returns b"" at end of file',
      code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'abc')\nfd = os.open('f.bin', os.O_RDONLY | getattr(os, 'O_BINARY', 0))\ntry:\n    chunks = [os.read(fd, 2), os.read(fd, 2), os.read(fd, 2)]\nfinally:\n    os.close(fd)\nchunks",
      returns: "[b'ab', b'c', b'']",
    },
    {
      title: 'lseek returns the new position',
      code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'hello world')\nfd = os.open('f.bin', os.O_RDONLY | getattr(os, 'O_BINARY', 0))\ntry:\n    size = os.lseek(fd, 0, os.SEEK_END)\n    pos = os.lseek(fd, 6, os.SEEK_SET)\n    tail = os.read(fd, 5)\n    here = os.lseek(fd, 0, os.SEEK_CUR)\nfinally:\n    os.close(fd)\n(size, pos, tail, here)",
      returns: "(11, 6, b'world', 11)",
    },
    {
      title: 'The SEEK constants are 0, 1, 2 (shared with io)',
      code: 'import io, os\n(os.SEEK_SET, os.SEEK_CUR, os.SEEK_END, os.SEEK_END == io.SEEK_END)',
      returns: '(0, 1, 2, True)',
    },
    {
      title: 'O_EXCL refuses to open an existing file',
      code: "import os\nflags = os.O_WRONLY | os.O_CREAT | os.O_EXCL\nos.close(os.open('lock', flags))\ntry:\n    os.close(os.open('lock', flags))\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      returns: "'FileExistsError'",
    },
    {
      title: 'fdopen wraps the fd; closing the file closes the fd',
      code: "import os\nfd = os.open('note.txt', os.O_WRONLY | os.O_CREAT)\nwith os.fdopen(fd, 'w') as f:\n    f.write('ok')\ntry:\n    os.close(fd)\nexcept OSError as e:\n    result = (type(e).__name__, open('note.txt').read())\nresult",
      returns: "('OSError', 'ok')",
    },
    {
      title: 'New descriptors are not inherited by child processes',
      code: "import os\nfd = os.open('f', os.O_WRONLY | os.O_CREAT)\ntry:\n    result = (type(fd).__name__, os.get_inheritable(fd))\nfinally:\n    os.close(fd)\nresult",
      returns: "('int', False)",
    },
  ],

  pitfalls: [
    {
      name: 'Overwriting without O_TRUNC',
      desc: 'O_WRONLY alone writes over the start of the file and keeps the rest of the old content. Add O_TRUNC to replace the file.',
      wrong: { label: 'O_WRONLY', code: "import os\nfrom pathlib import Path\nPath('f.txt').write_bytes(b'hello world')\nfd = os.open('f.txt', os.O_WRONLY)\ntry:\n    os.write(fd, b'HI')\nfinally:\n    os.close(fd)\nPath('f.txt').read_bytes()", output: "b'HIllo world'" },
      fix:   { label: 'O_WRONLY | O_TRUNC', code: "import os\nfrom pathlib import Path\nPath('f.txt').write_bytes(b'hello world')\nfd = os.open('f.txt', os.O_WRONLY | os.O_TRUNC)\ntry:\n    os.write(fd, b'HI')\nfinally:\n    os.close(fd)\nPath('f.txt').read_bytes()", output: "b'HI'" },
    },
    {
      name: 'Opening a missing file without O_CREAT',
      desc: 'os.open never creates a file unless the flags say so; open(path, "w") does that for you, os.open does not.',
      wrong: { label: 'O_WRONLY', code: "import os\ntry:\n    os.open('new.txt', os.O_WRONLY)\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'O_WRONLY | O_CREAT', code: "import os\nfd = os.open('new.txt', os.O_WRONLY | os.O_CREAT)\nos.close(fd)\nos.path.exists('new.txt')", output: 'True' },
    },
    {
      name: 'Passing str to os.write',
      desc: 'Descriptors carry bytes only. Encode the text (or use os.fdopen to get a text file object).',
      wrong: { label: 'str', code: "import os\nfd = os.open('t.txt', os.O_WRONLY | os.O_CREAT)\ntry:\n    os.write(fd, 'hi')\nfinally:\n    os.close(fd)", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'encode', code: "import os\nfd = os.open('t.txt', os.O_WRONLY | os.O_CREAT)\ntry:\n    n = os.write(fd, 'hi'.encode('utf-8'))\nfinally:\n    os.close(fd)\nn", output: '2' },
    },
  ],

  when: {
    use: [
      'You need flags open() does not expose: O_EXCL with a mode, O_NOFOLLOW, O_CLOEXEC, O_TMPFILE, dir_fd',
      'Working with descriptors from pipe(), dup(), sockets or a parent process',
      'Unbuffered byte-level I/O where every os.write is one system call',
    ],
    avoid: [
      'Ordinary file reading and writing → the built-in open() (buffered, encodings, with-block closing)',
      'Exclusive creation only → open(path, "x") already fails if the file exists',
      'Closing a file object → f.close(), not os.close(f.fileno())',
    ],
  },

  notes: {
    cpython:       'os.open / os.read / os.write / os.lseek / os.close are thin wrappers over the C runtime calls in Modules/posixmodule.c; os.fdopen is the built-in open() with an int as first argument (Lib/os.py)',
    'Windows text mode': "Without os.O_BINARY, Windows opens the fd in text mode: os.write(fd, b'a\\nb') returns 3 but puts 4 bytes (a, CR, LF, b) on disk, and os.read turns CR LF back into LF. On Linux and macOS there is no text mode and O_BINARY does not exist — use getattr(os, 'O_BINARY', 0)",
    'Inheritance':  'Since 3.4 every new fd from os.open is non-inheritable (PEP 446): child processes do not get it unless you call os.set_inheritable(fd, True)',
    'closerange':   'os.closerange(lo, hi) closes every fd from lo up to hi - 1 and silently ignores ones that are not open. Never run it over a range you do not own: it also closes descriptors used by the interpreter or libraries',
    'SEEK_DATA / SEEK_HOLE': 'Unix only (Linux 3.1+, macOS): jump to the next data region or the next hole of a sparse file.',
    'Errors':       'Every call raises OSError subclasses: FileNotFoundError, FileExistsError, PermissionError; a closed or invalid fd gives OSError with errno.EBADF (9)',
  },

  related: [
    { name: 'O_* flags', slug: 'o_rdonly', when: 'Every flag you can pass to os.open' },
    { name: 'os.pipe / dup', slug: 'pipe', when: 'Other ways to get file descriptors' },
    { name: 'os.fsync / ftruncate', slug: 'fsync', when: 'Flush to disk, cut a file to size' },
    { name: 'os.pread / pwrite', slug: 'pread', when: 'Read or write at an offset without seeking (Unix)' },
    { name: 'open()', slug: 'open', when: 'The buffered, high-level way to open files', category: 'functions' },
    { name: 'Path.open', slug: 'open', when: 'open() as a pathlib method', category: 'stdlib/pathlib' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: 'What O_CREAT | O_EXCL raises', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: "Why does this page have no live demo?",
      a: "File descriptor numbers depend on what else the process has open, and text-mode handling differs on Windows, so the examples never show an fd and print only the bytes that were written and read back.",
    },
    {
      q: 'What is the difference between os.open and open in Python?',
      a: 'open() returns a buffered file object with read/write methods, text decoding and a context manager. os.open returns a bare integer file descriptor: you pass it to os.read, os.write and os.lseek, and you must call os.close yourself. Use os.fdopen(fd, mode) to turn the descriptor into a normal file object when you are done with the low-level part.',
    },
    {
      q: 'Why does os.open write extra carriage returns on Windows?',
      a: "Windows opens descriptors in text mode unless the flags include os.O_BINARY, so each LF written becomes CR LF on disk (os.write still reports the number of bytes you passed). Add getattr(os, 'O_BINARY', 0) to the flags: that is O_BINARY on Windows and 0 elsewhere.",
    },
    {
      q: 'How do I close a file descriptor in Python?',
      a: 'os.close(fd). Do it in a finally block or hand the fd to os.fdopen inside a with-block, which closes it for you. Closing the same fd twice raises OSError (EBADF), and closing an fd that something else is still using breaks that code.',
    },
    {
      q: 'Why does os.read return fewer bytes than I asked for?',
      a: 'n is a maximum. At the end of a file, on pipes, terminals and sockets you get whatever is available. os.read returns b"" only at end of file (or when the write end of a pipe is closed), so loop until you get b"".',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.open',
    meta:  'os.open / close / read / write / lseek / fdopen',
  },
};
