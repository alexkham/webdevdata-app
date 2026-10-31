// content/reference/python/stdlib/struct/format-characters.js — byte order prefixes and format codes

export const meta = {
  slug:        'format-characters',
  name:        'struct format characters',
  signature:   "[byte order: @ = < > !] then [count]code … e.g. '<2hI10s'",
  blurb:       'Every struct format code with its C type, Python type and standard size, plus the five byte-order characters that set byte order, sizes and alignment.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     "All Python versions ('n' 'N' 3.3+, 'e' 3.6+)",
  searchTerms: 'struct format characters python struct format string codes byte order size alignment little endian big endian network native x c b B ? h H i I l L q Q n N e f d s p P half precision float pascal string pad byte unsigned short signed char long long',
};

export const method = {
  slug:      'format-characters',
  name:      'struct format characters',
  signature: "[byte order: @ = < > !] then [count]code … e.g. '<2hI10s'",
  returns:   { type: 'str', desc: 'A format string, used by every struct function and by Struct().' },

  category:    'struct format strings',
  version:     "All Python versions ('n' 'N' 3.3+, 'e' 3.6+)",
  hasLiveDemo: true,

  subtitle: "A format string is an optional byte-order character followed by codes, each with an optional repeat count. Lowercase integer codes are signed, uppercase unsigned; the standard sizes below apply after '<', '>', '!' or '='.",

  covers: [],

  cheat: {
    commonCall: "'<' little · '>' big · 'B' 1 · 'H' 2 · 'I' 4 · 'Q' 8 · 'f' 4 · 'd' 8 · '10s'",
    returns:    'lowercase = signed, uppercase = unsigned',
    replaces:   'Memorizing C type sizes per platform',
    watchOut:   "Native 'l' is 8 bytes on Linux x86-64, 4 on Windows",
  },

  attributes: [
    { name: "@  (default)", type: 'native order, size, alignment', meaning: 'What the C compiler of this Python uses: native byte order, native sizes, pad bytes before fields that need alignment. Also used when the format has no prefix.' },
    { name: '=',  type: 'native order, standard size', meaning: 'Byte order of the machine, standard sizes, no padding. n, N and P are not allowed.' },
    { name: '<',  type: 'little-endian, standard',     meaning: 'Least significant byte first (x86, ARM, most file formats). Standard sizes, no padding.' },
    { name: '>',  type: 'big-endian, standard',        meaning: 'Most significant byte first. Standard sizes, no padding.' },
    { name: '!',  type: 'network = big-endian',        meaning: "Exactly the same as '>', named for network byte order (RFC 1700)." },
    { name: 'x',  type: 'pad byte · no value · 1',     meaning: 'Writes a zero byte, skips a byte when unpacking; takes no argument and produces no item.' },
    { name: 'c',  type: 'char · bytes of length 1 · 1', meaning: "One byte as a 1-byte bytes object. '3c' is three items; compare '3s'." },
    { name: 'b / B', type: 'signed / unsigned char · int · 1', meaning: '-128..127 / 0..255.' },
    { name: '?',  type: '_Bool · bool · 1',             meaning: 'Packs the truth value of any object as 0 or 1; unpacks any non-zero byte as True.' },
    { name: 'h / H', type: 'short / unsigned short · int · 2', meaning: '-32768..32767 / 0..65535.' },
    { name: 'i / I', type: 'int / unsigned int · int · 4', meaning: '-2147483648..2147483647 / 0..4294967295.' },
    { name: 'l / L', type: 'long / unsigned long · int · 4', meaning: 'Standard size 4, like i/I. Native size is the C long: 8 bytes on Linux x86-64, 4 on 64-bit Windows.' },
    { name: 'q / Q', type: 'long long · int · 8',       meaning: '-9223372036854775808..9223372036854775807 / 0..18446744073709551615.' },
    { name: 'n / N', type: 'ssize_t / size_t · int · native only', meaning: 'Only in native mode (3.3+); 8 bytes on 64-bit builds. After < > ! = they are a bad char.' },
    { name: 'e',  type: 'binary16 · float · 2',         meaning: 'IEEE 754 half precision (3.6+): about 3 significant digits, largest value 65504. 65519.99 still rounds down to 65504.0; from 65520 on, packing raises OverflowError (struct.error "int too large to convert" for an int argument).' },
    { name: 'f',  type: 'float · float · 4',            meaning: 'IEEE 754 binary32, about 7 significant digits. The value is rounded on packing; with a standard prefix, a value that rounds beyond the largest binary32 (3.4028234663852886e+38) raises OverflowError, while native mode stores inf.' },
    { name: 'd',  type: 'double · float · 8',           meaning: 'IEEE 754 binary64 — the same precision as a Python float, so it round-trips exactly.' },
    { name: 's',  type: 'char[] · bytes',               meaning: "The count is the LENGTH: '10s' is one 10-byte bytes item, truncated or NUL-padded on packing. '0s' is one empty item." },
    { name: 'p',  type: 'char[] · bytes',               meaning: "Pascal string: '10p' stores a length byte (at most 255) plus up to 9 data bytes, NUL-padded; unpacking returns only the stored length." },
    { name: 'P',  type: 'void * · int · native only',   meaning: 'A pointer-sized unsigned int, only in native mode (8 bytes on 64-bit builds).' },
  ],

  modes: [
    {
      id: 'char',
      label: 'one code',
      blurb: "Pack one value with a format, show its size, the bytes, and what unpacking them gives back. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt',   type: 'str', hint: "e.g. '<e'", input: 'text' },
        { name: 'value', type: 'str', hint: 'a Python literal', input: 'text' },
      ],
      template: 'import ast, struct\nvalue = ast.literal_eval({$value})\ndata = struct.pack({$fmt}, value)\n(struct.calcsize({$fmt}), data, struct.unpack({$fmt}, data)[0])',
      cases: [
        { id: 'half',   label: "'e' 0.1",       values: { fmt: '<e',  value: '0.1' } },
        { id: 'single', label: "'f' 0.1",       values: { fmt: '<f',  value: '0.1' } },
        { id: 'double', label: "'d' 0.1",       values: { fmt: '<d',  value: '0.1' } },
        { id: 'big',    label: "'e' 65519",     values: { fmt: '<e',  value: '65519' } },
        { id: 'bool',   label: "'?' 5",         values: { fmt: '<?',  value: '5' } },
        { id: 'pascal', label: "'5p'",          values: { fmt: '<5p', value: "b'hi'" } },
        { id: 'fixed',  label: "'4s'",          values: { fmt: '<4s', value: "b'hi'" } },
        { id: 'neg',    label: "'>q' -2",       values: { fmt: '>q',  value: '-2' } },
      ],
    },
    {
      id: 'align',
      label: 'native vs standard',
      blurb: "The same codes measured with '@' and '='. Native results are Linux x86-64's; 64-bit Windows gives the same for every code except 'l' and 'L'.",
      params: [{ name: 'codes', type: 'str', hint: "e.g. 'bi'", input: 'text' }],
      template: "import struct\n(struct.calcsize('@' + {$codes}), struct.calcsize('=' + {$codes}))",
      cases: [
        { id: 'bi',  label: 'bi',   values: { codes: 'bi' } },
        { id: 'ib',  label: 'ib',   values: { codes: 'ib' } },
        { id: 'cd',  label: '?d',   values: { codes: '?d' } },
        { id: 'z',   label: 'ci0i', values: { codes: 'ci0i' } },
        { id: 'qP',  label: 'qP',   values: { codes: 'qP' } },
      ],
    },
  ],
  demoExplainer: "0.1 has no exact binary form, so each float size keeps a different approximation: 'e' gives back 0.0999755859375, 'f' 0.10000000149011612, and only 'd' returns 0.1 itself. 65519 does not fit a half float either and is rounded to its largest value, 65504.0. '5p' stores the length 2 in its first byte and returns just b'hi', while '4s' keeps the NUL padding. In native mode a 1-byte field before an 8-byte double costs 7 pad bytes.",

  patterns: [
    {
      name: 'Read a fixed-width string field',
      desc: "'s' keeps the NUL padding — strip and decode it.",
      code: "import struct\nraw, = struct.unpack('<16s', field)\nname = raw.rstrip(b'\\x00').decode('ascii')",
    },
    {
      name: 'Pick the code by size and sign',
      desc: '1, 2, 4, 8 bytes → b/B, h/H, i/I, q/Q; lowercase if negative values are possible.',
      code: "import struct\nCODES = {(1, True): 'b', (1, False): 'B', (2, True): 'h', (2, False): 'H',\n         (4, True): 'i', (4, False): 'I', (8, True): 'q', (8, False): 'Q'}\nfmt = '<' + CODES[(size, signed)]",
    },
    {
      name: 'Match a C struct exactly',
      desc: "Native mode reproduces the compiler's padding; a trailing zero-count code pads the end.",
      code: "import struct\n# struct { char tag; double value; }: 7 pad bytes after tag\nREC = struct.Struct('@cd')  # REC.size == 16 on x86-64 Linux and Windows",
    },
  ],

  examples: [
    { title: 'Signed vs unsigned code',     code: "import struct\n(struct.unpack('<b', b'\\xff'), struct.unpack('<B', b'\\xff'))", returns: '((-1,), (255,))' },
    { title: "'3s' vs '3c'",                code: "import struct\n(struct.pack('<3s', b'abc'), struct.pack('<3c', b'a', b'b', b'c'))", returns: "(b'abc', b'abc')" },
    { title: "'x' adds a zero byte",         code: "import struct\nstruct.pack('<BxH', 1, 2)",                                       returns: "b'\\x01\\x00\\x02\\x00'" },
    { title: 'Half precision round trip',    code: "import struct\nstruct.unpack('<e', struct.pack('<e', 3.14159))",              returns: '(3.140625,)' },
    { title: "'!' is big-endian",            code: "import struct\nstruct.pack('!H', 1) == struct.pack('>H', 1)",                 returns: 'True' },
    { title: "'p' stores the length",       code: "import struct\nstruct.pack('<6p', b'abc')",                                     returns: "b'\\x03abc\\x00\\x00'" },
    { title: "'P' only in native mode",     code: "import struct\nstruct.calcsize('=P')",                                         returns: 'struct.error: bad char in struct format' },
  ],

  pitfalls: [
    {
      name: "Reading 's' as a repeat count",
      desc: "For 's' (and 'p') the number is the byte length of ONE item. '4s' takes one bytes value; '4c' takes four.",
      wrong: { label: "'4s' with 4 values", code: "import struct\nstruct.pack('<4s', b'a', b'b', b'c', b'd')", output: 'struct.error: pack expected 1 items for packing (got 4)' },
      fix:   { label: "'4s' with 1 value",  code: "import struct\nstruct.pack('<4s', b'abcd')",                output: "b'abcd'" },
    },
    {
      name: 'Using native mode for a packed layout',
      desc: "Without a prefix the codes get native alignment, so pad bytes appear between fields — and native 'l' is 8 bytes on Linux x86-64 but 4 on Windows. A file or wire format needs a standard prefix.",
      wrong: { label: "'cq' (native)", code: "import struct\nstruct.calcsize('cq')",  output: '16' },
      fix:   { label: "'<cq'",         code: "import struct\nstruct.calcsize('<cq')", output: '9' },
    },
  ],

  when: {
    use: [
      "'<' or '>' with b/B/h/H/i/I/q/Q/e/f/d/s for any file or network format",
      "'@' (or no prefix) only to match a C struct in the same process or machine",
    ],
    avoid: [
      "'l', 'L', 'n', 'N', 'P' in data that leaves the machine — their size is platform-dependent",
      "'p' unless the format really is a Pascal string",
    ],
  },

  notes: {
    cpython:      "Modules/_struct.c has three tables: native_table (sizes and alignment from the compiler), and lilendian_table / bigendian_table for the standard sizes. '=' picks the table matching the machine's byte order",
    'Repeat counts': "'4h' means 'hhhh'; a count of 0 packs nothing but still aligns in native mode. Whitespace between codes is ignored, but not between a count and its code",
    'Floats':     "'e', 'f' and 'd' always use IEEE 754 binary16, binary32 and binary64, whatever the platform's float format",
    'Versions':   "'n' and 'N' 3.3, 'e' 3.6; objects with __index__() are accepted by the integer codes since 3.2; unpacking a '0p' field gives b'' in 3.13 (3.12 raised SystemError: Negative size passed to PyBytes_FromStringAndSize)",
  },

  related: [
    { name: 'struct.calcsize', slug: 'calcsize', when: 'The size of any format' },
    { name: 'struct.pack',     slug: 'pack',     when: 'Use the codes to build bytes' },
    { name: 'struct.unpack',   slug: 'unpack',   when: 'Use the codes to read bytes' },
    { name: 'struct.error',    slug: 'error',    when: "What a bad code raises: 'bad char in struct format'" },
    { name: 'float.hex()',     slug: 'float-hex', when: 'See the exact binary value of a float', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between B and b in struct?',
      a: "Lowercase codes are signed, uppercase unsigned: 'b' is -128..127 and 'B' 0..255. The same byte 0xff unpacks as -1 with 'b' and 255 with 'B'. The same rule holds for h/H, i/I, l/L and q/Q.",
    },
    {
      q: 'Which struct code is a 4-byte integer?',
      a: "'i' (signed) or 'I' (unsigned) — 4 bytes with a standard prefix and on all common platforms in native mode. 'l'/'L' are also 4 with a standard prefix, but 8 natively on Linux x86-64.",
    },
    {
      q: 'What is the e format in struct?',
      a: "IEEE 754 half precision (binary16), added in Python 3.6: 2 bytes, about 3 significant digits, values up to 65504. Packing rounds to the nearest half-precision value; unpacking gives a regular Python float.",
    },
    {
      q: "Why is '<P' a bad char?",
      a: "'P' (pointer), 'n' (ssize_t) and 'N' (size_t) have no standard size, so they exist only in native mode — with '@' or no prefix.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#format-characters',
    meta:  'struct — Format Characters',
  },

};
