// content/reference/python/functions/bytes-lstrip.js

export const meta = {
  slug:        'bytes-lstrip',
  name:        'bytes.lstrip',
  signature:   'bytes.lstrip([chars])',
  blurb:       'Trim the LEFT end only — chars is a set of bytes, not a prefix.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes lstrip left strip trim leading whitespace set prefix binary bytearray bytearray.lstrip',
};

export const method = {
  slug:      'bytes-lstrip',
  name:      'bytes.lstrip',
  signature: 'bytes.lstrip([chars])',
  returns:   { type: 'bytes', desc: 'A new bytes object with leading bytes removed. The right end is untouched.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Half of strip. Same set-not-sequence rule for the argument, applied to the left end only.',

  cheat: {
    commonCall: 'data.lstrip()',
    returns:    'a new bytes object with the left end trimmed',
    replaces:   'scanning for the first byte not in a set',
    watchOut:   "lstrip(b'ab') removes any leading a or b bytes, not the sequence ab",
  },

  parameters: [
    { name: 'chars', type: 'bytes', required: false, default: 'None', desc: 'A SET of byte values to strip from the left. Omitted or None strips ASCII whitespace.' },
  ],

  demoParams: [
    { name: 's',     type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'chars', type: 'str', hint: 'byte values to strip',    input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').lstrip(bytes({chars}, 'utf-8'))",
  cases: [
    { id: 'left',    label: 'left only',        values: { s: 'xxabxx', chars: 'x' } },
    { id: 'set',     label: 'set, not sequence',values: { s: 'abcba',  chars: 'ab' } },
    { id: 'none',    label: 'nothing to strip', values: { s: 'abc',    chars: 'z' } },
    { id: 'all',     label: 'strips everything',values: { s: 'aaa',    chars: 'a' } },
    { id: 'empty',   label: 'empty data',       values: { s: '',       chars: 'x' } },
  ],
  demoExplainer: 'Only the left end is touched — xxabxx becomes abxx, with the trailing x bytes kept. The second case shows the set rule: stripping "ab" from "abcba" removes a then b from the front and stops at c, leaving cba. It is a set of bytes to keep removing while they match, not a prefix to match once.',

  patterns: [
    {
      name: 'Remove leading whitespace only',
      desc: 'Keeps a trailing newline that a later step may need.',
      code: 'body = line.lstrip()',
    },
    {
      name: 'Skip leading padding bytes',
      desc: 'Fixed-width fields sometimes left-pad with nulls or zeros.',
      code: "value = field.lstrip(b'0')",
    },
    {
      name: 'Remove an exact prefix instead',
      desc: 'When you mean a specific sequence, removeprefix is the tool.',
      code: "data.removeprefix(b'http://')",
    },
  ],

  examples: [
    { title: 'Left only',       code: "b'xxabxx'.lstrip(b'x')", returns: "b'abxx'" },
    { title: 'Set, not sequence', code: "b'abcba'.lstrip(b'ab')", returns: "b'cba'" },
    { title: 'Default whitespace', code: "b'  ab  '.lstrip()",  returns: "b'ab  '" },
    { title: 'Nothing matches', code: "b'abc'.lstrip(b'z')",    returns: "b'abc'" },
    { title: 'Everything goes', code: "b'aaa'.lstrip(b'a')",    returns: "b''" },
    { title: 'Empty',           code: "b''.lstrip(b'x')",       returns: "b''" },
  ],

  pitfalls: [
    {
      name: 'chars is a SET, not a prefix',
      desc: 'The classic strip mistake. Passing a word removes its letters one at a time from the left until something else appears — not the word itself.',
      wrong: { label: 'Letters removed', code: "b'http://x'.lstrip(b'http://')", output: "b'x'  # the h,t,p,:,/ bytes all stripped" },
      fix:   { label: 'Use removeprefix', code: "b'http://x'.removeprefix(b'http://')", output: "b'x'  # same here, but differs on b'https://x'" },
    },
    {
      name: 'It only touches the left end',
      desc: 'Trailing bytes in the set survive. Reaching for lstrip to clean both ends leaves the right side dirty.',
      wrong: { label: 'Right kept', code: "b'xxabxx'.lstrip(b'x')", output: "b'abxx'" },
      fix:   { label: 'Use strip',  code: "b'xxabxx'.strip(b'x')", output: "b'ab'" },
    },
    {
      name: 'The argument must be bytes',
      desc: 'A str raises. The no-argument form is fine, so this often appears only when an explicit set is added.',
      wrong: { label: 'str rejected', code: "b'xxa'.lstrip('x')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'Bytes literal', code: "b'xxa'.lstrip(b'x')", output: "b'a'" },
    },
  ],

  when: {
    use: [
      'Removing leading whitespace while keeping the end intact',
      'Skipping leading padding in a fixed-width field',
    ],
    avoid: [
      'Removing a known prefix → removeprefix',
      'Cleaning both ends → strip',
      'Removing bytes from the middle → replace',
    ],
  },

  notes: {
    complexity: 'O(n) worst case, usually a few bytes at the left end',
    return:     'A new bytes object; the original when nothing was trimmed',
    cpython:    'Objects/bytesobject.c :: bytes_lstrip',
    memory:     'Allocates the trimmed result',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.strip',        slug: 'bytes-strip',        when: 'Trim both ends' },
    { name: 'bytes.rstrip',       slug: 'bytes-rstrip',       when: 'Trim the right end only' },
    { name: 'bytes.removeprefix', slug: 'bytes-removeprefix', when: 'Remove an exact prefix rather than a set' },
    { name: 'str.lstrip',         slug: 'str-lstrip',         when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'Why does lstrip(b"http://") mangle my URL?',
      a: 'Because it strips the SET of bytes h, t, p, colon and slash from the left, repeatedly. On b"http://x" that happens to give b"x". On b"https://x" it strips h, t, t, p and then stops at the s — which is not in the set — leaving the mangled b"s://x". removeprefix matches the exact sequence and is what you want.',
      code: "b'https://x'.lstrip(b'http://')        # b's://x' — mangled\nb'https://x'.removeprefix(b'http://')  # b'https://x' — unchanged, correct",
    },
    {
      q: 'What does the default strip?',
      a: 'ASCII whitespace: space, tab, newline, carriage return, vertical tab and form feed. Only from the left.',
    },
    {
      q: 'Does bytearray have lstrip?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.lstrip arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.lstrip',
    meta:  'bytes.lstrip',
  },

};
