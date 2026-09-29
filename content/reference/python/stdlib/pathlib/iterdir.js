// content/reference/python/stdlib/pathlib/iterdir.js

export const meta = {
  slug:        'iterdir',
  name:        'Path.iterdir',
  signature:   'Path.iterdir()',
  blurb:       'Iterate over the entries of a directory — files and sub-folders, one level deep, as Path objects, in arbitrary order.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'Path.iterdir iterdir list directory python pathlib listdir list files in folder directory contents only files only folders sorted order',
};

export const method = {
  slug:      'iterdir',
  name:      'Path.iterdir',
  signature: 'Path.iterdir()',
  returns:   { type: 'Iterator[Path]', desc: 'One Path per entry: self / name. "." and ".." are never included.' },

  category:    'pathlib method',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: "iterdir() is os.listdir() that hands you Path objects already joined to the folder. It does not recurse and the order is whatever the OS returns — sort it when order matters.",

  covers: ['Path.iterdir'],

  cheat: {
    commonCall: "sorted(p for p in Path('.').iterdir() if p.is_file())",
    returns:    'an iterator of Path objects',
    replaces:   'os.listdir + os.path.join',
    watchOut:   'arbitrary order; not recursive (use rglob or walk)',
  },

  parameters: [],

  modes: [
    {
      id: 'list',
      label: 'list a folder',
      blurb: 'Create some files, then list one folder. Entries come back joined to the folder you listed.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'folder', type: 'str',       hint: 'folder to list',                   input: 'text' },
      ],
      template: "from pathlib import Path\nfor f in {$files}:\n    Path(f).parent.mkdir(parents=True, exist_ok=True)\n    Path(f).touch()\nsorted(p.as_posix() for p in Path({$folder}).iterdir())",
      cases: [
        { id: 'root',  label: 'current folder', values: { files: 'main.py, README.md, src/util.py, src/core.py', folder: '.' } },
        { id: 'sub',   label: 'sub-folder',     values: { files: 'main.py, README.md, src/util.py, src/core.py', folder: 'src' } },
      ],
    },
  ],
  demoExplainer: "Listing '.' gives bare names ('src', not './src'), while listing 'src' gives 'src/util.py': each entry is the listed path joined with the name. Only one level is returned — 'src' appears as a folder, its files do not. Type a folder that does not exist and you get FileNotFoundError straight from the iterdir() call — in 3.13 the directory is read eagerly with os.scandir before any Path is returned. (The demo shows the Linux wording; Windows words the same error as [WinError 3].)",

  patterns: [
    {
      name: 'Only files, sorted by name',
      desc: 'Filter with is_file(); sort because the OS order is arbitrary.',
      code: "from pathlib import Path\nfiles = sorted(p for p in Path('inbox').iterdir() if p.is_file())",
    },
    {
      name: 'Newest file in a folder',
      desc: 'Compare modification times.',
      code: "from pathlib import Path\nlatest = max(Path('backups').iterdir(), key=lambda p: p.stat().st_mtime)",
    },
    {
      name: 'Sub-folders only',
      desc: 'is_dir() filters directories.',
      code: "from pathlib import Path\nprojects = [p.name for p in Path('~/code').expanduser().iterdir() if p.is_dir()]",
    },
    {
      name: 'Check whether a folder is empty',
      desc: 'Stop at the first entry instead of listing everything.',
      code: "from pathlib import Path\nis_empty = next(Path('queue').iterdir(), None) is None",
    },
  ],

  examples: [
    { title: 'Names in a folder',              code: "from pathlib import Path\nfor n in ['b.txt', 'a.txt']:\n    Path(n).touch()\nsorted(p.name for p in Path('.').iterdir())", returns: "['a.txt', 'b.txt']" },
    { title: 'Entries are joined to the folder', code: "from pathlib import Path\nPath('src').mkdir()\nPath('src/app.py').touch()\n[p.as_posix() for p in Path('src').iterdir()]", returns: "['src/app.py']" },
    { title: 'Folders are listed, not entered', code: "from pathlib import Path\nPath('pkg/sub').mkdir(parents=True)\nPath('pkg/sub/deep.py').touch()\n[p.name for p in Path('pkg').iterdir()]", returns: "['sub']" },
    { title: 'Only files',                     code: "from pathlib import Path\nPath('docs').mkdir()\nPath('notes.md').touch()\n[p.name for p in Path('.').iterdir() if p.is_file()]", returns: "['notes.md']" },
    { title: 'Count entries',                  code: "from pathlib import Path\nfor n in ['a', 'b', 'c']:\n    Path(n).touch()\nsum(1 for _ in Path('.').iterdir())", returns: '3' },
    { title: 'Iterating a file fails',         code: "from pathlib import Path\nPath('a.txt').touch()\ntry:\n    list(Path('a.txt').iterdir())\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'NotADirectoryError'" },
  ],

  pitfalls: [
    {
      name: 'Comparing entries with strings',
      desc: "iterdir() yields Path objects, and a Path never equals a str. Compare p.name or p.as_posix() — and sort, because the listing order differs between file systems.",
      wrong: { label: 'Path == str', code: "from pathlib import Path\nPath('src').mkdir()\nPath('src/app.py').touch()\n'src/app.py' in list(Path('src').iterdir())", output: 'False' },
      fix:   { label: 'as_posix()', code: "from pathlib import Path\nPath('src').mkdir()\nPath('src/app.py').touch()\n'src/app.py' in sorted(p.as_posix() for p in Path('src').iterdir())", output: 'True' },
    },
    {
      name: 'Expecting a recursive listing',
      desc: 'iterdir() is one level. Use rglob("*") for everything below, or walk() for a folder-by-folder view.',
      wrong: { label: 'iterdir', code: "from pathlib import Path\nPath('a/b').mkdir(parents=True)\nPath('a/b/c.txt').touch()\nsorted(p.as_posix() for p in Path('a').iterdir())", output: "['a/b']" },
      fix:   { label: "rglob('*')", code: "from pathlib import Path\nPath('a/b').mkdir(parents=True)\nPath('a/b/c.txt').touch()\nsorted(p.as_posix() for p in Path('a').rglob('*'))", output: "['a/b', 'a/b/c.txt']" },
    },
    {
      name: 'Forgetting that dotfiles are included',
      desc: 'iterdir() returns every entry, hidden ones too. Filter names that start with a dot yourself.',
      wrong: { label: 'everything', code: "from pathlib import Path\nfor n in ['.env', 'app.py']:\n    Path(n).touch()\nsorted(p.name for p in Path('.').iterdir())", output: "['.env', 'app.py']" },
      fix:   { label: 'skip dotfiles', code: "from pathlib import Path\nfor n in ['.env', 'app.py']:\n    Path(n).touch()\nsorted(p.name for p in Path('.').iterdir() if not p.name.startswith('.'))", output: "['app.py']" },
    },
  ],

  when: {
    use: [
      'Listing one folder (files and sub-folders)',
      'Cheap emptiness checks with next(…, None)',
    ],
    avoid: [
      'Recursive listings → rglob / walk',
      'Filtering by pattern → glob("*.csv")',
    ],
  },

  notes: {
    cpython:    'Lib/pathlib/_local.py (3.13): collects entry.path from os.scandir(str(self)) before returning, strips a leading "./" when listing ".", and builds each Path with with_segments',
    'Errors':   'FileNotFoundError for a missing folder, NotADirectoryError for a file — raised by the iterdir() call itself (3.13 scans the directory before returning)',
    'Order':    'Arbitrary: whatever order the file system returns, which differs between file systems and machines — never rely on it',
  },

  related: [
    { name: 'glob / rglob / walk', slug: 'glob',   when: 'Patterns and recursion' },
    { name: 'exists / is_file / is_dir', slug: 'exists', when: 'Filter entries' },
    { name: 'sorted()', slug: 'sorted', when: 'Stable order', category: 'functions' },
    { name: 'NotADirectoryError', slug: 'notadirectoryerror', when: 'iterdir() on a file', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I list all files in a directory with pathlib?',
      a: "[p for p in Path(folder).iterdir() if p.is_file()] for one level; Path(folder).rglob('*') for every file and folder underneath.",
    },
    {
      q: 'In what order does iterdir return files?',
      a: 'In arbitrary, file-system-dependent order. Wrap it in sorted() — Path objects sort by their parts.',
    },
    {
      q: 'What is the difference between iterdir and glob("*")?',
      a: 'Both list one level. glob("*") can filter by pattern and skips nothing either (dotfiles included); iterdir is the plain listing.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.iterdir',
    meta:  'Path.iterdir',
  },
};
