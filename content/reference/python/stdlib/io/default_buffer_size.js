// content/reference/python/stdlib/io/default_buffer_size.js

export const meta = {
  slug:        'default_buffer_size',
  name:        'io.DEFAULT_BUFFER_SIZE',
  signature:   'io.DEFAULT_BUFFER_SIZE',
  blurb:       'The default buffer size (in bytes) of the buffered io classes — 8192 in CPython 3.10 through 3.13. open() prefers the block size the OS reports for the file.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'DEFAULT_BUFFER_SIZE io.DEFAULT_BUFFER_SIZE python default buffer size 8192 buffer_size chunk size read in chunks st_blksize buffering',
};

export const method = {
  slug:      'default_buffer_size',
  name:      'io.DEFAULT_BUFFER_SIZE',
  signature: 'io.DEFAULT_BUFFER_SIZE',
  returns:   { type: 'int', desc: '8192 in CPython 3.10–3.13.' },

  category:    'io constant',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'BufferedReader, BufferedWriter, BufferedRandom and BufferedRWPair use it when you do not pass buffer_size. open() with the default buffering uses the file\'s st_blksize instead when the OS reports one larger than 1 — so the buffer of a real file is often a different size. It is also a reasonable chunk size for your own read loops.',

  covers: ['DEFAULT_BUFFER_SIZE'],

  cheat: {
    commonCall: 'chunk = f.read(io.DEFAULT_BUFFER_SIZE)',
    returns:    '8192 (bytes)',
    replaces:   'a magic number for the chunk size',
    watchOut:   "it is not necessarily the buffer size open() chose for a file",
  },

  parameters: [],

  patterns: [
    {
      name: 'Copy a stream in chunks',
      desc: 'shutil.copyfileobj does the same with its own chunk size.',
      code: "import io\nwhile (chunk := src.read(io.DEFAULT_BUFFER_SIZE)):\n    dst.write(chunk)",
    },
    {
      name: 'Hash a large file without loading it',
      desc: 'Constant memory, any file size.',
      code: "import hashlib, io\ndigest = hashlib.sha256()\nwith open(path, 'rb') as f:\n    while (chunk := f.read(io.DEFAULT_BUFFER_SIZE)):\n        digest.update(chunk)",
    },
  ],

  examples: [
    { title: 'The value',                     code: 'import io\nio.DEFAULT_BUFFER_SIZE', returns: '8192' },
    { title: 'Reading in chunks of it',       code: "import io\nf = io.BytesIO(bytes(20000))\nsizes = []\nwhile (chunk := f.read(io.DEFAULT_BUFFER_SIZE)):\n    sizes.append(len(chunk))\nsizes", returns: '[8192, 8192, 3616]' },
    { title: 'buffer_size must be positive',  code: 'import io\nio.BufferedReader(io.BytesIO(), buffer_size=0)', returns: 'ValueError: buffer size must be strictly positive' },
  ],

  pitfalls: [
    {
      name: 'Reading a whole large file at once',
      desc: 'read() with no size loads everything into memory. A fixed chunk size keeps memory flat — here the largest piece held at a time is DEFAULT_BUFFER_SIZE bytes.',
      wrong: { label: 'read()',      code: "import io\nf = io.BytesIO(bytes(50000))\nlen(f.read())", output: '50000' },
      fix:   { label: 'read(chunk)', code: "import io\nf = io.BytesIO(bytes(50000))\nlargest = 0\nwhile (chunk := f.read(io.DEFAULT_BUFFER_SIZE)):\n    largest = max(largest, len(chunk))\nlargest", output: '8192' },
    },
  ],

  when: {
    use: [
      'A default chunk size for read loops and copies',
      'Building buffered streams with the standard buffer size',
    ],
    avoid: [
      'Assuming open() used exactly this size — check the file system block size if it matters',
    ],
  },

  notes: {
    cpython:     'A C constant of the _io module, re-exported by io; 8192 on CPython 3.10, 3.12 and 3.13',
    'open()':    'With buffering=-1, open() uses st_blksize from os.fstat() when it is greater than 1, otherwise DEFAULT_BUFFER_SIZE (docs: "open() uses the file\'s blksize … if possible"). On Windows os.stat() reports no st_blksize, so files get 8192; on a Linux ext4 file system the block size is 4096',
  },

  related: [
    { name: 'BufferedReader', slug: 'bufferedreader', when: 'Uses it as the default buffer_size' },
    { name: 'BufferedWriter', slug: 'bufferedwriter', when: 'Uses it as the default buffer_size' },
    { name: 'io.open',        slug: 'open',           when: 'buffering= and the block size' },
    { name: 'shutil.copyfileobj', slug: 'copyfileobj', when: 'Chunked copying with its own default', category: 'stdlib/shutil' },
  ],

  faq: [
    {
      q: 'What is the default buffer size in Python?',
      a: 'io.DEFAULT_BUFFER_SIZE is 8192 bytes (CPython 3.10–3.13). Files opened with open() and the default buffering use the block size reported by the OS when available, which is often 4096 on Linux file systems.',
    },
    {
      q: 'What chunk size should I use to read a big file?',
      a: 'Anything from a few KiB to a few MiB works; io.DEFAULT_BUFFER_SIZE is a safe default. Larger chunks mean fewer calls, smaller chunks less memory.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.DEFAULT_BUFFER_SIZE',
    meta:  'io.DEFAULT_BUFFER_SIZE',
  },

};
