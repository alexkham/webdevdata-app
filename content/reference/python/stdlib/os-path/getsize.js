// content/reference/python/stdlib/os-path/getsize.js

export const meta = {
  slug:        'getsize',
  name:        'os.path.getsize',
  signature:   'os.path.getsize(path) / getmtime(path) / getatime(path) / getctime(path)',
  blurb:       'One stat field at a time: the size in bytes, and the modification, access and ctime timestamps as float seconds since the epoch. Missing files raise OSError.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.getsize getsize os.path.getmtime getmtime os.path.getatime getatime os.path.getctime getctime file size in bytes python last modified time creation time timestamp newest file',
};

export const method = {
  slug:      'getsize',
  name:      'os.path.getsize',
  signature: 'os.path.getsize(path) / getmtime(path) / getatime(path) / getctime(path)',
  returns:   { type: 'int | float', desc: 'getsize: int bytes. getmtime / getatime / getctime: float seconds since 1970-01-01 UTC.' },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Each is os.stat(path) and one attribute: st_size, st_mtime, st_atime, st_ctime. Size is in bytes (not characters); getctime means "last metadata change" on Unix but "creation time" on Windows. Unlike exists(), these raise FileNotFoundError for a missing path.',

  covers: ['getsize', 'getmtime', 'getatime', 'getctime'],

  cheat: {
    commonCall: 'os.path.getsize(path)',
    returns:    '1024',
    replaces:   'len(open(path, "rb").read())',
    watchOut:   'getctime is not creation time on Linux/macOS',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike', required: true, default: null, desc: 'An existing file or folder; OSError otherwise.' },
  ],

  modes: [
    {
      id: 'size',
      label: 'getsize',
      blurb: 'Write text as UTF-8 bytes and measure the file.',
      params: [{ name: 'text', type: 'str', hint: 'file content', input: 'text' }],
      template: "import os\nwith open('notes.txt', 'wb') as f:\n    f.write({$text}.encode('utf-8'))\n(os.path.getsize('notes.txt'), len({$text}))",
      cases: [
        { id: 'ascii', label: 'ASCII',    values: { text: 'hello world' } },
        { id: 'utf8',  label: 'non-ASCII', values: { text: 'Grüße, 世界' } },
      ],
    },
    {
      id: 'times',
      label: 'getmtime / getatime',
      blurb: 'Set both timestamps with os.utime, then read them back.',
      params: [
        { name: 'atime', type: 'int', hint: 'access time, epoch seconds',       input: 'number' },
        { name: 'mtime', type: 'int', hint: 'modification time, epoch seconds', input: 'number' },
      ],
      template: "import os\nopen('f.txt', 'w').close()\nos.utime('f.txt', ({$atime}, {$mtime}))\n(os.path.getmtime('f.txt'), os.path.getatime('f.txt'))",
      cases: [
        { id: 'y2k',  label: '2001 / 2023', values: { atime: '1000000000', mtime: '1700000000' } },
        { id: 'zero', label: 'the epoch',   values: { atime: '0', mtime: '0' } },
      ],
    },
  ],
  demoExplainer: "'Grüße, 世界' is 9 characters but 15 bytes: ü and ß take two bytes in UTF-8, each CJK character three. The times come back as floats exactly as set (whole seconds survive the round trip); real modification times usually have a fractional part. getctime is not shown: it cannot be set with utime, and its meaning differs between Windows and Unix.",

  patterns: [
    {
      name: 'Newest file in a folder',
      desc: 'max with getmtime as the key.',
      code: "import os\nnewest = max((os.path.join(folder, n) for n in os.listdir(folder)), key=os.path.getmtime)",
    },
    {
      name: 'Human-readable size',
      desc: 'Divide by 1024 until it fits.',
      code: "import os\ndef human(n):\n    for unit in ('B', 'KiB', 'MiB', 'GiB'):\n        if n < 1024:\n            return f'{n:.0f} {unit}'\n        n /= 1024\n    return f'{n:.1f} TiB'\nhuman(os.path.getsize(path))",
    },
    {
      name: 'Modification time as a datetime',
      desc: 'Pass a timezone to get an aware value.',
      code: "import os, datetime\nmodified = datetime.datetime.fromtimestamp(os.path.getmtime(path), tz=datetime.timezone.utc)",
    },
  ],

  examples: [
    { title: 'Size in bytes',             code: "import os\nwith open('data.bin', 'wb') as f:\n    f.write(b'\\x00' * 1024)\nos.path.getsize('data.bin')", returns: '1024' },
    { title: 'Missing file raises',       code: "import os\ntry:\n    os.path.getsize('missing.bin')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
    { title: 'Read back fixed times',     code: "import os\nopen('f', 'w').close()\nos.utime('f', (1000000000, 1700000000))\n(os.path.getmtime('f'), os.path.getatime('f'))", returns: '(1700000000.0, 1000000000.0)' },
    { title: 'As a UTC datetime',         code: "import os, datetime\nopen('f', 'w').close()\nos.utime('f', (0, 1700000000))\ndatetime.datetime.fromtimestamp(os.path.getmtime('f'), tz=datetime.timezone.utc).isoformat()", returns: "'2023-11-14T22:13:20+00:00'" },
    { title: 'Pick the newer file',       code: "import os\nopen('old', 'w').close()\nopen('new', 'w').close()\nos.utime('old', (0, 1600000000))\nos.utime('new', (0, 1700000000))\nmax(['old', 'new'], key=os.path.getmtime)", returns: "'new'" },
    { title: 'getctime is a float too',   code: "import os\nopen('f', 'w').close()\ntype(os.path.getctime('f')).__name__", returns: "'float'" },
  ],

  pitfalls: [
    {
      name: 'Counting characters instead of bytes',
      desc: 'Text written in text mode on Windows also turns each \\n into \\r\\n, so the same text has two sizes.',
      wrong: { label: 'text mode, platform newlines', code: "import os\nwith open('notes.txt', 'w', encoding='utf-8') as f:\n    f.write('a\\nb\\n')\nos.path.getsize('notes.txt') in (4, 6)", output: 'True' },
      fix:   { label: "newline='\\n' — same everywhere", code: "import os\nwith open('notes.txt', 'w', encoding='utf-8', newline='\\n') as f:\n    f.write('a\\nb\\n')\nos.path.getsize('notes.txt')", output: '4' },
    },
    {
      name: 'Calling getsize on a path that may be missing',
      desc: 'Unlike exists(), getsize raises. Catch FileNotFoundError, or stat once and reuse the result.',
      wrong: { label: 'unguarded', code: "import os\ntry:\n    size = os.path.getsize('maybe.log')\nexcept FileNotFoundError:\n    size = 'raised'\nsize", output: "'raised'" },
      fix:   { label: 'default to 0', code: "import os\ntry:\n    size = os.path.getsize('maybe.log')\nexcept FileNotFoundError:\n    size = 0\nsize", output: '0' },
    },
  ],

  when: {
    use: [
      'One quick fact about a file: its size or modification time',
      'Sorting files by date (key=os.path.getmtime)',
    ],
    avoid: [
      'Several fields → one os.stat call',
      'Creation time on Linux/macOS → st_birthtime where available (os.stat)',
      'pathlib code → Path.stat().st_size / .st_mtime',
    ],
  },

  notes: {
    cpython:    'genericpath: getsize = os.stat(f).st_size, getmtime = .st_mtime, getatime = .st_atime, getctime = .st_ctime',
    'getctime': 'Unix: time of the last metadata change. Windows: creation time',
    'getatime': 'Many systems update access times lazily or not at all (relatime / noatime mounts), so do not rely on it',
    'Folders':  'getsize of a folder is file-system specific (often 4096 on Linux ext4, 0 on Windows NTFS) — it is not the size of the contents',
  },

  related: [
    { name: 'os.stat', slug: 'stat', when: 'All fields in one call', category: 'stdlib/os' },
    { name: 'os.path.exists / isfile', slug: 'exists', when: 'Check before measuring' },
    { name: 'Path.stat', slug: 'stat', when: 'The pathlib version', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I get the size of a file in Python?',
      a: "os.path.getsize(path) returns bytes. Path(path).stat().st_size is the pathlib equivalent.",
    },
    {
      q: 'How do I get the last modified date of a file?',
      a: "os.path.getmtime(path) gives epoch seconds; datetime.datetime.fromtimestamp(t, tz=datetime.timezone.utc) turns it into a datetime.",
    },
    {
      q: 'Is getctime the creation time?',
      a: 'On Windows, yes. On Linux and macOS it is the last metadata change (permissions, owner, rename…). Some systems expose the real creation time as os.stat(path).st_birthtime.',
    },
    {
      q: 'How do I get the total size of a folder?',
      a: "Sum the files: sum(os.path.getsize(os.path.join(r, f)) for r, ds, fs in os.walk(folder) for f in fs). getsize of the folder itself does not do that.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.getsize',
    meta:  'os.path.getsize / getmtime / getatime / getctime',
  },
};
