// content/reference/python/functions/bytes-rsplit.js

export const meta = {
  slug:        'bytes-rsplit',
  name:        'bytes.rsplit',
  signature:   'bytes.rsplit(sep=None, maxsplit=-1)',
  blurb:       'split from the right — only matters when maxsplit limits it.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes rsplit right split maxsplit last fields from end separator binary bytearray bytearray.rsplit',
};

export const method = {
  slug:      'bytes-rsplit',
  name:      'bytes.rsplit',
  signature: 'bytes.rsplit(sep=None, maxsplit=-1)',
  returns:   { type: 'list', desc: 'A list of bytes objects, in original order. With maxsplit, the splits are counted from the right, so the LEFTMOST element keeps whatever was not split.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Without maxsplit it is identical to split. With maxsplit it splits from the right, which is the whole reason it exists — take the last N fields and leave the rest joined.',

  cheat: {
    commonCall: "*rest, last = data.rsplit(b'/', 1)",
    returns:    'list of bytes, in original order',
    replaces:   'rfind-and-slice for taking the last few fields',
    watchOut:   'the result is in LEFT-to-right order even though the split ran from the right',
  },

  parameters: [
    { name: 'sep',      type: 'bytes | None', required: false, default: 'None', desc: 'Separator. Omitted or None splits on runs of ASCII whitespace.' },
    { name: 'maxsplit', type: 'int',          required: false, default: '-1',   desc: 'Maximum number of splits, counted from the RIGHT. Negative means unlimited, at which point rsplit equals split.' },
  ],

  demoParams: [
    { name: 's',        type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'sep',      type: 'str', hint: 'separator',               input: 'text' },
    { name: 'maxsplit', type: 'int', hint: 'max splits from the right', input: 'number' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').rsplit(bytes({sep}, 'utf-8'), {maxsplit})",
  cases: [
    { id: 'one',      label: 'last field only',   values: { s: 'a,b,c',   sep: ',', maxsplit: 1 } },
    { id: 'two',      label: 'last two fields',   values: { s: 'a,b,c,d', sep: ',', maxsplit: 2 } },
    { id: 'unlimited',label: 'unlimited = split', values: { s: 'a,b,c',   sep: ',', maxsplit: -1 } },
    { id: 'path',     label: 'path leaf',         values: { s: 'x/y/z',   sep: '/', maxsplit: 1 } },
    { id: 'absent',   label: 'separator absent',  values: { s: 'abc',     sep: ',', maxsplit: 1 } },
  ],
  demoExplainer: 'With maxsplit 1, a,b,c becomes [a,b, c] — one split, taken from the right, so the remainder stays joined on the LEFT. Compare split(b",", 1), which would give [a, b,c]. The list is still in left-to-right order; only the choice of which separators to honour changed. With maxsplit -1 the two methods are identical.',

  patterns: [
    {
      name: 'Take the last path component',
      desc: 'One split from the right leaves the directory joined.',
      code: "directory, leaf = path.rsplit(b'/', 1)",
    },
    {
      name: 'Separate a trailing suffix or counter',
      desc: 'Names like report-2024-final: keep the base, take the last piece.',
      code: "base, tag = name.rsplit(b'-', 1)",
    },
    {
      name: 'Unpack the last N fields',
      desc: 'Star-unpacking keeps the rest as a list.',
      code: "*rest, penultimate, last = line.rsplit(b',', 2)",
    },
  ],

  examples: [
    { title: 'Last field',     code: "b'a,b,c'.rsplit(b',', 1)",   returns: "[b'a,b', b'c']" },
    { title: 'split differs',  code: "b'a,b,c'.split(b',', 1)",    returns: "[b'a', b'b,c']" },
    { title: 'Last two',       code: "b'a,b,c,d'.rsplit(b',', 2)", returns: "[b'a,b', b'c', b'd']" },
    { title: 'Unlimited',      code: "b'a,b,c'.rsplit(b',')",      returns: "[b'a', b'b', b'c']" },
    { title: 'Path leaf',      code: "b'x/y/z'.rsplit(b'/', 1)",   returns: "[b'x/y', b'z']" },
    { title: 'Absent',         code: "b'abc'.rsplit(b',', 1)",     returns: "[b'abc']" },
  ],

  pitfalls: [
    {
      name: 'The output is in normal order',
      desc: 'rsplit does not reverse the list. Only which separators get honoured changes, so the last field is still the last element.',
      wrong: { label: 'Not reversed', code: "b'a,b,c'.rsplit(b',', 1)", output: "[b'a,b', b'c']  # c is still last" },
      fix:   { label: 'Index from the end', code: "b'a,b,c'.rsplit(b',', 1)[-1]", output: "b'c'" },
    },
    {
      name: 'Without maxsplit it is just split',
      desc: 'Reaching for rsplit with no limit gains nothing. It is only meaningful when maxsplit is set.',
      wrong: { label: 'No difference', code: "b'a,b,c'.rsplit(b',') == b'a,b,c'.split(b',')", output: 'True' },
      fix:   { label: 'Set a limit',   code: "b'a,b,c'.rsplit(b',', 1)", output: "[b'a,b', b'c']" },
    },
    {
      name: 'An absent separator gives one element',
      desc: 'Unpacking into two names then fails with a confusing message. rpartition always gives three parts and avoids this.',
      wrong: { label: 'Unpack fails', code: "d, leaf = b'noslash'.rsplit(b'/', 1)", output: 'ValueError: not enough values to unpack (expected 2, got 1)' },
      fix:   { label: 'Use rpartition', code: "d, sep, leaf = b'noslash'.rpartition(b'/')", output: 'always three' },
    },
  ],

  when: {
    use: [
      'Taking the last N fields while keeping the rest joined',
      'Path leaves, trailing tags and counters',
      'Any rfind-and-slice that wants a list',
    ],
    avoid: [
      'No maxsplit → plain split reads more naturally',
      'Exactly one split, with safe unpacking → rpartition',
      'The data is text → decode first',
    ],
  },

  notes: {
    complexity: 'O(n) — one scan from the right, plus an allocation per part',
    return:     'A new list of new bytes objects, in original order',
    cpython:    'Objects/bytesobject.c :: bytes_rsplit',
    memory:     'Allocates the list and every part',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.split',      slug: 'bytes-split',      when: 'Split from the left, or with no limit' },
    { name: 'bytes.rpartition', slug: 'bytes-rpartition', when: 'One split from the right with safe unpacking' },
    { name: 'bytes.rfind',      slug: 'bytes-rfind',      when: 'Just the offset of the last separator' },
    { name: 'str.rsplit',       slug: 'str-rsplit',       when: 'The str version of this method' },
  ],

  faq: [
    {
      q: 'When does rsplit differ from split?',
      a: 'Only when maxsplit limits the number of splits. Then split honours the leftmost separators and rsplit the rightmost, so the joined remainder ends up on opposite sides. With no limit every separator is used and the results are identical.',
      code: "b'a,b,c'.split(b',', 1)    # [b'a', b'b,c']\nb'a,b,c'.rsplit(b',', 1)   # [b'a,b', b'c']",
    },
    {
      q: 'Is the list reversed?',
      a: 'No. The fields come back in their original left-to-right order. Only the choice of separators changed.',
    },
    {
      q: 'Does bytearray have rsplit?',
      a: 'Yes, with identical behaviour, returning a list of bytearray.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.rsplit arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.rsplit',
    meta:  'bytes.rsplit',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
