// content/reference/python/stdlib/io/close-closed.js

export const meta = {
  slug:        'close-closed',
  name:        'StringIO / BytesIO close, closed, flush',
  signature:   'f.close()  ·  f.closed  ·  b.flush()',
  blurb:       'close() discards the buffer of a StringIO or BytesIO; closed tells whether that happened. A with block calls close() for you. flush() does nothing on in-memory streams.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'close closed flush StringIO.close StringIO.closed BytesIO.close BytesIO.closed BytesIO.flush python I/O operation on closed file ValueError with statement stringio context manager getvalue after close',
};

export const method = {
  slug:      'close-closed',
  name:      'StringIO / BytesIO close, closed, flush',
  signature: 'f.close()',
  returns:   { type: 'None | bool', desc: 'close() and flush() return None; closed is a bool attribute.' },

  category:    'StringIO / BytesIO methods',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'After close() the contents are gone: getvalue(), read(), write(), tell() and the capability checks raise ValueError, while close() itself can be called again harmlessly. StringIO and BytesIO even word the error differently — only BytesIO ends it with a period.',

  covers: ['StringIO.close', 'StringIO.closed', 'BytesIO.close', 'BytesIO.closed', 'BytesIO.flush'],

  cheat: {
    commonCall: 'with io.StringIO() as f: ...',
    returns:    'closed is True after the block',
    replaces:   'calling close() by hand in a finally',
    watchOut:   'take getvalue() inside the with block',
  },

  parameters: [],

  modes: [
    {
      id: 'with',
      label: 'with block',
      blurb: 'Write inside a with block, read the value inside, check closed after.',
      params: [{ name: 'text', type: 'str', hint: 'text to write', input: 'text' }],
      template: "import io\nwith io.StringIO() as f:\n    f.write({$text})\n    inside = (f.closed, f.getvalue())\n(inside, f.closed)",
      cases: [
        { id: 'log',   label: 'a log line', values: { text: 'started' } },
        { id: 'empty', label: 'nothing',    values: { text: '' } },
      ],
    },
    {
      id: 'text',
      label: 'StringIO after close',
      blurb: 'Close a StringIO, then call each named method with no arguments and record what happens.',
      params: [
        { name: 'text',    type: 'str',       hint: 'contents',                 input: 'text' },
        { name: 'methods', type: 'list[str]', hint: 'method names, comma-separated', input: 'csv' },
      ],
      template: "import io\nf = io.StringIO({$text})\nf.close()\nresults = {}\nfor name in {$methods}:\n    try:\n        results[name] = getattr(f, name)()\n    except Exception as e:\n        results[name] = f'{type(e).__name__}: {e}'\nresults",
      cases: [
        { id: 'common', label: 'common calls', values: { text: 'data', methods: 'getvalue, read, readlines, close, flush' } },
        { id: 'checks', label: 'checks',       values: { text: 'data', methods: 'readable, isatty, fileno' } },
      ],
    },
    {
      id: 'bytes',
      label: 'BytesIO after close',
      blurb: 'The same for a BytesIO — compare the messages with the StringIO tab.',
      params: [
        { name: 'text',    type: 'str',       hint: 'contents (as UTF-8)',      input: 'text' },
        { name: 'methods', type: 'list[str]', hint: 'method names, comma-separated', input: 'csv' },
      ],
      template: "import io\nf = io.BytesIO({$text}.encode())\nf.close()\nresults = {}\nfor name in {$methods}:\n    try:\n        results[name] = getattr(f, name)()\n    except Exception as e:\n        results[name] = f'{type(e).__name__}: {e}'\nresults",
      cases: [
        { id: 'common', label: 'common calls', values: { text: 'data', methods: 'getvalue, read, readlines, close, flush' } },
        { id: 'buffer', label: 'getbuffer',    values: { text: 'data', methods: 'getbuffer, seekable, write' } },
      ],
    },
  ],
  demoExplainer: "Inside the block closed is False and getvalue() works; after it closed is True. In the StringIO tab getvalue and read say 'I/O operation on closed file' while readlines says 'I/O operation on closed file.' — readlines is inherited from IOBase, which adds the period; BytesIO adds it everywhere. close() returns None every time, flush() is a no-op on a closed StringIO but raises on a closed BytesIO, and fileno() raises UnsupportedOperation whether or not the stream is open: there is no file descriptor.",

  patterns: [
    {
      name: 'Scope the buffer',
      desc: 'Take the value before the block ends.',
      code: "import io\nwith io.StringIO() as buf:\n    render(buf)\n    html = buf.getvalue()",
    },
    {
      name: 'Check before use',
      desc: 'closed is a plain attribute that never raises.',
      code: "if not stream.closed:\n    stream.write(data)",
    },
    {
      name: 'Close several streams',
      desc: 'contextlib.ExitStack closes all of them, newest first.',
      code: "import io\nfrom contextlib import ExitStack\nwith ExitStack() as stack:\n    parts = [stack.enter_context(io.StringIO()) for _ in range(3)]",
    },
  ],

  examples: [
    { title: 'closed after with',              code: "import io\nwith io.StringIO('x') as f:\n    pass\nf.closed", returns: 'True' },
    { title: 'StringIO: no period',            code: "import io\nf = io.StringIO('x')\nf.close()\nf.read()", returns: 'ValueError: I/O operation on closed file' },
    { title: 'BytesIO: with a period',         code: "import io\nb = io.BytesIO(b'x')\nb.close()\nb.read()", returns: 'ValueError: I/O operation on closed file.' },
    { title: 'Closing twice is fine',          code: "import io\nf = io.StringIO()\nf.close()\nf.close()\nf.closed", returns: 'True' },
    { title: 'flush() is a no-op while open',  code: "import io\nio.BytesIO(b'x').flush() is None", returns: 'True' },
    { title: 'A closed BytesIO refuses flush()', code: "import io\nb = io.BytesIO()\nb.close()\nb.flush()", returns: 'ValueError: I/O operation on closed file.' },
    { title: 'Cannot close while a view exists', code: "import io\nb = io.BytesIO(b'abc')\nview = b.getbuffer()\nb.close()", returns: 'BufferError: Existing exports of data: object cannot be re-sized' },
  ],

  pitfalls: [
    {
      name: 'Returning getvalue() after the with block',
      desc: 'The with block closes the buffer on exit, and a closed buffer has no contents.',
      wrong: { label: 'after',  code: "import io\ndef render():\n    with io.StringIO() as f:\n        f.write('<p>hi</p>')\n    return f.getvalue()\nrender()", output: 'ValueError: I/O operation on closed file' },
      fix:   { label: 'inside', code: "import io\ndef render():\n    with io.StringIO() as f:\n        f.write('<p>hi</p>')\n        return f.getvalue()\nrender()", output: "'<p>hi</p>'" },
    },
    {
      name: 'Re-entering a closed stream',
      desc: 'A stream is a one-shot context manager; create a new one instead of reusing it.',
      wrong: { label: 'with f again', code: "import io\nf = io.StringIO()\nwith f:\n    pass\nwith f:\n    pass", output: 'ValueError: I/O operation on closed file.' },
      fix:   { label: 'new object',   code: "import io\nfor _ in range(2):\n    with io.StringIO() as f:\n        f.write('x')\nf.closed", output: 'True' },
    },
  ],

  when: {
    use: [
      'with io.StringIO() as f: for buffers with a clear lifetime',
      'closed: to test a stream before using it',
    ],
    avoid: [
      'Closing a stream someone else owns (e.g. one passed to your function)',
      'Calling flush() on StringIO / BytesIO for safety — there is nothing to flush',
    ],
  },

  notes: {
    cpython:    'StringIO.close (stringio.c) frees the buffer and sets its own flag; it does not set the IOBase flag, which is why the inherited flush() still returns None on a closed StringIO. BytesIO.close (bytesio.c) frees the buffer unless a getbuffer() view exists',
    'Messages': 'StringIO: "I/O operation on closed file"; BytesIO and the IOBase mixins (readlines, writelines, isatty, iteration, entering a with block): "I/O operation on closed file."',
    'GC':       'IOBase.__del__ calls close(), so an unreferenced stream is closed when it is garbage collected',
  },

  related: [
    { name: 'getvalue / getbuffer', slug: 'getvalue-getbuffer', when: 'Take the value before closing' },
    { name: 'IOBase',               slug: 'iobase',             when: 'close / closed / __enter__ for every stream' },
    { name: 'UnsupportedOperation', slug: 'unsupportedoperation', when: 'What fileno() raises here' },
    { name: 'with',                 slug: 'with',               when: 'Calls close() on exit', category: 'keywords' },
    { name: 'ExitStack',            slug: 'exitstack',          when: 'Close a dynamic number of streams', category: 'stdlib/contextlib' },
  ],

  faq: [
    {
      q: 'What does "ValueError: I/O operation on closed file" mean?',
      a: 'Something used a file or stream after close() — most often a getvalue() or read() placed after the with block that owned it. Move the call into the block, or keep the stream open longer.',
    },
    {
      q: 'Do I need to close a StringIO?',
      a: 'Not strictly: it holds only memory, which is freed when the object is garbage collected (IOBase.__del__ calls close()). Closing early frees the buffer sooner; a with block makes the lifetime explicit.',
    },
    {
      q: 'Why does BytesIO.close() raise BufferError?',
      a: 'A memoryview from getbuffer() is still alive. Release it (view.release() or a with block) before closing.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.IOBase.close',
    meta:  'IOBase.close / closed / flush',
  },

};
