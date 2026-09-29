// content/reference/python/stdlib/pathlib/is_absolute.js

export const meta = {
  slug:        'is_absolute',
  name:        'PurePath.is_absolute',
  signature:   'PurePath.is_absolute() / .is_reserved()',
  blurb:       'is_absolute() tells whether a path is anchored so the current directory does not matter; is_reserved() (deprecated) flags Windows device names like NUL and CON.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'PurePath.is_absolute is_absolute is_reserved PurePath.is_reserved absolute path check python relative path windows reserved names nul con aux os.path.isabs os.path.isreserved',
};

export const method = {
  slug:      'is_absolute',
  name:      'PurePath.is_absolute',
  signature: 'PurePath.is_absolute() / .is_reserved()',
  returns:   { type: 'bool', desc: 'True or False; pure checks with no file-system access.' },

  category:    'pathlib method',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: "A POSIX path is absolute when it starts with '/'. A Windows path needs a drive AND a root ('C:\\x' or '\\\\server\\share\\x'). is_reserved() is deprecated since 3.13 in favour of os.path.isreserved().",

  covers: ['PurePath.is_absolute', 'PurePath.is_reserved'],

  cheat: {
    commonCall: 'p.is_absolute()',
    returns:    'bool',
    replaces:   'os.path.isabs(p)',
    watchOut:   "PureWindowsPath('/x') is not absolute",
  },

  parameters: [],

  modes: [
    {
      id: 'absolute',
      label: 'is_absolute',
      blurb: 'Absolute on POSIX means a root is present.',
      params: [{ name: 'path', type: 'str', hint: 'a path', input: 'text' }],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$path})\n(p.is_absolute(), p.root)',
      cases: [
        { id: 'abs',   label: '/etc',        values: { path: '/etc/hosts' } },
        { id: 'rel',   label: 'relative',    values: { path: 'etc/hosts' } },
        { id: 'tilde', label: '~',           values: { path: '~/notes.txt' } },
        { id: 'two',   label: '//',          values: { path: '//srv' } },
      ],
    },
  ],
  demoExplainer: "'~/notes.txt' is relative: pathlib never expands '~' on its own — Path.expanduser() does that. A path with two leading slashes keeps '//' as its root and is absolute.",

  patterns: [
    {
      name: 'Make a path absolute only if needed',
      desc: 'absolute() prefixes the cwd; it is a no-op for absolute paths.',
      code: 'from pathlib import Path\np = Path(user_value)\nif not p.is_absolute():\n    p = Path.cwd() / p',
    },
    {
      name: 'Reject reserved Windows names (3.13+)',
      desc: 'os.path.isreserved replaces the deprecated is_reserved().',
      code: "import os\nif os.name == 'nt' and os.path.isreserved(filename):\n    raise ValueError(f'{filename} is a reserved device name')",
    },
  ],

  examples: [
    { title: 'Rooted POSIX path',            code: "from pathlib import PurePosixPath\nPurePosixPath('/usr/bin').is_absolute()", returns: 'True' },
    { title: 'Relative POSIX path',          code: "from pathlib import PurePosixPath\nPurePosixPath('usr/bin').is_absolute()", returns: 'False' },
    { title: 'Windows: drive + root',        code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:/Windows').is_absolute()", returns: 'True' },
    { title: 'Windows: root without drive',  code: "from pathlib import PureWindowsPath\nPureWindowsPath('/Windows').is_absolute()", returns: 'False' },
    { title: 'Windows: drive without root',  code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:Windows').is_absolute()", returns: 'False' },
    { title: 'cwd() is always absolute',     code: 'from pathlib import Path\nPath.cwd().is_absolute()', returns: 'True' },
    { title: 'is_reserved (deprecated)',     code: "import warnings\nfrom pathlib import PurePosixPath, PureWindowsPath\nwith warnings.catch_warnings():\n    warnings.simplefilter('ignore', DeprecationWarning)\n    result = (PureWindowsPath('nul').is_reserved(), PurePosixPath('nul').is_reserved())\nresult", returns: '(True, False)' },
  ],

  pitfalls: [
    {
      name: 'Treating "~" as absolute',
      desc: "The tilde is an ordinary name to pathlib until you call expanduser().",
      wrong: { label: 'raw ~', code: "from pathlib import PurePosixPath\nPurePosixPath('~/data').is_absolute()", output: 'False' },
      fix:   { label: 'expanduser() first', code: "from pathlib import Path\nPath('~/data').expanduser().is_absolute()", output: 'True' },
    },
    {
      name: 'Assuming a leading slash is absolute on Windows',
      desc: "'\\temp' is relative to the current drive on Windows. Code that checks p.root instead of is_absolute() gets this wrong.",
      wrong: { label: 'check root', code: "from pathlib import PureWindowsPath\nbool(PureWindowsPath('/temp').root)", output: 'True' },
      fix:   { label: 'is_absolute()', code: "from pathlib import PureWindowsPath\nPureWindowsPath('/temp').is_absolute()", output: 'False' },
    },
  ],

  when: {
    use: [
      'Validating config values that must be absolute',
      'Deciding whether to join a path onto a base folder',
    ],
    avoid: [
      'Making a path absolute → Path.absolute() or resolve()',
      'New code checking device names → os.path.isreserved() (Windows, 3.13+)',
    ],
  },

  notes: {
    cpython:        'POSIX flavour: True if any raw segment starts with "/"; Windows flavour: ntpath.isabs (drive and root required)',
    'is_reserved':  'Deprecated in 3.13, scheduled for removal in 3.15 — emits DeprecationWarning; always False for POSIX paths',
    'Changed in 3.13': 'is_reserved also flags Windows names containing a colon or ending with a dot or space',
  },

  related: [
    { name: 'parts / anchor / root', slug: 'parts',   when: 'The pieces is_absolute looks at' },
    { name: 'resolve / absolute / expanduser', slug: 'resolve', when: 'Turn a relative path into an absolute one' },
    { name: 'PureWindowsPath',  slug: 'purewindowspath', when: 'Windows rules' },
  ],

  faq: [
    {
      q: 'How do I check if a path is absolute in Python?',
      a: 'Path(p).is_absolute() — or os.path.isabs(p). On Windows both require a drive and a root.',
    },
    {
      q: 'Why is is_reserved deprecated?',
      a: 'Since 3.13 it warns and points to os.path.isreserved(), which does the same Windows-only check on plain strings. It is scheduled for removal in Python 3.15.',
    },
    {
      q: 'Is "~/file" an absolute path?',
      a: 'No. pathlib does not expand the tilde automatically; call Path("~/file").expanduser(), which returns an absolute path under your home directory.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.is_absolute',
    meta:  'PurePath.is_absolute / is_reserved',
  },
};
