// content/reference/python/stdlib/hashlib/hash-attributes.js — hash.name / digest_size / block_size

export const meta = {
  slug:        'hash-attributes',
  name:        'hash.name / digest_size / block_size',
  signature:   'h.name · h.digest_size · h.block_size',
  blurb:       'Read-only facts every hash object carries: its canonical algorithm name, its output size and its internal block size, in bytes.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hash.name hash.digest_size hash.block_size blake2b.name blake2b.digest_size blake2b.block_size blake2s.name blake2s.digest_size blake2s.block_size hashlib digest size block size hash name canonical name hash length bytes',
};

export const method = {
  slug:      'hash-attributes',
  name:      'hash.name / digest_size / block_size',
  signature: 'h.name · h.digest_size · h.block_size',
  returns:   { type: 'str / int / int', desc: 'name is lowercase and always accepted by hashlib.new(); sizes are in bytes.' },

  category:    'hash object attributes',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'digest_size is how many bytes digest() returns (hexdigest() is twice as long); block_size is the chunk the algorithm compresses at a time — what HMAC pads keys to. name is the canonical spelling, whatever alias created the object.',

  covers: [
    'blake2b.name', 'blake2b.digest_size', 'blake2b.block_size',
    'blake2s.name', 'blake2s.digest_size', 'blake2s.block_size',
  ],

  cheat: {
    commonCall: 'h.digest_size',
    returns:    "'sha256', 32, 64 for a SHA-256 object",
    replaces:   'Hard-coding digest lengths per algorithm',
    watchOut:   'SHAKE objects report digest_size 0; BLAKE2 reports the size you asked for',
  },

  parameters: [],

  attributes: [
    { name: 'name',        type: 'str', meaning: "Canonical lowercase name, suitable for hashlib.new(name): 'sha256', 'sha3_512', 'blake2b' — even when created as 'SHA-256'." },
    { name: 'digest_size', type: 'int', meaning: 'Bytes returned by digest(): 16 md5, 20 sha1, 32 sha256, 64 sha512; the chosen size for BLAKE2; 0 for SHAKE.' },
    { name: 'block_size',  type: 'int', meaning: 'Internal block size in bytes: 64 for md5 / sha1 / sha256 / blake2s, 128 for sha384 / sha512 / blake2b, the sponge rate for SHA-3 / SHAKE.' },
  ],

  modes: [
    {
      id: 'table',
      label: 'several algorithms',
      blurb: 'Comma-separated algorithm names → (name, digest_size, block_size) for each.',
      params: [{ name: 'names', type: 'list[str]', hint: 'comma-separated names', input: 'csv' }],
      template: 'import hashlib\n[(h.name, h.digest_size, h.block_size) for h in (hashlib.new(n) for n in {$names})]',
      cases: [
        { id: 'classic', label: 'md5, sha1, sha256', values: { names: 'md5, sha1, sha256' } },
        { id: 'big',     label: 'sha512, sha3_512',  values: { names: 'sha512, sha3_512, blake2b' } },
        { id: 'alias',   label: 'aliases',           values: { names: 'SHA-1, sha-256, SHA3-256' } },
        { id: 'shake',   label: 'SHAKE',             values: { names: 'shake_128, shake_256' } },
      ],
    },
    {
      id: 'blake',
      label: 'BLAKE2 digest_size',
      blurb: 'BLAKE2 objects report the digest size you chose; the name and block size stay the same.',
      params: [{ name: 'size', type: 'int', hint: 'digest_size 1–64', input: 'number' }],
      template: 'import hashlib\nh = hashlib.blake2b(digest_size={$size})\n(h.name, h.digest_size, h.block_size, len(h.hexdigest()))',
      cases: [
        { id: 'twenty', label: '20',  values: { size: '20' } },
        { id: 'one',    label: '1',   values: { size: '1' } },
        { id: 'max',    label: '64',  values: { size: '64' } },
        { id: 'over',   label: '65',  values: { size: '65' } },
      ],
    },
  ],
  demoExplainer: 'MD5, SHA-1 and SHA-256 all have 64-byte blocks but 16-, 20- and 32-byte digests. Created through aliases (SHA-1, sha-256, SHA3-256) the objects still report the canonical names sha1, sha256 and sha3_256. SHAKE reports digest_size 0. blake2b(digest_size=20) reports 20 and a 40-character hexdigest; 65 is over the limit.',

  patterns: [
    {
      name: 'Store the algorithm with the digest',
      desc: 'name is guaranteed to round-trip through hashlib.new().',
      code: "import hashlib\nh = hashlib.new(algo, data)\nrecord = f'{h.name}:{h.hexdigest()}'",
    },
    {
      name: 'Validate a digest length',
      desc: 'Reject hex strings of the wrong size before comparing.',
      code: "import hashlib\nh = hashlib.new(algo)\nif len(received_hex) != 2 * h.digest_size:\n    raise ValueError('bad digest length')",
    },
  ],

  examples: [
    { title: 'BLAKE2 follows the argument', code: 'import hashlib\nh = hashlib.blake2b(digest_size=20)\n(h.name, h.digest_size, h.block_size)', returns: "('blake2b', 20, 128)" },
    { title: 'A small size table',         code: "import hashlib\n[(n, hashlib.new(n).digest_size, hashlib.new(n).block_size) for n in ('md5', 'sha1', 'sha256', 'sha512', 'blake2s')]", returns: "[('md5', 16, 64), ('sha1', 20, 64), ('sha256', 32, 64), ('sha512', 64, 128), ('blake2s', 32, 64)]" },
    { title: 'Alias in, canonical name out', code: "import hashlib\nhashlib.new('SHA-1').name", returns: "'sha1'" },
    { title: 'name round-trips through new()', code: 'import hashlib\nh = hashlib.sha3_384()\nhashlib.new(h.name).digest_size == h.digest_size', returns: 'True' },
    { title: 'SHAKE has no fixed size',    code: 'import hashlib\nhashlib.shake_256().digest_size', returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Hard-coding 32 as "the" digest length',
      desc: 'Code that slices or validates with a fixed 32 breaks as soon as the algorithm changes. Ask the object.',
      wrong: { label: 'assume 32 bytes', code: "import hashlib\nlen(hashlib.new('sha512', b'x').digest()) == 32", output: 'False' },
      fix:   { label: 'h.digest_size',   code: "import hashlib\nh = hashlib.new('sha512', b'x')\nlen(h.digest()) == h.digest_size", output: 'True' },
    },
    {
      name: 'Using digest_size to size SHAKE output',
      desc: 'For SHAKE digest_size is 0, so digest(h.digest_size) returns nothing. Choose a length explicitly.',
      wrong: { label: 'digest(h.digest_size)', code: "import hashlib\nh = hashlib.shake_128(b'x')\nh.digest(h.digest_size)", output: "b''" },
      fix:   { label: 'digest(32)',            code: "import hashlib\nh = hashlib.shake_128(b'x')\nlen(h.digest(32))", output: '32' },
    },
  ],

  when: {
    use: [
      'Generic code that works with any algorithm name',
      'Validating digest lengths and storing "algorithm:digest" records',
    ],
    avoid: [
      'Setting them — they are read-only',
      'Telling algorithms apart by digest_size (sha256, sha3_256 and blake2s are all 32)',
    ],
  },

  notes: {
    cpython:       'Getters on every hash type (_hashlib.HASH, _blake2.blake2b, …); assigning to them raises AttributeError',
    'History':     'The docs note name was formally specified only in Python 3.4, though CPython always had it',
    'block_size':  'HMAC pads or hashes the key to block_size bytes; for SHA-3 it is 200 - 2 × digest_size',
  },

  related: [
    { name: 'update / digest / hexdigest / copy', slug: 'hash-methods', when: 'The methods of the same objects' },
    { name: 'hashlib.new',                        slug: 'new',          when: 'Create an object from a name' },
    { name: 'algorithms_guaranteed / available',  slug: 'algorithms',   when: 'All the names' },
    { name: 'blake2b / blake2s',                  slug: 'blake2b-blake2s', when: 'Where digest_size is a parameter' },
  ],

  faq: [
    {
      q: 'How long is a SHA-256 digest?',
      a: '32 bytes: hashlib.sha256().digest_size is 32, and hexdigest() is 64 characters.',
    },
    {
      q: 'What is block_size used for?',
      a: 'It is the size of the chunks the compression function consumes. You rarely need it, except when implementing HMAC-like constructions, which pad keys to block_size.',
    },
    {
      q: 'Why does h.name say sha256 when I created it with "SHA-256"?',
      a: 'name is the canonical lowercase name, so it can be stored and passed back to hashlib.new() reliably, whatever alias you used.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.hash.digest_size',
    meta:  'Hash objects — name, digest_size, block_size',
  },

};
