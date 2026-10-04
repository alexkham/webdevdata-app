// content/reference/python/stdlib/os-path/basename.js

export const meta = {
  slug:        'basename',
  name:        'os.path.basename',
  signature:   'os.path.basename(path) / os.path.dirname(path)',
  blurb:       'basename is the final component of a path (the file name), dirname is everything before it (the folder). Together they are os.path.split.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.basename basename os.path.dirname dirname get file name from path python get directory of file parent folder last component trailing slash empty basename',
};

export const method = {
  slug:      'basename',
  name:      'os.path.basename',
  signature: 'os.path.basename(path) / os.path.dirname(path)',
  returns:   { type: 'str', desc: 'basename: the text after the last separator. dirname: the text before it, without trailing separators (the root stays).' },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "basename(p) == split(p)[1] and dirname(p) == split(p)[0]. Unlike the Unix basename command, a trailing slash gives an empty basename: basename('/var/log/') is ''. dirname of a bare file name is '' — not '.'.",

  covers: ['basename', 'dirname'],

  cheat: {
    commonCall: 'os.path.basename(path)',
    returns:    "'main.py'",
    replaces:   "path.split('/')[-1]",
    watchOut:   "Trailing slash → ''; dirname('main.py') → ''",
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike', required: true, default: null, desc: 'Any path. Nothing is checked on disk.' },
  ],

  modes: [
    {
      id: 'parts',
      label: 'basename / dirname',
      blurb: 'Both halves of a POSIX path.',
      params: [{ name: 'path', type: 'str', hint: 'a POSIX path', input: 'text' }],
      template: 'import posixpath\n(posixpath.dirname({$path}), posixpath.basename({$path}))',
      cases: [
        { id: 'file',  label: 'file',        values: { path: '/srv/app/main.py' } },
        { id: 'slash', label: 'trailing /',  values: { path: '/var/log/' } },
        { id: 'bare',  label: 'bare name',   values: { path: 'main.py' } },
        { id: 'deep',  label: 'relative',    values: { path: 'src/pkg/__init__.py' } },
      ],
    },
    {
      id: 'up',
      label: 'climb up',
      blurb: 'dirname applied again and again walks up the tree until it stops changing.',
      params: [{ name: 'path', type: 'str', hint: 'a POSIX path', input: 'text' }],
      template: 'import posixpath\np = {$path}\nchain = [p]\nwhile posixpath.dirname(p) != p:\n    p = posixpath.dirname(p)\n    chain.append(p)\nchain',
      cases: [
        { id: 'abs', label: 'absolute', values: { path: '/srv/app/main.py' } },
        { id: 'rel', label: 'relative', values: { path: 'src/pkg/mod.py' } },
      ],
    },
  ],
  demoExplainer: "For '/var/log/' the last separator is the final character, so the basename is empty and dirname strips the trailing slash: '/var/log'. A bare name has no folder part: dirname is the empty string, which os functions do not accept as '.'. Climbing with dirname ends at '/' for an absolute path and at '' for a relative one.",

  patterns: [
    {
      name: 'The folder of the running script',
      desc: 'Make it absolute first so dirname never returns an empty string.',
      code: "import os\nHERE = os.path.dirname(os.path.abspath(__file__))",
    },
    {
      name: 'File name without extension',
      desc: 'basename, then splitext.',
      code: "import os\nstem = os.path.splitext(os.path.basename(path))[0]",
    },
    {
      name: 'Name of a folder given with a trailing slash',
      desc: 'normpath removes the trailing separator.',
      code: "import os\nname = os.path.basename(os.path.normpath(folder))",
    },
  ],

  examples: [
    { title: 'File name and folder',      code: "import posixpath\n(posixpath.basename('/srv/app/main.py'), posixpath.dirname('/srv/app/main.py'))", returns: "('main.py', '/srv/app')" },
    { title: 'Trailing slash',            code: "import posixpath\n(posixpath.basename('/var/log/'), posixpath.dirname('/var/log/'))", returns: "('', '/var/log')" },
    { title: 'No folder part',            code: "import posixpath\nposixpath.dirname('main.py')", returns: "''" },
    { title: 'Two levels up',             code: "import posixpath\nposixpath.dirname(posixpath.dirname('/srv/app/main.py'))", returns: "'/srv'" },
    { title: 'Windows paths need ntpath', code: "import ntpath\n(ntpath.basename(r'C:\\Users\\ada\\x.txt'), ntpath.dirname(r'C:\\Users\\ada\\x.txt'))", returns: "('x.txt', 'C:\\\\Users\\\\ada')" },
    { title: '…posixpath sees one name',  code: "import posixpath\nposixpath.basename(r'C:\\Users\\ada\\x.txt')", returns: "'C:\\\\Users\\\\ada\\\\x.txt'" },
    { title: 'Strip the slash first',     code: "import posixpath\nposixpath.basename('/var/log/'.rstrip('/'))", returns: "'log'" },
  ],

  pitfalls: [
    {
      name: 'Expecting the Unix basename command',
      desc: "The shell's basename /var/log/ prints log; Python's returns ''.",
      wrong: { label: "basename('/var/log/')", code: "import posixpath\nposixpath.basename('/var/log/')", output: "''" },
      fix:   { label: 'normpath first', code: "import posixpath\nposixpath.basename(posixpath.normpath('/var/log/'))", output: "'log'" },
    },
    {
      name: "Using dirname('file') as a folder",
      desc: "It is '' for a bare file name, and os.listdir('') or os.makedirs('') raise FileNotFoundError.",
      wrong: { label: "dirname('data.csv')", code: "import os\ntry:\n    os.listdir(os.path.dirname('data.csv'))\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: "or '.'", code: "import os\nopen('data.csv', 'w').close()\nos.listdir(os.path.dirname('data.csv') or '.')", output: "['data.csv']" },
    },
    {
      name: 'Parsing Windows paths with os.path on Linux',
      desc: 'Paths received from Windows machines need ntpath (or PureWindowsPath) on every OS.',
      wrong: { label: 'posixpath', code: "import posixpath\nposixpath.dirname(r'C:\\data\\in.csv')", output: "''" },
      fix:   { label: 'ntpath', code: "import ntpath\nntpath.dirname(r'C:\\data\\in.csv')", output: "'C:\\\\data'" },
    },
  ],

  when: {
    use: [
      'File name or folder of a str path',
    ],
    avoid: [
      'Both at once → os.path.split',
      'pathlib code → p.name and p.parent',
      'The extension → splitext',
    ],
  },

  notes: {
    cpython:  "posixpath.basename: p[p.rfind('/') + 1:]. dirname: the same cut, then trailing '/' removed unless the head is all slashes",
    'parent vs dirname': "PurePath('/var/log/').name is 'log' (pathlib drops trailing slashes when parsing); os.path.basename gives ''",
  },

  related: [
    { name: 'os.path.split', slug: 'split', when: 'Both halves in one call' },
    { name: 'os.path.splitext', slug: 'splitext', when: 'Separate the extension' },
    { name: 'os.path.normpath', slug: 'normpath', when: 'Remove trailing slashes first' },
    { name: 'PurePath.name', slug: 'name', when: 'The pathlib version', category: 'stdlib/pathlib' },
    { name: 'PurePath.parent / parts', slug: 'parts', when: 'dirname in pathlib', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I get the file name from a path in Python?',
      a: "os.path.basename(path), or Path(path).name. Without the extension: os.path.splitext(os.path.basename(path))[0], or Path(path).stem.",
    },
    {
      q: 'How do I get the directory of a file?',
      a: "os.path.dirname(path) — '' for a bare name. For the folder of the running script: os.path.dirname(os.path.abspath(__file__)).",
    },
    {
      q: 'Why does os.path.basename return an empty string?',
      a: "The path ends with a separator ('/var/log/'). Python cuts after the last separator, unlike the shell's basename. Use os.path.basename(os.path.normpath(p)).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.basename',
    meta:  'os.path.basename / dirname',
  },
};
