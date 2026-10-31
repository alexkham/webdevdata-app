// content/reference/python/stdlib/tempfile/spooledtemporaryfile.js

export const meta = {
  slug:        'spooledtemporaryfile',
  name:        'tempfile.SpooledTemporaryFile',
  signature:   "tempfile.SpooledTemporaryFile(max_size=0, mode='w+b', buffering=-1, encoding=None, newline=None, suffix=None, prefix=None, dir=None, *, errors=None)",
  blurb:       'A temporary file that lives in memory (a BytesIO or TextIOWrapper) until it grows past max_size or fileno() is called, then moves to a real temporary file — transparently.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'spooledtemporaryfile tempfile.SpooledTemporaryFile python in-memory temporary file max_size rollover spill to disk BytesIO _file fileno upload buffer memory then disk',
};

export const method = {
  slug:      'spooledtemporaryfile',
  name:      'tempfile.SpooledTemporaryFile',
  signature: "tempfile.SpooledTemporaryFile(max_size=0, mode='w+b', buffering=-1, encoding=None, newline=None, suffix=None, prefix=None, dir=None, *, errors=None)",
  returns:   { type: 'SpooledTemporaryFile', desc: 'An io.IOBase subclass that forwards to its current _file.' },

  category:    'tempfile class',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Small data never touches the disk; large data does not fill memory. After every write the file checks whether its size now exceeds max_size and, if so, copies everything (position included) into a TemporaryFile. max_size=0, the default, means it never rolls over by size. The docs name the current backing object: the _file attribute.',

  covers: ['SpooledTemporaryFile'],

  cheat: {
    commonCall: 'with tempfile.SpooledTemporaryFile(max_size=10 * 1024 * 1024) as f:',
    returns:    'a file that spills to disk past 10 MiB',
    replaces:   'choosing between BytesIO and TemporaryFile up front',
    watchOut:   'max_size=0 (the default) never rolls over by size',
  },

  parameters: [
    { name: 'max_size', type: 'int', required: false, default: '0', desc: 'Roll over once a write leaves the file larger than this many bytes (characters in text mode). 0: only rollover() or fileno() move it to disk.' },
    { name: 'mode / buffering / encoding / newline / errors', type: 'as TemporaryFile', required: false, default: "mode='w+b'", desc: 'Text modes start as a TextIOWrapper over a BytesIO.' },
    { name: 'suffix / prefix / dir', type: 'as TemporaryFile', required: false, default: 'None', desc: 'Used for the disk file after rollover.' },
  ],

  attributes: [
    { name: 'rollover()', type: 'method',    meaning: 'Move to a real temporary file now, whatever the size (no-op if already rolled over).' },
    { name: '_file',      type: 'attribute', meaning: 'io.BytesIO / io.TextIOWrapper before rollover, the real file object after (documented).' },
    { name: 'fileno()',   type: 'method',    meaning: 'Rolls over first — a descriptor needs a real file.' },
    { name: 'name',       type: 'property',  meaning: 'None while in memory; the disk file\'s name after rollover.' },
  ],

  modes: [
    {
      id: 'rollover',
      label: 'rollover by size',
      blurb: 'Write the chunks one by one and record after each write whether the data is still in memory.',
      params: [
        { name: 'max_size', type: 'int',       hint: 'max_size in bytes', input: 'number' },
        { name: 'chunks',   type: 'list[str]', hint: 'chunks, comma-separated', input: 'csv' },
      ],
      template: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(max_size={$max_size}, dir='.') as f:\n    in_memory = []\n    for chunk in {$chunks}:\n        f.write(chunk.encode())\n        in_memory.append(isinstance(f._file, io.BytesIO))\n    f.seek(0)\n    data = f.read()\n(in_memory, data)",
      cases: [
        { id: 'grow',  label: 'grows past 10', values: { max_size: '10', chunks: 'hello, world, again' } },
        { id: 'utf',   label: 'bytes, not characters', values: { max_size: '4', chunks: 'é, é, é' } },
        { id: 'never', label: 'max_size=0',    values: { max_size: '0', chunks: 'hello, world, again' } },
      ],
    },
    {
      id: 'explicit',
      label: 'rollover()',
      blurb: 'Write some text, then call rollover() yourself. The position and the data survive the move.',
      params: [
        { name: 'max_size', type: 'int', hint: 'max_size in bytes', input: 'number' },
        { name: 'text',     type: 'str', hint: 'text to write',     input: 'text' },
      ],
      template: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(max_size={$max_size}, dir='.') as f:\n    f.write({$text}.encode())\n    before = isinstance(f._file, io.BytesIO)\n    pos = f.tell()\n    f.rollover()\n    after = isinstance(f._file, io.BytesIO)\n    kept = f.tell() == pos\n    f.seek(0)\n    data = f.read()\n(before, after, kept, data)",
      cases: [
        { id: 'small', label: 'small data',         values: { max_size: '100', text: 'tiny' } },
        { id: 'big',   label: 'already rolled over', values: { max_size: '3', text: 'larger' } },
      ],
    },
  ],
  demoExplainer: "With max_size=10, 'hello' (5) and 'helloworld' (10) stay in memory — 10 does not exceed 10 — and the third write makes 15 bytes, so the data moves to disk. 'é' is 2 bytes in UTF-8: the third one takes the size to 6 and past max_size=4. In the rollover() tab the file reports the same tell() after the move and still returns all the data; when the write already exceeded max_size, the data was on disk before rollover() was even called.",

  patterns: [
    {
      name: 'Buffer an upload of unknown size',
      desc: 'Small bodies stay in RAM, large ones go to disk.',
      code: "import shutil, tempfile\nwith tempfile.SpooledTemporaryFile(max_size=8 * 1024 * 1024) as buf:\n    shutil.copyfileobj(request_stream, buf)\n    buf.seek(0)\n    store(buf)",
    },
    {
      name: 'Text that may grow large',
      desc: 'Pass a text mode and an encoding.',
      code: "import tempfile\nwith tempfile.SpooledTemporaryFile(max_size=1_000_000, mode='w+', encoding='utf-8') as out:\n    for row in rows:\n        out.write(format_row(row))\n    out.seek(0)\n    send(out)",
    },
  ],

  examples: [
    { title: 'In memory until max_size is exceeded', code: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(max_size=4, dir='.') as f:\n    f.write(b'abc')\n    first = isinstance(f._file, io.BytesIO)\n    f.write(b'de')\n    second = isinstance(f._file, io.BytesIO)\n(first, second)", returns: '(True, False)' },
    { title: 'No name while in memory',              code: "import tempfile\nwith tempfile.SpooledTemporaryFile(dir='.') as f:\n    f.write(b'x')\n    name = f.name\nname is None", returns: 'True' },
    { title: 'fileno() forces a real file',          code: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(max_size=100, dir='.') as f:\n    f.write(b'x')\n    f.fileno()\n    in_memory = isinstance(f._file, io.BytesIO)\nin_memory", returns: 'False' },
    { title: 'Text mode starts as a TextIOWrapper',  code: "import tempfile\nwith tempfile.SpooledTemporaryFile(mode='w+', encoding='utf-8', dir='.') as f:\n    info = (type(f._file).__name__, f.mode)\ninfo", returns: "('TextIOWrapper', 'w+')" },
    { title: 'It is an io.IOBase',                   code: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(dir='.') as f:\n    ok = isinstance(f, io.IOBase)\nok", returns: 'True' },
    { title: 'Not re-enterable once closed',         code: "import tempfile\nf = tempfile.SpooledTemporaryFile(dir='.')\nf.close()\nwith f:\n    pass", returns: 'ValueError: Cannot enter context with closed file' },
  ],

  pitfalls: [
    {
      name: 'Expecting max_size=0 to mean "always on disk"',
      desc: '0 disables rollover by size: everything stays in memory. Call rollover(), or use TemporaryFile, when you want a disk file from the start.',
      wrong: { label: 'max_size=0',  code: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(max_size=0, dir='.') as f:\n    f.write(b'x' * 100000)\n    in_memory = isinstance(f._file, io.BytesIO)\nin_memory", output: 'True' },
      fix:   { label: 'rollover()',  code: "import io, tempfile\nwith tempfile.SpooledTemporaryFile(max_size=0, dir='.') as f:\n    f.rollover()\n    f.write(b'x' * 100000)\n    in_memory = isinstance(f._file, io.BytesIO)\nin_memory", output: 'False' },
    },
  ],

  when: {
    use: [
      'Buffers whose size you do not know in advance (uploads, generated reports)',
      'Code that wants a file object but usually handles small data',
    ],
    avoid: [
      'Always-small data → io.BytesIO',
      'Data another program must open by path → NamedTemporaryFile',
    ],
  },

  notes: {
    cpython:     'Lib/tempfile.py: a pure-Python io.IOBase subclass that forwards every method to self._file; write() calls _check(), which rolls over when max_size and file.tell() > max_size',
    'Rollover':  'rollover() creates TemporaryFile(**args), writes the old contents into it and seeks to the old position; in text mode it detaches the TextIOWrapper and copies the underlying bytes',
    'Changed':   '3.3: truncate() accepts a size; 3.8: errors parameter; 3.11: fully implements io.BufferedIOBase / io.TextIOBase (docs)',
    'Generic':   'SpooledTemporaryFile[bytes] is a types.GenericAlias for type hints',
  },

  related: [
    { name: 'TemporaryFile',  slug: 'temporaryfile', when: 'What it rolls over to' },
    { name: 'io.BytesIO',     slug: 'bytesio',       when: 'What it starts as', category: 'stdlib/io' },
    { name: 'NamedTemporaryFile', slug: 'namedtemporaryfile', when: 'When a path is needed' },
    { name: 'shutil.copyfileobj', slug: 'copyfileobj', when: 'Fill it from another stream', category: 'stdlib/shutil' },
  ],

  faq: [
    {
      q: 'When does SpooledTemporaryFile write to disk?',
      a: 'When a write leaves the data larger than max_size (strictly larger), when fileno() is called, or when you call rollover(). With max_size=0 only the last two do it.',
    },
    {
      q: 'How do I know whether a SpooledTemporaryFile is still in memory?',
      a: 'The documented _file attribute is an io.BytesIO (binary) or io.TextIOWrapper (text) until rollover, and the real file object afterwards: isinstance(f._file, io.BytesIO) tells you for binary mode. f.name is None while in memory.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/tempfile.html#tempfile.SpooledTemporaryFile',
    meta:  'tempfile.SpooledTemporaryFile',
  },

};
