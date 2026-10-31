// content/reference/python/stdlib/struct/calcsize.js

export const meta = {
  slug:        'calcsize',
  name:        'struct.calcsize',
  signature:   'struct.calcsize(format)',
  blurb:       'The number of bytes a format string describes — what pack produces and what unpack needs — including native-mode alignment padding.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'struct calcsize python struct.calcsize size of format string bytes padding alignment native size sizeof c struct bad char in struct format repeat count given without format specifier total struct size too long',
};

export const method = {
  slug:      'calcsize',
  name:      'struct.calcsize',
  signature: 'struct.calcsize(format)',
  returns:   { type: 'int', desc: 'Size in bytes of the packed data.' },

  category:    'struct function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'Parses the format without packing anything. With "<", ">", "!" or "=" the size is the plain sum of standard sizes; in native mode it also counts the pad bytes the C compiler would insert.',

  covers: ['calcsize'],

  cheat: {
    commonCall: "struct.calcsize('<HHI')",
    returns:    '8 — an int, in bytes',
    replaces:   'Adding up field sizes by hand',
    watchOut:   'Native results differ between platforms',
  },

  parameters: [
    { name: 'format', type: 'str | bytes', required: true, default: null, desc: 'A struct format string. An invalid one raises struct.error here, just as it would in pack or unpack.' },
  ],

  modes: [
    {
      id: 'size',
      label: 'calcsize',
      blurb: "Any format string. Native results ('@' or no prefix) are Linux x86-64's; 64-bit Windows gives the same except for 'l' and 'L'.",
      params: [{ name: 'fmt', type: 'str', hint: "e.g. '@bhq'", input: 'text' }],
      template: 'import struct\nstruct.calcsize({$fmt})',
      cases: [
        { id: 'std',     label: '<bhq',       values: { fmt: '<bhq' } },
        { id: 'native',  label: '@bhq',       values: { fmt: '@bhq' } },
        { id: 'reorder', label: '@qhb',       values: { fmt: '@qhb' } },
        { id: 'zero',    label: '@qh0q',      values: { fmt: '@qh0q' } },
        { id: 'space',   label: 'space: <i i', values: { fmt: '<i i' } },
        { id: 'count',   label: 'count then space', values: { fmt: '<2 i' } },
        { id: 'dangling', label: 'dangling count', values: { fmt: '<3' } },
      ],
    },
    {
      id: 'compare',
      label: 'native vs standard',
      blurb: "The same codes measured with '@' (native size and alignment, as on Linux x86-64; 64-bit Windows differs only for 'l' and 'L') and '=' (standard sizes, no padding).",
      params: [{ name: 'codes', type: 'str', hint: "format codes, e.g. 'bi'", input: 'text' }],
      template: "import struct\n(struct.calcsize('@' + {$codes}), struct.calcsize('=' + {$codes}))",
      cases: [
        { id: 'bi',   label: 'bi',   values: { codes: 'bi' } },
        { id: 'ib',   label: 'ib',   values: { codes: 'ib' } },
        { id: 'hq',   label: 'hq',   values: { codes: 'hq' } },
        { id: 'cd',   label: 'cd',   values: { codes: 'cd' } },
        { id: 'pad0', label: 'ci0i', values: { codes: 'ci0i' } },
        { id: 'p',    label: 'qP',   values: { codes: 'qP' } },
      ],
    },
  ],
  demoExplainer: "'@bhq' is 16 bytes, not 11: one pad byte puts the short at offset 2 and four more put the 8-byte q at offset 8. Ordering fields from largest to smallest ('@qhb') removes the padding, because nothing is ever added at the end. A zero repeat count such as '0q' adds no field but still aligns, which is how a native format pads its own end. Whitespace may separate codes but not a count from its code, and 'P' exists only in native mode — so '=qP' is a bad char.",

  patterns: [
    {
      name: 'Read one record from a file',
      desc: 'calcsize tells read() how many bytes to take.',
      code: "import struct\nfmt = '<IHH'\nwith open('data.bin', 'rb') as f:\n    record = struct.unpack(fmt, f.read(struct.calcsize(fmt)))",
    },
    {
      name: 'Count records in a buffer',
      desc: 'Integer division by the record size.',
      code: "import struct\ncount = len(data) // struct.calcsize('<hh')",
    },
    {
      name: 'Round a native struct up like sizeof',
      desc: "struct never pads the end; a zero-count code does: '@iqc' is 17 bytes, '@iqc0q' 24.",
      code: "import struct\nRECORD = struct.Struct('@iqc0q')  # int, long long, char + tail padding",
    },
  ],

  examples: [
    { title: 'Standard sizes add up',     code: "import struct\nstruct.calcsize('<bhl')",  returns: '7' },
    { title: 'Native mode adds padding',  code: "import struct\nstruct.calcsize('@bhq')",  returns: '16' },
    { title: 'Same fields, other order',  code: "import struct\nstruct.calcsize('@qhb')",  returns: '11' },
    { title: "'10s' is ten bytes",        code: "import struct\nstruct.calcsize('10s')",   returns: '10' },
    { title: "'x' counts, takes no value", code: "import struct\nstruct.calcsize('<B3xI')", returns: '8' },
    { title: 'Empty format',              code: "import struct\nstruct.calcsize('<')",     returns: '0' },
    { title: 'An unknown code',           code: "import struct\nstruct.calcsize('<z')",    returns: 'struct.error: bad char in struct format' },
  ],

  pitfalls: [
    {
      name: 'Assuming native sizes are the same everywhere',
      desc: "Native 'l' is 8 bytes on Linux x86-64 and 4 on 64-bit Windows, so '@l' formats change size between machines. Standard sizes are fixed: '<l' is 4 bytes on every platform; use 'q' for 8.",
      wrong: { label: "'@hq' (padding)",      code: "import struct\nstruct.calcsize('@hq')", output: '16' },
      fix:   { label: "'<hq' (fixed layout)", code: "import struct\nstruct.calcsize('<hq')", output: '10' },
    },
    {
      name: 'A space between the count and the code',
      desc: 'Whitespace is allowed between items but not inside one.',
      wrong: { label: "'<2 i'", code: "import struct\nstruct.calcsize('<2 i')", output: 'struct.error: bad char in struct format' },
      fix:   { label: "'<2i'",  code: "import struct\nstruct.calcsize('<2i')",  output: '8' },
    },
  ],

  when: {
    use: [
      'Knowing how many bytes to read from a file or socket for one record',
      'Checking that a format matches a C struct or a documented layout',
    ],
    avoid: [
      'A compiled Struct at hand → its .size attribute',
      'Variable-length data (strings with a length prefix) → read the length first',
    ],
  },

  notes: {
    cpython:   "Modules/_struct.c prepare_s: one pass over the format adds up the sizes, aligning each field in native mode; the same parse raises 'bad char in struct format', 'repeat count given without format specifier', 'embedded null character' and 'total struct size too long'",
    'Limits':  "Sizes up to sys.maxsize are allowed: calcsize('9223372036854775807x') works on a 64-bit build, one byte more is 'total struct size too long'",
    'Platforms': "Linux x86-64 and 64-bit Windows agree on every native size except 'l'/'L' (8 vs 4 bytes); 'n', 'N' and 'P' are 8 on both",
  },

  related: [
    { name: 'struct.pack',       slug: 'pack',              when: 'Produces calcsize(format) bytes' },
    { name: 'struct.unpack',     slug: 'unpack',            when: 'Needs exactly calcsize(format) bytes' },
    { name: 'Struct.size',       slug: 'struct',            when: 'The same number on a compiled Struct' },
    { name: 'format characters', slug: 'format-characters', when: 'Sizes and alignment of every code' },
  ],

  faq: [
    {
      q: 'Why does struct.calcsize return more than the sum of the fields?',
      a: "In native mode (no prefix, or '@') fields are aligned like a C compiler aligns them, so pad bytes are inserted before a field that needs alignment. Use '<', '>', '!' or '=' for packed layouts without padding.",
    },
    {
      q: 'What does "repeat count given without format specifier" mean?',
      a: "The format ends with digits that have no format code after them, e.g. '<3'. Every count must be followed directly by a code: '<3h'.",
    },
    {
      q: 'Is struct.calcsize the same as sizeof in C?',
      a: "In native mode it follows the same compiler rules for each field, with one difference: struct never adds padding at the end, while sizeof includes trailing padding. End the format with a zero-count code, e.g. '0q', to round the size up like sizeof does.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.calcsize',
    meta:  'struct.calcsize',
  },

};
