// content/reference/python/functions/bytes-strip.js

export const meta = {
  slug:        'bytes-strip',
  name:        'bytes.strip',
  signature:   'bytes.strip([chars])',
  blurb:       'Trim leading and trailing bytes — chars is a SET, not a sequence.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes strip trim whitespace lstrip rstrip remove leading trailing set binary bytearray bytearray.strip',
};

export const method = {
  slug:      'bytes-strip',
  name:      'bytes.strip',
  signature: 'bytes.strip([chars])',
  returns:   { type: 'bytes', desc: 'A new bytes object with leading and trailing bytes removed. Only the ends are touched; the middle is untouched.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The argument is a SET of bytes to remove, not a prefix to match. That one misunderstanding accounts for nearly every strip bug ever written.',

  cheat: {
    commonCall: 'data.strip()',
    returns:    'a new bytes object with the ends trimmed',
    replaces:   'manual index hunting at both ends',
    watchOut:   "strip(b'ab') removes any a and b, not the sequence 'ab'",
  },

  parameters: [
    { name: 'chars', type: 'bytes', required: false, default: 'None', desc: 'A SET of byte values to strip from both ends. Omitted or None strips ASCII whitespace: space, tab, newline, carriage return, vertical tab and form feed.' },
  ],

  demoParams: [
    { name: 's',     type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'chars', type: 'str', hint: 'byte values to strip',    input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').strip(bytes({chars}, 'utf-8'))",
  cases: [
    { id: 'both',    label: 'both ends',        values: { s: 'xxabxx', chars: 'x' } },
    { id: 'set',     label: 'set, not sequence',values: { s: 'abcba',  chars: 'ab' } },
    { id: 'none',    label: 'nothing to strip', values: { s: 'abc',    chars: 'z' } },
    { id: 'middle',  label: 'middle untouched', values: { s: 'xaxbx',  chars: 'x' } },
    { id: 'all',     label: 'strips everything',values: { s: 'aaa',    chars: 'a' } },
  ],
  demoExplainer: 'The second case is the one to study. Stripping "ab" from "abcba" gives "c" — it removed a, then b from the front, and a, then b from the back, because the argument is a SET of bytes to keep removing while they match. It is not a prefix or suffix. The middle case shows the other half of the rule: only the ends are considered, so an x between other bytes survives.',

  patterns: [
    {
      name: 'Trim a line read in binary mode',
      desc: 'The default form removes CR and LF together, which handles both line-ending styles.',
      code: 'clean = raw_line.strip()',
    },
    {
      name: 'Strip padding bytes',
      desc: 'Fixed-width binary fields are often null-padded.',
      code: "value = field.strip(b'\\x00')",
    },
    {
      name: 'Trim one end only',
      desc: 'lstrip and rstrip take the same set argument.',
      code: "data.rstrip(b'\\n')",
    },
  ],

  examples: [
    { title: 'Both ends',       code: "b'xxabxx'.strip(b'x')", returns: "b'ab'" },
    { title: 'Set, not sequence', code: "b'abcba'.strip(b'ab')", returns: "b'c'" },
    { title: 'Default whitespace', code: "b'  ab  '.strip()",  returns: "b'ab'" },
    { title: 'Nothing matches', code: "b'abc'.strip(b'z')",    returns: "b'abc'" },
    { title: 'Middle survives', code: "b'xaxbx'.strip(b'x')",  returns: "b'axb'" },
    { title: 'Everything goes', code: "b'aaa'.strip(b'a')",    returns: "b''" },
  ],

  pitfalls: [
    {
      name: 'chars is a SET, not a prefix',
      desc: 'The most common misunderstanding in the whole language. strip keeps removing any byte that appears in the argument, so passing a word removes its letters individually from both ends.',
      wrong: { label: 'Removes letters', code: "b'testfile.txt'.strip(b'.txt')", output: "b'estfile'  # t, x and . all stripped" },
      fix:   { label: 'Use removesuffix', code: "b'testfile.txt'.removesuffix(b'.txt')", output: "b'testfile'" },
    },
    {
      name: 'It only touches the ends',
      desc: 'Bytes in the middle are never removed, however many times they appear in the set. Reaching for strip to delete a byte everywhere silently leaves the interior untouched.',
      wrong: { label: 'Middle kept', code: "b'xaxbx'.strip(b'x')", output: "b'axb'" },
      fix:   { label: 'Use replace', code: "b'xaxbx'.replace(b'x', b'')", output: "b'ab'" },
    },
    {
      name: 'The argument must be bytes',
      desc: 'A str raises, like every bytes method. The default no-argument form is fine, which is why this often surfaces only once someone adds an explicit set.',
      wrong: { label: 'str rejected', code: "b'xxa'.strip('x')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'Bytes literal', code: "b'xxa'.strip(b'x')", output: "b'a'" },
    },
    {
      name: 'It returns a new object',
      desc: 'Bytes are immutable, so the result must be assigned. Calling strip for its supposed side effect does nothing.',
      wrong: { label: 'Result dropped', code: 'data.strip()\ndata', output: 'unchanged' },
      fix:   { label: 'Assign it',      code: 'data = data.strip()', output: 'trimmed' },
    },
  ],

  when: {
    use: [
      'Trimming whitespace or line endings from binary-mode input',
      'Removing padding bytes from fixed-width fields',
      'Cleaning the ends of a token before parsing it',
    ],
    avoid: [
      'Removing a known prefix or suffix → removeprefix and removesuffix',
      'Removing a byte everywhere → replace',
      'The data is text → decode first and use str.strip',
    ],
  },

  notes: {
    complexity: 'O(n) worst case, but usually only a few bytes at each end',
    return:     'A new bytes object; CPython may return the original when nothing was trimmed',
    cpython:    'Objects/bytesobject.c :: bytes_strip',
    memory:     'Allocates the trimmed result',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'strip',              slug: 'strip',              when: 'The str version of this method' },
    { name: 'str.removeprefix',   slug: 'str-removeprefix',   when: 'Remove an exact prefix rather than a set — bytes has the same method' },
    { name: 'bytes.replace',      slug: 'bytes-replace',      when: 'Remove a byte everywhere, not just at the ends' },
    { name: 'bytes.split',        slug: 'bytes-split',        when: 'Break the buffer up instead of trimming it' },
  ],

  faq: [
    {
      q: "Why does strip(b'.txt') mangle my filename?",
      a: 'Because it strips the SET of bytes dot, t, x — not the suffix. Any of those at either end is removed, repeatedly, until something else appears. removesuffix is what you actually wanted.',
      code: "b'testfile.txt'.removesuffix(b'.txt')",
    },
    {
      q: 'What counts as whitespace for the default form?',
      a: 'ASCII space, tab, newline, carriage return, vertical tab and form feed. Because it includes both CR and LF, a plain strip() cleans up Windows and Unix line endings alike.',
      code: "b'line\\r\\n'.strip()\n# b'line'",
    },
    {
      q: 'How do I strip only one end?',
      a: 'lstrip trims the left, rstrip the right, and both take the same set argument. rstrip is the usual choice for line endings when leading whitespace is meaningful.',
      code: "data.rstrip(b'\\r\\n')",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.strip arrived with the bytes type in the text/binary split.' },
    { version: '3.9', note: 'removeprefix and removesuffix added, giving the exact-match behaviour people often wanted from strip.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.strip',
    meta:  'bytes.strip',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
