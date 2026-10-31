// content/reference/python/stdlib/tempfile/mktemp.js

export const meta = {
  slug:        'mktemp',
  name:        'tempfile.mktemp',
  signature:   "tempfile.mktemp(suffix='', prefix='tmp', dir=None)",
  blurb:       'Deprecated since 2.3: returns a path that did not exist a moment ago, without creating anything — so another process can take it first. Use mkstemp() or NamedTemporaryFile(delete=False).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (deprecated)',
  searchTerms: 'mktemp tempfile.mktemp python deprecated unsafe temporary file name race condition security hole replace with mkstemp NamedTemporaryFile delete=False',
};

export const method = {
  slug:      'mktemp',
  name:      'tempfile.mktemp',
  signature: "tempfile.mktemp(suffix='', prefix='tmp', dir=None)",
  returns:   { type: 'str', desc: 'os.path.join(dir, prefix + 8 random characters + suffix) — absolute when dir is None — that did not exist when checked. No file is created.' },

  category:    'tempfile function',
  version:     'Python 3.0+ (deprecated)',
  hasLiveDemo: false,

  subtitle: 'mktemp() checks a random name with os.lstat and returns it. Between that check and your open() call, any other process — including an attacker on a shared machine — can create a file or symlink with that name. The safe functions create the file in the same step (O_EXCL). It still works and issues no warning; the docs mark it deprecated since 2.3.',

  covers: ['mktemp'],

  cheat: {
    commonCall: "path = tempfile.mktemp(suffix='.txt')  # do not",
    returns:    'a name only — nothing is created',
    replaces:   'nothing: replace it with mkstemp()',
    watchOut:   'race condition between choosing the name and creating the file',
  },

  parameters: [
    { name: 'suffix', type: 'str', required: false, default: "''",    desc: 'End of the name. None and bytes are not supported (unlike mkstemp).' },
    { name: 'prefix', type: 'str', required: false, default: "'tmp'", desc: 'Start of the name.' },
    { name: 'dir',    type: 'str | None', required: false, default: 'None', desc: 'Directory; None means gettempdir().' },
  ],

  patterns: [
    {
      name: 'The replacement the docs give',
      desc: 'NamedTemporaryFile(delete=False) creates the file and hands you its name.',
      code: "import os, tempfile\nf = tempfile.NamedTemporaryFile(delete=False)\nf.write(b'Hello World!\\n')\nf.close()\nuse(f.name)\nos.unlink(f.name)",
    },
    {
      name: 'Or mkstemp',
      desc: 'Same naming, created atomically.',
      code: "import os, tempfile\nfd, path = tempfile.mkstemp(suffix='.txt')\nos.close(fd)",
    },
  ],

  examples: [
    { title: 'A name, but no file',       code: "import os, tempfile\npath = tempfile.mktemp(dir='.')\nos.path.exists(path)", returns: 'False' },
    { title: "'tmp' + 8 random characters", code: "import os, tempfile\nname = os.path.basename(tempfile.mktemp(dir='.'))\n(name.startswith('tmp'), len(name))", returns: '(True, 11)' },
    { title: 'No warning is issued',      code: "import tempfile, warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    tempfile.mktemp(dir='.')\nlen(caught)", returns: '0' },
    { title: 'prefix=None is not supported', code: "import tempfile\ntempfile.mktemp(prefix=None, dir='.')", returns: "TypeError: unsupported operand type(s) for +: 'NoneType' and 'str'" },
  ],

  pitfalls: [
    {
      name: 'Name now, file later',
      desc: 'The window between mktemp() and open() is the security hole. Create the file in the same call.',
      wrong: { label: 'mktemp + open', code: "import os, tempfile\npath = tempfile.mktemp(dir='.')\nwith open(path, 'wb') as f:\n    f.write(b'secret')\nsize = os.path.getsize(path)\nos.remove(path)\nsize", output: '6' },
      fix:   { label: 'mkstemp',       code: "import os, tempfile\nfd, path = tempfile.mkstemp(dir='.')\nwith os.fdopen(fd, 'wb') as f:\n    f.write(b'secret')\nsize = os.path.getsize(path)\nos.remove(path)\nsize", output: '6' },
    },
  ],

  when: {
    use: [
      'Never in new code',
    ],
    avoid: [
      'Everything → mkstemp(), NamedTemporaryFile(delete=False), TemporaryDirectory',
    ],
  },

  notes: {
    cpython:      'Lib/tempfile.py: tries up to TMP_MAX names and returns the first for which os.lstat fails. A runtime warning is present in the source but commented out',
    'Deprecated': 'Since 2.3 (docs); unlike most deprecations it emits no DeprecationWarning',
    'Why unsafe': 'Between the check and the creation another process can create the file or a symlink to a file of yours; O_EXCL creation (mkstemp) closes that gap',
  },

  related: [
    { name: 'mkstemp',            slug: 'mkstemp',            when: 'The safe replacement' },
    { name: 'NamedTemporaryFile', slug: 'namedtemporaryfile', when: 'delete=False: a created file with a name' },
    { name: 'TemporaryDirectory', slug: 'temporarydirectory', when: 'A private folder to put names in' },
  ],

  faq: [
    {
      q: 'Why is mktemp unsafe?',
      a: 'It only picks a name; the file is created later by your code. In between, another process can create that path (for example as a symlink pointing at a file you own), and your open() then writes through it. mkstemp() creates the file atomically with O_EXCL, so that cannot happen.',
    },
    {
      q: 'What should I use instead of tempfile.mktemp?',
      a: 'tempfile.mkstemp() for a file descriptor and path, tempfile.NamedTemporaryFile(delete=False) for a file object whose name you keep, or a TemporaryDirectory if you need names you control inside a private folder.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.mktemp',
    meta:  'tempfile.mktemp',
  },

};
