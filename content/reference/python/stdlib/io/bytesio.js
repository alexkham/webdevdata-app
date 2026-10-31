// content/reference/python/stdlib/io/bytesio.js — io.BytesIO

export const meta = {
  slug:        'bytesio',
  name:        'io.BytesIO',
  signature:   "io.BytesIO(initial_bytes=b'')",
  blurb:       'An in-memory binary file: a bytes buffer with read, write, seek, tell and getvalue — for any code that wants a file opened in binary mode.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytesio io.BytesIO python bytes as file in-memory binary file file-like object binary buffer initial_bytes bytes stream image in memory zip in memory bytes-like object',
};

export const method = {
  slug:      'bytesio',
  name:      'io.BytesIO',
  signature: "io.BytesIO(initial_bytes=b'')",
  returns:   { type: 'BytesIO', desc: 'A binary stream positioned at 0, holding a copy of initial_bytes.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'BytesIO is to bytes what StringIO is to str: no encoding, no newline translation, positions count bytes. It starts at position 0, so writes overwrite initial_bytes, and getbuffer() gives a zero-copy view you can edit in place.',

  covers: ['BytesIO'],

  cheat: {
    commonCall: "buf = io.BytesIO(data)",
    returns:    'a binary stream at position 0',
    replaces:   'temporary files for zip, image and PDF libraries',
    watchOut:   'write() needs bytes — str raises TypeError',
  },

  parameters: [
    { name: 'initial_bytes', type: 'bytes-like | None', required: false, default: "b''", desc: 'Starting contents (bytes, bytearray, memoryview …). The stream works on its own copy; changing a bytearray afterwards does not change the stream.' },
  ],

  attributes: [
    { name: 'closed',          type: 'bool',   meaning: 'True after close(), which frees the buffer.' },
    { name: 'getvalue()',      type: 'method', meaning: 'All contents as bytes, independent of the position.' },
    { name: 'getbuffer()',     type: 'method', meaning: 'A writable memoryview of the contents; while it exists the stream cannot grow, shrink or close.' },
    { name: 'read1(size=-1)',  type: 'method', meaning: 'Same as read() for a BytesIO.' },
  ],

  modes: [
    {
      id: 'count',
      label: 'bytes vs characters',
      blurb: 'Encode some text as UTF-8 and write it. write() returns a byte count, which differs from len() as soon as the text is not ASCII.',
      params: [{ name: 'text', type: 'str', hint: 'text to encode', input: 'text' }],
      template: "import io\nb = io.BytesIO()\nn = b.write({$text}.encode())\n(n, len({$text}), b.getvalue())",
      cases: [
        { id: 'ascii', label: 'ASCII',     values: { text: 'data' } },
        { id: 'greek', label: 'Greek',     values: { text: 'αβγ' } },
        { id: 'mixed', label: 'emoji',     values: { text: 'hi 🙂' } },
      ],
    },
    {
      id: 'overwrite',
      label: 'initial bytes',
      blurb: 'Start from some bytes and write more. Like StringIO, the write begins at position 0.',
      params: [
        { name: 'init', type: 'str', hint: 'initial bytes (as text)', input: 'text' },
        { name: 'text', type: 'str', hint: 'then write',              input: 'text' },
      ],
      template: "import io\nb = io.BytesIO({$init}.encode())\nb.write({$text}.encode())\n(b.getvalue(), b.tell())",
      cases: [
        { id: 'jello', label: 'hello + J',    values: { init: 'hello', text: 'J' } },
        { id: 'utf',   label: 'half a char',  values: { init: 'é!', text: 'x' } },
      ],
    },
  ],
  demoExplainer: "'αβγ' is 3 characters and 6 bytes; the emoji takes 4 bytes on its own. In the second tab writing b'x' over the UTF-8 bytes of 'é!' replaces only the first of é's two bytes, leaving b'x\\xa9!' — no longer valid UTF-8. BytesIO never knows or cares what the bytes mean.",

  patterns: [
    {
      name: 'Zip archive in memory',
      desc: 'zipfile writes to any seekable binary stream.',
      code: "import io, zipfile\nbuf = io.BytesIO()\nwith zipfile.ZipFile(buf, 'w') as z:\n    z.writestr('report.csv', csv_text)\narchive = buf.getvalue()",
    },
    {
      name: 'Read uploaded bytes with a file-based API',
      desc: 'Wrap bytes you already have; most binary readers accept the stream directly.',
      code: "import io\nfrom PIL import Image\nimage = Image.open(io.BytesIO(upload_bytes))",
    },
    {
      name: 'Text layer on top of bytes',
      desc: 'TextIOWrapper decodes a binary stream as text.',
      code: "import io\ntext = io.TextIOWrapper(io.BytesIO(raw), encoding='utf-8')\nfor line in text:\n    handle(line)",
    },
  ],

  examples: [
    { title: 'A binary file from bytes',      code: "import io\nb = io.BytesIO(b'GIF89a...')\nb.read(6)", returns: "b'GIF89a'" },
    { title: 'Write, then take everything',   code: "import io\nb = io.BytesIO()\nb.write(b'abc')\nb.write(b'def')\nb.getvalue()", returns: "b'abcdef'" },
    { title: 'Positions count bytes',         code: "import io\nb = io.BytesIO('é'.encode())\nb.seek(0, io.SEEK_END)", returns: '2' },
    { title: 'A copy of a bytearray',         code: "import io\ndata = bytearray(b'abc')\nb = io.BytesIO(data)\ndata[0] = 120\nb.getvalue()", returns: "b'abc'" },
    { title: 'Lines end at b"\\n" only',      code: "import io\nio.BytesIO(b'a\\r\\nb\\rc\\n').readlines()", returns: "[b'a\\r\\n', b'b\\rc\\n']" },
    { title: 'It is a BufferedIOBase',        code: 'import io\nisinstance(io.BytesIO(), io.BufferedIOBase)', returns: 'True' },
    { title: 'str is refused',                code: "import io\nio.BytesIO('text')", returns: "TypeError: a bytes-like object is required, not 'str'" },
  ],

  pitfalls: [
    {
      name: 'Passing a str',
      desc: 'BytesIO only takes bytes-like objects. Encode text first — or use StringIO if the consumer reads text.',
      wrong: { label: "BytesIO('text')",          code: "import io\nio.BytesIO('héllo').read()", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "BytesIO(text.encode())", code: "import io\nio.BytesIO('héllo'.encode('utf-8')).read()", output: "b'h\\xc3\\xa9llo'" },
    },
    {
      name: 'Handing over a stream that is at the end',
      desc: 'After writing, the position is at the end: a library that calls read() gets nothing. Rewind with seek(0) before passing the stream on.',
      wrong: { label: 'pass as is',  code: "import io\nb = io.BytesIO()\nb.write(b'payload')\nb.read()", output: "b''" },
      fix:   { label: 'seek(0)',     code: "import io\nb = io.BytesIO()\nb.write(b'payload')\nb.seek(0)\nb.read()", output: "b'payload'" },
    },
  ],

  when: {
    use: [
      'Libraries that read or write binary files (zipfile, PIL, pandas, requests uploads)',
      'Building binary payloads piece by piece',
      'Tests for binary parsers and writers',
    ],
    avoid: [
      'Text → io.StringIO, or TextIOWrapper over a BytesIO when you need a real encoding',
      'Gigabytes of data → a real file or tempfile.SpooledTemporaryFile',
      'Just joining byte strings → b"".join(parts)',
    ],
  },

  notes: {
    cpython:          'Modules/_io/bytesio.c. A bytes object passed as initial_bytes is shared until the first write (copy-on-write), so creating a BytesIO from bytes is cheap',
    'Closed message': '"I/O operation on closed file." — with a period, unlike StringIO',
    'Lines':          'readline() and iteration split at b"\\n" only; there is no newline argument',
  },

  related: [
    { name: 'StringIO',                slug: 'stringio',                 when: 'The text version' },
    { name: 'getvalue / getbuffer',    slug: 'getvalue-getbuffer',       when: 'Copy or zero-copy view of the contents' },
    { name: 'write / writelines',      slug: 'write-writelines',         when: 'What write() accepts and returns' },
    { name: 'BufferedIOBase',          slug: 'bufferediobase',           when: 'The interface BytesIO implements' },
    { name: 'bytes',                   slug: 'bytes',                    when: 'What read() and getvalue() return', category: 'functions' },
    { name: 'memoryview',              slug: 'memoryview',               when: 'What getbuffer() returns', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I create a file-like object from bytes in Python?',
      a: 'io.BytesIO(data). It behaves like a file opened in "rb+" mode: read(), seek(), tell() and write() all work, and getvalue() returns the complete contents.',
    },
    {
      q: 'What is the difference between getvalue() and read() on BytesIO?',
      a: 'read() returns bytes from the current position to the end and moves the position. getvalue() always returns the entire buffer and does not touch the position.',
    },
    {
      q: 'Can BytesIO hold text?',
      a: "Only as encoded bytes: write(text.encode('utf-8')). If the consumer expects text, use io.StringIO, or wrap the BytesIO in io.TextIOWrapper(buf, encoding='utf-8').",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.BytesIO',
    meta:  'io.BytesIO',
  },

};
