// content/reference/python/stdlib/glob/index.js — the glob module hub

export const meta = {
  slug:        'index',
  name:        'glob',
  signature:   'import glob',
  blurb:       'Find files and folders whose paths match a shell-style pattern — *.txt, data/*/2024-??.csv, **/*.py with recursive=True — as a list (glob), lazily (iglob), or as a regex (translate).',
  category:    'files',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'glob module python find files by pattern list files matching *.txt wildcard recursive ** subdirectories hidden files include_hidden root_dir iglob escape translate glob.glob sorted order windows backslash',
};

export const method = {
  slug: 'index',
  name: 'glob',

  category:    'File names',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'glob.glob(pattern) lists the paths that exist and match, using the shell rules: * and ? stay inside one folder, names starting with a dot are skipped unless the pattern starts with a dot, and ** means "any depth" only with recursive=True. The order is whatever the file system returns — sort it.',

  imports: ['import glob', 'from glob import glob, iglob, escape'],
  facts: [
    { label: 'Public API', value: 'glob, iglob, escape, translate (3.13+)' },
    { label: 'Order',      value: 'Directory order of the file system — differs between Windows, Linux and macOS. Always sorted(glob.glob(...)) when order matters' },
    { label: 'Hidden',     value: "* and ? do not match a leading dot; '.*' does. include_hidden=True (3.11+) lets wildcards match dot names" },
    { label: 'Separators', value: "Paths are joined with os.path.join, so on Windows results use backslashes ('sub\\\\a.txt'); the part of the pattern without wildcards is returned as written" },
    { label: 'Engine',     value: 'Lib/glob.py: os.scandir for each folder plus fnmatch.filter for each wildcard segment; no shell is started, no ~ or $VAR expansion' },
  ],

  modes: [
    {
      id: 'glob',
      label: 'glob',
      blurb: 'Create the files, then glob. The demo runs on a virtual Linux folder; sorting and replace(os.sep, "/") make the output the same on every OS.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'glob pattern', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob({$pattern}))",
      cases: [
        { id: 'txt',    label: '*.txt',        values: { files: 'a.txt, b.txt, c.py, .hidden.txt', pattern: '*.txt' } },
        { id: 'level',  label: '*/*.py',       values: { files: 'app.py, src/main.py, src/util.py, tests/test_main.py', pattern: '*/*.py' } },
        { id: 'dot',    label: '.*',           values: { files: 'a.txt, .env, .gitignore', pattern: '.*' } },
        { id: 'digits', label: '[0-9].*',      values: { files: '1.gif, 2.txt, card.gif', pattern: '[0-9].*' } },
        { id: 'dirs',   label: 'trailing /',   values: { files: 'notes.txt, docs/a.md, src/b.py', pattern: '*/' } },
      ],
    },
    {
      id: 'recursive',
      label: '** recursive',
      blurb: 'With recursive=True, ** matches zero or more folders.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'glob pattern with **', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob({$pattern}, recursive=True))",
      cases: [
        { id: 'py',     label: '**/*.py',  values: { files: 'app.py, src/main.py, src/lib/util.py, .venv/x.py', pattern: '**/*.py' } },
        { id: 'all',    label: '**',       values: { files: 'a.txt, sub/b.txt, sub/deep/c.txt', pattern: '**' } },
        { id: 'folders', label: '**/',     values: { files: 'a.txt, sub/b.txt, sub/deep/c.txt', pattern: '**/' } },
      ],
    },
    {
      id: 'escape',
      label: 'escape',
      blurb: 'Make every * ? [ in a name literal.',
      params: [{ name: 'name', type: 'str', hint: 'a path that may contain * ? [', input: 'text' }],
      template: 'import glob\nglob.escape({$name})',
      cases: [
        { id: 'br',  label: 'data[1].txt',    values: { name: 'data[1].txt' } },
        { id: 'q',   label: 'Quo vadis?.txt', values: { name: 'Quo vadis?.txt' } },
        { id: 'dir', label: 'in a folder',    values: { name: 'reports/*final*.pdf' } },
      ],
    },
  ],
  demoExplainer: "*.txt skips .hidden.txt: a name that starts with a dot is only matched when the pattern segment starts with a dot too ('.*'). */*.py goes exactly one folder deep, so app.py is not in it. A pattern ending in / returns only folders, with the slash kept. With recursive=True, **/*.py also finds app.py at the top (** may be zero folders) but still skips the hidden .venv folder; ** alone lists everything below the current folder except dot names.",

  patterns: [
    {
      name: 'Process files in a stable order',
      desc: 'glob returns directory order; sort for reproducible runs.',
      code: "import glob\nfor path in sorted(glob.glob('data/*.csv')):\n    process(path)",
    },
    {
      name: 'All Python files below a folder',
      desc: '** only recurses with recursive=True; root_dir keeps the results relative to that folder.',
      code: "import glob\nmodules = glob.glob('**/*.py', root_dir='src', recursive=True)",
    },
    {
      name: 'Match a name that contains [ or ?',
      desc: 'Escape the literal part, keep your own wildcards outside it.',
      code: "import glob, os\nfolder = 'reports [2024]'\nfiles = glob.glob(os.path.join(glob.escape(folder), '*.pdf'))",
    },
    {
      name: 'Home folder and environment variables',
      desc: 'glob does no ~ or $VAR expansion — expand first.',
      code: "import glob, os\npattern = os.path.expanduser('~/Downloads/*.zip')\nzips = glob.glob(pattern)",
    },
  ],

  examples: [
    { title: 'Files with an extension', code: "import glob\nfor name in ['1.gif', '2.txt', 'card.gif']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(glob.glob('*.gif'))", returns: "['1.gif', 'card.gif']" },
    { title: '? is exactly one character', code: "import glob\nfor name in ['1.gif', '2.txt', 'card.gif']:\n    open(name, 'w', encoding='utf-8').close()\nglob.glob('?.gif')", returns: "['1.gif']" },
    { title: 'Recursive **', code: "import glob, os\nos.makedirs('sub')\nfor name in ['2.txt', 'sub/3.txt']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('**/*.txt', recursive=True))", returns: "['2.txt', 'sub/3.txt']" },
    { title: 'Dot files need a dot in the pattern', code: "import glob\nfor name in ['card.gif', '.card.gif']:\n    open(name, 'w', encoding='utf-8').close()\nglob.glob('*.gif'), glob.glob('.c*')", returns: "(['card.gif'], ['.card.gif'])" },
    { title: 'Nothing matches → empty list', code: "import glob\nglob.glob('*.missing')", returns: '[]' },
    { title: 'Escape special characters', code: "import glob\nglob.escape('Quo vadis?.txt')", returns: "'Quo vadis[?].txt'" },
    { title: 'Pattern → regex (3.13+)', code: "import glob\nglob.translate('**/*.txt', recursive=True, include_hidden=True, seps='/')", returns: "'(?s:(?:.+/)?[^/]*\\\\.txt)\\\\Z'" },
  ],

  pitfalls: [
    {
      name: 'Using ** without recursive=True',
      desc: 'Without the flag, ** is just * — exactly one folder level, so top-level files and deeper files are missed.',
      wrong: { label: 'no flag', code: "import glob, os\nos.makedirs('sub/deep')\nfor name in ['a.txt', 'sub/b.txt', 'sub/deep/c.txt']:\n    open(name, 'w', encoding='utf-8').close()\n[p.replace(os.sep, '/') for p in glob.glob('**/*.txt')]", output: "['sub/b.txt']" },
      fix:   { label: 'recursive=True', code: "import glob, os\nos.makedirs('sub/deep')\nfor name in ['a.txt', 'sub/b.txt', 'sub/deep/c.txt']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('**/*.txt', recursive=True))", output: "['a.txt', 'sub/b.txt', 'sub/deep/c.txt']" },
    },
    {
      name: 'Missing dot files',
      desc: "* never matches a name that starts with a dot. Pass include_hidden=True (3.11+) or add a '.*' pattern.",
      wrong: { label: "'*'", code: "import glob\nfor name in ['.env', 'app.py']:\n    open(name, 'w', encoding='utf-8').close()\nglob.glob('*')", output: "['app.py']" },
      fix:   { label: 'include_hidden', code: "import glob\nfor name in ['.env', 'app.py']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(glob.glob('*', include_hidden=True))", output: "['.env', 'app.py']" },
    },
    {
      name: 'A file name with brackets',
      desc: '[1] is a character class that matches the single character 1, so the literal name is not found. glob.escape fixes it.',
      wrong: { label: 'raw name', code: "import glob\nopen('data[1].csv', 'w', encoding='utf-8').close()\nglob.glob('data[1].csv')", output: '[]' },
      fix:   { label: 'glob.escape', code: "import glob\nopen('data[1].csv', 'w', encoding='utf-8').close()\nglob.glob(glob.escape('data[1].csv'))", output: "['data[1].csv']" },
    },
  ],

  when: {
    use: [
      'Collecting input files by name pattern: logs/*.log, data/2024-*.csv',
      'Recursive searches by extension with **/*.ext',
      'Scripts that want plain strings rather than Path objects',
    ],
    avoid: [
      'You want Path objects → pathlib.Path.glob / rglob',
      'Filtering names you already have → fnmatch.filter',
      'Conditions a pattern cannot express (size, date, content) → os.walk or os.scandir',
    ],
  },

  notes: {
    cpython:       'Lib/glob.py — pure Python: os.path.split the pattern, glob the folder part recursively, list each folder with os.scandir and keep names with fnmatch.filter. Errors while listing (missing folder, permission denied) are swallowed',
    'Case':        'Matching uses fnmatch.filter, which ignores case on Windows and respects it on Linux and macOS',
    'Deprecated':  'The undocumented helpers glob.glob0 and glob.glob1 warn since 3.13 (DeprecationWarning, removal announced for 3.15) — use glob.glob(pattern, root_dir=folder)',
    'Duplicates':  'With recursive=True a pattern containing ** more than once can return the same path several times',
  },

  related: [
    { name: 'fnmatch module', slug: 'fnmatch', when: 'The same wildcards on strings you already have', category: 'stdlib' },
    { name: 'pathlib module', slug: 'pathlib', when: 'Path.glob and Path.rglob return Path objects', category: 'stdlib' },
    { name: 'os module',      slug: 'os',      when: 'listdir, scandir and walk', category: 'stdlib' },
    { name: 'os.walk',        slug: 'walk',    when: 'Visit every folder with your own conditions', category: 'stdlib/os' },
    { name: 'sorted()',       slug: 'sorted',  when: 'Put glob results in a stable order', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I find all files with a given extension in Python?',
      a: "In one folder: glob.glob('*.csv'). In that folder and every subfolder: glob.glob('**/*.csv', recursive=True). Sort the result if you need a stable order, and note that names starting with a dot are skipped unless you pass include_hidden=True (3.11+).",
    },
    {
      q: 'Why are glob results not sorted?',
      a: 'glob returns names in the order the operating system lists the folder (os.scandir). That order differs between file systems — wrap the call in sorted() when it matters.',
    },
    {
      q: 'Why does glob not find hidden files?',
      a: "By the Unix shell rule, * and ? do not match a leading dot. A pattern segment that starts with a dot ('.*', '.config/*') does match them, and include_hidden=True (3.11+) lets every wildcard, including **, match dot names.",
    },
    {
      q: 'What is the difference between glob.glob and pathlib.Path.glob?',
      a: 'glob.glob returns strings and needs recursive=True for **; Path.glob returns Path objects and always treats ** as recursive. Path.glob also matches hidden files by default — the glob docs point out that dot files are special for glob.glob but not for pathlib.Path.glob.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/glob.html',
    meta:  'glob — Unix style pathname pattern expansion',
  },
};
