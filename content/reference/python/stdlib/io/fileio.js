// content/reference/python/stdlib/io/fileio.js — io.FileIO

export const meta = {
  slug:        'fileio',
  name:        'io.FileIO',
  signature:   "io.FileIO(name, mode='r', closefd=True, opener=None)",
  blurb:       'The raw binary stream for an OS file: one system call per read or write, no buffering. open() builds one for every file; buffering=0 gives it to you directly.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'fileio io.FileIO python raw file unbuffered file descriptor closefd opener mode name os level file buffering=0 invalid mode cannot use closefd=False with file name',
};

export const method = {
  slug:      'fileio',
  name:      'io.FileIO',
  signature: "io.FileIO(name, mode='r', closefd=True, opener=None)",
  returns:   { type: 'FileIO', desc: 'A RawIOBase stream over the file or file descriptor.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: "FileIO wraps a file descriptor. It takes a path or an existing descriptor, modes r, w, x, a (always binary, '+' for both directions), and does exactly one OS call per read(n), readinto() or write(). Its mode attribute is normalised ('w' shows as 'wb') and the file it creates is non-inheritable.",

  covers: ['FileIO'],

  cheat: {
    commonCall: "io.FileIO('data.bin', 'r')",
    returns:    'an unbuffered binary stream',
    replaces:   'os.open + os.read / os.write with manual closing',
    watchOut:   "binary only — a 't' in the mode raises ValueError",
  },

  parameters: [
    { name: 'name',    type: 'str | bytes | PathLike | int', required: true,  default: null,   desc: 'A path to open, or an open file descriptor to wrap.' },
    { name: 'mode',    type: 'str',      required: false, default: "'r'",  desc: "'r', 'w', 'x' or 'a', optionally with '+' and 'b'. 'w' truncates, 'x' fails if the file exists (FileExistsError)." },
    { name: 'closefd', type: 'bool',     required: false, default: 'True', desc: 'With a descriptor: False leaves it open when the FileIO closes. Must be True for a path.' },
    { name: 'opener',  type: 'callable', required: false, default: 'None', desc: 'opener(name, flags) returns the descriptor to use (3.3+).' },
  ],

  attributes: [
    { name: 'mode', type: 'str',        meaning: "Normalised mode: 'rb', 'rb+', 'wb', 'ab', 'ab+', 'xb' or 'xb+'." },
    { name: 'name', type: 'str | int',  meaning: 'The path as given, or the descriptor when one was passed.' },
    { name: 'closefd', type: 'bool',    meaning: 'Whether close() also closes the descriptor.' },
  ],

  patterns: [
    {
      name: 'Wrap a descriptor from os.open',
      desc: 'FileIO owns the descriptor and closes it.',
      code: "import io, os\nfd = os.open('data.bin', os.O_RDONLY)\nwith io.FileIO(fd) as f:\n    header = f.read(8)",
    },
    {
      name: 'Custom open flags',
      desc: 'opener receives the path and the flags open() computed.',
      code: "import io, os\ndef private(path, flags):\n    return os.open(path, flags, 0o600)\nwith io.FileIO('secret.bin', 'w', opener=private) as f:\n    f.write(token)",
    },
  ],

  examples: [
    { title: 'Write and read bytes',       code: "import io\nwith io.FileIO('a.bin', 'w') as f:\n    n = f.write(b'hello')\nwith io.FileIO('a.bin') as f:\n    data = f.read()\n(n, data)", returns: "(5, b'hello')" },
    { title: 'mode is normalised',         code: "import io\nwith io.FileIO('a.bin', 'w') as f:\n    mode = f.mode\nmode", returns: "'wb'" },
    { title: 'name is the path you gave',  code: "import io\nwith io.FileIO('a.bin', 'w') as f:\n    name = f.name\nname", returns: "'a.bin'" },
    { title: 'A descriptor you keep',      code: "import io, os\nopen('a.bin', 'wb').close()\nfd = os.open('a.bin', os.O_RDONLY)\nf = io.FileIO(fd, closefd=False)\nf.close()\nos.read(fd, 0)\nos.close(fd)\nf.closed", returns: 'True' },
    { title: 'No text mode',               code: "import io\nio.FileIO('a.bin', 'wt')", returns: 'ValueError: invalid mode: wt' },
    { title: "'x' refuses existing files", code: "import io\nopen('a.bin', 'wb').close()\nio.FileIO('a.bin', 'x')", returns: "FileExistsError: [Errno 17] File exists: 'a.bin'" },
    { title: 'closefd=False needs a descriptor', code: "import io\nopen('a.bin', 'wb').close()\nio.FileIO('a.bin', closefd=False)", returns: 'ValueError: Cannot use closefd=False with file name' },
  ],

  pitfalls: [
    {
      name: 'Using FileIO for many small reads',
      desc: 'Every read is a system call. For anything but large reads, use a buffered stream — open() without buffering=0 — which reads ahead.',
      wrong: { label: 'raw FileIO',     code: "import io\nwith open('a.bin', 'wb') as f:\n    f.write(b'x' * 10)\nwith io.FileIO('a.bin') as f:\n    chunks = [f.read(1) for _ in range(3)]\ntype(f).__name__", output: "'FileIO'" },
      fix:   { label: 'BufferedReader', code: "with open('a.bin', 'wb') as f:\n    f.write(b'x' * 10)\nwith open('a.bin', 'rb') as f:\n    chunks = [f.read(1) for _ in range(3)]\ntype(f).__name__", output: "'BufferedReader'" },
    },
  ],

  when: {
    use: [
      'Large binary reads and writes where you manage the chunk size yourself',
      'Wrapping a file descriptor you got from os.open, os.pipe or a C library',
    ],
    avoid: [
      'Normal file access → open(), which adds buffering (and text decoding)',
      'Text → open() in text mode, or TextIOWrapper over a buffered stream',
    ],
  },

  notes: {
    cpython:          'Modules/_io/fileio.c. The mode string is parsed letter by letter: an unknown letter gives "invalid mode: …" (without quotes, unlike open()), a missing r/w/a/x or a second one gives "Must have exactly one of create/read/write/append mode and at most one plus"',
    'Non-inheritable': 'The new descriptor is not inherited by child processes (docs, 3.4+)',
    'Short reads':    'read(n) makes a single read() system call and can return fewer than n bytes before end of file',
  },

  related: [
    { name: 'RawIOBase',      slug: 'rawiobase',      when: 'The interface FileIO implements' },
    { name: 'io.open',        slug: 'open',           when: 'Builds a FileIO and wraps it' },
    { name: 'BufferedReader', slug: 'bufferedreader', when: 'Buffering on top of FileIO' },
    { name: 'os.open',        slug: 'open',           when: 'Raw file descriptors', category: 'stdlib/os' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: "What mode 'x' raises", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between FileIO and open()?',
      a: 'open() creates a FileIO and wraps it in a BufferedReader / BufferedWriter / BufferedRandom, and for text in a TextIOWrapper. FileIO alone is unbuffered and binary-only. open(path, "rb", buffering=0) returns the FileIO directly.',
    },
    {
      q: 'How do I wrap a file descriptor in a Python file object?',
      a: 'io.FileIO(fd, mode) for raw access, or open(fd, mode) / os.fdopen(fd, mode) for a buffered (or text) file. Pass closefd=False if something else will close the descriptor.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.FileIO',
    meta:  'io.FileIO',
  },

};
