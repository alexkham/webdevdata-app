// content/reference/python/stdlib/hashlib/blake2b-blake2s.js — blake2b / blake2s and their size constants

export const meta = {
  slug:        'blake2b-blake2s',
  name:        'hashlib.blake2b / blake2s',
  signature:   "hashlib.blake2b(data=b'', *, digest_size=64, key=b'', salt=b'', person=b'', fanout=1, depth=1, leaf_size=0, node_offset=0, node_depth=0, inner_size=0, last_node=False, usedforsecurity=True)",
  blurb:       'BLAKE2 (RFC 7693): fast modern hashes with built-in keyed hashing (a MAC without hmac), salts, personalization strings and any digest size up to 64 / 32 bytes.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'hashlib.blake2b hashlib.blake2s blake2b blake2s blake2 python keyed hash mac digest_size key salt person personalization tree hashing blake2b.SALT_SIZE blake2b.PERSON_SIZE blake2b.MAX_KEY_SIZE blake2b.MAX_DIGEST_SIZE blake2s.SALT_SIZE blake2s.PERSON_SIZE blake2s.MAX_KEY_SIZE blake2s.MAX_DIGEST_SIZE maximum key length digest_size must be between',
};

export const method = {
  slug:      'blake2b-blake2s',
  name:      'hashlib.blake2b / blake2s',
  signature: "hashlib.blake2b(data=b'', *, digest_size=64, key=b'', salt=b'', person=b'', fanout=1, depth=1, leaf_size=0, node_offset=0, node_depth=0, inner_size=0, last_node=False, usedforsecurity=True)",
  returns:   { type: 'blake2b / blake2s object', desc: 'A hash object (update, digest, hexdigest, copy, name, digest_size, block_size). blake2s takes the same arguments with half the limits.' },

  category:    'hashlib class',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'blake2b is tuned for 64-bit machines (digests of 1–64 bytes), blake2s for 8- to 32-bit ones (1–32 bytes). Unlike the other constructors these are real classes with real options: a key turns the hash into a MAC, person separates uses, and every digest_size gives a different hash — not a truncation.',

  covers: [
    'blake2b', 'blake2s',
    'blake2b.SALT_SIZE', 'blake2b.PERSON_SIZE', 'blake2b.MAX_KEY_SIZE', 'blake2b.MAX_DIGEST_SIZE',
    'blake2s.SALT_SIZE', 'blake2s.PERSON_SIZE', 'blake2s.MAX_KEY_SIZE', 'blake2s.MAX_DIGEST_SIZE',
  ],

  cheat: {
    commonCall: 'hashlib.blake2b(msg, key=secret, digest_size=16).hexdigest()',
    returns:    'a hash object; hexdigest() → 2 × digest_size hex characters',
    replaces:   'hmac.new(key, msg, sha256) when both sides use Python / libsodium',
    watchOut:   'Everything except data is keyword-only, and key / salt / person must be bytes',
  },

  parameters: [
    { name: 'data',        type: 'bytes-like', required: false, default: "b''",  desc: "Initial data, and the only positional argument. Positional-only: data=b'...' raises TypeError." },
    { name: 'digest_size', type: 'int',        required: false, default: '64',   desc: 'Output size in bytes: 1–64 for blake2b, 1–32 for blake2s (default 32). Different sizes give unrelated digests.' },
    { name: 'key',         type: 'bytes',      required: false, default: "b''",  desc: 'Secret key for keyed hashing (MAC), up to 64 / 32 bytes. Not padded: b"key" and b"key\\x00" are different keys.' },
    { name: 'salt',        type: 'bytes',      required: false, default: "b''",  desc: 'Salt for randomized hashing, up to 16 / 8 bytes; shorter values are zero-padded.' },
    { name: 'person',      type: 'bytes',      required: false, default: "b''",  desc: 'Personalization string, up to 16 / 8 bytes, zero-padded: the same data hashes differently per application or purpose.' },
    { name: 'fanout, depth, leaf_size, node_offset, node_depth, inner_size, last_node', type: 'int / bool', required: false, default: '1, 1, 0, 0, 0, 0, False', desc: 'Tree-hashing parameters (all zero / one / False for ordinary sequential hashing).' },
    { name: 'usedforsecurity', type: 'bool',   required: false, default: 'True', desc: 'Keyword-only (3.9+); no effect on the output.' },
  ],

  attributes: [
    { name: 'SALT_SIZE',       type: 'int', meaning: 'Maximum salt length: 16 (blake2b) / 8 (blake2s).' },
    { name: 'PERSON_SIZE',     type: 'int', meaning: 'Maximum personalization length: 16 / 8.' },
    { name: 'MAX_KEY_SIZE',    type: 'int', meaning: 'Maximum key length: 64 / 32.' },
    { name: 'MAX_DIGEST_SIZE', type: 'int', meaning: 'Maximum digest_size: 64 / 32 (also the default).' },
  ],

  modes: [
    {
      id: 'keyed',
      label: 'keyed hash (MAC)',
      blurb: 'Hash a message with a secret key and a chosen digest size. Only someone with the key can produce the same tag.',
      params: [
        { name: 'msg',  type: 'str', hint: 'message',            input: 'text' },
        { name: 'key',  type: 'str', hint: 'secret, ≤ 64 bytes', input: 'text' },
        { name: 'size', type: 'int', hint: 'digest_size 1–64',   input: 'number' },
      ],
      template: 'import hashlib\nhashlib.blake2b({$msg}.encode(), key={$key}.encode(), digest_size={$size}).hexdigest()',
      cases: [
        { id: 'docs',   label: 'docs example', values: { msg: 'message data', key: 'pseudorandom key', size: '16' } },
        { id: 'nokey',  label: 'no key',       values: { msg: 'message data', key: '', size: '16' } },
        { id: 'full',   label: '64 bytes',     values: { msg: 'message data', key: 'pseudorandom key', size: '64' } },
        { id: 'long',   label: 'key too long', values: { msg: 'hello', key: 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', size: '16' } },
        { id: 'zero',   label: 'size 0',       values: { msg: 'hello', key: 'key', size: '0' } },
      ],
    },
    {
      id: 'person',
      label: 'personalization',
      blurb: 'The same data with different person strings gives unrelated digests — one hash function per purpose.',
      params: [
        { name: 'text',   type: 'str', hint: 'data',                 input: 'text' },
        { name: 'person', type: 'str', hint: 'purpose, ≤ 16 bytes', input: 'text' },
      ],
      template: 'import hashlib\nhashlib.blake2b({$text}.encode(), digest_size=16, person={$person}.encode()).hexdigest()',
      cases: [
        { id: 'files', label: 'Files Hash',  values: { text: 'the same content', person: 'MyApp Files Hash' } },
        { id: 'block', label: 'Block Hash',  values: { text: 'the same content', person: 'MyApp Block Hash' } },
        { id: 'none',  label: 'no person',   values: { text: 'the same content', person: '' } },
        { id: 'long',  label: 'too long',    values: { text: 'x', person: 'a person over 16 bytes' } },
      ],
    },
    {
      id: 'bs',
      label: 'blake2s vs blake2b',
      blurb: 'Both at 32 bytes: different algorithms, different digests.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import hashlib\ndata = {$text}.encode()\n(hashlib.blake2s(data).hexdigest()[:16], hashlib.blake2b(data, digest_size=32).hexdigest()[:16])',
      cases: [
        { id: 'abc',   label: 'abc',   values: { text: 'abc' } },
        { id: 'empty', label: 'empty', values: { text: '' } },
      ],
    },
  ],
  demoExplainer: 'The first case reproduces the documentation\'s example tag 3d363ff7401e02026f4a4687d4863ced. Dropping the key, or asking for 64 bytes instead of 16, gives values that share nothing with it — a shorter BLAKE2 digest is not a prefix of a longer one. A 65-byte key and digest_size=0 are rejected with the limits in the message. In the second tab the two 16-byte person strings split one input into two unrelated hashes.',

  patterns: [
    {
      name: 'Sign and verify a cookie',
      desc: 'Keyed BLAKE2 as a MAC; compare tags in constant time.',
      code: "import hashlib, hmac\ndef sign(value: bytes) -> str:\n    return hashlib.blake2b(value, key=SECRET_KEY, digest_size=16).hexdigest()\n\nok = hmac.compare_digest(sign(cookie), received_sig)",
    },
    {
      name: 'One key, several derived keys',
      desc: 'person separates the purposes (from the docs).',
      code: "import hashlib\nenc_key = hashlib.blake2s(key=master_key, person=b'kEncrypt').digest()\nmac_key = hashlib.blake2s(key=master_key, person=b'kMAC').digest()",
    },
    {
      name: 'Short digest for IDs',
      desc: 'Pick the size directly instead of cutting a longer digest.',
      code: "import hashlib\nfile_id = hashlib.blake2b(content, digest_size=10).hexdigest()  # 20 hex characters",
    },
  ],

  examples: [
    { title: 'Keyed hash from the docs', code: "import hashlib\nhashlib.blake2b(b'message data', key=b'pseudorandom key', digest_size=16).hexdigest()", returns: "'3d363ff7401e02026f4a4687d4863ced'" },
    { title: 'A SHA-1-sized BLAKE2b',    code: "import hashlib\nh = hashlib.blake2b(digest_size=20)\nh.update(b'Replacing SHA1 with the more secure function')\nh.hexdigest()", returns: "'d24f26cf8de66472d58d4e1b1774b4c9158b1f4c'" },
    { title: 'Sizes are not prefixes',   code: 'import hashlib\n[hashlib.blake2b(digest_size=n).hexdigest() for n in (10, 11)]', returns: "['6fa1d8fcfd719046d762', 'eb6ec15daf9546254f0809']" },
    { title: 'The size constants',       code: 'import hashlib\n[(c.__name__, c.SALT_SIZE, c.PERSON_SIZE, c.MAX_KEY_SIZE, c.MAX_DIGEST_SIZE) for c in (hashlib.blake2b, hashlib.blake2s)]', returns: "[('blake2b', 16, 16, 64, 64), ('blake2s', 8, 8, 32, 32)]" },
    { title: 'Salt is zero-padded',      code: "import hashlib\nhashlib.blake2b(b'x', salt=b'salt').digest() == hashlib.blake2b(b'x', salt=b'salt\\x00').digest()", returns: 'True' },
    { title: 'The key is not',           code: "import hashlib\nhashlib.blake2b(b'x', key=b'key').digest() == hashlib.blake2b(b'x', key=b'key\\x00').digest()", returns: 'False' },
    { title: 'blake2s of "abc"',         code: "import hashlib\nhashlib.blake2s(b'abc').hexdigest()", returns: "'508c5e8c327c14e2e1a72ba34eeb452f37458b209ed63a294d999b4c86675982'" },
    { title: 'Limits are checked',       code: "import hashlib\nhashlib.blake2s(b'x', key=bytes(33))", returns: 'ValueError: maximum key length is 32 bytes' },
  ],

  pitfalls: [
    {
      name: 'Passing the key positionally',
      desc: 'Only data is positional; everything else must be named.',
      wrong: { label: "blake2b(msg, key)", code: "import hashlib\nhashlib.blake2b(b'msg', b'key')", output: 'TypeError: blake2b() takes at most 1 positional argument (2 given)' },
      fix:   { label: 'key=…',             code: "import hashlib\nhashlib.blake2b(b'msg', key=b'key', digest_size=8).hexdigest()", output: "'9f36b048388929f0'" },
    },
    {
      name: 'A str key',
      desc: 'key, salt and person must be bytes, just like the data.',
      wrong: { label: "key='secret'",          code: "import hashlib\nhashlib.blake2b(b'msg', key='secret')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "key='secret'.encode()", code: "import hashlib\nlen(hashlib.blake2b(b'msg', key='secret'.encode()).digest())", output: '64' },
    },
    {
      name: 'Truncating instead of setting digest_size',
      desc: 'digest_size is part of the parameter block, so blake2b(digest_size=16) is not the first 16 bytes of blake2b(). Another BLAKE2 implementation asked for 16 bytes will not match a cut 64-byte digest.',
      wrong: { label: 'cut to 16 bytes', code: "import hashlib\nhashlib.blake2b(b'abc').hexdigest()[:32]", output: "'ba80a53f981c4d0d6a2797b69f12f6e9'" },
      fix:   { label: 'digest_size=16',  code: "import hashlib\nhashlib.blake2b(b'abc', digest_size=16).hexdigest()", output: "'cf4ab791c62b8d2b2109c90275287816'" },
    },
  ],

  when: {
    use: [
      'Fast general-purpose hashing (its designers built BLAKE2 to be faster than MD5 and SHA-2 in software, with modern security)',
      'Message authentication with a secret key, without the hmac wrapper',
      'Digests of a custom size, domain separation with person=',
    ],
    avoid: [
      'Interop with systems that expect HMAC-SHA256 (JWT, webhooks) → hmac + sha256',
      'Passwords → pbkdf2_hmac or scrypt (the docs warn against salted BLAKE2 for passwords)',
      'Formats that name SHA-2 or SHA-3 explicitly',
    ],
  },

  notes: {
    cpython:       "hashlib.blake2b / blake2s and new('blake2b' / 'blake2s') always use the built-in _blake2 module — hashlib.py never asks OpenSSL for those names. Only the OpenSSL spellings new('blake2b512') / new('blake2s256') reach OpenSSL's BLAKE2, an _hashlib.HASH that accepts none of key, salt, person or the tree parameters",
    'Sizes':       'block_size 128 (blake2b) / 64 (blake2s); digest_size follows the argument; name is always \'blake2b\' / \'blake2s\'',
    'Exceptions':  'ValueError with the limit in the message for out-of-range sizes and too-long key / salt / person; TypeError for str arguments',
  },

  related: [
    { name: 'update / digest / hexdigest', slug: 'hash-methods',    when: 'Methods of the objects these classes create' },
    { name: 'name / digest_size / block_size', slug: 'hash-attributes', when: 'Attributes of those objects' },
    { name: 'hashlib.sha256',              slug: 'sha256',          when: 'The interoperable default' },
    { name: 'secrets.compare_digest',      slug: 'compare_digest',  when: 'Compare MAC tags safely', category: 'stdlib/secrets' },
    { name: 'secrets.token_bytes',         slug: 'token_bytes',     when: 'Generate a random key or salt', category: 'stdlib/secrets' },
  ],

  faq: [
    {
      q: 'What is the difference between blake2b and blake2s?',
      a: 'blake2b works on 64-bit words and outputs 1–64 bytes; blake2s works on 32-bit words and outputs 1–32 bytes. blake2b is usually faster on 64-bit CPUs, blake2s on small devices. Their digests are unrelated.',
    },
    {
      q: 'Can BLAKE2 replace HMAC?',
      a: 'Yes, cryptographically: blake2b(msg, key=key) is a secure MAC. HMAC-SHA256 is still the choice when the other side expects it (JWT HS256, most webhooks).',
    },
    {
      q: 'Why is blake2b(digest_size=16) not the start of blake2b()?',
      a: 'The digest size is mixed into the initial state, so each size is effectively a different function. Always set digest_size instead of truncating if others need to reproduce the value.',
    },
    {
      q: 'What do SALT_SIZE, PERSON_SIZE, MAX_KEY_SIZE and MAX_DIGEST_SIZE contain?',
      a: 'The limits of each class: 16, 16, 64 and 64 bytes for blake2b; 8, 8, 32 and 32 for blake2s. They are class attributes, e.g. hashlib.blake2b.SALT_SIZE, handy for os.urandom(hashlib.blake2b.SALT_SIZE).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/hashlib.html#blake2',
    meta:  'BLAKE2 — hashlib.blake2b, hashlib.blake2s',
  },

};
