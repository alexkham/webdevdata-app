// content/reference/python/functions/set-symmetric_difference_update.js
//
// Slug is type-prefixed: `symmetric_difference_update` is a set method.

export const meta = {
  slug:        'set-symmetric_difference_update',
  name:        'set.symmetric_difference_update',
  signature:   'set.symmetric_difference_update(other)',
  blurb:       'Update the set to contain elements in EITHER but not BOTH — in place.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'symmetric_difference_update xor either not both in place mutate none unique',
};

export const method = {
  slug:      'set-symmetric_difference_update',
  name:      'set.symmetric_difference_update',
  signature: 'set.symmetric_difference_update(other)',
  returns:   { type: 'None', desc: 'Returns None. The set is mutated in place — becomes the symmetric difference: elements present in EXACTLY ONE of the two collections. Equivalent to `s ^= set(other)` but accepts any iterable.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The in-place XOR — keep elements found in only one side; drop the shared ones.',

  cheat: {
    commonCall: 'diff.symmetric_difference_update(other)',
    returns:    'None — set is mutated to the XOR',
    replaces:   'a manual `s = (s - other) | (other - s)` reassignment',
    watchOut:   'takes ONE iterable — unlike update / intersection_update / difference_update which take *others',
  },

  parameters: [
    { name: 'other', type: 'iterable', required: true, default: null, desc: 'A single iterable. The set is updated to elements present in exactly one of the two collections. Unlike the other *_update methods, this takes a SINGLE positional argument, not *others.' },
  ],

  demoParams: [
    { name: 'set',   type: 'set', hint: 'existing elements',       input: 'csv' },
    { name: 'other', type: 'set', hint: 'the other set (iterable)', input: 'csv' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { set: '1,2,3', other: '2,3,4' } },
    { id: 'overlap',  label: 'partial overlap', values: { set: 'a,b,c,d', other: 'c,d,e,f' } },
    { id: 'disjoint', label: 'no overlap',      values: { set: '1,2,3',   other: '4,5,6' } },
    { id: 'identical',label: 'identical sets',   values: { set: 'a,b,c',   other: 'a,b,c' } },
    { id: 'empty-other',label: 'other empty',   values: { set: 'a,b,c',   other: '' } },
    { id: 'empty-self', label: 'self empty',    values: { set: '',        other: 'x,y,z' } },
  ],
  demoExplainer: 'symmetric_difference_update mutates the set in place. Real Python returns None; the demo shows the RESULTING state so the effect is visible. Elements present in both are REMOVED; elements present in only one are KEPT. Identical sets XOR to the empty set. Empty other means &quot;keep everything in the set&quot; (no change). Unlike the other *_update methods, this takes ONLY ONE iterable.',

  patterns: [
    {
      name: 'Toggle membership',
      desc: 'For each element in the other iterable — add if absent, remove if present.',
      code: 'flags.symmetric_difference_update({"debug", "trace"})',
    },
    {
      name: 'Detect changes between two snapshots',
      desc: 'Symmetric difference is the &quot;what changed&quot; set — added and removed items together.',
      code: 'changed = snapshot_a.copy()\nchanged.symmetric_difference_update(snapshot_b)',
    },
    {
      name: 'The operator alternative',
      desc: '`^=` is equivalent when the RHS is a set. symmetric_difference_update accepts any iterable.',
      code: 's ^= other_set                                # requires a set\ns.symmetric_difference_update(iterable)        # any iterable',
    },
  ],

  examples: [
    { title: 'Basic',                code: 's = {1, 2, 3}\ns.symmetric_difference_update({2, 3, 4})\ns', returns: '{1, 4}' },
    { title: 'Partial overlap',       code: '{"a", "b", "c"}.symmetric_difference_update({"c", "d"})',  returns: '{"a", "b", "d"}' },
    { title: 'No overlap = union',    code: '{1, 2}.symmetric_difference_update({3, 4})',                returns: '{1, 2, 3, 4}' },
    { title: 'Identical sets = empty',code: '{"a"}.symmetric_difference_update({"a"})',                  returns: 'set()' },
    { title: 'Empty other',           code: '{1, 2}.symmetric_difference_update([])',                    returns: '{1, 2}' },
    { title: 'Returns None',          code: '{1, 2}.symmetric_difference_update([1])',                   returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'symmetric_difference_update() returns None — do NOT assign the result',
      desc: 'Same rule as every mutation. Assigning the result sets your variable to None.',
      wrong: { label: 'Assigned None', code: 's = s.symmetric_difference_update(other)', output: 's is now None' },
      fix:   { label: 'Just call it',   code: 's.symmetric_difference_update(other)', output: 's is the XOR' },
    },
    {
      name: 'Takes ONE iterable — unlike its siblings',
      desc: 'Alone in the *_update family: it accepts only ONE positional argument. update, intersection_update, and difference_update all accept *others (multiple iterables); symmetric_difference_update does not.',
      wrong: { label: 'Multi-arg fails', code: 's.symmetric_difference_update(a, b)', output: 'TypeError: takes 1 positional argument but 2 were given' },
      fix:   { label: 'Chain calls',      code: 's.symmetric_difference_update(a)\ns.symmetric_difference_update(b)', output: 'iterative XOR' },
    },
    {
      name: 'Identical sets XOR to empty',
      desc: 'When the two sets are identical, everything is shared, so the result is empty. Sometimes forgotten when using XOR as a &quot;combine unique&quot; operation.',
      wrong: { label: 'Assumed union', code: '{1, 2}.symmetric_difference_update({1, 2})', output: 'set()  # not {1, 2}' },
      fix:   { label: 'Union for that',  code: 's.update(other)', output: 'union — every element' },
    },
    {
      name: 'A string is a sequence of characters',
      desc: 'Passing a string XORs each CHARACTER. Wrap in a list to XOR the string itself.',
      wrong: { label: 'Broken into chars', code: 's = {"h", "hi"}\ns.symmetric_difference_update("hi")', output: '{"hi", "i"}  # per-char' },
      fix:   { label: 'Wrap it',            code: 's.symmetric_difference_update(["hi"])', output: 'XOR by whole string' },
    },
  ],

  when: {
    use: [
      'Toggling membership: add absent, remove present',
      'Computing changes between two snapshots',
      '&quot;Only in one&quot; queries against a moving target',
      'Iterative diff building — apply many small XORs',
    ],
    avoid: [
      'You need a new set — use `^` or `symmetric_difference()`',
      'You want only additions or only removals — separate difference calls',
      'Multiple iterables — this method only takes one; call multiple times',
      'You need the two halves separately — compute `s - other` and `other - s`',
    ],
  },

  notes: {
    complexity: 'O(len(other)) — one pass over the other iterable',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_symmetric_difference_update',
    memory:     'May grow or shrink; hash table capacity adjusts',
    threadSafe: 'Not safe under concurrent iteration or mutation',
  },

  related: [
    { name: 'set.symmetric_difference',    slug: 'set-symmetric_difference',    when: 'Pure form — returns a new set' },
    { name: 'set.update',                  slug: 'set-update',                  when: 'Union in place' },
    { name: 'set.intersection_update',     slug: 'set-intersection_update',     when: 'Intersection in place' },
    { name: 'set.difference_update',       slug: 'set-difference_update',       when: 'Remove-in-place' },
  ],

  faq: [
    {
      q: 'What is the difference between symmetric_difference_update() and ^= ?',
      a: 'For a set on the right, they are equivalent: `s ^= t` calls `s.symmetric_difference_update(t)`. But the method accepts ANY iterable (list, string, generator); the operator requires a set.',
    },
    {
      q: 'Why does this method take one iterable when the others take multiple?',
      a: 'Because XOR of multiple sets is ambiguous. Is X ^ Y ^ Z the same as (X ^ Y) ^ Z? For sets it happens to be, but Python plays it safe and requires a single argument to avoid confusion.',
    },
    {
      q: 'What is the pattern shared by all the *_update methods?',
      a: 'Every set operator has an in-place *_update variant: update (union), difference_update, intersection_update, symmetric_difference_update. All accept any iterable, return None, and mutate the set. The `_update` suffix consistently means &quot;in place, returns None&quot;.',
    },
  ],

  history: [
    { version: '2.3', note: 'set added as a builtin type with symmetric_difference_update().' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.symmetric_difference_update',
    meta:  'set.symmetric_difference_update',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set data' },
  ],
};