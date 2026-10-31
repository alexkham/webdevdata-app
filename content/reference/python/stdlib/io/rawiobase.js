// content/reference/python/stdlib/io/rawiobase.js — io.RawIOBase

export const meta = {
  slug:        'rawiobase',
  name:        'io.RawIOBase',
  signature:   'class io.RawIOBase',
  blurb:       'Base class for unbuffered binary streams: implement readinto() (and write()) and you get read() and readall(); wrap the result in a BufferedReader for efficient reads.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'rawiobase io.RawIOBase python raw stream unbuffered binary readinto readall custom binary stream subclass FileIO bufferedreader wrap raw io NotImplementedError',
};

export const method = {
  slug:      'rawiobase',
  name:      'io.RawIOBase',
  signature: 'class io.RawIOBase',
  returns:   { type: 'RawIOBase', desc: 'Used as a base class; FileIO is the concrete one open() uses.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'A raw stream talks to the OS (or whatever produces your bytes) one call at a time and may return fewer bytes than asked for. The only method a readable subclass must write is readinto(b); RawIOBase builds read(size) and readall() on top of it. FileIO is the raw stream behind every open() call.',

  covers: ['RawIOBase'],

  cheat: {
    commonCall: 'class Source(io.RawIOBase):\n    def readinto(self, b): ...',
    returns:    'read() and readall() for free',
    replaces:   'hand-written buffering loops',
    watchOut:   'read() may return fewer bytes than requested; None means "no data right now"',
  },

  parameters: [],

  attributes: [
    { name: 'readinto(b)', type: 'method (implement)', meaning: 'Fill the writable buffer b, return the number of bytes (0 at end of file, None if non-blocking and nothing is ready).' },
    { name: 'write(b)',    type: 'method (implement)', meaning: 'Write bytes, return how many were written (may be fewer than len(b)).' },
    { name: 'read(size=-1)', type: 'method',           meaning: 'One readinto() call into a buffer of size bytes; size -1 calls readall().' },
    { name: 'readall()',   type: 'method',             meaning: 'Read until end of file, calling read() as often as needed.' },
  ],

  patterns: [
    {
      name: 'A byte source as a buffered file',
      desc: 'Implement readinto, then wrap: BufferedReader adds read(n), peek(), readline() and iteration.',
      code: "import io\nclass Chunks(io.RawIOBase):\n    def __init__(self, chunks):\n        self.chunks = iter(chunks)\n        self.pending = b''\n    def readable(self):\n        return True\n    def readinto(self, b):\n        if not self.pending:\n            self.pending = next(self.chunks, b'')\n        n = min(len(b), len(self.pending))\n        b[:n] = self.pending[:n]\n        self.pending = self.pending[n:]\n        return n\nstream = io.BufferedReader(Chunks(response_chunks))",
    },
    {
      name: 'Unbuffered file access',
      desc: 'buffering=0 returns the FileIO itself.',
      code: "with open('device.bin', 'rb', buffering=0) as raw:\n    header = raw.read(16)",
    },
  ],

  examples: [
    { title: 'buffering=0 gives a raw stream',   code: "import io\nopen('a.bin', 'wb').close()\nwith open('a.bin', 'rb', buffering=0) as f:\n    raw = isinstance(f, io.RawIOBase)\nraw", returns: 'True' },
    { title: 'readinto() is enough',             code: "import io\nclass Repeat(io.RawIOBase):\n    def __init__(self, byte, count):\n        self.byte, self.left = byte, count\n    def readable(self):\n        return True\n    def readinto(self, b):\n        n = min(len(b), self.left)\n        b[:n] = self.byte * n\n        self.left -= n\n        return n\nr = Repeat(b'z', 5)\n(r.read(2), r.readall())", returns: "(b'zz', b'zzz')" },
    { title: 'Wrap it for buffering',            code: "import io\nclass Repeat(io.RawIOBase):\n    def __init__(self, byte, count):\n        self.byte, self.left = byte, count\n    def readable(self):\n        return True\n    def readinto(self, b):\n        n = min(len(b), self.left)\n        b[:n] = self.byte * n\n        self.left -= n\n        return n\nio.BufferedReader(Repeat(b'z', 3)).read()", returns: "b'zzz'" },
    { title: 'readall() on a FileIO',            code: "with open('a.bin', 'wb') as f:\n    f.write(b'abc')\nwith open('a.bin', 'rb', buffering=0) as f:\n    data = f.readall()\ndata", returns: "b'abc'" },
    { title: 'None from readinto: nothing yet',  code: "import io\nclass NotReady(io.RawIOBase):\n    def readable(self):\n        return True\n    def readinto(self, b):\n        return None\nNotReady().read(5) is None", returns: 'True' },
    { title: 'Without readinto()',               code: 'import io\nio.RawIOBase().read(1)', returns: 'NotImplementedError' },
  ],

  pitfalls: [
    {
      name: 'Implementing read() instead of readinto()',
      desc: 'BufferedReader pulls data with readinto(), so a raw class that only overrides read() fails once wrapped. Put the logic in readinto().',
      wrong: { label: 'read() only',  code: "import io\nclass Source(io.RawIOBase):\n    def readable(self):\n        return True\n    def read(self, size=-1):\n        return b'data'\nio.BufferedReader(Source()).read(2)", output: 'NotImplementedError' },
      fix:   { label: 'readinto()',   code: "import io\nclass Source(io.RawIOBase):\n    def __init__(self):\n        self.data = b'data'\n    def readable(self):\n        return True\n    def readinto(self, b):\n        n = min(len(b), len(self.data))\n        b[:n], self.data = self.data[:n], self.data[n:]\n        return n\nio.BufferedReader(Source()).read(2)", output: "b'da'" },
    },
  ],

  when: {
    use: [
      'Adapting a byte source (socket, device, generator of chunks) to the file interface',
      'Unbuffered access to a file (open(..., "rb", buffering=0) returns FileIO)',
    ],
    avoid: [
      'Code that reads small pieces → a BufferedReader on top, or open() with default buffering',
      'Text → TextIOBase / TextIOWrapper',
    ],
  },

  notes: {
    cpython:   'Modules/_io/iobase.c (_RawIOBase): read() allocates a bytearray of size bytes and calls readinto(); readall() loops over read(DEFAULT_BUFFER_SIZE). readinto() itself is not implemented and raises NotImplementedError',
    'Short reads': 'Raw read() makes one call and may return fewer bytes than requested even before end of file; an empty result (size > 0) means end of file',
    'Registered': 'io.py registers FileIO (and _WindowsConsoleIO on Windows) as RawIOBase subclasses',
  },

  related: [
    { name: 'FileIO',         slug: 'fileio',         when: 'The concrete raw stream for files' },
    { name: 'BufferedReader', slug: 'bufferedreader', when: 'Buffering on top of a raw stream' },
    { name: 'IOBase',         slug: 'iobase',         when: 'What RawIOBase inherits' },
    { name: 'BufferedIOBase', slug: 'bufferediobase', when: 'The buffered counterpart' },
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'What the missing readinto raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between RawIOBase and BufferedIOBase?',
      a: 'A raw stream does one OS call per read and may return short results; a buffered stream keeps an internal buffer and tries to return exactly the number of bytes asked for, using as many raw reads as needed. open() returns buffered streams unless you pass buffering=0.',
    },
    {
      q: 'Which method do I implement for a custom binary stream?',
      a: 'readinto(b) for reading (fill b, return the count, 0 at end) and write(b) for writing, plus readable() / writable() returning True. Then wrap the instance in io.BufferedReader or io.BufferedWriter.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.RawIOBase',
    meta:  'io.RawIOBase',
  },

};
