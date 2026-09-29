// content/reference/python/stdlib/pathlib/purewindowspath.js

export const meta = {
  slug:        'purewindowspath',
  name:        'pathlib.PureWindowsPath',
  signature:   'pathlib.PureWindowsPath(*pathsegments)',
  blurb:       'Windows path rules — drive letters, backslashes, UNC shares, case-insensitive comparison — available on every OS without touching a disk.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.4+',
  searchTerms: 'purewindowspath windows path python backslash drive letter unc path \\\\server\\share case insensitive windows path on linux ntpath convert windows path to posix as_posix',
};

export const method = {
  slug:      'purewindowspath',
  name:      'pathlib.PureWindowsPath',
  signature: 'pathlib.PureWindowsPath(*pathsegments)',
  returns:   { type: 'PureWindowsPath', desc: 'A pure path with Windows semantics.' },

  category:    'pathlib class',
  version:     'Python 3.4+',
  hasLiveDemo: false,

  subtitle: 'Parse, join and compare Windows paths the way Windows does — on Linux and macOS too. Both "\\" and "/" separate; a drive plus a root makes a path absolute; case is ignored when comparing.',

  covers: ['PureWindowsPath'],

  cheat: {
    commonCall: "PureWindowsPath(r'C:\\Users\\ada\\notes.txt')",
    returns:    "PureWindowsPath('C:/Users/ada/notes.txt') — repr always uses /",
    replaces:   'ntpath.join / ntpath.splitdrive on strings',
    watchOut:   "'/foo' and 'C:foo' are NOT absolute on Windows",
  },

  parameters: [
    { name: '*pathsegments', type: 'str | os.PathLike', required: false, default: "'.'", desc: 'Segments joined with Windows rules: a new drive replaces everything; a new root keeps the current drive.' },
  ],

  patterns: [
    {
      name: 'Convert a Windows path to forward slashes',
      desc: 'as_posix() is the portable way to show or store it.',
      code: "from pathlib import PureWindowsPath\nPureWindowsPath(r'C:\\data\\in.csv').as_posix()  # 'C:/data/in.csv'",
    },
    {
      name: 'Case-insensitive lookups',
      desc: 'Equality and hashing ignore case, so a set of PureWindowsPath de-duplicates like Windows does.',
      code: "from pathlib import PureWindowsPath\nfiles = {PureWindowsPath(p) for p in ['C:/A.TXT', 'c:/a.txt']}\nlen(files)  # 1",
    },
    {
      name: 'Handle paths from a Windows config on a Linux server',
      desc: 'Parse with Windows rules, then keep only the parts you need.',
      code: "from pathlib import PurePosixPath, PureWindowsPath\nwin = PureWindowsPath(config['share_path'])\nlocal = PurePosixPath('/mnt/share', *win.parts[1:])",
    },
  ],

  examples: [
    { title: 'Backslashes and slashes both separate', code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:/Users\\\\ada\\\\notes.txt')", returns: "PureWindowsPath('C:/Users/ada/notes.txt')" },
    { title: 'str() uses backslashes',      code: "from pathlib import PureWindowsPath\nstr(PureWindowsPath('C:/Users/ada'))", returns: "'C:\\\\Users\\\\ada'" },
    { title: 'drive, root, anchor',         code: "from pathlib import PureWindowsPath\np = PureWindowsPath('C:/Users')\n(p.drive, p.root, p.anchor)", returns: "('C:', '\\\\', 'C:\\\\')" },
    { title: 'A UNC share is one drive',    code: "from pathlib import PureWindowsPath\nPureWindowsPath('//server/share/q3.xlsx').drive", returns: "'\\\\\\\\server\\\\share'" },
    { title: 'Comparison ignores case',     code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:/A.TXT') == PureWindowsPath('c:/a.txt')", returns: 'True' },
    { title: 'A new drive replaces the path; a new root keeps the drive', code: "from pathlib import PureWindowsPath\n(PureWindowsPath('C:/a') / 'D:/b', PureWindowsPath('C:/a') / '/b')", returns: "(PureWindowsPath('D:/b'), PureWindowsPath('C:/b'))" },
    { title: 'Reserved device names (deprecated check)', code: "import warnings\nfrom pathlib import PureWindowsPath\nwith warnings.catch_warnings():\n    warnings.simplefilter('ignore', DeprecationWarning)\n    reserved = PureWindowsPath('nul').is_reserved()\nreserved", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Thinking "/foo" is absolute on Windows',
      desc: 'Windows needs both a drive and a root. "/foo" is relative to the current drive, "C:foo" to the current directory of drive C.',
      wrong: { label: 'root only', code: "from pathlib import PureWindowsPath\nPureWindowsPath('/foo').is_absolute()", output: 'False' },
      fix:   { label: 'drive + root', code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:/foo').is_absolute()", output: 'True' },
    },
    {
      name: 'Parsing a Windows path with the POSIX flavour',
      desc: 'On Linux and macOS, Path and PurePosixPath treat "\\" as an ordinary character — the whole string becomes one part.',
      wrong: { label: 'PurePosixPath', code: "from pathlib import PurePosixPath\nPurePosixPath('C:\\\\data\\\\in.csv').name", output: "'C:\\\\data\\\\in.csv'" },
      fix:   { label: 'PureWindowsPath', code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:\\\\data\\\\in.csv').name", output: "'in.csv'" },
    },
    {
      name: 'Matching patterns case-sensitively by accident',
      desc: 'match() and full_match() follow the flavour: case-insensitive on PureWindowsPath, case-sensitive on PurePosixPath. Pass case_sensitive= to force either.',
      wrong: { label: 'posix default', code: "from pathlib import PurePosixPath\nPurePosixPath('/x/REPORT.PDF').match('*.pdf')", output: 'False' },
      fix:   { label: 'case_sensitive=False', code: "from pathlib import PurePosixPath\nPurePosixPath('/x/REPORT.PDF').match('*.pdf', case_sensitive=False)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Reading Windows paths from configs, logs or databases on any OS',
      'Tests of Windows path handling that must run on Linux CI',
    ],
    avoid: [
      'Real file access on Windows → Path (it is a WindowsPath there)',
      'Normalising case or ".." → only resolve() on the real machine can do that reliably',
    ],
  },

  notes: {
    cpython:          'PurePath with parser = ntpath (Lib/ntpath.py: splitroot, join, normcase)',
    'repr vs str':    'repr() shows forward slashes; str() shows backslashes',
    'is_reserved()':  'Deprecated since 3.13, removed in 3.15 — use os.path.isreserved() (Windows) instead; always False for POSIX paths',
    'Absolute':       'Needs a drive AND a root: C:\\x or \\\\server\\share\\x',
  },

  related: [
    { name: 'PurePath / PurePosixPath', slug: 'purepath', when: 'The POSIX flavour and the base class' },
    { name: 'PosixPath / WindowsPath', slug: 'posixpath', when: 'The concrete classes Path creates' },
    { name: 'as_posix / as_uri', slug: 'as_posix', when: 'Forward slashes and file: URIs' },
    { name: 'is_absolute / is_reserved', slug: 'is_absolute', when: 'The drive + root rule' },
  ],

  faq: [
    {
      q: 'How do I handle Windows paths on Linux in Python?',
      a: "Use PureWindowsPath: it understands drive letters, backslashes and UNC shares on any OS. PureWindowsPath(r'C:\\data\\in.csv').name is 'in.csv' even on Linux.",
    },
    {
      q: 'How do I convert backslashes to forward slashes?',
      a: 'PureWindowsPath(text).as_posix(). On a Windows machine Path(text).as_posix() does the same.',
    },
    {
      q: 'Why does the repr show forward slashes when str() shows backslashes?',
      a: 'PurePath.__repr__ is built from as_posix(), for every flavour; str() gives the native form that system calls expect. Both parse back to the same PureWindowsPath.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PureWindowsPath',
    meta:  'pathlib.PureWindowsPath',
  },
};
