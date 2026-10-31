// content/reference/python/stdlib/io/write-writelines.js

export const meta = {
  slug:        'write-writelines',
  name:        'StringIO / BytesIO write, writelines',
  signature:   'f.write(s)  ·  b.write(data)  ·  f.writelines(lines)',
  blurb:       'Write str to a StringIO or bytes to a BytesIO at the current position. write() returns how much it took; writelines() writes each item and adds no line endings.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'write writelines StringIO.write BytesIO.write BytesIO.writelines python write to string buffer write bytes return value number of characters written writelines newline overwrite pad null bytes string argument expected bytes-like object is required',
};

export const method = {
  slug:      'write-writelines',
  name:      'StringIO / BytesIO write, writelines',
  signature: 'f.write(s)',
  returns:   { type: 'int | None', desc: 'write: number of characters (StringIO) or bytes (BytesIO) passed in; writelines: None.' },

  category:    'StringIO / BytesIO methods',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Writing happens at the current position: at the end it appends, in the middle it overwrites, past the end it first fills the gap with NUL characters or zero bytes. write() returns the length of what you passed — for StringIO that is counted before newline translation.',

  covers: ['StringIO.write', 'BytesIO.write', 'BytesIO.writelines'],

  cheat: {
    commonCall: "f.write('text\\n')",
    returns:    'characters (StringIO) or bytes (BytesIO) written',
    replaces:   'string concatenation in a loop',
    watchOut:   'writelines() does not add \\n between items',
  },

  parameters: [
    { name: 's / data', type: 'str | bytes-like', required: true, default: null, desc: 'StringIO.write takes str only; BytesIO.write takes bytes, bytearray, memoryview or any other bytes-like object.' },
    { name: 'lines',    type: 'iterable',          required: true, default: null, desc: 'writelines: any iterable of str (StringIO) or bytes-like objects (BytesIO), written one after another as they are.' },
  ],

  modes: [
    {
      id: 'counts',
      label: 'return values',
      blurb: 'Each piece is written to a StringIO and, encoded as UTF-8, to a BytesIO. Compare the two counts.',
      params: [{ name: 'parts', type: 'list[str]', hint: 'pieces, comma-separated', input: 'csv' }],
      template: "import io\ns, b = io.StringIO(), io.BytesIO()\ncounts = [(s.write(p), b.write(p.encode())) for p in {$parts}]\n(counts, s.getvalue(), b.getvalue())",
      cases: [
        { id: 'ascii', label: 'ASCII',     values: { parts: 'id, name' } },
        { id: 'utf',   label: 'non-ASCII', values: { parts: 'naïve, €5' } },
        { id: 'empty', label: 'empty piece', values: { parts: 'a, , b' } },
      ],
    },
    {
      id: 'position',
      label: 'where it lands',
      blurb: 'Seek somewhere, then write: inside the text it overwrites, past the end it pads with NULs.',
      params: [
        { name: 'text', type: 'str', hint: 'initial text', input: 'text' },
        { name: 'pos',  type: 'int', hint: 'seek to',      input: 'number' },
        { name: 'more', type: 'str', hint: 'then write',   input: 'text' },
      ],
      template: "import io\nf = io.StringIO({$text})\nf.seek({$pos})\nf.write({$more})\n(f.getvalue(), f.tell())",
      cases: [
        { id: 'middle', label: 'overwrite', values: { text: 'abcdef', pos: '2', more: 'XY' } },
        { id: 'end',    label: 'append',    values: { text: 'abc', pos: '3', more: 'def' } },
        { id: 'past',   label: 'past the end', values: { text: 'ab', pos: '5', more: '!' } },
        { id: 'nothing', label: 'empty write past the end', values: { text: 'ab', pos: '5', more: '' } },
      ],
    },
    {
      id: 'writelines',
      label: 'writelines',
      blurb: 'writelines() glues the items together. Add the line endings yourself — here with a generator.',
      params: [{ name: 'lines', type: 'list[str]', hint: 'lines, comma-separated', input: 'csv' }],
      template: "import io\nf, g = io.StringIO(), io.StringIO()\nf.writelines({$lines})\ng.writelines(line + '\\n' for line in {$lines})\n(f.getvalue(), g.getvalue())",
      cases: [
        { id: 'three', label: 'three lines', values: { lines: 'alpha, beta, gamma' } },
        { id: 'none',  label: 'nothing',     values: { lines: '' } },
      ],
    },
  ],
  demoExplainer: "'naïve' counts 5 for the StringIO and 6 for the BytesIO, '€5' counts 2 and 4. Seeking to 5 in 'ab' and writing '!' gives 'ab\\x00\\x00\\x00!': three NULs fill the gap. An empty write past the end changes nothing at all — the value stays 'ab' — but the position stays at 5.",

  patterns: [
    {
      name: 'Build a report',
      desc: 'print(file=...) adds separators and the newline for you.',
      code: "import io\nout = io.StringIO()\nfor name, score in results:\n    print(f'{name:<10}{score:>5}', file=out)\nreport = out.getvalue()",
    },
    {
      name: 'Write lines with their endings',
      desc: 'A generator expression adds the \\n without building a second list.',
      code: "import io\nbuf = io.StringIO()\nbuf.writelines(line + '\\n' for line in lines)",
    },
    {
      name: 'Binary records',
      desc: 'struct.pack returns bytes that go straight into a BytesIO.',
      code: "import io, struct\nbuf = io.BytesIO()\nfor x, y in points:\n    buf.write(struct.pack('<ff', x, y))\npayload = buf.getvalue()",
    },
  ],

  examples: [
    { title: 'write returns the length',       code: "import io\nio.StringIO().write('hello')", returns: '5' },
    { title: 'BytesIO counts bytes',           code: "import io\nio.BytesIO().write('€'.encode())", returns: '3' },
    { title: 'Overwriting in the middle',      code: "import io\nf = io.StringIO('abcdef')\nf.seek(2)\nf.write('XY')\nf.getvalue()", returns: "'abXYef'" },
    { title: 'Past the end: NUL padding',      code: "import io\nf = io.StringIO('ab')\nf.seek(4)\nf.write('!')\nf.getvalue()", returns: "'ab\\x00\\x00!'" },
    { title: 'Any bytes-like object',          code: "import io\nb = io.BytesIO()\nb.write(bytearray(b'ab'))\nb.write(memoryview(b'cd'))\nb.getvalue()", returns: "b'abcd'" },
    { title: 'writelines adds nothing',        code: "import io\nf = io.StringIO()\nf.writelines(['a', 'b'])\nf.getvalue()", returns: "'ab'" },
    { title: 'Only str for StringIO',          code: "import io\nio.StringIO().write(42)", returns: "TypeError: string argument expected, got 'int'" },
    { title: 'Each item is checked',           code: "import io\nio.BytesIO().writelines([b'a', 'b'])", returns: "TypeError: a bytes-like object is required, not 'str'" },
  ],

  pitfalls: [
    {
      name: 'Expecting writelines() to add newlines',
      desc: 'The name suggests lines, but items are written exactly as given.',
      wrong: { label: 'writelines(list)',      code: "import io\nf = io.StringIO()\nf.writelines(['one', 'two'])\nf.getvalue()", output: "'onetwo'" },
      fix:   { label: "add '\\n' yourself",    code: "import io\nf = io.StringIO()\nf.writelines(s + '\\n' for s in ['one', 'two'])\nf.getvalue()", output: "'one\\ntwo\\n'" },
    },
    {
      name: 'Writing numbers',
      desc: 'Unlike print(), write() does not convert. Format the value first.',
      wrong: { label: 'write(3.5)',      code: "import io\nio.StringIO().write(3.5)", output: "TypeError: string argument expected, got 'float'" },
      fix:   { label: 'write(str(3.5))', code: "import io\nf = io.StringIO()\nf.write(str(3.5))\nf.getvalue()", output: "'3.5'" },
    },
  ],

  when: {
    use: [
      'Appending text or bytes piece by piece',
      'Patching bytes at a known offset (seek, then write)',
      'Feeding code that calls write() on a file object',
    ],
    avoid: [
      'Formatting values with separators → print(..., file=f)',
      'Joining a list you already have → str.join / bytes.join',
    ],
  },

  notes: {
    cpython:          'StringIO.write in Modules/_io/stringio.c checks the type before the closed state; StringIO.writelines is the IOBase mixin (iobase.c), which calls write() per item; BytesIO.write / writelines in bytesio.c',
    'Return value':   'StringIO.write returns len(s) even when newline translation stores more or fewer characters (newline="\\r\\n" turns "a\\nb" into 4 characters but returns 3)',
    'While exported': 'A BytesIO with a live getbuffer() view refuses every write, even an empty one: BufferError',
  },

  related: [
    { name: 'StringIO',                    slug: 'stringio',                when: 'newline= and translation on write' },
    { name: 'seek / tell / truncate',      slug: 'seek-tell-truncate',      when: 'Choose where the write lands' },
    { name: 'getvalue / getbuffer',        slug: 'getvalue-getbuffer',      when: 'Take what you wrote' },
    { name: 'print()',                     slug: 'print',                   when: 'Converts and separates for you', category: 'functions' },
    { name: 'str.join',                    slug: 'join',                    when: 'When you already have all the pieces', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does writelines() not add newlines?',
      a: 'It is the counterpart of readlines(), whose lines already end in "\\n". It writes each item unchanged; add the endings yourself, e.g. f.writelines(s + "\\n" for s in items).',
    },
    {
      q: 'What does write() return on a StringIO?',
      a: 'The number of characters in the str you passed, which with newline translation can differ from the number of characters stored. BytesIO.write returns the number of bytes.',
    },
    {
      q: 'How do I append to a StringIO that has initial text?',
      a: 'Seek to the end first: f.seek(0, io.SEEK_END). A new StringIO starts at position 0, so a plain write() overwrites the beginning.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.TextIOBase.write',
    meta:  'TextIOBase.write / BufferedIOBase.write',
  },

};
