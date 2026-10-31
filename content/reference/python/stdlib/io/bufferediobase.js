// content/reference/python/stdlib/io/bufferediobase.js — io.BufferedIOBase

export const meta = {
  slug:        'bufferediobase',
  name:        'io.BufferedIOBase',
  signature:   'class io.BufferedIOBase',
  blurb:       'Base class for buffered binary streams — BytesIO, BufferedReader, BufferedWriter, BufferedRandom, BufferedRWPair. read(n) tries to return all n bytes; read1() makes at most one raw call; detach() hands back the raw stream.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'bufferediobase io.BufferedIOBase python binary stream buffered read1 readinto readinto1 detach raw stream has been detached isinstance binary file check bytes stream',
};

export const method = {
  slug:      'bufferediobase',
  name:      'io.BufferedIOBase',
  signature: 'class io.BufferedIOBase',
  returns:   { type: 'BufferedIOBase', desc: 'Used with isinstance() or as a base class.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'This is the "binary file" type to test for: a file opened with "rb", "wb" or "r+b" and a BytesIO are all BufferedIOBase instances. Unlike raw streams, read(n) keeps reading until it has n bytes or reaches the end, and write() always consumes everything (or raises). A subclass that implements read() gets readinto() for free.',

  covers: ['BufferedIOBase'],

  cheat: {
    commonCall: 'isinstance(f, io.BufferedIOBase)',
    returns:    'True for binary files and BytesIO',
    replaces:   "checking 'b' in f.mode",
    watchOut:   'BytesIO.detach() raises UnsupportedOperation — it has no raw stream',
  },

  parameters: [],

  attributes: [
    { name: 'read(size=-1) / read1(size=-1)', type: 'methods', meaning: 'read: up to size bytes, several raw reads if needed. read1: at most one raw read.' },
    { name: 'readinto(b) / readinto1(b)',     type: 'methods', meaning: 'Default implementations call read() / read1() and copy into b (readinto1: 3.5+).' },
    { name: 'write(b)',                       type: 'method',  meaning: 'Returns len(b); data may wait in the buffer until flush().' },
    { name: 'detach()',                       type: 'method',  meaning: 'Separate and return the raw stream; the buffered object is unusable afterwards (3.1+).' },
    { name: 'raw',                            type: 'attribute', meaning: 'The underlying raw stream on BufferedReader / Writer / Random (not part of the ABC).' },
  ],

  patterns: [
    {
      name: 'Require a binary stream',
      desc: 'Reject text streams early with a clear error.',
      code: "import io\ndef load_image(stream):\n    if not isinstance(stream, (io.BufferedIOBase, io.RawIOBase)):\n        raise TypeError('open the file in binary mode (\"rb\")')\n    return decode(stream.read())",
    },
    {
      name: 'Take the raw stream back',
      desc: 'detach() flushes and returns the raw object without closing it.',
      code: "raw = buffered.detach()\nraw.close()",
    },
  ],

  examples: [
    { title: 'Binary files and BytesIO',        code: "import io\nopen('a.bin', 'wb').close()\nwith open('a.bin', 'rb') as f:\n    from_open = isinstance(f, io.BufferedIOBase)\n(from_open, isinstance(io.BytesIO(), io.BufferedIOBase), isinstance(io.StringIO(), io.BufferedIOBase))", returns: '(True, True, False)' },
    { title: 'read() gives readinto()',         code: "import io\nclass Upper(io.BufferedIOBase):\n    def __init__(self, data):\n        self.data = data\n    def readable(self):\n        return True\n    def read(self, size=-1):\n        if size is None or size < 0:\n            chunk, self.data = self.data, b''\n        else:\n            chunk, self.data = self.data[:size], self.data[size:]\n        return chunk.upper()\nbuf = bytearray(3)\nn = Upper(b'abcdef').readinto(buf)\n(n, buf)", returns: "(3, bytearray(b'ABC'))" },
    { title: 'detach() returns the raw stream', code: "import io\nreader = io.BufferedReader(io.BytesIO(b'abc'))\nraw = reader.detach()\ntype(raw).__name__", returns: "'BytesIO'" },
    { title: 'Detached means unusable',         code: "import io\nreader = io.BufferedReader(io.BytesIO(b'abc'))\nreader.detach()\nreader.read()", returns: 'ValueError: raw stream has been detached' },
    { title: 'BytesIO has nothing to detach',   code: 'import io\nio.BytesIO().detach()', returns: 'io.UnsupportedOperation: detach' },
    { title: 'The base read() is unsupported',  code: 'import io\nio.BufferedIOBase().read()', returns: 'io.UnsupportedOperation: read' },
  ],

  pitfalls: [
    {
      name: 'Testing for a binary file with the mode string',
      desc: "BytesIO has no mode attribute, and text wrappers report the mode you passed. isinstance works for every binary stream.",
      wrong: { label: "'b' in f.mode", code: "import io\n'b' in io.BytesIO().mode", output: "AttributeError: '_io.BytesIO' object has no attribute 'mode'" },
      fix:   { label: 'isinstance',    code: 'import io\nisinstance(io.BytesIO(), io.BufferedIOBase)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Telling binary streams from text streams',
      'Base class for a buffered byte stream that implements read() itself',
    ],
    avoid: [
      'Wrapping an unbuffered source → implement RawIOBase.readinto and use BufferedReader',
    ],
  },

  notes: {
    cpython:     'Modules/_io/bufferedio.c: _BufferedIOBase provides readinto/readinto1 on top of read/read1 and raises UnsupportedOperation for read, read1, write and detach. Lib/io.py registers BytesIO, BufferedReader, BufferedWriter, BufferedRandom and BufferedRWPair as subclasses',
    'Blocking':  'In non-blocking mode buffered streams raise BlockingIOError instead of returning None like raw streams do',
  },

  related: [
    { name: 'BytesIO',        slug: 'bytesio',        when: 'In-memory BufferedIOBase' },
    { name: 'BufferedReader', slug: 'bufferedreader', when: "What open(..., 'rb') returns" },
    { name: 'BufferedWriter', slug: 'bufferedwriter', when: "What open(..., 'wb') returns" },
    { name: 'RawIOBase',      slug: 'rawiobase',      when: 'The unbuffered layer below' },
    { name: 'BlockingIOError', slug: 'blockingioerror', when: 'Raised in non-blocking mode' },
  ],

  faq: [
    {
      q: 'How do I check if a file was opened in binary mode?',
      a: 'isinstance(f, io.BufferedIOBase) (or io.RawIOBase for buffering=0). Text files are io.TextIOBase instances. This also works for BytesIO and StringIO, which have no mode attribute.',
    },
    {
      q: 'What does read1() do differently from read()?',
      a: 'read(n) keeps calling the raw stream until it has n bytes or hits the end. read1(n) returns buffered bytes if there are any, otherwise makes a single raw read — useful when you do not want to block for more data than is available.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.BufferedIOBase',
    meta:  'io.BufferedIOBase',
  },

};
