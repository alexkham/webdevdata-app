// content/reference/python/functions/set-intersection.js
//
// Slug is type-prefixed: `intersection` is a set method (also an operator: `&`).

export const meta = {
  slug:        'set-intersection',
  name:        'set.intersection',
  signature:   'set.intersection(*others)',
  blurb:       'A new set of elements present in self AND every other iterable.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'intersection set common shared and ampersand overlap both contains all',
};

export const method = {
  slug:      'set-intersection',
  name:      'set.intersection',
  signature: 'set.intersection(*others)',
  returns:   { type: 'set', desc: 'A NEW set containing only elements that appear in self AND in every iterable in others. Neither self nor others are modified.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Find elements common to two or more collections — a fresh set, no mutation.',

  cheat: {
    commonCall: 's1 &amp; s2',
    returns:    'a NEW set — self and others untouched',
    replaces:   'a filter + membership-check loop',
    watchOut:   'others can be any iterable — but the `&amp;` operator requires sets on both sides',
  },

  parameters: [
    { name: '*others', type: 'iterable', required: false, default: '()', desc: 'Zero or more iterables. Elements are kept only if they appear in every one. Any type: set, list, tuple, generator, string, dict (keys).' },
  ],

  demoParams: [
    { name: 'a', type: 'set', hint: 'first set (comma-separated)',  input: 'csv' },
    { name: 'b', type: 'set', hint: 'second set (comma-separated)', input: 'csv' },
  ],
  cases: [
    { id: 'overlap', label: 'partial overlap',   values: { a: '1,2,3,4', b: '3,4,5,6' } },
    { id: 'subset',  label: 'b subset of a',    values: { a: '1,2,3,4', b: '2,3' } },
    { id: 'disjoint',label: 'disjoint',         values: { a: '1,2,3',   b: '4,5,6' } },
    { id: 'same',    label: 'identical',        values: { a: 'a,b,c',   b: 'a,b,c' } },
    { id: 'dup-in-a',label: 'duplicates in input', values: { a: 'a,a,b,b,c', b: 'a,c' } },
    { id: 'empty-b', label: 'with empty',       values: { a: '1,2,3',   b: '' } },
    { id: 'both-emp',label: 'both empty',       values: { a: '',        b: '' } },
  ],
  demoExplainer: 'intersection returns a NEW set — self is untouched. An element is kept only if it appears in every input. The demo input arrives as CSV; duplicates within one input collapse on the way in (that is what sets do). Order shown is not meaningful — Python sets are unordered.',

  patterns: [
    {
      name: 'Common tags across posts',
      desc: 'The operator form reads like &quot;a AND b&quot;.',
      code: 'shared = post_a.tags &amp; post_b.tags',
    },
    {
      name: 'Intersect many',
      desc: 'intersection takes variadic args; each may be any iterable.',
      code: 'always = set.intersection(*(user.roles for user in users))',
    },
    {
      name: 'Test disjointness',
      desc: 'Empty intersection means the two sets share nothing — but isdisjoint is more direct.',
      code: 'if not a &amp; b:\n    ...     # disjoint\nif a.isdisjoint(b):\n    ...     # clearer',
    },
  ],

  examples: [
    { title: 'Partial overlap',    code: '{1, 2, 3} &amp; {2, 3, 4}',                returns: '{2, 3}' },
    { title: 'Iterable other',     code: '{1, 2, 3}.intersection([2, 3, 4])',      returns: '{2, 3}' },
    { title: 'Multiple others',    code: '{1, 2, 3}.intersection({2, 3}, [3, 4])', returns: '{3}' },
    { title: 'Disjoint gives empty',code: '{1, 2} &amp; {3, 4}',                    returns: 'set()' },
    { title: 'Zero others is self',code: '{1, 2, 3}.intersection()',                returns: '{1, 2, 3}' },
  ],

  pitfalls: [
    {
      name: 'The `&amp;` operator requires sets on both sides',
      desc: 'intersection() accepts any iterable. The `&amp;` operator does NOT — it needs a set on both sides.',
      wrong: { label: 'Type error', code: '{1, 2, 3} &amp; [2, 3]', output: "TypeError: unsupported operand type(s) for &amp;: 'set' and 'list'" },
      fix:   { label: 'Method form', code: '{1, 2, 3}.intersection([2, 3])', output: '{2, 3}' },
    },
    {
      name: 'intersection() is NOT intersection_update() — it returns a new set',
      desc: 'intersection leaves both inputs alone and returns a fresh set. intersection_update mutates the left one and returns None. Same class of confusion as sort vs sorted.',
      wrong: { label: 'Original untouched', code: 'a = {1, 2, 3}\na.intersection({2, 3})\na', output: '{1, 2, 3}  # nothing removed' },
      fix:   { label: 'Two options', code: 'a = a &amp; {2, 3}                # new set, replace name\n# or\na.intersection_update({2, 3})   # mutate in place', output: '{2, 3}' },
    },
    {
      name: 'String iterables explode into characters',
      desc: 'Same footgun as union — a string passed as an &quot;other&quot; is iterated as characters, so nothing bigger than one char can match.',
      wrong: { label: 'Only chars match', code: '{"Ann", "Bob"}.intersection("BobAnn")', output: 'set()  # no whole-name matches' },
      fix:   { label: 'Wrap it',           code: '{"Ann", "Bob"}.intersection({"Bob"})', output: '{"Bob"}' },
    },
    {
      name: 'Zero others returns a COPY of self',
      desc: '`s.intersection()` with no arguments is treated as intersecting with nothing to require — every element in self passes. The result is a copy, not self itself.',
      wrong: { label: 'Assumed identity', code: 's = {1, 2, 3}\ns.intersection() is s', output: 'False  # equal but not the same object' },
      fix:   { label: 'Check equality',   code: 's.intersection() == s', output: 'True' },
    },
  ],

  when: {
    use: [
      'Elements common to two or more collections',
      'Filter-by-membership without a manual loop',
      'Access-control style checks — required roles vs granted roles',
      'Chaining with other pure set operations (|, &amp;, -)',
    ],
    avoid: [
      'You want to mutate in place → intersection_update or &amp;=',
      'Preserving order → use dict.fromkeys and filter',
      'Just checking &quot;is there any overlap?&quot; → isdisjoint (clearer, may short-circuit)',
      'Unhashable elements → use a list-comprehension with the `in` operator',
    ],
  },

  notes: {
    complexity: 'O(min(|a|, |b|)) for two-set intersection; Python iterates the smaller and probes the larger',
    return:     'A new set — same type as self (`set` or `frozenset`)',
    cpython:    'Objects/setobject.c :: set_intersection',
    memory:     'Allocates a new set sized for the overlap',
    threadSafe: 'Safe against reads; not safe under concurrent writes to the input sets',
  },

  related: [
    { name: 'set.union', slug: 'set-union', when: 'The opposite — elements in self OR any other' },
    { name: 'sorted',    slug: 'sorted',    when: 'Turn the unordered result into an ordered list' },
    { name: 'len',       slug: 'len',       when: 'Count the shared elements' },
  ],

  faq: [
    {
      q: 'What is the difference between intersection() and the `&amp;` operator?',
      a: 'They compute the same thing, but intersection() accepts ANY iterable (list, tuple, generator, string). The `&amp;` operator requires both sides to be sets. Method: flexible. Operator: strict.',
    },
    {
      q: 'What is the difference between intersection() and intersection_update()?',
      a: 'intersection returns a NEW set and leaves both inputs alone. intersection_update mutates the left set in place and returns None. Pick based on whether you want a fresh result or in-place shrink.',
    },
    {
      q: 'Is there a &quot;symmetric&quot; version?',
      a: 'Yes — `symmetric_difference` (or the `^` operator) returns elements in one set OR the other but not both. Complement to intersection at the opposite end.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; intersection available as `&amp;` operator.' },
    { version: '2.6', note: 'intersection() method accepts multiple iterable arguments (variadic).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.intersection',
    meta:  'set.intersection',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};