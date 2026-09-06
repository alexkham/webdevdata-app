// content/reference/python/functions/bytearray-copy.js

export const meta = {
  slug:        'bytearray-copy',
  name:        'bytearray.copy',
  signature:   'bytearray.copy()',
  blurb:       'A new, independent bytearray with the same contents.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'bytearray copy duplicate clone independent snapshot mutable buffer shallow',
};

export const method = {
  slug:      'bytearray-copy',
  name:      'bytearray.copy',
  signature: 'bytearray.copy()',
  returns:   { type: 'bytearray', desc: 'A new bytearray holding the same bytes. Fully independent — mutating either one leaves the other alone.' },

  category:    'Bytearray method',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'Genuinely independent, unlike list.copy. Because the elements are plain ints rather than objects, the shallow-copy caveat that haunts lists simply does not apply here.',

  cheat: {
    commonCall: 'snapshot = buf.copy()',
    returns:    'a new bytearray with the same bytes',
    replaces:   'bytearray(buf) and buf[:]',
    watchOut:   'assignment does NOT copy — b = a shares the same buffer',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'buffer (as text)', input: 'text' },
  ],
  demoTemplate: "bytearray(bytes({s}, 'utf-8')).copy()",
  cases: [
    { id: 'abc',      label: 'a few bytes',  values: { s: 'abc' } },
    { id: 'word',     label: 'a word',       values: { s: 'hello' } },
    { id: 'empty',    label: 'empty',        values: { s: '' } },
    { id: 'non-ascii',label: 'non-ascii',    values: { s: 'héllo' } },
  ],
  demoExplainer: 'The output looks identical to the input, because a copy holds the same bytes — the point is what the display cannot show. The result is a DIFFERENT object, so appending to one leaves the other untouched. That matters because plain assignment does not copy: b = a gives two names for one buffer, and mutating through either is visible through both.',

  patterns: [
    {
      name: 'Snapshot before mutating',
      desc: 'Keeps the original intact while you edit.',
      code: 'original = buf.copy()\nbuf.extend(patch)',
    },
    {
      name: 'Hand out a private buffer',
      desc: 'Callers can mutate their copy without touching your state.',
      code: 'def get_buffer(self):\n    return self._buf.copy()',
    },
    {
      name: 'Copy before a destructive parse',
      desc: 'Parsers that consume the buffer should not consume the caller\'s.',
      code: 'work = data.copy()\nwhile work:\n    frame = work.pop(0)',
    },
  ],

  examples: [
    { title: 'Same contents',    code: "bytearray(b'abc').copy()", returns: "bytearray(b'abc')" },
    { title: 'Different object', code: "a = bytearray(b'abc')\na.copy() is a", returns: 'False' },
    { title: 'Independent',      code: "a = bytearray(b'ab')\nc = a.copy()\nc.append(99)\na", returns: "bytearray(b'ab')" },
    { title: 'Assignment shares',code: "a = bytearray(b'ab')\nc = a\nc.append(99)\na", returns: "bytearray(b'abc')" },
    { title: 'Empty',            code: 'bytearray().copy()',       returns: "bytearray(b'')" },
    { title: 'Same as slicing',  code: "bytearray(b'abc')[:]",     returns: "bytearray(b'abc')" },
  ],

  pitfalls: [
    {
      name: 'Assignment does not copy',
      desc: 'The mistake copy exists to prevent. b = a gives a second name for the same buffer, so mutating through either is visible through both — and the bug usually surfaces far from the assignment.',
      wrong: { label: 'Shared buffer', code: "a = bytearray(b'ab')\nc = a\nc.append(99)\na", output: "bytearray(b'abc')" },
      fix:   { label: 'Copy explicitly', code: "c = a.copy()\nc.append(99)\na", output: "bytearray(b'ab')" },
    },
    {
      name: 'A copy of a bytearray is still mutable',
      desc: 'copy does not freeze anything. Handing one out still lets the caller change it — if you want a genuinely read-only snapshot, convert to bytes.',
      wrong: { label: 'Still writable', code: 'snap = buf.copy()\nsnap[0] = 99', output: 'succeeds' },
      fix:   { label: 'Freeze it',      code: 'snap = bytes(buf)\nsnap[0] = 99', output: 'TypeError' },
    },
    {
      name: 'Python 3.3 and newer only',
      desc: 'copy arrived after the type itself. Older code uses bytearray(buf) or buf[:], both of which still work and are equally correct.',
      wrong: { label: 'Fails on 3.2', code: 'buf.copy()', output: "AttributeError: 'bytearray' object has no attribute 'copy'" },
      fix:   { label: 'Portable form', code: 'bytearray(buf)', output: 'a copy, on any version' },
    },
  ],

  when: {
    use: [
      'Snapshotting a buffer before mutating it',
      'Returning an internal buffer callers may safely modify',
      'Feeding a destructive parser without consuming the original',
    ],
    avoid: [
      'You want an immutable snapshot → bytes(buf)',
      'Nothing will mutate either side → sharing is cheaper',
      'A zero-copy read-only view is enough → memoryview(buf).toreadonly()',
    ],
  },

  notes: {
    complexity: 'O(n) — the bytes are copied',
    return:     'A new bytearray; always a distinct object, even when empty',
    cpython:    'Objects/bytearrayobject.c :: bytearray_copy',
    memory:     'Allocates a second buffer the same size as the first',
    threadSafe: 'The copy itself is safe; a concurrently mutated source gives a torn snapshot',
  },

  related: [
    { name: 'list.copy',              slug: 'list-copy',              when: 'The list version, where shallowness DOES matter' },
    { name: 'bytes',                  slug: 'bytes',                  when: 'An immutable snapshot instead of a mutable copy' },
    { name: 'bytearray',              slug: 'bytearray',              when: 'bytearray(buf) does the same thing' },
    { name: 'memoryview.toreadonly',  slug: 'memoryview-toreadonly',  when: 'Share without copying and without write access' },
  ],

  faq: [
    {
      q: 'Is this a shallow copy?',
      a: 'Technically yes, but it makes no difference. A bytearray holds plain integers rather than references to objects, so there is no inner structure to share — the copy is fully independent in practice.',
      code: 'a = bytearray(b"ab")\nc = a.copy()\nc.append(99)\na   # unchanged',
    },
    {
      q: 'copy(), bytearray(buf) or buf[:]?',
      a: 'All three produce an independent copy. copy() states the intent most clearly, bytearray(buf) works on every version, and buf[:] is the oldest idiom. Pick on readability.',
    },
    {
      q: 'How do I get a snapshot nobody can modify?',
      a: 'Convert to bytes. That gives an immutable object, so callers cannot change it — at the cost of a copy. For a read-only window with no copy at all, use memoryview(buf).toreadonly().',
      code: 'snapshot = bytes(buf)',
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
    { version: '3.3', note: 'copy and clear added, matching the list interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.copy',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
