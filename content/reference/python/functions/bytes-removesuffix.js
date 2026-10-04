// content/reference/python/functions/bytes-removesuffix.js

export const meta = {
  slug:        'bytes-removesuffix',
  name:        'bytes.removesuffix',
  signature:   'bytes.removesuffix(suffix)',
  blurb:       'Remove an exact suffix if present — the fix for the rstrip trap.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'bytes removesuffix strip suffix remove end extension exact sequence rstrip alternative binary bytearray bytearray.removesuffix',
};

export const method = {
  slug:      'bytes-removesuffix',
  name:      'bytes.removesuffix',
  signature: 'bytes.removesuffix(suffix)',
  returns:   { type: 'bytes', desc: 'The data with suffix removed from the end if it is there — otherwise the data unchanged. Never raises for a missing suffix.' },

  category:    'Bytes method',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'The mirror of removeprefix, and the correct tool for file extensions. Matches the exact sequence, once, and is a no-op when absent.',

  cheat: {
    commonCall: "name.removesuffix(b'.txt')",
    returns:    'a new bytes object, or the original when the suffix is absent',
    replaces:   "data[:-len(s)] if s and data.endswith(s) else data",
    watchOut:   'removes ONCE — and the pre-3.9 idiom breaks on an empty suffix',
  },

  parameters: [
    { name: 'suffix', type: 'bytes', required: true, default: null, desc: 'The exact byte sequence to remove from the end. An empty suffix is a harmless no-op.' },
  ],

  demoParams: [
    { name: 's',      type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'suffix', type: 'str', hint: 'suffix to remove',        input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').removesuffix(bytes({suffix}, 'utf-8'))",
  cases: [
    { id: 'present', label: 'suffix present',   values: { s: 'file.txt',  suffix: '.txt' } },
    { id: 'absent',  label: 'suffix absent',    values: { s: 'file.csv',  suffix: '.txt' } },
    { id: 'tricky',  label: 'rstrip would break', values: { s: 'text.txt', suffix: '.txt' } },
    { id: 'double',  label: 'removes once (!)', values: { s: 'namexx',    suffix: 'x' } },
    { id: 'whole',   label: 'entire data',      values: { s: 'abc',       suffix: 'abc' } },
  ],
  demoExplainer: 'When the data ends with the exact suffix it is removed; otherwise the data is returned unchanged. The third case is the one that justifies the method: text.txt becomes text, where rstrip(b".txt") would have chewed through to te because it strips a set of bytes. The doubled case shows the "once" rule — namexx with suffix x loses one x.',

  patterns: [
    {
      name: 'Strip a file extension',
      desc: 'The canonical use, and the one rstrip gets wrong.',
      code: "stem = filename.removesuffix(b'.txt')",
    },
    {
      name: 'Drop a trailing terminator',
      desc: 'Exact match, so a single terminator is removed and a doubled one keeps one.',
      code: "body = frame.removesuffix(b'\\r\\n')",
    },
    {
      name: 'Pre-3.9 equivalent',
      desc: 'Note the guard against an empty suffix, which the slice idiom needs.',
      code: "stem = d[:-len(s)] if s and d.endswith(s) else d",
    },
  ],

  examples: [
    { title: 'Present',       code: "b'file.txt'.removesuffix(b'.txt')", returns: "b'file'" },
    { title: 'Absent',        code: "b'file.csv'.removesuffix(b'.txt')", returns: "b'file.csv'" },
    { title: 'rstrip breaks', code: "b'text.txt'.rstrip(b'.txt')",       returns: "b'te'  # wrong" },
    { title: 'This is right', code: "b'text.txt'.removesuffix(b'.txt')", returns: "b'text'" },
    { title: 'Once only',     code: "b'namexx'.removesuffix(b'x')",      returns: "b'namex'" },
    { title: 'Whole',         code: "b'abc'.removesuffix(b'abc')",       returns: "b''" },
  ],

  pitfalls: [
    {
      name: 'It removes the suffix once, not repeatedly',
      desc: 'A doubled suffix keeps one copy. Loop if every trailing copy should go.',
      wrong: { label: 'One copy left', code: "b'namexx'.removesuffix(b'x')", output: "b'namex'" },
      fix:   { label: 'Loop for all',  code: "while d.endswith(b'x'):\n    d = d.removesuffix(b'x')", output: "b'name'" },
    },
    {
      name: 'No error when the suffix is missing',
      desc: 'Silent no-op by design. A wrong suffix is not caught; the data just comes back unchanged.',
      wrong: { label: 'Typo hidden', code: "b'file.txt'.removesuffix(b'.text')", output: "b'file.txt'  # unchanged, no error" },
      fix:   { label: 'Check first',  code: "if not name.endswith(b'.txt'):\n    raise ValueError('not a txt')", output: 'explicit' },
    },
    {
      name: 'The old slice idiom breaks on an empty suffix',
      desc: 'd[:-0] is d[:0], which is empty — so the pre-3.9 one-liner silently returns nothing when the suffix is empty. removesuffix handles that case correctly, which is one more reason to prefer it.',
      wrong: { label: 'Empty result', code: "s = b''\nb'abc'[:-len(s)]", output: "b''  # -0 is 0" },
      fix:   { label: 'Method is safe', code: "b'abc'.removesuffix(b'')", output: "b'abc'" },
    },
  ],

  when: {
    use: [
      'Stripping a file extension or other exact trailer',
      'Anywhere rstrip was being misused for an exact suffix',
      'Optional suffixes where absence is normal',
    ],
    avoid: [
      'Removing a SET of trailing bytes → rstrip',
      'A suffix that must be present → check with endswith and raise',
      'Supporting Python 3.8 or older without a fallback',
    ],
  },

  notes: {
    complexity: 'O(len(suffix)) to check, then a slice',
    return:     'A new bytes object; the original when the suffix is absent',
    cpython:    'Objects/bytesobject.c :: bytes_removesuffix',
    memory:     'Allocates the shortened result',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.removeprefix', slug: 'bytes-removeprefix', when: 'The same operation at the start' },
    { name: 'bytes.rstrip',       slug: 'bytes-rstrip',       when: 'Remove a SET of bytes rather than a sequence' },
    { name: 'bytes.endswith',     slug: 'bytes-endswith',     when: 'Test for the suffix without removing it' },
    { name: 'str.removesuffix',   slug: 'str-removesuffix',   when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'Why does rstrip(b".txt") give the wrong answer?',
      a: 'Because rstrip strips a SET of bytes — dot, t, x — from the right, repeatedly, until a byte outside the set appears. On b"text.txt" it removes .txt and then keeps eating the t and x of "text". removesuffix matches the exact sequence once.',
      code: "b'text.txt'.rstrip(b'.txt')        # b'te'\nb'text.txt'.removesuffix(b'.txt')  # b'text'",
    },
    {
      q: 'How do I remove any of several extensions?',
      a: 'There is no tuple form. Loop over the candidates, or use os.path.splitext on a decoded path, which understands extensions properly.',
      code: "for ext in (b'.txt', b'.md'):\n    if name.endswith(ext):\n        name = name.removesuffix(ext)\n        break",
    },
    {
      q: 'Does bytearray have removesuffix?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.9', note: 'removeprefix and removesuffix added to str, bytes and bytearray by PEP 616.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.removesuffix',
    meta:  'bytes.removesuffix',
  },

};
