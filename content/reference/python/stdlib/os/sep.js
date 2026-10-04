// content/reference/python/stdlib/os/sep.js

export const meta = {
  slug:        'sep',
  name:        'os.sep',
  signature:   'os.sep, os.altsep, os.extsep, os.curdir, os.pardir, os.pathsep, os.linesep, os.defpath, os.devnull, os.name, os.path',
  blurb:       "The operating system's path and line constants: separator characters, '.' and '..', the PATH separator, the line ending, the null device, the OS family name, and the os.path module itself.",
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3 (all)',
  searchTerms: 'os.sep sep os.altsep altsep os.extsep extsep os.curdir curdir os.pardir pardir os.pathsep pathsep os.linesep linesep os.defpath defpath os.devnull devnull os.name name os.path path os.TMP_MAX TMP_MAX path separator python backslash forward slash windows linux line ending crlf null device dev null nul posix nt posixpath ntpath',
};

export const method = {
  slug:      'sep',
  name:      'os.sep',
  signature: 'os.sep, os.altsep, os.extsep, os.curdir, os.pardir, os.pathsep, os.linesep, os.defpath, os.devnull, os.name, os.path',
  returns:   { type: 'str | None | module', desc: "Strings fixed for the running OS ('/' or '\\\\', ':' or ';' ...); altsep is None on POSIX; os.path is the posixpath or ntpath module." },

  category:    'os constants',
  version:     'Python 3 (all)',
  hasLiveDemo: false,

  subtitle: "Every value here depends on the OS Python runs on: os.sep is '/' on Linux and macOS and a backslash on Windows. os.path itself is just an alias - it IS the posixpath module on Linux/macOS and the ntpath module on Windows - so you can import either one directly to get the other platform's values and rules anywhere.",

  covers: ['sep', 'altsep', 'extsep', 'curdir', 'pardir', 'pathsep', 'linesep', 'defpath', 'devnull', 'name', 'path', 'TMP_MAX'],

  cheat: {
    commonCall: 'os.path.join(folder, name)  # instead of folder + os.sep + name',
    returns:    "'/' on POSIX, '\\\\' on Windows (os.sep)",
    replaces:   "Hard-coded '/', '\\\\', ':', ';', '\\\\r\\\\n' and '/dev/null'",
    watchOut:   "Never write os.linesep to a text-mode file - write '\\\\n'",
  },

  patterns: [
    {
      name: 'Silence a child process',
      desc: 'os.devnull is the right null device name on every OS (subprocess.DEVNULL does the same without opening a file).',
      code: "import os\nimport subprocess\nwith open(os.devnull, 'w') as sink:\n    subprocess.run(['git', 'fetch'], stdout=sink, stderr=sink)",
    },
    {
      name: 'Split PATH-style variables',
      desc: 'os.pathsep is the separator between entries of PATH, PYTHONPATH and similar variables.',
      code: "import os\ndirs = os.environ.get('PATH', os.defpath).split(os.pathsep)",
    },
    {
      name: "Use the other platform's path rules",
      desc: 'os.path is posixpath or ntpath; import the other one to handle foreign paths (URLs, zip members, Windows paths read on Linux).',
      code: "import ntpath\nimport posixpath\nposixpath.join('static', 'img', 'logo.png')   # always '/'\nntpath.splitdrive('C:\\\\Users\\\\ada')          # Windows rules on any OS",
    },
    {
      name: 'Branch on the OS family',
      desc: "os.name is 'posix' or 'nt'. Use sys.platform to tell Linux from macOS.",
      code: "import os\nimport sys\nif os.name == 'nt':\n    config_dir = os.environ['APPDATA']\nelif sys.platform == 'darwin':\n    config_dir = os.path.expanduser('~/Library/Application Support')\nelse:\n    config_dir = os.path.expanduser('~/.config')",
    },
  ],

  examples: [
    { title: 'Both separators, on any OS',          code: "import ntpath\nimport posixpath\n(posixpath.sep, ntpath.sep, posixpath.altsep, ntpath.altsep)", returns: "('/', '\\\\', None, '/')" },
    { title: 'os.path is posixpath or ntpath',      code: "import ntpath\nimport os\nimport posixpath\n(os.path in (posixpath, ntpath), os.path.sep == os.sep, os.name in ('posix', 'nt'))", returns: '(True, True, True)' },
    { title: 'pathsep splits PATH',                 code: "import posixpath\n'/usr/local/bin:/usr/bin'.split(posixpath.pathsep)", returns: "['/usr/local/bin', '/usr/bin']" },
    { title: 'curdir and pardir',                   code: "import posixpath\nposixpath.normpath(posixpath.join('a', posixpath.curdir, 'b', posixpath.pardir, 'c'))", returns: "'a/c'" },
    { title: 'extsep builds a file name',           code: "import os\n'report' + os.extsep + 'csv'", returns: "'report.csv'" },
    { title: 'defpath and devnull per platform',    code: "import ntpath\nimport posixpath\n[(posixpath.defpath, posixpath.devnull), (ntpath.defpath, ntpath.devnull)]", returns: "[('/bin:/usr/bin', '/dev/null'), ('.;C:\\\\bin', 'nul')]" },
    { title: 'Writing to os.devnull discards',      code: "import os\nwith open(os.devnull, 'w') as f:\n    n = f.write('discarded')\n(n, open(os.devnull).read())", returns: "(9, '')" },
    { title: 'linesep is one of two values',        code: "import os\nos.linesep in ('\\n', '\\r\\n')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Splitting a Windows path on os.sep',
      desc: "Windows accepts '/' too (that is altsep), so splitting on the backslash alone misses separators. Let the path module split it.",
      wrong: { label: 'split(sep)',  code: "import ntpath\n'C:/data/report.txt'.split(ntpath.sep)", output: "['C:/data/report.txt']" },
      fix:   { label: 'ntpath.split', code: "import ntpath\nntpath.split('C:/data/report.txt')",   output: "('C:/data', 'report.txt')" },
    },
    {
      name: 'Writing os.linesep in text mode',
      desc: "Text mode already turns '\\n' into the platform line ending. On Windows os.linesep is '\\r\\n', so writing it produces '\\r\\r\\n'. Here newline='\\r\\n' makes the file behave like a Windows text file on every OS.",
      wrong: { label: 'write os.linesep', code: "with open('out.txt', 'w', newline='\\r\\n') as f:\n    f.write('line' + '\\r\\n')\nopen('out.txt', 'rb').read()", output: "b'line\\r\\r\\n'" },
      fix:   { label: "write '\\n'",      code: "with open('out.txt', 'w', newline='\\r\\n') as f:\n    f.write('line' + '\\n')\nopen('out.txt', 'rb').read()",   output: "b'line\\r\\n'" },
    },
    {
      name: 'Confusing sep and pathsep',
      desc: 'sep separates the parts of ONE path; pathsep separates whole paths in a list such as PATH.',
      wrong: { label: 'split(sep)',     code: "import posixpath\n'/usr/bin:/bin'.split(posixpath.sep)",     output: "['', 'usr', 'bin:', 'bin']" },
      fix:   { label: 'split(pathsep)', code: "import posixpath\n'/usr/bin:/bin'.split(posixpath.pathsep)", output: "['/usr/bin', '/bin']" },
    },
  ],

  when: {
    use: [
      'Splitting PATH-like variables (pathsep), discarding output (devnull), branching on the OS family (name)',
      "Handling the other platform's paths: import posixpath or ntpath directly",
    ],
    avoid: [
      'Joining or splitting paths by hand → os.path.join / os.path.split or pathlib',
      'Line endings in text files → write "\\n" and let text mode translate',
      'Telling Linux from macOS → sys.platform or platform.system()',
      'Temporary file names (TMP_MAX) → the tempfile module',
    ],
  },

  notes: {
    cpython:      "Lib/os.py: on POSIX it sets name = 'posix', linesep = '\\n' and does import posixpath as path; on Windows name = 'nt', linesep = '\\r\\n', import ntpath as path. It then registers sys.modules['os.path'] = path and imports curdir, pardir, sep, pathsep, defpath, extsep, altsep and devnull from it - so os.sep is os.path.sep",
    'Values':     "posixpath: sep '/', altsep None, pathsep ':', defpath '/bin:/usr/bin', devnull '/dev/null'. ntpath: sep '\\\\', altsep '/', pathsep ';', defpath '.;C:\\\\bin', devnull 'nul'. Both: extsep '.', curdir '.', pardir '..'",
    'os.name':    "'posix' on Linux and macOS, 'nt' on Windows. The docs also list 'java' as registered. sys.platform ('linux', 'darwin', 'win32') is finer-grained",
    'TMP_MAX':    'Undocumented: the C library TMP_MAX limit (how many unique names tmpnam() can generate) - 238328 on Linux glibc and 2147483647 on Windows CPython 3.13. Python no longer has tmpnam; use tempfile',
  },

  related: [
    { name: 'os.path module', slug: 'os-path', when: 'The functions that use these constants', category: 'stdlib' },
    { name: 'os.path.join', slug: 'join', when: 'Build paths without touching sep', category: 'stdlib/os-path' },
    { name: 'os.path.split', slug: 'split', when: 'Split off the last component', category: 'stdlib/os-path' },
    { name: 'os.path.sep', slug: 'sep', when: 'The same constants via os.path', category: 'stdlib/os-path' },
    { name: 'pathlib posixpath / ntpath', slug: 'posixpath', when: 'Pure path classes for either flavour', category: 'stdlib/pathlib' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: "Every value here depends on the OS running Python, so a live result would only show our server's values. The examples compare against posixpath and ntpath, which have fixed values on every machine. Note that os.name is 'posix' on macOS as well as Linux; use sys.platform ('darwin') or platform.system() ('Darwin') to tell them apart.",
    },
    {
      q: 'Should I use os.sep or "/" in Python paths?',
      a: "Neither, usually: os.path.join and pathlib insert the right separator. Windows also accepts '/' in most APIs (ntpath.altsep is '/'), but paths Python returns on Windows use the backslash.",
    },
    {
      q: 'What is the difference between os.sep and os.pathsep?',
      a: "os.sep separates directories inside one path ('/' or '\\\\'); os.pathsep separates paths in a list like the PATH variable (':' on POSIX, ';' on Windows).",
    },
    {
      q: 'Is os.path a module?',
      a: "Yes - os imports posixpath or ntpath under the name path and registers it as sys.modules['os.path']. That is why import os.path works and why posixpath and ntpath can be imported directly for platform-independent results.",
    },
    {
      q: 'Should I use os.linesep when writing files?',
      a: "Not in text mode: write '\\n' and Python translates it to the platform ending. os.linesep is for binary-mode output or text opened with newline=''.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.sep',
    meta:  'os.sep and path constants',
  },
};
