// content/reference/python/stdlib/uuid/index.js — the uuid module hub

export const meta = {
  slug:        'index',
  name:        'uuid',
  signature:   'import uuid',
  blurb:       'Universally unique identifiers: random IDs with uuid4(), reproducible name-based IDs with uuid3()/uuid5(), and the UUID class that parses, compares and converts them.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'uuid module python uuid generate uuid python uuid4 uuid1 uuid3 uuid5 guid unique id random id uuid string parse uuid namespace uuid version rfc 4122 rfc 9562',
};

export const method = {
  slug: 'index',
  name: 'uuid',

  category:    'Data formats',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'str(uuid.uuid4()) is the answer most people need: 122 random bits from the operating system, formatted as 36 characters. uuid5(namespace, name) gives the same ID for the same name every time, and uuid.UUID(text) parses and validates one.',

  coverClasses: ['UUID'],

  imports: ['import uuid', 'from uuid import UUID, uuid4'],
  facts: [
    { label: 'Public API', value: 'UUID, uuid1, uuid3, uuid4, uuid5, getnode, SafeUUID, NAMESPACE_DNS/URL/OID/X500, RESERVED_NCS, RFC_4122, RESERVED_MICROSOFT, RESERVED_FUTURE' },
    { label: 'Spec',       value: 'RFC 4122 (3.13 docs); the 3.14 docs cite RFC 9562, which supersedes it' },
    { label: 'Format',     value: '128 bits, shown as 32 lowercase hex digits in groups 8-4-4-4-12' },
    { label: '3.14 adds',  value: 'uuid6(), uuid7(), uuid8(), NIL and MAX (docs.python.org 3.14)' },
    { label: 'CLI',        value: 'python -m uuid (3.12+): prints a uuid4 by default' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'parse a UUID',
      blurb: 'Type a UUID in any accepted form. The result is its canonical string, its version and its variant.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nu = uuid.UUID({$text})\n(str(u), u.version, u.variant)',
      cases: [
        { id: 'braces', label: 'with braces',      values: { text: '{6fa459ea-ee8a-3ca4-894e-db77e160355e}' } },
        { id: 'urn',    label: 'URN form',         values: { text: 'urn:uuid:886313e1-3b8a-5372-9b90-0c9aee199e5d' } },
        { id: 'upper',  label: 'upper, no hyphens', values: { text: '16FD27068BAF433B82EB8C7FADA847DA' } },
        { id: 'short',  label: 'too short',        values: { text: '16fd2706-8baf-433b' } },
        { id: 'nothex', label: 'not hex',          values: { text: 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz' } },
      ],
    },
    {
      id: 'name',
      label: 'ID from a name',
      blurb: 'uuid5 (SHA-1) and uuid3 (MD5) turn a name into a UUID. Same name, same UUID, on every machine.',
      params: [{ name: 'name', type: 'str', hint: 'a domain name', input: 'text' }],
      template: 'import uuid\n(uuid.uuid5(uuid.NAMESPACE_DNS, {$name}), uuid.uuid3(uuid.NAMESPACE_DNS, {$name}))',
      cases: [
        { id: 'python',  label: 'python.org',  values: { name: 'python.org' } },
        { id: 'case',    label: 'Python.org',  values: { name: 'Python.org' } },
        { id: 'example', label: 'example.com', values: { name: 'example.com' } },
      ],
    },
  ],
  demoExplainer: 'Braces, a urn:uuid: prefix, hyphens and upper case are all accepted; str() always gives the lowercase 8-4-4-4-12 form. The three valid cases are versions 3, 5 and 4: the version is the first digit of the third group. A wrong length raises "badly formed hexadecimal UUID string", while 32 characters that are not hex fail inside int() with its own message. Name-based UUIDs are case-sensitive: Python.org and python.org give unrelated IDs.',

  patterns: [
    {
      name: 'A random ID',
      desc: 'The common case: an opaque, unguessable identifier as text.',
      code: 'import uuid\nrequest_id = str(uuid.uuid4())',
    },
    {
      name: 'Validate user input',
      desc: 'UUID() raises ValueError for anything that is not 32 hex digits after removing braces, hyphens and the URN prefix.',
      code: 'import uuid\ntry:\n    order_id = uuid.UUID(raw.strip())\nexcept ValueError:\n    order_id = None',
    },
    {
      name: 'A stable ID for a name',
      desc: 'Same input, same UUID: deduplicate records or derive keys without a lookup table.',
      code: "import uuid\nuser_key = uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/users/42')",
    },
    {
      name: 'Store compactly',
      desc: '16 bytes instead of a 36-character string; UUID(bytes=...) reads it back.',
      code: 'import uuid\nraw = some_uuid.bytes\nsame = uuid.UUID(bytes=raw)',
    },
  ],

  examples: [
    { title: 'Name-based UUID (SHA-1)',      code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 'python.org')", returns: "UUID('886313e1-3b8a-5372-9b90-0c9aee199e5d')" },
    { title: 'Name-based UUID (MD5)',        code: "import uuid\nuuid.uuid3(uuid.NAMESPACE_DNS, 'python.org')", returns: "UUID('6fa459ea-ee8a-3ca4-894e-db77e160355e')" },
    { title: 'A random UUID: always version 4, 36 characters', code: 'import uuid\nu = uuid.uuid4()\n(len(str(u)), u.version, u.variant)', returns: "(36, 4, 'specified in RFC 4122')" },
    { title: 'Parse any accepted form',      code: "import uuid\nuuid.UUID('{12345678-1234-5678-1234-567812345678}')", returns: "UUID('12345678-1234-5678-1234-567812345678')" },
    { title: 'Upper case is normalized',     code: "import uuid\nstr(uuid.UUID('6FA459EA-EE8A-3CA4-894E-DB77E160355E'))", returns: "'6fa459ea-ee8a-3ca4-894e-db77e160355e'" },
    { title: 'The raw 16 bytes',             code: "import uuid\nuuid.UUID('00010203-0405-0607-0809-0a0b0c0d0e0f').bytes", returns: "b'\\x00\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\x08\\t\\n\\x0b\\x0c\\r\\x0e\\x0f'" },
    { title: 'Invalid text raises ValueError', code: "import uuid\nuuid.UUID('1234')", returns: 'ValueError: badly formed hexadecimal UUID string' },
  ],

  pitfalls: [
    {
      name: 'Comparing a UUID with a string',
      desc: 'A UUID object never equals its own text: == with a str is simply False. Compare UUID with UUID, or str with str.',
      wrong: { label: 'UUID == str', code: "import uuid\nuuid.UUID(int=1) == '00000000-0000-0000-0000-000000000001'", output: 'False' },
      fix:   { label: 'str(UUID) == str', code: "import uuid\nstr(uuid.UUID(int=1)) == '00000000-0000-0000-0000-000000000001'", output: 'True' },
    },
    {
      name: 'Putting a UUID straight into JSON',
      desc: 'json does not know the UUID type. Convert with str() (or default=str).',
      wrong: { label: 'json.dumps(UUID)', code: "import uuid, json\njson.dumps({'id': uuid.UUID(int=1)})", output: 'TypeError: Object of type UUID is not JSON serializable' },
      fix:   { label: 'str() first', code: "import uuid, json\njson.dumps({'id': str(uuid.UUID(int=1))})", output: '\'{"id": "00000000-0000-0000-0000-000000000001"}\'' },
    },
  ],

  when: {
    use: [
      'Primary keys and IDs that can be created anywhere without a central counter',
      'Request, job and file names that must not collide',
      'Deterministic IDs derived from a name (uuid5)',
    ],
    avoid: [
      'Secret tokens and password-reset links → secrets.token_urlsafe(), which is designed for that purpose',
      'Short, human-friendly codes → a counter or a short random string',
      'Time-ordered database keys on 3.13 and older → uuid1 leaks the MAC address; 3.14 adds uuid7()',
    ],
  },

  notes: {
    cpython:    'Lib/uuid.py is pure Python: the UUID class stores one 128-bit int (in __slots__) and computes every other attribute from it. uuid3/uuid5 use hashlib.md5/sha1; uuid4 is UUID(bytes=os.urandom(16), version=4)',
    'Immutable': 'Assigning to any attribute raises TypeError: UUID objects are immutable. UUIDs are hashable and sort by their int value',
    'Versions': 'version is 1 to 5 (3.13) and only meaningful when variant == RFC_4122; for other variants it is None',
  },

  related: [
    { name: 'random module', slug: 'random', when: 'Reproducible pseudo-random values (not for IDs that must not collide)', category: 'stdlib' },
    { name: 'json module',   slug: 'json',   when: 'Serialize UUIDs as str', category: 'stdlib' },
    { name: 'bytes.hex()',   slug: 'bytes-hex', when: 'Hex text of raw bytes', category: 'functions' },
    { name: 'ValueError',    slug: 'valueerror', when: 'What a malformed UUID string raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I generate a UUID in Python?',
      a: 'import uuid, then uuid.uuid4() for a random one. It returns a UUID object; str(uuid.uuid4()) gives the usual 36-character text and uuid.uuid4().hex the 32 digits without hyphens.',
    },
    {
      q: 'Which UUID version should I use?',
      a: 'uuid4 for a random ID (the default choice). uuid5 when the same input must always give the same ID. uuid1 embeds the time and the computer\'s network address, which the docs warn may compromise privacy. uuid3 is the MD5 variant of uuid5.',
    },
    {
      q: 'How do I check if a string is a valid UUID?',
      a: 'Try uuid.UUID(s) and catch ValueError. It accepts braces, a urn:uuid: prefix, missing hyphens and upper case; compare str(uuid.UUID(s)) == s.lower() if you need the exact canonical form.',
    },
    {
      q: 'Is uuid4 unique?',
      a: 'Practically, yes: it has 122 random bits from os.urandom(). A collision is so unlikely that systems treat uuid4 values as unique without checking a registry.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html',
    meta:  'uuid — UUID objects',
  },
};
