// content/reference/python/stdlib/os-path/splitroot.js

export const meta = {
  slug:        'splitroot',
  name:        'os.path.splitroot',
  signature:   'os.path.splitroot(path) → (drive, root, tail) / os.path.splitdrive(path) → (drive, rest)',
  blurb:       'Take a path apart at the front: splitroot gives (drive, root, tail), splitdrive gives (drive, rest). On POSIX the drive is always empty; on Windows it is C: or a UNC share.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.12+ (splitdrive: all versions)',
  searchTerms: 'os.path.splitroot splitroot os.path.splitdrive splitdrive drive letter root tail unc share windows path parts python get drive from path posixpath ntpath',
};

export const method = {
  slug:      'splitroot',
  name:      'os.path.splitroot',
  signature: 'os.path.splitroot(path) → (drive, root, tail) / os.path.splitdrive(path) → (drive, rest)',
  returns:   { type: 'tuple[str, str, str] | tuple[str, str]', desc: 'Pieces that concatenate back to the original path.' },

  category:    'os.path function',
  version:     'Python 3.12+ (splitdrive: all versions)',
  hasLiveDemo: true,

  subtitle: "splitroot (3.12+) is the primitive the other functions are built on: drive + root + tail == path, always. POSIX has no drives, a root of '/' (or exactly '//', which POSIX leaves implementation-defined). Windows drives are 'C:', '\\\\server\\share' or device names like '\\\\?\\C:'.",

  covers: ['splitroot', 'splitdrive'],

  cheat: {
    commonCall: 'drive, root, tail = os.path.splitroot(path)',
    returns:    "('C:', '\\\\', 'Users\\\\ada')",
    replaces:   "path[:2] tricks for drive letters",
    watchOut:   "posixpath: '//x' keeps both slashes as the root, '///x' only one",
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike', required: true, default: null, desc: 'Any path.' },
  ],

  modes: [
    {
      id: 'both',
      label: 'POSIX vs Windows',
      blurb: 'posixpath.splitroot and ntpath.splitroot side by side.',
      params: [{ name: 'path', type: 'str', hint: 'any path', input: 'text' }],
      template: 'import posixpath, ntpath\n(posixpath.splitroot({$path}), ntpath.splitroot({$path}))',
      cases: [
        { id: 'posix', label: 'POSIX absolute', values: { path: '/home/ada' } },
        { id: 'drive', label: 'drive letter',   values: { path: 'C:\\Users\\ada' } },
        { id: 'unc',   label: 'UNC share',      values: { path: '//server/share/docs/a.txt' } },
        { id: 'drel',  label: 'drive-relative', values: { path: 'C:Users' } },
      ],
    },
    {
      id: 'drive',
      label: 'splitdrive',
      blurb: 'The older two-part split: (drive, everything else).',
      params: [{ name: 'path', type: 'str', hint: 'any path', input: 'text' }],
      template: 'import posixpath, ntpath\n(posixpath.splitdrive({$path}), ntpath.splitdrive({$path}))',
      cases: [
        { id: 'win', label: 'Windows path', values: { path: 'D:\\data\\in.csv' } },
        { id: 'rel', label: 'relative',     values: { path: 'data/in.csv' } },
      ],
    },
  ],
  demoExplainer: "posixpath never finds a drive — 'C:\\Users\\ada' is a relative name to it. ntpath recognises 'C:' and a root of '\\'; for '//server/share/docs/a.txt' the whole '//server/share' is the drive and the following '/' is the root (ntpath keeps your slash style). 'C:Users' has a drive but no root: relative to the current folder of drive C. splitdrive is splitroot with the root glued back onto the tail.",

  patterns: [
    {
      name: 'Is this a UNC path?',
      desc: 'The drive of a UNC path starts with two separators.',
      code: "import ntpath\ndrive = ntpath.splitroot(p)[0]\nis_unc = drive[:2] in ('\\\\\\\\', '//')",
    },
    {
      name: 'Strip the drive for display',
      desc: 'Keep root and tail.',
      code: "import os\ndrive, rest = os.path.splitdrive(path)",
    },
  ],

  examples: [
    { title: 'POSIX: root and tail',        code: "import posixpath\nposixpath.splitroot('/home/ada')", returns: "('', '/', 'home/ada')" },
    { title: 'POSIX: exactly two slashes stay', code: "import posixpath\n(posixpath.splitroot('//srv/x'), posixpath.splitroot('///srv/x'))", returns: "(('', '//', 'srv/x'), ('', '/', '//srv/x'))" },
    { title: 'Relative: no root',           code: "import posixpath\nposixpath.splitroot('docs/a.txt')", returns: "('', '', 'docs/a.txt')" },
    { title: 'Windows drive',               code: "import ntpath\nntpath.splitroot(r'C:\\Users\\ada')", returns: "('C:', '\\\\', 'Users\\\\ada')" },
    { title: 'Windows UNC share',           code: "import ntpath\nntpath.splitroot(r'\\\\server\\share\\docs\\a.txt')", returns: "('\\\\\\\\server\\\\share', '\\\\', 'docs\\\\a.txt')" },
    { title: 'splitdrive',                  code: "import ntpath\nntpath.splitdrive(r'C:\\Users\\ada')", returns: "('C:', '\\\\Users\\\\ada')" },
    { title: 'POSIX has no drives',         code: "import posixpath\nposixpath.splitdrive('/home/ada')", returns: "('', '/home/ada')" },
  ],

  pitfalls: [
    {
      name: 'Slicing the drive letter by hand',
      desc: "p[:2] is not a drive for relative paths or UNC shares.",
      wrong: { label: 'p[:2]', code: "[p[:2] for p in ['docs', r'\\\\srv\\share\\x']]", output: "['do', '\\\\\\\\']" },
      fix:   { label: 'splitdrive', code: "import ntpath\n[ntpath.splitdrive(p)[0] for p in ['docs', r'\\\\srv\\share\\x']]", output: "['', '\\\\\\\\srv\\\\share']" },
    },
    {
      name: 'Assuming a drive means absolute',
      desc: "'C:Users' has a drive but no root — it is relative to drive C's current folder.",
      wrong: { label: 'drive only', code: "import ntpath\nbool(ntpath.splitdrive('C:Users')[0])", output: 'True' },
      fix:   { label: 'drive and root', code: "import ntpath\ndrive, root, tail = ntpath.splitroot('C:Users')\nbool(drive and root)", output: 'False' },
    },
  ],

  when: {
    use: [
      'Taking a path apart into drive, root and the rest',
      'Code that handles Windows paths on any OS (via ntpath)',
    ],
    avoid: [
      'pathlib code → PurePath.drive, .root, .anchor',
      'Just "is it absolute?" → isabs',
    ],
  },

  notes: {
    cpython:   'Both modules have a C implementation (Modules/posixmodule.c) with a pure-Python fallback; splitdrive is built on splitroot',
    'Added':   'splitroot in 3.12',
    'POSIX //': 'IEEE Std 1003.1-2017, 4.13 Pathname Resolution: two leading slashes may be interpreted in an implementation-defined way, so posixpath keeps them; three or more mean the same as one',
  },

  related: [
    { name: 'os.path.isabs', slug: 'isabs', when: 'Absolute = drive + root (Windows) or root (POSIX)' },
    { name: 'os.path.split', slug: 'split', when: 'Split at the other end' },
    { name: 'PurePath.drive / root / anchor', slug: 'parts', when: 'The pathlib attributes', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I get the drive letter of a path in Python?',
      a: "os.path.splitdrive(path)[0] on Windows ('C:'). Anywhere, for Windows-style paths: ntpath.splitdrive(path)[0]. On POSIX the drive is always ''.",
    },
    {
      q: 'What is the difference between splitroot and splitdrive?',
      a: 'splitroot (3.12+) returns three parts — drive, root, tail — so you can tell C:\\x from C:x. splitdrive returns two: the drive and everything else.',
    },
    {
      q: 'Why does posixpath keep two leading slashes?',
      a: "POSIX says a path starting with exactly two slashes may have an implementation-defined meaning, so normpath and splitroot preserve '//'. Three or more slashes are treated as one.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.splitroot',
    meta:  'os.path.splitroot / splitdrive',
  },
};
