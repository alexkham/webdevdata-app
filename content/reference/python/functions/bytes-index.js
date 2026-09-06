// content/reference/python/functions/bytes-index.js

export const meta = {
  slug:        'bytes-index',
  name:        'bytes.index',
  signature:   'bytes.index(sub[, start[, end]])',
  blurb:       'Byte offset of the first match — raises ValueError instead of returning -1.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes index position locate subsection not found valueerror binary offset bytearray bytearray.index',
};

export const method = {
  slug:      'bytes-index',
  name:      'bytes.index',
  signature: 'bytes.index(sub[, start[, end]])',
  returns:   { type: 'int', desc: 'Byte offset of the first occurrence. Raises ValueError with the message "subsection not found" when absent.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Identical to find except for the failure mode. Note the error message says SUBSECTION, not substring — a small tell that you are in the bytes world.',

  cheat: {
    commonCall: "data.index(b'\\n')",
    returns:    'int — byte offset; absence raises',
    replaces:   'find plus a manual -1 check you might forget',
    watchOut:   'the message is "subsection not found", unlike str\'s "substring not found"',
  },

  parameters: [
    { name: 'sub',   type: 'bytes | int', required: true,  default: null,  desc: 'Byte sequence to locate. An int from 0 to 255 searches for that single byte.' },
    { name: 'start', type: 'int',         required: false, default: '0',   desc: 'Byte offset to begin at. The result stays absolute.' },
    { name: 'end',   type: 'int',         required: false, default: 'len', desc: 'Byte offset to stop at, exclusive.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sub', type: 'str', hint: 'sequence to locate',      input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').index(bytes({sub}, 'utf-8'))",
  cases: [
    { id: 'first',    label: 'first match',      values: { s: 'abcabc', sub: 'b' } },
    { id: 'start',    label: 'at the start',     values: { s: 'abc',    sub: 'a' } },
    { id: 'non-ascii',label: 'after multi-byte', values: { s: 'héllo',  sub: 'l' } },
    { id: 'missing',  label: 'absent raises',    values: { s: 'abc',    sub: 'z' } },
    { id: 'empty',    label: 'empty sub',        values: { s: 'abc',    sub: '' } },
  ],
  demoExplainer: 'Same scan as find, different ending. A match gives its byte offset; no match raises ValueError rather than handing back -1. The multi-byte case shows the offset is measured in BYTES — l sits at 3 in the encoded form of "héllo" even though it is the third character. Choose this over find when a missing marker means the input is malformed.',

  patterns: [
    {
      name: 'Required delimiter',
      desc: 'When the separator must be there, the exception is the bounds check.',
      code: "i = payload.index(b'\\r\\n\\r\\n')\nheader, body = payload[:i], payload[i+4:]",
    },
    {
      name: 'Convert absence into a domain error',
      desc: 'Catch and re-raise with something the caller can act on.',
      code: "try:\n    i = data.index(b'MAGIC')\nexcept ValueError:\n    raise ParseError('missing magic bytes')",
    },
    {
      name: 'Walk every occurrence',
      desc: 'The exception ends the loop naturally.',
      code: 'i = 0\nwhile True:\n    try:\n        i = data.index(sub, i) + 1\n    except ValueError:\n        break',
    },
  ],

  examples: [
    { title: 'First match',    code: "b'abcabc'.index(b'b')", returns: '1' },
    { title: 'At the start',   code: "b'abc'.index(b'a')",    returns: '0' },
    { title: 'From an offset', code: "b'abcabc'.index(b'b', 2)", returns: '4' },
    { title: 'Absent raises',  code: "b'abc'.index(b'z')",    returns: 'ValueError: subsection not found' },
    { title: 'Byte offset',    code: "'héllo'.encode().index(b'l')", returns: '3' },
    { title: 'find returns -1',code: "b'abc'.find(b'z')",     returns: '-1  # the alternative' },
  ],

  pitfalls: [
    {
      name: 'It raises where find returns -1',
      desc: 'The signatures are identical, so swapping one for the other looks safe. It is not — an absent value that produced a quiet -1 now stops the program.',
      wrong: { label: 'Uncaught', code: "b'abc'.index(b'z')", output: 'ValueError: subsection not found' },
      fix:   { label: 'Use find for optional', code: "i = b'abc'.find(b'z')\nif i == -1:\n    ...", output: '-1, handled' },
    },
    {
      name: 'The message differs from str.index',
      desc: 'bytes says "subsection not found" while str says "substring not found". Code or tests matching on the message text break when the type changes underneath them.',
      wrong: { label: 'Message mismatch', code: "except ValueError as e:\n    assert 'substring' in str(e)", output: 'fails for bytes' },
      fix:   { label: 'Do not match on text', code: 'except ValueError:\n    handle()', output: 'type is enough' },
    },
    {
      name: 'A str argument is a TypeError, not a ValueError',
      desc: 'Two different failures are easy to conflate. Passing a str is a TYPE error and will not be caught by a handler written for the not-found case.',
      wrong: { label: 'Wrong handler', code: "try:\n    b'abc'.index('z')\nexcept ValueError:\n    ...", output: 'TypeError escapes' },
      fix:   { label: 'Encode the needle', code: "b'abc'.index('z'.encode())", output: 'ValueError, as expected' },
    },
  ],

  when: {
    use: [
      'A delimiter that must be present in a well-formed payload',
      'Parsing where a missing marker means malformed input',
      'You would write "if i == -1: raise" anyway',
    ],
    avoid: [
      'Absence is normal → find, which returns -1',
      'You only need presence → the in operator',
      'Searching from the right → rindex',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case; the same search machinery as find',
    return:     'A non-negative byte offset; absence raises',
    cpython:    'Objects/bytesobject.c :: bytes_index',
    memory:     'No allocation — scans in place',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.find',  slug: 'bytes-find',  when: 'Same search, returning -1 instead of raising' },
    { name: 'str.index',   slug: 'str-index',   when: 'The text version, with a different error message' },
    { name: 'bytes.count', slug: 'bytes-count', when: 'How many matches rather than where' },
    { name: 'bytes',       slug: 'bytes',       when: 'Build the bytes in the first place' },
  ],

  faq: [
    {
      q: 'Why "subsection" rather than "substring"?',
      a: 'Because a bytes object holds no strings — "substring" would imply text. It is a small wording change, but enough to break tests that assert on the message when data switches from str to bytes.',
      code: "b'abc'.index(b'z')\n# ValueError: subsection not found",
    },
    {
      q: 'Does start make it faster?',
      a: 'It avoids building a slice, which matters on large buffers — data.index(sub, 1000) copies nothing, while data[1000:].index(sub) copies the tail first. Remember the result stays absolute either way.',
    },
    {
      q: 'How do I find every occurrence?',
      a: 'Loop, advancing past each hit, and let the ValueError end the loop. Or use find in a while loop if you prefer testing -1 to catching an exception.',
      code: 'i = data.index(sub, i) + 1',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.index arrived with the bytes type in the text/binary split.' },
    { version: '3.3', note: 'An int argument accepted, searching for a single byte value.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.index',
    meta:  'bytes.index',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
