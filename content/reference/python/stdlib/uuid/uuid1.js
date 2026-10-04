// content/reference/python/stdlib/uuid/uuid1.js

export const meta = {
  slug:        'uuid1',
  name:        'uuid.uuid1',
  signature:   'uuid.uuid1(node=None, clock_seq=None)',
  blurb:       'A UUID from the current time, a clock sequence and the machine\'s network (MAC) address. Roughly time-ordered, but it reveals where and when it was made.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'uuid1 python uuid1 time based uuid mac address uuid privacy uuid1 node clock_seq uuid1 vs uuid4 timestamp uuid sortable uuid',
};

export const method = {
  slug:      'uuid1',
  name:      'uuid.uuid1',
  signature: 'uuid.uuid1(node=None, clock_seq=None)',
  returns:   { type: 'uuid.UUID', desc: 'A version 1 UUID: 60-bit timestamp, 14-bit clock sequence, 48-bit node.' },

  category:    'uuid function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The timestamp counts 100-nanosecond steps since 1582-10-15; node defaults to getnode(), the hardware address; clock_seq defaults to 14 random bits. The docs warn that uuid1 "may compromise privacy" because of that address.',

  covers: ['uuid1'],

  cheat: {
    commonCall: 'uuid.uuid1()',
    returns:    "UUID('a8098c1a-f86e-11da-bd1a-00112444be1e') (time-based)",
    replaces:   'Hand-built time + host IDs',
    watchOut:   'The last group is your MAC address unless you pass node=',
  },

  parameters: [
    { name: 'node',      type: 'int | None', required: false, default: 'None', desc: 'The 48-bit node; None means getnode(). On 3.13 a value of 2**48 or more raises ValueError.' },
    { name: 'clock_seq', type: 'int | None', required: false, default: 'None', desc: 'The sequence number; only its low 14 bits are used. None means random.getrandbits(14).' },
  ],

  modes: [
    {
      id: 'parts',
      label: 'node and clock_seq',
      blurb: 'With node and clock_seq given, everything but the timestamp is fixed. These are the parts that do not change between runs.',
      params: [
        { name: 'node', type: 'int', hint: 'below 2**48 = 281474976710656', input: 'number' },
        { name: 'seq',  type: 'int', hint: 'clock sequence',                input: 'number' },
      ],
      template: 'import uuid\nu = uuid.uuid1(node={$node}, clock_seq={$seq})\n(hex(u.node), u.clock_seq, u.version, u.variant)',
      cases: [
        { id: 'basic', label: 'node 0x123456789abc', values: { node: '20015998343868', seq: '4660' } },
        { id: 'wide',  label: 'clock_seq too wide',  values: { node: '1', seq: '20000' } },
        { id: 'neg',   label: 'clock_seq -1',        values: { node: '1', seq: '-1' } },
        { id: 'big',   label: 'node 2**48',          values: { node: '281474976710656', seq: '0' } },
      ],
    },
  ],
  demoExplainer: 'clock_seq is masked to 14 bits: 20000 becomes 3616 and -1 becomes 16383 (Python\'s & works on negative ints as if they had infinitely many 1 bits). node is not masked on 3.13: 2**48 fails the 48-bit check of UUID(fields=...). The timestamp is not shown because it changes with every call.',

  patterns: [
    {
      name: 'uuid1 without the MAC address',
      desc: 'Pass a random 48-bit node with the multicast bit set, as RFC 4122 recommends when no real address is used.',
      code: 'import random, uuid\nnode = random.getrandbits(48) | (1 << 40)\nu = uuid.uuid1(node=node)',
    },
    {
      name: 'When was it made?',
      desc: 'Decode the timestamp (UTC) from a version 1 UUID.',
      code: 'import uuid\nfrom datetime import datetime, timedelta\nmade = datetime(1582, 10, 15) + timedelta(microseconds=u.time // 10)',
    },
  ],

  examples: [
    { title: 'Version 1, RFC 4122 variant',   code: 'import uuid\nu = uuid.uuid1()\n(u.version, u.variant)', returns: "(1, 'specified in RFC 4122')" },
    { title: 'node and clock_seq end up in the fields', code: 'import uuid\nu = uuid.uuid1(node=0x123456789abc, clock_seq=0x1234)\n(hex(u.node), hex(u.clock_seq))', returns: "('0x123456789abc', '0x1234')" },
    { title: 'The last group is the node',    code: "import uuid\nstr(uuid.uuid1(node=0x123456789abc))[-12:]", returns: "'123456789abc'" },
    { title: 'Default node is getnode()',     code: 'import uuid\nuuid.uuid1().node == uuid.getnode()', returns: 'True' },
    { title: 'Later calls sort later',        code: 'import uuid\na = uuid.uuid1()\nb = uuid.uuid1()\nb.time > a.time', returns: 'True' },
    { title: 'Node too large',                code: 'import uuid\nuuid.uuid1(node=1 << 48)', returns: 'ValueError: field 6 out of range (need a 48-bit value)' },
  ],

  pitfalls: [
    {
      name: 'Publishing uuid1 values',
      desc: 'Anyone can read the machine address and the creation time back out of a uuid1. For public IDs use uuid4.',
      wrong: { label: 'uuid1 leaks', code: 'import uuid\nuuid.uuid1().node == uuid.getnode()', output: 'True' },
      fix:   { label: 'uuid4', code: 'import uuid\nuuid.uuid4().version', output: '4' },
    },
    {
      name: 'Sorting uuid1 values as UUIDs',
      desc: 'UUIDs sort by their int, which starts with time_low: the LOW 32 bits of the timestamp. Sort by u.time instead.',
      wrong: { label: 'sort by UUID', code: 'import uuid\nearly = uuid.UUID(fields=(0xffffffff, 0, 0x1000, 0x80, 0, 1))\nlate = uuid.UUID(fields=(0, 1, 0x1000, 0x80, 0, 1))\nsorted([late, early])[0] == early', output: 'False' },
      fix:   { label: 'sort by u.time', code: "import uuid\nearly = uuid.UUID(fields=(0xffffffff, 0, 0x1000, 0x80, 0, 1))\nlate = uuid.UUID(fields=(0, 1, 0x1000, 0x80, 0, 1))\nsorted([late, early], key=lambda u: u.time)[0] == early", output: 'True' },
    },
  ],

  when: {
    use: [
      'Legacy systems that expect version 1 UUIDs',
      'Internal IDs where the embedded time is useful and the address is not a concern',
    ],
    avoid: [
      'Public or user-facing IDs → uuid4 (no address, no time)',
      'Database keys that must sort by time → u.time is not the sort order of UUIDs; 3.14 adds uuid6/uuid7 for that',
    ],
  },

  notes: {
    cpython:      'Lib/uuid.py: if the platform provides uuid_generate_time_safe (via the _uuid extension) and neither argument is given, that is used; otherwise time.time_ns() // 100 + 0x01b21dd213814000, bumped by 1 if not later than the previous call, and UUID(fields=..., version=1)',
    'is_safe':    'Only uuid1 can set is_safe to safe/unsafe, when the platform generator reports it. On Windows CPython 3.13 and on Ubuntu (WSL) CPython 3.12, uuid._generate_time_safe was None and is_safe was SafeUUID.unknown',
    '3.14':       'The 3.14 docs say that node or clock_seq values wider than their bit count keep only their least significant bits; 3.13 masks clock_seq but raises ValueError for node',
  },

  related: [
    { name: 'uuid.getnode', slug: 'getnode', when: 'Where the default node comes from' },
    { name: 'UUID.fields', slug: 'fields', when: 'Read time, clock_seq and node back' },
    { name: 'uuid.uuid4', slug: 'uuid4', when: 'The private alternative' },
    { name: 'uuid.SafeUUID', slug: 'safeuuid', when: 'The is_safe flag of uuid1' },
  ],

  faq: [
    {
      q: 'Does uuid1 contain my MAC address?',
      a: 'Yes, by default: node is getnode(), the hardware address of a network interface (or a random number with the multicast bit set if none is found). Pass node= to avoid it, or use uuid4.',
    },
    {
      q: 'Are uuid1 values unique?',
      a: 'They combine a 100 ns timestamp, a clock sequence and the node, and uuid.py bumps the timestamp if two calls in one process would get the same one. Across processes on the same machine uniqueness is only guaranteed when the platform generator reports SafeUUID.safe.',
    },
    {
      q: 'Are uuid1 values sortable by time?',
      a: 'Not as UUIDs: the int starts with the low 32 bits of the timestamp. Sort by u.time. The 3.14 docs add uuid6, described as an alternative to uuid1 that improves database locality, and uuid7, built on a millisecond Unix timestamp.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.uuid1',
    meta:  'uuid.uuid1',
  },
};
