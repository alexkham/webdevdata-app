// content/reference/python/stdlib/io/readable-writable-seekable.js

export const meta = {
  slug:        'readable-writable-seekable',
  name:        'StringIO / BytesIO readable, writable, seekable, isatty',
  signature:   'f.readable()  ·  f.writable()  ·  f.seekable()  ·  f.isatty()',
  blurb:       'Ask a stream what it supports: reading, writing, random access, or being a terminal. In-memory streams answer True, True, True and False; real files depend on their mode.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'readable writable seekable isatty StringIO.readable StringIO.writable StringIO.seekable BytesIO.readable BytesIO.writable BytesIO.seekable BytesIO.isatty python check if file is readable writable stream capabilities terminal tty open mode',
};

export const method = {
  slug:      'readable-writable-seekable',
  name:      'StringIO / BytesIO readable, writable, seekable, isatty',
  signature: 'f.readable()',
  returns:   { type: 'bool', desc: 'Whether the stream supports the operation (not whether there is data left).' },

  category:    'StringIO / BytesIO methods',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'These four questions let generic code adapt to the stream it was given. StringIO and BytesIO support everything and are never terminals. A file from open() answers according to its mode — and when the answer is False, the matching operation raises io.UnsupportedOperation.',

  covers: ['StringIO.readable', 'StringIO.writable', 'StringIO.seekable', 'BytesIO.readable', 'BytesIO.writable', 'BytesIO.seekable', 'BytesIO.isatty'],

  cheat: {
    commonCall: 'if stream.seekable(): stream.seek(0)',
    returns:    'True / False',
    replaces:   'try/except around the first read, write or seek',
    watchOut:   'on a closed stream they raise ValueError instead of returning False',
  },

  parameters: [],

  modes: [
    {
      id: 'modes',
      label: 'open() modes',
      blurb: 'A StringIO, a BytesIO and a file opened with your mode, asked the same four questions: readable, writable, seekable, isatty.',
      params: [{ name: 'mode', type: 'str', hint: "open() mode, e.g. 'r', 'a', 'w+b'", input: 'text' }],
      template: "import io\nopen('demo.txt', 'w').close()\nstreams = [io.StringIO(), io.BytesIO(), open('demo.txt', {$mode})]\ncaps = [(type(s).__name__, s.readable(), s.writable(), s.seekable(), s.isatty()) for s in streams]\nstreams[2].close()\ncaps",
      cases: [
        { id: 'r',   label: "'r'",   values: { mode: 'r' } },
        { id: 'a',   label: "'a'",   values: { mode: 'a' } },
        { id: 'wpb', label: "'w+b'", values: { mode: 'w+b' } },
        { id: 'ab',  label: "'ab'",  values: { mode: 'ab' } },
      ],
    },
  ],
  demoExplainer: "A file opened with 'a' cannot be read (readable() is False) but can still seek; 'w+b' gives a BufferedRandom that does everything. isatty() is False for files on disk; it is True for a console such as sys.stdout in an interactive terminal, which is why it is not shown here. An invalid mode never gets as far as the questions: open() raises ValueError first.",

  patterns: [
    {
      name: 'Rewind only when possible',
      desc: 'Pipes and sockets are not seekable.',
      code: "def rewind(stream):\n    if stream.seekable():\n        stream.seek(0)\n        return True\n    return False",
    },
    {
      name: 'Colour output only on a terminal',
      desc: 'isatty() is the usual check before printing escape codes.',
      code: "import sys\nuse_colour = sys.stdout.isatty()",
    },
    {
      name: 'Validate a stream argument',
      desc: 'Fail early with a clear message.',
      code: "def save(stream):\n    if not stream.writable():\n        raise ValueError('stream must be writable')\n    stream.write(serialize())",
    },
  ],

  examples: [
    { title: 'StringIO supports everything',   code: 'import io\nf = io.StringIO()\n(f.readable(), f.writable(), f.seekable())', returns: '(True, True, True)' },
    { title: 'Never a terminal',               code: 'import io\nio.BytesIO().isatty()', returns: 'False' },
    { title: 'A file opened for reading',      code: "open('a.txt', 'w').close()\nwith open('a.txt') as f:\n    caps = (f.readable(), f.writable())\ncaps", returns: '(True, False)' },
    { title: 'Append mode cannot read',        code: "with open('a.txt', 'a') as f:\n    caps = (f.readable(), f.writable(), f.seekable())\ncaps", returns: '(False, True, True)' },
    { title: 'False means the call raises',    code: "open('a.txt', 'w').close()\nwith open('a.txt') as f:\n    f.write('x')", returns: 'io.UnsupportedOperation: not writable' },
    { title: 'Closed: ValueError, not False',  code: 'import io\nf = io.StringIO()\nf.close()\nf.readable()', returns: 'ValueError: I/O operation on closed file' },
  ],

  pitfalls: [
    {
      name: 'Using readable() to ask whether data is left',
      desc: 'readable() is about the stream type, not its position. At the end it is still True; the empty read is the end-of-file signal.',
      wrong: { label: 'readable()',  code: "import io\nf = io.StringIO('x')\nf.read()\nf.readable()", output: 'True' },
      fix:   { label: 'empty read',  code: "import io\nf = io.StringIO('x')\nf.read()\nf.read() == ''", output: 'True' },
    },
    {
      name: 'Asking a closed stream',
      desc: 'The capability checks raise on a closed stream. Test closed first.',
      wrong: { label: 'writable()',             code: "import io\nb = io.BytesIO()\nb.close()\nb.writable()", output: 'ValueError: I/O operation on closed file.' },
      fix:   { label: 'closed, then writable()', code: "import io\nb = io.BytesIO()\nb.close()\nnot b.closed and b.writable()", output: 'False' },
    },
  ],

  when: {
    use: [
      'Generic helpers that accept any stream',
      'Deciding whether to seek back or buffer the data yourself',
      'isatty(): interactive versus redirected output',
    ],
    avoid: [
      'Checking for remaining data → read() returning empty',
      'StringIO / BytesIO you created yourself — the answers are always the same',
    ],
  },

  notes: {
    cpython:   'StringIO and BytesIO define readable/writable/seekable themselves (stringio.c, bytesio.c), returning True after a closed check; BytesIO also defines isatty(), StringIO inherits IOBase.isatty()',
    'Files':   "For open() results the answers come from the mode: 'r' readable, 'w' / 'a' / 'x' writable, '+' both; regular files are seekable",
    'Default': 'IOBase itself answers False to readable / writable / seekable — a subclass must override them',
  },

  related: [
    { name: 'UnsupportedOperation', slug: 'unsupportedoperation', when: 'Raised when the answer was False' },
    { name: 'io.open',              slug: 'open',                 when: 'Which class each mode returns' },
    { name: 'close / closed',       slug: 'close-closed',         when: 'Why the checks raise after close()' },
    { name: 'IOBase',               slug: 'iobase',               when: 'Where the default answers come from' },
    { name: 'sys.stdout',           slug: 'stdout',               when: 'isatty() on the console', category: 'stdlib/sys' },
  ],

  faq: [
    {
      q: 'How do I check if a file is writable in Python?',
      a: "For an open file object, f.writable(). It reflects the mode: 'r' gives False, 'w', 'a', 'x' and '+' modes give True. For permissions on a path before opening, use os.access(path, os.W_OK) — or just try to open it and handle PermissionError.",
    },
    {
      q: 'Is a StringIO seekable?',
      a: 'Yes — StringIO and BytesIO always return True from seekable(), readable() and writable() while open. StringIO only supports offset 0 for SEEK_CUR and SEEK_END, though.',
    },
    {
      q: 'What does isatty() return for StringIO?',
      a: 'False — it is never connected to a terminal. Code that checks sys.stdout.isatty() therefore sees False when you redirect stdout into a StringIO.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.IOBase.readable',
    meta:  'IOBase.readable / writable / seekable / isatty',
  },

};
