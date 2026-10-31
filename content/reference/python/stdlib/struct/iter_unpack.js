// content/reference/python/stdlib/struct/iter_unpack.js

export const meta = {
  slug:        'iter_unpack',
  name:        'struct.iter_unpack',
  signature:   'struct.iter_unpack(format, buffer)',
  blurb:       'Iterate over a buffer made of equal-size records: each step unpacks the next calcsize(format) bytes into a tuple.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'struct iter_unpack python struct.iter_unpack iterate records binary array of structs unpack many records loop iterative unpacking requires a buffer of a multiple of bytes cannot iteratively unpack with a struct of length 0 unpack_iterator',
};

export const method = {
  slug:      'iter_unpack',
  name:      'struct.iter_unpack',
  signature: 'struct.iter_unpack(format, buffer)',
  returns:   { type: 'iterator of tuple', desc: 'A lazy _struct.unpack_iterator; one tuple per record.' },

  category:    'struct function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'The buffer is checked up front: its length must be a whole multiple of the record size. Then each next() unpacks one record — no slicing, no offset arithmetic.',

  covers: ['iter_unpack'],

  cheat: {
    commonCall: "for x, y in struct.iter_unpack('<hh', data): ...",
    returns:    'an iterator of tuples — list() it to see them all',
    replaces:   'A range() loop over unpack_from offsets',
    watchOut:   'len(buffer) must be a multiple of calcsize(format)',
  },

  parameters: [
    { name: 'format', type: 'str | bytes', required: true, default: null, desc: 'The format of ONE record. Its size must not be 0.' },
    { name: 'buffer', type: 'bytes-like',  required: true, default: null, desc: 'bytes, bytearray, memoryview … whose length is a multiple of calcsize(format) (0 records is fine).' },
  ],

  modes: [
    {
      id: 'iter',
      label: 'iter_unpack',
      blurb: "One record format and a buffer of hex bytes; list() collects every record. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'fmt', type: 'str', hint: "e.g. '<hh'", input: 'text' },
        { name: 'hex', type: 'str', hint: 'hex bytes', input: 'text' },
      ],
      template: 'import struct\nlist(struct.iter_unpack({$fmt}, bytes.fromhex({$hex})))',
      cases: [
        { id: 'pairs',  label: 'pairs of shorts', values: { fmt: '<hh', hex: '0100 0200 0300 0400' } },
        { id: 'bytes',  label: 'single bytes',    values: { fmt: '<B',  hex: '0a0b0c' } },
        { id: 'empty',  label: 'empty buffer',    values: { fmt: '>H',  hex: '' } },
        { id: 'pad',    label: 'pad-only records', values: { fmt: '<x', hex: '0000' } },
        { id: 'ragged', label: 'leftover byte',   values: { fmt: '<I',  hex: '01020304 05' } },
        { id: 'zero',   label: 'zero-size format', values: { fmt: '<',  hex: '' } },
      ],
    },
  ],
  demoExplainer: "Each record becomes its own tuple, so a one-field format gives one-item tuples like (10,). An empty buffer is zero records, not an error. A format with only pad bytes ('<x') yields empty tuples — one per byte. The leftover byte is rejected before anything is unpacked, and a format of size 0 cannot be iterated at all.",

  patterns: [
    {
      name: 'Loop over records',
      desc: 'Tuple unpacking in the for statement names the fields.',
      code: "import struct\nfor timestamp, value in struct.iter_unpack('<If', samples):\n    print(timestamp, value)",
    },
    {
      name: 'Flatten one-field records',
      desc: 'Unpack the one-item tuples in the comprehension.',
      code: "import struct\nvalues = [v for (v,) in struct.iter_unpack('<h', pcm_bytes)]",
    },
    {
      name: 'Records after a header',
      desc: 'Slice (or memoryview) off the header, then iterate the rest.',
      code: "import struct\nrecords = struct.iter_unpack('<IHH', memoryview(data)[16:])",
    },
  ],

  examples: [
    { title: 'All records as a list',      code: "import struct\nlist(struct.iter_unpack('<hh', b'\\x01\\x00\\x02\\x00\\x03\\x00\\x04\\x00'))", returns: '[(1, 2), (3, 4)]' },
    { title: 'Flatten single fields',      code: "import struct\n[x for (x,) in struct.iter_unpack('<B', b'\\x0a\\x0b')]",                       returns: '[10, 11]' },
    { title: 'Sum 16-bit samples',         code: "import struct\nsum(v for (v,) in struct.iter_unpack('<h', b'\\x01\\x00\\xff\\xff\\x05\\x00'))", returns: '5' },
    { title: 'Pairs into a dict',          code: "import struct\ndict(struct.iter_unpack('<BB', b'\\x01\\x02\\x03\\x04'))",                    returns: '{1: 2, 3: 4}' },
    { title: 'It is lazy',                 code: "import struct\nit = struct.iter_unpack('<hh', b'\\x01\\x00\\x02\\x00\\x03\\x00\\x04\\x00')\n(next(it), it.__length_hint__())", returns: '((1, 2), 1)' },
    { title: 'Leftover bytes are an error', code: "import struct\nstruct.iter_unpack('<I', b'\\x01\\x02\\x03\\x04\\x05')",                     returns: 'struct.error: iterative unpacking requires a buffer of a multiple of 4 bytes' },
  ],

  pitfalls: [
    {
      name: 'Calling len() on the iterator',
      desc: 'iter_unpack returns an iterator, not a list. Compute the count from the sizes, or call list() once.',
      wrong: { label: 'len(it)',                  code: "import struct\nlen(struct.iter_unpack('<H', b'\\x01\\x00\\x02\\x00'))",           output: "TypeError: object of type '_struct.unpack_iterator' has no len()" },
      fix:   { label: 'len(data) // calcsize()', code: "import struct\ndata = b'\\x01\\x00\\x02\\x00'\nlen(data) // struct.calcsize('<H')", output: '2' },
    },
    {
      name: 'Iterating twice',
      desc: 'Like every iterator it is used up after one pass. Keep a list if you need the records again.',
      wrong: { label: 'second pass', code: "import struct\nit = struct.iter_unpack('<B', b'\\x01\\x02')\nfirst = list(it)\nlist(it)",      output: '[]' },
      fix:   { label: 'list once',   code: "import struct\nrecords = list(struct.iter_unpack('<B', b'\\x01\\x02'))\nrecords + records", output: '[(1,), (2,), (1,), (2,)]' },
    },
  ],

  when: {
    use: [
      'Binary arrays of identical records: samples, coordinates, table rows',
      'Streaming through a large buffer without building every tuple at once',
    ],
    avoid: [
      'Records of different layouts → unpack_from with your own offsets',
      'Many numbers of one type → array.array or memoryview.cast is faster',
    ],
  },

  notes: {
    cpython:     "Modules/_struct.c: the size-0 check ('cannot iteratively unpack with a struct of length 0') runs before the buffer is even looked at, the multiple-of-size check right after",
    'Iterator':  "type _struct.unpack_iterator; supports __length_hint__ (records left), not len()",
    'Version':   'New in Python 3.4 (module function and Struct.iter_unpack)',
  },

  related: [
    { name: 'struct.unpack',       slug: 'unpack',      when: 'Exactly one record' },
    { name: 'struct.unpack_from',  slug: 'unpack_from', when: 'Records at arbitrary offsets' },
    { name: 'Struct.iter_unpack',  slug: 'struct',      when: 'Same on a compiled format' },
    { name: 'memoryview.cast()',   slug: 'memoryview-cast', when: 'View a buffer as many numbers of one type', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I unpack an array of structs in Python?',
      a: "struct.iter_unpack(record_format, data) yields one tuple per record — e.g. for x, y in struct.iter_unpack('<hh', data). The data length must be a whole number of records.",
    },
    {
      q: 'What does "iterative unpacking requires a buffer of a multiple of N bytes" mean?',
      a: 'The buffer has leftover bytes that do not make a whole record. Check the record format (padding, byte sizes) or cut the buffer to len(data) - len(data) % size if a partial record at the end is expected.',
    },
    {
      q: 'Is iter_unpack faster than calling unpack in a loop?',
      a: 'It compiles the format once and reads records from the buffer without slicing, so it avoids the per-record slice and lookup of a hand-written loop. For one numeric type, memoryview.cast or array.array avoid creating tuples altogether.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.iter_unpack',
    meta:  'struct.iter_unpack',
  },

};
