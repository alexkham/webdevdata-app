// content/reference/python/functions/bytes-split.js

export const meta = {
  slug:        'bytes-split',
  name:        'bytes.split',
  signature:   'bytes.split(sep=None, maxsplit=-1)',
  blurb:       'Break a buffer apart on a separator, giving a list of bytes objects.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes split separator delimiter parse tokens records lines binary maxsplit bytearray bytearray.split',
};

export const method = {
  slug:      'bytes-split',
  name:      'bytes.split',
  signature: 'bytes.split(sep=None, maxsplit=-1)',
  returns:   { type: 'list', desc: 'A list of bytes objects. Always contains at least one item — the whole input when the separator is absent.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The workhorse for chopping up binary records. Note that splitting on a missing separator is not an error — you get a one-item list back.',

  cheat: {
    commonCall: "data.split(b'\\n')",
    returns:    'list of bytes; never empty',
    replaces:   'a manual find-and-slice loop',
    watchOut:   "an empty separator raises; data.split('') is doubly wrong",
  },

  parameters: [
    { name: 'sep',      type: 'bytes | None', required: false, default: 'None', desc: 'Separator to split on. Omitted or None splits on runs of ASCII whitespace and drops empty parts.' },
    { name: 'maxsplit', type: 'int',          required: false, default: '-1',   desc: 'Maximum number of splits. The remainder stays in the final element. Negative means no limit.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sep', type: 'str', hint: 'separator',               input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').split(bytes({sep}, 'utf-8'))",
  cases: [
    { id: 'commas',  label: 'comma separated', values: { s: 'a,b,c', sep: ',' } },
    { id: 'absent',  label: 'separator absent', values: { s: 'abc',  sep: ',' } },
    { id: 'empty',   label: 'empty data',      values: { s: '',      sep: ',' } },
    { id: 'adjacent',label: 'adjacent separators', values: { s: 'a,,b', sep: ',' } },
    { id: 'badsep',  label: 'empty separator', values: { s: 'abc',   sep: '' } },
  ],
  demoExplainer: 'Splitting on an explicit separator keeps every field, including empty ones — "a,,b" gives three parts with an empty middle. A separator that is not present is not an error: you get a single-item list holding the whole input, which is what makes unpacking into a fixed number of names fail unpredictably. An empty separator is a ValueError, because it would produce an infinite number of splits.',

  patterns: [
    {
      name: 'Split lines from a binary read',
      desc: 'Files opened in binary mode give bytes, so the separator must be bytes too.',
      code: "lines = data.split(b'\\n')",
    },
    {
      name: 'Split off a header once',
      desc: 'maxsplit stops after the first separator, keeping the rest intact.',
      code: "head, body = data.split(b'\\r\\n\\r\\n', 1)",
    },
    {
      name: 'Tokenise on whitespace',
      desc: 'The no-argument form collapses runs and drops empties.',
      code: 'fields = data.split()',
    },
  ],

  examples: [
    { title: 'Comma separated', code: "b'a,b,c'.split(b',')",  returns: "[b'a', b'b', b'c']" },
    { title: 'Absent separator',code: "b'abc'.split(b',')",    returns: "[b'abc']" },
    { title: 'Empty input',     code: "b''.split(b',')",       returns: "[b'']" },
    { title: 'Adjacent keeps empties', code: "b'a,,b'.split(b',')", returns: "[b'a', b'', b'b']" },
    { title: 'Whitespace form', code: "b' a  b '.split()",     returns: "[b'a', b'b']" },
    { title: 'Empty separator', code: "b'abc'.split(b'')",     returns: 'ValueError: empty separator' },
  ],

  pitfalls: [
    {
      name: 'A missing separator gives one item, not an error',
      desc: 'Unpacking into a fixed number of names then fails with a confusing message about values to unpack, pointing at the assignment rather than at the malformed input.',
      wrong: { label: 'Unpack fails', code: "k, v = b'novalue'.split(b'=')", output: 'ValueError: not enough values to unpack (expected 2, got 1)' },
      fix:   { label: 'Use partition', code: "k, sep, v = b'novalue'.partition(b'=')", output: 'always three parts' },
    },
    {
      name: 'Explicit separators keep empty fields',
      desc: 'Only the no-argument whitespace form collapses runs. Splitting "a,,b" on a comma deliberately keeps the empty middle field, which is right for CSV and surprising everywhere else.',
      wrong: { label: 'Empty field kept', code: "b'a,,b'.split(b',')", output: "[b'a', b'', b'b']" },
      fix:   { label: 'Filter them out', code: "[p for p in b'a,,b'.split(b',') if p]", output: "[b'a', b'b']" },
    },
    {
      name: 'The separator must be bytes',
      desc: 'Passing a str is a TypeError. This bites constantly when a file is opened in binary mode but the parsing code was written for text.',
      wrong: { label: 'str rejected', code: "b'a,b'.split(',')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'Use a bytes literal', code: "b'a,b'.split(b',')", output: "[b'a', b'b']" },
    },
    {
      name: 'An empty separator raises',
      desc: 'There is no sensible answer, so Python refuses rather than inventing one. A separator built from a variable that turned out empty fails here rather than where it was set.',
      wrong: { label: 'No answer possible', code: "b'abc'.split(b'')", output: 'ValueError: empty separator' },
      fix:   { label: 'Guard it', code: "parts = data.split(sep) if sep else [data]", output: 'explicit' },
    },
  ],

  when: {
    use: [
      'Chopping a binary payload into records or lines',
      'Parsing simple delimited formats read in binary mode',
      'Splitting off a header with maxsplit',
    ],
    avoid: [
      'The data is text → decode first and use str.split',
      'You want exactly two parts → partition, which never fails to unpack',
      'Line splitting that must handle CRLF → splitlines',
    ],
  },

  notes: {
    complexity: 'O(n) — one scan, plus an allocation per part',
    return:     'A new list of new bytes objects; the original is unchanged',
    cpython:    'Objects/bytesobject.c :: bytes_split',
    memory:     'Allocates the list and every part; splitting a huge buffer doubles memory',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'split',           slug: 'split',           when: 'The str version of this method' },
    { name: 'bytes.join',      slug: 'bytes-join',      when: 'The inverse — put the parts back together' },
    { name: 'bytes.partition', slug: 'bytes-partition', when: 'Exactly two parts, with no unpacking risk' },
    { name: 'bytes.find',      slug: 'bytes-find',      when: 'Locate a separator without splitting' },
  ],

  faq: [
    {
      q: 'Why does splitting an empty buffer give one empty item?',
      a: "Because there is one field, and it happens to be empty. b''.split(b',') is [b''], not []. The rule is that an explicit separator always produces one more part than there are separators.",
      code: "b''.split(b',')\n# [b'']",
    },
    {
      q: 'How do I split on any of several separators?',
      a: 'split takes only one. Use re.split with a bytes pattern, or translate the alternatives into a single separator first and then split once.',
      code: "import re\nre.split(rb'[,;]', data)",
    },
    {
      q: 'Should I use split or splitlines for lines?',
      a: "splitlines, if the data might contain CRLF or other line terminators — it handles them all and drops the trailing empty part. split(b'\\n') leaves stray carriage returns on the end of every line in Windows-format data.",
      code: 'data.splitlines()',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.split arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.split',
    meta:  'bytes.split',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
