// content/reference/python/functions/set-difference_update.js
//
// Slug is type-prefixed: `difference_update` is a set method.

export const meta = {
  slug:        'set-difference_update',
  name:        'set.difference_update',
  signature:   'set.difference_update(*others)',
  blurb:       'Remove every element that appears in the given iterables — in place.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'difference_update set remove subtract in place mutate none minus except drop',
};

export const method = {
  slug:      'set-difference_update',
  name:      'set.difference_update',
  signature: 'set.difference_update(*others)',
  returns:   { type: 'None', desc: 'Returns None. The set is mutated in place — every element that appears in any of the given iterables is removed. Equivalent to `s -= set(other1) | set(other2) | ...` but takes any iterables, not just sets.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The in-place difference — remove every element that appears in the given iterable(s). The bulk cousin of discard().',

  cheat: {
    commonCall: 'seen.difference_update(blocked)',
    returns:    'None — set is mutated with the removals',
    replaces:   'a loop of `s.discard(x) for x in iterable`',
    watchOut:   'accepts any iterable; elements not present are silently skipped (like discard, not remove)',
  },

  parameters: [
    { name: '*others', type: 'iterable', required: false, default: '()', desc: 'Zero or more iterables. Every element appearing in any of them is removed from the set (if present).' },
  ],

  demoParams: [
    { name: 'set',   type: 'set', hint: 'existing elements',           input: 'csv' },
    { name: 'other', type: 'set', hint: 'items to remove (iterable)',  input: 'csv' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { set: '1,2,3,4',    other: '2,4' } },
    { id: 'overlap',  label: 'partial overlap', values: { set: 'a,b,c,d',    other: 'c,d,e,f' } },
    { id: 'disjoint', label: 'no overlap',      values: { set: '1,2,3',      other: '4,5,6' } },
    { id: 'all-gone', label: 'other has all',   values: { set: 'a,b',        other: 'a,b,c,d' } },
    { id: 'empty-other',label: 'other empty',   values: { set: 'a,b,c',      other: '' } },
    { id: 'empty-self', label: 'self empty',    values: { set: '',           other: 'x,y,z' } },
  ],
  demoExplainer: 'difference_update mutates the set in place. Real Python returns None; the demo shows the RESULTING state so the effect is visible. Every element that appears in the iterable is removed from the set. Elements in the iterable that are NOT in the set are silently ignored — no KeyError. The iterable can be any iterable, not just another set.',

  patterns: [
    {
      name: 'Remove a batch of items',
      desc: 'Drop many elements from any iterable in one call.',
      code: 'seen.difference_update(retired_ids)',
    },
    {
      name: 'Multiple iterables at once',
      desc: 'difference_update takes *args — remove from any of several sources.',
      code: 'active.difference_update(banned, expired, deleted)',
    },
    {
      name: 'The operator alternative',
      desc: '`-=` is equivalent when the RHS is a set. difference_update is more flexible.',
      code: 's -= other_set                # requires a set\ns.difference_update(iterable)  # any iterable',
    },
    {
      name: 'Purge by predicate',
      desc: 'Compute the to-remove set lazily, then subtract in place.',
      code: 's.difference_update(x for x in s if is_stale(x))',
    },
  ],

  examples: [
    { title: 'Basic',                code: 's = {1, 2, 3, 4}\ns.difference_update([2, 4])\ns', returns: '{1, 3}' },
    { title: 'Partial overlap',      code: '{"a", "b", "c"}.difference_update({"c", "d"})',   returns: '{"a", "b"}' },
    { title: 'No overlap silent',    code: '{1, 2}.difference_update({3, 4})',                 returns: '{1, 2}  # no error' },
    { title: 'Removes all',          code: '{"x"}.difference_update(["x"])',                    returns: 'set()' },
    { title: 'Multiple iterables',   code: 's.difference_update([1, 2], [3, 4])',                returns: 'removes 1,2,3,4' },
    { title: 'Returns None',         code: '{1, 2}.difference_update([1])',                      returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'difference_update() returns None — do NOT assign the result',
      desc: 'Same rule as every set mutation. Assigning the result sets your variable to None.',
      wrong: { label: 'Assigned None', code: 's = s.difference_update(other)', output: 's is now None' },
      fix:   { label: 'Just call it',   code: 's.difference_update(other)', output: 's is the updated set' },
    },
    {
      name: 'Cannot iterate over set while mutating it',
      desc: 'A subtle trap: passing the same set as the iterable would mutate what you are iterating. Python detects this and raises. Use a snapshot or a comprehension.',
      wrong: { label: 'Self mutation', code: 's.difference_update(s)', output: 'set() — but risky pattern' },
      fix:   { label: 'Snapshot',      code: 's.difference_update(list(s))', output: 'set() — clear intent' },
    },
    {
      name: 'Silent on missing elements — no KeyError',
      desc: 'Unlike set.remove(), difference_update silently ignores elements not in the set. This is usually the desired behavior for &quot;bulk remove&quot; but can hide bugs when you expected the element to be present.',
      wrong: { label: 'Silent skip', code: '{"a"}.difference_update(["z"])', output: '{"a"}  # z was not there, ignored' },
      fix:   { label: 'Check before if you care', code: 'missing = set(target) - s\nif missing:\n    log.warning(...)', output: '' },
    },
    {
      name: 'A string is a sequence of characters',
      desc: 'Passing a string removes each CHARACTER, not the string as a whole. Wrap in a list to target the string itself.',
      wrong: { label: 'Broken into chars', code: 's = {"h", "i", "no"}\ns.difference_update("hi")', output: '{"no"}  # removed "h" and "i"' },
      fix:   { label: 'Wrap it',            code: 's.difference_update(["hi"])', output: 'unchanged if "hi" not in s' },
    },
  ],

  when: {
    use: [
      'Removing many elements from a set given an iterable',
      'Subtracting multiple sources in one call',
      'Building a &quot;keep&quot; state by removing everything else',
      'When silence on missing elements is desired (unlike remove())',
    ],
    avoid: [
      'You need a new set — use `-` or `difference()` for a pure result',
      'One element at a time → discard() is clearer',
      'You need a KeyError on missing → build the check yourself first',
      'You need to iterate over the removed items → compute the diff explicitly',
    ],
  },

  notes: {
    complexity: 'O(m) — proportional to the size of the iterable(s)',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_difference_update',
    memory:     'May shrink the hash table; usually keeps capacity',
    threadSafe: 'Not safe under concurrent iteration or mutation',
  },

  related: [
    { name: 'set.difference',      slug: 'set-difference',      when: 'Pure form — returns a new set' },
    { name: 'set.discard',         slug: 'set-discard',         when: 'Remove a single element silently' },
    { name: 'set.remove',          slug: 'set-remove',          when: 'Remove a single element, raise if missing' },
    { name: 'set.update',          slug: 'set-update',          when: 'Add-in-place counterpart' },
  ],

  faq: [
    {
      q: 'What is the difference between difference_update() and -= ?',
      a: 'For a set on the right, they are equivalent: `s -= t` calls `s.difference_update(t)`. But difference_update accepts ANY iterable (list, string, generator) and multiple iterables in one call. `-=` requires a set on the right.',
    },
    {
      q: 'Does difference_update raise on missing elements?',
      a: 'No. Missing elements are silently ignored — same behavior as discard(). This is often what you want for &quot;bulk remove&quot; workflows.',
    },
    {
      q: 'What is the pattern shared by all the *_update methods?',
      a: 'Every set operator has an in-place *_update variant: update (union), difference_update, intersection_update, symmetric_difference_update. All accept any iterable, return None, and mutate the set. The `_update` suffix consistently means &quot;in place, returns None&quot;.',
    },
  ],

  history: [
    { version: '2.6', note: 'difference_update() supports multiple *args of iterables.' },
    { version: '2.3', note: 'set added as a builtin type with difference_update().' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.difference_update',
    meta:  'set.difference_update',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set data' },
  ],
};