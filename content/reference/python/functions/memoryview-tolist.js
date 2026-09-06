// content/reference/python/functions/memoryview-tolist.js

export const meta = {
  slug:        'memoryview-tolist',
  name:        'memoryview.tolist',
  signature:   'memoryview.tolist()',
  blurb:       'The buffer as a list of Python ints — one per element, not per character.',
  category:    'memoryview',
  type:        'memoryview',
  hasLiveDemo: true,
  version:     'Python 2.7+',
  searchTerms: 'memoryview tolist list ints bytes values inspect buffer elements convert',
};

export const method = {
  slug:      'memoryview-tolist',
  name:      'memoryview.tolist',
  signature: 'memoryview.tolist()',
  returns:   { type: 'list', desc: 'A list of the view\'s elements as Python objects — ints for a byte view, matching the view\'s format otherwise.' },

  category:    'Memoryview method',
  version:     'Python 2.7+',
  hasLiveDemo: true,

  subtitle: 'Mostly a debugging tool. Seeing [104, 105] instead of b\'hi\' is what makes byte values readable when you are checking a protocol by hand.',

  cheat: {
    commonCall: 'view.tolist()',
    returns:    'list of ints for a byte view',
    replaces:   'list(view), which gives the same result',
    watchOut:   'far larger than the buffer — each int is a full Python object',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'text to view as bytes', input: 'text' },
  ],
  demoTemplate: "memoryview(bytes({s}, 'utf-8')).tolist()",
  cases: [
    { id: 'ascii',    label: 'plain ascii',  values: { s: 'abc' } },
    { id: 'word',     label: 'a word',       values: { s: 'hi' } },
    { id: 'non-ascii',label: 'non-ascii',    values: { s: 'héllo' } },
    { id: 'empty',    label: 'empty',        values: { s: '' } },
    { id: 'digits',   label: 'digits',       values: { s: '123' } },
  ],
  demoExplainer: 'Each byte becomes an int from 0 to 255. "abc" gives [97, 98, 99] — the ASCII codes. The non-ascii case shows why this is a BYTE list and not a character list: the accented letter is encoded as two UTF-8 bytes, so a five-character string produces six numbers. The digits case is a common trip-up: "123" gives [49, 50, 51], the character codes, not the values one, two and three.',

  patterns: [
    {
      name: 'Inspect a binary protocol by hand',
      desc: 'Byte values are far easier to check against a spec than an escaped bytes repr.',
      code: 'print(memoryview(packet)[:8].tolist())',
    },
    {
      name: 'Compare buffers element by element',
      desc: 'A list diff points at the exact offset that differs.',
      code: 'a, b = memoryview(x).tolist(), memoryview(y).tolist()\nfirst_diff = next(i for i, (p, q) in enumerate(zip(a, b)) if p != q)',
    },
    {
      name: 'Assert on byte values in a test',
      desc: 'Reads better in a failure message than a bytes literal.',
      code: 'assert memoryview(out).tolist() == [0, 1, 255]',
    },
  ],

  examples: [
    { title: 'ASCII codes',   code: "memoryview(b'abc').tolist()",   returns: '[97, 98, 99]' },
    { title: 'Two letters',   code: "memoryview(b'hi').tolist()",    returns: '[104, 105]' },
    { title: 'Digits are codes',code: "memoryview(b'123').tolist()", returns: '[49, 50, 51]' },
    { title: 'Empty',         code: "memoryview(b'').tolist()",      returns: '[]' },
    { title: 'Same as list()',code: "list(memoryview(b'abc'))",      returns: '[97, 98, 99]' },
    { title: 'Non-ascii is multi-byte', code: "memoryview('é'.encode()).tolist()", returns: '[195, 169]' },
  ],

  pitfalls: [
    {
      name: 'Digits give character codes, not values',
      desc: "b'123' is the characters one, two and three, whose ASCII codes are 49, 50 and 51. Reading the list as the number one hundred and twenty-three is a classic parsing bug.",
      wrong: { label: 'Not the digits', code: "memoryview(b'123').tolist()", output: '[49, 50, 51]' },
      fix:   { label: 'Decode and parse', code: "int(memoryview(b'123').tobytes())", output: '123' },
    },
    {
      name: 'One entry per BYTE, not per character',
      desc: 'The view knows nothing about text encodings. A non-ASCII character occupies several bytes and therefore several list entries, so the length does not match the string length.',
      wrong: { label: 'Six for five chars', code: "len(memoryview('héllo'.encode()).tolist())", output: '6' },
      fix:   { label: 'Count characters', code: "len('héllo')", output: '5' },
    },
    {
      name: 'It is far bigger than the buffer',
      desc: 'Every byte becomes a full Python int object. A one-megabyte buffer becomes a list costing tens of megabytes, which defeats the memory saving a view was chosen for.',
      wrong: { label: 'Huge allocation', code: 'memoryview(one_mb_buffer).tolist()', output: 'tens of MB of int objects' },
      fix:   { label: 'Index what you need', code: 'view[0], view[1]', output: 'two ints' },
    },
  ],

  when: {
    use: [
      'Debugging binary formats where byte values matter',
      'Test assertions that should read as numbers',
      'Comparing two buffers to find the first differing offset',
    ],
    avoid: [
      'Large buffers — the list dwarfs the data',
      'You want the raw bytes → tobytes',
      'You want a compact hex view → hex',
    ],
  },

  notes: {
    complexity: 'O(n) — one Python object created per element',
    return:     'A new list; for a byte view, ints in the range 0 to 255',
    cpython:    'Objects/memoryobject.c :: memory_tolist',
    memory:     'Substantially larger than the buffer — a Python int per element',
    threadSafe: 'A concurrently mutated source gives an inconsistent snapshot',
  },

  related: [
    { name: 'memoryview.tobytes', slug: 'memoryview-tobytes', when: 'The same data as raw bytes' },
    { name: 'memoryview.hex',     slug: 'memoryview-hex',     when: 'The same data as a compact hex string' },
    { name: 'list',               slug: 'list',               when: 'list(view) does exactly this' },
    { name: 'memoryview',         slug: 'memoryview',         when: 'Create the view in the first place' },
  ],

  faq: [
    {
      q: "Why does b'123' give [49, 50, 51]?",
      a: 'Because those are the ASCII codes for the characters one, two and three. A memoryview exposes raw bytes and never interprets them as text or numbers — decoding is always something you ask for explicitly.',
      code: "ord('1')\n# 49",
    },
    {
      q: 'Is tolist() the same as list(view)?',
      a: 'For the byte views most code uses, yes. tolist is more explicit, and for multi-dimensional views it produces nested lists that mirror the shape, where iterating gives sub-views instead.',
      code: "list(memoryview(b'abc'))\n# [97, 98, 99]",
    },
    {
      q: 'Does the list stay linked to the buffer?',
      a: 'No. It is a snapshot of plain int objects, so later changes to the underlying buffer are not reflected. Keep the view itself if you need a live window.',
    },
  ],

  history: [
    { version: '2.7', note: 'memoryview introduced with tolist, replacing the older buffer type.' },
    { version: '3.3', note: 'Extended to handle multi-dimensional and non-byte formats properly.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#memoryview.tolist',
    meta:  'memoryview.tolist',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
