// content/reference/python/stdlib/io/textiowrapper.js — io.TextIOWrapper

export const meta = {
  slug:        'textiowrapper',
  name:        'io.TextIOWrapper',
  signature:   'io.TextIOWrapper(buffer, encoding=None, errors=None, newline=None, line_buffering=False, write_through=False)',
  blurb:       'The text layer of every text-mode file: decodes bytes from a binary buffer into str, encodes on write, and translates line endings. reconfigure() changes the settings of an open stream.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'textiowrapper io.TextIOWrapper python decode binary stream as text bytes to text stream encoding newline universal newlines reconfigure line_buffering write_through sys.stdout reconfigure utf-8 detach buffer',
};

export const method = {
  slug:      'textiowrapper',
  name:      'io.TextIOWrapper',
  signature: 'io.TextIOWrapper(buffer, encoding=None, errors=None, newline=None, line_buffering=False, write_through=False)',
  returns:   { type: 'TextIOWrapper', desc: 'A text stream over buffer.' },

  category:    'io class',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "open() in text mode returns a TextIOWrapper, and so is sys.stdout. You can build one yourself over any binary stream — a BytesIO, a socket file, a subprocess pipe. Reading, newline=None turns \\r\\n and \\r into \\n; writing, '\\r' and '\\r\\n' replace every \\n, and newline=None writes os.linesep.",

  covers: ['TextIOWrapper'],

  cheat: {
    commonCall: "io.TextIOWrapper(binary_stream, encoding='utf-8')",
    returns:    'a text stream over the bytes',
    replaces:   'read() then .decode() and splitlines() by hand',
    watchOut:   'closing (or garbage-collecting) the wrapper closes the buffer too',
  },

  parameters: [
    { name: 'buffer',         type: 'BufferedIOBase', required: true,  default: null,    desc: 'The binary stream to read from / write to.' },
    { name: 'encoding',       type: 'str | None',     required: false, default: 'None',  desc: 'Codec name. None means locale.getencoding(); "locale" (3.10+) asks for it explicitly.' },
    { name: 'errors',         type: 'str | None',     required: false, default: 'None',  desc: "'strict' (what None means), 'ignore', 'replace', 'backslashreplace'; for writing also 'xmlcharrefreplace' and 'namereplace'." },
    { name: 'newline',        type: 'str | None',     required: false, default: 'None',  desc: "None, '', '\\n', '\\r' or '\\r\\n' — see the demo." },
    { name: 'line_buffering', type: 'bool',           required: false, default: 'False', desc: 'Flush whenever a write contains \\n or \\r.' },
    { name: 'write_through',  type: 'bool',           required: false, default: 'False', desc: 'Pass every write to the buffer immediately (3.3+).' },
  ],

  attributes: [
    { name: 'buffer',                     type: 'BufferedIOBase', meaning: 'The binary stream underneath.' },
    { name: 'encoding / errors / newlines', type: 'str / tuple',  meaning: 'Current settings; newlines lists the endings seen when reading in universal mode.' },
    { name: 'line_buffering / write_through', type: 'bool',      meaning: 'Current flushing behaviour (write_through attribute 3.7+).' },
    { name: 'reconfigure(*, encoding, errors, newline, line_buffering, write_through)', type: 'method', meaning: 'Change settings in place (3.7+). Flushes first; encoding and newline cannot change once data has been read.' },
    { name: 'tell() / seek(cookie)',      type: 'methods',        meaning: 'Positions are opaque cookies; seek accepts 0 or a value tell() returned.' },
    { name: 'detach()',                   type: 'method',         meaning: 'Flush and return the buffer; the wrapper becomes unusable.' },
  ],

  modes: [
    {
      id: 'read',
      label: 'reading newlines',
      blurb: 'The same bytes read with every newline setting. Type \\r and \\n for the control characters.',
      params: [{ name: 'text', type: 'str', hint: 'text with \\r and \\n', input: 'text' }],
      template: "import io\ndata = {$text}.replace('\\\\r', '\\r').replace('\\\\n', '\\n').encode()\n{nl: io.TextIOWrapper(io.BytesIO(data), encoding='utf-8', newline=nl).readlines() for nl in (None, '', '\\n', '\\r', '\\r\\n')}",
      cases: [
        { id: 'mixed', label: 'mixed endings', values: { text: 'a\\r\\nb\\rc\\nd' } },
        { id: 'crlf',  label: 'Windows file',  values: { text: 'one\\r\\ntwo\\r\\n' } },
      ],
    },
    {
      id: 'write',
      label: 'writing newlines',
      blurb: 'The same text written with each explicit newline setting; the result is the bytes that reached the buffer. (newline=None would write os.linesep, which depends on the OS.)',
      params: [{ name: 'text', type: 'str', hint: 'text, \\n = new line', input: 'text' }],
      template: "import io\ntext = {$text}.replace('\\\\n', '\\n')\nout = {}\nfor nl in ('', '\\n', '\\r', '\\r\\n'):\n    t = io.TextIOWrapper(io.BytesIO(), encoding='utf-8', newline=nl)\n    t.write(text)\n    t.flush()\n    out[nl] = t.buffer.getvalue()\nout",
      cases: [
        { id: 'two',  label: 'two lines', values: { text: 'one\\ntwo\\n' } },
        { id: 'utf',  label: 'non-ASCII', values: { text: 'é\\n' } },
      ],
    },
    {
      id: 'reconfigure',
      label: 'reconfigure()',
      blurb: "Write 'one\\n', switch newline with reconfigure(), write 'two\\n'. Type \\r\\n, \\r, \\n or leave it empty.",
      params: [{ name: 'newline', type: 'str', hint: 'new newline value', input: 'text' }],
      template: "import io\nt = io.TextIOWrapper(io.BytesIO(), encoding='utf-8', newline='')\nt.write('one\\n')\nt.reconfigure(newline={$newline}.replace('\\\\r', '\\r').replace('\\\\n', '\\n'))\nt.write('two\\n')\nt.flush()\nt.buffer.getvalue()",
      cases: [
        { id: 'crlf',  label: '\\r\\n', values: { newline: '\\r\\n' } },
        { id: 'cr',    label: '\\r',    values: { newline: '\\r' } },
        { id: 'bad',   label: 'invalid', values: { newline: 'x' } },
      ],
    },
  ],
  demoExplainer: "Reading, only newline=None changes the text; '' splits on all three endings but keeps them, and '\\r' or '\\r\\n' split only on that string. Writing, '' and '\\n' store \\n unchanged while '\\r\\n' turns 'one\\ntwo\\n' into b'one\\r\\ntwo\\r\\n'; 'é' is encoded to b'\\xc3\\xa9' first. reconfigure() affects only later writes, so the first line keeps its \\n: b'one\\ntwo\\r\\n'. An invalid value raises ValueError: illegal newline value: x.",

  patterns: [
    {
      name: 'Read a binary stream as text',
      desc: 'Typical for HTTP responses, zip members and subprocess pipes.',
      code: "import io, zipfile\nwith zipfile.ZipFile('data.zip') as z, z.open('data.csv') as raw:\n    for line in io.TextIOWrapper(raw, encoding='utf-8', newline=''):\n        handle(line)",
    },
    {
      name: 'Force UTF-8 output on the console',
      desc: 'sys.stdout is a TextIOWrapper; reconfigure() changes it in place (3.7+).',
      code: "import sys\nsys.stdout.reconfigure(encoding='utf-8', errors='backslashreplace')",
    },
    {
      name: 'Keep the buffer after the text layer is done',
      desc: 'detach() flushes and returns the buffer without closing it.',
      code: "import io\nbuf = io.BytesIO()\ntext = io.TextIOWrapper(buf, encoding='utf-8')\ntext.write(report)\ntext.detach()\npayload = buf.getvalue()",
    },
  ],

  examples: [
    { title: 'Bytes in, str out',              code: "import io\nio.TextIOWrapper(io.BytesIO('héllo\\n'.encode()), encoding='utf-8').read()", returns: "'héllo\\n'" },
    { title: 'Universal newlines when reading', code: "import io\nio.TextIOWrapper(io.BytesIO(b'a\\r\\nb\\rc\\n'), encoding='utf-8').readlines()", returns: "['a\\n', 'b\\n', 'c\\n']" },
    { title: "newline='' keeps the endings",   code: "import io\nio.TextIOWrapper(io.BytesIO(b'a\\r\\nb\\rc\\n'), encoding='utf-8', newline='').readlines()", returns: "['a\\r\\n', 'b\\r', 'c\\n']" },
    { title: 'Writes wait for flush()',        code: "import io\nb = io.BytesIO()\nt = io.TextIOWrapper(b, encoding='utf-8')\nt.write('hi')\nbefore = b.getvalue()\nt.flush()\n(before, b.getvalue())", returns: "(b'', b'hi')" },
    { title: 'reconfigure the encoding',       code: "import io\nt = io.TextIOWrapper(io.BytesIO(), encoding='utf-8')\nt.reconfigure(encoding='latin-1')\nt.encoding", returns: "'latin-1'" },
    { title: 'No newline change after reading', code: "import io\nt = io.TextIOWrapper(io.BytesIO(b'abc'), encoding='utf-8')\nt.read(1)\nt.reconfigure(newline='')", returns: 'io.UnsupportedOperation: It is not possible to set the encoding or newline of stream after the first read' },
    { title: 'errors=replace',                 code: "import io\nio.TextIOWrapper(io.BytesIO(b'caf\\xe9'), encoding='utf-8', errors='replace').read() == 'caf\\ufffd'", returns: 'True' },
    { title: 'Strict decoding fails loudly',   code: "import io\nio.TextIOWrapper(io.BytesIO(b'caf\\xe9'), encoding='utf-8').read()", returns: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 3: unexpected end of data" },
  ],

  pitfalls: [
    {
      name: 'The wrapper closes your buffer',
      desc: 'Closing a TextIOWrapper (or leaving its with block) closes the buffer as well. detach() it to keep the buffer usable.',
      wrong: { label: 'with block', code: "import io\nbuf = io.BytesIO()\nwith io.TextIOWrapper(buf, encoding='utf-8') as t:\n    t.write('data')\nbuf.getvalue()", output: 'ValueError: I/O operation on closed file.' },
      fix:   { label: 'detach()',   code: "import io\nbuf = io.BytesIO()\nt = io.TextIOWrapper(buf, encoding='utf-8')\nt.write('data')\nt.detach()\nbuf.getvalue()", output: "b'data'" },
    },
    {
      name: 'Decoding with the wrong encoding',
      desc: 'A wrong single-byte encoding never raises — it silently produces mojibake. Name the encoding the bytes were written in.',
      wrong: { label: 'latin-1', code: "import io\nio.TextIOWrapper(io.BytesIO('é'.encode('utf-8')), encoding='latin-1').read()", output: "'Ã©'" },
      fix:   { label: 'utf-8',   code: "import io\nio.TextIOWrapper(io.BytesIO('é'.encode('utf-8')), encoding='utf-8').read()", output: "'é'" },
    },
  ],

  when: {
    use: [
      'Reading or writing text over a binary stream you already have',
      'Changing sys.stdout / sys.stderr encoding or buffering (reconfigure)',
      'Explicit newline control when producing files for other platforms',
    ],
    avoid: [
      'Opening files → open(path, encoding=...) builds the TextIOWrapper for you',
      'Text that is already a str in memory → io.StringIO',
    ],
  },

  notes: {
    cpython:          'Modules/_io/textio.c. Reading decodes in chunks through an IncrementalNewlineDecoder (universal modes); tell() returns a cookie that packs the byte position and decoder state',
    'Default encoding': 'locale.getencoding() unless UTF-8 Mode is on — cp1252 or similar on many Windows systems, UTF-8 on most Linux and macOS. Pass encoding explicitly; PEP 686 makes UTF-8 Mode the default in Python 3.15 (docs)',
    'Writing':        "newline=None writes os.linesep ('\\r\\n' on Windows, '\\n' elsewhere); '' and '\\n' never translate",
    'History':        'write_through argument 3.3; reconfigure() and the write_through attribute 3.7; encoding="locale" 3.10 (reconfigure: 3.11)',
  },

  related: [
    { name: 'TextIOBase',  slug: 'textiobase', when: 'The text stream interface' },
    { name: 'StringIO',    slug: 'stringio',   when: 'Text in memory, no bytes underneath' },
    { name: 'IncrementalNewlineDecoder', slug: 'incrementalnewlinedecoder', when: 'The universal-newline decoder it uses' },
    { name: 'text_encoding', slug: 'text_encoding', when: 'What encoding=None resolves to' },
    { name: 'sys.stdout',  slug: 'stdout',     when: 'A TextIOWrapper you can reconfigure', category: 'stdlib/sys' },
    { name: 'open()',      slug: 'open',       when: 'Builds one for text modes', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I read a binary stream as text in Python?',
      a: "Wrap it: io.TextIOWrapper(binary_stream, encoding='utf-8'). The wrapper decodes as you read, supports readline() and iteration, and handles \\r\\n line endings. Remember that closing the wrapper closes the binary stream too.",
    },
    {
      q: 'How do I change the encoding of sys.stdout?',
      a: "sys.stdout.reconfigure(encoding='utf-8') (Python 3.7+). It flushes and switches the encoder in place. Alternatively run Python with -X utf8 or set PYTHONIOENCODING=utf-8.",
    },
    {
      q: "Why does my file get \\r\\n line endings on Windows?",
      a: "Text mode with the default newline=None translates every \\n you write to os.linesep, which is \\r\\n on Windows. Pass newline='\\n' (or '') to write \\n unchanged.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.TextIOWrapper',
    meta:  'io.TextIOWrapper',
  },

};
