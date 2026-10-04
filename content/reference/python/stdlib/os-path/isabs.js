// content/reference/python/stdlib/os-path/isabs.js

export const meta = {
  slug:        'isabs',
  name:        'os.path.isabs',
  signature:   'os.path.isabs(path)',
  blurb:       "Is the path absolute? On POSIX: does it start with '/'. On Windows: does it start with a drive and a root (C:\\) or two slashes (UNC). Pure string test.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (Windows rule changed in 3.13)',
  searchTerms: 'os.path.isabs isabs absolute path check python is path absolute or relative windows drive letter unc posixpath.isabs ntpath.isabs 3.13 change single backslash',
};

export const method = {
  slug:      'isabs',
  name:      'os.path.isabs',
  signature: 'os.path.isabs(path)',
  returns:   { type: 'bool', desc: 'True for an absolute path. The file system is not consulted.' },

  category:    'os.path function',
  version:     'Python 3.0+ (Windows rule changed in 3.13)',
  hasLiveDemo: true,

  subtitle: "posixpath.isabs is s.startswith('/'). ntpath.isabs wants 'X:\\' (or 'X:/') or a leading double slash. Since Python 3.13, '\\Windows' — rooted but without a drive — is no longer absolute on Windows, because it depends on the current drive.",

  covers: ['isabs'],

  cheat: {
    commonCall: 'os.path.isabs(path)',
    returns:    'True / False',
    replaces:   "path.startswith('/') — wrong on Windows",
    watchOut:   "'~/x' is not absolute (expanduser first); 'C:x' is not absolute on Windows",
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike', required: true, default: null, desc: 'Any path.' },
  ],

  modes: [
    {
      id: 'table',
      label: 'POSIX vs Windows',
      blurb: 'Each path through posixpath.isabs and ntpath.isabs (Python 3.13 rules).',
      params: [{ name: 'paths', type: 'list[str]', hint: 'paths, comma-separated', input: 'csv' }],
      template: 'import posixpath, ntpath\n[(p, posixpath.isabs(p), ntpath.isabs(p)) for p in {$paths}]',
      cases: [
        { id: 'mix',   label: 'common forms', values: { paths: '/etc/hosts, C:\\Windows, C:Windows, docs' } },
        { id: 'unc',   label: 'UNC and ~',    values: { paths: '\\\\server\\share, //server/share, ~/notes' } },
      ],
    },
  ],
  demoExplainer: "Only POSIX thinks '/etc/hosts' is absolute: on Windows 3.13+ it is rooted on the current drive, so ntpath.isabs says False (Python 3.12 and earlier said True). 'C:\\Windows' is absolute on Windows only; 'C:Windows' means \"Windows in the current folder of drive C\" and is relative everywhere. UNC paths count as absolute on Windows in either slash style, and '~/notes' is relative until expanduser replaces the tilde.",

  patterns: [
    {
      name: 'Resolve relative config paths against a base',
      desc: 'Leave absolute paths alone.',
      code: "import os\nif not os.path.isabs(path):\n    path = os.path.join(BASE_DIR, path)",
    },
    {
      name: 'Require an absolute path argument',
      desc: 'Fail early with a clear message.',
      code: "import os\nif not os.path.isabs(target):\n    raise ValueError(f'expected an absolute path, got {target!r}')",
    },
  ],

  examples: [
    { title: 'POSIX: a leading slash',      code: "import posixpath\n(posixpath.isabs('/etc/hosts'), posixpath.isabs('etc/hosts'))", returns: '(True, False)' },
    { title: 'Windows: drive plus root',    code: "import ntpath\n(ntpath.isabs(r'C:\\Windows'), ntpath.isabs('C:Windows'))", returns: '(True, False)' },
    { title: 'Windows: UNC share',          code: "import ntpath\nntpath.isabs(r'\\\\server\\share\\x')", returns: 'True' },
    { title: 'Windows 3.13+: no drive, not absolute', code: "import ntpath\nntpath.isabs('/etc')", returns: 'False' },
    { title: 'A tilde is just a character', code: "import posixpath\nposixpath.isabs('~/notes')", returns: 'False' },
    { title: 'abspath always is',           code: "import os\nos.path.isabs(os.path.abspath('x'))", returns: 'True' },
  ],

  pitfalls: [
    {
      name: "Testing startswith('/') yourself",
      desc: 'That is the POSIX rule only; it misses C:\\ paths and accepts drive-less roots on Windows.',
      wrong: { label: "startswith('/')", code: "[p.startswith('/') for p in [r'C:\\Users', '/tmp']]", output: '[False, True]' },
      fix:   { label: 'ntpath.isabs (Windows rules)', code: "import ntpath\n[ntpath.isabs(p) for p in [r'C:\\Users', '/tmp']]", output: '[True, False]' },
    },
    {
      name: 'Forgetting to expand ~',
      desc: "isabs does not know about home directories. Expand first, then test.",
      wrong: { label: "isabs('~/x')", code: "import posixpath\nposixpath.isabs('~/data')", output: 'False' },
      fix:   { label: 'expanduser first', code: "import os, posixpath\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'HOME': '/home/ada'}):\n    result = posixpath.isabs(posixpath.expanduser('~/data'))\nresult", output: 'True' },
    },
  ],

  when: {
    use: [
      'Deciding whether to join a path onto a base folder',
    ],
    avoid: [
      'pathlib code → PurePath.is_absolute()',
      'Checking existence → os.path.exists',
    ],
  },

  notes: {
    cpython:   "posixpath: s.startswith('/'). ntpath (3.13): take the first 3 characters with / turned into \\, then test for ':\\' at index 1 or a leading '\\\\'",
    'Changed in 3.13': 'On Windows, returns False for a path that starts with exactly one (back)slash',
  },

  related: [
    { name: 'os.path.abspath', slug: 'abspath', when: 'Make a path absolute' },
    { name: 'os.path.splitroot', slug: 'splitroot', when: 'See the drive and root parts' },
    { name: 'os.path.expanduser', slug: 'expanduser', when: 'Replace ~ first' },
    { name: 'PurePath.is_absolute', slug: 'is_absolute', when: 'The pathlib version', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I check if a path is absolute in Python?',
      a: "os.path.isabs(path), or Path(path).is_absolute(). On POSIX it means a leading '/'; on Windows a drive with a root (C:\\) or a UNC path (\\\\server\\share).",
    },
    {
      q: "Why does os.path.isabs('/tmp') return False on Windows?",
      a: "Since Python 3.13, a path with a root but no drive is relative to the current drive, so Windows no longer calls it absolute. Python 3.12 and earlier returned True.",
    },
    {
      q: 'Does isabs check that the path exists?',
      a: 'No, it only inspects the string.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.isabs',
    meta:  'os.path.isabs',
  },
};
