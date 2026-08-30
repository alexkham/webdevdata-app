// content/reference/python/functions/tuple-count.js
//
// Slug is type-prefixed: `count` collides with str.count and list.count.

export const meta = {
  slug:        'tuple-count',
  name:        'tuple.count',
  signature:   'tuple.count(value)',
  blurb:       'How many times a value appears in the tuple — one of only two tuple methods.',
  category:    'tuple',
  type:        'tuple',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'tuple count occurrences how many times frequency tally immutable sequence',
};

export const method = {
  slug:      'tuple-count',
  name:      'tuple.count',
  signature: 'tuple.count(value)',
  returns:   { type: 'int', desc: 'Number of elements equal to value. Returns 0 rather than raising when there are none.' },

  category:    'Tuple method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Tuples have exactly two methods, count and index, because everything else would mutate. This is the counting half.',

  cheat: {
    commonCall: 't.count(value)',
    returns:    'int — 0 when the value is absent, never an error',
    replaces:   'sum(1 for x in t if x == value)',
    watchOut:   'matches by ==, so True counts as 1 and 1.0 counts as 1',
  },

  parameters: [
    { name: 'value', type: 'Any', required: true, default: null, desc: 'Value to look for. Compared with ==, so equal-but-not-identical objects still match.' },
  ],

  demoParams: [
    { name: 'items', type: 'tuple', hint: 'tuple items, comma separated', input: 'csv' },
    { name: 'value', type: 'Any',   hint: 'value to count',              input: 'text' },
  ],
  demoTemplate: 'tuple({items}).count({value})',
  cases: [
    { id: 'twice',   label: 'appears twice',  values: { items: 'a,b,a',     value: 'a' } },
    { id: 'once',    label: 'appears once',   values: { items: 'a,b,c',     value: 'b' } },
    { id: 'absent',  label: 'absent is 0',    values: { items: 'a,b',       value: 'z' } },
    { id: 'all',     label: 'every element',  values: { items: 'x,x,x',     value: 'x' } },
    { id: 'empty',   label: 'empty tuple',    values: { items: '',          value: 'a' } },
  ],
  demoExplainer: 'count walks the whole tuple and tallies elements equal to the value. There is no early exit — it always looks at every element, because it cannot know there are no more matches ahead. An absent value gives 0 rather than an error, which is the main difference from index. The demo builds the tuple with tuple([...]) so the call preview stays valid Python.',

  patterns: [
    {
      name: 'Check for duplicates',
      desc: 'More than one occurrence means the value is repeated.',
      code: 'if t.count(value) > 1:\n    raise ValueError(f"duplicate {value}")',
    },
    {
      name: 'Tally a fixed record',
      desc: 'Tuples often hold fixed rows; counting a flag value summarises them.',
      code: 'passes = row.count("OK")',
    },
    {
      name: 'Count everything at once',
      desc: 'Calling count per value is O(n) each time — Counter does it in one pass.',
      code: 'from collections import Counter\ntallies = Counter(t)',
    },
  ],

  examples: [
    { title: 'Appears twice',   code: "('a', 'b', 'a').count('a')", returns: '2' },
    { title: 'Appears once',    code: "('a', 'b', 'c').count('b')", returns: '1' },
    { title: 'Absent is zero',  code: "('a', 'b').count('z')",      returns: '0' },
    { title: 'Every element',   code: "('x', 'x', 'x').count('x')", returns: '3' },
    { title: 'Empty tuple',     code: "().count('a')",              returns: '0' },
    { title: 'True equals 1',   code: '(1, True, 1.0).count(1)',    returns: '3' },
  ],

  pitfalls: [
    {
      name: 'True, 1 and 1.0 all count as each other',
      desc: 'Matching uses ==, and in Python True == 1 == 1.0. A tuple mixing booleans and numbers gives counts that look wrong until you remember that.',
      wrong: { label: 'Surprising total', code: '(1, True, 1.0).count(1)', output: '3' },
      fix:   { label: 'Compare identity too', code: 'sum(1 for x in t if x is 1)', output: 'only the literal int' },
    },
    {
      name: 'Counting each value separately is quadratic',
      desc: 'Every call rescans the whole tuple. Counting many distinct values in a loop turns an O(n) job into O(n * k) — use Counter for one pass.',
      wrong: { label: 'Rescans per value', code: 'tallies = {v: t.count(v) for v in set(t)}', output: 'O(n * k)' },
      fix:   { label: 'One pass',          code: 'from collections import Counter\ntallies = Counter(t)', output: 'O(n)' },
    },
    {
      name: 'It counts elements, not substrings',
      desc: 'Unlike str.count, this compares whole elements. Looking for a fragment inside string elements finds nothing.',
      wrong: { label: 'No partial match', code: "('abc', 'abd').count('ab')", output: '0' },
      fix:   { label: 'Test each element', code: "sum(1 for s in t if 'ab' in s)", output: '2' },
    },
  ],

  when: {
    use: [
      'Checking whether a value repeats in a fixed record',
      'A single tally over a small tuple',
      'Validating that a value appears exactly once',
    ],
    avoid: [
      'Tallying many values → collections.Counter, one pass',
      'You only need presence → the in operator, which short-circuits',
      'You want the POSITION → tuple.index',
    ],
  },

  notes: {
    complexity: 'O(n) — always scans the whole tuple, with no early exit',
    return:     'A non-negative int; 0 when the value is absent',
    cpython:    'Objects/tupleobject.c :: tuplecount',
    memory:     'No allocation — compares in place',
    threadSafe: 'Yes — tuples are immutable',
  },

  related: [
    { name: 'tuple.index', slug: 'tuple-index', when: 'Where the value is, rather than how many' },
    { name: 'list.count',  slug: 'list-count',  when: 'The same operation on a list' },
    { name: 'str.count',   slug: 'str-count',   when: 'Counting substrings rather than elements' },
    { name: 'tuple',       slug: 'tuple',       when: 'Build the tuple in the first place' },
  ],

  faq: [
    {
      q: 'Why do tuples only have two methods?',
      a: 'Because tuples are immutable, every method that would append, remove, sort or reverse is impossible. What is left are the two questions you can ask without changing anything: how many (count) and where (index).',
      code: '[m for m in dir(tuple) if not m.startswith("_")]\n# [\'count\', \'index\']',
    },
    {
      q: 'Is it faster than list.count?',
      a: 'Effectively identical — both scan every element and compare. Tuples can be marginally quicker to build and iterate because they are fixed size, but the counting loop itself is the same work.',
    },
    {
      q: 'How do I count with a condition instead of a value?',
      a: 'count only takes a value, so use a generator expression with sum. That also lets you short-circuit or count several conditions in one pass.',
      code: 'sum(1 for x in t if x > 10)',
    },
  ],

  history: [
    { version: '2.6', note: 'tuple.count and tuple.index added, aligning tuple with the Sequence interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#common-sequence-operations',
    meta:  'tuple.count',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect sequence data' },
  ],
};
