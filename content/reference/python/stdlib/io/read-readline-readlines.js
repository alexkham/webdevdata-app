// content/reference/python/stdlib/io/read-readline-readlines.js

export const meta = {
  slug:        'read-readline-readlines',
  name:        'StringIO / BytesIO read, readline, readlines',
  signature:   'f.read(size=-1)  ·  f.readline(size=-1)  ·  f.readlines(hint=-1)  ·  b.read1(size=-1)  ·  b.readinto(buffer)',
  blurb:       'Read from an in-memory stream: everything or size characters/bytes, one line, or a list of lines — and readinto() to fill a bytearray you already have.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'read readline readlines read1 readinto StringIO.read StringIO.readline BytesIO.read BytesIO.read1 BytesIO.readinto BytesIO.readline BytesIO.readlines python read line from string read n bytes readlines hint bytearray buffer eof empty string',
};

export const method = {
  slug:      'read-readline-readlines',
  name:      'StringIO / BytesIO read, readline, readlines',
  signature: 'f.read(size=-1)',
  returns:   { type: 'str | bytes | list | int', desc: 'read / read1 / readline return str (StringIO) or bytes (BytesIO); readlines a list of them; readinto the number of bytes copied.' },

  category:    'StringIO / BytesIO methods',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'All of them read from the current position and move it forward. At the end they return an empty str or bytes, never None and never an exception. readline() keeps the line ending; readlines(hint) stops once the lines read so far pass hint characters or bytes — and StringIO and BytesIO disagree about exactly when.',

  covers: ['StringIO.read', 'StringIO.readline', 'BytesIO.read', 'BytesIO.read1', 'BytesIO.readinto', 'BytesIO.readline', 'BytesIO.readlines'],

  cheat: {
    commonCall: 'f.read() · f.readline() · f.readlines()',
    returns:    "the text / bytes; '' or b'' at the end",
    replaces:   'slicing the original string by hand while tracking an index',
    watchOut:   'readlines(hint) counts characters or bytes, not lines',
  },

  parameters: [
    { name: 'size',   type: 'int | None', required: false, default: '-1', desc: 'read / read1: at most this many characters (StringIO) or bytes (BytesIO); negative or None reads to the end. readline: stop after this many even without a line ending.' },
    { name: 'hint',   type: 'int | None', required: false, default: '-1', desc: 'readlines: stop reading lines once their total size passes hint (0, negative or None: read all).' },
    { name: 'buffer', type: 'bytearray | writable memoryview', required: true, default: null, desc: 'readinto: filled from the current position; returns how many bytes it copied.' },
  ],

  modes: [
    {
      id: 'read',
      label: 'read(size)',
      blurb: 'read(n) takes n characters, read() takes the rest, and one more read() shows what end of file looks like.',
      params: [
        { name: 'text', type: 'str', hint: 'contents', input: 'text' },
        { name: 'n',    type: 'int', hint: 'size for the first read', input: 'number' },
      ],
      template: "import io\nf = io.StringIO({$text})\nfirst = f.read({$n})\n(first, f.tell(), f.read(), f.read())",
      cases: [
        { id: 'two',  label: 'read(2)',  values: { text: 'abcdef', n: '2' } },
        { id: 'neg',  label: 'read(-1)', values: { text: 'abcdef', n: '-1' } },
        { id: 'big',  label: 'past the end', values: { text: 'abc', n: '10' } },
      ],
    },
    {
      id: 'readline',
      label: 'readline(size)',
      blurb: 'Four readline() calls with the same size limit. Type \\n for a line break; -1 means no limit.',
      params: [
        { name: 'text', type: 'str', hint: 'text, \\n = new line', input: 'text' },
        { name: 'size', type: 'int', hint: 'limit per call',       input: 'number' },
      ],
      template: "import io\nf = io.StringIO({$text}.replace('\\\\n', '\\n'))\n[f.readline({$size}) for _ in range(4)]",
      cases: [
        { id: 'all',   label: 'no limit',     values: { text: 'one\\ntwo\\nthree', size: '-1' } },
        { id: 'short', label: 'limit 3',      values: { text: 'one\\ntwo\\nthree', size: '3' } },
        { id: 'zero',  label: 'limit 0',      values: { text: 'one\\ntwo', size: '0' } },
      ],
    },
    {
      id: 'hint',
      label: 'readlines(hint)',
      blurb: 'The same lines read with the same hint from a StringIO and from a BytesIO.',
      params: [
        { name: 'text', type: 'str', hint: 'text, \\n = new line', input: 'text' },
        { name: 'hint', type: 'int', hint: 'size hint',            input: 'number' },
      ],
      template: "import io\ntext = {$text}.replace('\\\\n', '\\n')\n(io.StringIO(text).readlines({$hint}), io.BytesIO(text.encode()).readlines({$hint}))",
      cases: [
        { id: 'exact', label: 'hint = one line', values: { text: 'ab\\ncd\\nef\\n', hint: '3' } },
        { id: 'less',  label: 'hint 2',          values: { text: 'ab\\ncd\\nef\\n', hint: '2' } },
        { id: 'none',  label: 'hint 0 = all',    values: { text: 'ab\\ncd\\nef\\n', hint: '0' } },
        { id: 'utf',   label: 'bytes vs chars',  values: { text: 'é\\nb\\n', hint: '2' } },
      ],
    },
    {
      id: 'readinto',
      label: 'readinto(bytearray)',
      blurb: 'Fill a bytearray of the given size from a BytesIO; the bytes that did not fit are still there for read().',
      params: [
        { name: 'text', type: 'str', hint: 'contents (as UTF-8)', input: 'text' },
        { name: 'size', type: 'int', hint: 'bytearray size',      input: 'number' },
      ],
      template: "import io\nb = io.BytesIO({$text}.encode())\nbuf = bytearray({$size})\nn = b.readinto(buf)\n(n, buf, b.read())",
      cases: [
        { id: 'part',  label: 'smaller buffer', values: { text: 'abcdef', size: '4' } },
        { id: 'large', label: 'larger buffer',  values: { text: 'abc', size: '5' } },
        { id: 'neg',   label: 'negative size',  values: { text: 'abc', size: '-1' } },
      ],
    },
  ],
  demoExplainer: "readline(3) on 'one\\ntwo\\nthree' returns 'one', then '\\n' on its own, then 'two': the limit cuts a line wherever it falls. With hint 3 StringIO returns ['ab\\n', 'cd\\n'] but BytesIO only [b'ab\\n']: IOBase.readlines (used by StringIO) stops when the total would pass the hint, BytesIO.readlines stops as soon as the total reaches it. In 'é\\nb\\n' the first line is 2 characters but 3 bytes. readinto() with a larger buffer copies what there is and leaves the rest of the bytearray as zero bytes.",

  patterns: [
    {
      name: 'Process a stream line by line',
      desc: 'Iteration calls readline() for you and stops at the end.',
      code: "import io\nfor line in io.StringIO(text):\n    handle(line.rstrip('\\n'))",
    },
    {
      name: 'Read fixed-size records',
      desc: 'read(n) returns fewer bytes (or b"") at the end; the walrus loop stops on b"".',
      code: "import io\nstream = io.BytesIO(data)\nwhile (record := stream.read(16)):\n    handle(record)",
    },
    {
      name: 'Reuse one buffer',
      desc: 'readinto avoids creating a new bytes object for every chunk.',
      code: "import io\nbuf = bytearray(4096)\nview = memoryview(buf)\nwhile (n := stream.readinto(buf)):\n    consume(view[:n])",
    },
  ],

  examples: [
    { title: 'read(n), then the rest',         code: "import io\nf = io.StringIO('abcdef')\n(f.read(2), f.read())", returns: "('ab', 'cdef')" },
    { title: 'End of file is an empty str',    code: "import io\nf = io.StringIO('x')\nf.read()\nf.read()", returns: "''" },
    { title: 'readline keeps the \\n',         code: "import io\nio.StringIO('a\\nb').readline()", returns: "'a\\n'" },
    { title: 'readline(size) can stop early',  code: "import io\nio.StringIO('abcdef\\n').readline(3)", returns: "'abc'" },
    { title: 'readlines on bytes',             code: "import io\nio.BytesIO(b'1\\n2\\n3').readlines()", returns: "[b'1\\n', b'2\\n', b'3']" },
    { title: 'The hint rule differs',          code: "import io\n(io.StringIO('ab\\ncd\\nef\\n').readlines(3), io.BytesIO(b'ab\\ncd\\nef\\n').readlines(3))", returns: "(['ab\\n', 'cd\\n'], [b'ab\\n'])" },
    { title: 'readinto a bytearray',           code: "import io\nb = io.BytesIO(b'abcdef')\nbuf = bytearray(4)\nn = b.readinto(buf)\n(n, buf)", returns: "(4, bytearray(b'abcd'))" },
    { title: 'read1 is read for BytesIO',      code: "import io\nio.BytesIO(b'abc').read1()", returns: "b'abc'" },
    { title: 'size must be an int or None',    code: "import io\nio.StringIO('abc').read(1.5)", returns: "TypeError: argument should be integer or None, not 'float'" },
  ],

  pitfalls: [
    {
      name: 'Using readlines(hint) as a line count',
      desc: 'The hint is a size in characters or bytes. To take the first n lines, slice the iterator.',
      wrong: { label: 'readlines(2)', code: "import io\nio.StringIO('one\\ntwo\\nthree\\n').readlines(2)", output: "['one\\n']" },
      fix:   { label: 'islice',       code: "import io\nfrom itertools import islice\nlist(islice(io.StringIO('one\\ntwo\\nthree\\n'), 2))", output: "['one\\n', 'two\\n']" },
    },
    {
      name: 'readinto() with bytes',
      desc: 'bytes are immutable, so they cannot be filled. Use a bytearray (or a writable memoryview).',
      wrong: { label: 'bytes',     code: "import io\nio.BytesIO(b'abc').readinto(b'xx')", output: 'TypeError: readinto() argument must be read-write bytes-like object, not bytes' },
      fix:   { label: 'bytearray', code: "import io\nbuf = bytearray(2)\nio.BytesIO(b'abc').readinto(buf)\nbuf", output: "bytearray(b'ab')" },
    },
    {
      name: 'Waiting for read() to return None at the end',
      desc: 'In-memory streams return an empty str or bytes at the end. A loop that checks "is None" never stops; check for emptiness.',
      wrong: { label: 'is None', code: "import io\nf = io.StringIO('ab')\nf.read(5)\nf.read(5) is None", output: 'False' },
      fix:   { label: 'empty',   code: "import io\nf = io.StringIO('ab')\nf.read(5)\nf.read(5) == ''", output: 'True' },
    },
  ],

  when: {
    use: [
      'read(): the whole remaining contents at once',
      'readline() or iteration: line-based parsing',
      'read(n) / readinto(): fixed-size binary records',
    ],
    avoid: [
      'Everything at once without moving the position → getvalue()',
      'Splitting text you already have → str.splitlines()',
    ],
  },

  notes: {
    cpython:      'StringIO.read/readline in Modules/_io/stringio.c; StringIO.readlines is the IOBase mixin in iobase.c. BytesIO.read/read1/readline/readlines/readinto in bytesio.c',
    'Hint rule':  'IOBase.readlines (StringIO) breaks once the total would exceed hint; BytesIO.readlines breaks once the total reaches hint — at exactly hint, StringIO reads one more line',
    'Line endings': "StringIO ends lines according to its newline setting; BytesIO only at b'\\n'",
  },

  related: [
    { name: 'StringIO',               slug: 'stringio',           when: 'newline= decides where lines end' },
    { name: 'BytesIO',                slug: 'bytesio',            when: 'The binary stream' },
    { name: 'seek / tell / truncate', slug: 'seek-tell-truncate', when: 'Move back to read again' },
    { name: 'getvalue / getbuffer',   slug: 'getvalue-getbuffer', when: 'Everything, ignoring the position' },
    { name: 'itertools.islice',       slug: 'islice',             when: 'The first n lines of a stream', category: 'stdlib/itertools' },
    { name: 'str.splitlines',         slug: 'str-splitlines',     when: 'Lines of a str you already have', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between read(), readline() and readlines()?',
      a: 'read() returns the rest of the stream (or size characters/bytes) as one str or bytes. readline() returns one line including its line ending. readlines() returns all remaining lines as a list. All three start at the current position and move it.',
    },
    {
      q: 'How do I know I reached the end of a StringIO?',
      a: "read() and readline() return '' (b'' for BytesIO). For line loops just iterate — `for line in f` stops by itself.",
    },
    {
      q: 'Does readline() remove the newline?',
      a: "No, the line ending is part of the returned line (except for a last line that has none). Use line.rstrip('\\n') or str.splitlines() to drop it.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.TextIOBase.read',
    meta:  'TextIOBase.read / BufferedIOBase.read',
  },

};
