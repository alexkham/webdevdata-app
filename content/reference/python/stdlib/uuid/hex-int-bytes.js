// content/reference/python/stdlib/uuid/hex-int-bytes.js — UUID.hex / int / bytes / bytes_le / urn

export const meta = {
  slug:        'hex-int-bytes',
  name:        'UUID.hex / int / bytes / bytes_le / urn',
  signature:   'u.hex · u.int · u.bytes · u.bytes_le · u.urn',
  blurb:       'The same 128 bits in other forms: 32 hex digits, one big int, 16 bytes (big-endian or GUID little-endian order) and the urn:uuid: URN.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'UUID.hex UUID.int UUID.bytes UUID.bytes_le UUID.urn uuid hex uuid int uuid bytes uuid bytes_le uuid urn uuid without hyphens uuid to int uuid to bytes guid byte order little endian store uuid binary 16 bytes',
};

export const method = {
  slug:      'hex-int-bytes',
  name:      'UUID.hex / int / bytes / bytes_le / urn',
  signature: 'u.hex · u.int · u.bytes · u.bytes_le · u.urn',
  returns:   { type: 'str / int / bytes / bytes / str', desc: 'Read-only views of the one stored 128-bit int.' },

  category:    'UUID attributes',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'int is the only value a UUID really stores; hex, bytes, bytes_le and urn are computed from it on every access. hex is str(u) without hyphens; bytes_le swaps the first three fields into the little-endian order Microsoft GUIDs use.',

  covers: ['UUID.hex', 'UUID.int', 'UUID.bytes', 'UUID.bytes_le', 'UUID.urn'],

  cheat: {
    commonCall: 'u.hex',
    returns:    "'886313e13b8a53729b900c9aee199e5d' (32 lowercase digits)",
    replaces:   "str(u).replace('-', '')",
    watchOut:   'bytes_le is not bytes reversed: only the first 8 bytes are reordered',
  },

  parameters: [],

  attributes: [
    { name: 'hex',      type: 'str',   meaning: "32 lowercase hex digits, no hyphens ('%032x' % u.int)." },
    { name: 'int',      type: 'int',   meaning: 'The UUID as an int, 0 to 2**128 - 1. A __slots__ attribute, the one value that is stored.' },
    { name: 'bytes',    type: 'bytes', meaning: '16 bytes, big-endian: u.int.to_bytes(16).' },
    { name: 'bytes_le', type: 'bytes', meaning: 'Like bytes, but time_low (4 bytes), time_mid (2) and time_hi_version (2) each reversed.' },
    { name: 'urn',      type: 'str',   meaning: "'urn:uuid:' + str(u)." },
  ],

  modes: [
    {
      id: 'strings',
      label: 'text forms',
      blurb: 'str(), hex and urn of the UUID you type.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nu = uuid.UUID({$text})\n(str(u), u.hex, u.urn)',
      cases: [
        { id: 'v5',    label: 'python.org uuid5', values: { text: '886313e1-3b8a-5372-9b90-0c9aee199e5d' } },
        { id: 'upper', label: 'upper case GUID',  values: { text: '{6FA459EA-EE8A-3CA4-894E-DB77E160355E}' } },
      ],
    },
    {
      id: 'int',
      label: 'as an int',
      blurb: 'The 128-bit integer, and the round trip back through UUID(int=...).',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nu = uuid.UUID({$text})\n(u.int, uuid.UUID(int=u.int) == u)',
      cases: [
        { id: 'one', label: 'value 1',    values: { text: '00000000-0000-0000-0000-000000000001' } },
        { id: 'v5',  label: 'python.org', values: { text: '886313e1-3b8a-5372-9b90-0c9aee199e5d' } },
        { id: 'max', label: 'all ones',   values: { text: 'ffffffff-ffff-ffff-ffff-ffffffffffff' } },
      ],
    },
    {
      id: 'bytes',
      label: 'bytes vs bytes_le',
      blurb: 'Big-endian bytes and the GUID byte order. Watch the first 8 bytes.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nu = uuid.UUID({$text})\n(u.bytes, u.bytes_le)',
      cases: [
        { id: 'count', label: '00 01 02 … 0f', values: { text: '00010203-0405-0607-0809-0a0b0c0d0e0f' } },
        { id: 'v5',    label: 'python.org',    values: { text: '886313e1-3b8a-5372-9b90-0c9aee199e5d' } },
      ],
    },
  ],
  demoExplainer: 'In the 00 01 02 … 0f case, bytes counts up while bytes_le starts 03 02 01 00, 05 04, 07 06 and then continues unchanged from 08: only the three time fields are byte-swapped. bytes are shown as Python prints them, so 0x09, 0x0a and 0x0d appear as \\t, \\n and \\r, and printable bytes as their ASCII character.',

  patterns: [
    {
      name: 'Compact storage',
      desc: '16 bytes in a BLOB/BINARY(16) column instead of a 36-character string.',
      code: 'import uuid\nrow_key = some_uuid.bytes\nloaded = uuid.UUID(bytes=row_key)',
    },
    {
      name: 'Read a Windows GUID',
      desc: 'Binary GUIDs from Windows APIs and some databases use the bytes_le layout.',
      code: 'import uuid\nguid = uuid.UUID(bytes_le=raw16)',
    },
    {
      name: 'Hex for file names and URLs',
      desc: 'No hyphens, fixed length, safe everywhere.',
      code: "import uuid\nfilename = f'{uuid.uuid4().hex}.png'",
    },
  ],

  examples: [
    { title: 'hex: no hyphens',           code: "import uuid\nuuid.UUID('886313e1-3b8a-5372-9b90-0c9aee199e5d').hex", returns: "'886313e13b8a53729b900c9aee199e5d'" },
    { title: 'int: the 128-bit value',    code: "import uuid\nuuid.UUID('886313e1-3b8a-5372-9b90-0c9aee199e5d').int", returns: '181289448026289383154478846676280385117' },
    { title: 'urn',                       code: 'import uuid\nuuid.UUID(int=1).urn', returns: "'urn:uuid:00000000-0000-0000-0000-000000000001'" },
    { title: 'bytes round trip',          code: 'import uuid\nu = uuid.uuid4()\nuuid.UUID(bytes=u.bytes) == u', returns: 'True' },
    { title: 'bytes_le reorders 8 bytes', code: "import uuid\nuuid.UUID('00010203-0405-0607-0809-0a0b0c0d0e0f').bytes_le.hex()", returns: "'030201000504070608090a0b0c0d0e0f'" },
    { title: 'Always 32 hex digits',      code: 'import uuid\nlen(uuid.uuid4().hex)', returns: '32' },
    { title: 'Upper-case hex',            code: "import uuid\nuuid.UUID('886313e1-3b8a-5372-9b90-0c9aee199e5d').hex.upper()", returns: "'886313E13B8A53729B900C9AEE199E5D'" },
  ],

  pitfalls: [
    {
      name: 'Mixing up bytes and bytes_le',
      desc: 'Reading GUID-ordered bytes with bytes= (or the reverse) gives a different UUID, with no error.',
      wrong: { label: 'bytes=', code: "import uuid\nuuid.UUID(bytes=bytes.fromhex('78563412341278561234567812345678'))", output: "UUID('78563412-3412-7856-1234-567812345678')" },
      fix:   { label: 'bytes_le=', code: "import uuid\nuuid.UUID(bytes_le=bytes.fromhex('78563412341278561234567812345678'))", output: "UUID('12345678-1234-5678-1234-567812345678')" },
    },
    {
      name: 'Passing hex text as bytes=',
      desc: 'bytes= wants the 16 raw bytes. The 32-character hex text encoded to bytes is 32 bytes long.',
      wrong: { label: 'encoded text', code: "import uuid\nuuid.UUID(bytes='12345678123456781234567812345678'.encode())", output: 'ValueError: bytes is not a 16-char string' },
      fix:   { label: 'bytes.fromhex', code: "import uuid\nuuid.UUID(bytes=bytes.fromhex('12345678123456781234567812345678'))", output: "UUID('12345678-1234-5678-1234-567812345678')" },
    },
  ],

  when: {
    use: [
      'hex: compact text for file names, cache keys and URLs',
      'bytes: binary columns and network protocols',
      'int: arithmetic, bit tests, integer database columns',
      'bytes_le: interop with Windows GUID structures',
    ],
    avoid: [
      'Showing a UUID to people → str(u), the standard hyphenated form',
      'Parsing → construct with UUID(hex=..., bytes=..., int=...) instead of slicing these values',
    ],
  },

  notes: {
    cpython:    'Properties in Lib/uuid.py: hex is \'%032x\' % self.int, bytes is self.int.to_bytes(16), bytes_le slices and reverses bytes[0:4], [4:6] and [6:8], urn is \'urn:uuid:\' + str(self)',
    'Read-only': 'All five are read-only: assignment raises TypeError: UUID objects are immutable',
    'Case':      'hex and str() are always lowercase; parsing accepts either case',
  },

  related: [
    { name: 'uuid.UUID', slug: 'uuid-class', when: 'Build a UUID from any of these forms' },
    { name: 'UUID.fields', slug: 'fields', when: 'The same bits split into six fields' },
    { name: 'bytes.hex()', slug: 'bytes-hex', when: 'Hex text of the bytes value', category: 'functions' },
    { name: 'int.to_bytes()', slug: 'int-to_bytes', when: 'What bytes does with int', category: 'functions' },
    { name: 'int.from_bytes()', slug: 'int-from_bytes', when: 'And the way back', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get a UUID without hyphens in Python?',
      a: 'u.hex returns the 32 lowercase hex digits without hyphens, e.g. uuid.uuid4().hex.',
    },
    {
      q: 'How do I convert a UUID to an integer?',
      a: 'u.int (or int(u)) gives the 128-bit integer; uuid.UUID(int=n) converts back.',
    },
    {
      q: 'What is the difference between bytes and bytes_le?',
      a: 'bytes is the 16 bytes in big-endian (network) order. bytes_le stores the first three fields little-endian, as Microsoft GUID structures do; the last 8 bytes are the same in both.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.UUID.hex',
    meta:  'UUID.hex',
  },
};
