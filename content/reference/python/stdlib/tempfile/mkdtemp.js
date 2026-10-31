// content/reference/python/stdlib/tempfile/mkdtemp.js

export const meta = {
  slug:        'mkdtemp',
  name:        'tempfile.mkdtemp',
  signature:   'tempfile.mkdtemp(suffix=None, prefix=None, dir=None)',
  blurb:       'Create a private temporary directory and return its absolute path. You remove it yourself (shutil.rmtree) — or use TemporaryDirectory instead.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'mkdtemp tempfile.mkdtemp python create temporary directory path 0o700 rmtree cleanup yourself absolute path relative dir',
};

export const method = {
  slug:      'mkdtemp',
  name:      'tempfile.mkdtemp',
  signature: 'tempfile.mkdtemp(suffix=None, prefix=None, dir=None)',
  returns:   { type: 'str | bytes', desc: 'The absolute path of the new directory.' },

  category:    'tempfile function',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'Same naming as mkstemp (prefix + 8 random characters + suffix), created with os.mkdir(path, 0o700) so only you can list or enter it. Since 3.12 the result is always absolute, even for a relative dir. Unlike TemporaryDirectory, nothing ever removes it automatically.',

  covers: ['mkdtemp'],

  cheat: {
    commonCall: "path = tempfile.mkdtemp(prefix='build-')",
    returns:    'absolute path of a new, empty, private folder',
    replaces:   'os.mkdir with a hand-made unique name',
    watchOut:   'remember shutil.rmtree(path) when done',
  },

  parameters: [
    { name: 'suffix', type: 'str | bytes | None', required: false, default: 'None', desc: 'End of the folder name.' },
    { name: 'prefix', type: 'str | bytes | None', required: false, default: 'None', desc: "Start of the folder name ('tmp' when None)." },
    { name: 'dir',    type: 'str | bytes | PathLike | None', required: false, default: 'None', desc: 'Parent directory; None means gettempdir().' },
  ],

  patterns: [
    {
      name: 'Folder that outlives a function',
      desc: 'Return the path; the caller removes it.',
      code: "import shutil, tempfile\nworkdir = tempfile.mkdtemp(prefix='session-')\ntry:\n    run_session(workdir)\nfinally:\n    shutil.rmtree(workdir, ignore_errors=True)",
    },
  ],

  examples: [
    { title: 'A new empty folder',              code: "import os, shutil, tempfile\npath = tempfile.mkdtemp(dir='.')\nresult = (os.path.isdir(path), os.listdir(path))\nshutil.rmtree(path)\nresult", returns: '(True, [])' },
    { title: 'Absolute even for dir="." (3.12+)', code: "import os, shutil, tempfile\npath = tempfile.mkdtemp(dir='.')\nabsolute = os.path.isabs(path)\nshutil.rmtree(path)\nabsolute", returns: 'True' },
    { title: 'Prefix and suffix',               code: "import os, shutil, tempfile\npath = tempfile.mkdtemp(prefix='build-', suffix='.d', dir='.')\nname = os.path.basename(path)\nshutil.rmtree(path)\n(name.startswith('build-'), name.endswith('.d'), len(name))", returns: '(True, True, 16)' },
    { title: 'It stays until you remove it',    code: "import os, shutil, tempfile\npath = tempfile.mkdtemp(dir='.')\nstill_there = os.path.isdir(path)\nshutil.rmtree(path)\nstill_there", returns: 'True' },
    { title: 'str and bytes do not mix',        code: "import tempfile\ntempfile.mkdtemp(prefix=b'a', dir='.')", returns: "TypeError: Can't mix bytes and non-bytes in path components." },
  ],

  pitfalls: [
    {
      name: 'Removing it with os.rmdir',
      desc: 'os.rmdir only removes empty folders. Use shutil.rmtree for a folder with contents.',
      wrong: { label: 'os.rmdir',      code: "import os, tempfile\npath = tempfile.mkdtemp(dir='.')\nopen(os.path.join(path, 'f.txt'), 'w').close()\ntry:\n    os.rmdir(path)\n    removed = True\nexcept OSError:\n    removed = False\nremoved", output: 'False' },
      fix:   { label: 'shutil.rmtree', code: "import os, shutil, tempfile\npath = tempfile.mkdtemp(dir='.')\nopen(os.path.join(path, 'f.txt'), 'w').close()\nshutil.rmtree(path)\nos.path.exists(path)", output: 'False' },
    },
  ],

  when: {
    use: [
      'A temporary folder whose lifetime does not fit a with block',
      'Python older than 3.12 when you want to keep the folder (TemporaryDirectory has no delete= there)',
    ],
    avoid: [
      'Scoped use → TemporaryDirectory cleans up automatically',
    ],
  },

  notes: {
    cpython:   'Lib/tempfile.py: up to TMP_MAX names with os.mkdir(name, 0o700); returns os.path.abspath(name)',
    'Changed': '3.5: bytes arguments; 3.6: dir accepts a path-like object; 3.12: always returns an absolute path (docs)',
  },

  related: [
    { name: 'TemporaryDirectory', slug: 'temporarydirectory', when: 'The self-cleaning version' },
    { name: 'mkstemp',            slug: 'mkstemp',            when: 'The same for files' },
    { name: 'shutil.rmtree',      slug: 'rmtree',             when: 'Removing the folder afterwards', category: 'stdlib/shutil' },
    { name: 'gettempdir',         slug: 'gettempdir',         when: 'The default parent folder' },
  ],

  faq: [
    {
      q: 'Does mkdtemp delete the directory automatically?',
      a: 'No — the caller is responsible. Call shutil.rmtree(path) when done, or use tempfile.TemporaryDirectory, which removes the folder at the end of its with block.',
    },
    {
      q: 'What permissions does a mkdtemp directory have?',
      a: 'It is created with mode 0o700: readable, writable and searchable only by the creating user (on systems with Unix permissions).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.mkdtemp',
    meta:  'tempfile.mkdtemp',
  },

};
