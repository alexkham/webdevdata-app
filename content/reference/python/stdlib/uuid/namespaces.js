// content/reference/python/stdlib/uuid/namespaces.js — NAMESPACE_DNS / URL / OID / X500

export const meta = {
  slug:        'namespaces',
  name:        'uuid.NAMESPACE_DNS / URL / OID / X500',
  signature:   'uuid.NAMESPACE_DNS · uuid.NAMESPACE_URL · uuid.NAMESPACE_OID · uuid.NAMESPACE_X500',
  blurb:       'The four predefined namespace UUIDs from RFC 4122 for uuid3() and uuid5(): domain names, URLs, ISO OIDs and X.500 names.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'uuid.NAMESPACE_DNS uuid.NAMESPACE_URL uuid.NAMESPACE_OID uuid.NAMESPACE_X500 NAMESPACE_DNS NAMESPACE_URL NAMESPACE_OID NAMESPACE_X500 uuid namespace 6ba7b810-9dad-11d1-80b4-00c04fd430c8 uuid5 namespace which namespace',
};

export const method = {
  slug:      'namespaces',
  name:      'uuid.NAMESPACE_DNS / URL / OID / X500',
  signature: 'uuid.NAMESPACE_DNS · uuid.NAMESPACE_URL · uuid.NAMESPACE_OID · uuid.NAMESPACE_X500',
  returns:   { type: 'uuid.UUID', desc: 'Fixed UUID constants (themselves version 1 UUIDs from 1998).' },

  category:    'uuid constant',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Fixed values published in RFC 4122, so every language computes the same uuid5 for the same name. Pick the one that matches what your name is; for your own kinds of names, make your own namespace.',

  covers: ['NAMESPACE_DNS', 'NAMESPACE_URL', 'NAMESPACE_OID', 'NAMESPACE_X500'],

  cheat: {
    commonCall: "uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/')",
    returns:    "UUID('dd2c1780-811a-5296-81c5-178a0ef488bc')",
    replaces:   'Inventing a namespace UUID for URLs or domains',
    watchOut:   'They differ only in the last digit of the first group: 0, 1, 2 and 4',
  },

  parameters: [],

  attributes: [
    { name: 'NAMESPACE_DNS',  type: 'UUID', meaning: "6ba7b810-9dad-11d1-80b4-00c04fd430c8: names are fully qualified domain names ('python.org')." },
    { name: 'NAMESPACE_URL',  type: 'UUID', meaning: "6ba7b811-9dad-11d1-80b4-00c04fd430c8: names are URLs ('https://example.com/')." },
    { name: 'NAMESPACE_OID',  type: 'UUID', meaning: "6ba7b812-9dad-11d1-80b4-00c04fd430c8: names are ISO OIDs ('1.3.6.1')." },
    { name: 'NAMESPACE_X500', type: 'UUID', meaning: '6ba7b814-9dad-11d1-80b4-00c04fd430c8: names are X.500 distinguished names, in DER or a text output format.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'the four values',
      blurb: 'Look a namespace up by the short name python -m uuid uses for it.',
      params: [{ name: 'name', type: 'str', hint: '@dns, @url, @oid, @x500', input: 'text' }],
      template: "import uuid\nnamespaces = {'@dns': uuid.NAMESPACE_DNS, '@url': uuid.NAMESPACE_URL, '@oid': uuid.NAMESPACE_OID, '@x500': uuid.NAMESPACE_X500}\nns = namespaces[{$name}]\n(str(ns), ns.version)",
      cases: [
        { id: 'dns',   label: '@dns',   values: { name: '@dns' } },
        { id: 'url',   label: '@url',   values: { name: '@url' } },
        { id: 'oid',   label: '@oid',   values: { name: '@oid' } },
        { id: 'x500',  label: '@x500',  values: { name: '@x500' } },
        { id: 'email', label: '@email (no such thing)', values: { name: '@email' } },
      ],
    },
    {
      id: 'url',
      label: 'UUID for a URL',
      blurb: 'The common use: a stable UUID for a URL.',
      params: [{ name: 'url', type: 'str', hint: 'a URL', input: 'text' }],
      template: 'import uuid\nuuid.uuid5(uuid.NAMESPACE_URL, {$url})',
      cases: [
        { id: 'example', label: 'example.com', values: { url: 'https://example.com/' } },
        { id: 'docs',    label: 'python docs', values: { url: 'https://docs.python.org/3/library/uuid.html' } },
      ],
    },
  ],
  demoExplainer: 'All four are version 1 UUIDs: time-based IDs minted when RFC 4122 was written, which is why they share every group except the first. There is no e-mail namespace; for other kinds of names, create your own namespace UUID once and keep it fixed.',

  patterns: [
    {
      name: 'Your own namespace',
      desc: 'Generate it once (python -c "import uuid; print(uuid.uuid4())") and paste the value into your code.',
      code: "import uuid\nORDERS_NS = uuid.UUID('1cc262f7-3046-59d8-af1f-724f1ed6b671')\norder_uuid = uuid.uuid5(ORDERS_NS, order_number)",
    },
    {
      name: 'A namespace derived from a URL',
      desc: 'Reproducible from documentation alone: the namespace is uuid5 of your site URL.',
      code: "import uuid\nMY_NS = uuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/ids')",
    },
  ],

  examples: [
    { title: 'NAMESPACE_DNS',                 code: 'import uuid\nuuid.NAMESPACE_DNS', returns: "UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')" },
    { title: 'All four as text',              code: 'import uuid\n[str(n) for n in (uuid.NAMESPACE_DNS, uuid.NAMESPACE_URL, uuid.NAMESPACE_OID, uuid.NAMESPACE_X500)]', returns: "['6ba7b810-9dad-11d1-80b4-00c04fd430c8', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', '6ba7b814-9dad-11d1-80b4-00c04fd430c8']" },
    { title: 'They are version 1 UUIDs',      code: 'import uuid\nuuid.NAMESPACE_URL.version', returns: '1' },
    { title: 'A domain under NAMESPACE_DNS',  code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 'example.com')", returns: "UUID('cfbff0d1-9375-5685-968c-48ce8b15ae17')" },
    { title: 'A URL under NAMESPACE_URL',     code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_URL, 'https://example.com/')", returns: "UUID('dd2c1780-811a-5296-81c5-178a0ef488bc')" },
    { title: 'Equal to the parsed RFC value', code: "import uuid\nuuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8') == uuid.NAMESPACE_DNS", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Same name, different namespace',
      desc: 'The namespace is part of the hash. If two systems must agree, they must agree on the namespace too.',
      wrong: { label: 'DNS vs URL', code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 'example.com') == uuid.uuid5(uuid.NAMESPACE_URL, 'example.com')", output: 'False' },
      fix:   { label: 'one agreed namespace', code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_DNS, 'example.com') == uuid.uuid5(uuid.NAMESPACE_DNS, 'example.com')", output: 'True' },
    },
    {
      name: 'Expecting a namespace for every kind of name',
      desc: 'Only DNS, URL, OID and X500 exist.',
      wrong: { label: 'NAMESPACE_EMAIL', code: 'import uuid\nuuid.NAMESPACE_EMAIL', output: "AttributeError: module 'uuid' has no attribute 'NAMESPACE_EMAIL'. Did you mean: 'NAMESPACE_OID'?" },
      fix:   { label: 'URL with mailto:', code: "import uuid\nuuid.uuid5(uuid.NAMESPACE_URL, 'mailto:ada@example.com').version", output: '5' },
    },
  ],

  when: {
    use: [
      'uuid5/uuid3 of domain names, URLs, OIDs or X.500 names: IDs other systems can reproduce',
    ],
    avoid: [
      'Your own record types → a private namespace UUID, so your IDs cannot collide with other people\'s uuid5(NAMESPACE_URL, ...)',
    ],
  },

  notes: {
    cpython:   "Module constants at the end of Lib/uuid.py: NAMESPACE_DNS = UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8') and so on",
    'Origin':  'Listed in RFC 4122 Appendix C (and RFC 9562); the same values are built into UUID libraries in other languages',
    'CLI':     'python -m uuid accepts @dns, @url, @oid and @x500 as shortcuts for these four (3.12+)',
  },

  related: [
    { name: 'uuid3 / uuid5', slug: 'uuid3-uuid5', when: 'What the namespaces are for' },
    { name: 'uuid.main', slug: 'main', when: '@dns / @url on the command line' },
    { name: 'UUID.fields', slug: 'fields', when: 'Decode their 1998 timestamp' },
  ],

  faq: [
    {
      q: 'What is NAMESPACE_DNS in Python uuid?',
      a: "A constant UUID, 6ba7b810-9dad-11d1-80b4-00c04fd430c8, defined by RFC 4122 for naming domain names with uuid3/uuid5. uuid.uuid5(uuid.NAMESPACE_DNS, 'python.org') is the same in every language.",
    },
    {
      q: 'Should I use NAMESPACE_URL or my own namespace?',
      a: 'NAMESPACE_URL when the names really are URLs and other systems should compute the same IDs. For internal names (user numbers, SKUs) use your own fixed namespace UUID.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.NAMESPACE_DNS',
    meta:  'uuid.NAMESPACE_DNS',
  },
};
