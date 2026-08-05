// content/reference/python/functions/range.js

export const meta = {
  slug:        'range',
  name:        'range',
  signature:   'range(stop) / range(start, stop[, step])',
  blurb:       'A lazy arithmetic sequence — half-open interval, integer only.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'range iterate for loop sequence integer start stop step exclusive count',
};

export const method = {
  slug:      'range',
  name:      'range',
  signature: 'range(stop) / range(start, stop[, step])',
  returns:   { type: 'range', desc: 'A lazy sequence of integers from start (inclusive) to stop (EXCLUSIVE) stepping by step. Not a list — a `range` object that supports iteration, indexing, len(), and slicing. Memory-efficient: only start/stop/step are stored.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'A memory-efficient arithmetic progression — the standard tool for &quot;iterate N times&quot; or &quot;count from a to b&quot;.',

  cheat: {
    commonCall: 'for i in range(n):',
    returns:    'range object — iterable, sized, indexable, sliceable — but NOT a list',
    replaces:   'the manual `while i < n: i += 1` pattern',
    watchOut:   'stop is EXCLUSIVE; step of 0 raises; negative step needs start &gt; stop or you get empty',
  },

  parameters: [
    { name: 'start', type: 'int', required: false, default: '0',    desc: 'The first value in the sequence (inclusive). Omitted → 0.' },
    { name: 'stop',  type: 'int', required: true,  default: null,   desc: 'The exclusive upper bound. The sequence stops BEFORE reaching this value.' },
    { name: 'step',  type: 'int', required: false, default: '1',    desc: 'The increment between consecutive values. Must be non-zero — 0 raises ValueError. Negative steps count downward.' },
  ],

  demoParams: [
    { name: 'start', type: 'int', hint: 'inclusive start (empty = 0)', input: 'number-or-none' },
    { name: 'stop',  type: 'int', hint: 'exclusive end',                input: 'number' },
    { name: 'step',  type: 'int', hint: 'step (empty = 1)',             input: 'number-or-none' },
  ],
  cases: [
    { id: 'basic',     label: 'basic (0..N)',   values: { start: '',  stop: 5,   step: '' } },
    { id: 'from-2',    label: 'from 2',         values: { start: 2,   stop: 10,  step: '' } },
    { id: 'even',      label: 'even numbers',   values: { start: 0,   stop: 20,  step: 2 } },
    { id: 'countdown', label: 'countdown',      values: { start: 10,  stop: 0,   step: -1 } },
    { id: 'negatives', label: 'negatives',      values: { start: -5,  stop: 5,   step: '' } },
    { id: 'empty',     label: 'empty (start≥stop)', values: { start: 5, stop: 5, step: '' } },
    { id: 'reverse-empty', label: 'wrong direction', values: { start: 0, stop: 5, step: -1 } },
  ],
  demoExplainer: 'range produces the sequence start, start+step, start+2*step, ... stopping BEFORE it reaches stop. That half-open interval matches slicing conventions. Positive step counts up until stop is reached or exceeded; negative step counts down; a step in the wrong direction (say, negative when start &lt; stop) produces an empty range. The demo shows the values as a list for clarity — real code iterates a range object directly.',

  patterns: [
    {
      name: 'Fixed-count loop',
      desc: 'The most common use — iterate exactly n times.',
      code: 'for i in range(n):\n    do_step(i)',
    },
    {
      name: 'Countdown',
      desc: 'Negative step counts backward.',
      code: 'for i in range(10, 0, -1):\n    print(i)',
    },
    {
      name: 'Index and value with enumerate',
      desc: 'For iterating a list with both index and value, prefer enumerate to `for i in range(len(x))`.',
      code: 'for i, item in enumerate(items):\n    process(i, item)',
    },
    {
      name: 'Slicing a range',
      desc: 'range objects support slicing — the result is another range.',
      code: 'r = range(100)\nfirst_ten = r[:10]      # range(0, 10)\nevery_third = r[::3]    # range(0, 100, 3)',
    },
  ],

  examples: [
    { title: 'Basic',            code: 'list(range(5))',           returns: '[0, 1, 2, 3, 4]' },
    { title: 'From 2 to 10',     code: 'list(range(2, 10))',       returns: '[2, 3, 4, 5, 6, 7, 8, 9]' },
    { title: 'Even numbers',     code: 'list(range(0, 20, 2))',    returns: '[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]' },
    { title: 'Countdown',        code: 'list(range(10, 0, -1))',   returns: '[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]' },
    { title: 'Negatives',        code: 'list(range(-3, 4))',       returns: '[-3, -2, -1, 0, 1, 2, 3]' },
    { title: 'Empty (start=stop)', code: 'list(range(5, 5))',       returns: '[]' },
    { title: 'Wrong direction',   code: 'list(range(0, 5, -1))',     returns: '[]' },
    { title: 'Step of zero raises', code: 'range(0, 5, 0)',            returns: 'ValueError: range() arg 3 must not be zero' },
  ],

  pitfalls: [
    {
      name: 'stop is EXCLUSIVE — the classic off-by-one',
      desc: 'range(n) produces 0, 1, ..., n-1 — it does NOT reach n. Great for indexing, misleading when you counted up in your head.',
      wrong: { label: 'Missing last value', code: 'list(range(1, 5))', output: '[1, 2, 3, 4]  # 5 is not included' },
      fix:   { label: 'Inclusive end',      code: 'list(range(1, 6))', output: '[1, 2, 3, 4, 5]' },
    },
    {
      name: 'Wrong-direction step gives EMPTY, not an error',
      desc: 'range(0, 5, -1) produces nothing — silent no-op. If you meant to count down, put the larger value first.',
      wrong: { label: 'Empty silently', code: 'list(range(0, 5, -1))', output: '[]' },
      fix:   { label: 'Reverse direction', code: 'list(range(5, 0, -1))', output: '[5, 4, 3, 2, 1]' },
    },
    {
      name: 'Step of zero raises ValueError',
      desc: 'A zero step would loop forever — Python rejects it up front.',
      wrong: { label: 'Zero step',   code: 'range(0, 10, 0)', output: 'ValueError: range() arg 3 must not be zero' },
      fix:   { label: 'Non-zero',    code: 'range(0, 10, 1)', output: 'range(0, 10)' },
    },
    {
      name: 'range is NOT a list',
      desc: 'Iterating works; indexing works; len works; slicing works. But `range(5) == [0, 1, 2, 3, 4]` is False — the objects have different types. Wrap in list() for equality tests against lists.',
      wrong: { label: 'Wrong type', code: 'range(5) == [0, 1, 2, 3, 4]', output: 'False' },
      fix:   { label: 'Convert',    code: 'list(range(5)) == [0, 1, 2, 3, 4]', output: 'True' },
    },
    {
      name: 'range only works with integers',
      desc: 'Float arguments raise TypeError. For a range of floats, use a comprehension or numpy.',
      wrong: { label: 'Float rejected', code: 'range(0.0, 1.0, 0.1)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'Comprehension',  code: '[i * 0.1 for i in range(10)]', output: '[0.0, 0.1, 0.2, ..., 0.9]' },
    },
  ],

  when: {
    use: [
      '&quot;Do this N times&quot; — the fixed-count loop',
      'Counting up or down with a fixed step',
      'Slicing indices you will later apply to a sequence',
      'Memory-efficient iteration over arithmetic progressions',
    ],
    avoid: [
      'Iterating a list with index AND value → enumerate is idiomatic',
      'Float progressions → comprehension or numpy',
      'Non-uniform sequences → build a list explicitly',
      '`range(len(x))` when you actually want the items → iterate x directly',
    ],
  },

  notes: {
    complexity: 'O(1) to construct; O(n) to iterate',
    return:     'A range object — constant memory regardless of length',
    cpython:    'Objects/rangeobject.c :: range_new',
    memory:     'O(1) — only start/stop/step are stored, values are computed on demand',
    threadSafe: 'Yes — range objects are immutable',
  },

  related: [
    { name: 'enumerate', slug: 'enumerate', when: 'Iterate a sequence with (index, value) pairs' },
    { name: 'reversed',  slug: 'reversed',  when: 'Reverse without building a negative-step range' },
    { name: 'len',       slug: 'len',       when: 'How many values a range would produce' },
    { name: 'sum',       slug: 'sum',       when: 'Sum the arithmetic progression directly' },
  ],

  faq: [
    {
      q: 'Is range a function or a type?',
      a: 'A type. `range(5)` calls the constructor and returns a range OBJECT. This is why `range` is not deprecated even though `list` is a type — both are called like functions.',
    },
    {
      q: 'Why is stop exclusive?',
      a: 'Consistency with slicing (a[i:j] excludes j) and with the C tradition (0..n-1 iterates n times). It makes range(n) exactly the valid indices for a length-n sequence and makes concatenation clean: range(0, k) + range(k, n) = range(0, n).',
    },
    {
      q: 'How do I include the stop value?',
      a: 'Add 1 (or step) to stop. For range(a, b) inclusive of b: `range(a, b + 1)`. For a stepped one, `range(a, b + step, step)`.',
    },
  ],

  history: [
    { version: '1.0', note: 'range() built the list eagerly — same as list(range(...)) in Python 3.' },
    { version: '2.2', note: 'xrange() introduced as a lazy alternative.' },
    { version: '3.0', note: 'range became lazy (the old xrange behavior); xrange removed.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#func-range',
    meta:  'range',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the resulting values' },
  ],
};