// content/reference/python/stdlib/os-path/sep.js — os.path constants

export const meta = {
  slug:        'sep',
  name:        'os.path.sep',
  signature:   'os.path.sep · altsep · extsep · curdir · pardir · pathsep · defpath · devnull · supports_unicode_filenames',
  blurb:       "The platform's path spelling as constants: separator ('/' or '\\'), alternative separator, extension dot, '.', '..', the PATH separator (':' or ';'), the default search path, the null device and whether Unicode file names are supported.",
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3 (all versions)',
  searchTerms: 'os.path.sep sep os.path.altsep altsep os.path.extsep extsep os.path.curdir curdir os.path.pardir pardir os.path.pathsep pathsep os.path.defpath defpath os.path.devnull devnull os.path.supports_unicode_filenames supports_unicode_filenames path separator python slash backslash PATH separator colon semicolon /dev/null nul os.sep',
};

export const method = {
  slug:      'sep',
  name:      'os.path.sep',
  signature: 'os.path.sep · altsep · extsep · curdir · pardir · pathsep · defpath · devnull · supports_unicode_filenames',
  returns:   { type: 'str | None | bool', desc: "Strings that describe the platform's path syntax; altsep is None on POSIX; supports_unicode_filenames is a bool." },

  category:    'os.path constants',
  version:     'Python 3 (all versions)',
  hasLiveDemo: false,

  subtitle: "os.path is posixpath on Linux and macOS and ntpath on Windows, and these constants are what differ between the two. Every one except supports_unicode_filenames is also available directly on os (os.sep, os.pathsep, os.devnull ...). To show both platforms the examples import posixpath and ntpath explicitly.",

  covers: ['sep', 'altsep', 'extsep', 'curdir', 'pardir', 'pathsep', 'defpath', 'devnull', 'supports_unicode_filenames'],

  cheat: {
    commonCall: "os.environ['PATH'].split(os.pathsep)",
    returns:    "sep '/' or '\\\\', pathsep ':' or ';', devnull '/dev/null' or 'nul'",
    replaces:   "Hard-coded '/', ':' and '/dev/null'",
    watchOut:   'Splitting paths on sep misses altsep on Windows: use os.path.split or pathlib',
  },

  parameters: [],

  patterns: [
    {
      name: 'Split and extend PATH-like variables',
      desc: 'pathsep is the separator between entries of PATH, PYTHONPATH and similar variables.',
      code: "import os\ndirs = os.environ.get('PATH', os.defpath).split(os.pathsep)\nos.environ['PATH'] = os.pathsep.join(['/opt/tool/bin', *dirs])",
    },
    {
      name: 'Throw away a subprocess output',
      desc: 'devnull names the null device; subprocess.DEVNULL is usually simpler.',
      code: "import os, subprocess\nwith open(os.devnull, 'w') as sink:\n    subprocess.run(['git', 'status'], stdout=sink)",
    },
    {
      name: 'Accept both separators',
      desc: 'On Windows a path may use / or \\; altsep is None on POSIX, so filter it out.',
      code: "import os\nseps = tuple(s for s in (os.sep, os.altsep) if s)\nis_dir_like = 'logs/'.endswith(seps)",
    },
  ],

  examples: [
    {
      title: 'sep and altsep on each platform',
      code: "import posixpath, ntpath\n(posixpath.sep, posixpath.altsep, ntpath.sep, ntpath.altsep)",
      returns: "('/', None, '\\\\', '/')",
    },
    {
      title: 'pathsep separates PATH entries',
      code: "import posixpath, ntpath\n(posixpath.pathsep, ntpath.pathsep)",
      returns: "(':', ';')",
    },
    {
      title: 'Splitting a PATH value',
      code: "import posixpath\n'/usr/local/bin:/usr/bin:/bin'.split(posixpath.pathsep)",
      returns: "['/usr/local/bin', '/usr/bin', '/bin']",
    },
    {
      title: 'curdir, pardir and extsep are the same everywhere',
      code: "import posixpath, ntpath\n(posixpath.curdir, posixpath.pardir, posixpath.extsep) == (ntpath.curdir, ntpath.pardir, ntpath.extsep) == ('.', '..', '.')",
      returns: 'True',
    },
    {
      title: 'The null device and the default search path',
      code: "import posixpath, ntpath\n(posixpath.devnull, ntpath.devnull, posixpath.defpath, ntpath.defpath)",
      returns: "('/dev/null', 'nul', '/bin:/usr/bin', '.;C:\\\\bin')",
    },
    {
      title: 'os re-exports the same values',
      code: "import os\nall(getattr(os, n) == getattr(os.path, n) for n in ['sep', 'altsep', 'extsep', 'curdir', 'pardir', 'pathsep', 'defpath', 'devnull'])",
      returns: 'True',
    },
    {
      title: 'supports_unicode_filenames is os.path only',
      code: "import os, ntpath\n(ntpath.supports_unicode_filenames, hasattr(os, 'supports_unicode_filenames'))",
      returns: '(True, False)',
    },
    {
      title: 'Writing to devnull discards the data',
      code: "import os\nwith open(os.devnull, 'w') as f:\n    n = f.write('gone')\nn",
      returns: '4',
    },
  ],

  pitfalls: [
    {
      name: 'Splitting a Windows path on sep only',
      desc: "Windows accepts both \\ and /, and user input often mixes them. split(sep) misses the forward slashes; PureWindowsPath (or ntpath.split) knows both.",
      wrong: { label: "split(ntpath.sep)", code: "import ntpath\nr'C:/data\\logs\\app.txt'.split(ntpath.sep)", output: "['C:/data', 'logs', 'app.txt']" },
      fix:   { label: 'PureWindowsPath.parts', code: "from pathlib import PureWindowsPath\nPureWindowsPath(r'C:/data\\logs\\app.txt').parts", output: "('C:\\\\', 'data', 'logs', 'app.txt')" },
    },
    {
      name: 'Mixing up sep and pathsep',
      desc: 'sep separates folders inside one path; pathsep separates whole paths in PATH-like variables.',
      wrong: { label: 'split on sep', code: "import posixpath\n'/usr/bin:/bin'.split(posixpath.sep)", output: "['', 'usr', 'bin:', 'bin']" },
      fix:   { label: 'split on pathsep', code: "import posixpath\n'/usr/bin:/bin'.split(posixpath.pathsep)", output: "['/usr/bin', '/bin']" },
    },
    {
      name: 'Gluing paths together with sep',
      desc: 'String concatenation doubles separators and ignores absolute parts; join handles both.',
      wrong: { label: "'a/' + sep + 'b'", code: "import posixpath\n'data/' + posixpath.sep + 'file.txt'", output: "'data//file.txt'" },
      fix:   { label: 'join', code: "import posixpath\nposixpath.join('data/', 'file.txt')", output: "'data/file.txt'" },
    },
  ],

  when: {
    use: [
      'Splitting or building PATH-like environment variables (pathsep)',
      'Opening the null device by name (devnull)',
      'Checking whether a string ends with a separator, accepting altsep too',
    ],
    avoid: [
      'Joining or splitting paths → os.path.join / os.path.split / pathlib',
      'Line endings → os.linesep is a different constant, and text mode already translates \\n',
      'Silencing subprocess output → subprocess.DEVNULL',
    ],
  },

  notes: {
    cpython:    'Plain module-level assignments at the top of Lib/posixpath.py and Lib/ntpath.py; Lib/os.py re-exports eight of them with from os.path import curdir, pardir, sep, pathsep, defpath, extsep, altsep, devnull',
    'posixpath': "sep '/', altsep None, pathsep ':', defpath '/bin:/usr/bin', devnull '/dev/null'. supports_unicode_filenames is True only on macOS (sys.platform == 'darwin')",
    'ntpath':    "sep '\\\\', altsep '/', pathsep ';', defpath '.;C:\\\\bin', devnull 'nul', supports_unicode_filenames True",
    'Everywhere': "curdir '.', pardir '..', extsep '.'",
  },

  related: [
    { name: 'os.sep and friends', slug: 'sep', category: 'stdlib/os', when: 'The same constants on the os module' },
    { name: 'os.path.join', slug: 'join', when: 'Build paths without touching sep' },
    { name: 'os.path.split', slug: 'split', when: 'Split paths (knows altsep)' },
    { name: 'os.path.splitext', slug: 'splitext', when: 'Split at the extsep dot' },
    { name: 'PureWindowsPath', slug: 'purewindowspath', category: 'stdlib/pathlib', when: 'Windows path rules on any OS' },
    { name: 'os.path module', slug: 'os-path', category: 'stdlib', when: 'All os.path functions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'The values depend on the operating system running Python, and a browser has none. The examples import posixpath and ntpath by name, which works on every OS, so they show both sets of values.',
    },
    {
      q: 'What is the difference between os.sep and os.path.sep?',
      a: 'None: os takes sep, altsep, extsep, curdir, pardir, pathsep, defpath and devnull from os.path, so the values are equal. supports_unicode_filenames is the exception: it exists only on os.path.',
    },
    {
      q: 'What is os.pathsep in Python?',
      a: "The character between entries of PATH-like environment variables: ':' on Linux and macOS, ';' on Windows. Not to be confused with os.sep, the separator inside one path ('/' or '\\\\').",
    },
    {
      q: 'Should I build paths with os.sep?',
      a: "Rarely. os.path.join and pathlib handle separators, absolute parts and Windows drives for you. os.sep is useful for display or for tests like path.endswith(os.sep).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.sep',
    meta:  'os.sep, os.pathsep, os.devnull ... (also available via os.path)',
  },
};
