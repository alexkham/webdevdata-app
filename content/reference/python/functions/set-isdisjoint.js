// content/reference/python/functions/set-isdisjoint.js
//
// Slug is type-prefixed: `isdisjoint` is a set method — no operator form.

export const meta = {
  slug:        'set-isdisjoint',
  name:        'set.isdisjoint',
  signature:   'set.isdisjoint(other)',
  blurb:       'True if self and other share no elements.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'isdisjoint no overlap disjoint separate share nothing empty intersection none common frozenset frozenset.isdisjoint',
};

export const method = {
  slug:      'set-isdisjoint',
  name:      'set.isdisjoint',
  signature: 'set.isdisjoint(other)',
  returns:   { type: 'bool', desc: 'True if self and other share NO elements — the intersection is empty. Empty set is disjoint from every set, including empty. No operator form; the method is the only way.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Test whether two collections share nothing — cleaner and often faster than checking `not (a & b)`.',

  cheat: {
    commonCall: 'if blocked.isdisjoint(user_tags):',
    returns:    'True or False',
    replaces:   '`not (a & b)` — but isdisjoint can short-circuit on the first shared element',
    watchOut:   'no operator form; empty set is disjoint from EVERYTHING (including empty)',
  },

  parameters: [
    { name: 'other', type: 'iterable', required: true, default: null, desc: 'A single iterable — set, list, tuple, generator, string, dict (keys). isdisjoint() accepts any iterable, and can short-circuit as soon as one common element is found.' },
  ],

  demoParams: [
    { name: 'a', type: 'set', hint: 'first set (comma-separated)',  input: 'csv-set' },
    { name: 'b', type: 'set', hint: 'second set (comma-separated)', input: 'csv-set' },
  ],
  cases: [
    { id: 'disjoint',  label: 'disjoint',            values: { a: '1,2,3',   b: '4,5,6' } },
    { id: 'overlap',   label: 'partial overlap',     values: { a: '1,2,3',   b: '3,4,5' } },
    { id: 'equal',     label: 'equal sets',          values: { a: 'a,b,c',   b: 'a,b,c' } },
    { id: 'subset',    label: 'b subset of a',       values: { a: '1,2,3,4', b: '2,3' } },
    { id: 'empty-b',   label: 'empty other',         values: { a: '1,2,3',   b: '' } },
    { id: 'empty-a',   label: 'empty self',          values: { a: '',        b: '1,2,3' } },
    { id: 'both-emp',  label: 'both empty',          values: { a: '',        b: '' } },
    { id: 'one-share', label: 'single shared',       values: { a: 'a,b,c',   b: 'x,y,c' } },
  ],
  demoExplainer: 'isdisjoint returns True when the two sets share no elements — the intersection is empty. Empty vs anything is always True (an empty set cannot share anything). Neither input is modified. Unlike issubset / issuperset, there is no operator form: no `!&` or similar. The method is the only way.',

  patterns: [
    {
      name: 'Access-control check',
      desc: 'Reject if the user has any blocked tag.',
      code: 'if not user_tags.isdisjoint(blocked_tags):\n    deny()',
    },
    {
      name: '\"Any overlap\" early exit',
      desc: 'isdisjoint short-circuits on the first shared element — cheaper than materializing `a & b`.',
      code: 'if not required.isdisjoint(current):\n    log("at least one required item is already present")',
    },
    {
      name: 'Filter compatible items',
      desc: 'Keep only items whose tags do NOT overlap with a blacklist.',
      code: 'safe = [item for item in items if item.tags.isdisjoint(blacklist)]',
    },
  ],

  examples: [
    { title: 'Disjoint',           code: '{1, 2, 3}.isdisjoint({4, 5, 6})',        returns: 'True' },
    { title: 'Overlap',            code: '{1, 2, 3}.isdisjoint({3, 4, 5})',        returns: 'False' },
    { title: 'Empty is universal', code: 'set().isdisjoint({1, 2, 3})',            returns: 'True' },
    { title: 'Empty vs empty',     code: 'set().isdisjoint(set())',                 returns: 'True' },
    { title: 'Iterable other',     code: '{1, 2, 3}.isdisjoint([4, 5])',           returns: 'True' },
    { title: 'Single shared',      code: '{"a", "b"}.isdisjoint(["c", "b"])',       returns: 'False  # "b" is shared' },
  ],

  pitfalls: [
    {
      name: 'No operator form — it is a method only',
      desc: 'issubset has `<=`, issuperset has `>=`, but isdisjoint has NO equivalent operator. The method is the only way to express it directly.',
      wrong: { label: 'No operator',    code: 'a &! b   # not a thing', output: 'SyntaxError' },
      fix:   { label: 'Use the method', code: 'a.isdisjoint(b)', output: 'True or False' },
    },
    {
      name: 'Empty set is disjoint from EVERYTHING',
      desc: 'Sharing requires membership on both sides. The empty set has no members, so it cannot share anything — even with another empty set. This is vacuously true and can be surprising.',
      wrong: { label: 'Unexpected True', code: 'set().isdisjoint(set())', output: 'True' },
      fix:   { label: 'Guard for empty', code: 'if a and b and a.isdisjoint(b):\n    ...   # both non-empty AND disjoint', output: 'non-trivial disjoint' },
    },
    {
      name: 'isdisjoint is CHEAPER than checking `not (a & b)`',
      desc: 'The intersection form materializes the whole intersection before checking emptiness. isdisjoint iterates one side and short-circuits on the first shared element — no allocation, faster on hits.',
      wrong: { label: 'Materializes intersection', code: 'if not (a & b):\n    ...   # builds a & b, then checks', output: 'allocates a set' },
      fix:   { label: 'Short-circuits',            code: 'if a.isdisjoint(b):\n    ...   # no allocation', output: 'faster on hits' },
    },
    {
      name: 'String iterables explode into characters',
      desc: 'Same footgun as every other set method — a string passed as other is iterated as characters. Multi-char items in self will not match individual characters in a string.',
      wrong: { label: 'Char comparison', code: '{"abc"}.isdisjoint("abcd")', output: 'True  # "abc" is not one of the chars' },
      fix:   { label: 'Wrap it',         code: '{"abc"}.isdisjoint({"abc", "d"})', output: 'False' },
    },
  ],

  when: {
    use: [
      'Access-control \"no blocked tags\" checks',
      '\"Any overlap\" questions where you do not need the overlap itself',
      'Short-circuiting on the first common element — cheaper than materializing the intersection',
      'Filtering compatible items via list comprehension',
    ],
    avoid: [
      'You need the shared elements → set.intersection',
      '\"Every element of self is in other\" → set.issubset',
      '\"Self contains every element of other\" → set.issuperset',
      'One-liner readability when the intersection is the point → `not (a & b)` is more direct',
    ],
  },

  notes: {
    complexity: 'O(min(|a|, |b|)) worst case — iterates the smaller and probes the larger; short-circuits on the first shared element',
    return:     'bool — True or False',
    cpython:    'Objects/setobject.c :: set_isdisjoint',
    memory:     'No allocation for sets; other may be materialized if it is a plain iterable',
    threadSafe: 'Safe against reads; not safe under concurrent writes to either input',
  },

  related: [
    { name: 'set.issubset',     slug: 'set-issubset',     when: 'Every element of self is in other' },
    { name: 'set.issuperset',   slug: 'set-issuperset',   when: 'Self contains every element of other' },
    { name: 'set.intersection', slug: 'set-intersection', when: 'You need the shared elements, not just yes/no' },
    { name: 'any',              slug: 'any',              when: 'Analogous check on iterables via `any(x in a for x in b)`' },
  ],

  faq: [
    {
      q: 'Is there an operator form of isdisjoint?',
      a: 'No. issubset has `<=`, issuperset has `>=`, but isdisjoint has no operator. The method is the direct expression — for a compound form, use `not (a & b)` (but that is slower and allocates).',
    },
    {
      q: 'Is isdisjoint always faster than `not (a & b)`?',
      a: 'Usually yes on non-trivial inputs — isdisjoint short-circuits on the first shared element and does not allocate a result set. `a & b` builds the full intersection before checking emptiness.',
    },
    {
      q: 'Is isdisjoint commutative?',
      a: 'Yes — `a.isdisjoint(b) == b.isdisjoint(a)`. Sharing is symmetric.',
    },
  ],

  history: [
    { version: '2.6', note: 'isdisjoint() introduced.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.isdisjoint',
    meta:  'set.isdisjoint',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};