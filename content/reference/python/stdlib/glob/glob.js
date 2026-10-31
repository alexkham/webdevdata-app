// content/reference/python/stdlib/glob/glob.js — glob.glob

export const meta = {
  slug:        'glob',
  name:        'glob.glob',
  signature:   'glob.glob(pathname, *, root_dir=None, dir_fd=None, recursive=False, include_hidden=False)',
  blurb:       'Return a list of the existing paths that match a shell-style pattern; ** recurses with recursive=True, dot names need include_hidden=True or a dot in the pattern.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions (recursive 3.5+, root_dir / dir_fd 3.10+, include_hidden 3.11+)',
  searchTerms: 'glob.glob python list files matching pattern wildcard *.txt recursive=True ** all subdirectories root_dir dir_fd include_hidden hidden files dot files sorted order windows backslash find files by extension',
};

export const method = {
  slug:      'glob',
  name:      'glob.glob',
  signature: 'glob.glob(pathname, *, root_dir=None, dir_fd=None, recursive=False, include_hidden=False)',
  returns:   { type: 'list[str]', desc: 'The matching paths, possibly empty, in file-system order. Same type as pathname (bytes in → bytes out).' },

  category:    'glob function',
  version:     'All Python versions (recursive 3.5+, root_dir / dir_fd 3.10+, include_hidden 3.11+)',
  hasLiveDemo: true,

  subtitle: 'Each / -separated part of the pattern is matched against one folder level with fnmatch rules, except that * and ? never match a leading dot. Only paths that exist come back, in the order the file system lists them, and the literal folder part of your pattern is kept exactly as you wrote it.',

  covers: ['glob'],

  cheat: {
    commonCall: "sorted(glob.glob('**/*.py', recursive=True))",
    returns:    "['app.py', 'src/main.py'] — a list of str",
    replaces:   'os.listdir + fnmatch loops, os.walk for simple searches',
    watchOut:   'unsorted; ** needs recursive=True; dot files skipped',
  },

  parameters: [
    { name: 'pathname',       type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'Pattern with * ? [seq] [!seq], absolute or relative. A trailing / matches folders only. No ~ or $VAR expansion.' },
    { name: 'root_dir',       type: 'str | PathLike | None', required: false, default: 'None',  desc: 'Search as if the current folder were root_dir (3.10+). Results of a relative pattern are relative to root_dir — join them before opening.' },
    { name: 'dir_fd',         type: 'int | None', required: false, default: 'None',  desc: 'A file descriptor of a folder to search relative to (3.10+). Needs os.open on a folder — Unix; on Windows os.open cannot open a folder.' },
    { name: 'recursive',      type: 'bool', required: false, default: 'False', desc: 'Make a ** segment match zero or more folders (3.5+). Without it ** behaves like *. ** followed by / matches folders only.' },
    { name: 'include_hidden', type: 'bool', required: false, default: 'False', desc: 'Let * ? and ** match names that start with a dot (3.11+).' },
  ],

  modes: [
    {
      id: 'glob',
      label: 'glob',
      blurb: 'One level per / in the pattern. The demo folder is virtual (Linux rules); sorting and replace(os.sep, "/") make the output identical on every OS.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'glob pattern', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob({$pattern}))",
      cases: [
        { id: 'csv',    label: 'data/*.csv',    values: { files: 'data/jan.csv, data/feb.csv, data/notes.txt, old/dec.csv', pattern: 'data/*.csv' } },
        { id: 'two',    label: '*/*.csv',       values: { files: 'data/jan.csv, data/feb.csv, data/notes.txt, old/dec.csv', pattern: '*/*.csv' } },
        { id: 'dot',    label: './[0-9].*',     values: { files: '1.gif, 2.txt, card.gif', pattern: './[0-9].*' } },
        { id: 'exact',  label: 'no wildcard',   values: { files: 'a.txt', pattern: 'a.txt' } },
        { id: 'month',  label: 'logs/2024-0?.log', values: { files: 'logs/2024-01.log, logs/2024-02.log, logs/2024-10.log', pattern: 'logs/2024-0?.log' } },
      ],
    },
    {
      id: 'recursive',
      label: 'recursive=True',
      blurb: '** stands for zero or more folders.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'pattern with **', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob({$pattern}, recursive=True))",
      cases: [
        { id: 'md',    label: '**/*.md',       values: { files: 'README.md, docs/intro.md, docs/api/ref.md, docs/api/ref.txt', pattern: '**/*.md' } },
        { id: 'under', label: 'docs/**/*.md',  values: { files: 'README.md, docs/intro.md, docs/api/ref.md, docs/api/ref.txt', pattern: 'docs/**/*.md' } },
        { id: 'twice', label: '**/** repeats', values: { files: 'a.txt, sub/b.txt', pattern: '**/**/*.txt' } },
        { id: 'dirs',  label: '**/',           values: { files: 'a.txt, src/b.py, src/pkg/c.py', pattern: '**/' } },
      ],
    },
    {
      id: 'hidden',
      label: 'include_hidden',
      blurb: 'recursive=True plus include_hidden=True: wildcards also match dot names.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'glob pattern', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob({$pattern}, recursive=True, include_hidden=True))",
      cases: [
        { id: 'cfg', label: '**/*.cfg', values: { files: 'app.cfg, .config/tool.cfg, src/.local.cfg', pattern: '**/*.cfg' } },
        { id: 'all', label: '*',        values: { files: '.env, .gitignore, app.py', pattern: '*' } },
      ],
    },
    {
      id: 'root',
      label: 'root_dir',
      blurb: 'Search inside root_dir; the results are relative to it.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'root',    type: 'str', hint: 'root_dir', input: 'text' },
        { name: 'pattern', type: 'str', hint: 'glob pattern', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob({$pattern}, root_dir={$root}, recursive=True))",
      cases: [
        { id: 'src',     label: 'src, **/*.py', values: { files: 'setup.py, src/app.py, src/pkg/util.py', root: 'src', pattern: '**/*.py' } },
        { id: 'missing', label: 'missing root', values: { files: 'a.txt', root: 'nope', pattern: '*' } },
      ],
    },
  ],
  demoExplainer: "data/*.csv keeps the folder part as written and lists data only; */*.csv tries every folder one level down. A pattern without wildcards is only checked for existence. With recursive=True, **/*.md also matches README.md at the top because ** can stand for no folder at all, and **/**/*.txt returns sub/b.txt twice (each ** can take the sub level). **/ lists folders only, each with a trailing slash. include_hidden=True opens up .config and .local.cfg. root_dir results are relative to root_dir, and a root_dir that does not exist simply gives [].",

  patterns: [
    {
      name: 'Newest file matching a pattern',
      desc: 'max with a key — no need to sort the whole list.',
      code: "import glob, os\nlatest = max(glob.glob('backups/*.zip'), key=os.path.getmtime, default=None)",
    },
    {
      name: 'Paths relative to a project folder',
      desc: 'root_dir keeps results short; join them back for opening.',
      code: "import glob, os\nfor rel in sorted(glob.glob('**/*.md', root_dir='docs', recursive=True)):\n    with open(os.path.join('docs', rel), encoding='utf-8') as f:\n        print(rel, len(f.read()))",
    },
    {
      name: 'Delete matching files',
      desc: 'glob first, then act — glob itself never changes anything.',
      code: "import glob, os\nfor path in glob.glob('build/**/*.o', recursive=True):\n    os.remove(path)",
    },
    {
      name: 'Several extensions',
      desc: 'glob has no {a,b} syntax: run one glob per pattern and merge.',
      code: "import glob\nimages = sorted(p for ext in ('png', 'jpg', 'gif') for p in glob.glob(f'img/*.{ext}'))",
    },
  ],

  examples: [
    { title: 'The leading ./ is kept', code: "import glob, os\nfor name in ['1.gif', '2.txt', 'card.gif']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('./[0-9].*'))", returns: "['./1.gif', './2.txt']" },
    { title: 'Folders only with a trailing /', code: "import glob, os\nos.makedirs('docs')\nopen('notes.txt', 'w', encoding='utf-8').close()\n[p.replace(os.sep, '/') for p in glob.glob('*/')]", returns: "['docs/']" },
    { title: 'root_dir gives relative results', code: "import glob, os\nos.makedirs('src/pkg')\nfor name in ['src/app.py', 'src/pkg/util.py']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('**/*.py', root_dir='src', recursive=True))", returns: "['app.py', 'pkg/util.py']" },
    { title: 'No wildcard: an existence check', code: "import glob\nopen('notes.md', 'w', encoding='utf-8').close()\nglob.glob('notes.md'), glob.glob('missing.md')", returns: "(['notes.md'], [])" },
    { title: 'include_hidden reaches dot folders', code: "import glob, os\nos.makedirs('.config')\nfor name in ['app.cfg', '.config/tool.cfg']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('**/*.cfg', recursive=True, include_hidden=True))", returns: "['.config/tool.cfg', 'app.cfg']" },
    { title: 'bytes in, bytes out', code: "import glob\nopen('a.txt', 'w', encoding='utf-8').close()\nglob.glob(b'*.txt')", returns: "[b'a.txt']" },
    { title: 'What Windows returns (ntpath.join)', code: "import ntpath\nntpath.join('a/b', 'x.txt')", returns: "'a/b\\\\x.txt'" },
  ],

  pitfalls: [
    {
      name: 'Opening a root_dir result directly',
      desc: 'With root_dir the results are relative to that folder, not to the current one.',
      wrong: { label: 'open(name)', code: "import glob, os\nos.makedirs('logs')\nwith open('logs/b.txt', 'w', encoding='utf-8') as f:\n    f.write('ok')\nname = glob.glob('*.txt', root_dir='logs')[0]\nopen(name, encoding='utf-8').read()", output: "FileNotFoundError: [Errno 2] No such file or directory: 'b.txt'" },
      fix:   { label: 'join root_dir', code: "import glob, os\nos.makedirs('logs')\nwith open('logs/b.txt', 'w', encoding='utf-8') as f:\n    f.write('ok')\nname = glob.glob('*.txt', root_dir='logs')[0]\nwith open(os.path.join('logs', name), encoding='utf-8') as f:\n    text = f.read()\ntext", output: "'ok'" },
    },
    {
      name: 'Hidden folders skipped by **',
      desc: 'recursive=True still does not enter folders whose name starts with a dot.',
      wrong: { label: 'recursive only', code: "import glob, os\nos.makedirs('.config')\nfor name in ['app.cfg', '.config/tool.cfg']:\n    open(name, 'w', encoding='utf-8').close()\nglob.glob('**/*.cfg', recursive=True)", output: "['app.cfg']" },
      fix:   { label: '+ include_hidden', code: "import glob, os\nos.makedirs('.config')\nfor name in ['app.cfg', '.config/tool.cfg']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('**/*.cfg', recursive=True, include_hidden=True))", output: "['.config/tool.cfg', 'app.cfg']" },
    },
    {
      name: 'Two ** in one pattern',
      desc: 'Every ** can absorb the same folders, so paths are returned more than once. Use a single ** (or deduplicate).',
      wrong: { label: '**/**', code: "import glob, os\nos.makedirs('sub')\nfor name in ['a.txt', 'sub/b.txt']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('**/**/*.txt', recursive=True))", output: "['a.txt', 'sub/b.txt', 'sub/b.txt']" },
      fix:   { label: 'one **', code: "import glob, os\nos.makedirs('sub')\nfor name in ['a.txt', 'sub/b.txt']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.glob('**/*.txt', recursive=True))", output: "['a.txt', 'sub/b.txt']" },
    },
  ],

  when: {
    use: [
      'A list of existing paths by name pattern',
      'Recursive search by extension (**/*.ext with recursive=True)',
      'Strings you pass straight on to open(), shutil or subprocess',
    ],
    avoid: [
      'Huge trees you only need to scan once → iglob (no list in memory)',
      'Path objects → pathlib.Path.glob / rglob',
      'Conditions besides the name → os.walk or os.scandir',
    ],
  },

  notes: {
    cpython:       'glob() is list(iglob(...)). _iglob splits the pattern with os.path.split, globs the folder part (only folders), then lists each folder with os.scandir and filters the names with fnmatch.filter; ** with recursive=True walks the tree with _rlistdir',
    'Separators':  "Found names are joined with os.path.join: on Windows glob('a/b/*.txt') gives 'a/b\\\\x.txt' — your literal 'a/b' plus a backslash. Normalise with os.path.normpath or p.replace(os.sep, '/') when comparing",
    'Case':        "Matching goes through fnmatch.filter: case-insensitive on Windows ('*.MD' finds notes.md), case-sensitive on Linux and macOS",
    'dir_fd':      'With dir_fd, folders are opened with os.open(..., dir_fd=dir_fd) and listed by descriptor. On Windows os.open cannot open a folder, so the parameter is effectively Unix-only',
    'Errors':      'glob never raises for missing folders or unreadable directories — listing errors (OSError) are swallowed and those paths are simply absent',
  },

  related: [
    { name: 'glob.iglob',     slug: 'iglob',     when: 'The same results one at a time' },
    { name: 'glob.escape',    slug: 'escape',    when: 'Match names containing [ * ?' },
    { name: 'glob.translate', slug: 'translate', when: 'The pattern as a regex (3.13+)' },
    { name: 'Path.glob',      slug: 'glob',      when: 'Path objects instead of strings', category: 'stdlib/pathlib' },
    { name: 'fnmatch.filter', slug: 'filter',    when: 'What matches each path segment', category: 'stdlib/fnmatch' },
    { name: 'os.walk',        slug: 'walk',      when: 'Full control over a recursive scan', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I glob files recursively in Python?',
      a: "glob.glob('**/*.txt', recursive=True). The ** segment matches zero or more folders, so files in the starting folder are included. Without recursive=True, ** acts like a single *. Dot folders are skipped unless include_hidden=True.",
    },
    {
      q: 'Does glob.glob return files in sorted order?',
      a: 'No. The order is whatever os.scandir returns, which depends on the operating system and file system. Use sorted(glob.glob(...)).',
    },
    {
      q: 'How do I glob only directories?',
      a: "End the pattern with a slash: glob.glob('*/') or glob.glob('**/', recursive=True). The results keep the trailing separator ('docs/' on Linux).",
    },
    {
      q: 'Why does glob return backslashes on Windows?',
      a: "The parts glob finds are joined with os.path.join, which uses \\ on Windows. The literal part of your pattern stays as you wrote it, so 'a/b/*.txt' can give 'a/b\\\\x.txt'. Use pathlib, os.path.normpath, or p.replace(os.sep, '/') to normalise.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/glob.html#glob.glob',
    meta:  'glob.glob',
  },
};
