// content/reference/python/functions/bytes-translate.js

export const meta = {
  slug:        'bytes-translate',
  name:        'bytes.translate',
  signature:   'bytes.translate(table, /, delete=b\'\')',
  blurb:       'Map many single bytes in one pass, using a 256-entry table.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes translate maketrans table substitute map delete bytes rot13 cipher bytearray bytearray.translate',
};

export const method = {
  slug:      'bytes-translate',
  name:      'bytes.translate',
  signature: "bytes.translate(table, /, delete=b'')",
  returns:   { type: 'bytes', desc: 'A new bytes object with every byte mapped through the table. Bytes listed in delete are removed entirely.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'One pass, many substitutions. Where chained replace calls each copy the whole buffer, translate rewrites every byte exactly once.',

  cheat: {
    commonCall: 'data.translate(bytes.maketrans(frm, to))',
    returns:    'a new bytes object of the same length, unless delete is used',
    replaces:   'a chain of replace calls for single-byte swaps',
    watchOut:   'it only maps SINGLE bytes — it cannot swap multi-byte sequences',
  },

  parameters: [
    { name: 'table',  type: 'bytes | None', required: true,  default: null, desc: 'A 256-byte table, normally from bytes.maketrans. Pass None to only delete.' },
    { name: 'delete', type: 'bytes',        required: false, default: "b''", desc: 'Bytes to remove entirely. Applied as well as the table mapping.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'frm', type: 'str', hint: 'bytes to map from',       input: 'text' },
    { name: 'to',  type: 'str', hint: 'bytes to map to',         input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').translate(bytes.maketrans(bytes({frm}, 'utf-8'), bytes({to}, 'utf-8')))",
  cases: [
    { id: 'hippo',   label: 'hello to hippo',   values: { s: 'hello',  frm: 'el', to: 'ip' } },
    { id: 'simple',  label: 'abc to xyz',       values: { s: 'abcabc', frm: 'abc', to: 'xyz' } },
    { id: 'partial', label: 'only some mapped', values: { s: 'abcdef', frm: 'ad', to: 'AD' } },
    { id: 'noop',    label: 'empty table',      values: { s: 'abc',    frm: '',   to: '' } },
    { id: 'mismatch',label: 'length mismatch',  values: { s: 'abc',    frm: 'ab', to: 'x' } },
  ],
  demoExplainer: 'maketrans pairs up the two arguments byte by byte — the first byte of frm maps to the first byte of to, and so on — and translate then rewrites the data through that table. Bytes not mentioned pass through untouched, as the partial case shows. The mapping is strictly one byte to one byte, so the two arguments must be the same length; the last case shows the ValueError you get otherwise.',

  patterns: [
    {
      name: 'Swap several bytes at once',
      desc: 'One pass instead of a chain of replace calls.',
      code: "table = bytes.maketrans(b'abc', b'xyz')\nout = data.translate(table)",
    },
    {
      name: 'Delete bytes without mapping',
      desc: 'Pass None as the table when you only want removal.',
      code: "clean = data.translate(None, b'\\r\\x00')",
    },
    {
      name: 'Build a simple byte cipher',
      desc: 'A fixed permutation table is a substitution cipher.',
      code: 'rot = bytes.maketrans(plain_alphabet, shifted_alphabet)',
    },
  ],

  examples: [
    { title: 'hello to hippo', code: "b'hello'.translate(bytes.maketrans(b'el', b'ip'))", returns: "b'hippo'" },
    { title: 'Map three',      code: "b'abcabc'.translate(bytes.maketrans(b'abc', b'xyz'))", returns: "b'xyzxyz'" },
    { title: 'Delete only',    code: "b'abc'.translate(None, b'b')", returns: "b'ac'" },
    { title: 'Map and delete', code: "b'abc'.translate(bytes.maketrans(b'abc', b'xyz'), b'c')", returns: "b'xy'" },
    { title: 'Length mismatch', code: "bytes.maketrans(b'ab', b'x')", returns: 'ValueError: maketrans arguments must have same length' },
    { title: 'Short table',    code: "b'abc'.translate(b'short')", returns: 'ValueError: translation table must be 256 characters long' },
  ],

  pitfalls: [
    {
      name: 'Single bytes only',
      desc: 'translate maps byte to byte. It cannot turn one byte into two, or replace a multi-byte sequence — reaching for it to swap words or CRLF pairs will not work.',
      wrong: { label: 'Cannot map pairs', code: "data.translate(bytes.maketrans(b'\\r\\n', b'\\n'))", output: 'ValueError: arguments must have same length' },
      fix:   { label: 'Use replace',      code: "data.replace(b'\\r\\n', b'\\n')", output: 'handles sequences' },
    },
    {
      name: 'The table must be exactly 256 bytes',
      desc: 'Passing anything shorter raises. Always build it with maketrans rather than by hand, which is what the length rule is really telling you.',
      wrong: { label: 'Hand-made table', code: "b'abc'.translate(b'short')", output: 'ValueError: translation table must be 256 characters long' },
      fix:   { label: 'Use maketrans',   code: "b'abc'.translate(bytes.maketrans(b'a', b'x'))", output: "b'xbc'" },
    },
    {
      name: 'Multi-byte characters get mangled',
      desc: 'On UTF-8 encoded text, translate rewrites individual bytes with no idea they belong to one character. Mapping a byte inside a multi-byte sequence produces invalid UTF-8 that fails on decode.',
      wrong: { label: 'Breaks the encoding', code: "'héllo'.encode().translate(bytes.maketrans(b'\\xc3', b'\\x41'))", output: 'invalid utf-8' },
      fix:   { label: 'Work on text',        code: "'héllo'.translate(str.maketrans('é', 'e'))", output: "'hello'" },
    },
    {
      name: 'It returns a new object',
      desc: 'Bytes are immutable, so the result must be assigned. Calling translate and discarding the return value does nothing at all.',
      wrong: { label: 'Result dropped', code: 'data.translate(table)\ndata', output: 'unchanged' },
      fix:   { label: 'Assign it',      code: 'data = data.translate(table)', output: 'updated' },
    },
  ],

  when: {
    use: [
      'Swapping several single bytes in one pass',
      'Stripping a set of unwanted byte values',
      'Fixed substitution ciphers and byte-level normalisation',
      'Hot paths where chained replace calls cost too much',
    ],
    avoid: [
      'Multi-byte sequences → replace',
      'UTF-8 encoded text → decode and use str.translate',
      'Pattern-based edits → the re module, which works on bytes',
    ],
  },

  notes: {
    complexity: 'O(n) — one table lookup per byte, regardless of how many mappings',
    return:     'A new bytes object; the same length unless delete removed something',
    cpython:    'Objects/bytesobject.c :: bytes_translate',
    memory:     'Allocates the result plus a 256-byte table',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.maketrans', slug: 'bytes-maketrans', when: 'Build the 256-byte table this method needs' },
    { name: 'str.translate',   slug: 'str-translate',   when: 'The text version, which handles characters' },
    { name: 'bytes.replace',   slug: 'bytes-replace',   when: 'Swapping multi-byte sequences' },
    { name: 'bytes',           slug: 'bytes',           when: 'Build the bytes in the first place' },
  ],

  faq: [
    {
      q: 'Why use translate instead of several replace calls?',
      a: 'Each replace copies the entire buffer, so five substitutions mean five full passes. translate does them all in one pass through a lookup table — the win grows with both the buffer size and the number of mappings.',
      code: 'data.translate(bytes.maketrans(b"abc", b"xyz"))',
    },
    {
      q: 'How do I just delete bytes?',
      a: 'Pass None as the table and list the unwanted bytes in delete. The mapping step is skipped and only removal happens.',
      code: "data.translate(None, b'\\r\\x00')",
    },
    {
      q: 'Why does it break my UTF-8 text?',
      a: 'Because it works on bytes with no knowledge of encodings. Rewriting one byte of a multi-byte character leaves an invalid sequence. Decode to str and use str.translate when the data is text.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.translate arrived with the bytes type in the text/binary split.' },
    { version: '3.6', note: 'The delete argument became keyword-friendly and the table accepts None.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.translate',
    meta:  'bytes.translate',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
