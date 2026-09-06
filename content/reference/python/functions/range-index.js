// content/reference/python/functions/range-index.js
//
// Slug is type-prefixed: `index` collides with str/list/tuple index.

export const meta = {
  slug:        'range-index',
  name:        'range.index',
  signature:   'range.index(value)',
  blurb:       'Position of a value within the range — computed by arithmetic, not by scanning.',
  category:    'range',
  type:        'range',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'range index position offset sequence protocol valueerror not in range arithmetic',
};

export const method = {
  slug:      'range-index',
  name:      'range.index',
  signature: 'range.index(value)',
  returns:   { type: 'int', desc: 'The 0-based position of value within the range. Raises ValueError if the value is not a member.' },

  category:    'Range method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Position, not value — range(2, 10).index(5) is 3, because 5 is the fourth number in the sequence. The distinction trips people constantly.',

  cheat: {
    commonCall: 'r.index(value)',
    returns:    'int — how many steps into the range the value sits',
    replaces:   '(value - r.start) // r.step, with the bounds checking done for you',
    watchOut:   'the position is not the value; only range(0, n) makes them match',
  },

  parameters: [
    { name: 'value', type: 'Any', required: true, default: null, desc: 'Value to locate. Anything not in the range raises ValueError, including non-integers.' },
  ],

  demoParams: [
    { name: 'start', type: 'int', hint: 'range start',     input: 'number' },
    { name: 'stop',  type: 'int', hint: 'range stop',      input: 'number' },
    { name: 'value', type: 'int', hint: 'value to locate', input: 'number' },
  ],
  demoTemplate: 'range({start}, {stop}).index({value})',
  cases: [
    { id: 'zero-based', label: 'from 0 — matches',  values: { start: 0, stop: 10, value: 3 } },
    { id: 'offset',     label: 'offset — differs',  values: { start: 2, stop: 10, value: 5 } },
    { id: 'first',      label: 'first element',     values: { start: 5, stop: 10, value: 5 } },
    { id: 'missing',    label: 'not a member',      values: { start: 0, stop: 10, value: 20 } },
    { id: 'below',      label: 'below the start',   values: { start: 5, stop: 10, value: 2 } },
  ],
  demoExplainer: 'Compare the first two cases. In range(0, 10) the value 3 sits at position 3, so they match and everything looks obvious. In range(2, 10) the value 5 sits at position 3, because the sequence runs 2, 3, 4, 5 — the value and its index have come apart. That gap is the whole point of the method, and the reason it is worth using instead of subtracting by hand. A value outside the range raises ValueError rather than returning -1.',

  patterns: [
    {
      name: 'Turn a value into an offset',
      desc: 'Maps a real-world number onto a zero-based array position.',
      code: 'row = range(FIRST_YEAR, LAST_YEAR + 1).index(year)',
    },
    {
      name: 'Validate and locate in one step',
      desc: 'The ValueError doubles as the bounds check.',
      code: 'try:\n    slot = valid.index(value)\nexcept ValueError:\n    raise ValueError(f"{value} out of range")',
    },
    {
      name: 'Bucket a number into a scale',
      desc: 'Combined with a step, this converts a measurement into a bucket number.',
      code: 'bucket = range(0, 100, 10).index(value - value % 10)',
    },
  ],

  examples: [
    { title: 'Zero-based matches', code: 'range(0, 10).index(3)',    returns: '3' },
    { title: 'Offset differs',     code: 'range(2, 10).index(5)',    returns: '3' },
    { title: 'First element',      code: 'range(5, 10).index(5)',    returns: '0' },
    { title: 'With a step',        code: 'range(0, 10, 2).index(4)', returns: '2' },
    { title: 'Not a member',       code: 'range(0, 10).index(20)',   returns: 'ValueError: 20 is not in range' },
    { title: 'Huge range',         code: 'range(10 ** 18).index(5)', returns: '5  # instant' },
  ],

  pitfalls: [
    {
      name: 'The index is not the value',
      desc: 'They coincide only for range(0, n), which is exactly the case people test with. Move the start and the two diverge silently, giving a plausible but wrong number.',
      wrong: { label: 'Assumed identical', code: 'range(2, 10).index(5)', output: '3, not 5' },
      fix:   { label: 'Read it as a position', code: 'list(range(2, 10)).index(5)', output: '3  # same answer, clearer' },
    },
    {
      name: 'Raises rather than returning -1',
      desc: 'Like list.index and unlike str.find, absence is an exception. There is no non-raising variant, so unguarded calls on user data will crash.',
      wrong: { label: 'Uncaught', code: 'range(0, 10).index(20)', output: 'ValueError: 20 is not in range' },
      fix:   { label: 'Check first', code: 'i = r.index(v) if v in r else -1', output: '-1' },
    },
    {
      name: 'The step affects the position too',
      desc: 'With a step of 2, position 2 holds the value 4. Both the offset and the stride have to be undone, which is precisely the arithmetic this method exists to get right.',
      wrong: { label: 'Off by a factor', code: 'range(0, 10, 2).index(4)', output: '2, not 4' },
      fix:   { label: 'Let it do the maths', code: '(4 - 0) // 2', output: '2  # the same calculation' },
    },
  ],

  when: {
    use: [
      'Converting a real-world value into a zero-based offset',
      'Validating membership and getting the position together',
      'Generic code that calls index on any sequence',
    ],
    avoid: [
      'You only need membership → the in operator',
      'Absence is expected → check with in first, since there is no -1 form',
      'You want the VALUE at a position → subscript the range with r[i]',
    ],
  },

  notes: {
    complexity: 'O(1) — one division; never a scan, whatever the span',
    return:     'A non-negative int; absence raises rather than returning -1',
    cpython:    'Objects/rangeobject.c :: range_index',
    memory:     'No allocation — a range is three integers regardless of length',
    threadSafe: 'Yes — ranges are immutable',
  },

  related: [
    { name: 'range',       slug: 'range',       when: 'Build the range in the first place' },
    { name: 'range.count', slug: 'range-count', when: 'Whether the value is present, rather than where' },
    { name: 'list.index',  slug: 'list-index',  when: 'The same idea on a list, but O(n)' },
    { name: 'enumerate',   slug: 'enumerate',   when: 'Positions and values together while looping' },
  ],

  faq: [
    {
      q: 'Why is range(2, 10).index(5) equal to 3?',
      a: 'Because index reports a POSITION. The sequence is 2, 3, 4, 5, 6, 7, 8, 9, and 5 is the fourth item — position 3 counting from zero. The value and the index only coincide when the range starts at 0 with a step of 1.',
      code: 'list(range(2, 10))\n# [2, 3, 4, 5, 6, 7, 8, 9]',
    },
    {
      q: 'Is it O(1) like range.count?',
      a: 'Yes. It checks membership and then computes (value - start) // step, so span is irrelevant — range(10 ** 18).index(5) returns immediately.',
      code: 'range(10 ** 18).index(5)\n# 5',
    },
    {
      q: 'Why does it not accept start and stop arguments?',
      a: 'list.index takes optional start and stop bounds, but range.index does not — searching a sub-range is just another range, so the arguments would be redundant. Passing them is a TypeError.',
      code: 'range(0, 10).index(3, 1)\n# TypeError',
    },
  ],

  history: [
    { version: '3.2', note: 'range gained index and count, completing the Sequence interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#common-sequence-operations',
    meta:  'range.index',
  },

  tryInTool: [],
};
