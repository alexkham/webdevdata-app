// content/reference/python/functions/bytes-rindex.js

export const meta = {
  slug:        'bytes-rindex',
  name:        'bytes.rindex',
  signature:   'bytes.rindex(sub[, start[, end]])',
  blurb:       'Byte offset of the LAST match — raises ValueError instead of returning -1.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes rindex reverse index last occurrence subsection not found valueerror binary bytearray bytearray.rindex',
};

export const method = {
  slug:      'bytes-rindex',
  name:      'bytes.rindex',
  signature: 'bytes.rindex(sub[, start[, end]])',
  returns:   { type: 'int', desc: 'Byte offset of the last occurrence. Raises ValueError with the message "subsection not found" when absent.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'rfind with the raising failure mode. Use it when the separator is required and its absence means the input is malformed.',

  cheat: {
    commonCall: "i = path.rindex(b'/')",
    returns:    'int — byte offset from the left; absence raises',
    replaces:   'rfind plus a manual -1 check',
    watchOut:   'the message says "subsection", not "substring"',
  },

  parameters: [
    { name: 'sub',   type: 'bytes | int', required: true,  default: null,  desc: 'Byte sequence to locate. An int from 0 to 255 searches for that single byte.' },
    { name: 'start', type: 'int',         required: false, default: '0',   desc: 'Left boundary of the searched region.' },
    { name: 'end',   type: 'int',         required: false, default: 'len', desc: 'Right boundary, exclusive.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sub', type: 'str', hint: 'sequence to locate',      input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').rindex(bytes({sub}, 'utf-8'))",
  cases: [
    { id: 'last',     label: 'last of two',      values: { s: 'abcabc', sub: 'b' } },
    { id: 'single',   label: 'single match',     values: { s: 'abc',    sub: 'b' } },
    { id: 'missing',  label: 'absent raises',    values: { s: 'abc',    sub: 'z' } },
    { id: 'empty',    label: 'empty sub',        values: { s: 'abc',    sub: '' } },
    { id: 'non-ascii',label: 'after multi-byte', values: { s: 'héllo',  sub: 'l' } },
  ],
  demoExplainer: 'Same reverse scan as rfind, same left-counted offset — abcabc gives 4 for b, the last occurrence. The difference is the failure case: a missing sequence raises ValueError rather than returning -1. Choose rindex when the thing you are looking for must be there, so that its absence stops the program instead of producing a plausible -1.',

  patterns: [
    {
      name: 'Required last separator',
      desc: 'A path that must contain a slash; absence is an error.',
      code: "i = path.rindex(b'/')\ndirectory, leaf = path[:i], path[i + 1:]",
    },
    {
      name: 'Convert absence into a domain error',
      desc: 'Catch and re-raise with a message the caller can act on.',
      code: "try:\n    i = ref.rindex(b':')\nexcept ValueError:\n    raise ValueError('expected host:port')",
    },
    {
      name: 'Prefer rpartition for splitting',
      desc: 'No offset to manage, and no exception when the separator is optional.',
      code: "head, sep, tail = ref.rpartition(b':')",
    },
  ],

  examples: [
    { title: 'Last of two',   code: "b'abcabc'.rindex(b'b')", returns: '4' },
    { title: 'Single',        code: "b'abc'.rindex(b'b')",    returns: '1' },
    { title: 'Absent raises', code: "b'abc'.rindex(b'z')",    returns: 'ValueError: subsection not found' },
    { title: 'Empty sub',     code: "b'abc'.rindex(b'')",     returns: '3' },
    { title: 'Bounded',       code: "b'abcabc'.rindex(b'b', 0, 4)", returns: '1' },
    { title: 'rfind returns -1', code: "b'abc'.rfind(b'z')", returns: '-1  # the alternative' },
  ],

  pitfalls: [
    {
      name: 'It raises where rfind returns -1',
      desc: 'Identical signature, different failure. Swapping one for the other without adjusting the error handling turns a quiet -1 into an uncaught exception.',
      wrong: { label: 'Uncaught', code: "b'abc'.rindex(b'z')", output: 'ValueError: subsection not found' },
      fix:   { label: 'rfind for optional', code: "i = b'abc'.rfind(b'z')\nif i == -1:\n    ...", output: '-1, handled' },
    },
    {
      name: 'The offset is from the left',
      desc: 'Only the scan is reversed. The number is an ordinary index, not a distance from the end.',
      wrong: { label: 'Not from the end', code: "b'abcabc'.rindex(b'b')", output: '4' },
      fix:   { label: 'Convert if needed', code: "len(d) - d.rindex(b'b') - 1", output: '1' },
    },
    {
      name: 'A str argument is a TypeError, not a ValueError',
      desc: 'Two different failures. A handler written for the not-found case does not catch the type error from passing a str.',
      wrong: { label: 'Wrong handler', code: "try:\n    b'abc'.rindex('z')\nexcept ValueError:\n    ...", output: 'TypeError escapes' },
      fix:   { label: 'Encode the needle', code: "b'abc'.rindex('z'.encode())", output: 'ValueError, as expected' },
    },
  ],

  when: {
    use: [
      'A required trailing separator whose absence is an error',
      'Parsing where a missing marker means malformed input',
    ],
    avoid: [
      'Absence is normal → rfind',
      'Splitting on the separator → rpartition',
      'The FIRST occurrence → index',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case; the same reverse search as rfind',
    return:     'A non-negative byte offset; absence raises',
    cpython:    'Objects/bytesobject.c :: bytes_rindex',
    memory:     'No allocation — scans in place',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.rfind',      slug: 'bytes-rfind',      when: 'Same search, returning -1 instead of raising' },
    { name: 'bytes.index',      slug: 'bytes-index',      when: 'Search from the left, raising on absence' },
    { name: 'bytes.rpartition', slug: 'bytes-rpartition', when: 'Split on the last separator without an offset' },
    { name: 'str.rindex',       slug: 'str-rindex',       when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'rindex or rfind?',
      a: 'rindex when a missing value is a bug — you get a ValueError at once. rfind when absence is ordinary — you get -1 and decide what to do. If you would write "if i == -1: raise" anyway, rindex already does it.',
    },
    {
      q: 'Why "subsection" in the error?',
      a: 'Because bytes hold no strings, so "substring" would be the wrong word. It is the same message index uses. Do not match on the message text; the exception type is enough.',
      code: "b'abc'.rindex(b'z')\n# ValueError: subsection not found",
    },
    {
      q: 'Does bytearray have rindex?',
      a: 'Yes, with identical behaviour.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.rindex arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.rindex',
    meta:  'bytes.rindex',
  },

};
