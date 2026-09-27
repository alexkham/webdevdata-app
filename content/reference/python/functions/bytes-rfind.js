// content/reference/python/functions/bytes-rfind.js

export const meta = {
  slug:        'bytes-rfind',
  name:        'bytes.rfind',
  signature:   'bytes.rfind(sub[, start[, end]])',
  blurb:       'Byte offset of the LAST match, or -1 — the offset still counts from the left.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes rfind reverse find last occurrence search from right offset minus one binary bytearray bytearray.rfind',
};

export const method = {
  slug:      'bytes-rfind',
  name:      'bytes.rfind',
  signature: 'bytes.rfind(sub[, start[, end]])',
  returns:   { type: 'int', desc: 'Byte offset of the last occurrence of sub, or -1 if absent. Never raises for a missing value.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The search runs from the right, but the answer is an ordinary left-counted offset. The standard tool for splitting on the last separator.',

  cheat: {
    commonCall: "i = path.rfind(b'/')",
    returns:    'int — byte offset from the LEFT, or -1',
    replaces:   'reversing the buffer and searching forward',
    watchOut:   '-1 is a valid index, so slicing with an unchecked result misbehaves',
  },

  parameters: [
    { name: 'sub',   type: 'bytes | int', required: true,  default: null,  desc: 'Byte sequence to locate. An int from 0 to 255 searches for that single byte.' },
    { name: 'start', type: 'int',         required: false, default: '0',   desc: 'Left boundary of the searched region. Still the LEFT boundary, even though the scan is from the right.' },
    { name: 'end',   type: 'int',         required: false, default: 'len', desc: 'Right boundary, exclusive.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sub', type: 'str', hint: 'sequence to find',        input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').rfind(bytes({sub}, 'utf-8'))",
  cases: [
    { id: 'last',     label: 'last of two',      values: { s: 'abcabc', sub: 'b' } },
    { id: 'single',   label: 'single match',     values: { s: 'abc',    sub: 'b' } },
    { id: 'absent',   label: 'absent gives -1',  values: { s: 'abc',    sub: 'z' } },
    { id: 'empty',    label: 'empty sub',        values: { s: 'abc',    sub: '' } },
    { id: 'non-ascii',label: 'after multi-byte', values: { s: 'héllo',  sub: 'l' } },
  ],
  demoExplainer: 'In abcabc the byte b sits at 1 and 4; rfind returns 4, the last one, while find would return 1. The number is still counted from the left — only the scan direction changed. An absent sequence gives -1. The empty sequence matches at every position, so its last match is the very end, giving the length. The multi-byte case shows the offset is in bytes: the last l in héllo is at byte 4, not character 3.',

  patterns: [
    {
      name: 'Split off the last path component',
      desc: 'Everything after the final slash.',
      code: "leaf = path[path.rfind(b'/') + 1:]",
    },
    {
      name: 'Find a file extension',
      desc: 'The last dot, not the first.',
      code: "i = name.rfind(b'.')\next = name[i:] if i != -1 else b''",
    },
    {
      name: 'Walk matches backwards',
      desc: 'Shrink the end bound after each hit.',
      code: "i = data.rfind(sub)\nwhile i != -1:\n    handle(i)\n    i = data.rfind(sub, 0, i)",
    },
  ],

  examples: [
    { title: 'Last of two',    code: "b'abcabc'.rfind(b'b')",  returns: '4' },
    { title: 'find differs',   code: "b'abcabc'.find(b'b')",   returns: '1' },
    { title: 'Absent',         code: "b'abc'.rfind(b'z')",     returns: '-1' },
    { title: 'Empty sub',      code: "b'abc'.rfind(b'')",      returns: '3' },
    { title: 'Bounded',        code: "b'abcabc'.rfind(b'b', 0, 4)", returns: '1' },
    { title: 'Int argument',   code: "b'a\\x00b\\x00'.rfind(0)", returns: '3' },
  ],

  pitfalls: [
    {
      name: 'The result is not counted from the right',
      desc: 'Only the scan is reversed. People expect a distance from the end or a negative index and get an ordinary left-counted offset.',
      wrong: { label: 'Expected from the end', code: "b'abcabc'.rfind(b'b')", output: '4  # not 1, not -2' },
      fix:   { label: 'Convert if needed',     code: "len(d) - d.rfind(b'b') - 1", output: '1  # distance from the end' },
    },
    {
      name: '-1 is a valid index',
      desc: 'Slicing with an unchecked -1 quietly means "the last byte". The classic find-family bug, and rfind has it too.',
      wrong: { label: 'Silently wrong', code: "d = b'abc'\nd[d.rfind(b'z') + 1:]", output: "b'abc'  # -1 + 1 = 0, whole buffer" },
      fix:   { label: 'Check first',    code: "i = d.rfind(b'z')\nleaf = d[i + 1:] if i != -1 else d", output: 'explicit' },
    },
    {
      name: 'start is still the LEFT boundary',
      desc: 'Despite the reversed scan, start and end describe the slice s[start:end]. start does not mean "where to begin scanning from the right".',
      wrong: { label: 'Misread', code: "b'abcabc'.rfind(b'b', 2)", output: '4  # searched s[2:], last hit' },
      fix:   { label: 'Bound with end', code: "b'abcabc'.rfind(b'b', 0, 4)", output: '1' },
    },
  ],

  when: {
    use: [
      'Splitting on the LAST separator — paths, extensions, host:port',
      'Absence is normal and should give -1 rather than raise',
      'Walking matches from the end backwards',
    ],
    avoid: [
      'Absence is an error → rindex',
      'The FIRST occurrence → find',
      'Splitting a path → os.path or pathlib handle the edge cases',
    ],
  },

  notes: {
    complexity: 'O(n * m) worst case; CPython uses an optimised reverse search',
    return:     'A byte offset from the left, or -1',
    cpython:    'Objects/bytesobject.c :: bytes_rfind',
    memory:     'No allocation — scans in place, no reversed copy',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.rindex',     slug: 'bytes-rindex',     when: 'Same search, raising instead of -1' },
    { name: 'bytes.find',       slug: 'bytes-find',       when: 'Search from the left' },
    { name: 'bytes.rpartition', slug: 'bytes-rpartition', when: 'Split on the last separator without an offset' },
    { name: 'str.rfind',        slug: 'str-rfind',        when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'Why is the answer not negative?',
      a: 'Because rfind returns a position, not a distance. Positions count from zero at the left regardless of scan direction, which is what makes the result directly usable in a slice.',
      code: "d = b'a/b/c'\nd[d.rfind(b'/') + 1:]   # b'c'",
    },
    {
      q: 'Is rpartition better for splitting?',
      a: 'Usually. rpartition hands back head, separator and tail in one call and never returns -1, so there is no offset to check. rfind is for when you want the number itself.',
      code: "head, sep, tail = d.rpartition(b'/')",
    },
    {
      q: 'Does bytearray have rfind?',
      a: 'Yes, with identical behaviour.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.rfind arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.rfind',
    meta:  'bytes.rfind',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
