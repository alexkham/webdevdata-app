// content/reference/python/stdlib/io/seek-tell-truncate.js

export const meta = {
  slug:        'seek-tell-truncate',
  name:        'StringIO / BytesIO seek, tell, truncate',
  signature:   'f.seek(offset, whence=io.SEEK_SET)  ·  f.tell()  ·  f.truncate(size=None)',
  blurb:       'Move the position of an in-memory stream, ask where it is, or cut the contents short. BytesIO seeks relative to anywhere; StringIO only to absolute positions.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: "seek tell truncate StringIO.seek StringIO.tell StringIO.truncate BytesIO.seek BytesIO.tell BytesIO.truncate python rewind stream seek(0) whence SEEK_END SEEK_CUR can't do nonzero cur-relative seeks negative seek position clear stringio position",
};

export const method = {
  slug:      'seek-tell-truncate',
  name:      'StringIO / BytesIO seek, tell, truncate',
  signature: 'f.seek(offset, whence=io.SEEK_SET)',
  returns:   { type: 'int', desc: 'seek: the new absolute position · tell: the current position · truncate: the new size.' },

  category:    'StringIO / BytesIO methods',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'seek(0) rewinds, seek(0, io.SEEK_END) goes to the end. BytesIO also accepts offsets relative to the current position or the end and clamps anything before the start to 0; StringIO accepts only offset 0 with those, like any text stream. truncate() cuts at the current position (or at size) and never moves the position.',

  covers: ['StringIO.seek', 'StringIO.tell', 'StringIO.truncate', 'BytesIO.seek', 'BytesIO.tell', 'BytesIO.truncate'],

  cheat: {
    commonCall: 'f.seek(0)',
    returns:    'the new position',
    replaces:   'creating a new stream to read from the start',
    watchOut:   "StringIO: seek(-2, io.SEEK_END) raises OSError",
  },

  parameters: [
    { name: 'offset', type: 'int',        required: true,  default: null,   desc: 'Target position (whence 0) or distance from the current position (1) or the end (2). Negative with whence 0 raises ValueError.' },
    { name: 'whence', type: 'int',        required: false, default: '0',    desc: 'io.SEEK_SET (0), io.SEEK_CUR (1) or io.SEEK_END (2); anything else raises ValueError.' },
    { name: 'size',   type: 'int | None', required: false, default: 'None', desc: 'truncate: the new maximum size; None means the current position. A size beyond the end changes nothing.' },
  ],

  modes: [
    {
      id: 'bytes',
      label: 'BytesIO.seek',
      blurb: 'Seek in a BytesIO, then read what is left. Try negative offsets with whence 1 and 2.',
      params: [
        { name: 'text',   type: 'str', hint: 'contents (as UTF-8)', input: 'text' },
        { name: 'offset', type: 'int', hint: 'offset',              input: 'number' },
        { name: 'whence', type: 'int', hint: '0, 1 or 2',           input: 'number' },
      ],
      template: "import io\nb = io.BytesIO({$text}.encode())\npos = b.seek({$offset}, {$whence})\n(pos, b.read())",
      cases: [
        { id: 'start', label: 'seek(2)',     values: { text: 'abcdef', offset: '2', whence: '0' } },
        { id: 'end',   label: 'last two',    values: { text: 'abcdef', offset: '-2', whence: '2' } },
        { id: 'clamp', label: 'before start', values: { text: 'abc', offset: '-10', whence: '1' } },
        { id: 'neg',   label: 'negative, whence 0', values: { text: 'abc', offset: '-1', whence: '0' } },
      ],
    },
    {
      id: 'text',
      label: 'StringIO.seek',
      blurb: 'The same with a StringIO: whence 1 and 2 only accept offset 0.',
      params: [
        { name: 'text',   type: 'str', hint: 'contents',  input: 'text' },
        { name: 'offset', type: 'int', hint: 'offset',    input: 'number' },
        { name: 'whence', type: 'int', hint: '0, 1 or 2', input: 'number' },
      ],
      template: "import io\nf = io.StringIO({$text})\npos = f.seek({$offset}, {$whence})\n(pos, f.read())",
      cases: [
        { id: 'start',  label: 'seek(2)',          values: { text: 'abcdef', offset: '2', whence: '0' } },
        { id: 'end0',   label: 'seek(0, 2)',       values: { text: 'abcdef', offset: '0', whence: '2' } },
        { id: 'endneg', label: 'seek(-2, 2)',      values: { text: 'abcdef', offset: '-2', whence: '2' } },
        { id: 'badwh',  label: 'whence 3',         values: { text: 'abc', offset: '0', whence: '3' } },
      ],
    },
    {
      id: 'truncate',
      label: 'truncate',
      blurb: 'Seek, then truncate. Leave size empty for truncate() at the current position.',
      params: [
        { name: 'text', type: 'str',        hint: 'contents',              input: 'text' },
        { name: 'pos',  type: 'int',        hint: 'seek to first',         input: 'number' },
        { name: 'size', type: 'int | None', hint: 'size (empty = None)',   input: 'number-or-none' },
      ],
      template: "import io\nf = io.StringIO({$text})\nf.seek({$pos})\nn = f.truncate({$size})\n(n, f.tell(), f.getvalue())",
      cases: [
        { id: 'here',  label: 'truncate()',      values: { text: 'abcdef', pos: '3', size: '' } },
        { id: 'size',  label: 'truncate(1)',     values: { text: 'abcdef', pos: '4', size: '1' } },
        { id: 'grow',  label: 'size past the end', values: { text: 'ab', pos: '0', size: '10' } },
      ],
    },
  ],
  demoExplainer: "BytesIO.seek(-10, 1) from position 0 returns 0: a target before the start is clamped. With whence 0 a negative offset is an error instead (ValueError: negative seek value -1). StringIO.seek(-2, 2) raises OSError: Can't do nonzero cur-relative seeks — the message says cur-relative even for whence 2. truncate(1) after seek(4) leaves the position at 4, beyond the new end, and truncate(10) on 'ab' returns 10 but keeps 'ab'.",

  patterns: [
    {
      name: 'Rewind before handing a stream on',
      desc: 'After writing, the position is at the end.',
      code: "import io\nbuf = io.BytesIO()\nwrite_report(buf)\nbuf.seek(0)\nupload(buf)",
    },
    {
      name: 'Size of a stream',
      desc: 'seek(0, io.SEEK_END) returns the size; remember the position to restore it.',
      code: "import io\npos = stream.tell()\nsize = stream.seek(0, io.SEEK_END)\nstream.seek(pos)",
    },
    {
      name: 'Reuse a buffer',
      desc: 'Rewind, then truncate at the start.',
      code: 'buf.seek(0)\nbuf.truncate()',
    },
  ],

  examples: [
    { title: 'seek returns the new position',   code: "import io\nio.BytesIO(b'abcdef').seek(2)", returns: '2' },
    { title: 'From the end (BytesIO)',          code: "import io\nb = io.BytesIO(b'abcdef')\nb.seek(-2, io.SEEK_END)\nb.read()", returns: "b'ef'" },
    { title: 'From the current position',       code: "import io\nb = io.BytesIO(b'abcdef')\nb.read(2)\nb.seek(1, io.SEEK_CUR)", returns: '3' },
    { title: 'Before the start clamps to 0',    code: "import io\nio.BytesIO(b'abc').seek(-10, io.SEEK_END)", returns: '0' },
    { title: 'tell: characters vs bytes',       code: "import io\ns = io.StringIO('é')\nb = io.BytesIO('é'.encode())\ns.read()\nb.read()\n(s.tell(), b.tell())", returns: '(1, 2)' },
    { title: 'truncate keeps the position',     code: "import io\nf = io.StringIO('abcdef')\nf.read()\nf.truncate(2)\n(f.tell(), f.getvalue())", returns: "(6, 'ab')" },
    { title: 'truncate never extends',          code: "import io\nf = io.StringIO('ab')\n(f.truncate(5), f.getvalue())", returns: "(5, 'ab')" },
    { title: 'StringIO: no relative offsets',   code: "import io\nio.StringIO('abc').seek(1, io.SEEK_CUR)", returns: "OSError: Can't do nonzero cur-relative seeks" },
    { title: 'Negative absolute position',      code: "import io\nio.StringIO('abc').seek(-1)", returns: 'ValueError: Negative seek position -1' },
  ],

  pitfalls: [
    {
      name: 'Seeking back from the end of a StringIO',
      desc: 'Text streams only take offset 0 with SEEK_CUR and SEEK_END. Compute the absolute position instead.',
      wrong: { label: 'seek(-2, SEEK_END)', code: "import io\nf = io.StringIO('hello')\nf.seek(-2, io.SEEK_END)", output: "OSError: Can't do nonzero cur-relative seeks" },
      fix:   { label: 'absolute offset',    code: "import io\nf = io.StringIO('hello')\nend = f.seek(0, io.SEEK_END)\nf.seek(end - 2)\nf.read()", output: "'lo'" },
    },
    {
      name: 'Clearing a buffer without rewinding',
      desc: 'truncate(0) empties the buffer but leaves the position where it was, so the next write pads the gap with NULs.',
      wrong: { label: 'truncate(0) only', code: "import io\nf = io.StringIO('old text')\nf.read()\nf.truncate(0)\nf.write('new')\nf.getvalue()", output: "'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00new'" },
      fix:   { label: 'seek(0) first',    code: "import io\nf = io.StringIO('old text')\nf.read()\nf.seek(0)\nf.truncate()\nf.write('new')\nf.getvalue()", output: "'new'" },
    },
  ],

  when: {
    use: [
      'Rewinding after writing so the data can be read (seek(0))',
      'Random access to binary records (BytesIO with SEEK_CUR / SEEK_END)',
      'Reusing one buffer (seek(0) + truncate())',
    ],
    avoid: [
      'Reading everything regardless of position → getvalue()',
      'Positions in TextIOWrapper files → only values returned by tell() are valid there',
    ],
  },

  notes: {
    cpython:          'Modules/_io/stringio.c and bytesio.c. StringIO checks whence, then a negative absolute offset, then a nonzero relative offset; BytesIO adds the offset and clamps a negative result to 0',
    'Error texts':    'StringIO: "Invalid whence (3, should be 0, 1 or 2)", "Negative seek position -1", "Negative size value -1". BytesIO writes them in lower case: "invalid whence …", "negative seek value -1", "negative size value -1"',
    'Past the end':   'Seeking beyond the end is allowed; read() then returns an empty result and the next write pads the gap with NULs / zero bytes',
  },

  related: [
    { name: 'SEEK_SET / SEEK_CUR / SEEK_END', slug: 'seek_set-seek_cur-seek_end', when: 'Names for whence' },
    { name: 'write / writelines',             slug: 'write-writelines',           when: 'Writing after a seek' },
    { name: 'read / readline / readlines',    slug: 'read-readline-readlines',    when: 'Reading after a seek' },
    { name: 'TextIOWrapper',                  slug: 'textiowrapper',              when: 'Opaque tell() cookies on text files' },
    { name: 'os.lseek',                       slug: 'open',                       when: 'The file-descriptor level', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: "What does \"Can't do nonzero cur-relative seeks\" mean?",
      a: "A text stream got seek(offset, whence) with whence 1 (SEEK_CUR) or 2 (SEEK_END) and a nonzero offset. Text streams only support offset 0 there. Compute an absolute position (end = f.seek(0, io.SEEK_END); f.seek(end - n)), or use a BytesIO / binary file, which accepts relative offsets.",
    },
    {
      q: 'How do I clear a StringIO?',
      a: 'f.seek(0) then f.truncate() — or simply create a new StringIO. truncate(0) alone leaves the position where it was, so the next write starts with NUL padding.',
    },
    {
      q: 'What does tell() return for StringIO and BytesIO?',
      a: 'The position as a plain int: a character index for StringIO, a byte offset for BytesIO. (Real text files return an opaque number that is only meaningful for seek().)',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.IOBase.seek',
    meta:  'IOBase.seek / tell / truncate',
  },

};
