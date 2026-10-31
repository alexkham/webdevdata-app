// content/reference/python/stdlib/struct/pack_into.js

export const meta = {
  slug:        'pack_into',
  name:        'struct.pack_into',
  signature:   'struct.pack_into(format, buffer, offset, v1, v2, ...)',
  blurb:       'Pack values straight into a writable buffer such as a bytearray, starting at a byte offset — no new bytes object, no copying.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'struct pack_into python struct.pack_into write into bytearray offset buffer in place pack_into requires a buffer of at least bytes no space to pack offset out of range argument must be read-write bytes-like object memoryview',
};

export const method = {
  slug:      'pack_into',
  name:      'struct.pack_into',
  signature: 'struct.pack_into(format, buffer, offset, v1, v2, ...)',
  returns:   { type: 'None', desc: 'The buffer is modified in place.' },

  category:    'struct function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Like pack, but the bytes land inside a buffer you already have, at offset. The offset is required; negative offsets count from the end; the region must fit entirely inside the buffer.',

  covers: ['pack_into'],

  cheat: {
    commonCall: "struct.pack_into('<H', buf, 2, 513)",
    returns:    'None — buf now has 01 02 at offsets 2 and 3',
    replaces:   'buf[2:4] = struct.pack(...)',
    watchOut:   'bytes is read-only: use a bytearray',
  },

  parameters: [
    { name: 'format', type: 'str | bytes', required: true, default: null, desc: 'A struct format string, as for pack.' },
    { name: 'buffer', type: 'writable buffer', required: true, default: null, desc: 'A bytearray, a writable memoryview, array.array, mmap … — not bytes.' },
    { name: 'offset', type: 'int', required: true, default: null, desc: 'Where the first byte goes. Negative values count from the end of the buffer; offset + calcsize(format) must not run past the end.' },
    { name: 'v1, v2, ...', type: 'values', required: true, default: null, desc: 'One value per format item, exactly as for pack.' },
  ],

  modes: [
    {
      id: 'into',
      label: 'pack_into',
      blurb: "A zero-filled bytearray of size bytes; the packed values are written at offset. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'size',   type: 'int', hint: 'buffer length', input: 'number' },
        { name: 'fmt',    type: 'str', hint: "e.g. '<H'", input: 'text' },
        { name: 'offset', type: 'int', hint: 'start byte', input: 'number' },
        { name: 'values', type: 'str', hint: 'e.g. 513,', input: 'text' },
      ],
      template: 'import ast, struct\nbuf = bytearray({$size})\nstruct.pack_into({$fmt}, buf, {$offset}, *ast.literal_eval({$values}))\nbuf',
      cases: [
        { id: 'middle', label: 'offset 2',        values: { size: '8', fmt: '<H',  offset: '2',  values: '513,' } },
        { id: 'two',    label: 'two fields',      values: { size: '6', fmt: '>HH', offset: '1',  values: '258, 772' } },
        { id: 'end',    label: 'offset -4',       values: { size: '8', fmt: '<I',  offset: '-4', values: '1,' } },
        { id: 'nospace', label: 'offset -2',      values: { size: '8', fmt: '<I',  offset: '-2', values: '1,' } },
        { id: 'small',  label: 'buffer too small', values: { size: '4', fmt: '<I',  offset: '2',  values: '1,' } },
      ],
    },
    {
      id: 'partial',
      label: 'after an error',
      blurb: "The buffer starts as 0xff bytes. When a value fails, look at what pack_into already wrote. Native formats (no prefix, or '@') are computed as on Linux x86-64.",
      params: [
        { name: 'size',   type: 'int', hint: 'buffer length', input: 'number' },
        { name: 'fmt',    type: 'str', hint: "e.g. '<HH'", input: 'text' },
        { name: 'values', type: 'str', hint: 'e.g. 1, 70000', input: 'text' },
      ],
      template: "import ast, struct\nbuf = bytearray(b'\\xff' * {$size})\ntry:\n    struct.pack_into({$fmt}, buf, 0, *ast.literal_eval({$values}))\n    status = 'ok'\nexcept struct.error as e:\n    status = str(e)\n(status, buf)",
      cases: [
        { id: 'second', label: 'second value bad', values: { size: '6', fmt: '<HH', values: '1, 70000' } },
        { id: 'first',  label: 'first value bad',  values: { size: '6', fmt: '<HH', values: '70000, 1' } },
        { id: 'ok',     label: 'both fine',        values: { size: '6', fmt: '<HH', values: '1, 2' } },
      ],
    },
  ],
  demoExplainer: "A negative offset counts from the end: -4 in an 8-byte buffer is offset 4. Before checking a single value, pack_into fills the whole target region with zero bytes and then writes the fields in order — so when the second value is out of range, the first one is already written and the bytes after it are zeros, not the original 0xff. Only the region the format covers is touched.",

  patterns: [
    {
      name: 'Fill a preallocated buffer in a loop',
      desc: 'One compiled Struct, offsets in steps of its size.',
      code: "import struct\nrec = struct.Struct('<hh')\nbuf = bytearray(rec.size * len(points))\nfor i, (x, y) in enumerate(points):\n    rec.pack_into(buf, i * rec.size, x, y)",
    },
    {
      name: 'Patch a field in a header',
      desc: 'Write the final length into a header you reserved earlier.',
      code: "import struct\nstruct.pack_into('<I', header, 4, len(body))",
    },
    {
      name: 'Write through a memoryview',
      desc: 'Any writable buffer works, including a slice of a larger one.',
      code: "import struct\nview = memoryview(buf)[16:]\nstruct.pack_into('<d', view, 0, value)",
    },
  ],

  examples: [
    { title: 'Write at an offset',          code: "import struct\nbuf = bytearray(b'....')\nstruct.pack_into('<H', buf, 1, 0x4142)\nbuf", returns: "bytearray(b'.BA.')" },
    { title: 'It returns None',             code: "import struct\nbuf = bytearray(8)\nresult = struct.pack_into('<HI', buf, 0, 1, 2)\n(result, buf)", returns: "(None, bytearray(b'\\x01\\x00\\x02\\x00\\x00\\x00\\x00\\x00'))" },
    { title: 'Records side by side',        code: "import struct\nbuf = bytearray(6)\nfor i, v in enumerate([1, 2, 3]):\n    struct.pack_into('<H', buf, i * 2, v)\nbuf", returns: "bytearray(b'\\x01\\x00\\x02\\x00\\x03\\x00')" },
    { title: 'Through a memoryview',        code: "import struct\nbuf = bytearray(4)\nstruct.pack_into('>H', memoryview(buf), 2, 258)\nbuf", returns: "bytearray(b'\\x00\\x00\\x01\\x02')" },
    { title: 'Past the end',                code: "import struct\nstruct.pack_into('<I', bytearray(4), 2, 1)",  returns: 'struct.error: pack_into requires a buffer of at least 6 bytes for packing 4 bytes at offset 2 (actual buffer size is 4)' },
    { title: 'bytes is read-only',          code: "import struct\nstruct.pack_into('<H', b'abcd', 0, 1)",     returns: 'TypeError: argument must be read-write bytes-like object, not bytes' },
  ],

  pitfalls: [
    {
      name: 'Leaving out the offset',
      desc: 'The offset is a required positional argument, even when it is 0 — so the first value is taken as the offset and one value is missing.',
      wrong: { label: 'no offset', code: "import struct\nbuf = bytearray(2)\nstruct.pack_into('<H', buf, 513)\nbuf",    output: 'struct.error: pack_into expected 1 items for packing (got 0)' },
      fix:   { label: 'offset 0',  code: "import struct\nbuf = bytearray(2)\nstruct.pack_into('<H', buf, 0, 513)\nbuf", output: "bytearray(b'\\x01\\x02')" },
    },
    {
      name: 'Assuming a failed call left the buffer alone',
      desc: 'The target region is zeroed and filled field by field; an error part-way leaves the earlier fields written. Validate the values first, or pack into a scratch buffer and copy it in.',
      wrong: { label: 'partial write', code: "import struct\nbuf = bytearray(b'\\xff' * 4)\ntry:\n    struct.pack_into('<HH', buf, 0, 1, 70000)\nexcept struct.error:\n    pass\nbuf", output: "bytearray(b'\\x01\\x00\\x00\\x00')" },
      fix:   { label: 'pack first',    code: "import struct\nbuf = bytearray(b'\\xff' * 4)\ntry:\n    buf[0:4] = struct.pack('<HH', 1, 70000)\nexcept struct.error:\n    pass\nbuf",          output: "bytearray(b'\\xff\\xff\\xff\\xff')" },
    },
  ],

  when: {
    use: [
      'Filling a large preallocated buffer record by record',
      'Patching fields of a header in place',
      'Writing into shared memory, mmap or a memoryview slice',
    ],
    avoid: [
      'You need a new bytes object anyway → struct.pack',
      'The buffer is bytes → it is immutable; copy it into a bytearray first',
    ],
  },

  notes: {
    cpython:    "Modules/_struct.c s_pack_into: argument count, then the writable buffer, then the offset; negative offsets are checked with 'no space to pack N bytes at offset -K' and 'offset -K out of range for N-byte buffer'",
    'Offsets':  'offset + calcsize(format) must be <= len(buffer); a negative offset is added to len(buffer) first',
    'Atomicity': "Not atomic: on error the region is already zeroed and partly written — with '>q' or '>Q' even the failing field holds the low 8 bytes of the too-large number",
    "'0p' quirk": "In 3.13 a '0p' field (a Pascal string of size 0) still writes its length byte, 0, at its offset — a byte that lies outside its own 0-byte field (3.12 writes nothing there)",
  },

  related: [
    { name: 'struct.pack',        slug: 'pack',        when: 'Return new bytes instead' },
    { name: 'struct.unpack_from', slug: 'unpack_from', when: 'The reading counterpart, also with an offset' },
    { name: 'Struct.pack_into',   slug: 'struct',      when: 'The same on a compiled Struct' },
    { name: 'bytearray',          slug: 'bytearray',   when: 'The usual writable buffer', category: 'functions' },
    { name: 'memoryview',         slug: 'memoryview',  when: 'Write into part of a larger buffer', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between struct.pack and struct.pack_into?',
      a: 'pack returns a new bytes object. pack_into writes the same bytes into an existing writable buffer at a given offset and returns None — useful for building one large buffer without concatenating many small bytes objects.',
    },
    {
      q: 'Why do I get "argument must be read-write bytes-like object, not bytes"?',
      a: 'bytes objects are immutable. Create the buffer with bytearray(size), or bytearray(existing_bytes) to copy, and pack into that.',
    },
    {
      q: 'Can pack_into use a negative offset?',
      a: "Yes. It counts from the end of the buffer, like a negative index: in an 8-byte buffer, offset -4 writes to bytes 4..7. The packed data must still fit: '<I' at offset -2 raises 'no space to pack 4 bytes at offset -2'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/struct.html#struct.pack_into',
    meta:  'struct.pack_into',
  },

};
