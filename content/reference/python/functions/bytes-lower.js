// content/reference/python/functions/bytes-lower.js

export const meta = {
  slug:        'bytes-lower',
  name:        'bytes.lower',
  signature:   'bytes.lower()',
  blurb:       'Lowercase the ASCII letters — and only the ASCII letters.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes lower lowercase letters ascii case convert normalise binary bytearray bytearray.lower',
};

export const method = {
  slug:      'bytes-lower',
  name:      'bytes.lower',
  signature: 'bytes.lower()',
  returns:   { type: 'bytes', desc: 'A new bytes object with every ASCII uppercase letter (A-Z) converted to lowercase. All other bytes are unchanged.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The usual first step in case-insensitive comparison of ASCII data. Like upper, it maps exactly 26 byte values and ignores everything else.',

  cheat: {
    commonCall: 'data.lower()',
    returns:    'a new bytes object; the original is unchanged',
    replaces:   'a manual loop over bytes',
    watchOut:   'accented and non-Latin letters are NOT lowercased — decode first',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').lower()",
  cases: [
    { id: 'upper',    label: 'uppercase',        values: { s: 'HELLO' } },
    { id: 'mixed',    label: 'mixed case',       values: { s: 'HeLLo World' } },
    { id: 'digits',   label: 'digits untouched', values: { s: 'ABC123' } },
    { id: 'accent',   label: 'accented (!)',     values: { s: 'HÉLLO' } },
    { id: 'empty',    label: 'empty',            values: { s: '' } },
  ],
  demoExplainer: 'Only the 26 ASCII uppercase bytes change. Digits, punctuation and spaces pass through, and so does anything outside ASCII. In the accented case the H, L and O become lowercase but the É does not, because its two UTF-8 bytes are not in the A-Z range — the bytes method has no idea it is a letter at all.',

  patterns: [
    {
      name: 'Case-insensitive header lookup',
      desc: 'HTTP header names are ASCII and case-insensitive by specification.',
      code: "headers = {k.lower(): v for k, v in raw_headers}",
    },
    {
      name: 'Normalise a protocol keyword',
      desc: 'Accept GET, get and Get alike.',
      code: "if verb.lower() == b'get':\n    ...",
    },
    {
      name: 'Lowercase real text',
      desc: 'Decode first so non-ASCII letters are handled.',
      code: "data.decode('utf-8').lower().encode('utf-8')",
    },
  ],

  examples: [
    { title: 'Uppercase',      code: "b'HELLO'.lower()",       returns: "b'hello'" },
    { title: 'Mixed',          code: "b'HeLLo World'.lower()", returns: "b'hello world'" },
    { title: 'Digits stay',    code: "b'ABC123'.lower()",      returns: "b'abc123'" },
    { title: 'Accent ignored', code: "'HÉLLO'.encode().lower()", returns: "b'h\\xc3\\x89llo'" },
    { title: 'Empty',          code: "b''.lower()",            returns: "b''" },
    { title: 'Compare',        code: "b'GET'.lower() == b'get'", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Non-ASCII letters are not touched',
      desc: 'Only the 26 ASCII letters map. An accented capital stays a capital, producing a half-lowercased word.',
      wrong: { label: 'Half converted', code: "'HÉLLO'.encode().lower()", output: "b'h\\xc3\\x89llo'" },
      fix:   { label: 'Work on text',   code: "'HÉLLO'.lower().encode()", output: "b'h\\xc3\\xa9llo'" },
    },
    {
      name: 'It returns a new object',
      desc: 'Bytes are immutable. Calling lower without assigning the result changes nothing.',
      wrong: { label: 'Result dropped', code: 'data.lower()\ndata', output: 'unchanged' },
      fix:   { label: 'Assign it',      code: 'data = data.lower()', output: 'lowercased' },
    },
    {
      name: 'Not a substitute for casefold',
      desc: 'str.casefold handles cases like ß for aggressive matching; bytes has nothing equivalent. For real text comparison, decode and casefold.',
      wrong: { label: 'ASCII only', code: "'STRASSE'.encode().lower() == 'straße'.encode()", output: 'False' },
      fix:   { label: 'Casefold text', code: "'STRASSE'.casefold() == 'straße'.casefold()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Case-insensitive matching of ASCII headers and keywords',
      'Normalising identifiers that are ASCII by definition',
      'Building lookup keys from ASCII data',
    ],
    avoid: [
      'Real text → decode, lowercase or casefold as str, encode',
      'Anything that might contain non-Latin letters',
      'Binary formats, where an accidental A-Z byte would be corrupted',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the bytes',
    return:     'A new bytes object of the same length',
    cpython:    'Objects/bytesobject.c :: stringlib_lower',
    memory:     'Allocates a buffer the same size as the input',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.upper',    slug: 'bytes-upper',    when: 'The opposite conversion' },
    { name: 'bytes.swapcase', slug: 'bytes-swapcase', when: 'Flip the case of every letter' },
    { name: 'lower',          slug: 'lower',          when: 'The str version, which handles all of Unicode' },
    { name: 'str.casefold',   slug: 'str-casefold',   when: 'Aggressive case-insensitive matching for text' },
  ],

  faq: [
    {
      q: 'Why is my accented capital still uppercase?',
      a: 'Because bytes.lower only maps the 26 ASCII letters. The accented character is two bytes outside that range and is left alone. Decode to str, lowercase there, and encode again.',
      code: "'HÉLLO'.lower().encode('utf-8')",
    },
    {
      q: 'Is lower() enough for case-insensitive comparison?',
      a: 'For ASCII, yes. For real text, no — some characters have case mappings that lower does not handle, which is what str.casefold is for. Decode first when the data is text.',
    },
    {
      q: 'Does bytearray have lower?',
      a: 'Yes, with identical behaviour, returning a bytearray. Every bytearray method with a bytes twin is documented here rather than duplicated.',
      code: "bytearray(b'AB').lower()\n# bytearray(b'ab')",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.lower arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.lower',
    meta:  'bytes.lower',
  },

};
