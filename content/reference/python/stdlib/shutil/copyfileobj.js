// content/reference/python/stdlib/shutil/copyfileobj.js

export const meta = {
  slug:        'copyfileobj',
  name:        'shutil.copyfileobj',
  signature:   'shutil.copyfileobj(fsrc, fdst, length=0)',
  blurb:       'Copy everything from one open file-like object to another, in chunks: read(length) from the source, write() to the destination, until the source is exhausted.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil copyfileobj copy file object stream python copy stream to file chunked copy buffer size length COPY_BUFSIZE gzip decompress to file http response to file file-like object read write',
};

export const method = {
  slug:      'copyfileobj',
  name:      'shutil.copyfileobj',
  signature: 'shutil.copyfileobj(fsrc, fdst, length=0)',
  returns:   { type: 'None', desc: 'Nothing; the data is written to fdst.' },

  category:    'shutil function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The loop every file copy ends up in: while (buf := fsrc.read(length)): fdst.write(buf). It works on anything with read() and write() — open files, BytesIO, gzip streams, HTTP responses — and starts wherever the source position currently is.',

  covers: ['copyfileobj'],

  cheat: {
    commonCall: 'shutil.copyfileobj(fsrc, fdst)',
    returns:    'None',
    replaces:   'fdst.write(fsrc.read()) — which loads the whole source into memory',
    watchOut:   'Both objects must be text, or both binary; nothing is rewound or flushed for you',
  },

  parameters: [
    { name: 'fsrc',   type: 'readable file-like', required: true,  default: null, desc: 'Anything with read(n). Copying starts at its current position.' },
    { name: 'fdst',   type: 'writable file-like', required: true,  default: null, desc: 'Anything with write(data). Data is written at its current position.' },
    { name: 'length', type: 'int',                required: false, default: '0',  desc: 'Chunk size for each read(). 0 means shutil.COPY_BUFSIZE (64 KiB, 1 MiB on Windows); a negative value reads everything in one call.' },
  ],

  modes: [
    {
      id: 'chunks',
      label: 'chunk size',
      blurb: 'The destination here only has a write method that collects what it receives, so you can see every chunk.',
      params: [
        { name: 'text',   type: 'str', hint: 'source text',                 input: 'text' },
        { name: 'length', type: 'int', hint: 'chunk size (0 = default)',    input: 'number' },
      ],
      template: 'import io, shutil, types\nsrc = io.StringIO({$text})\nchunks = []\nshutil.copyfileobj(src, types.SimpleNamespace(write=chunks.append), {$length})\nchunks',
      cases: [
        { id: 'four',  label: 'length=4',  values: { text: 'hello world', length: '4' } },
        { id: 'zero',  label: 'length=0',  values: { text: 'hello world', length: '0' } },
        { id: 'neg',   label: 'length=-1', values: { text: 'hello world', length: '-1' } },
        { id: 'empty', label: 'empty',     values: { text: '', length: '4' } },
      ],
    },
    {
      id: 'rest',
      label: 'current position',
      blurb: 'Read a few characters first. copyfileobj copies only what is left after the current position.',
      params: [
        { name: 'text', type: 'str', hint: 'source text',          input: 'text' },
        { name: 'skip', type: 'int', hint: 'characters read first', input: 'number' },
      ],
      template: 'import io, shutil\nsrc = io.StringIO({$text})\nskipped = src.read({$skip})\ndst = io.StringIO()\nshutil.copyfileobj(src, dst)\n(skipped, dst.getvalue())',
      cases: [
        { id: 'six',  label: 'skip 6',     values: { text: 'hello world', skip: '6' } },
        { id: 'none', label: 'skip 0',     values: { text: 'hello world', skip: '0' } },
        { id: 'all',  label: 'read all',   values: { text: 'hello world', skip: '-1' } },
      ],
    },
  ],
  demoExplainer: "With length=4 the 11 characters arrive as 'hell', 'o wo', 'rld' — the loop stops at the first empty read. length=0 means the default buffer (64 KiB on Linux and macOS, 1 MiB on Windows) and a negative length reads everything at once; for short text both give a single chunk. The second tab shows that the source is never rewound: after read(6) only 'world' is left to copy, and after read(-1) nothing is.",

  patterns: [
    {
      name: 'Save a download without loading it into memory',
      desc: 'urlopen returns a binary file-like object; stream it to disk.',
      code: "import shutil, urllib.request\nwith urllib.request.urlopen(url) as resp, open('data.bin', 'wb') as out:\n    shutil.copyfileobj(resp, out)",
    },
    {
      name: 'Decompress a .gz file to disk',
      desc: 'gzip.open gives a readable stream of the decompressed bytes.',
      code: "import gzip, shutil\nwith gzip.open('log.txt.gz', 'rb') as fsrc, open('log.txt', 'wb') as fdst:\n    shutil.copyfileobj(fsrc, fdst)",
    },
    {
      name: 'Concatenate files',
      desc: 'Copy several sources into one open destination, one after another.',
      code: "import shutil\nwith open('all.csv', 'wb') as out:\n    for part in parts:\n        with open(part, 'rb') as f:\n            shutil.copyfileobj(f, out)",
    },
  ],

  examples: [
    { title: 'File to file, binary', code: "import shutil\nfrom pathlib import Path\nPath('in.bin').write_bytes(bytes([0, 1, 2, 255]))\nwith open('in.bin', 'rb') as fsrc, open('out.bin', 'wb') as fdst:\n    shutil.copyfileobj(fsrc, fdst)\nPath('out.bin').read_bytes()", returns: "b'\\x00\\x01\\x02\\xff'" },
    { title: 'Any read()/write() objects work', code: "import io, shutil\ndst = io.StringIO()\nshutil.copyfileobj(io.StringIO('in memory'), dst)\ndst.getvalue()", returns: "'in memory'" },
    { title: 'Decompress on the fly', code: "import gzip, io, shutil\npacked = gzip.compress(b'hello')\ndst = io.BytesIO()\nwith gzip.GzipFile(fileobj=io.BytesIO(packed)) as fsrc:\n    shutil.copyfileobj(fsrc, dst)\ndst.getvalue()", returns: "b'hello'" },
    { title: 'Starts at the current position', code: "import io, shutil\nsrc = io.StringIO('header\\nbody')\nsrc.readline()\ndst = io.StringIO()\nshutil.copyfileobj(src, dst)\ndst.getvalue()", returns: "'body'" },
    { title: 'Writes at the destination position, without truncating', code: "import io, shutil\ndst = io.StringIO('XXXXX')\nshutil.copyfileobj(io.StringIO('ab'), dst)\ndst.getvalue()", returns: "'abXXX'" },
    { title: 'It returns None', code: "import io, shutil\nshutil.copyfileobj(io.StringIO('a'), io.StringIO()) is None", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Mixing a text source with a binary destination',
      desc: 'copyfileobj passes chunks through untouched, so a str chunk cannot go into a binary stream (or bytes into a text one). Open both sides in the same mode.',
      wrong: { label: 'text → binary', code: "import io, shutil\nshutil.copyfileobj(io.StringIO('data'), io.BytesIO())", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'binary → binary', code: "import io, shutil\ndst = io.BytesIO()\nshutil.copyfileobj(io.BytesIO(b'data'), dst)\ndst.getvalue()", output: "b'data'" },
    },
    {
      name: 'Copying from a stream you just wrote',
      desc: 'After writing, the position is at the end, so there is nothing left to read. seek(0) first.',
      wrong: { label: 'no seek', code: "import io, shutil\nsrc = io.StringIO()\nsrc.write('report')\ndst = io.StringIO()\nshutil.copyfileobj(src, dst)\ndst.getvalue()", output: "''" },
      fix:   { label: 'src.seek(0)', code: "import io, shutil\nsrc = io.StringIO()\nsrc.write('report')\nsrc.seek(0)\ndst = io.StringIO()\nshutil.copyfileobj(src, dst)\ndst.getvalue()", output: "'report'" },
    },
    {
      name: 'Reading the destination file before it is flushed',
      desc: 'copyfileobj does not flush. Data written to an open file may still sit in its buffer; read the file after the with block closes it (or call flush()).',
      wrong: { label: 'read inside the with', code: "import io, shutil\nwith open('out.txt', 'w') as fdst:\n    shutil.copyfileobj(io.StringIO('data'), fdst)\n    with open('out.txt') as f:\n        early = f.read()\nearly", output: "''" },
      fix:   { label: 'read after closing', code: "import io, shutil\nwith open('out.txt', 'w') as fdst:\n    shutil.copyfileobj(io.StringIO('data'), fdst)\nwith open('out.txt') as f:\n    later = f.read()\nlater", output: "'data'" },
    },
  ],

  when: {
    use: [
      'You already have open file objects or streams (HTTP responses, gzip/bz2 streams, sockets made into files)',
      'Copying large data with bounded memory',
    ],
    avoid: [
      'Copying one file by path → shutil.copyfile / copy / copy2 (they use faster OS calls where available)',
      'Small data you need in memory anyway → fsrc.read()',
    ],
  },

  notes: {
    cpython:          'Lib/shutil.py: if not length: length = COPY_BUFSIZE; then while buf := fsrc.read(length): fdst.write(buf)',
    'COPY_BUFSIZE':   'A module constant (not in __all__): 1024 * 1024 on Windows, 64 * 1024 elsewhere',
    'Flushing':       'The 3.14 documentation spells it out: the destination is not guaranteed to be flushed when copyfileobj returns',
  },

  related: [
    { name: 'shutil.copyfile', slug: 'copyfile', when: 'Copy by path, with fast OS-level copying' },
    { name: 'shutil module',   slug: 'shutil',   when: 'Overview', category: 'stdlib' },
    { name: 'open()',          slug: 'open',     when: 'Get the file objects to copy between', category: 'functions' },
    { name: 'TypeError',       slug: 'typeerror', when: 'What mixing str and bytes streams raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What buffer size does shutil.copyfileobj use?',
      a: 'With the default length=0 it reads shutil.COPY_BUFSIZE bytes (or characters) per call: 64 KiB on Linux and macOS, 1 MiB on Windows. Pass length to change it; a negative length reads the whole source in one call.',
    },
    {
      q: 'Why did copyfileobj copy nothing?',
      a: 'It copies from the current position of fsrc. If you just wrote to that stream, or already read it, the position is at the end. Call fsrc.seek(0) first.',
    },
    {
      q: 'Is copyfileobj faster than copyfile?',
      a: 'No — copyfile, copy and copy2 can use OS-level fast copies (sendfile on Linux, fcopyfile on macOS) that skip Python entirely. copyfileobj is the general fallback for objects that are not plain files.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.copyfileobj',
    meta:  'shutil.copyfileobj',
  },

};
