// content/reference/python/stdlib/io/index.js — the io module hub

export const meta = {
  slug:        'index',
  name:        'io',
  signature:   'import io',
  blurb:       'Streams for text and bytes: StringIO and BytesIO in-memory files, the file classes open() returns, and the base classes every file object follows.',
  category:    'files',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'io module python stringio bytesio in-memory file file-like object stream textiowrapper bufferedreader bufferedwriter fileio open seek tell getvalue memory buffer text stream binary stream unsupportedoperation',
};

export const method = {
  slug: 'index',
  name: 'io',

  category:    'Files and directories',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Every file object in Python comes from io. open() builds a FileIO, wraps it in a buffer and, for text, in a TextIOWrapper. StringIO and BytesIO give you the same read / write / seek interface on a str or bytes buffer in memory — for tests, for capturing output, and for any library that wants a file.',

  imports: ['import io', 'from io import StringIO, BytesIO'],
  facts: [
    { label: 'In memory',      value: 'StringIO holds str (positions count characters); BytesIO holds bytes (positions count bytes)' },
    { label: 'On disk',        value: 'open() returns a TextIOWrapper (text), a BufferedReader / BufferedWriter / BufferedRandom (binary) or a FileIO (binary with buffering=0)' },
    { label: 'Base classes',   value: 'IOBase, with RawIOBase, BufferedIOBase and TextIOBase under it — use them with isinstance()' },
    { label: 'Implementation', value: 'The C module _io (Modules/_io/); Lib/_pyio.py is a pure-Python version of the same API' },
  ],

  coverClasses: ['StringIO', 'BytesIO'],

  modes: [
    {
      id: 'lines',
      label: 'a file in memory',
      blurb: 'StringIO turns a str into a file: readline() returns one line, tell() is the position in characters, readlines() returns the rest. Type \\n for a line break.',
      params: [{ name: 'text', type: 'str', hint: 'text, \\n = new line', input: 'text' }],
      template: "import io\nf = io.StringIO({$text}.replace('\\\\n', '\\n'))\n(f.readline(), f.tell(), f.readlines())",
      cases: [
        { id: 'three', label: 'three lines',  values: { text: 'first\\nsecond\\nthird' } },
        { id: 'one',   label: 'no line break', values: { text: 'just one line' } },
        { id: 'empty', label: 'empty lines',  values: { text: '\\n\\nlast' } },
        { id: 'utf',   label: 'non-ASCII',    values: { text: 'Zoë\\nnaïve' } },
      ],
    },
    {
      id: 'capture',
      label: 'print() into a buffer',
      blurb: 'print(..., file=buf) writes to any object with a write() method. The buffer collects exactly what would have reached the screen.',
      params: [
        { name: 'words', type: 'list[str]', hint: 'values to print, comma-separated', input: 'csv' },
        { name: 'sep',   type: 'str',       hint: 'separator',                        input: 'text' },
      ],
      template: "import io\nbuf = io.StringIO()\nprint(*{$words}, sep={$sep}, file=buf)\nbuf.getvalue()",
      cases: [
        { id: 'csv',   label: 'sep=","',   values: { words: 'id, name, email', sep: ',' } },
        { id: 'space', label: 'sep=" "',   values: { words: 'hello, world', sep: ' ' } },
        { id: 'none',  label: 'no values', values: { words: '', sep: ' ' } },
      ],
    },
    {
      id: 'bytes',
      label: 'BytesIO',
      blurb: 'BytesIO is the binary twin: it takes bytes, and write() returns the number of bytes — not characters.',
      params: [{ name: 'text', type: 'str', hint: 'text to encode as UTF-8', input: 'text' }],
      template: "import io\nb = io.BytesIO()\nn = b.write({$text}.encode())\n(n, len({$text}), b.getvalue())",
      cases: [
        { id: 'ascii', label: 'ASCII',     values: { text: 'hello' } },
        { id: 'utf',   label: 'accents',   values: { text: 'café' } },
        { id: 'emoji', label: 'emoji',     values: { text: 'ok 👍' } },
      ],
    },
  ],
  demoExplainer: "After readline() the position sits just past the first \\n, so readlines() starts on the second line and the last line has no \\n because the text has none. tell() counts characters: 'Zoë\\n' moves it to 4 although é is two bytes in UTF-8. print() wrote its separator between the values and a final \\n, and with no values at all it still wrote the \\n. In the BytesIO tab 'café' is 4 characters but 5 bytes and the emoji alone is 4 bytes.",

  patterns: [
    {
      name: 'Capture what a function prints',
      desc: 'redirect_stdout swaps sys.stdout for your buffer inside the with block.',
      code: "import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    report()\noutput = buf.getvalue()",
    },
    {
      name: 'Give text to code that expects a file',
      desc: "csv.reader, json.load and configparser all read from file objects; StringIO wraps a str you already have. newline='' is what csv wants.",
      code: "import csv, io\nrows = list(csv.reader(io.StringIO(text, newline='')))",
    },
    {
      name: 'Bytes in memory instead of a temporary file',
      desc: 'Libraries that write to a binary file can write to a BytesIO; getvalue() returns everything written.',
      code: "import io\nbuffer = io.BytesIO()\nimage.save(buffer, format='PNG')\npng_bytes = buffer.getvalue()",
    },
    {
      name: 'Accept a path or an open file',
      desc: 'Every stream is an io.IOBase, so one isinstance check tells the two apart.',
      code: "import io\ndef load(source):\n    if isinstance(source, io.IOBase):\n        return source.read()\n    with open(source, encoding='utf-8') as f:\n        return f.read()",
    },
  ],

  examples: [
    { title: 'A file made from a string',  code: "import io\nf = io.StringIO('first\\nsecond\\n')\nf.readline()", returns: "'first\\n'" },
    { title: 'Write, rewind, read',        code: "import io\nf = io.StringIO()\nf.write('hello')\nf.seek(0)\nf.read()", returns: "'hello'" },
    { title: 'print() into a buffer',      code: "import io\nbuf = io.StringIO()\nprint('a', 'b', sep='-', file=buf)\nbuf.getvalue()", returns: "'a-b\\n'" },
    { title: 'BytesIO counts bytes',       code: "import io\nb = io.BytesIO()\nb.write('é'.encode())", returns: '2' },
    { title: 'The layers open() builds',   code: "import io\nopen('a.txt', 'w').close()\nwith open('a.txt', 'rb') as f:\n    layers = [type(f).__name__, type(f.raw).__name__]\nlayers", returns: "['BufferedReader', 'FileIO']" },
    { title: 'The base classes answer isinstance', code: 'import io\n[isinstance(io.StringIO(), io.TextIOBase), isinstance(io.BytesIO(), io.BufferedIOBase)]', returns: '[True, True]' },
    { title: 'str into a binary stream',   code: "import io\nio.BytesIO().write('text')", returns: "TypeError: a bytes-like object is required, not 'str'" },
  ],

  pitfalls: [
    {
      name: 'Reading right after writing',
      desc: 'write() leaves the position at the end, so read() finds nothing. getvalue() returns the whole buffer wherever the position is; or seek(0) first.',
      wrong: { label: 'read()',     code: "import io\nf = io.StringIO()\nf.write('data')\nf.read()", output: "''" },
      fix:   { label: 'getvalue()', code: "import io\nf = io.StringIO()\nf.write('data')\nf.getvalue()", output: "'data'" },
    },
    {
      name: 'Using the buffer after its with block',
      desc: 'Leaving the with block closes the StringIO and discards its contents. Take the value inside the block.',
      wrong: { label: 'after the block', code: "import io\nwith io.StringIO() as f:\n    f.write('log line')\nf.getvalue()", output: 'ValueError: I/O operation on closed file' },
      fix:   { label: 'inside the block', code: "import io\nwith io.StringIO() as f:\n    f.write('log line')\n    text = f.getvalue()\ntext", output: "'log line'" },
    },
  ],

  when: {
    use: [
      'Tests: feed a str to code that reads a file, or capture what it writes',
      'Building text or bytes piece by piece, then taking it all with getvalue()',
      'Checking what kind of stream you were given (io.IOBase, io.TextIOBase …)',
      'Wrapping a binary stream as text yourself (io.TextIOWrapper)',
    ],
    avoid: [
      'Joining many small strings → collect them in a list and use str.join',
      'Data too big for memory → a real file, or tempfile.SpooledTemporaryFile',
      'Opening files → the built-in open() (io.open is the same function)',
    ],
  },

  notes: {
    cpython:          'Modules/_io/ in C: stringio.c, bytesio.c, fileio.c, bufferedio.c, textio.c, iobase.c. Lib/io.py re-exports it and registers the classes with the IOBase / RawIOBase / BufferedIOBase / TextIOBase ABCs',
    'Text vs binary': 'Text streams take and return str and handle encoding and newline translation; binary streams take bytes-like objects and return bytes. Giving a stream the wrong type raises TypeError',
    'Threads':        'The docs say the buffered binary classes protect their state with a lock; TextIOWrapper objects are not thread-safe',
  },

  history: [
    { version: '3.1',  note: 'io.SEEK_SET / SEEK_CUR / SEEK_END constants; detach() on buffered and text streams' },
    { version: '3.2',  note: 'BytesIO.getbuffer()' },
    { version: '3.7',  note: 'TextIOWrapper.reconfigure() and write_through; the size argument of read1() became optional' },
    { version: '3.8',  note: 'io.open_code()' },
    { version: '3.10', note: 'io.text_encoding(), the encoding="locale" name and the opt-in EncodingWarning (PEP 597)' },
    { version: '3.11', note: 'text_encoding() returns "utf-8" when UTF-8 Mode is on' },
  ],

  related: [
    { name: 'open()',          slug: 'open',            when: 'Opens files — io.open is the same function', category: 'functions' },
    { name: 'with',            slug: 'with',            when: 'Closes streams for you', category: 'keywords' },
    { name: 'print()',         slug: 'print',           when: 'Writes to any stream via file=', category: 'functions' },
    { name: 'redirect_stdout', slug: 'redirect_stdout', when: 'Capture what code prints into a StringIO', category: 'stdlib/contextlib' },
    { name: 'tempfile module', slug: 'tempfile',        when: 'Real temporary files when memory is not enough', category: 'stdlib' },
    { name: 'pathlib',         slug: 'pathlib',         when: 'read_text / write_text for whole files', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between StringIO and BytesIO?',
      a: 'StringIO stores str and is a text stream: it takes str, returns str, and positions count characters. BytesIO stores bytes and is a binary stream: it takes bytes-like objects, returns bytes, and positions count bytes. Use the one that matches what the consuming code reads — open(..., "r") style code wants StringIO, open(..., "rb") style code wants BytesIO.',
    },
    {
      q: 'What is a file-like object in Python?',
      a: 'Any object with the methods the code calls — usually read() or write(), often readline(), seek() and close(). Everything in io is one: open() results, StringIO, BytesIO, sys.stdout. io.IOBase is the common base class if you need an isinstance check.',
    },
    {
      q: 'How do I capture print output in a string?',
      a: 'Pass a StringIO as print(..., file=buf) and call buf.getvalue(). To capture everything a function prints, wrap the call in contextlib.redirect_stdout(buf).',
    },
    {
      q: 'Why does read() return an empty string after write()?',
      a: 'Streams have one position for reading and writing. After write() it is at the end, so read() has nothing left. Call seek(0) before reading, or use getvalue(), which ignores the position.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html',
    meta:  'io — Core tools for working with streams',
  },

};
