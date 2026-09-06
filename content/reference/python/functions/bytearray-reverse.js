// content/reference/python/functions/bytearray-reverse.js

export const meta = {
  slug:        'bytearray-reverse',
  name:        'bytearray.reverse',
  signature:   'bytearray.reverse()',
  blurb:       'Reverse the bytes in place — which destroys any multi-byte characters.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytearray reverse in place flip order endian mutable buffer binary utf-8',
};

export const method = {
  slug:      'bytearray-reverse',
  name:      'bytearray.reverse',
  signature: 'bytearray.reverse()',
  returns:   { type: 'None', desc: 'Returns None — the buffer is reversed in place. The demo wraps the call so the result is visible.' },

  category:    'Bytearray method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Reverses BYTES, not characters. On UTF-8 encoded text that produces an invalid sequence, which is the single most important thing to know about it.',

  cheat: {
    commonCall: 'buf.reverse()',
    returns:    'None — the buffer is reversed in place',
    replaces:   'buf[:] = buf[::-1], which allocates a copy first',
    watchOut:   'reversing encoded text corrupts every multi-byte character',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'buffer (as text)', input: 'text' },
  ],
  demoTemplate: "[b := bytearray(bytes({s}, 'utf-8')), b.reverse(), b][2]",
  cases: [
    { id: 'abc',      label: 'plain ascii',    values: { s: 'abc' } },
    { id: 'word',     label: 'a word',         values: { s: 'hello' } },
    { id: 'palindrome', label: 'palindrome',   values: { s: 'aba' } },
    { id: 'empty',    label: 'empty',          values: { s: '' } },
    { id: 'non-ascii',label: 'non-ascii (!)',  values: { s: 'héllo' } },
  ],
  demoExplainer: 'For ASCII the result is what you would expect — abc becomes cba. The last case is the warning. "héllo" is encoded as six UTF-8 bytes, and reversing them puts the two bytes of the accented character in the wrong order, producing a sequence that is no longer valid UTF-8 and will raise on decode. Byte reversal and text reversal are different operations.',

  patterns: [
    {
      name: 'Flip byte order in place',
      desc: 'Converting between endiannesses for a fixed-width field.',
      code: 'field = bytearray(raw)\nfield.reverse()',
    },
    {
      name: 'Reverse without allocating',
      desc: 'The in-place form avoids the copy that slicing makes.',
      code: 'buf.reverse()   # not buf = buf[::-1]',
    },
    {
      name: 'Build backwards, then flip',
      desc: 'Appending and reversing once beats repeatedly inserting at the front.',
      code: 'for v in values:\n    buf.append(v)\nbuf.reverse()',
    },
  ],

  examples: [
    { title: 'ASCII',        code: "b = bytearray(b'abc')\nb.reverse()\nb", returns: "bytearray(b'cba')" },
    { title: 'Returns None', code: "bytearray(b'abc').reverse()", returns: 'None' },
    { title: 'Palindrome',   code: "b = bytearray(b'aba')\nb.reverse()\nb", returns: "bytearray(b'aba')" },
    { title: 'Empty',        code: 'b = bytearray()\nb.reverse()\nb', returns: "bytearray(b'')" },
    { title: 'Breaks UTF-8', code: "b = bytearray('é'.encode())\nb.reverse()\nbytes(b).decode()", returns: 'UnicodeDecodeError' },
    { title: 'Text reversal differs', code: "'héllo'[::-1]", returns: "'olléh'" },
  ],

  pitfalls: [
    {
      name: 'It corrupts UTF-8 text',
      desc: 'Multi-byte characters have an ordered lead byte and continuation bytes. Reversing puts them backwards, so the result is not valid UTF-8 and fails on decode — often far from where the reversal happened.',
      wrong: { label: 'Invalid sequence', code: "b = bytearray('é'.encode())\nb.reverse()\nbytes(b).decode()", output: 'UnicodeDecodeError' },
      fix:   { label: 'Reverse the text', code: "'héllo'[::-1].encode()", output: 'valid, and correct' },
    },
    {
      name: 'It returns None',
      desc: 'The same trap as every in-place mutator. Assigning the result leaves you holding None instead of a buffer.',
      wrong: { label: 'Buffer lost', code: 'buf = buf.reverse()', output: 'None' },
      fix:   { label: 'Just call it', code: 'buf.reverse()', output: 'buf is reversed' },
    },
    {
      name: 'Not the same as slicing',
      desc: 'buf[::-1] returns a NEW reversed bytearray and leaves the original alone; reverse mutates and returns nothing. Swapping one for the other changes both the result and who sees it.',
      wrong: { label: 'Original untouched', code: 'b = bytearray(b"abc")\nb[::-1]\nb', output: "bytearray(b'abc')" },
      fix:   { label: 'Mutate in place',    code: 'b.reverse()', output: "bytearray(b'cba')" },
    },
    {
      name: 'Endianness needs a fixed width',
      desc: 'Reversing a whole buffer only flips byte order correctly when it holds exactly one value. On a buffer of several fields it reverses the fields as well, scrambling the layout.',
      wrong: { label: 'Whole buffer flipped', code: 'buf.reverse()   # buffer holds 3 fields', output: 'field order reversed too' },
      fix:   { label: 'Per field',           code: "import struct\nstruct.unpack('>3H', data)", output: 'explicit endianness' },
    },
  ],

  when: {
    use: [
      'Flipping byte order within a single fixed-width value',
      'Reversing a buffer without allocating a copy',
      'Building a sequence backwards and correcting it once at the end',
    ],
    avoid: [
      'Encoded text → reverse the str, then encode',
      'Multi-field binary layouts → struct with explicit endianness',
      'You need the original kept → slice with [::-1] instead',
    ],
  },

  notes: {
    complexity: 'O(n) — swaps bytes from both ends inward',
    return:     'None; the bytearray is mutated in place and keeps its identity',
    cpython:    'Objects/bytearrayobject.c :: bytearray_reverse',
    memory:     'No allocation — unlike slicing, which copies',
    threadSafe: 'Not safe under concurrent mutation of the same buffer',
  },

  related: [
    { name: 'list.reverse',     slug: 'list-reverse',     when: 'The list version of this idea' },
    { name: 'reversed',         slug: 'reversed',         when: 'Iterate backwards without mutating' },
    { name: 'bytearray',        slug: 'bytearray',        when: 'Create the buffer in the first place' },
    { name: 'int.to_bytes',     slug: 'int-to_bytes',     when: 'Choose a byte order explicitly instead' },
  ],

  faq: [
    {
      q: 'Why does reversing break my text?',
      a: 'Because UTF-8 encodes non-ASCII characters as several ordered bytes. Reversing the byte sequence reverses those too, producing continuation bytes before their lead byte — which is not valid UTF-8. Reverse the string, then encode.',
      code: "'héllo'[::-1].encode('utf-8')",
    },
    {
      q: 'Should I use reverse() or [::-1]?',
      a: 'reverse() when you want the existing buffer changed and no copy made — everyone holding it sees the new order. [::-1] when you want a new reversed object and the original left alone.',
    },
    {
      q: 'Is this how I swap endianness?',
      a: 'Only for a buffer holding exactly one multi-byte value. For anything structured, use int.from_bytes with an explicit byteorder, or struct with a > or < prefix — both state the intent and survive a layout change.',
      code: "int.from_bytes(data, 'little')",
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.reverse',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
