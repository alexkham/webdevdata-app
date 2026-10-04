// content/reference/python/stdlib/os/pipe.js

export const meta = {
  slug:        'pipe',
  name:        'os.pipe',
  signature:   'os.pipe() -> (r, w)',
  blurb:       'Create an OS pipe: two file descriptors, bytes written to w come out of r. Plus the descriptor tools around it — dup, dup2, the inheritable flag and blocking mode.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (non-inheritable 3.4+, get_blocking 3.5+, Windows pipes for get_blocking 3.12+)',
  searchTerms: 'os.pipe pipe os.pipe2 pipe2 os.dup dup os.dup2 dup2 duplicate file descriptor os.get_inheritable get_inheritable os.set_inheritable set_inheritable get_handle_inheritable set_handle_inheritable os.get_blocking get_blocking os.set_blocking set_blocking non-blocking pipe python inheritable fd redirect stdout',
};

export const method = {
  slug:      'pipe',
  name:      'os.pipe',
  signature: 'os.pipe() -> (r, w)',
  returns:   { type: 'tuple[int, int]', desc: 'The read end and the write end, both non-inheritable.' },

  category:    'os function',
  version:     'Python 3.0+ (non-inheritable 3.4+, get_blocking 3.5+, Windows pipes for get_blocking 3.12+)',
  hasLiveDemo: false,

  subtitle: 'os.pipe() gives (read_end, write_end). The reader sees b"" only after every copy of the write end is closed. pipe, dup, dup2, get/set_inheritable and get/set_blocking work on Unix and Windows (blocking mode on Windows: pipes only, 3.12+); pipe2 is Unix-only (not macOS); get/set_handle_inheritable are Windows-only.',

  covers: ['pipe', 'pipe2', 'dup', 'dup2', 'get_inheritable', 'set_inheritable', 'get_handle_inheritable', 'set_handle_inheritable', 'get_blocking', 'set_blocking'],

  cheat: {
    commonCall: 'r, w = os.pipe()',
    returns:    '(read_fd, write_fd)',
    replaces:   'temporary files for passing bytes between processes',
    watchOut:   'Close the write end, or the reader never sees EOF',
  },

  parameters: [
    { name: 'flags (pipe2)',        type: 'int',  required: true,  default: null,   desc: 'pipe2(flags): O_NONBLOCK and/or O_CLOEXEC, set atomically on both ends. Unix only, not macOS.' },
    { name: 'fd, fd2 (dup2)',       type: 'int',  required: true,  default: null,   desc: 'dup2(fd, fd2, inheritable=True) makes fd2 a copy of fd, closing fd2 first, and returns fd2 (3.7+).' },
    { name: 'inheritable',          type: 'bool', required: false, default: 'True', desc: 'dup2 only: the copy is inheritable unless you pass False. dup() copies are always non-inheritable.' },
    { name: 'blocking',             type: 'bool', required: true,  default: null,   desc: 'set_blocking(fd, blocking): False sets O_NONBLOCK, so reads that would wait raise BlockingIOError.' },
    { name: 'handle',               type: 'int',  required: true,  default: null,   desc: 'get/set_handle_inheritable take a Windows HANDLE (msvcrt.get_osfhandle(fd)), not an fd.' },
  ],

  patterns: [
    {
      name: 'Read a child process through a pipe',
      desc: 'Pass the write end to the child, close your copy, read until EOF.',
      code: "import os, subprocess, sys\nr, w = os.pipe()\nproc = subprocess.Popen([sys.executable, '-c', 'print(42)'], stdout=w)\nos.close(w)\nwith os.fdopen(r, 'rb') as f:\n    data = f.read()\nproc.wait()",
    },
    {
      name: 'Temporarily redirect fd 1 (Unix)',
      desc: 'dup saves the real stdout, dup2 swaps a file in and back. This also catches output from C code.',
      code: "import os, sys\nsys.stdout.flush()\nsaved = os.dup(1)\nfd = os.open('out.log', os.O_WRONLY | os.O_CREAT | os.O_TRUNC)\ntry:\n    os.dup2(fd, 1)\n    os.system('echo captured')\nfinally:\n    os.dup2(saved, 1)\n    os.close(saved)\n    os.close(fd)",
    },
    {
      name: 'Non-blocking pipe in one call (Linux)',
      desc: 'pipe2 sets the flags atomically, with no window between creation and fcntl.',
      code: 'import os\nr, w = os.pipe2(os.O_NONBLOCK | os.O_CLOEXEC)',
    },
    {
      name: 'Self-pipe wake-up for select',
      desc: 'A non-blocking pipe that a signal handler or thread writes one byte to.',
      code: "import os, selectors\nr, w = os.pipe()\nos.set_blocking(r, False)\nos.set_blocking(w, False)\nsel = selectors.DefaultSelector()\nsel.register(r, selectors.EVENT_READ)",
    },
  ],

  examples: [
    {
      title: 'Bytes in one end, out the other',
      code: "import os\nr, w = os.pipe()\ntry:\n    os.write(w, b'hello')\n    data = os.read(r, 100)\nfinally:\n    os.close(r)\n    os.close(w)\ndata",
      returns: "b'hello'",
    },
    {
      title: 'Closing the write end means EOF',
      code: "import os\nr, w = os.pipe()\nos.write(w, b'hi')\nos.close(w)\ntry:\n    result = [os.read(r, 100), os.read(r, 100)]\nfinally:\n    os.close(r)\nresult",
      returns: "[b'hi', b'']",
    },
    {
      title: 'Pipes are not inherited until you say so',
      code: "import os\nr, w = os.pipe()\ntry:\n    before = os.get_inheritable(w)\n    os.set_inheritable(w, True)\n    after = os.get_inheritable(w)\nfinally:\n    os.close(r)\n    os.close(w)\n(before, after)",
      returns: '(False, True)',
    },
    {
      title: 'dup: a second fd for the same pipe',
      code: "import os\nr, w = os.pipe()\nw2 = os.dup(w)\ntry:\n    os.write(w2, b'via copy')\n    result = (w2 != w, os.get_inheritable(w2), os.read(r, 100))\nfinally:\n    for fd in (r, w, w2):\n        os.close(fd)\nresult",
      returns: "(True, False, b'via copy')",
    },
    {
      title: 'dup2 returns fd2 and makes it inheritable',
      code: "import os\nr, w = os.pipe()\nr2, w2 = os.pipe()\ntry:\n    same = os.dup2(w, w2) == w2\n    os.write(w2, b'redirected')\n    result = (same, os.get_inheritable(w2), os.read(r, 100))\nfinally:\n    for fd in (r, w, r2, w2):\n        os.close(fd)\nresult",
      returns: "(True, True, b'redirected')",
    },
    {
      title: 'Blocking by default; switch it off',
      code: "import os\nr, w = os.pipe()\ntry:\n    before = os.get_blocking(r)\n    os.set_blocking(r, False)\n    result = (before, os.get_blocking(r))\nfinally:\n    os.close(r)\n    os.close(w)\nresult",
      returns: '(True, False)',
    },
    {
      title: 'Empty non-blocking pipe: BlockingIOError (EAGAIN)',
      code: "import errno, os\nr, w = os.pipe()\nos.set_blocking(r, False)\ntry:\n    os.read(r, 100)\nexcept BlockingIOError as e:\n    result = e.errno == errno.EAGAIN\nfinally:\n    os.close(r)\n    os.close(w)\nresult",
      returns: 'True',
    },
  ],

  pitfalls: [
    {
      name: 'Swapping the two ends',
      desc: 'os.pipe() returns (read_end, write_end) in that order. Writing to the read end fails with OSError (EBADF).',
      wrong: { label: 'write to r', code: "import os\nw, r = os.pipe()\ntry:\n    os.write(w, b'x')\nexcept OSError as e:\n    result = type(e).__name__\nfinally:\n    os.close(r)\n    os.close(w)\nresult", output: "'OSError'" },
      fix:   { label: 'r, w = os.pipe()', code: "import os\nr, w = os.pipe()\ntry:\n    result = os.write(w, b'x')\nfinally:\n    os.close(r)\n    os.close(w)\nresult", output: '1' },
    },
    {
      name: 'dup2 copies are inheritable',
      desc: 'Unlike os.dup and os.pipe, os.dup2 makes fd2 inheritable by default, so child processes get it. Pass inheritable=False when you do not want that.',
      wrong: { label: 'default', code: "import os\nr, w = os.pipe()\nr2, w2 = os.pipe()\ntry:\n    os.dup2(w, w2)\n    result = os.get_inheritable(w2)\nfinally:\n    for fd in (r, w, r2, w2):\n        os.close(fd)\nresult", output: 'True' },
      fix:   { label: 'inheritable=False', code: "import os\nr, w = os.pipe()\nr2, w2 = os.pipe()\ntry:\n    os.dup2(w, w2, inheritable=False)\n    result = os.get_inheritable(w2)\nfinally:\n    for fd in (r, w, r2, w2):\n        os.close(fd)\nresult", output: 'False' },
    },
    {
      name: 'Treating "no data yet" as end of file',
      desc: 'A non-blocking read of an empty pipe does not return b"" — it raises BlockingIOError. Only a closed write end gives b"". Catch BlockingIOError and try again later.',
      wrong: { label: 'expects b""', code: "import os\nr, w = os.pipe()\nos.set_blocking(r, False)\ntry:\n    result = os.read(r, 100) == b''\nexcept OSError as e:\n    result = type(e).__name__\nfinally:\n    os.close(r)\n    os.close(w)\nresult", output: "'BlockingIOError'" },
      fix:   { label: 'catch BlockingIOError', code: "import os\nr, w = os.pipe()\nos.set_blocking(r, False)\ntry:\n    data = os.read(r, 100)\nexcept BlockingIOError:\n    data = None\nfinally:\n    os.close(r)\n    os.close(w)\ndata is None", output: 'True' },
    },
  ],

  when: {
    use: [
      'Passing bytes to or from a child process at the fd level',
      'Redirecting fd 0/1/2 with dup/dup2 (catches output from C extensions too)',
      'Wake-up pipes for select/selectors loops',
    ],
    avoid: [
      'Running a command and collecting its output → subprocess.run(..., capture_output=True)',
      'Sending Python objects between processes → multiprocessing.Pipe / Queue',
      'Redirecting only Python-level prints → contextlib.redirect_stdout',
    ],
  },

  notes: {
    cpython:         'All of these live in Modules/posixmodule.c. PEP 446 (3.4) made new fds non-inheritable; dup2 kept inheritable=True as its default',
    'Availability':  'pipe, dup, dup2, get_inheritable, set_inheritable: Unix and Windows. get_blocking / set_blocking: Unix, and Windows for pipes only since 3.12. pipe2: Unix, not macOS, not iOS (3.3+). get_handle_inheritable / set_handle_inheritable: Windows only',
    'EOF':           'A read returns b"" only when every copy of the write end is closed — including copies held by child processes. A forgotten copy makes the reader wait forever',
    'Buffer size':   'A pipe holds a limited amount of data; when it is full, os.write blocks (or raises BlockingIOError in non-blocking mode) until the reader drains it. Read and write from different threads or processes',
    'dup on Windows': 'docs.python.org: when dup duplicates a standard stream (0, 1, 2) on Windows, the new fd is inheritable',
  },

  related: [
    { name: 'os.open / read / write', slug: 'open', when: 'Reading and writing the pipe ends' },
    { name: 'O_NONBLOCK / O_CLOEXEC', slug: 'o_rdonly', when: 'Flags for pipe2' },
    { name: 'os.splice', slug: 'pread', when: 'Move data between a pipe and a file in the kernel (Linux)' },
    { name: 'os.eventfd', slug: 'eventfd', when: 'A lighter wake-up fd on Linux' },
    { name: 'OSError', slug: 'oserror', when: 'BlockingIOError and EBADF are OSErrors', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does reading from my os.pipe hang forever?',
      a: 'os.read blocks until data arrives or every copy of the write end is closed. Close your own copy of w after starting the writer (and after handing it to a child process); otherwise the reader keeps waiting for data you could still write. This page has no live demo because a blocked read would hang; the examples close every fd they open.',
    },
    {
      q: 'What is the difference between os.dup and os.dup2?',
      a: 'os.dup(fd) returns a new descriptor pointing at the same file, and it is non-inheritable. os.dup2(fd, fd2) puts the copy at a number you choose (closing fd2 first), returns fd2 since 3.7, and makes it inheritable unless you pass inheritable=False. dup2 is how you redirect stdout: os.dup2(file_fd, 1).',
    },
    {
      q: 'How do I make a pipe non-blocking in Python?',
      a: 'os.set_blocking(fd, False) on Unix — and on Windows for pipes since Python 3.12. On Linux os.pipe2(os.O_NONBLOCK) creates both ends non-blocking at once. A read with no data then raises BlockingIOError instead of waiting.',
    },
    {
      q: 'What does "inheritable" mean for a file descriptor?',
      a: 'Whether a child process started with subprocess or exec keeps it open. Python creates descriptors non-inheritable (since 3.4) so they do not leak into children. subprocess pass_fds makes specific fds inheritable for one child on Unix; os.set_inheritable changes the flag directly. On Windows, os.set_handle_inheritable does the same for a HANDLE.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.pipe',
    meta:  'os.pipe / dup / dup2 / inheritable / blocking',
  },
};
