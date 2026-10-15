// content/reference/python/stdlib/hashlib/new.js

export const meta = {
  slug:        'new',
  name:        'hashlib.new',
  signature:   'hashlib.new(name, [data, ]*, usedforsecurity=True)',
  blurb:       'Create a hash object from an algorithm name string — for algorithms chosen at run time, and for extra algorithms your OpenSSL provides.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'hashlib.new python hashlib new algorithm name string unsupported hash type valueerror ripemd160 sha512_256 openssl algorithm by name dynamic hash algorithm name must be a string',
};

export const method = {
  slug:      'new',
  name:      'hashlib.new',
  signature: 'hashlib.new(name, [data, ]*, usedforsecurity=True)',
  returns:   { type: 'hash object', desc: 'The same kind of object the named constructor returns; its name attribute is the canonical lowercase name.' },

  category:    'hashlib function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'hashlib.new(\'sha256\', data) equals hashlib.sha256(data), just slower to look up. Use it when the algorithm comes from configuration or a file format, or for OpenSSL-only algorithms that have no named constructor. Unknown names raise ValueError: unsupported hash type.',

  covers: ['new'],

  cheat: {
    commonCall: "hashlib.new('sha256', data).hexdigest()",
    returns:    'a hash object of the named algorithm',
    replaces:   'getattr(hashlib, name)(data) — which misses OpenSSL-only names',
    watchOut:   'Algorithms outside algorithms_guaranteed may be missing on other machines',
  },

  parameters: [
    { name: 'name',            type: 'str',        required: true,  default: null,   desc: "Algorithm name: a Python name ('sha256', 'sha3_256', 'blake2b') or a name OpenSSL knows ('SHA256', 'sha-256', 'ripemd160'). Not stripped: ' sha256' fails." },
    { name: 'data',            type: 'bytes-like', required: false, default: "b''",  desc: 'Initial data, same as an immediate update(data).' },
    { name: 'usedforsecurity', type: 'bool',       required: false, default: 'True', desc: 'Keyword-only (3.9+); passed to the constructor.' },
    { name: '**kwargs',        type: 'any',        required: false, default: null,   desc: "Passed through to the constructor, e.g. digest_size= and key= for 'blake2b' / 'blake2s'." },
  ],

  modes: [
    {
      id: 'byname',
      label: 'by name',
      blurb: 'Type an algorithm name. The tuple shows the canonical name the object reports and the first 16 hex digits of the digest.',
      params: [
        { name: 'name', type: 'str', hint: 'algorithm name', input: 'text' },
        { name: 'text', type: 'str', hint: 'data',           input: 'text' },
      ],
      template: 'import hashlib\nh = hashlib.new({$name}, {$text}.encode())\n(h.name, h.hexdigest()[:16])',
      cases: [
        { id: 'sha256',  label: 'sha256',    values: { name: 'sha256', text: 'abc' } },
        { id: 'upper',   label: 'SHA256',    values: { name: 'SHA256', text: 'abc' } },
        { id: 'dash',    label: 'sha-256',   values: { name: 'sha-256', text: 'abc' } },
        { id: 'sha3',    label: 'sha3_256',  values: { name: 'sha3_256', text: 'abc' } },
        { id: 'blake',   label: 'blake2b',   values: { name: 'blake2b', text: 'abc' } },
        { id: 'BLAKE',   label: 'BLAKE2B',   values: { name: 'BLAKE2B', text: 'abc' } },
        { id: 'unknown', label: 'sha257',    values: { name: 'sha257', text: 'abc' } },
        { id: 'shake',   label: 'shake_128', values: { name: 'shake_128', text: 'abc' } },
      ],
    },
    {
      id: 'sizes',
      label: 'several names',
      blurb: 'A comma-separated list of names → their digest sizes in bytes.',
      params: [{ name: 'names', type: 'list[str]', hint: 'comma-separated names', input: 'csv' }],
      template: 'import hashlib\n[(n, hashlib.new(n).digest_size) for n in {$names}]',
      cases: [
        { id: 'classic', label: 'md5, sha1, sha256', values: { names: 'md5, sha1, sha256' } },
        { id: 'big',     label: 'SHA-2 family',      values: { names: 'sha224, sha256, sha384, sha512' } },
        { id: 'bad',     label: 'with a typo',       values: { names: 'sha256, sha265' } },
      ],
    },
  ],
  demoExplainer: "SHA256 and sha-256 both give a hash object whose name is plain sha256: OpenSSL accepts its own spellings in any letter case (Sha256 works too). BLAKE2B fails although blake2b works: hashlib's own names (blake2b, sha3_256) are matched exactly; only OpenSSL's spellings (BLAKE2b512, SHA3-256) ignore case. shake_128 is created fine, but hexdigest() without a length raises TypeError. A single misspelt name fails the whole list.",

  patterns: [
    {
      name: 'Algorithm from configuration',
      desc: 'Validate the name once at startup so a typo fails early.',
      code: "import hashlib\nALGO = settings.get('checksum_algorithm', 'sha256')\nhashlib.new(ALGO)  # raises ValueError now, not on the first upload",
    },
    {
      name: 'Hash with whatever the manifest says',
      desc: 'File formats often store the algorithm name next to the digest.',
      code: "import hashlib\nalgo, expected = entry['hash'].split(':', 1)  # 'sha256:3a6e…'\nok = hashlib.new(algo, data).hexdigest() == expected",
    },
    {
      name: 'An OpenSSL-only algorithm, with a fallback',
      desc: 'Check algorithms_available first; it differs between machines.',
      code: "import hashlib\nif 'ripemd160' in hashlib.algorithms_available:\n    h = hashlib.new('ripemd160', data)",
    },
  ],

  examples: [
    { title: 'Same as the named constructor', code: "import hashlib\nhashlib.new('sha3_256', b'x').digest() == hashlib.sha3_256(b'x').digest()", returns: 'True' },
    { title: 'Create, then update',           code: "import hashlib\nh = hashlib.new('md5')\nh.update(b'abc')\nh.hexdigest()", returns: "'900150983cd24fb0d6963f7d28e17f72'" },
    { title: 'Aliases → canonical name',      code: "import hashlib\n[hashlib.new(n).name for n in ('SHA256', 'sha-256', 'SHA2-256')]", returns: "['sha256', 'sha256', 'sha256']" },
    { title: 'Keyword arguments pass through', code: "import hashlib\nhashlib.new('blake2b', b'abc', digest_size=16).hexdigest()", returns: "'cf4ab791c62b8d2b2109c90275287816'" },
    { title: 'Unknown name',                  code: "import hashlib\nhashlib.new('sha257')", returns: 'ValueError: unsupported hash type sha257' },
    { title: 'The name must be a str',        code: 'import hashlib\nhashlib.new(256)', returns: 'TypeError: name must be a string' },
  ],

  pitfalls: [
    {
      name: 'Whitespace or case from user input',
      desc: "Names are not stripped, and hashlib's own names such as blake2b are case-sensitive. Normalise configuration values first.",
      wrong: { label: "' BLAKE2B'",                 code: "import hashlib\nhashlib.new(' BLAKE2B')", output: 'ValueError: unsupported hash type  BLAKE2B' },
      fix:   { label: ".strip().lower()",           code: "import hashlib\nhashlib.new(' BLAKE2B'.strip().lower()).name", output: "'blake2b'" },
    },
    {
      name: 'Relying on an algorithm from your machine only',
      desc: 'ripemd160, sha512_256, sm3 and similar come from OpenSSL and are not guaranteed. Code that must run everywhere should stick to algorithms_guaranteed.',
      wrong: { label: 'assume available',   code: "import hashlib\n'ripemd160' in hashlib.algorithms_guaranteed", output: 'False' },
      fix:   { label: 'guaranteed name',    code: "import hashlib\n'sha256' in hashlib.algorithms_guaranteed", output: 'True' },
    },
  ],

  when: {
    use: [
      'The algorithm name is data: configuration, manifests, "sha256:…" prefixes, database columns',
      'Algorithms without a named constructor (OpenSSL extras)',
    ],
    avoid: [
      'A fixed algorithm in code → the named constructor (hashlib.sha256) is faster and clearer',
      'Checking support → look in hashlib.algorithms_available instead of catching ValueError everywhere',
    ],
  },

  notes: {
    cpython:      "Lib/hashlib.py __hash_new: 'blake2b' / 'blake2s' go to the built-in _blake2; every other name goes to OpenSSL (_hashlib.new) and, if OpenSSL raises ValueError, to the built-in constructors, which raise ValueError('unsupported hash type ' + name)",
    'Names':      "OpenSSL matches its own names case-insensitively (SHA256, Sha-256, 2.16.840.1.101.3.4.2.1 for SHA-256); the Python names sha3_256 / blake2b are matched exactly",
    'Speed':      'The docs note that named constructors are faster than new() with a name',
  },

  related: [
    { name: 'algorithms_guaranteed / available', slug: 'algorithms', when: 'Which names will work' },
    { name: 'hashlib.sha256',                    slug: 'sha256',     when: 'The named constructor for the common case' },
    { name: 'name / digest_size / block_size',   slug: 'hash-attributes', when: 'What the created object reports' },
    { name: 'hashlib.file_digest',               slug: 'file_digest', when: 'Also takes an algorithm name' },
    { name: 'ValueError',                        slug: 'valueerror', when: 'What an unknown name raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "ValueError: unsupported hash type" mean?',
      a: 'Neither OpenSSL nor Python\'s built-in modules know that name on this machine. Check the spelling (sha3_256 with an underscore, blake2b in lowercase) and compare with sorted(hashlib.algorithms_available).',
    },
    {
      q: 'Should I use hashlib.new("sha256") or hashlib.sha256()?',
      a: 'hashlib.sha256() when the algorithm is fixed in your code: it is faster and typo-proof. new() when the name is only known at run time.',
    },
    {
      q: 'How do I use RIPEMD-160 in Python?',
      a: "hashlib.new('ripemd160', data) works when your Python's OpenSSL provides it — check 'ripemd160' in hashlib.algorithms_available first, because it is not guaranteed.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.new',
    meta:  'hashlib.new',
  },

};
