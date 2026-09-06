// content/reference/python/functions/bytearray-extend.js

export const meta = {
  slug:        'bytearray-extend',
  name:        'bytearray.extend',
  signature:   'bytearray.extend(iterable)',
  blurb:       'Append every byte from an iterable of ints — or from another bytes object.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytearray extend append many bytes iterable concat grow buffer mutable binary',
};

export const method = {
  slug:      'bytearray-extend',
  name:      'bytearray.extend',
  signature: 'bytearray.extend(iterable)',
  returns:   { type: 'None', desc: 'Returns None — the buffer grows in place. The demo wraps the call so the resulting buffer is visible.' },

  category:    'Bytearray method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The bulk form of append. Unlike append it DOES accept a bytes object, because bytes is itself an iterable of ints — an inconsistency worth remembering.',

  cheat: {
    commonCall: 'buf.extend(chunk)',
    returns:    'None — the buffer is mutated',
    replaces:   'a loop of append calls, or buf += chunk',
    watchOut:   'every item must be 0 to 255; a str raises even though it is iterable',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable of ints in 0 to 255 — a list, a range, another bytes or bytearray. A str raises TypeError.' },
  ],

  demoParams: [
    { name: 's',    type: 'str',  hint: 'starting buffer (as text)',  input: 'text' },
    { name: 'more', type: 'list', hint: 'byte values, comma separated', input: 'csv-num' },
  ],
  demoTemplate: "[b := bytearray(bytes({s}, 'utf-8')), b.extend({more}), b][2]",
  cases: [
    { id: 'two',    label: 'add two bytes',   values: { s: 'abc', more: '100,101' } },
    { id: 'one',    label: 'add one byte',    values: { s: 'abc', more: '122' } },
    { id: 'none',   label: 'add nothing',     values: { s: 'abc', more: '' } },
    { id: 'onto-empty', label: 'onto empty',  values: { s: '',    more: '97,98' } },
    { id: 'toobig', label: 'out of range (!)',values: { s: 'abc', more: '256' } },
  ],
  demoExplainer: 'Every value in the iterable is appended in order, so 100 and 101 add the letters d and e. An empty iterable is a harmless no-op rather than an error. As with append, each value must fit in a byte — and one out-of-range number rejects the ENTIRE call, leaving the buffer untouched rather than partially extended.',

  patterns: [
    {
      name: 'Accumulate chunks from a stream',
      desc: 'The standard read loop for assembling a payload.',
      code: 'buf = bytearray()\nwhile chunk := sock.recv(4096):\n    buf.extend(chunk)',
    },
    {
      name: 'Append another buffer',
      desc: 'bytes and bytearray are both accepted directly.',
      code: 'buf.extend(header)',
    },
    {
      name: 'Add encoded text',
      desc: 'Encode first, since a str is rejected.',
      code: "buf.extend('héllo'.encode('utf-8'))",
    },
  ],

  examples: [
    { title: 'Two bytes',     code: "b = bytearray(b'abc')\nb.extend([100, 101])\nb", returns: "bytearray(b'abcde')" },
    { title: 'Another bytes', code: "b = bytearray(b'ab')\nb.extend(b'cd')\nb", returns: "bytearray(b'abcd')" },
    { title: 'Empty is fine', code: "b = bytearray(b'abc')\nb.extend([])\nb", returns: "bytearray(b'abc')" },
    { title: 'From a range',  code: 'b = bytearray()\nb.extend(range(3))\nb', returns: "bytearray(b'\\x00\\x01\\x02')" },
    { title: 'str rejected',  code: "bytearray().extend('ab')", returns: 'TypeError' },
    { title: 'Out of range',  code: 'bytearray().extend([256])', returns: 'ValueError: byte must be in range(0, 256)' },
  ],

  pitfalls: [
    {
      name: 'A str is rejected even though it is iterable',
      desc: 'Iterating a str gives characters, not ints, so extend refuses rather than guessing an encoding. The error is confusing because the argument clearly IS iterable.',
      wrong: { label: 'str rejected', code: "buf.extend('ab')", output: "TypeError: expected iterable of integers; got: 'str'" },
      fix:   { label: 'Encode first', code: "buf.extend('ab'.encode('utf-8'))", output: 'both bytes added' },
    },
    {
      name: 'One bad value rejects the whole call',
      desc: 'A single out-of-range item raises and NOTHING is added — extend buffers the values before committing them. Worth knowing precisely because the opposite would be a reasonable guess for an in-place mutator.',
      wrong: { label: 'Nothing added', code: 'buf = bytearray()\nbuf.extend([1, 2, 256])\n# ValueError\nbuf', output: "bytearray(b'')  # not partially extended" },
      fix:   { label: 'Filter or clamp', code: 'buf.extend(v & 0xFF for v in values)', output: 'every value fits' },
    },
    {
      name: 'Confused with append',
      desc: 'append adds ONE byte and takes an int; extend adds MANY and takes an iterable. Passing an iterable to append, or a bare int to extend, both raise.',
      wrong: { label: 'int rejected', code: 'buf.extend(100)', output: "TypeError: can't extend bytearray with int" },
      fix:   { label: 'Use append',       code: 'buf.append(100)', output: 'one byte added' },
    },
    {
      name: 'It returns None',
      desc: 'Assigning the result replaces your buffer with None — the same trap as append, sort and every other in-place mutator.',
      wrong: { label: 'Buffer lost', code: 'buf = buf.extend(chunk)', output: 'None' },
      fix:   { label: 'Just call it', code: 'buf.extend(chunk)', output: 'buf is updated' },
    },
  ],

  when: {
    use: [
      'Accumulating chunks read from a socket or file',
      'Appending another bytes or bytearray',
      'Adding several byte values at once',
    ],
    avoid: [
      'A single byte → append is clearer',
      'Adding at a position → insert',
      'The result never changes → build bytes with join instead',
    ],
  },

  notes: {
    complexity: 'O(k) for k added bytes, amortised — the buffer over-allocates',
    return:     'None; the bytearray is mutated in place',
    cpython:    'Objects/bytearrayobject.c :: bytearray_extend',
    memory:     'May reallocate; growth is geometric so repeated extends stay cheap',
    threadSafe: 'Not safe under concurrent mutation of the same buffer',
  },

  related: [
    { name: 'bytearray.append', slug: 'bytearray-append', when: 'Add exactly one byte' },
    { name: 'bytearray.insert', slug: 'bytearray-insert', when: 'Add at a position rather than the end' },
    { name: 'list.extend',      slug: 'list-extend',      when: 'The list version of this idea' },
    { name: 'bytes.join',       slug: 'bytes-join',       when: 'Assemble immutable bytes from parts instead' },
  ],

  faq: [
    {
      q: 'Why does extend accept bytes when append does not?',
      a: 'Because bytes IS an iterable of ints — iterating it yields values from 0 to 255, exactly what extend wants. append needs a single int, and a bytes object is not one, even when it holds only one byte.',
      code: "buf.extend(b'cd')     # fine\nbuf.append(b'd')      # TypeError",
    },
    {
      q: 'Is extend the same as +=?',
      a: 'Effectively yes for a bytearray — += calls __iadd__, which extends in place. extend accepts any iterable of ints, while += wants a bytes-like object, so extend is slightly more permissive.',
      code: 'buf += chunk\nbuf.extend(chunk)   # equivalent here',
    },
    {
      q: 'If one value is invalid, do the earlier ones still get added?',
      a: 'No. CPython collects the values before committing them to the buffer, so a bad item anywhere means nothing is appended at all. That holds for a plain iterator too, not just a list.',
      code: "b = bytearray()\nb.extend([1, 2, 256])   # ValueError\nb                       # bytearray(b'')",
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.extend',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
