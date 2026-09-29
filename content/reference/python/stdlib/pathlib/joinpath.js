// content/reference/python/stdlib/pathlib/joinpath.js

export const meta = {
  slug:        'joinpath',
  name:        'PurePath.joinpath',
  signature:   'PurePath.joinpath(*pathsegments) / path / segment',
  blurb:       'Join path segments: the / operator adds one, joinpath() adds several. An absolute segment starts the path over.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (with_segments 3.12+)',
  searchTerms: 'PurePath.joinpath joinpath slash operator / join paths python pathlib concatenate path os.path.join equivalent truediv rtruediv with_segments PurePath.with_segments subclass',
};

export const method = {
  slug:      'joinpath',
  name:      'PurePath.joinpath',
  signature: 'PurePath.joinpath(*pathsegments) / path / segment',
  returns:   { type: 'PurePath', desc: 'A new path of the same class.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (with_segments 3.12+)',
  hasLiveDemo: true,

  subtitle: 'p / "a" / "b" and p.joinpath("a", "b") are the same thing. Both follow os.path.join: separators are inserted for you, extra slashes vanish, and any absolute segment throws away what came before it.',

  covers: ['PurePath.joinpath'],

  cheat: {
    commonCall: "base / 'sub' / 'file.txt'",
    returns:    'a new path; str / path works too',
    replaces:   'os.path.join(base, "sub", "file.txt")',
    watchOut:   "base / '/etc' is just /etc",
  },

  parameters: [
    { name: '*pathsegments', type: 'str | os.PathLike', required: false, default: null, desc: 'Segments to append, in order. Each may contain separators itself.' },
  ],

  modes: [
    {
      id: 'slash',
      label: 'the / operator',
      blurb: 'Append one segment.',
      params: [
        { name: 'base',  type: 'str', hint: 'left side',  input: 'text' },
        { name: 'child', type: 'str', hint: 'right side', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$base}) / {$child}',
      cases: [
        { id: 'plain',  label: 'plain',            values: { base: '/srv/app', child: 'static/logo.svg' } },
        { id: 'abs',    label: 'absolute segment', values: { base: '/srv/app', child: '/etc/passwd' } },
        { id: 'empty',  label: 'empty segment',    values: { base: '/srv/app', child: '' } },
        { id: 'dd',     label: '..',               values: { base: '/srv/app', child: '../logs' } },
      ],
    },
    {
      id: 'joinpath',
      label: 'joinpath()',
      blurb: 'Append several segments at once.',
      params: [
        { name: 'base', type: 'str', hint: 'start',          input: 'text' },
        { name: 'a',    type: 'str', hint: 'first segment',  input: 'text' },
        { name: 'b',    type: 'str', hint: 'second segment', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$base}).joinpath({$a}, {$b})',
      cases: [
        { id: 'plain', label: 'plain',          values: { base: 'project', a: 'src', b: 'main.py' } },
        { id: 'abs',   label: 'absolute middle', values: { base: 'project', a: '/tmp', b: 'scratch.txt' } },
        { id: 'slash', label: 'extra slashes',  values: { base: 'project/', a: '/src/', b: 'main.py' } },
      ],
    },
  ],
  demoExplainer: "An absolute segment resets the path: '/srv/app' / '/etc/passwd' is '/etc/passwd', which is why joining user input onto a base folder is not a safety check. An empty segment adds nothing, and '..' is kept literally. In the last joinpath case '/src/' starts with a slash, so 'project/' is discarded.",

  patterns: [
    {
      name: 'Join a list of segments',
      desc: 'Unpack the list into joinpath.',
      code: "from pathlib import Path\nparts = ['2026', '09', 'report.csv']\np = Path('archive').joinpath(*parts)",
    },
    {
      name: 'Keep user-supplied names inside a folder',
      desc: 'Join, resolve, then verify the result is still under the base.',
      code: "from pathlib import Path\nbase = Path('uploads').resolve()\ntarget = (base / user_name).resolve()\nif not target.is_relative_to(base):\n    raise ValueError('path escapes the upload folder')",
    },
    {
      name: 'Subclass that survives joining (3.12+)',
      desc: 'Override with_segments to pass extra state to derived paths.',
      code: "from pathlib import Path\nclass TaggedPath(Path):\n    def __init__(self, *args, tag=None):\n        super().__init__(*args)\n        self.tag = tag\n    def with_segments(self, *pathsegments):\n        return type(self)(*pathsegments, tag=self.tag)",
    },
  ],

  examples: [
    { title: 'Chaining /',                    code: "from pathlib import PurePosixPath\nPurePosixPath('/srv') / 'www' / 'index.html'", returns: "PurePosixPath('/srv/www/index.html')" },
    { title: 'joinpath with several segments', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv').joinpath('www', 'index.html')", returns: "PurePosixPath('/srv/www/index.html')" },
    { title: 'A str on the left',             code: "from pathlib import PurePosixPath\n'/srv' / PurePosixPath('www')", returns: "PurePosixPath('/srv/www')" },
    { title: 'Joining two paths',             code: "from pathlib import PurePosixPath\nPurePosixPath('a/b') / PurePosixPath('c/d')", returns: "PurePosixPath('a/b/c/d')" },
    { title: 'An absolute segment wins',      code: "from pathlib import PurePosixPath\nPurePosixPath('/usr').joinpath('/etc', 'hosts')", returns: "PurePosixPath('/etc/hosts')" },
    { title: 'Non-path operands are rejected', code: "from pathlib import PurePosixPath\nPurePosixPath('logs') / 2026", returns: "TypeError: unsupported operand type(s) for /: 'PurePosixPath' and 'int'" },
    { title: 'with_segments builds same-class paths', code: "from pathlib import PurePosixPath\nPurePosixPath('/x').with_segments('a', 'b')", returns: "PurePosixPath('a/b')" },
  ],

  pitfalls: [
    {
      name: 'Joining a number',
      desc: 'Segments must be str or path-like; format numbers yourself.',
      wrong: { label: '/ int', code: "from pathlib import PurePosixPath\nPurePosixPath('logs') / 2026", output: "TypeError: unsupported operand type(s) for /: 'PurePosixPath' and 'int'" },
      fix:   { label: '/ str(int)', code: "from pathlib import PurePosixPath\nPurePosixPath('logs') / str(2026)", output: "PurePosixPath('logs/2026')" },
    },
    {
      name: 'Leading slash on the second segment',
      desc: "'/static' is absolute, so it replaces the base. Strip the slash, or join the parts individually.",
      wrong: { label: "/ '/static'", code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/app') / '/static/logo.svg'", output: "PurePosixPath('/static/logo.svg')" },
      fix:   { label: "lstrip('/')", code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/app') / '/static/logo.svg'.lstrip('/')", output: "PurePosixPath('/srv/app/static/logo.svg')" },
    },
    {
      name: 'Using + to join',
      desc: 'Paths do not concatenate with +; / is the join operator.',
      wrong: { label: 'path + str', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv') + '/www'", output: "TypeError: unsupported operand type(s) for +: 'PurePosixPath' and 'str'" },
      fix:   { label: 'path / str', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv') / 'www'", output: "PurePosixPath('/srv/www')" },
    },
  ],

  when: {
    use: [
      'Building any path from pieces',
      'joinpath(*parts) when the segments are in a list',
    ],
    avoid: [
      'Security checks on user input → resolve() + is_relative_to()',
      'Changing the extension or file name → with_suffix / with_name',
    ],
  },

  notes: {
    cpython:          'PurePath.joinpath and __truediv__ both call self.with_segments(self, *segments); the parsing that follows uses os.path.join rules (posixpath.join / ntpath.join)',
    'with_segments':  'Added in 3.12: every derived path (/, parent, iterdir(), glob() …) is created through it, so subclasses can override it to carry state',
    '__rtruediv__':   "'a' / PurePosixPath('b') works because str has no __truediv__, so Python falls back to the path's __rtruediv__",
  },

  related: [
    { name: 'The / operator',  slug: 'truediv',  when: 'How __truediv__ / __rtruediv__ dispatch', category: 'operators' },
    { name: 'relative_to / is_relative_to', slug: 'relative_to', when: 'Check a join stayed inside a base' },
    { name: 'PurePath',        slug: 'purepath', when: 'Several segments in the constructor' },
    { name: 'TypeError', slug: 'typeerror', when: 'Joining a non-path', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I join paths with pathlib?',
      a: "Use the / operator: Path('data') / 'raw' / 'file.csv'. joinpath('raw', 'file.csv') does the same with several segments in one call.",
    },
    {
      q: 'Why does joining an absolute path discard the base?',
      a: "pathlib follows os.path.join: a segment that starts at the root describes a complete location, so everything before it is dropped. Path('/srv') / '/etc' is /etc.",
    },
    {
      q: 'Is Path / str the same as os.path.join?',
      a: 'The joining rule is the same. The difference is normalisation: pathlib also collapses repeated slashes and "." segments and drops a trailing slash, while os.path.join leaves the strings as they are.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.joinpath',
    meta:  'PurePath.joinpath / with_segments',
  },
};
