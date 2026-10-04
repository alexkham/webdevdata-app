// content/reference/python/stdlib/uuid/uuid3-uuid5.js — uuid.uuid3 / uuid.uuid5

export const meta = {
  slug:        'uuid3-uuid5',
  name:        'uuid.uuid3 / uuid5',
  signature:   'uuid.uuid3(namespace, name) · uuid.uuid5(namespace, name)',
  blurb:       'Deterministic, name-based UUIDs: hash a namespace UUID plus a name with MD5 (uuid3) or SHA-1 (uuid5). The same inputs always give the same UUID.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'uuid5 uuid3 python uuid5 python uuid3 deterministic uuid uuid from string name based uuid uuid from name hash uuid namespace uuid sha1 md5 same uuid every time reproducible uuid',
};

export const method = {
  slug:      'uuid3-uuid5',
  name:      'uuid.uuid3 / uuid5',
  signature: 'uuid.uuid3(namespace, name) · uuid.uuid5(namespace, name)',
  returns:   { type: 'uuid.UUID', desc: 'Version 3 (MD5) or version 5 (SHA-1), RFC 4122 variant.' },

  category:    'uuid function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The hash of namespace.bytes + name (a str is encoded as UTF-8), cut to 16 bytes, with the version and variant bits set. No randomness: anyone with the same namespace and name computes the same UUID. Prefer uuid5; uuid3 exists for compatibility.',

  covers: ['uuid3', 'uuid5'],

  cheat: {
    commonCall: "uuid.uuid5(uuid.NAMESPACE_DNS, 'python.org')",
    returns:    "UUID('886313e1-3b8a-5372-9b90-0c9aee199e5d')",
    replaces:   'Lookup tables that map names to generated IDs',
    watchOut:   'namespace must be a UUID object, not its string; names are case- and byte-exact',
  },

  parameters: [
    { name: 'namespace', type: 'uuid.UUID',  required: true, default: null, desc: 'A UUID that scopes the names: one of NAMESPACE_DNS/URL/OID/X500, or your own (e.g. a uuid4 you generated once).' },
    { name: 'name',      type: 'str | bytes', required: true, default: null, desc: 'The name to hash. str is encoded with UTF-8; bytes are used as they are.' },
  ],

  modes: [
    {
      id: 'dns',
      label: 'name → UUID',
      blurb: 'Both versions of the same domain name. Change one character and the UUIDs change completely.',
      params: [{ name: 'name', type: 'str', hint: 'a domain name', input: 'text' }],
      template: 'import uuid\n(uuid.uuid3(uuid.NAMESPACE_DNS, {$name}), uuid.uuid5(uuid.NAMESPACE_DNS, {$name}))',
      cases: [
        { id: 'python',  label: 'python.org',   values: { name: 'python.org' } },
        { id: 'upper',   label: 'Python.org',   values: { name: 'Python.org' } },
        { id: 'unicode', label: 'zoë.example',  values: { name: 'zoë.example' } },
        { id: 'empty',   label: 'empty name',   values: { name: '' } },
      ],
    },
    {
      id: 'ns',
      label: 'your own namespace',
      blurb: 'Any UUID can be a namespace. The same name under different namespaces gives unrelated UUIDs.',
      params: [
        { name: 'namespace', type: 'str', hint: 'a UUID string', input: 'text' },
        { name: 'name',      type: 'str', hint: 'a name',        input: 'text' },
      ],
      template: 'import uuid\nns = uuid.UUID({$namespace})\nuuid.uuid5(ns, {$name})',
      cases: [
        { id: 'dns',  label: 'NAMESPACE_DNS text', values: { namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'python.org' } },
        { id: 'app',  label: 'an app namespace',   values: { namespace: '1cc262f7-3046-59d8-af1f-724f1ed6b671', name: 'user:42' } },
        { id: 'bad',  label: 'bad namespace',      values: { namespace: 'my-app', name: 'user:42' } },
      ],
    },
    {
      id: 'same',
      label: 'same or not?',
      blurb: 'Two URLs under NAMESPACE_URL. Only byte-identical names give the same UUID.',
      params: [
        { name: 'a', type: 'str', hint: 'a URL', input: 'text' },
        { name: 'b', type: 'str', hint: 'a URL', input: 'text' },
      ],
      template: 'import uuid\nuuid.uuid5(uuid.NAMESPACE_URL, {$a}) == uuid.uuid5(uuid.NAMESPACE_URL, {$b})',
      cases: [
        { id: 'equal', label: 'identical',      values: { a: 'https://example.com/', b: 'https://example.com/' } },
        { id: 'slash', label: 'trailing slash', values: { a: 'https://example.com/', b: 'https://example.com' } },
        { id: 'case',  label: 'host case',      values: { a: 'https://example.com/', b: 'https://EXAMPLE.com/' } },
      ],
    },
  ],
  demoExplainer: 'python.org reproduces the two UUIDs printed in the Python docs. Python.org gives unrelated values: the hash sees different bytes. Non-ASCII names work because a str is encoded to UTF-8 first. The third tab shows that uuid5 does no normalization: a trailing slash or a capital letter is a different name, even where a browser would treat the URLs as the same. Normalize names yourself before hashing.',

  patterns: [
    {
      name: 'Stable IDs for external records',
      desc: 'Importing the same record twice yields the same key, so inserts become idempotent.',
      code: "import uuid\nAPP_NS = uuid.UUID('1cc262f7-3046-59d8-af1f-724f1ed6b671')  # generated once, then fixed\nrecord_id = uuid.uuid5(APP_NS, f'customer:{external_id}')",
    },
    {
      name: 'Normalize before hashing',
      desc: 'Decide what counts as the same name (case, whitespace, trailing slashes) first.',
      code: "import uuid\nkey = uuid.uuid5(uuid.NAMESPACE_DNS, hostname.strip().lower().rstrip('.'))",
    },
    {
      name: 'A namespace per kind of thing',
      desc: 'Derive child namespaces from a URL, then names under them.',
      code: "import uuid\nUSERS = uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/users')\nuser_id = uuid.uuid5(USERS, str(42))",
    },
  ],

  examples: [
    { title: 'uuid5 of a domain',           code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 'python.org')", returns: "UUID('886313e1-3b8a-5372-9b90-0c9aee199e5d')" },
    { title: 'uuid3 of the same domain',    code: "import uuid\nuuid.uuid3(uuid.NAMESPACE_DNS, 'python.org')", returns: "UUID('6fa459ea-ee8a-3ca4-894e-db77e160355e')" },
    { title: 'Deterministic',                code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/') == uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/')", returns: 'True' },
    { title: 'bytes and str agree for ASCII', code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, b'python.org') == uuid.uuid5(uuid.NAMESPACE_DNS, 'python.org')", returns: 'True' },
    { title: 'A custom namespace',          code: "import uuid\nns = uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/')\nuuid.uuid5(ns, 'user:42')", returns: "UUID('1cc262f7-3046-59d8-af1f-724f1ed6b671')" },
    { title: 'Version 3 and version 5',     code: "import uuid\n(uuid.uuid3(uuid.NAMESPACE_DNS, 'a').version, uuid.uuid5(uuid.NAMESPACE_DNS, 'a').version)", returns: '(3, 5)' },
    { title: 'Same as hashlib by hand',     code: "import hashlib, uuid\ndigest = hashlib.sha1(uuid.NAMESPACE_DNS.bytes + b'python.org').digest()\nuuid.UUID(bytes=digest[:16], version=5) == uuid.uuid5(uuid.NAMESPACE_DNS, 'python.org')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Passing the namespace as a string',
      desc: 'uuid5 reads namespace.bytes, which a str does not have. Parse the string with uuid.UUID() first.',
      wrong: { label: 'str namespace', code: "import uuid\nuuid.uuid5('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'python.org')", output: "AttributeError: 'str' object has no attribute 'bytes'" },
      fix:   { label: 'UUID(namespace)', code: "import uuid\nuuid.uuid5(uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8'), 'python.org')", output: "UUID('886313e1-3b8a-5372-9b90-0c9aee199e5d')" },
    },
    {
      name: 'Passing a number as the name',
      desc: 'Only str and bytes are accepted; anything else fails when it is appended to the namespace bytes.',
      wrong: { label: 'name=42', code: 'import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 42)', output: "TypeError: can't concat int to bytes" },
      fix:   { label: 'str(42)', code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, str(42)).version", output: '5' },
    },
    {
      name: 'Using name-based UUIDs as secrets',
      desc: 'Anyone who knows (or guesses) the namespace and name computes the same UUID. They identify, they do not protect.',
      wrong: { label: 'guessable', code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 'admin') == uuid.uuid5(uuid.NAMESPACE_DNS, 'admin')", output: 'True' },
      fix:   { label: 'random token', code: 'import secrets\nlen(secrets.token_urlsafe(32))', output: '43' },
    },
  ],

  when: {
    use: [
      'The same input must map to the same ID on every machine and every run',
      'Idempotent imports and deduplication',
      'IDs for URLs, domain names, file paths, external keys',
    ],
    avoid: [
      'IDs that must not be guessable → uuid4 or secrets',
      'New code choosing between the two → uuid5 (SHA-1) rather than uuid3 (MD5); RFC 4122 recommends version 5',
    ],
  },

  notes: {
    cpython:    'Lib/uuid.py: name = bytes(name, "utf-8") if it is a str; digest = hashlib.md5(namespace.bytes + name, usedforsecurity=False) or hashlib.sha1(...); UUID(bytes=digest[:16], version=3 or 5)',
    'Hashes':   'SHA-1 produces 20 bytes, of which the first 16 are used. Neither MD5 nor SHA-1 is collision-resistant today, which does not matter for naming but rules out security uses',
    'Unicode':  'A str name with a lone surrogate cannot be encoded as UTF-8 and raises UnicodeEncodeError',
  },

  related: [
    { name: 'NAMESPACE_DNS / URL / OID / X500', slug: 'namespaces', when: 'The predefined namespaces' },
    { name: 'uuid.uuid4', slug: 'uuid4', when: 'Random instead of derived' },
    { name: 'uuid.UUID', slug: 'uuid-class', when: 'Parse a namespace string' },
    { name: 'str.encode()', slug: 'str-encode', when: 'What happens to a str name', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I generate the same UUID from a string in Python?',
      a: "uuid.uuid5(namespace, text), for example uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/'). The same namespace and text always give the same UUID, on any machine and any Python version.",
    },
    {
      q: 'What is the difference between uuid3 and uuid5?',
      a: 'The hash: uuid3 uses MD5, uuid5 uses SHA-1. Otherwise they work the same and both are deterministic. Use uuid5 unless you must match existing version 3 IDs.',
    },
    {
      q: 'Which namespace should I use for uuid5?',
      a: 'NAMESPACE_DNS for domain names, NAMESPACE_URL for URLs, NAMESPACE_OID and NAMESPACE_X500 for those identifier systems. For your own data, generate one uuid4 once, store it as a constant and use it as the namespace.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.uuid5',
    meta:  'uuid.uuid5',
  },
};
