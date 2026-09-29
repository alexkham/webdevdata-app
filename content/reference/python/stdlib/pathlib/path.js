// content/reference/python/stdlib/pathlib/path.js

export const meta = {
  slug:        'path',
  name:        'pathlib.Path',
  signature:   'pathlib.Path(*pathsegments)',
  blurb:       'A file-system path you can join with /, inspect, and use to read, write, list and create files. Path(...) is a PosixPath or a WindowsPath depending on the OS.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'path pathlib.path python path object join paths slash operator path vs purepath create path current directory file path python concrete path os.path replacement',
};

export const method = {
  slug:      'path',
  name:      'pathlib.Path',
  signature: 'pathlib.Path(*pathsegments)',
  returns:   { type: 'PosixPath | WindowsPath', desc: 'Path itself is a factory: you get the concrete class for the running OS.' },

  category:    'pathlib class',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Path is PurePath plus I/O. Build it from strings, join with /, then ask it questions (exists, is_file) or act on it (read_text, mkdir, glob). Relative paths are resolved against the current working directory at the moment you use them.',

  covers: ['Path'],

  cheat: {
    commonCall: "Path('data') / 'raw' / 'sales.csv'",
    returns:    'PosixPath or WindowsPath — str() is native, as_posix() uses /',
    replaces:   'os.path.join + open + os.listdir + os.makedirs …',
    watchOut:   'Relative paths depend on the cwd, not on the script location',
  },

  parameters: [
    { name: '*pathsegments', type: 'str | os.PathLike', required: false, default: "'.'", desc: 'Joined like os.path.join. Path() with no arguments is the current directory, ".".' },
  ],

  modes: [
    {
      id: 'join',
      label: 'join with /',
      blurb: 'The / operator adds one segment. An absolute segment starts over from the root.',
      params: [
        { name: 'base',  type: 'str', hint: 'starting path', input: 'text' },
        { name: 'child', type: 'str', hint: 'segment to add', input: 'text' },
      ],
      template: 'from pathlib import Path\n(Path({$base}) / {$child}).as_posix()',
      cases: [
        { id: 'plain',  label: 'relative',          values: { base: 'data', child: 'raw/sales.csv' } },
        { id: 'slash',  label: 'trailing slash',    values: { base: 'data/', child: 'sales.csv' } },
        { id: 'abs',    label: 'absolute child',    values: { base: 'data', child: '/etc/hosts' } },
        { id: 'dot',    label: 'current dir',       values: { base: '.', child: 'sales.csv' } },
      ],
    },
    {
      id: 'files',
      label: 'write & read',
      blurb: 'Write a file in the (empty) working directory, then ask the Path about it.',
      params: [
        { name: 'name', type: 'str', hint: 'a file name', input: 'text' },
        { name: 'text', type: 'str', hint: 'file content', input: 'text' },
      ],
      template: "from pathlib import Path\np = Path({$name})\np.write_text({$text}, encoding='utf-8')\n(p.name, p.exists(), p.read_text(encoding='utf-8'))",
      cases: [
        { id: 'txt',  label: 'text file',  values: { name: 'notes.txt', text: 'buy milk' } },
        { id: 'utf',  label: 'non-ASCII',  values: { name: 'café.md', text: 'naïve résumé' } },
      ],
    },
  ],
  demoExplainer: 'The join tab shows as_posix() so the result reads the same on every OS; str() would show backslashes on Windows. "data/" and "data" join identically because the trailing slash is dropped when the path is parsed, and an absolute child like "/etc/hosts" discards the base completely.',

  patterns: [
    {
      name: 'Anchor paths to the script, not the cwd',
      desc: 'Relative paths follow the current directory of the process; __file__ does not.',
      code: "from pathlib import Path\nDATA = Path(__file__).resolve().parent / 'data'",
    },
    {
      name: 'Accept str or Path in your own functions',
      desc: 'Path(x) is a no-op copy for Path input and parses strings.',
      code: "from pathlib import Path\ndef word_count(path):\n    return len(Path(path).read_text(encoding='utf-8').split())",
    },
    {
      name: 'Pass a Path to any API that wants a filename',
      desc: 'open(), shutil, json, csv and os all take os.PathLike objects.',
      code: "import shutil\nfrom pathlib import Path\nsrc = Path('report.pdf')\nshutil.copy(src, Path('backup') / src.name)",
    },
    {
      name: 'Home and current directory',
      desc: 'Class methods that return absolute paths.',
      code: 'from pathlib import Path\nhome = Path.home()\nhere = Path.cwd()',
    },
  ],

  examples: [
    { title: 'Path is PurePath plus I/O',     code: "from pathlib import Path, PurePath\nisinstance(Path('x'), PurePath)", returns: 'True' },
    { title: 'You get the OS-specific class', code: "import os\nfrom pathlib import Path\ntype(Path('x')).__name__ == ('WindowsPath' if os.name == 'nt' else 'PosixPath')", returns: 'True' },
    { title: 'Chain / to build a path',       code: "from pathlib import Path\n(Path('project') / 'src' / 'main.py').as_posix()", returns: "'project/src/main.py'" },
    { title: 'A str on the left works too',   code: "from pathlib import Path\n('logs' / Path('app.log')).as_posix()", returns: "'logs/app.log'" },
    { title: 'Write and inspect a file',      code: "from pathlib import Path\np = Path('todo.txt')\np.write_text('ship it', encoding='utf-8')\n(p.exists(), p.is_file(), p.stat().st_size)", returns: '(True, True, 7)' },
    { title: 'open() accepts a Path',         code: "from pathlib import Path\np = Path('data.txt')\np.write_text('42', encoding='utf-8')\nwith open(p, encoding='utf-8') as f:\n    value = int(f.read())\nvalue", returns: '42' },
    { title: 'cwd() is absolute',             code: 'from pathlib import Path\nPath.cwd().is_absolute()', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Showing str(path) and expecting forward slashes',
      desc: "str() is the native form, so the same code prints 'a/b' on Linux and 'a\\b' on Windows. Use as_posix() for logs, URLs and cross-platform output.",
      wrong: { label: 'native str()', code: "import os\nfrom pathlib import Path\nstr(Path('a') / 'b') == ('a\\\\b' if os.name == 'nt' else 'a/b')", output: 'True' },
      fix:   { label: 'as_posix()', code: "from pathlib import Path\n(Path('a') / 'b').as_posix()", output: "'a/b'" },
    },
    {
      name: 'Adding strings to a Path with +',
      desc: 'Paths do not support +. Use / for a new segment, or with_name / with_suffix to change the last one. (Shown with PurePosixPath so the class name in the message is the same on every OS; Path gives PosixPath or WindowsPath there.)',
      wrong: { label: 'path + str', code: "from pathlib import PurePosixPath\nPurePosixPath('report') + '.pdf'", output: "TypeError: unsupported operand type(s) for +: 'PurePosixPath' and 'str'" },
      fix:   { label: 'with_suffix', code: "from pathlib import PurePosixPath\nPurePosixPath('report').with_suffix('.pdf')", output: "PurePosixPath('report.pdf')" },
    },
    {
      name: 'Instantiating the other OS class',
      desc: 'WindowsPath cannot be created on Linux, nor PosixPath on Windows. Use the pure classes for foreign paths.',
      wrong: { label: 'foreign concrete class', code: "import os\nfrom pathlib import PosixPath, WindowsPath\nforeign = PosixPath if os.name == 'nt' else WindowsPath\ntry:\n    foreign('x')\nexcept Exception as e:\n    result = type(e).__name__\nresult", output: "'UnsupportedOperation'" },
      fix:   { label: 'pure flavour', code: "from pathlib import PurePosixPath, PureWindowsPath\n(PurePosixPath('x'), PureWindowsPath('x'))", output: "(PurePosixPath('x'), PureWindowsPath('x'))" },
    },
  ],

  when: {
    use: [
      'Every file-system path in new code',
      'Small whole-file reads and writes (read_text / write_bytes …)',
      'Listing and searching directories (iterdir, glob, rglob, walk)',
    ],
    avoid: [
      'Paths that are not on this machine → PurePosixPath / PureWindowsPath',
      'Recursive copy / delete → shutil.copytree / shutil.rmtree',
    ],
  },

  notes: {
    cpython:          'Lib/pathlib/_local.py: Path.__new__ returns WindowsPath if os.name == "nt" else PosixPath; I/O methods call os.* (os.stat, os.scandir, os.mkdir …) with the path',
    'os.PathLike':    'Every PurePath implements __fspath__, so any function taking a filename accepts it',
    'Relative paths': 'Interpreted against os.getcwd() at call time — changing directory changes what a relative Path refers to',
    'Immutability':   'Paths are immutable and hashable: methods such as with_suffix and / return new objects',
  },

  related: [
    { name: 'PurePath',             slug: 'purepath',   when: 'The I/O-free base class' },
    { name: 'PosixPath / WindowsPath', slug: 'posixpath', when: 'What Path(...) actually returns' },
    { name: 'read_text / write_text', slug: 'read_text', when: 'Whole-file I/O' },
    { name: 'glob / rglob / walk',  slug: 'glob',       when: 'Find files' },
    { name: 'mkdir / touch / unlink', slug: 'mkdir',    when: 'Create and remove' },
    { name: 'The / operator',       slug: 'truediv',    when: 'How / is dispatched to __truediv__', category: 'operators' },
  ],

  faq: [
    {
      q: 'What is the difference between Path and PurePath?',
      a: 'PurePath only works with the path text; Path adds methods that touch the file system (exists, read_text, mkdir, glob, stat …). Path is a subclass of PurePath, so it also has every pure method.',
    },
    {
      q: 'How do I join paths in Python with pathlib?',
      a: "With the / operator: Path('data') / 'raw' / 'file.csv', or with joinpath('raw', 'file.csv'). Segments that start with / (or a drive on Windows) replace what came before.",
    },
    {
      q: 'How do I get the current directory or the home directory?',
      a: 'Path.cwd() and Path.home(). Both return absolute paths. Path() or Path(".") is the relative path to the current directory.',
    },
    {
      q: 'Is Path relative to the script or to where I run it?',
      a: "To where you run it: relative paths use the process's current working directory. Build from Path(__file__).resolve().parent to be relative to the script.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path',
    meta:  'pathlib.Path',
  },
};
