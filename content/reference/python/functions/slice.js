// content/reference/python/functions/slice.js

export const meta = {
  slug:        'slice',
  name:        'slice',
  signature:   'slice(stop) / slice(start, stop[, step])',
  blurb:       'Build a slice object — the thing `x[i:j:k]` creates internally.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'slice range start stop step object __getitem__ index custom builtin sequence',
};

export const method = {
  slug:      'slice',
  name:      'slice',
  signature: 'slice(stop) / slice(start, stop[, step])',
  returns:   { type: 'slice', desc: 'A slice object with .start, .stop, .step attributes. Any of the three can be None. Slice objects are what `x[i:j:k]` syntax creates behind the scenes and passes to __getitem__.' },

  category:    'Built-in function / type',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The thing that `x[i:j:k]` builds. Rarely constructed directly, but essential when writing __getitem__ or extended indexing.',

  cheat: {
    commonCall: 's = slice(2, 10, 2)',
    returns:    'a slice object — usable via x[s]',
    replaces:   'passing three variables to describe an index range',
    watchOut:   'like range, stop is EXCLUSIVE; unlike range, negative step counts down',
  },

  parameters: [
    { name: 'start', type: 'int | None', required: false, default: 'None', desc: 'The first index (inclusive). None means &quot;from the beginning&quot;. In the one-arg form (`slice(stop)`), start defaults to None.' },
    { name: 'stop',  type: 'int | None', required: true,  default: null,   desc: 'The upper bound (exclusive). None means &quot;to the end&quot;. The only argument in the one-arg form.' },
    { name: 'step',  type: 'int | None', required: false, default: 'None', desc: 'The stride. None means 1. Negative values step backward.' },
  ],

  demoParams: [
    { name: 'start', type: 'int', hint: 'start index (empty = None)', input: 'number-or-none' },
    { name: 'stop',  type: 'int', hint: 'stop index (exclusive)',      input: 'number' },
    { name: 'step',  type: 'int', hint: 'step (empty = 1)',              input: 'number-or-none' },
  ],
  cases: [
    { id: 'basic',     label: 'basic',           values: { start: '',  stop: 5,   step: '' } },
    { id: 'from-2',    label: 'from 2',          values: { start: 2,   stop: 10,  step: '' } },
    { id: 'even',      label: 'every 2nd',       values: { start: 0,   stop: 20,  step: 2 } },
    { id: 'reverse',   label: 'reverse',         values: { start: 10,  stop: 0,   step: -1 } },
    { id: 'from-end',  label: 'negative index',  values: { start: -3,  stop: -1,  step: '' } },
    { id: 'all',       label: 'all',             values: { start: '',  stop: '',  step: '' } },
    { id: 'skip-first',label: 'skip first',       values: { start: 1,   stop: '',  step: '' } },
  ],
  demoExplainer: 'slice() builds a slice object — the same thing that `x[i:j:k]` syntax creates. The demo shows the slice object AND how it would apply to a demo list. Any argument can be omitted (None) — for &quot;from the start&quot; use start=None; for &quot;to the end&quot; use stop=None. Negative indices count from the end of the sequence. Negative step counts down.',

  patterns: [
    {
      name: 'When would you construct one explicitly?',
      desc: 'Usually you just write `x[i:j:k]`. slice() is useful when the arguments are variables you compute.',
      code: 's = slice(start, stop, step)\nresult = data[s]',
    },
    {
      name: 'Custom __getitem__ handling',
      desc: 'When implementing a container, __getitem__ receives a slice object for extended indexing.',
      code: 'class Vec:\n    def __getitem__(self, key):\n        if isinstance(key, slice):\n            return self._range(key.start, key.stop, key.step)',
    },
    {
      name: 'Slice indices helper',
      desc: 'slice.indices(length) clips a slice to a sequence length and returns concrete (start, stop, step).',
      code: 's = slice(-3, None)\ns.indices(10)   # (7, 10, 1)',
    },
    {
      name: 'Reusable named slices',
      desc: 'When the same slice pattern is used in many places.',
      code: 'HEADER = slice(0, 8)\nBODY   = slice(8, None)\nheader, body = data[HEADER], data[BODY]',
    },
  ],

  examples: [
    { title: 'One-arg (stop only)', code: 'slice(5)',              returns: 'slice(None, 5, None)' },
    { title: 'Two-arg',             code: 'slice(2, 8)',            returns: 'slice(2, 8, None)' },
    { title: 'Three-arg',           code: 'slice(0, 20, 2)',        returns: 'slice(0, 20, 2)' },
    { title: 'Applied to a list',    code: '[1,2,3,4,5][slice(1, 4)]', returns: '[2, 3, 4]' },
    { title: 'Reverse',             code: '[1,2,3,4,5][slice(None, None, -1)]', returns: '[5, 4, 3, 2, 1]' },
    { title: 'slice.indices',       code: 'slice(-3, None).indices(10)', returns: '(7, 10, 1)' },
  ],

  pitfalls: [
    {
      name: 'The one-arg form takes STOP, not start',
      desc: 'A common typo. `slice(5)` is equivalent to `slice(None, 5, None)` — start defaults to None, stop is the given value. Mirrors the range constructor.',
      wrong: { label: 'Assumed start', code: 'slice(5)', output: 'slice(None, 5, None)  # NOT slice(5, None)' },
      fix:   { label: 'Two-arg for start', code: 'slice(5, None)', output: 'slice(5, None, None)' },
    },
    {
      name: 'None is the default — do NOT confuse with 0',
      desc: '`slice(None, 5)` is not the same as `slice(0, 5)` — they behave the same for positive stops but differ subtly in some __getitem__ implementations. Use None to signal &quot;default&quot;.',
      wrong: { label: 'Zero as default', code: 'slice(0, 5, 1)', output: 'explicit start' },
      fix:   { label: 'None as default', code: 'slice(None, 5, None)', output: 'canonical &quot;default&quot; form' },
    },
    {
      name: 'slice is a TYPE — its constructor returns a slice object',
      desc: 'Like list or dict, slice is both the type name and its constructor. Calling `slice(...)` returns an instance; you would rarely subclass it.',
      wrong: { label: 'Assumed function', code: 'type(slice(5))', output: "<class 'slice'>" },
      fix:   { label: 'It is a type',      code: 'isinstance(slice(5), slice)', output: 'True' },
    },
    {
      name: 'slice is not iterable',
      desc: 'You cannot iterate a slice directly — it is only meaningful when applied to a sequence via __getitem__. To get the actual indices, use slice.indices(length) then range().',
      wrong: { label: 'Direct iter fails', code: 'for i in slice(5): ...', output: "TypeError: 'slice' object is not iterable" },
      fix:   { label: 'Use indices + range', code: 'for i in range(*slice(0, 5).indices(len(x))): ...', output: 'concrete indices' },
    },
  ],

  when: {
    use: [
      'Custom __getitem__ that supports extended indexing',
      'Reusable named slices for readable code',
      'Slicing when the endpoints are computed at runtime',
      'Interfacing with numpy / pandas / other libraries that consume slice objects',
    ],
    avoid: [
      'Literal slice → just write x[i:j:k]',
      'Iteration → use range() instead',
      'Storage of index ranges as a tuple — a slice object is dedicated for the job',
    ],
  },

  notes: {
    complexity: 'O(1) construction',
    return:     'A slice object with .start, .stop, .step attributes',
    cpython:    'Objects/sliceobject.c :: PySlice_New',
    memory:     'Small fixed-size allocation',
    threadSafe: 'Yes — slice objects are immutable',
  },

  related: [
    { name: 'range',    slug: 'range',    when: 'Generate the actual integer sequence' },
    { name: 'enumerate',slug: 'enumerate',when: 'Index and value pairs' },
    { name: 'len',      slug: 'len',      when: 'Needed by slice.indices(len(x)) to concretize' },
  ],

  faq: [
    {
      q: 'When would I ever call slice() directly?',
      a: 'When the start/stop/step values are variables you compute at runtime, or when you want to store a slice as a named constant. In everyday code you just write x[i:j:k] — Python calls slice() for you.',
    },
    {
      q: 'What does the : mean in x[i:j:k]?',
      a: 'Nothing special about the colons — they are the syntax that tells the parser &quot;this is a slice&quot;. Python translates i:j:k into slice(i, j, k) and passes it to x.__getitem__.',
    },
    {
      q: 'How do I get the concrete indices for a slice?',
      a: 'Call slice.indices(length) — it returns a (start, stop, step) tuple clipped to the given length. Then `range(*that_tuple)` gives you the actual iterated indices.',
    },
  ],

  history: [
    { version: '1.0', note: 'slice() has been a builtin since Python 1.0.' },
    { version: '2.3', note: 'slice.indices() method added for clipping to sequence length.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#slice',
    meta:  'slice',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect slice results' },
  ],
};