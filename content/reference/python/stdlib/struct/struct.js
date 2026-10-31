// content/reference/python/stdlib/struct/struct.js — struct.Struct, its methods and attributes

export const meta = {
  slug:        'struct',
  name:        'struct.Struct',
  signature:   'struct.Struct(format)',
  blurb:       'A compiled format string: parse it once, then call pack, unpack, pack_into, unpack_from and iter_unpack on it, and read its size and format.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions (repr Struct(...) 3.13+)',
  searchTerms: 'struct.Struct Struct class python compiled struct format reuse Struct.format Struct.size Struct.pack Struct.pack_into Struct.unpack Struct.unpack_from Struct.iter_unpack precompile format performance',
};

export const method = {
  slug:      'struct',
  name:      'struct.Struct',
  signature: 'struct.Struct(format)',
  returns:   { type: 'Struct', desc: 'An object with the five pack/unpack methods bound to this format, plus .format and .size.' },

  category:    'struct class',
  version:     'All Python 3 versions (repr Struct(...) 3.13+)',
  hasLiveDemo: true,

  subtitle: 'Every module-level struct function has a Struct method twin that takes the same arguments minus the format. Build one per record layout, give it a name, and read .size instead of calling calcsize.',

  covers: ['Struct', 'Struct.format', 'Struct.size', 'Struct.pack', 'Struct.pack_into', 'Struct.unpack', 'Struct.unpack_from', 'Struct.iter_unpack'],

  cheat: {
    commonCall: "HEADER = struct.Struct('<4sHI')",
    returns:    "Struct('<4sHI') — .size 10, .format '<4sHI'",
    replaces:   'Repeating the same format string at every call',
    watchOut:   '.format and .size are read-only',
  },

  parameters: [
    { name: 'format', type: 'str | bytes', required: true, default: null, desc: 'The format string, compiled immediately — an invalid format raises struct.error here, not at the first pack.' },
  ],

  attributes: [
    { name: 'format',                        type: 'str',   meaning: 'The format string — a str since 3.7, even when the Struct was built from bytes. Read-only.' },
    { name: 'size',                          type: 'int',   meaning: 'calcsize(format): the bytes pack produces and unpack needs. Read-only.' },
    { name: 'pack(v1, v2, ...)',             type: 'bytes', meaning: 'struct.pack with this format; len(result) == size.' },
    { name: 'unpack(buffer)',                type: 'tuple', meaning: 'struct.unpack with this format; len(buffer) must equal size.' },
    { name: 'pack_into(buffer, offset, v1, ...)', type: 'None', meaning: 'struct.pack_into with this format: write into a writable buffer at offset.' },
    { name: 'unpack_from(buffer, offset=0)', type: 'tuple', meaning: 'struct.unpack_from with this format: read one record at offset of a longer buffer.' },
    { name: 'iter_unpack(buffer)',           type: 'iterator', meaning: 'struct.iter_unpack with this format: one tuple per record (3.4+).' },
  ],

  modes: [
    {
      id: 'compile',
      label: 'pack + unpack',
      blurb: "Compile a format, pack the values with s.pack and read them back with s.unpack. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt',    type: 'str', hint: "e.g. '<hi'", input: 'text' },
        { name: 'values', type: 'str', hint: 'e.g. 1, 2',  input: 'text' },
      ],
      template: 'import ast, struct\ns = struct.Struct({$fmt})\ndata = s.pack(*ast.literal_eval({$values}))\n(s, s.size, data, s.unpack(data))',
      cases: [
        { id: 'ints',   label: '<hi',          values: { fmt: '<hi',  values: '1, 2' } },
        { id: 'bytes',  label: '>3sB',         values: { fmt: '>3sB', values: "b'abc', 255" } },
        { id: 'double', label: '<d 0.1',       values: { fmt: '<d',   values: '0.1,' } },
        { id: 'range',  label: 'q overflow',   values: { fmt: '<q',   values: '9223372036854775808,' } },
        { id: 'count',  label: 'missing value', values: { fmt: '<hi', values: '1,' } },
      ],
    },
    {
      id: 'methods',
      label: 'format, size, iter_unpack',
      blurb: "Read the attributes and walk a buffer of several records with s.iter_unpack. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt', type: 'str', hint: 'one record', input: 'text' },
        { name: 'hex', type: 'str', hint: 'hex bytes',  input: 'text' },
      ],
      template: 'import struct\ns = struct.Struct({$fmt})\ndata = bytes.fromhex({$hex})\n(s.format, s.size, list(s.iter_unpack(data)))',
      cases: [
        { id: 'pairs', label: 'two records',   values: { fmt: '<hh', hex: '0100 0200 0300 0400' } },
        { id: 'ips',   label: 'IPv4 list',     values: { fmt: '>I',  hex: 'c0a80101 08080808' } },
        { id: 'odd',   label: 'partial record', values: { fmt: '<hh', hex: '010203' } },
      ],
    },
  ],
  demoExplainer: "The repr Struct('<hi') is new in Python 3.13; older versions print <_struct.Struct object at 0x…>. A double round-trips exactly (0.1 comes back as 0.1), unlike 'f'. The errors are the same as the module functions', because the module functions build (and cache) a Struct internally.",

  patterns: [
    {
      name: 'One Struct per record type',
      desc: 'Module-level constants document the layout and compile it once.',
      code: "import struct\nHEADER = struct.Struct('<4sHHI')\nENTRY = struct.Struct('<IHH')\nmagic, version, flags, count = HEADER.unpack_from(data)\nentries = [ENTRY.unpack_from(data, HEADER.size + i * ENTRY.size) for i in range(count)]",
    },
    {
      name: 'Read fixed-size records from a file',
      desc: 'size tells read() how much to take.',
      code: "import struct\nREC = struct.Struct('<If')\nwith open('log.bin', 'rb') as f:\n    while chunk := f.read(REC.size):\n        ts, value = REC.unpack(chunk)",
    },
    {
      name: 'Build a buffer of records',
      desc: 'pack_into with offsets in steps of size.',
      code: "import struct\nREC = struct.Struct('<hh')\nbuf = bytearray(REC.size * len(points))\nfor i, (x, y) in enumerate(points):\n    REC.pack_into(buf, i * REC.size, x, y)",
    },
  ],

  examples: [
    { title: 'Compile once',                code: "import struct\ns = struct.Struct('<hi')\n(s.format, s.size)",                 returns: "('<hi', 6)" },
    { title: 'pack and unpack',             code: "import struct\ns = struct.Struct('<hi')\ns.unpack(s.pack(1, 2))",             returns: '(1, 2)' },
    { title: 'format is always a str',      code: "import struct\nstruct.Struct(b'>H').format",                             returns: "'>H'" },
    { title: 'pack_into and unpack_from',   code: "import struct\ns = struct.Struct('<hi')\nbuf = bytearray(8)\ns.pack_into(buf, 1, 3, 4)\ns.unpack_from(buf, 1)", returns: '(3, 4)' },
    { title: 'iter_unpack',                 code: "import struct\nlist(struct.Struct('<hh').iter_unpack(bytes(8)))",         returns: '[(0, 0), (0, 0)]' },
    { title: 'The repr (3.13+)',            code: "import struct\nstruct.Struct('<hi')",                                     returns: "Struct('<hi')" },
    { title: 'Bad formats fail at once',    code: "import struct\nstruct.Struct('<hz')",                                     returns: 'struct.error: bad char in struct format' },
  ],

  pitfalls: [
    {
      name: 'Comparing two Structs',
      desc: 'Struct objects compare by identity, so two Structs built from the same format are not equal. Compare their .format instead.',
      wrong: { label: 's1 == s2',               code: "import struct\nstruct.Struct('<hi') == struct.Struct('<hi')",               output: 'False' },
      fix:   { label: 's1.format == s2.format', code: "import struct\nstruct.Struct('<hi').format == struct.Struct('<hi').format", output: 'True' },
    },
    {
      name: 'Trying to change the format',
      desc: '.format and .size are read-only attributes. Build a new Struct for a new layout.',
      wrong: { label: 's.format = ...', code: "import struct\ns = struct.Struct('<h')\ns.format = '<i'",    output: "AttributeError: attribute 'format' of '_struct.Struct' objects is not writable" },
      fix:   { label: 'new Struct',     code: "import struct\ns = struct.Struct('<i')\n(s.format, s.size)", output: "('<i', 4)" },
    },
  ],

  when: {
    use: [
      'A record layout used in many places or in a loop',
      'Naming formats (HEADER, ENTRY) so the code documents the binary layout',
      'Needing the record size next to the format (.size)',
    ],
    avoid: [
      'A one-off conversion → the module functions (they cache recent formats anyway)',
      'Saving the Struct itself with pickle → it cannot be pickled; store the format string',
    ],
  },

  notes: {
    cpython:     'Modules/_struct.c: Struct.__init__ parses the format into a list of codes with their offsets; every method reuses it. type(s).__module__ is "_struct"',
    'Methods':   'pack(*v), unpack(buffer), pack_into(buffer, offset, *v), unpack_from(buffer, offset=0), iter_unpack(buffer) — the module functions without the format argument',
    'Attributes': 'format (str since 3.7; bytes before) and size; both read-only',
    'Versions':  'Struct.iter_unpack 3.4; repr Struct(...) instead of <_struct.Struct object at ...> 3.13',
  },

  related: [
    { name: 'struct.pack',        slug: 'pack',        when: 'The module function behind Struct.pack' },
    { name: 'struct.unpack',      slug: 'unpack',      when: 'The module function behind Struct.unpack' },
    { name: 'struct.calcsize',    slug: 'calcsize',    when: 'The same number as Struct.size' },
    { name: 'struct.iter_unpack', slug: 'iter_unpack', when: 'Records in a row' },
    { name: 'struct.error',       slug: 'error',       when: 'Raised for bad formats and values' },
  ],

  faq: [
    {
      q: 'When should I use struct.Struct instead of struct.pack?',
      a: 'When the same format is used repeatedly or deserves a name. The module functions keep a small cache of compiled formats, so a Struct is mostly about clarity — HEADER.unpack(data) reads better than repeating a format string — plus .size at hand.',
    },
    {
      q: 'How do I get the size of a struct format?',
      a: "struct.Struct(fmt).size, or struct.calcsize(fmt) — the same number. len(s.pack(...)) always equals s.size.",
    },
    {
      q: 'Why does print(struct.Struct("<i")) show an address on my Python?',
      a: "The readable repr Struct('<i') was added in Python 3.13. Before that the repr is the default <_struct.Struct object at 0x…>; read s.format to see the format.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.Struct',
    meta:  'struct.Struct',
  },

};
