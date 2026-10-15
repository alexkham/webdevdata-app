// content/reference/python/stdlib/hashlib/algorithms.js — algorithms_guaranteed / algorithms_available

export const meta = {
  slug:        'algorithms',
  name:        'hashlib.algorithms_guaranteed / algorithms_available',
  signature:   'hashlib.algorithms_guaranteed · hashlib.algorithms_available',
  blurb:       'Two sets of algorithm names: the 14 every Python has, and everything this interpreter (with its OpenSSL) can actually create with hashlib.new().',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'hashlib.algorithms_guaranteed hashlib.algorithms_available algorithms_guaranteed algorithms_available python list hash algorithms supported hash algorithms which hashes are available ripemd160 openssl algorithms',
};

export const method = {
  slug:      'algorithms',
  name:      'hashlib.algorithms_guaranteed / algorithms_available',
  signature: 'hashlib.algorithms_guaranteed · hashlib.algorithms_available',
  returns:   { type: 'set[str]', desc: 'Sets of names accepted by hashlib.new(). algorithms_guaranteed is the same everywhere; algorithms_available depends on the machine.' },

  category:    'hashlib constant',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'algorithms_guaranteed is fixed: md5, sha1, the SHA-2 and SHA-3 families, SHAKE and BLAKE2. algorithms_available adds whatever the linked OpenSSL offers (ripemd160, sm3, sha512_256 …), so it differs between machines — and it is always a superset of the guaranteed set.',

  covers: ['algorithms_guaranteed', 'algorithms_available'],

  cheat: {
    commonCall: "'sha256' in hashlib.algorithms_guaranteed",
    returns:    'set of lowercase names (iteration order is arbitrary — sort it)',
    replaces:   'Calling new() in try/except to probe support',
    watchOut:   'Aliases such as SHA256 work in new() but are not members of these sets',
  },

  parameters: [],

  attributes: [
    { name: 'algorithms_guaranteed', type: 'set[str]', meaning: 'The 14 algorithms supported on all platforms: blake2b, blake2s, md5, sha1, sha224, sha256, sha384, sha3_224, sha3_256, sha3_384, sha3_512, sha512, shake_128, shake_256.' },
    { name: 'algorithms_available',  type: 'set[str]', meaning: 'Everything new() accepts in this interpreter: the guaranteed set plus the names OpenSSL reports. Machine-dependent; may list one algorithm under several names.' },
  ],

  modes: [
    {
      id: 'check',
      label: 'is it guaranteed?',
      blurb: 'Is the name in algorithms_guaranteed — and what does new() make of it?',
      params: [{ name: 'name', type: 'str', hint: 'algorithm name', input: 'text' }],
      template: 'import hashlib\nname = {$name}\n(name in hashlib.algorithms_guaranteed, hashlib.new(name).name)',
      cases: [
        { id: 'sha256', label: 'sha256',   values: { name: 'sha256' } },
        { id: 'upper',  label: 'SHA256',   values: { name: 'SHA256' } },
        { id: 'sha3',   label: 'sha3_256', values: { name: 'sha3_256' } },
        { id: 'dash',   label: 'sha-256',  values: { name: 'sha-256' } },
        { id: 'typo',   label: 'sha265',   values: { name: 'sha265' } },
      ],
    },
    {
      id: 'prefix',
      label: 'filter by prefix',
      blurb: 'The guaranteed names starting with a prefix, sorted (sets have no order of their own).',
      params: [{ name: 'prefix', type: 'str', hint: 'e.g. sha, sha3, blake', input: 'text' }],
      template: 'import hashlib\nsorted(n for n in hashlib.algorithms_guaranteed if n.startswith({$prefix}))',
      cases: [
        { id: 'sha',   label: 'sha',   values: { prefix: 'sha' } },
        { id: 'sha3',  label: 'sha3',  values: { prefix: 'sha3' } },
        { id: 'blake', label: 'blake', values: { prefix: 'blake' } },
        { id: 'all',   label: '(all)', values: { prefix: '' } },
      ],
    },
  ],
  demoExplainer: 'SHA256 and sha-256 are not members (the sets hold canonical lowercase names), yet new() accepts both and reports sha256. A misspelt name is not in the set and makes new() raise. The prefix sha matches 11 names — SHA-1, SHA-2, SHA-3 and SHAKE all start with "sha" — and an empty prefix lists all 14. algorithms_available is not used here because its contents depend on the machine.',

  patterns: [
    {
      name: 'Validate a configured algorithm',
      desc: 'Accept only names every deployment supports.',
      code: "import hashlib\nif algo not in hashlib.algorithms_guaranteed:\n    raise ValueError(f'unsupported checksum algorithm: {algo}')",
    },
    {
      name: 'Use an optional algorithm when present',
      desc: 'algorithms_available reflects this interpreter only.',
      code: "import hashlib\nalgo = 'ripemd160' if 'ripemd160' in hashlib.algorithms_available else 'sha256'\nh = hashlib.new(algo, data)",
    },
    {
      name: 'See what your Python offers',
      desc: 'Run it on each machine; the output varies.',
      code: "import hashlib\nprint(sorted(hashlib.algorithms_available - hashlib.algorithms_guaranteed))",
    },
  ],

  examples: [
    { title: 'The guaranteed set, sorted',  code: 'import hashlib\nsorted(hashlib.algorithms_guaranteed)', returns: "['blake2b', 'blake2s', 'md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha3_224', 'sha3_256', 'sha3_384', 'sha3_512', 'sha512', 'shake_128', 'shake_256']" },
    { title: 'Fourteen names',              code: 'import hashlib\nlen(hashlib.algorithms_guaranteed)', returns: '14' },
    { title: 'A plain set',                 code: 'import hashlib\ntype(hashlib.algorithms_guaranteed).__name__', returns: "'set'" },
    { title: 'Always a subset of available', code: 'import hashlib\nhashlib.algorithms_guaranteed <= hashlib.algorithms_available', returns: 'True' },
    { title: 'Canonical names only',        code: "import hashlib\n[n in hashlib.algorithms_guaranteed for n in ('sha256', 'SHA256', 'sha3_256', 'ripemd160')]", returns: '[True, False, True, False]' },
    { title: 'Every guaranteed name works', code: 'import hashlib\nall(hashlib.new(n).name == n for n in hashlib.algorithms_guaranteed)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Printing the set as-is',
      desc: 'Set iteration order is arbitrary, so the printed list can change from run to run. Sort it for logs, docs and tests.',
      wrong: { label: 'list(the set)',   code: "import hashlib\nlen(list(hashlib.algorithms_guaranteed))", output: '14' },
      fix:   { label: 'sorted(the set)', code: "import hashlib\nsorted(hashlib.algorithms_guaranteed)[:3]", output: "['blake2b', 'blake2s', 'md5']" },
    },
    {
      name: 'Checking an alias against the set',
      desc: 'new() accepts OpenSSL aliases, but the sets contain canonical names only. Normalise through new(...).name before checking.',
      wrong: { label: "'SHA256' in …", code: "import hashlib\n'SHA256' in hashlib.algorithms_guaranteed", output: 'False' },
      fix:   { label: 'canonical name', code: "import hashlib\nhashlib.new('SHA256').name in hashlib.algorithms_guaranteed", output: 'True' },
    },
  ],

  when: {
    use: [
      'Validating user- or config-supplied algorithm names',
      'Feature detection for optional OpenSSL algorithms (algorithms_available)',
    ],
    avoid: [
      'Expecting algorithms_available to match between dev and production machines',
      'Listing algorithms for display without sorted()',
    ],
  },

  notes: {
    cpython:       'Lib/hashlib.py: algorithms_guaranteed = set(__always_supported); algorithms_available = that set plus _hashlib.openssl_md_meth_names when OpenSSL is present',
    'Machine-dependent': 'algorithms_available is computed at import from the linked OpenSSL; with OpenSSL 3.0 it typically adds md5-sha1, ripemd160, sha512_224, sha512_256 and sm3, but other builds differ',
    'Version':     'Both added in Python 3.2',
  },

  related: [
    { name: 'hashlib.new',                    slug: 'new',             when: 'Create a hash from any of these names' },
    { name: 'name / digest_size / block_size', slug: 'hash-attributes', when: 'Inspect what new() returns' },
    { name: 'hashlib module',                 slug: 'hashlib',         when: 'All algorithms at a glance', category: 'stdlib' },
    { name: 'set',                            slug: 'set',             when: 'Membership and subset tests', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I list the hash algorithms Python supports?',
      a: 'sorted(hashlib.algorithms_available) for this interpreter, sorted(hashlib.algorithms_guaranteed) for the 14 that every Python has.',
    },
    {
      q: 'Why is ripemd160 missing on some machines?',
      a: 'It is not guaranteed: it exists only if the OpenSSL your Python is linked against provides it, which varies between OpenSSL versions and configurations. Check algorithms_available before relying on it.',
    },
    {
      q: 'Why does algorithms_available contain duplicates of the same hash?',
      a: 'The docs note that OpenSSL may list one algorithm under several names. Use new(name).name to get a canonical name.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#hashlib.algorithms_guaranteed',
    meta:  'hashlib.algorithms_guaranteed, algorithms_available',
  },

};
