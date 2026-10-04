// content/reference/python/stdlib/os/listdir.js

export const meta = {
  slug:        'listdir',
  name:        'os.listdir',
  signature:   "os.listdir(path='.') / os.scandir(path='.') → DirEntry",
  blurb:       'List a folder: listdir returns the entry names, scandir returns DirEntry objects that already know whether each entry is a file or a folder.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (scandir, DirEntry 3.5+)',
  searchTerms: 'os.listdir listdir os.scandir scandir DirEntry os.DirEntry list files in directory python list folder contents directory listing is_dir is_file entry.name entry.path files only sorted',
};

export const method = {
  slug:      'listdir',
  name:      'os.listdir',
  signature: "os.listdir(path='.') / os.scandir(path='.') → DirEntry",
  returns:   { type: 'list[str] | iterator of DirEntry', desc: "listdir: the names (no '.' or '..'), in arbitrary order. scandir: an iterator of DirEntry objects (use it in a with block)." },

  category:    'os function',
  version:     'Python 3.0+ (scandir, DirEntry 3.5+)',
  hasLiveDemo: true,

  subtitle: 'listdir gives bare names in no promised order — sort them yourself, and join them with the folder before using them. scandir is faster when you also need to know file vs folder (or the size), because the directory read already returned that information.',

  covers: ['listdir', 'scandir', 'DirEntry'],

  cheat: {
    commonCall: "sorted(os.listdir('data'))",
    returns:    "['a.csv', 'b.csv', 'raw']",
    replaces:   'Shelling out to ls / dir; glob.glob("*") when you want hidden files too',
    watchOut:   'Names only — os.path.isfile(name) checks the current folder, not the listed one',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike | int', required: false, default: "'.'", desc: 'The folder to list. bytes in → bytes names out. An open directory file descriptor also works on Unix.' },
  ],

  modes: [
    {
      id: 'listdir',
      label: 'listdir',
      blurb: 'Create some files (folders appear on the way) and list one folder. sorted() because the order is up to the file system.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'folder', type: 'str',       hint: 'folder to list',                   input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    result = sorted(os.listdir({$folder}))\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'root',   label: 'current folder', values: { files: 'main.py, .env, docs/index.md, docs/api.md', folder: '.' } },
        { id: 'sub',    label: 'sub-folder',     values: { files: 'main.py, .env, docs/index.md, docs/api.md', folder: 'docs' } },
        { id: 'missing', label: 'missing',       values: { files: 'main.py', folder: 'build' } },
      ],
    },
    {
      id: 'scandir',
      label: 'scandir',
      blurb: 'The same folder through scandir: every entry knows its name and whether it is a folder.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'folder', type: 'str',       hint: 'folder to scan',                   input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nwith os.scandir({$folder}) as it:\n    entries = sorted((e.name, e.is_dir()) for e in it)\nentries",
      cases: [
        { id: 'mixed', label: 'files and folders', values: { files: 'main.py, docs/index.md, tests/test_main.py', folder: '.' } },
        { id: 'empty', label: 'only folders',      values: { files: 'a/b/c.txt', folder: 'a' } },
      ],
    },
    {
      id: 'files',
      label: 'files only',
      blurb: 'Keep regular files: join each name with the folder before asking isfile.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'folder', type: 'str',       hint: 'folder to list',                   input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nsorted(n for n in os.listdir({$folder}) if os.path.isfile(os.path.join({$folder}, n)))",
      cases: [
        { id: 'sub', label: 'sub-folder', values: { files: 'src/app.py, src/util.py, src/lib/x.py', folder: 'src' } },
        { id: 'top', label: 'top level',  values: { files: 'README.md, src/app.py', folder: '.' } },
      ],
    },
  ],
  demoExplainer: "listdir includes hidden names such as '.env' (it never adds '.' or '..') and mixes files and folders. A missing folder raises FileNotFoundError — the class is the same everywhere, the message text differs between Linux and Windows. In the files-only tab the names come back without their folder, so os.path.join(folder, n) is essential: isfile('app.py') would look in the current folder and say False.",

  patterns: [
    {
      name: 'Folders only, with scandir',
      desc: 'No extra stat call per entry on most systems.',
      code: "import os\nwith os.scandir(path) as it:\n    subdirs = sorted(e.name for e in it if e.is_dir())",
    },
    {
      name: 'Files by extension',
      desc: 'endswith accepts a tuple.',
      code: "import os\nimages = [n for n in os.listdir(folder) if n.lower().endswith(('.png', '.jpg'))]",
    },
    {
      name: 'Largest files in a folder',
      desc: 'DirEntry.stat() is cached and, on Windows, free.',
      code: "import os\nwith os.scandir(folder) as it:\n    sizes = sorted(((e.stat().st_size, e.name) for e in it if e.is_file()), reverse=True)",
    },
    {
      name: 'Skip hidden entries (POSIX convention)',
      desc: 'Hidden means "starts with a dot" on Linux and macOS.',
      code: "import os\nvisible = [n for n in os.listdir('.') if not n.startswith('.')]",
    },
  ],

  examples: [
    { title: 'Names, sorted',                  code: "import os\nfor name in ['b.txt', 'a.txt']:\n    open(name, 'w').close()\nos.mkdir('sub')\nsorted(os.listdir())", returns: "['a.txt', 'b.txt', 'sub']" },
    { title: 'Hidden files are included',      code: "import os\nopen('.hidden', 'w').close()\nopen('shown', 'w').close()\nsorted(os.listdir('.'))", returns: "['.hidden', 'shown']" },
    { title: 'An empty folder',                code: "import os\nos.mkdir('empty')\nos.listdir('empty')", returns: '[]' },
    { title: 'bytes in, bytes out',            code: "import os\nos.mkdir('data')\nopen('data/a.csv', 'w').close()\nos.listdir(b'data')", returns: "[b'a.csv']" },
    { title: 'scandir: name, is_dir, is_file', code: "import os\nopen('x.py', 'w').close()\nos.mkdir('pkg')\nwith os.scandir('.') as it:\n    entries = sorted((e.name, e.is_dir(), e.is_file()) for e in it)\nentries", returns: "[('pkg', True, False), ('x.py', False, True)]" },
    { title: 'DirEntry.stat() for sizes',      code: "import os\nwith open('big.bin', 'wb') as f:\n    f.write(b'x' * 10)\nwith os.scandir('.') as it:\n    sizes = {e.name: e.stat().st_size for e in it}\nsizes", returns: "{'big.bin': 10}" },
    { title: 'A DirEntry is path-like',        code: "import os\nopen('f.txt', 'w').close()\nwith os.scandir('.') as it:\n    e = next(it)\n(type(e).__name__, isinstance(e, os.PathLike), e.name)", returns: "('DirEntry', True, 'f.txt')" },
    { title: 'Errors carry errno and filename', code: "import os\ntry:\n    os.listdir('missing')\nexcept FileNotFoundError as e:\n    info = (type(e).__name__, e.errno, e.filename)\ninfo", returns: "('FileNotFoundError', 2, 'missing')" },
  ],

  pitfalls: [
    {
      name: 'Using the bare name from listdir',
      desc: 'listdir returns names relative to the listed folder. Without join, isfile/open look in the current folder.',
      wrong: { label: 'isfile(name)', code: "import os\nos.mkdir('d')\nopen('d/a.txt', 'w').close()\n[n for n in os.listdir('d') if os.path.isfile(n)]", output: '[]' },
      fix:   { label: 'isfile(join(folder, name))', code: "import os\nos.mkdir('d')\nopen('d/a.txt', 'w').close()\n[n for n in os.listdir('d') if os.path.isfile(os.path.join('d', n))]", output: "['a.txt']" },
    },
    {
      name: 'Relying on the listing order',
      desc: 'The order depends on the file system (NTFS happens to be alphabetical, ext4 is not). Sort when order matters.',
      wrong: { label: 'listdir order', code: "import os\nfor n in ['c', 'a', 'b']:\n    open(n, 'w').close()\nlen(os.listdir('.'))", output: '3' },
      fix:   { label: 'sorted()', code: "import os\nfor n in ['c', 'a', 'b']:\n    open(n, 'w').close()\nsorted(os.listdir('.'))", output: "['a', 'b', 'c']" },
    },
    {
      name: 'Leaving a scandir iterator open',
      desc: 'An unfinished scandir iterator keeps the directory handle open until it is closed or garbage-collected — then CPython emits "ResourceWarning: unclosed scandir iterator". Closing by hand is easy to forget; use with.',
      wrong: { label: 'manual close()', code: "import os\nopen('a', 'w').close()\nit = os.scandir('.')\nfirst = next(it).name\nit.close()\nfirst", output: "'a'" },
      fix:   { label: 'with os.scandir()', code: "import os\nopen('a', 'w').close()\nwith os.scandir('.') as it:\n    first = next(it).name\nfirst", output: "'a'" },
    },
  ],

  when: {
    use: [
      'One folder, names only → listdir',
      'One folder, and you need is_dir / is_file / sizes → scandir',
    ],
    avoid: [
      'A whole tree → os.walk (or Path.rglob)',
      'Pattern matching (*.csv) → glob.glob or Path.glob',
      'Object paths → Path.iterdir()',
    ],
  },

  notes: {
    cpython:        "Both are C functions in Modules/posixmodule.c (readdir on POSIX, FindFirstFileW / FindNextFileW on Windows); os.walk is built on scandir",
    'DirEntry':     'name, path (folder joined with name, using the OS separator), is_dir(), is_file(), is_symlink(), is_junction() (3.12+), stat(), inode(). Results are cached; Windows already has the stat data from the directory read',
    'scandir':      'Added in 3.5 (PEP 471); context-manager support since 3.6; DirEntry became a public class (os.DirEntry) in 3.6',
  },

  related: [
    { name: 'os.walk',       slug: 'walk',   when: 'Recurse into sub-folders' },
    { name: 'os.path.join',  slug: 'join',   when: 'Turn a listed name into a usable path', category: 'stdlib/os-path' },
    { name: 'os.path.isfile', slug: 'exists', when: 'Files vs folders', category: 'stdlib/os-path' },
    { name: 'Path.iterdir',  slug: 'iterdir', when: 'The pathlib version', category: 'stdlib/pathlib' },
    { name: 'Path.glob',     slug: 'glob',   when: 'Listing by pattern', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I list all files in a directory in Python?',
      a: "sorted(os.listdir(folder)) for names. For files only: [n for n in os.listdir(folder) if os.path.isfile(os.path.join(folder, n))] — or with scandir: [e.name for e in os.scandir(folder) if e.is_file()].",
    },
    {
      q: 'What is the difference between os.listdir and os.scandir?',
      a: 'listdir returns a list of name strings. scandir returns an iterator of DirEntry objects carrying the name, full path and file type from the same directory read, so filtering by type does not need an extra system call per entry.',
    },
    {
      q: 'In what order does os.listdir return files?',
      a: 'Arbitrary — whatever order the file system gives. It is often alphabetical on Windows (NTFS) and is not on Linux. Use sorted() for a stable order.',
    },
    {
      q: 'Does os.listdir include subdirectories?',
      a: "It includes the subfolders' names but not their contents. Use os.walk to go into them.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.listdir',
    meta:  'os.listdir / os.scandir / os.DirEntry',
  },
};
