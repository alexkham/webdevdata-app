// content/reference/python/functions/bytes-count.js

export const meta = {
  slug:        'bytes-count',
  name:        'bytes.count',
  signature:   'bytes.count(sub[, start[, end]])',
  blurb:       'Count non-overlapping occurrences of a byte sequence.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes count occurrences tally substring subsection binary non-overlapping bytearray bytearray.count',
};

export const method = {
  slug:      'bytes-count',
  name:      'bytes.count',
  signature: 'bytes.count(sub[, start[, end]])',
  returns:   { type: 'int', desc: 'Number of non-overlapping occurrences of sub. Returns 0 when absent, never raises.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The bytes twin of str.count. Same counting rules — including the non-overlapping one — but it counts BYTES, and it rejects a str argument outright.',

  cheat: {
    commonCall: "data.count(b'x')",
    returns:    'int — non-overlapping matches',
    replaces:   'a manual scan over the buffer',
    watchOut:   "the argument must be bytes; data.count('x') is a TypeError",
  },

  parameters: [
    { name: 'sub',   type: 'bytes | int', required: true,  default: null,  desc: 'Byte sequence to count. A plain int from 0 to 255 also works, counting that single byte value.' },
    { name: 'start', type: 'int',         required: false, default: '0',   desc: 'Byte offset to begin at.' },
    { name: 'end',   type: 'int',         required: false, default: 'len', desc: 'Byte offset to stop at, exclusive.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sub', type: 'str', hint: 'sequence to count',       input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').count(bytes({sub}, 'utf-8'))",
  cases: [
    { id: 'twice',    label: 'appears twice',   values: { s: 'abcabc', sub: 'a' } },
    { id: 'absent',   label: 'absent is 0',     values: { s: 'abc',    sub: 'z' } },
    { id: 'overlap',  label: 'no overlaps',     values: { s: 'aaa',    sub: 'aa' } },
    { id: 'empty',    label: 'empty sub',       values: { s: 'abc',    sub: '' } },
    { id: 'non-ascii',label: 'multi-byte char', values: { s: 'héllo',  sub: 'é' } },
  ],
  demoExplainer: 'Counting works exactly as it does on strings, with two byte-level twists. Matches do not overlap: "aaa" contains "aa" only once, because the scan resumes after each match rather than one position later. And the empty sequence is found at every gap, giving length plus one. The non-ascii case counts a two-byte UTF-8 sequence as a single match, because both the data and the argument were encoded the same way.',

  patterns: [
    {
      name: 'Count records in a buffer',
      desc: 'Delimiter counting without splitting, which avoids allocating the parts.',
      code: "record_count = payload.count(b'\\n')",
    },
    {
      name: 'Sanity-check a binary format',
      desc: 'Cheap validation before a real parse.',
      code: "if data.count(b'\\x00') > MAX_NULLS:\n    raise ValueError('looks corrupt')",
    },
    {
      name: 'Count a single byte value',
      desc: 'An int argument counts that byte without building a one-byte object.',
      code: 'zeros = data.count(0)',
    },
  ],

  examples: [
    { title: 'Twice',        code: "b'abcabc'.count(b'a')", returns: '2' },
    { title: 'Absent',       code: "b'abc'.count(b'z')",    returns: '0' },
    { title: 'No overlaps',  code: "b'aaa'.count(b'aa')",   returns: '1' },
    { title: 'Empty sub',    code: "b'abc'.count(b'')",     returns: '4' },
    { title: 'Int argument', code: "b'a\\x00b'.count(0)",   returns: '1' },
    { title: 'str rejected', code: "b'abc'.count('a')",     returns: "TypeError: argument should be integer or bytes-like object, not 'str'" },
  ],

  pitfalls: [
    {
      name: 'A str argument is a TypeError',
      desc: 'The single most common mistake with every bytes method. Python will not encode the argument for you, because it cannot know which codec you meant.',
      wrong: { label: 'str rejected', code: "b'abc'.count('a')", output: "TypeError: argument should be integer or bytes-like object, not 'str'" },
      fix:   { label: 'Use a bytes literal', code: "b'abc'.count(b'a')", output: '1' },
    },
    {
      name: 'Matches do not overlap',
      desc: 'After a match the scan resumes past it, so "aaa" contains "aa" once, not twice. Counting overlapping patterns needs a manual loop or a regex with a lookahead.',
      wrong: { label: 'One, not two', code: "b'aaa'.count(b'aa')", output: '1' },
      fix:   { label: 'Count overlaps', code: "sum(1 for i in range(len(d)-1) if d[i:i+2] == b'aa')", output: '2' },
    },
    {
      name: 'Counts bytes, not characters',
      desc: 'A non-ASCII character is several UTF-8 bytes. Counting inside encoded text gives byte-level answers that will not match what you see on screen.',
      wrong: { label: 'Byte length differs', code: "len('héllo'.encode())", output: '6, not 5' },
      fix:   { label: 'Decode first',        code: "'héllo'.encode().decode().count('l')", output: 'character-level' },
    },
  ],

  when: {
    use: [
      'Counting delimiters or markers in a binary buffer',
      'Cheap validation before parsing a format',
      'Counting a single byte value with an int argument',
    ],
    avoid: [
      'The data is text → decode first and count characters',
      'Overlapping matches → a manual loop or a lookahead regex',
      'You want the POSITION → find or index',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case; the same search machinery as str.count',
    return:     'A non-negative int; 0 when absent',
    cpython:    'Objects/bytesobject.c :: bytes_count',
    memory:     'No allocation — scans in place',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'str.count',    slug: 'str-count',    when: 'The same operation on text' },
    { name: 'bytes.find',   slug: 'bytes-find',   when: 'Where the first match is' },
    { name: 'bytes.index',  slug: 'bytes-index',  when: 'Position, raising when absent' },
    { name: 'bytes',        slug: 'bytes',        when: 'Build the bytes in the first place' },
  ],

  faq: [
    {
      q: 'Why can I not pass a string?',
      a: 'Because Python refuses to guess an encoding. Counting b\'é\' means counting two specific bytes, and which two depends on the codec — so you must encode the argument yourself and make that choice explicit.',
      code: "data.count('é'.encode('utf-8'))",
    },
    {
      q: 'Can I count a single byte value?',
      a: 'Yes — pass an int from 0 to 255 and it counts that byte directly. This is the neat way to count null bytes or a specific marker without constructing a one-byte object.',
      code: 'data.count(0)   # count NUL bytes',
    },
    {
      q: "Why does b'abc'.count(b'') return 4?",
      a: 'The empty sequence is considered present in every gap — before each byte and after the last. A three-byte object has four such gaps. str.count behaves identically.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.count arrived with the bytes type in the text/binary split.' },
    { version: '3.3', note: 'An int argument accepted, counting a single byte value.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.count',
    meta:  'bytes.count',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
