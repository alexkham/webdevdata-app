// content/reference/python/stdlib/os/walk.js

export const meta = {
  slug:        'walk',
  name:        'os.walk',
  signature:   'os.walk(top, topdown=True, onerror=None, followlinks=False) / os.fwalk(top=".", topdown=True, onerror=None, *, follow_symlinks=False, dir_fd=None)',
  blurb:       'Walk a directory tree: one (folder, sub-folder names, file names) triple per directory. Edit the sub-folder list in place to choose where it goes next.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (fwalk 3.3+, Unix)',
  searchTerms: 'os.walk walk os.fwalk fwalk recursive directory listing python walk directory tree all files in folder and subfolders dirpath dirnames filenames topdown prune skip directory onerror followlinks',
};

export const method = {
  slug:      'walk',
  name:      'os.walk',
  signature: 'os.walk(top, topdown=True, onerror=None, followlinks=False) / os.fwalk(top=".", topdown=True, onerror=None, *, follow_symlinks=False, dir_fd=None)',
  returns:   { type: 'generator of (str, list[str], list[str])', desc: '(dirpath, dirnames, filenames) for every folder; fwalk adds a fourth item, dirfd.' },

  category:    'os function',
  version:     'Python 3.0+ (fwalk 3.3+, Unix)',
  hasLiveDemo: true,

  subtitle: 'For each folder, os.walk yields its path and two lists of plain names. Join names with the folder path yourself. With the default topdown=True you can sort or prune the dirnames list in place, and the walk follows your edit.',

  covers: ['walk', 'fwalk'],

  cheat: {
    commonCall: 'for root, dirs, files in os.walk(top):',
    returns:    'a generator of (root, dirs, files)',
    replaces:   'Hand-written recursion over listdir',
    watchOut:   'Prune with dirs[:] = … (in place); dirs = … does nothing',
  },

  parameters: [
    { name: 'top',         type: 'str | PathLike', required: true,  default: null,    desc: 'The folder to start from. Every dirpath begins with it (as given — relative stays relative).' },
    { name: 'topdown',     type: 'bool',     required: false, default: 'True',  desc: 'True: a folder is yielded before its sub-folders (and you can prune). False: after them — useful for deleting bottom-up.' },
    { name: 'onerror',     type: 'callable', required: false, default: 'None',  desc: 'Called with the OSError when a folder cannot be listed. By default errors are silently ignored — even a missing top.' },
    { name: 'followlinks', type: 'bool',     required: false, default: 'False', desc: 'Descend into symlinked folders. Off by default to avoid loops.' },
  ],

  modes: [
    {
      id: 'tree',
      label: 'walk a tree',
      blurb: 'Create some files, then walk from the current folder. dirs.sort() makes the order reproducible; root uses / on every OS.',
      params: [{ name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' }],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntree = []\nfor root, dirs, files in os.walk('.'):\n    dirs.sort()\n    tree.append((root.replace(os.sep, '/'), dirs, sorted(files)))\ntree",
      cases: [
        { id: 'project', label: 'small project', values: { files: 'README.md, src/app.py, src/lib/util.py, tests/test_app.py' } },
        { id: 'flat',    label: 'flat',          values: { files: 'a.txt, b.txt' } },
      ],
    },
    {
      id: 'prune',
      label: 'skip a folder',
      blurb: 'Remove a name from dirs (in place) and os.walk never enters that folder.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'skip',  type: 'str',       hint: 'folder name to skip',              input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nfound = []\nfor root, dirs, files in os.walk('.'):\n    dirs[:] = sorted(d for d in dirs if d != {$skip})\n    found += [os.path.join(root, f).replace(os.sep, '/') for f in sorted(files)]\nfound",
      cases: [
        { id: 'nm',   label: 'node_modules', values: { files: 'index.js, lib/a.js, node_modules/pkg/index.js', skip: 'node_modules' } },
        { id: 'git',  label: '.git',         values: { files: 'main.py, .git/HEAD, .git/refs/main, docs/guide.md', skip: '.git' } },
        { id: 'none', label: 'nothing',      values: { files: 'main.py, docs/guide.md', skip: 'build' } },
      ],
    },
  ],
  demoExplainer: "root starts with the top you passed ('.') and grows with os.path.join, which uses \\ on Windows — hence .replace(os.sep, '/') for one result on every OS. Each folder appears once, before its sub-folders (topdown=True), and only after dirs.sort() is the visiting order reproducible: the raw order comes from the file system. In the second tab, assigning to dirs[:] changes the very list os.walk is about to descend into, so node_modules or .git is never opened.",

  patterns: [
    {
      name: 'Every file with its full path',
      desc: 'The classic loop.',
      code: "import os\nfor root, dirs, files in os.walk('project'):\n    for name in files:\n        path = os.path.join(root, name)\n        print(path)",
    },
    {
      name: 'Skip hidden and vendor folders',
      desc: 'Prune in place, before the walk descends.',
      code: "import os\nSKIP = {'.git', 'node_modules', '__pycache__', '.venv'}\nfor root, dirs, files in os.walk('.'):\n    dirs[:] = [d for d in dirs if d not in SKIP]",
    },
    {
      name: 'Delete a tree bottom-up',
      desc: 'Files first, then the emptied folders (shutil.rmtree does the same).',
      code: "import os\nfor root, dirs, files in os.walk(top, topdown=False):\n    for name in files:\n        os.remove(os.path.join(root, name))\n    for name in dirs:\n        os.rmdir(os.path.join(root, name))",
    },
    {
      name: 'Report unreadable folders',
      desc: 'onerror receives the OSError instead of silently skipping.',
      code: "import os\nfor root, dirs, files in os.walk('/var', onerror=lambda e: print('skipped:', e.filename)):\n    pass",
    },
  ],

  examples: [
    { title: 'One triple per folder',        code: "import os\nos.makedirs('a/b/c')\n[(root.replace(os.sep, '/'), dirs, files) for root, dirs, files in os.walk('a')]", returns: "[('a', ['b'], []), ('a/b', ['c'], []), ('a/b/c', [], [])]" },
    { title: 'Full paths of all files',      code: "import os\nos.makedirs('a/b')\nopen('a/b/f.txt', 'w').close()\npaths = []\nfor root, dirs, files in os.walk('a'):\n    for name in files:\n        paths.append(os.path.join(root, name).replace(os.sep, '/'))\npaths", returns: "['a/b/f.txt']" },
    { title: 'Count files in a tree',        code: "import os\nos.makedirs('a/b')\nfor i in range(3):\n    open(f'a/b/{i}.txt', 'w').close()\nsum(len(files) for _, _, files in os.walk('a'))", returns: '3' },
    { title: 'Bottom-up: deepest first',     code: "import os\nos.makedirs('a/b/c')\n[root.replace(os.sep, '/') for root, dirs, files in os.walk('a', topdown=False)]", returns: "['a/b/c', 'a/b', 'a']" },
    { title: 'A missing top yields nothing', code: "import os\nlist(os.walk('does-not-exist'))", returns: '[]' },
    { title: '…unless you pass onerror',     code: "import os\nerrors = []\nlist(os.walk('does-not-exist', onerror=errors.append))\ntype(errors[0]).__name__", returns: "'FileNotFoundError'" },
    { title: 'It is a lazy generator',       code: "import os\ntype(os.walk('.')).__name__", returns: "'generator'" },
  ],

  pitfalls: [
    {
      name: 'Rebinding dirs instead of editing it',
      desc: 'dirs = [...] makes a new local list; os.walk still descends into the old one. Mutate it: dirs[:] = …, dirs.remove(…), dirs.clear().',
      wrong: { label: 'dirs = []', code: "import os\nos.makedirs('t/x')\nos.makedirs('t/y')\nseen = []\nfor root, dirs, files in os.walk('t'):\n    dirs = []\n    seen.append(root.replace(os.sep, '/'))\nsorted(seen)", output: "['t', 't/x', 't/y']" },
      fix:   { label: 'dirs.clear()', code: "import os\nos.makedirs('t/x')\nos.makedirs('t/y')\nseen = []\nfor root, dirs, files in os.walk('t'):\n    dirs.clear()\n    seen.append(root.replace(os.sep, '/'))\nseen", output: "['t']" },
    },
    {
      name: 'Forgetting to join with root',
      desc: 'files holds bare names. Opening or sizing them without root looks in the current folder.',
      wrong: { label: 'bare name', code: "import os\nos.makedirs('a/b')\nopen('a/b/x.txt', 'w').close()\n[f for root, dirs, files in os.walk('a') for f in files if os.path.isfile(f)]", output: '[]' },
      fix:   { label: 'os.path.join(root, f)', code: "import os\nos.makedirs('a/b')\nopen('a/b/x.txt', 'w').close()\n[f for root, dirs, files in os.walk('a') for f in files if os.path.isfile(os.path.join(root, f))]", output: "['x.txt']" },
    },
    {
      name: 'Expecting an error for a missing folder',
      desc: 'os.walk swallows listing errors by default, so a typo in top quietly yields nothing.',
      wrong: { label: 'silent', code: "import os\nlist(os.walk('srcc'))", output: '[]' },
      fix:   { label: 'onerror=raise', code: "import os\ndef fail(e):\n    raise e\ntry:\n    list(os.walk('srcc', onerror=fail))\nexcept FileNotFoundError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
    },
  ],

  when: {
    use: [
      'Visiting every folder of a tree, with control over where to descend',
      'Bottom-up processing (topdown=False), e.g. cleaning up',
    ],
    avoid: [
      'Only matching files by pattern → glob.glob("**/*.py", recursive=True) or Path.rglob',
      'Deleting a tree → shutil.rmtree; copying one → shutil.copytree',
      'One folder only → os.scandir',
    ],
  },

  notes: {
    cpython:     'Pure Python in Lib/os.py on top of os.scandir, with an explicit stack instead of recursion (3.12 and 3.13), so very deep trees do not hit the recursion limit',
    'Order':     'Folders and files come in scandir order, which the file system decides. Sort dirs in place for a deterministic walk',
    'fwalk':     'Unix only (3.3+): like walk but also yields a directory file descriptor and is safe against symlink races; use the dirfd with dir_fd= arguments',
    'Path.walk': 'pathlib.Path.walk (3.12+) is the same algorithm returning Path objects',
  },

  related: [
    { name: 'os.listdir / scandir', slug: 'listdir', when: 'One folder at a time' },
    { name: 'os.path.join', slug: 'join', when: 'root + name', category: 'stdlib/os-path' },
    { name: 'Path.glob / rglob / walk', slug: 'glob', when: 'The pathlib versions', category: 'stdlib/pathlib' },
    { name: 'os.makedirs / removedirs', slug: 'makedirs', when: 'Create and remove folders' },
  ],

  faq: [
    {
      q: 'How do I get all files in a directory and its subdirectories?',
      a: "[os.path.join(root, f) for root, dirs, files in os.walk(top) for f in files] — or with pathlib, [p for p in Path(top).rglob('*') if p.is_file()].",
    },
    {
      q: 'How do I exclude a directory from os.walk?',
      a: "Inside the loop, mutate the dirs list in place: dirs[:] = [d for d in dirs if d != 'node_modules']. This only works with topdown=True (the default).",
    },
    {
      q: 'In what order does os.walk visit folders?',
      a: 'Top-down by default: a folder, then its sub-folders depth-first, in the order the file system lists them. Call dirs.sort() in the loop for alphabetical order; pass topdown=False to get the deepest folders first.',
    },
    {
      q: 'Why does os.walk return nothing?',
      a: 'The top folder does not exist or cannot be read — os.walk ignores errors unless you pass onerror. Check the path, or pass an onerror callback that raises or logs.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.walk',
    meta:  'os.walk / os.fwalk',
  },
};
