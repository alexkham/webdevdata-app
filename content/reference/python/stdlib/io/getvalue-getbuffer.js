// content/reference/python/stdlib/io/getvalue-getbuffer.js

export const meta = {
  slug:        'getvalue-getbuffer',
  name:        'StringIO / BytesIO getvalue, getbuffer',
  signature:   'f.getvalue()  ·  b.getbuffer()',
  blurb:       'getvalue() returns the entire contents of a StringIO or BytesIO, wherever the position is. BytesIO.getbuffer() returns a writable memoryview of the contents instead of a copy.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'getvalue getbuffer StringIO.getvalue BytesIO.getvalue BytesIO.getbuffer python get string from stringio get bytes from bytesio memoryview zero copy edit in place BufferError existing exports of data object cannot be re-sized release',
};

export const method = {
  slug:      'getvalue-getbuffer',
  name:      'StringIO / BytesIO getvalue, getbuffer',
  signature: 'f.getvalue()',
  returns:   { type: 'str | bytes | memoryview', desc: 'getvalue: a new str (StringIO) or bytes (BytesIO) with everything in the buffer · getbuffer: a memoryview sharing the BytesIO contents.' },

  category:    'StringIO / BytesIO methods',
  version:     'Python 3.0+ (getbuffer 3.2+)',
  hasLiveDemo: true,

  subtitle: 'getvalue() is the usual way to take what you wrote: it ignores and keeps the position and returns a copy. getbuffer() (BytesIO only) skips the copy — edits through the view change the stream — but while the view exists the BytesIO cannot grow, shrink or close.',

  covers: ['StringIO.getvalue', 'BytesIO.getvalue', 'BytesIO.getbuffer'],

  cheat: {
    commonCall: 'text = buf.getvalue()',
    returns:    'the whole buffer, position unchanged',
    replaces:   'seek(0) followed by read()',
    watchOut:   'a live getbuffer() view makes write / truncate / close raise BufferError',
  },

  parameters: [],

  modes: [
    {
      id: 'value',
      label: 'getvalue vs read',
      blurb: 'Write some text, then call read() and getvalue(). Only one of them depends on the position.',
      params: [{ name: 'text', type: 'str', hint: 'text to write', input: 'text' }],
      template: "import io\nf = io.StringIO()\nf.write({$text})\n(f.read(), f.getvalue(), f.tell())",
      cases: [
        { id: 'hello', label: 'hello',  values: { text: 'hello' } },
        { id: 'empty', label: 'empty',  values: { text: '' } },
      ],
    },
    {
      id: 'view',
      label: 'edit through getbuffer',
      blurb: 'Change one byte through the memoryview, then look at the BytesIO. A byte is an int from 0 to 255.',
      params: [
        { name: 'text',  type: 'str', hint: 'contents (as UTF-8)', input: 'text' },
        { name: 'index', type: 'int', hint: 'byte index',          input: 'number' },
        { name: 'value', type: 'int', hint: 'new byte value',      input: 'number' },
      ],
      template: "import io\nb = io.BytesIO({$text}.encode())\nwith b.getbuffer() as view:\n    view[{$index}] = {$value}\nb.getvalue()",
      cases: [
        { id: 'cap',   label: 'h → H',          values: { text: 'hello', index: '0', value: '72' } },
        { id: 'last',  label: 'negative index', values: { text: 'hello', index: '-1', value: '33' } },
        { id: 'range', label: 'index too big',  values: { text: 'abc', index: '3', value: '65' } },
        { id: 'byte',  label: 'value 256',      values: { text: 'abc', index: '0', value: '256' } },
      ],
    },
  ],
  demoExplainer: "read() returns '' because write() left the position at the end; getvalue() still returns everything and tell() is unchanged. Through the view, view[-1] = 33 turns 'hello' into b'hell!'. A bad index raises IndexError: index out of bounds on dimension 1, and 256 raises ValueError: memoryview: invalid value for format 'B'. The with block releases the view, so the BytesIO is free to resize again afterwards.",

  patterns: [
    {
      name: 'Take the result of a writer',
      desc: 'Most code ends with getvalue().',
      code: "import io, csv\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerows(rows)\ncsv_text = buf.getvalue()",
    },
    {
      name: 'Patch bytes in place',
      desc: 'A with block releases the view even if the edit fails.',
      code: "import io, struct\nwith buf.getbuffer() as view:\n    struct.pack_into('<I', view, 4, total_length)",
    },
    {
      name: 'Hand the bytes to an API without copying',
      desc: 'memoryview objects are accepted wherever a bytes-like object is.',
      code: "with buf.getbuffer() as view:\n    sock.sendall(view)",
    },
  ],

  examples: [
    { title: 'Position does not matter',        code: "import io\nf = io.StringIO()\nf.write('abc')\n(f.tell(), f.getvalue())", returns: "(3, 'abc')" },
    { title: 'getvalue() is a copy',            code: "import io\nb = io.BytesIO(b'abc')\nv = b.getvalue()\nb.write(b'X')\n(v, b.getvalue())", returns: "(b'abc', b'Xbc')" },
    { title: 'The docs example: edit a slice',  code: "import io\nb = io.BytesIO(b'abcdef')\nview = b.getbuffer()\nview[2:4] = b'56'\nb.getvalue()", returns: "b'ab56ef'" },
    { title: 'The view covers the current size', code: "import io\nb = io.BytesIO(b'abc')\nwith b.getbuffer() as view:\n    size = len(view)\nsize", returns: '3' },
    { title: 'A live view blocks writes',       code: "import io\nb = io.BytesIO(b'abc')\nview = b.getbuffer()\nb.write(b'x')", returns: 'BufferError: Existing exports of data: object cannot be re-sized' },
    { title: '… even empty ones',               code: "import io\nb = io.BytesIO(b'abc')\nview = b.getbuffer()\nb.write(b'')", returns: 'BufferError: Existing exports of data: object cannot be re-sized' },
    { title: 'release() unblocks',              code: "import io\nb = io.BytesIO(b'abc')\nview = b.getbuffer()\nview.release()\nb.write(b'x')\nb.getvalue()", returns: "b'xbc'" },
    { title: 'Not after close()',               code: "import io\nf = io.StringIO('x')\nf.close()\nf.getvalue()", returns: 'ValueError: I/O operation on closed file' },
  ],

  pitfalls: [
    {
      name: 'Keeping a getbuffer() view alive',
      desc: 'As long as any view exists, the BytesIO cannot be resized or closed. Use the view in a with block (or call release()).',
      wrong: { label: 'view kept',    code: "import io\nb = io.BytesIO(b'header')\nview = b.getbuffer()\nview[0] = ord('H')\nb.seek(0, io.SEEK_END)\nb.write(b'!')", output: 'BufferError: Existing exports of data: object cannot be re-sized' },
      fix:   { label: 'with block',   code: "import io\nb = io.BytesIO(b'header')\nwith b.getbuffer() as view:\n    view[0] = ord('H')\nb.seek(0, io.SEEK_END)\nb.write(b'!')\nb.getvalue()", output: "b'Header!'" },
    },
    {
      name: 'seek(0) + read() to get the contents',
      desc: 'It works, but moves the position — the next write lands at the end of what you read, not where you were. getvalue() leaves the position alone.',
      wrong: { label: 'seek + read', code: "import io\nf = io.StringIO()\nf.write('ab')\nf.seek(0)\nf.read(1)\nf.write('X')\nf.getvalue()", output: "'aX'" },
      fix:   { label: 'getvalue()',  code: "import io\nf = io.StringIO()\nf.write('ab')\nsnapshot = f.getvalue()\nf.write('X')\n(snapshot, f.getvalue())", output: "('ab', 'abX')" },
    },
  ],

  when: {
    use: [
      'Taking the finished text or bytes after writing (getvalue)',
      'Editing bytes in place or passing them on without a copy (getbuffer)',
    ],
    avoid: [
      'Only the part after the position → read()',
      'StringIO has no getbuffer(); the view is BytesIO-only',
    ],
  },

  notes: {
    cpython:          'StringIO.getvalue and BytesIO.getvalue/getbuffer in Modules/_io/stringio.c and bytesio.c. getbuffer() wraps an internal buffer object and counts exports; write, writelines, truncate and close check that count first',
    'Added':          'BytesIO.getbuffer(): 3.2 (docs)',
    'After close()':  'getvalue() raises ValueError — the buffer is discarded on close, so take the value before the with block ends',
  },

  related: [
    { name: 'StringIO',                    slug: 'stringio',                when: 'The text buffer' },
    { name: 'BytesIO',                     slug: 'bytesio',                 when: 'The binary buffer' },
    { name: 'close / closed',              slug: 'close-closed',            when: 'Why getvalue() fails after the with block' },
    { name: 'read / readline / readlines', slug: 'read-readline-readlines', when: 'Reading from the position' },
    { name: 'memoryview',                  slug: 'memoryview',              when: 'What getbuffer() returns', category: 'functions' },
    { name: 'BufferError',                 slug: 'buffererror',             when: 'Raised while a view is alive', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I get the string out of a StringIO?',
      a: 'buf.getvalue(). It returns everything written so far, no matter where the position is, and does not move it. Call it before the StringIO is closed.',
    },
    {
      q: 'What does "BufferError: Existing exports of data: object cannot be re-sized" mean?',
      a: 'A memoryview from getbuffer() (or another export) is still alive, so the BytesIO refuses to write, truncate or close. Release the view — view.release() or a with block — and try again.',
    },
    {
      q: 'Is getvalue() a copy?',
      a: 'Yes: later writes do not change the str or bytes it returned. getbuffer() is the no-copy alternative for BytesIO.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.BytesIO.getbuffer',
    meta:  'BytesIO.getbuffer / getvalue',
  },

};
