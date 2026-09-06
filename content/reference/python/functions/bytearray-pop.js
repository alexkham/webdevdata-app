// content/reference/python/functions/bytearray-pop.js
//
// pop RETURNS the removed byte, so unlike the other mutators the demo shows
// the return value directly rather than the resulting buffer.

export const meta = {
  slug:        'bytearray-pop',
  name:        'bytearray.pop',
  signature:   'bytearray.pop([index])',
  blurb:       'Remove a byte and return it as an int — defaults to the last one.',
  category:    'bytearray',
  type:        'bytearray',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytearray pop remove last byte stack lifo index indexerror mutable buffer',
};

export const method = {
  slug:      'bytearray-pop',
  name:      'bytearray.pop',
  signature: 'bytearray.pop([index])',
  returns:   { type: 'int', desc: 'The removed byte as an integer from 0 to 255. Raises IndexError on an empty buffer.' },

  category:    'Bytearray method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The only bytearray mutator whose return value matters. It hands back an INT, not a one-byte bytes object.',

  cheat: {
    commonCall: 'byte = buf.pop()',
    returns:    'int — the removed byte value',
    replaces:   'reading buf[-1] then deleting it',
    watchOut:   'IndexError on an empty buffer; there is no default argument',
  },

  parameters: [
    { name: 'index', type: 'int', required: false, default: '-1', desc: 'Position to remove. Defaults to the last byte. Negative counts from the end. Out of range raises IndexError.' },
  ],

  demoParams: [
    { name: 's', type: 'str', hint: 'buffer (as text)', input: 'text' },
  ],
  demoTemplate: "bytearray(bytes({s}, 'utf-8')).pop()",
  cases: [
    { id: 'abc',    label: 'pops last byte', values: { s: 'abc' } },
    { id: 'single', label: 'single byte',    values: { s: 'a' } },
    { id: 'digits', label: 'digits',         values: { s: '123' } },
    { id: 'empty',  label: 'empty raises',   values: { s: '' } },
  ],
  demoExplainer: 'The demo shows what pop RETURNS — an integer, not bytes. Popping from "abc" gives 99, the ASCII code for c, and the buffer would be left holding just ab. The digits case is the usual trip-up: popping from "123" gives 51, the code for the character three, not the number three. An empty buffer raises IndexError, and unlike dict.pop there is no default argument to soften it.',

  patterns: [
    {
      name: 'Use a buffer as a byte stack',
      desc: 'append and pop together give LIFO behaviour.',
      code: 'buf.append(value)\n...\nvalue = buf.pop()',
    },
    {
      name: 'Strip a trailing terminator',
      desc: 'Removes and reports the byte in one step.',
      code: "if buf and buf[-1] == 0x0a:\n    buf.pop()",
    },
    {
      name: 'Drain the buffer',
      desc: 'The truthiness test guards against the IndexError.',
      code: 'while buf:\n    handle(buf.pop())',
    },
  ],

  examples: [
    { title: 'Pops the last',   code: "bytearray(b'abc').pop()", returns: '99' },
    { title: 'Buffer shrinks',  code: "b = bytearray(b'abc')\nb.pop()\nb", returns: "bytearray(b'ab')" },
    { title: 'By index',        code: "b = bytearray(b'abc')\nb.pop(0)", returns: '97' },
    { title: 'Digits are codes',code: "bytearray(b'123').pop()", returns: '51  # not 3' },
    { title: 'Empty raises',    code: 'bytearray().pop()',       returns: 'IndexError: pop from empty bytearray' },
    { title: 'Returns int',     code: "type(bytearray(b'a').pop())", returns: "<class 'int'>" },
  ],

  pitfalls: [
    {
      name: 'It returns an int, not bytes',
      desc: 'Comparing the result against a bytes literal always fails, silently and without error, because an int is never equal to a bytes object.',
      wrong: { label: 'Never equal', code: "bytearray(b'abc').pop() == b'c'", output: 'False' },
      fix:   { label: 'Compare to an int', code: "bytearray(b'abc').pop() == ord('c')", output: 'True' },
    },
    {
      name: 'No default for an empty buffer',
      desc: 'dict.pop accepts a fallback; this does not. Draining without a guard raises IndexError the moment the buffer empties.',
      wrong: { label: 'Unguarded', code: 'while True:\n    handle(buf.pop())', output: 'IndexError: pop from empty bytearray' },
      fix:   { label: 'Guard the loop', code: 'while buf:\n    handle(buf.pop())', output: 'stops cleanly' },
    },
    {
      name: 'Popping from the front is O(n)',
      desc: 'pop(0) shifts every remaining byte left. Using a bytearray as a FIFO queue this way is quadratic — collections.deque is the right structure.',
      wrong: { label: 'Shifts each time', code: 'while buf:\n    handle(buf.pop(0))', output: 'quadratic' },
      fix:   { label: 'Use a deque',      code: 'from collections import deque\nq = deque(buf)\nq.popleft()', output: 'O(1) per item' },
    },
    {
      name: 'Digits pop as character codes',
      desc: "b'123' holds the characters, so popping gives 51 rather than 3. Treating byte values as the digits they look like is a classic parsing bug.",
      wrong: { label: 'Character code', code: "bytearray(b'123').pop()", output: '51' },
      fix:   { label: 'Decode to parse', code: "int(bytes(bytearray(b'123')))", output: '123' },
    },
  ],

  when: {
    use: [
      'Treating a buffer as a byte stack',
      'Removing and inspecting a trailing byte in one step',
      'Draining a buffer from the end',
    ],
    avoid: [
      'FIFO order → collections.deque',
      'You only want to look → index with buf[-1]',
      'Removing by VALUE rather than position → remove',
    ],
  },

  notes: {
    complexity: 'O(1) from the end; O(n) from anywhere else because of the shift',
    return:     'An int from 0 to 255; the buffer shrinks by one',
    cpython:    'Objects/bytearrayobject.c :: bytearray_pop',
    memory:     'May shrink the internal buffer',
    threadSafe: 'Not safe under concurrent mutation of the same buffer',
  },

  related: [
    { name: 'bytearray.remove', slug: 'bytearray-remove', when: 'Remove by VALUE rather than position' },
    { name: 'bytearray.append', slug: 'bytearray-append', when: 'The other half of stack behaviour' },
    { name: 'list.pop',         slug: 'list-pop',         when: 'The list version of this idea' },
    { name: 'bytearray.clear',  slug: 'bytearray-clear',  when: 'Remove everything at once' },
  ],

  faq: [
    {
      q: 'Why does it return an int?',
      a: 'Because a bytearray is a sequence of integers — indexing gives an int, and so does popping. Only slicing produces a bytes object, which is the asymmetry behind most bytearray confusion.',
      code: "b = bytearray(b'abc')\nb[-1]      # 99\nb[-1:]     # bytearray(b'c')",
    },
    {
      q: 'How do I get a one-byte bytes object instead?',
      a: 'Wrap the result with bytes([...]), or slice rather than pop and then delete. The slice form keeps the type but does not remove anything on its own.',
      code: 'bytes([buf.pop()])',
    },
    {
      q: 'Is there a popleft?',
      a: 'No. pop(0) does the same job but shifts everything left each time. For queue behaviour use collections.deque, which pops from either end in constant time.',
    },
  ],

  history: [
    { version: '3.0', note: 'bytearray introduced as the mutable counterpart to bytes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytearray',
    meta:  'bytearray.pop',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};
