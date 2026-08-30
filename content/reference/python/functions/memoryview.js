// content/reference/python/functions/memoryview.js

export const meta = {
  slug:        'memoryview',
  name:        'memoryview',
  signature:   'memoryview(object)',
  blurb:       'A zero-copy view over a bytes-like object — slice, index, or hand off without allocating.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 2.7+',
  searchTerms: 'memoryview buffer protocol zero copy bytes bytearray slice view mmap array',
};

export const method = {
  slug:      'memoryview',
  name:      'memoryview',
  signature: 'memoryview(object)',
  returns:   { type: 'memoryview', desc: 'A view over the underlying object\'s memory buffer. Reads and slices are ZERO-COPY — no data is duplicated. Supports the buffer protocol, so C extensions can access the same memory directly.' },

  category:    'Built-in function / type',
  version:     'Python 2.7+',
  hasLiveDemo: false,

  subtitle: 'Zero-copy view over bytes-like data. Slicing a memoryview does not allocate.',

  cheat: {
    commonCall: 'mv = memoryview(buf)',
    returns:    'a memoryview — supports slicing, indexing, iteration',
    replaces:   'slicing bytes / bytearray, which COPIES; memoryview slices are views',
    watchOut:   'the underlying buffer must support the buffer protocol (bytes, bytearray, array, mmap, numpy...)',
  },

  parameters: [
    { name: 'object', type: 'bytes-like', required: true, default: null, desc: 'An object supporting the buffer protocol: bytes, bytearray, array.array, mmap.mmap, numpy arrays, etc. str is NOT bytes-like — encode() first.' },
  ],

  demoParams: [
    { name: 'source', type: 'str', hint: 'comma-separated ints (0..255)', input: 'text' },
    { name: 'slice',  type: 'str', hint: 'slice as start:stop (empty = full)', input: 'text' },
  ],
  cases: [
    { id: 'basic',    label: 'basic view',       values: { source: '65,66,67,68,69', slice: '' } },
    { id: 'sliced',   label: 'sliced view',       values: { source: '65,66,67,68,69', slice: '1:4' } },
    { id: 'first-two',label: 'first two',         values: { source: '65,66,67,68,69', slice: ':2' } },
    { id: 'from-two', label: 'from index 2',      values: { source: '65,66,67,68,69', slice: '2:' } },
    { id: 'ascii',    label: 'ASCII bytes',       values: { source: '72,101,108,108,111', slice: '' } },
    { id: 'empty',    label: 'empty buffer',      values: { source: '',                 slice: '' } },
  ],
  demoExplainer: 'memoryview wraps a bytes-like buffer with zero copying. Reading, iterating, and slicing all operate on the ORIGINAL memory. The demo shows the view\'s .tobytes() representation and its length. In real Python, slicing a memoryview returns another memoryview — no data is duplicated. Slicing bytes / bytearray directly copies.',

  patterns: [
    {
      name: 'Avoid copies when slicing large buffers',
      desc: 'The whole point — memoryview lets you slice without allocating.',
      code: 'buf = bytearray(large_data)\nheader = memoryview(buf)[:32]   # zero-copy',
    },
    {
      name: 'Modify a bytearray through a memoryview',
      desc: 'Writes flow through to the underlying buffer.',
      code: 'buf = bytearray(b"hello")\nmv = memoryview(buf)\nmv[0] = ord("H")\nbuf   # bytearray(b"Hello")',
    },
    {
      name: 'Cast to a different unit size',
      desc: 'memoryview.cast reinterprets bytes as ints, floats, etc.',
      code: 'mv = memoryview(bytes([1, 0, 0, 0]))\nmv.cast("i")[0]   # 1  (little-endian int)',
    },
    {
      name: 'Release the view',
      desc: 'Explicit release lets the underlying buffer be resized.',
      code: 'mv = memoryview(buf)\n...\nmv.release()   # or use `with memoryview(buf) as mv:`',
    },
  ],

  examples: [
    { title: 'Basic',             code: 'mv = memoryview(b"hello")\nmv[0]',       returns: '104  # ord("h")' },
    { title: 'Slice is a view',    code: 'mv2 = mv[1:4]\ntype(mv2)',                returns: "<class 'memoryview'>" },
    { title: 'To bytes',           code: 'memoryview(b"hi").tobytes()',              returns: "b'hi'" },
    { title: 'Length',             code: 'len(memoryview(b"hello"))',                returns: '5' },
    { title: 'Iterate as ints',    code: 'list(memoryview(b"ABC"))',                 returns: '[65, 66, 67]' },
    { title: 'str rejected',       code: 'memoryview("hello")',                     returns: 'TypeError: memoryview: a bytes-like object is required, not str' },
    { title: 'Write via view',      code: 'buf = bytearray(b"abc"); memoryview(buf)[0] = 65; buf', returns: "bytearray(b'Abc')" },
  ],

  pitfalls: [
    {
      name: 'str is NOT bytes-like — encode first',
      desc: 'A common mistake for beginners coming from string slicing. memoryview needs the buffer protocol; str does not support it. Call `.encode(\"utf-8\")` first.',
      wrong: { label: 'str rejected', code: 'memoryview("hello")', output: 'TypeError: memoryview: a bytes-like object is required, not str' },
      fix:   { label: 'Encode first', code: 'memoryview("hello".encode("utf-8"))', output: 'valid view' },
    },
    {
      name: 'Writes through a memoryview mutate the underlying buffer',
      desc: 'This is what makes memoryview powerful — and dangerous if you did not expect the aliasing. `mv[0] = 65` changes the bytearray you built the view from.',
      wrong: { label: 'Surprising alias', code: 'buf = bytearray(b"abc")\nmv = memoryview(buf)\nmv[0] = 65   # buf becomes bytearray(b"Abc")', output: 'buf mutated' },
      fix:   { label: 'Copy first if needed', code: 'buf_copy = bytearray(buf)\nmv = memoryview(buf_copy)', output: 'isolated' },
    },
    {
      name: 'You cannot resize the underlying buffer while the view exists',
      desc: 'Attempting to resize a bytearray with an outstanding memoryview raises BufferError. Release the view first (or use `with`).',
      wrong: { label: 'Resize blocked', code: 'buf = bytearray(b"hi")\nmv = memoryview(buf)\nbuf.append(0)', output: 'BufferError: Existing exports of data: object cannot be re-sized' },
      fix:   { label: 'Release first',   code: 'mv.release()\nbuf.append(0)', output: 'works' },
    },
    {
      name: 'memoryview of bytes is READ-ONLY',
      desc: 'bytes is immutable. A memoryview over bytes cannot be assigned to. Only mutable sources (bytearray, array.array with writable buffer, ...) allow writes through the view.',
      wrong: { label: 'Read-only source', code: 'memoryview(b"hi")[0] = 65', output: 'TypeError: cannot modify read-only memory' },
      fix:   { label: 'Use bytearray',      code: 'memoryview(bytearray(b"hi"))[0] = 65', output: 'works' },
    },
  ],

  when: {
    use: [
      'Slicing large binary buffers without copying',
      'Handing a buffer region to a C API (via the buffer protocol)',
      'Reading fixed-format binary records via cast()',
      'Any place a bytes / bytearray slice is a bottleneck',
    ],
    avoid: [
      'Small buffers or one-off reads → bytes slice is simpler',
      'Text data → work with str',
      'You need immutable data with hashability → bytes',
      'You do not know what \"buffer protocol\" means yet — often you do not need this',
    ],
  },

  notes: {
    complexity: 'O(1) construction and slicing',
    return:     'memoryview — supports slicing, indexing, iteration, .tobytes(), .cast()',
    cpython:    'Objects/memoryobject.c :: memory_new',
    memory:     'No allocation for the underlying data — just view metadata',
    threadSafe: 'Not safe under concurrent mutation of the underlying buffer',
  },

  related: [
    { name: 'bytes',      slug: 'bytes',      when: 'Immutable underlying buffer' },
    { name: 'bytearray',  slug: 'bytearray',  when: 'Mutable underlying buffer' },
    { name: 'slice',      slug: 'slice',      when: 'The slicing type used to view sub-regions' },
  ],

  faq: [
    {
      q: 'When would I use memoryview over bytes / bytearray?',
      a: 'When copying would be expensive — large buffers where you slice or hand off sub-regions. If you are working with small data or one-off reads, plain bytes / bytearray is simpler.',
    },
    {
      q: 'What is the \"buffer protocol\"?',
      a: 'A CPython C-level interface for sharing raw memory between objects without copying. bytes, bytearray, array.array, mmap, and numpy arrays all implement it — memoryview lets Python code interact with that shared memory.',
    },
    {
      q: 'How do I get bytes back from a memoryview?',
      a: 'Call `.tobytes()`. This copies the view into a new bytes object.',
    },
  ],

  history: [
    { version: '2.7', note: 'memoryview introduced.' },
    { version: '3.3', note: '.cast() method added for reinterpreting the buffer as different unit types.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#memoryview',
    meta:  'memoryview',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect binary data' },
  ],
};