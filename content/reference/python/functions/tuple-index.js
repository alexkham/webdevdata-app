// content/reference/python/functions/tuple-index.js
//
// Slug is type-prefixed: `index` collides with str.index and list.index.

export const meta = {
  slug:        'tuple-index',
  name:        'tuple.index',
  signature:   'tuple.index(value[, start[, stop]])',
  blurb:       'Position of the first matching element — raises ValueError if absent.',
  category:    'tuple',
  type:        'tuple',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'tuple index position find locate first occurrence valueerror immutable sequence',
};

export const method = {
  slug:      'tuple-index',
  name:      'tuple.index',
  signature: 'tuple.index(value[, start[, stop]])',
  returns:   { type: 'int', desc: 'Lowest index whose element equals value. Raises ValueError if there is no match.' },

  category:    'Tuple method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The other half of the two-method tuple interface. Unlike str.find there is no -1 variant — absence is always an exception.',

  cheat: {
    commonCall: 't.index(value)',
    returns:    'int — the first position, counting from 0',
    replaces:   'next(i for i, x in enumerate(t) if x == value)',
    watchOut:   'raises ValueError when absent; there is no find() for tuples',
  },

  parameters: [
    { name: 'value', type: 'Any', required: true,  default: null,  desc: 'Value to locate. Compared with ==, so equal-but-not-identical objects match.' },
    { name: 'start', type: 'int', required: false, default: '0',   desc: 'Where to begin searching. The returned index is still absolute.' },
    { name: 'stop',  type: 'int', required: false, default: 'len', desc: 'Where to stop searching, exclusive.' },
  ],

  demoParams: [
    { name: 'items', type: 'tuple', hint: 'tuple items, comma separated', input: 'csv' },
    { name: 'value', type: 'Any',   hint: 'value to locate',             input: 'text' },
  ],
  demoTemplate: 'tuple({items}).index({value})',
  cases: [
    { id: 'middle',  label: 'middle element', values: { items: 'a,b,c',   value: 'b' } },
    { id: 'first',   label: 'first element',  values: { items: 'a,b,c',   value: 'a' } },
    { id: 'dupe',    label: 'first of two',   values: { items: 'a,b,a',   value: 'a' } },
    { id: 'missing', label: 'absent raises',  values: { items: 'a,b',     value: 'z' } },
    { id: 'empty',   label: 'empty raises',   values: { items: '',        value: 'a' } },
  ],
  demoExplainer: 'index scans left to right and stops at the first element equal to the value, returning its position. With duplicates you always get the earliest one. A value that is not present raises ValueError — there is no tuple equivalent of str.find that would hand back -1, so absence must be handled with try or checked first with the in operator.',

  patterns: [
    {
      name: 'Look up a column by name',
      desc: 'A header tuple turns names into positions for the rows beneath it.',
      code: 'col = header.index("email")\nvalue = row[col]',
    },
    {
      name: 'Guard with in',
      desc: 'Cheaper to read than a try block when absence is expected.',
      code: 'if value in t:\n    i = t.index(value)',
    },
    {
      name: 'Find the next match after a position',
      desc: 'start skips earlier hits without slicing a copy.',
      code: 'second = t.index(value, t.index(value) + 1)',
    },
  ],

  examples: [
    { title: 'Middle element',  code: "('a', 'b', 'c').index('b')", returns: '1' },
    { title: 'First element',   code: "('a', 'b', 'c').index('a')", returns: '0' },
    { title: 'First of two',    code: "('a', 'b', 'a').index('a')", returns: '0' },
    { title: 'Absent raises',   code: "('a', 'b').index('z')",      returns: 'ValueError: tuple.index(x): x not in tuple' },
    { title: 'Empty raises',    code: "().index('a')",              returns: 'ValueError: tuple.index(x): x not in tuple' },
    { title: 'Search from 1',   code: "('a', 'b', 'a').index('a', 1)", returns: '2' },
  ],

  pitfalls: [
    {
      name: 'There is no find() for tuples',
      desc: 'Strings offer find as a non-raising alternative; sequences do not. Every absent lookup is an exception, so it must be caught or pre-checked.',
      wrong: { label: 'No such method', code: "('a', 'b').find('z')", output: "AttributeError: 'tuple' object has no attribute 'find'" },
      fix:   { label: 'Check first',    code: "i = t.index('z') if 'z' in t else -1", output: '-1' },
    },
    {
      name: 'Only the FIRST match is reported',
      desc: 'With duplicates, index says nothing about how many there are or where the others sit. Code that assumes uniqueness silently reads the wrong row.',
      wrong: { label: 'Hides duplicates', code: "('a', 'b', 'a').index('a')", output: '0  # the second is invisible' },
      fix:   { label: 'Enumerate for all', code: "[i for i, x in enumerate(t) if x == 'a']", output: '[0, 2]' },
    },
    {
      name: 'in followed by index scans twice',
      desc: 'Readable, but it walks the tuple once to test and again to locate. On hot paths catch the exception instead, or use enumerate once.',
      wrong: { label: 'Two scans', code: 'if v in t:\n    i = t.index(v)', output: 'O(2n)' },
      fix:   { label: 'One scan',  code: 'try:\n    i = t.index(v)\nexcept ValueError:\n    i = -1', output: 'O(n)' },
    },
  ],

  when: {
    use: [
      'Mapping a header name to a column position',
      'Locating a known-present value in a fixed record',
      'Any place you would write next(i for i, x in enumerate(t) ...)',
    ],
    avoid: [
      'Absence is expected and normal → test with in first',
      'You need every position → enumerate with a comprehension',
      'You want the COUNT → tuple.count',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; stops at the first match, so often much less',
    return:     'A non-negative int; absence raises rather than returning -1',
    cpython:    'Objects/tupleobject.c :: tupleindex',
    memory:     'No allocation — compares in place, and start avoids slicing',
    threadSafe: 'Yes — tuples are immutable',
  },

  related: [
    { name: 'tuple.count', slug: 'tuple-count', when: 'How many matches, rather than where the first is' },
    { name: 'list.index',  slug: 'list-index',  when: 'The same operation on a list' },
    { name: 'str.index',   slug: 'str-index',   when: 'Locating a substring rather than an element' },
    { name: 'in',          slug: 'in',          when: 'Only need to know whether it is present', category: 'operators' },
  ],

  faq: [
    {
      q: 'Why does it raise instead of returning -1?',
      a: 'Because -1 is a valid index in Python — it means the last element. Returning it for "not found" would make t[t.index(v)] quietly give the wrong element instead of failing. str.find can get away with -1 only because callers are expected to check.',
      code: "t = ('a', 'b')\n# if index returned -1, t[-1] would look like a match",
    },
    {
      q: 'How do I find all the positions?',
      a: 'index only ever reports the first. Use enumerate in a comprehension to collect every match in a single pass.',
      code: '[i for i, x in enumerate(t) if x == value]',
    },
    {
      q: 'Do start and stop make it faster?',
      a: 'They avoid building a slice, which matters on large sequences — t.index(v, 5) does not copy anything, while t[5:].index(v) copies the tail first. Remember the result stays absolute either way, so no offset correction is needed with start.',
      code: "('a', 'b', 'a').index('a', 1)   # 2",
    },
  ],

  history: [
    { version: '2.6', note: 'tuple.index and tuple.count added, aligning tuple with the Sequence interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#common-sequence-operations',
    meta:  'tuple.index',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect sequence data' },
  ],
};
