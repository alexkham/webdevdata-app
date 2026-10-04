// content/reference/python/stdlib/uuid/getnode.js

export const meta = {
  slug:        'getnode',
  name:        'uuid.getnode',
  signature:   'uuid.getnode()',
  blurb:       'The hardware (MAC) address of this machine as a 48-bit int, or a random 48-bit number with the multicast bit set if none can be found. The default node of uuid1().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 2.5+',
  searchTerms: 'uuid.getnode getnode python get mac address python hardware address 48-bit node uuid1 node multicast bit network interface',
};

export const method = {
  slug:      'getnode',
  name:      'uuid.getnode',
  signature: 'uuid.getnode()',
  returns:   { type: 'int', desc: 'A positive int below 2**48; cached after the first call.' },

  category:    'uuid function',
  version:     'Python 2.5+',
  hasLiveDemo: false,

  subtitle: 'Depends on the machine, so this page has no live demo. On Unix the first call may run an external program (ip or ifconfig on Linux; ifconfig, arp or netstat on macOS) and can be slow; on Windows a system call always succeeds. The result is cached for the rest of the process.',

  covers: ['getnode'],

  cheat: {
    commonCall: 'uuid.getnode()',
    returns:    'an int below 2**48, e.g. 0x112444be1e for 00:11:24:44:be:1e',
    replaces:   'Parsing ipconfig / ifconfig output yourself',
    watchOut:   'May be a random number, not a real address: check the multicast bit',
  },

  parameters: [],

  examples: [
    { title: 'An int below 2**48',          code: 'import uuid\nx = uuid.getnode()\n(type(x).__name__, 0 <= x < 2**48)', returns: "('int', True)" },
    { title: 'Cached: the same every call', code: 'import uuid\nuuid.getnode() == uuid.getnode()', returns: 'True' },
    { title: 'Format as a MAC address',     code: "import uuid\nnode = 0x00112444be1e\n':'.join(f'{b:02x}' for b in node.to_bytes(6))", returns: "'00:11:24:44:be:1e'" },
    { title: 'Random fallback? Test the multicast bit', code: 'import uuid\nnode = 0x00112444be1e\nbool(node & (1 << 40))', returns: 'False' },
    { title: 'Universal or local address',  code: 'import uuid\nnode = 0x00112444be1e\nbool(node & (1 << 41))', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Formatting with hex() and losing leading zeros',
      desc: 'hex() drops leading zero bytes, so the text is shorter than 12 digits. Format with a fixed width.',
      wrong: { label: 'hex(node)', code: 'node = 0x00112444be1e\nhex(node)', output: "'0x112444be1e'" },
      fix:   { label: "f'{node:012x}'", code: "node = 0x00112444be1e\nf'{node:012x}'", output: "'00112444be1e'" },
    },
    {
      name: 'Treating getnode() as a real MAC address',
      desc: 'If no address is found, getnode() returns a random number with the multicast bit (1 << 40) set, as RFC 4122 recommends. Real unicast addresses have that bit clear.',
      wrong: { label: 'trust it', code: 'random_node = 0x0300deadbeef\nf"{random_node:012x}"', output: "'0300deadbeef'" },
      fix:   { label: 'check the bit', code: 'random_node = 0x0300deadbeef\nbool(random_node & (1 << 40))', output: 'True' },
    },
  ],

  patterns: [
    {
      name: 'MAC address as text',
      desc: 'Six colon-separated bytes.',
      code: "import uuid\nmac = ':'.join(f'{b:02x}' for b in uuid.getnode().to_bytes(6))",
    },
    {
      name: 'Was it a real address?',
      desc: 'The random fallback sets the multicast bit.',
      code: 'import uuid\nis_random = bool(uuid.getnode() & (1 << 40))',
    },
  ],

  when: {
    use: [
      'Default node for uuid1 (it is called for you)',
      'A quick machine identifier for logs on a single host',
    ],
    avoid: [
      'Reliable network interface information → psutil or the platform tools',
      'Anything privacy-sensitive: it is the network card address',
    ],
  },

  notes: {
    cpython:       'getnode() in Lib/uuid.py tries platform getters in order (on Windows _windll_getnode via the _uuid extension, which always succeeds; on Linux the _uuid extension when built with libuuid, then ip and ifconfig output; on macOS ifconfig, arp and netstat), prefers universally administered addresses (bit 1 << 41 clear), and falls back to _random_getnode(): random.getrandbits(48) | (1 << 40)',
    'Cache':       'The result is stored in the module global _node, so later calls return the same value',
    'Availability':'All platforms; the value is machine-specific and can change when network hardware changes',
    '3.7':         'Since 3.7 universally administered MAC addresses are preferred over locally administered ones (docs: "Changed in version 3.7")',
  },

  related: [
    { name: 'uuid.uuid1', slug: 'uuid1', when: 'Uses getnode() as its default node' },
    { name: 'UUID.fields', slug: 'fields', when: 'node: where it ends up in a UUID' },
    { name: 'int.to_bytes()', slug: 'int-to_bytes', when: 'Split the 48-bit int into bytes', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the MAC address in Python?',
      a: "uuid.getnode() returns it as a 48-bit int; ':'.join(f'{b:02x}' for b in uuid.getnode().to_bytes(6)) formats it. With several interfaces, a universally administered one is preferred but there is no other ordering guarantee.",
    },
    {
      q: 'Why does uuid.getnode() return a different value each run?',
      a: 'No hardware address was found, so it fell back to a random 48-bit number (multicast bit set). It is cached only within one process.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/uuid.html#uuid.getnode',
    meta:  'uuid.getnode',
  },
};
