// content/reference/python/exceptions/buffererror.js

export const meta = {
  slug:        'buffererror',
  name:        'BufferError',
  signature:   'BufferError(*args)',
  blurb:       'Raised when a buffer operation cannot be performed — typically resizing a bytearray, BytesIO or array while a memoryview of it is still alive.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'buffererror buffer error existing exports of data object cannot be re-sized memoryview bytearray bytesio getbuffer array exporting buffers release',
};

export const method = {
  slug:      'buffererror',
  name:      'BufferError',
  signature: 'BufferError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'A memoryview points straight at an object\'s memory, so while one exists the object may change its bytes but not its length.',

  chain: ['BaseException', 'Exception', 'BufferError'],

  cheat: {
    raisedBy: 'append/extend/pop/clear/resizing slice on a bytearray with a live memoryview; BytesIO.write after getbuffer()',
    message:  'Existing exports of data: object cannot be re-sized',
    quickFix: 'view.release() or with memoryview(buf) as view:',
    watchOut: 'slices of a memoryview are exports too',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message. Built-in types pass one string describing what could not be done.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Replace the first byte while a memoryview is alive. Same length is fine; any other length is a resize.',
      params: [{ name: 'new', type: 'str', hint: 'encoded to UTF-8', input: 'text' }],
      template: "buf = bytearray(b'abc')\nview = memoryview(buf)\nbuf[0:1] = {$new}.encode()\nbytes(buf)",
      cases: [
        { id: 'same',  label: 'one byte',       values: { new: 'X' } },
        { id: 'grow',  label: 'longer',         values: { new: 'XYZ' } },
        { id: 'shrink', label: 'empty',         values: { new: '' } },
        { id: 'utf8',  label: 'non-ASCII char', values: { new: 'é' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Release the view first. The with block calls view.release() on exit, so the resize is allowed afterwards.',
      params: [{ name: 'new', type: 'str', hint: 'encoded to UTF-8', input: 'text' }],
      template: "buf = bytearray(b'abc')\nwith memoryview(buf) as view:\n    first = view[0]\nbuf[0:1] = {$new}.encode()\nbytes(buf)",
      cases: [
        { id: 'grow', label: 'longer',         values: { new: 'XYZ' } },
        { id: 'utf8', label: 'non-ASCII char', values: { new: 'é' } },
      ],
    },
  ],
  demoExplainer: "'X' works because it is exactly one byte and the length stays 3. 'é' looks like one character but .encode() makes it two bytes, so it is a resize and fails like 'XYZ' and ''. In Handle, the view is already released when the assignment runs, and every input succeeds.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The message tuple, e.g. (\'Existing exports of data: object cannot be re-sized\',).' },
  ],

  patterns: [
    {
      name: 'Scope the view with with',
      desc: 'memoryview is a context manager; leaving the block releases the export deterministically.',
      code: "with memoryview(buf) as view:\n    header = bytes(view[:4])\nbuf.extend(more)",
    },
    {
      name: 'Release explicitly',
      desc: 'When the view must outlive a block, release it before the next resize.',
      code: "view = memoryview(buf)\nprocess(view)\nview.release()\nbuf.clear()",
    },
    {
      name: 'BytesIO.getbuffer() the same way',
      desc: 'getbuffer() returns a memoryview over the BytesIO; writes and close() fail while it lives.',
      code: "stream = io.BytesIO()\nwith stream.getbuffer() as view:\n    checksum = zlib.crc32(view)\nstream.write(b'more')",
    },
  ],

  examples: [
    { title: 'append() with a live view',   code: "buf = bytearray(b'abc')\nview = memoryview(buf)\nbuf.append(100)", returns: 'BufferError: Existing exports of data: object cannot be re-sized' },
    { title: 'In-place change is allowed',  code: "buf = bytearray(b'abc')\nview = memoryview(buf)\nview[0] = 88\nbuf", returns: "bytearray(b'Xbc')" },
    { title: 'A view slice is an export too', code: "buf = bytearray(b'abc')\ntail = memoryview(buf)[1:]\nbuf.clear()", returns: 'BufferError: Existing exports of data: object cannot be re-sized' },
    { title: 'release() lifts the lock',    code: "buf = bytearray(b'abc')\nview = memoryview(buf)\nview.release()\nbuf.append(100)\nbuf", returns: "bytearray(b'abcd')" },
    { title: 'BytesIO after getbuffer()',   code: "import io\nstream = io.BytesIO(b'abc')\nview = stream.getbuffer()\nstream.write(b'x')", returns: 'BufferError: Existing exports of data: object cannot be re-sized' },
    { title: 'array.array has its own message', code: "from array import array\na = array('i', [1])\nview = memoryview(a)\na.append(2)", returns: 'BufferError: cannot resize an array that is exporting buffers' },
    { title: 'A released view cannot be used', code: "buf = bytearray(b'abc')\nview = memoryview(buf)\nview.release()\nview[0]", returns: 'ValueError: operation forbidden on released memoryview object' },
  ],

  pitfalls: [
    {
      name: 'A forgotten view blocks the buffer',
      desc: 'Keeping a memoryview in a variable "for later" keeps the bytearray locked at its size. Scope it.',
      wrong: { label: 'View left alive', code: "buf = bytearray(b'hdr')\nview = memoryview(buf)\nheader = bytes(view[:3])\nbuf.extend(b'body')", output: 'BufferError: Existing exports of data: object cannot be re-sized' },
      fix:   { label: 'with block', code: "buf = bytearray(b'hdr')\nwith memoryview(buf) as view:\n    header = bytes(view[:3])\nbuf.extend(b'body')\nbuf", output: "bytearray(b'hdrbody')" },
    },
    {
      name: 'close() on BytesIO with getbuffer() alive',
      desc: 'Closing frees the buffer, which counts as a resize — it fails the same way as write().',
      wrong: { label: 'close() first', code: "import io\nstream = io.BytesIO(b'data')\nview = stream.getbuffer()\nstream.close()", output: 'BufferError: Existing exports of data: object cannot be re-sized' },
      fix:   { label: 'Release, then close', code: "import io\nstream = io.BytesIO(b'data')\nview = stream.getbuffer()\nsize = len(view)\nview.release()\nstream.close()\nsize", output: '4' },
    },
  ],

  when: {
    use: [
      'Raising it from your own C extension or buffer-exporting type when a buffer request cannot be met',
      'Recognising "a memoryview is still alive somewhere" in a traceback',
    ],
    avoid: [
      'Holding memoryviews longer than needed',
      'Assuming del view always frees the export — another name, a slice, or a traceback frame may still hold it; release() is explicit',
    ],
  },

  notes: {
    cpython:    'Objects/bytearrayobject.c — resizing checks ob_exports and refuses when it is non-zero',
    'Not affected': 'bytes objects are immutable, so they never need to refuse a resize',
    'Exporters': 'bytearray, array.array, io.BytesIO (getbuffer), mmap, NumPy arrays',
  },

  related: [
    { name: 'memoryview',         slug: 'memoryview',         when: 'What creates the export', category: 'functions' },
    { name: 'memoryview.release', slug: 'memoryview-release', when: 'Ends the export', category: 'functions' },
    { name: 'bytearray',          slug: 'bytearray',          when: 'The usual exporter', category: 'functions' },
    { name: 'bytearray.extend',   slug: 'bytearray-extend',   when: 'A resize — blocked while exported', category: 'functions' },
    { name: 'ValueError',         slug: 'valueerror',         when: 'What using a released memoryview raises' },
  ],

  faq: [
    {
      q: 'How do I fix "BufferError: Existing exports of data: object cannot be re-sized"?',
      a: 'Some memoryview (or a slice of one, or a BytesIO.getbuffer() result) still refers to the object you are resizing. Call view.release() before the append/extend/write/close, or create the view in a with memoryview(obj) as view: block so it is released automatically. In-place changes that keep the length — view[0] = 1 or buf[0:1] = b"X" — are allowed while the view exists.',
    },
    {
      q: 'Why does the bytearray refuse to grow?',
      a: 'Growing may move the data to a new memory block. A memoryview holds a raw pointer to the old block, so Python refuses any size change while an export is active rather than leave the view pointing at freed memory.',
    },
    {
      q: 'Does del view fix it?',
      a: 'In CPython it does if that was the last reference to the view, because the view is freed immediately. But slices of the view, other variables, or a saved traceback can keep it alive, and other Python implementations may free it later — view.release() or a with block is the reliable way.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#BufferError',
    meta:  'Built-in exceptions',
  },
};
