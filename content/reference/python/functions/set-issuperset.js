// content/reference/python/functions/set-issuperset.js
//
// Slug is type-prefixed: `issuperset` is a set method (also `>=` operator).

export const meta = {
  slug:        'set-issuperset',
  name:        'set.issuperset',
  signature:   'set.issuperset(other)',
  blurb:       'True if every element of other is in self — the mirror of issubset.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'issuperset contains all elements superset of set greater than equal has every',
};

export const method = {
  slug:      'set-issuperset',
  name:      'set.issuperset',
  signature: 'set.issuperset(other)',
  returns:   { type: 'bool', desc: 'True if every element of other is contained in self — the mirror direction of issubset. Any set is a superset of the empty set (vacuously). The `>=` operator does the same thing but requires sets on both sides.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Test set containment from the other side — does self contain every element of other?',

  cheat: {
    commonCall: 'granted &gt;= required',
    returns:    'True or False',
    replaces:   '`all(x in self for x in other)` in one call',
    watchOut:   'any set is a superset of the empty set — including empty (vacuous truth)',
  },

  parameters: [
    { name: 'other', type: 'iterable', required: true, default: null, desc: 'A single iterable — set, list, tuple, generator, string, dict (keys). issuperset() accepts any iterable; the `>=` operator requires a set.' },
  ],

  demoParams: [
    { name: 'a', type: 'set', hint: 'self (comma-separated)',  input: 'csv' },
    { name: 'b', type: 'set', hint: 'other (comma-separated)', input: 'csv' },
  ],
  cases: [
    { id: 'superset',   label: 'proper superset', values: { a: '1,2,3,4', b: '1,2' } },
    { id: 'equal',      label: 'equal sets',      values: { a: 'a,b,c',   b: 'a,b,c' } },
    { id: 'subset',     label: 'a is subset',     values: { a: '1,2',     b: '1,2,3,4' } },
    { id: 'partial',    label: 'partial overlap', values: { a: '1,2,3',   b: '2,3,4' } },
    { id: 'disjoint',   label: 'disjoint',        values: { a: '1,2,3',   b: '4,5,6' } },
    { id: 'empty-b',    label: 'other empty',     values: { a: '1,2,3',   b: '' } },
    { id: 'empty-a',    label: 'self empty',      values: { a: '',        b: '1,2,3' } },
    { id: 'both-emp',   label: 'both empty',      values: { a: '',        b: '' } },
  ],
  demoExplainer: 'issuperset returns True when every element of other appears in self. Any set is a superset of the empty set — including empty itself — because there is no element in the empty set that could fail the check. Neither input is modified.',

  patterns: [
    {
      name: 'Permission check from the granting side',
      desc: 'Reads more naturally as &quot;granted covers required&quot;.',
      code: 'if granted_perms &gt;= required_perms:\n    allow()',
    },
    {
      name: 'Whitelist check',
      desc: 'Is the input a subset of what we accept? Same test from the other side.',
      code: 'if allowed_options &gt;= set(user_selection):\n    apply(user_selection)',
    },
    {
      name: 'Sanity check on a required-fields set',
      desc: 'The dict must contain every required key.',
      code: 'if set(payload) &gt;= required_fields:\n    process(payload)',
    },
  ],

  examples: [
    { title: 'Proper superset',    code: '{1, 2, 3} &gt;= {1, 2}',                    returns: 'True' },
    { title: 'Equal is superset',  code: '{1, 2, 3} &gt;= {1, 2, 3}',                 returns: 'True' },
    { title: 'Missing element',    code: '{1, 2} &gt;= {1, 2, 3}',                    returns: 'False' },
    { title: 'Universal empty',    code: '{1, 2, 3} &gt;= set()',                     returns: 'True' },
    { title: 'Empty vs empty',     code: 'set() &gt;= set()',                         returns: 'True' },
    { title: 'Iterable other',     code: '{1, 2, 3, 4}.issuperset([1, 2])',          returns: 'True' },
    { title: 'Strict superset',    code: '{1, 2, 3} &gt; {1, 2}',                     returns: 'True (strict, not equal)' },
  ],

  pitfalls: [
    {
      name: 'Any set is a superset of set()',
      desc: 'The mirror of issubset&apos;s vacuous case. There is no element in the empty other that could fail — so the answer is always True.',
      wrong: { label: 'Unexpected True', code: '{1, 2, 3}.issuperset(set())', output: 'True' },
      fix:   { label: 'Guard for empty', code: 'if other and self &gt;= other:\n    ...     # non-trivial superset', output: 'other non-empty AND superset' },
    },
    {
      name: 'issuperset != strict superset',
      desc: '`a >= b` and `a.issuperset(b)` allow equality. For strict superset use `a > b` (self is superset AND not equal to other).',
      wrong: { label: 'Equal returns True', code: '{1, 2, 3}.issuperset({1, 2, 3})', output: 'True  # equal counts' },
      fix:   { label: 'Strict operator',    code: '{1, 2, 3} &gt; {1, 2, 3}', output: 'False' },
    },
    {
      name: 'The `>=` operator requires sets on both sides',
      desc: 'issuperset() accepts any iterable. `>=` does NOT — it needs a set on both sides.',
      wrong: { label: 'Type error', code: '{1, 2, 3} &gt;= [1, 2]', output: "TypeError: '&gt;=' not supported between instances of 'set' and 'list'" },
      fix:   { label: 'Method form', code: '{1, 2, 3}.issuperset([1, 2])', output: 'True' },
    },
    {
      name: 'Direction confusion — a &gt;= b vs a &lt;= b',
      desc: 'issuperset is &quot;self contains other&quot;. issubset is &quot;self is contained in other&quot;. Same relation, different sides. Getting the sides backwards silently returns a different answer.',
      wrong: { label: 'Wrong side', code: '{1, 2}.issuperset({1, 2, 3})   # expected True?', output: 'False  # {1,2} does not contain 3' },
      fix:   { label: 'Right side', code: '{1, 2, 3}.issuperset({1, 2})', output: 'True' },
    },
  ],

  when: {
    use: [
      '&quot;Do we have everything they need?&quot; — permission or capability grants',
      'Whitelist / allow-list checks',
      'Required-fields presence tests',
      'Any &quot;self contains all of other&quot; predicate',
    ],
    avoid: [
      'Strict superset needed → `>` operator',
      '&quot;No overlap at all&quot; → set.isdisjoint',
      'Ordered containment → convert to sorted tuples and compare',
      'When issubset reads more naturally — pick the direction that matches the domain language',
    ],
  },

  notes: {
    complexity: 'O(|other|) — hash table lookups into self',
    return:     'bool — True or False',
    cpython:    'Objects/setobject.c :: set_issuperset',
    memory:     'No allocation for sets; other may be materialized if it is a plain iterable',
    threadSafe: 'Safe against reads; not safe under concurrent writes to either input',
  },

  related: [
    { name: 'set.issubset',     slug: 'set-issubset',     when: 'The mirror direction — self is contained in other' },
    { name: 'set.union',        slug: 'set-union',        when: 'Combine two sets — pure' },
    { name: 'set.intersection', slug: 'set-intersection', when: 'What is in both' },
    { name: 'all',              slug: 'all',              when: 'Analogous check on any iterable via `all(x in self for x in other)`' },
  ],

  faq: [
    {
      q: 'What is the difference between issuperset and issubset?',
      a: 'Direction. `a.issuperset(b)` asks &quot;does a contain everything in b?&quot;; `a.issubset(b)` asks &quot;is a contained inside b?&quot;. Same relation from opposite sides. Pick whichever reads clearest for the domain.',
    },
    {
      q: 'Is issuperset commutative?',
      a: 'No — it is directional. `a.issuperset(b)` and `b.issuperset(a)` are usually different. They are both true ONLY when the sets are equal.',
    },
    {
      q: 'How do I test strict (proper) superset?',
      a: 'Use `>` instead of `>=`. Strict superset means self is a superset AND self != other.',
      code: '{1, 2, 3} &gt; {1, 2}       # True\n{1, 2, 3} &gt; {1, 2, 3}    # False (equal)',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; `>=` operator available immediately.' },
    { version: '2.6', note: 'issuperset() method accepts any iterable (not just sets).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.issuperset',
    meta:  'set.issuperset',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};