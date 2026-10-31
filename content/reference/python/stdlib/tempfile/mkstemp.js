// content/reference/python/stdlib/tempfile/mkstemp.js

export const meta = {
  slug:        'mkstemp',
  name:        'tempfile.mkstemp',
  signature:   'tempfile.mkstemp(suffix=None, prefix=None, dir=None, text=False)',
  blurb:       'Create a temporary file securely and return (fd, path): an open OS-level file descriptor and the absolute path. Nothing is deleted for you.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'mkstemp tempfile.mkstemp python secure temporary file file descriptor fd path os.fdopen atomic write os.replace O_EXCL cleanup yourself bytes path',
};

export const method = {
  slug:      'mkstemp',
  name:      'tempfile.mkstemp',
  signature: 'tempfile.mkstemp(suffix=None, prefix=None, dir=None, text=False)',
  returns:   { type: 'tuple[int, str | bytes]', desc: '(file descriptor as from os.open, absolute path).' },

  category:    'tempfile function',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'The low-level building block of the module: it tries names (prefix + 8 random characters + suffix) with os.open(O_CREAT | O_EXCL, 0o600) until one is free, so no other process can sneak in. You get a raw descriptor — wrap it with os.fdopen() or close it with os.close() — and you remove the file yourself.',

  covers: ['mkstemp'],

  cheat: {
    commonCall: "fd, path = tempfile.mkstemp(suffix='.tmp')",
    returns:    '(int fd, absolute path)',
    replaces:   'mktemp() followed by open() — that pair is racy',
    watchOut:   'close the fd and delete the file yourself',
  },

  parameters: [
    { name: 'suffix', type: 'str | bytes | None', required: false, default: 'None', desc: "Appended to the name as is ('' when None) — include the dot." },
    { name: 'prefix', type: 'str | bytes | None', required: false, default: 'None', desc: "Start of the name; None means gettempprefix() ('tmp')." },
    { name: 'dir',    type: 'str | bytes | PathLike | None', required: false, default: 'None', desc: 'Directory to create the file in; None means gettempdir().' },
    { name: 'text',   type: 'bool', required: false, default: 'False', desc: 'Open in text mode — only matters on Windows (no O_BINARY flag); the descriptor is raw either way.' },
  ],

  patterns: [
    {
      name: 'Atomic replace of a file',
      desc: 'Create the temporary file next to the target so os.replace stays on one file system.',
      code: "import os, tempfile\ndirectory = os.path.dirname(os.path.abspath(target))\nfd, tmp = tempfile.mkstemp(dir=directory, prefix='.tmp-')\ntry:\n    with os.fdopen(fd, 'w', encoding='utf-8') as f:\n        f.write(new_contents)\n    os.replace(tmp, target)\nexcept BaseException:\n    os.remove(tmp)\n    raise",
    },
    {
      name: 'Get a path for an external tool',
      desc: 'Close the descriptor right away if only the path is needed.',
      code: "import os, tempfile\nfd, path = tempfile.mkstemp(suffix='.png')\nos.close(fd)\ntry:\n    render_chart(path)\nfinally:\n    os.remove(path)",
    },
  ],

  examples: [
    { title: '(fd, path)',                  code: "import os, tempfile\nfd, path = tempfile.mkstemp(dir='.')\nresult = (type(fd).__name__, os.path.isabs(path))\nos.close(fd)\nos.remove(path)\nresult", returns: "('int', True)" },
    { title: 'Prefix and suffix as given',  code: "import os, tempfile\nfd, path = tempfile.mkstemp(prefix='job_', suffix='.log', dir='.')\nos.close(fd)\nname = os.path.basename(path)\nos.remove(path)\n(name[:4], name[-4:], len(name))", returns: "('job_', '.log', 16)" },
    { title: 'Wrap the fd with os.fdopen',  code: "import os, tempfile\nfd, path = tempfile.mkstemp(dir='.')\nwith os.fdopen(fd, 'wb') as f:\n    f.write(b'payload')\nsize = os.path.getsize(path)\nos.remove(path)\nsize", returns: '7' },
    { title: 'bytes in, bytes out',         code: "import os, tempfile\nfd, path = tempfile.mkstemp(suffix=b'', dir=b'.')\nos.close(fd)\nos.remove(path)\ntype(path).__name__", returns: "'bytes'" },
    { title: 'Not both str and bytes',      code: "import tempfile\ntempfile.mkstemp(prefix='a', suffix=b'b', dir='.')", returns: "TypeError: Can't mix bytes and non-bytes in path components." },
  ],

  pitfalls: [
    {
      name: 'Writing str to the descriptor',
      desc: 'The fd is a raw OS handle: os.write takes bytes. Wrap it with os.fdopen in text mode to write str (the file object then owns and closes the fd).',
      wrong: { label: 'os.write(fd, str)', code: "import os, tempfile\nfd, path = tempfile.mkstemp(dir='.')\ntry:\n    os.write(fd, 'text')\nfinally:\n    os.close(fd)\n    os.remove(path)", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'os.fdopen',         code: "import os, tempfile\nfd, path = tempfile.mkstemp(dir='.')\nwith os.fdopen(fd, 'w', encoding='utf-8') as f:\n    f.write('text')\nsize = os.path.getsize(path)\nos.remove(path)\nsize", output: '4' },
    },
  ],

  when: {
    use: [
      'Atomic writes (temporary file + os.replace)',
      'You need the raw descriptor, or full control over when the file is deleted',
    ],
    avoid: [
      'Automatic cleanup → NamedTemporaryFile / TemporaryFile',
      'A folder → mkdtemp / TemporaryDirectory',
    ],
  },

  notes: {
    cpython:      'Lib/tempfile.py _mkstemp_inner: up to TMP_MAX names; os.open(path, O_RDWR | O_CREAT | O_EXCL (| O_NOFOLLOW | O_BINARY where available), 0o600). On Windows a PermissionError caused by an existing directory of that name is treated like a collision and retried',
    'Return type': 'str unless any of suffix, prefix, dir is bytes (all given ones must be the same type); a bytes tempfile.tempdir also switches the default to bytes (docs note)',
    'Changed':    '3.5: bytes arguments and None defaults; 3.6: dir accepts a path-like object (docs)',
  },

  related: [
    { name: 'mkdtemp',            slug: 'mkdtemp',            when: 'The same for directories' },
    { name: 'NamedTemporaryFile', slug: 'namedtemporaryfile', when: 'The same name rules, with cleanup' },
    { name: 'mktemp',             slug: 'mktemp',             when: 'The unsafe name-only version' },
    { name: 'TMP_MAX',            slug: 'tmp_max',            when: 'How many names it tries' },
    { name: 'os.open / os.fdopen', slug: 'open',              when: 'Working with the descriptor', category: 'stdlib/os' },
    { name: 'os.replace',         slug: 'remove',             when: 'Atomic rename over the target', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'What does tempfile.mkstemp return?',
      a: 'A tuple (fd, path): fd is an int file descriptor (as from os.open) already open for reading and writing, path the absolute file name. Use os.fdopen(fd, mode) for a file object, or os.close(fd) if you only need the path.',
    },
    {
      q: 'Does mkstemp delete the file automatically?',
      a: 'No. The caller must close the descriptor and remove the file (os.remove(path)). Use NamedTemporaryFile or TemporaryFile for automatic cleanup.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.mkstemp',
    meta:  'tempfile.mkstemp',
  },

};
