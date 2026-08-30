// content/reference/python/functions/bytearray.js

export const meta = {
  slug:        'bytearray',
  name:        'bytearray',
  signature:   'bytearray(source=..., encoding=..., errors=...)',
  blurb:       'The MUTABLE sibling of bytes — same reads, plus append / extend / assignment.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytearray mutable bytes buffer binary append extend modify in place assignment',
};

export const method = {
  slug:      'bytearray',
  name:      'bytearray',
  signature: 'bytearray(source=..., encoding=..., errors=...)',
  returns:   { type: 'bytearray', desc: 'A MUTABLE sequence of bytes (integers 0..255). Same three call shapes as bytes: `bytearray(int)` → n zero bytes; `bytearray(iterable_of_ints)` → those bytes; `bytearray(str, encoding)` → same as str.encode. Supports item assignment and mutation methods.' },

  category:    'Built-in function / type',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'A mutable byte buffer — for when bytes is not enough and you need append() or slice assignment.',

  cheat: {
    commonCall: 'buf = bytearray(1024)',
    returns:    'a mutable bytearray',
    replaces:   'the pattern of building a new bytes object by concatenation',
    watchOut:   'bytearray(5) is FIVE zero bytes, not b\"5\" — same trap as bytes()',
  },

  parameters: [
    { name: 'source',   type: 'int | iterable | str', required: false, default: '""', desc: 'The initial data. int: number of zero bytes. Iterable of ints: those bytes. String: requires encoding.' },
    { name: 'encoding', type: 'str', required: false, default: null, desc: 'When source is a string, the encoding to use.' },
    { name: 'errors',   type: 'str', required: false, default: '"strict"', desc: 'Error handler when encoding a string.' },
  ],

  demoParams: [
    { name: 'source',   type: 'str', hint: 'text or comma-separated ints', input: 'text' },
    { name: 'encoding', type: 'str', hint: 'utf-8 / ascii / latin-1 (for str)', input: 'text-or-none' },
  ],
  cases: [
    { id: 'string',    label: 'from string',        values: { source: 'hello',         encoding: 'utf-8' } },
    { id: 'accent',    label: 'accented string',    values: { source: 'café',          encoding: 'utf-8' } },
    { id: 'empty',     label: 'empty',              values: { source: '',              encoding: '' } },
  ],
  demoExplainer: 'bytearray has the same THREE call shapes as bytes. The demo shows the constructed value in Python\'s bytearray(b\'...\') display form. In real code the difference from bytes is what you can DO with the result: bytearray supports append(), extend(), pop(), item assignment (buf[0] = 255), and slice assignment. bytes is read-only.',

  patterns: [
    {
      name: 'Pre-allocated buffer for I/O',
      desc: 'When a low-level API wants a writable buffer.',
      code: 'buffer = bytearray(4096)\nn = sock.recv_into(buffer)',
    },
    {
      name: 'Build up incrementally',
      desc: 'append() and extend() modify in place — no repeated reallocation.',
      code: 'out = bytearray()\nfor chunk in chunks:\n    out.extend(chunk)',
    },
    {
      name: 'In-place byte manipulation',
      desc: 'Modify individual bytes without recreating the buffer.',
      code: 'buf = bytearray(data)\nfor i in range(len(buf)):\n    buf[i] ^= 0xff   # XOR each byte',
    },
    {
      name: 'Freeze to bytes when done',
      desc: 'Convert to immutable bytes at the API boundary.',
      code: 'result = bytes(mutable_buf)',
    },
  ],

  examples: [
    { title: 'From string',        code: 'bytearray("hello", "utf-8")',       returns: "bytearray(b'hello')" },
    { title: 'From int list',      code: 'bytearray([65, 66, 67])',            returns: "bytearray(b'ABC')" },
    { title: 'Zero-init buffer',   code: 'bytearray(5)',                        returns: "bytearray(b'\\x00\\x00\\x00\\x00\\x00')" },
    { title: 'Empty',              code: 'bytearray()',                         returns: "bytearray(b'')" },
    { title: 'Item assignment',    code: 'b = bytearray(b"hello")\nb[0] = 72\nb', returns: "bytearray(b'Hello')" },
    { title: 'Append',             code: 'b = bytearray()\nb.append(65)\nb',   returns: "bytearray(b'A')" },
    { title: 'Convert to bytes',   code: 'bytes(bytearray(b"hi"))',              returns: "b'hi'" },
  ],

  pitfalls: [
    {
      name: 'bytearray(5) is FIVE zero bytes — same trap as bytes()',
      desc: 'The single most common bytearray constructor surprise. Passing an int means \"that many zero bytes\", not \"the digit as a byte\".',
      wrong: { label: 'Assumed digit', code: 'bytearray(5)', output: "bytearray(b'\\x00\\x00\\x00\\x00\\x00')" },
      fix:   { label: 'For the digit', code: 'bytearray([5])   # bytearray(b\'\\x05\')\nbytearray(b"5")   # bytearray(b\'5\')', output: 'literal vs digit' },
    },
    {
      name: 'Mutations return None; slicing returns bytes',
      desc: 'Two subtle behaviors. Mutations (append, extend, sort, ...) return None — do not assign back. Slicing a bytearray returns a NEW bytearray, but slice assignment mutates in place.',
      wrong: { label: 'Assigned None', code: 'buf = buf.append(65)', output: 'buf is now None' },
      fix:   { label: 'Just mutate',    code: 'buf.append(65)', output: 'buf is the updated bytearray' },
    },
    {
      name: 'Item assignment requires an int in 0..255',
      desc: 'Setting a byte by index takes an integer. Passing a bytes-like value raises TypeError. Slice assignment DOES accept bytes-like values.',
      wrong: { label: 'Byte-like fails', code: 'b[0] = b"H"', output: "TypeError: 'bytes' object cannot be interpreted as an integer" },
      fix:   { label: 'Use int',           code: 'b[0] = 72   # ord("H")', output: "bytearray(b'H...')" },
    },
    {
      name: 'bytearray is NOT hashable',
      desc: 'Because bytearray is mutable, it cannot be a dict key or set element. Convert to bytes if you need hashability.',
      wrong: { label: 'Not hashable', code: '{bytearray(b"a"): 1}', output: "TypeError: unhashable type: 'bytearray'" },
      fix:   { label: 'Freeze first', code: '{bytes(bytearray(b"a")): 1}', output: '{b\'a\': 1}' },
    },
  ],

  when: {
    use: [
      'Pre-allocated buffers for socket / file I/O',
      'Building bytes incrementally with append / extend',
      'In-place byte manipulation (XOR, bit flips, byte-level transforms)',
      'Any use case where you would use a bytes object but need to mutate',
    ],
    avoid: [
      'Read-only data → bytes is smaller and hashable',
      'Very short bytes constants → b\"...\" literal is clearer',
      'You want the result as bytes at the end → convert with bytes(buf)',
      'You need dict / set membership → not hashable, use bytes',
    ],
  },

  notes: {
    complexity: 'O(n) construction; O(1) amortized append',
    return:     'A new bytearray object — mutable, NOT hashable',
    cpython:    'Objects/bytearrayobject.c :: bytearray_new',
    memory:     'Allocates a resizable buffer with slack for growth',
    threadSafe: 'Not safe under concurrent mutation',
  },

  related: [
    { name: 'bytes',       slug: 'bytes',       when: 'Immutable sibling — same constructor shapes' },
    { name: 'str.encode',  slug: 'str-encode',  when: 'Encoding a str to bytes' },
    { name: 'list.append', slug: 'append',      when: 'The list equivalent — bytearray has the same shape' },
  ],

  faq: [
    {
      q: 'What is the difference between bytes and bytearray?',
      a: 'bytes is IMMUTABLE and hashable — usable as a dict key or set element. bytearray is MUTABLE — supports append, extend, item and slice assignment. Both share all reading operations; bytearray adds mutation.',
    },
    {
      q: 'When should I use bytearray over bytes?',
      a: 'When you build up binary data incrementally (append, extend) or modify it in place. bytes forces you to create a new object for each change; bytearray amortizes growth.',
    },
    {
      q: 'How do I convert bytes to bytearray and back?',
      a: 'bytearray(b) converts bytes to bytearray. bytes(ba) converts bytearray to bytes. Both are cheap copies.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes and bytearray became separate types (Python 2 had only str, which behaved as bytes).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect binary data' },
  ],
};