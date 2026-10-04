// content/reference/python/stdlib/os-path/relpath.js

export const meta = {
  slug:        'relpath',
  name:        'os.path.relpath',
  signature:   'os.path.relpath(path, start=os.curdir)',
  blurb:       "The path to `path` as seen from `start` (default: the current directory), using '..' to climb up. Pure computation — nothing is checked on disk.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.relpath relpath relative path python path relative to directory make path relative dot dot start current directory different drives valueerror',
};

export const method = {
  slug:      'relpath',
  name:      'os.path.relpath',
  signature: 'os.path.relpath(path, start=os.curdir)',
  returns:   { type: 'str | bytes', desc: "A relative path from start to path; '.' when they are the same." },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "relpath makes both arguments absolute (with abspath, so relative ones depend on the current directory), drops their common leading folders and climbs out of the rest of start with '..'. It never looks at the file system, so it cannot know whether start is a file or a folder — start is always treated as a folder.",

  covers: ['relpath'],

  cheat: {
    commonCall: 'os.path.relpath(path, base)',
    returns:    "'static/css/site.css'",
    replaces:   "path[len(base) + 1:] — which breaks on '/srv/app2' vs '/srv/app'",
    watchOut:   'On Windows, paths on different drives raise ValueError',
  },

  parameters: [
    { name: 'path',  type: 'str | bytes | PathLike', required: true,  default: null,      desc: 'The target. Must not be empty (ValueError: no path specified).' },
    { name: 'start', type: 'str | bytes | PathLike', required: false, default: 'os.curdir', desc: 'The folder to be relative to. A file name here is treated as a folder too.' },
  ],

  modes: [
    {
      id: 'rel',
      label: 'relpath',
      blurb: 'Relative arguments are resolved against a fixed stand-in for os.getcwd(), so the output is the same everywhere.',
      params: [
        { name: 'path',  type: 'str', hint: 'target path', input: 'text' },
        { name: 'start', type: 'str', hint: 'start folder', input: 'text' },
      ],
      template: "import posixpath\ncwd = '/home/ada/project'          # stands in for os.getcwd()\nposixpath.relpath(posixpath.join(cwd, {$path}), posixpath.join(cwd, {$start}))",
      cases: [
        { id: 'down',  label: 'below start',   values: { path: '/srv/app/static/css/site.css', start: '/srv/app' } },
        { id: 'side',  label: 'sideways',      values: { path: '/srv/data', start: '/srv/app/static' } },
        { id: 'same',  label: 'same folder',   values: { path: '/srv/app', start: '/srv/app/' } },
        { id: 'relin', label: 'relative input', values: { path: 'docs/index.md', start: 'src/pkg' } },
      ],
    },
  ],
  demoExplainer: "From /srv/app/static, /srv/data is two levels up and one down: '../../data'. A trailing slash on start makes no difference, and identical locations give '.'. With relative inputs both are first placed under the same current directory, so the result does not depend on what that directory is — unless '..' climbs above it.",

  patterns: [
    {
      name: 'Show paths relative to the project root',
      desc: 'Shorter log lines and reports.',
      code: "import os\nfor root, dirs, files in os.walk(PROJECT):\n    for name in files:\n        print(os.path.relpath(os.path.join(root, name), PROJECT))",
    },
    {
      name: 'Archive member names',
      desc: 'Store paths relative to the folder being archived, with forward slashes.',
      code: "import os\narcname = os.path.relpath(full_path, src_dir).replace(os.sep, '/')",
    },
    {
      name: 'Guard against different drives (Windows)',
      desc: 'relpath raises ValueError when no relative path exists.',
      code: "import os\ntry:\n    shown = os.path.relpath(path, base)\nexcept ValueError:\n    shown = path",
    },
  ],

  examples: [
    { title: 'A file below a folder',   code: "import posixpath\nposixpath.relpath('/srv/app/static/css/site.css', '/srv/app')", returns: "'static/css/site.css'" },
    { title: "Sideways: '..' needed",   code: "import posixpath\nposixpath.relpath('/srv/data', '/srv/app/static')", returns: "'../../data'" },
    { title: 'Same place',              code: "import posixpath\nposixpath.relpath('/srv/app', '/srv/app')", returns: "'.'" },
    { title: 'Relative to the current folder', code: "import os\nos.makedirs('a/b')\nos.path.relpath('a/b', 'a')", returns: "'b'" },
    { title: 'Empty path',              code: "import posixpath\nposixpath.relpath('')", returns: 'ValueError: no path specified' },
    { title: 'Windows: different drives', code: "import ntpath\nntpath.relpath(r'D:\\data', r'C:\\Users')", returns: "ValueError: path is on mount 'D:', start on mount 'C:'" },
  ],

  pitfalls: [
    {
      name: 'Slicing off a prefix by length',
      desc: "A string prefix is not a path prefix: '/srv/app2' starts with '/srv/app'.",
      wrong: { label: 'path[len(base) + 1:]', code: "base = '/srv/app'\npath = '/srv/app2/x.txt'\npath[len(base) + 1:]", output: "'/x.txt'" },
      fix:   { label: 'relpath', code: "import posixpath\nposixpath.relpath('/srv/app2/x.txt', '/srv/app')", output: "'../app2/x.txt'" },
    },
    {
      name: 'Passing a file as start',
      desc: 'start is always treated as a folder; pass the folder of the file.',
      wrong: { label: 'start = a file', code: "import posixpath\nposixpath.relpath('/site/img/a.png', '/site/pages/about.html')", output: "'../../img/a.png'" },
      fix:   { label: 'start = its folder', code: "import posixpath\nposixpath.relpath('/site/img/a.png', posixpath.dirname('/site/pages/about.html'))", output: "'../img/a.png'" },
    },
  ],

  when: {
    use: [
      'Displaying paths relative to a base folder',
      'Building relative links between files (HTML, Markdown, symlinks)',
    ],
    avoid: [
      'pathlib code → PurePath.relative_to(other, walk_up=True) (3.12+)',
      'Checking whether a path is inside a folder → commonpath',
    ],
  },

  notes: {
    cpython:   "posixpath.relpath: abspath both, split into components, count the shared leading components with commonprefix, then '..' for each remaining start component plus the rest of path",
    'Windows': 'ntpath.relpath raises ValueError when the paths have different drives (no relative path exists)',
  },

  related: [
    { name: 'os.path.abspath', slug: 'abspath', when: 'What relpath applies to both arguments' },
    { name: 'os.path.commonpath', slug: 'commonpath', when: 'The shared folder of several paths' },
    { name: 'PurePath.relative_to', slug: 'relative_to', when: 'The pathlib version', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I get a path relative to another directory in Python?',
      a: "os.path.relpath(path, base). With pathlib: Path(path).relative_to(base) — which raises ValueError unless path is inside base, or pass walk_up=True (3.12+) to allow '..'.",
    },
    {
      q: 'Does os.path.relpath check that the files exist?',
      a: 'No. It is a pure computation on the strings (after making them absolute with the current directory).',
    },
    {
      q: 'Why does relpath raise ValueError on Windows?',
      a: "The two paths are on different drives (or shares), e.g. C: and D:. There is no relative path between them.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.relpath',
    meta:  'os.path.relpath',
  },
};
