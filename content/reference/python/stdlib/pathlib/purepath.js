// content/reference/python/stdlib/pathlib/purepath.js

export const meta = {
  slug:        'purepath',
  name:        'pathlib.PurePath',
  signature:   'pathlib.PurePath(*pathsegments)',
  blurb:       'A path you can take apart, join and compare without any file-system access. PurePosixPath and PureWindowsPath are its two flavours.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'purepath pureposixpath pure path pathlib pure path no io path arithmetic PurePath.parser parser posixpath ntpath normalise path compare paths hash',
};

export const method = {
  slug:      'purepath',
  name:      'pathlib.PurePath',
  signature: 'pathlib.PurePath(*pathsegments)',
  returns:   { type: 'PurePosixPath | PureWindowsPath', desc: 'PurePath itself is never instantiated: it returns the flavour of the running OS.' },

  category:    'pathlib class',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Everything that is pure string logic — parsing, joining, name and suffix, parents, matching — lives on PurePath. It never reads the disk, so it is safe for paths from another machine and for paths that do not exist.',

  covers: ['PurePath', 'PurePosixPath', 'PurePath.parser'],

  cheat: {
    commonCall: "PurePosixPath('/srv/app') / 'config.toml'",
    returns:    "PurePosixPath('/srv/app/config.toml')",
    replaces:   'os.path.join / basename / dirname / splitext on strings',
    watchOut:   "PurePath(...) is PureWindowsPath on Windows — pick the flavour explicitly when it matters",
  },

  parameters: [
    { name: '*pathsegments', type: 'str | os.PathLike', required: false, default: "'.'", desc: 'Segments joined like os.path.join: an absolute segment restarts the path. No segments means the current directory, shown as ".".' },
  ],

  modes: [
    {
      id: 'normalise',
      label: 'parse',
      blurb: 'See how a string is normalised: repeated slashes and "." vanish, a trailing slash is dropped, ".." stays.',
      params: [{ name: 'text', type: 'str', hint: 'any path text', input: 'text' }],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$text})\n(p, p.parts)',
      cases: [
        { id: 'messy',  label: 'messy',            values: { text: 'docs//guide/./intro.md/' } },
        { id: 'dotdot', label: '..',               values: { text: 'src/../README.md' } },
        { id: 'empty',  label: 'empty string',     values: { text: '' } },
        { id: 'two',    label: 'two leading /',    values: { text: '//server/share' } },
        { id: 'three',  label: 'three leading /',  values: { text: '///etc/hosts' } },
      ],
    },
    {
      id: 'segments',
      label: 'several segments',
      blurb: 'PurePosixPath(a, b) joins like os.path.join — an absolute second segment wins.',
      params: [
        { name: 'a', type: 'str', hint: 'first segment',  input: 'text' },
        { name: 'b', type: 'str', hint: 'second segment', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$a}, {$b})',
      cases: [
        { id: 'rel', label: 'relative', values: { a: '/usr', b: 'local/bin' } },
        { id: 'abs', label: 'absolute', values: { a: '/usr', b: '/etc' } },
      ],
    },
    {
      id: 'compare',
      label: 'equality',
      blurb: 'Two pure paths are equal when their normalised forms are equal. POSIX flavour is case-sensitive.',
      params: [
        { name: 'a', type: 'str', hint: 'a path', input: 'text' },
        { name: 'b', type: 'str', hint: 'a path', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$a}) == PurePosixPath({$b})',
      cases: [
        { id: 'slash', label: 'trailing slash', values: { a: 'a/b/', b: 'a/b' } },
        { id: 'dot',   label: './ prefix',      values: { a: './a/b', b: 'a/b' } },
        { id: 'case',  label: 'case',           values: { a: 'README.md', b: 'readme.md' } },
        { id: 'up',    label: '..',             values: { a: 'a/../b', b: 'b' } },
      ],
    },
  ],
  demoExplainer: 'Normalisation is purely textual, so it only does what is safe without asking the OS: "//" becomes "/", "." segments and a trailing slash go away, but "a/../b" is not "b" (a could be a symlink). Exactly two leading slashes are kept because POSIX lets systems give "//" a special meaning; three or more collapse to one. The empty string means the current directory and prints as ".".',

  patterns: [
    {
      name: 'Pick the flavour explicitly',
      desc: 'Handle paths from another OS the same way on every machine.',
      code: "from pathlib import PurePosixPath, PureWindowsPath\nremote = PurePosixPath('/var/log/app.log')\nshare = PureWindowsPath(r'\\\\fileserver\\reports\\q3.xlsx')",
    },
    {
      name: 'Type hints that accept strings and paths',
      desc: 'Take str or any PathLike, convert once at the edge.',
      code: "import os\nfrom pathlib import Path\ndef load(path: str | os.PathLike) -> str:\n    return Path(path).read_text(encoding='utf-8')",
    },
    {
      name: 'Use paths as dict keys and in sets',
      desc: 'Pure paths are hashable; equal paths hash equal.',
      code: "from pathlib import PurePosixPath\nseen = {PurePosixPath('a/b'), PurePosixPath('a//b/')}\nlen(seen)  # 1",
    },
  ],

  examples: [
    { title: 'PurePath picks the OS flavour', code: "import os\nfrom pathlib import PurePath, PurePosixPath, PureWindowsPath\ntype(PurePath('x')) is (PureWindowsPath if os.name == 'nt' else PurePosixPath)", returns: 'True' },
    { title: 'Normalised on construction',    code: "from pathlib import PurePosixPath\nPurePosixPath('a//b/./c/')", returns: "PurePosixPath('a/b/c')" },
    { title: 'No arguments = current directory', code: 'from pathlib import PurePosixPath\nPurePosixPath()', returns: "PurePosixPath('.')" },
    { title: 'Segments join like os.path.join', code: "from pathlib import PurePosixPath\nPurePosixPath('/usr', 'local', 'bin')", returns: "PurePosixPath('/usr/local/bin')" },
    { title: 'Sorting compares part by part', code: "from pathlib import PurePosixPath\nsorted([PurePosixPath('b'), PurePosixPath('a/z'), PurePosixPath('a')])", returns: "[PurePosixPath('a'), PurePosixPath('a/z'), PurePosixPath('b')]" },
    { title: 'The parser attribute (3.13)',   code: "from pathlib import PurePosixPath, PureWindowsPath\n(PurePosixPath.parser.__name__, PureWindowsPath.parser.__name__)", returns: "('posixpath', 'ntpath')" },
    { title: 'Backslash is an ordinary character on POSIX', code: "from pathlib import PurePosixPath\nPurePosixPath('a\\\\b').parts", returns: "('a\\\\b',)" },
    { title: 'Only str and PathLike are accepted', code: 'from pathlib import PurePosixPath\nPurePosixPath(None)', returns: "TypeError: argument should be a str or an os.PathLike object where __fspath__ returns a str, not 'NoneType'" },
  ],

  pitfalls: [
    {
      name: 'Comparing paths of different flavours',
      desc: 'A PurePosixPath never equals a PureWindowsPath, even for the same text, and ordering them raises TypeError.',
      wrong: { label: 'mixed flavours', code: "from pathlib import PurePosixPath, PureWindowsPath\nPurePosixPath('a') < PureWindowsPath('a')", output: "TypeError: '<' not supported between instances of 'PurePosixPath' and 'PureWindowsPath'" },
      fix:   { label: 'same flavour', code: "from pathlib import PurePosixPath\nPurePosixPath('a') < PurePosixPath('b')", output: 'True' },
    },
    {
      name: 'Assuming equality means "same file"',
      desc: 'Equality is textual after normalisation. "a/../b" and "b" differ; different spellings of one file are only equal after resolve() — or use Path.samefile().',
      wrong: { label: '== on text', code: "from pathlib import PurePosixPath\nPurePosixPath('a/../b') == PurePosixPath('b')", output: 'False' },
      fix:   { label: 'samefile()', code: "from pathlib import Path\nPath('a').mkdir()\nPath('b').touch()\nPath('a/../b').samefile('b')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Path arithmetic on paths that may not exist, or belong to another machine',
      'Code that must behave identically on Windows and Linux (choose PurePosixPath or PureWindowsPath)',
      'Tests: no file system needed',
    ],
    avoid: [
      'Anything that touches the disk (exists, read_text, glob) → Path',
      'Resolving ".." or symlinks → Path.resolve()',
    ],
  },

  notes: {
    cpython:        'Lib/pathlib/_local.py: PurePath.__new__ returns PureWindowsPath if os.name == "nt" else PurePosixPath; parsing happens lazily on first access to drive / root / parts',
    'parser':       'Added in 3.13: the os.path implementation used for low-level parsing — posixpath for PurePosixPath, ntpath for PureWindowsPath',
    'Flavours':     'PurePosixPath: "/" only, case-sensitive. PureWindowsPath: "\\" and "/", drives and UNC shares, case-insensitive comparison',
    'Hashing':      'Hashable and immutable; equal paths have equal hashes',
  },

  related: [
    { name: 'PureWindowsPath', slug: 'purewindowspath', when: 'Windows rules on any OS' },
    { name: 'Path',            slug: 'path',            when: 'Adds file-system methods' },
    { name: 'parts / parent',  slug: 'parts',           when: 'Take a path apart' },
    { name: 'The / operator',  slug: 'joinpath',        when: 'Join segments' },
    { name: 'pathlib module',  slug: 'pathlib',         when: 'Overview and os.path table', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between PurePath and Path?',
      a: 'PurePath only manipulates the path text: joining, splitting, name, suffix, matching. Path is a subclass that adds I/O: exists, read_text, mkdir, glob and so on. Every Path is also a PurePath.',
    },
    {
      q: 'When should I use PurePosixPath instead of Path?',
      a: 'When the path is not on this machine (a server path in a config, a URL-like key, a path inside a zip) or when you need identical behaviour on Windows and Linux — for example in tests.',
    },
    {
      q: 'Does PurePath remove ".." from a path?',
      a: "No. PurePosixPath('a/../b') stays as written, because a could be a symlink and removing a/.. would then be wrong. Use Path.resolve() to collapse it against the real file system.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath',
    meta:  'pathlib.PurePath',
  },
};
