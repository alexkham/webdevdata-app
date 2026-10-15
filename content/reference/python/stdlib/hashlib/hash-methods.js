// content/reference/python/stdlib/hashlib/hash-methods.js — hash.update / digest / hexdigest / copy

export const meta = {
  slug:        'hash-methods',
  name:        'hash.update / digest / hexdigest / copy',
  signature:   'h.update(data) · h.digest() · h.hexdigest() · h.copy()',
  blurb:       'The four methods every hashlib object has: feed bytes, read the digest as bytes or hex, clone the state for a shared prefix.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hash.update hash.digest hash.hexdigest hash.copy blake2b.update blake2b.digest blake2b.hexdigest blake2b.copy blake2s.update blake2s.digest blake2s.hexdigest blake2s.copy hashlib update incremental hashing hash large file in chunks digest vs hexdigest copy hash object nonetype object has no attribute hexdigest',
};

export const method = {
  slug:      'hash-methods',
  name:      'hash.update / digest / hexdigest / copy',
  signature: 'h.update(data) · h.digest() · h.hexdigest() · h.copy()',
  returns:   { type: 'None / bytes / str / hash object', desc: 'update() returns None; digest() bytes of digest_size; hexdigest() a str twice as long; copy() an independent object with the same state.' },

  category:    'hash object methods',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Identical on every algorithm (BLAKE2 classes and the OpenSSL / built-in hash objects alike). update() appends — repeated calls equal one call with the concatenation. digest() and hexdigest() do not finish the object: you can read, update more, and read again.',

  covers: [
    'blake2b.update', 'blake2b.digest', 'blake2b.hexdigest', 'blake2b.copy',
    'blake2s.update', 'blake2s.digest', 'blake2s.hexdigest', 'blake2s.copy',
  ],

  cheat: {
    commonCall: 'h = hashlib.sha256(); h.update(chunk); h.hexdigest()',
    returns:    'update → None, digest → bytes, hexdigest → str, copy → new object',
    replaces:   'Concatenating everything into one big bytes object before hashing',
    watchOut:   'update() returns None, so hashlib.sha256().update(x).hexdigest() fails',
  },

  parameters: [
    { name: 'data', type: 'bytes-like', required: true, default: null, desc: 'Argument of update(): bytes, bytearray or memoryview. str raises TypeError: Strings must be encoded before hashing.' },
  ],

  attributes: [
    { name: 'update(data)', type: 'None',        meaning: 'Append data to what has been hashed so far. h.update(a); h.update(b) is h.update(a + b).' },
    { name: 'digest()',     type: 'bytes',       meaning: 'The digest of everything fed so far, digest_size bytes. Does not reset or close the object. (SHAKE: digest(length).)' },
    { name: 'hexdigest()',  type: 'str',         meaning: 'digest() as lowercase hex, 2 × digest_size characters — the same as digest().hex(). (SHAKE: hexdigest(length).)' },
    { name: 'copy()',       type: 'hash object', meaning: 'A clone of the current state; updating one does not affect the other.' },
  ],

  modes: [
    {
      id: 'parts',
      label: 'update in parts',
      blurb: 'Feed comma-separated parts one at a time into any algorithm, then compare with hashing the joined text in one go.',
      params: [
        { name: 'name',  type: 'str',       hint: 'algorithm',             input: 'text' },
        { name: 'parts', type: 'list[str]', hint: 'comma-separated parts', input: 'csv' },
      ],
      template: "import hashlib\nh = hashlib.new({$name})\nfor part in {$parts}:\n    h.update(part.encode())\n(h.hexdigest()[:16], h.hexdigest() == hashlib.new({$name}, ''.join({$parts}).encode()).hexdigest())",
      cases: [
        { id: 'sha256', label: 'sha256', values: { name: 'sha256', parts: 'a,b,c' } },
        { id: 'blake',  label: 'blake2s', values: { name: 'blake2s', parts: 'hello, world' } },
        { id: 'md5',    label: 'md5, no parts', values: { name: 'md5', parts: '' } },
      ],
    },
    {
      id: 'copy',
      label: 'copy a prefix',
      blurb: 'Hash a shared prefix once, then copy() the state for each suffix — same results as hashing prefix + suffix from scratch.',
      params: [
        { name: 'prefix',   type: 'str',       hint: 'shared prefix',             input: 'text' },
        { name: 'suffixes', type: 'list[str]', hint: 'comma-separated suffixes', input: 'csv' },
      ],
      template: "import hashlib\nbase = hashlib.sha256({$prefix}.encode())\nout = []\nfor s in {$suffixes}:\n    h = base.copy()\n    h.update(s.encode())\n    out.append((s, h.hexdigest()[:12], h.hexdigest() == hashlib.sha256(({$prefix} + s).encode()).hexdigest()))\nout",
      cases: [
        { id: 'users', label: 'user: ids', values: { prefix: 'user:', suffixes: '1,2,3' } },
        { id: 'empty', label: 'empty prefix', values: { prefix: '', suffixes: 'a,b' } },
      ],
    },
    {
      id: 'forms',
      label: 'digest vs hexdigest',
      blurb: 'The same digest as bytes and as text: lengths, and whether hexdigest() equals digest().hex().',
      params: [
        { name: 'name', type: 'str', hint: 'algorithm', input: 'text' },
        { name: 'text', type: 'str', hint: 'data',      input: 'text' },
      ],
      template: 'import hashlib\nh = hashlib.new({$name}, {$text}.encode())\n(len(h.digest()), len(h.hexdigest()), h.hexdigest() == h.digest().hex())',
      cases: [
        { id: 'md5',    label: 'md5',     values: { name: 'md5', text: 'abc' } },
        { id: 'sha512', label: 'sha512',  values: { name: 'sha512', text: 'abc' } },
        { id: 'shake',  label: 'shake_128', values: { name: 'shake_128', text: 'abc' } },
      ],
    },
  ],
  demoExplainer: 'Parts a, b and c fed separately give exactly SHA-256 of "abc" (ba7816bf…). The copy tab hashes "user:" once and reuses that state for every suffix; each result equals hashing the full string. In the last tab MD5 is 16 bytes and 32 hex characters; SHAKE refuses digest() without a length, so its tuple fails with TypeError.',

  patterns: [
    {
      name: 'Hash a large file in chunks',
      desc: 'The classic loop for Python < 3.11 (3.11+: hashlib.file_digest).',
      code: "import hashlib\nh = hashlib.sha256()\nwith open('big.bin', 'rb') as f:\n    for chunk in iter(lambda: f.read(1 << 16), b''):\n        h.update(chunk)\nchecksum = h.hexdigest()",
    },
    {
      name: 'Hash several fields unambiguously',
      desc: 'Length-prefix each part so ("ab", "c") and ("a", "bc") differ.',
      code: "import hashlib\nh = hashlib.sha256()\nfor field in fields:\n    data = field.encode()\n    h.update(len(data).to_bytes(4, 'big'))\n    h.update(data)",
    },
    {
      name: 'Many messages with one prefix',
      desc: 'copy() avoids re-hashing a long shared header.',
      code: "import hashlib\nbase = hashlib.sha256(header)\ndigests = []\nfor body in bodies:\n    h = base.copy()\n    h.update(body)\n    digests.append(h.hexdigest())",
    },
  ],

  examples: [
    { title: 'update() returns None',        code: "import hashlib\nh = hashlib.sha256()\nh.update(b'abc') is None", returns: 'True' },
    { title: 'Reading does not finish it',   code: "import hashlib\nh = hashlib.sha256(b'abc')\nh.digest() == h.digest()", returns: 'True' },
    { title: 'hexdigest() is digest().hex()', code: "import hashlib\nh = hashlib.blake2s(b'abc')\nh.hexdigest() == h.digest().hex()", returns: 'True' },
    { title: 'copy() is independent',         code: "import hashlib\na = hashlib.md5(b'x')\nb = a.copy()\nb.update(b'y')\n(a.hexdigest() == hashlib.md5(b'x').hexdigest(), b.hexdigest() == hashlib.md5(b'xy').hexdigest())", returns: '(True, True)' },
    { title: 'Any bytes-like object',         code: "import hashlib\nhashlib.sha256(bytearray(b'abc')).hexdigest() == hashlib.sha256(memoryview(b'abc')).hexdigest()", returns: 'True' },
    { title: 'str is rejected',               code: "import hashlib\nhashlib.sha256().update('abc')", returns: 'TypeError: Strings must be encoded before hashing' },
    { title: 'An int is rejected too',             code: 'import hashlib\nhashlib.sha256().update(42)', returns: 'TypeError: object supporting the buffer API required' },
    { title: 'BLAKE2 digest() takes no length', code: 'import hashlib\nhashlib.blake2b().digest(16)', returns: 'TypeError: blake2b.digest() takes no arguments (1 given)' },
  ],

  pitfalls: [
    {
      name: 'Chaining update() and hexdigest()',
      desc: 'update() mutates the object and returns None, so a one-line chain calls hexdigest() on None. Pass the data to the constructor instead.',
      wrong: { label: '.update(x).hexdigest()', code: "import hashlib\nhashlib.sha256().update(b'abc').hexdigest()", output: "AttributeError: 'NoneType' object has no attribute 'hexdigest'" },
      fix:   { label: 'sha256(x).hexdigest()',  code: "import hashlib\nhashlib.sha256(b'abc').hexdigest()[:16]", output: "'ba7816bf8f01cfea'" },
    },
    {
      name: 'Ambiguous concatenation',
      desc: 'update() simply concatenates, so different field splits can collide. Add a separator or a length prefix.',
      wrong: { label: 'raw fields', code: "import hashlib\na = hashlib.sha256(); a.update(b'ab'); a.update(b'c')\nb = hashlib.sha256(); b.update(b'a'); b.update(b'bc')\na.digest() == b.digest()", output: 'True' },
      fix:   { label: 'length-prefixed', code: "import hashlib\ndef h(*fields):\n    m = hashlib.sha256()\n    for f in fields:\n        m.update(len(f).to_bytes(4, 'big') + f)\n    return m.digest()\nh(b'ab', b'c') == h(b'a', b'bc')", output: 'False' },
    },
  ],

  when: {
    use: [
      'Data that arrives in pieces: files, network streams, generators',
      'Many digests that share a long prefix (copy())',
    ],
    avoid: [
      'Whole files on 3.11+ → hashlib.file_digest does the loop for you',
      'Small one-off values → pass the data to the constructor: hashlib.sha256(data).hexdigest()',
    ],
  },

  notes: {
    cpython:    'The OpenSSL objects are _hashlib.HASH (HASHXOF for SHAKE); the built-in ones are _sha2.SHA256Type, _blake2.blake2b and so on — all implement the same four methods',
    'Threads':  'update() releases the GIL for more than 2047 bytes at a time',
    'SHAKE':    'shake_128 / shake_256 objects take a length: digest(n), hexdigest(n)',
  },

  related: [
    { name: 'name / digest_size / block_size', slug: 'hash-attributes', when: 'The attributes of the same objects' },
    { name: 'hashlib.file_digest',             slug: 'file_digest',     when: 'The chunked-file loop, built in' },
    { name: 'hashlib.sha256',                  slug: 'sha256',          when: 'The usual constructor' },
    { name: 'shake_128 / shake_256',           slug: 'shake',           when: 'digest(length) variants' },
    { name: 'bytes.hex()',                     slug: 'bytes-hex',       when: 'What hexdigest() equals', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I hash a large file without loading it into memory?',
      a: "Call update() with chunks: for chunk in iter(lambda: f.read(65536), b''): h.update(chunk). On Python 3.11+ hashlib.file_digest(f, 'sha256') does the same.",
    },
    {
      q: 'Why do I get "NoneType object has no attribute hexdigest"?',
      a: 'update() returns None. Write h.update(data) on its own line, or pass the data to the constructor: hashlib.sha256(data).hexdigest().',
    },
    {
      q: 'Can I keep updating after calling digest()?',
      a: 'Yes. digest() and hexdigest() compute the value for the data so far without changing the object; later update() calls continue from the same state.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hash-objects',
    meta:  'Hash objects — update, digest, hexdigest, copy',
  },

};
