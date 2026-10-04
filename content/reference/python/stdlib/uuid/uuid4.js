// content/reference/python/stdlib/uuid/uuid4.js

export const meta = {
  slug:        'uuid4',
  name:        'uuid.uuid4',
  signature:   'uuid.uuid4()',
  blurb:       'A new random UUID from os.urandom(): the standard way to make a unique ID in Python.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'uuid4 python uuid4 random uuid generate unique id python str uuid uuid4 hex random id guid collision probability is uuid4 unique is uuid4 secure os.urandom',
};

export const method = {
  slug:      'uuid4',
  name:      'uuid.uuid4',
  signature: 'uuid.uuid4()',
  returns:   { type: 'uuid.UUID', desc: 'A version 4, RFC 4122-variant UUID: 122 random bits plus 6 fixed bits.' },

  category:    'uuid function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The whole implementation is UUID(bytes=os.urandom(16), version=4): 16 bytes from the operating system\'s secure random source, with 6 bits overwritten to mark version 4. Different on every call; str() of it is the familiar 36-character ID.',

  covers: ['uuid4'],

  cheat: {
    commonCall: 'str(uuid.uuid4())',
    returns:    "a new 36-character string like '16fd2706-8baf-433b-82eb-8c7fada847da'",
    replaces:   'Counters, timestamps or random.random() as IDs',
    watchOut:   'Returns a UUID object, not a str: wrap in str() for JSON and string comparisons',
  },

  parameters: [],

  modes: [
    {
      id: 'build',
      label: 'how it is built',
      blurb: 'uuid4() feeds 16 random bytes into UUID(..., version=4). Type the 16 bytes as hex to see what the version bits do to them.',
      params: [{ name: 'hex', type: 'str', hint: '32 hex digits (16 bytes)', input: 'text' }],
      template: 'import uuid\nuuid.UUID(bytes=bytes.fromhex({$hex}), version=4)',
      cases: [
        { id: 'zeros',  label: 'all zero bytes', values: { hex: '00000000000000000000000000000000' } },
        { id: 'ones',   label: 'all ff bytes',   values: { hex: 'ffffffffffffffffffffffffffffffff' } },
        { id: 'spaced', label: 'with spaces',    values: { hex: '12 34 56 78 12 34 56 78 12 34 56 78 12 34 56 78' } },
        { id: 'short',  label: '15 bytes',       values: { hex: '000000000000000000000000000000' } },
      ],
    },
    {
      id: 'many',
      label: 'make many',
      blurb: 'Generate n random UUIDs. The values change every run, but these facts about them do not: how many are distinct, their versions and their string lengths.',
      params: [{ name: 'n', type: 'int', hint: 'how many', input: 'number' }],
      template: 'import uuid\nids = [uuid.uuid4() for _ in range({$n})]\n(len(set(ids)), {u.version for u in ids}, {len(str(u)) for u in ids})',
      cases: [
        { id: 'thousand', label: '1000', values: { n: '1000' } },
        { id: 'one',      label: '1',    values: { n: '1' } },
        { id: 'zero',     label: '0',    values: { n: '0' } },
      ],
    },
  ],
  demoExplainer: 'Even all-zero bytes come out as version 4: the third group becomes 4000 and the fourth 8000, because version=4 forces the version digit to 4 and the variant bits to 10. All-ff bytes keep every other bit, giving ffffffff-ffff-4fff-bfff-ffffffffffff. bytes.fromhex skips spaces between bytes; 15 bytes are refused by UUID. In the second tab 1000 fresh UUIDs are 1000 distinct values, all version 4, all 36 characters.',

  patterns: [
    {
      name: 'An ID as text',
      desc: 'For JSON, URLs, log lines and string columns.',
      code: 'import uuid\nrequest_id = str(uuid.uuid4())',
    },
    {
      name: 'A dataclass with a fresh ID per instance',
      desc: 'default_factory runs uuid4 for every new object (a plain default would share one ID).',
      code: 'import uuid\nfrom dataclasses import dataclass, field\n\n@dataclass\nclass Job:\n    name: str\n    id: uuid.UUID = field(default_factory=uuid.uuid4)',
    },
    {
      name: 'Unique temporary file names',
      desc: 'hex has no hyphens and a fixed length of 32.',
      code: "import uuid\npath = f'/tmp/upload-{uuid.uuid4().hex}.bin'",
    },
  ],

  examples: [
    { title: 'Always version 4, RFC 4122 variant', code: 'import uuid\nu = uuid.uuid4()\n(u.version, u.variant)', returns: "(4, 'specified in RFC 4122')" },
    { title: 'A UUID object, not a str',      code: 'import uuid\ntype(uuid.uuid4())', returns: "<class 'uuid.UUID'>" },
    { title: '36 characters as text',          code: 'import uuid\nlen(str(uuid.uuid4()))', returns: '36' },
    { title: 'The version digit is always 4',  code: 'import uuid\nstr(uuid.uuid4())[14]', returns: "'4'" },
    { title: 'The variant digit is 8, 9, a or b', code: "import uuid\nstr(uuid.uuid4())[19] in '89ab'", returns: 'True' },
    { title: 'No repeats in 10,000',           code: 'import uuid\nlen({uuid.uuid4() for _ in range(10_000)})', returns: '10000' },
    { title: 'Same thing, by hand',            code: 'import os, uuid\nuuid.UUID(bytes=os.urandom(16), version=4).version', returns: '4' },
  ],

  pitfalls: [
    {
      name: 'Calling uuid4 once as a default',
      desc: 'A default argument is evaluated once, when the function is defined, so every call shares the same "new" ID.',
      wrong: { label: 'def f(id=uuid4())', code: 'import uuid\ndef make(id=uuid.uuid4()):\n    return id\nmake() == make()', output: 'True' },
      fix:   { label: 'id=None', code: 'import uuid\ndef make(id=None):\n    return id or uuid.uuid4()\nmake() == make()', output: 'False' },
    },
    {
      name: 'Comparing the UUID with a string',
      desc: 'uuid4() returns a UUID. Comparing it, or using it as a dict key, against strings never matches.',
      wrong: { label: 'UUID vs str', code: 'import uuid\nu = uuid.uuid4()\nu == str(u)', output: 'False' },
      fix:   { label: 'str on both sides', code: 'import uuid\nu = uuid.uuid4()\nstr(u) == str(u)', output: 'True' },
    },
    {
      name: 'Expecting the same UUID twice',
      desc: 'uuid4 has no input, so it cannot be reproduced. For a stable ID derived from data, use uuid5.',
      wrong: { label: 'uuid4 twice', code: 'import uuid\nuuid.uuid4() == uuid.uuid4()', output: 'False' },
      fix:   { label: 'uuid5 twice', code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 'example.com') == uuid.uuid5(uuid.NAMESPACE_DNS, 'example.com')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Database primary keys and public IDs that must not reveal anything',
      'Request, trace, job and upload IDs',
      'Any time you need a unique ID without coordination',
    ],
    avoid: [
      'IDs that must be reproducible from data → uuid5',
      'Secret tokens (session keys, reset links) → secrets.token_urlsafe()',
      'Keys that should sort by creation time → a timestamp column, or uuid7() on 3.14+',
    ],
  },

  notes: {
    cpython:    'def uuid4(): return UUID(bytes=os.urandom(16), version=4) in Lib/uuid.py',
    'Randomness': 'os.urandom reads the operating system\'s cryptographic random source; the 3.14 docs describe uuid4 as generated "in a cryptographically-secure method". 122 of the 128 bits are random',
    'Collisions': 'With 122 random bits, the birthday bound puts a 50 percent chance of any repeat at about 2.7 * 10**18 UUIDs',
    'is_safe':  'Always SafeUUID.unknown: is_safe concerns only uuid1',
  },

  related: [
    { name: 'uuid3 / uuid5', slug: 'uuid3-uuid5', when: 'Reproducible UUIDs from a name' },
    { name: 'uuid.uuid1', slug: 'uuid1', when: 'Time- and MAC-based UUIDs' },
    { name: 'uuid.UUID', slug: 'uuid-class', when: 'Parse the text back into a UUID' },
    { name: 'random module', slug: 'random', when: 'Seeded, reproducible randomness (not for IDs)', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Can uuid4 produce duplicates?',
      a: 'In theory yes, in practice no: it has 122 random bits, so you would need about 2.7 * 10**18 UUIDs for a 50 percent chance of a single repeat.',
    },
    {
      q: 'Is uuid4 cryptographically secure?',
      a: 'Its bits come from os.urandom(), the OS cryptographic source, so they are unpredictable. For secrets such as session tokens the secrets module is still the clearer choice: it is designed for that, and its tokens carry more random bits.',
    },
    {
      q: 'How do I get uuid4 as a string?',
      a: 'str(uuid.uuid4()) for the hyphenated 36-character form, uuid.uuid4().hex for 32 digits without hyphens.',
    },
    {
      q: 'What is the difference between uuid1 and uuid4?',
      a: 'uuid1 is built from the current time, a clock sequence and the machine\'s network address; uuid4 is random. uuid4 reveals nothing about where or when it was made.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.uuid4',
    meta:  'uuid.uuid4',
  },
};
