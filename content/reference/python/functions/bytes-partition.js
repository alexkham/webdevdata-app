// content/reference/python/functions/bytes-partition.js

export const meta = {
  slug:        'bytes-partition',
  name:        'bytes.partition',
  signature:   'bytes.partition(sep)',
  blurb:       'Split once into exactly three parts — head, separator, tail.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes partition split once three parts head tail separator unpack safe binary bytearray bytearray.partition',
};

export const method = {
  slug:      'bytes-partition',
  name:      'bytes.partition',
  signature: 'bytes.partition(sep)',
  returns:   { type: 'tuple', desc: 'Always a three-item tuple: (head, separator, tail). When the separator is absent, the head holds everything and the other two are empty.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Always three parts, whatever the input. That guarantee is the whole point — unpacking can never fail the way it does with split.',

  cheat: {
    commonCall: "head, sep, tail = data.partition(b'=')",
    returns:    'a 3-tuple, always — no length surprises',
    replaces:   "split(sep, 1) plus a length check",
    watchOut:   'a missing separator puts everything in the HEAD, not the tail',
  },

  parameters: [
    { name: 'sep', type: 'bytes', required: true, default: null, desc: 'Separator to split on, at its first occurrence. An empty separator raises ValueError.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sep', type: 'str', hint: 'separator',               input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').partition(bytes({sep}, 'utf-8'))",
  cases: [
    { id: 'found',   label: 'separator present', values: { s: 'a=b',   sep: '=' } },
    { id: 'first',   label: 'splits at FIRST',   values: { s: 'a=b=c', sep: '=' } },
    { id: 'absent',  label: 'separator absent',  values: { s: 'abc',   sep: '=' } },
    { id: 'leading', label: 'at the start',      values: { s: '=abc',  sep: '=' } },
    { id: 'trailing',label: 'at the end',        values: { s: 'abc=',  sep: '=' } },
  ],
  demoExplainer: 'Three parts come back every time. With a separator present you get what is before it, the separator itself, and what is after — and only the FIRST occurrence splits, so "a=b=c" leaves the second equals sign in the tail. When the separator is absent the head holds the entire input and the other two are empty, which is the detail to remember: check the separator, not the tail, to find out whether a split happened.',

  patterns: [
    {
      name: 'Parse a key-value line safely',
      desc: 'No unpacking error is possible, whatever the input looks like.',
      code: "key, sep, value = line.partition(b'=')\nif not sep:\n    raise ValueError('missing =')",
    },
    {
      name: 'Split a header from a body',
      desc: 'The tail keeps everything after the first separator.',
      code: "head, _, body = payload.partition(b'\\r\\n\\r\\n')",
    },
    {
      name: 'Take the part before a marker',
      desc: 'Works whether or not the marker is present.',
      code: "prefix = data.partition(b'#')[0]",
    },
  ],

  examples: [
    { title: 'Separator present', code: "b'a=b'.partition(b'=')",   returns: "(b'a', b'=', b'b')" },
    { title: 'Splits at first',   code: "b'a=b=c'.partition(b'=')", returns: "(b'a', b'=', b'b=c')" },
    { title: 'Absent',            code: "b'abc'.partition(b'=')",   returns: "(b'abc', b'', b'')" },
    { title: 'At the start',      code: "b'=abc'.partition(b'=')",  returns: "(b'', b'=', b'abc')" },
    { title: 'At the end',        code: "b'abc='.partition(b'=')",  returns: "(b'abc', b'=', b'')" },
    { title: 'Unpack is safe',    code: "h, s, t = b'abc'.partition(b'=')", returns: 'always works' },
  ],

  pitfalls: [
    {
      name: 'A missing separator fills the HEAD',
      desc: 'People reliably expect the tail. Code that reads the third element as "the value" silently gets empty bytes when the separator was absent, instead of failing.',
      wrong: { label: 'Empty value', code: "b'novalue'.partition(b'=')[2]", output: "b''" },
      fix:   { label: 'Test the separator', code: "h, s, t = data.partition(b'=')\nif not s:\n    raise ValueError('no separator')", output: 'explicit' },
    },
    {
      name: 'Only the first occurrence splits',
      desc: 'Later separators stay in the tail. That is usually what you want for key=value data, and wrong when you expected every field split out.',
      wrong: { label: 'Rest stays joined', code: "b'a=b=c'.partition(b'=')", output: "(b'a', b'=', b'b=c')" },
      fix:   { label: 'Use split',         code: "b'a=b=c'.split(b'=')", output: "[b'a', b'b', b'c']" },
    },
    {
      name: 'An empty separator raises',
      desc: 'There is no meaningful place to split, so Python refuses. A separator built from a variable that turned out empty fails here rather than where it was set.',
      wrong: { label: 'No split point', code: "b'abc'.partition(b'')", output: 'ValueError: empty separator' },
      fix:   { label: 'Guard it',       code: "parts = data.partition(sep) if sep else (data, b'', b'')", output: 'explicit' },
    },
    {
      name: 'The separator must be bytes',
      desc: 'A str is a TypeError, as with every bytes method. Common when parsing code written for text is pointed at a file opened in binary mode.',
      wrong: { label: 'str rejected', code: "b'a=b'.partition('=')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'Bytes literal', code: "b'a=b'.partition(b'=')", output: "(b'a', b'=', b'b')" },
    },
  ],

  when: {
    use: [
      'Key-value parsing where malformed input must not crash',
      'Splitting a header from a body at the first delimiter',
      'Anywhere split(sep, 1) would need a length check afterwards',
    ],
    avoid: [
      'You want every field → split',
      'You want the LAST separator → rpartition',
      'The data is text → decode first and use str.partition',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; stops at the first match',
    return:     'A new three-item tuple of new bytes objects',
    cpython:    'Objects/bytesobject.c :: bytes_partition',
    memory:     'Allocates the tuple and up to three parts',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'str.partition',  slug: 'str-partition',  when: 'The text version of this method' },
    { name: 'bytes.split',    slug: 'bytes-split',    when: 'Every field rather than just the first split' },
    { name: 'str.rpartition', slug: 'str-rpartition', when: 'Split at the LAST occurrence — bytes has the same method' },
    { name: 'bytes.find',     slug: 'bytes-find',     when: 'Locate the separator without splitting' },
  ],

  faq: [
    {
      q: 'Why does a missing separator fill the head rather than the tail?',
      a: 'So that the head always means "everything up to the separator". With no separator, that is the whole input. It also makes data.partition(sep)[0] a safe way to take the prefix whether or not the separator exists.',
      code: "b'abc'.partition(b'=')\n# (b'abc', b'', b'')",
    },
    {
      q: 'How do I tell whether the separator was found?',
      a: 'Check the middle element. It is the separator itself when found and empty bytes when not — a much clearer test than inspecting the lengths of the other two parts.',
      code: "h, s, t = data.partition(b'=')\nfound = bool(s)",
    },
    {
      q: 'partition or split(sep, 1)?',
      a: 'partition, when unpacking. split with maxsplit gives one or two items depending on the input, so unpacking into two names crashes on a missing separator. partition always gives three.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.partition arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.partition',
    meta:  'bytes.partition',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
