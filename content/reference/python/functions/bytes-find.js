// content/reference/python/functions/bytes-find.js

export const meta = {
  slug:        'bytes-find',
  name:        'bytes.find',
  signature:   'bytes.find(sub[, start[, end]])',
  blurb:       'Byte offset of the first match, or -1 when absent.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes find search locate offset position first occurrence binary minus one bytearray bytearray.find',
};

export const method = {
  slug:      'bytes-find',
  name:      'bytes.find',
  signature: 'bytes.find(sub[, start[, end]])',
  returns:   { type: 'int', desc: 'Byte offset of the first occurrence of sub, or -1 if it is not present. Never raises for a missing value.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The non-raising search. Returns a BYTE offset, which is not the same as a character position once the data holds anything above ASCII.',

  cheat: {
    commonCall: "data.find(b'\\n')",
    returns:    'int — byte offset, or -1 when absent',
    replaces:   'index plus a try block, when absence is expected',
    watchOut:   '-1 is a valid index, so slicing with an unchecked result silently misbehaves',
  },

  parameters: [
    { name: 'sub',   type: 'bytes | int', required: true,  default: null,  desc: 'Byte sequence to locate. An int from 0 to 255 searches for that single byte.' },
    { name: 'start', type: 'int',         required: false, default: '0',   desc: 'Byte offset to begin at. The result stays absolute.' },
    { name: 'end',   type: 'int',         required: false, default: 'len', desc: 'Byte offset to stop at, exclusive.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sub', type: 'str', hint: 'sequence to find',        input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').find(bytes({sub}, 'utf-8'))",
  cases: [
    { id: 'first',    label: 'first match',      values: { s: 'abcabc', sub: 'b' } },
    { id: 'absent',   label: 'absent gives -1',  values: { s: 'abc',    sub: 'z' } },
    { id: 'start',    label: 'at the start',     values: { s: 'abc',    sub: 'a' } },
    { id: 'non-ascii',label: 'after multi-byte', values: { s: 'héllo',  sub: 'l' } },
    { id: 'empty',    label: 'empty sub',        values: { s: 'abc',    sub: '' } },
  ],
  demoExplainer: 'find scans forward and reports where the match begins, or -1 if there is none. The multi-byte case is the one that matters: in "héllo" the letter l looks like character 2, but the accented character occupies TWO utf-8 bytes, so the byte offset is 3. Every offset here counts bytes, which is what you need for slicing the bytes object and what will not match a character position from the decoded text.',

  patterns: [
    {
      name: 'Split off a header',
      desc: 'Locate the delimiter, then slice around it.',
      code: "i = payload.find(b'\\r\\n\\r\\n')\nheader, body = payload[:i], payload[i+4:]",
    },
    {
      name: 'Optional marker',
      desc: 'find suits the case where absence is normal.',
      code: "if data.find(b'MAGIC') != -1:\n    ...",
    },
    {
      name: 'Walk every occurrence',
      desc: 'Advance past each hit until the search runs out.',
      code: "i = data.find(sub)\nwhile i != -1:\n    handle(i)\n    i = data.find(sub, i + 1)",
    },
  ],

  examples: [
    { title: 'First match',    code: "b'abcabc'.find(b'b')", returns: '1' },
    { title: 'Absent',         code: "b'abc'.find(b'z')",    returns: '-1' },
    { title: 'At the start',   code: "b'abc'.find(b'a')",    returns: '0' },
    { title: 'From an offset', code: "b'abcabc'.find(b'b', 2)", returns: '4' },
    { title: 'Byte offset',    code: "'héllo'.encode().find(b'l')", returns: '3  # not 2' },
    { title: 'Int argument',   code: "b'a\\x00b'.find(0)",   returns: '1' },
  ],

  pitfalls: [
    {
      name: '-1 is a valid index',
      desc: 'The classic find trap. Slicing with an unchecked -1 means "up to the last byte" rather than "not found", so the code keeps running and produces quietly wrong data.',
      wrong: { label: 'Silently wrong', code: "d = b'abc'\nd[:d.find(b'z')]", output: "b'ab'  # sliced to -1" },
      fix:   { label: 'Check first',    code: "i = d.find(b'z')\nresult = d[:i] if i != -1 else d", output: 'explicit' },
    },
    {
      name: 'Offsets are bytes, not characters',
      desc: 'Any non-ASCII content shifts the numbers. An offset from a bytes object cannot be used to slice the decoded string, and mixing the two is a persistent source of off-by-several bugs.',
      wrong: { label: 'Mismatched', code: "'héllo'.encode().find(b'l'), 'héllo'.find('l')", output: '(3, 2)' },
      fix:   { label: 'Stay in one domain', code: "'héllo'.find('l')   # decode first, then search", output: '2' },
    },
    {
      name: 'A str argument is a TypeError',
      desc: 'Like every bytes method, it will not encode the needle for you. The error is immediate, which is at least better than a silent mismatch.',
      wrong: { label: 'str rejected', code: "b'abc'.find('a')", output: "TypeError: argument should be integer or bytes-like object, not 'str'" },
      fix:   { label: 'Encode it',    code: "b'abc'.find('a'.encode())", output: '0' },
    },
    {
      name: 'start does not shift the answer',
      desc: 'The returned offset is absolute, not relative to start. Treating it as an offset from where you began searching double-counts.',
      wrong: { label: 'Read as relative', code: "b'abcabc'.find(b'b', 2)", output: '4, not 2' },
      fix:   { label: 'Subtract if needed', code: "b'abcabc'.find(b'b', 2) - 2", output: '2' },
    },
  ],

  when: {
    use: [
      'Locating a delimiter or magic marker in a binary payload',
      'Absence is expected and should not raise',
      'Slicing a buffer around a known separator',
    ],
    avoid: [
      'Absence is an error → index, which raises',
      'You only need presence → the in operator',
      'The data is text → decode first and search the string',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case; CPython uses the same optimised search as str',
    return:     'A byte offset, or -1; never raises for a missing value',
    cpython:    'Objects/bytesobject.c :: bytes_find',
    memory:     'No allocation — scans in place',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.index', slug: 'bytes-index', when: 'Same search, raising instead of returning -1' },
    { name: 'find',        slug: 'find',        when: 'The str version of this method' },
    { name: 'bytes.count', slug: 'bytes-count', when: 'How many matches rather than where' },
    { name: 'in',          slug: 'in',          when: 'Just a membership test', category: 'operators' },
  ],

  faq: [
    {
      q: 'Why is the offset different from the string position?',
      a: 'Because bytes count storage and characters count text. In UTF-8 an accented letter takes two bytes, an emoji four, so byte offsets run ahead of character positions as soon as the data leaves ASCII.',
      code: "'héllo'.encode().find(b'l')   # 3\n'héllo'.find('l')             # 2",
    },
    {
      q: 'find or index?',
      a: 'find when a missing value is ordinary — you get -1 and decide what to do. index when it is a bug — you get a ValueError immediately rather than a -1 that might slice something plausible.',
    },
    {
      q: 'How do I find the LAST occurrence?',
      a: 'rfind scans from the right and returns -1 when absent, and rindex is its raising counterpart. Both report absolute offsets, exactly like find.',
      code: "data.rfind(b'/')",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.find arrived with the bytes type in the text/binary split.' },
    { version: '3.3', note: 'An int argument accepted, searching for a single byte value.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.find',
    meta:  'bytes.find',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
