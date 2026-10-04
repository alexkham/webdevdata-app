// content/reference/python/stdlib/os/stat.js

export const meta = {
  slug:        'stat',
  name:        'os.stat',
  signature:   'os.stat(path, *, dir_fd=None, follow_symlinks=True) → stat_result / os.lstat(path) / os.fstat(fd) / os.utime(path, times=None, *, ns=…)',
  blurb:       'Read a file\'s metadata — size, type and permission bits, timestamps, inode — as an os.stat_result. lstat does not follow symlinks, fstat works on an open file descriptor, utime sets the access and modification times.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (st_*_ns 3.3+)',
  searchTerms: 'os.stat stat os.lstat lstat os.fstat fstat stat_result os.stat_result os.utime utime file size python st_size st_mtime st_mtime_ns st_mode st_ino modification time touch set file time S_ISDIR S_ISREG',
};

export const method = {
  slug:      'stat',
  name:      'os.stat',
  signature: 'os.stat(path, *, dir_fd=None, follow_symlinks=True) → stat_result / os.lstat(path) / os.fstat(fd) / os.utime(path, times=None, *, ns=…)',
  returns:   { type: 'os.stat_result', desc: 'st_mode, st_ino, st_dev, st_nlink, st_uid, st_gid, st_size, st_atime, st_mtime, st_ctime (also by index 0–9), plus *_ns integer times and platform extras. utime returns None.' },

  category:    'os function',
  version:     'Python 3.0+ (st_*_ns 3.3+)',
  hasLiveDemo: true,

  subtitle: 'st_size is bytes, not characters. Times are float seconds since the epoch (st_mtime) or exact integer nanoseconds (st_mtime_ns). Test the file type with the stat module (stat.S_ISDIR(st.st_mode)). Some fields mean different things per OS — st_ctime is the metadata-change time on Unix.',

  covers: ['stat', 'lstat', 'fstat', 'stat_result', 'utime'],

  cheat: {
    commonCall: "os.stat('data.csv').st_size",
    returns:    'an os.stat_result',
    replaces:   'Opening a file just to measure it; ls -l',
    watchOut:   'st_size counts bytes — UTF-8 text with accents is longer than len(text)',
  },

  parameters: [
    { name: 'path',            type: 'str | bytes | PathLike | int', required: true,  default: null,   desc: 'The file to inspect (an open file descriptor also works, like fstat).' },
    { name: 'follow_symlinks', type: 'bool', required: false, default: 'True', desc: 'False inspects a symlink itself — the same as lstat.' },
    { name: 'times',           type: 'tuple[float, float] | None', required: false, default: 'None', desc: 'utime only: (atime, mtime) in seconds; None means "now".' },
    { name: 'ns',              type: 'tuple[int, int]', required: false, default: null, desc: 'utime only: (atime_ns, mtime_ns) in integer nanoseconds. Do not pass both times and ns.' },
  ],

  modes: [
    {
      id: 'size',
      label: 'size in bytes',
      blurb: 'Write some text as UTF-8 and compare st_size with the number of characters.',
      params: [{ name: 'text', type: 'str', hint: 'file content', input: 'text' }],
      template: "import os\nwith open('data.txt', 'wb') as f:\n    f.write({$text}.encode('utf-8'))\n(os.stat('data.txt').st_size, len({$text}))",
      cases: [
        { id: 'ascii',  label: 'ASCII',     values: { text: 'hello' } },
        { id: 'accent', label: 'accents',   values: { text: 'héllo wörld' } },
        { id: 'emoji',  label: 'emoji',     values: { text: 'ok 👍' } },
        { id: 'empty',  label: 'empty',     values: { text: '' } },
      ],
    },
    {
      id: 'kind',
      label: 'file or folder',
      blurb: 'Create some files, stat one path, and test st_mode with the stat module.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'path',  type: 'str',       hint: 'path to stat',                     input: 'text' },
      ],
      template: "import os, stat\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    st = os.stat({$path})\n    result = (stat.S_ISDIR(st.st_mode), stat.S_ISREG(st.st_mode))\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'file', label: 'a file',   values: { files: 'src/app.py', path: 'src/app.py' } },
        { id: 'dir',  label: 'a folder', values: { files: 'src/app.py', path: 'src' } },
        { id: 'miss', label: 'missing',  values: { files: 'src/app.py', path: 'src/main.py' } },
      ],
    },
    {
      id: 'utime',
      label: 'set the time',
      blurb: 'Set a fixed modification time with utime, then read it back as seconds and as nanoseconds.',
      params: [{ name: 'mtime', type: 'int', hint: 'seconds since 1970-01-01 UTC', input: 'number' }],
      template: "import os\nopen('f.txt', 'w').close()\nos.utime('f.txt', (1000000000, {$mtime}))\nst = os.stat('f.txt')\n(st.st_mtime, st.st_mtime_ns)",
      cases: [
        { id: 'y2023', label: 'Nov 2023', values: { mtime: '1700000000' } },
        { id: 'epoch', label: 'the epoch', values: { mtime: '0' } },
      ],
    },
  ],
  demoExplainer: "'héllo wörld' is 11 characters but 13 bytes, because é and ö take two bytes each in UTF-8, and the emoji takes four. The stat module turns st_mode into answers: S_ISDIR for folders, S_ISREG for regular files; a missing path raises FileNotFoundError. utime stores the time you give it and st_mtime reads it back as a float — use st_mtime_ns when you need exact integers. File systems limit the range: ext4 on Linux, for example, cannot store dates far in the future and clamps them.",

  patterns: [
    {
      name: 'Size and modification time',
      desc: 'One stat call, several answers.',
      code: "import os, datetime\nst = os.stat(path)\nsize_kb = st.st_size / 1024\nmodified = datetime.datetime.fromtimestamp(st.st_mtime, tz=datetime.timezone.utc)",
    },
    {
      name: 'Has the file changed?',
      desc: 'Compare (size, mtime_ns) with what you saw last time.',
      code: "import os\nst = os.stat(path)\nsignature = (st.st_size, st.st_mtime_ns)\nif signature != last_signature:\n    reload()",
    },
    {
      name: 'touch',
      desc: 'Create if missing, then set both times to now.',
      code: "import os\nwith open(path, 'a'):\n    os.utime(path, None)",
    },
    {
      name: 'Copy the timestamps of another file',
      desc: 'ns= keeps full precision.',
      code: "import os\nsrc = os.stat('original.txt')\nos.utime('copy.txt', ns=(src.st_atime_ns, src.st_mtime_ns))",
    },
  ],

  examples: [
    { title: 'Bytes, not characters',     code: "import os\nwith open('data.txt', 'wb') as f:\n    f.write('héllo'.encode('utf-8'))\n(os.stat('data.txt').st_size, len('héllo'))", returns: '(6, 5)' },
    { title: 'Folder or file?',           code: "import os, stat\nos.mkdir('d')\nst = os.stat('d')\n(stat.S_ISDIR(st.st_mode), stat.S_ISREG(st.st_mode))", returns: '(True, False)' },
    { title: 'Set and read back times',   code: "import os\nopen('f', 'w').close()\nos.utime('f', (1000000000, 1700000000))\nst = os.stat('f')\n(st.st_mtime, st.st_mtime_ns, st.st_atime)", returns: '(1700000000.0, 1700000000000000000, 1000000000.0)' },
    { title: 'A tuple of 10 fields too',  code: "import os\nopen('f', 'w').close()\nst = os.stat('f')\n(type(st).__name__, len(st), st[6] == st.st_size)", returns: "('stat_result', 10, True)" },
    { title: 'fstat on an open file',     code: "import os\nwith open('f', 'wb') as fh:\n    fh.write(b'abc')\n    fh.flush()\n    size = os.fstat(fh.fileno()).st_size\nsize", returns: '3' },
    { title: 'Like ls -l',                code: "import os, stat\nopen('f', 'w').close()\nstat.filemode(os.stat('f').st_mode)[0]", returns: "'-'" },
    { title: 'utime(path) means now',     code: "import os, time\nopen('f', 'w').close()\nos.utime('f', (0, 0))\nos.utime('f')\nabs(os.stat('f').st_mtime - time.time()) < 60", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Using len() of the text as the file size',
      desc: 'Files hold bytes. Any non-ASCII character takes more than one byte in UTF-8 (and Windows text mode turns \\n into two bytes).',
      wrong: { label: 'len(text)', code: "text = 'naïve café'\nlen(text)", output: '10' },
      fix:   { label: 'st_size', code: "import os\ntext = 'naïve café'\nwith open('t.txt', 'wb') as f:\n    f.write(text.encode('utf-8'))\nos.stat('t.txt').st_size", output: '12' },
    },
    {
      name: 'Comparing float timestamps for equality',
      desc: 'st_mtime is a float and cannot hold every nanosecond value exactly; st_mtime_ns is an exact int.',
      wrong: { label: 'float seconds', code: "ns = 1700000000123456789\nint(ns / 1e9 * 1e9) == ns", output: 'False' },
      fix:   { label: 'integer ns', code: "import os\nopen('f', 'w').close()\nos.utime('f', ns=(0, 1700000000000000000))\nos.stat('f').st_mtime_ns == 1700000000000000000", output: 'True' },
    },
    {
      name: 'Catching every error as "missing"',
      desc: 'stat raises FileNotFoundError for a missing path, but PermissionError and others are real problems. Catch the specific class.',
      wrong: { label: 'except OSError', code: "import os\ntry:\n    os.stat('ghost.txt')\n    state = 'present'\nexcept OSError:\n    state = 'missing?'\nstate", output: "'missing?'" },
      fix:   { label: 'except FileNotFoundError', code: "import os\ntry:\n    os.stat('ghost.txt')\n    state = 'present'\nexcept FileNotFoundError:\n    state = 'missing'\nstate", output: "'missing'" },
    },
  ],

  when: {
    use: [
      'Size, timestamps, type and mode bits of a file in one call',
      'Setting timestamps (utime), e.g. after copying or for tests',
    ],
    avoid: [
      'Only "is it a file / does it exist" → os.path.isfile / exists',
      'Only the size → os.path.getsize (a stat underneath)',
      'Copying metadata between files → shutil.copystat / copy2',
    ],
  },

  notes: {
    cpython:        'stat, lstat, fstat and utime are C functions in Modules/posixmodule.c; stat_result is a struct sequence (a named-tuple-like type) whose first 10 items are the classic POSIX fields',
    'st_ctime':     'Unix: last metadata change. Windows: creation time — deprecated in that meaning since 3.12, which added st_birthtime on Windows',
    'Platform fields': 'st_blocks, st_blksize, st_rdev, st_flags on some Unix systems such as Linux; st_birthtime where available (on Windows since 3.12); st_file_attributes and st_reparse_tag on Windows',
    'Resolution':   'Depends on the file system: ext4 keeps nanoseconds, NTFS 100 ns units (ns=1700000000123456789 reads back as 1700000000123456700), and FAT32 only 2 seconds for st_mtime',
  },

  related: [
    { name: 'os.path.getsize / getmtime', slug: 'getsize', when: 'One field at a time', category: 'stdlib/os-path' },
    { name: 'os.path.exists / isfile', slug: 'exists', when: 'Just the type', category: 'stdlib/os-path' },
    { name: 'Path.stat', slug: 'stat', when: 'The pathlib version', category: 'stdlib/pathlib' },
    { name: 'os.chmod', slug: 'chmod', when: 'Change the mode bits' },
    { name: 'os.listdir / scandir', slug: 'listdir', when: 'DirEntry.stat() while listing' },
  ],

  faq: [
    {
      q: 'How do I get the size of a file in Python?',
      a: "os.stat(path).st_size, or the shortcut os.path.getsize(path) — both in bytes. Path(path).stat().st_size is the pathlib way.",
    },
    {
      q: 'How do I get the last modified time of a file?',
      a: 'os.stat(path).st_mtime (float seconds since the epoch) — convert with datetime.datetime.fromtimestamp(t, tz=datetime.timezone.utc). Use st_mtime_ns for exact integer nanoseconds.',
    },
    {
      q: 'What is the difference between stat, lstat and fstat?',
      a: 'stat follows symlinks and reports on the target; lstat reports on the link itself; fstat takes an open file descriptor instead of a path.',
    },
    {
      q: 'How do I change a file\'s modification time?',
      a: "os.utime(path, (atime, mtime)) with seconds, or ns=(atime_ns, mtime_ns). os.utime(path) with no times sets both to now, like touch.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.stat',
    meta:  'os.stat / lstat / fstat / stat_result / utime',
  },
};
