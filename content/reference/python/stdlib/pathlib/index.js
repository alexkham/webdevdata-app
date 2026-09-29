// content/reference/python/stdlib/pathlib/index.js — the pathlib module hub

export const meta = {
  slug:        'index',
  name:        'pathlib',
  signature:   'from pathlib import Path',
  blurb:       'Object-oriented filesystem paths: join with /, read and write files, list and glob directories — one Path object instead of os.path strings.',
  category:    'files',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'pathlib module python path object filesystem paths join path slash operator read file write file glob directory listing os.path alternative purepath posixpath windowspath',
};

export const method = {
  slug: 'index',
  name: 'pathlib',

  category:    'Files and directories',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Path(...) gives you an object that knows its name, suffix and parent, joins with /, and reads, writes and lists files itself. Pure paths do the string arithmetic without ever touching the disk.',

  // every public name PurePath and Path define themselves must be claimed
  // by a member page ('PurePath.name', 'Path.glob', …)
  coverClasses: ['PurePath', 'Path'],

  imports: ['from pathlib import Path', 'from pathlib import PurePosixPath, PureWindowsPath', 'import pathlib'],
  facts: [
    { label: 'Public API',  value: 'Path, PurePath, PurePosixPath, PureWindowsPath, PosixPath, WindowsPath, UnsupportedOperation' },
    { label: 'Path(...) is', value: 'a PosixPath on Linux and macOS, a WindowsPath on Windows' },
    { label: 'Pure paths',  value: 'Path arithmetic only, no I/O — PurePosixPath and PureWindowsPath work the same on every OS' },
    { label: 'Accepted by', value: 'open(), os, shutil, json.load(open(p)) … — every path object is os.PathLike' },
  ],

  modes: [
    {
      id: 'anatomy',
      label: 'anatomy',
      blurb: 'Split a path into the pieces you usually want: its folder, file name, stem and extension.',
      params: [{ name: 'path', type: 'str', hint: 'a POSIX path', input: 'text' }],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$path})\n(p.parent, p.name, p.stem, p.suffix)',
      cases: [
        { id: 'file',    label: 'file',           values: { path: '/home/ada/report.pdf' } },
        { id: 'targz',   label: 'double suffix',  values: { path: 'backups/site.tar.gz' } },
        { id: 'dot',     label: 'dotfile',        values: { path: '~/.bashrc' } },
        { id: 'messy',   label: 'messy slashes',  values: { path: 'data//raw/./2026/' } },
      ],
    },
    {
      id: 'tree',
      label: 'glob a tree',
      blurb: 'Create a few empty files, then glob them. ** crosses folders; * stays inside one.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str',       hint: 'a glob pattern',                   input: 'text' },
      ],
      template: "from pathlib import Path\nfor f in {$files}:\n    Path(f).parent.mkdir(parents=True, exist_ok=True)\n    Path(f).touch()\nsorted(p.as_posix() for p in Path('.').glob({$pattern}))",
      cases: [
        { id: 'top',  label: '*.py',     values: { files: 'app.py, setup.cfg, src/util.py, src/pkg/core.py', pattern: '*.py' } },
        { id: 'deep', label: '**/*.py',  values: { files: 'app.py, setup.cfg, src/util.py, src/pkg/core.py', pattern: '**/*.py' } },
        { id: 'dirs', label: 'folders',  values: { files: 'app.py, src/util.py, docs/index.md', pattern: '*/' } },
      ],
    },
  ],
  demoExplainer: 'PurePosixPath normalises as it parses: repeated slashes and "." segments disappear and a trailing slash is dropped, but ".." is kept because removing it would need the file system. stem and suffix only split off the LAST extension, so site.tar.gz has the stem site.tar, and a name that starts with a dot (.bashrc) has no suffix at all. In the glob tab, results come back in whatever order the OS lists them, so the snippet sorts them.',

  patterns: [
    {
      name: 'Paths relative to the script',
      desc: 'Build paths from __file__ instead of relying on the current directory.',
      code: "from pathlib import Path\nHERE = Path(__file__).resolve().parent\nconfig = HERE / 'config' / 'settings.toml'",
    },
    {
      name: 'Read and write a whole file',
      desc: 'No open() / with block needed for small files; pass the encoding.',
      code: "from pathlib import Path\np = Path('notes.txt')\np.write_text('hello\\n', encoding='utf-8')\ntext = p.read_text(encoding='utf-8')",
    },
    {
      name: 'Process every matching file in a tree',
      desc: 'rglob searches all sub-folders; sort for a stable order.',
      code: "from pathlib import Path\nfor csv_file in sorted(Path('data').rglob('*.csv')):\n    print(csv_file.stem, csv_file.stat().st_size)",
    },
    {
      name: 'Make sure an output folder exists',
      desc: 'parents=True creates missing parents; exist_ok=True makes it idempotent.',
      code: "from pathlib import Path\nout = Path('build') / 'reports'\nout.mkdir(parents=True, exist_ok=True)",
    },
    {
      name: 'Change the extension',
      desc: 'with_suffix swaps the last suffix and returns a new path.',
      code: "from pathlib import Path\nsrc = Path('photos/cat.jpeg')\ndst = src.with_suffix('.webp')",
    },
  ],

  examples: [
    { title: 'Join with the / operator',   code: "from pathlib import PurePosixPath\nPurePosixPath('/srv') / 'app' / 'config.toml'", returns: "PurePosixPath('/srv/app/config.toml')" },
    { title: 'Name, stem and suffix',      code: "from pathlib import PurePosixPath\np = PurePosixPath('/data/2026/sales.csv')\n(p.name, p.stem, p.suffix)", returns: "('sales.csv', 'sales', '.csv')" },
    { title: 'The containing folder',      code: "from pathlib import PurePosixPath\nPurePosixPath('/data/2026/sales.csv').parent", returns: "PurePosixPath('/data/2026')" },
    { title: 'Write, then read back',      code: "from pathlib import Path\np = Path('hello.txt')\np.write_text('Hi there', encoding='utf-8')\np.read_text(encoding='utf-8')", returns: "'Hi there'" },
    { title: 'List a folder (sorted)',     code: "from pathlib import Path\nfor name in ['b.txt', 'a.txt', 'c.log']:\n    Path(name).touch()\nsorted(p.name for p in Path('.').iterdir())", returns: "['a.txt', 'b.txt', 'c.log']" },
    { title: 'Glob by extension',          code: "from pathlib import Path\nfor name in ['a.txt', 'b.txt', 'c.log']:\n    Path(name).touch()\nsorted(p.name for p in Path('.').glob('*.txt'))", returns: "['a.txt', 'b.txt']" },
    { title: 'Windows paths on any OS',    code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:/Users/ada/notes.txt').parts", returns: "('C:\\\\', 'Users', 'ada', 'notes.txt')" },
    { title: 'Paths are not strings',      code: "from pathlib import PurePosixPath\n'backup-' + PurePosixPath('db.sqlite')", returns: 'TypeError: can only concatenate str (not "PurePosixPath") to str' },
  ],

  pitfalls: [
    {
      name: 'Building paths with string concatenation',
      desc: 'Gluing strings with "/" doubles or drops separators. The / operator inserts exactly one and normalises the rest.',
      wrong: { label: 'string +',     code: "base = 'data/'\nbase + '/' + 'raw.csv'", output: "'data//raw.csv'" },
      fix:   { label: 'the / operator', code: "from pathlib import PurePosixPath\nPurePosixPath('data/') / 'raw.csv'", output: "PurePosixPath('data/raw.csv')" },
    },
    {
      name: 'An absolute segment throws away everything before it',
      desc: 'Joining a segment that starts with "/" restarts the path from the root — a classic bug when the second part comes from user input.',
      wrong: { label: 'leading slash', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/uploads') / '/etc/passwd'", output: "PurePosixPath('/etc/passwd')" },
      fix:   { label: 'check it stays inside', code: "from pathlib import PurePosixPath\nbase = PurePosixPath('/srv/uploads')\n(base / '/etc/passwd').is_relative_to(base)", output: 'False' },
    },
    {
      name: 'Expecting ".." to be resolved',
      desc: 'Pure paths never collapse "..": a/../b could point anywhere if a is a symlink. resolve() does it against the real file system; for pure paths, compare parts yourself.',
      wrong: { label: 'kept as-is', code: "from pathlib import PurePosixPath\nPurePosixPath('reports/../secrets.txt')", output: "PurePosixPath('reports/../secrets.txt')" },
      fix:   { label: 'resolve() on a real Path', code: "from pathlib import Path\nPath('reports').mkdir()\n(Path('reports/../secrets.txt').resolve() == Path('secrets.txt').resolve())", output: 'True' },
    },
  ],

  when: {
    use: [
      'Any new code that builds, inspects or walks file paths',
      'Reading or writing small files in one call (read_text / write_text)',
      'Finding files by pattern (glob / rglob) and walking trees (walk)',
      'Manipulating Windows or POSIX paths on any OS (PureWindowsPath / PurePosixPath)',
    ],
    avoid: [
      'Copying and moving whole trees → shutil (copytree, move, rmtree); Path.copy / move only arrive in 3.14',
      'Temporary files and folders → tempfile',
      'URLs → urllib.parse (as_uri / from_uri only handle file: URIs)',
    ],
  },

  notes: {
    cpython: 'Lib/pathlib/_local.py (PurePath, Path) on top of _abc.py (PurePathBase, PathBase) in 3.13 — stem, suffix, exists, is_file and friends are inherited from the _abc bases',
    'os.path.join()':      'PurePath.joinpath() or the / operator',
    'os.path.dirname()':   'PurePath.parent',
    'os.path.basename()':  'PurePath.name',
    'os.path.splitext()':  'PurePath.stem, PurePath.suffix',
    'os.path.isabs()':     'PurePath.is_absolute()',
    'os.path.relpath()':   'PurePath.relative_to() — lexical, raises ValueError instead of adding ".." (unless walk_up=True)',
    'os.path.abspath()':   'Path.absolute() (does not remove "..") — Path.resolve() for the realpath() behaviour',
    'os.path.expanduser()': 'Path.expanduser() — raises RuntimeError when the home directory cannot be found',
    'os.path.exists() / isfile() / isdir() / islink()': 'Path.exists() / is_file() / is_dir() / is_symlink()',
    'os.getcwd()':         'Path.cwd()',
    'os.stat() / os.lstat()': 'Path.stat() / Path.lstat()',
    'os.listdir()':        'Path.iterdir()',
    'os.walk()':           'Path.walk() (3.12+)',
    'os.mkdir(), os.makedirs()': 'Path.mkdir() (parents=True for makedirs)',
    'os.remove(), os.unlink() / os.rmdir()': 'Path.unlink() / Path.rmdir()',
    'os.rename() / os.replace()': 'Path.rename() / Path.replace()',
    'os.chmod() / os.symlink() / os.link() / os.readlink()': 'Path.chmod() / symlink_to() / hardlink_to() / readlink()',
    'glob.glob()':         'Path.glob() — dotfiles included, ** always recursive',
  },

  related: [
    { name: 'open()', slug: 'open', when: 'Accepts Path objects directly', category: 'functions' },
    { name: 'json module', slug: 'json', when: 'Load and dump JSON files at a Path', category: 'stdlib' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'What reading a missing path raises', category: 'exceptions' },
    { name: 'Path', slug: 'path', when: 'Start here: the concrete path class' },
  ],

  faq: [
    {
      q: 'Should I use pathlib or os.path?',
      a: 'pathlib for new code: a Path carries its own name, suffix, parent and I/O methods, joins with /, and is accepted everywhere a path string is (open, os, shutil). os.path remains fine in old code — the Notes table lists the pathlib equivalent of each os.path function.',
    },
    {
      q: 'How do I convert a Path to a string?',
      a: 'str(p) gives the path in the native format (backslashes on Windows); p.as_posix() always uses forward slashes. Most APIs take the Path directly, so a conversion is rarely needed.',
    },
    {
      q: 'Why does Path give me a WindowsPath (or PosixPath)?',
      a: 'Path is a factory: Path(...) creates a WindowsPath on Windows and a PosixPath elsewhere, so the object follows the rules of the OS it runs on. Use PurePosixPath or PureWindowsPath when you need a specific flavour on any OS.',
    },
    {
      q: 'How do I get the file name without the extension?',
      a: "p.stem. It strips only the last suffix: Path('site.tar.gz').stem is 'site.tar'. p.suffixes lists all of them.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html',
    meta:  'pathlib — Object-oriented filesystem paths',
  },
};
