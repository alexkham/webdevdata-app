// content/reference/python/stdlib/tempfile/temporaryfile.js

export const meta = {
  slug:        'temporaryfile',
  name:        'tempfile.TemporaryFile',
  signature:   "tempfile.TemporaryFile(mode='w+b', buffering=-1, encoding=None, newline=None, suffix=None, prefix=None, dir=None, *, errors=None)",
  blurb:       'An anonymous temporary file, open for reading and writing, that is deleted as soon as it is closed. On Linux it usually has no name at all.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'temporaryfile tempfile.TemporaryFile python temporary file anonymous file deleted on close w+b O_TMPFILE scratch file no name',
};

export const method = {
  slug:      'temporaryfile',
  name:      'tempfile.TemporaryFile',
  signature: "tempfile.TemporaryFile(mode='w+b', buffering=-1, encoding=None, newline=None, suffix=None, prefix=None, dir=None, *, errors=None)",
  returns:   { type: 'file object', desc: 'On POSIX a true file object (BufferedRandom for the default mode); on Windows the wrapper NamedTemporaryFile returns.' },

  category:    'tempfile function',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: "Use it when you need file semantics — real seek(), real fileno(), more data than memory — but no other program needs to find the file. The default mode 'w+b' reads and writes bytes. On Linux the O_TMPFILE flag (where available) or an immediate unlink means the file never shows up in a directory listing; on Windows TemporaryFile is simply NamedTemporaryFile.",

  covers: ['TemporaryFile'],

  cheat: {
    commonCall: 'with tempfile.TemporaryFile() as f:',
    returns:    'a w+b file, deleted on close',
    replaces:   'creating, opening and deleting a scratch file by hand',
    watchOut:   'f.name is not a usable path (an int fd on Linux)',
  },

  parameters: [
    { name: 'mode',     type: 'str',        required: false, default: "'w+b'", desc: "Passed to open(); use 'w+' for text (with encoding=)." },
    { name: 'buffering / encoding / newline / errors', type: 'as open()', required: false, default: 'as open()', desc: 'Passed to open(); encoding only for text modes.' },
    { name: 'suffix / prefix', type: 'str | bytes | None', required: false, default: 'None', desc: 'Used for the name while it exists (see mkstemp).' },
    { name: 'dir',      type: 'str | bytes | PathLike | None', required: false, default: 'None', desc: 'Directory for the file; None means gettempdir().' },
  ],

  patterns: [
    {
      name: 'Spill a large download to disk',
      desc: 'Stream into the file, then read it back from the start.',
      code: "import tempfile\nwith tempfile.TemporaryFile() as buf:\n    for chunk in response.iter_content(65536):\n        buf.write(chunk)\n    buf.seek(0)\n    process(buf)",
    },
    {
      name: 'Text scratch file',
      desc: 'Pass a text mode and an encoding.',
      code: "import tempfile\nwith tempfile.TemporaryFile('w+', encoding='utf-8') as f:\n    f.write(report)\n    f.seek(0)\n    lines = f.readlines()",
    },
  ],

  examples: [
    { title: 'Write, rewind, read',       code: "import tempfile\nwith tempfile.TemporaryFile(dir='.') as f:\n    f.write(b'Hello world!')\n    f.seek(0)\n    data = f.read()\ndata", returns: "b'Hello world!'" },
    { title: "Mode 'w+b' reports as 'rb+'", code: "import tempfile\nwith tempfile.TemporaryFile(dir='.') as f:\n    mode = f.mode\nmode", returns: "'rb+'" },
    { title: 'Closed when the block ends', code: "import tempfile\nwith tempfile.TemporaryFile(dir='.') as f:\n    pass\nf.closed", returns: 'True' },
    { title: 'Nothing left in the folder', code: "import os, tempfile\nwith tempfile.TemporaryFile(dir='.') as f:\n    f.write(b'x')\nos.listdir('.')", returns: '[]' },
    { title: 'Text mode with an encoding', code: "import tempfile\nwith tempfile.TemporaryFile('w+', encoding='utf-8', dir='.') as f:\n    f.write('naïve\\n')\n    f.seek(0)\n    text = f.read()\ntext", returns: "'naïve\\n'" },
  ],

  pitfalls: [
    {
      name: 'Writing str to the default binary mode',
      desc: "The default mode is 'w+b'. Encode, or open in text mode with an encoding.",
      wrong: { label: "default 'w+b'",  code: "import tempfile\nwith tempfile.TemporaryFile(dir='.') as f:\n    f.write('text')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "'w+' + encoding", code: "import tempfile\nwith tempfile.TemporaryFile('w+', encoding='utf-8', dir='.') as f:\n    n = f.write('text')\nn", output: '4' },
    },
  ],

  when: {
    use: [
      'Scratch space for data that may be large, used only by this process',
      'APIs that need a real file object (fileno(), mmap) but no path',
    ],
    avoid: [
      'Another program must open the file → NamedTemporaryFile',
      'Small data → io.BytesIO; maybe-small data → SpooledTemporaryFile',
    ],
  },

  notes: {
    cpython:     'Lib/tempfile.py. POSIX: os.open(dir, O_TMPFILE | …) when it works (Linux 3.11+), else _mkstemp_inner followed by os.unlink. Elsewhere (Windows, Cygwin): TemporaryFile = NamedTemporaryFile',
    'name':      'On Linux f.name is the file descriptor (an int); on Windows a full path string',
    'Changed':   '3.5: uses O_TMPFILE when available; 3.8: errors parameter (docs)',
  },

  related: [
    { name: 'NamedTemporaryFile',   slug: 'namedtemporaryfile',   when: 'When the file needs a visible name' },
    { name: 'SpooledTemporaryFile', slug: 'spooledtemporaryfile', when: 'Stay in memory while small' },
    { name: 'mkstemp',              slug: 'mkstemp',              when: 'Low-level: file descriptor and path' },
    { name: 'io.BytesIO',           slug: 'bytesio',              when: 'No file at all', category: 'stdlib/io' },
    { name: 'with',                 slug: 'with',                 when: 'Closes (and so deletes) the file', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What is the difference between TemporaryFile and NamedTemporaryFile?',
      a: 'NamedTemporaryFile guarantees a visible name (f.name is a path you can pass to other programs). TemporaryFile makes no such promise — on Linux the file has no directory entry at all. On Windows they are the same function.',
    },
    {
      q: 'When is a TemporaryFile deleted?',
      a: 'When it is closed — at the end of its with block, by f.close(), or when the object is garbage collected. On Linux the OS also reclaims it if the process dies, because it has no name.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.TemporaryFile',
    meta:  'tempfile.TemporaryFile',
  },

};
