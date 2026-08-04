// content/reference/python/functions/set-intersection_update.js
//
// Slug is type-prefixed: `intersection_update` is a set method.

export const meta = {
  slug:        'set-intersection_update',
  name:        'set.intersection_update',
  signature:   'set.intersection_update(*others)',
  blurb:       'Keep only elements found in the set AND every given iterable — in place.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'intersection_update set common shared overlap keep only in place mutate none',
};

export const method = {
  slug:      'set-intersection_update',
  name:      'set.intersection_update',
  signature: 'set.intersection_update(*others)',
  returns:   { type: 'None', desc: 'Returns None. The set is mutated in place — keeps only elements that appear in the set AND in every given iterable. Equivalent to `s &= set(other1) & set(other2) & ...` but takes any iterables, not just sets.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The in-place intersection — keep the overlap with the given iterable(s). Everything not shared is removed.',

  cheat: {
    commonCall: 'seen.intersection_update(allowed)',
    returns:    'None — set is mutated to the shared subset',
    replaces:   'a manual `s = s & other` reassignment',
    watchOut:   'accepts any iterable; multiple iterables narrow the set further (AND together)',
  },

  parameters: [
    { name: '*others', type: 'iterable', required: false, default: '()', desc: 'Zero or more iterables. The set is narrowed to elements found in ALL of them. With zero args the set is unchanged.' },
  ],

  demoParams: [
    { name: 'set',   type: 'set', hint: 'existing elements',           input: 'csv' },
    { name: 'other', type: 'set', hint: 'items to keep (iterable)',    input: 'csv' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { set: '1,2,3,4', other: '2,3,5' } },
    { id: 'overlap',  label: 'partial overlap', values: { set: 'a,b,c,d', other: 'c,d,e,f' } },
    { id: 'disjoint', label: 'no overlap',      values: { set: '1,2,3',   other: '4,5,6' } },
    { id: 'subset',   label: 'other superset',  values: { set: 'a,b',      other: 'a,b,c,d' } },
    { id: 'empty-other',label: 'other empty',   values: { set: 'a,b,c',    other: '' } },
    { id: 'empty-self', label: 'self empty',    values: { set: '',         other: 'x,y,z' } },
  ],
  demoExplainer: 'intersection_update mutates the set in place. Real Python returns None; the demo shows the RESULTING state so the effect is visible. Every element that is NOT in the iterable is removed from the set. When the other iterable is empty, the set becomes empty. The iterable can be any iterable, not just another set.',

  patterns: [
    {
      name: 'Narrow to an allowlist',
      desc: 'Keep only the elements that match a given whitelist.',
      code: 'active.intersection_update(allowed_ids)',
    },
    {
      name: 'Multiple filters at once',
      desc: 'Chain multiple iterables — the result is the intersection of ALL.',
      code: 'candidates.intersection_update(available, in_budget, matches_criteria)',
    },
    {
      name: 'The operator alternative',
      desc: '`&=` is equivalent when the RHS is a set. intersection_update is more flexible.',
      code: 's &= other_set                     # requires a set\ns.intersection_update(iterable)     # any iterable',
    },
    {
      name: 'Progressive narrowing',
      desc: 'Start with the widest set, then apply filters step by step.',
      code: 'candidates = set(all_users)\ncandidates.intersection_update(paying_users)\ncandidates.intersection_update(active_users)',
    },
  ],

  examples: [
    { title: 'Basic',                 code: 's = {1, 2, 3, 4}\ns.intersection_update([2, 3])\ns', returns: '{2, 3}' },
    { title: 'Partial overlap',       code: '{"a", "b", "c"}.intersection_update({"c", "d"})',  returns: '{"c"}' },
    { title: 'No overlap gives empty',code: '{1, 2}.intersection_update({3, 4})',                returns: 'set()' },
    { title: 'Empty other gives empty',code: '{1, 2}.intersection_update([])',                    returns: 'set()' },
    { title: 'Multiple iterables',    code: 's.intersection_update([1, 2, 3], [2, 3, 4])',        returns: '{2, 3}  # AND together' },
    { title: 'Returns None',          code: '{1, 2}.intersection_update([1])',                    returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'intersection_update() returns None — do NOT assign the result',
      desc: 'Same rule as every mutation. Assigning the result sets your variable to None.',
      wrong: { label: 'Assigned None', code: 's = s.intersection_update(other)', output: 's is now None' },
      fix:   { label: 'Just call it',   code: 's.intersection_update(other)', output: 's is the narrowed set' },
    },
    {
      name: 'Empty iterable ⇒ empty set',
      desc: 'An empty other means &quot;keep only elements in nothing&quot; — which is nothing. The set becomes empty. Sometimes surprising if you thought empty meant &quot;no filter&quot;.',
      wrong: { label: 'Assumed no-op', code: '{"a", "b"}.intersection_update([])', output: 'set()' },
      fix:   { label: 'Guard if needed', code: 'if other:\n    s.intersection_update(other)', output: 'no change on empty' },
    },
    {
      name: 'Multiple iterables narrow FURTHER — they AND together',
      desc: 'Passing two iterables keeps only elements in the set AND in both. Not &quot;in either&quot; — that would be a union.',
      wrong: { label: 'Assumed OR',    code: 'set.intersection_update([1,2], [3,4])   # each restricts', output: 'set() unless something in all three' },
      fix:   { label: 'Union for OR',   code: 's.intersection_update(set(iterable1) | set(iterable2))', output: 'items in either' },
    },
    {
      name: 'A string is a sequence of characters',
      desc: 'Passing a string treats each CHARACTER as a candidate to keep. Wrap in a list if you meant to keep just the string itself.',
      wrong: { label: 'Broken into chars', code: 's = {"hi", "h"}\ns.intersection_update("hi")', output: '{"h"}  # kept the char, dropped "hi"' },
      fix:   { label: 'Wrap it',            code: 's.intersection_update(["hi"])', output: '{"hi"}  # kept the string' },
    },
  ],

  when: {
    use: [
      'Narrowing a set to an allowlist',
      'Progressive filtering through multiple constraints',
      'Building a &quot;kept&quot; state from a candidate pool',
      'In-place refinement without allocating a new set',
    ],
    avoid: [
      'You need a new set — use `&` or `intersection()` for a pure result',
      'You want elements in either — use `|` or union',
      'Empty iterable should NOT clear the set → guard first',
      'Non-hashable elements → filter or convert to tuples first',
    ],
  },

  notes: {
    complexity: 'O(min(m, n)) — proportional to the smaller of set and iterable size',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_intersection_update',
    memory:     'Usually shrinks; hash table capacity may be reduced',
    threadSafe: 'Not safe under concurrent iteration or mutation',
  },

  related: [
    { name: 'set.intersection',            slug: 'set-intersection',            when: 'Pure form — returns a new set' },
    { name: 'set.update',                  slug: 'set-update',                  when: 'Add-in-place (union) counterpart' },
    { name: 'set.difference_update',       slug: 'set-difference_update',       when: 'Remove-in-place counterpart' },
    { name: 'set.isdisjoint',              slug: 'set-isdisjoint',              when: 'Check whether the intersection would be empty' },
  ],

  faq: [
    {
      q: 'What is the difference between intersection_update() and &= ?',
      a: 'For a set on the right, they are equivalent: `s &= t` calls `s.intersection_update(t)`. But intersection_update accepts ANY iterable (list, string, generator) and multiple iterables in one call. `&=` requires a set on the right.',
    },
    {
      q: 'What happens when I pass no iterables?',
      a: 'The set is unchanged. `s.intersection_update()` is a no-op — there is no restriction applied.',
    },
    {
      q: 'What is the pattern shared by all the *_update methods?',
      a: 'Every set operator has an in-place *_update variant: update (union), difference_update, intersection_update, symmetric_difference_update. All accept any iterable, return None, and mutate the set.',
    },
  ],

  history: [
    { version: '2.6', note: 'intersection_update() supports multiple *args of iterables.' },
    { version: '2.3', note: 'set added as a builtin type with intersection_update().' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.intersection_update',
    meta:  'set.intersection_update',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set data' },
  ],
};