// content/reference/python/functions/set-union.js
//
// Slug is type-prefixed: `union` is a set method (also an operator: `|`).

export const meta = {
  slug:        'set-union',
  name:        'set.union',
  signature:   'set.union(*others)',
  blurb:       'A new set combining self and every other iterable.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'union set combine merge or pipe operator new elements distinct unique',
};

export const method = {
  slug:      'set-union',
  name:      'set.union',
  signature: 'set.union(*others)',
  returns:   { type: 'set', desc: 'A NEW set containing every element from self and from every iterable in others. Duplicates collapse silently. Neither self nor others are modified.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Merge sets without mutating either — the pure counterpart to update.',

  cheat: {
    commonCall: 's1 | s2',
    returns:    'a NEW set — self and others untouched',
    replaces:   'writing `{*s1, *s2}` or a loop of `.add()` calls',
    watchOut:   'others can be ANY iterable, not just sets — string iterables explode into chars',
  },

  parameters: [
    { name: '*others', type: 'iterable', required: false, default: '()', desc: 'Zero or more iterables. Elements from every one are added to the result. Each iterable can be any type — set, list, tuple, generator, string, dict (keys).' },
  ],

  demoParams: [
    { name: 'a', type: 'set', hint: 'first set (comma-separated)',  input: 'csv-set' },
    { name: 'b', type: 'set', hint: 'second set (comma-separated)', input: 'csv-set' },
  ],
  cases: [
    { id: 'disjoint', label: 'disjoint',       values: { a: '1,2,3',   b: '4,5,6' } },
    { id: 'overlap',  label: 'partial overlap',values: { a: '1,2,3',   b: '3,4,5' } },
    { id: 'subset',   label: 'b subset of a',  values: { a: '1,2,3,4', b: '2,3' } },
    { id: 'same',     label: 'identical',      values: { a: 'a,b,c',   b: 'a,b,c' } },
    { id: 'dup-in-a', label: 'dupes in input', values: { a: 'a,a,b,b', b: 'c,c' } },
    { id: 'empty-b',  label: 'union with empty', values: { a: '1,2,3',  b: '' } },
    { id: 'both-emp', label: 'both empty',     values: { a: '',        b: '' } },
  ],
  demoExplainer: 'union returns a NEW set — self is untouched. The demo input arrives as CSV; duplicates within one input collapse silently on the way in (that is what sets do). Order shown is not meaningful — Python sets are unordered; two runs may show items in different sequence.',

  patterns: [
    {
      name: 'Merge two sets',
      desc: 'The operator form is the idiomatic one — reads like &quot;a or b&quot;.',
      code: 'combined = a | b',
    },
    {
      name: 'Union many',
      desc: 'union takes variadic args, and any iterable is accepted.',
      code: 'all_tags = set().union(*(post.tags for post in posts))',
    },
    {
      name: 'Deduplicate an iterable via union',
      desc: 'Empty set union with the iterable equals the set of its elements.',
      code: 'unique = set().union(items)',
    },
  ],

  examples: [
    { title: 'Disjoint sets',      code: '{1, 2} | {3, 4}',                    returns: '{1, 2, 3, 4}' },
    { title: 'Overlapping',        code: '{1, 2, 3} | {2, 3, 4}',              returns: '{1, 2, 3, 4}' },
    { title: 'Iterable other',     code: '{1, 2}.union([2, 3, 4])',            returns: '{1, 2, 3, 4}' },
    { title: 'Multiple others',    code: '{1}.union({2, 3}, [3, 4], (4, 5))',  returns: '{1, 2, 3, 4, 5}' },
    { title: 'Empty is identity',  code: '{1, 2}.union()',                     returns: '{1, 2}  # equal, not identical' },
  ],

  pitfalls: [
    {
      name: 'The `|` operator requires both sides to be sets',
      desc: 'union() accepts any iterable. The `|` operator does NOT — it needs a set on both sides. Reaching for the operator with a list raises TypeError.',
      wrong: { label: 'Type error', code: '{1, 2} | [3, 4]', output: "TypeError: unsupported operand type(s) for |: 'set' and 'list'" },
      fix:   { label: 'Method form', code: '{1, 2}.union([3, 4])', output: '{1, 2, 3, 4}' },
    },
    {
      name: 'union() is NOT update() — it returns a new set',
      desc: 'union leaves both inputs alone and returns a fresh set. update mutates the left one and returns None. Same class of confusion as sort vs sorted.',
      wrong: { label: 'Original untouched', code: 'a = {1, 2}\na.union({3, 4})\na', output: '{1, 2}  # nothing added' },
      fix:   { label: 'Two options', code: 'a = a | {3, 4}       # new set, replace name\n# or\na.update({3, 4})       # mutate in place', output: '{1, 2, 3, 4}' },
    },
    {
      name: 'String iterables explode into characters',
      desc: 'Passing a string as an &quot;other&quot; adds every character as its own element, exactly like list.extend&apos;s classic footgun.',
      wrong: { label: 'Char explosion', code: '{"Ann"}.union("Bob")', output: '{"Ann", "B", "o", "b"}' },
      fix:   { label: 'Wrap it',        code: '{"Ann"}.union({"Bob"})\n# or\n{"Ann"}.union(["Bob"])', output: '{"Ann", "Bob"}' },
    },
    {
      name: 'Elements must be hashable',
      desc: 'A union that ends up trying to store an unhashable item (list, dict, another set) raises TypeError.',
      wrong: { label: 'Unhashable', code: '{1, 2}.union([[3, 4]])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Use tuples',  code: '{1, 2}.union([(3, 4)])', output: '{1, 2, (3, 4)}' },
    },
  ],

  when: {
    use: [
      'Combining sets without mutating either',
      'Deduplicating an iterable in one call',
      'Composing multiple sources into a single set',
      'Chaining with other pure set operations (|, &amp;, -)',
    ],
    avoid: [
      'You want to mutate in place → set.update or |= ',
      'Preserving insertion order → union does not; use dict.fromkeys(iter).keys()',
      'Elements are unhashable → use a list or wrap in tuples',
      'Small hot loops where allocation dominates → mutate with add or update',
    ],
  },

  notes: {
    complexity: 'O(|a| + sum(|other_i|))',
    return:     'A new set — same type as self (`set` or `frozenset`)',
    cpython:    'Objects/setobject.c :: set_union',
    memory:     'Allocates a new set sized for all input elements',
    threadSafe: 'Safe against reads; not safe under concurrent writes to the input sets',
  },

  related: [
    { name: 'sorted',    slug: 'sorted',    when: 'Turn the unordered union into an ordered list' },
    { name: 'len',       slug: 'len',       when: 'Count the resulting unique elements' },
    { name: 'sum',       slug: 'sum',       when: 'Reduce numeric unions to a total' },
  ],

  faq: [
    {
      q: 'What is the difference between union() and the `|` operator?',
      a: 'They compute the same thing, but union() accepts ANY iterable (list, tuple, generator, string). The `|` operator requires both sides to be sets. Method: flexible. Operator: strict.',
    },
    {
      q: 'What is the difference between union() and update()?',
      a: 'union returns a NEW set and leaves both inputs alone. update mutates the left set in place and returns None. Pick based on whether you want a fresh result or in-place growth.',
    },
    {
      q: 'Does union preserve order?',
      a: 'No — sets are unordered by definition. If you need order, iterate the union into a list and sort, or use dict.fromkeys() to deduplicate while keeping insertion order.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; union available as `|` operator.' },
    { version: '2.6', note: 'union() method accepts multiple iterable arguments (variadic).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.union',
    meta:  'set.union',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};