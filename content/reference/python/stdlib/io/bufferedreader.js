// content/reference/python/stdlib/io/bufferedreader.js — io.BufferedReader

export const meta = {
  slug:        'bufferedreader',
  name:        'io.BufferedReader',
  signature:   'io.BufferedReader(raw, buffer_size=DEFAULT_BUFFER_SIZE)',
  blurb:       "The buffered binary reader that open(path, 'rb') returns: reads ahead from a raw stream, and adds peek() to look at the next bytes without consuming them.",
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'bufferedreader io.BufferedReader python rb file peek read1 buffer_size raw read ahead binary reader file or stream is not readable look ahead bytes without consuming',
};

export const method = {
  slug:      'bufferedreader',
  name:      'io.BufferedReader',
  signature: 'io.BufferedReader(raw, buffer_size=DEFAULT_BUFFER_SIZE)',
  returns:   { type: 'BufferedReader', desc: 'A readable BufferedIOBase over raw.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'A BufferedReader asks the raw stream for a buffer-sized chunk and serves small reads from memory. peek() returns buffered bytes without moving the position — possibly more or fewer than requested — and read1() returns what is buffered, or does one raw read when the buffer is empty.',

  covers: ['BufferedReader'],

  cheat: {
    commonCall: "with open('data.bin', 'rb') as f:  # a BufferedReader",
    returns:    'read(n), read1(n), peek(n), readline(), iteration',
    replaces:   'many small raw reads (system calls)',
    watchOut:   'peek(n) can return more or fewer than n bytes',
  },

  parameters: [
    { name: 'raw',         type: 'RawIOBase', required: true,  default: null, desc: 'A readable raw stream (it must implement readinto()); FileIO for files.' },
    { name: 'buffer_size', type: 'int',       required: false, default: 'DEFAULT_BUFFER_SIZE', desc: 'Size of the read-ahead buffer; must be positive.' },
  ],

  attributes: [
    { name: 'peek(size=0)',   type: 'method',    meaning: 'Bytes from the current position without advancing; at most one raw read.' },
    { name: 'read(size=-1)',  type: 'method',    meaning: 'Exactly size bytes unless the end comes first; -1 reads to the end.' },
    { name: 'read1(size=-1)', type: 'method',    meaning: 'Buffered bytes only, or one raw read if the buffer is empty.' },
    { name: 'raw',            type: 'attribute', meaning: 'The wrapped raw stream.' },
  ],

  patterns: [
    {
      name: 'Sniff a file format',
      desc: 'peek() shows the magic bytes without consuming them.',
      code: "with open(path, 'rb') as f:\n    if f.peek(4)[:4] == b'%PDF':\n        handle_pdf(f)",
    },
    {
      name: 'Buffer a custom raw stream',
      desc: 'Any RawIOBase with readinto() can be wrapped.',
      code: "import io\nstream = io.BufferedReader(MyRawSource(), buffer_size=64 * 1024)\nfor line in stream:\n    process(line)",
    },
  ],

  examples: [
    { title: "open(..., 'rb') returns one",  code: "open('a.bin', 'wb').close()\nwith open('a.bin', 'rb') as f:\n    name = type(f).__name__\nname", returns: "'BufferedReader'" },
    { title: 'peek returns what is buffered', code: "import io\nr = io.BufferedReader(io.BytesIO(b'abcdef'))\n(r.peek(1), r.read(3))", returns: "(b'abcdef', b'abc')" },
    { title: 'read1 serves the buffer first', code: "import io\nr = io.BufferedReader(io.BytesIO(b'abcdef'), buffer_size=4)\n(r.read(1), r.read1(10), r.read1(10))", returns: "(b'a', b'bcd', b'ef')" },
    { title: 'The raw stream',               code: "import io\ntype(io.BufferedReader(io.BytesIO()).raw).__name__", returns: "'BytesIO'" },
    { title: 'Read-only',                    code: "import io\nio.BufferedReader(io.BytesIO(b'x')).write(b'y')", returns: 'io.UnsupportedOperation: write' },
    { title: 'The raw stream must be readable', code: "import io\nopen('a.bin', 'wb').close()\nio.BufferedReader(open('a.bin', 'wb', buffering=0))", returns: 'io.UnsupportedOperation: File or stream is not readable.' },
    { title: 'buffer_size must be positive', code: "import io\nio.BufferedReader(io.BytesIO(), buffer_size=0)", returns: 'ValueError: buffer size must be strictly positive' },
  ],

  pitfalls: [
    {
      name: 'Expecting peek(n) to return n bytes',
      desc: 'peek() returns whatever is in the buffer (after at most one raw read). Slice the result.',
      wrong: { label: 'peek(2)',      code: "import io\nr = io.BufferedReader(io.BytesIO(b'GIF89a'))\nr.peek(2) == b'GI'", output: 'False' },
      fix:   { label: 'peek(2)[:2]',  code: "import io\nr = io.BufferedReader(io.BytesIO(b'GIF89a'))\nr.peek(2)[:2] == b'GI'", output: 'True' },
    },
  ],

  when: {
    use: [
      'Reading binary files (open returns it for "rb")',
      'Adding buffering and peek() to a custom raw stream',
    ],
    avoid: [
      'Read-write access → BufferedRandom (open with "r+b")',
      'In-memory bytes → BytesIO (already buffered, no raw stream)',
    ],
  },

  notes: {
    cpython:     'Modules/_io/bufferedio.c. Despite its role, BufferedReader is not a subclass of the Python-level io.BufferedIOBase by inheritance — io.py registers it with that ABC',
    'read1':     'If at least one byte is buffered, read1 returns only buffered bytes; otherwise it makes one raw read of up to size bytes (docs)',
    'Threads':   'Protected by an internal lock; re-entering it from a signal handler raises RuntimeError (docs, "Reentrancy")',
  },

  related: [
    { name: 'BufferedWriter',  slug: 'bufferedwriter',  when: 'The writing counterpart' },
    { name: 'BufferedRandom / BufferedRWPair', slug: 'bufferedrandom-bufferedrwpair', when: 'Read and write' },
    { name: 'RawIOBase',       slug: 'rawiobase',       when: 'What it wraps' },
    { name: 'DEFAULT_BUFFER_SIZE', slug: 'default_buffer_size', when: 'The default buffer_size' },
    { name: 'io.open',         slug: 'open',            when: "Returns it for 'rb'" },
  ],

  faq: [
    {
      q: 'What is an _io.BufferedReader?',
      a: "The object open(path, 'rb') returns: a buffered binary reader over a FileIO. The _io prefix is the C module it lives in; it is the same class as io.BufferedReader.",
    },
    {
      q: 'How do I read bytes without consuming them?',
      a: 'f.peek(n) on a BufferedReader (or BufferedRandom) returns upcoming bytes without moving the position. It may return more or fewer than n, so slice: f.peek(n)[:n].',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.BufferedReader',
    meta:  'io.BufferedReader',
  },

};
