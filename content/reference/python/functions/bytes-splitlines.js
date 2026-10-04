// content/reference/python/functions/bytes-splitlines.js

export const meta = {
  slug:        'bytes-splitlines',
  name:        'bytes.splitlines',
  signature:   'bytes.splitlines(keepends=False)',
  blurb:       'Split on line endings — but ONLY \\n, \\r and \\r\\n, unlike the str version.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes splitlines lines newline crlf line ending universal keepends binary bytearray bytearray.splitlines',
};

export const method = {
  slug:      'bytes-splitlines',
  name:      'bytes.splitlines',
  signature: 'bytes.splitlines(keepends=False)',
  returns:   { type: 'list', desc: 'A list of lines with the terminators removed, unless keepends is True. A trailing terminator does not produce an empty final line.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The right way to split binary-mode lines, because it handles CRLF. But it recognises only three terminators, where str.splitlines recognises a dozen — a real, documented difference.',

  cheat: {
    commonCall: 'lines = data.splitlines()',
    returns:    'list of bytes, terminators stripped',
    replaces:   "split(b'\\n') followed by rstrip(b'\\r') on every line",
    watchOut:   "bytes splits ONLY on \\n, \\r, \\r\\n — not \\x0b, \\x0c, \\x1c, \\x85",
  },

  parameters: [
    { name: 'keepends', type: 'bool', required: false, default: 'False', desc: 'When True, each line keeps its own terminator, so joining the parts reproduces the original exactly.' },
  ],

  demoParams: [
    { name: 's', type: 'str', hint: 'data with line breaks (encoded as utf-8)', input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').splitlines()",
  cases: [
    { id: 'mixed',    label: 'LF and CRLF',     values: { s: 'a\nb\r\nc' } },
    { id: 'trailing', label: 'trailing newline',values: { s: 'a\nb\n' } },
    { id: 'blank',    label: 'blank line kept', values: { s: 'a\n\nb' } },
    { id: 'exotic',   label: 'exotic — NOT split (!)', values: { s: 'a\x0bb\x0cc' } },
    { id: 'empty',    label: 'empty',           values: { s: '' } },
  ],
  demoExplainer: 'Both LF and CRLF are recognised and removed, so a\\nb\\r\\nc gives three clean lines. A trailing terminator does NOT create an empty last element — a\\nb\\n gives two lines, not three — while a blank line in the middle IS kept as an empty element. The exotic case is the one that separates bytes from str: vertical tab and form feed are line breaks to str.splitlines but not to bytes.splitlines, so the data comes back as a single line.',

  patterns: [
    {
      name: 'Split a binary-mode file into lines',
      desc: 'Handles Windows and Unix endings in one call.',
      code: "with open(path, 'rb') as f:\n    lines = f.read().splitlines()",
    },
    {
      name: 'Round-trip with keepends',
      desc: 'Lines keep their terminators, so joining restores the original.',
      code: "parts = data.splitlines(keepends=True)\nassert b''.join(parts) == data",
    },
    {
      name: 'Count lines',
      desc: 'A trailing newline does not inflate the count.',
      code: 'n = len(data.splitlines())',
    },
  ],

  examples: [
    { title: 'LF and CRLF',     code: "b'a\\nb\\r\\nc'.splitlines()",       returns: "[b'a', b'b', b'c']" },
    { title: 'keepends',        code: "b'a\\nb\\r\\nc'.splitlines(True)",   returns: "[b'a\\n', b'b\\r\\n', b'c']" },
    { title: 'Trailing newline',code: "b'a\\nb\\n'.splitlines()",           returns: "[b'a', b'b']" },
    { title: 'split differs',   code: "b'a\\nb\\n'.split(b'\\n')",          returns: "[b'a', b'b', b'']  # extra empty" },
    { title: 'Exotic not split',code: "b'a\\x0bb'.splitlines()",            returns: "[b'a\\x0bb']" },
    { title: 'str DOES split',  code: "'a\\x0bb'.splitlines()",             returns: "['a', 'b']" },
  ],

  pitfalls: [
    {
      name: 'bytes and str disagree on what a line break is',
      desc: 'str.splitlines treats vertical tab, form feed, file/group/record separators, NEL and the Unicode line and paragraph separators as line breaks. bytes.splitlines recognises only \\n, \\r and \\r\\n. The same data decodes into a different number of lines.',
      wrong: { label: 'Different counts', code: "len(b'a\\x0cb'.splitlines()), len('a\\x0cb'.splitlines())", output: '(1, 2)' },
      fix:   { label: 'Pick one domain',  code: "data.decode().splitlines()   # if you want the str rules", output: 'consistent' },
    },
    {
      name: 'A trailing newline does not give an empty last line',
      desc: 'Opposite to split(b"\\n"), which produces a trailing empty element. Code expecting the extra element, or expecting its absence, will be off by one depending on which method it assumed.',
      wrong: { label: 'split has extra', code: "b'a\\n'.split(b'\\n')", output: "[b'a', b'']" },
      fix:   { label: 'splitlines does not', code: "b'a\\n'.splitlines()", output: "[b'a']" },
    },
    {
      name: 'A bare \\r is a line break',
      desc: 'Old Mac endings and stray carriage returns split lines on their own. Data that mixes CR into content, such as progress output, breaks into more lines than expected.',
      wrong: { label: 'Splits on CR', code: "b'50%\\r100%'.splitlines()", output: "[b'50%', b'100%']" },
      fix:   { label: 'Split on LF only', code: "b'50%\\r100%'.split(b'\\n')", output: "[b'50%\\r100%']" },
    },
  ],

  when: {
    use: [
      'Splitting binary-mode file or socket data into lines',
      'Handling mixed LF and CRLF without normalising first',
      'Counting lines without the trailing-newline off-by-one',
    ],
    avoid: [
      'You need the str set of line breaks → decode first',
      'A bare \\r must NOT split → split(b"\\n") and rstrip',
      'You need the empty trailing element that split gives',
    ],
  },

  notes: {
    complexity: 'O(n) — one scan, plus an allocation per line',
    return:     'A new list of new bytes objects',
    cpython:    'Objects/bytesobject.c :: stringlib_splitlines',
    memory:     'Allocates the list and every line',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'str.splitlines', slug: 'str-splitlines', when: 'The str version, with the wider set of terminators' },
    { name: 'bytes.split',    slug: 'bytes-split',    when: 'Split on one explicit separator' },
    { name: 'bytes.rstrip',   slug: 'bytes-rstrip',   when: 'Trim a terminator from a single line' },
    { name: 'bytes.join',     slug: 'bytes-join',     when: 'Put the lines back together' },
  ],

  faq: [
    {
      q: 'Why does bytes.splitlines recognise fewer terminators than str.splitlines?',
      a: 'Because bytes have no notion of Unicode, and most of the extra terminators are Unicode or control characters whose meaning depends on the encoding. The bytes version sticks to the three ASCII line endings every format agrees on. It is documented, but easy to miss.',
      code: "b'a\\x0cb'.splitlines()   # [b'a\\x0cb']\n'a\\x0cb'.splitlines()    # ['a', 'b']",
    },
    {
      q: 'Why is there no empty element for a trailing newline?',
      a: 'Because a terminator ENDS a line rather than separating lines, so a final newline closes the last line and starts nothing new. That is also why the line count is not inflated. split treats the same byte as a separator and produces the extra element.',
    },
    {
      q: 'Does bytearray have splitlines?',
      a: 'Yes, with identical behaviour, returning a list of bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.splitlines arrived with the bytes type in the text/binary split.' },
    { version: '3.2', note: 'keepends became usable as a keyword argument.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.splitlines',
    meta:  'bytes.splitlines',
  },

};
