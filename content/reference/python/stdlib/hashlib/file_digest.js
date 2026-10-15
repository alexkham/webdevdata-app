// content/reference/python/stdlib/hashlib/file_digest.js

export const meta = {
  slug:        'file_digest',
  name:        'hashlib.file_digest',
  signature:   'hashlib.file_digest(fileobj, digest, /)',
  blurb:       'Hash an open binary file (or BytesIO) in one call and get the hash object back — the chunked read loop, built in (3.11+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'hashlib.file_digest file_digest python hash file sha256 of file md5 of file checksum file python 3.11 is not a file-like object in binary reading mode bytesio hash large file',
};

export const method = {
  slug:      'file_digest',
  name:      'hashlib.file_digest',
  signature: 'hashlib.file_digest(fileobj, digest, /)',
  returns:   { type: 'hash object', desc: 'The hash object after it has been updated with the whole remaining content; call hexdigest() on it.' },

  category:    'hashlib function',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'Pass a file opened with \'rb\' and an algorithm name (or constructor). It reads in 256 KiB chunks into a reused buffer, so even huge files hash in constant memory. Text-mode files are refused with ValueError.',

  covers: ['file_digest'],

  cheat: {
    commonCall: "with open(path, 'rb') as f: hashlib.file_digest(f, 'sha256').hexdigest()",
    returns:    'the hash object, not a string',
    replaces:   "for chunk in iter(lambda: f.read(65536), b''): h.update(chunk)",
    watchOut:   "Open the file in binary mode ('rb'); you still close it yourself",
  },

  parameters: [
    { name: 'fileobj', type: 'binary file-like', required: true, default: null, desc: "A file from open(path, 'rb'), an io.BytesIO, a socket file … anything with readinto() that is readable. Positional only." },
    { name: 'digest',  type: 'str | callable',   required: true, default: null, desc: "An algorithm name for hashlib.new ('sha256'), a constructor (hashlib.sha256) or any callable returning a hash-like object (lambda: hmac.new(key, digestmod='sha256')). Positional only." },
  ],

  modes: [
    {
      id: 'bytesio',
      label: 'in-memory file',
      blurb: 'io.BytesIO behaves like a binary file. Choose the algorithm by name.',
      params: [
        { name: 'text', type: 'str', hint: 'file content', input: 'text' },
        { name: 'algo', type: 'str', hint: 'algorithm',    input: 'text' },
      ],
      template: 'import hashlib, io\nhashlib.file_digest(io.BytesIO({$text}.encode()), {$algo}).hexdigest()',
      cases: [
        { id: 'sha256', label: 'sha256',    values: { text: 'abc', algo: 'sha256' } },
        { id: 'md5',    label: 'md5',       values: { text: 'hello world', algo: 'md5' } },
        { id: 'sha3',   label: 'sha3_256',  values: { text: 'abc', algo: 'sha3_256' } },
        { id: 'shake',  label: 'shake_128', values: { text: 'abc', algo: 'shake_128' } },
        { id: 'typo',   label: 'typo',      values: { text: 'abc', algo: 'sha265' } },
      ],
    },
    {
      id: 'file',
      label: 'a real file',
      blurb: 'Write the text to a file, open it in binary mode and hash it — the usual recipe for checksums.',
      params: [{ name: 'text', type: 'str', hint: 'file content', input: 'text' }],
      template: "import hashlib\nfrom pathlib import Path\nPath('upload.bin').write_bytes({$text}.encode())\nwith open('upload.bin', 'rb') as f:\n    digest = hashlib.file_digest(f, 'sha256')\n(Path('upload.bin').stat().st_size, digest.hexdigest()[:16])",
      cases: [
        { id: 'hello', label: 'hello world', values: { text: 'hello world' } },
        { id: 'empty', label: 'empty file',  values: { text: '' } },
        { id: 'utf8',  label: 'non-ASCII',   values: { text: 'Zoë 🙂' } },
      ],
    },
  ],
  demoExplainer: 'The digest equals hashing the same bytes directly: "abc" gives ba7816bf… for SHA-256 here too. A SHAKE object is returned fine, but hexdigest() needs a length; a misspelt name fails in hashlib.new before anything is read. In the second tab the size column counts bytes, so "Zoë 🙂" is 9 bytes, and the empty file still has the 64-digit digest of nothing (e3b0c442…).',

  patterns: [
    {
      name: 'Checksum of a download',
      desc: 'Compare with the published value.',
      code: "import hashlib\nwith open('python-3.13.tar.xz', 'rb') as f:\n    ok = hashlib.file_digest(f, 'sha256').hexdigest() == expected.lower()",
    },
    {
      name: 'Several files, one algorithm',
      desc: 'A manifest of name → digest.',
      code: "import hashlib\nfrom pathlib import Path\nmanifest = {}\nfor p in Path('dist').glob('*.whl'):\n    with p.open('rb') as f:\n        manifest[p.name] = hashlib.file_digest(f, 'sha256').hexdigest()",
    },
    {
      name: 'HMAC of a file',
      desc: 'Any callable that returns a hash-like object works (from the docs).',
      code: "import hashlib, hmac\nwith open('payload.bin', 'rb') as f:\n    mac = hashlib.file_digest(f, lambda: hmac.new(key, digestmod=hashlib.sha256))\nsignature = mac.hexdigest()",
    },
    {
      name: 'Before Python 3.11',
      desc: 'The equivalent loop.',
      code: "import hashlib\nh = hashlib.sha256()\nwith open(path, 'rb') as f:\n    for chunk in iter(lambda: f.read(1 << 18), b''):\n        h.update(chunk)",
    },
  ],

  examples: [
    { title: 'From an in-memory file',    code: "import hashlib, io\nhashlib.file_digest(io.BytesIO(b'abc'), 'sha256').hexdigest()[:16]", returns: "'ba7816bf8f01cfea'" },
    { title: 'From a file on disk',       code: "import hashlib\nfrom pathlib import Path\nPath('data.bin').write_bytes(b'hello world')\nwith open('data.bin', 'rb') as f:\n    digest = hashlib.file_digest(f, 'sha256')\ndigest.hexdigest()[:16]", returns: "'b94d27b9934d3e08'" },
    { title: 'A constructor instead of a name', code: "import hashlib, io\nhashlib.file_digest(io.BytesIO(b'abc'), hashlib.md5).hexdigest()", returns: "'900150983cd24fb0d6963f7d28e17f72'" },
    { title: 'Any factory, e.g. BLAKE2 options', code: "import hashlib, io\nhashlib.file_digest(io.BytesIO(b'abc'), lambda: hashlib.blake2b(digest_size=8)).hexdigest()", returns: "'d8bb14d833d59559'" },
    { title: 'It returns the hash object',  code: "import hashlib, io\nd = hashlib.file_digest(io.BytesIO(b''), 'sha1')\n(d.name, d.hexdigest())", returns: "('sha1', 'da39a3ee5e6b4b0d3255bfef95601890afd80709')" },
    { title: 'bytes are not a file',        code: "import hashlib\nhashlib.file_digest(b'abc', 'sha256')", returns: "ValueError: 'b'abc'' is not a file-like object in binary reading mode." },
  ],

  pitfalls: [
    {
      name: 'Opening the file in text mode',
      desc: 'A text file has no readinto(), so file_digest refuses it — hashes are defined on bytes, and text mode would also translate newlines.',
      wrong: { label: 'open(path)',       code: "import hashlib\nfrom pathlib import Path\nPath('notes.txt').write_text('hi', encoding='utf-8')\nwith open('notes.txt', encoding='utf-8') as f:\n    hashlib.file_digest(f, 'sha256')", output: "ValueError: '<_io.TextIOWrapper name='notes.txt' mode='r' encoding='utf-8'>' is not a file-like object in binary reading mode." },
      fix:   { label: "open(path, 'rb')", code: "import hashlib\nfrom pathlib import Path\nPath('notes.txt').write_text('hi', encoding='utf-8')\nwith open('notes.txt', 'rb') as f:\n    print(hashlib.file_digest(f, 'sha256').hexdigest()[:16])", output: '8f434346648f6b96' },
    },
    {
      name: 'A partly read file',
      desc: 'A real file is hashed from its current position — here only b"body". (An io.BytesIO is the exception: its whole buffer is hashed.) Seek to 0 first if you read from it earlier.',
      wrong: { label: 'after f.read(7)', code: "import hashlib\nfrom pathlib import Path\nPath('data.bin').write_bytes(b'header:body')\nwith open('data.bin', 'rb') as f:\n    f.read(7)\n    d = hashlib.file_digest(f, 'sha256')\nd.hexdigest() == hashlib.sha256(b'header:body').hexdigest()", output: 'False' },
      fix:   { label: 'f.seek(0) first', code: "import hashlib\nfrom pathlib import Path\nPath('data.bin').write_bytes(b'header:body')\nwith open('data.bin', 'rb') as f:\n    f.read(7)\n    f.seek(0)\n    d = hashlib.file_digest(f, 'sha256')\nd.hexdigest() == hashlib.sha256(b'header:body').hexdigest()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Checksums of files of any size on Python 3.11+',
      'Hashing sockets or other binary streams',
    ],
    avoid: [
      'Data already in memory → hashlib.sha256(data)',
      'Python 3.10 and older → the read/update loop',
    ],
  },

  notes: {
    cpython:      "Lib/hashlib.py: a str digest goes through hashlib.new; objects with getbuffer() (io.BytesIO) are hashed in one update of the whole buffer; other files must have readinto() and be readable, and are read into a reusable 2**18-byte buffer",
    'Exceptions': "ValueError: '<repr>' is not a file-like object in binary reading mode. for text files and non-files; ValueError: unsupported hash type for unknown names",
    'Version':    'Added in 3.11. Since 3.13.4 a file in non-blocking mode raises BlockingIOError instead of producing a wrong digest',
  },

  related: [
    { name: 'update / digest / hexdigest', slug: 'hash-methods', when: 'The manual chunk loop' },
    { name: 'hashlib.sha256',              slug: 'sha256',       when: 'Hash bytes already in memory' },
    { name: 'hashlib.new',                 slug: 'new',          when: 'How the digest name is resolved' },
    { name: 'open()',                      slug: 'open',         when: "Open files in binary mode with 'rb'", category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the SHA-256 checksum of a file in Python?',
      a: "with open(path, 'rb') as f: checksum = hashlib.file_digest(f, 'sha256').hexdigest() on Python 3.11+. On older versions, update() a sha256 object with chunks from f.read(65536) until it returns b''.",
    },
    {
      q: 'What does "is not a file-like object in binary reading mode" mean?',
      a: "The object has no readinto() or is not readable — usually a file opened in text mode ('r'), or raw bytes passed instead of a file. Open the file with 'rb', or hash the bytes directly with hashlib.sha256(data).",
    },
    {
      q: 'Does file_digest close the file?',
      a: 'No. Use a with block. The docs also say the file is in an unknown state afterwards (its position may have moved), so do not keep reading from it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.file_digest',
    meta:  'hashlib.file_digest',
  },

};
