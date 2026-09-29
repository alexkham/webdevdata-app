// content/reference/python/stdlib/pathlib/posixpath.js

export const meta = {
  slug:        'posixpath',
  name:        'pathlib.PosixPath',
  signature:   'pathlib.PosixPath(*pathsegments) / pathlib.WindowsPath(*pathsegments)',
  blurb:       'The two concrete Path classes. Path(...) creates a PosixPath on Linux and macOS and a WindowsPath on Windows; the other one cannot be instantiated.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.4+',
  searchTerms: 'posixpath windowspath pathlib.PosixPath pathlib.WindowsPath WindowsPath PosixPath cannot instantiate on your system path class per os posix path windows path concrete path',
};

export const method = {
  slug:      'posixpath',
  name:      'pathlib.PosixPath',
  signature: 'pathlib.PosixPath(*pathsegments) / pathlib.WindowsPath(*pathsegments)',
  returns:   { type: 'PosixPath | WindowsPath', desc: 'A concrete path for the running OS; the foreign class raises UnsupportedOperation.' },

  category:    'pathlib class',
  version:     'Python 3.4+',
  hasLiveDemo: false,

  subtitle: 'You rarely name these classes: they are what Path(...) returns. PosixPath = Path + PurePosixPath rules; WindowsPath = Path + PureWindowsPath rules. Only the one matching the OS can be created.',

  covers: ['PosixPath', 'WindowsPath'],

  cheat: {
    commonCall: "Path('x')  # PosixPath('x') on Linux, WindowsPath('x') on Windows",
    returns:    'the concrete class for the running OS',
    replaces:   '—',
    watchOut:   'The foreign class raises UnsupportedOperation (NotImplementedError before 3.13)',
  },

  parameters: [
    { name: '*pathsegments', type: 'str | os.PathLike', required: false, default: "'.'", desc: 'Same as Path.' },
  ],

  patterns: [
    {
      name: 'Type-check against Path, not the concrete class',
      desc: 'isinstance(p, Path) is True on every OS; isinstance(p, PosixPath) is not.',
      code: 'from pathlib import Path\ndef ensure_path(x):\n    return x if isinstance(x, Path) else Path(x)',
    },
    {
      name: 'Branch on the OS explicitly',
      desc: 'When behaviour must differ, test os.name rather than the path class.',
      code: "import os\nfrom pathlib import Path\nconfig = Path.home() / ('AppData/Roaming/app' if os.name == 'nt' else '.config/app')",
    },
  ],

  examples: [
    { title: 'Path returns the class for this OS', code: "import os\nfrom pathlib import Path, PosixPath, WindowsPath\ntype(Path('x')) is (WindowsPath if os.name == 'nt' else PosixPath)", returns: 'True' },
    { title: 'Each is a Path and a pure flavour',  code: "from pathlib import Path, PosixPath, PurePosixPath, WindowsPath, PureWindowsPath\n(issubclass(PosixPath, Path), issubclass(PosixPath, PurePosixPath), issubclass(WindowsPath, PureWindowsPath))", returns: '(True, True, True)' },
    { title: 'The foreign class cannot be created', code: "import os\nfrom pathlib import PosixPath, WindowsPath, UnsupportedOperation\nforeign = PosixPath if os.name == 'nt' else WindowsPath\ntry:\n    foreign('x')\nexcept UnsupportedOperation:\n    result = 'UnsupportedOperation'\nresult", returns: "'UnsupportedOperation'" },
    { title: 'Which is also a NotImplementedError', code: 'from pathlib import UnsupportedOperation\nissubclass(UnsupportedOperation, NotImplementedError)', returns: 'True' },
    { title: 'Equality needs the same flavour', code: "from pathlib import Path, PurePosixPath, PureWindowsPath\nPath('a') in (PurePosixPath('a'), PureWindowsPath('a'))", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Checking isinstance(p, PosixPath)',
      desc: 'The check is OS-dependent: it fails for every path on Windows. Check against Path (or PurePath) instead.',
      wrong: { label: 'concrete class', code: "import os\nfrom pathlib import Path, PosixPath\nisinstance(Path('x'), PosixPath) == (os.name != 'nt')", output: 'True' },
      fix:   { label: 'Path', code: "from pathlib import Path\nisinstance(Path('x'), Path)", output: 'True' },
    },
    {
      name: 'Hard-coding a repr in tests',
      desc: "repr(Path('x')) is PosixPath('x') on Linux but WindowsPath('x') on Windows. Compare with as_posix() or with a Path you build, not with a repr string.",
      wrong: { label: 'repr string', code: "import os\nfrom pathlib import Path\nrepr(Path('a/b')) == (\"WindowsPath('a/b')\" if os.name == 'nt' else \"PosixPath('a/b')\")", output: 'True' },
      fix:   { label: 'as_posix()', code: "from pathlib import Path\nPath('a/b').as_posix() == 'a/b'", output: 'True' },
    },
  ],

  when: {
    use: [
      'Reading tracebacks and reprs — these are the names you will see',
      'Very rarely, isinstance checks in OS-specific code',
    ],
    avoid: [
      'Creating paths → use Path(...), which picks the right class',
      'Foreign-OS paths → PurePosixPath / PureWindowsPath',
    ],
  },

  notes: {
    cpython:       'Lib/pathlib/_local.py: class PosixPath(Path, PurePosixPath) and class WindowsPath(Path, PureWindowsPath); on the wrong OS their __new__ raises UnsupportedOperation("cannot instantiate \'PosixPath\' on your system")',
    'Changed in 3.13': 'The error is UnsupportedOperation; earlier versions raised NotImplementedError (still caught by except NotImplementedError, since UnsupportedOperation subclasses it)',
    'Windows-only / POSIX-only methods': 'owner() and group() raise UnsupportedOperation on Windows (no pwd / grp); is_junction() is only ever True on Windows',
  },

  related: [
    { name: 'Path',                 slug: 'path',                 when: 'The factory you normally call' },
    { name: 'PureWindowsPath',      slug: 'purewindowspath',      when: 'Windows rules on any OS' },
    { name: 'PurePath / PurePosixPath', slug: 'purepath',         when: 'POSIX rules on any OS' },
    { name: 'UnsupportedOperation', slug: 'unsupportedoperation', when: 'What the foreign class raises' },
  ],

  faq: [
    {
      q: 'Why do I get WindowsPath instead of Path?',
      a: 'Path is a factory. On Windows Path(...) returns a WindowsPath, on Linux and macOS a PosixPath. Both are subclasses of Path, so isinstance(p, Path) is True either way.',
    },
    {
      q: 'Why does "cannot instantiate \'PosixPath\' on your system" appear?',
      a: 'Code (often unpickling a Path created on Linux) tried to create a PosixPath on Windows. Concrete paths only exist for the running OS; use PurePosixPath for a Linux path on Windows, or convert with Path(str(p)).',
    },
    {
      q: 'Can I pickle a Path on Linux and load it on Windows?',
      a: 'Not as a concrete path: the pickle records PosixPath, which Windows refuses to instantiate. Pickle str(p) or a PurePosixPath instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PosixPath',
    meta:  'pathlib.PosixPath / pathlib.WindowsPath',
  },
};
