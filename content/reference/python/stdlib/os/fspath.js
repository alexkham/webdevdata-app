// content/reference/python/stdlib/os/fspath.js

export const meta = {
  slug:        'fspath',
  name:        'os.fspath',
  signature:   'os.fspath(path) / os.fsencode(filename) / os.fsdecode(filename)',
  blurb:       'Turn any path-like object into a plain str or bytes (fspath), and convert file names between str and bytes with the file system encoding (fsencode, fsdecode).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+ (fspath 3.6+)',
  searchTerms: 'os.fspath fspath os.fsencode fsencode os.fsdecode fsdecode os.PathLike PathLike __fspath__ path-like object file system encoding surrogateescape filename bytes str convert path to string pathlib',
};

export const method = {
  slug:      'fspath',
  name:      'os.fspath',
  signature: 'os.fspath(path) / os.fsencode(filename) / os.fsdecode(filename)',
  returns:   { type: 'str | bytes', desc: 'fspath: str or bytes unchanged, otherwise the result of __fspath__(). fsencode: bytes. fsdecode: str.' },

  category:    'os function',
  version:     'Python 3.2+ (fspath 3.6+)',
  hasLiveDemo: true,

  subtitle: 'os.fspath is the official way to say "give me this path as a string": str and bytes pass through, Path objects (and anything with __fspath__) are converted, everything else is a TypeError. fsencode and fsdecode translate between str and bytes names using the encoding the OS calls expect.',

  covers: ['fspath', 'fsencode', 'fsdecode'],

  cheat: {
    commonCall: 'os.fspath(path_like)',
    returns:    "'data/report.csv'",
    replaces:   'str(path) — which accepts anything, even None',
    watchOut:   'Undecodable bytes behave differently: surrogateescape on Linux/macOS, an error on Windows',
  },

  parameters: [
    { name: 'path / filename', type: 'str | bytes | os.PathLike', required: true, default: null, desc: 'A path in any accepted form. fsencode returns bytes unchanged; fsdecode returns str unchanged.' },
  ],

  modes: [
    {
      id: 'encode',
      label: 'fsencode / fsdecode',
      blurb: 'A file name as the bytes the OS stores, and back again.',
      params: [{ name: 'name', type: 'str', hint: 'a file name', input: 'text' }],
      template: 'import os\nraw = os.fsencode({$name})\n(raw, os.fsdecode(raw))',
      cases: [
        { id: 'ascii',  label: 'ASCII',    values: { name: 'report.txt' } },
        { id: 'accent', label: 'accents',  values: { name: 'café.txt' } },
        { id: 'cjk',    label: 'CJK',      values: { name: '報告.md' } },
      ],
    },
    {
      id: 'fspath',
      label: 'fspath',
      blurb: 'A str passes through untouched; a PurePosixPath gives its normalized string.',
      params: [{ name: 'path', type: 'str', hint: 'a POSIX path', input: 'text' }],
      template: 'import os\nfrom pathlib import PurePosixPath\n(os.fspath({$path}), os.fspath(PurePosixPath({$path})))',
      cases: [
        { id: 'clean', label: 'clean',         values: { path: 'data/report.csv' } },
        { id: 'messy', label: 'messy slashes', values: { path: 'data//raw/./2026/' } },
        { id: 'empty', label: 'empty',         values: { path: '' } },
      ],
    },
  ],
  demoExplainer: "fsencode uses UTF-8 here (the file system encoding on Windows and on any modern Linux or macOS), so é becomes b'\\xc3\\xa9' and the CJK characters three bytes each; fsdecode reverses it exactly. In the fspath tab the str is returned as typed, while the Path object has already dropped the doubled slash, the '.' and the trailing slash — and an empty path becomes '.'.",

  patterns: [
    {
      name: 'Accept str or Path in your own API',
      desc: 'Normalize once at the boundary.',
      code: "import os\ndef load(path):\n    path = os.fspath(path)   # str, bytes, Path, DirEntry … all fine\n    with open(path, 'rb') as f:\n        return f.read()",
    },
    {
      name: 'Make your class path-like',
      desc: 'Implement __fspath__ and every os, open() and shutil call accepts it.',
      code: "import os\nclass Asset:\n    def __init__(self, root, name):\n        self.root, self.name = root, name\n    def __fspath__(self):\n        return os.path.join(self.root, self.name)",
    },
    {
      name: 'Pass a name to a bytes-only API',
      desc: 'fsencode produces exactly what the OS call needs.',
      code: "import os\nraw_name = os.fsencode(filename)",
    },
  ],

  examples: [
    { title: 'A Path becomes its string',   code: "import os\nfrom pathlib import PurePosixPath\nos.fspath(PurePosixPath('a//b/./c/'))", returns: "'a/b/c'" },
    { title: 'Your own path-like class',    code: "import os\nclass Upload:\n    def __init__(self, name):\n        self.name = name\n    def __fspath__(self):\n        return '/srv/uploads/' + self.name\nos.fspath(Upload('a.png'))", returns: "'/srv/uploads/a.png'" },
    { title: 'Not a path',                  code: 'import os\nos.fspath(123)', returns: 'TypeError: expected str, bytes or os.PathLike object, not int' },
    { title: 'str → bytes (UTF-8)',         code: "import os\nos.fsencode('café.txt')", returns: "b'caf\\xc3\\xa9.txt'" },
    { title: 'bytes → str',                 code: "import os\nos.fsdecode(b'caf\\xc3\\xa9.txt')", returns: "'café.txt'" },
    { title: 'Already the right type: unchanged', code: "import os\n(os.fsencode(b'raw'), os.fsdecode('already str'))", returns: "(b'raw', 'already str')" },
    { title: 'Path is an os.PathLike',      code: "import os\nfrom pathlib import Path\nisinstance(Path('x'), os.PathLike)", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'str() hides mistakes',
      desc: "str(None) is 'None' — a perfectly valid file name. fspath refuses anything that is not a path.",
      wrong: { label: 'str(path)', code: 'path = None\nstr(path)', output: "'None'" },
      fix:   { label: 'os.fspath(path)', code: 'import os\npath = None\nos.fspath(path)', output: 'TypeError: expected str, bytes or os.PathLike object, not NoneType' },
    },
    {
      name: '__fspath__ must return str or bytes',
      desc: 'fspath checks the result of __fspath__ and raises if it is anything else.',
      wrong: { label: 'returns an int', code: "import os\nclass Bad:\n    def __fspath__(self):\n        return 42\nos.fspath(Bad())", output: 'TypeError: expected Bad.__fspath__() to return str or bytes, not int' },
      fix:   { label: 'returns a str', code: "import os\nclass Good:\n    def __fspath__(self):\n        return 'file42.txt'\nos.fspath(Good())", output: "'file42.txt'" },
    },
  ],

  when: {
    use: [
      'Functions that accept "any path" and need a str or bytes',
      'Talking to APIs that want bytes file names (fsencode) or produced them (fsdecode)',
    ],
    avoid: [
      'Displaying a path to a user → str(path) is fine there',
      'Decoding file contents → bytes.decode with the content encoding, not fsdecode',
    ],
  },

  notes: {
    cpython:          'fspath is implemented in C (Modules/posixmodule.c); fsencode and fsdecode are in Lib/os.py and use sys.getfilesystemencoding() with sys.getfilesystemencodeerrors()',
    // NOTE: ${"\\"}udcff is deliberate — Next 14.2.4's SWC turns the TEXT
    // "\\udcff" into a real lone surrogate (hydration failure); injecting the
    // backslash through a template expression is the verified workaround.
    'Error handler':  `Linux and macOS: 'surrogateescape' — undecodable bytes survive a round trip as lone surrogates (os.fsdecode(b'\\xff') is '${"\\"}udcff' there). Windows: 'surrogatepass', and os.fsdecode(b'\\xff') raises UnicodeDecodeError`,
    'os.PathLike':    'An abstract base class (3.6+); any class with __fspath__ counts as one. os.PathLike is not in os.__all__ but is public',
  },

  related: [
    { name: 'PurePath / Path', slug: 'purepath', when: 'The standard path-like objects', category: 'stdlib/pathlib' },
    { name: 'os.path.join', slug: 'join', when: 'Accepts path-like objects too', category: 'stdlib/os-path' },
    { name: 'os.listdir', slug: 'listdir', when: 'bytes in → bytes names out' },
    { name: 'TypeError', slug: 'typeerror', when: 'What fspath raises for non-paths', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I convert a pathlib Path to a string?',
      a: 'os.fspath(p) or str(p) — both give the same string for a Path. Prefer os.fspath in code that should reject non-paths: str() converts anything, including None.',
    },
    {
      q: 'What is a path-like object in Python?',
      a: 'A str, a bytes, or any object with an __fspath__() method returning str or bytes — pathlib paths and os.DirEntry, for example. All os functions, open() and shutil accept them.',
    },
    {
      q: 'What encoding does fsencode use?',
      a: "sys.getfilesystemencoding() — 'utf-8' on Windows and, in practice, on Linux and macOS — with the error handler from sys.getfilesystemencodeerrors(): 'surrogateescape' on POSIX, 'surrogatepass' on Windows.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.fspath',
    meta:  'os.fspath / fsencode / fsdecode',
  },
};
