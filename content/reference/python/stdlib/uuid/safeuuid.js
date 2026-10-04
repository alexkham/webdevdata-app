// content/reference/python/stdlib/uuid/safeuuid.js — SafeUUID, UUID.is_safe (+ uuid.Enum)

export const meta = {
  slug:        'safeuuid',
  name:        'uuid.SafeUUID',
  signature:   'class uuid.SafeUUID(Enum): safe = 0 · unsafe = -1 · unknown = None',
  blurb:       'An enum saying whether the platform generated a uuid1 in a multiprocessing-safe way: safe, unsafe or unknown. Read it from UUID.is_safe.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'uuid.SafeUUID SafeUUID UUID.is_safe is_safe SafeUUID.safe SafeUUID.unsafe SafeUUID.unknown uuid.Enum uuid1 multiprocessing safe uuid_generate_time_safe enum',
};

export const method = {
  slug:      'safeuuid',
  name:      'uuid.SafeUUID',
  signature: 'class uuid.SafeUUID(Enum): safe = 0 · unsafe = -1 · unknown = None',
  returns:   { type: 'SafeUUID', desc: 'One of the three members.' },

  category:    'uuid class',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'A "safe" UUID was generated with synchronization that guarantees no two processes get the same one. Only uuid1 can know, and only when the platform\'s uuid_generate_time_safe reports it; every other UUID, and most uuid1 values in practice, say unknown.',

  covers: ['SafeUUID', 'UUID.is_safe', 'Enum'],

  cheat: {
    commonCall: 'u.is_safe is uuid.SafeUUID.safe',
    returns:    'True / False',
    replaces:   'Guessing whether uuid1 is unique across processes',
    watchOut:   'unknown is the usual value; it does not mean unsafe',
  },

  parameters: [
    { name: 'value', type: 'int | None', required: true, default: null, desc: 'SafeUUID(value) looks a member up by value: 0, -1 or None. SafeUUID[name] looks it up by name.' },
  ],

  attributes: [
    { name: 'SafeUUID.safe',    type: 'SafeUUID', meaning: 'Value 0: the platform generated the UUID in a multiprocessing-safe way.' },
    { name: 'SafeUUID.unsafe',  type: 'SafeUUID', meaning: 'Value -1: it was not generated in a multiprocessing-safe way.' },
    { name: 'SafeUUID.unknown', type: 'SafeUUID', meaning: 'Value None: the platform does not say.' },
    { name: 'UUID.is_safe',     type: 'SafeUUID', meaning: 'Read-only attribute of every UUID (a __slots__ entry); set by the is_safe= keyword of UUID(), default SafeUUID.unknown.' },
    { name: 'uuid.Enum',        type: 'type',     meaning: 'Not an API: enum.Enum, imported by uuid.py to define SafeUUID, so it shows up as a public module attribute. Import it from enum.' },
  ],

  modes: [
    {
      id: 'value',
      label: 'by value',
      blurb: 'SafeUUID(value) returns the member with that value.',
      params: [{ name: 'value', type: 'int', hint: '0, -1 …', input: 'auto' }],
      template: 'import uuid\nuuid.SafeUUID({$value})',
      cases: [
        { id: 'zero', label: '0',  values: { value: '0' } },
        { id: 'neg',  label: '-1', values: { value: '-1' } },
        { id: 'two',  label: '2',  values: { value: '2' } },
        { id: 'name', label: "'safe' (a name, not a value)", values: { value: 'safe' } },
      ],
    },
    {
      id: 'name',
      label: 'by name',
      blurb: 'SafeUUID[name] looks a member up by its name (case-sensitive).',
      params: [{ name: 'name', type: 'str', hint: 'safe, unsafe, unknown', input: 'text' }],
      template: 'import uuid\nuuid.SafeUUID[{$name}]',
      cases: [
        { id: 'unknown', label: 'unknown', values: { name: 'unknown' } },
        { id: 'upper',   label: 'Safe',    values: { name: 'Safe' } },
      ],
    },
    {
      id: 'attr',
      label: 'is_safe of a UUID',
      blurb: 'A UUID parsed or built by you carries the default.',
      params: [{ name: 'text', type: 'str', hint: 'a UUID string', input: 'text' }],
      template: 'import uuid\nuuid.UUID({$text}).is_safe',
      cases: [
        { id: 'v5', label: 'python.org uuid5', values: { text: '886313e1-3b8a-5372-9b90-0c9aee199e5d' } },
      ],
    },
  ],
  demoExplainer: 'Lookup by value accepts only 0, -1 and None; anything else, including the string \'safe\', raises ValueError. Use SafeUUID[\'safe\'] or SafeUUID.safe for names. A UUID you construct yourself always reports SafeUUID.unknown unless you pass is_safe=.',

  patterns: [
    {
      name: 'Insist on safe uuid1 values',
      desc: 'Fall back to uuid4 when the platform cannot promise uniqueness across processes.',
      code: 'import uuid\nu = uuid.uuid1()\nif u.is_safe is not uuid.SafeUUID.safe:\n    u = uuid.uuid4()',
    },
    {
      name: 'Carry the flag through storage',
      desc: 'Pickling keeps is_safe; for your own formats store is_safe.value and restore with SafeUUID(value).',
      code: "import uuid\nrow = {'id': u.hex, 'safe': u.is_safe.value}\nback = uuid.UUID(row['id'], is_safe=uuid.SafeUUID(row['safe']))",
    },
  ],

  examples: [
    { title: 'The three members',           code: 'import uuid\nlist(uuid.SafeUUID)', returns: '[<SafeUUID.safe: 0>, <SafeUUID.unsafe: -1>, <SafeUUID.unknown: None>]' },
    { title: 'Default for any UUID',        code: 'import uuid\nuuid.UUID(int=1).is_safe', returns: '<SafeUUID.unknown: None>' },
    { title: 'uuid4 does not say',          code: 'import uuid\nuuid.uuid4().is_safe', returns: '<SafeUUID.unknown: None>' },
    { title: 'Set it when constructing',    code: 'import uuid\nuuid.UUID(int=1, is_safe=uuid.SafeUUID.safe).is_safe', returns: '<SafeUUID.safe: 0>' },
    { title: 'unknown has the value None',  code: "import uuid\nuuid.SafeUUID['unknown'].value is None", returns: 'True' },
    { title: 'A plain Enum, not an IntEnum', code: 'import uuid\nuuid.SafeUUID.safe == 0', returns: 'False' },
    { title: 'uuid.Enum is enum.Enum',      code: 'import uuid, enum\nuuid.Enum is enum.Enum', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Comparing is_safe with 0',
      desc: 'SafeUUID is a plain Enum: members are never equal to their values. Compare with the member.',
      wrong: { label: 'is_safe == 0', code: 'import uuid\nuuid.UUID(int=1, is_safe=uuid.SafeUUID.safe).is_safe == 0', output: 'False' },
      fix:   { label: 'is SafeUUID.safe', code: 'import uuid\nuuid.UUID(int=1, is_safe=uuid.SafeUUID.safe).is_safe is uuid.SafeUUID.safe', output: 'True' },
    },
    {
      name: 'Reading unknown as unsafe',
      desc: 'unknown means the platform gave no information, which is the normal case. The value None is also falsy, unlike unsafe (-1).',
      wrong: { label: 'not value', code: 'import uuid\nnot uuid.uuid4().is_safe.value', output: 'True' },
      fix:   { label: 'compare members', code: 'import uuid\nuuid.uuid4().is_safe is uuid.SafeUUID.unsafe', output: 'False' },
    },
    {
      name: 'Changing is_safe later',
      desc: 'UUIDs are immutable, is_safe included. Build a new UUID with is_safe=.',
      wrong: { label: 'assign', code: 'import uuid\nu = uuid.UUID(int=1)\nu.is_safe = uuid.SafeUUID.safe', output: 'TypeError: UUID objects are immutable' },
      fix:   { label: 'new UUID', code: 'import uuid\nu = uuid.UUID(int=1)\nuuid.UUID(int=u.int, is_safe=uuid.SafeUUID.safe).is_safe', output: '<SafeUUID.safe: 0>' },
    },
  ],

  when: {
    use: [
      'Deciding whether uuid1 values from several processes on one machine can collide',
    ],
    avoid: [
      'uuid4, uuid3, uuid5 → always unknown, and uniqueness does not depend on it',
      'Using uuid.Enum in your code → import Enum from enum',
    ],
  },

  notes: {
    cpython:     'Defined with @_simple_enum(Enum) in Lib/uuid.py. uuid1 sets it from the second result of _uuid.generate_time_safe() when the _uuid extension provides it and neither node nor clock_seq is given',
    'In practice': 'On the two machines used to check this page (Windows CPython 3.13, Ubuntu WSL CPython 3.12) uuid._generate_time_safe was None, so uuid1().is_safe was SafeUUID.unknown',
    'Pickling':  'UUID.__getstate__ stores is_safe.value only when it is not unknown, so pickles stay readable by Pythons older than 3.7',
    'uuid.Enum': 'Shows up in dir(uuid) because uuid.py does from enum import Enum and the module has no __all__ (checked on 3.13)',
  },

  related: [
    { name: 'uuid.uuid1', slug: 'uuid1', when: 'The only generator that can set it' },
    { name: 'uuid.UUID', slug: 'uuid-class', when: 'is_safe= keyword' },
    { name: 'ValueError', slug: 'valueerror', when: 'SafeUUID(value) with an unknown value', category: 'exceptions' },
    { name: 'KeyError', slug: 'keyerror', when: 'SafeUUID[name] with an unknown name', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does SafeUUID.unknown mean?',
      a: 'The platform did not report whether the UUID was generated in a multiprocessing-safe way. It is the default for every UUID and the usual result of uuid1.',
    },
    {
      q: 'Do I need to check is_safe for uuid4?',
      a: 'No. is_safe is about the synchronization of uuid1 generation across processes; uuid4 relies on 122 random bits and always reports unknown.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.SafeUUID',
    meta:  'uuid.SafeUUID',
  },
};
