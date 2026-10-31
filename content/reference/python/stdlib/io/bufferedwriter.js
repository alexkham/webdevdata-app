// content/reference/python/stdlib/io/bufferedwriter.js — io.BufferedWriter

export const meta = {
  slug:        'bufferedwriter',
  name:        'io.BufferedWriter',
  signature:   'io.BufferedWriter(raw, buffer_size=DEFAULT_BUFFER_SIZE)',
  blurb:       "The buffered binary writer that open(path, 'wb') returns: collects writes in memory and passes them to the raw stream when the buffer fills, on flush() and on close().",
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'bufferedwriter io.BufferedWriter python wb file flush buffer_size raw write buffering data not written until flush close binary writer file or stream is not writable',
};

export const method = {
  slug:      'bufferedwriter',
  name:      'io.BufferedWriter',
  signature: 'io.BufferedWriter(raw, buffer_size=DEFAULT_BUFFER_SIZE)',
  returns:   { type: 'BufferedWriter', desc: 'A writable BufferedIOBase over raw.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'write() returns at once with len(data); the bytes may still be sitting in the buffer. They reach the raw stream when the buffer would overflow, on flush(), on close() (also at the end of a with block) and when the writer is destroyed. A single write larger than the buffer goes straight through.',

  covers: ['BufferedWriter'],

  cheat: {
    commonCall: "with open('out.bin', 'wb') as f:  # a BufferedWriter",
    returns:    'write() → len(data); data lands on flush/close',
    replaces:   'one system call per small write',
    watchOut:   'other readers do not see the data until flush() or close()',
  },

  parameters: [
    { name: 'raw',         type: 'RawIOBase', required: true,  default: null, desc: 'A writable raw stream; FileIO for files.' },
    { name: 'buffer_size', type: 'int',       required: false, default: 'DEFAULT_BUFFER_SIZE', desc: 'How many bytes to collect before writing; must be positive.' },
  ],

  attributes: [
    { name: 'write(b)', type: 'method',    meaning: 'Buffers b and returns len(b).' },
    { name: 'flush()',  type: 'method',    meaning: 'Writes everything buffered to the raw stream.' },
    { name: 'raw',      type: 'attribute', meaning: 'The wrapped raw stream.' },
  ],

  patterns: [
    {
      name: 'Make data visible to another process',
      desc: 'flush() pushes the buffer to the OS; os.fsync() then asks the OS to write it to disk.',
      code: "import os\nwith open('state.bin', 'wb') as f:\n    f.write(payload)\n    f.flush()\n    os.fsync(f.fileno())",
    },
    {
      name: 'A larger buffer for many small writes',
      desc: 'buffering= on open() sets the BufferedWriter buffer size.',
      code: "with open('big.bin', 'wb', buffering=1024 * 1024) as f:\n    for record in records:\n        f.write(record)",
    },
  ],

  examples: [
    { title: "open(..., 'wb') returns one", code: "with open('a.bin', 'wb') as f:\n    name = type(f).__name__\nname", returns: "'BufferedWriter'" },
    { title: 'Nothing reaches raw before flush()', code: "import io\nraw = io.BytesIO()\nw = io.BufferedWriter(raw)\nw.write(b'hello')\nbefore = raw.getvalue()\nw.flush()\n(before, raw.getvalue())", returns: "(b'', b'hello')" },
    { title: 'Small writes wait for a full buffer', code: "import io\nraw = io.BytesIO()\nw = io.BufferedWriter(raw, buffer_size=4)\nw.write(b'ab')\nw.write(b'cd')\nfirst = raw.getvalue()\nw.write(b'e')\n(first, raw.getvalue())", returns: "(b'', b'abcd')" },
    { title: 'A big write goes straight through',  code: "import io\nraw = io.BytesIO()\nw = io.BufferedWriter(raw, buffer_size=4)\nw.write(b'abcdef')\nraw.getvalue()", returns: "b'abcdef'" },
    { title: 'Write-only',                  code: 'import io\nio.BufferedWriter(io.BytesIO()).read()', returns: 'io.UnsupportedOperation: read' },
    { title: 'The raw stream must be writable', code: "import io\nopen('a.bin', 'wb').close()\nio.BufferedWriter(open('a.bin', 'rb', buffering=0))", returns: 'io.UnsupportedOperation: File or stream is not writable.' },
  ],

  pitfalls: [
    {
      name: 'Reading the file before the writer is flushed',
      desc: 'Until flush() or close(), the bytes are in the buffer, not in the file.',
      wrong: { label: 'no flush', code: "f = open('a.bin', 'wb')\nf.write(b'data')\nwith open('a.bin', 'rb') as r:\n    seen = r.read()\nf.close()\nseen", output: "b''" },
      fix:   { label: 'flush()',  code: "f = open('a.bin', 'wb')\nf.write(b'data')\nf.flush()\nwith open('a.bin', 'rb') as r:\n    seen = r.read()\nf.close()\nseen", output: "b'data'" },
    },
  ],

  when: {
    use: [
      'Writing binary files (open returns it for "wb", "ab" and "xb")',
      'Buffering writes to a custom raw stream',
    ],
    avoid: [
      'Reading and writing the same file → BufferedRandom ("r+b")',
      'Data that must survive a crash immediately → flush() and os.fsync(), or unbuffered FileIO',
    ],
  },

  notes: {
    cpython:   'Modules/_io/bufferedio.c. close() flushes before closing the raw stream; if the flush fails, the exception is raised and the raw stream is still closed',
    'Flushing': 'The docs list when the buffer is written: when it gets too small for the pending data, on flush(), on seek() (BufferedRandom), and when the object is closed or destroyed',
  },

  related: [
    { name: 'BufferedReader', slug: 'bufferedreader', when: 'The reading counterpart' },
    { name: 'BufferedRandom / BufferedRWPair', slug: 'bufferedrandom-bufferedrwpair', when: 'Read and write' },
    { name: 'FileIO',         slug: 'fileio',         when: 'The raw stream it usually wraps' },
    { name: 'DEFAULT_BUFFER_SIZE', slug: 'default_buffer_size', when: 'The default buffer_size' },
    { name: 'os.fsync',       slug: 'fsync',          when: 'Force the data to disk after flush()', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why is my file empty until the program ends?',
      a: 'Writes are buffered. The data reaches the file when the buffer fills, when you call flush(), or when the file is closed. Use a with block or call f.flush() at the points where others must see the data.',
    },
    {
      q: 'Does flush() write to disk?',
      a: 'It hands the buffered bytes to the operating system (the raw write call). The OS may still cache them; os.fsync(f.fileno()) asks it to write them to the device.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.BufferedWriter',
    meta:  'io.BufferedWriter',
  },

};
