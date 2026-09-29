// content/reference/python/stdlib/pathlib/relative_to.js

export const meta = {
  slug:        'relative_to',
  name:        'PurePath.relative_to',
  signature:   'PurePath.relative_to(other, walk_up=False) / .is_relative_to(other)',
  blurb:       'The path from other to this path — or a ValueError when this path is not inside other (unless walk_up=True adds ".." segments). is_relative_to() asks the same question without raising.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (is_relative_to 3.9+, walk_up 3.12+)',
  searchTerms: 'PurePath.relative_to relative_to is_relative_to PurePath.is_relative_to relative path python pathlib relpath walk_up is not in the subpath of different anchors check path inside directory',
};

export const method = {
  slug:      'relative_to',
  name:      'PurePath.relative_to',
  signature: 'PurePath.relative_to(other, walk_up=False) / .is_relative_to(other)',
  returns:   { type: 'PurePath | bool', desc: 'relative_to returns a relative path; is_relative_to returns True or False.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (is_relative_to 3.9+, walk_up 3.12+)',
  hasLiveDemo: true,

  subtitle: 'Both are lexical: they compare path components, never the file system. relative_to strips the other path off the front; with walk_up=True (3.12+) it may climb with ".." like os.path.relpath.',

  covers: ['PurePath.relative_to', 'PurePath.is_relative_to'],

  cheat: {
    commonCall: "PurePosixPath('/srv/app/static/logo.svg').relative_to('/srv/app')",
    returns:    "PurePosixPath('static/logo.svg')",
    replaces:   'os.path.relpath (with walk_up=True) and startswith() checks',
    watchOut:   "not inside → ValueError: '…' is not in the subpath of '…'",
  },

  parameters: [
    { name: 'other',   type: 'str | os.PathLike', required: true,  default: null,    desc: 'The base path.' },
    { name: 'walk_up', type: 'bool',              required: false, default: 'False', desc: "relative_to only (3.12+): allow '..' segments when this path is not under other. Keyword-only in practice." },
  ],

  modes: [
    {
      id: 'relative',
      label: 'relative_to',
      blurb: 'Strip other off the front of path.',
      params: [
        { name: 'path',  type: 'str', hint: 'the path',  input: 'text' },
        { name: 'other', type: 'str', hint: 'base path', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$path}).relative_to({$other})',
      cases: [
        { id: 'inside',  label: 'inside',        values: { path: '/srv/app/static/logo.svg', other: '/srv/app' } },
        { id: 'same',    label: 'same path',     values: { path: '/srv/app', other: '/srv/app/' } },
        { id: 'outside', label: 'outside',       values: { path: '/etc/hosts', other: '/srv/app' } },
        { id: 'prefix',  label: 'string prefix', values: { path: '/srv/application', other: '/srv/app' } },
      ],
    },
    {
      id: 'walkup',
      label: 'walk_up=True',
      blurb: 'Climb out of other with ".." when needed.',
      params: [
        { name: 'path',  type: 'str', hint: 'the path',  input: 'text' },
        { name: 'other', type: 'str', hint: 'base path', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$path}).relative_to({$other}, walk_up=True)',
      cases: [
        { id: 'sibling', label: 'sibling folder', values: { path: '/srv/logs/app.log', other: '/srv/app/bin' } },
        { id: 'anchors', label: 'abs vs rel',     values: { path: '/srv/logs', other: 'srv' } },
        { id: 'dotdot',  label: '.. in other',    values: { path: 'a/b', other: 'a/../c' } },
      ],
    },
    {
      id: 'check',
      label: 'is_relative_to',
      blurb: 'True when other is this path or one of its parents.',
      params: [
        { name: 'path',  type: 'str', hint: 'the path',  input: 'text' },
        { name: 'other', type: 'str', hint: 'base path', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$path}).is_relative_to({$other})',
      cases: [
        { id: 'inside', label: 'inside',        values: { path: '/srv/app/x.py', other: '/srv/app' } },
        { id: 'prefix', label: 'string prefix', values: { path: '/srv/application', other: '/srv/app' } },
        { id: 'dotdot', label: 'escapes with ..', values: { path: '/srv/app/../secret', other: '/srv/app' } },
      ],
    },
  ],
  demoExplainer: "The checks are per component, so '/srv/application' is not under '/srv/app' even though the string starts with it. They are also purely textual: '/srv/app/../secret' counts as inside '/srv/app' because '..' is not resolved — call resolve() first when that matters. With walk_up=True the error changes: an absolute path and a relative one have different anchors, and a '..' inside other cannot be walked.",

  patterns: [
    {
      name: 'Paths relative to a project root',
      desc: 'Nice short names for logs and reports.',
      code: "from pathlib import Path\nroot = Path.cwd()\nfor p in sorted(root.rglob('*.py')):\n    print(p.relative_to(root).as_posix())",
    },
    {
      name: 'Refuse paths that escape a folder',
      desc: 'Resolve both sides first so ".." and symlinks are accounted for.',
      code: "from pathlib import Path\nbase = Path('uploads').resolve()\ntarget = (base / name).resolve()\nif not target.is_relative_to(base):\n    raise PermissionError(name)",
    },
    {
      name: 'Mirror a tree into another folder',
      desc: 'relative_to gives the part to re-attach under the destination.',
      code: "from pathlib import Path\nsrc, dst = Path('src'), Path('build')\nfor f in src.rglob('*.txt'):\n    out = dst / f.relative_to(src)",
    },
  ],

  examples: [
    { title: 'Strip a base folder',        code: "from pathlib import PurePosixPath\nPurePosixPath('/home/ada/docs/cv.pdf').relative_to('/home/ada')", returns: "PurePosixPath('docs/cv.pdf')" },
    { title: 'Same path gives "."',        code: "from pathlib import PurePosixPath\nPurePosixPath('/home/ada').relative_to('/home/ada')", returns: "PurePosixPath('.')" },
    { title: 'Not inside: ValueError',     code: "from pathlib import PurePosixPath\nPurePosixPath('/etc/passwd').relative_to('/usr')", returns: "ValueError: '/etc/passwd' is not in the subpath of '/usr'" },
    { title: 'walk_up=True climbs with ..', code: "from pathlib import PurePosixPath\nPurePosixPath('/etc/passwd').relative_to('/usr', walk_up=True)", returns: "PurePosixPath('../etc/passwd')" },
    { title: 'Different anchors',          code: "from pathlib import PurePosixPath\nPurePosixPath('/etc/passwd').relative_to('etc', walk_up=True)", returns: "ValueError: '/etc/passwd' and 'etc' have different anchors" },
    { title: 'is_relative_to never raises', code: "from pathlib import PurePosixPath\n(PurePosixPath('/srv/app/x').is_relative_to('/srv'), PurePosixPath('/srv/app/x').is_relative_to('/etc'))", returns: '(True, False)' },
    { title: 'Components, not characters', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/application').is_relative_to('/srv/app')", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Checking containment with str.startswith',
      desc: "A string prefix is not a parent folder: '/srv/app2' starts with '/srv/app'.",
      wrong: { label: 'startswith', code: "'/srv/app2/secret'.startswith('/srv/app')", output: 'True' },
      fix:   { label: 'is_relative_to', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/app2/secret').is_relative_to('/srv/app')", output: 'False' },
    },
    {
      name: 'Trusting a lexical check with ".." in the path',
      desc: "Without resolve(), '..' is just a name, so a path that climbs out still looks inside.",
      wrong: { label: 'lexical', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/app/../../etc/passwd').is_relative_to('/srv/app')", output: 'True' },
      fix:   { label: 'resolve() first', code: "from pathlib import Path\nbase = Path('app').resolve()\n(base / '../../etc/passwd').resolve().is_relative_to(base)", output: 'False' },
    },
    {
      name: 'Expecting relpath behaviour by default',
      desc: 'Unlike os.path.relpath, relative_to refuses to add ".." unless you pass walk_up=True (3.12+).',
      wrong: { label: 'default', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/logs').relative_to('/srv/app')", output: "ValueError: '/srv/logs' is not in the subpath of '/srv/app'" },
      fix:   { label: 'walk_up=True', code: "from pathlib import PurePosixPath\nPurePosixPath('/srv/logs').relative_to('/srv/app', walk_up=True)", output: "PurePosixPath('../logs')" },
    },
  ],

  when: {
    use: [
      'Displaying paths relative to a root folder',
      'Mirroring a directory tree under a new base',
      'Containment checks (after resolve())',
    ],
    avoid: [
      'Paths with unresolved ".." or symlinks → resolve() both sides first',
      'Paths on different drives (Windows) → no relative path exists; handle the ValueError',
    ],
  },

  notes: {
    cpython:        'Lib/pathlib/_local.py: walks other and its parents until one equals self or one of self.parents; the number of steps becomes the ".." count',
    'Errors':       "'X' is not in the subpath of 'Y' (not inside, walk_up=False) · 'X' and 'Y' have different anchors (walk_up=True, e.g. absolute vs relative) · '..' segment in 'Y' cannot be walked",
    'Deprecated':   'Passing extra positional arguments (joined onto other) is deprecated since 3.12 and removed in 3.14',
    'os.path.relpath': 'relpath makes both paths absolute against the cwd first; relative_to is purely lexical',
  },

  related: [
    { name: 'parts / parents', slug: 'parts',    when: 'The ancestors it compares against' },
    { name: 'resolve / absolute', slug: 'resolve', when: 'Normalise before comparing' },
    { name: 'The / operator',  slug: 'joinpath', when: 'The inverse: base / relative' },
    { name: 'ValueError', slug: 'valueerror', when: 'Raised when not relative', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I get a relative path in pathlib?',
      a: "target.relative_to(base). If target is not inside base, pass walk_up=True (Python 3.12+) to get a path with '..' segments, like os.path.relpath.",
    },
    {
      q: "What does \"is not in the subpath of\" mean?",
      a: "relative_to could not strip the base because the path does not start with it component by component. Check the spelling, resolve() both paths if one is relative or contains '..', or use walk_up=True.",
    },
    {
      q: 'How do I check if a path is inside a directory?',
      a: 'path.resolve().is_relative_to(folder.resolve()). Resolving first handles ".." and symlinks; is_relative_to compares whole components so /srv/app2 is not inside /srv/app.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.relative_to',
    meta:  'PurePath.relative_to / is_relative_to',
  },
};
