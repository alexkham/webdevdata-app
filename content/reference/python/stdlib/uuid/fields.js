// content/reference/python/stdlib/uuid/fields.js — UUID.fields and its parts

export const meta = {
  slug:        'fields',
  name:        'UUID.fields / time / clock_seq / node',
  signature:   'u.fields · u.time_low · u.time_mid · u.time_hi_version · u.clock_seq_hi_variant · u.clock_seq_low · u.node · u.time · u.clock_seq',
  blurb:       'The six RFC 4122 fields of a UUID as ints, plus the 60-bit timestamp and 14-bit clock sequence a version 1 UUID carries.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'UUID.fields UUID.time_low UUID.time_mid UUID.time_hi_version UUID.clock_seq_hi_variant UUID.clock_seq_low UUID.node UUID.time UUID.clock_seq uuid fields time low time mid time hi version clock seq node mac address uuid1 timestamp uuid to datetime extract time from uuid1',
};

export const method = {
  slug:      'fields',
  name:      'UUID.fields / time / clock_seq / node',
  signature: 'u.fields · u.time_low · u.time_mid · u.time_hi_version · u.clock_seq_hi_variant · u.clock_seq_low · u.node · u.time · u.clock_seq',
  returns:   { type: 'tuple[int, int, int, int, int, int] / int', desc: 'fields is the tuple of the six field attributes; each attribute is an int.' },

  category:    'UUID attributes',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Every UUID splits into 32 + 16 + 16 + 8 + 8 + 48 bits. The names come from version 1, where they really hold a time, a clock sequence and the MAC address; for random and name-based UUIDs they are just slices of the bits.',

  covers: ['UUID.fields', 'UUID.time_low', 'UUID.time_mid', 'UUID.time_hi_version', 'UUID.clock_seq_hi_variant', 'UUID.clock_seq_low', 'UUID.node', 'UUID.time', 'UUID.clock_seq'],

  cheat: {
    commonCall: 'u.fields',
    returns:    '(time_low, time_mid, time_hi_version, clock_seq_hi_variant, clock_seq_low, node)',
    replaces:   'Slicing str(u) into groups and int(..., 16) each',
    watchOut:   'time, clock_seq and node only mean something for version 1 UUIDs',
  },

  parameters: [],

  attributes: [
    { name: 'time_low',             type: 'int', meaning: 'The first 32 bits (first hex group).' },
    { name: 'time_mid',             type: 'int', meaning: 'The next 16 bits (second group).' },
    { name: 'time_hi_version',      type: 'int', meaning: 'The next 16 bits (third group); its top 4 bits are the version.' },
    { name: 'clock_seq_hi_variant', type: 'int', meaning: 'The next 8 bits; its top bits are the variant.' },
    { name: 'clock_seq_low',        type: 'int', meaning: 'The next 8 bits.' },
    { name: 'node',                 type: 'int', meaning: 'The last 48 bits (last group); the MAC address in a version 1 UUID.' },
    { name: 'time',                 type: 'int', meaning: 'Derived: the 60-bit timestamp, time_hi_version without the version bits, then time_mid, then time_low. In version 1: 100-nanosecond intervals since 1582-10-15.' },
    { name: 'clock_seq',            type: 'int', meaning: 'Derived: the 14-bit sequence number from clock_seq_hi_variant (variant bits removed) and clock_seq_low.' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'fields',
      blurb: 'The six fields as ints.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nuuid.UUID({$text}).fields',
      cases: [
        { id: 'docs', label: 'docs example',     values: { text: '12345678-1234-5678-1234-567812345678' } },
        { id: 'v1',   label: 'a version 1 UUID', values: { text: 'a8098c1a-f86e-11da-bd1a-00112444be1e' } },
      ],
    },
    {
      id: 'derived',
      label: 'time, clock_seq, node',
      blurb: 'The derived timestamp and clock sequence, and the node in hex (the MAC address in version 1).',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nu = uuid.UUID({$text})\n(u.time, u.clock_seq, hex(u.node))',
      cases: [
        { id: 'v1',  label: 'version 1',     values: { text: 'a8098c1a-f86e-11da-bd1a-00112444be1e' } },
        { id: 'dns', label: 'NAMESPACE_DNS', values: { text: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' } },
      ],
    },
    {
      id: 'when',
      label: 'when was it made?',
      blurb: 'For a version 1 UUID, time counts 100 ns steps since the Gregorian calendar reform. Turn it into a datetime (UTC).',
      params: [{ name: 'text', type: 'str', hint: 'a version 1 UUID', input: 'text' }],
      template: 'import uuid\nfrom datetime import datetime, timedelta\nu = uuid.UUID({$text})\ndatetime(1582, 10, 15) + timedelta(microseconds=u.time // 10)',
      cases: [
        { id: 'v1',  label: 'docs uuid1 example', values: { text: 'a8098c1a-f86e-11da-bd1a-00112444be1e' } },
        { id: 'dns', label: 'NAMESPACE_DNS',      values: { text: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' } },
        { id: 'v4',  label: 'a uuid4 (meaningless)', values: { text: '16fd2706-8baf-433b-82eb-8c7fada847da' } },
      ],
    },
  ],
  demoExplainer: 'The docs\' uuid1 example decodes to 2006-06-10 and the NAMESPACE_DNS constant to 1998-02-04, both real creation times. The same arithmetic on a uuid4 gives a date that means nothing: its "time" bits are random. Integer division by 10 drops the last 100 ns digit, because timedelta only stores microseconds.',

  patterns: [
    {
      name: 'Timestamp of a uuid1',
      desc: 'Only for version 1 (check u.version first). The result is UTC.',
      code: 'import uuid\nfrom datetime import datetime, timedelta, timezone\nif u.version == 1:\n    made = datetime(1582, 10, 15, tzinfo=timezone.utc) + timedelta(microseconds=u.time // 10)',
    },
    {
      name: 'MAC address of a uuid1',
      desc: 'node formatted as six colon-separated bytes.',
      code: "import uuid\nmac = ':'.join(f'{b:02x}' for b in u.node.to_bytes(6))",
    },
    {
      name: 'Build from fields',
      desc: 'The fields tuple round-trips through UUID(fields=...).',
      code: 'import uuid\nsame = uuid.UUID(fields=u.fields)',
    },
  ],

  examples: [
    { title: 'The six fields',              code: "import uuid\nuuid.UUID('12345678-1234-5678-1234-567812345678').fields", returns: '(305419896, 4660, 22136, 18, 52, 95073701505656)' },
    { title: 'Fields one by one',           code: "import uuid\nu = uuid.UUID('a8098c1a-f86e-11da-bd1a-00112444be1e')\n(u.time_low, u.time_mid, u.time_hi_version, u.clock_seq_hi_variant, u.clock_seq_low)", returns: '(2819197978, 63598, 4570, 189, 26)' },
    { title: 'node is the last group',      code: "import uuid\nhex(uuid.UUID('a8098c1a-f86e-11da-bd1a-00112444be1e').node)", returns: "'0x112444be1e'" },
    { title: 'time: 60-bit timestamp',      code: "import uuid\nhex(uuid.UUID('a8098c1a-f86e-11da-bd1a-00112444be1e').time)", returns: "'0x1daf86ea8098c1a'" },
    { title: 'clock_seq drops the variant bits', code: "import uuid\nu = uuid.UUID('a8098c1a-f86e-11da-bd1a-00112444be1e')\n(u.clock_seq_hi_variant, u.clock_seq)", returns: '(189, 15642)' },
    { title: 'A uuid1 back to its date',    code: "import uuid\nfrom datetime import datetime, timedelta\nu = uuid.UUID('a8098c1a-f86e-11da-bd1a-00112444be1e')\ndatetime(1582, 10, 15) + timedelta(microseconds=u.time // 10)", returns: 'datetime.datetime(2006, 6, 10, 10, 48, 31, 13993)' },
    { title: 'Round trip through fields',   code: 'import uuid\nu = uuid.uuid4()\nuuid.UUID(fields=u.fields) == u', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Reading a time from a uuid4',
      desc: 'Every field exists on every UUID, so nothing stops you from decoding a random UUID as a date. Check the version first.',
      wrong: { label: 'decode anything', code: "import uuid\nfrom datetime import datetime, timedelta\nu = uuid.UUID('16fd2706-8baf-433b-82eb-8c7fada847da')\n(datetime(1582, 10, 15) + timedelta(microseconds=u.time // 10)).year", output: '2320' },
      fix:   { label: 'check version', code: "import uuid\nu = uuid.UUID('16fd2706-8baf-433b-82eb-8c7fada847da')\nu.version == 1", output: 'False' },
    },
    {
      name: 'Out-of-range fields',
      desc: 'UUID(fields=...) checks each field against its bit width and names the field (1 to 6) that does not fit.',
      wrong: { label: '49-bit node', code: 'import uuid\nuuid.UUID(fields=(1, 2, 3, 4, 5, 1 << 48))', output: 'ValueError: field 6 out of range (need a 48-bit value)' },
      fix:   { label: 'mask to 48 bits', code: 'import uuid\nuuid.UUID(fields=(1, 2, 3, 4, 5, (1 << 48) - 1))', output: "UUID('00000001-0002-0003-0405-ffffffffffff')" },
    },
  ],

  when: {
    use: [
      'Inspecting version 1 UUIDs: creation time, clock sequence, MAC address',
      'Building or decoding UUIDs field by field for a protocol',
    ],
    avoid: [
      'Random or name-based UUIDs → the fields carry no meaning there',
      'Just the text → str(u) or u.hex',
    ],
  },

  notes: {
    cpython:    'Properties over self.int in Lib/uuid.py: time_low = int >> 96, time_mid = (int >> 80) & 0xffff, …, node = int & 0xffffffffffff; time = ((time_hi_version & 0x0fff) << 48) | (time_mid << 32) | time_low',
    'Epoch':    'The version 1 timestamp counts 100 ns intervals from 1582-10-15 00:00:00; uuid.py adds 0x01b21dd213814000 to convert from the Unix epoch',
    '3.14':     'The 3.14 docs add that time also holds the timestamp of the new version 6 and 7 UUIDs (milliseconds since the Unix epoch for version 7)',
  },

  related: [
    { name: 'version and variant', slug: 'version-variant', when: 'The bits hidden in time_hi_version and clock_seq_hi_variant' },
    { name: 'uuid.uuid1', slug: 'uuid1', when: 'Where these fields carry real data' },
    { name: 'hex / int / bytes / urn', slug: 'hex-int-bytes', when: 'The UUID as one value' },
    { name: 'timedelta', slug: 'timedelta', when: 'Turn the timestamp into a date', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'How do I get the timestamp from a uuid1 in Python?',
      a: 'u.time is the count of 100-nanosecond intervals since 1582-10-15. datetime(1582, 10, 15) + timedelta(microseconds=u.time // 10) turns it into a (UTC) datetime.',
    },
    {
      q: 'How do I get the MAC address from a UUID?',
      a: 'For a version 1 UUID, u.node is the 48-bit node, normally the MAC address of the machine that made it (or a random number if none was found). hex(u.node) shows it.',
    },
    {
      q: 'What are the fields of a UUID?',
      a: 'time_low (32 bits), time_mid (16), time_hi_version (16), clock_seq_hi_variant (8), clock_seq_low (8) and node (48), in that order; u.fields returns them as a tuple.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.UUID.fields',
    meta:  'UUID.fields',
  },
};
