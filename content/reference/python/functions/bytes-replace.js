// content/reference/python/functions/bytes-replace.js

export const meta = {
  slug:        'bytes-replace',
  name:        'bytes.replace',
  signature:   'bytes.replace(old, new[, count])',
  blurb:       'Swap one byte sequence for another, returning a new bytes object.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes replace substitute swap patch binary immutable new object count bytearray bytearray.replace',
};

export const method = {
  slug:      'bytes-replace',
  name:      'bytes.replace',
  signature: 'bytes.replace(old, new[, count])',
  returns:   { type: 'bytes', desc: 'A NEW bytes object with occurrences of old replaced by new. The original is never modified.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Bytes are immutable, so this always allocates. When you are patching a large buffer repeatedly, that is the cost to watch — bytearray exists for exactly that case.',

  cheat: {
    commonCall: "data.replace(b'\\r\\n', b'\\n')",
    returns:    'a new bytes object; the original is untouched',
    replaces:   'manual slicing and concatenation around each match',
    watchOut:   'both arguments must be bytes, and the result must be assigned',
  },

  parameters: [
    { name: 'old',   type: 'bytes', required: true,  default: null, desc: 'Sequence to look for. An empty value inserts new at every gap.' },
    { name: 'new',   type: 'bytes', required: true,  default: null, desc: 'Replacement. May be a different length, or empty to delete.' },
    { name: 'count', type: 'int',   required: false, default: '-1', desc: 'Maximum replacements. Negative or omitted means replace every occurrence.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'old', type: 'str', hint: 'sequence to replace',     input: 'text' },
    { name: 'new', type: 'str', hint: 'replacement',             input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').replace(bytes({old}, 'utf-8'), bytes({new}, 'utf-8'))",
  cases: [
    { id: 'basic',    label: 'replace all',      values: { s: 'abcabc', old: 'a', new: 'X' } },
    { id: 'absent',   label: 'absent is a no-op',values: { s: 'abc',    old: 'z', new: 'X' } },
    { id: 'delete',   label: 'delete by empty',  values: { s: 'abcabc', old: 'a', new: '' } },
    { id: 'empty-old',label: 'empty old (!)',    values: { s: 'abc',    old: '',  new: '-' } },
    { id: 'non-ascii',label: 'multi-byte',       values: { s: 'héllo',  old: 'é', new: 'e' } },
  ],
  demoExplainer: 'Every occurrence is replaced unless you pass a count. A sequence that is not present gives the original back unchanged — no error. Replacing with an empty value deletes. The empty-old case is the surprising one: an empty sequence matches at every gap, so the replacement is inserted before each byte and after the last. The multi-byte case works because both arguments were encoded the same way, which is exactly why replacing bytes across mismatched encodings goes wrong.',

  patterns: [
    {
      name: 'Normalise line endings',
      desc: 'The most common real use, on data read in binary mode.',
      code: "unix = data.replace(b'\\r\\n', b'\\n')",
    },
    {
      name: 'Strip a byte you do not want',
      desc: 'An empty replacement deletes.',
      code: "clean = data.replace(b'\\x00', b'')",
    },
    {
      name: 'Patch just the first occurrence',
      desc: 'count limits how many are changed.',
      code: 'patched = data.replace(old, new, 1)',
    },
  ],

  examples: [
    { title: 'Replace all',    code: "b'abcabc'.replace(b'a', b'X')", returns: "b'XbcXbc'" },
    { title: 'Absent is a no-op', code: "b'abc'.replace(b'z', b'X')", returns: "b'abc'" },
    { title: 'Delete',         code: "b'abcabc'.replace(b'a', b'')",  returns: "b'bcbc'" },
    { title: 'Limit with count', code: "b'aaa'.replace(b'a', b'X', 1)", returns: "b'Xaa'" },
    { title: 'Empty old inserts', code: "b'abc'.replace(b'', b'-')",  returns: "b'-a-b-c-'" },
    { title: 'str rejected',   code: "b'abc'.replace('a', 'X')",      returns: 'TypeError' },
  ],

  pitfalls: [
    {
      name: 'It returns a new object — assign the result',
      desc: 'Bytes are immutable, so replace cannot modify in place. Calling it and discarding the return value is a no-op that looks like it worked.',
      wrong: { label: 'Result thrown away', code: "data.replace(b'a', b'X')\ndata", output: 'unchanged' },
      fix:   { label: 'Assign it',          code: "data = data.replace(b'a', b'X')", output: 'updated' },
    },
    {
      name: 'Repeated replaces on a big buffer are expensive',
      desc: 'Every call copies the whole buffer. Chaining several on a large payload is quietly O(n) per call — bytearray supports in-place edits when that matters.',
      wrong: { label: 'Copies each time', code: 'for old, new in rules:\n    data = data.replace(old, new)', output: 'a full copy per rule' },
      fix:   { label: 'Mutable buffer',   code: 'buf = bytearray(data)\n# edit slices in place', output: 'no repeated copying' },
    },
    {
      name: 'An empty old inserts everywhere',
      desc: 'Rarely what anyone intends. The empty sequence matches at every gap, so you get the replacement woven through the entire buffer.',
      wrong: { label: 'Woven through', code: "b'abc'.replace(b'', b'-')", output: "b'-a-b-c-'" },
      fix:   { label: 'Guard it',      code: 'if old:\n    data = data.replace(old, new)', output: 'no surprise' },
    },
    {
      name: 'Both arguments must be bytes',
      desc: 'Mixing a str into either position is a TypeError. Since the two look similar in source, this often survives review and fails at runtime.',
      wrong: { label: 'str rejected', code: "b'abc'.replace('a', b'X')", output: 'TypeError: a bytes-like object is required, not \'str\'' },
      fix:   { label: 'Encode both',  code: "b'abc'.replace(b'a', b'X')", output: "b'Xbc'" },
    },
  ],

  when: {
    use: [
      'Normalising line endings in binary-mode data',
      'Stripping or swapping a marker in a payload',
      'Small, one-off patches to a buffer',
    ],
    avoid: [
      'Many edits to a large buffer → bytearray, edited in place',
      'The data is text → decode first and use str.replace',
      'Pattern matching rather than a literal → the re module works on bytes too',
    ],
  },

  notes: {
    complexity: 'O(n) — the whole buffer is copied into the result',
    return:     'A new bytes object; CPython may return the original when nothing matched',
    cpython:    'Objects/bytesobject.c :: bytes_replace',
    memory:     'Allocates a new buffer sized for the result',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'replace',       slug: 'replace',       when: 'The str version of this method' },
    { name: 'bytes.find',    slug: 'bytes-find',    when: 'Locate a sequence rather than swap it' },
    { name: 'bytearray',     slug: 'bytearray',     when: 'A mutable buffer for repeated edits' },
    { name: 'bytes.translate', slug: 'bytes-translate', when: 'Map many single bytes in one pass' },
  ],

  faq: [
    {
      q: 'Why does my bytes object not change?',
      a: 'Because bytes are immutable — replace builds a new object and returns it. If you did not assign the result, the original is still exactly as it was.',
      code: "data = data.replace(b'a', b'X')",
    },
    {
      q: 'How do I replace many different byte values at once?',
      a: 'translate with a 256-byte table maps single bytes in one pass, which is far faster than chaining replace calls. replace remains the right tool for multi-byte sequences.',
      code: "table = bytes.maketrans(b'abc', b'xyz')\ndata.translate(table)",
    },
    {
      q: 'Can I use a regular expression?',
      a: 'Yes — the re module works on bytes as long as the pattern is also bytes. Use re.sub when the thing you are replacing is a pattern rather than a fixed sequence.',
      code: "import re\nre.sub(rb'\\d+', b'N', data)",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.replace arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.replace',
    meta:  'bytes.replace',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
