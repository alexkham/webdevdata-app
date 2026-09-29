// content/reference/python/stdlib/pathlib/as_posix.js

export const meta = {
  slug:        'as_posix',
  name:        'PurePath.as_posix',
  signature:   'PurePath.as_posix() / .as_uri() / Path.from_uri(uri)',
  blurb:       'as_posix() gives the path with forward slashes; as_uri() turns an absolute path into a file: URI, and Path.from_uri() (3.13+) turns one back.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (from_uri 3.13+)',
  searchTerms: 'PurePath.as_posix as_posix as_uri from_uri PurePath.as_uri Path.as_uri Path.from_uri file uri path to url file:/// forward slashes convert backslash percent encoding relative path cannot be expressed as a file uri',
};

export const method = {
  slug:      'as_posix',
  name:      'PurePath.as_posix',
  signature: 'PurePath.as_posix() / .as_uri() / Path.from_uri(uri)',
  returns:   { type: 'str | Path', desc: 'as_posix and as_uri return str; from_uri returns a Path.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (from_uri 3.13+)',
  hasLiveDemo: true,

  subtitle: "Three conversions. as_posix() is str(path) with '/' separators — the portable way to print or store a path. as_uri() percent-encodes an absolute path into file:///…; from_uri() parses such a URI back into a Path.",

  covers: ['PurePath.as_uri', 'Path.as_uri', 'Path.from_uri'],

  cheat: {
    commonCall: "PurePosixPath('/tmp/a b.txt').as_uri()",
    returns:    "'file:///tmp/a%20b.txt'",
    replaces:   "str(p).replace('\\\\', '/') and hand-built 'file://' + path",
    watchOut:   "as_uri() on a relative path is a ValueError",
  },

  parameters: [
    { name: 'uri', type: 'str', required: true, default: null, desc: "from_uri only: a 'file:' URI. It must describe an absolute path for the running OS." },
  ],

  modes: [
    {
      id: 'uri',
      label: 'as_posix / as_uri',
      blurb: 'Non-ASCII and reserved characters are percent-encoded as UTF-8 bytes.',
      params: [{ name: 'path', type: 'str', hint: 'an absolute POSIX path', input: 'text' }],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$path})\n(p.as_posix(), p.as_uri())',
      cases: [
        { id: 'plain', label: 'plain',     values: { path: '/etc/hosts' } },
        { id: 'space', label: 'space',     values: { path: '/home/ada/My Documents/cv.pdf' } },
        { id: 'utf',   label: 'non-ASCII', values: { path: '/tmp/café #1.txt' } },
        { id: 'rel',   label: 'relative',  values: { path: 'docs/cv.pdf' } },
      ],
    },
  ],
  demoExplainer: "'/' and the unreserved characters (letters, digits, _ . - ~) stay as they are; everything else becomes %XX of its UTF-8 bytes, so é is %C3%A9 and # is %23. A file URI must be absolute, so a relative path raises ValueError — call resolve() or absolute() on a Path first.",

  patterns: [
    {
      name: 'Open a local file in the browser',
      desc: 'webbrowser wants a URL; as_uri needs an absolute path.',
      code: "import webbrowser\nfrom pathlib import Path\nwebbrowser.open(Path('report.html').resolve().as_uri())",
    },
    {
      name: 'Store paths portably',
      desc: 'as_posix() in files and databases; Path() parses it back on any OS.',
      code: "from pathlib import Path\nrecord = {'file': p.relative_to(root).as_posix()}\nrestored = root / record['file']",
    },
    {
      name: 'Accept file: URIs from other programs (3.13+)',
      desc: 'Path.from_uri decodes %XX and checks the result is absolute.',
      code: "from pathlib import Path\np = Path.from_uri(dropped_uri)",
    },
  ],

  examples: [
    { title: 'Forward slashes from a Windows path', code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:\\\\Users\\\\ada').as_posix()", returns: "'C:/Users/ada'" },
    { title: 'as_posix of a POSIX path is str()',   code: "from pathlib import PurePosixPath\np = PurePosixPath('/srv/app')\np.as_posix() == str(p)", returns: 'True' },
    { title: 'A file URI',                          code: "from pathlib import PurePosixPath\nPurePosixPath('/etc/a b.txt').as_uri()", returns: "'file:///etc/a%20b.txt'" },
    { title: 'Windows drive in a URI',              code: "from pathlib import PureWindowsPath\nPureWindowsPath('C:/Users/me/a b.txt').as_uri()", returns: "'file:///C:/Users/me/a%20b.txt'" },
    { title: 'UTF-8 percent-encoding',              code: "from pathlib import PurePosixPath\nPurePosixPath('/tmp/é').as_uri()", returns: "'file:///tmp/%C3%A9'" },
    { title: 'Relative paths have no URI',          code: "from pathlib import PurePosixPath\nPurePosixPath('docs/cv.pdf').as_uri()", returns: "ValueError: relative path can't be expressed as a file URI" },
    { title: 'from_uri needs a file: URI',          code: "from pathlib import Path\nPath.from_uri('https://example.com/a.txt')", returns: "ValueError: URI does not start with 'file:': 'https://example.com/a.txt'" },
  ],

  pitfalls: [
    {
      name: 'Building a file URL by string concatenation',
      desc: 'Spaces and non-ASCII characters must be percent-encoded; as_uri does it for you.',
      wrong: { label: "'file://' + path", code: "'file://' + '/tmp/my notes.txt'", output: "'file:///tmp/my notes.txt'" },
      fix:   { label: 'as_uri()', code: "from pathlib import PurePosixPath\nPurePosixPath('/tmp/my notes.txt').as_uri()", output: "'file:///tmp/my%20notes.txt'" },
    },
    {
      name: 'Calling as_uri() on a relative Path',
      desc: 'Make it absolute first.',
      wrong: { label: 'relative', code: "from pathlib import Path\nPath('index.html').as_uri()", output: "ValueError: relative path can't be expressed as a file URI" },
      fix:   { label: 'resolve() first', code: "from pathlib import Path\nPath('index.html').resolve().as_uri().startswith('file:///')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Printing, logging or storing paths in a platform-neutral form (as_posix)',
      'Handing a local file to a browser or any API that wants a URL (as_uri)',
      'Receiving file: URIs from drag and drop or other programs (from_uri, 3.13+)',
    ],
    avoid: [
      'http(s) URLs → urllib.parse',
      'Passing a path to open() or os.* → pass the Path itself',
    ],
  },

  notes: {
    cpython:       'as_uri percent-encodes os.fsencode(path) with urllib.parse.quote_from_bytes (safe="/"); from_uri strips the empty or "localhost" authority, decodes %XX and raises ValueError unless the result is absolute',
    'from_uri':    "OS-dependent: 'file:///etc/hosts' is an absolute path on Linux and macOS but not on Windows (no drive), where from_uri raises 'URI is not absolute'",
    'Deprecated in 3.14': 'Calling as_uri() on a pure path is deprecated from 3.14 (it uses os.fsencode, which depends on the machine); Path.as_uri stays',
  },

  related: [
    { name: 'PureWindowsPath', slug: 'purewindowspath', when: 'Backslashes → as_posix()' },
    { name: 'resolve / absolute', slug: 'resolve', when: 'Make the path absolute first' },
    { name: 'is_absolute',     slug: 'is_absolute', when: 'Will as_uri work?' },
  ],

  faq: [
    {
      q: 'How do I convert a path to a file URL in Python?',
      a: "Path(p).resolve().as_uri() → 'file:///…' with spaces and non-ASCII characters percent-encoded. The path must be absolute.",
    },
    {
      q: 'How do I convert a file:// URL back to a path?',
      a: "Python 3.13+: Path.from_uri(uri). Before 3.13: urllib.parse.urlparse plus urllib.request.url2pathname.",
    },
    {
      q: 'How do I get a path with forward slashes on Windows?',
      a: 'p.as_posix(). str(p) uses backslashes on Windows; as_posix() always uses /.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.as_posix',
    meta:  'PurePath.as_posix / Path.as_uri / Path.from_uri',
  },
};
