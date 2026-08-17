// content/reference/python/functions/set-clear.js
//
// Slug is type-prefixed: `clear` is a set method.

export const meta = {
  slug:        'set-clear',
  name:        'set.clear',
  signature:   'set.clear()',
  blurb:       'Remove all elements in place — every reference sees the set become empty.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'clear empty reset set wipe delete all elements purge reset state mutate',
};

export const method = {
  slug:      'set-clear',
  name:      'set.clear',
  signature: 'set.clear()',
  returns:   { type: 'None', desc: 'Returns None. The set is mutated in place — every reference (aliases, closures, container elements) now sees an empty set. This is the key difference from rebinding with `s = set()`.' },

  category:    'Set method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Empty the set in place — the SAME object becomes empty. All references see the change.',

  cheat: {
    commonCall: 'seen.clear()',
    returns:    'None — set is empty afterwards',
    replaces:   'a loop of `s.discard(x)` calls, or `s -= s.copy()`',
    watchOut:   'different from `s = set()` — clear mutates every reference; `= set()` rebinds only the local name',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'set', type: 'set', hint: 'comma-separated elements', input: 'csv-set' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { set: 'a,b,c' } },
    { id: 'numbers',  label: 'numbers',         values: { set: '1,2,3,4,5' } },
    { id: 'one',      label: 'single element',  values: { set: 'only' } },
    { id: 'already',  label: 'already empty',   values: { set: '' } },
    { id: 'dup-input',label: 'dupes in input',  values: { set: 'a,a,b,b,c' } },
  ],
  demoExplainer: 'clear empties the set in place. Python actually returns None; the demo shows the resulting state (always empty) so you can see the effect. The subtle and important thing NOT visible here: any other name pointing at the same set sees the change too. That is the difference from `s = set()`, which only rebinds the local name.',

  patterns: [
    {
      name: 'Reset a &quot;seen&quot; set between passes',
      desc: 'Every consumer holding a reference to `seen` sees the empty state immediately.',
      code: 'def run(passes):\n    for _ in range(passes):\n        seen.clear()\n        process(seen)',
    },
    {
      name: 'Drain then repopulate',
      desc: 'Preserve identity of a shared set while replacing its contents.',
      code: 'shared_set.clear()\nshared_set.update(new_values)',
    },
    {
      name: 'Empty a nested set without breaking outer references',
      desc: 'clear on the inner set keeps the outer structure intact.',
      code: 'user["blocked"].clear()   # blocked set empties, user still points at it',
    },
  ],

  examples: [
    { title: 'Basic',                  code: 's = {1, 2, 3}\ns.clear()\ns',      returns: 'set()' },
    { title: 'Already empty',          code: 'set().clear()',                     returns: 'None  # no error' },
    { title: 'Returns None',           code: '{"a", "b"}.clear()',                returns: 'None' },
    { title: 'Affects all references', code: 's = {1, 2}\nt = s\ns.clear()\nt', returns: 'set()  # t sees the change too' },
    { title: 'Assignment does NOT',    code: 's = {1, 2}\nt = s\ns = set()\nt',   returns: '{1, 2}  # t still points at the original' },
  ],

  pitfalls: [
    {
      name: 'clear() is NOT the same as `s = set()`',
      desc: 'clear mutates the existing set — every reference sees it become empty. `s = set()` creates a NEW empty set and rebinds the local name; every other reference still points at the original (which is unchanged).',
      wrong: { label: 'Rebind misses aliases', code: 'shared = {1, 2, 3}\nlocal = shared\nshared = set()\nlocal', output: '{1, 2, 3}  # aliases still see the old data' },
      fix:   { label: 'clear reaches everyone', code: 'shared = {1, 2, 3}\nlocal = shared\nshared.clear()\nlocal', output: 'set()  # every alias sees empty' },
    },
    {
      name: 'The `s = s.clear()` bug',
      desc: 'clear() returns None. Assigning its result back sets your variable to None — the same class of bug as add, discard, and remove.',
      wrong: { label: 'Now s is None', code: 's = {1, 2}\ns = s.clear()\nprint(s)', output: 'None' },
      fix:   { label: 'Just clear',    code: 's.clear()   # mutate, keep name', output: 'set()' },
    },
    {
      name: 'Clearing while iterating raises',
      desc: 'Modifying the set during iteration is a RuntimeError, and clear is a modification.',
      wrong: { label: 'Runtime error', code: 'for x in s:\n    if predicate(x):\n        s.clear()', output: 'RuntimeError: Set changed size during iteration' },
      fix:   { label: 'Iterate a snapshot', code: 'for x in list(s):\n    ...', output: 'safe' },
    },
    {
      name: 'frozenset has NO clear() — it is immutable',
      desc: 'frozenset is the read-only sibling. Calling clear on a frozenset raises AttributeError. To &quot;clear&quot; a frozenset, replace it with an empty frozenset.',
      wrong: { label: 'AttributeError', code: 'frozenset([1, 2]).clear()', output: "AttributeError: 'frozenset' object has no attribute 'clear'" },
      fix:   { label: 'Rebind',         code: 'fs = frozenset()', output: 'a fresh empty frozenset' },
    },
  ],

  when: {
    use: [
      'Resetting a shared / module-level / cache set without rebinding',
      'Preparing a container between test runs or workflow stages',
      'Emptying a nested set without breaking outer references',
      'Any &quot;empty this and keep the identity&quot; requirement',
    ],
    avoid: [
      'You want a fresh, independent empty set → `s = set()`',
      'You have a specific element to remove → set.discard / set.remove',
      'Iterating and removing selectively → build a new set with a comprehension',
      'frozenset — no clear method exists',
    ],
  },

  notes: {
    complexity: 'O(n) — walks and releases every entry',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_clear',
    memory:     'Frees entries; the hash table itself may keep some capacity',
    threadSafe: 'Not safe under concurrent iteration or mutation',
  },

  related: [
    { name: 'dict.clear',    slug: 'dict-clear',    when: 'The analogous method for dict' },
    { name: 'set.discard',   slug: 'set-discard',   when: 'Silent removal of a specific element' },
    { name: 'set.remove',    slug: 'set-remove',    when: 'Strict removal of a specific element' },
    { name: 'set.pop',       slug: 'set-pop',       when: 'Remove one arbitrary element rather than all' },
  ],

  faq: [
    {
      q: 'What is the difference between clear() and `s = set()`?',
      a: 'clear() mutates the SAME set — every reference to it sees it become empty. `s = set()` creates a NEW empty set and rebinds just the local name; every other reference still points at the original.',
    },
    {
      q: 'Does clear() free memory?',
      a: 'It releases the entries, but the underlying hash table may retain some capacity for future growth. If you need to reclaim memory too, replace the set with a new empty one where you can (and let the old one be garbage collected).',
    },
    {
      q: 'Can I clear a frozenset?',
      a: 'No — frozenset is immutable and has no clear method. Rebind the name to an empty frozenset instead.',
    },
  ],

  history: [
    { version: '2.6', note: 'clear() added to set.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.clear',
    meta:  'set.clear',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};