// content/reference/python/functions/bytes-upper.js

export const meta = {
  slug:        'bytes-upper',
  name:        'bytes.upper',
  signature:   'bytes.upper()',
  blurb:       'Uppercase the ASCII letters — and only the ASCII letters.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes upper uppercase capital letters ascii case convert binary bytearray bytearray.upper',
};

export const method = {
  slug:      'bytes-upper',
  name:      'bytes.upper',
  signature: 'bytes.upper()',
  returns:   { type: 'bytes', desc: 'A new bytes object with every ASCII lowercase letter (a-z) converted to uppercase. All other bytes are unchanged.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Touches exactly 26 byte values, 0x61 to 0x7a. Anything encoded above ASCII passes through untouched, which is why an accented letter stays lowercase.',

  cheat: {
    commonCall: 'data.upper()',
    returns:    'a new bytes object; the original is unchanged',
    replaces:   'a manual loop over bytes with an ord/chr dance',
    watchOut:   'accented and non-Latin letters are NOT uppercased — decode first',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').upper()",
  cases: [
    { id: 'lower',    label: 'lowercase',        values: { s: 'hello' } },
    { id: 'mixed',    label: 'mixed case',       values: { s: 'HeLLo World' } },
    { id: 'digits',   label: 'digits untouched', values: { s: 'abc123' } },
    { id: 'accent',   label: 'accented (!)',     values: { s: 'héllo' } },
    { id: 'empty',    label: 'empty',            values: { s: '' } },
  ],
  demoExplainer: 'Only the 26 ASCII lowercase bytes change. Digits, punctuation and spaces pass through, and so does anything outside ASCII — look at the accented case, where the h, l and o become capitals but the é does not, because its two UTF-8 bytes are not in the a-z range. The str version would uppercase it; the bytes version has no idea it is a letter.',

  patterns: [
    {
      name: 'Normalise an ASCII protocol token',
      desc: 'HTTP methods, hex digests and similar are ASCII by definition.',
      code: "if method.upper() == b'GET':\n    ...",
    },
    {
      name: 'Case-insensitive comparison',
      desc: 'Uppercase both sides before comparing.',
      code: 'if header_name.upper() == expected.upper():',
    },
    {
      name: 'Uppercase real text',
      desc: 'Decode first so non-ASCII letters are handled.',
      code: "data.decode('utf-8').upper().encode('utf-8')",
    },
  ],

  examples: [
    { title: 'Lowercase',      code: "b'hello'.upper()",      returns: "b'HELLO'" },
    { title: 'Mixed',          code: "b'HeLLo World'.upper()", returns: "b'HELLO WORLD'" },
    { title: 'Digits stay',    code: "b'abc123'.upper()",     returns: "b'ABC123'" },
    { title: 'Accent ignored', code: "'héllo'.encode().upper()", returns: "b'H\\xc3\\xa9LLO'" },
    { title: 'Empty',          code: "b''.upper()",           returns: "b''" },
    { title: 'New object',     code: "d = b'a'\nd.upper() is d", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Non-ASCII letters are not touched',
      desc: 'The bytes method only knows the 26 ASCII letters. An accented character is two UTF-8 bytes outside that range and stays exactly as it was, so the result is a half-uppercased word that looks like a bug.',
      wrong: { label: 'Half converted', code: "'héllo'.encode().upper()", output: "b'H\\xc3\\xa9LLO'" },
      fix:   { label: 'Work on text',   code: "'héllo'.upper().encode()", output: "b'H\\xc3\\x89LLO'" },
    },
    {
      name: 'It returns a new object',
      desc: 'Bytes are immutable, so upper cannot change the original. Calling it without assigning the result does nothing at all.',
      wrong: { label: 'Result dropped', code: 'data.upper()\ndata', output: 'unchanged' },
      fix:   { label: 'Assign it',      code: 'data = data.upper()', output: 'uppercased' },
    },
    {
      name: 'Not a Unicode case mapping',
      desc: 'There are no special cases — no ß to SS, no dotted I. Text with any of that needs decoding and the str method, which understands the full mapping.',
      wrong: { label: 'Naive', code: "'straße'.encode().upper()", output: 'ß bytes untouched' },
      fix:   { label: 'Unicode-aware', code: "'straße'.upper()", output: "'STRASSE'" },
    },
  ],

  when: {
    use: [
      'Normalising ASCII protocol tokens and identifiers',
      'Case-insensitive comparison of ASCII data',
      'Hex digests and other guaranteed-ASCII content',
    ],
    avoid: [
      'Real text → decode, uppercase as str, encode',
      'Anything that might contain non-Latin letters',
      'You need the original kept — assign the result to a new name',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the bytes',
    return:     'A new bytes object of the same length',
    cpython:    'Objects/bytesobject.c :: stringlib_upper',
    memory:     'Allocates a buffer the same size as the input',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.lower',    slug: 'bytes-lower',    when: 'The opposite conversion' },
    { name: 'bytes.swapcase', slug: 'bytes-swapcase', when: 'Flip the case of every letter' },
    { name: 'upper',          slug: 'upper',          when: 'The str version, which handles all of Unicode' },
    { name: 'bytes.decode',   slug: 'bytes-decode',   when: 'Turn bytes into text before real case work' },
  ],

  faq: [
    {
      q: 'Why is my accented letter still lowercase?',
      a: 'Because bytes.upper only maps the 26 ASCII letters. An accented character is stored as two bytes outside that range, and the method leaves them alone. Decode to str, uppercase there, and encode again.',
      code: "'héllo'.upper().encode('utf-8')",
    },
    {
      q: 'Is it safe on binary data?',
      a: 'It never raises, but it will silently change any byte that happens to equal an ASCII lowercase letter, which can corrupt a binary format. Only apply it to data you know is text.',
    },
    {
      q: 'Does bytearray have upper?',
      a: 'Yes, with identical behaviour, returning a bytearray. Like every bytearray method that has a bytes twin it is documented here rather than duplicated.',
      code: "bytearray(b'ab').upper()\n# bytearray(b'AB')",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.upper arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.upper',
    meta:  'bytes.upper',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
