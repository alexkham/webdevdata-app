// content/reference/python/functions/set-difference.js
//
// Slug is type-prefixed: `difference` is a set method (also an operator: `-`).

export const meta = {
  slug:        'set-difference',
  name:        'set.difference',
  signature:   'set.difference(*others)',
  blurb:       'A new set of elements in self but NOT in any other.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'difference set subtract minus remove not in exclude leftover complement without',
};

export const method = {
  slug:      'set.difference',
  name:      'set.difference',
  signature: 'set.difference(*others)',
  returns:   { type: 'set', desc: 'A NEW set of elements that appear in self but not in ANY of the others. Neither self nor others are modified.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'What is in the first set that is NOT in the others — order matters, unlike union and intersection.',

  cheat: {
    commonCall: 's1 - s2',
    returns:    'a NEW set — self and others untouched',
    replaces:   'a filter with a not-in check',
    watchOut:   'not commutative — `a - b` is different from `b - a`',
  },

  parameters: [
    { name: '*others', type: 'iterable', required: false, default: '()', desc: 'Zero or more iterables. Any element that appears in any of them is excluded from the result. Any type: set, list, tuple, generator, string, dict (keys).' },
  ],

  demoParams: [
    { name: 'a', type: 'set', hint: 'first set (kept minus b)',       input: 'csv-set' },
    { name: 'b', type: 'set', hint: 'second set (subtracted from a)', input: 'csv-set' },
  ],
  cases: [
    { id: 'overlap',    label: 'partial overlap',    values: { a: '1,2,3,4', b: '3,4,5,6' } },
    { id: 'subset',     label: 'b subset of a',      values: { a: '1,2,3,4', b: '2,3' } },
    { id: 'disjoint',   label: 'disjoint',           values: { a: '1,2,3',   b: '4,5,6' } },
    { id: 'same',       label: 'identical',          values: { a: 'a,b,c',   b: 'a,b,c' } },
    { id: 'reverse',    label: 'a - b vs b - a',     values: { a: '1,2,3',   b: '2,3,4' } },
    { id: 'empty-b',    label: 'subtract empty',     values: { a: '1,2,3',   b: '' } },
    { id: 'empty-a',    label: 'from empty',         values: { a: '',        b: '1,2,3' } },
  ],
  demoExplainer: 'difference returns a NEW set — self is untouched. An element is kept only if it does NOT appear in any of the \"others\". Unlike union and intersection, order matters: try the \"a - b vs b - a\" case above, then swap the inputs and see the different result.',

  patterns: [
    {
      name: 'Remove blocked items',
      desc: 'The operator form reads like \"a WITHOUT b\".',
      code: 'allowed = all_options - blocked',
    },
    {
      name: 'What\'s missing',
      desc: 'Find items expected but not delivered.',
      code: 'missing = required - present',
    },
    {
      name: 'Set-based deletion',
      desc: 'Filter a list by set membership without a per-item `in` check.',
      code: 'clean = list(set(items) - set(bad))',
    },
  ],

  examples: [
    { title: 'Basic',                code: '{1, 2, 3, 4} - {3, 4, 5}',                returns: '{1, 2}' },
    { title: 'Iterable other',       code: '{1, 2, 3}.difference([2, 3, 4])',         returns: '{1}' },
    { title: 'Multiple others',      code: '{1, 2, 3, 4}.difference({2}, [3])',       returns: '{1, 4}' },
    { title: 'Disjoint returns self',code: '{1, 2} - {3, 4}',                          returns: '{1, 2}  # equal, not identical' },
    { title: 'Order matters',        code: '{1, 2} - {2, 3}   # {1}\n{2, 3} - {1, 2}   # {3}', returns: 'not commutative' },
  ],

  pitfalls: [
    {
      name: 'The `-` operator requires sets on both sides',
      desc: 'difference() accepts any iterable. The `-` operator does NOT — it needs a set on both sides.',
      wrong: { label: 'Type error', code: '{1, 2, 3} - [2, 3]', output: "TypeError: unsupported operand type(s) for -: 'set' and 'list'" },
      fix:   { label: 'Method form', code: '{1, 2, 3}.difference([2, 3])', output: '{1}' },
    },
    {
      name: 'difference() is NOT difference_update()',
      desc: 'difference leaves both inputs alone and returns a fresh set. difference_update mutates the left one and returns None.',
      wrong: { label: 'Original untouched', code: 'a = {1, 2, 3}\na.difference({2})\na', output: '{1, 2, 3}  # nothing removed' },
      fix:   { label: 'Two options', code: 'a = a - {2}                  # new set, replace name\n# or\na.difference_update({2})       # mutate in place', output: '{1, 3}' },
    },
    {
      name: 'Order matters — a - b is not b - a',
      desc: 'Union and intersection are commutative; difference is not. Getting the argument order backwards silently returns a different set.',
      wrong: { label: 'Wrong direction', code: '{2, 3} - {1, 2}    # expected {1}?', output: '{3}  # what is in {2,3} but not {1,2}' },
      fix:   { label: 'Swap explicitly', code: '{1, 2} - {2, 3}', output: '{1}' },
    },
    {
      name: 'String iterables explode into characters',
      desc: 'Same footgun as union and intersection — a string passed as an \"other\" is iterated as characters.',
      wrong: { label: 'Char removal', code: '{"Ann", "B", "o"}.difference("Bob")', output: '{"Ann"}  # B and o removed as CHARS' },
      fix:   { label: 'Wrap it',      code: '{"Ann", "B", "o"}.difference({"Bob"})', output: '{"Ann", "B", "o"}' },
    },
  ],

  when: {
    use: [
      'Filtering out members of one set from another',
      '\"Missing\" / \"extra\" comparisons between expected and actual',
      'Set-based access control (allowed = all - blocked)',
      'Chaining with other pure set operations (|, &, -)',
    ],
    avoid: [
      'You want to mutate in place → difference_update or -=',
      'Two-way exclusive diff → symmetric_difference (or ^)',
      'You need to preserve order → filter a list with a set membership check',
      'Elements are unhashable → use list comprehension with `not in`',
    ],
  },

  notes: {
    complexity: 'O(|self| + sum(|others|)) — walks self and checks membership in each other',
    return:     'A new set — same type as self (`set` or `frozenset`)',
    cpython:    'Objects/setobject.c :: set_difference',
    memory:     'Allocates a new set sized for the leftovers',
    threadSafe: 'Safe against reads; not safe under concurrent writes to the input sets',
  },

  related: [
    { name: 'set.union',        slug: 'set-union',        when: 'Elements in EITHER set — the combining operation' },
    { name: 'set.intersection', slug: 'set-intersection', when: 'Elements in BOTH sets — the sharing operation' },
    { name: 'sorted',           slug: 'sorted',           when: 'Turn the unordered result into an ordered list' },
    { name: 'len',              slug: 'len',              when: 'Count the leftover elements' },
  ],

  faq: [
    {
      q: 'What is the difference between difference() and the `-` operator?',
      a: 'They compute the same thing, but difference() accepts ANY iterable (list, tuple, generator, string). The `-` operator requires both sides to be sets. Method: flexible. Operator: strict.',
    },
    {
      q: 'What is symmetric_difference?',
      a: 'symmetric_difference (or the `^` operator) returns elements in EITHER set BUT NOT both — the \"exclusive or\" of set operations. It is commutative, unlike plain difference.',
      code: '{1, 2, 3} ^ {2, 3, 4}\n# {1, 4}',
    },
    {
      q: 'Can I subtract from a frozenset?',
      a: 'Yes — the operation is pure, so frozenset supports it and returns another frozenset.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; difference available as `-` operator.' },
    { version: '2.6', note: 'difference() method accepts multiple iterable arguments (variadic).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.difference',
    meta:  'set.difference',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};