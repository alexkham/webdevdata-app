// content/reference/python/stdlib/os-path/join.js

export const meta = {
  slug:        'join',
  name:        'os.path.join',
  signature:   'os.path.join(path, *paths)',
  blurb:       'Join path components with the right separator, inserting one only where needed. An absolute component discards everything before it.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.join join path python combine paths concatenate path separator absolute path discards previous posixpath.join ntpath.join backslash windows path join list of components',
};

export const method = {
  slug:      'join',
  name:      'os.path.join',
  signature: 'os.path.join(path, *paths)',
  returns:   { type: 'str | bytes', desc: 'The joined path. Nothing is checked on disk.' },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "join puts exactly one separator between components ('/' with posixpath, '\\' with ntpath) and never touches the disk. The rule that surprises people: a component that is absolute — '/etc' on POSIX, 'C:\\' or '\\\\server\\share' on Windows — throws away everything before it.",

  covers: ['join'],

  cheat: {
    commonCall: "os.path.join(base, 'data', name)",
    returns:    "'base/data/name' (with '\\' on Windows)",
    replaces:   "base + '/' + name",
    watchOut:   'An absolute later component (or a user-supplied "/etc/passwd") replaces the start',
  },

  parameters: [
    { name: 'path',   type: 'str | bytes | PathLike', required: true,  default: null, desc: 'The first component.' },
    { name: '*paths', type: 'str | bytes | PathLike', required: false, default: null, desc: 'More components. All str or all bytes — mixing raises TypeError. An empty last component adds a trailing separator.' },
  ],

  modes: [
    {
      id: 'join',
      label: 'join',
      blurb: 'Type the components; posixpath shows the Linux/macOS result on any machine.',
      params: [{ name: 'parts', type: 'list[str]', hint: 'components, comma-separated', input: 'csv' }],
      template: 'import posixpath\nposixpath.join(*{$parts})',
      cases: [
        { id: 'plain', label: 'plain',            values: { parts: '/home/ada, projects, site, index.html' } },
        { id: 'slash', label: 'trailing slashes', values: { parts: 'logs/, 2026/, app.log' } },
        { id: 'abs',   label: 'absolute later',   values: { parts: '/srv/app, static, /etc/passwd' } },
        { id: 'empty', label: 'empty last',       values: { parts: 'build, ' } },
      ],
    },
    {
      id: 'both',
      label: 'POSIX vs Windows',
      blurb: 'The same components through posixpath and ntpath — what os.path.join gives on Linux/macOS and on Windows.',
      params: [{ name: 'parts', type: 'list[str]', hint: 'components, comma-separated', input: 'csv' }],
      template: 'import posixpath, ntpath\n(posixpath.join(*{$parts}), ntpath.join(*{$parts}))',
      cases: [
        { id: 'rel',   label: 'relative',     values: { parts: 'data, raw, a.csv' } },
        { id: 'drive', label: 'drive letter', values: { parts: 'C:, Users, ada' } },
        { id: 'root',  label: 'rooted',       values: { parts: 'project, /tmp/x' } },
      ],
    },
  ],
  demoExplainer: "posixpath only adds '/' where the previous component does not already end with one, so 'logs/' + '2026/' + 'app.log' gives no doubled slashes. '/etc/passwd' is absolute, so '/srv/app/static' is discarded. In the second tab ntpath uses '\\' (shown doubled in the repr) and treats 'C:' as a drive: ntpath.join('C:', 'Users') is 'C:Users' — relative to the current folder on drive C, not 'C:\\Users'. Both modules treat '/tmp/x' as rooted and drop 'project'.",

  patterns: [
    {
      name: 'Path next to the current script',
      desc: '__file__ is relative to where the script lives, not to the cwd.',
      code: "import os\nconfig = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.toml')",
    },
    {
      name: 'Join a list of components',
      desc: 'Unpack the list with *.',
      code: "import os\nparts = ['data', '2026', 'report.csv']\npath = os.path.join(*parts)",
    },
    {
      name: 'Keep user-supplied names inside a folder',
      desc: 'Normalize, then check the result is still under the base.',
      code: "import os\ndef safe_join(base, name):\n    p = os.path.abspath(os.path.join(base, name))\n    if os.path.commonpath([os.path.abspath(base), p]) != os.path.abspath(base):\n        raise ValueError('outside the base folder')\n    return p",
    },
    {
      name: 'Always forward slashes (URLs, archives, config keys)',
      desc: 'posixpath behaves the same on every OS.',
      code: "import posixpath\nkey = posixpath.join('assets', 'img', 'logo.png')",
    },
  ],

  examples: [
    { title: 'Three components',          code: "import posixpath\nposixpath.join('/home/ada', 'docs', 'a.txt')", returns: "'/home/ada/docs/a.txt'" },
    { title: 'An absolute part wins',     code: "import posixpath\nposixpath.join('/srv/app', '/etc/passwd')", returns: "'/etc/passwd'" },
    { title: 'Empty last part: trailing separator', code: "import posixpath\nposixpath.join('build', '')", returns: "'build/'" },
    { title: 'Windows separators',        code: "import ntpath\nntpath.join(r'C:\\Users', 'ada', 'notes.txt')", returns: "'C:\\\\Users\\\\ada\\\\notes.txt'" },
    { title: 'Windows: another drive restarts', code: "import ntpath\nntpath.join(r'C:\\data', 'D:report.txt')", returns: "'D:report.txt'" },
    { title: 'Path objects are accepted', code: "import posixpath\nfrom pathlib import PurePosixPath\nposixpath.join(PurePosixPath('src'), 'app.py')", returns: "'src/app.py'" },
    { title: 'str and bytes do not mix',  code: "import posixpath\nposixpath.join('data', b'raw')", returns: "TypeError: Can't mix strings and bytes in path components" },
  ],

  pitfalls: [
    {
      name: 'Passing a list',
      desc: 'join takes components as separate arguments.',
      wrong: { label: 'join(list)', code: "import posixpath\nposixpath.join(['data', 'raw'])", output: 'TypeError: expected str, bytes or os.PathLike object, not list' },
      fix:   { label: 'join(*list)', code: "import posixpath\nposixpath.join(*['data', 'raw'])", output: "'data/raw'" },
    },
    {
      name: 'A leading slash on a later component',
      desc: "'/img/logo.png' is absolute, so the folder before it is dropped. Strip the slash if the part is meant to be relative.",
      wrong: { label: "'/img/logo.png'", code: "import posixpath\nposixpath.join('static', '/img/logo.png')", output: "'/img/logo.png'" },
      fix:   { label: "lstrip('/')", code: "import posixpath\nposixpath.join('static', '/img/logo.png'.lstrip('/'))", output: "'static/img/logo.png'" },
    },
    {
      name: 'Building URLs with os.path.join',
      desc: 'On Windows os.path is ntpath and inserts a backslash. URLs always use /.',
      wrong: { label: 'what Windows does', code: "import ntpath\nntpath.join('https://example.com/api', 'v1')", output: "'https://example.com/api\\\\v1'" },
      fix:   { label: 'posixpath (or urljoin)', code: "import posixpath\nposixpath.join('https://example.com/api', 'v1')", output: "'https://example.com/api/v1'" },
    },
  ],

  when: {
    use: [
      'Combining a folder and a file name you got as strings',
      'Code that must produce native paths on each OS',
    ],
    avoid: [
      "Object paths → Path('a') / 'b' (pathlib)",
      'URLs → urllib.parse.urljoin (or posixpath for the path part)',
      'Untrusted names → validate the result (commonpath) — join will happily escape the base',
    ],
  },

  notes: {
    cpython:   'Lib/posixpath.py join: start from the first part; for each next part, restart if it starts with "/", otherwise add "/" unless the path is empty or already ends with one. Lib/ntpath.py join works on (drive, root, tail) triples from splitroot',
    'Windows': "ntpath.join('C:', 'x') is 'C:x' (drive-relative); a component with a different drive restarts the path; a rooted component like '\\x' keeps the current drive",
    'No normalization': "join never removes '..' or '.' — combine with normpath or abspath when you need that",
  },

  related: [
    { name: 'os.path module', slug: 'os-path', when: 'Overview', category: 'stdlib' },
    { name: 'os.path.split', slug: 'split', when: 'The reverse' },
    { name: 'os.path.normpath', slug: 'normpath', when: "Clean up '..' and '//' after joining" },
    { name: 'PurePath.joinpath and /', slug: 'joinpath', when: 'The pathlib way', category: 'stdlib/pathlib' },
    { name: 'os.path.commonpath', slug: 'commonpath', when: 'Check a joined path stays inside a folder' },
  ],

  faq: [
    {
      q: 'Why does os.path.join ignore my first argument?',
      a: "Because a later argument is absolute — it starts with '/' (or with a drive or '\\' on Windows). join then starts over from that component. Strip the leading separator if it was meant to be relative.",
    },
    {
      q: 'Does os.path.join use / or \\?',
      a: "It uses os.sep of the platform: '/' on Linux and macOS (posixpath), '\\' on Windows (ntpath). Import posixpath or ntpath to force one style on any OS.",
    },
    {
      q: 'How do I join a list of path components?',
      a: "Unpack it: os.path.join(*parts). With pathlib: Path(*parts).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.join',
    meta:  'os.path.join',
  },
};
