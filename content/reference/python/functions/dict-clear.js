// content/reference/python/functions/dict-clear.js
//
// Slug is type-prefixed: `clear` is a dict method.

export const meta = {
  slug:        'dict-clear',
  name:        'dict.clear',
  signature:   'dict.clear()',
  blurb:       'Remove all items in place — every reference to the dict sees it become empty.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'clear empty reset dict wipe delete all items purge reset state mutate',
};

export const method = {
  slug:      'dict-clear',
  name:      'dict.clear',
  signature: 'dict.clear()',
  returns:   { type: 'None', desc: 'Returns None. The dict is mutated in place — every reference (aliases, closures, container elements) now sees an empty dict. This is the key difference from rebinding with `d = {}`.' },

  category:    'Dict method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Empty the dict in place — the SAME object becomes empty. All references see the change.',

  cheat: {
    commonCall: 'cache.clear()',
    returns:    'None — dict is empty afterwards',
    replaces:   '`for k in list(d): del d[k]` — but clearer and faster',
    watchOut:   'different from `d = {}` — clear mutates every reference; `= {}` rebinds only the local name',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'dict', type: 'dict', hint: 'key: value pairs', input: 'kv' },
  ],
  cases: [
    { id: 'basic',   label: 'basic',           values: { dict: 'a: 1, b: 2, c: 3' } },
    { id: 'one',     label: 'single pair',     values: { dict: 'only: 42' } },
    { id: 'already', label: 'already empty',   values: { dict: '' } },
    { id: 'strings', label: 'string values',   values: { dict: 'name: alice, role: admin' } },
    { id: 'ordered', label: 'insertion order', values: { dict: 'z: 1, a: 2, m: 3' } },
  ],
  demoExplainer: 'clear empties the dict in place. Python actually returns None; the demo shows the resulting state (always empty) so you can see the effect. The subtle and important thing NOT visible here: any other name pointing at the same dict object sees the change too. That is the difference from `d = {}`, which only rebinds the local name.',

  patterns: [
    {
      name: 'Reset a cache',
      desc: 'Every consumer holding a reference sees the empty cache immediately.',
      code: 'shared_cache.clear()',
    },
    {
      name: 'Between test runs',
      desc: 'Empty a module-level dict without swapping it out.',
      code: 'def setup():\n    STATE.clear()\n    STATE.update(defaults)',
    },
    {
      name: 'Empty a nested dict without breaking outer references',
      desc: 'clear on the inner dict keeps the outer structure intact.',
      code: 'user["profile"].clear()   # profile dict empties, user still points at it',
    },
  ],

  examples: [
    { title: 'Basic',              code: 'd = {"a": 1, "b": 2}\nd.clear()\nd',      returns: '{}' },
    { title: 'Already empty',      code: '{}.clear()',                                returns: 'None  # no error' },
    { title: 'Returns None',       code: '{"a": 1}.clear()',                          returns: 'None' },
    { title: 'Affects all references', code: 'd = {"a": 1}\ne = d\nd.clear()\ne',        returns: '{}  # e sees the change too' },
    { title: 'Assignment does NOT',    code: 'd = {"a": 1}\ne = d\nd = {}\ne',            returns: '{"a": 1}  # e still points at the original' },
  ],

  pitfalls: [
    {
      name: 'clear() is NOT the same as `d = {}`',
      desc: 'clear mutates the existing dict — every reference sees it become empty. `d = {}` creates a NEW empty dict and rebinds the local name; every other reference still points at the original (which is unchanged).',
      wrong: { label: 'Rebind misses aliases', code: 'shared = {"count": 5}\nlocal = shared\nshared = {}\nlocal', output: '{"count": 5}  # aliases still see the old data' },
      fix:   { label: 'clear reaches everyone', code: 'shared = {"count": 5}\nlocal = shared\nshared.clear()\nlocal', output: '{}  # every alias sees empty' },
    },
    {
      name: 'The `d = d.clear()` bug',
      desc: 'clear() returns None. Assigning its result back sets your variable to None — the same class of bug as sort, extend, and update.',
      wrong: { label: 'Now d is None', code: 'd = {"a": 1}\nd = d.clear()\nprint(d)', output: 'None' },
      fix:   { label: 'Just clear',    code: 'd.clear()   # mutate, keep name', output: '{}' },
    },
    {
      name: 'Clearing while iterating raises',
      desc: 'Modifying the dict during iteration is a RuntimeError, and clear is a modification.',
      wrong: { label: 'Runtime error', code: 'for k in d:\n    if predicate(k):\n        d.clear()', output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'Iterate a snapshot', code: 'for k in list(d):\n    ...', output: 'safe' },
    },
    {
      name: 'Views held elsewhere become empty views',
      desc: 'A dict_keys / dict_values / dict_items view is a live view. After clear(), any held view iterates nothing.',
      wrong: { label: 'View empty after clear', code: 'k = d.keys()\nlist(k)     # ["a", "b"]\nd.clear()\nlist(k)     # []', output: 'the view is live; it reflects the empty state' },
      fix:   { label: 'Snapshot for isolation', code: 'k = list(d.keys())\nd.clear()\nk           # ["a", "b"] — a list, not a view', output: 'unchanged' },
    },
  ],

  when: {
    use: [
      'Resetting a shared / module-level / cache dict without rebinding',
      'Preparing a container between test runs or workflow stages',
      'Emptying a nested dict without breaking outer references',
      'Any &quot;empty this and keep the identity&quot; requirement',
    ],
    avoid: [
      'You want a fresh, independent empty dict → `d = {}`',
      'You have a specific key to remove → dict.pop / del d[key]',
      'Iterating and removing selectively → build a new dict with a comprehension',
      'You need to record what was cleared → snapshot before clearing',
    ],
  },

  notes: {
    complexity: 'O(n) — walks and releases every entry',
    return:     'None; the dict is mutated in place',
    cpython:    'Objects/dictobject.c :: dict_clear',
    memory:     'Frees entries; the hash table itself may keep some capacity',
    threadSafe: 'Not safe under concurrent iteration or mutation',
  },

  related: [
    { name: 'dict.pop',        slug: 'dict-pop',    when: 'Remove and return a specific value' },
    { name: 'dict.copy',       slug: 'dict-copy',   when: 'Snapshot before clearing for rollback' },
    { name: 'dict.update',     slug: 'dict-update', when: 'Replace all contents by clearing then updating' },
    { name: 'list.copy',       slug: 'list-copy',   when: 'The analogous pattern for lists' },
  ],

  faq: [
    {
      q: 'What is the difference between clear() and `d = {}`?',
      a: 'clear() mutates the SAME dict — every reference to it sees it become empty. `d = {}` creates a NEW empty dict and rebinds just the local name; every other reference still points at the original.',
    },
    {
      q: 'Does clear() free memory?',
      a: 'It releases the entries, but the underlying hash table may retain some capacity for future growth. If you need to reclaim memory too, replace the dict with a new empty one where you can (and let the old one be garbage collected).',
    },
    {
      q: 'Can I chain clear() with another call?',
      a: 'Not directly — clear returns None, so `d.clear().update(...)` fails. Do the two calls on separate lines.',
      code: 'd.clear()\nd.update(new_contents)',
    },
  ],

  history: [
    { version: '1.0', note: 'clear() has been part of dict since Python 1.0.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.clear',
    meta:  'dict.clear',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
  ],
};