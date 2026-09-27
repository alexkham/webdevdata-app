// content/reference/python/functions/bytes-rpartition.js

export const meta = {
  slug:        'bytes-rpartition',
  name:        'bytes.rpartition',
  signature:   'bytes.rpartition(sep)',
  blurb:       'Split once at the LAST separator — and when absent, everything lands in the TAIL.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes rpartition split last separator three parts head tail extension path unpack binary bytearray bytearray.rpartition',
};

export const method = {
  slug:      'bytes-rpartition',
  name:      'bytes.rpartition',
  signature: 'bytes.rpartition(sep)',
  returns:   { type: 'tuple', desc: 'Always (head, separator, tail), split at the LAST occurrence. When the separator is absent, the tail holds everything and the other two are empty — the mirror of partition.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'partition from the other end. The absent-separator rule is mirrored too: partition fills the HEAD, rpartition fills the TAIL. Getting that backwards is the whole failure mode.',

  cheat: {
    commonCall: "stem, dot, ext = name.rpartition(b'.')",
    returns:    'a 3-tuple, always — split at the last separator',
    replaces:   'rfind plus two slices plus a -1 check',
    watchOut:   'absent separator → (b\'\', b\'\', data): everything in the TAIL',
  },

  parameters: [
    { name: 'sep', type: 'bytes', required: true, default: null, desc: 'Separator to split on, at its last occurrence. An empty separator raises ValueError.' },
  ],

  demoParams: [
    { name: 's',   type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sep', type: 'str', hint: 'separator',               input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').rpartition(bytes({sep}, 'utf-8'))",
  cases: [
    { id: 'last',    label: 'splits at LAST',    values: { s: 'a=b=c',    sep: '=' } },
    { id: 'ext',     label: 'file extension',    values: { s: 'file.tar.gz', sep: '.' } },
    { id: 'absent',  label: 'absent → tail (!)', values: { s: 'abc',      sep: '=' } },
    { id: 'single',  label: 'single separator',  values: { s: 'a=b',      sep: '=' } },
    { id: 'trailing',label: 'at the end',        values: { s: 'abc=',     sep: '=' } },
  ],
  demoExplainer: 'The split happens at the LAST occurrence, so a=b=c gives a=b as the head and c as the tail — the opposite grouping from partition. The extension case is the classic use: file.tar.gz splits into file.tar and gz. Study the absent case closely, because it is mirrored from partition: with no separator, rpartition puts the whole input in the TAIL, giving two empty parts first.',

  patterns: [
    {
      name: 'Split a file extension',
      desc: 'The last dot is the extension boundary.',
      code: "stem, _, ext = name.rpartition(b'.')",
    },
    {
      name: 'Split a path into directory and leaf',
      desc: 'The last slash separates them.',
      code: "directory, _, leaf = path.rpartition(b'/')",
    },
    {
      name: 'Separate host and port',
      desc: 'The last colon, which survives IPv6 addresses.',
      code: "host, _, port = addr.rpartition(b':')",
    },
  ],

  examples: [
    { title: 'Last separator',  code: "b'a=b=c'.rpartition(b'=')",   returns: "(b'a=b', b'=', b'c')" },
    { title: 'Extension',       code: "b'file.tar.gz'.rpartition(b'.')", returns: "(b'file.tar', b'.', b'gz')" },
    { title: 'Absent fills tail', code: "b'abc'.rpartition(b'=')",   returns: "(b'', b'', b'abc')" },
    { title: 'partition differs', code: "b'abc'.partition(b'=')",    returns: "(b'abc', b'', b'')" },
    { title: 'At the end',      code: "b'abc='.rpartition(b'=')",    returns: "(b'abc', b'=', b'')" },
    { title: 'Unpack is safe',  code: "h, s, t = b'x'.rpartition(b'=')", returns: 'always works' },
  ],

  pitfalls: [
    {
      name: 'A missing separator fills the TAIL, not the head',
      desc: 'The mirror of partition, and easy to get backwards. Code that reads the head as "the value" gets empty bytes when the separator is absent — partition would have given the whole input there.',
      wrong: { label: 'Empty head', code: "b'noext'.rpartition(b'.')[0]", output: "b''" },
      fix:   { label: 'Test the separator', code: "h, s, t = name.rpartition(b'.')\nstem = h if s else t", output: 'handles both' },
    },
    {
      name: 'Only the LAST occurrence splits',
      desc: 'Earlier separators stay in the head. Right for extensions and paths; wrong when you wanted the first split.',
      wrong: { label: 'Earlier kept', code: "b'a=b=c'.rpartition(b'=')", output: "(b'a=b', b'=', b'c')" },
      fix:   { label: 'partition for first', code: "b'a=b=c'.partition(b'=')", output: "(b'a', b'=', b'b=c')" },
    },
    {
      name: 'An empty separator raises',
      desc: 'No meaningful split point exists, so Python refuses rather than guessing.',
      wrong: { label: 'No split point', code: "b'abc'.rpartition(b'')", output: 'ValueError: empty separator' },
      fix:   { label: 'Guard it',       code: "parts = d.rpartition(sep) if sep else (b'', b'', d)", output: 'explicit' },
    },
  ],

  when: {
    use: [
      'File extensions, path leaves and host:port — anything keyed on the LAST separator',
      'Key-value parsing where the value may itself contain the separator',
      'Anywhere rfind plus slicing would need a -1 check',
    ],
    avoid: [
      'The FIRST separator → partition',
      'Every field → split or rsplit',
      'Real paths → os.path or pathlib handle edge cases',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; scans from the right and stops at the first match',
    return:     'A new three-item tuple of new bytes objects',
    cpython:    'Objects/bytesobject.c :: bytes_rpartition',
    memory:     'Allocates the tuple and up to three parts',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.partition', slug: 'bytes-partition', when: 'Split at the FIRST occurrence' },
    { name: 'bytes.rsplit',    slug: 'bytes-rsplit',    when: 'Every field from the right, with a limit' },
    { name: 'bytes.rfind',     slug: 'bytes-rfind',     when: 'Just the offset of the last separator' },
    { name: 'str.rpartition',  slug: 'str-rpartition',  when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'Why does a missing separator fill the tail rather than the head?',
      a: 'So that the tail always means "everything after the last separator". With no separator there is nothing before it, so the whole input is "after". It also makes name.rpartition(b".")[2] a safe way to take the extension-or-whole-name in one expression.',
      code: "b'abc'.rpartition(b'=')\n# (b'', b'', b'abc')",
    },
    {
      q: 'How do I tell whether the separator was found?',
      a: 'Check the middle element — the separator itself when found, empty bytes when not. That is far clearer than inspecting the other two parts, which are empty in different positions for partition and rpartition.',
      code: "h, s, t = d.rpartition(b'.')\nfound = bool(s)",
    },
    {
      q: 'Does bytearray have rpartition?',
      a: 'Yes, with identical behaviour, returning a tuple of bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.rpartition arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.rpartition',
    meta:  'bytes.rpartition',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
