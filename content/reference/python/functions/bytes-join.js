// content/reference/python/functions/bytes-join.js

export const meta = {
  slug:        'bytes-join',
  name:        'bytes.join',
  signature:   'bytes.join(iterable)',
  blurb:       'Concatenate bytes objects with a separator — called ON the separator.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes join concatenate separator glue combine parts binary build buffer bytearray bytearray.join',
};

export const method = {
  slug:      'bytes-join',
  name:      'bytes.join',
  signature: 'bytes.join(iterable)',
  returns:   { type: 'bytes', desc: 'One bytes object with the separator placed between each item. An empty iterable gives empty bytes.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The separator is the object you call the method on, which reads backwards until it clicks. It is also the only sane way to build a large buffer from many pieces.',

  cheat: {
    commonCall: "b','.join(parts)",
    returns:    'a single bytes object',
    replaces:   'a += loop, which copies the whole buffer every iteration',
    watchOut:   'every item must be bytes — one str in the list and it raises',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable of bytes-like objects. A generator works; the items are consumed once.' },
  ],

  demoParams: [
    { name: 'sep',   type: 'str',  hint: 'separator',                input: 'text' },
    { name: 'parts', type: 'list', hint: 'parts, comma separated',   input: 'csv' },
  ],
  demoTemplate: "bytes({sep}, 'utf-8').join([bytes(p, 'utf-8') for p in {parts}])",
  cases: [
    { id: 'comma',  label: 'comma separator', values: { sep: ',',  parts: 'a,b,c' } },
    { id: 'dash',   label: 'dash separator',  values: { sep: '-',  parts: 'x,y' } },
    { id: 'none',   label: 'empty separator', values: { sep: '',   parts: 'a,b,c' } },
    { id: 'single', label: 'one part',        values: { sep: ',',  parts: 'only' } },
    { id: 'empty',  label: 'no parts',        values: { sep: ',',  parts: '' } },
  ],
  demoExplainer: 'The separator goes BETWEEN the parts, never at the ends — so three parts get two separators. A single part gets none at all, and an empty iterable gives empty bytes rather than an error. The empty-separator case is the standard way to concatenate a list of chunks into one buffer with nothing between them.',

  patterns: [
    {
      name: 'Concatenate chunks efficiently',
      desc: 'The correct way to assemble a buffer read in pieces.',
      code: "body = b''.join(chunks)",
    },
    {
      name: 'Rebuild a delimited record',
      desc: 'The inverse of split.',
      code: "line = b','.join(fields)",
    },
    {
      name: 'Join from a generator',
      desc: 'No intermediate list is built, though join must still buffer internally.',
      code: "data = b''.join(read_chunk() for _ in range(n))",
    },
  ],

  examples: [
    { title: 'Comma separated', code: "b','.join([b'a', b'b', b'c'])", returns: "b'a,b,c'" },
    { title: 'Concatenate',     code: "b''.join([b'a', b'b'])",        returns: "b'ab'" },
    { title: 'One part',        code: "b','.join([b'a'])",             returns: "b'a'" },
    { title: 'No parts',        code: "b','.join([])",                 returns: "b''" },
    { title: 'str item raises', code: "b','.join([b'a', 'b'])",        returns: "TypeError: sequence item 1: expected a bytes-like object, str found" },
    { title: 'Round trip',      code: "b','.join(b'a,b'.split(b','))", returns: "b'a,b'" },
  ],

  pitfalls: [
    {
      name: 'The separator is the receiver, not an argument',
      desc: 'Reading it aloud helps — "join these with a comma" is written as the comma joining them. Newcomers reliably try to call join on the list instead.',
      wrong: { label: 'Backwards', code: "[b'a', b'b'].join(b',')", output: "AttributeError: 'list' object has no attribute 'join'" },
      fix:   { label: 'Separator first', code: "b','.join([b'a', b'b'])", output: "b'a,b'" },
    },
    {
      name: 'One str in the list and it raises',
      desc: 'Every item must be bytes-like. The error names the offending index, which is the one helpful thing about it — but mixed lists are easy to build accidentally when part of the data was decoded.',
      wrong: { label: 'Mixed types', code: "b','.join([b'a', 'b'])", output: 'TypeError: sequence item 1: expected a bytes-like object, str found' },
      fix:   { label: 'Encode them all', code: "b','.join(p.encode() for p in ['a', 'b'])", output: "b'a,b'" },
    },
    {
      name: 'Building with += is quadratic',
      desc: 'Bytes are immutable, so each += copies everything accumulated so far. Over many chunks this becomes O(n squared) — join exists precisely to avoid it.',
      wrong: { label: 'Copies every time', code: "buf = b''\nfor c in chunks:\n    buf += c", output: 'quadratic' },
      fix:   { label: 'Join once',         code: "buf = b''.join(chunks)", output: 'linear' },
    },
    {
      name: 'The separator does not appear at the ends',
      desc: 'join places it strictly between items. Code expecting a trailing delimiter — as many line-based formats want — has to add it explicitly.',
      wrong: { label: 'No trailing newline', code: "b'\\n'.join([b'a', b'b'])", output: "b'a\\nb'" },
      fix:   { label: 'Add one',            code: "b'\\n'.join([b'a', b'b']) + b'\\n'", output: "b'a\\nb\\n'" },
    },
  ],

  when: {
    use: [
      'Assembling a buffer from many chunks',
      'Rebuilding a delimited record after editing its fields',
      'Any loop that would otherwise concatenate with +=',
    ],
    avoid: [
      'Two or three fixed pieces → plain + is clearer',
      'The parts are text → join the strings, then encode once',
      'You are appending repeatedly over time → bytearray',
    ],
  },

  notes: {
    complexity: 'O(total length) — one pass to size the result, one to fill it',
    return:     'A new bytes object; the parts are unchanged',
    cpython:    'Objects/bytesobject.c :: bytes_join',
    memory:     'Allocates the result once, which is why it beats repeated concatenation',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'join',        slug: 'join',        when: 'The str version of this method' },
    { name: 'bytes.split', slug: 'bytes-split', when: 'The inverse — take the buffer apart' },
    { name: 'bytearray',   slug: 'bytearray',   when: 'Appending repeatedly over time' },
    { name: 'bytes',       slug: 'bytes',       when: 'Build the pieces in the first place' },
  ],

  faq: [
    {
      q: 'Why is it called on the separator?',
      a: 'Because join belongs to the separator type, and any iterable can supply the parts. Putting it on the list would mean every sequence type needed its own version. It reads oddly at first and then becomes second nature.',
      code: "b','.join(parts)",
    },
    {
      q: 'Can I join a list of strings into bytes?',
      a: 'Not directly — every item must already be bytes. Either encode each part, or join the strings first and encode the result once, which is usually faster.',
      code: "','.join(parts).encode('utf-8')",
    },
    {
      q: 'Is join faster than += in a loop?',
      a: 'Substantially, and the gap widens with size. += copies the whole accumulated buffer each time, making it quadratic; join measures the total once and fills a single allocation.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.join arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.join',
    meta:  'bytes.join',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
