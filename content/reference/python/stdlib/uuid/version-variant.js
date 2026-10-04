// content/reference/python/stdlib/uuid/version-variant.js — UUID.version / variant + the variant constants

export const meta = {
  slug:        'version-variant',
  name:        'UUID.version / variant',
  signature:   'u.version · u.variant · uuid.RESERVED_NCS · uuid.RFC_4122 · uuid.RESERVED_MICROSOFT · uuid.RESERVED_FUTURE',
  blurb:       'Which kind of UUID it is: the variant (layout family, one of four string constants) and, for RFC 4122 UUIDs, the version number 1 to 5.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'UUID.version UUID.variant uuid version uuid variant RESERVED_NCS RFC_4122 RESERVED_MICROSOFT RESERVED_FUTURE uuid.RFC_4122 specified in RFC 4122 check uuid version is uuid4 version None which uuid version guid variant',
};

export const method = {
  slug:      'version-variant',
  name:      'UUID.version / variant',
  signature: 'u.version · u.variant · uuid.RESERVED_NCS · uuid.RFC_4122 · uuid.RESERVED_MICROSOFT · uuid.RESERVED_FUTURE',
  returns:   { type: 'int | None / str', desc: 'version: 1 to 5 (3.13), or None unless variant is RFC_4122. variant: one of the four module constants.' },

  category:    'UUID attributes',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The variant lives in the top bits of the 17th hex digit (the first of the fourth group): 8, 9, a or b means RFC 4122. Only then does the 13th digit (the first of the third group) mean something: it is the version. Any other variant gives version None.',

  covers: ['UUID.version', 'UUID.variant', 'RESERVED_NCS', 'RFC_4122', 'RESERVED_MICROSOFT', 'RESERVED_FUTURE'],

  cheat: {
    commonCall: 'u.version == 4',
    returns:    'True for a uuid4; version is an int or None',
    replaces:   'Reading str(u)[14] by hand',
    watchOut:   'A hand-typed UUID like 12345678-1234-5678-1234-… has variant RESERVED_NCS and version None',
  },

  parameters: [],

  attributes: [
    { name: 'version',            type: 'int | None', meaning: '(int >> 76) & 0xf when the variant is RFC_4122, otherwise None.' },
    { name: 'variant',            type: 'str',        meaning: 'One of the four constants below, from the top bits of clock_seq_hi_variant.' },
    { name: 'RESERVED_NCS',       type: 'str',        meaning: "'reserved for NCS compatibility': top bit 0 (fourth group starts with 0 to 7)." },
    { name: 'RFC_4122',           type: 'str',        meaning: "'specified in RFC 4122': top bits 10 (fourth group starts with 8, 9, a or b). Every UUID uuid1/3/4/5 make." },
    { name: 'RESERVED_MICROSOFT', type: 'str',        meaning: "'reserved for Microsoft compatibility': top bits 110 (starts with c or d)." },
    { name: 'RESERVED_FUTURE',    type: 'str',        meaning: "'reserved for future definition': top bits 111 (starts with e or f)." },
  ],

  modes: [
    {
      id: 'vv',
      label: 'version & variant',
      blurb: 'Type a UUID and see what kind it is.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nu = uuid.UUID({$text})\n(u.version, u.variant)',
      cases: [
        { id: 'v4',    label: 'a uuid4',        values: { text: '16fd2706-8baf-433b-82eb-8c7fada847da' } },
        { id: 'v1',    label: 'a uuid1',        values: { text: 'a8098c1a-f86e-11da-bd1a-00112444be1e' } },
        { id: 'nil',   label: 'all zeros',      values: { text: '00000000-0000-0000-0000-000000000000' } },
        { id: 'ms',    label: 'a COM GUID',     values: { text: '00000000-0000-0000-c000-000000000046' } },
        { id: 'max',   label: 'all ones',       values: { text: 'ffffffff-ffff-ffff-ffff-ffffffffffff' } },
      ],
    },
    {
      id: 'digits',
      label: 'read it off the text',
      blurb: 'The 13th and 17th hex digits (indexes 14 and 19 in the hyphenated string) carry the version and the variant.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nu = uuid.UUID({$text})\n(str(u)[14], str(u)[19], u.version)',
      cases: [
        { id: 'v5',   label: 'uuid5 python.org', values: { text: '886313e1-3b8a-5372-9b90-0c9aee199e5d' } },
        { id: 'v3',   label: 'uuid3 python.org', values: { text: '6fa459ea-ee8a-3ca4-894e-db77e160355e' } },
        { id: 'fake', label: 'version digit, wrong variant', values: { text: '12345678-1234-4678-1234-567812345678' } },
      ],
    },
  ],
  demoExplainer: 'All zeros is variant RESERVED_NCS and all ones RESERVED_FUTURE, so both have version None. The COM GUID 00000000-0000-0000-c000-000000000046 (IUnknown) is in the Microsoft variant. In the last case the third group starts with 4, yet version is None: the fourth group starts with 1, so the variant is not RFC 4122 and the version digit does not count.',

  patterns: [
    {
      name: 'Accept only random UUIDs',
      desc: 'Reject IDs that were not made by uuid4 (for example a uuid1 that leaks a MAC address).',
      code: 'import uuid\nu = uuid.UUID(text)\nif u.version != 4:\n    raise ValueError("expected a version 4 UUID")',
    },
    {
      name: 'Dispatch on the variant',
      desc: 'Compare with the module constants, not with the literal strings.',
      code: 'import uuid\nif u.variant == uuid.RFC_4122:\n    kind = f"RFC 4122 version {u.version}"\nelse:\n    kind = u.variant',
    },
  ],

  examples: [
    { title: 'A uuid4 is version 4',          code: 'import uuid\nuuid.uuid4().version', returns: '4' },
    { title: 'Name-based: 3 and 5',            code: "import uuid\n(uuid.uuid3(uuid.NAMESPACE_DNS, 'x').version, uuid.uuid5(uuid.NAMESPACE_DNS, 'x').version)", returns: '(3, 5)' },
    { title: 'The variant constants are strings', code: 'import uuid\nuuid.RFC_4122', returns: "'specified in RFC 4122'" },
    { title: 'All four',                       code: 'import uuid\n[uuid.RESERVED_NCS, uuid.RFC_4122, uuid.RESERVED_MICROSOFT, uuid.RESERVED_FUTURE]', returns: "['reserved for NCS compatibility', 'specified in RFC 4122', 'reserved for Microsoft compatibility', 'reserved for future definition']" },
    { title: 'Nil UUID: no version',           code: 'import uuid\nprint(uuid.UUID(int=0).version)', returns: 'None' },
    { title: 'Microsoft variant',              code: "import uuid\nuuid.UUID('00000000-0000-0000-c000-000000000046').variant", returns: "'reserved for Microsoft compatibility'" },
    { title: 'version= sets both',             code: 'import uuid\nu = uuid.UUID(int=0, version=4)\n(u.version, u.variant == uuid.RFC_4122)', returns: '(4, True)' },
  ],

  pitfalls: [
    {
      name: 'Trusting the version digit alone',
      desc: 'A UUID whose third group starts with 4 is not version 4 unless the variant is RFC 4122. version already checks that; a regex on the text usually does not.',
      wrong: { label: 'str(u)[14]', code: "import uuid\nstr(uuid.UUID('12345678-1234-4678-1234-567812345678'))[14] == '4'", output: 'True' },
      fix:   { label: 'u.version', code: "import uuid\nuuid.UUID('12345678-1234-4678-1234-567812345678').version == 4", output: 'False' },
    },
    {
      name: 'Expecting an int for every UUID',
      desc: 'version is None outside the RFC 4122 variant, so arithmetic or formatting with it can fail.',
      wrong: { label: 'version + 0', code: 'import uuid\nuuid.UUID(int=0).version + 0', output: "TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'" },
      fix:   { label: 'check variant', code: 'import uuid\nu = uuid.UUID(int=0)\nu.version if u.variant == uuid.RFC_4122 else 0', output: '0' },
    },
  ],

  when: {
    use: [
      'Validating that an incoming ID is a uuid4 (or a uuid5 from your namespace)',
      'Telling Microsoft GUIDs and legacy NCS UUIDs apart from RFC 4122 ones',
    ],
    avoid: [
      'Checking the format of the text → UUID() parsing does that',
      'Hand-written regexes for the version → u.version',
    ],
  },

  notes: {
    cpython:    'variant tests bits 0x8000, 0x4000 and 0x2000 of the clock_seq field (int >> 48) in turn; version returns int((self.int >> 76) & 0xf) only when variant == RFC_4122, else falls off the end (None)',
    'Versions': '3.13 knows versions 1 to 5 (UUID(version=6) raises "illegal version number"). The 3.14 docs list versions 1 through 8 and say RFC_4122 is kept for backward compatibility although RFC 9562 superseded RFC 4122',
    'Nil and Max': 'All zeros (nil) and all ones (max) are special UUIDs; 3.14 adds them as uuid.NIL and uuid.MAX',
  },

  related: [
    { name: 'UUID.fields', slug: 'fields', when: 'The fields that hold these bits' },
    { name: 'uuid.uuid4', slug: 'uuid4', when: 'Makes version 4' },
    { name: 'uuid3 / uuid5', slug: 'uuid3-uuid5', when: 'Make versions 3 and 5' },
    { name: 'uuid.UUID', slug: 'uuid-class', when: 'version= when constructing' },
  ],

  faq: [
    {
      q: 'How do I check which version a UUID is in Python?',
      a: 'uuid.UUID(text).version returns 1, 3, 4 or 5 for UUIDs made by the standard algorithms, and None when the variant is not RFC 4122.',
    },
    {
      q: 'Why is UUID.version None?',
      a: 'version only has a meaning for the RFC 4122 variant (fourth group starting with 8, 9, a or b). Hand-made values like 12345678-1234-5678-1234-567812345678 or all zeros have another variant.',
    },
    {
      q: 'What does "specified in RFC 4122" mean?',
      a: 'It is the value of uuid.RFC_4122, the variant every standard generated UUID has. The variant constants are plain descriptive strings.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.UUID.version',
    meta:  'UUID.version',
  },
};
