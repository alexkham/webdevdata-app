// content/reference/python/functions/bytes-rstrip.js

export const meta = {
  slug:        'bytes-rstrip',
  name:        'bytes.rstrip',
  signature:   'bytes.rstrip([chars])',
  blurb:       'Trim the RIGHT end only — the usual way to drop a line ending.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes rstrip right strip trim trailing newline line ending whitespace set binary bytearray bytearray.rstrip',
};

export const method = {
  slug:      'bytes-rstrip',
  name:      'bytes.rstrip',
  signature: 'bytes.rstrip([chars])',
  returns:   { type: 'bytes', desc: 'A new bytes object with trailing bytes removed. The left end is untouched.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The other half of strip, and the one used most — dropping the newline from a line read in binary mode while keeping any leading indentation.',

  cheat: {
    commonCall: "line.rstrip(b'\\r\\n')",
    returns:    'a new bytes object with the right end trimmed',
    replaces:   'checking for and slicing off a line terminator',
    watchOut:   "rstrip(b'.txt') strips the SET of bytes, not the suffix",
  },

  parameters: [
    { name: 'chars', type: 'bytes', required: false, default: 'None', desc: 'A SET of byte values to strip from the right. Omitted or None strips ASCII whitespace.' },
  ],

  demoParams: [
    { name: 's',     type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'chars', type: 'str', hint: 'byte values to strip',    input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').rstrip(bytes({chars}, 'utf-8'))",
  cases: [
    { id: 'right',   label: 'right only',       values: { s: 'xxabxx', chars: 'x' } },
    { id: 'set',     label: 'set, not sequence',values: { s: 'abcba',  chars: 'ab' } },
    { id: 'none',    label: 'nothing to strip', values: { s: 'abc',    chars: 'z' } },
    { id: 'all',     label: 'strips everything',values: { s: 'aaa',    chars: 'a' } },
    { id: 'empty',   label: 'empty data',       values: { s: '',       chars: 'x' } },
  ],
  demoExplainer: 'Only the right end is touched — xxabxx becomes xxab, with the leading x bytes kept. The set rule applies as with strip: removing "ab" from "abcba" takes a then b off the end and stops at c, leaving abc. Everything in the set is removed repeatedly from the right until a byte outside it appears.',

  patterns: [
    {
      name: 'Drop a line ending',
      desc: 'Handles both CRLF and LF, keeping leading indentation.',
      code: "line = raw.rstrip(b'\\r\\n')",
    },
    {
      name: 'Remove trailing padding',
      desc: 'Space or null padded fields from fixed-width formats.',
      code: "value = field.rstrip(b'\\x00')",
    },
    {
      name: 'Remove an exact suffix instead',
      desc: 'For a specific sequence, removesuffix is the tool.',
      code: "name.removesuffix(b'.txt')",
    },
  ],

  examples: [
    { title: 'Right only',      code: "b'xxabxx'.rstrip(b'x')", returns: "b'xxab'" },
    { title: 'Set, not sequence', code: "b'abcba'.rstrip(b'ab')", returns: "b'abc'" },
    { title: 'Line ending',     code: "b'line\\r\\n'.rstrip(b'\\r\\n')", returns: "b'line'" },
    { title: 'Default whitespace', code: "b'  ab  '.rstrip()",  returns: "b'  ab'" },
    { title: 'Everything goes', code: "b'aaa'.rstrip(b'a')",    returns: "b''" },
    { title: 'Empty',           code: "b''.rstrip(b'x')",       returns: "b''" },
  ],

  pitfalls: [
    {
      name: 'chars is a SET, not a suffix',
      desc: 'Passing an extension strips its letters one at a time from the right. A filename ending in any of those letters loses them too.',
      wrong: { label: 'Letters removed', code: "b'testfile.txt'.rstrip(b'.txt')", output: "b'testfile'  # and b'text.txt' would become b'te'" },
      fix:   { label: 'Use removesuffix', code: "b'text.txt'.removesuffix(b'.txt')", output: "b'text'" },
    },
    {
      name: 'It only touches the right end',
      desc: 'Leading bytes in the set survive. To clean both ends use strip.',
      wrong: { label: 'Left kept', code: "b'xxabxx'.rstrip(b'x')", output: "b'xxab'" },
      fix:   { label: 'Use strip', code: "b'xxabxx'.strip(b'x')", output: "b'ab'" },
    },
    {
      name: 'The argument must be bytes',
      desc: 'A str raises. Text-oriented code pointed at a binary-mode file hits this on the first explicit argument.',
      wrong: { label: 'str rejected', code: "b'ab\\n'.rstrip('\\n')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'Bytes literal', code: "b'ab\\n'.rstrip(b'\\n')", output: "b'ab'" },
    },
  ],

  when: {
    use: [
      'Dropping line endings from binary-mode input',
      'Removing trailing padding from fixed-width fields',
      'Cleaning the end while preserving leading indentation',
    ],
    avoid: [
      'Removing a known suffix → removesuffix',
      'Cleaning both ends → strip',
      'Line splitting → splitlines handles terminators itself',
    ],
  },

  notes: {
    complexity: 'O(n) worst case, usually a few bytes at the right end',
    return:     'A new bytes object; the original when nothing was trimmed',
    cpython:    'Objects/bytesobject.c :: bytes_rstrip',
    memory:     'Allocates the trimmed result',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.strip',        slug: 'bytes-strip',        when: 'Trim both ends' },
    { name: 'bytes.lstrip',       slug: 'bytes-lstrip',       when: 'Trim the left end only' },
    { name: 'bytes.removesuffix', slug: 'bytes-removesuffix', when: 'Remove an exact suffix rather than a set' },
    { name: 'rstrip',             slug: 'rstrip',             when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'Why does rstrip(b".txt") eat part of my filename?',
      a: 'Because it strips the SET of bytes dot, t and x from the right, repeatedly. On b"text.txt" it removes .txt and then keeps going through the t of "text". removesuffix matches the exact sequence once.',
      code: "b'text.txt'.rstrip(b'.txt')        # b'te'\nb'text.txt'.removesuffix(b'.txt')  # b'text'",
    },
    {
      q: 'rstrip() or splitlines() for line endings?',
      a: 'rstrip when you already have one line and want its terminator gone. splitlines when you have many lines to separate — it handles every terminator style and never needs the set argument.',
    },
    {
      q: 'Does bytearray have rstrip?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.rstrip arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.rstrip',
    meta:  'bytes.rstrip',
  },

};
