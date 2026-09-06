// content/reference/python/functions/memoryview-tobytes.js

export const meta = {
  slug:        'memoryview-tobytes',
  name:        'memoryview.tobytes',
  signature:   'memoryview.tobytes(order=None)',
  blurb:       'Copy the view out into a real bytes object — the point where zero-copy ends.',
  category:    'memoryview',
  type:        'memoryview',
  hasLiveDemo: true,
  version:     'Python 2.7+',
  searchTerms: 'memoryview tobytes copy buffer zero copy convert bytes materialize slice',
};

export const method = {
  slug:      'memoryview-tobytes',
  name:      'memoryview.tobytes',
  signature: 'memoryview.tobytes(order=None)',
  returns:   { type: 'bytes', desc: 'A new bytes object holding a COPY of the data the view exposes. The original buffer is unchanged.' },

  category:    'Memoryview method',
  version:     'Python 2.7+',
  hasLiveDemo: true,

  subtitle: 'The deliberate exit from zero-copy. A memoryview exists to avoid copying; tobytes is you choosing to pay for one.',

  cheat: {
    commonCall: 'data = view.tobytes()',
    returns:    'bytes — an independent copy',
    replaces:   'bytes(view), which does the same thing',
    watchOut:   'it copies — calling it in a loop throws away the reason you used a view',
  },

  parameters: [
    { name: 'order', type: 'str', required: false, default: 'None', desc: "Element order for multi-dimensional views: 'C', 'F' or 'A'. Irrelevant for the one-dimensional byte views most code uses." },
  ],

  demoParams: [
    { name: 's', type: 'str', hint: 'text to view as bytes', input: 'text' },
  ],
  demoTemplate: "memoryview(bytes({s}, 'utf-8')).tobytes()",
  cases: [
    { id: 'ascii',    label: 'plain ascii',   values: { s: 'abc' } },
    { id: 'word',     label: 'a word',        values: { s: 'hello' } },
    { id: 'non-ascii',label: 'non-ascii',     values: { s: 'héllo' } },
    { id: 'empty',    label: 'empty',         values: { s: '' } },
    { id: 'digits',   label: 'digits',        values: { s: '123' } },
  ],
  demoExplainer: 'tobytes hands back the bytes the view is looking at, as an independent copy. The non-ascii case is the instructive one: the text is encoded as UTF-8 first, so the accented character occupies two bytes and shows as an escape in the result. A memoryview never reinterprets those bytes as text — it only ever exposes raw memory.',

  patterns: [
    {
      name: 'Slice without copying, then copy once',
      desc: 'The whole point — the slicing is free, and you pay only for the part you keep.',
      code: 'view = memoryview(big_buffer)\nheader = view[:16].tobytes()',
    },
    {
      name: 'Hand bytes to an API that will not take a view',
      desc: 'Some libraries insist on real bytes; this is the conversion point.',
      code: 'legacy_api(view.tobytes())',
    },
    {
      name: 'Detach from a buffer you are about to mutate',
      desc: 'A copy stays valid after the underlying array changes.',
      code: 'snapshot = memoryview(buf).tobytes()',
    },
  ],

  examples: [
    { title: 'Plain ascii',   code: "memoryview(b'abc').tobytes()",   returns: "b'abc'" },
    { title: 'A slice',       code: "memoryview(b'hello')[1:3].tobytes()", returns: "b'el'" },
    { title: 'Empty',         code: "memoryview(b'').tobytes()",      returns: "b''" },
    { title: 'Same as bytes()',code: "bytes(memoryview(b'abc'))",     returns: "b'abc'" },
    { title: 'It is a copy',  code: "v = memoryview(bytearray(b'ab'))\nd = v.tobytes()\nv[0] = 99\nd", returns: "b'ab'  # unchanged" },
    { title: 'Non-ascii',     code: "memoryview('é'.encode()).tobytes()", returns: "b'\\xc3\\xa9'" },
  ],

  pitfalls: [
    {
      name: 'It copies — that is the cost you were avoiding',
      desc: 'memoryview exists so large buffers can be sliced without duplication. Calling tobytes inside a loop reintroduces exactly the copying the view was there to prevent.',
      wrong: { label: 'Copies every chunk', code: 'for i in range(0, len(v), 1024):\n    process(v[i:i+1024].tobytes())', output: 'one allocation per chunk' },
      fix:   { label: 'Pass the view',      code: 'for i in range(0, len(v), 1024):\n    process(v[i:i+1024])', output: 'no copying' },
    },
    {
      name: 'The copy stops tracking the buffer',
      desc: 'A view reflects later changes to the underlying data; the bytes it produces do not. That is usually what you want, but it surprises anyone expecting a live window.',
      wrong: { label: 'Frozen snapshot', code: "buf = bytearray(b'ab')\nd = memoryview(buf).tobytes()\nbuf[0] = 99\nd", output: "b'ab'  # stale" },
      fix:   { label: 'Keep the view',   code: 'v = memoryview(buf)\nbuf[0] = 99\nv.tobytes()', output: "b'cb'  # current" },
    },
    {
      name: 'Bytes are not text',
      desc: 'tobytes gives raw bytes, never a str. Non-ASCII characters appear as multi-byte escapes, and turning them back into text needs an explicit decode with the right encoding.',
      wrong: { label: 'Not a string', code: "memoryview('é'.encode()).tobytes()", output: "b'\\xc3\\xa9'" },
      fix:   { label: 'Decode it',    code: "memoryview('é'.encode()).tobytes().decode('utf-8')", output: "'é'" },
    },
  ],

  when: {
    use: [
      'Extracting a small piece of a large buffer, once',
      'Passing data to an API that will not accept a buffer protocol object',
      'Snapshotting bytes before the underlying buffer changes',
    ],
    avoid: [
      'Inside a hot loop over chunks — pass the view itself',
      'You only need to read a few bytes → index the view directly',
      'You want text → decode after converting, with an explicit encoding',
    ],
  },

  notes: {
    complexity: 'O(n) — a full copy of the exposed region',
    return:     'A new bytes object, independent of the source buffer',
    cpython:    'Objects/memoryobject.c :: memory_tobytes',
    memory:     'Allocates a buffer the size of the view',
    threadSafe: 'The copy is atomic enough, but a concurrently mutated source gives a torn result',
  },

  related: [
    { name: 'memoryview.tolist', slug: 'memoryview-tolist', when: 'The same data as a list of ints' },
    { name: 'memoryview.hex',    slug: 'memoryview-hex',    when: 'The same data as a hex string' },
    { name: 'bytes',             slug: 'bytes',             when: 'bytes(view) does exactly this' },
    { name: 'memoryview',        slug: 'memoryview',        when: 'Create the view in the first place' },
  ],

  faq: [
    {
      q: 'Is tobytes() different from bytes(view)?',
      a: 'No — they produce the same copy. tobytes is more explicit about what is happening, and it accepts the order argument for multi-dimensional views, which the bytes constructor does not.',
      code: "bytes(memoryview(b'abc')) == memoryview(b'abc').tobytes()\n# True",
    },
    {
      q: 'Does it copy the whole buffer or just the view?',
      a: 'Only the region the view exposes. If you sliced the view first, you copy just that slice — which is exactly the pattern that makes memoryview worth using on large data.',
      code: "memoryview(b'hello')[1:3].tobytes()\n# b'el'",
    },
    {
      q: 'What is the order argument for?',
      a: 'Multi-dimensional buffers, such as those from NumPy, can be laid out row-major (C) or column-major (F). The argument chooses how to flatten them. For the one-dimensional byte views most code deals with it makes no difference.',
    },
  ],

  history: [
    { version: '2.7', note: 'memoryview introduced with tobytes, replacing the older buffer type.' },
    { version: '3.8', note: 'The order argument added for multi-dimensional views.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#memoryview.tobytes',
    meta:  'memoryview.tobytes',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
