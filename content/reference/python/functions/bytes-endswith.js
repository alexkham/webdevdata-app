// content/reference/python/functions/bytes-endswith.js

export const meta = {
  slug:        'bytes-endswith',
  name:        'bytes.endswith',
  signature:   'bytes.endswith(suffix[, start[, end]])',
  blurb:       'Does the buffer end with these bytes? Accepts a tuple of alternatives.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes endswith suffix trailer terminator extension check tuple binary footer bytearray bytearray.endswith',
};

export const method = {
  slug:      'bytes-endswith',
  name:      'bytes.endswith',
  signature: 'bytes.endswith(suffix[, start[, end]])',
  returns:   { type: 'bool', desc: 'True if the buffer ends with suffix. A tuple of suffixes returns True if ANY of them match.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The mirror of startswith. Most useful for terminators and trailers — checking a message ended cleanly, or that a file carries its expected footer.',

  cheat: {
    commonCall: "data.endswith(b'\\r\\n')",
    returns:    'bool — True or False, never an error',
    replaces:   'data[-len(suffix):] == suffix, which allocates and breaks on empty',
    watchOut:   'a LIST of suffixes is a TypeError; it must be a tuple',
  },

  parameters: [
    { name: 'suffix', type: 'bytes | tuple', required: true,  default: null,  desc: 'Bytes to test for, or a TUPLE of alternatives. A list raises TypeError.' },
    { name: 'start',  type: 'int',           required: false, default: '0',   desc: 'Byte offset to treat as the beginning of the region tested.' },
    { name: 'end',    type: 'int',           required: false, default: 'len', desc: 'Byte offset to treat as the END — the suffix is matched here, not at the real end.' },
  ],

  demoParams: [
    { name: 's',      type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'suffix', type: 'str', hint: 'suffix to test',          input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').endswith(bytes({suffix}, 'utf-8'))",
  cases: [
    { id: 'yes',     label: 'matches',        values: { s: 'abcdef', suffix: 'def' } },
    { id: 'no',      label: 'does not match', values: { s: 'abcdef', suffix: 'xyz' } },
    { id: 'whole',   label: 'entire buffer',  values: { s: 'abc',    suffix: 'abc' } },
    { id: 'empty',   label: 'empty suffix',   values: { s: 'abc',    suffix: '' } },
    { id: 'toolong', label: 'suffix too long',values: { s: 'ab',     suffix: 'abc' } },
  ],
  demoExplainer: 'A suffix test, byte for byte, returning True or False. The same two edge cases as startswith apply: an empty suffix is always True, and a suffix longer than the data is False rather than an error. Because it compares in place it is both faster and safer than negative slicing, which misbehaves when the suffix is empty.',

  patterns: [
    {
      name: 'Check a message terminator',
      desc: 'Confirms a protocol frame arrived complete.',
      code: "if buffer.endswith(b'\\r\\n'):\n    dispatch(buffer)",
    },
    {
      name: 'Match several extensions',
      desc: 'The tuple form replaces a chain of or clauses.',
      code: "if path_bytes.endswith((b'.jpg', b'.jpeg', b'.png')):\n    handle_image()",
    },
    {
      name: 'Verify a trailing signature',
      desc: 'Some formats put their marker at the end rather than the start.',
      code: "if data.endswith(ZIP_EOCD_MAGIC):\n    ...",
    },
  ],

  examples: [
    { title: 'Matches',        code: "b'abcdef'.endswith(b'def')", returns: 'True' },
    { title: 'Does not match', code: "b'abcdef'.endswith(b'xyz')", returns: 'False' },
    { title: 'Empty is always True', code: "b'abc'.endswith(b'')",  returns: 'True' },
    { title: 'Too long',       code: "b'ab'.endswith(b'abc')",      returns: 'False' },
    { title: 'Tuple of options', code: "b'a.png'.endswith((b'.jpg', b'.png'))", returns: 'True' },
    { title: 'end shifts the target', code: "b'abcdef'.endswith(b'cd', 0, 4)", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Negative slicing breaks on an empty suffix',
      desc: 'The reason to prefer this method. data[-0:] is the WHOLE buffer, not an empty slice, so the hand-rolled comparison gives False where endswith correctly gives True.',
      wrong: { label: 'Slicing misfires', code: "s = b''\nb'abc'[-len(s):] == s", output: 'False  # -0 slices everything' },
      fix:   { label: 'Use the method',   code: "b'abc'.endswith(b'')", output: 'True' },
    },
    {
      name: 'A list of suffixes is a TypeError',
      desc: 'Only a tuple is accepted, exactly as with startswith. Alternatives built dynamically usually arrive as a list and need converting.',
      wrong: { label: 'List rejected', code: "b'abc'.endswith([b'c'])", output: 'TypeError: endswith first arg must be bytes or a tuple of bytes, not list' },
      fix:   { label: 'Convert to tuple', code: "b'abc'.endswith(tuple(suffixes))", output: 'True' },
    },
    {
      name: 'end moves where the suffix is matched',
      desc: 'Unlike most methods, end does not merely bound a search — it redefines where the buffer is considered to finish, so the suffix is matched at that point.',
      wrong: { label: 'Not the real end', code: "b'abcdef'.endswith(b'ef', 0, 4)", output: 'False  # buffer treated as abcd' },
      fix:   { label: 'Match the new end', code: "b'abcdef'.endswith(b'cd', 0, 4)", output: 'True' },
    },
    {
      name: 'The suffix must be bytes',
      desc: 'A str raises rather than returning False. Checking a filename in bytes form against a str extension is the usual way this appears.',
      wrong: { label: 'str rejected', code: "b'a.png'.endswith('.png')", output: 'TypeError: endswith first arg must be bytes or a tuple of bytes, not str' },
      fix:   { label: 'Bytes literal', code: "b'a.png'.endswith(b'.png')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Confirming a message or frame terminator',
      'Matching one of several file extensions with the tuple form',
      'Verifying a trailing signature or footer',
    ],
    avoid: [
      'The match could be anywhere → rfind or the in operator',
      'The data is text → decode first and use str.endswith',
      'Removing the suffix → removesuffix does the test and the trim together',
    ],
  },

  notes: {
    complexity: 'O(len(suffix)) — stops at the first differing byte',
    return:     'A bool; never raises for a non-matching suffix',
    cpython:    'Objects/bytesobject.c :: bytes_endswith',
    memory:     'No allocation — unlike negative slicing, which copies',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.startswith', slug: 'bytes-startswith', when: 'Test the other end' },
    { name: 'endswith',         slug: 'endswith',         when: 'The str version of this method' },
    { name: 'str.removesuffix', slug: 'str-removesuffix', when: 'Test AND remove in one call — bytes has the same method' },
    { name: 'bytes',            slug: 'bytes',            when: 'Build the bytes in the first place' },
  ],

  faq: [
    {
      q: 'Why not just slice from the end?',
      a: 'Because data[-len(suffix):] breaks when the suffix is empty: -0 is 0, so the slice is the entire buffer and the comparison fails. endswith handles that correctly and avoids the allocation too.',
      code: "b'abc'.endswith(b'')   # True\nb'abc'[-0:] == b''     # False",
    },
    {
      q: 'What does the end argument really do?',
      a: 'It redefines where the buffer ends for the purposes of the test. endswith(b"cd", 0, 4) asks whether the first four bytes end with cd — useful for checking a fixed-width field without slicing it out.',
      code: "b'abcdef'.endswith(b'cd', 0, 4)\n# True",
    },
    {
      q: 'Should I use this to check file extensions?',
      a: 'For a quick test, yes, with a tuple of alternatives. For real path handling prefer pathlib, which understands case sensitivity and multiple suffixes rather than treating the name as a flat byte string.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.endswith arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.endswith',
    meta:  'bytes.endswith',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
