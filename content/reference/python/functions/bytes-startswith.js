// content/reference/python/functions/bytes-startswith.js

export const meta = {
  slug:        'bytes-startswith',
  name:        'bytes.startswith',
  signature:   'bytes.startswith(prefix[, start[, end]])',
  blurb:       'Does the buffer begin with these bytes? Accepts a tuple of alternatives.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes startswith prefix magic number signature file format detect header tuple bytearray bytearray.startswith',
};

export const method = {
  slug:      'bytes-startswith',
  name:      'bytes.startswith',
  signature: 'bytes.startswith(prefix[, start[, end]])',
  returns:   { type: 'bool', desc: 'True if the buffer begins with prefix. A tuple of prefixes returns True if ANY of them match.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The standard way to sniff a file format from its magic number. The tuple form checks several signatures in one call.',

  cheat: {
    commonCall: "data.startswith(b'\\x89PNG')",
    returns:    'bool — True or False, never an error for a missing prefix',
    replaces:   'data[:len(prefix)] == prefix, which allocates a slice',
    watchOut:   'a LIST of prefixes is a TypeError; it must be a tuple',
  },

  parameters: [
    { name: 'prefix', type: 'bytes | tuple', required: true,  default: null,  desc: 'Bytes to test for, or a TUPLE of alternatives. A list raises TypeError.' },
    { name: 'start',  type: 'int',           required: false, default: '0',   desc: 'Byte offset to test from, as though the buffer began there.' },
    { name: 'end',    type: 'int',           required: false, default: 'len', desc: 'Byte offset to stop at, exclusive.' },
  ],

  demoParams: [
    { name: 's',      type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'prefix', type: 'str', hint: 'prefix to test',          input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').startswith(bytes({prefix}, 'utf-8'))",
  cases: [
    { id: 'yes',     label: 'matches',        values: { s: 'abcdef', prefix: 'abc' } },
    { id: 'no',      label: 'does not match', values: { s: 'abcdef', prefix: 'xyz' } },
    { id: 'whole',   label: 'entire buffer',  values: { s: 'abc',    prefix: 'abc' } },
    { id: 'empty',   label: 'empty prefix',   values: { s: 'abc',    prefix: '' } },
    { id: 'toolong', label: 'prefix too long',values: { s: 'ab',     prefix: 'abc' } },
  ],
  demoExplainer: 'A straightforward prefix test returning True or False. Two edge cases are worth knowing: the empty prefix is always True, because every buffer begins with nothing, and a prefix longer than the data is simply False rather than an error. Comparison is byte for byte, so this is exactly what you want for checking file signatures.',

  patterns: [
    {
      name: 'Detect a file format',
      desc: 'Magic numbers at the head of a file identify its type.',
      code: "if data.startswith(b'\\x89PNG\\r\\n\\x1a\\n'):\n    kind = 'png'",
    },
    {
      name: 'Check several signatures at once',
      desc: 'The tuple form avoids a chain of or clauses.',
      code: "if data.startswith((b'GIF87a', b'GIF89a')):\n    kind = 'gif'",
    },
    {
      name: 'Skip a known header',
      desc: 'Test then slice past it.',
      code: "if data.startswith(MAGIC):\n    body = data[len(MAGIC):]",
    },
  ],

  examples: [
    { title: 'Matches',        code: "b'abcdef'.startswith(b'abc')", returns: 'True' },
    { title: 'Does not match', code: "b'abcdef'.startswith(b'xyz')", returns: 'False' },
    { title: 'Empty is always True', code: "b'abc'.startswith(b'')", returns: 'True' },
    { title: 'Too long',       code: "b'ab'.startswith(b'abc')",     returns: 'False' },
    { title: 'Tuple of options', code: "b'abc'.startswith((b'x', b'ab'))", returns: 'True' },
    { title: 'From an offset', code: "b'abcdef'.startswith(b'cd', 2)", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'A list of prefixes is a TypeError',
      desc: 'Only a tuple works. The distinction looks arbitrary and catches people building the alternatives dynamically, since a list comprehension is the natural way to produce them.',
      wrong: { label: 'List rejected', code: "b'abc'.startswith([b'a', b'b'])", output: 'TypeError: startswith first arg must be bytes or a tuple of bytes, not list' },
      fix:   { label: 'Convert to tuple', code: "b'abc'.startswith(tuple(prefixes))", output: 'True' },
    },
    {
      name: 'The empty prefix is always True',
      desc: 'Every buffer begins with nothing, so an accidentally empty prefix makes every test pass. This turns a format check into a no-op that silently accepts everything.',
      wrong: { label: 'Always passes', code: "b'abc'.startswith(b'')", output: 'True' },
      fix:   { label: 'Require a prefix', code: 'if prefix and data.startswith(prefix):', output: 'meaningful' },
    },
    {
      name: 'The prefix must be bytes',
      desc: 'A str raises rather than comparing as False, which is at least loud. It is the usual failure when text-oriented code meets a file opened in binary mode.',
      wrong: { label: 'str rejected', code: "b'abc'.startswith('abc')", output: 'TypeError: startswith first arg must be bytes or a tuple of bytes, not str' },
      fix:   { label: 'Bytes literal', code: "b'abc'.startswith(b'abc')", output: 'True' },
    },
    {
      name: 'start shifts the test, not just the search',
      desc: 'With a start offset the method behaves as though the buffer began there, so the prefix is matched at that position rather than anywhere after it.',
      wrong: { label: 'Not a search', code: "b'abcdef'.startswith(b'cd', 1)", output: 'False  # position 1 is b' },
      fix:   { label: 'Correct offset', code: "b'abcdef'.startswith(b'cd', 2)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Identifying a file format from its magic number',
      'Checking a protocol header or record marker',
      'Testing several possible signatures with the tuple form',
    ],
    avoid: [
      'The match could be anywhere → find or the in operator',
      'The data is text → decode first and use str.startswith',
      'You need the matched length → compare against the prefix directly',
    ],
  },

  notes: {
    complexity: 'O(len(prefix)) — stops at the first differing byte',
    return:     'A bool; never raises for a non-matching prefix',
    cpython:    'Objects/bytesobject.c :: bytes_startswith',
    memory:     'No allocation — unlike slicing, which copies',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.endswith', slug: 'bytes-endswith', when: 'Test the other end' },
    { name: 'startswith',     slug: 'startswith',     when: 'The str version of this method' },
    { name: 'bytes.find',     slug: 'bytes-find',     when: 'The match could be anywhere' },
    { name: 'bytes',          slug: 'bytes',          when: 'Build the bytes in the first place' },
  ],

  faq: [
    {
      q: 'Why a tuple and not a list?',
      a: 'Historical, and now fixed by the API. A tuple signals a fixed set of alternatives, and it is hashable so CPython can treat it as a constant. If your prefixes come from a list, wrap it with tuple().',
      code: 'data.startswith(tuple(prefixes))',
    },
    {
      q: 'Is it faster than slicing?',
      a: 'Yes, and it avoids an allocation. data[:3] == prefix builds a new three-byte object first; startswith compares in place and stops at the first mismatch.',
    },
    {
      q: 'How do I detect common file types?',
      a: 'Test the magic number at the head. PNG starts with \\x89PNG\\r\\n\\x1a\\n, GIF with GIF87a or GIF89a, PDF with %PDF, and ZIP with PK\\x03\\x04. The tuple form checks several in one call.',
      code: "data.startswith((b'GIF87a', b'GIF89a'))",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.startswith arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.startswith',
    meta:  'bytes.startswith',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect file headers' },
  ],
};
