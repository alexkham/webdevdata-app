// content/reference/python/functions/set-issubset.js
//
// Slug is type-prefixed: `issubset` is a set method (also `<=` operator).

export const meta = {
  slug:        'set-issubset',
  name:        'set.issubset',
  signature:   'set.issubset(other)',
  blurb:       'True if every element of self is in other — empty set is a subset of everything.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'issubset contains contained within all elements subset of set less than equal',
};

export const method = {
  slug:      'set-issubset',
  name:      'set.issubset',
  signature: 'set.issubset(other)',
  returns:   { type: 'bool', desc: 'True if every element of self is contained in other. Empty set is a subset of every set (vacuously). The `<=` operator does the same thing, but requires sets on both sides.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Test set containment — is every element of self already in other?',

  cheat: {
    commonCall: 'required &lt;= granted',
    returns:    'True or False',
    replaces:   '`all(x in other for x in self)` in one call',
    watchOut:   'empty set is a subset of ANY set — including empty (vacuous truth)',
  },

  parameters: [
    { name: 'other', type: 'iterable', required: true, default: null, desc: 'A single iterable — set, list, tuple, generator, string, dict (keys). issubset() accepts any iterable; the `<=` operator requires a set.' },
  ],

  demoParams: [
    { name: 'a', type: 'set', hint: 'self (comma-separated)',  input: 'csv' },
    { name: 'b', type: 'set', hint: 'other (comma-separated)', input: 'csv' },
  ],
  cases: [
    { id: 'subset',     label: 'proper subset',   values: { a: '1,2',       b: '1,2,3,4' } },
    { id: 'equal',      label: 'equal sets',      values: { a: 'a,b,c',     b: 'a,b,c' } },
    { id: 'superset',   label: 'a is superset',   values: { a: '1,2,3,4',   b: '1,2' } },
    { id: 'partial',    label: 'partial overlap', values: { a: '1,2,3',     b: '2,3,4' } },
    { id: 'disjoint',   label: 'disjoint',        values: { a: '1,2,3',     b: '4,5,6' } },
    { id: 'empty-a',    label: 'empty self',      values: { a: '',          b: '1,2,3' } },
    { id: 'empty-b',    label: 'empty other',     values: { a: '1,2,3',     b: '' } },
    { id: 'both-emp',   label: 'both empty',      values: { a: '',          b: '' } },
  ],
  demoExplainer: 'issubset returns True when every element of self also appears in other. Empty set is a subset of EVERY set — including itself and even other empty sets — because there is no element that could fail the check. Neither input is modified.',

  patterns: [
    {
      name: 'Permission check',
      desc: 'Every required permission must be present.',
      code: 'if required_perms &lt;= granted_perms:\n    allow()',
    },
    {
      name: 'Required fields present',
      desc: 'Fold keys into sets and compare.',
      code: 'if required_fields &lt;= set(payload.keys()):\n    process(payload)\nelse:\n    missing = required_fields - set(payload.keys())',
    },
    {
      name: 'Test against any iterable',
      desc: 'issubset accepts iterables; the operator does not.',
      code: 'required.issubset(open("granted.txt"))   # streams the file',
    },
  ],

  examples: [
    { title: 'Proper subset',       code: '{1, 2} &lt;= {1, 2, 3}',                    returns: 'True' },
    { title: 'Equal is subset',     code: '{1, 2, 3} &lt;= {1, 2, 3}',                 returns: 'True' },
    { title: 'Missing element',     code: '{1, 2, 4} &lt;= {1, 2, 3}',                 returns: 'False' },
    { title: 'Empty is universal',  code: 'set() &lt;= {1, 2, 3}',                     returns: 'True' },
    { title: 'Empty subset of empty', code: 'set() &lt;= set()',                        returns: 'True' },
    { title: 'Iterable other',      code: '{1, 2}.issubset([1, 2, 3, 4])',            returns: 'True' },
    { title: 'Strict subset',       code: '{1, 2} &lt; {1, 2, 3}',                     returns: 'True (strict, not equal)' },
  ],

  pitfalls: [
    {
      name: 'set() is a subset of EVERYTHING — including set()',
      desc: 'The vacuously-true case surprises everyone once. There is no element in the empty set that could fail the &quot;every element is in other&quot; test, so the answer is True.',
      wrong: { label: 'Unexpected True', code: 'set().issubset(set())', output: 'True' },
      fix:   { label: 'Guard for empty',  code: 'if a and a &lt;= b:\n    ...     # non-trivial subset', output: 'both non-empty AND subset' },
    },
    {
      name: 'issubset != strict subset',
      desc: '`a <= b` and `a.issubset(b)` allow equality. For strict subset use `a < b` (self is subset AND not equal to other).',
      wrong: { label: 'Equal returns True', code: '{1, 2, 3}.issubset({1, 2, 3})', output: 'True  # equal counts' },
      fix:   { label: 'Strict operator',    code: '{1, 2, 3} &lt; {1, 2, 3}', output: 'False' },
    },
    {
      name: 'The `<=` operator requires sets on both sides',
      desc: 'issubset() accepts any iterable. `<=` does NOT — it needs a set on both sides.',
      wrong: { label: 'Type error', code: '{1, 2} &lt;= [1, 2, 3]', output: "TypeError: '<=' not supported between instances of 'set' and 'list'" },
      fix:   { label: 'Method form', code: '{1, 2}.issubset([1, 2, 3])', output: 'True' },
    },
    {
      name: 'String iterables explode into characters',
      desc: 'Same footgun as every other set method — a string passed as other is iterated as characters, so multi-char items in self will not match.',
      wrong: { label: 'Char comparison', code: '{"ab"}.issubset("abcd")', output: 'False  # "ab" is not one of the chars' },
      fix:   { label: 'Wrap it',         code: '{"ab"}.issubset({"ab", "cd"})', output: 'True' },
    },
  ],

  when: {
    use: [
      'Permission / capability checks (&quot;every required X is present&quot;)',
      'Validating required-fields presence',
      'Testing whether one collection is contained within another',
      'Composing with other set operations for readable filter logic',
    ],
    avoid: [
      'Strict subset needed → `<` operator',
      'Just testing overlap → set.isdisjoint (or `&amp;` and check emptiness)',
      'Ordered containment → convert to sorted tuples and compare',
      'Very large sets where a linear all() check is more memory-efficient than materializing both as sets',
    ],
  },

  notes: {
    complexity: 'O(|self|) — hash table lookups into other',
    return:     'bool — True or False',
    cpython:    'Objects/setobject.c :: set_issubset',
    memory:     'No allocation for sets; other may be materialized into a temporary set if it is a plain iterable',
    threadSafe: 'Safe against reads; not safe under concurrent writes to either input',
  },

  related: [
    { name: 'set.union',        slug: 'set-union',        when: 'Combine two sets — pure' },
    { name: 'set.intersection', slug: 'set-intersection', when: 'What is in both' },
    { name: 'set.difference',   slug: 'set-difference',   when: 'What is in self but not other' },
    { name: 'all',              slug: 'all',              when: 'Analogous check on any iterable via `all(x in other for x in self)`' },
  ],

  faq: [
    {
      q: 'What is the difference between issubset and `<=`?',
      a: 'Same result, but issubset accepts any iterable and `<=` requires both sides to be sets. `<` is the STRICT subset (not equal). Method form is more flexible; operator form reads better in comparisons.',
    },
    {
      q: 'Why is set() a subset of set()?',
      a: 'Because every element of set() is in set() — there are no elements to check, so the check trivially passes. It is the same reason all([]) is True and any([]) is False.',
    },
    {
      q: 'How do I test strict (proper) subset?',
      a: 'Use `<` instead of `<=`. Strict subset means self is a subset AND self != other.',
      code: '{1, 2} &lt; {1, 2, 3}    # True\n{1, 2, 3} &lt; {1, 2, 3} # False (equal)',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; `<=` operator available immediately.' },
    { version: '2.6', note: 'issubset() method accepts any iterable (not just sets).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.issubset',
    meta:  'set.issubset',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};