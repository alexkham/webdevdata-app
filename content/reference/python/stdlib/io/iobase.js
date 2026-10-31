// content/reference/python/stdlib/io/iobase.js — io.IOBase

export const meta = {
  slug:        'iobase',
  name:        'io.IOBase',
  signature:   'class io.IOBase',
  blurb:       'The abstract base class of every stream: close, closed, the with statement, iteration over lines, readline/readlines/writelines, and the capability checks.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'iobase io.IOBase python file object base class abstract stream isinstance file-like custom stream subclass iterate lines context manager fileno flush isatty readline readlines writelines',
};

export const method = {
  slug:      'iobase',
  name:      'io.IOBase',
  signature: 'class io.IOBase',
  returns:   { type: 'IOBase', desc: 'Normally used as a base class or with isinstance(), not instantiated.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'IOBase defines what all streams share and nothing about data types: it declares no read() or write(). Its defaults describe a stream that can do nothing — readable(), writable() and seekable() are False and seek() raises UnsupportedOperation — so a subclass overrides what it supports and inherits iteration, readlines(), the with statement and close().',

  covers: ['IOBase'],

  cheat: {
    commonCall: 'isinstance(obj, io.IOBase)',
    returns:    'True for open() results, StringIO, BytesIO, sockets made into files',
    replaces:   'hasattr(obj, "read") guesswork',
    watchOut:   'read() and write() are not part of IOBase — they come from the subclasses',
  },

  parameters: [],

  attributes: [
    { name: 'close() / closed',          type: 'method / bool', meaning: 'Flush and close; later operations raise ValueError. Calling close() again does nothing.' },
    { name: '__enter__ / __exit__',      type: 'methods',       meaning: 'with stream: … closes on exit; entering a closed stream raises ValueError.' },
    { name: '__iter__ / __next__',       type: 'methods',       meaning: 'Iteration calls readline() until it returns an empty result.' },
    { name: 'readline(size=-1)',         type: 'method',        meaning: 'Default implementation reads one byte at a time with read(1) (or uses peek()); stops at b"\\n".' },
    { name: 'readlines(hint=-1) / writelines(lines)', type: 'methods', meaning: 'Built on iteration and write(); writelines adds no separators.' },
    { name: 'readable() / writable() / seekable()', type: 'methods', meaning: 'False unless overridden.' },
    { name: 'seek / tell / truncate / fileno', type: 'methods', meaning: 'Raise io.UnsupportedOperation unless overridden (tell() calls seek(0, 1)).' },
    { name: 'flush() / isatty()',        type: 'methods',       meaning: 'flush does nothing (ValueError once closed); isatty returns False.' },
  ],

  patterns: [
    {
      name: 'Accept any stream',
      desc: 'One isinstance check covers files, sockets made into files and in-memory streams.',
      code: "import io\ndef checksum(source):\n    if not isinstance(source, io.IOBase):\n        source = open(source, 'rb')\n    with source:\n        return sum(source.read()) % 256",
    },
    {
      name: 'A minimal line source',
      desc: 'Implement readline(); iteration, readlines() and with come for free.',
      code: "import io\nclass Lines(io.IOBase):\n    def __init__(self, items):\n        self.items = list(items)\n    def readable(self):\n        return True\n    def readline(self, size=-1):\n        return self.items.pop(0) if self.items else b''",
    },
  ],

  examples: [
    { title: 'Every stream is an IOBase',     code: "import io\nopen('a.txt', 'w').close()\nwith open('a.txt', 'rb') as f:\n    from_open = isinstance(f, io.IOBase)\n[from_open, isinstance(io.StringIO(), io.IOBase), isinstance(io.BytesIO(), io.IOBase)]", returns: '[True, True, True]' },
    { title: 'The defaults support nothing',  code: 'import io\nbase = io.IOBase()\n(base.readable(), base.writable(), base.seekable())', returns: '(False, False, False)' },
    { title: 'seek() is unsupported',         code: 'import io\nio.IOBase().seek(0)', returns: 'io.UnsupportedOperation: seek' },
    { title: 'tell() goes through seek()',    code: 'import io\nio.IOBase().tell()', returns: 'io.UnsupportedOperation: seek' },
    { title: 'readline() gives iteration',    code: "import io\nclass Countdown(io.IOBase):\n    def __init__(self, n):\n        self.n = n\n    def readable(self):\n        return True\n    def readline(self, size=-1):\n        if self.n == 0:\n            return b''\n        self.n -= 1\n        return f'{self.n + 1}\\n'.encode()\nlist(Countdown(3))", returns: "[b'3\\n', b'2\\n', b'1\\n']" },
    { title: 'with closes it',                code: 'import io\nwith io.IOBase() as s:\n    pass\ns.closed', returns: 'True' },
    { title: 'No read() of its own',          code: 'import io\nio.IOBase().read()', returns: "AttributeError: 'IOBase' object has no attribute 'read'" },
  ],

  pitfalls: [
    {
      name: 'Checking against a concrete class',
      desc: 'StringIO is a text stream but not a TextIOWrapper. Check the abstract classes.',
      wrong: { label: 'io.TextIOWrapper', code: 'import io\nisinstance(io.StringIO(), io.TextIOWrapper)', output: 'False' },
      fix:   { label: 'io.TextIOBase',    code: 'import io\nisinstance(io.StringIO(), io.TextIOBase)', output: 'True' },
    },
    {
      name: 'Returning None from readline() at the end',
      desc: 'Iteration stops on an empty result; None breaks it. Return b"" (or "") at the end.',
      wrong: { label: 'return None', code: "import io\nclass Source(io.IOBase):\n    def readline(self, size=-1):\n        return None\nlist(Source())", output: "TypeError: object of type 'NoneType' has no len()" },
      fix:   { label: "return b''",  code: "import io\nclass Source(io.IOBase):\n    def readline(self, size=-1):\n        return b''\nlist(Source())", output: '[]' },
    },
  ],

  when: {
    use: [
      'isinstance(x, io.IOBase): "is this some kind of stream?"',
      'Base class for a custom stream that is neither raw bytes nor text',
    ],
    avoid: [
      'Custom binary sources → subclass RawIOBase (implement readinto) and wrap in BufferedReader',
      'Custom text sources → subclass TextIOBase, or wrap bytes in TextIOWrapper',
    ],
  },

  notes: {
    cpython:        'Modules/_io/iobase.c implements _io._IOBase; Lib/io.py defines io.IOBase as an ABC over it (metaclass abc.ABCMeta) and registers the concrete C classes with RawIOBase / BufferedIOBase / TextIOBase',
    'Closed check': 'The mixins test the closed attribute and raise "I/O operation on closed file." (with a period)',
    'Docs':         'Calling any method on a closed stream is undefined by the spec; the implementations raise ValueError',
  },

  related: [
    { name: 'RawIOBase',      slug: 'rawiobase',      when: 'Unbuffered binary streams' },
    { name: 'BufferedIOBase', slug: 'bufferediobase', when: 'Buffered binary streams' },
    { name: 'TextIOBase',     slug: 'textiobase',     when: 'Text streams' },
    { name: 'close / closed', slug: 'close-closed',   when: 'Closing in practice' },
    { name: 'UnsupportedOperation', slug: 'unsupportedoperation', when: 'What the defaults raise' },
    { name: 'with',           slug: 'with',           when: 'IOBase is a context manager', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I check if an object is a file object in Python?',
      a: 'isinstance(obj, io.IOBase) is True for everything open() returns, for StringIO and BytesIO, and for other io-based streams. For text specifically use io.TextIOBase; for binary use io.RawIOBase or io.BufferedIOBase. Duck-typed objects that merely have read() are not IOBase instances.',
    },
    {
      q: 'Why does IOBase have no read() method?',
      a: 'Its subclasses read different things — bytes into a buffer (RawIOBase.readinto), bytes (BufferedIOBase.read), or str (TextIOBase.read) — so the signature differs. The docs still treat read() and write() as part of the interface.',
    },
    {
      q: 'How do I make my own file-like object?',
      a: 'Subclass the closest io class: RawIOBase with readinto() for a byte source (wrap it in io.BufferedReader for buffering), BufferedIOBase with read() for buffered bytes, or TextIOBase for text. Override readable() / writable() / seekable() to tell callers what works.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.IOBase',
    meta:  'io.IOBase',
  },

};
