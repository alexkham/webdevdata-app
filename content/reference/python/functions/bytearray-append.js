// content/reference/python/functions/bytearray-append.js
//
// Demo uses a walrus expression so the RESULTING buffer is shown rather than
// the None that append actually returns.

export const meta = {
  slug:        'bytearray-append',
  name:        'bytearray.append',
  signature:   'bytearray.append(byte)',
  blurb:       'Add one byte to the end — takes an int from 0 to 255, not a bytes object.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytearray append add byte mutable buffer grow build binary int range 256',
};

export const method = {
  slug:      'bytearray-append',
  name:      'bytearray.append',
  signature: 'bytearray.append(byte)',
  returns:   { type: 'None', desc: 'Returns None — the buffer grows in place. The demo wraps the call so the resulting buffer is visible.' },

  category:    'Bytearray method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Takes a single INT, not a bytes object. That asymmetry — bytearray indexes to ints but slices to bytes — is the thing to internalise about this type.',

  cheat: {
    commonCall: 'buf.append(0x0a)',
    returns:    'None — the buffer is mutated',
    replaces:   "buf += bytes([byte]), which allocates",
    watchOut:   "append(b'a') is a TypeError; it must be an int like 97",
  },

  parameters: [
    { name: 'byte', type: 'int', required: true, default: null, desc: 'An integer from 0 to 255. Anything outside that range raises ValueError; a bytes object raises TypeError.' },
  ],

  demoParams: [
    { name: 's',    type: 'str', hint: 'starting buffer (as text)', input: 'text' },
    { name: 'byte', type: 'int', hint: 'byte value 0-255',          input: 'number' },
  ],
  demoTemplate: "[b := bytearray(bytes({s}, 'utf-8')), b.append({byte}), b][2]",
  cases: [
    { id: 'letter',  label: "append 'd' (100)", values: { s: 'abc', byte: 100 } },
    { id: 'newline', label: 'append newline',   values: { s: 'abc', byte: 10 } },
    { id: 'zero',    label: 'append NUL',       values: { s: 'abc', byte: 0 } },
    { id: 'empty',   label: 'onto empty',       values: { s: '',    byte: 97 } },
    { id: 'toobig',  label: 'out of range (!)', values: { s: 'abc', byte: 256 } },
  ],
  demoExplainer: 'The demo expression looks odd because append returns None — the walrus and the list index exist purely so you can see the resulting buffer instead. Appending 100 adds the letter d, because 100 is its ASCII code. Values outside 0 to 255 raise ValueError, since a byte cannot hold them. Note that non-printable bytes such as 10 and 0 appear as escapes in the output rather than as characters.',

  patterns: [
    {
      name: 'Build a buffer byte by byte',
      desc: 'The mutable alternative to repeatedly concatenating bytes.',
      code: 'buf = bytearray()\nfor value in values:\n    buf.append(value)',
    },
    {
      name: 'Terminate a record',
      desc: 'Adding a single delimiter byte needs no allocation.',
      code: "buf.append(0x0a)   # newline",
    },
    {
      name: 'Accumulate then freeze',
      desc: 'Build mutably, hand out something immutable.',
      code: 'return bytes(buf)',
    },
  ],

  examples: [
    { title: 'Append a letter', code: "b = bytearray(b'abc')\nb.append(100)\nb", returns: "bytearray(b'abcd')" },
    { title: 'Returns None',    code: "bytearray(b'abc').append(100)", returns: 'None' },
    { title: 'Onto empty',      code: 'b = bytearray()\nb.append(97)\nb', returns: "bytearray(b'a')" },
    { title: 'Out of range',    code: "bytearray(b'abc').append(256)", returns: 'ValueError: byte must be in range(0, 256)' },
    { title: 'bytes rejected',  code: "bytearray(b'abc').append(b'd')", returns: 'TypeError' },
    { title: 'Use ord for a char', code: "b.append(ord('d'))", returns: 'appends 100' },
  ],

  pitfalls: [
    {
      name: 'It takes an int, not a bytes object',
      desc: 'The most common bytearray mistake. append adds ONE byte, so it wants that byte as a number — passing b\'d\' is a TypeError even though it is exactly one byte long.',
      wrong: { label: 'bytes rejected', code: "buf.append(b'd')", output: "TypeError: 'bytes' object cannot be interpreted as an integer" },
      fix:   { label: 'Pass the value', code: "buf.append(ord('d'))   # or 100", output: 'appends d' },
    },
    {
      name: 'Values must fit in a byte',
      desc: 'Anything outside 0 to 255 raises ValueError. Arithmetic that overflows — adding to a byte value without masking — fails here rather than wrapping.',
      wrong: { label: 'Out of range', code: 'buf.append(300)', output: 'ValueError: byte must be in range(0, 256)' },
      fix:   { label: 'Mask it',      code: 'buf.append(300 & 0xFF)', output: 'appends 44' },
    },
    {
      name: 'Appending several at once needs extend',
      desc: 'append handles exactly one byte. Passing an iterable is a TypeError, and looping when extend would do is slower and noisier.',
      wrong: { label: 'Iterable rejected', code: 'buf.append([1, 2])', output: 'TypeError' },
      fix:   { label: 'Use extend',        code: 'buf.extend([1, 2])', output: 'both added' },
    },
    {
      name: 'It returns None',
      desc: 'Like every in-place mutator, assigning the result replaces your buffer with None. The same family of bug as list.sort and list.append.',
      wrong: { label: 'Buffer becomes None', code: 'buf = buf.append(100)', output: 'None' },
      fix:   { label: 'Just call it',       code: 'buf.append(100)', output: 'buf is updated' },
    },
  ],

  when: {
    use: [
      'Building a binary buffer incrementally',
      'Adding a single delimiter or terminator byte',
      'Any loop where bytes concatenation would copy repeatedly',
    ],
    avoid: [
      'Adding several bytes → extend',
      'Adding at a position → insert',
      'The buffer never changes → build bytes directly',
    ],
  },

  notes: {
    complexity: 'O(1) amortised — the buffer over-allocates and occasionally reallocates',
    return:     'None; the bytearray is mutated in place and keeps its identity',
    cpython:    'Objects/bytearrayobject.c :: bytearray_append',
    memory:     'Grows the internal buffer geometrically, so repeated appends are cheap',
    threadSafe: 'Not safe under concurrent mutation of the same buffer',
  },

  related: [
    { name: 'bytearray.extend', slug: 'bytearray-extend', when: 'Add several bytes at once' },
    { name: 'bytearray.insert', slug: 'bytearray-insert', when: 'Add at a position rather than the end' },
    { name: 'append',           slug: 'append',           when: 'The list version of this idea' },
    { name: 'bytearray',        slug: 'bytearray',        when: 'Create the buffer in the first place' },
  ],

  faq: [
    {
      q: 'Why does append take a number rather than bytes?',
      a: 'Because a bytearray is a sequence of INTEGERS. Indexing one gives an int, and appending one takes an int. The confusion comes from slicing, which gives bytes back — the two operations genuinely differ.',
      code: "b = bytearray(b'abc')\nb[0]     # 97, an int\nb[0:1]   # b'a', a bytes object",
    },
    {
      q: 'How do I append a character?',
      a: 'Convert it with ord first, which gives its code point. For non-ASCII characters that is not enough — encode the character and use extend, since it will be several bytes.',
      code: "buf.append(ord('d'))\nbuf.extend('é'.encode('utf-8'))",
    },
    {
      q: 'Is appending faster than bytes concatenation?',
      a: 'Much, over many operations. Bytes are immutable, so every += copies the whole buffer, making a loop quadratic. bytearray over-allocates and appends in amortised constant time.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.append',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
