// content/reference/python/functions/range-count.js
//
// Slug is type-prefixed: `count` collides with str/list/tuple count.

export const meta = {
  slug:        'range-count',
  name:        'range.count',
  signature:   'range.count(value)',
  blurb:       'How many times a value appears in the range — only ever 0 or 1.',
  category:    'range',
  type:        'range',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'range count occurrences membership sequence protocol contains zero one',
};

export const method = {
  slug:      'range-count',
  name:      'range.count',
  signature: 'range.count(value)',
  returns:   { type: 'int', desc: 'Always 0 or 1, because a range never repeats a value.' },

  category:    'Range method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Exists so range satisfies the Sequence interface. Since ranges never contain duplicates, the answer is only ever 0 or 1 — which makes the in operator the clearer choice.',

  cheat: {
    commonCall: 'r.count(value)',
    returns:    'int — 0 or 1, never more',
    replaces:   'nothing useful; value in r says the same thing better',
    watchOut:   'it is O(1) arithmetic, not a scan — even for range(10 ** 18)',
  },

  parameters: [
    { name: 'value', type: 'Any', required: true, default: null, desc: 'Value to look for. Non-integers are allowed and simply return 0.' },
  ],

  demoParams: [
    { name: 'start', type: 'int', hint: 'range start',    input: 'number' },
    { name: 'stop',  type: 'int', hint: 'range stop',     input: 'number' },
    { name: 'value', type: 'int', hint: 'value to count', input: 'number' },
  ],
  demoTemplate: 'range({start}, {stop}).count({value})',
  cases: [
    { id: 'present', label: 'value in range',  values: { start: 0, stop: 10, value: 3 } },
    { id: 'absent',  label: 'value outside',   values: { start: 0, stop: 10, value: 20 } },
    { id: 'edge',    label: 'stop is excluded',values: { start: 0, stop: 10, value: 10 } },
    { id: 'offset',  label: 'offset range',    values: { start: 2, stop: 10, value: 5 } },
    { id: 'empty',   label: 'empty range',     values: { start: 0, stop: 0, value: 1 } },
  ],
  demoExplainer: 'The answer is only ever 0 or 1, because a range is an arithmetic sequence with no repeats. Note the third case: range(0, 10) stops BEFORE 10, so counting 10 gives 0. The important detail is invisible here — this is not a scan. Python computes the answer with arithmetic, so counting inside range(10 ** 18) is instant.',

  patterns: [
    {
      name: 'Prefer the in operator',
      desc: 'Same information, same speed, and it reads as the question you are asking.',
      code: 'if value in range(0, 100):\n    ...',
    },
    {
      name: 'Duck-typed sequence code',
      desc: 'Where count is called generically, range answers without special-casing.',
      code: 'def occurrences(seq, v):\n    return seq.count(v)   # list, tuple or range',
    },
    {
      name: 'Bounds check without building a list',
      desc: 'The range object holds three numbers regardless of its span.',
      code: 'in_bounds = bool(range(0, size).count(index))',
    },
  ],

  examples: [
    { title: 'Present',        code: 'range(0, 10).count(3)',    returns: '1' },
    { title: 'Absent',         code: 'range(0, 10).count(20)',   returns: '0' },
    { title: 'Stop excluded',  code: 'range(0, 10).count(10)',   returns: '0' },
    { title: 'Step skips it',  code: 'range(0, 10, 2).count(3)', returns: '0' },
    { title: 'Empty range',    code: 'range(0, 0).count(1)',     returns: '0' },
    { title: 'Huge range',     code: 'range(10 ** 18).count(5)', returns: '1  # instant' },
  ],

  pitfalls: [
    {
      name: 'The step is easy to forget',
      desc: 'A value inside the bounds still counts 0 if the step steps over it. range(0, 10, 2) contains only even numbers, so 3 is simply not a member.',
      wrong: { label: 'Inside but skipped', code: 'range(0, 10, 2).count(3)', output: '0' },
      fix:   { label: 'Check the step',     code: 'range(0, 10, 2).count(4)', output: '1' },
    },
    {
      name: 'stop is never included',
      desc: 'The classic off-by-one. range(0, 10) runs 0 to 9, so counting 10 gives 0 even though it looks like the upper bound.',
      wrong: { label: 'Excluded', code: 'range(0, 10).count(10)', output: '0' },
      fix:   { label: 'Widen it', code: 'range(0, 11).count(10)', output: '1' },
    },
    {
      name: 'It is not a real tally',
      desc: 'Reaching for count implies asking how many. On a range the answer is always 0 or 1, so the method mostly signals that the author expected a different type.',
      wrong: { label: 'Misleading intent', code: 'n = r.count(v)   # looks like a tally', output: '0 or 1, never more' },
      fix:   { label: 'Say what you mean', code: 'present = v in r', output: 'clearer' },
    },
  ],

  when: {
    use: [
      'Generic code that calls count on any sequence',
      'Satisfying an interface that expects the Sequence protocol',
    ],
    avoid: [
      'Membership tests → the in operator, which reads far better',
      'Actual tallies → a list, tuple or collections.Counter',
    ],
  },

  notes: {
    complexity: 'O(1) — arithmetic on start, stop and step; never a scan',
    return:     'An int that is always 0 or 1',
    cpython:    'Objects/rangeobject.c :: range_count',
    memory:     'No allocation — the range itself is three integers regardless of span',
    threadSafe: 'Yes — ranges are immutable',
  },

  related: [
    { name: 'range',       slug: 'range',       when: 'Build the range in the first place' },
    { name: 'range.index', slug: 'range-index', when: 'The POSITION of a value rather than whether it is there' },
    { name: 'in',          slug: 'in',          when: 'The idiomatic membership test', category: 'operators' },
    { name: 'list.count',  slug: 'list-count',  when: 'A real tally, where duplicates are possible' },
  ],

  faq: [
    {
      q: 'Why does range even have count?',
      a: 'Because range is registered as a Sequence, and that interface requires count and index. Implementing them keeps duck-typed code working when a range is passed where a list was expected.',
      code: 'import collections.abc\nisinstance(range(3), collections.abc.Sequence)\n# True',
    },
    {
      q: 'Is it really O(1) on a huge range?',
      a: 'Yes. A range stores only start, stop and step, so membership is a division and a couple of comparisons. range(10 ** 18).count(5) returns instantly, where the same test on a list would need 10 ** 18 elements to exist.',
      code: 'range(10 ** 18).count(5)\n# 1',
    },
    {
      q: 'Should I use count or in?',
      a: 'in, essentially always. They cost the same, but in states the question directly and returns a bool, while count returns a number that can only ever be 0 or 1.',
      code: 'if v in r:      # preferred\nif r.count(v):  # works, reads oddly',
    },
  ],

  history: [
    { version: '3.2', note: 'range gained count and index, completing the Sequence interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#common-sequence-operations',
    meta:  'range.count',
  },

  tryInTool: [],
};
