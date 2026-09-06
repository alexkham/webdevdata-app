// content/reference/python/functions/bytearray-remove.js

export const meta = {
  slug:        'bytearray-remove',
  name:        'bytearray.remove',
  signature:   'bytearray.remove(byte)',
  blurb:       'Delete the FIRST occurrence of a byte value — by value, not by position.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytearray remove delete byte value first occurrence valueerror mutable buffer',
};

export const method = {
  slug:      'bytearray-remove',
  name:      'bytearray.remove',
  signature: 'bytearray.remove(byte)',
  returns:   { type: 'None', desc: 'Returns None — the buffer shrinks in place. Raises ValueError if the byte is not present.' },

  category:    'Bytearray method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Removes by VALUE, and only the first match. The value-versus-position distinction is the one that catches people, since pop takes a position and looks similar.',

  cheat: {
    commonCall: 'buf.remove(0x00)',
    returns:    'None — one byte is deleted',
    replaces:   'del buf[buf.index(byte)]',
    watchOut:   'removes only the FIRST match, and raises when absent',
  },

  parameters: [
    { name: 'byte', type: 'int', required: true, default: null, desc: 'The byte VALUE to remove, as an integer from 0 to 255. Not a position.' },
  ],

  demoParams: [
    { name: 's',    type: 'str', hint: 'buffer (as text)',   input: 'text' },
    { name: 'byte', type: 'int', hint: 'byte value to remove', input: 'number' },
  ],
  demoTemplate: "[b := bytearray(bytes({s}, 'utf-8')), b.remove({byte}), b][2]",
  cases: [
    { id: 'middle',  label: "remove 'b' (98)",  values: { s: 'abc',    byte: 98 } },
    { id: 'first',   label: 'first of two',     values: { s: 'abcabc', byte: 97 } },
    { id: 'front',   label: 'at the front',     values: { s: 'abc',    byte: 97 } },
    { id: 'missing', label: 'absent raises',    values: { s: 'abc',    byte: 122 } },
    { id: 'nul',     label: 'remove a NUL',     values: { s: 'abc',    byte: 0 } },
  ],
  demoExplainer: 'The argument is a byte VALUE, so 98 removes the letter b. With duplicates only the FIRST is removed — the second case leaves the later a in place. A value that is not present raises ValueError rather than doing nothing, which is why the last two cases fail: neither 122 nor 0 appears in "abc".',

  patterns: [
    {
      name: 'Strip a specific byte once',
      desc: 'When exactly one occurrence is expected.',
      code: 'buf.remove(0x00)',
    },
    {
      name: 'Remove safely',
      desc: 'The membership test avoids the exception.',
      code: 'if byte in buf:\n    buf.remove(byte)',
    },
    {
      name: 'Remove every occurrence',
      desc: 'remove handles one at a time; a loop or a filter handles all.',
      code: 'while byte in buf:\n    buf.remove(byte)',
    },
  ],

  examples: [
    { title: 'By value',      code: "b = bytearray(b'abc')\nb.remove(98)\nb", returns: "bytearray(b'ac')" },
    { title: 'First of two',  code: "b = bytearray(b'abcabc')\nb.remove(97)\nb", returns: "bytearray(b'bcabc')" },
    { title: 'Absent raises', code: "bytearray(b'abc').remove(122)", returns: 'ValueError: value not found in bytearray' },
    { title: 'Returns None',  code: "bytearray(b'abc').remove(97)", returns: 'None' },
    { title: 'Not a position',code: "b = bytearray(b'abc')\nb.remove(0)", returns: 'ValueError — no NUL byte present' },
    { title: 'Use ord',       code: "buf.remove(ord('b'))", returns: 'removes b' },
  ],

  pitfalls: [
    {
      name: 'It takes a value, not an index',
      desc: 'remove(0) deletes the byte whose VALUE is zero, not the byte at position zero. Confusing it with pop is easy and the failure is loud but baffling — a ValueError on a buffer that obviously has a first byte.',
      wrong: { label: 'Read as a position', code: "bytearray(b'abc').remove(0)", output: 'ValueError: value not found in bytearray' },
      fix:   { label: 'pop takes positions', code: "bytearray(b'abc').pop(0)", output: '97' },
    },
    {
      name: 'Only the first match goes',
      desc: 'Duplicates survive. Code assuming remove clears every occurrence leaves the rest behind silently.',
      wrong: { label: 'Others remain', code: "b = bytearray(b'aaa')\nb.remove(97)\nb", output: "bytearray(b'aa')" },
      fix:   { label: 'Loop or filter', code: 'while 97 in b:\n    b.remove(97)', output: "bytearray(b'')" },
    },
    {
      name: 'Absence raises rather than being ignored',
      desc: 'There is no quiet no-op. Removing an optional byte needs a membership test or a try block.',
      wrong: { label: 'Uncaught', code: 'buf.remove(byte)', output: 'ValueError: value not found in bytearray' },
      fix:   { label: 'Test first', code: 'if byte in buf:\n    buf.remove(byte)', output: 'safe' },
    },
    {
      name: 'Removing while iterating skips bytes',
      desc: 'Mutating a buffer during a loop over it shifts the remaining bytes under the iterator, so some are silently never visited.',
      wrong: { label: 'Skips entries', code: 'for v in buf:\n    if v == 0:\n        buf.remove(v)', output: 'misses some zeros' },
      fix:   { label: 'Rebuild instead', code: 'buf = bytearray(v for v in buf if v != 0)', output: 'all removed' },
    },
  ],

  when: {
    use: [
      'Deleting a single known byte value',
      'Stripping one marker where exactly one is expected',
      'Small buffers where the shift cost does not matter',
    ],
    avoid: [
      'Removing by position → pop or del',
      'Removing every occurrence → rebuild with a comprehension',
      'Large buffers → rebuilding once beats repeated shifting',
    ],
  },

  notes: {
    complexity: 'O(n) — a scan to find the byte, then a shift to close the gap',
    return:     'None; the bytearray is mutated in place',
    cpython:    'Objects/bytearrayobject.c :: bytearray_remove',
    memory:     'No allocation; the internal buffer may shrink',
    threadSafe: 'Not safe under concurrent mutation of the same buffer',
  },

  related: [
    { name: 'bytearray.pop',    slug: 'bytearray-pop',    when: 'Remove by POSITION and get the byte back' },
    { name: 'bytearray.clear',  slug: 'bytearray-clear',  when: 'Remove everything at once' },
    { name: 'list.remove',      slug: 'list-remove',      when: 'The list version of this idea' },
    { name: 'bytes.replace',    slug: 'bytes-replace',    when: 'Remove every occurrence, immutably' },
  ],

  faq: [
    {
      q: 'How do I remove every occurrence?',
      a: 'remove deletes one match per call. Loop while the value is still present, or rebuild the buffer with a comprehension — the rebuild is a single pass and far better on large data.',
      code: 'buf = bytearray(v for v in buf if v != target)',
    },
    {
      q: 'Why does remove(0) raise on a non-empty buffer?',
      a: 'Because it looks for the byte VALUE zero, the NUL byte, not the byte at index zero. If the buffer holds no NUL, that is a genuine ValueError. pop(0) is the position-based method.',
      code: 'buf.pop(0)   # by position',
    },
    {
      q: 'Is there a version that does not raise?',
      a: 'Not built in. Guard with a membership test, or wrap in try/except ValueError. The membership test costs a second scan but reads better in most code.',
      code: 'if byte in buf:\n    buf.remove(byte)',
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.remove',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
