// content/reference/python/functions/set-copy.js
//
// Slug is type-prefixed: `copy` is a set method.

export const meta = {
  slug:        'set-copy',
  name:        'set.copy',
  signature:   'set.copy()',
  blurb:       'Shallow copy — new set, same element references.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'copy set shallow duplicate clone new independent references',
};

export const method = {
  slug:      'set-copy',
  name:      'set.copy',
  signature: 'set.copy()',
  returns:   { type: 'set', desc: 'A NEW set with the same elements. The set itself is independent — mutating one does not affect the other. But the ELEMENT REFERENCES are shared; because set elements must be hashable (and hashables are usually immutable), this rarely matters in practice.' },

  category:    'Set method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Return a shallow copy of the set. New container, same element references — but since set elements must be hashable, the copy is effectively independent for the usual cases.',

  cheat: {
    commonCall: 'backup = seen.copy()',
    returns:    'a new set — mutations to either do not affect the other',
    replaces:   '`set(s)` and `{*s}` — all three are equivalent shallow copies',
    watchOut:   'shallow only — but hashable elements make this an effectively deep copy for typical set contents',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'set', type: 'set', hint: 'comma-separated elements', input: 'csv-set' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { set: 'a,b,c' } },
    { id: 'numbers',  label: 'numbers',         values: { set: '1,2,3,4' } },
    { id: 'one',      label: 'single element',  values: { set: 'only' } },
    { id: 'empty',    label: 'empty set',       values: { set: '' } },
    { id: 'dup-input',label: 'dupes collapse',  values: { set: 'a,a,b,b,c' } },
  ],
  demoExplainer: 'The demo shows the copied set — for the hashable values passed here, the copy is functionally independent of the original. Set elements must be hashable, and hashables are almost always immutable, so the shallow / deep distinction that bites dict and list users rarely bites set users. The important guarantee: the copy is a DIFFERENT set object; mutating one does not affect the other.',

  patterns: [
    {
      name: 'Snapshot before mutating',
      desc: 'Keep the original for comparison or rollback.',
      code: 'before = state.copy()\nstate.update(new_items)\nadded = state - before',
    },
    {
      name: 'Independent per-caller copies',
      desc: 'Give each recipient its own set so they can mutate freely.',
      code: 'default_tags = {"prod", "cache"}\ndef make_tags():\n    return default_tags.copy()',
    },
    {
      name: 'Three equivalent forms',
      desc: 'All three shallow-copy — pick one and stay consistent.',
      code: 's.copy()\nset(s)\n{*s}',
    },
  ],

  examples: [
    { title: 'Basic',              code: 's = {1, 2}\nt = s.copy()\nt.add(3)\ns',  returns: '{1, 2}  # original untouched' },
    { title: 'Empty',              code: 'set().copy()',                             returns: 'set()' },
    { title: 'Equivalent forms',   code: 's.copy() == set(s) == {*s}',               returns: 'True  # all three are shallow copies' },
    { title: 'Identity is fresh',  code: 's = {1, 2}\nt = s.copy()\nt is s',        returns: 'False  # equal but not the same object' },
    { title: 'Frozenset copy',     code: 'fs = frozenset({1, 2})\nfs.copy()',        returns: 'frozenset({1, 2})' },
  ],

  pitfalls: [
    {
      name: 'copy() vs the `=` assignment',
      desc: 'Assignment does NOT copy — it makes another name for the same set. Mutating either name mutates the same object. A common bug when passing sets between functions.',
      wrong: { label: 'Alias, not copy', code: 's = {1, 2}\nt = s\nt.add(3)\ns', output: '{1, 2, 3}  # s changed too' },
      fix:   { label: 'Explicit copy',   code: 's = {1, 2}\nt = s.copy()\nt.add(3)\ns', output: '{1, 2}  # s untouched' },
    },
    {
      name: 'Still shallow — but rarely matters for sets',
      desc: 'Elements are shared references, but set elements must be hashable, and hashables are almost always immutable. There is no practical mutable-element case for sets like there is for dict values.',
      wrong: { label: 'Cannot store a list',   code: '{[1, 2]}.copy()', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Use tuples inside',     code: '{(1, 2)}.copy()', output: 'shallow is deep enough' },
    },
    {
      name: 'Three ways to shallow-copy — pick one for consistency',
      desc: '`s.copy()`, `set(s)`, and `{*s}` all produce shallow copies. They differ in the reader&apos;s intent and in some subclass edge cases: set(s) always returns a plain set; s.copy() preserves the subclass in most cases.',
      wrong: { label: 'Random mix', code: 'a = s.copy()\nb = set(s)\nc = {*s}\n# same result, three styles', output: 'inconsistent house style' },
      fix:   { label: 'Pick one',   code: 'copy_of_s = s.copy()   # or {*s}, whichever your style guide picks', output: 'consistent' },
    },
    {
      name: 'frozenset.copy() may return SELF',
      desc: 'Because frozenset is immutable, CPython optimizes `.copy()` to return the same object — no new allocation. `is` returns True. This is not a bug and does not matter for correctness, but can surprise identity-checking tests.',
      wrong: { label: 'Same object', code: 'fs = frozenset({1, 2})\nfs.copy() is fs', output: 'True  # optimization' },
      fix:   { label: 'Test equality not identity', code: 'fs.copy() == fs', output: 'True' },
    },
  ],

  when: {
    use: [
      'Snapshotting a set before mutating for rollback or diff',
      'Giving each caller its own set to mutate freely',
      'Any &quot;same members, different object&quot; workflow',
      'Composing with update() or `-=` to build modified copies without touching the source',
    ],
    avoid: [
      'Rebinding is enough — you never mutate → `=` assignment is cheaper',
      'Duplicating for read-only iteration only → no copy needed at all',
      'Very large sets where the shallow copy is a hot-path allocation',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the elements',
    return:     'A new set of the same type; elements are the same object references',
    cpython:    'Objects/setobject.c :: set_copy — frozenset optimizes to return self',
    memory:     'Allocates a new set; elements are not deep-copied (usually irrelevant since they must be hashable)',
    threadSafe: 'The copy operation is safe against concurrent reads; not safe under concurrent writes',
  },

  related: [
    { name: 'set.union',       slug: 'set-union',       when: 'Combine two sets — pure' },
    { name: 'set.intersection',slug: 'set-intersection',when: 'Take the overlap — pure' },
    { name: 'dict.copy',       slug: 'dict-copy',       when: 'Same shallow-copy pattern for dicts' },
    { name: 'list.copy',       slug: 'list-copy',       when: 'Same shallow-copy pattern for lists' },
  ],

  faq: [
    {
      q: 'Is s.copy() the same as set(s)?',
      a: 'Effectively yes for a plain set — both are shallow copies. set(s) always returns a plain set; s.copy() and {*s} may preserve the subclass. Pick one style and stay consistent.',
    },
    {
      q: 'Do I need copy.deepcopy for sets?',
      a: 'Almost never. Set elements must be hashable, and hashable objects in Python are almost always immutable — there is nothing inside to mutate through the shared reference. copy() is enough.',
    },
    {
      q: 'Why does frozenset.copy() return self?',
      a: 'frozenset is immutable, so a copy is indistinguishable from the original for all practical purposes. CPython optimizes by returning the same object — saves an allocation. Behavior is identical whether or not the object is the same.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added with copy() method.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.copy',
    meta:  'set.copy',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};