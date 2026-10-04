// content/reference/python/stdlib/os/pread.js

export const meta = {
  slug:        'pread',
  name:        'os.pread',
  signature:   'os.pread(fd, n, offset, /) -> bytes',
  blurb:       'Unix positional and vectored I/O: read or write at an offset without moving the file position (pread, pwrite), scatter/gather over several buffers (readv, writev, preadv, pwritev), and kernel-side copies (sendfile, splice, copy_file_range).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+ (preadv / pwritev 3.7+, copy_file_range 3.8+, splice 3.10+)',
  searchTerms: 'os.pread pread os.pwrite pwrite positional read write at offset os.readv readv os.writev writev scatter gather vectored io os.preadv preadv os.pwritev pwritev os.sendfile sendfile zero copy os.splice splice os.copy_file_range copy_file_range RWF_APPEND RWF_DSYNC RWF_HIPRI RWF_NOWAIT RWF_SYNC SPLICE_F_MORE SPLICE_F_MOVE SPLICE_F_NONBLOCK python thread safe file read',
};

export const method = {
  slug:      'pread',
  name:      'os.pread',
  signature: 'os.pread(fd, n, offset, /) -> bytes',
  returns:   { type: 'bytes', desc: 'At most n bytes read from offset; b"" at end of file. The fd position is unchanged.' },

  category:    'os function',
  version:     'Python 3.3+ (preadv / pwritev 3.7+, copy_file_range 3.8+, splice 3.10+)',
  hasLiveDemo: false,

  subtitle: 'None of these exist on Windows. pread, pwrite, readv, writev: Unix. sendfile: Unix (not WASI). preadv, pwritev: Linux 2.6.30+, FreeBSD, OpenBSD, AIX. splice: Linux 2.6.17+; copy_file_range: Linux 4.5+; the RWF_* and SPLICE_F_* flags: Linux. Every call returns a byte count that can be smaller than you asked for.',

  covers: ['pread', 'pwrite', 'readv', 'writev', 'preadv', 'pwritev', 'sendfile', 'splice', 'copy_file_range', 'RWF_APPEND', 'RWF_DSYNC', 'RWF_HIPRI', 'RWF_NOWAIT', 'RWF_SYNC', 'SPLICE_F_MORE', 'SPLICE_F_MOVE', 'SPLICE_F_NONBLOCK'],

  cheat: {
    commonCall: 'os.pread(fd, 4096, offset)',
    returns:    'bytes (pread) or a byte count (the rest)',
    replaces:   'lseek + read, which moves the shared file position',
    watchOut:   'Unix only — and counts can be short: loop',
  },

  parameters: [
    { name: 'fd',        type: 'int',              required: true,  default: null, desc: 'An open file descriptor.' },
    { name: 'n',         type: 'int',              required: true,  default: null, desc: 'pread: maximum number of bytes to read.' },
    { name: 'offset',    type: 'int',              required: true,  default: null, desc: 'Byte position to read or write at; the fd position is left alone.' },
    { name: 'buffers',   type: 'sequence',         required: true,  default: null, desc: 'readv / preadv: mutable buffers (bytearray, memoryview) filled in order. writev / pwritev: bytes-like objects written in order.' },
    { name: 'flags',     type: 'int',              required: false, default: '0',  desc: 'preadv: RWF_HIPRI, RWF_NOWAIT. pwritev: RWF_DSYNC, RWF_SYNC, RWF_APPEND (Linux 4.6+ for flags).' },
    { name: 'out_fd, in_fd, offset, count', type: 'int', required: true, default: null, desc: 'sendfile: copy count bytes from in_fd (starting at offset, or the current position when offset is None on Linux) to out_fd.' },
    { name: 'src, dst, count, offset_src=None, offset_dst=None', type: 'int', required: true, default: null, desc: 'splice / copy_file_range: copy count bytes between two fds inside the kernel. splice needs a pipe on one side.' },
  ],

  patterns: [
    {
      name: 'Threads reading one file at different offsets',
      desc: 'pread does not touch the shared position, so threads can share one fd without a lock.',
      code: "import os\nfrom concurrent.futures import ThreadPoolExecutor\nfd = os.open('data.bin', os.O_RDONLY)\ntry:\n    with ThreadPoolExecutor() as pool:\n        blocks = list(pool.map(lambda off: os.pread(fd, 4096, off), range(0, 65536, 4096)))\nfinally:\n    os.close(fd)",
    },
    {
      name: 'Header + body in one system call',
      desc: 'writev gathers several buffers without concatenating them in Python first.',
      code: "import os\nheader = len(body).to_bytes(4, 'big')\nos.writev(fd, [header, body])",
    },
    {
      name: 'Copy a file inside the kernel (Linux)',
      desc: 'copy_file_range can be short; loop until it returns 0.',
      code: "import os\nsrc = os.open('in.bin', os.O_RDONLY)\ndst = os.open('out.bin', os.O_WRONLY | os.O_CREAT | os.O_TRUNC)\ntry:\n    while os.copy_file_range(src, dst, 1 << 30):\n        pass\nfinally:\n    os.close(src)\n    os.close(dst)",
    },
    {
      name: 'Serve a file over a socket',
      desc: 'socket.sendfile wraps os.sendfile and falls back to send() where it is missing.',
      code: "with open('index.html', 'rb') as f:\n    conn.sendfile(f)",
    },
  ],

  examples: [
    {
      title: 'What pread does, spelled out with lseek',
      code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'hello world')\ndef pread_like(fd, n, offset):\n    saved = os.lseek(fd, 0, os.SEEK_CUR)\n    os.lseek(fd, offset, os.SEEK_SET)\n    try:\n        return os.read(fd, n)\n    finally:\n        os.lseek(fd, saved, os.SEEK_SET)\nfd = os.open('f.bin', os.O_RDONLY | getattr(os, 'O_BINARY', 0))\ntry:\n    os.lseek(fd, 2, os.SEEK_SET)\n    result = (pread_like(fd, 5, 6), os.lseek(fd, 0, os.SEEK_CUR))\nfinally:\n    os.close(fd)\nresult",
      returns: "(b'world', 2)",
    },
    {
      title: 'How readv fills its buffers (pure Python model)',
      code: "def readv_like(data, buffers):\n    pos = 0\n    for buf in buffers:\n        chunk = data[pos:pos + len(buf)]\n        buf[:len(chunk)] = chunk\n        pos += len(chunk)\n    return pos\na, b = bytearray(5), bytearray(3)\n(readv_like(b'hello world', [a, b]), a, b)",
      returns: "(8, bytearray(b'hello'), bytearray(b' wo'))",
    },
    {
      title: 'writev writes the buffers back to back',
      code: "import os\nfrom pathlib import Path\nbuffers = [b'ab', b'cd']\nfd = os.open('out.bin', os.O_WRONLY | os.O_CREAT | getattr(os, 'O_BINARY', 0))\ntry:\n    n = os.write(fd, b''.join(buffers))\nfinally:\n    os.close(fd)\n(n, Path('out.bin').read_bytes())",
      returns: "(4, b'abcd')",
    },
    {
      title: 'shutil.copyfile: the portable fast copy',
      code: "import shutil\nfrom pathlib import Path\nPath('src.bin').write_bytes(b'payload' * 1000)\nshutil.copyfile('src.bin', 'dst.bin')\nPath('dst.bin').read_bytes() == Path('src.bin').read_bytes()",
      returns: 'True',
    },
    {
      title: 'socket.sendfile exists everywhere',
      code: "import socket\nhasattr(socket.socket, 'sendfile')",
      returns: 'True',
    },
    {
      title: 'The cross-device error splice and copy_file_range can raise',
      code: 'import errno\nerrno.errorcode[errno.EXDEV]',
      returns: "'EXDEV'",
    },
  ],

  pitfalls: [
    {
      name: 'Seek-and-read moves the shared position',
      desc: 'lseek + read changes where the next read starts — for every thread using that fd. pread (or saving and restoring the position) leaves it alone.',
      wrong: { label: 'lseek + read', code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'hello world')\nfd = os.open('f.bin', os.O_RDONLY | getattr(os, 'O_BINARY', 0))\ntry:\n    os.lseek(fd, 6, os.SEEK_SET)\n    os.read(fd, 5)\n    nxt = os.read(fd, 5)\nfinally:\n    os.close(fd)\nnxt", output: "b''" },
      fix:   { label: 'pread (or restore)', code: "import os\nfrom pathlib import Path\nPath('f.bin').write_bytes(b'hello world')\ndef pread(fd, n, offset):\n    if hasattr(os, 'pread'):\n        return os.pread(fd, n, offset)\n    saved = os.lseek(fd, 0, os.SEEK_CUR)\n    os.lseek(fd, offset, os.SEEK_SET)\n    try:\n        return os.read(fd, n)\n    finally:\n        os.lseek(fd, saved, os.SEEK_SET)\nfd = os.open('f.bin', os.O_RDONLY | getattr(os, 'O_BINARY', 0))\ntry:\n    pread(fd, 5, 6)\n    nxt = os.read(fd, 5)\nfinally:\n    os.close(fd)\nnxt", output: "b'hello'" },
    },
    {
      name: 'Ignoring the byte count',
      desc: 'os.write, writev, pwrite, sendfile, splice and copy_file_range all return how much they actually moved, which can be less than you passed (here: a 1 MiB write into a non-blocking pipe). Loop on the remainder.',
      wrong: { label: 'one call', code: "import os\nr, w = os.pipe()\nos.set_blocking(w, False)\ndata = b'x' * (1024 * 1024)\ntry:\n    n = os.write(w, data)\nfinally:\n    os.close(r)\n    os.close(w)\nn == len(data)", output: 'False' },
      fix:   { label: 'loop on the rest', code: "import os\nr, w = os.pipe()\nos.set_blocking(r, False)\nos.set_blocking(w, False)\ndata = b'x' * (1024 * 1024)\nview = memoryview(data)\ngot = bytearray()\ntry:\n    while view or len(got) < len(data):\n        if view:\n            try:\n                view = view[os.write(w, view):]\n            except BlockingIOError:\n                pass\n        try:\n            got += os.read(r, 1 << 16)\n        except BlockingIOError:\n            pass\nfinally:\n    os.close(r)\n    os.close(w)\nlen(got) == len(data)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Several threads reading or writing one fd at different offsets (pread / pwrite)',
      'Record formats where a header and a body live in separate buffers (writev / readv)',
      'Copying large files or serving files to sockets without passing the bytes through Python (sendfile, copy_file_range, splice)',
    ],
    avoid: [
      'Code that must run on Windows → lseek + read with a lock, or file objects',
      'Plain file copies → shutil.copyfile / shutil.copy2 already pick the fast path',
      'Sockets → socket.socket.sendfile instead of os.sendfile',
    ],
  },

  notes: {
    cpython:          'Wrappers over the C calls in Modules/posixmodule.c. Lib/shutil.py (3.12 and 3.13) uses os.sendfile for shutil.copyfile on Linux and fcopyfile on macOS; Windows copies with readinto',
    'Availability':   'pread, pwrite, readv, writev: Unix (3.3+). preadv, pwritev: Linux 2.6.30+, FreeBSD 6.0+, OpenBSD 2.7+, AIX 7.1+ (3.7+); flags need Linux 4.6+. sendfile: Unix, not WASI (3.3+). splice: Linux 2.6.17+ with glibc 2.5+ (3.10+). copy_file_range: Linux 4.5+ with glibc 2.27+ (3.8+). None on Windows',
    'RWF_* flags':    'RWF_HIPRI (Linux 4.6+, O_DIRECT fds) and RWF_NOWAIT (Linux 4.14+) for preadv; RWF_DSYNC / RWF_SYNC (Linux 4.7+) and RWF_APPEND (Linux 4.16+, 3.10+) for pwritev: per-call versions of O_DSYNC, O_SYNC and O_APPEND',
    'SPLICE_F_*':     'SPLICE_F_MOVE, SPLICE_F_NONBLOCK and SPLICE_F_MORE (3.10+) are the flags argument of splice; values on Linux 1, 2, 4',
    'Short counts':   'readv / preadv return the total bytes read, which can be less than the buffers hold; sendfile and splice return 0 at end of input',
    'EXDEV':          'splice needs both files on the same file system; copy_file_range too on Linux kernels older than 5.3. Otherwise OSError with errno.EXDEV',
  },

  related: [
    { name: 'os.open / read / lseek', slug: 'open', when: 'The portable descriptor calls' },
    { name: 'os.pipe', slug: 'pipe', when: 'The pipe splice needs on one side' },
    { name: 'os.fsync', slug: 'fsync', when: 'Durability for the whole file instead of RWF_SYNC' },
    { name: 'O_DIRECT / O_SYNC', slug: 'o_rdonly', when: 'Open flags the RWF_* flags mirror' },
    { name: 'bytearray', slug: 'bytearray', when: 'Mutable buffers for readv / preadv', category: 'functions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does os.pread work on Windows?',
      a: 'No. pread, pwrite, readv, writev and sendfile are Unix-only, preadv, pwritev, splice and copy_file_range are Linux (and some BSDs), and none of them exist in the Windows os module. That is why this page has no live demo and its examples show portable equivalents. On Windows use lseek + read under a lock, or file objects.',
    },
    {
      q: 'What is the difference between os.pread and os.read?',
      a: 'os.read(fd, n) reads from the current position and advances it. os.pread(fd, n, offset) reads from offset and leaves the position where it was — so threads sharing one fd do not move each other\'s position.',
    },
    {
      q: 'Does shutil.copyfile use sendfile or copy_file_range?',
      a: 'In Python 3.12 and 3.13, shutil.copyfile uses os.sendfile on Linux (falling back to a normal read/write loop if it fails) and the macOS fcopyfile call on macOS; Windows uses a readinto loop. os.copy_file_range is not used by shutil in these versions — call it yourself if you want reflinks or server-side copies.',
    },
    {
      q: 'What is os.sendfile used for?',
      a: 'Sending a file to a socket (or on Linux, another fd) without copying the bytes into Python. It returns the number of bytes sent, 0 at end of file, so loop. socket.socket.sendfile is the higher-level wrapper and works on every platform.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.pread',
    meta:  'os.pread / pwrite / readv / writev / sendfile / splice',
  },
};
