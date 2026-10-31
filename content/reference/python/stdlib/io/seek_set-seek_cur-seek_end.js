// content/reference/python/stdlib/io/seek_set-seek_cur-seek_end.js

export const meta = {
  slug:        'seek_set-seek_cur-seek_end',
  name:        'io.SEEK_SET / SEEK_CUR / SEEK_END',
  signature:   'io.SEEK_SET  ·  io.SEEK_CUR  ·  io.SEEK_END',
  blurb:       'Names for the whence argument of seek(): 0 = from the start, 1 = from the current position, 2 = from the end. The same values as os.SEEK_SET / SEEK_CUR / SEEK_END.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.1+',
  searchTerms: 'SEEK_SET SEEK_CUR SEEK_END io.SEEK_SET io.SEEK_CUR io.SEEK_END python seek whence 0 1 2 seek from end seek relative file size last bytes of file',
};

export const method = {
  slug:      'seek_set-seek_cur-seek_end',
  name:      'io.SEEK_SET / SEEK_CUR / SEEK_END',
  signature: 'io.SEEK_SET  ·  io.SEEK_CUR  ·  io.SEEK_END',
  returns:   { type: 'int', desc: '0, 1 and 2.' },

  category:    'io constants',
  version:     'Python 3.1+',
  hasLiveDemo: false,

  subtitle: 'f.seek(offset, whence) reads better as f.seek(-4, io.SEEK_END) than f.seek(-4, 2). Binary streams accept any offset with all three; text streams (files in text mode, StringIO) only accept offset 0 with SEEK_CUR and SEEK_END.',

  covers: ['SEEK_SET', 'SEEK_CUR', 'SEEK_END'],

  cheat: {
    commonCall: 'f.seek(0, io.SEEK_END)',
    returns:    'the new absolute position',
    replaces:   'the bare numbers 0, 1, 2',
    watchOut:   "text streams: nonzero offsets with SEEK_CUR / SEEK_END raise",
  },

  parameters: [],

  attributes: [
    { name: 'SEEK_SET', type: 'int = 0', meaning: 'offset counts from the start (offset must not be negative).' },
    { name: 'SEEK_CUR', type: 'int = 1', meaning: 'offset is added to the current position.' },
    { name: 'SEEK_END', type: 'int = 2', meaning: 'offset is added to the end of the stream (usually negative or 0).' },
  ],

  patterns: [
    {
      name: 'Size of a binary file without os.stat',
      desc: 'seek returns the new position.',
      code: "import io\nwith open(path, 'rb') as f:\n    size = f.seek(0, io.SEEK_END)",
    },
    {
      name: 'Read a trailer',
      desc: 'The last bytes of a binary file.',
      code: "import io\nwith open(path, 'rb') as f:\n    f.seek(-16, io.SEEK_END)\n    trailer = f.read()",
    },
  ],

  examples: [
    { title: 'The values',                 code: 'import io\n(io.SEEK_SET, io.SEEK_CUR, io.SEEK_END)', returns: '(0, 1, 2)' },
    { title: 'Same as the os constants',   code: 'import io, os\n(io.SEEK_SET, io.SEEK_CUR, io.SEEK_END) == (os.SEEK_SET, os.SEEK_CUR, os.SEEK_END)', returns: 'True' },
    { title: 'Size via SEEK_END',          code: "import io\nio.BytesIO(b'abcdef').seek(0, io.SEEK_END)", returns: '6' },
    { title: 'The last n bytes',           code: "import io\nb = io.BytesIO(b'abcdef')\nb.seek(-3, io.SEEK_END)\nb.read()", returns: "b'def'" },
    { title: 'Skip ahead with SEEK_CUR',   code: "import io\nb = io.BytesIO(b'abcdef')\nb.read(1)\nb.seek(2, io.SEEK_CUR)\nb.read()", returns: "b'def'" },
    { title: 'Text streams: offset 0 only', code: "import io\nio.StringIO('abc').seek(-1, io.SEEK_END)", returns: "OSError: Can't do nonzero cur-relative seeks" },
  ],

  pitfalls: [
    {
      name: 'Seeking from the end of a text file',
      desc: 'Open in binary mode for byte offsets from the end, then decode what you read.',
      wrong: { label: 'text mode',   code: "import io\nwith open('a.txt', 'w', encoding='utf-8') as f:\n    f.write('hello')\nwith open('a.txt', encoding='utf-8') as f:\n    f.seek(-2, io.SEEK_END)", output: "io.UnsupportedOperation: can't do nonzero end-relative seeks" },
      fix:   { label: 'binary mode', code: "import io\nwith open('a.txt', 'w', encoding='utf-8') as f:\n    f.write('hello')\nwith open('a.txt', 'rb') as f:\n    f.seek(-2, io.SEEK_END)\n    tail = f.read().decode('utf-8')\ntail", output: "'lo'" },
    },
  ],

  when: {
    use: [
      'Any seek() with whence other than the default',
    ],
    avoid: [
      'os.SEEK_HOLE / os.SEEK_DATA (sparse files) — those exist only in os, on platforms that support them',
    ],
  },

  notes: {
    cpython:   'Plain ints defined in Lib/io.py (SEEK_SET = 0, SEEK_CUR = 1, SEEK_END = 2)',
    'Added':   '3.1 (docs)',
    'Messages': "TextIOWrapper says \"can't do nonzero cur-relative seeks\" / \"can't do nonzero end-relative seeks\" (io.UnsupportedOperation); StringIO says \"Can't do nonzero cur-relative seeks\" (OSError) for both",
  },

  related: [
    { name: 'seek / tell / truncate', slug: 'seek-tell-truncate', when: 'seek() on StringIO and BytesIO' },
    { name: 'os.lseek / os.SEEK_SET', slug: 'open', when: 'The same constants for file descriptors', category: 'stdlib/os' },
    { name: 'TextIOWrapper',          slug: 'textiowrapper',      when: 'Why text positions are opaque' },
  ],

  faq: [
    {
      q: 'What do 0, 1 and 2 mean in file.seek()?',
      a: 'The whence argument: 0 (io.SEEK_SET) counts from the start, 1 (io.SEEK_CUR) from the current position, 2 (io.SEEK_END) from the end. f.seek(0, 2) jumps to the end and returns the size.',
    },
    {
      q: 'Are io.SEEK_END and os.SEEK_END the same?',
      a: 'Yes, both are 2 (and SEEK_SET / SEEK_CUR are 0 / 1 in both modules). os additionally defines SEEK_DATA and SEEK_HOLE on some platforms.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.IOBase.seek',
    meta:  'IOBase.seek — the SEEK_* constants',
  },

};
