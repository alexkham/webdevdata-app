// content/reference/python/functions/bytearray-clear.js

export const meta = {
  slug:        'bytearray-clear',
  name:        'bytearray.clear',
  signature:   'bytearray.clear()',
  blurb:       'Empty the buffer in place, keeping the same object and every reference to it.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'bytearray clear empty reset truncate mutable buffer reuse in place binary',
};

export const method = {
  slug:      'bytearray-clear',
  name:      'bytearray.clear',
  signature: 'bytearray.clear()',
  returns:   { type: 'None', desc: 'Returns None — the buffer is emptied in place. The demo wraps the call so the result is visible.' },

  category:    'Bytearray method',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'Empties the existing buffer rather than making a new one. Everyone holding a reference sees it empty — which is the reason to use it, and the reason to be careful.',

  cheat: {
    commonCall: 'buf.clear()',
    returns:    'None — the buffer is emptied in place',
    replaces:   'del buf[:] and buf[:] = b""',
    watchOut:   'buf = bytearray() does NOT do the same thing',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'buffer (as text)', input: 'text' },
  ],
  demoTemplate: "[b := bytearray(bytes({s}, 'utf-8')), b.clear(), b][2]",
  cases: [
    { id: 'abc',    label: 'a few bytes',   values: { s: 'abc' } },
    { id: 'long',   label: 'longer buffer', values: { s: 'hello world' } },
    { id: 'already',label: 'already empty', values: { s: '' } },
    { id: 'binary', label: 'non-ascii',     values: { s: 'héllo' } },
  ],
  demoExplainer: 'Every case ends the same way, with an empty buffer — that is the whole method. What the output cannot show is the important part: the buffer object itself is unchanged, so any other name pointing at it now sees it empty too. Clearing an already-empty buffer is a harmless no-op.',

  patterns: [
    {
      name: 'Reuse one buffer across batches',
      desc: 'Avoids allocating a fresh buffer every round.',
      code: 'for batch in batches:\n    buf.clear()\n    buf.extend(encode(batch))',
    },
    {
      name: 'Reset a shared buffer',
      desc: 'The reason to prefer clear over rebinding — other holders observe it.',
      code: 'self._pending.clear()',
    },
    {
      name: 'Drop data after flushing',
      desc: 'Send, then empty, keeping the same object.',
      code: 'sock.sendall(buf)\nbuf.clear()',
    },
  ],

  examples: [
    { title: 'Empties it',      code: "b = bytearray(b'abc')\nb.clear()\nb", returns: "bytearray(b'')" },
    { title: 'Returns None',    code: "bytearray(b'abc').clear()", returns: 'None' },
    { title: 'Already empty',   code: 'b = bytearray()\nb.clear()\nb', returns: "bytearray(b'')" },
    { title: 'Identity kept',   code: "b = bytearray(b'a')\ni = id(b)\nb.clear()\nid(b) == i", returns: 'True' },
    { title: 'Aliases see it',  code: "a = bytearray(b'ab')\nc = a\na.clear()\nc", returns: "bytearray(b'')" },
    { title: 'Rebinding does not', code: "a = bytearray(b'ab')\nc = a\na = bytearray()\nc", returns: "bytearray(b'ab')" },
  ],

  pitfalls: [
    {
      name: 'clear() and = bytearray() are different',
      desc: 'The distinction that matters. clear empties the object everyone shares; rebinding only moves your own name and leaves other references pointing at the old, still-full buffer.',
      wrong: { label: 'Others still see data', code: "a = bytearray(b'ab')\nc = a\na = bytearray()\nc", output: "bytearray(b'ab')" },
      fix:   { label: 'Everyone sees empty',   code: "a = bytearray(b'ab')\nc = a\na.clear()\nc", output: "bytearray(b'')" },
    },
    {
      name: 'It returns None',
      desc: 'Assigning the result replaces your buffer with None — the same trap as append, extend and reverse.',
      wrong: { label: 'Buffer lost', code: 'buf = buf.clear()', output: 'None' },
      fix:   { label: 'Just call it', code: 'buf.clear()', output: 'buf is empty' },
    },
    {
      name: 'A live memoryview blocks it',
      desc: 'Clearing resizes the buffer, and an open memoryview export forbids resizing. The BufferError names the export rather than the clear, which makes it puzzling.',
      wrong: { label: 'Export blocks it', code: 'v = memoryview(buf)\nbuf.clear()', output: 'BufferError: Existing exports of data: object cannot be re-sized' },
      fix:   { label: 'Release the view', code: 'v.release()\nbuf.clear()', output: 'works' },
    },
    {
      name: 'Python 3.3 and newer only',
      desc: 'bytearray.clear arrived later than the type itself. Older code uses del buf[:], which you will still meet in the wild.',
      wrong: { label: 'Fails on 3.2', code: 'buf.clear()', output: "AttributeError: 'bytearray' object has no attribute 'clear'" },
      fix:   { label: 'Portable form', code: 'del buf[:]', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Reusing a buffer across iterations instead of reallocating',
      'Emptying a buffer other code also holds a reference to',
      'Resetting a buffer attribute without rebinding it',
    ],
    avoid: [
      'You want a fresh, independent buffer → buf = bytearray()',
      'Removing only some bytes → rebuild with a comprehension',
      'A memoryview is open on it → release the view first',
    ],
  },

  notes: {
    complexity: 'O(1) amortised — the length is set to zero',
    return:     'None; the bytearray is mutated in place and keeps its identity',
    cpython:    'Objects/bytearrayobject.c :: bytearray_clear',
    memory:     'May release the internal buffer; capacity is not guaranteed to be kept',
    threadSafe: 'Not safe under concurrent mutation of the same buffer',
  },

  related: [
    { name: 'list.clear',       slug: 'list-clear',       when: 'The list version of this idea' },
    { name: 'dict.clear',       slug: 'dict-clear',       when: 'The same operation on a dict' },
    { name: 'bytearray.pop',    slug: 'bytearray-pop',    when: 'Remove one byte rather than all' },
    { name: 'bytearray.remove', slug: 'bytearray-remove', when: 'Remove one byte by value' },
  ],

  faq: [
    {
      q: 'What is the difference between clear() and buf = bytearray()?',
      a: 'clear empties the existing object; rebinding points your name at a new one. If anything else refers to the original — an attribute, another variable, a queue — clear affects it and rebinding does not.',
      code: "a = bytearray(b'ab')\nc = a\na.clear()\nc   # bytearray(b'')",
    },
    {
      q: 'Does clearing free the memory?',
      a: 'It drops the contents, and CPython may release or shrink the internal buffer. Capacity is not guaranteed to be retained, so do not rely on clear as a way to keep an allocation warm.',
    },
    {
      q: 'How did people do this before 3.3?',
      a: 'del buf[:] was the standard idiom, and buf[:] = b"" also works. Both mutate in place exactly like clear, so treat them as equivalent when reading older code.',
      code: 'del buf[:]',
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
    { version: '3.3', note: 'clear and copy added, matching the list interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.clear',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
