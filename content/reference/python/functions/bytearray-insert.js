// content/reference/python/functions/bytearray-insert.js

export const meta = {
  slug:        'bytearray-insert',
  name:        'bytearray.insert',
  signature:   'bytearray.insert(index, byte)',
  blurb:       'Insert one byte before a position — out-of-range indexes clamp instead of raising.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytearray insert position index byte prepend shift mutable buffer clamp binary',
};

export const method = {
  slug:      'bytearray-insert',
  name:      'bytearray.insert',
  signature: 'bytearray.insert(index, byte)',
  returns:   { type: 'None', desc: 'Returns None — the buffer is mutated. The demo wraps the call so the resulting buffer is visible.' },

  category:    'Bytearray method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Places a byte BEFORE the given position, shifting the rest right. Like list.insert, an impossible index clamps silently rather than raising.',

  cheat: {
    commonCall: 'buf.insert(0, 0x02)',
    returns:    'None — the buffer grows by one',
    replaces:   'buf[i:i] = bytes([byte])',
    watchOut:   'an out-of-range index does NOT raise — it clamps to an end',
  },

  parameters: [
    { name: 'index', type: 'int', required: true, default: null, desc: 'Position to insert BEFORE. Negative counts from the end. Out-of-range values clamp to 0 or to the length.' },
    { name: 'byte',  type: 'int', required: true, default: null, desc: 'An integer from 0 to 255. A bytes object raises TypeError.' },
  ],

  demoParams: [
    { name: 's',     type: 'str', hint: 'starting buffer (as text)', input: 'text' },
    { name: 'index', type: 'int', hint: 'position to insert before', input: 'number' },
    { name: 'byte',  type: 'int', hint: 'byte value 0-255',          input: 'number' },
  ],
  demoTemplate: "[b := bytearray(bytes({s}, 'utf-8')), b.insert({index}, {byte}), b][2]",
  cases: [
    { id: 'front',    label: 'at the front',    values: { s: 'abc', index: 0,  byte: 122 } },
    { id: 'middle',   label: 'in the middle',   values: { s: 'abc', index: 1,  byte: 122 } },
    { id: 'end',      label: 'at the length',   values: { s: 'abc', index: 3,  byte: 122 } },
    { id: 'past-end', label: 'past the end',    values: { s: 'abc', index: 99, byte: 122 } },
    { id: 'negative', label: 'negative index',  values: { s: 'abc', index: -1, byte: 122 } },
  ],
  demoExplainer: 'The byte goes BEFORE the given position, so inserting at 0 puts it first and inserting at the length puts it last. The clamping cases are the ones to note: an index of 99 on a three-byte buffer does not raise — it simply appends. A negative index counts from the end, so -1 inserts before the LAST byte rather than after it, which is a persistent off-by-one.',

  patterns: [
    {
      name: 'Prepend a framing byte',
      desc: 'Adding a length or type marker at the front of a record.',
      code: 'buf.insert(0, len(payload))',
    },
    {
      name: 'Splice into a fixed offset',
      desc: 'Useful when patching a header field in place.',
      code: 'buf.insert(HEADER_END, flag_byte)',
    },
    {
      name: 'Prefer append for the end',
      desc: 'insert at the length works but says less about intent.',
      code: 'buf.append(byte)   # clearer than insert(len(buf), byte)',
    },
  ],

  examples: [
    { title: 'At the front',  code: "b = bytearray(b'abc')\nb.insert(0, 122)\nb", returns: "bytearray(b'zabc')" },
    { title: 'In the middle', code: "b = bytearray(b'abc')\nb.insert(1, 122)\nb", returns: "bytearray(b'azbc')" },
    { title: 'Past the end clamps', code: "b = bytearray(b'abc')\nb.insert(99, 122)\nb", returns: "bytearray(b'abcz')" },
    { title: 'Negative index', code: "b = bytearray(b'abc')\nb.insert(-1, 122)\nb", returns: "bytearray(b'abzc')" },
    { title: 'Out of range value', code: "bytearray(b'abc').insert(0, 256)", returns: 'ValueError: byte must be in range(0, 256)' },
    { title: 'Returns None',  code: "bytearray(b'abc').insert(0, 122)", returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Out-of-range indexes clamp silently',
      desc: 'Unlike indexing or deleting, insert never raises IndexError. A huge index appends and a very negative one prepends, so a bad offset produces a plausible buffer instead of an error.',
      wrong: { label: 'No error', code: "b = bytearray(b'abc')\nb.insert(999, 122)\nb", output: "bytearray(b'abcz')" },
      fix:   { label: 'Validate first', code: 'if 0 <= i <= len(b):\n    b.insert(i, byte)\nelse:\n    raise IndexError(i)', output: 'explicit' },
    },
    {
      name: 'insert(-1, x) goes before the last byte',
      desc: 'People read -1 as "at the end". It means "before the final byte", so the inserted value ends up second from last.',
      wrong: { label: 'Not last', code: "b = bytearray(b'abc')\nb.insert(-1, 122)\nb", output: "bytearray(b'abzc')" },
      fix:   { label: 'Append instead', code: 'b.append(122)', output: "bytearray(b'abcz')" },
    },
    {
      name: 'It takes an int, not bytes',
      desc: 'Same rule as append — one byte means one integer. A one-byte bytes object is still a TypeError.',
      wrong: { label: 'bytes rejected', code: "buf.insert(0, b'z')", output: "TypeError: 'bytes' object cannot be interpreted as an integer" },
      fix:   { label: 'Pass the value', code: "buf.insert(0, ord('z'))", output: 'inserted' },
    },
    {
      name: 'Inserting at the front is O(n)',
      desc: 'Every following byte shifts right by one. Repeatedly prepending to a large buffer is quadratic — build in reverse and reverse once, or use a deque.',
      wrong: { label: 'Quadratic', code: 'for v in values:\n    buf.insert(0, v)', output: 'shifts everything each time' },
      fix:   { label: 'Append then reverse', code: 'for v in values:\n    buf.append(v)\nbuf.reverse()', output: 'linear' },
    },
  ],

  when: {
    use: [
      'Prepending a framing or length byte',
      'Splicing a value into a known offset',
      'Small buffers where the shift cost is irrelevant',
    ],
    avoid: [
      'Adding at the end → append says what you mean',
      'Repeated prepending on a large buffer → build reversed, or use a deque',
      'Adding several bytes → extend, or slice assignment',
    ],
  },

  notes: {
    complexity: 'O(n) — every byte from the index onward shifts right',
    return:     'None; the bytearray is mutated in place',
    cpython:    'Objects/bytearrayobject.c :: bytearray_insert',
    memory:     'May reallocate the internal buffer; the shift itself is in place',
    threadSafe: 'Not safe under concurrent mutation of the same buffer',
  },

  related: [
    { name: 'bytearray.append', slug: 'bytearray-append', when: 'Add at the end without shifting' },
    { name: 'bytearray.extend', slug: 'bytearray-extend', when: 'Add several bytes at the end' },
    { name: 'list.insert',      slug: 'list-insert',      when: 'The list version, with identical clamping rules' },
    { name: 'bytearray.remove', slug: 'bytearray-remove', when: 'Take a byte out again' },
  ],

  faq: [
    {
      q: 'Why does an out-of-range index not raise?',
      a: 'Because insert is defined to clamp, matching list.insert. It is convenient when the index comes from arithmetic that might overshoot, and a nuisance when you wanted validation — so validate explicitly if a bad index is a bug.',
      code: 'if not 0 <= i <= len(buf):\n    raise IndexError(i)',
    },
    {
      q: 'How do I insert several bytes at once?',
      a: 'Use slice assignment, which splices any bytes-like object in one operation and avoids repeated shifting.',
      code: 'buf[2:2] = b"xyz"',
    },
    {
      q: 'Is insert(len(buf), x) the same as append?',
      a: 'The result is identical, but append states the intent and skips the index arithmetic. Reach for append whenever the position is the end.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.insert',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
