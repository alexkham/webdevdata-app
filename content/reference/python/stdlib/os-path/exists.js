// content/reference/python/stdlib/os-path/exists.js

export const meta = {
  slug:        'exists',
  name:        'os.path.exists',
  signature:   'os.path.exists(path) / isfile(path) / isdir(path) / islink(path) / lexists(path)',
  blurb:       'Ask the file system about a path: does anything exist there, is it a regular file, a folder, a symlink. They return False — never raise — for missing paths.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.exists exists os.path.isfile isfile os.path.isdir isdir os.path.islink islink os.path.lexists lexists check if file exists python check if directory exists broken symlink race condition',
};

export const method = {
  slug:      'exists',
  name:      'os.path.exists',
  signature: 'os.path.exists(path) / isfile(path) / isdir(path) / islink(path) / lexists(path)',
  returns:   { type: 'bool', desc: 'True or False. Errors (missing path, permission problems, invalid names) give False.' },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'exists is True for anything — file, folder, device; isfile only for regular files; isdir only for folders. They follow symlinks: a link to a missing target is not "existing", but lexists and islink still see the link itself. A checked answer can be stale a moment later; for creating or opening, just try and catch the error.',

  covers: ['exists', 'lexists', 'isfile', 'isdir', 'islink'],

  cheat: {
    commonCall: 'if os.path.isfile(path):',
    returns:    'bool',
    replaces:   'try: os.stat(path) except OSError: …',
    watchOut:   'exists() is True for folders too — use isfile() before reading',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike | int', required: true, default: null, desc: 'The path to check. exists also accepts an open file descriptor (3.3+).' },
  ],

  modes: [
    {
      id: 'check',
      label: 'exists / isfile / isdir',
      blurb: 'Create some files (folders appear on the way), then check several paths.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'checks', type: 'list[str]', hint: 'paths to check, comma-separated',  input: 'csv' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\n[(p, os.path.exists(p), os.path.isfile(p), os.path.isdir(p)) for p in {$checks}]",
      cases: [
        { id: 'proj',  label: 'project',        values: { files: 'README.md, src/app.py', checks: 'README.md, src, src/main.py' } },
        { id: 'dots',  label: '. and ..',       values: { files: 'a/b.txt', checks: '., a/.., a/b.txt' } },
        { id: 'empty', label: 'empty string',   values: { files: 'x.txt', checks: ', x.txt' } },
      ],
    },
  ],
  demoExplainer: "A missing path is (False, False, False) — no exception. A folder exists but is not a file. '.' and 'a/..' are folders too (os.path does not normalize, the OS resolves '..'). The empty string is never an existing path. None of the created files is a symlink, so islink would be False for all of them and lexists would equal exists.",

  patterns: [
    {
      name: 'Read a file if present',
      desc: 'Fine when nothing else touches the file meanwhile.',
      code: "import os\ntext = open(path, encoding='utf-8').read() if os.path.isfile(path) else ''",
    },
    {
      name: 'EAFP: try and handle the error',
      desc: 'No race between check and use.',
      code: "try:\n    with open(path, encoding='utf-8') as f:\n        text = f.read()\nexcept FileNotFoundError:\n    text = ''",
    },
    {
      name: 'Find a broken symlink',
      desc: 'The link is there (lexists) but its target is not (exists).',
      code: "import os\nbroken = os.path.lexists(p) and not os.path.exists(p)",
    },
    {
      name: 'First existing candidate',
      desc: 'A common lookup for config files.',
      code: "import os\ncandidates = ['./app.toml', os.path.expanduser('~/.config/app.toml'), '/etc/app.toml']\nconfig = next((c for c in candidates if os.path.isfile(c)), None)",
    },
  ],

  examples: [
    { title: 'File, folder, missing',      code: "import os\nos.makedirs('src')\nopen('src/app.py', 'w').close()\n[(p, os.path.exists(p), os.path.isfile(p), os.path.isdir(p)) for p in ['src', 'src/app.py', 'src/x.py']]", returns: "[('src', True, False, True), ('src/app.py', True, True, False), ('src/x.py', False, False, False)]" },
    { title: 'A regular file is not a link', code: "import os\nopen('a.txt', 'w').close()\n(os.path.islink('a.txt'), os.path.lexists('a.txt'))", returns: '(False, True)' },
    { title: 'The empty string',           code: "import os\nos.path.exists('')", returns: 'False' },
    { title: 'Invalid names: False, not an error', code: "import os\nos.path.exists('bad\\0name')", returns: 'False' },
    { title: 'An open file descriptor',    code: "import os\nwith open('f.txt', 'w') as fh:\n    fd_ok = os.path.exists(fh.fileno())\nfd_ok", returns: 'True' },
    { title: "The current folder",         code: "import os\nos.path.isdir('.')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Using exists() before reading a file',
      desc: 'A folder of that name passes exists() and then open() fails.',
      wrong: { label: 'exists()', code: "import os\nos.mkdir('data.csv')\nos.path.exists('data.csv')", output: 'True' },
      fix:   { label: 'isfile()', code: "import os\nos.mkdir('data.csv')\nos.path.isfile('data.csv')", output: 'False' },
    },
    {
      name: 'Check-then-create',
      desc: 'Another process can create the folder between the check and mkdir. Let makedirs handle it.',
      wrong: { label: 'exists() + mkdir()', code: "import os\nif not os.path.exists('out'):\n    os.mkdir('out')\nos.path.isdir('out')", output: 'True' },
      fix:   { label: 'makedirs(exist_ok=True)', code: "import os\nos.makedirs('out', exist_ok=True)\nos.path.isdir('out')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Branching on what kind of thing a path is',
      'Filtering listdir results (join the name with the folder first)',
    ],
    avoid: [
      'Guarding open/create/delete → just do it and catch FileNotFoundError / FileExistsError',
      'pathlib code → Path.exists() / is_file() / is_dir() / is_symlink()',
      'Size or time → getsize / getmtime / os.stat',
    ],
  },

  notes: {
    cpython:   'genericpath.exists, isfile and isdir call os.stat and test st_mode; islink and lexists use os.lstat. On Windows, faster C versions in nt are used for some of them',
    'Errors':  'Any OSError or ValueError (e.g. an embedded NUL character) becomes False — including permission errors, so False does not always mean "missing"',
    'Symlinks': 'exists, isfile and isdir follow links; islink and lexists look at the link itself',
  },

  related: [
    { name: 'os.path.getsize / getmtime', slug: 'getsize', when: 'Size and timestamps' },
    { name: 'os.path.ismount / isjunction', slug: 'ismount', when: 'Mount points and junctions' },
    { name: 'os.stat', slug: 'stat', when: 'All metadata in one call', category: 'stdlib/os' },
    { name: 'Path.exists / is_file / is_dir', slug: 'exists', when: 'The pathlib versions', category: 'stdlib/pathlib' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'The EAFP alternative', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I check if a file exists in Python?',
      a: "os.path.isfile(path) — True only for an existing regular file. os.path.exists(path) is also True for folders. With pathlib: Path(path).is_file().",
    },
    {
      q: 'What is the difference between os.path.exists and os.path.isfile?',
      a: 'exists is True for any existing path (file, folder, device, socket). isfile is True only for regular files — or symlinks pointing to one.',
    },
    {
      q: 'Why does os.path.exists return False for a file that is there?',
      a: 'It follows symlinks (a broken link gives False), and any error is reported as False — for example a permission problem on a parent folder, or a relative path checked from a different working directory than you think.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.exists',
    meta:  'os.path.exists / lexists / isfile / isdir / islink',
  },
};
