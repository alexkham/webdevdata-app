// content/reference/python/functions/memoryview-cast.js
//
// Doc-only page: cast returns a memoryview whose repr is a memory ADDRESS
// that changes every run, and reinterpreting bytes as wider integers is
// endian-dependent — neither can be demonstrated honestly.

export const meta = {
  slug:        'memoryview-cast',
  name:        'memoryview.cast',
  signature:   'memoryview.cast(format[, shape])',
  blurb:       'Reinterpret the same bytes as a different element type — without copying.',
  category:    'memoryview',
  type:        'memoryview',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'memoryview cast format reinterpret struct type shape reshape zero copy endian',
};

export const method = {
  slug:      'memoryview-cast',
  name:      'memoryview.cast',
  signature: 'memoryview.cast(format[, shape])',
  returns:   { type: 'memoryview', desc: 'A new view over the SAME memory, with elements reinterpreted according to the format character. No data is copied or converted.' },

  category:    'Memoryview method',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'Changes how the bytes are read, never what they are. Reading four bytes as two 16-bit integers gives different numbers on a big-endian machine — the method uses NATIVE order and offers no way to choose.',

  cheat: {
    commonCall: "view.cast('H')",
    returns:    'memoryview — same bytes, new element type',
    replaces:   'struct.unpack, when you want a live view rather than a tuple',
    watchOut:   'native byte order only; results differ across architectures',
  },

  parameters: [
    { name: 'format', type: 'str', required: true,  default: null, desc: "A single struct format character: 'B' unsigned byte, 'h'/'H' 16-bit, 'i'/'I' 32-bit, 'f' float, 'd' double, and so on." },
    { name: 'shape',  type: 'list', required: false, default: 'None', desc: 'Optional list of dimensions to reshape into. The total element count must match exactly.' },
  ],

  examples: [
    { title: 'Bytes as 16-bit ints', code: "memoryview(b'abcd').cast('H').tolist()", returns: '[25185, 25699]  # little-endian' },
    { title: 'Back to bytes',        code: "view.cast('H').cast('B').tobytes()",     returns: "b'abcd'" },
    { title: 'Element size changes', code: "memoryview(b'abcd').cast('H').itemsize", returns: '2' },
    { title: 'Length changes too',   code: "len(memoryview(b'abcd').cast('H'))",     returns: '2  # not 4' },
    { title: 'Reshape',              code: "memoryview(b'abcd').cast('B', [2, 2]).tolist()", returns: '[[97, 98], [99, 100]]' },
    { title: 'Bad size raises',      code: "memoryview(b'abc').cast('H')",           returns: 'TypeError: memoryview: length is not a multiple of itemsize' },
  ],

  pitfalls: [
    {
      name: 'Native byte order, with no way to override',
      desc: 'cast reads multi-byte values in the machine\'s own order. The same bytes give different integers on a little-endian and a big-endian CPU, so results are not portable across architectures.',
      wrong: { label: 'Platform dependent', code: "memoryview(b'abcd').cast('H').tolist()", output: '[25185, 25699] here; different on big-endian' },
      fix:   { label: 'Be explicit',        code: "import struct\nstruct.unpack('>2H', b'abcd')", output: '(24930, 25444) everywhere' },
    },
    {
      name: 'The byte length must divide evenly',
      desc: 'Casting three bytes to 16-bit elements cannot work, and it raises rather than truncating. Slice to a multiple of the item size first.',
      wrong: { label: 'Not a multiple', code: "memoryview(b'abc').cast('H')", output: 'TypeError: memoryview: length is not a multiple of itemsize' },
      fix:   { label: 'Trim first',     code: "memoryview(b'abc')[:2].cast('H')", output: 'one element' },
    },
    {
      name: 'len() changes meaning',
      desc: 'After casting, len is the number of ELEMENTS, not bytes. Code that assumed a byte count silently reads the wrong amount — use nbytes when you mean bytes.',
      wrong: { label: 'Elements, not bytes', code: "len(memoryview(b'abcd').cast('H'))", output: '2' },
      fix:   { label: 'Ask for bytes',       code: "memoryview(b'abcd').cast('H').nbytes", output: '4' },
    },
    {
      name: 'It only works on contiguous views',
      desc: 'A sliced view with a step is not contiguous, so casting it raises. This is the usual reason a cast that works on fresh data fails on a slice.',
      wrong: { label: 'Strided view', code: "memoryview(b'abcdefgh')[::2].cast('H')", output: 'TypeError: memoryview: casts are restricted to C-contiguous views' },
      fix:   { label: 'Copy first',   code: "memoryview(bytes(memoryview(b'abcdefgh')[::2])).cast('H')", output: 'contiguous, so castable' },
    },
  ],

  when: {
    use: [
      'Reading a binary buffer as wider numbers without copying',
      'Working with data from array, mmap or a C extension',
      'Reshaping a flat buffer into dimensions',
      'Hot paths where struct.unpack would allocate too much',
    ],
    avoid: [
      'Cross-platform binary formats → struct with an explicit endianness',
      'Non-contiguous or strided views → copy first',
      'Numeric work of any size → numpy handles this far better',
    ],
  },

  notes: {
    complexity: 'O(1) — no data is touched, only the view metadata changes',
    return:     'A new memoryview sharing the original memory',
    cpython:    'Objects/memoryobject.c :: memory_cast',
    memory:     'No copying; the new view keeps the underlying buffer alive',
    threadSafe: 'The cast itself is safe; concurrent writes to the buffer are not',
  },

  related: [
    { name: 'memoryview',         slug: 'memoryview',         when: 'Create the view in the first place' },
    { name: 'memoryview.tolist',  slug: 'memoryview-tolist',  when: 'See the reinterpreted values' },
    { name: 'memoryview.tobytes', slug: 'memoryview-tobytes', when: 'Copy back out to plain bytes' },
    { name: 'int.from_bytes',     slug: 'int-from_bytes',     when: 'One integer, with the byte order stated explicitly' },
  ],

  faq: [
    {
      q: 'Does cast convert the data?',
      a: 'No. The bytes are untouched — only the rule for grouping them into elements changes. Casting to a wider type and back always returns the original bytes exactly.',
      code: "view.cast('H').cast('B').tobytes() == view.tobytes()\n# True",
    },
    {
      q: 'How do I control byte order?',
      a: 'You cannot. cast always uses the machine\'s native order, which is why it is unsuitable for file formats and network protocols. Use struct with an explicit > or < prefix when the order matters.',
      code: "struct.unpack('>2H', b'abcd')",
    },
    {
      q: 'Why does casting a slice fail?',
      a: 'Because a stepped slice is not contiguous in memory, and cast needs elements laid out end to end. Materialise the slice into contiguous bytes first, at the cost of a copy.',
      code: 'memoryview(bytes(strided_view)).cast("H")',
    },
  ],

  history: [
    { version: '3.3', note: 'memoryview.cast added alongside broader multi-dimensional buffer support.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#memoryview.cast',
    meta:  'memoryview.cast',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
