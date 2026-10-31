// content/reference/python/stdlib/io/unsupportedoperation.js

export const meta = {
  slug:        'unsupportedoperation',
  name:        'io.UnsupportedOperation',
  signature:   'io.UnsupportedOperation(*args)',
  blurb:       'Raised when a stream is asked to do something it cannot: read a file opened for writing, write one opened for reading, fileno() on a StringIO. It is both an OSError and a ValueError.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'unsupportedoperation io.UnsupportedOperation python not readable not writable fileno detach read write file opened in wrong mode oserror valueerror stringio fileno file or stream is not readable',
};

export const method = {
  slug:      'unsupportedoperation',
  name:      'io.UnsupportedOperation',
  signature: 'io.UnsupportedOperation(*args)',

  category:    'io exception',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "The message names what was refused, in the words of the layer that refused it: a text file says 'not readable' or 'not writable', a buffered binary file just 'read' or 'write', a raw FileIO 'File not open for reading'. Because it inherits from OSError and ValueError, existing except clauses for either catch it.",

  covers: ['UnsupportedOperation'],

  chain: ['BaseException', 'Exception', 'ValueError', 'OSError', 'UnsupportedOperation'],

  cheat: {
    raisedBy: "read() on a file opened 'w' / 'a', write() on 'r', fileno() / detach() on StringIO and BytesIO, seek() on IOBase",
    message:  "'not readable', 'not writable', 'read', 'write', 'fileno', 'detach' …",
    quickFix: "Open the file with a mode that allows it ('r+', 'w+', 'a+'), or check readable() / writable() first",
    watchOut: 'Tracebacks show io.UnsupportedOperation (io.py sets its __module__ to "io")',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'As for OSError; the io classes pass a single message string.' },
  ],

  modes: [
    {
      id: 'mode',
      label: 'read & write by mode',
      blurb: "Open an (empty) file with a mode, then try read() and write() of nothing. Try 'r', 'w', 'a', 'rb', 'wb', 'r+'.",
      params: [{ name: 'mode', type: 'str', hint: 'open() mode', input: 'text' }],
      template: "import io\nopen('demo.txt', 'w').close()\nwith open('demo.txt', {$mode}) as f:\n    empty = b'' if 'b' in f.mode else ''\n    attempts = []\n    for op in (f.read, lambda: f.write(empty)):\n        try:\n            attempts.append(op())\n        except io.UnsupportedOperation as e:\n            attempts.append(f'UnsupportedOperation: {e}')\nattempts",
      cases: [
        { id: 'r',  label: "'r'",  values: { mode: 'r' } },
        { id: 'w',  label: "'w'",  values: { mode: 'w' } },
        { id: 'rb', label: "'rb'", values: { mode: 'rb' } },
        { id: 'ab', label: "'ab'", values: { mode: 'ab' } },
        { id: 'rp', label: "'r+'", values: { mode: 'r+' } },
      ],
    },
  ],
  demoExplainer: "In text mode the TextIOWrapper refuses with 'not readable' / 'not writable'; in binary mode the BufferedWriter or BufferedReader only names the method ('read', 'write'). A '+' mode allows both, so read() returns an empty result and write() returns 0. A mode open() rejects ('rw', 'q') raises ValueError before any of this, and 'x' fails with FileExistsError because the file exists.",

  patterns: [
    {
      name: 'Check instead of catching',
      desc: 'readable() / writable() answer without raising.',
      code: "if stream.writable():\n    stream.write(data)\nelse:\n    raise ValueError('stream is read-only')",
    },
    {
      name: 'Real file or in-memory stream?',
      desc: 'fileno() raises UnsupportedOperation when there is no descriptor.',
      code: "import io\ntry:\n    fd = stream.fileno()\nexcept io.UnsupportedOperation:\n    fd = None",
    },
  ],

  examples: [
    { title: 'Both an OSError and a ValueError', code: 'import io\n[c.__name__ for c in io.UnsupportedOperation.__mro__]', returns: "['UnsupportedOperation', 'OSError', 'ValueError', 'Exception', 'BaseException', 'object']" },
    { title: 'Writing to a read-only text file', code: "open('a.txt', 'w').close()\nwith open('a.txt') as f:\n    f.write('x')", returns: 'io.UnsupportedOperation: not writable' },
    { title: 'Binary files name the method',     code: "open('a.bin', 'wb').close()\nwith open('a.bin', 'rb') as f:\n    f.write(b'x')", returns: 'io.UnsupportedOperation: write' },
    { title: 'StringIO has no file descriptor',  code: 'import io\nio.StringIO().fileno()', returns: 'io.UnsupportedOperation: fileno' },
    { title: 'Caught by except OSError',         code: "open('a.txt', 'w').close()\nwith open('a.txt') as f:\n    try:\n        f.write('x')\n    except OSError as e:\n        result = str(e)\nresult", returns: "'not writable'" },
    { title: 'Its module is io',                 code: 'import io\nio.UnsupportedOperation.__module__', returns: "'io'" },
  ],

  pitfalls: [
    {
      name: 'Expecting it for every stream limitation',
      desc: 'StringIO.seek with a nonzero relative offset raises a plain OSError, not UnsupportedOperation. Catch OSError to cover both.',
      wrong: { label: 'except UnsupportedOperation', code: "import io\ntry:\n    io.StringIO('abc').seek(1, io.SEEK_CUR)\nexcept io.UnsupportedOperation:\n    result = 'caught'\nresult", output: "OSError: Can't do nonzero cur-relative seeks" },
      fix:   { label: 'except OSError',              code: "import io\ntry:\n    io.StringIO('abc').seek(1, io.SEEK_CUR)\nexcept OSError:\n    result = 'caught'\nresult", output: "'caught'" },
    },
    {
      name: 'Opening for reading, then writing',
      desc: "The default mode is 'r'. Pass the mode you need.",
      wrong: { label: "mode 'r'", code: "open('notes.txt', 'w').close()\nwith open('notes.txt', encoding='utf-8') as f:\n    f.write('todo')", output: 'io.UnsupportedOperation: not writable' },
      fix:   { label: "mode 'a'", code: "open('notes.txt', 'w').close()\nwith open('notes.txt', 'a', encoding='utf-8') as f:\n    n = f.write('todo')\nn", output: '4' },
    },
  ],

  when: {
    use: [
      'except io.UnsupportedOperation when probing optional stream features (fileno, seek, detach)',
      'Raising it from your own IOBase subclasses for operations they do not support',
    ],
    avoid: [
      'Catching it to paper over a wrong open() mode — fix the mode instead',
      'pathlib.UnsupportedOperation (3.13) is a different class, for path operations',
    ],
  },

  notes: {
    cpython:     'Defined in Modules/_io/_iomodule.c as a subclass of OSError and ValueError; Lib/io.py sets UnsupportedOperation.__module__ = "io"',
    'Messages':  "TextIOWrapper: 'not readable' / 'not writable'. Buffered classes: the method name ('read', 'write', 'detach'), or 'File or stream is not readable.' when built on an unreadable raw stream. FileIO: 'File not open for reading' / 'File not open for writing'. IOBase: 'seek', 'truncate', 'fileno'",
    'Why both bases': 'OSError because it is an I/O failure, ValueError because the call is invalid for this object; code written for either keeps working',
  },

  related: [
    { name: 'readable / writable / seekable', slug: 'readable-writable-seekable', when: 'Ask before you call' },
    { name: 'io.open',      slug: 'open',      when: 'The mode decides what is supported' },
    { name: 'IOBase',       slug: 'iobase',    when: 'The defaults that raise it' },
    { name: 'OSError',      slug: 'oserror',   when: 'One of its bases', category: 'exceptions' },
    { name: 'ValueError',   slug: 'valueerror', when: 'The other base', category: 'exceptions' },
    { name: 'pathlib.UnsupportedOperation', slug: 'unsupportedoperation', when: 'The unrelated pathlib exception (3.13)', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'What does "io.UnsupportedOperation: not writable" mean?',
      a: "The file was opened for reading only — open(path) defaults to mode 'r' — and then written to. Open it with 'w' (replace), 'a' (append) or 'r+' (read and update).",
    },
    {
      q: 'What does "io.UnsupportedOperation: fileno" mean?',
      a: 'Code asked an in-memory stream such as StringIO or BytesIO (or another object without an OS file) for its file descriptor. Functions that need a real descriptor — subprocess, os.fstat, select — need a real file; use a temporary file instead.',
    },
    {
      q: 'Should I catch UnsupportedOperation, OSError or ValueError?',
      a: 'io.UnsupportedOperation when you mean exactly "this stream cannot do that". OSError also catches it, together with real I/O errors such as FileNotFoundError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.UnsupportedOperation',
    meta:  'io.UnsupportedOperation',
  },
};
