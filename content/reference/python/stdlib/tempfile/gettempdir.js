// content/reference/python/stdlib/tempfile/gettempdir.js

export const meta = {
  slug:        'gettempdir',
  name:        'tempfile.gettempdir / gettempdirb',
  signature:   'tempfile.gettempdir()  ·  tempfile.gettempdirb()',
  blurb:       'The directory tempfile uses when you pass no dir= — chosen once from TMPDIR, TEMP, TMP and platform defaults, then cached. gettempdirb() returns the same path as bytes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (gettempdirb 3.5+)',
  searchTerms: 'gettempdir gettempdirb tempfile.gettempdir tempfile.gettempdirb python temp directory path TMPDIR TEMP TMP /tmp AppData Local Temp where are temporary files stored',
};

export const method = {
  slug:      'gettempdir',
  name:      'tempfile.gettempdir / gettempdirb',
  signature: 'tempfile.gettempdir()',
  returns:   { type: 'str | bytes', desc: 'gettempdir: an absolute str path; gettempdirb: the same path as bytes (os.fsencode).' },

  category:    'tempfile functions',
  version:     'Python 3.0+ (gettempdirb 3.5+)',
  hasLiveDemo: false,

  subtitle: 'The value differs from machine to machine (and user to user), so no output here shows it. The rule: the first directory from TMPDIR, TEMP, TMP, then the platform list, in which a test file can actually be created and written. The result is stored in tempfile.tempdir and reused by every later call.',

  covers: ['gettempdir', 'gettempdirb'],

  cheat: {
    commonCall: 'tempfile.gettempdir()',
    returns:    "e.g. '/tmp' on Linux — machine-dependent",
    replaces:   "hard-coding '/tmp' or os.environ['TEMP']",
    watchOut:   'cached after the first call — changing TMPDIR later has no effect',
  },

  parameters: [],

  patterns: [
    {
      name: 'Choose the location for one call',
      desc: 'Every function takes dir=; prefer it to changing the global default.',
      code: "import tempfile\nwith tempfile.TemporaryDirectory(dir='/var/tmp') as d:\n    ...",
    },
    {
      name: 'Point a child process at the same folder',
      desc: 'Pass the resolved path explicitly.',
      code: "import os, subprocess, tempfile\nenv = {**os.environ, 'TMPDIR': tempfile.gettempdir()}\nsubprocess.run(['tool'], env=env, check=True)",
    },
  ],

  examples: [
    { title: 'An absolute str',               code: 'import os, tempfile\npath = tempfile.gettempdir()\n(type(path).__name__, os.path.isabs(path))', returns: "('str', True)" },
    { title: 'bytes version',                 code: 'import os, tempfile\ntempfile.gettempdirb() == os.fsencode(tempfile.gettempdir())', returns: 'True' },
    { title: 'Cached in tempfile.tempdir',    code: 'import tempfile\ntempfile.gettempdir() == tempfile.tempdir', returns: 'True' },
    { title: 'A directory you can write to',  code: 'import os, tempfile\nos.access(tempfile.gettempdir(), os.W_OK)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Printing the path in tests or docs',
      desc: 'The value depends on the OS, the user and environment variables. Assert properties instead.',
      wrong: { label: 'compare to a literal', code: "import tempfile\ntempfile.gettempdir() == '/tmp'", output: 'False' },
      fix:   { label: 'check properties',     code: 'import os, tempfile\nos.path.isdir(tempfile.gettempdir())', output: 'True' },
    },
  ],

  when: {
    use: [
      'Showing or logging where temporary files go',
      'Passing the location to another program',
    ],
    avoid: [
      'Building temporary file names yourself → mkstemp / NamedTemporaryFile pick safe names',
    ],
  },

  notes: {
    cpython:      'Lib/tempfile.py _get_default_tempdir: candidates are TMPDIR, TEMP, TMP, then on Windows ~\\AppData\\Local\\Temp, %SYSTEMROOT%\\Temp, c:\\temp, c:\\tmp, \\temp, \\tmp, elsewhere /tmp, /var/tmp, /usr/tmp, and finally the current directory. Each is tested by creating and deleting a random file',
    'Docs list':  'The documentation lists C:\\TEMP, C:\\TMP, \\TEMP and \\TMP for Windows; the 3.13 source also tries the user\'s AppData\\Local\\Temp and %SYSTEMROOT%\\Temp first',
    'Changed':    '3.10: gettempdir() always returns str (it used to return tempdir as is, even bytes); gettempdirb() added in 3.5 (docs)',
    'Failure':    'If no candidate works, FileNotFoundError: "No usable temporary directory found in [...]"',
  },

  related: [
    { name: 'tempdir',       slug: 'tempdir',       when: 'The cache variable behind it' },
    { name: 'gettempprefix', slug: 'gettempprefix', when: "The default name prefix ('tmp')" },
    { name: 'mkstemp',       slug: 'mkstemp',       when: 'Uses it as the default dir' },
    { name: 'os.environ',    slug: 'environ',       when: 'TMPDIR / TEMP / TMP', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Where does Python store temporary files?',
      a: 'In tempfile.gettempdir(). It honours the TMPDIR, TEMP and TMP environment variables (in that order); otherwise it is usually /tmp on Linux and macOS-like systems and the user\'s AppData\\Local\\Temp folder on Windows.',
    },
    {
      q: 'Why does changing TMPDIR not change gettempdir()?',
      a: 'The first call caches its result in tempfile.tempdir. Set the environment variable before anything uses tempfile, or pass dir= to the functions you call.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.gettempdir',
    meta:  'tempfile.gettempdir',
  },

};
