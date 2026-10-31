// content/reference/python/stdlib/io/bufferedrandom-bufferedrwpair.js

export const meta = {
  slug:        'bufferedrandom-bufferedrwpair',
  name:        'io.BufferedRandom / io.BufferedRWPair',
  signature:   'io.BufferedRandom(raw, buffer_size=DEFAULT_BUFFER_SIZE)  ·  io.BufferedRWPair(reader, writer, buffer_size=DEFAULT_BUFFER_SIZE, /)',
  blurb:       "Two read-write buffered streams: BufferedRandom over one seekable raw stream (what open(path, 'r+b') returns), and BufferedRWPair over two one-way streams such as the ends of a pipe.",
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'bufferedrandom bufferedrwpair io.BufferedRandom io.BufferedRWPair python r+b w+b a+b read write same file seek update binary file in place pipe two streams reader writer',
};

export const method = {
  slug:      'bufferedrandom-bufferedrwpair',
  name:      'io.BufferedRandom / io.BufferedRWPair',
  signature: 'io.BufferedRandom(raw, buffer_size=DEFAULT_BUFFER_SIZE)',
  returns:   { type: 'BufferedRandom | BufferedRWPair', desc: 'A buffered stream that is both readable and writable.' },

  category:    'io classes',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: "BufferedRandom is the '+' mode of a binary file: one position, reads and writes interleaved, seek() and tell() guaranteed. BufferedRWPair joins a readable and a writable stream that are not seekable and have separate positions — the docs warn never to pass the same object twice; use BufferedRandom for that.",

  covers: ['BufferedRandom', 'BufferedRWPair'],

  cheat: {
    commonCall: "with open('data.bin', 'r+b') as f:  # a BufferedRandom",
    returns:    'read, write, seek and tell on one object',
    replaces:   'separate reader and writer objects for one file',
    watchOut:   'BufferedRWPair is not seekable and cannot detach()',
  },

  parameters: [
    { name: 'raw',            type: 'RawIOBase', required: true,  default: null, desc: 'BufferedRandom: a seekable raw stream opened for reading and writing.' },
    { name: 'reader, writer', type: 'RawIOBase', required: true,  default: null, desc: 'BufferedRWPair: one readable and one writable stream (positional only).' },
    { name: 'buffer_size',    type: 'int',       required: false, default: 'DEFAULT_BUFFER_SIZE', desc: 'Buffer size for each direction.' },
  ],

  patterns: [
    {
      name: 'Patch a binary file in place',
      desc: "'r+b' keeps the contents; 'w+b' would truncate first.",
      code: "with open('save.dat', 'r+b') as f:\n    f.seek(16)\n    f.write(new_score.to_bytes(4, 'little'))",
    },
    {
      name: 'One object for both ends of a pipe',
      desc: 'Wrap the raw read and write ends.',
      code: "import io, os\nr, w = os.pipe()\nchannel = io.BufferedRWPair(io.FileIO(r, 'r'), io.FileIO(w, 'w'))",
    },
  ],

  examples: [
    { title: "'r+b' gives a BufferedRandom", code: "open('a.bin', 'wb').close()\nwith open('a.bin', 'r+b') as f:\n    name = type(f).__name__\nname", returns: "'BufferedRandom'" },
    { title: 'Write in the middle, read back', code: "import io\nf = io.BufferedRandom(io.BytesIO(b'hello world'))\nf.seek(6)\nf.write(b'there')\nf.seek(0)\nf.read()", returns: "b'hello there'" },
    { title: 'Not a subclass of Reader/Writer', code: 'import io\n(issubclass(io.BufferedRandom, io.BufferedReader), issubclass(io.BufferedRandom, io.BufferedIOBase))', returns: '(False, True)' },
    { title: 'A pair of streams',            code: "import io\nreader, writer = io.BytesIO(b'request'), io.BytesIO()\npair = io.BufferedRWPair(reader, writer)\ndata = pair.read()\npair.write(b'response')\npair.flush()\n(data, writer.getvalue())", returns: "(b'request', b'response')" },
    { title: 'A pair is not seekable',       code: "import io\nio.BufferedRWPair(io.BytesIO(), io.BytesIO()).seekable()", returns: 'False' },
    { title: 'and cannot detach',            code: "import io\nio.BufferedRWPair(io.BytesIO(), io.BytesIO()).detach()", returns: 'io.UnsupportedOperation: detach' },
  ],

  pitfalls: [
    {
      name: "Opening with 'w+b' to update a file",
      desc: "'w' truncates on open, '+' only adds reading. To update existing contents use 'r+b'.",
      wrong: { label: "'w+b'", code: "with open('a.bin', 'wb') as f:\n    f.write(b'abcdef')\nwith open('a.bin', 'w+b') as f:\n    data = f.read()\ndata", output: "b''" },
      fix:   { label: "'r+b'", code: "with open('a.bin', 'wb') as f:\n    f.write(b'abcdef')\nwith open('a.bin', 'r+b') as f:\n    data = f.read()\ndata", output: "b'abcdef'" },
    },
  ],

  when: {
    use: [
      "BufferedRandom: updating binary files in place ('r+b', 'a+b')",
      'BufferedRWPair: a duplex channel made of two one-way streams',
    ],
    avoid: [
      'The same raw object as reader and writer of a BufferedRWPair (docs warning) → BufferedRandom',
      'Text read-write → open(path, "r+", encoding=...) gives a TextIOWrapper over a BufferedRandom',
    ],
  },

  notes: {
    cpython:    'Modules/_io/bufferedio.c. The docs describe BufferedRandom as inheriting from BufferedReader and BufferedWriter, but the C classes are separate: issubclass(io.BufferedRandom, io.BufferedReader) is False. All of them are registered with io.BufferedIOBase',
    'Seeking':  'On BufferedRandom a seek() flushes pending writes and drops the read-ahead buffer',
    'Pair':     'BufferedRWPair keeps a BufferedReader and a BufferedWriter inside and forwards to them; it offers no synchronisation between the two streams (docs)',
  },

  related: [
    { name: 'BufferedReader', slug: 'bufferedreader', when: 'Read-only buffering' },
    { name: 'BufferedWriter', slug: 'bufferedwriter', when: 'Write-only buffering' },
    { name: 'io.open',        slug: 'open',           when: "'+' modes return a BufferedRandom" },
    { name: 'seek / tell / truncate', slug: 'seek-tell-truncate', when: 'Positions in binary streams' },
    { name: 'os.pipe',        slug: 'pipe',           when: 'Two one-way descriptors to pair up', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: "What is the difference between 'r+b', 'w+b' and 'a+b'?",
      a: "All three return a BufferedRandom that can read and write. 'r+b' requires the file and keeps its contents, 'w+b' creates or truncates it, 'a+b' creates it if needed and makes every write go to the end.",
    },
    {
      q: 'When would I use BufferedRWPair?',
      a: 'When reading and writing happen on two different non-seekable streams that belong together, such as the two ends of a pipe or a socket split into input and output. For a single seekable file use BufferedRandom.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.BufferedRandom',
    meta:  'io.BufferedRandom / io.BufferedRWPair',
  },

};
