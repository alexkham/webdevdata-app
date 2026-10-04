// content/reference/python/stdlib/os-path/normpath.js

export const meta = {
  slug:        'normpath',
  name:        'os.path.normpath',
  signature:   'os.path.normpath(path) / os.path.normcase(path)',
  blurb:       "Normalize a path as text: collapse doubled separators, drop '.' and resolve 'x/..'. normcase lower-cases and converts / to \\ on Windows and does nothing on POSIX.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.normpath normpath os.path.normcase normcase normalize path python remove double slash resolve dot dot clean path case insensitive compare windows paths',
};

export const method = {
  slug:      'normpath',
  name:      'os.path.normpath',
  signature: 'os.path.normpath(path) / os.path.normcase(path)',
  returns:   { type: 'str | bytes', desc: "The normalized path ('.' for an empty result)." },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "normpath is pure string work: it never looks at the disk, so 'link/..' is removed even if link is a symlink pointing elsewhere. Leading '..' of a relative path are kept; on POSIX exactly two leading slashes are kept too. normcase is for comparisons: identity on POSIX, lower case with backslashes on Windows.",

  covers: ['normpath', 'normcase'],

  cheat: {
    commonCall: 'os.path.normpath(path)',
    returns:    "'/usr/local/lib'",
    replaces:   "Hand-written replace('//', '/') and '..' handling",
    watchOut:   "'a/link/..' becomes 'a' even when link is a symlink — use realpath to follow links",
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike', required: true, default: null, desc: 'Any path. Nothing is checked on disk.' },
  ],

  modes: [
    {
      id: 'norm',
      label: 'normpath',
      blurb: 'POSIX rules through posixpath.',
      params: [{ name: 'path', type: 'str', hint: 'a messy POSIX path', input: 'text' }],
      template: 'import posixpath\nposixpath.normpath({$path})',
      cases: [
        { id: 'messy', label: 'messy',          values: { path: '/usr//local/./bin/../lib/' } },
        { id: 'up',    label: 'leading ..',     values: { path: '../a/../../b' } },
        { id: 'root',  label: '.. at the root', values: { path: '/../etc' } },
        { id: 'empty', label: 'empty',          values: { path: '' } },
      ],
    },
    {
      id: 'both',
      label: 'POSIX vs Windows',
      blurb: 'The same text through posixpath.normpath and ntpath.normpath.',
      params: [{ name: 'path', type: 'str', hint: 'any path', input: 'text' }],
      template: 'import posixpath, ntpath\n(posixpath.normpath({$path}), ntpath.normpath({$path}))',
      cases: [
        { id: 'fwd',   label: 'forward slashes', values: { path: 'C:/Users//ada/./docs/../x.txt' } },
        { id: 'two',   label: 'two leading /',   values: { path: '//srv/x/' } },
      ],
    },
  ],
  demoExplainer: "'bin/..' cancels out, '.' and the doubled and trailing slashes disappear. A relative path cannot go above its start, so normpath keeps the leading '..' parts; above the root there is nothing, so '/../etc' becomes '/etc'. An empty path becomes '.'. ntpath also turns every / into \\. POSIX leaves exactly two leading slashes alone (their meaning is implementation-defined), while ntpath reads '//srv/x' as the UNC share \\\\srv\\x.",

  patterns: [
    {
      name: 'Compare two paths textually',
      desc: 'normcase(normpath(...)) on both sides — correct on Windows too.',
      code: "import os\nsame = os.path.normcase(os.path.normpath(a)) == os.path.normcase(os.path.normpath(b))",
    },
    {
      name: 'Last folder of a path with a trailing slash',
      desc: 'normpath removes the trailing separator.',
      code: "import os\nname = os.path.basename(os.path.normpath('/var/log/'))",
    },
    {
      name: 'Real location, following symlinks',
      desc: 'When links matter, use realpath instead.',
      code: "import os\ncanonical = os.path.realpath(path)",
    },
  ],

  examples: [
    { title: 'Clean up a messy path',   code: "import posixpath\nposixpath.normpath('/usr//local/./bin/../lib/')", returns: "'/usr/local/lib'" },
    { title: "Leading '..' stay",       code: "import posixpath\nposixpath.normpath('../a/../../b')", returns: "'../../b'" },
    { title: 'Empty path',              code: "import posixpath\nposixpath.normpath('')", returns: "'.'" },
    { title: 'Two leading slashes are kept (POSIX)', code: "import posixpath\n(posixpath.normpath('//srv/x'), posixpath.normpath('///srv/x'))", returns: "('//srv/x', '/srv/x')" },
    { title: 'ntpath converts slashes', code: "import ntpath\nntpath.normpath('C:/Users//ada/./docs/../x.txt')", returns: "'C:\\\\Users\\\\ada\\\\x.txt'" },
    { title: 'normcase: POSIX vs Windows', code: "import posixpath, ntpath\n(posixpath.normcase('ReadMe.TXT'), ntpath.normcase('C:/Users/ReadMe.TXT'))", returns: "('ReadMe.TXT', 'c:\\\\users\\\\readme.txt')" },
    { title: 'Equal after normalizing', code: "import posixpath\nposixpath.normpath('a/b') == posixpath.normpath('a/./b/')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Using normpath to sanitize user input',
      desc: "normpath happily keeps leading '..' — it does not confine a path to a folder. Check the result with commonpath.",
      wrong: { label: 'normpath only', code: "import posixpath\nposixpath.normpath(posixpath.join('uploads', '../../etc/passwd'))", output: "'../etc/passwd'" },
      fix:   { label: 'verify containment', code: "import posixpath\nbase = '/srv/uploads'\np = posixpath.normpath(posixpath.join(base, '../../etc/passwd'))\nposixpath.commonpath([base, p]) == base", output: 'False' },
    },
    {
      name: 'Comparing Windows paths without normcase',
      desc: 'Windows file names are case-insensitive and accept both slashes.',
      wrong: { label: 'normpath only', code: "import ntpath\nntpath.normpath('C:/Data/A.txt') == ntpath.normpath(r'c:\\data\\a.txt')", output: 'False' },
      fix:   { label: 'normcase too', code: "import ntpath\nntpath.normcase(ntpath.normpath('C:/Data/A.txt')) == ntpath.normcase(ntpath.normpath(r'c:\\data\\a.txt'))", output: 'True' },
    },
  ],

  when: {
    use: [
      'Displaying or comparing paths built by concatenation',
      'Removing trailing separators and redundant parts',
    ],
    avoid: [
      'Resolving symlinks → os.path.realpath',
      'Making a path absolute → os.path.abspath (which calls normpath)',
      'Security checks on their own → combine with abspath + commonpath',
    ],
  },

  notes: {
    cpython:       'Both modules have a C implementation in Modules/posixmodule.c (_path_normpath) with a pure-Python fallback that gives the same results',
    'Symlinks':    "normpath may change the meaning of a path with symlinks: if b is a link, a/b/.. is not necessarily a",
    'normcase':    'posixpath.normcase returns the path unchanged (macOS file systems are usually case-insensitive too, but normcase does not account for that)',
  },

  related: [
    { name: 'os.path.abspath / realpath', slug: 'abspath', when: 'Absolute and symlink-free paths' },
    { name: 'os.path.join', slug: 'join', when: 'Often followed by normpath' },
    { name: 'os.path.commonpath', slug: 'commonpath', when: 'Containment checks' },
    { name: 'Path.resolve', slug: 'resolve', when: 'The pathlib way (follows symlinks)', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'What does os.path.normpath do?',
      a: "It rewrites a path string into a canonical form: A//B, A/B/, A/./B and A/foo/../B all become A/B. On Windows it also turns / into \\. It does not access the file system.",
    },
    {
      q: 'What is the difference between normpath and abspath?',
      a: 'abspath(p) is normpath(join(os.getcwd(), p)) — normpath plus making the path absolute. normpath keeps relative paths relative.',
    },
    {
      q: 'What is the difference between normpath and realpath?',
      a: "realpath asks the file system and resolves symlinks, so it gives the true location. normpath only edits the text and can be wrong when a '..' follows a symlink.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.normpath',
    meta:  'os.path.normpath / normcase',
  },
};
