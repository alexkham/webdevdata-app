// content/reference/python/functions/bytes-removeprefix.js

export const meta = {
  slug:        'bytes-removeprefix',
  name:        'bytes.removeprefix',
  signature:   'bytes.removeprefix(prefix)',
  blurb:       'Remove an exact prefix if present — the fix for the lstrip trap.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'bytes removeprefix strip prefix remove start exact sequence lstrip alternative binary bytearray bytearray.removeprefix',
};

export const method = {
  slug:      'bytes-removeprefix',
  name:      'bytes.removeprefix',
  signature: 'bytes.removeprefix(prefix)',
  returns:   { type: 'bytes', desc: 'The data with prefix removed from the start if it is there — otherwise the data unchanged. Never raises for a missing prefix.' },

  category:    'Bytes method',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: 'Added in 3.9 precisely because everyone kept misusing lstrip for this. Matches the exact sequence, once, and does nothing when it is absent.',

  cheat: {
    commonCall: "path.removeprefix(b'/api')",
    returns:    'a new bytes object, or the original when the prefix is absent',
    replaces:   "data[len(p):] if data.startswith(p) else data",
    watchOut:   'removes ONCE — a doubled prefix leaves one copy behind',
  },

  parameters: [
    { name: 'prefix', type: 'bytes', required: true, default: null, desc: 'The exact byte sequence to remove from the start. An empty prefix is a harmless no-op.' },
  ],

  demoParams: [
    { name: 's',      type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'prefix', type: 'str', hint: 'prefix to remove',        input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').removeprefix(bytes({prefix}, 'utf-8'))",
  cases: [
    { id: 'present', label: 'prefix present',   values: { s: 'prefix_name', prefix: 'prefix_' } },
    { id: 'absent',  label: 'prefix absent',    values: { s: 'name',        prefix: 'prefix_' } },
    { id: 'partial', label: 'partial no match', values: { s: 'pre_name',    prefix: 'prefix_' } },
    { id: 'double',  label: 'removes once (!)', values: { s: 'xxname',      prefix: 'x' } },
    { id: 'whole',   label: 'entire data',      values: { s: 'abc',         prefix: 'abc' } },
  ],
  demoExplainer: 'When the data begins with the exact prefix it is removed; when it does not, the data comes back untouched with no error. A partial match is no match — pre_name does not start with prefix_, so nothing happens. The doubled case shows the "once" rule: xxname with prefix x loses one x and keeps the other. Removing a prefix equal to the whole data leaves empty bytes.',

  patterns: [
    {
      name: 'Strip a URL scheme or path root',
      desc: 'Exact-match removal that lstrip cannot do safely.',
      code: "rest = url.removeprefix(b'https://')",
    },
    {
      name: 'Normalise a header value',
      desc: 'Bearer tokens and similar tagged values.',
      code: "token = value.removeprefix(b'Bearer ')",
    },
    {
      name: 'Pre-3.9 equivalent',
      desc: 'The idiom removeprefix replaced.',
      code: "rest = data[len(p):] if data.startswith(p) else data",
    },
  ],

  examples: [
    { title: 'Present',       code: "b'prefix_name'.removeprefix(b'prefix_')", returns: "b'name'" },
    { title: 'Absent',        code: "b'name'.removeprefix(b'prefix_')",        returns: "b'name'" },
    { title: 'Partial',       code: "b'pre_name'.removeprefix(b'prefix_')",    returns: "b'pre_name'" },
    { title: 'Once only',     code: "b'xxname'.removeprefix(b'x')",            returns: "b'xname'" },
    { title: 'Whole',         code: "b'abc'.removeprefix(b'abc')",             returns: "b''" },
    { title: 'lstrip differs',code: "b'https://x'.lstrip(b'http://')",         returns: "b's://x'  # mangled — set semantics" },
  ],

  pitfalls: [
    {
      name: 'It removes the prefix once, not repeatedly',
      desc: 'Unlike lstrip, which keeps going, removeprefix takes off exactly one copy. A repeated prefix needs a loop.',
      wrong: { label: 'One copy left', code: "b'xxname'.removeprefix(b'x')", output: "b'xname'" },
      fix:   { label: 'Loop for all',  code: "while d.startswith(b'x'):\n    d = d.removeprefix(b'x')", output: "b'name'" },
    },
    {
      name: 'No error when the prefix is missing',
      desc: 'Silence is the design, but it means a typo in the prefix goes unnoticed — the data just comes back unchanged.',
      wrong: { label: 'Typo hidden', code: "b'Bearer abc'.removeprefix(b'Bearer:')", output: "b'Bearer abc'  # unchanged, no error" },
      fix:   { label: 'Check first',  code: "if not v.startswith(b'Bearer '):\n    raise ValueError('bad header')", output: 'explicit' },
    },
    {
      name: 'Python 3.9 and newer only',
      desc: 'Older interpreters raise AttributeError. Code supporting 3.8 still needs the startswith-and-slice idiom.',
      wrong: { label: 'Fails on 3.8', code: "b'ab'.removeprefix(b'a')", output: "AttributeError: 'bytes' object has no attribute 'removeprefix'" },
      fix:   { label: 'Portable form', code: "d[len(p):] if d.startswith(p) else d", output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Removing a known scheme, root or tag from the start',
      'Anywhere lstrip was being misused for an exact prefix',
      'Optional prefixes where absence is normal',
    ],
    avoid: [
      'Removing a SET of leading bytes → lstrip',
      'A prefix that must be present → check with startswith and raise',
      'Supporting Python 3.8 or older without a fallback',
    ],
  },

  notes: {
    complexity: 'O(len(prefix)) to check, then a slice',
    return:     'A new bytes object; the original when the prefix is absent',
    cpython:    'Objects/bytesobject.c :: bytes_removeprefix',
    memory:     'Allocates the shortened result',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.removesuffix', slug: 'bytes-removesuffix', when: 'The same operation at the end' },
    { name: 'bytes.lstrip',       slug: 'bytes-lstrip',       when: 'Remove a SET of bytes rather than a sequence' },
    { name: 'bytes.startswith',   slug: 'bytes-startswith',   when: 'Test for the prefix without removing it' },
    { name: 'str.removeprefix',   slug: 'str-removeprefix',   when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'Why was this added when lstrip already existed?',
      a: 'Because lstrip strips a SET of bytes, not a sequence, and people misused it for prefixes constantly. b"https://x".lstrip(b"http://") gives b"s://x" — it strips h, t, t, p and stops at the s, which is not in the set. removeprefix matches the exact sequence, which is what everyone meant.',
      code: "b'https://x'.removeprefix(b'http://')\n# b'https://x' — correctly unchanged",
    },
    {
      q: 'How do I remove a prefix that repeats?',
      a: 'Loop while startswith is true, or use lstrip if the prefix is a single byte value. removeprefix itself deliberately removes only once.',
      code: "while d.startswith(p):\n    d = d.removeprefix(p)",
    },
    {
      q: 'Does bytearray have removeprefix?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
    },
  ],

  history: [
    { version: '3.9', note: 'removeprefix and removesuffix added to str, bytes and bytearray by PEP 616.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.removeprefix',
    meta:  'bytes.removeprefix',
  },

};
