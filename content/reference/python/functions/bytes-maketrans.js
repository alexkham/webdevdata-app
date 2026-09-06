// content/reference/python/functions/bytes-maketrans.js
//
// Doc-only page: the return value is a 256-byte table whose repr is ~738
// characters of escapes. Showing that as demo output would be noise, so the
// meaningful demo lives on bytes.translate instead.

export const meta = {
  slug:        'bytes-maketrans',
  name:        'bytes.maketrans',
  signature:   'bytes.maketrans(from, to)',
  blurb:       'Build the 256-byte translation table that bytes.translate consumes.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: false,
  version:     'Python 3.1+',
  searchTerms: 'bytes maketrans translation table static method translate mapping 256 build bytearray bytearray.maketrans',
};

export const method = {
  slug:      'bytes-maketrans',
  name:      'bytes.maketrans',
  signature: 'bytes.maketrans(from, to)',
  returns:   { type: 'bytes', desc: 'A 256-byte table where position i holds the byte that i maps to. Bytes not mentioned map to themselves.' },

  category:    'Bytes staticmethod',
  version:     'Python 3.1+',
  hasLiveDemo: false,

  subtitle: 'A table builder, not a transformation. On its own it does nothing visible — its output exists purely to be handed to translate.',

  cheat: {
    commonCall: "bytes.maketrans(b'abc', b'xyz')",
    returns:    'a 256-byte table — 738 characters of escapes if you print it',
    replaces:   'building the identity table and patching it by hand',
    watchOut:   'both arguments must be the SAME length, or it raises',
  },

  parameters: [
    { name: 'from', type: 'bytes', required: true, default: null, desc: 'Bytes to map from. Each byte here pairs positionally with one in to.' },
    { name: 'to',   type: 'bytes', required: true, default: null, desc: 'Bytes to map to. Must be exactly the same length as from.' },
  ],

  examples: [
    { title: 'Build a table',    code: "bytes.maketrans(b'abc', b'xyz')", returns: 'a 256-byte table' },
    { title: 'Use it',           code: "b'abcabc'.translate(bytes.maketrans(b'abc', b'xyz'))", returns: "b'xyzxyz'" },
    { title: 'Always 256 long',  code: "len(bytes.maketrans(b'a', b'x'))", returns: '256' },
    { title: 'Identity table',   code: "bytes.maketrans(b'', b'')", returns: 'maps every byte to itself' },
    { title: 'Length mismatch',  code: "bytes.maketrans(b'ab', b'x')", returns: 'ValueError: maketrans arguments must have same length' },
    { title: 'Unmapped pass through', code: "b'abcdef'.translate(bytes.maketrans(b'ad', b'AD'))", returns: "b'AbcDef'" },
  ],

  pitfalls: [
    {
      name: 'The arguments must be the same length',
      desc: 'Mapping is strictly positional and one byte to one byte, so a mismatch is meaningless and raises immediately. This is also why it cannot express deletions or expansions.',
      wrong: { label: 'Mismatched', code: "bytes.maketrans(b'ab', b'x')", output: 'ValueError: maketrans arguments must have same length' },
      fix:   { label: 'Pair them up', code: "bytes.maketrans(b'ab', b'xy')", output: 'a valid table' },
    },
    {
      name: 'It does not transform anything by itself',
      desc: 'The name suggests action, but it only builds a lookup table. Calling it without passing the result to translate accomplishes nothing.',
      wrong: { label: 'No effect', code: "bytes.maketrans(b'a', b'x')\ndata", output: 'unchanged' },
      fix:   { label: 'Feed it to translate', code: "data.translate(bytes.maketrans(b'a', b'x'))", output: 'transformed' },
    },
    {
      name: 'Printing the table is useless',
      desc: 'The result is a 256-byte object whose repr is hundreds of characters of escapes. It is data for the interpreter, not something to read or log.',
      wrong: { label: 'Wall of escapes', code: "print(bytes.maketrans(b'a', b'x'))", output: "b'\\x00\\x01\\x02... (738 chars)" },
      fix:   { label: 'Inspect one entry', code: "bytes.maketrans(b'a', b'x')[ord('a')]", output: '120  # ord("x")' },
    },
    {
      name: 'Different from str.maketrans',
      desc: 'The str version returns a DICT and accepts one, two or three arguments, including a form that deletes characters. The bytes version returns a 256-byte table and takes exactly two.',
      wrong: { label: 'Wrong arity', code: "bytes.maketrans(b'abc')", output: 'TypeError: maketrans() takes exactly 2 arguments' },
      fix:   { label: 'Two arguments', code: "bytes.maketrans(b'abc', b'xyz')", output: 'a valid table' },
    },
  ],

  when: {
    use: [
      'Preparing a table for bytes.translate',
      'Fixed byte-level substitutions defined once and reused',
      'Building a substitution cipher table',
    ],
    avoid: [
      'One-off replacements → bytes.replace is simpler',
      'Multi-byte sequences → maketrans cannot express them',
      'Text rather than bytes → str.maketrans, which is a different shape',
    ],
  },

  notes: {
    complexity: 'O(256) — builds the identity table, then applies the pairs',
    return:     'A new 256-byte bytes object, reusable across many translate calls',
    cpython:    'Objects/bytesobject.c :: bytes_maketrans',
    memory:     'Exactly 256 bytes plus object overhead',
    threadSafe: 'Yes — the table is immutable and safe to share',
  },

  related: [
    { name: 'bytes.translate', slug: 'bytes-translate', when: 'Actually apply the table' },
    { name: 'str.maketrans',   slug: 'str-maketrans',   when: 'The text version, which returns a dict' },
    { name: 'bytes.replace',   slug: 'bytes-replace',   when: 'Simpler for a single substitution' },
    { name: 'bytes',           slug: 'bytes',           when: 'Build the bytes in the first place' },
  ],

  faq: [
    {
      q: 'Why is the table 256 bytes?',
      a: 'One entry per possible byte value. Position i holds whatever byte i maps to, so translate is a single array lookup per byte — which is what makes it a one-pass operation regardless of how many mappings you defined.',
      code: "bytes.maketrans(b'a', b'x')[97]\n# 120",
    },
    {
      q: 'Can it delete bytes?',
      a: 'No — that is what translate\'s separate delete argument is for. maketrans only expresses one-to-one mappings, which is why both arguments must match in length.',
      code: "data.translate(table, b'\\x00')",
    },
    {
      q: 'Should I rebuild the table each time?',
      a: 'No. It is immutable and depends only on its two arguments, so build it once at module level and reuse it. Rebuilding inside a loop wastes 256 bytes and a pass every iteration.',
      code: "TABLE = bytes.maketrans(b'abc', b'xyz')",
    },
  ],

  history: [
    { version: '3.1', note: 'bytes.maketrans added as a staticmethod, replacing the Python 2 string.maketrans function.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.maketrans',
    meta:  'bytes.maketrans',
  },

  tryInTool: [],
};
