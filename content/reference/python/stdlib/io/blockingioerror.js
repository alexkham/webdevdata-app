// content/reference/python/stdlib/io/blockingioerror.js

export const meta = {
  slug:        'blockingioerror',
  name:        'io.BlockingIOError',
  signature:   'io.BlockingIOError(errno, strerror, characters_written=0)',
  blurb:       'The built-in BlockingIOError under its io name: raised when a non-blocking stream cannot read or write right now. characters_written says how much of a write got through.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'blockingioerror io.BlockingIOError python non-blocking io EAGAIN EWOULDBLOCK resource temporarily unavailable characters_written buffered write would block socket pipe',
};

export const method = {
  slug:      'blockingioerror',
  name:      'io.BlockingIOError',
  signature: 'io.BlockingIOError(errno, strerror, characters_written=0)',

  category:    'io exception',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'io.BlockingIOError is the same class as the built-in BlockingIOError — the docs call it a compatibility alias. Buffered streams in non-blocking mode raise it instead of blocking; for a partial write, characters_written holds the number of bytes or characters that were accepted before the stream would have blocked.',

  covers: ['BlockingIOError'],

  chain: ['BaseException', 'Exception', 'OSError', 'BlockingIOError'],

  cheat: {
    raisedBy: 'Buffered reads and writes on non-blocking sockets and pipes; OSError(errno.EAGAIN, …) also becomes one',
    message:  '[Errno N] Resource temporarily unavailable (N = errno.EAGAIN, which can differ between systems)',
    quickFix: 'Retry when the stream is ready (selectors / asyncio), or keep the stream blocking',
    watchOut: 'characters_written exists only when it was set (third constructor argument)',
  },

  parameters: [
    { name: 'errno',              type: 'int', required: false, default: null, desc: 'Usually errno.EAGAIN or errno.EWOULDBLOCK.' },
    { name: 'strerror',           type: 'str', required: false, default: null, desc: 'The message text.' },
    { name: 'characters_written', type: 'int', required: false, default: null, desc: 'How much of a write succeeded before blocking.' },
  ],

  attributes: [
    { name: 'characters_written', type: 'int', meaning: 'Bytes (binary) or characters (text) written before the stream would block; AttributeError when never set.' },
    { name: 'errno / strerror',   type: 'int / str', meaning: 'As for any OSError.' },
  ],

  patterns: [
    {
      name: 'Retry a partial write',
      desc: 'Resend only what was not written.',
      code: "while data:\n    try:\n        n = stream.write(data)\n    except BlockingIOError as e:\n        n = e.characters_written\n        wait_until_writable(stream)\n    data = data[n:]",
    },
    {
      name: 'Prefer an event loop',
      desc: 'asyncio streams handle readiness for you.',
      code: "import asyncio\nasync def send(host, port, payload):\n    reader, writer = await asyncio.open_connection(host, port)\n    writer.write(payload)\n    await writer.drain()",
    },
  ],

  examples: [
    { title: 'The built-in class',            code: 'import io\nio.BlockingIOError is BlockingIOError', returns: 'True' },
    { title: 'An OSError subclass',           code: 'import io\n[c.__name__ for c in io.BlockingIOError.__mro__]', returns: "['BlockingIOError', 'OSError', 'Exception', 'BaseException', 'object']" },
    { title: 'OSError picks it by errno',     code: "import errno\n[type(OSError(e, 'x')).__name__ for e in (errno.EAGAIN, errno.EWOULDBLOCK, errno.EALREADY, errno.EINPROGRESS)]", returns: "['BlockingIOError', 'BlockingIOError', 'BlockingIOError', 'BlockingIOError']" },
    { title: 'characters_written',            code: "import errno\nBlockingIOError(errno.EAGAIN, 'would block', 5).characters_written", returns: '5' },
    { title: 'Missing unless set',            code: "import errno\nBlockingIOError(errno.EAGAIN, 'would block').characters_written", returns: 'AttributeError: characters_written' },
    { title: 'The usual message form',        code: "import errno\nstr(BlockingIOError(errno.EAGAIN, 'would block')) == f'[Errno {errno.EAGAIN}] would block'", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Reading characters_written without checking',
      desc: 'It is only present when the raiser set it. Use getattr with a default.',
      wrong: { label: 'e.characters_written', code: "import errno\ntry:\n    raise BlockingIOError(errno.EAGAIN, 'would block')\nexcept BlockingIOError as e:\n    written = e.characters_written\nwritten", output: 'AttributeError: characters_written' },
      fix:   { label: 'getattr(..., 0)',      code: "import errno\ntry:\n    raise BlockingIOError(errno.EAGAIN, 'would block')\nexcept BlockingIOError as e:\n    written = getattr(e, 'characters_written', 0)\nwritten", output: '0' },
    },
  ],

  when: {
    use: [
      'Handling partial writes on non-blocking buffered streams',
      'except BlockingIOError around reads of non-blocking sockets or pipes',
    ],
    avoid: [
      'Spinning in a retry loop → wait for readiness with selectors or use asyncio',
      'Ordinary files — they never block in this sense',
    ],
  },

  notes: {
    cpython:     'A built-in exception (Objects/exceptions.c); io re-exports it. OSError(errno, …) returns a BlockingIOError for EAGAIN, EALREADY, EWOULDBLOCK and EINPROGRESS',
    'Errno':     'errno.EAGAIN is 11 on Linux and on Windows CPython, but errno numbers are platform-specific — compare with errno.EAGAIN, never a literal',
    'Since 3.3': 'The built-in OSError subclasses, BlockingIOError among them, were added in 3.3 (docs); io.BlockingIOError has been this built-in class since then',
    'Raw vs buffered': 'Raw streams return None when no data is available; buffered streams raise BlockingIOError (docs)',
  },

  related: [
    { name: 'OSError',        slug: 'oserror',        when: 'Its base class', category: 'exceptions' },
    { name: 'BufferedWriter', slug: 'bufferedwriter', when: 'Raises it on partial non-blocking writes' },
    { name: 'BufferedIOBase', slug: 'bufferediobase', when: 'Raises instead of returning None' },
    { name: 'RawIOBase',      slug: 'rawiobase',      when: 'Returns None instead' },
  ],

  faq: [
    {
      q: 'What does "BlockingIOError: [Errno 11] Resource temporarily unavailable" mean?',
      a: 'A non-blocking socket, pipe or file had no data to read (or no room to write) at that moment. It is not a real failure: wait until the stream is ready — select/selectors, or asyncio — and try again. Errno 11 is EAGAIN on Linux; other systems may use another number for the same error.',
    },
    {
      q: 'Is io.BlockingIOError different from BlockingIOError?',
      a: 'No. io.BlockingIOError is BlockingIOError evaluates to True; the io name exists for compatibility.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.BlockingIOError',
    meta:  'io.BlockingIOError',
  },
};
