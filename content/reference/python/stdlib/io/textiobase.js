// content/reference/python/stdlib/io/textiobase.js — io.TextIOBase

export const meta = {
  slug:        'textiobase',
  name:        'io.TextIOBase',
  signature:   'class io.TextIOBase',
  blurb:       'Base class for text streams — TextIOWrapper (text files) and StringIO. read, readline and write work with str; encoding, errors and newlines describe the decoding.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'textiobase io.TextIOBase python text stream base class str stream encoding errors newlines detach buffer check text mode file isinstance text file',
};

export const method = {
  slug:      'textiobase',
  name:      'io.TextIOBase',
  signature: 'class io.TextIOBase',
  returns:   { type: 'TextIOBase', desc: 'Used with isinstance() or as a base class.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'Anything opened in text mode, plus StringIO and sys.stdout, is a TextIOBase: it reads and writes str and does the encoding and newline handling for you. Text positions are opaque — seek() accepts only 0 or a value tell() returned — which is the main practical difference from binary streams.',

  covers: ['TextIOBase'],

  cheat: {
    commonCall: 'isinstance(f, io.TextIOBase)',
    returns:    'True for text files, StringIO, sys.stdout',
    replaces:   "checking 'b' not in f.mode",
    watchOut:   'seek(n) with an arbitrary n is undefined on text streams',
  },

  parameters: [],

  attributes: [
    { name: 'encoding', type: 'str | None', meaning: 'The codec name (None for StringIO).' },
    { name: 'errors',   type: 'str | None', meaning: 'The error handler ("strict" by default for files, None for StringIO).' },
    { name: 'newlines', type: 'str | tuple | None', meaning: 'Line endings translated so far, when the implementation tracks them.' },
    { name: 'buffer',   type: 'BufferedIOBase', meaning: 'The binary stream underneath (TextIOWrapper only).' },
    { name: 'read(size=-1) / readline(size=-1) / write(s)', type: 'methods', meaning: 'Work in characters and str.' },
    { name: 'detach()', type: 'method', meaning: 'Separate and return the binary buffer; StringIO raises UnsupportedOperation (3.1+).' },
  ],

  patterns: [
    {
      name: 'Accept text or binary',
      desc: 'Decode only when given a binary stream.',
      code: "import io\ndef read_text(stream, encoding='utf-8'):\n    data = stream.read()\n    if isinstance(stream, io.TextIOBase):\n        return data\n    return data.decode(encoding)",
    },
    {
      name: 'Switch sys.stdout to UTF-8',
      desc: 'reconfigure() exists on TextIOWrapper (3.7+), not on every TextIOBase.',
      code: "import sys\nsys.stdout.reconfigure(encoding='utf-8')",
    },
  ],

  examples: [
    { title: 'Text files and StringIO',     code: "import io\nwith open('a.txt', 'w', encoding='utf-8') as f:\n    from_open = isinstance(f, io.TextIOBase)\n(from_open, isinstance(io.StringIO(), io.TextIOBase), isinstance(io.BytesIO(), io.TextIOBase))", returns: '(True, True, False)' },
    { title: 'encoding and errors',         code: "with open('a.txt', 'w', encoding='utf-8') as f:\n    info = (f.encoding, f.errors)\ninfo", returns: "('utf-8', 'strict')" },
    { title: 'The binary layer underneath', code: "with open('a.txt', 'w', encoding='utf-8') as f:\n    name = type(f.buffer).__name__\nname", returns: "'BufferedWriter'" },
    { title: 'StringIO has no encoding',    code: 'import io\n(io.StringIO().encoding, io.StringIO().errors)', returns: '(None, None)' },
    { title: 'StringIO cannot detach',      code: 'import io\nio.StringIO().detach()', returns: 'io.UnsupportedOperation: detach' },
    { title: 'The base read() is unsupported', code: 'import io\nio.TextIOBase().read()', returns: 'io.UnsupportedOperation: read' },
  ],

  pitfalls: [
    {
      name: 'Writing bytes to a text stream',
      desc: 'Text streams take str. Decode first, or write to f.buffer.',
      wrong: { label: 'bytes',  code: "with open('a.txt', 'w', encoding='utf-8') as f:\n    f.write(b'data')", output: 'TypeError: write() argument must be str, not bytes' },
      fix:   { label: 'str',    code: "with open('a.txt', 'w', encoding='utf-8') as f:\n    n = f.write(b'data'.decode('utf-8'))\nn", output: '4' },
    },
  ],

  when: {
    use: [
      'Checking whether a stream wants str or bytes',
      'Base class for a custom text stream',
    ],
    avoid: [
      'Wrapping bytes as text → io.TextIOWrapper does the decoding for you',
    ],
  },

  notes: {
    cpython:    'Modules/_io/textio.c: _TextIOBase raises UnsupportedOperation for read, readline, write and detach and returns None for encoding, errors and newlines. Lib/io.py registers StringIO and TextIOWrapper as subclasses',
    'Positions': 'For TextIOWrapper, tell() returns an opaque cookie (it may encode decoder state); only 0 and values from tell() are valid for seek()',
  },

  related: [
    { name: 'TextIOWrapper', slug: 'textiowrapper', when: 'The text layer of open()' },
    { name: 'StringIO',      slug: 'stringio',      when: 'In-memory TextIOBase' },
    { name: 'IOBase',        slug: 'iobase',        when: 'What TextIOBase inherits' },
    { name: 'BufferedIOBase', slug: 'bufferediobase', when: 'The binary counterpart' },
    { name: 'sys.stdout',    slug: 'stdout',        when: 'A TextIOWrapper you already have', category: 'stdlib/sys' },
  ],

  faq: [
    {
      q: 'How do I know if a file object is text or binary?',
      a: 'isinstance(f, io.TextIOBase) for text; io.BufferedIOBase or io.RawIOBase for binary. Text streams read and write str, binary ones bytes.',
    },
    {
      q: 'Why can I not seek to an arbitrary position in a text file?',
      a: 'Characters can take several bytes and the decoder may hold state, so a character index does not map to a byte offset. TextIOWrapper.tell() returns a cookie that encodes both; seek() only accepts such cookies or 0. Use a binary file (or StringIO, whose positions are character indexes) for random access.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.TextIOBase',
    meta:  'io.TextIOBase',
  },

};
