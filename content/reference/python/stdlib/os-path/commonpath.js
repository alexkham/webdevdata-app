// content/reference/python/stdlib/os-path/commonpath.js

export const meta = {
  slug:        'commonpath',
  name:        'os.path.commonpath',
  signature:   'os.path.commonpath(paths) / os.path.commonprefix(list)',
  blurb:       'commonpath gives the longest shared folder of several paths, component by component. commonprefix compares character by character and can return a path that does not exist.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.5+ (commonprefix: all versions)',
  searchTerms: 'os.path.commonpath commonpath os.path.commonprefix commonprefix common directory of paths python longest common path prefix shared parent folder path traversal check inside directory',
};

export const method = {
  slug:      'commonpath',
  name:      'os.path.commonpath',
  signature: 'os.path.commonpath(paths) / os.path.commonprefix(list)',
  returns:   { type: 'str', desc: "commonpath: a real sub-path shared by all (no trailing separator). commonprefix: the longest common string prefix ('' for an empty list)." },

  category:    'os.path function',
  version:     'Python 3.5+ (commonprefix: all versions)',
  hasLiveDemo: true,

  subtitle: "Use commonpath. commonprefix is a plain string function living in os.path for historical reasons: for '/usr/lib' and '/usr/local' it answers '/usr/l'. commonpath splits into components first, ignores '' and '.' components, and refuses to mix absolute and relative paths.",

  covers: ['commonpath', 'commonprefix'],

  cheat: {
    commonCall: 'os.path.commonpath([a, b])',
    returns:    "'/srv/app'",
    replaces:   'commonprefix() for paths — and hand-written startswith() checks',
    watchOut:   "commonprefix('/usr/lib', '/usr/local') is '/usr/l'; commonpath raises ValueError for [] or mixed absolute/relative",
  },

  parameters: [
    { name: 'paths', type: 'iterable of str | bytes | PathLike', required: true, default: null, desc: 'commonpath: two or more paths (one is fine). Any iterable since 3.13; before, a sequence.' },
    { name: 'list',  type: 'list of str', required: true, default: null, desc: 'commonprefix: any strings (or lists) — compared character by character.' },
  ],

  modes: [
    {
      id: 'both',
      label: 'commonpath vs commonprefix',
      blurb: 'The same paths through both functions.',
      params: [{ name: 'paths', type: 'list[str]', hint: 'paths, comma-separated', input: 'csv' }],
      template: 'import posixpath\n(posixpath.commonpath({$paths}), posixpath.commonprefix({$paths}))',
      cases: [
        { id: 'apps',  label: 'sibling folders', values: { paths: '/srv/app/static, /srv/app/templates' } },
        { id: 'trap',  label: 'shared letters',  values: { paths: '/usr/lib, /usr/local' } },
        { id: 'rel',   label: 'relative',        values: { paths: 'src/a.py, src/pkg/b.py, src/./c.py' } },
        { id: 'mixed', label: 'mixed',           values: { paths: '/srv, srv' } },
      ],
    },
    {
      id: 'inside',
      label: 'is it inside?',
      blurb: 'The safe containment test: normalize the joined path, then compare its common path with the base.',
      params: [{ name: 'name', type: 'str', hint: 'user-supplied file name', input: 'text' }],
      template: "import posixpath\nbase = '/srv/uploads'\np = posixpath.normpath(posixpath.join(base, {$name}))\n(p, posixpath.commonpath([base, p]) == base)",
      cases: [
        { id: 'ok',     label: 'plain name',     values: { name: 'avatar.png' } },
        { id: 'dotdot', label: '../ traversal',  values: { name: '../../etc/passwd' } },
        { id: 'abs',    label: 'absolute name',  values: { name: '/etc/passwd' } },
        { id: 'twin',   label: 'look-alike',     values: { name: '../uploads-old/x' } },
      ],
    },
  ],
  demoExplainer: "commonprefix stops at the first differing character, so '/srv/app/static' and '/srv/app/templates' give '/srv/app/' and '/usr/lib' with '/usr/local' gives the meaningless '/usr/l'. commonpath works on whole components and ignores './'. Mixing '/srv' and 'srv' raises ValueError: Can't mix absolute and relative paths. In the second tab only avatar.png stays inside: '..', an absolute name and the look-alike folder uploads-old all leave /srv/uploads, and a startswith(base) test would have let uploads-old through.",

  patterns: [
    {
      name: 'Reject paths outside a base folder',
      desc: 'Resolve first (realpath also defeats symlinks), then compare.',
      code: "import os\ndef inside(base, path):\n    base = os.path.realpath(base)\n    path = os.path.realpath(path)\n    return os.path.commonpath([base, path]) == base",
    },
    {
      name: 'Common root of many files',
      desc: 'For display or for choosing an archive root.',
      code: "import os\nroot = os.path.commonpath(file_list)",
    },
    {
      name: 'Longest common string prefix (not paths)',
      desc: 'commonprefix is fine for plain strings.',
      code: "import os\nprefix = os.path.commonprefix(['interstellar', 'internet', 'interval'])",
    },
  ],

  examples: [
    { title: 'Shared folder',               code: "import posixpath\nposixpath.commonpath(['/srv/app/static', '/srv/app/templates'])", returns: "'/srv/app'" },
    { title: 'commonprefix keeps the slash', code: "import posixpath\nposixpath.commonprefix(['/srv/app/static', '/srv/app/templates'])", returns: "'/srv/app/'" },
    { title: 'commonprefix splits names',   code: "import posixpath\n(posixpath.commonprefix(['/usr/lib', '/usr/local']), posixpath.commonpath(['/usr/lib', '/usr/local']))", returns: "('/usr/l', '/usr')" },
    { title: 'One path is the parent',      code: "import posixpath\nposixpath.commonpath(['a/b/c', 'a/b'])", returns: "'a/b'" },
    { title: 'Trailing slashes do not matter', code: "import posixpath\nposixpath.commonpath(['/srv/app/', '/srv/app'])", returns: "'/srv/app'" },
    { title: 'Empty input',                 code: "import posixpath\nposixpath.commonpath([])", returns: 'ValueError: commonpath() arg is an empty sequence' },
    { title: 'Plain strings with commonprefix', code: "import posixpath\nposixpath.commonprefix(['interstellar', 'internet', 'interval'])", returns: "'inter'" },
  ],

  pitfalls: [
    {
      name: 'Using commonprefix for paths',
      desc: 'It works character by character and can cut a folder name in half.',
      wrong: { label: 'commonprefix', code: "import posixpath\nposixpath.commonprefix(['/home/ada', '/home/adam'])", output: "'/home/ada'" },
      fix:   { label: 'commonpath', code: "import posixpath\nposixpath.commonpath(['/home/ada', '/home/adam'])", output: "'/home'" },
    },
    {
      name: 'Checking containment with startswith',
      desc: "'/srv/uploads-old' starts with '/srv/uploads'. Compare whole components.",
      wrong: { label: 'startswith', code: "'/srv/uploads-old/x'.startswith('/srv/uploads')", output: 'True' },
      fix:   { label: 'commonpath', code: "import posixpath\nposixpath.commonpath(['/srv/uploads', '/srv/uploads-old/x']) == '/srv/uploads'", output: 'False' },
    },
    {
      name: 'Comparing without normalizing first',
      desc: "commonpath does not resolve '..' — normalize (or realpath) the candidate before the check.",
      wrong: { label: 'raw join', code: "import posixpath\nbase = '/srv/uploads'\np = posixpath.join(base, '../etc/passwd')\nposixpath.commonpath([base, p]) == base", output: 'True' },
      fix:   { label: 'normpath first', code: "import posixpath\nbase = '/srv/uploads'\np = posixpath.normpath(posixpath.join(base, '../etc/passwd'))\nposixpath.commonpath([base, p]) == base", output: 'False' },
    },
  ],

  when: {
    use: [
      'Finding the shared folder of several paths (commonpath)',
      'Path-traversal checks after normpath / realpath',
    ],
    avoid: [
      'Paths → never commonprefix',
      'pathlib code → PurePath.is_relative_to(base) after resolve()',
    ],
  },

  notes: {
    cpython:      "posixpath.commonpath splits every path on '/', drops '' and '.' components, and compares the min and max component lists (any list between them shares their common prefix). commonprefix is genericpath.commonprefix: the same min/max trick on the raw strings",
    'Windows':    'ntpath.commonpath also raises ValueError for paths on different drives, and compares case-insensitively',
    '3.13':       'commonpath accepts any iterable, not only sequences',
  },

  related: [
    { name: 'os.path.relpath', slug: 'relpath', when: 'Path from the common folder' },
    { name: 'os.path.normpath', slug: 'normpath', when: 'Normalize before comparing' },
    { name: 'os.path.join', slug: 'join', when: 'Where traversal bugs come from' },
    { name: 'PurePath.relative_to / is_relative_to', slug: 'relative_to', when: 'The pathlib containment test', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'What is the difference between os.path.commonpath and commonprefix?',
      a: "commonpath compares whole path components and returns a valid path ('/usr' for /usr/lib and /usr/local). commonprefix compares characters and can return a half name ('/usr/l'). The docs warn that commonprefix is not secure for paths.",
    },
    {
      q: 'How do I check that a path is inside a directory?',
      a: "Normalize both (os.path.realpath, or at least abspath/normpath), then test os.path.commonpath([base, path]) == base. With pathlib: Path(path).resolve().is_relative_to(Path(base).resolve()).",
    },
    {
      q: 'Why does commonpath raise ValueError?',
      a: "The list is empty, or it mixes absolute and relative paths (or, on Windows, different drives).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.commonpath',
    meta:  'os.path.commonpath / commonprefix',
  },
};
