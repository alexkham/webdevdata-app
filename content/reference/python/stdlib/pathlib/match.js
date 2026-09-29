// content/reference/python/stdlib/pathlib/match.js

export const meta = {
  slug:        'match',
  name:        'PurePath.match',
  signature:   'PurePath.match(pattern, *, case_sensitive=None) / .full_match(pattern, *, case_sensitive=None)',
  blurb:       'Test a path against a glob-style pattern without touching the disk. match() compares from the right; full_match() (3.13+) matches the whole path and understands **.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (full_match 3.13+)',
  searchTerms: 'PurePath.match match full_match PurePath.full_match glob pattern match path python fnmatch path wildcard double star recursive pattern case_sensitive empty pattern',
};

export const method = {
  slug:      'match',
  name:      'PurePath.match',
  signature: 'PurePath.match(pattern, *, case_sensitive=None) / .full_match(pattern, *, case_sensitive=None)',
  returns:   { type: 'bool', desc: 'Whether the path matches the pattern.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (full_match 3.13+)',
  hasLiveDemo: true,

  subtitle: "match('*.py') is true for any path whose LAST component ends in .py — a relative pattern is matched from the right. full_match('**/*.py') matches the entire path, with ** spanning any number of folders, exactly like Path.glob.",

  // match() and full_match() are inherited from PurePathBase (not own
  // names of PurePath), so there is nothing to claim here
  covers: [],

  cheat: {
    commonCall: "p.full_match('src/**/*.py')",
    returns:    'True / False',
    replaces:   'fnmatch.fnmatch(str(p), pattern)',
    watchOut:   "in match(), ** is just * — use full_match for recursive patterns",
  },

  parameters: [
    { name: 'pattern',        type: 'str | PurePath', required: true,  default: null,   desc: 'Glob pattern: * ? [seq] [!seq] within one component; ** (full_match only) for any number of components.' },
    { name: 'case_sensitive', type: 'bool | None',    required: false, default: 'None', desc: 'None follows the flavour: case-sensitive for POSIX, insensitive for Windows.' },
  ],

  modes: [
    {
      id: 'both',
      label: 'match vs full_match',
      blurb: 'The same pattern through both methods.',
      params: [
        { name: 'path',    type: 'str', hint: 'a path',         input: 'text' },
        { name: 'pattern', type: 'str', hint: 'a glob pattern', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$path})\n(p.match({$pattern}), p.full_match({$pattern}))',
      cases: [
        { id: 'ext',    label: '*.py',          values: { path: 'src/pkg/core.py', pattern: '*.py' } },
        { id: 'deep',   label: '**/*.py',       values: { path: 'src/pkg/core.py', pattern: '**/*.py' } },
        { id: 'tail',   label: 'pkg/*.py',      values: { path: 'src/pkg/core.py', pattern: 'pkg/*.py' } },
        { id: 'anchor', label: 'absolute',      values: { path: '/etc/nginx/nginx.conf', pattern: '/etc/*/*.conf' } },
        { id: 'class',  label: '[0-9] class',   values: { path: 'logs/app.3.log', pattern: 'app.[0-9].log' } },
        { id: 'case',   label: 'case',          values: { path: 'IMG_01.JPG', pattern: '*.jpg' } },
        { id: 'empty',  label: 'empty pattern', values: { path: 'a.txt', pattern: '' } },
      ],
    },
  ],
  demoExplainer: "For 'src/pkg/core.py' the relative pattern '*.py' matches through match() (only the last part is compared) but not through full_match(), which needs the whole path. '**/*.py' works in both, but for different reasons: full_match treats ** as any number of folders, while match treats ** like * and still compares from the right. An empty pattern is a ValueError for match(), and the demo never gets to full_match(); on its own, full_match('') only matches the empty path '.'.",

  patterns: [
    {
      name: 'Filter a list of paths',
      desc: 'full_match with ** mirrors what glob would select.',
      code: "from pathlib import PurePosixPath\nsources = [p for p in paths if PurePosixPath(p).full_match('src/**/*.py')]",
    },
    {
      name: 'Case-insensitive extension test',
      desc: 'Force case-insensitivity on POSIX paths.',
      code: "from pathlib import Path\nimages = [p for p in Path('photos').iterdir() if p.match('*.jp*g', case_sensitive=False)]",
    },
    {
      name: 'Ignore rules',
      desc: 'Skip paths that match any pattern.',
      code: "from pathlib import PurePosixPath\nIGNORE = ['**/__pycache__/**', '**/*.pyc', '.git/**']\ndef ignored(p):\n    return any(PurePosixPath(p).full_match(pat) for pat in IGNORE)",
    },
  ],

  examples: [
    { title: 'match compares from the right', code: "from pathlib import PurePosixPath\nPurePosixPath('a/b/c.py').match('b/*.py')", returns: 'True' },
    { title: 'full_match needs the whole path', code: "from pathlib import PurePosixPath\nPurePosixPath('a/b/c.py').full_match('b/*.py')", returns: 'False' },
    { title: '** spans folders in full_match', code: "from pathlib import PurePosixPath\nPurePosixPath('a/b/c.py').full_match('**/*.py')", returns: 'True' },
    { title: '** can also match zero folders', code: "from pathlib import PurePosixPath\nPurePosixPath('c.py').full_match('**/*.py')", returns: 'True' },
    { title: 'An absolute pattern must match everything', code: "from pathlib import PurePosixPath\nPurePosixPath('/a/b.py').match('/*.py')", returns: 'False' },
    { title: 'case_sensitive=False', code: "from pathlib import PurePosixPath\nPurePosixPath('IMG_01.JPG').match('*.jpg', case_sensitive=False)", returns: 'True' },
    { title: 'Empty pattern',       code: "from pathlib import PurePosixPath\nPurePosixPath('a.txt').match('')", returns: 'ValueError: empty pattern' },
  ],

  pitfalls: [
    {
      name: 'Expecting match("*.py") to mean "a .py file in this folder"',
      desc: 'match() only looks at as many trailing components as the pattern has, so any depth matches. Use full_match for anchored patterns.',
      wrong: { label: 'match', code: "from pathlib import PurePosixPath\nPurePosixPath('vendor/lib/x.py').match('*.py')", output: 'True' },
      fix:   { label: 'full_match', code: "from pathlib import PurePosixPath\nPurePosixPath('vendor/lib/x.py').full_match('*.py')", output: 'False' },
    },
    {
      name: 'Case differences on POSIX',
      desc: 'PurePosixPath and PosixPath match case-sensitively by default; Windows paths do not.',
      wrong: { label: 'default', code: "from pathlib import PurePosixPath\nPurePosixPath('README.MD').full_match('*.md')", output: 'False' },
      fix:   { label: 'case_sensitive=False', code: "from pathlib import PurePosixPath\nPurePosixPath('README.MD').full_match('*.md', case_sensitive=False)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Filtering paths you already have (from a list, a zip, a database)',
      'Ignore / include rules with ** (full_match)',
    ],
    avoid: [
      'Finding files on disk → Path.glob / rglob',
      'Regular-expression power → re.fullmatch on as_posix()',
    ],
  },

  notes: {
    cpython:        'Both are defined on PurePathBase in Lib/pathlib/_abc.py; patterns are compiled with glob.translate(…, include_hidden=True), so * also matches names starting with a dot',
    'Version':      'full_match added in 3.13; case_sensitive parameter added to match in 3.12',
    'Semantics':    'Same pattern language as Path.glob: * ? [seq] [!seq] inside one component, ** for any number of components (full_match only)',
  },

  related: [
    { name: 'glob / rglob / walk', slug: 'glob', when: 'Find matching files on disk' },
    { name: 'name / suffix',       slug: 'name', when: 'Simple extension tests' },
    { name: 'PureWindowsPath',     slug: 'purewindowspath', when: 'Case-insensitive by default' },
  ],

  faq: [
    {
      q: 'What is the difference between match and full_match?',
      a: "match() compares a relative pattern against the end of the path and treats ** like *. full_match() (3.13+) compares against the whole path and treats ** as any number of folders, the same as glob().",
    },
    {
      q: 'Does PurePath.match support **?',
      a: "Not recursively: in match() '**' behaves like '*' for a single component. Use full_match('**/*.py') on Python 3.13+.",
    },
    {
      q: 'How do I match a path case-insensitively?',
      a: "Pass case_sensitive=False (3.12+ for match, 3.13+ for full_match). PureWindowsPath and WindowsPath are case-insensitive by default.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.full_match',
    meta:  'PurePath.full_match / match',
  },
};
