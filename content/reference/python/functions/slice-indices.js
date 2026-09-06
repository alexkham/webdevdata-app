// content/reference/python/functions/slice-indices.js
//
// Slug is type-prefixed for consistency with the other type methods.

export const meta = {
  slug:        'slice-indices',
  name:        'slice.indices',
  signature:   'slice.indices(length)',
  blurb:       'Resolve a slice against a length into concrete start, stop and step values.',
  category:    'slice',
  type:        'slice',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'slice indices resolve normalize start stop step negative clamp getitem custom sequence',
};

export const method = {
  slug:      'slice-indices',
  name:      'slice.indices',
  signature: 'slice.indices(length)',
  returns:   { type: 'tuple', desc: 'A (start, stop, step) tuple of concrete integers, clamped to a sequence of the given length and safe to drive a range().' },

  category:    'Slice method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Turns the messy slice rules — None defaults, negative indices, out-of-range clamping — into three plain numbers. Essential when writing __getitem__ on your own sequence.',

  cheat: {
    commonCall: 'start, stop, step = s.indices(len(seq))',
    returns:    'tuple of three ints, always safe for range(start, stop, step)',
    replaces:   'hand-written None checks and negative-index arithmetic',
    watchOut:   'a negative step gives a stop of -1, which is a sentinel, not an index',
  },

  parameters: [
    { name: 'length', type: 'int', required: true, default: null, desc: 'Length of the sequence the slice will be applied to. Must be non-negative.' },
  ],

  demoParams: [
    { name: 'start',  type: 'int', hint: 'slice start (blank = None)', input: 'number-or-none' },
    { name: 'stop',   type: 'int', hint: 'slice stop (blank = None)',  input: 'number-or-none' },
    { name: 'step',   type: 'int', hint: 'slice step (blank = None)',  input: 'number-or-none' },
    { name: 'length', type: 'int', hint: 'sequence length',            input: 'number' },
  ],
  demoTemplate: 'slice({start}, {stop}, {step}).indices({length})',
  cases: [
    { id: 'explicit', label: 'all explicit',    values: { start: 1, stop: 5, step: 2, length: 10 } },
    { id: 'defaults', label: 'all None',        values: { start: '', stop: '', step: '', length: 5 } },
    { id: 'negative', label: 'negative start',  values: { start: -3, stop: '', step: '', length: 10 } },
    { id: 'reverse',  label: 'reversed (-1)',   values: { start: '', stop: '', step: -1, length: 4 } },
    { id: 'clamped',  label: 'stop past end',   values: { start: 0, stop: 99, step: '', length: 5 } },
  ],
  demoExplainer: 'Every None is filled in and every negative index is resolved against the length. slice(None, None, None) on a length of 5 becomes (0, 5, 1). A start of -3 with length 10 becomes 7. An out-of-range stop of 99 is clamped down to the length. The reversed case is the one to study: a step of -1 gives (3, -1, -1), where that -1 stop is a SENTINEL meaning "go past position 0", not a negative index — which is exactly why you should feed these numbers to range() rather than back into a slice.',

  patterns: [
    {
      name: 'Implement __getitem__ for a custom sequence',
      desc: 'The canonical use — handle a slice without reimplementing Python\'s rules.',
      code: 'def __getitem__(self, key):\n    if isinstance(key, slice):\n        return [self._data[i] for i in range(*key.indices(len(self)))]\n    return self._data[key]',
    },
    {
      name: 'Iterate the positions a slice would touch',
      desc: 'Unpacking straight into range gives exactly the visited indices.',
      code: 'for i in range(*s.indices(len(seq))):\n    ...',
    },
    {
      name: 'Count how many items a slice yields',
      desc: 'len(range(...)) is O(1) and needs no list.',
      code: 'n = len(range(*s.indices(len(seq))))',
    },
  ],

  examples: [
    { title: 'All explicit',   code: 'slice(1, 5, 2).indices(10)',       returns: '(1, 5, 2)' },
    { title: 'All defaults',   code: 'slice(None).indices(5)',           returns: '(0, 5, 1)' },
    { title: 'Negative start', code: 'slice(-3, None).indices(10)',      returns: '(7, 10, 1)' },
    { title: 'Reversed',       code: 'slice(None, None, -1).indices(4)', returns: '(3, -1, -1)' },
    { title: 'Clamped stop',   code: 'slice(0, 99).indices(5)',          returns: '(0, 5, 1)' },
    { title: 'Drives range',   code: 'list(range(*slice(1, 5, 2).indices(10)))', returns: '[1, 3]' },
  ],

  pitfalls: [
    {
      name: 'The -1 stop on a reversed slice is a sentinel',
      desc: 'For a negative step the stop can be -1, meaning "one before position 0". Putting that back into a slice reads it as the LAST element instead, which silently truncates the result.',
      wrong: { label: 'Reinterpreted', code: 'start, stop, step = slice(None, None, -1).indices(4)\nseq[start:stop:step]', output: 'wrong — stop -1 now means the last item' },
      fix:   { label: 'Feed it to range', code: '[seq[i] for i in range(*slice(None, None, -1).indices(4))]', output: 'the correct reversed items' },
    },
    {
      name: 'A zero step raises',
      desc: 'slice(None, None, 0) constructs happily — the error only appears when indices resolves it, which can be far from where the slice was built.',
      wrong: { label: 'Deferred error', code: 'slice(None, None, 0).indices(5)', output: 'ValueError: slice step cannot be zero' },
      fix:   { label: 'Validate early', code: 'if s.step == 0:\n    raise ValueError("step cannot be zero")', output: 'fails at the source' },
    },
    {
      name: 'It never raises for out-of-range bounds',
      desc: 'Slices clamp rather than raising, and indices preserves that. A stop of 99 against a length of 5 quietly becomes 5, so it cannot be used to validate user input.',
      wrong: { label: 'Silently clamped', code: 'slice(0, 99).indices(5)', output: '(0, 5, 1)' },
      fix:   { label: 'Check separately', code: 'if s.stop is not None and s.stop > len(seq):\n    raise IndexError(s.stop)', output: 'explicit' },
    },
  ],

  when: {
    use: [
      'Implementing __getitem__ or __setitem__ on a custom sequence',
      'Converting a slice into the exact positions it touches',
      'Counting the items a slice would produce, without building it',
    ],
    avoid: [
      'Slicing a built-in list or string → just use seq[s], which does this internally',
      'Validating user-supplied bounds → it clamps instead of raising',
      'Feeding the result back into another slice → use range instead',
    ],
  },

  notes: {
    complexity: 'O(1) — a handful of comparisons and clamps',
    return:     'A new three-item tuple, always valid for range()',
    cpython:    'Objects/sliceobject.c :: slice_indices',
    memory:     'Allocates one small tuple',
    threadSafe: 'Yes — slice objects are immutable',
  },

  related: [
    { name: 'slice',       slug: 'slice',       when: 'Build the slice object in the first place' },
    { name: 'range',       slug: 'range',       when: 'Consume the result — range(*s.indices(n))' },
    { name: 'len',         slug: 'len',         when: 'Supply the length argument' },
    { name: 'enumerate',   slug: 'enumerate',   when: 'Positions and values together while looping' },
  ],

  faq: [
    {
      q: 'Why does a reversed slice give a stop of -1?',
      a: 'Because a negative step walks downwards and must be able to include position 0. The stop is exclusive, so it has to sit one below — which is -1. It is a loop bound for range, not an index into the sequence.',
      code: 'slice(None, None, -1).indices(4)\n# (3, -1, -1)',
    },
    {
      q: 'When would I actually call this?',
      a: 'Almost exclusively when writing a container class. Built-in sequences apply these rules for you, but your own __getitem__ receives a raw slice object with Nones and negatives intact, and indices normalises it in one call.',
      code: 'range(*key.indices(len(self)))',
    },
    {
      q: 'Does it work with a length of zero?',
      a: 'Yes. Every bound clamps to 0, so you get an empty range and the loop simply does not execute. That is what makes it safe to call before checking whether the sequence is empty.',
      code: 'slice(None).indices(0)\n# (0, 0, 1)',
    },
  ],

  history: [
    { version: '2.3', note: 'slice.indices added alongside extended slicing support.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/datamodel.html#slice.indices',
    meta:  'slice.indices',
  },

  tryInTool: [],
};
