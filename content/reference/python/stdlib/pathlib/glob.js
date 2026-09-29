// content/reference/python/stdlib/pathlib/glob.js

export const meta = {
  slug:        'glob',
  name:        'Path.glob',
  signature:   'Path.glob(pattern, *, case_sensitive=None, recurse_symlinks=False) / .rglob(pattern, …) / .walk(top_down=True, on_error=None, follow_symlinks=False)',
  blurb:       'Find files by pattern: glob matches relative to the folder (** crosses sub-folders), rglob searches the whole tree, walk yields (folder, dirnames, filenames) like os.walk.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (walk 3.12+)',
  searchTerms: 'Path.glob glob rglob walk Path.rglob Path.walk find files python pathlib recursive glob double star **/*.py list all files recursively os.walk equivalent pattern case_sensitive recurse_symlinks',
};

export const method = {
  slug:      'glob',
  name:      'Path.glob',
  signature: 'Path.glob(pattern, *, case_sensitive=None, recurse_symlinks=False) / .rglob(pattern, …) / .walk(top_down=True, on_error=None, follow_symlinks=False)',
  returns:   { type: 'Iterator[Path] | Iterator[tuple[Path, list[str], list[str]]]', desc: 'glob / rglob yield matching paths; walk yields one triple per folder.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (walk 3.12+)',
  hasLiveDemo: true,

  subtitle: "glob('*.py') looks in this folder only; glob('**/*.py') and rglob('*.py') look everywhere below it. Unlike the glob module, pathlib's * also matches dotfiles and ** is always recursive. Results come in file-system order — sort them.",

  covers: ['Path.glob', 'Path.rglob', 'Path.walk'],

  cheat: {
    commonCall: "sorted(Path('src').rglob('*.py'))",
    returns:    'Path objects under the folder',
    replaces:   'glob.glob(…, recursive=True) and os.walk',
    watchOut:   "unordered; * matches dotfiles; a pattern ending in '/' returns folders only",
  },

  parameters: [
    { name: 'pattern',          type: 'str | PurePath', required: true,  default: null,    desc: 'Relative glob: * ? [seq] within a component, ** for any depth. An absolute or empty pattern is an error.' },
    { name: 'case_sensitive',   type: 'bool | None',    required: false, default: 'None',  desc: '3.12+. None = the platform rule: case-sensitive on POSIX, not on Windows.' },
    { name: 'recurse_symlinks', type: 'bool',           required: false, default: 'False', desc: '3.13+. Follow symlinks to folders when expanding **.' },
    { name: 'top_down',         type: 'bool',           required: false, default: 'True',  desc: 'walk only: yield a folder before its sub-folders; with top_down=True you may prune dirnames in place.' },
    { name: 'on_error',         type: 'callable | None', required: false, default: 'None', desc: 'walk only: called with the OSError when a folder cannot be listed; errors are ignored by default.' },
    { name: 'follow_symlinks',  type: 'bool',           required: false, default: 'False', desc: 'walk only: descend into symlinked folders.' },
  ],

  modes: [
    {
      id: 'glob',
      label: 'glob',
      blurb: "Create a small tree, then glob it from '.'.",
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str',       hint: 'glob pattern',                     input: 'text' },
      ],
      template: "from pathlib import Path\nfor f in {$files}:\n    Path(f).parent.mkdir(parents=True, exist_ok=True)\n    Path(f).touch()\nsorted(p.as_posix() for p in Path('.').glob({$pattern}))",
      cases: [
        { id: 'top',    label: '*.py',         values: { files: 'app.py, .hidden.py, src/core.py, src/lib/util.py, docs/guide.md', pattern: '*.py' } },
        { id: 'deep',   label: '**/*.py',      values: { files: 'app.py, .hidden.py, src/core.py, src/lib/util.py, docs/guide.md', pattern: '**/*.py' } },
        { id: 'one',    label: '*/*',          values: { files: 'app.py, src/core.py, src/lib/util.py, docs/guide.md', pattern: '*/*' } },
        { id: 'dirs',   label: '**/ (folders)', values: { files: 'app.py, src/core.py, src/lib/util.py', pattern: '**/' } },
        { id: 'class',  label: '[ab]*',        values: { files: 'alpha.txt, beta.txt, gamma.txt', pattern: '[ab]*' } },
      ],
    },
    {
      id: 'rglob',
      label: 'rglob',
      blurb: 'rglob(pattern) is glob("**/" + pattern).',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str',       hint: 'pattern for the file name',        input: 'text' },
      ],
      template: "from pathlib import Path\nfor f in {$files}:\n    Path(f).parent.mkdir(parents=True, exist_ok=True)\n    Path(f).touch()\nsorted(p.as_posix() for p in Path('.').rglob({$pattern}))",
      cases: [
        { id: 'py',   label: '*.py',       values: { files: 'app.py, src/core.py, src/lib/util.py, docs/guide.md', pattern: '*.py' } },
        { id: 'name', label: 'exact name', values: { files: 'README.md, src/README.md, docs/intro.md', pattern: 'README.md' } },
        { id: 'all',  label: '*',          values: { files: 'a.txt, sub/b.txt', pattern: '*' } },
      ],
    },
    {
      id: 'walk',
      label: 'walk',
      blurb: 'One (folder, dirnames, filenames) triple per folder, sorted here for a stable display.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
      ],
      template: "from pathlib import Path\nfor f in {$files}:\n    Path(f).parent.mkdir(parents=True, exist_ok=True)\n    Path(f).touch()\nsorted((d.as_posix(), sorted(dirs), sorted(names)) for d, dirs, names in Path('.').walk())",
      cases: [
        { id: 'tree', label: 'small tree', values: { files: 'app.py, src/core.py, src/lib/util.py, docs/guide.md' } },
        { id: 'flat', label: 'flat',       values: { files: 'a.txt, b.txt' } },
      ],
    },
  ],
  demoExplainer: "'*.py' stays in the top folder but still finds '.hidden.py' — pathlib globbing treats dotfiles like any other name. '**' matches zero or more folders, so '**/*.py' finds app.py too. A trailing slash selects folders only ('**/' lists '.' itself and every sub-folder). walk() reports the starting folder as '.', and each triple lists names, not paths.",

  patterns: [
    {
      name: 'All files of a type, recursively',
      desc: 'Sort for reproducible output.',
      code: "from pathlib import Path\nfor path in sorted(Path('data').rglob('*.csv')):\n    process(path)",
    },
    {
      name: 'Several extensions',
      desc: 'glob has no {a,b} alternation; filter on suffix instead.',
      code: "from pathlib import Path\nimages = [p for p in Path('img').rglob('*') if p.suffix.lower() in {'.jpg', '.jpeg', '.png'}]",
    },
    {
      name: 'Prune folders while walking',
      desc: 'With top_down=True, editing dirnames in place skips those sub-trees.',
      code: "from pathlib import Path\nfor folder, dirs, files in Path('.').walk():\n    dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__'}]\n    for name in files:\n        print(folder / name)",
    },
    {
      name: 'Total size of a tree',
      desc: 'rglob plus stat; skip folders.',
      code: "from pathlib import Path\ntotal = sum(p.stat().st_size for p in Path('build').rglob('*') if p.is_file())",
    },
  ],

  examples: [
    { title: 'One folder, by extension',        code: "from pathlib import Path\nfor n in ['a.py', 'b.py', 'c.txt']:\n    Path(n).touch()\nsorted(p.name for p in Path('.').glob('*.py'))", returns: "['a.py', 'b.py']" },
    { title: 'Recursive with **',               code: "from pathlib import Path\nPath('pkg/sub').mkdir(parents=True)\nfor n in ['top.py', 'pkg/a.py', 'pkg/sub/b.py']:\n    Path(n).touch()\nsorted(p.as_posix() for p in Path('.').glob('**/*.py'))", returns: "['pkg/a.py', 'pkg/sub/b.py', 'top.py']" },
    { title: 'rglob is glob("**/…")',           code: "from pathlib import Path\nPath('pkg/sub').mkdir(parents=True)\nfor n in ['top.py', 'pkg/a.py', 'pkg/sub/b.py']:\n    Path(n).touch()\nsorted(Path('.').rglob('*.py')) == sorted(Path('.').glob('**/*.py'))", returns: 'True' },
    { title: 'Dotfiles are matched',            code: "from pathlib import Path\nfor n in ['.env', 'app.cfg']:\n    Path(n).touch()\nsorted(p.name for p in Path('.').glob('*'))", returns: "['.env', 'app.cfg']" },
    { title: 'Folders only (trailing slash)',   code: "from pathlib import Path\nPath('src').mkdir()\nPath('README.md').touch()\n[p.name for p in Path('.').glob('*/')]", returns: "['src']" },
    { title: 'walk yields names per folder',    code: "from pathlib import Path\nPath('docs').mkdir()\nPath('docs/a.md').touch()\nPath('main.py').touch()\nsorted((d.as_posix(), dirs, files) for d, dirs, files in Path('.').walk())", returns: "[('.', ['docs'], ['main.py']), ('docs', [], ['a.md'])]" },
    { title: 'No matches is not an error',      code: "from pathlib import Path\nlist(Path('.').glob('*.nothing'))", returns: '[]' },
    { title: 'Absolute patterns are refused',   code: "from pathlib import Path\nlist(Path('.').glob('/etc/*'))", returns: 'NotImplementedError: Non-relative patterns are unsupported' },
  ],

  pitfalls: [
    {
      name: 'Using a glob result without sorting',
      desc: 'glob yields in directory order, which differs between file systems. Sort before displaying, diffing or processing in order.',
      wrong: { label: 'generator', code: "from pathlib import Path\ntype(Path('.').glob('*')).__name__", output: "'map'" },
      fix:   { label: 'sorted()', code: "from pathlib import Path\nfor n in ['b.txt', 'a.txt']:\n    Path(n).touch()\n[p.name for p in sorted(Path('.').glob('*.txt'))]", output: "['a.txt', 'b.txt']" },
    },
    {
      name: 'Expecting brace alternation',
      desc: "'*.{jpg,png}' is not special in pathlib: the braces are literal characters, so nothing matches.",
      wrong: { label: '{jpg,png}', code: "from pathlib import Path\nfor n in ['a.jpg', 'b.png']:\n    Path(n).touch()\nlist(Path('.').glob('*.{jpg,png}'))", output: '[]' },
      fix:   { label: 'filter suffix', code: "from pathlib import Path\nfor n in ['a.jpg', 'b.png']:\n    Path(n).touch()\nsorted(p.name for p in Path('.').iterdir() if p.suffix in {'.jpg', '.png'})", output: "['a.jpg', 'b.png']" },
    },
    {
      name: 'Consuming the iterator twice',
      desc: 'glob returns a one-shot iterator; the second pass is empty. Store list(...) if you need it again.',
      wrong: { label: 'reuse', code: "from pathlib import Path\nPath('a.txt').touch()\nfound = Path('.').glob('*.txt')\nfirst = list(found)\nlist(found)", output: '[]' },
      fix:   { label: 'list() once', code: "from pathlib import Path\nPath('a.txt').touch()\nfound = list(Path('.').glob('*.txt'))\nlen(found), len(found)", output: '(1, 1)' },
    },
  ],

  when: {
    use: [
      'Finding files by name or extension (glob / rglob)',
      'Walking a tree folder by folder, with pruning (walk, 3.12+)',
    ],
    avoid: [
      'Matching paths you already have → PurePath.full_match',
      'Hidden-file-aware shell semantics → the glob module (glob.glob skips dotfiles by default)',
    ],
  },

  notes: {
    cpython:          'Lib/pathlib/_local.py: glob compiles the pattern into selectors from glob._StringGlobber over os.scandir; rglob prefixes "**"; walk wraps os.walk',
    'vs glob module': 'Dotfiles are not special (like include_hidden=True), ** is always recursive (like recursive=True), and ** does not follow symlinks unless recurse_symlinks=True',
    'Changed in 3.13': 'A pattern ending in ** returns files and folders (folders only before); OSErrors while scanning are suppressed; pattern may be path-like',
    'Changed in 3.11': 'A pattern ending with a separator returns only folders',
    'Case':           'Windows: case-insensitive by default; POSIX: case-sensitive — pass case_sensitive= to force',
  },

  related: [
    { name: 'match / full_match', slug: 'match',   when: 'Same patterns on paths you already have' },
    { name: 'iterdir',            slug: 'iterdir', when: 'Plain one-level listing' },
    { name: 'exists / is_file / is_dir', slug: 'exists', when: 'Filter results' },
    { name: 'sorted()',           slug: 'sorted',  when: 'Stable result order', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I find all files with an extension recursively in Python?',
      a: "sorted(Path('folder').rglob('*.ext')) — or glob('**/*.ext'). Both search every sub-folder.",
    },
    {
      q: 'What is the difference between glob and rglob?',
      a: "rglob(pattern) is glob('**/' + pattern): it matches the pattern in the folder and in every sub-folder. glob matches exactly the levels the pattern describes.",
    },
    {
      q: 'Does Path.glob return hidden files?',
      a: "Yes. In pathlib, * matches names starting with a dot, unlike glob.glob (which needs include_hidden=True).",
    },
    {
      q: 'What does Path.walk return?',
      a: 'An iterator of (dirpath, dirnames, filenames): dirpath is a Path, the other two are lists of names. It is the pathlib version of os.walk, added in Python 3.12.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.glob',
    meta:  'Path.glob / rglob / walk',
  },
};
