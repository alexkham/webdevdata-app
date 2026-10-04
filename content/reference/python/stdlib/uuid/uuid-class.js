// content/reference/python/stdlib/uuid/uuid-class.js — uuid.UUID (+ int_, bytes_)

export const meta = {
  slug:        'uuid-class',
  name:        'uuid.UUID',
  signature:   'uuid.UUID(hex=None, bytes=None, bytes_le=None, fields=None, int=None, version=None, *, is_safe=SafeUUID.unknown)',
  blurb:       'The immutable UUID type: build one from a hex string, 16 bytes, six fields or a 128-bit int; compare, sort, hash and print it.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+ (is_safe 3.7+)',
  searchTerms: 'uuid.UUID UUID class python parse uuid string uuid from string uuid from bytes uuid from int validate uuid badly formed hexadecimal UUID string compare uuid sort uuid immutable uuid hash uuid repr uuid.int_ uuid.bytes_ int_ bytes_',
};

export const method = {
  slug:      'uuid-class',
  name:      'uuid.UUID',
  signature: 'uuid.UUID(hex=None, bytes=None, bytes_le=None, fields=None, int=None, version=None, *, is_safe=SafeUUID.unknown)',
  returns:   { type: 'uuid.UUID', desc: 'An immutable, hashable UUID holding one 128-bit integer.' },

  category:    'uuid class',
  version:     'Python 2.5+ (is_safe 3.7+)',
  hasLiveDemo: true,

  subtitle: 'Exactly one of hex, bytes, bytes_le, fields or int. The hex string may have braces, a urn:uuid: prefix, hyphens anywhere and any case; what is left must be 32 characters that int(..., 16) accepts. version= overwrites the version and variant bits.',

  covers: ['UUID', 'int_', 'bytes_'],

  cheat: {
    commonCall: "uuid.UUID('12345678-1234-5678-1234-567812345678')",
    returns:    "UUID('12345678-1234-5678-1234-567812345678')",
    replaces:   'Regex validation of UUID strings',
    watchOut:   'A UUID never == its string; compare str(u) or parse both',
  },

  parameters: [
    { name: 'hex',      type: 'str',   required: false, default: 'None', desc: "32 hex digits; 'urn:' and 'uuid:' are removed anywhere, '{' and '}' stripped from the ends, every '-' removed. Positional." },
    { name: 'bytes',    type: 'bytes', required: false, default: 'None', desc: '16 bytes, big-endian (the network order of the six fields).' },
    { name: 'bytes_le', type: 'bytes', required: false, default: 'None', desc: '16 bytes with the first three fields little-endian (the Microsoft GUID layout).' },
    { name: 'fields',   type: 'tuple[int, ...]', required: false, default: 'None', desc: '(time_low, time_mid, time_hi_version, clock_seq_hi_variant, clock_seq_low, node): 32, 16, 16, 8, 8 and 48 bits.' },
    { name: 'int',      type: 'int',   required: false, default: 'None', desc: 'The whole UUID as an int from 0 to 2**128 - 1.' },
    { name: 'version',  type: 'int',   required: false, default: 'None', desc: '1 to 5 in 3.13: sets the variant to RFC 4122 and the version nibble, overriding those bits of the input.' },
    { name: 'is_safe',  type: 'SafeUUID', required: false, default: 'SafeUUID.unknown', desc: 'Keyword-only; stored as the is_safe attribute (3.7+).' },
  ],

  attributes: [
    { name: 'uuid.int_',   type: 'type', meaning: 'Module-level alias of the built-in int. The class body defines properties named int and bytes, so uuid.py keeps int_ and bytes_ to reach the built-ins. Not documented; do not use it.' },
    { name: 'uuid.bytes_', type: 'type', meaning: 'Module-level alias of the built-in bytes, for the same reason.' },
  ],

  modes: [
    {
      id: 'hex',
      label: 'from a string',
      blurb: 'Every accepted spelling gives the same UUID; the repr shows the canonical form.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nuuid.UUID({$text})',
      cases: [
        { id: 'braces', label: 'braces',          values: { text: '{12345678-1234-5678-1234-567812345678}' } },
        { id: 'urn',    label: 'urn:uuid:',       values: { text: 'urn:uuid:12345678-1234-5678-1234-567812345678' } },
        { id: 'plain',  label: '32 digits',       values: { text: '12345678123456781234567812345678' } },
        { id: 'groups', label: 'hyphens anywhere', values: { text: '1234-5678-1234-5678-1234-5678-1234-5678' } },
        { id: 'space',  label: 'trailing space',  values: { text: '12345678-1234-5678-1234-567812345678 ' } },
        { id: 'badhex', label: 'one bad digit',   values: { text: '12345678-1234-5678-1234-56781234567g' } },
      ],
    },
    {
      id: 'version',
      label: 'version=',
      blurb: 'version= rewrites 6 bits: the version digit and the variant bits. Any other input bits stay.',
      params: [
        { name: 'text',    type: 'str', hint: 'a UUID string', input: 'text' },
        { name: 'version', type: 'int', hint: '1 to 5',        input: 'number' },
      ],
      template: 'import uuid\nuuid.UUID({$text}, version={$version})',
      cases: [
        { id: 'zero4', label: 'zeros, version 4', values: { text: '00000000-0000-0000-0000-000000000000', version: '4' } },
        { id: 'ones5', label: 'ones, version 5',  values: { text: 'ffffffff-ffff-ffff-ffff-ffffffffffff', version: '5' } },
        { id: 'bad',   label: 'version 7',        values: { text: '12345678-1234-5678-1234-567812345678', version: '7' } },
      ],
    },
    {
      id: 'compare',
      label: 'compare',
      blurb: 'Two parsed UUIDs compare by value; a UUID and a str do not.',
      params: [
        { name: 'a', type: 'str', hint: 'a UUID string', input: 'text' },
        { name: 'b', type: 'str', hint: 'a UUID string', input: 'text' },
      ],
      template: 'import uuid\na = uuid.UUID({$a})\nb = uuid.UUID({$b})\n(a == b, a < b, str(a) == {$b})',
      cases: [
        { id: 'same',  label: 'same, two spellings', values: { a: '6FA459EA-EE8A-3CA4-894E-DB77E160355E', b: '{6fa459ea-ee8a-3ca4-894e-db77e160355e}' } },
        { id: 'canon', label: 'canonical text',      values: { a: '6FA459EA-EE8A-3CA4-894E-DB77E160355E', b: '6fa459ea-ee8a-3ca4-894e-db77e160355e' } },
        { id: 'less',  label: 'different',           values: { a: '00000000-0000-0000-0000-000000000001', b: '00000000-0000-0000-0000-000000000002' } },
      ],
    },
  ],
  demoExplainer: 'The parser does not check where hyphens are: it deletes all of them. It also does not strip whitespace, so a trailing space makes 33 characters and "badly formed hexadecimal UUID string". With exactly 32 characters the final step is int(text, 16), so a non-hex digit fails with int\'s message instead. In the compare tab the two spellings are equal UUIDs, but str(a) only equals the lowercase canonical text.',

  patterns: [
    {
      name: 'Parse or reject',
      desc: 'Strip first: text read from files and forms often ends in whitespace.',
      code: 'import uuid\ndef parse_uuid(text):\n    try:\n        return uuid.UUID(text.strip())\n    except ValueError:\n        return None',
    },
    {
      name: 'Strict canonical check',
      desc: 'UUID() is lenient. Compare with the canonical string to accept only the 8-4-4-4-12 form.',
      code: 'import uuid\ndef is_canonical(text):\n    try:\n        return str(uuid.UUID(text)) == text\n    except ValueError:\n        return False',
    },
    {
      name: 'UUIDs as dict keys',
      desc: 'Hashable and equal by value, so parsed keys find each other whatever the input spelling.',
      code: "import uuid\nby_id = {uuid.UUID(row['id']): row for row in rows}\nby_id[uuid.UUID(request_id)]",
    },
  ],

  examples: [
    { title: 'Five constructor forms, one UUID', code: "import uuid\nforms = [\n    uuid.UUID('{12345678-1234-5678-1234-567812345678}'),\n    uuid.UUID(bytes=bytes.fromhex('12345678123456781234567812345678')),\n    uuid.UUID(bytes_le=bytes.fromhex('78563412341278561234567812345678')),\n    uuid.UUID(fields=(0x12345678, 0x1234, 0x5678, 0x12, 0x34, 0x567812345678)),\n    uuid.UUID(int=0x12345678123456781234567812345678),\n]\nlen(set(forms))", returns: '1' },
    { title: 'repr and str',                    code: "import uuid\nu = uuid.UUID(int=1)\n(repr(u), str(u))", returns: "(\"UUID('00000000-0000-0000-0000-000000000001')\", '00000000-0000-0000-0000-000000000001')" },
    { title: 'Sorts by its int value',          code: 'import uuid\nsorted([uuid.UUID(int=3), uuid.UUID(int=1)])', returns: "[UUID('00000000-0000-0000-0000-000000000001'), UUID('00000000-0000-0000-0000-000000000003')]" },
    { title: 'Works as a dict key',             code: "import uuid\n{uuid.UUID(int=1): 'a'}[uuid.UUID('00000000-0000-0000-0000-000000000001')]", returns: "'a'" },
    { title: 'int() gives the 128-bit value',   code: 'import uuid\nint(uuid.UUID(int=255))', returns: '255' },
    { title: 'Immutable',                       code: 'import uuid\nu = uuid.UUID(int=1)\nu.int = 2', returns: 'TypeError: UUID objects are immutable' },
    { title: 'Ordering with a str fails',        code: "import uuid\nuuid.UUID(int=1) < '2'", returns: "TypeError: '<' not supported between instances of 'UUID' and 'str'" },
    { title: 'int_ and bytes_ are the built-ins', code: 'import uuid\n(uuid.int_ is int, uuid.bytes_ is bytes)', returns: '(True, True)' },
  ],

  pitfalls: [
    {
      name: 'Passing the UUID text as bytes',
      desc: 'The first positional argument is hex, a str. b"..." text there fails inside str.replace; bytes= expects the 16 raw bytes, not the 32 hex characters.',
      wrong: { label: 'UUID(b"...")', code: "import uuid\nuuid.UUID(b'12345678123456781234567812345678')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'decode first', code: "import uuid\nuuid.UUID(b'12345678123456781234567812345678'.decode())", output: "UUID('12345678-1234-5678-1234-567812345678')" },
    },
    {
      name: 'Calling UUID() with no argument',
      desc: 'There is no default: an empty UUID does not exist. For a new random one call uuid4(); for all zeros pass int=0.',
      wrong: { label: 'UUID()', code: 'import uuid\nuuid.UUID()', output: 'TypeError: one of the hex, bytes, bytes_le, fields, or int arguments must be given' },
      fix:   { label: 'int=0', code: 'import uuid\nuuid.UUID(int=0)', output: "UUID('00000000-0000-0000-0000-000000000000')" },
    },
    {
      name: 'Whitespace around the text',
      desc: 'Hyphens and braces are removed, whitespace is not. A trailing newline from a file makes the string the wrong length.',
      wrong: { label: 'raw line', code: "import uuid\nuuid.UUID('12345678-1234-5678-1234-567812345678\\n')", output: 'ValueError: badly formed hexadecimal UUID string' },
      fix:   { label: '.strip()', code: "import uuid\nuuid.UUID('12345678-1234-5678-1234-567812345678\\n'.strip())", output: "UUID('12345678-1234-5678-1234-567812345678')" },
    },
  ],

  when: {
    use: [
      'Parsing and validating UUIDs from text, bytes or database ints',
      'Storing IDs as objects that compare, sort and hash by value',
    ],
    avoid: [
      'Making a new ID → uuid4() (or uuid5() from a name)',
      'Strict format checking → compare with str(uuid.UUID(s)), since the parser is lenient',
    ],
  },

  notes: {
    cpython:     'class UUID in Lib/uuid.py: __slots__ = (\'int\', \'is_safe\', \'__weakref__\'); __setattr__ always raises, __init__ sets the slots with object.__setattr__',
    'Parsing':   "hex.replace('urn:', '').replace('uuid:', ''), then .strip('{}').replace('-', ''), then len() == 32 and int(hex, 16). That last step is why int's rules leak through: on 3.13 a leading '0x', '+' or whitespace inside the 32 characters is accepted",
    'Comparison': '==, <, <=, >, >= compare the int values of two UUIDs; with any other type == is False and ordering raises TypeError. hash(u) == hash(u.int)',
    'bytes check': 'UUID(bytes=...) verifies the type with assert isinstance(bytes, bytes_), so a 16-character str gives AssertionError; under python -O the assert is skipped and int.from_bytes raises "TypeError: cannot convert \'str\' object to bytes" instead',
  },

  related: [
    { name: 'hex / int / bytes / urn', slug: 'hex-int-bytes', when: 'Convert a UUID to other forms' },
    { name: 'UUID.fields', slug: 'fields', when: 'The six fields and the time parts' },
    { name: 'version and variant', slug: 'version-variant', when: 'What kind of UUID it is' },
    { name: 'uuid.uuid4', slug: 'uuid4', when: 'Make a new random UUID' },
    { name: 'int()', slug: 'int', when: 'The hex parser UUID() relies on', category: 'functions' },
    { name: 'bytes.fromhex()', slug: 'bytes-fromhex', when: 'Hex text to the 16 bytes', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I convert a string to a UUID in Python?',
      a: "uuid.UUID(s). It accepts the canonical form, braces, a urn:uuid: prefix, missing hyphens and upper case, and raises ValueError otherwise.",
    },
    {
      q: 'How do I convert a UUID to a string?',
      a: 'str(u) gives the 36-character lowercase form with hyphens, u.hex the 32 digits without hyphens and u.urn the urn:uuid: form.',
    },
    {
      q: 'Why is my UUID not equal to the string?',
      a: 'A UUID object and a str are different types; UUID.__eq__ returns NotImplemented for non-UUIDs, so == is False. Compare str(u) == s, or u == uuid.UUID(s).',
    },
    {
      q: 'What does "badly formed hexadecimal UUID string" mean?',
      a: 'After removing urn:/uuid:, the outer braces and all hyphens, the text was not exactly 32 characters long. Whitespace and quotes count, so strip the input first.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.UUID',
    meta:  'uuid.UUID',
  },
};
