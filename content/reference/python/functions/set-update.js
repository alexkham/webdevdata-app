// content/reference/python/functions/set-update.js
//
// Slug is type-prefixed: `update` is a set method.

export const meta = {
  slug:        'set-update',
  name:        'set.update',
  signature:   'set.update(*others)',
  blurb:       'Add every element from one or more iterables — in place.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'update set add union merge many iterable in place mutate none extend',
};

export const method = {
  slug:      'set-update',
  name:      'set.update',
  signature: 'set.update(*others)',
  returns:   { type: 'None', desc: 'Returns None. The set is mutated in place — every element from each iterable that is not already present is added. Equivalent to `s |= set(other1) | set(other2) | ...` but takes any iterables, not just sets.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The in-place union — take any iterable(s) and add every element. The bulk cousin of add().',

  cheat: {
    commonCall: 'seen.update(new_batch)',
    returns:    'None — set is mutated with the new members',
    replaces:   'a loop of `s.add(x) for x in iterable`',
    watchOut:   'accepts any iterable — sets, lists, strings, generators; the iterable itself is not stored',
  },

  parameters: [
    { name: '*others', type: 'iterable', required: false, default: '()', desc: 'Zero or more iterables. Every element of each is added to the set. Iterables need not be sets — lists, tuples, generators, and strings all work.' },
  ],

  demoParams: [
    { name: 'set',   type: 'set', hint: 'existing elements',       input: 'csv' },
    { name: 'other', type: 'set', hint: 'items to add (iterable)', input: 'csv' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { set: 'a,b,c',   other: 'd,e,f' } },
    { id: 'overlap',  label: 'partial overlap', values: { set: '1,2,3',   other: '3,4,5' } },
    { id: 'subset',   label: 'other subset',    values: { set: 'a,b,c,d', other: 'a,b' } },
    { id: 'empty-other',label: 'other empty',   values: { set: 'a,b,c',   other: '' } },
    { id: 'empty-self', label: 'self empty',    values: { set: '',        other: 'x,y,z' } },
    { id: 'dupes',    label: 'dupes in other',  values: { set: 'a,b',      other: 'c,c,d,d' } },
  ],
  demoExplainer: 'update mutates the set in place. Real Python returns None; the demo shows the RESULTING state so the effect is visible. Every element from the iterable that is not already present is added. Duplicates in the iterable collapse (they already do in a set). The iterable can be any iterable — a list, tuple, string, generator — not just another set.',

  patterns: [
    {
      name: 'Merge a batch of items',
      desc: 'Add many elements from any iterable in one call.',
      code: 'seen.update(new_batch)',
    },
    {
      name: 'Multiple iterables at once',
      desc: 'update takes *args — pass several iterables to add from all of them.',
      code: 'names.update(first_names, last_names, aliases)',
    },
    {
      name: 'The operator alternative',
      desc: '`|=` is equivalent when the RHS is a set. update is more flexible.',
      code: 's |= other_set        # requires a set on the right\ns.update(iterable)     # any iterable works',
    },
    {
      name: 'Build up from a generator',
      desc: 'Feed lazy computation directly into the set.',
      code: 's.update(f(x) for x in inputs if valid(x))',
    },
  ],

  examples: [
    { title: 'Basic',              code: 's = {1, 2}\ns.update([3, 4])\ns',       returns: '{1, 2, 3, 4}' },
    { title: 'Partial overlap',    code: '{1, 2, 3}.update({3, 4, 5})',            returns: '{1, 2, 3, 4, 5}' },
    { title: 'From a string',      code: 's = set()\ns.update("abc")\ns',           returns: '{"a", "b", "c"}' },
    { title: 'Multiple iterables', code: 's.update([1, 2], [2, 3], [3, 4])',        returns: '{1, 2, 3, 4}' },
    { title: 'From a generator',   code: 's.update(x * 2 for x in range(3))',       returns: '{0, 2, 4}' },
    { title: 'Returns None',       code: '{1, 2}.update([3])',                       returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'update() returns None — do NOT assign the result',
      desc: 'The classic bug that applies to every mutation method. `s = s.update(other)` sets s to None. Since Python returns None to signal side-effect operations, all in-place mutations follow this rule.',
      wrong: { label: 'Assigned None', code: 's = {1, 2}\ns = s.update([3])\nprint(s)', output: 'None' },
      fix:   { label: 'Just call it',   code: 's.update([3])\nprint(s)', output: '{1, 2, 3}' },
    },
    {
      name: 'update mutates — copy first if the original matters',
      desc: 'update is destructive — the original set is changed. If you need the pre-update state, copy first.',
      wrong: { label: 'Original lost', code: 'before = s\ns.update(new)\nbefore is s', output: 'True — same object, both mutated' },
      fix:   { label: 'Snapshot copy', code: 'before = s.copy()\ns.update(new)\nbefore', output: 'preserved' },
    },
    {
      name: 'A string is a sequence of characters',
      desc: 'Passing a string to update adds each CHARACTER, not the string as a whole. Wrap in a list or tuple to add the string itself.',
      wrong: { label: 'Broken into chars', code: 's = set()\ns.update("hi")', output: '{"h", "i"}  # not {"hi"}' },
      fix:   { label: 'Wrap the string',    code: 's.update(["hi"])', output: '{"hi"}' },
    },
    {
      name: 'Elements must be hashable — like every set operation',
      desc: 'The iterable can contain any values that are hashable. Lists and dicts as elements raise TypeError.',
      wrong: { label: 'List elements', code: 's.update([[1, 2], [3, 4]])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Tuple elements', code: 's.update([(1, 2), (3, 4)])', output: '{(1, 2), (3, 4)}' },
    },
  ],

  when: {
    use: [
      'Adding a batch of elements from any iterable',
      'Merging many sets or lists into one',
      'Building up a set from a stream or generator',
      'Any time `for x in iterable: s.add(x)` would work — one call is faster and clearer',
    ],
    avoid: [
      'You need a new set — use `|` or `union()` for a pure result',
      'One element at a time → s.add(x) is clearer',
      'Elements might be unhashable → filter or convert first',
      'You want the result assigned back — the operator form (|=) makes intent explicit',
    ],
  },

  notes: {
    complexity: 'O(m + n) — proportional to the size of the iterable(s) plus final size of the set',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_update',
    memory:     'May reallocate the hash table when the set grows',
    threadSafe: 'Not safe under concurrent iteration or mutation',
  },

  related: [
    { name: 'set.add',                     slug: 'set-add',                     when: 'Add a single element' },
    { name: 'set.union',                   slug: 'set-union',                   when: 'Pure combine — returns a new set' },
    { name: 'set.difference_update',       slug: 'set-difference_update',       when: 'Remove-in-place counterpart' },
    { name: 'set.intersection',            slug: 'set-intersection',            when: 'Keep the overlap — pure form' },
  ],

  faq: [
    {
      q: 'What is the difference between update() and |= ?',
      a: 'For a set on the right, they are equivalent: `s |= t` calls `s.update(t)`. But update accepts ANY iterable (list, string, generator) — the `|=` operator requires a set. update also accepts multiple iterables in one call.',
    },
    {
      q: 'Why does update() return None?',
      a: 'Consistent with every Python mutation method (list.append, list.sort, dict.update, ...). Returning None signals &quot;side effect only&quot; and prevents chaining bugs.',
    },
    {
      q: 'Can I chain update() calls?',
      a: 'Not directly — update returns None. Use multiple iterables in one call instead: `s.update(a, b, c)`.',
    },
  ],

  history: [
    { version: '2.6', note: 'set.update() supports multiple *args of iterables.' },
    { version: '2.3', note: 'set added as a builtin type with update().' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.update',
    meta:  'set.update',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set data' },
  ],
};